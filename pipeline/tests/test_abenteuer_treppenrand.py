"""Tests der Treppenprüfung und der Wegenden (pipeline/abenteuer/treppenrand.py), ohne Pillow.

Anlass: Kartenblick 24.11.2026, M04: Wege als Treppen, Stichwege mit runder Kappe vor der Tür,
gerade Kanten zwischen zwei Belägen.
"""

from pipeline.abenteuer import treppenrand as T
from pipeline.abenteuer.kartenbau import INHALTE, lade
from pipeline.abenteuer.randzug import umrisse
from pipeline.abenteuer.saum import uebergangsart

BOEDEN = lade(INHALTE / "materialien.json")["boeden"]


def _fest(feld, richtung):
    return True


def _treppe(stufenlaenge: int) -> set:
    """Wasser unter einer Kante, die alle ``stufenlaenge`` Felder um eins nach unten springt."""
    return {(x, y) for x in range(5 * stufenlaenge) for y in range(x // stufenlaenge, 8)}


def test_kacheltreppe_wird_gefunden():
    strecken = T._strecken(umrisse(_treppe(2), _fest)[0])
    assert [stufen for _, stufen in T.treppen(strecken, schraeg=False)] == [4]
    # Ein Rechteck hat keine Treppe.
    rechteck = {(x, y) for x in range(4) for y in range(3)}
    assert T.treppen(T._strecken(umrisse(rechteck, _fest)[0]), schraeg=False) == []


def test_schraegkacheln_zeichnen_nur_die_eins_zu_eins_treppe():
    eins = T._strecken(umrisse(_treppe(1), _fest)[0])
    assert T.treppen(eins, schraeg=True) == [] and T.treppen(eins, schraeg=False) != []
    assert T.treppen(T._strecken(umrisse(_treppe(2), _fest)[0]), schraeg=True) != []


def test_weiche_kanten_sind_keine_treppe():
    strecken = T._strecken(umrisse(_treppe(2), lambda f, r: False)[0])
    assert T.treppen(strecken, schraeg=False) == []


def test_kaimauer_in_stufen_ist_ein_befund_bach_im_gras_nicht():
    zeilen = ["~~~~~~~~", ".~~~~~~~", "..~~~~~~", "...~~~~~", "....~~~~", "........"]
    bach = {"art": "aussen", "raster": zeilen}
    assert T.kacheltreppen("probe", bach, BOEDEN) == []
    kanal = bach | {"ufer": "stein"}
    assert len(T.kacheltreppen("probe", kanal, BOEDEN)) == 1
    assert "Kacheltreppe am Ufer" in T.kacheltreppen("probe", kanal, BOEDEN)[0]


def test_weg_schliesst_am_ziel_gerade_ab():
    szene = {
        "art": "aussen",
        "boeden": {"e": "erde"},
        "raster": [".....", "..e..", "..e..", "eeeee"],
        "ausloeser": [{"feld": [2, 0]}],
    }
    assert T.stirnkanten(szene, {}) == {((2, 1), (0, -1))}
    assert T.stichwege("probe", szene, {}, BOEDEN) == []
    ohne_ziel = szene | {"ausloeser": []}
    assert T.stichwege("probe", ohne_ziel, {}, BOEDEN) == [
        "probe: Weg „e“ endet bei (2, 1) ohne Ziel (Kappe im Rasen)"
    ]


def test_uebergang_belag_an_belag():
    assert uebergangsart(BOEDEN, "pflaster", "asphalt") == "fuge"
    assert uebergangsart(BOEDEN, "asphalt", "pflaster") is None  # je Kante zeichnet eine Seite
    assert uebergangsart(BOEDEN, "pflaster", "schotter") == "verzahnt"
    assert uebergangsart(BOEDEN, "schotter", "pflaster") is None
    assert uebergangsart(BOEDEN, "sandRot", "felsbodenRot") == "verzahnt"
    assert uebergangsart(BOEDEN, "asphalt", "asphaltMitte") is None  # derselbe Belag
    assert uebergangsart(BOEDEN, "pflaster", "gras") is None  # dort liegt der Randstein
    assert uebergangsart(BOEDEN, "pflaster", "wasser") is None
    assert uebergangsart(BOEDEN, "erde", "dielen") is None


def test_gerade_kante_ohne_uebergang_ist_ein_befund():
    szene = {"art": "aussen", "boeden": {"p": "pflaster", "x": "hallenboden"}, "raster": ["ppxx", "ppxx"]}
    assert T.belagkanten("probe", szene, BOEDEN) == [
        "probe: hallenboden stößt bei (1, 0) ohne Übergang an pflaster"
    ]
    assert T.belagkanten("probe", szene | {"boeden": {"p": "pflaster", "x": "asphalt"}}, BOEDEN) == []


def test_keine_kacheltreppen_und_keine_nackten_belagkanten():
    # Dauertest über alle Szenen: „0 Befunde“ (Ausnahmen mit Grund in treppenrand.GEPRUEFT).
    assert T.alle_befunde() == []
