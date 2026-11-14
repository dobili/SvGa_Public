"""Tests für den Arrangeur der Spielmusik (harmonie, muster, satzplan, stuecke), ohne numpy.

Warum: Jeder Satzplan muss sich bauen lassen, und jede Melodiezeile muss ihren Teil genau füllen;
sonst verrutscht die Melodie gegen die Akkorde. Die Akkordlehre prüft an Beispielen aus G-Dur.
"""

import pytest

from pipeline.abenteuer.ton.harmonie import akkord, griff, lage
from pipeline.abenteuer.ton.motive import tonhoehe
from pipeline.abenteuer.ton.musikbau import dateiname
from pipeline.abenteuer.ton.muster import MUSTER, Abschnitt
from pipeline.abenteuer.ton.rhythmus import RHYTHMEN
from pipeline.abenteuer.ton.satzplan import MELODIE, NOTEN, baue, linie, rollenpegel, tonart
from pipeline.abenteuer.ton.schlagwerk import SCHLAEGE
from pipeline.abenteuer.ton.stuecke import alle

G_DUR = tonart("G")
G, H, D, C, E, FIS = 7, 11, 2, 0, 4, 6
TIEFSTE_NOTE, HOECHSTE_NOTE = 21, 108


def test_akkorde_in_g_dur():
    assert akkord("I", G_DUR).klassen() == {G, H, D}
    assert akkord("IV", G_DUR).klassen() == {C, E, G}
    assert akkord("vi", G_DUR).klassen() == {E, G, H}
    assert akkord("V7", G_DUR).klassen() == {D, FIS, 9, C}
    assert akkord("bVII", G_DUR).klassen() == {5, 9, C}
    assert akkord("N.C.", G_DUR) is None
    with pytest.raises(ValueError):
        akkord("X", G_DUR)


def test_basston_nach_schraegstrich():
    assert akkord("I/3", G_DUR).bass % 12 == H


def test_griff_und_lage():
    assert griff(akkord("I", G_DUR)) == (43, 50, 55, 59, 62, 67)
    assert lage(akkord("IV", G_DUR), 64) == (60, 64, 67)


def test_tonart_deutsche_namen():
    assert tonart("d").grundton == 50 and tonart("B").grundton == 58 and tonart("H").grundton == 59


def test_linie_mit_pause_und_triole():
    noten, dauer = linie("1:1 r:1 5:1/3 5:1/3 5:1/3 >1':1", G_DUR, 0, 1, 50)
    assert dauer == pytest.approx(4)
    assert [n.tonhoehe for n in noten] == [tonhoehe("1") + 12, 74, 74, 74, 79]
    assert noten[-1].staerke > noten[0].staerke


def test_dateiname_wie_in_der_app():
    assert dateiname("mapleFalls.club") == "maple-falls.club.m4a"
    assert dateiname("ambrose.lassMich") == "ambrose.lass-mich.m4a"


@pytest.mark.parametrize("name", sorted(MUSTER))
def test_muster_bleiben_im_abschnitt(name):
    a = Abschnitt(akkord("vi", G_DUR), 8.0, 4.0, 4, akkord("IV", G_DUR), 2)
    noten = MUSTER[name](a)
    assert noten, name
    assert all(8.0 - 0.01 <= n.beginn < 12.0 for n in noten), name
    assert all(TIEFSTE_NOTE <= n.tonhoehe <= HOECHSTE_NOTE for n in noten), name


@pytest.mark.parametrize("name", sorted(RHYTHMEN))
def test_rhythmen_nutzen_vorhandene_schlaege(name):
    for takt in range(4):
        assert all(n.tonhoehe in SCHLAEGE for n in RHYTHMEN[name](0.0, 4, takt, 50))


@pytest.mark.parametrize("satz", alle(), ids=lambda s: s.kennung)
def test_jeder_satzplan_laesst_sich_bauen(satz):
    stueck = baue(satz)
    assert stueck.laenge == sum(len(satz.teile[n].akkorde.split("|")) for n in satz.form) * satz.taktart
    for spur in stueck.spuren:
        assert all(n.beginn < stueck.laenge for n in spur.noten), (satz.kennung, spur.instrument)


@pytest.mark.parametrize("satz", alle(), ids=lambda s: s.kennung)
def test_jede_stimme_spielt_etwas(satz):
    stueck = baue(satz)
    for stimme, spur in zip(satz.stimmen, stueck.spuren, strict=True):
        assert spur.noten, (satz.kennung, stimme.instrument, stimme.rolle)


def test_kennungen_sind_eindeutig():
    kennungen = [s.kennung for s in alle()]
    assert len(kennungen) == len(set(kennungen))


def test_melodie_liegt_vor_der_begleitung():
    assert rollenpegel(MELODIE) > rollenpegel(NOTEN) > rollenpegel("zupfen") > rollenpegel("besen")
