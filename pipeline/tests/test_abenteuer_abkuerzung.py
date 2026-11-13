"""Abkürzungsprüfung (R030, R031): Wo die Geschichte einen Weg vorgibt, ist er der einzige Weg.

Warum: Der Autor umging auf dem Zedernpfad das ganze Gebirge am unteren Kartenrand. Die Prüfung
``pipeline/abenteuer/abkuerzung.py`` vergleicht den Weg über Wegboden mit dem Weg querfeldein.
"""

from pipeline.abenteuer.abkuerzung import befunde_der_szene, kuerzester

UEBERGAENGE = [
    {"name": "west", "art": "uebergang", "ort": "probe"},
    {"name": "ost", "art": "uebergang", "ort": "probe"},
]
# Der Weg „e“ macht einen Bogen nach unten; oben liegt offene Wiese.
OFFEN = [
    "############",
    "e..........e",
    "e..........e",
    "e..........e",
    "eeeeeeeeeeee",
    "############",
]
# Dieselbe Karte, die Wiese ist Hecke: Nur der Weg führt hinüber.
DICHT = [
    "############",
    "e##########e",
    "e##########e",
    "e##########e",
    "eeeeeeeeeeee",
    "############",
]


def _szene(raster: list[str], **mehr) -> dict:
    return {
        "karte": "probe.weg",
        "art": "aussen",
        "boden": "gras",
        "boeden": {"e": "erde"},
        "raster": raster,
        "ausloeser": [{"name": "west", "feld": [0, 1]}, {"name": "ost", "feld": [11, 1]}],
        **mehr,
    }


def test_offene_wiese_ist_abkuerzung_und_umgehung():
    befunde = befunde_der_szene(_szene(OFFEN), UEBERGAENGE, {}, ist_weg=True)
    assert len(befunde) == 2
    assert "Abkürzung querfeldein, 11 statt 17 Felder" in befunde[0]
    assert "Umgehung ohne den Weg" in befunde[1]


def test_umgehung_zaehlt_nur_auf_wegen():
    """In einer Stadt (keine Art „weg“) darf man über den Platz gehen; gemeldet wird die Abkürzung."""
    befunde = befunde_der_szene(_szene(OFFEN), UEBERGAENGE, {}, ist_weg=False)
    assert len(befunde) == 1 and "Abkürzung" in befunde[0]


def test_hecke_sperrt_lueckenlos():
    assert befunde_der_szene(_szene(DICHT), UEBERGAENGE, {}, ist_weg=True) == []


def test_ausnahme_und_innenkarten():
    assert befunde_der_szene(_szene(OFFEN, abkuerzung_ok="platz"), UEBERGAENGE, {}, True) == []
    assert befunde_der_szene({**_szene(OFFEN), "art": "innen"}, UEBERGAENGE, {}, True) == []


def test_gesperrter_weg_der_sich_umgehen_laesst():
    """Sturmholz auf dem Zedernpfad: Die Sperre der Geschichte wirkt nicht, wenn Wiese daneben liegt."""
    moebel = {"holz": {"quelle": "x.png", "breite": 16, "hoehe": 16, "kollision": True}}
    szene = _szene(OFFEN, objekte=[{"moebel": "holz", "feld": [5, 4]}])
    befunde = befunde_der_szene(szene, UEBERGAENGE, moebel, ist_weg=False)
    assert befunde == ["ost → west: Weg bei (5, 4) gesperrt (holz), aber umgehbar (11 Felder querfeldein)"]


def test_kuerzester_weg():
    frei = {(0, 0), (1, 0), (2, 0)}.__contains__
    assert kuerzester(frei, [(0, 0)], {(2, 0)}) == [(0, 0), (1, 0), (2, 0)]
    assert kuerzester(frei, [(0, 0)], {(5, 5)}) is None
