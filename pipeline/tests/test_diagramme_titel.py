"""Titel aus dem LaTeX: Anführungszeichen und schmaler Abstand (Befund EN4 c und d, 26.10.2026)."""

from pipeline.lesen.diagramme import _rein


def test_anfuehrungszeichen_ohne_leerzeichen_dahinter():
    assert _rein(r"Warum \glqq Schach\grqq{} vor \glqq Schlag\grqq steht") == (
        "Warum „Schach“ vor „Schlag“ steht"
    )


def test_schmaler_abstand_wird_schmales_leerzeichen():
    assert _rein(r"Gambits gegen 1.\,d4") == "Gambits gegen 1. d4"
