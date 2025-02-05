---
title: "Cracking the Code: Enhancing Development Project Classification with NLP on OECD CRS data."
summary: |-
Categorising development projects is crucial for understanding donors' aid strategies, recipients' priorities, and on-the-ground actions. While the OECD CRS provides a rich source of information on development strategies, it falls short in informing project categories due to its reporting process based on self-declared main objectives. This research employs an innovative approach that combines Machine Learning (ML) techniques, specifically Natural Language Processing (NLP), to categorise development projects based on their narrative descriptions. The study utilises the Organisation for Economic Co-operation and Development's (OECD) Creditor Reporting System (CRS) dataset, which provides a rich source of project narratives from diverse sectors (approx. 5.5 million projects). {style="text-align: justify;"}

tags:
- Ongoing work
- Machine learning
- Development finance
date: '2024-03-22'

# Optional external URL for project (replaces project detail page).
external_link: 'https://pierrebeaucoral.github.io/cracking_the_code/'

image:
  caption: Created with assistance of DALL·E 2
  focal_point: Smart

links:
  - icon: twitter
    icon_pack: fab
    name: Follow
    url: https://twitter.com/PBeaucoral
url_code: ''
url_pdf: ''
url_slides: ''
url_video: ''

# Slides (optional).
#   Associate this project with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides = "example-slides"` references `content/slides/example-slides.md`.
#   Otherwise, set `slides = ""`.
slides: example
---
<div style="text-align: justify;">

# Motivations

Categorising  development projects is crucial for understanding donors’ aid strategies, recipients’ priorities, and on-the-ground actions. In this area, the Organisation for Economic Co-operation and Development’s (OECD) Creditor Reporting System (CRS) dataset is a reference data source. This dataset provides a vast collection of project narratives from various sectors (approximately 5 million projects). While the OECD CRS provides a rich source of information on development strategies, it falls short in informing project categories due to its reporting process based on self-declared (donors’) main objectives. Our research employs a novel approach that combines Machine Learning (ML) techniques, specifically Natural Language Processing (NLP), an innovative Python topic modeling technique called BERTopic, to categorise (cluster) development projects based on their narrative descriptions.

## What would you be able to find here?

This work is based on an article (currently under revision, first version avalaible upon request) that aims to demonstrate the potential of machine learning for text classification. The goal is to achieve the most accurate development project classification based on their descriptions. The study aims to enable policymakers, researchers, and individuals from civil society to gain a better understanding of declared development projects by bilateral, multilateral, and private institutions. This will allow them to replicate the methodology for studying specific development finance topics. You will find here several vizualisations in order to get a better understanding of the work itself and its potentials.

## Where do these data come from?

In this study, we include all declarations made at the OECD, including bilateral (e.g. governments) and multilateral (such as the Green Climate Fund or the United Nations) development finance but also private institutions (as the Bill and Melinda Gates Foundation). This completeness allows for comparison of multiple types of donors on similar subjects. The declarations on the OECD CRS system may have different start times regarding the type of donors.

## How may I replicate this work for my own purposes?

All scripts and codes will be available in this [GitHub repository](https://github.com/PierreBeaucoral/ML-clustering-of-development-activities), from the extraction of the CRS raw dataset to the clustering process. Further information about the special settings of our process can also be found at this page.

# Setup Explanation

This clustering was created using BERTopic ([BERTopic](https://maartengr.github.io/BERTopic/index.html)), an unsupervised machine learning technique. The approach we use was inspired by the works of Toetzke et al. (2022): [Code is available at the following link.](https://github.com/MalteToetzke/Monitoring-Global-Development-Aid-With-Machine-Learning)

## Dataset used

The OECD CRS Dataset was used, which is one of the most comprehensive datasets on development financial flows. This dataset enabled us to categorise registered development projects from 1973 to 2022, taking into account bilateral, multilateral and private flows.

## Parameters settings

In this machine learning context, the clustering and topic modelling process requires several parameters at different stages, particularly for word embeddings and cluster construction methodology.

### Data preparation

One advantage of transformer models is that they can use context without requiring text preprocessing. To increase computation speed, we allow for only one project with the same description, following the approach of [Toetzke et al. (2022)](https://doi.org/10.1038/s41893-022-00874-z). This enabled us to cluster projects with similar descriptions together.

### Word embeddings

We utilise a sentence transformers model ([paraphrase-multilingual-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2)) for word embeddings as it supports multilingual settings, which is essential for our setup. Project descriptions may be in languages such as French, German or Dutch. Although more recent AI models such as Mistral or Llama were considered, we found that our sentence transformers model was better suited for the data. If you wish to replicate this work with other embeddings, BERTopic can assist you. Please refer to the BERTopic documentation (link provided above) for further information.

### Clustering

HDBSCAN is a popular clustering algorithm due to its strong performance on large datasets with high-dimensional embeddings. HDBSCAN has an advantage over other clustering processes, such as K-Means, as it supports non-convex structures of vectorized data, such as texts, and finds the optimal number of clusters without any parameters, such as silhouette score. The minimum cluster size is set at 500, ensuring a sufficient yet consistent number of projects in each cluster. To avoid the [curse of dimensionality](https://en.wikipedia.org/wiki/Curse_of_dimensionality), the dimensions of the embeddings are reduced to 12 using UMAP.

### Labelling topics

To obtain a precise description of the created topics, we employed a cluster-based TF-IDF approach to extract the top five words for each cluster in comparison to others. **Upcoming Extension**: We are currently utilizing a new large language model (LLM) derived from Mistral. Zephyr-7B-β is the second model in this series, and it is a fine-tuned version of Mistral-7B-v0.1, trained on a mixture of publicly available and synthetic datasets using Direct Preference Optimization (DPO). We have formulated a prompt for this LLM to generate appropriate names for our clusters based on their top five words and representative documents (project descriptions that accurately characterize each cluster).

- [**USD Disbursement per Topic by Donors**](https://pierrebeaucoral.github.io/project/crs-ml/disbursmentdonor_plot.html)

<div class="iframe-container">
    <iframe src="disbursmentdonor_plot.html"></iframe>
</div>
