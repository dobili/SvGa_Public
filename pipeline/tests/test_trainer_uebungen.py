"""Tests der Engine-Gegenprüfung der Übungen: Urteil ohne Engine, ein Lauf mit Engine (übersprungen ohne)."""

import chess
import pytest

from pipeline.trainer.engine import Zugwert, engine_vorhanden
from pipeline.trainer.uebungen import beurteile, lies_uebungen

# Übung 5 (Abb. 1.41), Weiß am Zug: Buch 1. cxd5, akzeptiert 1. exd5.
ABB_1_41 = "r1bq1rk1/pp1nbppp/2p1p3/3p4/2PPP3/2N5/PP2BPPP/R1BQ1RK1 w - - 0 1"


def _werte(brett: chess.Board, paare: list[tuple[str, float, int | None]]) -> list[Zugwert]:
    return [Zugwert(brett.parse_san(san), san, wert, matt, 20) for san, wert, matt in paare]


def test_buchzug_haelt_und_gleichwertiger_zug_schon_akzeptiert():
    brett = chess.Board(ABB_1_41)
    zuege = _werte(brett, [("cxd5", 0.8, None), ("exd5", 0.7, None), ("e5", 0.3, None), ("a3", -0.5, None)])
    urteil = beurteile(zuege, brett.parse_san("cxd5"), [brett.parse_san("exd5")])
    assert urteil.urteil == "haelt"
    assert urteil.vorschlag_akzeptiert == []
    assert urteil.akzeptiert_fraglich == []
    assert urteil.einziger_zug is False
    assert [z.status for z in urteil.zuege] == ["buch", "akzeptiert", "schwaecher", "widerlegt"]


def test_gleichwertiger_zug_wird_vorgeschlagen_und_einziger_zug_erkannt():
    brett = chess.Board(ABB_1_41)
    zuege = _werte(brett, [("cxd5", 0.8, None), ("e5", 0.6, None), ("a3", -0.5, None)])
    urteil = beurteile(zuege, brett.parse_san("cxd5"), [])
    assert urteil.vorschlag_akzeptiert == ["e5"]
    assert urteil.einziger_zug is False
    allein = _werte(brett, [("cxd5", 0.8, None), ("e5", -0.4, None)])
    assert beurteile(allein, brett.parse_san("cxd5"), []).einziger_zug is True


def test_matt_schlaegt_alles_und_laengeres_matt_ist_schwaecher():
    brett = chess.Board("6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1")
    zuege = _werte(brett, [("Ra8#", 99.0, 1), ("Rb1", 3.0, None)])
    widerlegt = beurteile(zuege, brett.parse_san("Rb1"), [])
    assert widerlegt.urteil == "widerlegt"
    assert widerlegt.vorschlag_akzeptiert == []
    laenger = _werte(brett, [("Ra8#", 99.0, 1), ("Rb1", 97.0, 3)])
    zwei_laenger = beurteile(laenger, brett.parse_san("Rb1"), [])
    assert zwei_laenger.urteil == "schwaecher" and zwei_laenger.verlust == 1.0
    gleich_lang = _werte(brett, [("Ra8#", 99.0, 1), ("Rb1", 99.0, 1)])
    assert beurteile(gleich_lang, brett.parse_san("Rb1"), []).vorschlag_akzeptiert == ["Ra8#"]


def test_in_gewonnener_stellung_sind_gewinnzuege_gleichwertig():
    brett = chess.Board(ABB_1_41)
    zuege = _werte(brett, [("cxd5", 8.9, None), ("exd5", 6.7, None), ("e5", 0.3, None)])
    urteil = beurteile(zuege, brett.parse_san("exd5"), [])
    assert urteil.urteil == "gleichwertig" and urteil.vorschlag_akzeptiert == ["cxd5"]
    assert [z.status for z in urteil.zuege] == ["gleichwertig", "buch", "widerlegt"]
    # Ein gleichwertiger Gewinnzug schließt „einziger Zug“ aus, auch bei großem Abstand.
    gewonnen = beurteile(zuege, brett.parse_san("cxd5"), [])
    assert gewonnen.einziger_zug is False and gewonnen.abstand_zweiter == 2.2


def test_akzeptierter_zug_der_schwaecher_ist_wird_gemeldet():
    brett = chess.Board(ABB_1_41)
    zuege = _werte(brett, [("cxd5", 0.8, None), ("exd5", 0.1, None)])
    urteil = beurteile(zuege, brett.parse_san("cxd5"), [brett.parse_san("exd5")])
    assert urteil.akzeptiert_fraglich == ["exd5"]


def test_uebungen_lesen():
    uebungen = lies_uebungen()
    assert len(uebungen) == 86
    fuenf = next(u for u in uebungen if u.nummer == 5)
    assert fuenf.fen == ABB_1_41 and fuenf.loesung.startswith("1. cxd5") and fuenf.akzeptiert == ["1. exd5"]


@pytest.mark.skipif(not engine_vorhanden(), reason="Engine fehlt: cd app && npm ci")
def test_mit_engine_uebung_36_grundreihenmatt():
    from pipeline.trainer.engine import Engine
    from pipeline.trainer.uebungen import pruefe_uebung

    uebung = next(u for u in lies_uebungen() if u.nummer == 36)
    with Engine() as engine:
        eintrag = pruefe_uebung(engine, uebung)
    assert eintrag["art"] == "zug" and eintrag["buchzug"] == "Rd8#"
    assert eintrag["urteil"] == "haelt" and eintrag["einzigerZug"] is True
