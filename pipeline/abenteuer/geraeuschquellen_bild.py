"""Vorschau der Geräuschquellen: je Karte das Raster, die Quellen und die Lautstärke als Farbe mit
Ringen (ausgelagert aus ``geraeuschquellen.py``, damit das Werkzeug ohne Pillow läuft).

Warum: Ob eine Quelle richtig liegt und wie weit sie trägt, sieht man auf einen Blick besser als
in einer Liste. Die Kurve ist dieselbe wie in der App (app/src/abenteuer/ton/geraeuschraum.ts,
``anteilNachAbstand``): voll bis ``VOLL_BIS``, still ab ``STILL_AB`` Kacheln, dazwischen weich.

Eingabe: Liste aus (Szene, Quellen) und Zieldatei. Ausgabe: True, wenn gezeichnet; False ohne Pillow.
"""

import math
from pathlib import Path

# Wie geraeuschraum.ts: voll bis 2 Kacheln, still ab 12.
VOLL_BIS = 2.0
STILL_AB = 12.0
PUNKT = 6  # Pixel je Kachel in der Vorschau
KOPF = 18  # Höhe der Überschrift je Karte
RING_ANTEILE = (0.9, 0.5, 0.1)
FARBE_WAND = (90, 90, 90)
FARBE_BODEN = (235, 232, 222)
FARBE_WASSER = (150, 190, 230)
FARBE_QUELLE = (230, 110, 20)
FARBE_RING = (200, 30, 30)


def anteil(abstand: float) -> float:
    """Anteil 0 bis 1 nach Abstand in Kacheln, weich (Kosinus) zwischen voll und still.

    Beispiele: 0 → 1; 7 → 0,5; 12 → 0.
    """
    if abstand <= VOLL_BIS:
        return 1.0
    if abstand >= STILL_AB:
        return 0.0
    t = (abstand - VOLL_BIS) / (STILL_AB - VOLL_BIS)
    return 0.5 + 0.5 * math.cos(math.pi * t)


def abstand(rechteck: list[int], x: int, y: int) -> float:
    """Abstand eines Feldes zum nächsten Feld eines Rechtecks [x, y, b, h] in Kacheln."""
    rx, ry, b, h = rechteck
    dx = max(rx - x, 0, x - (rx + b - 1))
    dy = max(ry - y, 0, y - (ry + h - 1))
    return math.hypot(dx, dy)


def pegelfeld(quellen: list[dict], breite: int, hoehe: int) -> list[list[float]]:
    """Anteil je Feld: die lauteste Stelle zählt, gleiche Art addiert sich nicht."""
    felder = [r for q in quellen for r in q["felder"]]
    return [
        [max((anteil(abstand(r, x, y)) for r in felder), default=0.0) for x in range(breite)]
        for y in range(hoehe)
    ]


def mische(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    """Farbe zwischen a und b (t von 0 bis 1)."""
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))  # type: ignore[return-value]


def zeichne_karte(bild, zeichner, szene: dict, quellen: list[dict], oben: int) -> None:
    """Eine Karte ab Höhe ``oben``: Grund, Lautstärke als Tönung, Ringe, Quellen umrandet."""
    zeilen = szene["raster"]
    breite = max(len(z) for z in zeilen)
    feld = pegelfeld(quellen, breite, len(zeilen))
    zeichner.text((2, oben + 2), f"{szene['karte']} ({szene['datei']})", fill=(0, 0, 0))
    for y, zeile in enumerate(zeilen):
        for x in range(breite):
            z = zeile[x] if x < len(zeile) else " "
            grund = FARBE_WAND if z == "#" else FARBE_WASSER if z == "~" else FARBE_BODEN
            farbe = mische(grund, FARBE_QUELLE, 0.6 * feld[y][x])
            x0, y0 = x * PUNKT, oben + KOPF + y * PUNKT
            zeichner.rectangle([x0, y0, x0 + PUNKT - 1, y0 + PUNKT - 1], fill=farbe)
            # Ring: Das Feld erreicht eine Stufe, ein Nachbar nicht mehr (Rand der Stufe).
            nachbarn = [
                feld[j][i]
                for i, j in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
                if 0 <= i < breite and 0 <= j < len(zeilen)
            ]
            if any(feld[y][x] >= stufe > min(nachbarn) for stufe in RING_ANTEILE):
                mitte = (x0 + PUNKT // 2, y0 + PUNKT // 2)
                zeichner.rectangle([mitte[0] - 1, mitte[1] - 1, mitte[0] + 1, mitte[1] + 1], fill=FARBE_RING)
    for q in quellen:
        for rx, ry, b, h in q["felder"]:
            x0, y0 = rx * PUNKT, oben + KOPF + ry * PUNKT
            zeichner.rectangle([x0, y0, x0 + b * PUNKT - 1, y0 + h * PUNKT - 1], outline=(0, 0, 0))


def zeichne(vorschau: list[tuple[dict, list[dict]]], ziel: Path) -> bool:
    """Alle Karten untereinander in eine PNG-Datei; False, wenn Pillow fehlt."""
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return False
    if not vorschau:
        return True
    hoehen = [KOPF + len(s["raster"]) * PUNKT + PUNKT for s, _ in vorschau]
    breite = max(max(len(z) for z in s["raster"]) for s, _ in vorschau) * PUNKT
    bild = Image.new("RGB", (max(breite, 320), sum(hoehen)), (255, 255, 255))
    zeichner = ImageDraw.Draw(bild)
    oben = 0
    for (szene, quellen), hoehe in zip(vorschau, hoehen, strict=True):
        zeichne_karte(bild, zeichner, szene, quellen, oben)
        oben += hoehe
    ziel.parent.mkdir(parents=True, exist_ok=True)
    bild.save(ziel)
    return True
