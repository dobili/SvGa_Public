# Wahl der Varianten für die Karten, die der Autor nicht mehr ansieht

Stand: 10.11.2026. Wunsch des Autors: Für die übrigen Karten keine drei Varianten mehr zur Wahl. Der
Haupt-Chat (hier: der Gutachter-Chat) wählt die sinnvollste Variante. Danach werden die Notizen des
Autors als Regeln angewandt (`docs/spiel/KARTENPRUEFUNG.md`), und jede Karte bekommt ihre Zustände.

## Vorgehen je Karte

1. Variante A (`inhalte/abenteuer/szenen/<szene>.json`), B und C
   (`inhalte/abenteuer/szenen/varianten/<szene>-b.json`, `-c.json`) mit `kartenbild` zeichnen.
2. Kurz nach dem Prüfregelwerk vergleichen und die Variante wählen, die am wenigsten Grundfehler hat
   (Grundriss, Wege, Wasser, Gleise, Raumlogik) und am lebendigsten und abwechslungsreichsten ist.
   Der Autor wählte bisher meist die reichere Fassung, wenn sie stimmig war. Kleinere Mängel behebt
   später der Helfer.
3. Hier eintragen: Wahl (A, B oder C), ein Satz warum, und die drei wichtigsten Mängel der gewählten
   Variante.

Die Varianten-Kennungen `musikhaus-neu` und `diner-neon` folgen der Wahl ihrer Grundkarte.

## Karten (48)

- [x] `bayou-steg` (bayou.steg): **C**
  - Warum: Fünf Inseln mit Stegen, Hausboot, Luftboot und zweiter Hütte; A und B haben nur drei bzw. zwei Inseln und weniger Ziele.
  - Mängel:
    1. Inseln sind Rechtecke mit Rasen und das Wasser ist türkis statt schwarz (ganze Karte).
    2. Therons Hütte ist die Hundehütte (x 13–15, y 11–14), das blaue Haus (x 31–34, y 26–29) hat keinen Grund.
    3. Die Südwestinsel mit dem weißen Motorboot (x 2–9, y 24–33) ist nicht erreichbar, der „Reiher“ ist das Huhn (x 42, y 24).
- [x] `capital-arena-aussen` (capitalArena.aussen): **A**
  - Warum: Nur hier steht die Arena in der Mitte mit Brunnen und Fahnen auf der Treppenachse, Feuerwache links und Polizeirevier rechts wie beschrieben; B und C schieben die Arena an den Rand.
  - Mängel:
    1. Vorplatz und Straßen sind eine einzige Kopfsteinfläche ohne Bordstein, Fahrbahn oder Markierung (y 35–46, y 13–15, y 57–60).
    2. MARKET fünfmal und STORE dreimal, alle mit Vorhängeschloss (z. B. x 9–15, y 6–13.
    3. X 61–67, y 6–13.
    4. Südzeile y 48–57).
    5. Zwischen und hinter den Gebäuden blanker Rasen statt Höfen oder Gassen, die Arena steht mit den Kuppeln am oberen Kartenrand (y 1–3).
- [x] `capital-arena-halle` (capitalArena.halle): **C**
  - Warum: Bühne unter dem Banner, sechs Tribünen, neun Bretter mit je zwei Stühlen und volles Publikum; A ist dunkel und verwaschen mit nur einem Stuhl je Brett, B stellt die Bühne mitten in den Saal.
  - Mängel:
    1. Rosa Wand und unruhiger Fliesenboden statt heller Wand und dunklem Holz (ganze Karte).
    2. Die Turniertafel ist die Holz-Anschlagtafel unten rechts (x 27–28, y 15–16) statt an der Nordwand, zwei Tribünen stehen quer im Saal (x 1–5 und x 25–29, y 7–9).
    3. Mehrere Figuren stehen in Stühlen statt zu sitzen (x 7, y 15.
    4. X 11, y 10.
    5. X 20, y 15).
- [x] `capital-arena-innenstadt` (capitalArena.innenstadt): **A**
  - Warum: Nur hier liegt der Platz mit Kaffeekiosk, Haltestelle und Bänken unten in der Mitte wie beschrieben, mit Bus auf der Allee; B und C schieben ihn an den Rand und stellen das Polizeirevier bzw. Wohnblöcke in die Mitte.
  - Mängel:
    1. Zwischen fast allen Häusern liegt Rasen statt dichter Bebauung („dicht an dicht“), jede Reihe steht auf einer Wiese (y 8–13, y 17–30, y 37–55).
    2. Allee ohne Markierung und Bordstein (y 32–35), Gassen und Fußgängerstraße aus demselben Kopfstein ohne Kante.
    3. Der Abgang zum U-Bahnhof ist kaum zu finden (kleines Schild bei x 44, y 46), MARKET steht mindestens sechsmal, eine zweite kleine Polizeiwache (x 26–31, y 2–13) neben dem großen Revier.
- [x] `capital-arena-ubahnhof` (capitalArena.ubahnhof): **A**
  - Warum: Weiße Fliesen, drei Klapptische in der Mitte zwischen zwei Pfeilern und Bänke an den Enden wie beschrieben, Zug mittig hinter dem Geländer; B hat Schachbrettboden und Ziegelwand, C verstreut Tische und Bänke.
  - Mängel:
    1. Keine Treppe und kein Rollgitter: der Ausgang ist die braune Holztür (x 18, y 19), die zwei Drehkreuze stehen frei mitten auf dem Bahnsteig (x 14–15 und x 21–22, y 15–18).
    2. An den Klapptischen steht kein Hocker und niemand spielt, der Kreidespringer ist fast unsichtbar (x 8, y 15–16).
    3. Die Fliesen sind unscharf, der Bahnsteig unterhalb der Tische leer (y 13–18).
- [x] `crossroads-aussen` (crossroads.aussen): **C**
  - Warum: Voller Parkplatz (Bus, Food-Truck, zwei Sattelzüge, zwei Autos), Picknickplatz unter Bäumen, Motel und Werkstatt an eigener Schotterstraße; A ist dünner, B stellt den Wasserturm mitten zwischen die Parkplätze.
  - Mängel:
    1. Highway und Parkplatz ohne Markierung und Bordstein, Lastwagen von der Seite auf Asphalt von oben (x 4–14, y 36–43), Figuren stehen auf der Fahrbahn (x 2, y 24.
    2. X 21–22, y 20–21.
    3. X 31, y 24).
    4. Zweite kleine Tankstelle direkt neben der großen ohne Zufahrt (x 54–61, y 12–17), Zapfsäulen der großen stehen im Gras (x 41–47, y 15–18).
    5. Kapelle zwischen Eisenwarenladen und Wellblechschuppen ohne Platz, Zaun oder Friedhof (x 47–52, y 36–45).
- [x] `crossroads-raststaette` (crossroads.raststaette): **A**
  - Warum: Holzwände und Dielen wie beschrieben, Küche hinter der Wand, langer Tresen mit vier Hockern, Variantentisch mit drei Brettern und zwei runde Tische unten links; B und C tauschen nur Boden und Wand (Schachbrett/Ziegel, weiße Fliesen/Rosa) und stellen die Möbel um.
  - Mängel:
    1. Keine Durchreiche: Küche und Gastraum sind nur durch einen schmalen Gang verbunden (x 10–11, y 6–7), die Küche ist zur Hälfte leer (y 3–5).
    2. Dielen unscharf, Kasse steht als eigener Kasten am Tresenende halb im Gang (x 7, y 10–11).
    3. Regale mit denselben bunten Dosen dreimal (Küche x 8–9, Laden x 11–12 und x 14–15), kein Postkartenständer, mehrere Gäste stehen neben den Hockern statt zu sitzen.
- [x] `desert-springs-antiquariat` (desertSprings.antiquariat): **A**
  - Warum: Bahnhofsuhr, Holzwand und Dielen wie beschrieben, zwei Regalreihen in der Mitte, Lesetisch mit Lampe, Tresen rechts; B hat weiße Wand und einen Läufer ins Leere, C einen unruhigen Boden und keine Uhr.
  - Mängel:
    1. Die Kellerluke mit Leiter liegt mitten im Raum direkt neben dem Lesetisch (x 12–14, y 7–10) statt links, eine Figur steht an ihrem Rand.
    2. Die Vitrine mit den Fahrkarten ist leer (x 15–17, y 10–11), der Tresen nur ein kleiner Kasten mit Kasse (x 15–16, y 6–8).
    3. Dielen unscharf, die Uhr ist zwei Kacheln groß, Briefkisten und Zeitungsstapel liegen unten an der Tür statt links (x 2–3 und x 8, y 11–12).
- [x] `desert-springs-aussen` (desertSprings.aussen): **C**
  - Warum: Gleiche Anlage wie A und B, aber ohne das Hochhaus (A) und ohne Polizeiwache und Maschinenhalle (B); heller Hof mit Picknicktischen, Rasthaus am Ostende, Kakteen und Steine im Sand.
  - Mängel:
    1. Die Old Mother Road ist glatter Asphalt ohne Markierung und biegt als rechter Winkel in den Hof (x 0–46, y 15–17.
    2. X 44–46, y 17–24).
    3. Bahnhof, Diner, Motel und Werkstatt sind die Bilder aus Crossroads (silberner Diner-Wagen statt braunem Haus mit Schild, Motel gleich), der „alte Bahnhof“ ist ein braunes Holzhaus ohne Bezug zum Bahnsteig, der nur ein kurzer Pflasterstreifen ist (x 14–30, y 5–6).
    4. Südlich des Hofs und westlich des Wasserturms weite leere Sandflächen, roter Fels nur als Streifen am oberen Rand.
- [x] `desert-springs-garage` (desertSprings.garage): **A**
  - Warum: Backsteinwand und Steinboden wie beschrieben, Auto links, Clubtisch mit vier Stühlen in der Mitte, Reifenstapel mit Brett rechts; B hat Schachbrettboden und kein Auto, C rosa Wand und das Auto rechts.
  - Mängel:
    1. Die Werkbank steht rechts frei vor der Wand und ragt in den Raum (x 14–17, y 3–5) statt an der Nordwand neben dem Regal.
    2. Das Auto steht ohne Wagenheber, Werkzeug oder Ölfleck da, die zwei Fässer stehen einzeln verstreut (x 1 und x 4, y 9–10).
    3. Die Holzbank links oben (x 1–2, y 3–4) hat keinen Grund, die rechte untere Raumhälfte ist bis auf Kisten leer.
- [x] `erinnerung-london-kaffeehaus` (erinnerungLondon.kaffeehaus): **A**
  - Warum: Genau drei Schachtische mit Kerzen, der mittlere frei erreichbar, Theke rechts mit Flaschenregal, Zeitungsständer links, lange Lederbank und Ofen an der Nordwand; B hat nur zwei Tische, C vier und zwei Zeitungsständer.
  - Mängel:
    1. Niemand sitzt und niemand drängt sich um den mittleren Tisch: fünf Figuren stehen verstreut, alle Stühle leer.
    2. Kein Sepia und kein Kerzenlicht im Raum, der Dielenboden hat ein lautes Schrägmuster.
    3. Der Kellner steht vor statt hinter der Theke (x 14, y 6), die Lederbank hat keinen Tisch davor (x 2–7, y 3–4).
- [x] `erinnerung-london-strand` (erinnerungLondon.strand): **A**
  - Warum: Geschlossene Häuserzeile über die ganze Breite mit dem Kaffeehaus in der Mitte, Droschke, zwei Karren, Fässer, Zeitungsjunge; B lässt links und rechts der fünf Fronten Pflasterlücken, C verdoppelt die Droschke.
  - Mängel:
    1. Acht statt fünf Hausfronten, TABAK dreimal, BUECHER und UHREN je zweimal in gleicher Reihenfolge.
    2. Die Häuser sind flache Fassaden von vorn ohne Dach und Tiefe, zwei Laternen stehen vor Ladenfronten und verdecken Schrift und Tür (x 7 und x 15, y 6–8.
    3. X 30 und x 36).
    4. Kein Sepia, Tauben mitten auf der Fahrbahn (x 24–26, y 14), der südliche Gehweg ist bis auf Karren und Fässer leer.
- [x] `erinnerung-siedlung-huette` (erinnerungSiedlung.huette): **A**
  - Warum: Pritsche an der Westwand, Tisch mit Brett in der Mitte, Kanonenofen in der Nordostecke, Kistenstapel mit Lampe wie beschrieben; B spiegelt die Hütte, C stellt ein buntes Bücherregal hinein, das nicht in eine Bergbauhütte von 1866 passt.
  - Mängel:
    1. Der Postreiter ist eine Zwergenfigur mit roter Mütze und steht mitten im Raum statt an der Tür (x 8, y 7).
    2. Der Tisch ist hell statt dunkel, eine Kerze ist nicht zu erkennen, das Fenster zeigt Tageslicht statt Nachthimmel (x 6–7, y 1–2).
    3. Kistenstapel, Lampe und ein Kleiderhaufen liegen ineinander (x 1–2, y 6–8), der Ofen steht eine Reihe vor der Wand.
- [x] `ghost-town-aussen` (ghostTown.aussen): **C**
  - Warum: Gleiche Front Street mit Laden, Schmiede, Saloon, Sheriff und Weg zum Stolleneingang wie A, dazu Barbier, Prüfamt, ein größerer Friedhof und mehr Kakteen, Steine und Steppenläufer; B verliert die Schmiede und den Wasserturm.
  - Mängel:
    1. Die Front Street hebt sich kaum vom Sand ab und hat keinen Rand (y 21–23), die Bretterwege liegen nur vor einzelnen Häusern.
    2. Die Häuser der hinteren Reihe (Stage & Mail, Barbier, zwei Schuppen, y 5–11) haben keinen Weg zur Tür.
    3. Der Friedhof nimmt das ganze Südostviertel ein (x 34–55, y 28–37) und ist größer als der Ort, der Südwesten ist bis auf Kakteen leer.
- [x] `ghost-town-saloon` (ghostTown.saloon): **A**
  - Warum: Lange Theke mit Flaschenregal und Spiegel links an der Nordwand, Klavier rechts, Treppe an der Ostwand, Spieltisch mit Brett in der Mitte wie beschrieben; B spiegelt alles und stellt Fässer in den Raum, C stellt die Treppe frei.
  - Mängel:
    1. Die Treppe ist ein flaches Leiterbild, das frei im Raum steht und nirgends ankommt (x 16–18, y 6–10), mit zwei Kisten daneben.
    2. Nur zwei Barhocker an sechs Kacheln Theke (x 3 und x 5, y 6–7), niemand sitzt, drei Figuren stehen um den Spieltisch.
    3. Dielen unscharf, Fässer in drei Ecken ohne Grund, das Postreiterabzeichen unter der Treppe ist nicht zu erkennen.
- [x] `goldmine-stollen` (goldmine.stollen): **A**
  - Warum: Klarer Grundriss wie beschrieben: Hauptgang mit Gleis, Türstöcken, Lampen und Prellbock, Kammer mit Tisch und Hockern im Westen, Goldader mit Lore und Pfützen im Osten; B und C verschieben die Kammern und machen aus dem Gang einen Ring bzw. Saal.
  - Mängel:
    1. Wände und Boden haben dieselbe Felstextur, nur durch eine Linie getrennt (alle Gänge).
    2. Jeder Stein hat einen grünen Grasrand und die Steine stehen als Ketten an den Wänden (x 3–11, y 3–7.
    3. X 21, y 7–21.
    4. X 37, y 7–18).
    5. Das Grubenholz ist von der Seite gezeichnet (x 3, y 9–10), die Lore steht ohne Gleis in der Kammer (x 30–31, y 9–10), eine Kiste für das Logbuch fehlt.
- [x] `hochebene-felsentuerme` (hochebene.felsentuerme): **A**
  - Warum: Der Weg führt in drei Bögen an Koppel, Steintisch und Felsbogen vorbei, zwei Felstürme am Ostende wie beschrieben; in B fehlen Koppel und Bogen, in C liegt die Koppel abseits des Wegs.
  - Mängel:
    1. Ein dunkel umrandeter Rahmen umschließt die ganze Karte wie Zimmerwände, die Geländestufe im Süden ist ein Kasten mit harter Linie (x 40–57, y 24–27) statt einer Kante.
    2. Der Weg ist ein graues Band mit rechten Winkeln ohne Rand (etwa x 18–20, y 14–19.
    3. X 48–50, y 9–19.
    4. X 78–80, y 9–15).
    5. Der Steintisch ist ein Holztisch mit Brett neben einem grünen Laubbusch statt unter einem Wacholder (x 41–44, y 13–14), die Koppel hat einen dunklen Eisenzaun und ein Pferd von vorn (x 58–71, y 13–21).
- [x] `hochebene-schule` (hochebene.schule): **A**
  - Warum: Schulhaus im Norden mit Hof davor, Basketballfeld rechts, Werkstatt links an der Straße, Schulbus an der Haltestelle wie beschrieben; B lässt das Basketballfeld weg, C drängt alles um.
  - Mängel:
    1. Das Basketballfeld liegt als volles Feld auf der Wiese neben dem Schulhaus (x 44–55, y 3–15) statt auf dem gepflasterten Hof und ist fast so groß wie die Schule.
    2. Keine Hecke schließt das Gelände, nur Einzelbüsche und Tannen.
    3. Die Straße hat keine Markierung und endet stumpf an beiden Rändern, das zweite Backsteinhaus links oben (x 8–15, y 10–15) hat keinen Weg und keinen Grund.
- [x] `jahrmarkt-festplatz` (jahrmarkt.festplatz): **C**
  - Warum: Alle Attraktionen von A, dazu zwei Tribünen, mehr Lichterketten, ein weiterer Stand und Blumen am Zugang; B ist halb leer und stellt die Bühne ohne Gerüst hin.
  - Mängel:
    1. Riesenrad und Karussell sind flach von der Seite gezeichnet und überlappen sich (x 3–18, y 4–13).
    2. An keiner Bude steht ein Verkäufer hinter der Auslage, die Besucher sind wenige Einzelfiguren.
    3. Der Festplatz ist ein glattes braunes Rechteck mit runden Ecken ohne Fahrspuren, Stroh oder Zaun, das Riesenrad steht links statt oben in der Mitte.
- [x] `kuerbishof-hof` (kuerbishof.hof): **C**
  - Warum: Gleiche Anlage wie A (Maisfeld links, Hofhaus und Scheune in der Mitte, Kürbisfeld rechts, Hofladen am Hofweg), dazu Traktor, mehr Obstbäume, Kürbisse und Blumen am Weg; B ist kahler und ohne Traktor.
  - Mängel:
    1. Mais und Kürbisse stehen im Raster auf Wegerde mit blanken Lücken dazwischen (x 0–5 und x 44–48, y 0–17), der „Maisirrgarten“ hat keine Gänge und keinen erkennbaren Eingang.
    2. Am Hofladen steht niemand hinter der Auslage (x 2–4, y 22–25), drei gleiche Kühe stehen ohne Zaun am Hofweg (x 3–5, y 27–29).
    3. Die Wege sind rechtwinklige Bänder, zwei Vogelscheuchen, von denen keine als „Morphy“ erkennbar ist.
- [x] `pelikaninsel-dorf` (pelikaninsel.dorf): **C**
  - Warum: Gleiche Insel wie A (Anleger im Norden, Leuchtfeuer im Westen, Dorfplatz, fünf Pfahlhäuser im Osten), dazu ein Fischerboot mit Fischer am Strand, mehr Boote, Möwen und Treibgut; B spiegelt die Insel und hat nur drei Pfahlhäuser.
  - Mängel:
    1. Grüne Tropenpflanzen und ein Rasenrand rund um die Insel passen nicht zum „Winterwind“ (etwa x 8–10, y 3–8 und y 21–24).
    2. Das Leuchtfeuer steht auf einem eckigen grauen Kiesfleck statt auf einer Felsspitze (x 1–5, y 8–15), die Inselfähre ist ein kleines Motorboot (x 42–45, y 0–2).
    3. Der Dorfplatz ist braune Erde statt Sand, das Netzgestell sieht aus wie ein Zaunstück (x 6–8, y 11–12 und x 9–11, y 17–18).
- [x] `pinewood-camp-aussen` (pinewoodCamp.aussen): **C**
  - Warum: Gleiche Anlage wie A (Weg vom Nordrand zum Lagerfeuerplatz, Zelte links, Blockhütten rechts, Kiosk, Strand und Steg), dazu ein drittes Zelt am Feuer, ein zweiter Steg, Bänke am Ufer und mehr Tannen; B rückt Feuerplatz und Hütten an den Nordrand und lässt die Mitte leer.
  - Mängel:
    1. Der Lagerfeuerplatz ist ein gezackter oranger Sandfleck ohne Steinring-Lesbarkeit und Rand (x 18–26, y 9–16), der Strand ein Streifen in Kachelstufen (y 22–26).
    2. Zwischen den Blockhütten stehen ein Wellblechschuppen, ein weißer Bungalow und die Hundehütte (x 36–40, y 2–7.
    3. X 9–13, y 13–18.
    4. X 59, y 15–18) als Stilbruch.
    5. Die Enten sind das Hühnerbild (x 25–27, y 26–27), Mammutbäume gibt es nur als drei Stammfüße am Nordrand links.
- [x] `port-delacroix-aussen` (portDelacroix.aussen): **A**
  - Warum: Klarste Gliederung: Deichkrone oben, Gleis mit Bahnsteig im Westen, Rue du Port als durchgehende Asphaltstraße mit Backsteinhalle, Kanal mit Kai im Osten; B ersetzt die Straße durch helle Platten und stellt ein Zeltlager auf Erde in die Mitte, C legt orange Erdstraßen zwischen die Häuser.
  - Mängel:
    1. Der Deich ist nicht als Höhe lesbar: Erdweg und grüner Streifen liegen flach, die Rampen sind nur Wegstücke (y 4–8).
    2. Sattgrüner Rasen und Laubbäume statt nassem Winter nach dem Hurrikan, kaum Sturmschäden zu sehen.
    3. Rue du Port ohne Markierung und Bordstein (x 5–42, y 20–23), ringsum Kopfstein ohne Kante, im Kanal liegen gondelartige Boote quer (x 46–49, y 9–11 und y 31–33), östlich des Kanals Flachdachläden und MARKET wie in den anderen Städten.
- [x] `port-delacroix-musikhaus` (portDelacroix.musikhaus): **A**
  - Warum: Alte Holzwand, dunkle Dielen, Löcher, Pfütze, Schutt, das abgedeckte Klavier in der Nordwestecke und Bretter in der Nordostecke wie beschrieben; B hat helle Steinplatten und Ziegelwand, C ist zu aufgeräumt für eine Ruine.
  - Mängel:
    1. Der Dielenboden hat ein lautes Schrägmuster, das wie neues Parkett wirkt.
    2. Statt eines Lochs im Dach sind drei schwarze Löcher im Boden zu sehen (x 6, y 5.
    3. X 4, y 10.
    4. X 11, y 3), nur eine kleine Pfütze (x 8–9, y 4–5) statt großer.
    5. Derselbe Trümmerhaufen und derselbe Kistenstapel mit Kleidern mehrfach kopiert (x 1–2, y 6–7 und y 9–10.
    6. X 7–8, y 10.
    7. X 13–14, y 9), der zerbrochene Bilderrahmen ist winzig (x 8, y 6–7).
- [x] `port-delacroix-turnhalle` (portDelacroix.turnhalle): **A**
  - Warum: Acht Schultische mit Brettern und je zwei Stühlen in zwei Blöcken, Lehrertisch und Spendenkorb an der Nordwand, hohe Fenster, Bänke an der Südseite; B stellt Bierbänke auf, C nur fünf runde Tische und Stapelstühle.
  - Mängel:
    1. Das Spielfeld ist eine dunkelgraue, rissige Fläche, die wie ein Teppich auf gelben Dielen liegt (x 7–20, y 3–13), statt eines hellen Hallenbodens mit Linien.
    2. Beide Körbe hängen an der Nordwand (x 6 und x 20, y 1–2), obwohl das Feld quer liegt.
    3. Die vier inneren Tische stehen auf den Spielfeldlinien, niemand sitzt, der Lehrertisch ist das schmale grüne Pult von der Seite (x 13–14, y 1–3).
- [x] `port-delacroix-werkstatt` (portDelacroix.werkstatt): **A**
  - Warum: Holzwand und dunkle Dielen, Hobelbank an der Nordwand zwischen zwei Fenstern, Foto rechts daneben, Werkzeugschrank, drei Klaviere im Westen (eines abgedeckt) und der Flügel wie beschrieben; B hat weiße Wand und ein Keyboard, C rosa Wand und die Hobelbank mitten im Raum.
  - Mängel:
    1. Die Hobelbank ist ein verwaschenes, unscharfes Bild, das über die Wandkrone ragt und nicht als Hobelbank zu erkennen ist (x 7–11, y 1–4).
    2. Der Dielenboden hat das laute Schrägmuster, Späne sind nicht zu sehen.
    3. Das Foto im Goldrahmen ist winzig (x 14, y 1–2), das Grubenholz-Bündel (x 17–18, y 8–10) und das blaue Fass (x 4, y 10–11) haben in einer Klavierwerkstatt keinen Grund.
- [x] `sternwarte-felsnase` (sternwarte.felsnase): **A**
  - Warum: Pfad vom Südrand in zwei Kehren aufs Plateau, Sternwarte mit Kuppelspalt und Schild, Bank an der Westkante, Antennenmast, Säulenkakteen wie beschrieben und am dichtesten bepflanzt; B ist kahler, C hat drei Felsstufen, die den Aufstieg unklar machen.
  - Mängel:
    1. Plateau und Pfad sind von doppelten dunklen Linien eingefasst wie Zimmerwände, rings um die Karte ein breiter Rahmen mit schwarzen Flächen (x 1–2 und x 37–38, y 3–28): als Höhe und Canyon liest sich das nicht.
    2. Die Bank schaut nach Süden statt nach Westen in den Canyon (x 7–8, y 9–10).
    3. Die Sternwarte steht am oberen Kartenrand vor einem Stück Felswand, das nur drei Kacheln breit ist (x 15–23, y 0–2), keine Nachttönung.
- [x] `sternwarte-kuppel` (sternwarte.kuppel): **A**
  - Warum: Nachtblaue Wand und Dielen wie beschrieben, Teleskop in der Mitte, Sternkarte zwischen Regalen, Schreibtisch mit Funkgerät rechts, Liege und Globus links; B hat Holzwand und Fenster, C einen lila Teppichboden und einen rosa Teppich unter dem Teleskop.
  - Mängel:
    1. Die Wand ist hellblau statt nachtblau.
    2. Der Raum ist rechteckig, von einer Kuppel ist nichts zu sehen (keine runde Wand, kein Spalt), das Teleskop zeigt auf die Wand.
    3. Ein Kreidevogel am Boden (x 12, y 8) ist nicht als Springer erkennbar, der Karton in der Ecke (x 12, y 10) hat keinen Grund, Dielen unscharf.
- [x] `summit-city-aussen` (summitCity.aussen): **A**
  - Warum: Einheitliche Bergstadt aus Holzhäusern mit Pflasterweg vom Südrand zum Marktplatz mit Brunnen und Ständen; B stellt ein modernes Geschäftshaus und ein Haus mit blauem Dach hinein, C die Feuerwache und das Hochhaus aus Capital.
  - Mängel:
    1. Die Gipfelwand im Norden ist ein graubrauner Streifen mit Linien, der die Karte wie ein Rahmen umläuft, statt einer Felswand mit Höhe (y 0–5, Ränder links und rechts).
    2. Dasselbe Blockhaus mit rotem Dach und dieselbe lange Hütte mit orangem Dach stehen je vier- bis fünfmal, dazu acht kleine gleiche Hütten in zwei Reihen (y 40–45).
    3. Die Seilbahn ist nur ein Mast über einem grauen Flachbau (x 51–58, y 5–21), ein Seil in die Gipfel sieht man nicht, zwischen den Häusern liegt überall blanker Rasen.
- [x] `summit-city-bergladen` (summitCity.bergladen): **A**
  - Warum: Theke links, Regale an der Nordwand, Kartentisch in der Mitte, Rucksäcke davor wie beschrieben, eine Pflanze füllt die Ecke; B spiegelt den Laden, C ist bis auf ein Seil am Boden gleich.
  - Mängel:
    1. Die Waren passen nicht zu einem Bergladen: Regale mit bunten Dosen und Flaschen wie im Supermarkt (x 5–6 und x 12–13, y 1–3), zwei Gießkannen und ein Blumentopf auf einem Tisch (x 9–12, y 3).
    2. Seile, Karabiner, Laternen, Wanderkarten und der Ständer mit Seilbahnkarten fehlen, der Kartentisch ist leer.
    3. Hinter der Theke steht niemand und keine Kasse, beide Figuren sind dasselbe Bild (x 4 und x 9, y 6).
- [x] `summit-city-bergstation` (summitCity.bergstation): **C**
  - Warum: Durchgehendes Fensterband mit Gipfeln, zwei Bänke davor mit Pflanzen, Gondel rechts, Schalter links, dazu Rucksäcke und eine Wartende; A hat nur drei Fenster und eine leere Mitte, B einen gelben Dielenboden und die Gondel links.
  - Mängel:
    1. Die Gondel steht auf dem Hallenboden ohne Plattform, Kante oder Öffnung in der Wand, das Seil hängt an der Decke (x 13–15, y 1–5).
    2. Der Fahrkartenschalter ist ein kleines Pult mit Schild „TICKET“ ohne Glas und ohne Person (x 0–2, y 8–10), Fahrplan (Netzplan einer U-Bahn) steht daneben auf dem Boden (x 3–4, y 9).
    3. Schachbrettfliesen statt Holz und Glas, Schließfächer und Kaffeeautomat stehen frei mitten im Raum (x 6–7 und x 9–10, y 8–10).
- [x] `summit-city-huette` (summitCity.huette): **C**
  - Warum: Kamin in der Mitte der Nordwand mit Holzstapeln, Regale links und rechts, zwei Ohrensessel am Tisch mit Brett auf einem Teppich direkt vor dem Feuer, zwei Clubtische im Süden; in A liegen zwei Teppiche schief im Raum und ein Holzstapel mitten davor, in B steht die Sitzgruppe neben statt vor dem Kamin.
  - Mängel:
    1. Die Vitrine mit dem Pokal von 1985 steht rechts an der Ostwand weit weg von der Nordwand (x 15–16, y 5–7) und ist ein hoher Schrank.
    2. Der Dielenboden hat das laute Schrägmuster.
    3. Die Endspieldiagramme sind zwei kleine grüne Karos (x 4, y 2 und ein Bild x 13–14, y 1–2 ist ein Landschaftsgemälde), an den Clubtischen sitzt niemand, drei Figuren stehen an der Südwand.
- [x] `weg-crossroads-pinewood-huetten` (wegCrossroadsPinewood.huetten): **C**
  - Warum: Als einzige Fassung ein Nadelwald: dichte Tannen beiderseits des Wegs, Schutzhütte, Lichtung mit Bank und Feuerstelle, Bach mit Steg; A und B sind Wiesen mit einzelnen Laubbäumen.
  - Mängel:
    1. Der Weg besteht aus langen Geraden mit rechtwinkligen Versprüngen statt Bögen (etwa x 9–10, y 14–22.
    2. X 27–29, y 11–20.
    3. X 89–90, y 9–16).
    4. Der Bach ist eine schnurgerade senkrechte Linie von Rand zu Rand (x 128–129, y 0–30), der Steg ein kurzes Brett quer darüber.
    5. Die Schutzhütte steht drei Reihen über dem Weg ohne Pfad zur Tür (x 78–86, y 2–8), Lichtung und Feuerstelle liegen zwischen den Bäumen ohne Picknicktisch (x 56–62, y 4–8), kein Hang mit Felsen.
- [x] `weg-crossroads-pinewood-riesenbaeume` (wegCrossroadsPinewood.riesenbaeume): **C**
  - Warum: Dichtester Hain: Mammutbäume beiderseits und mitten im Wald, viele Tannen und Farne, Ranger-Häuschen mit Fahne, Bach mit Steg; A ist lichter, B fast eine Wiese mit Laubbüschen.
  - Mängel:
    1. Der Weg läuft in langen Geraden mit rechten Winkeln statt in Kehren (x 15–16, y 5–40.
    2. X 33–34, y 40–66.
    3. X 35–36, y 92–116).
    4. Mitten im Hain liegt ein graues Schachbrett-Pflaster mit vier Fahnen und einer Bank (x 9–18, y 95–106), das die Beschreibung nicht nennt und dessen Zweck unklar ist.
    5. Der Bach ist eine gerade waagerechte Linie (y 109–110), die Mammutbäume stehen links als Kolonne im gleichen Abstand (x 2–7, y 30–125).
- [x] `weg-delacroix-desert-canyonpfad` (wegDelacroixDesert.canyonpfad): **C**
  - Warum: Am dichtesten bepflanzt (Säulen- und blühende Kakteen in Gruppen), klarer Verlauf mit Engstelle und Abzweig nach Norden, Bahnsteig mit Häuschen und Wasserturm im Osten; A ist ähnlich, aber kahler, B hat kaum Kakteen.
  - Mängel:
    1. Der Canyon ist ein Grundriss: Boden und Umgebung haben dieselbe rote Textur, getrennt nur durch eine dunkle Linie mit rechtwinkligen Versprüngen (ganze Karte), Felswand gibt es nur stückweise am Nordrand der Abschnitte.
    2. Eine Rampe hinunter ist nicht zu sehen, der Übergang vom Bahnsteig ist eben (x 126–136, y 8–18).
    3. Zwei Gleise mit rot-weißen Sperren enden am Westende des Bahnsteigs frei im Fels (x 138–140, y 4–7), das Bachbett mit Kieseln ist nur eine Reihe einzelner Steine.
- [x] `weg-delacroix-desert-felsbogen` (wegDelacroixDesert.felsbogen): **A**
  - Warum: Einzige Fassung mit zusammenhängendem Weg: vom Ostabsatz durch den Felsbogen ins tiefere Tal mit Bank, unter der Eisenbahnbrücke hindurch nach Norden auf den langen Absatz und hinunter zum Westrand; in B und C sind die Abschnitte durch Fels getrennt und der Bogen steht frei.
  - Mängel:
    1. Der Talboden ist ein Grundriss aus roter Fläche mit dunkler Linie und rechten Winkeln in gleichfarbigem Fels, Höhe liest sich nur an kurzen Wandstücken (ganze Karte).
    2. Die Eisenbahnbrücke ist ein kurzes Fachwerkstück von vorn, das im Fels beginnt und endet, ohne Gleis links und rechts (x 46–58, y 15–19).
    3. Der Ostabsatz hat keine sichtbare Verbindung zum Bogen außer einer Kachel (x 99–100, y 17–24), die Bank steht in einer Nische vor der Wand ohne Blick ins Tal (x 82–83, y 18–19).
- [x] `weg-desert-summit-bergstrasse` (wegDesertSummit.bergstrasse): **C**
  - Warum: Vier Kehren mit durchgehenden Felsstufen und drei Vegetationszonen wie A, dazu der dichteste Pinienwald oben, mehr Steine und der Rastplatz mit Sattelzug in der Mitte; B hat nur drei Kehren und einen langen leeren Erdstreifen.
  - Mängel:
    1. Die Straße ist glatter Asphalt ohne Mittellinie und Randlinie mit rechtwinkligen Kehren (ganze Länge), Leitplanken nur als kurze Stücke an den Querstücken.
    2. Die Felsstufen sind waagerechte graubraune Bänder von Rand zu Rand, durch die die Straße ohne Rampe oder Einschnitt hindurchläuft (y 51–53, y 81–83, y 107–109), ein Rahmen umläuft die Karte.
    3. Die Zonen wechseln an schnurgeraden waagerechten Kanten (Gras/Erde y 60, Erde/Sand y 101), der Sattelzug steht von der Seite gezeichnet auf einem grauen Rechteck neben der Straße (x 11–20, y 90–94).
- [x] `weg-desert-summit-diner` (wegDesertSummit.diner): **C**
  - Warum: Gleiche Anlage wie A (Diner mit Neonschild, Motel, Parkplatz, Fernfahrerplatz mit zwei Sattelzügen, Tankstelle, Felsbogen, Werbetafel, Wasserturm), dazu mehr Kakteen und ein Haus am Ostende; B hat keine Tankstelle und keinen Felsbogen.
  - Mängel:
    1. Die Old Mother Road ist glatter Asphalt ohne Markierung und springt in rechten Winkeln um bis zu fünf Reihen (x 50–55, y 11–20.
    2. X 104–108, y 12–18).
    3. Der Fernfahrerplatz ist ein eckiger Asphaltblock ohne Buchten, die Sattelzüge stehen von der Seite gezeichnet darauf (x 56–67, y 15–25).
    4. Die Tafelberge sind nur ein Wandstreifen am Nordrand und eine Kastenlinie am Südrand, ein Rahmen umläuft die Karte.
    5. Die Tankstelle ist winzig neben dem Felsbogen (x 32–39, y 12–17) und die Zapfsäulen stehen im Sand.
- [x] `weg-desert-summit-hinterzimmer` (wegDesertSummit.hinterzimmer): **C**
  - Warum: Drei Tische mit Brettern und je zwei Hockern gleichmäßig im Raum, Tafel und Regal an der Nordwand, Kisten und Fass an den Wänden, ruhiger Dielenboden; A hat das laute Schrägparkett und einen Tisch mit nur einem Hocker, B Steinplatten und Ziegelwand.
  - Mängel:
    1. Die beiden Figuren stehen frei im Raum statt an einem Brett (x 7, y 3–4.
    2. X 10, y 8–9), niemand sitzt.
    3. Der Kistenstapel links (x 0–1, y 3–4) ist ein von der Seite gezeichnetes Regalstück, das Fass steht einzeln an der Westwand (x 0, y 8).
    4. Die Tafel ist leer, kein Kreidespringer oder Zeichen deutet auf den Treffpunkt hin, die Dielen sind leicht unscharf.
- [x] `weg-ghost-capital-leuchtturm` (wegGhostCapital.leuchtturm): **A**
  - Warum: Leuchtturm und Wärterhaus mittig auf der grünen Landzunge, Weg dicht am Turmfuß vorbei, Bank, Wohnmobil und Tannen im Süden; B rückt den Turm nach Osten und hat Laubbäume, C ist ganz in orange Erde getaucht und passt nicht zum Seeufer.
  - Mängel:
    1. Die Landzunge ist ein kleines Rechteck, das nur vier Reihen in den See ragt (x 55–75, y 3–9), Felsen am Ufer fehlen, „felsig“ ist nichts.
    2. Zwischen See und Wiese liegt ein oranger Erdstreifen über die ganze Breite (y 9–11), dessen Zweck neben dem eigentlichen Weg unklar ist.
    3. Der Weg hat rechtwinklige Versprünge, die Tannen im Süden stehen in drei gleichmäßigen Reihen (y 19–28), der Wald hat keinen Rand.
- [x] `weg-ghost-capital-seeufer` (wegGhostCapital.seeufer): **A**
  - Warum: Strand mit drei Sonnenschirmen und Handtüchern, Fähranleger mit Schiff, zwei Imbisswagen, Schachtische mit Lichterkette und Bühne im Osten, Weg hinter dem Strand, Tannen im Süden; B hat weniger Strandleben, C ist orange Erde statt Wiese.
  - Mängel:
    1. Der „helle Sandstrand“ ist ein oranger Erdstreifen in Wegfarbe (y 9–11).
    2. Das Fährhaus ist ein moderner Glasbau mit Flachdach auf einem eckigen Erdvorsprung (x 44–55, y 4–11), das Schiff eine kleine weiße Jacht quer am Steg (x 60–70, y 3–6).
    3. Der Absperrbock steht im Gras abseits des Wegs (x 3–4, y 17–18), der Wachmann nicht daneben, die Tannen im Süden in gleichmäßigen Reihen.
- [x] `weg-pinewood-ghost-canyonrand` (wegPinewoodGhost.canyonrand): **C**
  - Warum: Deutlichster Übergang vom dichten Kiefernwald im Westen zu Fels und Kakteen im Osten, Weg nahe an der Kante, zwei Bänke und Tafeln an der Kante; in A ist der Wald klein und B fast nur Stein.
  - Mängel:
    1. Die Kante ist eine Doppellinie mit einem schmalen Wandstreifen (y 20–21), darunter liegt der Canyongrund als heller, völlig leerer Streifen auf gleicher Höhe (y 22–28): Tiefe sieht man nicht.
    2. Ein Rahmen umläuft die Karte.
    3. Die Kletterwand ist ein kleiner Felsblock auf der Kante (x 77–80, y 16–21), nicht als Kletterwand mit Routen erkennbar.
    4. Gras und roter Fels stoßen an einer senkrechten geraden Linie aneinander (x 90, y 0–17), der Weg hat rechtwinklige Versprünge.
- [x] `weg-pinewood-ghost-staubstrasse` (wegPinewoodGhost.staubstrasse): **C**
  - Warum: Dichteste Wüste: viele Säulen- und blühende Kakteen, Autowrack, Telegrafenmasten, schiefe Zaunstücke, Staubteufel, Planwagenwrack, verlassene Tankstelle am Weg; A ist ähnlich, aber lichter, B fast leer.
  - Mängel:
    1. Die Piste ist ein glattes hellgraues Band mit rechtwinkligen Versprüngen um bis zu vier Reihen (x 13–15, y 14–21.
    2. X 35–37, y 15–21.
    3. X 59–61, y 8–15.
    4. X 109–111, y 12–19) ohne Fahrspur oder Rand.
    5. Die Telegrafenmasten stehen ohne Draht in ungleichen Abständen, teils auf dem Weg (x 23, y 16–20.
    6. X 120, y 12–16).
    7. Die Zaunstücke sind kurze gerade Stücke ohne Zusammenhang (x 13–20, y 4.
    8. X 39–47, y 24.
    9. X 99–107, y 23), zwei Autowracks statt einem (x 50–54, y 3–6.
    10. X 104–108, y 4–7).
- [x] `weg-pinewood-ghost-tankstelle` (wegPinewoodGhost.tankstelle): **A**
  - Warum: Greifarm mit Tisch und Brett in der Mitte, davor ein zweiter Tisch mit Brett und Hocker, Regale an der Nordwand, Reifen links, Fass rechts, Steinboden; B hat Holzwand und Schrägparkett wie ein Wohnraum, C rückt den Arm an die Ostwand.
  - Mängel:
    1. Der Raum sieht nicht verlassen aus: saubere helle Platten und Ziegelwand, kein Staub, keine Risse, kein Gerümpel.
    2. In den Regalen stehen bunte Dosen statt Ölkanistern (x 1–2 und x 9–10, y 1–3).
    3. Zwei Tische mit Brett (am Greifarm x 5–6, y 4–5 und darunter x 5–6, y 6–7), die Beschreibung nennt einen.
    4. Nichts erinnert an eine Tankstelle (keine Kasse, Theke, Werkstattgrube).
- [x] `weg-silicon-delacroix-deich` (wegSiliconDelacroix.deich): **C**
  - Warum: Am reichsten: Bojenkette und Fähre am Steg, Deichkrone mit Sandsäcken, Rampe zum Platz, Marsch mit vielen Bäumen, Schilf, Blumen, Scheune, Zeltlager, zwei Häuser und ein Boot; A ist dünner, B hat eine lange Zaunlinie und Flachdachhäuser ohne Grund.
  - Mängel:
    1. Der Deich hat keine Höhe: Krone (y 9), grüner Hangstreifen (y 12–13) und Marsch liegen flach untereinander, getrennt durch eine gerade Heckenlinie.
    2. Das Meer ist ein schmaler türkiser Streifen von sechs Reihen statt grau mit Steinschüttung.
    3. Ein Motorboot und ein Ruderboot liegen mitten in der Wiese (x 60–64, y 28–30.
    4. X 124–129, y 26–29), das Loch in der Krone ist nicht zu erkennen, der Erdweg ist 220 Kacheln schnurgerade.
- [x] `weg-silicon-delacroix-faehre` (wegSiliconDelacroix.faehre): **A**
  - Warum: Entspricht der Beschreibung am genauesten: Achterdeck mit Containern, Kisten, Fässern und Rettungsboot, dann Bordbar mit Tisch und Brett, Salon als Deckhaus, Bankreihen auf dem Vorderdeck, dunkles Holzdeck mit heller Reling; B ist ein leeres gelbes Deck mit vier Autos, C mischt Bäume in Kübeln und ein zweites Boot hinein.
  - Mängel:
    1. Die Fähre ist ein Rechteck ohne Bug und Heck, das wie ein Floß im Wasser liegt (x 9–21, y 4–75), kein Schornstein, keine Brücke.
    2. Salon und Bordbar sind kleine Buden aus anderen Paketen (Fischbude mit Hai x 11–18, y 26–33.
    3. Holzcontainer mit Klimageräten x 17–23, y 40–45.
    4. Kiosk x 18–22, y 84–90 im Bild unten), nicht als Schiffsaufbauten lesbar.
    5. Das Dielenmuster ist das laute Schrägparkett, zehn Bänke stehen in fünf gleichen Reihen ohne Blickrichtung (y 56–78).
- [x] `weg-summit-crossroads-geysirbecken` (wegSummitCrossroads.geysirbecken): **C**
  - Warum: Kleinere Becken und die meisten Geysirkegel, breite Sinterflächen dazwischen, Ranger-Haus mit Fahne, Infoplatz mit Bänken, Bisons und Besucher, im Süden Blumenwiese und Tannen; in A und B füllen wenige riesige Rechteckbecken die Karte.
  - Mängel:
    1. Die Becken sind exakte Rechtecke mit grauer Mauerlinie statt natürlicher Sinterränder (alle, etwa x 10–20, y 24–38.
    2. X 0–12 und x 17–30, y 46–56).
    3. Die Holzstege laufen jeweils schnurgerade mittig durch ein Becken, ein Zickzack zwischen Sinterinseln gibt es nicht, und zwischen den Stegen liegt kein Weg über den Sinter.
    4. Gras und Sinter stoßen oben und unten an waagerechten Geraden aneinander (y 22 und y 124), die Bisons sind größer als das Ranger-Haus breit ist und die Dampfwolken stehen über dem Wasser statt über den Kegeln.
- [x] `weg-summit-crossroads-praerie` (wegSummitCrossroads.praerie): **C**
  - Warum: Vollständigste Farm (rotes Farmhaus, Windrad, Traktor, Silo mit Scheunenanbau, Vogelscheuche, Leiterwagen, Kürbisse, Blumen) und Weizen in geschlossenen Flächen bis an beide Ränder, Weg mit mehreren Kurven; A hat nur Scheune und Windrad, B steht mit lückigen Feldern und einem Silo mitten im Feld da.
  - Mängel:
    1. Die rote Scheune mit der Klappe des Sturmkellers fehlt: es gibt Farmhaus und Silo, keine Scheune und keine erkennbare Klappe.
    2. Der Weizen steht auf Wegerde in Rechtecken mit runden Ecken, die oberen Felder in lichten Reihen mit sichtbarem Boden (x 0–10 und x 18–30, y 2–58).
    3. Der Weg hat rechtwinklige Versprünge (x 9–14, y 25–26.
    4. Y 60–61.
    5. Y 95–96.
    6. Y 120–121) und wird an einer geraden Kante zur hellgrauen Schotterstraße (y 130), die Strommasten stehen ohne Leitung beiderseits.
