"""Engstellen durch feine Sperren: Passt der Held noch durch?

Warum: Mit feinen Sperren (``kollisionfein.py``, Wunsch des Autors, 16.11.2026) kann eine Lücke
schmaler werden als der Held. Der Held ist 12 × 12 Pixel groß (``oberwelt/szene.ts``); durch eine
Lücke von drei Vierteln einer Kachel passt er gerade noch, durch eine halbe nicht mehr.

Regel: Die Erreichbarkeit rechnet auf einem Raster von 4 Pixeln mit einem Körper von 12 Pixeln
(3 × 3 Zellen), wie die Arcade-Physik der App den Helden schiebt. Weil alle feinen Sperren auf
4 Pixel ausgerichtet sind, passt der Held genau dann durch, wenn ein Weg auf diesem Raster frei ist
(Möbel mit Feinschub zählen mit jeder berührten Zelle, etwas strenger als die App).
- Befund: Ein Ziel (Auslöser, Übergang, Figur), das ohne die feinen Felder erreichbar war, ist mit
  ihnen nicht mehr erreichbar (ein Durchgang ist schmaler als 12 Pixel).
- Hinweis: Ein Weg zu einem Ziel wird enger als 16 Pixel (eine Kachel), der Held passt aber noch.
Ein Auslöser zählt als erreicht, wenn die Mitte des Helden auf seiner Kachel liegt (wie
``oberwelt/ausloeserebene.ts``); eine Figur oder ein Auslöser auf gesperrter Kachel, wenn sie auf
einer Nachbarkachel liegt. Gestartet wird auf dem Auslöser ``start``, sonst auf dem ersten Auslöser
nach Namen. Läuft nur für Szenen mit feinen Feldern oder feinen Möbelmasken.
"""

from collections import deque

from pipeline.abenteuer.kollisionfein import (
    FELDER,
    ZP,
    Z,
    hat_fein,
    hat_feine_moebel,
    kacheln_aus,
    kachelzellen,
    sperrzellen,
)

K = 16
HELD = 3  # Körper des Helden in Zellen (12 px)
KACHELKOERPER = 4  # eine ganze Kachel (16 px), für den Hinweis
Feld = tuple[int, int]
NACHBARN = ((1, 0), (-1, 0), (0, 1), (0, -1))


def stellplaetze(gesperrt: set, breite: int, hoehe: int, koerper: int) -> bytearray:
    """Je Zelle (linke obere Ecke des Körpers), ob ein Körper von ``koerper`` Zellen dort frei steht.

    Eingaben: gesperrte Zellen, Breite und Höhe der Karte in Zellen. Ausgabe: 1 = frei.
    Beispiel: eine freie Fläche von 4 × 4 Zellen mit Körper 3 → die Ecken (0, 0) bis (1, 1).
    """
    zeile_frei = bytearray(breite * hoehe)
    for y in range(hoehe):
        lauf = 0
        for x in range(breite - 1, -1, -1):
            lauf = 0 if (x, y) in gesperrt else lauf + 1
            zeile_frei[y * breite + x] = 1 if lauf >= koerper else 0
    frei = bytearray(breite * hoehe)
    for x in range(breite):
        lauf = 0
        for y in range(hoehe - 1, -1, -1):
            lauf = lauf + 1 if zeile_frei[y * breite + x] else 0
            frei[y * breite + x] = 1 if lauf >= koerper else 0
    return frei


def mittenkachel(x: int, y: int, koerper: int) -> Feld:
    """Die Kachel unter der Mitte eines Körpers mit der Ecke in Zelle (x, y)."""
    halb = koerper * ZP // 2
    return ((x * ZP + halb) // K, (y * ZP + halb) // K)


def erreichte_kacheln(gesperrt: set, groesse: Feld, koerper: int, start: set[Feld]) -> set[Feld]:
    """Die Kacheln, auf denen die Mitte des Körpers stehen kann, ausgehend von ``start``.

    Beispiel: ein Gang von 2 Zellen Breite → mit Körper 3 nur die Startkachel selbst.
    """
    breite, hoehe = groesse[0] * Z, groesse[1] * Z
    frei = stellplaetze(gesperrt, breite, hoehe, koerper)
    offen = deque(
        (x, y)
        for y in range(hoehe)
        for x in range(breite)
        if frei[y * breite + x] and mittenkachel(x, y, koerper) in start
    )
    gesehen = set(offen)
    while offen:
        x, y = offen.popleft()
        for dx, dy in NACHBARN:
            n = (x + dx, y + dy)
            if 0 <= n[0] < breite and 0 <= n[1] < hoehe and n not in gesehen and frei[n[1] * breite + n[0]]:
                gesehen.add(n)
                offen.append(n)
    return {mittenkachel(x, y, koerper) for x, y in gesehen}


def _ziele(szene: dict) -> dict[str, tuple[set[Feld], bool]]:
    """Name → (Kacheln, nur ansehen von nebenan). Figuren schaut man von nebenan an."""
    ziele: dict[str, tuple[set[Feld], bool]] = {}
    for a in szene.get("ausloeser", []):
        felder, _ = ziele.setdefault(a["name"], (set(), bool(a.get("auf_moebel"))))
        felder.add(tuple(a["feld"]))
    for f in szene.get("figuren", []):
        ziele[f"Figur {f['name']}"] = ({tuple(f["feld"])}, True)
    return ziele


def _erreicht(felder: set[Feld], nebenan: bool, kacheln: set[Feld], gesperrt: set[Feld]) -> bool:
    nah = {(x + dx, y + dy) for x, y in felder for dx, dy in NACHBARN}
    if nebenan or felder <= gesperrt:
        return bool((nah | felder) & kacheln)
    return bool(felder & kacheln)


def ohne_fein(szene: dict) -> dict:
    """Die Szene ohne feine Felder und feine Möbelmasken (der Vergleich „vorher“)."""
    grob = {k: v for k, v in szene.items() if k not in FELDER}
    grob["objekte"] = [{k: v for k, v in e.items() if k != "maske_fein"} for e in szene.get("objekte", [])]
    return grob


def pruefe_engstellen(szene: dict, zeilen: list[str], gesetzt: list[dict], moebel: dict) -> tuple[list, list]:
    """(Befunde, Hinweise) zu Engstellen durch feine Sperren; leer ohne feine Felder.

    Beispiel: Ein Gang von einer Kachel Breite bekommt auf beiden Seiten ein feines Viertel → der
    Gang ist 8 px breit, die Tür dahinter unerreichbar → Befund „Engstelle: tuer ist mit den feinen
    Sperren nicht mehr erreichbar (Durchgang schmaler als 12 px)“.
    """
    if not hat_fein(szene) and not hat_feine_moebel(gesetzt):
        return [], []
    from pipeline.abenteuer.figurensperre import figurenfelder
    from pipeline.abenteuer.kartenbau import platziere

    grob = ohne_fein(szene)
    figuren = {z for f in figurenfelder(szene) for z in kachelzellen(f)}
    mit = sperrzellen(zeilen, gesetzt, szene) | figuren
    # „Vorher“ auch ohne die feinen Masken des Katalogs (feinmasken.py, KARTENREGELN 10.88).
    grobkatalog = {n: {k: v for k, v in a.items() if k != "maske_fein"} for n, a in moebel.items()}
    ohne = sperrzellen(zeilen, platziere(grob, grobkatalog)[0], grob) | figuren
    ziele = _ziele(szene)
    if not ziele:
        return [], []
    startname = "start" if "start" in ziele else sorted(ziele)[0]
    start = ziele[startname][0]
    groesse = (len(zeilen[0]), len(zeilen))
    erreicht = {
        (art, koerper): erreichte_kacheln(zellen, groesse, koerper, start)
        for art, zellen in (("mit", mit), ("ohne", ohne))
        for koerper in (HELD, KACHELKOERPER)
    }
    gesperrt = {"mit": kacheln_aus(mit), "ohne": kacheln_aus(ohne)}
    befunde, hinweise = [], []
    for name, (felder, nebenan) in sorted(ziele.items()):
        if name == startname:
            continue
        ist = {(art, k): _erreicht(felder, nebenan, erreicht[(art, k)], gesperrt[art]) for art, k in erreicht}
        if ist[("ohne", HELD)] and not ist[("mit", HELD)]:
            befunde.append(
                f"Engstelle: {name} {sorted(felder)} ist mit den feinen Sperren nicht mehr erreichbar "
                "(Durchgang schmaler als 12 px)"
            )
        elif ist[("ohne", KACHELKOERPER)] and not ist[("mit", KACHELKOERPER)]:
            hinweise.append(f"Engstelle: Der Weg zu {name} {sorted(felder)} wird enger als 16 px")
    return befunde, hinweise
