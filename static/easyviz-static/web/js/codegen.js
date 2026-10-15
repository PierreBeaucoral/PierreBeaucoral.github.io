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
//     balanced:  false,                           // balanced panel only
//     logX, logY: false,                          // compare: log axes / ln OLS
//     scale:     "quantile" | "linear" | "log",   // map colour scale
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

// Real economies, from the live WB country list (aggregates carry region
// id "NA") — the same rule as wdi.js. Not `region != "Aggregates"` from
// WDI(extra = TRUE): the WDI package's bundled metadata is stale and gives
// some real economies (e.g. Nauru) region NA, which that filter drops.
const R_ECONOMIES = `# Real economies only: drop WB regional / income aggregates ("World", …).
wb_countries <- jsonlite::fromJSON("https://api.worldbank.org/v2/country?format=json&per_page=400")[[2]]
economies <- wb_countries$id[wb_countries$region$id != "NA"]
`;

// ── R: time-series ──────────────────────────────────────────────────────
//
// Pipeline order mirrors chart.html exactly: fetch (aggregates dropped)
// → [weights] → [balanced panel] → year-aware transform → latest-year
// cross-country summary → [entity aggregation] → plot.
export function rTimeseries(spec) {
  const { indicator, countries, years, chartType = "line", log = false,
          transform = { method: "none" }, entityAgg = null, balanced = false,
          qualPalette = "tableau10" } = spec;
  const [y1, y2] = years || [1990, new Date().getFullYear() - 1];
  const ggtype = chartType === "bar"
    ? `geom_col(position = "dodge")`
    : chartType === "area"
      ? `geom_area(alpha = 0.35, position = "identity")`
      : `geom_line(linewidth = 0.8) + geom_point(size = 1)`;
  const logLine = log ? `  scale_y_log10() +\n` : "";
  const weighted = entityAgg && (entityAgg.method === "pop_weighted" || entityAgg.method === "gdp_weighted");

  const tfLines = transformSnippetR(transform);
  const aggLines = entityAggSnippetR(entityAgg);

  return `# EasyViz replication — ${indicator.name}
# Run in R ≥ 4.1; installs WDI + tidyverse if missing.
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
${R_ECONOMIES}
raw <- WDI(
  country   = countries,
  indicator = indicator_code,
  start     = year_from,
  end       = year_to
) |>
  as_tibble() |>
  rename(value = all_of(indicator_code)) |>
  filter(!is.na(value), iso3c %in% economies) |>
  select(iso3c, country, year, value) |>
  arrange(country, year)

${weighted ? weightsSnippetR(entityAgg) : ""}${balanced ? balancedSnippetR(weighted) : ""}${tfLines}# Cross-country summary for the latest year (EasyViz stat tiles)
raw |>
  filter(year == max(year)) |>
  summarise(year = first(year), n = n(), min = min(value), max = max(value),
            mean = mean(value), median = median(value)) |>
  print()

${aggLines}# ── 3. Plot ──────────────────────────────────────────────────────────
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

function weightsSnippetR(agg) {
  const wcode = agg.method === "pop_weighted" ? "SP.POP.TOTL" : "NY.GDP.MKTP.CD";
  return `# Weights for the ${agg.method === "pop_weighted" ? "population" : "GDP"}-weighted mean (finite, positive only)
w <- WDI(country = countries, indicator = c(weight = ${Q(wcode)}),
         start = year_from, end = year_to) |>
  as_tibble() |>
  filter(!is.na(weight), weight > 0) |>
  select(iso3c, year, weight)

`;
}

function balancedSnippetR(weighted) {
  return `# Balanced panel: keep only countries observed in every year of the
# window${weighted ? " (with a positive weight)" : ""}, so composition cannot drive the aggregate.
raw <- raw |>
${weighted ? `  semi_join(w, by = c("iso3c", "year")) |>\n` : ""}  group_by(iso3c) |>
  filter(n_distinct(year) == year_to - year_from + 1) |>
  ungroup()

`;
}

// Transforms are keyed on calendar years (match(year - k, year)), not
// row positions, so gaps never stretch the horizon — same as aggregate.js.
function transformSnippetR(t) {
  if (!t || t.method === "none") return "";
  if (t.method === "ma5") {
    return `# Temporal transform: 5-year centred moving average over the observed
# years in [t-2, t+2], at least 3 of them (gaps are not bridged by rows).
raw <- raw |>
  group_by(iso3c) |>
  mutate(value = sapply(year, function(y) {
    v <- value[abs(year - y) <= 2]
    if (length(v) >= 3) mean(v) else NA_real_
  })) |>
  ungroup() |>
  filter(!is.na(value))

`;
  }
  if (t.method === "decade") {
    return `# Temporal transform: decade means (plotted at mid-decade), kept only
# when at least 5 of the 10 years are observed.
raw <- raw |>
  mutate(decade = floor(year / 10) * 10) |>
  group_by(iso3c, country, decade) |>
  summarise(value = mean(value), n_obs = n(), .groups = "drop") |>
  filter(n_obs >= 5) |>
  mutate(year = decade + 5) |>
  arrange(country, year)

`;
  }
  if (t.method === "yoy") {
    return `# Temporal transform: year-on-year % change; needs the value at year - 1
raw <- raw |>
  group_by(iso3c) |>
  mutate(value = 100 * (value / value[match(year - 1, year)] - 1)) |>
  ungroup() |>
  filter(is.finite(value))

`;
  }
  if (t.method === "cagr") {
    return `# Temporal transform: rolling 5-year CAGR (%); base = value at year - 5 (> 0)
raw <- raw |>
  group_by(iso3c) |>
  mutate(base  = value[match(year - 5, year)],
         value = if_else(base > 0, 100 * ((value / base)^(1/5) - 1), NA_real_)) |>
  ungroup() |>
  filter(is.finite(value)) |>
  select(-base)

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
# (n = countries contributing each year)
raw <- raw |>
  group_by(year) |>
  summarise(
    value = ${fn}(value),
    n = n(),
    country = "Aggregate",
    iso3c = "AGG",
    .groups = "drop"
  )
print(range(raw$n))  # N per year: differs across years unless the panel is balanced

`;
  }
  if (agg.method === "pop_weighted" || agg.method === "gdp_weighted") {
    const wname = agg.method === "pop_weighted" ? "population" : "GDP";
    return `# Entity aggregation: ${wname}-weighted mean across selected countries per year
raw <- raw |>
  inner_join(w, by = c("iso3c", "year")) |>
  group_by(year) |>
  summarise(
    value = sum(value * weight) / sum(weight),
    n = n(),
    country = ${Q(wname + "-weighted aggregate")},
    iso3c = "AGG",
    .groups = "drop"
  )
print(range(raw$n))  # N per year: differs across years unless the panel is balanced

`;
  }
  return "";
}

// Log-axis helpers shared by scatter / bubble / gapminder (R).
function rLogDrop(logX, logY) {
  const conds = [logX && "x > 0", logY && "y > 0"].filter(Boolean);
  if (!conds.length) return "";
  return `
# Log axes: non-positive values cannot be logged — drop and report.
n_before <- nrow(df)
df <- df |> filter(${conds.join(", ")})
cat(n_before - nrow(df), "non-positive observations dropped for log axes\\n")
`;
}
const rLogScales = (logX, logY) =>
  (logX ? "scale_x_log10() +\n  " : "") + (logY ? "scale_y_log10() +\n  " : "");

// ── R: scatter / regression ─────────────────────────────────────────────
export function rScatter(spec) {
  const { indicator: a, indicatorB: b, countries, year, kind, qualPalette = "tableau10",
          logX = false, logY = false } = spec;
  const withFit = kind === "regression";
  const firstHex = (qualPyHexList(qualPalette).match(/"#[0-9a-fA-F]{6}"/) || ['"#4E79A7"'])[0];
  const fx = logX ? "log(x)" : "x", fy = logY ? "log(y)" : "y";
  return `# EasyViz replication — ${a.name} vs. ${b.name} (${year})
pkgs <- c("WDI", "dplyr", "ggplot2"${withFit ? `, "sandwich", "lmtest"` : ""})
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

${isoVecR(countries)}
year_target <- ${year}

${R_ECONOMIES}
df <- WDI(
  country   = countries,
  indicator = c(x = ${Q(a.code)}, y = ${Q(b.code)}),
  start     = year_target,
  end       = year_target
) |>
  as_tibble() |>
  filter(!is.na(x), !is.na(y), iso3c %in% economies)
${rLogDrop(logX, logY)}
${withFit ? `# OLS of ${fy} on ${fx} with HC1 heteroskedasticity-robust SEs and
# t(n - 2) inference (identical to the EasyViz Regression tab).
fit <- lm(${fy} ~ ${fx}, data = df)
vc  <- vcovHC(fit, type = "HC1")
print(coeftest(fit, vcov. = vc))   # estimates, robust SEs, t, p
print(coefci(fit, vcov. = vc))     # 95% confidence intervals
cat("R² =", summary(fit)$r.squared, " n =", nobs(fit), "\\n")

` : ""}ggplot(df, aes(x = x, y = y)) +
  geom_point(colour = ${firstHex}, size = 2) +
  ${withFit ? `geom_smooth(method = "lm", formula = y ~ x, se = FALSE, colour = "black") +  # same OLS line${logX || logY ? " (fitted on the log scale)" : ""}\n  ` : ""}${rLogScales(logX, logY)}labs(
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
  const { indicator: a, indicatorB: b, indicatorSize: s, countries, year, qualPalette = "tableau10",
          logX = false, logY = false } = spec;
  const firstHex = (qualPyHexList(qualPalette).match(/"#[0-9a-fA-F]{6}"/) || ['"#4E79A7"'])[0];
  return `# EasyViz replication — bubble (${a.name} × ${b.name}, size = ${s.name}, ${year})
pkgs <- c("WDI", "dplyr", "ggplot2")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

${isoVecR(countries)}
year_target <- ${year}

${R_ECONOMIES}
df <- WDI(
  country   = countries,
  indicator = c(x = ${Q(a.code)}, y = ${Q(b.code)}, size = ${Q(s.code)}),
  start     = year_target, end = year_target
) |>
  as_tibble() |>
  filter(!is.na(x), !is.na(y), !is.na(size), iso3c %in% economies)
${rLogDrop(logX, logY)}
ggplot(df, aes(x = x, y = y, size = size, label = country)) +
  geom_point(alpha = 0.55, colour = ${firstHex}) +
  scale_size_continuous(range = c(2, 15), name = ${Q(s.name)}) +
  ${rLogScales(logX, logY)}labs(
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
  const { indicator: a, indicatorB: b, indicatorSize: s, countries, years, qualPalette = "tableau10",
          logX = false, logY = false } = spec;
  const [y1, y2] = years || [1960, new Date().getFullYear()];
  return `# EasyViz replication — Gapminder-style animation
# Extra dependency: gganimate + gifski (for GIF export).
pkgs <- c("WDI", "dplyr", "ggplot2", "gganimate", "gifski")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

${isoVecR(countries)}

${R_ECONOMIES}
indicators <- c(x = ${Q(a.code)}, y = ${Q(b.code)}${s ? `, size = ${Q(s.code)}` : ""})
df <- WDI(country = countries, indicator = indicators,
          start = ${y1}, end = ${y2}, extra = TRUE) |>
  as_tibble() |>
  filter(!is.na(x), !is.na(y)${s ? ", !is.na(size)" : ""}, iso3c %in% economies)
${rLogDrop(logX, logY)}
p <- ggplot(df, aes(x = x, y = y${s ? ", size = size" : ""}, colour = region)) +
  geom_point(alpha = 0.7) +
  ${qualRScale(qualPalette, "colour")} +
  ${s ? "scale_size_continuous(range = c(2, 15)) +\n  " : ""}${rLogScales(logX, logY)}labs(
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

function rFillScale(palette, { log = false, reverse = false, diverging = false, center = 0, discrete = false } = {}) {
  const meta = R_PALETTES[palette] || R_PALETTES.viridis;
  let call = meta.call;
  const args = [];
  // Distiller palettes carry `direction = 1`; flip it. Viridis takes its own arg.
  if (reverse && call.includes("direction = 1")) call = call.replace("direction = 1", "direction = -1");
  if (reverse && call.includes("viridis_c")) args.push("direction = -1");
  if (discrete) {
    // Quantile classes → the discrete twin of the same palette.
    call = call.replace("scale_fill_viridis_c", "scale_fill_viridis_d")
               .replace("scale_fill_distiller", "scale_fill_brewer");
    args.push(`na.value = "grey90"`);
    return `${call}, ${args.join(", ")})`;
  }
  if (log && !(diverging || meta.kind === "div")) args.push(`trans = "log10"`);
  if (diverging || meta.kind === "div") {
    args.push(`limits = c(-max(abs(world$value - ${center}), na.rm = TRUE) + ${center}, max(abs(world$value - ${center}), na.rm = TRUE) + ${center})`);
    args.push(`rescaler = ~ scales::rescale_mid(.x, mid = ${center})`);
  }
  args.push(`na.value = "grey90"`);
  return `${call}, ${args.join(", ")})`;
}

export function rMap(spec) {
  const {
    indicator, year, period = null, log = false,
    palette = "viridis", reverse = false, diverging = false, center = 0,
  } = spec;
  const scale = diverging ? "linear" : (spec.scale || (log ? "log" : "quantile"));
  const quant = scale === "quantile";
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
# Palette: ${palette}${reverse ? " (reversed)" : ""}${diverging ? ` · diverging at ${center}` : ""} · scale: ${quant ? "7 quantile classes" : scale}
pkgs <- c("WDI", "dplyr", "ggplot2", "sf", "rnaturalearth", "rnaturalearthdata", "scales")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

${R_ECONOMIES}
df <- WDI(country = "all",
          indicator = ${Q(indicator.code)},
          start = ${y1}, end = ${y2}) |>
  as_tibble() |>
  filter(iso3c %in% economies) |>
  rename(value = all_of(${Q(indicator.code)})) |>
${aggBlock}
${quant ? `
# Quantile classes over all economies with data (type-7 quantiles,
# right-closed intervals) — the same breaks EasyViz draws.
breaks <- unique(quantile(df$value, probs = seq(0, 1, length.out = 8), na.rm = TRUE))
df <- df |> mutate(class = cut(value, breaks = breaks, include.lowest = TRUE, dig.lab = 4))
print(breaks)
` : ""}
# Natural Earth 1:110m (as on the web map); join on adm0_a3 because
# iso_a3 is "-99" for France and Norway.
world <- ne_countries(scale = "small", returnclass = "sf")
world <- dplyr::left_join(world, df, by = c("adm0_a3" = "iso3c"))

ggplot(world) +
  geom_sf(aes(fill = ${quant ? "class" : "value"}), colour = "white", linewidth = 0.1) +
  ${rFillScale(palette, { log: scale === "log", reverse, diverging, center, discrete: quant })} +
  coord_sf(crs = "+proj=eqearth") +   # Equal Earth, as on the web map
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
pkgs <- c("WDI", "dplyr", "ggplot2")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

${isoVecR(countries)}
${R_ECONOMIES}codes <- ${codeVec}
df <- WDI(country = countries, indicator = codes,
          start = ${year}, end = ${year}) |>
  as_tibble() |>
  filter(iso3c %in% economies)

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
  const [y1, y2] = years || [1990, new Date().getFullYear() - 1];
  const codeVec = `c(${indicators.map(i => `${Q(i.id || i.code.replace(/\W/g, "_"))} = ${Q(i.code)}`).join(", ")})`;
  return `# EasyViz replication — panel data frame
pkgs <- c("WDI", "dplyr", "tidyr")
to_install <- setdiff(pkgs, rownames(installed.packages()))
if (length(to_install)) install.packages(to_install)
invisible(lapply(pkgs, library, character.only = TRUE))

${isoVecR(countries)}
${R_ECONOMIES}panel <- WDI(country = countries,
             indicator = ${codeVec},
             start = ${y1}, end = ${y2}) |>
  as_tibble() |>
  filter(iso3c %in% economies) |>
  select(iso3c, country, year, ${indicators.map(i => i.id || i.code.replace(/\W/g, "_")).join(", ")}) |>
  arrange(country, year)

head(panel, 20)
# write_csv(panel, "panel.csv")
`;
}

// ── Python snippets ─────────────────────────────────────────────────────

// wbdata returns WB regional / income aggregates for country="all".
// Every Python snippet keeps real economies only (names match the
// DataFrame's `country` index exactly) and gets ISO3 codes from the same map.
const PY_ECONOMIES = `# Real economies only: drop WB regional / income aggregates ("World", …).
economies = {c["name"]: c["id"] for c in wbdata.get_countries()
             if c["region"]["value"] != "Aggregates"}
`;

function pyLogDrop(logX, logY) {
  const conds = [logX && `(df["x"] > 0)`, logY && `(df["y"] > 0)`].filter(Boolean);
  if (!conds.length) return "";
  return `
# Log axes: non-positive values cannot be logged — drop and report.
n_before = len(df)
df = df[${conds.join(" & ")}]
print(f"{n_before - len(df)} non-positive observations dropped for log axes")
`;
}
const pyLogScales = (logX, logY) =>
  (logX ? `ax.set_xscale("log")\n` : "") + (logY ? `ax.set_yscale("log")\n` : "");

export function pyTimeseries(spec) {
  const { indicator, countries, years, chartType = "line", log = false,
          transform = { method: "none" }, entityAgg = null, balanced = false,
          qualPalette = "tableau10" } = spec;
  const [y1, y2] = years || [1990, new Date().getFullYear() - 1];
  const weighted = entityAgg && (entityAgg.method === "pop_weighted" || entityAgg.method === "gdp_weighted");

  const tfLines = transformSnippetPy(transform);
  const aggLines = entityAggSnippetPy(entityAgg);
  const plotKind = chartType === "bar" ? "bar" : "line";
  const logLine = log ? `ax.set_yscale("log")\n` : "";

  return `# EasyViz replication — ${indicator.name}
# Run on Python ≥ 3.9. pip install wbdata pandas numpy matplotlib

import numpy as np
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
${PY_ECONOMIES}
def fetch(code, name):
    out = wbdata.get_dataframe(
        {code: name},
        country=countries,
        date=(datetime(year_from, 1, 1), datetime(year_to, 1, 1)),
        keep_levels=True,
    ).reset_index().dropna()
    out = out[out["country"].isin(economies)]
    out["year"] = pd.to_datetime(out["date"]).dt.year
    return out[["country", "year", name]]

df = fetch(indicator_code, "value").sort_values(["country", "year"])

${weighted ? weightsSnippetPy(entityAgg) : ""}${balanced ? balancedSnippetPy(weighted) : ""}${tfLines}# Cross-country summary for the latest year (EasyViz stat tiles)
latest = df[df["year"] == df["year"].max()]
print(f"Cross-country, {latest['year'].max()}:")
print(latest["value"].describe())

${aggLines}# ── 3. Plot ──────────────────────────────────────────────────────────
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

function weightsSnippetPy(agg) {
  const wcode = agg.method === "pop_weighted" ? "SP.POP.TOTL" : "NY.GDP.MKTP.CD";
  return `# Weights for the weighted mean (finite, positive only)
weights = fetch(${Q(wcode)}, "weight").query("weight > 0")

`;
}

function balancedSnippetPy(weighted) {
  return `# Balanced panel: keep only countries observed in every year of the
# window${weighted ? " (with a positive weight)" : ""}, so composition cannot drive the aggregate.
${weighted ? `df = df.merge(weights[["country", "year"]], on=["country", "year"])\n` : ""}df = df[df.groupby("country")["year"].transform("nunique") == year_to - year_from + 1]

`;
}

// Year-aware: pivot to countries × every calendar year, so shifts and
// windows count years, not rows (gaps stay NaN) — same as aggregate.js.
function wideTransformPy(comment, expr) {
  return `# Temporal transform: ${comment}
wide = (df.pivot(index="country", columns="year", values="value")
          .reindex(columns=range(year_from, year_to + 1)))
${expr}
df = (out.where(wide.notna()).reset_index()
         .melt(id_vars="country", var_name="year", value_name="value"))
df = df[np.isfinite(df["value"])].sort_values(["country", "year"])

`;
}

function transformSnippetPy(t) {
  if (!t || t.method === "none") return "";
  if (t.method === "ma5")
    return wideTransformPy("5-year centred moving average over observed years in [t-2, t+2], min 3",
      `out = wide.T.rolling(window=5, center=True, min_periods=3).mean().T`);
  if (t.method === "yoy")
    return wideTransformPy("year-on-year % change; needs the value at year - 1",
      `out = 100 * (wide / wide.shift(1, axis=1) - 1)`);
  if (t.method === "cagr")
    return wideTransformPy("rolling 5-year CAGR (%); base = value at year - 5 (> 0)",
      `base = wide.shift(5, axis=1)
out = (100 * ((wide / base) ** (1 / 5) - 1)).where(base > 0)`);
  if (t.method === "decade") {
    return `# Temporal transform: decade means (plotted at mid-decade), kept only
# when at least 5 of the 10 years are observed.
df["decade"] = df["year"] // 10 * 10
df = (df.groupby(["country", "decade"], as_index=False)
        .agg(value=("value", "mean"), n_obs=("value", "size"))
        .query("n_obs >= 5")
        .assign(year=lambda d: d["decade"] + 5))

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
# (n = countries contributing each year; varies unless the panel is balanced)
df = (df.groupby("year", as_index=False)
        .agg(value=("value", ${Q(agg.method)}), n=("value", "size"))
        .assign(country="Aggregate"))
print("N per year:", df["n"].min(), "to", df["n"].max())

`;
  }
  if (agg.method === "pop_weighted" || agg.method === "gdp_weighted") {
    const wname = agg.method === "pop_weighted" ? "population" : "GDP";
    return `# Entity aggregation: ${wname}-weighted mean
df = (df.merge(weights, on=["country", "year"])
        .assign(wv=lambda d: d["value"] * d["weight"])
        .groupby("year", as_index=False)
        .agg(wv=("wv", "sum"), w=("weight", "sum"), n=("value", "size"))
        .assign(value=lambda d: d["wv"] / d["w"],
                country=${Q(wname + "-weighted aggregate")}))
print("N per year:", df["n"].min(), "to", df["n"].max())

`;
  }
  return "";
}

export function pyScatter(spec) {
  const { indicator: a, indicatorB: b, countries, year, kind, qualPalette = "tableau10",
          logX = false, logY = false } = spec;
  const withFit = kind === "regression";
  const firstHex = (qualPyHexList(qualPalette).match(/"#[0-9a-fA-F]{6}"/) || ['"#4E79A7"'])[0];
  const mx = logX ? `np.log(df["x"]).rename("ln_x")` : `df["x"]`;
  const my = logY ? `np.log(df["y"])` : `df["y"]`;
  return `# EasyViz replication — ${a.name} vs. ${b.name} (${year})
# pip install wbdata pandas numpy matplotlib${withFit ? " statsmodels" : ""}

import numpy as np, pandas as pd, matplotlib.pyplot as plt, wbdata
from datetime import datetime
${withFit ? "import statsmodels.api as sm\n" : ""}
${isoVecPy(countries)}
year_target = ${year}

${PY_ECONOMIES}
df = wbdata.get_dataframe(
    {${Q(a.code)}: "x", ${Q(b.code)}: "y"},
    country=countries,
    date=(datetime(year_target, 1, 1), datetime(year_target, 1, 1)),
).reset_index().dropna()
df = df[df["country"].isin(economies)]
${pyLogDrop(logX, logY)}
fig, ax = plt.subplots(figsize=(9, 6))
ax.scatter(df["x"], df["y"], alpha=0.7, s=35, color=${firstHex})
${withFit ? `# OLS of ${logY ? "ln y" : "y"} on ${logX ? "ln x" : "x"}; HC1 robust SEs with t(n - 2) p-values and
# 95% CIs (use_t=True) — identical to the EasyViz Regression tab.
X = sm.add_constant(${mx})
model = sm.OLS(${my}, X).fit(cov_type="HC1", use_t=True)
print(model.summary())
xs = np.linspace(X.iloc[:, 1].min(), X.iloc[:, 1].max(), 100)
yhat = model.params.iloc[0] + model.params.iloc[1] * xs
ax.plot(${logX ? "np.exp(xs)" : "xs"}, ${logY ? "np.exp(yhat)" : "yhat"}, color="black", linewidth=2,
        label=f"OLS (R²={model.rsquared:.2f})")
ax.legend()
` : ""}${pyLogScales(logX, logY)}ax.set_xlabel(${Q(`${a.name} (${a.unit})`)})
ax.set_ylabel(${Q(`${b.name} (${b.unit})`)})
ax.set_title(${Q(`${a.name} vs. ${b.name} — ${year}`)})
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
`;
}

export function pyBubble(spec) {
  const { indicator: a, indicatorB: b, indicatorSize: s, countries, year, qualPalette = "tableau10",
          logX = false, logY = false } = spec;
  const firstHex = (qualPyHexList(qualPalette).match(/"#[0-9a-fA-F]{6}"/) || ['"#4E79A7"'])[0];
  return `# EasyViz replication — bubble (${a.name} × ${b.name}, size = ${s.name}, ${year})
# pip install wbdata pandas matplotlib

import pandas as pd, matplotlib.pyplot as plt, wbdata
from datetime import datetime
${isoVecPy(countries)}
year_target = ${year}

${PY_ECONOMIES}
df = wbdata.get_dataframe(
    {${Q(a.code)}: "x", ${Q(b.code)}: "y", ${Q(s.code)}: "size"},
    country=countries,
    date=(datetime(year_target, 1, 1), datetime(year_target, 1, 1)),
).reset_index().dropna()
df = df[df["country"].isin(economies)]
${pyLogDrop(logX, logY)}
sizes = 20 + 400 * (df["size"] - df["size"].min()) / (df["size"].max() - df["size"].min() + 1e-9)
fig, ax = plt.subplots(figsize=(10, 6))
ax.scatter(df["x"], df["y"], s=sizes, alpha=0.55, color=${firstHex}, edgecolor="black", linewidth=0.4)
${pyLogScales(logX, logY)}ax.set_xlabel(${Q(`${a.name} (${a.unit})`)})
ax.set_ylabel(${Q(`${b.name} (${b.unit})`)})
ax.set_title(${Q(`${a.name} vs. ${b.name} · size = ${s.name} · ${year}`)})
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
`;
}

export function pyGapminder(spec) {
  const { indicator: a, indicatorB: b, indicatorSize: s, countries, years,
          logX = false, logY = false } = spec;
  const [y1, y2] = years || [1960, new Date().getFullYear()];
  return `# EasyViz replication — Gapminder-style animation
# pip install wbdata pandas plotly

import pandas as pd, plotly.express as px, wbdata
from datetime import datetime
${isoVecPy(countries)}

${PY_ECONOMIES}
df = wbdata.get_dataframe(
    {${Q(a.code)}: "x", ${Q(b.code)}: "y"${s ? `, ${Q(s.code)}: "size"` : ""}},
    country=countries,
    date=(datetime(${y1}, 1, 1), datetime(${y2}, 1, 1)),
    keep_levels=True,
).reset_index().dropna()
df = df[df["country"].isin(economies)]
df["year"] = pd.to_datetime(df["date"]).dt.year
${pyLogDrop(logX, logY)}
# Fixed axis ranges so bubbles move rather than the axes rescaling.
fig = px.scatter(
    df.sort_values("year"), x="x", y="y",${s ? ` size="size", size_max=40,` : ""}
    animation_frame="year", hover_name="country",
    log_x=${logX ? "True" : "False"}, log_y=${logY ? "True" : "False"},
    range_x=[df["x"].min()${logX ? " / 1.1" : ""}, df["x"].max()${logX ? " * 1.1" : ""}],
    range_y=[df["y"].min()${logY ? " / 1.1" : ""}, df["y"].max()${logY ? " * 1.1" : ""}],
    labels={"x": ${Q(`${a.name} (${a.unit})`)}, "y": ${Q(`${b.name} (${b.unit})`)}},
)
fig.show()
`;
}

export function pyMap(spec) {
  const {
    indicator, year, period = null, log = false,
    palette = "viridis", reverse = false, diverging = false, center = 0,
  } = spec;
  const scale = diverging ? "linear" : (spec.scale || (log ? "log" : "quantile"));
  const quant = scale === "quantile";
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
  const fetchAndAgg = `df = wbdata.get_dataframe(
    {${Q(indicator.code)}: "value"},
    country="all",
    date=(datetime(${y1}, 1, 1), datetime(${y2}, 1, 1)),
    keep_levels=True,
).reset_index().dropna(subset=["value"])
df = df[df["country"].isin(economies)]
${useP ? `# Collapse the ${y1}-${y2} window to one value per country (NAs dropped).
df = (df.groupby("country", as_index=False)
        .agg(value=("value", ${Q(pyAgg)}), n_obs=("value", "count")))
` : ""}df["iso3"] = df["country"].map(economies)`;
  return `# EasyViz replication — choropleth map (${useP ? `${period.method} ${y1}–${y2}` : year})
# Palette: ${palette}${reverse ? " (reversed)" : ""}${diverging ? ` · diverging at ${center}` : ""} · scale: ${quant ? "7 quantile classes" : scale}
# pip install wbdata pandas geopandas matplotlib

import pandas as pd, geopandas as gpd, matplotlib.pyplot as plt, wbdata
import matplotlib.colors as mcolors
from datetime import datetime

${PY_ECONOMIES}
${fetchAndAgg}
${quant ? `
# Quantile classes over all economies with data (numpy-default / R type-7
# quantiles, right-closed intervals) — the same breaks EasyViz draws.
df["class"] = pd.qcut(df["value"], q=7, duplicates="drop")
print(df["class"].cat.categories)
` : ""}
# Natural Earth 1:110m (as on the web map); join on ADM0_A3 because
# ISO_A3 is "-99" for France and Norway.
world = gpd.read_file("https://naciscdn.org/naturalearth/110m/cultural/ne_110m_admin_0_countries.zip")
world = world.merge(df, left_on="ADM0_A3", right_on="iso3", how="left")
world = world.to_crs("+proj=eqearth")  # Equal Earth, as on the web map

cmap = ${Q(pyCmap)}
${quant ? "" : diverging ? `half = max(abs(world["value"].max() - ${center}),
           abs(${center} - world["value"].min()))
norm = mcolors.TwoSlopeNorm(vmin=${center} - half, vcenter=${center}, vmax=${center} + half)
` : scale === "log" ? `norm = mcolors.LogNorm(vmin=world["value"][world["value"] > 0].min(),
                      vmax=world["value"].max())
` : `norm = None
`}
fig, ax = plt.subplots(figsize=(12, 6))
${quant ? `world.plot(column="class", ax=ax, categorical=True, legend=True, cmap=cmap,
           legend_kwds={"title": ${Q(indicator.unit || "")}, "fontsize": 8},
           missing_kwds={"color": "lightgrey"})`
  : `world.plot(column="value", ax=ax, legend=True, cmap=cmap, norm=norm,
           missing_kwds={"color": "lightgrey"})`}
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

${PY_ECONOMIES}
codes = {${mapping}}
df = wbdata.get_dataframe(codes, country=countries,
                          date=(datetime(${year}, 1, 1), datetime(${year}, 1, 1))).reset_index()
df = df[df["country"].isin(economies)]

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
  const [y1, y2] = years || [1990, new Date().getFullYear() - 1];
  const mapping = indicators.map(i =>
    `${Q(i.code)}: ${Q(i.id || i.code.replace(/\W/g, "_"))}`
  ).join(", ");
  return `# EasyViz replication — panel data frame
# pip install wbdata pandas
import pandas as pd, wbdata
from datetime import datetime
${isoVecPy(countries)}

${PY_ECONOMIES}
codes = {${mapping}}
panel = wbdata.get_dataframe(codes, country=countries,
                             date=(datetime(${y1}, 1, 1), datetime(${y2}, 1, 1)),
                             keep_levels=True).reset_index()
panel = panel[panel["country"].isin(economies)]
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
    case "gapminder":   return pyGapminder(spec);
    case "map":         return pyMap(spec);
    case "correlation": return pyCorrelation(spec);
    case "panel":       return pyPanel(spec);
    default:            return `# Unknown spec kind: ${spec.kind}\n`;
  }
}
