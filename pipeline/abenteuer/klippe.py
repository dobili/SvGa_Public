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
"""

# Geländebogen (materialien.json „gelaende“): Spalte je Variante für links, Mitte, rechts.
SPALTEN = {"gras": (8, 9, 10), "erde": (14, 15, 16)}
REIHE_KANTE, REIHE_WAND, REIHE_FUSS, REIHE_OBEN = 44, 45, 46, 43
# In den Fels geschlagene Treppe, eine Kachel breit: oben mit Kappe, Mitte, unten mit Grasfuß.
TREPPE = {"oben": (25, 47), "mitte": (25, 46), "unten": (25, 48)}
WAND = "#"
# Breiteste Rampe, die als Treppe durch eine Kante gilt (Grube: vier Felder).
BREITE_RAMPE = 4


def _ist_wand(zeilen: list[str], x: int, y: int) -> bool:
    return 0 <= y < len(zeilen) and 0 <= x < len(zeilen[0]) and zeilen[y][x] == WAND


def _rolle(zeilen: list[str], x: int, y: int) -> str | None:
    """Welche Reihe der Kante (x, y) ist: „kante“, „wand“, „fuss“ oder None (keine Kante darunter)."""
    if not _ist_wand(zeilen, x, y):
        return None
    for abstand, rolle in ((1, "fuss"), (2, "wand"), (3, "kante")):
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


def klippenfeld(zeilen: list[str], x: int, y: int, grasboden: set[str]) -> tuple[int, int] | None:
    """Die Kachel des Geländebogens für das Wandfeld (x, y), oder None.

    Eingaben: Raster der Szene, Feld, die Rasterzeichen, die in der Szene Gras sind.
    Ausgabe: (Spalte, Reihe) im Geländebogen.
    Beispiel: Band aus drei Reihen „#“ zwischen Wiese oben und Schotter unten → oben Reihe 44,
    Mitte 45, unten 46; am linken Ende des Bands Spalte 8.
    Sonderfälle: Wandfelder ohne Boden darunter (dicke Ränder) zeigen die obere Fläche (Reihe 43).
    """
    if not _ist_wand(zeilen, x, y):
        return None
    rolle = _rolle(zeilen, x, y)
    links, mitte, rechts = SPALTEN[_variante(zeilen, x, y, grasboden)]
    if rolle is None:
        return (_flaechenvariante(zeilen, x, y, grasboden), REIHE_OBEN)
    reihe = {"kante": REIHE_KANTE, "wand": REIHE_WAND, "fuss": REIHE_FUSS}[rolle]
    ende_links = _rolle(zeilen, x - 1, y) != rolle or not _ist_wand(zeilen, x - 1, y)
    ende_rechts = _rolle(zeilen, x + 1, y) != rolle or not _ist_wand(zeilen, x + 1, y)
    spalte = links if ende_links and not ende_rechts else rechts if ende_rechts and not ende_links else mitte
    return (spalte, reihe)


def _flaechenvariante(zeilen: list[str], x: int, y: int, grasboden: set[str]) -> int:
    """Mittelspalte für eine Wandfläche ohne Kante (dicker Rand): Gras, wenn Gras daneben liegt."""
    nachbarn = [
        zeilen[b][a]
        for a, b in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
        if 0 <= b < len(zeilen) and 0 <= a < len(zeilen[0])
    ]
    return SPALTEN["gras" if any(n in grasboden for n in nachbarn) else "erde"][1]


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
    links = next((r for d in range(1, BREITE_RAMPE + 1) if (r := _rolle_wand(zeilen, x - d, y))), None)
    rechts = next((r for d in range(1, BREITE_RAMPE + 1) if (r := _rolle_wand(zeilen, x + d, y))), None)
    if links is None or rechts is None:
        return None
    return TREPPE[{"kante": "oben", "wand": "mitte", "fuss": "unten"}[links]]


def _rolle_wand(zeilen: list[str], x: int, y: int) -> str | None:
    """Rolle eines Wandfelds in einer Kante; None für Boden oder Wand ohne Kante."""
    return _rolle(zeilen, x, y) if _ist_wand(zeilen, x, y) else None


def grasboden(szene: dict) -> set[str]:
    """Die Rasterzeichen, die in der Szene Gras sind (Grundboden „.“ oder Sonderböden)."""
    zeichen = {z for z, art in szene.get("boeden", {}).items() if art == "gras"}
    return zeichen | ({"."} if szene.get("boden") == "gras" else set())


def strassenzeichen(szene: dict) -> set[str]:
    """Rasterzeichen für befahrene Beläge, auf die keine Treppe gehört (Asphalt, Pflaster)."""
    zeichen = {z for z, art in szene.get("boeden", {}).items() if art in ("asphalt", "pflaster")}
    return zeichen | ({"."} if szene.get("boden") in ("asphalt", "pflaster") else set())
