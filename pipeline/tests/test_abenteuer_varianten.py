"""Tests der Prüfung auf zu ähnliche Varianten (varianten.py, KARTENREGELN 10.37)."""

import json

from pipeline.abenteuer.varianten import aehnlichkeit, pruefe_varianten, vergleiche_mit_a


def _szene(stellen: list[tuple[str, int, int]], boden: str = "holz") -> dict:
    return {"boden": boden, "objekte": [{"moebel": m, "feld": [x, y]} for m, x, y in stellen]}


A = _szene([("tisch", 2, 2), ("stuhl", 3, 2), ("schrank", 0, 0), ("sofa", 5, 5)])


def test_gleiche_stellen_werden_gemeldet():
    b = _szene([("tisch", 2, 2), ("stuhl", 3, 2), ("schrank", 0, 0), ("kiste", 7, 7)])
    assert any("zu ähnlich" in x for x in pruefe_varianten(b, A))


def test_nur_umgestellt_wird_gemeldet():
    b = _szene([("tisch", 6, 2), ("stuhl", 7, 2), ("schrank", 9, 0), ("sofa", 1, 5)])
    assert aehnlichkeit(A, b) == (0.0, 1.0)
    assert any("umgestellt" in x for x in pruefe_varianten(b, A))
    # Anderer Boden genügt, damit dieselben Möbel als eigener Raum gelten.
    assert pruefe_varianten(b | {"boden": "fliesen"}, A) == []


def test_verschiedene_variante_ist_in_ordnung():
    b = _szene([("bett", 1, 1), ("stuhl", 4, 4), ("regal", 0, 3)])
    assert pruefe_varianten(b, A) == []


def test_vergleich_nur_solange_nicht_gewaehlt(tmp_path):
    (tmp_path / "varianten").mkdir()
    (tmp_path / "raum.json").write_text(json.dumps(A))
    b_pfad = tmp_path / "varianten" / "raum-b.json"
    b = A | {"variante": "b"}

    def lade(p):
        return json.loads(p.read_text())

    assert vergleiche_mit_a(b_pfad, b, lade)
    (tmp_path / "varianten" / "raum-a.json").write_text("{}")
    assert vergleiche_mit_a(b_pfad, b, lade) == []
