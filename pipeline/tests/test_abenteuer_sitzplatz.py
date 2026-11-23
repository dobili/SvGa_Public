"""Tests für pipeline/abenteuer/sitzplatz.py: Sitzende auf ihrem Sitzmöbel in der Vorschau.

Dieselben Fälle wie app/src/abenteuer/oberwelt/sitzplatz.test.ts (Spieltest Variante B,
16.11.2026, F2), damit Vorschau und Spiel gleich rechnen.
"""

import pytest

from pipeline.abenteuer.sitzplatz import (
    SITZ_TIEFENABSTAND,
    am_boden,
    finde_sitz,
    ist_sitzmoebel,
    sichtbarer_umriss,
    sitzlage,
    sitzlage_auf,
    sitzmoebel,
)

# Schulstuhl im Clubraum: Feld (5, 7), versatz [5, 5], 16 × 32, sichtbar 12 × 21, Tiefe 141.
SCHULSTUHL = {"x": 85, "y": 117, "breite": 16, "hoehe": 32, "tiefe": 141, "sichtbar": (88, 118, 12, 21)}


def test_sitzmoebel_nach_art_oder_name():
    assert ist_sitzmoebel("x", "stuhl")
    assert not ist_sitzmoebel("cc5Tisch", "tisch")
    assert ist_sitzmoebel("cc4StuhlVorn", None)
    assert not ist_sitzmoebel("rvBankgebaeude", "gebaeude")


def test_sam_sitzt_auf_dem_verschobenen_schulstuhl():
    assert sitzlage(SCHULSTUHL, (5, 8)) == (6, -5, 141 + SITZ_TIEFENABSTAND)


def test_calloway_rueckt_hoch_an_die_stuhlbeine():
    stuhl = {**SCHULSTUHL, "x": 64, "y": 480, "tiefe": 504, "sichtbar": (66, 481, 13, 21)}
    assert sitzlage(stuhl, (4, 31)) == (1, -10, 504 + SITZ_TIEFENABSTAND)


def test_ohne_umriss_das_ganze_rechteck_und_lange_bank_nur_feinschub():
    assert sitzlage({**SCHULSTUHL, "sichtbar": None}, (5, 8))[:2] == (5, 5)
    bank = {**SCHULSTUHL, "x": 16, "y": 144, "hoehe": 48, "sichtbar": None}
    assert sitzlage(bank, (1, 10))[:2] == (0, 0)
    zweier = {"x": 35, "y": 176, "breite": 32, "hoehe": 32, "tiefe": 200, "sichtbar": (35, 180, 32, 20)}
    assert sitzlage(zweier, (3, 12))[:2] == (3, -8)


def test_hoechstens_eine_kachel_und_kleinstes_moebel():
    weit = {**SCHULSTUHL, "sichtbar": (120, 60, 12, 21)}
    assert sitzlage(weit, (5, 8))[:2] == (16, -16)
    sofa = {**SCHULSTUHL, "x": 64, "y": 112, "breite": 48}
    assert finde_sitz([sofa, SCHULSTUHL], (5, 8)) is SCHULSTUHL
    assert sitzlage_auf([SCHULSTUHL], (6, 8)) is None


def test_sichtbarer_umriss_und_sitzmoebel_aus_bildern():
    image = pytest.importorskip("PIL.Image")
    bild = image.new("RGBA", (16, 32))
    for y in range(1, 22):
        for x in range(3, 15):
            bild.putpixel((x, y), (90, 60, 30, 255))
    bild.putpixel((0, 30), (0, 0, 0, 20))  # Schatten unter der Schwelle zählt nicht
    assert sichtbarer_umriss(bild) == (3, 1, 12, 21)
    gesetzt = [
        {"name": "mf8SchulstuhlRechts", "x": 85, "y": 117, "tiefe": 141},
        {"name": "t1", "x": 0, "y": 0},
    ]
    katalog = {"mf8SchulstuhlRechts": {"art": "stuhl"}, "t1": {"art": "tisch"}}
    assert sitzmoebel(gesetzt, katalog, [bild, bild]) == [{**SCHULSTUHL, "einzeln": True}]


def test_einzelsitz_breiter_als_eine_kachel():
    # Wards Ohrensessel (32 px breit): auf die sichtbare Mitte wie ein Stuhl, nicht der Feinschub
    # einer Bank (Verdeckungsfotos 23.11.2026; wie sitzplatz.ts).
    sessel = {"x": 160, "y": 80, "breite": 32, "hoehe": 32, "tiefe": 104, "sichtbar": (166, 82, 22, 28)}
    assert sitzlage({**sessel, "einzeln": True}, (10, 6))[0] == 9
    assert sitzlage(sessel, (10, 6))[0] == 0


def test_am_boden_ohne_hub():
    # Lily sitzt auf dem Bordstein (maple-falls-aussen.ink): kein Möbel, also kein Hub, kein Versatz.
    assert am_boden([], (14, 24)) and not am_boden([SCHULSTUHL], (5, 7))
    pytest.importorskip("PIL")
    from pipeline.abenteuer.belebungsvorschau import sitzend

    class Bild:
        width = 32

    assert sitzend(Bild, (400, 224, 368), (14, 24), "rechts", [])[1:3] == (224, 368)
