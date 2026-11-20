"""Prüfung „Tiefenordnung vor Gebäuden“ (pipeline/abenteuer/tiefenordnung.py).

Warum: Notiz des Autors (20.11.2026): Das Haus des Helden lag über ihm, wenn er vor der Haustür
stand (skalierte Villa, Bildunterkante statt Maske). Kein begehbares Feld vor einem Gebäude, einer
Veranda oder einem Zaun darf eine Figur unter dem Bild zeigen. Der erste Test hält die echten
Karten fest, die übrigen die Regel an kleinen Beispielen.
"""

from pipeline.abenteuer.tiefenordnung import grundlinie, pruefe, zeichentiefe


def test_keine_figur_unter_einem_gebaeude():
    """Alle Fassungen aller Karten: Vor jedem Bild steht die Figur darüber."""
    befunde = pruefe()
    assert befunde == [], "Figur unter dem Bild:\n" + "\n".join(befunde)


def test_grundlinie():
    """Letzte ganz gesperrte Reihe, sonst letzte mit Sperre, sonst keine."""
    assert grundlinie([".", "###", "#.#", "..."]) == 1
    assert grundlinie([".#.", ".#."]) == 1
    assert grundlinie(["..", ".."]) is None
    assert grundlinie(None) is None


def test_skalierte_villa_nach_maske():
    """Villa mit Maßstab 1,1: Tiefe nach der Maske, nicht nach der Bildunterkante (Vorgabe 365)."""
    maske = (
        ["........."] + ["#########"] * 9 + ["##.######", "##.######", "#...#####", "#...#####", "........."]
    )
    villa = {"x": 16, "y": 144, "breite": 143, "hoehe": 229, "tiefe": 365}
    assert zeichentiefe(villa, maske) == 144 + 10 * 16 - 8
    # Eine eigene Tiefe (an der Wand) bleibt.
    assert zeichentiefe({**villa, "tiefe": 40}, maske) == 40
