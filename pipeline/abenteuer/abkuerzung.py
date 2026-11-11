"""Abkürzungen abseits des Wegs (Sammlung R030, R031; Entscheidung 6 in Runde 11).

Warum: Der Autor lief auf dem Zedernpfad am unteren Kartenrand von links nach rechts und dann zum
Ausgang, ohne dem Weg zu folgen, und umging so das ganze Gebirge. „Wo die Geschichte einen Weg
vorgibt, ist er der einzige Weg: Wald, Fels, Zaun, Wasser sperren lückenlos. Ausnahme: Abstecher,
an denen es etwas zu finden gibt.“

Was geprüft wird (nur Außenkarten, je Grundkarte und Zustand): Für je zwei Übergänge am Kartenrand
sucht die Prüfung den kürzesten Weg dreimal:
- nur über Wegboden (Erde, Asphalt, Pflaster, Schotter, Piste, Platten, Stege);
- über alles Begehbare;
- über alles Begehbare außer dem Wegboden (nur an den beiden Enden darf er ein paar Felder weit
  betreten werden).
Befunde:
- **Abkürzung:** Querfeldein ist deutlich kürzer als über den Weg (``SCHWELLE``, ``SPAREN_MIN``).
- **Umgehung** (nur Orte der Art „weg“): Man kommt ans Ziel, ohne den Weg zu benutzen.
- **Weg gesperrt, aber umgehbar:** Ein Möbel sperrt den Weg (Sturmholz, Gatter, Schranke), und
  querfeldein kommt man trotzdem durch. Eine Sperre der Geschichte ist so wirkungslos.
- **Kein durchgehender Weg:** Die beiden Übergänge verbindet kein Wegboden.
Ausnahme: ``"abkuerzung_ok"`` in der Szene mit einem Kennwort als Grund (``offenesGelaende``:
Wüste, Hochebene, Prärie ohne Sperre der Geschichte am Weg; ``platz``: ein Platz, über den man
quer gehen darf). Ein Kennwort statt eines Satzes, weil in den Daten keine Sätze stehen. Abstecher zu Fundstellen bleiben erlaubt: Sie führen nicht von Rand zu Rand.

Die Prüfung warnt nur. Aufruf: ``python -m pipeline.abenteuer.abkuerzung`` (Liste je Karte).
"""

import json
import sys
from collections import deque

from pipeline.abenteuer.durchgang import alle_fassungen, gesperrte_felder
from pipeline.abenteuer.uebergaenge import INHALTE, felder, rand, regel_fuer, szenen, uebergaenge

Feld = tuple[int, int]
# Böden, auf denen man gehen soll. Stege und Brücken (Szene „bruecken“) zählen immer dazu.
WEGBOEDEN = {
    "erde", "erdeRot", "asphalt", "asphaltMitte", "asphaltMitteSenkrecht", "pflaster", "schotter",
    "pisteRot", "platten", "dielen", "stein", "sand", "sandplatz",
}  # fmt: skip
# Querfeldein gilt als Abkürzung, wenn es höchstens diesen Anteil des Wegs lang ist …
SCHWELLE = 0.85
# … und mindestens so viele Felder spart.
SPAREN_MIN = 6
# So weit darf die Umgehung an beiden Enden den Wegboden betreten (der Weg führt bis an den Rand).
ANLAUF = 4
SCHRITTE = ((1, 0), (-1, 0), (0, 1), (0, -1))


def kuerzester(erlaubt, starts: list[Feld], ziele: set[Feld]) -> list[Feld] | None:
    """Kürzester Weg (Breitensuche) von einem der Startfelder zu einem der Zielfelder, sonst None.

    ``erlaubt(feld)`` sagt, ob ein Feld betreten werden darf; Start und Ziel zählen immer.
    Beispiel: 3 × 1 Felder frei, Start (0, 0), Ziel (2, 0) → [(0, 0), (1, 0), (2, 0)].
    """
    woher: dict[Feld, Feld | None] = {s: None for s in starts}
    offen = deque(starts)
    while offen:
        hier = offen.popleft()
        if hier in ziele:
            weg = []
            while hier is not None:
                weg.append(hier)
                hier = woher[hier]
            return weg[::-1]
        for dx, dy in SCHRITTE:
            nach = (hier[0] + dx, hier[1] + dy)
            if nach not in woher and (nach in ziele or erlaubt(nach)):
                woher[nach] = hier
                offen.append(nach)
    return None


def _umkreis(frei, mitten: list[Feld], schritte: int) -> set[Feld]:
    """Alle freien Felder, die höchstens ``schritte`` Schritte von einem der Felder entfernt sind."""
    weite = {m: 0 for m in mitten}
    offen = deque(mitten)
    while offen:
        hier = offen.popleft()
        if weite[hier] == schritte:
            continue
        for dx, dy in SCHRITTE:
            nach = (hier[0] + dx, hier[1] + dy)
            if nach not in weite and frei(nach):
                weite[nach] = weite[hier] + 1
                offen.append(nach)
    return set(weite)


def gelaende(szene: dict, moebel: dict) -> tuple:
    """(frei, weg, sperre) für eine Szene: Abfragen „begehbar?“ und „Wegboden?“ je Feld (der
    Wegboden zählt auch unter einem Möbel) und „welches Möbel sperrt dieses Feld?“ (Name oder None)."""
    from pipeline.abenteuer.kartenbau import platziere, raster

    zeilen = raster(szene)
    gesetzt, _ = platziere(szene, moebel)
    gesperrt = gesperrte_felder(zeilen, gesetzt)
    boeden = {".": szene.get("boden", ""), **szene.get("boeden", {})}
    wegzeichen = {z for z, art in boeden.items() if art in WEGBOEDEN} | set(szene.get("bruecken", []))

    def frei(feld: Feld) -> bool:
        x, y = feld
        return 0 <= y < len(zeilen) and 0 <= x < len(zeilen[y]) and feld not in gesperrt

    def weg(feld: Feld) -> bool:
        x, y = feld
        return 0 <= y < len(zeilen) and 0 <= x < len(zeilen[y]) and zeilen[y][x] in wegzeichen

    def sperre(feld: Feld) -> str | None:
        for s in gesetzt:
            if s["kollision"] and feld in gesperrte_felder([], [s]):
                return s["name"]
        return None

    return frei, weg, sperre


def randuebergaenge(szene: dict, liste: list[dict]) -> dict[str, list[Feld]]:
    """Name → Felder der Übergänge einer Szene, die am Kartenrand liegen."""
    namen = sorted({a["name"] for a in szene.get("ausloeser", [])})
    ergebnis = {}
    for name in namen:
        regel = regel_fuer(liste, szene["karte"], name)
        orte = felder(szene, name)
        if regel and regel.get("art") == "uebergang" and any(rand(szene, f) for f in orte):
            ergebnis[name] = orte
    return ergebnis


def befunde_der_szene(szene: dict, liste: list[dict], moebel: dict, ist_weg: bool) -> list[str]:
    """Abkürzungen, Umgehungen und fehlende Wege zwischen den Randübergängen einer Szene.

    Eingaben: Szene, Übergänge aus orte.json, Möbelliste, ob der Ort ein Weg ist (Art „weg“).
    Ausgabe: Befunde als Sätze; leer bei Innenkarten, bei ``abkuerzung_ok`` und bei weniger als
    zwei Randübergängen.
    Beispiel: „zurueckMapleFalls → weiterCedarCreek: Umgehung ohne den Weg (212 Felder, etwa
    über (70, 27))“.
    """
    if szene.get("art") != "aussen" or szene.get("abkuerzung_ok"):
        return []
    frei, weg, sperre = gelaende(szene, moebel)
    rand_ue = randuebergaenge(szene, liste)
    namen = sorted(rand_ue)
    befunde = []
    for i, a in enumerate(namen):
        for b in namen[i + 1 :]:
            starts, ziele = rand_ue[a], set(rand_ue[b])
            ueber_alles = kuerzester(frei, starts, ziele)
            if ueber_alles is None:
                continue  # getrennte Kartenteile (Steg, Fähre): nichts zu vergleichen
            ueber_weg = kuerzester(lambda f: frei(f) and weg(f), starts, ziele)
            if ueber_weg is None:
                grund = _ohne_weg(weg, frei, sperre, starts, ziele, len(ueber_alles) - 1)
                befunde.append(f"{a} → {b}: {grund}")
            elif len(ueber_weg) - len(ueber_alles) >= SPAREN_MIN and len(ueber_alles) - 1 <= SCHWELLE * (
                len(ueber_weg) - 1
            ):
                befunde.append(
                    f"{a} → {b}: Abkürzung querfeldein, {len(ueber_alles) - 1} statt "
                    f"{len(ueber_weg) - 1} Felder (etwa über {_abseits(ueber_alles, weg)})"
                )
            if ist_weg:
                nah = _umkreis(frei, [*starts, *ziele], ANLAUF)
                ohne = kuerzester(lambda f, nah=nah: frei(f) and (not weg(f) or f in nah), starts, ziele)
                if ohne is not None:
                    befunde.append(
                        f"{a} → {b}: Umgehung ohne den Weg ({len(ohne) - 1} Felder, etwa über "
                        f"{_abseits(ohne, weg)})"
                    )
    return befunde


def _ohne_weg(weg, frei, sperre, starts: list[Feld], ziele: set[Feld], querfeldein: int) -> str:
    """Satz für zwei Übergänge ohne freien Weg: gesperrt durch ein Möbel oder ohne Wegboden."""
    boden = kuerzester(weg, starts, ziele)
    zu = next((f for f in boden or [] if not frei(f)), None)
    if zu is None:
        return f"kein durchgehender Weg ({querfeldein} Felder querfeldein)"
    wer = sperre(zu) or "Raster"
    return f"Weg bei {zu} gesperrt ({wer}), aber umgehbar ({querfeldein} Felder querfeldein)"


def _abseits(strecke: list[Feld], weg) -> Feld:
    """Ein Feld der Strecke abseits des Wegbodens, möglichst aus der Mitte (zum Nachsehen)."""
    abseits = [f for f in strecke if not weg(f)]
    return (abseits or strecke)[len(abseits or strecke) // 2]


def pruefe() -> dict[str, list[str]]:
    """Befunde je Karte (Name wie in ``durchgang.alle_fassungen``), nur Karten mit Befund."""
    from pipeline.abenteuer.moebelliste import lade_moebel

    orte = json.loads((INHALTE / "orte.json").read_text(encoding="utf-8"))["orte"]
    wege = {o["kennung"] for o in orte if o.get("art") == "weg"}
    liste, moebel = uebergaenge(), lade_moebel()
    ergebnis = {}
    for marke, szene in alle_fassungen(szenen()):
        ist_weg = szene["karte"].split(".")[0] in wege
        if befunde := befunde_der_szene(szene, liste, moebel, ist_weg):
            ergebnis[marke] = befunde
    return ergebnis


def main() -> int:
    """Druckt die Befunde je Karte (immer Rückgabe 0: Die Prüfung warnt nur)."""
    ergebnis = pruefe()
    for marke, befunde in ergebnis.items():
        print(f"{marke}:")
        for b in befunde:
            print(f"  - {b}")
    print(f"{sum(len(b) for b in ergebnis.values())} Hinweise auf {len(ergebnis)} Karten (R031)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
