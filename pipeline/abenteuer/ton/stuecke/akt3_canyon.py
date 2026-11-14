"""Akt 3, Ambrose von Canyon bis Desert Springs: Gitarre, heiter, „Mit dir“, Hale, stolpert, rein.

Warum: Nach der Trennung kehrt Ambroses Thema vorsichtig zurück, zuerst auf der Gitarre statt dem
Klavier (Klangplan 3A2, ``ambrose.gitarre``), am Felsbogen heiter in Dur. In „Mit dir“ führt der
Held Ambroses offene 2 mit seinen eigenen Tönen weiter (5 – 3 – ♯4 – 2 – 3 – 5, A1, „Frage und
Antwort“). In „Er hat gewartet“ spielen Ambrose und Hale dieselbe Melodie im Kanon: Ambrose frei,
Hale in Victors gleichen Notenwerten halb so schnell (Viertel statt Achtel) auf dem Horn. In der
Garage stolpert die Erinnerung, am Schluss klingt das Thema rein: dieselben Töne, aber die reine 4
(C statt Cis, A1, „Ambrose, rein“). Alle vollständigen Fassungen enden noch auf vi (Trugschluss bis
Kapitel 57).

Ersatz: keiner. ``ambrose.held`` spielt Ambrose auf dem alten Klavier (Kap. 40); am Felsbogen
(Kap. 42) verlangt der Plan Gitarre, beides ist dieselbe Datei.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.ambrose1 import ANTWORT, FRAGE, KOPF, VOLL

TONART = "G"
OBEN = 1
AKT = 3


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


# --- Canyon (Kap. 41): der Kopf auf der Gitarre, vorsichtig, viermal ---
AMBROSE_GITARRE = Satz(
    "ambrose.gitarre",
    "Ambrose, Gitarre",
    TONART,
    66,
    4,
    {"k1": FRAGE, "k2": FRAGE, "k3": FRAGE, "k4": FRAGE},
    ("k1", "k2", "k3", "k4"),
    (
        Stimme("gitarre", "melodie", 0.8, 0.15, 0.4, OBEN, 50, nur("k1", "k2", "k3")),
        Stimme("gitarre", "melodie", 0.65, 0.15, 0.45, OBEN + 1, 42, nur("k4")),
        Stimme("gitarre", "zupfen", 0.7, -0.3, 0.35, 0, 32),
    ),
    akt=AKT,
    beschreibung="Vorsichtig: Ambroses Kopf auf der Gitarre statt auf dem Klavier, leise gezupft darunter.",
)

# --- Felsbogen (Kap. 42): das Thema schneller, Dur-Begleitung, ein heiterer Mittelteil ---
HEITER_B = Teil("IV | V | iii vi | ii V", "6:1 5:1 4:1 3:1 | 2:2 5:2 | 3:1 5:1 3:1 1:1 | 2:3 r:1")
HEITER_B2 = Teil("IV | V7 | iii vi | ii V", "1':1 7:1 6:1 5:1 | 4:2 2:2 | 5:1 3:1 1:1 3:1 | 2:3 r:1")
AMBROSE_HEITER = Satz(
    "ambrose.heiter",
    "Ambrose, heiter",
    TONART,
    108,
    4,
    {"vor": Teil("I | IV"), "a": VOLL, "b": HEITER_B, "b2": HEITER_B2, "nach": Teil("IV | V | IV | V")},
    ("vor", "a", "b", "a", "b2", "a", "nach"),
    (
        Stimme("gitarre", "melodie", 0.8, 0.2, 0.25, OBEN, 58, nur("a", "b", "b2")),
        Stimme("gitarre", "travis", 0.8, -0.3, 0.2, 0, 46),
        Stimme("kontrabass_pizz", "bass_zweier", 0.65, 0.0, 0.15, 1, 54),
        Stimme("schlagwerk", "schellen", 0.3, 0.35, 0.2, staerke=40),
    ),
    akt=AKT,
    beschreibung="Hell, fast heiter: Ambroses Thema auf der Gitarre, schneller, mit Dur-Begleitung.",
)

# --- „Mit dir“ (Kap. 40, 42): Ambroses Kopf, der Held übernimmt mit 2 – 3 – 5 ---
HELD_ANTWORT = "r:4 | r:2 2:1 3:1 | 5:4 | r:4"
MIT_DIR = {
    "vor": Teil("I"),
    "h1": Teil("I II | II | I | Vsus4", f"{KOPF} | r:4 | r:4", {"held": HELD_ANTWORT}),
    "h2": Teil("I II | II | I | I", f"{KOPF} | r:4 | 5:4", {"held": "r:4 | r:2 2:1 3:1 | 5:8"}),
}
AMBROSE_HELD = Satz(
    "ambrose.held",
    "Ambrose und der Held",
    TONART,
    72,
    4,
    MIT_DIR,
    ("vor", "h1", "h2"),
    (
        Stimme("klavier_alt", "melodie", 0.8, -0.1, 0.45, OBEN, 50),
        Stimme("gitarre", "noten", 1.0, 0.2, 0.35, OBEN, 60, kennung="held"),
        Stimme("gitarre", "zupfen", 0.45, -0.3, 0.3, 0, 30),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Zusammen: Ambroses Kopf endet offen auf der 2, der Held führt sie mit 2 – 3 – 5 weiter.",
)

# --- „Er hat gewartet“ (Kap. 44): Ambrose und Hale im Kanon, ein Takt Abstand, dann einstimmig ---
HALE_KANON = "r:4 | 5:1 3:1 #4:1 2:1 | 3:1 1:1 2:1 1:1 | r:4"
KANON_AKKORDE = "I II | V II | I | vi"
AMBROSE_HALE = Satz(
    "ambrose.hale",
    "Ambrose und Hale",
    TONART,
    63,
    4,
    {
        "kanon": Teil(KANON_AKKORDE, f"{KOPF} | {ANTWORT}", {"hale": HALE_KANON}),
        "eins": Teil(KANON_AKKORDE, f"{KOPF} | {ANTWORT}", {"hale": f"{KOPF} | {ANTWORT}"}),
    },
    ("kanon", "kanon", "eins"),
    (
        Stimme("klavier_alt", "melodie", 0.8, -0.1, 0.45, OBEN, 50),
        Stimme("horn", "noten", 1.0, 0.2, 0.4, 0, 60, kennung="hale"),
        Stimme("klavier_alt", "halten", 0.35, -0.2, 0.45, 0, 30),
        Stimme("cello", "bass_grund", 0.45, 0.0, 0.4, 1, 36),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Antwort: Ambrose und Hales Horn spielen dieselbe Melodie im Kanon, am Schluss einstimmig.",
)

# --- Garage (Kap. 45): die Erinnerung von 1858 gedämpft; dann fehlen Takte, Töne doppeln sich ---
STOLPER_1 = Teil("I II | I | vi", "5:1 3:1.85 5:0.15 #4:1 | 3:1 1:1.5 2:1 r:0.5 | 1:3 r:1")
STOLPER_2 = Teil("I II | II", "5:1 5:1 3:1 3:1 | #4:1 #4:0.5 #4:0.5 2:1 r:1")
AMBROSE_STOLPERT = Satz(
    "ambrose.stolpert",
    "Ambrose, stolpert",
    TONART,
    58,
    4,
    {"vor": Teil("I"), "voll": VOLL, "s1": STOLPER_1, "s2": STOLPER_2},
    ("vor", "voll", "s1", "s2"),
    (
        Stimme("cembalo", "melodie", 0.75, 0.15, 0.45, OBEN, 48),
        Stimme("cembalo", "halten", 0.55, 0.2, 0.4, -1, 30),
        Stimme("cello", "bass_grund", 0.6, -0.1, 0.4, 1, 36),
    ),
    schleife=False,
    akt=AKT,
    pegel_db=-4.0,
    beschreibung="Erinnerung, Unruhe: das Thema von 1858 gedämpft, dann fehlen Takte und Töne doppeln sich.",
)

# --- Schluss Kap. 45: Ambrose rein, die reine 4 statt der ♯4, ohne Vorschlag ---
REIN = Teil("I IV | ii | I | vi", "5:1 3:2 4:1 | 2:2.5 r:1.5 | 3:1 1:1.5 2:1 r:0.5 | 1:3 r:1")
AMBROSE_REIN = Satz(
    "ambrose.rein",
    "Ambrose, rein",
    TONART,
    60,
    4,
    {"vor": Teil("I | IV"), "r1": REIN, "r2": REIN},
    ("vor", "r1", "r2"),
    (
        Stimme("gitarre", "melodie", 0.8, 0.2, 0.35, OBEN, 52, nur("r1")),
        Stimme("klavier", "melodie", 0.8, 0.1, 0.4, OBEN, 50, nur("r2")),
        Stimme("gitarre", "zupfen", 0.7, -0.3, 0.3, 0, 32),
        Stimme("klavier", "wiegen", 0.65, -0.1, 0.35, 0, 30, nur("r2")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Frieden: Ambroses Thema rein, ohne den fremden Ton, Gitarre und gestimmtes Klavier.",
)

STUECKE = (AMBROSE_GITARRE, AMBROSE_HEITER, AMBROSE_HELD, AMBROSE_HALE, AMBROSE_STOLPERT, AMBROSE_REIN)
