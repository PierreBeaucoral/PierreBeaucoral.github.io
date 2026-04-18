// CSV + Excel parsing + heuristic column detection + wide→long reshape.
// Mirrors src/uploader.py from the Streamlit EasyViz so the behaviour
// is identical whichever surface the user lands on.
//
// Dependencies (CDN-loaded in upload.html):
//   * PapaParse — CSV
//   * SheetJS (xlsx.full.min.js) — Excel → JSON
//
// Both are attached to `window` (Papa, XLSX).

import { NAME_TO_ISO3, ISO3_TO_NAME } from "../data/countries.js";

// ── Parse ───────────────────────────────────────────────────────────────

export function parseCsv(text) {
  const out = window.Papa.parse(text.trim(), {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  return { rows: out.data, cols: out.meta.fields };
}

export async function parseFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv") || name.endsWith(".tsv") || name.endsWith(".txt")) {
    const text = await file.text();
    return parseCsv(text);
  }
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const buf = await file.arrayBuffer();
    const wb = window.XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = window.XLSX.utils.sheet_to_json(sheet, { defval: null });
    return { rows, cols: rows.length ? Object.keys(rows[0]) : [] };
  }
  throw new Error(`Unsupported file type: ${file.name}`);
}

// ── Column detection ────────────────────────────────────────────────────

const YEAR_RE = /^(19|20)\d{2}$/;
const ENTITY_KEYS = ["country", "entity", "iso", "iso3", "nation", "economy"];
const YEAR_KEYS   = ["year", "annee", "année", "period", "time"];

export function detectFormat(cols) {
  const yearCols = cols.filter(c => YEAR_RE.test(String(c)));
  return yearCols.length >= 3 ? "wide" : "long";
}

export function detectColumns(rows, cols) {
  const lower = cols.map(c => String(c).toLowerCase());
  const entity = cols[lower.findIndex(c => ENTITY_KEYS.some(k => c.includes(k)))] ?? cols[0];
  const yearByKey = cols[lower.findIndex(c => YEAR_KEYS.some(k => c === k || c.includes(k)))];
  const yearByHeur = cols.find(c => {
    if (c === entity) return false;
    const values = rows.map(r => r[c]).filter(v => v !== null && v !== undefined);
    if (!values.length) return false;
    const plausible = values.filter(v => {
      const n = Number(v);
      return Number.isFinite(n) && n >= 1900 && n <= 2030 && Math.floor(n) === n;
    });
    return plausible.length / values.length >= 0.8;
  });
  const year = yearByKey ?? yearByHeur ?? null;

  const valueCandidates = cols.filter(c => {
    if (c === entity || c === year) return false;
    const values = rows.map(r => r[c]).filter(v => v !== null && v !== undefined);
    if (!values.length) return false;
    const numeric = values.filter(v => Number.isFinite(Number(v)));
    return numeric.length / values.length >= 0.8;
  });

  return { entity, year, value: valueCandidates[0] ?? null, value_candidates: valueCandidates };
}

// ── ISO3 resolution ────────────────────────────────────────────────────

const _norm = (s) => String(s ?? "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

// Pre-normalised lookup table built from the WDI roster.
const _byNormName = new Map();
for (const [iso, name] of Object.entries(ISO3_TO_NAME)) {
  _byNormName.set(_norm(name), iso);
}
// Common ISO2 → ISO3 additions for the handful of cases that crop up.
const ISO2 = {
  "us": "USA", "uk": "GBR", "gb": "GBR", "fr": "FRA", "de": "DEU",
  "cn": "CHN", "in": "IND", "br": "BRA", "ru": "RUS", "jp": "JPN",
  "ca": "CAN", "au": "AUS", "za": "ZAF", "ng": "NGA", "mx": "MEX",
  "id": "IDN", "eg": "EGY", "tr": "TUR", "vn": "VNM", "th": "THA",
  "kr": "KOR", "ar": "ARG", "sa": "SAU", "ae": "ARE", "my": "MYS",
};

export function resolveIso3(entity) {
  if (!entity) return "";
  const raw = String(entity).trim();
  const upper = raw.toUpperCase();
  if (/^[A-Z]{3}$/.test(upper) && ISO3_TO_NAME[upper]) return upper;
  const n = _norm(raw);
  if (_byNormName.has(n)) return _byNormName.get(n);
  if (n.length === 2 && ISO2[n]) return ISO2[n];
  // One-shot fuzzy: substring match on the normalised roster.
  for (const [normName, iso] of _byNormName) {
    if (normName.includes(n) || n.includes(normName)) return iso;
  }
  return "";
}

// ── Normalise ───────────────────────────────────────────────────────────

export function normalise(rows, { entityCol, yearCol, valueCol, fmt, entityIsIso3 = false }) {
  const out = [];
  if (fmt === "wide") {
    // Each year column is a separate (entity, year, value) row.
    const sample = rows[0] ?? {};
    const yearCols = Object.keys(sample).filter(c => YEAR_RE.test(String(c)));
    for (const r of rows) {
      const ent = r[entityCol];
      if (ent === null || ent === undefined || ent === "") continue;
      for (const yc of yearCols) {
        const v = r[yc];
        if (v === null || v === undefined || v === "") continue;
        const num = Number(v);
        if (!Number.isFinite(num)) continue;
        out.push({
          entity: String(ent),
          iso3:   entityIsIso3 ? String(ent).toUpperCase() : resolveIso3(ent),
          year:   parseInt(yc, 10),
          value:  num,
        });
      }
    }
  } else {
    for (const r of rows) {
      const ent = r[entityCol];
      const v = r[valueCol];
      if (ent === null || ent === undefined || ent === "" || v === null || v === undefined || v === "") continue;
      const num = Number(v);
      if (!Number.isFinite(num)) continue;
      const yr = yearCol ? parseInt(r[yearCol], 10) : 0;
      out.push({
        entity: String(ent),
        iso3:   entityIsIso3 ? String(ent).toUpperCase() : resolveIso3(ent),
        year:   Number.isFinite(yr) ? yr : 0,
        value:  num,
      });
    }
  }
  return out;
}
