"""Weitere Stücke von Akt 1: die Wege nach Cedar Creek, das Diner und das Nachtstück.

Warum: Der Weg ist das Thema von Maple Falls schneller (Klangplan A2, „weg“): Gitarre, Mundharmonika,
Fiedel; am Kürbishof Banjo statt Fiedel (hier der Strumstick, die freien Bibliotheken haben kein
Banjo); am Fluss nur Gitarre und Cello; am Zedernpfad klingt zum ersten Mal das Klavier von Cedar
Creek. Das Diner spielt „aus der Jukebox“ einen eigenen Blues. Das Nachtstück erklingt genau
dreimal im Spiel (Kapitel 14, 55, 59) und baut auf dem Aha (2 → 5) und dem Heldenthema (2 – 3 – 5).
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke import cedar
from pipeline.abenteuer.ton.stuecke.maple import teile as maple_teile

OBEN = 1


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


_MAPLE = maple_teile()
WEG_FORM = ("vor", "a1", "a2", "b", "a3", "a4", "b", "a6")
FIEDEL = nur("a1", "a2", "a6")
HARMONIKA = nur("b", "a3", "a4")


def _weg(kennung: str, titel: str, oben: str, beschreibung: str) -> Satz:
    """Der Weg: Thema von Maple Falls bei 112, Wechselbass, Zweierbass, leise Schellen."""
    return Satz(
        kennung,
        titel,
        "G",
        112,
        4,
        _MAPLE,
        WEG_FORM,
        (
            Stimme("gitarre", "travis", 0.8, -0.3, 0.2, 0, 50),
            Stimme(oben, "melodie", 0.75, 0.25, 0.25, OBEN, 60, FIEDEL),
            Stimme("mundharmonika", "melodie", 0.6, 0.2, 0.25, OBEN, 60, HARMONIKA),
            Stimme("kontrabass_pizz", "bass_zweier", 0.7, 0.0, 0.15, 1, 58),
            Stimme("schlagwerk", "schellen", 0.3, 0.35, 0.2, staerke=44),
        ),
        beschreibung=beschreibung,
    )


WEG = _weg("weg", "Landstraße", "geige", "Frei, Sommerende: das Thema von Maple Falls schneller, mit Fiedel.")
WEG_KUERBISHOF = _weg(
    "weg.kuerbishof", "Kürbishof", "strumstick", "Wie die Landstraße, mit gezupftem Strumstick statt Fiedel."
)

WEG_FLUSS = Satz(
    "weg.fluss",
    "Flussweg",
    "G",
    96,
    4,
    _MAPLE,
    ("vor", "a1", "a2", "b", "a3", "a4", "b", "a6"),
    (
        Stimme("gitarre", "zupfen", 0.8, -0.25, 0.3, 0, 46),
        Stimme("cello", "melodie", 0.8, 0.15, 0.35, 0, 54, nur("a1", "a2", "b", "a6")),
        Stimme("cello", "noten", 0.55, 0.15, 0.35, 1, 46, nur("a3", "a4"), "cello"),
        Stimme("gitarre", "melodie", 0.6, 0.1, 0.3, OBEN, 50, nur("a3", "a4")),
    ),
    beschreibung="Schattig, Atem holen: Gitarre allein und Cello, die Mundharmonika ist weg.",
)

WEG_ZEDERN = Satz(
    "weg.zedern",
    "Zedernpfad",
    "d",
    80,
    4,
    cedar.TEILE,
    cedar.FORM,
    (
        Stimme("gitarre", "zupfen", 0.75, -0.3, 0.3, 0, 40),
        Stimme("klavier", "melodie", 0.65, 0.2, 0.4, OBEN, 42, nur("a", "a2", "b")),
    ),
    beschreibung="Still, man kommt woanders an: leise Gitarre, darüber das Klavier von Cedar Creek.",
)

# Diner: ein Zwölftakt-Blues in C, frech und warm, aus der Jukebox.
BLUES = "I7 | IV7 | I7 | I7 | IV7 | IV7 | I7 | I7 | V7 | IV7 | I7 | V7"
DINER_A = Teil(
    BLUES,
    "5:1 r:0.5 5:0.5 6:1 5:1 | b7:1 6:1 5:2 | 3:1 5:1 1':1 6:1 | 5:4 | 4:1 r:0.5 4:0.5 5:1 4:1 | "
    "b3:1 3:1 1:2 | 3:1 5:1 6:1 5:1 | 3:2 r:2 | 2:1 4:1 6:1 5:1 | 4:1 2:1 1:2 | 3:1 1:1 5,:1 1:1 | 2:3 r:1",
)
DINER = Satz(
    "diner",
    "Diner",
    "C",
    112,
    4,
    {"a": DINER_A, "orgel": Teil(BLUES, DINER_A.melodie), "a2": DINER_A},
    ("a", "orgel", "a2"),
    (
        Stimme("egitarre", "melodie", 0.8, 0.2, 0.2, OBEN, 64, nur("a", "a2")),
        Stimme("hammond", "melodie", 0.65, 0.15, 0.2, OBEN, 60, nur("orgel")),
        Stimme("hammond", "halten", 0.45, -0.2, 0.2, 0, 44, nur("a", "a2")),
        Stimme("egitarre", "tupfen", 0.45, -0.3, 0.2, -1, 46, nur("orgel")),
        Stimme("kontrabass_pizz", "bass_laufend", 0.8, 0.0, 0.15, 1, 62),
        Stimme("schlagwerk", "besen", 0.45, 0.25, 0.15, staerke=54),
    ),
    swing=1 / 6,
    klangbild="lautsprecher",
    beschreibung="Frech, warm, Abend: Blues aus der Jukebox mit E-Gitarre, Orgel, Bass und Besen.",
)

# Nachtstück: weit und zärtlich, Klavier hoch, Glockenspiel, ein Hauch Streicher (D-Dur).
NACHT_A = Teil(
    "I | iii | IV | I | vi | IV | ii | V",
    "5:3 6:1 | 5:2 3:2 | 4:3 3:1 | 2:4 | 2:1 3:1 5:2 | 6:2 5:2 | 4:1 3:1 2:2 | 2:4",
)
NACHT_B = Teil(
    "IV | V | iii | vi | ii | V | I | I",
    "6:2 1':2 | 7:2 5:2 | 5:3 3:1 | 6:4 | 4:2 6:2 | 5:2 2:2 | 3:4 | 1:4",
)
NACHTSTUECK = Satz(
    "nachtstueck",
    "Nachtstück",
    "D",
    54,
    4,
    {"vor": Teil("I | IV"), "a": NACHT_A, "b": NACHT_B, "a2": NACHT_A, "b2": NACHT_B},
    ("vor", "a", "b", "a2", "b2"),
    (
        Stimme("klavier", "melodie", 0.8, 0.1, 0.5, OBEN, 46, nur("a", "b", "a2", "b2")),
        Stimme("glockenspiel", "melodie", 0.4, 0.3, 0.55, OBEN, 40, nur("b", "b2")),
        Stimme("klavier", "harfe", 0.5, -0.2, 0.5, 0, 34),
        Stimme("violinen", "halten", 0.4, 0.0, 0.5, 0, 30, nur("a2", "b2")),
    ),
    beschreibung="Weit, zärtlich: Klavier in hoher Lage, Glockenspiel, ein Hauch Streicher.",
)

STUECKE = (WEG, WEG_KUERBISHOF, WEG_FLUSS, WEG_ZEDERN, DINER, NACHTSTUECK)
