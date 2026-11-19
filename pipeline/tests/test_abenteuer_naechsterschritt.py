"""Prüfung „Weiß der Spieler, wohin als Nächstes?“ (pipeline/abenteuer/naechsterschritt.py).

Warum: Wunsch des Autors (19.11.2026): Der Dialog, der einen Questschritt abschließt, nennt das
nächste Ziel (Person oder Ort), zusätzlich zur Kartenmarkierung. Der erste Test hält den Stand der
echten Daten fest, die übrigen die Regeln an kleinen Beispielen.
"""

from pipeline.abenteuer.naechsterschritt import AUSNAHMEN, Welt, Ziel, bewerte, kebab, namenteile, pruefe


def test_jeder_uebergang_nennt_das_naechste_ziel():
    """Kein Übergang zwischen Questschritten bleibt ohne Namen des nächsten Ziels."""
    fehlend = [str(b) for b in pruefe() if b.stufe == "fehlt"]
    assert fehlend == [], "Dialog nennt das nächste Ziel nicht:\n" + "\n".join(fehlend)


def test_ausnahmen_gibt_es_noch():
    """Jede Ausnahme gehört zu einer Quest mit diesem Schritt (sonst ist sie veraltet)."""
    welt = Welt()
    quests = {q["kennung"]: q for q in welt.quests}
    for schluessel in AUSNAHMEN:
        kennung, _, schritt = schluessel.rpartition(":")
        assert kennung in quests, schluessel
        assert 1 <= int(schritt) <= len(quests[kennung]["schritte"]), schluessel


def test_namen_und_dateien():
    """Namen zerfallen in tragende Wörter; Kartenkennungen werden zu Dateinamen."""
    assert namenteile("Coach Delgado") == {"Coach Delgado", "Delgado"}
    assert namenteile("Mrs. Okafor") == {"Mrs. Okafor", "Okafor"}
    assert kebab("mapleFalls.clubraum") == "maple-falls-clubraum"


def test_bewertung_an_echten_knoten():
    """Der Text nennt den Namen (Wortgrenze) oder startet das Ziel; sonst fehlt er."""
    welt = Welt()
    mit_name = Ziel(namen={"Turnierleiterin"})
    assert bewerte(welt, "capital-arena-aussen.arena_ankunft", mit_name)[0]
    ohne_name = Ziel(namen={"Darlene"})
    assert not bewerte(welt, "capital-arena-aussen.arena_ankunft", ohne_name)[0]
    gestartet = Ziel(aufrufe={"summitCity.victorFrei"})
    assert bewerte(welt, "summit-city-bergstation.victor_spielen", gestartet)[0]
