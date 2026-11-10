"""Bootsschuppen mit dem Tor zum Wasser (Möbelangabe ``zum_wasser``, Runde 8).

Warum: Die Prüfung „Vorderseite zur Wand“ hielt Wasser vor dem Tor für eine Wand. Ein Bootsschuppen
gehört aber genau so ans Ufer; nur Möbel mit ``zum_wasser`` dürfen deshalb zum Wasser zeigen.
"""

from pipeline.abenteuer.kartenbau import platziere
from pipeline.abenteuer.kartenregeln import pruefe_regeln

SCHUPPEN = {
    "breite": 48,
    "hoehe": 64,
    "kollision": True,
    "art": "gebaeude",
    "blick": "unten",
    "quelle": "b.png",
}
ZEILEN = ["......", "......", "......", "......", "~~~~~~"]


def befunde(angabe: dict) -> list[str]:
    szene = {"objekte": [{"moebel": "schuppen", "feld": [1, 0]}]}
    moebel = {"schuppen": angabe}
    gesetzt, _ = platziere(szene, moebel)
    return pruefe_regeln(szene, ZEILEN, gesetzt, moebel)


def test_bootsschuppen_darf_zum_wasser_zeigen():
    assert not [b for b in befunde({**SCHUPPEN, "zum_wasser": True}) if "Vorderseite" in b]


def test_haus_ohne_angabe_zeigt_nicht_zum_wasser():
    assert [b for b in befunde(SCHUPPEN) if "Vorderseite" in b]
