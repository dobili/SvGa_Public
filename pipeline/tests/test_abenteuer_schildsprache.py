"""Dauertest der Schildsprache (pipeline/abenteuer/schildsprache.py, RO53.6): Namen englisch,
Hinweise deutsch, jede Aufschrift eingeordnet. Die Werkzeuge im privaten Paket prüft der zweite
Test nur, wenn das Paket da ist (SVGA_PRIVAT oder schach-abenteuer-inhalte neben dem Repository).
"""

import os
from pathlib import Path

import pytest

from pipeline.abenteuer import schildsprache as S

PRIVAT = Path(
    os.environ.get("SVGA_PRIVAT") or Path(__file__).resolve().parents[2].parent / "schach-abenteuer-inhalte"
)


def test_schildbild_ohne_befund():
    assert S.befunde(None) == []


@pytest.mark.skipif(not (PRIVAT / "werkzeuge").is_dir(), reason="privates Paket fehlt")
def test_werkzeuge_ohne_befund():
    assert S.befunde(PRIVAT) == []


def test_aufschrift_erkennen():
    assert S.ist_aufschrift("STORE")
    assert not S.ist_aufschrift("15.20.08")
    assert not S.ist_aufschrift("PD")
    assert not S.ist_aufschrift("DRHRD")
    assert not S.ist_aufschrift("FFFEMM......")


def test_deutscher_name_ist_befund(monkeypatch):
    monkeypatch.setattr(S, "NAMEN", S.NAMEN | {"WASCHSALON"})
    monkeypatch.setattr(
        S, "aufschriften", lambda privat: {"WASCHSALON": {"probe.py"}, "GESPERRT": {"probe.py"}}
    )
    assert S.befunde(None) == ["„WASCHSALON“ (probe.py) ist ein Name, aber deutsch"]


def test_neue_aufschrift_ist_befund(monkeypatch):
    monkeypatch.setattr(S, "aufschriften", lambda privat: {"NEUER LADEN": {"probe.py"}})
    assert "nicht eingeordnet" in S.befunde(None)[0]
