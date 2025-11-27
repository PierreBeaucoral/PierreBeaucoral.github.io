---
# Leave the homepage title empty to use the site title
title: ''
date: 2022-10-24
type: landing

sections:
  - block: hero
    demo: false
    content:
      title: Pierre Beaucoral
      text: |-
        Climate & development economist · Determinants and Causal effects of climate finance.

         I am a PhD candidate in Development Economics at CERDI (Université Clermont Auvergne, CNRS, IRD). My research studies how climate finance are allocated and what they do on the ground, using several geocoded and development-finance data, classic statistics, causal-inference methods, and machine learning.
      image:
        filename: hero-academic.png
      cta:
        label: '**Download CV**'
        url: uploads/resume.pdf
      cta_alt:
        label: Research projects
        url: '#projects'
      cta_note:
        label: ''
    design:
      background:
        gradient_end: '#1976d2'
        gradient_start: '#004ba0'
        text_color_light: true

  - block: about.biography
    id: about
    content:
      title: Biography
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
    design:
      css_class: dark
      background:
        color: black
        image:
          # Add your image background to `assets/media/`.
          filename: pexels-enginakyurt-1435752.jpg
          filters:
            brightness: 1.0
          size: cover
          position: center
          parallax: false

  - block: experience
    content:
      title: Experience
      # Date format for experience
      #   Refer to https://wowchemy.com/docs/customization/#date-format
      date_format: jan 2006
      items:
        - title: PhD student
          company: CERDI CNRS UCA IRD
          company_url: 'https://cerdi.uca.fr/#/'
          company_logo: CERDI
          location: Clermont-Ferrand
          date_start: '2023-10-01'
          date_end: ''
          description: |2-
              Responsibilities include:
              * Conducting empirical research on climate finance
              * Developing causal-inference strategies (DiD, event studies, double machine learning) to evaluate the effects of climate policies such as National Adaptation Plans
              * Building and maintaining reproducible data and code pipelines in R and Python
              * Contributing to teaching in econometrics and quantitative methods
        - title: Research assistant
          company: Ferdi
          company_url: 'https://ferdi.fr/'
          company_logo: Ferdi
          location: Clermont-Ferrand, France
          date_start: '2022-10-01'
          date_end: '2023-09-30'
          description: Development economics, international development finance.
    design:
      columns: '2'
    
  - block: collection
    id: news
    content:
      title: Recent News
      subtitle: ''
      text: ''
      page_type: post
      count: 5
      filters:
        author: ""
        category: ""
        tag: ""
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ""
      offset: 0
      order: desc
    design:
      view: date-title-summary
      spacing:
        padding: [0, 0, 0, 0]

  - block: tag_cloud
    content:
      title: Popular Topics
    design:
      columns: '2'

  - block: contact
    id: contact
    content:
      title: Contact
      subtitle:
      text: |-
        I am happy to discuss research, teaching, and potential collaborations. The best way to reach me is by email.
      email: pierre.beaucoral@uca.fr
      address:
        street: 26 Léon Blum Avenue
        city: Clermont-Ferrand
        region: Auvergne Rhône-Alpes
        postcode: '63000'
        country: France
        country_code: FR
      directions: Floor 4
      contact_links:
        - icon: twitter
          icon_pack: fab
          name: DM Me
          link: 'https://twitter.com/PBeaucoral'
      autolink: true
    design:
      columns: '2'
---
