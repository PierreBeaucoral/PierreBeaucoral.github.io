#!/usr/bin/env python3
"""Independent check of the Section 6.3 table in theory-ct-lt.md.

Standard library only; run it directly. One cell of that table was wrong on the
first draft, so the numbers in the memo are verified from the closed forms here
rather than by hand. No dependency on the R build.
"""

B, K, w, beta, H, eta, tau, theta, p = 12, 1, 1, .9, 8, 6, 3, .6, 4


def marginal_benefit(e):
    """Discounted marginal future value of exploration, psi = phi, Z = 1."""
    x = e / tau
    return beta * H * (eta / tau) * p * x ** (p - 1) / (1 + x ** p) ** 2


def marginal_cost(e):
    """Marginal current-research progress forgone, R(e) = wK(B-e)^theta."""
    return w * K * theta * (B - e) ** (theta - 1)


def gap(e):
    return marginal_benefit(e) - marginal_cost(e)


def crossing(lo, hi, rising):
    """Bisect a sign change; `rising` selects an upward crossing of zero."""
    for _ in range(80):
        mid = (lo + hi) / 2
        if (gap(mid) < 0) if rising else (gap(mid) > 0):
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def main():
    expected = {0: -0.222, 0.5: 0.040, 1: 1.852, 2: 11.66, 2.64: 15.09, 4: 7.63,
                6: 1.30, 8: 0.066, 8.2: 0.0126, 8.3: -0.0120, 9: -0.155, 10: -0.317}
    for e, memo in expected.items():
        assert abs(gap(e) - memo) < 5e-3, f"e={e}: {gap(e):+.4f} vs memo {memo:+.4f}"
        print(f"e={e:<5} gap={gap(e):+.4f}  memo {memo:+.4f}  ok")
    e1, e2 = crossing(.1, 1., True), crossing(8.2, 8.4, False)
    assert abs(e1 - 0.47) < 5e-3 and abs(e2 - 8.25) < 5e-3
    print(f"upward crossing (local minimum)  e1 = {e1:.4f}")
    print(f"downward crossing (local maximum) e2 = {e2:.4f}")
    print("Section 6.3 reproduces.")


if __name__ == "__main__":
    main()
