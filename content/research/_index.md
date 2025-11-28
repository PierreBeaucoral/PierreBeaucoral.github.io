---
title: Research
type: page
summary: Research agenda, job market paper, dissertation chapters, and data & methods.
date: 2025-01-01
icon: flask
---
<table>
  <tr>
    <td style="width: 30%; vertical-align: top; padding-right: 16px;">
      <img src="https://github.com/user-attachments/assets/8ac56fd5-167a-4b61-9b36-47977bcc08b6"
           alt="Profile photo"
           style="max-width: 100%; border-radius: 8px;">
    </td>
    <td style="width: 70%; vertical-align: top;">

## Research agenda

I am a PhD candidate in Development Economics at CERDI (Université Clermont Auvergne, CNRS, IRD).  
My work studies how **climate and adaptation finance** are allocated and what they do on the ground, by combining:

- geocoded development-finance data,  
- climate and environmental indicators, and  
- modern **causal-inference** and **machine-learning** methods.

Across projects, I focus on how **climate-labelled vs. non-climate finance** and **adaptation planning instruments** (such as National Adaptation Plans) shape aid flows, local emissions trajectories, and vulnerability in low- and middle-income countries.
  </tr>
</table>

---

## Job market paper

### *Financing the Air We Breathe: Climate vs. Non-Climate Aid and Local CO₂ Emissions – Evidence from Global ADM2 Data*  *(job market paper)*

In this paper, I ask a simple question: **does climate aid actually cut CO₂ where it lands?** I compare climate-labelled projects to otherwise similar “regular” development projects.

What I do:

- Build a **global ADM2–year panel (2000–2022)** by linking geocoded development projects (GODAD) to:
  - EDGAR CO₂ emissions aggregated to ADM2 boundaries, and  
  - VIIRS night-time lights as a proxy for local economic activity.
- Classify projects into **non-climate, mitigation, adaptation, and environment** using **ClimateFinanceBERT**.
- Use modern **staggered difference-in-differences** methods to track what happens to emissions before and after the **first climate project** arrives in a given ADM2.
- Study **dose–response patterns** by comparing places with low vs. high cumulative climate finance.

What I find (preliminary):

- Climate portfolios lead to **small, at most modest declines** in local log-CO₂, which become more negative as **cumulative climate exposure** grows.
- Non-climate aid tends to **raise local emissions in the medium run**, in line with development-driven scale effects.
- Night-lights react more strongly in “middle-brightness” ADM2s (where growth is picking up), but CO₂ often rises even when lights plateau—suggesting more complex links between growth, energy use, and emissions.

Together, the paper offers a **first global, subnational, causally-identified view** of how climate vs. traditional development finance change local emissions where projects are actually implemented.

---

## Dissertation chapters & ongoing projects

### 1. *Cracking the Code: Enhancing development finance understanding with artificial intelligence*  

This chapter is about **letting the data speak** on what development projects actually do.

What I do:

- Take the full universe of **~5 million OECD CRS project narratives** and build a **topic-modelling and clustering framework** using **BERTopic** and transformer-based embeddings.
- Recover **400+ interpretable clusters** (e.g. bee-keeping, REDD+, nutrition, coastal infrastructure, social protection) that go far beyond standard sector codes and Rio markers.
- Assess the quality of these clusters with internal metrics and **human interpretability checks**.

Why it matters:

- The result is a **reusable data tool** that better captures the real content of development projects.
- It provides the **building blocks** for the rest of the thesis:
  - feeding into **ClimateFinanceBERT** reclassification,
  - and improving climate vs. non-climate tagging in later chapters.
- All code and labelled outputs are made available on GitHub to support **replication and adaptation** by other researchers and practitioners.

---

### 2. *Under the Green Canopy: Bringing public climate finance determinants analysis up to date with AI*  

This chapter revisits the classic question **“who gets climate finance, and why?”** using better data.

What I do:

- Apply **ClimateFinanceBERT** to every bilateral public-finance project in the OECD CRS, assigning each to **mitigation, adaptation, or environment** based on text.
- Show that standard **Rio-marker-based tallies** systematically **overstate** both mitigation and adaptation flows.
- Re-estimate climate-aid determinants using a **double-hurdle framework**:
  - first: the probability that a country receives any climate aid,
  - then: the volume it receives, conditional on being positive.
- Replicate a leading determinants study but **swap only the classification scheme**, so I can clearly see how better data change the story.

Why it matters (preliminary insights):

- **Mitigation finance** looks more focused and outcome-oriented once misclassified projects are removed, with less room left for purely historical ties.
- **Adaptation finance** shifts more clearly toward **vulnerability and governance capacity**, while colonial or linguistic ties become much less important.
- The chapter shows how **AI-based classification can reshape our understanding** of who gets climate finance and on what grounds.

---

### 3. *No Plan, No Aid? The effects of National Adaptation Plan implementation on received adaptation aid*  

Here I study whether **adopting a National Adaptation Plan (NAP)** helps countries **attract more adaptation finance**.

What I do (theory):

- Build a simple **recipient–donor model** in which a NAP sends a **two-dimensional signal**:
  - lower vulnerability (countries look better prepared), and  
  - higher institutional capacity (countries look better able to use funds).
- Show how donors might optimally **reallocate climate aid** across countries in response to this signal, trading off need and merit.

What I do (empirics):

- Use differences in **NAP adoption timing** to run a **staggered DiD** at the country level.
- Combine detailed adaptation-aid data from the OECD CRS with NAP information.
- Break down results by **donor type** (bilateral vs. multilateral) and **recipient characteristics**.

Why it matters:

- The chapter asks whether NAPs work as **effective “signals” in climate diplomacy**:
  - Do they help countries secure more adaptation aid?
  - Under which conditions and from which donors?
- It speaks directly to debates on whether **planning requirements** are a fair and efficient way to allocate climate finance.

---

### 4. *Mapping need and money: subnational vulnerability, human development, and the shape of climate aid*  *(exploratory)*

This exploratory project is about **seeing where need and money meet—or don’t—on the map**.

What I do:

- Build a harmonised **ADM2-level panel** combining:
  - Physical Vulnerability to Climate Change Index (PVCCI),
  - subnational HDI from Global Data Lab,
  - WorldPop population data, and
  - geocoded, ClimateFinanceBERT-tagged **adaptation projects** aggregated to ADM2.
- Develop a set of visual tools:
  - **Population-weighted world cartograms** coloured by vulnerability, to highlight where large vulnerable populations live.
  - **Inequality decompositions** (within vs. between countries) of subnational vulnerability.
  - **HDI–PVCCI bivariate maps** showing both where adaptation finance appears at all (coverage) and where per-capita amounts are highest (intensity).

Why it matters:

- The goal is a **decision-oriented dashboard** answering questions like:
  - Are adaptation funds reaching the most vulnerable areas?
  - How does this vary with human development and population?
- At this stage, it is **descriptive by design**: a proof of concept and a baseline for future econometric work on **targeting, fairness, and mandate alignment** in climate finance.

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
