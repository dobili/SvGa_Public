"""Bildwunsch: Bug, Deckhaus und Bordbar der Küstenfähre „Gulf Star“ (spiel/eigene/), Entwurf von mittel-1.

Warum: Auf ``weg-silicon-delacroix-faehre`` war die Fähre ein Rechteck ohne Bug, wie ein Floß, ohne
Schornstein und Brücke; Salon und Bordbar waren Buden aus anderen Paketen (Fischbude mit Hai,
Holzcontainer mit Klimageräten), nicht als Schiffsaufbauten lesbar (variantenwahl.md, Mängel 1
und 2). LimeZus Paket hat keine Schiffsaufbauten in dieser Größe.

Bilder:

- ``faehre_bug.png`` (256 × 96): der spitze Bug unter dem Deck (Szene: Deck ``x`` 7–22, Bug ab
  Reihe 74). Innen dieselben dunklen Dielen wie das Deck (``holzDunkel``, Kachel 13/27 im
  Room-Builder-Bogen, am Kachelraster ausgerichtet), dazu Reling und weiße Bordwand mit Kontur.
- ``faehre_deckhaus.png`` (160 × 112): weißes Deckhaus (Salon) mit blauem Streifen, Fensterreihe
  und Tür, auf dem Dach die Brücke mit Fensterband nach vorn und dahinter der Schornstein (rot mit
  schwarzer Kappe). Rechts neben der Tür hängt die Rätseltafel mit einem kleinen Diagramm.
- ``faehre_bar.png`` (96 × 64): kleines weißes Deckhaus mit Ausgabeluke, Theke und gestreifter
  Markise, die Bordbar.

Aufruf: ``python faehre_aufbau.py <Pfad zum privaten Repository>``. Nur PIL.
"""

import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

K = 16
BODEN = "modern-interiors/1_Interiors/16x16/Room_Builder_subfiles/Room_Builder_Floors_16x16.png"
DIELE = (13, 27)  # holzDunkel
KONTUR, WEISS, SCHATTEN = (40, 46, 66, 255), (236, 240, 246, 255), (196, 204, 220, 255)
RELING, RELING_DUNKEL = (176, 182, 200, 255), (98, 104, 128, 255)
BLAU, GLAS, GLAS_HELL = (52, 92, 160, 255), (54, 74, 110, 255), (130, 170, 210, 255)
DACH, DACH_DUNKEL = (170, 176, 188, 255), (138, 144, 158, 255)
ROT, ROT_DUNKEL, SCHWARZ = (196, 52, 46, 255), (150, 36, 34, 255), (34, 34, 40, 255)


def bug(bogen: Image.Image) -> Image.Image:
    """Spitzer Bug, 16 Kacheln breit, 6 hoch; Halbbreite fällt nach unten parabelförmig auf null."""
    breite, hoehe = 16 * K, 6 * K
    maske = Image.new("L", (breite, hoehe))
    mitte = breite / 2
    for y in range(hoehe):
        halb = mitte * (1 - (y / (hoehe - 4)) ** 2)
        if halb > 0:
            ImageDraw.Draw(maske).line((mitte - halb, y, mitte + halb - 1, y), fill=255)
    schichten = [maske] + [maske.filter(ImageFilter.MinFilter(2 * n + 1)) for n in (1, 3, 4, 5)]
    diele = bogen.crop((DIELE[0] * K, DIELE[1] * K, (DIELE[0] + 1) * K, (DIELE[1] + 1) * K)).convert("RGBA")
    bild = Image.new("RGBA", (breite, hoehe))
    for x in range(0, breite, K):
        for y in range(0, hoehe, K):
            bild.paste(diele, (x, y))
    leer = Image.new("RGBA", (breite, hoehe))
    ergebnis = Image.composite(bild, leer, schichten[4])
    for farbe, aussen, innen in ((KONTUR, 0, 1), (WEISS, 1, 2), (RELING_DUNKEL, 2, 3), (RELING, 3, 4)):
        ring = ImageChops.subtract(schichten[aussen], schichten[innen])
        ergebnis = Image.composite(Image.new("RGBA", (breite, hoehe), farbe), ergebnis, ring)
    # Oben schließt der Bug an das Deck an: dort keine Kontur, sondern Dielen bis zum Rand.
    for y in range(0, 4):
        for x in range(0, breite):
            if 6 <= x < breite - 6:
                ergebnis.putpixel((x, y), diele.getpixel((x % K, y % K)))
    return ergebnis


def fenster(z: ImageDraw.ImageDraw, x: int, y: int, b: int, h: int) -> None:
    z.rectangle((x, y, x + b - 1, y + h - 1), fill=KONTUR)
    z.rectangle((x + 1, y + 1, x + b - 2, y + h - 2), fill=GLAS)
    z.line((x + 2, y + 2, x + 2, y + h - 3), fill=GLAS_HELL)


def deckhaus() -> Image.Image:
    """Salon (10 × 7 Kacheln): Dach mit Brücke und Schornstein, darunter die Wand mit Fenstern und Tür."""
    bild = Image.new("RGBA", (160, 112))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 8, 159, 63), fill=KONTUR)  # Dach
    z.rectangle((2, 10, 157, 61), fill=DACH)
    z.rectangle((2, 58, 157, 61), fill=DACH_DUNKEL)
    z.rectangle((96, 4, 131, 41), fill=KONTUR)  # Schornstein (hinten rechts)
    z.rectangle((98, 6, 129, 39), fill=ROT)
    z.rectangle((98, 6, 129, 13), fill=SCHWARZ)
    z.rectangle((98, 32, 129, 39), fill=ROT_DUNKEL)
    z.rectangle((16, 28, 143, 63), fill=KONTUR)  # Brücke vorn auf dem Dach
    z.rectangle((18, 30, 141, 47), fill=WEISS)
    z.rectangle((18, 48, 141, 61), fill=SCHATTEN)
    for x in range(22, 136, 14):
        fenster(z, x, 50, 12, 10)
    z.rectangle((0, 64, 159, 111), fill=KONTUR)  # Wand
    z.rectangle((2, 64, 157, 109), fill=WEISS)
    z.rectangle((2, 68, 157, 71), fill=BLAU)
    for x in (8, 32, 128):
        fenster(z, x, 78, 20, 16)
    z.rectangle((96, 76, 123, 99), fill=(120, 78, 46, 255))  # Rätseltafel mit Diagramm
    z.rectangle((98, 78, 121, 97), fill=(46, 84, 62, 255))
    for i in range(4):
        for j in range(4):
            if (i + j) % 2 == 0:
                z.rectangle((102 + 4 * i, 80 + 4 * j, 105 + 4 * i, 83 + 4 * j), fill=(214, 222, 206, 255))
    z.line((101, 96, 118, 96), fill=(214, 222, 206, 255))
    z.rectangle((68, 76, 91, 109), fill=KONTUR)  # Tür
    z.rectangle((70, 78, 89, 109), fill=SCHATTEN)
    fenster(z, 74, 82, 12, 10)
    return bild


def bar() -> Image.Image:
    """Bordbar (6 × 4 Kacheln): Dach, gestreifte Markise, Ausgabeluke mit Theke."""
    bild = Image.new("RGBA", (96, 64))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, 95, 23), fill=KONTUR)
    z.rectangle((2, 2, 93, 21), fill=DACH)
    for i, x in enumerate(range(2, 94, 8)):  # Markise
        z.rectangle((x, 22, x + 7, 31), fill=BLAU if i % 2 else WEISS)
    z.line((2, 31, 93, 31), fill=KONTUR)
    z.rectangle((0, 32, 95, 63), fill=KONTUR)
    z.rectangle((2, 32, 93, 61), fill=WEISS)
    z.rectangle((12, 34, 83, 47), fill=SCHWARZ)  # Luke
    for x in range(16, 80, 10):  # Flaschen im Regal
        z.rectangle((x, 38, x + 3, 45), fill=(70, 140, 90, 255) if x % 20 else (150, 90, 50, 255))
    z.rectangle((8, 48, 87, 53), fill=(120, 78, 46, 255))  # Theke
    z.line((8, 48, 87, 48), fill=(170, 120, 74, 255))
    z.rectangle((2, 56, 93, 59), fill=BLAU)
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    ziel = privat / "spiel" / "eigene"
    bug(Image.open(privat / BODEN)).save(ziel / "faehre_bug.png")
    deckhaus().save(ziel / "faehre_deckhaus.png")
    bar().save(ziel / "faehre_bar.png")
    print("faehre_bug.png, faehre_deckhaus.png, faehre_bar.png geschrieben")


if __name__ == "__main__":
    main()
