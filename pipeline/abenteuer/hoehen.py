"""Höhenprüfung: Eine Felswand endet nicht frei im Gelände (Rückmeldung R028, R029).

Warum: Auf dem Zedernpfad hörte ein Gebirgszug mitten im Bild auf, daneben lag wieder Gras. Man
konnte an der Wand vorbeigehen und stand oben, ohne Höhe erklommen zu haben. Das Paket (LimeZu,
Geländebogen) löst das so: Eine Höhe ist immer eine geschlossene Form. Vorn fällt die Felswand ab,
an den Seiten und hinten läuft ein dünner Rand um die Hochfläche. Eine Wand hört also nie auf; sie
biegt um die Ecke und wird zur Seitenkante (KARTENREGELN 10.74).

Im Raster heißt das: Ein Band aus „#“ (drei Reihen über einem Boden) läuft von Kartenrand zu
Kartenrand, oder über seinem Ende steigt eine einzelne Spalte „#“ auf (die Seitenkante,
``klippe.hochseite``), die selbst am Kartenrand oder an der nächsten Wand endet. Lücken bis vier
Felder sind Treppen, Rampen und Straßen durch die Wand.

Rolle im Gesamtbild: ``kartenbau`` druckt die Treffer als Hinweis (wie die Fahrzeugprüfung), bis
alle Karten umgebaut sind; nur für Szenen mit ``"kante": "klippe"``.
"""

from pipeline.abenteuer.klippe import BREITE_RAMPE, HOEHE_STANDARD, WAND, _ist_wand, _rolle

RAT = "bis zum Kartenrand führen oder über dem Ende eine Spalte „#“ als Seitenkante hochziehen (Regel 10.74)"


def _wand_in_der_naehe(zeilen: list[str], x: int, y: int, hoehe: int) -> bool:
    """Ob in Spalte x nahe Reihe y Fels liegt: Das Band läuft dort versetzt weiter."""
    return any(_ist_wand(zeilen, x, b) for b in range(y - hoehe, y + hoehe + 1))


def _luecke(zeilen: list[str], x: int, y: int, dx: int, hoehe: int) -> bool:
    """Ob hinter dem Ende bei (x, y) in Richtung dx nach höchstens ``BREITE_RAMPE`` Feldern wieder
    Fels kommt (Treppe, Rampe oder Straße durch die Wand)."""
    return any(_wand_in_der_naehe(zeilen, x + dx * d, y, hoehe) for d in range(2, BREITE_RAMPE + 2))


def _seitenkante_endet_frei(zeilen: list[str], x: int, y: int) -> tuple[int, int] | None:
    """Folgt der Seitenkante von (x, y) nach oben; gibt ihr freies Ende zurück oder None."""
    while y > 0 and _ist_wand(zeilen, x, y):
        if _ist_wand(zeilen, x - 1, y) or _ist_wand(zeilen, x + 1, y):
            return None  # trifft auf die nächste Wand oder Hochfläche
        y -= 1
    return None if _ist_wand(zeilen, x, y) else (x, y + 1)


def hoehenhinweise(szene: dict, zeilen: list[str]) -> list[str]:
    """Hinweise nach Regel 10.74: Wandenden und Seitenkanten, die frei im Gelände enden.

    Geprüft wird die oberste Reihe jedes Bands (die Kante). Beispiel: Band von Spalte 36 bis 63
    in den Reihen 9–11, rechts davon Gras → „Felswand endet frei bei (63, 9)“.
    Sonderfälle: Enden am Kartenrand, an einer Lücke bis vier Felder (Treppe, Straße) und an einem
    versetzten Stück desselben Bands zählen nicht.
    """
    if szene.get("kante") != "klippe":
        return []
    hoehe, breite = int(szene.get("klippenhoehe", HOEHE_STANDARD)), len(zeilen[0])
    hinweise = []
    for y, zeile in enumerate(zeilen):
        for x, feld in enumerate(zeile):
            if feld != WAND or _rolle(zeilen, x, y, hoehe) != "kante":
                continue
            for dx in (-1, 1):
                nx = x + dx
                if not 0 < nx < breite - 1 or _wand_in_der_naehe(zeilen, nx, y, hoehe):
                    continue
                if _luecke(zeilen, x, y, dx, hoehe):
                    continue
                if not _ist_wand(zeilen, x, y - 1):
                    hinweise.append(f"Felswand endet frei bei ({x}, {y}): {RAT}")
                elif (ende := _seitenkante_endet_frei(zeilen, x, y - 1)) is not None:
                    hinweise.append(
                        f"Seitenkante endet frei bei {ende}: bis zum Kartenrand oder zur nächsten "
                        "Wand führen (Regel 10.74)"
                    )
    return hinweise
