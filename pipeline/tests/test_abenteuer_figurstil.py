"""Tests des Figurstils (pipeline/abenteuer/figurstil.py): chibi oder realistisch.

Die Messung von Hand (GEMESSEN) ist die Grundlage; die Tests laufen ohne das private Grafikpaket.
Liegt es lokal unter FIGURSTIL_FIGUREN (Ordner figuren-neu), prüft ein weiterer Test, dass jede
PixelLab-Figur vermessen ist.
"""

import os
from pathlib import Path

import pytest
from PIL import Image

from pipeline.abenteuer import figurstil as f


def test_einteilung_nach_kopfanteil():
    assert f.einteilung(0.52) == "chibi"
    assert f.einteilung(0.44) == "chibi"
    assert f.einteilung(0.42) == "grenzfall"
    assert f.einteilung(0.32) == "realistisch"


def test_kopfanteil_ambrose():
    assert round(f.kopfanteil(*f.GEMESSEN["ambrose"][:3]), 2) == 0.32


def test_messungen_sind_stimmig():
    for name, (scheitel, kinn, sohle, urteil) in f.GEMESSEN.items():
        assert 0 <= scheitel < kinn < sohle < 32, name
        assert urteil is None or urteil.split(":")[0] in {"chibi", "realistisch", "grenzfall"}, name


def test_realistisch_sind_ambrose_und_carla():
    """Befund vom 21.11.2026: die Frau mit Dutt und Jeansjacke ist Carla, nicht Juno."""
    leer = Image.new("RGBA", (32, 32))
    stufen = {name: f.miss(name, leer).einteilung for name in f.GEMESSEN}
    assert sorted(n for n, s in stufen.items() if s == "realistisch") == [
        "ambrose",
        "ambrose-jung",
        "carla",
        "skater-jo",
    ]
    assert stufen["juno"] == stufen["held-0"] == stufen["coach-delgado"] == "chibi"


def test_ungemessene_figur_bekommt_lineal(tmp_path: Path):
    bild = Image.new("RGBA", (32, 32))
    bild.paste((200, 50, 50, 255), (12, 4, 20, 30))
    assert f.miss("neu", bild).einteilung == "ungemessen"
    blatt = f.lineal(bild, "neu")
    assert blatt.width > 32 * f.LINEAL_ZOOM


def test_farbwerte_kontur_und_saettigung():
    bild = Image.new("RGBA", (32, 32))
    bild.paste((0, 0, 0, 255), (10, 10, 20, 20))
    bild.paste((255, 0, 0, 255), (11, 11, 19, 19))
    kontur, saettigung = f.farbwerte(bild)
    assert kontur == 1.0 and 0.5 < saettigung < 1.0


@pytest.mark.skipif(not os.environ.get("FIGURSTIL_FIGUREN"), reason="privates Paket nicht da")
def test_jede_pixellab_figur_ist_vermessen():
    ordner = Path(os.environ["FIGURSTIL_FIGUREN"])
    namen = {p.name for p in ordner.iterdir() if (p / "rotations" / "south.png").exists()}
    assert sorted(namen - set(f.GEMESSEN)) == []
