"""Prellbock aus Stahl für Bahngleise (Entwurf, mittel-2, Querauftrag (m), 10.11.2026).

Warum: An den Gleisenden stand ein rot-weißer Absperrbock von der Straße (prellbock.png,
prellbock_quer.png); die Gutachten zu Goldmine, Port Delacroix, Canyonpfad und Felsbogen nennen ihn
eine Straßenbake (KARTENPRUEFUNG: Prellbock, keine Straßenabsperrung). Der Katalog hat keinen
Prellbock (gesucht: Train Station, Hafen, Containerterminal). Ein Bahn-Prellbock ist ein schwerer
Stahlbock auf dem Gleis mit Querbalken, zwei runden Puffern zum Zug hin und dem Schutzhaltsignal
(rotes Feld mit weißem Rand) obenauf. Der Holzbock von niedrig-1 (prellbock_holz.png) wirkt in
der Karte wie eine Bank, der Feldbahnbock (prellbock_feldbahn.png) ist für die schmale Spur des
Steinbruchs; die Goldmine liegt an LimeZus breitem Gleis und bekommt deshalb denselben Bock aus Holz.

- ``prellbock_stahl_oben.png`` (32 × 32): Gleis (zwei Kacheln breit) läuft senkrecht und endet
  oben; Blick von Süden auf Balken, Puffer und Signal. Unterkante auf das erste Gleisfeld.
- ``prellbock_stahl_links.png`` (16 × 48): Gleis (zwei Kacheln hoch) läuft waagerecht und endet
  links; Balken quer über die Spur, Puffer nach rechts zum Zug. Die unteren 32 Pixel decken die
  Spur, darüber steht das Signal (Feld eine Kachel über dem Gleis).
- ``prellbock_stahl_rechts.png``: gespiegelt, Gleis endet rechts.
- ``prellbock_holz_oben.png`` (32 × 32): wie ``oben``, Bock und Balken aus Holz, ohne Signal
  (Feldbahn der Goldmine).

Aufruf: ``python prellbock_stahl.py <zielordner>`` (im privaten Repository: spiel/eigene/).
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

RAND = (58, 58, 80, 255)
STAHL = (84, 82, 96, 255)
STAHL_HELL = (128, 126, 140, 255)
PUFFER = (184, 184, 194, 255)
ROT = (198, 50, 46, 255)
WEISS = (238, 236, 230, 255)
HOLZ = (116, 82, 52, 255)
HOLZ_HELL = (156, 116, 76, 255)
SCHATTEN = (0, 0, 0, 60)
# Lage der Schienen in LimeZus Gleisbildern (Rail_Modular_Vertical 32 × 16: Spalten 4 und 24;
# Rail_Modular_Horizontal 16 × 32: Zeilen 4 und 23, hier 16 Pixel tiefer, weil oben das Signal steht).
SCHIENEN_SENKRECHT = (4, 24)
SCHIENEN_WAAGERECHT = (20, 39)


def _signal(z: ImageDraw.ImageDraw, x: int, y: int) -> None:
    """Schutzhaltsignal: 8 × 7, weißer Rand, rotes Feld, auf einem kurzen Stiel."""
    z.rectangle((x + 3, y + 7, x + 4, y + 10), fill=STAHL, outline=RAND)
    z.rectangle((x, y, x + 7, y + 6), fill=RAND)
    z.rectangle((x + 1, y + 1, x + 6, y + 5), fill=WEISS)
    z.rectangle((x + 2, y + 2, x + 5, y + 4), fill=ROT)


def oben(werkstoff: tuple = (STAHL, STAHL_HELL), signal: bool = True) -> Image.Image:
    """Von Süden: Schwelle über die ganze Spur, Bock, Querbalken mit Puffern über den Schienen."""
    voll, hell = werkstoff
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((2, 29, 29, 31), fill=SCHATTEN)
    z.rectangle((0, 26, 29, 29), fill=HOLZ, outline=RAND)  # Schwelle unter dem Bock
    z.polygon([(4, 26), (9, 18), (20, 18), (25, 26)], fill=voll, outline=RAND)  # Bock
    z.line((10, 25, 13, 19), fill=hell)
    z.line((19, 25, 16, 19), fill=hell)
    z.rectangle((0, 13, 29, 18), fill=voll, outline=RAND)  # Querbalken
    z.line((1, 14, 28, 14), fill=hell)
    for mitte in SCHIENEN_SENKRECHT:  # Puffer: runde Teller zum Betrachter (zum Zug)
        z.ellipse((mitte - 3, 13, mitte + 3, 19), fill=PUFFER, outline=RAND)
    if signal:
        _signal(z, 11, 2)
    return bild


def links() -> Image.Image:
    """Gleis endet links: Querbalken über beide Schienen, Puffer nach rechts, Streben nach links."""
    bild = Image.new("RGBA", (16, 48))
    z = ImageDraw.Draw(bild)
    z.rectangle((10, 18, 15, 46), fill=SCHATTEN)
    for schiene in SCHIENEN_WAAGERECHT:  # je Schiene eine schräge Strebe (Dreieck) nach links
        z.polygon([(1, schiene + 3), (9, schiene - 3), (9, schiene + 3)], fill=STAHL, outline=RAND)
        z.line((3, schiene + 2, 8, schiene - 1), fill=STAHL_HELL)
    z.rectangle((8, 16, 12, 45), fill=STAHL, outline=RAND)  # Querbalken über die Spur
    z.line((9, 17, 9, 44), fill=STAHL_HELL)
    for schiene in SCHIENEN_WAAGERECHT:
        z.ellipse((11, schiene - 3, 15, schiene + 3), fill=PUFFER, outline=RAND)
    _signal(z, 6, 4)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    oben().save(ziel / "prellbock_stahl_oben.png")
    seite = links()
    seite.save(ziel / "prellbock_stahl_links.png")
    ImageOps.mirror(seite).save(ziel / "prellbock_stahl_rechts.png")
    oben((HOLZ, HOLZ_HELL), signal=False).save(ziel / "prellbock_holz_oben.png")
    print("Prellböcke aus Stahl nach", ziel)


if __name__ == "__main__":
    main()
