#!/usr/bin/env python3
"""Reproduce the illustration, validate it and compile the deck."""
from pathlib import Path
import shutil
import subprocess
import tempfile


def main():
    """Run checked build steps with paths relative to this file."""
    model = Path(__file__).resolve().parent
    repo = model.parent.parent
    output = repo / "static/uploads/learning-detours"
    output.mkdir(parents=True, exist_ok=True)
    subprocess.run(["Rscript", str(model / "simulate.R")], check=True)
    subprocess.run(["python3", str(model / "check_model.py")], check=True)
    subprocess.run(["python3", str(model / "render_equations.py")], check=True)
    with tempfile.TemporaryDirectory(prefix="learning-detours-") as build:
        command = ["xelatex", "-interaction=nonstopmode", "-halt-on-error",
                   f"-output-directory={build}", "learning-detours.tex"]
        for _ in range(2):
            result = subprocess.run(command, cwd=model, capture_output=True, text=True)
            if result.returncode:
                raise RuntimeError(result.stdout[-6000:] + result.stderr)
        log = (Path(build) / "learning-detours.log").read_text()
        for marker in ("Overfull", "Underfull", "LaTeX Font Warning", "Missing character"):
            if marker in log:
                raise RuntimeError(f"Inspect the LaTeX build: {marker}")
        shutil.copy2(Path(build) / "learning-detours.pdf", output / "learning-detours.pdf")
    print(f"Created {output / 'learning-detours.pdf'}")


if __name__ == "__main__":
    main()
