"""Tests: Züge im Klartext der Bildunterschriften erkennen (Vorarbeit für AP 18)."""

from pipeline.lesen.klartextzuege import markiere_klartextzuege, zaehle_klartextzuege
from pipeline.lesen.text import als_klartext, wandle_text


def _teile(latex: str) -> list[tuple[str, str]]:
    teile = markiere_klartextzuege(wandle_text(latex, "test.tex:1").teile)
    return [(teil.art, teil.text) for teil in teile]


def test_nach_zug_wird_zugteil():
    assert _teile(r"Nach 2. Lf4 -- \textbf{Ziel 1}: Der Bauer") == [
        ("text", "Nach "),
        ("zug", "2. Lf4"),
        ("text", " – "),
        ("text", "Ziel 1"),
        ("text", ": Der Bauer"),
    ]


def test_zugfolge_mit_schwarz_und_zeichen_endet_am_ersten_wort():
    assert _teile("Nach 4. Sc3! Lc5 5. Sd5! steht Weiß besser.") == [
        ("text", "Nach "),
        ("zug", "4. Sc3! Lc5 5. Sd5!"),
        ("text", " steht Weiß besser."),
    ]
    assert _teile("Nach 5... Db6, Weiß am Zug.") == [
        ("text", "Nach "),
        ("zug", "5... Db6"),
        ("text", ", Weiß am Zug."),
    ]


def test_felder_verweise_und_zuege_ohne_nummer_bleiben_text():
    for satz in ["Der Bauer e4 hängt.", "Wie in Abb. 2.3 zieht Sa3 an den Rand.", "Regel 2. Die Dame"]:
        assert all(art == "text" for art, _ in _teile(satz)), satz


def test_klartext_bleibt_gleich_und_zaehlung():
    latex = r"Stellung nach 1. e4 e5 2. f4 exf4 3. Sf3 g5 -- Kieseritzky"
    vorher = wandle_text(latex, "test.tex:1").teile
    nachher = markiere_klartextzuege(vorher)
    assert als_klartext(nachher) == als_klartext(vorher)
    assert zaehle_klartextzuege(nachher) == 1
    assert [t.text for t in nachher if t.art == "zug"] == ["1. e4 e5 2. f4 exf4 3. Sf3 g5"]


def test_fetter_text_bleibt_unberuehrt():
    teile = markiere_klartextzuege(wandle_text(r"\textbf{1. e4}", "test.tex:1").teile)
    assert [(t.art, t.stil) for t in teile] == [("text", "fett")]
