"""Winter ohne Schneebilder: Karten im Winterzustand werden umgefärbt (Entscheidung 10.11.2026).

Warum: Die gekauften Pakete haben keinen Schnee. Die Geschichte spielt aber im Winter (Ironwood,
KARTENREGELN 10.63). ``kartenbild`` färbt den Hintergrund einer Szene mit ``"jahreszeit":
"winter"`` um; dieselbe Regel steht in ``app/src/abenteuer/oberwelt/winter.ts`` für die Möbel
(Bäume, Büsche), die die App zeichnet. Änderungen gehören in beide.

Regel je Farbe (Farbton H, Helligkeit L, Sättigung S nach ``colorsys.rgb_to_hls``):
- Grün (0,17 < H < 0,45, S > 0,15): Schnee, die Helligkeit bleibt (v = 0,72 + 0,28 · L).
- Braun (0,05 ≤ H ≤ 0,17, S > 0,2, L > 0,35): halb zum Grau gezogen (Erde wird entsättigt).
- Wasser (0,45 ≤ H ≤ 0,6), nur wenn ``wasser``: kühler, × (0,7; 0,8; 0,9).
Beispiel: Gras (106, 170, 72) → Schnee (222, 221, 219); Erde (150, 110, 70) → (130, 110, 90).
"""

import colorsys
import math
import re

from PIL import Image

GRUEN = (0.17, 0.45)
GRUEN_SAETTIGUNG = 0.15
BRAUN = (0.05, 0.17)
BRAUN_SAETTIGUNG = 0.2
BRAUN_HELLIGKEIT = 0.35
WASSER = (0.45, 0.6)
WASSER_FAKTOR = (0.7, 0.8, 0.9)
SCHNEE_GRUND, SCHNEE_ANTEIL = 0.72, 0.28
SCHNEE_FARBE = ((225, 30), (232, 23), (245, 10))
VOLL = 255


def _runde(x: float) -> int:
    """Wie ``Math.round`` in JavaScript (,5 nach oben), damit App und Pipeline gleich rechnen."""
    return math.floor(x + 0.5)


def winterfarbe(r: int, g: int, b: int, wasser: bool = True) -> tuple[int, int, int]:
    """Die Winterfarbe einer Farbe (Regel im Dateikopf); andere Farben bleiben."""
    h, hell, s = colorsys.rgb_to_hls(r / VOLL, g / VOLL, b / VOLL)
    if GRUEN[0] < h < GRUEN[1] and s > GRUEN_SAETTIGUNG:
        v = SCHNEE_GRUND + SCHNEE_ANTEIL * hell
        return tuple(min(VOLL, _runde(f * v + d)) for f, d in SCHNEE_FARBE)
    if BRAUN[0] <= h <= BRAUN[1] and s > BRAUN_SAETTIGUNG and hell > BRAUN_HELLIGKEIT:
        grau = (r + g + b) / 3
        return tuple(_runde((c + grau) / 2) for c in (r, g, b))
    if wasser and WASSER[0] <= h <= WASSER[1]:
        return tuple(_runde(c * f) for c, f in zip((r, g, b), WASSER_FAKTOR, strict=True))
    return (r, g, b)


def winterlich(bild: Image.Image, wasser: bool = True) -> Image.Image:
    """Das ganze Bild umgefärbt (RGBA, Transparenz bleibt); je Farbe nur einmal gerechnet."""
    rgba = bild.convert("RGBA")
    gemerkt: dict[tuple[int, int, int], tuple[int, int, int]] = {}

    def farbe(px: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
        rgb = px[:3]
        if rgb not in gemerkt:
            gemerkt[rgb] = winterfarbe(*rgb, wasser=wasser)
        return (*gemerkt[rgb], px[3])

    neu = Image.new("RGBA", rgba.size)
    neu.putdata([farbe(px) for px in rgba.getdata()])
    return neu


def ist_winter(szene: dict) -> bool:
    """Szene im Winterzustand (``"jahreszeit": "winter"``, Entscheidung 10.11.2026)."""
    return szene.get("jahreszeit") == "winter"


# Blumen und Pilze bleiben beim Umfärben bunt; in Winterszenen kommen sie weg (Entscheidung Winter).
BLUEHT = re.compile(r"blume|pilz(?!kiosk)", re.I)


def winterbefunde(szene: dict) -> list[str]:
    """Blumen und Pilze in einer Winterszene (sie gehören weg); sonst nichts."""
    if not ist_winter(szene):
        return []
    namen = sorted({o["moebel"] for o in szene.get("objekte", []) if BLUEHT.search(o.get("moebel", ""))})
    return [f"{n}: Blumen und Pilze gehören nicht in eine Winterszene" for n in namen]
