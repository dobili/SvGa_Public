"""Die Köpfe der acht Ortsthemen als Zitate für die Rückblicke von Akt 4.

Warum: Akt 4 sammelt die Orte ein (Klangplan 4A1, 4A2): Crossroads spielt fünf Ortsthemen
nacheinander, das Lagerfeuer singt alle acht Köpfe als Strophen, die Arena-Treppe legt sie
darunter, die Fernpartie zitiert sieben Fundorte, der Abspann alle acht. Alle diese Stücke stehen in
G-Dur; deshalb steht jeder Kopf hier dreimal über G: in seiner eigenen Farbe (Moll mit ♭3, ♭6, ♭7
für Cedar Creek, Riverton und Ironwood, lydisch für Silicon Bay), in Dur für den fröhlichen
Crossroads-Zug und in zwei Takten nur mit I, IV und V für Ezras Gitarre.

Seit der Umstellung auf Klangplan A0 (Etappe Akt 4, 22.11.2026) stehen die Töne nicht mehr doppelt:
Jeder Kopf wird aus den ersten vier Takten (Teil A) seines Ortsthemas gebildet (maple.py, cedar.py,
akt2_riverton.py, akt2_ironwood.py, akt3_siliconbay.py, akt3_delacroix.py, akt3_desert.py,
akt4_summit.py); ``moll_in_dur`` schreibt die Moll-Stufen nach G-Dur um. Ändert sich ein Ortsthema,
zitieren die Rückblicke es von selbst richtig.
"""

import re
from dataclasses import dataclass

from pipeline.abenteuer.ton.satzplan import Stimme, Teil
from pipeline.abenteuer.ton.stuecke import (
    akt2_ironwood,
    akt2_riverton,
    akt3_delacroix,
    akt3_desert,
    akt3_siliconbay,
    akt4_summit,
    cedar,
    maple,
)


@dataclass(frozen=True)
class Kopf:
    """Ein Ortsthema als Zitat: Instrument des Orts, Lage und drei Fassungen über G."""

    ort: str
    instrument: str
    oktave: int
    eigen: Teil
    dur: Teil
    zwei: Teil


MOLL_STUFEN = frozenset("367")
MOLL_AKKORDE = {"III": "bIII", "VI": "bVI", "VII": "bVII"}
STUFE = re.compile(r"^(?P<vorz>[#b]?)(?P<stufe>[1-7])(?P<lage>[',]*)$")


def _stufe_in_dur(stufe: str) -> str:
    """Eine Stufe aus Moll in Dur: 3, 6, 7 bekommen ein ♭, die erhöhte 7 (Leitton) wird zur 7."""
    treffer = STUFE.match(stufe)
    if not treffer:
        return stufe
    vorz, zahl, lage = treffer["vorz"], treffer["stufe"], treffer["lage"]
    if vorz == "#" and zahl == "7":
        return f"7{lage}"
    if not vorz and zahl in MOLL_STUFEN:
        return f"b{zahl}{lage}"
    return stufe


def moll_in_dur(melodie: str) -> str:
    """Eine Melodie in Moll-Stufen als Dur-Stufen. Beispiel: „1:1 3:1 #7,:1“ → „1:1 b3:1 7,:1“."""
    noten = []
    for zeichen in melodie.split():
        if zeichen == "|" or ":" not in zeichen:
            noten.append(zeichen)
            continue
        stufe, dauer = zeichen.split(":", 1)
        noten.append(f"{_stufe_in_dur(stufe)}:{dauer}")
    return " ".join(noten)


def akkorde_in_dur(akkorde: str) -> str:
    """Moll-Akkorde für G-Dur: III, VI, VII werden zu ♭III, ♭VI, ♭VII. Beispiel: „i | VI“ → „i | bVI“."""
    return " ".join(MOLL_AKKORDE.get(a, a) for a in akkorde.split())


def _moll(teil: Teil) -> Teil:
    """Ein Teil aus einem Moll-Ortsthema über G (eigene Farbe)."""
    return Teil(akkorde_in_dur(teil.akkorde), moll_in_dur(teil.melodie))


def _kopf_zwei(kopf: str, akkorde: str) -> Teil:
    """Der Kopf (zwei Takte) mit einfachen Akkorden für Ezras Gitarre (nur I, IV, V)."""
    return Teil(akkorde, kopf)


MAPLE = Kopf(
    "maple",
    "gitarre",
    1,
    Teil(maple.A.akkorde, maple.A.melodie),
    Teil(maple.A.akkorde, maple.A.melodie),
    _kopf_zwei(maple.KOPF, "I | IV"),
)
CEDAR = Kopf(
    "cedar",
    "klavier",
    1,
    _moll(cedar.A),
    Teil("I | I | IV | V", cedar.A.melodie),
    _kopf_zwei(cedar.KOPF, "I | I"),
)
RIVERTON = Kopf(
    "riverton",
    "trompete_gedaempft",
    1,
    _moll(akt2_riverton.A),
    Teil("I | I | IV | V7", akt2_riverton.A.melodie),
    _kopf_zwei(akt2_riverton.KOPF, "I | I"),
)
IRONWOOD = Kopf(
    "ironwood",
    "klarinette",
    1,
    _moll(Teil(akt2_ironwood.A_AKKORDE, akt2_ironwood.A_MELODIE)),
    Teil("I | vi | IV | V", akt2_ironwood.A_MELODIE),
    _kopf_zwei(akt2_ironwood.KOPF, "I | IV"),
)
# Silicon Bay ist lydisch: Die ♯4 bleibt in der eigenen Farbe. Im Kinderlied am Feuer und im
# fröhlichen Zug wird sie zur reinen 4 (Kinder kennen den fremden Ton nicht, wie Mira, A1).
SILICON = Kopf(
    "silicon",
    "vibraphon",
    1,
    Teil(akt3_siliconbay.A.akkorde, akt3_siliconbay.A.melodie),
    Teil("I | V | I | V", akt3_siliconbay.A.melodie.replace("#4", "4")),
    _kopf_zwei(akt3_siliconbay.KOPF.replace("#4", "4"), "I | V"),
)
PORT = Kopf(
    "port",
    "trompete",
    1,
    Teil(akt3_delacroix.A.akkorde, akt3_delacroix.A.melodie),
    Teil(akt3_delacroix.A.akkorde, akt3_delacroix.A.melodie),
    _kopf_zwei(akt3_delacroix.KOPF, "I | IV I"),
)
DESERT = Kopf(
    "desert",
    "egitarre",
    1,
    Teil(akt3_desert.A.akkorde, akt3_desert.A.melodie),
    Teil(akt3_desert.A.akkorde, akt3_desert.A.melodie),
    _kopf_zwei(akt3_desert.KOPF, "I | IV"),
)
SUMMIT = Kopf(
    "summit",
    "klavier",
    1,
    Teil(akt4_summit.A.akkorde, akt4_summit.A.melodie),
    Teil(akt4_summit.A.akkorde, akt4_summit.A.melodie),
    _kopf_zwei(akt4_summit.KOPF, "I | V"),
)

# Reihenfolge der Akte: Maple Falls und Cedar Creek (1), Riverton und Ironwood (2), Silicon Bay,
# Port Delacroix und Desert Springs (3), Summit City (4).
ALLE = (MAPLE, CEDAR, RIVERTON, IRONWOOD, SILICON, PORT, DESERT, SUMMIT)


def teile(koepfe: tuple[Kopf, ...], fassung: str, praefix: str) -> dict[str, Teil]:
    """Die Köpfe als Teile, benannt „praefix_ort“. ``fassung`` ist „eigen“, „dur“ oder „zwei“.

    Beispiel: teile(ALLE, "zwei", "s") ergibt s_maple, s_cedar … für die Strophen am Lagerfeuer.
    """
    return {f"{praefix}_{k.ort}": getattr(k, fassung) for k in koepfe}


def stimmen(
    koepfe: tuple[Kopf, ...],
    praefix: str,
    staerke: int,
    lautstaerke: float = 0.8,
    instrument: str = "",
    oktave: int | None = None,
) -> tuple[Stimme, ...]:
    """Je Kopf eine Melodiestimme im Instrument des Orts (oder ``instrument``), nur in seinem Teil.

    ``oktave`` ersetzt die Lage des Kopfs, wenn ein anderes Instrument alle Köpfe spielt.
    """
    return tuple(
        Stimme(
            instrument or k.instrument,
            "melodie",
            lautstaerke,
            0.15,
            0.3,
            k.oktave if oktave is None else oktave,
            staerke,
            frozenset({f"{praefix}_{k.ort}"}),
        )
        for k in koepfe
    )
