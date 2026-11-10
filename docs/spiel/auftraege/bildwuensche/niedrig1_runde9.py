"""Bildwunsch von niedrig-1 (Runde 9): offene Bilder aus den Gutachten von Runde 8.

Entwurf zum Übernehmen in ``werkzeuge/`` des privaten Repositorys. Nur Code, keine LimeZu-Dateien.
Stil wie ``schilder.py``: LimeZus Umriss ``RAHMEN``, durchscheinender Schatten unten, Schrägansicht
von oben (KARTENREGELN 10.60).

Bilder (in ``spiel/eigene/``, Breite × Höhe in Pixeln):
- ``halfpipe.png`` (64 × 48): Skater-Halfpipe aus Holz, quer gesehen. Die zwei Rampen steigen links und
  rechts auf, oben je eine Plattform mit Geländer, dazwischen die flache Mulde. Warum: Im Gutachten
  zum Park Maple Falls (Nr. 23) war die Halfpipe aus dem Paket eine „graue Metallfläche“.
- ``basketball_halbfeld.png`` (96 × 80): halbes Basketballfeld mit einem Korb an der Nordseite,
  Dreierlinie und Zone. Nach Regel 10.64 ist eine Figur 2 Kacheln hoch, ein Halbfeld 14 m breit; es
  ist auf 6 × 5 Kacheln gestaucht. Warum: Gutachten Park Nr. 21, das volle Feld mit zwei Körben war
  größer als der Spielplatz.
- ``schild_anker_taue.png`` (64 × 16): Ladenschild „ANKER TAUE“ für den Schiffsausrüster in Lockport
  (Gutachten Lockport außen Nr. 26: der Laden war nicht zu erkennen).
- ``zeder.png`` (48 × 64): Zeder, wie sie im Nordwesten Amerikas wächst: kegelförmig, dunkles
  Blaugrün in hängenden, waagrechten Etagen, rotbrauner, faseriger Stamm. Warum: In den Gutachten zu
  Zedernwald, Zedernpfad und Cedar Creek waren die Zedern hellgrüne Eiben, nicht zu erkennen.

Aufruf: python niedrig1_runde9.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw
from schilder import RAHMEN, schreibe, textbreite  # im privaten Repository: werkzeuge/schilder.py

SCHATTEN = (58, 58, 80, 90)
HOLZ_HELL = (196, 150, 100, 255)
HOLZ = (166, 120, 78, 255)
HOLZ_DUNKEL = (120, 82, 54, 255)
STAHL = (150, 154, 168, 255)
PARKETT = (212, 150, 92, 255)
PARKETT_DUNKEL = (196, 134, 80, 255)
LINIE = (245, 245, 240, 255)
ZONE = (176, 72, 52, 255)
NADEL_HELL = (70, 112, 96, 255)
NADEL = (44, 86, 74, 255)
NADEL_DUNKEL = (28, 60, 54, 255)
RINDE = (140, 70, 48, 255)
RINDE_DUNKEL = (98, 48, 36, 255)


def halfpipe() -> Image.Image:
    """Halfpipe 64 × 48 quer: zwei gebogene Rampen aus Holzbrettern, oben Plattformen mit
    Stahlgeländer, unten die flache Mulde. Brettfugen laufen quer, damit die Krümmung lesbar ist."""
    bild = Image.new("RGBA", (64, 48))
    z = ImageDraw.Draw(bild)
    z.rectangle((2, 42, 61, 46), fill=SCHATTEN)
    profil = [(2, 14), (10, 14), (16, 26), (22, 34), (42, 34), (48, 26), (54, 14), (61, 14)]
    z.polygon(profil + [(61, 42), (2, 42)], fill=RAHMEN)
    innen = [(3, 15), (10, 15), (16, 27), (22, 35), (42, 35), (48, 27), (54, 15), (60, 15)]
    z.polygon(innen + [(60, 41), (3, 41)], fill=HOLZ)
    for x in range(4, 60, 4):  # Brettfugen
        z.line((x, 16, x, 40), fill=HOLZ_DUNKEL)
    z.line((22, 35, 42, 35), fill=HOLZ_HELL, width=2)  # Mulde
    z.line(innen[1:-1], fill=HOLZ_HELL)  # Kante der Fahrfläche
    for x0 in (2, 54):  # Plattformen mit Geländer
        z.rectangle((x0, 10, x0 + 7, 14), fill=HOLZ_DUNKEL, outline=RAHMEN)
        z.line((x0, 3, x0 + 7, 3), fill=STAHL, width=2)
        for x in (x0, x0 + 7):
            z.line((x, 3, x, 10), fill=STAHL)
    return bild


def basketball_halbfeld() -> Image.Image:
    """Halbfeld 96 × 80 mit einem Korb im Norden: Parkettfläche mit weißen Linien, rote Zone,
    Dreierbogen, Mittelkreis halb am Südrand, Korbständer mit Brett und Netz oben in der Mitte."""
    bild = Image.new("RGBA", (96, 80))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 8, 95, 79), fill=RAHMEN)
    z.rectangle((1, 9, 94, 78), fill=PARKETT)
    for y in range(12, 78, 6):
        z.line((2, y, 93, y), fill=PARKETT_DUNKEL)
    z.rectangle((4, 11, 91, 76), outline=LINIE)
    z.rectangle((36, 11, 59, 40), fill=ZONE, outline=LINIE)  # Zone
    z.ellipse((38, 30, 57, 50), outline=LINIE)  # Freiwurfkreis
    z.arc((10, -14, 85, 58), 0, 180, fill=LINIE)  # Dreierbogen
    z.arc((34, 64, 61, 90), 180, 360, fill=LINIE)  # halber Mittelkreis
    z.rectangle((46, 0, 49, 12), fill=STAHL, outline=RAHMEN)  # Ständer
    z.rectangle((38, 2, 57, 8), fill=LINIE, outline=RAHMEN)  # Brett
    z.rectangle((44, 4, 51, 7), outline=ZONE)
    z.ellipse((43, 9, 52, 13), outline=(230, 110, 40, 255))  # Ring
    for x in (44, 47, 50):
        z.line((x, 13, x + 1, 16), fill=LINIE)  # Netz
    return bild


def schild_anker_taue() -> Image.Image:
    """Ladenschild 64 × 16 „ANKER TAUE“: dunkelblaue Tafel mit Holzrahmen, Schrift in Weiß, links ein
    kleiner Anker als Zeichen für die, die nicht lesen."""
    bild = Image.new("RGBA", (64, 16))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, 63, 15), fill=RAHMEN)
    z.rectangle((1, 1, 62, 14), fill=HOLZ)
    z.rectangle((2, 2, 61, 13), fill=(40, 62, 104, 255))
    weiss = (240, 240, 236, 255)
    z.line((6, 4, 6, 11), fill=weiss)  # Anker
    z.line((4, 5, 8, 5), fill=weiss)
    z.arc((3, 7, 9, 12), 0, 180, fill=weiss)
    text = "ANKER TAUE"
    schreibe(z, text, 12 + (50 - textbreite(text)) // 2, 5, weiss)
    return bild


def zeder() -> Image.Image:
    """Zeder 48 × 64: Kegel aus fünf hängenden Etagen, unten breit, oben eine schmale Spitze; jede
    Etage oben hell, unten dunkel; dazwischen sieht man den rotbraunen, faserigen Stamm."""
    bild = Image.new("RGBA", (48, 64))
    z = ImageDraw.Draw(bild)
    z.ellipse((8, 56, 40, 63), fill=SCHATTEN)
    z.rectangle((21, 40, 26, 60), fill=RAHMEN)
    z.rectangle((22, 40, 25, 59), fill=RINDE)
    for y in range(42, 59, 3):
        z.line((23, y, 23, y + 1), fill=RINDE_DUNKEL)
    etagen = [(2, 46, 36, 50), (6, 42, 27, 40), (10, 38, 18, 30), (14, 34, 10, 20), (19, 29, 2, 11)]
    for x0, x1, y0, y1 in etagen:
        z.polygon([(x0, y1), ((x0 + x1) // 2, y0), (x1, y1), ((x0 + x1) // 2, y1 + 3)], fill=RAHMEN)
        z.polygon([(x0 + 2, y1 - 1), ((x0 + x1) // 2, y0 + 2), (x1 - 2, y1 - 1)], fill=NADEL)
        z.line((x0 + 3, y1 - 1, x1 - 3, y1 - 1), fill=NADEL_DUNKEL, width=2)
        z.line(((x0 + x1) // 2 - 3, y0 + 5, (x0 + x1) // 2, y0 + 3), fill=NADEL_HELL)
    return bild


def main(haupt: Path) -> None:
    ziel = haupt / "spiel" / "eigene"
    halfpipe().save(ziel / "halfpipe.png")
    basketball_halbfeld().save(ziel / "basketball_halbfeld.png")
    schild_anker_taue().save(ziel / "schild_anker_taue.png")
    zeder().save(ziel / "zeder.png")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
