"""Bildwunsch mittel-3 (Runde 8): eigene Bilder für die neue Akademie in Silicon Bay.

Warum: Der Autor verlangt für `siliconBay.akademie` einen kompletten Neubau (revision2_notizen):
eine echte Glaswand, Tische mit Flachbildschirmen statt Kapselmaschinen, Stühle zum Tisch,
Automaten an der Wand. Die Einzelbilder des Modern-Office-Pakets liegen versetzt in 32 × 48 großen
Leinwänden; dieses Skript schneidet sie auf ihren Inhalt zu, setzt sie unten bündig in eine Leinwand
in Kachelgröße und baut daraus Schreibtische mit Bildschirmen.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/akademie_*.png (Liste unten).
Aufruf: python akademie.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image

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


def main() -> None:
    privat = Path(sys.argv[1])
    ziel = privat / "spiel" / "eigene"
    for name, (nummer, breite, hoehe) in EINZELN.items():
        unten_buendig(teil(privat, nummer), breite, hoehe).save(ziel / f"akademie_{name}.png")
    bildschirmtisch(privat).save(ziel / "akademie_bildschirmtisch.png")
    schreibtisch(privat, 3).save(ziel / "akademie_schreibtisch.png")


if __name__ == "__main__":
    main()
