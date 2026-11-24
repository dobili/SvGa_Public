"""Tests der weichen Ränder (pipeline/abenteuer/weichrand.py, randmaler.py); brauchen Pillow.

Anlass: Kartenblick 24.11.2026, M03 und M04. Geprüft wird an kleinen gemalten Karten ohne das
private Paket: einfarbige Kacheln für Gras, Sand, Holz und Wasser.
"""

import pytest

pytest.importorskip("PIL.Image")  # in Actions fehlt Pillow

from PIL import Image  # noqa: E402

from pipeline.abenteuer.randmaler import ERDE, ERDE_DUNKEL, ERDE_HELL, K, maske  # noqa: E402
from pipeline.abenteuer.weichrand import weiche_raender  # noqa: E402

FARBEN = {
    "gras": (71, 151, 87, 255),
    "sand": (230, 180, 90, 255),
    "holzDunkel": (120, 80, 50, 255),
    "wasser": (60, 163, 178, 255),
    "erde": (170, 143, 90, 255),
}
BOEDEN = {"erde": {"rand": [0, 0], "feld": [1, 1]}, "gras": {}, "sand": {}, "holzDunkel": {}, "wasser": {}}
ERDKANTE = {ERDE, ERDE_HELL, ERDE_DUNKEL}


def _kachel(art: str) -> Image.Image:
    return Image.new("RGBA", (K, K), FARBEN[art])


def _karte(szene: dict) -> tuple[Image.Image, dict]:
    """Malt das Raster mit einfarbigen Kacheln und liefert Bild und ``gezeichnet``."""
    arten = {".": "gras", "~": "wasser", **szene.get("boeden", {})}
    zeilen = szene["raster"]
    bild = Image.new("RGBA", (len(zeilen[0]) * K, len(zeilen) * K))
    gezeichnet = {}
    for y, zeile in enumerate(zeilen):
        for x, zeichen in enumerate(zeile):
            bild.paste(_kachel(arten[zeichen]), (x * K, y * K))
            gezeichnet[(x, y)] = (arten[zeichen], [1, 1])
    return bild, gezeichnet


def _farben(bild: Image.Image, feld: tuple[int, int]) -> set:
    return set(
        bild.crop((feld[0] * K, feld[1] * K, (feld[0] + 1) * K, (feld[1] + 1) * K)).get_flattened_data()
    )


def test_maske_fuellt_genau_die_kacheln():
    bild = maske((3 * K, 3 * K), [[(K, K), (2 * K, K), (2 * K, 2 * K), (K, 2 * K)]], [float(K * K)])
    assert bild.getbbox() == (K, K, 2 * K, 2 * K) and bild.histogram()[255] == K * K


def test_treppe_im_ufer_wird_schraeg():
    szene = {
        "art": "aussen",
        "raster": ["........", "~.......", "~~~.....", "~~~~~...", "~~~~~~~.", "~~~~~~~~"],
    }
    bild, gezeichnet = _karte(szene)
    assert weiche_raender(bild, szene, gezeichnet, BOEDEN, _kachel) > 0
    # Die Ecke der Stufe (Feld (2, 2) oben rechts) ist jetzt Land, die Kehle davor (3, 2) Wasser.
    assert bild.getpixel((3 * K - 1, 2 * K)) == FARBEN["gras"]
    assert bild.getpixel((3 * K + 2, 3 * K - 2)) != FARBEN["gras"]
    # Am Nordufer liegt die Erdkante.
    assert _farben(bild, (4, 3)) & ERDKANTE


def test_sand_reicht_ans_wasser_und_der_steg_hat_keinen_rand():
    szene = {
        "art": "aussen",
        "boeden": {"s": "sand", "h": "holzDunkel"},
        "raster": ["ssssss", "ssssss", "~~~~~~", "~~h~~~", "~~h~~~", "~~~~~~"],
    }
    bild, gezeichnet = _karte(szene)
    weiche_raender(bild, szene, gezeichnet, BOEDEN, _kachel)
    oben = _farben(bild, (0, 2)) | _farben(bild, (4, 2))
    assert not oben & ERDKANTE and FARBEN["gras"] not in oben  # kein Grasufer am Sand
    # Neben und vor dem Steg bleibt das Wasser, wie es war: kein Rand, keine grüne Kappe.
    for feld in ((1, 3), (3, 4), (2, 5)):
        assert _farben(bild, feld) == {FARBEN["wasser"]}
    assert _farben(bild, (2, 3)) == {FARBEN["holzDunkel"]}


def test_weg_am_ziel_bleibt_gerade():
    szene = {
        "art": "aussen",
        "boeden": {"e": "erde"},
        "raster": ["....", ".ee.", ".ee.", ".ee.", "eeee", "eeee"],
    }
    rund, gezeichnet = _karte(szene)
    weiche_raender(rund, szene, gezeichnet, BOEDEN, _kachel)
    gerade, gezeichnet = _karte(szene)
    stirn = {((1, 1), (0, -1)), ((2, 1), (0, -1))}
    weiche_raender(gerade, szene, gezeichnet, BOEDEN, _kachel, stirn)
    # Ohne Ziel rundet sich die Ecke des Wegendes ab, mit Ziel bleibt sie Erde.
    assert rund.getpixel((K, K)) != FARBEN["erde"]
    assert (
        gerade.getpixel((K + 3, K + 2)) == FARBEN["erde"]
        and gerade.getpixel((3 * K - 4, K + 2)) == FARBEN["erde"]
    )


def test_innenkarten_bleiben_unveraendert():
    szene = {"art": "innen", "raster": ["~~", ".."]}
    bild, gezeichnet = _karte(szene)
    vorher = bild.copy()
    assert weiche_raender(bild, szene, gezeichnet, BOEDEN, _kachel) == 0
    assert list(bild.get_flattened_data()) == list(vorher.get_flattened_data())
