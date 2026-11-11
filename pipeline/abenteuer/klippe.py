"""Felskanten aus LimeZus Klippenkacheln (Szene ``"kante": "klippe"``, Runde 8).

Warum: Gestufte Gelände (Steinbruchgrube, Sternwarte, Bergstraße) zeichnete der Kartenbauer mit dem
Material ``fels`` als gerade Bänder mit heller Krone; der Autor sah darin „drei Räume mit Erdwänden“
(Revision 2, allgemeiner Punkt 18). LimeZu baut Höhenstufen anders (Vorbild Modern Exteriors 048): Die
obere Fläche endet mit einer gewellten Kante, darunter fällt eine braune Felswand ab, unten mit einem
Grasfuß; Treppen sind in den Fels geschlagen. Die Kacheln dafür liegen im Geländebogen
(1_Terrains_and_Fences, Spalten 8–10 und 14–16, Reihen 42–46; Treppe Spalte 25, Reihen 46–48).

Rolle im Gesamtbild: reine Logik für ``kartenbild.hintergrund``; sie sagt je Feld, welche Kachel des
Geländebogens dort liegt, oder None (dann zeichnet ``kartenbild`` wie bisher). Abschaltbar: Ohne
``"kante": "klippe"`` in der Szene wird nichts davon benutzt, bestehende Karten bleiben gleich.

Aufbau einer Kante (drei Reihen ``#`` über einem Boden, wie ``flaechen`` sie findet):
- oberste Reihe: Übergang von der oberen Fläche zur Wand mit gewellter Kante (Reihe 44);
- mittlere Reihe: Felswand (Reihe 45);
- unterste Reihe: Felswand mit Grasfuß (Reihe 46).
Links und rechts am Ende eines Abschnitts stehen die Randkacheln (Spalte 8 und 10), dazwischen die
Mitte (Spalte 9). Liegt über der Kante kein Gras, nimmt die Klippe die Erdvariante (Spalten 14–16).
Breite ``#``-Flächen ohne Boden darunter zeigen die obere Fläche (Reihe 43).

Hohe Wände (Szene ``"klippenhoehe": 5``, Gutachten Canyonrand 11.11.2026: „Eine Schlucht wirkt so wie
eine Bordsteinkante“): Das Band ist dann so viele Reihen hoch; oben die Kante, unten der Fuß,
dazwischen wiederholt sich die Felswand. Ohne Angabe bleibt es bei drei Reihen.
"""

from pathlib import Path

# Rot umgefärbte Erdklippe (Bogen „klippeRot“ in materialien.json), gleiche Kachellage.
ROTE_KLIPPE = "spiel/eigene/klippe_rot.png"
# Grün umgefärbte Erdklippe für Deiche (Bogen „klippeGras“, Bildwunsch klippe_gras.py, mittel-1).
GRAS_KLIPPE = "spiel/eigene/klippe_gras.png"
# Geländebogen (materialien.json „gelaende“): Spalte je Variante für links, Mitte, rechts.
SPALTEN = {"gras": (8, 9, 10), "erde": (14, 15, 16)}
REIHE_RAND, REIHE_KANTE, REIHE_WAND, REIHE_FUSS, REIHE_OBEN = 42, 44, 45, 46, 43
# In den Fels geschlagene Treppe, eine Kachel breit: oben mit Kappe, Mitte, unten mit Grasfuß.
TREPPE = {"oben": (25, 47), "mitte": (25, 46), "unten": (25, 48)}
WAND = "#"
# Höhe einer Kante in Reihen, wenn die Szene nichts sagt (Kante, Wand, Fuß).
HOEHE_STANDARD = 3
# Breiteste Rampe, die als Treppe durch eine Kante gilt (Grube: vier Felder).
BREITE_RAMPE = 4


def _ist_wand(zeilen: list[str], x: int, y: int) -> bool:
    return 0 <= y < len(zeilen) and 0 <= x < len(zeilen[0]) and zeilen[y][x] == WAND


def _rolle(zeilen: list[str], x: int, y: int, hoehe: int = HOEHE_STANDARD) -> str | None:
    """Welche Reihe der Kante (x, y) ist: „kante“, „wand“, „fuss“ oder None (keine Kante darunter)."""
    if not _ist_wand(zeilen, x, y):
        return None
    # Der linke und rechte Kartenrand setzt das Band daneben fort, statt als flache Erdfläche wie ein
    # Platzhalter zu stehen (Gutachten Runde 9, Querbefund „orange Kacheln“).
    breite = len(zeilen[0])
    if x in (0, breite - 1) and breite > 2:
        innen = 1 if x == 0 else breite - 2
        if _ist_wand(zeilen, innen, y):
            return _rolle_ohne_rand(zeilen, innen, y, hoehe)
    return _rolle_ohne_rand(zeilen, x, y, hoehe)


def _rolle_ohne_rand(zeilen: list[str], x: int, y: int, hoehe: int = HOEHE_STANDARD) -> str | None:
    """Rolle nach den Feldern darunter (siehe ``_rolle``), ohne die Fortsetzung am Rand.

    Beispiel mit ``hoehe`` 5: das Feld direkt über dem Boden ist „fuss“, die drei darüber „wand“,
    das fünfte „kante“; ein sechstes Wandfeld darüber gehört nicht mehr zur Kante (None).
    """
    for abstand in range(1, hoehe + 1):
        rolle = "fuss" if abstand == 1 else "kante" if abstand == hoehe else "wand"
        unten = y + abstand
        if unten >= len(zeilen):
            return None
        if zeilen[unten][x] != WAND:
            return rolle if all(_ist_wand(zeilen, x, y + i) for i in range(abstand)) else None
    return None


def _variante(zeilen: list[str], x: int, y: int, grasboden: set[str]) -> str:
    """Gras oder Erde, je nach dem Boden über der Kante (erste Nicht-Wand-Reihe darüber)."""
    oben = y - 1
    while oben >= 0 and zeilen[oben][x] == WAND:
        oben -= 1
    zeichen = zeilen[oben][x] if oben >= 0 else WAND
    return "gras" if zeichen in grasboden else "erde"


def klippenfeld(
    zeilen: list[str], x: int, y: int, grasboden: set[str], hoehe: int = HOEHE_STANDARD
) -> tuple[int, int] | None:
    """Die Kachel des Geländebogens für das Wandfeld (x, y), oder None.

    Eingaben: Raster der Szene, Feld, die Rasterzeichen, die in der Szene Gras sind, die Höhe der
    Kante in Reihen (Szene „klippenhoehe“, sonst drei).
    Ausgabe: (Spalte, Reihe) im Geländebogen.
    Beispiel: Band aus drei Reihen „#“ zwischen Wiese oben und Schotter unten → oben Reihe 44,
    Mitte 45, unten 46; am linken Ende des Bands Spalte 8.
    Sonderfälle: Wandfelder ohne Boden darunter (dicke Ränder) zeigen die obere Fläche (Reihe 43).
    """
    if not _ist_wand(zeilen, x, y):
        return None
    rolle = _rolle(zeilen, x, y, hoehe)
    breite = len(zeilen[0])
    if rolle is not None and x in (0, breite - 1) and breite > 2:
        # Randspalte: dieselbe Kachel wie das Band daneben, als Mitte (das Band läuft weiter).
        innen = klippenfeld(zeilen, 1 if x == 0 else breite - 2, y, grasboden, hoehe)
        if innen is not None:
            variante = "gras" if innen[0] in SPALTEN["gras"] else "erde"
            return (SPALTEN[variante][1], innen[1])
    links, mitte, rechts = SPALTEN[_variante(zeilen, x, y, grasboden)]
    if rolle is None:
        return None if _rand_neben_boden(zeilen, x, y) else _flaechenfeld(zeilen, x, y, grasboden)
    reihe = {"kante": REIHE_KANTE, "wand": REIHE_WAND, "fuss": REIHE_FUSS}[rolle]
    ende_links = _rolle(zeilen, x - 1, y, hoehe) != rolle or not _ist_wand(zeilen, x - 1, y)
    ende_rechts = _rolle(zeilen, x + 1, y, hoehe) != rolle or not _ist_wand(zeilen, x + 1, y)
    spalte = links if ende_links and not ende_rechts else rechts if ende_rechts and not ende_links else mitte
    return (spalte, reihe)


def _rand_neben_boden(zeilen: list[str], x: int, y: int) -> bool:
    """Kartenrand mit Boden daneben: kein Fels, sondern (mit „wandart“) der Boden selbst.

    Warum: Sonst umläuft eine Kante aus Hochfläche die ganze Karte wie ein Rahmen (Variantenwahl,
    Muster „Höhen als Grundriss“). Ohne „wandart“ zeichnet ``kartenbild`` dort die Wandkrone.
    """
    hoehe, breite = len(zeilen), len(zeilen[0])
    if 0 < x < breite - 1 and 0 < y < hoehe - 1:
        return False
    innen = [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    # Ecken: das nächste Innenfeld (diagonal) zählt mit.
    innen.append((min(max(x, 1), breite - 2), min(max(y, 1), hoehe - 2)))
    return any(0 < a < breite - 1 and 0 < b < hoehe - 1 and not _ist_wand(zeilen, a, b) for a, b in innen)


def _naechster_boden(zeilen: list[str], x: int, y: int) -> str:
    """Zeichen des nächsten Nicht-Wand-Felds geradeaus nach oben, links, rechts oder unten."""
    bester, zeichen = None, WAND
    for dx, dy in ((0, -1), (-1, 0), (1, 0), (0, 1)):
        a, b, schritte = x + dx, y + dy, 1
        while 0 <= a < len(zeilen[0]) and 0 <= b < len(zeilen) and zeilen[b][a] == WAND:
            a, b, schritte = a + dx, b + dy, schritte + 1
        if 0 <= a < len(zeilen[0]) and 0 <= b < len(zeilen) and (bester is None or schritte < bester):
            bester, zeichen = schritte, zeilen[b][a]
    return zeichen


def _flaechenfeld(zeilen: list[str], x: int, y: int, grasboden: set[str]) -> tuple[int, int]:
    """Obere Fläche ohne Kante darunter (dicker Rand, Hochfläche über einer Schlucht).

    Grenzt Boden oben an, ist das der Rand der Hochfläche mit gewellter Linie (Reihe 42), so
    sieht man die Südkante einer Schlucht; grenzt Boden links oder rechts an, die Randspalte.
    Gras oder Erde nach dem nächsten Boden in den vier Richtungen: Ein dicker Rand neben einer
    Wiese bleibt Wiese, statt als erdige Fläche wie ein Rahmen um die Karte zu laufen (Gutachten
    Steinbruchgrube, dritte Prüfung).
    """
    gras = WAND in grasboden or _naechster_boden(zeilen, x, y) in grasboden
    links, mitte, rechts = SPALTEN["gras" if gras else "erde"]
    boden_links = 0 < x and not _ist_wand(zeilen, x - 1, y)
    boden_rechts = x + 1 < len(zeilen[0]) and not _ist_wand(zeilen, x + 1, y)
    spalte = (
        links if boden_links and not boden_rechts else rechts if boden_rechts and not boden_links else mitte
    )
    reihe = REIHE_RAND if 0 < y and not _ist_wand(zeilen, x, y - 1) else REIHE_OBEN
    return (spalte, reihe)


def treppenfeld(zeilen: list[str], x: int, y: int, strasse: set[str] | None = None) -> tuple[int, int] | None:
    """Treppenkachel für ein Bodenfeld, das eine Kante durchschneidet (Rampe), sonst None.

    Ein Feld gilt als Rampe in der Kante, wenn links und rechts in derselben Reihe (höchstens
    ``BREITE_RAMPE`` Felder entfernt) eine Kantenreihe liegt; so bleibt das Ende eines Bands frei.
    Oben, Mitte und unten richten sich nach der Rolle dieser Nachbarn.
    Beispiel: Rampe von drei Feldern durch ein Band → Treppe oben, Mitte, unten.
    Sonderfall: Straßen (Zeichen in ``strasse``, etwa Asphalt) bekommen keine Treppe.
    """
    if _ist_wand(zeilen, x, y) or zeilen[y][x] in (strasse or set()):
        return None
    # Nur echte Rampen: Boden darüber und darunter. Eine Einbuchtung der Kante ist keine Treppe
    # (Gutachten Steinbruchgrube, dritte Prüfung: Tritte ohne Weg auf der Kantenkrone).
    if _ist_wand(zeilen, x, y - 1) or _ist_wand(zeilen, x, y + 1) or y == 0 or y + 1 >= len(zeilen):
        return None
    links = next((r for d in range(1, BREITE_RAMPE + 1) if (r := _rolle_wand(zeilen, x - d, y))), None)
    rechts = next((r for d in range(1, BREITE_RAMPE + 1) if (r := _rolle_wand(zeilen, x + d, y))), None)
    if links is None or rechts is None:
        return None
    return TREPPE[{"kante": "oben", "wand": "mitte", "fuss": "unten"}[links]]


def treppenfelder(zeilen: list[str], strasse: set[str]) -> list[tuple[int, int, tuple[int, int]]]:
    """Alle Treppenfelder einer Szene als (x, y, Kachel) für ``kartenbild``; siehe ``treppenfeld``."""
    return [
        (x, y, feld)
        for y in range(len(zeilen))
        for x in range(len(zeilen[0]))
        if (feld := treppenfeld(zeilen, x, y, strasse)) is not None
    ]


def _rolle_wand(zeilen: list[str], x: int, y: int) -> str | None:
    """Rolle eines Wandfelds in einer Kante; None für Boden oder Wand ohne Kante."""
    return _rolle(zeilen, x, y) if _ist_wand(zeilen, x, y) else None


def grasboden(szene: dict) -> set[str]:
    """Die Rasterzeichen, die in der Szene Gras sind (Grundboden „.“ oder Sonderböden).

    Mit „hochflaeche“: „gras“ zählt auch die Wand selbst als Gras: Dicke Ränder und Kanten ohne
    Boden darüber zeigen dann Wiese statt Erde (Steinbruchgrube: Wiese rings um die Grube).
    """
    zeichen = {z for z, art in szene.get("boeden", {}).items() if art == "gras"}
    zeichen |= {WAND} if szene.get("hochflaeche") == "gras" else set()
    return zeichen | ({"."} if szene.get("boden") == "gras" else set())


def klippenbogen(szene: dict, privat: Path) -> str:
    """Bogen der Klippenkacheln: „klippeRot“ für roten Fels (Szene „fels“: „rot“), „klippeGras“ für
    einen Grashang (Szene „fels“: „gras“, Deich), sonst „gelaende“.

    Warum: Canyon, Sternwarte und Wüste liegen auf rotem Sandstein; ``klippe_rot.png`` (Bildwunsch
    ``docs/spiel/auftraege/bildwuensche/klippe_rot.py``) hat die Erdklippe an derselben Kachellage rot
    umgefärbt. Fehlt die Datei noch im privaten Repository, bleibt die braune Klippe.
    """
    if szene.get("fels") == "rot" and (privat / ROTE_KLIPPE).exists():
        return "klippeRot"
    if szene.get("fels") == "gras" and (privat / GRAS_KLIPPE).exists():
        return "klippeGras"
    return "gelaende"


def strassenzeichen(szene: dict) -> set[str]:
    """Rasterzeichen für befahrene Beläge, auf die keine Treppe gehört (Asphalt, Pflaster)."""
    zeichen = {z for z, art in szene.get("boeden", {}).items() if art in ("asphalt", "pflaster")}
    return zeichen | ({"."} if szene.get("boden") in ("asphalt", "pflaster") else set())
