---
title: Research
type: page
summary: Research agenda, job market paper, dissertation chapters, and data & methods.
date: 2025-01-01
icon: flask
---
<table>
  <tr>
    </td>
    <td style="width: 70%; vertical-align: top;">

## Research agenda

I am a PhD candidate in Development Economics at CERDI (Université Clermont Auvergne, CNRS, IRD).  
My work studies how **climate and adaptation finance** are allocated and what they do on the ground, by combining:

- development-finance data,  
- climate and environmental indicators, and  
- modern **causal-inference** and **machine-learning** methods.

Across projects, I focus on how **climate-labelled vs. non-climate finance** and **adaptation planning instruments** (such as National Adaptation Plans) shape aid flows, local emissions trajectories, and vulnerability in low- and middle-income countries.
    <td style="width: 30%; vertical-align: top; padding-right: 16px;">
      <img src="https://github.com/user-attachments/assets/6730fd50-971d-42d6-ac54-9ea78258e38d"
           alt="Profile photo"
           style="max-width: 100%; border-radius: 8px;">
   
  </tr>
</table>

---
## Development Goals, Environmental Costs?
**Evidence from geocoded climate and non-climate finance** 
*Pierre Beaucoral (CERDI, Université Clermont Auvergne, CNRS, IRD)*  
**Job market paper** · [Read the paper (PDF) ↗](https://drive.proton.me/urls/R8AMVCG800#lZca0H9bjWuQ)

### Big picture
Population growth and rising living standards in developing countries are increasing demand for energy and infrastructure, with lasting consequences for the environment. Development finance is expected to raise activity where it lands *and* to move recipients toward lower-carbon production, so judging it requires both outcomes, measured for the same projects. The paper asks: **does development finance expand local activity, at what cost for the environment, and how does climate finance differ?**

### What I do
I link geocoded finance from multilateral and bilateral donors to **night-time lights, emissions and land cover** in a global district-year panel, and compare districts that receive projects with districts whose first project comes later. One content classifier is applied to every donor's projects, and every effect is estimated with one design, so climate and non-climate portfolios, intervention classes, donors and financing types are compared on the same margins.

### Data & measurement
- **Unit of analysis:** second-level administrative districts (ADM2, GADM 4.1) in 140 ODA-eligible low- and middle-income countries, 1985–2020.
- **Finance:** geocoded aid projects from GODAD; climate relevance assigned by **text classification (ClimateFinanceBERT)** on project titles and descriptions, in place of donor self-labels.
- **Outcomes:** fossil-fuel and industrial-process CO₂ and methane (EDGAR gridded inventory), measured activity from harmonised DMSP–VIIRS night-time lights (lit share), gross tree-cover loss (Hansen Global Forest Change) and cropland greenness (MODIS NDVI).

### Empirical strategy
- **Staggered difference-in-differences:** each newly financed district is compared with districts whose first project is still to come (Callaway & Sant'Anna not-yet-treated controls), so each estimate is the effect of a portfolio's first recorded project.
- **Heterogeneity:** climate finance split by intervention class, donor group and financing type; results read through a model of establishments that buy energy on site or from the grid.

### Main findings
- **Non-climate finance** expands activity measured by night-time lights, a gain that holds with standard errors clustered by first-level region. The estimated **8.4% rise in CO₂** is less certain: it largely reflects national totals that the emissions inventory assigns to districts.
- **Climate finance** has no detectable average effect on log CO₂; what it changes depends on what it funds. Sustainable land use cuts CO₂ with no detectable change in activity; adaptation lowers methane and forest loss, but also activity.
- No set of projects robustly lowers combined emissions (CO₂, methane and forest carbon) while raising measured activity. **A climate label alone does not predict a project's activity and environmental effects**, so both must be measured for the same projects.

### Status
**Preliminary version** (November 2026) — please do not cite or circulate without permission. [Latest version (PDF) ↗](https://drive.proton.me/urls/R8AMVCG800#lZca0H9bjWuQ)

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
- It provides the **building blocks** for the rest of the thesis.
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

### 3. *Do National Adaptation Plans Attract Adaptation Finance? Evidence from the composition of aid*  

With [Sebastien Marchand](https://pierrebeaucoral.github.io/authors/smarchand/) and [Michael Goujon](https://pierrebeaucoral.github.io/authors/mgoujon/). Here we study whether **adopting a National Adaptation Plan (NAP)** mobilizes additional development finance, or redirects existing finance toward adaptation. [Project page](https://pierrebeaucoral.github.io/NAP/)

What we do (theory):

- Build a simple **recipient–donor allocation model** in which a NAP signals **adaptation-planning capacity** (the *merit* side of the need–merit dilemma), while leaving climate hazard and exposure unchanged.
- Separate a **composition channel** (the adaptation share within a country's envelope) from an **envelope channel** (the total allocated to the country).

What we do (empirics):

- Link NAP submission dates (UNFCCC) to OECD CRS commitments for **145 recipient countries, 2009–2024**.
- Run a **staggered DiD** (Callaway & Sant'Anna 2021) on the 2021–2024 adoption cohorts, with heterogeneity by **donor type** and **baseline capacity**.

What we find:

- NAP adoption raises the **adaptation share** of commitments by **2.65 pp** (from 6.03%) and adaptation-marked commitments by about **35%** (an upper bound), with **no detectable change in total commitments**.
- The response runs through **official donors**, DAC bilateral and multilateral.
- A NAP steers the finance a country already receives rather than unlocking additional finance, which matters for countries that cannot yet produce one.

---

### 4. *Subnational allocation of geolocated bilateral adaptation projects: a global analysis, 2010–2020*

With [Paul Vernus](https://pierrebeaucoral.github.io/authors/pvernus/). Climate agreements pledge support to countries "particularly vulnerable" to climate change, but say nothing about how the finance is to be allocated **within** them. We ask whom bilateral adaptation finance prioritizes inside recipient countries.

What we do:

- Geolocate adaptation-related projects committed over **2010–2020 by 19 bilateral donors** in the **29,099 second-level administrative regions** of the 152 Non-Annex I Parties (GODAD).
- Link each region to its **physical hazard** (coastal, dryland, heat), **population**, **human development** (subnational HDI) and the **political status of its ethnic groups** (Ethnic Power Relations).
- Test three principles drawn from the treaties and the climate-justice literature: projects should follow **hazard**, and at high hazard should treat **poorer** and **politically excluded** regions equally or give them priority.

What we find:

- Most people at high hazard live **outside the LDCs and SIDS**, and geolocated projects reach only 9% of regions.
- Within countries, projects go more often to regions at high **coastal** hazard, but not to regions at high dryland or heat hazard.
- At high hazard, poorer regions and regions with less political power receive projects **about as often** as other regions of their country: **no evidence of priority**.

Why it matters:

- As Parties track adaptation under the Paris Agreement, tracking finance within countries requires project documents to record **where projects are implemented**.

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
