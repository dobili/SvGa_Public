"""Summit City: das einprägsame Ortsthema in D-Dur, Nacht, Lernen, das Kampfthema von Akt 4 und Hastings.

Warum: Summit City ist klar, kalt und karg (Klangplan 4A1); ihr Leitmotiv ist das Endspielmotiv,
der Quintenturm 1 – 5 – 2' – 6' – 3'' (A1). Der ganze Turm ist zu weit für einen Kopf zum
Mitsummen (Klangplan A0, höchstens eine Oktave). Seit der Umstellung auf A0 (Etappe Akt 4,
22.11.2026) gilt:

- Kopf (2 Takte): D A H | A E Fis. Die Quinte D–A ist der erste Schritt des Turms und das
  Kennzeichen; in den Takten 3 und 4 steigt der Turm weiter (1 – 5 – 2').
- Form A A' B A' offen; im B-Teil schweigt das Klavier oben, das Cello antwortet tief. Drei Spuren:
  grund (Klavier in einzelnen Tönen, Kontrabass), melodie, zusatz (das hohe Streicherflageolett).
- Das Kampfthema von Akt 4 ist derselbe Kopf in Achteln geschärft (Clubkampf gegen Ward, 126).
  Das Turnier in der Hauptstadt steigert es (``arena.vorrunde``, akt4_finale.py).

Ersatz: Das Flageolett sind die Violinen zwei Oktaven hoch, ohne eigenes Flageolett-Register.
Sonderfall: „Mit jedem Abtausch fällt ein Ton weg“ (Clubkampf) hängt am Spielverlauf.

Hastings: Wards Erzählung spielt Ambroses Walzer (``ambrose1``, mit der ♯4, wie 1857) als
Streichquartett: Geige, zweite Violine, Bratsche, Cello. Bei jedem Schach des Turms ein gezupfter
Ton, sechsmal steigend, über der Dominante; dann die warme Auflösung.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.ambrose1 import WALZER_A, WALZER_B
from pipeline.abenteuer.ton.stuecke.maple import GEGEN_ANHEBUNG, mit_spuren

AKT = 4
TONART = "D"
OBEN = 1
# Flageolett: zwei Oktaven über der Lage der Stufen.
FLAGEOLETT = 2

KOPF = "1:1 5:2 6:1 | 5:1 2:1 3:2"
A = Teil("I | IV | I | V", f"{KOPF} | 1:1 5:2 2':1 | 6:2 5:2")
A2 = Teil("I | IV | ii V | I", f"{KOPF} | 6:1 5:1 3:1 2:1 | 1:4")
# Letzter Takt in Vierteln zurück zum Kopf (Naht der Schleife, A0.6).
A_OFFEN = Teil("I | IV | ii | V7", f"{KOPF} | 6:1 5:1 3:1 2:1 | 5,:1 6,:1 7,:1 2:1")
# B: Das Cello antwortet tief mit dem langsamen Turm (als Melodie des Teils), endet auf V7.
B = Teil(
    "vi | IV | I | V | vi | IV | ii | V7",
    "6,:2 3:2 | 4:2 1:2 | 1:2 5:2 | 2':4 | 6,:2 3:2 | 4:2 6:2 | 2:2 6:2 | 5:2 7,:2",
)
FLAGEOLETT_LINIEN = {
    "a": "3:4 | 4:4 | 3:4 | 2:4",
    "a2": "3:4 | 4:4 | 2:4 | 1:4",
    "b": "1:4 | 1:4 | 1:4 | 2:4 | 1:4 | 1:4 | 2:4 | 2:4",
    "a3": "3:4 | 4:4 | 2:4 | 2:4",
}
TEILE = {
    name: Teil(teil.akkorde, teil.melodie, {"fl": FLAGEOLETT_LINIEN[name]})
    for name, teil in (("a", A), ("a2", A2), ("b", B), ("a3", A_OFFEN))
}
FORM = ("a", "a2", "b", "a3")
MELODIE_TEILE = frozenset(("a", "a2", "a3"))


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


def _flageolett(lautstaerke: float, staerke: int) -> tuple[Stimme, ...]:
    """Das hohe Streicherflageolett, leise, mit viel Raum (Zusatzspur)."""
    return (Stimme("violinen", "noten", lautstaerke, 0.25, 0.55, FLAGEOLETT, staerke, kennung="fl"),)


def _melodie(instrument: str, staerke: int, hall: float) -> tuple[Stimme, ...]:
    """Melodie in A, das Cello antwortet tief im B-Teil (lauter, A0.6)."""
    return (
        Stimme(instrument, "melodie", 0.8, -0.1, hall, OBEN, staerke, MELODIE_TEILE),
        Stimme("cello", "melodie", 0.6 * GEGEN_ANHEBUNG, 0.15, hall, 0, staerke - 4, nur("b")),
    )


def _summit(kennung: str, titel: str, tempo: float, spuren: tuple, text: str) -> Satz:
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


SUMMIT_CITY = _summit(
    "summitCity",
    "Summit City",
    72,
    (
        (
            Stimme("klavier", "harfe", 0.5, -0.2, 0.5, 0, 38),
            Stimme("kontrabass_pizz", "bass_grund", 0.55, 0.0, 0.4, 1, 46),
        ),
        _melodie("klavier", 54, 0.5),
        _flageolett(0.4, 34),
    ),
    "Klar, kalt, karg: der Quintschritt des Endspielmotivs auf dem Klavier, ein hohes Flageolett.",
)
SUMMIT_CITY_NACHT = _summit(
    "summitCity.nacht",
    "Summit City, Nacht",
    60,
    (
        (
            Stimme("klavier", "harfe", 0.45, -0.2, 0.6, 0, 34),
            Stimme("cello", "bass_grund", 0.45, 0.15, 0.5, 1, 38),
        ),
        _melodie("klavier", 48, 0.6),
        _flageolett(0.35, 30),
    ),
    "Nacht: dieselbe Melodie langsam, nur Klavier und ein tiefes Cello, sehr viel Raum.",
)
# Lernen bei Ward (in der Hütte): wärmer, Klavier und Cello, das Cello hält den Bass.
SUMMIT_CITY_LERNEN = _summit(
    "summitCity.lernen",
    "Summit City, Lernen",
    66,
    (
        (
            Stimme("klavier", "wiegen", 0.55, -0.2, 0.4, 0, 38),
            Stimme("cello", "bass_grund", 0.5, 0.15, 0.4, 1, 40),
        ),
        _melodie("klavier", 52, 0.4),
        _flageolett(0.3, 28),
    ),
    "Ruhig: das Thema von Summit City, Klavier und Cello wechseln sich ab.",
)

# --- Kampfthema Akt 4: derselbe Kopf in Achteln geschärft, der Turm steigt in Achteln weiter ---
KAMPF_KOPF = "1:1/2 5:1 6:1/2 5:1/2 r:1/2 2:1/2 3:1/2 | 5:1/2 6:1/2 5:1/2 2:1/2 3:1 r:1"
KAMPF_A = Teil("I | IV | I | V", f"{KAMPF_KOPF} | 1:1/2 5:1/2 2':1 r:1/2 1':1/2 6:1 | 5:2 2:2")
KAMPF_A2 = Teil("I | IV | ii V | I", f"{KAMPF_KOPF} | 6:1/2 5:1/2 3:1/2 2:1/2 7,:2 | 1:4")
KAMPF_OFFEN = Teil("I | IV | ii | V7", f"{KAMPF_KOPF} | 6:1/2 5:1/2 3:1/2 2:1/2 7,:2 | 5,:1 6,:1 7,:1 2:1")
KAMPF_B = Teil(
    "vi | IV | I | V | vi | IV | ii | V7",
    "6,:1 6,:1 3:1 6,:1 | 4:2 1:2 | 1:1 1:1 5:1 1:1 | 2':4 | "
    "6,:1 6,:1 3:1 6,:1 | 4:2 6:2 | 2:2 6:2 | 5:2 7,:2",
)
KAMPF_TEILE = {"a": KAMPF_A, "a2": KAMPF_A2, "b": KAMPF_B, "a3": KAMPF_OFFEN}
_KAMPF_STIMMEN, _KAMPF_SPUREN = mit_spuren(
    (
        Stimme("kontrabass_pizz", "bass_laufend", 0.8, 0.0, 0.15, 1, 62),
        Stimme("klavier", "stoss", 0.5, -0.2, 0.2, 0, 50),
        Stimme("violinen", "halten", 0.4, 0.25, 0.35, 0, 38),
    ),
    (
        Stimme("klavier", "melodie", 0.8, -0.1, 0.25, OBEN, 62, MELODIE_TEILE),
        Stimme("cello", "melodie", 0.7 * GEGEN_ANHEBUNG, 0.15, 0.3, 0, 56, nur("b")),
    ),
    (Stimme("violinen", "melodie", 0.5, 0.2, 0.35, OBEN, 52),),
)
SUMMIT_CITY_CLUBKAMPF = Satz(
    "summitCity.clubkampf",
    "Summit City, Clubkampf",
    TONART,
    126,
    4,
    KAMPF_TEILE,
    FORM,
    _KAMPF_STIMMEN,
    akt=AKT,
    spuren=_KAMPF_SPUREN,
    zusatz="steigerung",
    beschreibung="Kampfthema Akt 4: der Kopf von Summit City in Achteln, Klavier, Bass; Violinen steigern.",
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

STUECKE = (SUMMIT_CITY, SUMMIT_CITY_NACHT, SUMMIT_CITY_LERNEN, SUMMIT_CITY_CLUBKAMPF, HASTINGS)
