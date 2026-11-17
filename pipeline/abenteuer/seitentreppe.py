"""Seitliche Holztreppe in der Kartenperspektive (schräg von oben), nach rechts und nach links.

Warum: Für Treppen, die quer im Raum nach rechts oder links ansteigen, gab es nur die Treppe zum
Betrachter (``treppeZumBetrachter``, ``spiel/eigene/treppe_zum_betrachter.png`` des Autors). Geminis
Bild ``ki-roh/Gemini_Generated_Image_r7ivecr7ivecr7iv.jpg`` (16.11.2026) zeigt eine Treppe nach
rechts, aber als reine Seitenansicht: Setzstufen und Geländer im Profil, keine Trittflächen von
oben. Daraus lässt sich die Draufsicht der Karten (top-down 3/4 wie LimeZu) nicht sinnvoll
umrechnen, es fehlt die Fläche, auf der man geht (Auftrag des Hauptchats, 17.11.2026). Dieses
Werkzeug setzt die Treppe deshalb aus Farben und Bauweise der Treppe zum Betrachter zusammen.

Bauweise (Bild ``BREITE`` × ``HOEHE`` Pixel, 4 × 3 Kacheln; Licht von links oben wie die Vorlage):

- **Stufen** als senkrechte Draufsicht-Streifen vom Antritt (links) bis zum Absatz (rechts). Jede
  Stufe hat links ihre Vorderkante im Glanzton, dann die Trittfläche, rechts Schatten und die dunkle
  Fuge zur nächsten Stufe; die obere Hälfte ist heller wie bei der Vorlage (nähere Stufen heller).
- **Anstieg:** Jede Stufe liegt ``HUB`` Pixel höher als die vorige. Die Trittfläche beginnt oben am
  schrägen Handlauf und endet unten abgesetzt; darunter zeigt die Wange (dunkles Holz) die
  Stufenkanten als Sägezahn, so liest man die Höhe.
- **Handläufe** stufenlos schräg (Profil aus den Holmen der Vorlage: Kontur, Glanz, Holz, Mittel),
  der vordere so hoch, dass die Stufenkanten darunter sichtbar bleiben; Pfosten an beiden Enden.
- **Nach links** ist die gespiegelte Bauweise; Pfostenköpfe und Vorderkanten behalten das Licht
  von links oben (sie werden nicht gespiegelt, sondern neu gezeichnet).
- Grund durchsichtig; der Kontaktbogen legt die Bilder auf Grün neben die Vorlage, vergrößert.

Farben liest das Werkzeug an festen Stellen der Vorlage (``FARBSTELLEN``); fehlt die Vorlage, gelten
dieselben Werte aus ``FARBEN``. Geometrie und Masken gehen ohne Pillow.

Aufruf (Bilder liegen nur im privaten Repository):
``python -m pipeline.abenteuer.seitentreppe PRIVAT`` schreibt
``PRIVAT/spiel/eigene/treppe_nach_rechts.png`` und ``treppe_nach_links.png``; ``--ziel ORDNER``
schreibt woandershin, ``--bogen DATEI`` legt den Kontaktbogen an, ``--masken`` gibt die feinen
Kollisionsmasken (``maske_fein``) für den Katalog aus.
"""

import json
import sys
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:  # Pillow nur zum Zeichnen
    from PIL import Image

K = 16
BREITE = 4 * K
HOEHE = 3 * K
FEIN = 4  # Kantenlänge einer Zelle der feinen Maske (Viertelkachel)
STUFEN = 6
HUB = 3  # so viel höher liegt jede Stufe (Pixel)
PFOSTEN = 5  # Breite der Pfosten an beiden Enden
ABSATZ = 8  # Breite des Absatzes oben (Pixel)
TRITT = 22  # Höhe der Trittfläche quer zur Laufrichtung (Pixel)
LAUF_VON = PFOSTEN
LAUF_BIS = BREITE - PFOSTEN - ABSATZ
VORLAGE = Path("spiel/eigene/treppe_zum_betrachter.png")

Farbe = tuple[int, int, int, int]
# Rollen der Holzfarben und ihre Stelle in der Vorlage (x, y); Werte vom 17.11.2026 als Ersatz.
FARBSTELLEN = {
    "dunkel": (0, 62),
    "schatten": (24, 20),
    "tief": (24, 26),
    "mittel": (2, 30),
    "holz": (3, 30),
    "hell": (24, 37),
    "hell2": (2, 62),
    "glanz": (1, 62),
}
FARBEN: dict[str, Farbe] = {
    "dunkel": (53, 29, 28, 255),
    "schatten": (84, 51, 43, 255),
    "tief": (127, 79, 60, 255),
    "mittel": (139, 88, 65, 255),
    "holz": (181, 119, 78, 255),
    "hell": (204, 141, 87, 255),
    "hell2": (227, 170, 103, 255),
    "glanz": (242, 197, 128, 255),
}
HOLM_ROLLEN = ("dunkel", "glanz", "holz", "mittel", "dunkel")
HOLM = len(HOLM_ROLLEN)
LEER, SPERRT, GEHT = ".", "#", "~"  # Pixelarten für die Maske


def stufe_bei(x: int) -> int:
    """Stufe (0 = Antritt) an der Spalte ``x`` vom Antritt aus; der Absatz zählt als ``STUFEN``.

    Beispiel: ``stufe_bei(5)`` → 0, ``stufe_bei(50)`` → 5, ``stufe_bei(60)`` → 6 (Absatz).
    """
    if x < LAUF_VON:
        return 0
    if x >= LAUF_BIS:
        return STUFEN
    return min(STUFEN - 1, (x - LAUF_VON) * STUFEN // (LAUF_BIS - LAUF_VON))


def handlauf_oben(x: int) -> int:
    """Oberkante des hinteren Handlaufs an der Spalte ``x``: stufenlos von ``STUFEN·HUB`` bis 0."""
    voll = STUFEN * HUB
    anteil = (x - LAUF_VON) / (LAUF_BIS - LAUF_VON)
    return voll - max(0, min(voll, round(voll * anteil)))


def trittboden(x: int) -> int:
    """Erste Pixelreihe unter der Trittfläche an der Spalte ``x`` (je Stufe abgesetzt)."""
    return STUFEN * HUB - stufe_bei(x) * HUB + HOLM + TRITT


def vorderer_holm(x: int) -> int:
    """Oberkante des vorderen Handlaufs: so hoch, dass die Stufenkanten darunter sichtbar bleiben."""
    return handlauf_oben(x) + TRITT - 4


def trittrolle(x: int) -> str:
    """Farbrolle der Trittfläche an der Spalte ``x``: Vorderkante, Fläche, Schatten, Fuge."""
    if not LAUF_VON <= x < LAUF_BIS:
        return "hell2"
    breite = (LAUF_BIS - LAUF_VON) / STUFEN
    k = stufe_bei(x)
    rel = (x - LAUF_VON) - k * breite
    if rel < 1:
        return "glanz"
    if rel < breite - 2:
        return "hell2" if k >= STUFEN // 2 else "hell"
    return "tief" if rel < breite - 1 else "dunkel"


def spaltenrollen(x: int) -> list[tuple[int, str, str]]:
    """Die Pixel einer Spalte als (Reihe, Rolle, Art), Art ``SPERRT`` oder ``GEHT``; Rest leer."""
    oben = handlauf_oben(x)
    boden = trittboden(x)
    pixel = [(y, trittrolle(x), GEHT) for y in range(oben + HOLM, boden)]
    for y in range(boden, HOEHE):
        rolle = "dunkel" if y in (boden, HOEHE - 1) else ("mittel" if y == boden + 1 else "schatten")
        pixel.append((y, rolle, SPERRT))
    for start in (oben, vorderer_holm(x)):
        pixel += [(start + i, rolle, SPERRT) for i, rolle in enumerate(HOLM_ROLLEN)]
    return pixel


def pfostenpixel(geo_x: int) -> list[tuple[int, int, str]]:
    """Pixel der zwei Pfosten an einem Ende (``geo_x`` 0 oder ``BREITE - PFOSTEN``): (dx, y, Rolle).

    Licht von links oben: Kopfzeile und linke Innenspalte im Glanzton, Kontur dunkel.
    """
    oben = handlauf_oben(geo_x)
    pixel = []
    for start in (oben, vorderer_holm(geo_x)):
        for dx in range(PFOSTEN):
            for dy in range(HOLM + 1):
                rand = dx in (0, PFOSTEN - 1) or dy in (0, HOLM)
                rolle = "dunkel" if rand else ("glanz" if 1 in (dx, dy) else "holz")
                pixel.append((dx, start + dy, rolle))
    return pixel


def raster(rechts: bool = True) -> list[list[tuple[str, str]]]:
    """Das Bild als Raster aus (Rolle, Art), ohne Pillow; ``rechts`` False spiegelt die Bauweise."""
    zellen = [[("", LEER)] * BREITE for _ in range(HOEHE)]
    for xs in range(BREITE):
        x = xs if rechts else BREITE - 1 - xs
        for y, rolle, art in spaltenrollen(x):
            if 0 <= y < HOEHE:
                zellen[y][xs] = (rolle, art)
    for geo in (0, BREITE - PFOSTEN):
        links = geo if rechts else BREITE - PFOSTEN - geo
        for dx, y, rolle in pfostenpixel(geo):
            if 0 <= y < HOEHE:
                zellen[y][links + dx] = (rolle, SPERRT)
    return zellen


def feinmaske(rechts: bool = True) -> list[str]:
    """Feine Kollisionsmaske (Viertelkacheln): ``#``, wo Holme, Pfosten und Wange überwiegen.

    Der Antritt (erste Spalte unten am Lauf) und die Trittfläche zwischen den Handläufen bleiben frei.
    """
    zellen = raster(rechts)
    zeilen = []
    for zy in range(0, HOEHE, FEIN):
        zeile = ""
        for zx in range(0, BREITE, FEIN):
            arten = [zellen[zy + dy][zx + dx][1] for dy in range(FEIN) for dx in range(FEIN)]
            zeile += SPERRT if 2 * arten.count(SPERRT) > FEIN * FEIN else LEER
        zeilen.append(zeile)
    return zeilen


def farben(privat: Path | None) -> dict[str, Farbe]:
    """Die Holzfarben aus der Vorlage im privaten Repository, sonst ``FARBEN``."""
    pfad = privat / VORLAGE if privat else None
    if not pfad or not pfad.exists():
        return dict(FARBEN)
    from PIL import Image

    vorlage = Image.open(pfad).convert("RGBA")
    return {rolle: vorlage.getpixel(stelle) for rolle, stelle in FARBSTELLEN.items()}


def zeichne(farbe: dict[str, Farbe], rechts: bool = True) -> "Image.Image":
    """Die Treppe als RGBA-Bild mit durchsichtigem Grund."""
    from PIL import Image

    bild = Image.new("RGBA", (BREITE, HOEHE), (0, 0, 0, 0))
    punkte = bild.load()
    for y, zeile in enumerate(raster(rechts)):
        for x, (rolle, art) in enumerate(zeile):
            if art != LEER:
                punkte[x, y] = farbe[rolle]
    return bild


def kontaktbogen(bilder: list["Image.Image"], massstab: int = 6) -> "Image.Image":
    """Bilder nebeneinander auf Grün, vergrößert (Vorlage zuerst), zum Ansehen."""
    from PIL import Image

    luecke = 2 * K
    breite = sum(b.width for b in bilder) + luecke * (len(bilder) + 1)
    hoehe = max(b.height for b in bilder) + 2 * luecke
    bogen = Image.new("RGBA", (breite * massstab, hoehe * massstab), (60, 160, 60, 255))
    x = luecke
    for b in bilder:
        gross = b.convert("RGBA").resize((b.width * massstab, b.height * massstab), Image.NEAREST)
        bogen.alpha_composite(gross, (x * massstab, luecke * massstab))
        x += b.width + luecke
    return bogen


def masken() -> dict[str, list[str]]:
    """Die feinen Masken beider Richtungen (für den Katalog, ``--masken``)."""
    return {"treppeNachRechts": feinmaske(True), "treppeNachLinks": feinmaske(False)}


def main(argv: list[str]) -> int:
    if "--masken" in argv:
        print(json.dumps(masken(), ensure_ascii=False, indent=2))
        return 0
    if not argv:
        print(__doc__)
        return 1
    from PIL import Image

    privat = Path(argv[0])
    ziel = Path(argv[argv.index("--ziel") + 1]) if "--ziel" in argv else privat / "spiel" / "eigene"
    ziel.mkdir(parents=True, exist_ok=True)
    farbe = farben(privat)
    bilder = {"treppe_nach_rechts": zeichne(farbe, True), "treppe_nach_links": zeichne(farbe, False)}
    for name, bild in bilder.items():
        bild.save(ziel / f"{name}.png")
        print(ziel / f"{name}.png")
    if "--bogen" in argv:
        vorlage = [Image.open(privat / VORLAGE)] if (privat / VORLAGE).exists() else []
        bogen = Path(argv[argv.index("--bogen") + 1])
        kontaktbogen(vorlage + list(bilder.values())).save(bogen)
        print(bogen)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
