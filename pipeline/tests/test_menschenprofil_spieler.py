"""Tests der Spielerauswahl (pipeline/menschenprofil/spieler.py): Kategorien und Auswahl der Aktivsten."""

from pipeline.menschenprofil.spieler import kategorie, tempo_von, waehle


def test_kategorie_wie_in_der_auswertung():
    assert kategorie(399) is None
    assert kategorie(1234) == 1200
    assert kategorie(2150) == 2000
    assert kategorie(2599) == 2400
    assert kategorie(2600) is None


def test_tempo_ohne_bullet():
    assert tempo_von({"Event": "Rated Rapid game"}) == "rapid"
    assert tempo_von({"Event": "Rated Bullet game"}) is None
    assert tempo_von({"Event": "Casual Blitz game"}) is None


def test_waehle_nimmt_aktive_spieler_mit_mittlerer_wertung():
    zaehler = {("blitz", "a"): 5, ("blitz", "b"): 1, ("rapid", "c"): 3}
    summe = {("blitz", "a"): 5 * 1300, ("blitz", "b"): 1500, ("rapid", "c"): 3 * 2100}
    gewaehlt = waehle(zaehler, summe)
    assert gewaehlt == {
        "blitz|a": {"tempo": "blitz", "kategorie": 1200},
        "rapid|c": {"tempo": "rapid", "kategorie": 2000},
    }
