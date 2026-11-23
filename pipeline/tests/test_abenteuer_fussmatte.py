"""Tests der Fußmatten-Prüfung (fussmatte.py): Matte perspektivisch direkt hinter der Tür.

Ohne privates Paket: Die sichtbaren Ränder stehen in fussmatte_masse.json.
"""

from pipeline.abenteuer import fussmatte as F

# Diner Maple Falls nach dem Editor des Autors: Glastür oben bei 192, Matte bis 198 (6 px darunter).
TUER = ("rv8GlastuerSued", (64, 192, 96, 208), "rv8GlastuerSued@3")


def test_jede_fussmatte_liegt_hinter_ihrer_tuer():
    # Dauertest: „0 Befunde“ in allen Szenen und Varianten (Ausnahmen in GEPRUEFT).
    assert [b.text() for b in F.alle_befunde()] == []


def test_masse_kennen_die_matten_und_tueren_des_pakets():
    masse = F.lade_masse()
    assert {"mf4Fussmatte", "cc5Fussmatte", "rv8GlastuerSued", "mfDoppeltuerSuedHolz"} <= masse.keys()


def test_verschiebung_nach_der_regel_des_autors():
    alt = F.Befund("probe.json", 0, (4, 11), "rv8GlastuerSued", abstand=0, ebene_fehlt=True)
    assert alt.verschiebung == F.UEBERLAPPUNG
    assert "0 px unter der Türoberkante statt 6" in alt.text()
    passt = F.Befund("probe.json", 0, (4, 11), "rv8GlastuerSued", abstand=-5, ebene_fehlt=False)
    assert abs(passt.verschiebung) <= F.SPIEL


def test_matte_gehoert_zur_tuer_darunter():
    assert F._tuer_zur_matte((66, 183, 80, 198), [TUER]) == TUER
    # Daneben oder weit darüber: keine Tür (eine Turnmatte mitten im Raum zählt nicht).
    assert F._tuer_zur_matte((120, 183, 134, 198), [TUER]) is None
    assert F._tuer_zur_matte((66, 100, 80, 115), [TUER]) is None
    assert F.ist_matte("cc5Fussmatte") and not F.ist_matte("pd6Turnmatte")
