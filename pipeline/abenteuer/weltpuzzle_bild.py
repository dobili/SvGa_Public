"""Übersichtsbild zum Weltpuzzle: alle Außenkarten an ihrer Lage, schematisch aus den Rastern.

Warum: Der Autor hat die Karten von Hand aneinandergelegt (R033, R034). Das Bild zeigt dasselbe
auf einen Blick: jede Insel als Block, jede Karte mit Rahmen und Namen, Böden in vier Farben
(Wasser, Straße, Weg, Natur), Überlappungen rot. Es braucht keine Grafik aus dem privaten
Repository, nur die Szenen.

Eingabe: Inseln und Nähte aus ``weltpuzzle.pruefe``. Ausgabe: ein ``PIL.Image``.
"""

from PIL import Image, ImageDraw

from pipeline.abenteuer.weltpuzzle import GESPERRT, NATUR, STRASSE, WASSER, WEG, Naht, bodenklasse, groesse

PIXEL = 3  # Pixel je Kachel
ABSTAND = 12  # Kacheln zwischen zwei Inseln
ZEILENBREITE = 900  # Kacheln, nach denen die nächste Reihe von Inseln beginnt
FARBEN = {
    WASSER: (70, 140, 200),
    STRASSE: (120, 120, 130),
    WEG: (190, 150, 100),
    NATUR: (120, 170, 100),
    GESPERRT: (60, 95, 70),
}
HINTERGRUND, RAHMEN, SCHRIFT, ROT, NAHT = (
    (245, 245, 240),
    (30, 30, 40),
    (20, 20, 20),
    (220, 40, 40),
    (250, 220, 60),
)


def _kartenbild(szene: dict) -> Image.Image:
    """Eine Karte als kleines Bild: ein Farbfeld je Kachel."""
    breite, hoehe = groesse(szene)
    bild = Image.new("RGB", (breite, hoehe))
    for y in range(hoehe):
        for x in range(breite):
            bild.putpixel((x, y), FARBEN[bodenklasse(szene, x, y)])
    return bild.resize((breite * PIXEL, hoehe * PIXEL), Image.Resampling.NEAREST)


def _rahmen(insel: dict[str, tuple[int, int]], aussen: dict[str, dict]) -> tuple[int, int, int, int]:
    """Umschließendes Rechteck einer Insel in Kacheln (x0, y0, x1, y1)."""
    x0 = min(x for x, _ in insel.values())
    y0 = min(y for _, y in insel.values())
    x1 = max(insel[k][0] + groesse(aussen[k])[0] for k in insel)
    y1 = max(insel[k][1] + groesse(aussen[k])[1] for k in insel)
    return x0, y0, x1, y1


def anordnung(inseln: list[dict], aussen: dict[str, dict]) -> tuple[list[tuple[int, int]], tuple[int, int]]:
    """Legt die Inseln in Reihen nebeneinander. Rückgabe: je Insel der Ursprung auf dem Blatt in
    Kacheln (so, dass Lage + Ursprung nie negativ ist) und die Größe des Blatts."""
    urspruenge, x, y, reihenhoehe, blattbreite = [], ABSTAND, ABSTAND, 0, 0
    for insel in inseln:
        x0, y0, x1, y1 = _rahmen(insel, aussen)
        if x > ABSTAND and x + (x1 - x0) > ZEILENBREITE:
            x, y, reihenhoehe = ABSTAND, y + reihenhoehe + ABSTAND, 0
        urspruenge.append((x - x0, y - y0))
        x += x1 - x0 + ABSTAND
        reihenhoehe = max(reihenhoehe, y1 - y0)
        blattbreite = max(blattbreite, x)
    return urspruenge, (blattbreite, y + reihenhoehe + ABSTAND)


def _ueberlappung(a: tuple, b: tuple) -> tuple | None:
    """Schnitt zweier Rechtecke (x0, y0, x1, y1) oder None."""
    x0, y0, x1, y1 = max(a[0], b[0]), max(a[1], b[1]), min(a[2], b[2]), min(a[3], b[3])
    return (x0, y0, x1, y1) if x0 < x1 and y0 < y1 else None


def zeichne(inseln: list[dict], aussen: dict[str, dict], naehte: list[Naht]) -> Image.Image:
    """Zeichnet alle Inseln auf ein Blatt: Karten, Rahmen, Namen, Nähte gelb, Überlappungen rot."""
    urspruenge, (breite, hoehe) = anordnung(inseln, aussen)
    blatt = Image.new("RGB", (breite * PIXEL, hoehe * PIXEL), HINTERGRUND)
    stift = ImageDraw.Draw(blatt, "RGBA")
    for insel, (ox, oy) in zip(inseln, urspruenge, strict=True):
        rechtecke = {}
        for karte, (x, y) in insel.items():
            b, h = groesse(aussen[karte])
            rechtecke[karte] = (
                (x + ox) * PIXEL,
                (y + oy) * PIXEL,
                (x + ox + b) * PIXEL,
                (y + oy + h) * PIXEL,
            )
            blatt.paste(_kartenbild(aussen[karte]), rechtecke[karte][:2])
        namen = sorted(rechtecke)
        for i, a in enumerate(namen):
            stift.rectangle(rechtecke[a], outline=RAHMEN)
            stift.text((rechtecke[a][0] + 3, rechtecke[a][1] + 2), a, fill=SCHRIFT)
            for b in namen[i + 1 :]:
                schnitt = _ueberlappung(rechtecke[a], rechtecke[b])
                if schnitt:
                    stift.rectangle(schnitt, fill=(*ROT, 120), outline=ROT)
        for n in naehte:
            if n.von in insel and n.nach in insel and n.von < n.nach:
                _nahtmarke(stift, rechtecke[n.von], rechtecke[n.nach])
    return blatt


def _nahtmarke(stift: ImageDraw.ImageDraw, a: tuple, b: tuple) -> None:
    """Gelbe Linie zwischen den Mitten zweier verbundener Karten."""
    mitte = lambda r: ((r[0] + r[2]) // 2, (r[1] + r[3]) // 2)  # noqa: E731
    stift.line((*mitte(a), *mitte(b)), fill=NAHT, width=2)
