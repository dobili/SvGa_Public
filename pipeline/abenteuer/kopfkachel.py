"""Kacheln über den Figuren, die seit dem 18.11.2026 begehbar sind, und was dadurch erreichbar wird.

Warum: Bis zum Stand 379537eb sperrte eine Figur mit hohem Bild (LimeZu, 16 × 32) in der App auch
die Kachel über ihren Füßen, weil ``refreshBody()`` den festen Körper aufs ganze Bild legte. Seit
``legeFestkoerperAufKachel`` (app/src/abenteuer/oberwelt/figurbilder.ts) sperrt sie nur noch ihre
Fußkachel, so wie figurensperre.py und die Gesamtsimulation schon immer rechneten. Die Frage des
Autors: Kommt der Held dadurch irgendwohin, wo er vorher nicht hinkam und nicht hin soll (hinter
einen Tresen, an einer Figur vorbei durch eine Engstelle)?

Regel: Für jede Figur der Szene (stehend oder sitzend) ist die Kachel über ihr die „Kopfkachel“.
Vorher galten Fuß- und Kopfkachel als gesperrt, nachher nur die Fußkachel. Gemeldet wird
1. jede Kopfkachel, die nicht ohnehin durch Karte, Möbel oder eine andere Figur gesperrt ist
   (``neu``), und ob der Held sie von Start und Übergängen aus erreicht,
2. jede Kachel, die nachher erreichbar ist und vorher nicht, ohne die Kopfkacheln selbst
   (``bereich``: ein neuer Raum hinter der Figur),
3. jede neue Kopfkachel, über die ein Weg führt, der vorher mindestens ``UMWEG_AB`` Schritte lang
   war oder gar nicht ging (``abkuerzung``: an der Figur vorbei).
Stehende und wandernde Statisten zählen nicht als Auslöser: Sie sperrten in der App schon immer
genau eine Kachel (belebungsschicht.ts, eigene Sperrfläche); als Hindernis zählen die stehenden mit.
Sitzende: Ihr Bild rückt in der App aufs Sitzmöbel, meist nach oben in die Kopfkachel. Dort sperren
sie seit dem 18.11.2026 Fußkachel und Sitzpunkt (app/src/abenteuer/oberwelt/sitzplatz.ts,
``sitzsperre``), sonst stünde der Held in ihnen; ihre Kopfkachel ist in der App also meist weiter
zu. Die Prüfung führt sie trotzdem (als ``sitzt``), weil die Verschiebung vom Bild des Möbels
abhängt; nur wer am Boden sitzt (Lily auf dem Bordstein), gibt die Kachel wirklich frei.
Grenze: Welche Figur ein hohes Bild trägt, steht im privaten Bestand; die Prüfung nimmt es für alle
an und meldet damit eher zu viel. PixelLab-Bögen (32 × 32 bei 2/3) ragten nur vier Pixel in die
Kopfkachel.

Bewertung: Ein neuer Bereich ist ein Befund (Rückgabe 1, Dauertest): Dort sperrt die Szene die
Kacheln mit ``sperren`` (kollisionspinsel.py), wie am 18.11.2026 hinter Coach Delgados Lehrertisch,
neben Mr. Boatengs Automat, an Dr. Ngatas Schreibtisch, neben Miss Odiles Spendenkasse und am
Zeitungshalter im Londoner Kaffeehaus. Abkürzungen sind Hinweise: Der Held kam vorher auch hin, nur
außen herum; sie zählen erst, wenn eine Figur einen Weg bewusst versperren soll.

Aufruf: ``python -m pipeline.abenteuer.kopfkachel`` (druckt neue Bereiche und Abkürzungen; Rückgabe
1 bei einem neuen Bereich). ``--alle`` druckt jede neu begehbare Kopfkachel.
"""

import json
import sys
from collections import deque
from dataclasses import dataclass, field

from pipeline.abenteuer.durchgang import gesperrte_felder
from pipeline.abenteuer.figurensperre import (
    NACHBARN,
    erreichbar,
    figurenfelder,
    uebergangsnamen,
)
from pipeline.abenteuer.kartenbau import INHALTE, platziere, raster
from pipeline.abenteuer.moebelliste import lade_moebel

Feld = tuple[int, int]

# Ab so vielen Schritten gilt der alte Weg um die Figur herum als Umweg, den die Kopfkachel abkürzt.
# Der kürzeste Weg um eine frei stehende Figur (von links über ihr nach rechts über ihr, außen
# herum) hat sechs Schritte; alles darüber führte um ein Hindernis.
UMWEG_AB = 7


@dataclass(frozen=True)
class Kopfkachel:
    """Eine neu begehbare Kachel über einer Figur."""

    figur: str
    feld: Feld
    sitzt: bool
    erreichbar: bool
    # Länge des alten Wegs zwischen zwei Nachbarn der Kachel (None: ging vorher nicht), sonst 0.
    umweg: int | None = 0


@dataclass
class Szenenbefund:
    """Was sich in einer Szene geändert hat (``szene``: Dateiname ohne Endung, auch Zustände)."""

    szene: str
    neu: list[Kopfkachel] = field(default_factory=list)
    bereich: set[Feld] = field(default_factory=set)

    @property
    def abkuerzungen(self) -> list[Kopfkachel]:
        return [k for k in self.neu if k.umweg is None or k.umweg >= UMWEG_AB]

    @property
    def auffaellig(self) -> bool:
        return bool(self.bereich or self.abkuerzungen)


def abstaende(start: Feld, gesperrt: set[Feld], breite: int, hoehe: int) -> dict[Feld, int]:
    """Schritte von ``start`` zu jedem erreichbaren Feld (Breitensuche über freie Nachbarn)."""
    weit = {start: 0}
    schlange = deque([start])
    while schlange:
        x, y = schlange.popleft()
        for dx, dy in NACHBARN:
            n = (x + dx, y + dy)
            if 0 <= n[0] < breite and 0 <= n[1] < hoehe and n not in gesperrt and n not in weit:
                weit[n] = weit[(x, y)] + 1
                schlange.append(n)
    return weit


def laengster_umweg(kopf: Feld, vorher: set[Feld], breite: int, hoehe: int) -> int | None:
    """Der längste alte Weg zwischen zwei freien Nachbarn der Kopfkachel; None, wenn einer fehlte.

    Beispiel: Benji auf (135, 16) im Zedernwald, Kopfkachel (135, 15) auf dem Weg: Von (134, 15)
    nach (136, 15) ging es vorher über die obere Wegreihe in vier Schritten, also kein Umweg.
    """
    nachbarn = [(kopf[0] + dx, kopf[1] + dy) for dx, dy in NACHBARN]
    frei = [n for n in nachbarn if 0 <= n[0] < breite and 0 <= n[1] < hoehe and n not in vorher]
    laengster = 0
    for i, von in enumerate(frei):
        weit = abstaende(von, vorher, breite, hoehe)
        for nach in frei[i + 1 :]:
            if nach not in weit:
                return None
            laengster = max(laengster, weit[nach])
    return laengster


def zugaenge(szene: dict, uebergaenge: set[str]) -> set[Feld]:
    """Start und Übergangsfelder der Szene: Von hier aus betritt der Held die Karte."""
    namen = uebergaenge | {"start"}
    return {tuple(a["feld"]) for a in szene.get("ausloeser", []) if a["name"] in namen}


def pruefe_szene(szene: dict, moebel: dict, uebergaenge: set[str], name: str = "") -> Szenenbefund:
    """Neue Kopfkacheln, neue Bereiche und Abkürzungen einer Szene (``name``: ihr Dateiname)."""
    zeilen = raster(szene)
    gesetzt, _ = platziere(szene, moebel)
    hoehe, breite = len(zeilen), len(zeilen[0])
    grund = gesperrte_felder(zeilen, gesetzt, szene)
    nachher = grund | figurenfelder(szene).keys()
    figuren = {tuple(f["feld"]): f for f in szene.get("figuren", [])}
    koepfe = {(x, y - 1): f for (x, y), f in figuren.items() if y > 0 and (x, y - 1) not in nachher}
    vorher = nachher | koepfe.keys()
    start = zugaenge(szene, uebergaenge)
    alt = erreichbar(start, vorher, breite, hoehe)
    neu = erreichbar(start, nachher, breite, hoehe)
    befund = Szenenbefund(name or szene.get("karte", ""), bereich=neu - alt - koepfe.keys())
    for kopf, figur in sorted(koepfe.items()):
        da = kopf in neu
        umweg = laengster_umweg(kopf, vorher, breite, hoehe) if da else 0
        befund.neu.append(Kopfkachel(figur["name"], kopf, "sitzt" in figur, da, umweg))
    return befund


def pruefe() -> list[Szenenbefund]:
    """Befunde aller Szenen mit mindestens einer neu begehbaren Kopfkachel."""
    moebel = lade_moebel()
    namen = uebergangsnamen()
    befunde = []
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = json.loads(pfad.read_text(encoding="utf-8"))
        befund = pruefe_szene(szene, moebel, namen.get(szene.get("karte", ""), set()), pfad.stem)
        if befund.neu:
            befunde.append(befund)
    return befunde


def zeile(k: Kopfkachel) -> str:
    """Eine Kopfkachel als Zeile des Berichts."""
    art = "sitzt" if k.sitzt else "steht"
    if not k.erreichbar:
        return f"  {k.figur} ({art}): {k.feld} frei, aber nicht erreichbar"
    if k.umweg is None:
        return f"  {k.figur} ({art}): {k.feld} ABKÜRZUNG, verbindet vorher getrennte Felder"
    if k.umweg >= UMWEG_AB:
        return f"  {k.figur} ({art}): {k.feld} ABKÜRZUNG, vorher {k.umweg} Schritte außen herum"
    zusatz = " (in der App meist weiter zu: Sitzpunkt)" if k.sitzt else ""
    return f"  {k.figur} ({art}): {k.feld} begehbar{zusatz}"


def bericht(befunde: list[Szenenbefund], alle: bool) -> list[str]:
    """Der Bericht: auffällige Szenen ganz, die übrigen nur mit ``alle``."""
    zeilen = []
    for b in befunde:
        if not (alle or b.auffaellig):
            continue
        zeilen.append(f"{b.szene}:")
        zeilen += [zeile(k) for k in b.neu if alle or k in b.abkuerzungen]
        if b.bereich:
            zeilen.append(f"  NEUER BEREICH, {len(b.bereich)} Felder: {sorted(b.bereich)}")
    kacheln = sum(len(b.neu) for b in befunde)
    auffaellig = sum(b.auffaellig for b in befunde)
    zeilen.append(
        f"{kacheln} neu begehbare Kopfkacheln in {len(befunde)} Szenen, "
        f"{auffaellig} Szenen mit Abkürzung, {sum(bool(b.bereich) for b in befunde)} mit neuem Bereich."
    )
    return zeilen


if __name__ == "__main__":
    gefunden = pruefe()
    print("\n".join(bericht(gefunden, "--alle" in sys.argv)))
    sys.exit(1 if any(b.bereich for b in gefunden) else 0)
