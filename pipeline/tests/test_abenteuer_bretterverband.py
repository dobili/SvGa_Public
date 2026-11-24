"""Tests für ``pipeline/abenteuer/bretterverband.py``.

Warum: Holzböden zeigten jedes Feld als Kästchen (Kartenblick M01, 24.11.2026). Der Verband muss
die Fugen der Kachel entfernen, Stöße versetzen und bei jedem Lauf dasselbe Bild geben.
Ohne privates Paket: Die Dielenkachel ist nachgebaut (dunkle Fuge in Spalte 15, Reihenfuge unten).
"""

import pytest

pytest.importorskip("PIL.Image")

from PIL import Image  # noqa: E402

from pipeline.abenteuer.bretterverband import (  # noqa: E402
    STOSSABSTAND,
    K,
    gemessene_stoesse,
    gestapelt,
    stoesse,
    verlege,
)

HOLZ, FUGE = (170, 142, 115, 255), (145, 122, 98, 255)
QUER = {"richtung": "quer", "brett": 4, "kern": [3, 11], "laenge": [24, 56]}
LAENGS = {**QUER, "richtung": "laengs"}
BREIT, HOCH = 10, 6


def _dielen(laengs: bool = False) -> tuple[Image.Image, set]:
    """Ein Raum aus der nachgebauten Dielenkachel (wie LimeZu: Brettende in Spalte 15)."""
    kachel = Image.new("RGBA", (K, K), HOLZ)
    for i in range(K):
        kachel.putpixel((K - 1, i), FUGE)
        for reihe in range(3, K, 4):
            kachel.putpixel((i, reihe), FUGE)
    if laengs:
        kachel = kachel.transpose(Image.Transpose.TRANSPOSE)
    bild = Image.new("RGBA", (BREIT * K, HOCH * K))
    felder = {(x, y) for x in range(BREIT) for y in range(HOCH)}
    for x, y in felder:
        bild.paste(kachel, (x * K, y * K))
    return bild, felder


def test_unbearbeitete_dielen_sind_kariert():
    bild, felder = _dielen()
    gemessen = gemessene_stoesse(bild, felder, QUER)
    assert gemessen[0] == {x * K + K - 1 for x in range(BREIT - 1)}
    assert gestapelt(gemessen)


def test_verband_versetzt_die_stoesse():
    bild, felder = _dielen()
    neu = verlege(bild, felder, QUER, "a.b", "dielen")
    gemessen = gemessene_stoesse(neu, felder, QUER)
    assert sum(map(len, gemessen.values())) > HOCH * K // QUER["brett"]  # Stöße in jeder Reihe
    assert gestapelt(gemessen) == []
    assert gestapelt(gemessen, 2) == []  # auch nicht in zwei Reihen übereinander


def test_laengs_laufende_bretter():
    bild, felder = _dielen(laengs=True)
    assert gestapelt(gemessene_stoesse(bild, felder, LAENGS))
    neu = verlege(bild, felder, LAENGS, "a.b", "holzDunkel")
    assert neu.size == bild.size
    assert gestapelt(gemessene_stoesse(neu, felder, LAENGS)) == []


def test_gleiches_bild_bei_jedem_lauf_und_nur_auf_den_feldern():
    bild, felder = _dielen()
    halb = {f for f in felder if f[0] < BREIT // 2}
    eins, zwei = verlege(bild, halb, QUER, "a.b", "dielen"), verlege(bild, halb, QUER, "a.b", "dielen")
    assert eins.tobytes() == zwei.tobytes()
    assert eins.tobytes() != verlege(bild, halb, QUER, "c.d", "dielen").tobytes()
    rechts = (BREIT // 2 * K, 0, BREIT * K, HOCH * K)
    assert eins.crop(rechts).tobytes() == bild.crop(rechts).tobytes()


def test_stoesse_halten_abstand_zu_den_zwei_reihen_darueber():
    reihen = stoesse("a.b", "dielen", 40, 640, (24, 56))
    for i, reihe in enumerate(reihen):
        assert reihe == sorted(reihe) and reihe
        for vorige in reihen[max(0, i - 2) : i]:
            assert all(abs(x - v) >= STOSSABSTAND for x in reihe for v in vorige)


def test_gestapelt_beispiel_aus_dem_kopf():
    assert gestapelt({0: {15}, 1: {15}, 2: {15, 40}}) == [(0, 15)]
    assert gestapelt({0: {15}, 1: {31}, 2: {15}}) == []
