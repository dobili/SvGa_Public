"""Tests für ``pipeline/abenteuer/bedingung.py``: dieselben Fälle wie in bedingung.test.ts der App.

Warum: Die Sprache steht dreimal (App, Simulation, Pipeline); gleiche Fälle halten sie gleich.
"""

import pytest

from pipeline.abenteuer.bedingung import Bedingungsfehler, erfuellt, variablen

V = {"musikhausOffen": True, "nadelMapleFalls": 2, "hatLaterne": False, "ausgang": "sieg", "leer": ""}


@pytest.mark.parametrize(
    ("bedingung", "erwartet"),
    [
        ("musikhausOffen", True),
        ("nadelMapleFalls", True),
        ("hatLaterne", False),
        ("leer", False),
        ("unbekannt", False),
        ("nadelMapleFalls >= 1", True),
        ("nadelMapleFalls > 2", False),
        ("nadelMapleFalls == 2", True),
        ('ausgang == "sieg"', True),
        ('ausgang != "sieg"', False),
        ("hatLaterne == falsch", True),
        ("nadelCedarCreek < 1", True),
        ("nadelCedarCreek >= 1", False),
        ('ausgangJo == ""', True),
        ("nicht hatLaterne", True),
        ("musikhausOffen und hatLaterne", False),
        ("hatLaterne oder musikhausOffen", True),
        ("hatLaterne und musikhausOffen oder nadelMapleFalls >= 2", True),
        ("hatLaterne und (musikhausOffen oder nadelMapleFalls >= 2)", False),
    ],
)
def test_erfuellt(bedingung, erwartet):
    assert erfuellt(bedingung, V) is erwartet


@pytest.mark.parametrize("bedingung", ["", "a >=", "a b", "(a", "a == b", "a && b", "und"])
def test_fehlerhafte_bedingungen(bedingung):
    with pytest.raises(Bedingungsfehler):
        erfuellt(bedingung, V)


def test_variablen():
    assert variablen("szene13 und nicht (n >= 1 oder hatX)") == {"szene13", "n", "hatX"}
