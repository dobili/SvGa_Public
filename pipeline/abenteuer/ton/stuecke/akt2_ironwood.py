"""Ironwood: das Ortsthema in f-Moll und seine Fassungen, dazu die Fanfare (Klangplan 2A1, 2A3).

Warum: Ironwood ist fest und schwer, das Gegenstück zu Riverton (Klangplan, Akt 2). Tiefe Bläser
halten die Akkorde, ein Schmiedehammer gibt den langsamen Schlag, darüber singt eine einzelne warme
Klarinette in ihrer tiefen Lage ein Lied wie ein Arbeiterlied: A steigt durch den Moll-Dreiklang und
fällt zurück auf die 1, B öffnet nach As-Dur und kehrt über G7 zurück. Kantine, Feier und Clubkampf
spielen dieselben Teile in anderer Besetzung (Grundsatz 2); die Feier umspielt die Melodie als
Tanz, der Clubkampf presst ihren Kopf zwischen zwei Posaunen, die sich je Takt um einen Halbton
näher kommen (Schraubstock).

Ersatz (die freien Bibliotheken haben weder Amboss noch Akkordeon):
- Schmiedehammer: ein kurzer, sehr tiefer Ton des trockenen Flügels (der Schlag) zusammen mit einer
  kurzen Röhrenglocke (das Metall). Die Rhythmen kennen keinen einzelnen schweren Schlag; die
  große Trommel gibt es nur zusammen mit kleiner Trommel oder Hi-Hat.
- Akkordeon: die Zugriegelorgel (``hammond``, wie das Akkordeon ein gehaltener, gleichmäßiger Ton) für die
  linke Hand und die Akkorde, die Mundharmonika (auch ein Durchschlagzungen-Instrument) für den
  Diskant in der Feier.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.kurz import kurz

TONART = "f"
AKT = 2
OBEN = 1
# Ein Takt des Hammers: schwerer Schlag auf 1, leichterer auf 3.
HAMMER_TAKT = ">1:0.25 r:1.75 1:0.25 r:1.75"
STILL_TAKT = "r:4"
HAMMER = "hammer"


def _takte(akkorde: str) -> int:
    """Anzahl der Takte einer Akkordzeile. Beispiel: „i | VI | iv | V“ hat vier."""
    return len(akkorde.split("|"))


def hammer(akkorde: str, melodie: str = "", jeder: int = 1) -> Teil:
    """Ein Teil mit dem Schmiedehammer als eigener Linie; ``jeder`` = nur jeder n-te Takt."""
    schlaege = [HAMMER_TAKT if i % jeder == 0 else STILL_TAKT for i in range(_takte(akkorde))]
    return Teil(akkorde, melodie, {HAMMER: " | ".join(schlaege)})


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


A_AKKORDE = "i | VI | iv | V | i | VI | iv V | i"
A_MELODIE = (
    "1:1 3:1 5:2 | 6:3 5:1 | 4:1.5 3:0.5 4:1 6:1 | 5:3 r:1 | "
    "1:1 3:1 5:1 1':1 | 1':2 6:1 5:1 | 4:1 3:1 2:2 | 1:4"
)
B_AKKORDE = "III | VII | VI | III | iv | i | iv | V7"
B_MELODIE = (
    "3:1 5:1 7:2 | 2':1 1':1 7:2 | 6:2 1':2 | 7:3 r:1 | "
    "4:1 6:1 1':2 | 1':1.5 7:0.5 5:2 | 6:1 4:1 1:2 | 2:2 #7,:2"
)
VOR_AKKORDE = "i | i"
ATEM_AKKORDE = "i | VI | iv | V"


def teile(jeder: int = 1) -> dict[str, Teil]:
    """Die Teile des Themas mit Hammer; ``jeder`` dünnt den Hammer aus (Kantine: fern)."""
    return {
        "vor": hammer(VOR_AKKORDE, jeder=jeder),
        "a": hammer(A_AKKORDE, A_MELODIE, jeder),
        "b": hammer(B_AKKORDE, B_MELODIE, jeder),
        "atem": hammer(ATEM_AKKORDE, jeder=jeder),
    }


FORM = ("vor", "a", "b", "a", "atem")
MIT_MELODIE = nur("a", "b")


def _hammerstimmen(lautstaerke: float, hall: float) -> tuple[Stimme, ...]:
    """Der Schmiedehammer: tiefer Schlag des trockenen Flügels und das Klingen der Röhrenglocke."""
    return (
        Stimme("klavier_trocken", "noten", lautstaerke, 0.0, hall, -2, 72, kennung=HAMMER),
        Stimme("roehrenglocken", "noten", lautstaerke * 0.45, 0.3, hall + 0.15, OBEN, 50, kennung=HAMMER),
    )


IRONWOOD = Satz(
    "ironwood",
    "Ironwood",
    TONART,
    60,
    4,
    teile(),
    FORM,
    (
        Stimme("klarinette", "melodie", 0.85, 0.15, 0.35, 0, 60, MIT_MELODIE),
        Stimme("posaune", "halten", 0.6, -0.25, 0.35, -1, 50),
        Stimme("tuba", "bass_grund", 0.7, 0.0, 0.3, 1, 56),
        *_hammerstimmen(0.8, 0.3),
    ),
    akt=AKT,
    beschreibung="Schwer, rußig: Posaunen und Tuba, ein Schmiedehammer, darüber eine warme Klarinette.",
)

IRONWOOD_KANTINE = Satz(
    "ironwood.kantine",
    "Ironwood, Kantine",
    TONART,
    76,
    4,
    teile(jeder=2),
    FORM,
    (
        Stimme("klarinette", "melodie", 0.8, 0.15, 0.3, 0, 56, MIT_MELODIE),
        Stimme("hammond", "stride", 0.45, -0.25, 0.25, 0, 44),
        *_hammerstimmen(0.25, 0.55),
    ),
    akt=AKT,
    beschreibung="Drinnen warm: das Thema mit Akkordeon (Orgel) statt Bläsern, Klarinette, der Hammer fern.",
)

# Feier: dieselbe Melodie als Tanz umspielt; die Gerüsttöne von A und B bleiben auf den Schlägen.
TANZ_A = Teil(
    A_AKKORDE,
    "1:0.5 2:0.5 3:0.5 4:0.5 5:1 r:0.5 5:0.5 | 6:1 r:0.5 6:0.5 5:0.5 4:0.5 3:1 | "
    "4:1 3:0.5 4:0.5 6:1 4:1 | 5:1 #7,:1 2:1 5:1 | 1:0.5 2:0.5 3:0.5 4:0.5 5:1 1':1 | "
    "1':1 r:0.5 6:0.5 5:1 4:1 | 4:0.5 6:0.5 4:0.5 3:0.5 2:1 #7,:1 | 1:1 3:1 1:1 r:1",
)
TANZ_B = Teil(
    B_AKKORDE,
    "3:0.5 4:0.5 5:0.5 6:0.5 7:1 5:1 | 2':1 1':0.5 7:0.5 7:1 4:1 | 6:1 1':0.5 6:0.5 1':1 3':1 | "
    "7:1 5:0.5 3:0.5 7:1 r:1 | 4:0.5 5:0.5 6:0.5 7:0.5 1':1 6:1 | 1':1 7:0.5 6:0.5 5:1 3:1 | "
    "6:1 4:1 1:2 | 2:1 #7,:1 2:1 r:1",
)

IRONWOOD_FEIER = Satz(
    "ironwood.feier",
    "Ironwood, Feier",
    TONART,
    120,
    4,
    {"a": TANZ_A, "b": TANZ_B},
    ("a", "b", "a", "b"),
    (
        Stimme("klarinette", "melodie", 0.85, 0.2, 0.25, 0, 66),
        Stimme("mundharmonika", "melodie", 0.5, -0.15, 0.25, OBEN, 54, nur("b")),
        Stimme("hammond", "stride", 0.55, -0.25, 0.2, 0, 52),
        Stimme("schlagwerk", "klatschen", 0.45, 0.3, 0.2, staerke=60),
        Stimme("schlagwerk", "tamburin", 0.25, -0.3, 0.2, staerke=46),
    ),
    akt=AKT,
    beschreibung="Ausgelassen: das Thema als Tanz, Klarinette, Akkordeon (Orgel, Mundharmonika), Klatschen.",
)

# Clubkampf: zwei Posaunen gehen je Takt aufeinander zu (Oktave, große Septime … kleine Sekunde).
ENG_OBEN = "1':4 | 1':4 | #7:4 | 7:4 | #6:4 | 6:4 | 6:4 | 6:4"
ENG_UNTEN = "1:4 | b2:4 | 2:4 | 3:4 | #3:4 | 4:4 | #4:4 | 5:4"
# Der Kopf des Themas, im Horn, wird mit dem Schraubstock enger: 1 – 3 – 5, dann 1 – 3 – 6, 1 – b2 – 1.
KOPF_ENG = "1:1 3:1 5:2 | r:4 | 1:1 3:1 5:2 | r:4 | 1:1 3:1 6:2 | r:4 | 1:1 b2:1 1:2 | r:4"
ENG_AKKORDE = " | ".join(["i"] * 8)


def _eng(melodie: str = "") -> Teil:
    """Ein Teil des Schraubstocks: Hammer, die zwei Posaunenlinien und wahlweise der Kopf im Horn."""
    teil = hammer(ENG_AKKORDE, melodie)
    return Teil(teil.akkorde, melodie, {**teil.linien, "oben": ENG_OBEN, "unten": ENG_UNTEN})


IRONWOOD_CLUBKAMPF = Satz(
    "ironwood.clubkampf",
    "Ironwood, Clubkampf",
    TONART,
    56,
    4,
    {"vor": hammer(VOR_AKKORDE), "eng": _eng(), "eng2": _eng(KOPF_ENG), "atem": hammer("i | i | i | i")},
    ("vor", "eng", "eng2", "atem"),
    (
        Stimme("horn", "melodie", 0.75, 0.2, 0.35, 0, 56, nur("eng2")),
        Stimme("posaune", "noten", 0.6, -0.2, 0.3, 0, 52, nur("eng", "eng2"), "oben"),
        Stimme("posaune", "noten", 0.6, 0.2, 0.3, 0, 52, nur("eng", "eng2"), "unten"),
        Stimme("tuba", "bass_grund", 0.7, 0.0, 0.3, 1, 56),
        *_hammerstimmen(0.85, 0.25),
    ),
    akt=AKT,
    beschreibung="Schraubstock: der Hammer als Puls, zwei Posaunen kommen sich je Takt einen Halbton näher.",
)

FANFARE_IRONWOOD = kurz(
    "fanfare.ironwood",
    "Fanfare, Ironwood",
    112,
    4,
    Teil(
        "I | I",
        "1:0.5 3:0.5 5:0.5 1':2.5 | r:4",
        {"aha": "r:4 | 2':0.25 5':0.5 1'':3.25", HAMMER: ">1:0.25 r:3.75 | r:4"},
    ),
    (
        Stimme("horn", "melodie", 0.85, 0.15, 0.3, OBEN, 72),
        Stimme("posaune", "stoss", 0.6, -0.25, 0.3, -1, 60),
        Stimme("tuba", "bass_grund", 0.65, 0.0, 0.3, 1, 60),
        *_hammerstimmen(0.8, 0.3),
        Stimme("glockenspiel", "noten", 0.6, 0.3, 0.4, OBEN, 70, kennung="aha"),
    ),
    "Horn, Posaune, Tuba und ein Hammerschlag: F-Dur-Dreiklang aufwärts, endet mit dem Aha.",
    tonart="F",
    akt=AKT,
)

STUECKE = (IRONWOOD, IRONWOOD_KANTINE, IRONWOOD_FEIER, IRONWOOD_CLUBKAMPF, FANFARE_IRONWOOD)
