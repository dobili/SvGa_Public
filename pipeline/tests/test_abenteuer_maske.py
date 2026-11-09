"""Tests der Sperrregel für Möbel (pipeline/abenteuer/maske.py)."""

from pipeline.abenteuer.maske import maskenfelder


def test_standard_ohne_oberste_reihe_und_frei_unten():
    bett = {"breite": 32, "hoehe": 48}
    assert maskenfelder(bett) == {(0, 1), (1, 1), (0, 2), (1, 2)}
    assert maskenfelder(bett | {"frei_unten": 1}) == {(0, 1), (1, 1)}
    assert maskenfelder({"breite": 16, "hoehe": 16}) == {(0, 0)}


def test_maske_ersetzt_die_regel():
    # Offenes Tor: nur die Pfosten sperren, der Durchgang in der Mitte bleibt frei.
    tor = {"breite": 64, "hoehe": 48, "frei_unten": 1, "maske": ["....", "#..#", "#..#"]}
    assert maskenfelder(tor) == {(0, 1), (3, 1), (0, 2), (3, 2)}
    # Viehgatter quer: auch die oberste Reihe sperrt.
    assert maskenfelder({"breite": 32, "hoehe": 64, "maske": ["##", "##", "##", "##"]}) == {
        (x, y) for x in range(2) for y in range(4)
    }
