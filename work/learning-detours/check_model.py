#!/usr/bin/env python3
"""Independently check the R optimum using a standard-library grid search."""
import csv
import json
import math
from pathlib import Path


def check_gamble(root, p, grid):
    """Recheck the CT/LT crossings by maximising the objective, not its derivative.

    R finds the crossings with a root-finder on MB - MC; here the same points are
    recovered as dense-grid maxima of the objective itself, so a sign or algebra
    slip in either implementation shows up as a disagreement.
    """
    with (root / "ct-lt-checks.csv").open() as stream:
        expected = {row["quantity"]: float(row["value"]) for row in csv.DictReader(stream)}
    tolerance = p["B"] / (len(grid) - 1) + 1e-9
    transfer = lambda e: p["eta"] * math.log1p(e / p["tau"])
    utility = lambda x: x - p["u_curvature"] * x * x
    retained = p["beta"] * p["H"] * (1 - p["delta"]) * p["K"]

    # Rising cost of delay: current value is concave, and w is rescaled so the
    # first hour still costs wK exactly (theory-ct-lt.md, Lemma 1).
    curved = lambda e: (p["w"] * p["K"] * p["B"] / p["theta"]
                        * ((p["B"] - e) / p["B"]) ** p["theta"])
    linear = lambda e: p["w"] * p["K"] * (p["B"] - e)

    def expected_utility(e, prob, value, scale=None):
        transferred = transfer(e) if scale is None else scale * math.log1p(e / p["tau"])
        success = utility(value(e) + retained + p["beta"] * p["H"] * transferred)
        failure = utility(value(e) + retained)
        return prob * success + (1 - prob) * failure

    def argmax(objective):
        return grid[max(range(len(grid)), key=lambda i: objective(grid[i]))]

    # A degenerate bet (transfer certain) is the "if the payoff were sure" curve.
    # The full payoff scale counts quality as well; rho and pi_tilde/pi are the
    # same two-thirds, so the pessimist's curve is the one the post shades under.
    full_scale = p["eta"] + p["quality_weight"] * p["quality_eta"]
    ladder = [("crossing_pessimist", p["eta"], p["pi_tilde"]),
              ("crossing_risk_adjusted", p["eta"], p["pi"]),
              ("crossing_with_quality", full_scale, p["pi"]),
              ("crossing_certain", p["eta"], 1.0)]
    for name, scale, prob in ladder:
        estimate = argmax(lambda e: expected_utility(e, prob, curved, scale))
        assert abs(estimate - expected[name]) <= tolerance, (name, estimate)
        print(f"{name}: Python grid={estimate:.4f} h; R root-finder agrees")
    assert (expected["crossing_pessimist"] < expected["crossing_risk_adjusted"]
            < expected["crossing_with_quality"] < expected["crossing_certain"])

    # The shaded band, by Simpson's rule on MB - MC rather than R's quadrature.
    def gap(e):
        success = 1 - 2 * p["u_curvature"] * (curved(e) + retained
                                              + p["beta"] * p["H"] * p["eta"] * math.log1p(e / p["tau"]))
        failure = 1 - 2 * p["u_curvature"] * (curved(e) + retained)
        luck = p["pi"] * success / (p["pi"] * success + (1 - p["pi"]) * failure)
        benefit = p["beta"] * p["H"] * p["eta"] / (p["tau"] + e) * luck
        cost = p["w"] * p["K"] * ((p["B"] - e) / p["B"]) ** (p["theta"] - 1)
        return benefit - cost

    lo, hi = expected["crossing_pessimist"], expected["crossing_risk_adjusted"]
    panels, width = 2000, (hi - lo) / 2000
    area = sum(width / 6 * (gap(lo + k * width) + 4 * gap(lo + (k + 0.5) * width)
                            + gap(lo + (k + 1) * width)) for k in range(panels))
    assert math.isclose(area, expected["surplus_lost"], rel_tol=1e-7)
    at_optimum = (curved(hi) + retained
                  + p["beta"] * p["H"] * p["pi"] * p["eta"] * math.log1p(hi / p["tau"]))
    assert math.isclose(area / at_optimum, expected["surplus_share"], rel_tol=1e-7)
    assert expected["surplus_share"] < 0.01
    print(f"surplus band: Python={area:.4f} progress units "
          f"({100 * expected['surplus_share']:.2f}% of the objective); R agrees")

    # The Section 6.1 chain, at theta = 1: e_perceived < 0.8 <= e_EU < 1.7 <= 3.5.
    risk_neutral = lambda e, prob: linear(e) + retained + p["beta"] * p["H"] * prob * transfer(e)
    for name, prob in [("e_det", 1.0), ("e_lin_pi", p["pi"]), ("e_lin_pi_tilde", p["pi_tilde"])]:
        estimate = argmax(lambda e: risk_neutral(e, prob))
        assert abs(estimate - expected[name]) <= tolerance, (name, estimate)
    assert expected["e_lin_pi_tilde"] < expected["e_lin_pi"] < expected["e_det"]

    # Caution moves the choice strictly left of each risk-neutral benchmark:
    # a centred difference of EU at the benchmark must be negative (Proposition 2).
    step = 1e-5
    for name, prob in [("eu_slope_at_e_lin_pi", p["pi"]),
                       ("eu_slope_at_e_lin_pi_tilde", p["pi_tilde"])]:
        e = expected[name.replace("eu_slope_at_", "")]
        slope = (expected_utility(e + step, prob, linear)
                 - expected_utility(e - step, prob, linear)) / (2 * step)
        assert slope < 0 and math.isclose(slope, expected[name], rel_tol=1e-6, abs_tol=1e-9)
        best = argmax(lambda x: expected_utility(x, prob, linear))
        assert best < e, (name, best, e)
    print("chain: e_perceived < {:g} <= e_EU < {:g} <= e_det = {:g}; Python and R agree"
          .format(expected["e_lin_pi_tilde"], expected["e_lin_pi"], expected["e_det"]))


def main():
    """Compare R results with a separately implemented dense-grid maximum."""
    root = Path(__file__).resolve().parent
    p = json.loads((root / "parameters.json").read_text())
    with (root / "checks.csv").open() as stream:
        rows = list(csv.DictReader(stream))
    steps = 100_000
    grid = [p["B"] * i / steps for i in range(steps + 1)]
    for row in rows:
        weight = float(row["w"])
        values = [weight * p["K"] * (p["B"] - e)
                  + p["beta"] * p["H"]
                  * ((1 - p["delta"]) * p["K"]
                     + p["eta"] * math.log(1 + e / p["tau"]))
                  for e in grid]
        best_index = max(range(len(grid)), key=values.__getitem__)
        estimate = grid[best_index]
        assert abs(estimate - float(row["analytic_hours"])) <= p["B"] / steps + 1e-9
        assert math.isclose(values[best_index], float(row["weighted_progress"]),
                            rel_tol=1e-8, abs_tol=1e-8)
        print(f"w={weight:g}: Python grid={estimate:g} h; R agrees")

    # Extension: independently optimise the perceived objective, then evaluate
    # each choice using the full quantity-plus-quality objective.
    with (root / "extension-checks.csv").open() as stream:
        extended_rows = list(csv.DictReader(stream))
    for row in extended_rows:
        rho = float(row["rho"])
        gain = p["eta"] + p["quality_weight"] * p["quality_eta"]
        values = [p["w"] * p["K"] * (p["B"] - e) + p["beta"] * p["H"]
                  * ((1 - p["delta"]) * p["K"] + rho * gain * math.log1p(e / p["tau"]))
                  for e in grid]
        estimate = grid[max(range(len(grid)), key=values.__getitem__)]
        assert abs(estimate - float(row["e"])) <= p["B"] / steps + 1e-9
        e = float(row["e"])
        quantity = p["H"] * ((1 - p["delta"]) * p["K"] + p["eta"] * math.log1p(e / p["tau"]))
        quality = p["H"] * p["quality_eta"] * math.log1p(e / p["tau"])
        current = p["w"] * p["K"] * (p["B"] - e)
        for key, value in [("future_quantity", quantity), ("future_quality_gain", quality),
                           ("current", current),
                           ("full_objective", current + p["beta"] * (quantity + p["quality_weight"] * quality))]:
            assert math.isclose(value, float(row[key]), rel_tol=1e-10, abs_tol=1e-10)
        print(f"rho={rho:.4f}: Python optimum={estimate:g} h; quantity/quality outcomes agree")

    check_gamble(root, p, grid)


if __name__ == "__main__":
    main()
