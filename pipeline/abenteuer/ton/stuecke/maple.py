"""Maple Falls: das Ortsthema und seine Fassungen (Klangplan A2, Akt 1).

Warum: Das Thema beginnt mit Mamas Kopf (1 – 2 – 3 – 5) und steigt zu Ambroses Anfangston; jede
Fassung (Clubraum, Lernen, Clubkampf, Weg, Bus) ist dieselbe Melodie über denselben Akkorden in
anderer Besetzung und anderem Tempo (Klangplan, Grundsatz 2). Tonart G-Dur.

Form des Themas: A (vier Takte, endet offen auf der Dominante), A2 (vier Takte, schließt auf G),
B (acht Takte über e-Moll und C, die Antwort), dann A und A2 offen, damit die Schleife zur Eins
zurückführt.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil

TONART = "G"
# Die Melodie liegt eine Oktave über der kleinen Oktave (G4 = Stufe 1).
MELODIE_OKTAVE = 1

A = Teil("I | IV | vi | V", "1:1 2:1 3:1 5:1 | 6:3 5:1 | 3:2 2:1 3:1 | 2:4")
A2 = Teil("I | IV | ii V | I", "1:1 2:1 3:1 5:1 | 1':3 7:1 | 6:2 5:1 2:1 | 1:4")
A_OFFEN = Teil("I | IV | ii | V", "1:1 2:1 3:1 5:1 | 1':3 7:1 | 6:2 5:1 3:1 | 2:4")
B = Teil(
    "vi | V | IV | vi | ii | V7 | IV | V",
    "6:2 5:1 3:1 | 2:2 3:1 2:1 | 1:1 2:1 3:1 5:1 | 6:3 5:1 | 4:1 3:1 2:1 1:1 | 2:3 r:1 | 3:2 2:1 1:1 | 2:4",
)
VORSPIEL = Teil("I | IV")
# Gegenstimme des Cellos unter A und A2 (zweiter Durchgang): eine lange Linie, fast nur Ganze.
CELLO_A = "3,:4 | 3,:4 | 5,,:2 1,:2 | 7,,:4"
CELLO_A2 = "3,:4 | 1,:4 | 1,:2 7,,:2 | 1,:4"


def _teile() -> dict[str, Teil]:
    """Die Teile mit Cello-Linien; a1/a2 ohne, a3/a4 mit Cello (ab dem zweiten Durchgang)."""
    cello = {"cello": CELLO_A}
    return {
        "vor": VORSPIEL,
        "a1": A,
        "a2": A2,
        "a3": Teil(A.akkorde, A.melodie, cello),
        "a4": Teil(A2.akkorde, A2.melodie, {"cello": CELLO_A2}),
        "b": B,
        "a5": A,
        "a6": Teil(A_OFFEN.akkorde, A_OFFEN.melodie, {"cello": CELLO_A}),
    }


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


MAPLE_FALLS = Satz(
    "mapleFalls",
    "Maple Falls",
    TONART,
    76,
    4,
    _teile(),
    ("vor", "a1", "a2", "a3", "a4", "b", "a5", "a6"),
    (
        Stimme("gitarre", "zupfen", 0.9, -0.3, 0.25, staerke=48),
        Stimme(
            "klavier", "melodie", 0.75, 0.2, 0.3, MELODIE_OKTAVE, 52, nur("a1", "a2", "a3", "a4", "a5", "a6")
        ),
        Stimme("cello", "melodie", 0.6, 0.1, 0.3, 0, 55, nur("b")),
        Stimme("cello", "noten", 0.45, 0.1, 0.3, 1, 45, nur("a3", "a4", "a6"), "cello"),
        Stimme("klavier", "tupfen", 0.35, 0.25, 0.3, -1, 36, nur("b")),
    ),
    beschreibung="Warm, tastend, Spätsommer: Gitarre zupft, Klavier singt, ab dem zweiten Durchgang Cello.",
)

MAPLE_FALLS_CLUB = Satz(
    "mapleFalls.club",
    "Maple Falls, Clubraum",
    TONART,
    104,
    4,
    _teile(),
    ("vor", "a1", "a2", "b", "a5", "a6"),
    (
        Stimme("gitarre", "schlagen", 0.7, -0.35, 0.2, staerke=50),
        Stimme("klavier", "melodie", 0.7, 0.2, 0.25, MELODIE_OKTAVE, 58, nur("a1", "a2", "a6")),
        Stimme("mundharmonika", "melodie", 0.55, 0.25, 0.25, MELODIE_OKTAVE, 60, nur("b", "a5")),
        Stimme("kontrabass_pizz", "bass_wechsel", 0.7, 0.0, 0.15, 1, 62),
        Stimme("schlagwerk", "klatschen", 0.35, 0.3, 0.2, staerke=50),
    ),
    beschreibung="Munter, aufgenommen: Gitarre schlägt, Klavier und Mundharmonika teilen sich die Melodie.",
)

MAPLE_FALLS_LERNEN = Satz(
    "mapleFalls.lernen",
    "Maple Falls, Lernen",
    TONART,
    92,
    4,
    _teile(),
    ("vor", "a1", "a2", "b"),
    (
        Stimme("gitarre", "travis", 0.75, -0.3, 0.2, staerke=46),
        Stimme("glockenspiel", "melodie", 0.45, 0.3, 0.35, MELODIE_OKTAVE, 50, nur("a1", "a2")),
        Stimme("klavier", "melodie", 0.6, 0.2, 0.3, MELODIE_OKTAVE, 50, nur("b")),
        Stimme("klavier", "tupfen", 0.3, 0.15, 0.3, 0, 34, nur("a1", "a2")),
    ),
    beschreibung="Lernen als Spiel: Gitarre im Wechselbass, Glockenspiel tupft die Melodie.",
)

# Clubkampf: dieselbe Melodie in Bruchstücken über e-Moll, gespannter Puls, nicht bedrohlich.
KAMPF = Teil(
    "vi | IV | I | V | vi | IV | ii | V",
    "6,:2 r:2 | 1:1 2:1 3:2 | r:4 | 2:2 5,:2 | 6,:2 r:2 | 1:1 2:1 3:1 5:1 | 6:3 5:1 | 2:4",
)
KAMPF_RUHE = Teil("vi | IV | vi | V")

MAPLE_FALLS_CLUBKAMPF = Satz(
    "mapleFalls.clubkampf",
    "Maple Falls, Clubkampf",
    TONART,
    84,
    4,
    {"k1": KAMPF, "ruhe": KAMPF_RUHE, "k2": KAMPF},
    ("k1", "ruhe", "k2", "ruhe", "k1"),
    (
        Stimme("gitarre", "zupfen", 0.55, -0.3, 0.15, -1, 40),
        Stimme("kontrabass_pizz", "bass_laufend", 0.75, 0.0, 0.15, 1, 58),
        Stimme("schlagwerk", "besen", 0.35, 0.2, 0.15, staerke=46),
        Stimme("cello", "halten", 0.35, 0.15, 0.3, -1, 40),
        Stimme("klavier", "melodie", 0.6, 0.2, 0.25, MELODIE_OKTAVE, 50, nur("k1", "k2")),
    ),
    beschreibung="Herzklopfen, nicht bedrohlich: gedämpfte Gitarre, gezupfter Bass, Besen, Cello liegt.",
)

BUSFAHRT = Satz(
    "busfahrt",
    "Busfahrt nach Maple Falls",
    TONART,
    76,
    4,
    _teile(),
    ("vor", "a1", "a2", "b", "a5", "a6"),
    (
        Stimme("gitarre", "zupfen", 0.8, -0.1, 0.3, staerke=44),
        Stimme("gitarre", "melodie", 0.7, 0.15, 0.3, MELODIE_OKTAVE, 54, nur("a1", "a2", "b", "a5", "a6")),
    ),
    beschreibung="Müde, glücklich: das Thema von Maple Falls kehrt leise zurück, nur Gitarre.",
)

STUECKE = (MAPLE_FALLS, MAPLE_FALLS_CLUB, MAPLE_FALLS_LERNEN, MAPLE_FALLS_CLUBKAMPF, BUSFAHRT)
