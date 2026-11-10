"""Fahrzeuge in der Richtung ihrer Fahrbahn (KARTENREGELN 10.65), als Hinweis im Kartenbau.

Warum: Der häufigste verbliebene Befund der Gutachten (10.11.2026) sind Fahrzeuge, deren Ansicht
nicht zur Straße passt: ein Bus von der Seite auf einer Straße von Nord nach Süd, ein Traktor von
vorn auf der Landstraße von West nach Ost. LimeZu zeichnet jedes Fahrzeug je Richtung eigens; die
Ansicht steht im Dateinamen (Left/Right = von der Seite, Up/Down = von hinten/vorn). Geprüft
wird nur, was eindeutig ist: Das Fahrzeug steht auf einer Fahrbahn, und die läuft an dieser Stelle
klar in eine Richtung; oder es steht über einer Buchtlinie, die quer zu ihm läuft (ein Auto von
der Seite in einer Bucht mit Linien von Nord nach Süd). Parkplätze ohne Linien, Höfe und
Kreuzungen bleiben ungeprüft (dort sind beide Ansichten möglich, siehe 10.65 „quer geparkt“).

Die Prüfung warnt nur: ``kartenbau`` druckt die Treffer als Hinweis und zählt sie nicht als Befund.
Aufruf für alle Karten: ``python -m pipeline.abenteuer.fahrzeuge`` (Treffer je Szene).
"""

import json
import re
import sys
from pathlib import Path

K = 16
SEITE, LAENGS = "seite", "laengs"
# Dateinamen → Ansicht. Seite: Fahrzeug fährt nach links oder rechts (Straße West–Ost);
# längs: von vorn oder hinten gezeichnet (Straße Nord–Süd).
ANSICHTEN = (
    (re.compile(r"Vehicles_16x16_(Car|Bus|Camper|Ambulance)_(Left|Right)_\d"), SEITE),
    (re.compile(r"Vehicles_16x16_(Car|Bus|Camper|Ambulance)_(Up|Down)_\d"), LAENGS),
    (re.compile(r"Tractor_(Left|Right)_Side"), SEITE),
    (re.compile(r"Tractor_(Front|Back)_Side"), LAENGS),
    (re.compile(r"spiel/eigene/(lkw_(links|rechts)|sattelzug)_"), SEITE),
    (re.compile(r"Vehicles_16x16_(Ice_Cream_Truck|Tacos_Truck)_\d"), SEITE),
)
# Beläge, auf denen gefahren wird (Markierungen zählen zur Fahrbahn).
FAHRBAHN = {"asphalt", "asphaltMitte", "asphaltMitteSenkrecht", "schotter", "pisteRot", "erde"}
# So viel länger muss die Fahrbahn in einer Richtung sein, damit sie als eindeutig gilt.
EINDEUTIG = 2
# Gemalte Linien (spiel/eigene/fahrbahn_linie_<n>.png senkrecht, …_quer_<n>.png waagerecht).
LINIE = re.compile(r"fahrbahn_linie_(quer_)?\d+\.png$")
RICHTUNG = {SEITE: "West–Ost", LAENGS: "Nord–Süd"}
WORT = {SEITE: "von der Seite", LAENGS: "von vorn oder hinten"}


def ansicht(quelle: str) -> str | None:
    """Ansicht eines Fahrzeugbilds („seite“ oder „laengs“) aus dem Dateinamen, sonst None.

    Beispiel: …Vehicles_16x16_Bus_Left_2.png → „seite“; …Car_Down_4.png → „laengs“; ein Boot
    oder eine Bank → None (kein Straßenfahrzeug).
    """
    for muster, art in ANSICHTEN:
        if muster.search(quelle):
            return art
    return None


def _lauf(zeilen: list[str], fahrbahn: set[str], x: int, y: int, dx: int, dy: int) -> int:
    """Länge der Fahrbahn durch (x, y) in Richtung ±(dx, dy), das Feld selbst mitgezählt."""
    laenge = 1
    for vz in (1, -1):
        nx, ny = x + vz * dx, y + vz * dy
        while 0 <= ny < len(zeilen) and 0 <= nx < len(zeilen[0]) and zeilen[ny][nx] in fahrbahn:
            laenge += 1
            nx, ny = nx + vz * dx, ny + vz * dy
    return laenge


def fahrbahnrichtung(zeilen: list[str], fahrbahn: set[str], x: int, y: int) -> str | None:
    """Richtung der Fahrbahn am Feld: „seite“ (West–Ost), „laengs“ (Nord–Süd) oder None.

    None, wenn das Feld keine Fahrbahn ist oder keine Richtung mindestens doppelt so lang ist wie
    die andere (Platz, Hof, Kreuzung). Beispiel: Feld auf einer drei Reihen breiten Straße über die
    ganze Kartenbreite → „seite“.
    """
    if not (0 <= y < len(zeilen) and 0 <= x < len(zeilen[0])) or zeilen[y][x] not in fahrbahn:
        return None
    quer, hoch = _lauf(zeilen, fahrbahn, x, y, 1, 0), _lauf(zeilen, fahrbahn, x, y, 0, 1)
    if quer >= EINDEUTIG * hoch:
        return SEITE
    if hoch >= EINDEUTIG * quer:
        return LAENGS
    return None


def linienrichtung(quelle: str) -> str | None:
    """Richtung einer gemalten Linie: „seite“ (waagerecht), „laengs“ (senkrecht), sonst None."""
    treffer = LINIE.search(quelle)
    if not treffer:
        return None
    return SEITE if treffer.group(1) else LAENGS


def _ueberlappt(a: dict, b: dict) -> bool:
    """Ob sich zwei gesetzte Möbel (Pixelrechtecke) in ihrer Fläche schneiden."""
    return (
        a["x"] < b["x"] + b["breite"]
        and b["x"] < a["x"] + a["breite"]
        and a["y"] < b["y"] + b["hoehe"]
        and b["y"] < a["y"] + a["hoehe"]
    )


def _kreuzt_linie(fahrzeug: dict, art: str, linien: list[tuple[dict, str]]) -> bool:
    """Ob das Fahrzeug über einer Linie steht, die quer zu seiner Ansicht läuft (nur der Fuß,
    die unteren zwei Kacheln: Das Dach eines Busses darf die Linie dahinter verdecken)."""
    fuss = {**fahrzeug, "y": fahrzeug["y"] + max(0, fahrzeug["hoehe"] - 2 * K)}
    fuss["hoehe"] = fahrzeug["y"] + fahrzeug["hoehe"] - fuss["y"]
    # Eine Kachel Rand links und rechts bleibt frei: Die Linie am Buchtrand berührt das Fahrzeug nur.
    kern = {**fuss, "x": fuss["x"] + K, "breite": max(K, fuss["breite"] - 2 * K)}
    return any(richtung != art and _ueberlappt(kern, linie) for linie, richtung in linien)


def fahrzeughinweise(szene: dict, zeilen: list[str], gesetzt: list[dict], moebel: dict) -> list[str]:
    """Hinweise nach 10.65: Fahrzeuge, deren Ansicht nicht zur Richtung ihrer Fahrbahn passt.

    Eingaben wie die übrigen Prüfungen des Kartenbaus (Szene, Raster, gesetzte Möbel in Pixeln,
    Möbelliste). Geprüft wird das Feld unter den Rädern in der Mitte des Fahrzeugs. Beispiel: „crBus (Bus von
    der Seite) steht bei (12, 30) auf einer Fahrbahn Nord–Süd“.
    """
    boeden = dict(szene.get("boeden", {}))
    fahrbahn = {z for z, art in boeden.items() if art in FAHRBAHN}
    if szene.get("boden") in FAHRBAHN:
        fahrbahn.add(".")
    linien = [
        (s, richtung)
        for s in gesetzt
        if (richtung := linienrichtung(moebel.get(s["name"], {}).get("quelle", ""))) is not None
    ]
    hinweise = []
    for s in gesetzt:
        art = ansicht(moebel.get(s["name"], {}).get("quelle", ""))
        if art is None:
            continue
        # Eine halbe Kachel über der Unterkante: Dort stehen die Räder; ein Feinschub von wenigen
        # Pixeln schiebt die Unterkante sonst in die Reihe unter der Fahrbahn (Raststätte).
        x, y = (s["x"] + s["breite"] // 2) // K, (s["y"] + s["hoehe"] - 1 - K // 2) // K
        bahn = fahrbahnrichtung(zeilen, fahrbahn, x, y)
        if bahn is not None and bahn != art:
            hinweise.append(
                f"{s['name']} ({WORT[art]} gezeichnet) steht bei ({x}, {y}) auf einer Fahrbahn "
                f"{RICHTUNG[bahn]}: Bild der anderen Ansicht nehmen (Regel 10.65)"
            )
        elif _kreuzt_linie(s, art, linien):
            hinweise.append(
                f"{s['name']} ({WORT[art]} gezeichnet) steht bei ({x}, {y}) über einer Buchtlinie, "
                f"die quer zu ihm läuft: Bucht längs anlegen oder Bild der anderen Ansicht (Regel 10.65)"
            )
    return hinweise


def main() -> int:
    """Alle Hauptszenen prüfen und die Treffer je Szene drucken (immer Rückgabe 0: nur Hinweise)."""
    from pipeline.abenteuer.kartenbau import INHALTE, platziere, raster
    from pipeline.abenteuer.moebelliste import lade_moebel

    moebel = lade_moebel()
    gesamt = 0
    for pfad in sorted(Path(INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        gesetzt, _ = platziere(szene, moebel)
        hinweise = fahrzeughinweise(szene, raster(szene), gesetzt, moebel)
        if hinweise:
            print(f"{pfad.stem}:")
            for h in hinweise:
                print(f"  - {h}")
        gesamt += len(hinweise)
    print(f"{gesamt} Hinweise nach Regel 10.65")
    return 0


if __name__ == "__main__":
    sys.exit(main())
