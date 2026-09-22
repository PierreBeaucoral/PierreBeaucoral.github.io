# Delivery review — 21 September 2026 (updated after the extension and carousel rewrite)

Score: **93/100 — ready for author review**, not an empirically validated recommendation.

## Review provenance
Luna agents drafted the model, article and initial slides. The independent theorist-critic and final storyteller work hit the model usage limit. The primary agent completed a mathematical/code review, rewrote the deck, corrected the article and inspected all rendered slides. This is a self-review, not a completed independent referee report.

## Findings addressed
- R's `with(parameters, ...)` masked the varying urgency argument with its baseline value. Replaced with explicit parameter access. An independently written Python grid search caught the error; the corrected calculations agree.
- The initial article conflated productivity with sunk research capital and implied that depreciation affected marginal learning. Both statements were removed/corrected.
- The first slide draft had unsupported schematic curves, missing fonts and unsafe TikZ labels. Rebuilt using the canonical formula, computed figures, installed Latin Modern fonts and sparse diagrams.
- Enlarged the figure text for projection. Web and deck figures use the same data with different aspect ratios and typography.
- Handled Rscript's macOS encoding of spaces in absolute script paths. The all-in-one builder now succeeds from the repository root.

## Mathematical and numerical checks
- Differentiation and concavity verified: U' = -wK + beta H eta/(tau+e); U'' = -beta H eta/(tau+e)^2.
- Unique constrained optimum follows from concavity (or strict decrease when beta H eta = 0). Zero budget is handled separately.
- Both corner inequalities and the interior formula are consistent at thresholds.
- R closed form and numerical optimisation agree within 1e-5 hours; independent Python dense-grid check reproduces 10, 3.5 and 0 hours for w = 0.3, 1 and 5, and objective values within 1e-8 relative tolerance.
- Zero learning, zero future hours, zero discount weight and zero budget checks pass.
- Depreciation is additive and cannot alter e*. No claim that the model measures creativity, project completions or optimal weekly cycles remains.

## Second pass: extension, equations, carousel
- Added the partial-recognition extension (`extension.R`, `model.md`, article section). Its closed form is the same clipped optimum with coefficient `rho * A`; monotonicity and the corner-coincidence case are stated rather than assumed away.
- `check_model.py` now reproduces both the baseline (10, 3.5, 0 hours) and the extension (3.5 and 5.75 hours, with matching quantity/quality outcomes).
- Article equations are rendered to MathML by `render_equations.py` and inserted through the `model-equation` / `model-inline` shortcodes, so the prose and `model.md` cannot drift apart.
- The deck was rewritten as a 9-slide visual carousel (per the requested LinkedIn use): pure TikZ, no embedded plots, numbers pulled from `model-values.tex`.
- Third pass: the rounded-card layout was replaced with FAERE-style line art — a figure, paper stacks, an open book, a clock, a balance and a detour arc, all drawn from shared primitives (`\sheet`, `\stack`, `\bookicon`, `\clockicon`, `\pierre`, `\bubble`). Dark frames swap `ink`/`canvas` so the same primitives invert. The deck now opens on the question "What shall I do with my time?" and walks the model as pictures.
- theorist-critic issue 3.1 resolved: no "capital"/"stock" wording remains in the article, deck or memo; K is a productivity level throughout.
- Removed the now-dead deck-figure PDF branch in `simulate.R` / `extension.R` and the `figures/` directory; the carousel embeds no plots.

## Build and visual checks
- Complete build.py succeeds: reproducible figures, generated MathML, generated TeX constants, 9-page PDF, downloadable source archive.
- Two XeLaTeX passes: no overflow, underflow, missing-glyph or font-substitution warnings in the final build.
- All 9 rendered pages visually inspected after the rewrite. No text or arrow collisions; every element sits inside the page margins.
- TikZ uses straight edges, explicit widths, 0.5 cm node padding and 0.15 cm arrow shortening. No bends/scaling hazards; edge label in the two-period diagram moved above both boxes. Text and arrows no longer share a corridor. Page text margins are 1.2 cm; footer baseline has 0.55 cm bottom padding.
- Hugo draft build succeeds. All three SVGs and the rendered equations appear in the article. Existing Hugo warnings concern a module sitemap hook and deprecated Site.AllPages, not the new content.
- The existing global site navigation is crowded at narrow desktop widths; this task does not change that shared layout.
- Article remains draft:true; no commit, push or deployment performed. Static PDF/ZIP will be copied by a future normal Hugo build even while the article remains a draft.

## Remaining limits
The model has deterministic transferable learning, fixed future research hours and linear current progress. It omits enjoyment, uncertainty, learning from routine work and project completion constraints. The author should review the first-person wording before publication. These substantive simplifications and the unavailable independent final review account for the score below 95.
