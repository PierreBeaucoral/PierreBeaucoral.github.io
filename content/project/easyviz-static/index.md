---
title: "EasyViz — a static WDI explorer"
summary: >
  I developed a static web app to explore World Bank WDI indicators directly
  from the browser. Loads in under a second, no backend, no cold start.
  Search 100+ curated indicators (or the full ~20k taxonomy), chart
  line/area/bar with country presets (OECD, EU27, SSA, BRICS, G7, LDC, LMIC,
  G20), compare indicators (scatter, bubble, OLS with R², Gapminder-style
  animation), upload your own CSV/XLSX, and share every view through a URL.

tags:
  - Data visualization
  - Development economics
  - Open data
  - JavaScript
  - World Bank

date: '2026-04-18'

image:
  caption: ''
  focal_point: Smart

links:
  - icon: play
    icon_pack: fas
    name: Open app
    url: /easyviz-static/web/

external_link: '/easyviz-static/web/'

slides: ""
---

EasyViz is a lightweight alternative to Streamlit-based dashboards. I built
it as plain HTML + vanilla JavaScript + Chart.js, served statically; the
browser talks to `api.worldbank.org` directly (permissive CORS), so no backend
is required.

## Features

- **Search** — 100+ curated WDI indicators with fuzzy search via Fuse.js;
  optional one-click extension to the full ~20k-code taxonomy, cached
  locally for a week.
- **Chart** — line, area, or bar, with country presets (OECD, EU27, SSA,
  BRICS, G7, LDC, LMIC, G20, Default-20, All), adjustable year range, log
  scale, summary statistics, CSV export, and shareable URLs.
- **Compare** — scatter, bubble (size = third indicator), OLS regression
  with R², and Gapminder-style animated bubble chart.
- **Upload** — drop in a CSV or Excel file; the app auto-detects columns,
  reshapes wide to long, and resolves ISO3 codes.
- **URL state** — every control round-trips through query parameters, so
  any view is a permanent link.
- **Embed mode** — append `?embed=1` to strip chrome and drop the app into
  an iframe.
- **Dark mode** — respects `prefers-color-scheme`; toggleable.
- **Keyboard** — `/` focuses the search box.

An optional FastAPI proxy (server-side cache, UCDP-authenticated routes)
ships alongside for developers who want it.
