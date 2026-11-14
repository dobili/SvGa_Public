"""Victor in Akt 4: warm, Zug zwölf, Hale und Victor, Bergstation, Finale und Victors Lauf.

Warum: Victors Thema wird in Akt 4 warm (Klangplan 4A2): dieselben vier Töne mit der ♯4 (A1, er
behält den fremden Ton), aber mit Pedal, Atem und Dur-Begleitung; die ♯4 steht über dem
A-Dur-Akkord (II), wo sie kein fremder Ton mehr ist. An der Bergstation versucht es, mit dem
Thema des Helden mitzugehen, und stolpert fröhlich; im Finale wechseln sich beide Themen ab, im
Mittelspiel klingen sie miteinander, und nacheinander scheinen die Farben aller Lehrer auf.
Victors Lauf ist der Kopf des Walzers als Galopp, eine Tonleiter bis zur hohen 1 und eine Kadenz.

Ersatz: Big Joes Akkordeon ist die Orgel, Dr. Lins Celesta die Glasharfe, Miras Slide-Gitarre die
E-Gitarre, Wards Streicherflageolett die Violinen zwei Oktaven hoch, die Pauke im Lauf der Marsch
mit großer Trommel und Kontrabass. Der Jubel über dem Lauf ist ein Geräusch (Teil B).
Sonderfall: Der Kopf des London-Walzers (Akt 2) war beim Setzen noch nicht gesetzt; der Lauf nimmt
Ambroses jungen Walzerkopf aus ``ambrose1`` (5 – 3 – ♯4 – 2), wie A1 „Lauf“ ihn beschreibt.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.akt4_themen import (
    HALE,
    HALE_AKKORDE,
    HELD,
    OBEN,
    TONART,
    VICTOR_DUR,
    nur,
)
from pipeline.abenteuer.ton.stuecke.ambrose1 import VICTOR

AKT = 4

VICTOR_WARM = Satz(
    "victor.warm",
    "Victor, warm",
    TONART,
    72,
    4,
    {"v": VICTOR_DUR},
    ("v",),
    (
        Stimme("klavier", "melodie", 0.85, 0.1, 0.5, OBEN, 52),
        Stimme("klavier", "wiegen", 0.5, -0.1, 0.5, -1, 36),
        Stimme("bratschen", "halten", 0.35, 0.25, 0.45, 0, 30),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Warm: Victors Thema mit Pedal und Atem, Dur-Begleitung statt Moll-Bass.",
)

# Zug zwölf: Victors Thema wie in Kapitel 9 (Achtel, trockenes Klavier), der Bass jetzt auf G.
_VICTOR_9 = VICTOR.teile["v"].melodie
ZUG_ZWOELF = Satz(
    "zug.zwoelf",
    "Zug zwölf",
    TONART,
    120,
    4,
    {
        "v": Teil(
            "I | I | I | V",
            _VICTOR_9,
            {"bass": "1,:1 1,:1 1,:1 1,:1 | 1,:1 1,:1 1,:1 1,:1 | 1,:1 1,:1 1,:1 1,:1 | 5,,:4"},
        )
    },
    ("v",),
    (
        Stimme("klavier_trocken", "melodie", 0.9, 0.0, 0.05, OBEN, 70),
        Stimme("klavier_trocken", "noten", 0.75, -0.1, 0.05, 0, 58, kennung="bass"),
        Stimme("klavier_trocken", "tupfen", 0.4, 0.15, 0.1, 0, 40),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Erinnerung, gewendet: Victors Achtel auf dem trockenen Klavier, aber über Dur.",
)

# Hale und Victor: dieselbe Melodie in Hales Vierteln, Horn und Klavier eine Oktave auseinander.
HALE_VICTOR_TEIL = Teil(
    f"{HALE_AKKORDE} | V | {HALE_AKKORDE} | I V I I | I",
    f"{HALE} | 2:4 | {HALE} | 3:1 2:1 1:2 | 1:4",
)
HALE_VICTOR = Satz(
    "hale.victor",
    "Hale und Victor",
    TONART,
    60,
    4,
    {"hv": HALE_VICTOR_TEIL},
    ("hv",),
    (
        Stimme("horn", "melodie", 0.8, -0.2, 0.45, 0, 56),
        Stimme("klavier", "melodie", 0.7, 0.2, 0.45, OBEN, 50),
        Stimme("violinen", "halten", 0.35, 0.0, 0.45, 0, 30),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Versöhnung: Hales Motiv und Victors Thema, dieselbe Melodie, eine Oktave auseinander.",
)

# Bergstation: der Held leicht; Victor setzt an, verhaspelt sich, und es klingt fröhlich.
STOLPERN_1 = Teil(
    "I II II II | I I II II | I II II II | IV V I I",
    "5:0.5 3:0.5 #4:0.5 2:0.5 r:2 | 5:0.5 3:0.5 5:0.5 3:0.5 #4:0.5 r:0.5 2:1 | "
    "r:0.5 5:0.25 3:0.25 #4:1 2:0.5 2:0.5 r:1 | 6:0.5 5:0.5 2:1 1:2",
    {"plink": "r:4 | r:3.5 6':0.5 | r:3 2'':0.5 6':0.5 | r:4"},
)
STOLPERN_2 = Teil(
    "I II II II | I | I II II II | IV V I I",
    "5:0.5 3:0.5 #4:0.5 #4:0.5 #4:0.5 2:1.5 | r:4 | 5:0.5 3:0.5 #4:0.5 2:2.5 | 6:0.5 5:0.5 2:1 1:2",
    {"plink": "r:2.5 2':0.5 2':0.5 r:0.5 | 1'':1 r:3 | r:4 | r:4"},
)
BERGSTATION = Satz(
    "bergstation",
    "Bergstation",
    TONART,
    120,
    4,
    {"vor": Teil("I | V"), "held": HELD, "s1": STOLPERN_1, "s2": STOLPERN_2},
    ("vor", "held", "s1", "held", "s2", "held", "s1", "held"),
    (
        Stimme("gitarre", "melodie", 0.8, -0.2, 0.25, OBEN, 58, nur("held")),
        Stimme("klavier_trocken", "melodie", 0.8, 0.2, 0.15, OBEN, 60, nur("s1", "s2")),
        Stimme("glockenspiel", "noten", 0.5, 0.35, 0.3, 0, 54, nur("s1", "s2"), "plink"),
        Stimme("ukulele", "schlagen", 0.55, -0.35, 0.2, 0, 44),
        Stimme("kontrabass_pizz", "bass_zweier", 0.65, 0.0, 0.15, 1, 54),
        Stimme("schlagwerk", "schellen", 0.25, 0.3, 0.15, staerke=40),
    ),
    akt=AKT,
    beschreibung="Einfach so: das Thema des Helden, Victors Thema stolpert mit, und es klingt fröhlich.",
)

FINALE_EROEFFNUNG = Satz(
    "finale.eroeffnung",
    "Finale, Eröffnung",
    TONART,
    104,
    4,
    {"vor": Teil("I | V"), "v": VICTOR_DUR, "h": HELD},
    ("vor", "v", "h", "v", "h", "v", "h"),
    (
        Stimme("klavier", "melodie", 0.8, 0.2, 0.3, OBEN, 56, nur("v")),
        Stimme("gitarre", "melodie", 0.8, -0.2, 0.3, OBEN, 58, nur("h")),
        Stimme("gitarre", "zupfen", 0.55, -0.3, 0.3, 0, 40),
        Stimme("kontrabass_pizz", "bass_wechsel", 0.65, 0.0, 0.2, 1, 52),
        Stimme("schlagwerk", "besen", 0.3, 0.25, 0.2, staerke=42),
    ),
    akt=AKT,
    beschreibung="Freundlich: Victors Thema und das Thema des Helden abwechselnd.",
)

# Mittelspiel: Victor am Klavier, der Held antwortet in der Farbe eines Lehrers, Phrase für Phrase.
MITEINANDER = Teil(
    "I II II II | ii ii V V | I II V V | I I V I",
    "5:0.5 3:0.5 #4:0.5 2:2.5 | r:4 | 5:0.5 3:0.5 #4:0.5 2:2.5 | r:4",
    {"held": "r:4 | 2:1 3:1 5:2 | r:2 2:1 3:1 | 5:1 3:1 2:1 1:1"},
)
# Lehrer, Instrument der Heldenstimme und ihre Lage (Klangplan 4A2, `finale.mittelspiel`).
LEHRER = (
    ("delgado", "mundharmonika", 1),
    ("okafor", "klavier", 0),
    ("slick", "trompete_gedaempft", 1),
    ("bigjoe", "orgel", 0),
    ("lin", "glasharfe", 1),
    ("odile", "klarinette", 0),
    ("mira", "egitarre", 0),
    ("ward", "violinen", 2),
)
OHNE_OKAFOR = frozenset(name for name, _, _ in LEHRER if name != "okafor")


def _mittelspiel_stimmen() -> tuple[Stimme, ...]:
    """Victor am Klavier, je Lehrer eine Heldenstimme; bei Mrs. Okafor nur Klavier."""
    farben = tuple(
        Stimme(instrument, "noten", 1.0, -0.2, 0.4, lage, 54, nur(name), "held")
        for name, instrument, lage in LEHRER
    )
    return (
        Stimme("klavier", "melodie", 0.75, 0.2, 0.4, OBEN, 50),
        *farben,
        Stimme("klavier", "wiegen", 0.5, 0.0, 0.4, -1, 34, nur("okafor")),
        Stimme("gitarre", "zupfen", 0.45, -0.35, 0.35, 0, 36, OHNE_OKAFOR),
        Stimme("kontrabass_pizz", "bass_wechsel", 0.55, 0.0, 0.25, 1, 46, OHNE_OKAFOR),
        Stimme("violinen", "halten", 0.25, 0.3, 0.45, 0, 28, OHNE_OKAFOR),
        Stimme("schlagwerk", "klatschen", 0.3, 0.2, 0.3, staerke=40, teile=nur("mira")),
    )


FINALE_MITTELSPIEL = Satz(
    "finale.mittelspiel",
    "Finale, Mittelspiel",
    TONART,
    64,
    4,
    {name: MITEINANDER for name, _, _ in LEHRER},
    tuple(name for name, _, _ in LEHRER),
    _mittelspiel_stimmen(),
    akt=AKT,
    beschreibung="Ruhig, reich: beide Themen miteinander, nacheinander die Farben aller Lehrer.",
)

# Victors Lauf: der Walzerkopf als Galopp, dann die Tonleiter bis zur hohen 1 und eine Kadenz.
GALOPP = Teil(
    "I I II II | IV IV I I | I I V V",
    "5:1 3:0.5 #4:0.5 2:2 | 6:1 4:0.5 5:0.5 3:2 | 5:1 3:0.5 #4:0.5 2:1 r:1",
)
LAUF = Teil("V7", "7,:0.5 1:0.5 2:0.5 3:0.5 4:0.5 5:0.5 6:0.5 7:0.5")
KADENZ = Teil("I | IV V | I | I", "1':4 | 6:2 7:2 | 1':4 | r:4")
VOLL = nur("g2", "lauf", "kadenz")
VICTOR_LAUF = Satz(
    "victor.lauf",
    "Victors Lauf",
    TONART,
    144,
    4,
    {"g1": GALOPP, "g2": GALOPP, "lauf": LAUF, "kadenz": KADENZ},
    ("g1", "g2", "lauf", "kadenz"),
    (
        Stimme("violinen", "melodie", 0.85, 0.2, 0.3, OBEN, 64),
        Stimme("trompete", "melodie", 0.7, -0.15, 0.3, OBEN, 64, VOLL),
        Stimme("floete", "melodie", 0.45, 0.35, 0.3, OBEN + 1, 56, VOLL),
        Stimme("horn", "halten", 0.55, -0.3, 0.3, 0, 54),
        Stimme("posaune", "stoss", 0.55, -0.1, 0.25, -1, 52, VOLL),
        Stimme("tuba", "bass_zweier", 0.65, 0.0, 0.2, 0, 58),
        Stimme("kontrabass", "bass_grund", 0.5, 0.0, 0.25, 1, 50),
        Stimme("schlagwerk", "marsch", 0.45, 0.1, 0.2, staerke=58),
        Stimme("schlagwerk", "triangel", 0.35, 0.35, 0.3, staerke=56, teile=VOLL),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Freude: der Walzerkopf als Galopp, eine Tonleiter bis zur hohen 1, volles Orchester.",
)

STUECKE = (
    VICTOR_WARM,
    ZUG_ZWOELF,
    HALE_VICTOR,
    BERGSTATION,
    FINALE_EROEFFNUNG,
    FINALE_MITTELSPIEL,
    VICTOR_LAUF,
)
