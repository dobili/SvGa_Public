"""Maple Falls: das einprägsame Ortsthema und seine Fassungen (Klangplan A0, A0.1, A0.6; Akt 1).

Warum: Der Autor hat die einprägsamen Ortsthemen freigegeben (22.11.2026: „Die Melodien sind alle
super, gerne so einbauen“). Das Thema von Maple Falls ist der Kopf von Akt 1:

- Kopf (2 Takte, singbar): G A H D | G' E D. Mamas Kopf (1 – 2 – 3 – 5, Leitmotiv A1) steigt,
  dann der Quartsprung D–G' als Kennzeichen, punktiert, und fällt zurück.
- Form A (Kopf, Kopf variiert, Halbschluss), A' (Ganzschluss), B (die Melodie schweigt, eine
  Gegenstimme antwortet tief, endet auf der Dominante), A' offen (V V7 zurück zum Anfang).
- Jede Fassung ist dieselbe Melodie in anderer Besetzung und anderem Tempo, in drei Spuren:
  grund (Begleitung, Bass), melodie (Melodie und Gegenstimme), zusatz (Farbe oder Steigerung).
- Der Clubkampf ist das Kampfthema von Akt 1: derselbe Kopf in e-Moll, in Achteln geschärft,
  132; Zusatzspur ist die Steigerung (Horn) für den nächsten Sieg. Der Clubkampf in Cedar Creek
  (cedar.py) ist die Steigerung davon.

Die Teile tragen die alten Namen (vor, a1 … a6, b), weil spätere Akte sie mitbenutzen
(akt2_wege, akt3_desert, akt3_silicon, ambrose1); so klingt dort künftig das neue Thema an.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil

TONART = "G"
# Die Melodie liegt eine Oktave über der kleinen Oktave (G4 = Stufe 1).
MELODIE_OKTAVE = 1
# Die Gegenstimme im B-Teil etwa 5 dB lauter, damit B höchstens 3 LU unter A liegt (A0.6).
GEGEN_ANHEBUNG = 1.8

KOPF = "1:1 2:1 3:1 5:1 | 1':3/2 6:1/2 5:2"
A = Teil("I | IV | I | IV V", f"{KOPF} | 1:1 2:1 3:1 5:1 | 6:3/2 5:1/2 2:2")
A2 = Teil("I | IV | ii V | I", f"{KOPF} | 6:1 5:1 3:1 2:1 | 1:4")
# Letzter Takt läuft in Vierteln abwärts zurück zum Anfang (D C H A über V V7): Die Naht der Schleife
# bleibt gleich laut (A0.6), die Melodie führt hörbar zum Kopf.
A_OFFEN = Teil("I | IV | ii | V V7", f"{KOPF} | 6:1 5:1 3:1 2:1 | 5:1 4:1 3:1 2:1")
# B: Die Gegenstimme steht als Melodie des Teils (spätere Akte spielen sie so mit).
B = Teil(
    "vi | IV | I | V | vi | IV | ii | V7",
    "3:2 2:1 1:1 | 6,:4 | 1:2 3:2 | 2:4 | 3:2 2:1 1:1 | 6,:2 1:2 | 2:3 3:1 | 2:2 5,:2",
)
VORSPIEL = Teil("I | IV")
# Liegende Cello-Linie unter A und A' (zweiter Durchgang in späteren Akten).
CELLO_A = "3,:4 | 1,:4 | 3,:4 | 1,:2 2,:2"
CELLO_A2 = "3,:4 | 1,:4 | 1,:2 2,:2 | 3,:4"
CELLO_OFFEN = "3,:4 | 1,:4 | 1,:4 | 2,:2 4,:2"
# Farbstimme (Zusatzspur): eine Oberstimme aus Akkordtönen, im B-Teil führt sie.
FARBE = {
    "a1": "3:2 5:2 | 6:2 4:2 | 5:2 3:2 | 4:2 5:2",
    "a2": "3:2 5:2 | 6:2 4:2 | 6:2 7:2 | 1':4",
    "b": "3':2 1':2 | 6:2 4:2 | 5:2 3:2 | 2:4 | 3':2 1':2 | 6:2 1':2 | 6:3 5:1 | 4:2 2:2",
    "a6": "3:2 5:2 | 6:2 4:2 | 6:2 1':2 | 7:2 5:2",
}
FORM = ("a1", "a2", "b", "a6")
MELODIE_TEILE = frozenset({"a1", "a2", "a5", "a6"})


def _mit(teil: Teil, **linien: str) -> Teil:
    """Ein Teil mit weiteren eigenen Linien."""
    return Teil(teil.akkorde, teil.melodie, {**teil.linien, **linien})


def teile() -> dict[str, Teil]:
    """Die Teile mit Cello und Farbe; a3/a4 wie a1/a2 mit Cello (für spätere Akte)."""
    return {
        "vor": VORSPIEL,
        "a1": _mit(A, farbe=FARBE["a1"], cello=CELLO_A),
        "a2": _mit(A2, farbe=FARBE["a2"], cello=CELLO_A2),
        "a3": _mit(A, cello=CELLO_A),
        "a4": _mit(A2, cello=CELLO_A2),
        "b": _mit(B, farbe=FARBE["b"]),
        "a5": A,
        "a6": _mit(A_OFFEN, farbe=FARBE["a6"], cello=CELLO_OFFEN),
    }


def nur(*namen: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(namen)


def mit_spuren(
    grund: tuple[Stimme, ...], melodie: tuple[Stimme, ...], zusatz: tuple[Stimme, ...]
) -> tuple[tuple[Stimme, ...], dict[str, tuple[int, ...]]]:
    """Stimmen in der Reihenfolge der Spuren und die Spuren als Indizes (Satz.spuren)."""
    stimmen = (*grund, *melodie, *zusatz)
    erste = len(grund)
    zweite = erste + len(melodie)
    spuren = {
        "grund": tuple(range(erste)),
        "melodie": tuple(range(erste, zweite)),
        "zusatz": tuple(range(zweite, len(stimmen))),
    }
    return stimmen, spuren


def _fassung(
    kennung: str,
    titel: str,
    tempo: float,
    spuren: tuple[tuple[Stimme, ...], tuple[Stimme, ...], tuple[Stimme, ...]],
    text: str,
    zusatz: str = "farbe",
) -> Satz:
    """Eine Fassung des Themas: dieselben Teile und Form, andere Besetzung, drei Spuren."""
    stimmen, gruppen = mit_spuren(*spuren)
    return Satz(
        kennung,
        titel,
        TONART,
        tempo,
        4,
        teile(),
        FORM,
        stimmen,
        spuren=gruppen,
        zusatz=zusatz,
        beschreibung=text,
    )


def _melodie(instrument: str, staerke: int, b_instrument: str = "cello") -> tuple[Stimme, ...]:
    """Melodie in A, Gegenstimme in B (eine Oktave tiefer, lauter, A0.6)."""
    return (
        Stimme(instrument, "melodie", 0.8, 0.15, 0.3, MELODIE_OKTAVE, staerke, MELODIE_TEILE),
        Stimme(b_instrument, "melodie", 0.7 * GEGEN_ANHEBUNG, 0.1, 0.3, 0, staerke - 2, nur("b")),
    )


def _farbe(instrument: str, staerke: int, lautstaerke: float = 0.6) -> tuple[Stimme, ...]:
    """Die Farbstimme als Zusatzspur (Mono; die App verortet sie)."""
    return (Stimme(instrument, "noten", lautstaerke, 0.0, 0.3, 1, staerke, kennung="farbe"),)


MAPLE_FALLS = _fassung(
    "mapleFalls",
    "Maple Falls",
    96,
    (
        (
            Stimme("gitarre", "zupfen", 0.75, -0.3, 0.25, staerke=50),
            Stimme("kontrabass_pizz", "bass_grund", 0.6, 0.0, 0.2, 1, 52),
        ),
        _melodie("floete", 60),
        _farbe("geige", 56),
    ),
    "Warm, Spätsommer: die Flöte singt den Kopf über Gitarre und Bass, im B-Teil antwortet das Cello.",
)

MAPLE_FALLS_NACHT = _fassung(
    "mapleFalls.nacht",
    "Maple Falls, Nacht",
    72,
    (
        (Stimme("harfe", "harfe", 0.5, -0.2, 0.45, staerke=38),),
        _melodie("vibraphon", 44),
        (Stimme("cello", "halten", 0.4, 0.0, 0.4, -1, 36),),
    ),
    "Nacht: dieselbe Melodie langsamer, Vibraphon über Harfe, ein Cello liegt darunter.",
)

MAPLE_FALLS_INNEN = _fassung(
    "mapleFalls.innen",
    "Maple Falls, Haus",
    84,
    (
        (Stimme("klavier", "wiegen", 0.5, -0.1, 0.3, -1, 36),),
        _melodie("klavier", 48, "klavier"),
        _farbe("glockenspiel", 38, 0.4),
    ),
    "Im Haus: dieselbe Melodie, nur Klavier, leise; das Glockenspiel als Farbe.",
)

MAPLE_FALLS_CLUB = _fassung(
    "mapleFalls.club",
    "Maple Falls, Clubraum",
    104,
    (
        (
            Stimme("gitarre", "schlagen", 0.6, -0.35, 0.2, staerke=48),
            Stimme("kontrabass_pizz", "bass_wechsel", 0.65, 0.0, 0.15, 1, 54),
            Stimme("schlagwerk", "klatschen", 0.3, 0.3, 0.2, staerke=46),
        ),
        _melodie("mundharmonika", 60, "klavier"),
        (Stimme("klavier", "tupfen", 0.4, 0.25, 0.25, 0, 40),),
    ),
    "Munter, aufgenommen: Mundharmonika über geschlagener Gitarre, Klatschen auf 2 und 4.",
)

MAPLE_FALLS_LERNEN = _fassung(
    "mapleFalls.lernen",
    "Maple Falls, Lernen",
    92,
    (
        (
            Stimme("gitarre", "zupfen", 0.7, -0.3, 0.25, staerke=46),
            Stimme("klavier", "tupfen", 0.4, 0.2, 0.25, -1, 38),
        ),
        _melodie("klavier", 54, "klavier"),
        _farbe("glockenspiel", 40, 0.45),
    ),
    "Lernen als Spiel: Klavier singt, Gitarre zupft, das Glockenspiel spielt mit.",
)

# Kampfthema Akt 1: derselbe Kopf in e-Moll, in Achteln geschärft (E Fis G H | E' C H).
KAMPF_KOPF = "1:1/2 2:1/2 3:1/2 5:1/2 5:1 r:1 | 1':3/4 6:1/4 5:1 r:1/2 5:1/2 5:1"
KAMPF_A = Teil("i | VI | i | VI V", f"{KAMPF_KOPF} | 1:1/2 2:1/2 3:1/2 5:1/2 6:1 5:1 | 2:2 #7,:2")
KAMPF_A2 = Teil("i | VI | iv V | i", f"{KAMPF_KOPF} | 6:1/2 5:1/2 3:1/2 2:1/2 #7,:2 | 1:4")
KAMPF_B = Teil(
    "VI | VII | III | VI | iv | i | iv | V",
    "3:1 3:1 2:1 1:1 | 2:2 7,:2 | 3:1 3:1 5:1 3:1 | 1:4 | 6,:2 1:2 | 3:2 1:2 | 4:2 6,:2 | #7,:4",
)
KAMPF_OFFEN = Teil("i | VI | iv | V V7", f"{KAMPF_KOPF} | 6:1/2 5:1/2 3:1/2 2:1/2 2:2 | #7,:4")
KAMPF_TEILE = {"a": KAMPF_A, "a2": KAMPF_A2, "b": KAMPF_B, "a3": KAMPF_OFFEN}
KAMPF_FORM = ("a", "a2", "b", "a3")
KAMPF_MELODIE = frozenset({"a", "a2", "a3"})


def kampf_spuren(staerke: int) -> tuple[tuple[Stimme, ...], dict[str, tuple[int, ...]]]:
    """Grund (Bass, Klavier-Stöße, leises Schlagzeug), Melodie (Streicher, Cello in B), Horn."""
    return mit_spuren(
        (
            Stimme("kontrabass_pizz", "bass_laufend", 0.85, 0.0, 0.1, 1, staerke),
            Stimme("klavier", "stoss", 0.55, -0.2, 0.15, staerke=staerke - 12),
            Stimme("schlagwerk", "schlagzeug", 0.4, 0.2, 0.1, staerke=staerke - 14),
        ),
        (
            Stimme("violinen", "melodie", 0.75, 0.15, 0.2, MELODIE_OKTAVE, staerke, KAMPF_MELODIE),
            Stimme("cello", "melodie", 0.75 * GEGEN_ANHEBUNG, 0.1, 0.2, 1, staerke - 4, nur("b")),
        ),
        (Stimme("horn", "melodie", 0.6, 0.0, 0.2, 0, staerke - 4),),
    )


_KAMPF_STIMMEN, _KAMPF_SPUREN = kampf_spuren(70)
MAPLE_FALLS_CLUBKAMPF = Satz(
    "mapleFalls.clubkampf",
    "Maple Falls, Clubkampf",
    "e",
    132,
    4,
    KAMPF_TEILE,
    KAMPF_FORM,
    _KAMPF_STIMMEN,
    spuren=_KAMPF_SPUREN,
    zusatz="steigerung",
    beschreibung="Kampfthema Akt 1: der Kopf von Maple Falls in Moll, geschärft, treibender Bass, 132.",
)

BUSFAHRT = Satz(
    "busfahrt",
    "Busfahrt nach Maple Falls",
    TONART,
    76,
    4,
    teile(),
    # Ohne Vorspiel: Als Schleife setzte das leise Vorspiel die Naht 7 LU herab (A0.6).
    ("a1", "a2", "b", "a5", "a6"),
    (
        Stimme("gitarre", "zupfen", 0.8, -0.1, 0.3, staerke=44),
        Stimme("gitarre", "melodie", 0.7, 0.15, 0.3, MELODIE_OKTAVE, 54, nur("a1", "a2", "b", "a5", "a6")),
    ),
    beschreibung="Müde, glücklich: das Thema von Maple Falls kehrt leise zurück, nur Gitarre.",
)

STUECKE = (
    MAPLE_FALLS,
    MAPLE_FALLS_NACHT,
    MAPLE_FALLS_INNEN,
    MAPLE_FALLS_CLUB,
    MAPLE_FALLS_LERNEN,
    MAPLE_FALLS_CLUBKAMPF,
    BUSFAHRT,
)
