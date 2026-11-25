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

Bänder (Kartenblick M02, 24.11.2026): Springt die Wand um eine Reihe vor oder zurück, ist das kein
Wandende. Randkacheln stehen nur noch, wo das Band wirklich aufhört (``klippenrolle.band_daneben``);
den Umriss am Versatz zeichnet ``klippenbild``. Gras oder Erde als Deckstreifen gilt für das ganze
Band (Mehrheit seiner Kantenfelder), statt mitten in der Wand zu wechseln.
"""

from collections.abc import Callable
from functools import lru_cache
from pathlib import Path

from pipeline.abenteuer.klippenrolle import (
    BREITE_RAMPE,
    HOEHE_STANDARD,
    RASTER_IM_SPEICHER,
    WAND,
    WASSER,
    band_daneben,
    bandnummern,
)
from pipeline.abenteuer.klippenrolle import ist_wand as _ist_wand
from pipeline.abenteuer.klippenrolle import rolle as _rolle

# Rot umgefärbte Erdklippe (Bogen „klippeRot“ in materialien.json), gleiche Kachellage.
ROTE_KLIPPE = "spiel/eigene/klippe_rot.png"
# Eigene rote Canyonwand (Gemini, Kartenblick Paket A, 26.11.2026; Bogen „klippeCanyon“): Lage wie
# ``klippe_rot.png``, Wandkacheln aus ``werkzeuge/gemini_canyonwand_2611.py`` im privaten Paket.
CANYON_KLIPPE = "spiel/eigene/klippe_canyon.png"
# Gezeichnete Grasböschung (Gemini k1, 26.11.2026; Bogen „klippeBoeschung“), Lage wie klippe_gras.png;
# ersetzt die von ``klippenarten`` selbst gezeichnete Böschung, sobald sie im Paket liegt.
BOESCHUNG_KLIPPE = "spiel/eigene/klippe_boeschung.png"
# Granitwand (Gemini K1, 26.11.2026; Bogen „klippeGranit“), Lage wie klippe_grau.png, für Szenen
# mit "fels": "granit" (Steinbruch); ohne Bild bleibt dort der graue Fels.
GRANIT_KLIPPE = "spiel/eigene/klippe_granit.png"
# Bögen, die eine selbst gezeichnete Wandart (klippenarten.gezeichnet) ersetzen.
GEZEICHNETE_ERSATZBOEGEN = frozenset({"klippeBoeschung"})
# Grün umgefärbte Erdklippe für Deiche (Bogen „klippeGras“, Bildwunsch klippe_gras.py, mittel-1).
GRAS_KLIPPE = "spiel/eigene/klippe_gras.png"
# Graue Felswand mit Moos für Wasserfälle (Bogen „klippeGrau“, Bildwunsch klippe_grau.py, 16.11.2026).
GRAUE_KLIPPE = "spiel/eigene/klippe_grau.png"
# Geländebogen (materialien.json „gelaende“): Spalte je Variante für links, Mitte, rechts.
SPALTEN = {"gras": (8, 9, 10), "erde": (14, 15, 16)}
REIHE_RAND, REIHE_KANTE, REIHE_WAND, REIHE_FUSS, REIHE_OBEN = 42, 44, 45, 46, 43
# In den Fels geschlagene Treppe, eine Kachel breit: oben mit Kappe, Mitte, unten mit Grasfuß.
TREPPE = {"oben": (25, 47), "mitte": (25, 46), "unten": (25, 48)}
# Rasterzeichen, Standardhöhe und Rampenbreite: siehe klippenrolle.py.


def _variante(zeilen: list[str], x: int, y: int, grasboden: set[str]) -> str:
    """Gras oder Erde, je nach dem Boden über der Kante (erste Nicht-Wand-Reihe darüber)."""
    oben = y - 1
    # Treppenfelder in der Wand zählen nicht als Boden darüber (schräger Weg durch die Kante).
    while oben >= 0 and (zeilen[oben][x] == WAND or treppenfeld(zeilen, x, oben) is not None):
        oben -= 1
    # Reicht die Wand bis an den oberen Rand (Seitenkante über dem Wandende), zählt der nächste Boden;
    # mit „hochflaeche“: „gras“ ist der Rand selbst die Wiese oben (Stadtpark: Felswand am Nordrand).
    if oben < 0 and WAND in grasboden:
        return "gras"
    zeichen = zeilen[oben][x] if oben >= 0 else _naechster_boden(zeilen, x, y)
    if zeichen in grasboden:
        return "gras"
    # Ein schmaler Weg über der Kante macht die Wiese nicht zur Erdfläche (R027, Zedernpfad: braune
    # Kacheln neben der Treppe): Liegt bis zu BREITE_RAMPE Felder daneben Gras, bleibt es Gras.
    nah = range(max(0, x - BREITE_RAMPE), min(len(zeilen[0]), x + BREITE_RAMPE + 1))
    return "gras" if oben >= 0 and any(zeilen[oben][a] in grasboden for a in nah) else "erde"


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
    if rolle is None:
        return None if _rand_neben_boden(zeilen, x, y) else _flaechenfeld(zeilen, x, y, grasboden)
    raster = tuple(zeilen)
    links, mitte, rechts = SPALTEN[bandvariante(raster, x, y, frozenset(grasboden), hoehe)]
    reihe = {"kante": REIHE_KANTE, "wand": REIHE_WAND, "fuss": REIHE_FUSS}[rolle]
    # Ende nur, wo das Band aufhört; ein Versatz um eine Reihe ist kein Ende (klippenrolle.py).
    ende_links = not band_daneben(raster, x, y, -1, hoehe)
    ende_rechts = not band_daneben(raster, x, y, 1, hoehe)
    spalte = links if ende_links and not ende_rechts else rechts if ende_rechts and not ende_links else mitte
    return (spalte, reihe)


@lru_cache(maxsize=RASTER_IM_SPEICHER)
def _bandvarianten(zeilen: tuple[str, ...], grasboden: frozenset[str], hoehe: int) -> dict[int, str]:
    """Je Band „gras“ oder „erde“: die Mehrheit seiner Kantenfelder (bei Gleichstand Gras)."""
    stimmen: dict[int, list[int]] = {}
    for (x, y), nummer in bandnummern(zeilen, hoehe).items():
        if _rolle(zeilen, x, y, hoehe) == "kante":
            gras = _variante(list(zeilen), x, y, set(grasboden)) == "gras"
            stimmen.setdefault(nummer, [0, 0])[0 if gras else 1] += 1
    return {nummer: "gras" if gras >= erde else "erde" for nummer, (gras, erde) in stimmen.items()}


def bandvariante(
    zeilen: tuple[str, ...], x: int, y: int, grasboden: frozenset[str], hoehe: int = HOEHE_STANDARD
) -> str:
    """Deckstreifen des Bands, zu dem (x, y) gehört: „gras“ oder „erde“.

    Warum: Je Feld gewählt, schaltete der Deckstreifen mitten in der Wand um (Steinbruchgrube:
    orange Stücke zwischen grünen). Eingaben: Raster als Tupel, Feld mit Rolle, Graszeichen, Höhe.
    Beispiel: Band unter einer Wiese, die ein vier Felder breiter Schotterplatz unterbricht → überall
    „gras“. Sonderfall: Feld ohne Band (Hochfläche) → Wahl nach dem Feld selbst.
    """
    nummer = bandnummern(zeilen, hoehe).get((x, y))
    varianten = _bandvarianten(zeilen, grasboden, hoehe)
    if nummer is None or nummer not in varianten:
        return _variante(list(zeilen), x, y, set(grasboden))
    return varianten[nummer]


def vorhandene_fassung(
    feld: tuple[int, int], vorhanden: Callable[[tuple[int, int]], object]
) -> tuple[int, int]:
    """Die Kachel ``feld``, oder dieselbe Stelle in der anderen Fassung, wenn der Bogen sie nicht hat.

    Warum: Der rote Klippenbogen (``klippe_rot.png``) hat nur die Erdfassung (Spalten 14–16); die
    Spalten der Grasfassung sind dort leer. Lag Gras neben einer roten Felswand, wählte
    ``_variante`` die Grasfassung, und die Wand blieb schwarz (Canyonrand, Spalten 58–65, Reihen
    17–21, Durchsicht 17.11.2026). Schwarze oder leere Kacheln darf es nie geben.
    Eingaben: Kachel aus ``klippenfeld``; ``vorhanden`` sagt je Kachel, ob der Bogen dort etwas
    zeichnet (``kartenbild`` prüft das Bild). Ausgabe: die Kachel, die gezeichnet wird.
    Beispiel: (9, 45), Grasfassung fehlt, Erdfassung vorhanden → (15, 45).
    Sonderfälle: Fehlen beide Fassungen oder ist die Kachel keine Klippenkachel (Treppe), bleibt
    ``feld`` unverändert.
    """
    if vorhanden(feld):
        return feld
    for name, spalten in SPALTEN.items():
        if feld[0] not in spalten:
            continue
        andere = next(s for n, s in SPALTEN.items() if n != name)
        ersatz = (andere[spalten.index(feld[0])], feld[1])
        return ersatz if vorhanden(ersatz) else feld
    return feld


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
    boden_links = 0 < x and _zeigt_boden(zeilen, x - 1, y)
    boden_rechts = x + 1 < len(zeilen[0]) and _zeigt_boden(zeilen, x + 1, y)
    spalte = (
        links if boden_links and not boden_rechts else rechts if boden_rechts and not boden_links else mitte
    )
    if boden_links and boden_rechts:
        # Seitenkante der Hochfläche (eine Spalte „#“ über einem Wandende, R028): Rand auf der
        # Seite, die tiefer liegt; die Hochfläche liegt dort, wohin die Wand darunter weiterläuft.
        spalte = {"links": rechts, "rechts": links}.get(hochseite(zeilen, x, y), mitte)
    reihe = REIHE_RAND if 0 < y and not _ist_wand(zeilen, x, y - 1) else REIHE_OBEN
    return (spalte, reihe)


def _zeigt_boden(zeilen: list[str], x: int, y: int) -> bool:
    """Ob das Feld als Boden erscheint: kein „#“ oder ein Kartenrand mit Boden dahinter.

    Warum: Die Seitenkante einer Felswand am Nordrand (Stadtpark, Wand biegt nach hinten ab) steht
    in der obersten Reihe neben einem Randfeld, das den Boden darunter zeigt; ohne diese Prüfung
    fehlte dort der Rand der Hochfläche.
    """
    return not _ist_wand(zeilen, x, y) or (y == 0 and _rand_neben_boden(zeilen, x, y))


def hochseite(zeilen: list[str], x: int, y: int) -> str | None:
    """Auf welcher Seite einer Seitenkante die Hochfläche liegt: „links“, „rechts“ oder None.

    Eine Seitenkante ist eine einzelne Spalte „#“ mit Boden links und rechts. Sie setzt das Ende
    einer Felswand fort; die Hochfläche liegt auf der Seite, auf der die Wand am Fuß der Spalte
    weiterläuft. Beispiel: Wand von Spalte 0 bis 17, darüber eine Spalte „#“ bei 17 bis zum
    Kartenrand → „links“ (links oben, rechts unten).
    Sonderfall: Spalte ohne Wand am Fuß (frei stehender Pfosten aus „#“) → None.
    """
    unten = y
    while (
        _ist_wand(zeilen, x, unten)
        and not _ist_wand(zeilen, x - 1, unten)
        and not _ist_wand(zeilen, x + 1, unten)
    ):
        unten += 1
    if not _ist_wand(zeilen, x, unten):
        return None
    links, rechts = _ist_wand(zeilen, x - 1, unten), _ist_wand(zeilen, x + 1, unten)
    return "links" if links and not rechts else "rechts" if rechts and not links else None


def treppenfeld(zeilen: list[str], x: int, y: int, strasse: set[str] | None = None) -> tuple[int, int] | None:
    """Treppenkachel für ein Bodenfeld, das eine Kante durchschneidet (Rampe), sonst None.

    Ein Feld gilt als Rampe in der Kante, wenn links und rechts in derselben Reihe (höchstens
    ``BREITE_RAMPE`` Felder entfernt) eine Kantenreihe liegt; so bleibt das Ende eines Bands frei.
    Oben, Mitte und unten richten sich nach der Rolle dieser Nachbarn.
    Beispiel: Rampe von drei Feldern durch ein Band → Treppe oben, Mitte, unten.
    Sonderfall: Straßen (Zeichen in ``strasse``, etwa Asphalt) bekommen keine Treppe.
    """
    # Wasser in einer Lücke der Wand ist ein Wasserfall, keine Treppe (Stadtpark, 16.11.2026).
    if _ist_wand(zeilen, x, y) or zeilen[y][x] in (strasse or set()) | {WASSER}:
        return None
    # Nur echte Rampen: Boden darüber und darunter. Eine Einbuchtung der Kante ist keine Treppe
    # (Gutachten Steinbruchgrube, dritte Prüfung: Tritte ohne Weg auf der Kantenkrone). Läuft der
    # Weg schräg durch die Wand, liegt der Boden darüber oder darunter ein Feld daneben (R027:
    # Auf dem Zedernpfad fehlten deshalb Treppenkacheln, der Erdweg schien durch).
    if y == 0 or y + 1 >= len(zeilen):
        return None
    for reihe in (y - 1, y + 1):
        if all(_ist_wand(zeilen, a, reihe) for a in (x - 1, x, x + 1)):
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


# Szene „fels“ → (Wandart, Farbe des Bogens, aus dem Hochfläche, Rand und Grasfuß kommen). Die
# Arten „boeschung“ und „stuetzmauer“ zeichnet ``klippenarten`` selbst.
WANDARTEN = {
    "gras": ("boeschung", "gras"),
    "boeschung": ("boeschung", "gras"),
    "stuetzmauer": ("stuetzmauer", "grau"),
}


def klippenart(szene: dict) -> str:
    """Die Wandart der Szene: „fels“, „boeschung“ (Deich, Damm) oder „stuetzmauer“ (Hafen, Stadt).

    Warum: Ein Deich ist kein Fels (Gutachten Deich: „Schokoladenriegel“). Die Szene nennt die Art
    mit ``"fels": "boeschung"`` oder ``"fels": "stuetzmauer"``; ``klippenarten`` zeichnet die
    Kacheln dafür selbst, bis eigene Bilder da sind. Beispiel: ``{"fels": "rot"}`` → „fels“.
    Sonderfall: Das ältere ``"fels": "gras"`` (Deich, Port Delacroix) meinte schon immer einen
    Grashang und ist jetzt die Böschung statt grün umgefärbtem Fels.
    """
    return WANDARTEN.get(szene.get("fels"), ("fels", None))[0]


def klippenbogen(szene: dict, privat: Path) -> str:
    """Bogen der Klippenkacheln: „klippeCanyon“ für die gezeichnete Canyonwand (Szene „fels“:
    „canyon“, sonst wie „rot“), „klippeBoeschung“ für die Grasböschung von Gemini (Deich, Damm),
    „klippeGranit“ (Gemini, Steinbruch),
    „klippeRot“ für roten Fels (Szene „fels“: „rot“), „klippeGras“ für
    einen Grashang (Szene „fels“: „gras“, Deich), „klippeGrau“ für grauen Fels mit Moos (Szene
    „fels“: „grau“, Wasserfall im Stadtpark), sonst „gelaende“.

    Warum: Canyon, Sternwarte und Wüste liegen auf rotem Sandstein; ``klippe_rot.png`` (Bildwunsch
    ``docs/spiel/auftraege/bildwuensche/klippe_rot.py``) hat die Erdklippe an derselben Kachellage rot
    umgefärbt. Fehlt die Datei noch im privaten Repository, bleibt die braune Klippe.
    """
    farbe = WANDARTEN.get(szene.get("fels"), (None, szene.get("fels")))[1]
    if farbe == "canyon" and (privat / CANYON_KLIPPE).exists():
        return "klippeCanyon"
    if klippenart(szene) == "boeschung" and (privat / BOESCHUNG_KLIPPE).exists():
        return "klippeBoeschung"
    if farbe == "granit" and (privat / GRANIT_KLIPPE).exists():
        return "klippeGranit"
    farbe = "grau" if farbe == "granit" else farbe  # ohne eigenes Bild bleibt der graue Fels
    farbe = "rot" if farbe == "canyon" else farbe  # ohne eigenes Bild bleibt die rote Klippe
    if farbe == "rot" and (privat / ROTE_KLIPPE).exists():
        return "klippeRot"
    if farbe == "gras" and (privat / GRAS_KLIPPE).exists():
        return "klippeGras"
    if farbe == "grau" and (privat / GRAUE_KLIPPE).exists():
        return "klippeGrau"
    return "gelaende"


# Befahrene Beläge (Pflaster mit Randstein und mit weichem Saum, materialien.json).
STRASSENBELAEGE = ("asphalt", "pflaster", "pflasterWeich")


def strassenzeichen(szene: dict) -> set[str]:
    """Rasterzeichen für befahrene Beläge, auf die keine Treppe gehört (Asphalt, Pflaster)."""
    zeichen = {z for z, art in szene.get("boeden", {}).items() if art in STRASSENBELAEGE}
    return zeichen | ({"."} if szene.get("boden") in STRASSENBELAEGE else set())
