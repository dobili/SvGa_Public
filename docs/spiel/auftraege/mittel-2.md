# Auftrag mittel-2: Porträts der Figuren von Akt 4 und die Fernpartie 1865/66

**Stand:** fertig (mittel-2, 08.11.2026; vorher offen, Haupt-Chat, dreizehnter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `app/skripte/erzeuge-figurenbilder.mjs`, `inhalte/abenteuer/portraets/` (nur neue
Bilder), `docs/spiel/05_Story_Bibel.md` (nur der Abschnitt zur Fernpartie), `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen`

## Ziel

1. Porträts für alle neuen Figuren aus deiner Technikliste (Abschnitt 34, Punkt 8) außer der
   Vell-Familie (Rückfrage Q21-1 offen); Kennungen wie sie mittel-1 gerade in `gegner.json` und
   `orte.json` einträgt (bitte vorher abstimmen über die Bibel: kebab-case des Namens).
2. Die Fernpartie Ambrose gegen Hale 1865/66 (Technikliste Punkt 6) als PGN konstruieren: mit einer
   Engine (Stockfish im Ordner `app/`, `node_modules` oder `public/engine`) glaubwürdige Züge der
   Zeit, Fragmente 0 bis 8 als Halbzüge festlegen, die Endstellung für das Stellungsduell nach R13
   prüfen (Vorteil etwa +1), Ambroses letzter Zug für das Zugerraten. Ergebnis in der Bibel
   (Abschnitt Fernpartie) mit PGN und Halbzügen.

## Bericht

**Fertig** auf `abenteuer-regelwerk` (Basis 19d3d91a hereingeholt). Prüfungen: `pytest pipeline/tests`
470, `npm run pruefen` 362 Dateien und 2418 Tests, Prettier.

**1. Porträts Akt 4:** 20 neue Einträge in `erzeuge-figurenbilder.mjs`, 20 neue SVG (zusammen jetzt
81). Namen (kebab-case des Namens, bei Doppelung mit Nachnamen; **für mittel-1 als Dateinamen in
`gegner.json` und `orte.json`**): `ward`, `kit`, `haraldsen`, `sol`, `darlene`, `hollis`, `ezra`,
`pruitt`, `bea`, `marcus`, `tobias`, `kade`, `turnierleiterin`, `earl` (Fernfahrer Earl Dubois),
`bell` (Rangerin am Geysir), `ray-castillo` (Sturmjäger; `ray` ist Rivertons Ray), `greta`,
`juniper`, `abe`, `theron`. Die Vell-Familie fehlt absichtlich (Q21-1 offen). Kontaktbogen
durchgesehen. `--pruefen` meldet heute nichts, weil mittel-1 die Figuren noch nicht eingetragen
hat; sobald andere Namen kommen, meldet das Skript sie.

**2. Fernpartie** in der Bibel, neuer Abschnitt 35: Evans-Gambit (Eröffnung von Hand), danach mit
Stockfish 19 je Zug eine menschliche Wahl unter den Zügen bis 0,35 Bauern unter dem besten; 40 Züge,
PGN mit Kopfzeilen, deutsche Lesefassung. Ambroses Doppelopfer 35. Lxh6 gxh6 36. Sxf6+ als Höhepunkt,
Hale hält mit zwei Springern gegen den Turm.

- **Fragmente 0 bis 8**: Fragment n = Halbzüge 8n + 1 bis 8n + 8 (Tabelle mit Herkunft je Akt; die
  vorhandenen Quest-Wirkungen 0 bis 7 passen, Fragment 8 kommt mit Wards Erinnerung).
- **Zugerraten** im Flashback: Halbzüge 73 bis 79, Ambroses letzter Zug **40. Kxg3**; Hales Antwort
  **40… b5** (Halbzug 80) steht auf der Seite.
- **Endstellung** für das Stellungsduell `6k1/p2R4/2n4p/1p6/2n1P3/6KP/P5P1/8 w - - 0 41`: +1,44
  (Tiefe 14), +1,44 (16), +1,85 (18), kein schnelles Matt, R13 erfüllt. Ein erster Kandidat (Seed 63)
  sah bei Tiefe 14 gut aus, stieg aber bei Tiefe 16 bis 18 auf +3 bis +4; deshalb prüft die Suche
  jetzt drei Tiefen.
- Vorschlag Begegnung `ghostTown.fernpartie`: Stellungsduell 15 Züge, Mindestvorteil 1,0, Leser Weiß,
  ohne Uhr, Karten gesperrt, Victor (story, E + 400).

## Bericht des letzten Auftrags, zur Nachlese

**Fertig** auf `abenteuer-regelwerk` (Basis 85951f66 hereingeholt). `05_Story_Bibel.md` hat Teil 4
„Akt 4“ (Abschnitte 25 bis 34, Szenen 81 bis 110); `09_Weltbeschreibung.md` neue Abschnitte 5.9 bis
5.14 zu den Orten und Wegen von Akt 4. Prettier besteht.

**Inhalt nach Vorgaben**

1. **Form wie Akt 3:** Kern in sieben Sätzen, Zeitlinie, Figuren (Ward als Clubchefin 8 mit E + 640,
   Kit, Haraldsen, Sol; Darlene, Hollis, Ezra, Pruitt; vier Vorrundengegner, Kade Sterling als
   Konzern-Junior), Welt mit fünf Wegen, Szenenliste mit Ort, Figuren, Zweck, Dauer, Buchbezug,
   Quests und Belohnungen, Funde, Läden, Karten und Sperren, sechs offene Fragen mit Empfehlung.
   Victors Krise und Befreiung (Summit City), die fehlende Seite, die Fernpartie in Ghost Town
   (Victor spielt Hales Züge), Novas Aussage mit Dr. Lin (Bibel Akt 3, Frage 4), Halbfinale,
   Finale, Ambroses Abschied, Post-Game.
2. **Landschaften L1 bis L10** als Nebenschauplätze mit ihrer Variante (Abschnitt 28): L8 und L9 an
   Weg 7, L10 in Summit City, L4 und L6 an Weg 8, L2 an Weg 9, L3 an Weg 10, L7 an Weg 11, L1 und L5
   als freiwillige Rückkehr nach Port Delacroix; Tandem und Räuberschach im Camp. Hauptstory und
   Clubs bleiben klassisch. **O5** (Szene 82): erfundene „Vell-Familien“, moderne Figuren (Lehrerin,
   Mechaniker, Schülerin), eigenes Spiel „Falkenweg“ mit Falke und Bison, keine Kostüme, keine
   heiligen Zeichen; **Rückfrage an den Autor** in Abschnitt 33, Frage 1.
3. **R29 und Extra-Abspann:** Szene 106 (Mentor-Zug frei als vierte Karte, ohne Verbrauch;
   „unsterbliche Partie mit dir“), Szene 109 (Extra-Abspann nur ohne Mentor-Zug: Zettel „Du hast mich
   nicht gebraucht“). Finale ohne Karten (R28).
4. **Technikliste** in Abschnitt 34 (Turniermodus, Stärkewechsel mitten in der Partie, freie vierte
   Karte, Varianten mit Fairy-Stockfish, Varianten-Tisch, Fernpartie bauen, Abspann, neue
   Figurenbilder, Post-Game).

**Entscheidungen und Hinweise**

- **Erinnerung in Summit City** ist Wards Erinnerung (Steinitz gegen von Bardeleben, Hastings 1895,
  `klassik-steinitz-bardeleben`), nicht Ambroses: Er starb 1866, und vor 1866 hat die Sammlung keine
  unbenutzte Partie mehr.
- **Halbfinale:** Der Konzern schickt Kade mit Gerät; Nova spielt in der Vorrunde ehrlich und sagt
  aus. So wird Nova nicht zur Gegnerin, die man vorführt, und das Aufdecken geschieht im Spiel.
- **Vorrunde** nach Regelwerk Frage F4 (Sieg 1, Remis ½, weiter ab 2,5 von 4).
- **Fragment 8** kommt aus Wards Erinnerung; Hales Antwort steht auf der Seite (Szene 88). Die
  Fernpartie selbst muss ein Folgeauftrag mit der Engine bauen (Technikliste, Punkt 6).
- Neue Dialogvariablen: `fernpartieGespielt`, `mentorzugImHalbfinaleGespielt`,
  `variante<Name>Gelernt`.

## Bericht des letzten Auftrags, zur Nachlese

**Fertig** auf `abenteuer-regelwerk` (Basis b795b32e hereingeholt).

**Lizenz (zuerst geprüft):** `@dicebear/pixel-art` 9.4.3, `package.json`: „license“: „MIT“ (Code);
`LICENSE`: „Design … Source: Pixel Art (Figma) … Designer: DiceBear … License: CC0 1.0“, Code MIT
(Florian Körner); ebenso im `README.md`. Öffentliche und kommerzielle Nutzung erlaubt, Nennung
freiwillig. Eingetragen in `docs/spiel/LIZENZEN.md` (Abschnitt Material). Das Paket ist nur zum
Erzeugen installiert (`npm install --no-save`), nicht in `package.json` und nicht in der App.

**Skript** `app/skripte/erzeuge-figurenbilder.mjs` (Aufbau wie `erzeuge-gegnerbilder.mjs`):
Tabelle mit 60 Einträgen (Frisur, Haarfarbe, Hautton, Kleidung, Kleidungsfarbe, Brille, Bart, Hut)
für alle Porträtnamen aus `gegner.json` und den Figuren in `orte.json`, dazu `ambrose-jung`.
Deterministisch (Startwert = Name), standardmäßig nur fehlende Bilder, `--alle` erzeugt neu,
`--pruefen` meldet Figuren ohne Tabelleneintrag (heute keine). Graue und weiße Haare für die
Älteren als eigene Farbwerte, acht Hauttöne über alle Städte verteilt.

**Bilder:** 60 SVG zu 128 × 128 (Raster 32 × 32), ohne Hintergrund, zusammen 244 KB, in
`inhalte/abenteuer/portraets/`. Durchgesehen als Kontaktbogen; Ambrose alt (mit Bart) und jung
unterscheiden sich, Victor erscheint in allen Orten mit demselben Bild.

**Prüfungen:** `pytest pipeline/tests` 470, `npm run pruefen` 361 Dateien und 2414 Tests (auch ohne
das Pixel-Art-Paket in `node_modules`, wie in der CI), Paketbau läuft.

**Was im Paketbau und in der Anzeige fehlt (Vorschläge)**

1. **Paketbau:** `baue-abenteuerpaket.mjs` packt heute keine Porträts. Vorschlag: alle
   `inhalte/abenteuer/portraets/*.svg` als Gruppe `portraets` ins Paket (wie `karten/`); liegt
   unter `app/inhalte-privat/abenteuer/portraets/` eine gleichnamige Datei (später gekaufte oder
   gezeichnete Bilder), geht sie vor, wie bei der Grafik.
2. **Pfade in `gegner.json`:** `portraet` zeigt auf `portraets/<name>.webp`; die Bilder sind SVG.
   Entweder die Pfade auf `.svg` umstellen (Schema erlaubt `svg`) oder beim Laden die Endung
   ignorieren und den Namen nehmen.
3. **Dialog:** Porträt links neben der Sprechblase, aus dem Tag `#sprecher:<kennung>`. Die Kennungen
   sind camelCase (`bigJoe`, `omaRuth`, `coachDelgado`), die Dateien kebab-case (`big-joe.svg`):
   eine kleine Umrechnung (camelCase → kebab) genügt; `erzaehler` ohne Bild, `ambrose` in Orten der
   Art `erinnerung` als `ambrose-jung`. Größe 64 bis 96 Pixel mit `image-rendering: pixelated`.
4. **Stimmungen** (`#stimmung:froh`, `traurig`, `streng`, …): Der Stil kennt Münder `happy01–13` und
   `sad01–10`. Vorschlag: für Hauptfiguren je Stimmung eine zweite Datei (`ambrose-traurig.svg`) mit
   anderem Mund erzeugen; das Skript kann dafür eine zweite Tabelle bekommen.
5. **Partieansicht:** Das Porträt des Gegners aus `gegner.json` statt des Bot-Porträts der App
   (Stellungnahme, Abschnitt 1: „Clubchefs und Story-Figuren brauchen eigene Porträts“).

## Bericht des letzten Auftrags, zur Nachlese

**Fertig** auf `abenteuer-regelwerk` (Basis d0437d2c hereingeholt).

**Dialoge** (alle Knoten aus der Liste von mittel-1, dazu Unterknoten):

- `weg-ironwood-silicon.ink` (Szene 52): `kowalczyk` (Weisheit Kapitel 1.2), `joggerin` (Duell mit
  Uhr, Wiederholung), `zurueck_ironwood`, `tafel` (Runde), `fund_anstecker`, `fund_ohrstoepsel`.
- `silicon-bay-aussen.ink`: `ankunft_zu_fuss` (Szene 53, Victor holt ab), `dash` (Szene 54, Sprüche,
  beim ersten Sieg `gibKarte("gruebelfalle")`), `rosie`, `glasbruecke`, `hotel` mit `hotel_nacht`
  (Szene 61, nach der Clubnadel), `bus_ironwood` (`reise` zum Bus in Ironwood), `faehre` (Sperre bis
  `nadelSiliconBay`).
- `silicon-bay-akademie.ink`: `lin` (Szene 55, Reihe offen, Szene 59 „Warum man im Club schweigt“,
  Clubkampf, nach Niederlage/Sieg, Alltag mit Revanche), `theo` (Probepartie, Tablet, Reihe, öffnet
  nach der Auswertung den Serverraum: `serverraumOffen`), `nova` (Reihe, Bitte nach dem Fund),
  `serverraum_zu`.
- `silicon-bay-lobby.ink`: `victor` mit `victor_berichte` (Szene 56, Runde `siliconBay.auswertung`)
  und `victor_falsch` („Das ist falsch.“, Buchbezug Kapitel 12.2), `empfangsroboter`, `vitrine` mit
  `vitrine_foto` (Szene 57, übergreifende Quest „Die fehlende Seite“).
- `silicon-bay-serverraum.ink`: `schummelgeraete` (Ohrempfänger, Nova bittet um Schweigen).
- `ironwood-aussen.ink`, nur `bus_silicon_bay`: Szene 51 (Mama, Juno) und 51a (Reisebrett), dann
  `reise("wegIronwoodSilicon.raststaette", "start")`; neue Variable `abfahrtSiliconGesehen`.

**Quests** (eigener Block hinter Akt 2): Haupt `siliconBay.akademie` (7 Schritte: Glasbrücke mit
Reisebrett, Ankunft, Dr. Lin, Reihe Theo, Reihe Nova mit Zweiter Chance, Clubkampf mit Mentor-Zug,
Hotelnacht), `siliconBay.spielberichte` (Auswertung → Steckbrief und „analysiert“ für Dr. Lin;
Serverraum → Gegenstand `ohrempfaenger`), `siliconBay.fehlendeSeite` (Gegenstand `notizbuchseite`),
`wegIronwoodSilicon.tafelRaststaette`. **Runden:** `wegIronwoodSilicon.tafel` (3), `siliconBay.reiheTheo`,
`siliconBay.reiheNova`, `siliconBay.auswertung` (3); Novas Reihe und die Tafel nutzen nach dem Hinweis
des Haupt-Chats das neue Thema `falle`. **Texte:** 15 neue Schlüssel.

**Prüfungen:** `pytest pipeline/tests` 385 bestanden; Paketbau kompiliert alle Ink-Dateien;
Simulation mit inkjs (alle Knoten wie im Spiel gemeldet, Variablen beim Dialogende zurückgeschrieben
wie in `Oberwelt.beiDialogende`, Quests wie `regeln/quests.ts`): ein Durchgang von der Abfahrt in
Ironwood bis zur Fähre mit verlorener und gewonnener Joggerin- und Clubpartie; alle vier Quests
erledigt. `npm run pruefen`: bestanden (nach dem Hereinholen von 62297ddb: 360 Dateien, 2411 Tests; pytest 470).

**Befunde**

1. **Fehler in der Hülle bzw. in den Dialogen (wichtig):** Beim Dialogende schreibt
   `beiDialogende` alle Ink-Variablen in `dialogvariablen` zurück. Deklariert eine Datei
   `VAR gefunden<Fund> = false` und ruft im selben Dialog `gibFund`, überschreibt der Startwert den
   Wert, den die Hülle gerade gesetzt hat. Betroffen heute: `cedar-creek-aussen.ink`
   (`gefundenSchluessel`): Der Schlüssel vom Steg wird gefunden, aber `gefundenSchluessel` bleibt
   false, also bietet Mrs. Albescu in Riverton den Schuppen nie an. Vorschlag: In `beiDialogende`
   Werte nicht zurückschreiben, die die Hülle im Dialog gesetzt hat (Funde, Besitz), oder in den
   Dialogen eigene Merker benutzen wie hier. Meine Dateien benutzen eigene Merker.
2. **Funde fehlen in `funde.json`** (nicht meine Datei): Der Querverweis-Test verlangt jeden
   `gibFund`. Vorschlag für Einträge: `anstecker` (Weg 4, 5 Münzen), `ohrstoepsel` (Weg 4),
   `zeroTablet` (Silicon Bay, Theos Geschenk), `ohrempfaenger` und `notizbuchseite` (heute als
   Quest-Gegenstand), `holzdame` (Campus, versteckt; noch kein Auslöser in `orte.json`). Bis dahin
   merken sich die Dialoge die kleinen Funde selbst.
3. **Laden fehlt:** `siliconBay.foodtruck` (Rosie) steht nicht in `laeden.json`; Rosie erzählt nur.
   Angebot laut Bibel Abschnitt 22.
4. **Buchübungen des Clubs** (`ueb:spannung-halten`, `ueb:k2-italienisch-sg5`, `ueb:k2-carokann-h4`,
   `ueb:lasker-falle`) liegen nicht im Taktiktrainer; die Reihen nutzen nur Themen (`haengend`, `falle`). Die Auswertung der Spielberichte (Szene 56) läuft als Runde mit dem Thema `haengend`,
   bis es eine Aufgabenart „Welcher Zug ist zu gut?“ gibt.
5. **Szenen-Wirkungen:** Hauptquest setzt `akt3.abfahrt` bis `akt3.ambroseGebannt`; Nebenquests setzen
   keine Szene, damit die Haupthandlung nicht springt.

## Letzter Auftrag (erledigt, zur Nachlese)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `docs/spiel/05_Story_Bibel.md` (neuer Teil „Akt 3“ anhängen),
`docs/spiel/09_Weltbeschreibung.md` (Abschnitte 5.6 bis 5.8 und die Karte in Abschnitt 1, soweit
Akt 3 sie ändert), `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** `npx prettier --check ../docs/spiel` in `app/`

## Ziel

Akt 3 in derselben Form wie Akt 2 (Szenen mit Nummern, Ort, Figuren, Zweck, Dauer, Buchbezug,
Quests, Belohnungen, Wege, Funde, Läden), mit den neuen Schauplätzen aus `10`, Abschnitt 2.

## Vorgaben

1. **Orte:** Silicon Bay (Konzern-Akademie, Dr. Lin, Schummelgeräte, Ambrose fasziniert von der
   KI), **Port Delacroix** statt Old Harbor (O1, O2: Ambroses Geburtsstadt, vom Hurrikan
   zerstörter Club im alten Musikhaus, Wiederaufbau als Nebenquest über drei Besuche, Tiefpunkt:
   Schummelvorwurf, der Held spielt ohne Ambrose, Versöhnung über die Nachfahren, die Klavierbauer
   Whitlock-Duval mit einer Teenagerin ohne Schachinteresse), Desert Springs mit Canyon-Weg (O4,
   Mira). Clubs, Buchkapitel nach `07_Aufgabenzuordnung.md`.
2. **Wege** zwischen Ironwood → Silicon Bay → Port Delacroix → Desert Springs mit Stationen (W4),
   Verkehrsmittel nach 08 (Bus, Fähre oder Küstenzug, Zug durch die Wüste).
3. **Sprüche** (S1 bis S6): Straßengegner mit eigenen Sprüchen und Immunität im Steckbrief; eine
   Szene, in der Ambrose erklärt, warum im Club geschwiegen wird.
4. **Funde und übergreifende Quests:** „Umschlag ohne Brief“ und „Nietenkopf J. H.“ aus Akt 2
   auflösen; eine neue übergreifende Quest anlegen, die in Akt 4 aufgeht.
5. **Ein Flashback** in Port Delacroix (Ambroses Kindheit in der Klavierwerkstatt, kurz, mit einer
   Stellung aus `inhalte/zusatzpartien/klassiker.json`).
6. **Ton:** Der Hurrikan ist echt und ernst, aber nicht traurig erzählt; Wiederaufbau ist Hoffnung.
   Keine realen Personen, Firmen oder Katastrophen-Namen.

## Was nicht dazugehört

Akt 4 (das erfundene Volk O5 und die Varianten kommen dort), Daten, Dialoge, Karten.

## Bericht

**Fertig** auf `abenteuer-regelwerk` (Basis bc09d58a hereingeholt). `05_Story_Bibel.md` hat einen
neuen Teil 3 „Akt 3“ (Abschnitte 16 bis 24, Szenen 51 bis 80, etwa 5 bis 6 Stunden);
`09_Weltbeschreibung.md`: Karte in Abschnitt 1 (Port Delacroix statt Old Harbor, Reise über Ashford
hinaus) und Abschnitte 5.6 bis 5.8 neu. Prettier besteht.

**Inhalt nach Vorgaben**

1. **Orte und Clubs:** Silicon Bay (Club 5, Dr. Lin, E + 460, Eröffnungsgrundsätze; Nova, Theo;
   Straße Dash; Laden Rosies Food-Truck), Port Delacroix (Club 6, Miss Odile, E + 520,
   Bauernstruktur und Pläne; Remy, Lou; Straße Mr. Batiste; Nachfahren Henri und Céleste
   Whitlock-Duval; Laden Gebäckstand), Desert Springs (Club 7, Mira, E + 580, Königsangriff und
   Opfer; Tomás, Dot; Straße Buck; Laden Antiquariat Mr. Okoro). Buchübungen nach `07`.
   Tiefpunkt (Szene 63, Vorwurf durch Remy, Clubkampf ohne Karten, R28/R29), Versöhnung in zwei
   Stufen: Nachfahren in Port Delacroix (Szene 68, O2), ganz im Canyon (Szene 73).
2. **Wege:** `wegIronwoodSilicon` (Bus bis zur Raststätte, Glasbrücke zu Fuß),
   `wegSiliconDelacroix` (Küstenfähre als begehbares Deck, Deich), `wegDelacroixDesert` (Wüstenzug,
   Canyonpfad, Felsbogen), je mit Rätseltafel, Gegner mit Uhr oder Mira, Funden, Figur mit Weisheit.
3. **Sprüche:** Dash (immun gegen „Großes Maul“), Batiste (immun gegen beide), Buck und der
   Schiffskoch (nicht immun), eigene Sprüche je Gegner; Szene 59: Ambrose erklärt, warum im Club
   geschwiegen wird (S2). Grübelfalle und Großes Maul als Belohnungen (Z4: nicht im Laden).
4. **Funde und E4:** 14 Funde; „Umschlag ohne Brief“ aufgelöst (Szene 76, Hales Brief „Ich
   warte.“), „Nietenkopf J. H.“ aufgelöst (Szene 73, Canyonbrücke von 1879); neu **„Die fehlende
   Seite“** (Notizbuch der Hales in der Lobby von Silicon Bay, Victor hat die Seite, Auflösung Akt 4
   in Summit City und Ghost Town).
5. **Flashback:** Klavierwerkstatt 1840 und 1852, Zugerraten `klassik-unsterbliche` Züge 1 bis 11.
6. **Ton:** Hurrikan als Vergangenheit, Wiederaufbau über drei Besuche als Hoffnung; keine realen
   Personen, Firmen oder Sturmnamen.

**Widersprüche und Vorschläge für gesperrte Stellen**

- **Geburtsort:** Teil 1 (Zeitlinie, 2.2) nennt New Orleans. Vorschlag: Zeile 1831 in Teil 1 auf
  „Port Delacroix, im Delta vor New Orleans; Schach in den Kaffeehäusern von New Orleans“ ändern.
- **Jahreszeit:** O1 sagt Spätsommer, 09 Abschnitt 2 setzt Akt 3 in Winter/Frühjahr. Gelöst:
  Hurrikan im letzten Spätsommer, Akt 3 im Winter danach. 09 Abschnitt 2 (Akt-3-Zeile „Old Harbor
  Sturm und Gischt“), Abschnitt 3.5 (Hafenkneipe), 4 und 4a (Old Harbor) nennen noch Old Harbor;
  durfte ich nicht ändern.
- **Flashback-Partie:** `klassiker.json` hat vor 1866 nur drei Partien, alle benutzt (Paulsen–Morphy
  in Cedar Creek, Unsterbliche in Riverton, Bird–Morphy in Ironwood). Vorschlag: eine öffentliche
  Partie aus den 1830er/1840er Jahren aufnehmen (C3 erlaubt das), dann den Flashback umstellen.
- **Steckbrief:** Immunität gegen Sprüche (S4) braucht eine neue Art der Steckbriefzeile, etwa
  `{ "art": "spruch", "wert": "immun:grossesMaul" }`.
- **Erinnerung 1858** (Szene 77): Stellung aus Ambroses erfundener Matchpartie muss mit der Engine
  gebaut werden (R13), eigener Auftrag.
- **Neue Dialogvariablen:** `ambroseSprichtWieder`, `musikhausOffen`, `briefGelesen`.
- **Begegnungen ohne Stellung:** Joggerin (Weg 4) und Schiffskoch (Weg 5) brauchen noch geprüfte
  Stellungen; Batiste 6.5 und Buck 8.44 sind geprüft.

**Offen:** nichts Blockierendes; sechs Fragen mit Empfehlung in Abschnitt 24 der Bibel.
