"""Befehl: Laufen Statisten mitten auf einem schmalen Pfad? (Auftrag des Hauptchats, 24.11.2026)

Warum: Im Durchlauf von mittel-2 musste der eilige Spieler am Kanalweg (17, 87) dreimal umplanen.
Die Karte war dort nicht eng (Treidelpfad 4 Kacheln breit), aber der Statist „landvermesser“ lief
mitten auf dem Pfad hin und her, dem Spieler frontal entgegen. Statisten weichen nicht aus, sie
warten nur kurz und kehren um (oberwelt/belebungsbewegung.ts); auf einem schmalen Pfad steht man
dann vor ihnen.

Regel: Ein Statist mit Laufweg (``von`` ≠ ``bis``) läuft auf einem Pfad von höchstens ``SCHMAL``
Kacheln Breite (quer zur Laufrichtung gemessen, über begehbare, erreichbare Felder) am Rand, nicht
in der Mitte. Befund, wenn mindestens ``MINDEST`` Felder seiner Strecke mitten in einem solchen
Pfad liegen (links und rechts davon noch frei). ``--beheben`` verschiebt die ganze Strecke quer zur
Laufrichtung um die kleinste Spanne (höchstens ``VERSCHIEBUNG``), mit der sie überall frei bleibt
und nirgends mehr mitten auf einem schmalen Pfad liegt. Geht das nicht, bleibt es ein Befund, bis
die Stelle mit Grund in GEPRUEFT steht.
Geprüft werden alle Szenen, jede Fassung für sich (zuerst die Wege, seit 24.11.2026 auch die
Städte). Wo kein Rand frei war (Briefträgerin Riverton, Postbotin Lockport), ist die Strecke kürzer
und liegt an einer breiten, ruhigeren Stelle. Dauertest (pipeline/tests): „0 Befunde“.

Ablauf (im Hauptordner): python -m pipeline.abenteuer.laufbahn [--beheben] [--muster MUSTER]
"""

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path

from pipeline.abenteuer.durchgang import gesperrte_felder
from pipeline.abenteuer.figurensperre import erreichbar
from pipeline.abenteuer.kartenbau import INHALTE, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel

SCHMAL = 4  # höchstens so breit (in Kacheln) zählt ein Pfad als schmal
MINDEST = 3  # so viele Felder der Strecke mitten auf dem schmalen Pfad machen einen Befund
VERSCHIEBUNG = 3  # so weit darf --beheben die Strecke quer verschieben
# (Szene, Statist) → Grund.
GEPRUEFT: dict[tuple[str, str], str] = {
    ("weg-riverton-ironwood-1", "radfahrerin"): (
        "Fährt morgens den ganzen Treidelpfad (18,2 bis 18,90); nur x 17 und 18 sind durchgehend frei "
        "(x 16 bei 9 und 39 zu, auf x 19 alle zehn Felder ein Poller). Neben ihr bleiben drei Spuren; "
        "Entscheidung des Hauptchats, 24.11.2026."
    ),
    ("weg-riverton-ironwood-1-graffiti", "radfahrerin"): "wie weg-riverton-ironwood-1",
}

Feld = tuple[int, int]


@dataclass
class Befund:
    """Ein Statist, der mitten auf einem schmalen Pfad läuft."""

    szene: str
    name: str
    von: Feld
    bis: Feld
    mitten: list[Feld]
    verschiebung: Feld | None  # Vorschlag (dx, dy) oder None, wenn keine passt

    def text(self) -> str:
        vorschlag = f", Vorschlag: um {self.verschiebung} verschieben" if self.verschiebung else ""
        return (
            f"{self.szene}: {self.name} {self.von}–{self.bis} läuft auf {len(self.mitten)} Feldern mitten "
            f"auf einem Pfad von höchstens {SCHMAL} Kacheln (etwa {self.mitten[0]}){vorschlag}"
        )


def feld_aus(text: str) -> Feld:
    """„17,75“ → (17, 75)."""
    x, y = (int(t) for t in str(text).split(","))
    return x, y


def strecke(von: Feld, bis: Feld) -> list[Feld]:
    """Die Felder zwischen von und bis auf gerader Linie (beide Enden eingeschlossen)."""
    schritte = max(abs(bis[0] - von[0]), abs(bis[1] - von[1]), 1)
    return sorted(
        {
            (
                round(von[0] + (bis[0] - von[0]) * i / schritte),
                round(von[1] + (bis[1] - von[1]) * i / schritte),
            )
            for i in range(schritte + 1)
        }
    )


def freie_felder(szene: dict, moebel: dict) -> set[Feld]:
    """Begehbare, vom Start erreichbare Felder (wie tagesablauf.Karten.info)."""
    zeilen = raster(szene)
    gesetzt = platziere(szene, moebel)[0]
    grund = gesperrte_felder(zeilen, gesetzt, szene)
    start = {tuple(a["feld"]) for a in szene.get("ausloeser", []) if a["name"] == "start"}
    start = start or {tuple(a["feld"]) for a in szene.get("ausloeser", [])[:1]}
    return erreichbar(start, grund, len(zeilen[0]), len(zeilen))


def quer(von: Feld, bis: Feld) -> Feld:
    """Richtung quer zur Laufrichtung: senkrechter Weg → (1, 0), waagerechter → (0, 1)."""
    return (1, 0) if abs(bis[1] - von[1]) >= abs(bis[0] - von[0]) else (0, 1)


def mitten_auf_schmalem_pfad(feld: Feld, q: Feld, frei: set[Feld]) -> bool:
    """Liegt das Feld in einem freien Streifen von höchstens SCHMAL Kacheln (quer gemessen), und ist
    links und rechts davon (quer) noch frei?"""
    links = rechts = 0
    while (feld[0] - (links + 1) * q[0], feld[1] - (links + 1) * q[1]) in frei and links <= SCHMAL:
        links += 1
    while (feld[0] + (rechts + 1) * q[0], feld[1] + (rechts + 1) * q[1]) in frei and rechts <= SCHMAL:
        rechts += 1
    return links + rechts + 1 <= SCHMAL and links > 0 and rechts > 0


def mitten(felder: list[Feld], q: Feld, frei: set[Feld]) -> list[Feld]:
    """Die Felder einer Strecke, die mitten auf einem schmalen Pfad liegen."""
    return [f for f in felder if f in frei and mitten_auf_schmalem_pfad(f, q, frei)]


def verschiebung(von: Feld, bis: Feld, frei: set[Feld]) -> Feld | None:
    """Kleinste Verschiebung quer zur Laufrichtung, mit der die Strecke frei und am Rand liegt."""
    q = quer(von, bis)
    for weite in range(1, VERSCHIEBUNG + 1):
        for vorzeichen in (-1, 1):
            d = (q[0] * weite * vorzeichen, q[1] * weite * vorzeichen)
            neu = strecke((von[0] + d[0], von[1] + d[1]), (bis[0] + d[0], bis[1] + d[1]))
            if all(f in frei for f in neu) and len(mitten(neu, q, frei)) < MINDEST:
                return d
    return None


def pruefe_szene(name: str, szene: dict, moebel: dict) -> list[Befund]:
    """Befunde einer Szene."""
    laeufer = [
        b
        for b in szene.get("belebung", [])
        if b.get("typ") == "statist" and (e := b.get("eigenschaften", {})).get("von") and e.get("bis")
    ]
    laeufer = [b for b in laeufer if b["eigenschaften"]["von"] != b["eigenschaften"]["bis"]]
    if not laeufer:
        return []
    frei, befunde = freie_felder(szene, moebel), []
    for b in laeufer:
        von, bis = feld_aus(b["eigenschaften"]["von"]), feld_aus(b["eigenschaften"]["bis"])
        auf = mitten(strecke(von, bis), quer(von, bis), frei)
        if len(auf) >= MINDEST and (name, b["name"]) not in GEPRUEFT:
            befunde.append(Befund(name, b["name"], von, bis, auf, verschiebung(von, bis, frei)))
    return befunde


def szenen(muster: str) -> list[Path]:
    """Die Szenen nach Muster (auch Fassungen wie -graffiti)."""
    return sorted((INHALTE / "szenen").glob(muster))


def alle_befunde(muster: str = "*.json") -> list[Befund]:
    """Befunde aller passenden Szenen."""
    moebel = lade_moebel()
    return [b for p in szenen(muster) for b in pruefe_szene(p.stem, json.loads(p.read_text("utf-8")), moebel)]


def verschiebe_im_text(text: str, name: str, d: Feld) -> str:
    """Verschiebt von, bis und feld eines Statisten im Dateitext; der Rest der Datei bleibt Zeichen für
    Zeichen gleich (Szenen sind verschieden formatiert, ein Neuschreiben änderte am Deich 1149 Zeilen).
    """
    anfang = text.index(f'"name": "{name}"')
    ende = text.find('"name": "', anfang + 1)
    ende = len(text) if ende < 0 else ende
    teil = text[anfang:ende]

    def punkt(m: re.Match) -> str:
        return f'"{m.group(1)}": "{int(m.group(2)) + d[0]},{int(m.group(3)) + d[1]}"'

    def feld(m: re.Match) -> str:
        return f"{m.group(1)}{int(m.group(2)) + d[0]}{m.group(3)}{int(m.group(4)) + d[1]}{m.group(5)}"

    teil = re.sub(r'"(von|bis)": "(-?\d+),(-?\d+)"', punkt, teil)
    teil = re.sub(r'("feld": \[\s*)(-?\d+)(,\s*)(-?\d+)(\s*\])', feld, teil, count=1)
    return text[:anfang] + teil + text[ende:]


def behebe(befunde: list[Befund]) -> list[str]:
    """Verschiebt jede behebbare Strecke (von, bis, feld). Ausgabe: geänderte Szenen."""
    geaendert = []
    for datei in sorted({b.szene for b in befunde if b.verschiebung}):
        pfad = INHALTE / "szenen" / f"{datei}.json"
        text = pfad.read_text(encoding="utf-8")
        for b in (b for b in befunde if b.szene == datei and b.verschiebung):
            text = verschiebe_im_text(text, b.name, b.verschiebung)
        json.loads(text)  # bleibt gültig
        pfad.write_text(text, encoding="utf-8")
        geaendert.append(datei)
    return geaendert


def main() -> None:
    """Prüft (und behebt); Aufruf im Dateikopf."""
    teiler = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teiler.add_argument("--beheben", action="store_true")
    teiler.add_argument("--muster", default="*.json")
    a = teiler.parse_args()
    befunde = alle_befunde(a.muster)
    for b in befunde:
        print(f"  {b.text()}")
    if a.beheben and befunde:
        print("behoben in:", ", ".join(behebe(befunde)) or "keiner Szene")
    print(f"{len(befunde)} Befunde")


if __name__ == "__main__":
    main()
