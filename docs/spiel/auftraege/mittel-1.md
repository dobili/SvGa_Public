# Auftrag mittel-1: Crossroads, Pinewood Camp, Wege dazwischen; Felsplateaus nachsetzen

**Stand:** offen (Haupt-Chat, 09.11.2026, siebenundzwanzigster Auftrag; Summit City und Hochebene sind zusammengeführt, danke)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen, Stand 623c31ad);
im privaten Repository `origin/main` holen (Stand d33a9cd2, nur lesen)
**Darf ändern:** `inhalte/abenteuer/karten/crossroads-*.json`, `pinewood-camp-*.json`,
`weg-crossroads-pinewood-*.json`, `hochebene-*.json` (nur Felsplateaus nachsetzen),
`inhalte/abenteuer/moebel.json` (nur neue Einträge am Ende, Vorsilben `cr`, `pw`, `sv`), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** wie beim letzten Auftrag; vorher erneut hereinholen (niedrig-1 macht parallel Desert Springs)

## Ziel

1. Serene Village gibt es jetzt als Einzelbilder: `spiel/serene/serene_NN.png` im privaten Repository,
   im Register unter Thema „serene village einzeln“, Übersicht `register/uebersicht/serene-village__01.png`
   (Felsplateau mit Treppe Nr. 2, Felsbrocken, Holzhäuser, Zäune, Baumreihen). Setze damit die
   Felsplateaus auf der Hochebene nach (Vorsilbe `sv` für Serene-Village-Teile, wiederverwendbar).
2. Crossroads (Kreuzung im Landesinneren): draußen (Tankstelle, Motel, Schilder, Bus), Raststätte
   (innen). Weg Crossroads–Pinewood: Hütten und Riesenbäume. Pinewood Camp draußen (Zelte, Hütten,
   Lagerfeuer, Steg am See; Wasser über `stil` = `kueste`, falls es einen See gibt).

## Bericht des letzten Auftrags, zur Nachlese

Acht Karten eingerichtet: Summit City draußen, Hütte, Bergstation, Bergladen; Hochebene
Felsentürme und Schule; Geysirbecken und Prärie. 11 neue Möbel am Ende von `moebel.json` (`sc` 7,
`he` 4), dazu viele aus Riverton, Silicon Bay und London wiederverwendet (Zedern, Holzscheite,
Materialstapel, Bänke, Laternen, Regale, Ofen, Tische, Stühle, Heuhaufen, Zaun). Das Geysirbecken hat
die Karteneigenschaft `stil` = `kueste`: die Becken sind Wasser, der Weg ist ein Holzsteg.
Platzhalter unter jedem Möbel durch Boden ersetzt; stehen geblieben sind nur die unter Auslösern.

Neue Möbel: `scFelsGross`, `scFelsMittel`, `scFelsKlein` (Felsen aus Modern Farm), `scRucksack`,
`scRucksackRot`, `scSeil`, `scBankSeitlich`, `heSchulbus`, `heBasketballkorb`, `heTraktor`,
`heVogelscheuche`.

Bildschirmfotos im Spiel (Build mit verlinktem privaten Repository; Bilder nur lokal):

- **Summit City draußen:** Zedern und Zederngruppen zwischen den Holzhäusern und unten am Hang,
  zwei Holzstapel statt des Kistenblocks, Felsen, Bänke, eine Laterne, ein Steinbrunnen unter dem
  Drachenbrunnen; Kit und Victor frei. Schnee gibt es im Register nicht.
- **Hütte (Großmeisterin Ward):** Ofen mit Rohr neben dem Kaminfeuer, Bücherregal, altes Regal,
  kleine Laterne, Schachtisch aus zwei dunklen Holztischen mit Stuhl, Bett mit Nachttisch, runder
  Tisch; Pokal und Kaminfeuer bleiben Auslöser.
- **Bergstation:** vier grüne Wartebänke längs an den Wänden, Ticketschalter neben Mr. Haraldsen,
  Fahrplan, Kaffeeautomat, Pflanze, Rucksack bei der Skifahrerin.
- **Bergladen:** vier Warenregale an den Wänden, Seil auf der Auslage bei Sol, zwei Rucksäcke
  rechts, eine Kiste neben der Theke.
- **Hochebene Felsentürme:** die Türme bleiben die Wandblöcke; dazu Felsen, ein Baumstumpf, eine
  Zeder und ein Basketballkorb neben Kiras Steintisch (Kira hat einen Basketball).
- **Hochebene Schule:** ein gelber Schulbus statt des Kistenblocks bei Joss' Werkstatt (Joss liegt
  laut Dialog unter dem Bus), Basketballkorb für Annek, Laterne, Picknicktisch, Zedern; nur heutige
  Dinge, keine Zeichen oder Muster realer Kulturen.
- **Geysirbecken (`stil` Küste):** fünf Becken als Wasser, Holzsteg als Weg, Bank am Becken,
  Felsen, Zeder und Baumstumpf; Bell, Tafel, Bisons frei.
- **Prärie:** langer Holzzaun vor dem Feld, Vogelscheuche und drei Heuhaufen im Feld, ein Traktor
  beim Hof, zwei Felsen statt der Kisten; Sturmkeller und Ray frei.

**Entscheidungen:** Serene Village liegt nur als ein großes Kachelblatt vor, nicht als Einzelbilder;
Möbel brauchen ein eigenes Bild, deshalb habe ich die Felsplateaus nicht als Möbel gesetzt (die
Felstürme bleiben die Wandblöcke des Kachelstils). Wenn der Haupt-Chat Einzelbilder daraus schneidet,
setze ich sie gern nach. Eine Seilbahn gibt es im Register nicht.

**Prüfungen:** `python -m pytest pipeline/tests -q`: 624 bestanden, 3 übersprungen. Prettier über die
geänderten Dateien. `npm run build` mit verlinktem privaten Repository ohne Fehler. Playwright
`tests/e2e/abenteuer` (Chromium): 9 bestanden. Vor dem Push `claude/friendly-shannon-y8bf90`
erneut hereingeholt; `moebel.json` nur am Ende ergänzt.

## Bericht des letzten Auftrags, zur Nachlese

Acht Karten eingerichtet: Silicon Bay draußen, Lobby, Akademie, Serverraum; Raststätte und
Glasbrücke; Erinnerung London Strand und Kaffeehaus. 31 neue Möbel am Ende von `moebel.json`
(Vorsilbe `sb` 20, `ld` 11), alle mit `kollision`; dazu wiederverwendet `rvKaffeeautomat`,
`rvGetraenkeautomat`, `rvAutoGruen`, `rvPicknicktisch`, `rvHolzbank`, `laterne`, `muelltonne`.
Platzhalter unter jedem Möbel durch Boden ersetzt; stehen geblieben sind nur die unter Auslösern
(Tafel, Ohrstöpsel, Droschke, Schachtisch) und die Kiste neben der Droschke (der Wagen selbst; ein
Möbel dort würde das Droschkenpferd zustellen).

Neue Möbel: `sbPflanze`, `sbPoster`, `sbWhiteboard`, `sbPraesentation`, `sbWasserspender`,
`sbServerKlein`, `sbServer`, `sbServerschrank`, `sbSofa`, `sbSessel`, `sbEmpfang`, `sbSchreibtisch`,
`sbArbeitsplatz`, `sbArbeitsplatzDrucker`, `sbBuerostuhl` (alle aus Modern Office, Einzelbilder auf
32 × 48 Pixel), `sbKuebelbaum`, `sbKuebelbaumRund`, `sbKuebelpflanze`, `sbLaterne`, `sbFoodtruck`;
`ldGaslaterne`, `ldFass`, `ldKarren`, `ldTisch`, `ldStuhl`, `ldBuecherregal`, `ldOfen`, `ldKommode`,
`ldTheke`, `ldBank`, `ldBild`. (Noch nicht gesetzt: `sbPoster`, `sbWhiteboard`, `sbBuerostuhl`,
`ldKarren`, `ldBild`, als Vorrat.)

Bildschirmfotos im Spiel (Build mit verlinktem privaten Repository; Bilder nur lokal):

- **Silicon Bay draußen:** Bäume in weißen Kübeln vor beiden Glasbauten, schmale Kübelpflanzen im
  Innenhof, moderne Laternen; Rosies Food-Truck (ein Taco-Wagen) steht an Stelle des Kistenblocks,
  Rosie links davor, Dashs Bank darunter.
- **Lobby:** Empfangstresen neben dem Empfangsroboter, zwei Pflanzen rahmen die Vitrine mit dem
  Hale-Stück, graues Sofa bei der Besuchergruppe, Sessel, Kübelpflanze und Wasserspender.
- **Akademie:** sechs Arbeitsplätze mit Rechner und Drucker statt der Brettkacheln, Präsentationstafel
  an der Wand, Dr. Lins Schreibtisch mit Pflanze, Wasserspender; Nova, Theo und Lin frei.
- **Serverraum:** drei Reihen Serverschränke in wechselnden Formen, Gänge dazwischen, das
  Schummelgeräte-Versteck rechts unten frei.
- **Raststätte:** Kaffee- und Getränkeautomat, an denen Mrs. Kowalczyk lehnt, ein geparktes Auto
  rechts, zwei Laternen, Mülltonne und zwei Picknicktische.
- **Glasbrücke:** zwei moderne Laternen auf der Brücke; sonst bleibt die Brücke leer (die Grafik der
  Brücke selbst kommt aus dem Kachelsatz).
- **London Strand (sepia):** acht Gaslaternen an beiden Gehwegen, zwei Fässer neben der Tür des
  Kaffeehauses, eine Bank; der Laternenanzünder steht an einer Laterne.
- **London Kaffeehaus (sepia):** Theke mit Flaschen und Kommode beim Kellner, Bücherregal und Stuhl
  beim Zeitungsleser, Ofen mit Rohr an der Wand, vier dunkle Holztische mit Stühlen; der Schachtisch
  in der Mitte bleibt der Auslöser.

**Entscheidungen:** Die Einzelbilder von Modern Office sind alle 32 × 48 Pixel mit Rand; die Sperrfläche
deckt deshalb zwei Spalten, auch bei schmalen Stücken. Für London gibt es im Register kaum Möbel aus
der Zeit; ich habe dunkle Holzmöbel, Gaslaternen und einen Ofen gewählt, die Sepia-Tönung macht den
Rest. Der Auftrag nennt „um 1960“; die Dialoge spielen 1851 (Weltausstellung), die Möbel passen zu
beidem nur ungefähr.

**Prüfungen:** `python -m pytest pipeline/tests -q`: 624 bestanden, 3 übersprungen. Prettier über die
geänderten Dateien. `npm run build` mit verlinktem privaten Repository ohne Fehler (Abenteuerpaket
4,3 MB). Playwright `tests/e2e/abenteuer` (Chromium): 9 bestanden. Vor dem Push
`claude/friendly-shannon-y8bf90` erneut hereingeholt; `moebel.json` nur am Ende ergänzt.

## Bericht des letzten Auftrags, zur Nachlese

Sieben Karten eingerichtet (Riverton draußen, Pavillon, Bahnhofshalle, Wohnwagen, Schuppen,
Zedernwald, Bahndamm). 41 neue Möbel in `moebel.json`, alle mit Vorsilbe `rv`, alle mit
`kollision`, Pfade aus `register/register.csv`; dazu wiederverwendet: `laterne`, `baum`,
`parkbank`, `muelltonne`, `briefkasten`, `blumenbusch`, `blumen`, `pflanzeKlein`, `pflanzeGross`,
`kuehlschrank`, `herd`, `holztisch`, `sofaRund`. Platzhalter (Kiste, Lampe, Brett) unter jedem Möbel
durch Boden ersetzt; stehen geblieben sind nur die Platzhalter unter Auslösern (Zeitungsstand,
Gedenktafel, Limonadenglas, Dosentrophäen, Fahrrad, Bildschirmtische, Tafel, drei Funde), weil ein
Möbel keinen Auslöser zustellen darf.

Neue Möbel: Bahnhof `rvTicketschalter`, `rvWartebank`, `rvBahnsteigbank`, `rvGetraenkeautomat`,
`rvKaffeeautomat`, `rvFahrplan`, `rvTopfpflanze`, `rvKoffer`, `rvGepaeckwagen`, `rvSaeule`,
`rvZeitungsregal`; draußen `rvPicknicktisch`, `rvPicknicktischLang`, `rvHolzbank`,
`rvLimonadenkarren`, `rvAutoBlau`, `rvAutoGruen`, `rvBildschirmtisch`, `rvHydrant`,
`rvGitarrenkoffer`; innen `rvBett`, `rvFernseher`, `rvPokalhaufen`, `rvLaterneKlein`, `rvKiste`,
`rvKisteOffen`, `rvWerkzeugkiste`, `rvMaterialstapel`, `rvFass`, `rvLeiter`, `rvHolzscheite`; Weg
`rvZeder`, `rvZederSchmal`, `rvZederngruppe`, `rvLaubbaum`, `rvLaubbaumDunkel`, `rvBaumstumpf`,
`rvWegweiser`, `rvGleis`, `rvHeuhaufen`, `rvHolzbankNatur`. (Einige sind angelegt, aber noch nicht
gesetzt, etwa `rvAutoGruen`, `rvLimonadenkarren`, `rvKisteOffen`, `rvPicknicktischLang`: als Vorrat
für Ironwood und spätere Feinarbeit.)

Bildschirmfotos im Spiel (Build mit verlinktem privaten Repository, Spielstand auf die Karte
gesetzt; Bilder nur lokal):

- **Riverton draußen:** Laternen und Briefkasten am Bahnhofsvorplatz, eine grüne Bank auf dem
  Bahnsteig neben dem Zug nach Cedar Creek, Bäume und eine Parkbank im Grünstreifen, Gitarrenkoffer
  beim Straßenmusiker, ein geparktes Auto, Hydrant und Mülltonne; die Bildschirmtische sind zwei
  dunkle Monitorpulte links und rechts des Auslösers, davor eine Holzbank.
- **Pavillon:** acht Picknicktische mit Bänken in zwei Reihen statt der Brettkacheln, Slick, Ray und
  Tamsin stehen zwischen den Tischen, Blumen in den Ecken, Topfpflanzen am Eingang.
- **Bahnhofshalle:** drei Zeitschriftenregale am Zeitungsstand (Pops davor), zwei Ticketschalter,
  Kaffee- und Getränkeautomat, orange Wartebänke (eine vor Mr. Harlan), Fahrplan an der Wand, zwei
  Säulen, Koffer und Gepäckwagen, Pflanzen am Ausgang; die große Uhr bleibt frei erreichbar.
- **Wohnwagen:** Bett, Küchenzeile mit Kühlschrank und Herd, Fernseher, runder Tisch mit Hocker,
  zwei Pokalhaufen über den Dosentrophäen, kleine Laterne.
- **Schuppen:** Materialstapel, Fass, Leiter, Karton und Holzscheite an den Wänden, eine
  Werkzeugkiste rechts; das Fahrrad (Auslöser) ist frei.
- **Zedernwald:** sieben Waldstücke aus schmalen Zedern und Zederngruppen statt der Kistenblöcke,
  Wegweiser neben der Rätseltafel, Baumstumpf, Holzbank am Weg; Fenwick, Reh, Specht und
  Pilzsammlerin frei.
- **Bahndamm:** durchgehendes Gleis auf dem Damm, Laub- und Nadelbäume darüber, Holzscheite beim
  Streckenwärter, Schwellenbank beim Schaffner, Heuhaufen auf der Weide bei den Kühen.

**Entscheidungen:** Die Wälder sind dicht gesetzt; Bäume überlappen sich im Bild, das ist gewollt
(die oberste Kachelreihe jedes Baums bleibt begehbar, deshalb ist der Waldrand nicht ganz hart).
Eine Uhr für die Halle gibt es im Register nur als Glockenturm (128 × 240), zu groß für die Halle;
die Uhr bleibt die Wandkachel mit Auslöser. Ein Fahrrad und einen Wohnwagen als Einzelbild gibt es
im Register nicht; das Fahrrad bleibt Auslöser, der Wohnwagen ist draußen das Wandgebäude.

**Prüfungen:** `python -m pytest pipeline/tests -q`: 624 bestanden, 3 übersprungen (Gesamtsimulation
nur mit `ABENTEUER_SIMULATION=1`). Prettier über die geänderten Dateien. `npm run build` mit
verlinktem privaten Repository ohne Fehler (Abenteuerpaket 4,2 MB). Playwright
`tests/e2e/abenteuer` (Chromium): 9 bestanden.

## Bericht des letzten Auftrags, zur Nachlese

85 Einträge in `werkzeuge/figuren.json` (83 Figuren aus `orte.json`, dazu `held-0` und
`ambrose-jung`), alle gebaut nach `spiel/figuren/` (`python werkzeuge/figuren.py`: „85 Figuren
gebaut“). Keine zwei Einträge sind gleich; die Figuren der Capital Arena (elf auf einer Karte) und
das Pinewood Camp (Dex, Mae, Tamsin, Lou) habe ich auf einem Kontaktbogen nebeneinander geprüft.
Im öffentlichen Repository steht nur dieser Bericht, keine Bilder.

**Entscheidungen:**

- **Hauttöne:** Der Generator hat sechs natürliche Töne (1, 2, 3, 4, 7, dazu 5). Ton 5 wirkt im Spiel
  grünlich mit lila Wangen, deshalb ist er nicht vergeben; 6, 8 und 9 sind Fantasietöne, nur der
  Empfangsroboter bekommt 9 (blau, mit Schraube und türkisen Augen). Der dunkelste Ton (1) ist nur
  mittelbraun; für noch dunklere Haut müsste der Haupt-Chat einen Ton nachfärben, wenn gewünscht.
  Vergeben nach der Bibel, etwa Mrs. Okafor, Dex, Slick, Odile, Okoro und Kira mit Ton 1.
- **Familien und Wiedererkennung:** Mama und Oma Ruth haben dieselben grünen Augen und denselben
  Hautton, Remy und Mrs. Arceneaux ebenso, Henri und Céleste die grauen Augen des jungen Ambrose
  (Whitlock-Linie), Victor und Graham Hale sehr helle Haut, graue Augen und dasselbe blonde Haar.
  Wiederkehrende Figuren haben genau ein Bild (eine Datei je Sprite).
- **Berufe ohne Klischee:** Mama in Pflegekleidung, Schaffner mit Dienstmütze und Weste,
  Schiffskoch mit Kochmütze, Big Joe, Hank, Tomás, Albescu und Joss im Overall, Uhrmacher Harlan
  mit Lupe, Rangerinnen und Wüstenwanderin mit breitem Hut. Die Vell-Familien tragen heutige
  Kleidung (Trainingsjacke, Overall, Schulshirt), ohne Federn oder Schmuck.
- **Kinder** (Kinderteile): Lily, Dex, Mae, Tamsin, Lou, Mira, Kira und der Zeitungsjunge. Teenager ab
  14 (Held, Juno, Sam, Victor, Céleste …) haben den Erwachsenenkörper, sie sind etwa so groß.
- **Held:** warm-helle Haut, kinnlanger Bob, helles Hemd unter offener Jacke, damit niemand auf ein
  Geschlecht schließen kann.
- **Befund am Werkzeug** (nicht geändert, weil ich nur `figuren.json` und `spiel/figuren/` ändern
  darf): `figuren.py` setzt Kinderfrisuren als `Hairstyle_<frisur>.png` zusammen, die Dateien
  heißen aber `Hairstyle_kid_<Form>_<Farbe>.png`. Deshalb stehen die Kinderfrisuren als
  `kid_4_1` statt `4_1` in der Liste. Wenn der Haupt-Chat das Werkzeug anpasst (Präfix `kid_`
  ergänzen), müssen die acht Einträge auf `4_1` usw. zurück.
- **Porträts** (Nachtrag): `figuren.py` baut jetzt auch `spiel/portraets/`. Die acht Kinder und die
  sieben Figuren mit Glatze (Pops, Batiste, Buck, Earl, Haraldsen, Pruitt, Schiffskoch) haben
  `portraet_frisur` mit einer ähnlichen Erwachsenenfrisur (Kinder: gleiche Haarfarbe, ähnliche Form;
  Glatze: sehr kurzes Haar). Ergebnis: 84 von 85 Porträts; nur der Empfangsroboter behält das
  gezeichnete Ersatzbild. Der Schiffskoch hat im Porträt keine Kochmütze (gibt es dort nicht).
- **Push:** Die Commits b18770e7 (Figuren) und der Porträt-Nachtrag liegen im privaten Repository auf `main` nur lokal in meiner Sitzung (nach `git pull --rebase` auf 37aa5b5c); der
  Push nach `main` wurde von der Rechteprüfung der Sitzung abgelehnt (Schreiben in ein fremdes
  System). Der Autor muss ihn freigeben oder selbst pushen.

**Aussehen je Figur** (Haut, Augen, Kleidung, Haar, Zubehör):

| Figur           | Aussehen                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| held-0          | warm-helle Haut, haselnussbraune Augen, offene Jacke über hellem Hemd, Haar braun (kinnlanger Bob)                     |
| ambrose-jung    | helle Haut, graue Augen, langer Gehrock (schwarz), Haar dunkelbraun (Tolle)                                            |
| mutter          | helle Haut, grüne Augen, Pflegekleidung (petrol), Haar braun (lang)                                                    |
| coach-delgado   | warm-helle Haut, bernsteinfarbene Augen, Trainingsjacke (blau), Haar dunkelbraun (Pferdeschwanz)                       |
| sam             | sehr helle Haut, blaue Augen, T-Shirt (rot), Haar rotblond (stachelig)                                                 |
| skater-jo       | warm-helle Haut, haselnussbraune Augen, offene Jacke, Regenbogenhemd, Haar braun (kurz), Schirmmütze                   |
| juno            | mittelbraune Haut, braune Augen, Pulli (flieder), Haar dunkelbraun (Dutt)                                              |
| abernathy       | sehr helle Haut, graue Augen, Tweedjacke mit Krawatte (dunkelbraun), Haar grau (kurz), Brille                          |
| lily            | Kind, sehr helle Haut, blaue Augen, rosa Shirt, Haar rotblond (Zöpfe)                                                  |
| okafor          | braune Haut, braune Augen, helle Jacke mit Schal (blassblau), Haar grau (kurze Locken), Brille                         |
| dex             | Kind, braune Haut, braune Augen, blaues Shirt, Haar schwarz (Stachelkopf)                                              |
| mae             | Kind, sehr helle Haut, blaue Augen, hellblaues Shirt, Haar blond (Pagenkopf)                                           |
| boateng         | mittelbraune Haut, bernsteinfarbene Augen, Pullover (hellblau), Haar aschgrau (kurz), Bart                             |
| rosa            | warm-helle Haut, haselnussbraune Augen, Flanellhemd (grün), Haar aschgrau (kinnlang, Seitenscheitel), Strickmütze      |
| victor          | sehr helle Haut, graue Augen, Sakko mit Hemd (marine), Haar hellbraun (ordentlich kurz)                                |
| wanderer        | mittelbraune Haut, braune Augen, Outdoorjacke (grün), Haar braun (Topfschnitt), Rucksack                               |
| nia             | braune Haut, bernsteinfarbene Augen, gemustertes Hemd (orange), Haar schwarz (Pferdeschwanz)                           |
| fenwick         | helle Haut, grüne Augen, Outdoorjacke (rostbraun), Haar rotblond (langer Bob), Rucksack                                |
| schaffner       | warm-helle Haut, graue Augen, Weste über Hemd (blau), Haar aschgrau (kurz), Dienstmütze                                |
| slick           | braune Haut, braune Augen, Kapuzenjacke (blau), Haar schwarz (kurze Locken), Rucksack                                  |
| tamsin          | Kind, mittelbraune Haut, braune Augen, gestreiftes Shirt, Haar dunkelbraun (kurz mit Pony)                             |
| ray             | mittelbraune Haut, graue Augen, Uniformjacke (grau), Haar grau (kurz), Strickmütze                                     |
| harlan          | sehr helle Haut, haselnussbraune Augen, Weste über Hemd (dunkel), Haar grau (ordentlich kurz), Lupe am Auge            |
| pops            | braune Haut, bernsteinfarbene Augen, offene Jacke über Hemd (braun), Glatze, Bart                                      |
| albescu         | helle Haut, grüne Augen, Overall (rot), Haar dunkelbraun (Pagenkopf)                                                   |
| nova            | helle Haut, blaue Augen, helle Jacke mit Schal (weiß), Haar hellbraun (lang)                                           |
| dale            | warm-helle Haut, braune Augen, Latzhose (blau), Haar hellbraun (kurz), Bart                                            |
| big-joe         | helle Haut, blaue Augen, Overall (gelb), Haar dunkelbraun (kurz geschoren), Bart                                       |
| hank            | mittelbraune Haut, braune Augen, Overall (orange), Haar dunkelbraun (Topfschnitt), Strickmütze                         |
| priya           | braune Haut, braune Augen, Outdoorjacke (grau), Haar schwarz (lang)                                                    |
| gus             | warm-helle Haut, bernsteinfarbene Augen, Blouson (marine), Haar aschgrau (kurz), Schnurrbart                           |
| edna            | sehr helle Haut, grüne Augen, Flanellhemd (senf), Haar grau (Pagenkopf), Brille                                        |
| teague          | helle Haut, graue Augen, langer Gehrock (oliv), Haar grau (kurz), Brille                                               |
| oma-ruth        | helle Haut, grüne Augen, Strickpullover (lila), Haar grau (Dutt)                                                       |
| graham-hale     | sehr helle Haut, graue Augen, Anzug mit Krawatte (dunkel, rote Krawatte), Haar hellbraun (seitlich gekämmt)            |
| zeitungsjunge   | Kind, helle Haut, graue Augen, hellblaues Shirt, Haar rotblond (Stachelkopf)                                           |
| kellner         | sehr helle Haut, braune Augen, Weste über Hemd (grau), Haar dunkelbraun (ordentlich kurz), Schnurrbart                 |
| zeitungsleser   | warm-helle Haut, graue Augen, Sakko mit Hemd (schwarz), Haar grau (kurz), Lupe am Auge                                 |
| kowalczyk       | sehr helle Haut, blaue Augen, Latzhose (grün), Haar rotblond (Pferdeschwanz), Schirmmütze                              |
| joggerin        | mittelbraune Haut, grüne Augen, Trainingsjacke (rosa), Haar aschgrau (Pferdeschwanz)                                   |
| lin             | warm-helle Haut, braune Augen, Sakko mit Hemd (grau), Haar schwarz (kinnlanger Bob), Brille                            |
| theo            | warm-helle Haut, graue Augen, Pullover (graublau), Haar schwarz (mit Kopfhörern)                                       |
| dash            | braune Haut, bernsteinfarbene Augen, T-Shirt (orange), Haar dunkelbraun (zerzaust), Rucksack                           |
| rosie           | warm-helle Haut, bernsteinfarbene Augen, Hawaiihemd (türkis), Haar braun (Dutt)                                        |
| empfangsroboter | blaues Blechgesicht, leuchtend türkise Augen, weißer Kittel (grau), Schraube auf dem Kopf                              |
| schiffskoch     | mittelbraune Haut, haselnussbraune Augen, weißer Kittel (weiß), Kochmütze                                              |
| guidry          | helle Haut, haselnussbraune Augen, offene Jacke über Hemd (oliv), Haar aschgrau (Tolle)                                |
| odile           | braune Haut, bernsteinfarbene Augen, gemustertes Hemd (lila), Haar aschgrau (kurze Locken)                             |
| remy            | mittelbraune Haut, braune Augen, Uniform mit Halstuch (gold (Bandjacke)), Haar schwarz (zerzaust)                      |
| lou             | Kind, helle Haut, haselnussbraune Augen, grünes T-Shirt, Haar braun (kurz)                                             |
| batiste         | braune Haut, haselnussbraune Augen, Latzhose (weinrot), Strickmütze                                                    |
| arceneaux       | mittelbraune Haut, braune Augen, Strickpullover (lachs), Haar grau (langer Bob)                                        |
| henri           | warm-helle Haut, graue Augen, Tweedjacke mit Krawatte (braun), Haar aschgrau (Tolle)                                   |
| celeste         | warm-helle Haut, graue Augen, Kapuzenjacke (malve), Haar braun (mit Kopfhörern)                                        |
| blaeser         | braune Haut, grüne Augen, offene Jacke, rotes Hemd, Haar schwarz (Dutt)                                                |
| holloway        | warm-helle Haut, blaue Augen, Pulli (beige), Haar grau (kinnlang, Seitenscheitel), breitkrempiger Hut                  |
| mira            | Kind, mittelbraune Haut, blaugrüne Augen, blaues Shirt, Haar schwarz (Zöpfe)                                           |
| tomas           | mittelbraune Haut, bernsteinfarbene Augen, Overall (orange), Haar dunkelbraun (zerzaust)                               |
| dot             | sehr helle Haut, blaue Augen, Hawaiihemd (rosa), Haar grau (wuschelig), Brille                                         |
| buck            | warm-helle Haut, haselnussbraune Augen, offene Jacke über Hemd (rot), Schirmmütze                                      |
| okoro           | braune Haut, braune Augen, Tweedjacke mit Krawatte (marine), Haar grau (kurz), Brille                                  |
| earl            | helle Haut, graue Augen, T-Shirt (weinrot), Glatze, Bart                                                               |
| kira            | Kind, braune Haut, braune Augen, gestreiftes Shirt, Haar schwarz (Pagenkopf)                                           |
| annek           | mittelbraune Haut, braune Augen, Trainingsjacke (weinrot), Haar schwarz (Pferdeschwanz)                                |
| joss            | braune Haut, bernsteinfarbene Augen, Overall (rot), Haar schwarz (ordentlich kurz)                                     |
| ward            | sehr helle Haut, graue Augen, Strickpullover (grau), Haar grau (kinnlanger Bob)                                        |
| kit             | helle Haut, grüne Augen, Outdoorjacke (grün), Haar rotblond (wild gewellt), Strickmütze                                |
| haraldsen       | sehr helle Haut, blaue Augen, Blouson (marine), Glatze, Bart                                                           |
| sol             | warm-helle Haut, bernsteinfarbene Augen, Kapuzenjacke (dunkelgrün), Haar braun (Pferdeschwanz), Rucksack               |
| bell            | helle Haut, blaue Augen, offene Jacke über Hemd (oliv), Haar dunkelbraun (kinnlanger Bob), breitkrempiger Hut          |
| ray-castillo    | mittelbraune Haut, bernsteinfarbene Augen, Blouson (grün), Haar dunkelbraun (seitlich gekämmt), Schirmmütze            |
| darlene         | warm-helle Haut, grüne Augen, weiße Bluse mit Schürze (rot), Haar hellbraun (Dutt)                                     |
| greta           | sehr helle Haut, blaue Augen, Flanellhemd (grün), Haar grau (Pferdeschwanz)                                            |
| ezra            | braune Haut, braune Augen, T-Shirt (grün), Haar dunkelbraun (strubbelig)                                               |
| hollis          | warm-helle Haut, haselnussbraune Augen, Outdoorjacke (grün), Haar braun (kinnlang, Seitenscheitel), breitkrempiger Hut |
| juniper         | mittelbraune Haut, grüne Augen, T-Shirt (hellblau), Haar hellbraun (seitlich lang), Kletterhandschuhe                  |
| pruitt          | sehr helle Haut, graue Augen, offene Jacke über Hemd (braun), Glatze, Bart                                             |
| postreiter      | warm-helle Haut, haselnussbraune Augen, langer Gehrock (blaugrau), Haar braun (Pony seitlich), breitkrempiger Hut      |
| abe             | sehr helle Haut, blaue Augen, helle Jacke mit Schal (hellblau), Haar grau (kurz), Dienstmütze                          |
| turnierleiterin | sehr helle Haut, graue Augen, Weste über Hemd (grün), Haar schwarz (Pagenkopf)                                         |
| bea             | sehr helle Haut, blaue Augen, Uniform mit Halstuch (blau), Haar hellbraun (langer Bob)                                 |
| marcus          | braune Haut, braune Augen, Uniform mit Halstuch (grün), Haar schwarz (strubbelig)                                      |
| tobias          | helle Haut, grüne Augen, Pullover (grau), Haar braun (seitlich lang)                                                   |
| kade            | sehr helle Haut, graue Augen, Sakko mit Hemd (schwarz), Haar grau (seitlich gekämmt)                                   |
| theron          | warm-helle Haut, haselnussbraune Augen, Hawaiihemd (blau), Haar braun (wuschelig), Brille                              |

## Bericht des letzten Auftrags, zur Nachlese

**Erledigt.**

- **Elf neue Karten** in `karten.json`, nur mit vorhandenen Wirkungsarten: acht Werkzeugkarten
  (dauerhaft, Werkzeuge, die allein die Stellung brauchen: k7-warnsignale, k5-felder, k5-figuren,
  k1-angriffsregel, k8-opposition, k8-schluesselfelder, k9-erkennungsbilder, k8-elementarmatt), dazu
  Klares Flüstern (Flüstern mit zwei Kandidaten), Lange Auszeit (Zeit +180 Sekunden) und als einzige
  starke Karte die Läufervorgabe (Vorgabe f1). Name, Spruch, Erklärung mit Buchstelle in
  `texte/de.json` (33 Schlüssel), Bild nach dem Muster `karten/<name>.webp`.
- **Läden** in Akt 3 und 4 (Rosie, Gebäckstand, Mr. Okoro, Bergladen, Darlene), Preise 35 bis 200;
  starke Karte erst ab Desert Springs (Akt 3). Tabelle mit Warum, Stufe, Laden und Preis in
  `docs/spiel/11_Karten_und_Gegenstaende.md`, Abschnitt 8.
- **Auswertung erweitert:** Der sparsame Spieler sammelt jetzt jede dauerhafte Karte einmal, sobald
  er sie mit 50 Münzen Rücklage bezahlen kann (der Wunsch „viele Karten“; Verbrauchskarten und
  Gegenstände kauft er nicht auf Vorrat). Neue Ziele in der Ausgabe: Rest am Ende, dauerhafte Karten,
  die er nie kaufen konnte, starke Karten erst ab Akt 3, Waren in Akt 4, die der verschwenderische
  Spieler nicht kaufen kann. `test_wirtschaft_ziele` prüft jetzt auch „Rest am Ende höchstens 400“
  und „starke Karten erst ab Akt 3“ (statt „keine starke Karte im Laden“).

**Vorher und nachher (Startwerte 1 und 2; derselbe sparsame Sammler in beiden Läufen):**

| Stadt          | sparsam vorher: Ankunft → Abreise | sparsam nachher: Ankunft → Abreise | Waren im Laden (vorher → nachher) | verschwenderisch nachher: Ankunft |
| -------------- | --------------------------------- | ---------------------------------- | --------------------------------- | --------------------------------- |
| Maple Falls    | 0 → 80                            | 0 → 80                             | 7 → 7                             | 0                                 |
| Cedar Creek    | 115 → 215                         | 115 → 215                          | –                                 | 0                                 |
| Riverton       | 250 → 260                         | 250 → 260                          | 6 → 6                             | 135                               |
| Ironwood       | 410 → 360                         | 410 → 360                          | 8 → 8                             | 0                                 |
| Silicon Bay    | 485 → 565                         | 485 → 445                          | 3 → 4                             | 10                                |
| Port Delacroix | 610 → 610                         | 490 → 340                          | 3 → 5                             | 0                                 |
| Desert Springs | 745 → 745                         | 475 → 365                          | 3 → 6                             | 0                                 |
| Summit City    | 870 → 820                         | 490 → 230                          | 4 → 6                             | 0–10                              |
| Crossroads     | 940 → 940                         | 350 → 130                          | 9 → 13                            | 5–15                              |
| Capital Arena  | 990                               | 180                                | 2 → 2                             | 35                                |
| **Ende**       | **1020–1070**                     | **210–260**                        |                                   |                                   |

**Ziele nachher:** sparsamer Spieler überall mindestens Silber (100 %), vor jedem Clubkampf eine
leichte Karte im Besitz oder kaufbar (100 %), Rest am Ende 210 bis 260 (Ziel 100 bis 300,
höchstens 400), alle dauerhaften Karten erreichbar, starke Karte erst ab Akt 3, der
verschwenderische Spieler kann in Akt 4 sieben Waren nicht kaufen.

**Entscheidungen:**

1. _Sparsamer Spieler als Sammler._ Wer nichts kauft, behält jede Münze, egal wie die Preise sind;
   das Ziel „100 bis 300 übrig“ ergibt nur Sinn für einen Spieler, der die Karten auch kauft. Der
   Sammler kauft jede dauerhafte Karte einmal, mit Rücklage für eine leichte Karte vor dem
   nächsten Clubkampf.
2. _Keine Werkzeuge mit Engine._ k6-gegner und k7-ruhe brauchen nur die Stellung, rechnen aber mit
   der Engine; als Karten im laufenden Spiel wären sie zu stark und zu teuer in der Rechenzeit.
3. _Läufervorgabe 200 und zweimal im Laden_ (Desert Springs, Crossroads): die teuerste Ware, damit
   der verschwenderische Spieler in Akt 4 etwas Starkes nicht bekommt.
4. _Lange Auszeit in Crossroads:_ die Turnierrunde gegen Tobias hat eine feste Uhr; Auszeit ist kein
   Spruch, Z4 („Zeitkarten nie im Laden“) betrifft nur die Spruchkarten.

**Ideen für neue Wirkungen (brauchen Code, nicht umgesetzt):**

- Gefahrenradar für mehrere Züge (heute ohne Wert; ein Feld `zuege` wäre nötig).
- Doppelter Fingerzeig (zwei Figuren statt einer).
- Mentor-Zug als Hinweis statt Zug (nur das Zielfeld zeigen).
- Zweite Chance für zwei Züge (zwei Rücknahmen in einer Karte).
- Werkzeuge mit Engine als teure Verbrauchskarten (Gegner?, Ruhe), einmal je Partie.
- Karten, die zwischen Partien wirken (etwa „Vorbereitung“: Steckbrief eines Gegners vorab).

**Prüfungen:** pytest 623 bestanden (3 übersprungen); `ABENTEUER_SIMULATION=1` 3 bestanden
(Startwerte 1 bis 4 einzeln ohne Sackgasse); `npm run pruefen` grün (2434 Tests).

**Nebenbefund Simulation:** Die Nebenquest `portDelacroix.schach960` (Mabel, drei Sets) blieb in
der Rückkehr hängen, weil die Wegsuche über die Erinnerungen aus dem Ort hinausführte (Erinnerungen
zählen zu jedem Gebiet) und der Spieler in der Wüste landete. Entscheidung: Bei der Rückkehr bleibt
die Wegsuche im Zielort und seinen Erinnerungen (`imZiel`), wer doch hinausgerät, reist mit der
Monatskarte zurück, und eine Quest darf bis zu 6000 Schritte brauchen. Am Spiel selbst ändert das
nichts; die Ink-Logik der Bläserin ist in Ordnung.

## Bericht des letzten Auftrags, zur Nachlese

**Erledigt.**

- Neue Option `--wirtschaft` (dazu `--startwerte 1,2,3,4`):
  `node pipeline/abenteuer/gesamtsimulation.cjs --wirtschaft`. Der Durchlauf schreibt jetzt eine
  Zeitachse (Ortswechsel; Münzen aus dem ersten Sieg je Straßengegner, der ersten bestandenen Runde,
  Quests und Funden; Läden; Karten aus Quests und Dialogen; erster Clubkampf je Club). Die neue Datei
  `pipeline/abenteuer/gesamtsimulation-wirtschaft.cjs` spielt diese Zeitachse mit zwei Spielern ab:
  - **sparsam:** kauft nichts auf Vorrat; im Clubkampf zwei Versuche ohne Karte, danach eine leichte
    Karte (dauerhafte zuerst, sonst die billigste leichte aus einem schon besuchten Laden);
  - **verschwenderisch:** kauft in jedem Laden alles, was er bezahlen kann (Karten und Gegenstände),
    und spielt im Clubkampf immer seine stärkste Karte.
    Clubkämpfe nach der Vorgabe: Sieg ohne Karte 40 %, leicht 50 %, mittel 60 %, stark 75 %; Nadel
    nach R17 (ohne Karte Gold, leichte Karten Silber, mittlere oder starke Bronze); 50 Münzen für die
    erste Nadel; Port Delacroix ohne Karten (R28). Jeder Clubkampf 200-mal je Startwert ausgewürfelt.
- Ausgabe je Spieler: Tabelle je Ort (Akt, Münzen bei Ankunft und Abreise des ersten Aufenthalts,
  wie viele Waren des Ortes bei Ankunft und Abreise bezahlbar sind, Zahl der Karten), Tabelle je
  Clubkampf (Anteil mindestens Silber, Versuche, davon mit Karte, Anteil „Karte im Besitz oder
  kaufbar“, schlechteste Nadel) und die Ziele.
- Test: `test_wirtschaft_ziele` in `pipeline/tests/test_abenteuer_simulation.py` (nur mit
  `ABENTEUER_SIMULATION=1`, ein Startwert) prüft die drei Ziele, damit neue Karten oder Preise sie
  nicht stillschweigend verletzen. Die drei Simulationstests zusammen brauchen etwa 2 Minuten 20.
- `--startwert` und die übrigen Argumente liest jetzt `gesamtsimulation.cjs` selbst; so bleibt
  `gesamtsimulation-regeln.cjs` unter 400 Zeilen.

**Ergebnis (Startwerte 1 bis 4, gleiche Werte bis auf wenige Münzen):**

| Stadt          | Akt | sparsam: Münzen Ankunft → Abreise | im Laden bezahlbar (sparsam, Ankunft) | Clubkampf sparsam: mind. Silber, Versuche, davon mit Karte |
| -------------- | --- | --------------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| Maple Falls    | 1   | 0 → 110                           | 0 von 7 (bei Abreise 7 von 7)         | 100 %, 2,2, 0,6                                            |
| Cedar Creek    | 1   | 145 → 245                         | kein Laden                            | 100 %, 2,5, 0,8                                            |
| Riverton       | 2   | 280 → 295                         | 6 von 6                               | 100 %, 2,4, 0,7                                            |
| Ironwood       | 2   | 440 → 450                         | 7 von 8 (Kartentasche 450 nicht)      | 100 %, 2,1, 0,5                                            |
| Silicon Bay    | 3   | 575 → 655                         | 3 von 3                               | 100 %, 2,1, 0,5                                            |
| Port Delacroix | 3   | 700 → 700                         | 3 von 3                               | 100 % (Gold, ohne Karten), 2,4, 0                          |
| Desert Springs | 3   | 835 → 835                         | 3 von 3                               | 100 %, 2,4, 0,8                                            |
| Summit City    | 4   | 975 → 990                         | 4 von 4                               | 100 %, 2,5, 0,8                                            |
| Capital Arena  | 4   | 1155                              | 2 von 2 (nur Fanartikel)              | (Turnier, kein Clubkampf)                                  |

Der verschwenderische Spieler gibt alles aus: ab Ironwood kommt er mit 0 bis 15 Münzen in jede
Stadt, weil er die großen Gegenstände kauft (Monatskarte, Fahrrad, Laterne, Reisebrett,
Kartentasche). Er spielt immer eine Karte und holt deshalb fast nur Bronze (in Port Delacroix Gold,
weil dort Karten gesperrt sind).

**Ziele:**

1. _Sparsamer Spieler in jeder Stadt mindestens Silber:_ ja, in 100 % der Läufe.
2. _Kein Clubkampf ohne Kaufmöglichkeit:_ ja, vor jedem Clubkampf ist eine leichte Karte im Besitz
   (Fingerzeig von Ambrose ab Szene 2) oder bezahlbar, in 100 % der Läufe.
3. _Starke Karten nicht vor Akt 2 bezahlbar:_ ja; keine starke Karte steht in einem Laden (G3:
   Vorgaben, Mentor-Zug und Sanduhr nie käuflich). Der verschwenderische Spieler kauft die erste
   mittlere Karte in Akt 2 (Remisangebot in Riverton). Flüstern (mittel, 40) im Kiosk von Maple Falls
   ist für den sparsamen Spieler am Ende von Akt 1 bezahlbar (110 Münzen); das ist so geplant
   (docs/spiel/11, 7.2).

**Änderungen an Preisen und Belohnungen:**

| Ware oder Belohnung | alt | neu | warum                                                                                                                                                                          |
| ------------------- | --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| (keine)             | –   | –   | Alle drei Ziele sind mit den heutigen Preisen erfüllt; jede Erhöhung würde dem Wunsch des Autors („je mehr Karten, desto besser“) entgegenlaufen, ohne ein Ziel zu verbessern. |

**Beobachtungen und Vorschläge (keine Änderung, Entscheidung beim Haupt-Chat):**

- Ab Riverton kann der sparsame Spieler jeden Laden leer kaufen, und am Ende hat er über 1100 Münzen.
  Für „je mehr Karten, desto besser“ ist das ein guter Vorrat. Wenn neue Karten kommen, sind Akt 3
  und Akt 4 der richtige Platz für teurere Waren (die Läden dort haben nur drei oder vier). Die
  Bibel nennt dafür schon Bretthintergründe und Album-Waren.
- Der verschwenderische Spieler ist ab Akt 2 dauerhaft knapp, weil die Gegenstände teuer sind. Das
  ist gewollt: Wer alles kauft, hat keine Rücklage.
- Mit `--wirtschaft` lässt sich jede neue Karte sofort gegen die drei Ziele prüfen.

**Prüfungen:** pytest 622 bestanden, 3 übersprungen; mit `ABENTEUER_SIMULATION=1` alle 3
Simulationstests bestanden (etwa 2 Minuten 20). ruff sauber, `npm run pruefen` grün (2422 Tests).

## Bericht des letzten Auftrags, zur Nachlese

**Erledigt.**

- `pipeline/abenteuer/gesamtsimulation.cjs` (Erkunden, Bericht, Aufruf) und
  `pipeline/abenteuer/gesamtsimulation-regeln.cjs` (Spieldaten, Spielstand, Quests, Dialoge, Folgen
  wie in der App). **Entscheidung:** zwei Dateien statt einer, weil eine Datei fast 500 Zeilen hätte
  und CLAUDE.md, Regel 4, unter 400 verlangt. Dateikopf auf Deutsch mit Zweck, Aufruf und Ausgabe,
  Pfade nur innerhalb des Repositorys (inkjs aus `app/node_modules`).
- Aufruf aus dem Hauptordner: `node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1`
  (dazu `--sekunden N` als Zeitbudget, `--ersatz a.b,c.d` setzt bekannte Figuren ohne Karte
  ersatzweise auf die Karte ihrer Dialogdatei). Ausgabe: Abspann ja oder nein, besuchte Orte,
  offene Quests (hängend oder nie begonnen), nie erreichte Knoten, Figuren ohne Karte, Rückkehr mit
  der Monatskarte, nie besuchte Orte, Meldungen (fehlende Dialoge, Knoten, Karten, Begegnungen).
  **Rückgabewert 1**, wenn eine Hauptquest nicht fertig wird, eine begonnene Quest hängt, der
  Abspann fehlt oder Daten fehlen; sonst 0. Nie begonnene Nebenquests zählen nicht (manche sind
  freiwillig, etwa die Feier in Ironwood, die es nur vor dem Clubkampf gibt).
- Figuren ohne Karte werden nur noch gemeldet, nicht mehr ersatzweise gesetzt (außer mit
  `--ersatz`). Nachtrag nach dem Hereinholen von 43d3d2f6: niedrig-1 hat die fünf Figuren gesetzt,
  die Liste der bekannten Ausnahmen ist entfernt; der Test verlangt jetzt, dass jede Figur auf einer
  gezeichneten Karte steht.
- `pipeline/tests/test_abenteuer_simulation.py`: ein Startwert, nur mit `ABENTEUER_SIMULATION=1`
  (sonst `pytest.skip` mit Begründung; ebenso ohne Node oder ohne `app/node_modules/inkjs`).
  Prüft Rückgabewert 0, Abspann, keine offene Hauptquest und die Liste der Figuren ohne Karte.
- **Laufzeit:** etwa 64 Sekunden für einen Startwert, also nicht deutlich unter einer Minute; die
  Bedingung `ABENTEUER_SIMULATION=1` bleibt. Schneller wurde der Lauf vor allem durch gezieltes
  Laufen: Der Spieler sucht mit einer Breitensuche die erreichbare Karte des Gebiets, die er am
  längsten nicht besucht hat, statt zufällig umherzugehen, und fasst Dinge, die sich im selben
  Zustand nichts mehr tun, nicht immer wieder an.
- Mit den Startwerten 1 bis 4: in allen Läufen Abspann, alle Hauptquests fertig, Rückgabewert 0.
  Mit den gesetzten Figuren werden jetzt auch `mapleFalls.verlorenesBrett` und
  `mapleFalls.lilysSpringer` fertig; in einem Lauf bleibt `mapleFalls.samsDame` nie begonnen (der
  Spieler verlässt Maple Falls, bevor er Sam wieder anspricht; Sam steht auf der Karte, keine
  Sackgasse).

**Befund des Skripts, behoben:** `cedar-creek-archiv.ink`: Wer beim Ordnen „Später helfen“ sagte und
danach die Clubnadel holte, bekam das Ordnen nie wieder angeboten (Bedingung `nadelCedarCreek ==
0`), die Quest `cedarCreek.archivOrdnen` hing. Neu: `ordnenAngeboten`, einmal angeboten bleibt
das Angebot.

**Prüfungen:** pytest 595 bestanden, 2 übersprungen (die Simulation ohne Umgebungsvariable); mit
`ABENTEUER_SIMULATION=1` beide bestanden (64 Sekunden). ruff sauber, `npm run pruefen` grün
(2422 Tests).

## Bericht des letzten Auftrags, zur Nachlese

**1. Akt 4 abgestimmt (Commit 76d88e57).**

- Capital Arena: Novas Aussage hat drei Fassungen. `novaHilfeZugesagt`: Der Held steht neben ihr wie
  versprochen, sie dankt. Nur `novaBitteGehoert` (in Crossroads abgelehnt): Sie sucht den Helden im
  Saal und schafft es allein. Keins von beiden: Sie steht allein da. Dazu passen Novas Satz nach der
  Aussage und ihr Daumen bei der Ankunft (Szene 103).
- Ghost Town: Victor liest `hatHalesSeite` (die Seite liegt beim Helden, der Held gibt sie nach der
  Partie zurück) und `victorSeiteGegeben` (Seite gegeben, aber nicht mehr im Besitz: Victor kennt sie
  auswendig). Fehlt beides, zieht Victor sie selbst aus seinem Buch.

**2. Gesamtsimulation vom Dachboden bis zum Abspann.**

Ein Spieler-Simulator (Node, inkjs), der wie `Oberwelt.tsx` arbeitet: Figuren und Auslöser aus den
gezeichneten Tiled-Karten, Knoten werden gemeldet, sobald eine Zeile darin steht, Quests streng der
Reihe nach. Übergänge mit Dialog prüfen `wenn` nach dem Dialog, Übergänge ohne Dialog gelten sofort;
`reise`, Läden (Gegenstände), Funde, Karten, `zeigeAbspann()` sind eingebaut. Jede Begegnung läuft
abgebrochen → niederlage → remis → sieg, jede Runde erst nicht bestanden, dann bestanden; die Wahlen
sind zufällig mit festem Startwert. Der Simulator geht die Gebiete in der Reihenfolge der Bibel ab,
fasst in jedem Gebiet alles an, bis sich nichts mehr ändert, und reist am Ende mit der Monatskarte
dorthin zurück, wo noch Quests offen sind.

**Ergebnis mit vier Startwerten:** In allen vier Läufen kommt der Abspann, alle Hauptquests von Akt 1
bis Akt 4 sind fertig, alle 26 Orte außer dem Bayou werden besucht. Offen bleibt in einem Lauf die
Nebenquest `desertSprings.erinnerung1858` (in den anderen drei fertig, also ein Zufall der Wahlen).
Den Bayou erreicht man über `portDelacroix.bayou`, sobald `musikhausOffen` gilt; der Simulator macht
die Rückkehr nach Port Delacroix nur für die offenen Quests und geht nicht mehr hinaus.

**Gefunden und behoben (meine Dateien):**

1. _Akt 1, Dachboden (Sackgasse):_ Wer den König fallen lässt und wegrennt, hat `brettBeruehrt`; beim
   zweiten Mal sprang der Dialog direkt zu Ambroses Knoten, `ambrose_erwacht` kam nie, die erste
   Hauptquest `mapleFalls.dasBrett` hing. Jetzt führt `ambrose` zuerst nach `ambrose_erwacht`, bis er
   gesehen ist (`ambroseErwachtGesehen`).
2. _Akt 1, Wohnzimmer (Sackgasse):_ Mama zeigte den ersten Abend schon vor dem Gespräch mit Ambrose
   nach der ersten Partie; die Quest `mapleFalls.ersterAbend` beginnt aber erst dort und wartete dann
   für immer. Mama wartet jetzt auf `ersteLektionBesprochen`.
3. _Akt 1, Clubraum (Sackgasse):_ In `orte.json` gibt es weder Victor in Maple Falls noch Juno im
   Clubraum; `victor_trifft` (Start von `mapleFalls.besserWerden`, setzt `kenntHale`) und Junos Reihe
   waren unerreichbar, also kam niemand aus Maple Falls heraus. Der Coach führt jetzt zu Junos Reihe
   (nach Sams Reihe) und zu Victor (nach der Clubnadel). Folge: `victor_weg` ist nicht mehr erreichbar
   (nur ein Alltagssatz).
4. _Quest `ironwood.turnierheft` (Sackgasse, Haupt-Chat):_ Start und erster Schritt warteten auf
   denselben Knoten `oma_ruth_heft`, der nur einmal kommt. Start jetzt beim Betreten von Mamas Zimmer.
   Eine Prüfung aller Quests auf dieses Muster fand sonst nichts.
5. _Port Delacroix:_ Wer nach dem Clubkampf gleich den Wüstenzug nahm, ließ die Hauptquest
   `portDelacroix.tiefpunkt` für immer offen (letzter Schritt war Odiles Handschlag). Der Handschlag
   bleibt als Szene, ist aber kein Questschritt mehr.
6. _Ghost Town:_ Ebenso fehlte die Nacht (Szene 101), wenn man nach der Fernpartie sofort zum Bus ging.
   Der Bus-Dialog spielt die Nacht jetzt vorher.

**Für den Haupt-Chat oder niedrig-1 (nicht meine Dateien):**

- Figuren ohne Platz auf einer gezeichneten Karte: `mapleFalls.juno`, `mapleFalls.lily`,
  `mapleFalls.abernathy`, `pinewoodCamp.lou`, `pinewoodCamp.tamsin`. Ohne sie fehlen in der App Junos
  Begegnung draußen, Lilys Springer-Quest, der Bibliothekar mit dem Brief (Fragment, `kenntHale`!) und
  zwei Kinder im Camp. Der Simulator setzt sie ersatzweise auf die Karte ihrer Dialogdatei.
- In `orte.json` eine Figur `mapleFalls.victor` (Clubraum, `maple-falls-clubraum.victor`) und Juno im
  Clubraum wären sauberer als der Umweg über den Coach.
- Knoten, die in keinem Lauf vorkamen, sind nur andere Reihenfolgen (etwa Mama vor dem Dachboden,
  Henri vor dem Vorwurf): `maple-falls-wohnzimmer.ankunft`, `cedar-creek-aussen.ankunft`,
  `cedar-creek-archiv.karton_fremd`, `maple-falls-aussen.juno_zum_club`,
  `maple-falls-clubraum.victor_ueberrascht`, `port-delacroix-werkstatt.henri_vorher`,
  `riverton-aussen.albescu_wartet`, `desert-springs-garage.garage_wartet`; dazu der Bayou (siehe oben).
- Variablen: Nur von der Hülle gesetzt und in Ink gelesen (richtig so): `hatFahrrad`, `hatLaterne`,
  `hatLimo`, `hatHalesSeite`, `mentorzugFreiGespielt`, `siegeRivertonHarlan`. Deklariert, aber nicht
  benutzt (harmlos, mittel-2): `held` in `silicon-bay-lobby`, `summit-city-aussen`,
  `summit-city-bergstation`; `nadelSummitCity` in `summit-city-aussen`. Nie gesetzte Variablen, die
  eine Szene sperren, gibt es nicht mehr.

**Das Skript:** liegt vorerst nur lokal (`gesamtsimulation.cjs`, etwa 300 Zeilen, Laufzeit etwa vier
Minuten je Startwert, die Ausgabe nennt hängende Quests, nie erreichte Knoten, Figuren ohne Karte und
nie besuchte Orte). Vorschlag laut Vorgabe 3: als `pipeline/abenteuer/gesamtsimulation.cjs` mit einem
Test in `pipeline/tests/`, der es mit Node aufruft (übersprungen ohne Node) und verlangt, dass alle
Hauptquests fertig werden und der Abspann kommt. Ich lege es ab, sobald der Haupt-Chat zustimmt.

**Prüfungen:** pytest 595 bestanden, `npm run pruefen` grün (2422 Tests), Abenteuerpaket baut,
Zufallsdurchläufe aller Knoten ohne Fehler.

## Bericht des letzten Auftrags, zur Nachlese

**Erledigt.**

- **Acht Ink-Dateien neu:** `weg-pinewood-ghost.ink` (Szene 97, Juniper mit Drei-Schach, Tafel),
  `ghost-town-aussen.ink` (Ankunft, Mr. Pruitt, Szene 98 das Grab, Szene 101 die Nacht),
  `ghost-town-saloon.ink` (Szene 100 Fernpartie mit Victor, Auslöser des Flashbacks über das
  Postreiterabzeichen), `erinnerung-siedlung.ink` (Szene 99 Die letzte Kerze),
  `weg-ghost-capital.ink` (Szene 102, Abe Lindgren mit König der Hügel, Tafel, Linse),
  `capital-arena-aussen.ink` (Ankunft, Szene 103 mit der Liga aus den acht Nadeln, Mama, Juno,
  Szene 109 Abschied mit `zeigeAbspann()`), `capital-arena-halle.ink` (Szenen 104 bis 108),
  `bayou.ink` (L5, Theron). Dazu die Knoten `bayou` in `port-delacroix-aussen.ink` und `blaeser`
  in `port-delacroix-musikhaus.ink` (L1). Alle Knoten aus `orte.json` sind vorhanden.
- **Begegnungen:** `capitalArena.runde1` bis `runde4` (Turnier, Farbe zufällig, Wahl der Zeit,
  Runde 4 fest 5 + 3), `capitalArena.halbfinale` (Kade, `freieKarten: ["mentorzug"]`,
  `abgelenktAb: {halbzug: 40, faktor: 1.5}`), `capitalArena.finale` (Victor, keine Karten).
  `ghostTown.fernpartie` stand schon aus dem letzten Auftrag.
- **Runden:** `wegPinewoodGhost.tafel` (Abzug, Doppelschach), `wegGhostCapital.tafel` (Thema
  `endspiel`).
- **Quests:** Hauptquest `ghostTown.fernpartie` (Grab, Flashback, Partie bei jedem Ausgang, Victor,
  Nacht; Szenen `akt4.ghostTown` bis `akt4.ambroseSagtEs`), Hauptquest `capitalArena.meisterschaft`
  (Arena, Vorrunde geschafft, Aussage, Halbfinale gewonnen, vor dem Finale, Finale bei jedem
  Ausgang, Abschied; Szenen `akt4.arena` bis `akt4.abschied`), zwei Tafel-Quests.
- **Funde:** `postreiterabzeichen`, `schlussstellungFernpartie` (Extra `brett-fernpartie-1866`),
  `leuchtturmlinse` (10 Münzen), `teilnehmerausweis`. **Laden:** `capitalArena.fanshop` (Schal 20,
  Teilnehmeranstecker 10, beides ohne Spielwirkung). 30 neue Textschlüssel.
- **Prüfungen:** pytest 470 bestanden, `npm run pruefen` grün (2422 Tests), das Paket baut. Die
  Simulation spielt von Weg 10 bis zum Abschied, mit abgebrochener Fernpartie, verlorener
  Vorrunde (1,5 Punkte, dann Wiederholung von Runde 1), verlorenem Halbfinale und Remis im Finale:
  alle vier Quests fertig. Zufallsdurchläufe aller Knoten ohne Fehler.

**Entscheidungen.**

1. **Turniermodus in Ink:** `punkt()` zählt Sieg 1 und Remis ½, `punktetext()` schreibt „1,5“.
   Die Turnierleiterin bietet die nächste ungespielte Runde an; sind alle gespielt und es reicht
   nicht, bietet sie die erste nicht gewonnene Runde noch einmal an. Ab 2,5 Punkten geht es weiter.
2. **Halbfinale nur mit Sieg:** Ein K.-o.-Spiel braucht einen Sieger; bei Remis oder Niederlage
   spielt man noch einmal. Ambrose sagt vor der Partie „Ein einziges Mal …“, im Gang vor dem
   Finale je nach `mentorzugFreiGespielt` „Das war meine unsterbliche Partie. Mit dir.“ oder „Du
   hast mich nicht gerufen. Und trotzdem gewonnen.“ Im Finale schweigt er.
3. **Flashback 1866 ohne Klassikersammlung:** Die Fernpartie steht nicht in `klassiker.json` (nicht
   meine Datei); deshalb rät der Held die vier Züge 37. Txd7, 38. Da3, 39. Dg3+, 40. Kxg3 als Wahl
   im Dialog, mit je zwei legalen falschen Zügen und freundlicher Berichtigung, und am Ende einer
   Zählung („Vier von vier“). Mit einer Klassiker-Kennung für die Fernpartie ließe sich das auf
   eine Runde mit `erinnerung` (ab Zug 37, Weiß) umstellen.
4. **Reihenfolge in Ghost Town:** Grab → Abzeichen (erst nach dem Grab zu finden; mit Laterne
   anders erzählt, aber ohne Laterne nicht gesperrt) → Erinnerung → Fernpartie → Nacht. Der Bus
   zur Arena fährt erst nach der Fernpartie (`fernpartieGespielt`, Bedingung in `orte.json`).
5. **Hales Seite und Brief:** Victor liest `gefundenHalesSeite` (angenommener Fund `halesSeite` von
   mittel-2, Szene 88) und `briefGelesen`; fehlen sie, kennt er Hales Antwort auswendig. Nichts
   ist hart gesperrt, damit die Hauptquest nicht an einer Nebenquest hängt.
6. **Liga in Ink:** Juno zählt die Nadeln der acht Clubs selbst zusammen und nennt die Liga (R22).
7. **Sprecher ohne Porträt:** Postreiter und Bläserin sprechen als Erzähler (der Porträt-Test
   verlangt für jeden Sprecher ein Bild).
8. **Varianten** (Drei-Schach, König der Hügel, Nebelschach, Schach960) werden nur erzählt, bis die
   Technik da ist.

**Offen (nicht meine Dateien):**

- Keine Sprüche im Turnier (S2): `kartenErlaubt` gilt für alle Karten. Vorschlag: den Turniergegnern
  in `gegner.json` `immunGegen` mit den Spruchkarten geben (außer Kühler Kopf für Tobias, der ist
  eine Zeitkarte), oder ein Begegnungsfeld `spruecheErlaubt: false`.
- Fragment 8 (Ward, Summit City) bei mittel-2.
- Fund `halesSeite` (mittel-2): Name bitte so, sonst die Variable in `ghost-town-saloon.ink` anpassen.

## Bericht des letzten Auftrags, zur Nachlese

**Fertig:**

- **13 Orte** in `orte.json` (Staffel 2): Städte `summitCity` (Nr. 8, Club 8), `crossroads` (9),
  `pinewoodCamp` (10), `ghostTown` (11), `capitalArena` (12); Wege `wegDesertSummit`,
  `wegSummitCrossroads`, `wegCrossroadsPinewood`, `wegPinewoodGhost`, `wegGhostCapital`; die
  Abzweigung `hochebene` und die Rückkehr `bayou` (L5) als Ort-Art `weg`; die Erinnerung
  `erinnerungSiedlung` (Szene 99, Sepia) als Ort-Art `erinnerung`. 25 Karten, alle Übergänge in
  beiden Richtungen, Hauptroute Desert Springs → Summit City → Crossroads → Pinewood Camp → Ghost
  Town → Capital Arena. Sperren: Weg 8 nach der Nadel von Summit City (`nadelSummitCity`), Weg 11
  nach der Fernpartie (`fernpartieGespielt`).
- **Club 8** „Endspielrunde in der Berghütte“: Kapitel 8 und 9, Chefin Ward, Mitglieder Kit und
  Haraldsen, zwölf Buchübungen aus 07 (Opposition bis falscher Läufer), Themen `endspiel` und
  `umwandlung`.
- **12 Gegner** in `gegner.json` mit Steckbrief: Ward (Clubchefin, E + 640, Endspiel +1,
  Eröffnung −1, Schwäche Tempoverlust, Damengambit mit 25 % Abweichung), Kit und Haraldsen
  (Clubmitglieder, Endspiel +1), Sol (Straße, A − 50), Victor frei (Story, E + 400, Szene 88),
  Hollis (Straße, A − 100), die Turniergegner Bea (E + 550), Marcus (E + 583, blinder Fleck
  stille Züge), Nova (E + 617), Tobias (E + 650), Kade (E + 650, `menschlich: false`) und Victor im
  Finale (E + 700). Die Turnierstärken sind die Werte der Bronze-Liga; die Liga legt nach R22
  ihren Aufschlag darauf. Keiner ist gegen Sprüche immun (Bibel: keine Sprüche im Turnier, Sol
  nicht immun).
- **5 Begegnungen** in `begegnungen.json`: `ghostTown.fernpartie` (Stellungsduell, siehe Entscheidung 4), `summitCity.clubkampf` (Wahl der Zeit, Karten erlaubt),
  `summitCity.victorFrei` (Grundstellung, ohne Uhr, Karten erlaubt), `summitCity.sol`
  (Stellungsduell 3 + 2), `pinewoodCamp.hollis` (Stellungsduell ohne Uhr).
- **62 Textschlüssel** (Orte, Karten, Figuren, Club, `steckbrief.fleck.ruhig` für Marcus).
- Prüfungen: pytest 470 bestanden (die neuen Karten sind noch nicht gezeichnet und werden
  übersprungen), `npm run pruefen` grün, Abenteuerpaket baut.

**Entscheidungen:**

1. **Stellungen der Straßenduelle, geprüft mit Stockfish 19:** Die Bibel nennt für Sol 8.44 oder
   8.48; beide sind zu groß (8.44: +2,84 bei Tiefe 28, 8.48: +6,1). Kein Diagramm aus Kapitel 8 mit
   Weiß am Zug liegt bei etwa +1 (alle Werte zwischen 0 und +0,4 oder über +2,4). Aus Kapitel 9
   lagen 9.41 und 9.53 bei +1,1 und +0,8, aber beide sind theoretisch remis (falscher Läufer,
   Randbauer). **Sol** spielt deshalb **6.21** (+0,84 bei Tiefe 24), **Hollis** wie in der Bibel
   **6.14** (+0,83 bei Tiefe 24); 6.5 bleibt bei Batiste.
2. **Hochebene neutral (Q21-1 offen):** Ort `hochebene` mit den Karten `felsentuerme` und `schule`
   (eine Schule passt zu beiden Antworten), noch ohne Figuren und ohne Begegnung.
3. **Varianten und Meisterschaft ohne Begegnungen:** Figuren und Auslöser stehen (Earl, Bell, Ray,
   Greta, Juniper, Abe, Theron, die Bläserin im Musikhaus, Drachenbrunnen, Varianten-Tisch,
   Lagerfeuer, Turniertafel). Begegnungen für L1 bis L10, für die Vorrunde, das Halbfinale und das
   Finale folgen mit der neuen Technik (Bibel, Abschnitt 34). Die Gegnerprofile der Meisterschaft
   sind schon da.
4. **Fernpartie (Nachtrag nach Bibel, Abschnitt 35):** Begegnung `ghostTown.fernpartie` als
   Stellungsduell aus der Duell-FEN `6k1/p2R4/2n4p/1p6/2n1P3/6KP/P5P1/8 w - - 0 41` (Turm gegen zwei
   Springer, +1,44 bis +1,85 nach der Bibel), 15 Züge, Mindestvorteil 1,0, Leser Weiß, ohne Uhr,
   Karten gesperrt. Gegner ist `summitCity.victor` (Story, E + 400); Victor im Saloon trägt diesen
   Gegner. Fragment 8 (Ward, Erinnerung Hastings) fehlt noch, bis die Quests von Akt 4 stehen.
5. **Anschluss an Akt 3:** Neue Auslöser in bestehenden Orten: `desertSprings.highway` (zum Weg 7,
   wenn `endeAkt3Gesehen`), `portDelacroix.bayou` (zum Bayou, wenn `musikhausOffen`) und die Figur
   `portDelacroix.blaeser` im Musikhaus (L1). Die Karten von Desert Springs und Port Delacroix sind
   schon gezeichnet; die Rückwege zielen deshalb vorerst auf vorhandene Objekte (`bahnhof` und
   `deich`). Sobald niedrig-1 die Objekte `highway` und `bayou` ergänzt, sollen die Rückwege
   dorthin zeigen.
6. **Flashback in Ghost Town:** Der Übergang `abzeichen` im Saloon führt nach dem Fund des
   Postreiterabzeichens (`abzeichenGefunden`) in die Erinnerung; `rueckkehr` führt zurück an
   dieselbe Stelle.
7. **Porträts:** `portraets/<name>.svg` mit den Namen der 20 Porträts von mittel-2 (alle vorhanden); Victor und Nova nutzen ihre vorhandenen Bilder, Ray Castillo heißt als Figur `figuren/ray-castillo.png`.

**Zu zeichnende Karten (für niedrig-1).** 25 Karten; je Karte ein `start` für die erste Karte eines
Weges, sonst Ankunft an den genannten Objekten:

| Karte                                                          | Datei                                              | Art   | Objekte (Figuren und Auslöser)                                                                                              |
| -------------------------------------------------------------- | -------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------- |
| `wegDesertSummit.diner` (Diner an der Wüstenstraße)            | `karten/weg-desert-summit-diner.json`              | außen | earl; start, zurueckDesert, tafel, fundNeonK, weiterBergstrasse                                                             |
| `wegDesertSummit.bergstrasse` (Bergstraße)                     | `karten/weg-desert-summit-bergstrasse.json`        | außen | –; zurueckDiner, abzweigHochebene, weiterSummit                                                                             |
| `hochebene.felsentuerme` (Felsentürme)                         | `karten/hochebene-felsentuerme.json`               | außen | –; start, zurueckBergstrasse, weiterSchule                                                                                  |
| `hochebene.schule` (Schule am Rand der Hochebene)              | `karten/hochebene-schule.json`                     | außen | –; zurueckFelsentuerme                                                                                                      |
| `summitCity.aussen` (Summit City, Talstation)                  | `karten/summit-city-aussen.json`                   | außen | sol; wegDesert, huetteTuer, bergladenTuer, seilbahnTal, drachenbrunnen, wegCrossroads                                       |
| `summitCity.huette` (Hütte der Großmeisterin)                  | `karten/summit-city-huette.json`                   | innen | ward, kit, haraldsen; huetteAusgang, pokal, kaminfeuer                                                                      |
| `summitCity.bergstation` (Bergstation der Seilbahn)            | `karten/summit-city-bergstation.json`              | innen | victor; seilbahnBerg, fundMurmeltierpfeife                                                                                  |
| `summitCity.bergladen` (Bergladen)                             | `karten/summit-city-bergladen.json`                | innen | –; bergladenAusgang, theke                                                                                                  |
| `wegSummitCrossroads.geysirbecken` (Geysirbecken)              | `karten/weg-summit-crossroads-geysirbecken.json`   | außen | bell; start, zurueckSummit, tafel, fundBisonhaar, bisons, weiterPraerie                                                     |
| `wegSummitCrossroads.praerie` (Prärie)                         | `karten/weg-summit-crossroads-praerie.json`        | außen | ray; zurueckGeysirbecken, sturmkeller, weiterCrossroads                                                                     |
| `crossroads.aussen` (Crossroads, Kreuzung)                     | `karten/crossroads-aussen.json`                    | außen | slick, mira, bigJoe, rosie; wegSummit, raststaetteTuer, wegweiser, wegPinewood                                              |
| `crossroads.raststaette` (Raststätte von Darlene)              | `karten/crossroads-raststaette.json`               | innen | darlene, nova; raststaetteAusgang, variantenTisch, postkarten                                                               |
| `wegCrossroadsPinewood.huetten` (Schutzhütte am Fernwanderweg) | `karten/weg-crossroads-pinewood-huetten.json`      | außen | greta; start, zurueckCrossroads, tafel, weiterRiesenbaeume                                                                  |
| `wegCrossroadsPinewood.riesenbaeume` (Unter den Riesenbäumen)  | `karten/weg-crossroads-pinewood-riesenbaeume.json` | außen | –; zurueckHuetten, rangerhaus, weiterCamp                                                                                   |
| `pinewoodCamp.aussen` (Pinewood Camp am See)                   | `karten/pinewood-camp-aussen.json`                 | außen | ezra, hollis, dex, mae, lou, tamsin; wegCrossroads, lagerfeuer, kiosk, wegGhost                                             |
| `wegPinewoodGhost.canyonrand` (Canyonrand)                     | `karten/weg-pinewood-ghost-canyonrand.json`        | außen | juniper; start, zurueckCamp, tafel, weiterStaubstrasse                                                                      |
| `wegPinewoodGhost.staubstrasse` (Staubstraße)                  | `karten/weg-pinewood-ghost-staubstrasse.json`      | außen | –; zurueckCanyonrand, weiterGhost                                                                                           |
| `ghostTown.aussen` (Ghost Town, Hauptstraße)                   | `karten/ghost-town-aussen.json`                    | außen | pruitt; wegPinewood, saloonTuer, grab, sternenhimmel, wegCapital                                                            |
| `ghostTown.saloon` (Saloon)                                    | `karten/ghost-town-saloon.json`                    | innen | victor; saloonAusgang, fernpartieBrett, abzeichen                                                                           |
| `erinnerungSiedlung.huette` (Bretterhütte, 1866)               | `karten/erinnerung-siedlung-huette.json`           | innen | postreiter; ankunft, kerze, rueckkehr                                                                                       |
| `wegGhostCapital.seeufer` (Seeufer)                            | `karten/weg-ghost-capital-seeufer.json`            | außen | –; start, zurueckGhost, tafel, weiterLeuchtturm                                                                             |
| `wegGhostCapital.leuchtturm` (Leuchtturm)                      | `karten/weg-ghost-capital-leuchtturm.json`         | außen | abe; zurueckSeeufer, fundLinse, weiterCapital                                                                               |
| `capitalArena.aussen` (Capital Arena, Vorplatz)                | `karten/capital-arena-aussen.json`                 | außen | mama, juno; wegGhost, halleTuer, treppe                                                                                     |
| `capitalArena.halle` (Turnierhalle)                            | `karten/capital-arena-halle.json`                  | innen | turnierleiterin, lin, grahamHale, bea, marcus, nova, tobias, kade, victor; halleAusgang, turniertafel, pressetisch, fanshop |
| `bayou.steg` (Bootssteg im Bayou)                              | `karten/bayou-steg.json`                           | außen | theron; start, zurueckDelacroix, nebel                                                                                      |

**Für die Dialoge (Knoten aus `orte.json`):**

- `bayou.ink`: theron, zurueck_delacroix, nebel
- `capital-arena-aussen.ink`: ankunft_zu_fuss, mama, juno, weg_ghost, halle_betreten, treppe
- `capital-arena-halle.ink`: turnierleiterin, lin, graham_hale, bea, marcus, nova, tobias, kade, victor, turniertafel, pressetisch, fanshop
- `crossroads-aussen.ink`: ankunft_zu_fuss, slick, mira, big_joe, rosie, weg_summit, wegweiser, weg_pinewood
- `crossroads-raststaette.ink`: darlene, nova, varianten_tisch, fund_postkarte
- `desert-springs-aussen.ink`: highway
- `erinnerung-siedlung.ink`: postreiter, kerze, rueckkehr
- `ghost-town-aussen.ink`: ankunft_zu_fuss, pruitt, weg_pinewood, grab, nacht, weg_capital
- `ghost-town-saloon.ink`: victor, brett, fund_abzeichen
- `hochebene.ink`: zurueck
- `pinewood-camp-aussen.ink`: ankunft_zu_fuss, ezra, hollis, dex, mae, lou, tamsin, weg_crossroads, lagerfeuer, kiosk, weg_ghost
- `port-delacroix-aussen.ink`: bayou
- `port-delacroix-musikhaus.ink`: blaeser
- `summit-city-aussen.ink`: ankunft_zu_fuss, sol, weg_desert, seilbahn, drachenfest, weg_crossroads
- `summit-city-bergladen.ink`: theke
- `summit-city-bergstation.ink`: victor, fund_pfeife
- `summit-city-huette.ink`: ward, kit, haraldsen, pokal, kaminfeuer
- `weg-crossroads-pinewood.ink`: greta, zurueck_crossroads, tafel, rangerhaus
- `weg-desert-summit.ink`: earl, zurueck_desert, tafel, fund_neon, abzweig_hochebene
- `weg-ghost-capital.ink`: abe, zurueck_ghost, tafel, fund_linse
- `weg-pinewood-ghost.ink`: juniper, zurueck_camp, tafel
- `weg-summit-crossroads.ink`: bell, ray, zurueck_summit, tafel, fund_bisonhaar, bisons, sturmkeller

**Offen für den Haupt-Chat:**

- Runden für Akt 4 (`runden.json` war nicht freigegeben): `summitCity.reiheKit`,
  `summitCity.reiheHaraldsen`, `summitCity.erinnerungHastings` (`klassik-steinitz-bardeleben`, Weiß
  ab Zug 17), die Tafeln der fünf Wege.
- Läden aus Abschnitt 31 (`summitCity.bergladen`, `crossroads.raststaette`, `pinewoodCamp.kiosk`,
  `capitalArena.fanshop`), Funde aus Abschnitt 30, Quests.
- Thema `endspiel` für Runden ist noch nicht an den Endspieltrainer angeschlossen; bis dahin wirkt
  im Club nur `umwandlung`.

## Bericht des letzten Auftrags, zur Nachlese

**Erledigt.**

1. **Funde:** neun Einträge in `funde.json` mit Name und Text: `anstecker` (5 Münzen),
   `ohrstoepsel`, `zeroTablet` (von mittel-2), `flaschenpost` (10), `muschelMitLoch` (5),
   `erstesBrettMusikhaus` (Extra `brett-musikhaus-am-kai`), `eidechsenhaut` (5),
   `nietenCanyonbruecke`, `halesBrief`. Münzen nach der Fundtabelle der Bibel (Abschnitt 21). Alle
   `gibFund`-Aufrufe sind aktiv, auch in `weg-ironwood-silicon.ink` und `silicon-bay-akademie.ink`.
   Die Dialoge behalten ihre eigenen Merker (Befund 1 von mittel-2: `gefunden<Fund>` würde beim
   Dialogende überschrieben).
2. **Läden:** `siliconBay.foodtruck` (Rosie: Zweite Chance 20, Flüstern 40, Waage 15),
   `portDelacroix.gebaeckstand` (Mrs. Arceneaux: Zweite Chance 20, Fingerzeig 15, Remisangebot 35),
   `desertSprings.antiquariat` (Mr. Okoro: Flüstern 40, Was droht? 60, Zweite Chance 20). Preise wie in
   den Läden von Akt 1 und 2 (11, Abschnitt 7.2). Die drei Figuren öffnen ihren Laden nach dem
   Gespräch (`oeffneLaden`). Keine Sprüche im Laden (Z4), kein Mentor-Zug und keine Vorgabe (G3).
   **Pokerface** wird bei Batistes erstem Sieg zu Zweite Chance (Bibel) und Kühler Kopf, der ruhigen
   Zeitkarte, die zu „ein Gesicht wie das Wasser“ passt. **Schutzengel** wird bei Miss Odile nach der
   Simultan zu „Was droht?“: Diese Karte zeigt, was man verlieren kann.
3. **Buck:** Buck hat die Rolle `strasse`, also schreibt die Hülle beim Sieg schon 10 Münzen gut
   (`MUENZEN.strassensieg`); dafür brauchte es nichts Neues. Startstellung geprüft mit Stockfish 19:
   Abbildung 8.44 (Bauernendspiel, Mehrheit und Durchbruch) steht bei Tiefe 28 auf +2,84 für Weiß,
   über der Grenze von R13 (+0,8 bis +2,5) und weit über „etwa +1“. Abbildung 1.36 steht bei Tiefe
   20 auf +1,10. **Entscheidung:** Buck bleibt bei 1.36, `begegnungen.json` unverändert.
4. **Erinnerung 1858 (Szene 77):** Runde `desertSprings.erinnerung1858` mit
   `klassik-bird-morphy` ab Zug 11 mit Schwarz, Quest `desertSprings.erinnerung1858` (begegnung,
   Fragment 6, 20 Münzen, danach Miras Satz „Das Opfer war richtig!“ und Ambroses Antwort). Angeboten
   wird sie bei Mira nach dem Clubkampf („Ambrose will dir etwas zeigen“), am Abend in der Garage.
   **Entscheidung:** Die Bibel will Ambroses erfundene Partie gegen Hale mit Weiß. Die Sammlung hat
   vor 1866 nur drei Partien, alle schon benutzt. Ambrose erzählt deshalb, er habe 1858 geopfert wie
   Morphy im selben Jahr in London und dann gezögert; der Held spielt Morphys Züge. Das Jahr stimmt,
   und Miras Satz passt genau. Nachteile: Schwarz statt Weiß, und der Schluss ab Zug 17 kommt auch
   in Ironwood vor. Besser wäre eine weitere gemeinfreie Partie aus der Zeit vor 1866 in
   `klassiker.json` (Vorschlag von mittel-2). Den Werkstatt-Flashback musste ich nicht umstellen: er
   nutzt das Erinnerungsformat schon (Unsterbliche ab Zug 1 mit Weiß); `mattbilder` steht nur, weil
   der Test Themen verlangt.
5. **Mentor-Zug (R29):** Die Quest gibt den Mentor-Zug aus Port Delacroix nicht mehr beim Clubkampf,
   sondern bei der Versöhnung (`desertSprings.versoehnung`, Schritt 2, `versoehnung_abend`); Ambrose
   sagt dazu: „Den Mentor-Zug aus Port Delacroix habe ich dir aufgehoben.“ Weil der Wüstenzug erst nach
   der Nadel von Port Delacroix fährt, ist der Sieg dann immer schon errungen. Das erfüllt „erst nach
   der Versöhnung spielbar“ für diese Karte. **Rest für die Hülle:** Mentor-Züge aus früheren Clubs
   kann der Held zwischen Vorwurf und Versöhnung noch spielen. Eine vollständige Sperre bräuchte in
   der Hülle die Regel „Mentor-Zug nicht spielbar, wenn `tiefpunktGesehen` und nicht
   `versoehnungGesehen`“ (beide Dialogvariablen gibt es).

**Prüfungen:** pytest 470 bestanden; `npm run pruefen` vollständig grün (361 Dateien, 2414 Tests);
Abenteuerpaket baut. Simulation von der Fähre bis zum Schild: alle neun Quests von Akt 3 fertig,
Funde, Läden und Karten feuern an der richtigen Stelle. Zufallsdurchläufe aller Knoten ohne Fehler.
`quests.json` und `runden.json` sind mit prettier formatiert (das betraf auch eine Zeile des
Haupt-Chats).

**Weiter offen (nicht in diesem Auftrag):** Fahrkarten und Album-Waren aus Abschnitt 22 der Bibel
(Fährfahrkarte, Zugfahrkarte, Bretthintergrund, Spende, altes Schachbuch) gibt es als Gegenstand oder
Extra noch nicht; die Monatskarte deckt das Reisen ab. Funde ohne Auslöser in `orte.json`:
Trompetenmundstück, Miras Pokal, Holzdame, Altes Foto (Szene 68).

## Bericht des letzten Auftrags, zur Nachlese

**Erledigt (erster Push: Weg 5 und Port Delacroix).**

- Fünf Ink-Dateien: `weg-silicon-delacroix.ink` (Szene 62: Schiffskoch Mr. Ruiz mit Uhr, Mr. Guidry
  mit Weisheit Kapitel 5, Rätseltafel, Funde Flaschenpost und Muschel, Mama an Bord),
  `port-delacroix-aussen.ink` (Ankunft, Bretter sammeln an vier Häusern, Batiste, Mrs. Arceneaux,
  Wüstenzug), `port-delacroix-turnhalle.ink` (Szene 63 Vorwurf, Reihen bei Remy und Lou, Szene 67
  Clubkampf ohne Karten, Szene 69 Simultan mit Remys Entschuldigung), `port-delacroix-werkstatt.ink`
  (Szene 66 Flashback an der Werkbank, Szene 68 Nachfahren mit Foto und Céleste),
  `port-delacroix-musikhaus.ink` (Szene 70 Das Schild). Alle Knoten aus `orte.json` sind vorhanden.
- Fünf Runden in `runden.json`: `wegSiliconDelacroix.tafel` (3 Aufgaben), `portDelacroix.reiheRemy`
  (Bauernstrukturen), `portDelacroix.reiheLou` (Pläne, Läufer), `portDelacroix.simultan` (3 Aufgaben
  Doppelangriff und Fesselung, Kinder der Stadt), `portDelacroix.flashbackWerkstatt` (Zugraten
  `klassik-unsterbliche` ab Zug 1 mit Weiß).
- Fünf Quests in `quests.json`: Hauptquest `portDelacroix.tiefpunkt` (Vorwurf, Remy, Lou, Clubkampf
  mit Szene `akt3.clubnadelPortDelacroix` und Mentor-Zug, Handschlag bei Miss Odile), Nebenquests
  `portDelacroix.wiederaufbau` (hilfe, vier Schritte über drei Besuche, 20 Münzen, Springervorgabe),
  `portDelacroix.nachfahren` (begegnung, Partie gegen Céleste bei jedem Ausgang, Szene
  `akt3.nachfahren`), `portDelacroix.flashbackWerkstatt` (Fragment 5, Szene
  `akt3.flashbackWerkstatt`), `wegSiliconDelacroix.tafelSalon` (raetsel). 20 neue Textschlüssel.
- Prüfungen: Simulation des ganzen Wegs mit Abbruch, Niederlage und Sieg im Clubkampf und
  Niederlage gegen Céleste: alle fünf Quests fertig, keine Sackgasse. Zufallsdurchläufe aller Knoten
  ohne Fehler, keine Zeile über zwei Sätze. pytest 385 bestanden, 85 übersprungen; Abenteuerpaket
  baut. `npm run pruefen`: 2408 von 2409 bestanden. **Ein Test schlägt fehl, bitte im Haupt-Chat
  nachziehen:** `app/src/abenteuer/anbindung/erinnerung.test.ts`, Zeile 20, zählt die Erinnerungen
  in `runden.json` fest mit `toBe(3)`; mit dem Werkstatt-Flashback sind es 4. Mit `toBe(4)` bestehen
  beide Tests der Datei (lokal geprüft). Die Datei gehört nicht zu meinen erlaubten Dateien, deshalb
  habe ich sie nicht geändert.

**Entscheidungen.**

1. _Ambroses Schweigen._ Nach dem Vorwurf hat Ambrose je Szene höchstens einen Satz („Spiel deine
   Partie.“ vor dem Clubkampf, „Hier. Hier war es.“ an der Werkbank, „Das bin ich.“ beim Foto), bis
   die Partie gegen Céleste `ambroseSprichtWieder` setzt. Die Variable setzt der Dialog nach der
   Partie, nicht die Hülle; die Quest wartet auf diesen Knoten.
2. _Vorwurf beim ersten Ansprechen._ Wer in der Turnhalle Odile, Remy oder Lou anspricht, erlebt
   zuerst den Vorwurf. Die Hauptquest beginnt beim Betreten der Turnhalle (Start und erster Schritt
   dürfen nicht gleich sein).
3. _Reihenfolge._ Remy vor Lou vor Miss Odile, wie in den anderen Clubs. Die Nachfahren und der
   Flashback setzen den Vorwurf voraus (sonst bräche Ambrose ein Schweigen, das es noch nicht gibt);
   vorher stellt sich Henri nur vor.
4. _Wiederaufbau mit vier Schritten._ Bretter, Simultan, Dank bei Odile (mit Remys Entschuldigung
   und der Karte Schutzengel), Schild. Das Schild hängt erst, wenn `simultanGedankt` und
   `nadelDesertSprings > 0` gelten; so kann kein Schritt übersprungen werden. Die 30 Münzen der
   Simultan gehen laut Bibel in die Kasse; deshalb keine Münzen für den Helden.
5. _Flashback ohne Sepia-Karte._ `orte.json` durfte ich nicht ändern; der Flashback läuft als
   Zugraten an der Werkbank, Teil 1 (1840) wird erzählt. Das Zugraten-Format kennt kein Endzug; die
   Bibel will Zug 1 bis 11. Vorschlag: Feld `bisZug` im Erinnerungsformat oder eine eigene
   Erinnerungskarte `flashback.werkstatt`.
6. _Geburtsort._ Ambrose sagt bei der Ankunft, er sei hier geboren, nicht in New Orleans; das folgt
   der Zeitlinie 1831 und der Empfehlung im Bibelbericht.

**Fehlt in anderen Dateien (bitte nachtragen, die Aufrufe stehen als Kommentar bereit).**

- `karten.json`: `pokerface` (Batiste, erster Sieg; die Zeile „Mach ein Gesicht wie das Wasser“ steht
  schon in `batiste_nach_sieg`) und `schutzengel` (`port-delacroix-turnhalle.odile_nach_simultan`).
- `funde.json`: `flaschenpost`, `muschelMitLoch` (Weg 5), `erstesBrettMusikhaus`
  (`port-delacroix-musikhaus.schild_aufhaengen`); das Trompetenmundstück aus der Fundtabelle hat noch
  keinen Auslöser in `orte.json`.
- Laden bei Mrs. Arceneaux: noch kein Laden, sie spricht nur.
- Mentor-Zug aus dem Clubkampf: Die Bibel will ihn erst nach der Versöhnung spielbar (R29); die
  Sperre gehört in die Hülle.

**Erledigt (zweiter Push: Weg 6 und Desert Springs).**

- Vier Ink-Dateien: `weg-delacroix-desert.ink` (Szene 71 Mrs. Holloway mit der Goldenen
  Angriffsregel, Kapitel 1, Abschnitt 1.6, Rätseltafel, Fund Eidechsenhaut; Szene 72 Mira auf dem
  Stein; Szene 73 Versöhnung am Felsbogen mit drei Wahlen, 1866 und der Lektion zum romantischen
  Opfer; Fund Nieten J. H.), `desert-springs-aussen.ink` (Ankunft, Szene 74 Buck mit Großes Maul
  beim ersten Sieg, Szene 79 Abend am Motel, Szene 80 Ende von Akt 3 mit Reise nach Port Delacroix
  oder Maple Falls), `desert-springs-garage.ink` (Mira, Tomás, Dot, Szene 75 und 78, Dots Hinweis
  auf das Antiquariat), `desert-springs-antiquariat.ink` (Szene 76 Der Brief). Alle Knoten aus
  `orte.json` sind vorhanden.
- Vier Runden: `wegDelacroixDesert.tafel` (3 Aufgaben, Mattbilder), `desertSprings.reiheTomas`
  (Mattbilder mit Opfer, Übungen a10 und a11), `desertSprings.reiheDot` (Königsangriff,
  Morphy-Checkliste und a14), `desertSprings.siegel` (1 Aufgabe, Fesselung).
- Drei Quests: Hauptquest `desertSprings.versoehnung` (Mira auf dem Stein, Versöhnung, Tomás mit
  Zweiter Chance, Dot, Clubkampf mit Nadel und Mentor-Zug, Abend am Motel, Ende von Akt 3, sieben
  Schritte mit den Szenen `akt3.miraStein` bis `akt3.ende`), `desertSprings.brief` (raetsel,
  Fragment 7, Flüstern), `wegDelacroixDesert.tafelCanyon` (raetsel). 13 neue Textschlüssel.
- Prüfungen: Die Simulation läuft von der Fähre bis zum Schild in Port Delacroix nach der
  Rückreise; alle acht Quests von Akt 3 aus beiden Pushes sind fertig. Dabei sind auch „zu früh am
  Felsbogen“ und eine Niederlage im Clubkampf durchgespielt. Zufallsdurchläufe aller Knoten ohne
  Fehler, pytest grün, Abenteuerpaket baut. `npm run pruefen`: wie im ersten Push bleibt nur der
  Zähltest der Erinnerungen offen.

**Entscheidungen (zweiter Push).**

7. _Der Club wartet auf die Versöhnung._ Die Hauptquest läuft streng der Reihe nach. Deshalb
   stellen Tomás und Dot ihre Reihen erst nach der Versöhnung; vorher schickt Tomás den Helden zu
   Mira in den Canyon oder an den Felsbogen. Die Versöhnung wartet auf Miras Stein („noch früh am
   Tag“). So kann kein Schritt verloren gehen.
8. _Ambrose auf Weg 6._ Seine Zeilen vor der Versöhnung hängen an `ambroseSprichtWieder`. Wer die
   Nachfahren ausgelassen hat, hört ihn erst am Felsbogen wieder; die Versöhnung setzt die Variable
   selbst.
9. _Lektion ohne zwei Bildschirme._ Das romantische Opfer erzählt Ambrose mit zwei Stellungen auf
   dem alten Brett und den Fundstellen (Kapitel 1, Abschnitt 1.6; Kapitel 11, Abschnitt 11.2), ohne
   Buchtext. Eine echte Lektion mit zwei Brettern bräuchte ein eigenes Format in der Hülle.
10. _Mentor-Zug nach der Versöhnung._ Die Sperre R29 endet mit `versoehnungGesehen`; die Hülle
    sollte diese Variable für die Freigabe abfragen.
11. _Brief auch ohne Umschlag._ Wer den Umschlag aus Ironwood hat (`gefundenUmschlag`), sieht, dass
    das Siegel passt; ohne ihn geht die Quest trotzdem. Dots Hinweis startet die Quest.
12. _Mama am Bahnsteig._ Für Szene 80 wartet Mama in Desert Springs am Bahnhof; die Abfahrt bietet
    Port Delacroix (für das Schild) und Maple Falls an.

**Fehlt noch (zweiter Push).**

- `funde.json`: `eidechsenhaut`, `nietenCanyonbruecke`, der Gegenstand „Hales Brief“ (Szene 76,
  Wirkung der Quest `desertSprings.brief`); die Aufrufe stehen als Kommentar bereit.
- `laeden.json`: Laden von Mr. Okoro im Antiquariat (Karten, Fahrkarten, alte Bücher).
- Szene 77 „Erinnerung 1858“: Es gibt noch keine Begegnung und keine Stellung (Folgeauftrag mit der
  Engine); Quest und Dialog fehlen deshalb.
- Buck: Die 10 Münzen aus der Bibel fehlen; Ink kann keine Münzen geben, und `begegnungen.json` hat
  für Buck keine Belohnung. Die Startstellung ist Abbildung 1.36, die Bibel nennt 8.44 (bitte prüfen).
