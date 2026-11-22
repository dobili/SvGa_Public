"""Tests für pipeline/abenteuer/brettbeispiel.py und brettbeispiel_pruefung.py: Bestandsaufnahme der
Erklärstellen und schachliche Prüfung der Brettbeispiele (Wunsch des Autors, 22.11.2026)."""

import copy
import json

from pipeline.abenteuer import brettbeispiel as bb
from pipeline.abenteuer.brettbeispiel_pruefung import pruefe_beispiel


def _daten() -> dict:
    return json.loads(bb.BEISPIELE.read_text(encoding="utf-8"))


def _beispiel(kennung: str) -> dict:
    return copy.deepcopy(next(b for b in _daten()["beispiele"] if b["kennung"] == kennung))


def test_dauertest_jede_erklaerung_hat_brett_oder_grund():
    """Neue Erklärungen in Ink brauchen ein Beispiel (#brett) oder einen Grund in brettbeispiel_ohne.py."""
    assert bb.befunde(bb.fundstellen(), _daten()) == []


def test_alle_beispiele_stimmen_schachlich():
    assert [b for x in _daten()["beispiele"] for b in pruefe_beispiel(x)] == []


def test_gabel_die_nur_eine_figur_angreift_faellt_auf():
    b = _beispiel("springergabel")
    b["pruefung"][0]["ziele"] = ["f6", "h1"]
    assert any("h1" in x for x in pruefe_beispiel(b))


def test_falsche_fesselung_und_falscher_spiess_fallen_auf():
    b = _beispiel("fesselung")
    b["fen"] = "4k3/8/2n5/8/1B6/8/8/4K3 b - - 0 1"
    assert any("nicht gefesselt" in x for x in pruefe_beispiel(b))
    s = _beispiel("turmspiess")
    s["pruefung"][0]["hinten"] = "b1"
    assert any("Spieß" in x for x in pruefe_beispiel(s))


def test_illegale_stellung_und_falscher_pfeil_fallen_auf():
    b = _beispiel("opposition")
    b["fen"] = "8/8/4k3/4K3/8/8/4P3/8 b - - 0 1"
    assert any("legal" in x or "Opposition" in x for x in pruefe_beispiel(b))
    p = _beispiel("damengabel")
    p["bilder"][0]["pfeile"].append({"von": "g1", "nach": "g5", "farbe": "rot"})
    assert any("g1-g5" in x for x in pruefe_beispiel(p))


def test_quadrat_matt_und_zaehlen():
    q = _beispiel("quadrat")
    q["pruefung"][0]["faengt"] = True
    assert any("Quadrat" in x for x in pruefe_beispiel(q))
    m = _beispiel("anastasia")
    m["bilder"][1]["nach"] = 1
    assert any("Matt" in x for x in pruefe_beispiel(m))
    z = _beispiel("angreiferzaehlen")
    z["pruefung"][0]["angreifer"] = 2
    assert any("Zählen" in x for x in pruefe_beispiel(z))


def test_unbekannte_marke_und_offene_stelle_werden_gemeldet(tmp_path, monkeypatch):
    (tmp_path / "probe.ink").write_text(
        "=== lehrer ===\nDas nennt man Gabel. #sprecher:lehrer\nHier. #sprecher:lehrer #brett:gibtsnicht\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(bb, "DIALOGE", tmp_path)
    funde = bb.fundstellen(tmp_path)
    liste = bb.befunde(funde, _daten())
    assert any("weder Brett noch Grund" in x for x in liste)
    assert any("gibtsnicht" in x for x in liste)
