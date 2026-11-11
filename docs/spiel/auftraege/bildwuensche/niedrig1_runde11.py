"""Bildwunsch von niedrig-1 (Runde 11): Innenräume von Cedar Creek und Maple Falls.

Entwurf zum Übernehmen in ``werkzeuge/`` des privaten Repositorys. Nur Code, keine LimeZu-Dateien.
Stil wie ``schilder.py``: LimeZus Umriss ``RAHMEN``, durchscheinender Schatten unten, Schrägansicht
von oben (KARTENREGELN 10.60). Anlass sind die Gutachten ``cedar-creek-innen.md`` und
``maple-falls-innen.md`` (11.11.2026).

Bilder (in ``spiel/eigene/``, Breite × Höhe in Pixeln):

Archiv von Cedar Creek
- ``archivkartons_oben.png`` (96 × 32): vier geschlossene Archivkartons nebeneinander, jeder mit
  weißem Etikett und Jahreszahl (1810 bis 1840). Warum: Beschrieben sind zwei saubere Reihen
  beschrifteter Kartons, im Bild standen Bücherregale.
- ``archivkartons_unten.png`` (96 × 32): die untere Reihe, der erste Karton ist offen (Etikett
  1850, Deckel daneben hochgeklappt, Mappen sichtbar), dann 1860 bis 1880.
- ``wasserfleck_springer.png`` (48 × 32): dunkler, durchscheinender Fleck am Boden mit dem Umriss
  eines Springers (Kopf nach links), flach.
- ``archivregal_schatten.png`` (32 × 48): LimeZus Archivregal (Classroom and Library 71), abgedunkelt
  und bläulich, für das Regal im Schatten neben der Treppe.
- ``buch_offen_klein.png`` (12 × 8) und ``programmheft.png`` (8 × 8): aufgeschlagenes Buch und ein
  vergilbtes Heft mit dunklem Titelstreifen, für den Lesetisch.


Bibliothek von Cedar Creek
- ``zeitungsregal.png`` (32 × 48): niedriges Holzgestell mit drei Stangen, über jeder hängen
  gefaltete Zeitungen (helles Papier mit grauen Zeilen und dunkler Kopfzeile). Warum: Das
  Zeitungsregal zeigte dasselbe Bild wie die Bücherregale.
Waschsalon von Cedar Creek
- ``trockner_schmal.png`` (16 × 32): LimeZus Waschmaschine (Bathroom 90) als Trockner: Bullauge
  warm statt blau, darüber Lüftungsschlitze. Warum: Die Trockner zeigten dasselbe Bild wie die
  Waschmaschinen.
- ``trockner_steckschach.png`` (16 × 32): derselbe Trockner, oben klebt Mr. Boatengs
  Steckschachbrett (7 × 7 Pixel, karierte Felder, zwei Stecker).
- ``comicheft.png`` (8 × 8): buntes Heft mit gelbem Titel, liegt auf den Wartesitzen.

Maple Falls
- ``hutschachtel_klein.png`` (16 × 16): runde, gestreifte Hutschachtel mit Deckel und Band.
  Warum: Die bisherige war so groß wie der Tisch und sah aus wie eine Tonne.
- ``fenster_ahorn.png`` (32 × 32): LimeZus Sprossenfenster vom Dachboden, hinter dem Glas rotes und
  oranges Ahornlaub.
- ``pizzakarton_flach.png`` (16 × 16): flacher, heller Karton von oben mit rotem Kreis und
  Fettfleck, schräg auf den Umzugskartons.
- ``karton_whitlock.png`` (48 × 32): Umzugskarton mit der Aufschrift „WHITLOCK“ auf einem Etikett.
- ``werkstattfenster.png`` (32 × 32): LimeZus Sprossenfenster mit hellem Tageslicht, für die
  Drechslerei.
- ``nischenbank_rechts.png`` und ``nischenbank_links.png`` (16 × 32): gepolsterte rote Sitzbank
  einer Diner-Nische von der Seite, mit hoher Lehne außen; „rechts“ heißt: Wer darauf sitzt,
  schaut nach rechts. Warum: Die Nischen im Falls Diner waren freie Tische mit Holzstühlen.

Aufruf: python niedrig1_runde11.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw
from schilder import RAHMEN, schreibe, textbreite  # im privaten Repository: werkzeuge/schilder.py

SCHATTEN = (58, 58, 80, 90)
KARTON_HELL = (214, 178, 122, 255)
KARTON = (190, 150, 98, 255)
KARTON_DUNKEL = (156, 118, 76, 255)
ETIKETT = (244, 240, 226, 255)
TINTE = (58, 50, 62, 255)
MAPPE = (120, 150, 132, 255)
MAPPE_B = (176, 96, 80, 255)
PAPIER = (240, 232, 208, 255)
PAPIER_ALT = (222, 204, 160, 255)
FLECK = (30, 44, 64, 96)
FLECK_RAND = (30, 44, 64, 52)

# Ziffern 3 × 5 für die Jahreszahlen (schilder.py kennt nur Großbuchstaben).
ZIFFERN = {
    "0": ("###", "#.#", "#.#", "#.#", "###"),
    "1": (".#.", "##.", ".#.", ".#.", "###"),
    "2": ("###", "..#", "###", "#..", "###"),
    "3": ("###", "..#", ".##", "..#", "###"),
    "4": ("#.#", "#.#", "###", "..#", "..#"),
    "5": ("###", "#..", "###", "..#", "###"),
    "6": ("###", "#..", "###", "#.#", "###"),
    "7": ("###", "..#", ".#.", ".#.", ".#."),
    "8": ("###", "#.#", "###", "#.#", "###"),
    "9": ("###", "#.#", "###", "..#", "###"),
}
ZIFFER_B = 4  # Breite einer Ziffer mit Abstand
KARTON_B = 24  # Breite eines Archivkartons in der Reihe
JAHRE_OBEN = ("1810", "1820", "1830", "1840")
JAHRE_UNTEN = ("1850", "1860", "1870", "1880")

REGAL = (
    "modern-interiors/1_Interiors/16x16/Theme_Sorter_Black_Shadow_Singles/"
    "5_Classroom_and_Library_Black_Shadow_Singles_16x16/Classroom_and_Library_Singles_71.png"
)
WASCHMASCHINE = (
    "modern-interiors/1_Interiors/16x16/Theme_Sorter_Black_Shadow_Singles/"
    "3_Bathroom_Black_Shadow_Singles_16x16/Bathroom_Black_Shadow_Singles_90.png"
)


def zahl(z: ImageDraw.ImageDraw, text: str, x: int, y: int, farbe: tuple) -> None:
    """Schreibt eine Zahl in der 3 × 5-Schrift ab (x, y)."""
    for i, zeichen in enumerate(text):
        for dy, zeile in enumerate(ZIFFERN[zeichen]):
            for dx, punkt in enumerate(zeile):
                if punkt == "#":
                    z.point((x + i * ZIFFER_B + dx, y + dy), fill=farbe)


def _archivkarton(z: ImageDraw.ImageDraw, x: int, jahr: str, offen: bool) -> None:
    """Ein Karton ab x: Deckel oben (hell), Vorderseite mit Etikett und Jahreszahl. Offen: statt
    des Deckels schauen zwei Mappen heraus, der Deckel lehnt hochgeklappt dahinter."""
    z.rectangle((x + 1, 8, x + 22, 29), fill=RAHMEN)
    z.rectangle((x + 2, 15, x + 21, 28), fill=KARTON)
    z.line((x + 2, 28, x + 21, 28), fill=KARTON_DUNKEL)
    if offen:
        z.rectangle((x + 1, 3, x + 22, 9), fill=RAHMEN)  # hochgeklappter Deckel
        z.rectangle((x + 2, 4, x + 21, 8), fill=KARTON_DUNKEL)
        z.rectangle((x + 2, 9, x + 21, 14), fill=TINTE)  # Inneres
        z.rectangle((x + 4, 9, x + 10, 14), fill=MAPPE)
        z.rectangle((x + 12, 10, x + 19, 14), fill=MAPPE_B)
        z.line((x + 5, 10, x + 9, 10), fill=PAPIER)
    else:
        z.rectangle((x + 2, 9, x + 21, 14), fill=KARTON_HELL)
        z.line((x + 2, 14, x + 21, 14), fill=KARTON_DUNKEL)
    z.rectangle((x + 3, 18, x + 20, 26), fill=ETIKETT)
    zahl(z, jahr, x + 5, 20, TINTE)


def archivkartons(jahre: tuple[str, ...], offen: int | None) -> Image.Image:
    """Reihe aus vier Archivkartons 96 × 32 mit Schatten; ``offen`` ist die Nummer des offenen."""
    bild = Image.new("RGBA", (KARTON_B * len(jahre), 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 29, bild.width - 2, 31), fill=SCHATTEN)
    for i, jahr in enumerate(jahre):
        _archivkarton(z, i * KARTON_B, jahr, i == offen)
    return bild


SPRINGER = (
    "........######..........",
    "......##########........",
    ".....#############......",
    "...################.....",
    "..##################....",
    ".####################...",
    ".#####################..",
    ".######..#############..",
    "..###.....############..",
    "..........############..",
    ".........#############..",
    "........#############...",
    ".......##############...",
    "......################..",
    ".....##################.",
    ".....##################.",
)


def wasserfleck_springer() -> Image.Image:
    """Wasserfleck 48 × 32: das Springermuster doppelt so groß, mit hellerem, ausgefranstem Rand."""
    bild = Image.new("RGBA", (48, 32))
    pixel = bild.load()
    for y, zeile in enumerate(SPRINGER):
        for x, punkt in enumerate(zeile):
            if punkt != "#":
                continue
            for dx in range(2):
                for dy in range(2):
                    pixel[2 * x + dx, 2 * y + dy] = FLECK
    for y in range(32):  # Rand: Flecken, die an Leeres grenzen, werden heller
        for x in range(48):
            nachbarn = [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
            aussen = any(not (0 <= a < 48 and 0 <= b < 32) or pixel[a, b][3] == 0 for a, b in nachbarn)
            if pixel[x, y][3] and aussen:
                pixel[x, y] = FLECK_RAND
    return bild


def abgedunkelt(haupt: Path, quelle: str, faktor: float, blau: int) -> Image.Image:
    """Ein Bild dunkler und bläulicher (Schatten): jede Farbe mal ``faktor``, Blau plus ``blau``."""
    bild = Image.open(haupt / quelle).convert("RGBA")
    pixel = bild.load()
    for y in range(bild.height):
        for x in range(bild.width):
            r, g, b, a = pixel[x, y]
            pixel[x, y] = (round(r * faktor), round(g * faktor), min(255, round(b * faktor) + blau), a)
    return bild


def buch_offen_klein() -> Image.Image:
    """Aufgeschlagenes Buch 12 × 8: zwei helle Seiten mit Zeilen, dunkler Rücken in der Mitte."""
    bild = Image.new("RGBA", (12, 8))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 1, 11, 7), fill=RAHMEN)
    z.rectangle((1, 2, 5, 6), fill=PAPIER)
    z.rectangle((6, 2, 10, 6), fill=PAPIER)
    z.line((5, 2, 5, 6), fill=PAPIER_ALT)
    for y in (3, 5):
        z.line((2, y, 4, y), fill=KARTON_DUNKEL)
        z.line((7, y, 9, y), fill=KARTON_DUNKEL)
    return bild


def programmheft() -> Image.Image:
    """Programmheft 8 × 8: vergilbtes Blatt mit dunklem Titelstreifen und zwei Zeilen."""
    bild = Image.new("RGBA", (8, 8))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, 6, 7), fill=RAHMEN)
    z.rectangle((1, 1, 5, 6), fill=PAPIER_ALT)
    z.line((1, 2, 5, 2), fill=MAPPE_B)
    z.line((2, 4, 4, 4), fill=TINTE)
    z.point((3, 5), fill=TINTE)
    return bild


TROCKNER_WARM = (232, 170, 96, 255)
TROCKNER_GLUT = (196, 120, 70, 255)
SCHLITZ = (120, 124, 140, 255)
BULLAUGE = (3, 16, 12, 21)  # Inneres des Bullauges in LimeZus Waschmaschine (x0, y0, x1, y1)


def trockner_schmal(haupt: Path, mit_brett: bool) -> Image.Image:
    """Trockner 16 × 32 aus LimeZus Waschmaschine: Das dunkle Innere des Bullauges glüht warm, über
    dem Bullauge sitzen Lüftungsschlitze. Mit ``mit_brett`` klebt oben das Steckschachbrett."""
    bild = Image.open(haupt / WASCHMASCHINE).convert("RGBA")
    pixel = bild.load()
    for y in range(BULLAUGE[1], BULLAUGE[3] + 1):
        for x in range(BULLAUGE[0], BULLAUGE[2] + 1):
            if pixel[x, y] == RAHMEN:  # dunkles Inneres
                pixel[x, y] = TROCKNER_WARM if y <= BULLAUGE[1] + 2 else TROCKNER_GLUT
    z = ImageDraw.Draw(bild)
    oben = next(y for y in range(bild.height) if any(pixel[x, y][3] for x in range(bild.width)))
    for y in (oben + 9, oben + 11):
        z.line((4, y, 11, y), fill=SCHLITZ)
    if mit_brett:
        z.rectangle((4, oben + 1, 12, oben + 7), fill=RAHMEN)
        for by in range(5):
            for bx in range(7):
                hell = (bx + by) % 2 == 0
                z.point((5 + bx, oben + 2 + by), fill=ETIKETT if hell else KARTON_DUNKEL)
        z.point((6, oben + 3), fill=MAPPE_B)  # zwei Stecker
        z.point((10, oben + 5), fill=TINTE)
    return bild


def comicheft() -> Image.Image:
    """Comicheft 8 × 8: blaues Titelbild, gelber Titelbalken, roter Fleck als Figur."""
    bild = Image.new("RGBA", (8, 8))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, 6, 7), fill=RAHMEN)
    z.rectangle((1, 1, 5, 6), fill=(74, 132, 200, 255))
    z.line((1, 1, 5, 1), fill=(246, 210, 70, 255))
    z.rectangle((2, 3, 4, 5), fill=(214, 70, 60, 255))
    z.point((3, 3), fill=ETIKETT)
    return bild


HUT_HELL = (236, 214, 200, 255)
HUT_STREIFEN = (190, 110, 120, 255)
HUT_BAND = (120, 60, 80, 255)


def hutschachtel_klein() -> Image.Image:
    """Hutschachtel 16 × 16: runder Deckel von schräg oben, gestreifte Wand, Band mit Schleife."""
    bild = Image.new("RGBA", (16, 16))
    z = ImageDraw.Draw(bild)
    z.ellipse((2, 11, 13, 15), fill=SCHATTEN)
    z.rectangle((2, 6, 13, 12), fill=RAHMEN)
    z.ellipse((2, 9, 13, 14), fill=RAHMEN)
    z.rectangle((3, 7, 12, 11), fill=HUT_HELL)
    z.ellipse((3, 9, 12, 13), fill=HUT_HELL)
    for x in (4, 7, 10):
        z.line((x, 8, x, 12), fill=HUT_STREIFEN)
    z.ellipse((1, 2, 14, 9), fill=RAHMEN)
    z.ellipse((2, 3, 13, 8), fill=HUT_HELL)
    z.line((2, 5, 13, 5), fill=HUT_BAND)
    z.rectangle((7, 4, 8, 6), fill=HUT_BAND)
    z.point((6, 3), fill=HUT_BAND)
    z.point((9, 3), fill=HUT_BAND)
    return bild


LAUB = ((206, 72, 44, 255), (232, 128, 48, 255), (240, 176, 64, 255), (170, 52, 40, 255))
TAGESLICHT = (226, 238, 244, 255)
GLASFARBEN = {(216, 208, 224, 255), (248, 248, 248, 255), (235, 228, 242, 255)}


def _glas(farbe: tuple[int, int, int, int]) -> bool:
    """Glas in LimeZus Sprossenfenster: die drei hellen Flieder- und Weißtöne."""
    return farbe in GLASFARBEN


def fenster_ahorn(haupt: Path, quelle: str) -> Image.Image:
    """Fenster mit Ahornlaub: Jedes Glaspixel wird nach einem festen Muster zu Laub in vier
    Herbstfarben; oben bleibt ein Streifen Himmel."""
    bild = Image.open(haupt / quelle).convert("RGBA")
    pixel = bild.load()
    glas = [y for y in range(bild.height) for x in range(bild.width) if _glas(pixel[x, y])]
    himmel_bis = min(glas) + 2 if glas else 0
    for y in range(bild.height):
        for x in range(bild.width):
            if _glas(pixel[x, y]) and y > himmel_bis:
                pixel[x, y] = LAUB[((x // 2) * 7 + (y // 2) * 3 + (x // 6) * (y // 4)) % len(LAUB)]
    return bild


def fenster_hell(haupt: Path, quelle: str) -> Image.Image:
    """Fenster mit Tageslicht: Das Glas wird hell, fast weiß (Werkstatt am Vormittag)."""
    bild = Image.open(haupt / quelle).convert("RGBA")
    pixel = bild.load()
    for y in range(bild.height):
        for x in range(bild.width):
            if _glas(pixel[x, y]):
                pixel[x, y] = TAGESLICHT
    return bild


def pizzakarton_flach() -> Image.Image:
    """Pizzakarton 16 × 16 von oben: heller, flacher Karton mit rotem Kreis und Fettfleck."""
    bild = Image.new("RGBA", (16, 16))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 13, 14, 15), fill=SCHATTEN)
    z.rectangle((1, 2, 14, 14), fill=RAHMEN)
    z.rectangle((2, 3, 13, 11), fill=(236, 224, 196, 255))
    z.rectangle((2, 12, 13, 13), fill=(204, 188, 154, 255))
    z.ellipse((5, 4, 10, 9), outline=(206, 60, 48, 255))
    z.point((7, 6), fill=(206, 60, 48, 255))
    z.point((8, 7), fill=(206, 60, 48, 255))
    z.rectangle((11, 9, 12, 10), fill=(214, 190, 140, 255))
    return bild


BUCHSTABE_W = ("#...#", "#...#", "#.#.#", "##.##", "#...#")


def karton_whitlock() -> Image.Image:
    """Umzugskarton 48 × 32 mit Etikett „WHITLOCK“: geschlossene Klappen, Klebeband, weißes Etikett
    über die Vorderseite. Drei Kacheln breit, damit die Aufschrift ganz Platz hat."""
    bild = Image.new("RGBA", (48, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((2, 28, 45, 31), fill=SCHATTEN)
    z.rectangle((1, 6, 46, 29), fill=RAHMEN)
    z.rectangle((2, 7, 45, 14), fill=KARTON_HELL)
    z.rectangle((2, 15, 45, 28), fill=KARTON)
    z.line((2, 28, 45, 28), fill=KARTON_DUNKEL)
    z.rectangle((22, 7, 25, 16), fill=PAPIER_ALT)  # Klebeband
    rest = "HITLOCK"  # das W fehlt in schilder.py und wird hier gezeichnet
    breite = len(BUCHSTABE_W[0]) + 1 + textbreite(rest)
    links = (48 - breite) // 2
    z.rectangle((links - 3, 18, links + breite + 2, 26), fill=ETIKETT, outline=RAHMEN)
    for dy, zeile in enumerate(BUCHSTABE_W):
        for dx, punkt in enumerate(zeile):
            if punkt == "#":
                z.point((links + dx, 20 + dy), fill=TINTE)
    schreibe(z, rest, links + len(BUCHSTABE_W[0]) + 1, 20, TINTE)
    return bild


POLSTER_HELL = (226, 96, 92, 255)
POLSTER = (196, 62, 66, 255)
POLSTER_DUNKEL = (150, 44, 54, 255)
CHROM = (170, 174, 190, 255)


def nischenbank(nach_rechts: bool) -> Image.Image:
    """Nischenbank 16 × 32 von der Seite: hohe gepolsterte Lehne außen, Sitzfläche zum Tisch hin,
    Sockel aus Chrom. ``nach_rechts``: Lehne links, der Gast schaut nach rechts; sonst gespiegelt."""
    bild = Image.new("RGBA", (16, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((1, 28, 14, 30), fill=SCHATTEN)
    z.rectangle((1, 2, 7, 28), fill=RAHMEN)  # Lehne
    z.rectangle((2, 3, 6, 25), fill=POLSTER)
    z.line((2, 3, 6, 3), fill=POLSTER_HELL)
    z.line((2, 4, 2, 24), fill=POLSTER_HELL)
    for y in (9, 15, 21):  # Steppnähte
        z.line((3, y, 6, y), fill=POLSTER_DUNKEL)
    z.rectangle((7, 15, 14, 28), fill=RAHMEN)  # Sitz
    z.rectangle((7, 16, 13, 21), fill=POLSTER_HELL)
    z.rectangle((7, 22, 13, 25), fill=POLSTER_DUNKEL)
    z.rectangle((2, 26, 13, 27), fill=CHROM)
    return bild if nach_rechts else bild.transpose(Image.Transpose.FLIP_LEFT_RIGHT)


REGALHOLZ = (150, 100, 66, 255)
REGALHOLZ_DUNKEL = (110, 72, 50, 255)
ZEILE = (150, 150, 160, 255)


def zeitungsregal() -> Image.Image:
    """Zeitungsregal 32 × 48: zwei Seitenwangen, drei Stangen, über jeder vier hängende Zeitungen;
    unten Schatten. Niedriger als die Bücherregale (das Bild beginnt 14 Pixel unter dem Rand)."""
    bild = Image.new("RGBA", (32, 48))
    z = ImageDraw.Draw(bild)
    z.rectangle((2, 44, 29, 46), fill=SCHATTEN)
    z.rectangle((1, 14, 30, 45), fill=RAHMEN)
    z.rectangle((2, 15, 29, 44), fill=REGALHOLZ_DUNKEL)
    for x in (2, 28):  # Wangen
        z.rectangle((x, 15, x + 1, 44), fill=REGALHOLZ)
    for reihe in range(3):
        y = 16 + reihe * 10
        z.line((4, y, 27, y), fill=REGALHOLZ)  # Stange
        for i in range(4):
            x = 5 + i * 6
            z.rectangle((x, y + 1, x + 4, y + 7), fill=PAPIER if (i + reihe) % 2 else ETIKETT)
            z.line((x, y + 2, x + 4, y + 2), fill=TINTE)  # Kopfzeile
            z.line((x + 1, y + 4, x + 3, y + 4), fill=ZEILE)
            z.line((x + 1, y + 6, x + 3, y + 6), fill=ZEILE)
    return bild


def fenster_quelle(oeffentlich: Path, name: str) -> str:
    """Quelle eines Möbels aus dem öffentlichen Katalog (``inhalte/abenteuer/moebel``), damit das
    Fenster dasselbe Bild nimmt wie die Karte."""
    import json

    for datei in sorted((oeffentlich / "inhalte" / "abenteuer" / "moebel").glob("*.json")):
        katalog = json.loads(datei.read_text(encoding="utf-8"))
        eintrag = katalog.get("moebel", katalog).get(name)
        if isinstance(eintrag, dict):
            return eintrag["quelle"]
    raise SystemExit(f"Möbel {name} nicht gefunden")


def main(haupt: Path, oeffentlich: Path) -> None:
    ziel = haupt / "spiel" / "eigene"
    archivkartons(JAHRE_OBEN, None).save(ziel / "archivkartons_oben.png")
    archivkartons(JAHRE_UNTEN, 0).save(ziel / "archivkartons_unten.png")
    wasserfleck_springer().save(ziel / "wasserfleck_springer.png")
    abgedunkelt(haupt, REGAL, 0.5, 18).save(ziel / "archivregal_schatten.png")
    buch_offen_klein().save(ziel / "buch_offen_klein.png")
    programmheft().save(ziel / "programmheft.png")
    trockner_schmal(haupt, False).save(ziel / "trockner_schmal.png")
    trockner_schmal(haupt, True).save(ziel / "trockner_steckschach.png")
    comicheft().save(ziel / "comicheft.png")
    hutschachtel_klein().save(ziel / "hutschachtel_klein.png")
    fenster = fenster_quelle(oeffentlich, "mf2Dachfenster")
    fenster_ahorn(haupt, fenster).save(ziel / "fenster_ahorn.png")
    fenster_hell(haupt, fenster).save(ziel / "werkstattfenster.png")
    pizzakarton_flach().save(ziel / "pizzakarton_flach.png")
    karton_whitlock().save(ziel / "karton_whitlock.png")
    zeitungsregal().save(ziel / "zeitungsregal.png")
    nischenbank(True).save(ziel / "nischenbank_rechts.png")
    nischenbank(False).save(ziel / "nischenbank_links.png")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(__file__).resolve().parents[4])
