"""Render and export this study using the workspace's FBT logo-design tools."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT.parents[4] / "fbt/workflows/logo-design/scripts"


def run(script, *args):
    subprocess.run([sys.executable, str(SCRIPTS / script), *map(str, args)], check=True)


run("render_png.py", ROOT / "comparison.svg", "-o", ROOT / "comparison.png",
    "--width", "1600", "--height", "1000")
run("render_png.py", ROOT / "assets/pin-symbol-vermilion.svg",
    "-o", ROOT / "assets/pin-symbol-vermilion.png", "--size", "1024")
run("export_variants.py", ROOT / "assets/pin-symbol-vermilion.svg",
    "--out-dir", ROOT / "export", "--name", "fangs-pin", "--title", "Fangs",
    "--mono", "#B44732", "--icon-bg", "#B44732", "--icon-fg", "#F6F3EB",
    "--favicon-source", ROOT / "assets/pin-favicon-ink.svg",
    "--preserve-favicon-viewbox", "--only", "black", "white", "mono",
    "--png", "512", "--web-icons")
