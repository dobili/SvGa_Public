"""Tests für pipeline/abenteuer/schraegzaun.py: schräge Geländerstücke für den achteckigen Pavillon.

Geometrie und Masken ohne Bilder; das Zeichnen mit selbst gebauten Stücken, ohne das private
Repository.
"""

import pytest

from pipeline.abenteuer import schraegzaun as s

K = s.K


def test_band_oben_schliesst_an_den_geraden_holm_und_die_seite_an():
    # Rechter Rand: Holmkante in Reihe 0 wie das gerade Stück „gerade_oben“ daneben.
    assert s.bandreihe(False, K * s.ZELLEN - 1, 0) == 0
    # Linker Rand: Holmkante eine Kachel über der Unterkante, darunter der Eckpfosten.
    assert s.bandreihe(False, 0, K * s.ZELLEN - 1) == 0
    assert s.bandreihe(False, 40, 38) is None and s.ist_aussen(False, 40, 38)
    assert s.bandreihe(False, 40, 39 + K) is None and not s.ist_aussen(False, 40, 39 + K)


def test_band_unten_schliesst_an_den_geraden_holm_an():
    # Rechts unten liegt das Band in der letzten Kachelreihe, wie Bottom_Middle daneben.
    rechts = K * s.ZELLEN - 1
    assert s.bandreihe(True, rechts, K * s.ZELLEN) == 0
    assert s.bandreihe(True, rechts, K * s.ZELLEN + K - 1) == K - 1
    assert s.ist_aussen(True, 0, K + 1) and not s.ist_aussen(True, 0, 0)


def test_band_deckt_alle_stufen_des_rasters():
    """Kein Pixel einer Deckkachel liegt außen, kein Pixel einer Wiesenkachel innen."""
    for unten in (False, True):
        for i in range(s.ZELLEN):
            for j in range(s.ZELLEN + 1):
                deck = s.ist_deck(unten, i, j)
                for x in range(i * K, (i + 1) * K):
                    for y in range(j * K, (j + 1) * K):
                        band = s.bandreihe(unten, x, y) is not None
                        aussen = s.ist_aussen(unten, x, y)
                        if deck and i >= 1:
                            assert band or not aussen, (unten, i, j, x, y)
                        if not deck and i >= 1:
                            assert band or aussen, (unten, i, j, x, y)


def test_feinmaske_sperrt_nur_ueber_den_dielen_und_spiegelt_rechts():
    masken = s.masken()
    assert set(masken) == set(s.ECKEN)
    for ecke, maske in masken.items():
        assert len(maske) == (s.ZELLEN + 1) * s.ZELLE and {len(z) for z in maske} == {s.ZELLEN * s.ZELLE}
        unten, rechts = ecke.startswith("unten"), ecke.endswith("rechts")
        for zy, zeile in enumerate(maske):
            for zx, zeichen in enumerate(zeile[::-1] if rechts else zeile):
                if zeichen == "#":
                    assert s.ist_deck(unten, zx * s.ZELLE // K, zy * s.ZELLE // K)
    assert masken["oben_rechts"] == [z[::-1] for z in masken["oben_links"]]
    assert any("#" in z for z in masken["unten_links"])


Image = pytest.importorskip("PIL.Image")

HOLM, PFOSTEN, GRAS = (220, 210, 225, 255), (60, 60, 80, 255), (70, 150, 80, 255)


def teile() -> dict:
    """Stücke 16 × 16 wie Fence_2: Holm in Reihe 1, leere Reihen 0 und 15, Pfosten links."""
    gerade = Image.new("RGBA", (K, K), (0, 0, 0, 0))
    for y in range(1, K - 1):
        for x in range(K):
            gerade.putpixel((x, y), HOLM)
    ecke = Image.new("RGBA", (K, K), PFOSTEN)
    return {
        "Top_Middle": gerade,
        "Bottom_Middle": gerade,
        "Top_Left": ecke,
        "Bottom_Left": ecke,
        "Middle_Left": ecke,
    }


def test_schraege_zeichnet_wiese_band_und_pfosten():
    gras = Image.new("RGBA", (K, K), GRAS)
    bild = s.schraege(teile(), gras, unten=False)
    assert bild.size == (K * s.ZELLEN, K * (s.ZELLEN + 1))
    assert bild.getpixel((K * s.ZELLEN - 1, 0)) == HOLM  # Holm in der Reihe des geraden Stücks
    assert bild.getpixel((0, 0)) == GRAS  # außen Wiese
    assert bild.getpixel((K * s.ZELLEN - 1, K * s.ZELLEN))[3] == 0  # innen frei für die Dielen
    assert bild.getpixel((1, K * s.ZELLEN + 4)) == PFOSTEN  # Eckpfosten an der Seite


def test_geraden_und_durchgang_ohne_leere_aussenreihe():
    gras = Image.new("RGBA", (K, K), GRAS)
    durchgang = Image.new("RGBA", (3 * K, K), (0, 0, 0, 0))
    bilder = s.alle_bilder(teile(), gras, durchgang)
    assert set(bilder) == set(s.ECKEN) | {"gerade_oben", "gerade_unten", "durchgang"}
    oben = bilder["gerade_oben"]
    assert all(oben.getpixel((x, K - 1))[3] for x in range(K))  # bis an die Dielen
    assert bilder["gerade_unten"].getpixel((3, K - 1)) == GRAS
    assert bilder["durchgang"].getpixel((3, K - 1)) == GRAS
    assert bilder["durchgang"].getpixel((20, K - 1))[3] == 0  # die Lücke bleibt Weg
