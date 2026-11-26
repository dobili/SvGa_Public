# Lage- und Handlungsangaben im Dialog gegen die Karte (26.11.2026, mittel-2)

Befund des Autors vom 25.11.2026 abends: Auf der Landstraße zwischen Maple Falls und Cedar Creek
heißt es „Ein Mädchen mit Skateboard unter dem Arm versperrt halb den Weg“, aber Nia stand neben der
Straße im Gras. Das Werkzeug `python -m pipeline.abenteuer.lageangabe [--alle] [--bericht DATEI]`
sucht solche Stellen in allen Ink-Dialogen; der Dauertest `pipeline/tests/test_abenteuer_lageangabe.py`
verlangt, dass jeder Kandidat angesehen ist, und hält die gemeldeten Fälle mit einer Obergrenze (23),
die nur sinken darf.

## Was geprüft wird

Jede Erzählzeile, die vom Dialogeinstieg einer Figur erreichbar ist, gehört zu dieser Figur, außer
sie nennt eine andere Figur des Orts mit Namen oder erzählt von {held}, Juno oder Ambrose. Verglichen
wird mit allen Plätzen der Figur auf der Karte, auf der der Dialog spielt (Szenen und Tagesablauf);
ein passender Platz genügt.

- **weg:** versperrt, mitten auf dem Weg, steht auf der Straße → Feld ist Weg- oder Straßenkachel.
- **tuer, tresen, fenster, bank, brunnen, zaun:** passendes Möbel oder Auslöser höchstens 2 Felder weit.
- **sitzt, liegt:** Figur sitzt oder liegt (Szene `sitzt`, Tagesablauf `tut`).
- **bild:** „in der Hand“, „unter dem Arm“: jeder Fall einmal mit dem Figurenbild verglichen.

## Entscheidungen

**Akt 1 (vollständig):**

- **Nia (Landstraße):** Karte angepasst. Sie steht auf [82, 15], in der oberen Spur der drei Felder
  breiten Straße, in allen vier Fassungen und im Tagesablauf (6 bis 18 Uhr). Zwei Spuren bleiben frei,
  die Straße ist nicht gesperrt. Ihr Bild zeigt kein Skateboard: Bildwunsch (unten).
- **Wanderer (Landstraße):** stand mitten auf der Straße [67, 16], der Text ließ ihn „am Wegrand
  sitzen“. Karte: an den Rand [67, 14]; Text: „steht am Wegrand und stützt sich auf den Stock“
  (Figuren in Szenen sitzen nur auf Möbeln).
- **Victor (Haltestelle Cedar Creek):** keine Bank an der Haltestelle. Text: „An der Haltestelle steht
  jemand. … das Tablet in beiden Händen.“
- Clubraum: „Am Fenster sitzt ein Junge“ ist Sam (sitzt); Heft, Lappen und Telefon sind kleine Dinge
  oder andere Personen (geprüft).

**Akt 2 bis 4 (Text an die Karte, kein Sitzplatz in der Nähe):** Pepe steht am Hausboot, Edna hinter
dem Verkaufsfenster, Old Pete am Netzgestell, Hollis unter dem Riesenbaum, Dale am Gemüsebeet (statt
am Zaun, es gibt dort keinen).

## Bericht: offen (23, gemeldet)

- **Bildwünsche (6):** Nia mit Skateboard, Kira mit Basketball, Theo mit Bildschirm, Tamsin mit
  Schachuhr, Victor mit Tablet unter dem Arm, Ezra mit Pfeife und Klemmbrett (sein Bild zeigt eine
  Gitarre; sonst Text anpassen).
- **Sitzplatz in der Nähe (13):** Figur auf den Stuhl, Hocker, Sessel oder Reifenstapel daneben setzen
  (Szene `sitzt`, Sitzbilder sind seit 25.11. da). Das berührt Sitzrichtung und Bänke (mittel-3), deshalb
  nicht selbst umgebaut: Capital Arena (Victor im Finale, Kade, Nova), Raststätte (Nova), Garage (Mira
  zweimal), Pavillon (Tamsin), Akademie (Lin, Nova), Hütte (Haraldsen, Kit), Seeufer (Wanderer zweimal;
  Text sagt Bank, dort steht ein Hocker).
- **Ohne Möbel (4):** Wanderer und Slick „auf den Stufen“, Victor „am Geländer, die Knie angezogen“
  (Bergstation, Tiefpunkt: am Boden sitzen lassen, Text behalten), Ward „auf der Parkbank“ in der Hütte.

Überschneidungen: Figuren, die auf der Karte des Dialogs gar nicht stehen, prüft das Werkzeug nicht
(Feld von mittel-4, figurenort.py). Sitzrichtung und Bänke: mittel-3.

## Nachtrag: Drechslerei und Ansprechen (26.11.2026)

Befund des Autors (25.11., 21:46): In der Drechslerei von Cedar Creek heißt es „Ein Mann mit Schürze
dreht ein Stück Ahorn auf der Drechselbank“, aber Dunmore stand mitten im Raum.

- **Lage:** Die Drechselbank (`ccDrehbank`, [8, 6]) steht im Raum, Dunmore stand sechs Felder daneben
  auf [2, 6]. Er steht jetzt vor ihr auf [9, 9], Blick nach oben, in der Szene und im Tagesablauf (6 bis
  16 Uhr). Die Lageprüfung kennt dafür die Prüfung **drechselbank** (Möbel `Drehbank` in der Nähe).
- **Ansprechen:** Dunmore ist kein Ziel eines Hauptquestschritts und spricht den Helden nicht an;
  daran lag es nicht. `ansprechzeile.py` erkennt jetzt aber auch Tätigkeiten am Platz (dreht, sortiert,
  schreibt, poliert, stellt … auf) und Lagen (steht hinter dem Tresen, versperrt). Sechs erste Zeilen
  ansprechender Figuren haben dadurch eine Fassung `{angesprochen: …|…}` bekommen: Turnierleiterin
  (Vorrunde), Dot (Garage), Lou zweimal (Turnhalle), Tamsin und Ray (Pavillon), Haraldsen (Hütte).

## Nachtrag: Waschsalon (26.11.2026)

Bild des Autors (25.11.): weiße Fliesen, Automat rechts, unten ein heller Tisch mit Metallbeinen,
neben dem Helden ein alter Mann mit grauer Schirmmütze und einem Gefäß mit bunten Flecken. Das ist
Mr. Boateng im Waschsalon von Cedar Creek; im Bild trägt er einen Korb voll bunter Wäsche. Sein erster
Satz lautete „Hinter dem Tresen ein alter Mann …“, aber die „Theke“ (`crTheke`) ist ein kleiner
Ladentisch von 2 × 2 Feldern, um den man herumgeht; einen Tresen zeigt die Karte nicht. Er ist kein
Ansprech-Ziel, der Held ist zu ihm gegangen. Text an Karte und Bild: „Am Ladentisch neben dem
Automaten steht ein alter Mann mit sehr großen, ruhigen Händen, einen Korb voll bunter Wäsche im Arm.“

## Alle Kandidaten

| Stand    | Prüfung | Figur           | Datei.Knoten (Zeile)                               | Angabe                                                                                                                                       | Karte                                                                                                                 | Vorschlag oder Grund                                                                                                                     |
| -------- | ------- | --------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| gemeldet | sitzt   | wanderer        | `capital-arena-aussen.wanderer` (275)              | {not wandererGetroffen: Ein Mann mit gelbem Rucksack sitzt auf den Stufen. Er sammelt alte Blätter mit Stellungen, sagt er, und der Wind hat | capitalArena.aussen [16, 43] steht auf pflaster (capital-arena-aussen)                                                | Sitzt laut Text auf den Stufen, keine Stufen nah: am Boden sitzen lassen oder Text „steht“.                                              |
| gemeldet | sitzt   | victor          | `capital-arena-halle.finale_angebot` (511)         | {rivale} sitzt im Lichtkreis und wartet. Die Taschen hängen noch nach außen.                                                                 | capitalArena.halle [16, 6] steht auf holzDunkel (capital-arena-halle)                                                 | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (ca7StuhlLinks am Finaltisch)                 |
| gemeldet | sitzt   | kade            | `capital-arena-halle.kade` (646)                   | Kade sitzt bei Nova. Sie stellt ihm eine Stellung auf.                                                                                       | capitalArena.halle [11, 16] steht auf holzDunkel (capital-arena-halle)                                                | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (ca7Stuhl am Tisch bei Nova)                  |
| gemeldet | sitzt   | nova            | `capital-arena-halle.runde3_vorher` (172)          | Nova sitzt noch an Tisch eins. Ihre Hände liegen flach neben der Uhr.                                                                        | capitalArena.halle [11, 11] steht auf holzDunkel (capital-arena-halle)                                                | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (Tisch eins)                                  |
| gemeldet | sitzt   | slick           | `crossroads-aussen.slick` (73)                     | Auf den Stufen vor dem Speisewagen sitzt jemand und redet auf drei Kinder mit einem Klappbrett ein. Dünner geworden, brauner.                | crossroads.aussen [16, 41] steht auf asphalt (crossroads-aussen-gatter-offen)                                         | Sitzt laut Text auf den Stufen vor dem Speisewagen: am Boden sitzen lassen (sitzboden) oder Text.                                        |
| gemeldet | sitzt   | nova            | `crossroads-raststaette.nova_bitte` (132)          | In der hintersten Ecke, an einem Tisch für zwei, sitzt Nova allein. Pullover, zu groß, die Ärmel über den Händen.                            | crossroads.raststaette [19, 8] steht auf fliesenWeiss (crossroads-raststaette)                                        | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (cr7Hocker in der Ecke)                       |
| gemeldet | bild    | theo            | `crossroads-raststaette.theo` (184)                | Am Fenster steht Theo, gewachsen, einen Bildschirm unter dem Arm. Du legst das Tablet vor ihn hin.                                           | crossroads.raststaette [10, 9] steht auf fliesenWeiss (crossroads-raststaette)                                        | Bildwunsch: Theo mit Bildschirm unter dem Arm (Bild ohne).                                                                               |
| gemeldet | sitzt   | mira            | `desert-springs-garage.mira_clubkampf` (127)       | Die Garage ist noch voll. Mira sitzt schon und wippt mit den Füßen.                                                                          | desertSprings.garage [10, 7] steht auf stein (desert-springs-garage)                                                  | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (Reifenstapel dsReifen)                       |
| gemeldet | sitzt   | mira            | `desert-springs-garage.mira_erinnerung` (254)      | Mira hockt auf einem Reifenstapel, isst Kekse und tut, als höre sie nicht zu.                                                                | desertSprings.garage [10, 7] steht auf stein (desert-springs-garage)                                                  | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (Reifenstapel dsReifen)                       |
| gemeldet | bild    | kira            | `hochebene.kira_regel` (57)                        | Am Fuß der Felstürme steht ein flacher Steintisch. Ein Mädchen mit Schulrucksack und Basketball unter dem Arm stellt Figuren auf ein abgegri | hochebene.felsentuerme [44, 16] steht auf pisteRot (hochebene-felsentuerme)                                           | Bildwunsch: Kira mit Basketball unter dem Arm (Bild ohne Ball).                                                                          |
| gemeldet | bild    | victor          | `ironwood-aussen.kauf` (319)                       | Neben {rv_sein}em Vater steht {rivale}, in Weiß, das Tablet unter dem Arm. {rv_Er} sieht Big Joe nach, den großen Händen, die den Karton hal | ironwood.aussen [12, 33] steht auf gras (ironwood-aussen-meisterschaft)                                               | Bildwunsch: {rivale} mit Tablet unter dem Arm (Bild ohne).                                                                               |
| gemeldet | bild    | ezra            | `pinewood-camp-aussen.ezra` (97)                   | Ein junger Mann mit Pfeife um den Hals und Klemmbrett unter dem Arm kommt angelaufen.                                                        | pinewoodCamp.aussen [24, 16] steht auf sandplatz (pinewood-camp-aussen)                                               | Bildwunsch oder Text: Ezra hat im Bild eine Gitarre, keine Pfeife und kein Klemmbrett.                                                   |
| gemeldet | sitzt   | tamsin          | `riverton-pavillon.tamsin_eli` (319)               | {londonNachgespraechGesehen:Draußen ist es längst dunkel./Draußen wird es dunkel.} Die sechs Tische leuchten weiter, weiß und geduldig. An e | riverton.pavillon [9, 19] steht auf dielen (riverton-pavillon-perfect-move)                                           | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (Kisten am Tisch)                             |
| gemeldet | bild    | tamsin          | `riverton-pavillon.tamsin_erstes_treffen` (253)    | {angesprochen:Ein Mädchen mit Schachuhr unter dem Arm kommt zu dir und zählt dabei laut weiter rückwärts. Hinter ihr zieht Slick./Ein Mädche | riverton.pavillon [9, 19] steht auf dielen (riverton-pavillon-perfect-move)                                           | Bildwunsch: Tamsin mit Schachuhr (Bild ohne).                                                                                            |
| gemeldet | sitzt   | lin             | `silicon-bay-akademie.lin_nach_sieg` (170)         | Dr. Lin sitzt lange still. Dann nimmt sie die Nadel aus der Kitteltasche: klares Glas, darin ein einzelner Bauer.                            | siliconBay.akademie [20, 13] steht auf teppichBlau (silicon-bay-akademie)                                             | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (sb8StuhlRuecken am Brett)                    |
| gemeldet | sitzt   | nova            | `silicon-bay-akademie.nova_erstes_treffen` (301)   | {angesprochen:Vom Ringlicht her kommt Nova Sinclair auf dich zu. Hinter ihr eine Kamera auf dem Stativ, das rote Licht ist aus./Neben dem Ri | siliconBay.akademie [2, 6] steht auf fliesenWeiss (silicon-bay-akademie)                                              | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (Fassung ohne Ansprechen: sitzt am Ringlicht) |
| gemeldet | sitzt   | victor          | `summit-city-bergstation.victor_bergstation` (94)  | {rivale} sitzt am Geländer, die Knie angezogen, nur im Hemd. Die weiße Jacke liegt neben {rv_ihm}.                                           | summitCity.bergstation [6, 6] steht auf stein (summit-city-bergstation)                                               | {rivale} sitzt am Geländer, Knie angezogen (Tiefpunkt): Karte am Boden sitzen lassen, Text behalten.                                     |
| gemeldet | sitzt   | haraldsen       | `summit-city-huette.haraldsen_reihe` (535)         | {angesprochen:Ein alter Mann in Seilbahnuniform kommt vom Kamin herüber, eine halb polierte Turmfigur in der Hand./Ein alter Mann in Seilbah | summitCity.huette [13, 6] steht auf dielen (summit-city-huette)                                                       | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (Ohrensessel am Kamin)                        |
| gemeldet | sitzt   | kit             | `summit-city-huette.kit_reihe` (437)               | {angesprochen:Vom Clubtisch kommt ein Mädchen in Wanderschuhen auf dich zu, die Finger noch beim Zählen der Felder./Am Clubtisch sitzt ein M | summitCity.huette [3, 6] steht auf dielen (summit-city-huette)                                                        | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (mf2StuhlL am Clubtisch)                      |
| gemeldet | bank    | ward            | `summit-city-huette.ward_lektion` (110)            | Eleanor Ward sitzt auf der Parkbank, ein Taschenschach auf den Knien. Sie spielt die Stellung zu Ende, dann sieht sie auf.                   | summitCity.huette [10, 6] sitzt auf dielen (summit-city-huette), nichts Passendes in der Nähe                         | Text sagt „Parkbank“, Ward sitzt in der Hütte ohne Bank: Wort anpassen (Bank am Kamin) oder eine Bank stellen.                           |
| gemeldet | sitzt   | wanderer        | `weg-ghost-capital.wanderer_erstes` (373)          | Auf der Bank am Weg sitzt ein Mann mit gelbem Rucksack und zählt Papier.                                                                     | wegGhostCapital.seeufer [124, 15] steht auf erde (weg-ghost-capital-seeufer)                                          | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (Hocker; Text sagt Bank: Bank oder Text)      |
| gemeldet | sitzt   | wanderer        | `weg-ghost-capital.wanderer_seiten` (378)          | {not wandererGetroffen: Auf der Bank am Weg sitzt ein Mann mit gelbem Rucksack und zählt Papier. Dann sieht er, was du in der Hand hast.     | wegGhostCapital.seeufer [124, 15] steht auf erde (weg-ghost-capital-seeufer)                                          | Karte: Figur auf den Stuhl daneben setzen (Szene `sitzt`); Sitzbilder sind seit 25.11. da. (wie wanderer_erstes)                         |
| gemeldet | bild    | gegnerin        | `weg-maple-cedar.nia_erstes_treffen` (155)         | Ein Mädchen mit Skateboard unter dem Arm versperrt halb den Weg. Auf dem Board klebt ein Schachbrett.                                        | wegMapleCedar.landstrasse [82, 15] steht auf landstrasse (weg-maple-cedar-landstrasse-flohmarkt-leer)                 | Bildwunsch: Nia mit Skateboard unter dem Arm (Schachbrett auf dem Board); ihr Bild zeigt Stirnband und lila Oberteil, aber kein Board.   |
| geprüft  | bild    | pepe            | `bayou.pepe_erstes` (128)                          | Am Hausboot steht ein alter Mann neben einer verbeulten Blechkiste. Er hält ein Streichholz in der Hand.                                     | bayou.steg [8, 13] steht auf sumpfboden (bayou-steg)                                                                  | Kleiner Gegenstand in der Hand, im Figurenbild nicht darstellbar und nicht nötig. (Streichholz)                                          |
| geprüft  | bild    | wanderer        | `capital-arena-aussen.wanderer_buch` (282)         | Der Mann mit dem gelben Rucksack hält einen Packen alter Blätter in den Händen, frisch gebunden, in einem Leinendeckel.                      | capitalArena.aussen [16, 43] steht auf pflaster (capital-arena-aussen)                                                | Übergabe im Gespräch: Er zeigt das gebundene Bündel, das er gleich weitergibt; kein Dauerzustand.                                        |
| geprüft  | bild    | grahamHale      | `capital-arena-halle.aussage_victor` (307)         | Graham Hale steht bei den Sponsoren, ein Telefon in der Hand und eines am Ohr, und hat beide vergessen. Sein Gesicht ist grau.               | capitalArena.halle [23, 10] steht auf holzDunkel (capital-arena-halle)                                                | Kleiner Gegenstand in der Hand, im Figurenbild nicht darstellbar und nicht nötig. (Telefon)                                              |
| geprüft  | bild    | victor          | `capital-arena-halle.aussage_victor` (307)         | Graham Hale steht bei den Sponsoren, ein Telefon in der Hand und eines am Ohr, und hat beide vergessen. Sein Gesicht ist grau.               | capitalArena.halle [16, 6] steht auf holzDunkel (capital-arena-halle)                                                 | Der Satz handelt von Graham Hale (Telefon), nicht von {rivale}.                                                                          |
| geprüft  | sitzt   | turnierleiterin | `capital-arena-halle.runde3_vorher` (176)          | Sie sitzt schon da, im zu großen Pullover, die Haare zurückgebunden, sodass man beide Ohren sieht. Das soll man bemerken.                    | capitalArena.halle [11, 7] steht auf holzDunkel (capital-arena-halle)                                                 | „Sie sitzt schon da“ meint Nova (eigener Eintrag), nicht die Turnierleiterin.                                                            |
| geprüft  | bild    | victor          | `capital-arena-halle.vor_dem_finale` (466)         | Graham hält kein Telefon in der Hand.                                                                                                        | capitalArena.halle [16, 6] steht auf holzDunkel (capital-arena-halle)                                                 | Verneinung: „Graham hält kein Telefon in der Hand.“                                                                                      |
| geprüft  | bild    | tomas           | `desert-springs-garage.tomas_erstes_treffen` (359) | Er rollt heraus, einen Schraubenschlüssel in der Hand.                                                                                       | desertSprings.garage [4, 5] steht auf stein (desert-springs-garage)                                                   | Kleiner Gegenstand in der Hand, im Figurenbild nicht darstellbar und nicht nötig. (Schraubenschlüssel)                                   |
| geprüft  | bank    | victor          | `ironwood-aussen.victor` (285)                     | An der Bushaltestelle liegen ein paar Schneeflocken auf der Bank, wo {rivale} saß.                                                           | ironwood.aussen [12, 33] steht auf gras (ironwood-aussen-meisterschaft), nichts Passendes in der Nähe                 | Rückblick: „wo {rivale} saß“; die Bank ist leer, {rivale} ist fort.                                                                      |
| geprüft  | sitzt   | coachDelgado    | `maple-falls-clubraum.coach_erstes_treffen` (104)  | Am Fenster sitzt ein Junge, die Füße auf dem Stuhl. Er hat die ganze Zeit zugehört, ohne herzusehen, das ist Sam.                            | mapleFalls.clubraum [15, 4] steht auf holzHell (maple-falls-clubraum-bildschirm)                                      | „Am Fenster sitzt ein Junge … das ist Sam“: gemeint ist Sam, und Sam sitzt (Szene sitzt rechts).                                         |
| geprüft  | bild    | junoClub        | `maple-falls-clubraum.coach_reihe_offen` (121)     | Juno winkt dir vom Nebentisch zu, ein Heft in der Hand.                                                                                      | mapleFalls.clubraum [22, 8] steht auf holzHell (maple-falls-clubraum-bildschirm)                                      | Kleiner Gegenstand in der Hand, im Figurenbild nicht darstellbar und nicht nötig. (Heft)                                                 |
| geprüft  | bild    | coachDelgado    | `maple-falls-clubraum.pratt_und_heimweg` (249)     | An der Tür steht der Hausmeister, einen Lappen in der Hand, und sieht auf die Pokale von 1994.                                               | mapleFalls.clubraum [15, 4] steht auf holzHell (maple-falls-clubraum-bildschirm)                                      | Der Hausmeister (Pratt) hält den Lappen, nicht Coach Delgado; Lappen ist ein kleiner Gegenstand.                                         |
| geprüft  | bild    | coachDelgado    | `maple-falls-clubraum.victor_trifft` (464)         | Ein schwarzer Wagen hält vor der Schule. Ein Mann steigt aus, ein Telefon am Ohr, ein zweites in der Hand.                                   | mapleFalls.clubraum [15, 4] steht auf holzHell (maple-falls-clubraum-bildschirm)                                      | „Ein Mann steigt aus“ ist Graham Hale vor der Schule, nicht Coach Delgado.                                                               |
| geprüft  | bild    | remy            | `port-delacroix-turnhalle.odile_hand` (253)        | Remy steht an der Wand, die Trompete unter dem Arm. Er sagt nichts.                                                                          | portDelacroix.turnhalle [9, 8] steht auf hallenboden (port-delacroix-turnhalle)                                       | Das Bild zeigt Remy mit dem Instrument in der Hand.                                                                                      |
| geprüft  | bild    | dash            | `silicon-bay-aussen.dash_erstes_treffen` (120)     | Auf der Holzbank vor Rosies Wagen sitzt ein junger Mann neben einem Lieferrad, einen Burrito in der Hand.                                    | siliconBay.aussen [11, 65] sitzt auf platten (silicon-bay-aussen)                                                     | Kleiner Gegenstand in der Hand, im Figurenbild nicht darstellbar und nicht nötig. (Burrito)                                              |
| geprüft  | bild    | haraldsen       | `summit-city-huette.haraldsen_reihe` (535)         | {angesprochen:Ein alter Mann in Seilbahnuniform kommt vom Kamin herüber, eine halb polierte Turmfigur in der Hand./Ein alter Mann in Seilbah | summitCity.huette [13, 6] steht auf dielen (summit-city-huette)                                                       | Kleiner Gegenstand in der Hand, im Figurenbild nicht darstellbar und nicht nötig. (Turmfigur, Fassung „angesprochen“)                    |
| geprüft  | bild    | earl            | `weg-desert-summit.earl_k` (127)                   | Earl dreht das gebogene Glasrohr in der Hand. Dann holt er eine Leiter aus dem Lastwagen.                                                    | wegDesertSummit.diner [90, 23] steht auf sandRot (weg-desert-summit-diner-neon)                                       | Kleiner Gegenstand in der Hand, im Figurenbild nicht darstellbar und nicht nötig. (Glasrohr, das er gerade dreht)                        |
| geprüft  | tuer    | schiffskoch     | `weg-silicon-delacroix.ruiz_erstes_treffen` (73)   | {not ankunftPortDelacroixGesehen: Mama lehnt in der Tür.                                                                                     | wegSiliconDelacroix.faehre [17, 25] steht auf holzDunkel (weg-silicon-delacroix-faehre), nichts Passendes in der Nähe | „Mama lehnt in der Tür“ spielt bei der Ankunft in Port Delacroix, nicht auf der Fähre.                                                   |

## Nachtrag: Bildwünsche erfüllt (26.11.2026, PixelLab-Lieferung P7)

Der Autor hat die sechs Standbilder mit Gegenstand geliefert. Sie liegen als weitere Standbilder der
Figur im privaten Paket (`figuren-neu/<figur>/standbilder/<kennung>/`, Werkzeug
`werkzeuge/pixellab_lieferung_2611.py`) und stehen in den Szenen als `standbild`:
Nia `skateboard` (vier Fassungen der Landstraße), Kira `basketball` (Felsentürme), Theo `bildschirm`
(Raststätte), {rivale} `tablet` (drei Fassungen von Ironwood außen), Ezra `pfeife-klemmbrett`
(Camp). Das Werkzeug zählt ein Standbild an der Stelle als erfüllte Angabe (Platz `standbild`, nur
stehend). Offen bleibt Tamsin: Sie sitzt im Pavillon am Boden (tamsin_eli), das Sitzbild zeigt keine
Uhr; das Standbild `schachuhr` ist da, wirkt aber erst, wenn sie dort steht. Gemeldet: 10 → 5.
