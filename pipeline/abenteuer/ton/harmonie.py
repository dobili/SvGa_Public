"""Akkorde aus Stufensymbolen und ihre Lagen für Gitarre, Klavier, Streicher und Bass.

Warum: Die Stücke des Spiels werden als Akkordfolge plus Melodie notiert (``satzplan.py``). Damit
dieselbe Folge in jeder Tonart und auf jedem Instrument klingt, stehen Akkorde als Stufensymbole:
Großbuchstaben für Dur (``IV``), Kleinbuchstaben für Moll (``vi``), dahinter ``7`` (Septakkord),
``maj7``, ``6``, ``sus4``, ``add9``, ``°`` (vermindert) oder ``ø`` (halbvermindert); davor ``b`` oder
``#`` für Akkorde von außerhalb der Leiter (``bVII``). Ein Basston nach Schrägstrich ist eine Stufe
(``I/3``: G-Dur mit H im Bass). ``N.C.`` heißt kein Akkord (Pause der Begleitung).

Beispiel aus dem Klangplan: Maple Falls in G-Dur, ``I | IV | vi | V`` ist G, C, e-Moll, D.
"""

import re
from dataclasses import dataclass

from pipeline.abenteuer.ton.motive import HALBTOENE_JE_OKTAVE, Tonart, tonhoehe

ROEMISCH = {"i": 1, "ii": 2, "iii": 3, "iv": 4, "v": 5, "vi": 6, "vii": 7}
SYMBOL = re.compile(
    r"^(?P<vorzeichen>[b#]?)(?P<stufe>VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)"
    r"(?P<art>maj7|add9|sus4|sus2|°7|°|ø|7|6|9)?(?:/(?P<bass>[b#]?[1-7]))?$"
)
# Halbtöne über dem Grundton je Akkordart; Dur oder Moll entscheidet die Schreibweise der Stufe.
DREIKLANG = {"dur": (0, 4, 7), "moll": (0, 3, 7)}
ZUSATZ = {
    None: (),
    "7": (10,),
    "maj7": (11,),
    "6": (9,),
    "9": (10, 14),
    "add9": (14,),
}
KEIN_AKKORD = "N.C."
# Lagen in MIDI-Nummern: tiefster Basston (E1) und Mitte der Klavierlage (E4).
BASS_TIEFST = 28
KLAVIER_MITTE = 64
GITARRE_TIEFST = 40


@dataclass(frozen=True)
class Akkord:
    """Ein Akkord: Grundton als MIDI-Nummer in der tiefen Oktave, Töne als Abstände, Basston."""

    grundton: int
    abstaende: tuple[int, ...]
    bass: int

    def klassen(self) -> set[int]:
        """Tonklassen 0 bis 11 aller Akkordtöne. Beispiel: G-Dur ist {7, 11, 2}."""
        return {(self.grundton + a) % HALBTOENE_JE_OKTAVE for a in self.abstaende}


def akkord(symbol: str, tonart: Tonart) -> Akkord | None:
    """Ein Stufensymbol als Akkord in einer Tonart; ``N.C.`` ergibt None.

    Beispiel: akkord("V7", G_DUR) ist D-Dur mit c (D, Fis, A, C). Sonderfälle: Unbekannte Symbole
    werfen ValueError; die Stufe zählt in der Leiter der Tonart, ``bVII`` liegt einen Halbton tiefer.
    """
    if symbol == KEIN_AKKORD:
        return None
    treffer = SYMBOL.match(symbol)
    if treffer is None:
        raise ValueError(f"Unbekanntes Akkordsymbol: {symbol!r}")
    stufe = ROEMISCH[treffer["stufe"].lower()]
    grund = tonhoehe(f"{treffer['vorzeichen']}{stufe}", tonart) % HALBTOENE_JE_OKTAVE + BASS_TIEFST - 4
    grund += HALBTOENE_JE_OKTAVE if grund < BASS_TIEFST else 0
    abstaende = _abstaende(treffer["art"], treffer["stufe"].islower())
    bass = grund
    if treffer["bass"]:
        bass_klasse = tonhoehe(treffer["bass"], tonart) % HALBTOENE_JE_OKTAVE
        bass = BASS_TIEFST + (bass_klasse - BASS_TIEFST) % HALBTOENE_JE_OKTAVE
    return Akkord(grund, abstaende, bass)


def _abstaende(art: str | None, moll: bool) -> tuple[int, ...]:
    """Abstände je Akkordart. Beispiel: ("7", False) ist (0, 4, 7, 10), ("°", True) (0, 3, 6)."""
    if art in ("°", "°7"):
        return (0, 3, 6, 9) if art == "°7" else (0, 3, 6)
    if art == "ø":
        return (0, 3, 6, 10)
    if art in ("sus4", "sus2"):
        return (0, 5 if art == "sus4" else 2, 7)
    return DREIKLANG["moll" if moll else "dur"] + ZUSATZ[art]


def griff(a: Akkord) -> tuple[int, ...]:
    """Eine Gitarrenlage von unten: Bass, Quinte, Oktave, Terz, Quinte, Oktave (wie offene Griffe).

    Beispiel: G-Dur ergibt G2 D3 G3 H3 D4 G4. Sonderfall: Septakkorde ersetzen die obere Oktave
    durch die Septime, damit sie hörbar ist.
    """
    grund = a.grundton if a.grundton >= GITARRE_TIEFST else a.grundton + HALBTOENE_JE_OKTAVE
    terz, quinte = a.abstaende[1], a.abstaende[2]
    oben = a.abstaende[3] if len(a.abstaende) > 3 else HALBTOENE_JE_OKTAVE * 2
    oktave = HALBTOENE_JE_OKTAVE
    return (
        grund,
        grund + quinte,
        grund + oktave,
        grund + oktave + terz,
        grund + oktave + quinte,
        grund + (oben if oben > oktave else oben + oktave),
    )


def lage(a: Akkord, mitte: int = KLAVIER_MITTE, stimmen: int = 3) -> tuple[int, ...]:
    """Enge Lage um eine Mitte: die Akkordtöne, die der Mitte am nächsten liegen, aufsteigend.

    Warum: Klavier und Streicher sollen nicht springen; die Töne bleiben in einem schmalen Band.
    Beispiel: lage(C-Dur, 64) ist (60, 64, 67). Sonderfall: Mehr Stimmen als Akkordtöne verdoppeln.
    """
    kandidaten = [
        t
        for t in range(mitte - HALBTOENE_JE_OKTAVE, mitte + HALBTOENE_JE_OKTAVE)
        if t % HALBTOENE_JE_OKTAVE in a.klassen()
    ]
    kandidaten.sort(key=lambda t: (abs(t - mitte), t))
    return tuple(sorted(kandidaten[:stimmen]))


def basston(a: Akkord, oktave: int = 0) -> int:
    """Der Basston (Grundton oder Ton nach Schrägstrich) in der tiefen Lage, plus Oktaven."""
    return a.bass + oktave * HALBTOENE_JE_OKTAVE


def quintbass(a: Akkord, oktave: int = 0) -> int:
    """Die Quinte unter oder über dem Grundton, je nachdem, was im Bassbereich liegt."""
    quinte = a.grundton + a.abstaende[2] + oktave * HALBTOENE_JE_OKTAVE
    return quinte - HALBTOENE_JE_OKTAVE if quinte - HALBTOENE_JE_OKTAVE >= BASS_TIEFST else quinte
