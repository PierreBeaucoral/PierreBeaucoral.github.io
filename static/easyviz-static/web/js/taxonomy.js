// Optional full-WDI taxonomy loader.
//
// The curated catalog (data/catalog.js) has ~100 high-signal indicators
// — enough for 95% of the things a reader will look up. When the user
// wants more (e.g. a very specific WDI code), this module fetches the
// full /indicator feed and merges it into the search space.
//
// 20k+ rows at ~200 B each = ~4 MB. localStorage caps at ~5 MB in most
// browsers, so we serialise to a compact form (id, name, code, source)
// and gzip-via-JSON (browsers handle text compression at transport).
// With a 7-day TTL this endpoint is hit maybe once a week per user.

const LS_KEY = "easyviz:wdi-taxonomy:v1";
const LS_TS_KEY = "easyviz:wdi-taxonomy:ts";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

const ENDPOINT = "https://api.worldbank.org/v2/indicator?format=json&per_page=25000&page=1";

export async function loadFull({ force = false } = {}) {
  const now = Date.now();
  if (!force) {
    const ts = parseInt(localStorage.getItem(LS_TS_KEY) || "0", 10);
    const cached = localStorage.getItem(LS_KEY);
    if (cached && now - ts < TTL_MS) {
      try { return JSON.parse(cached); } catch { /* fall through */ }
    }
  }

  const r = await fetch(ENDPOINT);
  if (!r.ok) throw new Error(`WB taxonomy fetch failed: ${r.status}`);
  const payload = await r.json();
  if (!Array.isArray(payload) || payload.length < 2) return [];

  const indicators = payload[1].map(rec => ({
    id:       "wdi_" + String(rec.id).toLowerCase().replace(/\./g, "_"),
    name:     rec.name,
    code:     rec.id,
    category: (rec.topics?.[0]?.value ?? "Uncategorised").trim(),
    source:   "wdi",
    unit:     rec.unit || "",
    tags:     [rec.sourceNote?.slice(0, 80) || ""],
  })).filter(r => r.name && r.code);

  try {
    localStorage.setItem(LS_KEY, JSON.stringify(indicators));
    localStorage.setItem(LS_TS_KEY, String(now));
  } catch {
    // localStorage may be full; drop cache silently. The in-memory
    // result still stands for this session.
  }
  return indicators;
}

export function mergeCatalogs(curated, full) {
  // Curated rows win on id collision — hand-written name/category/tags
  // are higher-quality than the auto-scraped versions.
  const byId = new Map(curated.map(r => [r.id, r]));
  const byCode = new Map(curated.map(r => [r.code, r]));
  for (const r of full) {
    if (byId.has(r.id) || byCode.has(r.code)) continue;
    byId.set(r.id, r);
  }
  return [...byId.values()];
}
