"""Tests für pipeline/abenteuer/figurenzustaende.py: Zustände je Figur aus Szenen und Ink."""

from pathlib import Path

import pytest

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


PRIVAT_SPIEL = Path(__file__).resolve().parents[2].parent / "schach-abenteuer-inhalte" / "spiel"


@pytest.mark.skipif(not (PRIVAT_SPIEL / "figuren-neu").exists(), reason="privates Repository fehlt")
def test_jede_sitzende_und_liegende_figur_hat_ihren_zustand_oder_wartet_mit_grund():
    # Wunsch des Autors, 23.11.2026: Wer auf einem Stuhl gezeichnet wird, braucht ein Sitzbild.
    from pipeline.abenteuer import figurenzustaende_ablauf as A
    from pipeline.abenteuer.figurenzustaende import fehlende

    neu = [e for e in fehlende(ermittle(), PRIVAT_SPIEL) if (e[0], e[1]) not in A.WARTET_AUF_BILD]
    assert neu == []


def test_tagesablaeufe_zaehlen_mit():
    bedarf = ermittle()
    stellen = [s for b in bedarf.values() for z in b.stellen.values() for s in z]
    assert any(s.startswith("Tagesablauf") for s in stellen)
