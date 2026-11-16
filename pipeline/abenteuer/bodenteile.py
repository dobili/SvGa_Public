"""Bodenteile über anderen Bildern: Zeichentiefe nach der Ebene statt nach der Fußlinie.

Warum: Der Autor baut Treppenabgänge im Karteneditor selbst (Wunsch des Autors, 16.11.2026): ein
Treppenbild, teilweise mit Bodenkacheln (``bodenkacheln.py``, Art ``boden_teil``) abgedeckt; nur am
Loch bleibt der Übergang. Ein Bodenteil ohne Kollision läge sonst als „flach“ unter allem (Tiefe 1),
also unter der Treppe, die nach ihrem Fuß gezeichnet wird.

Regeln (gleich im Editor, ``werkzeuge/karteneditor/js/geometrie.js``; die App liest die Tiefe aus
der Tiled-Karte):

1. Ein Abgang (Art ``treppe``, ``richtung`` ``runter``), dessen Rechteck ein Bodenteil berührt, ist
   ein Loch im Boden: Er wird flach gezeichnet (Tiefe 1 plus ``ebene``), damit der Held auf den
   abgedeckten Kacheln über Treppe und Dielen läuft und nicht darunter verschwindet. Er zählt als
   Bodenöffnung (Regel 10.84, ``anordnung.pruefe_loecher``), auch ohne ``bodenoeffnung`` im Katalog.
2. Das Bodenteil liegt direkt darüber: Tiefe des höchsten berührten Abgangs plus 1, plus ``ebene``.

Über anderen Bildern bleibt ein Bodenteil flach (Tiefe 1); dort hilft „nach vorn“ (``ebene``).
Warum nur über Abgängen: Kaimauerkacheln im Hafen von Silicon Bay berühren große Bilder und wären
sonst über den Helden gesprungen. Ohne Abgang unter einem Bodenteil ändert sich nichts.
"""

BODENTEIL = "boden_teil"


def _beruehrt(a: dict, b: dict) -> bool:
    """Ob sich die Rechtecke zweier gesetzter Stücke (Pixel) überschneiden."""
    return (
        a["x"] < b["x"] + b["breite"]
        and b["x"] < a["x"] + a["breite"]
        and a["y"] < b["y"] + b["hoehe"]
        and b["y"] < a["y"] + a["hoehe"]
    )


def ist_abgang(angabe: dict) -> bool:
    """Ob ein Möbel ein Abgang nach unten ist. Beispiel: ``mf4TreppeAb`` (treppe, runter) → True."""
    return angabe.get("art") == "treppe" and angabe.get("richtung") == "runter"


def lege_bodenteile(gesetzt: list[dict], moebel: dict) -> None:
    """Setzt die Tiefe der Bodenteile und der abgedeckten Abgänge (Regeln oben), an Ort und Stelle.

    Eingaben: gesetzte Stücke aus ``kartenbau.platziere`` (mit ``tiefe``, Rechteck, ``ebene``),
    Möbelangaben. Beispiel: Treppe ``mf4TreppeAb`` bei (2, 4), Dielen ``bkDielen`` bei (2, 4) →
    Treppe Tiefe 1, Dielen Tiefe 2; ``abgedeckt`` an der Treppe.
    """
    teile = [s for s in gesetzt if moebel.get(s["name"], {}).get("art") == BODENTEIL and s["tiefe"] > 0]
    abgaenge = [
        s
        for s in gesetzt
        if ist_abgang(moebel.get(s["name"], {}))
        and s["tiefe"] - s.get("ebene", 0) > 0
        and any(_beruehrt(s, t) for t in teile)
    ]
    for s in abgaenge:
        s["tiefe"], s["abgedeckt"] = 1 + s.get("ebene", 0), True
    for t in teile:
        unter = [s["tiefe"] for s in abgaenge if _beruehrt(s, t)]
        if unter:
            t["tiefe"] = max(unter) + 1 + t.get("ebene", 0)
