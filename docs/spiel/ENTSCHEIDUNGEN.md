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

**Schritt 5 erledigt (technischer Prototyp, Version 0.3.55):** Startkarte → Zusatzpaket laden →
Oberwelt (Phaser, Dachboden in Platzhaltergrafik, Steuerkreuz) → Brett ansehen → Ink-Dialog mit
Ambrose → Partie der App gegen das Gegnerprofil → „Zurück zur Stadt“ mit Ergebnis; Oberflächentest
`tests/e2e/abenteuer.spec.ts`, Testpunkte N2605–N2611. Entscheidungen dabei:

- **Code-Baustein als Paket des Service Workers:** `assets/abenteuer-*.js` (Phaser, inkjs, Spiel,
  1,5 MB) läuft über denselben Weg wie die Sprachpakete (`sw/dateiliste.ts`, Cache
  `sprachpaket-abenteuer`): erst beim ersten Abruf, dann offline, Aufräumen bei neuer Fassung. Kein
  neuer Service-Worker-Code nötig. Die Daten des Spiels (`public/abenteuer/`) lädt
  `paket/paketlader.ts` in den Cache `abenteuer-<version>` mit Prüfsummen; `paket.json` zuletzt.
- **Einstieg nur über „#abenteuer“** (`app/spruenge.ts`), bis das Spiel etwas zu zeigen hat; eine
  Karte auf „Spielen“ kommt mit Schritt 9.
- **Auslöser zählen auch vor dem Helden** (Kachel in Blickrichtung), weil Gegenstände Kollision
  haben; man steht davor und sieht sie an, wie in Rollenspielen in Draufsicht.
- **Story-Gegner spielen als „eigene Stufe mit Stil“** (`bot: null`, `stilname`, Gewichte,
  Häufigkeit, Stufen je Phase) ohne gespeicherten eigenen Bot; feste Eröffnungen wählen je Partie
  eine (`anbindung/partiestart.ts`). Der Name im Profil ist ein Textschlüssel und wird beim
  Anlegen der Partie übersetzt.
- **Vertrag ergänzt:** `Partieauftrag.begegnung` (Kennung aus `begegnungen.json`, auf die Quests
  warten; `kennung` ist je Versuch eindeutig) und `Appdienste.zeigePartie` (laufende Partie wieder
  öffnen). Neue Datendatei `begegnungen.json` mit Schema.
- **Spielstand beim ersten Start:** Eingangswertung fest, wenn die App schon 10 gewertete Partien
  hat, sonst läuft sie mit (Feld `eingangPartien`); Heldname vorerst „Du“ (Namenswahl: Schritt 8).
- **Phaser beenden:** erst nach dem Hochfahren zerstören (`beendeOberwelt`), sonst stürzte die
  Ansicht ab, wenn der Leser sofort wieder ging (Fund im Oberflächentest).
- **Noch nicht im Prototyp** (Schritt 8): Karten in der Partie (die Leiste zeigt nur die Begegnung),
  Schlüsselmomente der Leserzüge, Kipppunkt und Wiedereinstieg, Quest-Auswertung, Kartenwechsel
  über Übergänge, Aufgabenrunden mit Rückweg, Deckwahl, Namenswahl, Einstellungsseite (Paket
  löschen).

## 07.11.2026 – Rückfragen des Autors nach dem Prototyp

- **Grafik:** Die farbigen Kacheln des Prototyps sind Platzhalter (`skripte/baue-abenteuerpaket.mjs`
  zeichnet acht einfarbige Kacheln und einen Kasten als Helden). Das fertige Spiel bekommt
  gezeichnete Pixelkacheln (LimeZu, 16 px Quellgröße, dreifach gezeichnet) mit Animationen,
  dazu hochauflösende Porträts und Oberfläche; Phaser und Tiled sind von der Kachelgröße
  unabhängig (`04_Architektur.md`, Abschnitt 10).
- **Oberfläche im Spiel (D1, Wunsch des Autors):** Im Spiel tritt die Oberfläche der App
  vollständig zurück: keine Kopfzeile, keine untere Leiste; stattdessen ein Spielmenü (Speichern
  ist automatisch, „Zurück zur App“, Einstellungen des Spiels). Start aus der App bleibt. Die
  Partie selbst läuft weiter in der Brettansicht der App (Entscheidung Dokument 02), bekommt aber
  im Abenteuer dieselbe Vollbildhülle. Umsetzung: Zusatzansichten können „vollbild“ sein
  (App.tsx blendet die Leiste aus), Schritt 8.
- **Beta-Fassung zum Testen (D2, Wunsch des Autors):** Keine Updates der richtigen App für das
  Spiel, bis es fertig ist; Changelog für die Leser wird mit dem nächsten Update nötig.
  Umsetzung: Cloudflare Workers Builds baut jeden Zweig als Vorschau mit eigener Adresse
  (`<zweig>-schach-von-grund-auf.<konto>.workers.dev`); eine andere Adresse ist für den Browser
  eine eigene App mit eigenem Speicher, also neben der richtigen App installierbar. Vorschau-Builds
  heißen jetzt „Schach von Grund auf (Beta)“ / „Schach Beta“ (vite.config.ts, über
  `WORKERS_CI_BRANCH`), damit die Symbole unterscheidbar sind. Vorschlag: fester Zweig `beta`,
  auf den der Haupt-Chat den Stand des Spiels pusht; Zugriff nur für den Autor über Cloudflare
  Access auf der Vorschau-Adresse (wie `/admin`). Offen: Freigabe des Autors für den Zweig `beta`.
- **Helfer-Chats:** Sie können den Haupt-Chat nicht direkt anschreiben; das Repository ist der
  Kanal (Bericht in der Auftragsdatei, Push auf den eigenen Zweig, der Autor sagt „weiter“). Alle
  drei ersten Aufträge sind erledigt und zusammengeführt (`05_Story_Bibel.md`, `06_Regelwerk.md`,
  `07_Aufgabenzuordnung.md`); ihre Vorschläge für die Verträge (V1–V9 des Regelwerks, Vorschläge
  der Bibel) prüft der Haupt-Chat mit Schritt 8.

## 07.11.2026 – Schritt 8 begonnen: Vollbild (D1) und Beta-Zweig (D2)

- **Zweig `beta` angelegt** (Freigabe des Autors) und gepusht; Anleitung für Cloudflare
  (Vorschau-Adresse, Access nur für den Autor, Installation neben der App) in
  `docs/spiel/BETA_ANLEITUNG.md`. Der Haupt-Chat pusht jeden geprüften Stand des Spiels
  auch auf `beta`.
- **Vollbild umgesetzt:** Zusatzansichten tragen `vollbild` (`app/zusatzansichten.ts`); App.tsx
  blendet die untere Leiste für die Zusatzansicht „abenteuer“ und für Partien mit Feld
  `abenteuer` aus (`useVollbild`). Die Hülle hat keine Kopfzeile mehr; der Menüknopf oben rechts
  öffnet das Spielmenü (Zurück zur App, Paket löschen, Weiterspielen). Die Partie behält ihre
  eigene Kopfzeile der Brettansicht („Spielen“ als Zurück), das Spiel findet eine laufende
  Partie wieder.
- **Plan für den Rest von Schritt 8**, in dieser Reihenfolge: (a) Raumwechsel über Übergänge und
  Figuren als Objekte der Karten (damit die Karten von niedrig-1 spielbar werden), (b) Quest-
  Auswertung als reine Funktion (Ereignisse dialog, partie, aufgaben, ort → Schritte, Wirkungen)
  mit Clubtagebuch im Spielmenü, (c) Karten in der Partie (Deckwahl, Fingerzeig, Gefahrenradar,
  Zweite Chance, Flüstern, Mentor-Zug, Vorgabe) und Clubnadel nach Regelwerk, (d) Kipppunkt und
  Wiedereinstieg, (e) Aufgabenrunden mit Rückweg, (f) Namenswahl und Abenteuerwertung
  (Regelwerk V1), dazu die Vertragsvorschläge V2 bis V9 des Regelwerks.
- **Fund im Oberflächentest:** Verlässt der Leser die Welt, bevor Phaser den Helden angelegt hat,
  fragte die Hülle die Position des Helden ab und stürzte ab (1 von 6 Läufen). Die Szene liefert
  jetzt bis `create()` die Startposition.

**Schritt 8b/8c erledigt (Raumwechsel, Figuren, Quests):** Figuren stehen als Objekte
(`type = "figur"`) auf den Tiled-Karten, mit Kollision und „Sprechen“; Übergänge wechseln die
Karte, der Held erscheint auf dem gleichnamigen Auslöser der Zielkarte (der Startauslöser löst
erst nach dem Verlassen wieder aus); fehlende Karten melden sich statt abzustürzen. Die
Quest-Auswertung ist eine reine Funktion (`regeln/quests.ts`, 11 Tests) über Ereignisse „ort“,
„dialog“ (Knoten aus dem Ink-Pfad), „partie“, „aufgaben“; Wirkungen (Karte, Steckbrief, Zustand,
Szene, Fragment) kommen in den Spielstand, das Clubtagebuch (Knopf oben links) zeigt offene und
erledigte Aufgaben und die Karten. Entscheidung: **Belohnungen vergibt die Quest** (Daten), die
Ink-Funktionen `gibKarte`/`setzeSzene` bleiben für Belohnungen ohne Quest; das Ink-Beispiel ruft
`gibKarte` deshalb nicht mehr auf.

**Schritt 8d erledigt (Karten in der Partie, Clubnadel):** Deckwahl vor der Partie (bis drei
Karten, höchstens eine Vorgabe, Regelwerk R24), Vorgaben ändern die Startstellung (R26, gespiegelt
bei schwarzem Gegner) und zählen als Halbzug 0; die Kartenleiste in der Partie spielt Fingerzeig
(Startfeld des besten Zuges), Gefahrenradar (rote Warnsignale), Zweite Chance (eigener Zug samt
Antwort zurück, unabhängig von der Rücknahme-Einstellung), Flüstern (drei Pfeile) und Mentor-Zug
(bester Zug als eigener Zug); jede Karte einmal je Partie, höchstens eine je eigenem Zug, nur am
Zug und wenn die Engine nicht denkt; Verbrauchskarten werden sofort abgezogen. Nach einem
Clubkampf (Gegner = Clubchef des Ortes) rechnet die Oberwelt die Clubnadel (R17 bis R21: Gold ohne
Karten, Silber bis zwei leichte, Bronze sonst oder bei Remis; Wiedereinstieg höchstens Silber ohne
Sanduhr), hält die beste je Club und zeigt sie in Ergebnis und Tagebuch. Regeln als reine
Funktionen in `regeln/karten.ts` (19 Tests). Vertragsänderungen: `Partiekarten` im Spielstand,
`Kartensorte.zeitpunkt` mit „nachher“ (V3), Kommentar zur Vorgabe (V4), Leisten bekommen
`Partiesteuerung` und Markierungs-Rückruf. Noch offen: Sanduhr und Wiedereinstieg (8e), Zeitbonus
(braucht die Uhr des Zeitdruck-Spezialisten, Staffel 2), Mentor-Zug-Sperre in Akt 3 (R29).

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
