"""Dauertest: kein festes „Victor“ in den Texten, Rivale oder Rivalin wählbar (22.11.2026)."""

from pipeline.abenteuer import rivalneutral


def test_keine_befunde():
    assert rivalneutral.befunde() == []


def test_findet_namen_pronomen_und_woerter():
    assert rivalneutral.pruefe_text("Victor nickt.") == ["festes Victor"]
    assert rivalneutral.pruefe_text("Victors Vater.") == ["festes Victors"]
    assert rivalneutral.pruefe_text("{rivale} nickt, er ist bereit.") == ["Pronomen nach {rivale}: er"]
    assert rivalneutral.pruefe_text("{rivale} ist ein Junge.") == ["Wort mit Geschlecht: Junge"]


def test_laesst_platzhalter_und_variablennamen():
    assert rivalneutral.pruefe_text("{rivale} und {rv_sein} Vater gehen.") == []
    assert rivalneutral.pruefe_text("{rivale} ist {rivalin:ein Mädchen|ein Junge}.") == []
    assert rivalneutral.pruefe_text("ausgangMapleFallsVictor") == []


def test_meldet_fehlende_variablen(tmp_path):
    (tmp_path / "probe.ink").write_text('VAR rivale = "Victor"\n{rivale} kommt.\n', encoding="utf-8")
    befunde = rivalneutral.ink_befunde(tmp_path)
    assert len(befunde) == 1
    assert "rv_er" in befunde[0]
