"""Tests der Durchgangsprüfung (pipeline/abenteuer/durchgang.py): Auslöser decken Luke, Tür und Rand."""

from pipeline.abenteuer.durchgang import fehlende_felder, pruefe_durchgaenge
from pipeline.abenteuer.uebergaenge import szenen, uebergaenge

MOEBEL = {
    "luke": {"quelle": "x.png", "breite": 32, "hoehe": 48, "kollision": False, "art": "treppe"},
    "kiste": {"quelle": "x.png", "breite": 16, "hoehe": 16, "kollision": True, "art": "kiste"},
}
RAUM = ["######", "#....#", "#....#", "#....#", "###.##"]


def szene(ausloeser: list, objekte: list | None = None, raster: list[str] | None = None) -> dict:
    return {"karte": "t.raum", "raster": raster or RAUM, "ausloeser": ausloeser, "objekte": objekte or []}


def test_luke_braucht_den_ausloeser_auf_jeder_begehbaren_kachel():
    """Dachboden (Befund des Autors): Luke 2 × 3, die oberste Reihe ist Wand, Auslöser nur links unten."""
    s = szene([{"name": "treppe", "feld": [1, 2]}], [{"moebel": "luke", "feld": [1, 0]}])
    zu, fehlt = fehlende_felder(s, "treppe", MOEBEL)
    assert zu == set() and fehlt == {(1, 1), (2, 1), (2, 2)}
    alle = [{"name": "treppe", "feld": list(f)} for f in ((1, 1), (2, 1), (1, 2), (2, 2))]
    assert fehlende_felder(szene(alle, s["objekte"]), "treppe", MOEBEL) == (set(), set())


def test_tuerluecke_in_der_wand_und_gesperrtes_feld():
    tuer = szene([{"name": "tuer", "feld": [3, 4]}])
    assert fehlende_felder(tuer, "tuer", MOEBEL) == (set(), set())
    breit = szene([{"name": "tuer", "feld": [2, 4]}], raster=RAUM[:4] + ["##..##"])
    assert fehlende_felder(breit, "tuer", MOEBEL) == (set(), {(3, 4)})
    zugestellt = szene([{"name": "tuer", "feld": [3, 4]}], [{"moebel": "kiste", "feld": [3, 4]}])
    assert fehlende_felder(zugestellt, "tuer", MOEBEL)[0] == {(3, 4)}


def test_weg_am_kartenrand_in_voller_breite():
    weg = ["#####", "....#", "....#", "#####"]
    s = szene([{"name": "west", "feld": [0, 1]}], raster=weg)
    assert fehlende_felder(s, "west", MOEBEL) == (set(), {(0, 2)})


def test_alle_karten_haben_vollstaendige_durchgaenge():
    assert pruefe_durchgaenge(szenen(), uebergaenge()) == []
