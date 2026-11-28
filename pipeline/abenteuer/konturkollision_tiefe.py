"""Z-Prüfung der Karten: Bilder, die über dem Helden liegen, obwohl er darauf steht, und Bilder, die
unter ihm liegen, obwohl er dahinter steht (KARTENREGELN 10.95, Phase 2C).

Warum (Auftrag des Autors, 28.11.2026): „Z-Ebenen prüfen, z. B. lag eine Treppe über dem Helden.“
Die Saloontreppe in Ghost Town (gt27SaloonTreppe) sperrt mit Handlauf und Wange, ihre Tiefe war
deshalb die Bildunterkante; wer auf dem Lauf stand, stand im Bild über dieser Linie und wurde von der
Treppe zugedeckt. Die Prüfung sucht solche Stellen über alle Szenen, ohne Bilder (läuft in Actions).

Gerechnet wird wie die App (oberwelt/zeichentiefe.ts, heldtiefe.ts) auf Zellen von 4 Pixeln:

- **Stellen des Helden:** jede Ecke eines Körpers von 3 Zellen (12 px), die vom Start aus erreichbar
  ist (``durchlass.gesperrte_zellen``, ``engstelle.stellplaetze``); der Fußpunkt ist die Mitte des
  Körpers wie in heldtiefe.ts.
- **Tiefe des Bildes:** die Tiefe der Karte (an der Wand 0, flach 1, Ebene des Editors), sonst wie
  ``zeichentiefe``: Bodenebene 1, Sortierlinie des Katalogs, Regel der Maske, Bildunterkante.
- **Darauf, aber darüber** (Befund): Der Fußpunkt liegt im deckenden Rahmen (deckrahmen.json) eines
  Bildes, das man betritt (Treppe, Steg, Brücke, Matte, Teppich, Bühne, Rampe), dessen Tiefe größer
  ist als der Fuß, und die App hebt den Helden nicht darüber (``steht_dahinter`` wie heldtiefe.ts:
  eine Sperrzelle des Bildes reicht in seinen Spalten tiefer als sein Körper).
- **Dahinter, aber darunter** (Befund): Ein aufrechtes Bild (kein Boden, keine Markierung) liegt mit
  Tiefe 0 oder 1 (an der Wand, flach, Bodenebene) unter dem Helden, und sein deckender Rahmen reicht
  in seinen Spalten mehr als eine Körperhöhe unter seinen Fuß: Er steht hinter dem Bild und wird
  darüber gezeichnet. Ausnahmen mit Grund in ``GEPRUEFT`` (Glasbrücke, Deck der Fähre, Spielfeld).

Aufruf: ``python -m pipeline.abenteuer.konturkollision_tiefe [--ort KENNUNG] [SZENE …]``
druckt je Szene und Bild die Zahl der Stellen (Rückgabe 1 bei Befund). Dauertest „0 Befunde“ in
pipeline/tests/test_abenteuer_konturkollision.py.
"""

import argparse
import json
import re
import sys
from collections import deque
from dataclasses import dataclass

from pipeline.abenteuer.deckrahmen import lade as lade_rahmen
from pipeline.abenteuer.deckrahmen import rahmen_von
from pipeline.abenteuer.durchlass import gesperrte_zellen, startkacheln
from pipeline.abenteuer.engstelle import HELD, NACHBARN, mittenkachel, stellplaetze
from pipeline.abenteuer.kartenbau import INHALTE, platziere
from pipeline.abenteuer.kollisionfein import ZP, K, Z, stueckzellen
from pipeline.abenteuer.moebelliste import lade_moebel

Zelle = tuple[int, int]
# Halbe Körperhöhe des Helden (heldtiefe.ts KOERPER_HALB): der Fußpunkt ist die Mitte des Körpers.
KOERPER_HALB = 6
MITTE = HELD * ZP // 2
# Arten und Namensteile, die man betritt (Bodenebene richtig, Tiefe über dem Fuß falsch).
BETRETBAR_ARTEN = {"treppe", "steg", "bruecke", "boden", "teppich", "fussmatte", "matte", "buehne"}
BETRETBAR_NAMEN = ("treppe", "stufen", "steg", "bruecke", "rampe", "podest")
# Diese Namen gehören zu keinem Boden (Geländer an der Treppe, Poller am Steg, Treppenhaus).
KEIN_BODEN = ("loch", "gelaender", "schacht", "haus", "turm", "poller", "laterne", "lampe", "pfahl", "kiste")
# Aufrechte Arten: liegen sie unter dem Helden, der dahinter steht, ist die Reihenfolge falsch.
# Nicht dabei: Deko ohne Art (Pfützen, Spuren, nasse Dielen), Boden, Markierung, Wandbilder.
AUFRECHTE_ARTEN = {
    "haus",
    "gebaeude",
    "kiosk",
    "turm",
    "zaun",
    "baum",
    "laterne",
    "lampe",
    "stehlampe",
    "mast",
    "schrank",
    "regal",
    "buecherregal",
    "vitrine",
    "tisch",
    "stuhl",
    "bank",
    "sessel",
    "sofa",
    "kiste",
    "fahrzeug",
    "schild",
    "saeule",
    "stuetze",
    "fahne",
    "automat",
    "geraet",
    "kamin",
    "garderobe",
    "sport",
    "denkmal",
    "brunnen",
    "fels",
    "stand",
    "theke",
    "tresen",
    "trennwand",
    "spind",
    "kuehlschrank",
    "herd",
    "ofen",
    "boot",
    "tor",
    "windrad",
    "zelt",
    "strassenmoebel",
}
# Bilder, deren Lage geprüft ist (Name → Grund), für den Befund „dahinter, aber darunter“.
# Schlüssel: Name des Bildes oder „Szene:Name“ für eine einzelne Szene.
GLASBRUECKE = "liegt unter der Glasbrücke, der Held geht auf dem Glas darüber (begehbar_grund im Katalog)"
GEPRUEFT: dict[str, str] = {
    "fz9Bug": "Bug der Fähre: das Deck, auf dem der Held steht, liegt richtig unter ihm",
    "mf6Basketballplatz": "Spielfeld am Boden (Art sport): man läuft darüber",
    **{
        f"weg-ironwood-silicon-glasbruecke:{n}": GLASBRUECKE
        for n in (
            "wsgPlanke8",
            "wsgAutoAb1",
            "wsgAutoAb10",
            "wsgAutoAb14",
            "wsgAutoAb17",
            "wsgAutoAb21",
            "wsgAutoAuf2",
            "wsgAutoAuf11",
            "wsgAutoAuf15",
            "wsgAutoAuf19",
            "wsgAutoAuf22",
        )
    },
}


@dataclass(frozen=True)
class Zbefund:
    """Ein Bild in einer Szene mit Stellen, an denen die Zeichenreihenfolge falsch ist."""

    szene: str
    name: str
    art: str  # „darauf“ (liegt über dem Helden) oder „dahinter“ (liegt unter ihm)
    stellen: int
    beispiel: tuple[int, int]

    def text(self) -> str:
        """Eine Zeile für den Bericht."""
        was = (
            "liegt über dem Helden, der darauf steht"
            if self.art == "darauf"
            else ("liegt unter dem Helden, der dahinter steht")
        )
        return f"{self.szene}: {self.name} {was} ({self.stellen} Stellen, etwa bei {self.beispiel})"


def betretbar(name: str, angabe: dict) -> bool:
    """Ob man das Bild betritt. Beispiel: gt27SaloonTreppe (Art treppe) → True; Treppengeländer → False."""
    klein = name.lower()
    if any(t in klein for t in KEIN_BODEN) or angabe.get("art") in {"gebaeude", "haus", "kiosk"}:
        return False
    return angabe.get("art") in BETRETBAR_ARTEN or any(t in klein for t in BETRETBAR_NAMEN)


def maskenregel(stueck: dict) -> float:
    """Tiefe nach der Maske wie ``zeichentiefe`` ohne Sortierlinie (Mitte der letzten ganz
    gesperrten Kachelreihe, sonst der letzten mit Sperre, sonst Bildunterkante minus halbe Kachel)."""
    unten = stueck["y"] + stueck["hoehe"] - K / 2
    maske = stueck.get("maske")
    if not maske:
        return unten
    volle = [r for r, z in enumerate(maske) if z and "." not in z]
    teils = [r for r, z in enumerate(maske) if "#" in z]
    reihe = (volle or teils or [None])[-1]
    return unten if reihe is None else min(unten, stueck["y"] + (reihe + 1) * K - K / 2)


def app_tiefe(stueck: dict, katalog: dict) -> float:
    """Zeichentiefe des Bildes wie ``moebeltiefe`` in der App.

    Die Tiefe der Karte zählt, außer sie ist die Vorgabe des Kartenbaus (Bildunterkante minus halbe
    Kachel); dann Bodenebene (1), Sortierlinie des Katalogs (ungedreht, mit Zuschnitt und Maßstab),
    Regel der Maske. Beispiel: Laterne auf y 400, sortierlinie 64 → 464.
    """
    vorgabe = stueck["y"] + stueck["hoehe"] - K // 2
    if stueck["tiefe"] != vorgabe:
        return stueck["tiefe"]
    if katalog.get("ebene") == "boden":
        return 1
    linie = katalog.get("sortierlinie")
    if isinstance(linie, (int, float)) and stueck.get("drehung", 0) % 360 == 0:
        oben = (stueck.get("zuschnitt") or [0, 0, 0, 0])[1]
        return stueck["y"] + max(0, linie - oben) * float(stueck.get("massstab", 1))
    return maskenregel(stueck)


def unterkanten(zellen: set[Zelle]) -> tuple[dict[int, int], int]:
    """Je Zellspalte die Unterkante der untersten Sperrzelle (Pixel) und die oberste Oberkante."""
    unten: dict[int, int] = {}
    for x, y in zellen:
        unten[x] = max(unten.get(x, 0), (y + 1) * ZP)
    return unten, min((y for _, y in zellen), default=0) * ZP


def steht_dahinter(zellen: set[Zelle], x: float, y: float) -> bool:
    """Wie ``stehtDahinter`` in heldtiefe.ts: Körper ganz nördlich der Sperre oder eine Sperrzelle
    reicht in seinen Spalten tiefer als die Unterkante seines Körpers. Ohne Sperre: dahinter."""
    if not zellen:
        return True
    unten, oberkante = unterkanten(zellen)
    fuss = y + KOERPER_HALB
    if fuss <= oberkante:
        return True
    spalte = int((x - KOERPER_HALB) // ZP)
    while spalte * ZP < x + KOERPER_HALB:
        if unten.get(spalte, -1) > fuss:
            return True
        spalte += 1
    return False


def erreichbare_stellen(szene: dict, moebel: dict) -> list[tuple[int, int]]:
    """Fußpunkte (Pixel) aller vom Start erreichbaren Stellen des Helden; ohne Start alle freien."""
    gesperrt, (kb, kh) = gesperrte_zellen(szene, moebel)
    breite, hoehe = kb * Z, kh * Z
    frei = stellplaetze(gesperrt, breite, hoehe, HELD)
    start = startkacheln(szene)
    offen = deque(
        (x, y)
        for y in range(hoehe)
        for x in range(breite)
        if frei[y * breite + x] and (not start or mittenkachel(x, y, HELD) in start)
    )
    gesehen = set(offen)
    while offen:
        cx, cy = offen.popleft()
        for dx, dy in NACHBARN:
            n = (cx + dx, cy + dy)
            if 0 <= n[0] < breite and 0 <= n[1] < hoehe and frei[n[1] * breite + n[0]] and n not in gesehen:
                gesehen.add(n)
                offen.append(n)
    return [(x * ZP + MITTE, y * ZP + MITTE) for x, y in gesehen]


def _rahmen_in_welt(stueck: dict, angabe: dict, rahmen: dict) -> tuple[float, float, float, float]:
    """Deckender Rahmen des Bildes in Kartenpixeln (Maßstab und Zuschnitt grob, gedreht ganz)."""
    if stueck.get("drehung", 0) % 360 or stueck.get("zuschnitt"):
        return stueck["x"], stueck["y"], stueck["x"] + stueck["breite"], stueck["y"] + stueck["hoehe"]
    m = float(stueck.get("massstab", 1))
    x0, y0, x1, y1 = rahmen_von(stueck["name"], angabe, rahmen)
    return stueck["x"] + x0 * m, stueck["y"] + y0 * m, stueck["x"] + x1 * m, stueck["y"] + y1 * m


def pruefe_stueck(
    stueck: dict, angabe: dict, stellen: list, rahmen: dict, vorn: bool = False, geprueft: bool = False
) -> tuple[str, list] | None:
    """(Art, Stellen) des Befunds für ein gesetztes Bild oder None. Mit ``vorn`` (Szene: Überführung,
    Eisenbahnbrücke über dem Pfad) liegt ein Bild, das man sonst betritt, gewollt über dem Helden."""
    tiefe = app_tiefe(stueck, angabe)
    x0, y0, x1, y1 = _rahmen_in_welt(stueck, angabe, rahmen)
    innen = [(x, y) for x, y in stellen if x0 <= x < x1 and y0 <= y < y1]
    if not innen:
        return None
    if betretbar(stueck["name"], angabe) and not vorn:
        zellen = stueckzellen(stueck)
        falsch = [(x, y) for x, y in innen if tiefe > y and steht_dahinter(zellen, x, y)]
        return ("darauf", falsch) if falsch else None
    if tiefe > 1 or angabe.get("art") not in AUFRECHTE_ARTEN or geprueft:
        return None
    falsch = [(x, y) for x, y in innen if y1 > y + KOERPER_HALB + K // 2 and y > y0 + KOERPER_HALB]
    return ("dahinter", falsch) if falsch else None


def pruefe_szene(name: str, szene: dict, moebel: dict, rahmen: dict) -> list[Zbefund]:
    """Alle Befunde einer Szene (je Bild einer)."""
    gesetzt, _ = platziere(szene, moebel)
    stellen = erreichbare_stellen(szene, moebel)
    vorn = {e.get("id", f"{e['moebel']}@{n}") for n, e in enumerate(szene["objekte"]) if e.get("vorn")}
    befunde = []
    for stueck in gesetzt:
        angabe = moebel.get(stueck["name"], {})
        if "auf" in stueck or not angabe:
            continue
        geprueft = stueck["name"] in GEPRUEFT or f"{name}:{stueck['name']}" in GEPRUEFT
        treffer = pruefe_stueck(stueck, angabe, stellen, rahmen, stueck["id"] in vorn, geprueft)
        if treffer:
            art, falsch = treffer
            x, y = min(falsch, key=lambda p: (p[1], p[0]))
            befunde.append(Zbefund(name, stueck["name"], art, len(falsch), (int(x // K), int(y // K))))
    return befunde


def szenen(orte: list[str], namen: list[str]) -> list:
    """Die Szenendateien: genannte, sonst die der Orte (Kennung wie „ghostTown“), sonst alle."""
    alle = sorted((INHALTE / "szenen").glob("*.json"))
    if namen:
        return [p for p in alle if p.stem in namen]
    if orte:
        muster = [re.sub(r"([A-Z])", r"-\1", o).lower() + "-" for o in orte]
        return [p for p in alle if any(p.stem.startswith(m) for m in muster)]
    return alle


def pruefe(orte: list[str] | None = None, namen: list[str] | None = None) -> list[Zbefund]:
    """Befunde aller (oder der gewählten) Szenen."""
    moebel, rahmen = lade_moebel(), lade_rahmen()
    befunde: list[Zbefund] = []
    for pfad in szenen(orte or [], namen or []):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        if "objekte" in szene and "raster" in szene:
            befunde += pruefe_szene(pfad.stem, szene, moebel, rahmen)
    return befunde


def main(argv: list[str] | None = None) -> int:
    """Befehlszeile; Aufruf und Zweck im Dateikopf."""
    teil = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    teil.add_argument("--ort", action="append", default=[], help="nur Szenen dieser Orte (Kennung)")
    teil.add_argument("szenen", nargs="*", help="Szenen (Dateiname ohne Endung)")
    args = teil.parse_args(argv)
    befunde = pruefe(args.ort, args.szenen)
    for b in befunde:
        print(b.text())
    print(f"{len(befunde)} Befunde")
    return 1 if befunde else 0


if __name__ == "__main__":
    sys.exit(main())
