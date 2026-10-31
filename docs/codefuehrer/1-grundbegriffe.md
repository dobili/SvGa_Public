# Grundbegriffe

| Wort | Bedeutung |
| --- | --- |
| **Datei** (`.ts`, `.tsx`) | Ein Stück Programm in TypeScript, einer Sprache für Web-Apps. `.tsx` enthält zusätzlich Bausteine der Oberfläche. |
| **Funktion** | Ein benanntes Rezept: Eingaben rein, Ergebnis raus. Beispiel: `zaehle(stellung, feld)` gibt Angreifer und Verteidiger eines Feldes zurück. |
| **Komponente** | Ein Baustein der Oberfläche, Name mit großem Anfangsbuchstaben, etwa `Brett` oder `Partieuhr`. Komponenten setzen sich zu Bildschirmen zusammen (Technik: React). |
| **Hook** (`use…`) | Eine Hilfsfunktion für Komponenten, die sich etwas merkt oder im Hintergrund arbeitet, etwa `usePartie` (hält die laufende Partie). |
| **Import** | Eine Datei benutzt etwas aus einer anderen. Diese Verbindungen sind die Linien der Konzeptkarte. |
| **Dateikopf** | Der Kommentar oben in jeder Datei: Zweck, „Rolle im Gesamtbild“, Abhängigkeiten, Buchbezug. Das ist die erste Anlaufstelle beim Lesen einer Datei. |
| **Test** (`.test.ts`) | Prüft automatisch, ob eine Datei richtig rechnet, meist an Abbildungen des Buches. Liegt neben der Datei. |
| **`-daten.ts`** | Reine Zahlentabellen, die ein Skript aus Messungen erzeugt (Bot-Stärken, Lichess-Statistiken). Nicht von Hand ändern. |
| **Engine** | Stockfish, das Schachprogramm, das im Hintergrund rechnet. |
| **FEN** | Eine Stellung als eine Textzeile, so speichert das Buch jede Abbildung. |

Die Namen im Code sind deutsch und folgen dem Buch (`zielbilanz`, `todsuenden`, `opposition`),
ohne Umlaute.


## Woran man sich beim Lesen festhalten kann

- **Jede Datei beginnt mit ihrem Zweck.** Der Dateikopf sagt in ein, zwei Sätzen, was die Datei
  tut, dann unter „Rolle im Gesamtbild“, wofür sie gebraucht wird, unter „Abhängigkeiten“, welche
  Dateien sie benutzt, und oft den Buchbezug („Regel: Kapitel 1, Zählen von Angreifern und
  Verteidigern“).
- **Jede öffentliche Funktion hat einen Kommentar** mit Zweck, oft einem Beispiel aus dem Buch
  (etwa „Abb. 6.20 → Läufer c1“) und den Sonderfällen.
- **Versionsangaben im Kommentar** („seit 0.2.117“, „Wunsch des Autors, 19.10.2026“) sagen, wann
  und warum etwas dazukam; die Begründung steht dann in `docs/ENTSCHEIDUNGEN.md`.
- **Tests neben der Datei** (`k1-zaehlen.test.ts` neben `k1-zaehlen.ts`) zeigen an echten
  Abbildungen, was herauskommen soll. Sie sind oft die anschaulichste Beschreibung.
- **Die Regeln für den Code** stehen in `CLAUDE.md` (Abschnitt „Feste Regeln“): Dateien unter 400
  Zeilen, Funktionen unter 40 Zeilen, keine nackten Zahlen, alles auf Deutsch.

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
