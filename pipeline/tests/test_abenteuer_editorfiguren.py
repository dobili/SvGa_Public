"""Tests für Editor 1.2: Figuren löschen und kopieren (Warnungen im Rücklauf, ``editorfiguren``),
Varianten im Paket und ihr Rückweg (``editorpaket``, ``editorrueck``).

Warum: Eine gelöschte Figur, die ein Ink-Knoten oder eine Quest braucht, macht die Handlung
unerreichbar; der Rücklauf muss das melden. Die Figurtests lesen die echten ``orte.json`` und
``quests.json`` (Ambrose im Dachboden von Maple Falls), die Szenen sind kleine Kunstdaten.
"""

import json

import pytest

from pipeline.abenteuer import editorpaket, editorrueck
from pipeline.abenteuer.editorfiguren import figurangabe, figurwarnungen

RASTER = ["####", "#..#", "####"]
DACHBODEN = {"karte": "mapleFalls.dachboden", "raster": RASTER, "objekte": []}


def _eintrag(vorher: dict, nachher: dict, datei: str = "dachboden.json") -> dict:
    return {"datei": datei, "karte": nachher["karte"], "vorher": vorher, "nachher": nachher, "zuordnung": []}


def test_figur_aus_orte_json_wie_in_der_app():
    ambrose = figurangabe("mapleFalls", "ambrose")
    assert ambrose and ambrose["dialog"] == "maple-falls-dachboden.ambrose"
    assert figurangabe("mapleFalls", "gibtsnicht") is None


def test_geloeschte_figur_mit_dialog_wird_gewarnt(tmp_path):
    vorher = {**DACHBODEN, "figuren": [{"name": "ambrose", "feld": [1, 1]}]}
    nachher = {**DACHBODEN, "figuren": []}
    warnungen = figurwarnungen(_eintrag(vorher, nachher), tmp_path)
    assert len(warnungen) == 1
    assert warnungen[0].startswith(
        "WARNUNG: Figur ambrose gelöscht: Ink-Knoten maple-falls-dachboden.ambrose"
    )
    assert "auf keiner anderen Karte von mapleFalls" in warnungen[0]
    # Steht sie auf einer Fassung derselben Karte noch, sagt der Bericht wo.
    (tmp_path / "dachboden-ohne-brett.json").write_text(json.dumps(vorher), encoding="utf-8")
    assert (
        "steht noch auf dachboden-ohne-brett.json" in figurwarnungen(_eintrag(vorher, nachher), tmp_path)[0]
    )


def test_kopierte_figur_und_geloeschter_statist(tmp_path):
    statist = {"name": "leser", "typ": "statist", "feld": [2, 1], "eigenschaften": {"sagt": "statist.x"}}
    vorher = {**DACHBODEN, "figuren": [{"name": "ambrose", "feld": [1, 1]}], "belebung": [statist]}
    nachher = {**DACHBODEN, "figuren": [{"name": "ambrose", "feld": [1, 1]}] * 2, "belebung": []}
    warnungen = figurwarnungen(_eintrag(vorher, nachher), tmp_path)
    assert "WARNUNG: Figur ambrose steht jetzt 2× auf der Karte (Kopie mit Strg+D?)" in warnungen
    assert any(w.startswith("Hinweis: Statist leser gelöscht (sagt statist.x") for w in warnungen)


def test_figur_ohne_dialog_und_quest_ist_still(tmp_path):
    vorher = {**DACHBODEN, "figuren": [{"name": "niemand", "feld": [1, 1]}]}
    assert figurwarnungen(_eintrag(vorher, {**DACHBODEN, "figuren": []}), tmp_path) == []


def test_paket_nimmt_varianten_als_eigene_dateien(tmp_path):
    (tmp_path / "varianten").mkdir()
    (tmp_path / "raum.json").write_text(json.dumps(DACHBODEN), encoding="utf-8")
    (tmp_path / "varianten" / "raum-b.json").write_text(json.dumps({**DACHBODEN, "variante": "b"}), "utf-8")
    namen = [name for name, _ in editorpaket.lade_szenen(tmp_path)]
    assert namen == ["raum.json", "varianten/raum-b.json"]
    angaben = editorpaket.figurangaben(
        json.loads(editorpaket.INHALTE.joinpath("orte.json").read_text())["orte"], "mapleFalls"
    )
    assert angaben["ambrose"]["wenn"] == "nicht abschiedGesehen"


def test_ruecklauf_schreibt_varianten_an_ihren_ort(tmp_path):
    szenen = tmp_path / "szenen"
    (szenen / "varianten").mkdir(parents=True)
    vorher = {**DACHBODEN, "variante": "b"}
    nachher = {**vorher, "raster": ["####", "#.~#", "####"]}
    (szenen / "varianten" / "raum-b.json").write_text(editorrueck.als_text(vorher), encoding="utf-8")
    aenderung = {
        "format": "karteneditor-aenderungen",
        "fassung": 1,
        "editor_version": "1.2.0",
        "szenen": [_eintrag(vorher, nachher, "varianten/raum-b.json")],
    }
    datei = tmp_path / "aenderung.json"
    datei.write_text(json.dumps(aenderung), encoding="utf-8")
    assert editorrueck.main([str(datei), "--szenen", str(szenen), "--bericht", str(tmp_path / "b")]) == 0
    assert json.loads((szenen / "varianten" / "raum-b.json").read_text(encoding="utf-8")) == nachher
    aenderung["szenen"][0]["datei"] = "andere/raum-b.json"
    datei.write_text(json.dumps(aenderung), encoding="utf-8")
    with pytest.raises(ValueError):
        editorrueck.lies(datei)
