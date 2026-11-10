"""Bilder für die Belebung (Statisten und Tiere) im Spielformat, gebaut aus der gekauften Grafik.

Warum: Runde 7 (Auftrag ``docs/spiel/auftraege/runde7_staedte_routen_leben.md``, Rückmeldung des
Autors vom 10.11.2026): Die App zeichnet Statisten und Tiere aus ``belebung``. Sie braucht dafür einen
festen Vorrat an Statistenbögen und je Tierart einen Bogen. Das Werkzeug schreibt beides in das
private Repository (``spiel/figuren/statist-NN.png`` und ``spiel/tiere/<art>.png``); der Paketbau
(``app/skripte/baue-abenteuerpaket.mjs``) übernimmt die Ordner. Im öffentlichen Repository liegt nur
dieses Werkzeug, nie ein Bild.

Spielformat (wie die Figuren, ``app/src/abenteuer/oberwelt/figurbilder.ts``): 24 Rahmen breit, zwei
Reihen. Obere Reihe vier Standbilder (rechts, oben, links, unten), untere Reihe Laufen mit sechs
Bildern je Richtung in derselben Reihenfolge. Statisten haben Rahmen 16 × 32, Tiere die Rahmengröße
ihrer Vorlage (``TIERE``; dieselben Maße stehen in ``app/src/abenteuer/oberwelt/belebung.ts``).

Aufruf: ``python -m pipeline.abenteuer.belebungsbilder /pfad/zum/privaten/repository``
"""

import colorsys
import importlib.util
import random
import sys
from pathlib import Path

from PIL import Image

STATISTEN = 40
RAHMEN_JE_REIHE = 24
STAND_RAHMEN = 4
# Anteil des Vorrats: Kinder und Ältere (graue Haare); der Rest sind Erwachsene.
KINDER = 8
AELTERE = 8
# Natürliche Hauttöne (Wunsch des Autors, 10.11.2026): Körper 5 (oliv), 6 (grau), 8 (rosa), 9 (blau)
# und 10 (Umfärbung) sehen nicht menschlich aus. Die vier Kinderkörper sind alle natürlich.
HAUT = (1, 2, 3, 4, 7)
HAUT_KINDER = (1, 2, 3, 4)
# Haarfarben aus den Pixeln (die Farbnummern im Namen sind nicht in allen Frisuren gleich):
# natürlich sind Rot-, Braun- und Blondtöne (Farbton bis 55°), Schwarz und Grau; bunt (Rosa, Blau,
# Grün, Lila) fällt weg. Grau heißt: kaum Farbe und hell genug.
NATUERLICHER_FARBTON = 55 / 360
BUNT_AB_SAETTIGUNG = 0.2
GRAU_HOECHSTENS_SAETTIGUNG = 0.15
GRAU_MINDESTENS_HELLIGKEIT = 0.5
# Kostüme statt Alltagskleidung (Schnittnummer am Anfang): Karateanzug, Häftlingsoverall, Polizei,
# Tarnfleck, Rüstung, Ninja mit Maske, Badesachen, weißes Gewand. Lange Ärmel für den Winter gibt
# es im Generator nur bei diesen Kostümen; Sommer und Winter werden deshalb nicht getrennt.
KOSTUEME = ("15", "16", "19", "23", "29", "30", "31", "32", "33")
# Kostümkapuzen unter den Frisuren (Frosch, Dino, Tierohren): Schnitte 27 bis 29, bei Kindern 4.
KAPUZEN = ("27", "28", "29")
KAPUZEN_KINDER = ("4",)

# Tierart → (Vorlage unter modern-farm/Animals oder modern-exteriors, Rahmenbreite, Rahmenhöhe,
# Art der Vorlage)
# Art der Vorlage: "reihen" = Reihe 0 Stand, Reihe 1 Laufen (Hühner, Ziegen …); "streifen" = nur eine
# Reihe mit einer Bewegung (Taube pickt); "baender" = beschriftete Bänder (Hund, Katze), Stand im
# ersten, Laufen im fünften Band; "fest:<stand_y>:<lauf_y>" = Reihen an festen Pixelhöhen (Katzen:
# die Beschriftungen berühren die Bildreihen, die Bänder taugen dort nicht).
BEWEGT = "modern-exteriors/Modern_Exteriors_16x16/Animated_16x16/Animated_sheets_16x16/"
TAUBE = BEWEGT + "Pigeon_16x16.png"
DROHNE = BEWEGT + "Drone_1_Flying_16x16.png"
TIERE = {
    "taube": (TAUBE, 16, 16, "streifen"),
    # Keine Tierart, aber Belebung über dem Wasser: die Drohne von Perfect Move (Dokument 15, Spur P1).
    "drohne": (DROHNE, 16, 16, "streifen"),
    "huhn": ("modern-farm/Animals/Chickens_and_Roosters/Chicken_Brown_16x16.png", 16, 16, "reihen"),
    "ente": ("modern-farm/Animals/Ducks/Duck_Brown_16x16.png", 32, 32, "reihen"),
    "hase": ("modern-farm/Animals/Rabbits/Rabbit_Brown_16x16.png", 32, 32, "reihen"),
    "schwein": ("modern-farm/Animals/Pigs/Pig_Pink_16x16.png", 32, 32, "reihen"),
    "ziege": ("modern-farm/Animals/Goats/Goat_Brown_16x16.png", 32, 48, "reihen"),
    "schaf": ("modern-farm/Animals/Sheeps/Sheep_2_White_16x16.png", 32, 32, "reihen"),
    "kuh": ("modern-farm/Animals/Cows/Cow_16x16.png", 48, 48, "reihen"),
    "esel": ("modern-farm/Animals/Donkeys/Donkey_16x16.png", 48, 48, "reihen"),
    "hund": ("modern-farm/Animals/Dogs/Dog_Labrador_Brown_16x16.png", 48, 32, "baender"),
    "katze": ("modern-farm/Animals/Cats/Cat_Hugo.png", 32, 32, "fest:0:192"),
}


def _figurenwerkzeug(privat: Path):
    """Lädt ``werkzeuge/figuren.py`` des privaten Repositorys (Zusammensetzen und Spielformat)."""
    spec = importlib.util.spec_from_file_location("figuren", privat / "werkzeuge" / "figuren.py")
    if spec is None or spec.loader is None:
        raise FileNotFoundError("werkzeuge/figuren.py fehlt im privaten Repository")
    modul = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modul)
    return modul


def _teile(ordner: Path, praefix: str) -> list[str]:
    """Kennungen der Teile eines Ordners: ``Outfit_05_02.png`` → ``05_02``."""
    return sorted(p.stem.removeprefix(praefix) for p in (ordner / "16x16").glob(f"{praefix}*.png"))


def _haarfarbe(datei: Path) -> str:
    """„grau“, „natürlich“ oder „bunt“ nach dem Mittel der deckenden Pixel einer Frisur."""
    bild = Image.open(datei).convert("RGBA")
    zugriff = bild.load()
    pixel = [zugriff[x, y] for x in range(bild.width) for y in range(bild.height) if zugriff[x, y][3] > 0]
    if not pixel:
        return "bunt"
    r, g, b = (sum(p[i] for p in pixel) / len(pixel) / 255 for i in range(3))
    farbton, saettigung, helligkeit = colorsys.rgb_to_hsv(r, g, b)
    if saettigung < GRAU_HOECHSTENS_SAETTIGUNG and helligkeit > GRAU_MINDESTENS_HELLIGKEIT:
        return "grau"
    if saettigung > BUNT_AB_SAETTIGUNG and farbton > NATUERLICHER_FARBTON:
        return "bunt"
    return "natürlich"


def _gesicht_bedeckt(datei: Path) -> bool:
    """Deckt ein Kleidungsstück das Gesicht (Maske, Sturmhaube, Tierkostüm)? Stoff im Standbild von
    vorn zwischen Stirn und Kinn (Reihen 14–20, Spalten 4–11)."""
    bild = Image.open(datei).convert("RGBA").crop((48, 0, 64, 32))
    return any(bild.getpixel((x, y))[3] > 0 for y in range(14, 21) for x in range(4, 12))


def statistenliste(gen: Path, zufall: random.Random) -> list[dict]:
    """40 Einträge im Format von ``werkzeuge/figuren.json``: Kinder, Ältere (graue Haare), Erwachsene.

    Nur natürliche Haut- und Haarfarben, keine Masken und Kostüme (Wunsch des Autors, 10.11.2026).
    """
    outfits = gen / "Outfits" / "16x16"
    kleidung = [
        k
        for k in _teile(gen / "Outfits", "Outfit_")
        if k.split("_")[0] not in KOSTUEME and not _gesicht_bedeckt(outfits / f"Outfit_{k}.png")
    ]
    haare = {
        f: _haarfarbe(gen / "Hairstyles" / "16x16" / f"Hairstyle_{f}.png")
        for f in _teile(gen / "Hairstyles", "Hairstyle_")
    }
    frisuren = [f for f, farbe in haare.items() if farbe != "bunt" and f.split("_")[0] not in KAPUZEN]
    graue = [f for f, farbe in haare.items() if farbe == "grau"] or frisuren
    kinderfrisuren = [
        f
        for f in _teile(gen / "Hairstyles_kids", "Hairstyle_")
        if f.split("_")[1] not in KAPUZEN_KINDER
        and _haarfarbe(gen / "Hairstyles_kids" / "16x16" / f"Hairstyle_{f}.png") != "bunt"
    ]
    kinder = gen / "Outfits_kids" / "16x16"
    kinderkleidung = [
        k
        for k in _teile(gen / "Outfits_kids", "Outfit_kid_")
        if not _gesicht_bedeckt(kinder / f"Outfit_kid_{k}.png")
    ]
    liste = []
    for i in range(STATISTEN):
        if i < KINDER:
            liste.append(
                {
                    "koerper": zufall.choice(HAUT_KINDER),
                    "augen": zufall.randint(1, 6),
                    "kind": True,
                    "kleidung": zufall.choice(kinderkleidung),
                    "frisur": zufall.choice(kinderfrisuren),
                }
            )
            continue
        aelter = i < KINDER + AELTERE
        # Ältere haben graue Haare, Erwachsene alle natürlichen Farben.
        liste.append(
            {
                "koerper": zufall.choice(HAUT),
                "augen": zufall.randint(1, 7),
                "kleidung": zufall.choice(kleidung),
                "frisur": zufall.choice(graue if aelter else frisuren),
            }
        )
    return liste


def _baender(bild: Image.Image) -> list[tuple[int, int]]:
    """Waagerechte Bänder mit deckenden Pixeln (Bildreihen, Beschriftungen) als (oben, unten)."""
    belegt = [any(bild.getpixel((x, y))[3] > 0 for x in range(0, bild.width, 2)) for y in range(bild.height)]
    baender, anfang = [], None
    for y, voll in enumerate(belegt + [False]):
        if voll and anfang is None:
            anfang = y
        elif not voll and anfang is not None:
            baender.append((anfang, y))
            anfang = None
    return baender


def tierbogen(quelle: Image.Image, breite: int, hoehe: int, art: str) -> Image.Image:
    """Ein Tier im Spielformat: Reihe 0 vier Standbilder, Reihe 1 Laufen (6 je Richtung)."""
    ziel = Image.new("RGBA", (RAHMEN_JE_REIHE * breite, 2 * hoehe))
    if art == "streifen":
        anzahl = quelle.width // breite
        bilder = [quelle.crop((i * breite, 0, (i + 1) * breite, hoehe)) for i in range(anzahl)]
        for i in range(STAND_RAHMEN):
            ziel.paste(bilder[0], (i * breite, 0))
        for i in range(RAHMEN_JE_REIHE):
            ziel.paste(bilder[i % len(bilder)], (i * breite, hoehe))
        return ziel
    if art.startswith("fest:"):
        stand_y, lauf_y = (int(z) for z in art.split(":")[1:])
    elif art == "baender":
        reihen = [b for b in _baender(quelle) if b[1] - b[0] >= hoehe - 4]
        stand_y, lauf_y = reihen[0][1] - hoehe, reihen[2][1] - hoehe
    else:
        stand_y, lauf_y = 0, hoehe
    ziel.paste(quelle.crop((0, stand_y, STAND_RAHMEN * breite, stand_y + hoehe)), (0, 0))
    ziel.paste(quelle.crop((0, lauf_y, RAHMEN_JE_REIHE * breite, lauf_y + hoehe)), (0, hoehe))
    return ziel


def main(argv: list[str]) -> int:
    if len(argv) != 1:
        print(__doc__)
        return 1
    privat = Path(argv[0])
    figuren = _figurenwerkzeug(privat)
    zufall = random.Random(7)
    ziel_figuren = privat / "spiel" / "figuren"
    ziel_figuren.mkdir(parents=True, exist_ok=True)
    for i, eintrag in enumerate(statistenliste(figuren.GEN, zufall), start=1):
        figuren.spielformat(figuren.zusammensetzen(eintrag)).save(ziel_figuren / f"statist-{i:02d}.png")
    ziel_tiere = privat / "spiel" / "tiere"
    ziel_tiere.mkdir(parents=True, exist_ok=True)
    for name, (datei, breite, hoehe, art) in TIERE.items():
        quelle = Image.open(privat / datei).convert("RGBA")
        tierbogen(quelle, breite, hoehe, art).save(ziel_tiere / f"{name}.png")
    print(f"{STATISTEN} Statisten und {len(TIERE)} Tiere nach {privat / 'spiel'}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
