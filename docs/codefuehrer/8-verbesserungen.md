# Verbesserungen für später

Was bei der Durchsicht des Codes am 26.10.2026 aufgefallen ist (Wunsch des Autors: als To-do für
später notieren). Nichts davon ist ein Fehler, den Leser bemerken; es geht um Ordnung, Lesbarkeit
und Wartung. Erledigtes wird hier gestrichen und in `docs/ENTSCHEIDUNGEN.md` festgehalten.

Aufwand: **klein** (unter einer Stunde), **mittel** (ein Arbeitspaket), **groß** (mehrere Sitzungen).

## Erledigt am 26.10.2026

Alle Punkte der ersten Durchsicht: zwei Dateien über 400 Zeilen geteilt, README-Regel zur Hülle
genauer gefasst, Köpfe der erzeugten Dateien, `ui/komponenten/` in 19 Themenordner, Messcode nach
`engine/messung/` und `spiel/messung/`, alle 18 gegenseitigen Importe aufgelöst, doppelter
Wahlkontext, 65 ungenutzte Texte gelöscht und ein Test dagegen, rund 400 Dateiköpfe ohne
Versionsgeschichte, alle exportierten Werte kommentiert, Zeitgrenze für den Browser-Schritt der
CI, zwei Prüfmessungen. Einzelheiten in `docs/ENTSCHEIDUNGEN.md`.

## Noch offen

- [ ] **Kommentare in erzeugten Tabellen:** Einige erzeugte Dateien (etwa
      `spiel/elomodell-daten.ts`, `spiel/zugklassenvergleich-daten.ts`, `engine/botstaerke-daten.ts`)
      haben am 26.10.2026 Kommentare von Hand bekommen. Beim nächsten Neuerzeugen fallen sie weg;
      die Erzeuger (Messläufe) sollen sie selbst schreiben. Aufwand: klein je Erzeuger.
- [ ] **Versionsangaben innerhalb von Funktionen:** Die Dateiköpfe sind auf dem heutigen Stand,
      in den Funktionen stehen noch Hinweise wie „(seit 0.2.88)“. Bei Gelegenheit mitkürzen.
      Aufwand: klein, schrittweise.
- [ ] **Veraltete Dateinamen in Kommentaren** (Durchsicht 1.11.2026 für das Wiki): Einige
      Kommentare nennen Dateien, die beim Umbau der Startseiten und des Profils am 31.10.2026
      umbenannt oder ersetzt wurden, etwa `GegnerWahl.tsx` (heute `Gegnerstufen.tsx` und die
      Unterseite „Gegner aussuchen“), `NaechsterSchritt.tsx` und `Wochenkarte.tsx` (heute
      `Heutekarte.tsx`), `Wertungskurve.tsx` (heute `Wertungskurvenbild.tsx` und
      `ui/komponenten/wertung/`), `Partieende.tsx`, `Bereich.tsx`, `Auswahlliste.tsx`,
      `ZusatzWahl.tsx`, `Wiederholungsknopf.tsx`, `Falschzug.tsx`, `koenigUndAktivitaet.ts`,
      `useSprache.ts`. Die Konzeptkarte zeigt diese Sätze unverändert. Aufwand: klein.
- [ ] **Zwei Erklärsymbole und zwei Blätter:** `InfoKnopf`/`MitInfo` und `Infoblase`/`MitInfoblase`
      tun fast dasselbe (seit 0.3.42 beide mit ⓘ); ebenso gibt es `Blatt.tsx` zweimal
      (`ui/komponenten/auswertung/` und `ui/komponenten/spielstart/`). Zusammenlegen spart Code und
      macht das Verhalten überall gleich. Aufwand: mittel (viele Fundstellen, Oberflächentests).
- [ ] **19 exportierte Werte ohne Kommentar** meldet `node skripte/konzeptkarte.mjs`, meist Listen
      und Grenzwerte (etwa `TRAINERSTUFEN`, `ZUSATZTHEMENLISTE`, `GRUNDSTELLUNG`). Aufwand: klein.
- [ ] **Testdaten in der Konzeptkarte:** Das Skript lässt Dateien mit „testdaten“ im Namen weg,
      nicht aber Dateien im Ordner `speicher/testdaten/`; sie erscheinen als Modul. Aufwand: klein.
- [ ] **Zeittests unter Last:** Die Prüfungen „unter 50 ms“ (`analyse/alleAbbildungen.test.ts`) und
      einige 5-Sekunden-Grenzen scheitern, wenn mehrere Prüfläufe gleichzeitig laufen. In der CI
      laufen sie zuverlässig; lokal hilft ein einzelner Wiederholungslauf. Aufwand: klein.

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
