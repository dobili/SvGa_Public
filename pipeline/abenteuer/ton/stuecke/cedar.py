"""Cedar Creek: das einprägsame Ortsthema in d-Moll und seine Fassungen (Klangplan A0; Akt 1).

Warum: Cedar Creek ist still und forschend, und einprägsam geht auch ruhig (Probestück vom
22.11.2026, vom Autor freigegeben):

- Kopf (2 Takte): D F E G | A A F. Die Umkehrung von Ambroses Kopf (1 – 3 – 2 – 4 – 5, Leitmotiv
  A1), dann die Quinte zweimal als Kennzeichen (Tonwiederholung), fallend auf F.
- Form A A' B A' offen wie Maple Falls; im B-Teil schweigt die rechte Hand, die linke antwortet tief.
- Klavier allein, die Turmuhr als Puls, kein Schlagwerk sonst (Ortsblatt „Nicht hier“).
- Drei Spuren je Fassung: grund (linke Hand, Turmuhr), melodie, zusatz (Cello als Farbe).
- Der Clubkampf ist die Steigerung des Kampfthemas von Akt 1 (maple.py) in d-Moll: Klavier und
  Kontrabass treiben, die Turmuhr tickt, kein Schlagzeug; Zusatzspur sind die Streicher.
- Am Steg (Kapitel 16) klingen Ambroses Kopf und das Thema von Cedar Creek zum ersten Mal zusammen.

Teilnamen ``vor``, ``a``, ``atem``, ``a2``, ``b`` und ``FORM`` bleiben für spätere Akte
(akt2_wege) erhalten.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.maple import (
    GEGEN_ANHEBUNG,
    KAMPF_FORM,
    KAMPF_MELODIE,
    KAMPF_TEILE,
    mit_spuren,
)

TONART = "d"
MELODIE_OKTAVE = 1

KOPF = "1:1 3:1 2:1 4:1 | 5:1 5:1 3:2"
A = Teil("i | i | iv | V", f"{KOPF} | 1:1 3:1 2:1 4:1 | 6:1 5:1 2:2")
A2 = Teil("i | i | iv V | i", f"{KOPF} | 4:1 3:1 2:1 #7,:1 | 1:4")
A_OFFEN = Teil("i | i | iv | V V7", f"{KOPF} | 4:1 3:1 2:1 #7,:1 | 2:2 #7,:1 2:1")
# B: Die linke Hand antwortet tief (als Melodie des Teils), endet auf der Dominante.
B = Teil(
    "VI | III | iv | V | VI | III | iv | V",
    "3:2 2:2 | 1:2 7,:2 | 1:2 3:2 | 2:4 | 6,:2 1:2 | 3:2 1:2 | 2:3 3:1 | #7,:4",
)
VOR = Teil("i | i")
ATEM = Teil("i | VI")
# Farbe (Cello, Zusatzspur): lange Töne unter A, im B-Teil eine eigene Linie.
FARBE = {
    "a": "5,:4 | 3,:4 | 4,:4 | 5,:4",
    "a2": "5,:4 | 3,:4 | 4,:2 5,:2 | 1:4",
    "b": "1:4 | 5,:4 | 6,:4 | 5,:4 | 3,:4 | 5,:4 | 6,:4 | 5,:4",
    "a3": "5,:4 | 3,:4 | 4,:4 | 5,:2 #7,,:2",
}


def _mit(teil: Teil, **linien: str) -> Teil:
    """Ein Teil mit weiteren eigenen Linien."""
    return Teil(teil.akkorde, teil.melodie, {**teil.linien, **linien})


TEILE = {
    "vor": VOR,
    "a": _mit(A, farbe=FARBE["a"]),
    "atem": ATEM,
    "a2": _mit(A2, farbe=FARBE["a2"]),
    "b": _mit(B, farbe=FARBE["b"]),
    "a3": _mit(A_OFFEN, farbe=FARBE["a3"]),
}
# Form des Ortsthemas und die alte Form für spätere Akte.
ORTSFORM = ("a", "a2", "b", "a3")
FORM = ("vor", "a", "atem", "a2", "b")
MELODIE_TEILE = frozenset({"a", "a2", "a3"})
# Ambroses Kopf in d-Moll (A – F – Gis – E) als Gegenstimme am Steg, vier Takte zu A.
AMBROSE_STEG = "5:2 3:2 | #4:2 2:2 | 5:2 3:2 | #4:3 2:1"


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


def _cedar(
    kennung: str,
    titel: str,
    tempo: float,
    spuren: tuple[tuple[Stimme, ...], tuple[Stimme, ...], tuple[Stimme, ...]],
    text: str,
    pegel_db: float = 0.0,
) -> Satz:
    """Eine Fassung des Themas in drei Spuren (Zusatz: Cello als Farbe)."""
    stimmen, gruppen = mit_spuren(*spuren)
    return Satz(
        kennung,
        titel,
        TONART,
        tempo,
        4,
        TEILE,
        ORTSFORM,
        stimmen,
        pegel_db=pegel_db,
        spuren=gruppen,
        zusatz="farbe",
        beschreibung=text,
    )


def _klavier(staerke: int, hall: float) -> tuple[Stimme, ...]:
    """Rechte Hand singt in A, linke Hand antwortet tief in B (lauter, A0.6)."""
    return (
        Stimme("klavier", "melodie", 0.8, 0.1, hall, MELODIE_OKTAVE, staerke, MELODIE_TEILE),
        Stimme("klavier", "melodie", 0.7 * GEGEN_ANHEBUNG, -0.05, hall, 0, staerke - 4, nur("b")),
    )


def _cello(staerke: int, lautstaerke: float = 0.5) -> tuple[Stimme, ...]:
    """Das Cello als Farbe (Zusatzspur, Mono)."""
    return (Stimme("cello", "noten", lautstaerke, 0.0, 0.35, 1, staerke, kennung="farbe"),)


CEDAR_CREEK = _cedar(
    "cedarCreek",
    "Cedar Creek",
    66,
    (
        (
            Stimme("klavier", "wiegen", 0.6, -0.1, 0.35, -1, 36),
            Stimme("schlagwerk", "uhr", 0.35, -0.35, 0.3, staerke=50),
        ),
        _klavier(54, 0.35),
        _cello(40),
    ),
    "Still und einprägsam: Klavier allein, die Turmuhr als Puls; das Cello als Farbe.",
)

CEDAR_CREEK_NACHT = _cedar(
    "cedarCreek.nacht",
    "Cedar Creek, Nacht",
    60,
    (
        (Stimme("klavier", "harfe", 0.45, -0.15, 0.5, -1, 32),),
        _klavier(44, 0.5),
        _cello(34, 0.4),
    ),
    "Nacht: dieselbe Melodie langsam, gebrochene Akkorde, viel Raum, keine Uhr.",
)

CEDAR_CREEK_BIBLIOTHEK = _cedar(
    "cedarCreek.bibliothek",
    "Cedar Creek, Bibliothek",
    63,
    ((Stimme("klavier", "wiegen", 0.55, -0.1, 0.55, -1, 32),), _klavier(46, 0.55), _cello(36, 0.4)),
    "Gedämpft, feierlich: dasselbe Klavier mit Hall wie in einem hohen Raum, leiser.",
    pegel_db=-4.0,
)

CEDAR_CREEK_ARCHIV = _cedar(
    "cedarCreek.archiv",
    "Cedar Creek, Archiv",
    60,
    (
        (
            Stimme("klavier", "wiegen", 0.55, -0.1, 0.4, -1, 34),
            Stimme("cello", "bass_grund", 0.6, 0.0, 0.4, 1, 42),
        ),
        _klavier(48, 0.4),
        _cello(40, 0.55),
    ),
    "Feierlich, ein einzelner Lichtkegel: Klavier, darunter tiefes Cello.",
)

# Clubkampf: Steigerung des Kampfthemas von Akt 1, in d-Moll, ohne Schlagzeug; die Uhr tickt.
_KAMPF_STIMMEN, _KAMPF_SPUREN = mit_spuren(
    (
        Stimme("kontrabass_pizz", "bass_laufend", 0.85, 0.0, 0.1, 1, 72),
        Stimme("klavier", "stoss", 0.6, -0.2, 0.15, staerke=60),
        Stimme("schlagwerk", "uhr", 0.5, 0.35, 0.2, staerke=62),
    ),
    (
        Stimme("klavier", "melodie", 0.8, 0.15, 0.2, MELODIE_OKTAVE, 70, KAMPF_MELODIE),
        Stimme("cello", "melodie", 0.75 * GEGEN_ANHEBUNG, 0.1, 0.2, 1, 66, nur("b")),
    ),
    (Stimme("violinen", "melodie", 0.6, 0.0, 0.2, MELODIE_OKTAVE, 64),),
)
CEDAR_CREEK_CLUBKAMPF = Satz(
    "cedarCreek.clubkampf",
    "Cedar Creek, Clubkampf",
    TONART,
    138,
    4,
    KAMPF_TEILE,
    KAMPF_FORM,
    _KAMPF_STIMMEN,
    spuren=_KAMPF_SPUREN,
    zusatz="steigerung",
    beschreibung="Steigerung des Kampfthemas: Klavier und Bass treiben, die Turmuhr tickt, Streicher dazu.",
)

CEDAR_CREEK_STEG = Satz(
    "cedarCreek.steg",
    "Abend am Steg",
    TONART,
    60,
    4,
    {
        "vor": VOR,
        "a": A,
        "a2": _mit(A2, ambrose=AMBROSE_STEG),
        "b": B,
        "a3": _mit(A_OFFEN, ambrose=AMBROSE_STEG),
    },
    # Ohne Vorspiel: Als Schleife setzte das leise Vorspiel die Naht 10 LU herab (A0.6).
    ("a", "a2", "b", "a3"),
    (
        Stimme("klavier", "melodie", 0.8, 0.1, 0.35, MELODIE_OKTAVE, 50, nur("a", "a2", "a3")),
        Stimme("klavier", "melodie", 0.7 * GEGEN_ANHEBUNG, -0.05, 0.35, 0, 46, nur("b")),
        Stimme("klavier", "wiegen", 0.6, -0.1, 0.35, -1, 34),
        Stimme("klavier_alt", "noten", 0.6, -0.3, 0.45, 1, 50, nur("a2", "a3"), "ambrose"),
        Stimme("cello", "bass_grund", 0.6, 0.05, 0.35, 1, 42, nur("a2", "b", "a3")),
    ),
    beschreibung="Leise, entschlossen: das Thema von Cedar Creek und Ambroses Kopf zum ersten Mal zusammen.",
)

STUECKE = (
    CEDAR_CREEK,
    CEDAR_CREEK_NACHT,
    CEDAR_CREEK_BIBLIOTHEK,
    CEDAR_CREEK_ARCHIV,
    CEDAR_CREEK_CLUBKAMPF,
    CEDAR_CREEK_STEG,
)
