#!/usr/bin/env Rscript
# Illustrative two-period allocation model. No observed data or calibration.
# Run from any directory: Rscript /path/to/work/learning-detours/simulate.R
suppressPackageStartupMessages({
  library(ggplot2)
  library(jsonlite)
})

# Resolve all outputs from this script, never from the caller's working directory.
script_arg <- grep("^--file=", commandArgs(FALSE), value = TRUE)
stopifnot(length(script_arg) == 1L)
script_file <- sub("^--file=", "", script_arg)
# Rscript can encode spaces as ~+~ in its own --file argument on macOS.
if (!file.exists(script_file)) script_file <- gsub("~+~", " ", script_file, fixed = TRUE)
model_dir <- dirname(normalizePath(script_file, mustWork = TRUE))
repo_dir <- normalizePath(file.path(model_dir, "../.."))
post_dir <- file.path(repo_dir, "content/post/time-to-learn")
dir.create(post_dir, recursive = TRUE, showWarnings = FALSE)
p <- fromJSON(file.path(model_dir, "parameters.json"))

# Numerical guards: units and assumptions are documented in model.md.
stopifnot(all(is.finite(unlist(p))), p$B >= 0, p$K > 0, p$w > 0,
          p$beta >= 0, p$beta <= 1, p$H >= 0, p$eta >= 0,
          p$tau > 0, p$delta >= 0, p$delta <= 1,
          p$high_urgency > 0, p$low_urgency > 0)

# Canonical constrained optimum; vectorized over the current-work weight w.
optimal_exploration <- function(w, parameters = p) {
  stopifnot(all(is.finite(w)), all(w > 0))
  pmin(parameters$B, pmax(0, parameters$beta * parameters$H * parameters$eta /
                           (w * parameters$K) - parameters$tau))
}

# Total weighted research progress, not papers completed or creativity measured.
objective <- function(e, w = p$w, parameters = p) {
  w * parameters$K * (parameters$B - e) +
    parameters$beta * parameters$H * ((1 - parameters$delta) * parameters$K +
                                      parameters$eta * log1p(e / parameters$tau))
}

# Cross-check the closed form against numerical optimization, including corners.
weights <- c(p$low_urgency, p$w, p$high_urgency)
analytic <- optimal_exploration(weights)
numerical <- vapply(weights, function(w) {
  if (p$B == 0) return(0)
  inner <- optimize(function(e) objective(e, w), c(0, p$B),
                    maximum = TRUE, tol = 1e-10)$maximum
  candidates <- c(0, inner, p$B)
  candidates[which.max(objective(candidates, w))]
}, numeric(1))
stopifnot(max(abs(analytic - numerical)) < 1e-5)
for (name in c("beta", "H", "eta")) {
  zero_case <- p
  zero_case[[name]] <- 0
  stopifnot(optimal_exploration(p$w, zero_case) == 0)
}
zero_budget <- p
zero_budget$B <- 0
stopifnot(optimal_exploration(p$w, zero_budget) == 0)
results <- data.frame(w = weights, analytic_hours = analytic,
                      numerical_hours = numerical,
                      weighted_progress = mapply(objective, analytic, weights))
write.csv(results, file.path(model_dir, "checks.csv"), row.names = FALSE)

# Reusable visual style, matching the website; transparent SVG text remains text.
theme_detours <- theme_minimal(base_size = 22, base_family = "sans") +
  theme(plot.background = element_rect(fill = "#EEF0EA", colour = NA),
        panel.background = element_rect(fill = "#EEF0EA", colour = NA),
        panel.grid.minor = element_blank(),
        panel.grid.major = element_line(colour = "#DCDFD2"),
        text = element_text(colour = "#1E231D"),
        plot.title = element_text(size = 24, face = "bold", margin = margin(b = 14)),
        plot.subtitle = element_text(size = 18, margin = margin(b = 16)),
        legend.position = "top", legend.title = element_blank(),
        axis.title.x = element_text(margin = margin(t = 14)),
        axis.title.y = element_text(margin = margin(r = 14)),
        plot.margin = margin(18, 26, 18, 18))

# Figure 1 (the flat-cost crossing) was retired: the ct-lt build-up below
# carries that story on axes the whole post shares.
e_star <- optimal_exploration(p$w)
e_grid <- seq(0, p$B, length.out = 501)

# Figure 2: sensitivity changes only w; both corner solutions remain possible.
weight_grid <- seq(.2, 6, length.out = 801)
sensitivity <- data.frame(w = weight_grid, e = optimal_exploration(weight_grid))
write.csv(sensitivity, file.path(model_dir, "sensitivity.csv"), row.names = FALSE)
scenarios <- data.frame(w = weights, e = analytic)
chart2 <- ggplot(sensitivity, aes(w, e)) +
  geom_line(linewidth = 1.5, colour = "#2E6048") +
  geom_point(data = scenarios, size = 4, colour = "#77482F") +
  annotate("text", x = p$low_urgency + .45, y = p$B - .7,
           label = paste0(format(analytic[1]), " h"), hjust = 0, size = 6.1) +
  annotate("text", x = p$w + .2, y = analytic[2] + .55,
           label = paste0(format(analytic[2]), " h"), hjust = 0, size = 6.1) +
  annotate("text", x = p$high_urgency, y = .65,
           label = paste0(format(analytic[3]), " h"), hjust = .5, size = 6.1) +
  scale_x_continuous(breaks = 1:6, limits = c(.2, 6)) +
  scale_y_continuous(breaks = seq(0, p$B, by = 2), limits = c(0, p$B + .4),
                     expand = expansion(mult = c(.03, .03))) +
  labs(title = "A different priority gives a different allocation",
       subtitle = "Only the weight on current research changes",
       x = "Weight on current research (w)",
       y = "Exploration chosen (hours)") + theme_detours

# Figures 3a-3c: one set of axes, built up a curve at a time (theory-ct-lt.md,
# Sections 3 and 5.2). The cost of the next hour rises as hours leave current
# research (theta < 1). Each falling curve is the same marginal benefit under
# one further change: the odds it lands, the odds I actually assume, the
# quality channel counted as well. w is rescaled so the first hour still costs wK.
stopifnot(p$theta > 0, p$theta <= 1, p$pi > 0, p$pi < 1,
          p$pi_tilde > 0, p$pi_tilde < 1, p$u_curvature > 0)
marginal_cost <- function(e) p$w * p$K * ((p$B - e) / p$B)^(p$theta - 1)
current_value <- function(e) p$w * p$K * p$B / p$theta * ((p$B - e) / p$B)^p$theta
u_prime <- function(x) 1 - 2 * p$u_curvature * x
payoff <- function(e, z, scale, value = current_value) {
  value(e) + p$beta * p$H * ((1 - p$delta) * p$K + z * scale * log1p(e / p$tau))
}

# Risk-adjusted expected luck E[Z u'(x)] / E[u'(x)] for two-state luck Z in {0, 1}.
adjusted_luck <- function(e, prob, scale, value = current_value) {
  success <- u_prime(payoff(e, 1, scale, value))
  failure <- u_prime(payoff(e, 0, scale, value))
  stopifnot(all(success > 0), all(failure > 0))  # u must stay increasing on the range
  prob * success / (prob * success + (1 - prob) * failure)
}
# prob = NA is the degenerate bet: the payoff arrives for certain.
marginal_benefit <- function(e, scale = p$eta, prob = NA) {
  luck <- if (is.na(prob)) 1 else adjusted_luck(e, prob, scale)
  p$beta * p$H * scale / (p$tau + e) * luck
}
crossing <- function(scale, prob) {
  uniroot(function(e) marginal_benefit(e, scale, prob) - marginal_cost(e),
          c(0, p$B - 1e-8), tol = 1e-12)$root
}

# The full payoff scale counts quantity and quality; p$recognition is the share
# of it I act on, which Corollary 1 lets the post read as odds instead.
full_scale <- p$eta + p$quality_weight * p$quality_eta
e_sure <- crossing(p$eta, NA)
e_odds <- crossing(p$eta, p$pi)
e_quality <- crossing(full_scale, p$pi)
e_pessimist <- crossing(p$eta, p$pi_tilde)
stopifnot(e_pessimist < e_odds, e_odds < e_quality, e_quality < e_sure)

# Surplus lost by stopping at the pessimist's crossing instead of the true one,
# measured under the true curves. EU'(e) = E[u'] * (MB - MC), so this area is
# exact in progress units and proportional, not equal, to the utility loss.
surplus_gap <- function(e) marginal_benefit(e, p$eta, p$pi) - marginal_cost(e)
surplus <- integrate(surplus_gap, e_pessimist, e_odds, rel.tol = 1e-12)$value
objective_at_optimum <- current_value(e_odds) +
  p$beta * p$H * ((1 - p$delta) * p$K + p$pi * p$eta * log1p(e_odds / p$tau))
surplus_share <- surplus / objective_at_optimum
surplus_minutes <- 60 * surplus / marginal_cost(e_odds)
stopifnot(surplus > 0, surplus_share < 0.01)

# One curve per row, revealed in the order the post needs them.
ct_levels <- c("Cost of the next hour",
               "Gain if the payoff were sure",
               "Gain once I also count quality",
               "Gain allowing for the odds",
               "Gain at the odds I assume")
ct_palette <- setNames(c("#77482F", "#12332A", "#2F7A56", "#6FAE8D", "#B0C9BA"), ct_levels)
ct_stops <- c(NA, e_sure, e_quality, e_odds, e_pessimist)
ct_curve <- function(level, values) {
  data.frame(e = e_grid, value = values, component = ct_levels[level])
}
ct_all <- rbind(
  ct_curve(1, marginal_cost(e_grid)),
  ct_curve(2, marginal_benefit(e_grid)),
  ct_curve(3, marginal_benefit(e_grid, full_scale, p$pi)),
  ct_curve(4, marginal_benefit(e_grid, p$eta, p$pi)),
  ct_curve(5, marginal_benefit(e_grid, p$eta, p$pi_tilde)))

# Legend labels carry the crossing, so the plot needs no annotation clutter.
ct_chart <- function(shown, band = FALSE) {
  keep <- ct_levels[shown]
  labels <- setNames(ifelse(is.na(ct_stops[shown]), keep,
                            paste0(keep, "  —  stops at ",
                                   format(round(ct_stops[shown], 1), nsmall = 1), " h")), keep)
  curves <- ct_all[ct_all$component %in% keep, ]
  curves$component <- factor(curves$component, levels = keep)
  stops <- ct_stops[shown][!is.na(ct_stops[shown])]
  plot <- ggplot(curves, aes(e, value, colour = component))
  if (band) {
    ribbon <- data.frame(e = seq(e_pessimist, e_odds, length.out = 200))
    ribbon$upper <- marginal_benefit(ribbon$e, p$eta, p$pi)
    ribbon$lower <- marginal_cost(ribbon$e)
    plot <- plot +
      geom_ribbon(data = ribbon, aes(e, ymin = lower, ymax = upper),
                  inherit.aes = FALSE, fill = "#77482F", alpha = .38) +
      annotate("segment", x = e_odds + .3, y = 2.05, xend = (e_pessimist + e_odds) / 2,
               yend = 1.32, linewidth = .5, colour = "#77482F") +
      annotate("text", x = e_odds + .4, y = 2.25, hjust = 0, size = 5.8, colour = "#77482F",
               label = paste0("Progress given up: ", format(round(surplus, 2), nsmall = 2),
                              "\n(about ", round(surplus_minutes),
                              " minutes of current research)"))
  }
  plot + geom_line(linewidth = 1.5) +
    geom_vline(xintercept = stops, linetype = "dashed", colour = "#8A968C") +
    annotate("point", x = stops, y = marginal_cost(stops), size = 3.6, colour = "#4A7A5E") +
    scale_colour_manual(values = ct_palette, labels = labels) +
    guides(colour = guide_legend(ncol = 2, byrow = TRUE)) +
    scale_x_continuous(breaks = seq(0, p$B, by = 2), limits = c(0, p$B)) +
    scale_y_continuous(limits = c(0, 4.8), expand = expansion(mult = c(0, .02))) +
    labs(title = "The hour that costs more, and the hour that promises less",
         subtitle = "Illustrative simulation · invented parameters",
         x = paste0("Hours spent exploring (available time: ", p$B, " h)"),
         y = "Weighted progress per hour") + theme_detours
}
chart3 <- ct_chart(c(1, 2, 4))
chart4 <- ct_chart(c(1, 2, 4, 5), band = TRUE)
chart5 <- ct_chart(c(1, 2, 3, 4, 5))

# The Section 6.1 chain, kept at theta = 1 so every number in the post is the
# one the theory memo checked by hand. Linear cost of delay, same two states.
linear_value <- function(e) p$w * p$K * (p$B - e)
linear_choice <- function(prob) {
  pmin(p$B, pmax(0, prob * p$beta * p$H * p$eta / (p$w * p$K) - p$tau))
}
# EU'(e) at a risk-neutral benchmark choice reduces to this single covariance term.
eu_slope_at_benchmark <- function(prob) {
  e <- linear_choice(prob)
  p$beta * p$H * p$eta / (p$tau + e) * prob * (1 - prob) *
    (u_prime(payoff(e, 1, p$eta, linear_value)) - u_prime(payoff(e, 0, p$eta, linear_value)))
}
ct_checks <- data.frame(
  quantity = c("e_det", "e_lin_pi", "e_lin_pi_tilde", "eu_slope_at_e_lin_pi",
               "eu_slope_at_e_lin_pi_tilde", "crossing_certain", "crossing_risk_adjusted",
               "crossing_with_quality", "crossing_pessimist", "surplus_lost",
               "surplus_share", "surplus_minutes"),
  value = c(linear_choice(1), linear_choice(p$pi), linear_choice(p$pi_tilde),
            eu_slope_at_benchmark(p$pi), eu_slope_at_benchmark(p$pi_tilde),
            e_sure, e_odds, e_quality, e_pessimist,
            surplus, surplus_share, surplus_minutes))
stopifnot(ct_checks$value[4] < 0, ct_checks$value[5] < 0)  # Proposition 2: caution bites
write.csv(ct_checks, file.path(model_dir, "ct-lt-checks.csv"), row.names = FALSE)


# Web SVGs; the deck is pure TikZ and embeds no plots.
charts <- list(sensibilite = chart2,
               `ct-lt-1` = chart3, `ct-lt-2` = chart4, `ct-lt-3` = chart5)
for (name in names(charts)) {
  ggsave(file.path(post_dir, paste0(name, ".svg")), charts[[name]],
         device = svglite::svglite, width = 12, height = 7.2, bg = "#EEF0EA")
}

# Deck constants generated from the same parameter file, not retyped in TeX.
macros <- c(BaseBudget = p$B, BaseOptimum = e_star, BaseBeta = p$beta,
            BaseHorizon = p$H, BaseEta = p$eta, BaseTau = p$tau, BaseK = p$K,
            BaseUrgency = p$w, BaseDelta = p$delta,
            HighUrgency = p$high_urgency, LowUrgency = p$low_urgency)
writeLines(sprintf("\\newcommand{\\%s}{%s}", names(macros),
                   vapply(macros, function(x) format(x, trim = TRUE,
                                                    scientific = FALSE), character(1))),
           file.path(model_dir, "model-values.tex"))
print(results)
source(file.path(model_dir, "extension.R"), local = TRUE)
