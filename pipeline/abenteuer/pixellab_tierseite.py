"""PixelLab-Tiere: Übersichtsseite für den Autor mit Standbild, Bewegung, Zuständen und Wasser.

Warum: Auftrag des Hauptchats (23.11.2026), Punkt 3: eine Seite aller Arten mit Standbild, Bewegung
als Filmstreifen und der Wasserfärbung vorher/nachher, dazu die Wahl der Zustände mit Grund. Die
Seite bettet Bilder aus dem privaten Repository ein und gehört deshalb nur nach
``buch/arbeit/tiere/pixellab/`` (lokal, nie ins öffentliche Repository).

Aufruf: ``python -m pipeline.abenteuer.pixellab_tierseite PRIVAT ZIELORDNER``
Abhängigkeiten: Pillow, pixellab_tiere.py, pixellab_wasser.py, pixellab_tierwahl.py.
"""

import base64
import html
import io
import json
import sys
from pathlib import Path

from PIL import Image

from pipeline.abenteuer import pixellab_tiere as pt
from pipeline.abenteuer.pixellab_tierwahl import WAHL

ZOOM = 2  # vier Standbilder passen auf ein Handy (bis Rahmen 44)
RICHTUNG_UNTEN = 3  # Spalte des Standbilds nach unten im Bogen
ANIMATION_MS = 125
GRUND = (122, 160, 98, 255)  # Wiesengrün hinter den Bildern
WASSERGRUND = {"standard": (60, 163, 178, 255), "moor": (29, 34, 27, 255)}


def _png(bild: Image.Image, grund=GRUND) -> str:
    """Bild vergrößert auf farbigem Grund als data-URL."""
    hinten = Image.new("RGBA", bild.size, grund)
    hinten.alpha_composite(bild)
    gross = hinten.resize((bild.width * ZOOM, bild.height * ZOOM), Image.Resampling.NEAREST)
    puffer = io.BytesIO()
    gross.save(puffer, "PNG")
    return "data:image/png;base64," + base64.b64encode(puffer.getvalue()).decode()


def _rahmen(bogen: Image.Image, f: int, spalte: int, reihe: int) -> Image.Image:
    return bogen.crop((spalte * f, reihe * f, (spalte + 1) * f, (reihe + 1) * f))


def _streifen(bogen: Image.Image, f: int, reihe: int, richtung: int) -> Image.Image:
    """Die sechs Bewegungsbilder einer Richtung nebeneinander (Filmstreifen)."""
    streifen = Image.new("RGBA", (pt.BILDER * f, f))
    for j in range(pt.BILDER):
        streifen.paste(_rahmen(bogen, f, richtung * pt.BILDER + j, reihe), (j * f, 0))
    return streifen


def karte(art: str, e: pt.Export, eintrag: dict, bogen: Image.Image) -> str:
    """HTML einer Art: Standbilder, Filmstreifen (laufend), Zustände, Wasser, Grund der Wahl."""
    w = WAHL[art]
    f = eintrag["breite"]
    stand = "".join(f'<img src="{_png(_rahmen(bogen, f, i, 0))}">' for i in range(4))
    film = _png(_streifen(bogen, f, 1, 0))
    teile = [
        f"<h2>{art}</h2>",
        f'<p class="zahl">Rahmen {f} px · gemessen {eintrag["gemessen"]} px · '
        f"Maßstab {eintrag['massstab']}</p>",
        f'<div class="reihe">{stand}</div>',
        f'<div class="film" style="--b:{f * ZOOM}px;background-image:url({film})"></div>',
    ]
    for k, verhalten in enumerate(w.zustaende):
        bild = _rahmen(bogen, f, k * 4 + RICHTUNG_UNTEN, pt.REIHE_ZUSTAENDE)
        teile.append(f'<span class="zustand">{verhalten}<img src="{_png(bild)}"></span>')
    if w.schwimmen:
        roh = pt.standbilder(e, w.schwimmen)["east"][0]
        neu = _rahmen(bogen, f, 0, pt.REIHE_SCHWIMMEN)
        grund = WASSERGRUND[w.wasser]
        teile.append(
            f'<p class="zahl">Wasser „{w.wasser}“: vorher, nachher</p><div class="reihe">'
            f'<img src="{_png(roh, grund)}"><img src="{_png(neu, grund)}"></div>'
        )
        teile.append(
            f'<div class="film" style="--b:{f * ZOOM}px;background-image:'
            f'url({_png(_streifen(bogen, f, pt.REIHE_SCHWIMMEN + 1, 0), grund)})"></div>'
        )
    teile.append(f'<p class="grund">Stand „{w.stand}“, Bewegung „{w.bewegung}“. {html.escape(w.grund)}</p>')
    return '<section class="art">' + "".join(teile) + "</section>"


STIL = """
body{font-family:system-ui,sans-serif;margin:16px;background:#f4f1ea;color:#222}
h1{font-size:1.3em}.art{background:#fff;border-radius:8px;padding:10px;margin:12px 0}
h2{margin:0 0 4px;font-size:1.1em}.zahl,.grund{font-size:.85em;color:#555;margin:4px 0}
.reihe img,.zustand img{image-rendering:pixelated;margin-right:4px;vertical-align:middle}
.zustand{display:inline-block;margin:4px 8px 4px 0;font-size:.85em}
.film{width:var(--b);height:var(--b);background-repeat:no-repeat;image-rendering:pixelated;
animation:lauf .75s steps(6) infinite;margin:4px 0}
@keyframes lauf{to{background-position:calc(var(--b)*-6) 0}}
@media (prefers-color-scheme:dark){body{background:#1d1d1b;color:#eee}.art{background:#2a2a27}
.zahl,.grund{color:#bbb}}
"""


def schreibe(privat: Path, ziel: Path) -> Path:
    """Baut die Bögen neu und schreibt ``index.html`` nach ``ziel``."""
    eintraege = pt.baue(privat)
    exporte = pt.lade_exporte(privat)
    karten = []
    for art, eintrag in eintraege.items():
        bogen = Image.open(privat / "spiel" / "tiere" / f"{art}.png").convert("RGBA")
        karten.append(karte(art, exporte[art][0], eintrag, bogen))
    ziel.mkdir(parents=True, exist_ok=True)
    seite = ziel / "index.html"
    seite.write_text(
        f'<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" '
        f'content="width=device-width,initial-scale=1"><title>PixelLab-Tiere</title><style>{STIL}'
        f"</style></head><body><h1>PixelLab-Tiere im Spiel ({len(karten)} Arten)</h1><p>Je Art: "
        "Standbilder (rechts, oben, links, unten), Bewegung nach rechts als laufender Filmstreifen, "
        "Zustände nach Verhalten, bei Schwimmern das Wasser vorher und nachher und die "
        "Schwimmbewegung. Fehlen noch: Saugroboter, Drohne (neu), Waschbär (Laufanimation).</p>"
        + "".join(karten)
        + "</body></html>",
        encoding="utf-8",
    )
    (ziel / "tierarten_auszug.json").write_text(json.dumps(eintraege, indent=1), encoding="utf-8")
    return seite


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    print(schreibe(Path(sys.argv[1]), Path(sys.argv[2])))
