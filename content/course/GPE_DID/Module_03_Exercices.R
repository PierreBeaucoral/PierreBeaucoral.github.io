# ==============================================================
# Master GPE FERDI IHEDD — Évaluation d'Impact par DiD
# Module 3 — DiD avec Effets Fixes Bidirectionnels (TWFE)
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

install.packages(c("tidyverse", "fixest", "did", "bigmemory", "knitr"))

library(tidyverse)
library(fixest)
library(did)


# --------------------------------------------------------------
# Exercice 3.1 — Charger et explorer `mpdta`
# --------------------------------------------------------------

library(tidyverse)
library(did)

# Chargement des données
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# TODO : Répondez aux questions suivantes en complétant le code

# Q1 : Combien d'unités (comtés) y a-t-il dans les données ?
nb_unites <- n_distinct(mpdta$___)   # TODO: nom de la variable identifiant les comtés
cat("Nombre de comtés :", nb_unites, "\n")

# Q2 : Quelles années sont disponibles ?
annees <- sort(unique(mpdta$___))    # TODO: variable temporelle
cat("Années :", annees, "\n")

# Q3 : Quelle est la part de comtés jamais traités ?
prop_jamais <- mpdta |>
  filter(year == min(year)) |>
  summarise(prop = mean(___ == 0)) |>   # TODO: variable d'année de traitement (0 = jamais)
  pull(prop)
cat("Part jamais traités :", round(100 * prop_jamais, 1), "%\n")


# --------------------------------------------------------------
# Exercice 3.2 — Statistiques descriptives
# --------------------------------------------------------------

library(did)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)
library(tidyverse)

# TODO : Calculez les statistiques descriptives du log emploi (lemp)
# par statut de traitement et par année

# Créez une variable "groupe" : "Jamais traité", "Traité tôt (2004)", etc.
mpdta_desc <- mpdta |>
  mutate(
    groupe = case_when(
      first.treat == 0    ~ "Jamais traité",
      first.treat == 2004 ~ "Traité en 2004",
      first.treat == 2005 ~ "Traité en 2005",
      first.treat == 2006 ~ "Traité en 2006",
      TRUE                ~ "Autre"
    )
  )

# TODO : Calculez la moyenne de lemp par groupe et par année
resume <- mpdta_desc |>
  group_by(___, ___) |>                          # par groupe et par année
  summarise(
    moy_lemp = ___(lemp),                        # TODO: fonction de résumé
    n        = n(),
    .groups  = "drop"
  )

# TODO : Visualisez les tendances
ggplot(resume, aes(x = year, y = moy_lemp, color = ___, group = ___)) +
  geom_line(linewidth = 1.1) +
  geom_point(size = 3) +
  labs(title = "Tendances du log emploi par groupe de traitement",
       x = "Année", y = "Log emploi moyen (lemp)", color = "Groupe") +
  theme_minimal(base_size = 13) +
  theme(legend.position = "bottom")


# --------------------------------------------------------------
# Exercice 3.3 — Modèles emboîtés
# --------------------------------------------------------------

library(fixest)
library(did)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# Modèle 1 : OLS simple (sans effets fixes)
modele_ols <- feols(lemp ~ treat_tv, data = mpdta)

# Modèle 2 : Avec effets fixes individuels seulement
modele_ef_ind <- feols(lemp ~ treat_tv | ___, data = mpdta)  # TODO: EF comté

# Modèle 3 : TWFE complet (effets fixes comté + année)
modele_twfe <- feols(
  lemp ~ treat_tv | ___ + ___,          # TODO: EF comté et EF année
  data    = mpdta,
  cluster = ~countyreal
)

# Comparaison des trois modèles
etable(modele_ols, modele_ef_ind, modele_twfe,
       headers  = c("OLS", "EF comté", "TWFE"),
       digits   = 4,
       se.below = TRUE)


# --------------------------------------------------------------
# Exercice 3.4 — Erreurs standard groupées
# --------------------------------------------------------------

library(fixest)
library(did)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# TODO : Estimez le TWFE avec trois types d'erreurs standard différentes
# et comparez les intervalles de confiance

twfe_ols     <- feols(lemp ~ treat_tv | countyreal + year, data = mpdta)
                # Erreurs OLS standard (par défaut)

twfe_hc1     <- feols(lemp ~ treat_tv | countyreal + year, data = mpdta,
                      se = "___")   # TODO: "hetero" pour HC1

twfe_cluster <- feols(lemp ~ treat_tv | countyreal + year, data = mpdta,
                      cluster = ~___)  # TODO: grouper par comté

etable(twfe_ols, twfe_hc1, twfe_cluster,
       headers = c("OLS std.", "HC1", "Groupées (comté)"),
       digits  = 4)


# --------------------------------------------------------------
# Exercice 3.5 — Event study avec `fixest`
# --------------------------------------------------------------

library(fixest)
library(did)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# Sun & Abraham (2021) est intégré dans fixest via sunab()
# Il gère les pré-tendances et les effets dynamiques

es_modele <- feols(
  lemp ~ sunab(___, ___) | countyreal + year,   # TODO: sunab(groupe, temps)
  data    = mpdta,
  cluster = ~countyreal
)

# Visualisation
iplot(es_modele,
      main = "TODO: Mettez un titre",    # TODO: ajoutez un titre
      xlab = "Périodes relatives au traitement",
      ylab = "Estimateur (log emploi)",
      col  = "#C2185B")


# --------------------------------------------------------------
# Exercice 3.6 — Interpréter le graphique
# --------------------------------------------------------------

library(fixest)
library(did)
data(mpdta)
mpdta$treat_tv <- as.integer(mpdta$first.treat > 0 & mpdta$year >= mpdta$first.treat)

# Event study
es_modele <- feols(lemp ~ sunab(first.treat, year) | countyreal + year,
                   data = mpdta, cluster = ~countyreal)

# Extrayez les coefficients pour les interpréter
coefs_es <- coeftable(es_modele) |>
  as.data.frame() |>
  rownames_to_column("terme") |>
  filter(grepl("year", terme))   # Filtrer les termes de l'event study

# Affichez les coefficients pré-traitement
cat("=== Coefficients pré-traitement (doivent être ≈ 0) ===\n")
coefs_es |>
  filter(grepl("::-[0-9]", terme)) |>           # TODO: comprendre ce filtre
  select(terme, Estimate, `Std. Error`) |>
  mutate(across(where(is.numeric), ~round(.x, 4))) |>
  head(5)
