"""Tests der Proportionen gegen die Figur (pipeline/abenteuer/proportionen.py).

Dauertest seit der Entscheidung des Autors (20.11.2026: innen Figur × 4/3, außen zu große Möbel mit
Maßstab): Kein gesetztes Möbel liegt außerhalb seines Bandes, außer den Ausnahmen mit Grund. Die
Bildhöhen kommen aus ``katalog_korrekturen/bildhoehen.json``; so laufen die Tests ohne das private
Grafikpaket.
"""

import re

from pipeline.abenteuer import proportionen as p

WELTMASSSTAB = p.WURZEL / "app" / "src" / "abenteuer" / "oberwelt" / "weltmassstab.ts"


def test_keine_befunde_auf_allen_karten():
    befunde = p.pruefe(p.lade_szenen(), p.lade_katalog(), p.lade_hoehen())
    assert [f"{b.moebel} {b.verhaeltnis} {b.stellen[:2]}" for b in befunde] == []


def test_innenfaktor_wie_in_der_app():
    text = WELTMASSSTAB.read_text()
    assert "export const INNEN_FIGURFAKTOR = 4 / 3;" in text
    assert abs(p.INNEN_FIGURFAKTOR - 4 / 3) < 1e-9
    assert re.search(r"INNEN_FIGURFAKTOR", text)


def test_parkbank_des_autors_ist_verkleinert():
    park = p.lade_szenen()["maple-falls-park"]
    baenke = [o for o in park["objekte"] if o.get("moebel") == "mfBank"]
    assert baenke and all(o.get("massstab") == 0.75 for o in baenke)


def test_bildhoehen_sind_gemessen():
    hoehen = p.lade_hoehen()
    assert len(hoehen) > 300
    assert hoehen["mfBank"] == 22  # Parkbank von vorn, ME City Props Bench 1


def test_ausnahmen_gibt_es_im_katalog():
    katalog = p.lade_katalog()
    assert [k for k in p.AUSNAHMEN if k not in katalog] == []


def test_band_nach_blick_und_form():
    assert p.band_fuer({"art": "stuhl", "blick": "unten", "hoehe": 32}) == p.BAENDER["stuhl"]
    assert p.band_fuer({"art": "stuhl", "blick": "oben", "hoehe": 32}) == p.VON_HINTEN["stuhl"]
    assert p.band_fuer({"art": "bank", "blick": "unten", "hoehe": 16}) == p.OHNE_LEHNE
    assert p.band_fuer({"art": "tuer", "blick": "unten", "hoehe": 16}) is None
    assert p.band_fuer({"art": "bank", "blick": "links", "hoehe": 32}) is None
    assert p.band_fuer({"art": "lampe", "hoehe": 32}) is None
    picknick = {"art": "tisch", "hoehe": 32, "quelle": "x/Picknicktisch.png"}
    assert p.band_fuer(picknick) == p.PICKNICK


def test_parkbank_mit_massstab_im_band():
    katalog = {"mfBank": {"art": "bank", "blick": "unten", "hoehe": 32, "quelle": "b.png"}}
    szene = {"art": "aussen", "objekte": [{"moebel": "mfBank", "feld": [1, 1]}]}
    befunde = p.pruefe({"park": szene}, katalog, {"mfBank": 22})
    assert len(befunde) == 1 and befunde[0].verhaeltnis == 1.1 and befunde[0].vorschlag == 0.75
    szene["objekte"][0]["massstab"] = 0.8
    assert p.pruefe({"park": szene}, katalog, {"mfBank": 22}) == []


def test_innenfaktor_vergroessert_die_figur_nur_innen():
    assert abs(p.figurhoehe({"art": "innen"}) - 80 / 3) < 1e-9
    assert p.figurhoehe({"art": "innen"}, 1.25) == 25
    assert p.figurhoehe({"art": "aussen"}, 1.25) == 20
    assert p.figurhoehe({"art": "aussen"}) == 20
