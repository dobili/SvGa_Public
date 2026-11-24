"""Tests: Blickrichtung im Karteneditor (Editor 1.7, Rückmeldung R008).

Warum: Stehende Figuren tragen ``blick``, Statisten ``eigenschaften.blick`` (App seit 16.11.2026).
Der Editor darf die Angabe weder beim Paketbau noch beim Rücklauf verlieren; der Rücklauf nennt
eine geänderte Richtung im Bericht. Das Paket bringt je Person die vier Standbilder mit
(``editorpersonen.py``); geprüft mit einem kleinen LimeZu-Bogen im Testordner (Pillow optional).

Aufruf: ``python -m pytest pipeline/tests/test_abenteuer_editorblick.py``
"""

import json

import pytest

from pipeline.abenteuer import editorrueck

VORHER = {
    "karte": "test.raum",
    "raster": ["#####", "#...#", "#####"],
    "figuren": [{"name": "mutter", "feld": [1, 1], "blick": "links"}],
    "belebung": [
        {"name": "gast", "typ": "statist", "feld": [3, 1], "eigenschaften": {"blick": "oben"}},
    ],
}
NACHHER = {
    **VORHER,
    "figuren": [{"name": "mutter", "feld": [1, 1], "blick": "rechts"}],
}
ORTE = [{"kennung": "test", "figuren": [{"kennung": "test.mutter", "sprite": "figuren/mutter.png"}]}]


def _aenderung() -> dict:
    return {
        "format": "karteneditor-aenderungen",
        "fassung": 1,
        "editor_version": "1.7.0",
        "zeitstempel": "2026-11-16T23:00:00Z",
        "szenen": [
            {
                "datei": "raum.json",
                "karte": "test.raum",
                "notiz": "",
                "vorher": VORHER,
                "nachher": NACHHER,
                "zuordnung": [],
                "markierungen": {"figuren": [0], "belebung": [0], "ausloeser": []},
            }
        ],
    }


def test_ruecklauf_behaelt_blick_und_nennt_aenderung(tmp_path):
    szenen = tmp_path / "szenen"
    szenen.mkdir()
    (szenen / "raum.json").write_text(editorrueck.als_text(VORHER), encoding="utf-8")
    datei = tmp_path / "aenderung.json"
    datei.write_text(json.dumps(_aenderung()), encoding="utf-8")
    rueck = editorrueck.main(
        [str(datei), "--szenen", str(szenen), "--bericht", str(tmp_path / "b"), "--ohne-bau"]
    )
    assert rueck == 0
    geschrieben = json.loads((szenen / "raum.json").read_text(encoding="utf-8"))
    assert geschrieben["figuren"][0]["blick"] == "rechts"
    assert geschrieben["belebung"][0]["eigenschaften"]["blick"] == "oben"  # unverändert erhalten
    zeilen = editorrueck.berichte(_aenderung()["szenen"][0])
    assert "Blick (figuren): mutter links → rechts" in zeilen
    assert not any("gast" in z for z in zeilen)


def test_personenschluessel_und_boegen():
    pytest.importorskip("PIL")
    from pipeline.abenteuer.editorpersonen import boegen_der_szene, personenschluessel

    assert personenschluessel("figuren", {"name": "hector"}) == "f:hector"
    statist = {"name": "gast", "eigenschaften": {"bild": "statist-07"}}
    assert personenschluessel("belebung", statist) == "b:gast|statist-07"
    boegen = boegen_der_szene(VORHER, ORTE)
    assert boegen["f:mutter"] == "figuren/mutter.png"
    # Bild nach der Rolle wie im Spiel (statistenwahl.py), kein gewürfelter Vorratsbogen mehr.
    assert boegen["b:gast|"].startswith("figuren/") and "statist-" not in boegen["b:gast|"]


def test_standbilder_je_richtung(tmp_path):
    image = pytest.importorskip("PIL.Image")
    from pipeline.abenteuer.editorpersonen import standbilder

    # LimeZu-Bogen 16 × 32 je Rahmen, vier Standbilder nebeneinander (rechts, oben, links, unten).
    (tmp_path / "spiel" / "figuren").mkdir(parents=True)
    image.new("RGBA", (64, 32), (200, 0, 0, 255)).save(tmp_path / "spiel" / "figuren" / "mutter.png")
    bilder = standbilder(tmp_path, {"figuren/mutter.png", "figuren/fehlt.png"})
    assert list(bilder) == ["figuren/mutter.png"]
    assert len(bilder["figuren/mutter.png"]) == 4
    assert all(u.startswith("data:image/png;base64,") for u in bilder["figuren/mutter.png"])
