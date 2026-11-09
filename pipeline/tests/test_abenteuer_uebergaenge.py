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


def test_katalogbefund_meldet_bauteil_und_unsicheres():
    from pipeline.abenteuer.katalog import katalogbefund

    assert katalogbefund("x", None) is None
    assert "nicht beschrieben" in katalogbefund("x", {"ganz": True})
    assert "Bauteil" in katalogbefund("x", {"beschreibung": "Bank", "ganz": False, "gegenstuecke": "rechts"})
    assert "unsicher" in katalogbefund("x", {"ganz": True, "sicher": 0.5, "beschreibung": "Kiste"})
    assert katalogbefund("x", {"beschreibung": "Kiste", "sicher": 0.5, "korrektur": "Opus"}) is None


def test_sichtbare_breite_entscheidet_auf_der_platte():
    """Fernseher 32 px Bild (29 sichtbar) auf Anrichte 32 px (30 sichtbar): passt (mittel-1, 9.11.2026)."""
    from pipeline.abenteuer.kartenbau import platziere

    moebel = {
        "anrichte": {"quelle": "a.png", "breite": 32, "hoehe": 32, "kollision": True, "sichtbar_breite": 30},
        "tv": {"quelle": "b.png", "breite": 32, "hoehe": 32, "sichtbar_breite": 29},
        "tvAlt": {"quelle": "c.png", "breite": 32, "hoehe": 32},
    }
    szene = {"objekte": [{"moebel": "anrichte", "feld": [1, 1], "id": "a"}, {"moebel": "tv", "auf": "a"}]}
    _, befunde = platziere(szene, moebel)
    assert befunde == []
    szene["objekte"][1]["moebel"] = "tvAlt"
    _, befunde = platziere(szene, moebel)
    assert any("breiter als die Platte" in b for b in befunde)


def test_reise_als_dialog_und_uebergang_ohne_ziel():
    alle = {
        "a.aussen": _szene("a.aussen", "aussen", 6, [("ost", 3, 2)]),
        "b.aussen": _szene("b.aussen", "aussen", 6, [("west", 2, 2)]),
    }
    # Rückfahrt im Bus: ein Dialog, kein Weg über den Rand; keine Befunde zu Rand oder Rückweg.
    bus = [REGELN[0], {"name": "west", "ort": "b", "art": "dialog", "dialog": "b.bus"}]
    assert pruefe(alle, bus) == []
    # Übergang, dessen Nachbarort noch fehlt: Befund statt Abbruch.
    offen = [{"name": "ost", "ort": "a", "art": "uebergang"}]
    assert any("ohne Ziel" in b for b in pruefe(alle, offen))
