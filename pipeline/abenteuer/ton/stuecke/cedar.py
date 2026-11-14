"""Cedar Creek: das Ortsthema in d-Moll und seine Fassungen (Klangplan A2, Akt 1).

Warum: Cedar Creek ist still und forschend; das Thema ist eine Umkehrung von Ambroses Kopf in langen
Noten (1 – 3 – 2 – 4 – 5, Klangplan A1, „Ortsthemen“). Klavier allein mit langen Pausen, kein
Schlagzeug (Ortsblatt „Nicht hier“); den Puls gibt höchstens die Turmuhr. Am Steg (Kapitel 16)
klingen Ambroses Kopf und das Thema von Cedar Creek zum ersten Mal zusammen.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil

TONART = "d"
MELODIE_OKTAVE = 1

A = Teil(
    "i | i | iv | V | VI | i | V | i",
    "1:2 3:2 | 2:3 r:1 | 4:2 5:2 | 5:3 r:1 | 6:2 5:1 4:1 | 3:3 r:1 | 2:2 #7,:2 | 1:4",
)
A2 = Teil(
    "i | i | iv | i | iv | i | V | V",
    "1:2 3:2 | 5:3 r:1 | 6:2 5:1 4:1 | 3:3 r:1 | 4:2 3:1 2:1 | 1:2 r:2 | 2:3 r:1 | #7,:4",
)
B = Teil(
    "III | VII | VI | III | iv | i | V | i",
    "5:2 6:1 5:1 | 4:2 3:2 | 6:3 r:1 | 5:4 | 4:2 6:2 | 5:2 3:2 | 2:2 4:1 2:1 | 1:4",
)
VOR = Teil("i | i")
ATEM = Teil("i | VI")
# Ambroses Kopf in d-Moll (A – F – Gis – E), lang, als Gegenstimme am Steg.
AMBROSE_STEG = "r:4 | 5:2 3:2 | #4:2 2:2 | r:4 | 5:2 3:2 | #4:3 2:1 | 2:4 | r:4"
TEILE = {"vor": VOR, "a": A, "atem": ATEM, "a2": A2, "b": B}
FORM = ("vor", "a", "atem", "a2", "b")


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


def _klavier_allein(hall: float, staerke: int) -> tuple[Stimme, ...]:
    """Rechte Hand singt, linke Hand wiegt in Vierteln (Klavier allein)."""
    return (
        Stimme("klavier", "melodie", 0.8, 0.1, hall, MELODIE_OKTAVE, staerke + 6, nur("a", "a2", "b")),
        Stimme("klavier", "wiegen", 0.7, -0.1, hall, -1, staerke - 12),
    )


CEDAR_CREEK = Satz(
    "cedarCreek",
    "Cedar Creek",
    TONART,
    63,
    4,
    TEILE,
    FORM,
    _klavier_allein(0.35, 46),
    beschreibung="Still, forschend: Klavier allein, das Thema kehrt Ambroses Kopf um.",
)

CEDAR_CREEK_BIBLIOTHEK = Satz(
    "cedarCreek.bibliothek",
    "Cedar Creek, Bibliothek",
    TONART,
    63,
    4,
    TEILE,
    FORM,
    _klavier_allein(0.55, 38),
    pegel_db=-4.0,
    beschreibung="Gedämpft, feierlich: dasselbe Klavier, leiser, mit Hall wie in einem hohen Raum.",
)

CEDAR_CREEK_ARCHIV = Satz(
    "cedarCreek.archiv",
    "Cedar Creek, Archiv",
    TONART,
    56,
    4,
    TEILE,
    FORM,
    (*_klavier_allein(0.4, 42), Stimme("cello", "bass_grund", 0.7, 0.0, 0.4, 1, 44)),
    beschreibung="Feierlich, ein einzelner Lichtkegel: Klavier von Cedar Creek, darunter tiefes Cello.",
)

# Clubkampf: der Anfang des Themas in Bruchstücken, gezupfter Bass, die Turmuhr tickt.
KAMPF = Teil(
    "i | iv | V | i | i | iv | VI | V", "1:2 3:2 | r:4 | 2:3 r:1 | r:4 | 1:2 3:2 | 4:2 5:2 | 6:3 r:1 | #7,:4"
)

CEDAR_CREEK_CLUBKAMPF = Satz(
    "cedarCreek.clubkampf",
    "Cedar Creek, Clubkampf",
    TONART,
    72,
    4,
    {"k": KAMPF, "ruhe": Teil("i | VI | iv | V")},
    ("k", "ruhe", "k", "ruhe"),
    (
        Stimme("klavier", "melodie", 0.75, 0.15, 0.3, MELODIE_OKTAVE, 48, nur("k")),
        Stimme("klavier", "halten", 0.6, -0.15, 0.3, 0, 34),
        Stimme("kontrabass_pizz", "bass_wechsel", 0.8, 0.0, 0.2, 1, 56),
        Stimme("schlagwerk", "uhr", 0.5, 0.35, 0.3, staerke=60),
    ),
    beschreibung="Still gespannt: Klavier und gezupfter Kontrabass, sparsam, kein Schlagwerk außer der Uhr.",
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
        "a2": Teil(A2.akkorde, A2.melodie, {"ambrose": AMBROSE_STEG}),
        "b": B,
        "a3": Teil(A.akkorde, A.melodie, {"ambrose": AMBROSE_STEG}),
    },
    ("vor", "a", "a2", "b", "a3"),
    (
        *_klavier_allein(0.35, 44),
        Stimme("klavier_alt", "noten", 0.75, -0.3, 0.45, 1, 50, nur("a2", "a3"), "ambrose"),
        Stimme("cello", "bass_grund", 0.6, 0.05, 0.35, 1, 42, nur("a2", "b", "a3")),
    ),
    beschreibung="Leise, entschlossen: Klavier von Cedar Creek und Ambroses Kopf zum ersten Mal zusammen.",
)

STUECKE = (CEDAR_CREEK, CEDAR_CREEK_BIBLIOTHEK, CEDAR_CREEK_ARCHIV, CEDAR_CREEK_CLUBKAMPF, CEDAR_CREEK_STEG)
