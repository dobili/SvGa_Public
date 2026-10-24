"""Praxisbuch (0.2.128): Eröffnungszüge echter Menschen je Zeitklasse und Wertungsband.

Ablauf (lokal, Ergebnis nach app/public/daten/praxisbuch.json):

    g++ -O2 -o buch/arbeit/praxisbuch/zaehler pipeline/praxisbuch/zaehler.cpp
    python pipeline/praxisbuch/entpacke2.py URL 0 | buch/arbeit/praxisbuch/zaehler > voll.tsv
    python pipeline/praxisbuch/baue.py app/public/daten/praxisbuch.json voll.tsv [weitere Teile]

URL ist eine Monatsdatei der Lichess-Datenbank (database.lichess.org, CC0). Bricht die Verbindung
ab, verbindet entpacke2.py an derselben Stelle neu; startet man an einer zstd-Rahmengrenze, lässt
sich ein Monat auch in Teilen zählen (baue.py zählt die Teile zusammen).
"""
