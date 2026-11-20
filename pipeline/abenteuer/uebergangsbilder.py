"""Prüfung der Bilder an Übergängen: Tür, Treppe, Weg passen zur Art, zu beiden Orten und zur Lage.

Warum: Wunsch des Autors (14.11.2026): „eine Prüfung einbauen, die bei den Assets von Übergängen
(Türen, Treppen usw.) prüft, dass die Assets wirklich das darstellen, was sie sollen, und zu den
Orten passt, die es verbinden soll.“ Regel: KARTENREGELN 10.77, mit 10.2 (Türen), 10.74 (Grundriss),
10.75 (Lage der Tür innen wie außen) und 10.76 (Treppe, Leiter, Fahrstuhl).

Je Übergang (beide Seiten, ``uebergangsarten.paare``):
1. **Art:** Am Auslöser steht ein Bild der erwarteten Art (``uebergangsarten.AKZEPTIERT``): Tür innen,
   Gebäude mit Tür außen, Treppe/Luke/Leiter/Fahrstuhl zwischen Geschossen, sichtbarer Weg am Rand,
   Steg oder Haltestelle bei Reisen. Möbel ohne ``art`` am Auslöser: „unbekannt, bitte benennen“.
2. **Richtung:** Eine Treppe nach oben zeigt ein Bild mit ``richtung`` „hoch“, eine nach unten eines
   mit „runter“ (Möbelangabe). Die Ebene einer Karte folgt aus ihrem Namen (``ebene``).
3. **Ort:** Kellertreppe führt in einen Keller; Leiter nur zu Heuboden, Rohbau, Stellwerk; Fahrstuhl
   nur in modernen Gebäuden ab 4 Geschossen; Wendeltreppe nur in runden Bauten und Türmen; nicht mehr
   Geschosse innen als außen. Die Tür innen hat den Stil des Gebäudes (modern gegen rustikal).
4. **Lage:** Die Tür liegt innen in der Wand, die außen zum Auslöser zeigt (Haustür vorn = Südwand),
   im selben Drittel der Breite (10.75), an einer Türstelle des Grundrisses (10.74); das Türbild passt
   zur Wand (Südwand: flaches Türbild, Nordwand: hohes); Aufgänge liegen auf jeder Geschosskarte an
   derselben Stelle (10.76).

Aufruf: ``python -m pipeline.abenteuer.uebergangsbilder [--ort KENNUNG] [--boegen ORDNER [--privat PFAD]]``;
auch als Teil von ``python -m pipeline.abenteuer.uebergaenge``. Die eigene Ausgabe nennt dazu die
Befunde fester Ankunftsfelder (``ankunftsfeld.py``, Editor 1.4). Kontaktbögen: ``uebergangsbogen.py``.
"""

import json
import re
import sys
from dataclasses import dataclass

from pipeline.abenteuer.kartenbau import INHALTE, WAND, K, raster
from pipeline.abenteuer.uebergangsarten import AKZEPTIERT, Seite, erwartet, paare

# Ebenen nach Wörtern im Kartennamen: Keller unten, Obergeschoss und Dachboden oben.
EBENEN = (
    (re.compile(r"keller|archiv|ubahnhof|stollen|gruft|gewoelbe", re.I), -1),
    (re.compile(r"dachboden", re.I), 2),
    (re.compile(r"^zimmer$|^obergeschoss|^og$", re.I), 1),
)
LEITER_ERLAUBT = re.compile(r"heuboden|scheune|rohbau|stellwerk", re.I)
STILGRUPPE = {
    "modern": "modern",
    "industrie": "modern",
    "rustikal": "alt",
    "laendlich": "alt",
    "natur": "alt",
}
FAHRSTUHL_AB = 4
# Größte Abweichung der Lage eines Aufgangs zwischen zwei Geschosskarten (Anteil der Kartenmaße).
AUFGANG_ABWEICHUNG = 0.25
GEBAEUDE = ("gebaeude",)
# Böden, die am Kartenrand als derselbe Belag gelten (Fahrbahnmitte ist Asphalt mit Markierung).
BELAGFAMILIE = {"asphaltMitte": "asphalt", "asphaltMitteSenkrecht": "asphalt"}


@dataclass
class Befund:
    """Ein Befund: Karte, Auslöser, was nicht passt und ein Vorschlag (für die Befundliste)."""

    karte: str
    ausloeser: str
    text: str
    vorschlag: str

    def __str__(self) -> str:
        return f"{self.karte} {self.ausloeser}: {self.text} (Vorschlag: {self.vorschlag})"


def ebene(karte: str) -> int:
    """Geschoss einer Karte nach ihrem Namen: Keller −1, Erdgeschoss 0, Zimmer 1, Dachboden 2.

    Beispiel: ``cedarCreek.archiv`` → −1, ``mapleFalls.zimmer`` → 1, ``mapleFalls.wohnzimmer`` → 0.
    """
    teil = karte.split(".", 1)[-1]
    for muster, wert in EBENEN:
        if muster.search(teil):
            return wert
    return 0


def lade_grundrisse() -> dict[str, dict]:
    """Grundrisse der Gebäudebilder (10.74), Schlüssel ist der Bildpfad (``quelle``)."""
    pfad = INHALTE / "katalog_korrekturen" / "grundrisse.json"
    return {k: v["grundriss"] for k, v in json.loads(pfad.read_text(encoding="utf-8")).items()}


def gebaeude_an(seite: Seite) -> tuple[dict, dict] | None:
    """(Stück, Angabe) des Gebäudes am Auslöser einer Außenseite, das größte zuerst."""
    liste = [(s, a) for s, a, b in seite.moebel if b in GEBAEUDE]

    def rang(t: tuple[dict, dict]) -> tuple[bool, int]:
        # Das Bild mit Türangabe (``tuer``) zuerst: Am Seiteneingang der Bibliothek steht der
        # Anbau mit Tür neben dem großen Bau ohne Tür.
        return bool(t[1].get("tuer")), t[0]["breite"] * t[0]["hoehe"]

    return max(liste, key=rang) if liste else None


def lage_am_gebaeude(seite: Seite, stueck: dict) -> str:
    """Wo der Auslöser am Gebäudebild liegt: sued (vor der Front), nord, west, ost."""
    x, y = seite.mitte
    x0, x1 = stueck["x"] // K, (stueck["x"] + stueck["breite"] - 1) // K
    y0, y1 = stueck["y"] // K, (stueck["y"] + stueck["hoehe"] - 1) // K
    if x < x0:
        return "west"
    if x > x1:
        return "ost"
    return "nord" if y < y0 + (y1 - y0) / 3 else "sued"


def drittel(wert: float, anfang: int, ende: int) -> int:
    """Drittel (0 links, 1 Mitte, 2 rechts) einer Lage zwischen ``anfang`` und ``ende``."""
    breite = max(ende - anfang + 1, 1)
    return min(2, max(0, int(3 * (wert - anfang + 0.5) / breite)))


def raumspanne(szene: dict) -> tuple[int, int]:
    """Erste und letzte Spalte des Innenraums, die nicht Wand ist."""
    spalten = [x for zeile in raster(szene) for x, z in enumerate(zeile) if z != WAND]
    return min(spalten), max(spalten)


def pruefe_art(seite: Seite, soll: str) -> list[Befund]:
    """Regel 1: Am Auslöser steht ein Bild der erwarteten Art; unbekannte Bilder melden."""
    befunde = []
    for s, _, art in seite.moebel:
        if art == "unbekannt":
            befunde.append(
                Befund(
                    seite.karte,
                    seite.name,
                    f"Bild {s['name']} am Übergang hat keine Art",
                    "unbekannt, bitte im Katalog benennen (art in inhalte/abenteuer/moebel/)",
                )
            )
    ist = seite.bildarten()
    if ist & AKZEPTIERT[soll]:
        return befunde
    worte = {
        "weg": "Weg",
        "tuer": "Türbild",
        "gebaeude": "Gebäude mit Tür",
        "treppe": "Treppenbild",
        "stollen": "Stolleneingang",
        "steg": "Steg oder Boot",
        "reise": "Steg, Haltestelle oder Gebäude",
    }
    gesehen = ", ".join(sorted(ist - {"unbekannt"})) or "nichts"
    vorschlag = {
        "weg": "Weg (Erde, Pflaster) bis an den Rand führen oder Auslöser auf den Weg legen",
        "tuer": "Türbild (art tuer) auf den Auslöser in die Wand setzen",
        "gebaeude": "Auslöser an die Tür eines Gebäudebilds legen",
        "treppe": "Treppe, Luke oder Leiter (art treppe) auf den Auslöser setzen",
    }.get(soll, "passendes Bild an den Auslöser setzen")
    befunde.append(
        Befund(seite.karte, seite.name, f"erwartet {worte[soll]}, am Auslöser: {gesehen}", vorschlag)
    )
    return befunde


def soll_richtung(seite: Seite, gegen: Seite) -> str | None:
    """hoch, runter oder None (gleiche Ebene) für eine Treppe von ``seite`` zu ``gegen``."""
    hier, dort = ebene(seite.karte), ebene(gegen.karte)
    if hier != dort:
        return "hoch" if dort > hier else "runter"
    if re.search(r"oben|dachboden|hoch|rauf", seite.name, re.I):
        return "hoch"
    if re.search(r"unten|keller|runter", seite.name, re.I):
        return "runter"
    return None


def _richtung(stueck: dict, angabe: dict) -> str | None:
    """Richtung eines gesetzten Treppenbilds (Katalog ``richtung``). Eine Drehung ändert sie nicht:
    Eine gedrehte Treppe hinauf führt weiter hinauf, nur in eine andere Himmelsrichtung. Ein
    durchscheinendes Treppenbild (``deckkraft``) ist der Blick durch ein Bodenloch, wie der Autor es
    im Karteneditor baut (16.11.2026): Es passt zu beiden Richtungen („beide“)."""
    richtung = angabe.get("richtung")
    if not richtung or stueck.get("deckkraft"):
        return "beide" if richtung else None
    return richtung


def _pruefe_richtung(seite: Seite, treppen: list[tuple[dict, dict, str]], soll: str | None) -> list[Befund]:
    """Regel 2: Ein Treppenbild am Auslöser zeigt in die Richtung des Übergangs. Stehen mehrere
    Aufgänge nebeneinander (Zimmer: Treppe hoch zum Dachboden über dem Schacht nach unten), genügt
    eines in der richtigen Richtung."""
    if not soll or not treppen or any(_richtung(s, a) in (soll, "beide") for s, a, _ in treppen):
        return []
    falsch = [s["name"] for s, a, _ in treppen if _richtung(s, a)]
    if falsch:
        return [
            Befund(
                seite.karte,
                seite.name,
                f"{', '.join(falsch)} zeigt eine Treppe "
                f"{'runter' if soll == 'hoch' else 'hoch'}, der Übergang führt {soll}",
                f"Bild mit richtung „{soll}“ nehmen (oben auf der unteren Karte, unten auf der oberen)",
            )
        ]
    namen = ", ".join(s["name"] for s, _, _ in treppen)
    return [
        Befund(
            seite.karte,
            seite.name,
            f"{namen}: Richtung des Treppenbildes unbekannt",
            "richtung (hoch/runter) in der Möbelangabe ergänzen",
        )
    ]


def pruefe_treppe(seite: Seite, gegen: Seite, gebaeude: dict | None) -> list[Befund]:
    """Regeln 2 und 3 für Aufgänge: Richtung des Bildes, Keller, Leiter, Fahrstuhl, Wendeltreppe."""
    soll = soll_richtung(seite, gegen)
    treppen = [(s, a, art) for s, a, art in seite.moebel if art in AKZEPTIERT["treppe"]]
    befunde = _pruefe_richtung(seite, treppen, soll)
    for s, angabe, art in treppen:
        quelle = angabe.get("quelle", "")
        if (art == "leiter" or "leiter" in quelle) and not LEITER_ERLAUBT.search(
            f"{seite.karte} {gegen.karte}"
        ):
            befunde.append(
                Befund(
                    seite.karte,
                    seite.name,
                    f"{s['name']} ist eine Leiter (10.76: nur Heuboden, Rohbau, Stellwerk)",
                    "Treppe statt Leiter",
                )
            )
        if art == "aufzug" and not _hochhaus(gebaeude):
            befunde.append(
                Befund(
                    seite.karte,
                    seite.name,
                    f"{s['name']}: Fahrstuhl im Gebäude unter "
                    f"{FAHRSTUHL_AB} Geschossen oder nicht modern (10.76)",
                    "Treppe statt Fahrstuhl",
                )
            )
        if art == "wendeltreppe" and not _rund(gebaeude, seite.karte):
            befunde.append(
                Befund(
                    seite.karte,
                    seite.name,
                    f"{s['name']}: Wendeltreppe ohne runden Bau (10.76)",
                    "gerade Treppe",
                )
            )
    if re.search(r"keller", seite.name, re.I) and soll == "runter" and ebene(gegen.karte) >= 0:
        befunde.append(
            Befund(
                seite.karte,
                seite.name,
                f"Kellertreppe führt nach {gegen.karte}, keinem Keller",
                "Zielkarte als Keller kennzeichnen oder Auslöser umbenennen",
            )
        )
    return befunde


def _hochhaus(gebaeude: dict | None) -> bool:
    return bool(
        gebaeude
        and gebaeude["grundriss"].get("geschosse", 1) >= FAHRSTUHL_AB
        and gebaeude["angabe"].get("stil") == "modern"
    )


def _rund(gebaeude: dict | None, karte: str) -> bool:
    return "turm" in karte.lower() or bool(
        gebaeude and gebaeude["grundriss"].get("form") in ("rund", "achteck")
    )


def pruefe_aufgangslage(seite: Seite, gegen: Seite) -> list[Befund]:
    """10.76: Auf jeder Geschosskarte liegt der Aufgang an derselben Stelle (Anteil der Kartenmaße)."""
    (bx, by), (gx, gy) = seite.groesse, gegen.groesse
    (ax, ay), (zx, zy) = seite.mitte, gegen.mitte
    if abs(ax / bx - zx / gx) <= AUFGANG_ABWEICHUNG and abs(ay / by - zy / gy) <= AUFGANG_ABWEICHUNG:
        return []
    return [
        Befund(
            seite.karte,
            seite.name,
            f"Aufgang bei ({ax:.0f}, {ay:.0f}) von {bx}×{by}, auf {gegen.karte} bei ({zx:.0f}, {zy:.0f}) "
            f"von {gx}×{gy}: nicht an derselben Stelle (10.76)",
            "Treppe auf beiden Geschosskarten an dieselbe Stelle legen",
        )
    ]


def pruefe_paar(seite: Seite, gegen: Seite | None, reise: bool, haus: dict, grundrisse: dict) -> list[Befund]:
    """Alle Regeln für einen Übergang, von beiden Seiten aus."""
    from pipeline.abenteuer.uebergangstueren import pruefe_haustuer

    befunde: list[Befund] = []
    for hier, dort in ((seite, gegen), (gegen, seite)):
        if hier is None:
            continue
        soll = erwartet(hier, dort, reise)
        befunde += pruefe_art(hier, soll)
        if soll == "treppe" and dort is not None:
            befunde += pruefe_treppe(hier, dort, haus.get(hier.karte))
        if soll == "tuer" and dort is not None and not dort.innen:
            befunde += pruefe_haustuer(hier, dort, grundrisse)
    if gegen and seite.innen and gegen.innen and erwartet(seite, gegen, reise) == "treppe":
        befunde += pruefe_aufgangslage(seite, gegen)
    if gegen and seite.am_rand and gegen.am_rand and not reise:
        befunde += pruefe_randbelag(seite, gegen)
    return befunde


def pruefe_randbelag(seite: Seite, gegen: Seite) -> list[Befund]:
    """10.72: Am Kartenrand hat der Weg auf beiden Karten denselben Belag (kein Wechsel von Pflaster
    auf Erde oder von Stadtstraße auf Landstraße genau an der Kante)."""
    from pipeline.abenteuer.uebergangsarten import boden_an

    if {"steg", "bruecke"} & (seite.bildarten() | gegen.bildarten()):
        return []  # Steg oder Brücke am Rand: Darunter liegt Wasser oder Sumpf, das Bild ist der Weg.
    hier = sorted({BELAGFAMILIE.get(b, b) for b in (boden_an(seite.szene, f) for f in seite.felder)})
    dort = sorted({BELAGFAMILIE.get(b, b) for b in (boden_an(gegen.szene, f) for f in gegen.felder)})
    if set(hier) & set(dort):
        return []
    return [
        Befund(
            seite.karte,
            seite.name,
            f"Belag wechselt am Kartenrand: {', '.join(hier)} ↔ {', '.join(dort)} auf {gegen.karte} (10.72)",
            "denselben Belag bis an den Rand führen, den Wechsel auf eine der Karten legen",
        )
    ]


def pruefe_alle(
    alle: dict[str, dict], liste: list[dict], moebel: dict, ort: str | None = None
) -> list[Befund]:
    """Befunde aller Übergänge (oder nur der Übergänge eines Orts)."""
    from pipeline.abenteuer.uebergangstueren import gebaeude_der_innenkarten, pruefe_geschosse

    grundrisse = lade_grundrisse()
    alle_paare = paare(alle, liste, moebel)
    haus = gebaeude_der_innenkarten(alle_paare, grundrisse)
    befunde = pruefe_geschosse(haus)
    for seite, gegen, reise in alle_paare:
        befunde += pruefe_paar(seite, gegen, reise, haus, grundrisse)
    if ort:
        befunde = [b for b in befunde if b.karte.split(".")[0] == ort]
    eindeutig = {str(b): b for b in befunde}
    return list(eindeutig.values())


def main(argumente: list[str]) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    from pipeline.abenteuer.ankunftsfeld import ankunftsbefunde
    from pipeline.abenteuer.moebelliste import lade_moebel
    from pipeline.abenteuer.uebergaenge import szenen, uebergaenge

    ort = argumente[argumente.index("--ort") + 1] if "--ort" in argumente else None
    alle, moebel = szenen(), lade_moebel()
    befunde: list = pruefe_alle(alle, uebergaenge(), moebel, ort)
    # Feste Ankunftsfelder (Editor 1.4, ankunftsfeld.py): frei und auf keinem Auslöser.
    befunde += [f"Ankunft: {b}" for b in ankunftsbefunde(alle, moebel, ort)]
    for b in befunde:
        print(f"- {b}")
    if "--boegen" in argumente:
        from pathlib import Path

        from pipeline.abenteuer.uebergangsbogen import PRIVAT, kontaktboegen

        ziel = Path(argumente[argumente.index("--boegen") + 1])
        privat = Path(argumente[argumente.index("--privat") + 1]) if "--privat" in argumente else PRIVAT
        for pfad in kontaktboegen(ziel, ort, privat):
            print(f"Kontaktbogen: {pfad}")
    print("Bilder der Übergänge in Ordnung" if not befunde else f"{len(befunde)} Befunde an Übergangsbildern")
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
