"""Zusammenhang draußen: Breiten und Enden von Straßen, Wegen und Wasser, Lücken in Zäunen.

Warum: Der Autor fand in Runde 4 immer wieder unterbrochene Bäche, Wege ohne Ziel, Zaunlücken ohne
Pfosten und Straßen, die zu schmal oder sprunghaft breit wurden (KARTENREGELN 10.32 bis 10.35). Diese
Prüfung läuft im Kartenbauer auf dem Raster und den gesetzten Möbeln, ohne Bild; die Bildprüfung in
kartenbild.py verfolgt zusätzlich die gezeichneten Ränder.
"""

import re

from pipeline.abenteuer.kartenbau import LEER, WAND, WASSER, K

# Mindestbreiten in Kacheln (KARTENREGELN 10.33): Straße zwei Spuren, Weg zwei Leute nebeneinander.
MINDEST = {"asphalt": 3, "erde": 2}
# Schmale Stücke unter der Mindestbreite: keins. Ein Weg einer Kachel Breite lässt sich mit den
# Randkacheln von LimeZu nicht zeichnen (kein Stück mit Rand auf beiden Seiten), er stieße gerade
# ans Gras (Randspur, Cedar Creek 9.11.2026).
SCHMAL_ERLAUBT = 0
# Ab dieser Breite ist es ein Platz, ein Feld oder ein See: dort keine Prüfung des Breitenwechsels.
FLAECHE = 8
# Ein Bach ist schmaler als das; er darf nicht mitten in der Karte enden.
BACH_HOECHSTENS = 5
# Ein Fluss darf von Feld zu Feld um so viel breiter oder schmaler werden, ein Weg nur um eins.
WASSER_SPRUNG = 2
# Holzböden über Wasser (Brücken, Stege) gehören für den Zusammenhang zum Wasserlauf.
HOLZ = {"dielen", "holzDunkel", "holzHell"}
ENDSTUECK = re.compile(r"Ecke|Ende|Pfosten|Tor|Links|Rechts|Seite|Rand|Left|Right|End|Corner|Post|Gate", re.I)


def _komponenten(zeilen: list[str], gehoert) -> list[set[tuple[int, int]]]:
    """Zusammenhängende Felder (vier Nachbarn), für die ``gehoert(zeichen)`` gilt."""
    hoehe, breite = len(zeilen), len(zeilen[0])
    gesehen: set[tuple[int, int]] = set()
    teile = []
    for y in range(hoehe):
        for x in range(breite):
            if (x, y) in gesehen or not gehoert(zeilen[y][x]):
                continue
            teil, offen = set(), [(x, y)]
            gesehen.add((x, y))
            while offen:
                cx, cy = offen.pop()
                teil.add((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < breite and 0 <= ny < hoehe and (nx, ny) not in gesehen:
                        if gehoert(zeilen[ny][nx]):
                            gesehen.add((nx, ny))
                            offen.append((nx, ny))
            teile.append(teil)
    return teile


def breiten(
    teil: set[tuple[int, int]], groesse: tuple[int, int], diagonal: bool = True, nur_innen: bool = False
) -> dict[tuple[int, int], int]:
    """Örtliche Breite je Feld: die kürzeste Ausdehnung im Teil über vier Achsen (waagerecht,
    senkrecht, beide Diagonalen). Die Diagonalen halten die Breite an Abzweigen und Biegungen
    stabil, wo eine der geraden Achsen in den anderen Weg hineinläuft. Achsen, die den Kartenrand
    erreichen, zählen nicht (dort läuft der Weg weiter, die Breite wäre abgeschnitten).

    Mit ``nur_innen`` fehlen Felder ohne eine Achse innerhalb der Karte (ein Fluss am Kartenrand
    hat dort keine messbare Breite). Ohne ``diagonal`` nur waagerecht und senkrecht: für die
    Mindestbreite, weil Diagonalen an Wegenden und Treppenstufen zu kleine Werte geben.

    Beispiel: ein senkrechter Bach drei Felder breit hat überall Breite 3; der Eckpunkt eines
    Abzweigs zweier Wege der Breite 2 hat Breite 2, nicht die Länge des Abzweigs.
    """
    breite, hoehe = groesse

    def lauf(x: int, y: int, dx: int, dy: int) -> tuple[int, bool]:
        n = 0
        while (x + dx * (n + 1), y + dy * (n + 1)) in teil:
            n += 1
        nx, ny = x + dx * (n + 1), y + dy * (n + 1)
        return n, not (0 <= nx < breite and 0 <= ny < hoehe)

    ergebnis = {}
    for x, y in teil:
        innen, alle = [], []
        for dx, dy in ((1, 0), (0, 1), (1, 1), (1, -1))[: 4 if diagonal else 2]:
            (a, rand_a), (b, rand_b) = lauf(x, y, dx, dy), lauf(x, y, -dx, -dy)
            alle.append(a + b + 1)
            if not (rand_a or rand_b):
                innen.append(a + b + 1)
        if innen or not nur_innen:
            ergebnis[(x, y)] = min(innen or alle)
    return ergebnis


def _am_rand(teil: set, zeilen: list[str]) -> set[str]:
    hoehe, breite = len(zeilen), len(zeilen[0])
    seiten = set()
    for x, y in teil:
        if x <= 1:
            seiten.add("West")
        if x >= breite - 2:
            seiten.add("Ost")
        if y <= 1:
            seiten.add("Nord")
        if y >= hoehe - 2:
            seiten.add("Süd")
    return seiten


def _sprung(w: dict[tuple[int, int], int], erlaubt: int = 1) -> tuple[int, int] | None:
    """Erstes Feld, nach dem die Breite um mehr als ``erlaubt`` springt und so bleibt.

    Warum „bleibt“: An Abzweigen ist die gemessene Breite für ein, zwei Felder größer; das ist kein
    Breitenwechsel. Gemeldet wird erst, wenn die Breite zwei Felder davor gleich bleibt und drei
    Felder danach anders ist (Straße, die vor dem Wendehammer plötzlich doppelt so breit wird).
    """
    for (x, y), b in sorted(w.items(), key=lambda e: (e[0][1], e[0][0])):
        if b > FLAECHE:
            continue
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            davor = [w.get((x - dx * i, y - dy * i)) for i in (1, 2)]
            danach = [w.get((x + dx * i, y + dy * i)) for i in (1, 2, 3)]
            stabil = all(v is not None and abs(b - v) <= erlaubt for v in davor)
            anders = all(v is not None and v <= FLAECHE and abs(b - v) > erlaubt for v in danach)
            if stabil and anders:
                return (x, y)
    return None


def _schmale_stuecke(w: dict[tuple[int, int], int], mindest: int) -> list[tuple[int, int]]:
    """Zusammenhängende Stücke unter der Mindestbreite, die länger als ein kurzer Zugang sind."""
    schmal = {f for f, b in w.items() if b < mindest}
    lange = []
    for stueck in _komponenten_aus(schmal):
        if len(stueck) > SCHMAL_ERLAUBT:
            lange.append(min(stueck, key=lambda f: (f[1], f[0])))
    return sorted(lange)


def _komponenten_aus(felder: set[tuple[int, int]]) -> list[set[tuple[int, int]]]:
    """Zusammenhängende Teile einer Feldmenge (vier Nachbarn)."""
    rest, teile = set(felder), []
    while rest:
        offen, teil = [rest.pop()], set()
        while offen:
            x, y = offen.pop()
            teil.add((x, y))
            for n in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if n in rest:
                    rest.remove(n)
                    offen.append(n)
        teile.append(teil)
    return teile


def wasserzeichen(szene: dict) -> set[str]:
    """Zeichen, die zum Wasserlauf gehören: Wasser, Brückenfelder und Holzböden über dem Wasser."""
    holz = {z for z, art in szene.get("boeden", {}).items() if art in HOLZ}
    return {WASSER} | set(szene.get("bruecken", [])) | holz


def pruefe_breiten(szene: dict, zeilen: list[str]) -> list[str]:
    """Mindestbreite und gleichmäßige Breite von Straßen, Wegen und Flüssen (10.33, 10.34)."""
    befunde, groesse = [], (len(zeilen[0]), len(zeilen))
    boeden = szene.get("boeden", {})
    arten = {z: boeden[z] for z in boeden if boeden[z] in MINDEST and z not in wasserzeichen(szene)}
    for zeichen, art in sorted(arten.items()):
        for teil in _komponenten(zeilen, lambda z, c=zeichen: z == c):
            gerade = breiten(teil, groesse, diagonal=False)
            if sorted(gerade.values())[len(gerade) // 2] > FLAECHE:
                continue  # Feld oder Platz, kein Weg
            for stelle in _schmale_stuecke(gerade, MINDEST[art]):
                befunde.append(f"{art} „{zeichen}“ zu schmal bei {stelle} (mindestens {MINDEST[art]})")
            if (stelle := _sprung(breiten(teil, groesse))) is not None:
                befunde.append(f"{art} „{zeichen}“ ändert die Breite sprunghaft bei {stelle}")
    wasser = wasserzeichen(szene)
    for teil in _komponenten(zeilen, lambda z: z in wasser):
        if len(_am_rand(teil, zeilen)) < 2:
            continue  # Teich oder See: Ufer dürfen frei schwingen
        w = breiten(teil, groesse, diagonal=False, nur_innen=True)
        if (stelle := _sprung(w, WASSER_SPRUNG)) is not None:
            befunde.append(f"Fluss ändert die Breite sprunghaft bei {stelle}")
    return befunde


def pruefe_enden(szene: dict, zeilen: list[str], gesetzt: list[dict], moebel: dict) -> list[str]:
    """Bäche enden nicht mitten in der Karte; Wege und Straßen führen irgendwohin (10.32)."""
    befunde = []
    bruecken = wasserzeichen(szene)
    for teil in _komponenten(zeilen, lambda z: z in bruecken):
        seiten = _am_rand(teil, zeilen)
        if len(seiten) == 1 and max(breiten(teil, (len(zeilen[0]), len(zeilen))).values()) < BACH_HOECHSTENS:
            stelle = min(teil, key=lambda f: (f[1], f[0]))
            befunde.append(f"Bach endet mitten in der Karte (berührt nur {seiten.pop()}, bei {stelle})")
    ziele = {tuple(a["feld"]) for a in szene.get("ausloeser", []) + szene.get("figuren", [])}
    for s in gesetzt:
        if moebel.get(s["name"], {}).get("art") in ("tuer", "gebaeude", "steg", "treppe"):
            x0, x1 = s["x"] // K, (s["x"] + s["breite"] - 1) // K
            ziele |= {(x, (s["y"] + s["hoehe"] - 1) // K + d) for x in range(x0, x1 + 1) for d in (0, 1)}
    boeden = szene.get("boeden", {})
    for zeichen in sorted(z for z, art in boeden.items() if art in MINDEST and z not in bruecken):
        for teil in _komponenten(zeilen, lambda z, c=zeichen: z == c):
            if _am_rand(teil, zeilen) or _beruehrt_belag(teil, zeilen, zeichen):
                continue
            nahe = {(x + dx, y + dy) for x, y in teil for dx in (-1, 0, 1) for dy in (-1, 0, 1)}
            if not nahe & ziele:
                stelle = min(teil, key=lambda f: (f[1], f[0]))
                befunde.append(f"Weg „{zeichen}“ bei {stelle} führt nirgendwohin")
    return befunde


def _beruehrt_belag(teil: set, zeilen: list[str], zeichen: str) -> bool:
    """Ob der Weg an einen anderen Belag stößt (Gehweg, Straße, Brücke, Platz)."""
    for x, y in teil:
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= ny < len(zeilen) and 0 <= nx < len(zeilen[0]):
                z = zeilen[ny][nx]
                if z not in (".", WAND, WASSER, LEER, zeichen):
                    return True
    return False


def pruefe_zaeune(gesetzt: list[dict], moebel: dict) -> list[str]:
    """Zaunreihen ohne Lücke, außer zwischen Endstücken; keine versetzten Teile (10.35).

    Beispiel: Weide an der Landstraße: Zaun unten mit Lücke ohne Pfosten wird gemeldet, eine
    Lücke zwischen „ZaunEckeRechts“ und „ZaunEckeLinks“ (Tor) nicht.
    """
    befunde = []
    zaun = [s for s in gesetzt if moebel.get(s["name"], {}).get("art") == "zaun"]
    reihen: dict[int, list[dict]] = {}
    for s in zaun:
        if s["breite"] >= s["hoehe"]:
            reihen.setdefault(s["y"] + s["hoehe"], []).append(s)
    for fuss, teile in sorted(reihen.items()):
        teile.sort(key=lambda s: s["x"])
        for a, b in zip(teile, teile[1:], strict=False):
            luecke = b["x"] - (a["x"] + a["breite"])
            if 0 < luecke <= 3 * K and not (ENDSTUECK.search(a["name"]) and ENDSTUECK.search(b["name"])):
                befunde.append(f"Zaunlücke ohne Endpfosten zwischen {a['name']} und {b['name']} (Fuß {fuss})")
    for a in zaun:
        for b in zaun:
            anschluss = b["x"] == a["x"] + a["breite"]
            versatz = abs((a["y"] + a["hoehe"]) - (b["y"] + b["hoehe"]))
            if anschluss and 0 < versatz <= K // 2:
                befunde.append(f"{b['name']} sitzt {versatz} px versetzt neben {a['name']}")
    return befunde


def pruefe_zusammenhang(szene: dict, zeilen: list[str], gesetzt: list[dict], moebel: dict) -> list[str]:
    """Alle Prüfungen dieses Moduls; nur für Außenkarten."""
    if szene.get("art") != "aussen":
        return []
    return (
        pruefe_breiten(szene, zeilen)
        + pruefe_enden(szene, zeilen, gesetzt, moebel)
        + pruefe_zaeune(gesetzt, moebel)
    )
