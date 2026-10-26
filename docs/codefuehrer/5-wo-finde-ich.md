# Wo finde ich …?

| Frage | Datei(en) |
| --- | --- |
| Einen Text der App ändern | `app/src/i18n/de.json` (und `en.json`); den Schlüssel findest du, indem du den Text dort suchst |
| Wie stark ist Bot X? | `engine/botstaerke-daten.ts` (ohne Maia), `engine/botstaerke-maia-daten.ts` (mit Maia) |
| Name, Stil und Charakter eines Bots | `engine/gegnerliste1.ts`, `engine/gegnerliste2.ts`, Spaß-Bots in `engine/gegnerliste0.ts` |
| In welcher Stufe steht ein Bot? | `engine/botgruppen-daten.ts` |
| Die zehn Stufen und ihre Namen | `engine/stufen.ts` |
| Eine Regel eines Werkzeugs | `analyse/k<Kapitel>-<name>.ts`, die Rechnung meist in `schach/` |
| Ab wann ist ein Zug „?“ oder „??“? | `spiel/auswertung.ts` (Grenzen 0,5 / 1,2 / 3 Bauern) |
| Wie wird die Spielstärke geschätzt? | `spiel/genauigkeit.ts`, `spiel/elomodell.ts` |
| Die Schritte des Rundgangs | `tour/touren.ts`, Texte unter `tour.*` in `de.json` |
| Farben und Aussehen | `ui/stil/*.css` |
| Was ist auf dem Gerät gespeichert? | `speicher/format.ts` (der Aufbau der Daten) |
| Die Trainer und ihre Kapitel | `training/trainer.ts` |
| Die Daten einer Abbildung | `app/public/daten/de/a1/kapNN.json` (von der Pipeline erzeugt) |

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
