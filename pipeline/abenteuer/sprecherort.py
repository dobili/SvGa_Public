"""Dialoge gegen die Haltung und den Ort der Sprechenden auf der Karte.

Warum: Befund des Autors (20.11.2026, Foto). In der ersten Nacht im Zimmer stand der Held direkt vor
Ambrose am Fenster, der Text aber erzählte die schlaflose Nacht („Unten summt der Kühlschrank“,
Antworten „Bist du wach?“ / „Kannst du auch nicht schlafen?“): Der Held hätte im Bett liegen müssen.
Seit dem 20.11.2026 können Dialoge Figuren versetzen und führen (``#stelle``, ``#gehe``,
app/src/abenteuer/oberwelt/gefuehrterweg.ts). Dieses Werkzeug sucht Stellen, an denen der Text eine
Haltung oder Bewegung erzählt, die Karte und Tags nicht zeigen. Vier Prüfungen:

1. **liegen:** Ein Knoten erzählt Schlaf, Bett oder Wachliegen des Helden (``SCHLAF``), legt ihn aber
   nicht mit ``#stelle:held>…>liegt`` ins Bett.
2. **kommt:** Eine Erzählzeile sagt, eine Figur desselben Orts komme herüber, herein, auf {held} zu
   oder setze sich zu {held} (``KOMMT``), ohne ``#gehe`` für diese Figur in derselben Zeile.
3. **sitzt:** Eine Erzählzeile sagt, eine Figur sitze (``SITZT``), aber auf keiner Karte des Orts
   sitzt sie (Eigenschaft ``sitzt`` des Figurenobjekts).
4. **ruft:** Die angesprochene Figur ruft laut Text von unten, von draußen oder aus einem anderen
   Raum (``RUFT``), steht aber neben {held}.

Jeder Kandidat ist behoben oder steht mit Grund in ``sprecherort_geprueft.GEPRUEFT`` (passt) oder
``GEMELDET`` (Kartenbefund, an den Hauptchat gemeldet) (wie
pipeline/abenteuer/figurenort.py). Der Dauertest (pipeline/tests/test_abenteuer_sprecherort.py)
verlangt, dass jeder neue Kandidat einmal angesehen wird.

Aufruf: ``python -m pipeline.abenteuer.sprecherort [--alle]``. Rückgabe 1 bei ungeprüften Kandidaten.
Abhängigkeiten: figurenort.py (Orte, Dialogdateien je Ort, Ink-Fluss), Standardbibliothek.
"""

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.figurenort import DATEN, _dateiorte, _fluss, lade_orte
from pipeline.abenteuer.sprecherort_geprueft import GEMELDET, GEPRUEFT

# Schlaf und Bett des Helden („du“): wach liegen, einschlafen, die Augen fallen zu, im Bett.
SCHLAF = re.compile(
    r"\b(Bist du wach|kannst (?:du )?(?:auch )?nicht schlafen|schläfst ein|Augen zufallen|"
    r"dir die Augen zu|liegst (?:wach|im Bett|da)|in deinem Bett|unter der Decke|im Bett liegst)\b",
    re.IGNORECASE,
)
# Eine Figur bewegt sich zu {held} oder in den Raum.
KOMMT = re.compile(
    r"\b(kommt (?:herüber|herein|dazu|angelaufen|auf dich zu|zu dir|den Gang herunter)|"
    r"auf dich zukommt|setzt sich (?:neben dich|zu dir|dir gegenüber)|"
    r"stellt sich neben (?:dich|sie|ihn)|geht (?:zum|zur|ans) (?:Fenster|Tür|Tresen|Brett))"
)
# Eine Figur sitzt (Erzählung über eine Figur, nicht über {held}).
SITZT = re.compile(r"\b(sitzt|sitzen) (?:auf|am|an|im|in|hinter|vor|zwischen|neben)\b")
# Die Figur spricht aus der Ferne.
RUFT = re.compile(
    r"\b(ruft (?:von unten|von draußen|aus der Küche|von oben|herauf|herunter)|"
    r"von unten ruft|von draußen ruft)\b"
)
STELLE_LIEGT = re.compile(r"#stelle:held>[^#\s]+>liegt")
GEHE = re.compile(r"#gehe:(\w+)>")
SPRECHER = re.compile(r"#sprecher:(\w+)")


@dataclass
class Kandidat:
    """Ein Fund: Prüfung, Figur (oder „held“), Fundstelle (Datei.Knoten) und Text."""

    pruefung: str
    figur: str
    stelle: str
    text: str

    @property
    def schluessel(self) -> str:
        """Kennung für ``GEPRUEFT``: Prüfung, Figur und Fundstelle."""
        return f"{self.pruefung}:{self.figur}:{self.stelle}"

    def geprueft(self) -> str | None:
        """Der Grund aus ``GEPRUEFT`` oder ``GEMELDET`` (Kartenbefund, gemeldet), sonst None."""
        return GEPRUEFT.get(self.schluessel) or GEMELDET.get(self.schluessel)


@dataclass(frozen=True)
class Kartenfigur:
    """Eine Figur auf einer Karte: Name des Objekts und ob sie dort sitzt."""

    name: str
    sitzt: bool


def _kartenfiguren(ort: dict, daten: Path) -> list[Kartenfigur]:
    """Figurenobjekte aller Karten und Kartenfassungen eines Orts."""
    figuren = []
    for karte in ort["karten"]:
        for datei in [karte["datei"], *(karte.get("zustaende") or {}).values()]:
            pfad = daten / datei
            if not pfad.exists():
                continue
            for ebene in json.loads(pfad.read_text(encoding="utf-8")).get("layers", []):
                for objekt in ebene.get("objects") or []:
                    if objekt.get("type") != "figur":
                        continue
                    werte = {p["name"]: p["value"] for p in objekt.get("properties") or []}
                    figuren.append(Kartenfigur(objekt["name"], bool(werte.get("sitzt"))))
    return figuren


def _namen(ort: dict, texte: dict[str, str]) -> dict[str, str]:
    """Anzeigename (ganz und letztes Wort) → Objektname der Figur in diesem Ort."""
    ergebnis = {}
    for figur in ort["figuren"]:
        objekt = figur["kennung"].split(".", 1)[1]
        name = texte.get(figur["name"], "")
        for teil in {name, name.split()[-1] if name else ""} - {""}:
            ergebnis[teil] = objekt
    return ergebnis


def _genannte(text: str, namen: dict[str, str]) -> set[str]:
    """Objektnamen der Figuren, die der Text mit Namen nennt."""
    return {o for n, o in namen.items() if re.search(rf"\b{re.escape(n)}\b", text)}


def _schlaffunde(datei: str, fluss) -> list[Kandidat]:
    """Prüfung 1: Knoten mit Schlaf oder Bett, ohne den Helden ins Bett zu legen."""
    je_knoten: dict[str, list[str]] = {}
    for zeile in fluss.zeilen:
        je_knoten.setdefault(zeile.knoten, []).append(zeile.text)
    funde = []
    for knoten, zeilen in je_knoten.items():
        ganz = "\n".join(zeilen)
        if (treffer := SCHLAF.search(ganz)) and not STELLE_LIEGT.search(ganz):
            zeile = next(z for z in zeilen if treffer.group(0) in z)
            funde.append(Kandidat("liegen", "held", f"{datei}.{knoten}", zeile.strip()))
    return funde


def _zeilenfunde(datei: str, fluss, ort: dict, namen: dict[str, str], figuren) -> list[Kandidat]:
    """Prüfungen 2 bis 4 für die Zeilen einer Datei an einem Ort."""
    sitzende = {f.name for f in figuren if f.sitzt}
    auf_karte = {f.name for f in figuren}
    funde = []
    for zeile in fluss.zeilen:
        text, _, marken = zeile.text.partition(" #")
        stelle = f"{datei}.{zeile.knoten}"
        gefuehrt = set(GEHE.findall(zeile.text))
        genannt = _genannte(text, namen) & auf_karte
        if "sprecher:erzaehler" in marken and KOMMT.search(text):
            funde += [Kandidat("kommt", f, stelle, text.strip()) for f in genannt - gefuehrt]
        if "sprecher:erzaehler" in marken and SITZT.search(text):
            funde += [Kandidat("sitzt", f, stelle, text.strip()) for f in genannt - sitzende]
        if RUFT.search(text):
            sprecher = set(SPRECHER.findall(zeile.text)) | genannt
            funde += [Kandidat("ruft", f, stelle, text.strip()) for f in sprecher & auf_karte]
    return funde


def kandidaten(daten: Path = DATEN) -> list[Kandidat]:
    """Alle Kandidaten der vier Prüfungen, je Schlüssel einmal (der erste Text zählt)."""
    orte = {o["kennung"]: o for o in lade_orte(daten)}
    texte = json.loads((daten / "texte" / "de.json").read_text(encoding="utf-8"))
    alle: list[Kandidat] = []
    for datei, ortkennungen in sorted(_dateiorte(list(orte.values())).items()):
        fluss = _fluss(daten, datei)
        if fluss is None:
            continue
        alle += _schlaffunde(datei, fluss)
        for kennung in sorted(ortkennungen):
            ort = orte[kennung]
            alle += _zeilenfunde(datei, fluss, ort, _namen(ort, texte), _kartenfiguren(ort, daten))
    einmal: dict[str, Kandidat] = {}
    for kandidat in alle:
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
            print(f"{stufe:8} {kandidat.schluessel} {kandidat.text[:110]}")
            if grund and "--alle" in argumente:
                print(f"         Grund: {grund}")
    print(f"{len(alle)} Kandidaten, {len(offen)} offen")
    return 1 if offen else 0


if __name__ == "__main__":
    sys.exit(main())
