"""Tests für ``pipeline/abenteuer/winter.py`` und die Winterbefunde in ``kartenbild``.

Warum: Entscheidung Winter (10.11.2026). Dieselben Farben prüft app/src/abenteuer/oberwelt/winter.test.ts.
"""

import pytest

pytest.importorskip("PIL.Image")

from PIL import Image  # noqa: E402

from pipeline.abenteuer.winter import (  # noqa: E402
    winterbefunde,  # noqa: E402
    winterfarbe,
    winterlich,
)


def test_farben():
    assert winterfarbe(106, 170, 72) == (222, 221, 219)
    assert winterfarbe(150, 110, 70) == (130, 110, 90)
    assert winterfarbe(60, 120, 200) == (42, 96, 180)
    assert winterfarbe(60, 120, 200, wasser=False) == (60, 120, 200)
    assert winterfarbe(200, 40, 40) == (200, 40, 40)


def test_bild_behaelt_transparenz():
    bild = Image.new("RGBA", (2, 1))
    bild.putdata([(106, 170, 72, 128), (200, 40, 40, 255)])
    assert list(winterlich(bild).getdata()) == [(222, 221, 219, 128), (200, 40, 40, 255)]


def test_blumen_und_pilze_in_winterszenen():
    szene = {"objekte": [{"moebel": "wg4BlumeBlau"}, {"moebel": "n6Pilzkiosk"}, {"moebel": "wg4Pilze"}]}
    assert winterbefunde(szene) == []
    befunde = winterbefunde({**szene, "jahreszeit": "winter"})
    assert [b.split(":")[0] for b in befunde] == ["wg4BlumeBlau", "wg4Pilze"]


def test_baeume_bekommen_schneekappen_statt_schneebaellen():
    """Regel 10.67: dunkler Rand und 10 hellgrüne Pixel (Strecke 11, Kappe 4): Rand bleibt, 3 Schnee,
    7 Wintergrün."""
    from pipeline.abenteuer.winter import schneekappen, winterlaub

    rand, hell = (20, 50, 25, 255), (90, 170, 70, 255)
    aus = schneekappen(1, 11, [rand] + [hell] * 10)
    assert aus[0] == rand
    schnee = (*winterfarbe(*hell[:3]), 255)
    gruen = (*winterlaub(*hell[:3]), 255)
    assert aus[1:] == [schnee] * 3 + [gruen] * 7
    assert schneekappen(1, 10, [hell] * 10) == [schnee] * 4 + [gruen] * 6


# Winter ohne Schnee, kahle Bäume, Dachschnee (RO53.5, 24.11.2026). Die Prüfsummen stehen gleich in
# app/src/abenteuer/oberwelt/kahlbaum.test.ts: App und Pipeline färben Pixel für Pixel gleich.
def _probebaum(farbe=(70, 150, 60)):
    """Runde Krone (Radius 10) über einem braunen Stamm, darunter ein halbdurchsichtiger Schatten."""
    breite, hoehe, pixel = 24, 32, []
    for y in range(hoehe):
        for x in range(breite):
            if (x - 12) ** 2 + (y - 11) ** 2 <= 100:
                pixel.append((*farbe, 255) if (x + y) % 5 else (30, 60, 40, 255))
            elif 10 <= x <= 13 and y < 30:
                pixel.append((110, 75, 45, 255))
            elif y >= 29 and 6 <= x <= 18:
                pixel.append((60, 110, 60, 160))
            else:
                pixel.append((0, 0, 0, 0))
    return breite, hoehe, pixel


def _pruefsumme(pixel):
    summe = sum((i + 1) * (r * 3 + g * 5 + b * 7 + a * 11) for i, (r, g, b, a) in enumerate(pixel))
    return summe % 1_000_000_007


def test_fahles_gras_im_winter_ohne_schnee():
    from pipeline.abenteuer.winter import fahlfarbe

    assert fahlfarbe(106, 170, 72) == (124, 135, 80)
    assert fahlfarbe(150, 110, 70) == (150, 110, 70)  # Erde bleibt


def test_kahler_baum_wie_in_der_app():
    from pipeline.abenteuer.kahlbaum import kahl

    breite, hoehe, pixel = _probebaum()
    neu = kahl(breite, hoehe, pixel)
    assert _pruefsumme(neu) == 225325905
    assert sum(1 for p in neu if p[3] == 255) < sum(1 for p in pixel if p[3] == 255) / 3  # Krone weg
    assert neu[31 * breite + 11] == pixel[31 * breite + 11]  # der Stammfuß bleibt
    assert _pruefsumme(kahl(*_probebaum((200, 90, 40)))) == 227397915  # Herbstbaum


def test_dachschnee_wie_in_der_app():
    from pipeline.abenteuer.winter import dachschnee

    breite, hoehe, pixel = _probebaum((180, 60, 50))
    assert _pruefsumme(dachschnee(breite, hoehe, pixel)) == 608170085


def test_sorte_und_jahreszeit():
    from pipeline.abenteuer.winter import jahreszeit, sorte

    assert sorte("pw7Tanne", "baum") == "nadelbaum"
    assert sorte("wg4Laubbaum", "baum") == "laubbaum"
    assert sorte("cc4Hecke", None) == "busch"
    assert sorte("ws5Schilf", "pflanze") == "pflanze"
    assert sorte("sa8Baeckerei", "gebaeude") == "haus"
    assert jahreszeit({"jahreszeit": "winter_mild"}) == "winter_mild"
    assert jahreszeit({"jahreszeit": "sommer"}) is None
    befunde = winterbefunde({"jahreszeit": "winter_mild", "objekte": [{"moebel": "wg4BlumeBlau"}]})
    assert len(befunde) == 1
