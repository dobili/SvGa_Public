"""Tests der Stadtgröße (Regel 10.51): Städte brauchen je nach Ortsgröße genug Gebäude."""

import json
from pathlib import Path

from pipeline.abenteuer.stadtgroesse import ist_gebaeude, ortsgroesse, pruefe_gebaeude

HAUS = {"breite": 96, "hoehe": 112, "kollision": True}


def _orte(tmp_path: Path) -> Path:
    pfad = tmp_path / "orte.json"
    orte = [{"kennung": "riverton", "groesse": "mittel"}, {"kennung": "wegA"}]
    pfad.write_text(json.dumps({"orte": orte}), encoding="utf-8")
    return pfad


def _szene(karte: str, **mehr: object) -> dict:
    return {"karte": karte, "art": "aussen", **mehr}


def test_grosses_moebel_ist_gebaeude_baum_nicht() -> None:
    assert ist_gebaeude("rv5Reihenhaus", HAUS)
    assert not ist_gebaeude("rv5Tanne", HAUS)
    assert not ist_gebaeude("rv5Kiosk", {"breite": 48, "hoehe": 48})


def test_angabe_gebaeude_entscheidet() -> None:
    assert ist_gebaeude("rvBude", {"breite": 32, "hoehe": 32, "gebaeude": True})
    assert not ist_gebaeude("rvBuehne", {**HAUS, "gebaeude": False})
    assert ist_gebaeude("rvLaden", {"art": "haus", "breite": 48, "hoehe": 48})


def test_ortsgroesse_aus_orte(tmp_path: Path) -> None:
    orte = _orte(tmp_path)
    assert ortsgroesse("riverton.aussen", orte) == "mittel"
    assert ortsgroesse("wegA.kanal", orte) is None


def test_zu_wenige_gebaeude_gemeldet(tmp_path: Path) -> None:
    gesetzt = [{"name": "rvHaus"}] * 5
    befunde = pruefe_gebaeude(_szene("riverton.aussen"), gesetzt, {"rvHaus": HAUS}, _orte(tmp_path))
    assert befunde and "5 Gebäude" in befunde[0] and "mindestens 20" in befunde[0]


def test_genug_gebaeude_und_andere_karten_still(tmp_path: Path) -> None:
    orte = _orte(tmp_path)
    voll = [{"name": "rvHaus"}] * 20
    assert pruefe_gebaeude(_szene("riverton.aussen"), voll, {"rvHaus": HAUS}, orte) == []
    # Ein Platz der Stadt ohne "viertel" und ein Weg zählen nicht.
    assert pruefe_gebaeude(_szene("riverton.pavillon"), [], {}, orte) == []
    assert pruefe_gebaeude(_szene("wegA.aussen"), [], {}, orte) == []


def test_viertel_zaehlt_als_stadtkarte(tmp_path: Path) -> None:
    befunde = pruefe_gebaeude(_szene("riverton.altstadt", viertel=True), [], {}, _orte(tmp_path))
    assert befunde


def test_archiv_nach_wahl_wird_erkannt(tmp_path: Path) -> None:
    from pipeline.abenteuer.kartenbau import ist_archiv

    varianten = tmp_path / "varianten"
    varianten.mkdir()
    for name in ("ortA-aussen-a.json", "ortA-aussen-b.json", "ortB-aussen-b.json"):
        (varianten / name).write_text("{}", encoding="utf-8")
    assert ist_archiv(varianten / "ortA-aussen-b.json")
    assert ist_archiv(varianten / "ortA-aussen-a.json")
    assert not ist_archiv(varianten / "ortB-aussen-b.json")
    assert not ist_archiv(tmp_path / "ortA-aussen.json")
