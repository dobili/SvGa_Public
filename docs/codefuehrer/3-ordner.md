# Die Ordner der App (`app/src/`)

Jeder Abschnitt unten beschreibt einen Ordner. Die Konzeptkarte zeigt genau diese Texte, wenn man
einen Ordner antippt. **Die Zeilen mit `## ` und dem Ordnernamen bitte nicht umbenennen**, daran
erkennt das Skript, welcher Text zu welchem Ordner gehört. Alles darunter darf frei geändert werden.

Die Reihenfolge folgt den Ebenen der App: oben die Oberfläche, unten die Grundlagen. Die
Abhängigkeiten zeigen nach unten: Die Oberfläche benutzt alles, die Schachlogik kennt keine
Bildschirme.

## ui/bildschirme

Die ganzen Seiten der App, eine Datei je Bildschirm. Die fünf Startseiten der Leiste: `Buch.tsx`
(Karte „Heute“, Nummernfeld „Abbildung öffnen“, Kapitel), `Training.tsx` (Stapel der fälligen
Wiederholungen, je Buchteil eine Wischreihe mit Trainer-Karten), `Spielen.tsx` (laufende Partie,
„Schnell eine Partie“, Kacheln zu den Unterseiten, „Zuletzt gespielt“), `Nachschlagen.tsx` und
`Ich.tsx` (Profil mit Wertung, Fortschritt, Erfolgen und Partien). Dazu `Kapitel.tsx`,
`Abbildung.tsx` (Brett mit Buchmarkierungen, Werkzeugen, Engine), `Trainer.tsx` und `Uebung.tsx`,
`Partie.tsx` (spielen, Uhr, Auswertung), `Einstellungen.tsx`, `Lernpfad.tsx` („Dein Weg durchs
Buch“), `Rueckblick.tsx` (Monatsrückblick), `Glossar.tsx`, `Steckbriefe.tsx`, `Checkliste.tsx`,
`Denkroutine.tsx`, `Werkzeuguebersicht.tsx`, `Lernsammlung.tsx`, `Lizenzen.tsx` und
`AutorAufgaben.tsx` (die Aufgabenseite für den Autor).

## ui/komponenten

Die Bausteine, aus denen die Bildschirme bestehen, in 34 Unterordnern nach Themen. Die
Unterordner stehen unten je mit einem eigenen Abschnitt. Die `use…`-Dateien sind die „Gehirne“
der Bildschirme, etwa `usePartie` (laufende Partie und Zug des Bots) oder `useWerkzeugwahl`
(welches Werkzeug offen ist). Das Aussehen (Farben, Abstände, Schriften) steht daneben in
`ui/stil/` als CSS, rund 60 Dateien.

## ui/komponenten/bausteine

Kleine Teile, die überall vorkommen: Auswahl-Chips (`Auswahl`), Reiter, Segmentleiste,
Aufklapper, Zeichen vor Knöpfen und Überschriften, Ring- und Balkenanzeigen, Leerzustand (graues
Bild mit Knopf statt Erklärsatz), die Bilder von Orden und Abzeichen, Feuerwerk und die Kombo am
Brettrand („3 in Folge“). Für „Weniger Text“ die zwei Erklärsymbole: `Infoblase` (ein ⓘ am Ende
einer Zeile, ein Tipp öffnet eine Sprechblase) und `InfoKnopf` mit `MitInfo` (klappt eine
Erklärung auf). Dazu Hilfen ohne eigenes Aussehen: `useDaten` lädt Daten für einen Bildschirm,
`useEroeffnungsindex` die Eröffnungen des Buches, `useLangerDruck` erkennt langes Drücken,
`dateiAnbieten` bietet Text oder ein Bild als Datei an.

## ui/komponenten/rahmen

Der feste Rahmen um alle Bildschirme: die Leiste unten mit den fünf Bereichen (`Leiste`), die
Kopfzeile oben (`Kopfzeile`) und die Startanimation mit dem goldenen Springer (dort erscheint auch
ein neu verdienter Orden). Dazu die zwei Teile der Aufgabenseite für den Autor (`Aufgabenpunkt`,
`AufgabenRueckweg`).

## ui/komponenten/start

Was oben auf der Buch-Startseite steht. `startkarten.ts` ist die Liste der Karten (höchstens zwei
zugleich): die Karte **„Heute“** (`Heutekarte`), der Rivale und der Monatsrückblick. „Heute“
zeigt die Tageskette der Woche („3 von 4 Tagen“, Wochenziel), den nächsten Schritt als große
Kachel mit zwei kleinen Vorschlägen (`Vorschlagskacheln`) und darunter Reiter für die Woche:
Aufträge, Übungsplan mit Kalenderdatei, eigene Ziele (`Wochenreiter`, `Auftragsabschnitt`,
`Planabschnitt`, `Zielabschnitt`, `Zielauswahl`, `Botzielwahl`). Die Rechnung dahinter steht in
`training/` (Vorschläge, Wochenziel, Aufträge, Ziele).

## ui/komponenten/lernpfad

Der Lernpfad „Dein Weg durchs Buch“ zeigt die 13 Kapitel als Stationen eines geschwungenen Weges
(`Weg`, `wegform`, `Stationen`), in fünf Etappen nach den Teilen des Buches, je mit einer gemalten
Landschaft dahinter (`landschaftsbilder`, `Landschaft`) und einem Orden am Ende. Die eigene Figur
zeigt, wo man steht (`Wegfigur`). Neben jeder Station liegt ein Bündel Nebenaufgaben
(`nebenaufgaben.ts`, `kapitelaufgaben.ts`): alles, was man im Kapitel noch tun kann. Die Rechnung
steht in `lernpfad.ts`.

## ui/komponenten/erfolge

Die Karte „Deine Erfolge“ im Profil. Oben das zuletzt verdiente Stück groß (`Glanzstueck`),
darunter Regale mit Orden und Abzeichen („5 von 9“, `Regal`) und „Als Nächstes“ (die Stücke, denen
am wenigsten fehlt). Ein Tipp auf ein Stück öffnet das **Infofenster** (`Infofenster`): Bild,
Bedingung, Stand oder Datum, „Teilen“ und ein Knopf „Los geht's“, der dorthin führt, wo man das
Stück verdient (`stueckziele`). `useErfolge` holt alles aus dem Speicher.

## ui/komponenten/fortschritt

Erfahrung, Orden und Abzeichen und der Fortschritt im Buch. `erfahrung.ts` rechnet die
Erfahrungspunkte und die zehn Stufen (von „Erster Zug“ bis „Meisterplan“), `abzeichen.ts` mit
seinen Teillisten `abzeichen-*.ts` die Abzeichen, `ringrechnung.ts` und `fortschrittsringe.ts` die
Ringe, die voll zu Orden werden. Alles wird aus den vorhandenen Daten gerechnet, nicht extra
gespeichert. Dazu die Karte „Dein Fortschritt“, die Gratulation bei vollem Ring (`Ringfeier`),
die Meldung eines neuen Abzeichens, die geschätzte Spielstärke je Zeitklasse, das Bild der
Wertungskurve und der Maßstab (Lichess, chess.com, FIDE). Für den Autor: Probekarten, die einen
Orden, ein Abzeichen oder einen Stufenaufstieg zum Test zeigen.

## ui/komponenten/ordenkunst

Die Bilder der Orden und Abzeichen im Stil „Nacht und Gold“, als Zeichnungen im Code (SVG):
Formen und Motive (`zeichnen.ts`, `motive.ts`, `figuren.ts`), je Teilliste der Abzeichen eine
Bilderliste (`nachtabzeichen-*.ts`), die Orden der Bot-Bündel (`botorden.ts`), die Medaillen der
Meisterschaft (`themenbilder.ts`) und `entwuerfe.ts`, das jedem Stück sein Bild zuordnet. Dazu
die Startanimation mit einem neuen Stück (`useStartorden`, `Startstueck`).

## ui/komponenten/profilkarten

Die Liste der Karten im Profil unter „Dein Fortschritt“ (`profilkarten.ts`): Themen
(Meisterschaft), Rekorde, erreichte Ziele, Monatsrückblicke, Fundstücke und Extras. Jedes Paket
trägt seine Karte mit einer Zeile ein.

## ui/komponenten/themen

Die Meisterschaft je Thema (etwa „Fesselung“ oder „Opposition“): die Profilkarte „Deine Themen“ mit
einer Medaille in Bronze, Silber oder Gold je Thema, die Meldung „Fesselung: Silber!“ am Ende
einer Runde, das Teilen einer Medaille und der Titel unter dem Namen („Taktiker“). Die Rechnung
steht in `training/meisterschaft.ts`.

## ui/komponenten/rekorde

Die Rekordtafel mit der Profilkarte „Deine Rekorde“ mit Erreichtem und einer Herausforderung, die
Meldung „Neuer Rekord“ am Ende einer Runde und die Prüfung, ob ein Rekord gefallen ist
(`useRekordpruefung`).

## ui/komponenten/rivale

Die Karte „Dein Rivale“ zeigt einen Bot, etwas stärker als man selbst und noch nie gewertet besiegt, mit
Porträt, Spruch, Duellbilanz und Knopf „Revanche“. Wer der Rivale ist, rechnet
`training/rivalen.ts`.

## ui/komponenten/ziele

Die Profilkarte „Erreichte Ziele“ mit den eigenen Zielen, die schon geschafft sind. Ziele anheften
und auswählen geschieht in der Karte „Heute“ (`ui/komponenten/start/`).

## ui/komponenten/extras

Freischaltbare Extras (Brettfarben, Figuren, Rahmen, Konfetti, Titel) und die Profilkarte „Deine
Extras“ als Ankleide: oben „So siehst du gerade aus“ (`Extrabuehne`), darunter Kacheln, gesperrte
mit Schloss und Fortschritt (`Extrakachel`, `extrafortschritt.ts`). Welche Extras es gibt und wann
sie frei werden, steht in `training/extras.ts`.

## ui/komponenten/fundstuecke

Fundstücke, kleine Karten zum Sammeln. Selten erscheint am Ende einer Trainerrunde eine kleine Karte mit einer
Schachgeschichte oder einem Merksatz (`Fundstueckmeldung`). Gesammelte Stücke stehen im Album
(`Fundstueckalbum`, eigener Bildschirm) und in einer Profilkarte.

## ui/komponenten/teilen

Teilen und Herausfordern. Ein verdientes Stück geht als Bild (1080 × 1350) an das Teilen-Menü
des Handys (`teilbild.ts`, `teileBild.ts`, `Teilenknopf`); mit „Freunde herausfordern“ teilt man
eine Aufgabe. Der Link „#aufgabe-…“ öffnet die Aufgabe direkt in der App (`Herausforderung`,
`herausforderungslink.ts`).

## ui/komponenten/hinweise

Hinweise, die oben in der App oder als Fenster erscheinen: neue Version, Zeit für eine
Datensicherung, Safari löscht Daten, Speicher nicht lesbar. Dazu der einmalige Hinweis auf Maia
beim ersten Antippen eines Bots; wann er kommt, rechnet `maiahinweis.ts`.

## ui/komponenten/einstellungen

Der Einstellungen-Bildschirm: oben die große Brettvorschau mit Brettfarbe und Figuren
(`Brettstudio`), darunter drei Reiter Bedienung, Anzeige und Hilfe (`EinstellungenKarte`,
`schalterzeilen`, `anzeigezeilen`) und die drei **Unterseiten** „Bots und Wertung“ (Maia,
Maßstab), „Deine Daten“ (Sicherung, Löschen) und „Über die App“ (Version, Update, Fehler melden,
Lizenzen). Die Liste der Unterseiten steht in `einstellungsseiten.ts`; jede ist eine Zusatzansicht.

## ui/komponenten/gegner

Bausteine der Gegnerwahl: die vorgefertigten Bots als Porträtgitter je Stufe (`Gegnerstufen`), das
Bild eines Gegners mit Siegmarken (`GegnerBild`), die farbige Stufenmarke, der Gruppenmodus und
kleine Texte wie „etwa 1100“ (`staerkeangabe`).

## ui/komponenten/gegnereditor

Eigene Gegner anlegen und einstellen (`GegnerEditor`, `EigeneStufe`): vier Reiter für Stärke,
Stil, Fehler und blinde Flecken, die Spinnennetze (`Profilnetz`, `Stilnetz`, `Fleckennetz`), die
Regler, feste Eröffnungen und eine Beschreibung des Bots in Worten. Die Rechnung ohne Oberfläche
steht in `fehlerprofil.ts` und `fehlergruppen.ts`.

## ui/komponenten/spielstart

Der Bereich „Spielen“ vor der Partie. Die Startseite zeigt die Karte „Partie läuft“, die Karte
**„Schnell eine Partie“** mit einem passenden Bot (`Vorschlagskarte`, `vorschlag.ts`), Kacheln zu
den Unterseiten und „Zuletzt gespielt“. Die **Unterseiten** stehen als Liste in `spielseiten.tsx`
und im Ordner `seiten/`: „Gegner aussuchen“, „Eigene Stufe“, „Eigene Bots“ und „Freie Partie“
(Mensch gegen Mensch, Stellung aufbauen). Farbe, Bedenkzeit, Wertung, Spielhilfen und Eröffnung
stehen im **Blatt** „Partie einstellen“ (`Blatt`, `PartieEinstellen`), das von unten hereinfährt.
`useSpielwahl` hält die Wahl und beginnt die Partie; die Regeln dazu stehen in `spielwahl.ts`.

## ui/komponenten/partie

Die laufende Partie: der Zustand (`usePartie`), der Zug des Bots (`botzug`, `botNotmodus`), Uhr,
Zugliste, Kopf mit Porträt, Statuszeile und das Ergebnis groß auf dem Brett. Nach dem Ende der
Ergebniskopf und der Abschluss mit „Neue Partie“ und „Teilen“ (PGN). Dazu der Engine-Knopf
während der Partie (`SpielEngine`), die Werkzeuge am Brett (`PartieWerkzeuge`) und der Schalter
für die ruhige Ansicht.

## ui/komponenten/partienliste

Die Liste der gespielten Partien im Profil: eine Zeile je Partie (`Partiezeile`), Filter und
Sortierung, der Löschmodus und das Einlesen einer Partie aus PGN.

## ui/komponenten/auswertung

Die Auswertung nach der Partie. `useAuswertung` lässt die Engine jede Stellung bewerten, schon
während der Partie und mit einer eigenen Engine, damit sie nicht abbricht. `Auswertung` zeigt
zuerst die **Zeitleiste**: die Phasen der Partie mit ihren wichtigen Momenten als Karten
(`momente.ts`, `Zeitleiste`); ein Tipp springt an die Stelle aufs Brett. Darunter „In Zahlen“
(`Zahlen`): Spielstärke, Genauigkeit, „Deine Züge“ und die Verlaufskurve. `Blatt` ist das Fenster
für „Teilen“ und „Merken“.

## ui/komponenten/rueckblick

Zwei Arten Rückblick. **Nach einer Partie**: das Nachspielen einer ausgewerteten Partie mit der
Karte zum gezeigten Zug (`Rueckblickkarte`, `Urteilskopf`), besserem Zug, Nebenzweig „Besser war
…“, Zugmarke am Brett, Bewertungsbalken und „Merken“ (in Lernsammlung oder Fehlerdatenbank).
`useTheorie` erkennt Theoriezüge. **Monatsrückblick** („Dein Oktober“): Abschnitte als Liste
(`rueckblickabschnitte.ts`) mit Kalender, Zahlen, Wertung, neu Verdientem, Themen und einem Bild
zum Teilen; die Startkarte erscheint in den ersten Tagen des neuen Monats.

## ui/komponenten/wertung

Die Karte „Deine Wertung“ im Profil mit je Zeitklasse eine Kachel mit Zahl, darunter die Kurve der
gewählten Zeitklasse mit Ausschnitten (letzte 10, 25, 50 Partien), die Stärke je Phase als Balken
und Kurve und die Zeile „Aus deinen Zügen: etwa …“.

## ui/komponenten/werkzeugkarten

Die Karten unter dem Brett, die ein Werkzeug oder die Engine zeigen: `Werkzeugkarte` mit Befunden
und Fazit, `EngineKarte`, die Engine-Teile einzelner Werkzeuge (etwa `FalleKarte`,
`KandidatenKarte`, `RuheKarte`), die Waage der Faktorenbilanz und „So prüft die App“.

## ui/komponenten/werkzeugwahl

Welches Werkzeug gerade offen ist und wie man es wählt: die Werkzeugleiste mit den Bündeln, die
Symbole am Brett, die Ordnung der Werkzeuge je Kapitel (`werkzeugordnung`) und das Ergebnis des
gewählten Werkzeugs (`werkzeugergebnis`).

## ui/komponenten/brettbedienung

Das Brett mit seinen Knöpfen (`Brettbereich`) und was ein Tipp aufs Brett bedeutet
(`useBrettbedienung`): ziehen, zählen, Bauern umwandeln. Dazu die Zugleiste, die vier Zugknöpfe,
die auch die Trainer benutzen, und das Nachspielen der Zugfolgen einer Abbildung.

## ui/komponenten/abbildung

Teile des Abbildung-Bildschirms: die Bildunterschrift aus dem Buch (`Unterschrift`), Pfeile und
Felder des Buches (`buchmarkierungen`), Warum-Fragen, das Merken als „angesehen“ nach 30 Sekunden
und der Sprung zu einer anderen Abbildungsnummer.

## ui/komponenten/kapitel

Die Kapitelübersicht: die Galerie der Abbildungen, „Dein Fortschritt“ im Kapitel, die
Kapitelnummer im Ring, die Zeichen für Zusatzinhalte und die Übungen eines Kapitels mit ihrem
Ablauf (`useUebung`).

## ui/komponenten/training

Teile des Bereichs Training: oben die Karte „Dein Stapel für heute“ mit den fälligen
Wiederholungen (`Stapelkarte`), je Teil des Buches eine Wischreihe mit Trainer-Karten
(`Trainerreihe`, `trainerreihen.ts`), jede mit einem kleinen Brett einer typischen Stellung
(`trainerbilder.ts`), unten Kacheln für Lernsammlung und „Alle Kapitel“. Dazu `Trainerkarte`, die
kompakte Zeile eines Trainers in der Kapitelübersicht.

## ui/komponenten/nachschlagen

Teile des Bereichs Nachschlagen: das Glossar als Lexikon mit Buchstaben-Reitern (`Lexikon`), die
Steckbriefe als Baum der ersten Eröffnungszüge (`Eroeffnungsbaum`), kleine Diagramme aus dem Buch
(`Stellungsbild`) und der Kopf der Gesamt-Checkliste („14 von 77 Punkten“).

## ui/komponenten/denkroutine

Die Denkroutine zum Nachschlagen: die drei Phasen als Zeichen mit „Du bist hier“ und die Schritte
als nummerierte Karten zum Aufklappen.

## ui/komponenten/lernsammlung

Die Lernsammlung: Stellungen mit einem Plan-Satz speichern (`SammelFormular`), einen Eintrag
zeigen und später abfragen.

## ui/trainer

Die Oberfläche der Trainer. Jeder Trainer beginnt mit einer **Startkarte** (Ordner `startkarte/`):
Beispielstellung, Zeilen „Deine Runde“ zum Einstellen, Startknopf; die zuletzt gewählten
Einstellungen merkt sich das Gerät (`useGemerkt`). Danach je Trainer ein „Bereich“ (etwa
`TaktikBereich.tsx`) und eine „Aufgabe“ am Brett (etwa `Taktikaufgabe.tsx`). Gemeinsam: der
Ablauf einer Runde (`useRunde.ts`, `Rundenablauf.tsx`, `Rundenrahmen.tsx`), die Meldungen am
Rundenende (`nachDerRunde.ts`: neuer Rekord, Fundstück, Meisterschaft) und Hilfen wie
Notationstastatur, Bewertungsbalken und Vergleichspfeile.

## ui/brett

Das Schachbrett selbst: Zeichnen (`Brett.tsx`), Figuren, Holzfelder, Pfeile und Marken wie im
Buch (`Brettmarken.tsx`, `geometrie.ts`), Antippen und Wischen (`useZiehen.ts`, `treffer.ts`), das
Gleiten der Figuren (`Zuganimation.tsx`) und die Zugtöne.

## ui/profil

Name und Porträt des Lesers: 30 fertige Porträts zur Wahl, der Porträt-Baukasten (auch für eigene
Bots) und die Profilkarte oben auf der Profilseite.

## ui/werkzeuge

Kleine Teile der Werkzeugkarten: die Legende als Reihe von Bildzeichen, der graue Statuschip,
wenn ein Werkzeug in einer Stellung nicht greift (etwa „⊘ Nur bei Angebot“), der Wertpfeil („▲
0,67“) und die Texte der Leerfälle.

## tour

Die Touren durch die App: die Schritte als Daten (`touren.ts`), das Hervorheben der Ziele auf dem
Bildschirm (`TourEbene`), das Toursymbol oben rechts. Beim ersten Start fragt die **Startwahl**
(`TourAngebot`) „Wie möchtest du starten?“: „Ich lese das Buch“, „Ich will spielen und auswerten“
oder „Erst umsehen“; die ersten beiden Wege stehen in `starttouren.ts`. Mit `?start=buch` in der
Adresse (QR-Code im Buch) beginnt der Buch-Weg ohne Frage.

## start

Die zwei Dateien direkt in `app/src/`: `main.tsx` ist der allererste Startpunkt (Schriften,
Aussehen, Speicher laden), `sw.ts` der Service Worker, der alle Dateien für den Offline-Betrieb
bereithält.

## app

Die Hülle: `App.tsx` zeigt den aktuellen Bildschirm, die Leiste unten und die Hinweise.
`navigation.tsx` und `stapel.ts`: Die App hat keine Adressen wie eine Website, sondern einen
Stapel von Ansichten; „Zurück“ nimmt die oberste weg. `zusatzansichten.ts` ist eine Liste
weiterer Bildschirme (Lernpfad, Rückblick, Fundstücke, Unterseiten der Einstellungen,
Herausforderung …), die man eintragen kann, ohne die Navigation zu ändern; `spruenge.ts` versteht
Sprünge in der Adresse wie „#abb-6.20“. Dazu `stapelMerker.ts` (weitermachen, wo man war),
Einstellungen, Farbschema, Schriftgröße, Töne, Feiereffekte und Konfetti, Sprache und
Sprachpakete, Offline und Updates (`offline.ts`, `offlineKern.ts`), Installieren, `maiapaket.ts`
(Maia laden und löschen), Fehler melden mit Warteschlange ohne Netz, Daten löschen und
`Fehlergrenze.tsx` (fängt Abstürze ab und zeigt eine Meldung statt einer leeren Seite).

## training

Die Logik der Trainer und der Belohnungen, ohne Oberfläche.

- **Trainer**, je Trainer eine Datei: `koordinatentrainer.ts`, `roentgentrainer.ts`,
  `zaehltrainer.ts`, `repertoiretrainer.ts`, `zielbilanztrainer.ts`, `abweichungstrainer.ts`,
  `faktorentrainer.ts`, `fallentrainer.ts`, `strukturtrainer.ts`, `planbilanztrainer.ts`,
  `taktiktrainer.ts`, `endspieltrainer.ts` mit `endspieldrills.ts`, `studientrainer.ts`,
  `kurzplaene.ts`, `fehlerdatenbank.ts`, `denkroutinetrainer.ts`, `dreissigminuten.ts`
  (30-Minuten-Plan) und `lernsammlung.ts`. Dazu `trainer.ts` (Verzeichnis aller 16 Trainer),
  `wiederholung.ts` (fünf Kästen für Wiederholungen), `buchstellungen.ts` (alle Abbildungen als
  Aufgabenvorrat), `stufen.ts` (leicht, mittel, schwer), Zusatzaufgaben von Lichess und
  Zusatzpartien für „Zug erraten“.
- **Belohnungen und Ziele** (Gamifizierung): `naechsterSchritt.ts` und `vorschlagsarten.ts`
  (Vorschläge der Karte „Heute“), `wochenziel.ts`, `wochenauftraege.ts` und `auftragsarten.ts`,
  `uebungsplan.ts` (Plan mit Kalendererinnerung), `ziele.ts` mit `zielarten.ts` und
  `zielvorschlaege.ts` (eigene Ziele), `rivalen.ts` und `duelle.ts`, `rekorde.ts` mit
  `rekordarten.ts`, `extras.ts`, `fundstuecke.ts`, `kombo.ts`, `taktikserie.ts`,
  `meisterschaft.ts` und `themenstand.ts` (Bronze, Silber, Gold je Thema), `rueckblick.ts` und
  `rueckblickinhalt.ts` (Monatsrückblick). Die meisten davon sind Listen, in die man später eine
  Zeile einträgt.

## spiel

Die Partie gegen die Engine. Während der Partie: `partie.ts` (Einstellung, Züge, Rücknahme,
Ende), `ablauf.ts` (Zug spielen, Uhr drücken), `uhr.ts`, `botzeit.ts` (Uhr der Bots),
`notmodus.ts` (Vorzüge in Zeitnot), `enginezug.ts` (Zug der Engine ablegen), `boteroeffnung.ts`
(feste Eröffnungen eigener Bots), `ergebnis.ts` (Matt, Patt, 50 Züge, Wiederholung, Zeit). Nach
der Partie: `auswertung.ts` (Zugklassen wie „bester Zug“, „Theoriezug“, „Fehler“), `phasen.ts`
(Eröffnung, Mittelspiel, Endspiel), `genauigkeit.ts` und `zuggenauigkeit.ts` (Genauigkeit und
geschätzte Spielstärke), `elomodell.ts` (Elo-Zahl je Zeitklasse), `wertung.ts` (deine Wertung
über viele Partien), `umrechnung.ts` („entspricht etwa chess.com …“), `erklaerung.ts` (warum ein
Zug ein Fehler war), `nebenzweig.ts` und `rueckblick.ts` (Nachspielen), `zugklassenvergleich.ts`
(„so viele Fehler wie üblich bei deiner Stärke“). Rund um Partien: `pgn.ts` und `pgnimport.ts`,
`stellungsbau.ts`, `partienfilter.ts`, `eroeffnungsbaender.ts`.

## spiel/messung

Rechnung der Eichung: wie Genauigkeit und Spielstärke aus den Messpartien zusammenhängen
(`genauigkeitsmodell.ts`, `eichungsrechnung.ts`), dazu die Tabelle der Zugklassen-Messung. Die App
lädt diese Dateien nicht; die Messläufe `spiel/*.messung.ts` und `engine/botstaerke.messung.ts`
benutzen sie.

## speicher

Was sich die App merkt: alles in einer Datenbank im Browser (IndexedDB), nur auf deinem Gerät.
`speicher.ts` lädt und speichert, `datenbank.ts` spricht mit der Datenbank, `format.ts` kennt die
Versionen des Datenformats (heute Version 7) und wandelt alte Stände um (`format0.ts`,
`format7.ts`, `stufenskala.ts`); darum gehen bei Updates keine Daten verloren. Einzelteile:
`partien.ts`, `fortschritt.ts`, `gegner.ts` (eigene Bots), `besiegt.ts`, `profil.ts`,
`trainerverlauf.ts`. Für die Belohnungen: `gamifizierung.ts` (die neuen Felder),
`aktivitaet.ts` (Tagesprotokoll: was an welchem Tag getan wurde), `themenprotokoll.ts` (richtige
und falsche Antworten je Thema), `verdient.ts` (wann ein Stück zuerst gefeiert wurde) und
`partieprotokoll.ts` (was nach jeder Partie eingetragen wird). `sicherung.ts` ist die
Datensicherung als Datei.

## autor

Die Aufgabenseite für den Autor: liest `docs/AUFGABEN_AUTOR.md` in Abschnitte und Punkte, merkt
Haken und Notizen und macht aus Stellen wie „Abb. 1.26“ Links in die App.

## startseite

Die Website des Buches außerhalb der App: Startseite, Installieren, die Trainingsseiten je Kapitel
und die Sicherheitsregel (CSP) der Seiten.

## admin

Das Dashboard unter /admin/: Meldungen der Leser, die Ampel der Prüfungen, der Knopf „Aufgabe
für Claude“ und das **Wiki** (`Wiki.tsx`, `markdown.ts`): diese Codeführer-Seiten, die Module der
Konzeptkarte, die Entscheidungen und der Fortschritt, mit Suche.

## sw

Teile des Service Workers: welche Dateien vorab geladen werden und wie die Sprachpakete (etwa
Englisch) nachgeladen werden.

## analyse

Die Werkzeuge des Buches, 34 Stück, eine Datei je Werkzeug mit dem Kapitel im Namen:
`k1-zaehlen.ts` (Angreifer und Verteidiger zählen), `k1-todsuenden.ts`, `k2-zielbilanz.ts`,
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

- Stockfish anbinden: `engineDienst.ts` (Engine im Hintergrund). Es gibt zwei: eine gemeinsame
  für Werkzeuge, Hinweise und den Zug der Bots und eine eigene für die Auswertung der Partie
  (`auswertungsEngine`), damit diese auf einem anderen Kern weiterrechnet. Dazu
  `wertInWorten.ts` („Weiß steht besser“) und `letzterzug.ts` (Zeichen ?!, ?, ??, !).
- Die Stufen: `stufen.ts` (zehn Stufen mit Ziel-Elo), `grundschicht.ts` (Spiel ohne menschliche
  Fehler).
- Wie ein Bot seinen Zug wählt: `zugwahl.ts` ist der Einstieg, `menschenwahl.ts` mischt
  menschliche Fehler hinein, `wahlmodell.ts` und `wahlschritt.ts` wählen wie Menschen dieser
  Wertung, `fehlerart*.ts` erkennen die typischen Fehler des Buches, `blindeFlecken.ts`,
  `bedenkzeit.ts`, `stile.ts`, `praxisbuch.ts` (Eröffnungszüge echter Menschen).
- Maia: `maia.ts` fragt Maia, wie wahrscheinlich ein Mensch einen Zug spielt. Das Netz rechnet in
  einem eigenen Hintergrund-Thread (`maiaWorker.ts`), `maia-web.ts` schickt ihm die Aufträge, damit
  die Oberfläche dabei nicht ruckelt.
- Die Bots: `gegnerliste0.ts` (4 Spaß-Bots), `gegnerliste1.ts` und `gegnerliste2.ts` (je 40 Bots,
  acht je Stufe), `gegnerbau.ts` (Bauplan und Persönlichkeit), `gegner.ts`, `gruppe.ts` und
  `gruppenwahl.ts` (Gruppenmodus).
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

Schachlogik in den Begriffen des Buches; jede Datei beantwortet eine Schachfrage, rund 55 Dateien,
etwa `stellung.ts` (Stellung aus FEN), `angreifer.ts` und `angriffskarte.ts`, `abtausch.ts`,
`bauernprofil.ts`, `bauernschwaechen.ts`, `drohungen.ts`, `fesselungen.ts`, `gabeln.ts`,
`mattbilder.ts`, `taktikmotive.ts`, `opposition.ts`, `quadrat.ts`, `schluesselfelder.ts`,
`turmendspiel.ts`, `kpk.ts` (Endspieldatenbank König und Bauer), `phase.ts`,
`eroeffnungsindex.ts`, `eroeffnungsnamen.ts`, `theorie.ts`, `notation.ts`. Die eigentlichen
Zugregeln kommen aus der Bibliothek chessops; dieser Ordner baut darauf die Begriffe des Buches.

## daten

Die Buchdaten laden (`laden.ts`, eine Datei je Kapitel), die Daten der Trainer laden
(`trainerdaten.ts`), eingetippte Abbildungsnummern verstehen (`finde.ts`), im Glossar suchen,
die Zugfolgen des Buches eines Kapitels (`buchbeispiele.ts`). `daten/generiert/` sind die
Datentypen, automatisch aus den Schemas erzeugt.

## i18n

Alle Texte der Oberfläche in `de.json` und `en.json` (je rund 5 000 Texte mit denselben
Schlüsseln); `sprache.ts` holt den Text zu einem Schlüssel (`t("spielen.titel")`). Kein sichtbarer
Satz steht direkt im Code. Englisch lädt erst, wenn man es wählt (`sprachpaket-en.ts`).

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
