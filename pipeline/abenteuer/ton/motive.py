"""Leitmotive als Stufen der Tonleiter und ihre abgeleiteten Fassungen.

Warum: Der Klangplan (``docs/spiel/21_Klangplan.md``, Abschnitt A1) gibt jedes Motiv in Stufen an,
damit es in jeder Tonart stehen kann. Die Verwandtschaften (Victor spielt Ambroses Kopf, der
Konzernton ist Ambroses fremder Ton, das Heldenthema beginnt auf Ambroses offener 2, Maple Falls
beginnt mit Mamas Kopf) stehen hier als Ableitungen im Code. Ändert sich ein Motiv, ändern sich alle
Fassungen mit, und die Tests prüfen die Verwandtschaften.

Schreibweise einer Stufe: Ziffer 1 bis 7, davor ``#`` (erhöht) oder ``b`` (erniedrigt), danach je
``'`` eine Oktave höher und je ``,`` eine Oktave tiefer. Beispiel: ``#4`` ist die übermäßige
Quarte, ``1'`` der Grundton eine Oktave höher, ``5,`` die Quinte eine Oktave tiefer.
"""

import re
from dataclasses import dataclass

# Halbtonabstände der Stufen 1 bis 7 vom Grundton.
DUR = (0, 2, 4, 5, 7, 9, 11)
MOLL = (0, 2, 3, 5, 7, 8, 10)
HALBTOENE_JE_OKTAVE = 12
# MIDI-Nummern der Grundtöne, in deren Oktave die unmarkierten Stufen liegen (G3 = 55, E2 = 40).
G3 = 55
E2 = 40

STUFE = re.compile(r"^(?P<vorzeichen>[#b]?)(?P<ziffer>[1-7])(?P<oktaven>'*|,*)$")


@dataclass(frozen=True)
class Tonart:
    """Grundton (MIDI-Nummer) und Leiter. Beispiel: G-Dur als Tonart(G3, DUR)."""

    grundton: int
    leiter: tuple[int, ...] = DUR


G_DUR = Tonart(G3, DUR)
E_MOLL_BASS = Tonart(E2, MOLL)


@dataclass(frozen=True)
class Motiv:
    """Ein Leitmotiv: Stufen und Dauern in Schlägen (Viertel = 1).

    Beispiel: Ambroses Kopf ist Motiv(("5", "3", "#4", "2"), (1, 2, 1, 2)).
    """

    name: str
    stufen: tuple[str, ...]
    dauern: tuple[float, ...]

    def __post_init__(self) -> None:
        if len(self.stufen) != len(self.dauern):
            raise ValueError(f"{self.name}: {len(self.stufen)} Stufen, aber {len(self.dauern)} Dauern")


def tonhoehe(stufe: str, tonart: Tonart = G_DUR) -> int:
    """MIDI-Nummer einer Stufe in einer Tonart.

    Warum: Alle Fassungen rechnen Stufen erst beim Setzen in Töne um, damit dieselbe Stufe in jeder
    Tonart der Ton des Motivs bleibt.
    Eingaben: Stufe in der Schreibweise des Dateikopfs, Tonart. Ausgabe: MIDI-Nummer.
    Beispiel: tonhoehe("#4") in G-Dur ist 61 (Cis 4), der fremde Ton in Ambroses Kopf.
    Sonderfälle: Unbekannte Schreibweise wirft ValueError.
    """
    treffer = STUFE.match(stufe)
    if treffer is None:
        raise ValueError(f"Unbekannte Stufe: {stufe!r}")
    vorzeichen = {"": 0, "#": 1, "b": -1}[treffer["vorzeichen"]]
    oktaven = treffer["oktaven"]
    verschiebung = len(oktaven) if oktaven.startswith("'") else -len(oktaven)
    abstand = tonart.leiter[int(treffer["ziffer"]) - 1] + vorzeichen
    return tonart.grundton + abstand + verschiebung * HALBTOENE_JE_OKTAVE


def toene(motiv: Motiv, tonart: Tonart = G_DUR, oktave: int = 0) -> list[int]:
    """MIDI-Nummern eines Motivs. Beispiel: toene(AMBROSE_KOPF) == [62, 59, 61, 57] (D H Cis A)."""
    return [tonhoehe(stufe, tonart) + oktave * HALBTOENE_JE_OKTAVE for stufe in motiv.stufen]


def gleiche_dauern(motiv: Motiv, dauer: float, name: str) -> Motiv:
    """Dieselben Stufen in gleichen Notenwerten. Beispiel: Victor spielt Ambroses Kopf in Achteln."""
    return Motiv(name, motiv.stufen, tuple(dauer for _ in motiv.stufen))


def rein(motiv: Motiv, name: str) -> Motiv:
    """Dasselbe Motiv ohne den fremden Ton: jede ``#4`` wird zur reinen ``4`` (Ambrose, rein; Mira)."""
    stufen = tuple(stufe.replace("#4", "4") for stufe in motiv.stufen)
    return Motiv(name, stufen, motiv.dauern)


def verbinde(name: str, *teile: Motiv) -> Motiv:
    """Mehrere Motive hintereinander. Beispiel: Ambrose vollständig = Kopf + Antwort."""
    stufen = tuple(stufe for teil in teile for stufe in teil.stufen)
    dauern = tuple(dauer for teil in teile for dauer in teil.dauern)
    return Motiv(name, stufen, dauern)


# Klangplan A1, „Ambrose, Kopf“: frei, der zweite und vierte Ton gedehnt.
AMBROSE_KOPF = Motiv("Ambrose, Kopf", ("5", "3", "#4", "2"), (1, 2, 1, 2.5))
# „Ambrose, vollständig“: Kopf + 3 – 1 – 2 – 1, die zweite Hälfte landet auf dem Grundton.
AMBROSE_ANTWORT = Motiv("Ambrose, Antwort", ("3", "1", "2", "1"), (1, 1.5, 1, 3))
AMBROSE_VOLLSTAENDIG = verbinde("Ambrose, vollständig", AMBROSE_KOPF, AMBROSE_ANTWORT)
AMBROSE_REIN = rein(AMBROSE_VOLLSTAENDIG, "Ambrose, rein")
# „Victor“: genau die Töne des Kopfes, gleich lange Achtel, streng im Takt.
VICTOR = gleiche_dauern(AMBROSE_KOPF, 0.5, "Victor")
# „Konzern“: ein einziger Ton, der fremde Ton aus Ambroses Kopf.
KONZERN = Motiv("Konzern", (AMBROSE_KOPF.stufen[2],), (1.5,))
# „Mama“: 1 – 2 – 3 – 5 – 6, Auflösung auf 5; die 5 gehalten, als ob sie zögert.
MAMA = Motiv("Mama", ("1", "2", "3", "5", "6", "5"), (1, 1, 1, 3, 1.5, 4))
# „Held“: beginnt auf Ambroses offener 2 und steigt zu dem Ton, mit dem Ambrose anfängt.
HELD = Motiv("Held", (AMBROSE_KOPF.stufen[-1], "3", AMBROSE_KOPF.stufen[0]), (1, 1, 2))
HELD_VOLLSTAENDIG = verbinde(
    "Held, vollständig",
    HELD,
    Motiv("Held, zweite Phrase", (*HELD.stufen, MAMA.stufen[4]), (1, 1, 1, 1)),
    Motiv("Held, Abstieg", ("5", "3", "2", "1"), (1, 1, 1, 4)),
)
# „Aha“: 2 – 5 aufwärts, dann ein Hauch der 1 darüber (Gerüst des Heldenthemas).
AHA = Motiv("Aha", ("2", "5", "1'"), (0.25, 0.5, 1.5))
# Ortsthema Maple Falls: beginnt mit Mamas Kopf (1 – 2 – 3 – 5), steigt zu Ambroses Anfangston.
MAPLE_FALLS_KOPF = Motiv("Maple Falls, Kopf", MAMA.stufen[:4], (1, 1, 1, 1))
