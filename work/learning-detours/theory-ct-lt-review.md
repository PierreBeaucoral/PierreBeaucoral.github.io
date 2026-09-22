# Theory Critic Report — `theory-ct-lt.md` and `theory-ct-lt-integration.md`

**Date:** 2026-09-21
**Reviewer:** theorist-critic (read-only; report saved by the orchestrating session)
**Severity:** HIGH
**Score: 52 / 100 — Blocked (below the 80 commit gate)**

**Files reviewed:** `theory-ct-lt.md` (733 lines), `theory-ct-lt-integration.md`, cross-checked
against `model.md` and `prior-art.md`.

## Bottom line

The core mathematical architecture is sound and could not be broken. Proposition 1
(existence), Lemma 4 (covariance/risk-aversion discount), Proposition 2, Proposition 3's
lower-corner logic, Lemma 6 (crossing diagnostic) and Proposition 5 (FSD) all check out on
line-by-line re-derivation. **Both recovery claims are genuine exact algebraic identities,
not analogies** — Corollary 1 and Corollary 2 were independently re-derived term by term and
match `model.md` exactly.

Blocking the score: one confirmed arithmetic error, a strict-versus-weak concavity gap in
Proposition 4, an unaddressed differentiability issue at the right corner for θ<1, a
construction gap in the Menger proof, a deferred proof, and — most importantly given the
companion prior-art check — Menger (1934) presented as settled without the Peters (2011)
caveat that `prior-art.md` explicitly flagged as a real pitfall. The Limitations section does
not disclose several of these.

## Phase 1: Proof validity

### Verified correct (independently re-derived)

- **Lemma 1** (MC increasing ⟺ R strictly concave): `R''(e)=wKθ(θ-1)(B-e)^{θ-2}`,
  `MC'(e)=wKθ(1-θ)(B-e)^{θ-2}` — matches exactly.
- **Lemma 2** (concavity preserved under expectation): standard, correct.
- **Lemma 3** (inflection of the S-shaped instance): `g''(x)=px^{p-2}(1+x^p)^{-3}[(p-1)-(p+1)x^p]`
  re-derived from scratch; `x_0=((p-1)/(p+1))^{1/p}` correct.
- **Eq. (2)** (the CT/LT first-order condition): factoring into `E[u'](MB-MC)` is correct algebra.
- **Lemma 4** (Chebyshev/association covariance argument): correctly applies the monotone-covariance
  inequality — Z nondecreasing, `u'(x(e,Z))` nonincreasing in Z because x is nondecreasing in Z and
  u' is nonincreasing under concave u. Valid.
- **Proposition 2**: the identity `EU'(e_lin) = βHψ'(e_lin)·Cov(Z,u'(x(e_lin,Z)))` matches; the
  "concave ⟹ maximizer at or before e_lin" step is standard and correctly applied.
- **Proposition 3**: the lower-corner argument — `x(0,Z)` is deterministic since `ψ(0)=0`, so
  `Ẑ(0)=E[Z]` exactly, cancelling `u'` from numerator and denominator — is a genuinely nice,
  correct derivation, and the strongest single result in the memo.
- **Lemma 6**: `EU''(e†)=E[u'(x(e†,Z))]·D̃'(e†)` at a zero of D̃ is correct.
- **Proposition 5** (FSD): the integration-by-parts derivation
  `EU(e)-Ũ(e)=∫[F̃(z)-F(z)]∂_z u(x(e,z))dz` matches sign by sign, and is honestly labelled
  standard rather than claimed as novel.

### MAJOR — Proposition 4's uniqueness claim outruns Lemma 5

Lemma 5 establishes only **weak** concavity of EU on `[e0,B]` (Lemma 2 preserves weak concavity
under expectation). Proposition 4 then asserts EU "has at most one stationary point in `[e0,B]`",
which requires **strict** concavity: a weakly concave function can be flat over an interval,
giving a continuum of stationary points. Very likely patchable — `φ''<0` strictly on `(e0,B)`
(Lemma 3) and R at worst affine give `E[Zφ''(e)]<0` strictly whenever `P(Z>0)>0` — but the
argument is not made in the text.
**Location:** lines 445–481.

### MAJOR — differentiability at `e=B` not established for θ<1

A2 restricts R's twice-differentiability to `[0,B)`, because `MC(e)=wKθ(B-e)^{θ-1}→+∞` as `e→B⁻`
when θ<1. Proposition 3 nonetheless treats `EU'(B)` as a well-defined finite object when
characterising the `e*=B` corner. Under the natural convention `MC(B):=lim_{e→B⁻}MC(e)=+∞`, the
upper corner becomes unreachable for θ<1 — which is what the §6.3 example implicitly does
(`D̃(12)=-∞`, θ=0.6) — but the proof does not state or justify the limiting argument.
**Location:** lines 409–432; cf. A2 at lines 103–107.

### MAJOR — Menger construction has an attainability gap

The proof asserts existence of `y_k=u^{-1}(2^k)` for every `k=1,2,3,…` via the intermediate value
theorem without establishing that `2^k` lies in the range of u for small k (if u's range is bounded
below above 2, `y_1` does not exist as stated). Fixable by starting at a sufficiently large `k₀` and
renormalising probabilities; that fix is not in the text.
**Location:** lines 284–297.

### MAJOR — Menger (1934) presented as settled; Peters (2011) not mentioned

`prior-art.md` §5 states: *"Peters, O. (2011) … shows Menger's 1934 argument contains a mathematical
error and that the stated conclusion does not follow as cleanly as usually presented … State it as
'Menger (1934) argued X; this has since been questioned (Peters 2011)', not as an uncontested
theorem."* The memo's §4.4 does the opposite, calling boundedness "close to necessary" on Menger's
authority. The memo's own construction is fine as mathematics (modulo the gap above), but it borrows
Menger's name and historical near-necessity claim without the caveat the companion check surfaced.
**Location:** lines 277–303; cf. `prior-art.md` lines 142–148.

*Positive note:* elsewhere the historical framing matches `prior-art.md`'s recommended narrow claims —
Bernoulli (log utility, classical game only) and Cramér (power utility) are credited separately, and
the memo never calls the baseline a bandit or learning-by-doing model. The gap is specifically
Menger/Peters.

### MAJOR — Corollary 1's proof is not self-contained

"the π=1, u linear case is immediate algebra, shown in full in the prior version of this memo"
(line 568) defers to a document not included in the deliverable. The algebra was independently
re-derived and is correct, but the proof as written is incomplete on its face.
**Location:** lines 565–568.

## Phase 2: The two recovery claims

**Corollary 2 — VERIFIED, exact identity.** With θ=1, Z≡1 a.s., u(x)=x, ψ=ℓ:
`EU(e) = wK(B-e) + βH(1-δ)K + βHη ln(1+e/τ)`, term for term identical to `model.md` eq. (1).

**Corollary 1 — VERIFIED, exact identity** (modulo the missing proof text). At θ=1, ψ=ℓ, π=1,
u linear: `Ũ(e) = wK(B-e) + βH[(1-δ)K + π̃·η ln(1+e/τ)]`, which reproduces `model.md`'s
`U_ρ(e)=wK(B-e)+βH[(1-δ)K+ρA L(e)]` with `A=η` and `ρ=π̃`.

**Conclusion:** the central "this is a replacement and `model.md` is recovered exactly" claim holds.
This is the memo's strongest asset.

## Phase 3: Notation and prior-art cross-check

**INV-7:** satisfied. `B,e,K,w,H,β,δ,τ,η,ℓ(e),ρ` all carry their original meanings; every new symbol
(`θ,R,MC,Z,F,F̃,ψ,φ,p,e0,u,EU,Ũ,Ẑ,MB,e_lin,e_EU,e_perceived`) is defined. Soft note: `ℓ(e)`'s formula
is byte-identical to `model.md` but its economic role shifts from "the certain gain" to "the ceiling
of a gamble that fires only when Z=1" — flagged in the table, deserves a prose sentence (MINOR).

**Against `prior-art.md`:** the Menger/Peters gap is the one real miss. The Ben-Porath,
learning-by-doing, bandit, present-bias and appropriability pitfalls do not appear in this memo.

## Phase 4: Worked numerical examples (Section 6)

**§6.1 (two-state case):** every number reproduces — `e_det=3.5`, `e_lin(π)=1.7`, `e_lin(π̃)=0.8`,
`x_F(1.7)=16.85`, `x_S(1.7)=21.320`, `u'(21.320)=0.7868`, `u'(16.85)=0.8315`, and the closed-form
two-state covariance identity. One MINOR blemish: "×(positive factor)" at line 638 is extraneous and
undefined; the sign conclusion is correct but the write-up is sloppy.

**§6.2 (St Petersburg check):** `E[ln Z]=2ln2≈1.386` (certainty equivalent 4) and `E[√Z]=√2+1≈2.414`
both correct.

**§6.3 (S-shaped case, θ=0.6, p=4):** `e0≈2.64` confirmed. Every cell of the `D̃` table reproduces
except one.

| e | memo | recomputed |
|---|---|---|
| 0 | −0.222 | −0.2221 ✓ |
| 0.5 | +0.040 | +0.0404 ✓ |
| 1 | +1.852 | +1.8520 ✓ |
| 2 | +11.66 | +11.662 ✓ |
| 2.64 | +15.09 | +15.096 ✓ |
| 4 | +7.63 | +7.627 ✓ |
| 6 | +1.30 | +1.301 ✓ |
| 8 | +0.066 | +0.0661 ✓ |
| **8.2** | **−0.019** | **+0.0127** ✗ |
| 9 | −0.155 | −0.1553 ✓ |
| 10 | −0.317 | −0.3170 ✓ |
| 12 | −∞ | −∞ ✓ |

**Confirmed arithmetic error at e=8.2.** `MB(8.2)=7.2·φ'(8.2)=0.36444` and
`MC(8.2)=0.6·(3.8)^{-0.4}=0.35177`, so `D̃(8.2)=+0.0127`, positive rather than −0.019. The true
downward crossing is bracketed at `e≈8.25` (`D̃(8.3)=−0.0120`). Verified independently three times
(critic, and twice by the orchestrating session).

This does not overturn the qualitative story: `EU(0)≈10.92` and `EU(8.2)≈51.15` both recompute
correctly, so "the global maximiser sits far past the misleading near-zero local minimum" stands.
The table cell and the stated crossing location need correcting.
**Location:** line 678.

## Limitations section versus what the proofs establish

§7's five bullets are honest and well calibrated for the big structural choices (A3's independence
of Z from e, the missing sharp stationary-point bound, A6 as maintained rather than derived, A7's
silence on the psychological origin, Prop 2's restriction to ψ=ℓ). It does **not** disclose the
strict-concavity gap, the boundary-differentiability gap, the Menger attainability gap, or the
Peters dispute. §0's four ASSUMED flags correctly cover the four structural judgment calls but miss
the weak-versus-strict concavity convention and the implicit `η>0 ⟹ ψ(e_lin)>0` step behind
Proposition 2's strictness claim.

## Integration memo: is its rewrite map defensible?

Largely yes. "Where would I stop? — rewrite" correctly cites what Proposition 2 proves. "Reframe ρ as
a probability wedge" is fully supported by the now-verified Corollary 1 identity. The recommendation
to keep the S-shaped/uniqueness material and the full St Petersburg apparatus out of the post is, if
anything, better justified than the integration memo knew — §6.3 is where the numeric error lives and
§4.4 is where the Menger/Peters gap lives. The parameter-file requirements track what the worked
examples actually use. No overclaiming found.

## Deduction table

| Severity | Issue | Location | Deduction |
|---|---|---|---|
| MAJOR | Prop 4's "at most one stationary point" needs strict concavity; only weak concavity proven | §5.4, 445–481 | −8 |
| MAJOR | Differentiability at `e=B` not established for θ<1; `EU'(B)` treated as well defined | §5.3, 409–432 | −8 |
| MAJOR | Menger construction: existence of `y_k=u^{-1}(2^k)` for all k≥1 unjustified | §4.4, 284–297 | −6 |
| MAJOR | Menger (1934) presented as settled; Peters (2011) omitted despite `prior-art.md` | §4.4, 277–303 | −10 |
| MAJOR | Corollary 1's proof defers algebra to an unattached document | §5.6, 565–568 | −6 |
| MAJOR | Arithmetic error: `D̃(8.2)` reported −0.019, recomputes to +0.0127 (crossing ≈8.25) | §6.3, 678 | −8 |
| MAJOR | Limitations omits the four gaps above | §7 | −6 |
| MINOR | Prop 2 cross-references "5.4 below", which covers φ rather than ℓ | 372 | −2 |
| MINOR | "×(positive factor)" extraneous in the numeric derivation | 638–639 | −2 |
| MINOR | Notation table bundles 8 symbols into one comma-separated row | 76 | −1 |
| MINOR | ℓ(e)'s semantic shift flagged only in the table, not in prose | §1 | −2 |
| MINOR | Prop 5's strictness phrased as "F̃≠F on the relevant range" rather than on a set of positive measure | 538–541 | −1 |
| MINOR | Prop 2's strict inequality implicitly needs `η>0 ⟹ ψ(e_lin)>0` | 373–377 | −2 |

Raw deductions total 62. The reviewer reported 52/100 rather than 38, overriding upward because no
MAJOR finding is a broken proof or a false central claim — both recovery corollaries hold exactly and
every core proposition re-derives — so the deductions reflect fixable rigour and disclosure gaps
rather than mathematical invalidity.

## Priority recommendations

1. Fix the §6.3 table: `D̃(8.2)=+0.0127`, crossing at ≈8.25. Re-check the whole table by script
   rather than by hand, given one cell was wrong.
2. Add the Peters (2011) caveat to §4.4, or state explicitly that the memo's own construction stands
   independent of any dispute about Menger's original proof.
3. Patch Proposition 4's strict-concavity gap, or restate the claim as "at most one connected set of
   stationary points".
4. Address the θ<1 boundary-differentiability issue in Proposition 3 via an explicit one-sided limit.
5. Make Corollary 1's proof self-contained.
6. Update §7 to disclose items 1–4, and add an ASSUMED flag in §0 for the weak-versus-strict
   concavity convention.
7. Minor cross-reference and wording fixes.

Items 1 and 2 are the two a referee or a careful reader of the prior-art check would catch
immediately; the memo should not be treated as blog-ready until they are fixed.
