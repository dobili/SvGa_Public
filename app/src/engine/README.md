# `engine/` – Stockfish auf dem Gerät

| Datei             | Aufgabe                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `engineDienst.ts` | Engine im Web Worker starten, bewerten, abbrechen (Konzept 8.1)      |
| `uci.ts`          | Ausgaben der Engine lesen; Werte immer aus Sicht von Weiß            |
| `wertInWorten.ts` | „ausgeglichen“, „leicht besser“ … mit den Grenzen aus Konzept 8.1    |
| `fallenpruefung…` | Falle oder Köder: Schlag gegen besten anderen Zug (k4-falle)         |
| `gegnerplan.ts`   | Nullzug: Was würde der Gegner spielen? (k6-gegner)                   |
| `ruhe.ts`         | Hauptvariante bis zur Ruhe in Vier-Halbzug-Schritten, Bilanz (k7)    |
| `stufen.ts`       | Acht Spielstufen: Grundstärke, Fehlerquote, Höchstverlust (Konzept 8.2) |
| `fehlerart.ts`    | Die sechs Fehlerarten, geprüft mit den Werkzeugen der Kapitel 1, 4, 7 |
| `fehlersuche.ts`  | Fehlerzug der Stufen 1 bis 4: Werkzeuge + gezielte Engine-Bewertung  |
| `spielbewerter.ts`| Gemeinsame Typen der Zugwahl, Werte in Bauerneinheiten               |
| `zugwahl.ts`      | Zug der Engine je Stufe, Buchzüge, Fehlerprotokoll                   |
| `stufen.messung…` | Messlauf Stufe gegen Stufe (`npm run messen:stufen`, nicht in der CI)|

Die Engine-Dateien kopiert `skripte/kopiere-engine.mjs` beim Build aus dem npm-Paket `stockfish`.

Spiel gegen die Engine (AP 11): `stufen.ts`, `fehlerart.ts`, `fehlersuche.ts` und `zugwahl.ts`
sind die abgegrenzte Schnittstelle für Stufen und Fehlerprofile, kalibriert mit Fable
(16.10.2026, Messung mit `npm run messen:stufen`, Ergebnisse in `docs/ENTSCHEIDUNGEN.md`). Die
Oberfläche kennt nur `STUFEN`, `stufe()` und `waehleZug()`.
