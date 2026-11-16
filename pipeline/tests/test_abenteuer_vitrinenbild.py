"""Tests für pipeline/abenteuer/vitrinenbild.py: Stück ohne Glas und Samt ins Gehäuse mit Deckel.

Mit selbst gebauten Bildern, ohne das private Repository.
"""

import pytest

Image = pytest.importorskip("PIL.Image")

from pipeline.abenteuer import vitrinenbild as v  # noqa: E402

GLAS, SAMT = (180, 200, 230, 255), (150, 30, 30, 255)
ROT_STUECK, SCHWARZ = (200, 20, 20, 255), (20, 20, 20, 255)


def alte_vitrine() -> "Image.Image":
    """32 × 48 wie die eigenen Vitrinen: Glas oben, Samt unten, ein schwarz-rotes Stück in der Mitte."""
    bild = Image.new("RGBA", (32, 48), (0, 0, 0, 0))
    for y in range(7, 20):
        for x in range(3, 29):
            bild.putpixel((x, y), GLAS)
    for y in range(20, 30):
        for x in range(3, 29):
            bild.putpixel((x, y), SAMT)
    for y in range(14, 22):
        for x in range(12, 20):
            bild.putpixel((x, y), SCHWARZ if y < 20 else ROT_STUECK)
    return bild


def test_stueck_ohne_glas_und_samt_behaelt_rote_teile():
    teil = v.stueck(alte_vitrine())
    assert teil is not None
    assert teil.size == (8, 8)
    farben = {p[:3] for p in teil.getdata() if p[3]}
    assert SCHWARZ[:3] in farben and ROT_STUECK[:3] in farben
    assert GLAS[:3] not in farben and SAMT[:3] not in farben


def test_vitrine_setzt_stueck_unter_den_deckel():
    gehaeuse = Image.new("RGBA", (32, 48), (210, 190, 150, 255))
    neu = v.vitrine(alte_vitrine(), gehaeuse)
    assert neu.size == (32, 48)
    links, oben, rechts, unten = v.DECKEL
    mitte = neu.getpixel(((links + rechts) // 2, (oben + unten) // 2))
    # Unter dem hellen Schleier bleibt das dunkle Stück deutlich dunkler als der Deckel.
    assert sum(mitte[:3]) < sum(gehaeuse.getpixel((links, oben))[:3]) - 150


def test_leere_vitrine_ergibt_nur_gehaeuse():
    leer = Image.new("RGBA", (32, 48), (0, 0, 0, 0))
    assert v.stueck(leer) is None
