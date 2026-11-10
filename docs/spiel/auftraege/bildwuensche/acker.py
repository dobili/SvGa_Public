"""Ackerflächen in beliebiger Größe (spiel/eigene/acker_<B>x<H>.png).

Warum: Auf dem Kanalweg hatte das Feld von Mr. Dale denselben Erdboden wie der Trampelweg; der
Autor wollte echte Beete (Revision 2, 10.11.2026). Die Bauernhof-Grafik hat gepflügten Ackerboden
nur als Bauteile (Topsoil_Arable_Big_Modular_*: Ecken, Kanten, Mitte). Hier werden sie zu fertigen
Feldern gelegt, auf die die Feldfrüchte als Objekte mit ``auf`` gesetzt werden.

Größen: Breite 3 bis 10, Höhe 3 bis 8 Kacheln. Aufruf: ``python werkzeuge/acker.py``.
"""

from pathlib import Path

from PIL import Image

HAUPT = Path(__file__).resolve().parents[1]
ZIEL = HAUPT / "spiel" / "eigene"
TEILE = HAUPT / "modern-farm/Single_Files_16x16/Fences_16x16"
K = 16


def teil(zeile: str, spalte: str) -> Image.Image:
    return Image.open(TEILE / f"Topsoil_Arable_Big_Modular_{zeile}_{spalte}_16x16.png").convert("RGBA")


def acker(breite: int, hoehe: int) -> Image.Image:
    """Feld aus Ecken, Kanten und Mitte: oben Upper_*, unten Bottom_*, dazwischen Middle_*."""
    bild = Image.new("RGBA", (breite * K, hoehe * K))
    for y in range(hoehe):
        zeile = "Upper" if y == 0 else "Bottom" if y == hoehe - 1 else "Middle"
        for x in range(breite):
            spalte = "Left" if x == 0 else "Right" if x == breite - 1 else ("Central" if zeile == "Middle" else "Middle")
            bild.alpha_composite(teil(zeile, spalte), (x * K, y * K))
    return bild


def main() -> None:
    ZIEL.mkdir(parents=True, exist_ok=True)
    zahl = 0
    for b in range(3, 11):
        for h in range(3, 9):
            acker(b, h).save(ZIEL / f"acker_{b}x{h}.png")
            zahl += 1
    print(f"{zahl} Äcker nach spiel/eigene/")


if __name__ == "__main__":
    main()
