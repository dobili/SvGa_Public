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

Die Bausteine, aus denen die Bildschirme bestehen, 173 Dateien. Grob:

- Karten der Werkzeuge und der Engine: `Werkzeugkarte`, `Werkzeugleiste`, `EngineKarte`,
  `KandidatenKarte`, `FalleKarte`, `RuheKarte`.
- Gegnerwahl und Bots: `GegnerWahl`, `Gegnerstufen`, `GegnerEditor`, `Fehlerprofil`, `Stilnetz`,
  `Fleckennetz`, `Gruppenmodus`, `MaiaWahl`, `MaiaHinweis`.
- Partie: `Partieuhr`, `Partiezuege`, `Partiestatus`, `Ergebnisblende`, `Auswertung`,
  `Rueckblickkarte`, `Verlaufskurve`, `Zugklassen`, `Spielstaerke`.
- Profil und Fortschritt: `Wertungskurve`, `LetzteSpielstaerke`, `Fortschrittsuebersicht`,
  `Symbolringe`, `Ringfeier`, `Partienliste`.
- Hinweise und Sicherheit: `UpdateHinweis`, `SicherungsHinweis`, `SafariHinweis`,
  `Speicherhinweis`, `Meldeformular`, `Datensicherung`.

Die `use…`-Dateien sind die „Gehirne“ der Bildschirme: `usePartie` (laufende Partie und Zug des
Bots), `useAuswertung` (Auswertung nach der Partie), `useWerkzeugwahl` (welches Werkzeug offen
ist), `useSelbstDenken` (Modus „Erst selbst denken“), `useDaten` (Kapitel laden). Das Aussehen
(Farben, Abstände, Schriften) steht daneben in `ui/stil/` als CSS.

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

## spiel/messung

Rechnung der Eichung: wie Genauigkeit und Spielstärke aus den Messpartien zusammenhängen
(`genauigkeitsmodell.ts`, `eichungsrechnung.ts`), dazu die Tabelle der Zugklassen-Messung. Die App
lädt diese Dateien nicht; die Messläufe `spiel/*.messung.ts` und `engine/botstaerke.messung.ts`
benutzen sie.

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
- Die Messläufe selbst (`*.messung.ts`) stehen neben dem Code, den sie messen; ihre Hilfsdateien
  liegen in `engine/messung/`.

## engine/messung

Hilfsdateien der Messläufe, mit denen die Bots ausgewählt und ihre Spielstärke gemessen wurden:
die Kandidaten des Bot-Satzes (`botkandidaten*.ts`), alte Bots (`botarchiv.ts`), die Elo-Leiter
aus allen Ergebnissen (`eloleiter.ts`) und die Spieler der Messpartien (`messspieler.testhilfe.ts`,
`nativeEngine.testhilfe.ts`, `maia-node.testhilfe.ts`). Die App lädt keine dieser Dateien; sie
laufen nur mit `vitest.messung.config.ts` und in ihren Tests.

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
