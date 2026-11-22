"""Weitere Stücke von Akt 1: die Wege nach Cedar Creek, das Diner und das Nachtstück.

Warum: Klangplan A0 (einprägsame Ortsthemen, vom Autor freigegeben am 22.11.2026). Der Weg ist das
Thema von Maple Falls schneller: Fiedel und Mundharmonika über Gitarre; am Kürbishof der gezupfte
Strumstick statt Fiedel (die freien Bibliotheken haben kein Banjo); am Fluss Cello und Gitarre; am
Zedernpfad klingt das Thema von Cedar Creek auf dem Klavier. Das Diner hat einen eigenen Kopf, einen
Blues aus der Jukebox: G A G E | C' B G, die blaue Septime als Kennzeichen. Alle in drei Spuren
(grund, melodie, zusatz). Das Nachtstück (Szenenstück, genau dreimal im Spiel) bleibt.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke import cedar
from pipeline.abenteuer.ton.stuecke.maple import FORM as MAPLE_FORM
from pipeline.abenteuer.ton.stuecke.maple import GEGEN_ANHEBUNG, MELODIE_TEILE, mit_spuren
from pipeline.abenteuer.ton.stuecke.maple import teile as maple_teile

OBEN = 1


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


_MAPLE = maple_teile()


Spuren = tuple[tuple[Stimme, ...], tuple[Stimme, ...], tuple[Stimme, ...]]


def _maple(kennung: str, titel: str, tempo: float, spuren: Spuren, text: str) -> Satz:
    """Eine Fassung des Themas von Maple Falls in drei Spuren (Zusatz: Farbe)."""
    stimmen, gruppen = mit_spuren(*spuren)
    return Satz(
        kennung,
        titel,
        "G",
        tempo,
        4,
        _MAPLE,
        MAPLE_FORM,
        stimmen,
        spuren=gruppen,
        zusatz="farbe",
        beschreibung=text,
    )


def _weg(kennung: str, titel: str, oben: str, beschreibung: str) -> Satz:
    """Der Weg: Thema von Maple Falls bei 112, Wechselbass, leise Schellen; Mundharmonika als Farbe."""
    return _maple(
        kennung,
        titel,
        112,
        (
            (
                Stimme("gitarre", "travis", 0.8, -0.3, 0.2, 0, 50),
                Stimme("kontrabass_pizz", "bass_zweier", 0.7, 0.0, 0.15, 1, 58),
                Stimme("schlagwerk", "schellen", 0.25, 0.35, 0.2, staerke=42),
            ),
            (
                Stimme(oben, "melodie", 0.75, 0.25, 0.25, OBEN, 60, MELODIE_TEILE),
                Stimme("cello", "melodie", 0.7 * GEGEN_ANHEBUNG, 0.1, 0.25, 0, 56, nur("b")),
            ),
            (Stimme("mundharmonika", "noten", 0.5, 0.0, 0.25, OBEN, 52, kennung="farbe"),),
        ),
        beschreibung,
    )


WEG = _weg("weg", "Landstraße", "geige", "Frei, Sommerende: das Thema von Maple Falls schneller, mit Fiedel.")
WEG_KUERBISHOF = _weg(
    "weg.kuerbishof", "Kürbishof", "strumstick", "Wie die Landstraße, mit gezupftem Strumstick."
)

WEG_FLUSS = _maple(
    "weg.fluss",
    "Flussweg",
    96,
    (
        (Stimme("gitarre", "zupfen", 0.8, -0.25, 0.3, 0, 46),),
        (
            Stimme("cello", "melodie", 0.8, 0.15, 0.35, 0, 54, MELODIE_TEILE),
            Stimme("gitarre", "melodie", 0.65 * GEGEN_ANHEBUNG, 0.1, 0.3, OBEN, 50, nur("b")),
        ),
        (Stimme("geige", "noten", 0.45, 0.0, 0.35, OBEN, 44, kennung="farbe"),),
    ),
    "Schattig, Atem holen: Cello singt über der Gitarre, die Mundharmonika ist weg.",
)

_ZEDERN_STIMMEN, _ZEDERN_SPUREN = mit_spuren(
    (Stimme("gitarre", "zupfen", 0.75, -0.3, 0.3, 0, 40),),
    (
        Stimme("klavier", "melodie", 0.7, 0.2, 0.4, OBEN, 46, cedar.MELODIE_TEILE),
        Stimme("klavier", "melodie", 0.6 * GEGEN_ANHEBUNG, 0.1, 0.4, 0, 42, nur("b")),
    ),
    (Stimme("cello", "noten", 0.45, 0.0, 0.35, 1, 36, kennung="farbe"),),
)
WEG_ZEDERN = Satz(
    "weg.zedern",
    "Zedernpfad",
    "d",
    80,
    4,
    cedar.TEILE,
    cedar.ORTSFORM,
    _ZEDERN_STIMMEN,
    spuren=_ZEDERN_SPUREN,
    zusatz="farbe",
    beschreibung="Still, man kommt woanders an: leise Gitarre, darüber das Thema von Cedar Creek.",
)

# Diner: ein eigener Kopf im Blues, frech und warm, aus der Jukebox (C, 112, geswingt).
DINER_KOPF = "5:1 6:1/2 5:1/2 3:2 | 1':2 b7:1 5:1"
DINER_A = Teil("I7 | IV7 | I7 | V7", f"{DINER_KOPF} | 5:1 6:1/2 5:1/2 3:1 1:1 | 2:2 r:2")
DINER_A2 = Teil("I7 | IV7 | V7 | I7", f"{DINER_KOPF} | 4:1 3:1 2:1 7,:1 | 1:2 r:2")
DINER_B = Teil(
    "IV7 | IV7 | I7 | I7 | IV7 | IV7 | V7 | V7",
    "1:1 b3:1 4:1 #4:1 | 5:2 4:2 | 3:1 1:1 5,:1 6,:1 | b7,:2 1:2 | "
    "1:1 b3:1 4:1 #4:1 | 5:2 b7:2 | 5:2 4:2 | 2:4",
)
# Schluss mit Aufgang zurück zum Kopf, damit die Naht nicht absackt (A0.6).
DINER_OFFEN = Teil("I7 | IV7 | I7 | V7", f"{DINER_KOPF} | 4:1 3:1 2:1 7,:1 | 2:1 3:1 4:1 #4:1")
_DINER_STIMMEN, _DINER_SPUREN = mit_spuren(
    (
        Stimme("kontrabass_pizz", "bass_laufend", 0.8, 0.0, 0.15, 1, 62),
        Stimme("schlagwerk", "besen", 0.45, 0.25, 0.15, staerke=54),
        Stimme("hammond", "halten", 0.4, -0.2, 0.2, 0, 42),
    ),
    (
        Stimme("egitarre", "melodie", 0.8, 0.2, 0.2, OBEN, 64, nur("a", "a2", "a3")),
        Stimme("hammond", "melodie", 0.65 * GEGEN_ANHEBUNG, 0.15, 0.2, 0, 58, nur("b")),
    ),
    (Stimme("egitarre", "tupfen", 0.45, 0.0, 0.2, -1, 46),),
)
DINER = Satz(
    "diner",
    "Diner",
    "C",
    112,
    4,
    {"a": DINER_A, "a2": DINER_A2, "b": DINER_B, "a3": DINER_OFFEN},
    ("a", "a2", "b", "a3"),
    _DINER_STIMMEN,
    swing=1 / 6,
    klangbild="lautsprecher",
    spuren=_DINER_SPUREN,
    zusatz="jukebox",
    beschreibung="Frech, warm, Abend: der Blueskopf aus der Jukebox, E-Gitarre, Orgel, Bass und Besen.",
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
