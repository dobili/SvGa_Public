"""Kachelwahl für Böden im Raster einer Karte (ohne Pillow, deshalb testbar).

Warum: kartenbild.py braucht Pillow für die Bilder, die Tests der Pipeline laufen ohne. Die Wahl, welches
Rand- oder Eckstück ein Boden an einer Stelle bekommt, ist reine Rasterlogik und liegt deshalb hier.
"""

from pipeline.abenteuer.kartenbau import LEER, WAND, WASSER

# Längste Überquerung, die das Wasser darunter weiterlaufen lässt (Brücke, Gleis auf einer Brücke).
BRUECKE_MAX = 4


def ueberbrueckt(zeilen: list[str], x: int, y: int, dx: int, dy: int) -> bool:
    """Ob vom Wasserfeld (x, y) in Richtung (dx, dy) eine Brücke liegt, hinter der wieder Wasser kommt.

    Warum: Eine Brücke ist im Raster ein begehbarer Boden („h“) quer über dem Bach. Ohne diese Prüfung
    bekäme das Wasser an jeder Brücke ein Ufer, und der Bach sähe aus wie eine Kette von Teichen
    (Bildprüfung Cedar Creek, 9.11.2026).
    Eingaben: Raster, Wasserfeld, Richtung zum Nachbarn. Ausgabe: True, wenn nach höchstens
    BRUECKE_MAX Feldern desselben begehbaren Zeichens wieder Wasser (oder der Kartenrand hinter
    Wasser) folgt.
    Beispiel: Spalte „~hh~“ von oben nach unten: Das obere Wasser läuft unter der Brücke weiter.
    Sonderfälle: Wand, Leere und Wasser selbst sind keine Brücke; ein Steg, der im Wasser endet,
    hat kein Wasser dahinter und bekommt deshalb weiter sein Ufer.
    """
    hoehe, breite = len(zeilen), len(zeilen[0])
    nx, ny = x + dx, y + dy
    if not (0 <= nx < breite and 0 <= ny < hoehe):
        return False
    bruecke = zeilen[ny][nx]
    if bruecke in (WASSER, WAND, LEER):
        return False
    for schritt in range(1, BRUECKE_MAX + 1):
        nx, ny = x + dx * schritt, y + dy * schritt
        if not (0 <= nx < breite and 0 <= ny < hoehe):
            return False
        if zeilen[ny][nx] == WASSER:
            return True
        if zeilen[ny][nx] != bruecke:
            return False
    return False


def bodenfeld(art: dict, zeilen: list[str], x: int, y: int) -> list[int]:
    """Die Kachel eines Bodens an (x, y): mit „rand“ Rand- oder Eckstück je nach Nachbarn gleicher
    Art (3×3-Block von LimeZu), mit „varianten“ eine feste Zufallsauswahl, sonst „feld“.

    Beispiel: ein Feldweg „e“ quer durchs Gras bekommt oben und unten Grasränder, in der Mitte Erde.
    """
    if "rand" in art:
        zeichen = zeilen[y][x]

        def gleich(dx: int, dy: int) -> bool:
            nx, ny = x + dx, y + dy
            if not (0 <= ny < len(zeilen) and 0 <= nx < len(zeilen[0])):
                return True  # Am Kartenrand läuft der Boden weiter.
            am_rand = nx in (0, len(zeilen[0]) - 1) or ny in (0, len(zeilen) - 1)
            if am_rand and zeilen[ny][nx] == WAND:
                return True  # Randwand außen ist nur Kollision; der Boden läuft darunter weiter.
            if zeichen == WASSER and ueberbrueckt(zeilen, x, y, dx, dy):
                return True  # Unter Brücke und Gleis fließt das Wasser weiter, kein Ufer.
            return zeilen[ny][nx] == zeichen

        spalte = 1 if gleich(-1, 0) == gleich(1, 0) else 0 if not gleich(-1, 0) else 2
        reihe = 1 if gleich(0, -1) == gleich(0, 1) else 0 if not gleich(0, -1) else 2
        return [art["rand"][0] + spalte, art["rand"][1] + reihe]
    if "varianten" in art:
        # Fest je Ort (kein echter Zufall), damit das Bild bei jedem Bau gleich bleibt.
        return art["varianten"][(x * 7349 + y * 1931 + x * y * 13) % len(art["varianten"])]
    return art["feld"]


def randnachbar(zeilen: list[str], x: int, y: int) -> tuple[int, int] | None:
    """Für ein Wandfeld am Kartenrand das nächste Feld nach innen, das kein Wand- oder Leerfeld
    ist; sonst None (dann bleibt es Wand, etwa eine Hecke, die bis an den Rand reicht)."""
    hoehe, breite = len(zeilen), len(zeilen[0])
    if 0 < x < breite - 1 and 0 < y < hoehe - 1:
        return None
    dx = 1 if x == 0 else -1 if x == breite - 1 else 0
    dy = 1 if y == 0 else -1 if y == hoehe - 1 else 0
    nx, ny = x + dx, y + dy
    if 0 <= nx < breite and 0 <= ny < hoehe and zeilen[ny][nx] not in (WAND, LEER):
        return (nx, ny)
    return None
