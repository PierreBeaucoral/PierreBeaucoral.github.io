# easyviz-static

Paulgp-style architecture applied to **EasyViz**: a plain HTML + vanilla JS
+ Chart.js frontend, loads in <1 s from a static host, no Streamlit cold
start, embeds in a blog post as a simple iframe or `<script>` tag.

All Streamlit-EasyViz features ported:

- **Search** — 100+ curated WDI indicators, fuzzy-searched via Fuse.js;
  optional one-click extension to the full ~20k-code WDI taxonomy
  (cached to `localStorage` for a week).
- **Chart** — line/area/bar, country presets (OECD / EU27 / SSA /
  BRICS / G7 / LDC / LMIC / G20 / Default-20 / All), year range, log
  scale, summary stats, download CSV, shareable URL.
- **Compare** — four tabs: scatter · bubble (size = third indicator) ·
  OLS regression with R² · Gapminder-style animated bubble chart.
- **Upload** — drop CSV / Excel; auto-detect columns; wide→long
  reshape; ISO3 resolution — identical to the Streamlit uploader.
- **Conflict** — local CSV aggregation (UCDP/HDX-shaped), with a note
  on live-mode options.
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
    ├── chart.html             # Time-series
    ├── compare.html           # 4-tab compare
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
        ├── csv.js             # CSV/Excel parse + reshape + ISO3
        ├── urlstate.js        # URL ↔ UI state
        └── ui.js              # Dark mode, CSV download, toasts
```

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
