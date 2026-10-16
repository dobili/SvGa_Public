# `engine/` – Stockfish auf dem Gerät

| Datei             | Aufgabe                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `engineDienst.ts` | Engine im Web Worker starten, bewerten, abbrechen (Konzept 8.1)      |
| `uci.ts`          | Ausgaben der Engine lesen; Werte immer aus Sicht von Weiß            |
| `wertInWorten.ts` | „ausgeglichen“, „leicht besser“ … mit den Grenzen aus Konzept 8.1    |
| `fallenpruefung…` | Falle oder Köder: Schlag gegen besten anderen Zug (k4-falle)         |
| `gegnerplan.ts`   | Nullzug: Was würde der Gegner spielen? (k6-gegner)                   |
| `ruhe.ts`         | Hauptvariante bis zur Ruhe in Vier-Halbzug-Schritten, Bilanz (k7)    |
| `stufen.ts`       | Acht Spielstufen mit Verfahren (Konzept 8.2) – **Platzhalter**       |
| `fehlerart.ts`    | Typischer Anfängerfehler eines Zuges – **Platzhalter**               |
| `zugwahl.ts`      | Zug der Engine je Stufe, Buchzüge, Fehlerprotokoll – **Platzhalter** |

Die Engine-Dateien kopiert `skripte/kopiere-engine.mjs` beim Build aus dem npm-Paket `stockfish`.

Spiel gegen die Engine (AP 11): `stufen.ts`, `fehlerart.ts` und `zugwahl.ts` sind die
abgegrenzte Schnittstelle für Stufen und Fehlerprofile. Die Werte darin sind Startwerte aus
Konzept 8.2 (Opus, 15.10.2026); Kalibrierung und die übrigen Fehlerarten folgen mit Fable. Die
Oberfläche kennt nur `STUFEN`, `stufe()` und `waehleZug()`.
