// Tiny UI helpers — loading / error / dark-mode / pickers / exports.
// No framework. Everything operates on plain DOM nodes.

import { DECADE_MIN_OBS } from "./aggregate.js";

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

// The theme is always written explicitly ("light" | "dark") so the
// prefers-color-scheme fallback in tokens.css never fights the toggle.
// Charts listen for "easyviz:theme" and re-read the colour tokens.
export function initDarkMode() {
  let saved = null;
  try { saved = localStorage.getItem(DARK_KEY); } catch {}
  const prefers = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  const root = document.documentElement;
  const apply = (dark) => {
    root.dataset.theme = dark ? "dark" : "light";
    document.querySelectorAll("[data-action=toggle-dark]").forEach(btn => {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      btn.title = dark ? "Switch to light mode" : "Switch to dark mode";
    });
  };
  apply(saved === "1" || (saved === null && prefers));
  document.querySelectorAll("[data-action=toggle-dark]").forEach(btn => {
    btn.addEventListener("click", () => {
      const dark = root.dataset.theme !== "dark";
      apply(dark);
      try { localStorage.setItem(DARK_KEY, dark ? "1" : "0"); } catch {}
      document.dispatchEvent(new CustomEvent("easyviz:theme", { detail: { dark } }));
    });
  });
}

// ── Number formatting (one convention site-wide) ────────────────────────
//
// en-US grouping regardless of the reader's locale, so "70,000" always
// means seventy thousand. ≥ 1M → compact (1.23M); ≥ 1,000 → grouped
// integer; otherwise 3 significant digits.

export function fmtNum(v) {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a >= 1e6) return v.toLocaleString("en-US", { notation: "compact", maximumSignificantDigits: 3 });
  if (a >= 1000) return v.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return v.toLocaleString("en-US", { maximumSignificantDigits: 3 });
}

export function fmtInt(v) {
  return Number.isFinite(v) ? v.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "—";
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
    <div class="ev-modal" role="dialog" aria-modal="true" aria-label="Replication code">
      <header class="ev-modal-head">
        <div class="ev-modal-tabs" role="tablist">
          <button class="ev-modal-tab active" data-lang="r" role="tab" type="button">R</button>
          <button class="ev-modal-tab" data-lang="python" role="tab" type="button">Python</button>
        </div>
        <div class="ev-modal-actions">
          <button class="ev-modal-btn" data-copy>Copy</button>
          <button class="ev-modal-btn" data-download>Download</button>
          <button class="ev-modal-btn" data-close aria-label="Close code panel">Close</button>
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

let _modalReturnFocus = null;

export function showCodeModal({ r, python, filename = "replication" } = {}) {
  const root = ensureModalRoot();
  _modalReturnFocus = document.activeElement;
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
      const prev = btn.textContent; btn.textContent = "Copied";
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
  root.querySelector(".ev-modal-tab.active")?.focus();
}

function setModalLang(lang) {
  const root = _modalRoot;
  root.querySelectorAll(".ev-modal-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.lang === lang);
    t.setAttribute("aria-selected", t.dataset.lang === lang ? "true" : "false");
  });
  root.querySelector(".ev-modal-code").textContent = _lastSnippets[lang] || "(no snippet)";
}

export function hideCodeModal() {
  if (!_modalRoot || !_modalRoot.classList.contains("open")) return;
  _modalRoot.classList.remove("open");
  _modalReturnFocus?.focus?.();
}

// Attach a "Show code" button to a container. The spec is re-evaluated
// at click-time so it always reflects the current UI state.
export function attachCodeButton(containerEl, specProvider, codegens) {
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.type = "button";
  btn.textContent = "R / Python code";
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
//
// With a second argument (`ctx`, facts only known after the data are in)
// the caption also carries the "Notes:" clause — transform rules, panel
// composition, log-axis drops, colour scale — so every page builds its
// footnote here rather than appending strings locally.
//   ctx.nCountries  countries in the (possibly balanced) window   (timeseries)
//   ctx.aggNs       per-year contributing N of the aggregate rows (timeseries)
//   ctx.dropped     non-positive observations dropped by log axes (compare)

export function methodologyCaption(spec, ctx = null) {
  if (!spec) return "";
  const { indicator, indicatorB, indicators, countries, years, year,
          transform, entityAgg } = spec;
  const parts = [];
  if (indicator && indicatorB) {
    parts.push(`Cross-country ${spec.kind === "regression" ? "OLS regression of" : "association between"} ${indicatorB.name} ${spec.kind === "regression" ? "on" : "and"} ${indicator.name}`);
  } else if (indicators && indicators.length) {
    parts.push(`Pairwise correlations across ${indicators.length} WDI indicators`);
  } else if (indicator) {
    parts.push(`${indicator.name}${indicator.unit && !/\)$/.test(indicator.name) ? ` (${indicator.unit})` : ""}`);
  }
  if (spec.period && spec.period.method) {
    const m = spec.period.method;
    const label = m === "sum" ? "cumulative sum"
                : m === "mean" ? "mean" : m;
    parts.push(`${label} ${spec.period.yearFrom}–${spec.period.yearTo} (NA-dropped per country)`);
  } else if (years) parts.push(`${years[0]}–${years[1]}`);
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
  const caption = parts.join("; ") + ".";
  if (!ctx) return caption;
  const notes = methodologyNotes(spec, ctx);
  return notes.length ? `${caption} Notes: ${notes.join("; ")}.` : caption;
}

function methodologyNotes(spec, ctx) {
  const notes = [];
  if (spec.kind === "timeseries") {
    const tfm = spec.transform?.method;
    if (tfm === "ma5") notes.push("MA5 averages the observed years in [t−2, t+2], min 3");
    if (tfm === "yoy") notes.push("growth computed only where year t−1 is observed");
    if (tfm === "cagr") notes.push("CAGR computed only where year t−5 is observed");
    if (tfm === "decade") notes.push(`decade means require ≥ ${DECADE_MIN_OBS} of 10 years`);
    const nC = ctx.nCountries;
    const ns = ctx.aggNs || [];
    if (ns.length) {
      const a = Math.min(...ns), b = Math.max(...ns);
      notes.push(spec.balanced ? `balanced panel of ${nC} countries`
        : a === b ? `N = ${a} countries every year`
        : `unbalanced panel: N per year ranges ${a}–${b}, so changes in composition can move the aggregate (tick "Balanced panel only" to hold the sample fixed)`);
    } else if (spec.balanced) notes.push(`balanced panel of ${nC} countries`);
  } else if (spec.kind === "map") {
    notes.push(`colour: ${spec.diverging ? `linear scale centred at ${spec.center}`
      : spec.scale === "quantile" ? "7 quantile classes (equal country counts)"
      : `${spec.scale} scale`}`);
    notes.push("Equal Earth projection");
    notes.push("WB regional / income aggregates excluded");
  } else {
    // compare: scatter · bubble · regression · gapminder · correlation
    notes.push("WB regional / income aggregates excluded");
    const axes = [spec.logX && "X", spec.logY && "Y"].filter(Boolean).join(" and ");
    if (axes && Number.isFinite(ctx.dropped))
      notes.push(`log ${axes} axis; ${ctx.dropped} non-positive observation${ctx.dropped === 1 ? "" : "s"} dropped`);
    if (spec.kind === "regression" && Number.isFinite(ctx.dropped))
      notes.push(`OLS of ${spec.logY ? "ln y" : "y"} on ${spec.logX ? "ln x" : "x"}; HC1 heteroskedasticity-robust SEs, t(n−2) inference`);
  }
  return notes;
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

// ── Inline help popovers ────────────────────────────────────────────────
//
// Author: <span class="ev-help" data-help="short explanation">i</span>
// next to any label; `initHelpIcons()` wires them. Focus shows the tip at
// once, hover after a short delay, click / tap / Enter pins it, Escape or
// a click elsewhere closes it. Clicks never reach an enclosing <label>
// (which would otherwise toggle its checkbox).

let _helpTip = null;
let _helpOwner = null;
let _helpPinned = false;
let _hoverTimer = null;
const HOVER_DELAY = 800;

function ensureHelpTip() {
  if (_helpTip) return _helpTip;
  _helpTip = document.createElement("div");
  _helpTip.className = "ev-help-tip";
  _helpTip.id = "ev-help-tip";
  _helpTip.setAttribute("role", "tooltip");
  document.body.appendChild(_helpTip);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideHelp(true); });
  document.addEventListener("pointerdown", (e) => {
    if (_helpPinned && !e.target.closest?.("[data-help]")) hideHelp(true);
  });
  window.addEventListener("resize", () => hideHelp(true));
  return _helpTip;
}

function showHelp(btn) {
  const tip = ensureHelpTip();
  if (_helpOwner && _helpOwner !== btn) _helpOwner.setAttribute("aria-expanded", "false");
  _helpOwner = btn;
  tip.textContent = btn.dataset.help || "";
  tip.classList.add("show");
  btn.setAttribute("aria-expanded", "true");
  btn.setAttribute("aria-describedby", tip.id);
  // Position below the icon, clamped inside the viewport.
  const r = btn.getBoundingClientRect();
  const w = tip.offsetWidth;
  const margin = 12;
  const left = Math.min(Math.max(r.left + r.width / 2 - w / 2, margin),
                        document.documentElement.clientWidth - w - margin);
  tip.style.left = `${left + window.scrollX}px`;
  tip.style.top  = `${r.bottom + window.scrollY + 8}px`;
}

function hideHelp(force = false) {
  clearTimeout(_hoverTimer);
  if (_helpPinned && !force) return;
  _helpPinned = false;
  if (_helpTip) _helpTip.classList.remove("show");
  if (_helpOwner) {
    _helpOwner.setAttribute("aria-expanded", "false");
    _helpOwner.removeAttribute("aria-describedby");
  }
  _helpOwner = null;
}

export function initHelpIcons(root = document) {
  root.querySelectorAll("[data-help]").forEach(el => {
    if (el.dataset.helpBound) return;
    el.dataset.helpBound = "1";
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `Help: ${el.dataset.help}`);
    el.setAttribute("aria-expanded", "false");
    el.addEventListener("mouseenter", () => {
      clearTimeout(_hoverTimer);
      _hoverTimer = setTimeout(() => showHelp(el), HOVER_DELAY);
    });
    el.addEventListener("mouseleave", () => hideHelp());
    el.addEventListener("focus", () => showHelp(el));
    el.addEventListener("blur", () => hideHelp(true));
    const toggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (_helpPinned && _helpOwner === el) { hideHelp(true); return; }
      clearTimeout(_hoverTimer);
      showHelp(el);
      _helpPinned = true;
    };
    el.addEventListener("click", toggle);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") toggle(e);
    });
  });
}

// Shorthand for emitting a help icon inline in innerHTML templates.
export function helpIcon(text) {
  return `<span class="ev-help" data-help="${escapeHtml(text)}">i</span>`;
}

// ── PNG / SVG exporters ────────────────────────────────────────────────

// Resolve any CSS colour (tokens are OKLCH) to an sRGB "rgb()/rgba()"
// string that canvas, Chart.js's colour parser and external SVG viewers
// all understand.
let _probeCtx = null;
export function resolveColor(css, fallback = "rgb(255,255,255)") {
  if (!css) return fallback;
  if (!_probeCtx) {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    _probeCtx = c.getContext("2d", { willReadFrequently: true });
  }
  const ctx = _probeCtx;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = fallback;
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return a === 255 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`;
}

// Read a design token (custom property) from :root, resolved to sRGB.
export function tokenColor(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? resolveColor(v, fallback) : fallback;
}

export function tokenFont(name, fallback = "sans-serif") {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

// Download a Chart.js canvas as PNG. Re-paints the background colour so
// saved figures aren't transparent. The chart carries no in-canvas title
// (titles belong in the paper's caption); `note` adds a one-line source
// band under the plot so the file still says where the data came from.
export function downloadPng(canvas, filename = "chart.png", { background = null, note = "" } = {}) {
  if (!canvas) return;
  const bg = resolveColor(background || getComputedStyle(document.body).backgroundColor);
  const ink = tokenColor("--color-muted", "rgb(90,90,90)");
  const dpr = canvas.width / (canvas.clientWidth || canvas.width) || 1;
  const pad = Math.round(12 * dpr);
  const fontPx = Math.round(12 * dpr);
  const lineH = Math.round(fontPx * 1.4);

  const out = document.createElement("canvas");
  const ctx = out.getContext("2d");
  ctx.font = `${fontPx}px ${tokenFont("--font-body")}`;
  // Greedy word-wrap of the note to the canvas width.
  const lines = [];
  if (note) {
    let line = "";
    for (const word of note.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > canvas.width - 2 * pad && line) { lines.push(line); line = word; }
      else line = test;
    }
    if (line) lines.push(line);
  }
  const band = lines.length ? pad + lines.length * lineH : 0;
  out.width = canvas.width;
  out.height = canvas.height + band;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  if (lines.length) {
    ctx.font = `${fontPx}px ${tokenFont("--font-body")}`;
    ctx.fillStyle = ink;
    ctx.textBaseline = "top";
    lines.forEach((l, i) => ctx.fillText(l, pad, canvas.height + Math.round(pad / 2) + i * lineH));
  }
  out.toBlob(blob => {
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
  }, "image/png");
}

// One-line source note for exported figures.
export function sourceNote(codes, { extra = "" } = {}) {
  const list = (Array.isArray(codes) ? codes : [codes]).filter(Boolean);
  const date = new Date().toISOString().slice(0, 10);
  return `Source: World Bank, World Development Indicators${list.length ? ` (${list.join(", ")})` : ""}${extra ? `, ${extra}` : ""}; accessed ${date} via EasyViz.`;
}

// Serialize an <svg> element to a downloadable file. Embeds a background
// rect so the file renders correctly outside the browser.
export function downloadSvg(svgEl, filename = "map.svg", { background = "#ffffff" } = {}) {
  if (!svgEl) return;
  background = background ? resolveColor(background) : background;
  const clone = svgEl.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  const viewBox = clone.getAttribute("viewBox");
  if (viewBox && background) {
    const [, , w, h] = viewBox.split(/\s+/).map(Number);
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "0"); rect.setAttribute("y", "0");
    rect.setAttribute("width", w); rect.setAttribute("height", h);
    rect.setAttribute("fill", background);
    clone.insertBefore(rect, clone.firstChild);
  }
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
}

// ── Copy-to-clipboard feedback on a button ────────────────────────────

export async function copyText(btn, text) {
  try {
    await navigator.clipboard.writeText(text);
    const prev = btn.textContent;
    btn.textContent = "Copied";
    btn.disabled = true;
    setTimeout(() => { btn.textContent = prev; btn.disabled = false; }, 1500);
  } catch {
    btn.title = "Clipboard unavailable — copy the address bar instead";
  }
}

// ── Inline "Save view" form (replaces window.prompt) ──────────────────
//
// `form` is a hidden <form class="inline-form"> holding a text input.
// The button reveals it pre-filled; Enter saves, Escape / Cancel closes.

export function bindSaveView({ button, form, defaultName, onSave }) {
  const input = form.querySelector("input[type=text]");
  const cancel = form.querySelector("[data-cancel]");
  const close = () => { form.hidden = true; button.setAttribute("aria-expanded", "false"); button.focus(); };
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", form.id);
  button.addEventListener("click", () => {
    const name = defaultName();
    if (name === null) return;
    form.hidden = false;
    button.setAttribute("aria-expanded", "true");
    input.value = name;
    input.removeAttribute("aria-invalid");
    input.focus();
    input.select();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) { input.setAttribute("aria-invalid", "true"); input.focus(); return; }
    onSave(name);
    close();
  });
  cancel?.addEventListener("click", close);
  form.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); close(); } });
}

// ── Chips + typeahead picker over a native <select multiple> ──────────
//
// The <select> stays the single source of truth: page scripts keep
// reading `select.selectedOptions` and listening for "change". The picker
// mirrors it (MutationObserver catches repopulation), writes selections
// back to the options, and dispatches "change" on the select.
// Keyboard: type to filter · ↑/↓ move · Enter adds/removes · Esc closes ·
// Backspace in an empty field removes the last chip.

let _pickerSeq = 0;

export function enhanceMultiSelect(select, { noun = "item", nouns = `${noun}s`, placeholder = "Type to add…", max = Infinity } = {}) {
  if (!select || select.dataset.enhanced) return null;
  select.dataset.enhanced = "1";
  const id = `picker-${++_pickerSeq}`;
  const label = document.querySelector(`label[for="${select.id}"]`);

  const wrap = document.createElement("div");
  wrap.className = "picker";
  wrap.innerHTML = `
    <div class="picker__meta"><span class="picker__count" aria-live="polite"></span>
      <button type="button" class="picker__clear">Clear all</button></div>
    <ul class="picker__chips" aria-label="Selected ${nouns}"></ul>
    <div class="picker__field">
      <input class="picker__input" type="text" role="combobox" autocomplete="off" spellcheck="false"
             aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-list"
             placeholder="${escapeHtml(placeholder)}">
      <ul class="picker__list" id="${id}-list" role="listbox" aria-multiselectable="true" hidden></ul>
    </div>`;
  select.insertAdjacentElement("afterend", wrap);
  select.hidden = true;
  select.tabIndex = -1;

  const input = wrap.querySelector(".picker__input");
  const list = wrap.querySelector(".picker__list");
  const chips = wrap.querySelector(".picker__chips");
  const count = wrap.querySelector(".picker__count");
  const clearBtn = wrap.querySelector(".picker__clear");
  if (label) { label.htmlFor = input.id = `${id}-input`; }

  let active = -1;
  let matches = [];

  const options = () => [...select.options];
  const emit = () => select.dispatchEvent(new Event("change", { bubbles: true }));

  function renderChips() {
    const sel = [...select.selectedOptions];
    chips.innerHTML = "";
    for (const o of sel) {
      const li = document.createElement("li");
      li.className = "chip";
      li.innerHTML = `<span class="chip__label"></span><button type="button" class="chip__x" aria-label="Remove ${escapeHtml(o.textContent)}">×</button>`;
      li.querySelector(".chip__label").textContent = o.textContent;
      li.querySelector("button").addEventListener("click", () => {
        o.selected = false; renderChips(); emit(); input.focus();
      });
      chips.appendChild(li);
    }
    count.textContent = `${sel.length} ${sel.length === 1 ? noun : nouns} selected`;
    clearBtn.disabled = sel.length === 0;
  }

  function renderList() {
    const q = input.value.trim().toLowerCase();
    matches = options().filter(o => !q || o.textContent.toLowerCase().includes(q) || o.value.toLowerCase() === q);
    const shown = matches.slice(0, 80);
    if (active >= shown.length) active = shown.length - 1;
    list.innerHTML = shown.length ? "" : `<li class="picker__empty">No ${noun} matches “${escapeHtml(input.value)}”</li>`;
    shown.forEach((o, i) => {
      const li = document.createElement("li");
      li.className = "picker__opt" + (i === active ? " is-active" : "");
      li.id = `${id}-opt-${i}`;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", o.selected ? "true" : "false");
      li.innerHTML = `<span></span>${/^[A-Z]{3}$/.test(o.value) ? `<small>${o.value}</small>` : ""}`;
      li.firstChild.textContent = o.textContent;
      li.addEventListener("mousedown", (e) => e.preventDefault());
      li.addEventListener("click", () => { toggle(o); });
      list.appendChild(li);
    });
    if (active >= 0) {
      input.setAttribute("aria-activedescendant", `${id}-opt-${active}`);
      list.querySelector(".is-active")?.scrollIntoView({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
  }

  function open() { list.hidden = false; input.setAttribute("aria-expanded", "true"); renderList(); }
  function close() { list.hidden = true; input.setAttribute("aria-expanded", "false"); active = -1; input.removeAttribute("aria-activedescendant"); }

  function toggle(o) {
    if (!o.selected && select.selectedOptions.length >= max) {
      count.textContent = `At most ${max} ${nouns} — remove one first`;
      return;
    }
    o.selected = !o.selected;
    input.value = "";
    renderChips(); renderList(); emit();
  }

  input.addEventListener("focus", open);
  input.addEventListener("input", () => { active = 0; open(); });
  input.addEventListener("blur", () => setTimeout(close, 120));
  input.addEventListener("keydown", (e) => {
    const n = Math.min(matches.length, 80);
    if (e.key === "ArrowDown") { e.preventDefault(); if (list.hidden) open(); active = Math.min(active + 1, n - 1); renderList(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); renderList(); }
    else if (e.key === "Enter") {
      if (!list.hidden && active >= 0 && matches[active]) { e.preventDefault(); toggle(matches[active]); }
    } else if (e.key === "Escape") { if (!list.hidden) { e.preventDefault(); close(); } }
    else if (e.key === "Backspace" && !input.value) {
      const last = [...select.selectedOptions].at(-1);
      if (last) { last.selected = false; renderChips(); emit(); }
    }
  });
  clearBtn.addEventListener("click", () => {
    options().forEach(o => { o.selected = false; });
    renderChips(); emit(); input.focus();
  });

  // Page scripts rebuild the options (presets) — mirror them.
  new MutationObserver(() => { renderChips(); if (!list.hidden) renderList(); })
    .observe(select, { childList: true, subtree: true });

  renderChips();
  return { refresh: renderChips, input };
}

// ── Friendlier error messages ──────────────────────────────────────────

export function humanizeError(e) {
  const msg = (e && e.message) ? String(e.message) : String(e);
  if (/Failed to fetch|NetworkError|ERR_NETWORK/i.test(msg))
    return "Couldn't reach the World Bank API. Check your connection, then retry.";
  if (/CORS|Access-Control/i.test(msg))
    return "The server blocked the request (CORS). Try again; if it persists, use the optional FastAPI proxy.";
  if (/429|rate/i.test(msg))
    return "Too many requests in a short window — wait a few seconds and retry.";
  if (/NaN|no data|empty/i.test(msg))
    return "No data returned for this selection. Widen the year range or try different countries.";
  return msg;
}

export function errorWithRetry(el, e, retry) {
  if (!el) return;
  const msg = humanizeError(e);
  el.innerHTML = `<div class="error">${escapeHtml(msg)}
    <button class="ev-retry">Retry</button></div>`;
  const btn = el.querySelector(".ev-retry");
  if (btn && typeof retry === "function") btn.addEventListener("click", retry);
}

// ── Keyboard shortcut: `/` focuses the first [data-search] input ────────

export function initSearchHotkey() {
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.target.matches("input, textarea, select")) return;
    const el = document.querySelector("[data-search]");
    if (el) { e.preventDefault(); el.focus(); }
  });
}
