# Codeführer: Karteneditor

Der Autor rückt Karten selbst zurecht, ohne Code. Die Szenendateien bleiben die einzige Quelle;
der Editor ändert sie über einen Rücklauf mit Bericht. Anleitung für den Autor:
`docs/spiel/KARTENEDITOR.md`.

## Teile

- **Editorseite**: `werkzeuge/karteneditor/` (öffentlich, reines HTML und JavaScript).
- **Paket**: `python -m pipeline.abenteuer.editorpaket PRIVAT PRIVAT/editor` baut die Seite mit
  `daten.js`: alle Szenen, die Möbelbibliothek (`editorkatalog.py`), jedes Bild als data-URL,
  Hintergründe, Boden- und Wandkacheln, Übergänge aus `orte.json` und Standbilder der Figuren
  (`editorpersonen.py`). Das Paket liegt nur im privaten Repository, weil die Bilder gekauft
  sind; es läuft offline per Doppelklick.
- **Rücklauf**: `python -m pipeline.abenteuer.editorrueck PRIVAT/editor/rueck/DATEI.json --privat
PRIVAT` schreibt die Änderungen in die Szenen, berichtet je Karte, was verschoben, gedreht,
  hinzugefügt oder gelöscht wurde, und baut die Karten neu. Bericht und Vorschauen gehen nach
  `buch/arbeit/editor/` (nur lokal).

## Rücklauf im Einzelnen

- `editoruebergaenge.py`: neue, geänderte und gelöschte Übergänge nach `orte.json`.
- `editorfiguren.py`: Warnung, wenn ein Ink-Knoten oder eine Quest eine gelöschte Figur braucht.
- `editorzuschnitt.py`: Zuschnitte im Bericht und Vorschläge für eigene Katalogeinträge.
- `kollisionspinsel.py`: Kacheln unabhängig von Bildern sperren oder freigeben.
- `objektform.py`, `objektzuschnitt.py`, `objektkollision.py`, `objektmassstab.py`: was der
  Editor an einem Objekt ändern kann, so wie der Kartenbau und die App es lesen.

## Sicherheit

Weicht eine Szene auf der Platte vom „vorher“ der Änderungsdatei ab, wird sie nicht überschrieben;
der Bericht nennt sie als Konflikt (`--erzwingen` schreibt trotzdem).

## Regeln aus dem Editor

Was der Autor im Editor wiederholt ändert, wird eine Regel in `docs/spiel/KARTENREGELN.md`, damit
der Kartenbau es künftig selbst richtig macht (Entscheidung RO32).
