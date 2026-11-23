"""Tests der Ortsthemen mit Spuren (Klangplan A0, A0.1): Pläne, spuren.json, Hörseite.

Ohne numpy (GitHub Actions) laufen die reinen Planprüfungen; spurenliste braucht nur den Satzplan.
"""

from pipeline.abenteuer.ton.musikbau import spurenliste, stamm
from pipeline.abenteuer.ton.satzplan import baue, linie, tonart
from pipeline.abenteuer.ton.stuecke import alle

SPUREN = ("grund", "melodie", "zusatz")
ZUSATZARTEN = {"farbe", "steigerung", "musiker", "jukebox"}
OKTAVE = 12
SEKUNDEN_HOECHSTENS = 90


def _mit_spuren():
    return [s for s in alle() if s.spuren]


def test_jede_stimme_liegt_in_genau_einer_spur():
    for satz in _mit_spuren():
        assert tuple(satz.spuren) == SPUREN, satz.kennung
        indizes = sorted(i for g in satz.spuren.values() for i in g)
        assert indizes == list(range(len(satz.stimmen))), satz.kennung
        assert satz.zusatz in ZUSATZARTEN, satz.kennung


def test_akt1_ist_umgestellt_mit_nacht_und_innen():
    kennungen = {s.kennung for s in _mit_spuren() if s.akt == 1}
    erwartet = {
        "mapleFalls",
        "mapleFalls.nacht",
        "mapleFalls.innen",
        "cedarCreek",
        "cedarCreek.nacht",
        "diner",
    }
    assert erwartet <= kennungen
    assert {"mapleFalls.clubkampf", "cedarCreek.clubkampf"} <= kennungen


def test_schleifen_sind_hoechstens_90_sekunden():
    for satz in _mit_spuren():
        stueck = baue(satz)
        assert stueck.sekunden(stueck.ende()) <= SEKUNDEN_HOECHSTENS, satz.kennung


def test_koepfe_von_akt1_halten_die_bauregeln():
    from pipeline.abenteuer.ton.stuecke import akt1, cedar, maple

    for kopf, name in ((maple.KOPF, "G"), (cedar.KOPF, "d"), (akt1.DINER_KOPF, "C")):
        noten, _ = linie(kopf.replace("|", " "), tonart(name), 0, 1, 60)
        hoehen = [n.tonhoehe for n in noten]
        assert 4 <= len(noten) <= 7 and max(hoehen) - min(hoehen) <= OKTAVE, kopf


def test_akt2_bis_akt4_sind_umgestellt():
    kennungen = {s.kennung for s in _mit_spuren()}
    erwartet = {
        "riverton",
        "riverton.nacht",
        "ironwood",
        "ironwood.nacht",
        "riverton.clubkampf",
        "ironwood.clubkampf",
        "siliconBay",
        "siliconBay.nacht",
        "portDelacroix",
        "portDelacroix.nacht",
        "desertSprings",
        "desertSprings.nacht",
        "siliconBay.clubkampf",
        "desertSprings.clubkampf",
        "summitCity",
        "summitCity.nacht",
        "hochebene",
        "hochebene.nacht",
        "summitCity.clubkampf",
        "arena.vorrunde",
        "arena",
    }
    assert erwartet <= kennungen


def test_koepfe_von_akt2_bis_akt4_halten_die_bauregeln():
    from pipeline.abenteuer.ton.stuecke import (
        akt2_ironwood,
        akt2_riverton,
        akt3_delacroix,
        akt3_desert,
        akt3_siliconbay,
        akt4_summit,
        akt4_wege,
    )

    koepfe = (
        (akt2_riverton.KOPF, "c"),
        (akt2_ironwood.KOPF, "f"),
        (akt3_siliconbay.KOPF, "G"),
        (akt3_delacroix.KOPF, "G"),
        (akt3_delacroix.FAEHRE_KOPF, "D"),
        (akt3_desert.KOPF, "E"),
        (akt4_summit.KOPF, "D"),
        (akt4_wege.KOPF, "D"),
    )
    for kopf, name in koepfe:
        noten, _ = linie(kopf.replace("|", " "), tonart(name), 0, 1, 60)
        hoehen = [n.tonhoehe for n in noten]
        assert 4 <= len(noten) <= 7 and max(hoehen) - min(hoehen) <= OKTAVE, kopf


def test_rueckblicke_zitieren_die_neuen_koepfe():
    # Die Zitate in Akt 4 kommen aus den Ortsthemen selbst; Moll wird nach G-Dur umgeschrieben.
    from pipeline.abenteuer.ton.stuecke import akt4_koepfe as koepfe
    from pipeline.abenteuer.ton.stuecke import maple

    assert koepfe.MAPLE.zwei.melodie == maple.KOPF
    assert koepfe.moll_in_dur("1:1 3:1 #7,:1 6:1/2") == "1:1 b3:1 7,:1 b6:1/2"
    assert koepfe.akkorde_in_dur("i | VI | III V7") == "i | bVI | bIII V7"
    assert "#4" not in koepfe.SILICON.dur.melodie and "#4" in koepfe.SILICON.eigen.melodie


def test_spurenliste_nennt_spuren_zusatz_und_laenge():
    liste = spurenliste(alle())
    eintrag = liste[stamm("mapleFalls")]
    assert eintrag["spuren"] == list(SPUREN) and eintrag["zusatz"] == "farbe"
    assert eintrag["proben"] == 50 * 44_100 and eintrag["rate"] == 44_100


def test_spurenrate_wie_sampler():
    import pytest

    pytest.importorskip("numpy")
    pytest.importorskip("scipy")  # sampler.py braucht scipy; fehlt in der schlanken Umgebung
    from pipeline.abenteuer.ton.musikbau import SPUREN_RATE
    from pipeline.abenteuer.ton.sampler import ABTASTRATE

    assert SPUREN_RATE == ABTASTRATE


def test_lautheit_in_spuren_json_bleibt_beim_neuschreiben(tmp_path):
    import json

    from pipeline.abenteuer.ton.musikbau import schreibe_spurenliste, trage_lautheit_ein

    plaene = alle()
    ziel = schreibe_spurenliste(tmp_path, plaene)
    lufs = {"grund": -29.0, "grund+melodie": -18.3, "grund+melodie+zusatz": -18.0}
    trage_lautheit_ein(tmp_path, "maple-falls", lufs)
    schreibe_spurenliste(tmp_path, plaene)
    assert json.loads(ziel.read_text(encoding="utf-8"))["maple-falls"]["lufs"] == lufs
