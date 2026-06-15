# Pierre Beaucoral — Hugo theme layouts

This package turns the redesign into **Hugo layouts that render from your existing
content**. It overrides the Hugo Blox module with project-level templates, so your
`content/` folders stay as-is — you only add a couple of optional flags to the papers
you want categorised or pinned to the homepage.

> ⚠️ These templates were written without a local Hugo run. Before pushing, test with
> `hugo server -D` and fix any path/field mismatches (I'm happy to iterate, or hand this
> to Claude Code to run the build loop).

---

## 1. Install

Copy these into the root of your repo (`PierreBeaucoral.github.io/`), merging with what's there:

```
hugo/layouts/      →  layouts/
hugo/static/       →  static/        (adds static/css/site.css)
hugo/content/apps/ →  content/apps/  (new section for the Apps page)
```

Project-level `layouts/` always win over the Hugo Blox module, so this takes over
rendering. You do **not** need to remove the Blox modules — but if you hit a conflict,
you can comment them out in `config/_default/module.yaml`.

### One required content tweak
In `content/_index.md`, remove the line `type: landing` (or set `type: ""`) so Hugo uses
the new `layouts/index.html` for the homepage. Everything else in `_index.md` is ignored
by the new homepage (it reads your author profile + content sections directly), so you can
leave it or trim it later.

---

## 2. How sections map

| Nav item      | Hugo section            | Template                       |
|---------------|-------------------------|--------------------------------|
| Research      | homepage `#research`    | `layouts/index.html`           |
| Publications  | `content/publication/`  | `layouts/publication/list.html`|
| Talks         | `content/event/`        | `layouts/event/list.html`      |
| Teaching      | `content/course/`       | `layouts/course/list.html`     |
| Apps          | `content/apps/`         | `layouts/apps/list.html`       |
| Writing       | `content/post/`         | `layouts/post/{list,single}.html` |
| (paper/talk)  | any single page         | `layouts/_default/single.html` |

The homepage pulls: avatar + bio + education from `content/authors/admin/`, featured
papers (see below), the 3 most recent posts, and a hard-coded hero/contact block you can
edit in `layouts/index.html`.

---

## 3. The status system (your request)

The **Publications** page builds its groups automatically from one front-matter field.
Add these to any `content/publication/*/index.md` (or to a `content/project/*/index.md`
you want to surface as a paper):

```yaml
status: jmp          # job market paper   → "Job market paper" group + clay JMP badge
# status: rr         # revise & resubmit  → "Revise & resubmit" group
# rr_journal: "Journal of Development Economics"   # shown next to the R&R badge
# status: published  # peer-reviewed      → "Published" group
# status: wp         # working paper      → "Working papers" group
featured_home: true  # pin this one to the homepage "Selected work"
# exclude: true       # hide from the Publications page (e.g. a duplicate preprint)
```

**Auto-categorisation when `status` is omitted:**
- a `publication/` page **with a `doi`** → *Published*
- anything else → *Working paper*

**Two rules worth knowing:**
1. `publication/` pages always appear. A `project/` page appears on the Publications page
   **only if it has a `status`** — that keeps tools (EasyViz) and duplicates (crs-ml) out.
2. The homepage "Selected work" shows papers with `featured_home: true`; if none are
   flagged it falls back to the 5 most recent.

### Suggested flags for your current content
| File | Add |
|------|-----|
| `content/publication/cracking-the-code/` | `featured_home: true` (status auto = published) |
| `content/publication/economia-conference/` | `exclude: true` (it's the preprint of the above) |
| `content/project/nap/` | `status: wp` + `featured_home: true`  *(set `status: jmp` once it's your JMP — left blank for now per your note)* |
| `content/project/emissions/` | `status: wp` + `featured_home: true` |
| `content/project/climate-finance-estimation/` | `status: wp` + `featured_home: true` |

When a paper gets an R&R: `status: rr` + `rr_journal: "…"`. When it's published: `status: published`. It refiles itself on the next build.

---

## 4. Talks / Teaching / Writing — no changes needed

These read fields you already have:
- **Talks** (`event/`): `event`, `summary`, `location`, `date`, `url_slides`, `url_video`, `url_code`, `event_url`.
- **Teaching** (`course/`): `title`, `summary`, `date`.
- **Writing** (`post/`): `title`, `summary`, `date`, and a `featured.*` image in the bundle.

Add a folder, fill the front matter you already use, and it appears — styled — on rebuild.

---

## 5. Apps page

The two apps (EasyViz + France · Données ouvertes) are hard-coded in
`layouts/apps/list.html` (live `<iframe>` previews + launch buttons). Edit that file when
you ship a new tool. `content/apps/_index.md` just makes the `/apps/` section exist.

---

## 6. Colours & type (if you want to tweak)

All in `static/css/site.css` under `:root`:
`--paper #EEF0EA · --ink #1E231D · --forest #18241D · --forest2 #2E6048 · --clay #9C5234 · --ocean #2C5C70`.
Fonts: Newsreader (headings), IBM Plex Sans (body), IBM Plex Mono (labels) via Google Fonts.
