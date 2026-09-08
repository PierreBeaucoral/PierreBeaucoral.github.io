#!/usr/bin/env python3
"""
Rebuild the self-hosted webfonts in static/fonts/.

Why this exists
---------------
The site previously pulled Newsreader + IBM Plex Sans/Mono from
fonts.googleapis.com: 331 KB of woff2 over a third-party origin, roughly
two-thirds of the homepage's total transfer weight. This script downloads the
same upstream faces and produces local files that are ~64% smaller, by:

  1. subsetting to the glyph repertoire the site actually uses (scanned from
     public/, content/, layouts/ and data/, plus a Latin-1 + typographic
     safety margin, so new French/English copy never hits a missing glyph);
  2. instancing the variable axes — pinning optical size, which is where most
     of Newsreader's bulk lives, while keeping weight as a *range* so headings,
     body text and <strong> all still render from a single file per style.

Run it after adding content in a new script (Greek, Cyrillic, maths symbols)
or after changing which font weights the stylesheet asks for.

    python3 tools/build-fonts.py

Requires: fonttools[woff] (pip install "fonttools[woff]").
"""

from __future__ import annotations

import html
import os
import re
import subprocess
import sys
import tempfile
import unicodedata
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "static" / "fonts"

# The exact Google Fonts request the site used before self-hosting. Keeping it
# here means the upstream sources stay traceable and re-fetchable.
GF_CSS = (
    "https://fonts.googleapis.com/css2"
    "?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;"
    "1,6..72,400;1,6..72,500"
    "&family=IBM+Plex+Mono:wght@400;500"
    "&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
)
# A modern-Chrome UA is required or Google serves legacy .ttf instead of .woff2.
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)

# (upstream face key, axis limits, output filename). A scalar limit pins the
# axis; a (min, max) tuple keeps it variable within that range.
JOBS = [
    ("Newsreader|normal",    {"wght": (400, 600), "opsz": 32}, "newsreader-var.woff2"),
    ("Newsreader|italic",    {"wght": (400, 600), "opsz": 32}, "newsreader-italic-var.woff2"),
    ("IBMPlexSans|normal",   {"wght": (400, 700)},             "plex-sans-var.woff2"),
    ("IBMPlexMono|normal|400", None,                           "plex-mono-400.woff2"),
    ("IBMPlexMono|normal|500", None,                           "plex-mono-500.woff2"),
]

# Scanned content gives the true repertoire; this base guarantees anything the
# site might plausibly gain later (French accents, typographic punctuation,
# arrows used in link labels) is already covered.
SAFETY_BASE = (
    set(chr(c) for c in range(0x20, 0x7F))          # ASCII
    | set(chr(c) for c in range(0xA0, 0x180))       # Latin-1 Supplement + Latin Extended-A
    | set(chr(c) for c in range(0x2B0, 0x300))      # spacing modifier letters
    # Combining diacritics: BibTeX imports and PDF-derived text often arrive
    # decomposed (e is followed by U+0301 rather than being a single é), and
    # dropping these would silently break accented author names.
    | set(chr(c) for c in range(0x300, 0x370))
    # Typographic spaces: French copy uses thin/narrow no-break spaces before
    # ; : ! ? and inside numbers, and they cost almost nothing to keep.
    | set(chr(c) for c in range(0x2000, 0x200C)) | {"\u202F"}
    | set("‘’“”‚„–—…•·°′″†‡§¶«»‹›€£¥⁄∕₂₀₁₃₄₅₆₇₈₉№™©®±×÷≈≤≥≠→←↑↓↗↘✓✗∙")
)
SCAN_DIRS = ("public", "content", "layouts", "data")
SCAN_EXTS = {".html", ".md", ".yaml", ".yml", ".toml", ".json"}
# Vendored Quarto/reveal.js course bundles ship their own fonts — their glyphs
# would inflate the subset for text these faces never render.
SCAN_SKIP = ("GPE_Graphiques_files", "/libs/")

# OpenType features worth keeping: kerning, ligatures, contextual alternates,
# mark positioning, tabular figures and fractions (used in tables and dates).
LAYOUT_FEATURES = "kern,liga,clig,calt,ccmp,locl,mark,mkmk,rlig,tnum,frac"


def collect_glyphs() -> str:
    """Return every character the site renders, plus the safety base."""
    found: set[str] = set()
    for name in SCAN_DIRS:
        root = ROOT / name
        if not root.exists():
            continue
        for path in root.rglob("*"):
            if path.suffix.lower() not in SCAN_EXTS:
                continue
            if any(skip in str(path) for skip in SCAN_SKIP):
                continue
            text = path.read_text(encoding="utf-8", errors="ignore")
            if path.suffix.lower() == ".html":
                text = re.sub(r"<script.*?</script>|<style.*?</style>", " ", text, flags=re.S)
                text = html.unescape(re.sub(r"<[^>]+>", " ", text))
            found |= set(text)
    found = {c for c in found if not unicodedata.category(c).startswith("C")}
    print(f"  scanned repertoire: {len(found)} chars; with safety base: "
          f"{len(found | SAFETY_BASE)}")
    return "".join(sorted(found | SAFETY_BASE))


def fetch_sources(workdir: Path) -> dict[str, Path]:
    """Download one woff2 per distinct upstream file, keyed family|style[|weight].

    Google serves a single variable file for several declared weights, so the
    URL is the natural deduplication key. Only the `latin` subset is taken —
    the site has no Cyrillic, Greek or Vietnamese content.
    """
    req = urllib.request.Request(GF_CSS, headers={"User-Agent": UA})
    css = urllib.request.urlopen(req, timeout=60).read().decode("utf-8")

    by_url: dict[str, list[tuple[str, str, str]]] = {}
    for block in re.findall(r"@font-face\s*\{(.*?)\}", css, re.S):
        urange = re.search(r"unicode-range:\s*([^;]+);", block)
        if not urange or "U+0000-00FF" not in urange.group(1):
            continue  # non-latin subsets
        family = re.search(r"font-family:\s*'([^']+)'", block).group(1).replace(" ", "")
        style = re.search(r"font-style:\s*(\S+);", block).group(1)
        weight = re.search(r"font-weight:\s*([^;]+);", block).group(1).strip()
        url = re.search(r"url\((https://[^)]+)\)", block).group(1)
        by_url.setdefault(url, []).append((family, style, weight))

    sources: dict[str, Path] = {}
    for url, faces in by_url.items():
        family, style, weight = faces[0]
        # Static faces (one weight per file) need the weight in the key to stay
        # distinct; variable files cover several weights and do not.
        key = f"{family}|{style}" if len(faces) > 1 else f"{family}|{style}|{weight}"
        dest = workdir / f"{key.replace('|', '-')}.woff2"
        dest.write_bytes(urllib.request.urlopen(url, timeout=60).read())
        sources[key] = dest
    return sources


def build(src: Path, limits: dict | None, out: Path, glyph_file: Path) -> int:
    """Instance the variable axes, then subset, then re-compress to woff2."""
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer

    font = TTFont(src)
    if limits:
        font = instancer.instantiateVariableFont(font, limits, optimize=True)
    # pyftsubset reads from disk, and instancing has to happen first: subsetting
    # a variable font leaves the (large) axis deltas intact.
    tmp = Path(tempfile.mktemp(suffix=".ttf"))
    font.flavor = None
    font.save(tmp)
    subprocess.run(
        [sys.executable, "-m", "fontTools.subset", str(tmp),
         f"--text-file={glyph_file}", "--flavor=woff2",
         f"--layout-features={LAYOUT_FEATURES}",
         "--no-hinting", "--desubroutinize", f"--output-file={out}"],
        check=True,
    )
    tmp.unlink()
    return out.stat().st_size


def main() -> int:
    DEST.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmpdir:
        work = Path(tmpdir)
        glyph_file = work / "glyphs.txt"

        print("Collecting glyphs from site content...")
        glyph_file.write_text(collect_glyphs(), encoding="utf-8")

        print("Fetching upstream faces from Google Fonts...")
        sources = fetch_sources(work)

        print("Building...")
        before = after = 0
        for key, limits, name in JOBS:
            src = sources[key]
            size = build(src, limits, DEST / name, glyph_file)
            before += src.stat().st_size
            after += size
            print(f"  {name:<30} {src.stat().st_size/1024:6.1f} KB -> {size/1024:6.1f} KB")
        print(f"  {'TOTAL':<30} {before/1024:6.1f} KB -> {after/1024:6.1f} KB "
              f"(-{100 - after / before * 100:.0f}%)")

    print(f"\nWritten to {DEST.relative_to(ROOT)}/. "
          "Update the @font-face rules in static/css/site.css if filenames changed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
