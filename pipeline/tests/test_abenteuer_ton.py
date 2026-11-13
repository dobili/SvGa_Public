"""Tests für die Leitmotive und Hörproben (pipeline/abenteuer/ton), ohne numpy und ohne Proben.

Warum: Die Verwandtschaften der Motive aus dem Klangplan (docs/spiel/21_Klangplan.md, A1) dürfen
beim Ändern eines Motivs nicht verloren gehen. Die Tests prüfen sie an den Tönen in G-Dur.
"""

import pytest

from pipeline.abenteuer.ton import motive
from pipeline.abenteuer.ton.hoerproben import ALLE
from pipeline.abenteuer.ton.instrumente import INSTRUMENTE, tonhoehe_aus_namen
from pipeline.abenteuer.ton.maple_falls import AKKORDFOLGE, maple_falls
from pipeline.abenteuer.ton.midi import midi_bytes, zahl_variabel
from pipeline.abenteuer.ton.satz import mit_vorschlag, setze

D4, H3, CIS4, A3, G3, C4 = 62, 59, 61, 57, 55, 60


def test_stufen_in_g_dur():
    assert motive.tonhoehe("1") == G3
    assert motive.tonhoehe("#4") == CIS4
    assert motive.tonhoehe("1'") == G3 + 12
    assert motive.tonhoehe("5,") == D4 - 12
    with pytest.raises(ValueError):
        motive.tonhoehe("8")


def test_ambroses_kopf_und_victor_haben_dieselben_toene():
    assert motive.toene(motive.AMBROSE_KOPF) == [D4, H3, CIS4, A3]
    assert motive.toene(motive.VICTOR) == motive.toene(motive.AMBROSE_KOPF)
    assert set(motive.VICTOR.dauern) == {0.5}


def test_konzernton_ist_der_fremde_ton():
    assert motive.toene(motive.KONZERN) == [CIS4]


def test_ambrose_rein_ohne_fremden_ton():
    toene = motive.toene(motive.AMBROSE_REIN)
    assert CIS4 not in toene and C4 in toene
    assert toene[-1] == G3


def test_held_beginnt_auf_ambroses_offener_2_und_steigt_zu_seinem_anfang():
    held = motive.toene(motive.HELD)
    kopf = motive.toene(motive.AMBROSE_KOPF)
    assert held[0] == kopf[-1] and held[-1] == kopf[0]
    assert motive.toene(motive.HELD_VOLLSTAENDIG)[-1] == G3


def test_maple_falls_beginnt_mit_mamas_kopf():
    assert motive.toene(motive.MAPLE_FALLS_KOPF) == motive.toene(motive.MAMA)[:4]


def test_vorschlag_haelt_die_4_auf_ihrem_schlag():
    noten = mit_vorschlag(setze(motive.AMBROSE_KOPF, 0), 2, D4)
    cis = [n for n in noten if n.tonhoehe == CIS4][0]
    assert cis.beginn == 3
    assert len(noten) == len(motive.AMBROSE_KOPF.stufen) + 1


def test_hoerproben_sind_kurz_und_nutzen_bekannte_instrumente():
    stuecke = [erzeuge() for erzeuge in ALLE] + [maple_falls()]
    assert len({s.kennung for s in stuecke}) == len(stuecke)
    for stueck in stuecke:
        assert all(spur.instrument in INSTRUMENTE for spur in stueck.spuren)
        assert 3 < stueck.sekunden(stueck.ende()) < 50


def test_maple_falls_dauert_30_bis_45_sekunden():
    stueck = maple_falls()
    assert 30 <= stueck.sekunden(stueck.ende()) <= 46
    assert len(AKKORDFOLGE) * 4 <= stueck.ende() < len(AKKORDFOLGE) * 4 + 1


def test_dateinamen_der_bibliotheken():
    assert tonhoehe_aus_namen("Upright1_Sus_C3_vl2_rr1.wav", INSTRUMENTE["klavier_alt"]) == (C4, 2)
    assert tonhoehe_aus_namen("JHPiano_Sus_Close_C4_vl3_rr1.wav", INSTRUMENTE["klavier"]) == (C4, 3)
    assert tonhoehe_aus_namen("glock_soft_C5_02.wav", INSTRUMENTE["glockenspiel"]) == (84, 0)
    assert tonhoehe_aus_namen("Upright1_Rel_C3_vl2_rr1.wav", INSTRUMENTE["klavier_alt"]) is None


def test_midi_datei():
    daten = midi_bytes(maple_falls())
    assert daten.startswith(b"MThd")
    assert daten.count(b"MTrk") == len(maple_falls().spuren) + 1
    assert zahl_variabel(480) == b"\x83\x60"
    assert zahl_variabel(0) == b"\x00"
