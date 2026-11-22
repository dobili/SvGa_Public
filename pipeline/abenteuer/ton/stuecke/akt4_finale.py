"""Die Hauptstadt in Akt 4: Arena, Vorrunde, Nova, Halbfinale, „Zusammen“, Abschied, Mama.

Warum: Die Arena spielt das Thema eines Kindes (Klangplan A1, „Arena“): das Heldenthema
vollständig als Fanfare, groß besetzt mit Bläsern, Streichern und Marsch, aber die Melodie führt
eine einzelne Trompete. An der Treppe ziehen alle acht Ortsthemen je zwei Takte vorbei. Novas
Thema beginnt auf dem Konzernton und löst ihn einen Halbton aufwärts auf (♯4 – 5). Im Halbfinale
perlt ZERO (lydische Sechzehntel um die ♯4), und der Held wird Zug um Zug dünner, bis Ambrose und
der Held eine Melodie werden (`zusammen`, `mit.dir`, `abschied`).

Ersatz: Die Pauke ist der gestrichene Kontrabass mit der großen Trommel (Rhythmus „marsch“), die
Celesta von ZERO die Glasharfe mit dem Vibraphon, die Synthesizerfläche die Hammondorgel.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke import akt4_koepfe as koepfe
from pipeline.abenteuer.ton.stuecke import akt4_summit as summit
from pipeline.abenteuer.ton.stuecke.akt4_themen import (
    EINE_MELODIE,
    HELD,
    HELD_MELODIE,
    HELD_OFFEN,
    KOPF_DACHBODEN,
    KOPF_DACHBODEN_AKKORDE,
    MAMA,
    OBEN,
    TONART,
    nur,
)
from pipeline.abenteuer.ton.stuecke.maple import GEGEN_ANHEBUNG, mit_spuren

AKT = 4

# Arena: die Fanfare mit Betonungen, ein Mittelteil der Trompete, dann die Treppe.
ARENA_THEMA = Teil(HELD.akkorde, "2:1 3:1 >5:2 | 2:1 3:1 5:1 >6:1 | >5:1 3:1 2:2 | >1:4")
ARENA_MITTE = Teil(
    "IV | V | iii | vi | ii | V | IV | V",
    "6:2 5:1 6:1 | 7:2 5:2 | 5:1 3:1 5:2 | 6:4 | 4:1 3:1 2:1 4:1 | 5:2 2:2 | 6:1 5:1 4:1 3:1 | 2:4",
)
TREPPE = tuple(f"t_{k.ort}" for k in koepfe.ALLE)
FANFARE = nur("a1", "a2", "mitte", "a3")
VOLL = nur("a2", "mitte", "a3")
# Spuren der Arena (Klangplan A0): grund die Bläser und Streicher, melodie die Trompete und die
# Köpfe an der Treppe, zusatz der Marsch (Große Trommel, mono).
_ARENA_STIMMEN, _ARENA_SPUREN = mit_spuren(
    (
        Stimme("horn", "halten", 0.55, -0.3, 0.35, 0, 52, VOLL),
        Stimme("posaune", "stoss", 0.55, -0.15, 0.3, -1, 54, nur("vor", "a1", "a2", "a3")),
        Stimme("tuba", "bass_zweier", 0.6, 0.0, 0.25, 0, 56),
        Stimme("violinen", "halten", 0.5, 0.3, 0.4, 1, 46, VOLL),
        Stimme("bratschen", "halten", 0.45, 0.2, 0.4, 0, 40),
        Stimme("kontrabass", "bass_grund", 0.55, 0.0, 0.3, 1, 50, nur("vor", "a1", "a2", "a3")),
    ),
    (
        Stimme("trompete", "melodie", 0.9, 0.1, 0.3, OBEN, 66, FANFARE),
        *koepfe.stimmen(koepfe.ALLE, "t", 58),
    ),
    (
        Stimme("schlagwerk", "marsch", 0.45, 0.05, 0.25, staerke=56, teile=nur("vor", *FANFARE)),
        Stimme("schlagwerk", "marsch", 0.3, 0.05, 0.3, staerke=42, teile=nur(*TREPPE)),
    ),
)
ARENA = Satz(
    "arena",
    "Arena",
    TONART,
    104,
    4,
    {
        "vor": Teil("I | V"),
        "a1": ARENA_THEMA,
        "a2": ARENA_THEMA,
        "mitte": ARENA_MITTE,
        "a3": ARENA_THEMA,
        **koepfe.teile(koepfe.ALLE, "zwei", "t"),
    },
    # Ohne Vorspiel: Die Schleife beginnt mit der Fanfare, so gleicht die Nahtkurve auch die
    # Melodiespur an (ein stummer Anfang bliebe unausgeglichen, A0.6).
    ("a1", "a2", "mitte", "a3", *TREPPE),
    _ARENA_STIMMEN,
    akt=AKT,
    spuren=_ARENA_SPUREN,
    zusatz="farbe",
    beschreibung="Groß, festlich, menschlich: das Heldenthema als Fanfare, an der Treppe alle Orte.",
)

# Turnier (Vorrunde, Montage Runde 1 und 2): Steigerung des Kampfthemas von Akt 4 (akt4_summit.py)
# in G-Dur; im B-Teil singt das Klavier das Thema des Helden, die Trompete ist die Steigerung.
_TURNIER_B = Teil(f"{HELD.akkorde} | {HELD_OFFEN.akkorde}", f"{HELD.melodie} | {HELD_OFFEN.melodie}")
_TURNIER_TEILE = {**summit.KAMPF_TEILE, "b": _TURNIER_B}
_TURNIER_STIMMEN, _TURNIER_SPUREN = mit_spuren(
    (
        Stimme("gitarre", "schlagen", 0.6, -0.3, 0.2, 0, 48),
        Stimme("kontrabass_pizz", "bass_laufend", 0.8, 0.0, 0.15, 1, 62),
        Stimme("schlagwerk", "schlagzeug", 0.35, 0.2, 0.15, staerke=52),
    ),
    (
        Stimme("gitarre", "melodie", 0.8, -0.2, 0.25, OBEN, 62, summit.MELODIE_TEILE),
        Stimme("klavier", "melodie", 0.65 * GEGEN_ANHEBUNG, 0.2, 0.3, OBEN, 56, nur("b")),
    ),
    (Stimme("trompete", "melodie", 0.5, 0.1, 0.3, OBEN, 58),),
)
ARENA_VORRUNDE = Satz(
    "arena.vorrunde",
    "Arena, Vorrunde",
    TONART,
    132,
    4,
    _TURNIER_TEILE,
    summit.FORM,
    _TURNIER_STIMMEN,
    akt=AKT,
    spuren=_TURNIER_SPUREN,
    zusatz="steigerung",
    beschreibung="Fortschritt: das Kampfthema von Akt 4 gesteigert, im B-Teil das Thema des Helden.",
)

# Nova: erst nur ♯4 – 5, zögernd (der Konzernton über A-Dur, aufgelöst in den G-Dur-Akkord),
# dann fester mit 6 – 5 – 3, zum Schluss vollständig mit 2 – 3 – 1 und Cello.
_NOVA = {
    "vor": Teil("I | IV"),
    "z1": Teil("I I II I | I | I I II I | I", "r:2 #4:1 5:1 | r:4 | r:2 #4:1 5:1 | 5:2 r:2"),
    "z2": Teil("I I II I | IV | I II I II | I", "r:2 #4:1 5:1 | r:4 | r:1 #4:1 5:1 #4:0.5 5:0.5 | 5:4"),
    "fest": Teil(
        "II I I I | IV IV I I | II I I I | IV IV I I", "#4:1 5:3 | 6:1 5:1 3:2 | #4:1 5:3 | 6:1 5:1 3:2"
    ),
    "voll": Teil("II I I I | IV IV I I | V V I I | I", "#4:1 5:3 | 6:1 5:1 3:2 | 2:1 3:1 1:2 | 1:4"),
}
NOVA = Satz(
    "nova",
    "Nova",
    TONART,
    72,
    4,
    _NOVA,
    ("vor", "z1", "z2", "fest", "voll"),
    (
        Stimme("klavier", "melodie", 0.55, 0.1, 0.45, OBEN, 38, nur("z1", "z2")),
        Stimme("klavier", "melodie", 0.85, 0.1, 0.4, OBEN, 54, nur("fest", "voll")),
        Stimme("klavier", "halten", 0.3, -0.15, 0.45, -1, 26, nur("vor", "z1", "z2")),
        Stimme("klavier", "wiegen", 0.5, -0.15, 0.4, -1, 36, nur("fest", "voll")),
        Stimme("cello", "melodie", 0.65, -0.25, 0.4, 0, 50, nur("voll")),
    ),
    akt=AKT,
    beschreibung="Zart, dann fest: Novas Thema, zuerst nur ♯4 – 5, am Ende vollständig mit Cello.",
)

# Beim Remis gegen Nova (Kap. 61) erklingt ihr Thema einmal vollständig (Klangplan 4A2, „nova“
# 60 s / 25 s): fest, dann voll mit Cello, ohne Schleife.
NOVA_VOLLSTAENDIG = Satz(
    "nova.vollstaendig",
    "Nova, vollständig",
    TONART,
    72,
    4,
    {"fest": _NOVA["fest"], "voll": _NOVA["voll"]},
    ("fest", "voll"),
    (
        Stimme("klavier", "melodie", 0.85, 0.1, 0.4, OBEN, 54),
        Stimme("klavier", "wiegen", 0.5, -0.15, 0.4, -1, 36),
        Stimme("cello", "melodie", 0.65, -0.25, 0.4, 0, 50, nur("voll")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Beim Remis: Novas Thema einmal vollständig, fest, zum Schluss mit Cello.",
)

# ZERO: gleichmäßige Sechzehntel aus der lydischen Leiter, um die ♯4 kreisend, ohne anzukommen.
ZERO_FIGUREN = (
    "1 2 3 #4 5 6 5 #4 3 #4 5 6 7 6 5 #4",
    "#4 5 #4 3 2 3 #4 5 6 7 6 5 #4 3 #4 5",
    "6 5 #4 5 6 7 1' 7 6 5 #4 3 #4 5 #4 3",
    "#4 5 #4 3 2 3 #4 5 6 7 6 5 #4 3 #4 5",
)
SECHZEHNTEL = "0.25"


def _sechzehntel(figur: str) -> str:
    """Eine Figur aus Stufen als Sechzehntel. Beispiel: „1 2“ wird „1:0.25 2:0.25“."""
    return " ".join(f"{stufe}:{SECHZEHNTEL}" for stufe in figur.split())


ZERO_LINIE = " | ".join(_sechzehntel(f) for f in ZERO_FIGUREN)
PULS = "2,:1 2,:1 2,:1 2,:1 | 1,:1 1,:1 1,:1 1,:1 | 2,:1 2,:1 2,:1 2,:1 | 1,:1 1,:1 1,:1 1,:1"
# Der Held gegen ZERO: mit jedem Durchgang ein Stück weniger.
HELD_GEGEN_ZERO = {
    "h1": "r:2 2:1 3:1 | 5:4 | 2:1 3:1 5:1 6:1 | 5:2 r:2",
    "h2": "r:2 2:1 3:1 | 5:4 | r:4 | r:4",
    "h3": "r:2 2:1 3:1 | r:4 | r:4 | r:4",
    "h4": "r:2 2:2 | r:4 | r:4 | r:4",
}
LAUT_HELD_ANFANG = 0.85
LEISER_JE_DURCHGANG = 0.12
ZERO_AKKORDE = "II | I | II | I"


def _zero_teile() -> dict[str, Teil]:
    """ZERO allein (vor, nur) und mit dem Helden (h1 bis h4)."""
    allein = Teil(ZERO_AKKORDE, linien={"zero": ZERO_LINIE, "puls": PULS})
    mit_held = {
        name: Teil(ZERO_AKKORDE, linien={"zero": ZERO_LINIE, "puls": PULS, "held": held})
        for name, held in HELD_GEGEN_ZERO.items()
    }
    return {"vor": allein, **mit_held, "nur": allein}


def _held_gegen_zero() -> tuple[Stimme, ...]:
    """Je Durchgang eine Heldenstimme auf der Gitarre, jede leiser als die davor."""
    return tuple(
        Stimme(
            "gitarre",
            "noten",
            LAUT_HELD_ANFANG - i * LEISER_JE_DURCHGANG,
            -0.25,
            0.3,
            OBEN,
            54,
            nur(name),
            "held",
        )
        for i, name in enumerate(HELD_GEGEN_ZERO)
    )


ZERO_HALBFINALE = Satz(
    "zero.halbfinale",
    "Halbfinale gegen ZERO",
    TONART,
    96,
    4,
    _zero_teile(),
    ("vor", "h1", "h2", "h3", "h4", "nur"),
    (
        Stimme("glasharfe", "noten", 0.75, 0.25, 0.45, OBEN, 50, kennung="zero"),
        Stimme("vibraphon", "noten", 0.4, 0.35, 0.45, OBEN + 1, 40, kennung="zero"),
        Stimme("hammond", "halten", 0.35, -0.1, 0.5, 0, 34),
        Stimme("kontrabass", "noten", 0.6, 0.0, 0.3, 0, 50, kennung="puls"),
        *_held_gegen_zero(),
    ),
    akt=AKT,
    beschreibung="Schön, unerbittlich: ZERO perlt über einem tiefen Puls, der Held wird Zug um Zug dünner.",
)

ZUSAMMEN = Satz(
    "zusammen",
    "Zusammen",
    TONART,
    80,
    4,
    {"z": EINE_MELODIE},
    ("z",),
    (
        Stimme("trompete", "melodie", 0.85, 0.1, 0.35, OBEN, 66),
        Stimme("violinen", "melodie", 0.8, 0.3, 0.4, OBEN, 62),
        Stimme("klavier_alt", "melodie", 0.6, -0.2, 0.4, OBEN, 58),
        Stimme("glockenspiel", "melodie", 0.4, 0.4, 0.45, OBEN + 1, 52),
        Stimme("cello", "melodie", 0.6, -0.3, 0.4, 0, 58),
        Stimme("gitarre", "schlagen", 0.55, -0.4, 0.3, 0, 50),
        Stimme("klavier", "harfe", 0.45, 0.2, 0.4, 0, 46),
        Stimme("horn", "halten", 0.55, -0.1, 0.35, 0, 52),
        Stimme("bratschen", "halten", 0.45, 0.2, 0.4, 0, 46),
        Stimme("kontrabass", "bass_grund", 0.55, 0.0, 0.3, 1, 52),
        Stimme("schlagwerk", "marsch", 0.35, 0.05, 0.3, staerke=50),
        Stimme("schlagwerk", "triangel", 0.3, 0.4, 0.35, staerke=52),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Höhepunkt: Ambrose und der Held als eine Melodie, mit allen Instrumenten des Spiels.",
)

MIT_DIR = Satz(
    "mit.dir",
    "Mit dir",
    TONART,
    64,
    4,
    {"z": EINE_MELODIE},
    ("z",),
    (
        Stimme("klavier", "melodie", 0.85, 0.1, 0.45, OBEN, 50),
        Stimme("klavier", "wiegen", 0.5, -0.1, 0.45, -1, 34),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Still: dieselbe Melodie, nur Klavier.",
)

# Der Held allein: zuerst nur die drei Töne auf der Gitarre, dann vollständig, dann mit allen.
HELD_ALLEIN = Satz(
    "held.allein",
    "Der Held allein",
    TONART,
    72,
    4,
    {
        "allein": Teil("N.C. | N.C. | N.C. | N.C.", "2:1 3:1 5:2 | r:4 | 2:1 3:1 5:2 | r:4"),
        "mit": HELD,
        "alle": Teil(HELD.akkorde, HELD_MELODIE),
    },
    ("allein", "mit", "alle"),
    (
        Stimme("gitarre", "melodie", 0.45, 0.0, 0.35, OBEN, 36, nur("allein")),
        Stimme("gitarre", "melodie", 0.7, 0.0, 0.35, OBEN, 48, nur("mit")),
        Stimme("gitarre", "melodie", 0.85, -0.1, 0.35, OBEN, 60, nur("alle")),
        Stimme("violinen", "melodie", 0.75, 0.25, 0.4, OBEN, 58, nur("alle")),
        Stimme("gitarre", "zupfen", 0.45, -0.3, 0.35, 0, 36, nur("mit", "alle")),
        Stimme("klavier", "tupfen", 0.4, 0.2, 0.35, 0, 42, nur("alle")),
        Stimme("horn", "halten", 0.45, -0.2, 0.35, 0, 44, nur("alle")),
        Stimme("cello", "bass_grund", 0.5, 0.0, 0.35, 1, 44, nur("mit", "alle")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Wachsen: das Thema des Helden beginnt allein, sehr leise, und wächst.",
)

# Abschied: die eine Melodie auf altem Klavier und Gitarre, zur Verbeugung die vier fragenden Töne.
ABSCHIED = Satz(
    "abschied",
    "Abschied",
    TONART,
    80,
    4,
    {"m1": EINE_MELODIE, "m2": EINE_MELODIE, "verbeugung": Teil(KOPF_DACHBODEN_AKKORDE, KOPF_DACHBODEN)},
    ("m1", "m2", "verbeugung"),
    (
        Stimme("klavier_alt", "melodie", 0.85, -0.15, 0.45, OBEN, 52, nur("m1", "verbeugung")),
        Stimme("gitarre", "melodie", 0.8, 0.2, 0.35, OBEN, 54, nur("m2")),
        Stimme("gitarre", "zupfen", 0.5, 0.25, 0.35, 0, 36, nur("m1", "verbeugung")),
        Stimme("klavier_alt", "wiegen", 0.5, -0.15, 0.45, -1, 36, nur("m2")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Leise: die eine Melodie auf zwei Instrumenten, zur Verbeugung die vier Töne vom Dachboden.",
)

MAMA_RUHIG = Satz(
    "mama.ruhig",
    "Mama, ruhig",
    TONART,
    56,
    4,
    {"m1": MAMA, "m2": MAMA},
    ("m1", "m2"),
    (
        Stimme("klavier", "melodie", 0.85, 0.1, 0.45, OBEN, 48),
        Stimme("klavier", "harfe", 0.4, -0.1, 0.45, 0, 30, nur("m1")),
        Stimme("klavier", "wiegen", 0.5, -0.1, 0.45, -1, 34, nur("m2")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Ruhig: Mamas Thema vollständig, Klavier allein.",
)

STUECKE = (
    NOVA_VOLLSTAENDIG,
    ARENA,
    ARENA_VORRUNDE,
    NOVA,
    ZERO_HALBFINALE,
    ZUSAMMEN,
    MIT_DIR,
    HELD_ALLEIN,
    ABSCHIED,
    MAMA_RUHIG,
)
