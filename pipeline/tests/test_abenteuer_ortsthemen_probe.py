"""Tests für das Probestück einprägsame Ortsthemen (Klangplan A0): Kopf nach den Bauregeln, Pläne bauen."""

import pytest

from pipeline.abenteuer.ton.ortsthemenprobe import notenzeile
from pipeline.abenteuer.ton.satzplan import baue, linie, tonart
from pipeline.abenteuer.ton.stuecke.ortsthemen_probe import CEDAR_KOPF, MAPLE_KOPF, STUECKE

OKTAVE = 12
TAKTE_KOPF = 2
SCHLAEGE_JE_TAKT = 4


def _noten(kopf: str, name: str):
    noten, laenge = linie(kopf.replace("|", " "), tonart(name), 0, 1, 60)
    return noten, laenge


def test_koepfe_halten_die_bauregeln():
    for kopf, name in ((MAPLE_KOPF, "G"), (CEDAR_KOPF, "d")):
        noten, laenge = _noten(kopf, name)
        hoehen = [n.tonhoehe for n in noten]
        assert 4 <= len(noten) <= 7
        assert max(hoehen) - min(hoehen) <= OKTAVE
        assert laenge == TAKTE_KOPF * SCHLAEGE_JE_TAKT
        # Erst steigend: der höchste Ton liegt nicht am Anfang.
        assert hoehen.index(max(hoehen)) > 0


def test_alle_probeplaene_bauen_und_schleifen_dauern_30_bis_80_sekunden():
    for satz in STUECKE:
        stueck = baue(satz)
        sekunden = stueck.sekunden(stueck.ende())
        if satz.schleife:
            assert 30 <= sekunden <= 80, satz.kennung


def test_notenzeile_ist_ein_svg_mit_tonnamen():
    svg = notenzeile(MAPLE_KOPF, "G")
    assert svg.startswith("<svg") and ">H<" in svg and ">G<" in svg


def test_spuren_gruppen_decken_alle_stimmen_genau_einmal():
    from pipeline.abenteuer.ton.stuecke.ortsthemen_probe import (
        CLUBKAMPF_SPUREN,
        KAMPF_GRUPPEN,
        MAPLE_GRUPPEN,
        MAPLE_SPUREN,
    )

    for satz, gruppen in ((MAPLE_SPUREN, MAPLE_GRUPPEN), (CLUBKAMPF_SPUREN, KAMPF_GRUPPEN)):
        indizes = sorted(i for g in gruppen.values() for i in g)
        assert indizes == list(range(len(satz.stimmen)))


def test_gemeinsame_verstaerkung_und_speicher():
    np = pytest.importorskip("numpy")  # in Actions nicht installiert

    from pipeline.abenteuer.ton.spuren import _gemeinsam_angeglichen, puffer_mb

    a = np.full((100, 2), 0.2, dtype=np.float32)
    b = np.full((100, 2), 0.1, dtype=np.float32)
    aus = _gemeinsam_angeglichen({"a": a, "b": b})
    # Gleiches Verhältnis der Spuren: dieselbe Verstärkung für beide.
    assert np.allclose(aus["a"] / aus["b"], 2.0)
    assert round(puffer_mb(50), 1) == 19.2
