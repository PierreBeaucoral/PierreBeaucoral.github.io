---
title: "EasyViz — a static WDI explorer"
summary: >
  I developed a static web app to explore World Bank WDI indicators directly
  from the browser. Loads in under a second, no backend, no cold start.
  Search 100+ curated indicators (or the full WDI, ~1,500 codes), chart
  line/area/bar with country presets (OECD, EU27, SSA, BRICS, G7, LDC, LMIC,
  G20), compare indicators (scatter, bubble, OLS with HC1 robust standard
  errors, Gapminder-style animation, correlation matrix), map them on an
  Equal Earth choropleth, upload your own CSV/XLSX, and export every view
  with a methodology note, a citation and matching R / Python code.

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
  optional one-click extension to the full WDI (~1,500 codes), cached
  locally for a week.
- **Chart** — line, area, or bar, with country presets (OECD, EU27, SSA,
  BRICS, G7, LDC, LMIC, G20, Default-20, All), adjustable year range, log
  scale, year-aware transforms (moving average, growth, CAGR, index),
  cross-country means with an optional balanced panel, CSV/PNG export,
  and shareable URLs. World Bank regional and income aggregates are
  excluded throughout.
- **Compare** — scatter, bubble (size = third indicator), OLS regression
  with HC1 robust standard errors and 95% CIs, log axes, Gapminder-style
  animated bubble chart, and a pairwise correlation matrix.
- **Map** — Equal Earth choropleth with quantile, linear or log colour
  scales and a year slider.
- **Replication** — every view exports a methodology note, a citation,
  and R (`WDI` + `tidyverse`) / Python (`wbdata` + `pandas`) code that
  reproduces it.
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
