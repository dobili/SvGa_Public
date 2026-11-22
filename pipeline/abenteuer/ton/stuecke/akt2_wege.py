"""Wege und Heimat in Akt 2: Zedernwald, Kanalweg mit dem Fahrrad, Klavier in Maple Falls (Klangplan 2A1).

Warum: Die Wege von Akt 2 haben kein eigenes Thema (Klangplan, Akt 2); seit der Umstellung auf A0
(22.11.2026) spielen sie die neuen Themen von Cedar Creek und Maple Falls in drei Spuren.
Im Zedernwald geht das
Klavier von Cedar Creek weiter, darunter ein leichter, gehender Kontrabass: Man bricht auf, ist aber
noch im Schatten von Cedar Creek. Auf dem Kanalweg spielt das Wegthema (Maple Falls schneller, wie
``weg`` in Akt 1) mit Gitarre und Mundharmonika; am Ende jeder Phrase klingelt ein Glockenspiel wie
eine Fahrradklingel. In der Küche von Maple Falls nach dem Verbot (Kapitel 23) spielt das Thema von
Maple Falls langsam auf dem Klavier allein.

Ersatz: Die Fahrradklingel ist ein doppelter hoher Glockenspielton (das Geräusch ``fahrradklingel``
aus 2B2 bleibt dem Spiel überlassen).
"""

from pipeline.abenteuer.ton.satzplan import Satz, Stimme, Teil
from pipeline.abenteuer.ton.stuecke import cedar
from pipeline.abenteuer.ton.stuecke.maple import FORM as MAPLE_FORM
from pipeline.abenteuer.ton.stuecke.maple import GEGEN_ANHEBUNG, MELODIE_TEILE, mit_spuren
from pipeline.abenteuer.ton.stuecke.maple import teile as maple_teile

AKT = 2
OBEN = 1
# Takte je Phrase im Thema von Maple Falls; am letzten Takt jeder Phrase klingelt es.
PHRASE = 4
KLINGEL_TAKT = "r:3 5'':0.25 r:0.25 5'':0.5"
STILL_TAKT = "r:4"


def nur(*teile: str) -> frozenset[str]:
    """Kurzform für die Teile, in denen eine Stimme spielt."""
    return frozenset(teile)


_ZEDERN_STIMMEN, _ZEDERN_SPUREN = mit_spuren(
    (
        Stimme("klavier", "tupfen", 0.35, -0.15, 0.35, 0, 34),
        Stimme("kontrabass_pizz", "bass_wechsel", 0.75, 0.0, 0.2, 1, 56),
    ),
    (
        Stimme("klavier", "melodie", 0.8, 0.15, 0.35, cedar.MELODIE_OKTAVE, 50, cedar.MELODIE_TEILE),
        Stimme("klavier", "melodie", 0.7 * GEGEN_ANHEBUNG, -0.05, 0.35, 0, 46, nur("b")),
    ),
    (Stimme("cello", "noten", 0.45, 0.0, 0.35, 1, 38, kennung="farbe"),),
)
WEG_ZEDERNWALD = Satz(
    "weg.zedernwald",
    "Zedernwald",
    cedar.TONART,
    76,
    4,
    cedar.TEILE,
    cedar.ORTSFORM,
    _ZEDERN_STIMMEN,
    akt=AKT,
    spuren=_ZEDERN_SPUREN,
    zusatz="farbe",
    beschreibung="Aufbruch im Schatten: das Thema von Cedar Creek mit einem leichten, gehenden Kontrabass.",
)


def mit_klingel(teil: Teil) -> Teil:
    """Derselbe Teil mit einer Klingel am Ende jeder Phrase (je vier Takte; kürzere Teile ohne)."""
    anzahl = len(teil.akkorde.split("|"))
    takte = [KLINGEL_TAKT if (i + 1) % PHRASE == 0 else STILL_TAKT for i in range(anzahl)]
    return Teil(teil.akkorde, teil.melodie, {**teil.linien, "klingel": " | ".join(takte)})


_KANAL = {name: mit_klingel(teil) for name, teil in maple_teile().items()}
_FAHRRAD_STIMMEN, _FAHRRAD_SPUREN = mit_spuren(
    (
        Stimme("gitarre", "travis", 0.8, -0.3, 0.2, 0, 50),
        Stimme("kontrabass_pizz", "bass_zweier", 0.65, 0.0, 0.15, 1, 56),
        Stimme("schlagwerk", "schellen", 0.28, 0.35, 0.2, staerke=42),
    ),
    (
        Stimme("mundharmonika", "melodie", 0.75, 0.2, 0.25, OBEN, 60, MELODIE_TEILE),
        Stimme("cello", "melodie", 0.7 * GEGEN_ANHEBUNG, 0.1, 0.25, 0, 56, nur("b")),
    ),
    # Die Fahrradklingel am Ende jeder Phrase (Glockenspiel) als Farbe.
    (Stimme("glockenspiel", "noten", 0.45, 0.0, 0.3, 0, 62, kennung="klingel"),),
)
WEG_FAHRRAD = Satz(
    "weg.fahrrad",
    "Kanalweg mit dem Fahrrad",
    "G",
    126,
    4,
    _KANAL,
    MAPLE_FORM,
    _FAHRRAD_STIMMEN,
    akt=AKT,
    spuren=_FAHRRAD_SPUREN,
    zusatz="farbe",
    beschreibung="Leicht, Bewegung: das Wegthema schnell, Gitarre und Mundharmonika, Klingel je Phrase.",
)

_MAPLE = maple_teile()
MAPLE_FALLS_KLAVIER = Satz(
    "mapleFalls.klavier",
    "Maple Falls, Klavier allein",
    "G",
    # 66 statt 60: Die einzelnen Anschläge fallen sonst als Spitzen auf (A0.6).
    66,
    4,
    _MAPLE,
    ("a1", "a2", "b", "a5", "a6"),
    (
        # Wiegende Begleitung kräftiger: weniger Spitzen der Melodie über dem Mittel (A0.6).
        Stimme("klavier", "melodie", 0.65, 0.1, 0.4, OBEN, 44),
        Stimme("klavier", "wiegen", 0.8, -0.1, 0.4, -1, 40),
    ),
    akt=AKT,
    beschreibung="Allein, traurig: das Thema von Maple Falls langsam auf dem Klavier allein.",
)

STUECKE = (WEG_ZEDERNWALD, WEG_FAHRRAD, MAPLE_FALLS_KLAVIER)
