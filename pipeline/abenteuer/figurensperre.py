"""Figuren und stehende Statisten versperren keinen Weg zwischen Start und Übergängen.

Warum: In der App sperren Figuren und Statisten, die an einem Fleck stehen, ihre Kachel
(app/src/abenteuer/oberwelt/begehbar.ts, ``sperrkacheln``). Steht eine Figur in einer Engstelle
oder auf einem Übergang, kommt der Held nicht weiter, obwohl Wände und Möbel den Weg freilassen.
Hinweis des Autors bei der Fehlersuche vor Pinewood Camp (13.11.2026): Diese Prüfung fehlte.

Regel: Jedes Übergangsfeld, das ohne Figuren vom Start aus erreichbar ist, bleibt es auch mit
Figuren und stehenden Statisten; keine Figur und kein stehender Statist steht auf einem Feld
eines Übergangs oder des Starts. Wandernde Statisten und Tiere zählen nicht (sie geben den Weg
wieder frei, wie in der App).

Seit dem 18.11.2026 dazu, weil Statisten den Helden im Spiel jetzt wirklich aufhalten (vorher lief
er geradeaus durch sie hindurch, app/src/abenteuer/oberwelt/belebungsbewegung.ts, ``sperreAn``):
1. Auch jeder andere Auslöser, jede Figur und jeder Statist mit Satz bleibt erreichbar (das Feld
   selbst oder ein Nachbarfeld, von dem aus man ansieht oder anspricht). Befunde vor der Korrektur:
   der Zuschauer im Londoner Kaffeehaus stand im einzigen Durchlass zur Theke und zur Rückkehr,
   die Kreidekinder im einzigen Durchlass des Spielplatzes von Maple Falls.
2. Sitzende auf einem Sitzmöbel sperren auch das Feld über sich (``sitzkacheln``): In der App rückt
   ihr Bild aufs Möbel, meist nach oben, und ihr Körper reicht bis zu einer Kachel hinauf. Wie weit,
   hängt vom Bild des Möbels und vom Bogen der Figur ab (privater Bestand); die Prüfung rechnet
   deshalb lieber ein Feld zu viel. Wer am Boden sitzt, sperrt nur sein Feld.
Aufruf: ``python -m pipeline.abenteuer.figurensperre`` (druckt die Befunde, Rückgabe 1 bei Befund).
"""

import json
import sys
from collections import deque

from pipeline.abenteuer.durchgang import gesperrte_felder
from pipeline.abenteuer.kartenbau import INHALTE, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.sitzplatz import K, ist_sitzmoebel

Feld = tuple[int, int]
NACHBARN = ((1, 0), (-1, 0), (0, 1), (0, -1))


def steht_fest(b: dict) -> bool:
    """Ein Statist ohne Strecke oder mit ``von`` gleich ``bis`` (wie ``stehtFest`` in der App)."""
    if b.get("typ") != "statist":
        return False
    e = b.get("eigenschaften", {})
    return e.get("von") == e.get("bis")


def figurenfelder(szene: dict) -> dict[Feld, str]:
    """Felder, die Figuren und stehende Statisten sperren, mit ihrem Namen."""
    felder = {tuple(f["feld"]): f["name"] for f in szene.get("figuren", [])}
    for b in szene.get("belebung", []):
        if steht_fest(b):
            felder[tuple(b["feld"])] = b["name"]
    return felder


def sitzkacheln(szene: dict, gesetzt: list[dict], moebel: dict) -> dict[Feld, str]:
    """Felder über Sitzenden auf einem Sitzmöbel, mit dem Namen der Sitzenden.

    Wie ``sitzkacheln`` in app/src/abenteuer/oberwelt/begehbar.ts. Eingaben: Szene, gesetzte Stücke
    (kartenbau.platziere) und Möbelkatalog. Beispiel: Sam sitzt im Clubraum auf (5, 8) auf dem
    Schulstuhl → {(5, 7): "sam"}; Lily auf dem Bordstein (kein Möbel) → nichts. Beginnt ein niedriges
    Möbel (bis zwei Kacheln) erst auf der Fußkachel und reicht darunter, rückt das Bild nach unten: nichts.
    """
    sitze = []
    for stueck in gesetzt:
        angabe = moebel.get(stueck["name"], {})
        if ist_sitzmoebel(stueck["name"], angabe.get("art")):
            sitze.append((stueck["x"], stueck["y"], angabe.get("breite", K), angabe.get("hoehe", K)))
    felder: dict[Feld, str] = {}
    sitzende = [f for f in szene.get("figuren", []) if f.get("sitzt")]
    sitzende += [b for b in szene.get("belebung", []) if b.get("eigenschaften", {}).get("sitzt")]
    for wer in sitzende:
        x, y = wer["feld"]
        mx, my = x * K + K / 2, y * K + K / 2
        sitz = next((r for r in sitze if r[0] <= mx < r[0] + r[2] and r[1] <= my < r[1] + r[3]), None)
        # Ein niedriges Möbel, das erst auf der Fußkachel beginnt und darunter weiterreicht: Das Bild
        # rückt nach unten, darüber bleibt frei (wie rueckeNachUnten in begehbar.ts).
        nach_unten = sitz and sitz[3] <= 2 * K and sitz[1] >= y * K and sitz[1] + sitz[3] > (y + 1) * K
        if sitz and not nach_unten:
            felder[(x, y - 1)] = wer["name"]
    return felder


def ansprechbare(szene: dict, uebergaenge: set[str]) -> dict[str, Feld]:
    """Was der Held ansehen oder ansprechen können muss: Auslöser, Figuren, Statisten mit Satz.

    Ohne Start und Übergänge (die prüft ``pruefe_szene`` strenger: das Feld selbst).
    """
    ziele = {a["name"]: tuple(a["feld"]) for a in szene.get("ausloeser", []) if a["name"] != "start"}
    ziele = {name: feld for name, feld in ziele.items() if name not in uebergaenge}
    ziele.update({f["name"]: tuple(f["feld"]) for f in szene.get("figuren", [])})
    for b in szene.get("belebung", []):
        if b.get("typ") == "statist" and b.get("eigenschaften", {}).get("sagt"):
            ziele[b["name"]] = tuple(b["feld"])
    return ziele


def nah(feld: Feld, felder: set[Feld]) -> bool:
    """Liegt ``feld`` in ``felder`` oder direkt daneben (ansehen, ansprechen)?"""
    return feld in felder or any((feld[0] + dx, feld[1] + dy) in felder for dx, dy in NACHBARN)


def erreichbar(start: set[Feld], gesperrt: set[Feld], breite: int, hoehe: int) -> set[Feld]:
    """Alle Felder, die von ``start`` aus über freie Nachbarfelder erreichbar sind."""
    gesehen = {f for f in start if f not in gesperrt}
    schlange = deque(gesehen)
    while schlange:
        x, y = schlange.popleft()
        for dx, dy in NACHBARN:
            n = (x + dx, y + dy)
            if 0 <= n[0] < breite and 0 <= n[1] < hoehe and n not in gesperrt and n not in gesehen:
                gesehen.add(n)
                schlange.append(n)
    return gesehen


def uebergangsnamen() -> dict[str, set[str]]:
    """Je Karte die Namen ihrer Übergänge aus orte.json (mit und ohne Kartenangabe)."""
    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    namen: dict[str, set[str]] = {}
    for o in orte:
        for k in o["karten"]:
            for a in o.get("ausloeser", []):
                if a.get("art") == "uebergang" and a.get("karte", k["kennung"]) == k["kennung"]:
                    namen.setdefault(k["kennung"], set()).add(a["name"])
    return namen


def pruefe_szene(szene: dict, moebel: dict, uebergaenge: set[str]) -> list[str]:
    """Befunde einer Szene: gesperrte Übergänge und Figuren auf Übergangs- oder Startfeldern."""
    zeilen = raster(szene)
    gesetzt, _ = platziere(szene, moebel)
    grund = gesperrte_felder(zeilen, gesetzt, szene)
    figuren = figurenfelder(szene)
    # Sitzende sperren auch das Feld über sich; auf einem Übergang stehen können sie dort nicht.
    sitze = sitzkacheln(szene, gesetzt, moebel)
    sperre = set(figuren) | set(sitze)
    hoehe, breite = len(zeilen), len(zeilen[0])
    ziele: dict[str, set[Feld]] = {}
    for a in szene.get("ausloeser", []):
        if a["name"] == "start" or a["name"] in uebergaenge:
            ziele.setdefault(a["name"], set()).add(tuple(a["feld"]))
    befunde = []
    for name, felder in sorted(ziele.items()):
        for f in sorted(felder & figuren.keys()):
            befunde.append(f"{szene['karte']}: {figuren[f]} steht auf {name} {f}")
    start = ziele.get("start") or next(iter(ziele.values()), set())
    ohne = erreichbar(start, grund, breite, hoehe)
    mit = erreichbar(start, grund | sperre, breite, hoehe)
    for name, felder in sorted(ziele.items()):
        if felder & ohne and not felder & mit:
            befunde.append(f"{szene['karte']}: Figuren versperren den Weg zu {name}")
    for name, feld in sorted(ansprechbare(szene, uebergaenge).items()):
        if not nah(feld, ohne) or nah(feld, mit):
            continue
        # Eine Sitzende spricht man auch von oben an: Der Held kommt so weit auf das Feld über
        # ihr, dass es als sein Feld zählt (im Browser geprüft: Dash auf der Bank in Silicon Bay).
        oben = (feld[0], feld[1] - 1)
        if sitze.get(oben) == name and nah(feld, erreichbar(start, (grund | sperre) - {oben}, breite, hoehe)):
            continue
        befunde.append(f"{szene['karte']}: Figuren versperren den Weg zu {name} {feld}")
    return befunde


def pruefe() -> list[str]:
    """Befunde aller Grundkarten und Zustände (ohne Archivvarianten)."""
    moebel = lade_moebel()
    namen = uebergangsnamen()
    befunde = []
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        befunde += pruefe_szene(szene, moebel, namen.get(szene.get("karte", ""), set()))
    return befunde


if __name__ == "__main__":
    gefunden = pruefe()
    print("\n".join(gefunden) or "Keine Figur versperrt einen Weg.")
    sys.exit(1 if gefunden else 0)
