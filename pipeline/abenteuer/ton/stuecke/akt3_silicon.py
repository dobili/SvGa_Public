"""Akt 3, Silicon Bay: Busfahrt, Ortsthema mit Akademie und Clubkampf, Rosies Wagen, ZERO, Spannung.

Warum: Silicon Bay ist schön und ohne Atem (Klangplan 3A1). Das Thema steht in G-lydisch: Die ♯4
(Cis) ist der Konzernton und zugleich der fremde Ton in Ambroses Kopf (A1, „Der fremde Ton ist der
Konzernton“); in der Melodie ist sie der höchste Ton, und eine Fläche hält sie darüber. Die Melodie
hat keine Pause, die Phrasen gehen ineinander über. ZERO ist dieselbe Leiter als gleichmäßige
Sechzehntel, die um die ♯4 kreisen und nie ankommen (A1, „ZERO“); die Linie steht hier, weil
``ambrose.gebannt`` und ``ambrose.verzerrt`` (``akt3_ambrose.py``) sie mitspielen.

Ersatz (die freien Bibliotheken haben keinen Synthesizer und keine Celesta): Synthesizerflächen
spielt die Zugriegelorgel (``hammond``, liegend), die gefilterten Achtel das Digitalpiano leise im
Muster ``zupfen``, die Lead-Stimme das Vibraphon; ZERO spielen Vibraphon (für die Celesta) und
Glasharfe eine Oktave höher. Rosies Wagen ist bewusst akustisch (Gitarre, Klatschen); Dashs Stimme
als Rhythmus und die Bratgeräusche sind Geräusche (Teil B), nicht Musik. Das Stocken der Figur im
Clubkampf nach dem seltsamen Bauernzug ist eine Sache der Partie, nicht der Schleife.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.maple import teile as maple_teile

TONART = "G"
OBEN = 1
AKT = 3
SECHZEHNTEL = "1/4"


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


def sechzehntel(zellen: str) -> str:
    """Stufen als gleichmäßige Sechzehntel. Beispiel: „3 #4 | 5“ ergibt „3:1/4 #4:1/4 5:1/4“.

    Warum: ZERO und die Klavierfigur im Clubkampf bestehen nur aus Sechzehnteln; so bleibt die Zeile
    lesbar. ``|`` darf zur Übersicht stehen.
    """
    return " ".join(f"{stufe}:{SECHZEHNTEL}" for stufe in zellen.replace("|", " ").split())


# --- ZERO (Klangplan A1): G-lydisch, um die ♯4 kreisend, auf und ab, ohne anzukommen ---
ZERO_1 = sechzehntel(
    "3 #4 5 #4 | 2 3 #4 5 | 6 5 #4 3 | #4 5 6 7 | 1' 7 6 5 | 6 5 #4 3 | #4 5 #4 3 | 2 3 #4 3"
)
ZERO_2 = sechzehntel("#4 5 6 7 | 1' 7 6 5 | 6 5 #4 3 | 2 3 #4 5 | #4 5 #4 3 | #4 6 5 7 | 6 5 #4 3 | 2 3 #4 5")
ZERO_3 = sechzehntel(
    "3 #4 5 #4 | 3 2 3 #4 | 5 6 5 #4 | 3 #4 5 6 | 7 6 #4 5 | 6 #4 3 #4 | 5 #4 3 2 | 3 #4 5 #4"
)
ZERO_4 = sechzehntel("7 1' 7 6 | 5 #4 5 7 | 6 5 #4 5 | 6 7 6 5 | #4 3 #4 5 | 6 5 #4 3 | 2 3 #4 5 | 6 5 #4 3")
ZERO_HELL = "Imaj7 | II"
ZERO_DUNKEL = "vi | II | iii | II"
ZERO_A = Teil(f"{ZERO_HELL} | {ZERO_HELL}", f"{ZERO_1} | {ZERO_2}")
ZERO_B = Teil(ZERO_DUNKEL, f"{ZERO_3} | {ZERO_4}")


def zero_stimmen(staerke: int, teile: frozenset[str] | None = None) -> tuple[Stimme, ...]:
    """ZERO als eigene Linie ``zero``: Vibraphon (Celesta) und Glasharfe eine Oktave höher."""
    return (
        Stimme("vibraphon", "noten", 0.7, 0.2, 0.4, OBEN, staerke, teile, "zero"),
        Stimme("glasharfe", "noten", 0.5, -0.2, 0.45, OBEN + 1, staerke - 10, teile, "zero"),
    )


ZERO = Satz(
    "zero",
    "ZERO",
    TONART,
    96,
    4,
    {"z1": ZERO_A, "z2": ZERO_B},
    ("z1", "z1", "z2", "z1", "z2", "z1"),
    (
        Stimme("vibraphon", "melodie", 0.75, 0.2, 0.4, OBEN, 52),
        Stimme("glasharfe", "melodie", 0.5, -0.2, 0.45, OBEN + 1, 42),
        Stimme("hammond", "halten", 0.4, 0.0, 0.5, 0, 34),
    ),
    akt=AKT,
    beschreibung="Vollkommen, schön, leer: perlende Sechzehntel um die ♯4 über einer Fläche.",
)

# --- Ortsthema Silicon Bay: lydisch, die ♯4 ist der höchste Ton, keine Pause in der Melodie ---
SILICON_A = Teil(
    "Imaj7 | II | Imaj7 | II | vi | II | iii | II",
    "3:2 1:2 | #4:3 3:1 | 1:2 7,:1 5,:1 | 6,:2 2:2 | 6,:1 1:1 3:2 | #4:3 2:1 | 3:2 7,:2 | 6,:1 2:1 #4:2",
)
SILICON_B = Teil(
    "vi | iii | II | Imaj7 | vi | iii | II | II",
    "1:2 3:2 | 3:2 5,:2 | #4:4 | 3:2 7,:2 | 6,:2 1:2 | 7,:2 3:2 | #4:2 6,:2 | 2:3 #4:1",
)
# Die Fläche hält die ♯4 zwei Oktaven über der Mitte (Klangplan 3A1: „die ♯4 liegt oben“).
OBEN_LIEGEND = "#4':4 | #4':4 | #4':4 | #4':4 | #4':4 | #4':4 | #4':4 | #4':4"
SILICON_VOR = Teil("Imaj7 | II", linien={"oben": "#4':4 | #4':4"})


def silicon_teile() -> dict[str, Teil]:
    """Die Teile von Silicon Bay; jeder Teil trägt die liegende ♯4 als Linie ``oben``."""
    oben = {"oben": OBEN_LIEGEND}
    return {
        "vor": SILICON_VOR,
        "a": Teil(SILICON_A.akkorde, SILICON_A.melodie, oben),
        "b": Teil(SILICON_B.akkorde, SILICON_B.melodie, oben),
    }


SILICON_FORM = ("vor", "a", "b", "a", "b", "a", "b")
MELODIE_TEILE = nur("a", "b")


def _silicon(kennung: str, titel: str, hall: float, pegel: float, beschreibung: str) -> Satz:
    """Silicon Bay: Lead auf dem Vibraphon, Fläche, gefilterte Achtel, oben die ♯4."""
    return Satz(
        kennung,
        titel,
        TONART,
        96,
        4,
        silicon_teile(),
        SILICON_FORM,
        (
            Stimme("vibraphon", "melodie", 0.75, 0.15, hall, OBEN, 54, MELODIE_TEILE),
            Stimme("hammond", "halten", 0.7, -0.15, hall, 0, 36),
            Stimme("hammond", "noten", 0.25, 0.3, hall, OBEN, 30, kennung="oben"),
            Stimme("digitalpiano", "zupfen", 0.65, -0.3, hall, 0, 32),
        ),
        akt=AKT,
        pegel_db=pegel,
        beschreibung=beschreibung,
    )


SILICON_BAY = _silicon(
    "siliconBay",
    "Silicon Bay",
    0.35,
    0.0,
    "Schön, ohne Atem: lydische Flächen, die ♯4 liegt oben, gleichmäßige gefilterte Achtel.",
)
SILICON_BAY_AKADEMIE = _silicon(
    "siliconBay.akademie",
    "Silicon Bay, Akademie",
    0.7,
    -10.0,
    "Raumklang: das Thema von Silicon Bay 10 dB leiser, wie aus der Decke, mit viel Hall.",
)

# Clubkampf gegen Dr. Lin: das Thema über sauberen Arpeggien in Sechzehnteln (je Akkord eine Zelle).
FIGUREN = {
    "Imaj7": "1 3 5 7 1' 7 5 3",
    "II": "2 #4 6 2' #4' 2' 6 #4",
    "vi": "6, 1 3 6 1' 6 3 1",
    "iii": "3 5 7 3' 5' 3' 7 5",
}


def figur(akkorde: str) -> str:
    """Die Klavierfigur zu einer Akkordfolge: je Takt zweimal die Zelle des Akkords (16 Sechzehntel)."""
    return " | ".join(sechzehntel(f"{FIGUREN[a.strip()]} {FIGUREN[a.strip()]}") for a in akkorde.split("|"))


def _kampf_teile() -> dict[str, Teil]:
    """Die Teile des Clubkampfs: Thema, darunter die Figur als Linie ``figur``."""
    return {
        name: Teil(teil.akkorde, teil.melodie, {"figur": figur(teil.akkorde)})
        for name, teil in {"vor": SILICON_VOR, "a": SILICON_A, "b": SILICON_B}.items()
    }


SILICON_BAY_CLUBKAMPF = Satz(
    "siliconBay.clubkampf",
    "Silicon Bay, Clubkampf",
    TONART,
    108,
    4,
    _kampf_teile(),
    ("vor", "a", "b", "vor", "a", "b"),
    (
        Stimme("klavier", "melodie", 0.7, 0.15, 0.25, OBEN, 54, MELODIE_TEILE),
        Stimme("klavier", "noten", 0.5, -0.15, 0.25, 0, 40, kennung="figur"),
        Stimme("hammond", "halten", 0.6, 0.0, 0.4, 0, 32),
    ),
    akt=AKT,
    beschreibung="Klar, geordnet: das Thema als saubere Klavierfigur in Sechzehnteln über der Fläche.",
)

# --- Busfahrt nach Silicon Bay: das Wegthema ohne Verzierung, gleichmäßige Achtel ---
WEG_BUS = Satz(
    "weg.bus",
    "Busfahrt nach Silicon Bay",
    TONART,
    100,
    4,
    maple_teile(),
    ("vor", "a1", "a2", "b", "a1", "a2", "b", "a6"),
    (
        Stimme("gitarre", "zupfen", 0.8, -0.25, 0.2, 0, 44),
        Stimme("gitarre", "melodie", 0.65, 0.2, 0.2, OBEN, 50, nur("a1", "a2", "b", "a6")),
        Stimme("ebass", "bass_wechsel", 0.6, 0.0, 0.1, 1, 50),
    ),
    akt=AKT,
    beschreibung="Flach, gleichmäßig: das Wegthema ohne Verzierung, Gitarre in geraden Achteln und Bass.",
)

# --- Rosies Food-Truck: warm, laut, lebendig, eigenes Thema in D-Dur ---
ROSIE_A = Teil(
    "I | IV | I | V | I | IV | V | I",
    "1:0.5 3:0.5 5:1.5 6:0.5 5:1 | 4:1 6:1 1':1.5 6:0.5 | 5:1.5 3:0.5 1:1 3:1 | 2:2 r:1 5,:1 | "
    "1:0.5 3:0.5 5:1.5 6:0.5 5:1 | 4:1 6:1 1':1 2':1 | 7:1.5 6:0.5 5:1 7,:1 | 1:3 r:1",
)
ROSIE_B = Teil(
    "vi | IV | I | V | vi | IV | ii | V",
    "6:1 6:0.5 5:0.5 6:1 1':1 | 1':1.5 6:0.5 4:2 | 3:1 5:1 1':2 | 7:1 6:1 5:2 | "
    "6:1.5 5:0.5 3:1 2:1 | 4:1 6:1 4:1 2:1 | 2:1 4:1 6:2 | 5:2 r:2",
)
ROSIE = Satz(
    "rosie",
    "Rosies Wagen",
    "D",
    112,
    4,
    {"vor": Teil("I | IV"), "a": ROSIE_A, "b": ROSIE_B, "ende": Teil("I | IV | V | V")},
    ("vor", "a", "b", "a", "ende"),
    (
        Stimme("gitarre", "schlagen", 0.7, -0.3, 0.2, 0, 50),
        Stimme("egitarre", "melodie", 0.75, 0.25, 0.2, OBEN, 60, nur("a", "b")),
        Stimme("ebass", "bass_wechsel", 0.65, 0.0, 0.1, 1, 56),
        Stimme("schlagwerk", "klatschen", 0.4, 0.3, 0.2, staerke=54),
    ),
    akt=AKT,
    beschreibung="Warm, laut, lebendig: Gitarre schlägt, E-Gitarre singt, Bass und Händeklatschen.",
)

# --- Auswertung (Kap. 33): ein tiefer, gehaltener Ton, dazu Tippen auf Glas ---
GLAS = (
    "r:1.5 #4':0.25 r:2.25 | r:4 | r:3 5':0.25 r:0.75 | r:0.5 #4':0.25 r:3.25 | "
    "r:4 | r:2 3':0.25 #4':0.25 r:1.5 | r:4 | r:3.5 #4':0.25 r:0.25"
)
SPANNUNG = Satz(
    "spannung",
    "Spannung",
    TONART,
    60,
    4,
    {
        "s": Teil(
            "N.C. | N.C. | N.C. | N.C. | N.C. | N.C. | N.C. | N.C.",
            "1,,:8 | 1,,:8 | 1,,:8 | 1,,:8",
            {"glas": GLAS},
        )
    },
    ("s",),
    (
        Stimme("kontrabass", "melodie", 0.85, 0.0, 0.35, 0, 52),
        Stimme("glasharfe", "noten", 0.35, 0.35, 0.4, OBEN, 36, kennung="glas"),
    ),
    akt=AKT,
    beschreibung="Unbehagen: ein tiefer gestrichener Kontrabass, darüber vereinzeltes Tippen auf Glas.",
)

STUECKE = (WEG_BUS, SILICON_BAY, SILICON_BAY_AKADEMIE, SILICON_BAY_CLUBKAMPF, ROSIE, ZERO, SPANNUNG)
