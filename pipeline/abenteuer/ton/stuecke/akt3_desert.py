"""Akt 3, Wüste und Desert Springs: Wüstenzug, Ortsthema, Clubkampf gegen Mira, Mira und der Held,
Nacht am Motel.

Warum: Desert Springs ist trocken, hell und tröstlich (Klangplan 3A1), mit viel Raum zwischen den
Tönen; das Ortsthema steht in E-Dur, der Tonart der offenen Gitarre. Der Wüstenzug ist das Wegthema
(Maple Falls) weit und langsam. Miras Motiv ist Ambroses Kopf doppelt so schnell mit der reinen 4
(5 – 3 – 4 – 2, A1, „Mira“), verspielt wiederholt und umspielt; das Thema des Helden ist
2 – 3 – 5 · 2 – 3 – 5 – 6 · 5 – 3 – 2 – 1 (A1, „Held, vollständig“). Im Clubkampf stürmt Miras
Motiv, darunter liegt der Held ruhig in doppelten Notenwerten; nach „Atme“ laufen beide im selben
Tempo. Am Motel spielt die Slide-Gitarre allein, darüber leise der Held, kein Glockenspiel (das
Nachtstück bleibt Kapitel 14, 55 und 59 vorbehalten).

Ersatz: Die Slide-Gitarre ist die unverzerrte E-Gitarre mit viel Hall (ein Gleiten zwischen den
Tönen kann der Satzplan nicht schreiben), das Windspiel ein leises Glockenspiel in der Pentatonik.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
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
# ... und in doppelten Werten (acht Takte), ruhig unter Miras Sturm.
HELD_BREIT = "2:2 3:2 | 5:4 | 2:2 3:2 | 5:2 6:2 | 5:2 3:2 | 2:2 1:2 | 1:4 | 1:2 r:2"
HELD_AKKORDE = "V | V vi7 | I | I"

WEG_WUESTE = Satz(
    "weg.wueste",
    "Wüstenzug",
    "G",
    70,
    4,
    maple_teile(),
    ("vor", "a1", "a2", "b", "a1", "a2", "a5", "a6"),
    (
        Stimme("egitarre", "melodie", 0.75, 0.2, 0.6, OBEN, 50, nur("a1", "a2", "b", "a5", "a6")),
        Stimme("gitarre", "zupfen", 0.75, -0.3, 0.5, 0, 38),
        Stimme("kontrabass", "bass_grund", 0.45, 0.0, 0.5, 1, 36, nur("b", "a5", "a6")),
    ),
    akt=AKT,
    beschreibung="Weit, leer: das Wegthema langsam auf der Slide-Gitarre, viel Hall, leise gezupft darunter.",
)

# --- Desert Springs: sparsam, viel Raum zwischen den Tönen, ein Windspiel ---
WUESTE_A = Teil(
    "I | IV | I | V | vi | IV | I | V",
    "5:3 r:1 | 6:2 1':2 | 3:4 | 2:3 r:1 | 1:2 3:2 | 4:3 r:1 | 3:2 2:1 1:1 | 2:4",
)
WUESTE_B = Teil(
    "IV | I | vi | V | IV | I | V | I",
    "1':3 r:1 | 1':2 6:1 5:1 | 6:3 r:1 | 5:4 | 4:2 6:2 | 5:3 r:1 | 2:2 5,:1 7,:1 | 1:4",
)
WINDSPIEL = (
    "r:4 | r:2.5 5':0.25 1'':0.25 6':1 | r:4 | r:1 3':0.25 5':0.25 2':0.5 r:2 | "
    "r:4 | r:3 6':0.25 5':0.25 3':0.5 | r:4 | r:2 2':0.25 3':0.25 5':1.5"
)
DESERT_TEILE = {
    "vor": Teil("I | IV"),
    "a": Teil(WUESTE_A.akkorde, WUESTE_A.melodie, {"wind": WINDSPIEL}),
    "b": Teil(WUESTE_B.akkorde, WUESTE_B.melodie, {"wind": WINDSPIEL}),
}
DESERT_SPRINGS = Satz(
    "desertSprings",
    "Desert Springs",
    TONART,
    66,
    4,
    DESERT_TEILE,
    ("vor", "a", "b", "a", "b"),
    (
        Stimme("egitarre", "melodie", 0.75, 0.15, 0.5, OBEN, 50, nur("a", "b")),
        Stimme("gitarre", "halten", 0.8, -0.3, 0.45, 0, 32),
        Stimme("glockenspiel", "noten", 0.3, 0.4, 0.55, OBEN, 30, kennung="wind"),
    ),
    akt=AKT,
    beschreibung="Trocken, hell, tröstlich: Slide-Gitarre sehr sparsam, ein Akkord je Takt, ein Windspiel.",
)

# --- Clubkampf gegen Mira: ihr Motiv als Sturm, darunter ruhig der Held ---
KAMPF_AKKORDE = "V iii7 | I V | V I | V IV | I iii7 | V ii7 | I | Iadd9"
DESERT_SPRINGS_CLUBKAMPF = Satz(
    "desertSprings.clubkampf",
    "Desert Springs, Clubkampf",
    TONART,
    144,
    4,
    {
        "k": Teil(KAMPF_AKKORDE, f"{MIRA} | {MIRA}", {"held": HELD_BREIT}),
        "sturm": Teil(MIRA_AKKORDE, MIRA),
    },
    ("k", "k", "sturm", "k", "k"),
    (
        Stimme("gitarre", "melodie", 0.8, 0.2, 0.2, OBEN, 62),
        Stimme("cello", "noten", 0.7, -0.15, 0.3, 0, 52, nur("k"), "held"),
        Stimme("gitarre", "schlagen", 0.5, -0.3, 0.15, 0, 44),
        Stimme("kontrabass_pizz", "bass_wechsel", 0.65, 0.0, 0.15, 1, 54),
        Stimme("schlagwerk", "klatschen", 0.4, 0.3, 0.15, staerke=56),
    ),
    akt=AKT,
    beschreibung="Sturm gegen Ruhe: Miras Motiv schnell auf Gitarre und Klatschen, darunter ruhig der Held.",
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

STUECKE = (WEG_WUESTE, DESERT_SPRINGS, DESERT_SPRINGS_CLUBKAMPF, MIRA_HELD, MOTEL_NACHT)
