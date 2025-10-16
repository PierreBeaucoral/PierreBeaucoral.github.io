---
title: Are there any AlTEXnatives?
date: '2025-10-16'
summary: Modern Alternatives for LaTeX Writing and Collaboration
---

<div style="text-align: justify;">

# ✍️ Beyond Overleaf: Modern Alternatives for LaTeX Writing and Collaboration (2025 Update)

*By Pierre Beaucoral • October 2025*

For many academics, **Overleaf** has long been the default platform for writing papers, reports, theses, and lecture notes in LaTeX. Its collaborative editing and cloud compilation were game-changers for research teams and classrooms.

But in late 2025, Overleaf introduced a significant limitation for free-tier users:  
> ⏱ **A maximum compilation time of ~10 seconds per build.**

For lightweight documents, this may be acceptable. But for most real academic workflows, theses, TikZ-heavy figures, large bibliographies, or multi-chapter manuscripts, 10 seconds is not enough. This has spurred a renewed interest in **open-source, local, and alternative cloud-based solutions** for LaTeX and scientific writing.

This post reviews and categorizes some of the best alternatives in 2025, grouped by **workflow type**:

- 🧰 **Local solutions** for full control  
- 🔁 **Local + repository (hybrid)** for collaboration and reproducibility  
- 🌐 **Online solutions** for real-time collaboration (Overleaf-style)  

---

## 🧰 Local solutions — *Full control, no limits*

For researchers who prefer to work locally for **speed**, **privacy**, and **reproducibility**, these tools give you complete control over your typesetting environment.

### 🖥️ VS Code + LaTeX Workshop
- **What it is:** [Visual Studio Code](https://code.visualstudio.com/) + [LaTeX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)
- **Why it’s good:**
  - Full local compilation — no time limits.
  - Continuous preview, spellcheck, snippets, and custom build recipes.
  - Excellent integration with Git and BibTeX.
- **Ideal for:** solo researchers, or as a base for hybrid workflows with Git.

![preview](https://github.com/user-attachments/assets/3f3cfbd0-f02d-4953-a32a-755fc88dea48)

---

### ✍️ LyX
- [LyX](https://www.lyx.org/) provides a structured, semi-WYSIWYG interface built on top of LaTeX.  
- Great for theses or structured documents where you want to focus on content rather than code.  
- Works offline and can sync via shared drives or Git for collaboration.

---

### 📄 R Markdown (.Rmd) and Quarto (.qmd)
- **R Markdown** and **[Quarto](https://quarto.org)** let you write academic manuscripts, reports, and books using Markdown syntax with embedded code (R, Python, Julia, etc.) and LaTeX under the hood.
- Output formats include PDF (via LaTeX), HTML, Word, and reveal.js slides.
- Quarto in particular is becoming a powerful alternative for scientific writing, enabling:
  - Full reproducibility (code + text).
  - Local compilation with no time limits.
  - Version control through Git.

**Minimal Quarto example:**
```markdown
---
title: "My Paper"
author: "Pierre Beaucoral"
format: pdf
---

# Introduction

This is written in Markdown but compiled through LaTeX.
```

✅ *Ideal for academics who already use R or Python and want reproducible documents.*

---

### ✨ Typst — A modern, fast alternative to LaTeX
- [Typst](https://typst.app/) is a new, markup-based typesetting system designed to be as expressive as LaTeX with a cleaner, more consistent syntax.
- Compiles almost instantly, with a clean language that blends Markdown-like text and layout logic.
- Excellent documentation for **[LaTeX users migrating to Typst](https://typst.app/docs/guides/guide-for-latex-users/)**.
- Works **entirely locally** through the CLI, making it a strong candidate for researchers seeking better performance without abandoning the idea of typesetting.

**Tiny Typst snippet:**
```typst
#let title = "My First Paper"
= title

Hello *world*! Here's a math equation: $E = mc^2$.
```

⚡ **Key advantage:** Typst documents typically compile in milliseconds, even for large projects.

---

## 🔁 Local + repository (hybrid) — *Collaborative and reproducible*

These workflows keep writing **local**, but use **version control (GitHub/GitLab)** for collaboration, history, CI builds, and archived artifacts.

### 🧪 GitHub or GitLab + LaTeX pipelines
- Store `.tex` files in a repository.
- Set up **Continuous Integration (CI)** to compile on each push or pull request.
- Collaborators write locally but review changes and PDFs through the repo interface.

**Example GitHub Action for LaTeX:**
```yaml
name: Build LaTeX
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install TeX Live
        run: sudo apt-get update && sudo apt-get install -y texlive-full
      - name: Compile
        run: latexmk -pdf -interaction=nonstopmode main.tex
```

✅ Benefits:
- Potentially longer build times than browser editors (subject to CI provider limits).
- Full history and collaborative editing via pull requests.
- Ideal for papers with multiple co-authors comfortable with Git.

---

### 🌿 Quarto projects + Git repos
For teams using Quarto (`.qmd`), putting your project in a GitHub or GitLab repo allows:
- Each author to compile locally.
- CI pipelines to generate the final PDF/HTML output.
- Easy versioning, code review, and reproducibility.

---

### ⚡ Typst + Git + CI
- Typst can be built locally and compiled in CI pipelines with a few lines of YAML.
- Extremely fast builds make this ideal for collaborative projects where you want the performance of Typst with Git-based workflows.

**Example GitHub Action:**
```yaml
name: Build Typst
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: typst-community/setup-typst@v4
      - name: Compile
        run: typst compile main.typ main.pdf
```

---

## 🌐 Online platforms — *Cloud collaboration à la Overleaf*

If your collaborators prefer a **browser-based, real-time editor**, these platforms mimic (or surpass) Overleaf’s interface without the same free-tier compilation limitation.

### 🌱 Papeeria
- [Papeeria](https://papeeria.com/) is a lightweight Overleaf alternative with:
  - Real-time online editing.
  - Reasonable compilation times.
  - Git integration for backups.
- Ideal for small to medium projects or quick collaborations.

---

### 📝 Authorea
- [Authorea](https://www.authorea.com/) blends LaTeX, Markdown, and a web-based interface designed for scholarly writing.
- Supports citations, commenting, version history, and publishing workflows.
- Less LaTeX-intensive than Overleaf but works well for interdisciplinary teams.

---

### 🦊 Crixet — A promising newcomer
- **[Crixet](https://crixet.com/)** is a browser-based collaborative LaTeX platform that has emerged as a promising Overleaf alternative.
- Key features:
  - Real-time collaboration.
  - Built-in versioning and Git sync.
  - Reports from early adopters of **longer compilation windows** for free users than strict 10-second caps.
  - Fast, responsive interface.

💡 *Crixet is still growing, but it already performs well for medium to large projects.*

---

### 🌐 Typst Web App
- The **[Typst Web App](https://typst.app/)** lets you edit and collaborate on `.typ` documents directly in your browser, Overleaf-style.
- Real-time preview and multi-user editing make it a **viable online alternative** for teams that want Typst performance with a cloud workflow.

---

### 🛠 Self-hosted Overleaf (Community Edition)
- **[Overleaf Community Edition](https://github.com/overleaf/overleaf)** lets institutions or research groups run their **own Overleaf server**.
- All the familiar Overleaf UI, but:
  - No artificial compilation time limits.
  - Full control over storage, privacy, and performance.
- Requires some technical setup (Docker), but many universities already offer this to their students.

---

## 🧰 Other Tools & Honorable Mentions

### 🧰 **Zettlr** ([zettlr.com](https://www.zettlr.com/))
- A Markdown-based editor popular among academics for note-taking and writing.
- Integrates with Pandoc, Zotero, and LaTeX.
- Not a collaborative editor, but good for individuals who want a minimal writing environment with citation support.

Zettlr is especially powerful when combined with Pandoc or Quarto pipelines, making it a flexible alternative for those who prefer **lightweight Markdown workflows** over full LaTeX environments.

---

## 🧭 Final thoughts

Overleaf transformed academic writing, but stricter compilation limits make it less viable for complex projects on free plans. Luckily, the ecosystem of LaTeX and scientific writing tools has **matured dramatically**:

| Workflow Type | Tools | Best For |
|--------------|-------|----------|
| **Local** | VS Code + LaTeX, LyX, Typst CLI, RMarkdown/Quarto | Solo researchers, offline work, speed |
| **Hybrid** | GitHub/GitLab CI, Quarto projects, Typst + Git | Teams using Git, reproducible research |
| **Online** | Papeeria, Authorea, Crixet, Typst Web App, Self-hosted Overleaf | Real-time collab, non-technical coauthors |

👉 **Recommendation:**  
- **For individuals:** use VS Code or Typst locally.  
- **For collaborative research teams:** combine local editing with Git-based CI for reproducibility.  
- **For quick collaborative drafts:** try Crixet or Papeeria as Overleaf replacements.  
- **For departments/labs:** consider self-hosted Overleaf CE.

---

### 📚 References & links
- Typst: [Guide for LaTeX Users](https://typst.app/docs/guides/guide-for-latex-users/) • [Web App](https://typst.app/)  
- Crixet: <https://crixet.com/>  
- Papeeria: <https://papeeria.com/>  
- Authorea: <https://www.authorea.com/>  
- Quarto: <https://quarto.org>  
- Overleaf Community Edition: <https://github.com/overleaf/overleaf>  
- GitHub LaTeX Action: <https://github.com/xu-cheng/latex-action>

