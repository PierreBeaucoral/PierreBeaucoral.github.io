# What if transferable learning benefits are systematically underestimated?
# Sourced by simulate.R: shares paths, plotting theme, parameters and packages.
stopifnot(p$quality_eta >= 0, p$quality_weight >= 0,
          p$recognition >= 0, p$recognition <= 1)

# eta in the baseline becomes the quantity/progress channel eta_N.
# eta_Q is a separate quality-improvement index; lambda converts its units.
total_eta <- p$eta + p$quality_weight * p$quality_eta

# Chosen exploration when only rho of incremental future value is recognised.
recognised_optimum <- function(rho) {
  stopifnot(all(is.finite(rho)), all(rho >= 0 & rho <= 1))
  pmin(p$B, pmax(0, p$beta * p$H * rho * total_eta / (p$w * p$K) - p$tau))
}

# Full outcome evaluated at any choice, regardless of how that choice was made.
full_outcomes <- function(e) {
  learning <- log1p(e / p$tau)
  quantity <- p$H * ((1 - p$delta) * p$K + p$eta * learning)
  quality <- p$H * p$quality_eta * learning
  current <- p$w * p$K * (p$B - e)
  data.frame(e = e, current = current, future_quantity = quantity,
             future_quality_gain = quality,
             full_objective = current + p$beta * (quantity + p$quality_weight * quality))
}

perceived_e <- recognised_optimum(p$recognition)
full_e <- recognised_optimum(1)
extension_results <- cbind(
  rho = c(p$recognition, 1),
  full_outcomes(c(perceived_e, full_e))
)
stopifnot(full_e >= perceived_e,
          extension_results$full_objective[2] + 1e-10 >= extension_results$full_objective[1],
          recognised_optimum(0) == 0)

# Optimise the perceived objective independently; include endpoints explicitly.
rho_check <- c(0, .1, p$recognition, 1)
for (rho in rho_check) {
  perceived_value <- function(e) {
    p$w * p$K * (p$B - e) + p$beta * p$H *
      ((1 - p$delta) * p$K + rho * total_eta * log1p(e / p$tau))
  }
  candidates <- if (p$B == 0) 0 else c(0, p$B,
    optimize(perceived_value, c(0, p$B), maximum = TRUE, tol = 1e-10)$maximum)
  numerical_e <- candidates[which.max(perceived_value(candidates))]
  stopifnot(abs(numerical_e - recognised_optimum(rho)) < 1e-5)
}
write.csv(extension_results, file.path(model_dir, "extension-checks.csv"), row.names = FALSE)

# The recognition figure was retired: the ct-lt build-up in simulate.R shows
# the same comparison as one more curve on the post's shared axes.

extension_macros <- c(QualityEta = p$quality_eta, QualityWeight = p$quality_weight,
                      TotalEta = total_eta, PerceivedOptimum = perceived_e,
                      FullerOptimum = full_e,
                      RecognitionPercent = 100 * p$recognition,
                      PartialCurrent = extension_results$current[1],
                      FullCurrent = extension_results$current[2],
                      PartialQuantity = extension_results$future_quantity[1],
                      FullQuantity = extension_results$future_quantity[2],
                      PartialQuality = extension_results$future_quality_gain[1],
                      FullQuality = extension_results$future_quality_gain[2],
                      PartialValue = extension_results$full_objective[1],
                      FullValue = extension_results$full_objective[2])
cat(paste(sprintf("\\newcommand{\\%s}{%s}", names(extension_macros),
                   vapply(extension_macros, function(x) format(round(x, 2), trim = TRUE),
                          character(1))), collapse = "\n"), "\n",
    file = file.path(model_dir, "model-values.tex"), append = TRUE)
print(extension_results)
