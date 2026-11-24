"""Tests der Prüfung Bodenfläche (bodenflaeche.py): Kein Boden zeigt das Kachelraster.

Warum: Kartenblick M01 (24.11.2026), Arbeitspaket AP1. Die Messung läuft ohne privates Paket an
nachgebauten Bildern; der Dauertest über alle Szenen braucht das Paket (``SVGA_PRIVAT``).
"""

import os
from pathlib import Path

import pytest

pytest.importorskip("PIL.Image")

from PIL import Image  # noqa: E402

from pipeline.abenteuer import bodenflaeche as B  # noqa: E402
from pipeline.abenteuer.bodenvariation import variiere  # noqa: E402
from pipeline.abenteuer.kartenbau import INHALTE, K, lade  # noqa: E402

ERDE, GRAS = (170, 143, 90, 255), (71, 151, 87, 255)
BREIT, HOCH = 10, 6
MATERIALIEN = {
    "bodenvariation_standard": True,
    "boeden": {"erde": {"bogen": "x", "feld": [0, 0], "variation": {"koernung": 4, "wolken": 0.03}}},
}


def _platz() -> tuple[Image.Image, dict]:
    """Ein Erdplatz von 10 × 6 Feldern, rechts daneben ein Streifen Wasser."""
    bild = Image.new("RGBA", ((BREIT + 1) * K, HOCH * K), ERDE)
    gezeichnet = {(x, y): ("erde", [0, 0]) for x in range(BREIT) for y in range(HOCH)}
    gezeichnet.update({(BREIT, y): ("wasser_stein", [1, 1]) for y in range(HOCH)})
    return bild, gezeichnet


def test_glatte_flaeche_ist_befund_wasser_nicht():
    bild, gezeichnet = _platz()
    assert B.gleiche_flaechen(bild, gezeichnet) == [("erde", BREIT * HOCH, (0, 0))]
    assert B.ausgenommen("wasser") and B.ausgenommen("wasser_stein") and not B.ausgenommen("erde")


def test_kleine_flaeche_und_getrennte_flaechen_sind_keine_befunde():
    bild, gezeichnet = _platz()
    for y in range(HOCH):  # eine Spalte anderer Zeichnung teilt den Platz in 4 × 6 und 5 × 6
        bild.putpixel((4 * K + 3, y * K + 3), GRAS)
    assert B.gleiche_flaechen(bild, gezeichnet) == [("erde", 5 * HOCH, (5, 0))]
    assert B.gleiche_flaechen(bild, gezeichnet, mehr_als=5 * HOCH) == []


def test_variation_behebt_die_glatte_flaeche():
    bild, gezeichnet = _platz()
    neu = variiere(
        {"karte": "a.b"}, bild, gezeichnet, MATERIALIEN, lambda _art, _feld: bild.crop((0, 0, K, K))
    )
    assert B.gleiche_flaechen(neu, gezeichnet) == []


def test_jeder_boden_ausser_wasser_hat_eine_variation():
    # Ohne Variation bliebe der Boden auf großen Flächen pixelgleich (Befund im Dauertest).
    materialien = lade(INHALTE / "materialien.json")
    assert materialien["bodenvariation_standard"] is True
    ohne = [
        name
        for name, art in materialien["boeden"].items()
        if not B.ausgenommen(name) and not art.get("variation")
    ]
    assert ohne == []


def test_befundtext():
    befund = B.Befund("jahrmarkt-festplatz", "jahrmarkt.festplatz", "erde", (9, 9), "1400 gleiche Felder")
    assert befund.text() == "jahrmarkt-festplatz: erde bei 9,9: 1400 gleiche Felder"


@pytest.mark.skipif(not os.environ.get(B.UMGEBUNG), reason="privates Paket nicht da (SVGA_PRIVAT)")
def test_kein_boden_zeigt_das_kachelraster():
    # Dauertest: „0 Befunde“ in allen Szenen und Varianten (Ausnahmen mit Grund im Werkzeug).
    je_szene = B.alle_befunde(Path(os.environ[B.UMGEBUNG]))
    assert [b.text() for befunde in je_szene.values() for b in befunde] == []
