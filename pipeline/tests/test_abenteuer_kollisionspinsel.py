"""Tests für den Kollisionspinsel (``kollisionspinsel``): gemalte Sperren und Freigaben der Szene.

Warum: Der Autor malt im Karteneditor Kacheln als gesperrt oder frei, unabhängig von den Bildern
(Wunsch des Autors, 16.11.2026). Kartenbau, Tiled-Karte, Prüfungen (Durchgang, Kartenregeln,
Erreichbarkeit) und Rücklauf müssen die Felder gleich lesen; ohne sie bleibt jede Karte gleich.
Kleine Kunstdaten, ohne private Bilder.
"""

import json
from pathlib import Path

from pipeline.abenteuer import editorrueck, karten
from pipeline.abenteuer.durchgang import gesperrte_felder
from pipeline.abenteuer.kartenbau import platziere, sperrfelder, tiled
from pipeline.abenteuer.kartenregeln import pruefe_eingaenge
from pipeline.abenteuer.kollisionspinsel import pinselbefunde, pinselhinweise, wende_an

SOFA = {"quelle": "s.png", "breite": 64, "hoehe": 32, "kollision": True, "art": "sofa"}
MOEBEL = {"sofa": SOFA}
# Raum 8 × 5: Randwand, Boden innen, Tür (Lücke) unten bei x = 4.
RASTER = ["########", "#......#", "#......#", "#......#", "####.###"]
VORLAGE = json.loads(
    (Path(__file__).resolve().parents[2] / "inhalte/abenteuer/karten/maple-falls-dachboden.json").read_text(
        encoding="utf-8"
    )
)


def _szene(**felder) -> dict:
    return {
        "karte": "t.raum",
        "raster": list(RASTER),
        "objekte": [{"moebel": "sofa", "feld": [1, 1]}],
        **felder,
    }


def _karte(szene: dict) -> dict:
    gesetzt = platziere(szene, MOEBEL)[0]
    return tiled(szene, szene["raster"], gesetzt, VORLAGE)


def _mit_sofa(tu):
    """Führt ``tu`` mit dem Kunstsofa in der Möbelliste von ``karten`` aus (moebelfelder liest sie)."""
    alt = dict(karten.MOEBEL)
    karten.MOEBEL["sofa"] = SOFA
    try:
        return tu()
    finally:
        karten.MOEBEL.clear()
        karten.MOEBEL.update(alt)


def test_freigabe_sticht_das_moebel_und_seine_maske():
    (sofa,) = platziere(_szene(freigeben=[[2, 2]]), MOEBEL)[0]
    assert sperrfelder(sofa) == {(1, 2), (3, 2), (4, 2)}
    assert sofa["maske"] == ["....", "#.##"]
    karte = _karte(_szene(freigeben=[[2, 2]]))
    objekt = next(o for o in karte["layers"][3]["objects"] if o["type"] == "moebel")
    assert {"name": "maske", "type": "string", "value": "..../#.##"} in objekt["properties"]
    assert {"name": "freigeben", "type": "string", "value": "2,2"} in karte["properties"]
    assert _mit_sofa(lambda: (2, 2) not in karten.blockiert(karte) and (3, 2) in karten.blockiert(karte))


def test_freigabe_mit_feinschub_nimmt_jede_beruehrte_maskenkachel():
    szene = _szene(objekte=[{"moebel": "sofa", "feld": [1, 1], "versatz": [8, 0]}], freigeben=[[3, 2]])
    gesetzt = platziere(szene, MOEBEL)[0]
    # Die Maskenkacheln liegen auf 24..40, 40..56, 56..72, 72..88 Pixeln. Die zweite und dritte
    # berühren Kachel 3 und entfallen; erste und vierte sperren weiter (1, 2), (2, 2), (4, 2), (5, 2).
    assert gesperrte_felder(szene["raster"], gesetzt, szene) == gesperrte_felder(szene["raster"], gesetzt) - {
        (3, 2)
    }


def test_sperre_wirkt_in_tiled_durchgang_und_erreichbarkeit():
    szene = _szene(objekte=[], sperren=[[4, 4]])
    karte = _karte(szene)
    waende = karte["layers"][1]["data"]
    assert waende[4 * 8 + 4] == 2 and _karte(_szene(objekte=[]))["layers"][1]["data"][4 * 8 + 4] == 0
    assert {"name": "sperren", "type": "string", "value": "4,4"} in karte["properties"]
    assert (4, 4) in karten.blockiert(karte)
    assert (4, 4) not in karten.erreichbar(karte, (2, 2))
    assert (4, 4) in gesperrte_felder(szene["raster"], [], szene)
    assert wende_an({(1, 1)}, {"sperren": [[5, 5]], "freigeben": [[1, 1]]}) == {(5, 5)}


def test_freigabe_in_der_wand_oeffnet_einen_weg():
    szene = _szene(objekte=[], freigeben=[[7, 2]], freigeben_grund="Geheimgang")
    karte = _karte(szene)
    assert karte["layers"][1]["data"][2 * 8 + 7] == 0 and karte["layers"][0]["data"][2 * 8 + 7] == 1
    assert (7, 2) in karten.erreichbar(karte, (2, 2))
    assert pinselbefunde(szene, szene["raster"]) == []


def test_befund_bei_freigabe_in_der_wand_ohne_grund_und_ausserhalb():
    szene = _szene(
        freigeben=[[0, 2], [9, 9]], sperren=[[2, 3], [0, 2]], ausloeser=[{"name": "x", "feld": [2, 3]}]
    )
    befunde = pinselbefunde(szene, szene["raster"])
    assert "Freigabe (0, 2) auf Wand oder Wasser '#' ohne freigeben_grund" in befunde
    assert "Freigabe (9, 9) liegt außerhalb der Karte" in befunde
    assert "Kachel (0, 2) ist zugleich gesperrt und freigegeben" in befunde
    assert "x liegt auf einer gemalten Sperre (2, 3)" in befunde
    assert pinselbefunde({"raster": RASTER, "sperren": [[1]]}, RASTER) == [
        "sperren muss eine Liste von [x, y] sein"
    ]


def test_hinweis_bei_ueberfluessigen_pinselkacheln():
    szene = _szene(sperren=[[0, 0], [5, 3]], freigeben=[[6, 3], [2, 2]])
    ohne = platziere({**szene, "freigeben": []}, MOEBEL)[0]
    assert pinselhinweise(szene, szene["raster"], ohne) == [
        "Sperre (0, 0) ist ohnehin gesperrt",
        "Freigabe (6, 3) ist ohnehin begehbar",
    ]


def test_kartenregeln_sehen_den_pinsel():
    szene = _szene(objekte=[], ausloeser=[{"name": "tuer", "feld": [4, 4]}])
    gesetzt = platziere(szene, MOEBEL)[0]
    assert pruefe_eingaenge(szene, szene["raster"], gesetzt) == []
    gesperrt = {**szene, "sperren": [[4, 3]]}
    assert pruefe_eingaenge(gesperrt, szene["raster"], gesetzt) == [
        "Eingang tuer: kein freier Gang von 2 Kacheln"
    ]


def test_ohne_pinsel_bleibt_die_karte_gleich():
    karte = _karte(_szene())
    objekt = next(o for o in karte["layers"][3]["objects"] if o["type"] == "moebel")
    assert all(e["name"] != "maske" for e in objekt["properties"])
    assert all(e["name"] not in ("sperren", "freigeben") for e in karte["properties"])
    assert karte == _karte(_szene(freigeben=[], sperren=[]))


def test_ruecklauf_nennt_pinselkacheln_mit_dem_bild_darunter():
    vorher = _szene(sperren=[[6, 1]])
    nachher = _szene(sperren=[[6, 3]], freigeben=[[2, 2], [3, 2], [0, 2]], freigeben_grund="Geheimgang")
    eintrag = {"datei": "raum.json", "vorher": vorher, "nachher": nachher, "zuordnung": [0]}
    zeilen = editorrueck.berichte(eintrag, MOEBEL)
    assert "Kollision: Pinsel sperrt kein Bild, Raster '.': (6, 3)" in zeilen
    assert "Kollision: Pinsel gibt frei unter sofa (sperrte dort): (2, 2), (3, 2)" in zeilen
    assert "Kollision: Pinsel gibt frei kein Bild, Raster '#': (0, 2)" in zeilen
    assert "Pinsel entfernt (sperren): (6, 1)" in zeilen
    assert "Grund der Freigaben: Geheimgang" in zeilen
    assert editorrueck.berichte({**eintrag, "nachher": vorher}, MOEBEL) == []
