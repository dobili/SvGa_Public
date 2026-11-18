"""Tests für das Z der Pixelschrift (``pipeline/abenteuer/schriftglyphe.py``).

Warum: Das Z von Pixelify Sans sah aus wie die 2 („2oe“ statt „Zoe“, 18.11.2026). Die Tests halten
fest, dass die Schrift im Repository das ersetzte Z trägt, dass es sich deutlich von der 2
unterscheidet und dass sonst nichts an der Glyphe (Breite, Ränder) anders ist.

Aufruf: ``python -m pytest pipeline/tests/test_abenteuer_schriftglyphe.py``
"""

import pytest

pytest.importorskip("brotli", reason="woff2 braucht brotli")

from fontTools.ttLib import TTFont  # noqa: E402

from pipeline.abenteuer.schriftglyphe import (  # noqa: E402
    REIHE_OBEN,
    REIHE_UNTEN,
    SCHRIFT,
    SPALTE_LINKS,
    SPALTE_RECHTS,
    ersetze_z,
    umriss,
    z_umriss,
)

# So viele Eckpunkte teilte das alte Z mit der 2 nicht (zwei von 24): Darunter ist es wieder eine 2.
MINDESTENS_EIGENE_ECKEN = 8


@pytest.fixture(scope="module")
def schrift() -> TTFont:
    return TTFont(SCHRIFT)


def test_schrift_im_repository_traegt_das_neue_z(schrift):
    assert umriss(schrift, "Z") == z_umriss()


def test_z_ist_keine_zwei(schrift):
    eigene = set(umriss(schrift, "Z")) - set(umriss(schrift, "two"))
    assert len(eigene) >= MINDESTENS_EIGENE_ECKEN


def test_z_hat_volle_balken_und_keinen_querstrich():
    ecken = z_umriss()
    links, rechts = SPALTE_LINKS[0], SPALTE_RECHTS[-1]
    # Oberer und unterer Balken reichen über die ganze Breite.
    assert (links, REIHE_OBEN[-1]) in ecken and (rechts, REIHE_OBEN[-1]) in ecken
    assert (links, REIHE_UNTEN[0]) in ecken and (rechts, REIHE_UNTEN[0]) in ecken
    # Die 2 hat in der mittleren Reihe einen Strich über drei Spalten; das Z nur eine Stufe.
    mitte = REIHE_OBEN[3]
    breite = max(x for x, y in ecken if y == mitte) - min(x for x, y in ecken if y == mitte)
    assert breite < SPALTE_LINKS[2] - SPALTE_LINKS[0]


def test_breite_und_raender_bleiben(schrift):
    assert schrift["hmtx"]["Z"] == schrift["hmtx"]["two"]
    xs = [x for x, _ in umriss(schrift, "Z")]
    assert (min(xs), max(xs)) == (SPALTE_LINKS[0], SPALTE_RECHTS[-1])


def test_ersetzen_ist_wiederholbar(schrift):
    assert ersetze_z(schrift) is False
