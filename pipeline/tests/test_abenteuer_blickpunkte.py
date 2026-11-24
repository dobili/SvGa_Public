"""Tests für die Prüfung der Blickpunkte (``pipeline/abenteuer/blickpunkte.py``).

Warum: Ambrose sagt an Stellen etwas, an denen der Held zum ersten Mal vorbeikommt (Wunsch des
Autors, 24.11.2026). Die Stellen (ambrose_blickpunkte.json) und ihre Texte (ambrose-blick.ink)
schreiben verschiedene Hände; der Dauertest hält fest, dass beide zusammenpassen, jede Stelle auf
ihrer Karte liegt, erreichbar ist und nicht schon im Eingang der Karte auslöst.

Aufruf: ``python -m pytest pipeline/tests/test_abenteuer_blickpunkte.py``
"""

from pipeline.abenteuer.blickpunkte import ankunftsfelder, im_radius, knotenvorsilbe, pruefe

KIOSK = {"karte": "mapleFalls.park", "feld": [25, 13], "radius": 3, "knoten": "blick_mapleFalls_park_kiosk"}


def _pruefe(**aenderung) -> list[str]:
    punkt = {**KIOSK, **aenderung}
    return pruefe([punkt], [punkt["knoten"]])


def test_dauertest_null_befunde():
    """Die Dateien des Repositorys: Jede Stelle hat ihren Knoten, liegt richtig und stört nicht."""
    assert pruefe() == []


def test_probeeintrag_ist_in_ordnung():
    assert _pruefe() == []


def test_eintrag_ohne_knoten_und_knoten_ohne_eintrag():
    befunde = pruefe([KIOSK], ["blick_mapleFalls_park_teich"])
    assert "blick_mapleFalls_park_kiosk: Knoten fehlt in ambrose-blick.ink" in befunde
    assert "blick_mapleFalls_park_teich: Knoten ohne Eintrag in ambrose_blickpunkte.json" in befunde


def test_doppelter_eintrag():
    befunde = pruefe([KIOSK, KIOSK], [KIOSK["knoten"]])
    assert befunde == ["blick_mapleFalls_park_kiosk: steht mehrfach in ambrose_blickpunkte.json"]


def test_form_radius_name_und_bedingung():
    assert "Radius 9" in _pruefe(radius=9)[0]
    assert "heißt nicht blick_mapleFalls_park_<stichwort>" in _pruefe(knoten="blick_kiosk")[0]
    assert "unlesbar" in _pruefe(wann="nadelMapleFalls >=")[0]
    assert _pruefe(wann="nadelMapleFalls >= 1") == []
    assert "Feld fehlt" in _pruefe(feld=[25.5, 13])[0]


def test_feld_ausserhalb_und_unbekannte_karte():
    assert "liegt nicht auf der Karte" in _pruefe(feld=[99, 13])[0]
    befunde = _pruefe(karte="mapleFalls.keller", knoten="blick_mapleFalls_keller_fass")
    assert befunde == [
        "blick_mapleFalls_keller_fass: Karte mapleFalls.keller gibt es nicht (keine Grundszene)"
    ]


def test_nicht_im_eingang_der_karte():
    """Am Parkeingang (Übergang „park“ auf x = 0, y = 15 bis 17) löste Ambrose sofort aus."""
    (befund,) = _pruefe(feld=[2, 16])
    assert "löst im Eingang der Karte aus" in befund


def test_ankunftsfelder_mit_festgelegter_ankunft():
    szene = {
        "ausloeser": [
            {"name": "start", "feld": [6, 6]},
            {"name": "treppe", "feld": [1, 8], "eigenschaften": {"ankunft": "2,9"}},
            {"name": "brett", "feld": [7, 6]},
        ]
    }
    felder = ankunftsfelder(szene, {"treppe"}, {(0, 8), (1, 7)})
    assert felder == {(6, 6), (1, 8), (2, 9), (2, 8), (1, 9)}


def test_radius_ist_luftlinie_und_vorsilbe():
    assert im_radius((25, 13), 3, (25, 16))
    assert not im_radius((25, 13), 3, (27, 16))
    assert knotenvorsilbe("mapleFalls.park") == "blick_mapleFalls_park_"
