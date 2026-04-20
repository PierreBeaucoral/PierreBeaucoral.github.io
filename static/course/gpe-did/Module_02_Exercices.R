# ==============================================================
# Master GPE FERDI IHEDD — Évaluation d'Impact par DiD
# Module 2 — La DiD Classique 2×2
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

install.packages(c("tidyverse", "broom"))

library(tidyverse)
library(broom)


# --------------------------------------------------------------
# Exercice 2.1 — Simuler des données 2×2
# --------------------------------------------------------------

library(tidyverse)

set.seed(2024)
n_regions <- 100  # 50 régions traitées, 50 régions contrôles

# TODO : Créez le data frame de panel
# Chaque région apparaît deux fois : avant (2019) et après (2021)
data_did <- tibble(
  region_id = rep(1:n_regions, 2),
  annee     = rep(c(2019, 2021), each = n_regions),  # Avant et après
  traite    = rep(c(rep(1, n_regions / 2),            # Moitié traitée
                    rep(0, n_regions / 2)), 2)
) |>
  mutate(
    apres      = if_else(annee == ___, 1, 0),   # TODO: quelle année = "après" ?
    traitement = ___ * ___,                      # TODO: interaction traite x apres

    # Effet vrai : +8 points de % d'emploi pour les traités après
    taux_emploi = 55 + 5 * traite + 3 * apres + ___ * traitement +
                  rnorm(2 * n_regions, mean = 0, sd = 4)
                  # TODO: mettez le vrai effet = 8
  )

# Vérification
head(data_did, 8)


# --------------------------------------------------------------
# Exercice 2.2 — Calculer les moyennes par cellule
# --------------------------------------------------------------

# TODO : Calculez la moyenne de taux_emploi pour chacune des 4 cellules
# (traite=0/1 x apres=0/1)

# Si vous n'avez pas encore le data_did, recréez-le ici :
# (données recréées pour ce bloc — vous pouvez les factoriser si vous travaillez en session continue)
set.seed(2024)
n_regions <- 100
data_did <- tibble(
  region_id = rep(1:n_regions, 2),
  annee = rep(c(2019, 2021), each = n_regions),
  traite = rep(c(rep(1, 50), rep(0, 50)), 2)
) |>
  mutate(apres = if_else(annee == 2021, 1, 0),
         traitement = traite * apres,
         taux_emploi = 55 + 5*traite + 3*apres + 8*traitement + rnorm(200, 0, 4))

moyennes <- data_did |>
  group_by(___, ___) |>                          # TODO: grouper par traite et apres
  summarise(moy = mean(___), .groups = "drop")   # TODO: calculer la moyenne

print(moyennes)

# TODO : Calculez l'estimateur DiD manuellement à partir de ces moyennes
# DiD = (Y_11 - Y_10) - (Y_01 - Y_00)
Y_11 <- moyennes |> filter(traite == ___, apres == ___) |> pull(moy)  # traité, après
Y_10 <- moyennes |> filter(traite == ___, apres == ___) |> pull(moy)  # traité, avant
Y_01 <- moyennes |> filter(traite == ___, apres == ___) |> pull(moy)  # contrôle, après
Y_00 <- moyennes |> filter(traite == ___, apres == ___) |> pull(moy)  # contrôle, avant

did_manuel <- (Y_11 - Y_10) - (Y_01 - Y_00)
cat("\nEstimateur DiD (manuel) :", round(did_manuel, 2), "points de %\n")
cat("Vrai effet             :", 8, "points de %\n")


# --------------------------------------------------------------
# Exercice 2.3 — Modèle DiD en régression
# --------------------------------------------------------------

# Recréation des données
# (données recréées pour ce bloc — vous pouvez les factoriser si vous travaillez en session continue)
set.seed(2024); n_regions <- 100
data_did <- tibble(
  region_id = rep(1:n_regions, 2),
  annee = rep(c(2019, 2021), each = n_regions),
  traite = rep(c(rep(1, 50), rep(0, 50)), 2)
) |> mutate(apres = if_else(annee == 2021, 1, 0), traitement = traite * apres,
            taux_emploi = 55 + 5*traite + 3*apres + 8*traitement + rnorm(200, 0, 4))

# TODO : Estimez le modèle DiD par régression OLS
# Y = α + β*traite + γ*apres + δ*(traite × apres) + ε
# δ est l'estimateur DiD

modele_did <- lm(___ ~ ___ + ___ + ___:___,  # TODO: complétez la formule
                 data = data_did)

summary(modele_did)


# --------------------------------------------------------------
# Exercice 2.4 — Interpréter les coefficients
# --------------------------------------------------------------

# Si vous n'avez pas encore le modèle, recréez-le ici
# (données recréées pour ce bloc — vous pouvez les factoriser si vous travaillez en session continue)
set.seed(2024); n_regions <- 100
data_did <- tibble(
  region_id = rep(1:n_regions, 2),
  annee = rep(c(2019, 2021), each = n_regions),
  traite = rep(c(rep(1, 50), rep(0, 50)), 2)
) |> mutate(apres = if_else(annee == 2021, 1, 0), traitement = traite * apres,
            taux_emploi = 55 + 5*traite + 3*apres + 8*traitement + rnorm(200, 0, 4))
modele_did <- lm(taux_emploi ~ traite + apres + traite:apres, data = data_did)

library(broom)
resultats <- tidy(modele_did)

# TODO : Extrayez et interprétez chaque coefficient
# Complétez les phrases ci-dessous en remplaçant les ___

intercept  <- resultats |> filter(term == "(Intercept)") |> pull(estimate) |> round(1)
coef_traite <- resultats |> filter(term == "traite")      |> pull(estimate) |> round(1)
coef_apres  <- resultats |> filter(term == "apres")       |> pull(estimate) |> round(1)
coef_did    <- resultats |> filter(term == "traite:apres") |> pull(estimate) |> round(1)

cat("Intercept (α) =", intercept,   "→ Taux d'emploi moyen du groupe ___  en ___\n")
cat("β =", coef_traite, "→ Les régions traitées avaient ___ % de plus AVANT le programme\n")
cat("γ =", coef_apres,  "→ Tendance temporelle commune : hausse de ___ % pour tous\n")
cat("δ =", coef_did,    "→ EFFET DU PROGRAMME : ___ % d'emploi supplémentaire\n")


# --------------------------------------------------------------
# Exercice 2.5 — Graphique DiD
# --------------------------------------------------------------

# Recréation des données
# (données recréées pour ce bloc — vous pouvez les factoriser si vous travaillez en session continue)
set.seed(2024); n_regions <- 100
data_did <- tibble(
  region_id = rep(1:n_regions, 2),
  annee = rep(c(2019, 2021), each = n_regions),
  traite = rep(c(rep(1, 50), rep(0, 50)), 2)
) |> mutate(apres = if_else(annee == 2021, 1, 0), traitement = traite * apres,
            taux_emploi = 55 + 5*traite + 3*apres + 8*traitement + rnorm(200, 0, 4))

# TODO : Créez un graphique montrant les tendances avant/après pour les deux groupes
# 1. Calculez les moyennes par groupe et par année
# 2. Ajoutez une ligne "contrefactuelle" pour le groupe traité
# 3. Indiquez la taille de l'effet DiD

moyennes_graph <- data_did |>
  group_by(___, ___) |>            # TODO: grouper par traite et annee
  summarise(moy = mean(taux_emploi), .groups = "drop") |>
  mutate(groupe = if_else(traite == 1, "Traité", "Contrôle"))

ggplot(moyennes_graph, aes(x = annee, y = moy, color = groupe, group = groupe)) +
  geom_line(linewidth = ___) +          # TODO: taille de la ligne (essayez 1.3)
  geom_point(size = ___) +         # TODO: taille des points (essayez 4)
  # Ajoutez une ligne contrefactuelle (ligne pointillée de 2019 traité → 2021 contrôle + tendance)
  labs(
    title = "TODO: Titre du graphique",
    x     = "TODO: label axe x",
    y     = "TODO: label axe y",
    color = "Groupe"
  ) +
  theme_minimal(base_size = 14)


# --------------------------------------------------------------
# Exercice 2.6 — Évaluation complète
# --------------------------------------------------------------

# Simulez les données vous-même en vous basant sur les informations suivantes :
# - n = 80 communes (40 traitées, 40 contrôles)
# - Périodes : 2018 (avant) et 2022 (après)
# - Niveau de base (contrôle, avant) : 12 %
# - Différence initiale traités vs contrôles : +2 %
# - Tendance temporelle commune : +1.5 %
# - Effet de la réforme : +6 %
# - Bruit aléatoire : sd = 3

set.seed(123)
n <- ___           # nombre total de communes (2 fois 40 = 80)

data_reforme <- tibble(
  commune_id = rep(1:(n/2 * 2), ___),       # répété pour les 2 périodes
  annee      = rep(c(2018, 2022), each = ___),
  traite     = rep(c(rep(1, n/2), rep(0, n/2)), ___)
) |>
  mutate(
    apres         = if_else(annee == ___, 1, 0),
    traitement    = traite * apres,
    recettes_prop = ___ + ___ * traite + ___ * apres + ___ * traitement +
                    rnorm(n * 2, 0, 3)
  )

# Estimez le modèle DiD
modele_reforme <- lm(___ ~ ___ + ___ + ___:___, data = data_reforme)
summary(modele_reforme)
