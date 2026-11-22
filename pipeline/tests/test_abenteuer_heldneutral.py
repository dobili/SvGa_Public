"""Dauertest: Die Texte sprechen über {held} ohne Geschlecht (Heldin wählbar, 22.11.2026)."""

from pipeline.abenteuer import heldneutral


def test_keine_befunde():
    assert heldneutral.befunde() == []


def test_findet_pronomen_und_anrede():
    assert heldneutral.pruefe_text("{held} nickt, er ist bereit.") == ["Pronomen nach {held}: er"]
    assert heldneutral.pruefe_text("Komm her, mein Junge.") == ["Anrede: mein Junge"]
    assert heldneutral.pruefe_text("Na, Kleine, wie geht's?") == ["Anrede: Kleine"]
    assert heldneutral.pruefe_text("Da kommt die Neue.") == ["Bezeichnung: die Neue"]


def test_laesst_andere_figuren_und_ausnahmen():
    assert heldneutral.pruefe_text("Ein Junge, Finn, kniet am Kai.") == []
    assert heldneutral.pruefe_text("Glückwunsch, {held}. Er hat verloren.") == []
    assert heldneutral.pruefe_text("Na, Kumpel! Schicht beginnt.", "bigJoe") == []
    assert heldneutral.pruefe_text("Na, Kumpel! Schicht beginnt.", "dash") == ["Anrede: Kumpel"]
