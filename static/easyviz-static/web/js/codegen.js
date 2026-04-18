// Code-generation helpers. Every chart / map / aggregation in EasyViz
// can emit a copy-pasteable R or Python snippet that reproduces the
// visual end-to-end. Cross-language replication is one of the research
// quality commitments: see README.md § "R / Python replication".
//
// Shape of a spec:
//   {
//     kind:      "timeseries" | "scatter" | "bubble" | "regression"
//              | "gapminder" | "map" | "correlation" | "panel",
//     indicator: { code, name, unit },            // or primary indicator
//     indicatorB: { code, name, unit },           // compare / scatter
//     indicatorSize: { code, name, unit } | null, // bubble / gapminder
//     indicators: [{code, name}],                 // correlation matrix
//     countries: ["FRA", "DEU", …] | null,        // null = all
//     years:     [from, to],                      // inclusive
//     year:      2020,                            // single-year shots
//     chartType: "line" | "area" | "bar",
//     log:       false,
//     transform: { method: "none" | "ma5" | "decade" | "yoy" | "cagr"
//                       | "index", baseYear?: 2000 },
//     entityAgg: { method: "none" | "mean" | "median" | "sum"
//                       | "pop_weighted" | "gdp_weighted" } | null,
//     fmt:       "ggplot" | "base",               // R only (default ggplot)
//   }
//
// All snippets are commented, include a dependency-install line, and
// print the final data frame so the user can sanity-check.

import { qualRScale, qualPyHexList } from "./palettes.js";

const Q = (s) => `"${String(s ?? "").replace(/"/g, '\\"')}"`;
const Qvec = (arr) => `c(${arr.map(Q).join(", ")})`;
const PyList = (arr) => `[${arr.map(s => `"${s}"`).join(", ")}]`;

function isoVecR(countries) {
  if (!countries || !countries.length) return 'countries <- "all"';
  return `countries <- ${Qvec(countries)}`;
}

function isoVecPy(countries) {
  if (!countries || !countries.length) return 'countries = "all"  # all WDI economies';
  return `countries = ${PyList(countries)}`;
}

// ── R: time-series ──────────────────────────────────────────────────────
export function rTimeseries(spec) {
  const { indicator, countries, years, chartType = "line", log = false,
          transform = { method: "none" }, entityAgg = null,
          qualPalette = "tableau10" } = spec;
  const [y1, y2] = years || [1990, 2024];
  const ggtype = chartType === "bar"
    ? `geom_col(position = "dodge")`
    : chartType === "area"
      ? `geom_area(alpha = 0.35, position = "identity")`
      : `geom_line(linewidth = 0.8) + geom_point(size = 1)`;
  const logLine = log ? `  scale_y_log10() +\n` : "";

  const tfLines = transformSnippetR(transform);
  const aggLines = entityAggSnippetR(entityAgg);

  return `# EasyViz replication — ${indicator.name}
# Run in R ≥ 4.0; installs WDI + tidyverse if missing.
# Packages used: WDI, dplyr, ggplot2, tidyr.

pkgs <- c("WDI", "dplyr", "ggplot2", "tidyr")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

# ── 1. Parameters ─────────────────────────────────────────────────────
${isoVecR(countries)}
indicator_code <- ${Q(indicator.code)}
indicator_name <- ${Q(indicator.name)}
year_from <- ${y1}
year_to   <- ${y2}

# ── 2. Fetch from World Bank WDI ──────────────────────────────────────
raw <- WDI(
  country   = countries,
  indicator = indicator_code,
  start     = year_from,
  end       = year_to,
  extra     = TRUE
) |>
  as_tibble() |>
  rename(value = all_of(indicator_code)) |>
  filter(!is.na(value), region != "Aggregates") |>
  select(iso3c, country, year, value) |>
  arrange(country, year)

${tfLines}${aggLines}# ── 3. Plot ──────────────────────────────────────────────────────────
ggplot(raw, aes(x = year, y = value, colour = country${chartType === "area" ? ", fill = country" : ""})) +
  ${ggtype} +
${logLine}  ${qualRScale(qualPalette, "colour")} +
  ${chartType === "area" ? `${qualRScale(qualPalette, "fill")} +\n  ` : ""}labs(
    title = indicator_name,
    subtitle = paste0(year_from, "–", year_to),
    x = "Year",
    y = ${Q(indicator.unit || "")},
    colour = NULL${chartType === "area" ? ", fill = NULL" : ""},
    caption = "Source: World Bank WDI (via WDI package)."
  ) +
  theme_minimal(base_size = 12) +
  theme(legend.position = "right")
`;
}

function transformSnippetR(t) {
  if (!t || t.method === "none") return "";
  if (t.method === "ma5") {
    return `# Temporal transform: 5-year moving average (centered)
raw <- raw |>
  group_by(iso3c) |>
  arrange(year) |>
  mutate(value = zoo::rollmean(value, k = 5, fill = NA, align = "center")) |>
  ungroup() |>
  filter(!is.na(value))
# Requires: install.packages("zoo")

`;
  }
  if (t.method === "decade") {
    return `# Temporal transform: decade means
raw <- raw |>
  mutate(decade = paste0(floor(year / 10) * 10, "s")) |>
  group_by(iso3c, country, decade) |>
  summarise(value = mean(value, na.rm = TRUE), year = mean(year), .groups = "drop") |>
  arrange(country, year)

`;
  }
  if (t.method === "yoy") {
    return `# Temporal transform: year-on-year percent change
raw <- raw |>
  group_by(iso3c) |>
  arrange(year) |>
  mutate(value = 100 * (value / lag(value) - 1)) |>
  ungroup() |>
  filter(!is.na(value))

`;
  }
  if (t.method === "cagr") {
    return `# Temporal transform: compound annual growth rate (rolling 5y window)
raw <- raw |>
  group_by(iso3c) |>
  arrange(year) |>
  mutate(value = 100 * ((value / lag(value, 5))^(1/5) - 1)) |>
  ungroup() |>
  filter(!is.na(value))

`;
  }
  if (t.method === "index") {
    const base = t.baseYear ?? 2000;
    return `# Temporal transform: index (value at ${base} = 100)
base_year <- ${base}
raw <- raw |>
  group_by(iso3c) |>
  mutate(base = value[year == base_year][1]) |>
  filter(!is.na(base), base != 0) |>
  mutate(value = 100 * value / base) |>
  select(-base) |>
  ungroup()

`;
  }
  return "";
}

function entityAggSnippetR(agg) {
  if (!agg || agg.method === "none") return "";
  if (agg.method === "mean" || agg.method === "median" || agg.method === "sum") {
    const fn = agg.method === "mean" ? "mean" : agg.method === "median" ? "median" : "sum";
    return `# Entity aggregation: ${agg.method} across selected countries per year
raw <- raw |>
  group_by(year) |>
  summarise(
    value = ${fn}(value, na.rm = TRUE),
    country = "Aggregate",
    iso3c = "AGG",
    .groups = "drop"
  )

`;
  }
  if (agg.method === "pop_weighted" || agg.method === "gdp_weighted") {
    const wcode = agg.method === "pop_weighted" ? "SP.POP.TOTL" : "NY.GDP.MKTP.CD";
    const wname = agg.method === "pop_weighted" ? "population" : "GDP";
    return `# Entity aggregation: ${wname}-weighted mean across selected countries per year
w <- WDI(country = countries, indicator = ${Q(wcode)},
         start = year_from, end = year_to) |>
  as_tibble() |>
  rename(weight = all_of(${Q(wcode)})) |>
  select(iso3c, year, weight)

raw <- raw |>
  inner_join(w, by = c("iso3c", "year")) |>
  filter(!is.na(weight), weight > 0) |>
  group_by(year) |>
  summarise(
    value = sum(value * weight, na.rm = TRUE) / sum(weight, na.rm = TRUE),
    country = ${Q(wname + "-weighted aggregate")},
    iso3c = "AGG",
    .groups = "drop"
  )

`;
  }
  return "";
}

// ── R: scatter / regression ─────────────────────────────────────────────
export function rScatter(spec) {
  const { indicator: a, indicatorB: b, countries, year, kind, qualPalette = "tableau10" } = spec;
  const withFit = kind === "regression";
  const firstHex = (qualPyHexList(qualPalette).match(/"#[0-9a-fA-F]{6}"/) || ['"#4E79A7"'])[0];
  return `# EasyViz replication — ${a.name} vs. ${b.name} (${year})
pkgs <- c("WDI", "dplyr", "ggplot2")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

${isoVecR(countries)}
year_target <- ${year}

df <- WDI(
  country   = countries,
  indicator = c(x = ${Q(a.code)}, y = ${Q(b.code)}),
  start     = year_target,
  end       = year_target,
  extra     = TRUE
) |>
  as_tibble() |>
  filter(!is.na(x), !is.na(y), region != "Aggregates")

${withFit ? `fit <- lm(y ~ x, data = df)
cat("slope =", coef(fit)[2], " intercept =", coef(fit)[1],
    " R² =", summary(fit)$r.squared, " n =", nrow(df), "\\n")

` : ""}ggplot(df, aes(x = x, y = y)) +
  geom_point(colour = ${firstHex}, size = 2) +
  ${withFit ? `geom_smooth(method = "lm", se = TRUE, colour = "black") +\n  ` : ""}labs(
    title = paste(${Q(a.name)}, "vs.", ${Q(b.name)}, "—", year_target),
    x = ${Q(`${a.name} (${a.unit})`)},
    y = ${Q(`${b.name} (${b.unit})`)},
    caption = "Source: World Bank WDI."
  ) +
  theme_minimal(base_size = 12)
`;
}

// ── R: bubble ───────────────────────────────────────────────────────────
export function rBubble(spec) {
  const { indicator: a, indicatorB: b, indicatorSize: s, countries, year, qualPalette = "tableau10" } = spec;
  const firstHex = (qualPyHexList(qualPalette).match(/"#[0-9a-fA-F]{6}"/) || ['"#4E79A7"'])[0];
  return `# EasyViz replication — bubble (${a.name} × ${b.name}, size = ${s.name}, ${year})
pkgs <- c("WDI", "dplyr", "ggplot2")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

${isoVecR(countries)}
year_target <- ${year}

df <- WDI(
  country   = countries,
  indicator = c(x = ${Q(a.code)}, y = ${Q(b.code)}, size = ${Q(s.code)}),
  start     = year_target, end = year_target, extra = TRUE
) |>
  as_tibble() |>
  filter(!is.na(x), !is.na(y), !is.na(size), region != "Aggregates")

ggplot(df, aes(x = x, y = y, size = size, label = country)) +
  geom_point(alpha = 0.55, colour = ${firstHex}) +
  scale_size_continuous(range = c(2, 15), name = ${Q(s.name)}) +
  labs(
    title = paste(${Q(a.name)}, "vs.", ${Q(b.name)}, "—", year_target),
    x = ${Q(`${a.name} (${a.unit})`)},
    y = ${Q(`${b.name} (${b.unit})`)},
    caption = "Source: World Bank WDI."
  ) +
  theme_minimal(base_size = 12)
`;
}

// ── R: gapminder (animated) ─────────────────────────────────────────────
export function rGapminder(spec) {
  const { indicator: a, indicatorB: b, indicatorSize: s, countries, years, qualPalette = "tableau10" } = spec;
  const [y1, y2] = years || [1990, 2024];
  return `# EasyViz replication — Gapminder-style animation
# Extra dependency: gganimate + gifski (for GIF export).
pkgs <- c("WDI", "dplyr", "ggplot2", "gganimate", "gifski")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

${isoVecR(countries)}

indicators <- c(x = ${Q(a.code)}, y = ${Q(b.code)}${s ? `, size = ${Q(s.code)}` : ""})
df <- WDI(country = countries, indicator = indicators,
          start = ${y1}, end = ${y2}, extra = TRUE) |>
  as_tibble() |>
  filter(!is.na(x), !is.na(y)${s ? ", !is.na(size)" : ""}, region != "Aggregates")

p <- ggplot(df, aes(x = x, y = y${s ? ", size = size" : ""}, colour = region)) +
  geom_point(alpha = 0.7) +
  ${qualRScale(qualPalette, "colour")} +
  ${s ? "scale_size_continuous(range = c(2, 15)) +\n  " : ""}labs(
    title = "{closest_state}",
    x = ${Q(`${a.name} (${a.unit})`)},
    y = ${Q(`${b.name} (${b.unit})`)},
    caption = "Source: World Bank WDI."
  ) +
  theme_minimal(base_size = 12) +
  transition_states(year, transition_length = 2, state_length = 1)

# Save as animation (takes ~30s for a decade-long range):
# anim_save("gapminder.gif", animate(p, nframes = 200, fps = 10, renderer = gifski_renderer()))

animate(p, nframes = 100, fps = 8)
`;
}

// ── R: choropleth map ───────────────────────────────────────────────────
// Palette metadata mirrors web/js/map.js so the emitted R code picks a
// scale_fill_* call equivalent to what is shown in the UI.
const R_PALETTES = {
  viridis:  { kind: "seq", call: `scale_fill_viridis_c(option = "viridis"` },
  plasma:   { kind: "seq", call: `scale_fill_viridis_c(option = "plasma"` },
  magma:    { kind: "seq", call: `scale_fill_viridis_c(option = "magma"` },
  inferno:  { kind: "seq", call: `scale_fill_viridis_c(option = "inferno"` },
  cividis:  { kind: "seq", call: `scale_fill_viridis_c(option = "cividis"` },
  turbo:    { kind: "seq", call: `scale_fill_viridis_c(option = "turbo"` },
  blues:    { kind: "seq", call: `scale_fill_distiller(palette = "Blues", direction = 1` },
  greens:   { kind: "seq", call: `scale_fill_distiller(palette = "Greens", direction = 1` },
  oranges:  { kind: "seq", call: `scale_fill_distiller(palette = "Oranges", direction = 1` },
  reds:     { kind: "seq", call: `scale_fill_distiller(palette = "Reds", direction = 1` },
  greys:    { kind: "seq", call: `scale_fill_distiller(palette = "Greys", direction = 1` },
  rdbu:     { kind: "div", call: `scale_fill_distiller(palette = "RdBu", direction = 1` },
  piyg:     { kind: "div", call: `scale_fill_distiller(palette = "PiYG", direction = 1` },
  brbg:     { kind: "div", call: `scale_fill_distiller(palette = "BrBG", direction = 1` },
  spectral: { kind: "div", call: `scale_fill_distiller(palette = "Spectral", direction = 1` },
};

const PY_PALETTES = {
  viridis: "viridis", plasma: "plasma", magma: "magma", inferno: "inferno",
  cividis: "cividis", turbo: "turbo",
  blues: "Blues", greens: "Greens", oranges: "Oranges", reds: "Reds", greys: "Greys",
  rdbu: "RdBu", piyg: "PiYG", brbg: "BrBG", spectral: "Spectral",
};

function rFillScale(palette, { log = false, reverse = false, diverging = false, center = 0 } = {}) {
  const meta = R_PALETTES[palette] || R_PALETTES.viridis;
  const args = [];
  if (reverse) args.push(meta.call.includes("direction = 1") ? null : "direction = -1");
  // For distiller palettes reverse is flipped by overriding direction:
  let call = meta.call;
  if (reverse && call.includes("direction = 1")) call = call.replace("direction = 1", "direction = -1");
  // Viridis options support `direction = -1` too.
  if (reverse && call.includes("viridis_c")) args.push("direction = -1");
  if (log && !(diverging || meta.kind === "div")) args.push(`trans = "log10"`);
  if (diverging || meta.kind === "div") {
    args.push(`limits = c(-max(abs(world$value - ${center}), na.rm = TRUE) + ${center}, max(abs(world$value - ${center}), na.rm = TRUE) + ${center})`);
    args.push(`rescaler = ~ scales::rescale_mid(.x, mid = ${center})`);
  }
  args.push(`na.value = "grey90"`);
  return `${call}, ${args.filter(Boolean).join(", ")})`;
}

export function rMap(spec) {
  const {
    indicator, year, period = null, log = false,
    palette = "viridis", reverse = false, diverging = false, center = 0,
  } = spec;
  const useP = period && period.method && period.method !== "single";
  const y1 = useP ? period.yearFrom : year;
  const y2 = useP ? period.yearTo   : year;
  const rAggFn = {
    mean: "mean", median: "median", sum: "sum", max: "max", min: "min",
  }[useP ? period.method : "mean"] || "mean";
  const titleLabel = useP
    ? `paste(${Q(indicator.name)}, "—", ${Q(`${period.method} ${y1}–${y2}`)})`
    : `paste(${Q(indicator.name)}, "—", ${year})`;
  const aggBlock = useP
    ? `  group_by(iso3c) |>
  summarise(value = ${rAggFn}(value, na.rm = TRUE), n = dplyr::n(), .groups = "drop") |>
  filter(is.finite(value))`
    : `  filter(!is.na(value))`;
  return `# EasyViz replication — choropleth map (${indicator.name}, ${useP ? `${period.method} ${y1}–${y2}` : year})
# Palette: ${palette}${reverse ? " (reversed)" : ""}${diverging ? ` · diverging at ${center}` : ""}
pkgs <- c("WDI", "dplyr", "ggplot2", "sf", "rnaturalearth", "rnaturalearthdata", "scales")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

df <- WDI(country = "all",
          indicator = ${Q(indicator.code)},
          start = ${y1}, end = ${y2}) |>
  as_tibble() |>
  rename(value = all_of(${Q(indicator.code)})) |>
${aggBlock}

world <- ne_countries(scale = "medium", returnclass = "sf")
world <- dplyr::left_join(world, df, by = c("iso_a3" = "iso3c"))

ggplot(world) +
  geom_sf(aes(fill = value), colour = "white", linewidth = 0.1) +
  ${rFillScale(palette, { log, reverse, diverging, center })} +
  coord_sf(crs = "+proj=robin") +
  labs(
    title = ${titleLabel},
    fill = ${Q(indicator.unit || "")},
    caption = "Source: World Bank WDI. Boundaries: Natural Earth."
  ) +
  theme_minimal(base_size = 11) +
  theme(
    panel.grid.major = element_line(colour = "grey95"),
    axis.text = element_blank(), axis.ticks = element_blank()
  )
`;
}

// ── R: correlation matrix ───────────────────────────────────────────────
export function rCorrelation(spec) {
  const { indicators, countries, year, method = "pearson" } = spec;
  const codeVec = `c(${indicators.map(i => `${Q(i.id || i.code.replace(/\W/g, "_"))} = ${Q(i.code)}`).join(", ")})`;
  return `# EasyViz replication — correlation matrix (${year}, ${method})
pkgs <- c("WDI", "dplyr", "ggplot2", "tidyr", "corrr")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

${isoVecR(countries)}
codes <- ${codeVec}
df <- WDI(country = countries, indicator = codes,
          start = ${year}, end = ${year}, extra = TRUE) |>
  as_tibble() |>
  filter(region != "Aggregates")

num <- df |> select(all_of(names(codes))) |> mutate(across(everything(), as.numeric))
cmat <- cor(num, use = "pairwise.complete.obs", method = ${Q(method)})
print(round(cmat, 3))

cor_tbl <- as.data.frame(as.table(cmat))
ggplot(cor_tbl, aes(Var1, Var2, fill = Freq)) +
  geom_tile() +
  geom_text(aes(label = round(Freq, 2)), size = 3) +
  scale_fill_gradient2(low = "#d9532d", mid = "white", high = "#2d5fd9",
                       midpoint = 0, limits = c(-1, 1)) +
  labs(title = paste("Pairwise", ${Q(method)}, "correlations —", ${year}),
       x = NULL, y = NULL, fill = "r") +
  theme_minimal(base_size = 11) +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))
`;
}

// ── R: panel (long table) ───────────────────────────────────────────────
export function rPanel(spec) {
  const { indicators, countries, years } = spec;
  const [y1, y2] = years || [1990, 2024];
  const codeVec = `c(${indicators.map(i => `${Q(i.id || i.code.replace(/\W/g, "_"))} = ${Q(i.code)}`).join(", ")})`;
  return `# EasyViz replication — panel data frame
pkgs <- c("WDI", "dplyr", "tidyr")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

${isoVecR(countries)}
panel <- WDI(country = countries,
             indicator = ${codeVec},
             start = ${y1}, end = ${y2}, extra = TRUE) |>
  as_tibble() |>
  filter(region != "Aggregates") |>
  select(iso3c, country, year, ${indicators.map(i => i.id || i.code.replace(/\W/g, "_")).join(", ")}) |>
  arrange(country, year)

head(panel, 20)
# write_csv(panel, "panel.csv")
`;
}

// ── Python snippets ─────────────────────────────────────────────────────

export function pyTimeseries(spec) {
  const { indicator, countries, years, chartType = "line", log = false,
          transform = { method: "none" }, entityAgg = null,
          qualPalette = "tableau10" } = spec;
  const [y1, y2] = years || [1990, 2024];

  const tfLines = transformSnippetPy(transform);
  const aggLines = entityAggSnippetPy(entityAgg);
  const plotKind = chartType === "bar" ? "bar" : "line";
  const logLine = log ? `plt.yscale("log")\n` : "";

  return `# EasyViz replication — ${indicator.name}
# Run on Python ≥ 3.9. pip install wbdata pandas matplotlib seaborn

import pandas as pd
import matplotlib.pyplot as plt
import wbdata
from datetime import datetime

# ── 1. Parameters ─────────────────────────────────────────────────────
${isoVecPy(countries)}
indicator_code = ${Q(indicator.code)}
indicator_name = ${Q(indicator.name)}
year_from, year_to = ${y1}, ${y2}

# ── 2. Fetch ──────────────────────────────────────────────────────────
df = wbdata.get_dataframe(
    {indicator_code: "value"},
    country=countries,
    date=(datetime(year_from, 1, 1), datetime(year_to, 1, 1)),
).reset_index().dropna()
df["year"] = pd.to_datetime(df["date"]).dt.year
df = df[["country", "year", "value"]].sort_values(["country", "year"])

${tfLines}${aggLines}# ── 3. Plot ──────────────────────────────────────────────────────────
colors = [${qualPyHexList(qualPalette)}]
fig, ax = plt.subplots(figsize=(10, 6))
for i, (country, sub) in enumerate(df.groupby("country")):
    c = colors[i % len(colors)]
    ax.${plotKind === "bar" ? `bar(sub["year"], sub["value"], label=country, color=c)` : `plot(sub["year"], sub["value"], label=country, color=c, marker="o", markersize=3)`}
${logLine}ax.set_title(indicator_name)
ax.set_xlabel("Year")
ax.set_ylabel(${Q(indicator.unit || "")})
ax.legend(loc="best", fontsize=8)
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
`;
}

function transformSnippetPy(t) {
  if (!t || t.method === "none") return "";
  if (t.method === "ma5") {
    return `# Temporal transform: 5-year centered moving average
df["value"] = df.groupby("country")["value"].transform(
    lambda s: s.rolling(window=5, center=True, min_periods=3).mean())
df = df.dropna(subset=["value"])

`;
  }
  if (t.method === "decade") {
    return `# Temporal transform: decade means
df["decade"] = (df["year"] // 10 * 10).astype(int)
df = (df.groupby(["country", "decade"], as_index=False)["value"].mean()
        .rename(columns={"decade": "year"}))

`;
  }
  if (t.method === "yoy") {
    return `# Temporal transform: year-on-year percent change
df["value"] = df.groupby("country")["value"].pct_change() * 100
df = df.dropna(subset=["value"])

`;
  }
  if (t.method === "cagr") {
    return `# Temporal transform: 5-year rolling CAGR (%)
def cagr(s, k=5):
    return 100 * ((s / s.shift(k)) ** (1/k) - 1)
df["value"] = df.groupby("country")["value"].transform(cagr)
df = df.dropna(subset=["value"])

`;
  }
  if (t.method === "index") {
    const base = t.baseYear ?? 2000;
    return `# Temporal transform: index (value at ${base} = 100)
base_year = ${base}
base = (df[df["year"] == base_year][["country", "value"]]
          .rename(columns={"value": "base"}))
df = df.merge(base, on="country").query("base != 0").assign(
    value=lambda d: 100 * d["value"] / d["base"]).drop(columns="base")

`;
  }
  return "";
}

function entityAggSnippetPy(agg) {
  if (!agg || agg.method === "none") return "";
  if (agg.method === "mean" || agg.method === "median" || agg.method === "sum") {
    return `# Entity aggregation: ${agg.method} across selected countries
df = (df.groupby("year", as_index=False)["value"].${agg.method}()
        .assign(country="Aggregate"))

`;
  }
  if (agg.method === "pop_weighted" || agg.method === "gdp_weighted") {
    const wcode = agg.method === "pop_weighted" ? "SP.POP.TOTL" : "NY.GDP.MKTP.CD";
    const wname = agg.method === "pop_weighted" ? "population" : "GDP";
    return `# Entity aggregation: ${wname}-weighted mean
weights = wbdata.get_dataframe(
    {${Q(wcode)}: "weight"}, country=countries,
    date=(datetime(year_from, 1, 1), datetime(year_to, 1, 1))
).reset_index().dropna()
weights["year"] = pd.to_datetime(weights["date"]).dt.year
weights = weights[["country", "year", "weight"]]

df = df.merge(weights, on=["country", "year"]).dropna()
df = (df.assign(wv=lambda d: d["value"] * d["weight"])
        .groupby("year", as_index=False)
        .apply(lambda g: pd.Series({
            "value": g["wv"].sum() / g["weight"].sum(),
            "country": ${Q(wname + "-weighted aggregate")},
        })))

`;
  }
  return "";
}

export function pyScatter(spec) {
  const { indicator: a, indicatorB: b, countries, year, kind, qualPalette = "tableau10" } = spec;
  const withFit = kind === "regression";
  const firstHex = (qualPyHexList(qualPalette).match(/"#[0-9a-fA-F]{6}"/) || ['"#4E79A7"'])[0];
  return `# EasyViz replication — ${a.name} vs. ${b.name} (${year})
# pip install wbdata pandas matplotlib seaborn statsmodels

import pandas as pd, matplotlib.pyplot as plt, wbdata
from datetime import datetime
${withFit ? "import statsmodels.api as sm\n" : ""}
${isoVecPy(countries)}
year_target = ${year}

df = wbdata.get_dataframe(
    {${Q(a.code)}: "x", ${Q(b.code)}: "y"},
    country=countries,
    date=(datetime(year_target, 1, 1), datetime(year_target, 1, 1)),
).reset_index().dropna()

fig, ax = plt.subplots(figsize=(9, 6))
ax.scatter(df["x"], df["y"], alpha=0.7, s=35, color=${firstHex})
${withFit ? `X = sm.add_constant(df["x"]); model = sm.OLS(df["y"], X).fit()
print(model.summary())
xs = df["x"].sort_values(); ax.plot(xs, model.predict(sm.add_constant(xs)),
                                    color="black", linewidth=2,
                                    label=f"OLS (R²={model.rsquared:.2f})")
ax.legend()
` : ""}ax.set_xlabel(${Q(`${a.name} (${a.unit})`)})
ax.set_ylabel(${Q(`${b.name} (${b.unit})`)})
ax.set_title(${Q(`${a.name} vs. ${b.name} — ${year}`)})
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
`;
}

export function pyBubble(spec) {
  const { indicator: a, indicatorB: b, indicatorSize: s, countries, year, qualPalette = "tableau10" } = spec;
  const firstHex = (qualPyHexList(qualPalette).match(/"#[0-9a-fA-F]{6}"/) || ['"#4E79A7"'])[0];
  return `# EasyViz replication — bubble (${a.name} × ${b.name}, size = ${s.name}, ${year})
# pip install wbdata pandas matplotlib

import pandas as pd, matplotlib.pyplot as plt, wbdata
from datetime import datetime
${isoVecPy(countries)}
year_target = ${year}

df = wbdata.get_dataframe(
    {${Q(a.code)}: "x", ${Q(b.code)}: "y", ${Q(s.code)}: "size"},
    country=countries,
    date=(datetime(year_target, 1, 1), datetime(year_target, 1, 1)),
).reset_index().dropna()

sizes = 20 + 400 * (df["size"] - df["size"].min()) / (df["size"].max() - df["size"].min() + 1e-9)
fig, ax = plt.subplots(figsize=(10, 6))
ax.scatter(df["x"], df["y"], s=sizes, alpha=0.55, color=${firstHex}, edgecolor="black", linewidth=0.4)
ax.set_xlabel(${Q(`${a.name} (${a.unit})`)})
ax.set_ylabel(${Q(`${b.name} (${b.unit})`)})
ax.set_title(${Q(`${a.name} vs. ${b.name} · size = ${s.name} · ${year}`)})
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
`;
}

export function pyMap(spec) {
  const {
    indicator, year, period = null, log = false,
    palette = "viridis", reverse = false, diverging = false, center = 0,
  } = spec;
  const useP = period && period.method && period.method !== "single";
  const y1 = useP ? period.yearFrom : year;
  const y2 = useP ? period.yearTo   : year;
  const pyAgg = {
    mean: "mean", median: "median", sum: "sum", max: "max", min: "min",
  }[useP ? period.method : "mean"] || "mean";
  const basePy = PY_PALETTES[palette] || "viridis";
  const pyCmap = reverse ? `${basePy}_r` : basePy;
  const titleStr = useP
    ? `${indicator.name} — ${period.method} ${y1}–${y2}`
    : `${indicator.name} — ${year}`;
  const fetchAndAgg = useP
    ? `df = wbdata.get_dataframe(
    {${Q(indicator.code)}: "value"},
    country="all",
    date=(datetime(${y1}, 1, 1), datetime(${y2}, 1, 1)),
).reset_index()
# NA-drop, then collapse the ${y1}-${y2} window to one value per country.
df = (df.dropna(subset=["value"])
        .groupby("country", as_index=False)
        .agg(value=("value", ${Q(pyAgg)}),
             n_obs=("value", "count")))`
    : `df = wbdata.get_dataframe(
    {${Q(indicator.code)}: "value"},
    country="all",
    date=(datetime(${year}, 1, 1), datetime(${year}, 1, 1)),
).reset_index().dropna()`;
  return `# EasyViz replication — choropleth map (${useP ? `${period.method} ${y1}–${y2}` : year})
# Palette: ${palette}${reverse ? " (reversed)" : ""}${diverging ? ` · diverging at ${center}` : ""}
# pip install wbdata pandas geopandas matplotlib

import pandas as pd, geopandas as gpd, matplotlib.pyplot as plt, wbdata
import matplotlib.colors as mcolors
from datetime import datetime

${fetchAndAgg}

# Natural Earth low-res country boundaries ship with geopandas.
world = gpd.read_file(gpd.datasets.get_path("naturalearth_lowres"))
world = world.merge(df, left_on="name", right_on="country", how="left")

cmap = ${Q(pyCmap)}
${diverging ? `half = max(abs(world["value"].max() - ${center}),
           abs(${center} - world["value"].min()))
norm = mcolors.TwoSlopeNorm(vmin=${center} - half, vcenter=${center}, vmax=${center} + half)
` : log ? `norm = mcolors.LogNorm(vmin=max(world["value"].min(), 1e-3),
                      vmax=world["value"].max())
` : `norm = None
`}
fig, ax = plt.subplots(figsize=(12, 6))
world.plot(column="value", ax=ax, legend=True, cmap=cmap, norm=norm,
           missing_kwds={"color": "lightgrey"})
ax.set_title(${Q(titleStr)})
ax.set_axis_off()
plt.tight_layout()
plt.show()
`;
}

export function pyCorrelation(spec) {
  const { indicators, countries, year, method = "pearson" } = spec;
  const mapping = indicators.map(i =>
    `${Q(i.code)}: ${Q(i.id || i.code.replace(/\W/g, "_"))}`
  ).join(", ");
  return `# EasyViz replication — correlation matrix (${year}, ${method})
# pip install wbdata pandas matplotlib seaborn

import pandas as pd, matplotlib.pyplot as plt, seaborn as sns, wbdata
from datetime import datetime
${isoVecPy(countries)}

codes = {${mapping}}
df = wbdata.get_dataframe(codes, country=countries,
                          date=(datetime(${year}, 1, 1), datetime(${year}, 1, 1))).reset_index()

cmat = df[list(codes.values())].corr(method=${Q(method)})
print(cmat.round(3))

fig, ax = plt.subplots(figsize=(0.9 * len(codes) + 2, 0.9 * len(codes) + 2))
sns.heatmap(cmat, annot=True, cmap="RdBu_r", center=0, vmin=-1, vmax=1, ax=ax)
ax.set_title(f"Pairwise ${method} correlations — ${year}")
plt.tight_layout(); plt.show()
`;
}

export function pyPanel(spec) {
  const { indicators, countries, years } = spec;
  const [y1, y2] = years || [1990, 2024];
  const mapping = indicators.map(i =>
    `${Q(i.code)}: ${Q(i.id || i.code.replace(/\W/g, "_"))}`
  ).join(", ");
  return `# EasyViz replication — panel data frame
# pip install wbdata pandas
import pandas as pd, wbdata
from datetime import datetime
${isoVecPy(countries)}

codes = {${mapping}}
panel = wbdata.get_dataframe(codes, country=countries,
                             date=(datetime(${y1}, 1, 1), datetime(${y2}, 1, 1))).reset_index()
panel["year"] = pd.to_datetime(panel["date"]).dt.year
panel = panel.drop(columns="date").sort_values(["country", "year"])
print(panel.head(20))
# panel.to_csv("panel.csv", index=False)
`;
}

// ── Dispatch ────────────────────────────────────────────────────────────

export function rCode(spec) {
  switch (spec.kind) {
    case "timeseries":  return rTimeseries(spec);
    case "scatter":     return rScatter(spec);
    case "regression":  return rScatter(spec);
    case "bubble":      return rBubble(spec);
    case "gapminder":   return rGapminder(spec);
    case "map":         return rMap(spec);
    case "correlation": return rCorrelation(spec);
    case "panel":       return rPanel(spec);
    default:            return `# Unknown spec kind: ${spec.kind}\n`;
  }
}

export function pyCode(spec) {
  switch (spec.kind) {
    case "timeseries":  return pyTimeseries(spec);
    case "scatter":     return pyScatter(spec);
    case "regression":  return pyScatter(spec);
    case "bubble":      return pyBubble(spec);
    case "gapminder":   return pyTimeseries({ ...spec, chartType: "line" }) +
                               "\n# Gapminder animation in Python is easiest via plotly:\n" +
                               "# import plotly.express as px; px.scatter(df, x='x', y='y', size='size', animation_frame='year').show()\n";
    case "map":         return pyMap(spec);
    case "correlation": return pyCorrelation(spec);
    case "panel":       return pyPanel(spec);
    default:            return `# Unknown spec kind: ${spec.kind}\n`;
  }
}
