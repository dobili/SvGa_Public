"""Kurzmotive von Akt 4: leise Fanfare, Held rückwärts, Kerzenton, Scherzo, Aufgabe, Fehler, Schluss.

Warum: Kurze Klänge markieren Augenblicke (Klangplan 4A2 und 4A3). Die Fanfare kommt in Summit City
erst spät und leise und wächst mit dem Klatschen; beim Räuberschach springt das Thema des Helden
rückwärts (5 – 3 – 2); Victor gibt mit einem einzelnen Ton auf (die 1); der Fehler im Finale ist
die ♭2; der letzte Klang des Spiels setzt das Aha über die vier fragenden Töne vom Dachboden, eine
Oktave tiefer, offen auf der 2 (A1, „Schlussklang“).

Sonderfall: `hale.springer` erklingt in Kapitel 61 nur als ein Hornton (die 5, 3 s). Der Klangplan
nennt dafür keine eigene Kennung; diese Datei setzt die Fassung aus Kapitel 58 (das ganze Motiv).
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.akt4_themen import HALE, KOPF_DACHBODEN, OBEN, TONART, nur
from pipeline.abenteuer.ton.stuecke.kurz import kurz

AKT = 4

# Fanfare (wie in Akt 1: Dur-Dreiklang aufwärts, dann das Aha), erst leise, beim zweiten Mal mit
# Klatschen und lauter.
FANFARE_MELODIE = "1:0.5 3:0.5 5:0.5 1':2.5 | r:4"
FANFARE_LEISE = Satz(
    "fanfare.leise",
    "Fanfare, leise",
    TONART,
    120,
    4,
    {
        "leise": Teil("I | I", FANFARE_MELODIE),
        "laut": Teil("I | I", ">1:0.5 3:0.5 5:0.5 >1':2.5 | r:4", {"aha": "r:4 | 2':0.25 5':0.5 1'':3.25"}),
    },
    ("leise", "laut"),
    (
        Stimme("gitarre", "schlagen", 0.45, -0.3, 0.3, 0, 40, nur("leise")),
        Stimme("gitarre", "schlagen", 0.75, -0.3, 0.3, 0, 58, nur("laut")),
        Stimme("mundharmonika", "melodie", 0.55, 0.2, 0.3, OBEN, 50, nur("leise")),
        Stimme("mundharmonika", "melodie", 0.85, 0.2, 0.3, OBEN, 66, nur("laut")),
        Stimme("glockenspiel", "noten", 0.6, 0.3, 0.4, 0, 62, nur("laut"), "aha"),
        Stimme("schlagwerk", "klatschen", 0.45, 0.1, 0.3, staerke=56, teile=nur("laut")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Spät, wachsend: die Fanfare leise, beim zweiten Mal mit Klatschen.",
)

HELD_RUECKWAERTS = kurz(
    "held.rueckwaerts",
    "Held, rückwärts",
    132,
    4,
    Teil("I V V V | I", "5:0.5 3:0.5 2:1 5:0.5 3:0.5 2:1 | 1:1 r:3"),
    (
        Stimme("gitarre", "melodie", 0.85, 0.15, 0.25, OBEN, 64),
        Stimme("gitarre", "stoss", 0.6, -0.2, 0.25, 0, 50),
    ),
    "Spaß: das Thema des Helden rückwärts (5 – 3 – 2), schnell, auf Ezras Gitarre.",
    akt=AKT,
)

KERZENTON = kurz(
    "kerzenton",
    "Kerzenton",
    60,
    4,
    Teil("N.C.", "1:4"),
    (
        Stimme("cello", "melodie", 0.8, -0.1, 0.5, 0, 50),
        Stimme("horn", "melodie", 0.6, 0.1, 0.5, 0, 44),
    ),
    "Warm: ein einzelner Ton (die 1), Cello und Horn, wenn das Mondlicht Kerzenlicht wird.",
    akt=AKT,
)

AMBROSE_SCHERZO = kurz(
    "ambrose.scherzo",
    "Ambrose, Scherzo",
    144,
    4,
    Teil("I ii | V I", "5:0.5 r:0.5 3:0.5 r:0.5 4:0.5 r:0.5 2:0.5 r:0.5 | r:2 1':0.5 r:1.5"),
    (
        Stimme("violinen_pizz", "melodie", 0.85, -0.1, 0.3, OBEN, 64),
        Stimme("glockenspiel", "melodie", 0.6, 0.3, 0.35, OBEN, 58),
        Stimme("kontrabass_pizz", "bass_grund", 0.6, 0.0, 0.2, 1, 54),
    ),
    "Heiter: Ambroses reiner Kopf als Scherzo, vier Töne, Pizzicato und Glockenspiel.",
    akt=AKT,
)

AUFGABE = kurz(
    "aufgabe",
    "Aufgabe",
    60,
    3,
    Teil("N.C.", "1:3"),
    (Stimme("klavier", "melodie", 0.85, 0.0, 0.5, 0, 50),),
    "Victor gibt auf: ein einzelner Ton, die 1, Klavier.",
    akt=AKT,
)

FEHLER = kurz(
    "fehler",
    "Fehler",
    60,
    2,
    Teil("N.C.", "b2:1 r:1"),
    (Stimme("klavier", "melodie", 0.85, 0.0, 0.35, OBEN, 56),),
    "Ein einzelner falscher Ton im Finale: die ♭2 auf dem Klavier.",
    akt=AKT,
)

HALE_SPRINGER = kurz(
    "hale.springer",
    "Hale, Springerzug",
    60,
    4,
    Teil("N.C. | N.C.", f"{HALE} | 2:4"),
    (Stimme("horn", "melodie", 0.85, 0.0, 0.45, 0, 56),),
    "Ein Mensch findet es: Hales Motiv einmal auf dem Horn.",
    akt=AKT,
)

SCHLUSSKLANG = kurz(
    "schlussklang",
    "Schlussklang",
    66,
    4,
    Teil("N.C. | N.C.", linien={"frage": KOPF_DACHBODEN, "aha": "r:4 | 2:0.25 5:0.5 1':3.25"}),
    (
        Stimme("klavier_alt", "noten", 0.75, -0.1, 0.5, 0, 42, kennung="frage"),
        Stimme("glockenspiel", "noten", 0.6, 0.15, 0.5, OBEN, 46, kennung="aha"),
    ),
    "Anfang: das Aha auf dem Glockenspiel über den vier fragenden Tönen vom Dachboden, offen auf der 2.",
    akt=AKT,
)

STUECKE = (
    FANFARE_LEISE,
    HELD_RUECKWAERTS,
    KERZENTON,
    AMBROSE_SCHERZO,
    AUFGABE,
    FEHLER,
    HALE_SPRINGER,
    SCHLUSSKLANG,
)
