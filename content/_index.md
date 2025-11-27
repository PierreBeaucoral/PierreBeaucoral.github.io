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

        I am a PhD candidate in Development Economics at CERDI (Université Clermont Auvergne, CNRS, IRD). My research studies how climate and adaptation finance are allocated and what they do on the ground, using geocoded development-finance data, causal-inference methods, and machine learning.
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
              * Conducting empirical research on climate and adaptation finance using large-scale geocoded datasets
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

  - block: markdown
    id: teaching
    content:
      title: Teachings 
      subtitle: Teaching experiences
      text: |-
        **Teaching assistant – Introduction to economics**  
        Undergraduate course (L1, Université Clermont Auvergne, Autumn 2023). Led tutorial sessions covering basic micro and macro concepts, exercises, and exam preparation.

        **Lecturer – R programming for beginners**  
        18-hour course introducing R for data analysis in the [Economic Policy Management (GPE) training programme](https://ferdi.fr/en/training-ihedd/gpe-program), master/exec level, Autumn 2024. Focus on importing and cleaning data, basic statistics, and data visualisation for economic policy applications.
    design:
      view: compact
      columns: '2'

  - block: portfolio
    id: projects
    content:
      title: Projects
      filters:
        folders:
          - project
      default_button_index: 0
      buttons:
        - name: All
          tag: '*'
        - name: Ongoing works
          tag: Ongoing work
        - name: Machine learning
          tag: Machine learning
        - name: Climate finance
          tag: Climate finance 
        - name: Development finance
          tag: Development finance 
        - name: Other
          tag: Demo
    design:
      columns: '2'
      view: card
      flip_alt_rows: true 

  - block: collection
    id: featured
    content:
      title: Featured Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      columns: '2'
      view: card

  - block: collection
    content:
      title: Recent Publications
      text: |-
        {{% callout note %}}
        Quickly discover relevant content by [filtering publications](./publication/).
        {{% /callout %}}
      filters:
        folders:
          - publication
        exclude_featured: true
    design:
      columns: '2'
      view: citation

  - block: collection
    id: course
    content:
      title: Course
      filters:
        folders:
          - course
    design:
      columns: '2'
      view: compact

  - block: collection
    id: talks
    content:
      title: Recent & Upcoming Talks
      filters:
        folders:
          - event
    design:
      columns: '2'
      view: compact
    
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
