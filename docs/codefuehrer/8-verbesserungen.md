# Verbesserungen für später

Was bei der Durchsicht des Codes am 26.10.2026 aufgefallen ist (Wunsch des Autors: als To-do für
später notieren). Nichts davon ist ein Fehler, den Leser bemerken; es geht um Ordnung, Lesbarkeit
und Wartung. Erledigtes wird hier gestrichen und in `docs/ENTSCHEIDUNGEN.md` festgehalten.

Aufwand: **klein** (unter einer Stunde), **mittel** (ein Arbeitspaket), **groß** (mehrere Sitzungen).

## Erledigt am 26.10.2026

Zwei Dateien über 400 Zeilen geteilt, README-Regel zur Hülle genauer gefasst, Köpfe der erzeugten
Dateien, `ui/komponenten/` in 19 Themenordner, Messcode nach `engine/messung/` und
`spiel/messung/`, 15 der 18 gegenseitigen Importe aufgelöst, doppelter Wahlkontext, 21 ungenutzte
Texte gelöscht und ein Test dagegen, Zeitgrenze für den Browser-Schritt der CI, Prüfmessung Blitz
mit Maia Stufe 7 (bestätigt), Wiederholung Blitz ohne Maia Stufe 8 (Ausreißer war Zufall). Einzelheiten in `docs/ENTSCHEIDUNGEN.md`.

## Noch offen

- [ ] **116 exportierte Werte ohne Kommentar**, meist Zahlen und Tabellen (etwa Grenzwerte).
      `node skripte/konzeptkarte.mjs` listet sie. Aufwand: mittel.
- [ ] **Versionsgeschichte in den Dateiköpfen.** Rund 255 Dateiköpfe erzählen, seit welcher
      Version was gilt („seit 0.2.117 …, bis 0.2.143 …“). Die Köpfe auf den heutigen Stand kürzen,
      die Geschichte steht in `docs/ENTSCHEIDUNGEN.md`. Aufwand: groß (je Ordner möglich).
- [ ] **57 Texte noch zu prüfen:** Der Test `i18n/ungenutzt.test.ts` hält sie für ungenutzt, sie
      können aber über Variablen zusammengesetzt sein (Liste `NOCH_ZU_PRUEFEN` im Test). Je Text
      prüfen und löschen oder als benutzt belegen. Aufwand: klein bis mittel.
- [ ] **Drei gegenseitige Importe nur über Typen** in `ui/komponenten/`: Rueckblickkarte ↔
      useRueckblick, Werkzeugleiste ↔ useWerkzeugwahl, Werkzeugleiste ↔ werkzeugordnung.
      Unkritisch, aber leicht zu lösen (Typen in eigene Datei). Aufwand: klein.

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
