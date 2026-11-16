"""Feine Kollisionsmasken für den Möbelkatalog: Sperren nach der Standfläche (Perspektive).

Warum: Seit Kollision in Viertelkacheln geht (Editor 1.6, ``kollisionfein.py``), soll jedes Möbel so
fein sperren, wie es geformt ist (Wunsch des Autors, 16.11.2026). Die grobe Kachelmaske (alles außer
der obersten Kachelreihe, ``maske.py``) war für Stühle, Lampen und Bäume zu grob. Dabei gilt die
Perspektive (KARTENREGELN 10.88): Hinter einer Stuhllehne, einer Lampe oder einer Baumkrone kann man
optisch entlanggehen; der obere Teil verdeckt dann den Helden (Zeichenreihenfolge nach der unteren
Kante). Gesperrt wird nur die Standfläche am Boden.

Verfahren je Katalogmöbel:

1. Deckende Pixel des Bildes (Deckkraft über ``anordnung_bild.DECKEND``, Schatten zählen nicht).
2. Ein Band über dem Fuß des Bildes (unterste deckende Reihe), dessen Höhe von der Art abhängt
   (``REGELN``): Stühle die untere Hälfte, Schränke eine Kachel, Bäume und Lampen nur der Fuß …
3. Eine Zelle (4 × 4 Pixel) sperrt, wenn sie im Band liegt und mindestens ``MINDEST_PIXEL`` ihrer
   16 Pixel deckend sind; so schließen die Zellen eng ans Bild an.
4. Nur verfeinern: Gesperrt bleibt nur, was die bisherige Maske (Katalog-``maske`` oder die
   Standardregel) sperrt. Ist das Ergebnis leer oder gleich, bleibt das Möbel grob.

Nicht angefasst: Möbel ohne Kollision oder begehbar, mit ``frei_unten``, Türen, Gebäudeteilen,
Verbünden (Bauteil- und Durchgangsregeln), Umgebung (Gebäude, Brücken, Gleise …) und Einträge mit
``maske_fein_von_hand`` (von Hand gesetzt, Text mit Grund) oder ``ohne_maske_fein`` (bewusst grob,
Text mit Grund). Das Ergebnis steht als ``maske_fein`` im Katalog; die grobe ``maske`` leitet
``objektform.geformt`` daraus ab (``kollisionfein.grob_aus_fein``).

Aufruf: ``python -m pipeline.abenteuer.feinmasken [--schreiben] [--alle] [--boegen ORDNER]``.
"""

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.kollisionfein import ZP, K, Z, maskenzellen
from pipeline.abenteuer.moebelliste import ORDNER, lade_moebel, moebeldateien

Zelle = tuple[int, int]
# Ab so vielen deckenden Pixeln (von 16) sperrt eine Zelle (Wunsch des Autors: etwa 4 von 16).
MINDEST_PIXEL = 4
# Deckkraft, ab der ein Pixel zählt (wie anordnung_bild.DECKEND; Schatten von LimeZu haben 100).
DECKEND = 200
SZENEN = ORDNER.parent / "szenen"
FELD_HAND, FELD_GROB = "maske_fein_von_hand", "ohne_maske_fein"


@dataclass(frozen=True)
class Regel:
    """Höhe der Standfläche über dem Fuß: ``anteil`` der sichtbaren Höhe, begrenzt auf
    ``mindest`` bis ``hoechst`` Pixel. Beispiel: Stuhl (0.5, 8, 64) → 11 von 22 sichtbaren Pixeln."""

    anteil: float
    mindest: int
    hoechst: int
    je_spalte: bool = False  # Fuß je Zellspalte statt am Bildfuß (Zaunecken, Geländer)
    stamm: bool = False  # nur die Mitte des Fußes (Baumstamm ohne Erdfleck und Wurzeln)


UNBEGRENZT = 10_000
# Regeln je Gruppe (Grundsatz des Autors, 16.11.2026; KARTENREGELN 10.88).
REGELN = {
    "sitz": Regel(0.5, 8, UNBEGRENZT),  # Stühle, Hocker, Sessel, Bänke: untere Hälfte
    "tisch": Regel(1.0, 0, UNBEGRENZT),  # Platte und Beine: hinter einem Tisch steht man nicht
    "wand": Regel(0.0, K, K),  # Schränke, Regale an der Wand: die unterste Kachelreihe
    "baum": Regel(0.0, 2 * ZP, 2 * ZP, stamm=True),  # nur der Stamm am Fuß
    "fuss": Regel(0.0, 2 * ZP, 2 * ZP),  # Lampen, Pfosten, Schilder: nur der Fuß
    "pflanze": Regel(0.34, 2 * ZP, K),  # Topfpflanzen, Kakteen: Topf und Fuß
    "fahrzeug": Regel(0.6, K, UNBEGRENZT),  # Bodenfläche ohne Dach
    "zaun": Regel(0.0, 2 * ZP, 2 * ZP, True),  # die Linie am Fuß (längs laufende Zäune: ganz)
    "sonst": Regel(0.5, K, UNBEGRENZT),  # alles andere: untere Hälfte, mindestens eine Kachel
}
GRUPPEN = {
    "sitz": {"stuhl", "hocker", "sessel", "bank", "sofa", "busch"},
    "tisch": {"tisch", "schreibtisch", "theke", "tresen", "bett", "stand", "couchtisch", "billard"},
    "wand": {
        "schrank", "regal", "buecherregal", "kuehlschrank", "vitrine", "kommode", "automat",
        "waschmaschine", "herd", "spuele", "kuechenzeile", "ofen", "kamin", "fernseher", "dusche",
        "garderobe", "pinnwand", "kleiderschrank",
    },
    "baum": {"baum", "baumstumpf"},
    "fuss": {
        "lampe", "stehlampe", "laterne", "mast", "fahne", "schild", "signal", "saeule", "windrad",
        "briefkasten", "haltestelle", "licht", "kerze", "plakat",
    },
    "pflanze": {"pflanze", "blume"},
    "fahrzeug": {"fahrzeug", "fahrrad", "karren", "boot"},
    "zaun": {"zaun", "gelaender", "absperrung"},
}  # fmt: skip
# Arten, deren Kollision bleibt, wie sie ist (Gebäude, Umgebung, Türen, Wände, flache Dinge).
UNVERAENDERT = {
    "gebaeude", "gebaeude_teil", "haus", "turm", "tribuene", "stollen", "kiosk", "treppe", "tuer",
    "tor", "bruecke", "steg", "gleis", "wasser", "brunnen", "buehne", "trennwand", "hecke", "fels",
    "denkmal", "bordstein", "markierung", "teppich", "boden", "boden_teil", "schatten",
}  # fmt: skip
# Felder, mit denen ein Möbel eigenen Regeln folgt (Durchgang, Bauteil, Tür, Gebäude).
EIGENE_REGELN = ("frei_unten", "tuer", "gebaeude", "verbund", "begehbar", "an_wand", "bodenoeffnung")


# Ohne ``art`` im Katalog hilft der Name (Teilwort, klein geschrieben; erstes Treffer zählt).
NAMENSTEILE = (
    (("haus", "tankstelle", "stollen", "zelt"), None),
    (("kuebelbaum", "topfpflanze", "kaktus", "saguaro"), "pflanze"),
    (("laterne", "lampe", "strommast", "pylon", "kreuz", "schild", "kerze"), "fuss"),
    (("stuhl", "sessel", "sofa", "bank"), "sitz"),
    (("tisch", "theke", "schalter"), "tisch"),
    (("regal", "kommode", "vitrine", "ofen", "automat", "spender", "server"), "wand"),
    (("baum",), "baum"),
    (("zaun", "pfosten"), "zaun"),
    (("bus", "auto", "boot", "karren", "waggon", "planwagen"), "fahrzeug"),
)


def gruppe(angabe: dict, name: str = "") -> str | None:
    """Die Regelgruppe eines Möbels oder None, wenn es grob bleibt.

    Beispiel: ``{"art": "stuhl", "kollision": true}`` → „sitz“; ``{"art": "gebaeude"}`` → None;
    ohne Art: „parkbank“ → „sitz“, „svHausBlau“ → None.
    """
    art = angabe.get("art")
    if not angabe.get("kollision") or art in UNVERAENDERT or FELD_HAND in angabe or FELD_GROB in angabe:
        return None
    if any(f in angabe for f in EIGENE_REGELN):
        return None
    if art is None:
        klein = name.lower()
        for teile, treffer in NAMENSTEILE:
            if any(t in klein for t in teile):
                return treffer
    return next((g for g, arten in GRUPPEN.items() if art in arten), "sonst")


def deckende_zellen(alpha: bytes, breite: int, hoehe: int) -> dict[Zelle, int]:
    """Zahl der deckenden Pixel je Zelle (nur Zellen mit mindestens einem).

    Eingabe: Alphakanal Reihe für Reihe (``Image.getchannel("A").tobytes()``).
    Beispiel: ein 4 × 4 Bild, ganz deckend → {(0, 0): 16}.
    """
    zahl: dict[Zelle, int] = {}
    for y in range(hoehe):
        reihe = alpha[y * breite : (y + 1) * breite]
        for x, a in enumerate(reihe):
            if a > DECKEND:
                zelle = (x // ZP, y // ZP)
                zahl[zelle] = zahl.get(zelle, 0) + 1
    return zahl


def bandhoehe(regel: Regel, sichtbar: int) -> int:
    """Höhe der Standfläche in Pixeln. Beispiel: Stuhl, 22 Pixel sichtbar → 11; Lampe → 8."""
    return max(regel.mindest, min(regel.hoechst, round(regel.anteil * sichtbar)))


def _regel_fuer(name: str, angabe: dict, breite: int, hoehe: int) -> Regel:
    """Die Regel mit Sonderfall: Ein Zaun, der längs (Nord–Süd) läuft, sperrt seine ganze Linie."""
    g = gruppe(angabe, name) or "sonst"
    laengs = angabe.get("lauf") == "senkrecht" or (angabe.get("lauf") is None and hoehe > breite + K)
    if g == "zaun" and laengs:
        return REGELN["tisch"]
    return REGELN[g]


# Halbe Breite des Stamms in Pixeln: ein Sechstel der Breite des Fußes, 4 bis 8 Pixel.
STAMM_TEIL, STAMM_MIN, STAMM_MAX = 6, ZP, 2 * ZP


def _nur_stamm(zellen: set[Zelle], alpha: bytes, breite: int, von: int, bis: int) -> set[Zelle]:
    """Nur die Zellen um die Mitte des Fußes (Stamm), ohne Erdfleck und Wurzeln am Rand.

    Beispiel: Laubbaum 64 breit mit Erdfleck über 48 Pixel → ein Stamm von 16 Pixeln in der Mitte.
    """
    xs = [x for y in range(max(0, von), bis) for x in range(breite) if alpha[y * breite + x] > DECKEND]
    if not xs:
        return zellen
    mitte = (min(xs) + max(xs) + 1) / 2
    halb = max(STAMM_MIN, min(STAMM_MAX, (max(xs) + 1 - min(xs)) / STAMM_TEIL))
    return {(x, y) for x, y in zellen if (x + 1) * ZP > mitte - halb and x * ZP < mitte + halb}


def alte_zellen(angabe: dict) -> set[Zelle]:
    """Die Zellen, die das Möbel bisher sperrt (Katalog-``maske`` oder Standardregel, ohne Feines).

    Beispiel: Stuhl 16 × 32 ohne Maske → die 16 Zellen der unteren Kachel.
    """
    grob = {k: v for k, v in angabe.items() if k != "maske_fein"}
    return maskenzellen(grob)


def vorschlag(name: str, angabe: dict, alpha: bytes) -> list[str] | None:
    """Die feine Maske für ein Möbel (Format ``maske_fein``) oder None, wenn es grob bleibt.

    Eingaben: Name, Katalogangabe, Alphakanal des Bildes in Katalogsgröße.
    Beispiel: Stuhl 16 × 32, deckend in den Reihen 1 bis 21 → nur die Zellen der Reihen 4 und 5
    (Pixel 16 bis 24), die Lehne oben bleibt frei.
    Sonderfälle: leeres Ergebnis oder gleich der alten Fläche → None.
    """
    if gruppe(angabe, name) is None:
        return None
    breite, hoehe = angabe["breite"], angabe["hoehe"]
    zahl = deckende_zellen(alpha, breite, hoehe)
    if not zahl:
        return None
    zeilen = [y for y in range(hoehe) if any(a > DECKEND for a in alpha[y * breite : (y + 1) * breite])]
    oben, unten = zeilen[0], zeilen[-1] + 1
    regel = _regel_fuer(name, angabe, breite, hoehe)
    band = bandhoehe(regel, unten - oben)
    alt = alte_zellen(angabe)
    dicht = {z for z, n in zahl.items() if n >= MINDEST_PIXEL and z in alt}
    fuss = {x: unten for x, _ in dicht}
    if regel.je_spalte:  # Fuß jeder Zellspalte: unterste dichte Zelle der Spalte
        fuss = {x: (max(y for xx, y in dicht if xx == x) + 1) * ZP for x, _ in dicht}
    neu = {(x, y) for x, y in dicht if y * ZP < fuss[x] and (y + 1) * ZP > fuss[x] - band}
    if regel.stamm and neu:
        neu = _nur_stamm(neu, alpha, breite, unten - band, unten)
    if not neu or neu == alt:
        return None
    spalten, reihen = max(1, breite // K) * Z, max(1, hoehe // K) * Z
    return ["".join("#" if (x, y) in neu else "." for x in range(spalten)) for y in range(reihen)]


def anteil(zellen: set[Zelle], angabe: dict) -> float:
    """Gesperrter Anteil der Bildfläche in Prozent. Beispiel: 16 von 32 Zellen → 50.0."""
    gesamt = max(1, angabe["breite"] // K) * max(1, angabe["hoehe"] // K) * Z * Z
    return 100 * len(zellen) / gesamt


def genutzte_moebel(ordner: Path = SZENEN) -> set[str]:
    """Namen aller Möbel, die eine Szene nennt (auch ``varianten/`` und Zustände)."""
    namen: set[str] = set()
    for datei in sorted(ordner.rglob("*.json")):
        namen |= set(re.findall(r'"moebel":\s*"([^"]+)"', datei.read_text(encoding="utf-8")))
    return namen


def alpha_von(angabe: dict, privat: Path) -> bytes | None:
    """Alphakanal des Bildes (mit ``ausschnitt``) oder None, wenn es fehlt oder anders groß ist."""
    from PIL import Image  # erst hier: Pillow fehlt in GitHub Actions

    pfad = privat / angabe["quelle"]
    if not pfad.is_file():
        return None
    bild = Image.open(pfad).convert("RGBA")
    if "ausschnitt" in angabe:
        bild = bild.crop(tuple(angabe["ausschnitt"]))
    if bild.size != (angabe["breite"], angabe["hoehe"]):
        return None
    return bild.getchannel("A").tobytes()


def vorschlaege(privat: Path, alle: bool = False) -> dict[str, list[str]]:
    """Name → vorgeschlagene feine Maske für alle genutzten (mit ``alle``: alle) Katalogmöbel."""
    moebel = lade_moebel()
    namen = set(moebel) if alle else genutzte_moebel() & set(moebel)
    ergebnis = {}
    for name in sorted(namen):
        angabe = moebel[name]
        if gruppe(angabe, name) is None or (alpha := alpha_von(angabe, privat)) is None:
            continue
        if (fein := vorschlag(name, angabe, alpha)) is not None:
            ergebnis[name] = fein
    return ergebnis


def schreibe(masken: dict[str, list[str]], ordner: Path = ORDNER) -> int:
    """Schreibt ``maske_fein`` in die Katalogdateien; Einträge ohne Vorschlag verlieren eine alte
    automatische ``maske_fein`` (von Hand gesetzte bleiben). Nur das Feld ändert sich im Text
    (``katalogfeld.setze``). Ausgabe: Zahl geänderter Einträge."""
    from pipeline.abenteuer.katalogfeld import setze

    geaendert = 0
    for datei in moebeldateien(ordner):
        text = datei.read_text(encoding="utf-8")
        neu = text
        for name, angabe in json.loads(text)["moebel"].items():
            if FELD_HAND in angabe or angabe.get("maske_fein") == masken.get(name):
                continue
            neu = setze(neu, name, "maske_fein", masken.get(name))
            geaendert += 1
        if neu != text:
            json.loads(neu)  # bricht ab, statt eine kaputte Datei zu schreiben
            datei.write_text(neu, encoding="utf-8")
    return geaendert


def main(argv: list[str] | None = None) -> int:
    from pipeline.abenteuer.anordnung_bild import privat as privat_paket

    teil = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teil.add_argument("--schreiben", action="store_true", help="Vorschläge in den Katalog schreiben")
    teil.add_argument("--alle", action="store_true", help="die ganze Bibliothek, nicht nur genutzte Möbel")
    teil.add_argument("--privat", type=Path, default=None, help="privates Paket (Bilder)")
    teil.add_argument("--boegen", type=Path, default=None, help="Kontaktbögen je Art in diesen Ordner")
    args = teil.parse_args(argv)
    privat = args.privat or privat_paket()
    if privat is None:
        print("Kein privates Paket: Ohne Bilder gibt es keine Vorschläge.")
        return 1
    masken = vorschlaege(privat, args.alle)
    print(f"{len(masken)} Möbel mit feiner Maske vorgeschlagen")
    if args.schreiben:
        print(f"{schreibe(masken)} Katalogeinträge geändert")
    if args.boegen:
        from pipeline.abenteuer.feinmasken_bogen import kontaktboegen

        for pfad in kontaktboegen(args.boegen, privat, lade_moebel(), masken):
            print(pfad)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
