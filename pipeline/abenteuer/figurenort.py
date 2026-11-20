"""Figuren am falschen Ort: Ortsangaben im Dialog und Figuren nach einem Abschied oder Aufbruch.

Warum: Lektorat der Lesefassung (19.11.2026, Abschnitt „Offen“). Mama stand in Ironwood auf der Karte
„Mamas altes Zimmer“, ihr Dialog erzählte aber die Kantine („In der Kantine bullert der Ofen“). Juno
stand nach dem Aufbruch weiter im Clubraum und an der Haltestelle, obwohl es hieß: „Juno wartet am
Park.“ Beides ist Kartenbelegung (Szenen und ``wenn`` in orte.json), kein Textfehler. Dieses Werkzeug
sucht solche Stellen in zwei Prüfungen:

1. **Ort:** Erzählzeilen, die vom Ansprechen einer Figur aus erreichbar sind und einen Innenort
   nennen („In der Kantine“, „Im Diner“, „Am Steg“), der nicht zu einer Karte passt, auf der die Figur
   steht (Grundkarte oder Kartenfassung aus ``zustaende``).
2. **Abschied:** Ein Dialog setzt eine Variable wie ``aufbruchGesehen`` oder ``slickAbschiedGesehen``
   und nennt dabei eine Figur desselben Orts (Sprecher oder Name in der Szene). Steht die Figur danach
   noch da, weil weder ihr ``wenn`` die Variable kennt noch eine Kartenfassung mit dieser Variable sie
   weglässt, ist das ein Kandidat.

Jeder Kandidat ist behoben oder steht mit Grund in ``figurenort_geprueft.GEPRUEFT`` (wie bei
pipeline/abenteuer/erzaehlzeit.py). Der Dauertest (pipeline/tests/test_abenteuer_figurenort.py)
verlangt, dass jeder neue Kandidat einmal angesehen wird.

Aufruf: ``python -m pipeline.abenteuer.figurenort [--alle]`` (``--alle`` zeigt auch die geprüften).
Rückgabe 1 bei ungeprüften Kandidaten. Abhängigkeiten: Standardbibliothek und inkfluss.
"""

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.figurenort_geprueft import GEPRUEFT
from pipeline.abenteuer.inkfluss import erreichbar, lies

DATEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"

# Ortswort → Karten, auf denen es passt. Nur Innenorte und Plätze, die man in einem Satz „betritt“;
# Ortsnamen wie „Ironwood“ oder Straßen sagen nichts über die Karte.
ORTSWOERTER: dict[str, frozenset[str]] = {
    wort: frozenset(karten.split())
    for wort, karten in {
        "Kantine": "ironwood.kantine",
        "Diner": "mapleFalls.diner wegDesertSummit.diner wegDesertSummit.hinterzimmer",
        "Hinterzimmer": "wegDesertSummit.hinterzimmer",
        "Clubraum": "mapleFalls.clubraum",
        "Lesesaal": "cedarCreek.bibliothek",
        "Bibliothek": "cedarCreek.bibliothek cedarCreek.archiv",
        "Archiv": "cedarCreek.archiv",
        "Waschsalon": "cedarCreek.waschsalon",
        "Werkstatt": "portDelacroix.werkstatt cedarCreek.drechslerei",
        "Turnhalle": "portDelacroix.turnhalle",
        "Saloon": "ghostTown.saloon",
        "Garage": "desertSprings.garage",
        "Antiquariat": "desertSprings.antiquariat",
        "Museum": "ironwood.museum",
        "Umkleide": "ironwood.umkleide",
        "Pavillon": "riverton.pavillon",
        "Wohnwagen": "riverton.wohnwagen",
        "Schuppen": "riverton.schuppen",
        "Gasthaus": "lockport.gasthaus",
        "Lobby": "siliconBay.lobby",
        "Serverraum": "siliconBay.serverraum",
        "Akademie": "siliconBay.akademie",
        "Musikhaus": "portDelacroix.musikhaus",
        "Wohnzimmer": "mapleFalls.wohnzimmer",
        "Dachboden": "mapleFalls.dachboden",
        "Küche": "mapleFalls.wohnzimmer ironwood.mamasZimmer",
        "Halle": "capitalArena.halle riverton.bahnhofshalle",
        "Steg": "cedarCreek.aussen bayou.steg mapleFalls.park wegMapleCedar.flussweg",
        "Kuppel": "sternwarte.kuppel",
        "Bergladen": "summitCity.bergladen",
        "Raststätte": "crossroads.raststaette wegIronwoodSilicon.raststaette",
        "Stollen": "steinbruch.stollen goldmine.stollen",
        "Leuchtturm": "wegGhostCapital.leuchtturm",
    }.items()
}
# „Vor der Turnhalle“ steht man draußen; nur Wendungen, die den Ort selbst meinen.
ORTSANGABE = re.compile(
    r"\b(?:In der|Im|Ins|In die|In den|Am|Auf dem|Durch die) (" + "|".join(ORTSWOERTER) + r")\b"
)
ABSCHIED = re.compile(
    r"^(abschied|aufbruch|abfahrt|abreise)\w*Gesehen$|(Abschied|Aufbruch|Abfahrt|Abreise)\w*Gesehen$"
)
SETZT = re.compile(r"^\s*~\s*(\w+)\s*=\s*true\b")


@dataclass(frozen=True)
class Stand:
    """Eine Karte, auf der eine Figur steht, mit der Bedingung der Kartenfassung (None: Grundkarte)."""

    karte: str
    zustand: str | None


@dataclass
class Kandidat:
    """Ein Fund: Prüfung (ort, abschied), Figur, Fundstelle und Text oder Variable."""

    pruefung: str
    figur: str
    stelle: str
    text: str

    @property
    def schluessel(self) -> str:
        """Kennung für ``GEPRUEFT``: Prüfung, Figur und Fundstelle (Datei.Knoten)."""
        return f"{self.pruefung}:{self.figur}:{self.stelle}"

    def geprueft(self) -> str | None:
        """Der Grund aus ``GEPRUEFT`` oder None."""
        return GEPRUEFT.get(self.schluessel)


def lade_orte(daten: Path = DATEN) -> list[dict]:
    """Die Orte aus orte.json."""
    return json.loads((daten / "orte.json").read_text(encoding="utf-8"))["orte"]


def staende(orte: list[dict], daten: Path = DATEN) -> dict[str, set[Stand]]:
    """Figur (Kennung) → Karten und Kartenfassungen, auf denen sie steht (Objekte ``figur``)."""
    ergebnis: dict[str, set[Stand]] = {}
    for ort in orte:
        for karte in ort["karten"]:
            dateien = [(karte["datei"], None), *((d, z) for z, d in (karte.get("zustaende") or {}).items())]
            for datei, zustand in dateien:
                for name in _figurennamen(daten / datei):
                    kennung = f"{ort['kennung']}.{name}"
                    ergebnis.setdefault(kennung, set()).add(Stand(karte["kennung"], zustand))
    return ergebnis


def _figurennamen(pfad: Path) -> list[str]:
    """Namen der Figurenobjekte einer gebauten Karte (Tiled-JSON); leer, wenn es sie nicht gibt."""
    if not pfad.exists():
        return []
    karte = json.loads(pfad.read_text(encoding="utf-8"))
    return [
        objekt["name"]
        for ebene in karte.get("layers", [])
        for objekt in ebene.get("objects") or []
        if objekt.get("type") == "figur"
    ]


def _fluss(daten: Path, datei: str):
    """Der gelesene Ink-Fluss einer Dialogdatei oder None."""
    pfad = daten / "dialoge" / "de" / f"{datei}.ink"
    return lies(pfad.read_text(encoding="utf-8")) if pfad.exists() else None


def ortsfunde(orte: list[dict], stand: dict[str, set[Stand]], daten: Path = DATEN) -> list[Kandidat]:
    """Prüfung 1: Erzählzeilen eines Figurendialogs, die einen Ort nennen, an dem die Figur nicht steht.

    Beispiel (vor dem 20.11.2026): ironwood.mama auf ironwood.mamasZimmer, Dialog
    ironwood-kantine.mama → mama_ankunft: „In der Kantine bullert der Ofen.“ → Kandidat.
    """
    funde = []
    for ort in orte:
        for figur in ort["figuren"]:
            datei, _, knoten = figur.get("dialog", "").partition(".")
            fluss = _fluss(daten, datei) if datei else None
            start = fluss.namen.get((knoten,)) if fluss else None
            if start is None:
                continue
            karten = {s.karte for s in stand.get(figur["kennung"], set())}
            for index in sorted(erreichbar(fluss, start)):
                zeile = fluss.zeilen[index]
                text, _, marken = zeile.text.partition(" #")
                if "sprecher:erzaehler" not in marken:
                    continue
                for treffer in ORTSANGABE.finditer(text):
                    if not ORTSWOERTER[treffer.group(1)] & karten:
                        stelle = f"{datei}.{zeile.knoten}"
                        funde.append(Kandidat("ort", figur["kennung"], stelle, text.strip()))
    return funde


def _dateiorte(orte: list[dict]) -> dict[str, set[str]]:
    """Dialogdatei → Orte, deren Figuren, Auslöser oder Eingänge sie verwenden."""
    ergebnis: dict[str, set[str]] = {}
    for ort in orte:
        quellen = [
            *ort["figuren"],
            *ort.get("ausloeser", []),
            *(k.get("eingang") or {} for k in ort["karten"]),
        ]
        for quelle in quellen:
            if dialog := quelle.get("dialog"):
                ergebnis.setdefault(dialog.split(".")[0], set()).add(ort["kennung"])
    return ergebnis


def _abschiedsknoten(fluss) -> dict[str, tuple[str, str]]:
    """Knoten → (Variable, Text des Knotens) für Knoten, die eine Abschiedsvariable setzen."""
    texte: dict[str, list[str]] = {}
    for zeile in fluss.zeilen:
        texte.setdefault(zeile.knoten, []).append(zeile.text)
    ergebnis = {}
    for knoten, zeilen in texte.items():
        for text in zeilen:
            if (treffer := SETZT.match(text)) and ABSCHIED.search(treffer.group(1)):
                ergebnis[knoten] = (treffer.group(1), "\n".join(zeilen))
    return ergebnis


def _genannt(figur: dict, text: str, namen: dict[str, str]) -> bool:
    """Spricht die Figur im Text, oder nennt der Text ihren Namen (ganz oder den letzten Teil)?"""
    sprecher = figur["name"].split(".")[1]
    name = namen.get(figur["name"], "")
    teile = {name, name.split()[-1]} if name else set()
    return f"sprecher:{sprecher}" in text or any(re.search(rf"\b{re.escape(t)}\b", text) for t in teile)


def _bleibt_stehen(figur: dict, variable: str, orte: list[dict], stand: dict[str, set[Stand]]) -> bool:
    """Steht die Figur nach der Variable noch? Nein, wenn ihr ``wenn`` die Variable nennt oder eine
    Kartenfassung mit dieser Variable in der Bedingung sie weglässt."""
    if variable in figur.get("wenn", ""):
        return False
    eigene = stand.get(figur["kennung"], set())
    for ort in orte:
        for karte in ort["karten"]:
            if karte["kennung"] not in {s.karte for s in eigene}:
                continue
            for bedingung in karte.get("zustaende") or {}:
                if variable in bedingung and Stand(karte["kennung"], bedingung) not in eigene:
                    return False
    return bool(eigene)


def abschiedsfunde(orte: list[dict], stand: dict[str, set[Stand]], daten: Path = DATEN) -> list[Kandidat]:
    """Prüfung 2: Figuren, die ein Abschieds- oder Aufbruchsknoten nennt und die danach noch stehen.

    Beispiel (vor dem 20.11.2026): maple-falls-wohnzimmer.aufbruch setzt ``aufbruchGesehen`` und
    nennt Juno; mapleFalls.junoClub hatte nur ``wenn: clubBeigetreten`` → Kandidat.
    """
    namen = json.loads((daten / "texte" / "de.json").read_text(encoding="utf-8"))
    funde = []
    for datei, ortkennungen in sorted(_dateiorte(orte).items()):
        fluss = _fluss(daten, datei)
        for knoten, (variable, text) in sorted((_abschiedsknoten(fluss) if fluss else {}).items()):
            for ort in orte:
                if ort["kennung"] not in ortkennungen:
                    continue
                for figur in ort["figuren"]:
                    if _genannt(figur, text, namen) and _bleibt_stehen(figur, variable, orte, stand):
                        funde.append(Kandidat("abschied", figur["kennung"], f"{datei}.{knoten}", variable))
    return funde


def kandidaten(daten: Path = DATEN) -> list[Kandidat]:
    """Alle Kandidaten beider Prüfungen, je Schlüssel einmal (der erste Text zählt)."""
    orte = lade_orte(daten)
    stand = staende(orte, daten)
    einmal: dict[str, Kandidat] = {}
    for kandidat in [*ortsfunde(orte, stand, daten), *abschiedsfunde(orte, stand, daten)]:
        einmal.setdefault(kandidat.schluessel, kandidat)
    return list(einmal.values())


def main(argumente: list[str] | None = None) -> int:
    """Druckt die ungeprüften Kandidaten (mit ``--alle`` auch die geprüften); Rückgabe 1 bei offenen."""
    argumente = sys.argv[1:] if argumente is None else argumente
    alle = kandidaten()
    offen = [k for k in alle if k.geprueft() is None]
    for kandidat in alle:
        grund = kandidat.geprueft()
        if grund is None or "--alle" in argumente:
            stufe = "geprüft" if grund else "offen"
            print(f"{stufe:8} {kandidat.schluessel} {kandidat.text[:100]}")
            if grund and "--alle" in argumente:
                print(f"         Grund: {grund}")
    print(f"{len(alle)} Kandidaten, {len(offen)} offen")
    return 1 if offen else 0


if __name__ == "__main__":
    sys.exit(main())
