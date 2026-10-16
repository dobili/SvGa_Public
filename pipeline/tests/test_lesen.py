"""Tests für das Lesen der LaTeX-Quellen (Schritt 1 der Pipeline).

Die Tests nutzen ein eigenes kleines Testkapitel (``beispiel/kap09_testkapitel.tex``),
damit kein Buchtext im Repository liegt (CLAUDE.md, Regel 2).
"""

from pathlib import Path

import pytest

from pipeline.lesen.diagramme import lies_kapitel
from pipeline.lesen.latex import LatexFehler, entferne_kommentare, lies_gruppe
from pipeline.lesen.text import als_klartext, wandle_text

BEISPIEL = Path(__file__).parent / "beispiel" / "kap09_testkapitel.tex"


def test_kommentare_entfernen_behaelt_zeilen():
    assert entferne_kommentare("a % Notiz\nb \\% c") == "a \nb \\% c"


def test_gruppe_verschachtelt():
    assert lies_gruppe("{a{b}c}d", 0) == ("a{b}c", 7)


def test_optionales_argument_mit_geschweiften_klammern():
    inhalt, ende = lies_gruppe("[x {]} y]z", 0, "[", "]")
    assert inhalt == "x {]} y"
    assert ende == 9


def test_gruppe_ohne_ende_meldet_fehler():
    with pytest.raises(LatexFehler):
        lies_gruppe("{offen", 0)


def test_unterschrift_mit_stilen_und_zuegen():
    ergebnis = wandle_text("Nach 2. Lf4 -- \\textbf{Ziel 1}: \\zugfolge{Dxf7\\#}", "test:1")
    assert [t.als_daten() for t in ergebnis.teile] == [
        {"art": "text", "text": "Nach 2. Lf4 – ", "stil": "normal"},
        {"art": "text", "text": "Ziel 1", "stil": "fett"},
        {"art": "text", "text": ": ", "stil": "normal"},
        {"art": "zug", "text": "Dxf7#"},
    ]
    assert ergebnis.befunde == []


def test_anfuehrungszeichen_verweise_und_mathe():
    ergebnis = wandle_text("\\glqq gut\\grqq{} \\abb{1.15}, $-$3", "test:1")
    assert als_klartext(ergebnis.teile) == "„gut“ Abb. 1.15, −3"
    assert ergebnis.teile[1].abbildung == "1.15"


def test_unbekannter_befehl_wird_gemeldet_nicht_geraten():
    ergebnis = wandle_text("Text \\foo{bar}", "test:7")
    assert [b.kennung for b in ergebnis.befunde] == ["latex-unbekannt"]
    assert "\\foo" in als_klartext(ergebnis.teile)


def test_kapitel_lesen():
    kapitel = lies_kapitel(BEISPIEL)
    assert kapitel.nummer == 9
    assert kapitel.titel == "Ein Testkapitel"
    assert [a.nummer for a in kapitel.abschnitte] == ["9.1", "9.2"]
    nummern = [d.nummer for d in kapitel.diagramme]
    assert nummern == ["9.1", "9.2", "9.3", "9.4"]


def test_diagramm_argumente_und_zusammenhang():
    diagramme = {d.nummer: d for d in lies_kapitel(BEISPIEL).diagramme}
    erstes = diagramme["9.1"]
    assert erstes.fen.startswith("rnbqkbnr/pppppppp/8/8/4P3")
    assert [(p.farbe, p.von, p.nach) for p in erstes.pfeile] == [("gold", "e2", "e4")]
    assert [(f.farbe, f.feld) for f in erstes.felder] == [("gold", "e4"), ("grau", "d5")]
    assert erstes.abschnitt.label == "sec:k9-erster"
    assert erstes.zeile == 8
    assert diagramme["9.2"].reihe == diagramme["9.3"].reihe == 1
    assert diagramme["9.2"].unterabschnitt == "Eine Reihe"
    assert diagramme["9.4"].art == "vorsicht"
    assert diagramme["9.4"].abschnitt.nummer == "9.2"


def test_abschnitte_mit_kurztitel_werden_mitgezaehlt():
    # \section[kurz]{lang} wie in Kapitel 2, 4, 5 und 6 des Buches: zählt wie jeder Abschnitt.
    from pipeline.lesen.diagramme import _strukturereignisse
    from pipeline.lesen.quellen import Quelldatei, abschnittsnummer

    text = "\\section{Eins}\nA\n\\section[Kurz]{Zwei: lang}\nB\n\\section{Drei}\nC"
    abschnitte = [e.abschnitt for e in _strukturereignisse(text, 6) if e.art == "section"]
    assert [(a.nummer, a.titel) for a in abschnitte if a] == [
        ("6.1", "Eins"),
        ("6.2", "Zwei: lang"),
        ("6.3", "Drei"),
    ]
    quelle = Quelldatei("kap06_test.tex", text)
    assert abschnittsnummer(quelle, text.index("C")) == "6.3"
