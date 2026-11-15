"""Tests der Anordnungsregeln KARTENREGELN 10.80 bis 10.87 (pipeline/abenteuer/anordnung.py).

Die Einzeltests arbeiten mit erfundenen Bildern (ohne privates Paket gilt die ganze Bildfläche als
deckend). Die letzten Tests prüfen alle Szenen: mit den echten Bildern nur, wenn das private Paket da
ist, die Regeln ohne Pixel immer.
"""

import pytest

pytest.importorskip("PIL")  # anordnung_bild braucht Pillow, in Actions nicht installiert

from pipeline.abenteuer import anordnung
from pipeline.abenteuer.anordnung import (
    pruefe_anordnung,
    pruefe_hausgroesse,
    pruefe_loecher,
    pruefe_platten,
    pruefe_stege,
    pruefe_tische,
)
from pipeline.abenteuer.anordnung_bild import bilder_da
from pipeline.abenteuer.anordnung_raum import pruefe_fussmatten, pruefe_strassen, pruefe_theke_an_wand
from pipeline.abenteuer.kartenbau import INHALTE, K, lade

MOEBEL = {
    "tisch": {"quelle": "x/tisch.png", "art": "tisch"},
    "stuhlRechts": {"quelle": "x/stuhl_r.png", "art": "stuhl", "blick": "rechts"},
    "stuhlLinks": {"quelle": "x/stuhl_l.png", "art": "stuhl", "blick": "links"},
    "schachBrett": {"quelle": "x/brett.png", "art": "deko"},
    "schachUhr": {"quelle": "x/uhr.png", "art": "deko"},
    "pultMitBuch": {"quelle": "x/Classroom_and_Library_Singles_25.png", "art": "tisch"},
    "steg": {"quelle": "x/steg.png", "art": "steg"},
    "thekeMitte": {"quelle": "x/theke.png", "art": "tisch", "blick": "unten"},
    "barHocker": {"quelle": "x/hocker.png", "art": "stuhl", "blick": "oben"},
    "wohnhausKlein": {"quelle": "x/haus.png", "art": "gebaeude"},
    "gartenhaus": {"quelle": "x/gartenhaus.png", "art": "gebaeude"},
    "luke": {"quelle": "x/luke.png", "art": "treppe", "richtung": "runter"},
    "glastuer": {"quelle": "x/tuer.png", "art": "tuer"},
    "fussmatte": {"quelle": "x/matte.png", "art": "teppich"},
    "treppeHoch": {"quelle": "x/treppe.png", "art": "treppe", "richtung": "hoch"},
    "pfahlhaus": {"quelle": "x/pfahlhaus.png", "art": "gebaeude", "kleinbau": "Fischerhütte auf Pfählen"},
    "stadthausSchmal": {"quelle": "x/stadthaus.png", "art": "gebaeude"},
}


def stueck(name: str, x: float, y: float, breite: float, hoehe: float, kennung: str | None = None) -> dict:
    """Ein gesetztes Möbel in Pixeln, wie ``kartenbau.platziere`` es liefert (Angaben in Kacheln)."""
    return {
        "name": name,
        "x": round(x * K),
        "y": round(y * K),
        "breite": round(breite * K),
        "hoehe": round(hoehe * K),
        "id": kennung or f"{name}@{x},{y}",
        "kollision": True,
    }


def spieltisch(tisch_y: float = 1) -> list[dict]:
    return [
        stueck("stuhlRechts", 1, 1, 1, 2),
        stueck("tisch", 2, tisch_y, 2, 2, "t1"),
        stueck("stuhlLinks", 4, 1, 1, 2),
    ]


def test_tisch_auf_hoehe_der_stuehle():
    assert pruefe_tische({}, spieltisch(), MOEBEL, {}) == []
    tief = pruefe_tische({}, spieltisch(tisch_y=2), MOEBEL, {})
    assert any("Höhe der Stühle" in b for b in tief)  # Calloways Tisch vorher: eine Kachel zu tief


def test_uhr_nicht_zwischen_brett_und_spieler():
    auf = {"b": {"auf": "t1"}, "u": {"auf": "t1"}}
    dahinter = [
        *spieltisch(),
        stueck("schachBrett", 2.5, 1.2, 1, 0.5, "b"),
        stueck("schachUhr", 2.75, 0.8, 0.5, 0.3, "u"),
    ]
    assert pruefe_tische({}, dahinter, MOEBEL, auf) == []
    # Clubraum vorher: Uhr rechts neben dem Brett, genau vor dem rechten Spieler.
    davor = [
        *spieltisch(),
        stueck("schachBrett", 2.25, 1.2, 1, 0.5, "b"),
        stueck("schachUhr", 3.3, 1.2, 0.5, 0.3, "u"),
    ]
    assert any("Uhr zwischen Brett und Spieler" in b for b in pruefe_tische({}, davor, MOEBEL, auf))


def test_nichts_uebereinander_und_nichts_auf_dem_buch_im_bild():
    pult = stueck("pultMitBuch", 0, 0, 2, 2, "pult")
    brett = stueck("schachBrett", 0.75, 0.6, 0.75, 0.5, "b")
    uhr = stueck("schachUhr", 1, 0.7, 0.5, 0.3, "u")
    befunde = pruefe_platten([pult, brett, uhr], MOEBEL, {"b": {"auf": "pult"}, "u": {"auf": "pult"}})
    assert any("liegt auf aufgeschlagenes Buch" in b for b in befunde)
    assert any("übereinander" in b for b in befunde)


def test_steg_nur_ueber_wasser():
    zeilen = ["~~~~", "~~~~", "...."]
    assert pruefe_stege([stueck("steg", 1, 0, 2, 2)], MOEBEL, zeilen, set()) == []
    assert pruefe_stege([stueck("steg", 1, 2, 2, 1)], MOEBEL, zeilen, set()) != []


def test_theke_mit_hockern_steht_nah_an_der_wand():
    zeilen = ["#####"] * 3 + ["#...#"] * 6
    szene = {"art": "innen"}
    nah = [stueck("thekeMitte", 2, 4, 1, 2), stueck("barHocker", 2, 6, 1, 2)]
    assert pruefe_theke_an_wand(szene, nah, MOEBEL, zeilen) == []
    # Gemessen ab der sichtbaren Oberkante (ohne Paket: Bildoberkante): Reihe 5 heißt Gang 3 und 4.
    mitte = [stueck("thekeMitte", 2, 5, 1, 2), stueck("barHocker", 2, 7, 1, 2)]
    assert pruefe_theke_an_wand(szene, mitte, MOEBEL, zeilen) == []
    fern = [stueck("thekeMitte", 2, 6, 1, 2), stueck("barHocker", 2, 8, 1, 2)]
    assert pruefe_theke_an_wand(szene, fern, MOEBEL, zeilen) != []


def test_durchreiche_in_der_rueckwand_verlaengert_den_gang_nicht():
    """Raststätte Crossroads: Hinter dem Tresen liegt in zwei Spalten die Durchreiche zur Küche."""
    zeilen = ["#######"] * 3 + ["#.#####", "#.....#", "#.....#", "#.....#", "#.....#"]
    szene = {"art": "innen"}
    theke = stueck("thekeMitte", 1, 6, 3, 2)
    theke["breite"], theke["hoehe"] = 3 * K, 2 * K
    assert pruefe_theke_an_wand(szene, [theke, stueck("barHocker", 2, 8, 1, 2)], MOEBEL, zeilen) == []


def test_loch_im_boden_auf_oberen_karten():
    luke = [stueck("luke", 1, 1, 3, 3)]
    assert pruefe_loecher({"karte": "mapleFalls.zimmer"}, luke, MOEBEL) != []
    assert pruefe_loecher({"karte": "mapleFalls.wohnzimmer"}, luke, MOEBEL) == []
    mit_loch = {**MOEBEL, "luke": {**MOEBEL["luke"], "bodenoeffnung": True}}
    assert pruefe_loecher({"karte": "mapleFalls.zimmer"}, luke, mit_loch) == []


def test_haeuser_in_menschengroesse():
    szene = {"art": "aussen"}
    assert pruefe_hausgroesse(szene, [stueck("wohnhausKlein", 1, 1, 4, 4)], MOEBEL) != []
    assert pruefe_hausgroesse(szene, [stueck("wohnhausKlein", 1, 1, 5, 5)], MOEBEL) == []
    assert pruefe_hausgroesse(szene, [stueck("gartenhaus", 1, 1, 3, 4)], MOEBEL) == []


def test_kleinbau_im_katalog_und_schmales_stadthaus(monkeypatch):
    """Pfahlhäuser der Pelikaninsel tragen ``kleinbau``; das Reihenhaus in Capital ist 3 breit, aber
    vier Geschosse hoch (Grundriss)."""
    szene = {"art": "aussen"}
    assert pruefe_hausgroesse(szene, [stueck("pfahlhaus", 1, 1, 4, 5)], MOEBEL) == []
    schmal = [stueck("stadthausSchmal", 1, 1, 3, 12)]
    assert pruefe_hausgroesse(szene, schmal, MOEBEL) != []
    monkeypatch.setattr(anordnung, "_grundrisse", lambda: {"x/stadthaus.png": {"geschosse": 4}})
    assert pruefe_hausgroesse(szene, schmal, MOEBEL) == []


def test_fussmatte_vor_jedem_tuerfeld():
    zeilen = ["#####", "#...#", "##..#"]
    szene = {"art": "innen", "ausloeser": [{"name": "aus", "feld": [2, 2]}, {"name": "aus", "feld": [3, 2]}]}
    tuer = stueck("glastuer", 2, 2, 2, 1)
    eine = [tuer, stueck("fussmatte", 2, 1, 1, 1)]
    assert len(pruefe_fussmatten(szene, eine, MOEBEL, zeilen)) == 1  # Diner vorher: zweite Matte fehlt
    beide = [*eine, stueck("fussmatte", 3, 1, 1, 1)]
    assert pruefe_fussmatten(szene, beide, MOEBEL, zeilen) == []


def test_keine_fussmatte_auf_der_treppe():
    """U-Bahnhof Capital: Vor dem Rollgitter führt eine Treppe hinauf, dort liegt keine Matte."""
    zeilen = ["#####", "#...#", "##.##"]
    szene = {"art": "innen", "ausloeser": [{"name": "aus", "feld": [2, 2]}]}
    gesetzt = [stueck("glastuer", 2, 2, 1, 1), stueck("treppeHoch", 2, 0, 1, 2)]
    assert pruefe_fussmatten(szene, gesetzt, MOEBEL, zeilen) == []


def test_strasse_springt_nicht_um_eine_kachel():
    szene = {"art": "aussen", "boeden": {"s": "asphalt"}}
    gerade = ["." * 12, "s" * 12, "s" * 12, "s" * 12, "." * 12]
    assert pruefe_strassen(szene, gerade) == []
    # Cedar Creek vorher: in der Mitte eine Reihe tiefer, rechts wieder oben.
    versetzt = ["." * 12, "ss....ssssss", "s" * 12, "s" * 12, "..ssss......"]
    assert pruefe_strassen(szene, versetzt) != []
    kurve = ["." * 12, "ssssss......", "s" * 12, "s" * 12, "......ssssss"]
    assert pruefe_strassen(szene, kurve) == []  # springt nicht zurück: Kurve


def test_schlangenlinie_ist_kein_versatz():
    """Landstraße: Die Straße steigt in Stufen von drei Spalten um zwei Reihen und fällt ebenso zurück;
    die Unterkante springt drei Spalten vor der Oberkante, der Zeichner macht daraus schräge Ränder.
    Ein einzelner Versatz von einer Reihe (Cedar Creek vorher) bleibt ein Befund."""
    szene = {"art": "aussen", "boeden": {"l": "landstrasse"}}
    oben = [9, 9, 9, 9, 9, 9, 9, 9, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9]
    unten = [
        12,
        12,
        12,
        12,
        12,
        11,
        11,
        11,
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        11,
        11,
        11,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
    ]

    def raster(o: list[int], u: list[int]) -> list[str]:
        return ["".join("l" if a <= y < b else "." for a, b in zip(o, u, strict=True)) for y in range(14)]

    assert pruefe_strassen(szene, raster(oben, unten)) == []
    stufe = [9] * 8 + [8] * 10 + [9] * 8
    assert pruefe_strassen(szene, raster(stufe, [s + 3 for s in stufe])) != []


@pytest.mark.skipif(not bilder_da(), reason="Bilder aus dem privaten Paket fehlen")
def test_alle_orte_ohne_befund():
    """Alle Orte sind nachgezogen (Maple Falls und Cedar Creek nach den Kartennotizen, die übrigen am
    15.11.2026); offen ist nur das Treppenloch (Bild des Autors)."""
    offen = []
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        offen += [f"{pfad.name}: {b}" for b in pruefe_anordnung(lade(pfad)) if not b.startswith("10.84")]
    assert offen == []


def test_ohne_bilder_nur_die_regeln_ohne_pixel():
    """In GitHub Actions fehlen Paket und Pillow: Dann prüft der Kartenbau Fußmatten, Straßen und
    Treppenlöcher, aber keine Tische, Platten, Stege, Theken und Häuser (die ganze Bildfläche als
    deckend zu nehmen, ergäbe falsche Befunde)."""
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        befunde = pruefe_anordnung(lade(pfad), mit_bildern=False)
        assert all(b[:5] in ("10.84", "10.86", "10.87") for b in befunde), (pfad.name, befunde)
        assert [b for b in befunde if not b.startswith("10.84")] == [], pfad.name
