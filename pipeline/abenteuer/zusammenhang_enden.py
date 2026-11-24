"""Enden von Gleisen und Wegen (AP8a, Gutachten des Autors, 24.11.2026; Teil von zusammenhang.py).

Warum: Die Gutachter fanden Gleise, die mitten im Gras aufhören, und Wege, die ein, zwei Felder vor
einer Tür oder einem Tor enden. zusammenhang.py prüft schon, ob ein Weg irgendwohin führt (Regel
10.32); hier kommen die zwei schärferen Regeln dazu. Sie stehen in eigener Datei, weil
zusammenhang.py sonst über 400 Zeilen käme, und laufen noch nicht im Kartenbau, solange es Befunde
gibt (Obergrenzen im Dauertest ``pipeline/tests/test_abenteuer_querschnitt.py``, Ziel 0).

Regeln:
- Ein Gleis endet nicht frei: nur am Kartenrand, an einem Prellbock, an einem Bahnhof, auf einer
  Brücke (Teil der Art ``bruecke`` daneben) oder im Fels (Tunnel: nächste Kachel in Fahrtrichtung
  Wand). Ein Bahnübergang (Lücke bis ``UEBERGANG`` Kacheln zu einem Gleis in derselben Linie) ist
  kein Ende.
- Ein Weg endet mit Abstand 0 an Tür oder Tor: Liegt Weg 1 bis ``NAH`` Felder vor einer Tür (Auslöser
  ``…Tuer``/``…Eingang``) oder einem Zauntor, aber nicht direkt davor, ist das ein Befund.
Aufruf: ``python -m pipeline.abenteuer.zusammenhang [--alle]``.
"""

import re

from pipeline.abenteuer.kartenbau import WAND, K, platziere, raster

Feld = tuple[int, int]
UEBERGANG = 3  # so breit darf ein Bahnübergang sein (Ironwood: zwei Kacheln Holz)
RAND = 1  # so nah am Kartenrand gilt ein Gleis als hinausführend (Randspalte ist oft Wand)
PRELLBOCK_NAH = 1  # Kacheln zwischen Gleisende und Prellbock
BAHNHOF_NAH = 2  # Kacheln zwischen Gleisende und Bahnhof oder Bahnsteig
NAH = 3  # bis hierhin „endet kurz vor der Tür“; weiter weg führt kein Weg hin (anderes Thema)
WEGBELAEGE = {
    "erde", "erdeRot", "asphalt", "asphaltMitte", "asphaltMitteSenkrecht", "landstrasse",
    "pflaster", "pflasterWeich", "pflasterNass", "schotter", "platten", "stein", "sand",
    "sandplatz", "felsboden", "felsbodenRot", "pisteRot", "dielen", "holzDunkel",
}  # fmt: skip
TUER = re.compile(r"(Tuer|Eingang)\d*$")
TOR = re.compile(r"tor(Offen|\d|$|Links|Rechts)", re.I)
BAHNHOF = re.compile(r"Bahnhof|Bahnsteig")
# (Szenenanfang, Stelle) → Grund.
AUSNAHMEN: dict[tuple[str, str], str] = {}


def felder_von(stueck: dict) -> set[Feld]:
    """Die Kacheln, die ein gesetztes Stück bedeckt."""
    x0, x1 = stueck["x"] // K, (stueck["x"] + stueck["breite"] - 1) // K
    y0, y1 = stueck["y"] // K, (stueck["y"] + stueck["hoehe"] - 1) // K
    return {(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)}


def _teile(felder: set[Feld]) -> list[set[Feld]]:
    """Zusammenhängende Teile (acht Nachbarn: Gleisbögen hängen über Eck)."""
    rest, teile = set(felder), []
    while rest:
        offen, teil = [rest.pop()], set()
        while offen:
            x, y = offen.pop()
            teil.add((x, y))
            for n in ((x + dx, y + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1)):
                if n in rest:
                    rest.remove(n)
                    offen.append(n)
        teile.append(teil)
    return teile


def _enden(teil: set[Feld]) -> list[tuple[list[Feld], Feld]]:
    """Die beiden Enden eines Gleisstücks entlang seiner längeren Achse, mit Fahrtrichtung."""
    xs, ys = [x for x, _ in teil], [y for _, y in teil]
    if max(xs) - min(xs) >= max(ys) - min(ys):
        return [
            ([f for f in teil if f[0] == min(xs)], (-1, 0)),
            ([f for f in teil if f[0] == max(xs)], (1, 0)),
        ]
    return [([f for f in teil if f[1] == min(ys)], (0, -1)), ([f for f in teil if f[1] == max(ys)], (0, 1))]


def _nah(ende: list[Feld], menge: set[Feld], weite: int) -> bool:
    return any(max(abs(a - c), abs(b - d)) <= weite for a, b in ende for c, d in menge)


def _gleis_endet_gut(ende, richtung, zeilen, gleis, prellbock, bahnhof) -> bool:
    """Rand, Prellbock, Bahnhof oder Brücke (beide in ``bahnhof``), Tunnel oder Bahnübergang?"""
    hoehe, breite = len(zeilen), len(zeilen[0])
    dx, dy = richtung
    weit = RAND + 1
    if any(not (0 <= x + dx * weit < breite and 0 <= y + dy * weit < hoehe) for x, y in ende):
        return True  # führt aus der Karte hinaus
    if any(x in (0, breite - 1) or y in (0, hoehe - 1) for x, y in ende):
        return True  # Bogen, der am Rand hinausführt (Bahndamm)
    if _nah(ende, prellbock, PRELLBOCK_NAH) or _nah(ende, bahnhof, BAHNHOF_NAH):
        return True
    vor = [(x + dx, y + dy) for x, y in ende]
    if all(0 <= y < hoehe and 0 <= x < breite and zeilen[y][x] == WAND for x, y in vor):
        return True  # Tunnel
    return any((x + dx * i, y + dy * i) in gleis for x, y in ende for i in range(2, UEBERGANG + 2))


def pruefe_gleise(szene: dict, katalog: dict) -> list[str]:
    """Frei endende Gleise einer Szene."""
    gesetzt, _ = platziere(szene, katalog)
    gleis, prellbock, bahnhof = set(), set(), set()
    for stueck in gesetzt:
        name = stueck["name"]
        if "Prellbock" in name:
            prellbock |= felder_von(stueck)
        elif katalog[name].get("art") == "gleis":
            gleis |= felder_von(stueck)
        elif BAHNHOF.search(name) or katalog[name].get("art") == "bruecke":
            bahnhof |= felder_von(stueck)  # Bahnhof oder Brücke: Das Gleis geht dort weiter
    zeilen, befunde = raster(szene), []
    for teil in _teile(gleis):
        andere = gleis - teil
        for ende, richtung in _enden(teil):
            if not _gleis_endet_gut(ende, richtung, zeilen, andere, prellbock, bahnhof):
                befunde.append(f"Gleis endet frei bei {min(ende)}")
    return befunde


def _wegfelder(szene: dict, zeilen: list[str]) -> set[Feld]:
    boeden = szene.get("boeden", {})
    return {(x, y) for y, z in enumerate(zeilen) for x, c in enumerate(z) if boeden.get(c) in WEGBELAEGE}


def _abstand(felder: set[Feld], weg: set[Feld]) -> int:
    return min((max(abs(a - c), abs(b - d)) for a, b in felder for c, d in weg), default=NAH + 1)


def pruefe_tuerwege(szene: dict, katalog: dict) -> list[str]:
    """Wege, die kurz vor einer Tür oder einem Tor enden (nur Außenkarten)."""
    if szene.get("art") != "aussen":
        return []
    zeilen = raster(szene)
    weg, befunde = _wegfelder(szene, zeilen), []
    for a in szene.get("ausloeser", []):
        if TUER.search(a["name"]) and 1 <= (d := _abstand({tuple(a["feld"])}, weg)) <= NAH:
            befunde.append(f"Weg endet {d} Felder vor {a['name']} {a['feld']}")
    gesetzt, _ = platziere(szene, katalog)
    torfelder: set[Feld] = set()
    for s in gesetzt:
        if katalog[s["name"]].get("art") == "zaun" and TOR.search(s["name"]):
            torfelder |= felder_von(s)
    for tor in _teile(torfelder):  # zwei Flügel sind ein Tor
        d = _abstand(tor, weg) - 1  # das Tor steht neben dem Weg, nicht darauf
        if 1 <= d <= NAH - 1:
            befunde.append(f"Weg endet {d} Felder vor dem Tor bei {min(tor)}")
    return befunde


def pruefe_szene(name: str, szene: dict, katalog: dict) -> list[str]:
    """Beide Prüfungen, ohne die Stellen in AUSNAHMEN."""
    befunde = pruefe_gleise(szene, katalog) + pruefe_tuerwege(szene, katalog)
    return [b for b in befunde if not any(name.startswith(s) and t in b for s, t in AUSNAHMEN)]
