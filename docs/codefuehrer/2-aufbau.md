# Der Aufbau im Ganzen

```
 Buch (LaTeX, privat)                              Lichess-Daten, Messungen
        │                                                     │
        ▼                                                     ▼
 pipeline/ (Python, nur beim Bauen)          app/skripte/ (Messläufe, Auswertungen)
        │  liest, prüft, baut                                 │  erzeugen *-daten.ts
        ▼                                                     ▼
 app/public/daten/  ── JSON je Kapitel ──►  app/src/  (die App auf dem Gerät)
                                                 │
   ┌─────────────────────────────────────────────┼──────────────────────────────┐
   │ ui/  Bildschirme und Bausteine der Oberfläche (alles, was man sieht)        │
   ├────────────┬───────────┬────────────┬────────────┬──────────────┬──────────┤
   │ analyse/   │ training/ │ spiel/     │ engine/    │ speicher/    │ app/     │
   │ Werkzeuge  │ Trainer   │ Partie,    │ Stockfish, │ Daten auf    │ Start,   │
   │ des Buches │           │ Auswertung │ Bots, Maia │ dem Gerät    │ Navigation│
   ├────────────┴───────────┴────────────┴────────────┴──────────────┴──────────┤
   │ schach/  Schachlogik in den Begriffen des Buches  ·  daten/  Buchdaten laden │
   │ i18n/  alle Texte (de.json, en.json)                                         │
   └──────────────────────────────────────────────────────────────────────────────┘
        sw.ts: Service Worker, hält alles für den Offline-Betrieb bereit
```

Die wichtigste Regel des Aufbaus: **Die Abhängigkeiten zeigen nach unten.** Die Oberfläche
(`ui/`) benutzt alle anderen Teile, aber kein anderer Teil kennt die Oberfläche. Die
Schachlogik (`schach/`) weiß nichts von Bildschirmen, die Werkzeuge (`analyse/`) nichts vom
Speicher. So lässt sich jeder Teil allein prüfen, und eine Änderung am Aussehen kann keine
Schachregel verändern.

Zur Zeit des Bauens macht die Python-Pipeline aus dem LaTeX des Buches geprüfte Daten (eine
JSON-Datei je Kapitel mit allen Abbildungen, Pfeilen, Feldmarken und Bildunterschriften). Auf
dem Gerät läuft danach nur noch die App, ganz ohne Server; sie liest diese Daten.

## Was außerhalb von `app/src/` liegt

| Ort              | Inhalt                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `pipeline/`      | Python: liest das LaTeX des Buches, prüft es, baut die App-Daten und den Bericht der Befunde |
| `schemas/`       | Der „Vertrag“ zwischen Pipeline und App: wie die Daten aufgebaut sein müssen                 |
| `inhalte/`       | Zugfolgen (PGN), vorbereitete Texte, englische Übersetzungen, Lichess-Listen                 |
| `app/public/`    | Was die App ausliefert: Buchdaten, Bilder der Bretter, Porträts, Stockfish, Maia             |
| `app/skripte/`   | Hilfsprogramme: Daten kopieren, Bilder erzeugen, Messläufe, Auswertungen                     |
| `app/tests/e2e/` | Oberflächentests: ein Roboter bedient die App wie ein Mensch (Playwright)                    |
| `docs/`          | Diese Datei, Entscheidungen, Fortschritt, Aufgaben für dich                                  |

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
