# Schach-Abenteuer – Entscheidungen

Jede Entscheidung zum Spiel steht hier, damit spätere Sitzungen (auch mit Opus) sie nachlesen
können. Neueste Einträge oben. Offene Fragen stehen unten in „Offen“; der Autor antwortet über
die Entscheidungsseite (Claude-Artefakt „Schach-Abenteuer Entscheidungen“) oder im Chat.

## 07.11.2026 – Teil A abgeschlossen

- **Stellungnahme** `03_Technische_Stellungnahme.md` geschrieben: Abgleich Konzept gegen Code,
  fehlende Bausteine F1–F12 mit Aufwand, Zuordnung der acht Clubs zu den Buchkapiteln,
  Technik-Bewertung, gemessene Größen, Risiken.
- **Spielstand im Speicherformat der App** (Autor, Chat 07.11.2026): Das Speicherformat darf bis
  zum Erscheinen des Buches jederzeit geändert werden; der Spielstand kommt als Feld `abenteuer`
  in die Nutzerdaten (Format 11). Begründung: Sicherung, Import, Löschen und dauerhafter Speicher
  kommen mit; der optionale Download ist nur Programm und Grafik (Cache), nicht Daten des Lesers.
- **Phaser 4.x** (aktuell 4.2.1, MIT) statt Phaser 3, weil Phaser 3 nicht weiterentwickelt wird.
- **Ink (inkjs)** für Dialoge, Compiler beim Build in JavaScript; **Tiled-JSON** für Karten.
- **Kein eigener Einstiegspunkt `/spiel/`**: Das Spiel ist eine Zusatzansicht innerhalb von
  `/app/` (`app/zusatzansichten.ts`), damit Offline-Betrieb, Zurück-Taste und Speicher mitkommen.
- **Zusatzpaket mit Version**: wie das Maia-Paket (`app/maiapaket.ts`), aber mit Verzeichnisdatei
  (Version, Dateiliste, Bytes, SHA-256) und Cache `abenteuer-<version>`.
- **Idee des Autors (Chat 07.11.2026): Wiedereinstieg nach einer Niederlage** ab Ende der
  Eröffnung, ab Ende des Mittelspiels oder ab der letzten noch nicht gekippten Stellung, statt die
  ganze Partie zu wiederholen. Technisch vorhanden: Phase je Stellung (`spiel/phasen.ts`),
  Bewertung je Zug aus der Auswertung, Partie aus jeder Stellung startbar. Empfehlung: Wiedereinstieg
  am Kipppunkt (letzte Stellung vor dem entscheidenden Fehler), einmal je Partie; gegen Clubchefs
  dann höchstens Silber. Entscheidung offen (B1, B2).

## 07.11.2026 – Antworten des Autors (Entscheidungsseite) und Schritt 3

**Angenommen wie empfohlen:** A1 Ordner `app/src/abenteuer/`, Arbeitsname „Schach-Abenteuer“ ·
A2 Story-Partien zählen für Partienliste, Tagesprotokoll, Erfahrung, Rekorde, nicht für Elo,
Rivalen, Duelle · A3 Spielstand als Feld `abenteuer` der Nutzerdaten, Format 11 · A4 Kartenleiste
als Erweiterungspunkt in `Partie.tsx` · A5 keine eigene Einstufung · A8 Aufgaben zählen für
Wiederholung und Tagesprotokoll · A9 Maia auf dem iPhone geladen und offline benutzt (Cache-Weg
bewiesen) · A10 privates Repository für Grafik, Porträts, Musik · A11 Ink je Sprache, Deutsch
zuerst · A12 Phaser 4 · B1 Wiedereinstieg am Kipppunkt · B2 Wiedereinstieg kostenlos, Clubnadel
dann höchstens Silber · C2 Schummeln mit der Partieauswertung aufdecken · C3 Ambroses
Erinnerungen als Zugerraten · C4 Phaser nur für die Oberwelt · C6 „Clubnadel“ · C7 wachsender
Steckbrief.

**Anders entschieden oder ergänzt:**

- **A6 Gegnerstärke (Autor: „Später, erläutern“):** Nicht alle Clubs 150 über der eigenen Wertung;
  der Leser soll sich anstrengen, lernen und am Ende besser sein; Karten und Vorgaben sind dafür
  da, stärkere Gegner schlagbar zu machen, und erhöhen den Wiederspielwert. Umsetzung: zwei
  Bezugspunkte (Eingangswertung E beim Start, aktuelle Wertung A); Clubchef n = E + 160 + 60·n,
  Straße A − 100 bis A, Landesmeisterschaft E + 650 bis 800, Post-Game + 300. Tabelle und
  Begründung in `04_Architektur.md`, Abschnitt 4; Zahlen in einer Datei, Anpassung nach den
  Testpartien des Autors.
- **A7 Aufgabenreihen (Autor: Nein):** Nicht sechs Aufgaben fest, sondern Umfang aus einem
  Zeitbudget je Club. Richtwerte: Clubbesuch 60 bis 90 Minuten, Aufgabenreihe 10 bis 15 Minuten,
  daraus 12 bis 15 Aufgaben auf zwei bis drei Clubmitglieder verteilt, Schwierigkeit aus der
  Wertung, bestanden ab 70 Prozent (`04_Architektur.md`, Abschnitt 5). Die Spielzeit wird im
  Spielstand gezählt, um die Richtwerte nachzumessen.
- **A10 Ergänzung des Autors:** Der ganze Spielcode darf später in ein privates Repository ziehen,
  um das Spiel notfalls kostenpflichtig anbieten zu können. Folge: Modulgrenze so streng, dass das
  Spiel als Ganzes umziehen kann (`04_Architektur.md`, Abschnitt 1). Hinweis dort: Die
  GPL-Abhängigkeiten der App (chessops, Stockfish, Lichess-Bretter) bleiben; Verkauf ist unter der
  GPL erlaubt, Käufer haben Anspruch auf den Quelltext. Keine Rechtsberatung.
- **A13 Zweigname:** offen gelassen; Arbeit bleibt auf `claude/friendly-shannon-y8bf90`.
- **C1 Stellungsduelle (Autor: Später, mit Ergänzung):** Ausgangsstellungen nicht nur aus dem
  Buch, sondern auch aus Lichess-Eröffnungen, aus den Meisterpartien des Trainers „Zug erraten“
  oder aus Bot-gegen-Bot-Partien im Hintergrund, die eine zufällige Stellung passend zur
  Spielstärke erzeugen. Aufgenommen als `Startstellung` (grundstellung, fen, abbildung,
  meisterpartie) in `schnittstelle/partie.ts`; Bot-gegen-Bot als spätere Quelle vorgemerkt.
- **C3 Ergänzung des Autors:** Der Fundus an Meisterpartien im Trainer darf dafür erweitert
  werden (später, mit Lizenzprüfung der Quellen: Partien sind frei, Kommentare nicht).
- **C5 Testbericht (Autor: Nein):** Kein Kindertest, der Autor testet selbst. Kein Testbericht;
  stattdessen zählt der Spielstand die Spielzeit, damit die Richtwerte geprüft werden können.
- **Grafik (Frage des Autors):** Orientierung an den späten DS-Spielen statt am Game Boy ist
  möglich und ändert nichts an Phaser, Tiled oder Plan: 16-Pixel-Kacheln dreifach gezeichnet,
  animierte Kacheln, hochauflösende Oberfläche und Porträts in App-Optik, Tag-Nacht-Tönung.
  Gekippte 3D-Perspektive der DS-Spiele nicht, weil Kosten und Grafikpaket dagegensprechen
  (`04_Architektur.md`, Abschnitt 10).

**Schritt 3 erledigt:** `04_Architektur.md`, Verträge in `app/src/abenteuer/schnittstelle/`
(`modul.ts`, `gegnerprofil.ts`, `partie.ts`, `karten.ts`, `spielstand.ts`, `paket.ts`,
`tausch.ts`), `LIZENZEN.md` angelegt. Noch offen aus `tausch.ts`: Die App verbietet heute die
Kamera (`public/_headers`, Permissions-Policy `camera=()`); QR-Lesen braucht sie. Frage an den
Autor vor der Umsetzung des Tauschs (frühestens Schritt 8).

- **A6 Ergänzung des Autors (07.11.2026, nach Schritt 4):** Die Eingangswertung E wird über die
  ersten 5 bis 10 Partien festgelegt, wenn die App nicht genug gewertete Partien hat. Umsetzung:
  E läuft mit der aktuellen Wertung mit, bis 10 gewertete Partien (App plus Story aus der
  Grundstellung) vorliegen, dann eingefroren; Feld `eingangPartien` im Spielstand.
- **Quelltext bei Verkauf unter der GPL (Frage des Autors):** nicht jedem Käufer schicken; es
  genügt, den Quelltext am selben Ort wie das Programm anzubieten (GPLv3, Abschnitt 6d: Download
  von derselben Stelle, ohne Aufpreis), etwa ein Link in den Einstellungen und auf der Website.
  Keine Rechtsberatung.

**Schritt 4 erledigt (Datenformate):** Schemas `schemas/abenteuer-{gegner,karten,quests,orte,texte}.schema.json`
(die App erzeugt daraus Typen in `app/src/daten/generiert/abenteuer-*.ts`, wie bei den Buchdaten),
Beispiele in `inhalte/abenteuer/` (Maple Falls: vier Gegner, neun Karten, drei Quests, ein Ort mit
Club und Aufgabenreihe, Spieltexte, Ink-Szene „Fund des Bretts“, Tiled-Karte „Dachboden“),
Formatregeln in `inhalte/abenteuer/README.md`, Prüfung in `pipeline/tests/test_abenteuer.py`
(Schemas und Querverweise). Entscheidungen dabei: Dialogformat Ink mit Tags `#sprecher`,
`#stimmung`, `#klang`, `#pause` und sechs festen externen Funktionen; Tiled-Karten mit Ebenen
`boden`, `waende`, `objekte`, `ausloeser`, Kollision am Kachelsatz, Auslöser-Bedeutung in
`orte.json`; Spieltexte als eigene Datei mit Schlüsselmuster `bereich.name.feld`.

## Vorschläge von Claude (Teil 3 der Entscheidungsseite, zur Nachlese)

- **C1 Stellungsduelle für Straßengegner:** Stellung aus dem Buchkapitel mit leichtem Vorteil
  ausspielen, Sieg nach 10 bis 15 Zügen bei gehaltenem Vorteil oder Matt; 5 bis 10 Minuten statt
  ganzer Partien (Dokument 02 warnt vor Ermüdung durch zwölf volle Partien).
- **C2 Schummeln mit der Partieauswertung der App aufdecken:** Die App schätzt Spielstärke und
  Genauigkeit aus den Zügen; im Spiel wertet der Held Partien eines Konzernspielers aus, Dr. Lin
  erklärt das Ergebnis, die Auswertung ist der Beweis im Finale. Lehrt Kapitel 12.2 nebenbei.
- **C3 Ambroses Erinnerungen als Zugerraten echter Partien** (1851 bis 1895) aus
  `inhalte/zusatzpartien/klassiker.json` mit dem vorhandenen Modus „Zug erraten“; eine Erinnerung je
  Stadt, Belohnung ein Partiefragment für Ghost Town. Ambroses eigene Partie bleibt erfunden.
- **C4 Phaser nur für die Oberwelt, alles andere in React** (Dialoge, Menüs, Album, Tagebuch,
  Partie): gleiche Optik, Lokalisierung und Barrierefreiheit wie die App, schmale Schnittstelle zu
  Phaser („Figur steht auf Auslöser X“ / „Figur darf laufen“).
- **C5 Testbericht für Kindertests ohne Telemetrie:** lokales Protokoll (Zeiten je Ort,
  Partiedauern, Abbrüche), auf Knopfdruck als Datei; nichts verlässt das Gerät von selbst.
- **C6 Begriff „Clubnadel“** (Gold, Silber, Bronze) statt Orden, weil Orden, Abzeichen und
  Meisterschaft in der App schon vergeben sind.
- **C7 Gegner-Steckbrief wächst mit der Vorbereitung:** Vorbereitungs-Nebenquests schalten
  Zeilen im Clubtagebuch frei, die aus dem echten Bot-Profil (Fehlerarten, Stil, Eröffnung) erzeugt
  werden.
