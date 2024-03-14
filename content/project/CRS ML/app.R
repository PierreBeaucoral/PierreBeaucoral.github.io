library(shiny)
library(shinydashboard)
library(shinythemes)


# Create a dataframe for file information
file_info <- data.frame(
  file_name = c(
    "Topic 2D visualization",
    "Topic Rank distribution",
    "Topic similarity Matrix",
    "Topic probability distribution",
    "Topic over time",
    "Topic per donor",
    "Topic hierarchy",
    "Most frequent words per topics",
    "Project assignment to each topic"
  ),
  file_path = c(
    "topics_visualization.html",
    "term_rank_visualization.html",
    "heatmap_visualization.html",
    "distribution_visualization.html",
    "topics_over_time_visualization.html",
    "topics_per_donor_visualization.html",
    "hierarchy_visualization.html",
    "fig_word.html",
    "fig_assignement.html"
  ),
  explanation = c(
    "<div style='text-align: justify;'>Cluster visualization by size (number of descriptions/projects inside of each cluster). You can use the slider to select the topic which then lights up red. If you hover over a topic, then general information is given about the topic, including the size of the topic and its corresponding words.</div>",
    "<div style='text-align: justify;'>Topics are represented by a number of words starting with the best representative word. Each word is represented by a c-TF-IDF score. The higher the score, the more representative a word to the topic is. Since the topic words are sorted by their c-TF-IDF score, the scores slowly decline with each word that is added. At some point adding words to the topic representation only marginally increases the total c-TF-IDF score and would not be beneficial for its representation. To visualize this effect, we can plot the c-TF-IDF scores for each topic by the term rank of each word. In other words, the position of the words (term rank), where the words with the highest c-TF-IDF score will have a rank of 1, will be put on the x-axis. Whereas the y-axis will be populated by the c-TF-IDF scores. The result is a visualization that shows you the decline of c-TF-IDF score when adding words to the topic representation. It allows you, using the elbow method, the select the best number of words in a topic.</div>",
    "<div style='text-align: justify;'>We can create a similarity matrix by simply applying cosine similarities through those topic embeddings. The result will be a matrix indicating how similar certain topics are to each other.</div>",
    "<div style='text-align: justify;'>The distribution of the probabilities does not give an indication to the distribution of the frequencies of topics across a document. It merely shows how confident the algorithm is that certain topics can be found in a document.</div>",
    "<div style='text-align: justify;'>You can double-click on a topic to make it appears lonely on the graph.</div>",
    "<div style='text-align: justify;'>You can vizualise by clicking on the topics which donors have more projects assigned to each topics.</div>",
    "<div style='text-align: justify;'>The concept of hierarchical clustering involves examining the outcome of cluster agglomeration. During this process, high-frequency words are recalculated to provide a more accurate representation of each node. This can be observed by hovering over the black circles. The BERTopic package enables you to recluster projects based on the level of detail you require to answer your question. Of course, the further right on the graph, the more projects will be aggregated and the less clustering will make sense.</div>", 
    "<div style='text-align: justify;'>Here you can find the most frequents word for each created topic.</div>",
    "<div style='text-align: justify;'>here you can vizualise on a 2 dimension plan how each project has been assigned to a cluster, by hovering on each point representing a project, you will see its description.</div>"
  )
)


ui <- shinyUI(navbarPage(
  theme = shinytheme("united"),  # Applying the "united" theme
  title = "Machine learning classification of aid activities",
  
  tabPanel(
    "Motivations",
    fluidPage(
      fluidRow(
        column(12, HTML("<h3>Machine learning clustering of aid related activities</h3><p style='text-align: justify;'> Work by Pierre Beaucoral, PhD student at <a href='https://cerdi.uca.fr/' target='_blank'>CERDI CNRS UCA IRD</a>, <a href='https://pierrebeaucoral.github.io/' target='_blank'>Personal Website</a>.</p>")),
        column(12, HTML("<h3>Motivations</h3><p style='text-align: justify;'>Categorising development projects is crucial for understanding donors’ aid strategies, recipients’ priorities, and on-the-ground actions. While the OECD CRS provides a rich source of information on development strategies, it falls short in informing project categories due to its reporting process based on self-declared main objectives. This research employs an innovative approach that combines Machine Learning (ML) techniques, specifically Natural Language Processing (NLP), to categorise development projects based on their narrative descriptions. The study utilises the Organisation for Economic Co-operation and Development’s (OECD) Creditor Reporting System (CRS) dataset, which provides a rich source of project narratives from diverse sectors (approx. 5.5 million projects). In this page you will be able to see the main interactive outcomes of this new classification.</p>")),
        column(12, HTML("<h4>What would you be able to find here?</h4><p style='text-align: justify;'> This work is based on an article (currently under redaction, first version avalaible upon request) that aims to demonstrate the potential of machine learning for text classification. The goal is to achieve the most accurate development project classification based on their descriptions. The study aims to enable policymakers, researchers, and individuals from civil society to gain a better understanding of declared development projects by bilateral, multilateral, and private institutions. This will allow them to replicate the methodology for studying specific development finance topics. You will find here several vizualisations in order to get a better understanding of the work itself and its potentials.</p>")),
        column(12, HTML("<h4>Where do these data come from?</h4><p style='text-align: justify;'> In this study, we include all declarations made at the OECD, including bilateral (e.g. governments) and multilateral (such as the Green Climate Fund or the United Nations) development finance but also private institutions (as the Bill and Melinda Gates Foundation). This completeness allows for comparison of multiple types of donors on similar subjects. The declarations on the OECD CRS system may have different start times regarding the type of donors.</p>")),
        column(12, HTML("<h4>How may I replicate this work for my own purposes?</h4><p style='text-align: justify;'> All scripts and codes are available in this GitHub repository, from the extraction of the CRS raw dataset to the clustering process. Additionally, you can find more information about the special settings we used in the setup explanation menu of this website.<p>"))
      )
    )
  ),
  
  
  tabPanel(
    "Setup Explanation",
    fluidPage(
      fluidRow(
        column(12, HTML("<h3>Setup Explanation</h3><p style='text-align: justify;'>This unsupervised machine learning clustering has been created using BERTopic (<a href='https://maartengr.github.io/BERTopic/index.html' target='_blank'>BERTopic</a>), and has been inspired by the works of Toetzke et al. (2022): <a href='https://github.com/MalteToetzke/Monitoring-Global-Development-Aid-With-Machine-Learning' target='_blank'>GitHub</a>. Code is available at the following link.</p>"))
      ),
      
      fluidRow(
        column(12, HTML("<h3>Dataset used</h3><p style='text-align: justify;'>We used the OECD CRS Dataset, one of the most complete and comprehensive dataset regarding development financial flows. Thanks to this dataset, we have been able to categorize registered development projects from 1973 to 2022 accounting for bilateral, multilateral and private flows.</p>"))
      ),
      
      fluidRow(
        column(12, HTML("<h3>Parameters settings</h3><p style='text-align: justify;'>In this machine learning setting, fine-tuning requires several parameters at different steps, particularly for word embeddings and cluster construction methodology.</p>"))
      ),
      
      fluidRow(
        column(12, HTML("<h4>Data preparation</h4><p style='text-align: justify;'> One advantage of transformer models is that they feed themselves from context and do not require any form of text preprocessing. To increase computation speed, we assigned the same label to each project with the same description, inspired by the work of <a href='https://doi.org/10.1038/s41893-022-00874-z' target='_blank'>Toetzke et al. (2022)</a>. This allowed us to cluster projects with the same description together.</p>"))
      ),    
      
      fluidRow(
        column(12, HTML("<h4>Word embeddings</h4><p style='text-align: justify;'>We use a sentence transformers model (<a href='https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2' target='_blank'>paraphrase-multilingual-MiniLM-L12-v2</a>) for word embeddings because it supports multilingual settings, which is necessary for our setup. Although we considered more recent AI models such as Mistral or Llama, we found that our sentence transformers model was better suited for fine-tuning. If you want to replicate this work with other embeddings, BERTopic can help you. Please refer to the BERTopic documentation (link provided above) for more information.</p>"))
      ),
      
      fluidRow(
        column(12, HTML("<h4>Clustering</h4><p style='text-align: justify;'>HDBSCAN is used for clustering because of its strong performance on large datasets with high-dimensional embeddings. Another advantage of HDBSCAN over other clustering processes, such as K-Means, is that it supports non-convex vectorization of texts and finds the optimal number of clusters without any parameters, such as silhouette score, for example. The minimum cluster size is set at 1000, meaning that each cluster contains at least 1000 unique project descriptions to ensure a sufficient yet consistent number of projects in each cluster. Dimensions of the embeddings are reduced to 15 using UMAP to avoid the <a href='https://en.wikipedia.org/wiki/Curse_of_dimensionality' target='_blank'>curse of dimensionality</a>.</p>"))
      )
    )
  ),
  
  
  tabPanel(
    "Visualizations",
    sidebarLayout(
      sidebarPanel(
        selectInput("file_selector", "Select a topic visualization", choices = file_info$file_name)
      ),
      
      mainPanel(
        fluidRow(
          column(12, htmlOutput("explanation")),
          column(12, htmlOutput("showfile"))
          
        )
      )
    )
  )
))


server <- function(input, output, session) {
  
  output$subtitle <- renderUI({
    subtitle_text <- "Work by Pierre Beaucoral, PhD student, CERDI CNRS UCA IRD, <a href='https://pierrebeaucoral.github.io/' target='_blank'>Personal Website</a>"
    HTML(paste0("<p>", subtitle_text, "</p>"))
  })
  
  output$introduction <- renderUI({
    intro_text <- "Categorising development projects is crucial for understanding donors’ aid strategies, recipients’ priorities, and on-the-ground actions. While the OECD CRS provides a rich source of information on development strategies, it falls short in informing project categories due to its reporting process based on self-declared main objectives. This research employs an innovative approach that combines Machine Learning (ML) techniques, specifically Natural Language Processing (NLP), to categorise development projects based on their narrative descriptions. The study utilises the Organisation for Economic Co-operation and Development’s (OECD) Creditor Reporting System (CRS) dataset, which provides a rich source of project narratives from diverse sectors (approx. 5.5 million projects). In this page you will be able to see the main interactive outcomes of this new classification."
    HTML(paste0("<p>", intro_text, "</p>"))
  })
  
  output$setup_explanation <- renderUI({
    setup_text <- "This unsupervised machine learning clustering has been created using BERTopic (<a href='https://maartengr.github.io/BERTopic/index.html' target='_blank'>BERTopic</a>), and has been inspired by the works of Toetzke et al. (2022): <a href='https://github.com/MalteToetzke/Monitoring-Global-Development-Aid-With-Machine-Learning' target='_blank'>GitHub</a>. Code is available at the following link."
    
    HTML(paste0("<p>", setup_text, "</p>"))
  })
  
  output$showfile <- renderUI({
    selected_file <- file_info[file_info$file_name == input$file_selector, ]
    tags$iframe(src = paste0("outputbig/", selected_file$file_path), width = "100%", height = "700px")
  })
  
  output$explanation <- renderUI({
    selected_explanation <- file_info[file_info$file_name == input$file_selector, ]$explanation
    HTML(paste0("<p>", selected_explanation, "</p>"))
  })

# Set the resource path
shiny::addResourcePath("outputbig", "~/Documents/Pro/Thèse CERDI/Recherche/ML clustering aid activities/outputbig")

}



shinyApp(ui = ui, server = server)
