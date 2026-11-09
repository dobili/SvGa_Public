# Gegenprüfung der Karten anderer Helfer (mittel-3)

Stand: 10.11.2026, nachts. Auftrag des Haupt-Chats: Karten von mittel-2, mittel-4, niedrig-1 und
mittel-1 mit frischen Augen gegen `KARTENREGELN.md` Abschnitt 10 (Regeln 1–49) und das jeweilige
Ortsdokument prüfen; nichts an fremden Karten ändern.

**Vorgehen:** Je Helfer der Zweig mit seinem neuesten Stand als eigener Arbeitsbaum; dort
`kartenbau` und `kartenbild` für A, B und C jeder Karte (Bilder in einem eigenen Ordner, nicht im
Repository), dann die Bilder angesehen. Alle 57 Szenen bestehen den Kartenbau („in Ordnung“); die
Befunde unten sind solche, die die Prüfprogramme nicht sehen. Felder als (Spalte, Reihe), ungefähr,
nach dem Bild. Hinweise des Kartenbilds zum Katalog („noch nicht beschrieben“, „angeschnitten“) stehen
nur dort, wo sie im Bild auffallen.

**Häufige Befunde über alle Orte**

1. **Türen ohne Weg:** Hütten, Scheunen, Werkstätten und Wärterhäuser stehen ohne Zuweg im Gras
   (Summit City, Hochebene-Schule, Pinewood Camp, Riesenbäume, Kürbishof, Leuchtturm).
2. **Jahreszeit:** Akt 4 spielt im Sommer; orange Herbstbäume stehen in Capital (Seeufer B,
   Leuchtturm B, Arena A/C).
3. **Boden mit Punkten:** Mehrere Karten nutzen Gras mit Erd- oder Sandpunkten als Grundboden
   (Ghost Town, Staubstraße C, Seeufer/Leuchtturm C); Wegränder werden dadurch grün, Strand und
   Wüste lesen sich als Feld.
4. **Höhen (Regel 49):** Canyonrand, Bruchkante in Ghost Town und Felsplatten der Hochebene sind
   flach gezeichnet.
5. **Varianten (Regel 37):** Summit City B, Hochebene-Schule C und Arena B gleichen A zu sehr;
   in Summit City stehen außerdem die Türauslöser je Variante woanders.

## mittel-2: Summit City und Hochebene (Zweig abenteuer-regelwerk, 405ed693)

### summitCity.aussen

- A/B/C (Regel 37): Die Türauslöser stehen in jeder Variante woanders: `huetteTuer` A/C (8, 26), B (17, 26); `bergladenTuer` A/C (21, 24), B (7, 23); `seilbahnTal` A (54, 22), B (46, 22), C (56, 22). Übergänge sollen in allen Varianten dieselben Felder haben (sonst stimmt die Ankunft aus den Innenräumen nur in einer Variante). Vorschlag: Hütte, Laden und Talstation in B und C an die Stelle von A setzen und nur Deko, Bäume und Stände variieren. Zudem weicht A vom Ortsdokument 1.7 ab (dort `huetteTuer` (8, 27), `bergladenTuer` (22, 28), `seilbahnTal` (57, 22)); eins von beiden angleichen.
- A/B/C (Türen ohne Weg): Die Ferienhütten in S7 und S8 (z. B. A um (6, 34), (14, 41), (47, 39), (57, 44)) haben keinen Weg zur Tür; sie stehen frei im Gras. Vorschlag: je ein kurzer Erdweg (zwei Felder) von der Tür zum Pflaster oder zum Erdweg nach Weg 8.
- A/B/C (leere Flächen): Westen und Osten (etwa 2–24 / 32–54 und 58–68 / 20–54) sind gleichmäßig mit einzelnen Pinien bestreut; die Ziegen, der Holzhacker und die Wiese mit Blumen aus dem Ortsdokument (S7, S8) fehlen im Bild. Vorschlag: Ziegengatter mit Holzstapel bei den Westhütten, Blumenwiese und Bank im Osten.
- B (Regel 37): B unterscheidet sich von A fast nur durch vertauschte Gebäude und weniger Stände; Platz, Wege, Talstation und Hüttenlage sind gleich. Vorschlag: andere Platzform (rund oder länglich), Hütten aus einer anderen Serie, Markt ohne Fest durch Bäume oder einen Brunnen-Garten ersetzen.
- C: gut belebt (Fest mit vier Ständen, Wimpelketten, Laternen). Die Wimpelketten über dem Südrand des Platzes (um 26–46 / 40) hängen frei ohne Pfosten; Vorschlag: Laternen- oder Mastpfosten an den Enden.

### summitCity.huette

- A/B/C: Der Schornstein des Kamins ragt über die Nordwand hinaus bis an den Bildrand (A um (8, 0), B um (4, 0), C um (8, 0)); im Raum ist das ein Stück Außenwand. Vorschlag: Kamin ohne Schornsteinaufsatz oder `an_wand` mit Versatz, sodass er in der Wandfläche endet.
- A/B: `kisteRot` an der Ostwand (A um (16, 8)) bzw. Westwand (B um (0, 11)) ist ein Bauteil und wirkt angeschnitten; `mf2StuhlR` ebenso (Kartenbild meldet es). Vorschlag: ganze Kiste (z. B. `rvKiste`) und ein Stuhl aus einer vollständigen Serie.
- A/B/C: keine Fenster; eine Blockhütte am Berg sollte wenigstens zwei Fenster in der Nordwand haben. Die im Ortsdokument genannten Endspieldiagramme und das Gipfelfoto sind nur in C als Bild zu sehen. Vorschlag: zwei `wzFenster` und Bilderrahmen an der Wand in allen Varianten.
- B: rechts unten viel leere Fläche (13–17 / 7–11); Vorschlag: zweiter Clubtisch oder Leseecke.

### summitCity.bergstation

- A/B/C: Die Gondel steht frei im Raum, ohne Seil, Schiene oder Plattform (A um (13, 3), B um (1, 3), C um (13, 3)); sie liest sich als rotes Möbel. Vorschlag: eine Bahnsteigkante oder Plattform (Boden `stein` oder eine Reihe Geländer) davor und ein Seil an der Decke (Bild bestellen).
- A/C: Der Fahrkartenschalter (`rvTicketschalter`) klebt an der Westwand und ist links angeschnitten (A um (0, 6)); Vorschlag: eine Kachel nach rechts.
- A/B/C: Die Murmeltierpfeife (`fundMurmeltierpfeife`) ist im Bild nicht zu erkennen; Vorschlag: kleines Ding auf der Bank oder eine Kiste mit Fundsachen, damit der Fund einen Ort hat.
- A/B/C: viel leere Fläche in der Raummitte (z. B. A 6–12 / 6–10); Vorschlag: Sitzbankreihe oder Schließfächer, wie im Ortsdokument genannt.

### summitCity.bergladen

- A/B/C (Stilbruch): Die Regale sind Bücherregale; ein Bergladen braucht Ausrüstung (Seile, Rucksäcke, Laternen, Karten). Vorschlag: Regale aus dem Laden- oder Lagerset (z. B. `mf9Vorrat*`, Haken mit Seilen), Rucksäcke auf dem Boden lassen.
- A/B/C: Der weiße Glastisch in der Mitte (A um (6, 5)) passt nicht in einen Holzladen; der Ständer mit Wanderkarten aus dem Ortsdokument fehlt. Vorschlag: Holztisch mit ausgelegten Karten oder ein Kartenständer.
- A/B: `kisteRot` (A um (2, 7), B um (0, 6)) wirkt angeschnitten; `cc4Falttisch` ebenso (Kartenbild).
- A/B (karg): rechte Raumhälfte fast leer. Vorschlag: zweites Regal oder Schaufensterpuppe mit Jacke.

### hochebene.felsentuerme

- A/C: Einzelne dunkle Quadrate aus `felsbodenRot` mitten im Sand (A um (3, 7), (15, 10), (17, 22), (33, 22), (80, 24); C um (6, 24), (13, 21), (32, 21), (38, 21)) lesen sich wie Bildfehler. Vorschlag: zu größeren, unregelmäßigen Felsplatten zusammenfassen oder weglassen.
- A/B/C: Die dunklen Rechtecke (A 30–60 / 20–26, 60–90 / 3–8; B 20–70 / 20–26) haben gerade Kanten und wirken wie Bodenfliesen. Vorschlag: unregelmäßige Umrisse oder als Felsstufe mit `#` und `wand: felsRot` (Regel 49), damit sie als Plateau lesbar werden.
- A/C (Ortsdokument): Die Koppel mit Pferd und Wassertrog (F3) ist ein Zaun um ein Steindenkmal (A um (58–70, 13–21), C um (32–45, 4–11)); ein Denkmal auf der Hochebene widerspricht dem Hinweis in 09 5.9 (keine heiligen Zeichen). Vorschlag: Koppel mit Pferd (Belebung), Trog und Heu statt Denkmal.
- B (leere Fläche, Wegeführung): Der Weg läuft schnurgerade von Rand zu Rand, die Fläche ist fast leer (zwei Felstürme, Kakteen); Felsbogen, Koppel, Schulweg-Schild fehlen. Vorschlag: Weg mit zwei Bögen wie in A/C, Felstürme beidseits, Koppel und Steintisch-Wacholder.
- A/B/C: Die Nordkante hat eine rechteckige Einbuchtung (A 64–76 / 0–4, B 30–50 / 0–4, C 20–30 / 0–4) ohne Funktion; Vorschlag: weglassen oder als Felsnische mit Kakteen nutzen.

### hochebene.schule

- A/C (Regel 37): C ist fast dieselbe Anlage wie A (Schulhaus, Platz, Basketballfeld, Werkstatt, Bus an denselben Stellen), nur mit mehr Bäumen und Bänken. Vorschlag: in C Schulhaus und Hof spiegeln oder ein anderes Schulgebäude (flaches Gebäude mit Turnhalle), Feld an eine andere Stelle.
- A/B/C (Ortsdokument): Die Turnhalle mit Basketballkorb an der Wand fehlt (nur ein freies Feld in A/C, ein Korb auf dem Pflaster in B). Vorschlag: eigenes Turnhallengebäude, Korb mit `basketballkorb_wand.png` an seiner Wand.
- A/B/C (Türen ohne Weg): Die Werkstatt von Joss Vell (A/C um (1, 23), B um (40, 23)) steht mit dem Rolltor im Gras ohne Zufahrt. Vorschlag: Zufahrt aus Asphalt oder Schotter vom Rolltor zur Straße.
- A/B/C: Die Straße läuft von Rand zu Rand ohne Übergang (Regel 47/28 erlaubt das am Rand), aber der Schulbus steht mitten auf der Fahrbahn ohne Haltebucht. Vorschlag: Haltebucht oder Bus an den Rand, Bushaltestelle mit Schild daneben.
- B: Ostteil (40–58 / 0–18) ist leere Wiese mit wenigen Büschen. Vorschlag: Basketballfeld oder Spielgeräte dorthin.

## mittel-4: Pinewood (Zweig claude/exciting-einstein-wfemr9, 1e3a187b)

### wegCrossroadsPinewood.huetten

- A/B/C: Insgesamt stimmig (Bach mit Steg, Schutzhütte mit Holzstapel, Feuerstelle, Wegweiser „Long Ridge Trail“ am Ostrand).
- B/C: Die Schutzhütte steht abseits des Wegs (B um (72, 1), C um (65, 1)); die Tür hat keinen Zugang, der Weg läuft zwei bis vier Reihen darunter vorbei. Vorschlag: kurzer Stich vom Weg zur Veranda oder Hütte direkt an den Weg wie in A.
- A/B/C: Der Weg knickt nur rechtwinklig ab (Treppenstufen), auf 150 Kacheln wirkt das wie ein Raster. Vorschlag: an zwei, drei Stellen diagonale Stufen (wie beim Kanalweg) für weiche Bögen.
- A/B/C (Ortsdokument): Blumenwiese (HU2), Felsen am Hang (HU7) und die Sichtachse auf die Riesenbäume (HU8) sind nicht zu erkennen; der Wald ist über die ganze Länge gleich gemischt. Vorschlag: im Osten eine offene Blumenwiese, im Westen Felsgruppen und ein freier Blick nach Westen.
- C: Eine zweite Feuerstelle mit Steinen steht ohne Bank oder Bezug im Wald (um (43, 21)); Vorschlag: weglassen oder als Lagerplatz mit Baumstamm.

### wegCrossroadsPinewood.riesenbaeume

- A/B/C (unlesbar): Die Mammutstämme (`cp7MammutStamm`, 31 Stück in A) zeigen nur Stämme ohne Krone; sie lesen sich als **gefällte Baumstümpfe**, nicht als Riesenbäume. Am Rand stehen sie in einem gleichmäßigen Raster (A Spalten 1–2 und 33–34, alle vier Reihen). Vorschlag: beim Haupt-Chat einen Mammutbaum mit Stamm und Kronenansatz bestellen (Krone als Schatten über dem Weg), Stämme unregelmäßig setzen.
- A/B/C: Neben den Stämmen stehen normale Kiefern mit Krone (`pw7Tanne`, `pw7Kiefer`); die echten „Riesen“ sind kleiner als die Kiefern daneben. Vorschlag: Maßstab umdrehen, die Riesen deutlich höher.
- A/C (Türen ohne Weg): Das Ranger-Häuschen (A um (13, 27), C um (32, 30)) hat keinen Weg zur Tür; der Auslöser `rangerhaus` (16, 45) liegt in A weit unter dem Haus. Vorschlag: Stich vom Weg zur Tür, Auslöser vor die Tür.
- A/B/C: Der Bach in Reihen 92–93 ist zwei Felder breit und läuft von Rand zu Rand, gut; der Steg passt.

### pinewoodCamp.aussen

- A/B/C (Türen ohne Weg): Die Blockhütten (A drei um (34–51, 4), B zwei um (3–13, 4), C zwei um (39–50, 4)) haben keinen Weg zur Tür; der Hauptweg läuft weit darunter. Vorschlag: Erdweg (zwei Felder) vor den Hütten mit Anschluss an den Weg zum Lagerfeuer.
- A/B/C (unlesbar): Die Riesenbäume am Nordrand sind wieder nur Stämme und lesen sich als Baumstümpfe (siehe Riesenbäume).
- A/B/C (leere Fläche): Der See (Reihen 30–43, ganze Breite) ist leer; das Kanu liegt an Land. Vorschlag: zwei Kanus am Steg im Wasser, eine kleine Insel oder Seerosen, Schwimminsel mit Badeleiter.
- B (Stilbruch): Der Lagerfeuerplatz ist mit grauem Pflaster belegt (um (16–25, 9–16)); im Wald passt Erde oder Sand wie in A/C. Vorschlag: Boden `erde` oder `sand`.
- A/C: Der Lagerfeuerplatz ist ein rechteckiger Erdfleck mit Graspunkten; Vorschlag: runder Platz (gestufte Ecken) und Baumstämme im Kreis, wie im Ortsdokument.

### wegPinewoodGhost.canyonrand

- A/B/C (Höhe nicht lesbar, Regel 49): Der Canyon im Süden (Reihen 19–29) ist eine flache rote Fläche hinter einer einzelnen Felskante; zwischen Plateau und Kante liegt ein grüner Grasstreifen (Reihe 18) mitten in der Wüste. Man sieht keine Tiefe. Vorschlag: Kante mit `wand: felsRot` über zwei bis drei Reihen, unten dunkler Canyonboden (`felsbodenRot`) mit Fluss oder Schatten, Grasstreifen in Sand ändern.
- A/B/C (Ortsdokument): Das Geländer an der Kante (CR2), die Felsnase mit Bank (CR4) und die Kletterwand als echte Wand fehlen; die Kletterwand ist ein kleines Felsstück auf der Kante (A um (47, 13)). Vorschlag: Kletterwand als hohe Felswand nördlich des Wegs mit Seilen, Geländer (Zaun) entlang der Kante.
- A/B/C: Der Übergang Wald → Wüste ist eine schnurgerade senkrechte Linie (A Spalte 40, B Spalte 20, C Spalte 60). Vorschlag: gestufter Übergang mit einzelnen Kiefern im Sand und Sträuchern im Gras.

### wegPinewoodGhost.staubstrasse

- A/C (Stilbruch): Der liegengebliebene Wagen ist ein moderner blauer Sportwagen (A um (37, 3), C um (33, 3) und (79, 21)); auf einer Staubstraße zur Geisterstadt passt ein alter Pick-up oder Planwagen. Vorschlag: anderes Fahrzeug, schräg und mit Staub.
- A/B/C: Die Zaunstücke (A um (16, 3), (47, 15), (73, 3)) stehen einzeln ohne Pfosten oder Endstücke in der Landschaft (Regel 35). Vorschlag: Endpfosten an beiden Seiten, ein Stück schief oder umgefallen für „verlassen“.
- C: Der Boden ist eine gleichmäßige grüne Punktfläche (Gras auf Sand), die wie ein Muster wirkt; die Staubstraße liest sich nicht mehr als Wüste. Vorschlag: `sand` oder `sandRot` wie in A/B, Grasbüschel nur einzeln.
- B (leere Fläche): kaum Kakteen, nur Steine und Masten; Vorschlag: einige Kakteen, ein verlassenes Gehöft oder Wassertank als Ziel für das Auge.

## niedrig-1: Ghost Town, Saloon, Siedlung, Kürbishof (Zweig abenteuer-aufgabenzuordnung, a8e03b1b)

### ghostTown.aussen

- A/B/C (Randspur): Front Street und die Pfade haben grüne Grasränder, obwohl ringsum Wüstensand liegt (z. B. A entlang Reihe 24 und an den Stichwegen um (7, 24–33), (45, 24–27)). Der Sandboden selbst ist ein gleichmäßiges Muster aus grünen Büscheln. Vorschlag: Grundboden `sand`/`sandRot` statt Gras mit Punkten, damit die Wegränder Sand zeigen.
- A/B/C (Regel 49, Ortsdokument): Die Bruchkante im Norden ist eine schmale graue Mauerlinie (Reihen 1–2) statt einer ansteigenden roten Felswand (Reihen 0–4); der Stollen sitzt darin wie ein Tor in einer Mauer. Vorschlag: `wand: felsRot` über drei Reihen, Geröll davor, Stollen in der Felswand.
- A/B/C: Der Hügel mit Bank (G7, um (3, 34)) ist flach und nur durch die Bank zu erkennen. Vorschlag: kleine Stufe mit `wand: damm` oder Felsen ringsum.
- A/B/C: `gt7GrabOhneName` wirkt angeschnitten (Kartenbild); das wichtigste Grab der Geschichte (Szene 98) sollte ganz zu sehen sein. Vorschlag: anderes Grabbild oder eigenes bestellen, deutlich anders als die übrigen.
- B (Ortsdokument): Schmiede, Prüfamt und Wasserturm fehlen, die Straße ist auf großer Länge leer (um 14–22 / 8–20 und 36–51 / 23–38). Vorschlag: wenigstens Prüfamt mit Waage (G4) und Wasserturm, oder die leeren Flächen mit Ruinen und Wagenresten füllen.
- C: gut gefüllt (Windrad, Fässer, Planwagen, Friedhof mit Särgen). Die zwei offenen Särge im Friedhof (um (38, 31), (36, 35)) wirken für ein Kinderspiel grob; Vorschlag: Holzkreuze statt Särge.

### ghostTown.saloon

- A/B/C (Regel 40): Die Holztheke (`theke_holz_laengs_8`, A um (2, 4), B um (10, 4), C um (2, 5)) hat keine Barhocker; ein Saloon ohne Hocker liest sich wie ein Laden. Vorschlag: drei bis vier Hocker direkt vor der Front (`vorn`, Versatz −9).
- A/B/C (Stilbruch): Hinter der Theke stehen Badregale mit Quietscheentchen (Bathroom 84, A um (2, 1) und (6, 1)). Vorschlag: Flaschen- oder Weinregal aus Holz (Küchen- oder Kellerset), Spiegel hinter der Bar. (Dasselbe Badregal steht auch in meinem Gasthaus Lockport als `ld5Flaschenregal`; ich tausche es dort selbst.)
- A/B/C: Die Tür in der Südwand ist eine normale Holztür; der Ortsplan nennt eine Schwingtür. Vorschlag: Schwingtür als eigenes Bild bestellen (`tuer_sued_schwing.png`, 16 × 16).
- B: Fässer stehen einzeln mitten im Raum (um (5, 5), (12, 10)); Vorschlag: an die Wand oder zur Theke.

### erinnerungSiedlung.huette (1866)

- A/B/C (Stilbruch, Zeit): Der Ofen ist ein moderner Küchenherd mit grüner Platte und Edelstahlfront (A um (16, 1)); die Laterne ist eine rote Camping-Laterne (A um (18, 6)); das Fenster hat moderne Rahmen. Für 1866 passen ein gusseiserner Holzofen, eine Petroleumlampe und ein Holzfenster mit Sprossen. Vorschlag: Bilder bestellen oder aus dem Katalog „Western“/„Halloween“ suchen.
- A/B/C: Das Bett mit blauer Decke wirkt wie ein heutiges Bett; die Pritsche aus dem Ortsplan wäre ein einfaches Holzgestell mit Wolldecke.
- B: Die Kiste mit Werkzeug liegt halb in der Nordwand (um (16, 2)); Vorschlag: eine Reihe tiefer.

### kuerbishof.hof

- A/B/C (Ortsdokument, unlesbar): Der „Maisirrgarten“ (K1) ist ein normales Maisfeld in geraden Reihen ohne Gänge; Clovers Irrgarten ist nicht zu erkennen. Vorschlag: Gänge aus Erde im Mais (zwei Felder breit, mit Sackgassen), Eingang mit Schild.
- A/B/C (Wege ins Nichts): Der Querweg in Reihen 25–26 läuft von Rand zu Rand (Spalten 0 und 47) ohne Übergang. Vorschlag: an beiden Enden in den Hofplatz oder an einem Zaun/Tor enden lassen.
- A/B/C (Ortsdokument): Der Hofplatz (K4, Reihen 20–25) ist Gras mit einzelnen Stichwegen statt eines Erdplatzes; Tränke und Heuballen stehen verstreut. Vorschlag: Hofplatz als Erdfläche zwischen Haus, Scheune und Laden.
- A/B/C (Türen ohne Weg): Die Scheune (A um (27, 9), C um (28, 9)) hat keinen Weg zum Tor; Vorschlag: Erdzufahrt zum Scheunentor.
- B: südliche Wiese (Reihen 27–33) fast leer; Vorschlag: Apfelbäume und Zaun wie in A/C.

## mittel-1: Capital (Zweig claude/schach-abenteuer-mittel-1-cl431d, b051e8de)

### wegGhostCapital.seeufer

- A/B/C (Ortsdokument): Der Sandstrand (Reihen 9–11) ist Erde mit grünen Punkten und liest sich als Feldweg, nicht als Strand. Vorschlag: Boden `sand` für den Strand.
- B (Stilbruch, Jahreszeit): Im Wald stehen viele orange Herbstbäume; Akt 4 spielt im Sommer. Vorschlag: grüne Laubbäume oder Kiefern.
- C (Stilbruch): Die ganze Südhälfte (Reihen 12–29) ist Erde mit Punkten; der Kiefernwald steht auf nacktem Boden. Vorschlag: Gras oder Waldboden, Erde nur für den Weg.
- A/B/C (Regel 29, S12): Der Absperrbock „Gesperrt“ des Wachmanns steht neben dem Weg (A um (2, 14)), nicht auf ihm; vor `fernpartieGespielt` sieht man keine Sperre. Vorschlag: zwei Absperrböcke quer über den Weg mit dem Wachmann daneben (Runde 6 schiebt sie zur Seite).
- A/B/C: Der Weg knickt nur rechtwinklig; auf 150 Kacheln wirkt das kantig. Vorschlag: einzelne diagonale Stufen.
- A: Der Wald im Süden besteht aus gleich großen Kiefern in lockeren Reihen; Picknickplatz und Felsen aus dem Ortsdokument sind kaum zu sehen. Vorschlag: Lichtung mit Picknicktisch und Felsgruppe.

### wegGhostCapital.leuchtturm

- A/B/C (Maßstab): Das Wärterhaus von Abe Lindgren ist ein winziges Spielzeughaus (svHaus, 4 × 4) neben dem 16 Kacheln hohen Leuchtturm (A um (61, 4), B um (84, 5), C um (27, 5)). Vorschlag: Haus in Normalgröße (z. B. `mf7HausFlach` oder ein Fischerhaus), Tür zum Weg.
- A/B/C (Türen ohne Weg): Das Wärterhaus hat keinen Weg; Vorschlag: Stich vom Uferweg zur Tür.
- A/B/C: Die Landzunge ist ein scharf rechteckiger Grasblock im Wasser (A 48–65 / 1–6); Vorschlag: gestufte Ränder, Felsen und Brandung (Steine im Wasser).
- B (Jahreszeit), C (Erdboden): wie beim Seeufer, Herbstbäume in B und nackter Erdboden in C.
- A/B/C: Fund `fundLinse` am Turmfuß ist nicht als Ding zu sehen; Vorschlag: kleines Glitzerobjekt oder Kiste am Fuß.

### capitalArena.aussen

- A/B (Regel 37): B ist A mit anderem Platzbelag, Hecken und Kiefern; Arena, Treppe, Fahnen und Brunnen stehen an denselben Stellen. Vorschlag: in B einen anderen Vorplatz (Rasenparterre mit Wegekreuz, Wasserbecken oder Säulengang) und andere Fahrzeuge/Stände.
- A/C (Jahreszeit): orange Herbstbäume im Park (A um (3, 17), (36, 11), (36, 18); C um (35, 2)); Akt 4 ist Sommer. Vorschlag: grüne Laubbäume.
- C: Das Wasserbecken im Park (um 28–41 / 6–17) hat eine Steinkante, aber keinen Zugang und keinen Zweck; der Pflasterweg daneben endet oben im Gras (um (26, 3)). Vorschlag: Weg rund um das Becken mit Bänken, oberes Wegende an eine Bank oder ein Denkmal.
- A/B/C: Der Park nördlich des Vorplatzes ist eine fast leere Rasenfläche mit einzelnen Bäumen; Vorschlag: Wege, Blumenbeete, Statisten (Fans), damit die Hauptstadt belebt wirkt.

### capitalArena.halle

- A/B/C: gut lesbar (Banner „Landesmeisterschaft“, Bühne mit Finaltisch, Tribünen, Presse, Fanshop, Turniertafel).
- A: Die Turniertafel (Holzbrett mit Dach, um (1, 7)) sieht aus wie ein Gartenhäuschen; eine Turnierwand mit Paarungen liest sich besser. Vorschlag: Pinnwand oder Tafel an der Westwand (`an_wand`).
- B: Bühne in der Raummitte, Tribünen davor an der Nordwand verdecken den Blick der Zuschauer auf die Bühne nicht, aber die Vorrundenbretter stehen hinter der Bühne Richtung Tür; Vorschlag: Reihenfolge Tribüne – Bühne – Vorrunde – Eingang wie in A/C.

## Erledigt: mittel-1 (10.11.2026)

- **Jahreszeit:** Der orange Baum (Tree_20) in gc7Birke und ca7Baum ist durch einen grünen Laubbaum
  ersetzt (Seeufer B, Leuchtturm B, Arena A/C).
- **Wärterhaus:** jetzt ein Wohnhaus in Normalgröße mit Erdweg vom Uferweg zur Tür (A, C; in B läuft
  der Uferweg direkt an der Tür vorbei); Felsen an der Landzunge; die alte Linse liegt in einer Kiste am
  Turmfuß (sichtbar).
- **Seeufer A:** Felsen an der Lichtung mit dem Picknicktisch.
- **Arena B:** Bau nach rechts, großer Kiefernpark links, Steinplatz mit Statuenbrunnen; Varianten-Prüfung
  ohne Befund.
- **Halle A:** Turniertafel als Tafel an der Nordwand.
- **Offen, Rückfrage an den Haupt-Chat:** Der Boden `sand` (Bogen gelaende, Feld 4, 31) ist selbst die
  Kachel mit den grünen Punkten; Seeufer und Leuchtturm C nutzen ihn bereits. Ein glatter Strandsand
  braucht eine andere Kachel in `materialien.json`. Absperrböcke quer über den Weg würden den Weg sperren
  (Erreichbarkeitstest); die Sperre S12 sitzt in Ghost Town, deshalb steht der Bock neben dem Weg.
  Rechtwinklige Wegknicke: bleiben vorerst (Kartenbauer kennt keine diagonalen Wegstücke).
