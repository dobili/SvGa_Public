"""Tests für Brett und Figuren aus einer Gemini-Lieferung (pipeline/abenteuer/brettbilder.py).

Mit gezeichneten Bildern: ein Brett mit Rahmen und Versatz, ein Figurenblatt auf grünem Grund mit
weichen Kanten und einer abgesetzten Krone. Pillow und numpy fehlen in Actions, dann wird
übersprungen.
"""

import re
from pathlib import Path

import pytest

pytest.importorskip("numpy")
Image = pytest.importorskip("PIL.Image")
ImageDraw = pytest.importorskip("PIL.ImageDraw")
ImageFilter = pytest.importorskip("PIL.ImageFilter")

import numpy as np  # noqa: E402

from pipeline.abenteuer.brettbild import BRETTGROESSE, schneide_brett  # noqa: E402
from pipeline.abenteuer.brettbilder import BRETTSTILE, FIGURNAMEN, baue, main  # noqa: E402
from pipeline.abenteuer.figurenblatt import FIGURGROESSE, RAND_UNTEN, schneide_figuren  # noqa: E402

WURZEL = Path(__file__).resolve().parents[2]
HELL, DUNKEL, RAHMEN = (225, 200, 160), (120, 80, 50), (40, 25, 15)
GRUEN = (0, 255, 0)
UMRISS = (25, 20, 15)
# Höhe der Figuren im Testblatt: König bis Bauer, wie ein echter Satz von groß nach klein.
HOEHEN = (200, 185, 150, 165, 155, 120)


def zeichne_brett(feld=60, rand=(37, 52), groesse=(570, 590), a8_hell=True, rahmen=RAHMEN):
    """Ein Brett mit Rahmen; das Bild ist etwas größer als Brett plus Rand (Versatz)."""
    bild = Image.new("RGB", groesse, rahmen)
    zeichnen = ImageDraw.Draw(bild)
    for zeile in range(8):
        for spalte in range(8):
            hell = ((zeile + spalte) % 2 == 0) == a8_hell
            x, y = rand[0] + spalte * feld, rand[1] + zeile * feld
            zeichnen.rectangle((x, y, x + feld - 1, y + feld - 1), fill=HELL if hell else DUNKEL)
    return bild


def zeichne_blatt(oben=(240, 240, 235), unten=(30, 30, 35), lassen=None):
    """Zwei Reihen à sechs Figuren auf Grün; der König hat eine abgesetzte Krone.

    Die obere Reihe hat einen dunklen Umriss wie echte weiße Figuren.
    """
    bild = Image.new("RGB", (1500, 640), GRUEN)
    zeichnen = ImageDraw.Draw(bild)
    for reihe, farbe in enumerate((oben, unten)):
        grund = 290 + reihe * 320
        for i, hoehe in enumerate(HOEHEN):
            if lassen == (reihe, i):
                continue
            mitte = 125 + i * 250
            umriss = UMRISS if reihe == 0 else None
            koerper = (mitte - 45, grund - hoehe + 30, mitte + 45, grund)
            zeichnen.rectangle(koerper, fill=farbe, outline=umriss, width=6)
            kopf = (mitte - 40, grund - hoehe, mitte + 40, grund - hoehe + 50)
            zeichnen.ellipse(kopf, fill=farbe, outline=umriss, width=6)
            if i == 0:
                zeichnen.rectangle((mitte - 6, grund - hoehe - 30, mitte + 6, grund - hoehe - 8), fill=farbe)
    return bild.filter(ImageFilter.GaussianBlur(1.2))


def test_brett_wird_ohne_rahmen_gerade_geschnitten():
    schnitt = schneide_brett(zeichne_brett())
    assert schnitt.bild.size == (BRETTGROESSE, BRETTGROESSE)
    assert schnitt.warnungen == []
    feld = np.asarray(schnitt.bild, dtype=float)
    # Ecken liegen im Feld, nicht im Rahmen: a8 hell, h8 dunkel.
    assert np.abs(feld[3, 3] - HELL).max() < 12
    assert np.abs(feld[3, BRETTGROESSE - 4] - DUNKEL).max() < 12
    assert np.abs(np.array(schnitt.hell) - HELL).max() < 6
    assert np.abs(np.array(schnitt.dunkel) - DUNKEL).max() < 6


def test_rahmen_in_feldfarbe_verschiebt_das_raster_nicht():
    schnitt = schneide_brett(zeichne_brett(rahmen=HELL, rand=(50, 40)))
    feld = np.asarray(schnitt.bild, dtype=float)
    assert np.abs(feld[3, BRETTGROESSE - 4] - DUNKEL).max() < 12
    assert np.abs(feld[BRETTGROESSE - 4, 3] - DUNKEL).max() < 12


def test_dunkles_a8_wird_gedreht():
    schnitt = schneide_brett(zeichne_brett(a8_hell=False))
    assert any("gedreht" in h for h in schnitt.hinweise)
    assert np.abs(np.asarray(schnitt.bild, dtype=float)[3, 3] - HELL).max() < 12


def test_ein_bild_ohne_schachmuster_warnt():
    schnitt = schneide_brett(Image.new("RGB", (512, 512), HELL))
    assert any("Schachmuster" in w for w in schnitt.warnungen)


def test_figurenblatt_ergibt_zwoelf_freie_figuren_auf_einer_grundlinie():
    schnitt = schneide_figuren(zeichne_blatt())
    assert sorted(schnitt.figuren) == sorted(FIGURNAMEN)
    hoehen = {}
    for name, bild in schnitt.figuren.items():
        assert bild.size == (FIGURGROESSE, FIGURGROESSE)
        feld = np.asarray(bild, dtype=float)
        deckend = feld[..., 3] > 128
        zeilen = np.nonzero(deckend.any(axis=1))[0]
        assert zeilen.max() == FIGURGROESSE - RAND_UNTEN - 1, name
        hoehen[name] = zeilen.max() - zeilen.min()
        # Kein grüner Saum: an keiner sichtbaren Stelle Grün deutlich über Rot und Blau.
        sichtbar = feld[..., 3] > 30
        ueberschuss = feld[..., 1] - np.maximum(feld[..., 0], feld[..., 2])
        assert (ueberschuss[sichtbar] < 30).all(), name
    # Gemeinsamer Maßstab: Der König (mit Krone) bleibt größer als der Bauer.
    assert hoehen["wK"] > hoehen["wP"] * 1.5
    assert abs(hoehen["wK"] - hoehen["bK"]) <= 2


def test_vertauschte_reihen_werden_getauscht():
    schnitt = schneide_figuren(zeichne_blatt(oben=(30, 30, 35), unten=(240, 240, 235)))
    assert any("getauscht" in h for h in schnitt.hinweise)
    assert np.asarray(schnitt.figuren["wK"])[100, 64, 0] > 200


def test_fehlende_figur_bricht_ab():
    with pytest.raises(ValueError, match="bB"):
        schneide_figuren(zeichne_blatt(lassen=(1, 3)))


def test_baue_legt_alles_ab_und_prueft_den_kontrast(tmp_path):
    (tmp_path / "privat" / "spiel").mkdir(parents=True)
    zeichne_brett().save(tmp_path / "brett.png")
    zeichne_blatt(unten=(70, 45, 30)).save(tmp_path / "blatt.png")
    hinweise, warnungen, ziel = baue(
        tmp_path / "brett.png", tmp_path / "blatt.png", "schiefer", tmp_path / "privat"
    )
    assert ziel == tmp_path / "privat" / "spiel" / "brett" / "schiefer"
    dateien = sorted(p.name for p in ziel.iterdir())
    assert dateien == sorted(["brett.webp", "brett.json"] + [f"{n}.webp" for n in FIGURNAMEN])
    # Dunkelbraune Figuren auf dunkelbraunen Feldern: Warnung für alle sechs schwarzen.
    assert sum("Kontrast schwach" in w for w in warnungen) == 6
    assert all(n[0] == "w" for n in (h.split()[0] for h in hinweise if "gegen" in h))


def test_aufruf_mit_nur_neuem_brett_und_vorschau(tmp_path):
    privat = tmp_path / "privat"
    (privat / "spiel").mkdir(parents=True)
    zeichne_brett().save(tmp_path / "brett.png")
    zeichne_blatt().save(tmp_path / "blatt.png")
    stil = ["--stil", "ahorn"]
    assert main([str(tmp_path / "brett.png"), str(tmp_path / "blatt.png"), *stil, str(privat)]) == 0
    vorschau = tmp_path / "vorschau.png"
    assert main([str(tmp_path / "brett.png"), "-", *stil, str(privat), "--vorschau", str(vorschau)]) == 0
    assert Image.open(vorschau).size == (BRETTGROESSE, BRETTGROESSE)


def test_falscher_ordner_und_stil_werden_abgelehnt(tmp_path):
    with pytest.raises(ValueError, match="spiel"):
        baue(None, None, "schiefer", tmp_path)
    with pytest.raises(ValueError, match="Brettstil"):
        baue(None, None, "marmor", tmp_path)


def test_stilkennungen_wie_in_der_app():
    text = (WURZEL / "app/src/abenteuer/brett/brettstile.ts").read_text()
    liste = text.split("export const BRETTSTILE = [", 1)[1].split("]", 1)[0]
    assert tuple(re.findall(r'"([a-z]+)"', liste)) == BRETTSTILE
