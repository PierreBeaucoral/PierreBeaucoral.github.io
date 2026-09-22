# Exploration as a gamble: an expected-utility model of useful digressions

This memo is a candidate replacement for `model.md`, written in the same
order so it can be swapped in. It does not edit `model.md`, `index.md`, or
the deck. The central object is a decision-maker who allocates a time
block between current research and exploration, where exploration is a
bet on whether, and how much, learning transfers to future research
productivity. The bet is evaluated by expected utility with a concave
utility function, not by its expected value. `model.md`'s deterministic,
linear-in-progress model is recovered as a nested special case under
stated restrictions (risk neutrality, a degenerate payoff distribution,
a linear cost of delay), given as Corollary 2 below. Nothing here claims
that any of this measures creativity, calibrates a real time allocation,
or supports a time-quota recommendation. Parameters in worked examples
are invented and labeled as such.

## 0. Reading of the brief and where this memo had to choose

Four modeling choices were required to turn "exploration is a gamble,
evaluated by expected utility, with a short-run/long-run crossing and the
St Petersburg material" into formal objects. Each is flagged ASSUMED and
is open to correction.

1. **ASSUMED — the gamble is a random *scale* multiplying a deterministic
   *profile*.** Section 3 models the future transfer from \(e\) hours of
   exploration as \(Z\cdot\psi(e)\): a nonnegative random variable \(Z\)
   (how much luck a detour carries, independent of \(e\)) times a
   deterministic, increasing "base transfer profile" \(\psi(e)\) (how
   much there is to transfer, given \(e\) hours). This is the simplest
   structure under which both a two-state success/failure bet (Section
   6.1) and an unbounded, heavy-tailed St Petersburg-style bet (Section 4)
   are the same object under different distributions of \(Z\), which is
   what lets the St Petersburg material do real work rather than sit next
   to the allocation problem.
2. **ASSUMED — "short-run marginal cost of delay" is derived from
   diminishing returns to current-research hours**, exactly as in the
   prior draft of this memo: one primitive assumption (current-research
   value is a concave, increasing function of hours worked) generates
   both "cutting time from an ongoing project costs more at the margin as
   more is cut" and "current research itself has diminishing returns,"
   because they are the same restriction stated two ways (Lemma 1).
3. **ASSUMED — the perceived-value wedge is modeled as first-order
   stochastic dominance of the true luck distribution over the perceived
   one**, rather than a general behavioral bias. This is the natural
   generalization of `model.md`'s \(\rho\le1\) device once luck is
   genuinely random rather than certain, and it recovers \(\rho\) exactly
   as a special case (Corollary 1).
4. **ASSUMED — the St Petersburg material is used to justify one
   maintained regularity assumption (A6 below), not to claim that real
   academic detours are St Petersburg lotteries.** The classical 2\(^k\)
   construction is an extreme, deliberately pathological example used to
   show *why* expected-value maximization and unbounded utility both fail
   in general, which motivates the specific finiteness assumption this
   memo adopts going forward. Section 4 states plainly which parts of
   that material are load-bearing for the propositions that follow and
   which are illustration.
5. **ASSUMED — uniqueness claims on the S-shaped instance use strict, not
   merely weak, concavity, and lean on \(P(Z>0)>0\).** Lemma 2 alone only
   preserves weak concavity under expectation; Section 5.4's Lemma 5 is
   stated and proved in its strict form, which additionally requires that
   a genuine chance of transfer exists (\(P(Z>0)>0\)) so that the
   S-shaped instance's strict concavity on the upper branch survives
   taking the expectation. This is a mild condition (it fails only if a
   detour literally never transfers), but it is a genuine, separate
   assumption from A2–A4, not a free consequence of them, and it is used
   to rule out a continuum of tied stationary points.

A companion literature check is being run separately; results claimed
below as standard (Bernoulli's resolution, Cramér's resolution, Menger's
theorem, first-order stochastic dominance and expected utility) are named
rather than cited, and the mathematical content attributed to each is
verified by direct proof in this memo rather than taken on authority.

## 1. Setup and notation

There is no calendar time beyond the two periods of `model.md`: a current
period with a fixed block of \(B\ge0\) hours left after obligatory
teaching, and a future period with \(H\ge0\) fixed research hours. The
individual chooses \(e\in[0,B]\), hours spent on exploratory learning,
leaving \(B-e\) hours for current research. Symbols carried over from
`model.md` keep exactly their original meaning (INV-7); symbols for
genuinely different objects are new.

| Symbol | Type | Meaning | Carried from `model.md`? |
|---|---|---|---|
| \(B,e\) | hours | time block available; hours allocated to exploration | unchanged |
| \(K,w\) | value/hour, dimensionless | current-research productivity; urgency weight on current work | unchanged |
| \(H,\beta\) | hours, dimensionless | fixed future research hours; discount weight on the future | unchanged |
| \(\delta,\tau\) | dimensionless, hours | depreciation of retained productivity; learning time-scale | unchanged |
| \(\eta\ge0\) | parameter | learning-effectiveness scale | unchanged |
| \(\ell(e)=\eta\ln(1+e/\tau)\) | function | `model.md`'s concave learning-gain profile | unchanged, used as one instance of \(\psi\) |
| \(\rho\in[0,1]\) | parameter | `model.md`'s recognition wedge | unchanged, recovered as Corollary 1 |
| \(\theta\in(0,1]\) | parameter, dimensionless | curvature of current-research value; \(\theta=1\) recovers a linear cost of delay | new |
| \(R(e)=wK(B-e)^\theta\) | function, value units | current-research value as a function of exploration | new (reduces to \(wK(B-e)\) at \(\theta=1\)) |
| \(\mathrm{MC}(e)=-R'(e)\) | function, value/hour | short-run marginal cost of delay: current progress given up by the next hour of exploration | new |
| \(Z\ge0\) | random variable | the *scale* of a detour's luck: how much of the base profile actually transfers | new |
| \(F,\tilde F\) | distributions | true and perceived distributions of \(Z\) | new |
| \(\psi(e)\) | function, productivity units | base transfer profile, \(\psi(0)=0\), \(\psi'\ge0\); two named instances below | new (name); instances reuse \(\ell,\varphi\) |
| \(\varphi(e)=\eta\,g(e/\tau)\), \(g(x)=x^p/(1+x^p)\) | function | S-shaped instance of \(\psi\), single inflection at \(e_0\) | new |
| \(p>0,\ e_0\in(0,B)\) | parameters | curvature exponent and inflection point of \(\varphi\) | new |
| \(x(e,Z)=R(e)+\beta H(1-\delta)K+\beta H Z\psi(e)\) | random, value units | realized total payoff | new |
| \(u(\cdot)\) | function | utility over realized payoffs, increasing, weakly concave | new |
| \(EU(e)=E_F[u(x(e,Z))]\) | function, utils | true expected utility of choosing \(e\) | new |
| \(\tilde U(e)=E_{\tilde F}[u(x(e,Z))]\) | function, utils | perceived value, using the perceived distribution \(\tilde F\) | new |
| \(\hat Z(e)=E[Zu'(x(e,Z))]/E[u'(x(e,Z))]\) | function | risk-adjusted expected luck at \(e\) | new |
| \(\mathrm{MB}(e)=\beta H\psi'(e)\hat Z(e)\) | function, value/hour | risk-adjusted long-run marginal benefit | new |
| \(e_{\mathrm{lin}}(m)\) | hours | risk-neutral benchmark choice given mean luck \(m\) | new |
| \(e_{EU},e_{\text{perceived}},e_{\mathrm{det}}\) | hours | maximizers of \(EU\), of \(\tilde U\), and `model.md`'s deterministic optimum | new |

\(\ell(e)\)'s formula is byte-identical to `model.md`'s, but its economic
role has shifted: it is no longer the gain the decision-maker is certain
to receive, it is the gain received *only if* the gamble comes in
(\(Z=1\) in the two-state case of Corollary 1, or more generally the
ceiling that \(Z\cdot\ell(e)\) approaches as \(Z\to1\)). The number
\(\ell(e)\) computes has not changed; what it means once it is embedded
in \(x(e,Z)\) has.

## 2. Assumptions

**A1 (domains, inherited).** \(K,w>0\), \(B\ge0\), \(H\ge0\),
\(\beta\in[0,1]\), \(\eta\ge0\), \(\tau>0\), \(\delta\in[0,1]\), exactly as
in `model.md`.

**A2 (current-research curvature).** \(R(e)=wK(B-e)^\theta\),
\(\theta\in(0,1]\), twice continuously differentiable on \([0,B)\),
continuous on \([0,B]\). Rules out constant or increasing returns to
current-research hours; \(\theta=1\) is the boundary case with a flat
marginal cost of delay, matching `model.md`.

**A3 (the gamble).** \(Z\ge0\) is a random variable with distribution
\(F\), independent of \(e\), representing the scale of a detour's luck:
zero if nothing transfers, one if the base profile transfers in full, and
values above one if a detour transfers more than the base profile alone
would suggest. \(Z\) does not depend on \(e\): more exploration changes
the size of the base profile \(\psi(e)\), not the chance or scale of
transfer conditional on the realization of \(Z\). This is a
simplification, flagged in Section 7.

**A4 (base transfer profile).** \(\psi:[0,B]\to\mathbb{R}_{\ge0}\) is
twice continuously differentiable, \(\psi(0)=0\), \(\psi'(e)\ge0\) for all
\(e\). Two instances are used throughout: the **concave instance**
\(\psi=\ell\), `model.md`'s unchanged log profile, used for the main
results and the tractable worked example; and the **S-shaped instance**
\(\psi=\varphi\), with \(\varphi(e)=\eta g(e/\tau)\), \(g(x)=x^p/(1+x^p)\),
which for \(p>1\) is convex on \((0,e_0)\) and concave on \((e_0,B)\) for
a unique inflection \(e_0=\tau\left(\frac{p-1}{p+1}\right)^{1/p}\)
(Lemma 3), used to show what growing detour returns do to uniqueness.

**A5 (utility).** \(u:\mathbb{R}\to\mathbb{R}\) is twice continuously
differentiable, strictly increasing (\(u'>0\)) and weakly concave
(\(u''\le0\)) on the range of \(x(e,Z)\) for \((e,Z)\in[0,B]\times
\mathrm{supp}(F)\). \(u\) linear is the risk-neutral limit case.

**A6 (finiteness, maintained).** Either (i) \(Z\) has bounded support,
\(\mathrm{supp}(F)\subseteq[0,\bar z]\) for some finite \(\bar z\), or
(ii) \(u\) is bounded above, \(\sup_x u(x)=M<\infty\). At least one of
(i)–(ii) is assumed to hold so that \(EU(e)\) is finite and continuous for
every \(e\in[0,B]\). Section 4 explains why some such assumption is
needed and what each branch buys.

**A7 (perceived distribution).** The decision-maker evaluates choices
using a subjective distribution \(\tilde F\) for \(Z\) that is weakly
first-order stochastically dominated by the truth: \(\tilde F(z)\ge F(z)\)
for every \(z\), i.e. the perceived distribution puts weakly more mass on
low realizations of luck. This generalizes `model.md`'s \(\rho\le1\)
(Corollary 1) without assuming a specific parametric form for the bias.

## 3. The decision problem

The individual chooses \(e\in[0,B]\) to maximize
\[
EU(e)=E_F\Big[u\big(x(e,Z)\big)\Big],\qquad
x(e,Z)=R(e)+\beta H(1-\delta)K+\beta H\,Z\,\psi(e).
\tag{1}
\]
The retained-productivity term \(\beta H(1-\delta)K\) is additive and
independent of both \(e\) and \(Z\), exactly as in `model.md`; it shifts
the level of every payoff but, as shown in Section 5, does not affect the
optimal choice, so \(\delta\) still has no comparative-static role.

**Lemma 1 (convex displacement cost is diminishing current returns).**
Under A2, \(\mathrm{MC}(e)=-R'(e)\) is strictly increasing on \((0,B)\)
if and only if \(R\) is strictly concave on \((0,B)\); both hold for
\(\theta<1\) and both fail (constant \(\mathrm{MC}\), affine \(R\)) at
\(\theta=1\).

*Proof.* \(R''(e)=wK\theta(\theta-1)(B-e)^{\theta-2}\) and
\(\mathrm{MC}'(e)=-R''(e)=wK\theta(1-\theta)(B-e)^{\theta-2}\), so
\(\mathrm{MC}'\equiv-R''\) identically. For \(\theta\in(0,1)\),
\(\theta(1-\theta)>0\) and \((B-e)^{\theta-2}>0\) on \((0,B)\), so
\(\mathrm{MC}'>0\) and \(R''<0\) together; at \(\theta=1\) both are
identically zero. \(\square\)

**Lemma 2 (concavity is preserved under expectation).** If, for every
\(z\) in the support of \(F\), \(e\mapsto h(e,z)\) is concave on an
interval \(I\), then \(e\mapsto E_F[h(e,Z)]\) is concave on \(I\).

*Proof.* For \(e_1,e_2\in I\) and \(\lambda\in[0,1]\), concavity of
\(h(\cdot,z)\) gives \(h(\lambda e_1+(1-\lambda)e_2,z)\ge\lambda
h(e_1,z)+(1-\lambda)h(e_2,z)\) for every \(z\) in the support. Taking
expectations over \(Z\) preserves this inequality (expectation is
monotone and linear), giving \(E[h(\lambda e_1+(1-\lambda)e_2,Z)]\ge
\lambda E[h(e_1,Z)]+(1-\lambda)E[h(e_2,Z)]\). \(\square\)

**Lemma 3 (inflection of the S-shaped instance).** Under A4 with
\(\psi=\varphi\), \(p>1\): \(g(x)=x^p/(1+x^p)\) is convex on
\((0,x_0)\) and concave on \((x_0,\infty)\) with
\(x_0=\left(\frac{p-1}{p+1}\right)^{1/p}\in(0,1)\), so
\(e_0=\tau x_0\in(0,\tau)\).

*Proof.* \(g'(x)=px^{p-1}(1+x^p)^{-2}\), and differentiating again,
\(g''(x)=px^{p-2}(1+x^p)^{-3}\big[(p-1)-(p+1)x^p\big]\). The prefactor is
strictly positive for \(x>0\), so the sign of \(g''\) matches the sign of
\((p-1)-(p+1)x^p\), positive for \(x^p<\frac{p-1}{p+1}\) and negative
above it. For \(p>1\), \(\frac{p-1}{p+1}\in(0,1)\), giving a well-defined
\(x_0\in(0,1)\); for \(p\le1\), \((p-1)-(p+1)x^p\le0\) everywhere and
\(g\) is globally concave, not S-shaped. \(\square\)

**The CT/LT condition.** Differentiating (1), for \(e\in(0,B)\) (standard
regularity to differentiate under the expectation holds automatically
under A6's bounded-\(Z\) branch, and is assumed under the bounded-\(u\)
branch),
\[
EU'(e) = -\mathrm{MC}(e)\,E\big[u'(x(e,Z))\big]
+\beta H\psi'(e)\,E\big[Z\,u'(x(e,Z))\big]
= E\big[u'(x(e,Z))\big]\Big(\mathrm{MB}(e)-\mathrm{MC}(e)\Big),
\tag{2}
\]
where \(\mathrm{MB}(e)=\beta H\psi'(e)\hat Z(e)\) and
\(\hat Z(e)=E[Zu'(x(e,Z))]/E[u'(x(e,Z))]\) is the *risk-adjusted* expected
luck at \(e\): the mean of \(Z\), reweighted toward realizations where the
marginal utility of the payoff is high (bad states, if \(u\) is concave).
Because \(E[u'(x(e,Z))]>0\) always (\(u'>0\), A5), \(EU'(e)=0\)
if and only if \(\mathrm{MB}(e)=\mathrm{MC}(e)\): the CT/LT equilibrium of
the earlier brief is exactly a zero of (2), now stated in expected,
risk-adjusted terms rather than deterministic ones. This has the same
form as a stochastic Euler equation in consumption-based asset pricing,
where a marginal condition is weighted by marginal utility across states
rather than by raw probabilities; the parallel is noted because it is
correct, not because it is needed for anything that follows.

**Lemma 4 (risk aversion lowers the risk-adjusted mean).** Under A3, A5,
if \(u\) is concave and \(\psi(e)>0\), \(Z\) non-degenerate, then
\(\hat Z(e)\le E[Z]\), with equality iff \(u\) is affine on the relevant
range or \(Z\) is a.s. constant.

*Proof.* \(x(e,Z)\) is a nondecreasing function of \(Z\) (since \(\beta
H\psi(e)\ge0\)), so \(u'(x(e,Z))\), being \(u'\) composed with a
nondecreasing function of \(Z\) and \(u'\) itself nonincreasing (\(u\)
concave), is a nonincreasing function of \(Z\). Two functions of the same
random variable that are monotonic in opposite directions have
nonpositive covariance (Chebyshev's association inequality): \(\mathrm{Cov}
(Z,u'(x(e,Z)))\le0\), i.e. \(E[Zu'(x(e,Z))]\le E[Z]E[u'(x(e,Z))]\).
Dividing by \(E[u'(x(e,Z))]>0\) gives \(\hat Z(e)\le E[Z]\). Equality
requires \(u'\) constant on the support of \(x(e,Z)\) (u affine there) or
\(Z\) a.s. constant (no variation to covary with). \(\square\)

Lemma 4 is the general statement of "risk aversion makes the
decision-maker act as if the gamble paid less, on average, than it
truly does." It subsumes the specific two-state result derived in the
prior version of this memo (Section 6.1 below reproduces it as a
corollary with exact numbers).

## 4. Why expected value fails, and what expected utility needs

**4.1 The problem, stated directly.** Take the classical St Petersburg
construction for \(Z\): \(P(Z=2^k)=2^{-k}\), \(k=1,2,3,\dots\) This is a
valid distribution (\(\sum_{k\ge1}2^{-k}=1\)) with \(E[Z]=\sum_{k\ge1}
2^{-k}\cdot2^k=\sum_{k\ge1}1=+\infty\). If the decision-maker were risk
neutral (\(u\) linear), (1) gives \(EU(e)=R(e)+\beta H(1-\delta)K+\beta
H\psi(e)E[Z]=+\infty\) for every \(e\) with \(\psi(e)>0\): the objective
is degenerate for every positive amount of exploration, and expected-value
maximization cannot rank any two positive choices of \(e\) against each
other. This is a direct computation, not a deep theorem, and it is the
reason this memo maximizes expected utility rather than expected value:
once a detour's luck is allowed to be heavy-tailed, risk-neutral
evaluation is not merely "less realistic," it is not a well-posed
objective. This is the load-bearing use of the St Petersburg construction
in this memo.

**4.2 Bernoulli's resolution: log utility.** With \(u(x)=\ln x\)
(\(x>0\)), \(E[\ln Z]=\sum_{k\ge1}2^{-k}\,k\ln2=\ln2\sum_{k\ge1}k2^{-k}
=\ln2\cdot2=2\ln2\approx1.386\), finite (using
\(\sum_{k\ge1}kx^k=x/(1-x)^2\) at \(x=1/2\)). The certainty equivalent is
\(u^{-1}(E[\ln Z])=e^{2\ln2}=4\): a log-utility decision-maker values the
classical St Petersburg gamble at a finite 4, despite its infinite mean.

**4.3 Cramér's resolution: bounded-growth utility.** With power utility
\(u(x)=x^\gamma\), \(\gamma\in(0,1)\) (Cramér's own example used
\(\gamma=1/2\)), \(E[Z^\gamma]=\sum_{k\ge1}2^{-k}2^{k\gamma}=\sum_{k\ge1}
2^{-k(1-\gamma)}\), a convergent geometric series for \(\gamma<1\). At
\(\gamma=1/2\): \(E[\sqrt Z]=\sum_{k\ge1}2^{-k/2}=\frac{2^{-1/2}}
{1-2^{-1/2}}=\sqrt2+1\approx2.414\), finite. Cramér additionally suggested,
separately from the specific \(\sqrt x\) example, that utility might
simply be bounded for large payoffs — a direct precursor to Menger's
later, fully general result.

**4.4 A super-lottery against any unbounded utility.** Bernoulli's and
Cramér's resolutions handle the *specific* classical St Petersburg
lottery. The following shows this is fragile: for any strictly
increasing, unbounded, continuous \(u\), a "super" lottery can be
constructed that again makes expected utility diverge, by pegging the
lottery's payoffs to \(u\) itself rather than to raw doubling. The claim
that some such construction always exists against an unbounded utility
function is commonly associated with Menger (1934); a companion
literature check flags that Peters (2011) shows Menger's original 1934
argument contains a mathematical error and that the stated conclusion
does not follow as cleanly as usually presented. The proposition and
proof below are this memo's own, elementary construction, verified
directly rather than taken on Menger's authority, and its correctness
does not depend on resolving that dispute; it is stated as "Menger's
critique" only as a name for the general thesis, not as a claim that
Menger's 1934 proof is being relied on or endorsed as originally stated.

**Proposition (a super-lottery construction).** Let \(u:\mathbb{R}_{>0}
\to\mathbb{R}\) be continuous, strictly increasing, and unbounded above
(\(\sup u=\infty\)). Then there exists a probability distribution for a
random payoff \(Y\), supported on a countable set of positive reals, with
\(E[u(Y)]=\infty\).

*Proof.* Since \(u\) is continuous and strictly increasing on
\(\mathbb{R}_{>0}\), its range is an interval \((L,\infty)\) for some
\(L\in[-\infty,\infty)\) (possibly \(L=-\infty\), as for \(u=\ln\)),
unbounded above by assumption. Choose \(k_0\) large enough that
\(2^{k_0}>L\) (always possible: either \(L=-\infty\) and any \(k_0\)
works, or \(L\) is finite and \(2^{k_0}\to\infty\) eventually exceeds
it). For every \(k\ge k_0\), \(2^k\in(L,\infty)=\mathrm{range}(u)\), so
\(y_k=u^{-1}(2^k)>0\) is well defined (intermediate value theorem) and
strictly increasing in \(k\) (\(u\) strictly increasing). Define, for
\(k=k_0,k_0+1,k_0+2,\dots\), \(P(Y=y_k)=2^{-(k-k_0+1)}\): writing
\(j=k-k_0+1\), this assigns probability \(2^{-j}\) to the \(j\)-th
payoff in the sequence, \(j=1,2,3,\dots\), so \(\sum_{k\ge k_0}
2^{-(k-k_0+1)}=\sum_{j\ge1}2^{-j}=1\), a valid distribution. Then
\[
E[u(Y)]=\sum_{k\ge k_0}2^{-(k-k_0+1)}u(y_k)=\sum_{k\ge k_0}
2^{-(k-k_0+1)}\cdot2^k
=2^{k_0-1}\sum_{j\ge1}2^{-j}\cdot2^{j}=2^{k_0-1}\sum_{j\ge1}1=+\infty.
\]
\(\square\)

Read together with Sections 4.2–4.3, this shows that neither a specific
utility function (log, or any fixed power \(<1\)) nor, more generally,
any unbounded utility function at all can be guaranteed finite expected
utility against every conceivable lottery: some lottery can always be
tailored to defeat it, by construction. Whether this is close to a
*necessary* condition for boundedness, as Menger's original claim is
usually summarized, is exactly the point in dispute per Peters (2011);
this memo only needs, and only claims, the *sufficiency* direction used
in Section 4.5 below (the memo's own construction shows an unbounded
\(u\) is not safe in general, which is enough to justify adopting A6,
without needing the stronger, disputed necessity claim).

**4.5 What this buys, and does not buy, for the allocation problem.**
A common intuition is that a finite time budget \(B\) already rules out
St Petersburg-style problems. This is incorrect and is stated plainly
here to avoid the mistake: \(B\) bounds *hours spent*, not the *size of
the realized payoff* \(Z\). Nothing in the setup of Section 3 prevents
\(Z\) from having unbounded support even though \(e\le B\) always. Some
version of A6 is therefore a genuine, load-bearing assumption, not an
automatic consequence of the model being a finite two-period allocation
problem.

A6's two branches carry over to this application unevenly.

- **Bounded \(Z\) (finite resources / truncated horizon).** This is the
  more natural branch here: future productivity from a detour is realized
  within \(H\) fixed future research hours (already an assumption in
  `model.md`), and it is economically reasonable that a single detour's
  contribution to that fixed stock of hours has some finite ceiling,
  however generous, rather than literally unbounded scale. Under this
  branch, \(x(e,Z)\) ranges over a compact set for \(e\in[0,B]\),
  \(Z\in[0,\bar z]\), so \(EU\) is automatically finite and, by dominated
  convergence with the constant bound \(\max_{e,z}|u(x(e,z))|\),
  continuous in \(e\) — both of exactly what Proposition 1 needs. This
  branch is adopted as the default for the rest of this memo.
- **Bounded \(u\) (Menger's route).** This resolves the problem for any
  \(Z\), including genuinely unbounded, heavy-tailed luck, at the cost of
  assuming a satiation level on the value of future research productivity
  — that no conceivable detour, however transformative, is worth more
  than some fixed ceiling of utility. This is a stronger and, for a
  research-value interpretation specifically, a less natural assumption
  than for a monetary payoff: unlike money, research value plausibly has
  no obvious physical cap analogous to bounded time or bounded resources.
  It is noted as an available, standard resolution, not adopted as the
  primary one.

The exact classical \(2^k\) lottery used in 4.1–4.4 is not a claim that
real academic detours follow a St Petersburg distribution; it is the
sharpest available example for showing *why* risk-neutral evaluation and
unbounded utility both fail in general, which is what motivates adopting
A6. Everything past this section uses A6's bounded-\(Z\) branch, so the
exotic tail behavior of Sections 4.1 and 4.4 does not itself reappear in
the results below; it is diagnostic material explaining why a maintained
assumption is needed, not a standing feature of the final model.

## 5. Results

### 5.1 Existence

**Proposition 1 (existence).** Under A1–A6, \(EU\) attains a maximum on
\([0,B]\).

*Proof.* Under A6(i), \(x(e,z)\) is continuous on the compact set
\([0,B]\times[0,\bar z]\) (A2, A4 continuity), hence bounded, so
\(u(x(e,z))\) is bounded (A5 continuity of \(u\)) by some constant
\(M<\infty\) uniformly in \((e,z)\); under A6(ii), \(u(x(e,z))\le M\)
directly. Either way, \(EU(e)=E_F[u(x(e,Z))]\) is finite for every
\(e\in[0,B]\) and, since \(e\mapsto u(x(e,z))\) is continuous for every
\(z\) and dominated by the integrable constant \(M\), \(EU\) is
continuous in \(e\) by dominated convergence. A continuous function on a
compact interval attains its maximum (Weierstrass). \(\square\)

### 5.2 Risk aversion discounts exploration

**Proposition 2 (risk-aversion discount, general \(Z\)).** Under A1–A6,
let \(e_{\mathrm{lin}}(m)\) denote the (assumed unique, interior)
risk-neutral optimal choice solving \(\mathrm{MC}(e)=\beta H\psi'(e)\,m\)
for mean luck \(m=E[Z]\), and let \(e_{EU}\) denote the maximizer of
\(EU\) under a strictly concave \(u\), with \(\psi=\ell\) (concave
instance, so \(EU\) is globally concave directly by Lemma 2, applied to
the concave \(x(\cdot,z)=R(\cdot)+\beta H(1-\delta)K+\beta Hz\ell(\cdot)\)
for every \(z\ge0\), composed with increasing concave \(u\) — this
concavity argument does not need the S-shaped instance of Section 5.4,
which addresses \(\psi=\varphi\) instead). If \(e_{\mathrm{lin}}(E[Z])>0\)
(which requires \(\eta>0\): at \(\eta=0\), \(\ell\equiv0\) and the
risk-neutral benchmark is trivially \(e_{\mathrm{lin}}=0\), outside the
scope of this proposition), then
\[
e_{EU}\le e_{\mathrm{lin}}(E[Z]),
\]
strictly whenever \(Z\) is non-degenerate and \(u\) is strictly concave.

*Proof.* At \(e=e_{\mathrm{lin}}(E[Z])\), by definition
\(\mathrm{MC}(e_{\mathrm{lin}})=\beta H\psi'(e_{\mathrm{lin}})E[Z]\).
Substituting into (2),
\[
EU'(e_{\mathrm{lin}}) = -\beta H\psi'(e_{\mathrm{lin}})E[Z]\,
E[u'(x(e_{\mathrm{lin}},Z))] +\beta H\psi'(e_{\mathrm{lin}})\,
E[Zu'(x(e_{\mathrm{lin}},Z))]
=\beta H\psi'(e_{\mathrm{lin}})\,\mathrm{Cov}\big(Z,\,u'(x(e_{\mathrm{lin}},Z))\big).
\]
By Lemma 4, \(\mathrm{Cov}(Z,u'(x(e_{\mathrm{lin}},Z)))\le0\) (strictly,
under the stated conditions), and \(\psi'(e_{\mathrm{lin}})\ge0\), so
\(EU'(e_{\mathrm{lin}})\le0\), strictly negative under the same
conditions. Since \(EU\) is concave (Lemma 2 applied pointwise to the
concave \(x(\cdot,z)\), then composed with increasing concave \(u\)),
\(EU'\) is weakly decreasing, so \(EU'(e_{\mathrm{lin}})\le0\) implies the
maximizer of \(EU\) lies at or before \(e_{\mathrm{lin}}\). \(\square\)

Proposition 2 formalizes "exploration is a gamble, and a risk-averse
decision-maker treats a risky return more cautiously than its raw mean
suggests," directly, and without reference to any specific distribution
of \(Z\).

### 5.3 Interior optimum versus a corner

Throughout this subsection, \(\psi=\ell\) (concave instance), so \(EU\) is
globally concave (established in the proof of Proposition 2) and the
first-order condition, together with the constraint, is necessary and
sufficient — the same logic as `model.md`'s Proposition 1, now applied to
(2).

A2 restricts \(R\)'s twice-differentiability to \([0,B)\), because
\(\mathrm{MC}(e)=wK\theta(B-e)^{\theta-1}\to+\infty\) as \(e\to B^-\)
whenever \(\theta<1\) (Lemma 1). Reading \(EU'(B)\), \(\mathrm{MC}(B)\)
below as the one-sided limits \(EU'(B):=\lim_{e\to B^-}EU'(e)\),
\(\mathrm{MC}(B):=\lim_{e\to B^-}\mathrm{MC}(e)\) (finite at \(\theta=1\),
where \(\mathrm{MC}(B)=wK\); \(+\infty\) at \(\theta<1\)):

**Proposition 3 (interior vs. corner).** Under A1–A6 with \(\psi=\ell\),

\[
e^*=0 \iff \beta H\ell'(0)E[Z]\le\mathrm{MC}(0),\qquad
e^*=B \iff \beta H\ell'(B)\hat Z(B)\ge\mathrm{MC}(B).
\]

At \(\theta<1\), \(\mathrm{MC}(B)=+\infty\) while \(\mathrm{MB}(B)=\beta
H\ell'(B)\hat Z(B)\) stays finite (\(\ell'\) bounded on \([0,B]\), \(\hat
Z(B)\le E[Z]\le\bar z<\infty\) under A6(i)), so the upper-corner
condition can never hold and \(e^*=B\) is unreachable; only \(\theta=1\)
(a linear, non-diverging cost of delay) admits a genuine full-exploration
corner. With an interior optimum exactly when both inequalities are
strict in the other direction, the lower-corner condition depends on
\(Z\) only through its mean \(E[Z]\), not on the curvature of \(u\); the
upper-corner condition (at \(\theta=1\)) depends on \(u\)'s curvature
through \(\hat Z(B)\le E[Z]\) (Lemma 4).

*Proof.* At \(e=0\), \(\psi(0)=0\), so \(x(0,Z)=R(0)+\beta H(1-\delta)K\)
is the same deterministic number for every realization of \(Z\); hence
\(u'(x(0,Z))\) is a constant (not a function of \(Z\)), and
\(\hat Z(0)=E[Zu'(x(0,Z))]/E[u'(x(0,Z))]=u'(x(0,\cdot))E[Z]/u'(x(0,\cdot))
=E[Z]\) exactly (the constant cancels). By concavity of \(EU\) (5.2),
\(e^*=0\) iff \(EU'(0)\le0\) iff, from (2) with \(\hat Z(0)=E[Z]\),
\(\beta H\ell'(0)E[Z]\le\mathrm{MC}(0)\). At \(e=B\), no such cancellation
occurs in general. For \(\theta=1\), \(\mathrm{MC}(B)=wK\) is finite and
the same concavity argument gives \(e^*=B\) iff \(EU'(B)\ge0\) iff
\(\beta H\ell'(B)\hat Z(B)\ge\mathrm{MC}(B)\), using (2) directly at
\(e=B\). For \(\theta<1\), \(EU'(e)\to-\infty\) as \(e\to B^-\) (since
\(EU'(e)=E[u'(x(e,Z))](\mathrm{MB}(e)-\mathrm{MC}(e))\), the first factor
is bounded away from \(0\) by A5–A6, and \(\mathrm{MC}(e)\to+\infty\)
while \(\mathrm{MB}(e)\) stays bounded), so \(EU\) is strictly decreasing
in a left-neighborhood of \(B\) and \(e^*=B\) never satisfies the
first-order necessary condition; the upper corner is excluded from the
candidate set by this limit rather than by evaluating a finite \(EU'(B)\)
directly. The interior case follows by concavity exactly as in
`model.md`'s Step 3, restricted to \([0,B)\) when \(\theta<1\).
\(\square\)

The asymmetry is worth stating in words: whether it is worth exploring
*at all* does not depend on risk aversion, because the very first
instant of exploration carries no risk yet (nothing has been bet); risk
aversion only starts to matter, and only ever discourages further
exploration (weakly, by Lemma 4), once a nontrivial gamble is actually on
the table.

### 5.4 What growing detour returns do to uniqueness

This subsection switches to \(\psi=\varphi\) (S-shaped instance, A4).

**Lemma 5 (strict concavity on the upper branch, stochastic case).**
Under A1–A6 with \(\psi=\varphi\), \(\beta H>0\), and \(P(Z>0)>0\), \(EU\)
is *strictly* concave on \([e_0,B]\).

*Proof.* Lemma 2 alone only preserves weak concavity under expectation
(a weakly concave function can be flat on an interval, and so can a
mixture of them), so strictness needs an extra step beyond the
pointwise-concavity argument. For \(z>0\), \(x(e,z)=R(e)+\beta
H(1-\delta)K+\beta Hz\varphi(e)\) has \(x''(e,z)=R''(e)+\beta Hz
\varphi''(e)\) on \([e_0,B]\): \(R''(e)\le0\) (Lemma 1, at worst affine
for \(\theta=1\)) and \(\varphi''(e)<0\) strictly (Lemma 3), so for
\(z>0\) and \(\beta H>0\), \(x''(e,z)<0\) strictly: \(x(\cdot,z)\) is
*strictly* concave on \([e_0,B]\). Since \(u\) is strictly increasing
(A5) and concave, and \(x(\cdot,z)\) is strictly concave, \(u(x(\cdot,z))\)
is strictly concave on \([e_0,B]\): for \(e_1\ne e_2\) and \(\lambda\in
(0,1)\), \(x(\lambda e_1+(1-\lambda)e_2,z)>\lambda x(e_1,z)+(1-\lambda)
x(e_2,z)\) strictly, and \(u\) strictly increasing carries this into
\(u(x(\lambda e_1+(1-\lambda)e_2,z))>u(\lambda x(e_1,z)+(1-\lambda)
x(e_2,z))\ge\lambda u(x(e_1,z))+(1-\lambda)u(x(e_2,z))\), the last step
by \(u\)'s own (weak) concavity. For \(z=0\), \(u(x(e,0))\) is only
weakly concave in general (affine composed with possibly linear \(u\)).
Writing \(EU(e)=P(Z=0)u(x(e,0))+E\big[u(x(e,Z))\mathbf 1\{Z>0\}\big]\),
the first term satisfies the weak-concavity inequality and the second is
a nonnegative measure, with total mass \(P(Z>0)>0\), of a strictly
concave family; combining a weak inequality on one part of the mixture
with a strict inequality on a part carrying strictly positive probability
gives a strict inequality overall:
\[
EU(\lambda e_1+(1-\lambda)e_2) > \lambda EU(e_1)+(1-\lambda)EU(e_2)
\]
for every \(e_1\ne e_2\) in \([e_0,B]\), \(\lambda\in(0,1)\), i.e. \(EU\)
is strictly concave on \([e_0,B]\). (If \(\beta H=0\), there is no future
value at all and \(EU(e)=E[u(R(e)+\ldots)]\) is monotonic with no
interior stationary point to count, so the case is excluded here without
loss.) \(\square\)

On \((0,e_0)\), \(\varphi\) is convex, so for \(z>0\) the same argument
gives \(x(e,z)\) as the sum of a concave term (\(R\)) and a convex term
(\(z\varphi(e)\)): the curvature is ambiguous, and \(EU\) need not be
concave there. This is exactly the mechanism requested: increasing
returns on the long-run side break uniqueness by breaking concavity of
the objective over the range where they operate.

**Proposition 4 (candidate set, stochastic case).** Under A1–A6 with
\(\psi=\varphi\), every global maximizer of \(EU\) on \([0,B]\) belongs to
\[
\mathcal C=\{0,B\}\cup\{e\in(0,B):EU'(e)=0,\ EU''(e)\le0\}.
\]
Any stationary point with \(EU''(e)>0\) is a strict local minimum and is
never the global maximizer. If, in addition, \(\beta H>0\) and \(P(Z>0)
>0\) (Lemma 5), \(EU\) has *at most one* stationary point in \([e_0,B]\),
which, if it exists, is the unique maximizer of \(EU\) restricted to that
sub-interval; without those two conditions, only the weaker statement
that \(EU\) is concave (not necessarily strictly) on \([e_0,B]\) holds,
and the stationary set there could in principle be a single connected
interval rather than a point.

*Proof.* Identical in structure to the deterministic argument: \(EU\) is
\(C^2\) on \((0,B)\) under the stated regularity, so its maximizer on the
compact interval \([0,B]\) is an endpoint or a critical point satisfying
the second-order necessary condition \(EU''\le0\); a critical point with
\(EU''>0\) is a strict local minimum by the second-derivative test and is
therefore never a global maximizer. Under \(\beta H>0\), \(P(Z>0)>0\),
Lemma 5 gives strict concavity on \([e_0,B]\), so \(EU'\) is strictly
decreasing there and can vanish at most once, giving at most one
stationary point on that sub-interval, which is then automatically its
maximizer by standard strict concavity. \(\square\)

**Lemma 6 (crossing-type diagnostic, stochastic case).** Let \(e^\dagger
\in(0,B)\) satisfy \(\mathrm{MB}(e^\dagger)=\mathrm{MC}(e^\dagger)\) with
\(\tilde D(e)\equiv\mathrm{MB}(e)-\mathrm{MC}(e)\) changing sign at
\(e^\dagger\) (\(\tilde D'(e^\dagger)\ne0\)). If \(\tilde D\) crosses
zero from below (upward), \(e^\dagger\) is a strict local minimum of
\(EU\); if from above (downward), \(e^\dagger\) is a strict local
maximum.

*Proof.* From (2), \(EU'(e)=E[u'(x(e,Z))]\,\tilde D(e)\). Differentiating
by the product rule and evaluating at \(e^\dagger\), where
\(\tilde D(e^\dagger)=0\),
\[
EU''(e^\dagger)=\frac{d}{de}E[u'(x(e,Z))]\Big|_{e^\dagger}\cdot
\tilde D(e^\dagger) + E[u'(x(e^\dagger,Z))]\,\tilde D'(e^\dagger)
= E[u'(x(e^\dagger,Z))]\,\tilde D'(e^\dagger),
\]
since the first term vanishes at \(\tilde D(e^\dagger)=0\). Because
\(E[u'(x(e^\dagger,Z))]>0\) (\(u'>0\), A5), the sign of \(EU''(e^\dagger)\)
matches the sign of \(\tilde D'(e^\dagger)\): an upward crossing
(\(\tilde D'(e^\dagger)>0\)) gives \(EU''(e^\dagger)>0\), a strict local
minimum; a downward crossing gives \(EU''(e^\dagger)<0\), a strict local
maximum, by the second-derivative test in both cases. \(\square\)

Proposition 4 and Lemma 6 hold for any \(Z\) satisfying A3 and A6 and any
\(u\) satisfying A5: growing detour returns break the single-crossing
property that made `model.md`'s Proposition 1 a clean, one-shot
first-order-condition argument, and they do so regardless of how risk is
priced through \(u\). What risk aversion changes is *where* the crossings
sit and how far apart the corresponding \(U\)-levels are (via \(\hat Z\)
in \(\mathrm{MB}\)), not whether multiplicity can occur at all.

### 5.5 Perceived value versus the correct expected utility

**Proposition 5 (perceived value is pointwise dominated).** Under A5, A7,
for every \(e\in[0,B]\),
\[
\tilde U(e)\le EU(e),
\]
with strict inequality whenever \(\tilde F(z)>F(z)\) on a set of \(z\) of
positive measure and \(\psi(e)>0\).

*Proof.* This is the standard equivalence between first-order stochastic
dominance and higher expected utility for every increasing \(u\), applied
to \(u(x(e,\cdot))\), itself increasing in \(Z\) since \(\beta H\psi(e)
\ge0\). Writing the difference as a Riemann–Stieltjes integral and
integrating by parts (boundary terms vanish under A6's bounded-\(Z\)
branch),
\[
EU(e)-\tilde U(e)=\int u(x(e,z))\,d\big(F-\tilde F\big)(z)
=-\int \frac{\partial}{\partial z}u(x(e,z))\,\big[F(z)-\tilde F(z)\big]\,dz
=\int \frac{\partial}{\partial z}u(x(e,z))\,\big[\tilde F(z)-F(z)\big]\,dz.
\]
The integrand is a product of \(\partial u(x(e,z))/\partial z\ge0\)
(since \(u\) increasing and \(x(e,\cdot)\) nondecreasing in \(z\)) and
\(\tilde F(z)-F(z)\ge0\) pointwise (A7), so the integral is nonnegative,
giving \(EU(e)\ge\tilde U(e)\). It is strict whenever the two factors are
simultaneously strictly positive on a set of \(z\) of positive measure,
which holds whenever \(\tilde F(z)>F(z)\) on such a set and \(\psi(e)>0\)
(so the payoff genuinely varies with \(z\)). \(\square\)

This is the general form of "the perceived value that guides the choice
is lower than the expected utility of the correct model," holding
pointwise in \(e\), not only at the respective optima.

### 5.6 Nesting

**Corollary 1 (two-state case recovers \(\rho\)).** Let \(Z\in\{0,1\}\),
\(P(Z=1)=\pi\in(0,1]\) under \(F\) and \(P(Z=1)=\tilde\pi\in[0,\pi]\)
under \(\tilde F\) (a special case of A7, since \(\tilde F\) first-order
stochastically dominates \(F\)... — here \(\tilde F\) puts *more* mass at
\(Z=0\), so \(\tilde F(0)=1-\tilde\pi\ge1-\pi=F(0)\), i.e.
\(\tilde F\ge F\) pointwise, matching A7). Write \(x_S(e)=x(e,1)=R(e)+
\beta H(1-\delta)K+\beta H\psi(e)\) and \(x_F(e)=x(e,0)=R(e)+\beta
H(1-\delta)K\). Then \(EU(e)=\pi u(x_S(e))+(1-\pi)u(x_F(e))\) and
\(\tilde U(e)=\tilde\pi u(x_S(e))+(1-\tilde\pi)u(x_F(e))\). At \(\pi=1\)
and \(u\) linear, \(EU(e)=x_S(e)\), `model.md`'s objective (with
\(\psi=\ell\), \(\theta=1\)), and \(\tilde U(e)=x_F(e)+\tilde\pi\big[x_S
(e)-x_F(e)\big]=R(e)+\beta H(1-\delta)K+\tilde\pi\beta H\psi(e)\), which
is algebraically identical to `model.md`'s \(U_\rho(e)\) upon setting
\(\rho=\tilde\pi\) (and \(\psi(e)=A\,L(e)\) if the quantity/quality split
of `model.md`'s existing extension is used).

*Proof.* Substituting \(Z\in\{0,1\}\) into \(EU(e)=E_F[u(x(e,Z))]\) gives
\(EU(e)=P(Z=1)u(x(e,1))+P(Z=0)u(x(e,0))=\pi u(x_S(e))+(1-\pi)u(x_F(e))\)
directly from the definitions of \(x_S,x_F\) above; the identical
substitution with \(\tilde F\) in place of \(F\) gives \(\tilde U(e)=
\tilde\pi u(x_S(e))+(1-\tilde\pi)u(x_F(e))\). At \(\pi=1\): \(EU(e)=1\cdot
u(x_S(e))+0\cdot u(x_F(e))=u(x_S(e))\); at \(u(x)=x\) (linear), this is
\(x_S(e)=R(e)+\beta H(1-\delta)K+\beta H\psi(e)\), which at \(\theta=1\),
\(\psi=\ell\) is exactly `model.md`'s objective (Corollary 2). For
\(\tilde U\) at \(u\) linear, for any \(\tilde\pi\in[0,1]\):
\[
\tilde U(e)=\tilde\pi\,x_S(e)+(1-\tilde\pi)\,x_F(e)
=x_F(e)+\tilde\pi\big[x_S(e)-x_F(e)\big]
=R(e)+\beta H(1-\delta)K+\tilde\pi\,\beta H\psi(e),
\]
using \(x_S(e)-x_F(e)=\beta H\psi(e)\) directly from their definitions.
At \(\theta=1\) (\(R(e)=wK(B-e)\)) and \(\psi=\ell\), this is \(\tilde
U(e)=wK(B-e)+\beta H\big[(1-\delta)K+\tilde\pi\,\eta\ln(1+e/\tau)\big]\),
which is `model.md`'s \(U_\rho(e)=wK(B-e)+\beta H[(1-\delta)K+\rho A
L(e)]\) term by term upon setting \(\rho=\tilde\pi\), \(A=\eta\),
\(L(e)=\ln(1+e/\tau)\) (or \(A=\eta_N+\lambda\eta_Q\) if the
quantity/quality split of `model.md`'s existing extension is used in
place of \(\eta\)). \(\square\)

Read together with Proposition 2 and Lemma 4, Corollary 1 places
\(\rho\) exactly where the earlier draft of this memo placed it: it is
what remains of the perceived-value wedge once the risk-aversion channel
of Proposition 2 is switched off (\(u\) linear) and the objective risk
itself is switched off (\(\pi=1\), so the only thing in question is the
decision-maker's belief). The general model of Sections 3–5 is strictly
richer: it represents genuine risk that a detour does not pay off
(\(\pi<1\), or more generally any non-degenerate \(F\)) and a separate,
curvature-driven force (Proposition 2) that a single scalar \(\rho\)
cannot express.

**Corollary 2 (`model.md` is the deterministic, risk-neutral, linear-cost
special case).** Under \(\theta=1\) (A2), \(Z\equiv1\) a.s. (a
degenerate, point-mass distribution: transfer is certain and always in
full), \(u(x)=x\) (risk neutrality), and \(\psi=\ell\) (A4, concave
instance), (1) reduces to
\[
EU(e)=wK(B-e)+\beta H\big[(1-\delta)K+\eta\ln(1+e/\tau)\big],
\]
exactly `model.md`'s objective (1), and its maximizer is exactly
`model.md`'s Proposition 1, \(e^*=\operatorname{clip}(\beta H\eta/(wK)
-\tau;0,B)\).

*Proof.* At \(Z\equiv1\), \(x(e,Z)=x(e,1)=R(e)+\beta H(1-\delta)K+\beta
H\psi(e)\) with probability 1, so \(EU(e)=u(x(e,1))=x(e,1)\) at \(u\)
linear; at \(\theta=1\), \(R(e)=wK(B-e)\); at \(\psi=\ell\), \(\beta
H\psi(e)=\beta H\eta\ln(1+e/\tau)\). Substituting gives `model.md`'s (1)
term by term. The maximizer follows by `model.md`'s own Proposition 1,
which this memo does not need to reprove. \(\square\)

Corollary 2 is the formal sense in which `model.md` is nested rather than
discarded: it is the point in this memo's parameter space where the
gamble has collapsed to certainty, the cost of delay is linear, and the
decision-maker is risk neutral. Every one of those three restrictions is
economically substantive on its own (Sections 4–5 give the reasons to
relax each), which is why the replacement, rather than an unrestricted
extension, is the more honest description of the relationship between
the two memos.

## 6. Worked numerical examples

All parameter values in this section are invented for illustration and
are not calibrated to any actual allocation of time.

### 6.1 The tractable two-state case

Take \(B=10,K=1,w=1,\beta=0.9,H=10,\eta=0.5,\tau=1,\delta=0.05,\theta=1\)
(`model.md`'s "medium" row), with \(\psi=\ell\), \(\pi=0.6\) (true
probability of transfer), \(\tilde\pi=0.4\) (perceived, pessimistic), and
\(u(x)=x-0.005x^2\) (\(u'(x)=1-0.01x>0\) throughout the relevant range,
checked below).

By Corollary 2, \(e_{\mathrm{det}}=\operatorname{clip}(4.5-1;0,10)=3.5\)
hours, matching `model.md`'s own number exactly (a cross-check that (1)
nests the baseline correctly). By Proposition 3's risk-neutral benchmark,
\(e_{\mathrm{lin}}(\pi)=\operatorname{clip}(0.6\cdot4.5-1;0,10)=1.7\) and
\(e_{\mathrm{lin}}(\tilde\pi)=\operatorname{clip}(0.4\cdot4.5-1;0,10)
=0.8\).

Checking Proposition 2's key quantity directly at \(e=1.7\): \(x_F(1.7)
=16.85\), \(x_S(1.7)=16.85+4.5\ln(2.7)=21.320\), well inside the range
where \(u'>0\) (\(x<100\)). By the two-state form of the covariance
identity (Corollary 1's \(\mathrm{Cov}\) reduces to \(\pi(1-\pi)[u'(x_S)-
u'(x_F)]\), matching the general formula in the proof of Proposition 2),
\[
EU'(1.7)=\beta H\ell'(1.7)\,\pi(1-\pi)\big[u'(x_S(1.7))-u'(x_F(1.7))\big],
\]
where \(\beta H\ell'(1.7)=9\times0.5/2.7\approx1.667>0\) and \(\pi(1-\pi)
=0.6\times0.4=0.24\). Evaluated numerically (\(u'(21.320)=0.7868\),
\(u'(16.85)=0.8315\)), the bracket is \(0.7868-0.8315=-0.0447\), so
\(EU'(1.7)\approx1.667\times0.24\times(-0.0447)\approx-0.0179<0\),
confirming \(e_{EU}<1.7\) strictly, consistent with Proposition 2. The
identical check with \(\tilde\pi=0.4\) at
\(e=0.8\) gives the same qualitative conclusion for \(e_{\text{perceived}}
<0.8\). The resulting chain,
\[
e_{\text{perceived}}\lesssim0.8\ \le\ e_{EU}\lesssim1.7\ \le\
e_{\mathrm{lin}}(\pi)=1.7\ \le\ e_{\mathrm{det}}=3.5,
\]
separates three effects with distinct signs and interpretations: a
40%-chance-of-failure discount (\(3.5\to1.7\), a correct adjustment given
\(\pi=0.6\)), a mild risk-aversion discount (a further small reduction,
a correct adjustment given concave \(u\)), and a further pessimism
discount from underestimating \(\pi\) as \(0.4\) rather than \(0.6\)
(\(1.7\to0.8\) at the risk-neutral level, the only one of the three that
is a genuine misperception rather than a rational adjustment).

### 6.2 St Petersburg finite-utility check

Reproducing the computations of Section 4.2–4.3 as a direct numerical
check: for the classical \(Z=2^k\) w.p. \(2^{-k}\) lottery, \(E[Z]=
\infty\), \(E[\ln Z]=2\ln2\approx1.386\) (certainty equivalent \(4\)),
and \(E[\sqrt Z]=\sqrt2+1\approx2.414\), both finite despite the infinite
mean. This lottery is not used in Sections 5–6.1 (which adopt A6's
bounded-\(Z\) branch); it is retained here only as the numerical
verification of the claims in Section 4.

### 6.3 Growing returns and multiplicity

Take \(B=12,K=1,w=1,\beta=0.9,H=8,\delta=0.1,\eta=6,\tau=3,\theta=0.6,
p=4\), with \(\psi=\varphi\) and, for tractability, \(Z\equiv1\) a.s.
and \(u\) linear (the risk-neutral, certain-transfer corner of this
model, used here purely to compute exact numbers; Proposition 4 and
Lemma 6 hold for any concave \(u\) and any \(Z\) satisfying A3, A6 — this
example pins down a concrete instance of the general result). The
inflection point is \(e_0=\tau(3/5)^{1/4}\approx2.64\) (Lemma 3).
Evaluating \(\tilde D(e)=\mathrm{MB}(e)-\mathrm{MC}(e)\):

| \(e\) | 0 | 0.5 | 1 | 2 | 2.64 | 4 | 6 | 8 | 8.2 | 8.3 | 9 | 10 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| \(\tilde D(e)\) | \(-0.222\) | \(+0.040\) | \(+1.852\) | \(+11.66\) | \(+15.09\) | \(+7.63\) | \(+1.30\) | \(+0.066\) | \(+0.013\) | \(-0.012\) | \(-0.155\) | \(-0.317\) | \(-\infty\) |

Every cell was recomputed directly from \(\mathrm{MB}(e)=57.6e^3/(3^3(1+
(e/3)^4)^2)\) and \(\mathrm{MC}(e)=0.6(12-e)^{-0.4}\) rather than carried
over from the earlier draft, after an error was caught at \(e=8.2\) in an
earlier version of this table (\(\mathrm{MB}(8.2)=7.2\varphi'(8.2)
\approx0.3643\), \(\mathrm{MC}(8.2)\approx0.3518\), giving \(\tilde D
(8.2)\approx+0.0126\), positive, not the \(-0.019\) previously reported).
\(\tilde D\) crosses zero upward near \(e_1\approx0.47\) (a strict local
minimum by Lemma 6) and downward between \(e=8.2\) and \(e=8.3\)
(bisection gives \(e_2\approx8.25\), a strict local maximum). Comparing
levels, \(EU(0)=U_2(0)\approx10.92\) and, evaluating close to \(e_2\) at
\(e=8.2\), \(EU(8.2)=U_2(8.2)\approx51.15\) (using \(R(0)=12^{0.6}
\approx4.44\), \(R(8.2)=3.8^{0.6}\approx2.23\), \(\varphi(8.2)
\approx5.89\); since \(EU\) is flat to first order near its own local
maximum, the level at \(e=8.2\) is a close approximation to \(EU(e_2)\)):
the global maximizer sits near \(e_2\approx8.25\), not the corner \(e=0\)
that a purely local check at \(e=0\) would have suggested (\(EU'(0)=
\tilde D(0)\times\text{const}<0\): the first hour of exploration looks
locally unattractive, because the marginal future benefit only starts
compounding once the initial ramp-up region has been crossed), and not
the naive first root of the first-order condition (\(e_1\approx0.47\), a
strict local minimum, the single worst nearby point to choose).

## 7. Limitations

- **A3's luck \(Z\) is independent of \(e\).** More exploration changes
  the size of the base transfer profile, not the chance or scale of
  transfer conditional on a given realization of luck. A model in which
  \(e\) also shifts the distribution of \(Z\) (more exploration raises
  the odds of a payoff, not only its potential size) is a natural next
  step and is not derived here; Lemma 4's sign is not guaranteed to
  survive that change without further argument.
- **The exact bound on the number of interior stationary points
  (analogous to the deterministic model's flat-cost case) is not
  re-derived here for the stochastic model.** Proposition 4 gives a fully
  general but weaker candidate-set characterization for any \(Z\); the
  worked example in Section 6.3 exhibits exactly two interior stationary
  points, consistent with, but not implying, a general two-root bound.
- **A6 is a maintained assumption, not derived from more primitive
  economic content.** Section 4.5 gives reasons to prefer the
  bounded-\(Z\) branch for this application, but neither branch is
  claimed to be the uniquely correct description of how far a detour's
  luck can plausibly run.
- **A7's first-order stochastic dominance formalizes a directional bias
  (pessimism) without pinning down its size or origin.** It says nothing
  about why a decision-maker would perceive \(\tilde F\) rather than the
  true \(F\); as with `model.md`'s original \(\rho\), the assumption is
  about the existence and direction of a wedge, not its psychological
  source.
- **Proposition 2's exact statement is given for \(\psi=\ell\) (concave
  instance).** Combining genuine transfer risk with the S-shaped
  \(\psi=\varphi\) of Section 5.4 is only partially worked out here
  (Proposition 4, Lemma 6 hold for either instance of \(\psi\)); the
  clean, single-inequality risk-aversion-discount result of Proposition 2
  relies on global concavity of \(EU\), which Section 5.4 shows can fail
  under \(\varphi\).
- **Proposition 4's uniqueness claim on \([e_0,B]\) needs the strict
  version of Lemma 5, which needs \(\beta H>0\) and \(P(Z>0)>0\).**
  These are mild conditions (no future value at all, or a detour that
  literally never transfers), but they are genuine additional hypotheses,
  not automatic consequences of A1–A4; without them only weak concavity
  is available, and the stationary set on \([e_0,B]\) could in principle
  be a connected interval rather than a single point.
- **Proposition 3's upper-corner case is vacuous whenever \(\theta<1\).**
  Because \(\mathrm{MC}(e)\to+\infty\) as \(e\to B^-\) under a strictly
  convex displacement cost, full exploration (\(e^*=B\)) is only ever
  reachable at \(\theta=1\); this is a real restriction on which corner
  behaviors the model can produce, not only a technical footnote about
  one-sided limits.
- **The super-lottery construction in Section 4.4 requires \(u\)'s range
  to be unbounded above and, as stated, defined on \(\mathbb{R}_{>0}\).**
  It also inherits the historiographic caveat flagged by the companion
  literature check: the general thesis that boundedness is close to
  *necessary* for guaranteed finiteness against every lottery is usually
  attributed to Menger (1934), but Peters (2011) has argued that Menger's
  original 1934 proof of that thesis contains a mathematical error. This
  memo's own construction (Section 4.4) is independently verified and
  does not rely on Menger's original proof; it only establishes
  sufficiency (an unbounded \(u\) can always be defeated by some
  lottery), which is all Section 4.5 uses, not the stronger and disputed
  necessity claim.
- **As in `model.md`, none of this is an empirical claim.** Every
  parameter used in Sections 6.1–6.3 is invented for illustration.
  Nothing here measures creativity, gives a recommended time quota, or
  claims that any real detour follows a particular probability
  distribution. The retained-productivity term \(\beta H(1-\delta)K\)
  remains additive and independent of \(e\) and \(Z\) throughout, so
  \(\delta\) still has no comparative-static effect on the optimal
  choice.
