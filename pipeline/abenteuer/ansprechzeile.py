"""Erste Zeilen, die voraussetzen, dass der Held die Figur angesprochen hat.

Warum: Wunsch des Autors (25.11.2026). Hauptfiguren sprechen den Helden jetzt selbst an: Sie gehen
auf ihn zu, und ihr Gespräch beginnt (app/src/abenteuer/oberwelt/useAnsprechen.ts). Manche
Gespräche beginnen aber mit einer Zeile, die das Umgekehrte erzählt: „An der Bushaltestelle steht
ein Mädchen …“ (sie steht längst vor dir auf der Straße), „Du tippst ihr auf die Schulter“, „Ja?
Kann ich dir helfen?“. Dieses Werkzeug sucht solche Zeilen in den ersten Zeilen der Gespräche aller
Figuren, die den Helden ansprechen können (Ziele der Hauptquests, pipeline/abenteuer/ansprechziel.py).

Abhilfe in Ink: Die Variable ``angesprochen`` ist wahr, wenn die Figur angefangen hat (die App setzt
sie, regeln/ansprechen.ts); sie gehört als ``VAR angesprochen = false`` in die Datei, und die Zeile
bekommt eine zweite Fassung, etwa ``{angesprochen: Juno kommt über die Straße auf dich zu.|An der
Bushaltestelle steht ein Mädchen …}``. Eine Zeile mit ``angesprochen`` (auch im Block davor) gilt
als erledigt. Passt die Zeile in beiden Fällen, steht sie mit Grund in ``GEPRUEFT``.

Grenzen: Der Fluss ist vereinfacht (pipeline/abenteuer/inkfluss.py, jede Bedingung kann gelten);
geprüft werden je Weg die ersten ``ERSTE_ZEILEN`` Textzeilen bis zur ersten Wahl.

Aufruf: ``python -m pipeline.abenteuer.ansprechzeile [--alle]`` (``--alle`` zeigt auch die
geprüften). Rückgabe 1 bei offenen Stellen. Dauertest: pipeline/tests/test_abenteuer_ansprechzeile.py.
"""

import re
import sys
from dataclasses import dataclass

from pipeline.abenteuer.ansprechziel import Ziel, alle_ziele, ist_figur, lies
from pipeline.abenteuer.inkfluss import Fluss
from pipeline.abenteuer.inkfluss import lies as lies_ink
from pipeline.abenteuer.kartenbau import INHALTE

ERSTE_ZEILEN = 2
VARIABLE = "angesprochen"

# Der Held geht hin oder spricht an; die Figur steht oder sitzt noch an ihrem Platz; die Figur
# fragt, was man von ihr will. Muster nur am Anfang der Zeile oder als ganze Wendung.
ANSPRECHEN = re.compile(
    r"\b(du|ihr)\b[^.]{0,30}\b(gehst|geht|trittst|tretet|kommst|kommt|tippst|sprichst|klopfst)\b"
    r"[^.]{0,30}\b(zu|an|hin|heran|näher)\b|\bAls (du|ihr) (näher )?(kommst|kommt|herantrittst)",
    re.IGNORECASE,
)
PLATZ = re.compile(
    r"^\s*(An der|Am|Auf der|Auf dem|Vor der|Vor dem|Hinter der|Hinter dem|Neben der|Neben dem|Unter dem)"
    r"\b[^.]{0,60}\b(steht|sitzt|wartet|lehnt|hockt|kniet|liegt)\b"
)
FRAGE = re.compile(
    r"^\s*(\w+:\s*)?„?\s*(Ja\?|Hm\?|Kann ich (dir|euch) helfen|Was (kann ich für dich tun|gibt'?s|gibt es|"
    r"willst du|führt dich)|Du schon wieder|Ach,? du bist(?:'s| es)|Suchst du (was|etwas|jemand))",
    re.IGNORECASE,
)

# Angesehen und passend: „datei:knoten:Anfang der Zeile“ → Grund.
GEPRUEFT: dict[str, str] = {
    "maple-falls-clubraum:sam_vor_dem_coach:Am Fenster sitzt ein Junge": "Sam sitzt in jeder Fassung des "
    "Clubraums (sitzt: rechts); Sitzende stehen zum Ansprechen nicht auf (ansprechschicht.ts), die "
    "Zeile stimmt also auch, wenn er den Helden anspricht.",
}


@dataclass
class Stelle:
    """Eine erste Zeile, die das Ansprechen durch den Helden voraussetzt."""

    datei: str
    zeile: int
    knoten: str
    text: str

    def geprueft(self) -> str | None:
        """Der Grund aus ``GEPRUEFT``, wenn die Zeile den eingetragenen Anfang enthält."""
        for schluessel, grund in GEPRUEFT.items():
            datei, knoten, anfang = schluessel.split(":", 2)
            if (datei, knoten) == (self.datei, self.knoten) and anfang in self.text:
                return grund
        return None


def verdaechtig(text: str) -> bool:
    """Setzt die Zeile voraus, dass der Held hingegangen ist oder die Figur noch am Platz steht?"""
    return bool(ANSPRECHEN.search(text) or PLATZ.search(text) or FRAGE.search(text))


def ist_text(text: str) -> bool:
    """Eine Zeile, die der Spieler liest (keine Logik, Umleitung, Deklaration oder leere Klammer)."""
    rein = re.sub(r"#.*$", "", text).strip().lstrip("-").strip()
    rein = re.sub(r"^\{[^:{}]*:\s*", "", rein)
    if not rein or rein[0] in "~{}" or rein.startswith("->"):
        return False
    return bool(re.search(r"[A-Za-zÄÖÜäöü]{2}", rein))


def erledigt(fluss: Fluss, index: int) -> bool:
    """Steht ``angesprochen`` in der Zeile, in der Zeile davor oder im Kopf ihres Blocks?"""
    zeile = fluss.zeilen[index]
    vorher = fluss.zeilen[index - 1].text if index > 0 else ""
    kopf = fluss.zeilen[zeile.kopf].text if zeile.kopf is not None else ""
    return any(VARIABLE in t for t in (zeile.text, vorher, kopf))


def erste_zeilen(fluss: Fluss, start: int) -> set[int]:
    """Die ersten ``ERSTE_ZEILEN`` Textzeilen je Weg ab ``start``, bis zur ersten Wahl."""
    gefunden: set[int] = set()
    gesehen: set[tuple[int, int]] = set()
    offen = [(start, 0)]
    while offen:
        index, zahl = offen.pop()
        if (index, zahl) in gesehen or zahl >= ERSTE_ZEILEN:
            continue
        gesehen.add((index, zahl))
        zeile = fluss.zeilen[index]
        if zeile.art == "wahl":
            continue
        text = ist_text(zeile.text) and zeile.art not in ("knoten", "stitch", "deklaration")
        if text:
            gefunden.add(index)
        offen += [(folge, zahl + int(text)) for folge in fluss.nachfolger.get(index, set())]
    return gefunden


def startknoten() -> dict[str, set[str]]:
    """Dialogdatei → Startknoten der Figuren, die den Helden ansprechen können."""
    daten = {n: lies(f"{n}.json")[n] for n in ("quests", "orte", "runden", "begegnungen")}
    ziele, _ = alle_ziele(daten)
    namen = {z.objekt for z in ziele if ist_figur(z, daten["orte"])}
    orte_der: dict[str, set[str | None]] = {}
    for z in ziele:
        orte_der.setdefault(z.objekt, set()).add(ort_von(z))
    starts: dict[str, set[str]] = {}
    for ort in daten["orte"]:
        for figur in ort["figuren"]:
            name = figur["kennung"].partition(".")[2]
            if name in namen and ort["kennung"] in orte_der[name] and figur.get("dialog"):
                datei, _, knoten = figur["dialog"].partition(".")
                starts.setdefault(datei, set()).add(knoten)
    return starts


def ort_von(ziel: Ziel) -> str | None:
    """Der Ort eines Ziels: angegeben, sonst der Teil der Kartenkennung vor dem Punkt."""
    return ziel.ort or (ziel.karte.partition(".")[0] if ziel.karte else None)


def stellen() -> list[Stelle]:
    """Alle ersten Zeilen der Gespräche ansprechender Figuren, die das Ansprechen voraussetzen."""
    gefunden = []
    for datei, knoten in sorted(startknoten().items()):
        pfad = INHALTE / "dialoge" / "de" / f"{datei}.ink"
        if not pfad.exists():
            continue
        fluss = lies_ink(pfad.read_text(encoding="utf-8"))
        zeilen: set[int] = set()
        for name in knoten:
            if (start := fluss.namen.get((name,))) is not None:
                zeilen |= erste_zeilen(fluss, start)
        for index in sorted(zeilen):
            zeile = fluss.zeilen[index]
            text = zeile.text.partition(" #")[0]
            if verdaechtig(text) and not erledigt(fluss, index):
                gefunden.append(Stelle(datei, zeile.nummer, zeile.knoten, text.strip()))
    return gefunden


def main(argumente: list[str] | None = None) -> int:
    """Druckt die offenen Stellen (mit ``--alle`` auch die geprüften); Rückgabe 1 bei offenen."""
    argumente = sys.argv[1:] if argumente is None else argumente
    alle = stellen()
    offen = [s for s in alle if s.geprueft() is None]
    for stelle in alle:
        grund = stelle.geprueft()
        if grund is None or "--alle" in argumente:
            stufe = "geprüft" if grund else "offen"
            print(f"{stufe:8} {stelle.datei}:{stelle.zeile} ({stelle.knoten}) {stelle.text[:110]}")
    print(f"{len(alle)} Stellen, {len(offen)} offen")
    return 1 if offen else 0


if __name__ == "__main__":
    sys.exit(main())
