"""Riverton: das Stadtthema in c-Moll und seine Fassungen, dazu die Fanfare (Klangplan 2A1, 2A3).

Warum: Riverton ist laut, nass und lebendig (Klangplan, Akt 2): ein Swing in Moll mit gedämpfter
Trompete, gezupftem Kontrabass und Besen; das Klopfen der Schachuhren ist Teil des Rhythmus (hier
der Holzblock des Rhythmus ``uhr``). Alle Fassungen (Pavillon, Pops' Erzählung, Schuppen, Clubkampf,
Wohnwagen) spielen dieselben Teile in anderer Besetzung und anderem Tempo (Grundsatz 2).

Form des Themas: A (acht Takte, endet offen auf der Dominante), A2 (schließt auf c), B (die Brücke
über Es-Dur und As-Dur, endet auf G7), davor zwei Takte Vorspiel. Die Melodie steigt zuerst durch
den Moll-Dreiklang (5 – 1 – 3 – 5) und fällt zurück; B antwortet mit langen Tönen.

Ersatz: Die Klavierbegleitung (leise getupft) ist dazugenommen, damit die Harmonie hörbar bleibt;
der Klangplan nennt nur Trompete, Kontrabass und Besen. Der Regen auf Blech im Clubkampf ist ein
Geräusch (2B1) und steht nicht in den Noten.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.kurz import kurz

TONART = "c"
OBEN = 1
AKT = 2
SWING = 1 / 6
LEICHTER_SWING = 1 / 8

A = Teil(
    "i | i | iv | iv | V7 | V7 | i | V7",
    "r:0.5 5,:0.5 1:0.5 3:0.5 5:1 3:0.5 1:0.5 | 2:0.5 3:0.5 2:0.5 1:0.5 5,:2 | "
    "r:0.5 6,:0.5 1:0.5 4:0.5 6:1 4:0.5 1:0.5 | 3:0.5 4:0.5 3:0.5 2:0.5 1:2 | "
    "#7,:0.5 2:0.5 4:0.5 5:0.5 #7:1 5:0.5 4:0.5 | 2':1.5 #7:0.5 5:1 4:1 | 3:1 2:0.5 1:0.5 5,:2 | 2:2 r:2",
)
A2 = Teil(
    "i | i | iv | iv | V7 | V7 | i | i",
    "r:0.5 5,:0.5 1:0.5 3:0.5 5:1 3:0.5 1:0.5 | 2:0.5 3:0.5 2:0.5 1:0.5 5,:2 | "
    "r:0.5 6,:0.5 1:0.5 4:0.5 6:1 4:0.5 1:0.5 | 3:0.5 4:0.5 3:0.5 2:0.5 1:2 | "
    "#7,:0.5 2:0.5 4:0.5 5:0.5 #7:1 5:0.5 4:0.5 | 2':1.5 #7:0.5 5:1 4:1 | 1':1.5 5:0.5 3:1 2:1 | 1:2 r:2",
)
B = Teil(
    "III | VI | iiø | V7 | III | VI | iv | V7",
    "5:1.5 3:0.5 5:2 | 6:1.5 1':0.5 6:1 3:1 | 4:1 6:1 1':1 6:0.5 4:0.5 | 5:1 #7:1 2':2 | "
    "5:1 7:1 3':2 | 1':1.5 7:0.5 6:2 | 6:1 4:1 1:1 4:1 | 2:1.5 #7,:0.5 5,:2",
)
VOR = Teil("i | V7")
TEILE = {"vor": VOR, "a": A, "a2": A2, "b": B}
# Die Schleife: Vorspiel, A, A2, Brücke, noch einmal A und A2; A2 schließt, das Vorspiel öffnet wieder.
FORM = ("vor", "a", "a2", "b", "a", "a2")
# Kurze Form der leisen Fassungen: gleich mit der Melodie, ohne zweiten Durchgang.
FORM_KURZ = ("a", "b", "a2")
MIT_MELODIE = frozenset(("a", "a2", "b"))


def _band(melodie: str, staerke: int) -> tuple[Stimme, ...]:
    """Die Band von Riverton: Melodie vorn, laufender Bass, getupftes Klavier, Besen, Uhrenklopfen."""
    return (
        Stimme(melodie, "melodie", 0.85, 0.15, 0.25, OBEN, staerke, MIT_MELODIE),
        Stimme("kontrabass_pizz", "bass_laufend", 0.8, 0.0, 0.15, 1, 62),
        Stimme("klavier", "tupfen", 0.3, -0.25, 0.25, 0, 38),
        Stimme("schlagwerk", "besen", 0.45, 0.25, 0.15, staerke=52),
    )


RIVERTON = Satz(
    "riverton",
    "Riverton",
    TONART,
    132,
    4,
    TEILE,
    FORM,
    (*_band("trompete_gedaempft", 64), Stimme("schlagwerk", "uhr", 0.45, -0.35, 0.15, staerke=72)),
    swing=SWING,
    akt=AKT,
    beschreibung="Laut, nass, lebendig: Swing in Moll, gedämpfte Trompete, Bass, Besen, Uhrenklopfen.",
)

RIVERTON_PAVILLON = Satz(
    "riverton.pavillon",
    "Riverton, Pavillon",
    TONART,
    152,
    4,
    TEILE,
    FORM,
    (*_band("trompete_gedaempft", 66), Stimme("schlagwerk", "uhr", 0.7, -0.35, 0.1, staerke=92)),
    swing=SWING,
    akt=AKT,
    beschreibung="Blitz, Freude: das Stadtthema schneller, das Klopfen der Schachuhren ist der Schlag.",
)

RIVERTON_POPS = Satz(
    "riverton.pops",
    "Riverton, Pops erzählt",
    TONART,
    80,
    4,
    TEILE,
    FORM_KURZ,
    (
        Stimme("kontrabass_pizz", "melodie", 0.9, 0.05, 0.3, 0, 62),
        Stimme("kontrabass_pizz", "bass_grund", 0.5, -0.05, 0.3, 0, 44),
    ),
    swing=LEICHTER_SWING,
    akt=AKT,
    beschreibung="Erinnerung, Respekt: das Stadtthema langsam, nur auf dem gezupften Kontrabass.",
)

RIVERTON_GITARRE = Satz(
    "riverton.gitarre",
    "Riverton, Schuppen",
    TONART,
    84,
    4,
    TEILE,
    ("vor", *FORM_KURZ),
    (
        Stimme("gitarre", "melodie", 0.8, 0.15, 0.3, OBEN, 56, MIT_MELODIE),
        Stimme("gitarre", "zupfen", 0.6, -0.2, 0.3, 0, 40),
    ),
    swing=LEICHTER_SWING,
    akt=AKT,
    beschreibung="Ruhig, Morgen: das Stadtthema langsam auf einer einzelnen Gitarre.",
)

RIVERTON_CLUBKAMPF = Satz(
    "riverton.clubkampf",
    "Riverton, Clubkampf",
    TONART,
    160,
    4,
    TEILE,
    FORM,
    (*_band("trompete", 70), Stimme("schlagwerk", "uhr", 0.6, -0.35, 0.1, staerke=88)),
    swing=SWING,
    akt=AKT,
    beschreibung="Schnell, frech: das Stadtthema mit offener Trompete vorn, Uhrenschläge, Besen.",
)

RIVERTON_WOHNWAGEN = Satz(
    "riverton.wohnwagen",
    "Riverton, Wohnwagen",
    TONART,
    66,
    4,
    TEILE,
    FORM_KURZ,
    (Stimme("mundharmonika", "melodie", 0.85, 0.0, 0.4, OBEN, 54),),
    swing=LEICHTER_SWING,
    akt=AKT,
    beschreibung="Leise, Verlust: das Stadtthema langsam auf einer einzelnen Mundharmonika.",
)

# Fanfare in Riverton: der Dur-Dreiklang über C6, gedämpfte Trompete, endet mit dem Aha.
FANFARE_RIVERTON = kurz(
    "fanfare.riverton",
    "Fanfare, Riverton",
    120,
    4,
    Teil("I6 | I6", "1:0.5 3:0.5 5:0.5 1':2.5 | r:4", {"aha": "r:4 | 2':0.25 5':0.5 1'':3.25"}),
    (
        Stimme("trompete_gedaempft", "melodie", 0.85, 0.15, 0.25, OBEN, 72),
        Stimme("klavier", "stoss", 0.5, -0.25, 0.25, 0, 54),
        Stimme("kontrabass_pizz", "bass_grund", 0.7, 0.0, 0.15, 1, 62),
        Stimme("glockenspiel", "noten", 0.6, 0.3, 0.4, OBEN, 70, kennung="aha"),
    ),
    "Gedämpfte Trompete, Klavier, Bass, Glockenspiel: Dur-Dreiklang aufwärts, endet mit dem Aha.",
    tonart="C",
    akt=AKT,
)

STUECKE = (
    RIVERTON,
    RIVERTON_PAVILLON,
    RIVERTON_POPS,
    RIVERTON_GITARRE,
    RIVERTON_CLUBKAMPF,
    RIVERTON_WOHNWAGEN,
    FANFARE_RIVERTON,
)
