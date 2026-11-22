"""Akt 3, Wüste und Desert Springs: Wüstenzug, Ortsthema, Clubkampf gegen Mira, Mira und der Held,
Nacht am Motel.

Warum: Desert Springs ist trocken, hell und tröstlich (Klangplan 3A1), mit viel Raum zwischen den
Tönen; das Ortsthema steht in E-Dur, der Tonart der offenen Gitarre. Seit der Umstellung auf A0
(Etappe Akt 3, 22.11.2026) hat es einen Kopf (H E' Dis H | Cis), Form A A' B A' offen, drei Spuren
(Zusatz: das Windspiel) und Fassungen für Nacht und drinnen. Der Wüstenzug spielt das Thema von
Maple Falls weit und langsam. Miras Motiv ist Ambroses Kopf doppelt so schnell mit der reinen 4
(5 – 3 – 4 – 2, A1, „Mira“), verspielt wiederholt und umspielt; das Thema des Helden ist
2 – 3 – 5 · 2 – 3 – 5 – 6 · 5 – 3 – 2 – 1 (A1, „Held, vollständig“). Der Clubkampf ist die
Steigerung des Kampfthemas von Akt 3 (akt3_siliconbay.py) mit der reinen 4; im B-Teil singt das
Cello den Helden, Miras Motiv auf der Ukulele ist die Zusatzspur. Nach „Atme“ laufen Mira und der
Held im selben Tempo. Am Motel spielt die Slide-Gitarre allein, darüber leise der Held, kein Glockenspiel (das
Nachtstück bleibt Kapitel 14, 55 und 59 vorbehalten).

Ersatz: Die Slide-Gitarre ist die unverzerrte E-Gitarre mit viel Hall (ein Gleiten zwischen den
Tönen kann der Satzplan nicht schreiben), das Windspiel ein leises Glockenspiel in der Pentatonik.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.maple import FORM as MAPLE_FORM
from pipeline.abenteuer.ton.stuecke.maple import GEGEN_ANHEBUNG, mit_spuren
from pipeline.abenteuer.ton.stuecke.maple import MELODIE_TEILE as MAPLE_MELODIE
from pipeline.abenteuer.ton.stuecke.maple import teile as maple_teile

TONART = "E"
OBEN = 1
AKT = 3


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


# --- Miras Motiv (A1): Kopf doppelt so schnell mit reiner 4, dann umspielt, endet auf der 5 ---
MIRA = (
    "5:1/2 3:1 4:1/2 2:5/4 r:3/4 | "
    "5:1/4 6:1/4 5:1/4 3:1/4 3:1/2 4:1/2 2:1/4 3:1/4 4:1/4 2:1/4 2:1 | "
    "5:1/2 3:1/2 4:1/2 2:1/2 5:1/2 3:1/2 4:1/4 3:1/4 2:1/2 | "
    "2:1/4 3:1/4 2:1/4 7,:1/4 5,:1 r:2"
)
MIRA_AKKORDE = "I ii | I ii | I | V"
# Der Held vollständig in den Werten aus motive.HELD_VOLLSTAENDIG (vier Takte) ...
HELD = "2:1 3:1 5:2 | 2:1 3:1 5:1 6:1 | 5:1 3:1 2:1 1:4 r:1"
HELD_AKKORDE = "V | V vi7 | I | I"

_WUESTE_STIMMEN, _WUESTE_SPUREN = mit_spuren(
    (
        Stimme("gitarre", "zupfen", 0.75, -0.3, 0.5, 0, 38),
        Stimme("kontrabass", "bass_grund", 0.45, 0.0, 0.5, 1, 36),
    ),
    (
        Stimme("egitarre", "melodie", 0.8, 0.2, 0.6, OBEN, 52, MAPLE_MELODIE),
        Stimme("gitarre", "melodie", 0.65 * GEGEN_ANHEBUNG, 0.0, 0.5, 0, 46, nur("b")),
    ),
    # Das Windspiel spielt die Farbstimme von Maple Falls, leise und hoch.
    (Stimme("glockenspiel", "noten", 0.3, 0.3, 0.6, OBEN, 30, kennung="farbe"),),
)
WEG_WUESTE = Satz(
    "weg.wueste",
    "Wüstenzug",
    "G",
    70,
    4,
    maple_teile(),
    MAPLE_FORM,
    _WUESTE_STIMMEN,
    akt=AKT,
    spuren=_WUESTE_SPUREN,
    zusatz="farbe",
    beschreibung="Weit, leer: das Thema von Maple Falls langsam, Slide-Gitarre, viel Hall, ein Windspiel.",
)

# --- Desert Springs (A0, Etappe Akt 3): Kopf H E' Dis H | Cis H Gis ---
# Der Quartsprung hinauf ist das Kennzeichen; die Linie fällt in Schritten. Ohne Pausen: Mit Pausen
# und langen Tönen der Slide-Gitarre schwankte die Lautheit zu stark (LRA über 5, A0.6).
KOPF = "5:1 1':1 7:1 5:1 | 6:2 5:1 3:1"
A = Teil("I | IV | I | V", f"{KOPF} | 3:2 5:1 3:1 | 2:2 3:1 2:1")
A2 = Teil("I | IV | IV V | I", f"{KOPF} | 4:1 3:1 2:1 7,:1 | 1:4")
# Letzter Takt in Vierteln zurück zum Kopf (Naht der Schleife, A0.6).
A_OFFEN = Teil("I | IV | ii | V", f"{KOPF} | 4:1 3:1 2:1 7,:1 | 2:1 3:1 4:1 7,:1")
# B: Die Slide-Gitarre schweigt, die Gitarre antwortet (als Melodie des Teils), endet auf V7.
B = Teil(
    "IV | I | vi | V | IV | I | ii | V7",
    "1':2 6:2 | 1':2 6:1 5:1 | 6:2 4:2 | 5:4 | 4:2 6:2 | 5:2 3:2 | 2:2 4:2 | 5:2 7,:2",
)
WINDSPIEL_1 = "r:4 | r:2.5 5':0.25 1'':0.25 6':1 | r:4 | r:1 3':0.25 5':0.25 2':0.5 r:2"
WINDSPIEL_2 = "r:4 | r:3 6':0.25 5':0.25 3':0.5 | r:4 | r:2 2':0.25 3':0.25 5':1.5"
WIND = {"a": WINDSPIEL_1, "a2": WINDSPIEL_2, "b": f"{WINDSPIEL_1} | {WINDSPIEL_2}", "a3": WINDSPIEL_1}
DESERT_TEILE = {
    name: Teil(teil.akkorde, teil.melodie, {"wind": WIND[name]})
    for name, teil in (("a", A), ("a2", A2), ("b", B), ("a3", A_OFFEN))
}
FORM = ("a", "a2", "b", "a3")
MELODIE_TEILE = nur("a", "a2", "a3")
WIND_STIMME = (Stimme("glockenspiel", "noten", 0.3, 0.4, 0.55, OBEN, 30, kennung="wind"),)


def _desert(kennung: str, titel: str, tempo: float, spuren: tuple, text: str) -> Satz:
    """Eine Fassung des Ortsthemas in drei Spuren (Zusatz: das Windspiel)."""
    stimmen, gruppen = mit_spuren(*spuren)
    return Satz(
        kennung,
        titel,
        TONART,
        tempo,
        4,
        DESERT_TEILE,
        FORM,
        stimmen,
        akt=AKT,
        spuren=gruppen,
        zusatz="farbe",
        beschreibung=text,
    )


def _melodie(instrument: str, staerke: int, hall: float) -> tuple[Stimme, ...]:
    """Melodie in A, die Gitarre antwortet im B-Teil (lauter, A0.6)."""
    return (
        Stimme(instrument, "melodie", 0.65, 0.15, hall, OBEN, staerke, MELODIE_TEILE),
        Stimme("gitarre", "melodie", 0.48 * GEGEN_ANHEBUNG, -0.1, hall, 0, staerke - 6, nur("b")),
    )


DESERT_SPRINGS = _desert(
    "desertSprings",
    "Desert Springs",
    72,
    (
        (
            Stimme("gitarre", "halten", 0.85, -0.3, 0.45, 0, 40),
            Stimme("gitarre", "zupfen", 0.5, 0.25, 0.4, 0, 34),
            Stimme("kontrabass_pizz", "bass_grund", 0.6, 0.0, 0.3, 1, 48),
        ),
        _melodie("egitarre", 52, 0.5),
        WIND_STIMME,
    ),
    "Trocken, hell, tröstlich: der Kopf auf der Slide-Gitarre, ein Akkord je Takt, ein Windspiel.",
)
DESERT_SPRINGS_NACHT = _desert(
    "desertSprings.nacht",
    "Desert Springs, Nacht",
    # 64 statt 58: Bei langsamem Tempo stehen die einzelnen Anschläge als Spitzen heraus (A0.6).
    64,
    (
        (
            Stimme("gitarre", "halten", 0.8, -0.3, 0.55, 0, 38),
            Stimme("gitarre", "zupfen", 0.55, 0.25, 0.5, 0, 34),
            Stimme("kontrabass_pizz", "bass_grund", 0.55, 0.0, 0.4, 1, 44),
        ),
        _melodie("egitarre", 46, 0.6),
        WIND_STIMME,
    ),
    "Nacht: dieselbe Melodie langsam, leise gezupft, viel Hall, das Windspiel.",
)
# Innen (Garage, Antiquariat): die Melodie auf der Mundharmonika, leise gezupft darunter (gezupft
# allein stand jeder Anschlag als Spitze heraus, A0.6).
DESERT_SPRINGS_INNEN = _desert(
    "desertSprings.innen",
    "Desert Springs, drinnen",
    84,
    (
        (
            Stimme("gitarre", "zupfen", 0.8, -0.25, 0.3, 0, 42),
            Stimme("kontrabass_pizz", "bass_grund", 0.6, 0.0, 0.25, 1, 46),
        ),
        _melodie("mundharmonika", 48, 0.3),
        WIND_STIMME,
    ),
    "Drinnen: das Thema von Desert Springs auf der Mundharmonika, leise gezupft darunter.",
)

# --- Clubkampf gegen Mira: Steigerung des Kampfthemas von Akt 3 (akt3_siliconbay.py) ---
# Derselbe Kopf, aber mit der reinen 4 wie in Miras Motiv (sie kennt den fremden Ton nicht); im
# B-Teil liegt der Held ruhig darunter; Miras Motiv auf der Ukulele ist die Steigerung.
KAMPF_KOPF = "3:1/2 5:1/2 4:1/2 5:1/2 2':1 r:1 | 2':3/4 1':1/4 5:1 r:1/2 4:1/2 5:1"
KAMPF_A = Teil("I | IV | I | V", f"{KAMPF_KOPF} | 3:1/2 5:1/2 4:1/2 2:1/2 3:1 r:1 | 2:2 7,:2")
KAMPF_A2 = Teil("I | IV | ii V | I", f"{KAMPF_KOPF} | 6:1/2 5:1/2 4:1/2 2:1/2 7,:2 | 1:4")
KAMPF_OFFEN = Teil("I | IV | ii | V7", f"{KAMPF_KOPF} | 6:1/2 5:1/2 4:1/2 2:1/2 7,:2 | 2:1 3:1 4:1 7,:1")
KAMPF_B = Teil(
    "V | I | V | IV | I | V | I | V7",
    "2:2 3:2 | 5:4 | 2:2 3:2 | 5:2 6:2 | 5:2 3:2 | 2:2 1:2 | 1:4 | 2:2 7,:2",
)
STILL_ACHT = " | ".join(["r:4"] * 8)
MIRA_LINIE = {"a": MIRA, "a2": MIRA, "b": STILL_ACHT, "a3": MIRA}
KAMPF_TEILE = {
    name: Teil(teil.akkorde, teil.melodie, {"mira": MIRA_LINIE[name]})
    for name, teil in (("a", KAMPF_A), ("a2", KAMPF_A2), ("b", KAMPF_B), ("a3", KAMPF_OFFEN))
}
_KAMPF_STIMMEN, _KAMPF_SPUREN = mit_spuren(
    (
        Stimme("gitarre", "schlagen", 0.55, -0.3, 0.15, 0, 46),
        Stimme("kontrabass_pizz", "bass_laufend", 0.75, 0.0, 0.15, 1, 60),
        Stimme("schlagwerk", "klatschen", 0.4, 0.3, 0.15, staerke=56),
    ),
    (
        Stimme("gitarre", "melodie", 0.8, 0.2, 0.2, OBEN, 62, MELODIE_TEILE),
        Stimme("cello", "melodie", 0.7 * GEGEN_ANHEBUNG, -0.15, 0.3, 0, 54, nur("b")),
    ),
    (Stimme("ukulele", "noten", 0.55, 0.0, 0.2, OBEN, 56, kennung="mira"),),
)
DESERT_SPRINGS_CLUBKAMPF = Satz(
    "desertSprings.clubkampf",
    "Desert Springs, Clubkampf",
    TONART,
    144,
    4,
    KAMPF_TEILE,
    FORM,
    _KAMPF_STIMMEN,
    akt=AKT,
    spuren=_KAMPF_SPUREN,
    zusatz="steigerung",
    beschreibung="Sturm gegen Ruhe: Kampfthema mit der reinen 4, der Held im B-Teil, Miras Motiv steigert.",
)

# --- Nach „Atme“: Miras Motiv und der Held im selben Tempo ---
MIRA_HELD_AKKORDE = "V | V | I | Imaj7"
MIRA_HELD = Satz(
    "mira.held",
    "Mira und der Held",
    TONART,
    120,
    4,
    {
        "m1": Teil(MIRA_HELD_AKKORDE, MIRA, {"held": HELD}),
        "m2": Teil(MIRA_HELD_AKKORDE, MIRA, {"held": HELD}),
    },
    ("m1", "m1", "m2", "m2", "m1", "m2", "m1", "m2"),
    (
        Stimme("gitarre", "melodie", 0.75, 0.25, 0.25, OBEN, 54),
        Stimme("klavier", "noten", 0.95, -0.15, 0.3, OBEN, 54, nur("m1"), "held"),
        Stimme("cello", "noten", 0.9, -0.1, 0.3, 0, 56, nur("m2"), "held"),
        Stimme("gitarre", "zupfen", 0.45, -0.3, 0.25, 0, 34),
        Stimme("kontrabass_pizz", "bass_grund", 0.55, 0.0, 0.2, 1, 46),
        Stimme("schlagwerk", "klatschen", 0.25, 0.3, 0.2, staerke=42, teile=nur("m2")),
    ),
    akt=AKT,
    beschreibung="Zäh und schön: Miras Motiv und das Thema des Helden miteinander, im selben Tempo.",
)

# --- Nacht am Motel (Kap. 46): Slide-Gitarre allein, darüber leise der Held ---
STILL_1 = Teil("I | IV | vi | V", linien={"slide": "5:4 | 6:2 5:2 | 3:4 | 2:4"})
STILL_2 = Teil("vi | IV | I | V", linien={"slide": "3:4 | 4:2 6:2 | 5:4 | 2:4"})
MOTEL_NACHT = Satz(
    "motel.nacht",
    "Nacht am Motel",
    TONART,
    50,
    4,
    {"s1": STILL_1, "s2": STILL_2, "held": Teil(HELD_AKKORDE, HELD)},
    ("s1", "held", "s1", "held", "s2", "held", "s1", "held"),
    (
        Stimme("egitarre", "zupfen", 0.7, -0.2, 0.55, 0, 34),
        Stimme("egitarre", "noten", 0.7, 0.1, 0.6, OBEN, 46, kennung="slide"),
        Stimme("gitarre", "melodie", 0.65, 0.25, 0.45, OBEN, 40, nur("held")),
    ),
    akt=AKT,
    beschreibung="Weit, leer, zärtlich: Slide-Gitarre allein, darüber leise das Thema des Helden.",
)

STUECKE = (
    WEG_WUESTE,
    DESERT_SPRINGS,
    DESERT_SPRINGS_NACHT,
    DESERT_SPRINGS_INNEN,
    DESERT_SPRINGS_CLUBKAMPF,
    MIRA_HELD,
    MOTEL_NACHT,
)
