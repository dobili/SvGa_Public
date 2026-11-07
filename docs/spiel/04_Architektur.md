# Schach-Abenteuer – Architektur (Schritt 3)

Stand: 07.11.2026. Grundlage: `03_Technische_Stellungnahme.md` und die Antworten des Autors auf der Entscheidungsseite (in `ENTSCHEIDUNGEN.md`). Die Typen dazu liegen ohne Implementierung in `app/src/abenteuer/schnittstelle/`; diese Datei erklärt, warum sie so geschnitten sind. Pfade unterhalb `app/src/`.

## 1. Grundsatz: Die App bleibt, das Spiel kommt dazu

Das Spiel ist ein Modul, das die App auf Wunsch lädt. Es liegt vollständig in `abenteuer/` und spricht mit der App nur über die Verträge in `abenteuer/schnittstelle/`. Die App bekommt fünf kleine Einhängepunkte und sonst nichts:

| Nr. | Einhängepunkt                                                                                      | Datei der App                                                                         | Umfang                                          |
| --- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1   | Oberwelt als Zusatzansicht `abenteuer`                                                             | `app/zusatzansichten.ts`                                                              | eine Zeile                                      |
| 2   | Erweiterungspunkt in der Partieansicht: Liste `PARTIE_ERWEITERUNGEN`, Kartenleiste unter dem Brett | `ui/bildschirme/Partie.tsx`                                                           | eine Liste, ein Einhängepunkt (Entscheidung A4) |
| 3   | Optionales Feld `abenteuer: { kennung }` in der Partieeinstellung                                  | `spiel/partie.ts`                                                                     | ein Feld                                        |
| 4   | Feld `abenteuer` in den Nutzerdaten, Format 11                                                     | `speicher/format.ts`                                                                  | ein Feld, eine Umwandlung (Entscheidung A3)     |
| 5   | Paket außerhalb von Precache und Budget                                                            | `vite.config.ts`, `skripte/pruefe-groesse.mjs`, `sw/dateiliste.ts`, `public/_headers` | je eine Regel                                   |

Warum so streng: Die Buchbegleitung hat Vorrang und muss ohne das Spiel vollständig laufen. Außerdem will der Autor das fertige Spiel möglicherweise in ein privates Repository verschieben (Entscheidung A10); dann bleiben in der App genau diese fünf Stellen und der dynamische Import, und das Spiel zieht als Ganzes um.

Lizenzhinweis dazu (keine Rechtsberatung): Der Autor hält die Rechte am Code und kann ihn aus dem GPL-Repository in ein privates verschieben. Die App hängt aber an GPL-Bibliotheken (chessops GPL-3.0, Stockfish GPL-3.0, Brettbilder von Lichess AGPL). Ein Spiel, das die Partieansicht der App nutzt, nutzt diese Bibliotheken mit. Verkaufen ist unter der GPL erlaubt, aber Käufer haben Anspruch auf den Quelltext. „Privat und bezahlt“ heißt also „Quelltext nur an Käufer“, nicht „geschlossen“. Das ist mit dem heutigen Schnitt möglich; es ändert nichts an der Architektur.

```
 App (Kern, GPL, öffentlich)                      Zusatzpaket „Abenteuer“ (Cache abenteuer-<version>)
 ┌──────────────────────────────┐                 ┌─────────────────────────────────────────────┐
 │ app/zusatzansichten.ts ──────┼── Ansicht ────► │ abenteuer/ Oberwelt (Phaser), Dialoge (Ink), │
 │ ui/bildschirme/Partie.tsx ───┼── Erweiterung ► │ Kartenleiste, Clubtagebuch, Album (React)    │
 │ spiel/partie.ts (Feld)       │                 │                                              │
 │ speicher/format.ts (Feld) ◄──┼── Spielstand ── │ schnittstelle/: Verträge (nur Typen)         │
 │ engine/, training/, ui/brett │ ◄── Dienste ─── │ Daten: Gegner, Quests, Karten, Tiled, Ink    │
 └──────────────────────────────┘                 └─────────────────────────────────────────────┘
          │  dynamischer Import  assets/abenteuer-*.js  (nicht im Precache)
          ▼
   Appdienste → verbinde(dienste) → Abenteuermodul { Oberwelt, partieerweiterung, kurzstand }
```

## 2. Verträge (`abenteuer/schnittstelle/`)

| Datei             | Inhalt                                                                                                                                                     | Warum eigene Datei                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `modul.ts`        | `Appdienste` (was die App gibt), `Abenteuermodul` (was das Spiel gibt), `Partieerweiterung`, `Aufgabenauftrag`/`Aufgabenergebnis`, `Modullader`            | Die Modulgrenze an einem Ort; die App importiert nur diese Datei.                            |
| `gegnerprofil.ts` | `Gegnerprofil`, `Zielstaerke` (fest, aktuell, eingang), `Gegnerzustand` (abgelenkt, analysiert), `Steckbriefzeile`, `Gerechnetestaerke`                    | Jede Figur hat genau ein Profil; alles Spielbare wird in eine `Partieeinstellung` übersetzt. |
| `partie.ts`       | `Partieauftrag`, `Partieformat` (partie, stellungsduell, wiedereinstieg), `Startstellung`, `Partieergebnis`, `Schluesselmoment`, `Kipppunkt`, `Nadelstufe` | Der Weg hin und zurück zur Partieansicht.                                                    |
| `karten.ts`       | `Kartensorte`, `Kartenwirkung`, `Deck`, `Kartenbesitz`, `Kartenspiel`, `DECKGROESSE`                                                                       | Karten sind Sammelobjekt und Spielwirkung zugleich.                                          |
| `spielstand.ts`   | `Abenteuerstand` mit Handlung, Position, Clubs, Quests, Figuren, Karten, Protokoll; `ABENTEUER_VERSION`                                                    | Das Feld `abenteuer` der Nutzerdaten.                                                        |
| `paket.ts`        | `Paketverzeichnis`, `Paketdatei` (Gruppe, Staffel, SHA-256), `Paketzustand`                                                                                | Der optionale Download.                                                                      |
| `tausch.ts`       | QR-Codes für Tausch und Freundeskarte                                                                                                                      | Nur Karten und Grüße, nie der Spielstand.                                                    |

Regeln für die Verträge: alles `readonly`, keine Klassen, keine Funktionen außer Typsignaturen, keine Importe aus `ui/` (nur Typen aus `spiel/`, `engine/`, `schach/`, `training/`). Jede Erweiterung bekommt ein optionales Feld, kein Umbau.

## 3. Datenfluss: Begegnung → Partie → Rückweg

1. **Oberwelt** (Phaser): Der Held tritt auf einen Auslöser, Phaser meldet „Auslöser X“ nach oben; die React-Hülle öffnet den Ink-Dialog (Entscheidung C4: Phaser zeichnet nur Karte und Figuren, alles andere ist React).
2. **Dialog** (Ink): Am Ende ruft eine externe Funktion `beginnePartie(gegner)` auf. Das Spiel baut aus Profil, Figurenstand (abgelenkt?), gewähltem Deck und Format einen `Partieauftrag` mit eindeutiger Kennung und schreibt die Kennung als `laufendePartie` in den Spielstand (damit ein Neuladen mitten in der Partie weiß, wohin es zurück muss).
3. **App legt die Partie an** (`Appdienste.startePartie`): `baueEinstellung` übersetzt den Auftrag in eine `Partieeinstellung` (Start-FEN, Farbe, Stufen je Phase, Häufigkeit, Gewichte, Stil, Eröffnung, `gewertet: false`, `hilfen` aus, `ruecknahmeErlaubt` nur über die Karte, Feld `abenteuer: { kennung }`), ruft `neuePartie`, legt sie mit `mitLaufender` ab und navigiert zu `{ bildschirm: "partie", id }`. Vorbild: `useBeginne` in `ui/komponenten/spielstart/useSpielwahl.ts`.
4. **Partie** in der vorhandenen Ansicht. Die Kartenleiste (Erweiterungspunkt) sieht das Feld `abenteuer`, zeigt das Deck und spielt Karten über die `Partiesteuerung` (`spieleLeser`, `nimmZurueck`, Markierungen am Brett, `engine.bewerte` mit drei Varianten). Jede gespielte Karte landet sofort im Spielstand (nicht in der Partie der App), damit der Zähler auch ein Neuladen überlebt. Die Leiste wartet, solange `engineDenkt` gesetzt ist (ein Engine-Auftrag zur Zeit).
5. **Ende**: Der Partieabschluss zeigt bei Feld `abenteuer` den Knopf „Zurück zur Stadt“ statt „Neue Partie“. Beim Rückweg liest das Spiel über `liesErgebnis(kennung)` das `Partieergebnis` (Ausgang, PGN, Bot-Verluste, Rücknahmen, Dauer) und rechnet die Schlüsselmomente: Bot-Züge tragen `verlust` und `fehler` schon, die Züge des Lesers bekommen einen kurzen Durchgang mit der `auswertungsEngine` (Tiefe 10 bis 12, 0,5 s je Stellung); liegt die Hintergrundauswertung der App schon vor, wird sie genommen (Baustein F6).
6. **Kipppunkt** (Entscheidung B1): Nach einer Niederlage sucht das Spiel rückwärts die letzte Stellung des Lesers mit Bewertung innerhalb ±1 Bauer vor dem größten Verlust. Liegt sie nach Zug 10, bietet Ambrose den Wiedereinstieg an: neuer `Partieauftrag` mit `format: wiedereinstieg`, `startstellung: fen`, gleichem Profil und Zustand. Die Clubnadel ist dann höchstens Silber (B2); Straßengegner ohne Folgen.
7. **Spielstand**: Das Ergebnis wandert vollständig ins `protokoll` des Abenteuerstands (die Partienliste der App hält nur 50 Partien), `laufendePartie` wird null, Clubnadel, Belohnungskarten und Quest-Schritte werden gesetzt, Ambrose zeigt die zwei Momente.

Zählen für die App (Entscheidung A2): Mit `zaehltFuerApp: true` landet die Partie in der Partienliste und läuft durch `NACH_PARTIEENDE` (Tagesprotokoll, Rekorde, Erfahrung). Die Wirkungen „Wertung“, „Rivale“ und „Duell“ prüfen das Feld `abenteuer` und lassen die Partie aus; `gewertet` ist ohnehin false.

## 4. Spielstärke: Kurve und Umrechnung (Entscheidung A6, Erläuterung für den Autor)

Der Einwand des Autors ist richtig: Wenn jeder Clubchef nur 150 über der aktuellen Wertung läge, würde der Leser nie merken, dass er besser wird, und die Karten wären überflüssig. Deshalb zwei Bezugspunkte (`Zielstaerke`):

- **Eingangswertung** E: die Wertung des Lesers beim Start des Abenteuers (aus der App, sonst aus der ersten Story-Partie, Entscheidung A5). Sie wird einmal im Spielstand festgehalten und ändert sich nicht.
- **Aktuelle Wertung** A: die laufende Wertung der App; sie steigt, wenn der Leser besser wird.

| Gegner                        | Zielstärke                                 | Beispiel bei E = 800                       |
| ----------------------------- | ------------------------------------------ | ------------------------------------------ |
| Straßengegner                 | A − 100 bis A ± 0 (fair, kurz)             | 700 bis 800, steigt mit dem Leser          |
| Clubmitglied                  | A ± 0                                      | 800                                        |
| Clubchef n (1–8)              | E + 160 + 60 · n                           | Club 1: 1020 · Club 4: 1200 · Club 8: 1440 |
| Landesmeisterschaft           | E + 650 bis E + 750, Finale Victor E + 800 | 1450 bis 1600                              |
| Post-Game (zweiter Durchlauf) | alles + 300                                |                                            |

Die Lücke zwischen Leser und Clubchef wächst also von +220 (Club 1) auf +640 (Club 8). Geschlossen wird sie durch drei Dinge, und genau das ist das Spiel: (1) echtes Lernen (die Aufgabenreihen und die App-Trainer; 300 bis 500 Punkte in 15 bis 20 Stunden sind für Einsteiger realistisch), (2) Vorbereitung über die Story (Zustand „abgelenkt“, Faktor 1,3 bis 1,5 auf die Fehlerhäufigkeit entspricht grob 100 bis 200 Punkten), (3) Karten und Vorgaben (Springervorgabe entspricht grob 300 Punkten, Bauer f7 etwa 100 bis 150, Fingerzeig und Flüstern je nach Stellung). Wer alles ohne Karten schafft, hat sich die Goldnadel verdient; wer die Karten nutzt, bekommt Silber oder Bronze und einen Grund, später wiederzukommen. Die Zahlen stehen in einer Datei (`gegnerstaerke.ts`, Schritt 8) und werden nach den ersten Testpartien des Autors angepasst.

Umrechnung Ziel-Elo → Partieeinstellung: Die App hat 10 Stufen zu je 300 Elo (`engine/stufen.ts`), dazwischen regelt die Fehlerhäufigkeit (`haeufigkeit`, 1 = wie Menschen der Stufe). Stufe = aufgerundet(Ziel / 300), Häufigkeit aus dem Rest linear (1,4 am unteren Rand der Stufe bis 0,7 am oberen), multipliziert mit dem Zustandsfaktor; Phasenversatz des Profils dazu, alles begrenzt auf Stufe 1 bis 10. Diese reine Funktion bekommt einen Test gegen die gemessenen Bot-Stärken (`engine/botstaerke-daten.ts`).

## 5. Aufgabenreihen nach Zeitbudget (Entscheidung A7)

Der Autor will den Umfang nicht als feste Zahl, sondern aus der Spielzeit je Club. Richtwerte für einen Clubbesuch (Staffel 1): etwa 60 bis 90 Minuten Spielzeit, davon Clubpartie 20 bis 40 Minuten, Nebenquests und Straße 20 bis 30 Minuten, Aufgabenreihe 10 bis 15 Minuten, Dialoge 5 bis 10 Minuten.

Eine Taktikaufgabe der Schwierigkeit 1 bis 2 dauert mit den gestuften Hilfen der App etwa 40 bis 70 Sekunden, Schwierigkeit 3 etwa 90 Sekunden, Buchübungen mit Lesen etwa 2 Minuten. Daraus: **12 bis 15 Aufgaben je Club**, auf zwei bis drei Clubmitglieder verteilt (jedes stellt 4 bis 6 Aufgaben, das bleibt in der Welt verankert), 2 bis 3 davon Buchübungen des Kapitels, der Rest Motivaufgaben der Trainer mit Schwierigkeit aus der Wertung des Lesers (`Aufgabenauftrag.schwierigkeit`). Bestanden ab 70 Prozent; sonst stellt dasselbe Clubmitglied eine zweite Runde mit neuen Aufgaben. Die Spielzeit wird im Spielstand mitgezählt (`spielzeitSekunden`), damit der Autor nach seinen Testläufen die Richtwerte gegen die Wirklichkeit halten kann.

## 6. Speicher (Entscheidung A3)

- `Nutzerdaten.abenteuer: Abenteuerstand | null`, Format 11 der App. Die Umwandlung 10 → 11 setzt `abenteuer: null`. Der Stand hat `ABENTEUER_VERSION` für eigene Formatwechsel; die App erhöht ihr Format dafür nicht.
- Schreiben wie überall: neuer Stand als Ganzes, über `Appdienste.schreibeStand`. Der Stand ist klein (wenige KB plus PGN im Protokoll).
- Sicherung, Import, Löschen, `persist()`: nichts Neues nötig. Export per QR gibt es nur für Karten (`tausch.ts`).
- Zustände der Oberwelt (Karte, Position, Blickrichtung) liegen im Stand, damit Zurück-Taste, Neuladen und Gerätewechsel sie behalten; Phaser hält nichts, was länger als eine Szene lebt.

## 7. Zusatzpaket und Cache (Baustein F9)

- Ordner `public/abenteuer/` mit Verzeichnisdatei `paket.json` (`Paketverzeichnis`: Version, Dateien mit Bytes, SHA-256, Gruppe, Staffel). Die Verzeichnisdatei wird beim Build erzeugt (`skripte/baue-abenteuerpaket.mjs`, Schritt 5).
- Laden in der Seite wie `app/maiapaket.ts`: nacheinander, byteweiser Fortschritt, Prüfsumme je Datei, `paket.json` zuletzt als Marke „vollständig“. Fortsetzbar nach Abbruch (fehlende Dateien). Cache `abenteuer-<version>`; nach erfolgreichem Laden werden ältere `abenteuer-*`-Caches gelöscht. Dateien bleiben unter 15 MB (Cloudflare: 25 MiB).
- Staffeln: `Paketdatei.staffel` erlaubt, Staffel 2 erst zu laden, wenn sie beginnt; Musik ist die größte Gruppe und kann als letzte kommen („Spiel startet, Musik lädt im Hintergrund“).
- Code: Der dynamische Import `import("./abenteuer/modul")` erzeugt einen Chunk; über `output.chunkFileNames` bekommt er den Namen `assets/abenteuer-[hash].js`, und `sw/dateiliste.ts` nimmt `assets/abenteuer-*` wie die Sprachpakete aus dem Kern. Phaser und inkjs landen im selben Chunk (sie werden nur dort importiert).
- Budget: `pruefe-groesse.mjs` bekommt eine zweite Zusatzpaket-Regel `^abenteuer\/` und `^assets\/abenteuer-`; `globIgnores` in `vite.config.ts` nimmt `abenteuer/**` auf; `_headers` setzt `/abenteuer/*` auf `public, max-age=604800` (eine Woche) wie `/engine/*`, weil die Dateien versioniert sind.
- Fehlt der Cache, aber der Spielstand ist da (iOS hat aufgeräumt): Die Startkarte sagt „Spiel neu laden, dein Fortschritt bleibt“.

## 8. Oberfläche: Phaser nur für die Oberwelt (Entscheidung C4)

- `Oberwelt.tsx` (React) hält ein `<div>`, in dem Phaser läuft, und baut das Spiel beim Einhängen auf, zerstört es beim Aushängen (`game.destroy(true)`), pausiert es, wenn ein Dialog oder die Partie offen ist. Phaser ist Vollbild innerhalb der Ansicht; die untere Leiste der App bleibt sichtbar.
- Schnittstelle nach oben: `beiAusloeser(kennung)`, `beiPosition(position)` (beim Verlassen). Nach unten: `laufenErlaubt(boolean)`, `zeigeKarte(kennung, position)`.
- Dialoge, Menüs, Clubtagebuch, Kartenalbum, Partie: React-Komponenten der App-Optik, Texte über die Spieltexte.
- Steuerung: Richtungstasten als Touch-Steuerkreuz unten links, Wischen über die Karte, Tippen auf ein Ziel (Weg suchen). Zurück-Taste von Android schließt zuerst den Dialog, dann die Ansicht.

## 9. Texte und Lokalisierung (Baustein F11)

- Oberflächentexte des Spiels: `abenteuer/texte/de.json` (später `en.json`) mit eigenem typisiertem `t()`-Wrapper nach dem Muster von `i18n/sprache.ts`, damit `i18n/ungenutzt.test.ts` und die 480-KB-Datei der App unberührt bleiben. Ein eigener Test prüft gleiche Schlüssel je Sprache.
- Dialoge: `inhalte/dialoge/de/*.ink`, beim Build mit dem JavaScript-Compiler von inkjs nach JSON übersetzt und ins Paket gelegt (Gruppe `dialoge`). Externe Funktionen aus Ink: `gibKarte`, `setzeZustand`, `beginnePartie`, `beginneAufgaben`, `schalteSteckbrief`, `setzeSzene`.
- Namen der Figuren und Orte sind Textschlüssel, damit die englische Fassung sie übersetzen oder behalten kann.

## 10. Grafik: Zielbild statt Gameboy (Frage des Autors)

Der Autor fragt, ob die Grafik sich an den letzten Pokémon-Spielen für den Nintendo DS orientieren kann statt am Game Boy, weil Gameboy-Grafik für heutige Kinder zu schlecht sei. Antwort: Ja, und das ändert an der Architektur nichts. Die DS-Spiele sind weiterhin Kacheln in Draufsicht mit Pixelfiguren, nur mit mehr Farben, größeren Kacheln, Animationen (Wasser, Gras, Lampen), weichen Übergängen und einer modernen Oberfläche. Phaser und Tiled sind davon unabhängig: Kachelgröße, Ebenen und Animationen sind Parameter.

Konkret heißt das für die Planung: Die 16-Pixel-Kacheln von LimeZu werden mit Faktor 3 gezeichnet (eine Kachel 48 Bildschirmpixel), die Oberfläche (Dialoge, Porträts, Karten) ist nicht pixelig, sondern in der Schrift und Optik der App, Porträts sind hochauflösend, und die Welt bekommt Bewegung (animierte Kacheln, Tag-Nacht-Tönung je Ort, Wettereffekte als einfache Partikel). Das ist der Look moderner Pixel-Spiele, die Kinder heute spielen (Stardew Valley, Celeste), und zugleich das, was die späten DS-Pokémon machen. Nicht möglich ohne neuen Grafikkauf: die Perspektive der DS-Spiele mit 3D-Gebäuden und gekippter Kamera. Davon rate ich ab, weil es die Kosten vervielfacht und LimeZu dafür nicht gemacht ist. Der Begriff „Gameboy-Look“ in Dokument 01 war ohnehin unpassend; LimeZu ist schon volle Farbe. Folge für die Größe: Grafik verdoppelt sich etwa durch Animationen und Porträts (Schätzung in der Stellungnahme hält).

## 11. Tests

- Verträge: Typprüfung durch `tsc`; keine Laufzeittests nötig.
- Reine Funktionen (Stärke-Umrechnung, Clubnadel, Kipppunkt, Spielstand-Umwandlung, Paketverzeichnis): Vitest neben dem Code wie in der App, mit Beispielen aus den Buchkapiteln.
- Oberfläche: wenige Playwright-Tests (Paket laden, Oberwelt öffnen, eine Begegnung bis zur Partie und zurück), weil die CI heute 30 Minuten dauert.
- Kein Kindertest (Entscheidung C5); der Autor testet selbst, deshalb sammelt der Spielstand die Spielzeit je Ort, damit die Richtwerte aus Abschnitt 5 nachgemessen werden können.

## 12. Was Schritt 4 und 5 davon brauchen

- Schritt 4 (Datenformate): JSON-Schemata für `Gegnerprofil`, `Kartensorte`, Quests (Schritte, Auslöser, Belohnungen), Orte (Karten, Figuren, Auslöser), Spieltexte; ein Beispiel je Format aus Maple Falls; eine Ink-Szene (Fund des Bretts); eine Tiled-Karte (Dachboden).
- Schritt 5 (Prototyp): Einhängepunkte 1 bis 5, `Appdienste` als echte Funktionen, Oberwelt mit einem Raum und Platzhaltergrafik (CC0), ein Dialog, Partie gegen einen bestehenden Bot über einen `Partieauftrag`, Rückweg mit `Partieergebnis`, Paketlader ohne Prüfsummen-Ausnahmen, lauffähig auf dem Handy.
