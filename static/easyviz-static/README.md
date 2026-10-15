# easyviz-static

Paulgp-style architecture applied to **EasyViz**: a plain HTML + vanilla JS
+ Chart.js frontend, loads in <1 s from a static host, no Streamlit cold
start, embeds in a blog post as a simple iframe or `<script>` tag.

All Streamlit-EasyViz features ported — plus a research-grade upgrade
layer (aggregations, maps, R/Python replication):

- **Search** — 100+ curated WDI indicators, fuzzy-searched via Fuse.js;
  optional one-click extension to the full WDI taxonomy (~1,500 codes, source 2)
  (cached to `localStorage` for a week).
- **Chart** — line/area/bar, country presets (OECD / EU27 / SSA /
  BRICS / G7 / LDC / LMIC / G20 / Default-20 / All), year range, log
  scale, cross-country summary stats for the latest year, download
  CSV, shareable URL. With many countries, six series are coloured
  (top/bottom 3 by latest value, or click to choose) and the rest grey.
- **WB aggregates excluded everywhere** — rows are filtered to the 217
  economies in `/v2/country` (`region.id != "NA"`); R/Python snippets
  apply the same rule.
- **Temporal transforms** — year-aware (gaps are never bridged): 5-year
  centred moving average (≥3 obs), decade means (≥5 of 10 years),
  year-on-year growth, rolling 5-year CAGR, index (base year = 100).
- **Entity aggregation** — collapse a multi-country selection into a
  single series per year: unweighted mean, median, sum, or
  population-/GDP-weighted mean (weights fetched live from WDI).
  Optional balanced panel; per-year N reported in caption and tooltip.
- **Compare** — five tabs: scatter · bubble (size = third indicator) ·
  OLS regression with HC1 robust SEs, 95% CI, t(n−2) p-values ·
  Gapminder-style animated bubble chart · **pairwise correlation
  matrix** (Pearson/Spearman) with per-cell N. Log X / log Y axes
  (the regression is then fitted on logs).
- **Map** — choropleth on Natural-Earth 110m boundaries, Equal Earth
  projection; year slider with play button; quantile (default) /
  linear / log colour scale with numeric breaks; "latest available
  year" auto-pick; hover tooltip.
- **Upload** — drop CSV / Excel; auto-detect columns; wide→long
  reshape; ISO3 resolution — identical to the Streamlit uploader.
- **Conflict** — local CSV aggregation (UCDP/HDX-shaped), with a note
  on live-mode options.
- **⟨/⟩ Show R / Python code** — every chart, map, regression, and
  correlation matrix emits a copy-pasteable R snippet (`WDI` +
  `tidyverse` + `ggplot2`, plus `sf`/`rnaturalearth` for maps) and a
  parallel Python snippet (`wbdata` + `pandas` + `matplotlib`, plus
  `geopandas` for maps). Snippets reflect the current UI state:
  countries, year range, transform, aggregation.
- **Methodology caption** — one-sentence footnote generated for every
  chart, ready to paste into a paper.
- **Missing-data diagnostics** — collapsible panel on Chart showing
  coverage by year and lowest-coverage countries before you draw
  conclusions from thin samples.
- **Citation generator** — BibTeX + APA block for the active
  indicator, dated to the access day.
- **Saved views** — name the current view and revisit it later;
  persisted in `localStorage`, per-page. Export/import as JSON to
  share with coauthors.
- **URL state** — every control round-trips through query params.
- **Embed mode** — append `?embed=1` to strip chrome for iframes.
- **Dark mode** — respects `prefers-color-scheme`, toggleable.
- **Keyboard** — `/` focuses the search box.

## How it works

The browser talks to `api.worldbank.org` directly — the WB API sends
permissive CORS, so no backend is required. UCDP and HDX require auth
or same-origin CORS, so those are delivered as "upload your own CSV"
instead of live fetches.

An optional FastAPI proxy lives in `api/` for devs who want server-side
caching or a UCDP auth-equipped proxy route. Point `config.js →
proxyBase` at it to route through.

## Quick start (local dev)

```bash
cd web
python -m http.server 8001     # open http://127.0.0.1:8001
```

That's it. No build step, no npm install.

For the optional FastAPI proxy:

```bash
cd api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload   # http://127.0.0.1:8000
```

## Deploying as a subpage of a Hugo site

Your site is Hugo + Netlify. To expose this tool at e.g.
`your-site.com/easyviz/`:

1. Copy the `web/` directory into your Hugo repo's `static/` folder
   and rename it to `easyviz/`:
   ```bash
   cp -R web/ /path/to/your-hugo-site/static/easyviz
   ```
2. Commit and push. Hugo copies `static/` verbatim on build, so
   Netlify will serve `/easyviz/index.html` unchanged.
3. All asset paths inside the HTML are relative (`./style.css`,
   `./js/...`), so the page works at any mount point.
4. ES-module imports carry no version query. After a redeploy that
   changes module exports, returning visitors with a cached `js/*.js`
   can hit "does not provide an export named …". Set a short
   `Cache-Control` for `/easyviz/js/*` in `netlify.toml` (e.g.
   `max-age=300, must-revalidate`).

No further configuration — no redirects, no base-URL rewriting, no
Hugo shortcodes.

**Optional:** if you want live UCDP conflict data, add a Netlify
Function that forwards requests to `ucdpapi.pcr.uu.se` with an
`x-ucdp-access-token` header stored as a Netlify secret. Then point
`config.js → proxyBase` at it.

## Deploying to GitHub Pages (standalone repo)

1. Push `web/` to the root of a new repo.
2. Settings → Pages → deploy from `main` branch, `/` folder.
3. The `.nojekyll` file is already present, so `_` prefixed paths
   (none currently, but safe if you add any) aren't skipped.

## Project layout

```
easyviz-static/
├── api/                       # Optional FastAPI proxy
│   ├── catalog.py
│   ├── main.py
│   └── requirements.txt
└── web/                       # Static site (deployable as-is)
    ├── .nojekyll
    ├── index.html             # Search
    ├── chart.html             # Time-series + transforms + diagnostics
    ├── map.html                # D3 choropleth map
    ├── compare.html           # 5-tab compare (scatter/bubble/OLS/gapminder/corr)
    ├── upload.html            # CSV/Excel upload
    ├── conflict.html          # Local conflict-data aggregation
    ├── style.css
    ├── config.js              # Runtime config (proxy, defaults)
    ├── data/
    │   ├── catalog.js         # Curated 100+ WDI indicators
    │   └── countries.js       # ISO3 roster + presets
    └── js/
        ├── wdi.js             # Direct api.worldbank.org client
        ├── taxonomy.js        # Full-WDI loader + localStorage cache
        ├── fuzzy.js           # Fuse.js wrapper
        ├── charts.js          # Chart.js factories
        ├── regression.js      # OLS + R²
        ├── aggregate.js       # Temporal + entity aggregation, corr matrices
        ├── codegen.js         # R / Python replication snippets
        ├── map.js             # D3 choropleth (no D3 runtime dep — inlined)
        ├── savedviews.js      # localStorage-backed saved views
        ├── csv.js             # CSV/Excel parse + reshape + ISO3
        ├── urlstate.js        # URL ↔ UI state
        └── ui.js              # Dark mode, code modal, methodology, citations
```

## R / Python replication

Every chart ships with copy-pasteable replication code. Click the
`⟨/⟩ Show R / Python code` button on Chart, Map, or Compare; the modal
opens with both languages on tabs. Each snippet:

- installs any missing packages with `install.packages()` / `pip install`;
- reproduces the exact indicator / countries / year range / transform
  / aggregation shown on screen;
- uses tidy first-party ecosystems: **R** = `WDI` + `dplyr` + `ggplot2`
  (+ `sf` + `rnaturalearth` for maps, + `gganimate` for Gapminder);
  **Python** = `wbdata` + `pandas` + `matplotlib` (+ `geopandas` for
  maps, + `statsmodels` for regressions).

This is a research-quality workflow: students get an R/Python starter
kit for free, and published figures from this tool can be replicated
end-to-end by a reviewer without touching the UI.

## Cross-language validation

Aggregation numerics are validated against R equivalents for:
- year-on-year percent change
- 5-year rolling CAGR
- decade means
- index (base-year = 100)
- population- and GDP-weighted means

The snippet generator emits the same formulas the in-browser
aggregations apply, so cross-checking is as simple as running the R
snippet and comparing downloaded CSVs.

## Why this architecture?

| Concern               | EasyViz (Streamlit)   | easyviz-static         |
|-----------------------|------------------------|-----------------------|
| Cold start            | 10–30 s                | <200 ms (CDN)         |
| Embed in a blog       | Iframe only            | Script tag / iframe   |
| Hostable on Pages     | ✗                      | ✓                     |
| Scales horizontally   | Sticky sessions needed | Stateless             |
| Cost (low traffic)    | Always-on dyno         | Free Pages / Netlify  |

Tradeoff: you lose Plotly's server-rendered niceties (scatter-matrix,
LOESS, SVG export). Chart.js is simpler but less academic. For the
full analytical surface, use the Streamlit app; for "show a chart in
a blog post in one request," use this.
