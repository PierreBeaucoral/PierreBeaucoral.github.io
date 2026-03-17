# ==============================================================
# Master GPE FERDI IHEDD — Évaluation d'Impact par DiD
# Module 5 — DiD avec hétérogénéité — de Chaisemartin & D'Haultfoeuille (2020)
# Pierre Beaucoral
# ==============================================================
#
# Instructions :
#   1. Remplacez chaque ___ par la valeur ou le code approprié
#   2. Exécutez les blocs section par section (Ctrl+Enter)
#   3. Les solutions sont disponibles dans les exercices interactifs
#      du site du cours
#
# Packages requis :
#   install.packages(c("tidyverse", ...))   # voir ci-dessous
# ==============================================================

install.packages(c("tidyverse", "did", "bigmemory", "fixest"))
install.packages("polars", repos = "https://rpolars.r-universe.dev")
install.packages("DIDmultiplegtDYN")

library(tidyverse)
library(did)
library(fixest)


# --------------------------------------------------------------
# Exercice 5.1 — Explorer les données `favara_imbs`
# --------------------------------------------------------------

# NOTE : Ce bloc nécessite RStudio (DIDmultiplegtDYN non disponible dans le navigateur)

library(tidyverse)

# Structure des données favara_imbs :
# - county     : identifiant du comté (FIPS)
# - year       : année (1994-2005)
# - inter_bra  : indice de déréglementation bancaire (0 à 4) — TRAITEMENT DISCRET
# - Dl_hpi     : variation log prix immobilier — RÉSULTAT PRINCIPAL
# - Dl_vloans_b: variation log crédit hypothécaire — MÉCANISME
# - state_n    : état (pour le clustering)

cat("Variables principales dans favara_imbs :\n")
cat("  county      : identifiant comté\n")
cat("  year        : 1994 à 2005 (12 périodes)\n")
cat("  inter_bra   : 0, 1, 2, 3, ou 4 (traitement DISCRET)\n")
cat("  Dl_hpi      : variation log prix immobilier (outcome)\n")
cat("  Dl_vloans_b : variation log crédit bancaire (mécanisme)\n")
cat("  state_n     : état (pour clustering)\n\n")
cat("Avantage vs Callaway-Sant'Anna :\n")
cat("  CS ne gère que les traitements BINAIRES (0/1)\n")
cat("  CdH gère les traitements DISCRETS et CONTINUS !\n")


# --------------------------------------------------------------
# Exercice 5.2 — Visualiser les tendances par niveau de traitement
# --------------------------------------------------------------

library(tidyverse)

# Simulation d'une version simplifiée pour l'illustration
# (données recréées pour ce bloc — vous pouvez les factoriser si vous travaillez en session continue)
set.seed(42)
n_c <- 100
favara_sim <- tibble(
  county = rep(1:n_c, 8),
  year   = rep(1998:2005, each = n_c),
  state_n = rep(sample(1:10, n_c, replace = TRUE), 8),
  inter_bra = rep(sample(0:3, n_c, replace = TRUE, prob = c(0.3, 0.3, 0.2, 0.2)), 8)
) |>
  mutate(
    traite_apres = pmin(inter_bra * (year >= 2001), 4),
    Dl_hpi = 0.03 + 0.01 * inter_bra + rnorm(n_c * 8, 0, 0.05)
  ) |>
  mutate(groupe_traitement = paste0("inter_bra = ", inter_bra))

# TODO : Visualisez la moyenne de Dl_hpi par niveau de traitement et par année
favara_sim |>
  group_by(___, ___) |>                    # TODO: année et groupe
  summarise(moy = mean(Dl_hpi), .groups = "drop") |>
  ggplot(aes(x = ___, y = ___, color = ___)) +   # TODO
  geom_line(size = 1.1) +
  geom_point(size = 2.5) +
  labs(title = "TODO: ajoutez un titre",
       x = "Année", y = "Variation log prix (Dl_hpi)", color = "Déréglementation") +
  theme_minimal()


# --------------------------------------------------------------
# Exercice 5.3 — Estimation principale (dans RStudio)
# --------------------------------------------------------------

# NOTE : Ce bloc nécessite RStudio (DIDmultiplegtDYN non disponible dans le navigateur)

# === À EXÉCUTER DANS RSTUDIO ===
# library(DIDmultiplegtDYN)
# data(favara_imbs)

# TODO : Estimez l'effet de la déréglementation bancaire sur les prix immobiliers
# Complétez les arguments manquants

# result_fi <- did_multiplegt_dyn(
#   df        = ___,           # TODO: le dataset
#   outcome   = "___",         # TODO: variation log prix (Dl_hpi)
#   group     = "___",         # TODO: identifiant comté
#   time      = "___",         # TODO: variable année
#   treatment = "___",         # TODO: indice de déréglementation
#   effects   = ___,           # TODO: essayez 5 périodes post
#   placebo   = ___,           # TODO: essayez 3 placebos pré
#   cluster   = "state_n"      # clustering au niveau état
# )
#
# summary(result_fi)

cat("Code à compléter et exécuter dans RStudio.\n")
cat("Résultat attendu :\n")
cat("  effect_1 à effect_5  : effets positifs sur Dl_hpi (déréglementation → hausse prix)\n")
cat("  placebo_1 à placebo_3: non significatifs (pré-tendances valides)\n")
cat("  ATT agrégé           : environ +0.03 à +0.05 (hausse de 3-5%)\n")


# --------------------------------------------------------------
# Exercice 5.4 — Comparer TWFE, CS et CdH sur `mpdta`
# --------------------------------------------------------------

library(did)
library(fixest)
library(tidyverse)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# 1. TWFE
twfe_est <- feols(lemp ~ treat_tv | countyreal + year,
                  data = mpdta, cluster = ~countyreal)

# 2. Callaway-Sant'Anna
att_gt_res <- att_gt(
  yname = "lemp", tname = "year", idname = "countyreal",
  gname = "first.treat", data = mpdta,
  control_group = "nevertreated", print_details = FALSE
)
cs_est <- aggte(att_gt_res, type = "simple")

# TODO : Complétez le tableau de comparaison
# Extrayez les estimateurs des deux méthodes
twfe_val <- coef(twfe_est)["treat_tv"]
cs_val   <- cs_est$overall.att

cat("=== Comparaison TWFE vs Callaway-Sant'Anna ===\n")
cat(sprintf("TWFE               : %.4f\n", twfe_val))
cat(sprintf("Callaway-Sant'Anna : %.4f\n", cs_val))
cat("\nNote : CdH sur ces données donnerait un résultat similaire (~-0.03 à -0.04)\n")
cat("Les trois méthodes convergent sur ces données modérément hétérogènes.\n")


# --------------------------------------------------------------
# Exercice 5.5 — Discussion : quelle méthode pour quel contexte ?
# --------------------------------------------------------------

# Exercice de réflexion — pas de code à compléter

# Pour chaque scénario ci-dessous, quelle méthode est la plus adaptée ?
# Écrivez votre réponse dans les commentaires.

scenarios <- list(
  "A" = "Programme de transfert conditionnel introduit simultanément dans 20 districts
         → Traitement simultané, résultat binaire (pauvreté)",

  "B" = "Réforme fiscale échelonnée sur 5 ans dans des communes de différentes provinces
         → Traitement échelonné, effets potentiellement hétérogènes",

  "C" = "Indice de décentralisation financière (0-10) variant progressivement
         selon les capacités des collectivités locales
         → Traitement continu",

  "D" = "Loi anti-corruption adoptée à différentes dates selon les régions
         → Traitement échelonné, fort potentiel d'hétérogénéité"
)

for (lettre in names(scenarios)) {
  cat("Scénario", lettre, ":\n")
  cat(scenarios[[lettre]], "\n")
  cat("→ Méthode recommandée : ___\n")   # TODO: TWFE / CS / CdH
  cat("→ Justification : ___\n\n")       # TODO: votre explication
}
