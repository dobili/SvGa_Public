"""Runde Kehren: Fahrbahnecken als Viertelbogen statt als Stufe (Szene ``"kehren": "rund"``).

Warum: Gutachten Bergstraße („fast reif“, 10.11.2026): Die Kehren der Passstraße waren rechte Winkel
mit abgeschnittener Ecke; eine Bergstraße fährt aber im Bogen. LimeZus Asphalt hat keine runden
Randkacheln, und Kacheln mit durchsichtigen Ecken bräuchten je Zone (Sand, Erde, Gras) den passenden
Boden darunter. Deshalb rundet dieses Modul die Ecke im fertigen Bodenbild, Pixel für Pixel.

Rolle im Gesamtbild: ``strasse.markiere`` ruft ``runde`` vor den Linien auf und zeichnet danach mit
``bogenlinien`` Rand- und Mittellinie als Bogen. Das Raster der Szene bleibt, wie es ist (Felder
bleiben begehbar); nur das Bild ändert sich. ``kehrenbefunde`` prüft für den Kartenbau, dass jede
Fahrbahnecke der Szene auch wirklich gerundet werden kann.

Geometrie einer Kehre: Ein waagerechter und ein senkrechter Ast gleicher Breite B treffen sich.
Am inneren Eckpunkt I liegt der Mittelpunkt M des Bogens ein Feld weiter innen (Innenradius ein
Feld). Die Fahrbahn ist der Viertelring um M zwischen Innenradius und Innenradius + B; außerhalb
des Rings zeigt das Quadrat der Kehre (B + 1 Felder Kantenlänge) den Boden der Umgebung.
"""

from typing import NamedTuple

K = 16
# Breiten einer Fahrbahn in Feldern, die als Straße gelten (wie strasse.SPUREN).
SPUREN = range(2, 5)
# Innenradius des Bogens in Feldern.
INNEN = 1
# Halbe Breite der weißen Randlinie und der gelben Mittellinie in Pixeln (1 und 2 Pixel breit).
HALB_RAND, HALB_MITTE = 0.55, 1.0


class Kehre(NamedTuple):
    """Eine Fahrbahnecke: innerer Eckpunkt (Gitterpunkt in Feldern), Richtung zum waagerechten Ast
    (``sx``: +1 rechts, −1 links) und zum senkrechten Ast (``sy``: +1 unten, −1 oben), Breite in
    Feldern."""

    ix: int
    iy: int
    sx: int
    sy: int
    breite: int

    def mitte(self) -> tuple[int, int]:
        """Mittelpunkt des Bogens in Pixeln."""
        return (self.ix + self.sx * INNEN) * K, (self.iy + self.sy * INNEN) * K

    def felder(self) -> set[tuple[int, int]]:
        """Die Felder des Quadrats der Kehre (hier zeichnet ``strasse`` keine geraden Linien)."""
        kante = self.breite + INNEN
        x0 = self.ix + INNEN - kante if self.sx > 0 else self.ix - INNEN
        y0 = self.iy + INNEN - kante if self.sy > 0 else self.iy - INNEN
        return {(x, y) for x in range(x0, x0 + kante) for y in range(y0, y0 + kante)}


def _bahn(zeilen: list[str], zeichen: set[str], x: int, y: int) -> bool:
    return 0 <= y < len(zeilen) and 0 <= x < len(zeilen[0]) and zeilen[y][x] in zeichen


def _streifen(anfang: int, breite: int, richtung: int) -> range:
    """Die Felder eines Asts quer zur Fahrt: vom Eckpunkt weg, der Kehre gegenüber."""
    return range(anfang - breite, anfang) if richtung > 0 else range(anfang, anfang + breite)


def _ist_kehre(zeilen: list[str], zeichen: set[str], k: Kehre) -> bool:
    """Ob am Gitterpunkt zwei Äste der Breite ``k.breite`` im rechten Winkel enden."""
    reihen, spalten = _streifen(k.iy, k.breite, k.sy), _streifen(k.ix, k.breite, k.sx)
    # Erste gerade Spalte des waagerechten und erste gerade Reihe des senkrechten Asts.
    spalte = k.ix + INNEN if k.sx > 0 else k.ix - INNEN - 1
    reihe = k.iy + INNEN if k.sy > 0 else k.iy - INNEN - 1
    aeste = (
        all(_bahn(zeilen, zeichen, spalte, y) for y in reihen)
        and not _bahn(zeilen, zeichen, spalte, reihen.start - 1)
        and not _bahn(zeilen, zeichen, spalte, reihen.stop)
        and all(_bahn(zeilen, zeichen, x, reihe) for x in spalten)
        and not _bahn(zeilen, zeichen, spalten.start - 1, reihe)
        and not _bahn(zeilen, zeichen, spalten.stop, reihe)
    )
    # Hinter der Außenecke geht keine Fahrbahn weiter (sonst Einmündung oder Kreuzung).
    aussen_x = spalten.start - 1 if k.sx > 0 else spalten.stop
    aussen_y = reihen.start - 1 if k.sy > 0 else reihen.stop
    return (
        aeste
        and not any(_bahn(zeilen, zeichen, aussen_x, y) for y in reihen)
        and not any(_bahn(zeilen, zeichen, x, aussen_y) for x in spalten)
    )


def finde_kehren(zeilen: list[str], zeichen: set[str]) -> list[Kehre]:
    """Alle Fahrbahnecken im Raster, die sich runden lassen.

    Eingaben: Raster und die Zeichen der Fahrbahn (Szene ``markierung``). Ausgabe: Kehren, geordnet
    nach Lage. Beispiel: Bergstraße, Reihen 94–96 nach rechts und Spalten 3–5 nach unten → Kehre am
    Gitterpunkt (6, 97) mit ``sx`` = +1, ``sy`` = +1, Breite 3.
    Sonderfälle: Äste ungleicher Breite, Einmündungen und Kreuzungen sind keine Kehren. Ob die Ecke
    im Raster eckig ist oder schon abgeschnitten (Außenfeld fehlt, Innenfeld gefüllt), ist gleich.
    """
    kehren = []
    for iy in range(len(zeilen) + 1):
        for ix in range(len(zeilen[0]) + 1):
            for sx, sy in ((1, 1), (1, -1), (-1, 1), (-1, -1)):
                for breite in SPUREN:
                    kehre = Kehre(ix, iy, sx, sy, breite)
                    if _ist_kehre(zeilen, zeichen, kehre):
                        kehren.append(kehre)
    return kehren


def kehrenbefunde(szene: dict, zeilen: list[str]) -> list[str]:
    """Befunde für den Kartenbau: Fahrbahnfelder, die weder gerade Strecke noch runde Kehre sind.

    Warum: Mit ``"kehren": "rund"`` zeichnet das Bild nur Viertelbögen zwischen Ästen gleicher
    Breite. Eine Ecke mit ungleichen Ästen oder eine Stufe in der Fahrbahn bliebe eckig stehen, ohne
    dass es jemand merkt. Geprüft wird nur mit diesem Schlüssel; gerade ist ein Feld, wenn die
    Fahrbahn dort quer oder längs 2 bis 4 Felder breit ist.
    Beispiel: Ast von 3 Feldern trifft auf Ast von 2 Feldern → Befund mit dem Eckfeld.
    """
    if szene.get("kehren") != "rund":
        return []
    zeichen = set(szene.get("markierung", []))
    in_kehre = set().union(*(k.felder() for k in finde_kehren(zeilen, zeichen)))
    befunde = []
    for y, zeile in enumerate(zeilen):
        for x, feld in enumerate(zeile):
            if feld not in zeichen or (x, y) in in_kehre:
                continue
            quer = 1 + sum(_lauf(zeilen, zeichen, x, y, d, 0) for d in (1, -1))
            hoch = 1 + sum(_lauf(zeilen, zeichen, x, y, 0, d) for d in (1, -1))
            if quer not in SPUREN and hoch not in SPUREN:
                befunde.append(f"Fahrbahn bei ({x}, {y}) ist weder gerade noch eine runde Kehre")
    return befunde


def _lauf(zeilen: list[str], zeichen: set[str], x: int, y: int, dx: int, dy: int) -> int:
    """Wie viele Fahrbahnfelder von (x, y) aus in Richtung (dx, dy) folgen."""
    n = 0
    while _bahn(zeilen, zeichen, x + (n + 1) * dx, y + (n + 1) * dy):
        n += 1
    return n


def _abstand(k: Kehre, px: int, py: int) -> float:
    """Abstand der Pixelmitte vom Mittelpunkt des Bogens."""
    mx, my = k.mitte()
    return ((px + 0.5 - mx) ** 2 + (py + 0.5 - my) ** 2) ** 0.5


def _probefeld(zeilen: list[str], zeichen: set[str], felder: list[tuple[int, int]], bahn: bool):
    """Das erste Feld der Liste, das Fahrbahn ist (``bahn``) oder begehbarer Boden daneben."""
    for x, y in felder:
        if not (0 <= y < len(zeilen) and 0 <= x < len(zeilen[0])):
            continue
        if (zeilen[y][x] in zeichen) == bahn and (bahn or zeilen[y][x] not in "# "):
            return x, y
    return None


def runde(bild, zeilen: list[str], zeichen: set[str]) -> list[Kehre]:
    """Rundet alle Kehren im Bodenbild (K Pixel je Feld) und gibt sie zurück.

    Im Quadrat jeder Kehre wird jedes Pixel neu entschieden: im Viertelring Asphalt, sonst der
    Boden der Umgebung. Die Farbe kommt aus einem Nachbarfeld an derselben Stelle der Kachel
    (Böden kacheln nahtlos): Asphalt aus dem ersten geraden Feld des waagerechten Asts, Boden
    außen aus dem Feld schräg hinter der Außenecke, Boden innen aus dem Feld am Mittelpunkt.
    Eingabe ``bild``: Pillow-Bild (nur ``getpixel``/``putpixel``). Sonderfall: Fehlt ein Probefeld
    (Kehre am Kartenrand, Wand ringsum), bleibt das Pixel, wie es ist.
    """
    kehren = finde_kehren(zeilen, zeichen)
    for k in kehren:
        felder = sorted(k.felder())
        (x0, y0), (x1, y1) = felder[0], felder[-1]
        ecke_x, ecke_y = (x0 if k.sx > 0 else x1), (y0 if k.sy > 0 else y1)
        mitte_x, mitte_y = (x1 + 1 if k.sx > 0 else x0 - 1), (y1 + 1 if k.sy > 0 else y0 - 1)
        asphalt = _probefeld(zeilen, zeichen, [(mitte_x, ecke_y), (ecke_x, mitte_y)], True)
        aussen = _probefeld(
            zeilen,
            zeichen,
            [(ecke_x - k.sx, ecke_y - k.sy), (ecke_x - k.sx, ecke_y), (ecke_x, ecke_y - k.sy)],
            False,
        )
        innen = _probefeld(zeilen, zeichen, [(mitte_x, mitte_y)], False) or aussen
        innenradius, aussenradius = INNEN * K, (INNEN + k.breite) * K
        for fx, fy in felder:
            ist_bahn = zeilen[fy][fx] in zeichen
            for py in range(fy * K, (fy + 1) * K):
                for px in range(fx * K, (fx + 1) * K):
                    d = _abstand(k, px, py)
                    soll_bahn = innenradius <= d < aussenradius
                    probe = asphalt if soll_bahn else innen if d < innenradius else aussen
                    if soll_bahn != ist_bahn and probe is not None:
                        quelle = (probe[0] * K + px % K, probe[1] * K + py % K)
                        bild.putpixel((px, py), bild.getpixel(quelle))
    return kehren


def bogenlinien(bild, kehren: list[Kehre], rand: int, weiss: tuple, gelb: tuple) -> None:
    """Zeichnet in jeder Kehre die weißen Randlinien und die gelbe Mittellinie als Bogen.

    ``rand``: Abstand der Randlinie von der Fahrbahnkante in Pixeln (wie auf der Geraden, damit
    die Bögen an die geraden Linien anschließen). Die Mittellinie ist in der Kehre durchgezogen
    (Überholverbot, wie auf Passstraßen üblich).
    """
    for k in kehren:
        innen, aussen = INNEN * K + rand + 0.5, (INNEN + k.breite) * K - rand - 0.5
        mitte = (INNEN + k.breite / 2) * K
        for fx, fy in k.felder():
            for py in range(fy * K, (fy + 1) * K):
                for px in range(fx * K, (fx + 1) * K):
                    d = _abstand(k, px, py)
                    if abs(d - innen) <= HALB_RAND or abs(d - aussen) <= HALB_RAND:
                        bild.putpixel((px, py), weiss)
                    elif abs(d - mitte) <= HALB_MITTE:
                        bild.putpixel((px, py), gelb)
