"""Bildwunsch mittel-3 (Runde 8, zweites Gutachten Riverton): Pavillon, Glastüren.

Warum:
- Der Riverside-Park braucht den Pavillon aus Holz, ein Gebäude mit Dach, Fensterreihe und Tür
  (Gutachten: „Pavillon fehlt“, nur offene Unterstände). Im Paket gibt es kein Gartenhaus dieser
  Größe. Die Holzhütte des Baumhauses (64 × 64, Dach aus Brettern, Wand mit Fenster und Tür) wird
  verlängert: Das Fensterstück der Wand und das Dachstück darüber werden wiederholt, die Tür bleibt
  in der Mitte. Ergebnis 12 × 4 Kacheln.
- Gläserne Türen (Gutachten Akademie und Bahnhofshalle: „Eingang ist eine Holztür“). Im Katalog
  gibt es keine Glastür für die Südwand; gezeichnet im Stil der vorhandenen Südtür (16 × 16,
  dunkler Rahmen) mit hellblauer Scheibe, Lichtreflex und Griff, einfach und doppelt.

Eingabe: Pfad zum privaten Repository. Ausgabe: spiel/eigene/riverton_pavillon.png (192 × 64),
spiel/eigene/glastuer_sued.png (16 × 16), spiel/eigene/glastuer_sued_doppel.png (32 × 16),
spiel/eigene/glastuer_nord_doppel.png (32 × 32, Bahnsteigtür in der Nordwand),
spiel/eigene/pavillon_holztisch.png (64 × 32, Clubtisch im Pavillon).
Aufruf: python riverton_runde8b.py /home/user/schach-abenteuer-inhalte
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

HUETTE = (
    "modern-exteriors/Modern_Exteriors_16x16/ME_Theme_Sorter_16x16/7_Villas_Singles_16x16/"
    "ME_Singles_Villas_16x16_Tree_House_House_1.png"
)
# Spalten der Hütte: linker Rand, Fensterstück (wird wiederholt), Türstück, rechter Rand.
RAND_LINKS, FENSTER_ENDE, TUER_ENDE = 8, 30, 52
FENSTER_JE_SEITE = 3
RAHMEN, GLAS, GLAS_HELL, GRIFF = (
    (52, 48, 64, 255),
    (150, 196, 222, 255),
    (220, 240, 250, 255),
    (90, 90, 100, 255),
)


def pavillon(privat: Path) -> Image.Image:
    """Hütte verlängert: links Rand, drei Fensterstücke, Tür, drei Fensterstücke, rechter Rand."""
    huette = Image.open(privat / HUETTE).convert("RGBA")
    links = huette.crop((0, 0, RAND_LINKS, huette.height))
    fenster = huette.crop((RAND_LINKS, 0, FENSTER_ENDE, huette.height))
    tuer = huette.crop((FENSTER_ENDE, 0, TUER_ENDE, huette.height))
    rechts = huette.crop((TUER_ENDE, 0, huette.width, huette.height))
    teile = [links] + [fenster] * FENSTER_JE_SEITE + [tuer] + [fenster] * FENSTER_JE_SEITE + [rechts]
    breite = sum(t.width for t in teile)
    bild = Image.new("RGBA", (breite, huette.height))
    x = 0
    for teil in teile:
        bild.alpha_composite(teil, (x, 0))
        x += teil.width
    ziel = Image.new("RGBA", (192, huette.height))
    ziel.alpha_composite(
        bild.crop((0, 0, min(breite, 192), huette.height)), ((192 - min(breite, 192)) // 2, 0)
    )
    return ziel


def glastuer(fluegel: int) -> Image.Image:
    """Südtür aus Glas mit fluegel Flügeln (je 16 × 16)."""
    bild = Image.new("RGBA", (16 * fluegel, 16))
    z = ImageDraw.Draw(bild)
    for nr in range(fluegel):
        x = nr * 16
        z.rectangle((x, 0, x + 15, 15), fill=RAHMEN)
        z.rectangle((x + 2, 2, x + 13, 13), fill=GLAS)
        z.line([(x + 4, 11), (x + 10, 4)], fill=GLAS_HELL)
        z.rectangle((x + 12 if nr == 0 else x + 3, 7, x + 12 if nr == 0 else x + 3, 9), fill=GRIFF)
    return bild


def glastuer_nord() -> Image.Image:
    """Zweiflügelige Glastür für die Nordwand (32 × 32): Rahmen, zwei Scheiben, Griffe in der Mitte."""
    bild = Image.new("RGBA", (32, 32))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, 31, 31), fill=RAHMEN)
    for x in (2, 17):
        z.rectangle((x, 2, x + 12, 31), fill=GLAS)
        z.line([(x + 2, 26), (x + 10, 6)], fill=GLAS_HELL)
    z.rectangle((14, 14, 14, 18), fill=GRIFF)
    z.rectangle((17, 14, 17, 18), fill=GRIFF)
    return bild


BUERO = "modern-office/Modern Office Singles/Modern_Office_Singles_{}.png"
# Holztisch aus Tischkacheln des Büropakets: links, Mitte, rechts (helles Holz mit Maserung).
HOLZ_LINKS, HOLZ_MITTE, HOLZ_RECHTS = 222, 223, 224
PLATTE = (0, 25, 16, 48)


def holztisch(privat: Path, laenge: int = 4) -> Image.Image:
    """Rechteckiger Clubtisch (laenge × 2 Kacheln) für zwei Bretter nebeneinander (Gutachten Pavillon:
    „Tische sind Bänke von vorn“, „Bretter hängen über die Kanten“)."""
    bild = Image.new("RGBA", (16 * laenge, 32))
    stuecke = [HOLZ_LINKS] + [HOLZ_MITTE] * (laenge - 2) + [HOLZ_RECHTS]
    for nr, nummer in enumerate(stuecke):
        kachel = Image.open(privat / BUERO.format(nummer)).convert("RGBA").crop(PLATTE)
        bild.alpha_composite(kachel, (16 * nr, 32 - kachel.height))
    return bild


def main() -> None:
    privat = Path(sys.argv[1])
    ziel = privat / "spiel" / "eigene"
    pavillon(privat).save(ziel / "riverton_pavillon.png")
    glastuer(1).save(ziel / "glastuer_sued.png")
    glastuer(2).save(ziel / "glastuer_sued_doppel.png")
    glastuer_nord().save(ziel / "glastuer_nord_doppel.png")
    holztisch(privat).save(ziel / "pavillon_holztisch.png")


if __name__ == "__main__":
    main()
