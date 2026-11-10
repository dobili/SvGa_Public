"""Tests für ``pipeline.abenteuer.belebungsbilder``: Tierbögen im Spielformat.

Warum: Die App liest die Tierbögen mit festen Rahmen (Reihe 0 Stand, Reihe 1 Laufen, 24 breit).
Die Vorlagen sind unterschiedlich gebaut; die Tests prüfen jede Art mit kleinen Kunstbildern,
weil die gekaufte Grafik nicht im öffentlichen Repository liegt.
"""

import pytest

# Pillow steht nicht in pipeline/requirements.txt (nur die Bildwerkzeuge brauchen es, lokal);
# ohne Pillow, etwa in GitHub Actions, wird diese Datei übersprungen.
Image = pytest.importorskip("PIL.Image")

from pipeline.abenteuer.belebungsbilder import RAHMEN_JE_REIHE, _baender, tierbogen  # noqa: E402

ROT = (255, 0, 0, 255)
BLAU = (0, 0, 255, 255)


def _streifen(farbe_y0: tuple, farbe_y1: tuple, breite: int, hoehe: int) -> Image.Image:
    """Vorlage mit zwei Reihen: oben ``farbe_y0``, darunter ``farbe_y1``."""
    bild = Image.new("RGBA", (RAHMEN_JE_REIHE * breite, 2 * hoehe))
    bild.paste(farbe_y0, (0, 0, bild.width, hoehe))
    bild.paste(farbe_y1, (0, hoehe, bild.width, 2 * hoehe))
    return bild


def test_reihen_vorlage_ergibt_stand_und_laufen():
    bogen = tierbogen(_streifen(ROT, BLAU, 16, 16), 16, 16, "reihen")
    assert bogen.size == (RAHMEN_JE_REIHE * 16, 32)
    assert bogen.getpixel((0, 0)) == ROT
    assert bogen.getpixel((5 * 16, 0))[3] == 0  # nur vier Standbilder
    assert bogen.getpixel((23 * 16, 16)) == BLAU


def test_streifen_vorlage_wiederholt_die_bewegung():
    quelle = Image.new("RGBA", (6 * 16, 16), ROT)
    bogen = tierbogen(quelle, 16, 16, "streifen")
    assert bogen.getpixel((3 * 16, 0)) == ROT
    assert bogen.getpixel((23 * 16 + 8, 24)) == ROT


def test_feste_hoehen_lesen_die_genannten_reihen():
    quelle = Image.new("RGBA", (RAHMEN_JE_REIHE * 8, 40))
    quelle.paste(ROT, (0, 0, quelle.width, 8))
    quelle.paste(BLAU, (0, 32, quelle.width, 40))
    bogen = tierbogen(quelle, 8, 8, "fest:0:32")
    assert bogen.getpixel((0, 0)) == ROT
    assert bogen.getpixel((0, 8)) == BLAU


def test_baender_finden_belegte_streifen():
    bild = Image.new("RGBA", (10, 20))
    bild.paste(ROT, (0, 2, 10, 5))
    bild.paste(ROT, (0, 10, 10, 20))
    assert _baender(bild) == [(2, 5), (10, 20)]


def _speichere(tmp_path, name: str, bild: Image.Image):
    pfad = tmp_path / name
    bild.save(pfad)
    return pfad


def test_gesicht_bedeckt_erkennt_masken(tmp_path):
    from pipeline.abenteuer.belebungsbilder import _gesicht_bedeckt

    bogen = Image.new("RGBA", (96, 32))
    assert not _gesicht_bedeckt(_speichere(tmp_path, "frei.png", bogen))
    bogen.putpixel((48 + 7, 17), ROT)
    assert _gesicht_bedeckt(_speichere(tmp_path, "maske.png", bogen))


def test_haarfarbe_trennt_grau_natuerlich_bunt(tmp_path):
    from pipeline.abenteuer.belebungsbilder import _haarfarbe

    assert (
        _haarfarbe(_speichere(tmp_path, "grau.png", Image.new("RGBA", (4, 4), (200, 200, 205, 255))))
        == "grau"
    )
    assert (
        _haarfarbe(_speichere(tmp_path, "braun.png", Image.new("RGBA", (4, 4), (120, 80, 40, 255))))
        == "natürlich"
    )
    assert (
        _haarfarbe(_speichere(tmp_path, "rosa.png", Image.new("RGBA", (4, 4), (240, 150, 200, 255))))
        == "bunt"
    )
    assert (
        _haarfarbe(_speichere(tmp_path, "blau.png", Image.new("RGBA", (4, 4), (60, 80, 200, 255)))) == "bunt"
    )


def test_ansichten_ergeben_vier_richtungen_mit_gespiegelter_seite():
    """Reh aus Gemini (Runde 9): Seite nach rechts, links gespiegelt, oben = hinten, unten = vorn."""
    from pipeline.abenteuer.belebungsbilder import ansichtenstreifen

    farben = {"seite": (200, 0, 0, 255), "hinten": (0, 200, 0, 255), "vorn": (0, 0, 200, 255)}

    def lade(name: str):
        ansicht = name.split("_")[1].split(".")[0]
        bild = Image.new("RGBA", (4, 4), farben[ansicht])
        bild.putpixel((0, 0), (9, 9, 9, 255))  # Merkmal oben links, zeigt die Spiegelung
        return bild

    streifen = ansichtenstreifen(lade, "reh_{}.png", 4, 4)
    assert streifen.size == (16, 4)
    assert streifen.getpixel((1, 1))[:3] == (200, 0, 0)
    assert streifen.getpixel((5, 1))[:3] == (0, 200, 0)
    assert streifen.getpixel((11, 0))[:3] == (9, 9, 9)  # gespiegelte Seite: Merkmal rechts
    assert streifen.getpixel((13, 1))[:3] == (0, 0, 200)
    bogen = tierbogen(streifen, 4, 4, "ansichten")
    assert bogen.size == (RAHMEN_JE_REIHE * 4, 8)
