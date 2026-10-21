"""Tests der Eichung der menschlichen Zugwahl (pipeline/menschenprofil/eichen.py)."""

from pipeline.menschenprofil.eichen import (
    KERN_EXPONENTEN,
    _mischung,
    _steigend,
    ist_artzug,
    kern_anteile,
    klasse,
)
from pipeline.menschenprofil.sammeln import BAENDER


def test_klasse_nach_untergrenzen():
    assert klasse(0.5) == 0
    assert klasse(2.4) == 2
    assert klasse(7.0) == 4


def test_artzug_braucht_art_und_halben_bauern():
    assert ist_artzug(["e2e4", -0.6, "figurHaengen", []], 0.0)
    assert not ist_artzug(["e2e4", -0.6, "ungenau", []], 0.0)
    assert not ist_artzug(["e2e4", -0.2, "figurHaengen", []], 0.0)


def test_kern_billig_vor_teuer():
    anteile = kern_anteile([0.0, 3.0], 0.25, 1.0)
    assert abs(anteile[0] / anteile[1] - 13) < 1e-9


def test_exponent_steigt_mit_der_staerke():
    # Jedes Band „möchte“ einen fallenden Exponenten; die Lösung bleibt nicht fallend.
    fehler = {}
    for i, band in enumerate(BAENDER):
        wunsch = KERN_EXPONENTEN[-1 - i % len(KERN_EXPONENTEN)]
        for a in KERN_EXPONENTEN:
            fehler[(band, a)] = (abs(a - wunsch), 0.1)
    weg = _steigend(fehler)
    assert len(weg) == len(BAENDER)
    assert all(x <= y for x, y in zip(weg, weg[1:], strict=False))


def test_blinder_fleck_nimmt_seine_zuege_weg():
    zeile = {"v": [0.0, 0.2, 1.0], "f": [["ruhig"], [], ["ruhig"]], "g": 0.2}
    mischung = _mischung(zeile, {"ruhig": [0.4] * len(BAENDER)}, 0)
    assert mischung[0] == (0.6, [0.0, 0.2, 1.0])
    assert abs(mischung[1][0] - 0.4) < 1e-9
    assert mischung[1][1] == [0.2]
