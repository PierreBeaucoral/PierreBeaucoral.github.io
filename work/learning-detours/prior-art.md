# Prior-art check: the two-period exploration/exploitation model

**Verdict (three lines).** The mathematical skeleton — a linear term traded off
against a strictly concave log term under a fixed time budget, giving a
clipped corner-or-interior optimum — is textbook-standard (quasi-linear
preferences with diminishing marginal returns; the same shape economists have
used for decades). The *story* it is dressed in is a stripped-down, static,
two-period cousin of the Ben-Porath human-capital time-allocation tradition.
So: not (a) "a model that already exists verbatim" and not (c) "genuinely
unusual" — it is (b), **a special case of a known family**. Say "a
stripped-down, static version of the standard time-allocation trade-off
between current output and human-capital investment (in the spirit of
Ben-Porath 1967)," not "a small model I wrote out of nowhere." The
expected-utility/St Petersburg extension being built now is not a special
case of anything — it *is* the classical material (Bernoulli, Cramér, Menger,
Samuelson); that part needs citations, not hedging.

---

## 1. Human capital / time-allocation (Ben-Porath tradition)

**Canonical reference:** Ben-Porath, Y. (1967), "The Production of Human
Capital and the Life Cycle of Earnings," *Journal of Political Economy* 75(4),
352–365.

**What it says:** an individual continuously allocates time between producing
current output and producing human capital via a concave technology; human
capital is a state variable that accumulates and depreciates; the model is
solved as an optimal-control problem over the life cycle and generates an
investment profile that is high (often corner, full specialization) early in
life and falls toward zero later.

**Closeness:** this is the nearest formal ancestor of Pierre's structure —
both trade current linear output against a concave, time-financed investment
in future productivity, and both produce interior-vs-corner regimes. The
differences are real, not cosmetic: Ben-Porath is continuous-time, infinite
(life-cycle) horizon, optimal control, with human capital as an accumulating
*stock* that itself depreciates and feeds back into the production function
for *more* human capital. Pierre's model is two periods, closed-form, with a
single deterministic flow gain \(\eta\ln(1+e/\tau)\) added to next period's
productivity — no stock, no feedback, no optimal-control machinery. It is a
legitimate, much-simplified special case of the same idea, not an
implementation of Ben-Porath's actual model. Say so explicitly if citing it.

## 2. Learning-by-doing

**Canonical reference:** Arrow, K.J. (1962), "The Economic Implications of
Learning by Doing," *Review of Economic Studies* 29(3), 155–173.

**What it says:** productivity growth is a byproduct of cumulative production
experience itself (indexed by cumulative investment), not of a separately
chosen "learning" activity; the paper is macro/growth-oriented and shows the
socially optimal investment rate exceeds the private one.

**Closeness:** adjacent in vocabulary only. Arrow's learning is a passive
externality of *doing* the main activity; Pierre's \(e\) is a deliberately
chosen, separate activity that is *not* current research. If the blog post
uses the phrase "learning by doing" for \(e\), a reader who knows the Arrow
paper will expect the wrong mechanism — worth avoiding that exact phrase, or
flagging the difference.

## 3. Exploration–exploitation / bandits and experimentation

**Canonical references:** Gittins, J.C. (1979), "Bandit Processes and Dynamic
Allocation Indices," *JRSS B* 41(2), 148–164; Rothschild, M. (1974), "A
Two-Armed Bandit Theory of Market Pricing," *Journal of Economic Theory*
9(2), 185–202; Weitzman, M.L. (1979), "Optimal Search for the Best
Alternative," *Econometrica* 47(3), 641–654 (the "Pandora's box" paper);
Bergemann, D. and Välimäki, J. (2008), "Bandit Problems," *The New Palgrave
Dictionary of Economics*, 2nd ed. (survey).

**What they say:** an agent facing an unknown payoff must repeatedly choose
between exploiting a known option and paying to learn about an uncertain one;
Gittins gives the index-based optimal policy for the infinite-horizon
version, Rothschild applies the same logic to firms learning their demand
curve, Weitzman gives a one-shot reservation-price rule for sequential search
over alternatives with known distributions, and Bergemann–Välimäki survey the
field.

**Closeness:** important caveat — **the baseline model Pierre wrote has no
uncertainty.** \(\ell(e)\) is deterministic. Calling it an
"exploration–exploitation" or "bandit" model in the post, before the
extension, is not accurate; it's a deterministic diminishing-returns
allocation that merely uses the same words colloquially. The extension now
being built (a gamble on whether learning transfers) is where this literature
actually becomes structurally relevant — a binary "does it pay off or not"
choice under uncertainty is a simple two-arm decision, and Weitzman's
Pandora's-box framing (open the box, learn the realized value, decide whether
it was worth it) is a natural narrative device for that extension. Reserve
the bandit vocabulary for after uncertainty is in the model.

## 4. Researcher time allocation / economics of science

**Canonical references:** Azoulay, P., Graff Zivin, J.S., and Manso, G.
(2011), "Incentives and Creativity: Evidence from the Academic Life
Sciences," *RAND Journal of Economics* 42(3), 527–554; Manso, G. (2011),
"Motivating Innovation," *Journal of Finance* 66(5), 1823–1860.

**What they say:** Azoulay–Graff Zivin–Manso compare HHMI-funded scientists
(who are given long horizons and tolerance for early failure) to NIH-funded
scientists (short review cycles, low tolerance for failure) and find HHMI
investigators produce more high-impact, higher-variance work — an empirical
analog of "protected slack time buys exploration that pays off later." Manso
gives the theoretical principal-agent counterpart: optimal contracts that
motivate exploration must tolerate early failure and reward long-run success,
because exploration is informative and exploitation is not.

**Closeness:** this is the closest *applied economics* literature to
Pierre's motivating story (a researcher's post-teaching slack time), but not
to the mathematical machinery — both papers are multi-period agency models
with information and incentives, much richer than a single static allocation
problem. Cite as "the empirical/theoretical literature this story is an
illustration of," not as the source of the functional form.

## 5. Expected utility and the St Petersburg paradox

This is the part being folded into the extension, and it is squarely
textbook/historical material — nothing here is new or contestable, so it
needs correct citations, not hedging.

- **Bernoulli, D. (1738/1954)**, "Specimen Theoriae Novae de Mensura Sortis,"
  *Commentarii Academiae Scientiarum Imperialis Petropolitanae* 5, 175–192;
  English translation by L. Sommer, "Exposition of a New Theory on the
  Measurement of Risk," *Econometrica* 22(1), 23–36 (1954). Proposes
  expected *utility* (specifically log utility) rather than expected value as
  the right way to evaluate the St Petersburg gamble, giving a finite answer.
- **Cramér, Gabriel**, correspondence with Nicolas Bernoulli, 1728. Cramér
  independently proposed a bounded, concave (square-root) utility resolution
  before Daniel Bernoulli's essay was written; Daniel Bernoulli himself
  credited Cramér on learning of the letter. **I could not find a
  standalone, independently citable publication of Cramér's letter** — it is
  known only through Bernoulli's own account and later secondary literature
  (Samuelson 1977 below). I am not inventing a Cramér reference; cite it, if
  at all, as "reported in Bernoulli (1738/1954) and Samuelson (1977)," not as
  a primary source in its own right.
- **Menger, K. (1934)**, "Das Unsicherheitsmoment in der Wertlehre,"
  *Zeitschrift für Nationalökonomie* 5, 459–485. Argues that a merely
  *unbounded* concave utility function — including Bernoulli's log utility —
  does not resolve St Petersburg-type problems in general: one can always
  construct a "super-Petersburg" payoff sequence that grows fast enough to
  make expected utility diverge again, unless utility is *bounded above*.
- **Peters, O. (2011)**, "Menger 1934 revisited," arXiv:1110.1578. A modern
  corrective: Peters shows Menger's 1934 argument contains a mathematical
  error and that the stated conclusion does not follow as cleanly as usually
  presented. **This is a real pitfall for the post**: Menger's boundedness
  point is widely repeated as settled, but the original proof is disputed.
  State it as "Menger (1934) argued X; this has since been questioned
  (Peters 2011)," not as an uncontested theorem.
- **Samuelson, P.A. (1977)**, "St. Petersburg Paradoxes: Defanged,
  Dissected, and Historically Described," *Journal of Economic Literature*
  15(1), 24–55. The standard, comprehensive survey covering Bernoulli,
  Cramér, and the whole episode with more rigor and historical care than a
  blog post needs to reconstruct from scratch — the single best citation to
  lean on if the post wants to summarize rather than re-derive.

**Closeness / risk:** none of this is Pierre's to claim credit for — it's the
oldest resolved paradox in the utility-theory canon (Bernoulli 1738 is
older than expected utility itself as a named concept). The specific risk is
presenting the log-utility resolution as fully general ("concave utility
fixes St Petersburg") without the Menger/Peters nuance: the accurate
statement is narrower — log (or any merely unbounded, however concave)
utility resolves the *classical* game, but not arbitrarily fast-growing
variants of it; only *bounded* utility does that, and even that specific
1934 argument has a documented technical hole.

## 6. Present bias / misperceived returns (the recognition wedge \(\rho\))

Pierre's extension where the decision-maker recognises only a share
\(\rho\in[0,1]\) of the future learning benefit does not have one exact
match. Three literatures share surface features but differ mechanically:

- **Jensen, R. (2010)**, "The (Perceived) Returns to Education and the
  Demand for Schooling," *Quarterly Journal of Economics* 125(2), 515–548.
  Shows perceived returns to schooling are far below measured returns, and
  that correcting the perception raises investment. **Closest match in
  spirit** — same idea (a real future benefit is under-recognised, so
  investment is too low) — but Jensen's is an empirical belief-elicitation
  and information-treatment design, not a static wedge in a first-order
  condition.
- **Arrow, K.J. (1962)**, "Economic Welfare and the Allocation of Resources
  for Invention," in *The Rate and Direction of Inventive Activity*, NBER.
  The private-vs-social-return wedge in R&D — a decision-maker captures only
  part of the value because of limited *appropriability* (spillovers to
  others), not limited *recognition*. Mechanically the same algebra (multiply
  the future term by a fraction \(<1\)) but a different economic mechanism.
  Readers versed in innovation economics will think of this wedge first;
  worth a one-line disambiguation in the post so \(\rho\) isn't read as an
  appropriability parameter.
- **O'Donoghue, T. and Rabin, M. (1999)**, "Doing It Now or Later,"
  *American Economic Review* 89(1), 103–124. The canonical present-bias /
  naive-quasi-hyperbolic-discounting paper. **Not a good match**: present
  bias multiplicatively discounts *all* future utility (including the
  retained-productivity term \((1-\delta)K\)), whereas Pierre's \(\rho\) hits
  only the incremental learning term and leaves the baseline fully valued.
  Avoid calling \(\rho\) "present bias" in the post — it is closer to a
  partial-awareness/recognition wedge than to time preference.

**Bottom line:** \(\rho\) is best described as an ad hoc recognition wedge
adjacent to Jensen's perceived-returns work, not a re-derivation of any of
the three papers above. Fine to say so plainly.

## 7. The functional form itself (quasi-linear preferences)

\(U(e)=wK(B-e)+\beta H[\dots+\eta\ln(1+e/\tau)]\) is, structurally, a
quasi-linear objective: linear in one argument (current output), concave in
the other (learning). This exact device — linear numeraire term plus a
concave nonlinear term — is the standard way microeconomics textbooks
generate clean interior/corner comparative statics (e.g. Mas-Colell,
Whinston and Green, *Microeconomic Theory*, 1995, the graduate-standard
reference for quasi-linear preferences). I have not verified a specific page
or theorem number for this — it's a textbook-wide device rather than a
single citable claim, so I'm flagging that rather than inventing a page
reference. The corner/interior/clip logic in Proposition 1 is a direct,
correct application of standard Kuhn–Tucker reasoning to this functional
form — nothing about the proof itself is a new technique.

---

## What he risks getting wrong

1. **Calling the deterministic baseline an "exploration–exploitation" or
   "bandit" model.** It has no randomness. Fine as loose language once
   the uncertain extension exists; misleading if used for the baseline alone.
2. **Presenting log utility as "the" general fix for St Petersburg-type
   gambles.** The accurate, narrower claim is that it resolves the
   *classical* game; boundedness is what's needed for full generality, and
   even that specific historical claim (Menger 1934) has a documented
   mathematical gap (Peters 2011) — state both halves.
3. **Crediting Bernoulli alone for the utility resolution.** Cramér reached
   an equivalent (square-root) resolution independently and earlier, by
   Bernoulli's own account; a purist reader will notice the omission.
4. **Calling \(\rho\) "present bias."** It isn't quasi-hyperbolic discounting
   mechanically; "perceived/recognised returns" (closer to Jensen 2010) is
   the more accurate label if a name is wanted at all.
5. **Overclaiming Ben-Porath lineage.** It's a fair ancestor to name, but the
   model is a static two-period simplification, not an implementation of
   Ben-Porath's actual optimal-control life-cycle model — say "in the spirit
   of," not "a version of."
6. **Treating "\(\delta\) doesn't affect \(e^*\)" as a novel finding.** It's
   the standard consequence of additive separability — any economist will
   recognize it immediately; frame it as an expected feature of the setup,
   not a discovery.

Full BibTeX for everything cited above is in `prior-art.bib` in this same
directory. Two items are deliberately **not** in the .bib file because they
could not be independently verified as standalone citable sources: (i) a
Cramér primary reference (letter only known via secondary accounts) — cite
via Bernoulli (1738/1954) and Samuelson (1977) instead; (ii) any specific
MWG page/theorem number for quasi-linear utility — cited as a textbook-wide
device, not a pinpoint claim.
