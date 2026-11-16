"""Blickrichtung stehender Figuren und Statisten (Rückmeldung R008).

Warum: Der Autor (R008, zuerst im Diner): „Eine Person in der Küche steht mit dem Gesicht zur Wand.
Bewegen sich Figuren im Spiel von selbst hin und her, ist das in Ordnung. Stehen sie still, müssen sie
logisch platziert sein, an einer sinnvollen Stelle und mit sinnvoller Blickrichtung.“ Sitzende Figuren
schauen seit Runde 12 zum Tisch (Eigenschaft ``sitzt``, Regel 10.79); für stehende gab es keine Prüfung.

Was die App zeigt: Eine stehende Figur oder ein stehender Statist schaut nach unten, außer sie trägt
die Eigenschaft ``blick`` (oben, unten, links, rechts; an der Figur der Szene oder unter
``eigenschaften`` des Statisten; App: ``oberwelt/sitzrichtung.ts``, seit dem 16.11.2026). Was eine
Person ansieht, muss also in ihrer Blickrichtung direkt neben ihr liegen.

Regeln (je stehender Person, die sich nicht bewegt: Figur ohne ``sitzt``, Statist ohne Laufweg oder mit
``von`` gleich ``bis``):
1. **Bezug:** Liegt neben ihr (links, rechts, oben, unten) ein Bezug, soll er in ihrer Blickrichtung
   liegen. Bezüge in
   dieser Reihenfolge: Tresen, Theke, Kasse, Stand, Schalter, Tisch, Schreibtisch, Pult, Tafel, Brett
   (``BEZUGSARTEN``, ``BEZUGSNAME``), dann eine andere Person (Gesprächspartner), zuletzt eine Tür.
   Liegt der Bezug in einer anderen Richtung: Befund mit der Richtung, in die sie schauen soll.
2. **Wand:** Liegt in einem Innenraum in ihrer Blickrichtung Wand und kein Bezug, schaut sie zur
   Wand (der Fall aus R008). Draußen ist ``#`` Hecke, Zaun oder Felskante; dort zu stehen ist kein
   Befund (Kletterer am Canyonrand schauen in die Tiefe).
3. **Personal:** Wer nach Name oder Text Personal ist (``PERSONAL``), steht hinter einem Tresen und
   schaut über ihn zu den Kunden; ohne Tresen, Stand oder Wagen in ``PERSONAL_ABSTAND`` Feldern ist
   das ein Hinweis, außer die Szene gibt ``blick`` an (dann ist sie bewusst zu ihrem Stand gedreht,
   etwa der Imbissverkäufer neben dem Karren in Riverton).
4. **Paare:** Zwei Personen nebeneinander, die sich unterhalten, meldet das Werkzeug einmal (bei der
   ersten nach Name): Beide drehen sich mit ``blick`` zueinander.

Vorschlag: ``blick`` auf die Richtung des Bezugs setzen (``VORSCHLAG``); die Lage bleibt.

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
RICHTUNGEN = tuple(NACHBARN)
WORT = {
    "links": "links neben ihr",
    "rechts": "rechts neben ihr",
    "oben": "über ihr",
    "unten": "unter ihr",
}
GEGENRICHTUNG = {"links": "rechts", "rechts": "links", "oben": "unten", "unten": "oben"}
VORSCHLAG = "„blick“: „{}“ setzen"


@dataclass
class Person:
    """Eine stehende Person auf einer Karte (Figur oder Statist) mit Feld und Text (``tun``)."""

    name: str
    feld: Feld
    figur: bool
    tun: str = ""
    blick: str = "unten"
    angegeben: bool = False  # trägt die Szene „blick“ ausdrücklich?


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


def _blick(wert: object) -> str:
    """Blickrichtung aus ``blick``; ohne gültige Angabe „unten“ wie in der App."""
    return wert if wert in RICHTUNGEN else "unten"


def personen(szene: dict) -> list[Person]:
    """Stehende Figuren und stillstehende Statisten einer Szene (Tiere zählen nicht), mit ``blick``."""
    liste = [
        Person(f["name"], tuple(f["feld"]), True, blick=_blick(f.get("blick")), angegeben="blick" in f)
        for f in szene.get("figuren", [])
        if not f.get("sitzt")
    ]
    for b in szene.get("belebung", []):
        if b.get("typ") == "statist" and steht_still(b):
            eig = b.get("eigenschaften", {})
            blick = _blick(eig.get("blick"))
            liste.append(
                Person(b["name"], tuple(b["feld"]), False, eig.get("tun", ""), blick, "blick" in eig)
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


def _ist_wand(zeilen: list[str], feld: Feld) -> bool:
    x, y = feld
    return 0 <= y < len(zeilen) and 0 <= x < len(zeilen[y]) and zeilen[y][x] == WAND


def _personal_ohne_tresen(p: Person, bezug: dict[Feld, str]) -> bool:
    """Personal (Name oder Text) ohne Tresen, Stand oder Wagen in ``PERSONAL_ABSTAND`` Feldern."""
    if p.angegeben or not PERSONAL.search(f"{p.name} {p.tun}"):
        return False  # mit „blick“ hat die Szene die Person bewusst zu ihrem Stand gedreht
    x, y = p.feld
    return not any(abs(fx - x) <= PERSONAL_ABSTAND and abs(fy - y) <= PERSONAL_ABSTAND for fx, fy in bezug)


def _personalvorschlag(p: Person) -> str:
    """Vorschlag zum Personal-Hinweis: Was sie tut, entscheidet, ob ein Tresen fehlt."""
    if p.tun:
        return f"bleibt: „{p.tun}“ braucht keinen Tresen; sonst „blick“ zum Stand"
    return "ansehen: hinter einen Tresen stellen oder mit „blick“ zum Stand drehen"


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
        if p.blick in richtungen:
            return None
        r = richtungen[0]
        ziel = nachbar[r]
        if art == "Gesprächspartner":
            text = f"Gesprächspartner auf ({ziel[0]}, {ziel[1]}) liegt {WORT[r]}, sie schaut nach {p.blick}"
            vorschlag = f"{VORSCHLAG.format(r)}, beim Partner „{GEGENRICHTUNG[r]}“"
            return Befund(karte, p.name, p.feld, text, vorschlag)
        text = f"{art} {quelle[ziel]} liegt {WORT[r]}, sie schaut nach {p.blick}"
        return Befund(karte, p.name, p.feld, text, VORSCHLAG.format(r))
    if innen and _ist_wand(zeilen, nachbar[p.blick]):
        frei = [r for r, f in nachbar.items() if not _ist_wand(zeilen, f) and f not in gesperrt]
        vorschlag = VORSCHLAG.format(frei[0]) if frei else "an einen Bezug stellen"
        return Befund(karte, p.name, p.feld, "schaut zur Wand (R008)", vorschlag)
    if _personal_ohne_tresen(p, bezug):
        return Befund(karte, p.name, p.feld, "Personal ohne Tresen in der Nähe", _personalvorschlag(p))
    return None


def ungueltige_angaben(karte: str, szene: dict) -> list[Befund]:
    """Befunde für ``blick``-Werte, die die App nicht kennt (sie zeigt dann „unten“), etwa „quer“."""
    eintraege = [(f, f) for f in szene.get("figuren", [])]
    eintraege += [(b, b.get("eigenschaften", {})) for b in szene.get("belebung", [])]
    return [
        Befund(
            karte,
            e["name"],
            tuple(e["feld"]),
            f"unbekannte Blickrichtung „{eig['blick']}“",
            "oben, unten, links oder rechts",
        )
        for e, eig in eintraege
        if "blick" in eig and eig["blick"] not in RICHTUNGEN
    ]


def pruefe_szene(karte: str, szene: dict, moebel: dict) -> list[Befund]:
    """Alle Befunde zur Blickrichtung einer Szene, dazu unbekannte Werte von ``blick``."""
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
    return ungueltige_angaben(karte, szene) + befunde


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
                "Personen schauen nach unten, außer die Szene gibt `blick` an (oben, unten, links, rechts; "
                "seit dem 16.11.2026 in der App). Was sie ansehen sollen (Tresen, Tisch, Brett, "
                "Gesprächspartner, Tür), muss in ihrer Blickrichtung neben ihnen liegen. Laufende Statisten "
                "und Sitzende zählen nicht.",
                "",
                "Stand nach der Umsetzung: Die Befunde zu Bezug, Wand und Gesprächspaaren sind über `blick` "
                "behoben, ohne eine Figur zu verschieben. Übrig bleiben Hinweise auf Personal ohne Tresen; "
                "die meisten stehen draußen und tun etwas anderes (fegen, Pause, Lampions aufhängen), dafür "
                "braucht es keinen Tresen. Wo ein Stand eindeutig daneben steht (Imbisskarren in Riverton, "
                "Flohmarkttisch an der Landstraße), schaut die Person jetzt dorthin.",
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
