"""Prüfung der Kartenbelegung gegen die Dialoge (pipeline/abenteuer/figurenort.py).

Warum: Lektorat der Lesefassung (19.11.2026): Mama stand in Ironwood im falschen Raum, Juno nach dem
Aufbruch noch in Maple Falls. Der erste Test verlangt, dass jeder Kandidat angesehen ist; die übrigen
halten die Erkennung und die beiden Umbauten fest.
"""

from pipeline.abenteuer.figurenort import (
    ORTSANGABE,
    Stand,
    _bleibt_stehen,
    kandidaten,
    lade_orte,
    staende,
)
from pipeline.abenteuer.figurenort_geprueft import GEPRUEFT


def test_jeder_kandidat_ist_angesehen():
    """Neue Kandidaten brauchen einen Blick: Szene oder wenn ändern, oder mit Grund eintragen."""
    offen = [f"{k.schluessel} {k.text}" for k in kandidaten() if k.geprueft() is None]
    assert offen == [], "Kartenbelegung prüfen (beheben oder in GEPRUEFT):\n" + "\n".join(offen)


def test_gepruefte_gibt_es_noch():
    """Jeder Eintrag in GEPRUEFT trifft noch einen Kandidaten (sonst ist er veraltet)."""
    schluessel = {k.schluessel for k in kandidaten()}
    assert [s for s in GEPRUEFT if s not in schluessel] == []


def test_ortsangabe():
    """„In der Kantine“ nennt den Ort; „Vor der Turnhalle“ steht man draußen."""
    assert ORTSANGABE.search("In der Kantine bullert der Ofen.").group(1) == "Kantine"
    assert ORTSANGABE.search("Vor der Turnhalle steht ein Gebäckstand.") is None


def test_kartenfassung_laesst_figur_weg():
    """Slick fehlt in der Pavillon-Fassung nach seinem Abschied: Er bleibt nicht stehen."""
    orte = lade_orte()
    slick = {"kennung": "riverton.slick", "name": "figur.slick.name"}
    stand = {"riverton.slick": {Stand("riverton.pavillon", None)}}
    assert not _bleibt_stehen(slick, "slickAbschiedGesehen", orte, stand)
    assert _bleibt_stehen(slick, "aufbruchGesehen", orte, stand)


def test_mama_steht_in_der_kantine():
    """Mama steht in Ironwood in der Kantine (auch nach dem Kauf), nicht in ihrem alten Zimmer."""
    karten = {s.karte for s in staende(lade_orte())["ironwood.mama"]}
    assert karten == {"ironwood.kantine"}
    kantine = next(k for o in lade_orte() for k in o["karten"] if k["kennung"] == "ironwood.kantine")
    assert kantine["eingang"]["dialog"] == "ironwood-kantine.mama_ankunft"


def test_juno_nach_dem_aufbruch_fort():
    """Juno steht in Maple Falls nicht zwischen Aufbruch und Ende von Akt 1."""
    figuren = {f["kennung"]: f for o in lade_orte() for f in o["figuren"]}
    for kennung in ("mapleFalls.juno", "mapleFalls.junoClub"):
        assert "nicht aufbruchGesehen oder endeAkt1Gesehen" in figuren[kennung]["wenn"]
