"""Figuren für die Vergleichsseite zur Figurengröße (proportionsvergleich.py, 20.11.2026).

Warum: Die Seite braucht zwei Messungen aus dem privaten Paket: wie hoch die Figuren des Grafiksatzes
sind (gegen unseren Helden) und wie der Kopf des Helden im Spiel aussieht, wenn die Figur größer
gezeichnet wird. Ausgelagert, damit proportionsvergleich.py unter 400 Zeilen bleibt.
Abhängigkeiten: Pillow, belebungsvorschau.py.
"""

import statistics
from pathlib import Path

from PIL import Image

from pipeline.abenteuer import belebungsvorschau

K = 16
ZOOM = 3  # Bildschirmpixel je Kartenpixel im Spiel (weltmassstab.ts)
GESICHT_ZOOM = 4  # Lupe auf den Kopf des Helden


def figurhoehen(privat: Path) -> dict:
    """Gemessene Figurhöhen: Median der LimeZu-Figuren und unser Held (Kartenpixel)."""
    limezu = []
    ordner = privat / "modern-interiors" / "2_Characters" / "Old" / "Single_Characters_Legacy" / "16x16"
    for datei in sorted(ordner.glob("*idle*16x16.png")):
        bild = Image.open(datei).convert("RGBA")
        if bild.height != 2 * K:
            continue
        rahmen = [bild.crop((i * K, 0, (i + 1) * K, 2 * K)).getbbox() for i in range(min(4, bild.width // K))]
        hoehen = [r[3] - r[1] for r in rahmen if r]
        if hoehen:
            limezu.append(max(hoehen))
    held = belebungsvorschau.figurbild(privat, "figuren/held-0.png", 3, belebungsvorschau.rgba)
    umriss = held.getbbox() if held else None
    pixellab = (privat / "spiel" / "figuren-neu").exists()
    return {
        "limezu_median": statistics.median(limezu) if limezu else None,
        "limezu_anzahl": len(limezu),
        "held": (umriss[3] - umriss[1]) if umriss else None,
        "pixellab": pixellab,
    }


def gesicht(privat: Path, faktor: float) -> Image.Image | None:
    """Kopf des Helden so, wie das Spiel ihn zeichnet (nächster Nachbar aus dem Original, ZOOM 3),
    dann GESICHT_ZOOM-fach vergrößert. Beispiel: Faktor 1,5 → 3 Bildschirmpixel je Figurenpixel."""
    neu = privat / "spiel" / "figuren-neu" / "held-0" / "rotations" / "south.png"
    if neu.exists():
        bild, schirm = Image.open(neu).convert("RGBA"), 2 * faktor  # PixelLab: 2/3 · ZOOM 3 · Faktor
    else:
        alt = privat / "spiel" / "figuren" / "held-0.png"
        if not alt.exists():
            return None
        bild, schirm = Image.open(alt).convert("RGBA").crop((3 * K, 0, 4 * K, 2 * K)), ZOOM * faktor
    umriss = bild.getbbox()
    if not umriss:
        return None
    kopf = bild.crop((umriss[0], umriss[1], umriss[2], umriss[1] + (umriss[3] - umriss[1]) * 3 // 5))
    grund = Image.new("RGBA", kopf.size, (232, 222, 200, 255))
    grund.alpha_composite(kopf)
    am_schirm = grund.resize((round(kopf.width * schirm), round(kopf.height * schirm)), Image.NEAREST)
    return am_schirm.resize((am_schirm.width * GESICHT_ZOOM, am_schirm.height * GESICHT_ZOOM), Image.NEAREST)
