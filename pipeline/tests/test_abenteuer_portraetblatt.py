"""Porträtblatt-Schneider (pipeline/abenteuer/portraetblatt.py) an einem erzeugten Gemini-Blatt.

Warum: Gemini liefert die sechs Fassungen eines Porträts als großes Bild auf grünem Grund, mit
dunklen Trennlinien und vergrößerten Pixeln. Der Schneider muss daraus das Spielblatt 3 × 2 à 64
machen (Format von inhalte/abenteuer/portraetblatt.json): Grund durchsichtig, Pixelraster sauber.
"""

from PIL import Image

from pipeline.abenteuer.portraetblatt import FELD, blockgroesse, schneide

ZELLE, LINIE, BLOCK = 120, 4, 6
BREIT, HOCH = 12, 16  # echtes Pixelbild je Fassung
GRUEN, DUNKEL = (0, 255, 0), (20, 20, 30)


def _farbe(feld: int, x: int, y: int) -> tuple[int, int, int]:
    """Schachbrettmuster mit eigener Grundfarbe je Feld, damit Felder unterscheidbar sind."""
    hell = (x + y) % 2 == 0
    return (25 * feld + (100 if hell else 20), 30 if hell else 140, 200 - 20 * feld)


def _gemini_blatt() -> Image.Image:
    breite, hoehe = 3 * ZELLE + 2 * LINIE, 2 * ZELLE + LINIE
    blatt = Image.new("RGB", (breite, hoehe), GRUEN)
    for i in range(1, 3):  # senkrechte Trennlinien
        blatt.paste(DUNKEL, (i * ZELLE + (i - 1) * LINIE, 0, i * (ZELLE + LINIE), hoehe))
    blatt.paste(DUNKEL, (0, ZELLE, breite, ZELLE + LINIE))
    for feld in range(6):
        spalte, zeile = feld % 3, feld // 3
        x0 = spalte * (ZELLE + LINIE) + 17  # Versatz, der kein Vielfaches des Blocks ist
        y0 = zeile * (ZELLE + LINIE) + 11
        for y in range(HOCH):
            for x in range(BREIT):
                farbe = _farbe(feld, x, y)
                blatt.paste(
                    farbe, (x0 + x * BLOCK, y0 + y * BLOCK, x0 + (x + 1) * BLOCK, y0 + (y + 1) * BLOCK)
                )
    return blatt


def test_blatt_hat_spielformat_und_durchsichtigen_grund():
    ergebnis = schneide(_gemini_blatt())
    assert ergebnis.size == (3 * FELD, 2 * FELD)
    assert ergebnis.getpixel((0, 0))[3] == 0
    assert ergebnis.getpixel((FELD + 1, FELD + 1))[3] == 0


def test_jedes_feld_im_echten_pixelraster_unten_mittig():
    ergebnis = schneide(_gemini_blatt())
    links, oben = (FELD - BREIT) // 2, FELD - HOCH
    for feld in range(6):
        ox, oy = (feld % 3) * FELD + links, (feld // 3) * FELD + oben
        for x, y in [(0, 0), (1, 0), (BREIT - 1, HOCH - 1), (5, 7)]:
            assert ergebnis.getpixel((ox + x, oy + y))[:3] == _farbe(feld, x, y), (feld, x, y)
        assert ergebnis.getpixel((ox - 1, oy + HOCH - 1))[3] == 0


def test_blockgroesse_wird_erkannt():
    bild = Image.new("RGB", (BREIT * BLOCK, HOCH * BLOCK))
    for y in range(HOCH):
        for x in range(BREIT):
            bild.paste(_farbe(0, x, y), (x * BLOCK, y * BLOCK, (x + 1) * BLOCK, (y + 1) * BLOCK))
    assert blockgroesse(bild)[0] == BLOCK
