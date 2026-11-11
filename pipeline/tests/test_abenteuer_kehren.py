"""Tests der runden Kehren (pipeline/abenteuer/kehren.py): Finden, Prüfen, Zeichnen."""

import pytest

pytest.importorskip("PIL.Image")  # Pillow fehlt in Actions

from PIL import Image  # noqa: E402

from pipeline.abenteuer.kehren import K, Kehre, finde_kehren, kehrenbefunde, runde  # noqa: E402
from pipeline.abenteuer.strasse import GELB, WEISS, markiere  # noqa: E402

# Waagerechter Ast (Reihen 1–3) nach rechts, senkrechter Ast (Spalten 1–3) nach unten.
ECKE = [
    "..........",
    ".sssssssss",
    ".sssssssss",
    ".sssssssss",
    ".sss......",
    ".sss......",
    ".sss......",
]
ASPHALT, SAND = (80, 80, 90, 255), (200, 160, 110, 255)


def _bild(zeilen: list[str]) -> Image.Image:
    bild = Image.new("RGBA", (len(zeilen[0]) * K, len(zeilen) * K), SAND)
    for y, zeile in enumerate(zeilen):
        for x, feld in enumerate(zeile):
            if feld == "s":
                bild.paste(ASPHALT, (x * K, y * K, (x + 1) * K, (y + 1) * K))
    return bild


def test_findet_die_ecke_zweier_gleich_breiter_aeste():
    assert finde_kehren(ECKE, {"s"}) == [Kehre(4, 4, 1, 1, 3)]


def test_abgeschnittene_ecke_ist_dieselbe_kehre():
    """Bergstraße: Im Raster fehlt das Außenfeld, das Innenfeld ist gefüllt."""
    zeilen = list(ECKE)
    zeilen[1] = "..ssssssss"
    zeilen[4] = ".ssss....."
    assert finde_kehren(zeilen, {"s"}) == [Kehre(4, 4, 1, 1, 3)]


def test_einmuendung_ist_keine_kehre():
    zeilen = ["sssssssss.", "sssssssss.", "sssssssss.", "...sss....", "...sss....", "...sss...."]
    assert finde_kehren(zeilen, {"s"}) == []


def test_aussen_boden_innen_asphalt():
    bild = _bild(ECKE)
    runde(bild, ECKE, {"s"})
    assert bild.getpixel((K + 1, K + 1)) == SAND  # Außenecke abgerundet
    assert bild.getpixel((4 * K + 3, 4 * K + 3)) == ASPHALT  # Innenecke gefüllt
    assert bild.getpixel((4 * K + 12, 4 * K + 12)) == SAND  # am Mittelpunkt bleibt Boden
    assert bild.getpixel((2 * K + 8, 2 * K + 8)) == ASPHALT  # Fahrbahnmitte bleibt
    assert bild.getpixel((6 * K, 2 * K)) == ASPHALT  # gerader Ast unberührt


def test_linien_folgen_dem_bogen():
    """Regel: Gutachten Bergstraße (10.11.2026): Rand- und Mittellinie laufen im Bogen durch."""
    bild = _bild(ECKE)
    markiere(bild, ECKE, {"markierung": ["s"], "kehren": "rund"})
    mitte = 5 * K  # Mittelpunkt des Bogens (5, 5) in Feldern
    # Vom Mittelpunkt senkrecht nach oben: Randlinien bei 1 und 4 Feldern, Mittellinie bei 2,5.
    strahl = [bild.getpixel((mitte - 1, mitte - i)) for i in range(1, 4 * K)]
    assert strahl.count(GELB) == 2 and strahl.count(WEISS) == 2
    assert bild.getpixel((K + 8, K + 2)) == SAND  # keine gerade Randlinie mehr in der Außenecke


def test_befund_bei_ungleich_breiten_aesten():
    zeilen = ["..........", ".sssssssss", ".sssssssss", ".sssssssss", ".ss.......", ".ss......."]
    szene = {"markierung": ["s"], "kehren": "rund"}
    assert kehrenbefunde(szene, ECKE) == []
    assert kehrenbefunde(szene, zeilen) != []
    assert kehrenbefunde({"markierung": ["s"]}, zeilen) == []
