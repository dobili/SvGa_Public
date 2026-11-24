"""Höhen als Gelände zeichnen: die Feinarbeit an den Felskanten einer Szene (braucht Pillow).

Warum: Der Autor ließ alle Karten mit Menschenaugen prüfen (Kartenblick, 24.11.2026). Muster M02:
„Höhen sieht man nicht.“ Felswände waren gerade Bänder aus einer Kachel, jeder Versatz ein eigener
Klotz mit dunklem Umriss, am Wandfuß neben Treppen und linken Ecken saß ein schwarzer Schrägstrich,
und der Grasfuß der Wand stand auch auf Schotter und Sand.

Was dieses Modul am fertigen Hintergrund ändert (nur Szenen mit ``"kante": "klippe"``):
1. Es legt die Wand neu, aus dem geheilten Bogen (``klippenarten``): kein Schrägstrich mehr.
   Gespiegelte Kacheln gibt es bewusst nicht: Nebeneinander ergaben sie Schmetterlingsmuster.
2. Der Fuß richtet sich nach dem Boden darunter: Liegt dort kein Gras, zeigt der Streifen unter dem
   Fels diesen Boden statt Grasbüscheln.
3. Felsvarianten über die Kachelgrenzen hinweg (``klippenfels``).
4. Umriss, wo Fels seitlich an Boden stößt: Ein Versatz der Wand ist eine Ecke im Fels, kein
   Wandende mit Randkachel.
5. Seitenwand: Die Seitenkante einer Hochfläche (eine Spalte „#“ über dem Wandende, Regel 10.74)
   zeigt auf der tiefen Seite einen schmalen, dunkleren Streifen Fels.
6. Schatten am Fuß der Wand und neben der Seitenwand auf dem Boden.
7. Treppen aus demselben Kachelsatz.

Rolle im Gesamtbild: ``kartenbild.zeichne`` ruft ``veredle`` nach der Bodenvariation (die sonst den
Schatten wieder überschriebe) und vor den Straßenlinien. Das Raster und die Kollision bleiben, wie
sie sind; nur das Bild ändert sich.
"""

from pathlib import Path

from PIL import Image

from pipeline.abenteuer import klippenfels
from pipeline.abenteuer.bodenraster import randnachbar
from pipeline.abenteuer.kartenbau import K, raster
from pipeline.abenteuer.klippe import (
    HOEHE_STANDARD,
    REIHE_FUSS,
    REIHE_KANTE,
    REIHE_OBEN,
    REIHE_RAND,
    REIHE_WAND,
    SPALTEN,
    WAND,
    WASSER,
    grasboden,
    hochseite,
    klippenfeld,
    strassenzeichen,
    treppenfelder,
    vorhandene_fassung,
)
from pipeline.abenteuer.klippenarten import Kachelsatz, kachelsatz

ROLLEN = {REIHE_KANTE: "kante", REIHE_WAND: "wand", REIHE_FUSS: "fuss"}
# So viele Pixelzeilen am unteren Rand der Fußkachel können Grasfuß sein.
FUSSSTREIFEN = 5
# Schatten am Wandfuß: Zeilen mit vollem Schatten, Helligkeit dort und in der gerasterten Zeile danach.
SCHATTEN_ZEILEN, SCHATTEN, HALBSCHATTEN = 2, 0.74, 0.86
# Seitenwand: Breite des Felsstreifens in Pixeln, seine Helligkeit, erste Zeile in der Randkachel
# (darüber schaut der Boden hinter der Hochfläche durch).
SEITENWAND, SEITENTON, RAND_AB = 4, 0.76, 7


def gezeichnetes_raster(szene: dict) -> list[str]:
    """Das Raster, wie ``kartenbild.hintergrund`` es zeichnet: Brückenfelder sind Wasser."""
    bruecken = set(szene.get("bruecken", []))
    return ["".join(WASSER if z in bruecken else z for z in zeile) for zeile in raster(szene)]


def wandfelder(szene: dict, zeilen: list[str], satz: Kachelsatz) -> dict[tuple[int, int], tuple[int, int]]:
    """Je Feld der Felswand (Kante, Wand, Fuß) die Kachel des Bogens.

    Wie in ``kartenbild.hintergrund``: Randwände neben Boden zeigen draußen den Boden (Regel 10.2)
    und zählen nicht; fehlt dem Bogen eine Fassung, gilt die vorhandene.
    Beispiel: Band aus drei Reihen „#“ → je Spalte drei Einträge mit den Reihen 44, 45, 46.
    """
    gras, hoehe = grasboden(szene), int(szene.get("klippenhoehe", HOEHE_STANDARD))
    felder = {}
    for y, zeile in enumerate(zeilen):
        for x, z in enumerate(zeile):
            if z != WAND or (szene.get("wandart") and randnachbar(zeilen, x, y) is not None):
                continue
            feld = klippenfeld(zeilen, x, y, gras, hoehe)
            if feld is not None and feld[1] in ROLLEN:
                felder[(x, y)] = vorhandene_fassung(feld, satz.hat)
    return felder


def _wandschicht(
    groesse: tuple[int, int], felder: dict[tuple[int, int], tuple[int, int]], satz: Kachelsatz
) -> tuple[Image.Image, Image.Image]:
    """Die Wand als eigene Schicht mit ihrer Maske."""
    schicht, maske = Image.new("RGBA", groesse, (0, 0, 0, 0)), Image.new("L", groesse, 0)
    for (x, y), feld in felder.items():
        schicht.paste(satz.kachel(feld), (x * K, y * K))
        maske.paste(satz.maske(feld), (x * K, y * K))
    return schicht, maske


def _fuss_nach_boden(
    schicht: Image.Image, maske: Image.Image, grund: Image.Image, zeilen: list[str], szene: dict, felder: dict
) -> None:
    """Der Streifen unter dem Fels zeigt den Boden darunter, wenn dort kein Gras liegt.

    Beispiel: Felswand über dem Schotter der Steinbruchsohle → Schotter bis an den Fels statt eines
    grünen Saums. Sonderfälle: Gras, Wasser, Wand oder Kartenrand darunter → der Grasfuß bleibt.
    """
    gras = grasboden(szene) | {WAND, WASSER}
    px, wand, boden = schicht.load(), maske.load(), grund.load()
    for (x, y), feld in felder.items():
        if feld[1] != REIHE_FUSS or y + 1 >= len(zeilen) or zeilen[y + 1][x] in gras:
            continue
        for b in range(y * K + K - FUSSSTREIFEN, y * K + K):
            for a in range(x * K, x * K + K):
                if not wand[a, b]:
                    px[a, b] = boden[a, b + K]


def _umrisse(schicht: Image.Image, maske: Image.Image, felder: dict, umriss: tuple[int, ...]) -> None:
    """Dunkler Umriss an jeder Kachelseite, an der Fels neben Nicht-Fels liegt (Versatz der Wand)."""
    px, wand = schicht.load(), maske.load()
    for x, y in felder:
        for innen, aussen in ((x * K, x * K - 1), (x * K + K - 1, x * K + K)):
            if not 0 <= aussen < schicht.width:
                continue  # am Bildrand läuft die Wand weiter
            for b in range(y * K, y * K + K):
                if wand[innen, b] and not wand[aussen, b]:
                    px[innen, b] = umriss


def _dunkle(bild: Image.Image, x: int, y: int, faktor: float) -> None:
    if 0 <= x < bild.width and 0 <= y < bild.height:
        bild.putpixel((x, y), klippenfels.getoent(bild.getpixel((x, y)), faktor))


def _fussschatten(grund: Image.Image, zeilen: list[str], felder: dict) -> None:
    """Schatten der Wand auf dem Boden vor ihrem Fuß: zwei Zeilen dunkel, eine dritte gerastert."""
    for (x, y), feld in felder.items():
        if feld[1] != REIHE_FUSS or y + 1 >= len(zeilen) or zeilen[y + 1][x] in (WAND, WASSER):
            continue
        for a in range(x * K, x * K + K):
            for zeile in range(SCHATTEN_ZEILEN):
                _dunkle(grund, a, (y + 1) * K + zeile, SCHATTEN)
            if a % 2 == 0:
                _dunkle(grund, a, (y + 1) * K + SCHATTEN_ZEILEN, HALBSCHATTEN)


def _seitenwaende(grund: Image.Image, zeilen: list[str], szene: dict, satz: Kachelsatz) -> None:
    """Seitenkanten der Hochfläche bekommen auf der tiefen Seite einen Streifen Fels mit Schatten.

    Beispiel (Stadtpark Maple Falls): Über dem linken Ende der Felswand läuft eine Spalte „#“ zum
    Nordrand; links davon liegt die Wiese tiefer. Dort steht jetzt ein vier Pixel breiter, dunkler
    Felsstreifen statt nur einer Linie, und zwei Pixel Schatten fallen auf die Wiese.
    """
    gras, hoehe = grasboden(szene), int(szene.get("klippenhoehe", HOEHE_STANDARD))
    for y, zeile in enumerate(zeilen):
        for x, z in enumerate(zeile):
            # Die Randspalten sind Kollision, keine Seitenkante im Bild.
            hoch = hochseite(zeilen, x, y) if z == WAND and 0 < x < len(zeile) - 1 else None
            feld = klippenfeld(zeilen, x, y, gras, hoehe) if hoch else None
            if feld is None or feld[1] not in (REIHE_OBEN, REIHE_RAND):
                continue
            variante = "gras" if feld[0] in SPALTEN["gras"] else "erde"
            fels = satz.kachel(vorhandene_fassung((SPALTEN[variante][1], REIHE_WAND), satz.hat))
            oben = RAND_AB if feld[1] == REIHE_RAND else 0
            _seitenstreifen(grund, fels, (x, y), hoch == "links", oben, satz.umriss)


def _seitenstreifen(
    grund: Image.Image, fels: Image.Image, feld: tuple[int, int], tief_rechts: bool, oben: int, umriss: tuple
) -> None:
    """Der Felsstreifen einer Seitenwand im Feld und sein Schatten auf dem Boden daneben."""
    x0, y0 = feld[0] * K, feld[1] * K
    for b in range(oben, K):
        for i in range(SEITENWAND):
            a = K - 1 - i if tief_rechts else i
            farbe = (
                umriss if i in (0, SEITENWAND - 1) else klippenfels.getoent(fels.getpixel((a, b)), SEITENTON)
            )
            grund.putpixel((x0 + a, y0 + b), farbe)
        for i in range(SCHATTEN_ZEILEN):
            _dunkle(grund, x0 + K + i if tief_rechts else x0 - 1 - i, y0 + b, SCHATTEN)


def veredle(szene: dict, grund: Image.Image, privat: Path) -> Image.Image:
    """Der Hintergrund mit Felskanten als Gelände (ändert und liefert ``grund``).

    Eingaben: Szene, Hintergrund aus ``kartenbild.hintergrund`` (nach der Bodenvariation), privates
    Paket. Ausgabe: derselbe Hintergrund, die Felskanten neu gezeichnet (siehe Dateikopf).
    Beispiel: Stadtpark Maple Falls, linkes Wandende am Bach: kein schwarzer Schrägstrich mehr.
    Sonderfall: Szenen ohne ``"kante": "klippe"`` bleiben unverändert.
    """
    if szene.get("kante") != "klippe":
        return grund
    zeilen, satz = gezeichnetes_raster(szene), kachelsatz(szene, privat)
    felder = wandfelder(szene, zeilen, satz)
    schicht, maske = _wandschicht(grund.size, felder, satz)
    _fuss_nach_boden(schicht, maske, grund, zeilen, szene, felder)
    rollen = {ort: ROLLEN[feld[1]] for ort, feld in felder.items()}
    klippenfels.variiere(schicht, maske, rollen, szene["karte"], satz.art, satz.umriss)
    _umrisse(schicht, maske, felder, satz.umriss)
    grund.alpha_composite(schicht)
    _seitenwaende(grund, zeilen, szene, satz)
    _fussschatten(grund, zeilen, felder)
    for x, y, feld in treppenfelder(zeilen, strassenzeichen(szene)):
        grund.alpha_composite(satz.kachel(feld), (x * K, y * K))
    return grund
