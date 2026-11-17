"""Tests für pipeline/abenteuer/seitentreppe.py: seitliche Holztreppe in der Kartenperspektive.

Geometrie und Masken ohne Bilder; das Zeichnen mit den Ersatzfarben, ohne das private Repository.
"""

import pytest

from pipeline.abenteuer import seitentreppe as s


def test_stufen_steigen_vom_antritt_zum_absatz():
    assert s.stufe_bei(0) == 0 and s.stufe_bei(s.LAUF_VON) == 0
    assert s.stufe_bei(s.LAUF_BIS - 1) == s.STUFEN - 1
    assert s.stufe_bei(s.BREITE - 1) == s.STUFEN
    stufen = [s.stufe_bei(x) for x in range(s.BREITE)]
    assert stufen == sorted(stufen)
    # Jede Stufe liegt HUB Pixel höher: Die Unterkante des Tritts springt je Stufe um HUB.
    assert s.trittboden(s.LAUF_VON) - s.trittboden(s.BREITE - 1) == s.STUFEN * s.HUB


def test_handlauf_steigt_stufenlos_und_bleibt_im_bild():
    oben = [s.handlauf_oben(x) for x in range(s.BREITE)]
    assert oben[0] == s.STUFEN * s.HUB and oben[-1] == 0
    assert all(b - a in (-1, 0) for a, b in zip(oben, oben[1:], strict=False))
    assert max(s.trittboden(x) for x in range(s.BREITE)) < s.HOEHE


def test_vorderkante_hell_fuge_dunkel_wie_die_vorlage():
    breite = (s.LAUF_BIS - s.LAUF_VON) / s.STUFEN
    x = s.LAUF_VON + round(breite)  # erste Spalte der zweiten Stufe
    assert s.trittrolle(x) == "glanz"
    assert s.trittrolle(x - 1) == "dunkel"


def test_nach_links_ist_das_spiegelbild_der_geometrie():
    rechts, links = s.raster(True), s.raster(False)
    for y in range(s.HOEHE):
        assert [a for _, a in rechts[y]] == [a for _, a in reversed(links[y])]


def test_masken_lassen_den_lauf_frei_und_sperren_die_wange():
    for rechts in (True, False):
        maske = s.feinmaske(rechts)
        assert len(maske) == s.HOEHE // s.FEIN
        assert all(len(z) == s.BREITE // s.FEIN for z in maske)
        assert maske[-1] == "#" * (s.BREITE // s.FEIN)  # Wange und Grundlinie
        # Mitte des Laufs zwischen den Handläufen frei (Antrittsseite, halbe Höhe des Tritts).
        x = 1 if rechts else s.BREITE // s.FEIN - 2
        assert maske[(s.STUFEN * s.HUB + s.HOLM + s.TRITT // 2 - 4) // s.FEIN][x] == "."
    assert s.feinmaske(False) == [z[::-1] for z in s.feinmaske(True)]


def test_zeichnen_mit_ersatzfarben():
    pytest.importorskip("PIL")
    bild = s.zeichne(s.farben(None), True)
    assert bild.size == (s.BREITE, s.HOEHE) and bild.mode == "RGBA"
    assert bild.getpixel((0, 0))[3] == 0  # durchsichtiger Grund über dem Antritt
    assert bild.getpixel((s.LAUF_VON, s.HOEHE - 1)) == s.FARBEN["dunkel"]
    bogen = s.kontaktbogen([bild, s.zeichne(s.FARBEN, False)], massstab=2)
    assert bogen.width > 2 * s.BREITE * 2
