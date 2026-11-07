# Auftrag niedrig-1: Prüfung der Tiled-Karten in der Pipeline

**Stand:** offen (Haupt-Chat, 07.11.2026, dritter Auftrag; die vier Karten von Maple Falls sind
zusammengeführt, die fehlenden Übergänge `schule`, `park`, `landstrasse` stehen jetzt in
`orte.json`, `landstrasse` noch ohne Ziel)
**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-aufgabenzuordnung`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `pipeline/tests/test_abenteuer_karten.py` (neu), `pipeline/abenteuer/__init__.py`
und `pipeline/abenteuer/karten.py` (neu; reine Prüffunktionen ohne Oberfläche),
`docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q` (alle Tests),
`ruff check pipeline` und `ruff format --check pipeline`

## Ziel

Die Regeln aus `inhalte/abenteuer/README.md` (Abschnitt Tiled-Karten) und dein eigenes
Erzeugungsskript haben Prüfungen, die bisher nur beim Erzeugen laufen. Sie sollen als Test in
der Pipeline bei jedem Push laufen, damit auch Karten der Helfer für Cedar Creek und spätere
Städte nichts kaputtmachen, was die Oberwelt braucht (`app/src/abenteuer/oberwelt/szene.ts`,
`Oberwelt.tsx`).

## Vorgaben

1. **Modul `pipeline/abenteuer/karten.py`** mit reinen Funktionen (Docstrings auf Deutsch wie
   in der übrigen Pipeline): Karte laden, Kachelebenen und Objektebene finden, Kollisionskacheln
   aus dem eingebetteten Kachelsatz lesen, Begehbarkeit (Breitensuche von `start`), Auslöser und
   Figuren mit Kachelkoordinaten.
2. **Test `pipeline/tests/test_abenteuer_karten.py`**, je Karte in `inhalte/abenteuer/karten/`
   (über `orte.json` gefunden, Feld `karten[].datei`):
   - Ebenen `boden`, `waende`, `objekte` als Kachelebenen mit `width × height` Zahlen,
     `ausloeser` als Objektebene; Kachelsatz eingebettet, Bild `../grafik/platzhalter.png`.
   - Genau ein Objekt `start` mit Eigenschaft `richtung` (oben, unten, links, rechts).
   - Jedes Objekt der Ebene `ausloeser` ohne `type = "figur"` hat einen Namen, der in
     `orte.json` unter `ausloeser` erklärt ist; jede Figur (`type = "figur"`) ist in `orte.json`
     unter `figuren` des Ortes eingetragen (Name = Teil nach dem Punkt).
   - Jeder Übergang mit `ziel` in `orte.json` hat auf der Zielkarte ein Objekt mit dem
     Zielnamen (`ziel.ausloeser`); Übergänge ohne `ziel` (etwa `landstrasse`) sind erlaubt und
     werden im Testbericht als „offen“ gezählt, nicht als Fehler.
   - Jeder Auslöser und jede Figur ist von `start` aus zu Fuß erreichbar (Kollisionskacheln
     nicht betretbar; Gegenstände und Figuren zählen als erreichbar, wenn ein freies Nachbarfeld
     erreichbar ist).
   - Rand geschlossen: Die äußerste Reihe und Spalte der Ebene `waende` ist überall Kollision,
     außer an Übergängen.
3. Die vorhandenen fünf Karten müssen bestehen; wo eine nicht besteht, die Karte nicht ändern,
   sondern den Befund in den Bericht (der Haupt-Chat entscheidet).
4. Kein Code in `app/`; keine Änderung an `orte.json`.

## Was nicht dazugehört

Neue Karten (Cedar Creek kommt, sobald mittel-2 die Daten geliefert hat), Grafik.

## Bericht

(vom Helfer auszufüllen)
