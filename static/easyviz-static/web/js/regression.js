// Tiny OLS + Pearson-r implementation for the Compare → Regression tab.
//
// Chart.js has no built-in trendline, so we fit the line ourselves and
// render it as a second scatter series whose points are the endpoints.
// LOWESS (which the Streamlit version uses via statsmodels) is omitted
// — the sample sizes are small enough (~200 points) that a single OLS
// line is usually what the reader wants anyway.

export function olsFit(points) {
  const n = points.length;
  if (n < 2) return null;
  let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
  for (const { x, y } of points) {
    sx += x; sy += y;
    sxx += x * x; syy += y * y;
    sxy += x * y;
  }
  const denom = n * sxx - sx * sx;
  if (denom === 0) return null;
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;

  // r²
  const meanY = sy / n;
  let ssTot = 0, ssRes = 0;
  for (const { x, y } of points) {
    const pred = intercept + slope * x;
    ssTot += (y - meanY) ** 2;
    ssRes += (y - pred) ** 2;
  }
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  const xs = points.map(p => p.x);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  return {
    slope,
    intercept,
    r2,
    n,
    line: [
      { x: xMin, y: intercept + slope * xMin },
      { x: xMax, y: intercept + slope * xMax },
    ],
  };
}

export function fmtFit(fit) {
  if (!fit) return "not enough data";
  return `slope = ${fit.slope.toFixed(3)} · intercept = ${fit.intercept.toFixed(2)} · R² = ${fit.r2.toFixed(3)} · n = ${fit.n}`;
}
