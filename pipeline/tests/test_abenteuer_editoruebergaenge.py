"""Tests: Übergänge im Karteneditor 1.4 – Rücklauf nach orte.json, Paket, feste Ankunftsfelder.

Fälle aus Maple Falls (Wohnzimmer, Dachboden, Diner); orte.json nur als Kopie im Testordner.
"""

import json
from pathlib import Path

from pipeline.abenteuer import editorpaket, editorrueck, editoruebergaenge
from pipeline.abenteuer.ankunftsfeld import lies_feld, pruefe_szene

HAUPT = Path(__file__).resolve().parents[2]
ZIEL_ZIMMER = {"karte": "mapleFalls.zimmer", "ausloeser": "treppeDachboden"}


def _orte() -> dict:
    return {
        "orte": [
            {
                "kennung": "mapleFalls",
                "karten": [],
                "ausloeser": [
                    {"name": "start", "art": "start"},
                    {"name": "treppe", "art": "uebergang", "ziel": ZIEL_ZIMMER, "wenn": "x"},
                    {"name": "brett", "art": "gegenstand", "dialog": "d"},
                ],
            }
        ]
    }


def test_unterschiede_neu_geaendert_geloescht():
    alt = [{"name": "treppe", "art": "uebergang", "ziel": ZIEL_ZIMMER}]
    neu_ziel = {"karte": "mapleFalls.diner", "ausloeser": "tuer"}
    neu = [
        {"name": "treppe", "art": "uebergang", "ziel": neu_ziel},
        {"name": "luke", "karte": "mapleFalls.dachboden", "art": "uebergang", "ziel": ZIEL_ZIMMER},
    ]
    paare = editoruebergaenge.unterschiede({"vorher": {"mapleFalls": alt}, "nachher": {"mapleFalls": neu}})
    assert [(o, a is None, n is None) for o, a, n in paare] == [
        ("mapleFalls", False, False),
        ("mapleFalls", True, False),
    ]
    geloescht = editoruebergaenge.unterschiede({"vorher": {"mapleFalls": alt}, "nachher": {"mapleFalls": []}})
    assert geloescht == [("mapleFalls", alt[0], None)]


def test_wende_an_behaelt_felder_und_meldet_konflikte():
    orte = _orte()
    alt = {"name": "treppe", "art": "uebergang", "ziel": ZIEL_ZIMMER}
    geaendert = {**alt, "ziel": {"karte": "mapleFalls.diner", "ausloeser": "tuer"}}
    neu = {"name": "luke", "karte": "mapleFalls.dachboden", "art": "uebergang", "ziel": ZIEL_ZIMMER}
    zeilen, konflikte = editoruebergaenge.wende_an(
        orte, [("mapleFalls", alt, geaendert), ("mapleFalls", None, neu)]
    )
    liste = orte["orte"][0]["ausloeser"]
    assert liste[1] == {**geaendert, "wenn": "x"}  # „wenn“ bleibt
    assert liste[-1] == neu and list(liste[-1]) == ["name", "karte", "art", "ziel"]
    assert zeilen[0].startswith("Übergang geändert: mapleFalls treppe: mapleFalls.zimmer")
    assert "Übergang neu: mapleFalls luke (mapleFalls.dachboden)" in zeilen[1]
    assert not konflikte
    # Inzwischen anders (vorher passt nicht mehr): nichts schreiben, Konflikt melden.
    _, konflikte = editoruebergaenge.wende_an(orte, [("mapleFalls", alt, None)])
    assert konflikte and len(orte["orte"][0]["ausloeser"]) == 4
    zeilen, _ = editoruebergaenge.wende_an(orte, [("mapleFalls", neu, None)])
    assert zeilen[0].startswith("Übergang gelöscht: mapleFalls luke")
    assert all(a["name"] != "luke" for a in orte["orte"][0]["ausloeser"])


def test_warnung_fuer_geloeschten_auslöser_mit_verweis():
    szene = {
        "datei": "maple-falls-zimmer.json",
        "vorher": {"karte": "mapleFalls.zimmer", "ausloeser": [{"name": "treppeDachboden", "feld": [1, 1]}]},
        "nachher": {"karte": "mapleFalls.zimmer", "ausloeser": []},
    }
    warnungen = editoruebergaenge.verweiswarnungen([szene], _orte())
    assert warnungen == [
        "WARNUNG: Auslöser treppeDachboden gelöscht, aber mapleFalls treppe führt noch dorthin"
    ]
    variante = {**szene, "datei": "varianten/maple-falls-zimmer-b.json"}
    assert editoruebergaenge.verweiswarnungen([variante], _orte()) == []


def test_ruecklauf_schreibt_orte_kopie_im_stil_der_datei(tmp_path):
    orte = tmp_path / "orte.json"
    echt = (HAUPT / "inhalte" / "abenteuer" / "orte.json").read_text(encoding="utf-8")
    orte.write_text(echt, encoding="utf-8")
    definitionen = editorpaket.uebergangsdefinitionen(json.loads(echt)["orte"])["mapleFalls"]
    neu = {"name": "lukeDiner", "karte": "mapleFalls.dachboden", "art": "uebergang", "ziel": ZIEL_ZIMMER}
    daten = {
        "format": "karteneditor-aenderungen",
        "fassung": 1,
        "szenen": [],
        "uebergaenge": {
            "vorher": {"mapleFalls": definitionen},
            "nachher": {"mapleFalls": [*definitionen, neu]},
        },
    }
    datei = tmp_path / "aenderung.json"
    datei.write_text(json.dumps(daten), encoding="utf-8")
    bericht = tmp_path / "b"
    rueck = editorrueck.main(
        [str(datei), "--szenen", str(tmp_path), "--orte", str(orte), "--bericht", str(bericht)]
    )
    assert rueck == 0
    text = orte.read_text(encoding="utf-8")
    neu_text = editorrueck.als_text(json.loads(text), echt)
    assert neu_text == text  # gleicher Stil (Prettier, Breite 80)
    zusatz = [z for z in text.splitlines() if z not in echt.splitlines()]
    assert any('"lukeDiner"' in z for z in zusatz) and len(zusatz) <= 8
    assert "Übergang neu: mapleFalls lukeDiner" in (bericht / "aenderung" / "bericht.md").read_text(
        encoding="utf-8"
    )


def test_paket_kennt_karten_als_ziele():
    orte = [{"kennung": "a", "karten": [{"kennung": "a.raum", "datei": "karten/a-raum.json"}]}]
    szenen = [("a-raum.json", {"datei": "karten/a-raum.json"}), ("v.json", {"datei": "x", "variante": "b"})]
    karten = editorpaket.kartenverzeichnis(orte, szenen, {"ort.a.raum": "Raum"})
    assert karten == [
        {"kennung": "a.raum", "ort": "a", "ortsname": "a", "kartenname": "Raum", "datei": "a-raum.json"}
    ]


RAUM = {
    "karte": "test.raum",
    "raster": ["#####", "#...#", "#...#", "##.##"],
    "objekte": [],
    "figuren": [{"name": "mutter", "feld": [3, 1]}],
}


def _mit_ankunft(**eigenschaften) -> dict:
    ausloeser = [{"name": "tuer", "feld": [2, 3], "eigenschaften": eigenschaften}]
    return {**RAUM, "ausloeser": [*ausloeser, {"name": "start", "feld": [1, 1]}]}


def test_ankunftsfeld_frei_und_ohne_ausloeser():
    assert lies_feld("2, 1") == (2, 1) and lies_feld("zwei") is None
    assert pruefe_szene(_mit_ankunft(ankunft="2,2", blick="oben"), {}) == []
    assert pruefe_szene(_mit_ankunft(ankunft="1,1"), {}) == []  # auf „start“ darf er ankommen
    assert pruefe_szene(_mit_ankunft(ankunft="0,0"), {}) == ["tuer: Ankunftsfeld (0, 0) ist gesperrt"]
    assert pruefe_szene(_mit_ankunft(ankunft="3,1"), {}) == [
        "tuer: Ankunftsfeld (3, 1) ist von mutter besetzt"
    ]
    assert pruefe_szene(_mit_ankunft(ankunft="2,3"), {}) == [
        "tuer: Ankunftsfeld (2, 3) liegt auf dem Auslöser tuer"
    ]
    assert pruefe_szene(_mit_ankunft(ankunft="9,9"), {}) == [
        "tuer: Ankunftsfeld (9, 9) liegt außerhalb der Karte"
    ]
    assert pruefe_szene(_mit_ankunft(ankunft="2,2", blick="hoch"), {}) == [
        "tuer: Blick „hoch“ unbekannt (oben, unten, links, rechts)"
    ]
