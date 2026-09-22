#!/usr/bin/env python3
"""Render the canonical model's display equations to native HTML MathML."""
from pathlib import Path
import re
import subprocess
import hashlib


def main():
    """Extract display equations in documented order and render without JS."""
    model = Path(__file__).resolve().parent
    destination = model.parent.parent / "content/post/time-to-learn/equations"
    destination.mkdir(parents=True, exist_ok=True)
    expressions = re.findall(r"\\\[(.*?)\\\]", (model / "model.md").read_text(), re.S)
    names = ["budget", "domains", "learning", "objective", "clip", "optimum",
             "corners", "derivatives", "unconstrained", "future-statics",
             "current-statics", "baseline", "scenarios", "outcomes",
             "full-objective", "perceived-objective", "two-choices", "gap",
             "outcome-derivatives"]
    if len(expressions) != len(names):
        raise ValueError("Canonical equations changed; review the named extraction map")
    for name, expression in zip(names, expressions):
        expression = re.sub(r"\\tag\{[^}]*\}", "", expression).strip()
        rendered = subprocess.run(
            ["pandoc", "--from=markdown+tex_math_dollars", "--to=html5", "--mathml"],
            input="$$\n" + expression + "\n$$", text=True, capture_output=True, check=True)
        if rendered.stderr or "<math" not in rendered.stdout:
            raise ValueError(f"MathML rendering needs inspection: {name}: {rendered.stderr}")
        (destination / f"{name}.html").write_text(rendered.stdout)
    print(f"Rendered {len(names)} canonical equations to MathML")
    article = (destination.parent / "index.md").read_text()
    inline = set(re.findall(r'\{\{< model-inline "([^"]+)" >\}\}', article))
    for expression in sorted(inline):
        result = subprocess.run(
            ["pandoc", "--from=markdown+tex_math_dollars", "--to=html5", "--mathml"],
            input="$" + expression + "$", text=True, capture_output=True, check=True)
        if result.stderr or "<math" not in result.stdout:
            raise ValueError(f"Inline math failed: {expression}")
        markup = result.stdout.strip().removeprefix("<p>").removesuffix("</p>")
        key = hashlib.md5(expression.encode()).hexdigest()
        (destination / f"inline-{key}.html").write_text(markup)
    print(f"Rendered {len(inline)} inline expressions")


if __name__ == "__main__":
    main()
