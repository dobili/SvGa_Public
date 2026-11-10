"""Bildwunsch: Glasbrücke über die Autobahn vor Silicon Bay (spiel/eigene/), Entwurf von mittel-1.

Warum: Die Glasbrücke wirkte „über die Autobahn geklebt“ (Revision 2 des Autors, 10.11.2026): keine
Rampen, keine Pfeiler, kein Schatten, Vogelschau statt schräg von oben, Glas nicht durchsichtig.
Der Katalog hat keine erhöhte Brücke und keine Fahrbahnmarkierung. Diese Bilder zeichnen das Deck
in unserer Ansicht (KARTENREGELN 10.60): oben die Lauffläche, darunter die Stirnseite des Trägers,
darunter frei bis zum Boden (Pfeiler, Schatten). Die Höhe des Decks ist HOEHE Pixel.

Bilder (L = Länge in Kacheln, 1 bis 16):
- ``glasdeck_L`` (L × 16 breit, 64 + 6 + HOEHE hoch): Glasboden 4 Kacheln tief, halb durchsichtig,
  Stahlrahmen, Glanzlichter; darunter Träger (6 px) und der Schatten auf dem Boden. Flach legen
  (ohne Kollision), damit Figuren darauf laufen; das Geländer sperrt.
- ``glasplatte_BxT``: Glasboden ohne Träger (Aussichtsplattform, schließt an das Deck an).
- ``glasrampe_ab_ost_L`` / ``glasrampe_ab_west_L``: Rampe aus hellem Beton mit Querrillen, 4 Kacheln
  tief; die Stirnwand darunter fällt von HOEHE auf 0 zum tiefen Ende (Ost oder West).
- ``glaspfeiler`` (16 × HOEHE − 6): Betonpfeiler unter dem Träger bis zum Boden, mit Fuß.
- ``glasgelaender_L`` (16 hoch): Glasgeländer an der Nordkante (steht auf der Unterkante des Bilds).
- ``glasgelaender_vorn_L`` (32 hoch): Geländer an der Südkante; Glas in der oberen Kachel, die untere
  ist leer. Möbelangabe dazu ``"maske": ["", "#…#"]``: Die Reihe unter dem Deck sperrt.
- ``glasgelaender_seite_L`` (16 breit, L hoch): Geländer an einer Seitenkante (Plattform).
- ``fahrbahn_strich_L`` / ``fahrbahn_linie_L`` (16 breit, L hoch): gestrichelte und durchgezogene
  weiße Linie am linken Bildrand (2 px), mit Versatz −1 genau auf die Kachelgrenze legen;
  ``fahrbahn_strich_quer_L`` / ``fahrbahn_linie_quer_L`` (L breit, 16 hoch) waagerecht am oberen Rand.
- ``einfassung_quer_L`` / ``einfassung_laengs_L``: Bordstein (3 px) am oberen bzw. linken Bildrand,
  für Plätze und Asphalt (Revision 2, Punkt 22).

Aufruf: ``python glasbruecke.py <Pfad zum privaten Repository>`` schreibt nach ``spiel/eigene/``.
Nur PIL, keine gekauften Bilder.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw

K = 16
HOEHE = 24  # Höhe des Decks über dem Boden in Pixeln (anderthalb Kacheln)
TIEFE = 4 * K  # Lauffläche: vier Kacheln
TRAEGER = 6
RAND = (58, 58, 80, 255)
STAHL, STAHL_HELL, STAHL_DUNKEL = (150, 160, 176, 255), (214, 222, 232, 255), (96, 104, 122, 255)
GLAS = (190, 230, 246, 120)
GLAS_MATT = (214, 238, 248, 170)
GLANZ = (255, 255, 255, 170)
SCHATTEN = (30, 34, 52, 80)
BETON, BETON_HELL, BETON_DUNKEL = (184, 184, 190, 255), (214, 214, 220, 255), (132, 132, 142, 255)
WEISS = (238, 238, 232, 255)
BORD, BORD_DUNKEL = (204, 204, 210, 255), (120, 120, 132, 255)
LAENGEN = range(1, 17)


def glasflaeche(breite: int, tiefe: int) -> Image.Image:
    """Glasboden mit Rahmen: außen klar, in der Mitte matt (Laufstreifen), Stahl alle 16 px."""
    bild = Image.new("RGBA", (breite, tiefe))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, breite - 1, tiefe - 1), fill=GLAS)
    z.rectangle((0, tiefe // 3, breite - 1, tiefe * 2 // 3), fill=GLAS_MATT)
    for x in range(0, breite, K):
        z.line((x, 0, x, tiefe - 1), fill=STAHL)
        # Glanzlicht: kurze Schräge in jeder Scheibe, abwechselnd oben und unten.
        y0 = 3 if (x // K) % 2 == 0 else tiefe * 2 // 3 + 3
        z.line((x + 4, y0 + 6, x + 10, y0), fill=GLANZ)
    for y in (tiefe // 3, tiefe * 2 // 3):
        z.line((0, y, breite - 1, y), fill=STAHL)
    z.rectangle((0, 0, breite - 1, 1), fill=STAHL_DUNKEL)
    z.rectangle((0, tiefe - 2, breite - 1, tiefe - 1), fill=STAHL_DUNKEL)
    return bild


def traeger(z: ImageDraw.ImageDraw, x0: int, x1: int, y: int, hoch: int) -> None:
    """Stirnseite des Stahlträgers mit Lichtkante oben und Schrauben alle 8 px."""
    if hoch <= 0:
        return
    z.rectangle((x0, y, x1, y + hoch - 1), fill=STAHL)
    z.line((x0, y, x1, y), fill=STAHL_HELL)
    z.line((x0, y + hoch - 1, x1, y + hoch - 1), fill=RAND)
    if hoch >= 4:
        for x in range(x0 + 3, x1, 8):
            z.point((x, y + hoch // 2), fill=STAHL_DUNKEL)


def glasdeck(laenge: int) -> Image.Image:
    """Deck über der Autobahn: Schatten (um HOEHE nach Süden versetzt), Glas, Träger."""
    breite = laenge * K
    bild = Image.new("RGBA", (breite, TIEFE + TRAEGER + HOEHE))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, HOEHE, breite - 1, TIEFE + HOEHE - 1), fill=SCHATTEN)
    bild.alpha_composite(glasflaeche(breite, TIEFE), (0, 0))
    traeger(ImageDraw.Draw(bild), 0, breite - 1, TIEFE, TRAEGER)
    return bild


def glasplatte(breite: int, tiefe: int) -> Image.Image:
    return glasflaeche(breite * K, tiefe * K)


def glasrampe(laenge: int, tief_im_osten: bool) -> Image.Image:
    """Betonrampe: Querrillen, Stirnwand fällt linear von HOEHE auf 0 zum tiefen Ende."""
    breite = laenge * K
    bild = Image.new("RGBA", (breite, TIEFE + TRAEGER + HOEHE))
    z = ImageDraw.Draw(bild)
    z.rectangle((0, 0, breite - 1, TIEFE - 1), fill=BETON)
    for x in range(3, breite, 6):
        z.line((x, 3, x, TIEFE - 4), fill=BETON_HELL)
    z.rectangle((0, 0, breite - 1, 1), fill=STAHL_DUNKEL)
    z.rectangle((0, TIEFE - 2, breite - 1, TIEFE - 1), fill=STAHL_DUNKEL)
    for x in range(breite):
        anteil = (breite - 1 - x) / (breite - 1) if tief_im_osten else x / (breite - 1)
        hoch = round((TRAEGER + HOEHE) * anteil)
        if hoch <= 0:
            continue
        z.line((x, TIEFE, x, TIEFE + hoch - 1), fill=BETON_DUNKEL)
        z.point((x, TIEFE), fill=BETON_HELL)
        z.point((x, TIEFE + hoch - 1), fill=RAND)
        # Schatten der Wand auf dem Boden, zwei Pixel breit.
        z.line((x, TIEFE + hoch, x, min(TIEFE + hoch + 1, bild.height - 1)), fill=SCHATTEN)
    return bild


def glaspfeiler() -> Image.Image:
    hoch = HOEHE - TRAEGER
    bild = Image.new("RGBA", (K, hoch))
    z = ImageDraw.Draw(bild)
    z.rectangle((4, 0, 11, hoch - 3), fill=BETON, outline=RAND)
    z.line((9, 1, 10, 1), fill=BETON_DUNKEL)
    z.rectangle((9, 1, 10, hoch - 4), fill=BETON_DUNKEL)
    z.line((5, 1, 5, hoch - 4), fill=BETON_HELL)
    z.rectangle((2, hoch - 3, 13, hoch - 1), fill=BETON_DUNKEL, outline=RAND)
    return bild


def gelaender_waagerecht(z: ImageDraw.ImageDraw, breite: int, unten: int) -> None:
    """Glasscheibe 9 px hoch auf der Linie ``unten``, Handlauf oben, Pfosten alle 16 px."""
    oben = unten - 10
    z.rectangle((0, oben + 1, breite - 1, unten - 1), fill=GLAS)
    z.rectangle((0, oben, breite - 1, oben + 1), fill=STAHL_HELL)
    z.line((0, oben + 2, breite - 1, oben + 2), fill=STAHL_DUNKEL)
    z.line((0, unten, breite - 1, unten), fill=STAHL_DUNKEL)
    for x in list(range(0, breite - 1, K)) + [breite - 2]:
        z.rectangle((x, oben, x + 1, unten), fill=STAHL_DUNKEL)
    for x in range(5, breite, K):
        z.line((x, oben + 4, x + 3, oben + 1 + 2), fill=GLANZ)


def glasgelaender(laenge: int, vorn: bool) -> Image.Image:
    bild = Image.new("RGBA", (laenge * K, 2 * K if vorn else K))
    gelaender_waagerecht(ImageDraw.Draw(bild), laenge * K, K - 1)
    return bild


def glasgelaender_seite(laenge: int) -> Image.Image:
    bild = Image.new("RGBA", (K, laenge * K))
    z = ImageDraw.Draw(bild)
    z.rectangle((6, 0, 9, laenge * K - 1), fill=GLAS)
    z.line((6, 0, 6, laenge * K - 1), fill=STAHL_HELL)
    z.line((9, 0, 9, laenge * K - 1), fill=STAHL_DUNKEL)
    for y in range(0, laenge * K, K):
        z.rectangle((5, y, 10, y + 2), fill=STAHL_DUNKEL)
    return bild


def fahrbahnlinie(laenge: int, gestrichelt: bool) -> Image.Image:
    bild = Image.new("RGBA", (K, laenge * K))
    z = ImageDraw.Draw(bild)
    for y in range(0, laenge * K, K if gestrichelt else 1):
        z.rectangle((0, y + 2 if gestrichelt else y, 1, y + 9 if gestrichelt else y), fill=WEISS)
    return bild


def fahrbahnlinie_quer(laenge: int, gestrichelt: bool) -> Image.Image:
    """Waagerechte Linie am oberen Bildrand (2 px), für Straßen von West nach Ost."""
    bild = Image.new("RGBA", (laenge * K, K))
    z = ImageDraw.Draw(bild)
    for x in range(0, laenge * K, K if gestrichelt else 1):
        z.rectangle((x + 2 if gestrichelt else x, 0, x + 9 if gestrichelt else x, 1), fill=WEISS)
    return bild


def einfassung(laenge: int, quer: bool) -> Image.Image:
    """Bordstein 3 px am oberen (quer) oder linken Rand, Fugen alle 16 px, dunkle Kante."""
    bild = Image.new("RGBA", (laenge * K, K) if quer else (K, laenge * K))
    z = ImageDraw.Draw(bild)
    lang = laenge * K
    for i in range(lang):
        fuge = i % K == 0
        farbe = BORD_DUNKEL if fuge else BORD
        if quer:
            z.line((i, 0, i, 2), fill=farbe)
            z.point((i, 3), fill=BORD_DUNKEL)
        else:
            z.line((0, i, 2, i), fill=farbe)
            z.point((3, i), fill=BORD_DUNKEL)
    return bild


def main() -> None:
    ziel = Path(sys.argv[1]) / "spiel" / "eigene"
    bilder = {"glaspfeiler": glaspfeiler(), "glasplatte_9x5": glasplatte(9, 5)}
    for n in LAENGEN:
        bilder |= {
            f"glasdeck_{n}": glasdeck(n),
            f"glasrampe_ab_ost_{n}": glasrampe(n, True),
            f"glasrampe_ab_west_{n}": glasrampe(n, False),
            f"glasgelaender_{n}": glasgelaender(n, False),
            f"glasgelaender_vorn_{n}": glasgelaender(n, True),
            f"glasgelaender_seite_{n}": glasgelaender_seite(n),
            f"fahrbahn_strich_{n}": fahrbahnlinie(n, True),
            f"fahrbahn_linie_{n}": fahrbahnlinie(n, False),
            f"fahrbahn_strich_quer_{n}": fahrbahnlinie_quer(n, True),
            f"fahrbahn_linie_quer_{n}": fahrbahnlinie_quer(n, False),
            f"einfassung_quer_{n}": einfassung(n, True),
            f"einfassung_laengs_{n}": einfassung(n, False),
        }
    for name, bild in bilder.items():
        bild.save(ziel / f"{name}.png")
    print(f"{len(bilder)} Bilder nach {ziel}")


if __name__ == "__main__":
    main()
