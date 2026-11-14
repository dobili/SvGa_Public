"""Begleitmuster: wie ein Instrument einen Akkord über einen Takt spielt.

Warum: Ein Ortsthema klingt in jeder Fassung anders, obwohl Melodie und Akkorde gleich bleiben
(Klangplan, Grundsatz 2): Auf dem Weg zupft die Gitarre schneller, im Clubraum schlägt sie, in der
Bibliothek hält das Klavier nur. Jedes Muster nimmt einen Abschnitt (Akkord, Beginn, Dauer,
Taktart) und gibt Noten zurück. ``satzplan.py`` wählt je Stimme ein Muster aus ``MUSTER``.

Zeiten in Schlägen (Viertel = 1). Achtel auf „und“ werden später für Swing verschoben (``satzplan``).
"""

from collections.abc import Callable
from dataclasses import dataclass

from pipeline.abenteuer.ton.harmonie import Akkord, basston, griff, lage, quintbass
from pipeline.abenteuer.ton.satz import LEISE, Note

ACHTEL = 0.5
SECHZEHNTEL = 0.25
# Versatz der Saiten beim Anschlagen (Schläge), damit ein Schlag nicht wie ein Block klingt.
ANSCHLAG_VERSATZ = 0.025
BETONUNG = 12
HALBTON = 1
OKTAVE = 12


@dataclass(frozen=True)
class Abschnitt:
    """Ein Akkord über eine Zeit: Beginn und Dauer in Schlägen, Taktart, nächster Akkord, Takt."""

    akkord: Akkord
    beginn: float
    dauer: float
    taktart: int
    naechster: Akkord | None
    takt: int
    staerke: int = LEISE
    lage: int = 0


Muster = Callable[[Abschnitt], list[Note]]


def _schritte(a: Abschnitt, schritt: float) -> list[float]:
    """Zeitpunkte im Abstand ``schritt`` innerhalb des Abschnitts."""
    anzahl = round(a.dauer / schritt)
    return [a.beginn + i * schritt for i in range(anzahl)]


# Tiefster Ton einer Gitarre (E2); ein Griff, der darunter läge, rückt eine Oktave hinauf.
GITARRE_TIEFST = 40


def _griff(a: Abschnitt) -> list[int]:
    """Der Gitarrengriff in der Lage des Abschnitts, nie unter dem tiefsten Ton der Gitarre."""
    toene = [t + a.lage * OKTAVE for t in griff(a.akkord)]
    while toene[0] < GITARRE_TIEFST:
        toene = [t + OKTAVE for t in toene]
    return toene


def zupfen(a: Abschnitt) -> list[Note]:
    """Fingerpicking in Achteln (Bogen auf und ab), Bass auf jedem Takt-Anfang betont.

    Beispiel: G-Dur in 4/4 ergibt G2 D3 G3 H3 D4 H3 G3 D3. Jede Note klingt zwei Achtel.
    """
    toene = _griff(a)
    folge = (0, 1, 2, 3, 4, 3, 2, 1) if a.taktart == 4 else (0, 2, 3, 4, 3, 2)
    noten = []
    for i, zeit in enumerate(_schritte(a, ACHTEL)):
        ton = toene[folge[i % len(folge)]]
        betont = BETONUNG if i % len(folge) == 0 else 0
        noten.append(Note(ton, zeit, ACHTEL * 2, a.staerke + betont))
    return noten


def travis(a: Abschnitt) -> list[Note]:
    """Wechselbass mit Daumen (Grundton, Quinte) auf den Vierteln, Diskant auf den Achteln dazwischen."""
    toene = _griff(a)
    noten = []
    for i, zeit in enumerate(_schritte(a, ACHTEL)):
        if i % 2 == 0:
            ton = toene[0] if (i // 2) % 2 == 0 else toene[1]
            noten.append(Note(ton, zeit, 1.0, a.staerke + BETONUNG // 2))
        else:
            noten.append(Note(toene[3 + (i // 2) % 3], zeit, ACHTEL * 2, a.staerke - 4))
    return noten


def schlagen(a: Abschnitt) -> list[Note]:
    """Gitarre anschlagen: ab, ab-auf, auf-ab-auf (Volksmusik-Schlagmuster), Abschläge lauter."""
    toene = _griff(a)
    muster = (0, 1, 1.5, 2.5, 3, 3.5) if a.taktart == 4 else (0, 1, 1.5, 2, 2.5)
    noten = []
    for takt_beginn in _schritte(a, a.taktart):
        for zeit in muster:
            if zeit >= a.dauer:
                continue
            abschlag = zeit == int(zeit)
            saiten = toene if abschlag else list(reversed(toene[2:]))
            for j, ton in enumerate(saiten):
                staerke = a.staerke + (BETONUNG if zeit == 0 else 0) - (0 if abschlag else 8)
                noten.append(Note(ton, takt_beginn + zeit + j * ANSCHLAG_VERSATZ, ACHTEL, staerke))
    return noten


def halten(a: Abschnitt) -> list[Note]:
    """Liegender Akkord in enger Lage (Streicher, Orgel, Klavier mit Pedal)."""
    return [Note(t, a.beginn, a.dauer, a.staerke) for t in lage(a.akkord, 60 + a.lage * OKTAVE)]


def tupfen(a: Abschnitt) -> list[Note]:
    """Klavier tupft den Akkord auf 1 und auf „zwei und“ (4/4) oder 1 und 2 (3/4), leise."""
    zeiten = (0, 1.5, 3) if a.taktart == 4 else (0, 2)
    toene = lage(a.akkord, 64 + a.lage * OKTAVE)
    return [
        Note(t, takt + z, 1.0, a.staerke - (6 if z else 0))
        for takt in _schritte(a, a.taktart)
        for z in zeiten
        if z < a.dauer
        for t in toene
    ]


def stride(a: Abschnitt) -> list[Note]:
    """Bass auf 1 und 3, Akkord auf 2 und 4 (Ragtime, Kneipenklavier); in 3/4 wird es ein Walzer."""
    if a.taktart == 3:
        return walzer(a)
    akk = lage(a.akkord, 60 + a.lage * OKTAVE)
    noten = []
    for i, zeit in enumerate(_schritte(a, 1.0)):
        if i % 2 == 0:
            ton = basston(a.akkord, 1) if i % 4 == 0 else quintbass(a.akkord, 1)
            noten.append(Note(ton, zeit, 0.9, a.staerke + BETONUNG // 2))
        else:
            noten += [Note(t, zeit, 0.6, a.staerke - 4) for t in akk]
    return noten


def walzer(a: Abschnitt) -> list[Note]:
    """Walzer: Bass auf 1, Akkord auf 2 und 3."""
    akk = lage(a.akkord, 64 + a.lage * OKTAVE)
    noten = []
    for i, zeit in enumerate(_schritte(a, 1.0)):
        if i % a.taktart == 0:
            noten.append(Note(basston(a.akkord, 1), zeit, 1.0, a.staerke + BETONUNG // 2))
        else:
            noten += [Note(t, zeit, 0.7, a.staerke - 6) for t in akk]
    return noten


def harfe(a: Abschnitt) -> list[Note]:
    """Aufsteigender Akkord in Sechzehnteln über zwei Oktaven, einmal je Abschnitt (Harfe, Celesta)."""
    toene = sorted({*griff(a.akkord), *(t + OKTAVE for t in griff(a.akkord)[2:])})
    toene = [t + a.lage * OKTAVE for t in toene]
    return [
        Note(t, a.beginn + i * SECHZEHNTEL, a.dauer - i * SECHZEHNTEL, a.staerke)
        for i, t in enumerate(toene)
        if i * SECHZEHNTEL < a.dauer
    ]


def bass_grund(a: Abschnitt) -> list[Note]:
    """Der Basston liegt über den ganzen Abschnitt (Cello, gestrichener Kontrabass)."""
    return [Note(basston(a.akkord, a.lage), a.beginn, a.dauer, a.staerke)]


def bass_wechsel(a: Abschnitt) -> list[Note]:
    """Grundton auf 1, Quinte auf 3 (4/4) oder nur Grundton auf 1 (3/4), gezupft."""
    noten = [Note(basston(a.akkord, a.lage), a.beginn, min(a.dauer, 2.0), a.staerke + BETONUNG // 2)]
    if a.taktart == 4 and a.dauer >= a.taktart:
        noten.append(Note(quintbass(a.akkord, a.lage), a.beginn + 2, 2.0, a.staerke))
    return noten


def bass_laufend(a: Abschnitt) -> list[Note]:
    """Laufender Bass in Vierteln (Jazz): Grundton, Terz, Quinte, dann Leitton zum nächsten Akkord."""
    grund = basston(a.akkord, a.lage)
    ziel = basston(a.naechster, a.lage) if a.naechster else grund
    if ziel - grund > 6:
        ziel -= OKTAVE
    elif grund - ziel > 6:
        ziel += OKTAVE
    leit = ziel - HALBTON if ziel > grund else ziel + HALBTON
    terz, quinte = grund + a.akkord.abstaende[1], grund + a.akkord.abstaende[2]
    zeiten = _schritte(a, 1.0)
    folge = {1: [grund], 2: [grund, leit], 3: [grund, quinte, leit]}.get(len(zeiten))
    if folge is None:
        folge = [grund, terz, quinte] + [quinte] * (len(zeiten) - 4) + [leit]
    return [
        Note(ton, z, 0.95, a.staerke + (BETONUNG // 2 if i == 0 else 0))
        for i, (ton, z) in enumerate(zip(folge, zeiten, strict=True))
    ]


def bass_zweier(a: Abschnitt) -> list[Note]:
    """Country-Zweier: Grundton auf 1, Quinte auf 3, kurz (Kontrabass, Tuba)."""
    noten = []
    for i, zeit in enumerate(_schritte(a, 2.0 if a.taktart == 4 else 3.0)):
        ton = basston(a.akkord, a.lage) if i % 2 == 0 else quintbass(a.akkord, a.lage)
        noten.append(Note(ton, zeit, 1.0, a.staerke + (BETONUNG // 2 if i % 2 == 0 else 0)))
    return noten


def wiegen(a: Abschnitt) -> list[Note]:
    """Linke Hand am Klavier in Vierteln: Bass, Quinte, Oktave, Terz (ruhig, für Klavier allein)."""
    toene = _griff(a)
    folge = (0, 1, 2, 3) if a.taktart == 4 else (0, 1, 3)
    return [
        Note(toene[folge[i % len(folge)]], zeit, 2.0, a.staerke + (BETONUNG // 2 if i == 0 else -4))
        for i, zeit in enumerate(_schritte(a, 1.0))
    ]


def stoss(a: Abschnitt) -> list[Note]:
    """Ein einzelner Akkord auf der Eins des Abschnitts, kurz (Bläser, Orchesterschlag)."""
    return [Note(t, a.beginn, 0.5, a.staerke + BETONUNG) for t in lage(a.akkord, 60 + a.lage * OKTAVE, 4)]


MUSTER: dict[str, Muster] = {
    "wiegen": wiegen,
    "stoss": stoss,
    "zupfen": zupfen,
    "travis": travis,
    "schlagen": schlagen,
    "halten": halten,
    "tupfen": tupfen,
    "stride": stride,
    "walzer": walzer,
    "harfe": harfe,
    "bass_grund": bass_grund,
    "bass_wechsel": bass_wechsel,
    "bass_laufend": bass_laufend,
    "bass_zweier": bass_zweier,
}
