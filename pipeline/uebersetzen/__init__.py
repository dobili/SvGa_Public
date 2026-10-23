"""Übersetzungsschicht: englische App-Daten aus den deutschen (Paket P6, R25, seit 23.10.2026).

Die deutschen Daten in ``app/public/daten/de/a1/`` bleiben die Quelle (CLAUDE.md, Regel 1). Die
englischen Sätze stehen ohne deutschen Text in ``inhalte/en/a1/``; ``python -m
pipeline.uebersetzen`` setzt beides zu ``app/public/daten/en/a1/`` zusammen. Begriffe nach
``docs/ENGLISCH_BEGRIFFE.md``.

Bausteine: ``vorlage.py`` (Textteile ↔ Satz mit Platzhaltern), ``felder.py`` (welche Felder Buchtext
sind), ``tabellen.py`` (Format der Tabellen), ``uebertragen.py`` (Tabelle auf Daten anwenden),
``pruefen.py`` (deutsche Züge, Restdeutsch), ``pruefhilfe.py`` (Deutsch/Englisch nebeneinander).
"""
