"""Ambrose und Victor in Akt 2: London, Lauf, Zweifel, Cello, Nachtwalzer, Victor unsicher, Erkennen.

Warum: In Akt 2 erfährt man, woher Ambrose kommt (Klangplan 2A2). Die Erinnerung an London 1851 ist
ein Walzer mit seinem jungen Kopf (5 – 3 – ♯4 – 2, schnell und verspielt), der Lauf daraus ein
Galopp. In „Oder doch?“ spielt das Digitalpiano des Konzerns genau den fremden Ton (♯4) seines
Kopfes: Die Musik zeigt, dass Ambroses Makel der Grundton der Maschine ist (A1). Nach dem Brief
spielt ein Cello allein das vollständige Thema. Die Erinnerung an Morphy ist das New-York-Thema aus
Akt 1 (``ambrose.walzer``) erst in Moll, nach Morphys Damenzug in Dur mit Streichern. Am Ende von
Akt 2 erklingen Ambroses Kopf (frei) und Victors Thema (Achtel) gleichzeitig: dieselben Töne.

Tongenau: Die Köpfe kommen aus ``ambrose1`` (KOPF, ANTWORT, Walzer), Victor spielt dieselben vier
Stufen in Achteln (motive.VICTOR).
"""

import re

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.ambrose1 import ANTWORT, KOPF, WALZER_A, WALZER_B

TONART = "G"
AKT = 2
OBEN = 1
# Stufen, die in Moll einen Halbton tiefer liegen (Terz, Sexte, Septime).
MOLL_STUFE = re.compile(r"(^|\s|>)([367][',]*:)")


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


def nach_moll(melodie: str) -> str:
    """Dieselbe Melodie in Moll: 3, 6 und 7 werden erniedrigt. Beispiel: „5:2 3:1“ wird „5:2 b3:1“.

    Sonderfall: Stufen mit Vorzeichen (``#4``) bleiben, wie sie sind.
    """
    return MOLL_STUFE.sub(r"\1b\2", melodie)


# London 1851: der junge Kopf als schneller Walzer, hell, glänzend.
LONDON_A = Teil(
    "I | II | V7 | V7 | I | II | V7 | I",
    "5:1 3:1 #4:1 | 2:1 #4:1 6:1 | 5:2 4:1 | 7:1.5 6:0.5 5:1 | "
    "5:1 3:1 #4:1 | 2:1 #4:1 6:1 | 2':1 1':1 7:1 | 1':3",
)
LONDON_B = Teil(
    "IV | IV | I | I | II7 | II7 | V | V7",
    "6:2 1':1 | 1':1 6:1 4:1 | 5:2 3:1 | 1:1 3:1 5:1 | #4:2 6:1 | 1':1 6:1 #4:1 | 5:2 2:1 | 7,:1 2:1 4:1",
)
LONDON_TEILE = {
    "vor": Teil("I | I | V7 | V7"),
    "a": LONDON_A,
    "b": LONDON_B,
    "a2": LONDON_A,
    # Anderssens stiller Königszug (S30): zwei Takte nichts.
    "still": Teil("N.C. | N.C."),
    # Das Damenopfer: ein gehaltener Akkord, darin Ambroses fremder Ton.
    "opfer": Teil("II7 | II7 | II7 | II7"),
    "matt": Teil("V7 | V7 | I | I", "4:3 | 2':1.5 7:1.5 | 1':3 | 1':3"),
    # Rückkehr: der Kopf noch einmal im Cembalo, dann verhallt der Walzer.
    "zerfall": Teil("I | I | I | I", linien={"zerfall": "5:1 3:1 #4:1 | 2:3 | r:3 | r:3"}),
}
WALZERTEILE = ("vor", "a", "b", "a2")
AMBROSE_LONDON = Satz(
    "ambrose.london",
    "Ambrose, London 1851",
    TONART,
    144,
    3,
    LONDON_TEILE,
    ("vor", "a", "b", "a2", "b", "a", "still", "opfer", "matt", "zerfall"),
    (
        Stimme("cembalo", "walzer", 0.7, -0.25, 0.3, 0, 50, nur(*WALZERTEILE, "matt")),
        Stimme("violinen", "melodie", 0.8, 0.15, 0.35, OBEN, 58, nur("a", "b", "matt")),
        Stimme("cembalo", "melodie", 0.65, -0.1, 0.3, OBEN, 56, nur("a2")),
        Stimme("bratschen", "halten", 0.45, 0.3, 0.35, 0, 38, nur(*WALZERTEILE, "opfer", "matt")),
        Stimme("violinen", "halten", 0.45, 0.1, 0.6, OBEN, 42, nur("opfer", "zerfall")),
        Stimme("kontrabass_pizz", "bass_grund", 0.6, 0.0, 0.25, 1, 50, nur(*WALZERTEILE, "matt")),
        Stimme("cembalo", "noten", 0.6, 0.2, 0.85, OBEN, 46, nur("zerfall"), "zerfall"),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Glänzend, jung: Ambroses junger Kopf als schneller Walzer mit Streichern und Cembalo.",
)

# Der Lauf: der junge Kopf als Galopp, eine Tonleiter bis zur hohen 1, eine Kadenz.
LAUF = Teil(
    "I | I | II7 | I | V7 | I | I | IV | V7 | I",
    "r:1 5,:0.5 5,:0.5 | 5:0.5 3:0.5 #4:0.5 2:0.5 | #4:0.5 6:0.5 #4:0.5 2:0.5 | 5:0.5 3:0.5 #4:0.5 2:0.5 | "
    "4:0.5 2:0.5 7,:0.5 5,:0.5 | 1:0.25 2:0.25 3:0.25 4:0.25 5:0.25 6:0.25 7:0.25 1':0.25 | "
    ">1':1.5 r:0.5 | 6:0.5 r:0.5 1':0.5 r:0.5 | 7:0.5 r:0.5 2':0.5 r:0.5 | >1':1 r:1",
)
LONDON_LAUF = Satz(
    "london.lauf",
    "London, der Lauf",
    TONART,
    132,
    2,
    {"lauf": LAUF},
    ("lauf",),
    (
        Stimme("violinen_pizz", "melodie", 0.85, 0.15, 0.3, OBEN, 64),
        Stimme("cembalo", "walzer", 0.65, -0.25, 0.3, 0, 52),
        Stimme("kontrabass_pizz", "bass_grund", 0.55, 0.0, 0.2, 1, 54),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Übermütig: der junge Kopf als Galopp, gezupfte Streicher und Cembalo, eine Tonleiter.",
)

# „Oder doch?“: Ambroses Kopf auf dem alten Klavier, nur die ♯4 kommt aus dem Digitalpiano.
ZWEIFEL = Teil(
    "I II | II | IV",
    "5:1 3:1.85 5:0.15 r:1 | 2:2.5 r:1.5 | r:4",
    {"konzern": "r:3 #4:1 | r:4 | r:2 #4:1.5 r:0.5"},
)
AMBROSE_ZWEIFEL = Satz(
    "ambrose.zweifel",
    "Ambrose, Zweifel",
    TONART,
    66,
    4,
    {"z": ZWEIFEL},
    ("z",),
    (
        Stimme("klavier_alt", "melodie", 0.85, 0.1, 0.5, OBEN, 52),
        Stimme("digitalpiano", "noten", 1.5, 0.0, 0.0, OBEN, 80, kennung="konzern"),
        Stimme("klavier_alt", "halten", 0.35, -0.15, 0.5, -1, 32),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Versuchung: Ambroses Kopf, aber der fremde Ton kommt aus dem Digitalpiano des Konzerns.",
)

# Nach dem Brief: das vollständige Thema auf einem Cello, sehr langsam; einstimmig endet es auf der 1.
STILLE = "N.C. | N.C. | N.C."
AMBROSE_CELLO = Satz(
    "ambrose.cello",
    "Ambrose, Cello",
    TONART,
    40,
    4,
    {
        "voll": Teil("N.C. | N.C. | N.C. | N.C.", f"{KOPF} | {ANTWORT}"),
        "kopf": Teil(STILLE, f"{KOPF} | r:4"),
        "schluss": Teil(STILLE, "3:1.5 1:1.5 2:1 | 1:8", {"tief": "r:4 | 1,:8"}),
    },
    ("voll", "kopf", "schluss"),
    (
        Stimme("cello", "melodie", 0.85, 0.0, 0.5, 0, 54),
        Stimme("cello", "noten", 0.5, 0.0, 0.5, 0, 42, nur("schluss"), "tief"),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Erschüttert: Ambroses vollständiges Thema auf einem einzelnen Cello, sehr langsam.",
)

# Morphy in New York: das Walzerthema aus Akt 1, zuerst in Moll (Klavier allein), dann in Dur.
NACHTWALZER_TEILE = {
    "vor": Teil("i | i"),
    "am": Teil("i | II | V | V7 | i | V | i | i", nach_moll(WALZER_A.melodie)),
    "bm": Teil("iv | V7 | iiø | V | iv | II7 | V | V7", nach_moll(WALZER_B.melodie)),
    # Morphys Damenzug: ein Lauf über die Dominante, die Streicher setzen ein.
    "zug": Teil("V7"),
    "ad": WALZER_A,
    "bd": WALZER_B,
    "schluss": Teil("I | IV | V7 | I", "5:3 | 6:3 | 2':3 | 1':3"),
}
MOLL = ("vor", "am", "bm")
DUR = ("ad", "bd", "schluss")
AMBROSE_NACHTWALZER = Satz(
    "ambrose.nachtwalzer",
    "Ambrose, Nachtwalzer",
    TONART,
    100,
    3,
    NACHTWALZER_TEILE,
    (*MOLL, "zug", *DUR),
    (
        Stimme("klavier", "melodie", 0.8, 0.1, 0.45, OBEN, 48, nur("am", "bm")),
        Stimme("klavier", "walzer", 0.55, -0.15, 0.45, 0, 38, nur(*MOLL, *DUR)),
        Stimme("klavier", "harfe", 0.6, -0.1, 0.5, 0, 46, nur("zug")),
        Stimme("violinen", "melodie", 0.8, 0.15, 0.4, OBEN, 56, nur(*DUR)),
        Stimme("bratschen", "halten", 0.45, 0.3, 0.4, 0, 36, nur("zug", *DUR)),
        Stimme("cello", "bass_grund", 0.55, -0.2, 0.4, 1, 42, nur(*DUR)),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Nachts, dann hell: das New-York-Thema in Moll, nach Morphys Damenzug in Dur.",
)

# Victor auf der Brücke: dieselben Achtel, aber er zögert vor dem letzten Ton.
VICTOR_UNSICHER = Satz(
    "victor.unsicher",
    "Victor, unsicher",
    TONART,
    120,
    4,
    {
        "v": Teil(
            "vi | vi | vi | vi",
            "5:0.5 3:0.5 #4:0.5 2:0.5 r:2 | r:4 | 5:0.5 3:0.5 #4:0.5 r:2.5 | r:1 2:3",
            {"bass": "6,,:1 6,,:1 6,,:1 6,,:1 | 6,,:1 6,,:1 6,,:2 | 6,,:4 | r:4"},
        )
    },
    ("v",),
    (
        Stimme("klavier_trocken", "melodie", 0.85, 0.0, 0.1, OBEN, 66),
        Stimme("klavier_trocken", "noten", 0.7, -0.1, 0.1, 0, 56, kennung="bass"),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Zögernd: Victors Thema auf dem trockenen Klavier, mit einer Pause vor dem letzten Ton.",
)

# „J. H.“: Ambroses Kopf (frei, doppelt so lang) und Victors Achtel zugleich; beide landen auf der 2.
VICTOR_FIGUR = "5:0.5 3:0.5 #4:0.5 2:0.5 r:2"
ERKENNEN = Teil(
    " | ".join(["vi"] * 10),
    "r:4 | r:4 | 5:2 3:3.7 5:0.3 #4:2 2:5 r:3 | 5:2 3:3.7 5:0.3 #4:2 2:5 r:3",
    {
        "victor": f"{VICTOR_FIGUR} | r:4 | {VICTOR_FIGUR} | {VICTOR_FIGUR} | {VICTOR_FIGUR} | r:4 | "
        "r:4 | r:2.5 5:0.5 3:0.5 #4:0.5 | 2:5 r:3",
        "bass": " | ".join(["6,,:1 6,,:1 6,,:1 6,,:1"] * 6 + ["6,,:4"] * 4),
    },
)
AMBROSE_VICTOR = Satz(
    "ambrose.victor",
    "Ambrose und Victor",
    TONART,
    120,
    4,
    {"e": ERKENNEN},
    ("e",),
    (
        Stimme("klavier_alt", "melodie", 0.85, 0.2, 0.5, OBEN, 56),
        Stimme("klavier_trocken", "noten", 0.75, -0.2, 0.1, OBEN, 64, kennung="victor"),
        Stimme("klavier_trocken", "noten", 0.6, -0.1, 0.1, 0, 52, kennung="bass"),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Erkennen: Ambroses Kopf (altes Klavier) und Victors Achtel gleichzeitig, dieselben Töne.",
)

STUECKE = (
    AMBROSE_LONDON,
    LONDON_LAUF,
    AMBROSE_ZWEIFEL,
    AMBROSE_CELLO,
    AMBROSE_NACHTWALZER,
    VICTOR_UNSICHER,
    AMBROSE_VICTOR,
)
