"""Durchgangsrichtung an Gebäudetüren: Der Durchgang eines Auslösers vor einem Gebäude führt ins Gebäude.

Warum: Im Spieltest 2 (17.11.2026) kam man in Maple Falls von außen nicht mehr ins Haus. Die
Maske der skalierten Villa ließ über dem Türfeld eine Kachel frei, links und rechts der Tür war
gesperrt; die App rechnete den Durchgang deshalb nach links und rechts, und der Held lief über die
Tür hinweg an die Wand. Ebenso lag der Eingang des Pavillons in Riverton so, dass man vom Pavillon
weg nach unten gehen musste. Die übrigen Prüfungen (durchgang.py) sahen das nicht, weil sie nur
Felder und Breiten prüfen, nicht die Richtung.

Regel wie die App (app/src/abenteuer/oberwelt/ausloeserebene.ts, ``mitDurchgang``): Die Richtungen
eines Übergangs stehen in der Eigenschaft ``durchgang`` (etwa „oben“ oder „links,rechts“). Fehlt
sie, gilt jede Richtung, in der das Nachbarfeld gesperrt ist (Wand, Möbel, Kartenrand); gibt es
keine, die Richtungen zu Nachbarfeldern desselben Auslösers; sonst jede Richtung.
Geprüft werden Übergänge von draußen in einen Innenraum, deren Feld an einem Gebäude liegt
(gesetztes Möbel mit Kollision, mindestens GEBAEUDE_MIN Kacheln breit und hoch, dessen Bild das
Feld berührt oder höchstens ABSTAND Kacheln geradeaus davon liegt, etwa hinter Stufen). Die
Richtung ins Gebäude zeigt zur Mitte seines Bildes, entlang der stärkeren Achse. Befund, wenn sie
nicht unter den Durchgangsrichtungen ist.
Aufruf: Teil von ``python -m pipeline.abenteuer.uebergaenge``.
"""

from pipeline.abenteuer.durchgang import alle_fassungen, gesperrte_felder
from pipeline.abenteuer.kartenbau import K, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel

#: Richtung → Schritt auf der Karte (wie KACHEL_VOR in der App).
RICHTUNGEN = {"oben": (0, -1), "unten": (0, 1), "links": (-1, 0), "rechts": (1, 0)}
#: Kleinste Größe eines Gebäudes in Kacheln (Breite und Höhe); kleinere Möbel sind keine Häuser.
GEBAEUDE_MIN = 3
#: So viele Kacheln weit darf das Gebäude in gerader Linie vom Auslöser entfernt sein (Stufen davor).
ABSTAND = 2
Feld = tuple[int, int]


def app_durchgang(feld: Feld, angabe: str | None, frei, gleiche: set[Feld]) -> list[str]:
    """Die Durchgangsrichtungen eines Auslöserfelds wie in der App.

    Beispiel: Haustür auf (3, 20), links und rechts gesperrt, oben frei, ohne Angabe →
    ["links", "rechts"]; mit Angabe „oben“ → ["oben"].
    """
    if angabe:
        return [r.strip() for r in angabe.split(",") if r.strip()]
    x, y = feld
    wand = [r for r, (dx, dy) in RICHTUNGEN.items() if not frei(x + dx, y + dy)]
    if wand:
        return wand
    hinein = [r for r, (dx, dy) in RICHTUNGEN.items() if (x + dx, y + dy) in gleiche]
    return hinein or list(RICHTUNGEN)


def ist_gebaeude(stueck: dict) -> bool:
    """Ein gesetztes Möbel mit Kollision, groß genug für ein Haus."""
    return bool(stueck["kollision"]) and min(stueck["breite"], stueck["hoehe"]) >= GEBAEUDE_MIN * K


def beruehrt(stueck: dict, feld: Feld) -> bool:
    """Liegt das Bild des Möbels auf dem Feld oder höchstens ABSTAND Kacheln geradeaus davon?

    Beispiel: Pavillon bis Reihe 52, Auslöser (41, 54) → ja (zwei Kacheln nach oben).
    """
    links, oben = stueck["x"] // K, stueck["y"] // K
    rechts = (stueck["x"] + stueck["breite"] - 1) // K
    unten = (stueck["y"] + stueck["hoehe"] - 1) // K
    x, y = feld
    schritte = [(0, 0)] + [(dx * n, dy * n) for dx, dy in RICHTUNGEN.values() for n in range(1, ABSTAND + 1)]
    return any(links <= x + dx <= rechts and oben <= y + dy <= unten for dx, dy in schritte)


def richtung_ins_gebaeude(stueck: dict, feld: Feld) -> str:
    """Die Richtung vom Feld zur Mitte des Gebäudebilds, entlang der stärkeren Achse.

    Beispiel: Villa auf (1, 9), 9 × 14 Kacheln, Tür (3, 20) → Mitte (5.5, 16) → „oben“.
    """
    mx = (stueck["x"] + stueck["breite"] / 2) / K
    my = (stueck["y"] + stueck["hoehe"] / 2) / K
    dx, dy = mx - (feld[0] + 0.5), my - (feld[1] + 0.5)
    if abs(dy) >= abs(dx):
        return "oben" if dy < 0 else "unten"
    return "links" if dx < 0 else "rechts"


def richtungsbefunde(szene: dict, name: str, moebel: dict) -> list[str]:
    """Befunde eines Auslösers: Felder vor einem Gebäude, deren Durchgang nicht hineinführt."""
    zeilen = raster(szene)
    gesetzt, _ = platziere(szene, moebel)
    gesperrt = gesperrte_felder(zeilen, gesetzt, szene)
    hoehe, breite = len(zeilen), len(zeilen[0])

    def frei(x: int, y: int) -> bool:
        return 0 <= x < breite and 0 <= y < hoehe and (x, y) not in gesperrt

    eintraege = [a for a in szene.get("ausloeser", []) if a["name"] == name]
    gleiche = {tuple(a["feld"]) for a in eintraege}
    befunde = []
    for a in eintraege:
        feld = tuple(a["feld"])
        haeuser = [s for s in gesetzt if ist_gebaeude(s) and beruehrt(s, feld)]
        if not haeuser:
            continue
        haus = min(haeuser, key=lambda s: s["breite"] * s["hoehe"])
        soll = richtung_ins_gebaeude(haus, feld)
        ist = app_durchgang(feld, a.get("eigenschaften", {}).get("durchgang"), frei, gleiche)
        if soll not in ist:
            befunde.append(
                f"Feld {list(feld)} vor {haus['name']}: Durchgang {'/'.join(ist)}, ins Gebäude geht es "
                f"nach {soll} (Eigenschaft „durchgang“: „{soll}“ setzen oder die Maske prüfen)"
            )
    return befunde


def pruefe_richtungen(alle: dict[str, dict], liste: list[dict]) -> list[str]:
    """Befunde aller Karten und Zustände für Übergänge von draußen in einen Innenraum.

    ``alle`` und ``liste`` wie in ``uebergaenge.pruefe``.
    """
    from pipeline.abenteuer.uebergaenge import regel_fuer

    moebel = lade_moebel()
    befunde = []
    for marke, szene in alle_fassungen(alle):
        if szene.get("art") == "innen":
            continue
        for name in sorted({a["name"] for a in szene.get("ausloeser", [])}):
            regel = regel_fuer(liste, szene["karte"], name)
            if not regel or regel.get("art") != "uebergang" or "ziel" not in regel:
                continue
            if alle.get(regel["ziel"]["karte"], {}).get("art") != "innen":
                continue
            befunde += [f"{marke} {name}: {b}" for b in richtungsbefunde(szene, name, moebel)]
    return befunde
