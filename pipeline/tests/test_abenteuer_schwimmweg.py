"""Dauertest: Schwimmer bleiben im Wasser (pipeline/abenteuer/schwimmweg.py, Befund 25.11.2026 abends)."""

import pytest

# Das Raster kommt aus klippenbild.py und braucht Pillow; der Pipeline-Job in Actions hat es nicht
# (Sammelfehler am 25.11.2026). Ohne Pillow wird die Prüfung übersprungen wie die anderen Bildtests.
pytest.importorskip("PIL.Image")

from pipeline.abenteuer.schwimmweg import alle_befunde, befunde, laufweg  # noqa: E402


def test_laufweg_erst_waagerecht_dann_senkrecht():
    assert laufweg((1, 1), (3, 2)) == [(1, 1), (2, 1), (3, 1), (3, 2)]


def test_l_weg_an_land_wird_gefunden():
    # Hinweg über Wasser, Rückweg (erst waagerecht) über Land: Befund.
    szene = {
        "raster": ["~~~", "~..", "~~~"],
        "belebung": [
            {
                "name": "ente",
                "typ": "tier",
                "feld": [0, 0],
                "eigenschaften": {"von": "0,0", "bis": "2,2", "verhalten": "schwimmen"},
            }
        ],
    }
    assert befunde(szene)


def test_alle_szenen_ohne_befund():
    assert alle_befunde() == {}
