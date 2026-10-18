"""Die eingecheckten App-Daten müssen zum Vertrag (schemas/) passen."""

import json
from pathlib import Path

from pipeline.pruefen.daten import pruefe_datenordner, pruefe_trainerordner

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


TRAINER = DATEN.parent / "trainer"


def test_eingecheckte_trainerdaten_sind_gueltig():
    assert pruefe_trainerordner(TRAINER) == []


def test_trainerdaten_kopie_vergessen(tmp_path):
    for datei in TRAINER.glob("*.json"):
        (tmp_path / datei.name).write_text(datei.read_text(encoding="utf-8"), encoding="utf-8")
    (tmp_path / "taktik.json").write_text('{"kaputt": true}', encoding="utf-8")
    fehler = pruefe_trainerordner(tmp_path, quelle=TRAINER)
    assert any(f.startswith("trainer/taktik.json: ") and "weicht" not in f for f in fehler)
    assert any("weicht von" in f for f in fehler)
