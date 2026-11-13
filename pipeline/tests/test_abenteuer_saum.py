"""Tests der Bodensäume (pipeline/abenteuer/saum.py): Randstein, Bankett, weicher Rand, Prüfung."""

import pytest

pytest.importorskip("PIL.Image")  # Pillow fehlt in Actions

from PIL import Image  # noqa: E402

from pipeline.abenteuer.saum import STEIN_DUNKEL, K, saeume, saumart, saumbefunde  # noqa: E402

BOEDEN = {
    "gras": {},
    "pflaster": {"saum": "randstein"},
    "asphalt": {"saum": "bankett"},
    "schotter": {"saum": "weich"},
    "erde": {"rand": [0, 30]},
    "beton": {},
}
GRUEN, GRAU = (60, 140, 70, 255), (120, 120, 120, 255)


def _bild(felder: dict) -> Image.Image:
    """Zwei Felder nebeneinander: links (0, 0), rechts (1, 0); Gras grün, alles andere grau."""
    bild = Image.new("RGBA", (2 * K, K), GRUEN)
    for (x, y), (art, _) in felder.items():
        if art != "gras":
            bild.paste(GRAU, (x * K, y * K, (x + 1) * K, (y + 1) * K))
    return bild


def test_saumart_nur_gegen_naturboden():
    """Regel: KARTENREGELN 10.72 (Rückmeldung R042): Saum nur an der Kante zu Naturboden."""
    assert saumart(BOEDEN, "pflaster", "gras") == "randstein"
    assert saumart(BOEDEN, "pflaster", "erde") == "randstein"
    assert saumart(BOEDEN, "pflaster", "asphalt") is None
    assert saumart(BOEDEN, "schotter", "gras") == "weich"
    assert saumart(BOEDEN, "schotter", "erde") is None
    assert saumart(BOEDEN, "pflaster", None) is None
    assert saumart(BOEDEN, "gras", "pflaster") is None


def test_randstein_liegt_im_pflaster_an_der_graskante():
    felder = {(0, 0): ("gras", None), (1, 0): ("pflaster", None)}
    bild = _bild(felder)
    assert saeume(bild, felder, BOEDEN) == 1
    assert bild.getpixel((K, 5)) == STEIN_DUNKEL  # Fuge außen, im Pflasterfeld
    assert bild.getpixel((K - 1, 5)) == GRUEN  # Gras unberührt
    assert bild.getpixel((2 * K - 1, 5)) == GRAU  # andere Seite ohne Saum


def test_bankett_dunkelt_den_asphaltrand_ab():
    felder = {(0, 0): ("gras", None), (1, 0): ("asphalt", None)}
    bild = _bild(felder)
    saeume(bild, felder, BOEDEN)
    zweite = {bild.getpixel((K + 1, y)) for y in range(K)}
    assert zweite == {(96, 96, 96, 255)}  # zweite Pixelspalte: abgedunkelt
    assert {bild.getpixel((K, y)) for y in range(K)} == {GRUEN, (96, 96, 96, 255)}  # außen ausgefranst


def test_weicher_rand_laesst_gras_hereingreifen():
    felder = {(0, 0): ("gras", None), (1, 0): ("schotter", None)}
    bild = _bild(felder)
    saeume(bild, felder, BOEDEN)
    rand = [bild.getpixel((K, y)) for y in range(K)]
    assert GRUEN in rand and GRAU in rand  # unregelmäßig, nicht ganz grün und nicht ganz grau
    assert bild.getpixel((K + 4, 5)) == GRAU  # tiefer als drei Pixel bleibt Schotter


def test_ausgelassene_felder_bleiben():
    felder = {(0, 0): ("gras", None), (1, 0): ("pflaster", None)}
    bild = _bild(felder)
    assert saeume(bild, felder, BOEDEN, frozenset({(1, 0)})) == 0
    assert bild.getpixel((K, 5)) == GRAU


def test_befund_nur_fuer_boden_ohne_rand_und_saum():
    szene = {"art": "aussen", "boden": "gras", "boeden": {"b": "beton", "p": "pflaster", "e": "erde"}}
    befunde = saumbefunde(szene, ["..bb..", "..pp..", "..ee.."], BOEDEN)
    assert len(befunde) == 1 and "beton" in befunde[0]
    assert saumbefunde({**szene, "art": "innen"}, ["..bb.."], BOEDEN) == []
