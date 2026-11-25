"""Dauertest Sitzrichtung auf Bänken (pipeline/abenteuer/bankblick.py, Befund 25.11.2026 abends)."""

from pipeline.abenteuer.bankblick import befunde, sitzblick
from pipeline.abenteuer.sitzplatz import blick_in_lage, sitzlage
from pipeline.abenteuer.verdeckung import katalog


def test_gespiegelte_seitenbank_im_park_blickt_nach_rechts():
    # Jo sitzt abends auf (22, 23): Die gespiegelte Bank hat die Lehne links, also Blick rechts.
    assert sitzblick("maple-falls-park", (22, 23), katalog()) == "rechts"
    assert sitzblick("maple-falls-park", (15, 23), katalog()) == "links"


def test_blick_in_lage_wie_in_der_app():
    assert blick_in_lage("links", {"spiegeln": True}) == "rechts"
    assert blick_in_lage("rechts", {"drehung": 90}) == "unten"
    assert blick_in_lage(None, {}) is None


def test_sitzlage_auf_der_sitzflaeche_wie_in_der_app():
    # Gleiche Zahlen wie sitzplatz.test.ts („Bänke im Park von Maple Falls“).
    bank = {"x": 240, "y": 352, "breite": 16, "hoehe": 48, "tiefe": 392, "blick": "links", "sichtbar": None}
    assert sitzlage(bank, (15, 23))[:2] == (-2, 0)
    assert sitzlage({**bank, "blick": "rechts"}, (15, 23))[0] == 2
    assert sitzlage(bank, (15, 22))[1] == 8
    assert sitzlage(bank, (15, 24))[1] == -6
    schach = {"x": 52, "y": 184, "breite": 24, "hoehe": 24, "tiefe": 200, "blick": "unten", "sichtbar": None}
    assert sitzlage(schach, (3, 12))[1] == -4


def test_alle_sitzstellen_ohne_befund():
    assert befunde() == []
