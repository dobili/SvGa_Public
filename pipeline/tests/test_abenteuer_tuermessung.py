"""Tests: automatische Türmessung (``pipeline/abenteuer/tuermessung.py``, Regel 10.92).

Warum: 172 Gebäudebilder auf Außenkarten hatten kein Türmaß. Die Tests halten fest, woher die
Türspalte kommt (Katalog „tuer“, Grundriss), dass ein gezeichnetes Haus seine Tür samt Rahmen
gemessen bekommt, Stufen allein nicht als Tür zählen, und dass von Hand abgelesene oder im Bild
verworfene Einträge nie überschrieben werden. Pillow und numpy sind optional (importorskip).

Aufruf: ``python -m pytest pipeline/tests/test_abenteuer_tuermessung.py``
"""

import json

import pytest

from pipeline.abenteuer.tuermessung import Messung, grenzfall, schreibe, tuerspalten, verwirf

WAND, RAHMEN_FARBE, BLATT = (200, 180, 120, 255), (60, 40, 30, 255), (150, 90, 40, 255)


def _haus(stufen: bool = False):
    """Haus 64 × 64: Wand, Tür mit Rahmen 2 px außen [24, 28, 40, 60), Blatt [26, 30, 38, 60)."""
    image = pytest.importorskip("PIL.Image")
    pytest.importorskip("numpy")
    bild = image.new("RGBA", (64, 64), WAND)
    for x in range(24, 40):
        for y in range(28, 60):
            bild.putpixel((x, y), RAHMEN_FARBE)
    for x in range(26, 38):
        for y in range(30, 60):
            bild.putpixel((x, y), BLATT)
    if stufen:  # Tür vermauert, davor nur flache Stufen
        for x in range(24, 40):
            for y in range(28, 60):
                bild.putpixel((x, y), WAND)
        for x in range(10, 54):
            for y in range(56, 60):
                bild.putpixel((x, y), BLATT)
    return bild


def test_tuerspalten_aus_katalog_und_grundriss():
    assert tuerspalten({"breite": 128, "tuer": [[1, 9], [2, 9]]}, None, 128) == [(16, 48)]
    grundriss = {"breite": 8, "tueren": [{"von": 6, "bis": 6}]}
    assert tuerspalten({"breite": 128}, grundriss, 128) == [(80, 96)]
    assert tuerspalten({"breite": 64}, None, 64) == []


def test_miss_bild_findet_tuer_mit_rahmen():
    from pipeline.abenteuer.tuermessung import miss_bild

    rahmen = miss_bild(_haus(), [(16, 48)])
    assert rahmen is not None
    assert all(abs(a - b) <= 2 for a, b in zip(rahmen, [24, 28, 40, 60], strict=True))


def test_flache_stufen_sind_keine_tuer():
    from pipeline.abenteuer.tuermessung import miss_bild

    assert miss_bild(_haus(stufen=True), [(16, 48)]) is None


def test_schreiben_ueberschreibt_nichts(tmp_path):
    datei = tmp_path / "tuermasse.json"
    vorher = {"_hinweis": "x", "a/haus.png": {"rahmen": [1, 2, 3, 4], "herkunft": "von Hand"}}
    datei.write_text(json.dumps(vorher), encoding="utf-8")
    messungen = [
        Messung("b/haus.png", [9, 9, 9, 9]),  # gleicher Dateiname: von Hand geht vor
        Messung("c/neu.png", [0, 10, 14, 34]),
        Messung("d/falsch.png", [0, 0, 5, 5]),
        Messung("e/silo.png", None, "keine Türangabe"),
    ]
    assert verwirf({"falsch.png": "Fenster statt Tür"}, messungen, datei) == 1
    assert schreibe(messungen, datei) == 2
    daten = json.loads(datei.read_text(encoding="utf-8"))
    assert daten["a/haus.png"]["rahmen"] == [1, 2, 3, 4] and "b/haus.png" not in daten
    assert daten["c/neu.png"] == {"rahmen": [0, 10, 14, 34], "herkunft": "gemessen"}
    assert daten["d/falsch.png"] == {"herkunft": "verworfen", "grund": "Fenster statt Tür"}
    assert daten["e/silo.png"] == {"herkunft": "nicht messbar", "grund": "keine Türangabe"}


def test_grenzfaelle():
    assert grenzfall(Messung("x.png", None, "keine Türfläche gefunden")) == "keine Türfläche gefunden"
    assert grenzfall(Messung("x.png", [0, 0, 12, 20])) == "knapp an der Figurgröße"
    assert grenzfall(Messung("x.png", [0, 0, 60, 10])) == "Form unplausibel"
    assert grenzfall(Messung("x.png", [0, 0, 30, 33])) == ""
