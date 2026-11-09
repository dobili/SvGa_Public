# 12 Leben für die größeren Karten in Akt 1 (Entwurf)

Stand: 9.11.2026, Entwurf von mittel-1 für den Haupt-Chat. Anlass: Die Außenkarten werden nach dem
Maßstab in `KARTENREGELN.md`, Abschnitt 7a.2 (Pokémon mal 1,5 bis 2), größer (Birch Lane 64 × 36 als
begründete Ausnahme, Park 44 × 32, der Weg nach Cedar Creek 220 bis 280 Kacheln auf zwei Karten,
gut eine Minute). Dieses Dokument füllt den neuen Platz mit Leben, passend zur Geschichte. Reihenfolge laut Haupt-Chat: Maßstab, dann diese
Ergänzung der Geschichte, dann Ortsdokumente und Bühnenbilder, dann Karten. Überarbeitet nach dem
Prüfbericht `pruefberichte/2026-11-09_akt1_wegenetz.md` (Befunde 4, 5, 8 bis 10, 12 bis 15, 17, 23,
25, 26, 33 bis 35, 38).

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
   erreichbar bleibt, und sie geben **keine Karte**, auch nicht das `fluestern`, das R27 für
   Hilfe- und Rätsel-Quests vorsieht (Befund 12). Das Feld `klein` kommt beim Einbau ins
   Quest-Schema.
3. **Belohnungen im Rahmen von R27 und 11 (7.1):** vor allem Münzen (10 bis 15 je Aufgabe), Funde
   fürs Album und typisierte Steckbriefzeilen der Gegner (C7); keine Hilfskarten (Grundsatz 2). Zusammen
   bringen die neuen Aufgaben in Akt 1 etwa **95 Münzen** mehr (Maple Falls 35, Weg 20, Cedar Creek
   40). Das hebt Akt 1 von ≈ 245 auf ≈ 340 Münzen; die Wirtschaftssimulation
   (`gesamtsimulation.cjs --wirtschaft`) muss danach zeigen, dass der sparsame Spieler am Ende
   höchstens 400 Münzen übrig hat (heute 210 bis 260).
4. **Schach im Alltag:** Jede Aufgabe hat einen Schachbezug zum Kapitel des Ortes: Maple Falls und
   der Weg Kapitel 1 (Notation, Zählen von Angreifern und Verteidigern, hängende Figuren), Cedar
   Creek die Mattbilder (Grundreihe, Arabisch, Anastasia, Boden, Lolli). Bewusste Ausnahme: der
   Stein der Fährleute (N-W2) am Flussweg ist schon ein Grundreihenmatt, als Vorgeschmack auf Cedar
   Creek. Buchbezug im Dialog nur als „Kapitel 1“ mit Abschnitt, nie mit Seiten.
5. **Lieber wenige gute Häuser als viele leere:** neu betretbar sind nur das Diner in Maple Falls
   und die Drechslerei in Cedar Creek. Alles andere bleibt Kulisse, aber mit Figuren davor.

## 1. Maple Falls

Birch Lane (64 × 36) und Park (44 × 32); Lage in Kacheln in `orte/maple-falls.md`, Abschnitt 1. Die
Birch Lane ist acht Kacheln länger als 7a.2 erlaubt (40 bis 60), weil die Nordseite fünf Gebäude
tragen muss: Haus Whitlock, Lily, Martínez („zwei Häuser weiter“, Bibel), Diner und Schule; das sind
schon 53 Kacheln Fassade, mit Abständen, Weg zum Schulhof und Rand 64 (Befund 10; 18 Sekunden zu Fuß). Der neue Platz
geht an: Diner mit Parkplatz (Nordseite, betretbar), Veranda von Mrs. Calloway (Südseite gegenüber
dem Whitlock-Haus), Haus Hayes (Südseite, Leerstand mit Einfahrt), Spielplatz gegenüber der Schule,
Schulhof mit Fahnenmast, ein Hinterweg mit Kurven hinter den Gärten der Südseite; im Park das Ufer
mit Steg und Fußsteg zum Zedernpfad (Nordwesten) und der Weg unter der großen Eiche.

### 1.1 Neue Nebenfiguren

| Figur                | Alter, Pronomen | Hintergrund (ein Satz)                                                                                                                      | Platz (Karte)                                                   | Tagesablauf                                                                                                   |
| -------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Mrs. Eunice Calloway | 79, sie         | Wohnt seit 1964 gegenüber dem Whitlock-Haus und war über sechzig Jahre lang Mrs. Whitlocks Nachbarin, Freundin und Gegnerin im Kartenspiel. | aussen: Veranda des Hauses auf der Südseite, gegenüber          | Morgens gießt sie die Blumenkästen, nachmittags strickt sie auf der Veranda, abends Licht am Fenster.         |
| Hector Sandoval      | 46, er          | Koch und Besitzer des Diners, druckt auf seine Papier-Tischsets jede Woche ein „Rätsel für Kinder“ und löst sie selbst nie.                 | Diner (innen) hinter dem Tresen; abends draußen beim Schild     | Ab sechs am Grill, mittags im Gedränge, nachmittags Tischsets malen, abends repariert er das „p“ der Reklame. |
| Wanda Kessler        | 34, sie         | Briefträgerin, kennt jeden Briefkasten der Stadt und hält die Post für Verstorbene länger, als sie müsste.                                  | aussen: läuft die Birch Lane ab (heute Statist „Briefträgerin“) | Vormittags Runde auf der Nordseite, mittags Südseite, nachmittags Pause auf der Parkbank.                     |
| Mr. Gideon Pratt     | 67, er          | Hausmeister der Maple Falls High seit 1989, poliert die Pokale von 1994, als hätte er sie selbst gewonnen.                                  | aussen: Schulhof am Fahnenmast; im Clubraum nur abends          | Morgens hisst er die Flagge, mittags harkt er den Schulhof, nachmittags sitzt er auf der Treppe.              |
| Carla Martínez       | 17, sie         | Junos große Schwester, spielte drei Jahre im Schachteam und hat aufgehört, als sie das Auto bekam.                                          | aussen: vor Haus Martínez, repariert ein Fahrrad am Zaun        | Nachmittags am Fahrrad, abends mit dem Auto weg; am Wochenende wäscht sie es in der Einfahrt.                 |
| Owen Fisk            | 7, er           | Kind aus der Südseite, das mit einem Ball überall auftaucht und jede Regel einmal erklärt haben will.                                       | aussen: Spielplatz (heute Statist „Kind mit Ball“)              | Nach der Schule auf dem Spielplatz, später mit dem Ball auf dem Gehweg, abends ruft ihn seine Mutter.         |

Sprechweise und Beispielsätze:

- **Mrs. Calloway:** langsam, mit Pausen; spricht {held} immer mit Namen an. Erinnert sich an alles
  außer an das, was sie heute gegessen hat. „Margaret hat jeden Sonntag Schach gespielt. Gegen
  Leute, die sie nie gesehen hat. Per Post.“ – „Die Kisten auf ihrem Dachboden? Die hat nie jemand
  aufgemacht. Nicht mal sie.“ (Vorname „Margaret“ entschieden vom Haupt-Chat. Fernschach per Post
  statt „gegen das Brett“, weil die Stellung auf dem Dachboden seit 1866 unberührt ist, Bibel 2.2
  und Szene 2; passt zum Schachkurier in N-MF2 und zu Abernathys Brief; Befund 4.)
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
  Stellung, 10 Züge (Straße), Thema Zählen und hängende Figuren; Startvorteil nach R13, kein Matt in
  drei oder weniger, die Pipeline prüft die Stellung beim Einbau (Befund 15). (3) Gewinnt {held}, lacht sie und sagt,
  dass sie Juno vielleicht doch beim Clubkampf zusieht. Verliert {held}, sagt sie: „Siehst du. Ist
  schwer.“ Wiederholbar.
- **Belohnung:** 10 Münzen beim ersten Sieg. Carla bekommt ein Gegnerprofil (`mapleFalls.carla`,
  Stärke Straße) mit der typisierten Steckbriefzeile `{ "art": "fehlerart", "wert": "schlagreflex" }`
  („schlägt, bevor sie zählt“; Befund 13), die der Sieg freischaltet. Beim Clubkampf
  (Szene 11) steht Carla als Zuschauerin am Rand (Statist ohne Wirkung).
- **Zeit:** 5 bis 8 Minuten.

### 1.3 Gebäude

| Gebäude                                      | Status              | Figur                       | Dinge zum Ansehen (Auslöser `gegenstand`)                                                                                                                                                                                                         |
| -------------------------------------------- | ------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Diner „Falls Diner“ (Nordseite)              | **neu betretbar**   | Hector, Kellnerin (Statist) | `jukebox` (Lieder aus den Sechzigern, „die Schule wurde im selben Jahr gebaut“), `fotoSchule1962` (Foto 1962, Eröffnung der Schule; früher `fotoWasserfall`, umbenannt, weil es die Schule zeigt), `tischsetWand` (gelöste Tischsets, nach N-MF1) |
| Haus Calloway (Südseite)                     | Kulisse mit Veranda | Mrs. Calloway               | `blumenkasten` außen, Veranda mit Schaukelstuhl                                                                                                                                                                                                   |
| Maple Falls High (Schulhof)                  | Kulisse außen       | Mr. Pratt                   | `fahnenmast` (Flagge, „hängt schief“)                                                                                                                                                                                                             |
| Haus Martínez                                | Kulisse             | Carla                       | Fahrrad am Zaun (kein Auslöser)                                                                                                                                                                                                                   |
| Spielplatz                                   | Platz               | Owen                        | `sandkasten` (dort liegt der Fund „Bauer aus Plastik“)                                                                                                                                                                                            |
| Haus Hayes (Südseite), Haus Fisk, Haus Süd 4 | Kulisse             | Owen (vor Haus Fisk)        | „Zu verkaufen“-Schild als eigenes Objekt vor Hayes, Einfahrt frei für den Umzugswagen (13, 7.4)                                                                                                                                                   |

Diner innen (Vorschlag für das Bühnenbild): 18 × 12. Das Diner steht auf der Nordseite der Birch
Lane, Fassade 9, Tür in der Südfassade (Befund 9). Innen: Tresen mit Hockern vor der Nordwand, darüber
die Fenster (die Ansicht zeigt nur dort Wandflächen); Küchendurchreiche und Kasse mit dem Foto
daneben; vier Sitznischen an der Südwand, je zwei links und rechts der Tür (Mitte der Südwand);
Jukebox in der Südostecke.

### 1.4 Funde und Entdeckungen

Birch Lane und Park sind zusammen 100 Kacheln breit, gut 12 Bildschirme (Hochformat, 8 Kacheln je
Bildschirm).
Jeder Abschnitt bekommt etwas zum Entdecken (Regel 7a.2); Funde sind fett.

Abschnitte wie im Ortsplan (`orte/maple-falls.md`, 1.1): Birch Lane A bis H zu je 8 Spalten, Park
A bis F zu je 8 Spalten (F nur 4).

| Abschnitt (West nach Ost) | Nordseite                                                                                                                                                                                              | Südseite                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Birch Lane A–B (0–15)     | Haus Whitlock, Briefkasten mit verblichenem „Whitlock“ (`briefkastenWhitlock`); Haus Lily, Katze                                                                                                       | Mrs. Calloway auf der Veranda (`blumenkasten`); Haltestelle mit `fahrplan` („Schulbus 7:42“)                               |
| Birch Lane C–D (16–31)    | Lily (Ende), Haus Martínez mit Carla am Fahrrad (N-MF3); Eichhörnchen im Ahorn                                                                                                                         | Haus Hayes, Schild „Zu verkaufen“, leere Einfahrt; Haus Fisk                                                               |
| Birch Lane E (32–39)      | Diner mit Parkplatz, Leuchtreklame mit flackerndem „p“ (`reklame`)                                                                                                                                     | Haus Fisk, dahinter der Hinterweg                                                                                          |
| Birch Lane F–H (40–63)    | Durchgang zum Ufer, Schule, Mr. Pratt am Fahnenmast (`fahnenmast`)                                                                                                                                     | Haus Süd 4; Spielplatz mit Owen; **„Bauer aus Plastik“** im Sandkasten (`fundBauer`, 5 Münzen; Pratt: „Aus dem Schulset!“) |
| Park A (0–7)              | Steg mit Absperrband (S5); dahinter **Initialen** am alten Pfosten (`fundInitialen`) und Blick zum Wasserfall (`aussichtWasserfall`); große Eiche mit Mr. Abernathys Bank (vorhanden) und zweiter Bank | Wiese, Laub zum Durchlaufen                                                                                                |
| Park B (8–15)             | Fußsteg zum Zedernpfad (S2), Startlinie für Jos Rennen am Uferweg                                                                                                                                      | Hauptweg mit Kurve, freier Platz für das öffentliche Brett (später)                                                        |
| Park C (16–23)            | Halfpipe, Jo (vorhanden)                                                                                                                                                                               | Wiese, Enten am Teichufer                                                                                                  |
| Park D (24–31)            | Kiosk Mr. Patel (vorhanden), Uferweg folgt der Biegung                                                                                                                                                 | Bushaltestelle (Szene 13: Schulbus; später Überlandbus)                                                                    |
| Park E–F (32–43)          | Brücke der Parkstraße über den Fluss                                                                                                                                                                   | Fluss läuft nach Osten weiter, zur Landstraße                                                                              |

## 2. Landstraße und Flussweg (`wegMapleCedar`)

Zwei Karten zu je 110 bis 140 Kacheln Länge (7a.2: zusammen 220 bis 280, gut eine Minute). Der
Fluss läuft südlich der Landstraße (Befund 5). Die Landstraße bekommt die Obstwiese der Brennans mit
**Apfelstand** (Lage nach Befund 11 in `orte/cedar-creek.md`), der Flussweg eine **alte Fährstelle**
mit einem Stein, in den ein Schachbrett geritzt ist. Bestehende Stationen bleiben: Rätseltafel am
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
  Laufbücher!“ – „Du bist das Kind aus dem Whitlock-Haus? – Grüß Mrs. Okafor!“ (den zweiten Satz
  erst nach `okaforGetroffen`, Befund 33). Tessa arbeitet als Krankenschwester; Mama ist auch
  Krankenpflegerin, eine kleine Verbindung für spätere Dialoge.

### 2.2 Neue Nebenaufgaben

**N-W1 Die dritte Vogelscheuche** · `hilfe` · `wegMapleCedar.vogelscheuche` (klein)

- **Figur und Ort:** Ada Brennan am Apfelstand, Abzweig der Landstraße.
- **Ablauf:** (1) Ada erklärt ihr Problem als Rechnung: drei Krähen greifen an, zwei Vogelscheuchen
  verteidigen, „das geht schief, das weiß jeder, der zählen kann“ (Kapitel 1, Zählen). (2) {held}
  holt den alten Hut aus dem Schuppen (Auslöser `schuppen` an der Obstwiese) und eine Stange vom Zaun. (3) Ada
  stellt die dritte Vogelscheuche auf; die Krähen (Tiere, `fliegen`) ziehen ab. (4) Zum Dank eine
  kurze Zählfrage am Apfelstand: Stellung mit drei Angreifern und drei Verteidigern, Wahl im Dialog.
- **Belohnung:** 10 Münzen, Fund „Glas Ahornsirup“ (`ahornsirup`, Album, „riecht nach Herbst“);
  keine Karte (Grundsatz 2).
- **Zeit:** 5 bis 6 Minuten.

**N-W2 Der Stein der Fährleute** · `raetsel` · `wegMapleCedar.faehrstein` (klein)

- **Figur und Ort:** Silas Reed am Steg; der Stein an der alten Fährstelle des Flusswegs (flacher
  Stein am Ufer, ein Brett aus acht mal acht Feldern eingeritzt).
- **Ablauf:** (1) Silas erzählt von den Fährleuten, die auf dem Stein spielten. (2) Auf dem Stein
  liegen Kiesel als Figuren in einer Stellung, die Wasser und Wetter halb verschoben haben. (3)
  Rätsel: Matt in 1 mit dem Grundreihenmatt (Aufgabenrunde `wegMapleCedar.faehrstein`, `anzahl` 1,
  Thema `grundreihenmatt`; bewusste Ausnahme vom Grundsatz „Weg = Kapitel 1“, erster Vorgeschmack
  auf Cedar Creek; Befund 14). (4) Silas: „So hat es mein
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
| Flussweg 45–60            | (Rastbank mit Blick aufs Wasser); Reiher im Schilf                                                          |
| Flussweg 60–75            | (Steg mit Angler) = Silas Reed                                                                              |
| Flussweg 75–90            | **„Flaschenkorken mit eingebranntem Springer“** am Ufer (`fundKorken`, Album; vom Picknick des Schachclubs) |
| Flussweg 90–105           | Schmetterlinge; Tessa                                                                                       |
| Flussweg 105–120          | (Ortsschild „Cedar Creek, gegr. 1851“)                                                                      |

## 3. Cedar Creek

Der Ort wird größer (Vorschlag nach 7a.2: Hauptstraße etwa 56 Kacheln, Karte 56 × 36, Bach und Zedernwiese am Ostrand). Neu
ist eine **Drechslerei** am Westende der Hauptstraße (betretbar), ein **Kanuverleih** am Bach
(Kulisse mit Figur) und die **Anschlagtafel** mit dem „Rätsel der Woche“ der Bibliothek.

### 3.1 Neue Nebenfiguren

| Figur               | Alter, Pronomen | Hintergrund (ein Satz)                                                                                                       | Platz                                                       | Tagesablauf                                                                                  |
| ------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Mr. Ansel Dunmore   | 63, er          | Drechsler; dreht aus dem Holz der roten Zedern Schalen, Stuhlbeine und für den Bibliotheksclub Schachfiguren.                | Drechslerei (innen), an der Drehbank                        | Morgens Holz holen, tagsüber an der Drehbank, abends kehrt er die Späne zusammen.            |
| Hattie Quill        | 66, sie         | Verleiht Kanus am Bach, liest jedes Buch der Bibliothek zweimal und spielt auf einem umgedrehten Kanu Schach.                | Bach: Kanuverleih am Westufer, südlich des Stegs            | Morgens Kanus ins Wasser, mittags Schach auf dem Kanu, abends trägt sie die Paddel ins Haus. |
| Miss Prudence Ashby | 29, sie         | Hilfsbibliothekarin, die alles katalogisiert, auch Dinge, die man nicht katalogisieren kann.                                 | Bibliothek (innen) am Tresen (heute Statist „Leserin“)      | Vormittags Rückgaben, nachmittags Bücherwagen, abends schließt sie den Lesesaal ab.          |
| Mr. Lyle Kettering  | 58, er          | Fährt seit einunddreißig Jahren den Überlandbus zwischen Maple Falls und Cedar Creek und kennt jede Kurve mit Namen.         | Bushaltestelle (heute Statist „Busfahrer“)                  | Kommt um 9, 13 und 17 Uhr an, macht Pause an der Haltestelle, fährt zurück.                  |
| Ivy und Jonah Pell  | 9, sie und er   | Zwillinge, die auf der Bibliothekstreppe Fangen mit Figuren spielen und sich nie einigen, wer gewonnen hat.                  | Bibliothekstreppe (heute Statisten „Kinder auf der Treppe“) | Nach der Schule auf der Treppe, bis Miss Ashby sie hereinruft.                               |
| Mrs. Beatrix Holm   | 71, sie         | Wohnt im Holzhaus Süd 1, pflegt die Zedernhecke und erzählt jedem, dass ihre Urgroßmutter 1890 die erste Bibliothekarin war. | Vorgarten Haus Süd 1                                        | Morgens Hecke schneiden, mittags Tee auf der Bank, abends Licht in der Küche.                |

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
- **Mrs. Holm:** stolz, ausführlich. „Erst kam der Ort, 1851, dann vierzig Jahre lang nichts zum
  Lesen. Und dann meine Urgroßmutter mit vierhundert Büchern.“ – „Die Zedern sind älter als die
  Bibliothek. Die wissen mehr als wir.“ (Gründung 1851, Bibliothek 1890; Befund 35.)

Hinweis: Mr. Kettering raucht nicht mehr, er trinkt Kaffee aus der Thermoskanne; die
Weltbeschreibung (4a, „Busfahrer raucht“) sollte das für ein Kinderspiel übernehmen (Vorschlag).

### 3.2 Neue Nebenaufgaben

**N-CC1 Das Rätsel der Woche** · `raetsel` · `cedarCreek.raetselDerWoche` (klein)

- **Figur und Ort:** Anschlagtafel neben der Bushaltestelle; Mrs. Okafor hängt jede Woche einen
  **Buchtipp** aus, und unter jedem Buchtipp steht ein Rätsel („Erst lösen, dann ausleihen“).
  Antworten kommen in den Bücherkasten an der Bibliothekstür. So ist es kein zweites Brett wie
  Boatengs Trockner (Szene 17); Boateng verweist darauf: „Mein Trockner hat eine Stellung. Die
  Tafel hat zwei. Okafor muss immer gewinnen.“ (Befund 35)
- **Ablauf:** (1) Zettel an der Tafel lesen („Matt in zwei. Wer es findet, wirft den Zettel ein.“).
  (2) Aufgabenrunde `cedarCreek.raetselDerWoche`, `anzahl` 2, Thema `matt2` (Befund 14). (3) Lösung
  in den Bücherkasten werfen (`buecherkasten`). (4) Beim nächsten Besuch in der Bibliothek dankt
  Mrs. Okafor: „Dein Name steht nächste Woche an der Tafel.“
- **Belohnung:** 15 Münzen; Tagebucheintrag „Mrs. Okafor hängt jede Woche ein Rätsel aus“ statt
  einer Steckbriefzeile, weil Steckbriefzeilen typisiert sind und nur Gegnern gehören (Befund 13).
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
  Gegner, „der nicht gleich ins Wasser fällt“. (2) Stellungsduell (R13), 10 Züge (Straße): Ein
  Boden-Matt lässt sich vorbereiten, aber es gibt kein Matt in drei oder weniger; Startvorteil nach
  R13, die Pipeline prüft die Stellung beim Einbau (Befund 15). (3) Sieg: Sie verleiht ein Kanu „für
  später“ (nur Dialog, Paddeln kommt nicht vor). Niederlage: wiederholbar.
- **Belohnung:** 15 Münzen beim ersten Sieg, keine Karte (Grundsatz 2). Hattie bekommt ein
  Gegnerprofil (`cedarCreek.quill`, Stärke Straße) mit der typisierten Steckbriefzeile
  `{ "art": "stil", "wert": "angreifer" }`, die der Sieg freischaltet (Befund 13); „Ich spiele immer
  Weiß“ bleibt ihr Satz im Dialog.
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

| Brücke                                             | Wo                     | Wirkung in der Geschichte                                                           |
| -------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| Mrs. Whitlock spielte sonntags Fernschach per Post | Mrs. Calloway          | Stimmung vor Szene 2/3; erklärt nichts über Ambrose und lässt das Brett unberührt.  |
| Schachkurier mit angekreuztem Diagramm             | N-MF2                  | Mrs. Whitlock übte bis zuletzt; das Brett bleibt Geheimnis des Dachbodens.          |
| Pokale 1994 und „Erst zählen“                      | Mr. Pratt              | stützt Szene 6 (Plakat) und die Pokalvitrine.                                       |
| Mann im Anzug mit zwei Telefonen                   | Hector                 | leise Vorahnung auf Graham Hale (Szene 12), ohne Namen.                             |
| Juno spielt wegen ihrer Schwester                  | Carla (N-MF3)          | wörtlich aus der Bibel (2.7); Carla als Zuschauerin beim Clubkampf.                 |
| Tessa ist Krankenschwester                         | Weg                    | spätere kleine Verbindung zu Mama (gleicher Beruf), nur wenn ein Dialog es braucht. |
| Fährleute, Postkutsche, Gründung 1851              | Silas, Kettering, Holm | Gefühl von Geschichte vor Szene 19 (1858), ohne das Jahr zu nennen.                 |
| Figuren für den Bibliotheksclub                    | Mr. Dunmore            | Maes neue Figuren in Szene 22; Figurensatz „Zedernholz“ als Extra (08 E3).          |
| Rätsel der Woche                                   | Mrs. Okafor            | ihr „Ein Matt ist ein Bild“ (Bibel 2.8) im Alltag des Ortes.                        |

## 5. Wege, Sperren und Rückwege

Wunsch des Autors (9.11.2026): Die Welt soll nicht schlauchartig sein. Akt 1 bekommt Stellen, die
zuerst zu sind und sich später öffnen, mit einem Grund aus der Geschichte statt Fähigkeiten. Die
Sperren S1 und S2 und der Waldweg nach Riverton kommen aus `13_Wegenetz.md` (mittel-2); hier
bekommen sie Figuren, Aufgaben und Lohn. Neu von mir ist S5 im Park. Grundsätze für alle drei:

- Man **sieht**, was hinter der Sperre liegt (Maisspitzen, Schild am Fußsteg, Wasserfall), und eine Figur
  davor **nennt den Grund** in einem Satz. So weiß der Spieler, dass er zurückkommen soll.
- Der Grund ist Alltag (Kühe, Sturm, morscher Steg), keine Fähigkeit.
- Das Fahrrad gibt es erst in Akt 2 (Story-Bibel: im Kiosk „zu früh“, später im Schuppen in
  Riverton). Akt 1 bekommt deshalb keine Fahrradsperre. Rückwege mit dem Rad stehen in
  `13_Wegenetz.md`, Abschnitt 3.

| Nr. | Karte, Stelle                                                                                                | Grund                                                                                                                                                                       | Öffnung                                                                                                                                                                                                                    | Lohn des Rückwegs                                                                                                                                                                                                                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | Landstraße 45–60, Gatter zum Kürbishof Miller (N1)                                                           | Walt Miller lässt niemanden aufs Feld, „die Kühe sind ausgebüxt“                                                                                                            | Nach der Rätseltafel am Ortsausgang (Torwächter), Miller hat zugesehen. Vorher sagt Ada am Apfelstand gegenüber: „Walt macht nur auf, wenn einer denken kann.“                                                             | Nebenort N1 (13_Wegenetz). Ergänzung: Die drei ausgebüxten Kühe stehen auf der Kuhweide (Landstraße 15–30) und am Fährstein; Otis hat sie „gestern schon gesehen“, Tessa beim Laufen auch. So führt die Kuhsuche über beide Karten des Wegs und an N-W1 und N-W2 vorbei.                                                                                                     |
| S2  | Zedernpfad (Q1): Fußsteg über den Fluss im Nordwesten des Parks von Maple Falls ↔ Nordwesten von Cedar Creek | Eine Zeder ist im Sturm quer über den Pfad gefallen, auf der Maple-Falls-Seite der Kuppe. Vom Fußsteg aus sieht man das Schild „Sturmschaden“, von der Kuppe aus den Stamm. | Von der Cedar-Creek-Seite: Die Kuppe ist früh erreichbar; nach der Clubnadel von Cedar Creek zersägt Mr. Dunmore den Stamm („Gutes Holz. Schade drum.“), Befund 34. Mrs. Holm an der Zedernhecke erzählt vorher vom Sturm. | Abkürzung (etwa 29 Sekunden statt Landstraße und Flussweg); Zedernzapfen mit Initialen, Juno mit dem Tagebuch, Revanche gegen Jo (13_Wegenetz). Ergänzung: Auf der Kuppe eine Bank mit **Aussicht** auf beide Orte und die Brückenbaustelle nach Riverton (`aussichtKuppe`, Ansehen; Vorgeschmack auf Akt 2).                                                                |
| S5  | Maple Falls, Park Nordwesten: Steg am Ufer, neben dem Fußsteg zum Zedernpfad                                 | Absperrband der Stadt: „Steg morsch – wird erneuert“. Mr. Pratt: „Die Stadt hat kein Geld, ich hab keine Zeit.“                                                             | Bedingung `nadelMapleFalls ≥ 1` (die erste Clubnadel ist die von Maple Falls, Befund 8): Pratt hat den Steg am Wochenende selbst erneuert („Für Pokale baue ich alles“). Zustand `stegNeu`.                                | Ausblick auf den Wasserfall (`aussichtWasserfall`, vom Steg aus) und auf dem alten Pfosten am Ufer, den Pratt stehen lässt, eingeritzt **„M. W. + E. C. 1959“** (`fundInitialen`, Album). Mrs. Calloway erklärt es, wenn man sie danach anspricht: Sie und Margaret Whitlock haben es als Mädchen geritzt, „und danach über sechzig Jahre lang Karten gespielt“ (Befund 25). |
| –   | Cedar Creek Ostrand, Waldweg nach Riverton                                                                   | Brücke über den Bach im Bau                                                                                                                                                 | Ende von Akt 1 (`endeAkt1Gesehen`), wie heute                                                                                                                                                                              | Akt 2; die Aussicht auf der Kuppe (S2) zeigt die Baustelle schon vorher.                                                                                                                                                                                                                                                                                                     |

**Vorschläge mit Grund** (für mittel-2 und `13_Wegenetz.md`):

1. **Kühe über beide Karten** (S1): Die Quest „Die ausgebüxten Kühe“ führt dann an Apfelstand und
   Fährstein vorbei. Grund: Der Spieler läuft den langen Weg ohnehin, so lohnt sich jede Ecke.
2. **Vogelscheuche „Morphy“** (N1) und Adas dritte Vogelscheuche (N-W1) bleiben getrennt; Ada
   spottet: „Walt gibt seinen Vogelscheuchen Namen. Meine heißen Vogelscheuche.“ Grund: Zwei Höfe,
   zwei Temperamente, kein doppelter Inhalt.
3. **S5 statt eines eigenen Funds**: Die Initialen ersetzen das rote Ahornblatt unter der Eiche.
   Grund: Der Zeitrahmen bleibt bei höchstens 75 Minuten, und der Fund trägt mehr Geschichte
   (Mrs. Whitlock, Brücke zu Szene 2 und 3, ohne etwas über Ambrose zu verraten).
4. **Keine weitere Abkürzung am Flussweg.** Der Zedernpfad ist schon die Abkürzung von der
   Cedar-Creek-Seite; eine zweite wäre doppelt. Die alte Fährstelle bleibt Rätselort (N-W2).

## 6. Zeitbudget

| Ort                     | Neue Aufgaben (Minuten)     | Gebäude, Figuren, Funde (Minuten)  | Summe     |
| ----------------------- | --------------------------- | ---------------------------------- | --------- |
| Maple Falls             | 15–22 (N-MF1, N-MF2, N-MF3) | 5–8 (Diner, sechs Figuren, Funde)  | 20–30     |
| Landstraße und Flussweg | 8–11 (N-W1, N-W2)           | 3–5 (Obstwiese, Fährstelle, Funde) | 11–16     |
| Cedar Creek             | 15–21 (N-CC1, N-CC2, N-CC3) | 5–8 (Drechslerei, Figuren, Funde)  | 20–29     |
| **Akt 1 zusätzlich**    |                             |                                    | **51–75** |

Liegt ein Testlauf darüber, fallen zuerst N-MF3 und N-CC3 (die beiden Duelle) weg; dann bleibt der
Zusatz bei 40 bis 60 Minuten. Die längeren Wege selbst (Laufzeit nach 7a) sind hier nicht
mitgerechnet; sie gehören zum Maßstab. Kleine Aufgaben und Nebenorte (N1) fallen nicht unter die
Staffelzeiten von R40 (Akt 1: 3 bis 4 Stunden Hauptspiel); sie kommen obendrauf und werden mit
`spielzeitJeOrt` im ersten Testlauf nachgemessen (Befund 17). Die Sperren (Abschnitt 5) ändern die Summe nicht: S5 ersetzt
den Fund unter der Eiche, Aussicht und Gespräche an S1 und S2 dauern je unter einer Minute, und der
Kürbishof N1 ist in `13_Wegenetz.md` gezählt.

## 7. Was sich in den Ortsdokumenten ändert

**`orte/maple-falls.md`**

- Eingearbeitet am 9.11.2026 (Befund 23): Birch Lane 64 × 36; **Diner** auf der Nordseite, betretbar
  (`mapleFalls.diner`, 18 × 12, Tür Südwand, außen Fassade 9 mit Tür in der Südfassade); **Haus
  Calloway** auf der Südseite gegenüber dem Whitlock-Haus mit Veranda (Kulisse); Haus Hayes auf der
  Südseite mit Einfahrt; Spielplatz mit Sandkasten gegenüber der Schule; Fluss, Steg (S5) und
  Fußsteg zum Zedernpfad im Park nach Befund 5.
- Figuren: `mapleFalls.calloway`, `.sandoval` (Diner), `.kessler` (wandert, Birch Lane), `.pratt`
  (Schulhof), `.carla` (Haus Martínez), `.owen` (Spielplatz). Statisten „Briefträgerin“ und „Kind mit
  Ball“ werden zu Figuren; die Kellnerin im Diner bleibt Statist.
- Auslöser außen: `dinerTuer` (Übergang), `briefkastenWhitlock`, `blumenkasten`, `fahnenmast`,
  `sandkasten`, `fundBauer`, `reklame`, `fahrplan`; Park: `absperrungSteg` (S5, Zustand `stegNeu` ab
  `nadelMapleFalls ≥ 1`), dahinter `aussichtWasserfall` und `fundInitialen` am alten Pfosten,
  `schildZedernpfad` am Fußsteg; Mrs. Calloway bekommt danach einen
  Satz zu den Initialen.
- Auslöser im Diner: `dinerAusgang`, `jukebox`, `fotoSchule1962`, `tischsetWand`.
- Quests: `mapleFalls.tischset`, `mapleFalls.post`, `mapleFalls.carla`; Runde `mapleFalls.tischset`.

**`13_Wegenetz.md`** (Zedernpfad Q1, Stand von mittel-2 nachtragen): Bank mit `aussichtKuppe` auf
der Hügelkuppe; Mrs. Holm nennt den Sturm als Grund für S2; Mr. Dunmore statt Dex räumt den Stamm
(Befund 34); Kühe von N1 auf der Kuhweide und am Fährstein (Vorschlag 1 in Abschnitt 5).

**`orte/cedar-creek.md`** (Teil Cedar Creek)

- Gebäude: **Drechslerei Dunmore** am Westende der Hauptstraße, Nordseite, betretbar
  (`cedarCreek.drechslerei`, 16 × 11, Tür Südwand); **Kanuverleih** am Westufer des Baches südlich des
  Stegs (Kulisse); Haus Süd 1 mit Mrs. Holm.
- Figuren: `cedarCreek.dunmore`, `.quill` (mit Gegnerprofil), `.ashby` (Bibliothek), `.kettering` (Haltestelle),
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
  Statist), `.tessa` (heute Statist „Joggerin“, auf beiden Karten; Satz zu Okafor erst nach `okaforGetroffen`). Auslöser `apfelstand` (Figur),
  `schuppen`, `weidetor`, `fundHufeisen`. Quest `wegMapleCedar.vogelscheuche`.
- Flussweg: **alte Fährstelle** mit dem Stein der Fährleute und Fährpfosten am Ufer zwischen
  Münzen-Fund und Steg. Figur `wegMapleCedar.silas` (heute Statist „Angler“). Auslöser `faehrstein`,
  `faehrpfosten`, `fundKorken`. Quest `wegMapleCedar.faehrstein`, Runde `wegMapleCedar.faehrstein`.

**Funde** (`funde.json`, neu): `tischset` (Maple Falls), `schachkurier` (Maple Falls), `bauerPlastik`
(Maple Falls), `initialen` (Maple Falls), `ahornsirup` (Weg), `kiesel` (Weg), `hufeisen` (Weg),
`korken` (Weg), `zedernspringer` (Cedar Creek), `messingknopf` (Cedar Creek), `eisvogelfeder` (Cedar
Creek). Den „Zedernzapfen mit Initialen“ vergibt der Zedernpfad (`13_Wegenetz.md`, Q1).

**Entscheidungen des Haupt-Chats (9.11.2026, nach Regel 9 umgesetzt, Widerspruch genügt):**
(1) Neue Aufgaben tragen `klein: true` und zählen nicht für „alle Nebenquests“ (R27). (2) Mrs.
Whitlock heißt mit Vornamen Margaret. (3) Der Busfahrer raucht nicht; die Weltbeschreibung wird
beim Einarbeiten angepasst. (4) Die Wirtschaftssimulation läuft nach dem Einbau; liegt der sparsame
Spieler über 400 Münzen, sinken die Belohnungen der kleinen Aufgaben auf 5 bis 10. (5) Die Kühe auf
der Kuhweide sind die ausgebüxten Kühe vom Kürbishof Miller (N1); das verknüpft Weg und Nebenort.

**Nachtrag Runde 4 (Haupt-Chat, 9.11.2026):** Der Katalog hat keine Jukebox. Im Diner wird `jukebox`
zu `radio`: ein altes Röhrenradio auf dem Tresen, gleicher Satz („Lieder aus den Sechzigern, die
Schule wurde im selben Jahr gebaut“). Zwei statt vier Sitzecken, weil Nischenbänke fehlen.

**Nachtrag Runde 4 (Haupt-Chat, 9.11.2026), Park:** Der Katalog hat keine Halfpipe. Entscheidung: Im
Park entsteht ein kleiner Basketballplatz; Jo sitzt auf der langen Bank daneben und spielt dort Blitz
um Limo (eine Mauer gibt der Katalog nicht her). In Runde 5 werden alle Texte mit „Halfpipe“ (Story-Bibel Szenen 10 und 10a,
Dialoge, 09 Belebung) auf „Bank am Basketballplatz“ umgestellt. Fahnenmast und Wasserfall gibt es als
eigene Standbilder (`spiel/eigene/fahnenmast_schule.png`, `wasserfall_3hoch.png`).
