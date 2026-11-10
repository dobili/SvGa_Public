# 14 Leben für Ironwood, den Steinbruch, Weg W4 und Silicon Bay (Entwurf)

Stand: 9.11.2026, Entwurf von mittel-4 für den Haupt-Chat, nach dem Muster von `12_Akt1_Leben.md`.
Teil 2 der Ergänzung für Akt 2 (Teil 1, Riverton mit W2, W3 und Lockport, schreibt mittel-3). Anlass:
Nach dem Maßstab in `KARTENREGELN.md` 7a.2 wird Ironwood eine mittlere Stadt (80 × 60), Silicon Bay
eine große Stadt in zwei Vierteln (Campus 72 × 52, Hafen 64 × 40), der Weg W4 hat zwei Karten mit
zusammen etwa 305 Kacheln, und der Nebenort N3 (Alter Steinbruch) bekommt zwei eigene Karten. Dieses
Dokument füllt den Platz mit Leben, passend zur Geschichte. Lage in Kacheln: `orte/ironwood.md` und
`orte/silicon-bay.md`.

**Zuordnung:** Ironwood und N3 gehören zu Akt 2 (Staffel 1, Szenen 38 bis 50). W4 und Silicon Bay
gehören laut Story-Bibel zu Akt 3 (Staffel 2, Szenen 51 bis 61); sie stehen hier, weil sie an
Ironwood anschließen. Die Kapitelgrenze (13, Grundsatz 2) bleibt: Ironwood und N3 nutzen Kapitel 4
und 7, W4 und Silicon Bay Kapitel 1, 2 und 4.

Quellen: `05_Story_Bibel.md` (7 bis 24, Szenen 38 bis 62), `06_Regelwerk.md` (R13, R27, R30a, R39,
R40), `07_Aufgabenzuordnung.md` (Clubs 4 und 5), `08_Wege_und_Entdeckungen.md` (W2, W4, E1 bis E5,
G1), `09_Weltbeschreibung.md` (4, 4a, 5.5, 5.6), `11_Karten_und_Gegenstaende.md` (7.1, 7.3),
`13_Wegenetz.md` (3, 4, 7), `12_Akt1_Leben.md` (Grundsätze), der Prüfbericht
`pruefberichte/2026-11-09_akt1_wegenetz.md`, `orte.json`, `quests.json`, `funde.json`.

## 0. Grundsätze

Es gelten die Grundsätze aus 12, Abschnitt 0, unverändert:

1. **Nichts an den Hauptszenen ändert sich.** Keine neue Figur weiß vor der zuständigen Hauptszene
   etwas über Mamas Vergangenheit (bis Szene 39 nichts, bis Szene 43 nichts über das Finale und
   das Versteck), über den Brief von Hale (Szene 41), über Novas Gerät (Szene 56) oder über die
   Vitrine der Hales (Szene 57). Andeutungen ja, Auflösungen nein. Jede Figur hat deshalb Sätze
   **vor** und **nach** der Szene, die ihr Wissen freigibt.
2. **Kleine Aufgaben** tragen `klein: true`: Sie zählen nicht für „alle Nebenquests einer Stadt“
   (R27, Springervorgabe) und geben **keine Karte** (Befund 12). Nebenorte geben höchstens eine
   leichte Karte für den ganzen Ort; N3 gibt keine (13 §3).
3. **Belohnungen:** Münzen (5 bis 15 je Aufgabe), Funde fürs Album, Spuren in der Welt.
4. **Schach im Alltag:** Jede Aufgabe hat einen Schachbezug zum Kapitel des Ortes (Ironwood und N3:
   Fesselung, Spieß, hängende Figuren, Kapitel 4 und 7; W4 und Silicon Bay: drei Ziele und
   Todsünden der Eröffnung, Zählen, Fallen, Kapitel 1, 2 und 4). Buchbezug im Dialog nur mit Kapitel
   und Abschnitt, nie mit Seiten.
5. **Lieber wenige gute Häuser als viele leere:** Kein neuer Innenraum in Ironwood und Silicon Bay;
   neu sind nur die Außenkarte `siliconBay.hafen` und die zwei Karten des Steinbruchs.
6. **Pronomen:** Bei {held} immer neutral (Bibel 5.2); Big Joe und Mr. Kerrigan sagen „Kumpel“.

## 1. Ironwood

Außenkarte 80 × 60 mit Werk, Elm Street, Hauptstraße und Bahngelände (`orte/ironwood.md`, 1.1).
Neuer Platz geht an: die Elm Street mit Nachbarschaft (Mrs. Brody, Kreidekinder), das Werkstor mit
Pförtner, den Platz am alten Bahnsteig mit Lok (Mr. Flores), den Kai mit Lastkahn und den Weg zum
Steinbruch.

### 1.1 Neue Nebenfiguren

| Figur                      | Alter, Pronomen  | Hintergrund (ein Satz)                                                                                                            | Platz (Karte)                                                    | Tagesablauf (Tönung je Szene, keine Uhrzeit)                                                           |
| -------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Walt Kerrigan              | 63, er           | Pförtner am Werkstor seit 1993, schreibt jeden auf, der hineingeht, und kennt alle Schichten auswendig.                           | aussen: Pförtnerhaus am Werkstor (62, 24)                        | Morgens Schichtwechsel mit Klemmbrett, tagsüber Kreuzworträtsel, abends Lampe im Häuschen.            |
| Agnes Brody                | 74, sie          | Nachbarin von Oma Ruth in der Elm Street Nr. 8, heizt noch mit Kohle und fegt jeden Morgen den Gehweg bis zur Treppe.             | aussen: Elm Street und Kohlenhof (läuft hin und her)             | Morgens fegen, mittags zwei Eimer Kohle holen, abends am Fenster.                                     |
| Mila und Benny Larsen       | 10, sie; 8, er   | Geschwister aus der Elm Street, malen jeden Tag ein Schachbrett mit Kreide auf den Gehweg und spielen mit Kronkorken.             | aussen: Kreidebrett auf dem Gehweg Süd der Elm Street (30, 15)   | Nach der Schule am Kreidebrett, bei Regen unter dem Vordach der Kneipe, abends ruft ihre Mutter.     |
| Rocco Bellini              | 52, er           | Kantinenkoch seit dreißig Jahren, kocht jeden Tag denselben Eintopf und behauptet jeden Tag, er sei heute besser.          | kantine: hinter der Essensausgabe (5, 3)                         | Morgens Kartoffeln, mittags Ausgabe, nachmittags wischt er die Tische, beim Clubabend Kaffee.        |
| Ignatius „Iggy“ Flores     | 77, er           | War Schaffner im letzten Personenzug, der in Ironwood hielt, und füttert seitdem am alten Bahnsteig die Tauben.                    | aussen: Bank am Platz neben der Lok (20, 43)                     | Vormittags Tauben, mittags schläft er auf der Bank, nachmittags erklärt er Kindern die Lok.         |

Statisten aus 09 (4a), die bleiben: Schichtwechsel (Gruppe), Frau trägt Kohle (wird Mrs. Brody),
Kinder mit Kreide (werden Mila und Benny), Mann füttert Tauben (wird Mr. Flores), Kantinenkoch (wird
Rocco). Neu als Statisten: Gabelstapler im Werkhof, Rangierer am Güterschuppen, Lieferwagen an der
Schranke.

Sprechweise und Beispielsätze:

- **Mr. Kerrigan:** amtlich, kurz, nennt alle „Kumpel“ wie Big Joe. Vor Szene 38: „Gäste erst zum
  Turnier, Kumpel. Der Zettel hängt noch nicht.“ – Immer: „Meine Tochter rechnet in Silicon Bay
  für die. Ruft jeden Sonntag an. Sagt, da riecht nichts.“ – Nach Szene 49: „Dreiunddreißig Jahre
  Tor. Und dann tragen sie die Pokale in einem Karton raus.“
- **Mrs. Brody:** spricht beim Fegen, ohne aufzusehen. Vor Szene 39: „Das Eckhaus? Sauberste
  Gardine der Straße. Frag nicht, wie.“ – „Kohle ist ehrlich. Gibt Wärme und
  Dreck, und beides siehst du.“ – Nach Szene 39: „Laurie! Die hat hier mit Kreide Bretter auf den
  Gehweg gemalt. Genau da, wo die Kleinen jetzt sitzen.“
- **Mila:** ernst, erklärt gern. „Das Kreidebrett hat ein Feld zu viel. Das ist für den König, wenn
  er sich verstecken muss.“ **Benny:** „Kronkorken von Cola sind Türme. Von Limo sind es Bauern.“
- **Rocco:** laut, warm, Küchenwörter. Nach Szene 39, vor Szene 43: „Frag Joe nicht nach der Lücke im Regal. Er
  wird dann so still, dass mir der Eintopf anbrennt.“ – „Eintopf ist wie eine Fesselung: Was drin
  ist, bleibt drin.“ – Nach Szene 43: „Laurie hat immer zwei Teller gegessen. Vor jedem Finale.“
- **Mr. Flores:** langsam, mit Pfiff am Satzende. „Letzter Zug nach Riverton, 1979. Ich hab
  ‚Einsteigen bitte‘ gerufen, und keiner ist mehr eingestiegen.“ – Nach Szene 41: „Teague hat endlich
  einen Sack aufgemacht? Ich hab's ihm immer gesagt: Wer die Post nicht aufmacht, kriegt nie eine
  Antwort.“

### 1.2 Neue Nebenaufgaben

**N-IW1 Das Kreidebrett** · `raetsel` · `ironwood.kreidebrett` (klein)

- **Figur und Ort:** Mila und Benny am Kreidebrett auf der Elm Street (Auslöser `kreidebrett`, heute
  ein Gegenstand, wird der Start der Quest).
- **Ablauf:** (1) Die Kinder streiten, ob Bennys Kronkorken-Läufer „weg darf“. (2) Aufgabenrunde
  `ironwood.kreidebrett` mit `anzahl` 2, Thema `fesselung` (R30a; Kapitel 4, Fesselung; Kapitel 7,
  Abschnitt 7.2). (3) Mila malt ein zweites Brett daneben, „für dich, wenn du wiederkommst“
  (Objekt mit Bedingung, Spur in der Welt).
- **Belohnung:** 10 Münzen, Fund „Kreidestummel“ (`kreidestummel`, Album).
- **Zeit:** 3 bis 5 Minuten. **Voraussetzung:** keine (Kapitel 4 ist seit Riverton bekannt).

**N-IW2 Die Henkelmänner** · `hilfe` · `ironwood.henkelmann` (klein)

- **Figur und Ort:** Rocco in der Kantine.
- **Ablauf:** (1) Der Werksbote ist krank; Rocco bittet, drei Henkelmänner (Essensbehälter aus
  Blech) auszutragen. (2) Zu Mr. Kerrigan ins Pförtnerhaus, (3) zu Edna ans Eisenwarenfenster („Das hält
  warm.“), (4) zu Gus am Güterbahnhof. Gus öffnet den Deckel nicht, bevor {held} eine Aufgabe
  löst: Auf seinem Brett steht ein Spieß; „Welche Figur fällt, wenn die vordere weicht?“
  (Aufgabenrunde `ironwood.gusSpiess` mit `anzahl` 1, Thema `spiess`, Steller Gus; Kapitel 7,
  Spieß; Prüfbericht Akt 2, Befund 7). (5) Zurück zu Rocco.
- **Belohnung:** 15 Münzen, Fund „Roccos Eintopfrezept“ (`eintopfrezept`, Album, „das Geheimnis
  ist: kein Geheimnis“).
- **Zeit:** 6 bis 8 Minuten (nutzt Werkhof, Hauptstraße und Bahnübergang).
- **Voraussetzung:** nach Szene 39 (die Kantine ist offen, Rocco kennt {held}).

**N-IW3 Die Schaffnerpfeife** · `begegnung` · `ironwood.iggy` (klein)

- **Figur und Ort:** Mr. Flores auf der Bank an der Lok.
- **Ablauf:** (1) Mr. Flores erzählt vom letzten Personenzug und zeigt seine Lochzange. (2) Früher
  hat er Schaffnern im Zug Schachaufgaben auf Fahrkarten gestanzt; eine hat er noch: Zwei schwarze
  Figuren stehen auf einer Linie, ein weißer Turm davor. „Was hält den Läufer fest? Einsteigen bitte!“
  (Aufgabenrunde `ironwood.fahrkarte` mit `anzahl` 1, Thema `fesselung`, Steller Mr. Flores;
  Kapitel 4, Abschnitte 4.5 und 4.6.) (3) Bei
  richtiger Antwort pfeift er auf seiner alten Pfeife und schenkt sie {held}.
- **Belohnung:** 10 Münzen, Fund „Schaffnerpfeife“ (`schaffnerpfeife`, Album).
- **Zeit:** 3 bis 4 Minuten. **Voraussetzung:** keine.

### 1.3 Gebäude

| Gebäude                     | Status                | Figur                   | Dinge zum Ansehen (Auslöser `gegenstand`)                                                                                     |
| --------------------------- | --------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Kantine (Werkhof)           | vorhanden, betretbar  | Big Joe, Hank, Priya, + Rocco | `pokalregal`, `stahlbrett`; neu `schichtplan`, `kaffeemaschine`, `fotoMannschaft` (09, 5.5)                            |
| Haus von Oma Ruth           | vorhanden, betretbar  | Oma Ruth                | `medaille`, `partieformular2001`; neu `telefon` („Sonntags. Immer.“)                                                 |
| Umkleide                    | vorhanden, betretbar  | –                       | `schliessfach`; neu `helm` („Ein Helm mit Namen: ‚H. M.‘. Hank vergisst ihn jede Woche.“)                                     |
| Heimatmuseum                | vorhanden, betretbar  | Mr. Teague              | `postsack`, `vitrine1858`, `fundGlasfunke`; neu `fotoBruecke` (Brücke im Bau, keine Namen)                                    |
| Eisenwaren Edna             | Kulisse mit Fenster   | Edna                    | `eisenwarenfenster` (Laden)                                                                                                   |
| Pförtnerhaus                | Kulisse               | Mr. Kerrigan                | Kerrigan selbst; nach N-SB3 hängt Kendras Postkarte im Fenster                                                                    |
| Kneipe „Zum Hochofen“       | Kulisse               | –                       | Leuchtschild „Zum Hoch“ (Ansehen `leuchtschild`)                                                                              |
| Kirche St. Barbara          | Kulisse               | –                       | Barbara-Figur mit Grubenlampe (Ansehen `barbara`, „Sie passt auf die auf, die im Dunkeln arbeiten.“)                           |
| Lok am Platz                | Kulisse               | Mr. Flores              | Schild „Nicht klettern“                                                                                                       |
| Parkplatz                   | Kulisse               | –                       | `pickup`: Big Joes Pickup mit Kranhaken am Spiegel („Da hängt ein Kranhaken. Natürlich.“)                                     |

### 1.4 Funde und Entdeckungen

Abschnitte wie im Ortsplan (`orte/ironwood.md`, 1.2). Funde fett.

| Abschnitt          | Entdeckung                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| B1 Treppe          | `aussichtTreppe` (neu): „Das Werk atmet. Siehst du den Rauch?“ (Ambrose: „Eine Stadt, die arbeitet. Das gefällt mir.“)                          |
| B2 Laden und Gasse | Kreidebrett (N-IW1), Eisenwarenfenster                                                                                                           |
| C1 Elm Street Ost  | Mrs. Brody, Spitzengardine von Nr. 10 (vor Szene 39 nur Ansehen)                                                                                 |
| D2 Werkstor        | **„Stahlperle“** im Rinnstein vor dem Tor (`fundStahlperle`, 5 Münzen; Juno: „Sieht aus wie ein Bauer, der zu heiß gebadet hat.“)               |
| A3 Brücke          | `nietenBruecke` (neu, Ansehen: „J. H.“; Juno vor Szene 50: „Schon wieder J. H. Wer baut hier eigentlich alles?“); **„Essensmarke aus Messing“** unter der Bank im Wartehäuschen (`fundEssensmarke`, Album; Ambrose: „Messing gegen Suppe. Ein ehrlicher Handel.“) |
| B3 Alter Bahnhof   | Mr. Flores (N-IW3), Uhrturm (Ansehen: „Zwanzig nach vier. Seit 1979.“)                                                                           |
| D3 Parkplatz       | `pickup`                                                                                                                                         |
| D4 Gus             | (Gus, Szene 45)                                                                                                                                  |
| E4 Steinbruchweg   | Gittertor mit Schild (Ansehen), Blick auf die Bruchkante                                                                                          |

Für die Entdecker-Nadel (E5) zählen wie in Teil 1 nur die Funde aus der Bibel (Abschnitt 12 dort);
alle neuen Funde hier (Stahlperle, Essensmarke und die Funde aus kleinen Aufgaben) sind Zugabe fürs
Album (Prüfbericht Akt 2, Befund 6).

## 2. Nebenort N3: Alter Steinbruch

Zwei Karten (`orte/ironwood.md`, 1.4): Grube 70 × 50 und Stollen 40 × 24. Aus 13 §3 übernommen:
Thema, Figuren, drei Nebenquests, Gewinn (Fund „Mamas altes Steckschach“, Fragment-Hinweis, 30
Münzen, keine Karte). Hier ausgearbeitet und gegen die Hauptgeschichte geprüft.

### 2.1 Figuren

| Figur                   | Alter, Pronomen | Hintergrund (ein Satz)                                                                                                    | Platz                                         |
| ----------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Mr. Amos Hargrove       | 81, er          | Letzter Vorarbeiter von „Hargrove & Söhne“, gegründet 1868 von seinem Urgroßvater; kommt jeden Tag, obwohl nichts mehr bricht. | Grube: Bank vor der Bude (52, 9)        |
| Lena Sato               | 38, sie         | Fotografin, macht ein Buch über Ironwood, „bevor es sich ändert“, und fotografiert seit drei Wochen dasselbe Wasserloch.    | Grube: Aussichtspunkt (24, 9)                 |
| Ruby und Jesse          | 11, sie; 10, er | Kinder von Stahlwerkern mit Taschenlampen, mutig bis zum Stollenmund und keinen Schritt weiter.                            | Grube: am Stollenmund (54, 43)                |

- **Mr. Hargrove:** „Stein bricht da, wo er schwach ist. Bretter auch.“ (13) – „Mein Urgroßvater hat
  den Granit für die Brücken geliefert. Die stehen noch. Er nicht.“
- **Lena:** „Ich warte, bis der Himmel im Wasser schöner ist als oben. Kann dauern.“ – Nach Szene 43:
  „Big Joe sagt, hier hat mal ein Mädchen jeden Tag allein Schach gespielt. Gibt es davon ein Foto?“
- **Ruby:** „Da drin ist es so dunkel, dass die Taschenlampe Angst kriegt.“ **Jesse:** „Wenn du
  rufst, ruft es zurück. Aber falsch.“

### 2.2 Nebenaufgaben (alle `klein: true`)

**N-ST1 Die Lorenbahn** · `raetsel` · `steinbruch.lorenbahn`

- **Figur und Ort:** Mr. Hargrove; das Lorengleis mit drei Weichen auf der Sohle.
- **Ablauf:** (1) Hargrove will die letzte Lore zur Brechanlage schicken, „damit sie nicht im
  Stollen verrostet“. An jeder Weiche hängt eine Lore fest, wenn der falsche Weg frei ist. (2)
  Aufgabenrunde `steinbruch.lorenbahn` mit `anzahl` 3, Themen `spiess` und `haengend` (Kapitel 4 und
  7; die Weichen sind nur Dialog: Jede gelöste Aufgabe stellt eine Weiche, 13 Grundsatz 8). (3) Die
  Lore rollt zur Brechanlage (Objekt wechselt die Lage).
- **Belohnung:** 15 Münzen. Hargrove zeigt danach sein Lieferbuch von 1868 mit dem Eintrag
  „Granit für die Kanalbrücke, 1868, abgenommen: J. H.“ (Ansehen, ohne Beruf, Schach oder
  Notizbuch); Ambrose schweigt (`#pause`). Die Lore hat an der Brechanlage einen alten Granitblock
  freigelegt, in den jemand Züge in alter Notation geritzt hat („Kt …“, wie auf dem Partieformular
  vom Landweg). Das ist der **Fragment-Hinweis** (Album-Eintrag „Geritzte Züge“ ohne Halbzüge,
  13 Grundsatz 9), ohne Bezug zu Hale. Ambrose: „Kt. So schrieb man den Springer, als ich jung
  war.“ (Prüfbericht Akt 2, Befund 1: J. H. löst die Bibel erst auf W6 auf, das Notizbuch in
  Szene 57.)
- **Zeit:** 5 bis 7 Minuten.

**N-ST2 Mamas Versteck** · `begegnung` · `steinbruch.mamasVersteck`

- **Voraussetzung:** Szene 43 gesehen (`mamaSpielt`), dazu die Laterne für den Stollen (S4).
- **Auslöser:** Nach Szene 43 erzählt Big Joe in der Kantine: „Laurie war jeden Tag im alten
  Steinbruch. Allein. Hat gesagt, da ist es so leise, dass man die Figuren denken hört. Im Stollen
  hatte sie ein Versteck.“ (Befund 3: erst nach `mamaSpielt`.)
- **Ablauf:** (1) Im Stollen den Seitengang zur Nische finden. (2) Unter einem losen Stein liegt eine
  Blechdose mit einem kleinen Steckschach; im Deckel steht mit Filzstift „L. M. – nur für mich“. (3)
  Zu Hause zeigt {held} es Mama (Dialog im Wohnzimmer von Maple Falls). Mama: „Das hab ich gesucht,
  als ich weggezogen bin. Und dann wollte ich es nicht mehr finden.“ Ohne Schach (13).
- **Belohnung:** 10 Münzen, Fund **„Mamas altes Steckschach“** (`mamasSteckschach`, Album). Im
  Wohnzimmer steht es danach neben Mamas Turnierfoto auf der Anrichte (Platzhalter 13 §7.4).
- **Zeit:** 5 bis 6 Minuten.

**N-ST3 Das Echo** · `begegnung` · `steinbruch.echo`

- **Ort:** Kaverne im Stollen (Laterne).
- **Ablauf:** (1) {held} ruft einen Zug in die Kaverne („Springer f3!“), das Echo kommt zurück, aber
  verdreht („… f6!“). (2) Ambrose: „Ein Gegner, der jeden Zug spiegelt. So spielte man in meinem
  Kaffeehaus gegen Anfänger: Man ahmte sie nach, bis sie den Faden verloren.“ (3) Jesse hatte recht:
  „Es ruft falsch zurück.“ Ansehen, ohne Aufgabe (13).
- **Belohnung:** 5 Münzen.
- **Zeit:** 1 bis 2 Minuten.

**Gewinn N3** zusammen: 30 Münzen, Fund „Mamas altes Steckschach“, Fragment-Hinweis „Geritzte
Züge“; keine Karte (13 §3).

### 2.3 Funde und Entdeckungen

| Abschnitt     | Entdeckung                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------- |
| G1 Zufahrt    | Schild „Hargrove & Söhne, gegr. 1868“ (Ansehen `schildHargrove`)                                   |
| G2 Aussicht   | `aussichtGrube`: der Himmel im Wasserloch; Lena                                                    |
| G3 Bude       | Mr. Hargrove (N-ST1)                                                                               |
| G4 Brechanlage | Lore am Prellbock, nach N-ST1 die zweite Lore daneben und der freigelegte Granitblock mit geritzten Zügen (Fragment-Hinweis) |
| G5 Wasserloch | flache Steine (`steine`, Ansehen: „Vier Sprünge. Ambrose sagt, er hätte fünf geschafft.“)          |
| G6 Stollenmund | Ruby und Jesse, Graffiti-Wand „Ironwood 1980“ (Ansehen; keine Namen, die in der Geschichte vorkommen) |
| Stollen       | `lampenhaken`, Nische (N-ST2), Echo (N-ST3)                                                        |

## 3. Weg W4: Raststätte und Glasbrücke (Akt 3)

Zwei Karten (`orte/silicon-bay.md`, 1.1 und 1.2). Bestehende Stationen bleiben: Rätseltafel am
Kaffeeautomaten (3 Eröffnungsfallen), Fernfahrerin Mrs. Kowalczyk mit Weisheit, Joggerin mit
Stellungsduell 3 + 2, Funde „Werbe-Anstecker ZERO“ und „verlorener Ohrstöpsel“.

### 3.1 Neue Nebenfiguren

| Figur              | Alter, Pronomen | Hintergrund (ein Satz)                                                                                     | Platz                                   |
| ------------------ | --------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Lonnie Briggs      | 58, er          | Fährt die Linie Ironwood–Raststätte seit zwanzig Jahren; in die Stadt darf sein alter Bus nicht mehr.       | Ironwood Haltestelle; Raststätte Busbucht |
| Bertram Oakes      | 70, er          | Zählt seit vierzig Jahren die Vögel im Watt und schreibt sie mit Bleistift in ein Heft.                    | Raststätte: Vogelhütte (68, 22)          |
| Skye Marlow        | 26, sie         | Die Joggerin mit Smartwatch (heute `wegIronwoodSilicon.joggerin`), Programmiererin, läuft jeden Tag eine Runde über die Brücke. | Glasbrücke                    |

- **Mr. Briggs:** Vor Szene 50 in Ironwood: „Silicon Bay? Ohne Einladung lassen die dich nicht mal
  aussteigen.“ An der Raststätte: „Weiter fahr ich nicht. Die Stadt da vorne lässt keine alten Busse
  rein. Zu laut, sagen sie.“
- **Mr. Oakes:** „Hier zähle ich hundert Vögel am Tag. Hinter der Brücke zähle ich keinen. Ich hab
  nachgesehen.“
- **Skye:** „Schach? Gern. Aber schnell. Meine Uhr sagt, ich hab noch eine Runde.“

### 3.2 Neue Nebenaufgabe

**N-W4a Vögel zählen** · `begegnung` · `wegIronwoodSilicon.voegel` (klein)

- **Figur und Ort:** Mr. Oakes in der Vogelhütte (Abzweig 1 der Raststätte).
- **Ablauf:** (1) Oakes erklärt, dass zwei Möwen einen Fisch angreifen, den ein Reiher und ein
  Austernfischer verteidigen. (2) Er fragt in Worten, ohne Brett: „Zwei greifen an, zwei verteidigen,
  und die Angreifer schlagen zuerst. Wer behält den Fisch?“ (Wahl im Dialog mit genau einer
  richtigen Antwort: die Verteidiger, weil sie als Letzte zurückschlagen; Oakes erklärt es danach
  in einem Satz. Kapitel 1, Zählen von Angreifern und Verteidigern.) (3) Oakes trägt {held} als „Gast,
  Schachspieler“ in sein Heft ein.
- **Belohnung:** 10 Münzen, Fund „Vogelliste mit Bleistift“ (`vogelliste`, Album).
- **Zeit:** 3 bis 4 Minuten.

### 3.3 Funde und Entdeckungen

| Karte, Abschnitt     | Entdeckung                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| Raststätte R1        | (**Werbe-Anstecker ZERO** am Picknicktisch), Mr. Briggs                                                |
| Raststätte R2        | (Rätseltafel am Kaffeeautomaten)                                                                       |
| Raststätte R3        | (Mrs. Kowalczyk), Wegweiser am Pfadbeginn                                                              |
| Raststätte R4        | Austernfischer, Radfahrer                                                                              |
| Raststätte R5        | Vogelhütte (N-W4a)                                                                                     |
| Raststätte R6        | `aussichtDuene` (neu): Pelikaninsel, Glastürme (Ambrose: „So viel Licht, und kein einziges Fenster steht offen.“) |
| Raststätte R7, R8    | Möwen am Priel, Krebsspuren; Ortsschild                                                                |
| Glasbrücke B1–B3     | letzte Möwe, Schild „Smart City“, (**Ohrstöpsel** unter der Glasbank)                                  |
| Glasbrücke B4        | `aussichtPlattform` (neu): Autobahnkreuz und Campus                                                    |
| Glasbrücke B5–B7     | (Skye, Stellungsduell), Lieferroboter, Werbetafel ZERO                                                  |

## 4. Silicon Bay (Akt 3)

Zwei Viertel: Campus (`siliconBay.aussen`) und Hafen (`siliconBay.hafen`, neu). Neuer Platz geht
an: Straßenbahn mit Fahrerin, Wachmann auf dem Platz, eine Analystin aus Ironwood, das alte
Hafenviertel mit dem leeren Laden und dem Fährmann der Inselfähre.

### 4.1 Neue Nebenfiguren

| Figur              | Alter, Pronomen | Hintergrund (ein Satz)                                                                                                          | Platz                                          | Tagesablauf                                                              |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| Priscilla „Cilla“ Yu | 58, sie       | Fährt die Straßenbahn seit dem ersten Tag und hat als Einzige noch einen Fahrplan aus Papier, „falls der Strom ausfällt“.        | Campus: Endhaltestelle (63, 27)               | Pause an der Endhaltestelle, dann eine Runde (Straßenbahn als Objekt).  |
| Ellis Navarro        | 41, er          | Wachmann des Campus, bewacht Bildschirme und verliert in jeder Pause auf dem Handy gegen ZERO.                                   | Campus: Runde über den Boulevard              | Tagsüber Runde, nachts im Hotel-Eingang (Szene 61, Statist).             |
| Kendra Kerrigan        | 29, sie         | Datenanalystin bei Perfect Move, Tochter von Mr. Kerrigan aus Ironwood, hat seit einem Jahr keinen freien Tag bekommen.               | Campus: Stufe vor dem Innovation Lab (7, 47)  | Mittagspause auf der Stufe, sonst hinter der Glasscheibe.                |
| Wendell Ames       | 79, er          | Hatte den Kurzwarenladen am Hafen seit 1952 (vom Vater), hat ihn nie an Perfect Move verkauft und hängt jede Woche „Bald geöffnet“ neu ins Fenster. | Hafen: Kiste vor dem Laden (20, 16) | Sitzt vor dem Laden, sieht aufs Wasser, schließt abends die leere Tür ab. |
| Silas Pike         | 66, er          | Fährmann der Inselfähre, fährt „nur sonntags“ und sagt nie, welcher Tag heute ist (Sperre S6).                                   | Hafen: Fährhäuschen (58, 21)                  | Flickt Seile, bis die Fähre fährt.                                      |

Sprechweise und Beispielsätze:

- **Cilla:** fröhlich, Fahrplanwörter. „Linie 1, Akademie, Endstation. Alle aussteigen, auch die
  Roboter.“ – „Die Frau Doktor von der Akademie fährt jeden Morgen mit. Sie löst Aufgaben auf
  Papier. Die einzige außer mir.“ (Dr. Lin als ehrliche Spielerin, Vorbereitung Akt 4, ohne
  Geheimnis.)
- **Ellis:** gelangweilt, ehrlich. „Ich bewache Bildschirme. Die laufen nicht weg.“ – „Hundertzwölf
  zu null für ZERO. Ich zähl mit, damit ich nicht vergesse, dass ich noch spiele.“
- **Kendra:** schnell, müde, mit Ironwood im Satz. „Du warst in Ironwood? Riecht es am Werkstor noch
  nach heißem Eisen? Hier riecht nichts.“ – „Sag Papa nicht, dass ich müde aussehe.“ (Kein Wort über
  Novas Zahlen oder die Geräte; das gehört Szene 56.)
- **Mr. Ames:** langsam, Hafenbilder. „Bald geöffnet. Hab ich selbst hingehängt. Man soll die
  Hoffnung nicht in den Keller räumen.“ – Ab Akt 4: „Eine Frau von der Akademie fragt jede Woche, ob der
  Laden noch frei ist. Ich sag immer: Bald.“ (Andeutung auf Dr. Lins Club im Post-Game, 13 §7.2.)
- **Mr. Pike:** einsilbig. „Sonntags.“ – „Heute? Frag den Pelikan.“ – Nach der Nadel: „Ist
  Sonntag. Steig ein.“

### 4.2 Neue Nebenaufgaben

**N-SB1 Der Papierfahrplan** · `hilfe` · `siliconBay.fahrplan` (klein)

- **Figur und Ort:** Cilla an der Endhaltestelle.
- **Ablauf:** (1) Der Wind hat drei Seiten von Cillas Papierfahrplan über den Campus geweht. (2) Eine
  liegt am Wasserspiel, eine an Rosies Food-Truck (Rosie hat sie unter den Salzstreuer gelegt), eine
  unten im Hafen bei Mr. Ames, der sie glattstreicht. (3) Auf der Rückseite der letzten Seite hat
  Cilla notiert: „Schwarz holt im dritten Zug die Dame raus und lässt den König in der Mitte.
  Welches der drei Ziele fehlt am meisten?“ Die Frage steht in Worten, ohne Brett (Wahl im Dialog
  mit genau einer richtigen Antwort: König in Sicherheit; Cilla erklärt es in einem Satz. Kapitel 1,
  drei Ziele und vier Todsünden; dieselbe Frage stellt Dr. Lin in der Bibel, 18.2.)
- **Belohnung:** 15 Münzen, Fund „Fahrplan auf Papier“ (`papierfahrplan`, Album).
- **Zeit:** 6 bis 8 Minuten (führt durch beide Viertel).

**N-SB2 Hundertzwölf zu null** · `begegnung` · `siliconBay.ellis` (klein)

- **Figur und Ort:** Ellis auf dem Boulevard.
- **Ablauf:** (1) Ellis zeigt seine letzte Partie gegen ZERO auf dem Handy: Er ist in eine bekannte
  Falle gelaufen. (2) „Welcher Zug war der Fehler?“ (Aufgabenrunde `siliconBay.ellisFalle` mit `anzahl`
  1, Thema `falle`, Steller Ellis; Kapitel 4, Fallen, Warnsignale; Prüfbericht Akt 2, Befund 7). (3) Ellis kauft danach bei Rosie ein Taschenschach und spielt in der
  Pause gegen sich selbst (Objekt: Taschenschach auf der Bank vor dem Truck). Ambrose, der in
  Silicon Bay gebannt auf die Bildschirme sieht (Bibel 18.1), sagt nur: „Er hat aufgehört zu zählen,
  wie oft er verliert. Gut.“
- **Belohnung:** 10 Münzen.
- **Zeit:** 3 bis 4 Minuten.

**N-SB3 Post nach Ironwood** · `hilfe` · `siliconBay.kendra` (klein, Rückweg)

- **Figur und Ort:** Kendra auf der Stufe vor dem Innovation Lab; Ziel Mr. Kerrigan in Ironwood.
- **Ablauf:** (1) Kendra kann nicht nach Hause und gibt {held} eine Postkarte mit einem Glasturm für
  ihren Vater. Auf der Rückseite hat sie eine Eröffnungsfalle gezeichnet, „in die Papa jedes Mal
  reintappt“. (2) Zu Fuß über Glasbrücke und Küstenpfad zur Raststätte, mit dem Bus
  (`zurueckIronwood`) nach Ironwood, zum Pförtnerhaus; in der Stadt fährt kein Bus (Bibel 19.1). (3) Kerrigan
  liest, lacht und tappt wieder hinein; {held} löst die Falle für ihn (Aufgabenrunde
  `ironwood.kendrasFalle` mit `anzahl` 1, Thema `falle`, Steller Mr. Kerrigan; Kapitel 4, Fallen). (4) Kerrigan hängt die Postkarte ins Fenster des Pförtnerhauses (Spur in der Welt).
- **Belohnung:** 15 Münzen, Fund „Postkarte mit Glasturm“ (`postkarteGlasturm`, Album).
- **Zeit:** 5 bis 7 Minuten ohne die Fahrt.
- **Voraussetzung:** nach Szene 55 (erster Tag in der Akademie). Lohn des Rückwegs nach 13 §0.5.

### 4.3 Gebäude

| Gebäude                  | Status                   | Figur                 | Dinge zum Ansehen                                                                                     |
| ------------------------ | ------------------------ | --------------------- | ----------------------------------------------------------------------------------------------------- |
| Akademie                 | vorhanden, betretbar     | Dr. Lin, Nova, Theo   | neu `rangliste`, `dreiZiele`, `glaspokal` (09, 5.6)                                                   |
| Serverraum               | vorhanden, betretbar     | –                     | `schummelgeraete`                                                                                     |
| Lobby (Konzernturm)      | vorhanden, betretbar     | Empfangsroboter, Victor | `vitrineHale`; neu `zeitleiste` (Firmengeschichte, nur der Name „Hale“, keine Jahreszahl 1858)       |
| Hotel Bayview            | Kulisse                  | –                     | `hotel` (Szene 61)                                                                                    |
| Food-Truck               | Kulisse, Laden           | Rosie, Dash           | Laden von Rosie (Bibel 18.2, 22)                                                                      |
| Ames Kurzwaren           | Kulisse (leerer Laden)   | Mr. Ames              | `schaufenster` (ein Holzbrett, Zettel „Bald geöffnet“)                                                |
| Fischhalle               | Kulisse                  | –                     | `netze`                                                                                               |
| Perfect Move Store       | Kulisse                  | –                     | Bildschirm mit Novas Gesicht (Ansehen: „Mit Perfect Move trainiert jeder wie ein Champion!“, ihr Werbesatz aus 9.2) |
| Fährhäuschen             | Kulisse                  | Mr. Pike             | Fahrplan „Pelikaninsel – sonntags“                                                                    |

### 4.4 Funde und Entdeckungen

| Viertel, Abschnitt   | Entdeckung                                                                                                                         |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Campus A2            | (Rosie, Dash)                                                                                                                      |
| Campus B2, C2        | Ellis (N-SB2), Lieferroboter (`roboter`, Szene 53)                                                                                 |
| Campus D2            | Cilla (N-SB1), Infosäule mit Stadtplan                                                                                             |
| Campus A3            | Kendra (N-SB3)                                                                                                                     |
| Campus B3            | **„Kastanie im Kübel“** (`fundKastanie`, 5 Münzen; Ambrose: „Eine Kastanie. Irgendwo in dieser Stadt hat doch ein Baum überlebt.“) |
| Campus D3            | `aussichtBucht`: Fähren und Pelikaninsel                                                                                           |
| Hafen B1             | Mr. Ames, Schaufenster                                                                                                             |
| Hafen C2             | `fernrohr` (Pelikaninsel); **„Seeglas, grün“** an der Kaikante (`fundSeeglas`, 5 Münzen; Ambrose: „Glas, das das Meer rund geschliffen hat. Das einzige Glas hier, das mir gefällt.“) |
| Hafen D1, D2         | Mr. Pike, Inselfähre (S6)                                                                                                         |

## 5. Brücken zur Hauptgeschichte (ohne Änderung der Hauptszenen)

| Brücke                                                    | Wo                          | Wirkung in der Geschichte                                                                                                  |
| --------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| „Gäste erst zum Turnier“                                  | Mr. Kerrigan                    | erklärt, warum die Kantine vor Szene 38 zu ist; das Turnier ist das, was Mama in Szene 38 verbietet.                       |
| Lücke im Pokalregal, Roccos Warnung                       | Rocco                       | zwischen Szene 39 und 43: hält die Spannung bis zu Mamas Partie, ohne mehr zu sagen als Szene 39.                                                       |
| Saubere Gardine, „frag nicht, wie“                        | Mrs. Brody                  | Oma Ruth ist vor Szene 39 nur eine Nachbarin; danach erinnert Brody an Laurie mit Kreide (Szene 39 gibt das frei).         |
| Kreidebrett auf dem Gehweg                                | Mila und Benny, Mrs. Brody   | Mama hat als Kind genau dort gespielt (erst nach Szene 39 gesagt); Kreide wird zum Bild für Mamas Anfang.                 |
| Steckschach im Stollen                                    | N-ST2, Big Joe, Mama        | nach Szene 43: Mama findet ein Stück ihrer Jugend wieder; im Wohnzimmer neben dem Foto (13 §7.4).                         |
| Post, die keiner aufmacht                                 | Mr. Flores                  | Nachhall von Szene 41 (Postsack), ohne Inhalt des Umschlags.                                                                             |
| J. H. auf Brücke und im Lieferbuch                        | Nieten, Juno, N-ST1         | Juno fragt weiter („Wer baut hier alles?“); das Lieferbuch nennt nur „abgenommen: J. H.“, Ambrose schweigt; W6 löst es auf. |
| Kerrigan und Kendra, Ruth und Laurie                          | Kerrigan, Kendra (N-SB3)        | Zwei Familien, die nur sonntags telefonieren: Ironwood verliert seine Kinder an andere Städte, wie Mama damals.           |
| Brief an Kapitän Ruben                                    | Big Joe (nach Szene 39)     | „Bring das Ruben in Lockport, Kumpel.“ Startet L3 von mittel-3 (`14_Akt2_Leben_teil1.md` 4.3), das `lastkahnFrei` setzt; danach fährt der Lastkahn vom Anleger in Ironwood. |
| Busfahrer ohne Einladung                                  | Mr. Briggs                  | erklärt die Sperre des Busses bis Szene 50 in der Welt.                                                                    |
| Vögel hören an der Brücke auf                             | Mr. Oakes                   | bereitet Szene 53 vor („Wo wohnen hier die Tiere?“ – „Die stören die Sensoren.“).                                        |
| Frau von der Akademie löst Aufgaben auf Papier            | Cilla, Mr. Ames (ab Akt 4)  | Dr. Lin bleibt die ehrliche Spielerin (Bibel 18.2); ihr Club im leeren Laden (Post-Game) ist erst ab Akt 4 angedeutet. |
| Novas Werbesatz im Schaufenster                           | Perfect Move Store          | dieselbe Werbung wie in Riverton (Szene 29); kein Hinweis auf das Gerät vor Szene 56.                                     |
| Ellis hört auf, gegen ZERO zu zählen                      | N-SB2                       | Gegenbild zu Ambrose, der gebannt zusieht (Szenen 55, 61), ohne die Szenen zu ändern.                                     |

## 6. Wege, Sperren und Rückwege

Grundsatz aus 12: Man **sieht**, was hinter der Sperre liegt, und eine Figur davor **nennt den
Grund** in einem Satz; der Grund ist Alltag. Jede Sperre ist gegen den Bedarf der Hauptgeschichte
geprüft (Spalte „Gebraucht ab“).

| Nr. | Karte, Stelle                               | Grund in der Welt (Figur, Satz)                                                                | Öffnung                                          | Gebraucht ab | Lohn des Rückwegs                                                                      |
| --- | ------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------ | -------------------------------------------------------------------------------------- |
| –   | Ironwood, Kantinentür                       | Mr. Kerrigan: „Gäste erst zum Turnier, Kumpel.“                                                   | nach Szene 38 (`verbotGesehen`)                  | Szene 39     | Club, Rocco, N-IW2                                                                     |
| –   | Ironwood, Haus von Oma Ruth                 | Tür bleibt zu, niemand öffnet (heute)                                                          | `elmStreetBekannt` (Szene 39)                    | Szene 39     | Szene 39a beim zweiten Besuch (Turnierheft)                                             |
| –   | Ironwood, Kai: Lastkahn                     | Kahn liegt nicht am Kai; Schild „Anleger“                                                      | `lastkahnFrei` (mittel-3, „Post für den Kapitän“, ab Szene 39) | nie          | Schnellreise nach Lockport und Riverton (13 §3, mittel-3)                               |
| –   | Ironwood, Umkleide, dunkler Spind           | Lampe kaputt                                                                                   | Laterne                                          | nie          | Fund „Turm aus Holz“ (Waldholz 3/3, Bibel 12)                                           |
| S4  | Steinbruch, Stollenmund                     | Ruby: „So dunkel, dass die Taschenlampe Angst kriegt.“                                        | Laterne (Edna, 60 Münzen)                        | nie          | Echo (N-ST3), später Mamas Versteck (N-ST2)                                            |
| –   | Stollen, Nische                             | nur Steine                                                                                     | `mamaSpielt` (Szene 43), Big Joe erzählt          | nie          | „Mamas altes Steckschach“                                                              |
| –   | Ironwood, Bus nach Silicon Bay              | Mr. Briggs: „Ohne Einladung lassen die dich nicht mal aussteigen.“                            | nach Szene 50 (`einladungGesehen`)               | Szene 51     | Akt 3                                                                                  |
| –   | Ironwood, Bus nach Riverton                 | Fahrschein 10 Münzen                                                                           | `besuchtIronwood`; frei nach der Clubnadel        | nie          | Schnellreise                                                                           |
| S6  | Silicon Bay, Inselfähre                     | Mr. Pike: „Sonntags.“                                                                        | `nadelSiliconBay` (13 §4)                         | nie          | Nebenort N4                                                                            |
| –   | Silicon Bay, Küstenfähre                    | Fährterminal „Nur mit Ticket“                                                                  | `nadelSiliconBay` (heute)                         | Szene 62     | Akt 3 weiter                                                                           |

**Rückwege mit Lohn** (13 §0.5 und §7):

1. **Mit der Laterne** in Ironwood: Umkleide (Holzturm) und Stollen (N3); dazu das Archivregal in
   Cedar Creek (R3, 13).
2. **Nach Szene 43** zurück in den Steinbruch: Mamas Versteck (N-ST2).
3. **Aus Silicon Bay nach Ironwood** (Akt 3): Kendras Postkarte (N-SB3), Brief zum Umschlag (R5,
   nach Szene 76), Eis am Wasserloch im Steinbruch (13 §7.3).
4. **Nach der Nadel von Silicon Bay:** Inselfähre zu N4; Pelikan „Bishop“ am Bootsgeländer.

**Vorschläge mit Grund** (für den Haupt-Chat und mittel-3):

1. **Kantine erst nach Szene 38 statt immer offen** (13 §3 erlaubt beides): Ein Spieler, der W3 nach
   der Nadel von Riverton sofort geht, käme sonst vor Mamas Verbot in den Club, und Big Joe erkennt
   {held} in Szene 39, bevor die Geschichte einen Grund dafür hat. Die Stadt selbst ist offen.
2. **`zurueckIronwood` zielt auf `bushaltestelle`**, weil dort der Start der Ironwood-Karte liegt
   und `busSiliconBay` ein Dialog ist.
3. **N3 als eigener Ort mit `art: "nebenort"`**: N1 und N2 sollten dieselbe Form bekommen, damit die
   Übergangsprüfung Nebenorte wie Wege behandeln kann.

## 7. Zeitbudget und Münzen

| Ort                             | Neue Aufgaben (Minuten)        | Figuren, Funde, Aussichten (Minuten) | Summe     | Münzen neu |
| ------------------------------- | ------------------------------ | ------------------------------------ | --------- | ---------- |
| Ironwood                        | 12–17 (N-IW1, N-IW2, N-IW3)    | 4–6                                  | 16–23     | 35 + 5     |
| Steinbruch N3                   | 11–15 (N-ST1, N-ST2, N-ST3)    | 3–5 (Grube, Aussicht)                | 14–20     | 30         |
| **Akt 2 zusätzlich (Teil 2)**   |                                |                                      | **30–43** | **≈ 70**   |
| W4                              | 3–4 (N-W4a)                    | 2–3 (zwei Aussichten)                | 5–7       | 10         |
| Silicon Bay                     | 14–19 (N-SB1, N-SB2, N-SB3)    | 4–6 (Hafen, Figuren, Funde)          | 18–25     | 40 + 10    |
| **Akt 3 zusätzlich (Anfang)**   |                                |                                      | **23–32** | **≈ 60**   |

Kleine Aufgaben und Nebenorte fallen wie in Akt 1 nicht unter die Staffelzeiten von R40; sie kommen
obendrauf und werden mit `spielzeitJeOrt` nachgemessen (Befund 17). Liegt ein Testlauf darüber,
fallen zuerst N-IW3 und N-SB2 weg (beide eine einzelne Aufgabe), dann N-W4a.

**Münzen:** Bis zum Ende von Akt 2 rechnet 11 (7.1) mit ≈ 530 ohne Einkauf. Dazu kommen aus Teil 1
Riverton mit den Wegen 2 und 3 (≈ 70) und Lockport (35 + 15), aus diesem Teil der Steinbruch (30) und
Ironwood (35 + 5): zusammen ≈ 720 (Prüfbericht Akt 2, Befund 24). Dagegen stehen die Käufe des Akts (Laterne 60, Fahrrad 120 ohne Schlüssel, Busfahrkarten,
Was droht? 45). Die Wirtschaftssimulation (`gesamtsimulation.cjs --wirtschaft`) läuft nach dem
Einbau; bleibt der sparsame Spieler am Ende von Akt 2 mehr als 100 Münzen über der Kartentasche
(11, 7.4: 350 in Akt 3), sinken die kleinen Aufgaben auf 5 bis 10 Münzen (wie in 12 entschieden).

## 8. Was sich in Daten und Ortsdokumenten ändert

**`orte.json`, Ort `ironwood`**

- Figuren: `ironwood.kerrigan` (Pförtnerhaus), `.brody` (Elm Street, wandert), `.larsen` (Kreidebrett,
  eine Figur mit zwei Sprites wie die Zwillinge in Cedar Creek), `.rocco` (Kantine), `.flores`
  (Lok am Platz).
- Auslöser außen: `steinbruch` (Übergang Ostrand), `anleger` (Dialog, Reise, `wenn: lastkahnFrei`),
  `nietenBruecke`, `aussichtTreppe`, `pickup`, `leuchtschild`, `barbara`, `fundStahlperle`,
  `fundEssensmarke`; `kantineTuer` bekommt `wenn: verbotGesehen` und einen Dialog am Pförtnerhaus;
  `busSiliconBay` bekommt `wenn: einladungGesehen`.
- Auslöser innen: Kantine `schichtplan`, `kaffeemaschine`, `fotoMannschaft`; Haus Ruth `telefon`;
  Umkleide `helm`; Museum `fotoBruecke`.
- Quests: `ironwood.kreidebrett` (Start am bestehenden Auslöser `kreidebrett`), `ironwood.henkelmann`,
  `ironwood.iggy`; Runden `ironwood.kreidebrett`, `ironwood.gusSpiess`, `ironwood.fahrkarte`,
  `ironwood.kendrasFalle` (je `anzahl` 1 außer der ersten).

**`orte.json`, neuer Ort `steinbruch`** (`art: "nebenort"`, Staffel 1)

- Karten `steinbruch.grube`, `steinbruch.stollen`; Figuren `steinbruch.hargrove`, `.lena`,
  `.kinder` (Ruby und Jesse, eine Figur mit zwei Sprites).
- Auslöser: `zurueckIronwood`, `stollen` (`wenn: hatLaterne`), `stollenAusgang`, `aussichtGrube`,
  `schildHargrove`, `steine`, `lampenhaken`, `nische` (Objekt mit Bedingung `mamaSpielt`), `echo`.
- Quests: `steinbruch.lorenbahn`, `steinbruch.mamasVersteck`, `steinbruch.echo`; Runde
  `steinbruch.lorenbahn`.

**`orte.json`, Ort `wegIronwoodSilicon`**

- Figuren: `wegIronwoodSilicon.briggs`, `.oakes`; `.joggerin` bekommt den Namen Skye Marlow (nur
  i18n).
- Auslöser: `aussichtDuene`, `aussichtPlattform`; `zurueckIronwood` mit Ziel `bushaltestelle`.
- Quest: `wegIronwoodSilicon.voegel`.

**`orte.json`, Ort `siliconBay`**

- Neue Karte `siliconBay.hafen` mit den Auslösern `campus`, `faehre` (vom Campus umgezogen),
  `inselfaehre`, `schaufenster`, `netze`, `fernrohr`, `fundSeeglas`.
- Campus: `hafen` (Übergang Südrand), `roboter` (Szene 53), `aussichtBucht`, `fundKastanie`; `busIronwood` entfällt (Prüfbericht Akt 2, Befund 3).
- Innen: Akademie `rangliste`, `dreiZiele`, `glaspokal`; Lobby `zeitleiste`.
- Figuren: `siliconBay.cilla`, `.ellis`, `.kendra`, `.ames`, `.finch`.
- Quests: `siliconBay.fahrplan`, `siliconBay.ellis`, `siliconBay.kendra` (Ziel Figur `ironwood.kerrigan`);
  Runde `siliconBay.ellisFalle` (`anzahl` 1).

**`funde.json` (neu):** `stahlperle` (Ironwood, 5 Münzen), `essensmarke` (Ironwood), `kreidestummel`,
`eintopfrezept`, `schaffnerpfeife` (Ironwood), `mamasSteckschach`, `geritzteZuege` (Fragment-Hinweis)
(Steinbruch), `vogelliste` (W4), `papierfahrplan`, `postkarteGlasturm`, `kastanie` (5 Münzen),
`seeglas` (5 Münzen) (Silicon Bay).

**Dialogvariablen (neu, von Ink gesetzt, R42):** `verbotGesehen` (Szene 38), `einladungGesehen`
(Szene 50), `mamaSpielt` (Szene 43, steht schon in der Bibel), `hatLaterne` und `besuchtIronwood`
(13, Technik); `lastkahnFrei` kommt von mittel-3 (`14_Akt2_Leben_teil1.md`).

**`ortsprofile.json`:** Profile für `ironwood`, `steinbruch`, `wegIronwoodSilicon` und `siliconBay`
mit allen Karten (in diesem Auftrag eingetragen).

**Ortsdokumente:** `orte/ironwood.md` (mit N3) und `orte/silicon-bay.md` (mit W4) sind auf dem Stand
dieses Dokuments; der Übergang W3 ↔ Ironwood ist mit mittel-3 abgestimmt (ironwood.md, 1.6: Weg in
den Spalten 24–25, Kanal 4–9 auf beiden Seiten).
