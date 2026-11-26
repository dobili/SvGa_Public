"""Prüfung der Lage- und Handlungsangaben im Dialog gegen die Karte (pipeline/abenteuer/lageangabe.py).

Warum: Befund des Autors (25.11.2026): „Ein Mädchen mit Skateboard unter dem Arm versperrt halb den
Weg“, aber Nia stand neben der Landstraße im Gras. Jeder Kandidat ist angesehen (behoben, GEPRUEFT
oder GEMELDET); die gemeldeten Fälle haben eine Obergrenze, die nur sinken darf.
"""

from pipeline.abenteuer.lageangabe import PRUEFUNGEN, kandidaten
from pipeline.abenteuer.lageangabe_geprueft import GEMELDET, GEPRUEFT

# Gemeldete Fälle (Bildwünsche, Sitzplätze für die Karte), Stand 26.11.2026. Nur senken.
# 25.11.2026 abends: 13 Sitzplätze behoben (mittel-3, Figuren auf Stuhl, Hocker, Sessel gesetzt).
# 26.11.2026: fünf Bildwünsche erfüllt (Standbilder mit Gegenstand aus PixelLab, Szene „standbild“).
OBERGRENZE_GEMELDET = 5


def test_jeder_kandidat_ist_angesehen():
    """Neue Kandidaten brauchen einen Blick: beheben oder mit Grund eintragen."""
    offen = [
        f"{k.schluessel} (Zeile {k.zeile}) {k.text} | {k.lage}" for k in kandidaten() if k.geprueft() is None
    ]
    assert offen == [], "Lage oder Handlung prüfen (Karte, Text, GEPRUEFT oder GEMELDET):\n" + "\n".join(
        offen
    )


def test_eintraege_gibt_es_noch():
    """Jeder Eintrag trifft noch einen Kandidaten (sonst ist er erledigt und gehört gelöscht)."""
    schluessel = {k.schluessel for k in kandidaten()}
    assert [s for s in [*GEPRUEFT, *GEMELDET] if s not in schluessel] == []


def test_gemeldete_nur_weniger():
    """Die Zahl der gemeldeten Fälle sinkt nur (Obergrenze nach dem Beheben senken)."""
    assert len(GEMELDET) <= OBERGRENZE_GEMELDET


def test_nia_versperrt_halb_den_weg():
    """Das Skatermädchen steht auf der Landstraße (kein Kandidat „weg“ mehr)."""
    assert not [k for k in kandidaten() if k.pruefung == "weg" and k.figur == "gegnerin"]


def test_standbild_mit_gegenstand():
    """Ein weiteres Standbild an der Stelle erfüllt „unter dem Arm“ (Nia mit Skateboard, 26.11.2026)."""
    bild = [k.schluessel for k in kandidaten() if k.pruefung == "bild"]
    assert "bild:gegnerin:weg-maple-cedar.nia_erstes_treffen" not in bild
    assert "bild:kira:hochebene.kira_regel" not in bild


def test_muster():
    """Die Muster treffen die Wendungen aus dem Befund und lassen Ähnliches stehen."""
    weg, _ = PRUEFUNGEN["weg"]
    assert weg.search("Ein Mädchen mit Skateboard versperrt halb den Weg.")
    assert weg.search("Ein Hund steht mitten auf der Straße.")
    assert not weg.search("Der Weg führt am Fluss entlang.")
    bild, _ = PRUEFUNGEN["bild"]
    assert bild.search("einen Bildschirm unter dem Arm")
    tresen, moebel = PRUEFUNGEN["tresen"]
    assert tresen.search("Hinter dem Tresen steht Darlene.")
    assert moebel is not None and moebel.search("cr7Tresen")
