# Schach-Abenteuer (`app/src/abenteuer/`)

Das optionale Story-Spiel zur App. Konzept, Stellungnahme, Architektur und Entscheidungen liegen in
`docs/spiel/`; diese Datei ist nur der Wegweiser durch den Code.

Grundsatz (docs/spiel/04_Architektur.md): Die App bleibt, wie sie ist. Das Spiel liegt vollständig
in diesem Ordner, wird erst auf Wunsch geladen und spricht mit der App nur über die Verträge in
`schnittstelle/`. Die wenigen Einhängepunkte in der App (Zusatzansicht, Erweiterungspunkt in der
Partieansicht, Feld `abenteuer` in den Nutzerdaten, Ausnahme im Größenbudget) stehen dort
aufgezählt.

| Ordner           | Aufgabe                                                               | Anfangen mit   |
| ---------------- | --------------------------------------------------------------------- | -------------- |
| `schnittstelle/` | Verträge zwischen App und Spiel: nur Typen, keine Implementierung     | `modul.ts`     |
| `inhalte/`       | Schemata und Beispiele der Datenformate (Schritt 4): Quests, Gegner … | `README.md`    |
| `oberwelt/`      | Phaser: Karte, Figur, Laufen, Auslöser (Schritt 5)                    | `Oberwelt.tsx` |
| `texte/`         | Oberflächentexte des Spiels, eigene kleine Datei je Sprache           | `de.json`      |

Die Partie selbst, die Aufgaben und das Brett kommen aus der App (`spiel/`, `training/`, `ui/`);
das Spiel ruft sie über die Dienste in `schnittstelle/modul.ts` auf.
