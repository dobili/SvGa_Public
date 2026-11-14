"""Kurzmotive (1 bis 6 Sekunden, einmalig) der Akte: Aha, Konzernton, Hale, Fanfare, Sieg …

Warum: Kurze Klänge markieren Augenblicke (Klangplan A4): jede gelöste Aufgabe (Aha), eine
gewonnene Clubnadel (Fanfare), eine Partie ohne Spott verloren (Niederlage: neigt sich nach Moll
und endet doch auf Dur). Sie laufen nie als Schleife.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil


def kurz(
    kennung: str,
    titel: str,
    tempo: float,
    takt: int,
    teil: Teil,
    stimmen: tuple[Stimme, ...],
    beschreibung: str,
    tonart: str = "G",
    akt: int = 1,
) -> Satz:
    """Ein Kurzmotiv: ein Teil, keine Schleife."""
    return Satz(
        kennung,
        titel,
        tonart,
        tempo,
        takt,
        {"k": teil},
        ("k",),
        stimmen,
        schleife=False,
        akt=akt,
        beschreibung=beschreibung,
    )


AHA = kurz(
    "aha",
    "Aha",
    100,
    3,
    Teil("N.C.", "2:0.25 5:0.5 1':2.25"),
    (Stimme("glockenspiel", "melodie", 0.9, 0.1, 0.45, 1, 70),),
    "Glockenspiel, kurz und hell: 2 – 5 aufwärts, dann ein Hauch der 1.",
)
KONZERN = kurz(
    "konzern",
    "Konzernton",
    60,
    2,
    Teil("N.C.", "#4:1.5 r:0.5"),
    (Stimme("digitalpiano", "melodie", 0.9, 0.0, 0.0, 1, 80),),
    "Trockenes Digitalpiano, ein Ton (die ♯4), ohne Nachhall, abrupt abgedämpft.",
)
HALE = kurz(
    "hale",
    "Hale",
    60,
    3,
    Teil("N.C.", "5,,:3"),
    (
        Stimme("kontrabass", "melodie", 0.9, 0.0, 0.4, 0, 60),
        Stimme("klavier", "melodie", 0.5, 0.0, 0.5, -1, 50),
    ),
    "Ein einzelner tiefer Ton: Kontrabass gestrichen, dazu tiefes Klavier mit Pedal.",
)
FANFARE = kurz(
    "fanfare",
    "Fanfare",
    120,
    4,
    Teil("I | I", "1:0.5 3:0.5 5:0.5 1':2.5 | r:4", {"aha": "r:4 | 2':0.25 5':0.5 1'':3.25"}),
    (
        Stimme("gitarre", "schlagen", 0.7, -0.3, 0.25, 0, 62),
        Stimme("mundharmonika", "melodie", 0.8, 0.2, 0.25, 1, 70),
        Stimme("glockenspiel", "noten", 0.7, 0.3, 0.4, 0, 70, kennung="aha"),
    ),
    "Gitarre, Mundharmonika, Glockenspiel: Dur-Dreiklang aufwärts, endet mit dem Aha.",
)
SIEG = kurz(
    "sieg",
    "Sieg",
    96,
    2,
    Teil("IV | I", "6:1 r:1 | 1':2"),
    (
        Stimme("gitarre", "halten", 0.8, -0.2, 0.3, 0, 60),
        Stimme("glockenspiel", "melodie", 0.6, 0.25, 0.4, 1, 62),
    ),
    "Gitarre und Glockenspiel, zwei Akkorde.",
)
NIEDERLAGE = kurz(
    "niederlage",
    "Niederlage",
    72,
    2,
    Teil("iv | I", linien={"gitarre": "r:2 | r:2"}),
    (Stimme("gitarre", "halten", 0.8, 0.0, 0.35, 0, 50),),
    "Gitarre allein: ein Akkord neigt sich nach Moll und endet doch auf Dur. Kein Spott.",
)
REMIS = kurz(
    "remis",
    "Remis",
    90,
    2,
    Teil("I | I"),
    (Stimme("gitarre", "halten", 0.8, 0.0, 0.3, 0, 50),),
    "Gitarre, zwei gleiche Akkorde.",
)
ANKUNFT = kurz(
    "ankunft",
    "Ankunft",
    96,
    4,
    Teil("I | IV", "1:1 2:1 3:1 5:1 | 6:4"),
    (Stimme("gitarre", "melodie", 0.8, 0.1, 0.35, 1, 58),),
    "Der Kopf des Ortsthemas, solo (Maple Falls: Mamas erste vier Töne).",
)

STUECKE = (AHA, KONZERN, HALE, FANFARE, SIEG, NIEDERLAGE, REMIS, ANKUNFT)
