# Woher die Zahlen kommen

Viele Dateien mit `-daten.ts` am Ende sind Ergebnisse von Messungen und Auswertungen, nicht von
Hand geschrieben:

- **Bot-Stärken** (`botstaerke-daten.ts`, `botstaerke-maia-daten.ts`, `gruppenstaerke-daten.ts`):
  Tausende Partien der Bots gegeneinander und gegen Ankerstufen, bewertet von Stockfish in Tiefe
  18 (Skripte `app/skripte/messe-*.sh`, Auswertung `engine/botstaerke.messung.ts`).
- **Menschliches Verhalten** (`menschenprofil-daten.ts`, `wahlmodell-daten.ts`, `zeitnot-daten.ts`,
  `bedenkzeit-daten.ts`, `spielerbereiche-daten.ts`): aus Lichess-Partien echter Spieler.
- **Elo-Modell und Vergleiche** (`spiel/elomodell-daten.ts`, `spiel/umrechnung-daten.ts`,
  `spiel/zugklassenvergleich-daten.ts`): aus 77 000 gewerteten Lichess-Partien von 3 900 Spielern.
- **Praxisbuch** (`app/public/daten/praxisbuch.json`): ein Monat Lichess-Partien, gezählt je
  Zeitklasse und Stärke.

Wie diese Zahlen entstanden sind und warum, steht in `docs/ENTSCHEIDUNGEN.md`.

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
