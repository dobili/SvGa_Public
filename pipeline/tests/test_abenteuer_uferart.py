"""Tests der Uferart je Nachbarboden (pipeline/abenteuer/uferart.py), ohne Pillow.

Anlass: Kartenblick 24.11.2026, M03: Zwischen Sand, Watt, Schotter oder Steg und dem Wasser lag
immer ein grüner Grasstreifen, weil das Ufer je Karte nur eine Art hatte.
"""

from pipeline.abenteuer import uferart as U
from pipeline.abenteuer.bodenraster import eckzusaetze

STRAND = {
    "art": "aussen",
    "boden": "gras",
    "boeden": {"s": "strand", "h": "holzDunkel", "p": "pflaster", "k": "schotter"},
    "raster": ["sssss..", "~~~~h..", "~~~~~kk", "pp~~~~~"],
}


def test_nachbarboden_entscheidet():
    assert U.uferart(None, "strand") == "boden"
    assert U.uferart(None, "wasser_watt") == "boden"
    assert U.uferart(None, "schotter") == "boden"
    assert U.uferart(None, "pflaster") == "stein"
    assert U.uferart(None, "gras") == "gras" and U.uferart(None, "hecke") == "gras"
    assert U.uferart("strand", "gras") == "gras"  # „strand“ ist nur noch die Wasserfarbe
    assert U.uferart("moor", "sumpfboden") == "boden"


def test_holz_hat_nie_ein_ufer_und_die_kaimauer_bleibt():
    assert U.uferart(None, "holzDunkel") == "ohne" and U.uferart("stein", "dielen") == "ohne"
    assert U.uferart("stein", "gras") == "stein" and U.uferart("stein", "sand") == "stein"


def test_nachbarufer_je_richtung():
    zeilen = U.gezeichnetes_raster(STRAND)
    erwartet = {(0, -1): "boden", (1, 0): "ohne", (-1, -1): "boden", (1, -1): "boden"}
    assert U.nachbarufer(STRAND, zeilen, 3, 1) == erwartet


def test_weich_ausser_an_der_kaimauer():
    zeilen = U.gezeichnetes_raster(STRAND)
    assert U.weich(STRAND, zeilen, 3, 1) and U.uferbogen(STRAND, zeilen, 3, 1) == "wasser"
    assert not U.weich(STRAND, zeilen, 2, 3) and U.uferbogen(STRAND, zeilen, 2, 3) == "wasser_stein"
    kanal = STRAND | {"ufer": "stein"}
    assert not U.weich(kanal, zeilen, 0, 1) and U.uferbogen(kanal, zeilen, 0, 1) == "wasser_stein"
    assert U.uferbogen(STRAND | {"ufer": "moor"}, zeilen, 0, 1) == "wasser_moor"


def test_bruecke_zaehlt_als_wasser_und_randwand_zeigt_das_feld_dahinter():
    szene = {"wandart": "hecke", "bruecken": ["b"], "raster": ["##~##", "#.b#.", "##~##"]}
    assert U.gezeichnetes_raster(szene) == ["..~##", "..~#.", "..~##"]
    assert U.bodenart(szene, U.gezeichnetes_raster(szene), 3, 1) == "hecke"


def test_zweite_innenecke_kommt_als_viertel_dazu():
    # Wasserarm, der schräg weiterläuft: Land oben links und unten rechts (Canyonrand (65, 25)).
    zeilen = [".~~", "~~~", "~~."]
    assert eckzusaetze([0, 0], zeilen, 1, 1) == [([3, 0], (1, 1)), ([4, 1], (-1, -1))]
    # Liegt an einer Seite selbst Land, zeigt die Randkachel dort schon ihren Rand.
    assert eckzusaetze([0, 0], ["...", "~~~", "~~."], 1, 1) == [([3, 0], (1, 1))]


def test_kaimauer_am_pflaster_und_befund_am_schmalen_kanal():
    szene = {"art": "aussen", "boeden": {"s": "sand", "p": "pflaster"}, "raster": ["sss", "~~~", "ppp"]}
    assert U.befunde("probe", szene) == [
        f"probe ({x}, 1): Landnachbar ohne Randkachel nach (0, -1), (0, 1)" for x in range(3)
    ]
    breit = szene | {"raster": ["sss", "~~~", "~~~", "ppp"]}
    assert U.befunde("probe", breit) == []  # Kaimauer aus dem Steinbogen, kein Grasrand am Sand
    assert U.befunde("probe", {"art": "aussen", "raster": [".~.", ".~.", ".~."]}) == []  # weich


def test_kein_wasserfeld_mit_falschem_oder_fehlendem_rand():
    # Dauertest über alle Szenen: „0 Befunde“ (Ausnahmen mit Grund in uferart.GEPRUEFT).
    assert U.alle_befunde() == []
