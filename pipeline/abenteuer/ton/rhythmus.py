"""Rhythmusmuster für das Schlagwerk: Besen, Klatschen, Schellen, Trommel, Uhr.

Warum: Der Puls eines Orts ist Teil seiner Fassung (Klangplan A2: „Klatschen auf 2 und 4“ im
Clubraum, „Besen auf kleiner Trommel“ im Clubkampf, in Cedar Creek kein Schlagwerk, dafür die
Turmuhr). Jedes Muster füllt einen Takt mit Noten einer Schlagwerkspur (``schlagwerk.py``).
"""

from collections.abc import Callable

from pipeline.abenteuer.ton.satz import LEISE, Note
from pipeline.abenteuer.ton.schlagwerk import (
    BECKEN,
    GROSSE_TROMMEL,
    HIHAT,
    HOLZBLOCK,
    KLATSCHEN,
    KLEINE_TROMMEL,
    SCHELLENEI,
    SEITLICH,
    TAMBURIN,
    TRIANGEL,
)

KURZ = 0.25
BETONUNG = 15

Rhythmus = Callable[[float, int, int, int], list[Note]]


def _schlag(nummer: int, zeit: float, staerke: int) -> Note:
    """Ein Schlag: Notennummer des Schlagwerks, Zeitpunkt, Stärke."""
    return Note(nummer, zeit, KURZ, max(1, min(127, staerke)))


def besen(beginn: float, taktart: int, takt: int, staerke: int = LEISE) -> list[Note]:
    """Besen: Wischen in Achteln (Schellenei), leiser Schlag auf 2 und 4 (oder 2 und 3 im Walzer)."""
    noten = [
        _schlag(SCHELLENEI, beginn + i * 0.5, staerke - 10 + (6 if i % 2 == 0 else 0))
        for i in range(taktart * 2)
    ]
    schlaege = (1, 3) if taktart == 4 else (1, 2)
    noten += [_schlag(KLEINE_TROMMEL, beginn + s, staerke - 5) for s in schlaege]
    return noten


def klatschen(beginn: float, taktart: int, takt: int, staerke: int = LEISE) -> list[Note]:
    """Händeklatschen auf 2 und 4 (im Walzer auf 2 und 3)."""
    schlaege = (1, 3) if taktart == 4 else (1, 2)
    return [_schlag(KLATSCHEN, beginn + s, staerke) for s in schlaege]


def schellen(beginn: float, taktart: int, takt: int, staerke: int = LEISE) -> list[Note]:
    """Schellenei in Achteln, die Zählzeiten etwas lauter."""
    return [
        _schlag(SCHELLENEI, beginn + i * 0.5, staerke - (0 if i % 2 == 0 else 10)) for i in range(taktart * 2)
    ]


def schlagzeug(beginn: float, taktart: int, takt: int, staerke: int = LEISE) -> list[Note]:
    """Leises Schlagzeug: große Trommel auf 1 und 3, Cajón auf 2 und 4, Hi-Hat in Achteln."""
    noten = [
        _schlag(HIHAT, beginn + i * 0.5, staerke - 12 + (6 if i % 2 == 0 else 0)) for i in range(taktart * 2)
    ]
    noten += [_schlag(GROSSE_TROMMEL, beginn + s, staerke + 5) for s in range(0, taktart, 2)]
    noten += [_schlag(SEITLICH, beginn + s, staerke) for s in range(1, taktart, 2)]
    return noten


def jazz(beginn: float, taktart: int, takt: int, staerke: int = LEISE) -> list[Note]:
    """Jazz mit Besen: Becken leise auf jedem Schlag mit „und“ vor 2 und 4, Hi-Hat auf 2 und 4."""
    noten = [_schlag(HIHAT, beginn + s, staerke - 6) for s in (1, 3) if s < taktart]
    noten += [_schlag(SCHELLENEI, beginn + s, staerke - 4) for s in range(taktart)]
    noten += [_schlag(SCHELLENEI, beginn + s - 1 / 3, staerke - 12) for s in (2, 4) if s <= taktart]
    if takt % 4 == 0:
        noten.append(_schlag(BECKEN, beginn, staerke - 18))
    return noten


def marsch(beginn: float, taktart: int, takt: int, staerke: int = LEISE) -> list[Note]:
    """Marsch: große Trommel auf 1 und 3, kleine Trommel mit Vorschlag auf 2 und 4."""
    noten = [_schlag(GROSSE_TROMMEL, beginn + s, staerke + BETONUNG) for s in range(0, taktart, 2)]
    for s in range(1, taktart, 2):
        noten += [
            _schlag(KLEINE_TROMMEL, beginn + s - 0.25, staerke - 10),
            _schlag(KLEINE_TROMMEL, beginn + s, staerke + 5),
        ]
    return noten


def tamburin(beginn: float, taktart: int, takt: int, staerke: int = LEISE) -> list[Note]:
    """Tamburin auf 2 und 4, dazu Schellenei in Achteln (Cajun, Fest)."""
    noten = schellen(beginn, taktart, takt, staerke - 8)
    return noten + [_schlag(TAMBURIN, beginn + s, staerke) for s in range(1, taktart, 2)]


def uhr(beginn: float, taktart: int, takt: int, staerke: int = LEISE) -> list[Note]:
    """Das Ticken der Turmuhr: Holzblock auf jedem Schlag, ganz leise (Cedar Creek, kein Schlagzeug)."""
    return [_schlag(HOLZBLOCK, beginn + s, staerke - 20 + (5 if s == 0 else 0)) for s in range(taktart)]


def triangel(beginn: float, taktart: int, takt: int, staerke: int = LEISE) -> list[Note]:
    """Triangel auf der Eins jedes zweiten Takts (Glanz über Festmusik)."""
    return [_schlag(TRIANGEL, beginn, staerke - 10)] if takt % 2 == 0 else []


RHYTHMEN: dict[str, Rhythmus] = {
    "besen": besen,
    "klatschen": klatschen,
    "schellen": schellen,
    "schlagzeug": schlagzeug,
    "jazz": jazz,
    "marsch": marsch,
    "tamburin": tamburin,
    "uhr": uhr,
    "triangel": triangel,
}
