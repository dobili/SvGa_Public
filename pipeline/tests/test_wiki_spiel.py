"""Tests für das Wiki des Spiels (Wunsch des Autors, 17.11.2026): Seiten da, eindeutig, ohne
Romantexte, Buchbefunde oder zu lange Seiten."""

from __future__ import annotations

from collections import Counter
from pathlib import Path

from pipeline.wiki import LAENGSTE_SEITE
from pipeline.wiki_spiel import aufrufe, baue_spielseiten, dateikopf, erster_absatz

SEITEN = baue_spielseiten()


def test_seiten_eindeutig_und_in_beiden_bereichen() -> None:
    assert len(SEITEN) > 40
    assert not [p for p, n in Counter(s.pfad for s in SEITEN).items() if n > 1]
    assert {s.bereich for s in SEITEN} == {"projekt", "code"}
    assert all(len(s.inhalt) <= LAENGSTE_SEITE for s in SEITEN)


def test_wichtige_seiten_da() -> None:
    pfade = {s.pfad for s in SEITEN}
    for pfad in (
        "projekt/ueberblick",
        "projekt/story-bibel",
        "projekt/welt",
        "projekt/regelwerk",
        "projekt/kartenregeln",
        "projekt/karteneditor",
        "projekt/fortschritt",
        "code/begriffe",
        "code/oberwelt",
        "code/dialog-und-ink",
        "code/ton",
        "code/paket-und-daten",
        "code/regeln-und-spielstand",
        "code/kartenbau",
        "code/pruefwerkzeuge",
        "code/simulation-und-lesefassung",
        "code/karteneditor",
        "code/module-oberwelt",
        "code/werkzeuge-pruefungen",
    ):
        assert pfad in pfade, pfad
    assert any(p.startswith("entscheidungen/") for p in pfade)


def test_keine_romantexte_und_keine_buchbefunde() -> None:
    for seite in SEITEN:
        assert not seite.quelle.startswith("docs/spiel/roman"), seite.pfad
        assert "buchbefund" not in seite.titel.lower(), seite.pfad
        for zeile in seite.inhalt.splitlines():
            assert not zeile.lstrip().startswith(("- **Buchbefund", "- **Befund an den Autor")), seite.pfad


def test_story_bibel_nur_kern_und_szenentitel() -> None:
    bibel = next(s for s in SEITEN if s.pfad == "projekt/story-bibel")
    voll = (Path(__file__).resolve().parents[2] / "docs" / "spiel" / "05_Story_Bibel.md").read_text(
        encoding="utf-8"
    )
    assert len(bibel.inhalt) < len(voll) / 5
    assert "Der Kern von Akt 1" in bibel.inhalt
    assert "- **1. Ankunft**" in bibel.inhalt
    assert "## 2. Figuren" not in bibel.inhalt


def test_dateikopf_und_aufruf(tmp_path: Path) -> None:
    ts = tmp_path / "a.ts"
    ts.write_text(
        "/**\n * Erster Satz\n * geht weiter.\n *\n * Zweiter Absatz.\n */\nexport {};\n", encoding="utf-8"
    )
    assert erster_absatz(dateikopf(ts)) == "Erster Satz geht weiter."
    cjs = tmp_path / "b.cjs"
    cjs.write_text("// Kopf.\n//\n// Aufruf:\n//   node b.cjs --x\n'use strict';\n", encoding="utf-8")
    assert aufrufe(dateikopf(cjs)) == ["Aufruf:\n  node b.cjs --x"]
    py = tmp_path / "c.py"
    py.write_text('"""Zweck.\n\nAufruf: ``python -m c``."""\n', encoding="utf-8")
    assert aufrufe(dateikopf(py)) == ["Aufruf: ``python -m c``."]
