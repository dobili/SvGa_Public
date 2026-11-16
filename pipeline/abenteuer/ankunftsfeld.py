"""Prüfung der festen Ankunftsfelder an Übergängen (Auslöser-Eigenschaften ``ankunft`` und ``blick``).

Warum: Der Held kommt nach einem Übergang neben dem Zielauslöser an, auf dem freien Nachbarfeld mit
dem meisten Platz (app/src/abenteuer/oberwelt/ankunft.ts). Seit Karteneditor 1.4 (Wunsch des
Autors, 16.11.2026) kann eine Szene das Feld festlegen: ``{"name": "haustuer", "feld": [5, 12],
"eigenschaften": {"ankunft": "5,10", "blick": "oben"}}``. Das Spiel prüft das Feld nicht; deshalb
hier, für jede Fassung jeder Karte (``durchgang.alle_fassungen``):

1. ``ankunft`` ist ein Feld „x,y“ innerhalb der Karte.
2. Das Feld ist frei: keine Wand, kein Wasser, kein Möbel mit Kollision (mit Kollisionspinsel,
   ``durchgang.gesperrte_felder``), keine Figur und kein stehender Statist (``figurensperre``).
3. Es liegt auf keinem Auslöser (außer ``start``): Sonst stünde der Held gleich im nächsten.
4. ``blick`` ist oben, unten, links oder rechts (oder fehlt: dann schaut er vom Durchgang weg).
5. Alle Felder desselben Auslösers nennen dasselbe Ankunftsfeld (sonst gilt das erste, und das ist
   kaum gewollt).

Aufruf: Teil von ``python -m pipeline.abenteuer.uebergaenge`` und ``uebergangsbilder``
(``ankunftsbefunde``); Befunde beginnen mit dem Namen der Karte und des Auslösers.
"""

from pipeline.abenteuer.durchgang import alle_fassungen, gesperrte_felder
from pipeline.abenteuer.figurensperre import figurenfelder
from pipeline.abenteuer.kartenbau import platziere, raster

RICHTUNGEN = ("oben", "unten", "links", "rechts")
START = "start"  # Einstieg der Karte, löst nichts aus (ankunft.ts)

Feld = tuple[int, int]


def lies_feld(wert: object) -> Feld | None:
    """„x,y“ → (x, y), sonst None. Beispiel: „5, 10“ → (5, 10); „fünf“ → None."""
    if not isinstance(wert, str):
        return None
    teile = [t.strip() for t in wert.split(",")]
    if len(teile) != 2 or not all(t.lstrip("-").isdigit() for t in teile):
        return None
    return int(teile[0]), int(teile[1])


def _angaben(szene: dict) -> dict[str, list[dict]]:
    """Name → Eigenschaften der Felder mit ``ankunft`` oder ``blick``."""
    ergebnis: dict[str, list[dict]] = {}
    for a in szene.get("ausloeser", []):
        e = a.get("eigenschaften") or {}
        if "ankunft" in e or "blick" in e:
            ergebnis.setdefault(a["name"], []).append(e)
    return ergebnis


def pruefe_szene(szene: dict, moebel: dict) -> list[str]:
    """Befunde einer Szene als „NAME: Text“. Beispiel: „haustuer: Ankunftsfeld (5, 12) liegt auf
    dem Auslöser haustuer“."""
    angaben = _angaben(szene)
    if not angaben:
        return []
    zeilen = raster(szene)
    gesperrt = gesperrte_felder(zeilen, platziere(szene, moebel)[0], szene)
    figuren = figurenfelder(szene)
    belegt = {tuple(a["feld"]): a["name"] for a in szene.get("ausloeser", []) if a["name"] != START}
    hoehe, breite = len(zeilen), max(len(z) for z in zeilen)
    befunde = []
    for name, liste in sorted(angaben.items()):
        werte = {e.get("ankunft") for e in liste}
        if len(werte) > 1:
            befunde.append(f"{name}: Felder nennen verschiedene Ankunftsfelder {sorted(map(str, werte))}")
        for blick in {e["blick"] for e in liste if "blick" in e} - set(RICHTUNGEN):
            befunde.append(f"{name}: Blick „{blick}“ unbekannt (oben, unten, links, rechts)")
        wert = next((e["ankunft"] for e in liste if "ankunft" in e), None)
        if wert is None:
            continue
        feld = lies_feld(wert)
        if feld is None:
            befunde.append(f"{name}: Ankunft „{wert}“ ist kein Feld „x,y“")
            continue
        text = f"{name}: Ankunftsfeld {feld}"
        x, y = feld
        if not (0 <= x < breite and 0 <= y < hoehe):
            befunde.append(f"{text} liegt außerhalb der Karte")
        elif feld in gesperrt:
            befunde.append(f"{text} ist gesperrt")
        elif feld in figuren:
            befunde.append(f"{text} ist von {figuren[feld]} besetzt")
        elif feld in belegt:
            befunde.append(f"{text} liegt auf dem Auslöser {belegt[feld]}")
    return befunde


def ankunftsbefunde(alle: dict[str, dict], moebel: dict, ort: str | None = None) -> list[str]:
    """Befunde aller Fassungen aller Karten (``alle`` wie ``uebergaenge.szenen()``), optional nur
    eines Orts. Beispiel: „mapleFalls.wohnzimmer haustuer: Ankunftsfeld (5, 12) ist gesperrt“."""
    befunde = []
    for marke, szene in alle_fassungen(alle):
        if ort and szene["karte"].split(".")[0] != ort:
            continue
        befunde += [f"{marke} {b}" for b in pruefe_szene(szene, moebel)]
    return befunde
