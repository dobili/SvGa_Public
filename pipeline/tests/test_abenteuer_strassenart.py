"""Tests der Straßenarten (pipeline/abenteuer/strassenart.py): Landstraße und Belagwechsel."""

import pytest

pytest.importorskip("PIL.Image")  # Pillow fehlt in Actions

from PIL import Image  # noqa: E402

from pipeline.abenteuer.strassenart import BRUCH_FARBE, K, belagwechsel, landstrassen  # noqa: E402

ASPHALT, ERDE = (80, 80, 90, 255), (170, 130, 80, 255)


def _bild(breite: int, hoehe: int, farbe=ASPHALT) -> Image.Image:
    return Image.new("RGBA", (breite * K, hoehe * K), farbe)


def test_landstrasse_bleicht_aus_und_hat_zwei_fahrspuren():
    """Regel: KARTENREGELN 10.73 (R037): Die Landstraße trägt Fahrspuren, daran erkennt man, dass
    hier der Bus fährt."""
    felder = {(x, y): ("landstrasse", None) for x in range(8) for y in range(3)}
    bild = _bild(8, 3)
    assert landstrassen(bild, felder) == 24
    spalte = [bild.getpixel((5 * K + 4, y))[0] for y in range(3 * K)]
    hell = max(spalte)
    assert hell > ASPHALT[0]  # ausgeblichen
    dunkel = [y for y, wert in enumerate(spalte) if wert < hell]
    # Zwei Spuren quer zur Fahrt, um 30 % und 70 % der Breite (48 Pixel): bei etwa 14 und 33.
    assert dunkel and min(dunkel) in range(11, 16) and max(dunkel) in range(32, 37)


def test_platz_ohne_fahrspuren_und_andere_boeden_unberuehrt():
    felder = {(x, y): ("landstrasse", None) for x in range(3) for y in range(3)}
    felder[(3, 0)] = ("asphalt", None)
    bild = _bild(4, 3)
    landstrassen(bild, felder)
    assert len({bild.getpixel((x, y)) for x in range(3 * K) for y in range(3 * K)}) == 1
    assert bild.getpixel((3 * K + 2, 2)) == ASPHALT


def test_belagwechsel_bricht_den_festeren_belag_aus():
    """Regel: KARTENREGELN 10.73 (R036): Der Übergang zwischen zwei Straßenarten ist sichtbar."""
    felder = {(0, 0): ("asphalt", None), (1, 0): ("erde", None)}
    bild = _bild(2, 1)
    bild.paste(ERDE, (K, 0, 2 * K, K))
    assert belagwechsel(bild, felder) == 1
    asphaltfeld = [bild.getpixel((x, y)) for x in range(K) for y in range(K)]
    assert ERDE in asphaltfeld and BRUCH_FARBE in asphaltfeld  # Erde greift herein, Bruchlinie davor
    assert all(bild.getpixel((x, y)) == ERDE for x in range(K, 2 * K) for y in range(K))
    assert bild.getpixel((2, 5)) == ASPHALT  # tiefer als die Bruchkante bleibt Asphalt


def test_gleicher_rang_ohne_bruch():
    felder = {(0, 0): ("erde", None), (1, 0): ("erdeRot", None), (0, 1): ("gras", None)}
    assert belagwechsel(_bild(2, 2), felder) == 0
