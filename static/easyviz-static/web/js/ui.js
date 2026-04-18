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

// ── Code modal (R / Python replication snippets) ────────────────────────

let _modalRoot = null;

function ensureModalRoot() {
  if (_modalRoot) return _modalRoot;
  _modalRoot = document.createElement("div");
  _modalRoot.className = "ev-modal-root";
  _modalRoot.innerHTML = `
    <div class="ev-modal-backdrop" data-close></div>
    <div class="ev-modal" role="dialog" aria-modal="true">
      <header class="ev-modal-head">
        <div class="ev-modal-tabs" role="tablist">
          <button class="ev-modal-tab active" data-lang="r" role="tab">R</button>
          <button class="ev-modal-tab" data-lang="python" role="tab">Python</button>
        </div>
        <div class="ev-modal-actions">
          <button class="ev-modal-btn" data-copy>Copy</button>
          <button class="ev-modal-btn" data-download>Download</button>
          <button class="ev-modal-btn" data-close aria-label="Close">✕</button>
        </div>
      </header>
      <pre class="ev-modal-pre"><code class="ev-modal-code"></code></pre>
      <footer class="ev-modal-foot">
        <span class="ev-modal-hint">Paste into an R / Python session. Requires internet for the initial package installs and WB API calls.</span>
      </footer>
    </div>
  `;
  document.body.appendChild(_modalRoot);

  _modalRoot.querySelectorAll("[data-close]").forEach(el =>
    el.addEventListener("click", hideCodeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && _modalRoot.classList.contains("open")) hideCodeModal();
  });
  return _modalRoot;
}

let _lastSnippets = { r: "", python: "" };
let _lastFilename = "replication";

export function showCodeModal({ r, python, filename = "replication" } = {}) {
  const root = ensureModalRoot();
  _lastSnippets = { r: r || "", python: python || "" };
  _lastFilename = filename;
  setModalLang("r");
  root.classList.add("open");
  root.querySelectorAll(".ev-modal-tab").forEach(t => {
    t.onclick = () => setModalLang(t.dataset.lang);
  });
  root.querySelector("[data-copy]").onclick = async () => {
    const lang = root.querySelector(".ev-modal-tab.active").dataset.lang;
    const txt = _lastSnippets[lang];
    try {
      await navigator.clipboard.writeText(txt);
      const btn = root.querySelector("[data-copy]");
      const prev = btn.textContent; btn.textContent = "✓ Copied";
      setTimeout(() => { btn.textContent = prev; }, 1500);
    } catch {}
  };
  root.querySelector("[data-download]").onclick = () => {
    const lang = root.querySelector(".ev-modal-tab.active").dataset.lang;
    const ext = lang === "r" ? "R" : "py";
    const blob = new Blob([_lastSnippets[lang]], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${_lastFilename}.${ext}`;
    document.body.appendChild(a); a.click(); a.remove();
  };
}

function setModalLang(lang) {
  const root = _modalRoot;
  root.querySelectorAll(".ev-modal-tab").forEach(t =>
    t.classList.toggle("active", t.dataset.lang === lang));
  root.querySelector(".ev-modal-code").textContent = _lastSnippets[lang] || "(no snippet)";
}

export function hideCodeModal() {
  if (_modalRoot) _modalRoot.classList.remove("open");
}

// Attach a "Show code" button to a container. The spec is re-evaluated
// at click-time so it always reflects the current UI state.
export function attachCodeButton(containerEl, specProvider, codegens) {
  const btn = document.createElement("button");
  btn.className = "code-btn";
  btn.type = "button";
  btn.textContent = "⟨/⟩ Show R / Python code";
  btn.addEventListener("click", () => {
    const spec = specProvider();
    if (!spec) return;
    showCodeModal({
      r: codegens.r(spec),
      python: codegens.py(spec),
      filename: spec.filename || spec.indicator?.id || spec.kind || "replication",
    });
  });
  containerEl.appendChild(btn);
  return btn;
}

// ── Methodology caption (one-line paper footnote) ───────────────────────
//
// Given a spec, return a single-sentence string suitable for a paper
// footnote. Keep the style tight; users may paste this verbatim.

export function methodologyCaption(spec) {
  if (!spec) return "";
  const { indicator, indicatorB, indicators, countries, years, year,
          transform, entityAgg } = spec;
  const parts = [];
  if (indicator && indicatorB) {
    parts.push(`Cross-country ${spec.kind === "regression" ? "OLS regression of" : "association between"} ${indicatorB.name} and ${indicator.name}`);
  } else if (indicators && indicators.length) {
    parts.push(`Pairwise correlations across ${indicators.length} WDI indicators`);
  } else if (indicator) {
    parts.push(`${indicator.name}${indicator.unit ? ` (${indicator.unit})` : ""}`);
  }
  if (years) parts.push(`${years[0]}–${years[1]}`);
  else if (year) parts.push(`${year}`);
  if (countries && countries.length && countries.length < 50) {
    parts.push(`${countries.length} economies`);
  } else if (countries && countries.length) {
    parts.push("all WDI economies");
  }
  if (transform && transform.method && transform.method !== "none") {
    const map = {
      ma5: "5-year centered moving average",
      decade: "decade means",
      yoy: "year-on-year growth rates",
      cagr: "rolling 5-year CAGR",
      index: `indexed to ${transform.baseYear ?? 2000} = 100`,
    };
    parts.push(map[transform.method] || transform.method);
  }
  if (entityAgg && entityAgg.method && entityAgg.method !== "none") {
    const map = {
      mean: "unweighted mean across countries",
      median: "median across countries",
      sum: "sum across countries",
      pop_weighted: "population-weighted mean",
      gdp_weighted: "GDP-weighted mean",
    };
    parts.push(map[entityAgg.method] || entityAgg.method);
  }
  parts.push("source: World Bank WDI");
  return parts.join("; ") + ".";
}

// ── Citation generator (BibTeX + APA) ───────────────────────────────────

export function citations(spec, { accessed = new Date() } = {}) {
  const date = accessed.toISOString().slice(0, 10);
  const y = accessed.getFullYear();
  const key = `wdi_${(spec?.indicator?.code || "series").toLowerCase().replace(/\W/g, "_")}_${y}`;
  const label = spec?.indicator?.name || "World Development Indicators";
  const code = spec?.indicator?.code || "";
  const bibtex = `@misc{${key},
  title        = {{${label}}${code ? ` [WDI code ${code}]` : ""}},
  author       = {{World Bank}},
  year         = {${y}},
  howpublished = {World Development Indicators, https://data.worldbank.org},
  note         = {Accessed ${date} via EasyViz.}
}`;
  const apa = `World Bank. (${y}). ${label}${code ? ` [WDI indicator ${code}]` : ""}. World Development Indicators. Retrieved ${date}, from https://data.worldbank.org`;
  return { bibtex, apa };
}

// ── Keyboard shortcut: `/` focuses the first [data-search] input ────────

export function initSearchHotkey() {
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.target.matches("input, textarea, select")) return;
    const el = document.querySelector("[data-search]");
    if (el) { e.preventDefault(); el.focus(); }
  });
}
