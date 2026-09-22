# A compact model of useful digressions

**Scope.** This file is the special case, kept because the blog post's closed forms and every named equation are extracted from it. The canonical model is `theory-ct-lt.md`, which treats a detour as a gamble and recovers everything below exactly as its Corollary 2, under three simultaneous restrictions: risk neutrality, a transfer that is certain to happen, and a linear cost of delay (\(\theta=1\)). Read that memo before changing anything here.

This is an illustrative two-period model for a personal blog post and a Beamer deck. It formalizes one tension: after required teaching is done, time spent learning something transferable can improve future research, but it displaces research progress today. The model is a transparent accounting device. It is not an empirical claim, a structural model of an academic career, or a recommendation that a fixed share of time should be spent exploring.

## Setup

There is no uncertainty in the benchmark: “expected” learning is deterministic. In period 0, an individual has a block of \(B\geq 0\) hours left after obligatory teaching. They choose

\[
e\in[0,B],
\]

where \(e\) is time spent on useful exploratory learning. It can include building a small pedagogical tool, reading outside the immediate project, or learning a method that may travel to future work. It excludes the hours already required for teaching. The remaining \(B-e\) hours are current research. Let

\[
K>0,\qquad w>0,\qquad H\geq 0,\qquad \beta\in[0,1],
\]

denote, respectively, current research productivity, the relative urgency attached to current research, fixed future research hours, and the discount factor. Take \(B,e,H,\tau\) in hours; \(K\) and \(\eta\) in productivity per research hour; and \(w,\beta,\delta\) dimensionless. Learning raises future research productivity by

\[
\ell(e)=\eta\ln\!\left(1+\frac{e}{\tau}\right),
\qquad \eta\geq 0,\quad \tau>0.
\]

The scale parameter \(\tau\) is measured in hours and makes the logarithm dimensionless. The parameter \(\eta\) has the same productivity units as \(K\). Let \(\delta\in[0,1]\) be the fraction of current productivity that does not carry over to the next period. Future research hours \(H\) are held fixed; exploration does not create additional future hours in this benchmark.

The individual's payoff is

\[
U(e)=wK(B-e)+\beta H\left[(1-\delta)K+\eta\ln\!\left(1+\frac{e}{\tau}\right)\right].
\tag{1}
\]

The first term values current research progress. The second values future research output from the productivity retained from today and from transferable learning. The model treats progress as hours multiplied by productivity; it does not model whether a particular project is completed.

## Optimal allocation

Define the clipping operator

\[
\operatorname{clip}(x;0,B)=\min\{B,\max\{0,x\}\}.
\]

### Proposition 1 (optimal exploration)

Under \(K,w>0\), \(B\geq0\), \(H\geq0\), \(\beta\in[0,1]\), \(\eta\geq0\), \(\tau>0\), and \(\delta\in[0,1]\), the unique optimal choice is

\[
e^*
=\operatorname{clip}\!\left(
\frac{\beta H\eta}{wK}-\tau;\,0,B
\right).
\tag{2}
\]

This expression also covers the degeneracies \(\beta H\eta=0\) and \(B=0\): in either case \(e^*=0\). If \(B>0\), the corner and interior conditions are

\[
\begin{array}{rcl}
e^*=0 &\Longleftrightarrow& \beta H\eta\leq wK\tau,\\[2mm]
0<e^*<B &\Longleftrightarrow& wK\tau<\beta H\eta<wK(\tau+B),\\[2mm]
e^*=B &\Longleftrightarrow& \beta H\eta\geq wK(\tau+B).
\end{array}
\tag{3}
\]

At equality, the corresponding adjacent expressions agree, so the optimizer is still unique.

### Proof

The proof has three steps. First, establish concavity. Second, solve the interior first-order condition. Third, impose the time constraint.

**Step 1 (concavity).** For \(e\in[0,B]\),

\[
U^{\prime}(e)=-wK+\frac{\beta H\eta}{\tau+e},
\qquad
U^{\prime\prime}(e)=-\frac{\beta H\eta}{(\tau+e)^2}\leq0.
\tag{4}
\]

Thus \(U\) is concave. If \(\beta H\eta>0\), it is strictly concave, because \(\tau+e>0\); hence any maximizer is unique. If \(\beta H\eta=0\), then \(U^{\prime}(e)=-wK<0\), so \(U\) is strictly decreasing and its unique maximizer is \(e=0\). This includes \(\beta=0\), \(H=0\), and \(\eta=0\).

**Step 2 (interior condition).** When \(\beta H\eta>0\), an interior maximizer satisfies \(U^{\prime}(e)=0\). Solving (4) gives

\[
e^{\mathrm u}=\frac{\beta H\eta}{wK}-\tau.
\tag{5}
\]

Since \(U^{\prime}\) is weakly decreasing, \(U^{\prime}\) is positive below \(e^{\mathrm u}\) and negative above it. Therefore the constrained maximizer is the unconstrained root whenever it lies in \((0,B)\), the lower endpoint when the root is below 0, and the upper endpoint when it is above \(B\). This is exactly (2). The same formula gives \(e^*=0\) in the degenerate case because \(e^{\mathrm u}=-\tau\).

**Step 3 (corner inequalities).** For \(B>0\), \(e^*=0\) precisely when \(U^{\prime}(0)\leq0\), which is \(\beta H\eta\leq wK\tau\). An interior solution requires \(U^{\prime}(0)>0\) and \(U^{\prime}(B)<0\), giving \(wK\tau<\beta H\eta<wK(\tau+B)\). Finally, \(e^*=B\) precisely when \(U^{\prime}(B)\geq0\), giving \(\beta H\eta\geq wK(\tau+B)\). Concavity makes these conditions sufficient as well as necessary. If \(B=0\), the feasible set contains only \(e=0\). \(\square\)

The retained term \(\beta H(1-\delta)K\) is constant in \(e\). Consequently, \(\delta\) changes the level of payoff but cannot affect the optimal exploration choice in this specification. A claim that depreciation changes \(e^*\) would require a different model—for example, one in which exploration also changes retention, future hours, or the marginal value of future productivity.

## Comparative statics

On the interior region in (3), differentiation of (2) gives

\[
\frac{\partial e^*}{\partial H}=\frac{\beta\eta}{wK},\quad
\frac{\partial e^*}{\partial \beta}=\frac{H\eta}{wK},\quad
\frac{\partial e^*}{\partial \eta}=\frac{\beta H}{wK},
\tag{6}
\]

\[
\frac{\partial e^*}{\partial w}=-\frac{\beta H\eta}{w^2K},\quad
\frac{\partial e^*}{\partial K}=-\frac{\beta H\eta}{wK^2},\quad
\frac{\partial e^*}{\partial \tau}=-1.
\tag{7}
\]

Thus more fixed future research capacity, a greater weight on the future, or more effective transferable learning increases exploration while the solution is interior. Greater urgency for current research or greater current productivity increases the opportunity cost of exploration. A larger \(\tau\) means that more hours are needed to obtain the same initial learning gain. The derivatives are local: once a corner is reached, the clipping operator makes the response flat in the relevant direction, except that the full-exploration choice moves one-for-one with \(B\).

There is no comparative-static effect of \(\delta\) because the retained baseline is additive and independent of \(e\). There is also no claim that exploration is intrinsically pleasurable: optional enjoyment, curiosity, exhaustion, and intrinsic motivation are outside (1). They could be added as a separate term, but doing so would change the object being illustrated.

## Three numerical illustrations

Take

\[
B=10,\quad K=1,\quad \beta=0.9,\quad H=10,\quad
\eta=0.5,\quad \tau=1,\quad \delta=0.05.
\]

Then \(\beta H\eta=4.5\), and only \(w\) varies. The unconstrained choice is \(e^{\mathrm u}=4.5/w-1\).

\[
\begin{array}{c|c|c|c}
\text{relative urgency} & w & e^{\mathrm u} & e^*\\ \hline
\text{high} & 5 & -0.1 & 0 \quad(\text{lower corner})\\
\text{medium} & 1 & 3.5 & 3.5 \quad(\text{interior})\\
\text{low} & 0.3 & 14 & 10 \quad(\text{full exploration})
\end{array}
\]

The examples are chosen to make the three regions visible, not to calibrate anyone's time allocation. They illustrate how the same person can rationally choose different amounts of exploration when the urgency attached to current research changes.

## Fit and limits of the illustration

The model fits the intended idea when the question is narrowly framed as an allocation problem: after required teaching, how much of a finite block should be devoted to learning that may transfer to future research? Its useful feature is the diminishing-return log term, which permits zero, interior, and full-exploration choices with one transparent threshold.

Several boundaries are deliberate. Future research hours \(H\) are held fixed, so the model does not say that exploration creates more time later. The learning gain is deterministic and transferable; it does not represent uncertainty about whether a detour will pay off. Current research hours \(B-e\) proxy progress, not project completion, publication, or career success. Creativity is not measured. The model includes useful pedagogical building outside obligatory teaching, but it does not value teaching quality separately. It makes no empirical claim and gives no recommended percentage of time. Its role is to make the opportunity-cost logic legible before a discussion of personal practice.

The minimal repair needed for this purpose is therefore only to hold \(H\) fixed and to state explicitly what \(e\) contains. A richer model could endogenise future time, distinguish several projects, add uncertainty or completion probabilities, or include intrinsic pleasure. Those additions would be appropriate for other questions, but they would obscure the compact illustration here.

## Extension: what if useful exploration is undervalued?

This is a conditional extension, not evidence that the author undervalues learning.
Keep the baseline time constraint, current production, and fixed future hours.
Let \(L(e)=\ln(1+e/\tau)\). Split future outcomes into

\[
N(e)=H[(1-\delta)K+\eta_N L(e)],
\qquad Q(e)=H\eta_Q L(e),
\]
where \(\eta_N=\eta\geq0\) is the baseline quantity/progress channel and
\(\eta_Q\geq0\) is an additional, distinct quality-improvement channel.
\(N\) is a normalised volume/progress index, not a publication count.
\(Q\) is an aggregate quality-related contribution above a fixed baseline,
not average quality per paper. Its zero baseline is a normalisation.
The assumed gain could represent better design or validation, while the
quantity channel could represent time saved on execution. Do not count the
same improvement twice. This additive representation deliberately does not
claim to estimate the product of paper counts and average paper quality.

Let \(\lambda\geq0\) convert the quality index into the same value units as
research progress. The fully valued objective is

\[
U_F(e)=wK(B-e)+\beta[N(e)+\lambda Q(e)].
\]

Writing \(A=\eta_N+\lambda\eta_Q\), this is the original problem with learning
coefficient \(A\). The quality valuation is explicitly a modelling choice;
it is not an objective ranking of scientific worth.

Now suppose the decision-maker recognises only \(\rho\in[0,1]\) of the
incremental future benefits, with the same horizon and discount factor:

\[
U_\rho(e)=wK(B-e)+\beta H[(1-\delta)K+\rho A L(e)].
\]

This is a belief/recognition wedge, not an additional preference for present
work. The extension assumes the fuller coefficient \(A\) is the correct one
for evaluating outcomes. It does not infer that assumption from behaviour.

### Choices and proof

\[
e_\rho=\operatorname{clip}\left(\frac{\beta H\rho A}{wK}-\tau;0,B\right),
\qquad
e_F=\operatorname{clip}\left(\frac{\beta HA}{wK}-\tau;0,B\right).
\]

The original concavity proof applies with coefficients \(\rho A\) and \(A\).
Because clipping is nondecreasing and \(0\leq\rho\leq1\),
\(e_\rho\leq e_F\). The inequality can be an equality at either corner
or with no valuable future learning. If both choices are interior,

\[
e_F-e_\rho=(1-\rho)\frac{\beta HA}{wK}.
\]

Since \(e_F\) maximises \(U_F\), \(U_F(e_F)\geq U_F(e_\rho)\).
The inequality is strict whenever the choices differ, by uniqueness of
the maximiser. This is an implication of the assumed fuller objective,
not an empirical welfare finding.

Moreover,

\[
N^{\prime}(e)=\frac{H\eta_N}{\tau+e}\geq0,\qquad
Q^{\prime}(e)=\frac{H\eta_Q}{\tau+e}\geq0.
\]

Thus, if \(e_F>e_\rho\), future quantity rises strictly when \(H\eta_N>0\),
and quality contribution rises strictly when \(H\eta_Q>0\). Current weighted
progress falls by \(wK(e_F-e_\rho)\). These separate outcomes prevent a
claim that all research improves immediately or that the trade-off disappears.

### Shared numerical illustration

Keep the baseline parameters and add \(\eta_Q=0.25\), \(\lambda=1\), and
\(\rho=2/3\). Then \(A=0.75\), while \(\rho A=0.5\), the original baseline
coefficient. Consequently, \(e_\rho=3.5\) and \(e_F=5.75\) hours.
The original 3.5-hour choice is now one possible perceived optimum under
these extra assumptions; it was not retrospectively shown to be biased.
The R-generated extension-checks.csv gives current progress, future volume,
future quality contribution and the full objective for both choices.
Python independently checks these quantities.

No uncertainty, dynamic learning about returns, or quality-versus-quantity
substitution is introduced. Positive effects on both future indices are
assumed in the production functions. Different assumptions could weaken
or remove the argument for more exploration. The extension's question is
whether the assessment of a detour omits plausible benefits, not whether
all detours deserve more time.
