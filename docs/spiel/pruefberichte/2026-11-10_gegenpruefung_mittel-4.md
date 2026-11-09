# Gegenprüfung der Karten (mittel-4)

Stand: 10.11.2026. Gegenprüfung im Auftrag des Haupt-Chats: Karten anderer Helfer gegen
`docs/spiel/KARTENREGELN.md` Abschnitt 10 (Regeln 1–49) und das jeweilige Ortsdokument.

**Vorgehen:** Alle 84 Szenendateien des Umfangs (A, B, C) mit `pipeline.abenteuer.kartenbau` geprüft
und mit `pipeline.abenteuer.kartenbild` gezeichnet, je Karte ein Vergleichsblatt A | B | C angesehen.
Die automatische Prüfung meldet bei keiner Karte einen Befund; alles unten stammt aus der Sichtprüfung.
Felder als (Spalte, Reihe), Bereiche als „Spalten / Reihen“, alle Angaben ungefähr. An den Karten
selbst ist nichts geändert.

**Umfang:** Riverton, Lockport, Kanalweg und Brücke; Steinbruch und Silicon Bay (Campus, Hafen,
Akademie, Serverraum, Lobby); Fährdeck, Deich, Bayou; Port Delacroix; Weg 7 (Diner, Bergstraße);
Weg 8 (Geysirbecken, Prärie). Crossroads und Jahrmarkt haben noch keine Szenen (letzter Abschnitt).

**Wichtigste Punkte:**

- Geysirbecken (Weg 8) trifft das Ortsbild nicht: offener See statt heißem Boden mit Geysiren,
  Bisons und erkennbarem Ranger-Tor.
- Port Delacroix außen: Die drei Varianten sind fast gleich (Regel 37), Boote treiben frei im Fluss.
- Mehrfach Möbel halb in der Nordwand oder angeschnitten (Bahnhofshalle, Musikhaus, Werkstatt).
- Leere Flächen in einzelnen B-Varianten (Diner, Bergstraße, Prärie).

## Riverton (mittel-3)

### riverton.bahnhofshalle

- **A:** Schalter „TICKET“ an der Westwand (1, 10) ist links angeschnitten: Schild und Tresen ragen in die Wand. Vorschlag: eine Spalte nach rechts. Die Kioskregale (1, 3) stehen an der Westwand und sind ebenfalls halb in der Wand. Drei graue Schließfächer frei im Raum (3–9, 12): als Schließfachreihe an eine Wand stellen (Regel 31).
- **B:** Fahrplantafel frei mitten im Raum (18, 12), nicht an der Wand (Regel 10, 26). Vorschlag: an die Nordwand oder neben den Ausgang. Schließfächer (6–8, 13) frei vor der Südwand ohne Gruppe.
- **C:** in Ordnung. Kleinigkeit: einzelner oranger Stuhl (14, 13) neben der Wartebank ohne Gruppe.

### riverton.pavillon

- **B:** kaum von A zu unterscheiden (gleiche Wand, gleicher Boden, dieselben Tische mit Stühlen, nur eine Gruppe mehr) — für den Autor auf den ersten Blick derselbe Raum (Regel 37). Vorschlag: anderer Boden oder runde Tische wie in C, Bänke statt Stuhlgruppen.
- **A, B:** Kisten in den Ecken (1, 12) und (18, 12) ohne Grund (Regel 18). Die Mitte (8–12, 4–10) ist leer; im Ortsdokument steht „Uhren klopfen, Marmorbretter“: ein langer Tisch mit Uhren in der Mitte würde sie füllen.
- **C:** in Ordnung.

### riverton.schuppen

- **A, B, C:** in Ordnung (Leiter an der Wand, Werkbank, Fahrrad unter der Plane). Kleinigkeit A: Sägebock (7, 5) steht vor dem Wasserkanister; ein Feld nach links.

### riverton.wohnwagen

- **A:** Pokale (4, 1) hängen frei auf Höhe der Wandkrone neben dem Regal, ohne Bord darunter (Regel 10, 13). Vorschlag: auf das Regal oder eine Kommode stellen.
- **B:** Pokale (5, 1) hängen vor dem Fenster (Regel 15). Vorschlag: neben das Fenster auf eine Kommode.
- **C:** Pokale (7, 1) wie in A frei an der Wand; sonst in Ordnung (Etagenbett, Tisch mit Brett).
- **A, B, C:** Zeitungsstapel in der Südwestecke (1, 6) liegt halb über der Wand (Bild ragt nach unten); eine Reihe höher.

## Lockport (mittel-3)

### lockport.aussen

- **A und C** sind fast gleich: dieselben fünf Häuser an denselben Stellen, dieselben Wege; C hat nur mehr Kleinkram und ein zweites Boot (Regel 37). Vorschlag: in C andere Hausmodelle oder den Platz mit der Kneipe anders anlegen.
- **A, C:** Der Kanal endet am Westrand an einer Steinkante (0, 5–7): Laut Ortsdokument endet der Seitenarm im Hafenbecken; das Becken sollte als Becken erkennbar sein (Kai rundum), nicht wie abgeschnitten.
- **B:** Das kleine blaue Haus (17, 2) ist ein Spielhaus aus dem Katalog und wirkt neben den Wohnhäusern wie ein Fremdkörper (Stilbruch).
- **A, B, C:** Die Bäume sind herbstlich; das passt zu Akt 2. In B steht der Brunnen (3, 22) am Rand des Platzes halb im Pflaster und halb auf Gras.

### lockport.gasthaus

- **A:** Kisten (16, 10) neben der Tür ohne Grund (Regel 18); sonst in Ordnung (Theke mit Hockern, Kegelbahn, Ofen).
- **B:** Schulpulte (5–9, 4 und 9) als Gasthaustische — Stilbruch; Vorschlag: runde Tische wie in A und C oder Holztische mit Bänken.
- **C:** in Ordnung.

### riverton.aussen

- **A, B, C:** Die Straße nach Süden überquert den Fluss ohne Brückenbild, nur als Asphaltband über dem Wasser (etwa Spalten 50–52, Reihen 38–44). Regel „Brücken und Stege sind Bauwerke“: Brücke als Bild (`bruecke_strasse_gehweg_laengs_7` oder ähnlich), Wasser mit Ufer darunter.
- **A:** Nordteil zwischen Bahnhof und Wasserturm (etwa 20–60 / 3–15) ist eine fast leere Wiese; laut Ortsdokument liegt dort der Bahnhofsplatz mit Leben. Vorschlag: Bäume, Bänke, Fahrradständer oder Taxistand. Das kleine blaue Spielhaus im Süden (etwa 52, 47) ist ein Stilbruch neben Wohnhäusern.
- **B, C:** Der riesige Kaffeebecher-Kiosk (etwa 12, 27 in B; 50, 27 in C) sprengt den Maßstab der Häuserzeile und passt nicht zur Kleinstadt (Stilbruch); Vorschlag: normale Ladenfront oder Bude.
- **A, B, C:** Im Süden stehen zwei Reihen kleiner dunkler Pfosten in Gruppen (etwa 22–33 / 44–50); sie sind im Bild nicht als Park, Garten oder Parkplatz zu erkennen. Vorschlag: Zweck sichtbar machen (Beete mit Zaun, Markierungen) oder entfernen.

### wegRivertonIronwood.kanalweg

- **A, B, C:** Ein Boot treibt mitten im Kanal (etwa 20, 92 in A; 19, 95 in B; 25, 90 in C), nicht festgemacht (Regel 24). Vorschlag: längs ans Ufer oder an den Steg.
- **A, C:** Am Ostufer unten eine Reihe gleicher Pappeln (etwa 28–30 / 170–195), in C auch am Westweg (Regel 20). Vorschlag: zwei Baumarten im Wechsel.
- **B:** Kisten frei auf der Wiese (etwa 3–6 / 28–36) ohne Hof oder Zaun (Regel 18).
- **A, B, C:** Das Ostufer ist über die ganze Länge nur Busch- und Baumstreifen; als Waldrand in Ordnung, aber eine Bank mit Blick auf das Wasser oder ein Angler würde den langen Weg beleben.

### wegRivertonIronwood.bruecke

- **A, B, C:** Laut Ortsdokument (riverton.md 1.5) trägt eine **Eisenbrücke mit Fachwerk und Nieten** den Pfad hoch über den Kanal im **Einschnitt mit Felswänden** (BR3–BR5); gezeichnet ist nur ein schmaler Holzsteg über einen ebenerdigen Kanal (etwa 13–14 / 75–80), ohne Felswände. Damit fehlt der Ort für den Fund „Nietenkopf“ (Akt 2) sichtbar. Vorschlag: Einschnitt mit `wand: fels` und eine Fachwerkbrücke (wie `eisenbahnbruecke_1879_quer` oder eine eigene Fußgänger-Fassung).
- **A:** Kleines rotes Häuschen oben (etwa 12, 18) wirkt wie ein Spielhaus, nicht wie das im Ortsdokument genannte verlassene Wärterhaus mit vernagelter Tür. Laternen stehen frei auf der Wiese (etwa 17, 20 und in C 19, 18 und 19, 46) statt am Weg (Regel 19).
- **A, B, C:** Große Wiesenflächen westlich des Pfads (etwa 1–15 / 20–70) nur mit verstreuten Steinen; laut Ortsdokument Ginster und Hangbüsche. Die Serpentinen mit Zäunen sind gut.

## Steinbruch (mittel-2)

### steinbruch.grube

- **A, B, C:** Das Lorengleis endet im Osten offen (etwa 52, 41 in A), ohne Prellbock (Regel 42); im Westen ist einer.
- **A, B, C:** Das Wasserloch hat ein Grasufer; Regel 6 verlangt im Steinbruch `"ufer": "stein"`.
- **B:** Die mittlere Stufe (etwa 1–64 / 10–20) ist bis auf einen Stein leer; die Sohle ebenfalls weitgehend leer. Vorschlag: Geröll, Steinblöcke, Bauholz wie in A und C.

### steinbruch.stollen

- **A, B, C:** Das Gleis im Hauptgang endet oben an der Kreuzung ohne Prellbock oder Lore (Regel 42).
- **A, B, C:** Die Steine in den Kammern tragen grüne Grasbüschel (Katalogbild mit Gras); im Stollen ohne Licht ein Stilbruch. Vorschlag: Steine ohne Gras (`scFels*` oder Geröll).

## Silicon Bay (mittel-2, niedrig-1)

### siliconBay.aussen

- **A:** Der Platz südlich der Bahn (etwa 1–71 / 29–50) ist eine fast leere Pflasterfläche mit sechs Kübeln, zwei Bänken und dem Brunnen; laut Ortsbild belebter Campus. Vorschlag: Rasenfelder wie in B, Bäume, Sitzgruppen. Das kleine Backsteinhaus (etwa 3, 38) ist im Glas-Campus ein Stilbruch.
- **A, B, C:** Die drei Plakatwände oben rechts (etwa 56–70 / 2–7) sind bis auf eine leer (weiße Flächen). Vorschlag: Werbung von Perfect Move oder weglassen. Der Kaffeebecher-Kiosk (A, C, etwa 60, 33) sprengt den Maßstab.
- **C:** Das schräge dunkle Gebäude mit Solardach (etwa 46–56 / 6–18) wirkt verzerrt und passt in Perspektive und Stil nicht zu den Nachbarn. Vorschlag: anderes Bürohaus.
- **B:** in Ordnung (Rasenfelder, Wege, Brunnen).

### siliconBay.hafen

- **A, B, C:** Große leere Pflasterfläche zwischen Häuserzeile und Kai (etwa 1–64 / 18–30) mit verstreuten Kisten (Regel 18). Vorschlag: Ladezone mit Containern und Gabelstapler an einer Stelle bündeln, Rest als Promenade mit Bänken zum Wasser.
- **A, C:** Fischerboot treibt frei im Hafenbecken (etwa 16, 34); längs an den Kai oder Steg legen (Regel 24).
- **C:** Der Leuchtturm (etwa 60–64 / 24–40) steht auf einem kleinen Sockel im Wasser am Kartenrand und ist am rechten Rand angeschnitten. Vorschlag: auf die Mole, ganz im Bild.

### siliconBay.akademie

- **A:** rechte Hälfte (etwa 16–24 / 3–11) bis auf Schreibtisch und Pokaltisch leer; die Pokale stehen auf einem niedrigen Tisch in der Mitte des Raums statt in einer Vitrine an der Wand.
- **B, C:** in Ordnung; B ist schlicht, C mit Wasserspender und Automat belebter.

### siliconBay.lobby

- **A:** große Leerfläche in der Mitte (etwa 5–15 / 6–10); einzelner Sessel und Tisch ohne Gruppe (Regel 31).
- **B:** sehr karg (ein Aufzug, ein Bildschirm, ein Sofa, ein Sessel, Empfang); Vorschlag: Wartebereich mit Tisch und Sesseln, Vitrine wie in C.
- **C:** in Ordnung.

### siliconBay.serverraum

- **A, C:** in Ordnung.
- **B:** wenige Schränke, die Mitte und der Süden sind leer; Vorschlag: zweite Reihe Serverschränke wie in A.

## Delta (mittel-3)

### wegSiliconDelacroix.faehre

- **A, B, C:** Das Deck ist ein Rechteck ohne Bug und Heck; als Schiff ist es nur an der Reling zu erkennen. Vorschlag: Bug und Heck schräg zulaufen lassen (Wasser in den Ecken) oder Brücke und Schornstein als Bild am Bug.
- **A:** Die Mitte des Decks (etwa 2–14 / 22–34) ist leer; dort eine Sitzgruppe oder Ladung.
- **B:** sehr karg zwischen Kajüte und Heck (etwa 2–14 / 28–55): nur drei Bänke und ein Stuhl. Vorschlag: Bankreihen wie in A.
- **A, C:** Rettungsboote liegen frei auf dem Deck (etwa 9, 13); Vorschlag: an Davits an der Reling oder längs an der Bordwand.

### bayou.steg

- **A, B, C:** Das Wasser ist hell türkis wie ein See; laut Ortsdokument dunkles Bayou-Wasser mit Nebel. Vorschlag: dunkleres Wasser (eigenes Material) oder wenigstens Seerosen, Schilf im Wasser und Sumpfzypressen am Rand.
- **B:** sehr karg: zwei Inseln mit je zwei Bäumen, eine Hütte. Vorschlag: Schilfgürtel, Bootssteg mit Luftboot, Angler.
- **C:** in Ordnung (mehrere Inseln, Stege, Luftboot, Hütten). Das weiße Ruderboot unten links (etwa 3, 21) liegt quer vor einer Insel ohne Steg (Regel 24).

### wegSiliconDelacroix.deich

- **A, B, C:** Der Deich ist laut Auftrag und Ortsdokument erhöht (Regel 49, `wand: damm`); im Bild ist nur ein flacher Grasstreifen mit Hecke zwischen Kronenweg und Marsch zu sehen (etwa Reihen 3–5 über die ganze Länge). Vorschlag: `#`-Reihen mit `"wand": "damm"` als sichtbare Böschung.
- **A, B, C:** Ein Abzweig vom Kronenweg nach Süden (etwa 30–34 / 5–8) endet nach einer Kurve mitten in der Marsch, ohne Ziel (Regel 32).
- **A, C:** Ruderboote liegen auf der Wiese in der Marsch (etwa 40, 6 und 19, 6 in C); B ebenso (etwa 38, 6). Regel 24: Boote am Ufer oder Steg.
- **B:** vier Laternen mitten in der Marsch (etwa 6–28 / 7) ohne Weg (Regel 19) und ein langer Zaun ohne Zweck (etwa 6–26 / 4).
- **A, B, C:** Die kleinen Spielhäuschen (rot, blau, grün; etwa 60–68 / 4–5) sind im Maßstab viel kleiner als ein Wohnhaus (Stilbruch). Vorschlag: Fischerhütten oder Stelzenhäuser in voller Größe.

## Port Delacroix (mittel-1)

### portDelacroix.aussen

- **A, B, C:** Die drei Varianten haben denselben Grundriss: Bahn am Westrand, Straße an derselben Stelle, das große Stadthaus, der Speicher mit Solarzellen und das Haus mit rotem Dach unten links stehen fast gleich (Regel 37). Vorschlag: in B und C andere Gebäude und eine andere Lage des Platzes.
- **A, B, C:** Ruderboote und Fischerboote treiben frei im Fluss (etwa 52–56 / 6–18), nicht am Kai oder Steg (Regel 24); der kurze Steg (etwa 50, 9) ist leer.
- **A, B, C:** Kleine Spielhäuschen (etwa 8, 9; 22, 22; 26, 22) neben vollen Wohnhäusern (Maßstab, Stilbruch). Vorschlag: Häuser in Wohnhausgröße oder Zelte und Bauwagen passend zum Wiederaufbau.
- **A, B, C:** Gut zum Ortsbild passen Sandsäcke am Deich, Zelte, Planen und das Gerüst; das Musikhaus als Ruine ist außen nicht zu erkennen (welches Gebäude?). Vorschlag: Ruine mit Plane und Bauzaun deutlich zeigen.

### portDelacroix.musikhaus (Ruine)

- **A, B, C:** gut getroffen (Löcher im Boden, Pfützen, Trümmer, Notenständer). Kleinigkeit A: Plane über dem Klavier (1, 2) steht halb in der Nordwand; eine Reihe tiefer.
- **B:** die drei großen Pfützen (etwa 8–9 / 4; 3, 8; 12, 8) sind kreisrunde Teiche aus Wasserbild; im Raum besser die Pfützenbilder (`pfuetze_fels_*` oder eigene Holzpfütze).

### portDelacroix.musikhaus (neu, zustand musikhausOffen)

- **A, B, C:** in Ordnung (Schild „MUSIK UND SCHACH SEIT 1889“, Klavier, Regale, Spieltische). B: Bank an der Südwand (13, 11) zeigt mit der Sitzfläche zur Wand.

### portDelacroix.turnhalle

- **A:** in Ordnung (Spielfeld, Körbe, Spieltische am Rand und auf dem Feld als Ausweichclub). Die Tafel (12, 2) steht frei vor der Nordwand zwischen zwei Fenstern; an die Wand rücken.
- **B, C:** kein Spielfeld auf dem Boden, nur die Körbe an der Wand: so wirkt der Raum nicht mehr wie eine Turnhalle (Regel 22, 30). Vorschlag: Linien oder Hallenboden wie in A, die Spieltische darauf.
- **C:** Kisten in drei Ecken ohne Grund (Regel 18).

### portDelacroix.werkstatt

- **A:** in Ordnung (Klavierbauwerkstatt mit Werkbank, Flügel, Klavieren, Holz).
- **B:** in Ordnung.
- **C:** der Flügel oben links (1, 1) steht zur Hälfte in der Nordwand; eine Reihe tiefer. Die Plane über dem Klavier (5, 1) ebenso.

## Weg 7: Diner und Bergstraße

### wegDesertSummit.diner

- **A, C:** Der rote Felsbogen (etwa 13–17 / 2–7) steht als freie Dekoration neben der Straße, kein Weg führt hindurch, der Bogen wirkt hingestellt. Vorschlag: Straße oder Trampelpfad durch den Bogen führen oder den Bogen an den Rand rücken.
- **A, C:** Grüne Kiefern im Westen mitten in der Wüste (leichter Stilbruch). Vorschlag: Joshua-Bäume, Kakteen oder trockene Büsche.
- **B:** Im Süden eine breite leere Sandfläche (etwa Reihen 30–40). Vorschlag: Felsen, Kakteen, ein liegengebliebener Wagen oder Zaunpfähle.
- Sonst gut: Diner, Motel mit Schild, Lastwagen auf dem Parkplatz, Wasserturm, Windrad, Plakatwand.

### wegDesertSummit.bergstrasse

- **A, B, C:** gut (Kehren mit Leitplanken, Terrassen, Wald nach oben dichter).
- **B:** Die mittlere Stufe (etwa Reihen 28–34) ist eine große leere Sandfläche, der Wald ist dünner als in A und C. Vorschlag: Felsen, Büsche, ein Aussichtspunkt mit Bank.
- **A:** Eine einzelne Statue auf Sockel steht ohne Zusammenhang auf der Terrasse (Regel 18). Vorschlag: Gipfelkreuz, Wegweiser oder Aussichtsfernrohr.

## Weg 8: Geysirbecken und Prärie (mittel-3)

### wegSummitCrossroads.geysirbecken

- **A, B, C:** Das Ortsbild verlangt Holzstege über heißem, dampfendem Boden mit Geysiren, Bisons und dem Ranger-Tor S10. Gezeichnet ist ein glatter blauer See mit grauen, betonartigen Platten und Stegen; Geysire, Dampf, farbige Quelltöpfe und Bisons sind nicht zu sehen, das Ranger-Tor ist nicht zu erkennen (Regel 48; nur ein Zaun mit Lücke und eine Hütte im Norden). Vorschlag: Boden aus Schotter oder hellem Sinter, darauf Geysir- und Quelltopfobjekte (notfalls bestellen), Stege über Land statt über offenes Wasser, zwei bis drei Bisons, ein deutliches Tor mit Rangerhäuschen.
- **A, B, C:** Alle drei Varianten folgen demselben Aufbau (See in der Mitte, Stege ringsum), Regel 37 knapp erfüllt. Vorschlag: in B und C die Becken anders verteilen.

### wegSummitCrossroads.praerie

- **A:** gut (Weizen bis an die Ränder, Farm mit Scheune und Windrad, Sturmkellerklappe, Vogelscheuche). Kleinigkeit: Der Erdweg geht ab etwa Reihe 130 ohne Übergang in eine graue Straße über, die wie Beton wirkt; im Ortsdokument ist es eine Schotterstraße. Vorschlag: Boden Schotter statt Asphaltgrau oder ein Stück gemischter Übergang.
- **B:** Kaum Weizen: Zwischen Reihe 25 und 90 fast nur leeres Gras mit wenigen Büschen (Ortsbild „Weizen bis an beide Ränder“, Mindestbelegung). Vorschlag: Weizenfelder auch im Norden und im Westen, Feldwege dazwischen, eine Scheune zum Silo.
- **C:** Der Erdweg endet bei etwa (12, 126) im Gras, die Schotterstraße beginnt erst bei (14–16, 130) daneben: Weg ins Nichts (Regel 28, 32). Vorschlag: Weg bis an die Straße führen.
- **C:** Sonst gut (Farmhaus, Traktor, Silo, Blumen).

## Nicht prüfbar

- **crossroads.aussen, crossroads.raststaette** (mittel-3) und **Jahrmarkt N6:** Noch keine Szenen im Bestand; nach dem Bau gegenprüfen.

## Erledigt: mittel-1 (10.11.2026, Zweig claude/schach-abenteuer-mittel-1-cl431d)

- **portDelacroix.aussen** (5880debf): Boote an Kai und Steg; Spielhäuschen durch Wohnhäuser in
  Wohnhausgröße ersetzt; Musikhaus-Ruine mit Planen auf dem Dach und Bauzaun vor dem Eingang, weitere
  Planen auf beschädigten Dächern. Grundriss: B und C hatten schon andere Gebäude und eine andere Lage
  des Platzes (C Platz im Westen); die Varianten-Prüfung meldet keine Ähnlichkeit.
- **portDelacroix.turnhalle** (443ca914): B und C mit Spielfeld; C nur noch ein Kistenstapel in der
  Ecke. A: der „Tafel“ genannte Gegenstand ist der Lehrertisch an der Nordwand, bleibt.
- **portDelacroix.musikhaus** (443ca914): Klavier unter Plane in A eine Reihe tiefer; B nasse Flecken
  statt runder Pfützen. **Neu B:** Bank nicht mehr zur Südwand.
- **portDelacroix.werkstatt C** (443ca914): Flügel und Klaviere eine Reihe tiefer.
- **riverton.bahnhofshalle** (934ae19b): A Schalter aus beiden Teilen und von der Wand weg, Regale
  ebenso, Schließfächer als Reihe an der Westwand; B Fahrplantafel an der Nordwand, Schließfächer als
  Dreierreihe. C: der „orange Stuhl“ ist ein Koffer neben dem Gepäckwagen, bleibt.
- **riverton.pavillon** (934ae19b): B mit grünen Wänden, Steinboden und Picknicktischen. A: Die
  Figurenkiste in der Ecke ist Szene 37 (Slick packt), bleibt; der Kreuzgang in der Mitte ist nach dem
  Ortsdokument gewollt.
- **riverton.schuppen A** (934ae19b): Sägebock versetzt.
- **riverton.wohnwagen** (934ae19b): Pokale auf einer Kommode, Zeitungen eine Reihe höher.
