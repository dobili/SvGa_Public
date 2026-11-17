"""Prüfung der Besuchszähler in den Ink-Dialogen des Schach-Abenteuers.

Warum: Die App legt für jeden Dialog eine neue Ink-Geschichte an (app/src/abenteuer/dialog/
Dialog.tsx); über Dialoge hinweg bleiben nur die globalen Variablen (VAR) erhalten. Der
Besuchszähler eines Knotens steht deshalb zu Beginn jedes Dialogs auf 0. Eine Bedingung wie
``{mira_erinnerung_wahl: …}`` stimmt nur, wenn der gezählte Knoten im selben Dialog vorher
durchlaufen wird; setzt sie einen früheren Dialog voraus, ist sie immer falsch (Befund vom
17.11.2026, desert-springs-garage.ink). Solche Merker gehören in eine VAR.

Was geprüft wird: jede Bedingung auf den Besuchszähler eines Knotens, Stitches oder Labels
(``{knoten: …}``, ``{not knoten: …}``, ``{knoten}``, ``knoten > 1``, Bedingungen an Wahlen, Fälle
``- knoten:`` in Blöcken, Zeilen mit ``~``, ``TURNS_SINCE(-> x)``, ``READ_COUNT(-> x)``), getrennt
von Variablen (VAR, CONST, LIST, temp, Parameter) und Funktionen. Je Bedingung und je Startknoten,
von dem aus sie erreichbar ist (Fluss aus pipeline/abenteuer/inkfluss.py):

- ``befund``, immer 0: Der gezählte Knoten kann bei keinem Startknoten vor der Bedingung liegen.
- ``befund``, immer 1: Er liegt bei jedem Startknoten genau einmal davor (kein Weg an ihm vorbei,
  kein Weg zu ihm zurück); die Bedingung ist dann immer wahr.
- ``unsicher``: Die Bedingung ist von keinem Startknoten erreichbar, der Name ist zugleich
  Variable, das Label hängt an einer Wahl, oder der Leser versteht die Datei nicht ganz.
- ``in Ordnung``: Der Knoten kann davor liegen.

Startknoten: alle Verweise ``datei.knoten`` in den Feldern ``dialog`` (orte.json: Figuren,
Auslöser, Übergänge, Ansehen; begegnungen.json: Partiemomente) und ``danach`` (runden.json) der
Daten in inhalte/abenteuer. Quests (``knoten``) warten nur auf Knoten und starten keine Dialoge.

Aufruf: ``python -m pipeline.abenteuer.inkbesuche [--alle]``; Rückgabe 1, wenn es Befunde gibt.
"""

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.inkfluss import ZEICHENKETTE, Fluss, Zeile, erreichbar, lies, ziel

HAUPTORDNER = Path(__file__).resolve().parents[2]
DATEN = HAUPTORDNER / "inhalte" / "abenteuer"
DIALOGE = DATEN / "dialoge" / "de"
# Felder der Spieldaten, deren Wert „datei.knoten“ einen Dialog startet (siehe Dateikopf).
STARTFELDER = ("dialog", "danach")
VERWEIS = re.compile(r"([a-z0-9-]+)\.(\w+)")
ZAEHLFUNKTION = re.compile(r"\b(TURNS_SINCE|READ_COUNT)\(\s*->\s*([\w.]+)\s*\)")
UMLEITUNGSWERT = re.compile(r"->\s*[\w.]*")
# Ein Name, auch mit Pfad, der kein Funktionsaufruf ist.
NAME = re.compile(r"(?<![\w.\"])([A-Za-z_]\w*(?:\.\w+)*)(?!\w)(?!\s*\()")
FALL = re.compile(r"^\s*-(?!>)\s*([^:]*):")
# Mehrzeilige Folgen: ihre Fälle sind Texte, keine Bedingungen.
FOLGENARTEN = {"stopping", "shuffle", "cycle", "once"}
FOLGENZEICHEN = "~&!$"
EINSTUFUNGEN = ("befund", "unsicher", "in Ordnung")


@dataclass(frozen=True)
class Bedingung:
    """Eine Bedingung auf einen Besuchszähler mit ihrer Einstufung."""

    datei: str
    zeile: int
    knoten: str
    name: str
    einstufung: str
    grund: str
    text: str

    def __str__(self) -> str:
        ort = f"{self.datei}:{self.zeile}"
        return f"{self.einstufung:10} {ort} ({self.knoten}): {self.name} – {self.grund}: {self.text}"


def startknoten(daten: Path = DATEN) -> dict[str, set[str]]:
    """Sammelt die Startknoten je Dialogdatei aus den Spieldaten.

    Eingabe: der Ordner inhalte/abenteuer. Ausgabe: Dateiname ohne Endung → Namen der Knoten.
    Beispiel: orte.json nennt für Mira ``desert-springs-garage.mira``; daraus wird
    ``{"desert-springs-garage": {"mira", …}}``. Sonderfall: Werte, die kein Verweis sind, fallen weg.
    """
    gefunden: dict[str, set[str]] = {}

    def gehe(wert: object, feld: str) -> None:
        if isinstance(wert, dict):
            for name, inhalt in wert.items():
                gehe(inhalt, name)
        elif isinstance(wert, list):
            for inhalt in wert:
                gehe(inhalt, feld)
        elif isinstance(wert, str) and feld in STARTFELDER and (t := VERWEIS.fullmatch(wert)):
            gefunden.setdefault(t.group(1), set()).add(t.group(2))

    for datei in sorted(daten.glob("*.json")):
        gehe(json.loads(datei.read_text(encoding="utf-8")), "")
    return gefunden


def ausdruecke(fluss: Fluss, index: int) -> list[str]:
    """Die Ausdrücke einer Zeile, in denen ein Besuchszähler stehen kann.

    Ausgabe: der Teil vor dem Doppelpunkt jeder ``{bedingung: …}``, der ganze Inhalt von
    ``{ausdruck}``, der Fall ``- bedingung:`` in einem Block und die Zeile nach ``~``.
    Beispiel: ``{atmeGesagt and not warum_atme: -> warum_atme ->}`` → ``atmeGesagt and not warum_atme``.
    Sonderfälle: Folgen (``{~a|b}``, ``{a|b}``) und ihre Fälle sind Text und fallen weg.
    """
    zeile = fluss.zeilen[index]
    text = ZEICHENKETTE.sub('""', zeile.text)
    gefunden = [_kopf(text[stelle + 1 :]) for stelle, zeichen in enumerate(text) if zeichen == "{"]
    if text.lstrip().startswith("~"):
        gefunden.append(text.lstrip()[1:])
    if zeile.kopf is not None and (fall := FALL.match(text)) and not _in_folge(fluss, zeile.kopf):
        gefunden.append(fall.group(1))
    return [ausdruck for ausdruck in gefunden if ausdruck.strip()]


def _kopf(rest: str) -> str:
    """Der Ausdruck am Anfang einer Klammer: bis zum Doppelpunkt, sonst bis zur schließenden Klammer."""
    if rest.lstrip()[:1] in FOLGENZEICHEN:
        return ""
    tiefe = 0
    for stelle, zeichen in enumerate(rest):
        if zeichen == "{":
            tiefe += 1
        elif zeichen == "}" and tiefe > 0:
            tiefe -= 1
        elif tiefe == 0 and zeichen in ":}":
            return rest[:stelle]
        elif tiefe == 0 and zeichen == "|":
            return ""
    return rest


def _in_folge(fluss: Fluss, kopf: int) -> bool:
    """Wahr, wenn der Block mit ``{stopping:``, ``{shuffle:`` … beginnt (mehrzeilige Folge)."""
    text = fluss.zeilen[kopf].text
    art = _kopf(text[text.rfind("{") + 1 :]).strip().split(" ")
    return bool(FOLGENARTEN & set(art))


def gezaehlte_namen(fluss: Fluss, index: int) -> list[tuple[str, int, bool]]:
    """Die Namen von Knoten, Stitches und Labels, deren Besuche die Zeile zählt.

    Ausgabe: je Fund (Name, Zeile des gezählten Kopfes, zugleich Variable?).
    Beispiel: ``{nadel > 0 and not warum_atme}`` → nur ``warum_atme``; ``nadel`` ist eine VAR.
    Sonderfälle: Funktionsaufrufe und Ink-Funktionen zählen nicht; ``TURNS_SINCE(-> x)`` und
    ``READ_COUNT(-> x)`` zählen ``x``.
    """
    zeile = fluss.zeilen[index]
    funde: list[tuple[str, int, bool]] = []
    for _, name in ZAEHLFUNKTION.findall(zeile.text):
        if (kopf := ziel(fluss, name, zeile)) is not None:
            funde.append((name, kopf, False))
    for ausdruck in ausdruecke(fluss, index):
        bereinigt = UMLEITUNGSWERT.sub(" ", ZAEHLFUNKTION.sub(" ", ausdruck))
        for name in NAME.findall(bereinigt):
            kopf = ziel(fluss, name, zeile)
            if kopf is None or fluss.zeilen[kopf].name in fluss.funktionen:
                continue
            variable = _ist_variable(fluss, name, zeile)
            if not variable or len(name.split(".")) == 1:
                funde.append((name, kopf, variable))
    return list(dict.fromkeys(funde))


def _ist_variable(fluss: Fluss, name: str, zeile: Zeile) -> bool:
    """Wahr, wenn der Name eine globale Variable, eine temp-Variable oder ein Parameter ist."""
    erster = name.split(".")[0]
    return erster in fluss.globale or erster in fluss.lokale.get(zeile.knoten, set())


def stufe_ein(fluss: Fluss, stelle: int, kopf: int, starts: list[int]) -> tuple[str, str]:
    """Stuft eine Bedingung ein: Kann der gezählte Kopf vor ihr liegen?

    Eingaben: der Fluss, die Zeile der Bedingung, die Zeile des gezählten Kopfes, die Zeilen der
    Startknoten. Ausgabe: (Einstufung, Grund), Einstufung aus ``EINSTUFUNGEN``.
    Beispiel: ``{mira_erinnerung_wahl: …}`` am Anfang von ``mira_erinnerung`` (Start ``mira``): Der
    Knoten ``mira_erinnerung_wahl`` folgt erst danach → („befund“, „immer 0 …“).
    Sonderfälle: siehe Dateikopf (immer 1, unsicher).
    """
    betroffen = [start for start in starts if stelle in erreichbar(fluss, start)]
    if not betroffen:
        return "unsicher", "von keinem Startknoten erreichbar"
    if fluss.zeilen[kopf].art == "wahl":
        return "unsicher", "Label an einer Wahl (zählt nur, wenn sie gewählt wird)"
    nach_kopf = {folge for erste in fluss.nachfolger[kopf] for folge in erreichbar(fluss, erste)}
    if stelle not in nach_kopf or not any(kopf in erreichbar(fluss, s) for s in betroffen):
        return "befund", "immer 0 (setzt früheren Dialog voraus)"
    immer_davor = all(stelle not in erreichbar(fluss, s, ohne=kopf) for s in betroffen)
    if immer_davor and kopf not in nach_kopf:
        return "befund", "immer 1 (zählt nur im selben Dialog, Bedingung ändert sich nie)"
    return "in Ordnung", "kann im selben Dialog davor liegen"


def pruefe_datei(name: str, quelle: str, starts: set[str]) -> list[Bedingung]:
    """Prüft eine Ink-Datei.

    Eingaben: Dateiname (für die Ausgabe), Text der Datei, Namen ihrer Startknoten.
    Ausgabe: alle Bedingungen auf Besuchszähler mit Einstufung, in der Reihenfolge der Datei.
    Beispiel: siehe ``stufe_ein``. Sonderfall: Versteht der Leser die Datei nicht ganz
    (``Fluss.luecken``), werden ihre Bedingungen höchstens „unsicher“, nie „in Ordnung“.
    """
    fluss = lies(quelle)
    startzeilen = [fluss.namen[(s,)] for s in sorted(starts) if (s,) in fluss.namen]
    ergebnis = []
    for index, zeile in enumerate(fluss.zeilen):
        for gezaehlt, kopf, variable in gezaehlte_namen(fluss, index):
            einstufung, grund = stufe_ein(fluss, index, kopf, startzeilen)
            if variable:
                einstufung, grund = "unsicher", "Name ist zugleich Variable und Knoten"
            elif fluss.luecken and einstufung == "in Ordnung":
                einstufung, grund = "unsicher", "; ".join(fluss.luecken)
            ergebnis.append(
                Bedingung(name, zeile.nummer, zeile.knoten, gezaehlt, einstufung, grund, zeile.text.strip())
            )
    return ergebnis


def pruefe_alles(dialoge: Path = DIALOGE, daten: Path = DATEN) -> list[Bedingung]:
    """Prüft alle Ink-Dateien des Ordners gegen die Startknoten aus den Spieldaten."""
    starts = startknoten(daten)
    ergebnis: list[Bedingung] = []
    for datei in sorted(dialoge.glob("*.ink")):
        quelle = datei.read_text(encoding="utf-8")
        ergebnis += pruefe_datei(datei.name, quelle, starts.get(datei.stem, set()))
    return ergebnis


def main(argumente: list[str] | None = None) -> int:
    """Gibt Befunde und Unsicheres aus (mit ``--alle`` jede Bedingung); 1 bei Befunden."""
    leser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    leser.add_argument("--alle", action="store_true", help="auch Bedingungen in Ordnung zeigen")
    alle = leser.parse_args(argumente).alle
    bedingungen = pruefe_alles()
    for bedingung in bedingungen:
        if alle or bedingung.einstufung != "in Ordnung":
            print(bedingung)
    zahl = {art: sum(1 for b in bedingungen if b.einstufung == art) for art in EINSTUFUNGEN}
    print(
        f"{len(bedingungen)} Bedingungen auf Besuchszähler: {zahl['in Ordnung']} in Ordnung, "
        f"{zahl['unsicher']} unsicher."
    )
    print(f"{zahl['befund']} Befunde")
    return 1 if zahl["befund"] else 0


if __name__ == "__main__":
    sys.exit(main())
