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

**Schritt 8e erledigt (Kipppunkt und Wiedereinstieg, R14, R15, R20):** Nach einer verlorenen
ganzen Partie (nicht Stellungsduell, nicht nach einem verlorenen Wiedereinstieg derselben
Begegnung) bewertet die Auswertungs-Engine mit Tiefe 10 rückwärts die Stellungen, in denen der
Leser am Zug war, ab Halbzug 20 und höchstens 20 Stellungen, und nimmt die erste innerhalb ±1
Bauer (`anbindung/kipppunkt.ts`, reine Suche mit austauschbarem Bewerter, Tests). Die
Ergebniskarte zeigt „Ambrose sieht sich die Partie an …“, dann „Hier ist es passiert, in Zug N“
mit dem Knopf „Noch einmal von Zug N“. Der Wiedereinstieg ist dieselbe Begegnung mit gleichem
Profil und Zustand, Farbe aus dem Zugrecht der Stellung, Format `wiedereinstieg`; Karten bis zum
Kipppunkt bleiben gespielt, dauerhafte Karten von danach kehren ins Deck zurück, verbrauchte
nicht (R15); das Protokoll merkt sich den Wiedereinstieg (einmal je Begegnung). Nebenbei
behoben: `liesErgebnis` gab die gespielten Karten nicht weiter, die Nadel wäre immer Gold gewesen.

**Auslöser je Karte (Befund von niedrig-1):** Auslöser in `orte.json` galten je Ort, deshalb
führte „schule“ auf der Clubraumkarte wieder in den Clubraum und „treppeOben“ war unerklärt. Neu
ist das optionale Feld `karte` am Auslöser: Ein Eintrag mit passender Karte geht vor, ohne Karte
gilt er auf allen Karten des Ortes. Rückwege für Haustür, Schule, Park und Treppe eingetragen;
der strikte Befund im Pipeline-Test `test_abenteuer_karten.py` ist damit erledigt und gelöscht.
Alternative wäre ein eigener Name je Seite gewesen (so hat mittel-2 Cedar Creek angelegt); beides
geht weiter, denn ein Name ohne `karte` bleibt erlaubt.

## 08.11.2026 – Helfer-Berichte (zweite Aufträge) zusammengeführt

- **Victor nach R33, nicht nach der Bibel (Szene 12).** mittel-1 (Dialoge) folgte dem Regelwerk,
  mittel-2 (Spieldaten) der Bibel; beide hatten recht, ihre Datei zu lesen. Entscheidung: R33 gilt
  (Trainingsstellung Spanisch ohne schwarzen Springer, Schwarz am Zug, Zug 12, legal geprüft,
  Material 39 : 36; Karten gesperrt, zählt nicht für die App). Grund: Dokument 02, 2.7 will, dass
  der Leser die Niederlage nicht als unfair erlebt; die Dialoge erklären die Stellung. Die Bibel
  wird bei der nächsten Überarbeitung angepasst. Bewertung mit der Engine (−2,5 bis −4 nach R33)
  steht noch aus (Pipeline, lokal).
- **Reise zwischen Orten über Dialoge:** neue externe Funktion `reise(karte, ausloeser)` (Bus);
  Übergänge bleiben innerhalb eines Ortes. Die Landstraße im Park ist jetzt die Bushaltestelle
  (Dialog aus `maple-falls-park.ink`, Rand geschlossen).
- **Cedar Creek ohne Karten:** Der Kartentest überspringt in `orte.json` genannte, aber noch nicht
  gezeichnete Karten (sichtbar als „skipped“), statt rot zu sein; die Oberwelt meldet eine fehlende
  Karte. niedrig-1 zeichnet sie im vierten Auftrag.
- **Neuer Pipeline-Test:** Begegnungsverweise aus Quests und `beginnePartie`-Aufrufen sowie
  `reise`-Ziele müssen existieren (der Victor-Verweis war verwaist).
- **Helfer:** mittel-1 schreibt die Dialoge für Cedar Creek, niedrig-1 die Karten; mittel-2 wartet
  (kein Auftrag), bis die Aufgabenrunden (8f) das Datenformat festlegen; so bleibt das Guthaben
  geschont (Wunsch des Autors).

**Schritt 8f erledigt (Aufgabenrunden mit Rückweg, R30 bis R32):** Neue Datei
`inhalte/abenteuer/runden.json` (Schema `abenteuer-runden`): je Runde Steller, Buchübungen,
Themen, ob sie zur Aufgabenreihe gehört, optional eine feste Zahl (Rätsel, Erinnerung). Der Umfang
der Reihenblöcke folgt R30 aus dem Zeitbudget des Clubs (12 Minuten, drei Buchübungen à 120 s,
Rest durch die Sekunden je Aufgabe der Schwierigkeit, verteilt auf die Blöcke); die Schwierigkeit
kommt aus der Wertung der App (bis die Abenteuerwertung A in 8h steht) und sinkt je weiterem
Versuch um eine Stufe (R31). Die App spielt die Runde in einer eigenen Vollbild-Zusatzansicht im
Rundenrahmen des Taktiktrainers (`anbindung/AufgabenAnsicht.tsx`): Buchübungen sind die Aufgaben
des Taktiktrainers mit `herkunft.uebung`, Motivaufgaben kommen aus den Lichess-Zusatzaufgaben
oder den Buchmotiven; die Runde zählt für Wiederholung und Tagesprotokoll wie eine Taktikrunde
(R32). Das Ergebnis je Aufgabe geht in den Spielstand, die Oberwelt wertet aus: bestanden ab 70
Prozent → Quest-Ereignis `aufgaben`; alle Reihenblöcke bestanden → `Clubstand.aufgabenreihe`;
sonst „Noch eine Runde, eine Stufe leichter“. Grenzen des Prototyps (Rückfrage, Empfehlung
umgesetzt): (1) „mit Hilfe“ (halber Punkt) gibt es noch nicht, Taktikaufgaben melden nur richtig
oder falsch; (2) Buchübungen ohne Lösungszug (Zählübungen „ueb:zaehlen-vorstoss“,
„ueb:angriff-zaehlen“, Mattführungen „ueb:damenmatt“, „ueb:turmmatt“) liegen nicht im
Taktiktrainer und fallen aus der Runde heraus, ebenso das Thema „zaehlen“ (eigener Trainer); dafür
später der Zähltrainer als Aufgabenart; (3) Erinnerungen (Zugerraten, C3) laufen vorerst als
Mattbilder-Runde. Vertrag: `schnittstelle/aufgaben.ts` (Auftrag mit Runde, Steller, Versuch;
Rundenstand), Spielstand mit `laufendeAufgaben`, `aufgabenergebnis`, `runden`.
`Oberwelt.tsx` in drei Dateien geteilt (`auftraege.ts`, `weltdaten.ts`), bleibt aber über 400
Zeilen; die Rückwege (Partie, Runde) wandern in 8g in einen eigenen Hook.

**Dialoge für Cedar Creek (mittel-1) zusammengeführt, Dialogvariablen aus Ergebnissen:**
Die Hülle setzt jetzt Variablen für die Ink-Dateien (`regeln/dialogvariablen.ts`): Ausgang einer
Begegnung in der Langform mit Ort (`ausgangMapleFallsClubkampf` = „sieg“), bestandene Runde
(`reiheSamBestanden` = true), beste Nadel eines Clubs (`nadelMapleFalls` 0 bis 3). Die Langform
war der Vorschlag von mittel-1, weil die Kurzform („ausgangClubkampf“) über Orte hinweg
mehrdeutig ist; mittel-1 benennt die Maple-Falls-Dateien im vierten Auftrag um. Drei Quest-Knoten
von mittel-2 hat mittel-1 begründet geändert (Verteilerknoten ohne Text meldet der Dialog nie;
nach der Busfahrt startet kein Dialog von selbst). Später: `reise` mit Ankunftsknoten, Figuren mit
Sichtbarkeitsbedingung in `orte.json` (Victor nur vor der Clubnadel).

**Schritt 8g erledigt (Namenswahl, Spielmenü, Rückwege als Regeln):** Vor dem ersten Start fragt
die Startkarte „Wie heißt du im Spiel?“ (höchstens 16 Zeichen, leer heißt „Du“, bleibt lokal); im
Spielmenü lässt sich der Name ändern und das Spiel von vorn beginnen (Rückfrage, Spielstand weg,
Paket bleibt). Die Rückwege aus Partie und Aufgabenrunde sind reine Funktionen
(`regeln/rueckweg.ts`: Clubnadel und Versuch, Protokoll, Rundenstand, Aufgabenreihe,
Dialogvariablen) mit Tests; `Oberwelt.tsx` ist von 978 auf 699 Zeilen geschrumpft, noch über der
400-Zeilen-Regel; der nächste Schnitt (Dialog- und Kartenlogik in einen Hook) folgt mit 8h.

**Schritt 8h erledigt (Abenteuerwertung A und Vertragsvorschläge des Regelwerks):**

- **V1, R2/R3/R38:** Der Spielstand trägt die Abenteuerwertung `wertung` (A), die zuletzt gelesene
  App-Wertung, die Zahl der für A gezählten Partien und die Zielstärke der laufenden Partie
  (`regeln/wertung.ts`, Tests). A startet mit der App-Wertung oder 600, folgt Änderungen der
  App-Wertung und macht nach jeder zählenden Story-Partie (ganze Partie aus der Grundstellung,
  zählt für die App, nicht abgebrochen, keine mittlere oder starke Karte) einen Elo-Schritt gegen
  die Zielstärke vor dem Zustandsfaktor (K 32 bis zehn Partien, dann 20, nie unter 100). Solange E
  noch läuft, folgt E dem neuen A, und die Partie zählt für `eingangPartien`. Straße,
  Clubmitglieder und Aufgabenrunden rechnen jetzt mit A statt mit der App-Wertung. Das Tagebuch
  zeigt A als „Deine Spielstärke im Abenteuer“.
- **V2, R6/R7:** Umrechnung Z → Stufe mit kaufmännischem Runden und Eichpunkt in der Stufenmitte,
  Häufigkeit 1,4^(−d/150), Zustandsfaktor höchstens 2,0, Ergebnis 0,5 bis 2,5; Architektur
  Abschnitt 4 angepasst. Folge: Coach Delgado bei E = 800 spielt Stufe 3 mit Häufigkeit 0,76 statt
  Stufe 4 mit 1,12 (etwa wie zuvor gemeint, aber richtig geeicht).
- **V8, R9:** `Gegnerzustand.ueberheblich` als eigener Faktor (1 + 0,15 je Niederlage seit dem
  letzten Sieg oder Remis, höchstens 1,6; nur Clubchef, Clubmitglied, Turnier), aus dem Protokoll
  gezählt; die Kartenleiste unter dem Brett nennt den sichtbaren Zustand („Coach Delgado ist
  überheblich geworden.“, „Mrs. Okafor hat schlecht geschlafen.“). **R10:** Im zweiten Durchlauf
  +300 auf Z.
- **V7:** `spielzeitJeOrt` im Spielstand, beim Verlassen der Welt fortgeschrieben.
- **V9:** Pipeline prüft die Versatzbereiche je Rolle (Straße −150 bis 0, Clubmitglied −100 bis
  +50, Clubchef genau 160 + 60 · Clubnummer).
- **Offen:** V5 (Nadeln des zweiten Durchlaufs) und V6 (freie Karten im Halbfinale) kommen mit
  Staffel 2 bzw. Akt 3; die Schätzung `geschaetzteStaerke` aus den Zügen liefert die App noch
  nicht (dann ersetzt sie den Startwert 600).

**Einstieg auf der Seite „Spielen“ und dritte Helfer-Runde zusammengeführt (08.11.2026):** Die
Seite „Spielen“ zeigt aus der Grundstellung eine Karte „Schach-Abenteuer“ („Zum Abenteuer“, mit
Spielstand „Dein Abenteuer wartet, Kim.“ und „Weiterspielen“); die Adresse #abenteuer bleibt.
Victor-Stellung nach der Engine-Prüfung von mittel-2 geändert: Springer gegen zwei Bauern (weiße
Bauern d4 und b2 fehlen), −3,2 aus Sicht von Schwarz statt −6,9, weil Stockfish einen glatten
Springer heute mit −5 bis −7 bewertet; Erzählung „der Springer hat zwei Bauern gefressen und kam
nicht mehr heim“. mittel-2 hat Regelwerk (R14, R15, R30a, R31, R33, R41 Reise) und Bibel (Szenen
12, 13, 14, 23) nachgezogen und bekommt als vierten Auftrag den Stand von 8h (A, R6 bis R10,
Dialogvariablen-Verzeichnis von mittel-1). mittel-1 hat die Maple-Falls-Variablen umbenannt,
„abgebrochen“ zählt in den Dialogen wie nicht gespielt; mittel-1 und niedrig-1 warten.
Stellungsduell-Kandidaten für spätere Städte (mittel-2, Tiefe 12): Kapitel 3: Abb. 3.77 (+1,64),
3.75 (+1,66); Kapitel 6: 6.14 (+0,85), 6.5 (+0,84); Kapitel 8: 8.44 (+0,88), 8.48 (+2,50).

**Welt öffnet sich von selbst, Oberflächentest für die Aufgabenrunde (08.11.2026):** Wer Spielstand
und Paket hat, landet beim Aufruf des Abenteuers (auch beim Rückweg aus Partie und Runde) gleich in
der Welt; die Startkarte zeigt sich nur ohne Spielstand (Namenswahl) oder ohne Paket. Grund: Der
Rückweg „Zurück zur Stadt“ landete sonst auf der Startkarte und verlangte ein zweites „Spielen“.
Neuer Oberflächentest `tests/e2e/abenteuer-aufgaben.spec.ts`: Spielstand mit laufender Runde von
Sam einspielen, Runde im Trainer durchspielen (Lösung zeigen), Ergebniskarte „0 von 3 Punkten“ mit
Angebot der leichteren Runde. Damit ist Schritt 8 abgeschlossen.

## 08.11.2026 – Wünsche des Autors: Wege, Entdeckungen, Zeit, Flashbacks, Läden

Der Autor wünscht (Nachricht vom 8.11.2026, 07:50 Uhr): begehbare Wege zwischen den Städten mit
Rätseln, kurzen Partien und Entdeckungen; übergreifende Nebenquests („Mondfossil“); Boni wie
Brettfiguren und Bretthintergründe; Wahl von Blitz oder Schnellschach und Karten für die
Bedenkzeit (die Engine spielt in Zeitnot schwächer); Fortbewegung zu Fuß, Bus, Zug, Fahrrad;
Flashback-Abschnitte in Ambroses Erinnerungen; Geld und Läden. Entwurf mit Mechanik, Verträgen,
Aufwand und Reihenfolge in `docs/spiel/08_Wege_und_Entdeckungen.md` (W1–W6, E1–E5, Z1–Z5,
F1–F3, G1–G6). Entscheidungen des Haupt-Chats (Widerspruch genügt): Route 1 Maple Falls → Cedar
Creek ersetzt den Bus-Sprung, der Bus bleibt Schnellreise nach dem ersten Fußweg; Funde nutzen
das Album und die Extras der App statt neuer Systeme; Münzen sind reine Spielwährung ohne
Echtgeld, Gold bleibt unkäuflich; Zeitkarten zählen als leichte Karten; Flashbacks nutzen die
Oberwelt mit Sepia-Tönung. Reihenfolge: nach Schritt 9 (Akt 1 spielen) die Schritte 10 Wege,
11 Entdeckungen, 12 Münzen und Läden, 13 Zeit, 14 Flashbacks. Antworten des Autors (8.11.2026,
08:05 Uhr): Blitz auch im Clubkampf ja, Reihenfolge in Ordnung, Geldsystem einbauen; neue Karte
„Zeitnot-Trick“ (Z6: Ambrose gaukelt dem Gegner für fünf Züge Zeitnot vor, die Uhr bleibt; wirkt
auch ohne Uhr, deshalb mittlere Karte). Q18 damit erledigt.

**Weltbeschreibung (Wunsch des Autors, 8.11.2026, 08:30 Uhr):** Vor dem Zeichnen mit echter
Grafik steht jetzt `docs/spiel/09_Weltbeschreibung.md`: Region „Ashford“ (Arbeitsname) mit Fluss,
Hügelland und Küste und der Reihenfolge der Reise; Jahreszeit je Akt (Spätsommer → Herbst →
Winter/Frühjahr → Sommer), Tageszeit je Karte und Szene als Tönung, Wetter nur wo erzählt; Regeln
für lebendige Karten (vier bewegte Dinge außen, drei Dinge zum Ansehen innen, Spuren erledigter
Quests, Abwechslung der Clubräume, Größen); Fauna je Ort; alle zwölf Orte mit Arealen,
Innenräumen, Inventar und Verbindungen; Checkliste je Karte; Technikliste (Tönung, Tiere und
Statisten, animierte Kacheln, bedingte Objekte, Geräusche). mittel-2 richtet Akt 2 danach aus,
niedrig-1 zeichnet die Routenkarten nach Abschnitt 5.2.

**Schritt 10 begonnen (Wege, Grundlage):** Ein Weg ist ein Ort mit `art: "weg"` (Nummer 0, ohne
Club) in `orte.json`; nur seine Übergänge dürfen in andere Orte führen (Pipeline prüft das). So
bleibt alles Vorhandene (Karten laden, Übergänge, Figuren, Quests, Kartentest) unverändert nutzbar;
eine eigene `wege.json` ist nicht nötig. Angelegt: `wegMapleCedar` mit „Landstraße“ und
„Flussweg“ (Karten zeichnet niedrig-1), Park-Ausgang `landstrasse`, Rätseltafel als Runde mit
fester Zahl (Steller ohne Figur: Textschlüssel `figur.tafel.name`), Gegnerin Nia (vorläufiges
Profil, mittel-1 füllt es). Spielstand: `gegenstaende` (Quest-Wirkung `gegenstand`; Fahrrad
verdoppelt das Tempo draußen) und `besuchteOrte` mit Dialogvariable `besucht<Ort>` für die
Schnellreise nach dem ersten Fußweg (W2; der Bus-Dialog prüft sie). Auslösernamen sind camelCase
(Schema), Ink-Knoten dürfen Unterstriche behalten.

**Fünfte Helfer-Runde zusammengeführt (08.11.2026, 09:30 Uhr):** Routenkarten „Landstraße“ und
„Flussweg“ mit Statisten und Tieren (niedrig-1; Objekte `type` statist/tier sind noch keine
Auslöser, der Kartentest überspringt sie), Dialoge der Route 1 samt Nia, Kiosk und Ankunft zu Fuß
(mittel-1), Story-Bibel Akt 2 mit Riverton und Ironwood, Routen 2 und 3, 13 Funden, Läden,
Blitz-Szene, Zeitnot-Trick und Flashback London 1851 (mittel-2). Die Tafel-Runde heißt
`wegMapleCedar.tafel`. Alle drei Helfer warten jetzt ohne Auftrag (Guthaben schonen, Wunsch des
Autors). Noch offen aus den Berichten: R27 (nur die erste Erinnerung je Staffel gibt die
Bauernvorgabe), Fingerzeig im Laden ist laut `karten.json` dauerhaft (Angebot anpassen), Variable
`mamaSpielt`, Kiosk-Angebot mit Preisen (kommt mit Schritt 12). Aus dem Nachtrag von mittel-1
(5985f3c6, zusammengeführt): Übergänge brauchen einen optionalen Dialog beim Betreten
(`ankunft_zu_fuss` in Cedar Creek, `landstrasse` im Park), heute hat ein Übergang keinen; das ist
der nächste Baustein von Schritt 10 (Feld `dialog` am Übergang, Dialog vor dem Kartenwechsel).

**Dialog an Übergängen (Schritt 10):** Ein Übergang kann `dialog` (läuft vor dem Wechsel) und
`wenn` (Dialogvariable; nicht wahr → nur der Dialog, der Held bleibt) haben. Park `landstrasse`
sperrt so bis `aufbruchGesehen`, `weiterCedar` zeigt die Ankunft zu Fuß. Sechste Aufträge
(08.11.2026, nach dem Wechsel auf Opus): mittel-2 Spieldaten für Riverton, Ironwood und die zwei
Wege; mittel-1 Dinge zum Ansehen in den Innenräumen; niedrig-1 Statisten, Tiere und dieselben
Objekte in den Karten von Maple Falls und Cedar Creek.

**Schritt 11 begonnen (Funde):** Neue Datei `inhalte/abenteuer/funde.json` (Schema
`abenteuer-funde`: Kennung, Ort, Name, Text, optional Münzen und Extra der App); Dialogfunktion
`gibFund(kennung)` legt den Fund einmal in den Spielstand (`funde`), zeigt „Gefunden: …“ und
listet ihn im Tagebuch unter „Funde“. Pipeline prüft, dass jeder `gibFund`-Aufruf einen Fund
nennt, der existiert. Münzen (Schritt 12) und Extras (Anbindung an „Dein Aussehen“) wirken noch
nicht; die Felder stehen schon in den Daten. Erste Funde: altes Partieformular und die Kiste am
Flussweg (Route 1).

**Sechste Helfer-Runde (Teil) zusammengeführt:** 17 Dinge zum Ansehen in den Innenräumen
(Texte mittel-1, Objekte niedrig-1), Statisten und Tiere auf den drei Außenkarten. Hinweis von
mittel-1: Ink-Besuchszähler überleben den Dialog nicht, weil jeder Dialog eine neue Geschichte
baut; deshalb Variablen `angesehen…`. Vorschlag für später: Besuchszähler je Knoten in der Hülle
speichern, dann können diese Variablen weg.

**Schritt 12 (Münzen und Läden) gebaut:** Spielstand `muenzen`; Münzen für Straßensiege (10),
jede erstmals bestandene Aufgabenrunde (10), die erste Clubnadel eines Clubs (50) und Funde mit
`muenzen` (Kiste am Flussweg 15); Quest-Wirkung `muenzen`. Neue Datei `laeden.json` (Schema
`abenteuer-laeden`), Dialogfunktion `oeffneLaden(kennung)` öffnet nach dem Dialog ein Ladenfenster
wie die Deckwahl; dauerhafte Karten und Gegenstände gibt es nur einmal, zu teure Waren sind
gesperrt. Erster Laden: Patels Kiosk im Park (Zweite Chance 20, Gefahrenradar 35, Flüstern 40,
Fahrrad 120). Die Pipeline verbietet Mentor-Zug, Sanduhr und Vorgaben in Läden (G3). Münzen stehen
oben rechts in der Welt und im Tagebuch. Oberflächentest `abenteuer-laden.spec.ts`. Fahrkarten
und Extras im Laden folgen mit der Schnellreise-Regel und der Anbindung an „Dein Aussehen“.

**Riverton-Karten zusammengeführt (niedrig-1):** sieben Karten (Zedernwald, Bahndamm, Riverton
außen, Pavillon, Bahnhofshalle, Wohnwagen, Schuppen), Übergang `zedernwald` in Cedar Creek. Offen
für mittel-1: Uhr mit Klebeband, Fahrplantafel und Fundbüro-Schild aus 09, 5.4 stehen noch nicht
in `orte.json` (Dinge zum Ansehen für Riverton, mit dem nächsten Dialogauftrag).

**Ironwood-Karten zusammengeführt (niedrig-1):** sieben Karten (Kanalweg, Brücke, Ironwood außen,
Kantine, Mamas Zimmer, Umkleide, Museum); alle Karten von Akt 1 und 2 sind gezeichnet, der
Kartentest überspringt nichts mehr. Offen für mittel-1 (Dinge zum Ansehen aus 09, 5.5): Schichtplan,
Kaffeemaschine, Werksfoto, Poster, Standuhr, Nieten „J. H.“.

**Riverton-Dialoge zusammengeführt (mittel-1) und drei Befunde behoben:** `wenn` an Übergängen
gilt bei true, Zahl über 0 oder nicht leerem Text (die Nadel ist eine Zahl); jeder Fund setzt die
Dialogvariable `gefunden<Fund>`; Runden setzen neben der Kurzform die Langform mit Ort
(`wegMapleCedarTafelBestanden`), weil alle Rätseltafeln „tafel“ heißen. Fund `schluessel` (Steg in
Cedar Creek) angelegt; mittel-1 vergibt ihn im nächsten Auftrag. Zug ohne Fahrkartenabfrage
bleibt bis zur Schnellreise-Regel.

**Akt 2 vollständig in Daten, Karten und Dialogen (08.11.2026, mittags):** Ironwood-Dialoge von
mittel-1 zusammengeführt; alle Dialogverweise in `orte.json` und `quests.json` haben Knoten, die
Simulation aller Quests von Akt 1 und 2 läuft durch. Quest `ironwood.mamasFinale` begann und
wartete auf denselben Knoten (Sackgasse); jetzt startet sie in der Kantine. Dialoge sehen den
Besitz: `hat<Gegenstand>`, `hatKarte<Karte>` und `muenzen` werden beim Öffnen jedes Dialogs aus
dem Spielstand abgeleitet (nicht gespeichert); damit kann das Schließfach die Laterne verlangen.
Läden in Riverton (Pops: Fingerzeig, Zweite Chance) und Ironwood (Edna: Zweite Chance, Flüstern,
Fahrrad, Laterne) stehen jetzt in `laeden.json`; mittel-1 schließt sie an. Offen: Fahrkarten und
Extras als Waren, der Zeitnot-Trick als eigene Karte (Schritt 13; bis dahin Zeitbonus).

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
