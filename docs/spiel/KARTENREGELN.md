# Regelwerk für Karten des Schach-Abenteuers

Stand: 9.11.2026. Abgeleitet aus allen Rückmeldungen des Autors zu den Kartenrunden 1 bis 3 (Wortlaut
in `docs/spiel/ENTSCHEIDUNGEN.md`). Gilt für jede Karte; der Kartenbauer prüft, was sich prüfen lässt
(markiert mit **[auto]**), den Rest die Bildprüfung. Ergänzungen kommen hierher, nicht in Einzelaufträge.

## 1. Grundsatz

Jede Karte muss als echter Ort glaubwürdig sein. Vor dem Bau steht das **Ortsprofil**
(`inhalte/abenteuer/ortsprofile.json`: Zweck, Epoche, Wohlstand, Stil, erlaubter Zustand, Nachbarschaft)
und eine ausführliche Szenenbeschreibung. Nur Bilder aus dem **Katalog** (`register/katalog.json` im
privaten Repository) werden verbaut; ihre Angaben steuern die Regeln.

## 2. Räume, Wände, Türen

1. Jeder Raum hat eine Funktion (Wohnen, Küche, Bad, Schlafen, Büro, Schule, Lager …). Möbel einer
   anderen Funktion gehören nicht hinein (keine Küchenzeile im Wohnzimmer, außer das Ortsprofil sagt
   „Einzimmerwohnung“). **[auto]** über `raumfunktion` im Katalog.
2. Jede Öffnung in einer Wand ist entweder eine Tür (Bild) oder ein bewusster Durchgang (Bogen,
   Türrahmen); keine nackten Lücken. Ausgangstüren liegen auf der Wand, durch die man den Raum verlässt.
3. Nichts steht in einer Wand: Möbel stehen mit dem Fuß auf Boden vor der Wand. **[auto]**
4. Treppen führen in die richtige Richtung: vom Dachboden nach unten, vom Erdgeschoss nach oben;
   der Antritt ist frei. **[auto]** über `treppe` (auf/ab) im Katalog.
5. Fenster an Außenwänden; Gardinen hängen **vor** dem Fenster (gezeichnet darüber). **[auto]** über
   `befestigung: ueber` und Reihenfolge.
6. Wandschmuck überlappt nichts (Pinnwand nicht hinter Automat oder Maschine). **[auto]**

## 3. Möbel: Zustand, Stil, Wiederholung

1. Zustand passt zum Ort: kaputt oder verwittert nur, wo das Ortsprofil es erlaubt (Dachboden mit
   Gerümpel, Ghost Town, Turnhalle nach dem Sturm). **[auto]**
2. Ein Stil je Ort, passend zu Epoche und Wohlstand (Villa gehoben, Reihenhaus einfach). **[auto]**
3. Gleichartiges ist gleich groß und gleich gestaltet (alle Waschmaschinen gleich, Stuhlpaare gleich).
4. Blickfänge (Globus, Pokal, Ritterrüstung) sparsam und nur, wo sie hingehören; nicht jedes Bild
   überall. **[auto]** über `einzigartig` im Katalog: höchstens einmal je Ort.
5. Lieber weniger, dafür stimmig; aber nicht karg: bewohnte Räume haben Kleinkram und Spuren von Leben.

## 4. Beziehungen und Ausrichtung

1. Stühle stehen an Tischen, Sitzfläche zum Tisch; gleiche Stühle um einen Tisch. **[auto]**
2. Fernseher stehen auf einem Lowboard oder Fernsehtisch an der Wand (oder hängen an der Wand,
   dann ohne Möbel davor), nicht neben der Eingangstür; davor mit Abstand Sitzplätze mit Blick zu ihm.
   **[auto]** teilweise.
3. Was „auf“ etwas steht, steht ganz auf dessen Ablagefläche (Globus auf Pult, Pokal auf Anrichte,
   Brett auf Tisch), nie daneben, darüber oder schwebend. **[auto]** über `ablage` im Katalog.
4. Pflanzen und Stehlampen in Ecken, an Wänden, an Durchgängen oder direkt neben passenden Möbeln
   (Lampe neben Sessel oder Schreibtisch). **[auto]**
5. Möbel mit Vorderseite (Schubladen, Türen, Bildschirme, Geräte) zeigen in den Raum, nicht zur
   Wand; Sofas zeigen zu Fernseher oder Couchtisch. **[auto]** über `blick`.
6. Reihen (Waschmaschinen, Spinde, Regale) stehen lückenlos nebeneinander an einer Wand.
7. Nichts verdeckt eine Figur oder einen Auslöser. **[auto]**

## 5. Außen: Straßen, Wege, Grundstücke

1. Straßen und Wege laufen bis zum Kartenrand oder zu einem Ziel (Tür, Platz, Kreuzung), nie ins Leere.
   **[auto]**
2. Gehwege liegen beidseitig an Straßen oder dort, wo man läuft, mit Kanten auf beiden Seiten.
3. Jedes Haus hat einen Weg von der Tür zur Straße oder zum Gehweg; Wohnhäuser haben Vorgarten und
   Zaun oder Hecke um das Grundstück, je nach Ortsprofil. Häuser stehen an der Straße.
4. Nachbarschaft nach Ortsprofil: Wohnhäuser neben Wohnhäusern; Industrie oder Gewerbe nur, wo die
   Geschichte es sagt. Villa mit großem Garten.
5. Außen und innen passen zusammen: Größe, Stil und Wohlstand des Hauses draußen entsprechen den
   Innenkarten. Türbild passt zum Gebäude.
6. Hindernisse auf Wegen nur, wenn die Geschichte es will (Baumstümpfe stehen neben, nicht auf dem Weg).
7. Straßenmöbel: Laternen direkt an Weg oder Straße; Bänke am Weg, zum Weg gewandt (oder vom Weg weg
   zu einer Aussicht, dann direkt am Weg und mit etwas zu sehen); Bushaltestelle zur Straße;
   Blumenkästen parallel zum Weg und nie auf dem Gehweg; Mülleimer und Kästen nur mit erkennbarem
   Zweck (Stromkasten an der Ecke, Mülltonne am Haus).
8. Schilder: Wegweiser mit mehreren Richtungen nur an Kreuzungen; Schilder tragen erkennbaren,
   passenden Inhalt (keine Autobahntafel „SALE“ in der Kleinstadt); Text zum Betrachter oder zum Weg.

## 6. Natur und Wasser

1. Gras und Böden mit Abwechslung, keine sichtbare Wiederholung; keine unbegründeten Streifen oder
   Flächen ohne Textur. **[auto]** Varianten.
2. Bäume in Wohngebieten gepflanzt (Alleen in gleichem Abstand, Vorgärten, symmetrisch); in Wald und
   Wildnis natürlich in Gruppen. Flora abwechslungsreich (Bäume, Büsche, Blumen, Gräser, Steine).
3. Felder reichen bis zum Rand (wirken größer); Gerät am Feldrand oder an der Einfahrt, nicht mitten im
   Feld.
4. Gewässer: große Gewässer (Fluss, See, Meer) reichen bis zum Kartenrand; nur Teiche sind rundum
   geschlossen. Ufer mit Rand. **[auto]** Ränder.
5. Stege beginnen am Ufer und ragen ins Wasser; Brücken verbinden zwei Ufer.
6. Pflanzen und Gegenstände müssen als solche erkennbar sein (keine „grünen Säulen“).

## 7. Bilder (Katalog)

1. Nur ganze Gegenstände; Bauteile nur zusammen mit ihren Gegenstücken. **[auto]**
2. Schatten: die Fassung mit halbdurchsichtigem Schatten (`*_Black_Shadow_*`), nie den grauen
   Festschatten, der nur auf einem Boden passt. **[auto]**
3. Jedes Bild ist im Katalog beschrieben, bevor es verbaut wird.

## 9. Vorbild: Szenen aus dem Netz

Stand: 9.11.2026 (mittel-2). Abgeleitet aus den Beispielszenen, die LimeZu selbst mit seinen Paketen
zusammengesetzt hat (Verkaufsseiten auf itch.io). Spiele mit nachweislich verwendeter LimeZu-Grafik
fanden sich kaum: ein Steam-Titel mit Inhalten nur für Erwachsene (nicht verwendet), ein Spiel ohne
Nennung der Grafik (nicht verwendet). Die Szenen des Herstellers sind deshalb das Vorbild. Es werden
nur Regeln übernommen, keine Bilder; nichts davon liegt im Repository.

### 9.1 Quellen

| Kürzel | Seite                                                          | Bild (Link)                                                                                                | Inhalt                                                    |
| ------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| E1     | [Modern Exteriors](https://limezu.itch.io/modernexteriors)     | [Haus mit Garten](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi84ODI2NDUxLmdpZg==/original/srsSOL.gif)          | Einfamilienhaus, Zaun, Gehweg, Bushaltestelle             |
| E2     | Modern Exteriors                                               | [Straße mit Zebrastreifen](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi84NDQ0NjcwLmdpZg==/original/2NrZRf.gif) | Kreuzungsbereich, Bordstein, Ampel, Baumscheiben, Bänke   |
| E3     | Modern Exteriors                                               | [Wohnblocks und Parkplatz](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi83NzMxMTU1LmdpZg==/original/ZK4jma.gif) | Plattenplatz, Hauseingänge, Hecken mit Pollern, Parkreihe |
| E4     | Modern Exteriors                                               | [Spielplatz im Block](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi83NzMxMTU0LmdpZg==/original/1Wl0qu.gif)      | Park als Rasenfeld mit Baumreihe, Laternen                |
| E5     | Modern Exteriors                                               | [Einkaufszentrum](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi84NzA0NjM5LmdpZg==/original/NhCQ8G.gif)          | Vorplatz, Pflanzkübel, Einfahrt Tiefgarage, Ampel         |
| E6     | Modern Exteriors                                               | [Flohmarkt am Platz](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi83ODA1MzY0LmdpZg==/original/i4NAk%2F.gif)     | Pflasterplatz, Brunnen, Bänke, Laternen                   |
| E7     | Modern Exteriors                                               | [Kreuzung mit Ampel](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi83NzMxMTU2LmdpZg==/original/%2Bg7p3a.gif)     | Haltelinie, Zebrastreifen, Ampelmast an der Ecke          |
| E8     | Modern Exteriors                                               | [Steg im See](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi85NjMxNzg3LmdpZg==/original/RpT5UX.gif)              | Holzsteg, Pfähle, Boot                                    |
| E9     | Modern Exteriors                                               | [Wohnwagen am Waldrand](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi85OTEyMzE0LmdpZg==/original/%2B73hqN.gif)  | Lichtung, Pfade, Picknicktisch, Teich am Rand             |
| E10    | Modern Exteriors                                               | [Basketballplatz](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi8xMDc5NzYyNy5naWY=/original/9jJhcs.gif)          | Sportplatz im Wald, Bänke, Flutlicht                      |
| F1     | [Modern Farm](https://limezu.itch.io/modernfarm)               | [Markt und Scheune](https://img.itch.zone/aW1hZ2UvMzM1NDAxNC8zMTY2ODQxNS5naWY=/original/pHbX0m.gif)        | Feldweg, Marktstände, Weide mit Zaun, Hundehütte          |
| F2     | Modern Farm                                                    | [Hof mit Gemüsegarten](https://img.itch.zone/aW1hZ2UvMzM1NDAxNC8zMTY2ODQxNC5naWY=/original/zutQCy.gif)     | Beete im Zaun, Hühnerstall, Traktor, Baumgruppen          |
| F3     | Modern Farm                                                    | [Bauernhaus im Wald](https://img.itch.zone/aW1hZ2UvMzM1NDAxNC8zMTY2ODQxMi5naWY=/original/D1nuDA.gif)       | Hofplatz, Brunnen, eingezäunte Felder                     |
| F4     | Modern Farm                                                    | [Feld, Palmen, Strand](https://img.itch.zone/aW1hZ2UvMzM1NDAxNC8zMTY2ODQxMS5naWY=/original/mgaZs5.gif)     | Feld mit Eckpfosten, Plantage, Strand und Meer            |
| F5     | Modern Farm                                                    | [Käserei und Silo](https://img.itch.zone/aW1hZ2UvMzM1NDAxNC8zMTY2ODQxMy5naWY=/original/fHV08S.gif)         | Teich mit Sandufer, Pferche                               |
| S1     | [Serene Village](https://limezu.itch.io/serenevillagerevamped) | [Dorf am Wasser](https://img.itch.zone/aW1nLzQ5ODA4NTAuZ2lm/original/edO3Z6.gif)                           | Häuser mit Zaun, Dorfstraße, Brücke, Steg, Strand, Teiche |

### 9.2 Straßen, Gehwege, Bordsteine (Stadt)

1. Eine Fahrbahn hat auf jeder Seite eine durchgehende Bordsteinkante, dahinter den Gehweg; die
   Kante läuft ohne Lücke bis zum Kartenrand oder bis zur Kreuzung. Beispiel: E2, beide Seiten der
   Straße. **[auto]** Kante neben jeder Fahrbahnkachel.
2. Fahrbahnen haben eine Mittellinie (gestrichelt), die an Kreuzungen und Zebrastreifen aussetzt.
   Beispiel: E2, E7.
3. Zebrastreifen liegen quer zur Fahrbahn, verbinden zwei Gehwege und haben an beiden Enden eine
   Ampel oder ein Schild am Bordstein. Beispiel: E2 (Ampel oben und unten), E7.
4. An Kreuzungen biegt der Bordstein um die Ecke; Ampelmasten stehen auf der Ecke des Gehwegs, nicht
   auf der Fahrbahn. Beispiel: E7.
5. Parkplätze liegen als markierte Buchten an der Fahrbahn, mit „P“ und Trennstrichen; der Gehweg
   bleibt davor frei. Beispiel: E3 (Parkreihe), E5.
6. Gehwege sind breiter als ein Feld (meist zwei bis vier), einheitlich gepflastert; Beläge wechseln
   nur an Grundstücks- oder Platzgrenzen. Beispiel: E1 (heller Plattenbelag vor dem Grundstück), E3.

### 9.3 Grundstücke und Häuser

1. Ein Wohngrundstück ist ringsum eingefasst (Zaun, Gitter oder Hecke), mit genau einer Pforte zur
   Straße; die Pforte hat zwei Pfosten und der Weg führt von ihr gerade zur Haustür. Beispiel: E1
   (Gitterzaun, Pforte unten links), S1 (Holzzaun mit Lücke vor der Tür).
2. Neben der Pforte, außerhalb des Zauns: Briefkasten; am Zaun entlang: Mülltonnen; beides auf der
   Grundstücksseite des Gehwegs, nie mitten darauf. Beispiel: E1 (Briefkasten links, Tonnen am Zaun),
   S1 (roter Briefkasten am Weg).
3. Links und rechts der Haustür stehen Blumenkästen oder Kübel, symmetrisch. Beispiel: S1 (alle
   Häuser), E3 (Bäume in Kübeln links und rechts der Eingänge).
4. In der Stadt öffnen Wohnblocks direkt auf den Gehweg oder Platz, mit Treppenstufen vor der Tür und
   je einer Laterne oder einem Kübel daneben; zwischen Blocks steht ein niedriges Gitter.
   Beispiel: E3.
5. Ein Garten ist belebt und gegliedert: Weg, Rasen, Beete, Spielzeug oder Gartenmöbel in Gruppen,
   nichts frei schwebend auf dem Weg. Beispiel: E1 (Sandkasten, Wippe, Trampolin je auf Rasen).
6. Ein Bauernhaus hat einen großen Hofplatz aus Erde vor Haus und Scheune; Fahrzeuge stehen am Rand
   des Hofplatzes, nahe Haus oder Scheune. Beispiel: F3 (Traktor neben dem Haus), F2.

### 9.4 Straßenmöbel und Schilder

1. Laternen stehen am äußeren Rand des Gehwegs (zur Fahrbahn) oder an Platzecken, in gleichem
   Abstand; nie mitten auf dem Weg. Beispiel: E1 (zwei Laternen an den Ecken), E6 (Laternen ringsum).
2. Straßenbäume stehen in Baumscheiben oder Kübeln am Bordstein, in gleichem Abstand. Beispiel: E2,
   E5 (Kübel links und rechts des Eingangs).
3. Bänke stehen neben Baumscheiben, Hecken oder einem Brunnen, mit der Sitzfläche zum Weg oder zum
   Brunnen; je zwei gegenüber, wenn es einen Mittelpunkt gibt. Beispiel: E2, E6 (Bänke um den Brunnen).
4. Die Bushaltestelle (Wartehäuschen) steht am Bordstein, mit dem Haltestellenschild daneben; die
   offene Seite zeigt zum Gehweg. Beispiel: E1.
5. Hydranten, Ampeln und Verkehrsschilder stehen auf dem Gehweg am Bordstein. Beispiel: E2.
6. Hecken mit Pollern trennen Gehweg und Parkplatz in einer geraden Reihe. Beispiel: E3, E4.
7. Wegweiser stehen dort, wo sich Wege teilen oder ein Weg beginnt (Brücke, Steg, Pforte), nicht
   frei in der Wiese. Beispiel: S1 (Schild an Brücke und Steg).

### 9.5 Plätze und Parks

1. Ein Platz hat einen Mittelpunkt (Brunnen, Denkmal) mit Bänken drumherum; Laternen säumen den
   Rand. Beispiel: E6.
2. Ein Stadtpark ist ein klar begrenztes Rasenfeld mit Kante; Bäume stehen als Reihe an seinem Rand,
   Spielgeräte innen mit Abstand zur Reihe. Beispiel: E4.
3. Sport- und Spielplätze haben einen eigenen Belag mit Linien; Bänke oder Tribünen stehen außen an
   den Längsseiten. Beispiel: E10.

### 9.6 Dorf, Feldwege und Höfe

1. Erdwege im Dorf und auf dem Hof haben unregelmäßige, weiche Ränder mit Grasbüscheln; sie werden
   vor Türen, Ständen und Toren breiter (Vorplatz). Stadtstraßen sind dagegen gerade. Beispiel: F1
   (Weg weitet sich vor Scheunentor und Marktständen), S1 (Dorfstraße gerade, Abzweige zu den Häusern).
2. Jeder Weg endet an einem Ziel (Tür, Tor, Steg, Brücke, Platz) oder am Kartenrand. Beispiel: S1
   (Wege enden an Pforten, Treppe in der Steinmauer, Brücke). Bestätigt 5.1.
3. Wo ein Weg eine Mauer oder einen Hang kreuzt, liegt eine Treppe; die Mauer läuft sonst geschlossen.
   Beispiel: S1 (Treppen in der Steinmauer oben).
4. Felder sind Rechtecke aus Ackerboden in einem eigenen Zaun mit Eckpfosten; mehrere Beete sind
   durch Grasstreifen getrennt; Vogelscheuche oder Sprenger stehen im Beet. Beispiel: F2, F3, F4.
5. Weiden und Pferche haben einen Holzzaun mit Tor; Tränke und Futtertrog stehen innen am Zaun.
   Beispiel: F1 (Kühe, Trog am unteren Zaun).
6. Marktstände stehen in einer Reihe mit der Front zum Weg; Kisten und Fässer gruppieren sich neben
   den Ständen. Beispiel: F1.
7. Kleine Dinge des Hofs (Holzstapel, Leiter am Baum, Brunnen, Hundehütte) stehen am Haus oder an
   Bäumen, nicht frei auf dem Hofplatz. Beispiel: F3 (Brunnen neben dem Haus, Leiter am Baum).

### 9.7 Wasser, Ufer, Stege, Brücken, Strand

1. Ufer haben immer eine Kante (Grasabbruch oder Sandstreifen) zwischen Land und Wasser; das Wasser
   reicht bei See und Meer bis zum Kartenrand. Beispiel: S1, F4. Bestätigt 6.4.
2. Teiche sind rundum geschlossen, mit hellem Rand (Sand oder Stein), und stehen in Gärten oder auf
   Weiden. Beispiel: S1 (zwei Teiche), F5.
3. Ein Strand ist ein Sandstreifen zwischen Gras und Wasser; seine Wasserkante ist gewellt, die
   Graskante gerade oder als kleine Stufe. Beispiel: F4, S1 (Badebucht).
4. Stege beginnen am Ufer, ragen gerade ins Wasser und stehen auf sichtbaren Pfählen; Boote liegen
   längs am Steg. Beispiel: E8, S1 (langer Steg zur Insel). Bestätigt 6.5.
5. Brücken liegen quer zur Wasserrinne, ihre Enden liegen auf beiden Ufern auf; die Bretter laufen
   quer zur Gehrichtung. Beispiel: S1 (Holzbrücke über den Kanal).
6. Steine, Felsen und Schilf stehen am Ufer und auf kleinen Inseln, nicht im offenen Wasser.
   Beispiel: S1.

### 9.8 Bäume und Flora

1. Wald und Waldrand sind dicht: Bäume überlappen in mehreren Reihen und schließen den Kartenrand ab.
   Beispiel: F3 (Nadelwald hinter dem Haus), S1 (Wald links), E9.
2. Zwischen Bereichen eines Hofs stehen Baumgruppen aus drei bis sechs Bäumen als Trenner, nicht
   einzelne Bäume in gleichem Abstand. Beispiel: F2 (Gruppe zwischen Scheune und Stall).
3. In der Stadt dagegen gepflanzt und geordnet: Kegelbäume als Reihe, Bäume in Kübeln, symmetrisch
   zu Eingängen. Beispiel: E3, E4. Bestätigt 6.2.
4. Obstbäume stehen beim Haus oder als Obstgarten in Reihen, mit Kiste oder Leiter. Beispiel: F2,
   F1 (Orangenbäume mit Kisten).
5. Kleinflora (Blumen, Pilze, Steine, Baumstümpfe) in Grüppchen von zwei bis fünf am Rand von Wegen,
   an Zäunen und unter Bäumen; nie auf dem Weg. Beispiel: S1, F3, E9.

### 9.9 Dichte

1. Szenen sind dicht belegt: Auf etwa jedem zweiten bis dritten Feld außerhalb der Wege steht etwas
   (Pflanze, Möbel, Gegenstand, Figur); freie Flächen sind Wege, Plätze, Rasen eines Parks oder
   Hofplatz. Beispiel: E1, F1, S1.
2. Freie Flächen haben trotzdem Belag mit Abwechslung (Grasbüschel, Blumen, Steinchen). Beispiel: S1,
   E9. Bestätigt 6.1.

### 9.10 Widersprüche zu bestehenden Regeln (nicht geändert)

1. **5.7 „Blumenkästen nie auf dem Gehweg“:** In E1 stehen Blumenkästen auf dem Gehweg direkt am
   Grundstückszaun, in E5 Pflanzkübel in Reihen auf dem Vorplatz. Beides lässt den Gehweg frei, weil
   sie an der Grundstücksgrenze bzw. auf einem breiten Platz stehen. Vorschlag zur Klärung: „nie
   mitten auf dem Gehweg; an Zaun oder Hauswand oder auf breiten Plätzen erlaubt.“
2. **5.3 „Jedes Haus hat einen Weg von der Tür zur Straße“:** Wohnblocks in E3 haben keinen eigenen
   Weg; die Tür öffnet direkt auf den gepflasterten Platz. Das passt zur Regel, wenn der Platz als
   Gehweg gilt.
3. **5.2 „Gehwege beidseitig an Straßen“:** In F1 und S1 (Dorf, Hof) haben Erdwege keine Gehwege und
   keine Kanten; die Regel gilt nur für Stadtstraßen.
