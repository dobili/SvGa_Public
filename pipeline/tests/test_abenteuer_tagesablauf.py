"""Tagesabläufe (pipeline/abenteuer/tagesablauf.py): Dauertest der Daten und der Regeln.

Warum: Auftrag des Hauptchats (22.11.2026). Die Abläufe in inhalte/abenteuer/tagesablaeufe.json
dürfen das Spiel nie stören (Wand, Doppelbelegung, zugestellter Weg, Geisterstadt, Questfigur).
Der erste Test prüft die echten Daten, die übrigen die Regeln an kleinen Beispielen. Ohne Pillow.
"""

from pipeline.abenteuer import tagesablauf as ta
from pipeline.abenteuer.tagesablauf_entwurf import grenze, stunden


def test_tagesablaeufe_ohne_befund():
    """Alle Figuren, Karten und Stunden: keine Befunde."""
    befunde = ta.pruefe()
    assert befunde == [], "\n".join(befunde[:40])


def test_stunden_ueber_mitternacht():
    """Ein Block über Mitternacht zählt die richtigen Stunden; 0 bis 0 ist der ganze Tag."""
    assert stunden(23, 2) == [23, 0, 1]
    assert stunden(9, 17) == list(range(9, 17))
    assert len(stunden(0, 0)) == 24


def test_form_findet_luecken_und_falschen_schlaf():
    """Fehlende Stunden und vier Stunden Schlaf sind Befunde; ohne Schlaf kein Schlafblock."""
    eintrag = {
        "ort": "x",
        "bloecke": [{"art": "arbeit", "von": 9, "bis": 17}, {"art": "schlaf", "von": 22, "bis": 2}],
    }
    befunde = ta.pruefe_form("probe", eintrag)
    assert any("fehlt" in b for b in befunde)
    assert any("4 Stunden Schlaf" in b for b in befunde)
    dienst = {"ort": "x", "ohne_schlaf": "Dienst", "bloecke": [{"art": "arbeit", "von": 0, "bis": 0}]}
    assert ta.pruefe_form("hector", dienst) == []


def test_drittel_und_kleine_orte():
    """Ein Drittel schläft höchstens, von 0 bis 4 Uhr die Hälfte; kleine Orte abends nur eine."""
    assert grenze(23, 12) == 4
    assert grenze(1, 12) == 6
    assert grenze(23, 5) == 1
    assert grenze(2, 5) == 2
    daten = {
        n: {
            "ort": "dorf",
            "bloecke": [{"art": "schlaf", "von": 23, "bis": 2}, {"art": "arbeit", "von": 2, "bis": 23}],
        }
        for n in ("a", "b")
    }
    assert ta.pruefe_drittel(daten)


def test_kind_ohne_schlaf_aber_zu_hause():
    """Ein Kind hat keinen Schlafblock, sondern ist von 21 bis 7 Uhr zu Hause."""
    kind = {
        "ort": "x",
        "kind": True,
        "bloecke": [
            {"art": "arbeit", "von": 7, "bis": 16},
            {"art": "freizeit", "von": 16, "bis": 21},
            {"art": "zuhause", "von": 21, "bis": 7},
        ],
    }
    assert ta.pruefe_form("lily", kind) == []


def test_questfigur_braucht_ort_oder_festhalten():
    """Eine Questfigur ohne Questort im Ablauf braucht ``festhalten: regel1``."""
    block = {"art": "arbeit", "von": 0, "bis": 0, "karte": "a.park", "feld": [1, 1]}
    ohne = {"lily": {"ort": "a", "questorte": ["a.aussen"], "bloecke": [block]}}
    assert ta.pruefe_quest(ohne)
    ohne["lily"]["festhalten"] = "regel1"
    assert ta.pruefe_quest(ohne) == []
