"""Markierungen auf Straßen: Mittellinie und Randlinien (Szene ``"markierung": ["s"]``, Runde 9).

Warum: Die Variantenwahl fand auf fast allen Karten „Asphalt ohne Markierung“ (Muster 3), das
Prüfregelwerk verlangt Markierungen (KARTENPRUEFUNG, Straßen). LimeZus Straßenkacheln mit Linien
passen nicht in jede Breite; deshalb zeichnet ``kartenbild`` die Linien selbst über den Belag.
Rolle im Gesamtbild: reine Zeichenhilfe für ``kartenbild.main``; nur die in ``markierung``
genannten Rasterzeichen sind Fahrbahn. Parkplätze und Höfe bekommen ein eigenes Zeichen ohne
Markierung.

Parkbuchten (Szene ``"buchten": {"b": 4}``): Auf Plätzen aus diesem Zeichen trennt alle vier Reihen
eine weiße Linie die Buchten (Variantenwahl Mangel 3). ``"buchten_laengs": {"b": 4}`` zieht die Linien
von Nord nach Süd, alle vier Spalten: für Fahrzeuge von vorn oder hinten (Fernfahrerplatz am Diner
und Rastplatz der Bergstraße mit den Lastwagen aus Gemini, 10.11.2026; KARTENREGELN 10.65).

Runde Kehren (Szene ``"kehren": "rund"``, kehren.py): Fahrbahnecken werden im Bild zum Viertelbogen,
Rand- und Mittellinie folgen dem Bogen.

Regeln (Straßen wie in Nordamerika, Schauplatz der Geschichte):
- Fahrbahnen von 2 bis 4 Feldern Breite bekommen eine gelbe, gestrichelte Mittellinie;
- an beiden Rändern eine durchgehende weiße Randlinie, ein halbes Pixel-Paar vom Rand entfernt.
"""

from PIL import Image, ImageDraw

from pipeline.abenteuer.kehren import Kehre, bogenlinien, runde

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


def _linien(bild: Image.Image, zeilen: list[str], zeichen: set[str], kehren: tuple[Kehre, ...] = ()) -> None:
    """Zeichnet Mittel- und Randlinien auf alle Fahrbahnen aus ``zeichen`` (Bild in Pixeln K je Feld).

    Beispiel: Old Mother Road, drei Reihen „s“ von Rand zu Rand → gelbe Striche in Reihe 1,5,
    weiße Linien an Ober- und Unterkante.
    Sonderfall: Kreuzungen (quer und längs Fahrbahn) bekommen keine Linie. In den Quadraten runder
    Kehren (``kehren``, kehren.py) zeichnet ``bogenlinien`` die Linien als Bogen.
    """
    z = ImageDraw.Draw(bild)
    rund = set().union(*(k.felder() for k in kehren))
    # Mittellinie je gerades Fahrbahnfeld: (x, y) → Pixel der Linie quer zur Fahrtrichtung.
    mitten: dict[bool, dict[tuple[int, int], float]] = {True: {}, False: {}}
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
            for i in range(anfang, anfang + laenge):
                mitten[senkrecht][(a, i) if senkrecht else (i, a)] = mitte
            for p in range(a * K, (a + 1) * K):
                linien = [(oben, WEISS), (unten, WEISS)]
                if p % (STRICH + LUECKE) < STRICH:
                    linien += [(mitte - 1, GELB), (mitte, GELB)]
                for q, farbe in linien:
                    punkt = (p, int(q)) if senkrecht else (int(q), p)
                    if (punkt[0] // K, punkt[1] // K) not in rund:
                        z.point(punkt, fill=farbe)
    if kehren:
        bogenlinien(bild, kehren, RAND, WEISS, GELB)
    else:
        _kehren(z, zeilen, zeichen, mitten)


def _kehren(z: ImageDraw.ImageDraw, zeilen: list[str], zeichen: set[str], mitten: dict) -> None:
    """Mittellinie durch Kehren: In jedem Eckstück (Fahrbahn ohne gerade Linie) läuft die gelbe Linie
    vom waagerechten Ast zur Mitte und weiter zum senkrechten Ast, durchgezogen.

    Warum: Sonst hört die Mittellinie an jeder Kehre auf (Gutachten Bergstraße, Runde 9).
    Sonderfall: Eckstücke mit mehr als einem Ast je Richtung (Kreuzung, Einmündung) bleiben frei.
    """
    waag, senk = mitten[True], mitten[False]
    ecken = {
        (x, y)
        for y, zeile in enumerate(zeilen)
        for x, feld in enumerate(zeile)
        if feld in zeichen and (x, y) not in waag and (x, y) not in senk
    }
    while ecken:
        stapel, stueck = [ecken.pop()], set()
        while stapel:
            x, y = stapel.pop()
            stueck.add((x, y))
            for n in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if n in ecken:
                    ecken.discard(n)
                    stapel.append(n)
        # Anschlüsse: gerade Felder links/rechts (waagerechter Ast) und oben/unten (senkrechter Ast).
        seiten = {(n[0] > x, waag[n]) for x, y in stueck for n in ((x - 1, y), (x + 1, y)) if n in waag}
        enden = {(n[1] > y, senk[n]) for x, y in stueck for n in ((x, y - 1), (x, y + 1)) if n in senk}
        if len(seiten) != 1 or len(enden) != 1 or len(stueck) > max(SPUREN) ** 2:
            continue
        (rechts, my), (unten, mx) = next(iter(seiten)), next(iter(enden))
        xs, ys = [x for x, _ in stueck], [y for _, y in stueck]
        rand_x = (max(xs) + 1) * K if rechts else min(xs) * K
        rand_y = (max(ys) + 1) * K if unten else min(ys) * K
        z.line((rand_x, my - 1, mx, my - 1, mx, rand_y), fill=GELB, width=2)


def _buchten(bild: Image.Image, zeilen: list[str], buchten: dict[str, int]) -> None:
    """Weiße Trennlinien auf Plätzen: alle ``abstand`` Reihen ab der Oberkante des Platzes."""
    z = ImageDraw.Draw(bild)
    for zeichen, abstand in buchten.items():
        for x, anfang, laenge in _laeufe(zeilen, {zeichen}, True):
            for y in range(anfang + abstand, anfang + laenge, abstand):
                z.line((x * K, y * K, (x + 1) * K - 1, y * K), fill=WEISS)


def _buchten_laengs(bild: Image.Image, zeilen: list[str], buchten: dict[str, int]) -> None:
    """Weiße Trennlinien von Nord nach Süd: alle ``abstand`` Spalten ab der linken Kante des Platzes.

    Beispiel: Fernfahrerplatz, 32 Felder breit, Abstand 4 → sieben Linien, acht Buchten für
    Sattelzüge von vorn oder hinten (3 Felder breit).
    """
    z = ImageDraw.Draw(bild)
    for zeichen, abstand in buchten.items():
        for y, anfang, laenge in _laeufe(zeilen, {zeichen}, False):
            for x in range(anfang + abstand, anfang + laenge, abstand):
                z.line((x * K, y * K, x * K, (y + 1) * K - 1), fill=WEISS)


def _randlinien(bild: Image.Image, zeilen: list[str], zeichen: set[str], offen: set[str]) -> None:
    """Weiße Randlinie um Buchten aus ``zeichen`` (Szene „randlinie“): an jeder Seite, an der die
    Bucht endet, außer zur Fahrbahn hin (``offen``), wo man ein- und ausfährt.

    Warum: Die Haltebucht des Schulbusses lag als Pflaster im Pflaster des Hofs und war nicht als
    Bucht zu erkennen (Gutachten Schule, Runde 9).
    """
    z = ImageDraw.Draw(bild)
    for y, zeile in enumerate(zeilen):
        for x, feld in enumerate(zeile):
            if feld not in zeichen:
                continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                a, b = x + dx, y + dy
                nachbar = zeilen[b][a] if 0 <= b < len(zeilen) and 0 <= a < len(zeile) else None
                if nachbar in zeichen or nachbar in offen:
                    continue
                x0, y0 = (
                    x * K + (K - RAND if dx > 0 else RAND - 1 if dx < 0 else 0),
                    y * K + (K - RAND if dy > 0 else RAND - 1 if dy < 0 else 0),
                )
                ende = (x0, y0 + K - 1) if dx else (x0 + K - 1, y0)
                z.line((x0, y0, *ende), fill=WEISS)


def markiere(bild: Image.Image, zeilen: list[str], szene: dict) -> None:
    """Alle Markierungen einer Szene: Linien auf Fahrbahnen (``markierung``), Parkbuchten
    (``buchten``, ``buchten_laengs``), Randlinien um Haltebuchten (``randlinie``).

    Ohne die beiden Schlüssel bleibt das Bild unverändert.
    """
    fahrbahn = set(szene.get("markierung", []))
    kehren = runde(bild, zeilen, fahrbahn) if szene.get("kehren") == "rund" else []
    _linien(bild, zeilen, fahrbahn, tuple(kehren))
    _buchten(bild, zeilen, szene.get("buchten", {}))
    _buchten_laengs(bild, zeilen, szene.get("buchten_laengs", {}))
    _randlinien(bild, zeilen, set(szene.get("randlinie", [])), set(szene.get("markierung", [])))
