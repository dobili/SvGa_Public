"""Summit City: das Endspielmotiv als Ortsthema, Lernen, Clubkampf und Wards Erzählung (Hastings).

Warum: Summit City ist klar, kalt und karg (Klangplan 4A1). Das Thema ist das Endspielmotiv (A1):
der Quintenturm 1 – 5 – 2' – 6' – 3'' in D-Dur, jeder Ton ein einzelner Klavierton mit viel Raum,
darüber ein hohes Streicherflageolett. Die Antwort steigt über dieselben Töne wieder ab und bleibt
offen auf der 2 (Teil „antwort“) oder schließt auf dem Grundton (Teil „schluss“). Beim Lernen
kommt das Cello dazu, im Clubkampf singt es sehr ruhig das Thema des Helden darunter.

Ersatz: Das Flageolett sind die Violinen zwei Oktaven hoch, ohne eigenes Flageolett-Register.
Sonderfall: „Mit jedem Abtausch fällt ein Ton weg“ (Clubkampf) und die gehaltene reine Quinte bei
der Opposition hängen am Spielverlauf; die Schleife spielt den vollen Turm.

Hastings: Wards Erzählung spielt Ambroses Walzer (``ambrose1``, mit der ♯4, wie 1857) als
Streichquartett: Geige, zweite Violine, Bratsche, Cello. Bei jedem Schach des Turms ein gezupfter
Ton, sechsmal steigend, über der Dominante; dann die warme Auflösung.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.akt4_themen import nur
from pipeline.abenteuer.ton.stuecke.ambrose1 import WALZER_A, WALZER_B

AKT = 4
TONART = "D"
# Flageolett: zwei Oktaven über der Lage der Stufen.
FLAGEOLETT = 2

TURM = Teil("I | V IV | I | I", "1:2 5:2 | 2':2 6':2 | 3'':4 | r:4", {"fl": "r:4 | r:4 | 3':8"})
ANTWORT = Teil(
    "vi | IV | I | V", "6':3 r:1 | 1'':2 6':2 | 5':3 r:1 | 2':4", {"fl": "3':4 | 1':4 | 3':4 | 2':4"}
)
SCHLUSS = Teil(
    "vi | IV | V | I", "6':3 r:1 | 1'':2 6':2 | 5':2 2':2 | 1':4", {"fl": "3':4 | 1':4 | 2':4 | 1':4"}
)
VOR = Teil("I | I", linien={"fl": "5:8"})
TEILE = {"vor": VOR, "turm": TURM, "antwort": ANTWORT, "schluss": SCHLUSS}


def _flageolett(lautstaerke: float, staerke: int) -> Stimme:
    """Das hohe Streicherflageolett, leise, mit viel Raum."""
    return Stimme("violinen", "noten", lautstaerke, 0.25, 0.55, FLAGEOLETT, staerke, kennung="fl")


SUMMIT_CITY = Satz(
    "summitCity",
    "Summit City",
    TONART,
    48,
    4,
    TEILE,
    ("vor", "turm", "antwort", "turm", "schluss", "turm", "antwort", "schluss"),
    (
        Stimme("klavier", "melodie", 0.85, -0.1, 0.55, 0, 52, nur("turm", "antwort", "schluss")),
        _flageolett(0.45, 34),
    ),
    akt=AKT,
    beschreibung="Klar, kalt, karg: das Endspielmotiv, einzelne Klaviertöne und ein hohes Flageolett.",
)

SUMMIT_CITY_LERNEN = Satz(
    "summitCity.lernen",
    "Summit City, Lernen",
    TONART,
    56,
    4,
    TEILE,
    ("vor", "turm", "antwort", "turm", "antwort", "schluss"),
    (
        Stimme("klavier", "melodie", 0.8, -0.1, 0.45, 0, 50, nur("turm", "schluss")),
        Stimme("cello", "melodie", 0.7, 0.15, 0.4, -1, 52, nur("antwort")),
        Stimme("klavier", "harfe", 0.35, -0.2, 0.45, 0, 32, nur("antwort")),
        Stimme("cello", "bass_grund", 0.45, 0.15, 0.4, 1, 36, nur("vor", "turm", "schluss")),
        _flageolett(0.3, 28),
    ),
    akt=AKT,
    beschreibung="Ruhig: das Endspielmotiv als Schleife, Klavier und Cello wechseln sich ab.",
)

# Clubkampf: der Turm über D-Dur mit hinzugefügter None (add9), damit die 2 des Helden darunter
# stimmt; dann singt das Cello das Heldenthema, das Klavier setzt nur einzelne hohe Töne darüber.
TURM_HELD = Teil(
    "Iadd9 | Iadd9 | Iadd9 | Iadd9",
    "1:2 5:2 | 2':2 6':2 | 3'':4 | r:4",
    {"held": "r:4 | 2:2 3:2 | 5:4 | r:4", "fl": "r:8 | 3':8"},
)
HELD_RUHIG = Teil(
    "ii V | ii V | I V | I",
    "2:1 3:1 5:2 | 2:1 3:1 5:1 6:1 | 5:1 3:1 2:2 | 1:4",
    {"kl": "6':2 2':2 | 6':2 2':2 | 3'':2 2'':2 | 1'':4", "fl": "6':8 | 3':4 | 1':4"},
)
SUMMIT_CITY_CLUBKAMPF = Satz(
    "summitCity.clubkampf",
    "Summit City, Clubkampf",
    TONART,
    52,
    4,
    {"vor": VOR, "turm": TURM_HELD, "held": HELD_RUHIG},
    ("vor", "turm", "held", "turm", "held", "turm", "held"),
    (
        Stimme("klavier", "melodie", 0.85, -0.1, 0.5, 0, 52, nur("turm")),
        Stimme("klavier", "noten", 0.6, -0.1, 0.5, 0, 44, nur("held"), "kl"),
        Stimme("cello", "noten", 0.55, 0.15, 0.4, 0, 42, nur("turm"), "held"),
        Stimme("cello", "melodie", 0.6, 0.15, 0.4, 0, 46, nur("held")),
        _flageolett(0.35, 30),
    ),
    akt=AKT,
    beschreibung="Klarheit: das Endspielmotiv, darunter sehr ruhig das Thema des Helden im Cello.",
)

# Sechs gezupfte Töne über der Dominante, je einer für ein Schach des Turms, steigend.
SCHACH = Teil(
    "V | V | V7 | V7 | V7 | V7 | V7 | V7",
    linien={"pizz": "5,:3 | 7,:3 | 2:3 | 4:3 | 5:3 | 7:3 | r:3 | r:3"},
)
HASTINGS_SCHLUSS = Teil("I | IV | V7 | I | I | I", "5:3 | 6:3 | 2':3 | 1':3 | 1':6")
HASTINGS = Satz(
    "hastings",
    "Hastings",
    "G",
    100,
    3,
    {
        "vor": Teil("I | I | V7 | V7"),
        "a": WALZER_A,
        "b": WALZER_B,
        "schach": SCHACH,
        "schluss": HASTINGS_SCHLUSS,
    },
    ("vor", "a", "b", "a", "schach", "schluss"),
    (
        Stimme("geige", "melodie", 0.85, 0.2, 0.4, 1, 56, nur("a", "b", "schluss")),
        Stimme("violinen", "halten", 0.35, -0.25, 0.4, 0, 34),
        Stimme("bratschen", "walzer", 0.5, -0.1, 0.4, -1, 38, nur("vor", "a", "b", "schluss")),
        Stimme("bratschen", "halten", 0.5, -0.1, 0.4, 0, 40, nur("schach")),
        Stimme("cello", "bass_zweier", 0.65, 0.1, 0.35, 1, 48, nur("vor", "a", "b", "schluss")),
        Stimme("cello", "bass_grund", 0.6, 0.1, 0.4, 1, 46, nur("schach")),
        Stimme("violinen_pizz", "noten", 0.8, 0.3, 0.35, 1, 62, nur("schach"), "pizz"),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Später, reifer: Ambroses Walzer als Streichquartett, sechs gezupfte Schachs, warm gelöst.",
)

STUECKE = (SUMMIT_CITY, SUMMIT_CITY_LERNEN, SUMMIT_CITY_CLUBKAMPF, HASTINGS)
