"""Blickrichtung stehender Figuren und Statisten (Rückmeldung R008).

Warum: Der Autor (R008, zuerst im Diner): „Eine Person in der Küche steht mit dem Gesicht zur Wand.
Bewegen sich Figuren im Spiel von selbst hin und her, ist das in Ordnung. Stehen sie still, müssen sie
logisch platziert sein, an einer sinnvollen Stelle und mit sinnvoller Blickrichtung.“ Sitzende Figuren
schauen seit Runde 12 zum Tisch (Eigenschaft ``sitzt``, Regel 10.79); für stehende gab es keine Prüfung.

Was die App zeigt: Eine stehende Figur oder ein stehender Statist schaut nach unten (Standbild „unten“,
``oberwelt/szene.ts``); eine Eigenschaft für eine andere Blickrichtung gibt es für Stehende nicht. Die
Blickrichtung lässt sich also nur über den Platz steuern: Was eine Person ansieht, muss direkt unter
ihr liegen.

Regeln (je stehender Person, die sich nicht bewegt: Figur ohne ``sitzt``, Statist ohne Laufweg oder mit
``von`` gleich ``bis``):
1. **Bezug:** Liegt neben ihr (links, rechts, oben, unten) ein Bezug, soll er unten liegen. Bezüge in
   dieser Reihenfolge: Tresen, Theke, Kasse, Stand, Schalter, Tisch, Schreibtisch, Pult, Tafel, Brett
   (``BEZUGSARTEN``, ``BEZUGSNAME``), dann eine andere Person (Gesprächspartner), zuletzt eine Tür.
   Liegt der Bezug seitlich oder oben: Befund mit dem Feld, auf dem sie ihn ansehen würde.
2. **Wand:** Liegt in einem Innenraum unter ihr Wand und kein Bezug, schaut sie zur Wand (der Fall aus
   R008). Draußen ist ``#`` Hecke, Zaun oder Felskante; dort zu stehen ist kein Befund (Kletterer am
   Canyonrand schauen in die Tiefe).
3. **Personal:** Wer nach Name oder Text Personal ist (``PERSONAL``), steht hinter einem Tresen und
   schaut über ihn zu den Kunden; ohne Tresen, Stand oder Wagen in ``PERSONAL_ABSTAND`` Feldern ist
   das ein Hinweis.
4. **Paare:** Zwei Personen nebeneinander, die sich unterhalten, meldet das Werkzeug einmal (bei der
   ersten nach Name): Einer der beiden steht besser über dem anderen, dann schaut der obere zum unteren.

Vorschläge: das Feld direkt über dem Bezug (dort schaut die Person ihn an), wenn es frei ist; sonst
„Blickrichtung angeben“ (die App bräuchte dafür eine Eigenschaft ``blick`` für Stehende).

Aufruf: ``python -m pipeline.abenteuer.blickrichtung [--ort KENNUNG] [--bericht DATEI]``. Mit
``--bericht`` schreibt es den Abschnitt R008 in die Berichtsdatei von ``raumgroesse.py``. Beispiel::

    python -m pipeline.abenteuer.blickrichtung \
        --bericht docs/spiel/auftraege/rueckmeldung/raumgroesse_16-11.md
"""

import re
import sys
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.durchgang import alle_fassungen
from pipeline.abenteuer.kartenbau import WAND, K, platziere, raster, sperrfelder
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.raumgroesse import BERICHTSTITEL, schreibe_abschnitt
from pipeline.abenteuer.uebergaenge import szenen

Feld = tuple[int, int]
BEZUGSARTEN = ("tresen", "theke", "stand", "tisch", "schreibtisch", "tafel", "pinnwand", "automat")
BEZUGSNAME = re.compile(
    r"tresen|theke|kasse|stand|schalter|pult|brett|tafel|wagen|karren|kiosk|cart|imbiss", re.I
)
PERSONAL = re.compile(
    r"kellner|verk(ae|ä)uf|kassier|wirt|barkeeper|barmann|personal|h(ae|ä)ndler|b(ae|ä)cker|schaffner|"
    r"bibliothekar|empfang|portier|apothek|hector|patel|boateng",
    re.I,
)
# Personal darf so viele Felder vom Tresen weg stehen (hinter breiten Theken liegt ein Gang).
PERSONAL_ABSTAND = 2
NACHBARN = {"unten": (0, 1), "links": (-1, 0), "rechts": (1, 0), "oben": (0, -1)}
WORT = {"links": "links neben ihr", "rechts": "rechts neben ihr", "oben": "über ihr (hinter ihr)"}


@dataclass
class Person:
    """Eine stehende Person auf einer Karte (Figur oder Statist) mit Feld und Text (``tun``)."""

    name: str
    feld: Feld
    figur: bool
    tun: str = ""


@dataclass
class Befund:
    """Ein Befund zur Blickrichtung: Karte, Person, Feld, was nicht stimmt, Vorschlag."""

    karte: str
    person: str
    feld: Feld
    text: str
    vorschlag: str

    def zeile(self) -> str:
        x, y = self.feld
        return f"| {self.karte} | {self.person} | {x}, {y} | {self.text} | {self.vorschlag} |"


def steht_still(eintrag: dict) -> bool:
    """Steht ein Statist still? Ohne ``von``/``bis`` oder mit ``von`` gleich ``bis``, und er sitzt nicht.

    Beispiel: Kellnerin mit ``von`` „1,4“ und ``bis`` „9,4“ läuft (keine Prüfung); Erntehelfer mit
    ``von`` gleich ``bis`` steht.
    """
    eig = eintrag.get("eigenschaften", {})
    if eig.get("sitzt"):
        return False
    return eig.get("von") is None or eig.get("von") == eig.get("bis")


def personen(szene: dict) -> list[Person]:
    """Stehende Figuren und stillstehende Statisten einer Szene (Tiere zählen nicht)."""
    liste = [
        Person(f["name"], tuple(f["feld"]), True) for f in szene.get("figuren", []) if not f.get("sitzt")
    ]
    for b in szene.get("belebung", []):
        if b.get("typ") == "statist" and steht_still(b):
            liste.append(
                Person(b["name"], tuple(b["feld"]), False, b.get("eigenschaften", {}).get("tun", ""))
            )
    return liste


def _bildfelder(stueck: dict) -> set[Feld]:
    x0, y0 = stueck["x"] // K, stueck["y"] // K
    x1, y1 = (stueck["x"] + stueck["breite"] - 1) // K, (stueck["y"] + stueck["hoehe"] - 1) // K
    return {(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)}


def bezuege(szene: dict, moebel: dict) -> tuple[dict[Feld, str], dict[Feld, str], set[Feld]]:
    """Felder mit Bezug (Feld → Möbelname), Türfelder (Feld → Möbelname) und alle gesperrten Felder.

    Ein Bezug belegt die Felder, die er sperrt (der Fuß, wo man davor steht); eine Tür ohne Kollision
    (sie hängt in der Wand) belegt ihr ganzes Bild."""
    bezug, tueren, gesperrt = {}, {}, set()
    for s in platziere(szene, moebel)[0]:
        angabe = moebel.get(s["name"], {})
        felder = sperrfelder(s)
        gesperrt |= felder
        art = angabe.get("art") or ""
        if art in BEZUGSARTEN or BEZUGSNAME.search(s["name"]):
            for f in felder or _bildfelder(s):
                bezug.setdefault(f, s["name"])
        elif art == "tuer":
            for f in _bildfelder(s):
                tueren.setdefault(f, s["name"])
    return bezug, tueren, gesperrt


def _frei(zeilen: list[str], gesperrt: set[Feld], feld: Feld) -> bool:
    x, y = feld
    return 0 <= y < len(zeilen) and 0 <= x < len(zeilen[0]) and zeilen[y][x] != WAND and feld not in gesperrt


def _vorschlag(zeilen: list[str], gesperrt: set[Feld], ziel: Feld, besetzt: set[Feld]) -> str:
    """Das Feld über dem Bezug, wenn es frei ist (dort schaut die Person ihn an), sonst eine Eigenschaft."""
    oben = (ziel[0], ziel[1] - 1)
    if _frei(zeilen, gesperrt, oben) and oben not in besetzt:
        return f"auf ({oben[0]}, {oben[1]}) stellen, dann schaut sie zu ihm hinunter"
    return "Blickrichtung angeben (braucht eine Eigenschaft „blick“ für Stehende in der App)"


def _personal_ohne_tresen(p: Person, bezug: dict[Feld, str]) -> bool:
    """Personal (Name oder Text) ohne Tresen, Stand oder Wagen in ``PERSONAL_ABSTAND`` Feldern."""
    if not PERSONAL.search(f"{p.name} {p.tun}"):
        return False
    x, y = p.feld
    return not any(abs(fx - x) <= PERSONAL_ABSTAND and abs(fy - y) <= PERSONAL_ABSTAND for fx, fy in bezug)


def pruefe_person(p: Person, karte: str, zeilen: list[str], kontext: tuple) -> Befund | None:
    """Regeln 1 bis 3 für eine Person; ``kontext`` = (Bezüge, Türen, gesperrt, Felder anderer Personen,
    innen?)."""
    bezug, tueren, gesperrt, andere, innen = kontext
    x, y = p.feld
    nachbar = {r: (x + dx, y + dy) for r, (dx, dy) in NACHBARN.items()}
    for quelle, art in (
        (bezug, "Bezug"),
        ({f: "Person" for f in andere}, "Gesprächspartner"),
        (tueren, "Tür"),
    ):
        richtungen = [r for r, f in nachbar.items() if f in quelle]
        if not richtungen:
            continue
        if "unten" in richtungen:
            return None
        r = richtungen[0]
        ziel = nachbar[r]
        if art == "Gesprächspartner":
            text = f"Gesprächspartner auf ({ziel[0]}, {ziel[1]}) liegt {WORT[r]}, beide schauen nach unten"
            vorschlag = "einen der beiden über den anderen stellen (der obere schaut zum unteren)"
            return Befund(karte, p.name, p.feld, text, vorschlag)
        text = f"{art} {quelle[ziel]} liegt {WORT[r]}, sie schaut nach unten"
        return Befund(karte, p.name, p.feld, text, _vorschlag(zeilen, gesperrt, ziel, andere))
    unten = nachbar["unten"]
    if innen and 0 <= unten[1] < len(zeilen) and zeilen[unten[1]][unten[0]] == WAND:
        return Befund(
            karte, p.name, p.feld, "schaut zur Wand (R008)", "eine Reihe höher stellen oder an einen Bezug"
        )
    if _personal_ohne_tresen(p, bezug):
        return Befund(
            karte, p.name, p.feld, "Personal ohne Tresen in der Nähe", "hinter einen Tresen stellen"
        )
    return None


def pruefe_szene(karte: str, szene: dict, moebel: dict) -> list[Befund]:
    """Alle Befunde zur Blickrichtung einer Szene."""
    zeilen = raster(szene)
    bezug, tueren, gesperrt = bezuege(szene, moebel)
    leute = sorted(personen(szene), key=lambda q: q.name)
    alle_felder = {q.feld for q in leute}
    alle_felder |= {tuple(b["feld"]) for b in szene.get("belebung", []) if b.get("typ") == "statist"}
    innen = szene.get("art") == "innen"
    befunde, gemeldet = [], set()
    for p in leute:
        if p.feld in gemeldet:
            continue  # Regel 4: das Paar ist schon bei der anderen Person gemeldet
        befund = pruefe_person(p, karte, zeilen, (bezug, tueren, gesperrt, alle_felder - {p.feld}, innen))
        if befund:
            befunde.append(befund)
            if befund.text.startswith("Gesprächspartner"):
                gemeldet |= {p.feld, *((p.feld[0] + dx, p.feld[1] + dy) for dx, dy in NACHBARN.values())}
    return befunde


def pruefe(ort: str | None = None) -> tuple[int, list[Befund]]:
    """(Zahl der geprüften Personen, Befunde) über alle Szenen und Zustände, nach Karte sortiert."""
    moebel = lade_moebel()
    gezaehlt, befunde = 0, []
    for marke, szene in alle_fassungen(szenen()):
        if ort and not szene["karte"].startswith(f"{ort}."):
            continue
        gezaehlt += len(personen(szene))
        befunde += pruefe_szene(marke, szene, moebel)
    return gezaehlt, sorted(befunde, key=lambda b: (b.karte, b.person))


def abschnitt(gezaehlt: int, befunde: list[Befund]) -> str:
    """Der Abschnitt R008 des Berichts (Markdown)."""
    wand = sum("Wand" in b.text for b in befunde)
    return (
        "\n".join(
            [
                "## R008: Blickrichtung stehender Figuren und Statisten",
                "",
                "Erzeugt mit `python -m pipeline.abenteuer.blickrichtung --bericht <diese Datei>`. Stehende "
                "Personen schauen in der App immer nach unten; was sie ansehen sollen (Tresen, Tisch, Brett, "
                "Gesprächspartner, Tür), muss deshalb direkt unter ihnen liegen. Laufende Statisten und "
                "Sitzende zählen nicht.",
                "",
                f"Geprüft: {gezaehlt} stehende Personen in allen Fassungen; {len(befunde)} Befunde, davon "
                f"{wand} mit Blick zur Wand.",
                "",
                "| Karte | Person | Feld | Befund | Vorschlag |",
                "| ----- | ------ | ---- | ------ | --------- |",
                *[b.zeile() for b in befunde],
            ]
        )
        + "\n"
    )


def main(argumente: list[str]) -> int:
    ort = argumente[argumente.index("--ort") + 1] if "--ort" in argumente else None
    gezaehlt, befunde = pruefe(ort)
    if "--bericht" in argumente:
        datei = Path(argumente[argumente.index("--bericht") + 1])
        schreibe_abschnitt(datei, "R008", abschnitt(gezaehlt, befunde), BERICHTSTITEL)
        print(f"R008: {gezaehlt} Personen, {len(befunde)} Befunde, Abschnitt in {datei}")
        return 0
    for b in befunde:
        print(b.zeile())
    print(f"{gezaehlt} Personen geprüft, {len(befunde)} Befunde")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
