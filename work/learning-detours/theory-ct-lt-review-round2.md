# Theory Critic Report — Round 2 — `theory-ct-lt.md` / `theory-ct-lt-integration.md`

**Date:** 2026-09-21
**Reviewer:** theorist-critic (read-only; report saved by the orchestrating session)
**Severity:** HIGH (re-review of a previously blocked artifact)
**Prior score:** 52/100 (Blocked)
**New score: 97 / 100 — clears the 80 gate**

Files re-read in full: `theory-ct-lt.md` (893 lines), `theory-ct-lt-integration.md` (244 lines),
cross-checked against `theory-ct-lt-review.md` and `check_theory_63.py`.

## Bottom line

All seven MAJOR and all six MINOR findings from round 1 were independently re-verified against the
revised text. Every one is genuinely fixed with valid mathematics — none cosmetic-only, none patched
in a way that introduces a new gap. No new errors found anywhere in the revised sections.
Recommendation: advance the artifact.

## Item-by-item verification

**1. §6.3 table and crossing location — fixed, verified.** The table now reads `+0.013` at e=8.2 and
`−0.012` at e=8.3, matching `check_theory_63.py` (`+0.0126`, `−0.0120`) to rounding. Independently
recomputed `R(0)=12^{0.6}≈4.442`, `R(8.2)=3.8^{0.6}≈2.228`, `φ(8.2)≈5.894`, `EU(0)=10.92`,
`EU(8.2)=51.15` — all match. The prose now brackets the crossing between 8.2 and 8.3 and gives
`e₂≈8.25` by bisection (script: 8.2505; `e₁`: 0.4731), rather than treating 8.2 as the crossing. The
correction is narrated in line with the corrected MB/MC values.

**2. §4.4 Peters (2011) caveat — fixed, correctly scoped.** The caveat appears in §4.4 and again in
§7. The "close to necessary" language is now explicitly confined to the disputed direction, with the
memo stating it needs and claims only sufficiency. The memo's own super-lottery construction proves
sufficiency alone, and the text says so.

**3. Strict-concavity Lemma 5 — fixed, mixture argument valid.** Re-derived: for z>0,
`x''(e,z)=R''(e)+βHzφ''(e)` with `R''≤0` weakly and `φ''<0` strictly, so `x(·,z)` is strictly concave
under `βH>0`. The composition step is valid even when u is exactly affine, because strict monotonicity
of u turns the strict argument inequality into a strict value inequality before u's own weak concavity
is applied — which matters, since A5 assumes only weak concavity. Integrating a pointwise strict
inequality over a set of positive measure preserves strictness, so mixing the weak `z=0` branch with
the strict `z>0` branch gives strict concavity overall. The `βH=0` exclusion is separately and
correctly justified. Proposition 4 restates its conditions (`βH>0`, `P(Z>0)>0`) where the result is
used, not only where it is proved — the exact round-1 gap.

**4. One-sided limit at e=B for θ<1 — fixed, verified.** The convention
`EU'(B):=lim_{e→B⁻}EU'(e)` is stated before Proposition 3. The divergence proof is rigorous:
`MC(e)→+∞`; `MB(e)` stays bounded (ℓ′ bounded on [0,B], `Ẑ(e)≤E[Z]≤z̄` under A6(i)); and
`E[u'(x(e,Z))]` is bounded away from zero because `x(e,z)` ranges over a compact set and u′ is
continuous and strictly positive there, so it attains a positive minimum. The upper corner is now
excluded by a limit argument rather than by evaluating an ill-defined derivative.

**5. Menger construction reindexing — fixed, verified.** The proof starts at `k₀` with `2^{k₀}`
above the infimum of u's range, so `y_k=u^{-1}(2^k)` is well defined by IVT for every summed k. The
reindexing `j=k−k₀+1` gives a valid distribution, and each term contributes the constant `2^{k₀−1}`,
so the sum diverges. Verified by direct algebra.

**6. Corollary 1's inlined proof — fixed, self-contained, re-derived.** No proof now defers to an
external document (two remaining "earlier draft" mentions are historical asides, not deferrals).
Re-derived: with u linear, `Ũ(e)=x_F(e)+π̃[x_S(e)−x_F(e)]=R(e)+βH(1−δ)K+π̃βHψ(e)`, which at θ=1,
ψ=ℓ is term-for-term `model.md`'s `U_ρ(e)` with `ρ=π̃`, `A=η`.

**7. §7 Limitations and §0's fifth ASSUMED flag — consistent with what was found.** §0 item 5 flags
the strict-versus-weak concavity convention and the `P(Z>0)>0` requirement. §7 adds bullets for the
Lemma 5 / Prop 4 conditions, the θ<1 vacuous upper corner, and the Peters dispute with the
sufficiency-only scope. Items that were outright bugs and are now fixed are correctly not re-listed
as standing limitations.

## MINOR fixes — all landed, no new errors

- Notation table split into logically grouped rows.
- "×(positive factor)" replaced with real numbers: `βHℓ'(1.7)=9×0.5/2.7≈1.667`, `π(1−π)=0.24`,
  `u'(21.320)−u'(16.85)=−0.0447`, product `≈−0.0179` — recomputed, matches exactly.
- Proposition 2's cross-reference now proves the ψ=ℓ case via Lemma 2 directly and notes that the
  S-shaped instance of §5.4 is a different object.
- ℓ(e)'s shift from certain gain to gamble ceiling now stated in prose in §1.
- Proposition 5's strictness phrased as "on a set of z of positive measure".
- Proposition 2's implicit `η>0 ⟹ ψ(e_lin)>0` step closed by an added parenthetical.

## Integration memo consistency

The new "citation weight: memo versus post" section accurately reflects what is in the revised memo,
and its recommendation to keep Peters/Menger/St Petersburg out of `index.md` beyond one optional
intuitive sentence is consistent with its Section 1 recommendations. §0's seven-item changelog maps
one-for-one onto the round-1 findings. No overclaiming found.

## Deduction table

| Severity | Issue | Status |
|---|---|---|
| — | All 7 round-1 MAJOR findings | Verified fixed, no deduction |
| — | All 6 round-1 MINOR findings | Verified fixed, no deduction |
| — | New errors introduced by fixes | None found |

Three points withheld for residual stylistic informality (narrative "earlier draft" asides; leaning
on "commonly associated with Menger (1934)" phrasing rather than a fully self-contained historical
statement). Cosmetic, not rubric-blocking, not proof-relevant.

## Verdict

**97/100. Clears the 80 gate.** The architecture was already sound in round 1; this round closes
every rigour and disclosure gap with no regressions. Advance.
