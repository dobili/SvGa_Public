"""Mamas Thema und die Konzernfläche in Akt 2: mama, mama.vollstaendig, ambrose.mama, konzern.flaeche.

Warum: Mamas Thema (Klangplan A1) ist 1 – 2 – 3 – 5 – 6 mit Auflösung auf 5, die 5 gehalten, als ob
sie zögert; seine ersten vier Töne sind der Anfang von Maple Falls. In Kapitel 25 und bei „jede
Nacht“ (Kapitel 27) erklingen nur die vier Töne, dann bricht es ab (``mama``); vollständig erst bei
„Ich hab ihn gesehen“ (``mama.vollstaendig``), danach mit dem Klang der Kantine von Ironwood. Am
Schluss von Kapitel 28 folgen Ambroses Kopf und Mamas Thema aufeinander. Die Konzernfläche ist der
Konzernton (♯4) als liegender Ton mit der Quinte darüber: glatt, hell, ohne Atem.

Tongenau: Mamas Stufen und Dauern sind die von ``motive.MAMA`` (1, 1, 1, 3, 1,5, 4), Ambroses Kopf
der aus ``ambrose1``. Die Konzernfläche steht in G-Dur, damit ihr Ton genau Ambroses fremder Ton
ist (Cis); so reibt sie sich am Fluss mit ``ambrose.zweifel``.

Ersatz: Einen Synthesizer gibt es in den freien Bibliotheken nicht; die Zugriegelorgel
(``hammond``) hält den Ton elektrisch und ohne Atem. Das Akkordeon der Kantine spielt ebenfalls die
Zugriegelorgel (wie in ``akt2_ironwood``).
"""

from pipeline.abenteuer.ton.motive import MAMA
from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.ambrose1 import KOPF

AKT = 2
OBEN = 1


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


def motivzeile(stufen: tuple[str, ...], dauern: tuple[float, ...]) -> str:
    """Ein Motiv als Melodiezeile. Beispiel: (("1", "5"), (1, 3)) ergibt „1:1 5:3“."""
    return " ".join(f"{stufe}:{dauer:g}" for stufe, dauer in zip(stufen, dauern, strict=True))


# Mamas Kopf (vier Töne) und ihr ganzes Thema, wie in motive.MAMA.
MAMA_KOPF = motivzeile(MAMA.stufen[:4], MAMA.dauern[:4])
MAMA_GANZ = motivzeile(MAMA.stufen, MAMA.dauern)

# Zweimal setzt sie an, beide Male bricht es nach der gehaltenen 5 ab; der letzte Akkord bleibt offen.
MAMA_STUECK = Satz(
    "mama",
    "Mama",
    "G",
    56,
    4,
    {"a": Teil("I | I | vi iii | iii", f"{MAMA_KOPF} r:2 {MAMA_KOPF} r:2")},
    ("a",),
    (
        Stimme("klavier", "melodie", 0.8, 0.1, 0.45, OBEN, 50),
        Stimme("klavier", "wiegen", 0.6, -0.1, 0.45, -1, 34),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Zögernd, warm: Mamas Thema auf dem Klavier, nur vier Töne, dann bricht es ab.",
)

# Das ganze Thema in F-Dur, danach mit der Kantine (Klarinette, Akkordeon) bis zur Kadenz.
SOLO = Teil("I | I IV | I | I", f"{MAMA_GANZ} r:4.5")
KANTINE = Teil(
    "I | I IV | I | vi | IV | ii V | I | I",
    f"{MAMA_GANZ} r:0.5 | 3:1 5:1 6:1 1':1 | 1':2 6:1 4:1 | 2:1 4:1 5:1 7,:1 | 1:4 | r:4",
)
MAMA_VOLLSTAENDIG = Satz(
    "mama.vollstaendig",
    "Mama, vollständig",
    "F",
    60,
    4,
    {"solo": SOLO, "kantine": KANTINE},
    ("solo", "kantine"),
    (
        Stimme("klavier", "melodie", 0.8, 0.1, 0.45, OBEN, 50, nur("solo")),
        Stimme("klavier", "wiegen", 0.6, -0.1, 0.45, -1, 34, nur("solo")),
        Stimme("klarinette", "melodie", 0.85, 0.15, 0.35, OBEN, 58, nur("kantine")),
        Stimme("hammond", "stride", 0.45, -0.25, 0.3, 0, 42, nur("kantine")),
        Stimme("klavier", "tupfen", 0.3, 0.25, 0.35, 0, 32, nur("kantine")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Erlösung: Mamas Thema mit allen fünf Tönen, danach mit dem Klang der Kantine.",
)

# Ambroses Kopf (altes Klavier), dann Mamas Thema (Klavier); kein Digitalpiano, keine Konzernfläche.
AMBROSE_MAMA = Satz(
    "ambrose.mama",
    "Ambrose und Mama",
    "G",
    63,
    4,
    {
        "kopf": Teil("I II | II | IV | V", f"{KOPF} | r:4 | r:4"),
        "mama": Teil("I | I IV | I | I", f"{MAMA_GANZ} r:4.5"),
    },
    ("kopf", "mama"),
    (
        Stimme("klavier_alt", "melodie", 0.85, 0.1, 0.5, OBEN, 52, nur("kopf")),
        Stimme("klavier_alt", "halten", 0.35, -0.15, 0.5, -1, 32, nur("kopf")),
        Stimme("klavier", "melodie", 0.8, 0.1, 0.45, OBEN, 50, nur("mama")),
        Stimme("klavier", "wiegen", 0.6, -0.1, 0.45, -1, 34, nur("mama")),
    ),
    schleife=False,
    akt=AKT,
    beschreibung="Frieden: Ambroses Kopf, dann Mamas Thema, nacheinander, ohne Konzernton.",
)

# Konzernfläche: die ♯4 von G (Cis) liegt durch, in der Mitte leise die Quinte darüber (Gis).
TAKTE_FLAECHE = 8
KONZERN_FLAECHE = Satz(
    "konzern.flaeche",
    "Konzernfläche",
    "G",
    64,
    4,
    {"f": Teil(" | ".join(["N.C."] * TAKTE_FLAECHE), "#4:32", {"quinte": "r:8 #1':16 r:8"})},
    ("f",),
    (
        Stimme("hammond", "melodie", 0.7, 0.0, 0.1, OBEN, 50),
        Stimme("hammond", "noten", 0.35, 0.2, 0.1, OBEN, 40, kennung="quinte"),
    ),
    akt=AKT,
    beschreibung="Glatt, hell, ohne Atem: der Konzernton als liegender Ton, leise die Quinte darüber.",
)

STUECKE = (MAMA_STUECK, MAMA_VOLLSTAENDIG, AMBROSE_MAMA, KONZERN_FLAECHE)
