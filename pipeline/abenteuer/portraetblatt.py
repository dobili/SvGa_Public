"""Porträtblatt-Schneider: ein Gemini-Blatt mit Gesichtern auf grünem Grund → Spielblatt 3×2 à 64.

Warum: Die Porträtblätter (app/src/abenteuer/dialog/portraetblatt.ts) haben je Figur sechs
Fassungen à 64 × 64 Pixel in 3 Spalten und 2 Zeilen (inhalte/abenteuer/portraetblatt.json). Gemini
liefert sie als großes Bild auf grünem Grund (#00FF00), oft mit dunklen Trennlinien und mit
Pixeln, die zu Blöcken vergrößert sind. Von Hand zuschneiden ist mühsam und ungenau (Auftrag des
Haupt-Chats, 13.11.2026).

Aufruf: ``python -m pipeline.abenteuer.portraetblatt EINGABE.png AUSGABE.png [--raster 3x2]``.

Ablauf: Grün und durchgehende dunkle Trennlinien werden durchsichtig; die Felder ergeben sich aus
den Trennlinien, sonst aus gleichmäßiger Teilung nach dem Raster. Je Feld wird das Pixelraster
erkannt (Blockgröße aus den Farbwechseln), jeder Block an seiner Mitte abgetastet (nearest) und
das Ergebnis unten bündig und mittig in 64 × 64 gesetzt; ist es größer, wird es nearest verkleinert.
"""

import sys

from PIL import Image

FELD = 64
RASTER = (3, 2)
# Grün des Hintergrunds: deutlich grüner als rot und blau (verträgt JPEG-Säume).
GRUEN_MIN, GRUEN_ABSTAND = 150, 80
# Trennlinie: fast schwarz über (fast) die ganze Breite oder Höhe des Blatts.
DUNKEL_MAX, LINIENANTEIL = 70, 0.9
# Farbwechsel ab dieser Summe der Kanalabstände; Blockgrößen, die geprüft werden.
WECHSEL = 60
BLOCK_BIS = 40
# So viele Wechsel müssen auf das Raster fallen, damit eine Blockgröße gilt.
TREFFERANTEIL = 0.8


def ist_gruen(p: tuple[int, ...]) -> bool:
    r, g, b = p[:3]
    return g >= GRUEN_MIN and g - max(r, b) >= GRUEN_ABSTAND


def ist_dunkel(p: tuple[int, ...]) -> bool:
    return max(p[:3]) <= DUNKEL_MAX


def trennlinien(bild: Image.Image, waagrecht: bool) -> list[int]:
    """Zeilen (waagrecht) oder Spalten, die fast ganz dunkel sind."""
    breite, hoehe = bild.size
    px = bild.load()
    laenge, anzahl = (breite, hoehe) if waagrecht else (hoehe, breite)
    linien = []
    for i in range(anzahl):
        dunkel = sum(ist_dunkel(px[j, i] if waagrecht else px[i, j]) for j in range(laenge))
        if dunkel >= LINIENANTEIL * laenge:
            linien.append(i)
    return linien


def abschnitte(groesse: int, linien: list[int], teile: int) -> list[tuple[int, int]]:
    """Bereiche zwischen den Trennlinien; passen sie nicht zum Raster, gleichmäßige Teilung."""
    bereiche, start = [], 0
    for linie in sorted(linien) + [groesse]:
        if linie > start:
            bereiche.append((start, linie))
        start = linie + 1
    if len(bereiche) == teile:
        return bereiche
    schritt = groesse / teile
    return [(round(i * schritt), round((i + 1) * schritt)) for i in range(teile)]


def freistellen(bild: Image.Image) -> Image.Image:
    """Grün und Trennlinien durchsichtig (Kopie)."""
    frei = bild.convert("RGBA")
    px = frei.load()
    breite, hoehe = frei.size
    for y in range(hoehe):
        for x in range(breite):
            if ist_gruen(px[x, y]):
                px[x, y] = (0, 0, 0, 0)
    for y in trennlinien(bild.convert("RGB"), True):
        for x in range(breite):
            px[x, y] = (0, 0, 0, 0)
    for x in trennlinien(bild.convert("RGB"), False):
        for y in range(hoehe):
            px[x, y] = (0, 0, 0, 0)
    return frei


def _wechsel(feld: Image.Image, waagrecht: bool) -> list[int]:
    """Positionen, an denen sich die Farbe zum Nachbarn deutlich ändert (über alle Zeilen)."""
    px = feld.load()
    breite, hoehe = feld.size
    positionen = []
    aussen, innen = (hoehe, breite) if waagrecht else (breite, hoehe)
    for a in range(aussen):
        for i in range(1, innen):
            p, q = (px[i - 1, a], px[i, a]) if waagrecht else (px[a, i - 1], px[a, i])
            if sum(abs(u - v) for u, v in zip(p, q, strict=True)) >= WECHSEL:
                positionen.append(i)
    return positionen


def blockgroesse(feld: Image.Image) -> tuple[int, int, int]:
    """(Blockgröße, Versatz x, Versatz y) des Pixelrasters; (1, 0, 0), wenn keines erkennbar ist.

    Die größte Blockgröße, auf deren Raster fast alle Farbwechsel fallen, gilt. Beispiel: ein Bild
    aus 5 × 5 großen Blöcken → (5, 0, 0).
    """
    xs, ys = _wechsel(feld, True), _wechsel(feld, False)
    if not xs or not ys:
        return 1, 0, 0
    for groesse in range(BLOCK_BIS, 1, -1):
        bester = []
        for wechsel in (xs, ys):
            zaehler = [0] * groesse
            for w in wechsel:
                zaehler[w % groesse] += 1
            versatz = max(range(groesse), key=zaehler.__getitem__)
            bester.append((zaehler[versatz] / len(wechsel), versatz))
        if all(anteil >= TREFFERANTEIL for anteil, _ in bester):
            return groesse, bester[0][1], bester[1][1]
    return 1, 0, 0


def abtasten(feld: Image.Image) -> Image.Image:
    """Das Feld im echten Pixelraster: je Block das Pixel in seiner Mitte, ohne leeren Rand."""
    rahmen = feld.getbbox()
    if not rahmen:
        return Image.new("RGBA", (1, 1))
    groesse, vx, vy = blockgroesse(feld.convert("RGB"))
    if groesse == 1:
        return feld.crop(rahmen)
    breite = (feld.width - vx) // groesse
    hoehe = (feld.height - vy) // groesse
    klein = Image.new("RGBA", (max(breite, 1), max(hoehe, 1)))
    px, ziel = feld.load(), klein.load()
    for y in range(hoehe):
        for x in range(breite):
            ziel[x, y] = px[vx + x * groesse + groesse // 2, vy + y * groesse + groesse // 2]
    return klein.crop(klein.getbbox() or (0, 0, 1, 1))


def ins_feld(bild: Image.Image, feld: int = FELD) -> Image.Image:
    """Unten bündig und mittig in ein Feld; größer als das Feld: nearest verkleinert."""
    if bild.width > feld or bild.height > feld:
        faktor = feld / max(bild.width, bild.height)
        groesse = (max(1, round(bild.width * faktor)), max(1, round(bild.height * faktor)))
        bild = bild.resize(groesse, Image.Resampling.NEAREST)
    rahmen = Image.new("RGBA", (feld, feld))
    rahmen.paste(bild, ((feld - bild.width) // 2, feld - bild.height))
    return rahmen


def schneide(eingabe: Image.Image, raster: tuple[int, int] = RASTER) -> Image.Image:
    """Das Spielblatt (Spalten × Zeilen à 64) aus einem Gemini-Blatt; Felder zeilenweise."""
    spalten, zeilen = raster
    rgb = eingabe.convert("RGB")
    frei = freistellen(eingabe)
    xs = abschnitte(rgb.width, trennlinien(rgb, False), spalten)
    ys = abschnitte(rgb.height, trennlinien(rgb, True), zeilen)
    blatt = Image.new("RGBA", (spalten * FELD, zeilen * FELD))
    for zeile, (y0, y1) in enumerate(ys):
        for spalte, (x0, x1) in enumerate(xs):
            feld = ins_feld(abtasten(frei.crop((x0, y0, x1, y1))))
            blatt.paste(feld, (spalte * FELD, zeile * FELD))
    return blatt


def main(argv: list[str]) -> int:
    raster = RASTER
    if "--raster" in argv:
        i = argv.index("--raster")
        spalten, _, zeilen = argv[i + 1].partition("x")
        raster = (int(spalten), int(zeilen))
        argv = argv[:i] + argv[i + 2 :]
    if len(argv) != 2:
        print(__doc__)
        return 1
    blatt = schneide(Image.open(argv[0]), raster)
    blatt.save(argv[1])
    print(f"{argv[1]}: {raster[0]} × {raster[1]} Felder à {FELD} Pixel")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
