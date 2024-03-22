---
title: Leveraging Natural Langage Processing techniques for a better classification of development projects. A Case Study Using OECD CRS Dataset
summary: |-
Categorising development projects is crucial for understanding donors' aid strategies, recipients' priorities, and on-the-ground actions. While the OECD CRS provides a rich source of information on development strategies, it falls short in informing project categories due to its reporting process based on self-declared main objectives. This research employs an innovative approach that combines Machine Learning (ML) techniques, specifically Natural Language Processing (NLP), to categorise development projects based on their narrative descriptions. The study utilises the Organisation for Economic Co-operation and Development's (OECD) Creditor Reporting System (CRS) dataset, which provides a rich source of project narratives from diverse sectors (approx. 5.5 million projects). {style="text-align: justify;"}

tags:
- Ongoing works
- Machine learning
- Development finance
date: '2024-03-22'

# Optional external URL for project (replaces project detail page).
external_link: ''

image:
  caption: Photo by giph on giphy
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

Categorising development projects is crucial for understanding donors' aid strategies, recipients' priorities, and on-the-ground actions. While the OECD CRS provides a rich source of information on development strategies, it falls short in informing project categories due to its reporting process based on self-declared main objectives. This research employs an innovative approach that combines Machine Learning (ML) techniques, specifically Natural Language Processing (NLP), to categorise development projects based on their narrative descriptions. The study utilises the Organisation for Economic Co-operation and Development's (OECD) Creditor Reporting System (CRS) dataset, which provides a rich source of project narratives from diverse sectors (approx. 5.5 million projects).

## What would you be able to find here?

This work is based on an article (currently under redaction, first version avalaible upon request) that aims to demonstrate the potential of machine learning for text classification. The goal is to achieve the most accurate development project classification based on their descriptions. The study aims to enable policymakers, researchers, and individuals from civil society to gain a better understanding of declared development projects by bilateral, multilateral, and private institutions. This will allow them to replicate the methodology for studying specific development finance topics. You will find here several vizualisations in order to get a better understanding of the work itself and its potentials.

## Where do these data come from?

In this study, we include all declarations made at the OECD, including bilateral (e.g. governments) and multilateral (such as the Green Climate Fund or the United Nations) development finance but also private institutions (as the Bill and Melinda Gates Foundation). This completeness allows for comparison of multiple types of donors on similar subjects. The declarations on the OECD CRS system may have different start times regarding the type of donors.

## How may I replicate this work for my own purposes?

All scripts and codes will be available in this [GitHub repository](https://github.com). From the extraction of the CRS raw dataset to the clustering process. Additionally, you can find more information about the special settings we used in the setup explanation menu of this website.

# Setup Explanation

This unsupervised machine learning clustering has been created using BERTopic ([BERTopic](https://maartengr.github.io/BERTopic/index.html)), and has been inspired by the works of Toetzke et al. (2022): [Code is available at the following link.](https://github.com/MalteToetzke/Monitoring-Global-Development-Aid-With-Machine-Learning)

## Dataset used

We used the OECD CRS Dataset, one of the most complete and comprehensive datasets regarding development financial flows. Thanks to this dataset, we have been able to categorize registered development projects from 1973 to 2022 accounting for bilateral, multilateral and private flows.

## Parameters settings

In this machine learning setting, fine-tuning requires several parameters at different steps, particularly for word embeddings and cluster construction methodology.

### Data preparation

One advantage of transformer models is that they feed themselves from context and do not require any form of text preprocessing. To increase computation speed, we assigned the same label to each project with the same description, inspired by the work of [Toetzke et al. (2022)](https://doi.org/10.1038/s41893-022-00874-z). This allowed us to cluster projects with the same description together.

### Word embeddings

We use a sentence transformers model ([paraphrase-multilingual-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2)) for word embeddings because it supports multilingual settings, which is necessary for our setup. Although we considered more recent AI models such as Mistral or Llama, we found that our sentence transformers model was better suited for fine-tuning. If you want to replicate this work with other embeddings, BERTopic can help you. Please refer to the BERTopic documentation (link provided above) for more information.

### Clustering

HDBSCAN is used for clustering because of its strong performance on large datasets with high-dimensional embeddings. Another advantage of HDBSCAN over other clustering processes, such as K-Means, is that it supports non-convex vectorization of texts and finds the optimal number of clusters without any parameters, such as silhouette score, for example. The minimum cluster size is set at 1000, meaning that each cluster contains at least 1000 unique project descriptions to ensure a sufficient yet consistent number of projects in each cluster. Dimensions of the embeddings are reduced to 15 using UMAP to avoid the [curse of dimensionality](https://en.wikipedia.org/wiki/Curse_of_dimensionality).

## Visualizations

Select a topic visualization from the following links. They are preliminary results and may be updated and vary over time. 

### Topic Visualizations

- [**Topic 2D visualization**](https://pierrebeaucoral.github.io/project/crs-ml/topics_visualization.html): Cluster visualization by size (number of descriptions/projects inside of each cluster). You can use the slider to select the topic which then lights up red. If you hover over a topic, then general information is given about the topic, including the size of the topic and its corresponding words.

{%include_relative topics_visualizations.html%} 

- [**Topic Rank distribution**](https://pierrebeaucoral.github.io/project/crs-ml/term_rank_visualization.html): Topics are represented by a number of words starting with the best representative word. Each word is represented by a c-TF-IDF score. The higher the score, the more representative a word to the topic is. Since the topic words are sorted by their c-TF-IDF score, the scores slowly decline with each word that is added. At some point adding words to the topic representation only marginally increases the total c-TF-IDF score and would not be beneficial for its representation. To visualize this effect, we can plot the c-TF-IDF scores for each topic by the term rank of each word. In other words, the position of the words (term rank), where the words with the highest c-TF-IDF score will have a rank of 1, will be put on the x-axis. Whereas the y-axis will be populated by the c-TF-IDF scores. The result is a visualization that shows you the decline of c-TF-IDF score when adding words to the topic representation. It allows you, using the elbow method, the select the best number of words in a topic.
- [**Topic Similarity Matrix**](https://pierrebeaucoral.github.io/project/crs-ml/heatmap_visualization.html): We can create a similarity matrix by simply applying cosine similarities through those topic embeddings. The result will be a matrix indicating how similar certain topics are to each other.
- [**Topic Probability Distribution**](https://pierrebeaucoral.github.io/project/crs-ml/distribution_visualization.html): The distribution of the probabilities does not give an indication to the distribution of the frequencies of topics across a document. It merely shows how confident the algorithm is that certain topics can be found in a document.
- [**Topic Over Time**](https://pierrebeaucoral.github.io/project/crs-ml/topics_over_time_visualization.html): You can double-click on a topic to make it appears lonely on the graph. Then you can add more topics by clicking on each desired topics.
- [**Topic per Donor**](https://pierrebeaucoral.github.io/project/crs-ml/topics_per_donor_visualization.html): You can vizualise by clicking on the topics which donors have more projects assigned to each topics.
- [**Topic Hierarchy**](https://pierrebeaucoral.github.io/project/crs-ml/hierarchy_visualization.html): The concept of hierarchical clustering involves examining the outcome of cluster agglomeration. During this process, high-frequency words are recalculated to provide a more accurate representation of each node. This can be observed by hovering over the black circles. The BERTopic package enables you to recluster projects based on the level of detail you require to answer your question. Of course, the further right on the graph, the more projects will be aggregated and the less clustering will make sense.


