"""Prüfung der Dialoge gegen Haltung und Ort der Sprechenden (pipeline/abenteuer/sprecherort.py).

Warum: Befund des Autors (20.11.2026): In der ersten Nacht stand {held} vor Ambrose am Fenster,
während der Text vom Wachliegen erzählte. Der erste Test verlangt, dass jeder Kandidat angesehen
ist (behoben, GEPRUEFT oder GEMELDET); die übrigen halten die Erkennung fest.
"""

from pipeline.abenteuer.sprecherort import KOMMT, SCHLAF, SITZT, kandidaten
from pipeline.abenteuer.sprecherort_geprueft import GEMELDET, GEPRUEFT


def test_jeder_kandidat_ist_angesehen():
    """Neue Kandidaten brauchen einen Blick: beheben oder mit Grund eintragen."""
    offen = [f"{k.schluessel} {k.text}" for k in kandidaten() if k.geprueft() is None]
    assert offen == [], "Haltung oder Ort prüfen (beheben, GEPRUEFT oder GEMELDET):\n" + "\n".join(offen)


def test_eintraege_gibt_es_noch():
    """Jeder Eintrag trifft noch einen Kandidaten (sonst ist er veraltet und gehört gelöscht)."""
    schluessel = {k.schluessel for k in kandidaten()}
    assert [s for s in [*GEPRUEFT, *GEMELDET] if s not in schluessel] == []


def test_nacht_im_bett_ist_behoben():
    """Die erste Nacht legt {held} ins Bett (#stelle … >liegt): kein Kandidat „liegen“ mehr."""
    stellen = {k.stelle for k in kandidaten() if k.pruefung == "liegen"}
    assert "maple-falls-dachboden.erste_nacht" not in stellen


def test_muster():
    """Die Muster treffen die Wendungen aus dem Befund und lassen Ähnliches stehen."""
    assert SCHLAF.search("„Kannst du auch nicht schlafen?“")
    assert SCHLAF.search("„Bist du wach?“")
    assert KOMMT.search("Mama kommt den Gang herunter und setzt sich neben dich.")
    assert not KOMMT.search("Mama kommt aus Ironwood.")
    assert SITZT.search("Juno sitzt auf der untersten Stufe.")
    assert not SITZT.search("Der Hut sitzt schief.")
