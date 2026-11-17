# Codeführer: Regeln und Spielstand

Die Spielregeln sind reine Funktionen in `app/src/abenteuer/regeln/`, ohne React und ohne
Phaser, jede mit Vitest-Tests. Fachliche Quelle ist das Regelwerk (`docs/spiel/06_Regelwerk.md`,
Regeln R1 ff.).

## Speicherung

- Der Spielstand ist das Feld `abenteuer` in den Nutzerdaten der App (Entscheidung A3). Damit
  gelten Sicherung, Import, „Alle Daten löschen“ und der dauerhafte Speicher der App auch fürs
  Spiel. Das Paket kann fehlen oder neu geladen werden, der Spielstand bleibt.
- Typen in `schnittstelle/spielstand.ts`: Quests (`Queststand`), Clubs mit Nadel
  (`Clubstand`), Figuren mit Zustand, Steckbrief und Dialogvariablen (`Figurenstand`), Position
  in der Welt (`Weltposition`), Handlung (Akt, Szene, Liga), Karten, Funde, Münzen. Der Stand hat
  eine eigene Versionsnummer (`ABENTEUER_VERSION`), unabhängig vom Format der App.
- Lesen und leer anlegen: `regeln/spielstand.ts` (`abenteuerstandAus`, `leererAbenteuerstand`).
- Auch Ort und Position liegen im Spielstand, nicht in Phaser, damit Zurück-Taste, Neuladen und
  Gerätewechsel sie behalten.

## Die Regeln

- **Wertung und Stärke**: `wertung.ts` (Abenteuerwertung), `gegnerstaerke.ts` (Stufe und
  Fehlerhäufigkeit aus Zielstärke, Zustand und Wertung), `staerkewechsel.ts` (Stärke ändert sich
  durch Dialog).
- **Quests**: `quests.ts` hält Ereignisse der Welt gegen die Questdaten und schreibt den
  Spielstand fort; `bedingung.ts` rechnet `wenn`-Ausdrücke; `figurbedingung.ts`,
  `dialogvariablen.ts`, `abwesenheit.ts` (wann Ambrose spricht).
- **Partie und Rückweg**: `rueckweg.ts` baut aus Ergebnis und Spieldaten den neuen Spielstand
  (Nadel, Wiedereinstieg); `karten.ts` (Kartenstufe, Nadel, Deck), `kartenzustand.ts`,
  `zeitkarten.ts`, `schutzengel.ts`, `zugerraten.ts`, `gelegenheiten.ts`.
- **Am Brett**: `partiemomente.ts`, `stellungsmerkmale.ts`, `tischereignisse.ts`,
  `tischgespraech.ts`.
- **Runden und Partieformen**: `aufgaben.ts` (Umfang, Schwierigkeit, Bestehen ab 70 Prozent),
  `gedaechtnis.ts`, `simultan.ts`.
- **Sammeln**: `funde.ts`, `finchjagd.ts`, `muenzen.ts`.

## Warum reine Funktionen

Die Gesamtsimulation in `pipeline/abenteuer/` spielt die Welt mit denselben Regeln durch. Reine
Funktionen lassen sich dort und in Vitest ohne Oberfläche prüfen.
