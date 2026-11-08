# Woher die Zahlen kommen

## Die App in Zahlen (Version 0.3.43)

| Was | Anzahl |
| --- | --- |
| Abbildungen des Buches in der App | 765 in 13 Kapiteln (0 bis 12) |
| Werkzeuge des Buches | 34 |
| Trainer | 16 |
| Vorgefertigte Bots | 80 in zehn Stufen (acht je Stufe) und 4 Spaß-Bots |
| Stufen der Engine | 10 |
| Stufen der Erfahrung | 10 (von „Erster Zug“ bis „Meisterplan“) |
| Texte der Oberfläche | rund 5 000, auf Deutsch und Englisch mit denselben Schlüsseln |
| Dateien im App-Code (ohne Tests) | rund 940 mit zusammen etwa 117 000 Zeilen |
| Testdateien | 338 neben dem Code (Vitest) und 77 Oberflächentests (Playwright), Stand 0.3.54 |
| Datenformat auf dem Gerät | Version 10 (Stand 0.3.54) |

## Gemessene Tabellen

Viele Dateien mit `-daten.ts` am Ende sind Ergebnisse von Messungen und Auswertungen, nicht von
Hand geschrieben:

- **Bot-Stärken** (`botstaerke-daten.ts`, `botstaerke-maia-daten.ts`, `gruppenstaerke-daten.ts`,
  `reinestufen-daten.ts`): Tausende Partien der Bots gegeneinander und gegen Ankerstufen, bewertet
  von Stockfish in Tiefe 18 (Skripte `app/skripte/messe-*.sh`, Auswertung
  `engine/botstaerke.messung.ts`).
- **Menschliches Verhalten** (`menschenprofil-daten.ts`, `zeitnot-daten.ts`, `bedenkzeit-daten.ts`,
  `spielerbereiche-daten.ts`, `zeitklassenabstand-daten.ts`): aus Lichess-Partien echter Spieler.
- **Wahlmodell** (`wahlmodell-daten.ts` aus 180 000 Stellungen von 6 147 Lichess-Partien,
  `wahlmodell-maia-daten.ts` mit Maia aus rund 330 000 Stellungen): wie Menschen einer Wertung
  zwischen mehreren Zügen wählen.
- **Elo-Modell und Vergleiche** (`spiel/elomodell-daten.ts`, `spiel/umrechnung-daten.ts`,
  `spiel/zugklassenvergleich-daten.ts`): aus 77 000 gewerteten Lichess-Partien von 3 900 Spielern;
  seit 0.3.0 alle zehn Zugklassen mit der Regel der App gemessen (`spiel/zugklassen.messung.ts`).
- **Praxisbuch** (`app/public/daten/praxisbuch.json`): ein Monat Lichess-Partien, gezählt je
  Zeitklasse und Stärke.
- **Eröffnungen nach Spielstärke** (`app/public/daten/eroeffnungsbaender.json`): die häufigsten
  Eröffnungen echter Menschen je 200er-Band, aus der Lichess-Datenbank vom September 2026.

Wie diese Zahlen entstanden sind und warum, steht in `docs/ENTSCHEIDUNGEN.md`.

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
