"""Akt 3, Fähre und Port Delacroix: Fähre, Trauer, Ortsthema, Miss Odile, Benefiz, Remys Mauer, Céleste.

Warum: Port Delacroix ist, wo Ambroses Thema herkommt (Klangplan A1, „Herkunft“). Das Ortsthema ist
darum Miss Odiles Lied (5 – 6 – 1' – 6 – 5 – 3 – 2 – 1, pentatonisch, ohne 4 und 7), in G-Dur, so
dass seine erste Note dieselbe ist wie die 5, die Ambroses Vater stimmt (``stimmton``). Eine Hand
je Ort (Grundsatz 2): Die Trauer ist das Lied auf einer einzelnen Trompete, langsam; das Ortsthema
dasselbe Lied als Tanz, ohne Übergang danach (Klangplan 3A1); das Benefiz noch schneller mit
Klatschen der Halle. Die Fähre hat einen eigenen langsamen Walzer in D-Dur.

Ersatz (fehlt in den freien Bibliotheken): Banjo ist der gezupfte Strumstick, das Waschbrett die
Schellen in Achteln, das Akkordeon der Fähre die Mundharmonika (Melodie, auch ein Zungeninstrument)
und die Zugriegelorgel im Walzermuster (linke Hand), Miss Odiles Stimme die Klarinette in tiefer
Lage, die geriebene Pauke bei Remy der gestrichene Kontrabass. Céleste hört über Kopfhörer, darum
das Klangbild „lautsprecher“. Das Hämmern aus den Häusern, Wellen und Möwen sind Geräusche (Teil B).
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil

TONART = "G"
OBEN = 1
AKT = 3


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


# --- Miss Odiles Lied (A1): die ersten vier Takte sind das Motiv, die zweiten antworten ---
ODILE_AKKORDE = "I | IV I | vi V | I | I | ii | V | I"
ODILE = "5:2 6:1 1':1 | 6:2 5:2 | 3:2 2:2 | 1:4 | 5:2 6:1 1':1 | 2':1 1':1 6:2 | 5:1 3:1 2:2 | 1:4"
# Die zweite Strophe der Trauer endet offen auf der 5.
ODILE_OFFEN = "5:2 6:1 1':1 | 2':2 1':2 | 6:2 5:2 | 3:4 | 5:2 6:1 1':1 | 6:2 5:1 3:1 | 2:2 3:1 2:1 | 5:4"
NICHTS = "N.C. | N.C. | N.C. | N.C. | N.C. | N.C. | N.C. | N.C."
STILLE = Teil("N.C. | N.C.")

PORT_DELACROIX_TRAUER = Satz(
    "portDelacroix.trauer",
    "Port Delacroix, Trauer",
    TONART,
    56,
    4,
    {"a": Teil(NICHTS, ODILE), "atem": STILLE, "a2": Teil(NICHTS, ODILE_OFFEN)},
    ("a", "atem", "a2", "atem"),
    (Stimme("trompete", "melodie", 0.85, 0.0, 0.5, 0, 50),),
    akt=AKT,
    beschreibung="Wund: Miss Odiles Lied auf einer einzelnen Trompete, langsam, ohne Begleitung.",
)

ODILE_SINGT = Satz(
    "odile",
    "Miss Odile",
    TONART,
    60,
    4,
    {"lied": Teil(NICHTS, ODILE), "summen": Teil("N.C. | N.C.", "5:2 6:1 1':1 | 6:2 r:2")},
    ("lied", "summen"),
    (Stimme("klarinette", "melodie", 0.8, 0.0, 0.45, 0, 46),),
    schleife=False,
    akt=AKT,
    beschreibung="Alt, einfach: Miss Odiles Lied, eine Stimme ohne Begleitung; das Summen bricht ab.",
)

# --- Das Lied als Tanz: Trompete mit Lücken, die Klarinette füllt sie ---
TANZ = (
    "5:1.5 6:0.5 1':1.5 r:0.5 | 6:1.5 5:2 r:0.5 | 3:1.5 2:2 r:0.5 | 1:2 r:2 | "
    "5:1.5 6:0.5 1':1.5 r:0.5 | 2':1.5 1':0.5 6:2 | 5:1 3:1 2:1.5 r:0.5 | 1:2 r:2"
)
KLARINETTE = (
    "r:2 3:1 2:1 | 1:2 3:2 | 6,:2 5,:2 | r:2 3:0.5 5:0.5 6:0.5 1':0.5 | "
    "r:2 3:1 2:1 | 4:2 6,:2 | 5,:2 7,:2 | r:2 5:0.5 3:0.5 2:0.5 1:0.5"
)
BRUECKE = Teil(
    "IV | I | V | I | IV | IV I | ii | V",
    "1':2 6:1 5:1 | 3:1 6:1 5:2 | 5:2 2:1 3:1 | 1:4 | 6:1 1':1 6:1 5:1 | 6:2 5:2 | 2:1 5:1 2:1 1:1 | 2:4",
)
DELACROIX_TEILE = {
    "vor": Teil("I | V"),
    "a": Teil(ODILE_AKKORDE, TANZ, {"klar": KLARINETTE}),
    "b": BRUECKE,
    "b2": BRUECKE,
}
TROMPETE = nur("a", "b")


def _band(rhythmus: str) -> tuple[Stimme, ...]:
    """Die Besetzung von Port Delacroix: Trompete, Klarinette, Banjo, Tuba, Waschbrett, dazu ein Puls."""
    return (
        Stimme("trompete", "melodie", 0.85, 0.15, 0.25, 0, 64, TROMPETE),
        Stimme("klarinette", "melodie", 0.7, -0.2, 0.25, OBEN, 58, nur("b2")),
        Stimme("klarinette", "noten", 0.55, -0.2, 0.25, 0, 50, nur("a"), "klar"),
        Stimme("strumstick", "schlagen", 0.7, -0.35, 0.2, 0, 46),
        Stimme("tuba", "bass_zweier", 0.7, 0.0, 0.15, 1, 58),
        Stimme("schlagwerk", "schellen", 0.35, 0.3, 0.15, staerke=50),
        Stimme("schlagwerk", rhythmus, 0.3, 0.1, 0.2, staerke=42),
    )


PORT_DELACROIX = Satz(
    "portDelacroix",
    "Port Delacroix",
    TONART,
    116,
    4,
    DELACROIX_TEILE,
    ("vor", "a", "b", "a", "b2", "a"),
    _band("marsch"),
    akt=AKT,
    beschreibung="Trotzig, tanzend: Miss Odiles Lied als Tanz: Trompete, Klarinette, Banjo, Waschbrett.",
)

ODILE_TANZ = Satz(
    "odile.tanz",
    "Miss Odile, Tanz",
    TONART,
    132,
    4,
    DELACROIX_TEILE,
    ("vor", "a", "b", "a", "b2"),
    _band("klatschen"),
    akt=AKT,
    beschreibung="Fest: Miss Odiles Lied schnell, Remys Trompete vorn, die Halle klatscht.",
)

# --- Fähre (Kap. 35): langsamer Walzer in D-Dur, weit und salzig ---
FAEHRE_A = Teil(
    "I | I | IV | I | vi | ii | V | V",
    "3:2 5:1 | 5:2 3:1 | 4:2 6:1 | 5:3 | 6:2 5:1 | 4:2 2:1 | 2:3 | r:2 1:1",
)
FAEHRE_A2 = Teil(
    "I | I | IV | I | vi | IV V | I | I",
    "3:2 5:1 | 5:2 3:1 | 4:2 6:1 | 1':3 | 1':2 7:1 | 6:1.5 5:1.5 | 3:2 2:1 | 1:3",
)
FAEHRE_B = Teil(
    "vi | vi | IV | I | ii | ii | V | V7",
    "6:2 7:1 | 1':2 6:1 | 6:2 5:1 | 3:3 | 2:2 3:1 | 4:2 6:1 | 5:3 | 4:2 r:1",
)
FAEHRE_B2 = Teil(
    "vi | vi | IV | I | ii | IV | V | V7",
    "6:2 7:1 | 1':2 6:1 | 6:2 5:1 | 3:3 | 2:2 3:1 | 4:2 6:1 | 5:2 6:1 | 5:2 r:1",
)
FAEHRE = Satz(
    "faehre",
    "Fähre",
    "D",
    84,
    3,
    {"vor": Teil("I | IV | I | V"), "a": FAEHRE_A, "a2": FAEHRE_A2, "b": FAEHRE_B, "b2": FAEHRE_B2},
    ("vor", "a", "a2", "b", "b2", "a", "a2", "vor"),
    (
        Stimme("mundharmonika", "melodie", 0.7, 0.2, 0.4, OBEN, 54, nur("a", "a2")),
        Stimme("gitarre", "melodie", 0.75, 0.25, 0.35, OBEN, 54, nur("b", "b2")),
        Stimme("hammond", "walzer", 0.6, -0.2, 0.4, 0, 36),
        Stimme("gitarre", "zupfen", 0.7, -0.3, 0.35, 0, 36, nur("vor", "a", "a2")),
    ),
    akt=AKT,
    beschreibung="Weit, salzig: ein langsamer Walzer, Akkordeon und Gitarre teilen sich die Melodie.",
)

# --- Remys Mauer (Kap. 36): tiefe Töne kommen chromatisch näher, immer lauter ---
MAUER_TEILE = {
    "t1": Teil("i | bII | V | i", "1:4 | b2:4 | 2:4 | 3:4"),
    "t2": Teil("I | iv | #iv°", "#3:4 | 4:4 | #4:4"),
    "t3": Teil("V | V7 | V", "5:2 5:2 | 5:2 5:2 | 5:1 5:1 5:1 5:1"),
}
REMY_MAUER = Satz(
    "remy.mauer",
    "Remys Mauer",
    "g",
    60,
    4,
    MAUER_TEILE,
    ("t1", "t2", "t3"),
    (
        Stimme("posaune", "melodie", 0.7, 0.1, 0.3, -1, 40, nur("t1")),
        Stimme("posaune", "melodie", 0.8, 0.1, 0.3, -1, 56, nur("t2")),
        Stimme("posaune", "melodie", 0.9, 0.1, 0.3, -1, 72, nur("t3")),
        Stimme("horn", "halten", 0.6, -0.2, 0.35, -1, 50, nur("t2", "t3")),
        Stimme("tuba", "bass_grund", 0.7, 0.0, 0.25, 1, 50),
        Stimme("kontrabass", "bass_grund", 0.6, 0.0, 0.3, 0, 46),
    ),
    akt=AKT,
    beschreibung="Druck: tiefe Bläser steigen in Halbtönen, Bass wie eine geriebene Pauke, immer lauter.",
)

# --- Céleste (Kap. 40): ein leichter Beat aus Kopfhörern, in G, stört das verstimmte Klavier nicht ---
CELESTE_HAKEN = "3:1.5 2:0.5 1:2 | 1:1 6,:1 1:2 | 3:1.5 2:0.5 5:2 | 2:3 r:1"
CELESTE = Satz(
    "celeste",
    "Céleste",
    TONART,
    96,
    4,
    {"c1": Teil("vi | IV | I | V"), "c2": Teil("vi | IV | I | V", CELESTE_HAKEN)},
    ("c1", "c2", "c2"),
    (
        Stimme("egitarre", "melodie", 0.6, 0.2, 0.2, OBEN, 50, nur("c2")),
        Stimme("digitalpiano", "tupfen", 0.5, -0.2, 0.2, 0, 40),
        Stimme("ebass", "bass_wechsel", 0.6, 0.0, 0.1, 1, 52),
        Stimme("schlagwerk", "schlagzeug", 0.45, 0.0, 0.1, staerke=50),
    ),
    akt=AKT,
    pegel_db=-8.0,
    klangbild="lautsprecher",
    beschreibung="Heute: ein leichter Beat aus Célestes Kopfhörern, leise und klein.",
)

STUECKE = (FAEHRE, PORT_DELACROIX_TRAUER, PORT_DELACROIX, ODILE_SINGT, ODILE_TANZ, REMY_MAUER, CELESTE)
