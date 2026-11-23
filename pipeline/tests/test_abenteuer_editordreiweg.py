"""Tests des Dreiwege-Rücklaufs (editordreiweg.py, editorrueck.py --dreiweg) und der Prüfregeln, die
die Kartenänderungen des Autors vom 20.11.2026 brauchten (vergrößerter Zaun, offene Torflügel).

Ohne privates Repository: kleine Szenen im Arbeitsordner.
"""

import json

from pipeline.abenteuer import editordreiweg as D
from pipeline.abenteuer import editorrueck as R
from pipeline.abenteuer.bauweisen import vergroesserter_zaun
from pipeline.abenteuer.zusammenhang import pruefe_zaeune

BANK = {"moebel": "mfBank", "feld": [5, 5]}
TOR = {"moebel": "mf10TorOffen1", "feld": [3, 3]}
ZAUN = {"moebel": "mf4ZaunSeite", "feld": [30, 11]}


def _eintrag(vorher: list, nachher: list, zuordnung: list) -> dict:
    return {
        "datei": "probe.json",
        "vorher": {"objekte": vorher, "figuren": [{"name": "carla", "feld": [45, 23]}]},
        "nachher": {"objekte": nachher, "figuren": [{"name": "carla", "feld": [47, 23]}]},
        "zuordnung": zuordnung,
    }


def test_aenderung_des_autors_und_heutige_aenderung_bleiben_beide():
    # Autor: Zaun verschoben, Haus neu. Heute: Bank im Maß (massstab, versatz), Tor gelöscht.
    eintrag = _eintrag(
        [BANK, TOR, ZAUN], [BANK, TOR, {**ZAUN, "feld": [24, 9]}, {"moebel": "haus"}], [0, 1, 2, None]
    )
    heute = {"objekte": [{**BANK, "massstab": 0.75}, ZAUN], "figuren": eintrag["vorher"]["figuren"]}
    szene, zeilen = D.szene(eintrag, heute)
    assert szene["objekte"] == [{**BANK, "massstab": 0.75}, {**ZAUN, "feld": [24, 9]}, {"moebel": "haus"}]
    assert szene["figuren"] == [{"name": "carla", "feld": [47, 23]}]
    assert any("umgesetzt: mf4ZaunSeite (30, 11) feld" in z for z in zeilen)


def test_merkmal_heute_anders_ist_ein_konflikt_und_bleibt():
    vorher, autor, heute = (
        {**BANK, "versatz": [0, 3]},
        {**BANK, "versatz": [0, 8]},
        {**BANK, "versatz": [4, 8]},
    )
    neu, konflikte = D.merkmale(vorher, autor, heute)
    assert neu == heute and konflikte == ["versatz: vorher [0, 3], Autor [0, 8], heute [4, 8]"]


def test_geloeschtes_objekt_das_es_heute_nicht_mehr_gibt():
    objekte, zeilen = D.objekte([BANK, TOR], [BANK], [0], [BANK])
    assert objekte == [BANK] and zeilen == ["schon so: mf10TorOffen1 (3, 3) gibt es heute nicht mehr"]


def test_listen_mit_namen_werden_als_aenderung_erkannt():
    alt = [{"name": "kinder", "feld": [1, 1]}, {"name": "lehrer", "feld": [2, 2]}]
    neu = [{"name": "kinder", "feld": [1, 2]}, {"name": "lehrer", "feld": [2, 2]}]
    heute = [*alt, {"name": "neuerStatist", "feld": [9, 9]}]
    ergebnis, _ = D.liste(alt, neu, heute)
    assert ergebnis == [neu[0], neu[1], heute[2]]


def test_editorrueck_dreiweg_schreibt_statt_konflikt(tmp_path):
    eintrag = _eintrag([BANK, ZAUN], [BANK, {**ZAUN, "feld": [24, 9]}], [0, 1])
    (tmp_path / "probe.json").write_text(
        json.dumps({"objekte": [ZAUN, BANK], "figuren": []}), encoding="utf-8"
    )
    daten = {"szenen": [eintrag]}
    assert R.schreibe(daten, tmp_path, False) == ([], ["probe.json"])
    dreiweg: dict = {}
    assert R.schreibe(daten, tmp_path, False, dreiweg) == (["probe.json"], [])
    szene = json.loads((tmp_path / "probe.json").read_text(encoding="utf-8"))
    assert szene["objekte"] == [{**ZAUN, "feld": [24, 9]}, BANK] and dreiweg["probe.json"]


def test_vergroesserter_zaun_darf_sich_und_das_tor_ueberlappen():
    moebel = {
        "zaun": {"breite": 16, "art": "zaun"},
        "tor": {"breite": 48, "art": "zaun"},
        "bank": {"breite": 16},
    }
    gross, klein = {"name": "zaun", "breite": 24}, {"name": "zaun", "breite": 16}
    assert vergroesserter_zaun(gross, klein, moebel)
    assert vergroesserter_zaun({"name": "tor", "breite": 48}, gross, moebel)
    assert not vergroesserter_zaun(klein, klein, moebel)
    assert not vergroesserter_zaun({"name": "bank", "breite": 24}, gross, moebel)


def test_offene_torfluegel_schliessen_die_zaunluecke():
    moebel = {
        n: {"art": "zaun"} for n in ("wg4ZaunBottomMiddle", "wg13HolztorOffenLinks", "wg13HolztorOffenRechts")
    }
    zaun = [
        {"name": "wg4ZaunBottomMiddle", "x": 800, "y": 168, "breite": 24, "hoehe": 24},
        {"name": "wg4ZaunBottomMiddle", "x": 872, "y": 168, "breite": 24, "hoehe": 24},
    ]
    assert pruefe_zaeune(zaun, moebel)
    fluegel = [
        {"name": "wg13HolztorOffenLinks", "x": 821, "y": 166, "breite": 20, "hoehe": 31},
        {"name": "wg13HolztorOffenRechts", "x": 857, "y": 166, "breite": 20, "hoehe": 32},
    ]
    assert pruefe_zaeune(zaun + fluegel, moebel) == []
