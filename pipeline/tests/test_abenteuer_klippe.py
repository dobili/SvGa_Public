"""Felskanten aus LimeZus Klippenkacheln (pipeline/abenteuer/klippe.py, Runde 8).

Warum: Die Steinbruchgrube wirkte wie Räume mit Erdwänden (Revision 2, Punkt 18). Die Szene kann mit
``"kante": "klippe"`` Kanten mit gewellter Oberkante, Felswand und Grasfuß zeichnen und Treppen auf
Rampen. Die Tests prüfen die Kachelwahl ohne Bilder; ohne den Schlüssel bleibt alles beim Alten.
"""

from pipeline.abenteuer.klippe import (
    GRAS_KLIPPE,
    REIHE_FUSS,
    REIHE_KANTE,
    REIHE_OBEN,
    REIHE_RAND,
    REIHE_WAND,
    ROTE_KLIPPE,
    SPALTEN,
    TREPPE,
    grasboden,
    klippenbogen,
    klippenfeld,
    strassenzeichen,
    treppenfeld,
)

# Wiese oben, ein Band aus drei Reihen „#“, eine Rampe (Spalten 5–6), Schotter unten.
RASTER = [
    "rrrrrrrr",
    "#####..#",
    "#####..#",
    "#####..#",
    "........",
]
GRAS = {"r"}


def test_band_hat_kante_wand_und_fuss():
    links, mitte, rechts = SPALTEN["gras"]
    assert klippenfeld(RASTER, 2, 1, GRAS) == (mitte, REIHE_KANTE)
    assert klippenfeld(RASTER, 2, 2, GRAS) == (mitte, REIHE_WAND)
    assert klippenfeld(RASTER, 2, 3, GRAS) == (mitte, REIHE_FUSS)


def test_enden_eines_abschnitts_haben_randkacheln():
    links, _, rechts = SPALTEN["gras"]
    assert klippenfeld(RASTER, 0, 2, GRAS)[0] == links
    assert klippenfeld(RASTER, 4, 2, GRAS)[0] == rechts


def test_ohne_gras_darueber_nimmt_die_klippe_erde():
    raster = ["ffff", "####", "####", "####", "...."]
    assert klippenfeld(raster, 1, 1, GRAS)[0] == SPALTEN["erde"][1]


def test_dicker_rand_zeigt_die_obere_flaeche():
    raster = ["######", "##rr##", "##rr##", "######"]
    assert klippenfeld(raster, 1, 1, GRAS) == (SPALTEN["gras"][2], REIHE_OBEN)
    assert klippenfeld(["####", "####", "####"], 1, 1, GRAS) == (SPALTEN["erde"][1], REIHE_OBEN)


def test_suedrand_einer_schlucht_zeigt_die_kante_der_hochflaeche():
    """Regel: Runde 9, Muster „Höhen als Grundriss“: Wand unter Boden ist der Rand der Hochfläche."""
    raster = ["....", "####", "####"]
    assert klippenfeld(raster, 1, 1, GRAS) == (SPALTEN["erde"][1], REIHE_RAND)


def test_boden_ist_keine_kante():
    assert klippenfeld(RASTER, 5, 2, GRAS) is None


def test_rampe_durch_das_band_bekommt_eine_treppe():
    assert treppenfeld(RASTER, 5, 1) == TREPPE["oben"]
    assert treppenfeld(RASTER, 6, 2) == TREPPE["mitte"]
    assert treppenfeld(RASTER, 5, 3) == TREPPE["unten"]


def test_keine_treppe_neben_dem_ende_eines_bands_oder_auf_der_strasse():
    offen = ["rrrrrr", "###...", "###...", "###...", "......"]
    assert treppenfeld(offen, 3, 2) is None
    strasse = ["rrrrrrrr", "#####ss#", "#####ss#", "#####ss#", "........"]
    assert treppenfeld(strasse, 5, 2, {"s"}) is None


def test_zeichen_aus_der_szene():
    szene = {"boden": "gras", "boeden": {"r": "gras", "s": "asphalt", "k": "schotter"}}
    assert grasboden(szene) == {".", "r"}
    assert strassenzeichen(szene) == {"s"}


def test_roter_fels_nimmt_die_rote_klippe_nur_wenn_das_bild_da_ist(tmp_path):
    """Regel: Runde 9, roter Fels (Canyon, Sternwarte) mit rot umgefärbter Erdklippe."""
    szene = {"kante": "klippe", "fels": "rot"}
    assert klippenbogen(szene, tmp_path) == "gelaende"
    (tmp_path / ROTE_KLIPPE).parent.mkdir(parents=True)
    (tmp_path / ROTE_KLIPPE).write_bytes(b"")
    assert klippenbogen(szene, tmp_path) == "klippeRot"
    assert klippenbogen({"kante": "klippe"}, tmp_path) == "gelaende"


def test_deich_nimmt_den_grashang_nur_wenn_das_bild_da_ist(tmp_path):
    """Regel: Runde 9, Deich mit grünem Hang statt Felswand (Gutachten weg-silicon-delacroix)."""
    szene = {"kante": "klippe", "fels": "gras"}
    assert klippenbogen(szene, tmp_path) == "gelaende"
    (tmp_path / GRAS_KLIPPE).parent.mkdir(parents=True)
    (tmp_path / GRAS_KLIPPE).write_bytes(b"")
    assert klippenbogen(szene, tmp_path) == "klippeGras"


def test_kartenrand_neben_boden_ist_kein_fels():
    """Regel: Runde 9, kein Rahmen um die Karte; „wandart“ zeichnet dort den Boden."""
    raster = ["#####", "#...#", "#...#", "#####"]
    assert klippenfeld(raster, 0, 1, GRAS) is None
    assert klippenfeld(raster, 2, 3, GRAS) is None
