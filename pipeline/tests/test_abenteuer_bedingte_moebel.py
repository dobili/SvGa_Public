"""Bedingte Möbel (``wenn`` an Szenenobjekten): Der Kartenbau schreibt die Bedingung als Eigenschaft.

Warum: Zustände wie Calloways Tisch mit Brett oder das Kreidebrett nach lilyGeholfen sollen ohne
Kartenkopie gehen (Wunsch des Haupt-Chats, 13.11.2026). Die App liest die Eigenschaft ``wenn`` und
zeigt das Möbel nur, wenn sie gilt (app/src/abenteuer/regeln/figurbedingung.ts); Gegenstände auf
einem bedingten Möbel erben dessen Bedingung, damit kein Brett in der Luft steht.
"""

from pipeline.abenteuer.kartenbau import platziere

MOEBEL = {
    "tisch": {"quelle": "t.png", "breite": 32, "hoehe": 32, "kollision": True},
    "brett": {"quelle": "b.png", "breite": 16, "hoehe": 16, "kollision": False},
}


def test_bedingung_wird_mitgegeben_und_vererbt():
    szene = {
        "objekte": [
            {"moebel": "tisch", "feld": [2, 2], "id": "t1", "wenn": "lilyGeholfen"},
            {"moebel": "brett", "auf": "t1"},
            {"moebel": "tisch", "feld": [6, 2]},
        ]
    }
    gesetzt, _ = platziere(szene, MOEBEL)
    assert [s.get("wenn") for s in gesetzt] == ["lilyGeholfen", "lilyGeholfen", None]
