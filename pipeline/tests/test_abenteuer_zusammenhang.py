"""Tests der Prüfung auf Zusammenhang draußen (zusammenhang.py, KARTENREGELN 10.32 bis 10.35)."""

from pipeline.abenteuer.zusammenhang import pruefe_breiten, pruefe_enden, pruefe_zaeune

BOEDEN = {"s": "asphalt", "e": "erde"}


def _szene(raster: list[str]) -> dict:
    return {"art": "aussen", "boeden": BOEDEN, "raster": raster}


def test_strasse_zwei_kacheln_ist_zu_schmal():
    raster = ["..........", "ssssssssss", "ssssssssss", ".........."]
    assert any("zu schmal" in b for b in pruefe_breiten(_szene(raster), raster))
    raster = ["..........", "ssssssssss", "ssssssssss", "ssssssssss", ".........."]
    assert pruefe_breiten(_szene(raster), raster) == []


def test_strasse_wird_ploetzlich_doppelt_so_breit():
    # Straße drei breit, dann sieben breit (ein Wendehammer ohne Übergang).
    raster = [
        "................",
        "........sssssss.",
        "........sssssss.",
        "sssssssssssssss.",
        "sssssssssssssss.",
        "sssssssssssssss.",
        "........sssssss.",
        "........sssssss.",
        "................",
    ]
    assert any("sprunghaft" in b for b in pruefe_breiten(_szene(raster), raster))


def test_abzweig_ist_kein_breitenwechsel():
    raster = [
        "...ee.....",
        "...ee.....",
        "...ee.....",
        "eeeeeeeeee",
        "eeeeeeeeee",
        "..........",
    ]
    assert pruefe_breiten(_szene(raster), raster) == []


def test_bach_endet_mitten_in_der_karte():
    raster = ["..~~......", "..~~......", "..~~......", "..........", ".........."]
    befunde = pruefe_enden(_szene(raster), raster, [], {})
    assert any("Bach endet" in b for b in befunde)
    raster = ["..~~......", "..~~......", "..~~......", "..~~......", "..~~......"]
    assert pruefe_enden(_szene(raster), raster, [], {}) == []


def test_weg_ohne_ziel_wird_gemeldet():
    raster = ["..........", "..........", "...eeee...", "...eeee...", "..........", ".........."]
    assert any("nirgendwohin" in b for b in pruefe_enden(_szene(raster), raster, [], {}))
    szene = _szene(raster) | {"ausloeser": [{"name": "tor", "feld": [7, 2]}]}
    assert pruefe_enden(szene, raster, [], {}) == []


def _zaun(name: str, x: int, y: int = 32) -> dict:
    return {"name": name, "x": x, "y": y, "breite": 16, "hoehe": 16}


def test_zaunluecke_braucht_endpfosten():
    moebel = {n: {"art": "zaun"} for n in ("zaunMitte", "zaunEckeRechts", "zaunEckeLinks")}
    offen = [_zaun("zaunMitte", 0), _zaun("zaunMitte", 16), _zaun("zaunMitte", 64)]
    assert any("Zaunlücke" in b for b in pruefe_zaeune(offen, moebel))
    tor = [_zaun("zaunMitte", 0), _zaun("zaunEckeRechts", 16), _zaun("zaunEckeLinks", 64)]
    assert pruefe_zaeune(tor, moebel) == []


def test_versetztes_zaunteil():
    moebel = {"zaunMitte": {"art": "zaun"}}
    gesetzt = [_zaun("zaunMitte", 0), _zaun("zaunMitte", 16, 36)]
    assert any("versetzt" in b for b in pruefe_zaeune(gesetzt, moebel))


def test_engstelle_an_einer_stufe():
    from pipeline.abenteuer.zusammenhang import engstellen

    # Weg zwei breit, eine Reihe versetzt: nur ein Feld Überlappung.
    eng = {(0, 1), (0, 2), (1, 1), (1, 2), (2, 2), (2, 3), (3, 2), (3, 3)}
    assert engstellen(eng, 2) == [(1, 1)]
    # Versatz mit voller Überlappung (drei Felder hoch an der Stufe): keine Engstelle.
    gut = {(0, 1), (0, 2), (1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 2), (3, 3)}
    assert engstellen(gut, 2) == []
