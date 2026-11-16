"""Tests für das Paket und den Rücklauf des Karteneditors (``editorpaket``, ``editorrueck``,
``editorkatalog``).

Warum: Das Paket muss ohne Server laufen (daten.js), der Rücklauf darf keine fremden Änderungen
überschreiben und soll genau berichten. Kleine Kunstdaten statt der privaten Bilder; was Pillow
braucht, wird ohne Pillow übersprungen.
"""

import json
from pathlib import Path

import pytest

from pipeline.abenteuer import editorpaket, editorrueck
from pipeline.abenteuer.editorkatalog import anzeigename, bibliothekseintrag, kategorie, kurzbeschreibung

# Kleinstes gültiges PNG (1 × 1, durchsichtig).
PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d4948445200000001000000010806000000"
    "1f15c4890000000d49444154789c6360000002000005000176e7d2a80000000049454e44ae426082"
)


def test_katalog_leitet_namen_und_kategorien_ab():
    assert anzeigename("mf4SofaGruen") == "Sofa Gruen"
    assert anzeigename("parkbank") == "Parkbank"
    assert kategorie("sofa") == ("Möbel", "Sofa")
    assert kategorie("bruecke") == ("Wasser, Brücken, Fels", "Brücke")
    assert kategorie(None) == ("Sonstiges", "ohne Art")
    assert kurzbeschreibung({}, {"beschreibung": "x " * 200}).endswith("…")
    eintrag = bibliothekseintrag("ca1Halle", {"breite": 64, "hoehe": 64}, "capital", {"art": "gebaeude"})
    assert eintrag["umgebung"] and eintrag["kategorie"] == "Gebäude"


def _privat(tmp_path: Path) -> tuple[Path, Path]:
    privat = tmp_path / "privat"
    (privat / "bilder").mkdir(parents=True)
    (privat / "bilder" / "sofa.png").write_bytes(PNG)
    moebel = tmp_path / "moebel"
    moebel.mkdir()
    angaben = {
        "tsSofa": {"quelle": "bilder/sofa.png", "breite": 16, "hoehe": 16, "kollision": True, "art": "sofa"},
        "tsSofa2": {"quelle": "bilder/sofa.png", "breite": 16, "hoehe": 16, "kollision": True},
        "tsFehlt": {"quelle": "bilder/fehlt.png", "breite": 16, "hoehe": 16, "kollision": False},
    }
    (moebel / "test.json").write_text(json.dumps({"moebel": angaben}), encoding="utf-8")
    return privat, moebel


def test_bibliothek_teilt_bilder_und_meldet_fehlende(tmp_path):
    privat, moebel = _privat(tmp_path)
    eintraege, bilder, befunde = editorpaket.bibliothek(privat, moebel)
    assert set(eintraege) == {"tsSofa", "tsSofa2"}
    assert len(bilder) == 1 and bilder[0].startswith("data:image/png;base64,")
    assert eintraege["tsSofa"]["bild"] == eintraege["tsSofa2"]["bild"] == 0
    assert befunde == ["tsFehlt: Bild bilder/fehlt.png fehlt"]


def test_bibliothek_schneidet_bodenkacheln_und_liefert_kollision(tmp_path):
    """Bodenkacheln (bodenkacheln.py) kommen als eigene Bilder aus dem Bogen; jeder Eintrag trägt
    Kollision, Maske, Grund und „flach“ für die Übersteuerung im Editor."""
    image = pytest.importorskip("PIL.Image")
    privat, moebel = _privat(tmp_path)
    image.new("RGBA", (32, 16), (200, 100, 0, 255)).save(privat / "bilder" / "bogen.png")
    angaben = {
        "bkA": {"quelle": "bilder/bogen.png", "ausschnitt": [0, 0, 16, 16], "breite": 16, "hoehe": 16},
        "bkB": {"quelle": "bilder/bogen.png", "ausschnitt": [16, 0, 32, 16], "breite": 16, "hoehe": 16},
        "tsKiste": {
            "quelle": "bilder/sofa.png",
            "breite": 16,
            "hoehe": 16,
            "kollision": True,
            "maske": ["#"],
        },
    }
    for eintrag in angaben.values():
        eintrag.setdefault("art", "boden_teil")
    angaben["tsKiste"].update(art="kiste", begehbar_grund="nur Test")
    (moebel / "test.json").write_text(json.dumps({"moebel": angaben}), encoding="utf-8")
    eintraege, bilder, _ = editorpaket.bibliothek(privat, moebel)
    assert eintraege["bkA"]["bild"] != eintraege["bkB"]["bild"] and len(bilder) == 3
    assert eintraege["bkA"]["flach"] and not eintraege["tsKiste"]["flach"]
    assert eintraege["tsKiste"]["maske"] == ["#"] and eintraege["tsKiste"]["begehbar_grund"] == "nur Test"


def test_geschwister_aus_zustaenden():
    orte = [{"karten": [{"datei": "karten/a.json", "zustaende": {"x": "karten/a-x.json"}}]}]
    szenen = [("a.json", {"datei": "karten/a.json"}), ("a-x.json", {"datei": "karten/a-x.json"})]
    assert editorpaket.geschwister(orte, szenen) == {"a.json": ["a-x.json"], "a-x.json": ["a.json"]}


def test_paket_schreibt_seite_und_daten(tmp_path):
    datei = editorpaket.schreibe_paket({"format": 1, "szenen": []}, tmp_path / "paket")
    assert datei.read_text(encoding="utf-8").startswith("window.EDITOR_DATEN = {")
    assert (tmp_path / "paket" / "index.html").exists()
    assert (tmp_path / "paket" / "js" / "zustand.js").exists()
    assert not (tmp_path / "paket" / "test").exists()


def _aenderung(vorher: dict, nachher: dict, zuordnung: list) -> dict:
    return {
        "format": "karteneditor-aenderungen",
        "fassung": 1,
        "editor_version": "1.0.0",
        "zeitstempel": "2026-11-15T12:00:00Z",
        "szenen": [
            {
                "datei": "raum.json",
                "karte": "test.raum",
                "notiz": "Sofa an die Wand",
                "vorher": vorher,
                "nachher": nachher,
                "zuordnung": zuordnung,
                "objektnotizen": [{"index": 0, "moebel": "sofa", "notiz": "näher ans Fenster"}],
            }
        ],
    }


VORHER = {
    "karte": "test.raum",
    "raster": ["####", "#..#", "####"],
    "objekte": [{"moebel": "sofa", "feld": [1, 1]}, {"moebel": "lampe", "feld": [2, 1]}],
    "figuren": [{"name": "mutter", "feld": [1, 1]}],
}
NACHHER = {
    "karte": "test.raum",
    "raster": ["####", "#.t#", "####"],
    "objekte": [
        {"moebel": "sofa", "feld": [2, 1], "versatz": [0, 3], "drehung": 90, "ebene": 2},
        {"moebel": "vase", "feld": [1, 1]},
    ],
    "figuren": [{"name": "mutter", "feld": [2, 1]}],
}


def test_bericht_nennt_jede_aenderung_mit_koordinaten():
    zeilen = editorrueck.berichte(_aenderung(VORHER, NACHHER, [0, None])["szenen"][0])
    text = "\n".join(zeilen)
    assert "verschoben: sofa (1, 1) → (2, 1) + (0, 3) px" in text
    assert "gedreht: sofa" in text and "auf 90°" in text
    assert "Ebene: sofa (2, 1) + (0, 3) px 0 → 2" in text
    assert "hinzugefügt: vase (1, 1)" in text
    assert "gelöscht: lampe (2, 1)" in text
    assert "verschoben (figuren): mutter (1, 1) → (2, 1)" in text
    assert "Boden: 1 Felder bemalt: (2, 1) '.' → 't'" in text
    assert "Notiz zu sofa" in text


def test_ruecklauf_schreibt_szene_und_bericht(tmp_path):
    szenen = tmp_path / "szenen"
    szenen.mkdir()
    (szenen / "raum.json").write_text(editorrueck.als_text(VORHER), encoding="utf-8")
    datei = tmp_path / "aenderung.json"
    datei.write_text(json.dumps(_aenderung(VORHER, NACHHER, [0, None])), encoding="utf-8")
    rueck = editorrueck.main([str(datei), "--szenen", str(szenen), "--bericht", str(tmp_path / "b")])
    assert rueck == 0
    assert json.loads((szenen / "raum.json").read_text(encoding="utf-8")) == NACHHER
    bericht = (tmp_path / "b" / "aenderung" / "bericht.md").read_text(encoding="utf-8")
    assert "Notiz des Autors: Sofa an die Wand" in bericht


def test_ruecklauf_ueberschreibt_keine_fremden_aenderungen(tmp_path):
    szenen = tmp_path / "szenen"
    szenen.mkdir()
    fremd = {**VORHER, "boden": "dielen"}
    (szenen / "raum.json").write_text(json.dumps(fremd), encoding="utf-8")
    datei = tmp_path / "aenderung.json"
    datei.write_text(json.dumps(_aenderung(VORHER, NACHHER, [0, None])), encoding="utf-8")
    rueck = editorrueck.main([str(datei), "--szenen", str(szenen), "--bericht", str(tmp_path / "b")])
    assert rueck == 1
    assert json.loads((szenen / "raum.json").read_text(encoding="utf-8")) == fremd


def test_ruecklauf_lehnt_fremde_dateien_ab(tmp_path):
    datei = tmp_path / "x.json"
    datei.write_text(json.dumps({"format": "anderes"}), encoding="utf-8")
    with pytest.raises(ValueError):
        editorrueck.lies(datei)
    boese = _aenderung(VORHER, NACHHER, [0, None])
    boese["szenen"][0]["datei"] = "../orte.json"
    datei.write_text(json.dumps(boese), encoding="utf-8")
    with pytest.raises(ValueError):
        editorrueck.lies(datei)


def test_dateistil_bleibt_erhalten():
    eingerueckt = json.dumps(VORHER, ensure_ascii=False, indent=2) + "\n"
    assert editorrueck.als_text(VORHER, eingerueckt) == eingerueckt
    prettier = editorrueck.als_text(VORHER)
    assert '"feld": [1, 1]' in prettier
