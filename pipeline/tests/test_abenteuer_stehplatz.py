"""Tests der Stehplätze (stehplatz.py) und der Ersatzfelder ohne Stuhlbild (ohnesitzbild.json).

Befund von mittel-1 (23.11.2026): Ersatzfelder hinter der Wand des Diners, halb unter einem Dach
im Park, ein Haarschopf zwischen den Nischentischen. Ohne privates Paket.
"""

from pipeline.abenteuer import stehplatz as S
from pipeline.abenteuer import tagesablauf as T

KATALOG = {"tisch": {"art": "tisch"}, "teppich": {"art": "teppich"}, "haus": {"art": "gebaeude"}}


def _stueck(name: str, x: int, y: int, breite: int, hoehe: int) -> dict:
    return {"name": name, "x": x, "y": y, "breite": breite, "hoehe": hoehe, "tiefe": y + hoehe}


def test_tisch_davor_verdeckt_teppich_und_dahinter_nicht():
    tisch = _stueck("tisch", 32, 16, 32, 32)  # Kacheln (2..3, 1..2), Unterkante 48
    assert S.verdeckt((2, 1), [tisch], KATALOG) == "tisch"  # Fuß bei 32, Tisch vorn
    assert S.verdeckt((2, 3), [tisch], KATALOG) is None  # vor dem Tisch
    hinten = {**tisch, "tiefe": 0}  # Ebene −57 wie die Nischentische: die Figur stünde darauf
    assert S.verdeckt((3, 2), [hinten], KATALOG) == "tisch"
    assert S.verdeckt((2, 1), [_stueck("teppich", 32, 16, 32, 32)], KATALOG) is None


def test_stehplatz_meidet_dach_und_besetzte_felder():
    dach = _stueck("haus", 0, 32, 48, 48)  # deckt (0..2, 2..4), Unterkante 80
    frei = {(x, y) for x in range(6) for y in range(6)}
    assert S.stehplatz((1, 1), frei, [dach], KATALOG, set()) == (0, 1)
    assert S.stehplatz((1, 1), frei, [dach], KATALOG, {(0, 1)}) == (2, 1)
    assert S.stehplatz((1, 1), {(1, 1)}, [], KATALOG, set()) is None


def test_ersatzfelder_liegen_sichtbar_im_raum():
    # Dauertest: Jedes Ersatzfeld ist erreichbar und nicht verdeckt (wie die Stehplätze in tagesablauf.py).
    karten = T.Karten()
    for person, stellen in T.ersatzfelder().items():
        for stelle, feld in stellen.items():
            info = karten.info(stelle.split("@")[0])
            assert tuple(feld) in info["frei"], (person, stelle)
            assert S.verdeckt(tuple(feld), info["gesetzt"], karten.katalog) is None, (person, stelle)
