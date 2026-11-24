"""Rollen, Stapel und Bänder einer Felskante: die Geometrie hinter ``klippe.py`` (Kartenblick M02).

Warum: Die Kachelwahl sah bisher nur das einzelne Feld und seine zwei Nachbarn. Sprang die Wand um
eine Reihe vor oder zurück, hielt sie das für ein Wandende und setzte dort eine Randkachel mit
dunklem Umriss: Aus einer Felswand wurde eine Reihe einzelner Klötze („gerade Zickzackbänder“,
Gutachten Zedernpfad und Steinbruch, 24.11.2026). Der Deckstreifen (Gras oder Erde) wechselte
außerdem je Feld. Beides braucht den Blick auf das ganze Band.

Begriffe:
- Rolle: welche Reihe der Kante ein Wandfeld ist („kante“ oben, „wand“, „fuss“ unten).
- Stapel: die Felder mit Rolle in einer Spalte, von der Kante bis zum Fuß.
- Band: Stapel benachbarter Spalten, die sich berühren (auch um Reihen versetzt). Ein Band ist eine
  Felswand, wie der Spieler sie sieht.

Rolle im Gesamtbild: reine Logik ohne Bilder. ``klippe.klippenfeld`` wählt damit Randkacheln nur am
echten Ende eines Bands und einen Deckstreifen je Band; ``klippenbild`` zeichnet den Umriss an den
Versätzen; ``klippenband`` prüft die Bänder aller Szenen.
"""

from functools import lru_cache
from typing import NamedTuple

WAND = "#"
WASSER = "~"
# Höhe einer Kante in Reihen, wenn die Szene nichts sagt (Kante, Wand, Fuß).
HOEHE_STANDARD = 3
# Breiteste Rampe, die als Treppe durch eine Kante gilt (Grube: vier Felder).
BREITE_RAMPE = 4
# So viele Raster merkt sich der Zwischenspeicher (eine Szene wird Feld für Feld gefragt).
RASTER_IM_SPEICHER = 8


class Stapel(NamedTuple):
    """Die Felder einer Kante in einer Spalte: Spalte, oberste Reihe (Kante), unterste Reihe (Fuß)."""

    x: int
    oben: int
    unten: int


def ist_wand(zeilen: list[str] | tuple[str, ...], x: int, y: int) -> bool:
    """Ob (x, y) im Raster liegt und ein Wandfeld „#“ ist."""
    return 0 <= y < len(zeilen) and 0 <= x < len(zeilen[0]) and zeilen[y][x] == WAND


def rolle(zeilen: list[str] | tuple[str, ...], x: int, y: int, hoehe: int = HOEHE_STANDARD) -> str | None:
    """Welche Reihe der Kante (x, y) ist: „kante“, „wand“, „fuss“ oder None (keine Kante darunter).

    Eingaben: Raster, Feld, Höhe der Kante in Reihen. Beispiel: Band aus drei Reihen „#“ über
    Schotter → oben „kante“, Mitte „wand“, unten „fuss“.
    Sonderfall: Die Randspalten links und rechts setzen das Band daneben fort, statt als flache
    Erdfläche wie ein Platzhalter zu stehen (Gutachten Runde 9, Querbefund „orange Kacheln“).
    """
    if not ist_wand(zeilen, x, y):
        return None
    breite = len(zeilen[0])
    if x in (0, breite - 1) and breite > 2:
        innen = 1 if x == 0 else breite - 2
        if ist_wand(zeilen, innen, y):
            return _rolle_ohne_rand(zeilen, innen, y, hoehe)
    return _rolle_ohne_rand(zeilen, x, y, hoehe)


def _rolle_ohne_rand(zeilen: list[str] | tuple[str, ...], x: int, y: int, hoehe: int) -> str | None:
    """Rolle nach den Feldern darunter (siehe ``rolle``), ohne die Fortsetzung am Rand.

    Beispiel mit ``hoehe`` 5: das Feld direkt über dem Boden ist „fuss“, die drei darüber „wand“,
    das fünfte „kante“; ein sechstes Wandfeld darüber gehört nicht mehr zur Kante (None).
    """
    for abstand in range(1, hoehe + 1):
        art = "fuss" if abstand == 1 else "kante" if abstand == hoehe else "wand"
        unten = y + abstand
        if unten >= len(zeilen):
            return None
        if zeilen[unten][x] != WAND:
            if not all(ist_wand(zeilen, x, y + i) for i in range(abstand)):
                return None
            # Niedrige Stufe (Hang am Ende einer Wand, zwei Reihen hoch): Das oberste Feld trägt
            # die gewellte Kante, sonst endet der Fels oben wie abgeschnitten (R028).
            oben_frei = y > 0 and not ist_wand(zeilen, x, y - 1)
            return "kante" if 1 < abstand < hoehe and oben_frei else art
    return None


def stapel(zeilen: list[str] | tuple[str, ...], hoehe: int = HOEHE_STANDARD) -> list[Stapel]:
    """Alle Stapel des Rasters, nach Spalte und Reihe geordnet.

    Beispiel: Band aus drei Reihen „#“ in den Reihen 1 bis 3 → je Spalte ``Stapel(x, 1, 3)``.
    Sonderfall: Dicke Wandflächen haben nur unten einen Stapel; die Felder darüber sind Hochfläche.
    """
    gefunden = []
    for x in range(len(zeilen[0])):
        oben = None
        for y in range(len(zeilen) + 1):
            hat_rolle = y < len(zeilen) and rolle(zeilen, x, y, hoehe) is not None
            if hat_rolle and oben is None:
                oben = y
            elif not hat_rolle and oben is not None:
                gefunden.append(Stapel(x, oben, y - 1))
                oben = None
    return gefunden


def _beruehrt(a: Stapel, b: Stapel) -> bool:
    """Ob zwei Stapel benachbarter Spalten aneinanderstoßen: Sie teilen mindestens eine Reihe.

    Ecke an Ecke zählt nicht: Ein Randfeld schräg über dem Wandende (Stadtpark, Nordrand) setzt die
    Wand nicht fort; sonst verlöre das Ende seine Randkachel.
    """
    return abs(a.x - b.x) == 1 and a.oben <= b.unten and b.oben <= a.unten


@lru_cache(maxsize=RASTER_IM_SPEICHER)
def baender(zeilen: tuple[str, ...], hoehe: int = HOEHE_STANDARD) -> tuple[tuple[Stapel, ...], ...]:
    """Die Bänder des Rasters: je Band seine Stapel von links nach rechts.

    Warum: siehe Dateikopf. Eingaben: Raster als Tupel (für den Zwischenspeicher), Höhe der Kante.
    Ausgabe: Tupel der Bänder, geordnet nach dem ersten Stapel.
    Beispiel (Zedernpfad): Die Wand springt alle paar Felder um eine Reihe; alle Stücke bis zur
    nächsten Treppe sind ein Band. Sonderfall: Eine Treppe oder Lücke trennt Bänder.
    """
    alle = stapel(zeilen, hoehe)
    nummer = list(range(len(alle)))

    def wurzel(i: int) -> int:
        while nummer[i] != i:
            nummer[i] = nummer[nummer[i]]
            i = nummer[i]
        return i

    je_spalte: dict[int, list[int]] = {}
    for i, s in enumerate(alle):
        for j in je_spalte.get(s.x - 1, []):
            if _beruehrt(alle[j], s):
                nummer[wurzel(i)] = wurzel(j)
        je_spalte.setdefault(s.x, []).append(i)
    gruppen: dict[int, list[Stapel]] = {}
    for i, s in enumerate(alle):
        gruppen.setdefault(wurzel(i), []).append(s)
    return tuple(tuple(sorted(g)) for g in sorted(gruppen.values(), key=min))


@lru_cache(maxsize=RASTER_IM_SPEICHER)
def bandnummern(zeilen: tuple[str, ...], hoehe: int = HOEHE_STANDARD) -> dict[tuple[int, int], int]:
    """Je Feld mit Rolle die Nummer seines Bands (Stelle in ``baender``)."""
    return {
        (s.x, y): nummer
        for nummer, band in enumerate(baender(zeilen, hoehe))
        for s in band
        for y in range(s.oben, s.unten + 1)
    }


@lru_cache(maxsize=RASTER_IM_SPEICHER)
def _stapel_je_spalte(zeilen: tuple[str, ...], hoehe: int) -> dict[int, tuple[Stapel, ...]]:
    """Die Stapel je Spalte (Zwischenspeicher für ``band_daneben``)."""
    je_spalte: dict[int, list[Stapel]] = {}
    for s in stapel(zeilen, hoehe):
        je_spalte.setdefault(s.x, []).append(s)
    return {x: tuple(liste) for x, liste in je_spalte.items()}


def band_daneben(zeilen: tuple[str, ...], x: int, y: int, dx: int, hoehe: int = HOEHE_STANDARD) -> bool:
    """Ob das Band von (x, y) in der Nachbarspalte ``x + dx`` weiterläuft (auch versetzt).

    Beispiel: Wand in den Reihen 1 bis 3, rechts daneben in den Reihen 2 bis 4 → True (Versatz,
    kein Wandende). Rechts daneben nur Boden → False (echtes Ende, Randkachel).
    Sonderfall: Feld ohne Rolle → False.
    """
    je_spalte = _stapel_je_spalte(zeilen, hoehe)
    eigener = next((s for s in je_spalte.get(x, ()) if s.oben <= y <= s.unten), None)
    return eigener is not None and any(_beruehrt(eigener, s) for s in je_spalte.get(x + dx, ()))
