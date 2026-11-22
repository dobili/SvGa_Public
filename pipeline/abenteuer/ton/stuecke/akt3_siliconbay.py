"""Silicon Bay: das einprägsame Stadtthema in G-lydisch, seine Fassungen und das Kampfthema von Akt 3.

Warum: Silicon Bay ist schön und ohne Atem (Klangplan 3A1); die ♯4 (Cis) ist der Konzernton und
zugleich der fremde Ton in Ambroses Kopf (A1). Seit der Umstellung auf A0 (Etappe Akt 3, 22.11.2026)
hat die Stadt einen Kopf zum Mitsummen:

- Kopf (2 Takte): H D Cis D | A' G D. Die Melodie kreist einmal um die ♯4 (Wechselnote unter der
  Quinte), springt dann eine Quinte hinauf und fällt zurück. Gleichmäßige Viertel, keine Pause:
  ohne Atem.
- Form A A' B A' offen. Im B-Teil schweigt das Vibraphon, das Digitalpiano antwortet tief. Drei
  Spuren: grund (Orgelfläche, die liegende ♯4 oben, gefilterte Achtel), melodie, zusatz (Glasharfe
  als Farbe).
- Das Kampfthema von Akt 3 ist derselbe Kopf in Achteln geschärft, über einer Klavierfigur in
  Sechzehnteln (Clubkampf gegen Dr. Lin, 132); kein Schlagzeug, die Figur treibt. Der Clubkampf in
  Desert Springs steigert es mit der reinen 4 (akt3_desert.py).

Ersatz: Synthesizerflächen spielt die Zugriegelorgel (``hammond``), die gefilterten Achtel das
Digitalpiano leise, die Lead-Stimme das Vibraphon (die freien Bibliotheken haben keinen Synthesizer).
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.akt3_silicon import sechzehntel
from pipeline.abenteuer.ton.stuecke.maple import GEGEN_ANHEBUNG, mit_spuren

TONART = "G"
OBEN = 1
AKT = 3

KOPF = "3:1 5:1 #4:1 5:1 | 2':2 1':1 5:1"
A = Teil("Imaj7 | II | Imaj7 | II", f"{KOPF} | 3:1 5:1 #4:1 2:1 | 3:3 2:1")
A2 = Teil("Imaj7 | II | vi II | Imaj7", f"{KOPF} | 6:1 5:1 #4:1 2:1 | 1:4")
# Letzter Takt in Vierteln zurück zum Kopf (Naht der Schleife, A0.6).
A_OFFEN = Teil("Imaj7 | II | vi | II", f"{KOPF} | 6:1 5:1 #4:1 2:1 | 3:1 #4:1 5:1 #4:1")
# B: Das Vibraphon schweigt; das Digitalpiano antwortet tief (als Melodie des Teils), endet auf II.
B = Teil(
    "vi | iii | II | Imaj7 | vi | iii | II | II",
    "1:2 3:2 | 7,:2 5,:2 | 6,:2 #4:2 | 5:2 3:2 | 1:2 3:2 | 5:2 7:2 | 6:2 #4:2 | 2:2 #4,:2",
)
# Die Fläche hält die ♯4 zwei Oktaven über der Mitte (Klangplan 3A1: „die ♯4 liegt oben“).
OBEN_VIER = "#4':4 | #4':4 | #4':4 | #4':4"
GLAS = {
    "a": "5':2 3':2 | 6':2 #4':2 | 5':2 2':2 | 3':4",
    "a2": "5':2 3':2 | 6':2 #4':2 | 1'':2 6':2 | 5':4",
    "b": "1'':2 5':2 | 7':2 5':2 | 6':2 #4':2 | 5':4 | 1'':2 5':2 | 7':2 3':2 | 6':2 #4':2 | 2':4",
    "a3": "5':2 3':2 | 6':2 #4':2 | 1'':2 6':2 | #4':4",
}


def _mit(teil: Teil, name: str, oben: str) -> Teil:
    """Ein Teil mit der liegenden ♯4 (``oben``) und der Glasharfe (``glas``)."""
    return Teil(teil.akkorde, teil.melodie, {"oben": oben, "glas": GLAS[name]})


TEILE = {
    "a": _mit(A, "a", OBEN_VIER),
    "a2": _mit(A2, "a2", OBEN_VIER),
    "b": _mit(B, "b", f"{OBEN_VIER} | {OBEN_VIER}"),
    "a3": _mit(A_OFFEN, "a3", OBEN_VIER),
}
FORM = ("a", "a2", "b", "a3")
MELODIE_TEILE = frozenset(("a", "a2", "a3"))


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


def _grund(hall: float, flaeche: float) -> tuple[Stimme, ...]:
    """Orgelfläche, die liegende ♯4 und die gefilterten Achtel des Digitalpianos."""
    return (
        Stimme("hammond", "halten", flaeche, -0.15, hall, 0, 36),
        Stimme("hammond", "noten", 0.25, 0.3, hall, OBEN, 30, kennung="oben"),
        Stimme("digitalpiano", "zupfen", 0.6, -0.3, hall, 0, 34),
    )


def _melodie(hall: float, staerke: int) -> tuple[Stimme, ...]:
    """Vibraphon in A, das Digitalpiano antwortet tief im B-Teil (lauter, A0.6)."""
    return (
        Stimme("vibraphon", "melodie", 0.8, 0.15, hall, OBEN, staerke, MELODIE_TEILE),
        Stimme("digitalpiano", "melodie", 0.6 * GEGEN_ANHEBUNG, -0.05, hall, 0, staerke - 6, nur("b")),
    )


def _glas(hall: float) -> tuple[Stimme, ...]:
    """Die Glasharfe als Farbe (Zusatzspur)."""
    return (Stimme("glasharfe", "noten", 0.4, 0.0, hall, 0, 34, kennung="glas"),)


def _silicon(kennung: str, titel: str, tempo: float, spuren: tuple, text: str, pegel: float = 0.0) -> Satz:
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
        akt=AKT,
        pegel_db=pegel,
        spuren=gruppen,
        zusatz="farbe",
        beschreibung=text,
    )


SILICON_BAY = _silicon(
    "siliconBay",
    "Silicon Bay",
    96,
    (_grund(0.35, 0.7), _melodie(0.35, 54), _glas(0.4)),
    "Schön, ohne Atem: der Kopf auf dem Vibraphon um die ♯4, Orgelfläche, gefilterte Achtel.",
)
SILICON_BAY_NACHT = _silicon(
    "siliconBay.nacht",
    "Silicon Bay, Nacht",
    76,
    (_grund(0.45, 0.6)[:2], _melodie(0.45, 48), _glas(0.5)),
    "Nacht: dieselbe Melodie langsam, nur die Fläche und die ♯4 darüber, die Glasharfe.",
)
# Die Akademie spielt das Thema wie aus der Decke: leiser, mit viel Hall (Klangplan 3A1).
SILICON_BAY_AKADEMIE = _silicon(
    "siliconBay.akademie",
    "Silicon Bay, Akademie",
    96,
    (_grund(0.7, 0.7), _melodie(0.7, 50), _glas(0.7)),
    "Raumklang: das Thema von Silicon Bay leiser, wie aus der Decke, mit viel Hall.",
    pegel=-6.0,
)

# --- Kampfthema Akt 3: derselbe Kopf in Achteln, Quintsprung betont, Pausen dazwischen ---
KAMPF_KOPF = "3:1/2 5:1/2 #4:1/2 5:1/2 2':1 r:1 | 2':3/4 1':1/4 5:1 r:1/2 #4:1/2 5:1"
KAMPF_A = Teil("Imaj7 | II | Imaj7 | II", f"{KAMPF_KOPF} | 3:1/2 5:1/2 #4:1/2 2:1/2 3:1 r:1 | 2:2 #4:2")
KAMPF_A2 = Teil("Imaj7 | II | vi II | Imaj7", f"{KAMPF_KOPF} | 6:1/2 5:1/2 #4:1/2 2:1/2 #4:2 | 1:4")
KAMPF_B = Teil(
    "vi | iii | II | Imaj7 | vi | iii | II | II",
    "1:1 1:1 3:1 1:1 | 7,:2 5,:2 | 6,:1 6,:1 #4:1 6,:1 | 5:4 | 1:1 1:1 3:1 1:1 | 5:2 7:2 | 6:2 #4:2 | 2:4",
)
KAMPF_OFFEN = Teil("Imaj7 | II | vi | II", f"{KAMPF_KOPF} | 6:1/2 5:1/2 #4:1/2 2:1/2 6,:2 | 2:1 3:1 #4:1 2:1")
# Klavierfigur: je Akkord eine Zelle von acht Sechzehnteln (zwei Akkorde im Takt: je eine Zelle).
FIGUREN = {
    "Imaj7": "1 3 5 7 1' 7 5 3",
    "II": "2 #4 6 2' #4' 2' 6 #4",
    "vi": "6, 1 3 6 1' 6 3 1",
    "iii": "3 5 7 3' 5' 3' 7 5",
}
ZELLEN_JE_TAKT = 2


def figur(akkorde: str) -> str:
    """Die Klavierfigur zu einer Akkordfolge, 16 Sechzehntel je Takt. Beispiel: „vi II“ → je eine Zelle."""
    takte = []
    for takt in akkorde.split("|"):
        namen = takt.split()
        zellen = [FIGUREN[n] for n in namen for _ in range(ZELLEN_JE_TAKT // len(namen))]
        takte.append(sechzehntel(" ".join(zellen)))
    return " | ".join(takte)


KAMPF_TEILE = {
    name: Teil(teil.akkorde, teil.melodie, {"figur": figur(teil.akkorde)})
    for name, teil in {"a": KAMPF_A, "a2": KAMPF_A2, "b": KAMPF_B, "a3": KAMPF_OFFEN}.items()
}
_KAMPF_STIMMEN, _KAMPF_SPUREN = mit_spuren(
    (
        Stimme("ebass", "bass_laufend", 0.75, 0.0, 0.1, 1, 62),
        Stimme("klavier", "noten", 0.45, -0.2, 0.2, 0, 44, kennung="figur"),
        Stimme("hammond", "halten", 0.5, 0.15, 0.35, 0, 32),
    ),
    (
        Stimme("klavier", "melodie", 0.8, 0.15, 0.2, OBEN, 62, MELODIE_TEILE),
        Stimme("digitalpiano", "melodie", 0.7 * GEGEN_ANHEBUNG, -0.1, 0.2, 0, 58, nur("b")),
    ),
    (Stimme("vibraphon", "melodie", 0.55, 0.0, 0.3, OBEN, 54),),
)
SILICON_BAY_CLUBKAMPF = Satz(
    "siliconBay.clubkampf",
    "Silicon Bay, Clubkampf",
    TONART,
    132,
    4,
    KAMPF_TEILE,
    FORM,
    _KAMPF_STIMMEN,
    akt=AKT,
    spuren=_KAMPF_SPUREN,
    zusatz="steigerung",
    beschreibung="Kampfthema Akt 3: der Kopf in Achteln über der Klavierfigur, das Vibraphon steigert.",
)

STUECKE = (SILICON_BAY, SILICON_BAY_NACHT, SILICON_BAY_AKADEMIE, SILICON_BAY_CLUBKAMPF)
