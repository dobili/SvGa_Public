"""Tests für die feine Kollision (``kollisionfein``, ``feinbericht``, ``engstelle``).

Warum: Der Autor sperrt im Karteneditor Viertel, Hälften oder drei Viertel einer Kachel (Wunsch des
Autors, 16.11.2026). Kartenbau, Tiled-Karte, Ganzkachel-Prüfungen und App müssen das gleich lesen.
Die gemeinsamen Fälle stehen in ``app/src/abenteuer/oberwelt/feinsperren.faelle.json``; der
Vitest ``feinsperren.test.ts`` prüft dieselben Fälle in der App. Kleine Kunstdaten, ohne Bilder.
"""

import json
from pathlib import Path

from pipeline.abenteuer import karten
from pipeline.abenteuer.durchgang import gesperrte_felder
from pipeline.abenteuer.engstelle import erreichte_kacheln, pruefe_engstellen
from pipeline.abenteuer.feinbericht import anteil, feinbefunde, feinhinweise, feinzeilen, maske_fein_text
from pipeline.abenteuer.kartenbau import platziere, tiled
from pipeline.abenteuer.kollisionfein import grob_aus_fein, kachelzellen, sperrzellen
from pipeline.abenteuer.objektkollision import kollisionsbefunde, kollisionszeile

FAELLE = json.loads(
    (Path(__file__).resolve().parents[2] / "app/src/abenteuer/oberwelt/feinsperren.faelle.json").read_text(
        encoding="utf-8"
    )
)
MOEBEL = FAELLE["moebel"]
VORLAGE = {"tilesets": FAELLE["faelle"][0]["karte"]["tilesets"]}
HALB_OBEN = "########........"


def _mit_moebeln(tu):
    """Führt ``tu`` mit den Kunstmöbeln in der Möbelliste von ``karten`` aus."""
    alt = dict(karten.MOEBEL)
    karten.MOEBEL.update(MOEBEL)
    try:
        return tu()
    finally:
        karten.MOEBEL.clear()
        karten.MOEBEL.update(alt)


def test_gemeinsame_faelle_wie_in_der_app():
    for fall in FAELLE["faelle"]:
        szene = fall["szene"]
        gesetzt = platziere(szene, MOEBEL)[0]
        erwartet = {tuple(f) for f in fall["gesperrt"]}
        assert gesperrte_felder(szene["raster"], gesetzt, szene) == erwartet, fall["name"]
        karte = tiled(szene, szene["raster"], gesetzt, VORLAGE)
        # Die Datei der Fälle ist auf dem Stand des Kartenbaus (sonst prüft die App etwas anderes).
        assert {k: karte[k] for k in fall["karte"]} == fall["karte"], fall["name"]
        assert _mit_moebeln(lambda karte=karte: karten.blockiert(karte)) == erwartet, fall["name"]


def test_ohne_feine_felder_rechnet_der_durchgang_wie_bisher():
    szene = {
        "karte": "t",
        "raster": ["#...", "....", "...."],
        "objekte": [{"moebel": "kiste", "feld": [1, 1]}],
    }
    gesetzt = platziere(szene, MOEBEL)[0]
    zellen = sperrzellen(szene["raster"], gesetzt, szene)
    assert {(x // 4, y // 4) for x, y in zellen} == gesperrte_felder(szene["raster"], gesetzt, szene)
    assert zellen == kachelzellen((0, 0)) | kachelzellen((1, 1))


def test_grobe_maske_aus_feiner():
    assert grob_aus_fein(["..##", "....", "....", "....", "....", "....", "....", "...#"]) == ["#", "#"]
    assert grob_aus_fein(["........", "........", "........", ".......#"]) == [".#"]


def test_grobe_freigabe_nimmt_auch_die_feinen_zellen():
    szene = {
        "karte": "t",
        "raster": ["...", "..."],
        "objekte": [{"moebel": "kiste", "feld": [0, 0], "versatz": [8, 0], "maske_fein": ["####"] * 4}],
        "freigeben": [[1, 0]],
    }
    (kiste,) = platziere(szene, MOEBEL)[0]
    assert kiste["maske"] == ["."] and kiste["maske_fein"] == ["...."] * 4


def test_anteil_in_worten():
    assert anteil(HALB_OBEN) == "obere Hälfte"
    assert anteil("#...#...#...#...") == "linkes Viertel"
    assert anteil("............####") == "unteres Viertel"
    assert anteil(".###.###.###.###") == "rechte drei Viertel"
    assert anteil("##..##..........") == "obere Hälfte, linke Hälfte"
    assert anteil("#.#.............") == "2 von 16 Zellen"
    assert maske_fein_text(["####", "####", "....", "...."]) == "(0, 0) obere Hälfte"


def test_befunde_der_feinen_felder():
    szene = {
        "karte": "t",
        "raster": ["#..", "...", "..."],
        "sperren": [[1, 1]],
        "sperren_fein": [[1, 1, HALB_OBEN], [2, 2, HALB_OBEN], [5, 5, HALB_OBEN]],
        "freigeben_fein": [[0, 0, HALB_OBEN], [2, 2, HALB_OBEN]],
        "ausloeser": [{"name": "tuer", "feld": [2, 2]}],
    }
    befunde = feinbefunde(szene, szene["raster"])
    assert "Feine Sperre (5, 5) liegt außerhalb der Karte" in befunde
    assert "Feine Freigabe (0, 0) in Wand oder Wasser '#' ohne freigeben_grund" in befunde
    assert "Kachel (1, 1) ist grob und fein bemalt" in befunde
    assert "Kachel (2, 2): Zellen zugleich fein gesperrt und frei" in befunde
    assert any(b.startswith("tuer liegt auf einer feinen Sperre (2, 2)") for b in befunde)
    assert feinbefunde({"sperren_fein": [[0, 0, "###"]]}, ["."])[0].startswith("sperren_fein muss")


def test_hinweise_der_feinen_felder():
    szene = {
        "karte": "t",
        "raster": ["#..", "..."],
        "sperren_fein": [[0, 0, HALB_OBEN], [1, 0, "#" * 16]],
        "freigeben_fein": [[2, 1, HALB_OBEN]],
    }
    hinweise = feinhinweise(szene, szene["raster"], [])
    assert hinweise == [
        "Feine Sperre (0, 0) ist ohnehin gesperrt",
        "Feine Sperre (1, 0) ist eine ganze Kachel: grob schreiben",
        "Feine Freigabe (2, 1) ist ohnehin begehbar",
    ]


def test_objektmaske_fein_befunde_und_bericht():
    eintrag = {"moebel": "kiste", "feld": [1, 1], "maske_fein": ["#####"]}
    assert kollisionsbefunde({"objekte": [eintrag]}, MOEBEL) == [
        "kiste (1, 1): maske_fein ist größer als das Bild (4 × 4 Zellen)"
    ]
    neu = {"moebel": "kiste", "feld": [1, 1], "maske_fein": ["##..", "##..", "....", "...."]}
    zeile = kollisionszeile({"moebel": "kiste"}, neu, MOEBEL["kiste"], "(1, 1)")
    assert zeile == (
        "Kollision: kiste (1, 1): maske_fein (0, 0) obere Hälfte, linke Hälfte (ungedreht) (Katalog: sperrt)"
    )


def test_bericht_nennt_kachel_und_anteil():
    vorher = {"karte": "t", "raster": ["...", "..."], "objekte": [], "sperren_fein": [[0, 0, HALB_OBEN]]}
    nachher = {**vorher, "sperren_fein": [[2, 1, "#...#...#...#..."]], "freigeben_fein": []}
    assert feinzeilen(vorher, nachher, MOEBEL) == [
        "Kollision: Pinsel sperrt fein kein Bild, Raster '.': (2, 1) linkes Viertel",
        "Pinsel entfernt (sperren_fein): (0, 0)",
    ]


def _tuer(maske: str) -> dict:
    """Raum 5 × 3 mit einer Mittelwand bei x = 2 und einer Tür (2, 1), die eine feine Sperre verengt."""
    return {
        "karte": "t",
        "raster": ["..#..", ".....", "..#.."],
        "ausloeser": [{"name": "start", "feld": [0, 1]}, {"name": "tuer", "feld": [4, 1]}],
        "sperren_fein": [[2, 1, maske]],
    }


def test_engstelle_zwoelf_pixel_passen_acht_nicht():
    # Ein Viertel oben lässt 12 px (drei Viertel) frei: Hinweis. Die Hälfte lässt 8 px: Befund.
    befunde, hinweise = pruefe_engstellen(_tuer("####" + "." * 12), _tuer("")["raster"], [], MOEBEL)
    assert befunde == [] and hinweise == ["Engstelle: Der Weg zu tuer [(4, 1)] wird enger als 16 px"]
    befunde, hinweise = pruefe_engstellen(_tuer(HALB_OBEN), _tuer("")["raster"], [], MOEBEL)
    assert befunde == [
        "Engstelle: tuer [(4, 1)] ist mit den feinen Sperren nicht mehr erreichbar "
        "(Durchgang schmaler als 12 px)"
    ]


def test_erreichte_kacheln_mit_koerper_von_zwoelf_pixeln():
    # Gang von 3 Zellen (12 px) Höhe durch eine Wand aus Zellen: passt mit 3, nicht mit 4.
    gesperrt = {(x, y) for x in range(4, 8) for y in range(12) if not 4 <= y < 7}
    assert (2, 1) in erreichte_kacheln(gesperrt, (3, 3), 3, {(0, 1)})
    assert (2, 1) not in erreichte_kacheln(gesperrt, (3, 3), 4, {(0, 1)})
