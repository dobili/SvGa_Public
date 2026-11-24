"""Felsvarianten: Eine Wand aus immer derselben Kachel bekommt Flächen, Risse und Simse (braucht Pillow).

Warum: LimeZus Klippe hat je Reihe eine einzige Mittelkachel. Über zwanzig, achtzig oder zweihundert
Felder wiederholt, liest der Mensch kein Gelände mehr, sondern ein Muster: „Ziegeldach“ (Summit),
„Schokoladenriegel“ (Deich), „Hecke“ (Bahndamm; Kartenblick M02, 24.11.2026). Gelände wirkt
unregelmäßig im Großen: hellere und dunklere Pfeiler, hier ein Riss, dort ein Sims.

Vorgehen: Das Modul ändert die fertig gelegte Wand Pixel für Pixel, nur innerhalb der Wandmaske
(``klippenarten``). Alles hängt allein an Kartenname und Pixelort, damit jeder Bau dasselbe Bild
ergibt. Die Farben bleiben flächig wie im Paket: Ein Fleck ist dieselbe Zeichnung, eine Stufe heller
oder dunkler, mit harter, unregelmäßiger Grenze. Die Flecken laufen über die Kachelgrenzen hinweg;
gerade das bricht das Raster.

Rolle im Gesamtbild: ``klippenbild.veredle`` ruft ``variiere`` für die Wandschicht einer Szene.
"""

import zlib
from collections.abc import Iterable
from typing import NamedTuple

from PIL import Image

from pipeline.abenteuer.kartenbau import K

# Wie weit ein Rasterpunkt des Rauschens reicht (Pixel): Felspfeiler sind höher als breit.
PFEILER_BREITE, PFEILER_HOEHE = 30, 70
# Feines Zittern der Fleckgrenze, damit sie nicht wie mit dem Zirkel gezogen wirkt.
ZITTERN, ZITTERFELD = 0.03, 2
# Tausendstel als Auflösung der Zufallswerte.
TAUSEND = 1000
# Riss: Helligkeit des Risses und der Lichtkante rechts daneben; so viele Pixel läuft er gerade.
RISS, RISSLICHT, RISS_GERADE = 0.7, 1.1, 3
# Sims: Lichtkante oben, Schatten darunter; kürzeste und längste Länge in Pixeln.
SIMS_LICHT, SIMS_SCHATTEN, SIMS_KURZ, SIMS_LANG = 1.16, 0.7, 7, 19
# Entwässerungsrohr der Stützmauer: Größe des Lochs und Länge der Wasserfahne darunter.
ROHR, FAHNE, FAHNE_TON = 2, 6, 0.9


class Machart(NamedTuple):
    """Wie stark eine Wandart variiert: Schwellen und Töne der Flecken, Anteil der Felder (in
    Hundertstel) mit Riss, Sims und Rohr."""

    dunkel_unter: float
    hell_ueber: float
    dunkel: float
    hell: float
    risse: int
    simse: int
    rohre: int


MACHARTEN = {
    "fels": Machart(0.42, 0.6, 0.87, 1.09, 12, 16, 0),
    "boeschung": Machart(0.4, 0.62, 0.93, 1.06, 0, 0, 0),
    "stuetzmauer": Machart(0.36, 0.66, 0.95, 1.04, 0, 0, 9),
}
HUNDERT = 100


def streuwert(*teile: object) -> int:
    """Fester Zufallswert aus den Teilen (gleich bei jedem Bau, auf jedem Rechner)."""
    return zlib.crc32(repr(teile).encode("utf-8"))


def _gitterwert(saat: str, gx: int, gy: int) -> float:
    return streuwert(saat, gx, gy) % TAUSEND / TAUSEND


def rauschen(saat: str, x: float, y: float) -> float:
    """Weiches Rauschen zwischen 0 und 1 am Ort (x, y) in Gitterschritten.

    Zwischen den Gitterpunkten wird weich überblendet, sodass zusammenhängende Flecken entstehen.
    Beispiel: ``rauschen("park", 2.0, 5.0)`` ist der feste Wert des Gitterpunkts (2, 5).
    """
    gx, gy = int(x // 1), int(y // 1)
    tx, ty = x - gx, y - gy
    tx, ty = tx * tx * (3 - 2 * tx), ty * ty * (3 - 2 * ty)
    oben = _gitterwert(saat, gx, gy) * (1 - tx) + _gitterwert(saat, gx + 1, gy) * tx
    unten = _gitterwert(saat, gx, gy + 1) * (1 - tx) + _gitterwert(saat, gx + 1, gy + 1) * tx
    return oben * (1 - ty) + unten * ty


def getoent(farbe: tuple[int, ...], faktor: float) -> tuple[int, ...]:
    """Die Farbe heller oder dunkler, Deckkraft unverändert."""
    return (*(min(255, round(c * faktor)) for c in farbe[:3]), *farbe[3:])


def _toene(bild: Image.Image, maske: Image.Image, felder: Iterable[tuple[int, int]], saat: str, m: Machart):
    """Helle und dunkle Flächen über die Wand legen (Pfeiler, die vor- und zurückspringen)."""
    px, wand = bild.load(), maske.load()
    for fx, fy in felder:
        for y in range(fy * K, fy * K + K):
            for x in range(fx * K, fx * K + K):
                if not wand[x, y]:
                    continue
                wert = rauschen(saat, x / PFEILER_BREITE, y / PFEILER_HOEHE)
                wert += (_gitterwert(saat + "z", x // ZITTERFELD, y // ZITTERFELD) - 0.5) * ZITTERN
                if wert < m.dunkel_unter:
                    px[x, y] = getoent(px[x, y], m.dunkel)
                elif wert > m.hell_ueber:
                    px[x, y] = getoent(px[x, y], m.hell)


def _riss(bild: Image.Image, maske: Image.Image, x: int, y: int, saat: str) -> None:
    """Ein Riss vom Wandfuß bei (x, y) nach oben, bis die Wand endet; er wandert leicht zur Seite."""
    px, wand = bild.load(), maske.load()
    if not 0 < x < bild.width - 1:
        return
    # Der Grasfuß gehört nicht zur Wand: erst die unterste Wandzeile dieser Spalte suchen.
    y = next((b for b in range(y, y - K, -1) if wand[x, b]), -1)
    schritt = 0
    while y >= 0 and 0 < x < bild.width - 1 and wand[x, y]:
        px[x, y] = getoent(px[x, y], RISS)
        if wand[x + 1, y]:
            px[x + 1, y] = getoent(px[x + 1, y], RISSLICHT)
        schritt += 1
        if schritt % RISS_GERADE == 0:
            x += streuwert(saat, x, y) % 3 - 1
        y -= 1


def _sims(bild: Image.Image, maske: Image.Image, x: int, y: int, laenge: int) -> None:
    """Ein waagerechter Sims: Lichtkante, darunter eine Zeile Schatten."""
    px, wand = bild.load(), maske.load()
    for a in range(x, min(x + laenge, bild.width)):
        hoch = y + (1 if (a - x) * 3 > laenge * 2 else 0)  # das rechte Drittel liegt eine Zeile tiefer
        if hoch + 1 < bild.height and wand[a, hoch] and wand[a, hoch + 1]:
            px[a, hoch] = getoent(px[a, hoch], SIMS_LICHT)
            px[a, hoch + 1] = getoent(px[a, hoch + 1], SIMS_SCHATTEN)


def _rohr(bild: Image.Image, maske: Image.Image, x: int, y: int, umriss: tuple[int, ...]) -> None:
    """Ein Entwässerungsrohr in der Mauer mit einer dunkleren Wasserfahne darunter."""
    px, wand = bild.load(), maske.load()
    for b in range(y, min(y + ROHR + FAHNE, bild.height)):
        for a in range(x, x + ROHR):
            if wand[a, b]:
                px[a, b] = umriss if b < y + ROHR else getoent(px[a, b], FAHNE_TON)


def variiere(
    bild: Image.Image,
    maske: Image.Image,
    rollen: dict[tuple[int, int], str],
    saat: str,
    art: str,
    umriss: tuple[int, ...],
) -> None:
    """Die Wandschicht einer Szene abwechslungsreich machen (ändert ``bild``).

    Eingaben: Wandschicht und Wandmaske in Kartengröße, Rolle je Wandfeld („kante“, „wand“,
    „fuss“), Kartenname als Saat, Wandart, Umrissfarbe. Ausgabe: keine.
    Beispiel (Summit City): Das achtzig Felder lange Band am Nordrand bekommt etwa alle zwei bis
    fünf Felder einen helleren oder dunkleren Pfeiler, dazu gut ein Dutzend Risse und Simse.
    Sonderfall: Unbekannte Art variiert wie Fels.
    """
    m = MACHARTEN.get(art, MACHARTEN["fels"])
    _toene(bild, maske, rollen, saat, m)
    for (fx, fy), rolle in sorted(rollen.items()):
        wurf = streuwert(saat, "detail", fx, fy)
        ort = (fx * K + wurf // HUNDERT % K, fy * K + wurf // TAUSEND % (K - ROHR - 1))
        if rolle == "fuss" and wurf % HUNDERT < m.risse:
            _riss(bild, maske, ort[0], fy * K + K - 1, saat)
        elif rolle != "fuss" and wurf % HUNDERT < m.simse:
            laenge = SIMS_KURZ + wurf // TAUSEND % (SIMS_LANG - SIMS_KURZ)
            _sims(bild, maske, ort[0], ort[1], laenge)
        elif rolle == "wand" and wurf % HUNDERT < m.rohre and ort[0] + ROHR < bild.width:
            _rohr(bild, maske, ort[0], ort[1], umriss)
