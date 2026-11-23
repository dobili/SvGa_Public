"""PixelLab-Tiere (pipeline/abenteuer/pixellab_tiere.py, pixellab_wasser.py, pixellab_tierwahl.py).

Warum: Auftrag des Hauptchats (23.11.2026). Geprüft wird ohne die privaten Exporte: Auswahl von sechs
Bewegungsbildern, Ersatz fehlender Richtungen, Erkennung und Umfärbung des Wassers, Vollständigkeit
der Wahltabelle gegen den Tierplan.
"""

import pytest

from pipeline.abenteuer.pixellab_tierwahl import WAHL
from pipeline.abenteuer.tierplan_daten import ARTEN


def test_wahltabelle_passt_zum_tierplan():
    """Jede gewählte Art steht im Tierplan (Zielhöhe), auch die Nachlieferung des Autors."""
    assert set(WAHL) <= set(ARTEN)
    assert {"saugroboter", "drohne", "waschbaer"} <= set(WAHL)
    for art, w in WAHL.items():
        assert w.grund, art
        assert set(w.zustaende) <= {"sitzen", "schlafen", "grasen"}, art
        assert w.wasser in ("standard", "moor"), art


def test_sechs_bilder_gleichmaessig():
    image = pytest.importorskip("PIL.Image")
    from pipeline.abenteuer.pixellab_tiere import sechs

    bilder = [image.new("RGBA", (1, 1), (i, 0, 0, 255)) for i in range(9)]
    assert [b.getpixel((0, 0))[0] for b in sechs(bilder)] == [0, 2, 3, 5, 6, 8]
    assert len(sechs(bilder[:4])) == 6  # zu wenige Bilder: wiederholt


def test_fehlende_richtungen_werden_ersetzt():
    """Nur rechts vorhanden (Dackel): links gespiegelt, oben und unten die Seitenansicht."""
    image = pytest.importorskip("PIL.Image")
    from pipeline.abenteuer.pixellab_tiere import mit_richtungen

    rechts = image.new("RGBA", (2, 1))
    rechts.putpixel((0, 0), (255, 0, 0, 255))
    fertig = mit_richtungen(lambda r: [rechts] if r == "east" else [])
    assert fertig["west"][0].getpixel((1, 0))[0] == 255
    assert fertig["north"][0] is rechts and fertig["south"][0] is rechts


def test_wasser_erkannt_tierfarben_geschuetzt():
    pytest.importorskip("PIL.Image")
    from pipeline.abenteuer.pixellab_wasser import ist_wasser

    tier = [(40, 90, 200)]  # blaues Tier (Delfin): seine Farbe bleibt
    assert ist_wasser((70, 150, 220), [])
    assert not ist_wasser((40, 90, 200), tier)
    assert not ist_wasser((60, 140, 40), [])  # Grün des Alligators


def test_umfaerben_zieht_auf_die_palette_und_blendet_den_rand():
    image = pytest.importorskip("PIL.Image")
    from pipeline.abenteuer.pixellab_wasser import umfaerben

    bild = image.new("RGBA", (9, 9), (0, 0, 0, 0))
    for x in range(1, 8):
        for y in range(1, 8):
            bild.putpixel((x, y), (40, 120, 230, 255))  # fremdes Blau
    neu = umfaerben(bild, [], "standard", 0.53)
    mitte, rand = neu.getpixel((4, 4)), neu.getpixel((1, 4))
    assert abs(mitte[0] - 60) < 25 and abs(mitte[1] - 163) < 25  # nahe #3ca3b2
    assert rand[3] < mitte[3] == 255
