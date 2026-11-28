"""Sitzfläche eines Sitzmöbels aus dem Bild (Teil von ``konturkollision.py``, ausgelagert, damit
die Dateien unter 400 Zeilen bleiben).

Warum: Beispiel des Autors (28.11.2026): „Der Held darf hinter der Lehne eines Stuhls langlaufen,
aber nicht hinter der Sitzfläche.“ Die feinen Masken von 10.88 sperrten nur die untere Bildhälfte;
bei Seitenstühlen blieb so der hintere Teil der Sitzfläche begehbar.
"""

from pipeline.abenteuer.feinmasken import DECKEND, MINDEST_PIXEL
from pipeline.abenteuer.kollisionfein import ZP

Zelle = tuple[int, int]
SITZ_BREITE = 0.7  # Anteil der breitesten Reihe, ab dem eine Reihe zur Sitzfläche zählt
SITZ_ANTEIL = 0.7  # höchstens dieser Anteil der sichtbaren Höhe ist Sitzfläche
# Die hintere Kante der Sitzfläche (oberste Pixel) gehört nicht zur Standfläche: Wer hinter dem Stuhl
# steht, verschwindet mit den Füßen hinter ihr (Durchlass Dachboden Maple Falls, 28.11.2026).
SITZ_RAND = ZP - 1


def deckende_breite(alpha: bytes, breite: int, hoehe: int) -> list[int]:
    """Zahl der deckenden Pixel je Pixelreihe. Beispiel: Seitenstuhl → Lehne 4, Sitz 13."""
    return [sum(1 for a in alpha[y * breite : (y + 1) * breite] if a > DECKEND) for y in range(hoehe)]


def sitzflaeche(alpha: bytes, breite: int, hoehe: int) -> set[Zelle]:
    """Die Zellen von Sitzfläche, Beinen und Fuß eines Sitzmöbels, ohne die Lehne darüber.

    Regel: Von der untersten breiten Reihe (über den Beinen) nach oben, solange die Reihe
    mindestens SITZ_BREITE der breitesten Reihe deckt (die Lehne eines Seitenstuhls ist schmal; über
    einer Vorderlehne liegt ein Spalt), höchstens SITZ_ANTEIL der sichtbaren Höhe: die Sitzkante.
    Eine Zelle sperrt, wenn mindestens MINDEST_PIXEL ihrer Pixel deckend sind und sie SITZ_RAND
    Pixel unter der Sitzkante oder tiefer beginnt.
    Beispiel: mf3StuhlDunkelLinks (Lehne Reihen 1 bis 7, Sitz 8 bis 21) → Zellreihen 3 bis 5.
    Sonderfall: nichts Deckendes → leer.
    """
    werte = deckende_breite(alpha, breite, hoehe)
    reihen = [y for y, w in enumerate(werte) if w]
    if not reihen:
        return set()
    oben, unten = reihen[0], reihen[-1] + 1
    grenze = SITZ_BREITE * max(werte)
    kante = max(y for y in reihen if werte[y] >= grenze)  # unterste breite Reihe (über den Beinen)
    while kante - 1 >= oben and werte[kante - 1] >= grenze:
        kante -= 1
    kante = max(kante, round(unten - SITZ_ANTEIL * (unten - oben)))
    zellen: dict[Zelle, int] = {}
    for y in range(kante, unten):
        for x in range(breite):
            if alpha[y * breite + x] > DECKEND:
                zellen[(x // ZP, y // ZP)] = zellen.get((x // ZP, y // ZP), 0) + 1
    return {z for z, n in zellen.items() if n >= MINDEST_PIXEL and z[1] * ZP >= kante + SITZ_RAND}
