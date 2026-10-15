// Tiny OLS + Pearson-r implementation for the Compare → Regression tab.
//
// Chart.js has no built-in trendline, so we fit the line ourselves and
// render it as a second scatter series whose points are the endpoints.
// LOWESS (which the Streamlit version uses via statsmodels) is omitted
// — the sample sizes are small enough (~200 points) that a single OLS
// line is usually what the reader wants anyway.
//
// Inference uses HC1 heteroskedasticity-robust standard errors
// (White 1980 with the n/(n-k) small-sample factor) and a Student-t
// with n-2 df — identical to R `lmtest::coeftest(fit, sandwich::vcovHC(
// fit, type = "HC1"))` and statsmodels `fit(cov_type="HC1", use_t=True)`.
//
// With `logX` / `logY` the fit is on natural logs (ln y = a + b ln x is an
// elasticity); non-positive values are dropped and counted in `dropped`.
// `line` endpoints are back-transformed to raw units so they plot as a
// straight line on the matching log axes.

// Regularized incomplete beta I_x(a, b) (Numerical Recipes 6.4, Lentz).
function lnGamma(z) {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
             -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let x = z, y = z, tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (const ci of c) ser += ci / ++y;
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

function betacf(a, b, x) {
  const EPS = 3e-14, FPMIN = 1e-300;
  let c = 1, d = 1 - (a + b) * x / (a + 1);
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((a - 1 + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d; h *= d * c;
    aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + 1 + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

function ibeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b)
                      + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2)
    ? bt * betacf(a, b, x) / a
    : 1 - bt * betacf(b, a, 1 - x) / b;
}

// Two-sided p-value for a t statistic with `df` degrees of freedom.
export function tPValue(t, df) {
  return ibeta(df / (df + t * t), df / 2, 0.5);
}

// Two-sided critical value t_{1-alpha/2, df} by bisection on tPValue.
export function tCrit(df, alpha = 0.05) {
  let lo = 0, hi = 1000;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (tPValue(mid, df) > alpha) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

export function olsFit(points, { logX = false, logY = false } = {}) {
  const usable = points.filter(p =>
    Number.isFinite(p.x) && Number.isFinite(p.y) &&
    (!logX || p.x > 0) && (!logY || p.y > 0));
  const dropped = points.length - usable.length;
  const pts = usable.map(p => ({ x: logX ? Math.log(p.x) : p.x, y: logY ? Math.log(p.y) : p.y }));
  const n = pts.length;
  if (n < 3) return null;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const { x, y } of pts) {
    sx += x; sy += y;
    sxx += x * x;
    sxy += x * y;
  }
  const denom = n * sxx - sx * sx;
  if (denom === 0) return null;
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;

  // r² and the HC1 sandwich: V = n/(n-2) · (X'X)⁻¹ X' diag(e²) X (X'X)⁻¹.
  const meanY = sy / n;
  let ssTot = 0, ssRes = 0, m00 = 0, m01 = 0, m11 = 0;
  for (const { x, y } of pts) {
    const e = y - (intercept + slope * x);
    ssTot += (y - meanY) ** 2;
    ssRes += e * e;
    m00 += e * e; m01 += x * e * e; m11 += x * x * e * e;
  }
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  // (X'X)⁻¹ = [[sxx, -sx], [-sx, n]] / denom
  const b00 = sxx / denom, b01 = -sx / denom, b11 = n / denom;
  const hc = n / (n - 2);
  const varA = hc * (b00 * b00 * m00 + 2 * b00 * b01 * m01 + b01 * b01 * m11);
  const varB = hc * (b01 * b01 * m00 + 2 * b01 * b11 * m01 + b11 * b11 * m11);
  const df = n - 2;
  const crit = tCrit(df);
  const coef = (est, v) => {
    const se = Math.sqrt(v), t = est / se;
    return { est, se, t, p: tPValue(Math.abs(t), df), ci: [est - crit * se, est + crit * se] };
  };

  const xs = pts.map(p => p.x);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const back = (x, y) => ({ x: logX ? Math.exp(x) : x, y: logY ? Math.exp(y) : y });
  return {
    slope,
    intercept,
    r2,
    n,
    df,
    dropped,
    logX, logY,
    slopeStats: coef(slope, varB),
    interceptStats: coef(intercept, varA),
    line: [
      back(xMin, intercept + slope * xMin),
      back(xMax, intercept + slope * xMax),
    ],
  };
}

const sig = (v, d = 3) => Number.isFinite(v) ? v.toLocaleString("en-US", { minimumSignificantDigits: d, maximumSignificantDigits: d }) : "—";
const fmtP = (p) => p < 0.001 ? "< 0.001" : p.toFixed(3);

export function fmtFit(fit) {
  if (!fit) return "not enough data";
  const s = fit.slopeStats;
  const lhs = `${fit.logY ? "ln y" : "y"} on ${fit.logX ? "ln x" : "x"}`;
  return `${lhs}: slope = ${sig(s.est)} (HC1 SE ${sig(s.se, 2)}) · 95% CI [${sig(s.ci[0])}, ${sig(s.ci[1])}]` +
    ` · t = ${s.t.toFixed(2)}, p ${fit.slopeStats.p < 0.001 ? "" : "= "}${fmtP(s.p)}` +
    ` · intercept = ${sig(fit.intercept)} (SE ${sig(fit.interceptStats.se, 2)})` +
    ` · R² = ${fit.r2.toFixed(3)} · n = ${fit.n}` +
    (fit.dropped ? ` · ${fit.dropped} non-positive obs dropped for log` : "");
}
