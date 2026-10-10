"""Build this logo study from geometry and the project's licensed typeface.

No previous logo asset or design source is an input. PNG/export QA uses FBT.
Run from any cwd: python3 <this file>
"""
from pathlib import Path
from html import escape
import json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT.parents[2]
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)
INK = "#242420"
RED = "#B44732"
PAPER = "#F6F3EB"
FONT = PROJECT / "public/fonts/instrument-serif-italic.ttf"


def svg(title, body, width=256, height=256):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" '
            f'height="{height}" viewBox="0 0 {width} {height}" role="img" '
            f'aria-labelledby="title"><title id="title">{escape(title)}</title>{body}</svg>\n')


def windows(color=INK, small=False):
    if small:
        d = "M0 0 H4 L6 2 V6 H0 Z M2 2 V4 H4 V2 Z"
        places = [(5, 1, 90), (1, 9, 0), (9, 9, 270)]
        pivot = 3
    else:
        d = "M0 0 H58 L80 22 V80 H0 Z M22 22 V58 H58 V22 Z"
        places = [(88, 30, 90), (38, 128, 0), (138, 128, 270)]
        pivot = 40
    return "".join(f'<path fill="{color}" fill-rule="evenodd" d="{d}" '
                   f'transform="translate({x} {y}) rotate({r} {pivot} {pivot})"/>'
                   for x, y, r in places)


def fold(color=INK):
    d = "M128 24 L182 117.53 L156.02 132.53 L128 84 L112 111.71 L86.02 96.71 Z"
    return "".join(f'<path fill="{color}" d="{d}" transform="rotate({r} 128 144)"/>'
                   for r in (0, 120, 240))


font = TTFont(FONT)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()


def word(text, x, baseline, size, color=INK, tracking=0):
    result = []
    scale = size / font["head"].unitsPerEm
    for char in text:
        glyph = cmap[ord(char)]
        pen = SVGPathPen(glyphs)
        glyphs[glyph].draw(TransformPen(pen, (scale, 0, 0, -scale, x, baseline)))
        if pen.getCommands():
            result.append(f'<path fill="{color}" d="{pen.getCommands()}"/>')
        x += glyphs[glyph].width * scale + tracking
    return "".join(result)


for name, color in [("ink", INK), ("vermilion", RED), ("white", "#FFFFFF")]:
    (ASSETS / f"pin-symbol-{name}.svg").write_text(svg("Fangs — 品·三窗", windows(color)))
    (ASSETS / f"fold-symbol-{name}.svg").write_text(svg("Fangs — 三页相生", fold(color)))
    (ASSETS / f"pin-favicon-{name}.svg").write_text(svg("Fangs", windows(color, True), 16, 16))
    (ASSETS / f"fangs-wordmark-{name}.svg").write_text(svg("fangs", word("fangs", 18, 106, 132, color), 286, 160))
    for direction, mark in [("pin", windows), ("fold", fold)]:
        body = f'<g transform="translate(0 25) scale(.43)">{mark(color)}</g>'
        body += word("fangs", 124, 115, 128, color)
        (ASSETS / f"{direction}-lockup-{name}.svg").write_text(svg("Fangs", body, 398, 160))

slogan = "Taste. Build. Sell."
slogan_width = round(sum(glyphs[cmap[ord(c)]].width for c in slogan) * .148 + 16)
(ASSETS / "slogan-ink.svg").write_text(svg(slogan, word(slogan, 8, 130, 148), slogan_width, 180))

# A review image; all English display typography is converted to outlines.
def label(text, x, y, size=14, color=INK, spacing=0):
    return f'<text x="{x}" y="{y}" fill="{color}" font-family="Helvetica, Arial, sans-serif" font-size="{size}" letter-spacing="{spacing}">{escape(text)}</text>'


body = f'<rect width="1600" height="1000" fill="{PAPER}"/>'
body += label("HI.FANGS.CC", 68, 66, 18, spacing=1.7)
body += label("TASTE / BUILD / SELL", 1200, 66, 14, spacing=1.2)
body += '<path d="M68 96H1532 M800 130V862 M68 872H1532" stroke="#D5D1C7" stroke-width="1"/>'
body += label("01  /  PIN — THREE WINDOWS", 68, 149, 13, spacing=1.1)
body += label("02  /  THREE FOLDS", 850, 149, 13, spacing=1.1)
body += f'<g transform="translate(210 205) scale(1.85)">{windows(RED)}</g>'
body += f'<g transform="translate(973 205) scale(1.85)">{fold(INK)}</g>'
body += word("fangs", 320, 726, 106)
body += word("fangs", 1080, 726, 106)
body += label("Taste becomes a signature.", 267, 800, 18, color="#62625A")
body += label("Three forces, one open form.", 1024, 800, 18, color="#62625A")
body += label("RECOMMENDED STUDY", 68, 927, 12, RED, 1.4)
body += label("Three equal frames. A triangular arrangement. A personal mark.", 68, 960, 17)
body += label("2026.10.10  /  NEW EXPLORATION", 1231, 946, 12, spacing=.5)
(ROOT / "comparison.svg").write_text(svg("Fangs — two new logo directions", body, 1600, 1000))

(ROOT / "source/geometry.json").write_text(json.dumps({
    "date": "2026-10-10", "recommended": "pin", "status": "proposal",
    "concept": "Three equal frames in the triangular structure of 品",
    "colors": {"ink": INK, "vermilion": RED, "paper": PAPER},
    "master": {"viewBox": [0, 0, 256, 256], "frame_size": 80,
               "frame_weight": 22, "counter_size": 36, "chamfer": 22,
               "placements": [[88, 30, 90], [38, 128, 0], [138, 128, 270]]},
    "micro": {"viewBox": [0, 0, 16, 16], "frame_size": 6,
              "frame_weight": 2, "counter_size": 2, "gap": 2},
    "font": {"file": str(FONT.relative_to(PROJECT)), "license": "SIL OFL 1.1",
             "delivery": "SVG paths, no installed font required"},
    "source_boundary": "Only new geometry and existing typeface; no previous logo read"
}, ensure_ascii=False, indent=2) + "\n")
print(f"Built {len(list(ASSETS.glob('*.svg')))} SVGs and the comparison board.")
