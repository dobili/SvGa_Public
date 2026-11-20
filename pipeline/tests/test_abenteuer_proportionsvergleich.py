"""Tests der Vergleichsseite zur Figurengröße (proportionsvergleich.py, proportionsseite.py)."""

import pytest

pytest.importorskip("PIL.Image")  # die Seite zeichnet Bilder; ohne Pillow (Actions) übersprungen

from pipeline.abenteuer.proportionsseite import sicht
from pipeline.abenteuer.proportionsvergleich import freier_boden, lade_szene, moebel_mal


def test_moebel_kleiner_unten_mittig_und_raumteile_bleiben():
    szene = {
        "objekte": [
            {"moebel": "mfBank", "feld": [1, 1], "id": "bank"},
            {"moebel": "rv5Brett", "feld": [0, 0], "auf": "bank"},
            {"moebel": "mf5TuerSuedHolz", "feld": [5, 5]},
        ]
    }
    neu = moebel_mal(szene, 0.75)
    bank, brett, tuer = neu["objekte"]
    assert bank["massstab"] == 0.75 and bank["versatz"] == [4, 8]  # 32 × 32: 4 nach rechts, 8 hinunter
    assert brett["massstab"] == 0.75 and "versatz" not in brett  # liegt auf der Bank, rückt mit
    assert "massstab" not in tuer  # Tür gehört zum Raum
    assert "massstab" not in szene["objekte"][0]  # Original unverändert


def test_kleinere_moebel_geben_boden_frei():
    szene = lade_szene("maple-falls-clubraum")
    vorher, alle = freier_boden(szene)
    nachher, _ = freier_boden(moebel_mal(szene, 0.75))
    assert 0 < vorher < alle and nachher >= vorher


def test_sicht_bei_groesserer_welt():
    assert sicht(1) == "8.0 × 15.0"
    assert sicht(1.25) == "6.4 × 12.0"
