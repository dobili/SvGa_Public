"""Tests der Laufbahnen von Statisten auf schmalen Pfaden (laufbahn.py).

Befund vom Kanalweg (24.11.2026): Der Landvermesser lief mitten auf dem 4 Kacheln breiten
Treidelpfad; der eilige Spieler musste dreimal umplanen. Ohne privates Paket.
"""

from pipeline.abenteuer import laufbahn as L

# Ein senkrechter Pfad x 16 bis 19, Reihen 0 bis 20, und links daneben eine breite Fläche ab Reihe 10.
PFAD = {(x, y) for x in range(16, 20) for y in range(21)} | {
    (x, y) for x in range(0, 16) for y in range(10, 21)
}


def test_mitte_ist_befund_rand_nicht():
    q = L.quer((17, 0), (17, 9))
    assert L.mitten(L.strecke((17, 0), (17, 9)), q, PFAD) == [(17, y) for y in range(10)]
    assert L.mitten(L.strecke((16, 0), (16, 9)), q, PFAD) == []  # am Rand (x 15 ist zu)
    assert L.mitten(L.strecke((17, 11), (17, 20)), q, PFAD) == []  # dort ist es breit


def test_verschiebung_an_den_rand():
    assert L.verschiebung((17, 0), (17, 9), PFAD) == (-1, 0)
    assert L.strecke((2, 3), (5, 3)) == [(2, 3), (3, 3), (4, 3), (5, 3)]
    assert L.feld_aus("17,75") == (17, 75)


def test_keine_statisten_mitten_auf_schmalen_pfaden():
    # Dauertest: keine Laufstrecke mitten auf einem Pfad von höchstens 4 Kacheln (Ausnahmen mit Grund).
    assert [b.text() for b in L.alle_befunde()] == []


def test_verschieben_aendert_nur_die_textstellen():
    # Szenen sind verschieden formatiert; ein Neuschreiben änderte am Deich 1149 Zeilen.
    text = (
        '{"belebung": [\n  {"name": "helfer", "feld": [\n    70,\n    7\n  ],\n'
        '   "eigenschaften": {"von": "63,6", "bis": "79,6"}},\n  {"name": "fischer", "feld": [30, 6]}]}'
    )
    neu = L.verschiebe_im_text(text, "helfer", (0, -1))
    assert neu == text.replace("    7\n", "    6\n").replace('"63,6"', '"63,5"').replace('"79,6"', '"79,5"')
