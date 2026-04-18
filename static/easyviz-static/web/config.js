// Runtime config for the static build.
//
// Everything is optional. The site works out of the box with:
//   • api.worldbank.org for WDI data (CORS-open, direct from browser)
//   • Fuse.js / Chart.js / PapaParse / SheetJS from jsDelivr
//
// Deployment tip: to host under a subpath (e.g. `/easyviz/` on your
// Hugo site), copy the entire `web/` directory into Hugo's `static/`
// folder as `static/easyviz/`. No path rewriting needed — every asset
// reference in the HTML is relative.
window.EASYVIZ_CONFIG = {
  // Optional proxy. If set, `/indicators` / `/data` / `/compare` hit
  // your FastAPI instead of WB. Leave null for pure-static deployment.
  proxyBase: null,              // e.g. "https://easyviz-api.onrender.com"

  // Default indicator when landing on /chart.html without ?id=
  defaultIndicatorId: "gdp_pc_ppp",

  // Default preset when the chart page first loads
  defaultPreset: "Default (20 diverse)",

  // Default palettes. `qualPalette` drives line / scatter / bubble / bar
  // series colors; `seqPalette` drives choropleth maps and correlation
  // heatmaps. Valid values are listed in web/js/palettes.js.
  defaultQualPalette: "tableau10",
  defaultSeqPalette: "viridis",
};
