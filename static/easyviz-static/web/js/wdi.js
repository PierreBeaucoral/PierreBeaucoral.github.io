// Direct World Bank WDI client. Runs in the browser — api.worldbank.org
// sends `Access-Control-Allow-Origin: *`, so this works from any origin
// without a proxy.
//
// `config.js` can override the base URL: if `window.EASYVIZ_WDI_BASE`
// points at an http://localhost:8000 FastAPI, we'll use the proxy
// endpoints instead (for devs who want the in-memory cache). Falls back
// silently to direct WB calls.

import { COUNTRIES } from "../data/countries.js";
import { median } from "./aggregate.js";

const WB_BASE = "https://api.worldbank.org/v2";

// Last calendar year we ask the API for. Derived from the clock so new
// WDI releases show up without a code change.
export const END_YEAR = new Date().getFullYear();

// ISO3 set of real economies (WB regional / income aggregates such as
// "World" or "High income" carry region.id === "NA"). Fetched once per
// session; falls back to the frozen COUNTRIES roster if the call fails.
let _economies = null;
export function economies() {
  if (!_economies) {
    _economies = fetch(`${WB_BASE}/country?format=json&per_page=400`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(String(r.status))))
      .then(p => new Set(p[1].filter(c => c.region?.id !== "NA").map(c => c.id)))
      .catch(() => new Set(COUNTRIES.map(([iso]) => iso)));
  }
  return _economies;
}

// Per-session in-memory cache so re-selecting the same indicator is
// instant. Not persisted to localStorage — keeps the page lightweight.
const _cache = new Map();

export async function fetchSeries(code, iso3List = [], { signal } = {}) {
  const iso3 = iso3List.length ? iso3List.map(s => s.toUpperCase()).join(";") : "all";
  const key = `${code}__${iso3}`;
  if (_cache.has(key)) return _cache.get(key);

  const url = `${WB_BASE}/country/${iso3}/indicator/${code}` +
              `?format=json&per_page=20000&date=1960:${END_YEAR}`;
  const [r, econ] = await Promise.all([fetch(url, { signal }), economies()]);
  if (!r.ok) throw new Error(`World Bank API returned ${r.status}`);
  const payload = await r.json();
  if (!Array.isArray(payload) || payload.length < 2 || !payload[1]) {
    _cache.set(key, []);
    return [];
  }
  const rows = [];
  for (const rec of payload[1]) {
    if (rec.value === null || rec.value === undefined) continue;
    const year = parseInt(rec.date, 10);
    if (Number.isNaN(year)) continue;
    const iso3 = rec.countryiso3code || (rec.country?.id ?? "");
    if (!econ.has(iso3)) continue; // drop aggregates ("World", "High income", …)
    rows.push({
      iso3,
      country: rec.country?.value ?? rec.countryiso3code,
      year,
      value:   Number(rec.value),
    });
  }
  _cache.set(key, rows);
  return rows;
}

// Helper: cross-section join of two indicators at a year. Used by the
// scatter / bubble / regression tabs on compare.html.
export async function crossSection(codeA, codeB, year, iso3List = []) {
  const [rowsA, rowsB] = await Promise.all([
    fetchSeries(codeA, iso3List),
    fetchSeries(codeB, iso3List),
  ]);
  const byIsoA = new Map();
  const byIsoB = new Map();
  for (const r of rowsA) if (r.year === year) byIsoA.set(r.iso3, r);
  for (const r of rowsB) if (r.year === year) byIsoB.set(r.iso3, r);
  const points = [];
  for (const iso of byIsoA.keys()) {
    if (!byIsoB.has(iso)) continue;
    const a = byIsoA.get(iso), b = byIsoB.get(iso);
    points.push({ iso3: iso, country: a.country, x: a.value, y: b.value });
  }
  return points;
}

// Helper: long panel for Gapminder — every (iso3, year) row that has
// both series values. `sizeCode` is optional; used for bubble size.
export async function gapminderPanel(codeX, codeY, iso3List = [], sizeCode = null) {
  const codes = sizeCode ? [codeX, codeY, sizeCode] : [codeX, codeY];
  const series = await Promise.all(codes.map(c => fetchSeries(c, iso3List)));
  const [sx, sy, ss] = series;
  const keyOf = (r) => `${r.iso3}__${r.year}`;
  const byKey = new Map();
  for (const r of sx) byKey.set(keyOf(r), { iso3: r.iso3, country: r.country, year: r.year, x: r.value });
  for (const r of sy) {
    const row = byKey.get(keyOf(r));
    if (row) row.y = r.value;
  }
  if (ss) for (const r of ss) {
    const row = byKey.get(keyOf(r));
    if (row) row.size = r.value;
  }
  const out = [];
  for (const row of byKey.values()) {
    if (row.x === undefined || row.y === undefined) continue;
    if (sizeCode && row.size === undefined) continue;
    out.push(row);
  }
  return out.sort((a, b) => a.year - b.year);
}

// Summary statistics for the stat tiles on the chart page: a single
// cross-section — every country's value in the latest year of `rows`
// (synthetic "AGG" aggregate rows excluded), not a pooled country-year
// sample, so N / mean / median have a clean interpretation.
export function summaryStats(rows) {
  const cs = rows.filter(r => r.iso3 !== "AGG" && Number.isFinite(r.value));
  if (!cs.length) return null;
  const year = Math.max(...cs.map(r => r.year));
  const values = cs.filter(r => r.year === year).map(r => r.value);
  return {
    year,
    n: values.length,
    min:  Math.min(...values),
    max:  Math.max(...values),
    mean: values.reduce((s, v) => s + v, 0) / values.length,
    median: median(values),
  };
}
