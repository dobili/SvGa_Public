"""Tests für ``pipeline.abenteuer.objektrichtung`` und die Formfelder in den Prüfungen.

Warum: Ein im Karteneditor gedrehtes oder gespiegeltes Bild darf keine falschen Befunde zur
Blickrichtung auslösen (Auftrag des Hauptchats, 16.11.2026). Je Prüfung ein kleiner Kunstraum:
Ausrichtung (10.78), Tischlage (10.79), Anordnung (10.80), Fahrzeuge (10.65) und Übergangsbilder
(10.77). Die Pixeltests brauchen Pillow und erzeugen ihre Bilder selbst.
"""

import pytest

from pipeline.abenteuer import tischlage_teile
from pipeline.abenteuer.ausrichtung import pruefe_szene as ausrichtung
from pipeline.abenteuer.fahrzeuge import fahrzeughinweise
from pipeline.abenteuer.objektrichtung import (
    ausgerichtet,
    drehe_achse,
    drehe_richtung,
    forme_rechteck,
    katalogrichtung,
)
from pipeline.abenteuer.tischlage import pruefe_szene as tischlage
from pipeline.abenteuer.uebergangsarten import moebel_am

K = 16
RAUM = ["#" * 10] * 2 + ["#" + "." * 8 + "#"] * 4 + ["#" * 10]


def _m(quelle: str, breite: int, hoehe: int, **angaben) -> dict:
    return {"quelle": quelle, "breite": breite, "hoehe": hoehe, "kollision": True, **angaben}


MOEBEL = {
    "tisch": _m("tisch.png", 32, 32, art="tisch", platte=[0, 8, 16, 24]),
    "stuhlLinks": _m("s.png", 16, 32, art="stuhl", blick="links"),
    "stuhlUnten": _m("u.png", 16, 32, art="stuhl", blick="unten"),
    "gleis": _m("g.png", 16, 16, lauf="waagrecht", verbund="gleis"),
}


def _szene(objekte: list[dict]) -> dict:
    return {"karte": "test.raum", "art": "innen", "raster": RAUM, "objekte": objekte}


def test_richtung_spiegelt_und_dreht_im_uhrzeigersinn():
    assert drehe_richtung("links", {"spiegeln": True}) == "rechts"
    assert drehe_richtung("unten", {"drehung": 90}) == "links"
    assert drehe_richtung("nord", {"drehung": 90}) == "ost"
    assert drehe_richtung("links", {"spiegeln": True, "drehung": 180}) == "links"
    assert drehe_richtung("keine", {"drehung": 90}) == "keine"
    assert drehe_achse("waagrecht", {"drehung": 270}) == "senkrecht"
    assert drehe_achse("waagrecht", {"spiegeln": True}) == "waagrecht"
    assert katalogrichtung("rechts", {"spiegeln": True}) == "links"


def test_rechteck_folgt_der_form():
    assert forme_rechteck((0, 0, 16, 8), 32, 16, {"spiegeln": True}) == (16, 0, 32, 8)
    # Oben links im 32 × 16-Bild → nach 90 Grad oben rechts im 16 × 32-Bild.
    assert forme_rechteck((0, 0, 16, 8), 32, 16, {"drehung": 90}) == (8, 0, 16, 16)
    assert forme_rechteck((0, 0, 16, 8), 32, 16, {"massstab": 2}) == (0, 0, 32, 16)


def test_ausgerichtet_ohne_form_ist_dieselbe_angabe():
    assert ausgerichtet(MOEBEL["stuhlLinks"], {"feld": [1, 1]}) is MOEBEL["stuhlLinks"]
    gedreht = ausgerichtet(MOEBEL["tisch"], {"drehung": 90, "maske": ["#"]})
    assert gedreht["platte"] == [8, 0, 24, 16] and "maske" not in gedreht


def test_ausrichtung_gespiegelter_stuhl_schaut_zum_tisch():
    """Stuhl links vom Tisch, Katalogblick „links“: gespiegelt schaut er zum Tisch (kein Befund)."""
    stuhl = {"moebel": "stuhlLinks", "feld": [3, 2]}
    objekte = [{"moebel": "tisch", "feld": [4, 2]}, stuhl]
    assert any("nicht zu tisch" in b.text for b in ausrichtung(_szene(objekte), MOEBEL))
    stuhl["spiegeln"] = True
    assert ausrichtung(_szene(objekte), MOEBEL) == []


def test_ausrichtung_gedrehtes_gleis_laeuft_mit_der_anlage():
    senkrecht = [{"moebel": "gleis", "feld": [4, y]} for y in range(2, 6)]
    assert any("läuft waagrecht" in b.text for b in ausrichtung(_szene(senkrecht), MOEBEL))
    for eintrag in senkrecht:
        eintrag["drehung"] = 90
    befunde = ausrichtung(_szene(senkrecht), MOEBEL)
    assert not any("läuft" in b.text for b in befunde)


def test_tischlage_gedrehter_stuhl_neben_dem_tisch():
    """Stuhl mit Blick „unten“, um 90 Grad gedreht, schaut nach links: neben dem Tisch kein Befund
    zur Blickrichtung, die Prüfung misst ihn wie einen Stuhl mit Blick nach links."""
    alt = tischlage_teile.BESTAND[0]
    tischlage_teile.BESTAND[0] = None
    try:
        objekte = [
            {"moebel": "tisch", "feld": [2, 2]},
            {"moebel": "stuhlUnten", "feld": [4, 2], "drehung": 90},
        ]
        stuecke = tischlage_teile.stuecke_der_szene(_szene(objekte), MOEBEL)
        assert stuecke[1].angabe["blick"] == "links"
        tisch = stuecke[0]
        assert tisch.platte == (32, 40, 48, 56)
        assert all("blick" not in b.text for b in tischlage(_szene(objekte), MOEBEL))
    finally:
        tischlage_teile.BESTAND[0] = alt


def test_fahrzeug_gedreht_passt_zur_fahrbahn():
    me = "modern-exteriors/x/ME_Singles_Vehicles_16x16_"
    moebel = {"bus": {"quelle": me + "Bus_Left_2.png"}}
    strasse = ["s" * 3 + "." * 9] * 12
    szene = {"boden": "gras", "boeden": {"s": "asphalt"}}
    bus = {"name": "bus", "x": 0, "y": 4 * K, "breite": 3 * K, "hoehe": 3 * K}
    assert len(fahrzeughinweise(szene, strasse, [bus], moebel)) == 1
    assert fahrzeughinweise(szene, strasse, [{**bus, "drehung": 90}], moebel) == []


def test_uebergangsbilder_lesen_die_gedrehte_groesse():
    moebel = {"tuer": _m("tuer.png", 32, 16, art="tuer")}
    szene = _szene([{"moebel": "tuer", "feld": [3, 2], "drehung": 90}])
    (_, angabe, art), *_ = moebel_am(szene, [(3, 3)], moebel)
    assert art == "tuer" and (angabe["breite"], angabe["hoehe"]) == (16, 32)


def test_pixel_mit_form_und_ausschnitt(tmp_path):
    """Deckende Fläche wie auf der Karte: Ausschnitt eines Bogens, dann gespiegelt."""
    image = pytest.importorskip("PIL.Image")
    bogen = image.new("RGBA", (32, 16), (0, 0, 0, 0))
    for x in range(16, 20):  # deckend: links im rechten Teil des Bogens
        for y in range(16):
            bogen.putpixel((x, y), (200, 100, 50, 255))
    bogen.save(tmp_path / "bogen.png")
    alt, tischlage_teile.BESTAND[0] = tischlage_teile.BESTAND[0], tmp_path
    try:
        angabe = _m("bogen.png", 16, 16, ausschnitt=[16, 0, 32, 16])
        gerade = tischlage_teile.Stueck(angabe, {"name": "bk", "x": 0, "y": 0, "breite": 16, "hoehe": 16}, {})
        gespiegelt = tischlage_teile.Stueck(angabe, {**gerade.s, "spiegeln": True}, {})
        assert gerade.deckend == (0, 0, 4, 16)
        assert gespiegelt.deckend == (12, 0, 16, 16)
    finally:
        tischlage_teile.BESTAND[0] = alt


def test_anordnung_gespiegelter_stuhl_zaehlt_am_tisch():
    """10.80: Zwei Stühle mit Katalogblick „links“, der linke gespiegelt: Beide sitzen am Tisch,
    und der zu tief stehende Tisch fällt auf (ohne Spiegeln zählte der linke Stuhl nicht)."""
    pytest.importorskip("PIL")
    from pipeline.abenteuer.anordnung import pruefe_tische

    moebel = {
        "tisch": {"quelle": "x/t.png", "art": "tisch"},
        "stuhl": {"quelle": "x/s.png", "art": "stuhl", "blick": "links"},
    }

    def stueck(name: str, x: int, breite: int) -> dict:
        y = 2 if name == "tisch" else 1
        return {
            "name": name,
            "x": x * K,
            "y": y * K,
            "breite": breite * K,
            "hoehe": 2 * K,
            "id": f"{name}{x}",
        }

    links = stueck("stuhl", 1, 1)
    gesetzt = [links, stueck("tisch", 2, 2), stueck("stuhl", 4, 1)]
    assert pruefe_tische({}, gesetzt, moebel, {}) == []
    links["spiegeln"] = True
    assert any("nicht auf Höhe" in b for b in pruefe_tische({}, gesetzt, moebel, {}))
