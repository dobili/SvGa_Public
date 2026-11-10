"""Kachelwahl für Böden im Raster einer Karte (ohne Pillow, deshalb testbar).

Warum: kartenbild.py braucht Pillow für die Bilder, die Tests der Pipeline laufen ohne. Die Wahl, welches
Rand- oder Eckstück ein Boden an einer Stelle bekommt, ist reine Rasterlogik und liegt deshalb hier.
"""

from pipeline.abenteuer.kartenbau import LEER, WAND, WASSER

# Längste Überquerung, die das Wasser darunter weiterlaufen lässt (Brücke, Gleis auf einer Brücke).
BRUECKE_MAX = 4
# Böden aus Holz, die über Wasser eine Brücke sind (wie HOLZ in zusammenhang.py).
HOLZ_BOEDEN = frozenset({"dielen", "holzDunkel", "holzHell"})


def ueberbrueckt(
    zeilen: list[str], x: int, y: int, dx: int, dy: int, bruecken: frozenset[str] = frozenset()
) -> bool:
    """Ob vom Wasserfeld (x, y) in Richtung (dx, dy) eine Brücke liegt, hinter der wieder Wasser kommt.

    Warum: Eine Brücke ist im Raster ein begehbarer Boden („h“) quer über dem Bach. Ohne diese Prüfung
    bekäme das Wasser an jeder Brücke ein Ufer, und der Bach sähe aus wie eine Kette von Teichen
    (Bildprüfung Cedar Creek, 9.11.2026).
    Eingaben: Raster, Wasserfeld, Richtung zum Nachbarn, ``bruecken``: Zeichen, die eine Brücke sein
    dürfen (Holzböden der Szene, siehe ``brueckenzeichen``). Ausgabe: True, wenn nach höchstens
    BRUECKE_MAX Feldern desselben Brückenzeichens wieder Wasser folgt.
    Beispiel: Spalte „~hh~“ mit „h“ = Dielen von oben nach unten: Das obere Wasser läuft unter der
    Brücke weiter.
    Sonderfälle: Nur Brückenzeichen zählen. Vorher galt jeder Boden außer Gras als Brücke, und
    Sinter, Erde, Sand oder Pflaster zwischen zwei Wassern nahmen dem Ufer seine Innenecken
    (Geysirbecken, Riverton, Seeufer; Hinweis des Haupt-Chats, 10.11.2026). Ein Steg, der im Wasser
    endet, hat kein Wasser dahinter und bekommt deshalb weiter sein Ufer.
    """
    hoehe, breite = len(zeilen), len(zeilen[0])
    nx, ny = x + dx, y + dy
    if not (0 <= nx < breite and 0 <= ny < hoehe):
        return False
    bruecke = zeilen[ny][nx]
    # Gras ist nie eine Brücke: Sonst verlor ein Bach, der um eine Spalte versetzt weiterläuft,
    # seine Uferecken (Park, Bildprüfung 9.11.2026). Dasselbe gilt für jeden anderen Nicht-Holzboden.
    if bruecke not in bruecken:
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


# Nachbarn, an denen ein Weg oder Belag seinen Grasrand zeigt: Gras („.“), Hecke oder Wand, Wasser,
# Leere. An anderen Belägen (Pflaster, Sand, Brücke) läuft er ohne Naht weiter (KARTENREGELN 10.3).
TRENNT = {".", WAND, WASSER, LEER}
# Innenecken im Bogen von LimeZu: rechts neben dem 3×3-Block, je nach der abweichenden Diagonale.
INNENECKEN = {(1, 1): (3, 0), (-1, 1): (4, 0), (1, -1): (3, 1), (-1, -1): (4, 1)}
# Schrägkacheln (Raute rechts neben den Innenecken, Rand +5/+6): Außenecke (Spalte, Reihe im
# 3×3-Block) → (Versatz der Schrägkachel, die zwei Felder, über die eine Treppe weiterläuft).
# Beispiel: Ecke links unten (0, 2), Gras links unten → Schräge (5, 3), Treppe über (+1, +1)/(−1, −1).
SCHRAEGEN = {
    (0, 0): ((5, 0), ((1, -1), (-1, 1))),
    (2, 0): ((6, 0), ((-1, -1), (1, 1))),
    (0, 2): ((5, 3), ((1, 1), (-1, -1))),
    (2, 2): ((6, 3), ((-1, 1), (1, -1))),
}


def wirksames_zeichen(zeilen: list[str], x: int, y: int) -> str:
    """Das Zeichen, das an (x, y) gezeichnet wird: Randwand außen zeigt das Feld dahinter."""
    if zeilen[y][x] == WAND and (innen := randnachbar(zeilen, x, y)) is not None:
        return zeilen[innen[1]][innen[0]]
    return zeilen[y][x]


def brueckenzeichen(szene: dict) -> frozenset[str]:
    """Zeichen, die als Brücke über Wasser gelten: Holzböden der Szene (Dielen, Steg, Bohlen).

    Warum: Brücken sind im Raster ein Holzboden quer über dem Bach; Felder aus „bruecken“ sind
    in ``kartenbild`` schon Wasser. Beispiel: Pelikaninsel „b“ = holzDunkel → {"b"}.
    """
    return frozenset(z for z, art in szene.get("boeden", {}).items() if art in HOLZ_BOEDEN)


def gleicher_boden(
    zeilen: list[str], x: int, y: int, dx: int, dy: int, bruecken: frozenset[str] = frozenset()
) -> bool:
    """Ob der Boden an (x, y) in Richtung (dx, dy) ohne Rand weiterläuft.

    Warum: Der Autor sah Wege ohne Rand am Kartenrand, Grasnähte zwischen Trampelpfad und Gehweg
    und Bäche, die an jeder Brücke endeten (Rückmeldung zu Runde 4, KARTENREGELN 10.1 bis 10.3).
    Sonderfälle: Außerhalb der Karte läuft alles weiter; Wasser läuft nur in Wasser und unter
    Brücken weiter; andere Böden laufen in jeden Belag außer Gras, Wand, Wasser und Leere.
    """
    zeichen = zeilen[y][x]
    nx, ny = x + dx, y + dy
    if not (0 <= ny < len(zeilen) and 0 <= nx < len(zeilen[0])):
        return True
    nachbar = wirksames_zeichen(zeilen, nx, ny)
    if zeichen == WASSER:
        return nachbar == WASSER or ueberbrueckt(zeilen, x, y, dx, dy, bruecken)
    return nachbar == zeichen or nachbar not in TRENNT


def bodenfeld(
    art: dict, zeilen: list[str], x: int, y: int, bruecken: frozenset[str] = frozenset()
) -> list[int]:
    """Die Kachel eines Bodens an (x, y): mit „rand“ Rand-, Eck- oder Innenecken-Stück je nach
    Nachbarn (3×3-Block von LimeZu und die vier Innenecken rechts daneben), mit „unter_wand“ direkt
    unter einer Wand die Schattenkachel, mit „varianten“ eine feste Zufallsauswahl, sonst „feld“.

    Beispiel: ein Feldweg „e“ quer durchs Gras bekommt oben und unten Grasränder, in der Mitte Erde;
    ein Ufer in Stufen bekommt an jeder inneren Stufe eine Innenecke statt einer Kerbe.
    """
    if "rand" in art:

        def gleich(dx: int, dy: int) -> bool:
            return gleicher_boden(zeilen, x, y, dx, dy, bruecken)

        spalte = 1 if gleich(-1, 0) == gleich(1, 0) else 0 if not gleich(-1, 0) else 2
        reihe = 1 if gleich(0, -1) == gleich(0, 1) else 0 if not gleich(0, -1) else 2
        if all(gleich(dx, dy) for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1))):
            for (dx, dy), (sx, sy) in INNENECKEN.items():
                if not gleich(dx, dy):
                    return [art["rand"][0] + sx, art["rand"][1] + sy]
        # Wege in Bögen statt Stufen (Gutachter 10.11.2026): Läuft die Kante über eine Ecke
        # diagonal weiter, nimmt die Ecke die Schrägkachel statt der runden Ecke.
        if art.get("diagonalen") and (spalte, reihe) in SCHRAEGEN:
            versatz, weiter = SCHRAEGEN[(spalte, reihe)]
            if any(gleich(dx, dy) for dx, dy in weiter):
                return [art["rand"][0] + versatz[0], art["rand"][1] + versatz[1]]
        return [art["rand"][0] + spalte, art["rand"][1] + reihe]
    if "unter_wand" in art and y > 0 and zeilen[y - 1][x] == WAND:
        # Böden des Room Builders: Die erste Reihe eines Blocks trägt den Schatten der Wand. Nur
        # direkt unter einer Wand gezeichnet; auf der ganzen Fläche wiederholt wirkt sie gebändert
        # und verwaschen (Gutachten Runde 8, Punkt e: Dielen im Gasthaus, Fliesen im Diner).
        return art["unter_wand"]
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
