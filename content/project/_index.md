---
title: Research projects
type: landing
cms_exclude: true

sections:
  - block: markdown
    content:
      title: Research projects
      subtitle: ''
      text: |-
        My research evaluates **how climate and development finance are allocated
        and what they do on the ground**, combining geocoded project-level data,
        NLP-based reclassification of donor narratives, and modern causal-inference
        designs (DiD, event studies, double machine learning).

        Each card below summarises an ongoing or completed project, with links
        to preprints, replication code, and companion sites where available.
    design:
      columns: '1'
      spacing:
        padding: ['3rem', 0, 0, 0]

  - block: portfolio
    content:
      filters:
        folders:
          - project
      sort_by: Date
      sort_ascending: false
    design:
      view: masonry
      columns: 2
---
