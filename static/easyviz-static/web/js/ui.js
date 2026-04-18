// Tiny UI helpers — loading / error / toast / dark-mode.
// No framework. Everything operates on plain DOM nodes.

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

export function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function setStatus(el, kind, message) {
  if (!el) return;
  if (!kind) { el.innerHTML = ""; return; }
  el.innerHTML = `<div class="${kind}">${escapeHtml(message)}</div>`;
}

export function loading(el, msg = "Loading…") { setStatus(el, "loading", msg); }
export function error(el, msg)                 { setStatus(el, "error", msg); }
export function clear(el)                      { setStatus(el, null); }

// ── Dark mode ────────────────────────────────────────────────────────────

const DARK_KEY = "easyviz:dark";

export function initDarkMode() {
  const saved = localStorage.getItem(DARK_KEY);
  const prefers = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  if (saved === "1" || (saved === null && prefers)) {
    document.documentElement.dataset.theme = "dark";
  }
  document.querySelectorAll("[data-action=toggle-dark]").forEach(btn => {
    btn.addEventListener("click", () => {
      const now = document.documentElement.dataset.theme === "dark" ? null : "dark";
      if (now) document.documentElement.dataset.theme = "dark";
      else delete document.documentElement.dataset.theme;
      localStorage.setItem(DARK_KEY, now ? "1" : "0");
    });
  });
}

// ── CSV download ────────────────────────────────────────────────────────

export function downloadCsv(filename, rows) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const header = cols.join(",");
  const body = rows.map(r =>
    cols.map(c => {
      const v = r[c];
      if (v === null || v === undefined) return "";
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")
  ).join("\n");
  const blob = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ── Keyboard shortcut: `/` focuses the first [data-search] input ────────

export function initSearchHotkey() {
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.target.matches("input, textarea, select")) return;
    const el = document.querySelector("[data-search]");
    if (el) { e.preventDefault(); el.focus(); }
  });
}
