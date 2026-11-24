"""Tests des geglätteten Umrisses (pipeline/abenteuer/randzug.py), ohne Pillow.

Anlass: Kartenblick 24.11.2026, M03 und M04 (Ufer und Wege als Treppen, Wasserquadrate an Knicken).
"""

from pipeline.abenteuer import randzug as R


def _frei(feld, richtung):
    return False


def _fest(feld, richtung):
    return True


def test_teich_hat_einen_umriss_mit_acht_kanten():
    teich = {(1, 1), (2, 1), (1, 2), (2, 2)}
    umrisse = R.umrisse(teich, _frei)
    assert len(umrisse) == 1 and len(umrisse[0]) == 8
    assert R.flaeche(R.stuetzpunkte(umrisse[0])[0]) == (2 * R.K) ** 2  # im Uhrzeigersinn: positiv


def test_insel_ist_ein_zweiter_umriss_mit_negativer_flaeche():
    ring = {(x, y) for x in range(3) for y in range(3)} - {(1, 1)}
    zuege = R.randzuege(ring, _fest)
    assert len(zuege) == 2
    assert R.flaeche(zuege[0]) == (3 * R.K) ** 2 and R.flaeche(zuege[1]) == -(R.K**2)


def test_felder_ueber_eck_bekommen_getrennte_umrisse():
    # Ein Bach, der nur über Eck weiterläuft: Zwischen den Feldern entsteht ein Rand.
    assert [len(u) for u in R.umrisse({(0, 0), (1, 1)}, _frei)] == [4, 4]


def test_feste_kanten_bleiben_wo_sie_sind():
    zug = R.stuetzpunkte(R.umrisse({(0, 0), (1, 0)}, _fest)[0])
    assert R.glaette(zug) == zug[0]


def test_treppe_wird_zur_schraegen_und_bleibt_beim_raster():
    # Ufer, das je Feld um eine Reihe nach unten springt (zwölf Stufen); nur die Treppe ist frei.
    treppe = {(x, y) for x in range(12) for y in range(x, 14)}
    heimat, fest = R.stuetzpunkte(R.umrisse(treppe, lambda f, r: r not in ((0, -1), (1, 0)))[0])
    glatt = R.glaette((heimat, fest))
    wege = [((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5 for a, b in zip(glatt, heimat, strict=True)]
    assert max(wege) <= R.AUSSCHLAG + 1e-6
    # Mitten in der Treppe liegt der Zug nahe der Geraden durch die Stufenmitten (y = x − 8).
    mitte = [p for p, h in zip(glatt, fest, strict=True) if not h and 64 < p[0] < 128]
    assert mitte and max(abs(p[1] - p[0] + R.K / 2) for p in mitte) < 2.5


def test_kleiner_teich_schrumpft_nicht_zusammen():
    zug = R.randzuege({(0, 0), (1, 0), (0, 1), (1, 1)}, _frei)[0]
    assert R.flaeche(zug) > 0.95 * (2 * R.K) ** 2
    # Eine kleine Insel im See (Umriss gegen den Uhrzeigersinn) ebenso wenig.
    see = {(x, y) for x in range(5) for y in range(5)} - {(2, 2)}
    assert abs(R.flaeche(R.randzuege(see, _frei)[1])) > 0.95 * R.K**2
