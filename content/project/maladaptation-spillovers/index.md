---
title: "Maladaptation spillovers: do adaptation finance projects raise neighbours' vulnerability?"
summary: >
  Joint work with **Florian Weiler (CEU)** testing, in Sub-Saharan Africa, whether
  adaptation finance projects generate **negative cross-border spillovers**—a
  core empirical definition of *maladaptation* under the IPCC AR6 framing.
  The design combines the **GODAD** geocoded aid database with
  **ClimateFinanceBERT**-refined project classification and an event-study
  spatial DiD in the spirit of **Butts (2023)**. Primary venue: *Global
  Environmental Change*. Status: concept-note drafted (2026-04-15); CEU
  visiting-scholar stay March–May 2026.

authors:
  - admin
  - Florian Weiler
tags:
  - Ongoing work
  - Adaptation finance
  - Climate finance
  - Spatial econometrics
  - Causal inference
  - Maladaptation
date: '2026-04-15'

image:
  caption: Created with assistance of DALL·E
  focal_point: Smart

links:
  - icon: building
    icon_pack: fas
    name: CEU host
    url: https://people.ceu.edu/florian_weiler

external_link: ''
slides: ''
---

# Research question

Can **adaptation finance**, when geographically concentrated, *export vulnerability*
to neighbouring administrative units? If so, what project types, donors, and
contexts drive the pattern?

# Why it matters

The IPCC AR6 WG2 report defines *maladaptation* as adaptation action that
"reduces the adaptive capacity or increases the vulnerability" of other
systems, sectors, or social groups. The empirical literature has documented
this mostly at project-case level; almost no work tests it at scale using
geocoded finance panels.

# Approach

- **Data**: GODAD geocoded aid universe, merged with the OECD CRS narratives
  reclassified via **ClimateFinanceBERT** to recover true climate intent.
- **Design**: ADM2-level panel 2000–2022, treatment = adaptation project
  landfall; spillover rings defined by spatial weights. Estimator follows
  Butts (2023) for spatially-correlated treatment with staggered timing.
- **Outcomes**: local and neighbour vulnerability proxies (VIIRS night-lights
  deltas, food-security indices, EDGAR CO₂, conflict events).

# Status (2026)

- Concept note drafted (2026-04-15)
- Week-1 feasibility audit at CEU pending
- Target submission window: late 2026
