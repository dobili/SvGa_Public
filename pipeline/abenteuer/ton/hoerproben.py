"""Die Hörproben für die Entscheidung des Autors: fünf Leitmotive und das Ortsthema Maple Falls.

Warum: Bevor alle Fassungen gesetzt werden, soll der Autor hören, ob gerenderte Noten mit freien
Instrumenten genügen (``docs/spiel/28_Tonquellen.md``, Abschnitt 5, Schritt 1). Jede Probe setzt
ein Motiv aus ``motive.py`` nach den Angaben im Klangplan (``docs/spiel/21_Klangplan.md``, A1 bis
A4: Instrument, Tempo, Spielweise). Wo der Klangplan eine Gitarre verlangt, spielt hier die Harfe:
Die freien Bibliotheken haben keine Gitarre (Lücke, ``28_Tonquellen.md`` Abschnitt 3.3).
"""

from pipeline.abenteuer.ton.motive import (
    AHA,
    AMBROSE_KOPF,
    AMBROSE_VOLLSTAENDIG,
    E_MOLL_BASS,
    HELD,
    HELD_VOLLSTAENDIG,
    KONZERN,
    MAMA,
    VICTOR,
    Motiv,
    tonhoehe,
)
from pipeline.abenteuer.ton.satz import (
    KRAEFTIG,
    LEISE,
    MITTEL,
    Note,
    Spur,
    Stueck,
    akkord,
    mit_vorschlag,
    pedal,
    setze,
)

# Schläge je Takt (Viertel, 4/4).
TAKT = 4


def stufen(*namen: str) -> tuple[int, ...]:
    """Akkordtöne in G-Dur aus Stufen. Beispiel: stufen("1,", "5,", "3") ist G2, D3, H3."""
    return tuple(tonhoehe(name) for name in namen)


def ambrose() -> Stueck:
    """Ambroses Kopf auf dem alten Klavier, dann vollständig auf dem Cembalo mit Trugschluss.

    Klangplan A1 und A3 (``ambrose``): frei, zweiter und vierter Ton gedehnt, Vorschlag vor der ♯4,
    viel Pedal, darunter leise Gitarre. Die vollständige Fassung endet bis Kapitel 57 offen: Die
    Melodie landet auf dem Grundton, die Begleitung auf der 6. Stufe (e-Moll).
    """
    kopf = setze(AMBROSE_KOPF, 0, staerke=MITTEL)
    kopf = pedal(mit_vorschlag(kopf, 2, tonhoehe("5")), sum(AMBROSE_KOPF.dauern) + 1)
    zweiter_beginn = 9.0
    voll = setze(AMBROSE_VOLLSTAENDIG, zweiter_beginn, staerke=MITTEL)
    voll = mit_vorschlag(voll, 2, tonhoehe("5"))
    begleitung = _ambrose_begleitung(zweiter_beginn)
    return Stueck(
        "ambrose",
        "Ambrose: Kopf (altes Klavier), dann vollständig (Cembalo) mit Trugschluss",
        66,
        [
            Spur("klavier_alt", kopf, hall=0.45, panorama=-0.1),
            Spur("cembalo", voll, hall=0.35, panorama=0.15),
            Spur("harfe", begleitung, lautstaerke=0.6, hall=0.4, panorama=-0.3),
        ],
        "Die vier Töne D – H – Cis – A sind dieselben wie in Victors Probe.",
    )


def _ambrose_begleitung(beginn: float) -> list[Note]:
    """Leise Akkorde unter der vollständigen Fassung: G, A, G, D, dann e-Moll (Trugschluss)."""
    folge = [
        (0.0, 3.0, stufen("1,", "5,", "3")),
        (3.0, 3.5, stufen("2,", "6,", "#4")),
        (6.5, 1.0, stufen("1,", "5,", "3")),
        (7.5, 2.5, stufen("5,", "2", "#4")),
        (10.0, 4.0, stufen("6,,", "3,", "6,", "3")),
    ]
    noten: list[Note] = []
    for versatz, dauer, toene in folge:
        noten += akkord(toene, beginn + versatz, dauer, LEISE)
    return noten


def victor_konzern() -> Stueck:
    """Victors Motiv in Achteln über dem e-Moll-Bass, danach der einzelne Konzernton.

    Klangplan A1 und A3 (``victor``): gleich lange Achtel, streng, ohne Pedal, trockenes helles
    Klavier, 120 Schläge je Minute, darunter ein gleichmäßiger Bass in e-Moll. Kurzmotiv
    ``konzern`` (A4): trockenes Digitalpiano, ein Ton, ohne Nachhall, abrupt abgedämpft.
    """
    bass: list[Note] = []
    takte_bass = 4
    for schlag in range(takte_bass * TAKT):
        stufe = "1" if schlag % 2 == 0 else "5,"
        bass.append(Note(tonhoehe(stufe, E_MOLL_BASS), schlag, 0.9, LEISE))
    motiv: list[Note] = []
    for beginn in (4.0, 6.0, 8.0, 12.0):
        motiv += setze(VICTOR, beginn, oktave=1, staerke=KRAEFTIG)
    konzern_beginn = 18.0
    konzern = setze(KONZERN, konzern_beginn, staerke=KRAEFTIG)
    return Stueck(
        "victor_konzern",
        "Victor (trockenes Klavier über e-Moll) und der Konzernton (Digitalpiano)",
        120,
        [
            Spur("klavier_trocken", motiv, hall=0.08, panorama=0.1, streuung=0),
            Spur("klavier_trocken", bass, lautstaerke=0.8, hall=0.08, panorama=-0.15, streuung=0),
            Spur("digitalpiano", konzern, hall=0.0, streuung=0),
        ],
        "Victor spielt genau Ambroses vier Töne; der Konzernton ist dessen fremder Ton Cis.",
    )


def mama() -> Stueck:
    """Mamas Thema: erst abgebrochen nach der 5, dann vollständig mit der 6 und der Auflösung.

    Klangplan A1 (``Mama``): Klavier allein, langsam, die 5 gehalten, als ob sie zögert. In
    Kapitel 25 bricht es nach der 5 ab, vollständig erst in Kapitel 27.
    """
    abgebrochen = Motiv("Mama, abgebrochen", MAMA.stufen[:4], MAMA.dauern[:4])
    erst = pedal(setze(abgebrochen, 0, staerke=LEISE), sum(abgebrochen.dauern))
    zweiter_beginn = 9.0
    voll = setze(MAMA, zweiter_beginn, staerke=LEISE + 5)
    links = (
        akkord(stufen("1,,", "5,,"), zweiter_beginn, 6, LEISE - 10)
        + akkord(stufen("4,,", "1,"), zweiter_beginn + 6, 1.5, LEISE - 10)
        + akkord(stufen("1,,", "5,,", "3,"), zweiter_beginn + 7.5, 4, LEISE - 10)
    )
    return Stueck(
        "mama",
        "Mama: abgebrochen nach der 5, dann vollständig (Klavier allein)",
        56,
        [
            Spur("klavier_alt", erst + voll, hall=0.4),
            Spur("klavier_alt", links, lautstaerke=0.7, hall=0.4, panorama=-0.2),
        ],
        "Mamas erste vier Töne sind der Anfang des Themas von Maple Falls.",
    )


def held() -> Stueck:
    """Das Heldenthema: erst die drei Töne allein, dann vollständig mit einfacher Begleitung.

    Klangplan A1 (``Held``): ein einzelnes Instrument, einfach, ohne Verzierung. Die vollständige
    Fassung (Sieg in Kapitel 39) steigt zu Mamas 6 und landet auf dem Grundton.
    """
    allein = setze(HELD, 0, staerke=MITTEL)
    zweiter_beginn = 6.0
    voll = setze(HELD_VOLLSTAENDIG, zweiter_beginn, staerke=MITTEL)
    links = (
        akkord(stufen("1,,", "5,,"), zweiter_beginn, 4)
        + akkord(stufen("4,,", "1,"), zweiter_beginn + 4, 4)
        + akkord(stufen("1,,", "5,,"), zweiter_beginn + 8, 2)
        + akkord(stufen("5,,", "2,"), zweiter_beginn + 10, 1)
        + akkord(stufen("1,,", "5,,", "3,"), zweiter_beginn + 11, 4)
    )
    return Stueck(
        "held",
        "Held: drei Töne allein, dann vollständig (Klavier)",
        84,
        [
            Spur("klavier", allein + voll, hall=0.3, panorama=0.1),
            Spur("klavier", links, lautstaerke=0.65, hall=0.3, panorama=-0.15),
        ],
        "Beginnt auf Ambroses offener 2 (A) und steigt zu seinem Anfangston (D).",
    )


def aha() -> Stueck:
    """Das Aha auf dem Glockenspiel: einmal hell, einmal ganz leise (wie bei „Zähl“, Kapitel 15)."""
    hoch = 2
    noten = setze(AHA, 0, oktave=hoch, staerke=MITTEL) + setze(AHA, 4, oktave=hoch, staerke=LEISE - 15)
    return Stueck(
        "aha",
        "Aha: Glockenspiel, hell und dann ganz leise",
        60,
        [Spur("glockenspiel", noten, hall=0.3)],
        "2 – 5 aufwärts, ein Hauch der 1: das Gerüst des Heldenthemas.",
    )


ALLE = (ambrose, victor_konzern, mama, held, aha)
