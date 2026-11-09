"""Tests der Übergangsprüfung (pipeline/abenteuer/uebergaenge.py) mit kleinen Beispielkarten."""

from pipeline.abenteuer.uebergaenge import pruefe


def _szene(karte: str, art: str, breite: int, ausloeser: list[tuple[str, int, int]]) -> dict:
    return {
        "karte": karte,
        "art": art,
        "raster": ["." * breite] * 5,
        "ausloeser": [{"name": n, "feld": [x, y]} for n, x, y in ausloeser],
    }


REGELN = [
    {"name": "ost", "ort": "a", "art": "uebergang", "ziel": {"karte": "b.aussen", "ausloeser": "west"}},
    {"name": "west", "ort": "b", "art": "uebergang", "ziel": {"karte": "a.aussen", "ausloeser": "ost"}},
]


def test_passende_raender_ohne_befund():
    alle = {
        "a.aussen": _szene("a.aussen", "aussen", 6, [("ost", 5, 2)]),
        "b.aussen": _szene("b.aussen", "aussen", 6, [("west", 0, 2)]),
    }
    assert pruefe(alle, REGELN) == []


def test_falscher_rand_und_fehlendes_gegenstueck():
    alle = {
        "a.aussen": _szene("a.aussen", "aussen", 6, [("ost", 5, 2)]),
        "b.aussen": _szene("b.aussen", "aussen", 6, [("west", 2, 0)]),
    }
    assert any("statt ['west']" in b for b in pruefe(alle, REGELN))
    alle["b.aussen"]["ausloeser"] = []
    assert any("keinen Auslöser west" in b for b in pruefe(alle, REGELN))
