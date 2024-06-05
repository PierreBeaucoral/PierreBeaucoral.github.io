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
external_link: ''

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

This work is based on an article (currently under redaction, first version avalaible upon request) that aims to demonstrate the potential of machine learning for text classification. The goal is to achieve the most accurate development project classification based on their descriptions. The study aims to enable policymakers, researchers, and individuals from civil society to gain a better understanding of declared development projects by bilateral, multilateral, and private institutions. This will allow them to replicate the methodology for studying specific development finance topics. You will find here several vizualisations in order to get a better understanding of the work itself and its potentials.

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

## Visualizations

Several visualizations of the clustering output are available here. The first part is based on project classification according to their descriptions. Further development of this work will be added to focus on the effect of clustering on several common development finance indicators. Please select a topic visualization from the following links. These are preliminary results and may be updated and vary over time. 

### Distribution of project descriptions among topics

In the following links, you may find several visualizations giving you informations about the different clusters, their size in terms of project numbers or their importance over years and donors. Keep in mind that if two projects have the exact same description, they will count as "only" one project.

- [**Topic 2D visualization**](https://pierrebeaucoral.github.io/project/crs-ml/topics_visualization.html): Cluster visualization by size (number of descriptions/projects inside of each cluster). You can use the slider to select the topic which then lights up red. If you hover over a topic, then general information is given about the topic, including the size of the topic and its corresponding words.

<iframe src="topics_visualization.html" style="width:1200px; height: 800px; border: 0px;""></iframe>

  
- [**Topic Rank distribution**](https://pierrebeaucoral.github.io/project/crs-ml/term_rank_visualization.html): Topics are represented by a number of words starting with the best representative word. Each word is represented by a c-TF-IDF score. The higher the score, the more representative a word to the topic is. Since the topic words are sorted by their c-TF-IDF score, the scores slowly decline with each word that is added. At some point adding words to the topic representation only marginally increases the total c-TF-IDF score and would not be beneficial for its representation. To visualize this effect, we can plot the c-TF-IDF scores for each topic by the term rank of each word. In other words, the position of the words (term rank), where the words with the highest c-TF-IDF score will have a rank of 1, will be put on the x-axis. Whereas the y-axis will be populated by the c-TF-IDF scores. The result is a visualization that shows you the decline of c-TF-IDF score when adding words to the topic representation. It allows you, using the elbow method, the select the best number of words in a topic.

<iframe src="term_rank_visualization.html" style="width:1200px; height: 600px; border: 0px;""></iframe>

- [**Topic Similarity Matrix**](https://pierrebeaucoral.github.io/project/crs-ml/heatmap_visualization.html): We can create a similarity matrix by simply applying cosine similarities through those topic embeddings. The result will be a matrix indicating how similar certain topics are to each other.

<iframe src="heatmap_visualization.html" style="width:1800px; height: 720px; border: 0px;""></iframe>

- [**Topic Probability Distribution**](https://pierrebeaucoral.github.io/project/crs-ml/distribution_visualization.html): The distribution of the probabilities does not give an indication to the distribution of the frequencies of topics across a document. It merely shows how confident the algorithm is that certain topics can be found in a document.

<iframe src="distribution_visualization.html" style="width:1800px; height: 500px; border: 0px;""></iframe>

- [**Topic Over Time**](https://pierrebeaucoral.github.io/project/crs-ml/topics_over_time_visualization.html): You can double-click on a topic to make it appears lonely on the graph. Then you can add more topics by clicking on each desired topics.

<iframe src="topics_over_time_visualization.html" style="width:1800px; height: 680px; border: 0px;""></iframe>

- [**Topic per Donor**](https://pierrebeaucoral.github.io/project/crs-ml/topics_per_donor_visualization.html): You can vizualise by clicking on the topics which donors have more projects assigned to each topics.

<iframe src="topics_per_donor_visualization.html" style="width:1800px; height: 1000px; border: 0px;""></iframe>

- [**Topic Hierarchy**](https://pierrebeaucoral.github.io/project/crs-ml/hierarchy_visualization.html): The concept of hierarchical clustering involves examining the outcome of cluster agglomeration. During this process, high-frequency words are recalculated to provide a more accurate representation of each node. This can be observed by hovering over the black circles. The BERTopic package enables you to recluster projects based on the level of detail you require to answer your question. Of course, the further right on the graph, the more projects will be aggregated and the less clustering will make sense.

<iframe src="hierarchy_visualization.html" style="width:1800px; height: 2150px; border: 0px;""></iframe>

- [**Topic word scores**](https://pierrebeaucoral.github.io/project/crs-ml/fig_word.html): This barchart shows the top 5 words according to their c-TF-IDF scores for each topic reprensentation.

<iframe src="fig_word.html" style="width:1800px; height: 800px; border: 0px;""></iframe>

### Allocation of aid among different topics ###

In the same way one can categorize the projet distribution by topics, one can also study the commited and disbursed amount for each topic, by donor and by year. These analyses might provide valuable insights concerning aid allocation. 

#### Analysis over time ####

The links below provide information on the allocation of aid flows by topic over the years, including committed and disbursed amounts in deflated USD: 

- [**USD Commitment per Topic Over Time**](https://pierrebeaucoral.github.io/project/crs-ml/commitmentyear_plot.html)
- [**USD Disbursement per Topic Over Time**](https://pierrebeaucoral.github.io/project/crs-ml/disbursmentyear_plot.html)

#### Donor analysis ####

The distribution of aid flows allocation by topics across all donors registered in the OECD CRS dataset, committed and disbursed in deflated USD can be found at the following links:

- [**USD Commitment per Topic by Donors**](https://pierrebeaucoral.github.io/project/crs-ml/commitmentdonor_plot.html)
- [**USD Disbursement per Topic by Donors**](https://pierrebeaucoral.github.io/project/crs-ml/disbursmentdonor_plot.html)

