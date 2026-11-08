# 09 Weltbeschreibung: Wie die Welt aussieht, zusammenhängt und lebt

Grundlage für alle Karten (Tiled, LimeZu-Grafik nach Q17), Dialoge und Nebenquests. Wunsch des
Autors (8.11.2026): Die Welt soll lebendig und glaubwürdig wirken, und die Beschreibung soll vor
dem Zeichnen stehen, damit Karten nicht zweimal gemalt werden. Was hier steht, bindet Karten und
Story-Bibel; Widersprüche werden hier aufgelöst. Figuren und Szenen stehen in
`05_Story_Bibel.md`, Mechanik in `06_Regelwerk.md` und `08_Wege_und_Entdeckungen.md`.

## 1. Die Region auf einen Blick

Ein erfundener Bundesstaat im Nordosten der USA, Arbeitsname **Ashford** (bis zum Markencheck),
zwischen Hügelland im Norden, einem großen Fluss (der **Ashford River**) in der Mitte und der
Küste im Süden. Die Reise folgt dem Fluss abwärts zur Küste und dann ins Landesinnere zur
Hauptstadt. So fühlt sich jede Etappe wie ein Stück Weg an, nicht wie ein Sprung.

```text
                 Hügelland (Ahorn, Zedern, Wasserfälle)
   [1 Maple Falls] --Landstraße/Flussweg--> [2 Cedar Creek] --Zug am Fluss--> [3 Riverton]
                                                                      |
                                                              Fahrrad am Kanal
                                                                      v
   [5 Silicon Bay] <--Schnellstraße (Bus)-- [4 Ironwood] (Stahl, Rauch, Brücken)
         |
   Küstenfähre (zwei Tage nach Süden, ab Akt 3 verlässt die Reise Ashford)
         v
   [6 Port Delacroix] (Delta, Ambroses Geburtsstadt) --Wüstenzug, Canyon zu Fuß--> [7 Desert Springs] --Bergstraße--> [8 Summit City]
                                                 |
                                          [9 Crossroads] (Rastort, alle Wege kreuzen sich)
                                                 |
                             [10 Pinewood Camp] ... [11 Ghost Town] ... [12 Capital Arena]
```

Richtung der Reise: von klein und warm (Holz, Ahorn) über laut und grau (Stahl, Glas) zu weit und
hell (Küste, Wüste, Berge) und zurück in die Mitte (Hauptstadt). Ab Akt 3 weitet sich die Reise
über Ashford hinaus auf das ganze Land (Landesmeisterschaft, `10_Sprueche_Schauplaetze_Varianten.md`,
O1 bis O7): Port Delacroix liegt im Delta des Südens, Desert Springs hinter einem Canyon im Westen. Die Grafik folgt dieser Kurve:
Farben werden mit jeder Etappe kälter oder heller, nie zufällig.

## 2. Jahreszeiten und Tageszeiten

- **Akt 1 (Maple Falls, Cedar Creek): Spätsommer bis Frühherbst.** Blätter an den Rändern rot,
  warmes Licht, lange Schatten. Erste Fahrt nach Cedar Creek: ein kühler Morgen mit Nebel über dem
  Bach.
- **Akt 2 (Riverton, Ironwood): Herbst.** Laub auf den Wegen, Regen in Riverton, in Ironwood
  Rauch und erste Kälte; am Ende von Akt 2 der erste Schnee (Cliffhanger im Winterlicht).
- **Akt 3 (Silicon Bay, Old Harbor, Desert Springs): Winter bis Frühjahr.** Silicon Bay kennt
  keine Jahreszeit (Glas, Kunstlicht), Old Harbor Sturm und Gischt, Desert Springs die erste
  Wärme und blühende Kakteen.
- **Akt 4 (Summit City, Crossroads, Pinewood, Ghost Town, Capital Arena): Sommer.** Camp und Berge
  in hellem Licht, Ghost Town in der Mittagshitze, das Finale an einem langen Sommerabend.
- **Tageszeiten** sind an die Haupthandlung gebunden (`handlung.szene`), nicht an die Uhr des
  Geräts: Jede Karte hat eine Grundtönung (Morgen, Tag, Abend, Nacht), die eine Szene überschreiben
  kann (Sternennacht in Cedar Creek, Nachtzug nach Riverton). Technisch eine Farbtönung über der
  Karte plus Lampen als Lichtkreise; keine Simulation der Uhrzeit.
- **Wetter** nur, wo es erzählt: Regen in Riverton (Tropfen, nasse Straße), Rauch in Ironwood,
  Nebel am Flussweg am Morgen, Sturm in Old Harbor. Einfache Partikel, kein Wettersystem.

## 3. Was eine Karte lebendig macht (Regeln für alle Karten)

1. **Jede Außenkarte hat vier bewegte Dinge:** zwei Tiere (Abschnitt 4), eine animierte Kachel
   (Wasser, Rauch, Laub, Flagge) und eine Figur, die nicht zur Handlung gehört (Spaziergängerin,
   Kind mit Ball, Hund), die auf einem kurzen Weg hin und her läuft.
2. **Jeder Innenraum hat drei Dinge zum Ansehen** ohne Spielwirkung (Auslöser `gegenstand` mit
   einem Satz): ein Foto, ein Gegenstand mit Geschichte, etwas Komisches. Mindestens eines davon
   erwähnt das Schach (Pokal, Zeitungsausschnitt, zerbrochene Figur).
3. **Klang:** je Karte ein Hintergrundgeräusch (Wasserfall, Bus, Maschinen, Möwen) und je
   Innenraum ein Raumklang (Uhr, Kühlschrank, Trockner); Musik je Ort (orte.json `musik`).
4. **Spuren der Figuren:** Wer eine Quest erledigt hat, hinterlässt etwas Sichtbares (das Brett
   auf dem Dachboden ist weg, der Trockner trägt kein Klebebrett mehr, am Steg steht eine zweite
   Angel). Technisch: Kachelebene `objekte` mit Bedingung aus dem Spielstand (Dialogvariable).
5. **Abwechslung in Innenräumen:** nie zweimal dasselbe Klassenzimmer. Jeder Clubraum hat eine
   andere Form (Klassenzimmer, Bibliothekstisch, Parkpavillon, Werkskantine, Glasbüro,
   Hafenkneipe, Garage, Berghütte), eigene Bretter (Holz, Plastik, Marmor, Magnettafel) und ein
   Merkmal, das im Dialog vorkommt.
6. **Größen:** Außenkarten 28 × 20 bis 40 × 30 Kacheln, Innenräume 12 × 10 bis 20 × 14, Routen
   zweimal 28 × 20. Mehr Raum macht die Welt nicht lebendiger, nur leerer.
7. **Lesbarkeit:** Wege sind heller als Rasen, Türen haben Vordächer oder Matten, Auslöser mit
   Dialog glänzen kurz (kleine Funkel-Animation), wenn der Held in die Nähe kommt.

## 4. Fauna und Kleinkram

- **Maple Falls:** Eichhörnchen auf dem Zaun, Enten im Park, eine Katze auf der Veranda des
  Nachbarhauses, Krähen am Wasserfall, abends Glühwürmchen am Fluss.
- **Cedar Creek:** Reiher am Bach, ein Hund vor dem Waschsalon, Motten um die Bibliothekslampe,
  ein Eichelhäher am Steg.
- **Riverton:** Tauben im Park, Ratten an der Bahn (nur Geräusch und Huschen), Möwen am Fluss.
- **Ironwood:** Krähen auf Stahlträgern, eine Werkskatze, Fledermäuse in der Dämmerung.
- **Silicon Bay:** keine Tiere außer einer Drohne und einem Roboterstaubsauger (Absicht).
- **Old Harbor:** Möwen, Krabben, ein Seehund am Kai, eine Hafenkatze.
- **Desert Springs:** Eidechsen, ein Roadrunner, Geier als Kreise am Himmel.
- **Summit City:** Murmeltiere, ein Adler, Ziegen am Hang.
- **Routen:** je nach Landschaft Rehe am Waldrand (Morgen), Kühe, Hasen, Schmetterlinge.

Tiere laufen auf kurzen Wegen, weichen dem Helden aus und sind nie Kollision.

## 4a. Was die Menschen tun (und was die Tiere tun)

Eine Welt wirkt lebendig, wenn jeder Ort einen Alltag hat, der ohne den Helden weiterläuft.
Deshalb hat jede Karte neben den Handlungsfiguren **Statisten mit Tätigkeit** (Objekte
`type = "statist"` mit `tun` und Laufweg) und **Tiere mit Verhalten** (`type = "tier"`). Beides
ohne Spielwirkung, aber mit einem Satz, wenn man sie anspricht. Regel: Die Tätigkeit passt zum
Ort, zur Tageszeit und zum Wirtschaftszweig des Ortes; nichts steht nur herum.

| Ort            | Woher die Leute leben               | Was man sieht (Statisten, Tätigkeit)                                                                                                            | Tiere und ihr Verhalten                                                                                       |
| -------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Maple Falls    | Schule, Diner, Ahornsirup, Pendler  | Briefträgerin auf Runde, Kind mit Ball vor der Schule, Mann harkt Laub, Kellnerin wischt Tische im Diner, Skater im Park, Rentner auf der Bank  | Eichhörnchen hortet Nüsse, Enten folgen, wer stehen bleibt, Katze schläft auf der Veranda, Krähen fliegen auf |
| Route 1        | Felder, Hof, Angler                 | Bauer auf Traktor (fährt hin und her), Joggerin, Radfahrer überholt, Angler am Steg, Wanderer mit Karte                                         | Rehe am Waldrand (morgens), Kühe am Zaun, Reiher fliegt auf, Hase läuft weg                                   |
| Cedar Creek    | Bibliothek, Waschsalon, Holz, Rente | Mr. Boateng faltet Wäsche, Leserin mit Bücherstapel, Kinder auf der Bibliothekstreppe, Mann repariert Steg, Busfahrer raucht an der Haltestelle | Hund wartet vor dem Waschsalon und wedelt, Reiher steht still, Motten um die Lampe, Eichelhäher ruft          |
| Riverton       | Bahn, Hafen am Fluss, Markt         | Pendler mit Schirmen, Straßenmusiker unter der Brücke, Parkschachspieler mit Uhr (klopfen), Zeitungsverkäufer, Kinder springen in Pfützen       | Tauben picken und fliegen auf, Möwen streiten um Pommes, Ratten huschen an der Bahn                           |
| Ironwood       | Stahlwerk, Kneipe, Reihenhäuser     | Schichtwechsel am Werkstor (Gruppen laufen), Frau trägt Kohle, Kinder spielen Straßenschach mit Kreide, Mann füttert Tauben, Kantinenkoch       | Werkskatze schläft am Ofen, Krähen auf Trägern, Fledermäuse abends                                            |
| Silicon Bay    | Konzern, Cafés, Lieferdienste       | Alle schauen auf Bildschirme, Lieferroboter rollt, Wachmann, Besucher mit Namensschildern, niemand spielt am Brett                              | nur Drohne und Staubsaugerroboter (Absicht: die Stadt hat keine Tiere)                                        |
| Old Harbor     | Fischerei, Fähre, Kneipe            | Fischer flicken Netze, Kistenträger, Kapitänin am Kai, Kinder angeln, Kellner stapelt Stühle gegen den Sturm                                    | Möwen klauen Fisch, Seehund taucht auf und ab, Krabben am Kai, Hafenkatze lauert                              |
| Desert Springs | Motel, Diner, Tankstelle, Touristen | Tankwart, Motelputzfrau, Mira mit Schachbuch im Schatten, Touristen fotografieren, Mann wartet auf den Bus                                      | Eidechsen sonnen sich und huschen weg, Roadrunner rennt vorbei, Geier kreisen                                 |
| Summit City    | Seilbahn, Hütten, Wanderer          | Wanderer mit Rucksack, Seilbahnwärter, Holzhacker, Ward mit Thermoskanne am Fenster                                                             | Murmeltier pfeift, Ziegen fressen, Adler zieht Kreise                                                         |
| Crossroads     | Raststätte                          | Fernfahrer, Reisende aller Städte (Figuren aus früheren Orten tauchen wieder auf), Tankwart, Kellnerin                                          | streunender Hund, der den Helden ein Stück begleitet                                                          |
| Pinewood Camp  | Camp, Betreuer                      | Kinder am See, Betreuer pfeift, Lagerfeuer am Abend, Kanus                                                                                      | Libellen, ein Reh am Seeufer, Frösche am Abend                                                                |
| Ghost Town     | niemand                             | Wind, ein Plakat flattert, Staubteufel; ein alter Mann mit Metalldetektor als einzige Figur                                                     | Klapperschlange (Geräusch), Geier, eine Eule im Saloon                                                        |
| Capital Arena  | Turnier                             | Zuschauer, Schiedsrichter, Reporter mit Mikrofon, Spieler mit Kopfhörern, Eltern mit Kaffee                                                     | keine, außer einem Hund im Publikum (Spielwitz)                                                               |

**Tagesrhythmus:** Dieselbe Karte zeigt zu anderer Tageszeit andere Statisten: morgens
Briefträgerin und Schulkinder, mittags Handwerker und Kundschaft, abends Spaziergänger und
Lichter in den Fenstern, nachts fast niemand (nur die Szene, die nachts spielt). Technisch:
Statisten tragen `wann` (morgen, tag, abend, nacht); die Oberwelt zeigt nur die passenden.

**Tiere mit Tun:** Tiere haben ein Verhalten statt nur eines Laufwegs: `ausweichen` (läuft weg,
wenn der Held näher als drei Kacheln kommt), `folgen` (Enten, Hund: ein Stück hinterher),
`sitzen` (Katze, Reiher: ändert nur die Blickrichtung), `fliegen` (Krähen, Möwen: fliegen auf und
kommen zurück). Ein angesprochenes Tier antwortet mit einem Geräusch im Dialogfenster („Quak.“).

**Warum das zur Geschichte passt:** Die Tätigkeiten erzählen die Wirtschaft des Ortes und damit
den Konflikt mit Perfect Move: In Riverton verlieren die Parkschachspieler ihren Platz, in
Ironwood hängt der Club an der Kantine des Werks, in Silicon Bay tut niemand etwas mit den
Händen. Wer die Statisten anspricht, hört davon in einem Satz.

## 5. Die Orte (Lage, Areale, Verbindungen, Innenräume)

Je Ort: Bild in zwei Sätzen, Außenkarte(n), Innenräume mit Inventar, Verbindungen. Für Maple Falls
und Cedar Creek gilt zusätzlich `05_Story_Bibel.md`, Abschnitt 3.

### 5.1 Maple Falls (Akt 1)

Kleinstadt am Fluss mit Wasserfall, Ahornbäume, Holzhäuser mit Veranden, eine Hauptstraße.
Warm, ruhig, ein bisschen verschlafen; Spätsommerlicht.

- **Außen `aussen`:** Birch Lane mit dem Haus des Helden (Veranda, Umzugswagen in Szene 1),
  Nachbarhaus mit Katze, Schule mit Fahnenmast (Flagge animiert), Diner mit Leuchtreklame,
  Bushaltestelle mit Fahrplan; der Wasserfall ist am oberen Rand als Kachelanimation zu sehen.
- **Außen `park`:** Stadtpark am Fluss: Halfpipe, Bänke, Enten, Kiosk (Mr. Patel, Schritt 12),
  Bushaltestelle, Ortsausgang zur Landstraße (rechts).
- **Innen `wohnzimmer`:** Kartons, Sofa, Pizzakarton, Treppe nach oben, Küche in der Ecke, Mamas
  Laptop; zum Ansehen: Foto von Grandma Whitlock, ein Karton „Küche?“, der Pizzakarton.
- **Innen `dachboden`:** Dachschräge, Kisten, Lampe, Fenster zu den Ahornbäumen, das Brett; zum
  Ansehen: eine Hutschachtel, ein Spiegel, ein Stapel Zeitungen von 1961.
- **Innen `clubraum`:** Klassenzimmer, Pokale von 1994, vier Bretter, Tafel mit Diagramm; zum
  Ansehen: Pokalvitrine, das Brett ohne schwarze Dame, ein Plakat „Erst zählen“.
- **Verbindungen:** Haustür (Wohnzimmer ↔ Außen), Schule (Außen ↔ Clubraum), Park (Außen ↔ Park),
  Treppe (Wohnzimmer ↔ Dachboden), Landstraße (Park → Route 1), Bus (Park ↔ Cedar Creek,
  Schnellreise nach dem ersten Fußweg).

### 5.2 Route 1: Landstraße und Flussweg

Zwei Karten. **Landstraße:** Felder, Zäune, ein Traktor, Ahorn am Rand, die Rätseltafel am
Ortsausgang, eine Bank mit Nia, ein Busch mit dem Fund. **Flussweg:** der Bach wird breiter,
Steg, Bank, Reiher, Nebel am Morgen, am Ende das Ortsschild „Cedar Creek, gegr. 1851“.

### 5.3 Cedar Creek (Akt 1)

Kleiner Ort am Bach, rote Zedern, Bibliothek aus Backstein von 1890, Waschsalon, ein Steg. Still,
riecht nach Holz und Papier; die Zeit scheint hier langsamer zu gehen.

- **Außen `aussen`:** Bushaltestelle mit Schild, Bibliothek (Treppe, Laternen), Waschsalon mit
  Neonschild, Plakat von Perfect Move an einer Mauer, Steg mit Rosa, Bank mit Victor, Bach rechts.
- **Innen `bibliothek`:** hohe Regale, grüne Leselampen, langer Tisch mit vier Brettern, Tresen,
  Kellertreppe; zum Ansehen: Zeitungsregal, Globus, ein Schild „Bitte flüstern“ (Witz: die Karte
  Flüstern).
- **Innen `archiv`:** Keller, Kartons mit Jahreszahlen, flackernde Lampe, Karton 1850–1859, das
  Programmheft; zum Ansehen: ein Boxerfoto, ein Wasserfleck in Form eines Springers.
- **Innen `waschsalon`:** Maschinen, Trockner mit Klebebrett, Automat, Stühle; zum Ansehen: ein
  Zettel „Verloren: ein Turm“, ein Comicheft, der Automat.
- **Verbindungen:** Bibliothekstür, Kellertreppe, Waschsalontür; Bus (zurück nach Maple Falls),
  Flussweg (zu Fuß zurück), Bahnhof (Route 2 nach Riverton, kommt mit Akt 2).

### 5.4 Riverton (Akt 2)

Flussstadt mit Park, Brücke und Bahnhof, Backstein und Regen. Hier ist Schach laut: Parkschach
mit Uhr, Zuschauer, Wetten um Limonade. Perfect Move hängt die ersten Banner auf.

- **Außen `aussen`:** Parkpavillon mit Brettern (der Club), davor auf der Wiese die neuen
  Bildschirmtische von Perfect Move (Szene 29), Brücke über den Fluss (Straßenmusiker darunter),
  Bahnhof, ein Handyladen mit Tablets des Konzerns (Kulisse, kein Laden für den Helden),
  Bushaltestelle, geschlossene Fahrradwerkstatt mit Schuppen dahinter, Regenpfützen mit
  Spiegelung.
- **Innen `pavillon`:** offen, Regen auf dem Dach, Marmorbretter, Uhren; zum Ansehen: eine
  Gedenktafel für Mr. Odum, Slicks Lehrer, ein Glas mit Limonadenmünzen, eine Uhr mit Klebeband.
- **Innen `bahnhofshalle`:** Zeitungsstand von Pops (der Laden der Stadt, Fahrkarten und Karten),
  die große Uhr (Flashback-Auslöser), Bank des Uhrmachers Mr. Harlan; zum Ansehen: Fahrplantafel,
  ein Fundbüro-Schild, eine Taube, die sich hereinverirrt hat.
- **Innen `wohnwagen`:** Slicks Wohnwagen am Fluss (Schach-Trophäen aus Dosen, Kurierrad an der
  Wand); Nachgespräch nach dem Clubkampf.
- **Innen `schuppen`** (klein): Fahrradschuppen hinter der Werkstatt, mit dem Schlüssel aus Cedar
  Creek zu öffnen (übergreifende Quest, Fahrrad).
- **Verbindungen:** Zug (Cedar Creek ↔ Riverton; Weg `wegCedarRiverton` mit „Zedernwald“ und
  „Bahndamm“ beim ersten Mal zu Fuß), Kanalweg mit Fahrrad nach Ironwood (Weg `wegRivertonIronwood` mit „Kanalweg“ und „Brücke“), Bus nach
  Ironwood als Schnellreise.

### 5.5 Ironwood (Akt 2)

Stahlstadt, Rauch, Brücken, Werksschornsteine, Kälte. Der Club trifft sich in der Werkskantine;
Mamas Geheimnis liegt hier. Grau mit einem warmen Kern (die Kantine, der Ofen). Am Ende von Akt 2
fällt der erste Schnee.

- **Außen `aussen`:** Werkstor, Brücke mit Nieten „J. H.“, Reihenhäuser der Elm Street (Haus von
  Oma Ruth), Kantine, Güterbahnhof (Gus auf der Kabeltrommel), Eisenwarenladen von Edna mit
  Verkaufsfenster (der Laden der Stadt; statt des früher geplanten Kiosks), alter Bahnhof mit
  Heimatmuseum, Bushaltestelle an der Schnellstraße; Rauch und Funken animiert.
- **Innen `kantine`:** lange Tische, Ofen, Big Joes Brett aus Stahl, Pokalregal mit einer Lücke
  (der Pokal von 2001); zum Ansehen: Schichtplan, Kaffeemaschine mit Beule, Foto der Werksmannschaft.
- **Innen `mamasZimmer`:** Mamas altes Zimmer im Reihenhaus von Oma Ruth (das Geheimnis): Poster,
  Silbermedaille, das Partieformular des Finales 2001 unter Glas.
- **Innen `umkleide`** (klein): Spinde, Schließfach mit Fund (Holzturm, mit Laterne sichtbar).
- **Innen `museum`:** Heimatmuseum im alten Bahnhof mit Mr. Teague: Postsäcke von 1866 (Fund
  „Umschlag ohne Brief“), Vitrine mit einer Zeitung von 1858 (Erinnerung Ambroses), Standuhr.
- **Verbindungen:** Kanalweg (Riverton), Bus nach Riverton, Schnellstraße mit Bus nach Silicon
  Bay (Cliffhanger).

### 5.6 Silicon Bay (Akt 3)

Glasstadt am Wasser, Kunstlicht, keine Jahreszeit, keine Tiere. Konzern-Akademie mit
Bildschirmen statt Brettern. Die Welt ist hier sauber und falsch.

- **Außen `aussen`:** Campus mit Glasgebäuden, Straßenbahn, Werbetafeln (ZERO-Arbeitsname), der
  Food-Truck von Rosie (Laden) mit einer Bank davor (Dash spielt dort Blitz), Lieferroboter.
- **Innen `akademie`:** Glasbüro mit Bildschirmbrettern, Dr. Lins Schreibtisch mit einem einzigen
  Holzbrett, Nova auf der Fensterbank, Theo am Datenwand; zum Ansehen: Rangliste auf einem
  Bildschirm, ein Pokal aus Glas, ein Zettel „Drei Ziele“ in Dr. Lins Handschrift.
- **Innen `serverraum`:** kühl, blinkend, Schubladen; Fund der Ohrempfänger (Beweis für Akt 4).
- **Innen `lobby`:** Firmengeschichte mit der Vitrine „Hale – Ingenieure seit 1850“ (Rechenschieber,
  Brückenzeichnung, Notizbuch mit herausgerissener Seite), ein Empfangsroboter.
- **Verbindungen:** Weg `wegIronwoodSilicon` (Raststätte, Glasbrücke; Bus von Ironwood bis zur
  Raststätte), Küstenfähre nach Port Delacroix (Weg `wegSiliconDelacroix`).

### 5.7 Port Delacroix (Akt 3, Tiefpunkt und Versöhnung; ersetzt Old Harbor)

Hafenstadt im Delta, Ambroses Geburtsstadt, eine Tagesreise flussab von New Orleans (O1, an diese
Gegend angelehnt, mit erfundenem Namen). Im letzten Spätsommer hat ein Hurrikan das alte Musikhaus
am Kai zerstört; Akt 3 zeigt den nassen Winter danach: abgedeckte Dächer, Bauzäune, Zelte, und
überall Musik und Menschen, die mit den Händen helfen. Sturm und Regen, danach Sonne über den
Baustellen (O6). Der Ton ist Hoffnung, nicht Trauer.

- **Außen `aussen`:** Kai mit Fischerbooten (Mr. Batiste flickt dort Boote), Ruine des Musikhauses
  mit Bauzaun, zwei Zelte (Notzelt, Clubzelt), Turnhalle der Schule, Gebäckstand von Mrs. Arceneaux
  (Laden), Rue des Facteurs mit der Klavierwerkstatt, Sandsäcke, ein Bläser auf einer Kiste.
- **Innen `turnhalle`:** Ausweichquartier des Clubs: Basketballkörbe, Klapptische, gerettete
  Bretter aller Sorten; zum Ansehen: eine Spendenkasse, ein nasses Notenheft, ein Plakat „Wir
  spielen weiter“.
- **Innen `werkstatt`:** Klavierwerkstatt Whitlock-Duval: Klaviere unter Planen, Hobelbank,
  Geruch nach Holz, das alte Foto eines jungen Mannes mit Schachbrett (Ambrose), Célestes Laptop
  auf einem Flügel; Auslöser des Flashbacks.
- **Innen `musikhaus`:** erst Ruine (nasse Dielen, Himmel durchs Dach), nach dem dritten Besuch der
  neue Clubraum mit Klavier, Brettern und dem Schild „seit 1889“ (Spur nach Regel 4).
- **Fauna und Statisten:** Pelikane und Möwen am Kai, ein Reiher im Bauzaun, eine Katze auf dem
  Bootsdach; Handwerker auf Dächern, Helfer mit Sandsäcken, Kinder spielen Ball zwischen Zelten.
- **Verbindungen:** Küstenfähre (Silicon Bay; Weg `wegSiliconDelacroix` mit Fährdeck und Deich),
  Wüstenzug nach Desert Springs (Weg `wegDelacroixDesert`).

Old Harbor aus der Konzeptsammlung entfällt (O1): Die Turnhalle (später das Musikhaus) ersetzt die
Hafenkneipe als Clubraum, die Klavierwerkstatt die Leuchtturmstube als Ort des Flashbacks.

### 5.8 Desert Springs mit Canyon (Akt 3), Summit City, Crossroads, Pinewood Camp, Ghost Town, Capital Arena (Akt 4)

**Weg `wegDelacroixDesert` (O4):** Der Wüstenzug hält an einem einsamen Bahnhof oberhalb des
Canyons; zwei Wegkarten: `canyonpfad` (roter Fels, Hitze als Tönung, Eidechsen, Roadrunner, Miras
flacher Stein) und `felsbogen` (Felsbogen, darunter die Eisenbahnbrücke von 1879 mit den Nieten
„J. H.“, Abstieg zur Stadt im Abendlicht).

**Desert Springs (Akt 3):** Wüstenstadt mit Motel, Diner und Tankstelle, erste Wärme und blühende
Kakteen. Außen: Motel mit Garage (Club), Diner, Tankstelle (Buck spielt auf der Motorhaube), alter
Bahnhof mit Antiquariat. Innen: `garage` (Werkbank, Ölgeruch, ein Brett auf einem Reifenstapel,
Miras Dosenpokal), `antiquariat` (Bücherstapel, Briefe in Kisten, der Nachlass eines Brückenbauers;
Laden von Mr. Okoro). Tiere: Eidechsen, Geier als Kreise, ein Hund vor dem Diner.

Je ein Bild für Akt 4 (Details mit der Bibel zu Akt 4): Bergstadt mit Seilbahn und Berghütte
(Großmeisterin Ward, Endspiele am Kaminfeuer); Crossroads als Raststätte an einem Kreuz von vier
Straßen (alle Rivalen, Nebenquests, Varianten-Tisch); Pinewood Camp zwischen Riesenbäumen im
Nationalpark (O3); Ghost Town als verlassene Goldgräberstadt mit Saloon und Friedhof (Ambroses
Grab, Sepia auch am Tag); Capital Arena als Halle mit Tribünen (Landesmeisterschaft).

## 6. Checkliste je Karte (für niedrig-1 beim Zeichnen)

- [ ] Größe nach Abschnitt 3.6, Rand geschlossen außer an Übergängen.
- [ ] Vier bewegte Dinge (außen) oder drei Dinge zum Ansehen (innen) als Auslöser angelegt.
- [ ] Hintergrundgeräusch und Musik in `orte.json` eingetragen.
- [ ] Tageszeit-Grundtönung festgelegt (Feld `toenung` an der Karte, kommt mit der Grafik).
- [ ] Jede Tür hat eine Matte oder ein Vordach; jeder Weg ist heller als die Umgebung.
- [ ] Mindestens eine Spur einer Quest (Kachelebene `objekte` mit Bedingung).
- [ ] Figuren stehen dort, wo die Bibel sie nennt, und schauen zum Weg.

## 7. Was die Technik dafür noch braucht (Haupt-Chat, nach Schritt 10)

- Tönung je Karte und Szene (Phaser-Kamera-Tint), Lampen als Lichtkreise.
- Tiere und Statisten als Objekte `type = "tier"` / `"statist"` mit Laufweg (zwei Punkte),
  Tätigkeit `tun`, Tageszeit `wann` und Verhalten (ausweichen, folgen, sitzen, fliegen).
- Animierte Kacheln (Tiled-Animationen werden von Phaser unterstützt) und Partikel (Regen, Rauch).
- Bedingte Objektkacheln (`objekte`-Ebene mit Eigenschaft `wenn` = Dialogvariable).
- Hintergrundgeräusch je Karte (`geraeusch` in `orte.json`), Musik gibt es schon.
