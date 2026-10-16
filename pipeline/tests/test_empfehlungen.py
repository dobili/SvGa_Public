"""Tests für die von Hand gepflegten Empfehlungen zur Freigabe (``inhalte/de/empfehlungen.json``)."""

import json
import re
from pathlib import Path

from pipeline.zugfolgen.empfehlungen import (
    lies_empfehlungen,
    tabelle_ohne_zugfolge,
    zeilen_zum_beispiel,
)

INHALTE = Path(__file__).resolve().parents[2] / "inhalte" / "de"


def _empfehlungen(tmp_path):
    pfad = tmp_path / "empfehlungen.json"
    daten = {
        "beispiele": [
            {
                "beispiel": "k10-a2",
                "empfehlung": "zusammenführen",
                "mit": "k10-a1",
                "begruendung": "Ein Baum.",
            },
            {"beispiel": "k10-a6", "empfehlung": "getrennt lassen", "begruendung": "Eine Übung."},
        ],
        "abbildungen": [
            {
                "abbildungen": ["10.3", "10.4"],
                "art": "Lehrbild",
                "begruendung": "Ohne Züge.",
                "vorschlag": "–",
            },
        ],
    }
    pfad.write_text(json.dumps(daten), encoding="utf-8")
    return lies_empfehlungen(pfad)


def test_empfehlung_zum_beispiel_mit_verweis(tmp_path):
    empfehlungen = _empfehlungen(tmp_path)
    assert zeilen_zum_beispiel("k10-a2", empfehlungen) == [
        "**Empfehlung: zusammenführen** mit [k10-a1](#k10-a1). Ein Baum.",
        "",
    ]
    assert zeilen_zum_beispiel("k10-a6", empfehlungen)[0] == "**Empfehlung: getrennt lassen**. Eine Übung."
    assert zeilen_zum_beispiel("k10-a9", empfehlungen) == []


def test_tabelle_ohne_zugfolge_zeigt_auch_uneingeordnete(tmp_path):
    zeilen = tabelle_ohne_zugfolge(["10.3", "10.5"], _empfehlungen(tmp_path))
    assert "| 10.3 | Lehrbild | Ohne Züge. | – |" in zeilen
    assert "| 10.5 | – | noch nicht eingeordnet | – |" in zeilen


def test_fehlende_datei_ergibt_keine_empfehlungen(tmp_path):
    empfehlungen = lies_empfehlungen(tmp_path / "gibt-es-nicht.json")
    assert not empfehlungen.beispiele and not empfehlungen.abbildungen


def test_empfehlungen_im_repository_verweisen_auf_vorhandene_beispiele():
    empfehlungen = lies_empfehlungen(INHALTE / "empfehlungen.json")
    vorhanden = {pfad.stem for pfad in (INHALTE / "zugfolgen").glob("kap*/*.pgn")}
    # Umgesetzte Empfehlungen zu Beispielen werden gestrichen; die Einordnung der Abbildungen
    # ohne Zugfolge bleibt dauerhaft.
    assert empfehlungen.abbildungen
    for empfehlung in empfehlungen.beispiele.values():
        assert empfehlung.beispiel in vorhanden, empfehlung.beispiel
        assert empfehlung.mit is None or empfehlung.mit in vorhanden, empfehlung.mit
    assert all(re.fullmatch(r"\d+\.\d+", nummer) for nummer in empfehlungen.abbildungen)
