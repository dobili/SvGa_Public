"""Ambrose in Akt 4: Antwort mit Hale, Stille, Ankunft, 1866, Schlusston, Gespräch, Abschied.

Warum: In Akt 4 kommt Ambroses Thema an (Klangplan 4A2). Es ist seit Kapitel 45 rein (die ♯4 ist
eine 4, A1 „Ambrose, rein“), es endet auf der 1, die nicht mehr fragt, und in Kapitel 58 schließt
zum ersten Mal auch die Harmonie (A1 „Schlusston“: die 1 über der Kadenz V – I, in der tiefen
Oktave verdoppelt und gehalten). Hales Motiv behält die ♯4 (A1, „Hale“); deshalb spielen Ambrose
und Hale ihre Köpfe nacheinander und erst die Antwort einstimmig, sonst rieben sich 4 und ♯4.

Ersatz: Das Holzgeräusch vor `b5` ist ein Geräusch (Teil B) und fehlt hier.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.akt4_themen import (
    AMBROSE_REIN,
    ANTWORT,
    ANTWORT_AKKORDE,
    HALE,
    KOPF_REIN,
    KOPF_REIN_AKKORDE,
    OBEN,
    TONART,
    nur,
)

AKT = 4
# Die Antwort, die auf der 1 liegen bleibt (einstimmige Fassungen ohne Akkord, A1).
ANTWORT_GRUNDTON = "3:1 1:1.5 2:1 r:0.5 | 1:4"
OHNE_AKKORD = "N.C. | N.C."

# Ambrose (rein), dann Hale (mit ♯4, in gleichen Vierteln), dann beide einstimmig auf den Grundton.
_GRUNDTON_TEILE = {
    "ambrose": Teil(OHNE_AKKORD, linien={"amb": KOPF_REIN}),
    "hale": Teil("N.C.", linien={"hale": HALE}),
    "zusammen": Teil(OHNE_AKKORD, linien={"amb": ANTWORT_GRUNDTON, "hale": ANTWORT_GRUNDTON}),
}
AMBROSE_HALE_GRUNDTON = Satz(
    "ambrose.hale.grundton",
    "Ambrose und Hale, Grundton",
    TONART,
    60,
    4,
    _GRUNDTON_TEILE,
    ("ambrose", "hale", "zusammen"),
    (
        Stimme("klavier_alt", "noten", 0.85, -0.15, 0.5, OBEN, 54, kennung="amb"),
        Stimme("horn", "noten", 0.8, 0.2, 0.45, 0, 56, kennung="hale"),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Antwort: Ambroses Kopf, Hales Motiv, dann beide einstimmig auf dem Grundton.",
)

B5 = Satz(
    "b5",
    "b5",
    TONART,
    80,
    4,
    {
        **_GRUNDTON_TEILE,
        "zusammen": Teil(f"{ANTWORT_AKKORDE}", linien=_GRUNDTON_TEILE["zusammen"].linien),
    },
    ("hale", "ambrose", "zusammen"),
    (
        Stimme("horn", "noten", 0.8, 0.2, 0.45, 0, 56, kennung="hale"),
        Stimme("klavier_alt", "noten", 0.85, -0.15, 0.5, OBEN, 54, kennung="amb"),
        Stimme("bratschen", "halten", 0.35, 0.0, 0.45, 0, 30, nur("zusammen")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Antwort: Hales Motiv auf dem Horn, Ambroses Kopf, die Antwort einstimmig.",
)

AMBROSE_STILL = Satz(
    "ambrose.still",
    "Ambrose, still",
    TONART,
    50,
    4,
    {"k": Teil(OHNE_AKKORD, KOPF_REIN), "a": Teil(OHNE_AKKORD, ANTWORT_GRUNDTON)},
    ("k", "k", "a"),
    (Stimme("klavier_alt", "melodie", 0.85, 0.0, 0.5, OBEN, 48),),
    schleife=False,
    akt=AKT,
    beschreibung="Ruhe: Ambroses Thema ohne Begleitung, langsam; die 1 am Ende fragt nicht mehr.",
)

AMBROSE_ANGEKOMMEN = Satz(
    "ambrose.angekommen",
    "Ambrose, angekommen",
    TONART,
    60,
    4,
    {"k": Teil(OHNE_AKKORD, KOPF_REIN), "a": Teil(OHNE_AKKORD, ANTWORT_GRUNDTON), "aus": Teil("N.C.")},
    ("k", "a", "aus"),
    (Stimme("mundharmonika", "melodie", 0.7, 0.3, 0.75, OBEN, 46, nur("k", "a")),),
    schleife=False,
    akt=AKT,
    pegel_db=-6.0,
    beschreibung="Fern: Ambroses Thema einmal, auf einer einzelnen Mundharmonika, sehr weit weg.",
)

AMBROSE_1866 = Satz(
    "ambrose.1866",
    "Ambrose, 1866",
    TONART,
    60,
    4,
    {
        "vor": Teil(KOPF_REIN_AKKORDE),
        "v": AMBROSE_REIN,
        "allein": Teil("N.C. | N.C. | N.C. | N.C.", f"{KOPF_REIN} | {ANTWORT_GRUNDTON}"),
    },
    ("vor", "v", "allein"),
    (
        Stimme("klavier", "melodie", 0.85, 0.1, 0.45, OBEN, 54, nur("v", "allein")),
        Stimme("klavier", "wiegen", 0.55, -0.1, 0.45, -1, 38),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Erfüllt: Ambroses Thema vollständig, einzelnes Klavier, endet einstimmig auf dem Grundton.",
)

# Schlusston (A1): Kopf, Antwort, die 1 liegt über Vsus4 – V und schließt auf I; Cello und
# Kontrabass verdoppeln sie in der Tiefe und halten sie.
SCHLUSSTON_AKKORDE = f"{KOPF_REIN_AKKORDE} | I V | Vsus4 V | I | I"
SCHLUSSTON_MELODIE = f"{KOPF_REIN} | 3:1 1:1.5 2:1 r:0.5 | 1:4 | 1:8"
SCHLUSSTON_TIEF = "r:4 | r:4 | r:4 | 5,:4 | 1,:8"


def _schlusston(halten: int) -> Teil:
    """Der Schlusston mit ``halten`` Takten für den letzten Ton (Kap. 58: zwei, Kap. 66: länger)."""
    extra = " | I" * (halten - 2)
    dauer = 4 * halten
    melodie = SCHLUSSTON_MELODIE.replace("1:8", f"1:{dauer}")
    tief = SCHLUSSTON_TIEF.replace("1,:8", f"1,:{dauer}")
    return Teil(SCHLUSSTON_AKKORDE + extra, melodie, {"tief": tief})


def _schluss_stimmen() -> tuple[Stimme, ...]:
    """Altes Klavier singt, Cello und Kontrabass halten die Tiefe, Bratschen liegen."""
    return (
        Stimme("klavier_alt", "melodie", 0.85, 0.1, 0.5, OBEN, 54, nur("v", "schluss")),
        Stimme("cello", "bass_grund", 0.5, -0.15, 0.45, 1, 40, nur("vor", "v")),
        Stimme("cello", "noten", 0.6, -0.15, 0.45, 0, 46, nur("schluss"), "tief"),
        Stimme("kontrabass", "noten", 0.5, 0.0, 0.45, -1, 40, nur("schluss"), "tief"),
        Stimme("bratschen", "halten", 0.35, 0.25, 0.45, 0, 30),
    )


AMBROSE_SCHLUSS = Satz(
    "ambrose.schluss",
    "Ambrose, Schlusston",
    TONART,
    60,
    4,
    {"vor": Teil("I | IV"), "v": AMBROSE_REIN, "schluss": _schlusston(2)},
    ("vor", "v", "schluss"),
    _schluss_stimmen(),
    schleife=False,
    akt=AKT,
    beschreibung="Erfüllt: Ambroses Thema vollständig, und zum ersten Mal schließt auch die Harmonie.",
)

LANGER_SCHLUSS = 3
AMBROSE_NICHT_SPAETER = Satz(
    "ambrose.nichtSpaeter",
    "Ambrose, nicht später",
    TONART,
    54,
    4,
    {"v": AMBROSE_REIN, "schluss": _schlusston(LANGER_SCHLUSS)},
    ("v", "schluss"),
    _schluss_stimmen(),
    schleife=False,
    akt=AKT,
    beschreibung="Ende: Ambroses Thema mit dem Schlusston, der sehr lange verklingt.",
)

# Gespräch: Ambrose und der Held wechseln Phrase um Phrase (je zwei Takte).
_GESPRAECH = {
    "a1": Teil(KOPF_REIN_AKKORDE, KOPF_REIN),
    "h1": Teil("V | V", "2:1 3:1 5:2 | r:4"),
    "a2": Teil(KOPF_REIN_AKKORDE, "5:1 3:2 4:1 | 2:4"),
    "h2": Teil("ii V | I", "2:1 3:1 5:1 6:1 | 5:4"),
    "a3": Teil(ANTWORT_AKKORDE, ANTWORT),
    "h3": Teil("I V | I", "5:1 3:1 2:2 | 1:4"),
}
AMBROSE_HELD_GESPRAECH = Satz(
    "ambrose.held.gespraech",
    "Ambrose und Held, Gespräch",
    TONART,
    72,
    4,
    _GESPRAECH,
    ("a1", "h1", "a2", "h2", "a3", "h3"),
    (
        Stimme("klavier_alt", "melodie", 0.85, -0.2, 0.45, OBEN, 54, nur("a1", "a2", "a3")),
        Stimme("gitarre", "melodie", 0.8, 0.25, 0.35, OBEN, 56, nur("h1", "h2", "h3")),
        Stimme("gitarre", "zupfen", 0.4, 0.3, 0.35, 0, 32, nur("a1", "a2", "a3")),
        Stimme("cello", "halten", 0.4, 0.0, 0.4, -1, 32),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Gespräch: das Thema des Helden und Ambroses Thema im Wechsel, Phrase um Phrase.",
)

# Suchend: Ambrose sofort, dann tastet sich der Held hinein; beide bleiben offen auf V.
_SUCHEND = {
    "s1": Teil(KOPF_REIN_AKKORDE, KOPF_REIN),
    "s2": Teil(KOPF_REIN_AKKORDE, "5:1 3:2 4:1 | 2:4", {"held": "r:4 | r:1 2:1 3:1 5:1"}),
    "s3": Teil("V | I ii", "r:4 | 5:1 3:2 4:1", {"held": "2:1 3:1 5:2 | r:4"}),
    "s4": Teil("V vi | V", "2:2 3:2 | 2:4", {"held": "5:2 6:2 | 5:4"}),
}
AMBROSE_SUCHEND = Satz(
    "ambrose.suchend",
    "Ambrose, suchend",
    TONART,
    64,
    4,
    _SUCHEND,
    ("s1", "s2", "s3", "s4"),
    (
        Stimme("klavier_alt", "melodie", 0.8, -0.2, 0.5, OBEN, 46),
        Stimme("gitarre", "noten", 0.7, 0.25, 0.4, 0, 48, nur("s2", "s3", "s4"), "held"),
        Stimme("bratschen", "halten", 0.3, 0.0, 0.45, 0, 28),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Gemeinsam suchend: Ambroses Thema leise, dann tasten sich beide Themen ineinander.",
)

# Treppe: Ambroses Thema als Grund, die Trompete ganz fern mit dem Heldenthema.
_TREPPE = {
    "vor": Teil("I | IV"),
    "t1": AMBROSE_REIN,
    "t2": Teil(AMBROSE_REIN.akkorde, AMBROSE_REIN.melodie, {"fern": "r:4 | r:1 2:1 3:1 5:1 | r:4 | r:4"}),
    "t3": Teil(
        AMBROSE_REIN.akkorde, linien={"gitarre": AMBROSE_REIN.melodie, "fern": "r:4 | r:4 | 5:4 | 1':4"}
    ),
}
ABSCHIED_TREPPE = Satz(
    "abschied.treppe",
    "Abschied, Treppe",
    TONART,
    66,
    4,
    _TREPPE,
    ("vor", "t1", "t2", "t1", "t3", "t1", "t2"),
    (
        Stimme("klavier_alt", "melodie", 0.75, -0.1, 0.5, OBEN, 44, nur("t1", "t2")),
        Stimme("gitarre", "noten", 0.7, 0.15, 0.4, OBEN, 46, nur("t3"), "gitarre"),
        Stimme("gitarre", "zupfen", 0.45, -0.3, 0.4, 0, 32),
        Stimme("cello", "bass_grund", 0.4, 0.0, 0.45, 1, 32),
        Stimme("trompete", "noten", 0.35, 0.5, 0.8, OBEN, 40, nur("t2", "t3"), "fern"),
    ),
    akt=AKT,
    pegel_db=-4.0,
    beschreibung="Abschied, warm: Ambroses Thema ganz zart als Grund, die Trompete weit weg.",
)

STUECKE = (
    AMBROSE_HALE_GRUNDTON,
    B5,
    AMBROSE_STILL,
    AMBROSE_ANGEKOMMEN,
    AMBROSE_1866,
    AMBROSE_SCHLUSS,
    AMBROSE_NICHT_SPAETER,
    AMBROSE_HELD_GESPRAECH,
    AMBROSE_SUCHEND,
    ABSCHIED_TREPPE,
)
