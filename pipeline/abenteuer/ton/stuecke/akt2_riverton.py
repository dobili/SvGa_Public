"""Riverton: das einprägsame Stadtthema in c-Moll und seine Fassungen, dazu die Fanfare (Klangplan A0, 2A1).

Warum: Riverton ist laut, nass und lebendig: ein Swing in Moll mit gedämpfter Trompete, gezupftem
Kontrabass und Besen; das Klopfen der Schachuhren gehört zum Rhythmus (Holzblock ``uhr``). Seit der
Umstellung auf A0 (Etappe Akt 2, 22.11.2026) hat die Stadt einen Kopf zum Mitsummen:

- Kopf (2 Takte): C Es G As | G Es C. Der steigende Moll-Dreiklang des alten Themas bleibt, die
  kleine Sexte As über der Quinte ist das Kennzeichen, dann fällt die Linie zurück.
- Form A A' B A' offen; im B-Teil (über Es-Dur und As-Dur) schweigt die Trompete, das Klavier
  antwortet tief. Drei Spuren: grund (Bass, Klavier, Besen, Uhren), melodie, zusatz (Vibraphon als
  Farbe).
- Das Kampfthema von Akt 2 ist derselbe Kopf geschärft (Clubkampf gegen Slick, 140); der Clubkampf
  in Ironwood steigert es (akt2_ironwood.py).
- Pops' Erzählung (nur Kontrabass) und der Wohnwagen (nur Mundharmonika) bleiben Solostücke ohne
  Spuren.

Ersatz: Die Klavierbegleitung (leise getupft) hält die Harmonie hörbar; der Regen auf Blech im
Clubkampf ist ein Geräusch (2B1) und steht nicht in den Noten.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.kurz import kurz
from pipeline.abenteuer.ton.stuecke.maple import GEGEN_ANHEBUNG, mit_spuren

TONART = "c"
OBEN = 1
AKT = 2
SWING = 1 / 6
LEICHTER_SWING = 1 / 8

KOPF = "1:1/2 3:1/2 5:2 6:1 | 5:3/2 3:1/2 1:2"
A = Teil("i | i | iv | V7", f"{KOPF} | 4:1/2 6:1/2 1':2 6:1 | 5:3/2 4:1/2 2:2")
A2 = Teil("i | i | iv V7 | i", f"{KOPF} | 4:1 6:1 5:1 #7,:1 | 1:4")
A_OFFEN = Teil("i | i | iv | V7", f"{KOPF} | 4:1 6:1 5:1 #7,:1 | 5:1 4:1 2:1 #7,:1")
# B: Die Trompete schweigt; das Klavier antwortet tief (als Melodie des Teils), endet auf G7.
B = Teil(
    "III | VI | iiø | V7 | III | VI | iv | V7",
    "3:2 5:2 | 6:2 1':2 | 4:2 6:2 | 5:2 #7,:2 | 3:2 5:2 | 6:2 4:2 | 1:2 4:2 | 2:2 #7,:2",
)
TEILE = {"a": A, "a2": A2, "b": B, "a3": A_OFFEN}
FORM = ("a", "a2", "b", "a3")
# Kurze Form der Solostücke: A, B, A' offen (nicht auf der ausklingenden Tonika, A0.6).
FORM_KURZ = ("a", "b", "a3")
MELODIE_TEILE = frozenset(("a", "a2", "a3"))


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


def _riverton(
    kennung: str,
    titel: str,
    tempo: float,
    spuren: tuple,
    text: str,
    swing: float = SWING,
    zusatz: str = "farbe",
) -> Satz:
    """Eine Fassung des Stadtthemas in drei Spuren."""
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
        swing=swing,
        akt=AKT,
        spuren=gruppen,
        zusatz=zusatz,
        beschreibung=text,
    )


def _grund(uhr: float, uhr_staerke: int) -> tuple[Stimme, ...]:
    """Die Band von Riverton ohne Melodie: laufender Bass, getupftes Klavier, Besen, Uhrenklopfen."""
    return (
        Stimme("kontrabass_pizz", "bass_laufend", 0.8, 0.0, 0.15, 1, 62),
        Stimme("klavier", "tupfen", 0.3, -0.25, 0.25, 0, 38),
        Stimme("schlagwerk", "besen", 0.45, 0.25, 0.15, staerke=52),
        Stimme("schlagwerk", "uhr", uhr, -0.35, 0.15, staerke=uhr_staerke),
    )


def _melodie(instrument: str, staerke: int) -> tuple[Stimme, ...]:
    """Melodie in A, das Klavier antwortet tief im B-Teil (lauter, A0.6)."""
    return (
        Stimme(instrument, "melodie", 0.85, 0.15, 0.25, OBEN, staerke, MELODIE_TEILE),
        Stimme("klavier", "melodie", 0.7 * GEGEN_ANHEBUNG, -0.1, 0.25, 0, staerke - 6, nur("b")),
    )


VIBRAPHON = (Stimme("vibraphon", "tupfen", 0.4, 0.0, 0.3, OBEN, 44),)

RIVERTON = _riverton(
    "riverton",
    "Riverton",
    126,
    (_grund(0.45, 72), _melodie("trompete_gedaempft", 64), VIBRAPHON),
    "Laut, nass, lebendig: der Kopf auf gedämpfter Trompete, Swing in Moll, Bass, Besen, Uhren.",
)

RIVERTON_NACHT = _riverton(
    "riverton.nacht",
    "Riverton, Nacht",
    92,
    (
        (
            Stimme("kontrabass_pizz", "bass_grund", 0.75, 0.0, 0.2, 1, 56),
            Stimme("schlagwerk", "besen", 0.3, 0.25, 0.2, staerke=44),
        ),
        _melodie("trompete_gedaempft", 56),
        VIBRAPHON,
    ),
    "Nacht: dieselbe Melodie langsam, nur Bass und leise Besen, Vibraphon.",
    swing=LEICHTER_SWING,
)

RIVERTON_PAVILLON = _riverton(
    "riverton.pavillon",
    "Riverton, Pavillon",
    144,
    (_grund(0.7, 92), _melodie("trompete_gedaempft", 66), VIBRAPHON),
    "Blitz, Freude: das Stadtthema schneller, das Klopfen der Schachuhren ist der Schlag.",
)

RIVERTON_GITARRE = _riverton(
    "riverton.gitarre",
    "Riverton, Schuppen",
    84,
    (
        (Stimme("gitarre", "zupfen", 0.6, -0.2, 0.3, 0, 40),),
        (
            Stimme("gitarre", "melodie", 0.8, 0.15, 0.3, OBEN, 56, MELODIE_TEILE),
            Stimme("gitarre", "melodie", 0.7 * GEGEN_ANHEBUNG, 0.0, 0.3, 0, 50, nur("b")),
        ),
        (Stimme("mundharmonika", "tupfen", 0.35, 0.0, 0.3, OBEN, 40),),
    ),
    "Ruhig, Morgen: das Stadtthema langsam auf einer einzelnen Gitarre.",
    swing=LEICHTER_SWING,
)

RIVERTON_POPS = Satz(
    "riverton.pops",
    "Riverton, Pops erzählt",
    TONART,
    # 88 statt 80 und ein leise gestrichener Grundton: Bei dünner Besetzung fallen die einzelnen
    # Anschläge sonst als Spitzen über den Pausen auf (A0.6).
    88,
    4,
    TEILE,
    FORM_KURZ,
    (
        # Begleitung kräftiger, Melodie leiser angeschlagen: weniger Spitzen über dem Mittel (A0.6).
        Stimme("kontrabass_pizz", "melodie", 0.6, 0.05, 0.3, 0, 46),
        Stimme("kontrabass_pizz", "bass_grund", 0.7, -0.05, 0.3, 0, 48),
        Stimme("kontrabass", "halten", 0.55, 0.0, 0.35, 0, 40),
    ),
    swing=LEICHTER_SWING,
    akt=AKT,
    beschreibung="Erinnerung, Respekt: das Stadtthema gezupft, darunter leise gestrichen.",
)

RIVERTON_WOHNWAGEN = Satz(
    "riverton.wohnwagen",
    "Riverton, Wohnwagen",
    TONART,
    66,
    4,
    TEILE,
    # Die Mundharmonika allein klingt auf der Tonika weich aus; mit dem offenen Schluss spränge die Naht.
    ("a", "b", "a2"),
    (Stimme("mundharmonika", "melodie", 0.85, 0.0, 0.4, OBEN, 54),),
    swing=LEICHTER_SWING,
    akt=AKT,
    beschreibung="Leise, Verlust: das Stadtthema langsam auf einer einzelnen Mundharmonika.",
)

# Kampfthema Akt 2: derselbe Kopf geschärft (C Es G As G | G Es C, Achtel, Pausen dazwischen).
KAMPF_KOPF = "1:1/2 3:1/2 5:1 6:1/2 5:1/2 r:1 | 5:3/4 3:1/4 1:1 r:1/2 1:1/2 1:1"
KAMPF_A = Teil("i | i | iv | V7", f"{KAMPF_KOPF} | 4:1/2 6:1/2 1':1 6:1/2 4:1/2 r:1 | 5:2 #7,:2")
KAMPF_A2 = Teil("i | i | iv V7 | i", f"{KAMPF_KOPF} | 4:1/2 6:1/2 5:1/2 4:1/2 #7,:2 | 1:4")
KAMPF_B = Teil(
    "III | VI | iiø | V7 | III | VI | iv | V7",
    "3:1 3:1 5:1 3:1 | 6:2 4:2 | 4:1 4:1 6:1 4:1 | 5:4 | 3:1 3:1 5:1 3:1 | 6:2 1':2 | 6:2 4:2 | #7,:4",
)
# Schluss in Vierteln zurück zum Kopf statt einer langen Note (Naht der Schleife, A0.6).
KAMPF_OFFEN = Teil("i | i | iv | V7", f"{KAMPF_KOPF} | 4:1/2 6:1/2 5:1/2 4:1/2 2:2 | #7,:1 2:1 4:1 #7,:1")
KAMPF_TEILE = {"a": KAMPF_A, "a2": KAMPF_A2, "b": KAMPF_B, "a3": KAMPF_OFFEN}
KAMPF_FORM = ("a", "a2", "b", "a3")

_KAMPF_STIMMEN, _KAMPF_SPUREN = mit_spuren(
    (
        Stimme("kontrabass_pizz", "bass_laufend", 0.85, 0.0, 0.1, 1, 70),
        Stimme("klavier", "stoss", 0.55, -0.2, 0.15, staerke=58),
        Stimme("schlagwerk", "schlagzeug", 0.4, 0.2, 0.1, staerke=56),
        Stimme("schlagwerk", "uhr", 0.5, -0.35, 0.1, staerke=80),
    ),
    (
        Stimme("trompete", "melodie", 0.8, 0.15, 0.2, OBEN, 70, MELODIE_TEILE),
        Stimme("klavier", "melodie", 0.75 * GEGEN_ANHEBUNG, -0.1, 0.2, 0, 64, nur("b")),
    ),
    (Stimme("saxophon", "melodie", 0.55, 0.0, 0.2, 0, 60),),
)
RIVERTON_CLUBKAMPF = Satz(
    "riverton.clubkampf",
    "Riverton, Clubkampf",
    TONART,
    140,
    4,
    KAMPF_TEILE,
    KAMPF_FORM,
    _KAMPF_STIMMEN,
    swing=SWING,
    akt=AKT,
    spuren=_KAMPF_SPUREN,
    zusatz="steigerung",
    # Ein halbes dB Luft: Die hellen Trompetenstöße überschießen beim Kodieren sonst die Spitze (A0.6).
    pegel_db=-0.5,
    beschreibung="Kampfthema Akt 2: der Kopf von Riverton geschärft, Trompete, Uhren; Saxophon steigert.",
)

# Fanfare in Riverton: der Dur-Dreiklang über C6, gedämpfte Trompete, endet mit dem Aha.
FANFARE_RIVERTON = kurz(
    "fanfare.riverton",
    "Fanfare, Riverton",
    120,
    4,
    Teil("I6 | I6", "1:0.5 3:0.5 5:0.5 1':2.5 | r:4", {"aha": "r:4 | 2':0.25 5':0.5 1'':3.25"}),
    (
        Stimme("trompete_gedaempft", "melodie", 0.85, 0.15, 0.25, OBEN, 72),
        Stimme("klavier", "stoss", 0.5, -0.25, 0.25, 0, 54),
        Stimme("kontrabass_pizz", "bass_grund", 0.7, 0.0, 0.15, 1, 62),
        Stimme("glockenspiel", "noten", 0.6, 0.3, 0.4, OBEN, 70, kennung="aha"),
    ),
    "Gedämpfte Trompete, Klavier, Bass, Glockenspiel: Dur-Dreiklang aufwärts, endet mit dem Aha.",
    tonart="C",
    akt=AKT,
)

STUECKE = (
    RIVERTON,
    RIVERTON_NACHT,
    RIVERTON_PAVILLON,
    RIVERTON_POPS,
    RIVERTON_GITARRE,
    RIVERTON_CLUBKAMPF,
    RIVERTON_WOHNWAGEN,
    FANFARE_RIVERTON,
)
