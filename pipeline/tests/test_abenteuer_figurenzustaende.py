"""Tests für pipeline/abenteuer/figurenzustaende.py: Zustände je Figur aus Szenen und Ink."""

from pipeline.abenteuer.figurenzustaende import als_html, ermittle, sitzart

KATALOG = {"stuhlRechts": {"breite": 16, "hoehe": 32, "art": "stuhl"}, "tisch": {"breite": 32, "hoehe": 16}}


def test_sitzart_stuhl_nur_im_bild_eines_sitzmoebels():
    objekte = [{"moebel": "stuhlRechts", "feld": [5, 7]}, {"moebel": "tisch", "feld": [6, 7]}]
    assert sitzart([5, 8], objekte, KATALOG) == "stuhl"
    assert sitzart([6, 7], objekte, KATALOG) == "boden"
    assert sitzart([5, 9], objekte, KATALOG) == "boden"


def test_bedarf_aus_den_echten_daten():
    bedarf = ermittle()
    assert "boden" in bedarf["juno"].stellen
    assert "stuhl" in bedarf["sam"].stellen
    assert "liegen" in bedarf["held"].stellen
    assert "noch kein Bild" in als_html(bedarf, None)


def test_rennen_aus_ink_statisten_und_held():
    bedarf = ermittle()
    assert "rennen" in bedarf["juno"].stellen
    assert "rennen" in bedarf["held"].stellen
    assert "rennen" in bedarf["kindA (statist-02)"].stellen
