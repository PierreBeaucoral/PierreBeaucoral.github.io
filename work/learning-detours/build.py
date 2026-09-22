#!/usr/bin/env python3
"""Reproduce the illustration, validate it, compile the deck and bundle sources."""
from pathlib import Path
import shutil
import subprocess
import tempfile
import zipfile


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
    sources = [p for p in model.rglob("*") if p.is_file()
               and p.suffix in {".md", ".py", ".R", ".json", ".tex", ".csv", ".pdf"}]
    sources += [p for p in (repo / "content/post/time-to-learn").rglob("*") if p.is_file()]
    sources.append(repo / "layouts/shortcodes/model-equation.html")
    sources.append(repo / "layouts/shortcodes/model-inline.html")
    with zipfile.ZipFile(output / "learning-detours-source.zip", "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(sources):
            archive.write(path, path.relative_to(repo))
    print(f"Created {output / 'learning-detours.pdf'}")
    print(f"Created {output / 'learning-detours-source.zip'}")


if __name__ == "__main__":
    main()
