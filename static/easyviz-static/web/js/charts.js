// Chart.js builders — one factory per chart type. Each returns the live
// Chart instance so the caller can .destroy() before re-rendering.
//
// Colour discipline (dataviz rules):
//   • a categorical hue is never reused for two visible series. When a
//     chart has more series than the palette has hues (or more than
//     MAX_COLOURED), a few series are coloured — the reader's picks, or by
//     default the top and bottom FOCUS_EACH by latest value — and the rest
//     recede to a context grey, identified on hover / in the tooltip;
//   • one-series cross-sections (bar, scatter, bubble) take a single hue;
//     colouring 200 countries by cycling 10 hues encodes nothing;
//   • no in-canvas titles (the page heading / paper caption carry them);
//   • numbers use one en-US convention (fmtNum) so axis ticks never
//     change meaning with the reader's locale.
// Axis, grid and text colours come from the design tokens (tokens.css)
// and are re-read when the theme toggles.

import { QUALITATIVE, withAlpha } from "./palettes.js";
import { fmtNum, tokenColor, tokenFont } from "./ui.js";

const MAX_COLOURED = 8;   // never more coloured series than this
const FOCUS_EACH = 3;     // default emphasis: top 3 + bottom 3 by latest value

const C = globalThis.Chart;
if (C) {
  C.defaults.locale = "en-US";
  C.defaults.font.family = tokenFont("--font-body");
  C.defaults.font.size = 12;
}

function theme() {
  return {
    ink:     tokenColor("--color-ink", "rgb(30,33,38)"),
    muted:   tokenColor("--color-muted", "rgb(90,96,105)"),
    grid:    tokenColor("--color-chart-grid", "rgb(228,231,235)"),
    rule:    tokenColor("--color-rule", "rgb(210,214,220)"),
    context: tokenColor("--color-series-context", "rgb(190,195,202)"),
    surface: tokenColor("--color-surface", "rgb(252,253,254)"),
    mono:    tokenFont("--font-mono", "monospace"),
  };
}

function paletteHex(name) {
  return QUALITATIVE[name] || QUALITATIVE.tableau10;
}

function groupByCountry(rows) {
  const by = new Map();
  for (const r of rows) {
    if (!by.has(r.country)) by.set(r.country, []);
    by.get(r.country).push(r);
  }
  for (const rs of by.values()) rs.sort((a, b) => a.year - b.year);
  return by;
}

// ── Shared axis / tooltip styling ───────────────────────────────────────

function tickFormatter(kind) {
  // Keep Chart.js's own tick *selection* (log axes skip minor ticks by
  // returning ""), but print every surviving tick with fmtNum.
  return function (value, index, ticks) {
    const base = C.Ticks.formatters[kind === "logarithmic" ? "logarithmic" : "numeric"]
      .call(this, value, index, ticks);
    return base === "" ? "" : fmtNum(Number(value));
  };
}

function valueAxis(t, { type = "linear", title = "" } = {}) {
  return {
    type,
    border: { color: t.rule },
    grid: { color: t.grid, drawTicks: false },
    ticks: { color: t.muted, padding: 6, font: { family: t.mono, size: 11 }, callback: tickFormatter(type) },
    title: { display: !!title, text: title, color: t.muted, font: { size: 12 } },
  };
}

function yearAxis(t) {
  return {
    type: "linear",
    border: { color: t.rule },
    grid: { display: false },
    ticks: { color: t.muted, stepSize: 5, font: { family: t.mono, size: 11 }, callback: (v) => String(v) },
    title: { display: false },
  };
}

function tooltipStyle(t) {
  return {
    backgroundColor: t.ink,
    titleColor: t.surface,
    bodyColor: t.surface,
    borderWidth: 0,
    cornerRadius: 2,
    padding: 8,
    boxPadding: 4,
    titleFont: { family: t.mono, size: 11, weight: "500" },
    bodyFont: { size: 12 },
  };
}

function legendStyle(t) {
  return {
    position: "bottom",
    align: "start",
    labels: {
      color: t.ink,
      usePointStyle: true,
      pointStyle: "line",
      pointStyleWidth: 22,
      boxWidth: 22,
      boxHeight: 8,
      padding: 12,
      font: { size: 12 },
    },
  };
}

// Re-read the tokens and repaint every live chart (theme toggle, fonts).
function restyle(chart) {
  const t = theme();
  for (const [key, sc] of Object.entries(chart.options.scales || {})) {
    if (!sc) continue;
    if (sc.border) sc.border.color = t.rule;
    if (sc.grid && sc.grid.display !== false) sc.grid.color = t.grid;
    if (sc.ticks) sc.ticks.color = t.muted;
    if (sc.title) sc.title.color = t.muted;
    void key;
  }
  Object.assign(chart.options.plugins.tooltip, tooltipStyle(t));
  if (chart.options.plugins.legend?.labels) chart.options.plugins.legend.labels.color = t.ink;
  for (const ds of chart.data.datasets) {
    const role = ds._ev?.role;
    if (role === "context" || role === "other") { ds.borderColor = t.context; ds.backgroundColor = t.context; }
    else if (role === "agg" || role === "fit") { ds.borderColor = t.ink; ds.backgroundColor = t.ink; }
    else if (role === "aggbar") ds.backgroundColor = ds.data.map((_, i) => ds._ev.isAgg[i] ? t.ink : ds._ev.hue);
    if (ds._ev?.ring) ds.borderColor = t.surface;
  }
  chart.$ev && (chart.$ev.theme = t);
  chart.update("none");
}

if (typeof document !== "undefined" && C) {
  const all = () => Object.values(C.instances || {});
  document.addEventListener("easyviz:theme", () => all().forEach(restyle));
  document.fonts?.ready.then(() => all().forEach(c => c.update("none")));
}

// ── Direct end-labels for the coloured series ───────────────────────────
//
// Supplements (never replaces) the legend. Drawn only when ≤ 6 coloured
// series and the plot is wide enough; colliding labels are pushed apart.

const endLabels = {
  id: "evEndLabels",
  afterDatasetsDraw(chart) {
    const cfg = chart.$ev;
    if (!cfg?.endLabels) return;
    const { ctx, chartArea } = chart;
    const t = cfg.theme;
    const items = [];
    chart.data.datasets.forEach((ds, i) => {
      if (!ds._ev?.label || !chart.isDatasetVisible(i)) return;
      const pts = chart.getDatasetMeta(i).data;
      const last = pts[pts.length - 1];
      if (!last) return;
      items.push({ y: last.y, x: last.x, text: ds.label, color: ds.borderColor });
    });
    items.sort((a, b) => a.y - b.y);
    const gap = 14;
    for (let i = 1; i < items.length; i++) items[i].y = Math.max(items[i].y, items[i - 1].y + gap);
    const overflow = items.length ? items[items.length - 1].y - chartArea.bottom : 0;
    if (overflow > 0) items.forEach(it => { it.y -= overflow; });
    ctx.save();
    ctx.font = `12px ${tokenFont("--font-body")}`;
    ctx.textBaseline = "middle";
    for (const it of items) {
      const x0 = chartArea.right + 6;
      ctx.strokeStyle = it.color;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0, it.y); ctx.lineTo(x0 + 8, it.y); ctx.stroke();
      ctx.fillStyle = t.ink;
      ctx.fillText(it.text, x0 + 12, it.y);
    }
    ctx.restore();
  },
};

// ── Time-series (line / area) ───────────────────────────────────────────
//
// opts.highlight — keys (iso3, or entity name when no iso3) the reader
//   chose to colour; used only when the chart is in emphasis mode.
// opts.onPick(key) — called when the reader clicks a series in emphasis
//   mode; the page owns the highlight state and re-renders.
// The returned chart carries `chart.$ev = { focus, highlighted, total }`.

export function makeLine(canvas, rows, indicator, { yLog = false, fill = false, palette = "tableau10", highlight = null, onPick = null } = {}) {
  const t = theme();
  const hex = paletteHex(palette);
  const cap = Math.min(hex.length, MAX_COLOURED);
  const keyOf = (rs, name) => rs[0]?.iso3 || name;

  const entries = [...groupByCountry(rows).entries()];
  const series = entries.filter(([, rs]) => rs[0]?.iso3 !== "AGG");
  const aggs = entries.filter(([, rs]) => rs[0]?.iso3 === "AGG");
  const focus = series.length > cap;

  // Which series get a hue, in a stable order (colour follows the entity).
  let coloured;
  if (!focus) {
    coloured = series.map(([name, rs]) => keyOf(rs, name));
  } else {
    const valid = new Set(series.map(([name, rs]) => keyOf(rs, name)));
    const picked = (highlight || []).filter(k => valid.has(k)).slice(-cap);
    if (picked.length) coloured = picked;
    else {
      const latest = series
        .map(([name, rs]) => ({ key: keyOf(rs, name), v: [...rs].reverse().find(r => Number.isFinite(r.value))?.value }))
        .filter(d => Number.isFinite(d.v))
        .sort((a, b) => b.v - a.v);
      const n = Math.min(FOCUS_EACH, Math.floor(cap / 2));
      const pick = [...latest.slice(0, n), ...latest.slice(-n)].map(d => d.key);
      const want = new Set(pick);
      coloured = series.map(([name, rs]) => keyOf(rs, name)).filter(k => want.has(k));
    }
  }
  const hueOf = new Map(coloured.map((k, i) => [k, hex[i]]));
  const showEndLabels = coloured.length + aggs.length <= 6 && (canvas.parentElement?.clientWidth || 0) >= 560;

  const point = (rs) => rs.map(r => ({ x: r.year, y: r.value, n: r.n }));
  const datasets = [];
  for (const [name, rs] of series) {
    const key = keyOf(rs, name);
    const hue = hueOf.get(key);
    if (hue) {
      datasets.push({
        label: name, data: point(rs),
        borderColor: hue, backgroundColor: fill ? withAlpha(hue, 0.14) : hue,
        fill, borderWidth: 2, tension: 0.15,
        pointRadius: rs.length < 3 ? 3 : 0, pointHoverRadius: 4,
        pointBackgroundColor: hue, pointBorderColor: hue,
        order: 1, _ev: { role: "series", key, label: showEndLabels },
      });
    } else {
      datasets.push({
        label: name, data: point(rs),
        borderColor: t.context, backgroundColor: t.context,
        fill: false, borderWidth: 1, tension: 0.15,
        pointRadius: rs.length < 3 ? 2 : 0, pointHoverRadius: 3,
        order: 3, _ev: { role: "context", key },
      });
    }
  }
  for (const [name, rs] of aggs) {
    datasets.push({
      label: name, data: point(rs),
      borderColor: t.ink, backgroundColor: t.ink,
      fill: false, borderWidth: 2.5, borderDash: series.length ? [6, 3] : [],
      tension: 0.15, pointRadius: rs.length < 3 ? 3 : 0, pointHoverRadius: 4,
      order: 0, _ev: { role: "agg", key: name, label: showEndLabels },
    });
  }
  const nContext = focus ? series.length - coloured.length : 0;
  if (nContext) {
    datasets.push({
      label: `Other ${series[0]?.[1]?.[0]?.iso3 ? "countries" : "series"} (${nContext}) — hover to identify`,
      data: [], borderColor: t.context, backgroundColor: t.context, borderWidth: 1,
      order: 9, _ev: { role: "other" },
    });
  }

  const unit = indicator.unit ? ` ${indicator.unit}` : "";
  let hovered = null;
  const meta = { theme: t, focus, highlighted: coloured, total: series.length, cap, endLabels: showEndLabels };
  const chart = new C(canvas, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: false,
      layout: { padding: { right: showEndLabels ? labelRoom(datasets) : 8, top: 4 } },
      interaction: { mode: "nearest", intersect: false },
      scales: {
        x: yearAxis(t),
        y: valueAxis(t, { type: yLog ? "logarithmic" : "linear", title: indicator.unit }),
      },
      plugins: {
        title: { display: false },
        legend: {
          ...legendStyle(t),
          display: datasets.length > 1,
          labels: { ...legendStyle(t).labels, filter: (item, data) => data.datasets[item.datasetIndex]?._ev?.role !== "context" },
          onClick(e, item, legend) {
            const ds = legend.chart.data.datasets[item.datasetIndex];
            if (ds?._ev?.role === "other") {
              const ch = legend.chart;
              const hide = ch.data.datasets.some((d, i) => d._ev?.role === "context" && ch.isDatasetVisible(i));
              ch.data.datasets.forEach((d, i) => { if (d._ev?.role === "context") ch.setDatasetVisibility(i, !hide); });
              ds.hidden = hide;
              ch.update();
              return;
            }
            C.defaults.plugins.legend.onClick.call(this, e, item, legend);
          },
        },
        tooltip: {
          ...tooltipStyle(t),
          filter: (item) => item.dataset._ev?.role !== "other",
          callbacks: {
            title: (items) => items.length ? String(items[0].raw.x) : "",
            label: (ctx) => `${ctx.dataset.label}: ${fmtNum(ctx.raw.y)}${unit}` +
              (Number.isFinite(ctx.raw.n) ? ` (N = ${ctx.raw.n} countries)` : ""),
          },
        },
      },
      onHover(evt, elements, ch) {
        const el = elements[0];
        const ds = el ? ch.data.datasets[el.datasetIndex] : null;
        const target = ds?._ev?.role === "context" ? ds : null;
        if (target !== hovered) {
          if (hovered) { hovered.borderColor = ch.$ev.theme.context; hovered.borderWidth = 1; hovered.order = 3; }
          if (target) { target.borderColor = ch.$ev.theme.ink; target.borderWidth = 2; target.order = -1; }
          hovered = target;
          ch.update("none");
        }
        evt.native.target.style.cursor = (focus && onPick && ds && ds._ev?.role !== "agg") ? "pointer" : "default";
      },
      onClick(evt, elements, ch) {
        if (!focus || !onPick) return;
        const el = ch.getElementsAtEventForMode(evt, "nearest", { intersect: false }, true)[0];
        const ds = el ? ch.data.datasets[el.datasetIndex] : null;
        if (ds && (ds._ev?.role === "series" || ds._ev?.role === "context")) onPick(ds._ev.key);
      },
    },
    plugins: [{ id: "evMeta", beforeInit(c) { c.$ev = meta; } }, endLabels],
  });
  return chart;
}

function labelRoom(datasets) {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = `12px ${tokenFont("--font-body")}`;
  const w = Math.max(0, ...datasets.filter(d => d._ev?.label).map(d => ctx.measureText(d.label).width));
  return Math.min(Math.ceil(w) + 24, 200);
}

// ── Single-year cross-country bar ───────────────────────────────────────

export function makeBar(canvas, rows, indicator, { year = null, palette = "tableau10" } = {}) {
  // If year is null, use the latest year that has the most countries
  // (the "most complete" cross-section).
  const t = theme();
  const byYear = new Map();
  for (const r of rows) {
    if (!byYear.has(r.year)) byYear.set(r.year, []);
    byYear.get(r.year).push(r);
  }
  if (year === null) {
    const entries = [...byYear.entries()].sort((a, b) => b[1].length - a[1].length || b[0] - a[0]);
    year = entries[0]?.[0];
  }
  const slice = (byYear.get(year) || []).slice().sort((a, b) => b.value - a.value);
  const hue = paletteHex(palette)[0];
  const isAgg = slice.map(r => r.iso3 === "AGG");
  const horizontal = slice.length > 10;
  const unit = indicator.unit ? ` ${indicator.unit}` : "";
  const valueScale = valueAxis(t, { title: indicator.unit });
  const catScale = { border: { color: t.rule }, grid: { display: false }, ticks: { color: t.ink, autoSkip: false, font: { size: 11 } } };
  return new C(canvas, {
    type: "bar",
    data: {
      labels: slice.map(r => r.country),
      datasets: [{
        label: `${year}`,
        data: slice.map(r => r.value),
        n: slice.map(r => r.n),
        backgroundColor: slice.map((_, i) => isAgg[i] ? t.ink : hue),
        borderRadius: 3,
        borderSkipped: "start",
        maxBarThickness: 28,
        _ev: { role: "aggbar", isAgg, hue },
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: false,
      indexAxis: horizontal ? "y" : "x",
      scales: horizontal ? { x: valueScale, y: catScale } : { x: catScale, y: valueScale },
      plugins: {
        title: { display: false },
        legend: { display: false },
        tooltip: {
          ...tooltipStyle(t),
          callbacks: {
            title: (items) => items.length ? `${items[0].label}, ${year}` : "",
            label: (ctx) => {
              const n = ctx.dataset.n?.[ctx.dataIndex];
              return `${fmtNum(ctx.raw)}${unit}` + (Number.isFinite(n) ? ` (N = ${n} countries)` : "");
            },
          },
        },
      },
    },
  });
}

// ── Cross-section scatter (+ optional OLS overlay) ─────────────────────

const axisType = (log) => log ? "logarithmic" : "linear";
const axisTitle = (ind) => `${ind.name}${ind.unit && !ind.name.includes(ind.unit) && !/\)$/.test(ind.name) ? ` (${ind.unit})` : ""}`;

function pointLabel(ctx) {
  const r = ctx.raw;
  const xy = `${fmtNum(r.x)}, ${fmtNum(r.y)}`;
  return r.country ? `${r.country}: ${xy}${Number.isFinite(r.size) ? ` · size ${fmtNum(r.size)}` : ""}` : xy;
}

export function makeScatter(canvas, points, indA, indB, year, { fit = null, palette = "tableau10", xLog = false, yLog = false } = {}) {
  const t = theme();
  const hue = paletteHex(palette)[0];
  const datasets = [{
    label: `Countries, ${year}`,
    data: points.map(p => ({ x: p.x, y: p.y, iso3: p.iso3, country: p.country })),
    backgroundColor: withAlpha(hue, 0.8),
    borderColor: t.surface,
    borderWidth: 1.5,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointHitRadius: 8,
    _ev: { role: "points", ring: true },
  }];
  if (fit) {
    datasets.push({
      label: `OLS fit (R² = ${fit.r2.toFixed(2)})`,
      data: fit.line,
      type: "line",
      borderColor: t.ink,
      backgroundColor: t.ink,
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
      _ev: { role: "fit" },
    });
  }
  return new C(canvas, {
    type: "scatter",
    data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: false,
      scales: {
        x: valueAxis(t, { type: axisType(xLog), title: axisTitle(indA) }),
        y: valueAxis(t, { type: axisType(yLog), title: axisTitle(indB) }),
      },
      plugins: {
        title: { display: false },
        legend: { ...legendStyle(t), display: !!fit, labels: { ...legendStyle(t).labels, pointStyle: "circle", pointStyleWidth: 8, boxWidth: 8, boxHeight: 8 } },
        tooltip: { ...tooltipStyle(t), callbacks: { label: pointLabel } },
      },
    },
  });
}

// ── Bubble (X, Y, size) ────────────────────────────────────────────────

export function makeBubble(canvas, points, indA, indB, indSize, year, { palette = "tableau10", xLog = false, yLog = false } = {}) {
  if (!points.length) return null;
  const t = theme();
  const sizes = points.map(p => p.size);
  const sMin = Math.min(...sizes), sMax = Math.max(...sizes);
  const scale = (s) => 4 + 26 * ((s - sMin) / Math.max(1e-9, sMax - sMin));
  const hue = paletteHex(palette)[0];
  return new C(canvas, {
    type: "bubble",
    data: {
      datasets: [{
        label: `${year}`,
        data: points.map(p => ({ x: p.x, y: p.y, r: scale(p.size), country: p.country, size: p.size })),
        backgroundColor: withAlpha(hue, 0.5),
        borderColor: t.surface,
        borderWidth: 1,
        _ev: { role: "points", ring: true },
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: false,
      scales: {
        x: valueAxis(t, { type: axisType(xLog), title: axisTitle(indA) }),
        y: valueAxis(t, { type: axisType(yLog), title: axisTitle(indB) }),
      },
      plugins: {
        title: { display: false },
        legend: { display: false },
        tooltip: { ...tooltipStyle(t), callbacks: { label: pointLabel } },
      },
    },
  });
}

// ── Gapminder (Chart.js scatter, user drives year via slider) ──────────
//
// Returns a controller object: {chart, setYear(), years}. The year being
// shown lives in the slider label next to the chart (no in-canvas title).

export function makeGapminder(canvas, panel, indA, indB, indSize, { palette = "tableau10", xLog = false, yLog = false } = {}) {
  const t = theme();
  const hue = paletteHex(palette)[0];
  const years = [...new Set(panel.map(p => p.year))].sort();
  // Fix axis ranges across years so bubbles "move" rather than rescale.
  const xs = panel.map(p => p.x), ys = panel.map(p => p.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  // 5% padding — multiplicative on log axes (additive could go ≤ 0).
  const pad = (lo, hi, log) => log ? [lo / 1.1, hi * 1.1] : [lo - (hi - lo) * 0.05, hi + (hi - lo) * 0.05];
  const [xLo, xHi] = pad(xMin, xMax, xLog);
  const [yLo, yHi] = pad(yMin, yMax, yLog);

  let currentYear = years[years.length - 1];
  const sMin = indSize ? Math.min(...panel.map(p => p.size ?? 1)) : 0;
  const sMax = indSize ? Math.max(...panel.map(p => p.size ?? 1)) : 1;
  const scale = (s) => indSize
    ? 4 + 26 * ((s - sMin) / Math.max(1e-9, sMax - sMin))
    : 5;

  function dataForYear(y) {
    return panel.filter(p => p.year === y).map(p => ({
      x: p.x, y: p.y,
      r: scale(p.size ?? 1),
      country: p.country, year: p.year, size: p.size,
    }));
  }

  const xAxis = valueAxis(t, { type: axisType(xLog), title: axisTitle(indA) });
  const yAxis = valueAxis(t, { type: axisType(yLog), title: axisTitle(indB) });
  Object.assign(xAxis, { min: xLo, max: xHi });
  Object.assign(yAxis, { min: yLo, max: yHi });

  const chart = new C(canvas, {
    type: "bubble",
    data: {
      datasets: [{
        label: String(currentYear),
        data: dataForYear(currentYear),
        backgroundColor: withAlpha(hue, 0.55),
        borderColor: t.surface,
        borderWidth: 1,
        _ev: { role: "points", ring: true },
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 400 },
      scales: { x: xAxis, y: yAxis },
      plugins: {
        title: { display: false },
        legend: { display: false },
        tooltip: { ...tooltipStyle(t), callbacks: { title: (items) => items.length ? String(items[0].raw.year) : "", label: pointLabel } },
      },
    },
  });

  function setYear(y) {
    currentYear = y;
    chart.data.datasets[0].label = String(y);
    chart.data.datasets[0].data = dataForYear(y);
    chart.update();
  }

  return { chart, setYear, years };
}
