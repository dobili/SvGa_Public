"""Trainerdaten (AP 13, Zuarbeit): Übungen mit der Engine gegenprüfen und Aufgaben für die Trainer bauen.

Wozu dieser Ordner da ist:
    Die Trainer der App (Pflichtenheft 7: Taktiktrainer, Strukturerkenner, Falle oder Köder) brauchen
    Aufgaben mit Schwierigkeit, und die 86 Übungen des Buches sollen beim Lösen in der App auch
    gleichwertige Züge annehmen. Beides entsteht hier als Daten in ``inhalte/de/trainer/`` mit
    Schemas in ``schemas/trainer-*.schema.json``; die App baut später genau darauf.

Aufbau:
    engine.py       Stockfish 19 lite unter Node (wie zugfolgen/zugzeichen.py), reproduzierbar
    notation.py     Deutsche Kurznotation des Buches („1. Te7+!“) in Züge
    uebungen.py     Aufgabe 1: Lösungen der Übungen gegenprüfen → uebungen-engine.json
    schwierigkeit.py Schwierigkeit 1 bis 5 aus Engine-Messung und Lichess-Wertung
    lichess.py      Stichprobe aus der Lichess-Puzzle-Datenbank (CC0)
    taktik.py, falle.py, struktur.py  Aufgabe 2: je Trainer eine Datei
    daten.py        Schreiben und Prüfen der Dateien gegen die Schemas

Öffentlich: In die Dateien kommen nur Züge, Stellungen, Nummern und Kennungen, nie Buchtext.
"""
