# When do I make time to learn?

English blog draft and a 9-slide Beamer carousel explaining an original illustrative two-period model. Parameters are invented; there is no empirical calibration or recommended time quota. The model quantifies weighted research progress, not creativity or completed papers.

## Files and single sources of truth

- `model.md`: canonical assumptions, notation, solution, proof, and the partial-recognition extension.
- `parameters.json`: the numeric settings for all generated figures and TeX constants.
- `simulate.R`: article SVGs, numerical optimisation checks, `checks.csv`, and generated `model-values.tex`. Sources `extension.R` at the end.
- `extension.R`: the quantity/quality extension — `what-if.svg`, `extension-checks.csv`, and the extension constants appended to `model-values.tex`.
- `check_model.py`: independent standard-library Python grid check of both the baseline and the extension.
- `render_equations.py`: renders the equations of `model.md` to MathML under `content/post/time-to-learn/equations/`, consumed by the `model-equation` and `model-inline` shortcodes in `layouts/shortcodes/`.
- `learning-detours.tex`: the 9-slide carousel. Pure TikZ, no embedded plots; numbers come from `model-values.tex`.
- `../../content/post/time-to-learn/index.md`: personal blog, `draft: true`.
- `../../static/uploads/learning-detours/`: compiled deck and source ZIP.

## Rebuild

Requirements: R with ggplot2, jsonlite and svglite; Python 3 standard library; XeLaTeX with Beamer, TikZ, fontspec and Latin Modern fonts.

From this directory, run:

```sh
python3 build.py
```

Or run the steps individually:

```sh
Rscript simulate.R
python3 check_model.py
python3 render_equations.py
xelatex learning-detours.tex
xelatex learning-detours.tex
```

The all-in-one builder keeps TeX intermediates in a temporary directory, fails on numerical disagreement or LaTeX overflow/font warnings, and writes the PDF and source ZIP under `static/uploads/learning-detours/`. The archive preserves repository-relative paths so the same command works after extraction. Generated constants, equations and plots may be overwritten by a rebuild; edit `parameters.json` instead. If parameters change, also review the article's illustrative numbers and the model memo examples.

From the website root, preview the draft using `hugo server --buildDrafts`, then open `/post/time-to-learn/`. A regular Hugo build excludes the article because it is a draft. Files under `static/` are public build assets regardless of draft status; nothing has been deployed by this task.

## Scope of the answer

The optimum is conditional on productivity, future research hours, learning transfer, and weights. Both zero exploration and full allocation are allowed. The model does not compare weekly quotas against alternating project phases. Retained baseline productivity is additive, so its depreciation parameter does not change the optimum. The extension asks what happens if only a share of the assumed future benefit is recognised; it assumes the fuller valuation is the correct one, which is an open question rather than a finding. Learning from ordinary research/teaching, uncertainty, enjoyment, and project-completion thresholds are omitted.
