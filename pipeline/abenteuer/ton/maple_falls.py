"""Ortsthema Maple Falls als Hörprobe (etwa 45 Sekunden).

Warum: Das Thema von Maple Falls ist mit den Leitmotiven verwoben. Es beginnt mit Mamas Kopf
(1 – 2 – 3 – 5) und steigt zu Ambroses Anfangston; deshalb setzen wir es selbst statt es zu kaufen
(``docs/spiel/28_Tonquellen.md``, Abschnitt 2.1). Klangplan A2 (``mapleFalls``): warm, tastend,
Spätsommer; akustische Gitarre im Fingerpicking, leises Klavier, ab dem zweiten Durchgang Cello;
76 Schläge je Minute. Die Gitarre spielt hier die Harfe (Lücke der freien Bibliotheken).

Aufbau: zwei Takte Zupfen allein, sechs Takte Melodie, dieselbe Melodie noch einmal mit Cello,
Schluss auf G. 14 Takte zu 4 Schlägen bei 76 sind gut 44 Sekunden.
"""

from pipeline.abenteuer.ton.motive import MAPLE_FALLS_KOPF, Motiv, tonhoehe
from pipeline.abenteuer.ton.satz import LEISE, Note, Spur, Stueck, gebrochen, setze

TAKT = 4
TEMPO = 76
ACHTEL = 0.5
# Zupfmuster je Takt: Indizes in die Lage des Akkords (Grundton, Quinte, Oktave, Terz, Quinte, ...).
ZUPFMUSTER = (0, 1, 2, 3, 4, 3, 2, 1)
# Akkorde je Takt als Stufen des Grundtons in der tiefen Lage, dazu Dur oder Moll.
AKKORDFOLGE = (
    ("1,", "dur"),
    ("4,", "dur"),
    ("1,", "dur"),
    ("4,", "dur"),
    ("6,,", "moll"),
    ("5,,", "dur"),
    ("6,,", "moll"),
    ("5,,", "dur"),
    ("1,", "dur"),
    ("4,", "dur"),
    ("6,,", "moll"),
    ("5,,", "dur"),
    ("6,,", "moll"),
    ("1,", "dur"),
)
TERZ = {"dur": 4, "moll": 3}
QUINTE = 7
OKTAVE = 12
# Die Melodie: Mamas Kopf, dann ein Bogen über die 6 zurück und offen auf der 2 (erster Durchgang).
ZWEITE_PHRASE = Motiv("Maple Falls, Bogen", ("6", "5", "3", "2", "3", "2"), (3, 1, 2, 1, 1, 4))
ANTWORT = Motiv("Maple Falls, Antwort", MAPLE_FALLS_KOPF.stufen, MAPLE_FALLS_KOPF.dauern)
OFFEN = Motiv("Maple Falls, offen", ("5", "2"), (2, 2))
SCHLUSS = Motiv("Maple Falls, Schluss", ("1",), (4,))
# Gegenstimme des Cellos im zweiten Durchgang, eine Note je Takt.
CELLO = ("3,", "4,", "3,", "2,", "1,", "1,")


def lage(grundstufe: str, geschlecht: str) -> tuple[int, ...]:
    """Töne eines gezupften Akkords von unten. Beispiel: lage("1,", "dur") ist G2 D3 G3 H3 D4 G4."""
    grund = tonhoehe(grundstufe)
    terz = TERZ[geschlecht]
    return (
        grund,
        grund + QUINTE,
        grund + OKTAVE,
        grund + OKTAVE + terz,
        grund + OKTAVE + QUINTE,
        grund + 2 * OKTAVE,
    )


def zupfen() -> list[Note]:
    """Das Fingerpicking über alle Takte; im letzten Takt nur der Akkord, lange ausklingend."""
    noten: list[Note] = []
    letzter = len(AKKORDFOLGE) - 1
    for takt, (grundstufe, geschlecht) in enumerate(AKKORDFOLGE):
        toene = lage(grundstufe, geschlecht)
        beginn = takt * TAKT
        if takt == letzter:
            noten += [Note(ton, beginn + i * 0.12, TAKT, LEISE + 5) for i, ton in enumerate(toene[:5])]
        else:
            noten += gebrochen(toene, ZUPFMUSTER, beginn, ACHTEL, LEISE)
    return noten


def melodie(beginn_takt: int, schluss: Motiv) -> list[Note]:
    """Sechs Takte Melodie ab einem Takt: Kopf, Bogen, Antwort und Schluss (offen oder auf G)."""
    zeit = beginn_takt * TAKT
    noten: list[Note] = []
    for teil in (MAPLE_FALLS_KOPF, ZWEITE_PHRASE, ANTWORT, schluss):
        noten += setze(teil, zeit, staerke=LEISE + 10)
        zeit += sum(teil.dauern)
    return noten


def maple_falls() -> Stueck:
    """Das Ortsthema als Hörprobe. Beispiel: 14 Takte, gut 44 Sekunden."""
    erster, zweiter = 2, 8
    cello = [Note(tonhoehe(stufe), (zweiter + i) * TAKT, TAKT, LEISE) for i, stufe in enumerate(CELLO)]
    return Stueck(
        "maple_falls",
        "Ortsthema Maple Falls (Harfe statt Gitarre, Klavier, ab dem zweiten Durchgang Cello)",
        TEMPO,
        [
            Spur("harfe", zupfen(), lautstaerke=0.8, hall=0.3, panorama=-0.25),
            Spur("klavier", melodie(erster, OFFEN) + melodie(zweiter, SCHLUSS), hall=0.3, panorama=0.2),
            Spur("cello", cello, lautstaerke=0.55, hall=0.35, panorama=0.05),
        ],
        "Beginnt mit Mamas Kopf (G – A – H – D) und steigt zu Ambroses Anfangston D.",
    )
