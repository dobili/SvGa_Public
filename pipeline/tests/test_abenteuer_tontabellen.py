"""Tests für die Tontabellen des Abenteuers: einmalige Stücke (musikbau) und Anhebung (klangpegel).

Warum: Der Tonspieler der App liest ``musik/einmal.json`` und ``klang/pegel.json``
(``app/src/abenteuer/ton/tonangaben.ts``). Ein einmaliges Stück, das fehlt, liefe als Schleife;
eine zu große Anhebung höbe das Rauschen der Aufnahme an. Ohne ffmpeg, ohne Rendern.
"""

import json

from pipeline.abenteuer.ton.klangpegel import HOECHSTENS_DB, ausgleich, finde, mittel_aus
from pipeline.abenteuer.ton.musikbau import einmalliste, schreibe_einmalliste, stamm
from pipeline.abenteuer.ton.stuecke import alle


def test_einmalliste_enthaelt_genau_die_stuecke_ohne_schleife():
    plaene = alle()
    liste = einmalliste(plaene)
    assert liste == sorted(liste)
    assert stamm("ambrose.walzer") in liste
    assert all(stamm(s.kennung) not in liste for s in plaene if s.schleife)
    assert len(liste) == len({s.kennung for s in plaene if not s.schleife})


def test_einmalliste_landet_im_musikordner(tmp_path):
    ziel = schreibe_einmalliste(tmp_path, alle())
    assert ziel == tmp_path / "spiel" / "musik" / "einmal.json"
    assert json.loads(ziel.read_text(encoding="utf-8")) == einmalliste(alle())


def test_stamm_wie_in_der_app():
    assert stamm("mapleFalls.club") == "maple-falls.club"


def test_ausgleich_bis_zum_ziel_hoechstens_acht_db():
    assert ausgleich(-27.7) == 3.7
    assert ausgleich(-37.3) == HOECHSTENS_DB
    assert ausgleich(-20.0) == 0.0


def test_mittlere_lautheit_aus_volumedetect():
    ausgabe = "[Parsed_volumedetect_0 @ 0x1] mean_volume: -34.0 dB\n[...] max_volume: -3.8 dB"
    assert mittel_aus(ausgabe) == -34.0


def test_finde_sucht_auch_in_den_aktordnern(tmp_path):
    (tmp_path / "akt2").mkdir()
    (tmp_path / "akt2" / "kerze.m4a").write_bytes(b"")
    assert finde(tmp_path, "kerze") == tmp_path / "akt2" / "kerze.m4a"
