"""Tests der Anordnungsregeln KARTENREGELN 10.80 bis 10.87 (pipeline/abenteuer/anordnung.py).

Die Einzeltests arbeiten mit erfundenen Bildern (ohne privates Paket gilt die ganze Bildfläche als
deckend). Der letzte Test prüft alle Szenen von Maple Falls und Cedar Creek mit den echten Bildern und
läuft nur, wenn das private Paket da ist.
"""

import pytest

pytest.importorskip("PIL")  # anordnung_bild braucht Pillow, in Actions nicht installiert

from pipeline.abenteuer.anordnung import (
    pruefe_anordnung,
    pruefe_hausgroesse,
    pruefe_loecher,
    pruefe_platten,
    pruefe_stege,
    pruefe_tische,
)
from pipeline.abenteuer.anordnung_bild import privat
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
    fern = [stueck("thekeMitte", 2, 5, 1, 2), stueck("barHocker", 2, 7, 1, 2)]
    assert pruefe_theke_an_wand(szene, fern, MOEBEL, zeilen) != []


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


def test_fussmatte_vor_jedem_tuerfeld():
    zeilen = ["#####", "#...#", "##..#"]
    szene = {"art": "innen", "ausloeser": [{"name": "aus", "feld": [2, 2]}, {"name": "aus", "feld": [3, 2]}]}
    tuer = stueck("glastuer", 2, 2, 2, 1)
    eine = [tuer, stueck("fussmatte", 2, 1, 1, 1)]
    assert len(pruefe_fussmatten(szene, eine, MOEBEL, zeilen)) == 1  # Diner vorher: zweite Matte fehlt
    beide = [*eine, stueck("fussmatte", 3, 1, 1, 1)]
    assert pruefe_fussmatten(szene, beide, MOEBEL, zeilen) == []


def test_strasse_springt_nicht_um_eine_kachel():
    szene = {"art": "aussen", "boeden": {"s": "asphalt"}}
    gerade = ["." * 12, "s" * 12, "s" * 12, "s" * 12, "." * 12]
    assert pruefe_strassen(szene, gerade) == []
    # Cedar Creek vorher: in der Mitte eine Reihe tiefer, rechts wieder oben.
    versetzt = ["." * 12, "ss....ssssss", "s" * 12, "s" * 12, "..ssss......"]
    assert pruefe_strassen(szene, versetzt) != []
    kurve = ["." * 12, "ssssss......", "s" * 12, "s" * 12, "......ssssss"]
    assert pruefe_strassen(szene, kurve) == []  # springt nicht zurück: Kurve


@pytest.mark.skipif(privat() is None, reason="Bilder aus dem privaten Paket fehlen")
def test_maple_falls_und_cedar_creek_ohne_befund():
    """Die Orte der Kartennotizen sind nachgezogen; offen ist nur das Treppenloch (Bild des Autors)."""
    offen = []
    for pfad in sorted((INHALTE / "szenen").glob("*.json")):
        szene = lade(pfad)
        if szene.get("karte", "").split(".")[0] in ("mapleFalls", "cedarCreek"):
            offen += [f"{pfad.name}: {b}" for b in pruefe_anordnung(szene) if not b.startswith("10.84")]
    assert offen == []
