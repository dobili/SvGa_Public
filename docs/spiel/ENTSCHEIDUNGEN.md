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

## Offen (Entscheidungsseite, Stand 07.11.2026)

Teil 1, aus der Stellungnahme: A1 Ordner `abenteuer/` und Arbeitsname · A2 Zählen Story-Partien
für die App (Empfehlung: Partienliste, Tagesprotokoll, Erfahrung, Rekorde ja; Elo, Rivalen, Duelle
nein) · A3 Spielstand Format 11 (im Chat schon zugestimmt) · A4 Kartenleiste als Erweiterungspunkt
in `Partie.tsx` · A5 keine eigene Einstufung · A6 Gegnerstärke relativ zur Wertung · A7
Aufgabenreihen aus Buch und Lichess · A8 Aufgaben zählen für Wiederholung und Tagesprotokoll ·
A9 Maia auf dem iPhone getestet? · A10 privates Repository für Grafik, Porträts, Musik · A11 Ink je
Sprache, Deutsch zuerst · A12 Phaser 4 · A13 Zweigname.

Teil 2, Idee des Autors: B1 Wiedereinstieg am Kipppunkt · B2 Kosten (höchstens Silber, Karte,
oder ohne Folgen).

Teil 3, Vorschläge von Claude:

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
