// Saved views — persist named view configs in localStorage, keyed by
// page slug ("chart", "compare", "map"). Each view stores the URL query
// string so rehydrating is just `location.search = v.query`.
//
// Exported helpers make it trivial to add "Save view" buttons on any
// page and an import/export path to a JSON file so students can share
// their views.

const KEY = "easyviz:savedviews:v1";

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function writeAll(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); }
  catch {}
}

export function listViews(page) {
  const all = readAll();
  return (all[page] || []).slice();
}

export function saveView(page, name, query) {
  const all = readAll();
  if (!all[page]) all[page] = [];
  all[page].push({ name, query, createdAt: new Date().toISOString() });
  writeAll(all);
}

export function removeView(page, index) {
  const all = readAll();
  if (!all[page]) return;
  all[page].splice(index, 1);
  writeAll(all);
}

export function exportJson() {
  const all = readAll();
  const blob = new Blob([JSON.stringify(all, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "easyviz_views.json";
  document.body.appendChild(a); a.click(); a.remove();
}

export async function importJson(file) {
  const txt = await file.text();
  const parsed = JSON.parse(txt);
  if (typeof parsed !== "object" || parsed === null) throw new Error("Invalid JSON shape");
  const current = readAll();
  for (const [page, list] of Object.entries(parsed)) {
    if (!Array.isArray(list)) continue;
    current[page] = (current[page] || []).concat(list.filter(v => v && v.name && v.query));
  }
  writeAll(current);
}
