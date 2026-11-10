"""Tests der Fahrzeugprüfung nach KARTENREGELN 10.65 (pipeline/abenteuer/fahrzeuge.py), ohne Pillow."""

from pipeline.abenteuer.fahrzeuge import LAENGS, SEITE, ansicht, fahrbahnrichtung, fahrzeughinweise

ME = "modern-exteriors/x/ME_Singles_Vehicles_16x16_"
MOEBEL = {
    "busSeite": {"quelle": ME + "Bus_Left_2.png"},
    "autoVorn": {"quelle": ME + "Car_Down_4.png"},
    "autoSeite": {"quelle": ME + "Car_Right_17.png"},
    "linieHoch": {"quelle": "spiel/eigene/fahrbahn_linie_5.png"},
    "bank": {"quelle": "modern-exteriors/x/Bench_1.png"},
}
# Straße West–Ost (Reihen 1–2) mit einer Querstraße Nord–Süd (Spalten 8–9) nach unten.
STRASSE = ["#" * 12, "s" * 12, "s" * 12] + ["........ss.."] * 6
SZENE = {"boden": "gras", "boeden": {"s": "asphalt", "p": "pflaster"}}


def stueck(name: str, x: int, y: int, breite: int, hoehe: int) -> dict:
    """Ein gesetztes Möbel in Pixeln, wie ``kartenbau.platziere`` es liefert."""
    return {"name": name, "x": x * 16, "y": y * 16, "breite": breite * 16, "hoehe": hoehe * 16}


def test_ansicht_aus_dem_dateinamen():
    assert ansicht(ME + "Bus_Left_2.png") == SEITE
    assert ansicht(ME + "Car_Up_11.png") == LAENGS
    assert ansicht("modern-farm/x/Tractor_Front_Side_16x16.png") == LAENGS
    assert ansicht("spiel/eigene/sattelzug_rot.png") == SEITE
    assert ansicht(ME + "Boat_1_Left_1.png") is None


def test_fahrbahnrichtung_nur_wo_sie_eindeutig_ist():
    assert fahrbahnrichtung(STRASSE, {"s"}, 3, 1) == SEITE
    assert fahrbahnrichtung(STRASSE, {"s"}, 8, 6) == LAENGS
    assert fahrbahnrichtung(STRASSE, {"s"}, 3, 5) is None  # Gras
    platz = ["ssss", "ssss", "ssss"]
    assert fahrbahnrichtung(platz, {"s"}, 1, 1) is None  # Platz: keine Richtung überwiegt


def test_bus_von_der_seite_auf_der_querstrasse_ist_ein_hinweis():
    gesetzt = [stueck("busSeite", 7, 4, 3, 3), stueck("autoSeite", 1, 0, 4, 3), stueck("bank", 8, 6, 1, 1)]
    hinweise = fahrzeughinweise(SZENE, STRASSE, gesetzt, MOEBEL)
    assert len(hinweise) == 1 and hinweise[0].startswith("busSeite")
    assert "Nord–Süd" in hinweise[0]


def test_auto_von_vorn_auf_der_querstrasse_passt():
    assert fahrzeughinweise(SZENE, STRASSE, [stueck("autoVorn", 8, 4, 2, 4)], MOEBEL) == []


def test_auto_von_der_seite_ueber_einer_buchtlinie():
    """Parkplatz aus Pflaster: Die Linie von Nord nach Süd läuft mitten unter dem Auto durch."""
    platz = ["p" * 10] * 6
    gesetzt = [stueck("autoSeite", 2, 1, 5, 3), stueck("linieHoch", 4, 0, 1, 5)]
    hinweise = fahrzeughinweise(SZENE, platz, gesetzt, MOEBEL)
    assert len(hinweise) == 1 and "Buchtlinie" in hinweise[0]
    # Dasselbe Auto zwischen zwei Linien am Rand der Bucht: kein Hinweis.
    daneben = [stueck("autoSeite", 2, 1, 5, 3), stueck("linieHoch", 2, 0, 1, 5)]
    assert fahrzeughinweise(SZENE, platz, daneben, MOEBEL) == []


def test_lastwagen_von_vorn_in_buchten_laengs():
    """Regel: KARTENREGELN 10.65: Auf einem Platz mit Buchtlinien von Nord nach Süd stehen Fahrzeuge
    von vorn oder hinten richtig, auch wenn der Platz breiter als tief ist (Fernfahrerplatz)."""
    assert ansicht("spiel/eigene/sattelzug_vorn.png") == LAENGS
    assert ansicht("spiel/eigene/lastwagen_hinten.png") == LAENGS
    assert ansicht("spiel/eigene/lieferwagen_links.png") == SEITE
    moebel = {"zugVorn": {"quelle": "spiel/eigene/sattelzug_vorn.png"}, **MOEBEL}
    zeilen = ["b" * 12] * 4
    szene = {"boden": "sand", "boeden": {"b": "asphalt"}, "buchten_laengs": {"b": 4}}
    assert fahrzeughinweise(szene, zeilen, [stueck("zugVorn", 4, 0, 3, 4)], moebel) == []
    assert len(fahrzeughinweise(szene, zeilen, [stueck("busSeite", 2, 1, 7, 3)], moebel)) == 1
