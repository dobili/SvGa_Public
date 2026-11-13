# Schach-Abenteuer – Entscheidungen

Jede Entscheidung zum Spiel steht hier, damit spätere Sitzungen (auch mit Opus) sie nachlesen
können. Neueste Einträge oben. Offene Fragen stehen unten in „Offen“; der Autor antwortet über
die Entscheidungsseite (Claude-Artefakt „Schach-Abenteuer Entscheidungen“) oder im Chat.

## 10.11.2026 – Spielhülle: Funktionen der App nur aufs Nötigste gespiegelt

- **Wunsch des Autors** (Chat 10.11.2026, nach dem ersten Spielen): Partie, Aufgaben und Trainer
  öffnen bisher die Ansichten der App mit ihrem ganzen Layout. Das reißt aus der Geschichte.
  Im Spiel soll je Aufgabe nur das gezeigt werden, was sie braucht, im Layout des Spiels
  (Pixelrahmen, Navy und Gold); die App rechnet im Hintergrund weiter. Beispiele des Autors:
  - Partie: Brett, Uhr, ziehen. Kein Knopf „Spielen“, der auf die Spielen-Seite der App führt;
    nach der Partie zurück ins Spiel.
  - Auswertung nach der Partie: fraglich, ob sie am Anfang überhaupt erscheint; höchstens knapp.
  - Werkzeugtrainer: kein Knopf „Variante“ und nichts, was mit der Aufgabe im Spiel nichts zu
    tun hat.
  - Wer mehr will, nutzt später die App; die Partien des Spiels stehen dort.
- **Umsetzung:** Konzept und Bau durch mittel-1 (`docs/spiel/18_Spielhuelle.md`).

## 10.11.2026 – Keine Lernübersicht für Eltern

- **Gestrichen** (Autor, Chat 10.11.2026): Die im Projektplan (Schritt 8) vorgesehene
  „Lernübersicht für Eltern“ entfällt ganz. Begründung des Autors: Das Spiel ist für die Kinder,
  sie sollen spielen, wie sie wollen, ohne Kontrolle durch die Eltern.

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

## 08.11.2026 – Ideen des Autors: Sprüche, Schauplätze, Varianten

Entwurf in `docs/spiel/10_Sprueche_Schauplaetze_Varianten.md` (Widerspruch genügt):

- **Zeitkarten als Sprüche des Helden** (Straßenschach-Kultur wie im Washington Square Park):
  „Großes Maul“ (provoziert, Gegner spielt fünf Züge zu schnell), „Grübelfalle“ (sät Zweifel,
  Gegner verliert eine Minute), „Kühler Kopf“ (+2 Minuten). Nur gegen Straßen- und Parkgegner, nie
  im Clubkampf oder Turnier (dort Ruhe wie nach FIDE); frech, nie beleidigend; Gegner reden zurück,
  manche sind immun.
- **Schauplätze:** Port Delacroix (an New Orleans angelehnt) als Ambroses Geburtsstadt mit einem
  vom Hurrikan zerstörten Club und seinen Nachfahren (Klavierbauer, Teenager ohne Schachinteresse),
  zugleich Tiefpunkt und Versöhnung in Akt 3; Nationalpark mit Riesenbäumen (Pinewood Camp), Canyon
  vor Desert Springs; ein erfundenes Volk der Hochebene mit eigenem Strategiespiel, Begegnung auf
  Augenhöhe, mit Leitplanken und Sensibilitätslesung vor der Veröffentlichung.
- **Varianten abseits der Clubs:** Schach960 und Blindschach zuerst (laufen mit der vorhandenen
  Engine), König der Hügel, Drei-Schach und Märchenfiguren später mit Fairy-Stockfish als
  Zusatzpaket; zählen nicht für Elo und A.

**Sprüche geschrieben (mittel-1):** je acht Sprüche für „Großes Maul“, „Grübelfalle“, „Kühler Kopf“,
Ambroses Satz beim ersten Spruch, je zwei Konter für sieben Straßengegner; nur über die Partie,
nie über Menschen. Vorschlag für Schritt 13: Feld `immunGegen` im Gegnerprofil (Rosa gegen alle
Sprüche, Harlan nur gegen „Großes Maul“, bei ihm wirkt die Grübelfalle doppelt).

**Story-Bibel Akt 3 zusammengeführt (mittel-2, Szenen 51 bis 80):** Silicon Bay (Dr. Lin),
Port Delacroix (Miss Odile, Familie Whitlock-Duval mit Céleste, Tiefpunkt Szene 63, Wiederaufbau
über drei Besuche, Flashback in der Klavierwerkstatt), Desert Springs mit Canyon (Mira); drei Wege,
Sprüche mit Immunität, Szene 59 „Warum man im Club schweigt“, die übergreifenden Funde aus Akt 2
aufgelöst, neu „Die fehlende Seite“ (Hales Notizbuch) für Akt 4. Nachgezogen: Ambrose ist in Port
Delacroix geboren (eine Tagesreise flussab von New Orleans, wo er später spielte), Old Harbor ist
in 09 überall ersetzt.

**Landschaften und ihre Varianten (Wunsch des Autors, 8.11.2026, 14 Uhr):** Zehn Nebenschauplätze
nach Vorbildern aus den USA, jeder als Weg mit einer Schachvariante, die die Leute dort aus gutem
Grund spielen (`10`, Abschnitt 3a; `09`, Abschnitt 5.9): Port Delacroix Schach960 (Jazz, nie zweimal
dasselbe Stück), Wanderweg Blindschach (kein Brett im Rucksack), Canyon Drei-Schach (Echo),
Geysire Atomschach, Sumpf Nebelschach, Prärie Entenschach („der Twister“), Leuchtturm König der
Hügel, Wüstenstraße Königsrennen, Hochebene ein eigenes Spiel mit Falke und Bison, Bergstadt der
Drache; Tandem und Räuberschach im Camp. Hauptstory und Clubs bleiben klassisch. Reihenfolge nach
Aufwand: erst die Varianten der vorhandenen Engine, dann Fairy-Stockfish als Zusatzpaket.

**Extras aus Funden (Schritt 11 fertig, E3):** Neue Freischaltbedingung „Fund im Schach-Abenteuer“
in den Extras der App (`training/extras.ts`, Art `abenteuer`); erstes Extra: Bretthintergrund
„Riverton-Pavillon“ (Springer aus dem Pavillon). Ein Fund mit Extra meldet „Dafür gibt es etwas
Neues in ‚Dein Aussehen‘“. Der Figurensatz „Waldholz“ (drei Funde) braucht eigene Figurenbilder
und kommt mit der Grafik; das Extra ist in `funde.json` schon vermerkt. Lizenzen: Prüfpunkte für
Fairy-Stockfish und Figurenbilder der Märchenfiguren in `docs/spiel/LIZENZEN.md` (Wunsch des
Autors: bei Zusatzpaketen auf Lizenzen achten).

**Bedenkzeit und Sprüche (Schritt 13 fertig, 8.11.2026):** Begegnungen haben ein Feld `zeit`:
„wahl“ (Clubkämpfe, Sams Revanche, Straßengegner außer Schaffner und Gus) bietet vor der Partie
Ohne Uhr / Schnellschach 10 + 5 / Blitz 3 + 2 an, eine feste Uhr gehört zur Geschichte (Schaffner
3 + 2, Gus 10 + 5); Ambroses erste Lektion, Victor und Mama bleiben ohne Uhr. Die Wahl kostet keine
Nadel (08, Z2). Zeitkarten heißen Sprüche (10, S1): „Kühler Kopf“ (+120 s eigene Uhr, Schaffner),
„Grübelfalle“ (−60 s Gegner, nie unter 5 s, Slick), „Großes Maul“ (fünf Züge gefühlte Zeitnot:
Die Zugwahl des Bots rechnet mit 45 s Restzeit, Stufe „30“, auch ohne Uhr; `spiel/botzeit.ts`
wahlRestzeit, Feld `einstellung.abenteuer.zeitnotBis`). Sprüche nur gegen Rolle `strasse`;
`immunGegen` im Gegnerprofil (Rosa, Harlan), die Karte ist dann trotzdem verbraucht (S4). Gegner
antworten mit `spruch.konter.<name>.1|2`, Ambrose erklärt beim ersten Spruch (Variable
`spruchErklaert`). Dabei gefunden: Startstellungen aus Abbildungen wurden nie in eine FEN
aufgelöst, alle Stellungsduelle brachen beim Start ab; jetzt löst `anbindung/dienste.ts` sie aus
den Kapiteldaten auf (Oberflächentest `abenteuer-sprueche.spec.ts`). Offen: Die Immunität soll im
Steckbrief stehen, sobald es eine Steckbriefansicht gibt; ein Wiedereinstieg spielt ohne die
gewählte Uhr.

**Weitere Karten (8.11.2026, Wunsch des Autors „je mehr, desto besser“, docs/spiel/11):** Zwei neue
Wirkungsarten: `werkzeug` (ein Werkzeug des Buches mit Bedarf nur „stellung“, Abzählen wählt das
Feld selbst: eigene Figur mit dem größten Überhang an Angreifern) und `drohung`/`waage`/`remis`/
`schmeichelei`. 16 Karten, davon 11 Lernkarten mit Feld `kapitel` (Gefahrenradar bekam Kapitel 4);
Lernkarten schenkt die Oberwelt beim Aufbau, wenn `Appdienste.fertigeKapitel` (alle Übungen des
Kapitels gelöst) sie nennt, gemerkt in `lernkarte<Kennung>`. „Was droht?“ rechnet den Nullzug
(nicht im Schach) und nennt nur Schläge und Schachs als Drohung. Remisangebot: angenommen bis
±0,5 (AUSGEGLICHEN_BIS), Ende „vereinbart“. Schmeichelei: überheblich mindestens 1,3, Stärke neu
gerechnet. Sprüche fehlen in der Deckwahl außer gegen Straßengegner. Kartentasche (Gegenstand,
300 Münzen): Deck 4. Nicht gebaut: Schutzengel (bräuchte eine Bewertung jedes eigenen Zuges
während der Bot rechnet), Spickzettel, Pokerface, Limo, Lupe, Reisebrett, Notizbuch.

**Antworten aus Akt 3 (niedrig-1, 8.11.2026):** Konter für dash, batiste, buck, joggerin,
schiffskoch. Immunitäten für die Gegnerprofile von Akt 3 (vorgemerkt): Dash grossesMaul und
ablenkung, Batiste alles außer schmeichelei, Buck keine, Joggerin grossesMaul, Schiffskoch ablenkung.

**Balancing nach mittel-2 (8.11.2026, docs/spiel/11, 7.4; Regel 9, Widerspruch genügt):** Fahrrad
nicht mehr im Kiosk Maple Falls (nur Ironwood, 120); Kartentasche 450 statt 300 (in Akt 2 ein
echter Verzicht); Was droht? 60 statt 45; Remisangebot nur gegen Straßengegner und Clubmitglieder
(sonst sicherte es eine Bronzenadel ohne Sieg); `riverton.flashbackLondon` gibt 20 Münzen statt der
Bauernvorgabe (nur die erste Erinnerung der Staffel gibt sie); Jo bekam die Steckbriefzeile
„Fleck Rückzug“. Ablenkung bleibt im Laden: Z4 („Zeitkarten nie im Laden“) gilt nur für Sprüche,
die die Uhr ändern. Nachgezogen: Straßensiege bringen 10 Münzen nur beim ersten Sieg je Gegner und Tag, danach 2;
Quest-Wirkung `gegenstandWeg`; Limo (5 Münzen) im Kiosk. Die Dialoge der Limo-Quest schreibt mittel-1.

**Schritt 14 Erinnerungen (8.11.2026):** Runden können eine `erinnerung` tragen (Partie aus
`klassiker.json`, ab Zug, Seite); die Aufgabenansicht spielt sie im Zugerraten der App
(`anbindung/ErinnerungsRunde.tsx`), ein Ergebnis „richtig“ ab der Hälfte getroffener Züge. New York
1857 (Paulsen–Morphy ab 13 mit Schwarz), London 1851 (Unsterbliche ab 17 mit Weiß), Bird–Morphy
1858 (ab 17 mit Schwarz) statt der bisherigen Mattbilder. Neue Ort-Art `erinnerung`: Sepia-Filter
über der Welt, Ambrose (Figurbild) als Held, kein Tagebuch, keine Münzanzeige. London als begehbare
Erinnerung bauen niedrig-1 (Karten) und mittel-1 (Ort, Dialoge).

**Lupe des Uhrmachers (I1, 8.11.2026):** Gegenstand `lupe`, vorerst im Zeitungsstand Riverton für 90
Münzen (die Szene 31a „Harlan nach drei Siegen“ braucht einen Zähler für Siege, der noch fehlt).
Mit Lupe öffnet sich vor jeder Partie die Deckwahl und zeigt zwei Steckbriefzeilen und die
Immunität gegen Sprüche (`oberwelt/steckbrieftext.ts`); damit steht die Immunität wie in S4
verlangt vor der Partie sichtbar.

**Antworten des Autors über die Entscheidungsseite (8.11.2026, abends):** Q20-1, -2, -4 bis -11 und
Q19-1 bis -4: Empfehlung folgen. Q20-3 nein: Die Lupe gibt es nur nach drei Siegen gegen Harlan
(Siegzähler `siege<Begegnung>` gebaut, auch für später), nicht im Laden. Q19-2, Notiz „Für was gibt
es Bronze? … in Clubs mit Vorgabe spielen, dann nur ein minderwertiger Orden“: So ist es schon
(Regelwerk R21): Gold ohne Karten, Silber mit höchstens zwei leichten Karten, Bronze mit einer
mittleren oder starken Karte; Vorgaben sind stark, ein Clubkampf mit Vorgabe bringt also höchstens
Bronze, ebenso ein Remis gegen den Clubchef. Q10-1, Notiz (Spielidee): Die Farbe ist zufällig oder
von der Geschichte vorgegeben; neu die Karte „Farbwahl“ (leicht, Kiosk 10 Münzen), nur wo die
Begegnung die Farbe auslost. Q17-1 ja (Kauf durch den Autor offen), Q17-2: Porträts per Skript
(DiceBear Pixel Art, CC0) statt umgewandelter Bilder aus dem Netz (Urheberrecht).
Hinweis des Autors (8.11.2026): Der Spiel-Chat ist nur für das Spiel zuständig; Fragen und
Änderungen der App selbst betreut ein anderer Chat, Empfehlungen dazu sind willkommen.

**Anschlüsse in der App (Wunsch des Autors, 8.11.2026 abends):** erlaubt, solange die App ohne
geladenes Spiel aussieht und arbeitet wie bisher; jede Änderung dem Autor im Chat melden und in
`docs/SPIEL_ANSCHLUESSE_FUER_APP.md` (Info für den App-Chat) eintragen. Dabei behoben: Die Karte
„Schach-Abenteuer“ auf „Spielen“ und das Extra „Brett Riverton-Pavillon“ waren auch ohne Spiel
sichtbar; jetzt nur mit geladenem Spiel oder Spielstand.

**Porträts (Q17-2, 8.11.2026):** 61 Pixel-Porträts aus `app/skripte/erzeuge-figurenbilder.mjs`
(DiceBear Pixel Art 9.4.3, Gestaltung CC0, Code MIT; nur zum Erzeugen installiert), abgelegt in
`inhalte/abenteuer/portraets/`, im Zusatzpaket unter `portraets/` (ein gleichnamiges Bild im privaten
Ordner geht vor). Der Dialog zeigt das Porträt des Sprechers (`#sprecher`, camelCase → kebab-case),
mit `#stimmung:jung` die junge Fassung. Ein Test prüft, dass jeder Sprecher ein Porträt hat.

**Akt 3 vollständig in Daten (8.11.2026, abends):** Funde, Läden (Foodtruck Silicon Bay,
Gebäckstand Port Delacroix, Antiquariat Desert Springs), Erinnerung 1858 (Bird–Morphy ab Zug 11 mit
Schwarz, bei Mira), Pokerface und Schutzengel nicht als eigene Karten (ersetzt durch vorhandene).
Buck bleibt bei Abbildung 1.36: 8.44 steht bei Stockfish Tiefe 28 auf +2,84, zu viel für ein
Stellungsduell nach R13 (Befund mittel-1). R29 gebaut: Zwischen Tiefpunkt und Versöhnung steht der
Mentor-Zug nicht zur Wahl im Deck (`mentorzugGesperrt`).

**Freie Karten (R29, Vorschlag V6 gebaut, 8.11.2026):** Begegnungen können `freieKarten` tragen
(Halbfinale: `["mentorzug"]`). Sie liegen ohne Besitz zusätzlich im Deck, werden nicht verbraucht,
zählen nicht für Nadel und Abenteuerwertung (`Kartenspiel.frei`) und setzen beim Spielen
`<kennung>FreiGespielt` (für den Extra-Abspann: `mentorzugFreiGespielt`). Die Deckwahl nennt sie.
Stärkewechsel mitten in der Partie (Halbfinale): Begegnungsfeld `abgelenktAb {halbzug, faktor}`, ab dem
Halbzug macht der Bot um den Faktor häufiger Fehler (`wahlHaeufigkeit`). Turniermodus der Landesmeisterschaft: ohne neue Technik über Begegnungen und Ink (Punkte aus
`ausgang…`-Variablen, Wiederholen über den Dialog); der Haupt-Chat baut nur, was Ink nicht kann.

**Abspann (Akt 4, Technikliste Punkt 7, 8.11.2026):** Ink-Funktion `zeigeAbspann()`; die Oberwelt
zeigt danach `oberwelt/Abspann.tsx`: alle Figuren der Welt mit Porträt, Mitwirkende, und den
Extra-Abspann (Ambroses Zettel), wenn `mentorzugFreiGespielt` nicht gesetzt ist.

**Erste Variante: Blindschach (V1/L2, 8.11.2026):** Begegnungsfeld `variante: "blind"`; die
Partie trägt `einstellung.abenteuer.variante`, der Rahmen der App bekommt `rahmen-blindschach`, die
Figuren des Bretts sind unsichtbar (die Zugliste bleibt). Varianten zählen nie für App, Wertung
oder Nadeln (`zaehltFuerApp` false). Schach960 und die Varianten mit Fairy-Stockfish folgen.

**Antworten des Autors zu Akt 4 (Q21, 8.11.2026, 21:50):** alle Empfehlungen angenommen. Q21-1:
Die Hochebene zeigt die erfundenen „Vell-Familien“ als kurze, respektvolle Begegnung mit heutigen
Figuren und eigenem Spiel; **vor der Veröffentlichung liest jemand aus einer indigenen Gemeinschaft
gegen** (Sensibilitätslesung, Auftrag nach außen, gehört zur Freigabe). Q21-2 Halbfinale mit
Stärkewechsel (gebaut: `abgelenktAb`), Q21-3 ein Vertriebschef geht, Hale bleibt einsichtig, Q21-4
gleich gutes Ende bei jedem Ausgang des Finales, Q21-5 endgültiger Abschied mit Extra-Abspann
(gebaut), Q21-6 zuerst drei Landschaften mit Varianten (L1, L2, L8; Blindschach gebaut).

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

## Grafik und Oberfläche (9.11.2026)

- **G1 Pakete:** LimeZu Modern Exteriors (Außen), Interiors (Innen, Figuren), Office (Silicon Bay,
  Turnierleitung), Farm (Land, Wege, Tiere), Modern UI (Rahmen, Porträts); Fungus Cave nur bei
  Bedarf. Dungeon, Fantasy Battlers, Serene Village, Kitchen und Platformer nicht, weil Stil oder
  Ansicht nicht passen. Nur im privaten Repository (Lizenz verbietet Weitergabe). Die Zuordnung
  ist kein Zwang: Beim Kartenbau dürfen alle Pakete frei kombiniert werden (Wunsch des Autors,
  9.11.2026), etwa Bürogeräte auch im Arbeitszimmer zu Hause.
- **G2 Oberfläche im Spiel:** Pixelrahmen aus Modern UI, nachgefärbt auf die Farben der App; Schrift
  der App (lesbar, Umlaute, Schriftgröße des Lesers); Brett und Uhr bleiben im Aussehen der App, nur
  die Kartenleiste bekommt den Rahmen. Grund: Immersion (Wunsch des Autors) ohne Bruch zur App.
- **G3 Porträts** aus den Teilen des Porträt-Generators von Modern UI, per Skript zusammengesetzt,
  passend zu den Figuren aus Modern Interiors; DiceBear bleibt Ersatz, wo Teile fehlen.

## Schach960 (9.11.2026)

- **V1 umgesetzt (Technik):** Begegnungen mit `"variante": "schach960"` starten aus einer
  ausgelosten Grundreihe (oder `startnummer`, Zählung nach Scharnagl). Stockfish bekommt
  `UCI_Chess960` nur, solange eine Stellung es braucht; Rochade am Brett durch Antippen des eigenen
  Turms (wie bei Lichess), weil das Zielfeld des Königs im Schach960 auch ein gewöhnlicher Königszug
  sein kann. Zählt wie alle Varianten nie für Nadeln, Wertung oder die App. Inhalte (Tisch, Figur,
  Ambroses Erklärung) baut mittel-2.

**Pixelrahmen gebaut (9.11.2026, G2):** `inhalte/abenteuer/ui/` enthält eigene Platzhalter-Rahmen im
Pixelstil (Fenster dunkel, Karte hell, Knopf) und `rahmen.json` (Bild, Schnitt, Randbreite). Der
Paketbau nimmt Dateien gleichen Namens aus dem privaten Ordner `ui/` vor; für Modern UI genügt dort
eine eigene `rahmen.json` mit den gekauften Bildern. Rahmen tragen Dialog (dunkel), Menüs, Meldungen
und die Kartenleiste (hell) sowie die Wahlknöpfe im Dialog; Schrift und Knöpfe der App bleiben.

**Figuren aus dem Charakter-Generator (9.11.2026):** Jede Figur bekommt einen eigenen Bogen
`figuren/<name>.png` (Pfad aus `sprite` in orte.json) im Format von LimeZu: Rahmen 16 × 32, vier
Standbilder und je Richtung sechs Laufbilder. Zusammengesetzt aus Körper, Augen, Kleidung, Frisur
und Zubehör nach `werkzeuge/figuren.json` im privaten Repository (`werkzeuge/figuren.py`). Der Held
heißt `figuren/held-<variante>.png`, in Erinnerungen `figuren/ambrose-jung.png`. Ohne Bild bleibt der
Platzhalter. Figuren stehen mit den Füßen auf ihrer Kachel, der Kopf ragt in die Kachel darüber;
wer weiter unten steht, wird davor gezeichnet.

**Karten mit echter Grafik (9.11.2026):** Erst ein Kachelstil je Karte (innen, Stadt, Natur, Wüste)
im Raster des Platzhalters, damit alle Karten sofort echte Oberflächen haben; dann Möbel und Schmuck
als Objekte vom Typ `moebel` (moebel.json, Bilder aus dem Register). Ohne gekaufte Grafik zeichnet
der Paketbau Platzhalterrechtecke in derselben Größe, die Karten bleiben spielbar.

**Hinweis des Autors für die nächste Runde der Karten (9.11.2026, noch umzusetzen, nachdem die
Helfer die ersten zehn Karten fertig haben):** Auf den Zustand der Möbel achten (es gibt auch
zerstörte oder verwitterte Stücke; ein kaputter Tisch passt nur an Orte wie Ghost Town, Keller oder
die Turnhalle nach dem Sturm, nicht ins neue Wohnzimmer). Ebenso auf Stile von Möbeln und Natur
(modern, rustikal, alt; Laub-, Nadel-, Wüstenpflanzen): je Ort ein stimmiger Stil. Kommt als Punkt in
die Prüfliste von `inhalte/abenteuer/szenen/README.md` und ins Register (Spalte Zustand und Stil).

**Weitere Hinweise des Autors für die nächste Kartenrunde (9.11.2026):**

- Möbel stehen in logischer Beziehung: Stühle an Tischen; der Fernseher auf einem Lowboard oder
  Fernsehtisch an der Wand, nicht auf dem Esstisch und nicht mitten im Raum; mit etwas Abstand davor
  Sitzplätze mit Blick zum Fernseher; Pflanzen und Stehlampen in Ecken, an Wänden oder neben passenden
  Möbeln, nicht allein mitten im Raum.
- Möbel richtig gedreht: Stühle mit der Sitzfläche zum Tisch; Möbel mit Schubladen oder Türen zeigen
  in den Raum, nicht zur Wand.
- Vorschlag Haupt-Chat: Platzierungsregeln aus den fertig eingerichteten Musterräumen von LimeZu
  ableiten (in den gekauften Paketen: Home Designs, Condominium, Museum, Gym u. a.), als Regeln in den
  Kartenbauer (Beziehungen wie „Stühle um Tisch“, „Sitzplatz vor Fernseher“, „in Ecke“, Blickrichtung)
  und ins Register (Vorderseite und Blickrichtung je Bild).

**Hinweise des Autors zu Außenkarten (9.11.2026, für die nächste Runde):**

- Ausrichtung auch draußen: Die Bushaltestelle zeigt zur Straße; Laternen stehen am Weg oder an der
  Straße, die sie beleuchten.
- Bäume in Wohngebieten sind gepflanzt: in Reihen an der Straße, in Vorgärten, symmetrisch zum Haus;
  zufällig verteilt nur in Wald und Wildnis.
- Stimmige Nachbarschaft: Wohnhäuser neben Wohnhäusern; Industrie- oder Geschäftsbauten nur, wo die
  Story es erklärt (Ironwood, Silicon Bay).
- Innen und außen passen zusammen: Größe und Stand des Hauses draußen entsprechen den Räumen drinnen
  (eine Villa hat viele, gut eingerichtete Räume; ein schlichtes Reihenhaus wenige, einfache). Je
  Gebäude mit Innenkarte wird das Haus draußen nach den Innenräumen gewählt oder umgekehrt.

**Rückmeldung des Autors zu Runde 3 der Karten (9.11.2026, mündlich, zusammengefasst):**

- Dachboden: Treppe muss nach unten führen (wirkt wie Treppe nach oben); Kommode oben links steht
  in der Wand. Sonst glaubwürdig (Gerümpel, auch Kaputtes, passt zum Dachboden).
- Wohnzimmer: kaputte Kommoden; Fenster vor statt hinter den Gardinen; Fernseher an der Wand mit
  Kommode davor ist unlogisch (dann auf dem Möbel), nicht neben der Eingangstür; Pflanzen zufällig;
  Sofa falsch gedreht; Küchenmöbel gehören nicht ins Wohnzimmer (außer Einzimmerwohnung).
- Clubraum: Globus schwebt; goldene Figur nicht auf der Tischplatte; Pflanzen nicht ganz in den
  Ecken; darf belebter sein.
- Allgemein: graue Schatten unter vielen Möbeln passen nicht zum Boden.
- Maple Falls draußen: Gehweg nur oben mit Steinkante, endet links und rechts im Gras; Häuser links
  wirken industriell neben der Villa (Story?), stehen nicht an der Straße, kein Weg zur Tür, keine
  Gartenzäune; eine Villa hätte eher einen größeren Garten.
- Park: brauner Streifen über dem Wasser unterbricht den Rasen; Weg endet vor dem Wagen (was ist er?);
  Blumenkästen nicht zum Weg ausgerichtet; grauer Kasten neben der Bank unklar. Figuren bewegen sich
  später (Tagesabläufe), Position zweitrangig.
- Landstraße: Baumstümpfe auf dem Weg; Weg endet vor dem Rand; Zaun unten ohne Sinn?; Schild ohne
  Aufschrift; Bank fern vom Weg und vom Weg weggedreht, ohne Aussicht; zu wenig Flora; Feld soll bis
  zum Rand gehen; Traktor gehört an die Feldeinfahrt; Wegweiser mit zwei Richtungen nur an Kreuzungen.
- Cedar Creek draußen: Weg endet vor dem Rand, nur oben Steinkante; Blumenkasten blockiert den Gehweg;
  Tür der Bibliothek hängt oben in der Wand und passt nicht zum Gebäude; Steg beginnt nicht am Ufer;
  grauer Kasten neben der Baustelle unklar; Bank abseits und weggedreht; Schild steht zusammenhanglos
  im Gras; Gewässer sind immer kleine, rundum geschlossene Seen – große Gewässer müssen bis zum Rand gehen.
- Bibliothek: unruhiger, sich wiederholender Boden; Gegenstand neben statt auf dem Tisch; zu wenig
  Bücherregale; Pflanzen nicht in Ecken oder an Durchgängen; Lücke in der Wand: Tür oder Durchgang?;
  Globus: nicht jedes Asset überall benutzen.
- Archiv: zu leer, Kisten zufällig am Boden; Stuhl falsch gedreht; Lampe besser neben den Tisch.
- Waschsalon: Pinnwand über dem Getränkeautomaten; unterschiedlich große Waschmaschinen; Maschinen
  gehören lückenlos in Reihen; Tische aus dem Wohnzimmer (Küchenmöbel?) passen nicht.
- Vorgehen (Wunsch des Autors): erst allgemeine Regeln aus allem Feedback, dann die Assets ausführlich
  beschreiben (was, Ort, Zustand, Material, Stil, mögliche Ausrichtungen, eigenständig oder Bauteil,
  Beziehungen zu anderen Dingen), dann erst der nächste Kartenlauf.

**Vorgehen vor Runde 4 der Karten (9.11.2026, mit dem Autor abgestimmt):**

- Regelwerk `docs/spiel/KARTENREGELN.md` aus allen Rückmeldungen; ergänzt um Vorbilder: die
  Beispielräume des Zeichners (Abschnitt 8) und die Szenen von den Verkaufsseiten (Abschnitt 9).
- Ortsprofile `inhalte/abenteuer/ortsprofile.json`.
- Katalog aller Bilder im privaten Repository (`register/katalog.json`): Farbvarianten nach Umriss
  zusammengefasst, Beschreibung je Form durch Sonnet-Helfer; Opus prüft alle Einträge mit
  Sicherheit unter 0,7 und eine Stichprobe von 5 %. Stufe 1 (erste Orte) zuerst, der Rest bei Bedarf.
- Wunsch des Autors: Ausrichtung schließt nichts aus, was mit einem anderen Bild möglich ist. Darum
  beschreibt „blick“ nur das Bild; „ansichten“ verweist auf dasselbe Ding in anderer Ausrichtung,
  „nutzbar_von“ nennt die sinnvollen Seiten.
- Wunsch des Autors: Vor jeder Karte ein Ortsdokument (`docs/spiel/orte/`): Ortsplan mit allen
  Übergängen, erzählendes Ortsbild, Abgleich mit der Geschichte, Bühnenbild je Karte. Die
  Übergänge prüft `pipeline/abenteuer/uebergaenge.py`. Muster: Maple Falls, Erdgeschoss.
- Möbel nutzen die Fassung mit halbdurchsichtigem Schatten (Black_Shadow).

**Vollmacht des Autors für das Abenteuer (9.11.2026, nachmittags):** Der Autor steckt derzeit nicht
tief in der Geschichte und kann Ortsdokumente und Wegenetz nicht prüfen. Der Haupt-Chat prüft
gründlich, nimmt die Entwürfe dann als geprüft und entscheidet selbst, wo er sonst gefragt hätte; er
meldet jede solche Entscheidung, damit der Autor widersprechen kann. Der Autor prüft später die
fertigen Karten und beim Spielen die Geschichte.

**Vom Haupt-Chat entschieden (Widerspruch genügt):**

- Maßstab: Pokémon mal 1,5 bis 2 (vom Autor gewählt), Räume etwa anderthalbmal Pokémon.
- `12_Akt1_Leben.md`: neue kleine Aufgaben zählen nicht für „alle Nebenquests“ (R27); Mrs. Whitlock
  heißt Margaret; kein Rauchen im Spiel (Busfahrer mit Thermoskanne); die Kühe an der Landstraße
  sind die ausgebüxten Kühe vom Kürbishof Miller (N1).
- `13_Wegenetz.md`: Sperren mit Grund aus der Welt, Schlüssel aus dem Alltag (Fahrrad, Laterne,
  Gummistiefel, Fährpass, Monatskarte), sieben Nebenorte ohne Club, Rückkehr in frühere Städte.
- Unsichere Katalogeinträge werden erst geprüft, wenn eine Karte sie braucht; die Bildprüfung
  meldet sie.
- Möbel je Ort (Auftrag des Haupt-Chats, 9.11.2026, umgesetzt von mittel-2): Statt einer
  `inhalte/abenteuer/moebel.json` gibt es `inhalte/abenteuer/moebel/<ort>.json` und `allgemein.json`
  (alte Platzhalter und über mehrere Orte verteilte Teile). Grund: Jeder Merge paralleler Helfer gab
  Konflikte in der einen Datei. Namen bleiben über alle Dateien eindeutig (Test); die Pipeline liest
  über `pipeline/abenteuer/moebelliste.py`, der Paketbau führt die Dateien zu einer
  `daten/moebel.json` im Paket zusammen, die App bleibt unverändert.
- Prüfung der Akt-2-Dokumente (Bericht `pruefberichte/2026-11-09_akt2.md`): neue Namen gegen
  Verwechslung (Margie Pell, Walt und Kendra Kerrigan, Ellis Navarro, Henrik Dahl, Silas Pike,
  Benny); das Lieferbuch im Steinbruch nennt nur „J. H.“; Cedar Creek bekommt einen Haltepunkt der
  Bahn; kein Bus in Silicon Bay; Fragen zu einer Stellung als Aufgabenrunde mit einer Aufgabe.
- Rückmeldung des Autors zu Runde 4 (Bericht `pruefberichte/2026-11-09_runde4_autor.md`): Die
  Kritik wird zu Regeln (KARTENREGELN 10). Umzugskartons und Dachbodenkisten bleiben (Bibel:
  erster Abend nach dem Umzug), geordnet an den Wänden; der Globus gehört aufs Lehrerpult oder
  einen Tisch; Bänke und Wartehäuschen schauen auch in Amerika zum Weg. Möbel mit grauem
  Festschatten bekommen den durchscheinenden Schatten aus LimeZus Black_Shadow-Fassung
  (`werkzeuge/schatten.py` im privaten Repository). Das Diner wird neu gedacht (mittel-3).
- Varianten (Wunsch des Autors, 9.11.2026): Jede Karte entsteht in drei Varianten; der Autor wählt
  auf einer Auswahlseite. Gewählt für Akt 1: Dachboden, Clubraum, Diner, Flussweg, Zedernpfad,
  Ortskern Cedar Creek und Waschsalon in C, die übrigen sieben in A. Die früheren A liegen als
  `szenen/varianten/<datei>-a.json`.
- Rückmeldung zu den Varianten (Bericht `pruefberichte/2026-11-09_varianten_autor.md`, Regeln 10.8):
  Das rot-weiße Schildchen im Park (Sperre des morschen Stegs, S5) wird ein Absperrbock mit
  „GESPERRT“; der Wasserfall an der Birch Lane fällt weg, solange es keine Felswand gibt; Südtüren
  werden eigene niedrige Türen; das Gleis in Cedar Creek endet an einem Prellbock. Fehlende Teile
  (Brücken, Luke, Prellbock, Schilder) zeichnet der Haupt-Chat aus LimeZus Texturen und Farben
  (`werkzeuge/bruecken.py`, `werkzeuge/schilder.py`); fremde Pakete passen im Stil nicht.
- Nacht 9./10.11.2026 (Freigabe des Autors): Nacharbeit Akt 1 und alle Karten von Akt 2 in drei
  Varianten (Auftrag `auftraege/runde5_karten.md`), Revision am Morgen.

## 10.11.2026 – Notizen des Autors zu den Akt-1-Karten (Revisionsseite, Runde 7)

Alle Akt-1-Außenkarten bleiben bei Variante A. Die Antworten auf die Fragen des Autors gelten nach
Regel 9; Widerspruch genügt.

- **Park, Reisebrett:** Es liegt sichtbar auf Abernathys Bank, als Haken für Szene 7.
- **Park, Halfpipe:** Die Geschichte braucht sie (Jo, Szene 10). Im Katalog gibt es keine, deshalb
  zeichnet niedrig-1 eine eigene neben dem Basketballplatz.
- **Park, Schulbus:** Er ist erst in Szene 13 zu sehen; bis dahin ist die Haltestelle leer.
- **Park, Steg:** Die Absperrung am morschen Steg ist S5 und bleibt dort. Der begehbare Steg führt
  zum Zedernpfad, und das Schild „Sturmschaden“ (S2) steht an seinem Ende.
- **Maple Falls, Straße links:**
  - Westlich liegt in der Geschichte nichts.
  - Birch Lane endet sichtbar in einem Wendehammer mit Hecke.
  - Das Haus hinter dem Diner erreicht man über einen Weg um das Diner, nicht durch einen
    Hinterausgang.
- **Landstraße:** Das hängende „Garage Sale“-Schild wird ein stehendes Schild auf einem Pfosten.
- **Cedar Creek:** Der Prellbock steht quer zum Gleis, wenn nötig als eigenes Bild.
- **Neue Regel 10.55:** Statisten und Tiere stehen nicht im Wasser und nicht in Möbeln oder
  Bäumen. Schwimmer werden nur bis zur Wasserlinie gezeichnet. Der Kartenbauer prüft das. Die
  Befunde aller Karten stehen in `auftraege/nacharbeit_10_55.md`.

## 10.11.2026 – Winter ohne Schnee-Bilder: Winter als Zustand mit Schneefärbung

Frage des Autors: Die Geschichte spricht von Winter, aber die Bilder sind nicht winterlich. Braucht
es Schnee-Bilder, oder lassen wir den Winter weg?

Befund: In den gekauften Paketen gibt es keinen Schnee, nur eine Schneekugel als Deko.

Empfehlung, gilt nach Regel 9 (Widerspruch genügt):

- **Der Winter bleibt.** Er ist ein Zustand der Karte (KARTENREGELN 10.63), zum Beispiel
  `ironwood.aussen` im Winter.
- **`kartenbild` färbt die Karte im Winterzustand automatisch um:**
  - Gras und Laub werden zu Schnee, wobei die Helligkeit bleibt.
  - Erde wird entsättigt, Wasser kühler.
  - Blumen und Pilze kommen in der Winterszene weg.
  - Ein Test am Flussweg (10.11.2026) sah überzeugend aus, ohne ein neues Bild.
- **Die App legt im Winter Schneefall über die Karte** (Teilchen). Die Tönung bleibt verfügbar.
- **Eigene Bilder nur, wo die Umfärbung nicht reicht:** etwa Schneemann oder verschneite Dächer,
  falls gewünscht.
- **Umsetzung:** mittel-2, nach der Technik der Zustände.

## 10.11.2026 – Dialoge: glaubwürdig, keine Buchverweise

Der Autor beim ersten Spielen auf der Beta: Ambrose sagt gleich am Anfang zu dem Jungen, den er
gerade als Geist heimsucht, das könne er „in Kapitel … meines Buches nachlesen“. So spricht kein
Geist, der vor langer Zeit gelebt hat und ein Kind findet. Das Spiel ist keine Werbung für das Buch.

- **Keine Verweise auf das Buch in Dialogen und Spieltexten:** keine Kapitel, Abschnitte, Seiten,
  kein „lies nach“, kein „in meinem Buch steht“. Das gilt für Figuren, Karten, Ergebnistexte,
  Tagebuch und Hinweise.
- **Erlaubt bleibt die Schnitzeljagd:** Hin und wieder findet der Held eine Seite aus Ambroses altem
  Buch. Dort kann er sie lesen, und Ambrose sagt höchstens, dass es eine seiner Seiten ist.
- **Jeder Satz passt zur Figur:** zu ihrem Charakter laut Story-Bibel, zu ihrer Zeit, zu ihrem Ort
  und zu der Lage, in der sie gerade spricht. Ambrose spricht wie ein Mann aus dem 19. Jahrhundert,
  der staunt, tastet und sich erinnert, nicht wie ein Lehrbuch.
- Die Zuordnung der Aufgaben und Karten zu Buchkapiteln bleibt in den Daten (für die Pipeline und
  die Buch-App), sie erscheint nur nicht mehr im Spiel.

Auftrag: `docs/spiel/auftraege/runde10_dialoge.md` (mittel-2).

## 11.11.2026 – Rückmeldung des Autors zu den Karten (Sammel-Chat, R001 bis R070)

Der Autor hat die Karten auf der Weltkarte durchgesehen; die Sammlung steht in
`docs/spiel/auftraege/rueckmeldung/sammlung.md`. Hauptpunkt sind die „Abziehbilder“: von Hand
gezeichnete Bilder ohne Tiefe, die neben den gekauften Paketen herausfallen.

- **Abziehbilder kommen weg.** Reihenfolge für Ersatz: Paketbild aus dem Katalog, dann Zusammenbau
  aus Paketteilen, erst zuletzt ein Wunsch für Gemini (gesammelt in einer Datei für den Autor). Selbst
  Gezeichnetes bleibt nur für Flaches (Schilder, Markierungen, Böden, Plakate). Der Gutachter sichtet
  alle 558 eigenen Bilder.
- **Kartenwechsel erst mit Bewegung zum Durchgang**, nicht beim Darüberlaufen.
- **Wege sind verbindlich:** keine Abkürzung durch Wald oder um Felswände herum, außer zu Fundstellen.
- **Drei Straßenarten**, die man unterscheidet: Trampelpfad, Landstraße (Bus), Stadtstraße.
- **Die Außenkarten ergeben eine Weltkarte** ohne Überlappung; Flüsse und Straßen setzen sich fort.
- **Innenräume passen zum Gebäude außen**; Türen deuten weitere Räume und Treppenhäuser an.
- **Figuren stehen sinnvoll**, Schachspieler sitzen.

Auftrag mit Verteilung: `docs/spiel/auftraege/runde11_rueckmeldung.md`.

## 12.11.2026 – Innenraum gegen Gebäude: ab 50 % Abweichung der Fläche anpassen

Der Autor zu R065 (`gutachten/INNEN_AUSSEN.md`): Weicht die Fläche des Innenraums um 50 % oder mehr
von der Fläche ab, die das Gebäude außen hergibt, wird angepasst. Gemessen wird die Grundfläche (Breite
mal Tiefe), nicht nur die Breite.

- **Raum größer als das Gebäude** (der häufige Fall): **das Gebäude außen vergrößern.** Räume, die
  der Autor schon im Einzelnen durchgesehen hat (alle Karten der Sammlung R001 bis R151: Maple Falls,
  Cedar Creek, Riverton, Lockport, London und die Wege dazwischen), werden **nicht verkleinert**
  (Autor, 12.11.2026). Bei noch nicht durchgesehenen Räumen ist Verkleinern oder Teilen erlaubt, das
  Vergrößern des Gebäudes bleibt die erste Wahl.
- **Gebäude größer als der Raum:** Türen (auch verschlossene) und Treppenhäuser zeigen weitere Räume
  an; so hatte der Autor es in R065 beschrieben.
- **Die Form geht vor die Größe** (Autor, 12.11.2026): Der Grundriss des Innenraums folgt dem
  Grundriss, den das Gebäudebild nahelegt. Nicht jedes Gebäude ist ein Rechteck: Anbau, Flügel,
  Vorbau, Turm, L- oder T-Form (Beispiel R151, Gasthaus zur Schleuse: außen ein liegendes T) zeigen
  sich innen als dieselbe Form. Vorgehen je Gebäude: das Außenbild ansehen, den Grundriss daraus
  ableiten (Lage der Flügel, Türen, Fenster), den Raum danach formen; erst dann die Fläche prüfen.
  Lässt sich die Form innen nicht herstellen, ohne einen durchgesehenen Raum zu zerstören, wird das
  Gebäudebild außen getauscht oder aus dem Baukasten passend gebaut.
- **Lage des Eingangs** stimmt immer überein, unabhängig von der Fläche.
- Der Gutachter hat bisher nur Breiten aus den Daten verglichen. Wenn es weitergeht, prüft er je
  Gebäude am Bild zuerst die Form, dann die Fläche.

## Innenraum größer als das Gebäude außen; Aufgänge im Katalog (13.11.2026)

Der Autor hat bestätigt: Außenbilder sind gestaucht (typisch 5 Türen breit statt 10), Innenräume
dürfen deshalb größer sein. Es gilt die Tabelle in den Kartenregeln 10.75 (klein bis 2,5-fach,
mittel bis 2-fach, groß bis 1,5-fach in der Breite); die 50-Prozent-Regel misst gegen den
Grundriss mal Faktor. Zu jedem mehrgeschossigen Gebäudebild steht im Katalog, ob Treppe,
Treppenhaus, Leiter oder Fahrstuhl passt und wo (Feld `aufgang`, Regel 10.76).
