"""Tests für pipeline/abenteuer/bauteilregeln.py (Regel 10.95, Bauteile):
Körper sperrt seinen Grundriss, Dach verdeckt nur, Treppen begehbar mit Wangen, Absatz mit Mauer vorn,
Tür als Zugang, Bodenebene für Stege,
von Hand geht vor Gemini. Beispiel ist die Schule (mf4Schule), an der Treppen und Mauer vertauscht waren.
"""


from pipeline.abenteuer.bauteilpruefung import nachbessern, verdacht
from pipeline.abenteuer.bauteilregeln import (
    ableiten,
    katalogfelder,
    koerper,
    liegt_an,
    pixelklassen,
    richtung,
    zellen,
)
from pipeline.abenteuer.kollisionfein import ZP

SCHULE = [
    {"typ": "dach", "rahmen": [8, 2, 376, 200]},
    {"typ": "wand", "rahmen": [8, 196, 376, 330]},
    {"typ": "sockel", "rahmen": [8, 322, 376, 336]},
    {"typ": "tuer", "rahmen": [120, 262, 170, 322]},
    {"typ": "absatz", "rahmen": [112, 324, 272, 352]},
    {"typ": "treppe", "rahmen": [98, 324, 112, 364], "richtung": "links"},
    {"typ": "treppe", "rahmen": [272, 324, 286, 364], "richtung": "rechts"},
    {"typ": "mauer", "rahmen": [112, 350, 272, 364]},
]


def _zelle(x: int, y: int) -> tuple[int, int]:
    return x // ZP, y // ZP


def test_koerper_reicht_vom_fuss_bis_eine_kachel_unter_das_dach():
    assert koerper(SCHULE) == [[8, 18, 376, 336]]


def test_schule_treppen_seitlich_begehbar_vorderkante_sperrt():
    erg = ableiten(SCHULE)
    assert _zelle(104, 340) in erg.boden  # linke Treppe
    assert _zelle(278, 340) in erg.boden  # rechte Treppe
    assert _zelle(190, 340) in erg.boden  # Absatz
    assert _zelle(190, 360) in erg.sperre  # Vorderkante: Mauer
    assert _zelle(104, 362) in erg.sperre  # Wange unten an der Seitentreppe
    assert _zelle(190, 100) in erg.sperre  # Grundriss unter dem Dach
    assert _zelle(190, 6) not in erg.sperre  # hinter dem First frei (verdeckt)
    assert erg.sortierlinie == 336


def test_tuer_ist_zugang_bis_zum_fuss():
    erg = ableiten(SCHULE)
    assert erg.zugaenge == [[120, 318, 170, 336]]
    assert _zelle(140, 330) not in erg.sperre


def test_begehbares_ueber_der_linie_wird_bodenbereich():
    erg = ableiten(SCHULE)
    assert [112, 324, 272, 336] in erg.boden_bereiche


def test_dach_ohne_wand_und_markise_sperren_nicht():
    erg = ableiten([{"typ": "markise", "rahmen": [0, 0, 32, 16]}, {"typ": "dach", "rahmen": [0, 0, 32, 8]}])
    assert erg.sperre == set()


def test_freistehende_mauer_sperrt_nur_den_fuss():
    erg = ableiten([{"typ": "mauer", "rahmen": [0, 0, 32, 24]}])
    assert {y for _, y in erg.sperre} == {4, 5}  # Pixel 16 bis 24
    assert erg.sortierlinie == 24


def test_seitliches_gelaender_laeuft_in_die_tiefe_und_sperrt_ganz():
    erg = ableiten([{"typ": "steg", "rahmen": [0, 0, 32, 64]}, {"typ": "gelaender", "rahmen": [0, 0, 4, 64]}])
    assert {(0, y) for y in range(16)} <= erg.sperre


def test_steg_mit_gelaender_liegt_auf_der_bodenebene():
    erg = ableiten(
        [{"typ": "steg", "rahmen": [0, 0, 64, 32]}, {"typ": "gelaender", "rahmen": [0, 24, 64, 32]}]
    )
    assert erg.ebene == "boden"
    assert erg.sortierlinie is None


def test_treppe_ohne_richtung_oeffnet_sich_vom_absatz_weg():
    absatz = {"typ": "absatz", "rahmen": [16, 0, 48, 16]}
    links = {"typ": "treppe", "rahmen": [0, 0, 16, 24]}
    assert richtung(links, [absatz, links]) == "links"
    assert richtung({"typ": "treppe", "rahmen": [0, 0, 16, 16]}, []) == "unten"


def test_liegt_an():
    assert liegt_an([112, 324, 272, 352], [98, 324, 112, 364], "links")
    assert not liegt_an([112, 324, 272, 352], [98, 324, 112, 364], "unten")


def test_treppe_in_der_veranda_bleibt_vorn_offen():
    erg = ableiten(
        [{"typ": "veranda", "rahmen": [0, 0, 64, 20]}, {"typ": "treppe", "rahmen": [24, 12, 40, 28]}]
    )
    assert _zelle(30, 18) not in erg.sperre
    assert _zelle(4, 18) in erg.sperre  # Vorderkante neben der Treppe


def test_pixelklassen_und_katalogfelder():
    erg = ableiten(SCHULE)
    alpha = bytes([255]) * (384 * 368)
    klassen = pixelklassen(erg, alpha, 384, 368)
    assert klassen[100][190] == "s" and klassen[340][104] == "v" and klassen[4][190] == "h"
    felder = katalogfelder(erg, 384, 368, "von Hand")
    assert felder["sortierlinie"] == 336 and len(felder["maske_fein"]) == 92


def test_zellen_nach_mitte():
    assert zellen([0, 0, 8, 4]) == {(0, 0), (1, 0)}


def test_flachdach_und_hohe_fassade_sind_koerper():
    flach = [{"typ": "dach", "rahmen": [0, 8, 80, 14]}, {"typ": "wand", "rahmen": [0, 8, 80, 126]}]
    assert koerper(flach) == [[0, 24, 80, 126]]
    gestapelt = [{"typ": "wand", "rahmen": [0, 8, 96, 60]}, {"typ": "wand", "rahmen": [0, 60, 96, 92]}]
    assert koerper(gestapelt) == [[0, 24, 96, 92]]
    assert koerper([{"typ": "wand", "rahmen": [0, 0, 32, 24]}]) == []  # niedrige Mauer: nur Fuß


def test_treppe_unten_zwischen_seitentreppen_wird_mauer():
    teile = [t for t in SCHULE if t["typ"] != "mauer"] + [
        {"typ": "treppe", "rahmen": [98, 352, 286, 364], "richtung": "unten"}
    ]
    assert verdacht(teile)
    neu = nachbessern(teile)
    assert neu[-1]["typ"] == "mauer" and not verdacht(neu)
    assert nachbessern(SCHULE) == SCHULE
