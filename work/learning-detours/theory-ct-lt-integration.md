# Integration memo: swapping in the expected-utility model

This is a recommendation, not an edit. Nothing in `model.md`, `index.md`,
the deck, or the build scripts has been touched. It covers what changed
in `theory-ct-lt.md` since the first pass, what a swap-in would mean for
the blog post, which figures the new model needs, and what the parameter
file would have to carry if this becomes the build.

## 0. What `theory-ct-lt.md` now is

Two rounds of scope correction moved this from "an extension beside
`model.md`" to "a full replacement memo, written in `model.md`'s order,
with `model.md` recovered as Corollary 2 under three simultaneous
restrictions: risk neutrality (\(u\) linear), a degenerate payoff
(\(Z\equiv1\), transfer certain), and a linear cost of delay
(\(\theta=1\))." The decision problem is now expected utility over a
gamble from the first equation, not deterministic progress with a
recognition wedge bolted on afterward. The St Petersburg material sits
inside Section 4, doing one specific job: it shows why risk-neutral
(expected-value) evaluation of a detour's payoff is not a viable
objective once that payoff is allowed to be heavy-tailed, which is the
reason the model maximizes expected utility rather than expected value
from the outset, and it motivates the one maintained regularity
assumption (A6, bounded transfer scale) the rest of the results lean on.
`model.md`'s own \(\rho\) survives, exactly, as Corollary 1: the special
case of the new perceived-vs-true comparison in which the only thing in
question is the decision-maker's belief about a certain payoff, evaluated
without risk aversion.

A theorist-critic review of that draft (`theory-ct-lt-review.md`) found
the architecture and both recovery corollaries sound, and flagged seven
rigor and disclosure gaps: a numeric error in the Section 6.3 table (one
cell's sign was wrong; the qualitative "global maximizer sits far past a
misleading local minimum" conclusion was unaffected), a strict-versus-
weak concavity gap in the uniqueness proposition, an unaddressed
differentiability limit at the upper corner for a convex cost of delay,
a construction gap and a missing historiographic caveat in the Menger
material (Peters 2011 disputes Menger's original 1934 proof), a deferred
proof, and under-disclosure of these in the Limitations section. All
seven have been fixed directly in `theory-ct-lt.md`; none of them changes
any recommendation in this integration memo — the S-shaped material and
the Menger/Peters material were already recommended to stay out of the
post (Section 1 below), so the sections that needed the most rigor work
are exactly the sections this memo already keeps at arm's length from
`index.md`.

## 1. Blog post: what has to be rewritten versus amended

Going section by section through the current `index.md` (draft, English,
first person).

**"I like making educational content..." / opening paragraphs — amend, not
rewrite.** The motivating tension (teaching, existing research, the pull
of learning something new) does not change. One optional line could
introduce the "bet" framing early ("I also don't know in advance whether
a detour will turn out to matter"), but nothing here is technically load
bearing.

**"The time available" — amend only.** The budget constraint, \(B\),
\(e\), \(B-e\), \(K\), \(w\), \(H\), \(\beta\) are all unchanged objects
in the new memo (Section 1's notation table). No rewrite needed.

**"What I get from a detour" — rewrite.** This is where the model
actually changes. The current text presents \(\ell(e)=\eta\ln(1+e/\tau)\)
as a sure thing: exploration deterministically raises future
productivity, with diminishing returns. The new model treats the same
curve as the *size of the payoff if a detour transfers*, multiplied by a
random "did it transfer, and how much" factor. This section needs new
material, in plain language and with no new symbols beyond what the post
already uses informally: something did not transfer, or transferred only
partly, is now an explicit possibility, not an omission flagged in the
limits section. The existing sentence "That is an assumption I can
inspect and change" is exactly the right tone to extend into this
addition.

**"Where would I stop?" — rewrite.** The current derivation (marginal
future benefit falls, marginal cost is flat at \(wK\), set them equal,
clip to \([0,B]\)) is `model.md`'s Proposition 1, i.e. exactly Corollary
2's special case. If the post is going to reflect the new model rather
than only its nested special case, this section's prose needs to say,
without equations, that the comparison is now between the cost of the
next hour of current research and the *expected, risk-adjusted* benefit
of the next hour of exploration — the average payoff of the bet, marked
down because the payoff is uncertain and a cautious decision-maker treats
uncertain gains more skeptically than their raw average would suggest
(Proposition 2, Section 5.2 of the memo). The `arbitrage.svg` figure's
crossing-point story survives narratively; what changes is what the
"benefit" curve represents.

**"Why the answer changes from one situation to another" — amend, with
one flag.** The comparative statics currently shown are exactly the
deterministic, certain-transfer special case (Corollary 2), so the
existing numbers and figure remain literally correct as an illustration
of that special case. What needs adding is one sentence making clear
these are the "if the detour is sure to pay off, and I evaluate it at
face value" numbers, with the next section immediately qualifying that.

**"What if I am undervaluing the detours?" — rewrite.** This is the
section with the biggest conceptual shift. The current \(\rho\) story is
about recognizing only a *share* of a certain future benefit. The new
model's natural analogue is underestimating the *odds* that a detour pays
off at all, not underestimating its size once it does. Concretely: the
post can keep almost all of its existing prose (the quantity/quality
split, \(N\), \(Q\), \(\lambda\), the two-thirds recognition number) by
reframing what \(\rho\) (or its replacement) multiplies — from "a share
of the future value" to "a probability that the future value happens at
all" — because Corollary 1 shows these are the same object exactly when
the underlying transfer is otherwise certain and the decision-maker is
risk neutral, which is what the current post already, implicitly,
assumes. The rewrite is in the framing sentence, not in the numbers.

**"What I take from this" — amend, with an optional addition.** The
existing paragraph about transfer being deterministic in the model, while
in practice "a promising technique can turn out to be of little use," is
already gesturing at exactly what the new model formalizes; it can stay
almost as written. One optional addition, if Pierre wants the "some
detours are lottery tickets" flavor in the accessible post at all: a
single sentence noting that a few detours pay off far more than their
average would suggest, and that a cautious plan should not be talked into
a large one by an average that a rare, huge payoff is dragging up. If
that sentence names the idea at all, "this is a version of an old puzzle
sometimes called the St Petersburg paradox" (plain prose, no year, no
parenthetical) is enough — worth naming only so the post is not
describing a well-known problem as if it were new, not as a citation.
This is the only point in the post where that intuition would plausibly
belong, and it should stay at the level of that one sentence — the
divergence, certainty-equivalent, and bounded-utility material in
Section 4 of the memo is not recommended for the post at any level of
detail; it is a well-motivated diagnostic for why the memo needs a
finiteness assumption, not an intuition that helps a reader decide how to
spend an afternoon.

**A note on citation weight: memo versus post.** The memo is a technical
document and keeps its attributions (Bernoulli, Cramér, Menger, the
Peters 2011 caveat on Menger's original proof) because they are part of
the mathematical record and a literature check is verifying them
separately. None of that belongs in `index.md`. The post should carry no
bibliography, no reference list, and no author-year parentheticals
anywhere — it is a blog post, not a working paper. Where a name would
genuinely help a reader place an idea (the St Petersburg case above is
the only clear candidate), write it as an ordinary sentence naming the
puzzle, not the author or year, and do not lean on the name to carry an
argument: every claim the post makes should already stand on its own in
plain words, with the name added only as a courtesy to a reader who has
heard of it before. If any rewritten passage below reads as needing a
citation to be convincing, that is a sign that passage should be
simplified or grounded in the post's own numbers instead, not that a
citation should be added.

**Recommendation on the S-shaped, growing-returns material (memo Section
5.4, 6.3).** Keep this out of the post entirely. It requires the reader
to track a local minimum, a local maximum, and a corner comparison
simultaneously, which is a genuinely different kind of claim from
everything else in the post ("here is where the trade-off balances") and
would need its own explanatory scaffolding to avoid being misleading in
summary form. It is a strong candidate for the deck (one slide, visual,
no proof) or for a second, more technical post, not for this one.

## 2. Figures

The three existing figures (`arbitrage.svg`, `sensibilite.svg`,
`what-if.svg`) all plot the deterministic, certain-transfer marginal
condition or its comparative statics — exactly Corollary 2's special
case. None of them is wrong under the new model; all three are literally
illustrations of the nested special case. Depending on how much of the
new model the post ends up carrying:

- **If the post stays close to the current rewrite plan above** (Section
  1), `arbitrage.svg` and `sensibilite.svg` can be kept as is, with
  caption/label edits only (no data changes), since they illustrate
  exactly the risk-neutral, certain-transfer corner that Section 1's
  rewritten "Where would I stop?" text uses as the baseline before adding
  the risk-adjustment sentence.
- **One new figure is worth generating** if the post's rewritten
  "Where would I stop?" section wants a visual rather than only prose for
  the risk-adjustment idea: the expected/risk-adjusted marginal-benefit
  curve (\(\mathrm{MB}(e)=\beta H\psi'(e)\hat Z(e)\)) plotted against the
  same marginal-cost curve, at two or three levels of risk aversion,
  showing the crossing point move left as risk aversion increases. This
  is a direct visualization of Proposition 2 and would reuse the same
  axes and style as `arbitrage.svg`.
- **`what-if.svg`'s comparison (recognized-share vs. full-share choice)**
  can be relabeled, without new computation, as "believing a detour has a
  lower chance of paying off" vs. "believing its true chance," per
  Corollary 1's exact algebraic identity between \(\rho\) and the
  probability wedge.
- **Not recommended for the post:** a figure showing the local-minimum /
  local-maximum crossing structure of Section 6.3, or a figure comparing
  the perceived and true expected-utility curves of Proposition 5. Both
  are memo- or deck-only, per Section 1's recommendation above.

## 3. What the parameter file would have to carry

If this model becomes the build, `parameters.json` needs new fields
beyond the existing \(B,K,w,H,\beta,\eta,\tau,\delta,\rho,\eta_Q,\lambda\)
set. At minimum, to reproduce the worked examples in `theory-ct-lt.md`:

- `theta`: current-research curvature (\(\theta\in(0,1]\)); `1.0` recovers
  the existing linear cost of delay.
- A choice of transfer-profile family and its curvature parameter: either
  the existing log profile (no new parameter) or the S-shaped Hill
  profile with exponent `p` (only needed if the growing-returns material
  moves beyond the memo).
- The luck distribution: for the tractable two-state case used in the
  worked example, `pi` (true probability of transfer) and `pi_tilde`
  (perceived probability); more generally, if a richer distribution for
  \(Z\) is ever adopted, its support bound `z_bar` (A6's maintained
  finiteness assumption) and whatever parameters index its shape.
- The utility function and its curvature parameter: a tag for the
  functional form (e.g. quadratic, CRRA) and the associated curvature
  constant (`a` for the quadratic example used in the memo, or `sigma`
  for a CRRA form), plus a check, at build time, that `u` stays strictly
  increasing over the realized range of payoffs for the chosen parameter
  values (the memo's worked example verifies this by hand; a build script
  would need to verify it numerically before trusting any downstream
  root-finding).

None of `simulate.R`, `extension.R`, `check_model.py`, or
`learning-detours.tex` has been touched, and none of the closed-form
expressions they currently compute (the clip formula, the \(\rho\)
comparison) is wrong — they are exact implementations of Corollary 2's
special case. Swapping in the general model would require genuine
numerical work (expectations over \(Z\), and, for the S-shaped case, a
grid or root-finder that reports all stationary points and classifies
each via the memo's Lemma 6 rather than solving a single first-order
condition), which is a coder task, not something to infer from this
memo. This integration note flags the scope; it does not estimate it.

## 4. Bottom line

`theory-ct-lt.md` is written as a full candidate replacement, in
`model.md`'s order, with `model.md` recoverable exactly as Corollary 2.
For the blog post, the recommended path is a moderate, not total,
rewrite: two sections ("What I get from a detour," "Where would I stop?")
need new material introducing the gamble and the risk-adjusted crossing;
one section ("What if I am undervaluing the detours?") needs a reframing
sentence, not new content; the rest of the post survives with light
edits or none. The S-shaped growing-returns material and the St
Petersburg construction are recommended to stay out of the post at any
level of detail beyond, optionally, one intuitive sentence about rare,
large payoffs dragging up an average. Whether to actually perform this
swap — retiring `model.md` as the canonical file or keeping it alongside
this memo as the documented special case — is a decision for Pierre; this
memo does not make it and has not touched either file.
