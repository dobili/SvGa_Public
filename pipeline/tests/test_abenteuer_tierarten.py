"""Tiere der Oberwelt: gemeinsame Zuordnung (``app/src/abenteuer/oberwelt/tierarten.json``).

Warum: Gutachter 10.11.2026. App und Vorschau hatten getrennte Listen, die auseinanderliefen
(Fuchs fehlte in der App, Möwe und Specht zeigten die Taube). Jetzt lesen App, Bogenbau und
Vorschau dieselbe Datei; hier wird geprüft, dass sie in sich stimmt und häufige Namen treffen.
"""

import json
from pathlib import Path

import pytest

DATEI = Path(__file__).resolve().parents[2] / "app/src/abenteuer/oberwelt/tierarten.json"
SCHNITTE = ("reihen", "streifen", "richtungen", "baender", "standbild", "ansichten")


def _daten() -> dict:
    return json.loads(DATEI.read_text(encoding="utf-8"))


def test_jeder_stamm_zeigt_auf_eine_art_mit_bild():
    d = _daten()
    assert set(d["staemme"].values()) <= set(d["arten"])
    for art, a in d["arten"].items():
        assert a["schnitt"] in SCHNITTE or a["schnitt"].startswith("fest:"), art
        assert a["breite"] > 0 and a["hoehe"] > 0, art


def test_vorschau_findet_dieselben_arten():
    from pipeline.abenteuer.belebungsvorschau import tierart

    erwartet = {"moewen": "moewe", "specht": "kraehe", "wuestenfuchs": "fuchs", "praeriehunde": "hase"}
    erwartet |= {"schwan": "gans", "enten": "ente", "eidechse": None}
    assert {n: tierart(n) for n in erwartet} == erwartet


def test_richtungen_nimmt_je_richtung_das_erste_bild():
    image = pytest.importorskip("PIL.Image")
    from pipeline.abenteuer.belebungsbilder import tierbogen

    quelle = image.new("RGBA", (24 * 2, 2))
    for i in range(24):
        for y in range(2):
            quelle.putpixel((i * 2, y), (i, 0, 0, 255))
    bogen = tierbogen(quelle, 2, 2, "richtungen")
    assert [bogen.getpixel((i * 2, 0))[0] for i in range(4)] == [0, 6, 12, 18]
    assert [bogen.getpixel((i * 2, 2))[0] for i in range(24)] == list(range(24))


def test_standbild_spiegelt_und_wippt():
    """Bison (Einzelbild nach rechts): links gespiegelt, Laufbilder wippen um ein Pixel."""
    image = pytest.importorskip("PIL.Image")
    from pipeline.abenteuer.belebungsbilder import tierbogen

    quelle = image.new("RGBA", (4, 4))
    quelle.putpixel((0, 3), (255, 0, 0, 255))  # Schwanz links unten, Kopf rechts
    bogen = tierbogen(quelle, 4, 4, "standbild")
    assert bogen.size == (24 * 4, 8)
    assert bogen.getpixel((0, 3))[0] == 255  # rechts wie die Quelle
    assert bogen.getpixel((2 * 4 + 3, 3))[0] == 255  # links gespiegelt
    assert bogen.getpixel((2 * 4, 4 + 2))[0] == 255  # drittes Laufbild ein Pixel höher
