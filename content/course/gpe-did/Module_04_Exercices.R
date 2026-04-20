# ==============================================================
# Master GPE FERDI IHEDD — Évaluation d'Impact par DiD
# Module 4 — DiD Échelonnée — Callaway & Sant'Anna (2021)
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

install.packages(c("tidyverse", "did", "bigmemory", "fixest", "knitr"))

library(tidyverse)
library(did)
library(fixest)


# --------------------------------------------------------------
# Exercice 4.1 — Estimation de base
# --------------------------------------------------------------

library(did)
library(tidyverse)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# TODO : Estimez les ATT(g,t) avec la configuration de base
# Variables :
# - Résultat     : lemp
# - Temps        : year
# - Identifiant  : countyreal
# - Groupe (1er traitement) : first.treat (0 = jamais traité)
# - Groupe de comparaison : "nevertreated"

att_gt_res <- att_gt(
  yname         = "___",          # TODO: variable de résultat
  tname         = "___",          # TODO: variable de temps
  idname        = "___",          # TODO: identifiant des unités
  gname         = "___",          # TODO: année du 1er traitement
  data          = ___,            # TODO: nom du dataset
  control_group = "___",          # TODO: "nevertreated"
  print_details = FALSE
)

summary(att_gt_res)


# --------------------------------------------------------------
# Exercice 4.2 — Visualiser les ATT(g,t)
# --------------------------------------------------------------

library(did)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# Recréation de att_gt_res (si nécessaire)
# (données recréées pour ce bloc — vous pouvez les factoriser si vous travaillez en session continue)
att_gt_res <- att_gt(
  yname = "lemp", tname = "year", idname = "countyreal",
  gname = "first.treat", data = mpdta,
  control_group = "nevertreated", print_details = FALSE
)

# TODO : Visualisez les ATT(g,t) avec ggdid()
# Ajoutez un titre descriptif

ggdid(att_gt_res,
      title = "TODO: Ajoutez un titre")  # TODO: complétez le titre


# --------------------------------------------------------------
# Exercice 4.3 — Trois types d'agrégation
# --------------------------------------------------------------

library(did)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# (données recréées pour ce bloc — vous pouvez les factoriser si vous travaillez en session continue)
att_gt_res <- att_gt(
  yname = "lemp", tname = "year", idname = "countyreal",
  gname = "first.treat", data = mpdta,
  control_group = "nevertreated", print_details = FALSE
)

# TODO : Calculez les trois types d'agrégation
# 1. Agrégation simple (une seule valeur : ATT moyen global)
agg_simple  <- aggte(att_gt_res, type = "___")   # TODO: "simple"

# 2. Agrégation par groupe/cohorte
agg_groupe  <- aggte(att_gt_res, type = "___")   # TODO: "group"

# 3. Agrégation dynamique (event study)
agg_dynamic <- aggte(att_gt_res, type = "___")   # TODO: "dynamic"

# Affichez les résultats
cat("=== ATT moyen global ===\n")
summary(agg_simple)

cat("\n=== ATT par cohorte ===\n")
summary(agg_groupe)


# --------------------------------------------------------------
# Exercice 4.4 — Event study Callaway-Sant'Anna
# --------------------------------------------------------------

library(did)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# (données recréées pour ce bloc — vous pouvez les factoriser si vous travaillez en session continue)
att_gt_res <- att_gt(
  yname = "lemp", tname = "year", idname = "countyreal",
  gname = "first.treat", data = mpdta,
  control_group = "nevertreated", print_details = FALSE
)

agg_dynamic <- aggte(att_gt_res, type = "dynamic")

# TODO : Visualisez l'event study
# Remplacez les ___ par des arguments appropriés
ggdid(___,                                # TODO: objet à visualiser
      title = "Event Study — Callaway & Sant'Anna (2021)",
      ylab  = "ATT estimé (log emploi)",
      xlab  = "Périodes relatives au traitement")


# --------------------------------------------------------------
# Exercice 4.5 — TWFE vs Callaway-Sant'Anna
# --------------------------------------------------------------

library(did)
library(fixest)
library(tidyverse)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# Estimateurs à comparer

# 1. TWFE
twfe_est <- feols(
  lemp ~ treat_tv | countyreal + year,
  data    = mpdta,
  cluster = ~countyreal
)

# 2. CS — ATT simple
att_gt_res <- att_gt(
  yname = "lemp", tname = "year", idname = "countyreal",
  gname = "first.treat", data = mpdta,
  control_group = "nevertreated", print_details = FALSE
)
cs_est <- aggte(att_gt_res, type = "simple")

# TODO : Créez un tableau de comparaison
tibble(
  Méthode    = c("TWFE (fixest)", "Callaway-Sant'Anna"),
  Estimateur = c(round(coef(___), 4),          # TODO: extraire coef TWFE
                 round(cs_est$___, 4)),         # TODO: ATT global CS
  SE         = c(round(se(___), 4),             # TODO: erreur standard TWFE
                 round(cs_est$___, 4))          # TODO: SE global CS
) |> knitr::kable(caption = "Comparaison TWFE vs Callaway-Sant'Anna")


# --------------------------------------------------------------
# Exercice 4.6 — Contrôle de l'état de la procédure
# --------------------------------------------------------------

library(did)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# TODO : Répétez l'estimation en utilisant "notyettreated" au lieu de "nevertreated"
# et comparez les résultats

att_gt_nyt <- att_gt(
  yname         = "lemp",
  tname         = "year",
  idname        = "countyreal",
  gname         = "first.treat",
  data          = mpdta,
  control_group = "___",          # TODO: "notyettreated"
  print_details = FALSE
)

agg_nyt <- aggte(att_gt_nyt, type = "simple")

# Comparer avec nevertreated
att_gt_nt <- att_gt(
  yname = "lemp", tname = "year", idname = "countyreal",
  gname = "first.treat", data = mpdta,
  control_group = "nevertreated", print_details = FALSE
)
agg_nt <- aggte(att_gt_nt, type = "simple")

cat("=== Comparaison des groupes de contrôle ===\n")
cat("Jamais traités (nevertreated) :", round(agg_nt$overall.att, 4), "\n")
cat("Pas encore traités (notyettreated):", round(agg_nyt$overall.att, 4), "\n")
