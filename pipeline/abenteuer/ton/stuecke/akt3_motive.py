"""Akt 3, kurze Motive und Figurenstücke: Mama im Schnee, Endspiel, tiefer Streicher, Held, Mira,
Atme, Hales Horn, die Fanfaren, Slicks Postkarte und Victors Maschine (Klangplan 3A2, 3A3).

Warum: Die Leitmotive aus A1 erklingen hier zum ersten Mal für sich, tongenau wie in ``motive.py``:
Mama 1 – 2 – 3 – 5 – 6 – 5 mit gehaltener 5, der Held 2 – 3 – 5, Hale die vier Töne des Kopfes in
gleichen Vierteln auf dem Horn (Victors Achtel halb so schnell, ohne Moll-Begleitung), das Endspiel
die ersten vier Töne des Quintenturms in D (D – A – E – H). Victors Maschine spielt Victors Thema,
der letzte Ton kommt vom Digitalpiano des Konzerns und ist einen Halbton zu tief (♭2 statt 2).
In Port Delacroix gibt es keine Fanfare (dort ``held``); in Silicon Bay klingt sie gedämpft, in
Desert Springs mit Slide-Gitarre.

Ersatz: Slide-Gitarre ist die unverzerrte E-Gitarre. ``riverton.postkarte`` braucht das Thema von
Riverton aus Akt 2, das noch nicht gesetzt ist; bis dahin steht hier eine eigene Phrase im Stil von
Riverton (Swing in Moll) auf der Mundharmonika, die gegen den Kopf des Riverton-Themas getauscht
werden soll.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.akt3_desert import MIRA, MIRA_AKKORDE
from pipeline.abenteuer.ton.stuecke.kurz import kurz

OBEN = 1
AKT = 3
# Mama (motive.MAMA): 1 – 2 – 3 – 5 (gehalten) – 6 – 5, drei Takte.
MAMA = "1:1 2:1 3:1 5:3 6:1.5 5:4 r:0.5"
# Das Aha (motive.AHA) eine Oktave über dem Dreiklang, wie in der Fanfare von Akt 1.
AHA_OBEN = "r:4 | 2':0.25 5':0.5 1'':3.25"
FANFARE_LINIE = "1:0.5 3:0.5 5:0.5 1':2.5 | r:4"


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


MAMA_SCHNEE = Satz(
    "mama.schnee",
    "Mama im Schnee",
    "G",
    60,
    4,
    {
        "vor": Teil("I"),
        "m1": Teil("I | I IV | I", MAMA),
        "m2": Teil("vi | V IV | I", MAMA),
        "nach": Teil("I"),
    },
    ("vor", "m1", "m2", "nach"),
    (
        Stimme("klavier", "melodie", 0.8, 0.1, 0.4, OBEN, 48, nur("m1", "m2")),
        Stimme("klavier", "wiegen", 0.75, -0.1, 0.4, 0, 32),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Warm: Mamas Thema vollständig auf dem Klavier allein, die 5 zögert.",
)

ENDSPIEL = kurz(
    "endspiel",
    "Endspiel",
    60,
    4,
    Teil("N.C. | N.C. | N.C.", "1:3 5:3 2':3 6':3", {"flageolett": "r:2 1'':10"}),
    (
        Stimme("klavier", "melodie", 0.85, 0.0, 0.6, -1, 50),
        Stimme("violinen", "noten", 0.35, 0.1, 0.6, OBEN, 34, kennung="flageolett"),
    ),
    "Kalt, schön: die ersten vier Töne des Quintenturms einzeln am Klavier, darüber ein hoher Streicherton.",
    tonart="D",
    akt=AKT,
)

TIEFER_STREICHER = kurz(
    "tiefer_streicher",
    "Tiefer Streicher",
    60,
    4,
    Teil("N.C. | N.C.", "1,:7 r:1"),
    (
        Stimme("cello", "melodie", 0.8, -0.1, 0.4, 0, 50),
        Stimme("kontrabass", "melodie", 0.6, 0.1, 0.4, -1, 46),
    ),
    "Ernst: ein einziger tiefer Streicherton, Cello und Kontrabass im Einklang.",
    tonart="E",
    akt=AKT,
)

HELD = kurz(
    "held",
    "Held",
    56,
    4,
    Teil("N.C. | N.C.", "2:1.5 3:1.5 5:5"),
    (Stimme("gitarre", "melodie", 0.8, 0.0, 0.4, OBEN, 40),),
    "Eigen, still: drei aufsteigende Töne (2 – 3 – 5) auf einer einzelnen Gitarre, ganz leise.",
    akt=AKT,
)

MIRA_KURZ = kurz(
    "mira",
    "Mira",
    120,
    4,
    Teil(MIRA_AKKORDE, MIRA),
    (
        Stimme("gitarre", "melodie", 0.85, 0.2, 0.25, OBEN, 60),
        Stimme("gitarre", "schlagen", 0.45, -0.3, 0.2, 0, 40),
        Stimme("schlagwerk", "klatschen", 0.4, 0.3, 0.2, staerke=54),
    ),
    "Verspielt, hell: Miras Motiv auf der Gitarre mit Händeklatschen.",
    tonart="E",
    akt=AKT,
)

ATME = kurz(
    "atme",
    "Atme",
    60,
    3,
    Teil("N.C. | N.C.", "5:6"),
    (Stimme("cello", "melodie", 0.8, 0.0, 0.45, 0, 46),),
    "Ruhe: ein einzelner langer Ton, die 5, auf dem Cello.",
    tonart="E",
    akt=AKT,
)

HALE = "5:1 3:1 #4:1 2:1"
HALE_HORN = kurz(
    "hale.horn",
    "Hales Horn",
    120,
    4,
    Teil(
        "I II | II | I II | ii | I II | II | IV | I",
        f"{HALE} | 2:4 | {HALE} | 2:2 r:2 | {HALE} | 2:4 | r:4 | r:4",
    ),
    (
        Stimme("horn", "melodie", 0.85, 0.1, 0.4, 0, 54),
        Stimme("bratschen", "halten", 0.7, -0.2, 0.4, 0, 34),
        Stimme("cello", "bass_grund", 0.5, 0.0, 0.4, 1, 36),
    ),
    "Friedlich: Hales Motiv, Victors gleiche Notenwerte halb so schnell, warm auf dem Horn.",
    akt=AKT,
)

FANFARE_GEDAEMPFT = Satz(
    "fanfare.gedaempft",
    "Fanfare, gedämpft",
    "G",
    120,
    4,
    {"k": Teil("I | I", FANFARE_LINIE, {"aha": AHA_OBEN})},
    ("k",),
    (
        Stimme("gitarre", "halten", 0.8, -0.3, 0.35, 0, 44),
        Stimme("trompete_gedaempft", "melodie", 0.75, 0.15, 0.35, OBEN, 54),
        Stimme("glockenspiel", "noten", 0.5, 0.3, 0.45, 0, 50, kennung="aha"),
    ),
    schleife=False,
    akt=AKT,
    pegel_db=-6.0,
    beschreibung="Die Fanfare gedämpft: gedämpfte Trompete, ein Gitarrenakkord, das Aha leise darüber.",
)

FANFARE_WUESTE = kurz(
    "fanfare.wueste",
    "Fanfare, Wüste",
    120,
    4,
    Teil("I | I", FANFARE_LINIE, {"aha": AHA_OBEN}),
    (
        Stimme("gitarre", "schlagen", 0.65, -0.3, 0.3, 0, 58),
        Stimme("egitarre", "melodie", 0.8, 0.2, 0.45, OBEN, 66),
        Stimme("glockenspiel", "noten", 0.6, 0.3, 0.45, 0, 64, kennung="aha"),
    ),
    "Die Fanfare mit Slide-Gitarre: Dur-Dreiklang aufwärts, endet mit dem Aha.",
    tonart="E",
    akt=AKT,
)

RIVERTON_POSTKARTE = Satz(
    "riverton.postkarte",
    "Slicks Postkarte",
    "a",
    120,
    4,
    {"k": Teil("i | iv i", "1:0.5 3:0.5 4:0.5 5:1 7:0.5 5:1 | 4:0.5 3:0.5 1:3")},
    ("k",),
    (Stimme("mundharmonika", "melodie", 0.85, 0.0, 0.35, OBEN, 58),),
    swing=1 / 6,
    schleife=False,
    akt=AKT,
    beschreibung="Eine Phrase im Stil von Riverton (Swing in Moll) auf der Mundharmonika, kurz.",
)

# Victor wie in Akt 1 (Achtel über e-Moll); beim zweiten Mal fehlt die 2, das Digitalpiano spielt ♭2.
VICTOR_MASCHINE = kurz(
    "victor.maschine",
    "Victor, Maschine",
    120,
    4,
    Teil(
        "vi | vi | N.C.",
        "5:0.5 3:0.5 #4:0.5 2:0.5 r:2 | 5:0.5 3:0.5 #4:0.5 r:2.5 | r:4",
        {
            "falsch": "r:4 | r:1.5 b2:2.5 | r:4",
            "bass": "6,,:1 6,,:1 6,,:1 6,,:1 | 6,,:1 6,,:1 6,,:2 | r:4",
        },
    ),
    (
        Stimme("klavier_trocken", "melodie", 0.9, 0.0, 0.05, OBEN, 72),
        Stimme("digitalpiano", "noten", 1.0, 0.0, 0.0, OBEN, 80, kennung="falsch"),
        Stimme("klavier_trocken", "noten", 0.8, -0.1, 0.05, 0, 64, kennung="bass"),
    ),
    "Kalt, falsch: Victors Thema; der letzte Ton kommt vom Digitalpiano und ist einen Halbton zu tief.",
    akt=AKT,
)

STUECKE = (
    MAMA_SCHNEE,
    ENDSPIEL,
    TIEFER_STREICHER,
    HELD,
    MIRA_KURZ,
    ATME,
    HALE_HORN,
    FANFARE_GEDAEMPFT,
    FANFARE_WUESTE,
    RIVERTON_POSTKARTE,
    VICTOR_MASCHINE,
)
