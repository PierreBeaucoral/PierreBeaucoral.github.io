---
title: Research
type: page
summary: Research agenda, job market paper, dissertation chapters, and data & methods.
date: 2025-01-01
icon: flask
---

<div style="display: flex; align-items: flex-start; gap: 20px;">
    <div style="flex: 0 0 200px; max-width: 200px;">
        <img src="https://github.com/user-attachments/assets/8ac56fd5-167a-4b61-9b36-47977bcc08b6" alt="unnamed 2" style="width: 100%; height: auto;">
    </div>
    
    <div style="flex-grow: 1;">
        ## Research agenda

I am a PhD candidate in Development Economics at CERDI (Université Clermont Auvergne, CNRS, IRD).
My work studies how **climate and adaptation finance** are allocated and what they do on the ground, by combining:

- geocoded development-finance data,
- climate and environmental indicators, and
- modern **causal-inference** and **machine-learning** methods.

Across projects, I focus on how **climate-labelled vs. non-climate finance** and **adaptation planning instruments** (such as National Adaptation Plans) shape aid flows, local emissions trajectories, and vulnerability in low- and middle-income countries.

---

## Job market paper

### *Financing the Air We Breathe: Climate vs. Non-Climate Aid and Local CO₂ Emissions – Evidence from Global ADM2 Data* *(job market paper)*

This paper asks whether climate aid **decarbonizes where it lands**, and how its effects differ from otherwise similar development finance. It assembles a global **ADM2–year panel (2000–2022)** by linking geocoded development projects (GODAD) to EDGAR CO₂ emissions and applies modern staggered DiD estimators.
- **Questions**
  - Do climate-labelled portfolios reduce local emissions at the places where projects are implemented?
  - How do these effects compare with non-climate development finance?
  - How do effects vary with **cumulative climate exposure** and local development levels?

- **Data**
  - Global ADM2–year panel built from geocoded project amounts by climate category (non-climate, mitigation, adaptation, environment), using ClimateFinanceBERT-based tagging.
  - EDGAR gridded CO₂ emissions aggregated to ADM2 boundaries.
  - VIIRS night-time lights as a proxy for local economic activity.

- **Methods**
  - **Callaway & Sant’Anna–type staggered DiD** with not-yet-treated controls to estimate dynamic effects of first climate-project arrival at the ADM2 level.
  - **Dose–response design** based on cumulative post-treatment exposure (commitments/disbursements), tracing out how larger flows translate into larger or smaller emission responses.
  - Event-study profiles with flat pre-trends and placebo event-times.

- **Key findings (preliminary)**
  - Climate portfolios lead to **at most zero and on average modest declines** in local log-CO₂, which become more negative as cumulative climate exposure increases.
  - Non-climate aid **raises local emissions in the medium run**, consistent with development-driven scale effects.
  - Night-lights reactions are stronger in mid-brightness ADM2s (more activity) and muted in already bright places, yet CO₂ still rises—pointing to complex links between economic expansion, lighting, and emissions.

Together, the paper provides the first **global, causally identified, subnational assessment** of how climate versus traditional development finance shape local emissions.
---

## Dissertation chapters & ongoing projects

### 1. *Cracking the Code: Enhancing development finance understanding with artificial intelligence*

This chapter builds a **topic-modelling and clustering framework** for the full universe of OECD CRS project narratives—around 5 million projects—using **BERTopic** and transformer-based embeddings.

- **Objective**
  - Move beyond sector codes and Rio markers by uncovering **hundreds of data-driven activity clusters**, capturing what projects actually do, in the language of their descriptions.
  - Provide a reusable, transparent pipeline that researchers and practitioners can adapt to other large text corpora.

- **Method**
  - Uses BERTopic to embed and cluster project narratives, yielding **400+ hierarchical, interpretable topics**, from bee-keeping and nutrition to REDD+, social protection, or coastal infrastructure.
  - Evaluates cluster quality using multiple internal metrics and human interpretability checks.
  - Provides open code and labelled outputs via GitHub for replication and extension.

- **Role in the thesis**
  - Serves as a **foundational data tool**, feeding into downstream applications such as the ClimateFinanceBERT reclassification and climate/non-climate tagging used in other chapters.
  - Illustrates how AI can help structure complex development-finance ecosystems and support SDG-related analyses.

---

### 2. *Under the Green Canopy: Bringing public climate finance determinants analysis up to date with AI*

This chapter revisits the classic literature on **climate aid determinants** using a more accurate classification of climate projects based on **ClimateFinanceBERT** rather than Rio markers.

- **Data innovation**
  - Applies ClimateFinanceBERT to every bilateral public-finance project in the OECD CRS, assigning each project to **mitigation, adaptation, or environment** categories based on text.
  - Shows that conventional Rio-marker tallies **systematically overstate** both mitigation and adaptation flows.

- **Empirical strategy**
  - Re-estimates climate aid determinants with a **double-hurdle framework** (selection into any climate aid; volume conditional on being positive).
  - Replicates a leading determinants study, swapping only the classification scheme, to isolate how better data change conclusions.

- **Main insights (preliminary)**
  - **Mitigation finance** follows a more structured, outcome-oriented logic once misclassified projects are removed, with only modest residual roles for historical ties.
  - **Adaptation finance** shifts decisively toward **recipient vulnerability and governance capacity**, while colonial or linguistic ties become statistically insignificant.

This chapter demonstrates how **data quality and AI-based classification** fundamentally reshape what we think we know about who receives climate finance, and why.

---


### 3. *No Plan, No Aid? The effects of National Adaptation Plan implementation on received adaptation aid*

This chapter develops an integrated **theoretical and empirical framework** to study how adopting a **National Adaptation Plan (NAP)** affects the volume of **adaptation finance** received.

- **Theory:**
  - A recipient–donor model where NAP adoption sends a **two-dimensional signal**: reduced vulnerability but improved institutional capacity. Donors optimally reallocate climate aid across countries in response to this signal, balancing need and merit.

- **Empirics:**
  - Uses heterogeneity in **NAP adoption timing** to implement a **staggered DiD** design at the country level.
  - Exploits detailed adaptation-aid data from the OECD CRS, distinguishing adaptation from other flows.
  - Decomposes responses by donor type (bilateral, multilateral) and recipient characteristics.

- **Contribution:**
  - Shows that NAP implementation can **increase received adaptation aid**, clarifying how policy signals interact with donor allocation rules and informing debates on planning requirements and “signals” in climate negotiations.

---

### 4. Mapping need and money: subnational vulnerability, human development, and the shape of climate aid *(exploratory)*

This is an exploratory project that builds a harmonised **ADM2-level panel** combining subnational climate vulnerability, human development, population, and climate aid disbursements. The aim is to develop a set of **visual diagnostics** for how adaptation and other climate finance are distributed across space, rather than to make causal claims.

- **Data combination**
  - Physical Vulnerability to Climate Change Index (PVCCI) matched to ADM2 units
  - Subnational HDI from Global Data Lab, spatially intersected with ADM2 boundaries
  - WorldPop population rasters
  - Geocoded, ClimateFinanceBERT-tagged adaptation projects aggregated to ADM2

- **Visual tools**
  - Population-weighted **world cartograms** coloured by vulnerability, highlighting where large vulnerable populations live
  - Inequality decompositions (within vs between countries) of subnational vulnerability
  - **HDI–PVCCI bivariate maps** showing where adaptation appears at all (coverage) and where per-capita amounts are highest (intensity)

- **Objective**
  - Provide a **decision-oriented dashboard** on whether adaptation aid tends to align with high vulnerability, high exposure, and low human development at the subnational level.
  - Serve as a descriptive baseline and proof of concept for future econometric work on targeting and mandate alignment in climate finance.

The project is at a **very preliminary stage**; visuals and code currently function as an internal exploration rather than a polished paper or formal chapter.

---

## Data & methods

Across chapters, a common set of **data and methods** underpins the analysis:

### Geocoded development finance

- Integration of **GODAD** and other geocoded aid datasets to build donor–recipient–location–year panels.
- Systematic harmonisation of project locations to **ADM2 boundaries**, with careful treatment of multi-location projects and time-varying exposure.

### Climate, environmental & vulnerability data

- Gridded CO₂ emissions (EDGAR) aggregated to ADM2 polygons.
- Climate and weather variables, and vulnerability indicators used to capture exposure and adaptive capacity in allocation and impact analyses.

### Causal inference & machine learning

- Modern **difference-in-differences** approaches for staggered policy and treatment adoption (e.g. NAPs, first climate project).
- Dynamic **event-study** designs and **dose–response** analyses to characterise pre-trends and heterogeneous post-treatment paths.
- **Double machine learning** and high-dimensional controls for robustness in determinants models.
- **NLP / transformers** (ClimateFinanceBERT, BERTopic) for project classification and topic discovery, forming the data backbone of the climate-finance work.

---

## Data, code & replication materials

I aim to make my research as **reproducible and reusable** as possible:

- Public repositories with code, clustering outputs, and classification tools are hosted on my [GitHub profile](https://github.com/PierreBeaucoral).
- Replication packages for each chapter (data processing, estimation scripts, and figure code) will be linked here as they become publicly available.

If you are interested in using the datasets or tools developed in this work, or in collaborating on related topics, feel free to [get in touch](/#contact).
    </div>
</div>
