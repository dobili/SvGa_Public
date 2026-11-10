"""Tests für ``randhang`` in kartenbild.py: Die Böschung eines Bahndamms läuft bis an den Bildrand.

Warum: Rückmeldung des Autors (Runde 8): Am linken Rand des Bahndamms fehlte ein Stück Böschung,
weil das Randfeld den Boden des Nachbarn zeigte statt des Hangs.
"""

import pytest

pytest.importorskip("PIL.Image")  # kartenbild braucht Pillow; in Actions fehlt es

from pipeline.abenteuer.kartenbild import randhang  # noqa: E402

ZEILEN = ["#####", "#...#", "#####", "#...#"]


def test_randfeld_links_neben_hang_bekommt_den_hang():
    flaeche = {(1, 2): "mitte", (2, 2): "mitte", (3, 2): "mitte"}
    assert randhang(0, 2, ZEILEN, flaeche) == (1, 2)
    assert randhang(4, 2, ZEILEN, flaeche) == (3, 2)


def test_ohne_hang_daneben_bleibt_es_beim_alten():
    assert randhang(0, 1, ZEILEN, {}) is None
    assert randhang(2, 0, ZEILEN, {(2, 1): "mitte"}) is None
