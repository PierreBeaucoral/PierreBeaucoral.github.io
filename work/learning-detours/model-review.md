# Theory Review: `model.md`
**Date:** 2026-09-21  
**Reviewer:** theorist-critic  
**Scope:** `model.md`, `parameters.json`, `simulate.R`, and `check_model.py` (read-only review)

## Phase 1: Claim Identification

- **Object type:** finite-horizon constrained optimization and comparative statics; no identification, estimator, sampling, or inferential claim.
- **Target parameter:** the unique optimal exploration time (e^*(P)) in the deterministic toy model; here it is the argmax of (U(e)) over (ein[0,B]), not a population parameter.
- **Estimator:** none. The numerical routines evaluate the closed-form optimizer and compare it with numerical maximization.
- **Main result:** Proposition 1 states verbatim: “Under (K,w>0), (B\geq0), (H\geq0), (\beta\in[0,1]), (\eta\geq0), (\tau>0), and (\delta\in[0,1]), the unique optimal choice is

  \[
  e^*=\operatorname{clip}\!\left(
  \frac{\beta H\eta}{wK}-\tau;\,0,B
  \right).
  \]”
- **Assumptions:** (A1) (e\in[0,B]), with (B\geq0): finite time block and nonnegative exploration; (A2) (K,w>0): positive current productivity and opportunity-cost weight; (A3) (H\geq0): fixed future research hours; (A4) (\beta\in[0,1]): discount factor; (A5) (\eta\geq0), (\tau>0): nonnegative learning scale and dimensionless logarithm argument; (A6) (\delta\in[0,1]): exogenous depreciation of the retained baseline.
- **Data structure:** deterministic two-period accounting model; no iid, panel, clustered, or triangular-array data.
- **Paper type:** appropriate for a personal blog and an illustrative Beamer deck. It is explicitly presented as a toy model, with no empirical or structural interpretation.

## Phase 2: Proof Validity

**Assessment:** VALID. No unresolved critical or major proof error found.

The derivatives in (4) are correct. When (\beta H\eta>0), strict concavity gives uniqueness; when (\beta H\eta=0), the objective is strictly decreasing because (wK>0), also giving a unique maximizer. The root in (5), clipping rule (2), and the three mutually exclusive (B>0) conditions in (3) follow from the derivative signs. The (B=0) singleton case is handled explicitly.

The units are internally consistent: (\tau) has hours, (K) and (\eta) have productivity-per-hour units, and both terms in (1) have productivity-hours units. The (\delta) term is additive and independent of (e), so the stated absence of a (\delta) comparative static is correct.

Independent checks passed:

- `python3 work/learning-detours/check_model.py`: Python grid search agrees with the reported R values (e^*=10,3.5,0) for (w=0.3,1,5), respectively.
- A separate 100-draw numerical check over positive parameter values found no violation of the closed-form optimum.
- The current `simulate.R` uses explicit `parameters$...` references in the optimizer and objective, so the earlier potential for a function argument `w` to be shadowed by `with(parameters, ...)` is not present in the reviewed version.

## Phase 3: Assumptions and Statements

### Issues Found: 1

##### Issue 3.1: Keep the meaning of (K) identical across the model and prose
- **Location:** `model.md:16–19, 26, 31`; linked blog prose currently describes (K) as a “stock of accumulated research capital.”
- **Severity:** MINOR (cross-document linkage; no mathematical defect).
- **Problem:** In the model, (K) is defined as current research productivity and is reused as the retained future baseline ((1-\delta)K). Calling it a stock of accumulated capital suggests a different state variable and makes the (\partial e^*/\partial K) interpretation ambiguous. The model itself is coherent, and this is a deliberate simplification, but the public prose should use the same object.
- **Requested correction:** Describe (K) consistently as a productivity level (or explicitly state that the same productivity level is used for the current and retained baseline). Keep the limitation that this is a normalization/simplification rather than an endogenous capital-stock model.

The use of the same (K) in current and future production is restrictive but transparent and acceptable for the stated illustration. The model already states that creativity is not measured, that no minimum exploration quota is imposed, and that (\delta) does not affect the optimum under this specification; these are appropriate limits rather than defects.

## Phase 4: Citations, Linkage, Polish

### Issues Found: 0

No external theorem or citation is invoked. The numerical outputs are aligned with the model and parameter file. The Python checker is appropriately labeled as an independent numerical check rather than a substitute for the proof.

## Summary

- **Overall assessment:** MINOR ISSUES (mathematically sound; one prose/model notation alignment correction).
- **Score:** 97 / 100
- **Critical issues (must fix):** 0
- **Major issues (should fix):** 0
- **Minor issues (consider):** 1

## Priority Recommendations

1. **[MINOR]** Align the blog/deck interpretation of (K) with `model.md`: it is a productivity level in this specification, not an endogenous accumulated-capital stock.
2. **[POSITIVE]** Retain the explicit caveat that the model gives no personal time quota, empirical estimate, or creativity measure; the corner solutions and the (\delta)-invariance are correctly exposed.

## Positive Findings

The proof is short but complete, including degeneracies, boundary equalities, and the singleton (B=0) case. The dimensional analysis is unusually clear for an illustrative model. The analytical solution, R implementation, generated checks, and independent Python grid search agree on both interior and corner examples.
