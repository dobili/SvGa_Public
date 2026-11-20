"""Holzschilder mit Pixelschrift für Gebäude: Brett, Schrift und davor ein kleines Zeichen.

Warum: Beim Tausch flacher Gebäudebilder gegen Bilder mit Tiefe (Blockhütten, Fährhaus aus dunklem
Holz, Marktstände; Regel 10.71) gingen die Schilder verloren, die Teil der alten Bilder waren:
„Bergladen“ und die Bergwacht mit ihrem Kreuz in Summit City, „RANGER“ an den Rangerhäusern,
„KIOSK“ an den Ständen. Das ältere ``docs/spiel/auftraege/bildwuensche/holzschilder.py``
(Waschhaus) kann nur 48 Pixel breite Schilder an Haken und keine Zeichen; hier richtet sich das
Brett nach der Schrift. Schilder sind flach und dürfen selbst gezeichnet werden (10.71). Sie
entstehen hier in der Machart der vorhandenen Schilder (``schild_waschhaus.png``,
``schild_turnhalle.png``): dunkler Rand, helle Kante oben, Holzfläche, dunkle Schrift aus 5 Pixel
hohen Buchstaben.

Aufruf (Bilder liegen nur im privaten Repository):
``python -m pipeline.abenteuer.schildbild PRIVAT`` schreibt je Schild
``PRIVAT/spiel/eigene/<name>.png``. ``--ziel ORDNER`` schreibt woandershin, etwa zur Ansicht.

Aufbau eines Bilds: Das Brett liegt waagrecht mittig in einem Bild, dessen Breite ein Vielfaches
von 16 ist (so setzt die Regel „auf“ des Kartenbaus es mittig auf das Gebäude), und beginnt
``BRETT_OBEN`` Pixel unter dem oberen Bildrand. Das Brett ist immer ``BRETT_HOEHE`` Pixel hoch.
"""

import sys
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

# Farben der vorhandenen Holzschilder (abgelesen aus schild_turnhalle.png).
RAND = (58, 58, 80, 255)
KANTE = (214, 158, 98, 255)
HOLZ = (176, 118, 70, 255)
SCHRIFT = (60, 36, 24, 255)
# Zeichen: Wimpel der Ranger (grün), Kreuz der Bergwacht (rot auf weiß).
WIMPEL = (62, 122, 72, 255)
WEISS = (240, 236, 226, 255)
ROT = (190, 50, 44, 255)
DURCHSICHTIG = (0, 0, 0, 0)

KACHEL = 16
BILD_HOEHE = 16
BRETT_OBEN = 3
SCHRIFT_HOEHE = 5
# Rand, helle Kante, eine Zeile Holz, Schrift, eine Zeile Holz, Rand.
BRETT_HOEHE = SCHRIFT_HOEHE + 5
SCHRIFT_OBEN = 3
ABSTAND = 1  # zwischen zwei Buchstaben
LEERZEICHEN = 2

# Buchstaben, 5 Zeilen hoch, wie auf den vorhandenen Schildern (N vier, M und W fünf Pixel breit).
BUCHSTABEN = {
    "A": (".#.", "#.#", "###", "#.#", "#.#"),
    "B": ("##.", "#.#", "##.", "#.#", "##."),
    "C": ("###", "#..", "#..", "#..", "###"),
    "D": ("##.", "#.#", "#.#", "#.#", "##."),
    "E": ("###", "#..", "##.", "#..", "###"),
    "F": ("###", "#..", "##.", "#..", "#.."),
    "G": ("###", "#..", "#.#", "#.#", "###"),
    "H": ("#.#", "#.#", "###", "#.#", "#.#"),
    "I": ("###", ".#.", ".#.", ".#.", "###"),
    "J": ("..#", "..#", "..#", "#.#", "###"),
    "K": ("#.#", "#.#", "##.", "#.#", "#.#"),
    "L": ("#..", "#..", "#..", "#..", "###"),
    "M": ("#...#", "##.##", "#.#.#", "#...#", "#...#"),
    "N": ("#..#", "##.#", "#.##", "#..#", "#..#"),
    "O": ("###", "#.#", "#.#", "#.#", "###"),
    "P": ("###", "#.#", "###", "#..", "#.."),
    "Q": ("###", "#.#", "#.#", "###", "..#"),
    "R": ("##.", "#.#", "##.", "#.#", "#.#"),
    "S": ("###", "#..", "###", "..#", "###"),
    "T": ("###", ".#.", ".#.", ".#.", ".#."),
    "U": ("#.#", "#.#", "#.#", "#.#", "###"),
    "V": ("#.#", "#.#", "#.#", "#.#", ".#."),
    "W": ("#...#", "#...#", "#.#.#", "##.##", "#...#"),
    "X": ("#.#", "#.#", ".#.", "#.#", "#.#"),
    "Y": ("#.#", "#.#", ".#.", ".#.", ".#."),
    "Z": ("###", "..#", ".#.", "#..", "###"),
}


@dataclass(frozen=True)
class Zeichen:
    """Ein kleines Zeichen links vor der Schrift, so hoch wie sie: Muster, Farben, Abstand zur Schrift."""

    muster: tuple[str, ...]
    farben: dict[str, tuple[int, int, int, int]]
    abstand: int


ZEICHEN = {
    # Wimpel der Ranger am Stock: „|“ Stock, „f“ Fahnentuch.
    "wimpel": Zeichen(("|ff.", "|fff", "|ff.", "|...", "|..."), {"|": SCHRIFT, "f": WIMPEL}, 2),
    # Bergwacht: rotes Kreuz auf weißem Feld. Abstand 1, damit das Schild unter das Dach der Hütte passt.
    "kreuz": Zeichen(("wwrww", "wwrww", "rrrrr", "wwrww", "wwrww"), {"w": WEISS, "r": ROT}, 1),
}


@dataclass(frozen=True)
class Schild:
    """Ein Schild: Aufschrift in Großbuchstaben, Holzrand links und rechts, Zeichen davor (aus ZEICHEN)."""

    text: str
    rand: int = 2
    zeichen: str = ""


# Dateiname ohne Endung → Schild. Schmaler Rand: „schild_kiosk“ hängt am Ausleger des Marktstands und
# soll dort nur das Fischschild verdecken, nicht die Markise; „schild_bergwacht“ muss mit dem Kreuz
# unter das Dach der Blockhütte passen (dort 49 Pixel Wand).
SCHILDER = {
    "schild_bergladen": Schild("BERGLADEN"),
    "schild_bergwacht": Schild("BERGWACHT", rand=1, zeichen="kreuz"),
    "schild_ranger": Schild("RANGER", zeichen="wimpel"),
    "schild_kiosk": Schild("KIOSK", rand=1),
}


def textbreite(text: str) -> int:
    """Breite der Aufschrift in Pixeln. Beispiel: „KIOSK“ → 5 × 3 + 4 × 1 = 19.

    Sonderfall: Ein Zeichen ohne Muster (Umlaut, Ziffer) ist ein Fehler (KeyError), kein Loch im Schild.
    """
    breiten = [LEERZEICHEN if z == " " else len(BUCHSTABEN[z][0]) for z in text]
    return sum(breiten) + ABSTAND * (len(text) - 1)


def brettbreite(schild: Schild) -> int:
    """Breite des Bretts: Rand, Holz, Zeichen, Schrift, Holz, Rand. Beispiel: „KIOSK“, rand 1 → 23."""
    return 2 * (1 + schild.rand) + _zeichenbreite(schild) + textbreite(schild.text)


def _zeichenbreite(schild: Schild) -> int:
    """Breite des Zeichens samt Abstand zur Schrift; 0 ohne Zeichen."""
    if not schild.zeichen:
        return 0
    zeichen = ZEICHEN[schild.zeichen]
    return len(zeichen.muster[0]) + zeichen.abstand


def brett(schild: Schild) -> Image.Image:
    """Das Brett allein (ohne durchsichtigen Rand): dunkler Rahmen, helle Kante oben, Schrift.

    Beispiel: „RANGER“ mit Wimpel → 36 × 10, links der grüne Wimpel, rechts davon die Schrift.
    """
    breite = brettbreite(schild)
    bild = Image.new("RGBA", (breite, BRETT_HOEHE), RAND)
    bild.paste(HOLZ, (1, 1, breite - 1, BRETT_HOEHE - 1))
    bild.paste(KANTE, (1, 1, breite - 1, 2))
    x = 1 + schild.rand
    if schild.zeichen:
        _male(bild, ZEICHEN[schild.zeichen].muster, x, ZEICHEN[schild.zeichen].farben)
        x += _zeichenbreite(schild)
    for zeichen in schild.text:
        if zeichen == " ":
            x += LEERZEICHEN + ABSTAND
            continue
        _male(bild, BUCHSTABEN[zeichen], x, {"#": SCHRIFT})
        x += len(BUCHSTABEN[zeichen][0]) + ABSTAND
    return bild


def _male(bild: Image.Image, muster: tuple[str, ...], links: int, farben: dict[str, tuple]) -> None:
    """Ein Muster aus Zeichen in die Schriftzeilen des Bretts setzen (unbekannte Zeichen bleiben Holz)."""
    for zeile, reihe in enumerate(muster):
        for spalte, zeichen in enumerate(reihe):
            if zeichen in farben:
                bild.putpixel((links + spalte, SCHRIFT_OBEN + zeile), farben[zeichen])


def schildbild(schild: Schild) -> Image.Image:
    """Das fertige Bild: Brett waagrecht mittig, Bildbreite auf ganze Kacheln aufgerundet, 16 hoch.

    Beispiel: „BERGLADEN“ → Brett 42 breit im Bild 48 × 16, je 3 Pixel durchsichtig links und rechts.
    """
    teil = brett(schild)
    breite = -(-teil.width // KACHEL) * KACHEL
    bild = Image.new("RGBA", (breite, BILD_HOEHE), DURCHSICHTIG)
    bild.paste(teil, ((breite - teil.width) // 2, BRETT_OBEN))
    return bild


def alle_bilder() -> dict[str, Image.Image]:
    """Dateiname ohne Endung → Bild, für alle Schilder."""
    return {name: schildbild(schild) for name, schild in SCHILDER.items()}


def main(argv: list[str]) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    if not argv:
        print(__doc__)
        return 1
    privat = Path(argv[0])
    ziel = Path(argv[argv.index("--ziel") + 1]) if "--ziel" in argv else privat / "spiel" / "eigene"
    ziel.mkdir(parents=True, exist_ok=True)
    for name, bild in alle_bilder().items():
        bild.save(ziel / f"{name}.png")
        print(f"{ziel / (name + '.png')} ({bild.width} × {bild.height})")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
