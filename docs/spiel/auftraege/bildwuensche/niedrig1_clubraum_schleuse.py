"""Bildwunsch von niedrig-1 (Runde 8): Zeichnungen für den Clubraum Maple Falls (Wünsche von mittel-1)
und für die Schleuse Lockport. Entwurf zum Übernehmen ins private Repository (``werkzeuge/``), nur
Code, keine LimeZu-Dateien.

Stil wie ``ereignisse.py`` und ``schilder.py``: LimeZus Umriss (58, 58, 80), durchscheinender Schatten
unten, Schrägansicht von oben, Wandbilder ohne Bodenschatten. Schrift nur über ``schilder.py``.

Bilder (in ``spiel/eigene/``, Breite × Höhe in Pixeln):
- ``plakat_erst_zaehlen.png`` (32 × 32): Wandplakat „ERST ZÄHLEN“ mit zwei Figuren und Pfeilen.
- ``pokal_1994.png`` (16 × 16): goldener Pokal auf Sockel mit Plakette, ohne Kollision (Vitrine).
- ``schachuhr_klein.png`` (8 × 6): Schachuhr für die Tische.
- ``wanduhr.png`` (16 × 16): runde Wanduhr mit Holzrahmen.
- ``garderobe_jacken.png`` (32 × 32): Garderobenbrett an der Wand mit drei Jacken.
- ``schachbrett_klein_ohne_dame.png`` (12 × 9): ``schachbrett_klein_figuren.png`` ohne weiße Dame.
- ``teppich_<teil>.png`` (je 16 × 16, Teile lo, o, ro, l, m, r, lu, u, ru): roter Teppich mit
  goldenem Rand als Bodenbelag in neun Teilen.
- ``buecherregal_schmal_links.png`` (16 × 48): schmales Bücherregal in Seitenansicht, Blick nach links.
- ``frachtkahn.png`` (96 × 48): flacher Frachtkahn von oben schräg, Laderaum mit Luken, Steuerhaus
  hinten rechts (für die „Ashford Belle“ in Lockport).
- ``schleusentor_stemm.png`` (32 × 80): Stemmtor für eine 5 Kacheln breite Kammer: zwei Torflügel
  treffen sich in einem flachen V, oben ein Steg mit Geländer, links und rechts die Drehbalken.
"""

from pathlib import Path

from PIL import Image, ImageDraw
from schilder import RAHMEN, schreibe  # im privaten Repository: werkzeuge/schilder.py

SCHATTEN = (58, 58, 80, 90)
PAPIER = (240, 232, 210, 255)
ROT = (190, 50, 50, 255)
GOLD = (232, 186, 64, 255)
GOLD_DUNKEL = (176, 128, 40, 255)
HOLZ_HELL = (176, 128, 84, 255)
HOLZ_DUNKEL = (124, 84, 56, 255)
WEISS = (245, 245, 240, 255)
SCHWARZ = (30, 30, 40, 255)
WASSERFEST = (96, 70, 52, 255)
STAHL = (120, 124, 140, 255)


def plakat_erst_zaehlen() -> Image.Image:
    """Wandplakat 32 × 32: „ERST“ und „ZÄHLEN“ (Ä aus A mit zwei Punkten), darunter zwei Figuren mit
    Pfeilen aufeinander zu (Angreifer und Verteidiger zählen, Kapitel 1)."""
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((2, 1, 29, 29), fill=RAHMEN)
    z.rectangle((3, 2, 28, 28), fill=PAPIER)
    schreibe(z, "ERST", 9, 4, ROT)
    schreibe(z, "ZAHLEN", 4, 12, ROT)
    z.point((8, 10), fill=ROT)
    z.point((10, 10), fill=ROT)
    for x, farbe in ((7, WEISS), (21, SCHWARZ)):
        z.rectangle((x, 20, x + 3, 25), fill=RAHMEN)
        z.rectangle((x + 1, 21, x + 2, 24), fill=farbe)
    z.line((12, 22, 19, 22), fill=RAHMEN)
    z.point((18, 21), fill=RAHMEN)
    z.point((13, 23), fill=RAHMEN)
    z.rectangle((15, 0, 16, 1), fill=(200, 200, 210, 255))
    return bild


def pokal_1994() -> Image.Image:
    """Pokal 16 × 16: goldene Schale mit Henkeln auf dunklem Holzsockel, helle Plakette vorn."""
    bild = Image.new("RGBA", (16, 16))
    z = ImageDraw.Draw(bild)
    z.ellipse((4, 1, 11, 8), fill=RAHMEN)
    z.ellipse((5, 2, 10, 7), fill=GOLD)
    z.line((6, 3, 6, 5), fill=(255, 236, 160, 255))
    for x in (2, 12):
        z.rectangle((x, 3, x + 1, 5), outline=RAHMEN)
    z.rectangle((7, 8, 8, 10), fill=GOLD_DUNKEL)
    z.rectangle((4, 11, 11, 14), fill=RAHMEN)
    z.rectangle((5, 11, 10, 13), fill=HOLZ_DUNKEL)
    z.rectangle((6, 12, 9, 12), fill=(220, 220, 228, 255))
    z.line((4, 15, 11, 15), fill=SCHATTEN)
    return bild


def schachuhr_klein() -> Image.Image:
    """Schachuhr 8 × 6: Holzgehäuse, zwei Zifferblätter, Knöpfe oben."""
    bild = Image.new("RGBA", (8, 6))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 1, 7, 5), fill=RAHMEN)
    z.rectangle((1, 2, 6, 4), fill=HOLZ_HELL)
    z.point((2, 3), fill=WEISS)
    z.point((5, 3), fill=WEISS)
    z.point((2, 0), fill=RAHMEN)
    z.point((5, 0), fill=RAHMEN)
    return bild


def wanduhr() -> Image.Image:
    """Wanduhr 16 × 16: runder Holzrahmen, helles Zifferblatt, Zeiger auf zehn nach zehn."""
    bild = Image.new("RGBA", (16, 16))
    z = ImageDraw.Draw(bild)
    z.ellipse((1, 1, 14, 14), fill=RAHMEN)
    z.ellipse((2, 2, 13, 13), fill=HOLZ_DUNKEL)
    z.ellipse((3, 3, 12, 12), fill=WEISS)
    for x, y in ((7, 3), (12, 7), (7, 12), (3, 7)):
        z.point((x, y), fill=RAHMEN)
    z.line((7, 7, 5, 5), fill=RAHMEN)
    z.line((8, 7, 10, 5), fill=RAHMEN)
    return bild


def garderobe_jacken() -> Image.Image:
    """Garderobe 32 × 32: Holzbrett mit vier Haken, drei Jacken hängen (rot, blau, grün), darüber
    eine Hutablage."""
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 3, 30, 6), fill=RAHMEN)
    z.rectangle((2, 4, 29, 5), fill=HOLZ_HELL)
    z.rectangle((1, 9, 30, 11), fill=RAHMEN)
    z.rectangle((2, 10, 29, 10), fill=HOLZ_DUNKEL)
    for x, farbe in ((4, ROT), (12, (60, 90, 160, 255)), (20, (80, 130, 70, 255))):
        z.polygon([(x + 3, 11), (x + 7, 13), (x + 7, 27), (x - 1, 27), (x - 1, 13)], fill=RAHMEN)
        z.polygon([(x + 3, 12), (x + 6, 14), (x + 6, 26), (x, 26), (x, 14)], fill=farbe)
        z.line((x + 3, 13, x + 3, 25), fill=RAHMEN)
    z.rectangle((28, 11, 29, 14), fill=RAHMEN)
    return bild


def schachbrett_klein_ohne_dame(haupt: Path) -> Image.Image:
    """Wie ``schachbrett_klein_figuren.png`` (12 × 9), aber ohne die weiße Dame (Pixel 6, 6, mittlere
    weiße Figur); das Feld bekommt die Farbe des hellen Felds daneben."""
    bild = Image.open(haupt / "spiel" / "eigene" / "schachbrett_klein_figuren.png").convert("RGBA")
    bild.putpixel((6, 6), bild.getpixel((5, 6)))
    return bild


def teppich_teile() -> dict[str, Image.Image]:
    """Roter Teppich mit goldenem Rand in neun Teilen zu je 16 × 16: Ecken (lo, ro, lu, ru), Kanten
    (o, u, l, r) und Mitte (m) mit kleinem Rautenmuster. Die Mitte kachelt nahtlos."""
    grund, muster = (150, 40, 40, 255), (176, 64, 56, 255)
    teile = {}
    for name, (links, oben, rechts, unten) in {
        "lo": (1, 1, 0, 0), "o": (0, 1, 0, 0), "ro": (0, 1, 1, 0),
        "l": (1, 0, 0, 0), "m": (0, 0, 0, 0), "r": (0, 0, 1, 0),
        "lu": (1, 0, 0, 1), "u": (0, 0, 0, 1), "ru": (0, 0, 1, 1),
    }.items():  # fmt: skip
        bild = Image.new("RGBA", (16, 16), grund)
        z = ImageDraw.Draw(bild)
        for x, y in ((4, 4), (12, 12), (12, 4), (4, 12)):
            z.polygon([(x, y - 2), (x + 2, y), (x, y + 2), (x - 2, y)], fill=muster)
        if links:
            z.rectangle((0, 0, 3, 15), fill=GOLD)
            z.line((0, 0, 0, 15), fill=GOLD_DUNKEL)
        if rechts:
            z.rectangle((12, 0, 15, 15), fill=GOLD)
            z.line((15, 0, 15, 15), fill=GOLD_DUNKEL)
        if oben:
            z.rectangle((0, 0, 15, 3), fill=GOLD)
            z.line((0, 0, 15, 0), fill=GOLD_DUNKEL)
        if unten:
            z.rectangle((0, 12, 15, 15), fill=GOLD)
            z.line((0, 15, 15, 15), fill=GOLD_DUNKEL)
        teile[name] = bild
    return teile


def buecherregal_schmal_links() -> Image.Image:
    """Schmales Bücherregal 16 × 48 in Seitenansicht, Blick nach links: oben die Deckplatte, links die
    offenen Fächer mit Buchrücken, rechts die Seitenwand mit Schatten."""
    bild = Image.new("RGBA", (16, 48))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 0, 14, 45), fill=RAHMEN)
    z.rectangle((2, 1, 13, 3), fill=HOLZ_HELL)
    z.rectangle((9, 4, 13, 44), fill=HOLZ_DUNKEL)
    farben = [
        (150, 50, 50, 255),
        (60, 90, 150, 255),
        (90, 130, 70, 255),
        (200, 160, 70, 255),
        (110, 70, 120, 255),
    ]
    for fach in range(5):
        y0 = 5 + fach * 8
        z.rectangle((2, y0 + 7, 8, y0 + 7), fill=HOLZ_HELL)
        for i in range(3):
            farbe = farben[(fach + i) % len(farben)]
            z.rectangle((2, y0 + i * 2, 8 - (i + fach) % 2, y0 + i * 2 + 1), fill=farbe)
    z.rectangle((1, 46, 14, 47), fill=SCHATTEN)
    return bild


def frachtkahn() -> Image.Image:
    """Flacher Frachtkahn 96 × 48 längs nach links (Bug links): dunkler Rumpf mit Scheuerleiste,
    Laderaum mit drei Lukendeckeln, Steuerhaus hinten rechts, Poller an Bug und Heck."""
    bild = Image.new("RGBA", (96, 48))
    z = ImageDraw.Draw(bild)
    z.rectangle((6, 42, 92, 46), fill=SCHATTEN)
    z.polygon([(1, 22), (10, 8), (90, 8), (94, 12), (94, 38), (90, 42), (10, 42)], fill=RAHMEN)
    z.polygon([(3, 22), (11, 10), (89, 10), (92, 13), (92, 37), (89, 40), (11, 40)], fill=WASSERFEST)
    z.line((11, 10, 89, 10), fill=(150, 60, 50, 255), width=2)
    z.line((11, 40, 89, 40), fill=(150, 60, 50, 255), width=2)
    z.rectangle((14, 14, 68, 36), fill=RAHMEN)
    for x in (15, 33, 51):
        z.rectangle((x, 15, x + 16, 35), fill=(70, 110, 90, 255))
        z.line((x, 25, x + 16, 25), fill=(50, 80, 66, 255))
    z.rectangle((74, 14, 89, 34), fill=RAHMEN)
    z.rectangle((75, 15, 88, 22), fill=(220, 214, 200, 255))
    z.rectangle((75, 23, 88, 33), fill=(200, 192, 176, 255))
    z.rectangle((77, 25, 86, 28), fill=(120, 160, 200, 255))
    for x, y in ((8, 20), (8, 26), (91, 15), (91, 35)):
        z.rectangle((x, y, x + 1, y + 1), fill=STAHL)
    return bild


def schleusentor_stemm() -> Image.Image:
    """Stemmtor 32 × 80 für eine Kammer von 5 Kacheln Breite (Wasser in den Reihen 1–4, Mauer oben
    und unten): zwei Holzflügel treffen sich in der Mitte in einem flachen V gegen den Wasserdruck,
    darauf ein Laufsteg mit Geländer, oben und unten auf der Mauer je ein Drehbalken."""
    bild = Image.new("RGBA", (32, 80))
    z = ImageDraw.Draw(bild)
    for oben in (True, False):
        y0, y1 = (8, 40) if oben else (40, 72)
        mitte_x = 20
        z.polygon([(8, y0), (14, y0), (mitte_x + 2, 40), (mitte_x - 4, 40)] if oben else
                  [(mitte_x - 4, 40), (mitte_x + 2, 40), (14, y1), (8, y1)], fill=RAHMEN)  # fmt: skip
        z.polygon([(9, y0), (13, y0), (mitte_x + 1, 40), (mitte_x - 3, 40)] if oben else
                  [(mitte_x - 3, 40), (mitte_x + 1, 40), (13, y1), (9, y1)], fill=HOLZ_DUNKEL)  # fmt: skip
    for y in range(10, 72, 6):
        z.line((10, y, 12, y), fill=HOLZ_HELL)
    for y in (2, 74):
        z.rectangle((2, y, 29, y + 4), fill=RAHMEN)
        z.rectangle((3, y + 1, 28, y + 3), fill=HOLZ_HELL)
        z.rectangle((26, y + 1, 28, y + 3), fill=(90, 90, 100, 255))
    z.line((7, 6, 7, 74), fill=STAHL)
    return bild


def bilder(haupt: Path) -> dict[str, Image.Image]:
    """Alle Bilder dieses Wunsches nach Dateiname (ohne .png)."""
    alle = {
        "plakat_erst_zaehlen": plakat_erst_zaehlen(),
        "pokal_1994": pokal_1994(),
        "schachuhr_klein": schachuhr_klein(),
        "wanduhr": wanduhr(),
        "garderobe_jacken": garderobe_jacken(),
        "schachbrett_klein_ohne_dame": schachbrett_klein_ohne_dame(haupt),
        "buecherregal_schmal_links": buecherregal_schmal_links(),
        "frachtkahn": frachtkahn(),
        "schleusentor_stemm": schleusentor_stemm(),
    }
    alle.update({f"teppich_{name}": bild for name, bild in teppich_teile().items()})
    return alle
