"""Kachelwahl für Böden im Raster einer Karte (ohne Pillow, deshalb testbar).

Warum: kartenbild.py braucht Pillow für die Bilder, die Tests der Pipeline laufen ohne. Die Wahl, welches
Rand- oder Eckstück ein Boden an einer Stelle bekommt, ist reine Rasterlogik und liegt deshalb hier.
"""

from pipeline.abenteuer.kartenbau import LEER, WAND, WASSER

# Böden aus Holz (wie HOLZ in zusammenhang.py): Brücken, Stege und Dielen. Zu ihnen hat Wasser kein Ufer.
HOLZ_BOEDEN = frozenset({"dielen", "holzDunkel", "holzHell"})


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
    Eingaben: Raster, Feld, Richtung zum Nachbarn, ``bruecken``: Zeichen der Holzböden der Szene
    (``brueckenzeichen``). Ausgabe: True, wenn an dieser Seite kein Rand gezeichnet wird.
    Beispiel: Spalte „~hh~“ mit „h“ = Dielen: Das Wasser läuft unter der Brücke weiter; ein Erdweg
    „e“ neben „~“ läuft bis ans Wasser, das Ufer zeichnet das Wasser.
    Sonderfälle: Außerhalb der Karte läuft alles weiter. Wasser läuft in Wasser und unter jedes
    Holz weiter (Brücke, Steg, Dielen am Ufer): Vorher bekam ein Steg, der im Wasser endet, ein
    Grasufer mit grüner Kappe (Kartenblick 24.11.2026, M03). Gras, Sand oder Pflaster zwischen zwei
    Wassern sind nie Brücke. Andere Böden laufen in jeden Belag und ins Wasser weiter, nicht in
    Gras, Wand und Leere: Am Wasser zeichnet nur das Wasser den Rand (uferart.py), sonst lägen
    zwei Grasstreifen zwischen Weg und Wasser.
    """
    zeichen = zeilen[y][x]
    nx, ny = x + dx, y + dy
    if not (0 <= ny < len(zeilen) and 0 <= nx < len(zeilen[0])):
        return True
    nachbar = wirksames_zeichen(zeilen, nx, ny)
    if zeichen == WASSER:
        return nachbar == WASSER or nachbar in bruecken
    return nachbar == zeichen or nachbar == WASSER or nachbar not in TRENNT


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


def eckzusaetze(
    rand: list[int], zeilen: list[str], x: int, y: int, bruecken: frozenset[str] = frozenset()
) -> list[tuple[list[int], tuple[int, int]]]:
    """Innenecken, die zusätzlich zur Kachel aus ``bodenfeld`` in ihr Viertel gehören.

    Warum: Eine Kachel von LimeZu zeigt höchstens eine Innenecke. Läuft ein Wasserarm schräg weiter
    (Land oben links und unten rechts), blieb die zweite Ecke ein Wasserquadrat ohne Rand
    (Kartenblick 24.11.2026, M03; Canyonrand (65, 25)). Der Zeichner legt deshalb für jede
    Diagonale mit Land, deren beide Seiten daneben frei sind, das Viertel der passenden
    Innenecken-Kachel darüber.
    Eingaben: linke obere Ecke des 3×3-Blocks, Raster, Feld, Brückenzeichen. Ausgabe: Liste
    (Kachel im Bogen, Richtung der Diagonale); das Viertel liegt in dieser Richtung.
    Beispiel: Wasser ringsum, Land nur bei (−1, −1) und (1, 1) → zwei Einträge.
    Sonderfall: Liegt an einer der beiden Seiten selbst Land, zeigt die Rand- oder Eckkachel dort
    schon ihren Rand; dann kein Zusatz.
    """
    zusatz = []
    for (dx, dy), (sx, sy) in INNENECKEN.items():
        seiten_frei = gleicher_boden(zeilen, x, y, dx, 0, bruecken) and gleicher_boden(
            zeilen, x, y, 0, dy, bruecken
        )
        if seiten_frei and not gleicher_boden(zeilen, x, y, dx, dy, bruecken):
            zusatz.append(([rand[0] + sx, rand[1] + sy], (dx, dy)))
    return zusatz


def uferfelder(
    boeden: dict, ufer: str, zeilen: list[str], x: int, y: int, bruecken: frozenset[str] = frozenset()
) -> tuple[list[int], list[int]]:
    """Die Kachel eines Wasserfelds zweimal: im gewöhnlichen Wasserbogen und im Bogen des Ufers.

    Warum: Szenen mit eigenem Ufer (Szene „ufer“: „rot“ → Bodenart „wasser_rot“, KARTENREGELN 10.6)
    wählen die Kachel wie gewöhnliches Wasser und zeichnen sie aus dem eigenen Bogen an derselben
    Lage im Block; die Randspur rechnet weiter mit dem gewöhnlichen Wasser. Die Wahl liegt hier,
    damit Wasserfelder und Randfelder davor dieselbe Rechnung benutzen.
    Eingaben: Böden aus materialien.json, Bodenart des Ufers („wasser“ oder „wasser_<ufer>“), Raster
    (Brückenfelder schon als Wasser), Feld, Brückenzeichen. Ausgabe: (Feld im Bogen „wasser“, Feld
    im Bogen des Ufers); ohne eigenes Ufer sind beide gleich.
    Beispiel: Canyonrand, Ufer „wasser_rot“ mit „rand“ [0, 0]: Mittelstück [1, 36] → [1, 1].
    Sonderfall: Mit „diagonalen“ wählt das Ufer Schrägkacheln (Buchten), auch wenn „wasser“ keine hat.
    """
    art = boeden[ufer]
    wasser = boeden["wasser"] | {"diagonalen": art.get("diagonalen")}
    feld = bodenfeld(wasser, zeilen, x, y, bruecken)
    eigen = [art["rand"][i] + feld[i] - boeden["wasser"]["rand"][i] for i in (0, 1)]
    return feld, eigen


def randkachel(
    boeden: dict,
    ufer: str,
    sichten: tuple[list[str], list[str]],
    innen: tuple[int, int],
    bodenart: str,
    bruecken: frozenset[str] = frozenset(),
) -> tuple[str, str, list[int], list[int]]:
    """Was ein Wandfeld am Kartenrand zeigt: den Boden des Felds ``innen`` dahinter.

    Warum: Liegt hinter dem Rand Wasser, zeichnete der Rand es aus dem gewöhnlichen Wasserbogen mit
    grünem Grasufer, auch wenn die Szene ein eigenes Ufer hat; im Canyon standen so zwei Grasstücke
    am Bildrand, wo der Fluss die Karte verlässt (Durchsicht 17.11.2026).
    Eingaben: Böden, Bodenart des Ufers, ``sichten`` = (Raster mit Brücken als Wasser, rohes Raster),
    das Feld dahinter, dessen Bodenart ohne Wasser (Sonderboden oder Grundboden), Brückenzeichen.
    Ausgabe: (Bodenart für die Randspur, Bodenart des gezeichneten Bogens, Feld für die Randspur,
    gezeichnetes Feld).
    Beispiel: Canyonrand, Randfeld (133, 29) vor Wasser (133, 28) → („wasser“, „wasser_rot“, linkes
    Randstück im Wasserbogen, linkes Randstück im roten Bogen).
    Sonderfall: Zum Kartenrand hin gibt es nie ein Ufer (der Fluss läuft aus dem Bild), weil das
    Randfeld für seinen Nachbarn als Wasser zählt (``wirksames_zeichen``).
    """
    zeilen, roh = sichten
    if zeilen[innen[1]][innen[0]] == WASSER:
        return ("wasser", ufer, *uferfelder(boeden, ufer, zeilen, *innen, bruecken))
    feld = bodenfeld(boeden[bodenart], roh, *innen, bruecken)
    return (bodenart, bodenart, feld, feld)


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


def randergaenzt(zeilen: list[str], aussen: bool = True) -> list[str]:
    """Das Raster, wie es draußen gezeichnet wird: Wandfelder am Kartenrand tragen den Boden ihres
    Nachbarn nach innen (``randnachbar``).

    Warum: Der Hintergrund zeichnet eine Straße bis in die Randspalte, die Linien (strasse.py) sahen
    dort aber nur „#“ und endeten eine Spalte vor dem Rand (Rückmeldung des Autors R082, R118:
    „Die Straßenmarkierung geht wieder nicht bis zum Rand“).
    Eingaben: Raster (gleich lange Zeilen), ``aussen`` (nur Außenkarten mit ``wandart`` zeichnen den
    Rand so; Innenräume bekommen das Raster unverändert zurück). Ausgabe: neues Raster.
    Beispiel: Kanalweg, Reihe 40 „#sss…“ → „ssss…“; eine Hecke am Rand („##“) bleibt Wand.
    """
    if not aussen:
        return zeilen
    neu = [list(zeile) for zeile in zeilen]
    for y, zeile in enumerate(zeilen):
        for x, zeichen in enumerate(zeile):
            if zeichen == WAND and (innen := randnachbar(zeilen, x, y)) is not None:
                neu[y][x] = zeilen[innen[1]][innen[0]]
    return ["".join(zeile) for zeile in neu]


def randsichten(roh: list[str], sonder: dict[str, str], grund: str, boeden: dict) -> dict[str, list[str]]:
    """Je Boden mit ``rand_gegen`` das Raster, wie dieser Boden es für seinen Rand sieht.

    Warum: Ränder entstehen sonst nur zum Grundboden „.“ (TRENNT). Ein Erdweg, der aus der Wiese in
    roten Sand läuft, braucht dort aber auch einen Rand, sonst wird jede Biegung eine Kachelstufe
    (Gutachten Canyonrand, 11.11.2026). Ein Boden nennt mit ``rand_gegen`` die Bodenarten, an denen
    er seinen Rand zeigt; ihre Felder gelten für ihn als Grundboden.
    Eingaben: Raster, Sonderböden der Szene (Zeichen → Bodenart), Grundboden, Böden aus
    materialien.json. Ausgabe: Bodenart → Raster; Böden ohne ``rand_gegen`` fehlen (sie sehen das
    Raster unverändert).
    Beispiel: „erdeRot“ mit ``rand_gegen`` [„sandRot“] in einer Szene mit „s“: „sandRot“ → alle
    „s“ werden für diesen Boden zu „.“.
    """
    sichten = {}
    for name in {grund, *sonder.values()}:
        gegen = set(boeden.get(name, {}).get("rand_gegen", []))
        zeichen = {z for z, art in sonder.items() if art in gegen}
        if zeichen:
            sichten[name] = ["".join("." if z in zeichen else z for z in zeile) for zeile in roh]
    return sichten
