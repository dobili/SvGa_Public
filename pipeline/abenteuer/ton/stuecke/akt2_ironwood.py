"""Ironwood: das einprägsame Ortsthema in f-Moll und seine Fassungen, dazu die Fanfare (Klangplan A0, 2A1).

Warum: Ironwood ist fest und schwer, das Gegenstück zu Riverton. Tiefe Bläser halten die Akkorde,
ein Schmiedehammer gibt den Schlag, darüber singt eine warme Klarinette ein Arbeiterlied. Seit der
Umstellung auf A0 (Etappe Akt 2, 22.11.2026):

- Kopf (2 Takte): F As C | Des C. Der Anfang des alten Arbeiterlieds war schon ein guter Kopf:
  steigender Moll-Dreiklang, dann das lange Des (kleine Sexte) als Kennzeichen, zurück auf C.
- Form A A' B A' offen; im B-Teil schweigt die Klarinette, die Posaune antwortet tief.
- Drei Spuren: grund (Tuba, Posaunen, Hammer), melodie, zusatz (Horn als Farbe).
- Tag 76 statt 60 (A0: mittleres Tempo), Nacht 60, Kantine 84 (Akkordeon, Hammer fern),
  Feier 120 (Tanz).
- Der Clubkampf ist die Steigerung des Kampfthemas von Akt 2 (Riverton): derselbe geschärfte Kopf
  in f-Moll, 132, tiefes Blech und Hammer; Zusatzspur die Trompete.

Ersatz (die freien Bibliotheken haben weder Amboss noch Akkordeon):
- Schmiedehammer: ein kurzer, sehr tiefer Ton des trockenen Flügels (der Schlag) zusammen mit einer
  kurzen Röhrenglocke (das Metall).
- Akkordeon: die Zugriegelorgel (``hammond``) für die linke Hand und die Akkorde, die Mundharmonika
  für den Diskant in der Feier.
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke.akt2_riverton import KAMPF_FORM, KAMPF_TEILE
from pipeline.abenteuer.ton.stuecke.kurz import kurz
from pipeline.abenteuer.ton.stuecke.maple import GEGEN_ANHEBUNG, mit_spuren

TONART = "f"
AKT = 2
OBEN = 1
# Ein Takt des Hammers: schwerer Schlag auf 1, leichterer auf 3.
HAMMER_TAKT = ">1:0.25 r:1.75 1:0.25 r:1.75"
STILL_TAKT = "r:4"
HAMMER = "hammer"

KOPF = "1:1 3:1 5:2 | 6:3 5:1"
A_AKKORDE = "i | VI | iv | V"
A_MELODIE = f"{KOPF} | 4:1 6:1 1':2 | 5:4"
A2_AKKORDE = "i | VI | iv V | i"
A2_MELODIE = f"{KOPF} | 4:1 3:1 2:1 #7,:1 | 1:4"
OFFEN_AKKORDE = "i | VI | iv | V V7"
OFFEN_MELODIE = f"{KOPF} | 4:1 3:1 2:1 #7,:1 | 2:1 #7,:1 5,:1 #7,:1"
B_AKKORDE = "III | VII | VI | III | iv | i | iv | V7"
# B: Die Posaune antwortet tief (als Melodie des Teils), endet auf C7.
B_MELODIE = "3:2 5:2 | 2:2 7,:2 | 1:2 6,:2 | 3:4 | 4:2 6:2 | 5:2 3:2 | 4:2 6,:2 | 5,:2 #7,:2"


def _takte(akkorde: str) -> int:
    """Anzahl der Takte einer Akkordzeile. Beispiel: „i | VI | iv | V“ hat vier."""
    return len(akkorde.split("|"))


def hammer(akkorde: str, melodie: str = "", jeder: int = 1) -> Teil:
    """Ein Teil mit dem Schmiedehammer als eigener Linie; ``jeder`` = nur jeder n-te Takt."""
    schlaege = [HAMMER_TAKT if i % jeder == 0 else STILL_TAKT for i in range(_takte(akkorde))]
    return Teil(akkorde, melodie, {HAMMER: " | ".join(schlaege)})


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


def teile(jeder: int = 1) -> dict[str, Teil]:
    """Die Teile des Themas mit Hammer; ``jeder`` dünnt den Hammer aus (Kantine, Nacht: fern)."""
    return {
        "a": hammer(A_AKKORDE, A_MELODIE, jeder),
        "a2": hammer(A2_AKKORDE, A2_MELODIE, jeder),
        "b": hammer(B_AKKORDE, B_MELODIE, jeder),
        "a3": hammer(OFFEN_AKKORDE, OFFEN_MELODIE, jeder),
    }


FORM = ("a", "a2", "b", "a3")
MELODIE_TEILE = nur("a", "a2", "a3")


def _hammerstimmen(lautstaerke: float, hall: float) -> tuple[Stimme, ...]:
    """Der Schmiedehammer: tiefer Schlag des trockenen Flügels und das Klingen der Röhrenglocke."""
    return (
        Stimme("klavier_trocken", "noten", lautstaerke, 0.0, hall, -2, 72, kennung=HAMMER),
        Stimme("roehrenglocken", "noten", lautstaerke * 0.45, 0.3, hall + 0.15, OBEN, 50, kennung=HAMMER),
    )


def _melodie(instrument: str, staerke: int, b_instrument: str = "posaune") -> tuple[Stimme, ...]:
    """Melodie in A (Klarinette in ihrer tiefen Lage), Antwort tief im B-Teil (lauter, A0.6)."""
    return (
        Stimme(instrument, "melodie", 0.85, 0.15, 0.3, 0, staerke, MELODIE_TEILE),
        Stimme(b_instrument, "melodie", 0.7 * GEGEN_ANHEBUNG, -0.1, 0.3, 0, staerke - 4, nur("b")),
    )


def _ironwood(
    kennung: str,
    titel: str,
    tempo: float,
    spuren: tuple[tuple[Stimme, ...], tuple[Stimme, ...], tuple[Stimme, ...]],
    text: str,
    jeder: int = 1,
) -> Satz:
    """Eine Fassung des Themas in drei Spuren (Zusatz: Farbe)."""
    stimmen, gruppen = mit_spuren(*spuren)
    return Satz(
        kennung,
        titel,
        TONART,
        tempo,
        4,
        teile(jeder),
        FORM,
        stimmen,
        akt=AKT,
        spuren=gruppen,
        zusatz="farbe",
        beschreibung=text,
    )


HORN = (Stimme("horn", "halten", 0.45, 0.0, 0.35, 0, 44),)

IRONWOOD = _ironwood(
    "ironwood",
    "Ironwood",
    76,
    (
        (
            Stimme("posaune", "halten", 0.55, -0.25, 0.35, -1, 48),
            Stimme("tuba", "bass_grund", 0.7, 0.0, 0.3, 1, 56),
            *_hammerstimmen(0.8, 0.3),
        ),
        _melodie("klarinette", 60),
        HORN,
    ),
    "Schwer, rußig: die Klarinette singt den Kopf über Posaunen, Tuba und dem Schmiedehammer.",
)

IRONWOOD_NACHT = _ironwood(
    "ironwood.nacht",
    "Ironwood, Nacht",
    60,
    (
        (Stimme("tuba", "halten", 0.5, 0.0, 0.4, 1, 44), *_hammerstimmen(0.3, 0.5)),
        _melodie("klarinette", 52),
        HORN,
    ),
    "Nacht: dieselbe Melodie langsam, die Tuba hält, der Hammer fern.",
    jeder=4,
)

IRONWOOD_KANTINE = _ironwood(
    "ironwood.kantine",
    "Ironwood, Kantine",
    84,
    (
        (Stimme("hammond", "stride", 0.45, -0.25, 0.25, 0, 44), *_hammerstimmen(0.25, 0.55)),
        _melodie("klarinette", 56, "hammond"),
        (Stimme("mundharmonika", "tupfen", 0.35, 0.0, 0.25, OBEN, 40),),
    ),
    "Drinnen warm: das Thema mit Akkordeon (Orgel) statt Bläsern, Klarinette, der Hammer fern.",
    jeder=2,
)

IRONWOOD_FEIER = _ironwood(
    "ironwood.feier",
    "Ironwood, Feier",
    120,
    (
        (
            Stimme("hammond", "stride", 0.55, -0.25, 0.2, 0, 52),
            Stimme("schlagwerk", "klatschen", 0.45, 0.3, 0.2, staerke=60),
            Stimme("schlagwerk", "tamburin", 0.25, -0.3, 0.2, staerke=46),
        ),
        _melodie("klarinette", 66, "mundharmonika"),
        (Stimme("mundharmonika", "tupfen", 0.4, 0.0, 0.25, OBEN, 48),),
    ),
    "Ausgelassen: das Thema als Tanz, Klarinette, Akkordeon (Orgel, Mundharmonika), Klatschen.",
)

# Clubkampf: Steigerung des Kampfthemas von Akt 2 (Riverton) in f-Moll, tiefes Blech und Hammer.
# Die Teile des Kampfthemas tragen keine eigenen Linien; dazu kommt der Hammer.
_KAMPF_TEILE = {name: hammer(teil.akkorde, teil.melodie) for name, teil in KAMPF_TEILE.items()}
_KAMPF_STIMMEN, _KAMPF_SPUREN = mit_spuren(
    (
        Stimme("tuba", "bass_laufend", 0.85, 0.0, 0.15, 1, 70),
        Stimme("posaune", "stoss", 0.55, -0.2, 0.2, -1, 60),
        *_hammerstimmen(0.85, 0.25),
    ),
    (
        Stimme("horn", "melodie", 0.8, 0.15, 0.25, 0, 70, MELODIE_TEILE),
        Stimme("posaune", "melodie", 0.75 * GEGEN_ANHEBUNG, -0.1, 0.25, 0, 64, nur("b")),
    ),
    (Stimme("trompete", "melodie", 0.6, 0.0, 0.2, OBEN, 66),),
)
IRONWOOD_CLUBKAMPF = Satz(
    "ironwood.clubkampf",
    "Ironwood, Clubkampf",
    TONART,
    132,
    4,
    _KAMPF_TEILE,
    KAMPF_FORM,
    _KAMPF_STIMMEN,
    akt=AKT,
    spuren=_KAMPF_SPUREN,
    zusatz="steigerung",
    beschreibung="Steigerung des Kampfthemas: Kopf von Riverton in f-Moll, Blech und Hammer, Trompete dazu.",
)

FANFARE_IRONWOOD = kurz(
    "fanfare.ironwood",
    "Fanfare, Ironwood",
    112,
    4,
    Teil(
        "I | I",
        "1:0.5 3:0.5 5:0.5 1':2.5 | r:4",
        {"aha": "r:4 | 2':0.25 5':0.5 1'':3.25", HAMMER: ">1:0.25 r:3.75 | r:4"},
    ),
    (
        Stimme("horn", "melodie", 0.85, 0.15, 0.3, OBEN, 72),
        Stimme("posaune", "stoss", 0.6, -0.25, 0.3, -1, 60),
        Stimme("tuba", "bass_grund", 0.65, 0.0, 0.3, 1, 60),
        *_hammerstimmen(0.8, 0.3),
        Stimme("glockenspiel", "noten", 0.6, 0.3, 0.4, OBEN, 70, kennung="aha"),
    ),
    "Horn, Posaune, Tuba und ein Hammerschlag: F-Dur-Dreiklang aufwärts, endet mit dem Aha.",
    tonart="F",
    akt=AKT,
)

STUECKE = (IRONWOOD, IRONWOOD_NACHT, IRONWOOD_KANTINE, IRONWOOD_FEIER, IRONWOOD_CLUBKAMPF, FANFARE_IRONWOOD)
