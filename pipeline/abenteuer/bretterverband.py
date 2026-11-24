"""Bretterverband: Holzböden aus versetzten Brettern statt aus Kästchen (Kartenblick M01, 24.11.2026).

Warum: Die Holzkacheln von LimeZu tragen an ihrem Rand eine Fuge (Dielen: dunkle Brettenden,
helles Holz: helle Linie, dunkles Holz: helle Querlinie). Aneinandergelegt stehen diese Fugen in
jeder Reihe an derselben Stelle; der Raum sieht aus wie kariertes Papier. Echte Dielen liegen im
Verband: Die Stöße sind von Reihe zu Reihe versetzt.

Wie: Ein Nachlauf über den fertigen Hintergrund (aus ``bodenvariation.variiere``). Je Holzboden mit
``variation.verband`` in ``materialien.json``:
1. Entfugen: Die Fugenspalten jeder Kachel werden durch Spalten aus ihrem Kern ersetzt; das Holz
   läuft damit über die Kachelgrenze durch.
2. Verlegen: Je Brettreihe (über die ganze Karte, nicht je Kachel) werden Bretter zufälliger Länge
   gelegt. Ein Stoß liegt nie nah an einem Stoß der beiden Reihen darüber.
3. Jedes Brett bekommt einen leicht eigenen Ton, jeder Stoß eine dunkle Fuge.
Bretter, die von oben nach unten laufen (``richtung``: „laengs“), werden gespiegelt behandelt.

Angabe in ``materialien.json``: ``"verband": {"richtung": "quer", "brett": 4, "kern": [3, 11],
"laenge": [24, 56]}``; ``brett`` ist die Höhe einer Brettreihe mit ihrer Fuge in Pixeln, ``kern``
der Bereich der Kachel ohne Fuge (längs zum Brett), ``laenge`` die kürzeste und längste Brettlänge;
dazu wahlweise ``fuge``: um diesen Faktor dunkler ist der Stoß (sonst 0,74).
"""

import bisect
import hashlib
import random

from PIL import Image

K = 16
# Um diesen Faktor dunkler ist der Stoß zwischen zwei Brettern.
FUGE = 0.74
FUGE_ANGABE = "fuge"
# Eigene Töne der Bretter (Faktor auf die Farbe); die Mitte doppelt, damit die meisten ruhig bleiben.
TOENE = (0.965, 0.98, 1.0, 1.0, 1.015, 1.03)
# So viele Pixel Abstand hält ein Stoß zu den Stößen der zwei Reihen darüber.
STOSSABSTAND = 5
# Brettlängen und Anfänge liegen auf diesem Raster (ruhiger als beliebige Längen).
SCHRITT = 2
VOLL = 255
LAENGS = "laengs"

Feld = tuple[int, int]


def _zufall(*teile: object) -> random.Random:
    """Fester Zufall aus den Teilen (unabhängig von PYTHONHASHSEED)."""
    samen = hashlib.sha256(":".join(map(str, teile)).encode()).digest()
    return random.Random(int.from_bytes(samen[:8], "big"))


def stoesse(karte: str, name: str, reihen: int, breite: int, laenge: tuple[int, int]) -> list[list[int]]:
    """Die Stöße (x in Pixeln) je Brettreihe, von oben nach unten.

    Warum: Der Verband entsteht über die ganze Karte, damit er an keiner Kachelgrenze neu beginnt.
    Eingaben: Karte und Bodenname (Samen des Zufalls), Zahl der Reihen, Breite in Pixeln, kürzeste
    und längste Brettlänge. Ausgabe: je Reihe die aufsteigenden Stoßstellen.
    Beispiel: Kaffeehaus London, Dielen: Reihe 0 stößt bei 14, 52, 84 …, Reihe 1 bei 30, 66 …
    Sonderfall: Ein Stoß, der einem der zwei Reihen darüber zu nahe käme, rückt weiter.
    """
    kurz, lang = laenge
    alle: list[list[int]] = []
    for reihe in range(reihen):
        r = _zufall(karte, name, "reihe", reihe)
        gesperrt = [x for vorige in alle[-2:] for x in vorige]
        x, eigene = r.randrange(SCHRITT, lang, SCHRITT), []
        while x < breite:
            while any(abs(x - g) < STOSSABSTAND for g in gesperrt):
                x += SCHRITT
            eigene.append(x)
            x += r.randrange(kurz, lang + 1, SCHRITT)
        alle.append(eigene)
    return alle


def _entfuge(px, x0: int, y0: int, kern: tuple[int, int]) -> None:
    """Ersetzt in der Kachel bei (x0, y0) die Spalten außerhalb des Kerns durch Kernspalten."""
    anfang, ende = kern
    for dx in [d for d in range(K) if not anfang <= d <= ende]:
        # Gespiegelt am Kernrand: Die Ersatzspalte liegt nah, ihr Schatten (unter der Wand) passt.
        quelle = 2 * anfang - dx - 1 if dx < anfang else 2 * ende - dx + 1
        for dy in range(K):
            px[x0 + dx, y0 + dy] = px[x0 + quelle, y0 + dy]


def _toene(px, ort: Feld, verband: dict, fugen: list[list[int]], toene: list[list[float]]) -> None:
    """Färbt die Kachel am Feld ``ort`` brettweise und zieht die Stoßfugen (``fuge``: wie dunkel)."""
    x0, y0, brett = ort[0] * K, ort[1] * K, verband["brett"]
    fuge = verband.get(FUGE_ANGABE, FUGE)
    for dy in range(K):
        reihe = (y0 + dy) // brett
        for dx in range(K):
            x = x0 + dx
            stelle = bisect.bisect_right(fugen[reihe], x)
            faktor = toene[reihe][stelle]
            if stelle and fugen[reihe][stelle - 1] == x:
                faktor *= fuge
            r, g, b, a = px[x, y0 + dy]
            px[x, y0 + dy] = (
                min(VOLL, round(r * faktor)),
                min(VOLL, round(g * faktor)),
                min(VOLL, round(b * faktor)),
                a,
            )


def verlege(bild: Image.Image, felder: set[Feld], angabe: dict, karte: str, name: str) -> Image.Image:
    """Das Bild, in dem die Felder des Holzbodens ``name`` als Bretterverband liegen.

    Warum: siehe Dateikopf. Eingaben: fertiger Hintergrund, Felder des Bodens (Kachelkoordinaten),
    die Angabe ``verband`` aus materialien.json, Kennung der Karte. Ausgabe: neues Bild.
    Beispiel: Kaffeehaus London (12 × 13 Felder Dielen): keine senkrechten Linien im 16-Pixel-Takt
    mehr, sondern Bretter von 24 bis 56 Pixeln mit versetzten Stößen.
    Sonderfall: ``richtung`` „laengs“: Das Bild wird gespiegelt bearbeitet und zurückgespiegelt.
    """
    laengs = angabe.get("richtung") == LAENGS
    arbeit = bild.transpose(Image.Transpose.TRANSPOSE) if laengs else bild.copy()
    orte = sorted((y, x) if laengs else (x, y) for x, y in felder)
    brett = angabe["brett"]
    reihen = arbeit.height // brett + 1
    fugen = stoesse(karte, name, reihen, arbeit.width, tuple(angabe["laenge"]))
    toene = [
        [_zufall(karte, name, "ton", reihe, i).choice(TOENE) for i in range(len(fugen[reihe]) + 1)]
        for reihe in range(reihen)
    ]
    px = arbeit.load()
    for x, y in orte:
        _entfuge(px, x * K, y * K, tuple(angabe["kern"]))
    for x, y in orte:
        _toene(px, (x, y), angabe, fugen, toene)
    return arbeit.transpose(Image.Transpose.TRANSPOSE) if laengs else arbeit


def _helligkeit(px, x: int, y0: int, brett: int) -> int:
    """Summe der Farbkanäle der Spalte x über die Brettreihe ab y0."""
    return sum(sum(px[x, y][:3]) for y in range(y0, y0 + brett))


# Ab diesem Anteil dunkler als beide Nachbarspalten gilt eine Spalte als Stoßfuge (LimeZus Fugen
# der Dielen liegen bei 5 %, unsere bei 26 %, die Maserung darunter).
FUGENSCHWELLE = 0.045


def gemessene_stoesse(bild: Image.Image, felder: set[Feld], angabe: dict) -> dict[int, set[int]]:
    """Die am Bild gemessenen Stoßfugen eines Holzbodens: Brettreihe → Stellen längs zum Brett.

    Warum: Die Prüfung ``bodenflaeche`` soll am gezeichneten Hintergrund messen, nicht dem Verband
    glauben. Eine Stoßfuge ist eine Spalte, die über die ganze Brettreihe deutlich dunkler ist als
    ihre beiden Nachbarspalten. Eingaben: Hintergrund, Felder des Bodens, Angabe ``verband``.
    Beispiel: unbearbeitete Dielen: in jeder Reihe eine Fuge bei 15, 31, 47 … (das Kästchenmuster).
    Sonderfall: Spalten am Rand der Fläche (ohne Nachbarn im selben Boden) zählen nicht.
    """
    laengs = angabe.get("richtung") == LAENGS
    arbeit = bild.transpose(Image.Transpose.TRANSPOSE) if laengs else bild
    orte = {(y, x) if laengs else (x, y) for x, y in felder}
    brett, px = angabe["brett"], arbeit.load()
    gemessen: dict[int, set[int]] = {}
    for fx, fy in orte:
        for y0 in range(fy * K, (fy + 1) * K, brett):
            for x in range(fx * K, (fx + 1) * K):
                if ((x - 1) // K, fy) not in orte or ((x + 1) // K, fy) not in orte:
                    continue
                mitte = _helligkeit(px, x, y0, brett)
                grenze = min(_helligkeit(px, x - 1, y0, brett), _helligkeit(px, x + 1, y0, brett))
                if mitte < grenze * (1 - FUGENSCHWELLE):
                    gemessen.setdefault(y0 // brett, set()).add(x)
    return gemessen


def gestapelt(gemessen: dict[int, set[int]], hoehe: int = 3) -> list[tuple[int, int]]:
    """Stellen (Brettreihe, x), an denen ``hoehe`` Stoßfugen genau übereinander liegen.

    Beispiel: {0: {15}, 1: {15}, 2: {15, 40}} → [(0, 15)]; versetzte Stöße geben eine leere Liste.
    """
    return sorted(
        (reihe, x)
        for reihe, stellen in gemessen.items()
        for x in stellen
        if all(x in gemessen.get(reihe + i, ()) for i in range(1, hoehe))
    )
