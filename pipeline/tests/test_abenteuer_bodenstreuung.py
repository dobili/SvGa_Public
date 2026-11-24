"""Tests für ``pipeline/abenteuer/bodenstreuung.py``.

Warum: Büschel und Steinchen standen im Gitter, Erde und Sand waren glatt (Kartenblick M01,
24.11.2026). Die Streuung muss die Teile der Kachel finden, frei verteilen, auf dem eigenen Boden
bleiben und bei jedem Lauf dasselbe Bild geben. Ohne privates Paket (nachgebaute Kacheln).
"""

import pytest

pytest.importorskip("PIL.Image")

from PIL import Image  # noqa: E402

from pipeline.abenteuer.bodenstreuung import (  # noqa: E402
    VOLL,
    K,
    bodenmaske,
    getoent,
    grundfarbe,
    kiesel,
    koernung,
    streue,
    streuteile,
    wolken,
    zufall,
)

GRAS, HALM, BLUETE, ERDE = (71, 151, 87, 255), (55, 133, 78, 255), (220, 80, 80, 255), (170, 143, 90, 255)
BREIT, HOCH = 8, 6


def _graskachel() -> Image.Image:
    """Gras mit einem Büschel (drei Pixel schräg) und einem Blümchen."""
    kachel = Image.new("RGBA", (K, K), GRAS)
    for ort in ((2, 3), (3, 2), (3, 3)):
        kachel.putpixel(ort, HALM)
    kachel.putpixel((10, 12), BLUETE)
    return kachel


def _flaeche(farbe=GRAS) -> tuple[Image.Image, list, Image.Image]:
    bild = Image.new("RGBA", (BREIT * K, HOCH * K), farbe)
    felder = [(x, y) for y in range(HOCH) for x in range(BREIT)]
    return bild, felder, bodenmaske(bild, set(felder), set(), {farbe})


def test_streuteile_der_kachel():
    kachel = _graskachel()
    assert grundfarbe(kachel) == GRAS
    teile = sorted(streuteile([kachel], GRAS), key=len)
    assert [len(t) for t in teile] == [1, 3]
    assert teile[0] == [(0, 0, BLUETE)]
    assert {(dx, dy) for dx, dy, _ in teile[1]} == {(0, 1), (1, 0), (1, 1)}


def test_grosse_zeichnung_ist_kein_streuteil():
    kachel = Image.new("RGBA", (K, K), GRAS)
    kachel.paste(HALM, (0, 0, K, 4))
    assert streuteile([kachel], GRAS) == []


def test_streuung_ohne_gitter_und_bei_jedem_lauf_gleich():
    teile = streuteile([_graskachel()], GRAS)
    bild, felder, maske = _flaeche()
    streue(bild, maske, felder, teile, 2, ("a.b", "gras"))
    zweites, _, _ = _flaeche()
    streue(zweites, maske, felder, teile, 2, ("a.b", "gras"))
    assert bild.tobytes() == zweites.tobytes()
    assert set(bild.get_flattened_data()) == {GRAS, HALM, BLUETE}  # nur Farben der Kachel
    kacheln = {bild.crop((x * K, y * K, (x + 1) * K, (y + 1) * K)).tobytes() for x, y in felder}
    assert len(kacheln) > len(felder) // 2  # kaum ein Feld gleicht dem anderen


def test_gestreut_wird_nur_auf_den_eigenen_boden():
    bild, felder, _ = _flaeche()
    bild.paste(ERDE, (4 * K, 0, BREIT * K, HOCH * K))  # rechte Hälfte: anderer Boden
    links = {f for f in felder if f[0] < 4}
    maske = bodenmaske(bild, links, set(), {GRAS})
    streue(bild, maske, felder, streuteile([_graskachel()], GRAS), 3, ("a.b", "gras"))
    koernung(bild, maske, felder, 6, ("a.b", "gras"))
    wolken(bild, maske, 0.05, zufall("a.b", "gras"))
    rechts = bild.crop((4 * K, 0, BREIT * K, HOCH * K))
    assert set(rechts.get_flattened_data()) == {ERDE}
    assert len(set(bild.crop((0, 0, 4 * K, HOCH * K)).get_flattened_data())) > 3


def test_randkachel_nur_in_den_farben_des_bodens():
    bild = Image.new("RGBA", (2 * K, K), ERDE)
    bild.paste(GRAS, (K, 0, K + 5, K))  # Grasrand in der Randkachel
    maske = bodenmaske(bild, {(0, 0)}, {(1, 0)}, {ERDE})
    assert maske.getpixel((3, 3)) == VOLL and maske.getpixel((K + 8, 3)) == VOLL
    assert maske.getpixel((K + 2, 3)) == 0


def test_koernung_und_kiesel_bleiben_im_ton():
    bild, felder, maske = _flaeche(ERDE)
    koernung(bild, maske, felder, 5, ("a.b", "erde"))
    farben = set(bild.get_flattened_data())
    assert ERDE in farben and len(farben) > 2  # Grund, dunkler, heller (und Punkte übereinander)
    assert all(abs(f[0] - ERDE[0]) < 40 for f in farben)
    steinchen = kiesel(ERDE)
    assert steinchen and all(1 < len(teil) <= 9 for teil in steinchen)
    assert getoent(ERDE, 1.0) == ERDE and getoent((250, 250, 250, 255), 1.2)[:3] == (VOLL, VOLL, VOLL)


def test_wolken_faerben_teile_der_flaeche():
    bild, _, maske = _flaeche(ERDE)
    wolken(bild, maske, 0.04, zufall("a.b", "erde", "wolken"))
    farben = bild.getcolors()
    assert len(farben) == 3  # dunkler, Grund, heller: harte Kanten, kein Verlauf
    assert max(anzahl for anzahl, _ in farben) < BREIT * HOCH * K * K
