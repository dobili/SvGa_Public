"""Erzählzeilen, die zeitlich nicht ins Gespräch passen: Weg, Treppe, Tür, Ankommen.

Warum: Wunsch des Autors (19.11.2026). Spricht man im Wohnzimmer Mama an, erzählte der Dialog, wie
{held} die Treppe herunterkommt und die neunte Stufe knarrt; da steht {held} aber längst unten.
Was auf dem Weg geschieht, gehört an den Weg: als Erzählmoment beim Betreten der Karte (Feld
``eingang`` in orte.json, oberwelt/eingang.ts) oder an den Übergang. Dieses Werkzeug sucht Kandidaten:
Erzählzeilen (``#sprecher:erzaehler``) in Dialogen, die mit dem Ansprechen einer Figur beginnen
(orte.json, ``figuren[].dialog``), mit Wörtern für Gehen, Steigen, Türen, Treppen, Knarren oder das
Ankommen in einem Raum.

Jeder Kandidat ist entweder behoben (die Zeile steht nicht mehr da) oder steht mit Grund in
``GEPRUEFT`` (passt im Gespräch, etwa eine Bewegung während des Gesprächs oder ein erzählter
Szenenwechsel). Der Dauertest (pipeline/tests/test_abenteuer_erzaehlzeit.py) verlangt, dass jeder neue
Kandidat einmal angesehen wird.

Aufruf: ``python -m pipeline.abenteuer.erzaehlzeit [--alle]`` (``--alle`` zeigt auch die geprüften).
Rückgabe 1 bei ungeprüften Kandidaten. Abhängigkeiten: nur die Standardbibliothek und inkfluss.
"""

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.inkfluss import erreichbar, lies

DATEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer"

BEWEGUNG = re.compile(
    r"\b(du|ihr)\b[^.]{0,40}\b(gehst|geht|kommst|kommt|steigst|steigt|fahrt|fährst|läufst|lauft|"
    r"trittst|tretet|betrittst|betretet|öffnest|klopfst|erreichst|erreicht|rennst|kletterst)\b",
    re.IGNORECASE,
)
GERAEUSCH = re.compile(r"knarr|knarz|quietsch|\bStufe|Treppe", re.IGNORECASE)
ANKOMMEN = re.compile(
    r"^\s*-?\s*(Drinnen|Hinter der Tür|Der Raum ist|Die Hütte ist|Das Zimmer ist|Es riecht)"
)

# Angesehen und passend: „datei:knoten:Anfang der Zeile“ → Grund.
GEPRUEFT: dict[str, str] = {
    "capital-arena-aussen:wanderer:Ein Mann mit gelbem Rucksack sitzt auf den Stufen": "Er sitzt dort.",
    "capital-arena-halle:pause_nach_runde2:Juno sitzt auf der untersten Stufe": "Juno sitzt dort.",
    "capital-arena-halle:halbfinale_danach:Du gehst um den Tisch": "Bewegung im Gespräch.",
    "cedar-creek-aussen:ankunft:Auf ihrer Treppe sitzen zwei Kinder": "Ankunftsdialog beim Betreten.",
    "cedar-creek-aussen:zwillinge:Die Treppe ist leer": "Beschreibt, was man vor sich sieht.",
    "cedar-creek-aussen:zwillinge_a:Die Zwillinge sitzen noch auf der Treppe": "Sie sitzen dort.",
    "cedar-creek-aussen:zwillinge_b:Die Zwillinge sitzen wieder auf der Treppe": "Sie sitzen dort.",
    "cedar-creek-bibliothek:zwillinge:Die Zwillinge sitzen draußen auf der Treppe": "Hinweis, wo sie sind.",
    "crossroads-aussen:slick:Auf den Stufen vor dem Speisewagen sitzt jemand": "Er sitzt dort.",
    "crossroads-aussen:slick:Er sieht dich und springt von den Stufen": "Bewegung im Gespräch.",
    "erinnerung-siedlung:letzter_brief:Stiefel auf der Treppe": "Gideon geht in der Erinnerung.",
    "ironwood-kantine:mama_ankunft:Ihr fahrt am Samstag": "Erzählte Fahrt als eigene Szene (Reise).",
    "maple-falls-aussen:lily_lektion:Du setzt den Springer auf ihr Brett": "Bewegung im Gespräch.",
    "maple-falls-dachboden:abend_nach_sam:Abend. Durch das offene Fenster": "Erzählte Abendszene.",
    "maple-falls-dachboden:epilog_lily:An einem Nachmittag im Oktober": "Epilog, eigene Szene.",
    "maple-falls-dachboden:epilog_lily:- Lily klettert auf den Schaukelstuhl": "Lily im Raum.",
    "port-delacroix-turnhalle:vorwurf_ende:Draußen auf den Stufen setzt Mama sich": "Erzählter "
    "Szenenwechsel nach dem Streit; die Szene endet dort.",
    "port-delacroix-turnhalle:odile_hand:- Du legst die Hand auf den Geigenkasten": "Im Gespräch.",
    "riverton-pavillon:slick_alltag:Slick spielt unten auf der Treppe": "Hinweis, wo Slick ist.",
    "maple-falls-aussen:juno_frueh:Ein Mädchen mit einem Heft voller Sticker": "Der Bus kommt, nicht du.",
    "maple-falls-aussen:juno_trifft:An der Bushaltestelle steht ein Mädchen": "„geht auf“: ihr Gesicht.",
    "ironwood-kantine:big_joe:Es riecht nach Kaffee, Eisen und nassen Jacken": "Stimmung im Raum, in "
    "dem man schon steht.",
    "ironwood-mamas-zimmer:oma_ruth:Ein kleines Zimmer unter dem Dach": "Oma Ruth führt im Gespräch "
    "hinauf („Komm. Ich zeig dir was.“).",
    "maple-falls-wohnzimmer:diner_abend:Es riecht nach Zwiebeln und Kaffee": "Mama lädt ins Diner ein; "
    "die Szene spielt dort.",
}


@dataclass
class Kandidat:
    """Eine Erzählzeile mit Weg- oder Ankunftswörtern in einem Figurendialog."""

    datei: str
    zeile: int
    knoten: str
    text: str

    @property
    def schluessel(self) -> str:
        """Kennung für ``GEPRUEFT``: Datei, Knoten und die ersten Wörter der Zeile."""
        return f"{self.datei}:{self.knoten}:{self.text.strip()}"

    def geprueft(self) -> str | None:
        """Der Grund aus ``GEPRUEFT``, wenn die Zeile den eingetragenen Anfang enthält."""
        for schluessel, grund in GEPRUEFT.items():
            datei, knoten, anfang = schluessel.split(":", 2)
            if (datei, knoten) == (self.datei, self.knoten) and anfang in self.text:
                return grund
        return None


def startknoten(daten: Path = DATEN) -> dict[str, set[str]]:
    """Dialogdatei → Knoten, mit denen ein Gespräch mit einer Figur beginnt (orte.json)."""
    starts: dict[str, set[str]] = {}
    for ort in json.loads((daten / "orte.json").read_text(encoding="utf-8"))["orte"]:
        for figur in ort["figuren"]:
            datei, _, knoten = figur["dialog"].partition(".")
            starts.setdefault(datei, set()).add(knoten)
    return starts


def verdaechtig(text: str) -> bool:
    """Spricht die Zeile von Weg, Treppe, Tür, Knarren oder vom Ankommen in einem Raum?"""
    return bool(BEWEGUNG.search(text) or GERAEUSCH.search(text) or ANKOMMEN.search(text))


def kandidaten(daten: Path = DATEN) -> list[Kandidat]:
    """Alle verdächtigen Erzählzeilen, die vom Ansprechen einer Figur aus erreichbar sind.

    Beispiel: maple-falls-wohnzimmer, Knoten ``erster_abend``: „Du kommst mit dem alten Brett die
    Treppe herunter …“ (vor dem 19.11.2026; heute ein Eingangsdialog des Wohnzimmers).
    """
    gefunden = []
    for datei, knoten in sorted(startknoten(daten).items()):
        pfad = daten / "dialoge" / "de" / f"{datei}.ink"
        if not pfad.exists():
            continue
        fluss = lies(pfad.read_text(encoding="utf-8"))
        zeilen: set[int] = set()
        for name in knoten:
            if (start := fluss.namen.get((name,))) is not None:
                zeilen |= erreichbar(fluss, start)
        for index in sorted(zeilen):
            zeile = fluss.zeilen[index]
            text, _, tags = zeile.text.partition(" #")
            if "sprecher:erzaehler" in tags and verdaechtig(text):
                gefunden.append(Kandidat(datei, zeile.nummer, zeile.knoten, text))
    return gefunden


def main(argumente: list[str] | None = None) -> int:
    """Druckt die ungeprüften Kandidaten (mit ``--alle`` auch die geprüften); Rückgabe 1 bei offenen."""
    argumente = sys.argv[1:] if argumente is None else argumente
    alle = kandidaten()
    offen = [k for k in alle if k.geprueft() is None]
    for kandidat in alle:
        grund = kandidat.geprueft()
        if grund is None or "--alle" in argumente:
            stufe = "geprüft" if grund else "offen"
            stelle = f"{kandidat.datei}:{kandidat.zeile} ({kandidat.knoten})"
            print(f"{stufe:8} {stelle} {kandidat.text.strip()[:110]}")
    print(f"{len(alle)} Kandidaten, {len(offen)} offen")
    return 1 if offen else 0


if __name__ == "__main__":
    sys.exit(main())
