"""Tests für die Raumgröße (``pipeline/abenteuer/raumgroesse.py``, R065, KARTENREGELN 10.75).

Warum: Innenräume waren viel größer als ihr Gebäude außen (Rückmeldung R065). Die Tests halten die
Grenzen der Tabelle 10.75, den Spielraum von einer Kachel und das gemeinsame Schreiben der
Berichtsdatei fest; dazu ein Lauf über Maple Falls mit dem echten Bestand.

Aufruf: ``python -m pytest pipeline/tests/test_abenteuer_raumgroesse.py``
"""

from pipeline.abenteuer.raumgroesse import Raum, bewerte, grenzen, miss, schreibe_abschnitt


def test_grenzen_mittel_diner():
    # Regel 10.75, mittleres Gebäude: Breite bis 2b, Tiefe bis 2,5 × Dachreihen (Diner 8 × 6).
    g = grenzen(8, 6)
    assert g["breite_max"] == 16 and g["tiefe_max"] == 15 and g["breite_min"] is None


def test_grenzen_klein_und_gross():
    klein = grenzen(4, 3)
    assert klein["breite_max"] == 10 and klein["breite_min"] == 8 and klein["tiefe_min"] == 6
    gross = grenzen(14, 8)
    assert gross["breite_min"] == 14 and gross["breite_max"] == 21 and gross["tiefe_max"] == 16


def test_grenzen_ohne_tiefe():
    # Tiefe 0 heißt im Grundriss „frei“: keine Tiefengrenze.
    assert grenzen(8, 0)["tiefe_max"] is None


def test_bewerte_spielraum_und_befunde():
    passt = Raum("a.b", aussen_breite=8, aussen_tiefe=6, innen_breite=17, innen_tiefe=10)
    bewerte(passt)
    assert passt.befund == "passt"  # 17 liegt im Spielraum von einer Kachel über 16
    breit = Raum("a.b", aussen_breite=8, aussen_tiefe=2, innen_breite=24, innen_tiefe=9)
    bewerte(breit)
    assert "zu breit (24 statt höchstens 16)" in breit.befund
    assert "zu tief (9 statt höchstens 5)" in breit.befund
    assert "Breite innen auf 16" in breit.vorschlag


def test_bewerte_kleiner_ohne_tuer():
    raum = Raum("a.b", aussen_breite=14, aussen_tiefe=6, innen_breite=10, innen_tiefe=8)
    bewerte(raum)
    assert "ohne weitere Tür" in raum.befund and "verschlossene Tür" in raum.vorschlag
    raum.weitere_tueren = 1
    bewerte(raum)
    assert raum.befund == "passt"


def test_schreibe_abschnitt_ersetzt_nur_eigene_marke(tmp_path):
    datei = tmp_path / "bericht.md"
    schreibe_abschnitt(datei, "R065", "eins\n", "Titel")
    schreibe_abschnitt(datei, "R008", "zwei\n", "Titel")
    schreibe_abschnitt(datei, "R065", "drei\n", "Titel")
    text = datei.read_text(encoding="utf-8")
    assert text.startswith("# Titel") and "drei" in text and "zwei" in text and "eins" not in text


def test_maple_falls_bestand():
    raeume = {r.karte: r for r in miss("mapleFalls")}
    assert "mapleFalls.diner" in raeume
    assert all(r.befund for r in raeume.values())
