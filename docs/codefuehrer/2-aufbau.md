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
   │ ui/  Bildschirme und Bausteine der Oberfläche (alles, was man sieht)       │
   │      auch Lernpfad, Erfolge, Karte „Heute“, Rückblick (Gamifizierung)      │
   ├────────────┬───────────┬────────────┬────────────┬──────────────┬──────────┤
   │ analyse/   │ training/ │ spiel/     │ engine/    │ speicher/    │ app/     │
   │ Werkzeuge  │ Trainer,  │ Partie,    │ Stockfish, │ Daten auf    │ Start,   │
   │ des Buches │ Ziele,    │ Auswertung │ Bots, Maia │ dem Gerät    │ Navigation│
   │            │ Rekorde   │            │            │              │          │
   ├────────────┴───────────┴────────────┴────────────┴──────────────┴──────────┤
   │ schach/  Schachlogik in den Begriffen des Buches  ·  daten/  Buchdaten laden │
   │ i18n/  alle Texte (de.json, en.json)                                         │
   └──────────────────────────────────────────────────────────────────────────────┘
        sw.ts: Service Worker, hält alles für den Offline-Betrieb bereit
        im Hintergrund: zwei Stockfish-Engines und Maia, je in einem eigenen Thread
```

Die wichtigste Regel des Aufbaus: **Die Abhängigkeiten zeigen nach unten.** Die Oberfläche
(`ui/`) benutzt alle anderen Teile, aber kein anderer Teil kennt die Oberfläche. Die
Schachlogik (`schach/`) weiß nichts von Bildschirmen, die Werkzeuge (`analyse/`) nichts vom
Speicher. So lässt sich jeder Teil allein prüfen, und eine Änderung am Aussehen kann keine
Schachregel verändern.

Zur Zeit des Bauens macht die Python-Pipeline aus dem LaTeX des Buches geprüfte Daten (eine
JSON-Datei je Kapitel mit allen Abbildungen, Pfeilen, Feldmarken und Bildunterschriften). Auf
dem Gerät läuft danach nur noch die App, ganz ohne Server; sie liest diese Daten.

## Die fünf Bereiche der Leiste

Die Leiste unten (`ui/komponenten/rahmen/Leiste.tsx`) führt zu fünf Startseiten:

| Bereich | Bildschirm | Was oben steht |
| --- | --- | --- |
| Buch | `Buch.tsx` | Karte „Heute“ (Woche, nächster Schritt), Nummernfeld, Kapitel, Knopf zum Lernpfad |
| Training | `Training.tsx` | Stapel der fälligen Wiederholungen, Wischreihen mit Trainern je Buchteil |
| Spielen | `Spielen.tsx` | laufende Partie, „Schnell eine Partie“, Kacheln zu den Unterseiten |
| Nachschlagen | `Nachschlagen.tsx` | Glossar, Denkroutine, Checkliste, Steckbriefe, Werkzeuge |
| Profil | `Ich.tsx` | Name und Porträt, Wertung, Fortschritt, Erfolge, Partien, Einstellungen |

## Listen zum Eintragen

Viele Teile der App sind **Listen**, in die ein neues Paket eine Zeile einträgt, statt bestehende
Bildschirme zu ändern (Wunsch des Autors: „später noch ergänzen können“):

| Liste | Datei | Wofür |
| --- | --- | --- |
| `ZUSATZANSICHTEN` | `app/zusatzansichten.ts` | weitere Bildschirme (Lernpfad, Rückblick, Fundstücke, Unterseiten der Einstellungen …) |
| `STARTKARTEN` | `ui/komponenten/start/startkarten.ts` | Karten oben im Buch (Heute, Rivale, Rückblick) |
| `PROFILKARTEN` | `ui/komponenten/profilkarten/profilkarten.ts` | Karten im Profil (Themen, Rekorde, Ziele …) |
| `NACH_DER_RUNDE` | `ui/trainer/nachDerRunde.ts` | Meldungen am Ende einer Trainerrunde |
| `NACH_PARTIEENDE` | `speicher/partieprotokoll.ts` | was nach jeder Partie eingetragen wird |
| `SPIELSEITEN` | `ui/komponenten/spielstart/spielseiten.tsx` | Unterseiten von „Spielen“ |
| `TOUREN`, `STARTTOUREN` | `tour/touren.ts`, `tour/starttouren.ts` | Schritte der Touren |

## Was außerhalb von `app/src/` liegt

| Ort | Inhalt |
| --- | --- |
| `pipeline/` | Python: liest das LaTeX des Buches, prüft es, baut die App-Daten und den Bericht der Befunde; dazu Wartung und Wiki des Dashboards |
| `schemas/` | Der „Vertrag“ zwischen Pipeline und App: wie die Daten aufgebaut sein müssen |
| `inhalte/` | Zugfolgen (PGN), vorbereitete Texte, englische Übersetzungen, Lichess-Listen, Fundstücke |
| `app/public/` | Was die App ausliefert: Buchdaten, Bilder der Bretter, Porträts, Holz, Extras, Stockfish, Maia |
| `app/skripte/` | Hilfsprogramme: Daten kopieren, Bilder erzeugen, Messläufe, Auswertungen, Konzeptkarte |
| `app/tests/e2e/` | Oberflächentests: ein Roboter bedient die App wie ein Mensch (Playwright) |
| `docs/` | Dieser Codeführer, Entscheidungen, Fortschritt, Aufgaben für dich |

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
