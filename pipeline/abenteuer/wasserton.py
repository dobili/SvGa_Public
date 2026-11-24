"""Wasserton je Gewässerart (RO53.4, Kartenblick 24.11.2026).

Warum: Alle Gewässer zeigten dasselbe Türkis aus dem gekauften Paket, ob Kanal, Meer, Bergbach oder
heiße Quelle. Die Gutachter lasen das als „überall dasselbe Wasser“. Der Autor hat entschieden: eigener
Ton je Art. Die Ufer-Zeichnung (uferart.py, weichrand.py, randmaler.py) bleibt unverändert; nur die
Farbe des Wassers ändert sich, nach dem Zeichnen und vor der Jahreszeit (kartenbild.zeichne).

Die Szene nennt ihre Art in ``"wasserton"`` (ohne Angabe bleibt das Türkis). Umgefärbt werden nur
wasserblaue Pixel (Farbton ``WASSERBLAU``, gesättigt) in Wasserfeldern und ihren Nachbarfeldern; Ufer,
Gras, Stein und die weißen Wellen bleiben. Je Art: Ziel-Farbton, Faktor für Sättigung und Helligkeit,
Zuschlag zur Helligkeit (nach ``colorsys``, alles 0 bis 1).
Beispiel: Paketwasser (66, 178, 196) im Kanal → (78, 158, 135), grünlich und etwas dunkler.
"""

import colorsys

from PIL import Image

VOLL = 255
K = 16  # Pixel je Kachel im Hintergrund
WASSERBLAU = (0.42, 0.62)
WASSER_SAETTIGUNG = 0.2
WASSER_HELL_BIS = 0.85  # hellere Pixel sind Wellenkämme und Gischt, sie bleiben weiß
# Art → (Farbton, Sättigung ×, Helligkeit ×, Helligkeit +); die Spreizung der Farbtöne halbiert.
TOENE: dict[str, tuple[float, float, float, float]] = {
    "kanal": (0.44, 0.65, 0.9, 0.0),  # grünlich, trüb (Riverton, Ironwood, Lockport, Kanalweg)
    "meer": (0.58, 1.0, 0.82, 0.0),  # tiefer blau (Bucht, Hafen, Deich, Fähre, Pelikaninsel)
    "see": (0.55, 0.85, 0.9, 0.0),  # ruhiges Blau (große Seen, Grubensee)
    "bach": (0.51, 0.8, 1.0, 0.08),  # hell und klar (Bäche und Flüsse in Akt 1, Bergbach)
    "canyon": (0.53, 0.7, 0.72, 0.0),  # im Schatten der Felswände dunkler
    "quelle": (0.5, 0.4, 0.75, 0.22),  # milchig (heiße Quelle, Sinterbecken)
}
SPREIZUNG = 0.5
MITTE = 0.5  # Farbton, um den das Paketwasser streut
OHNE = {"wasser_watt", "wasser_moor"}  # Watt ist Schlick, das Moor hat eigenes schwarzes Wasser


def ton(r: int, g: int, b: int, art: str) -> tuple[int, int, int]:
    """Die Farbe im Ton der Gewässerart; was nicht wasserblau ist, bleibt."""
    h, hell, s = colorsys.rgb_to_hls(r / VOLL, g / VOLL, b / VOLL)
    if not (WASSERBLAU[0] <= h <= WASSERBLAU[1] and s > WASSER_SAETTIGUNG and hell < WASSER_HELL_BIS):
        return (r, g, b)
    ziel, fs, fl, dl = TOENE[art]
    neu = colorsys.hls_to_rgb((ziel + (h - MITTE) * SPREIZUNG) % 1, min(1, hell * fl + dl), min(1, s * fs))
    return tuple(round(c * VOLL) for c in neu)


def _ist_wasser(boden: str) -> bool:
    return boden.startswith("wasser") and boden not in OHNE


def wasserfelder(gezeichnet: dict) -> set[tuple[int, int]]:
    """Kacheln mit Wasser (Boden ``wasser…`` außer Watt und Moor) und ihre acht Nachbarn."""
    wasser = [f for f, (name, *_) in gezeichnet.items() if _ist_wasser(str(name))]
    nah = {(x + dx, y + dy) for x, y in wasser for dx in (-1, 0, 1) for dy in (-1, 0, 1)}
    return {(x, y) for x, y in nah if x >= 0 and y >= 0}


def toene_wasser(bild: Image.Image, szene: dict, gezeichnet: dict) -> Image.Image:
    """Der Hintergrund mit dem Wasserton der Szene (ohne ``wasserton``: unverändert)."""
    art = szene.get("wasserton")
    if art not in TOENE:
        return bild
    rgba = bild.convert("RGBA")
    px = rgba.load()
    gemerkt: dict[tuple[int, int, int], tuple[int, int, int]] = {}
    for fx, fy in wasserfelder(gezeichnet):
        for y in range(fy * K, min(rgba.height, (fy + 1) * K)):
            for x in range(fx * K, min(rgba.width, (fx + 1) * K)):
                r, g, b, a = px[x, y]
                if (r, g, b) not in gemerkt:
                    gemerkt[(r, g, b)] = ton(r, g, b, art)
                px[x, y] = (*gemerkt[(r, g, b)], a)
    return rgba


def befunde(szene: dict) -> list[str]:
    """Unbekannter Wasserton in einer Szene (erlaubt sind die Arten in ``TOENE``)."""
    art = szene.get("wasserton")
    if art is None or art in TOENE:
        return []
    return [f"Wasserton {art!r} unbekannt (erlaubt: {', '.join(TOENE)})"]
