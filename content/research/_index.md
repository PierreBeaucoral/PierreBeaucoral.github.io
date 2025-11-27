---
title: Research
type: page
summary: Research agenda, job market paper, working papers, and data & methods.
date: 2025-01-01
icon: flask
---

## Research agenda

I am a PhD candidate in Development Economics at CERDI (Université Clermont Auvergne, CNRS, IRD).  
My research studies how **climate and adaptation finance** are allocated and what they do on the ground, by combining:

- geocoded development-finance data,  
- climate and environmental indicators, and  
- modern **causal-inference** and **machine-learning** methods.

I am particularly interested in how **National Adaptation Plans (NAPs)** and other climate-policy instruments shape aid flows, emissions trajectories, and vulnerability in low- and middle-income countries.

---

## Job market paper

### *No Plan, No Aid? National Adaptation Plans and adaptation finance*  *(in progress)*

This paper asks whether and how adopting a **National Adaptation Plan** changes the volume and composition of **adaptation finance** received by developing countries.

- **Research questions**
  - Do NAPs increase total adaptation commitments and disbursements?
  - Do they reorient finance toward more vulnerable sectors or countries?
  - Are effects driven by specific donor groups (bilaterals, multilaterals, climate funds)?

- **Data**
  - Geocoded and country-level project data on development and climate finance  
  - NAP adoption and implementation information  
  - Vulnerability, exposure, and socio-economic indicators

- **Methods**
  - Staggered-adoption designs with modern difference-in-differences estimators  
  - Dynamic event studies to trace the evolution of flows pre- and post-NAP  
  - Heterogeneity by donor type, sector, and intensity of finance

- **Contribution**
  - Provides the first systematic quasi-experimental evidence on the effects of NAPs on adaptation finance.  
  - Connects the literature on adaptation planning, climate finance, and aid allocation with high-resolution data and recent econometric tools.

---

## Working papers & ongoing projects

### 1. Determinants of climate vs non-climate development finance

This project studies **which countries and regions receive climate-related finance** relative to “traditional” development projects.

- Distinguishes **adaptation, mitigation, and broader environment projects** from other sectors.
- Explores how vulnerability, governance, income, emissions, and historical ties shape allocation.
- Uses multi-donor, multi-recipient panels and geocoded project locations to capture both **cross-country** and **within-country** patterns.

### 2. Local emissions and development projects

This project links **geocoded development projects** with **high-resolution emissions data** to ask how different types of finance affect local environmental outcomes.

- Combines gridded emissions proxies with ADM-level administrative boundaries.
- Estimates the impact of different project types (e.g. energy, infrastructure, climate-labelled projects) on local emissions trajectories.
- Uses staggered-adoption designs and event studies at the subnational level.

### 3. Text-based classification of development projects

To study climate finance and sectoral patterns at scale, I build and evaluate **machine-learning tools** that classify development projects based on their text descriptions.

- Fine-tuning and applying **transformer-based models** for:
  - climate vs non-climate labels,
  - adaptation vs mitigation vs other environment categories,
  - sector and theme tagging.
- Comparing ML-based classifications with traditional purpose codes and manual tagging.
- Providing labelled datasets and reusable code for researchers working on aid, climate, and development.

---

## Data & methods

### Geocoded development finance

A core part of my work is to integrate multiple sources of **geocoded development finance**, including:

- project-level databases with information on location, sector, amounts and timing,  
- geospatial tools to harmonise project locations to **ADM2** boundaries,  
- procedures to handle multi-location projects and time-varying exposure.

This allows me to build consistent **donor–recipient–location–year panels** suitable for spatial analysis and causal evaluation.

### Climate & environmental data

To capture environmental outcomes and exposure, I rely on:

- gridded emissions proxies (e.g. sectoral emissions, air pollution),  
- climate and weather data (temperature, rainfall, extremes),  
- vulnerability and risk indices.

These datasets are merged with project and administrative boundaries to study how finance interacts with **local climate conditions** and **emissions trajectories**.

### Causal inference & machine learning

Across projects, I use and combine:

- Modern **difference-in-differences** approaches for staggered policy adoption  
- Dynamic event-study designs and post-treatment “dose” analyses  
- **Double machine learning** for high-dimensional controls  
- **NLP and representation learning** for text classification of project documents

Code is mainly written in **R** and **Python**, with an emphasis on **reproducible pipelines** and open, well-documented workflows.

---

## Data, code & replication materials

Whenever possible, I aim to share **replication packages** and **modular code** that can be reused by other researchers.

- Public repositories are available on my [GitHub profile](https://github.com/PierreBeaucoral).  
- Replication packages for papers will be linked here as they become available.  

If you are interested in using the datasets or tools developed in my work, or in collaborating on related questions, feel free to [get in touch](/#contact).
