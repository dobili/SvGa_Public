"""Akt 3, Fähre und Port Delacroix: Fähre, Trauer, Ortsthema, Miss Odile, Benefiz, Remys Mauer, Céleste.

Warum: Port Delacroix ist, wo Ambroses Thema herkommt (Klangplan A1, „Herkunft“). Das Ortsthema ist
darum Miss Odiles Lied (5 – 6 – 1' – 6 – 5 – 3 – 2 – 1, pentatonisch, ohne 4 und 7), in G-Dur, so
dass seine erste Note dieselbe ist wie die 5, die Ambroses Vater stimmt (``stimmton``). Eine Hand
je Ort (Grundsatz 2): Die Trauer ist das Lied auf einer einzelnen Trompete, langsam; das Ortsthema
dasselbe Lied als Tanz, ohne Übergang danach (Klangplan 3A1); das Benefiz noch schneller mit
Klatschen der Halle. Seit der Umstellung auf A0 (Etappe Akt 3, 22.11.2026) ist der Anfang des Lieds
(D E G' | E D) der Kopf des Ortsthemas, Form A A' B A' offen, drei Spuren (Zusatz: die Klarinette in
den Lücken), dazu Nacht und drinnen. Die Fähre hat einen eigenen langsamen Walzer in D-Dur mit dem
Kopf D E Fis | H A.

Ersatz (fehlt in den freien Bibliotheken): Banjo ist der gezupfte Strumstick, das Waschbrett die
Schellen in Achteln, das Akkordeon der Fähre die Mundharmonika (Melodie, auch ein Zungeninstrument)
und die Zugriegelorgel im Walzermuster (linke Hand), Miss Odiles Stimme die Klarinette in tiefer
Lage, die geriebene Pauke bei Remy der gestrichene Kontrabass. Céleste hört über Kopfhörer, darum
das Klangbild „lautsprecher“. Das Hämmern aus den Häusern, Wellen und Möwen sind Geräusche (Teil B).
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.maple import GEGEN_ANHEBUNG, mit_spuren

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


def _schluchzen(melodie: str) -> str:
    """Lange Töne (vier Schläge) mit einem leisen zweiten Ansatz auf dem letzten Schlag.

    Warum: Allein auf der Trompete verklang jeder lange Schlusston bis in die Stille; die Schleife
    schwankte um 6 bis 8 LU (A0.6). Der zweite Ansatz klingt wie ein Schluchzen und passt zu „wund“.
    Beispiel: „1:4“ wird „1:3 1:1“.
    """
    return " ".join(
        f"{z.split(':')[0]}:3 {z.split(':')[0]}:1" if z.endswith(":4") else z for z in melodie.split()
    )


PORT_DELACROIX_TRAUER = Satz(
    "portDelacroix.trauer",
    "Port Delacroix, Trauer",
    TONART,
    # 64 statt 56: Die langen Töne der Trompete verklangen sonst bis in die Stille (LRA, A0.6).
    64,
    4,
    {"a": Teil(NICHTS, _schluchzen(ODILE)), "a2": Teil(NICHTS, _schluchzen(ODILE_OFFEN))},
    # Ohne die stillen Atemtakte: Mit ihnen fiel die Schleife an der Naht ins Leere (52 LU) und
    # schwankte um 8 LU (A0.6); der Hall der Trompete lässt genug Luft zwischen den Strophen.
    ("a", "a2"),
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

# --- Ortsthema (A0, Etappe Akt 3): der Anfang des Lieds als Kopf, im Tanzrhythmus ---
# Kopf D E G' | E D: die ersten vier Töne von Miss Odiles Lied; der Quartsprung zum hohen G ist das
# Kennzeichen, die Lücken füllt die Klarinette.
KOPF = "5:3/2 6:1/2 1':3/2 r:1/2 | 6:3/2 5:2 r:1/2"
A = Teil("I | IV I | vi | V", f"{KOPF} | 3:3/2 2:2 r:1/2 | 2:2 5,:2")
A2 = Teil("I | IV I | ii V | I", f"{KOPF} | 5:1 3:1 2:3/2 r:1/2 | 1:2 r:2")
# Letzter Takt in Vierteln zurück zum Kopf (Naht der Schleife, A0.6).
A_OFFEN = Teil("I | IV I | ii | V7", f"{KOPF} | 5:1 3:1 2:3/2 r:1/2 | 2:1 3:1 5,:1 2:1")
# B: Die Trompete schweigt, die Klarinette singt die Brücke (als Melodie des Teils), endet auf V.
B = Teil(
    "IV | I | V | I | IV | IV I | ii | V",
    "1':2 6:1 5:1 | 3:1 6:1 5:2 | 5:2 2:1 3:1 | 1:4 | 6:1 1':1 6:1 5:1 | 6:2 5:2 | 2:1 5:1 2:1 1:1 | 2:4",
)
# Füllstimme der Klarinette in den Lücken der Trompete (Farbe, Zusatzspur).
FUELLUNG = {
    "a": "r:2 3:1 2:1 | 1:2 3:2 | 6,:2 5,:2 | r:2 3:1/2 5:1/2 6:1/2 1':1/2",
    "a2": "r:2 3:1 2:1 | 4:2 6,:2 | 5,:2 7,:2 | r:2 5:1/2 3:1/2 2:1/2 1:1/2",
    "b": "r:4 | r:4 | r:4 | r:2 3:1 5:1 | r:4 | r:4 | r:4 | r:2 7,:1 2:1",
    "a3": "r:2 3:1 2:1 | 4:2 6,:2 | 5,:2 7,:2 | r:4",
}
TEILE = {
    name: Teil(t.akkorde, t.melodie, {"klar": FUELLUNG[name]})
    for name, t in (("a", A), ("a2", A2), ("b", B), ("a3", A_OFFEN))
}
FORM = ("a", "a2", "b", "a3")
MELODIE_TEILE = nur("a", "a2", "a3")


def _band(rhythmus: str, puls: float) -> tuple[Stimme, ...]:
    """Grund von Port Delacroix: Banjo, Tuba, Waschbrett, dazu ein Puls (Marsch oder Klatschen)."""
    return (
        Stimme("strumstick", "schlagen", 0.7, -0.35, 0.2, 0, 46),
        Stimme("tuba", "bass_zweier", 0.7, 0.0, 0.15, 1, 58),
        Stimme("schlagwerk", "schellen", 0.35, 0.3, 0.15, staerke=50),
        Stimme("schlagwerk", rhythmus, puls, 0.1, 0.2, staerke=42),
    )


def _melodie(instrument: str, staerke: int, hall: float = 0.25) -> tuple[Stimme, ...]:
    """Melodie in A (Trompete oder Klarinette), die Klarinette singt die Brücke (lauter, A0.6)."""
    return (
        Stimme(instrument, "melodie", 0.85, 0.15, hall, 0, staerke, MELODIE_TEILE),
        Stimme("klarinette", "melodie", 0.7 * GEGEN_ANHEBUNG, -0.2, hall, OBEN, staerke - 6, nur("b")),
    )


KLARINETTE = (Stimme("klarinette", "noten", 0.5, -0.2, 0.25, 0, 48, kennung="klar"),)


def _delacroix(kennung: str, titel: str, tempo: float, spuren: tuple, text: str) -> Satz:
    """Eine Fassung des Ortsthemas in drei Spuren."""
    stimmen, gruppen = mit_spuren(*spuren)
    return Satz(
        kennung,
        titel,
        TONART,
        tempo,
        4,
        TEILE,
        FORM,
        stimmen,
        akt=AKT,
        spuren=gruppen,
        zusatz="farbe",
        beschreibung=text,
    )


PORT_DELACROIX = _delacroix(
    "portDelacroix",
    "Port Delacroix",
    116,
    (_band("marsch", 0.3), _melodie("trompete", 64), KLARINETTE),
    "Trotzig, tanzend: Miss Odiles Lied als Tanz: Trompete, Klarinette, Banjo, Waschbrett.",
)
PORT_DELACROIX_NACHT = _delacroix(
    "portDelacroix.nacht",
    "Port Delacroix, Nacht",
    84,
    (
        (
            Stimme("strumstick", "zupfen", 0.6, -0.3, 0.3, 0, 40),
            Stimme("tuba", "bass_grund", 0.6, 0.0, 0.25, 1, 50),
        ),
        _melodie("trompete_gedaempft", 56, 0.35),
        KLARINETTE,
    ),
    "Nacht: das Lied langsam, gedämpfte Trompete, das Banjo gezupft, die Tuba hält.",
)
# Innen (Turnhalle, Musikhaus): das Klavier statt der Straßenband, die Klarinette singt.
PORT_DELACROIX_INNEN = _delacroix(
    "portDelacroix.innen",
    "Port Delacroix, drinnen",
    100,
    (
        (
            Stimme("klavier", "stride", 0.7, -0.15, 0.3, 0, 46),
            Stimme("tuba", "bass_zweier", 0.5, 0.0, 0.25, 1, 50),
        ),
        _melodie("klarinette", 58, 0.3),
        (Stimme("strumstick", "zupfen", 0.45, 0.3, 0.3, 0, 40),),
    ),
    "Drinnen: das Lied auf Klavier und Klarinette, leise das Banjo.",
)
ODILE_TANZ = Satz(
    "odile.tanz",
    "Miss Odile, Tanz",
    TONART,
    132,
    4,
    TEILE,
    FORM,
    (*_band("klatschen", 0.4), *_melodie("trompete", 66), *KLARINETTE),
    akt=AKT,
    beschreibung="Fest: Miss Odiles Lied schnell, Remys Trompete vorn, die Halle klatscht.",
)

# --- Fähre (Kap. 35): langsamer Walzer in D-Dur, weit und salzig ---
# Kopf D E Fis | H A: drei Schritte hinauf, der Quartsprung zur Sexte ist das Kennzeichen.
FAEHRE_KOPF = "1:1 2:1 3:1 | 6:2 5:1"
FAEHRE_A = Teil("I | I | IV | V", f"{FAEHRE_KOPF} | 4:1 3:1 2:1 | 2:3")
FAEHRE_A2 = Teil("I | I | IV V | I", f"{FAEHRE_KOPF} | 4:1 3:1 2:1 | 1:3")
FAEHRE_OFFEN = Teil("I | I | ii | V7", f"{FAEHRE_KOPF} | 4:1 3:1 2:1 | 5,:1 6,:1 7,:1")
# B: Die Mundharmonika schweigt, die Gitarre antwortet (als Melodie des Teils), endet auf V7.
FAEHRE_B = Teil(
    "vi | vi | IV | I | ii | ii | V | V7",
    "6:2 7:1 | 1':2 6:1 | 6:2 5:1 | 3:3 | 2:2 3:1 | 4:2 6:1 | 5:3 | 4:2 2:1",
)
FAEHRE_TEILE = {"a": FAEHRE_A, "a2": FAEHRE_A2, "b": FAEHRE_B, "a3": FAEHRE_OFFEN}
_FAEHRE_STIMMEN, _FAEHRE_SPUREN = mit_spuren(
    (
        Stimme("hammond", "walzer", 0.6, -0.2, 0.4, 0, 36),
        Stimme("kontrabass_pizz", "bass_grund", 0.55, 0.0, 0.3, 1, 46),
    ),
    (
        Stimme("mundharmonika", "melodie", 0.75, 0.2, 0.4, OBEN, 56, MELODIE_TEILE),
        Stimme("gitarre", "melodie", 0.7 * GEGEN_ANHEBUNG, 0.25, 0.35, OBEN, 52, nur("b")),
    ),
    (Stimme("gitarre", "zupfen", 0.5, -0.3, 0.35, 0, 36),),
)
FAEHRE = Satz(
    "faehre",
    "Fähre",
    "D",
    84,
    3,
    FAEHRE_TEILE,
    FORM,
    _FAEHRE_STIMMEN,
    akt=AKT,
    spuren=_FAEHRE_SPUREN,
    zusatz="farbe",
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

STUECKE = (
    FAEHRE,
    PORT_DELACROIX_TRAUER,
    PORT_DELACROIX,
    PORT_DELACROIX_NACHT,
    PORT_DELACROIX_INNEN,
    ODILE_SINGT,
    ODILE_TANZ,
    REMY_MAUER,
    CELESTE,
)
