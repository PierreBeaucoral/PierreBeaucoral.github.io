// Temporal and entity aggregation helpers.
//
// Input: an array of rows like { iso3, country, year, value } (the shape
// fetchSeries() returns). Functions are pure — they return a new array.
// Numerical correctness is validated against R equivalents (see
// README.md § "Cross-language validation").

// ── Internal helpers ────────────────────────────────────────────────────

function groupByCountry(rows) {
  const by = new Map();
  for (const r of rows) {
    if (!by.has(r.iso3)) by.set(r.iso3, []);
    by.get(r.iso3).push(r);
  }
  for (const rs of by.values()) rs.sort((a, b) => a.year - b.year);
  return by;
}

function groupByYear(rows) {
  const by = new Map();
  for (const r of rows) {
    if (!by.has(r.year)) by.set(r.year, []);
    by.get(r.year).push(r);
  }
  return by;
}

function mean(arr) {
  if (!arr.length) return NaN;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function median(arr) {
  if (!arr.length) return NaN;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// ── Temporal transforms ─────────────────────────────────────────────────
//
// Each method applies per-country (preserving the panel). Return rows
// have the same schema; year metadata may shift (e.g. decade means).

export function aggregateTime(rows, opts = {}) {
  const method = opts.method || "none";
  if (!rows.length || method === "none") return rows;

  const byC = groupByCountry(rows);
  const out = [];

  for (const [iso3, series] of byC) {
    const country = series[0].country;

    if (method === "ma5") {
      // 5-year centered moving average (window = 5, min_periods = 3).
      for (let i = 0; i < series.length; i++) {
        const lo = Math.max(0, i - 2), hi = Math.min(series.length - 1, i + 2);
        const window = series.slice(lo, hi + 1).map(r => r.value);
        if (window.length < 3) continue;
        out.push({ iso3, country, year: series[i].year, value: mean(window) });
      }
    } else if (method === "decade") {
      // Decade means.
      const buckets = new Map();
      for (const r of series) {
        const dec = Math.floor(r.year / 10) * 10;
        if (!buckets.has(dec)) buckets.set(dec, []);
        buckets.get(dec).push(r.value);
      }
      for (const [dec, vals] of [...buckets.entries()].sort((a, b) => a[0] - b[0])) {
        out.push({ iso3, country, year: dec + 5, value: mean(vals) });
      }
    } else if (method === "yoy") {
      // Year-on-year percent change.
      for (let i = 1; i < series.length; i++) {
        const prev = series[i - 1].value;
        if (!Number.isFinite(prev) || prev === 0) continue;
        out.push({
          iso3, country,
          year: series[i].year,
          value: 100 * (series[i].value / prev - 1),
        });
      }
    } else if (method === "cagr") {
      // Rolling 5-year CAGR (%).
      for (let i = 5; i < series.length; i++) {
        const base = series[i - 5].value;
        if (!Number.isFinite(base) || base <= 0) continue;
        const r = Math.pow(series[i].value / base, 1 / 5) - 1;
        out.push({ iso3, country, year: series[i].year, value: 100 * r });
      }
    } else if (method === "index") {
      const baseYear = opts.baseYear ?? 2000;
      const base = series.find(r => r.year === baseYear)?.value;
      if (!Number.isFinite(base) || base === 0) continue;
      for (const r of series) {
        out.push({ iso3, country, year: r.year, value: 100 * r.value / base });
      }
    } else {
      out.push(...series);
    }
  }
  return out.sort((a, b) => a.country.localeCompare(b.country) || a.year - b.year);
}

// ── Entity aggregation ──────────────────────────────────────────────────
//
// Aggregate a multi-country panel into a single synthetic series per
// year. Supports unweighted mean/median/sum and weighted means (weights
// is a parallel array of rows keyed by iso3, year — same shape as a
// fetchSeries() result for population or GDP).

export function aggregateEntities(rows, opts = {}) {
  const method = opts.method || "none";
  if (!rows.length || method === "none") return rows;

  const weights = opts.weights || null;
  const wByKey = new Map();
  if (weights) {
    for (const w of weights) wByKey.set(`${w.iso3}__${w.year}`, w.value);
  }

  const byY = groupByYear(rows);
  const out = [];
  const label = opts.label || (
    method === "pop_weighted" ? "Population-weighted"
    : method === "gdp_weighted" ? "GDP-weighted"
    : method === "median" ? "Median"
    : method === "sum" ? "Sum"
    : "Mean"
  );

  for (const [year, group] of [...byY.entries()].sort((a, b) => a[0] - b[0])) {
    let value;
    if (method === "mean") value = mean(group.map(r => r.value));
    else if (method === "median") value = median(group.map(r => r.value));
    else if (method === "sum") value = group.reduce((s, r) => s + r.value, 0);
    else if (method === "pop_weighted" || method === "gdp_weighted") {
      let num = 0, den = 0;
      for (const r of group) {
        const w = wByKey.get(`${r.iso3}__${year}`);
        if (!Number.isFinite(w) || w <= 0) continue;
        num += r.value * w; den += w;
      }
      if (den === 0) continue;
      value = num / den;
    } else continue;

    out.push({
      iso3: "AGG",
      country: label,
      year,
      value,
    });
  }
  return out;
}

// ── Missing-data diagnostics ───────────────────────────────────────────
//
// Returns { coverageByYear, gapsByCountry, totalN, totalPossible } for
// display in the diagnostics panel.

export function diagnostics(rows, { yearFrom, yearTo, countries }) {
  if (!rows.length) return null;
  const isoSet = new Set(rows.map(r => r.iso3));
  const nCountries = (countries && countries.length) ? countries.length : isoSet.size;
  const byY = groupByYear(rows);
  const byC = groupByCountry(rows);

  const coverageByYear = [];
  for (let y = yearFrom; y <= yearTo; y++) {
    const n = (byY.get(y) || []).length;
    coverageByYear.push({ year: y, n, coverage: n / nCountries });
  }

  const yearSpan = yearTo - yearFrom + 1;
  const gapsByCountry = [];
  for (const [iso3, series] of byC) {
    gapsByCountry.push({
      iso3,
      country: series[0].country,
      n: series.length,
      coverage: series.length / yearSpan,
    });
  }
  gapsByCountry.sort((a, b) => a.coverage - b.coverage);

  return {
    coverageByYear,
    gapsByCountry,
    totalN: rows.length,
    totalPossible: nCountries * yearSpan,
    nCountries,
    yearSpan,
  };
}

// ── Correlation helpers ────────────────────────────────────────────────

export function pearson(x, y) {
  const n = Math.min(x.length, y.length);
  if (n < 2) return NaN;
  let mx = 0, my = 0;
  for (let i = 0; i < n; i++) { mx += x[i]; my += y[i]; }
  mx /= n; my /= n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i] - mx, b = y[i] - my;
    num += a * b; dx += a * a; dy += b * b;
  }
  if (dx === 0 || dy === 0) return NaN;
  return num / Math.sqrt(dx * dy);
}

function rank(arr) {
  const idx = arr.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  const ranks = new Array(arr.length);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    const avg = (i + j + 2) / 2; // 1-based average
    for (let k = i; k <= j; k++) ranks[idx[k][1]] = avg;
    i = j + 1;
  }
  return ranks;
}

export function spearman(x, y) {
  return pearson(rank(x), rank(y));
}

// Given a map {code => rows}, compute an N×N correlation matrix over
// the pairwise-complete observations for a given year (and optional
// country filter).
export function corrMatrix(indicatorRows, year, method = "pearson") {
  const codes = Object.keys(indicatorRows);
  const byCode = {};
  for (const c of codes) {
    const m = new Map();
    for (const r of indicatorRows[c]) {
      if (r.year === year) m.set(r.iso3, r.value);
    }
    byCode[c] = m;
  }
  const cor = method === "spearman" ? spearman : pearson;
  const matrix = [];
  const ns = [];
  for (let i = 0; i < codes.length; i++) {
    const row = [];
    const nrow = [];
    for (let j = 0; j < codes.length; j++) {
      if (i === j) { row.push(1); nrow.push(byCode[codes[i]].size); continue; }
      const a = byCode[codes[i]], b = byCode[codes[j]];
      const xs = [], ys = [];
      for (const [iso, va] of a) {
        if (b.has(iso) && Number.isFinite(va) && Number.isFinite(b.get(iso))) {
          xs.push(va); ys.push(b.get(iso));
        }
      }
      row.push(cor(xs, ys));
      nrow.push(xs.length);
    }
    matrix.push(row); ns.push(nrow);
  }
  return { codes, matrix, ns };
}
