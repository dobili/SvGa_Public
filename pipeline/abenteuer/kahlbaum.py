"""Kahle Laubbäume für den Winter ohne Schnee (RO53.5, Kartenblick 24.11.2026).

Warum: Im Süden (Altstadt Silicon Bay, Pelikaninsel, Deich, Glasbrücke, Raststätte) ist Winter ohne
Schnee: fahles Gras, kahle Laubbäume, Nadelbäume bleiben. Die gekauften Pakete haben keine kahlen
Bäume. Darum wird die Krone eines Laubbaums entfernt und durch gezeichnete Äste in der Farbe des
Stamms ersetzt; ein lichter Schleier aus einzelnen Zweigpunkten hält den Umriss der Krone.

Dieselbe Regel steht in ``app/src/abenteuer/oberwelt/kahlbaum.ts`` (Änderungen gehören in beide; alle
Zahlen sind ganzzahlig oder in derselben Reihenfolge gerechnet, damit beide Pixel für Pixel gleich sind).

Ablauf (``kahl``):
1. Laub: grüne Pixel, bei Herbstbäumen (mehr warme als grüne Pixel) auch rote, orange, gelbe.
2. Holz: braune Pixel in der unteren Hälfte; ihr tiefster Punkt minus 3 ist der Fuß (darunter liegt
   der Schatten am Boden, er bleibt).
3. Krone: alles Deckende von der obersten Laubzeile bis zur untersten über dem Fuß, das Laub oder
   nicht Holz ist; im oberen Zwei-Drittel-Teil alles (der Stamm wird dort neu gezeichnet).
4. Die Krone wird durchsichtig bis auf den Schleier (jeder 13. Punkt nach festem Muster, halb durchsichtig).
5. Äste: der Stamm läuft bis ins obere Viertel der Krone, vier Äste zweigen ab, jeder zweimal weiter.
Beispiel: ``wg4Laubbaum`` (grüne runde Krone über braunem Stamm) → brauner Stamm mit Astwerk, Schatten
am Boden bleibt.
"""

import colorsys
import math

VOLL = 255
# Laub, Holz und Herbstfarben (Farbton H, Helligkeit L, Sättigung S nach colorsys.rgb_to_hls).
GRUEN = (0.17, 0.5)
GRUEN_SAETTIGUNG = 0.15
DUNKELGRUEN = (0.17, 0.6)  # dunkle Kronenränder: Farbton bis ins Blaugrün, kaum gesättigt
DUNKEL_SAETTIGUNG, DUNKEL_HELLIGKEIT = 0.05, 0.35
WARM_BIS, WARM_AB = 0.17, 0.9
WARM_SAETTIGUNG, WARM_HELLIGKEIT = 0.35, 0.3
BRAUN_BIS, BRAUN_AB = 0.13, 0.95
BRAUN_SAETTIGUNG, BRAUN_HELLIGKEIT = 0.12, 0.78
HOLZ_AB = 0.45  # Holz zählt erst in der unteren Bildhälfte
FUSS_ABSTAND = 3
RANDSCHATTEN = 0.28  # dunkle Kronenschatten auf dem Stamm direkt unter der Krone
RANDSCHATTEN_ZEILEN = 3
STAMMFARBE = (92, 70, 58)  # falls kein Holz zu sehen ist
SCHLEIER_ALPHA = 70
SCHLEIER_TEILER = 13
DICK_AB = 20  # ab dieser Kronenhöhe ist der Stamm in der unteren Kronenhälfte zwei Pixel breit
ASTRICHTUNGEN = (-0.7, 0.7, -0.4, 0.4)
AST_ABSTAND = (0.25, 0.2)  # erster Ast bei einem Viertel der Kronenhöhe, dann je ein Fünftel höher
AST_LAENGE = 0.45
ZWEIG_DREHUNG, ZWEIG_SPREIZUNG, ZWEIG_ZUSATZ = 0.9, 1.6, 0.5
AST_STUFEN = 2

Pixel = tuple[int, int, int, int]


def _runde(x: float) -> int:
    """Wie ``Math.round`` in JavaScript (,5 nach oben)."""
    return math.floor(x + 0.5)


def _hls(p: Pixel) -> tuple[float, float, float]:
    return colorsys.rgb_to_hls(p[0] / VOLL, p[1] / VOLL, p[2] / VOLL)


def ist_gruen(p: Pixel) -> bool:
    """Grünes Laub oder dunkler, blaugrüner Kronenrand."""
    h, hell, s = _hls(p)
    if GRUEN[0] < h < GRUEN[1] and s > GRUEN_SAETTIGUNG:
        return True
    return DUNKELGRUEN[0] < h < DUNKELGRUEN[1] and s > DUNKEL_SAETTIGUNG and hell < DUNKEL_HELLIGKEIT


def ist_warm(p: Pixel) -> bool:
    """Rotes, oranges oder gelbes Herbstlaub."""
    h, hell, s = _hls(p)
    return (h < WARM_BIS or h > WARM_AB) and s > WARM_SAETTIGUNG and hell > WARM_HELLIGKEIT


def ist_braun(p: Pixel) -> bool:
    """Holz: braun bis rotbraun, nicht zu hell."""
    h, hell, s = _hls(p)
    return (h < BRAUN_BIS or h > BRAUN_AB) and s > BRAUN_SAETTIGUNG and hell < BRAUN_HELLIGKEIT


def ist_herbstbaum(pixel: list[Pixel]) -> bool:
    """Mehr warme als grüne Pixel: Rot, Orange und Gelb sind dann Laub."""
    deckend = [p for p in pixel if p[3]]
    return sum(map(ist_warm, deckend)) > sum(map(ist_gruen, deckend))


def _krone(breite: int, hoehe: int, pixel: list[Pixel]) -> tuple[list[bool], list[int], tuple[int, int]]:
    """Kronenmaske, Holzpixel (Indizes) und (oberste, unterste) Kronenzeile; leere Maske ohne Laub."""
    herbst = ist_herbstbaum(pixel)

    def laub(p: Pixel) -> bool:
        return ist_gruen(p) or (herbst and ist_warm(p))

    holz = [i for i, p in enumerate(pixel) if p[3] and ist_braun(p) and i // breite > hoehe * HOLZ_AB]
    fuss = max((i // breite for i in holz), default=hoehe) - FUSS_ABSTAND
    zeilen = [i // breite for i, p in enumerate(pixel) if p[3] and i // breite < fuss and laub(p)]
    if not zeilen:
        return [], holz, (0, 0)
    oben, unten = min(zeilen), max(zeilen)
    voll_bis = unten - (unten - oben) // 3
    maske = [
        bool(p[3]) and i // breite <= unten and (laub(p) or not ist_braun(p) or i // breite < voll_bis)
        for i, p in enumerate(pixel)
    ]
    return maske, holz, (oben, unten)


def _stamm(breite: int, pixel: list[Pixel], holz: list[int], maske: list[bool]) -> tuple[int, tuple]:
    """Mitte des sichtbaren Stamms und seine Astfarbe (ein dunkles Holzpixel)."""
    stamm = [i for i in holz if not maske[i]]
    if not stamm:
        return breite // 2, STAMMFARBE
    xs = sorted(i % breite for i in stamm)
    dunkel = sorted(stamm, key=lambda i: sum(pixel[i][:3]))  # stabil: gleiche Summe nach Lage
    return xs[len(xs) // 2], pixel[dunkel[len(dunkel) // 4]][:3]


def _aeste(neu, maske, breite, hoehe, sx, farbe, oben, unten) -> None:
    """Stamm und Äste in die (leere) Krone zeichnen, nur innerhalb des alten Umrisses."""

    def setze(x: int, y: int) -> None:
        if 0 <= x < breite and 0 <= y < hoehe and maske[y * breite + x]:
            neu[y * breite + x] = (*farbe, VOLL)

    def ast(x: int, y: int, dx: float, laenge: int, stufe: int) -> None:
        fx = float(x)
        for t in range(laenge):
            fx += dx
            setze(_runde(fx), y - t)
            if stufe < AST_STUFEN and t in (laenge // 3, 2 * laenge // 3):
                if t == laenge // 3:
                    neu_dx = ZWEIG_DREHUNG if dx <= 0 else -ZWEIG_DREHUNG
                else:
                    neu_dx = dx * ZWEIG_SPREIZUNG + (ZWEIG_ZUSATZ if dx >= 0 else -ZWEIG_ZUSATZ)
                ast(_runde(fx), y - t, neu_dx, max(2, laenge // 2), stufe + 1)

    hoch = unten - oben
    for y in range(oben + hoch // 4, unten + 1):
        setze(sx, y)
        if hoch > DICK_AB and y > oben + hoch // 2:
            setze(sx + 1, y)
    for k, dx in enumerate(ASTRICHTUNGEN):
        y0 = unten - math.floor(hoch * (AST_ABSTAND[0] + AST_ABSTAND[1] * k))
        ast(sx, y0, dx, math.floor(hoch * AST_LAENGE), 0)


def kahl(breite: int, hoehe: int, pixel: list[Pixel]) -> list[Pixel]:
    """Ein Laubbaum ohne Laub (Ablauf im Dateikopf); ``pixel`` zeilenweise RGBA, Ergebnis ebenso.
    Ohne Laub (Stumpf, Pfahl) bleibt das Bild, wie es ist."""
    maske, holz, (oben, unten) = _krone(breite, hoehe, pixel)
    if not maske:
        return list(pixel)
    sx, farbe = _stamm(breite, pixel, holz, maske)
    neu = list(pixel)
    for i, drin in enumerate(maske):
        if drin:
            x, y = i % breite, i // breite
            schleier = (x * 7 + y * 11 + (x * y) % 5) % SCHLEIER_TEILER == 0
            neu[i] = (*farbe, SCHLEIER_ALPHA) if schleier else (0, 0, 0, 0)
    for y in range(unten + 1, min(hoehe, unten + 1 + RANDSCHATTEN_ZEILEN)):
        for x in range(breite):
            p = pixel[y * breite + x]
            if p[3] and _hls(p)[1] < RANDSCHATTEN:
                neu[y * breite + x] = (*farbe, VOLL)
    _aeste(neu, maske, breite, hoehe, sx, farbe, oben, unten)
    return neu
