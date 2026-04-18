// Chart.js builders — one factory per chart type. Each returns the live
// Chart instance so the caller can .destroy() before re-rendering.

const PALETTE = [
  "#2d5fd9", "#d9532d", "#2dd98f", "#d9b62d", "#9c2dd9",
  "#2dc5d9", "#d92d7a", "#6bd92d", "#d9752d", "#2d34d9",
  "#d92d2d", "#2dd9c5", "#b0d92d", "#752dd9", "#d92db0",
  "#3e7a8c", "#8c3e3e", "#8c7a3e", "#3e8c5a", "#5a3e8c",
];

const colorFor = (i) => PALETTE[i % PALETTE.length];

function groupByCountry(rows) {
  const by = new Map();
  for (const r of rows) {
    if (!by.has(r.country)) by.set(r.country, []);
    by.get(r.country).push(r);
  }
  for (const rs of by.values()) rs.sort((a, b) => a.year - b.year);
  return by;
}

// ── Time-series (line / bar / area) ────────────────────────────────────

export function makeLine(canvas, rows, indicator, { yLog = false, fill = false } = {}) {
  const byCountry = groupByCountry(rows);
  const datasets = [...byCountry.entries()].map(([country, rs], i) => ({
    label: country,
    data: rs.map(r => ({ x: r.year, y: r.value })),
    borderColor: colorFor(i),
    backgroundColor: fill ? colorFor(i) + "33" : colorFor(i),
    fill,
    tension: 0.15,
    pointRadius: 2,
  }));
  return new Chart(canvas, {
    type: "line",
    data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: "nearest", intersect: false },
      scales: {
        x: { type: "linear", ticks: { stepSize: 5 }, title: { display: true, text: "Year" } },
        y: { type: yLog ? "logarithmic" : "linear", title: { display: true, text: indicator.unit } },
      },
      plugins: {
        title: { display: true, text: indicator.name },
        legend: { position: "right" },
      },
    },
  });
}

export function makeBar(canvas, rows, indicator, { year = null } = {}) {
  // Single-year cross-country bar. If year is null, use the latest year
  // that has the most countries (the "most complete" cross-section).
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
  return new Chart(canvas, {
    type: "bar",
    data: {
      labels: slice.map(r => r.country),
      datasets: [{
        label: `${year}`,
        data: slice.map(r => r.value),
        backgroundColor: slice.map((_, i) => colorFor(i)),
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: slice.length > 10 ? "y" : "x",
      scales: { y: { title: { display: true, text: indicator.unit } } },
      plugins: {
        title: { display: true, text: `${indicator.name} — ${year}` },
        legend: { display: false },
      },
    },
  });
}

// ── Cross-section scatter (+ optional OLS overlay) ─────────────────────

export function makeScatter(canvas, points, indA, indB, year, { fit = null } = {}) {
  const datasets = [{
    label: `${year}`,
    data: points.map(p => ({ x: p.x, y: p.y, iso3: p.iso3, country: p.country })),
    backgroundColor: "#2d5fd9",
    pointRadius: 4,
  }];
  if (fit) datasets.push({
    label: `OLS (R²=${fit.r2.toFixed(2)})`,
    data: fit.line,
    type: "line",
    borderColor: "#d9532d",
    borderWidth: 2,
    pointRadius: 0,
    fill: false,
  });
  return new Chart(canvas, {
    type: "scatter",
    data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: `${indA.name} (${indA.unit})` } },
        y: { title: { display: true, text: `${indB.name} (${indB.unit})` } },
      },
      plugins: {
        title: { display: true, text: `${indA.name} vs. ${indB.name}, ${year}` },
        legend: { display: !!fit },
        tooltip: {
          callbacks: {
            label: ctx => ctx.raw.country
              ? `${ctx.raw.country}: (${ctx.raw.x.toFixed(2)}, ${ctx.raw.y.toFixed(2)})`
              : `(${ctx.raw.x.toFixed(2)}, ${ctx.raw.y.toFixed(2)})`,
          },
        },
      },
    },
  });
}

// ── Bubble (X, Y, size) ────────────────────────────────────────────────

export function makeBubble(canvas, points, indA, indB, indSize, year) {
  if (!points.length) return null;
  const sizes = points.map(p => p.size);
  const sMin = Math.min(...sizes), sMax = Math.max(...sizes);
  const scale = (s) => 4 + 26 * ((s - sMin) / Math.max(1e-9, sMax - sMin));
  return new Chart(canvas, {
    type: "bubble",
    data: {
      datasets: [{
        label: `${year}`,
        data: points.map(p => ({ x: p.x, y: p.y, r: scale(p.size), country: p.country, size: p.size })),
        backgroundColor: "#2d5fd988",
        borderColor: "#2d5fd9",
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: `${indA.name} (${indA.unit})` } },
        y: { title: { display: true, text: `${indB.name} (${indB.unit})` } },
      },
      plugins: {
        title: { display: true, text: `${indA.name} vs. ${indB.name}, size=${indSize.name}, ${year}` },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw.country}: (${ctx.raw.x.toFixed(1)}, ${ctx.raw.y.toFixed(1)}) · size=${ctx.raw.size.toFixed(1)}`,
          },
        },
      },
    },
  });
}

// ── Gapminder (Chart.js scatter, user drives year via slider) ──────────
//
// Chart.js has an `animation_frame` equivalent via `animations` config,
// but the cleanest UX is a manual year slider that re-renders. This
// function returns a controller object: {chart, setYear()}.

export function makeGapminder(canvas, panel, indA, indB, indSize) {
  const years = [...new Set(panel.map(p => p.year))].sort();
  // Fix axis ranges across years so bubbles "move" rather than rescale.
  const xs = panel.map(p => p.x), ys = panel.map(p => p.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  const pad = (lo, hi) => [lo - (hi - lo) * 0.05, hi + (hi - lo) * 0.05];
  const [xLo, xHi] = pad(xMin, xMax);
  const [yLo, yHi] = pad(yMin, yMax);

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

  const chart = new Chart(canvas, {
    type: "bubble",
    data: {
      datasets: [{
        label: String(currentYear),
        data: dataForYear(currentYear),
        backgroundColor: "#2d5fd988",
        borderColor: "#2d5fd9",
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 400 },
      scales: {
        x: { min: xLo, max: xHi, title: { display: true, text: `${indA.name} (${indA.unit})` } },
        y: { min: yLo, max: yHi, title: { display: true, text: `${indB.name} (${indB.unit})` } },
      },
      plugins: {
        title: { display: true, text: `${indA.name} vs. ${indB.name} · ${currentYear}` },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw.country}: (${ctx.raw.x.toFixed(1)}, ${ctx.raw.y.toFixed(1)})`,
          },
        },
      },
    },
  });

  function setYear(y) {
    currentYear = y;
    chart.data.datasets[0].label = String(y);
    chart.data.datasets[0].data = dataForYear(y);
    chart.options.plugins.title.text = `${indA.name} vs. ${indB.name} · ${y}`;
    chart.update();
  }

  return { chart, setYear, years };
}
