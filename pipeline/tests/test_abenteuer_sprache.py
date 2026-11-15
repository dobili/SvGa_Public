"""Sprachprüfung der Spieltexte (pipeline/abenteuer/sprache.py): Regeln und aktueller Stand.

Warum: Anführungszeichen, Gedankenstriche, Apostrophe, die Anrede „du“ und die Schreibweise der
Figurennamen sollen in allen Dialogen und Texten gleich bleiben, auch wenn neue Dateien dazukommen
(Auftrag des Hauptchats, 15.11.2026). Der erste Test hält den Stand fest, die übrigen die Regeln.
"""

from pipeline.abenteuer.sprache import (
    figurennamen,
    ink_text,
    pruefe_alles,
    pruefe_namen,
    pruefe_woerter,
    pruefe_zeichen,
)


def _regeln(funde) -> set[str]:
    return {fund.regel for fund in funde}


def test_alle_spieltexte_ohne_funde():
    funde = pruefe_alles()
    assert funde == [], "Sprachprüfung (python -m pipeline.abenteuer.sprache):\n" + "\n".join(
        str(f) for f in funde
    )


def test_ink_text_ohne_logik_und_tags():
    zeile = "{teamAngekommen: Das Team. #sprecher:okafor|Ihr seid die Vorhut. #sprecher:okafor}"
    assert ink_text(zeile) == ["Das Team.", "Ihr seid die Vorhut."]
    assert ink_text('- ausgangX == "sieg": Gut gespielt. #sprecher:mira -> weiter') == ["Gut gespielt."]
    assert ink_text("{nadel > 0 and not gesehen} [„Noch eine Partie.“]") == ["„Noch eine Partie.“"]
    assert ink_text("Du spielst, {held}. #sprecher:sam") == ["Du spielst, Robin."]
    assert ink_text("Du hast {punktetext()} Punkte.") == ["Du hast ◇ Punkte."]
    assert ink_text("~ x = true") == [] and ink_text("=== knoten ===") == []


def test_zeichenregeln():
    assert _regeln(pruefe_zeichen("t", 'Er sagt "Hallo".')) == {"anfuehrung"}
    assert _regeln(pruefe_zeichen("t", "„Hallo.")) == {"anfuehrung"}
    assert _regeln(pruefe_zeichen("t", "Warte - gleich.")) == {"strich"}
    assert _regeln(pruefe_zeichen("t", "Na ja...")) == {"auslassung"}
    assert _regeln(pruefe_zeichen("t", "Zwei  Leerzeichen , und so.")) == {"leerzeichen"}
    assert _regeln(pruefe_zeichen("t", "Wie geht’s?")) == {"apostroph"}
    assert pruefe_zeichen("t", "„Los geht's“ – sagt sie … und lacht.") == []


def test_wortregeln():
    assert _regeln(pruefe_woerter("t", "Ich sehe Dich.")) == {"anrede"}
    assert _regeln(pruefe_woerter("t", "Das ist der der Turm.")) == {"doppelwort"}
    assert pruefe_woerter("t", "Du bist dran. Warum kaufen Sie sie dann?") == []


def test_namen_mit_akzent():
    namen = figurennamen()
    assert "Tomás" in namen
    funde = pruefe_namen([("t", "Tomas zählt.")], namen)
    assert _regeln(funde) == {"name"}
    assert pruefe_namen([("t", "Tomás zählt.")], namen) == []
