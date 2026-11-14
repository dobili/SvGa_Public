"""Akt 3, Ambrose von Silicon Bay bis Port Delacroix: gebannt, einstimmig, fern, verzerrt, Ende,
verstimmt, Stimmton und vierhändig (Klangplan 3A2).

Warum: Akt 3 ist der Akt von Ambrose. Seine Musik wird erst gebannt (ZERO), fehlt dann ganz und
kehrt verstimmt zurück (Klangplan, Akt 3, Teil A). Alle Stücke benutzen genau seinen Kopf aus
``ambrose1.py`` (5 – 3 – ♯4 – 2 mit Vorschlag vor der ♯4) und seine Antwort; die vollständigen
Fassungen enden mit dem Trugschluss auf vi (A1, „Ambrose, vollständig“). ``ambrose.gebannt`` und
``ambrose.verzerrt`` stehen im Tempo von ``zero`` und legen dessen Linie darunter.

Ersatz: Das verstimmte Klavier ist das Kneipenklavier (Honky-Tonk, zwei leicht verstimmte Saiten
je Ton); „rein gestimmt“ heißt, dass die Melodie auf das gestimmte Klavier wechselt. Der Stimmton
kann nicht stufenlos schweben (die Noten haben ganze Halbtöne); das Schweben ist das
Kneipenklavier, der reine Ton das gestimmte Klavier. „Weit weg, Tiefpass“ (``ambrose.fern``) ist
das Klangbild „lautsprecher“ (Bandpass) mit viel Hall und leiserem Pegel.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.akt3_silicon import ZERO_1, ZERO_2, ZERO_A, ZERO_HELL, zero_stimmen
from pipeline.abenteuer.ton.stuecke.ambrose1 import FRAGE, KOPF, VOLL
from pipeline.abenteuer.ton.stuecke.kurz import kurz

TONART = "G"
OBEN = 1
AKT = 3
# Das Tempo von ZERO; Ambrose versucht, darin mitzuspielen.
ZERO_TEMPO = 96


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


# --- Gebannt (Kap. 32): der Kopf wird schneller, bis er nicht mehr mitkommt und zerfällt ---
KOPF_ACHTEL = "5:0.5 3:0.5 #4:0.5 2:0.5"
KOPF_SECHZEHNTEL = "5:1/4 3:1/4 #4:1/4 2:1/4"
GEBANNT_LINIEN = (
    KOPF,
    f"{KOPF_ACHTEL} {KOPF_ACHTEL} | {KOPF_ACHTEL} r:2",
    f"{KOPF_SECHZEHNTEL} {KOPF_SECHZEHNTEL} {KOPF_SECHZEHNTEL} {KOPF_SECHZEHNTEL} | "
    f"{KOPF_SECHZEHNTEL} 5:1/4 3:1/4 #4:1/4 r:1/4 5:1/4 3:1/4 r:1/2 5:1/4 r:3/4",
    "3:1/4 r:3/4 #4:1/4 r:1.75 2:1/4 r:3/4 | r:4",
    "",
)


def _gebannt_teile() -> dict[str, Teil]:
    """Fünf Teile zu zwei Takten; ZERO läuft in jedem weiter, Ambroses Zeile wird schneller."""
    zero = (ZERO_1, ZERO_2)
    return {
        f"g{i + 1}": Teil(ZERO_HELL, melodie, {"zero": zero[i % 2]})
        for i, melodie in enumerate(GEBANNT_LINIEN)
    }


AMBROSE_GEBANNT = Satz(
    "ambrose.gebannt",
    "Ambrose, gebannt",
    TONART,
    ZERO_TEMPO,
    4,
    _gebannt_teile(),
    ("g1", "g2", "g3", "g4", "g5"),
    (
        Stimme("klavier_alt", "melodie", 0.85, 0.1, 0.45, OBEN, 54),
        *zero_stimmen(44),
        Stimme("hammond", "halten", 0.35, 0.0, 0.5, 0, 30),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Gebannt: Ambroses Kopf versucht, im Takt von ZERO mitzuspielen, und zerfällt.",
)

# --- Verzerrt (Kap. 35): der Kopf langsam, ZERO legt sich darüber und geht nicht weg ---
VERZERRT_TEILE = {
    "v1": Teil(ZERO_HELL, "5:1.5 3:2.3 5:0.2 #4:1 | 2:3"),
    "v2": Teil(ZERO_HELL, "r:8", {"zero": ZERO_1}),
    "v3": Teil(ZERO_A.akkorde, "5:2 3:4 #4:2 | 2:4 r:4", {"zero": ZERO_A.melodie}),
}
AMBROSE_VERZERRT = Satz(
    "ambrose.verzerrt",
    "Ambrose, verzerrt",
    TONART,
    ZERO_TEMPO,
    4,
    VERZERRT_TEILE,
    ("v1", "v2", "v3"),
    (
        Stimme("klavier_alt", "melodie", 0.85, 0.1, 0.5, OBEN, 52),
        *zero_stimmen(36, nur("v2")),
        *zero_stimmen(64, nur("v3")),
        Stimme("hammond", "halten", 0.35, 0.0, 0.5, 0, 30, nur("v2", "v3")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Gestört: Ambroses Kopf, über den sich das perlende ZERO legt und nicht weggeht.",
)

# --- Vitrine (Kap. 32): Ambroses und Victors Thema einstimmig als eine Melodie ---
AMBROSE_VICTOR_EINSTIMMIG = kurz(
    "ambrose.victor.einstimmig",
    "Ambrose und Victor, einstimmig",
    64,
    4,
    Teil("N.C. | N.C. | N.C. | N.C.", f"{KOPF} | {KOPF_ACHTEL} 2:2 | r:4"),
    (
        Stimme("klavier_alt", "melodie", 0.7, 0.0, 0.5, OBEN, 40),
        Stimme("klavier_trocken", "melodie", 0.55, 0.0, 0.15, OBEN, 36),
    ),
    "Erkennen, leise: Ambroses Kopf und Victors Achtel als eine einzige Linie auf dem Klavier.",
    akt=AKT,
)

AMBROSE_FERN = Satz(
    "ambrose.fern",
    "Ambrose, fern",
    TONART,
    60,
    4,
    {"k": Teil("N.C. | N.C. | N.C.", f"{KOPF} | r:4")},
    ("k",),
    (Stimme("klavier_alt", "melodie", 0.8, 0.0, 0.9, OBEN, 44),),
    schleife=False,
    akt=AKT,
    pegel_db=-8.0,
    klangbild="lautsprecher",
    beschreibung="Sehnsucht: vier Töne von Ambroses Kopf, weit weg wie aus einem anderen Raum.",
)

AMBROSE_ENDE = kurz(
    "ambrose.ende",
    "Ambrose, Ende",
    60,
    3,
    Teil("N.C. | N.C. | N.C.", "5:1 #4:1 3:1 | 2:3 | r:3"),
    (Stimme("klavier_alt", "melodie", 0.85, 0.0, 0.55, OBEN, 46),),
    "Abschied: 5 – ♯4 – 3 – 2 stufenweise abwärts, der fremde Ton bleibt, keine Antwort.",
    akt=AKT,
)

# --- Verstimmt (Kap. 38, 40): Kopf und Thema auf dem verstimmten Klavier, dann rein gestimmt ---
VERSTIMMT_TEILE = {"vor": Teil("I | IV"), "frage": FRAGE, "voll": VOLL, "rein": VOLL, "nach": Teil("vi")}
VERSTIMMT_ALT = nur("vor", "frage", "voll")
AMBROSE_VERSTIMMT = Satz(
    "ambrose.verstimmt",
    "Ambrose, verstimmt",
    TONART,
    60,
    4,
    VERSTIMMT_TEILE,
    ("vor", "frage", "voll", "rein", "nach"),
    (
        Stimme("kneipenklavier", "melodie", 0.8, 0.1, 0.4, OBEN, 50, nur("frage", "voll")),
        Stimme("kneipenklavier", "wiegen", 0.6, -0.1, 0.4, 0, 36, VERSTIMMT_ALT),
        Stimme("klavier", "melodie", 0.8, 0.1, 0.4, OBEN, 50, nur("rein")),
        Stimme("klavier", "wiegen", 0.6, -0.1, 0.4, 0, 34, nur("rein", "nach")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Zart: Ambroses Thema auf einem verstimmten Klavier; am Ende klingt es rein gestimmt.",
)

STIMMTON = kurz(
    "stimmton",
    "Stimmton",
    60,
    4,
    Teil("N.C. | N.C. | N.C.", linien={"alt": "5:2 5:2 | r:4 | r:4", "rein": "r:4 | 5:7 r:1"}),
    (
        Stimme("kneipenklavier", "noten", 0.8, 0.0, 0.4, 0, 52, kennung="alt"),
        Stimme("klavier", "noten", 0.8, 0.0, 0.45, 0, 54, kennung="rein"),
    ),
    "Ursprung: die 5 von Ambroses Thema, erst schwebend (verstimmte Saiten), dann rein, verklingt.",
    akt=AKT,
)

# --- Vierhändig (1852): Ambroses Kopf als fröhliches Stück, Claire klatscht ---
VIER_A = Teil(
    "I | II7 | V | I | I | II7 | V7 | I",
    "5:1 3:1 5:1 3:1 | #4:1 2:1 #4:1 2:1 | 2:0.5 3:0.5 2:0.5 1:0.5 7,:1 5,:1 | 1:2 r:1 5,:1 | "
    "5:1 3:1 5:1 1':1 | #4:1 2:1 #4:1 6:1 | 5:1 4:1 2:1 7,:1 | 1:3 r:1",
)
VIER_B = Teil(
    "IV | I | II7 | V | IV | I | V7 | I",
    "1':1 6:1 4:1 6:1 | 5:1 3:1 1:2 | #4:1 6:1 1':1 6:1 | 5:2 r:2 | "
    "6:1 1':1 6:1 4:1 | 5:1 3:1 5:1 1':1 | 2':1 1':1 7:1 6:1 | 5:2 1':2",
)
VIER_SCHLUSS = Teil("I | IV | V7 | I", "5:2 3:2 | 6:2 4:2 | 2:2 7,:2 | 1:4")
AMBROSE_VIERHAENDIG = Satz(
    "ambrose.vierhaendig",
    "Ambrose, vierhändig (1852)",
    TONART,
    120,
    4,
    {"a": VIER_A, "b": VIER_B, "schluss": VIER_SCHLUSS},
    ("a", "b", "schluss"),
    (
        Stimme("klavier", "melodie", 0.8, 0.15, 0.3, OBEN, 56),
        Stimme("klavier", "melodie", 0.45, 0.25, 0.3, OBEN + 1, 42, nur("b")),
        Stimme("klavier", "stride", 0.6, -0.2, 0.3, 0, 44),
        Stimme("schlagwerk", "klatschen", 0.35, 0.35, 0.25, staerke=48, teile=nur("b", "schluss")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Fröhlich: Ambroses Kopf als Stück zu vier Händen, im zweiten Teil klatscht Claire mit.",
)

STUECKE = (
    AMBROSE_GEBANNT,
    AMBROSE_VICTOR_EINSTIMMIG,
    AMBROSE_FERN,
    AMBROSE_VERZERRT,
    AMBROSE_ENDE,
    AMBROSE_VERSTIMMT,
    STIMMTON,
    AMBROSE_VIERHAENDIG,
)
