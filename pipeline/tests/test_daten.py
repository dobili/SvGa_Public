"""Die eingecheckten App-Daten müssen zum Vertrag (schemas/) passen."""

import json
from pathlib import Path

from pipeline.pruefen.daten import finde_entwuerfe, main, pruefe_datenordner

HAUPTORDNER = Path(__file__).resolve().parents[2]
DATEN = HAUPTORDNER / "app" / "public" / "daten" / "de" / "a1"


def test_eingecheckte_daten_sind_gueltig():
    assert pruefe_datenordner(DATEN) == []


def test_abweichung_zum_verzeichnis_wird_gemeldet(tmp_path):
    index = json.loads((DATEN / "index.json").read_text(encoding="utf-8"))
    index["kapitel"][0]["abbildungen"] = index["kapitel"][0]["abbildungen"][:-1]
    (tmp_path / "index.json").write_text(json.dumps(index), encoding="utf-8")
    for datei in DATEN.glob("*.json"):
        if datei.name != "index.json":
            (tmp_path / datei.name).write_text(datei.read_text(encoding="utf-8"), encoding="utf-8")
    erstes = index["kapitel"][0]["datei"]
    assert pruefe_datenordner(tmp_path) == [f"{erstes}: Abbildungen weichen vom Verzeichnis ab"]


def test_fehlendes_verzeichnis(tmp_path):
    assert pruefe_datenordner(tmp_path) == [f"{tmp_path / 'index.json'}: fehlt"]


def test_eingecheckte_daten_ohne_entwuerfe():
    """Vor 1.0 (AP 17): Die ausgelieferten Daten enthalten keinen Entwurf."""
    assert finde_entwuerfe(DATEN) == []


def test_entwurf_wird_nur_fuer_die_veroeffentlichung_gemeldet(tmp_path, capsys):
    for datei in DATEN.glob("*.json"):
        (tmp_path / datei.name).write_text(datei.read_text(encoding="utf-8"), encoding="utf-8")
    kapitel = json.loads((tmp_path / "kap01.json").read_text(encoding="utf-8"))
    kapitel["abbildungen"][0]["status_test"] = {"id": "z-test", "status": "entwurf"}
    (tmp_path / "kap01.json").write_text(json.dumps(kapitel), encoding="utf-8")
    assert finde_entwuerfe(tmp_path) == ["kap01.json: Entwurf z-test"]
    assert main(["--veroeffentlichung", str(tmp_path)]) == 1
    assert "Entwurf z-test" in capsys.readouterr().out
