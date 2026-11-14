"""Ambrose und Victor in Akt 1: Dachboden, Erinnerung, Walzer, „Lass mich“, Victor, Titel.

Warum: Ambroses Kopf (5 – 3 – ♯4 – 2, Klangplan A1) ist das wichtigste Motiv des Spiels. In Akt 1
erklingt er fragend (offen auf der 2), in der Erinnerung zum ersten Mal vollständig mit Trugschluss,
als Walzer hell und jung, in „Lass mich“ drängend. Victor spielt dieselben vier Töne in strengen
Achteln über einem Moll-Bass (Klangplan A1, „Victor“). Ambrose und Victor folgen in Akt 1 nie
direkt aufeinander (Teil C, S10); das regelt der Dialog, nicht die Datei.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.maple import teile as maple_teile

TONART = "G"
OBEN = 1

# Der Kopf mit Vorschlag vor der ♯4 (kurzes D), offen auf der 2: zwei Takte.
KOPF = "5:1 3:1.85 5:0.15 #4:1 | 2:2.5 r:1.5"
# Die Antwort der vollständigen Fassung: 3 – 1 – 2 – 1, landet auf dem Grundton.
ANTWORT = "3:1 1:1.5 2:1 r:0.5 | 1:3 r:1"


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


# Dachboden: der Kopf, dann zwei Takte nur Gitarre; viermal mit wechselndem Instrument.
FRAGE = Teil("I II | II | IV | Vsus4", f"{KOPF} | r:4 | r:4")
AMBROSE = Satz(
    "ambrose",
    "Ambrose",
    TONART,
    66,
    4,
    {"k1": FRAGE, "k2": FRAGE, "k3": FRAGE, "k4": FRAGE},
    ("k1", "k2", "k3", "k4"),
    (
        Stimme("klavier_alt", "melodie", 0.85, 0.1, 0.5, OBEN, 52, nur("k1", "k3")),
        Stimme("cembalo", "melodie", 0.7, 0.2, 0.45, OBEN, 50, nur("k2")),
        Stimme("klavier_alt", "melodie", 0.7, 0.1, 0.55, OBEN + 1, 44, nur("k4")),
        Stimme("gitarre", "zupfen", 0.55, -0.3, 0.3, 0, 36),
    ),
    beschreibung="Staunen, fragend: Ambroses Kopf auf dem alten Klavier, darunter leise Gitarre.",
)

# Erinnerung: das Thema vollständig auf dem Cembalo, das Cello antwortet; Trugschluss auf vi.
VOLL = Teil("I II | II | IV I | vi", f"{KOPF} | {ANTWORT}")
VOLL_CELLO = Teil("I II | II | IV I | vi", linien={"cello": f"{KOPF} | {ANTWORT}"})
AMBROSE_ERINNERUNG = Satz(
    "ambrose.erinnerung",
    "Ambrose, Erinnerung (1858)",
    TONART,
    58,
    4,
    {"vor": Teil("I | IV"), "v1": VOLL, "v2": VOLL_CELLO, "v3": VOLL, "nach": Teil("vi | IV | vi")},
    ("vor", "v1", "v2", "v3", "nach"),
    (
        Stimme("cembalo", "melodie", 0.8, 0.15, 0.45, OBEN, 54),
        Stimme("cello", "noten", 0.8, -0.1, 0.45, 0, 54, nur("v2"), "cello"),
        Stimme("cello", "bass_grund", 0.5, -0.1, 0.4, 1, 40, nur("vor", "v1", "v3", "nach")),
        Stimme("cembalo", "halten", 0.4, 0.2, 0.4, -1, 34),
    ),
    schleife=False,
    beschreibung="Feierlich, schuldig: das Thema zum ersten Mal vollständig, die Harmonie bleibt offen.",
)

# Walzer 1857: dieselbe Melodie im Dreiertakt, hell und jung, mit Streichern; endet aufgelöst.
WALZER_A = Teil(
    "I | II | V | V7 | I | V | I | I",
    "5:2 3:1 | #4:2 2:1 | 2:3 | r:3 | 3:2 1:1 | 2:2 1:1 | 1:3 | r:3",
)
WALZER_B = Teil(
    "IV | V | ii | V | IV | II7 | V | V7",
    "6:2 5:1 | 4:2 3:1 | 2:2 3:1 | 5:3 | 6:2 5:1 | 4:2 #4:1 | 5:3 | r:3",
)
AMBROSE_WALZER = Satz(
    "ambrose.walzer",
    "Ambrose, Walzer (New York 1857)",
    TONART,
    138,
    3,
    {
        "vor": Teil("I | I | V7 | V7"),
        "a": WALZER_A,
        "b": WALZER_B,
        "a2": WALZER_A,
        "schluss": Teil("I | IV | V7 | I", "5:3 | 6:3 | 2':3 | 1':3"),
    },
    ("vor", "a", "b", "a2", "schluss"),
    (
        Stimme("klavier", "walzer", 0.75, -0.2, 0.3, 0, 46),
        Stimme("violinen", "melodie", 0.8, 0.15, 0.35, OBEN, 58, nur("a", "b", "a2", "schluss")),
        Stimme("klavier", "melodie", 0.5, -0.1, 0.3, OBEN + 1, 48, nur("a2", "schluss")),
        Stimme("bratschen", "halten", 0.55, 0.3, 0.35, 0, 40),
        Stimme("kontrabass_pizz", "bass_grund", 0.6, 0.0, 0.25, 1, 50),
    ),
    schleife=False,
    beschreibung="Hell, glänzend, jung: Ambroses Melodie als Walzer mit kleinem Streichorchester.",
)

# „Lass mich“: der Kopf in d-Moll, lauter, setzt immer wieder an; Streicher drängen.
LASS = Teil("i | V | i | V", "5:1 3:2 #4:1 | 2:2 r:2 | 5:1 3:2 #4:1 | 5:1 3:2 #4:1")
AMBROSE_LASS_MICH = Satz(
    "ambrose.lassMich",
    "Ambrose, „Lass mich“",
    "d",
    72,
    4,
    {"l": LASS, "l2": LASS},
    ("l", "l2"),
    (
        Stimme("klavier_alt", "melodie", 1.0, 0.1, 0.45, OBEN, 70),
        Stimme("violinen", "halten", 0.75, 0.25, 0.4, 0, 60),
        Stimme("cello", "bass_grund", 0.7, -0.2, 0.35, 1, 60),
    ),
    beschreibung="Drängend, Versuchung: Ambroses Kopf, lauter als je zuvor, setzt immer wieder an.",
)

# Victor: genau die Töne des Kopfes in Achteln, streng, trockenes Klavier über e-Moll-Bass.
VICTOR = Satz(
    "victor",
    "Victor",
    TONART,
    120,
    4,
    {
        "v": Teil(
            "vi | vi | vi | vi",
            "5:0.5 3:0.5 #4:0.5 2:0.5 r:2 | r:4 | 5:0.5 3:0.5 #4:0.5 2:0.5 r:2 | 5:0.5 3:0.5 #4:0.5 2:2.5",
            {"bass": "6,,:1 6,,:1 6,,:1 6,,:1 | 6,,:1 6,,:1 6,,:1 6,,:1 | 6,,:1 6,,:1 6,,:1 6,,:1 | 6,,:4"},
        )
    },
    ("v",),
    (
        Stimme("klavier_trocken", "melodie", 0.9, 0.0, 0.05, OBEN, 72),
        Stimme("klavier_trocken", "noten", 0.8, -0.1, 0.05, 0, 64, kennung="bass"),
    ),
    schleife=False,
    beschreibung="Kalt, kurz: Ambroses vier Töne in strengen Achteln, ohne Pedal, über e-Moll.",
)

_MAPLE = maple_teile()
TITEL = Satz(
    "titel",
    "Titel",
    TONART,
    76,
    4,
    {
        "vor": _MAPLE["vor"],
        "a1": _MAPLE["a1"],
        "a2": _MAPLE["a2"],
        "frage": Teil("I II | II | IV | V", f"{KOPF} | r:4 | r:4"),
        "aha": Teil("ii | V | I | I", linien={"aha": "r:4 | r:4 | 2:0.25 5:0.5 1':3.25 | r:4"}),
    },
    ("vor", "a1", "a2", "frage", "aha"),
    (
        Stimme("gitarre", "zupfen", 0.8, -0.25, 0.3, 0, 46),
        Stimme("gitarre", "melodie", 0.75, 0.2, 0.3, OBEN, 56, nur("a1", "a2")),
        Stimme("klavier_alt", "melodie", 0.8, 0.15, 0.5, OBEN, 54, nur("frage")),
        Stimme("glockenspiel", "noten", 0.6, 0.3, 0.45, OBEN, 58, nur("aha"), "aha"),
    ),
    beschreibung="Aufbruch, Staunen: Maple Falls auf der Gitarre, dann Ambroses Kopf, zum Schluss das Aha.",
)

STUECKE = (AMBROSE, AMBROSE_ERINNERUNG, AMBROSE_WALZER, AMBROSE_LASS_MICH, VICTOR, TITEL)
