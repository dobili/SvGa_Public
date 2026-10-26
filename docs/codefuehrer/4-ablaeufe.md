# Sechs Wege durch den Code

Hier ist für die wichtigsten Abläufe beschrieben, welche Dateien nacheinander beteiligt sind. In
der [Konzeptkarte](7-konzeptkarte.md) kannst du jede Datei anklicken und den Weg verfolgen.

### 4.1 Die App startet

1. `main.tsx` lädt Schriften und Aussehen, meldet den Service Worker an (`app/offline.ts`) und
   lädt deine gespeicherten Daten (`speicher/speicher.ts`).
2. `app/App.tsx` zeigt den Bildschirm oben auf dem Stapel (`app/stapel.ts`); beim ersten Start
   die Startanimation und das Angebot des Rundgangs (`tour/TourAngebot.tsx`).
3. Im Hintergrund prüft `app/offlineKern.ts`, ob eine neue Version da ist; dann erscheint
   `UpdateHinweis`.

### 4.2 Eine Abbildung öffnen und ein Werkzeug anwenden

1. `ui/bildschirme/Buch.tsx`: Du tippst eine Abbildungsnummer; `daten/finde.ts` versteht sie.
2. `ui/bildschirme/Abbildung.tsx` lädt das Kapitel (`ui/komponenten/bausteine/useDaten.ts` →
   `daten/laden.ts`) und zeigt das Brett mit den Markierungen des Buches
   (`ui/komponenten/abbildung/buchmarkierungen.ts` → `ui/brett/Brett.tsx`).
3. Du wählst ein Werkzeug in der Leiste (`Werkzeugleiste.tsx`, `useWerkzeugwahl.ts`).
4. `ui/komponenten/werkzeugwahl/werkzeugergebnis.ts` ruft das Werkzeug über das Verzeichnis
   `analyse/register.ts` auf, zum Beispiel `analyse/k1-zaehlen.ts`. Es nutzt das Stellungsprofil
   (`analyse/stellungsprofil.ts`) und darunter die Schachbausteine aus `schach/`
   (`angriffskarte.ts`, `abtausch.ts`).
5. Die Sätze zeigt `ui/komponenten/werkzeugkarten/Werkzeugkarte.tsx` unter dem Brett
   (`ui/bildschirme/AbbildungKarten.tsx`), die Marken erscheinen auf dem Brett.
6. Auf Wunsch bewertet die Engine die Stellung (`EngineKarte.tsx` → `engine/engineDienst.ts` →
   Stockfish).

### 4.3 Eine Partie gegen einen Bot: Wie entsteht sein Zug?

1. `ui/bildschirme/Spielen.tsx`: Gegner, Uhr und Farbe wählen; „Partie beginnen“ legt eine
   Partie an (`spiel/partie.ts`, gespeichert über `speicher/partien.ts`).
2. `ui/bildschirme/Partie.tsx` mit dem Hook `ui/komponenten/partie/usePartie.ts`: Du ziehst am Brett,
   `spiel/ablauf.ts` spielt den Zug und drückt die Uhr.
3. Ist der Bot am Zug, holt `ui/komponenten/partie/botzug.ts` seinen Zug:
   - In der Eröffnung spielt er oft einen Zug aus dem **Praxisbuch** (`engine/praxisbuch.ts`):
     so, wie echte Menschen seiner Stärke auf Lichess eröffnen.
   - Danach fragt `engine/zugwahl.ts` die Engine nach Kandidatenzügen (`engine/grundschicht.ts`)
     und wählt mit `engine/menschenwahl.ts` menschlich: `engine/wahlmodell.ts` gibt jedem
     Kandidaten eine Wahrscheinlichkeit, wie ein Mensch dieser Wertung ihn wählen würde; Maia
     (`engine/maia.ts`) steuert ab dem zehnten Halbzug ihre Einschätzung bei, wenn sie geladen
     ist. Charakter und Stil des Bots verschieben die Gewichte (`engine/wahlschritt.ts`,
     `engine/stile.ts`), Fehlerarten und blinde Flecken kommen in der Häufigkeit dazu, die
     Menschen dieser Stärke zeigen (`engine/menschenprofil.ts`, `engine/fehlerart*.ts`).
   - `spiel/botzeit.ts` und `engine/bedenkzeit.ts` lassen ihn so lange „nachdenken“, wie ein
     Mensch es täte, und ziehen die Zeit von seiner Uhr ab.
   - Im Gruppenmodus wählt jeder Bot der Gruppe einen Zug, und die Gruppe stimmt ab
     (`engine/gruppenwahl.ts`).
4. `ui/brett/Zuganimation.tsx` lässt die Figur gleiten, `spiel/ergebnis.ts` prüft nach jedem Zug,
   ob die Partie zu Ende ist.

### 4.4 Die Partie ist zu Ende: Auswertung und Spielstärke

1. `ui/komponenten/auswertung/useAuswertung.ts` lässt die Engine jede Stellung der Partie bewerten (im
   Hintergrund, schon während der Partie, wenn du am Zug bist).
2. `spiel/auswertung.ts` gibt jedem Zug eine Klasse und ein Zeichen (bester Zug, Theoriezug,
   Ungenauigkeit, Fehler …); `schach/theorie.ts` erkennt Theoriezüge.
3. `spiel/genauigkeit.ts` rechnet die Genauigkeit je Seite und je Phase; `spiel/elomodell.ts` macht
   daraus eine geschätzte Elo-Zahl (geeicht an 77 000 Lichess-Partien).
4. Bei einer gewerteten Partie rechnet `spiel/wertung.ts` deine Wertung weiter, mit der
   gemessenen Stärke des Bots (`engine/botstaerke.ts`) als Gegnerzahl.
5. Die Oberfläche zeigt das in `Auswertung.tsx`, `Rueckblickkarte.tsx`, `Verlaufskurve.tsx`,
   `Zugklassen.tsx`; im Profil in `Wertungskurve.tsx`.

### 4.5 Eine Trainingsrunde

1. `ui/bildschirme/Training.tsx` listet die Trainer je Kapitel (`training/trainer.ts`).
2. `ui/bildschirme/Trainer.tsx` öffnet den Bereich des gewählten Trainers, etwa
   `ui/trainer/TaktikBereich.tsx`: Thema und Stufe wählen.
3. Die Logik im Ordner `training/` wählt die Aufgaben (`training/taktiktrainer.ts`), oft aus den
   Abbildungen des Buches (`training/buchstellungen.ts`).
4. `ui/trainer/useRunde.ts` und `Rundenrahmen.tsx` führen durch die Runde; je Aufgabe eine
   Aufgabendatei (`Taktikaufgabe.tsx`). Am Ende speichert `speicher/fortschritt.ts` das Ergebnis.
   Falsch gelöste Aufgaben aus Taktik, „Falle oder Köder“ und Strukturerkenner kommen als Karte in
   die Wiederholung (`ui/trainer/kartenantwort.ts` → `training/wiederholung.ts`).

### 4.6 Speichern, Sichern, Offline

- Jede Änderung (Zug, Haken, Einstellung) geht über `speicher/speicher.ts` sofort in die
  Datenbank des Geräts.
- `speicher/sicherung.ts` packt alles in eine Datei zum Sichern und spielt sie wieder ein.
- `sw.ts` hält alle Dateien der App bereit, damit sie ohne Netz startet; das Maia-Paket lädt
  `app/maiapaket.ts` nur auf Wunsch.

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
