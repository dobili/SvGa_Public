"""Erste Zeilen der ansprechenden Figuren passen auch, wenn die Figur angefangen hat (Dauertest).

Warum: Wunsch des Autors (25.11.2026). Spricht eine Hauptfigur den Helden an, darf ihr Gespräch
nicht erzählen, dass sie noch an ihrem Platz steht oder dass der Held zu ihr geht. Abhilfe ist die
Ink-Variable ``angesprochen`` (pipeline/abenteuer/ansprechzeile.py, Dateikopf).
"""

from pipeline.abenteuer.ansprechzeile import erste_zeilen, stellen, verdaechtig
from pipeline.abenteuer.inkfluss import lies


def test_keine_offenen_stellen():
    offen = [f"{s.datei}:{s.zeile} {s.text}" for s in stellen() if s.geprueft() is None]
    assert offen == []


def test_verdaechtige_zeilen():
    assert verdaechtig("An der Bushaltestelle steht ein Mädchen mit zwei Zöpfen.")
    assert verdaechtig("Du gehst zu ihr hin und tippst sie an.")
    assert verdaechtig("Ja? Kann ich dir helfen?")
    assert not verdaechtig("Du bist das Kind aus dem Whitlock-Haus!")


def test_erste_zeilen_bis_zur_wahl():
    quelle = "=== a ===\n~ x = true\nErste Zeile.\nZweite Zeile.\nDritte Zeile.\n* Wahl\n  Danach.\n-> END\n"
    fluss = lies(quelle)
    texte = sorted(fluss.zeilen[i].text for i in erste_zeilen(fluss, fluss.namen[("a",)]))
    assert texte == ["Erste Zeile.", "Zweite Zeile."]
