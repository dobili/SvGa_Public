"""Bild eines Fundes (funde.json, Feld ``bild``): Pfad im Zusatzpaket nach der Bildliste von mittel-3.

Warum: Funde sollen im Fund-Fenster und auf der Fensterbank mit Bild erscheinen
(app/src/abenteuer/oberwelt/Fundbild.tsx). Der Pfad hat eine feste Form, damit Bildliste, Paket und
Daten zusammenpassen: ``bilder/fund-<kebab>.webp``. Fehlt die Datei, bleibt es beim Text.
"""

import pytest

from pipeline.bauen.__main__ import pruefe_schema

SCHEMA = "abenteuer-funde.schema.json"


def _funde(bild: str) -> dict:
    fund = {"kennung": "blauesHeft", "ort": "mapleFalls", "name": "fund.blauesHeft.name"}
    return {"schemaVersion": 1, "funde": [{**fund, "text": "fund.blauesHeft.text", "bild": bild}]}


def test_gueltiger_pfad():
    assert pruefe_schema(_funde("bilder/fund-blaues-heft.webp"), SCHEMA) == []


@pytest.mark.parametrize("bild", ["bilder/blaues-heft.webp", "bilder/fund-blaues_heft.webp", "fund-x.png"])
def test_falsche_pfade(bild: str):
    assert pruefe_schema(_funde(bild), SCHEMA) != []
