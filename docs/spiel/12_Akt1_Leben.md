# 12 Leben für die größeren Karten in Akt 1 (Entwurf)

Stand: 9.11.2026, Entwurf von mittel-1 für den Haupt-Chat. Anlass: Die Außenkarten werden nach dem
Maßstab in `KARTENREGELN.md`, Abschnitt 7a.2 (Pokémon mal 1,5 bis 2), größer (Birch Lane 56 × 36,
Park 44 × 32, der Weg nach Cedar Creek 220 bis 280 Kacheln auf zwei Karten, gut eine Minute). Dieses Dokument füllt
den neuen Platz mit Leben, passend zur Geschichte. Reihenfolge laut Haupt-Chat: Maßstab, dann diese
Ergänzung der Geschichte, dann Ortsdokumente und Bühnenbilder, dann Karten.

Quellen: `05_Story_Bibel.md` (Abschnitte 0 bis 3, Szenen 1 bis 25, Nebenfiguren 2.9 und 2.10),
`06_Regelwerk.md` (R13 Stellungsduell, R27 Erhalt, R30a Runden, R39 Clubbesuch), `07_Aufgabenzuordnung.md`
(Club 1: Kapitel 1, Notation, Zählen, hängende Figuren; Club 2: Mattbilder, Matt in 1 und 2),
`08_Wege_und_Entdeckungen.md` (W4, E1 bis E5, G1), `09_Weltbeschreibung.md` (4a, 5.1 bis 5.3),
`11_Karten_und_Gegenstaende.md` (7.1 Münzen), die Ortsdokumente `orte/maple-falls.md` und
`orte/cedar-creek.md`, `quests.json`, `orte.json`, `funde.json`.

## 0. Grundsätze

1. **Nichts an den Hauptszenen ändert sich.** Alles hier ist freiwillig, klein und im Tagebuch als
   Nebenaufgabe sichtbar. Keine neue Figur weiß etwas über Ambrose, das Brett, 1858 oder Josiah
   Hale, bevor die Hauptszenen es erzählen. Andeutungen ja (Mrs. Whitlock spielte Schach, alte
   Zeitungen im Keller, ein Mann im Anzug mit Telefon), Auflösungen nein.
2. **Quest-Arten wie vorhanden:** `raetsel`, `hilfe`, `begegnung` (`quests.json`). Neue Aufgaben
   tragen den Zusatz **„klein“** (Feld `klein: true`, Empfehlung): Sie zählen **nicht** für „Alle
   Nebenquests einer Stadt erledigt“ (R27, Springervorgabe), damit die bestehende Belohnung
   erreichbar bleibt.
3. **Belohnungen im Rahmen von R27 und 11 (7.1):** vor allem Münzen (10 bis 15 je Aufgabe), Funde
   fürs Album und Steckbriefzeilen; höchstens **eine** zusätzliche Hilfskarte je Ort. Zusammen
   bringen die neuen Aufgaben in Akt 1 etwa **95 Münzen** mehr (Maple Falls 35, Weg 20, Cedar Creek
   40). Das hebt Akt 1 von ≈ 245 auf ≈ 340 Münzen; die Wirtschaftssimulation
   (`gesamtsimulation.cjs --wirtschaft`) muss danach zeigen, dass der sparsame Spieler am Ende
   höchstens 400 Münzen übrig hat (heute 210 bis 260).
4. **Schach im Alltag:** Jede Aufgabe hat einen Schachbezug zum Kapitel des Ortes: Maple Falls und
   der Weg Kapitel 1 (Notation, Zählen von Angreifern und Verteidigern, hängende Figuren), Cedar
   Creek die Mattbilder (Grundreihe, Arabisch, Anastasia, Boden, Lolli). Buchbezug im Dialog nur als
   „Kapitel 1“ mit Abschnitt, nie mit Seiten.
5. **Lieber wenige gute Häuser als viele leere:** neu betretbar sind nur das Diner in Maple Falls
   und die Drechslerei in Cedar Creek. Alles andere bleibt Kulisse, aber mit Figuren davor.

## 1. Maple Falls

Birch Lane (56 × 36) und Park (44 × 32). Der neue Platz geht an: Diner (betretbar), Veranda von
Mrs. Calloway (Südseite), Spielplatz zwischen Haus Martínez und Schule, Schulhof mit Fahnenmast,
Parkplatz am Diner; im Park das Ufer mit Steg und der Weg unter der großen Eiche.

### 1.1 Neue Nebenfiguren

| Figur                | Alter, Pronomen | Hintergrund (ein Satz)                                                                                                                 | Platz (Karte)                                                   | Tagesablauf                                                                                                   |
| -------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Mrs. Eunice Calloway | 79, sie         | Wohnt seit 1964 gegenüber dem Whitlock-Haus und war sechzig Jahre lang Mrs. Whitlocks Nachbarin, Freundin und Gegnerin im Kartenspiel. | aussen: Veranda des Hauses auf der Südseite, gegenüber          | Morgens gießt sie die Blumenkästen, nachmittags strickt sie auf der Veranda, abends Licht am Fenster.         |
| Hector Sandoval      | 46, er          | Koch und Besitzer des Diners, druckt auf seine Papier-Tischsets jede Woche ein „Rätsel für Kinder“ und löst sie selbst nie.            | Diner (innen) hinter dem Tresen; abends draußen beim Schild     | Ab sechs am Grill, mittags im Gedränge, nachmittags Tischsets malen, abends repariert er das „p“ der Reklame. |
| Wanda Kessler        | 34, sie         | Briefträgerin, kennt jeden Briefkasten der Stadt und hält die Post für Verstorbene länger, als sie müsste.                             | aussen: läuft die Birch Lane ab (heute Statist „Briefträgerin“) | Vormittags Runde auf der Nordseite, mittags Südseite, nachmittags Pause auf der Parkbank.                     |
| Mr. Gideon Pratt     | 67, er          | Hausmeister der Maple Falls High seit 1989, poliert die Pokale von 1994, als hätte er sie selbst gewonnen.                             | aussen: Schulhof am Fahnenmast; im Clubraum nur abends          | Morgens hisst er die Flagge, mittags harkt er den Schulhof, nachmittags sitzt er auf der Treppe.              |
| Carla Martínez       | 17, sie         | Junos große Schwester, spielte drei Jahre im Schachteam und hat aufgehört, als sie das Auto bekam.                                     | aussen: vor Haus Martínez, repariert ein Fahrrad am Zaun        | Nachmittags am Fahrrad, abends mit dem Auto weg; am Wochenende wäscht sie es in der Einfahrt.                 |
| Owen Fisk            | 7, er           | Kind aus der Südseite, das mit einem Ball überall auftaucht und jede Regel einmal erklärt haben will.                                  | aussen: Spielplatz (heute Statist „Kind mit Ball“)              | Nach der Schule auf dem Spielplatz, später mit dem Ball auf dem Gehweg, abends ruft ihn seine Mutter.         |

Sprechweise und Beispielsätze:

- **Mrs. Calloway:** langsam, mit Pausen und vielen „Kindchen“ in der neutralen Form („Herzchen“
  vermeidet sie; sie sagt den Namen). Erinnert sich an alles außer an das, was sie heute gegessen
  hat. „Margaret hat jeden Sonntag Schach gespielt. Gegen wen, habe ich nie gesehen.“ – „Die Kisten
  auf ihrem Dachboden? Die hat nie jemand aufgemacht. Nicht mal sie.“
  (Mrs. Whitlocks Vorname „Margaret“ ist neu; die Bibel nennt keinen. Andeutung: Sonntagsschach
  gegen niemanden, also gegen das Brett, ohne es auszusprechen.)
- **Hector Sandoval:** schnell, laut, Küchenwörter. „Bestellung läuft! … Ach, du willst nur das
  Tischset? Nimm zwei, das Rätsel ist diese Woche schwer.“ – „Gestern saß hier ein Mann im Anzug,
  zwei Telefone, kein Lächeln. Hat Kaffee bestellt und nur auf die Zahlen geschaut.“ (Andeutung auf
  Graham Hale vor Szene 12, ohne Namen.)
- **Wanda Kessler:** freundlich, ein bisschen zu ehrlich. „Für das Whitlock-Haus kommt noch immer
  der Schachkurier. Fünfzig Jahre Abo, und keiner hat es gekündigt.“ – „Ich lese keine Briefe. Ich
  lese nur Umschläge. Da steht genug drauf.“
- **Mr. Pratt:** knapp, stolz, Hausmeisterhumor. „1994. Kreisliga. Die haben gewonnen, weil sie
  gezählt haben, bevor sie geschlagen haben. Steht jetzt auf einem Plakat da drin.“ – „Die Flagge
  hängt schief. Wie die Bretter, wenn keiner aufräumt.“ (Brücke zu Coach Delgados Plakat „Erst
  zählen“, Szene 6.)
- **Carla Martínez:** lässig, älter-schwesterlich, gibt nicht zu, dass ihr Schach fehlt. „Juno spielt
  Schach, weil ich es gespielt habe. Ich hab aufgehört. Sag ihr nicht, dass ich das noch kann.“ –
  „Ich hab meine letzte Partie verloren, weil ich nicht gezählt habe. Drei gegen zwei. Ich hatte zwei.“
- **Owen Fisk:** Fragen ohne Punkt und Komma. „Warum darf der Bauer nicht zurück? Ich darf auch
  zurück!“ – „Ist die Dame die Mama vom König? Nein? Wer ist dann die Mama?“

### 1.2 Neue Nebenaufgaben

**N-MF1 Das Rätsel auf dem Tischset** · `raetsel` · `mapleFalls.tischset` (klein)

- **Figur und Ort:** Hector Sandoval, Diner (innen), Tisch am Fenster.
- **Ablauf:** (1) Im Diner liegt auf jedem Tisch ein Papier-Tischset mit „Was hängt?“; Hector gibt
  zu, dass er die Lösung selbst nicht weiß. (2) Aufgabenrunde `mapleFalls.tischset` mit `anzahl` 3,
  Thema `haengend` (R30a; Kapitel 1, hängende Figuren). (3) Hector heftet das gelöste Tischset an
  die Wand neben der Kasse: „Für die nächste Woche brauche ich jemanden, der schwerere macht.“
- **Belohnung:** 10 Münzen, Fund „Tischset mit Kreuzchen“ (Album).
- **Zeit:** 4 bis 6 Minuten.
- **Voraussetzung:** nach Szene 6 (erste Aufgabenreihe), damit das Thema bekannt ist.

**N-MF2 Post für die Birch Lane** · `hilfe` · `mapleFalls.post` (klein)

- **Figur und Ort:** Wanda Kessler auf der Birch Lane (Nordseite, wandert).
- **Ablauf:** (1) Wanda hat sich den Fuß vertreten und bittet, drei Briefe zuzustellen. (2) Brief an
  Mrs. Calloway (Veranda Südseite), (3) Päckchen an Mr. Pratt (Schulhof; darin ein neues Schloss
  für die Pokalvitrine), (4) der Schachkurier ans Whitlock-Haus: In den eigenen Briefkasten werfen
  oder aufmachen. Aufgemacht zeigt er auf der Rückseite ein Diagramm, in Bleistift angekreuzt, mit
  der Frage „Zählen!“ (eine Stellung aus Kapitel 1: Wer gewinnt den Abtausch auf e5?). Die Antwort
  ist eine Wahl im Dialog (drei Möglichkeiten). (5) Zurück zu Wanda.
- **Schachbezug:** Kapitel 1, Zählen von Angreifern und Verteidigern; Mrs. Whitlock hat das
  Kreuzchen gemacht (Andeutung, dass sie bis zuletzt Schach geübt hat, nichts über das Brett).
- **Belohnung:** 15 Münzen, Fund „Schachkurier, letzte Ausgabe“ (Album).
- **Zeit:** 6 bis 8 Minuten (nutzt die lange Birch Lane).

**N-MF3 Carlas letzte Partie** · `begegnung` · `mapleFalls.carla` (klein)

- **Figur und Ort:** Carla Martínez vor Haus Martínez, am Fahrrad.
- **Ablauf:** (1) Nach Szene 5 (Juno holt {held} ins Team) spricht Carla {held} an: Sie hat ihre
  letzte Partie im Team verloren, „weil ich nicht gezählt habe“. (2) Stellungsduell (R13) aus dieser
  Stellung, sechs Züge, Thema Zählen und hängende Figuren. (3) Gewinnt {held}, lacht sie und sagt,
  dass sie Juno vielleicht doch beim Clubkampf zusieht. Verliert {held}, sagt sie: „Siehst du. Ist
  schwer.“ Wiederholbar.
- **Belohnung:** 10 Münzen beim ersten Sieg, Steckbriefzeile „Carla: zählt jetzt“; beim Clubkampf
  (Szene 11) steht Carla als Zuschauerin am Rand (Statist ohne Wirkung).
- **Zeit:** 5 bis 8 Minuten.

### 1.3 Gebäude

| Gebäude                     | Status              | Figur                       | Dinge zum Ansehen (Auslöser `gegenstand`)                                                                                                                                           |
| --------------------------- | ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Diner „Falls Diner“         | **neu betretbar**   | Hector, Kellnerin (Statist) | `jukebox` (Lieder aus den Sechzigern, „die Schule wurde im selben Jahr gebaut“), `fotoWasserfall` (Foto 1962, Eröffnung der Schule), `tischsetWand` (gelöste Tischsets, nach N-MF1) |
| Haus Calloway (Südseite)    | Kulisse mit Veranda | Mrs. Calloway               | `blumenkasten` außen, Veranda mit Schaukelstuhl                                                                                                                                     |
| Maple Falls High (Schulhof) | Kulisse außen       | Mr. Pratt                   | `fahnenmast` (Flagge, „hängt schief“)                                                                                                                                               |
| Haus Martínez               | Kulisse             | Carla                       | Fahrrad am Zaun (kein Auslöser)                                                                                                                                                     |
| Spielplatz                  | Platz               | Owen                        | `sandkasten` (dort liegt der Fund „Bauer aus Plastik“)                                                                                                                              |
| Haus Hayes, Häuser Südseite | Kulisse             | –                           | „Zu verkaufen“-Schild im Fenster von Hayes (kein Auslöser)                                                                                                                          |

Diner innen (Vorschlag für das Bühnenbild): 18 × 12, Tresen mit Hockern an der Nordwand, vier
Sitznischen am Fenster (Südwand), Jukebox in der Ecke, Foto über der Kasse; Tür in der Südwand.

### 1.4 Funde und Entdeckungen

Birch Lane und Park sind zusammen 100 Kacheln breit, gut 12 Bildschirme (Hochformat, 8 Kacheln je
Bildschirm).
Jeder Abschnitt bekommt etwas zum Entdecken (Regel 7a.2); Funde sind fett.

| Abschnitt (von West nach Ost)  | Entdeckung                                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Birch Lane West, Haus Whitlock | Briefkasten mit verblichenem „Whitlock“ (`briefkastenWhitlock`, Ansehen), Katze bei Lily                    |
| vor Haus Hayes                 | Schild „Zu verkaufen“, Eichhörnchen im Ahorn                                                                |
| Haus Martínez                  | Carla am Fahrrad (N-MF3)                                                                                    |
| Spielplatz                     | Owen; **„Bauer aus Plastik“** im Sandkasten (`fundBauer`, 5 Münzen; Pratt: „Aus dem Schulset!“)             |
| Schulhof                       | Mr. Pratt am Fahnenmast                                                                                     |
| Südseite, Veranda Calloway     | Mrs. Calloway                                                                                               |
| Diner und Parkplatz            | Diner (betretbar), Leuchtreklame mit flackerndem „p“ (`reklame`, Ansehen)                                   |
| Haltestelle Südseite           | Fahrplan (`fahrplan`, Ansehen: „Schulbus 7:42“)                                                             |
| Park West, große Eiche         | Mr. Abernathys Bank (vorhanden), **„rotes Ahornblatt“** unter der Eiche (`fundAhornblatt`, Album, 0 Münzen) |
| Park Mitte, Halfpipe           | Jo (vorhanden)                                                                                              |
| Park, Kiosk                    | Mr. Patel (vorhanden)                                                                                       |
| Park Ufer, Steg                | Enten; Ausblick auf den Wasserfall (`aussichtWasserfall`, Ansehen, Ambrose sagt einen Satz)                 |
| Park Ost, Haltestelle          | Bus nach Cedar Creek (vorhanden)                                                                            |

## 2. Landstraße und Flussweg (`wegMapleCedar`)

Zwei Karten zu je 110 bis 140 Kacheln Länge (7a.2: zusammen 220 bis 280, gut eine Minute). Die Landstraße bekommt einen
Obstwiese der Brennans mit **Apfelstand** gegenüber dem Gatter zum Kürbishof Miller (`13_Wegenetz.md`,
S1 und N1), der Flussweg eine **alte Fährstelle** mit
einem Stein, in den ein Schachbrett geritzt ist. Bestehende Stationen bleiben: Rätseltafel am
Ortsausgang, Nia an der Bank, Wanderer, Fund „altes Partieformular“ (`formular1857`), Münzen am
Flussweg, Rastbank, Steg mit Angler, Ortsschild „Cedar Creek, gegr. 1851“.

### 2.1 Neue Nebenfiguren

| Figur        | Alter, Pronomen | Hintergrund (ein Satz)                                                                                      | Platz                                                      | Tagesablauf                                                                              |
| ------------ | --------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Ada Brennan  | 56, sie         | Bäuerin, verkauft am Gatter Äpfel und Sirup in einer Ehrlichkeitskasse und zählt abends nach, ob es stimmt. | Landstraße: Apfelstand am Gatter (Abzweig)                 | Morgens im Stall, mittags am Apfelstand, abends sitzt sie mit der Kasse auf dem Zaun.    |
| Otis Brennan | 59, er          | Adas Mann, fährt den Traktor und redet mit den Kühen mehr als mit Menschen.                                 | Landstraße: Traktor (heute Statist „Bauer auf Traktor“)    | Fährt morgens das Feld ab, mittags steht der Traktor am Gatter, abends repariert er ihn. |
| Silas Reed   | 74, er          | Angler, der nie etwas fängt; sein Großvater hat noch die Fähre über den Fluss gestakt.                      | Flussweg: Steg (heute Statist „Angler“)                    | Von früh bis spät auf dem Steg, mittags Brot aus Papier, abends trägt er die Angel heim. |
| Tessa Vance  | 24, sie         | Krankenschwester aus Cedar Creek, die für ihren ersten Lauf über die ganze Strecke trainiert.               | beide Karten: läuft hin und her (heute Statist „Joggerin“) | Morgens auf der Landstraße, abends auf dem Flussweg; bleibt nie länger als einen Satz.   |

Sprechweise und Beispielsätze:

- **Ada:** trocken, rechnet laut. „Drei Krähen auf dem Feld, zwei Vogelscheuchen. Wer gewinnt?
  Genau. Ich brauch eine dritte.“ – „Die Kasse stimmt fast immer. Fast.“
- **Otis:** einsilbig. „Hm.“ – „Gatter zu. Sonst laufen die Kühe nach Maple Falls und lernen Schach.“
- **Silas:** erzählt in langen Sätzen über früher. „Mein Großvater hat hier Leute übergesetzt, als
  es die Brücke noch nicht gab. Die Fährleute haben auf dem Stein gespielt, während sie warteten.“ –
  „Fische? Die wissen, wann ich komme.“
- **Tessa:** im Laufen, abgehackt. „Noch – drei Kilometer! – Bibliothek – hat die besten –
  Laufbücher!“ – „Du bist das Kind aus dem Whitlock-Haus? – Grüß Mrs. Okafor!“ (Tessa arbeitet als
  Krankenschwester; Mama ist auch Krankenpflegerin, eine kleine Verbindung für spätere Dialoge.)

### 2.2 Neue Nebenaufgaben

**N-W1 Die dritte Vogelscheuche** · `hilfe` · `wegMapleCedar.vogelscheuche` (klein)

- **Figur und Ort:** Ada Brennan am Apfelstand, Abzweig der Landstraße.
- **Ablauf:** (1) Ada erklärt ihr Problem als Rechnung: drei Krähen greifen an, zwei Vogelscheuchen
  verteidigen, „das geht schief, das weiß jeder, der zählen kann“ (Kapitel 1, Zählen). (2) {held}
  holt den alten Hut aus dem Schuppen (Auslöser `schuppen` an der Obstwiese) und eine Stange vom Zaun. (3) Ada
  stellt die dritte Vogelscheuche auf; die Krähen (Tiere, `fliegen`) ziehen ab. (4) Zum Dank eine
  kurze Zählfrage am Apfelstand: Stellung mit drei Angreifern und drei Verteidigern, Wahl im Dialog.
- **Belohnung:** 10 Münzen, ein Glas Ahornsirup als Gegenstand ohne Wirkung („riecht nach Herbst“,
  Album).
- **Zeit:** 5 bis 6 Minuten.

**N-W2 Der Stein der Fährleute** · `raetsel` · `wegMapleCedar.faehrstein` (klein)

- **Figur und Ort:** Silas Reed am Steg; der Stein an der alten Fährstelle des Flusswegs (flacher
  Stein am Ufer, ein Brett aus acht mal acht Feldern eingeritzt).
- **Ablauf:** (1) Silas erzählt von den Fährleuten, die auf dem Stein spielten. (2) Auf dem Stein
  liegen Kiesel als Figuren in einer Stellung, die Wasser und Wetter halb verschoben haben. (3)
  Rätsel: Matt in 1 mit dem Grundreihenmatt (Aufgabenrunde `wegMapleCedar.faehrstein`, `anzahl` 1,
  Thema `mattbild grundreihe`; erster Vorgeschmack auf Cedar Creek). (4) Silas: „So hat es mein
  Großvater auch gemacht. Der Turm kommt von hinten, und keiner sieht ihn.“
- **Belohnung:** 10 Münzen, Fund „glatter Kiesel mit Kreuz“ (Album).
- **Zeit:** 3 bis 5 Minuten.
- **Hinweis:** Am Stein steht keine Jahreszahl und kein Name; nichts verweist auf 1858.

### 2.3 Funde und Entdeckungen

Je Karte 14 bis 17 Bildschirme (Querrichtung 8 Kacheln). Etwa alle 8 bis 15 Kacheln ein Punkt; Funde
fett. Bestehende Punkte stehen in Klammern.

| Karte, Abschnitt          | Entdeckung                                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Landstraße 0–15           | (Rätseltafel, Ortsschild „Maple Falls“)                                                                     |
| Landstraße 15–30          | Kuhweide, Kühe am Zaun (Tiere); Weidetor mit Schild „Bitte schließen“ (`weidetor`, Ansehen)                 |
| Landstraße 30–45          | Vogelscheuche im Feld; Otis auf dem Traktor                                                                 |
| Landstraße 45–60, Abzweig | Wegweiser (drei Richtungen), Gatter S1; gegenüber Apfelstand mit Ada (N-W1), Schuppen                       |
| Landstraße 60–75          | (Wanderer); **„Hufeisen im Graben“** (`fundHufeisen`, 5 Münzen)                                             |
| Landstraße 75–90          | Heuhaufen; (Bank mit Nia)                                                                                   |
| Landstraße 90–105         | (Büsche mit `fundFormular`)                                                                                 |
| Landstraße 105–120        | Hase am Feldrand; Tessa läuft vorbei                                                                        |
| Flussweg 0–15             | Erlen über dem Wasser, Nebel am Morgen                                                                      |
| Flussweg 15–30            | (Münzen unter dem Baum, `fundMuenzen`)                                                                      |
| Flussweg 30–45            | Alte Fährstelle: Stein der Fährleute (N-W2), Pfosten der alten Fähre (`faehrpfosten`, Ansehen)              |
| Flussweg 45–60            | (Steg mit Angler) = Silas Reed                                                                              |
| Flussweg 60–75            | (Rastbank mit Blick aufs Wasser); Reiher im Schilf                                                          |
| Flussweg 75–90            | **„Flaschenkorken mit eingebranntem Springer“** am Ufer (`fundKorken`, Album; vom Picknick des Schachclubs) |
| Flussweg 90–105           | Schmetterlinge; Tessa                                                                                       |
| Flussweg 105–120          | (Ortsschild „Cedar Creek, gegr. 1851“)                                                                      |

## 3. Cedar Creek

Der Ort wird größer (Vorschlag nach 7a.2: Hauptstraße etwa 56 Kacheln, Karte 56 × 36, Bach und Zedernwiese am Ostrand). Neu
ist eine **Drechslerei** am Westende der Hauptstraße (betretbar), ein **Kanuverleih** am Bach
(Kulisse mit Figur) und die **Anschlagtafel** mit dem „Rätsel der Woche“ der Bibliothek.

### 3.1 Neue Nebenfiguren

| Figur               | Alter, Pronomen | Hintergrund (ein Satz)                                                                                                  | Platz                                                       | Tagesablauf                                                                                  |
| ------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Mr. Ansel Dunmore   | 63, er          | Drechsler; dreht aus dem Holz der roten Zedern Schalen, Stuhlbeine und für den Bibliotheksclub Schachfiguren.           | Drechslerei (innen), an der Drehbank                        | Morgens Holz holen, tagsüber an der Drehbank, abends kehrt er die Späne zusammen.            |
| Hattie Quill        | 66, sie         | Verleiht Kanus am Bach, liest jedes Buch der Bibliothek zweimal und spielt auf einem umgedrehten Kanu Schach.           | Bach: Kanuverleih am Westufer, südlich des Stegs            | Morgens Kanus ins Wasser, mittags Schach auf dem Kanu, abends trägt sie die Paddel ins Haus. |
| Miss Prudence Ashby | 29, sie         | Hilfsbibliothekarin, die alles katalogisiert, auch Dinge, die man nicht katalogisieren kann.                            | Bibliothek (innen) am Tresen (heute Statist „Leserin“)      | Vormittags Rückgaben, nachmittags Bücherwagen, abends schließt sie den Lesesaal ab.          |
| Mr. Lyle Kettering  | 58, er          | Fährt seit einunddreißig Jahren den Überlandbus zwischen Maple Falls und Cedar Creek und kennt jede Kurve mit Namen.    | Bushaltestelle (heute Statist „Busfahrer“)                  | Kommt um 9, 13 und 17 Uhr an, macht Pause an der Haltestelle, fährt zurück.                  |
| Ivy und Jonah Pell  | 9, sie und er   | Zwillinge, die auf der Bibliothekstreppe Fangen mit Figuren spielen und sich nie einigen, wer gewonnen hat.             | Bibliothekstreppe (heute Statisten „Kinder auf der Treppe“) | Nach der Schule auf der Treppe, bis Miss Ashby sie hereinruft.                               |
| Mrs. Beatrix Holm   | 71, sie         | Wohnt im Holzhaus Süd 1, pflegt die Zedernhecke und erzählt jedem, dass ihre Urgroßmutter die erste Bibliothekarin war. | Vorgarten Haus Süd 1                                        | Morgens Hecke schneiden, mittags Tee auf der Bank, abends Licht in der Küche.                |

Sprechweise und Beispielsätze:

- **Mr. Dunmore:** bedächtig, Handwerkerwörter. „Zedernholz. Riecht man, oder? Das bleibt dreißig
  Jahre so.“ – „Ein Springer ist die schwerste Figur. Nicht vom Gewicht. Vom Schnitzen.“
- **Hattie Quill:** munter, liest zitierend. „Ein Matt ist wie ein Kanu: Wenn es kippt, dann schnell.“
  – „Ich spiele immer Weiß. Ich sitze auf der hellen Seite vom Kanu.“
- **Miss Ashby:** leise, genau, ein bisschen streng. „Bitte flüstern. Das Schild hängt nicht nur zur
  Dekoration.“ – „Wir haben Zeitungen bis zur Gründung des Ortes. Die ganz alten verwaltet
  Mrs. Okafor.“ (Andeutung des Archivs, keine Jahreszahl.)
- **Mr. Kettering:** gemütlich, Busfahrerwitze. „Nächste Haltestelle: Cedar Creek. Endstation für
  alle, die Ruhe suchen.“ – „Früher fuhr hier die Postkutsche. Die war auch nicht pünktlicher.“
- **Ivy und Jonah:** reden gleichzeitig. „Ich hab gewonnen!“ – „Nein, ich! Der König darf nicht
  springen!“
- **Mrs. Holm:** stolz, ausführlich. „Eine Frau mit vierhundert Büchern und keinem, der mitliest. So
  fing das an. Erst die Bücher, dann der Ort.“ – „Die Zedern sind älter als die Bibliothek. Die
  wissen mehr als wir.“

Hinweis: Mr. Kettering raucht nicht mehr, er trinkt Kaffee aus der Thermoskanne; die
Weltbeschreibung (4a, „Busfahrer raucht“) sollte das für ein Kinderspiel übernehmen (Vorschlag).

### 3.2 Neue Nebenaufgaben

**N-CC1 Das Rätsel der Woche** · `raetsel` · `cedarCreek.raetselDerWoche` (klein)

- **Figur und Ort:** Anschlagtafel neben der Bushaltestelle; Mrs. Okafor hängt jede Woche ein
  Rätsel aus, Antworten kommen in den Bücherkasten an der Bibliothekstür.
- **Ablauf:** (1) Zettel an der Tafel lesen („Matt in zwei. Wer es findet, wirft den Zettel ein.“).
  (2) Aufgabenrunde `cedarCreek.raetselDerWoche`, `anzahl` 2, Themen `mattbild boden` und `mattbild
lolli` (Kapitel der Mattbilder). (3) Lösung in den Bücherkasten werfen (`buecherkasten`). (4) Beim
  nächsten Besuch in der Bibliothek dankt Mrs. Okafor: „Dein Name steht nächste Woche an der Tafel.“
- **Belohnung:** 15 Münzen, Steckbriefzeile Mrs. Okafor („hängt jede Woche ein Rätsel aus“).
- **Zeit:** 4 bis 6 Minuten.

**N-CC2 Ein Springer aus Zedernholz** · `hilfe` · `cedarCreek.zedernspringer` (klein)

- **Figur und Ort:** Mr. Dunmore in der Drechslerei.
- **Ablauf:** (1) Mr. Dunmore dreht einen Figurensatz für Maes Geburtstag; einem Springer ist das Ohr
  abgebrochen, und das passende Stück Zedernholz liegt bei den gefällten Ästen auf der Zedernwiese.
  (2) Ast suchen (`ast`, Zedernwiese am Bach). (3) Zurückbringen; während er schnitzt, fragt er, mit
  welchen Figuren das Anastasia-Matt gesetzt wird (Wahl im Dialog: Springer und Turm). (4) Er gibt den
  missratenen alten Springer ab: „Der hat ein Ohr zu wenig. Spielt trotzdem.“
- **Belohnung:** Fund „Springer aus Zedernholz“ (Album; Vorschlag: schaltet später den Figurensatz
  „Zedernholz“ als Extra frei, 08 E3), 10 Münzen. Bei Szene 22 (Sternennacht) hat Mae die neuen
  Figuren dabei (ein Satz Dialog, keine Änderung des Ablaufs).
- **Zeit:** 5 bis 7 Minuten.

**N-CC3 Schach auf dem Kanu** · `begegnung` · `cedarCreek.kanu` (klein)

- **Figur und Ort:** Hattie Quill am Kanuverleih.
- **Ablauf:** (1) Hattie spielt auf ihrem umgedrehten Kanu und sucht eine Gegnerin oder einen
  Gegner, „der nicht gleich ins Wasser fällt“. (2) Stellungsduell (R13) aus einer Stellung mit einem
  Boden-Matt in der Luft, acht Züge. (3) Sieg: Sie verleiht ein Kanu „für später“ (nur Dialog,
  Paddeln kommt nicht vor) und gibt eine Hilfskarte. Niederlage: wiederholbar.
- **Belohnung:** Hilfskarte `zweiteChance` (einmalig, die eine zusätzliche Karte des Ortes),
  15 Münzen beim ersten Sieg, Steckbriefzeile „Hattie: spielt immer Weiß“.
- **Zeit:** 6 bis 8 Minuten.

### 3.3 Gebäude

| Gebäude                | Status            | Figur                     | Dinge zum Ansehen                                                                                                                                            |
| ---------------------- | ----------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Drechslerei Dunmore    | **neu betretbar** | Mr. Dunmore               | `drehbank` (Späne, „Zedernholz riecht dreißig Jahre“), `figurenregal` (halbfertige Figuren in Reihen), `fotoSaegemuehle` (Großvater vor der alten Sägemühle) |
| Bibliothek, Waschsalon | vorhanden         | + Miss Ashby (Bibliothek) | unverändert; Ashby am Tresen                                                                                                                                 |
| Kanuverleih am Bach    | Kulisse am Ufer   | Hattie Quill              | Kanus am Ufer, das umgedrehte Kanu mit Brett (Auslöser der Figur)                                                                                            |
| Haus Süd 1 (Holm)      | Kulisse           | Mrs. Holm                 | `zedernhecke` (Ansehen)                                                                                                                                      |
| Haus Süd 2             | Kulisse           | –                         | –                                                                                                                                                            |
| Anschlagtafel          | vorhanden         | –                         | + Zettel „Rätsel der Woche“ (N-CC1), + Bücherkasten an der Bibliothekstür                                                                                    |

Drechslerei innen (Vorschlag): 16 × 11, Drehbank an der Nordwand mit Lampe darüber, Werkbank mit
Werkzeug an der Westwand, Regal mit Figuren und Schalen an der Ostwand, Holzstapel in der Ecke,
Späne am Boden als Bodenkram (Kartenregeln 8.4.3: passend am Boden). Tür in der Südwand.

### 3.4 Funde und Entdeckungen

| Abschnitt                    | Entdeckung                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| Hauptstraße West, Ankunft    | (Ortsschild), Drechslerei mit Holzstapel vor der Tür                                                      |
| Hauptstraße, Waschsalon      | (Hund vor der Tür)                                                                                        |
| Laterne zwischen den Häusern | **„Messingknopf mit Anker“** im Rinnstein (`fundKnopf`, 5 Münzen; Miss Ashby: „Von einer alten Uniform?“) |
| Bibliothek                   | Zwillinge auf der Treppe, Bücherkasten                                                                    |
| Anschlagtafel, Haltestelle   | (Plakat Perfect Move), Rätsel der Woche, Mr. Kettering                                                    |
| Häuser Süd                   | Mrs. Holm an der Zedernhecke                                                                              |
| Zedernwiese                  | Ast für N-CC2; **„Eisvogelfeder“** (`fundFeder`, Album)                                                   |
| Bach, Kanuverleih            | Hattie Quill (N-CC3)                                                                                      |
| Steg                         | (Rosa; Schlüssel im Schilf, vorhanden)                                                                    |
| Brücke zum Zedernwald        | (Schild „Weg gesperrt“ in Akt 1)                                                                          |

## 4. Brücken zur Hauptgeschichte (ohne Änderung der Hauptszenen)

| Brücke                                                  | Wo                     | Wirkung in der Geschichte                                                           |
| ------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| Mrs. Whitlock spielte sonntags Schach „gegen niemanden“ | Mrs. Calloway          | Stimmung vor Szene 2/3; erklärt nichts über Ambrose.                                |
| Schachkurier mit angekreuztem Diagramm                  | N-MF2                  | Mrs. Whitlock übte bis zuletzt; das Brett bleibt Geheimnis des Dachbodens.          |
| Pokale 1994 und „Erst zählen“                           | Mr. Pratt              | stützt Szene 6 (Plakat) und die Pokalvitrine.                                       |
| Mann im Anzug mit zwei Telefonen                        | Hector                 | leise Vorahnung auf Graham Hale (Szene 12), ohne Namen.                             |
| Juno spielt wegen ihrer Schwester                       | Carla (N-MF3)          | wörtlich aus der Bibel (2.7); Carla als Zuschauerin beim Clubkampf.                 |
| Tessa ist Krankenschwester                              | Weg                    | spätere kleine Verbindung zu Mama (gleicher Beruf), nur wenn ein Dialog es braucht. |
| Fährleute, Postkutsche, Gründung 1851                   | Silas, Kettering, Holm | Gefühl von Geschichte vor Szene 19 (1858), ohne das Jahr zu nennen.                 |
| Figuren für den Bibliotheksclub                         | Mr. Dunmore            | Maes neue Figuren in Szene 22; Figurensatz „Zedernholz“ als Extra (08 E3).          |
| Rätsel der Woche                                        | Mrs. Okafor            | ihr „Ein Matt ist ein Bild“ (Bibel 2.8) im Alltag des Ortes.                        |

## 5. Zeitbudget

| Ort                     | Neue Aufgaben (Minuten)     | Gebäude, Figuren, Funde (Minuten)  | Summe     |
| ----------------------- | --------------------------- | ---------------------------------- | --------- |
| Maple Falls             | 15–22 (N-MF1, N-MF2, N-MF3) | 5–8 (Diner, sechs Figuren, Funde)  | 20–30     |
| Landstraße und Flussweg | 8–11 (N-W1, N-W2)           | 3–5 (Obstwiese, Fährstelle, Funde) | 11–16     |
| Cedar Creek             | 15–21 (N-CC1, N-CC2, N-CC3) | 5–8 (Drechslerei, Figuren, Funde)  | 20–29     |
| **Akt 1 zusätzlich**    |                             |                                    | **51–75** |

Liegt ein Testlauf darüber, fallen zuerst N-MF3 und N-CC3 (die beiden Duelle) weg; dann bleibt der
Zusatz bei 40 bis 60 Minuten. Die längeren Wege selbst (Laufzeit nach 7a) sind hier nicht
mitgerechnet; sie gehören zum Maßstab.

## 6. Was sich in den Ortsdokumenten ändert

**`orte/maple-falls.md`**

- Gebäude: **Diner** wird betretbar (`mapleFalls.diner`, 18 × 12, Tür Südwand; außen Tür in der
  Nordfassade des Diners zur Birch Lane); **Haus Calloway** auf der Südseite gegenüber dem
  Whitlock-Haus mit Veranda (Kulisse); Spielplatz zwischen Haus Martínez und Schule (schon im Plan)
  mit Sandkasten.
- Figuren: `mapleFalls.calloway`, `.sandoval` (Diner), `.kessler` (wandert, Birch Lane), `.pratt`
  (Schulhof), `.carla` (Haus Martínez), `.owen` (Spielplatz). Statisten „Briefträgerin“ und „Kind mit
  Ball“ werden zu Figuren; die Kellnerin im Diner bleibt Statist.
- Auslöser außen: `dinerTuer` (Übergang), `briefkastenWhitlock`, `blumenkasten`, `fahnenmast`,
  `sandkasten`, `fundBauer`, `reklame`, `fahrplan`; Park: `fundAhornblatt`, `aussichtWasserfall`.
- Auslöser im Diner: `dinerAusgang`, `jukebox`, `fotoWasserfall`, `tischsetWand`.
- Quests: `mapleFalls.tischset`, `mapleFalls.post`, `mapleFalls.carla`; Runde `mapleFalls.tischset`.

**`orte/cedar-creek.md`** (Teil Cedar Creek)

- Gebäude: **Drechslerei Dunmore** am Westende der Hauptstraße, Nordseite, betretbar
  (`cedarCreek.drechslerei`, 16 × 11, Tür Südwand); **Kanuverleih** am Westufer des Baches südlich des
  Stegs (Kulisse); Haus Süd 1 mit Mrs. Holm.
- Figuren: `cedarCreek.dunmore`, `.quill`, `.ashby` (Bibliothek), `.kettering` (Haltestelle),
  `.zwillinge` (Bibliothekstreppe, eine Figur mit zwei Sprites oder zwei Statisten), `.holm`.
  Statisten „Busfahrer“, „Leserin“ und „Kinder auf der Treppe“ werden zu Figuren.
- Auslöser außen: `drechslereiTuer`, `buecherkasten`, `zedernhecke`, `ast`, `fundKnopf`,
  `fundFeder`; die Anschlagtafel bekommt den Auslöser `raetselDerWoche` neben `plakat`.
- Auslöser in der Drechslerei: `drechslereiAusgang`, `drehbank`, `figurenregal`, `fotoSaegemuehle`.
- Quests: `cedarCreek.raetselDerWoche`, `cedarCreek.zedernspringer`, `cedarCreek.kanu`; Runde
  `cedarCreek.raetselDerWoche`.

**`orte/cedar-creek.md`** (Teil Landstraße und Flussweg)

- Landstraße: **Obstwiese** der Brennans mit Apfelstand und Geräteschuppen (Kulisse), gegenüber
  dem Gatter S1 zum Kürbishof Miller (`13_Wegenetz.md`); der Wegweiser steht am Abzweig (wie geplant). Figuren `wegMapleCedar.ada`, `.otis` (Traktor, heute
  Statist), `.tessa` (heute Statist „Joggerin“, auf beiden Karten). Auslöser `apfelstand` (Figur),
  `schuppen`, `weidetor`, `fundHufeisen`. Quest `wegMapleCedar.vogelscheuche`.
- Flussweg: **alte Fährstelle** mit dem Stein der Fährleute und Fährpfosten am Ufer zwischen
  Münzen-Fund und Steg. Figur `wegMapleCedar.silas` (heute Statist „Angler“). Auslöser `faehrstein`,
  `faehrpfosten`, `fundKorken`. Quest `wegMapleCedar.faehrstein`, Runde `wegMapleCedar.faehrstein`.

**Funde** (`funde.json`, neu): `tischset` (Maple Falls), `schachkurier` (Maple Falls), `bauerPlastik`
(Maple Falls), `ahornblatt` (Maple Falls), `ahornsirup` (Weg), `kiesel` (Weg), `hufeisen` (Weg),
`korken` (Weg), `zedernspringer` (Cedar Creek), `messingknopf` (Cedar Creek), `eisvogelfeder` (Cedar
Creek). Den „Zedernzapfen mit Initialen“ vergibt der Zedernpfad (`13_Wegenetz.md`, Q1).

**Offen für den Haupt-Chat:** (1) Feld `klein` in `quests.json` und der Zählung „alle Nebenquests“
(R27) oder eine andere Lösung; (2) Vorname „Margaret“ für Mrs. Whitlock (neu, Bibel nennt keinen);
(3) Busfahrer raucht nicht mehr (Weltbeschreibung 4a); (4) Wirtschaftssimulation nach dem Einbau. (5) Abgleich mit `13_Wegenetz.md`:
Der Kürbishof Miller (N1) besitzt Abzweig, Gatter und Scheune; die Brennans haben deshalb nur eine
Obstwiese mit Apfelstand gegenüber, Otis' Traktor fährt auf deren Wiese. Die Kühe auf der Kuhweide
(Landstraße 15–30) können die ausgebüxten Kühe von N1 sein.
