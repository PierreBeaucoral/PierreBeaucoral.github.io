# ==============================================================
# Master GPE FERDI IHEDD — Évaluation d'Impact par DiD
# Module 1 — Introduction à l'évaluation d'impact
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

install.packages("tidyverse")

library(tidyverse)


# --------------------------------------------------------------
# Exercice 1.1 — Identifier le contrefactuel
# --------------------------------------------------------------

# Entrez les moyennes observées
Y_traite_avant   <- ___  # Villages avec programme, avant
Y_traite_apres   <- ___  # Villages avec programme, après
Y_controle_avant <- ___  # Villages sans programme, avant
Y_controle_apres <- ___  # Villages sans programme, après

# Calcul des différences
delta_traite   <- Y_traite_apres   - Y_traite_avant
delta_controle <- Y_controle_apres - Y_controle_avant

# Estimateur DiD
did_estime <- delta_traite - delta_controle

cat("=== Résultats ===\n")
cat("Changement chez les traités  :", delta_traite,   "k FCFA\n")
cat("Changement chez les contrôles:", delta_controle, "k FCFA\n")
cat("Estimateur DiD               :", did_estime,     "k FCFA\n")


# --------------------------------------------------------------
# Exercice 1.2 — Biais de sélection
# --------------------------------------------------------------

# Remplissez les valeurs de l'exercice précédent
Y_traite_apres   <- ___
Y_controle_apres <- ___

# Comparaison naïve (sans DiD)
comparaison_naive <- Y_traite_apres - Y_controle_apres

# Vrai effet DiD (de l'exercice précédent)
did_estime <- 150

cat("Comparaison naïve (après seulement) :", comparaison_naive, "k FCFA\n")
cat("Estimateur DiD (correct)            :", did_estime,        "k FCFA\n")
cat("\nBiais de sélection estimé           :", comparaison_naive - did_estime, "k FCFA\n")


# --------------------------------------------------------------
# Exercice 1.3 — Explorer les données `mpdta`
# --------------------------------------------------------------

library(tidyverse)

# Chargement des données (disponibles dans le package 'did' sur CRAN)
# Pour cet exercice, nous simulons une version simplifiée
# (données recréées pour ce bloc — vous pouvez les factoriser si vous travaillez en session continue)
set.seed(42)
mpdta_sim <- tibble(
  countyreal  = rep(1:50, each = 5),
  year        = rep(2003:2007, 50),
  lemp        = rnorm(250, mean = 5.5, sd = 0.3),
  first.treat = rep(sample(c(2004, 2005, 2006, 0), 50, replace = TRUE,
                            prob = c(0.25, 0.25, 0.25, 0.25)), each = 5),
  treat       = 0
) |>
  mutate(treat = if_else(first.treat > 0 & year >= first.treat, 1, 0))

# TODO : Calculez le nombre d'unités par groupe de traitement
# Complétez le code ci-dessous :
mpdta_sim |>
  filter(year == ___) |>          # Filtrez sur la première année
  count(___)                       # Comptez par première année de traitement


# --------------------------------------------------------------
# Exercice 1.4 — Visualiser les tendances
# --------------------------------------------------------------

library(tidyverse)

# Recréer les données simulées
# (données recréées pour ce bloc — vous pouvez les factoriser si vous travaillez en session continue)
set.seed(42)
mpdta_sim <- tibble(
  countyreal  = rep(1:50, each = 5),
  year        = rep(2003:2007, 50),
  lemp        = rnorm(250, mean = 5.5, sd = 0.3),
  first.treat = rep(sample(c(2004, 2005, 2006, 0), 50, replace = TRUE,
                            prob = c(0.25, 0.25, 0.25, 0.25)), each = 5)
) |>
  mutate(
    groupe = case_when(
      first.treat == 0    ~ "Jamais traité",
      first.treat == 2004 ~ "Traité en 2004",
      first.treat == 2005 ~ "Traité en 2005",
      first.treat == 2006 ~ "Traité en 2006"
    )
  )

# TODO : Créez un graphique des tendances moyennes par groupe
# Calculez la moyenne de lemp par année et par groupe, puis tracez
mpdta_sim |>
  group_by(___, ___) |>                            # Grouper par année et groupe
  summarise(lemp_moy = mean(lemp), .groups = "drop") |>
  ggplot(aes(x = ___, y = ___, color = ___)) +     # Compléter l'esthétique
  geom_line(size = 1.2) +
  geom_point(size = 3) +
  labs(title = "Tendances moyennes par groupe de traitement",
       x = "Année", y = "Log emploi moyen", color = "Groupe") +
  theme_minimal()


# --------------------------------------------------------------
# Exercice 1.5 — Discussion
# --------------------------------------------------------------

# Espace pour tester vos idées en code si nécessaire
# Question 1 : Dans quel cas l'hypothèse de tendances parallèles
# serait-elle clairement violée dans l'exemple du programme de microfinance ?
#
# Exemple de réponse à compléter :
# "L'hypothèse serait violée si les villages sélectionnés pour le programme
#  étaient des villages qui _____ avant le programme."

# Question 2 : Si on ne peut pas observer le contrefactuel, quelle condition
# sur les données permet à la DiD de l'approximer correctement ?
#
# "La DiD approxime le contrefactuel si les deux groupes avaient des
#  tendances _____ avant le traitement."

cat("Remplacez les ___ dans les commentaires ci-dessus.\n")
cat("Puis discutez avec votre groupe.\n")
