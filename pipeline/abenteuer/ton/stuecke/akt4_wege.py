"""Akt 4, Wege und Landschaften: Hochebene, Pinewood, Staubstraße, Seeufer, Herbst, Wald, Leuchtturm.

Warum: Das Wegthema ist in jedem Akt das Thema von Maple Falls in anderer Besetzung (Klangplan A2,
„weg“; Grundsatz 2). In Akt 4 fährt es mit der Slide-Gitarre zur Hochebene und nimmt das Thema
des Helden als zweite Stimme mit (`weg.wueste.held`), wird in Pinewood verspielt, verliert auf der
Staubstraße die Farbe und kehrt am Seeufer in voller Besetzung zurück. Im Herbst klingt es wie in
Kapitel 1, nur Gitarre. Die Hochebene bekommt ein eigenes, heutiges Thema (Flöte, Handtrommel,
Gitarre). Der Wald hat nur einen Orgelpunkt, der Leuchtturm einen tiefen Ton je Aufleuchten.

Ersatz: Die Slide-Gitarre ist die E-Gitarre (clean, mit viel Hall), das Banjo der Strumstick, die
Fiedel die Geige, die Handtrommel das Tamburin mit Schellenei. Die Staubstraße verliert ihre
Obertöne im Klangplan mit den Farbstufen der Karte (T22, Tiefpass, dann Hochpass); ein Filter je
Farbstufe gehört in die App. Diese Datei liefert das Wegthema dafür, leise und schlicht besetzt.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.akt4_themen import HELD, HELD_OFFEN, OBEN, nur
from pipeline.abenteuer.ton.stuecke.maple import A2, A, B
from pipeline.abenteuer.ton.stuecke.maple import teile as maple_teile

AKT = 4
_MAPLE = maple_teile()

# Das Heldenthema als zweite Stimme: 2 – 3 – 5 steigt dort, wo die Melodie liegen bleibt.
HELD_AM_ENDE = "r:4 | r:4 | r:4 | r:1 2:1 3:1 5:1"
HELD_IN_B = "r:4 | r:4 | r:4 | r:4 | r:4 | r:1 2:1 3:1 5:1 | r:4 | r:1 2:1 3:1 5:1"


def _wueste_teile() -> dict[str, Teil]:
    """Das Wegthema mit der zweiten Stimme des Helden und zwei Teilen nur mit dem Heldenthema."""
    held = "held"
    return {
        **_MAPLE,
        "a1": Teil(A.akkorde, A.melodie, {held: HELD_AM_ENDE}),
        "a2": Teil(A2.akkorde, A2.melodie, {held: HELD_AM_ENDE}),
        "b": Teil(B.akkorde, B.melodie, {held: HELD_IN_B}),
        "held": HELD,
        "held2": HELD_OFFEN,
    }


WEG_WUESTE_HELD = Satz(
    "weg.wueste.held",
    "Fahrt zur Hochebene",
    "G",
    76,
    4,
    _wueste_teile(),
    ("vor", "a1", "a2", "b", "a3", "a4", "held", "held2", "a6"),
    (
        Stimme("gitarre", "zupfen", 0.7, -0.3, 0.4, 0, 42),
        Stimme("egitarre", "melodie", 0.8, 0.25, 0.5, OBEN, 58, nur("a1", "a2", "b", "a3", "a4", "a6")),
        Stimme("gitarre", "noten", 0.6, -0.1, 0.4, 0, 50, nur("a1", "a2", "b"), "held"),
        Stimme("gitarre", "melodie", 0.75, -0.1, 0.4, OBEN, 54, nur("held", "held2")),
        Stimme("egitarre", "halten", 0.35, 0.3, 0.55, 0, 34, nur("held", "held2")),
        Stimme("kontrabass_pizz", "bass_wechsel", 0.6, 0.0, 0.3, 1, 50),
    ),
    akt=AKT,
    beschreibung="Aufbruch, weit: das Wegthema auf der Slide-Gitarre, das Thema des Helden fährt mit.",
)

# Hochebene (D-Dur): heutig, mit Humor; Sprünge, Pausen an unerwarteten Stellen, ein Schluss,
# der dreimal auf dieselbe Taste tippt.
HOCH_A = Teil(
    "I | IV | I | V | I | IV | ii V | I",
    "1':0.5 r:0.5 5:0.5 6:0.5 1':1 r:1 | 6:0.5 4:0.5 1':1 6:1 r:1 | 3:0.5 5:0.5 1':1 5:0.5 3:0.5 1:1 | "
    "2:1.5 3:0.5 5:2 | 1':0.5 r:0.5 5:0.5 6:0.5 1':1 r:1 | 4:0.5 6:0.5 1':1 2':0.5 1':0.5 6:1 | "
    "2:1 4:1 5:1 7,:1 | 1:1 r:0.5 1:0.5 1:1 r:1",
)
HOCH_B = Teil(
    "vi | IV | I | V | vi | IV | V | V",
    "6:1.5 5:0.5 3:1 r:1 | 4:1.5 3:0.5 1:1 r:1 | 3:0.5 5:0.5 3:0.5 5:0.5 1':2 | 7:1 6:1 5:2 | "
    "6:1.5 5:0.5 3:1 r:1 | 4:0.5 6:0.5 1':1 6:1 r:1 | 7:1 5:1 7:1 2':1 | 5:1 r:3",
)
HOCHEBENE = Satz(
    "hochebene",
    "Hochebene",
    "D",
    100,
    4,
    {"vor": Teil("I | V"), "a": HOCH_A, "b": HOCH_B, "a2": HOCH_A},
    ("vor", "a", "b", "a2", "b"),
    (
        Stimme("floete", "melodie", 0.8, 0.2, 0.25, OBEN, 60, nur("a", "b", "a2")),
        Stimme("gitarre", "schlagen", 0.6, -0.3, 0.2, 0, 44),
        Stimme("gitarre", "melodie", 0.45, -0.2, 0.2, 0, 46, nur("a2")),
        Stimme("schlagwerk", "tamburin", 0.4, 0.3, 0.15, staerke=50),
    ),
    akt=AKT,
    beschreibung="Heutig, mit Humor: Flöte, Gitarre und Handtrommel, nicht „alt“.",
)

PINEWOOD = Satz(
    "pinewood",
    "Pinewood Camp",
    "G",
    108,
    4,
    _MAPLE,
    ("vor", "a1", "a2", "b", "a3", "a4", "a5", "a6"),
    (
        Stimme("gitarre", "travis", 0.75, -0.3, 0.2, 0, 48),
        Stimme("strumstick", "melodie", 0.75, 0.25, 0.25, OBEN, 56, nur("a1", "a2", "a5", "a6")),
        Stimme("glockenspiel", "melodie", 0.45, 0.3, 0.35, OBEN, 52, nur("b")),
        Stimme("gitarre", "melodie", 0.65, 0.1, 0.25, OBEN, 54, nur("b", "a3", "a4")),
        Stimme("kontrabass_pizz", "bass_zweier", 0.7, 0.0, 0.15, 1, 56),
        Stimme("schlagwerk", "schellen", 0.3, 0.35, 0.2, staerke=44),
    ),
    akt=AKT,
    beschreibung="Verspielt: das Wegthema mit Banjo (Strumstick) und Gitarre, leichter Rhythmus.",
)

STAUBSTRASSE = Satz(
    "staubstrasse",
    "Staubstraße",
    "G",
    72,
    4,
    _MAPLE,
    ("vor", "a1", "a2", "b", "a3", "a4", "b", "a6"),
    (
        Stimme("gitarre", "zupfen", 0.7, -0.25, 0.35, 0, 40),
        Stimme("mundharmonika", "melodie", 0.6, 0.2, 0.35, OBEN, 50, nur("a1", "a2", "a6")),
        Stimme("geige", "melodie", 0.6, 0.15, 0.4, OBEN, 48, nur("b")),
        Stimme("gitarre", "melodie", 0.6, 0.1, 0.35, OBEN, 48, nur("a3", "a4")),
        Stimme("cello", "noten", 0.4, 0.1, 0.4, 1, 40, nur("a3", "a4", "a6"), "cello"),
    ),
    akt=AKT,
    beschreibung="Die Farbe geht: das Wegthema leise und schlicht; die App filtert es mit den Farbstufen.",
)

SEEUFER = Satz(
    "seeufer",
    "Seeufer",
    "G",
    96,
    4,
    _MAPLE,
    ("vor", "a1", "a2", "a3", "a4", "b", "a5", "a6", "b", "a6"),
    (
        Stimme("gitarre", "travis", 0.8, -0.3, 0.3, 0, 50),
        Stimme("mundharmonika", "melodie", 0.65, 0.25, 0.3, OBEN, 60, nur("a1", "a5")),
        Stimme("geige", "melodie", 0.7, 0.2, 0.35, OBEN, 60, nur("a2", "a6")),
        Stimme("klavier", "melodie", 0.7, 0.1, 0.35, OBEN, 56, nur("a3", "a4")),
        Stimme("cello", "noten", 0.5, -0.1, 0.35, 1, 48, nur("a3", "a4", "a6"), "cello"),
        Stimme("cello", "melodie", 0.65, -0.1, 0.35, 0, 56, nur("b")),
        Stimme("glockenspiel", "melodie", 0.4, 0.35, 0.45, OBEN + 1, 48, nur("b")),
        Stimme("klavier", "tupfen", 0.35, 0.15, 0.35, 0, 38, nur("b", "a1", "a2")),
        Stimme("kontrabass_pizz", "bass_zweier", 0.65, 0.0, 0.2, 1, 54),
    ),
    akt=AKT,
    beschreibung="Alle Farben zurück: das Wegthema in voller Besetzung, weit und hell.",
)

MAPLE_FALLS_HERBST = Satz(
    "mapleFalls.herbst",
    "Maple Falls, Herbst",
    "G",
    76,
    4,
    _MAPLE,
    ("vor", "a1", "a2", "a3", "a4", "b", "a5", "a6"),
    (
        Stimme("gitarre", "zupfen", 0.85, -0.2, 0.3, 0, 44),
        Stimme("gitarre", "melodie", 0.8, 0.2, 0.3, OBEN, 56),
        Stimme("gitarre", "noten", 0.45, 0.0, 0.3, 1, 42, nur("a3", "a4", "a6"), "cello"),
    ),
    akt=AKT,
    beschreibung="Wie am ersten Tag: das Thema von Maple Falls, nur Gitarre.",
)

# Wald: ein tiefer Orgelpunkt auf der 1, zwei Stimmen versetzt, damit der Ton nie abreißt.
ORGELPUNKT = Teil(
    "N.C. | N.C. | N.C. | N.C.",
    linien={"orgel": "1,:8 1,:8", "bass": "r:4 1,:8 1,:4"},
)
WALD_ORGELPUNKT = Satz(
    "wald.orgelpunkt",
    "Wald, Orgelpunkt",
    "G",
    60,
    4,
    {"p": ORGELPUNKT},
    ("p",) * 8,
    (
        Stimme("orgel", "noten", 0.7, 0.0, 0.5, -1, 40, kennung="orgel"),
        Stimme("kontrabass", "noten", 0.5, 0.0, 0.5, 0, 34, kennung="bass"),
    ),
    akt=AKT,
    pegel_db=-10.0,
    beschreibung="Stille, Ehrfurcht: ein tiefer, langer Ton wie ein Orgelpunkt, kaum hörbar.",
)

# Leuchtturm: zwei Aufleuchten in zwölf Sekunden, je ein tiefer Ton (Klavier und Kontrabass).
LICHT = Teil("N.C. | N.C. | N.C. | N.C.", linien={"licht": "1,:5 r:1 1,:5 r:1"})
LEUCHTTURM = Satz(
    "leuchtturm",
    "Leuchtturm",
    "G",
    60,
    3,
    {"l": LICHT},
    ("l",),
    (
        Stimme("klavier", "noten", 0.7, 0.0, 0.5, 0, 50, kennung="licht"),
        Stimme("kontrabass", "noten", 0.6, 0.0, 0.5, 0, 46, kennung="licht"),
    ),
    akt=AKT,
    pegel_db=-6.0,
    beschreibung="Ruhig: ein tiefer, langsamer Ton für jedes Aufleuchten.",
)

STUECKE = (
    WEG_WUESTE_HELD,
    HOCHEBENE,
    PINEWOOD,
    STAUBSTRASSE,
    SEEUFER,
    MAPLE_FALLS_HERBST,
    WALD_ORGELPUNKT,
    LEUCHTTURM,
)
