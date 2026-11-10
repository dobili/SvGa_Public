"""Bildwunsch mittel-3 (Runde 8): eigene Bilder für die neue Akademie in Silicon Bay.

Warum: Der Autor verlangt für `siliconBay.akademie` einen kompletten Neubau (revision2_notizen):
eine echte Glaswand, Tische mit Flachbildschirmen statt Kapselmaschinen, Stühle zum Tisch,
Automaten an der Wand. Die Einzelbilder des Modern-Office-Pakets liegen versetzt in 32 × 48 großen
Leinwänden; dieses Skript schneidet sie auf ihren Inhalt zu, setzt sie unten bündig in eine Leinwand
in Kachelgröße und baut daraus Schreibtische mit Bildschirmen.

Gutachten Runde 8: dazu ein Wandbildschirm mit der Rangliste, ein großer Vortragsbildschirm und ein
weißer Beistelltisch statt des Holztischs in der Sitzgruppe.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/akademie_*.png (Liste unten).
Aufruf: python akademie.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

ORDNER = "modern-office/Modern Office Singles/Modern_Office_Singles_{}.png"
KACHEL = 16
# Schreibtischkacheln: Platte ab y = 25 in der Leinwand des Einzelbilds, 23 Pixel hoch.
PLATTE = (0, 25, KACHEL, 48)
WEISS_LINKS, WEISS_MITTE, WEISS_RECHTS = 216, 217, 218
MONITOR_VORN, TASTATUR = 130, 124


def teil(privat: Path, nummer: int) -> Image.Image:
    """Einzelbild auf seinen sichtbaren Inhalt zugeschnitten."""
    bild = Image.open(privat / ORDNER.format(nummer)).convert("RGBA")
    return bild.crop(bild.getbbox())


def unten_buendig(inhalt: Image.Image, breite: int, hoehe: int) -> Image.Image:
    """Inhalt waagerecht mittig und unten bündig in eine Leinwand breite × hoehe setzen."""
    leinwand = Image.new("RGBA", (breite, hoehe))
    leinwand.alpha_composite(inhalt, ((breite - inhalt.width) // 2, hoehe - inhalt.height))
    return leinwand


def schreibtisch(privat: Path, laenge: int) -> Image.Image:
    """Weißer Schreibtisch aus Kacheln (links, Mitte, rechts), laenge Kacheln breit, 2 hoch."""
    tisch = Image.new("RGBA", (KACHEL * laenge, 2 * KACHEL))
    stuecke = [WEISS_LINKS] + [WEISS_MITTE] * (laenge - 2) + [WEISS_RECHTS]
    for nr, nummer in enumerate(stuecke):
        kachel = Image.open(privat / ORDNER.format(nummer)).convert("RGBA").crop(PLATTE)
        tisch.alpha_composite(kachel, (KACHEL * nr, 2 * KACHEL - kachel.height))
    return tisch


def bildschirmtisch(privat: Path) -> Image.Image:
    """Tisch für zwei Schüler (4 Kacheln): je ein Flachbildschirm mit Tastatur davor."""
    tisch = schreibtisch(privat, 4)
    monitor, tastatur = teil(privat, MONITOR_VORN), teil(privat, TASTATUR)
    for mitte in (KACHEL, 3 * KACHEL):
        tisch.alpha_composite(monitor, (mitte - monitor.width // 2, 0))
        tisch.alpha_composite(tastatur, (mitte - tastatur.width // 2, monitor.height + 1))
    return tisch


# Name → (Nummer im Paket, Leinwand breite × hoehe), unten bündig.
EINZELN = {
    "glaswand": (208, 32, 32),
    "stuhl_vorn": (101, 16, 32),
    "stuhl_ruecken": (102, 16, 32),
    "stuhl_links": (103, 16, 32),
    "stuhl_rechts": (104, 16, 32),
    "sofa": (205, 32, 32),
    "couchtisch": (193, 32, 16),
    "wasserspender": (173, 16, 32),
    "getraenkeautomat": (175, 32, 48),
    "snackautomat": (174, 32, 32),
    "smartboard": (170, 32, 32),
    "rangliste": (171, 32, 32),
    "statistik": (172, 32, 32),
    "pflanze": (98, 16, 32),
}


NAVY, RAHMEN, WEISS = (24, 34, 64, 255), (52, 56, 70, 255), (230, 234, 240, 255)
GOLD, SILBER, BRONZE, GRAU, CYAN = (
    (230, 190, 60, 255),
    (200, 204, 212, 255),
    (190, 120, 70, 255),
    (120, 130, 150, 255),
    (90, 200, 230, 255),
)


def rangliste() -> Image.Image:
    """Wandbildschirm mit der Rangliste (48 × 32): fünf Zeilen mit Platz (Gold, Silber, Bronze,
    Grau), Namensbalken und Wertung; Gutachten: „Eine Rangliste hat Namen und Plätze.“"""
    bild = Image.new("RGBA", (48, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 2, 47, 29), fill=RAHMEN)
    z.rectangle((2, 4, 45, 27), fill=NAVY)
    z.rectangle((4, 5, 30, 6), fill=CYAN)  # Überschrift
    for nr, (farbe, laenge) in enumerate(((GOLD, 22), (SILBER, 18), (BRONZE, 20), (GRAU, 15), (GRAU, 17))):
        y = 9 + nr * 4
        z.rectangle((4, y, 6, y + 2), fill=farbe)
        z.rectangle((9, y + 1, 9 + laenge, y + 1), fill=WEISS)
        z.rectangle((36, y + 1, 43, y + 1), fill=CYAN)
    return bild


def grossbildschirm() -> Image.Image:
    """Großer Wandbildschirm für Vorträge (64 × 32) mit einer Brettstellung und einem Balken."""
    bild = Image.new("RGBA", (64, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 1, 63, 30), fill=RAHMEN)
    z.rectangle((2, 3, 61, 28), fill=NAVY)
    for reihe in range(8):
        for linie in range(8):
            farbe = (230, 214, 180, 255) if (reihe + linie) % 2 == 0 else (150, 110, 80, 255)
            z.rectangle((6 + linie * 2, 6 + reihe * 2, 7 + linie * 2, 7 + reihe * 2), fill=farbe)
    z.rectangle((28, 7, 56, 9), fill=CYAN)
    z.rectangle((28, 13, 50, 14), fill=WEISS)
    z.rectangle((28, 17, 53, 18), fill=WEISS)
    z.rectangle((28, 21, 46, 22), fill=WEISS)
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    ziel = privat / "spiel" / "eigene"
    for name, (nummer, breite, hoehe) in EINZELN.items():
        unten_buendig(teil(privat, nummer), breite, hoehe).save(ziel / f"akademie_{name}.png")
    bildschirmtisch(privat).save(ziel / "akademie_bildschirmtisch.png")
    schreibtisch(privat, 3).save(ziel / "akademie_schreibtisch.png")
    schreibtisch(privat, 2).save(ziel / "akademie_beistelltisch.png")
    rangliste().save(ziel / "akademie_rangliste_tafel.png")
    grossbildschirm().save(ziel / "akademie_grossbildschirm.png")


if __name__ == "__main__":
    main()
