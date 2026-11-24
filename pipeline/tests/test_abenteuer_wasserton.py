"""Tests für pipeline/abenteuer/wasserton.py (RO53.4 vom 24.11.2026): eigener Ton je Gewässerart.

Warum: Kanal, Meer, See, Bach, Canyonfluss und heiße Quelle sollen nicht dasselbe Türkis zeigen. Jede
Außenkarte mit Wasser nennt deshalb ihre Art; nur das Moor (eigenes schwarzes Wasser) braucht keine.
"""

import json
from pathlib import Path

import pytest

from pipeline.abenteuer.kartenbau import WASSER, raster
from pipeline.abenteuer.wasserton import TOENE, befunde, ton, wasserfelder

SZENEN = Path(__file__).resolve().parents[2] / "inhalte" / "abenteuer" / "szenen"
PAKETWASSER = (66, 178, 196)


def test_jede_art_hat_ihren_ton():
    farben = {art: ton(*PAKETWASSER, art) for art in TOENE}
    assert len(set(farben.values())) == len(TOENE)
    r, g, b = farben["kanal"]
    assert g > b  # grünlich
    r, g, b = farben["meer"]
    assert b > g and sum(farben["meer"]) < sum(PAKETWASSER)  # tiefer blau
    assert ton(110, 160, 70, "meer") == (110, 160, 70)  # Gras bleibt
    assert ton(240, 245, 250, "kanal") == (240, 245, 250)  # weiße Welle bleibt


def test_wasserfelder_ohne_watt_mit_nachbarn():
    gezeichnet = {(5, 5): ("wasser", [1, 1]), (9, 9): ("wasser_watt", [1, 1])}
    felder = wasserfelder(gezeichnet)
    assert (4, 4) in felder and (6, 6) in felder and (9, 9) not in felder


def test_unbekannter_ton_ist_ein_befund():
    assert befunde({"wasserton": "kanal"}) == []
    assert befunde({}) == []
    assert befunde({"wasserton": "lagune"})


@pytest.mark.parametrize("pfad", sorted(SZENEN.glob("*.json")), ids=lambda p: p.stem)
def test_aussenkarten_mit_wasser_nennen_ihre_art(pfad):
    szene = json.loads(pfad.read_text(encoding="utf-8"))
    if szene.get("art") != "aussen" or szene.get("ufer") == "moor":
        return
    if any(WASSER in zeile for zeile in raster(szene)):
        assert szene.get("wasserton") in TOENE, f"{pfad.stem}: wasserton fehlt (erlaubt: {', '.join(TOENE)})"
