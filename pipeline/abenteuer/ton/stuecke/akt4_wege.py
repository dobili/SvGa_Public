"""Akt 4, Wege und Landschaften: Hochebene, Pinewood, Staubstraße, Seeufer, Herbst, Wald, Leuchtturm.

Warum: Das Wegthema ist in jedem Akt das Thema von Maple Falls in anderer Besetzung (Klangplan A2,
„weg“; Grundsatz 2). In Akt 4 fährt es mit der Slide-Gitarre zur Hochebene und nimmt das Thema
des Helden als zweite Stimme mit (`weg.wueste.held`), wird in Pinewood verspielt, verliert auf der
Staubstraße die Farbe und kehrt am Seeufer in voller Besetzung zurück. Im Herbst klingt es wie in
Kapitel 1, nur Gitarre. Die Hochebene bekommt ein eigenes, heutiges Thema (Flöte, Handtrommel,
Gitarre). Der Wald hat nur einen Orgelpunkt, der Leuchtturm einen tiefen Ton je Aufleuchten.

Ersatz: Die Slide-Gitarre ist die E-Gitarre (clean, mit viel Hall), das Banjo der Strumstick, die
Fiedel die Geige, die Handtrommel das Tamburin mit Schellenei. Die Staubstraße verliert ihre
Obertöne im Klangplan mit den Farbstufen der Karte (T22, Tiefpass, dann Hochpass); ein Filter je
Farbstufe gehört in die App. Diese Datei liefert das Wegthema dafür, leise und schlicht besetzt.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.akt4_themen import HELD_OFFEN, OBEN, nur
from pipeline.abenteuer.ton.stuecke.maple import A2, GEGEN_ANHEBUNG, A, B, mit_spuren
from pipeline.abenteuer.ton.stuecke.maple import FORM as MAPLE_FORM
from pipeline.abenteuer.ton.stuecke.maple import MELODIE_TEILE as MAPLE_MELODIE
from pipeline.abenteuer.ton.stuecke.maple import teile as maple_teile

AKT = 4
_MAPLE = maple_teile()

# Das Heldenthema als zweite Stimme: 2 – 3 – 5 steigt dort, wo die Melodie liegen bleibt.
HELD_AM_ENDE = "r:4 | r:4 | r:4 | r:1 2:1 3:1 5:1"
HELD_IN_B = "r:4 | r:4 | r:4 | r:4 | r:4 | r:1 2:1 3:1 5:1 | r:4 | r:1 2:1 3:1 5:1"


def _wueste_teile() -> dict[str, Teil]:
    """Das Wegthema mit der zweiten Stimme des Helden und einem Teil nur mit dem Heldenthema."""
    held = "held"
    return {
        **_MAPLE,
        "a1": Teil(A.akkorde, A.melodie, {held: HELD_AM_ENDE}),
        "a2": Teil(A2.akkorde, A2.melodie, {held: HELD_AM_ENDE}),
        "b": Teil(B.akkorde, B.melodie, {held: HELD_IN_B}),
        "held2": HELD_OFFEN,
    }


def _maple_weg(  # noqa: PLR0913 (wie Satz: Kennung, Titel, Tempo, Teile, Form, Spuren, Text)
    kennung: str, titel: str, tempo: float, teile: dict, form: tuple, spuren: tuple, text: str
) -> Satz:
    """Ein Weg mit dem Thema von Maple Falls in drei Spuren (Zusatz: Farbe)."""
    stimmen, gruppen = mit_spuren(*spuren)
    return Satz(
        kennung,
        titel,
        "G",
        tempo,
        4,
        teile,
        form,
        stimmen,
        akt=AKT,
        spuren=gruppen,
        zusatz="farbe",
        beschreibung=text,
    )


def _gegen(instrument: str, lautstaerke: float, staerke: int) -> Stimme:
    """Die Gegenstimme im B-Teil (lauter, A0.6)."""
    return Stimme(instrument, "melodie", lautstaerke * GEGEN_ANHEBUNG, -0.1, 0.3, 0, staerke, nur("b"))


# Fahrt zur Hochebene: Nach dem B-Teil führt der Held mit seinem Thema (offen auf der 2) zurück.
WEG_WUESTE_HELD = _maple_weg(
    "weg.wueste.held",
    "Fahrt zur Hochebene",
    76,
    _wueste_teile(),
    ("a1", "a2", "b", "held2", "a6"),
    (
        (
            Stimme("gitarre", "zupfen", 0.7, -0.3, 0.4, 0, 42),
            Stimme("kontrabass_pizz", "bass_wechsel", 0.6, 0.0, 0.3, 1, 50),
        ),
        (
            Stimme("egitarre", "melodie", 0.8, 0.25, 0.5, OBEN, 58, nur("a1", "a2", "a6")),
            Stimme("gitarre", "melodie", 0.75, -0.1, 0.4, OBEN, 54, nur("held2")),
            _gegen("gitarre", 0.6, 50),
        ),
        (Stimme("gitarre", "noten", 0.55, -0.1, 0.4, 0, 48, nur("a1", "a2", "b"), "held"),),
    ),
    "Aufbruch, weit: das Thema von Maple Falls auf der Slide-Gitarre, das Thema des Helden fährt mit.",
)

# --- Hochebene (A0, Etappe Akt 4): D-Dur, heutig, mit Humor ---
# Kopf D' A H D' | H G A: Er tippt zweimal auf das hohe D, mit Pausen an unerwarteter Stelle.
KOPF = "1':1/2 r:1/2 5:1/2 6:1/2 1':1 r:1 | 6:1/2 4:1/2 5:2 r:1"
HOCH_A = Teil("I | IV | I | V", f"{KOPF} | 3:1/2 5:1/2 1':1 5:1/2 3:1/2 1:1 | 2:3/2 3:1/2 5:2")
HOCH_A2 = Teil("I | IV | ii V | I", f"{KOPF} | 2:1 4:1 5:1 7,:1 | 1:1 r:1/2 1:1/2 1:1 r:1")
# Letzter Takt in Vierteln zurück zum Kopf (Naht der Schleife, A0.6).
HOCH_OFFEN = Teil("I | IV | ii | V7", f"{KOPF} | 2:1 4:1 5:1 7,:1 | 5:1 6:1 7:1 2':1")
# B: Die Flöte schweigt, die Gitarre antwortet (als Melodie des Teils), endet auf V.
HOCH_B = Teil(
    "vi | IV | I | V | vi | IV | V | V7",
    "6:3/2 5:1/2 3:1 1:1 | 4:3/2 3:1/2 1:2 | 3:1/2 5:1/2 3:1/2 5:1/2 1':2 | 7:1 6:1 5:2 | "
    "6:3/2 5:1/2 3:1 1:1 | 4:1/2 6:1/2 1':1 6:2 | 7:1 5:1 7:1 2':1 | 5:2 7,:2",
)
HOCH_TEILE = {"a": HOCH_A, "a2": HOCH_A2, "b": HOCH_B, "a3": HOCH_OFFEN}
HOCH_FORM = ("a", "a2", "b", "a3")
HOCH_MELODIE = nur("a", "a2", "a3")


def _hochebene(kennung: str, titel: str, tempo: float, spuren: tuple, text: str) -> Satz:
    """Eine Fassung des Themas der Hochebene in drei Spuren (Zusatz: die Handtrommel)."""
    stimmen, gruppen = mit_spuren(*spuren)
    return Satz(
        kennung,
        titel,
        "D",
        tempo,
        4,
        HOCH_TEILE,
        HOCH_FORM,
        stimmen,
        akt=AKT,
        spuren=gruppen,
        zusatz="farbe",
        beschreibung=text,
    )


HOCHEBENE = _hochebene(
    "hochebene",
    "Hochebene",
    100,
    (
        (
            Stimme("gitarre", "schlagen", 0.6, -0.3, 0.2, 0, 44),
            Stimme("kontrabass_pizz", "bass_wechsel", 0.55, 0.0, 0.2, 1, 50),
        ),
        (
            Stimme("floete", "melodie", 0.8, 0.2, 0.25, OBEN, 60, HOCH_MELODIE),
            _gegen("gitarre", 0.6, 52),
        ),
        (Stimme("schlagwerk", "tamburin", 0.4, 0.3, 0.15, staerke=50),),
    ),
    "Heutig, mit Humor: der Kopf tippt auf das hohe D, Flöte, Gitarre und Handtrommel.",
)
HOCHEBENE_NACHT = _hochebene(
    "hochebene.nacht",
    "Hochebene, Nacht",
    80,
    (
        (
            Stimme("gitarre", "zupfen", 0.6, -0.3, 0.3, 0, 40),
            Stimme("kontrabass_pizz", "bass_grund", 0.5, 0.0, 0.3, 1, 44),
        ),
        (
            Stimme("floete", "melodie", 0.7, 0.2, 0.4, OBEN, 50, HOCH_MELODIE),
            _gegen("gitarre", 0.5, 46),
        ),
        (Stimme("glockenspiel", "tupfen", 0.3, 0.3, 0.5, OBEN, 34),),
    ),
    "Nacht: dieselbe Melodie langsam, die Gitarre gezupft, Sterne im Glockenspiel.",
)

PINEWOOD = _maple_weg(
    "pinewood",
    "Pinewood Camp",
    108,
    _MAPLE,
    MAPLE_FORM,
    (
        (
            Stimme("gitarre", "travis", 0.75, -0.3, 0.2, 0, 48),
            Stimme("kontrabass_pizz", "bass_zweier", 0.7, 0.0, 0.15, 1, 56),
            Stimme("schlagwerk", "schellen", 0.3, 0.35, 0.2, staerke=44),
        ),
        (
            Stimme("strumstick", "melodie", 0.75, 0.25, 0.25, OBEN, 56, MAPLE_MELODIE),
            _gegen("gitarre", 0.6, 52),
        ),
        (Stimme("glockenspiel", "noten", 0.4, 0.3, 0.35, 0, 48, kennung="farbe"),),
    ),
    "Verspielt: das Thema von Maple Falls mit Banjo (Strumstick) und Gitarre, leichter Rhythmus.",
)

STAUBSTRASSE = _maple_weg(
    "staubstrasse",
    "Staubstraße",
    72,
    _MAPLE,
    MAPLE_FORM,
    (
        (Stimme("gitarre", "zupfen", 0.7, -0.25, 0.35, 0, 40),),
        (
            Stimme("mundharmonika", "melodie", 0.6, 0.2, 0.35, OBEN, 50, MAPLE_MELODIE),
            _gegen("geige", 0.5, 46),
        ),
        (Stimme("cello", "noten", 0.4, 0.1, 0.4, 1, 40, kennung="cello"),),
    ),
    "Die Farbe geht: das Thema leise und schlicht; die App filtert es mit den Farbstufen.",
)

SEEUFER = _maple_weg(
    "seeufer",
    "Seeufer",
    96,
    _MAPLE,
    MAPLE_FORM,
    (
        (
            Stimme("gitarre", "travis", 0.8, -0.3, 0.3, 0, 50),
            Stimme("klavier", "tupfen", 0.35, 0.15, 0.35, 0, 38),
            Stimme("kontrabass_pizz", "bass_zweier", 0.65, 0.0, 0.2, 1, 54),
        ),
        (
            Stimme("mundharmonika", "melodie", 0.6, 0.25, 0.3, OBEN, 58, MAPLE_MELODIE),
            Stimme("geige", "melodie", 0.5, 0.2, 0.35, OBEN, 54, MAPLE_MELODIE),
            _gegen("cello", 0.6, 54),
        ),
        (
            Stimme("cello", "noten", 0.45, -0.1, 0.35, 1, 46, kennung="cello"),
            Stimme("glockenspiel", "noten", 0.35, 0.35, 0.45, 0, 44, kennung="farbe"),
        ),
    ),
    "Alle Farben zurück: das Thema von Maple Falls in voller Besetzung, weit und hell.",
)

MAPLE_FALLS_HERBST = _maple_weg(
    "mapleFalls.herbst",
    "Maple Falls, Herbst",
    # 84 statt 76: Mit einer Gitarre allein stehen die Anschläge sonst als Spitzen heraus (A0.6).
    84,
    _MAPLE,
    MAPLE_FORM,
    (
        (Stimme("gitarre", "zupfen", 0.85, -0.2, 0.3, 0, 44),),
        (
            # Wie die Busfahrt in Kapitel 1: dieselbe Gitarre spielt auch die Gegenstimme im B-Teil.
            Stimme("gitarre", "melodie", 0.7, 0.2, 0.3, OBEN, 52, nur("a1", "a2", "b", "a6")),
        ),
        (Stimme("gitarre", "noten", 0.45, 0.0, 0.3, 1, 42, kennung="cello"),),
    ),
    "Wie am ersten Tag: das Thema von Maple Falls, nur Gitarre.",
)

# Wald: ein tiefer Orgelpunkt auf der 1, zwei Stimmen versetzt, damit der Ton nie abreißt.
ORGELPUNKT = Teil(
    "N.C. | N.C. | N.C. | N.C.",
    linien={"orgel": "1,:8 1,:8", "bass": "r:4 1,:8 1,:4"},
)
WALD_ORGELPUNKT = Satz(
    "wald.orgelpunkt",
    "Wald, Orgelpunkt",
    "G",
    60,
    4,
    {"p": ORGELPUNKT},
    ("p",) * 8,
    (
        Stimme("orgel", "noten", 0.7, 0.0, 0.5, -1, 40, kennung="orgel"),
        Stimme("kontrabass", "noten", 0.5, 0.0, 0.5, 0, 34, kennung="bass"),
    ),
    akt=AKT,
    pegel_db=-10.0,
    beschreibung="Stille, Ehrfurcht: ein tiefer, langer Ton wie ein Orgelpunkt, kaum hörbar.",
)

# Leuchtturm: zwei Aufleuchten in zwölf Sekunden, je ein tiefer Ton (Klavier und Kontrabass).
LICHT = Teil("N.C. | N.C. | N.C. | N.C.", linien={"licht": "1,:5 r:1 1,:5 r:1"})
LEUCHTTURM = Satz(
    "leuchtturm",
    "Leuchtturm",
    "G",
    60,
    3,
    {"l": LICHT},
    ("l",),
    (
        Stimme("klavier", "noten", 0.7, 0.0, 0.5, 0, 50, kennung="licht"),
        Stimme("kontrabass", "noten", 0.6, 0.0, 0.5, 0, 46, kennung="licht"),
    ),
    akt=AKT,
    pegel_db=-6.0,
    beschreibung="Ruhig: ein tiefer, langsamer Ton für jedes Aufleuchten.",
)

STUECKE = (
    WEG_WUESTE_HELD,
    HOCHEBENE,
    HOCHEBENE_NACHT,
    PINEWOOD,
    STAUBSTRASSE,
    SEEUFER,
    MAPLE_FALLS_HERBST,
    WALD_ORGELPUNKT,
    LEUCHTTURM,
)
