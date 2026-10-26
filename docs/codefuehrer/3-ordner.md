# Die Ordner der App (`app/src/`)

Jeder Abschnitt unten beschreibt einen Ordner. Die Konzeptkarte zeigt genau diese Texte, wenn man
einen Ordner antippt. **Die Zeilen mit `## ` und dem Ordnernamen bitte nicht umbenennen**, daran
erkennt das Skript, welcher Text zu welchem Ordner gehört. Alles darunter darf frei geändert werden.

Die Reihenfolge folgt den Ebenen der App: oben die Oberfläche, unten die Grundlagen. Die
Abhängigkeiten zeigen nach unten: Die Oberfläche benutzt alles, die Schachlogik kennt keine
Bildschirme.

## ui/bildschirme

Die ganzen Seiten der App, eine Datei je Bildschirm: `Buch.tsx` (Kapitel und „Abbildung öffnen“),
`Kapitel.tsx`, `Abbildung.tsx` (Brett mit Buchmarkierungen, Werkzeugen, Engine), `Training.tsx`
und `Trainer.tsx`, `Uebung.tsx`, `Spielen.tsx` (Gegner wählen, Partie beginnen), `Partie.tsx`
(spielen, Uhr, Auswertung), `Ich.tsx` (Profil), `Einstellungen.tsx`, `Nachschlagen.tsx`,
`Glossar.tsx`, `Steckbriefe.tsx`, `Checkliste.tsx`, `Denkroutine.tsx`, `Lernsammlung.tsx`,
`Lizenzen.tsx`, `AutorAufgaben.tsx` (die Aufgabenseite für den Autor).

## ui/komponenten

Die Bausteine, aus denen die Bildschirme bestehen, seit 26.10.2026 in 19 Unterordnern nach
Themen (vorher rund 190 Dateien in einem Ordner). Die Unterordner stehen unten je mit einem
eigenen Abschnitt. Die `use…`-Dateien sind die „Gehirne“ der Bildschirme, etwa `usePartie`
(laufende Partie und Zug des Bots) oder `useWerkzeugwahl` (welches Werkzeug offen ist). Das
Aussehen (Farben, Abstände, Schriften) steht daneben in `ui/stil/` als CSS.

## ui/komponenten/bausteine

Kleine Teile, die überall vorkommen: Auswahl-Chips (`Auswahl`), Reiter, Segmentleiste,
Fragezeichen-Knopf (`InfoKnopf`), Aufklapper, Zeichen vor Knöpfen und Überschriften, Ring- und
Balkenanzeigen. Dazu Hilfen ohne eigenes Aussehen: `useDaten` lädt Daten für einen Bildschirm,
`useEroeffnungsindex` die Eröffnungen des Buches, `dateiAnbieten` bietet Text als Datei an.

## ui/komponenten/rahmen

Der feste Rahmen um alle Bildschirme: die Leiste unten (`Leiste`), die Kopfzeile oben
(`Kopfzeile`) und die Startanimation mit dem goldenen Springer. Dazu die zwei Teile der
Aufgabenseite für den Autor (`Aufgabenpunkt`, `AufgabenRueckweg`).

## ui/komponenten/hinweise

Hinweise, die oben in der App oder als Fenster erscheinen: neue Version, Zeit für eine
Datensicherung, Safari löscht Daten, Speicher nicht lesbar. Dazu der einmalige Hinweis auf Maia
beim ersten Antippen eines Bots; wann er kommt, rechnet `maiahinweis.ts`.

## ui/komponenten/einstellungen

Die Karten des Einstellungen-Bildschirms: Anzeige (`EinstellungenKarte`), Schriftgröße, Sprache,
das Maia-Zusatzpaket (`MaiaWahl`, `maiastand`), Datensicherung und Löschen aller Daten, dazu das
Formular „Fehler melden“.

## ui/komponenten/gegner

Die Wahl eines Gegners vor der Partie: Engine oder Mensch, die vorgefertigten Bots als
Porträtgitter je Stufe (`GegnerWahl`, `Gegnerstufen`), das Bild eines Gegners mit Siegmarken
(`GegnerBild`) und der Gruppenmodus. Dazu kleine Texte wie „etwa 1100“ (`staerkeangabe`).

## ui/komponenten/gegnereditor

Eigene Gegner anlegen und einstellen (`GegnerEditor`, `EigeneStufe`): vier Reiter für Stärke,
Stil, Fehler und blinde Flecken, die Spinnennetze (`Profilnetz`, `Stilnetz`, `Fleckennetz`) und
die Regler. Die Rechnung dahinter ohne Oberfläche steht in `fehlerprofil.ts` und
`fehlergruppen.ts`.

## ui/komponenten/spielstart

Was vor dem Beginn einer Partie gewählt wird: Bedenkzeit (`ZeitWahl`), Spielhilfen, Eröffnung,
Startstellung mit Stellungseditor, dazu die feste Startleiste unten und der Knopf „Partie
beginnen“.

## ui/komponenten/partie

Die laufende Partie: der Zustand (`usePartie`), der Zug des Bots (`botzug`, `botNotmodus`), Uhr,
Zugliste, Statuszeile, Titel und Ergebnis. Dazu der Engine-Knopf während der Partie
(`SpielEngine`) und die Werkzeuge am Brett der Partie (`PartieWerkzeuge`).

## ui/komponenten/partienliste

Die Liste der gespielten Partien: eine Zeile je Partie (`Partiezeile`), Filter und Sortierung,
der Löschmodus und das Einlesen einer Partie aus PGN.

## ui/komponenten/auswertung

Die Auswertung nach der Partie: `useAuswertung` lässt die Engine jede Stellung bewerten,
`Auswertung` zeigt das Ergebnis. Dazu Genauigkeit und Spielstärke, die Karte „Deine Züge“, die
Verlaufskurve der Bewertung und die Zeichen der Zeilen und Phasen.

## ui/komponenten/rueckblick

Das Nachspielen einer ausgewerteten Partie: die Karte zum gezeigten Zug (`Rueckblickkarte`) mit
besserem Zug und Erklärung, der Nebenzweig „Besser war …“, die Marke der Zugklasse am Brett und
der Bewertungsbalken. `useTheorie` erkennt, ob ein Zug noch Eröffnungstheorie ist.

## ui/komponenten/fortschritt

Wertung und Fortschritt des Lesers: die Kurve der eigenen Wertung mit Maßstab (Lichess,
chess.com, FIDE), die geschätzte Spielstärke je Zeitklasse, die Ringe „Dein Fortschritt“ und die
Gratulation, wenn ein Ring voll wird (`Ringfeier`).

## ui/komponenten/werkzeugkarten

Die Karten unter dem Brett, die ein Werkzeug oder die Engine zeigen: `Werkzeugkarte` mit Befunden
und Fazit, `EngineKarte`, die Engine-Teile einzelner Werkzeuge (etwa `FalleKarte`,
`KandidatenKarte`, `RuheKarte`) und „So prüft die App“.

## ui/komponenten/werkzeugwahl

Welches Werkzeug gerade offen ist und wie man es wählt: die Werkzeugleiste mit den Bündeln, die
Symbole am Brett, die Ordnung der Werkzeuge je Kapitel (`werkzeugordnung`) und das Ergebnis des
gewählten Werkzeugs (`werkzeugergebnis`).

## ui/komponenten/brettbedienung

Das Brett mit seinen Knöpfen (`Brettbereich`) und was ein Tipp aufs Brett bedeutet
(`useBrettbedienung`): ziehen, zählen, Bauern umwandeln. Dazu die Zugleiste und die vier
Zugknöpfe, die auch die Trainer benutzen.

## ui/komponenten/abbildung

Teile des Abbildung-Bildschirms: die Bildunterschrift aus dem Buch (`Unterschrift`), Pfeile und
Felder des Buches (`buchmarkierungen`), „Erst selbst denken“, Warum-Fragen und der Sprung zu einer
anderen Abbildungsnummer.

## ui/komponenten/kapitel

Die Kapitelübersicht: die Galerie der Abbildungen, „Dein Fortschritt“ im Kapitel, die
Kapitelnummer im Ring und die Übungen eines Kapitels mit ihrem Ablauf (`useUebung`).

## ui/komponenten/training

Der Bereich Training: die fälligen Wiederholungen und je Trainer eine kompakte Zeile mit Symbol
(`Trainerkarte`, `trainersymbole`).

## ui/komponenten/lernsammlung

Die Lernsammlung: Stellungen mit einem Plan-Satz speichern (`SammelFormular`), einen Eintrag
zeigen und später abfragen.

## ui/trainer

Die Oberfläche der Trainer: je Trainer ein „Bereich“ (Thema und Stufe wählen, etwa
`TaktikBereich.tsx`) und eine „Aufgabe“ (eine einzelne Aufgabe am Brett, etwa
`Taktikaufgabe.tsx`); dazu der gemeinsame Ablauf einer Runde (`useRunde.ts`, `Rundenrahmen.tsx`).

## ui/brett

Das Schachbrett selbst: Zeichnen (`Brett.tsx`), Figuren, Pfeile und Marken wie im Buch
(`Brettmarken.tsx`, `geometrie.ts`), Antippen und Wischen (`useZiehen.ts`, `treffer.ts`), das
Gleiten der Figuren (`Zuganimation.tsx`) und die Zugtöne.

## ui/profil

Name und Porträt des Lesers und der Porträt-Baukasten (auch für eigene Bots).

## ui/werkzeuge

Was eine Werkzeugkarte zeigt, wenn das Werkzeug in einer Stellung nicht greift, etwa „Es ist
Mittelspiel, und alle vier Faktoren stehen gleich“.

## tour

Der Rundgang durch die App: die Schritte als Daten (`touren.ts`), das Hervorheben der Ziele auf
dem Bildschirm, das Toursymbol oben rechts und das Angebot beim ersten Start.

## start

Die zwei Dateien direkt in `app/src/`: `main.tsx` ist der allererste Startpunkt (Schriften,
Aussehen, Speicher laden), `sw.ts` der Service Worker, der alle Dateien für den Offline-Betrieb
bereithält.

## app

Die Hülle: `App.tsx` zeigt den aktuellen Bildschirm, die Leiste unten und die Hinweise.
`navigation.tsx` und `stapel.ts`: Die App hat keine Adressen wie eine Website, sondern einen
Stapel von Ansichten; „Zurück“ nimmt die oberste weg. Dazu `stapelMerker.ts` (weitermachen, wo
man war), `einstellungen.ts`, `farbschema.ts`, `schriftgroesse.ts`, `ton.ts`, `offline.ts` und
`offlineKern.ts` (Offline-Betrieb und Updates), `maiapaket.ts` (Maia laden und löschen),
`melden.ts` (Fehler melden) und `Fehlergrenze.tsx` (fängt Abstürze ab und zeigt eine Meldung statt
einer leeren Seite).

## training

Die Logik der Trainer, ohne Oberfläche: Aufgaben auswählen, Antworten prüfen. Je Trainer eine
Datei: `taktiktrainer.ts`, `fallentrainer.ts`, `zaehltrainer.ts`, `strukturtrainer.ts`,
`planbilanztrainer.ts`, `endspieltrainer.ts` und `endspieldrills.ts`, `repertoiretrainer.ts`,
`abweichungstrainer.ts`, `denkroutinetrainer.ts`, `studientrainer.ts`, `dreissigminuten.ts`
(30-Minuten-Plan), `fehlerdatenbank.ts`, `lernsammlung.ts`. Dazu `trainer.ts` (Verzeichnis aller
Trainer), `wiederholung.ts` (fünf Kästen für Wiederholungen), `buchstellungen.ts` (alle
Abbildungen als Aufgabenvorrat).

## spiel

Die Partie gegen die Engine. Während der Partie: `partie.ts` (Einstellung, Züge, Rücknahme,
Ende), `ablauf.ts` (Zug spielen, Uhr drücken), `uhr.ts`, `botzeit.ts` (Uhr der Bots),
`ergebnis.ts` (Matt, Patt, 50 Züge, Wiederholung, Zeit). Nach der Partie: `auswertung.ts`
(Zugklassen wie „bester Zug“, „Theoriezug“, „Fehler“), `genauigkeit.ts` (Genauigkeit und
geschätzte Spielstärke), `elomodell.ts` (Elo-Zahl je Zeitklasse), `wertung.ts` (deine Wertung
über viele Partien), `umrechnung.ts` („entspricht etwa chess.com …“), `erklaerung.ts` (warum ein
Zug ein Fehler war). Rund um Partien: `pgn.ts` und `pgnimport.ts`, `stellungsbau.ts`,
`partienfilter.ts`.

## speicher

Was sich die App merkt: alles in einer Datenbank im Browser (IndexedDB), nur auf deinem Gerät.
`speicher.ts` lädt und speichert, `datenbank.ts` spricht mit der Datenbank, `format.ts` kennt die
Versionen des Datenformats und wandelt alte Stände um (darum gehen bei Updates keine Daten
verloren). Einzelteile: `partien.ts`, `fortschritt.ts`, `gegner.ts` (eigene Bots), `besiegt.ts`,
`profil.ts`, `trainerverlauf.ts`. `sicherung.ts` ist die Datensicherung als Datei.

## autor

Die Aufgabenseite für den Autor: liest `docs/AUFGABEN_AUTOR.md` in Abschnitte und Punkte, merkt
Haken und Notizen und macht aus Stellen wie „Abb. 1.26“ Links in die App.

## startseite

Die Website des Buches außerhalb der App: Startseite, Installieren, die Trainingsseiten je Kapitel
und die Sicherheitsregel (CSP) der Seiten.

## admin

Das Dashboard unter /admin/: Meldungen der Leser, die Ampel der Prüfungen und der Knopf „Aufgabe
für Claude“.

## sw

Teile des Service Workers: welche Dateien vorab geladen werden und wie die Sprachpakete (etwa
Englisch) nachgeladen werden.

## analyse

Die Werkzeuge des Buches, eine Datei je Werkzeug mit dem Kapitel im Namen: `k1-zaehlen.ts`
(Angreifer und Verteidiger zählen), `k1-todsuenden.ts`, `k2-zielbilanz.ts`,
`k3-faktorenbilanz.ts`, `k4-warnsignale.ts`, `k5-felder.ts` bis `k5-richtung.ts`
(Skelett-Röntgen), `k6-wo.ts` (Planfragen), `k7-motiv.ts`, `k8-opposition.ts`, `k8-quadrat.ts`,
`k9-erkennungsbilder.ts`, `k11-phase.ts`, `k12-kandidaten.ts` (Denkroutine) und so weiter.

Alle Werkzeuge haben dieselbe Form (`werkzeug.ts`): Stellung rein, Sätze in der Sprache des Buches
und Brettmarken raus. `register.ts` ist das Verzeichnis, in dem jedes Werkzeug angemeldet ist.
`stellungsprofil.ts` rechnet je Stellung einmal die gemeinsamen Grundlagen. Die Werkzeuge rechnen
ohne Engine, nur mit den Regeln des Buches; darum stimmen sie mit dem Buch überein und sind auch
offline sofort da.

## engine

Stockfish, die Stufen, die Bots und Maia.

- Stockfish anbinden: `engineDienst.ts` (Engine im Hintergrund), `wertInWorten.ts` („Weiß steht
  besser“), `letzterzug.ts` (Zeichen ?!, ?, ??, !).
- Die Stufen: `stufen.ts` (zehn Stufen mit Ziel-Elo), `grundschicht.ts` (Spiel ohne menschliche
  Fehler).
- Wie ein Bot seinen Zug wählt: `zugwahl.ts` ist der Einstieg, `menschenwahl.ts` mischt
  menschliche Fehler hinein, `wahlmodell.ts` und `wahlschritt.ts` wählen wie Menschen dieser
  Wertung, `maia.ts` fragt Maia, `fehlerart*.ts` erkennen die typischen Fehler des Buches,
  `blindeFlecken.ts`, `bedenkzeit.ts`, `stile.ts`.
- Die Bots: `gegnerliste0.ts` bis `gegnerliste2.ts` (Namen, Stil, Charakter), `gegner.ts`,
  `gruppe.ts` und `gruppenwahl.ts` (Gruppenmodus).
- Die gemessenen Zahlen: `botstaerke.ts` mit den Tabellen `botstaerke-daten.ts` (ohne Maia) und
  `botstaerke-maia-daten.ts` (mit Maia), `zahlensatz.ts`, `wahlkorrektur.ts` und
  `zeitklassenabstand.ts` (Blitz und Klassisch).
- Dateien mit `kandidat`, `botmess`, `eloleiter`, `botarchiv` gehören zu den Messläufen, mit denen
  die Bots ausgewählt und gemessen wurden.

## schach

Schachlogik in den Begriffen des Buches; jede Datei beantwortet eine Schachfrage: `stellung.ts`
(Stellung aus FEN), `angreifer.ts` und `angriffskarte.ts`, `abtausch.ts`, `bauernprofil.ts`,
`bauernschwaechen.ts`, `drohungen.ts`, `fesselungen.ts`, `gabeln.ts`, `mattbilder.ts`,
`taktikmotive.ts`, `opposition.ts`, `quadrat.ts`, `schluesselfelder.ts`, `kpk.ts`
(Endspieldatenbank König und Bauer), `phase.ts`, `eroeffnungsindex.ts`, `theorie.ts`,
`notation.ts`. Die eigentlichen Zugregeln kommen aus der Bibliothek chessops; dieser Ordner baut
darauf die Begriffe des Buches.

## daten

Die Buchdaten laden (`laden.ts`, eine Datei je Kapitel), eingetippte Abbildungsnummern verstehen
(`finde.ts`), im Glossar suchen. `daten/generiert/` sind die Datentypen, automatisch aus den
Schemas erzeugt.

## i18n

Alle Texte der Oberfläche in `de.json` und `en.json`; `sprache.ts` holt den Text zu einem
Schlüssel (`t("spielen.titel")`). Kein sichtbarer Satz steht direkt im Code.

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
