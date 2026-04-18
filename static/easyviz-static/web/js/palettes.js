// Shared palette registry — single source of truth for browser rendering
// and R/Python codegen. Two families:
//
//   QUALITATIVE  — discrete hues, one per series. Used by line / scatter /
//                  bubble / gapminder / bar.
//   SEQUENTIAL   — smooth ramps (includes diverging variants). Used by
//                  choropleth maps and correlation heatmaps.
//
// All qualitative palettes are emitted to R/Python as explicit hex vectors
// to guarantee byte-for-byte visual parity between the browser and a
// downloaded replication script.

// ── Qualitative (categorical) ──────────────────────────────────────────

export const QUALITATIVE = {
  tableau10: ["#4E79A7","#F28E2B","#E15759","#76B7B2","#59A14F","#EDC948","#B07AA1","#FF9DA7","#9C755F","#BAB0AC"],
  okabeito:  ["#E69F00","#56B4E9","#009E73","#F0E442","#0072B2","#D55E00","#CC79A7","#000000"],
  set1:      ["#E41A1C","#377EB8","#4DAF4A","#984EA3","#FF7F00","#FFC300","#A65628","#F781BF","#999999"],
  set2:      ["#66C2A5","#FC8D62","#8DA0CB","#E78AC3","#A6D854","#FFD92F","#E5C494","#B3B3B3"],
  dark2:     ["#1B9E77","#D95F02","#7570B3","#E7298A","#66A61E","#E6AB02","#A6761D","#666666"],
  pastel:    ["#FBB4AE","#B3CDE3","#CCEBC5","#DECBE4","#FED9A6","#FFFFCC","#E5D8BD","#FDDAEC","#F2F2F2"],
  bright:    ["#2d5fd9","#d9532d","#2dd98f","#d9b62d","#9c2dd9","#2dc5d9","#d92d7a","#6bd92d","#d9752d","#2d34d9"],
};

export const QUAL_LABELS = {
  tableau10: "Tableau 10 (default)",
  okabeito:  "Okabe–Ito (colourblind-safe)",
  set1:      "ColorBrewer Set1",
  set2:      "ColorBrewer Set2",
  dark2:     "ColorBrewer Dark2",
  pastel:    "ColorBrewer Pastel",
  bright:    "Bright",
};

// Return `n` colors from the named qualitative palette. Cycles with a
// hue shift if n exceeds the palette's native length.
export function qualColors(name = "tableau10", n = 10) {
  const pal = QUALITATIVE[name] || QUALITATIVE.tableau10;
  if (n <= pal.length) return pal.slice(0, n);
  const out = [];
  for (let i = 0; i < n; i++) out.push(pal[i % pal.length]);
  return out;
}

// Add an alpha channel to a hex color (used by Chart.js fill).
export function withAlpha(hex, alpha = 0.2) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Sequential + diverging ─────────────────────────────────────────────

export const SEQUENTIAL = {
  viridis:  { kind: "sequential", stops: [[68,1,84],[59,82,139],[33,145,140],[94,201,98],[253,231,37]] },
  plasma:   { kind: "sequential", stops: [[13,8,135],[126,3,168],[204,71,120],[248,149,64],[240,249,33]] },
  magma:    { kind: "sequential", stops: [[0,0,4],[80,18,123],[182,54,121],[252,137,97],[252,253,191]] },
  inferno:  { kind: "sequential", stops: [[0,0,4],[87,15,109],[187,55,84],[249,142,9],[252,255,164]] },
  cividis:  { kind: "sequential", stops: [[0,32,76],[35,83,130],[124,123,120],[189,180,107],[255,234,70]] },
  turbo:    { kind: "sequential", stops: [[48,18,59],[59,187,207],[124,231,83],[247,212,59],[180,27,38]] },
  blues:    { kind: "sequential", stops: [[247,251,255],[198,219,239],[107,174,214],[33,113,181],[8,48,107]] },
  greens:   { kind: "sequential", stops: [[247,252,245],[199,233,192],[116,196,118],[35,139,69],[0,68,27]] },
  oranges:  { kind: "sequential", stops: [[255,245,235],[253,208,162],[253,141,60],[217,72,1],[127,39,4]] },
  reds:     { kind: "sequential", stops: [[255,245,240],[252,187,161],[251,106,74],[203,24,29],[103,0,13]] },
  greys:    { kind: "sequential", stops: [[255,255,255],[217,217,217],[150,150,150],[82,82,82],[0,0,0]] },
  rdbu:     { kind: "diverging",  stops: [[103,0,31],[239,138,98],[253,219,199],[209,229,240],[103,169,207],[5,48,97]] },
  piyg:     { kind: "diverging",  stops: [[142,1,82],[233,163,201],[253,224,239],[230,245,208],[127,188,65],[39,100,25]] },
  brbg:     { kind: "diverging",  stops: [[84,48,5],[216,179,101],[246,232,195],[199,234,229],[90,180,172],[0,60,48]] },
  spectral: { kind: "diverging",  stops: [[158,1,66],[244,109,67],[254,224,139],[230,245,152],[102,194,165],[94,79,162]] },
};

export const SEQ_LABELS = {
  viridis: "Viridis", plasma: "Plasma", magma: "Magma", inferno: "Inferno",
  cividis: "Cividis (colourblind-safe)", turbo: "Turbo",
  blues: "Blues", greens: "Greens", oranges: "Oranges", reds: "Reds", greys: "Greys",
  rdbu: "Red–Blue (diverging)", piyg: "Pink–Green (diverging)",
  brbg: "Brown–Teal (diverging)", spectral: "Spectral (diverging)",
};

export function continuousColor(t, name = "viridis", reverse = false) {
  if (!Number.isFinite(t)) return "#d0d0d0";
  t = Math.max(0, Math.min(1, t));
  if (reverse) t = 1 - t;
  const p = SEQUENTIAL[name] || SEQUENTIAL.viridis;
  const stops = p.stops;
  const x = t * (stops.length - 1);
  const i = Math.floor(x), f = x - i;
  const a = stops[i], b = stops[Math.min(i + 1, stops.length - 1)];
  const r = Math.round(a[0] + (b[0] - a[0]) * f);
  const g = Math.round(a[1] + (b[1] - a[1]) * f);
  const bl = Math.round(a[2] + (b[2] - a[2]) * f);
  return `rgb(${r},${g},${bl})`;
}

// ── R / Python emission helpers ────────────────────────────────────────

// Qualitative scales: emit a manual hex vector so the R plot matches the
// browser exactly, regardless of the palette's origin.
export function qualRScale(name = "tableau10", aes = "colour") {
  const hex = QUALITATIVE[name] || QUALITATIVE.tableau10;
  const fn = aes === "fill" ? "scale_fill_manual" : "scale_colour_manual";
  return `${fn}(values = c(${hex.map(h => `"${h}"`).join(", ")}))`;
}

// Python: matplotlib accepts a list-of-colors via ListedColormap; easier
// to just cycle a color list for categorical plots.
export function qualPyHexList(name = "tableau10") {
  const hex = QUALITATIVE[name] || QUALITATIVE.tableau10;
  return hex.map(h => `"${h}"`).join(", ");
}

// Sequential/diverging R scale calls (for geom_sf, heatmaps etc.).
const R_SEQ_CALL = {
  viridis:  `scale_fill_viridis_c(option = "viridis"`,
  plasma:   `scale_fill_viridis_c(option = "plasma"`,
  magma:    `scale_fill_viridis_c(option = "magma"`,
  inferno:  `scale_fill_viridis_c(option = "inferno"`,
  cividis:  `scale_fill_viridis_c(option = "cividis"`,
  turbo:    `scale_fill_viridis_c(option = "turbo"`,
  blues:    `scale_fill_distiller(palette = "Blues", direction = 1`,
  greens:   `scale_fill_distiller(palette = "Greens", direction = 1`,
  oranges:  `scale_fill_distiller(palette = "Oranges", direction = 1`,
  reds:     `scale_fill_distiller(palette = "Reds", direction = 1`,
  greys:    `scale_fill_distiller(palette = "Greys", direction = 1`,
  rdbu:     `scale_fill_distiller(palette = "RdBu", direction = 1`,
  piyg:     `scale_fill_distiller(palette = "PiYG", direction = 1`,
  brbg:     `scale_fill_distiller(palette = "BrBG", direction = 1`,
  spectral: `scale_fill_distiller(palette = "Spectral", direction = 1`,
};

const PY_SEQ_NAME = {
  viridis: "viridis", plasma: "plasma", magma: "magma", inferno: "inferno",
  cividis: "cividis", turbo: "turbo",
  blues: "Blues", greens: "Greens", oranges: "Oranges", reds: "Reds", greys: "Greys",
  rdbu: "RdBu", piyg: "PiYG", brbg: "BrBG", spectral: "Spectral",
};

export function seqRCall(name = "viridis") {
  return R_SEQ_CALL[name] || R_SEQ_CALL.viridis;
}

export function seqPyName(name = "viridis") {
  return PY_SEQ_NAME[name] || "viridis";
}

export function seqKind(name = "viridis") {
  return (SEQUENTIAL[name] || SEQUENTIAL.viridis).kind;
}
