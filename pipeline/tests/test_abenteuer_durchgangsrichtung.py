"""Tests der Durchgangsrichtung (pipeline/abenteuer/durchgangsrichtung.py): Gebäudetüren führen hinein."""

import copy

from pipeline.abenteuer.durchgangsrichtung import (
    app_durchgang,
    beruehrt,
    pruefe_richtungen,
    richtung_ins_gebaeude,
    richtungsbefunde,
)
from pipeline.abenteuer.moebelliste import lade_moebel
from pipeline.abenteuer.uebergaenge import szenen, uebergaenge

KACHEL = 16
#: Ein Haus 5 × 4 Kacheln auf (2, 1) mit einer Lücke über der Tür (wie die Villa in Maple Falls).
HAUS = {
    "name": "haus",
    "x": 2 * KACHEL,
    "y": 1 * KACHEL,
    "breite": 5 * KACHEL,
    "hoehe": 4 * KACHEL,
    "kollision": True,
}


def test_app_durchgang_wie_in_der_app():
    """Ohne Angabe: Richtungen zu gesperrten Nachbarn; mit Angabe genau diese."""
    nur_seiten = {(3, 5), (5, 5)}

    def frei(x: int, y: int) -> bool:
        return (x, y) not in nur_seiten

    assert app_durchgang((4, 5), None, frei, {(4, 5)}) == ["links", "rechts"]
    assert app_durchgang((4, 5), "oben", frei, {(4, 5)}) == ["oben"]
    assert app_durchgang((4, 5), None, lambda x, y: True, {(4, 5), (4, 6)}) == ["unten"]
    assert app_durchgang((4, 5), None, lambda x, y: True, {(4, 5)}) == ["oben", "unten", "links", "rechts"]


def test_richtung_ins_gebaeude_und_abstand():
    assert richtung_ins_gebaeude(HAUS, (4, 5)) == "oben"
    assert richtung_ins_gebaeude(HAUS, (1, 3)) == "rechts"
    assert beruehrt(HAUS, (4, 5)) and beruehrt(HAUS, (4, 6))
    assert not beruehrt(HAUS, (4, 7))


def test_haustuer_maple_falls_ohne_angabe_ist_ein_befund():
    """Spieltest 2: Ohne „durchgang: oben“ rechnet die App seitwärts, der Held läuft vorbei."""
    moebel = lade_moebel()
    szene = copy.deepcopy(szenen()["mapleFalls.aussen"])
    for a in szene["ausloeser"]:
        if a["name"] == "haustuer":
            a.pop("eigenschaften", None)
    befunde = richtungsbefunde(szene, "haustuer", moebel)
    assert len(befunde) == 1 and "nach oben" in befunde[0]


def test_alle_gebaeudetueren_fuehren_hinein():
    assert pruefe_richtungen(szenen(), uebergaenge()) == []
