// URL state round-tripping. Mirrors src/urlstate.py from the Streamlit
// app — same query-param vocabulary so a saved Streamlit URL maps
// cleanly to the static version and vice-versa.

export function params() {
  return new URLSearchParams(window.location.search);
}

export function get(key, fallback = null) {
  const v = params().get(key);
  return v ?? fallback;
}

export function getList(key) {
  const v = params().get(key);
  return v ? v.split(",").filter(Boolean) : [];
}

export function getIntPair(key) {
  const v = params().get(key);
  if (!v) return null;
  const [a, b] = v.split("-").map(s => parseInt(s, 10));
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return [a, b];
}

export function getBool(key, fallback = false) {
  const v = params().get(key);
  if (v === null) return fallback;
  return v === "1" || v === "true" || v === "yes";
}

export function update(updates) {
  const p = params();
  for (const [k, v] of Object.entries(updates)) {
    if (v === null || v === undefined || v === "") p.delete(k);
    else if (Array.isArray(v)) p.set(k, v.join(","));
    else if (typeof v === "boolean") v ? p.set(k, "1") : p.delete(k);
    else p.set(k, String(v));
  }
  const url = `${window.location.pathname}?${p.toString()}`;
  history.replaceState(null, "", url);
}

export function isEmbed() {
  return getBool("embed");
}

// Minimal CSS when ?embed=1 — hide site chrome so the chart drops into
// an iframe / blog post as a flush rectangle.
export const EMBED_CSS = `
  header.site, footer.site { display: none !important; }
  main.container { padding: 0.5rem !important; max-width: 100% !important; }
  h1, p.lede { display: none !important; }
`;
