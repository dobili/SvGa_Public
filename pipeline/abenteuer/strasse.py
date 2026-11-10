"""Markierungen auf Straßen: Mittellinie und Randlinien (Szene ``"markierung": ["s"]``, Runde 9).

Warum: Die Variantenwahl fand auf fast allen Karten „Asphalt ohne Markierung“ (Muster 3), das
Prüfregelwerk verlangt Markierungen (KARTENPRUEFUNG, Straßen). LimeZus Straßenkacheln mit Linien
passen nicht in jede Breite; deshalb zeichnet ``kartenbild`` die Linien selbst über den Belag.
Rolle im Gesamtbild: reine Zeichenhilfe für ``kartenbild.main``; nur die in ``markierung``
genannten Rasterzeichen sind Fahrbahn. Parkplätze und Höfe bekommen ein eigenes Zeichen ohne
Markierung.

Parkbuchten (Szene ``"buchten": {"b": 4}``): Auf Plätzen aus diesem Zeichen trennt alle vier Reihen
eine weiße Linie die Buchten (Fernfahrerplatz am Diner, Variantenwahl Mangel 3).

Regeln (Straßen wie in Nordamerika, Schauplatz der Geschichte):
- Fahrbahnen von 2 bis 4 Feldern Breite bekommen eine gelbe, gestrichelte Mittellinie;
- an beiden Rändern eine durchgehende weiße Randlinie, ein halbes Pixel-Paar vom Rand entfernt.
"""

from PIL import Image, ImageDraw

K = 16
GELB, WEISS = (232, 196, 64, 255), (236, 236, 228, 255)
# Breite einer Fahrbahn in Feldern, die Linien bekommt; breiter ist ein Platz.
SPUREN = range(2, 5)
STRICH, LUECKE = 10, 6
RAND = 2


def _laeufe(zeilen: list[str], zeichen: set[str], senkrecht: bool) -> list[tuple[int, int, int]]:
    """Läufe von Fahrbahnfeldern quer zur Fahrtrichtung: (Spalte oder Reihe, Anfang, Länge)."""
    hoehe, breite = len(zeilen), len(zeilen[0])
    aussen, innen = (breite, hoehe) if senkrecht else (hoehe, breite)
    ergebnis = []
    for a in range(aussen):
        i = 0
        while i < innen:
            feld = zeilen[i][a] if senkrecht else zeilen[a][i]
            if feld not in zeichen:
                i += 1
                continue
            j = i
            while j < innen and (zeilen[j][a] if senkrecht else zeilen[a][j]) in zeichen:
                j += 1
            ergebnis.append((a, i, j - i))
            i = j
    return ergebnis


def _linien(bild: Image.Image, zeilen: list[str], zeichen: set[str]) -> None:
    """Zeichnet Mittel- und Randlinien auf alle Fahrbahnen aus ``zeichen`` (Bild in Pixeln K je Feld).

    Beispiel: Old Mother Road, drei Reihen „s“ von Rand zu Rand → gelbe Striche in Reihe 1,5,
    weiße Linien an Ober- und Unterkante.
    Sonderfall: Kreuzungen (quer und längs Fahrbahn) bekommen keine Linie.
    """
    z = ImageDraw.Draw(bild)
    # Waagerechte Straßen: senkrechte Läufe je Spalte; senkrechte Straßen: waagerechte Läufe je Reihe.
    for senkrecht in (True, False):
        quer = {
            (a, i)
            for a, anfang, n in _laeufe(zeilen, zeichen, not senkrecht)
            if n in SPUREN
            for i in range(anfang, anfang + n)
        }
        for a, anfang, laenge in _laeufe(zeilen, zeichen, senkrecht):
            if laenge not in SPUREN or any((i, a) in quer for i in range(anfang, anfang + laenge)):
                continue  # Platz oder Kreuzung
            mitte, oben, unten = (
                (anfang + laenge / 2) * K,
                anfang * K + RAND,
                (anfang + laenge) * K - RAND - 1,
            )
            for p in range(a * K, (a + 1) * K):
                linien = [(oben, WEISS), (unten, WEISS)]
                if p % (STRICH + LUECKE) < STRICH:
                    linien += [(mitte - 1, GELB), (mitte, GELB)]
                for q, farbe in linien:
                    z.point((p, int(q)) if senkrecht else (int(q), p), fill=farbe)


def _buchten(bild: Image.Image, zeilen: list[str], buchten: dict[str, int]) -> None:
    """Weiße Trennlinien auf Plätzen: alle ``abstand`` Reihen ab der Oberkante des Platzes."""
    z = ImageDraw.Draw(bild)
    for zeichen, abstand in buchten.items():
        for x, anfang, laenge in _laeufe(zeilen, {zeichen}, True):
            for y in range(anfang + abstand, anfang + laenge, abstand):
                z.line((x * K, y * K, (x + 1) * K - 1, y * K), fill=WEISS)


def markiere(bild: Image.Image, zeilen: list[str], szene: dict) -> None:
    """Alle Markierungen einer Szene: Linien auf Fahrbahnen (``markierung``), Parkbuchten (``buchten``).

    Ohne die beiden Schlüssel bleibt das Bild unverändert.
    """
    _linien(bild, zeilen, set(szene.get("markierung", [])))
    _buchten(bild, zeilen, szene.get("buchten", {}))
