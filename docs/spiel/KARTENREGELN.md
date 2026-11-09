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

## 8. Vorbild: Beispielräume des Zeichners

Abgeleitet aus den fertig eingerichteten Räumen, die LimeZu den Paketen beilegt (privates Repository,
`modern-interiors/6_Home_Designs/*/16x16/*preview*.png` mit `layer_*`: Generic Home, Wohnanlage
(Condominium) 1 und 2, japanisches Haus, Turnhalle 1 und 2, Eisdiele, TV-Studio, Schießstand, Museum
Eingang und Räume 1–4) und den zusammengesetzten Gebäuden aus Modern Exteriors (`*Example*`: Palast,
Bürohaus, Condo 6, Eisenwarenladen). Ganze Straßenszenen liegen den Außenpaketen nicht bei; für außen
gibt es deshalb nur Regeln zu Gebäuden. Kacheln = 16 Pixel; „Reihe“ zählt von oben.

### 8.1 Ebenen und Wände

1. **Zwei Ebenen:** Boden und Wände liegen allein auf Ebene 1; alles andere, auch Teppiche, Türen,
   Fenster und Wandschmuck, auf Ebene 2 (Eisdiele und TV-Studio haben eine dritte für Dinge auf
   Tresen und Licht). *Generic Home:* `Layer_1` zeigt nur Dielen, Fliesen und Wände.
2. **Nordwand zwei Reihen Wandfläche** mit schmaler heller Kante oben; Seitenwände nur als schmale
   Kante mit Schattenkeil zum Boden. *Generic Home, Wohnanlage, Turnhalle.* (Passt zu 2. und zum
   Kartenbauer.)
3. **Innenwände zwischen zwei Räumen** bekommen auf der Südseite wieder zwei Reihen Wandfläche; der
   Raum darunter hat seine eigene „Nordwand“. *Generic Home:* der Eingangsraum unten hat eine eigene
   Wandfläche mit zwei Schränken davor; *Museum Raum 2:* jede Abteilung beginnt mit einer Wand.
4. **Durchgänge zwischen Räumen sind offene Lücken** von 1 bis 3 Kacheln Breite, durch die der
   Boden weiterläuft, ohne Türbild. Türbilder nur dort, wo eine Wohnung, ein Zimmer oder das Haus
   endet. *Generic Home:* Flur links und rechts und der Gang nach unten offen, eine Tür nur oben;
   *Wohnanlage 2:* vier Wohnungstüren nebeneinander. **Widerspruch zu 2.2** („keine nackten Lücken“):
   Beim Zeichner sind offene Durchgänge innerhalb einer Wohnung üblich; 2.2 bleibt unverändert.
5. **Türen** sitzen in der Wandfläche, ihre Unterkante auf der Bodenlinie; direkt davor auf der ersten
   Bodenreihe liegt eine Fußmatte, so breit wie die Tür. *Wohnanlage 2:* jede der vier Türen mit
   eigener Matte; *Turnhalle 2:* Matte vor dem Durchgang oben rechts. Ausgänge in der Südwand sind eine
   Lücke von 2–4 Kacheln, oft mit Matte davor oder dahinter (*Eisdiele*, *Generic Home*).
6. **Fenster** hängen in der Wandfläche, mittig über einem Möbel oder zwischen zwei Möbeln; Gardinen
   oder Rollos so breit wie das Fenster. *Turnhalle:* großes Fenster über der Hantelecke;
   *japanisches Haus:* zwei Schiebefenster je über einer Möbelgruppe; *TV-Studio:* gestreifte Vorhänge
   links und rechts über den Hockern.

### 8.2 Anordnung und Abstände

1. **Möbel an die Wände, Mitte frei.** Große Stücke (Schrank, Kamin, Regal, Theke, Bett) stehen mit
   dem Rücken an einer Wand; die Raummitte bleibt als Lauffläche frei, mindestens 2 Kacheln breit von
   jedem Eingang aus. *Generic Home:* Mitte 6 × 3 Kacheln frei; *Eisdiele:* Gang 3 Kacheln breit von
   der Tür zur Theke; *Museum Raum 3:* Mittelgang 2 Kacheln.
2. **Symmetrie an der Hauptwand:** Das wichtigste Stück steht mittig, gleiche Stücke links und rechts
   davon im gleichen Abstand. *Generic Home:* Kamin mittig, je ein Sessel links und rechts, Abstand 0;
   die beiden Kleiderschränke unten spiegeln sich um die Tür. *Eisdiele:* Speisekarte mittig, je ein
   Eisautomat und ein Herz-Schild links und rechts. *TV-Studio:* Moderationstisch mittig, Lampen,
   Hocker und Vorhänge gespiegelt. *Museum Eingang:* Vitrinen gespiegelt um den Eingang.
3. **Gruppen dicht, Gruppen untereinander mit Luft.** Was zusammengehört, steht ohne Lücke
   (Stühle direkt am Tisch, Sessel direkt neben dem Kamin, Hocker direkt an der Theke); zwischen zwei
   Gruppen liegt mindestens 1 Kachel Boden. *Eisdiele:* Tisch 1 × 2 mit je zwei Stühlen links und
   rechts ohne Abstand, die beiden Gruppen 4 Kacheln auseinander. *Japanisches Haus:* Sitzkissen direkt
   am niedrigen Tisch. *Schießstand:* Hocker eine Reihe vor dem langen Tresen.
4. **Reihen gleicher Geräte** stehen in gleichem Abstand nebeneinander: *Turnhalle:* zwei Laufbänder
   mit 1 Kachel Abstand, drei Boxsäcke in gleichem Abstand an der Nordwand; *Schießstand:* vier
   Bahnen, je Monitor und Scheibe übereinander; *Museum Raum 1:* drei Vitrinen mit je einem Lesepult
   rechts daneben.
5. **Blickrichtung:** Sitzende schauen zur Mitte der Gruppe (Stühle zum Tisch, Publikumsstühle im
   TV-Studio zum Moderationstisch, 3 Reihen davor). Sitzplätze vor einem Blickziel stehen 2–4 Kacheln
   entfernt. *TV-Studio:* Zuschauerstühle 3 Reihen vor dem Tisch; *Generic Home:* Teppich 1 Reihe vor
   dem Kamin, dahinter frei.
6. **Belegung:** Ebene 2 belegt (mit Teppichen und Wandschmuck, gemessen an allen Kacheln des Raums
   einschließlich Wände) bei Wohnräumen 39–54 % (Wohnanlage 39–41 %, Generic Home 46 %, japanisches
   Haus 54 %), bei Läden und Hallen 51–59 % (Eisdiele 58 %, Museum 52–59 %, Turnhalle 57 %), bei
   Studios und Fluren 33–41 % (TV-Studio 38 %, Schießstand 41 %, Museum Raum 1 33 %). Ohne Teppiche und
   Wandschmuck ist etwa ein Drittel der Bodenkacheln mit Möbeln belegt.

### 8.3 Pflanzen, Lampen, Wandschmuck

1. **Pflanzen** stehen an Durchgängen (je eine links und rechts), in Raumecken oder in Lücken
   zwischen Möbeln an der Wand; nie frei im Raum. *Generic Home:* je eine Pflanze an den Fluren links
   und rechts, je eine in den unteren Ecken des Eingangs; *Wohnanlage 2:* Pflanzen zwischen den Türen
   und in den Ecken unten; *japanisches Haus:* zwei Bonsai rechts und links im Eingang. (Passt zu 4.4.)
2. **Lampen:** In Wohnräumen kleine Lampen auf Ablagen (Beistelltisch, Kommode) oder Wandleuchten an
   den Seitenwänden der Flure; Stehlampen kommen in keinem Beispiel vor. *Generic Home:* Lampe mit
   Büchern auf dem Beistelltisch, Wandleuchten in beiden Fluren. *TV-Studio:* Strahler als Reihe in der
   obersten Wandflächenreihe, Scheinwerfer auf Stativen in den Ecken.
3. **Wandschmuck** sitzt ganz in der Wandfläche, mittig über einem Möbel, zwischen zwei Möbeln oder in
   gleichen Abständen; Schilder mit Text gehören zur Funktion des Raums. *Museum Raum 1:* Bilder mit
   Schildchen darunter und Lesetafeln dazwischen; *japanisches Haus:* zwei Rollbilder links und rechts
   vom runden Fenster; *Eisdiele:* Herz-Schilder und Löffel über den Automaten.

### 8.4 Teppiche, Stile, Kleinkram

1. **Teppiche** liegen rechteckig auf dem Raster, unter oder direkt vor einer Gruppe, nie unter
   Schränken an der Wand; sie ragen höchstens 1 Kachel über die Gruppe hinaus. *Generic Home:* 2 × 2 vor
   dem Kamin, ein zweiter neben dem Etagenbett; *japanisches Haus:* Tatami-Matten unter jeder
   Sitzgruppe, je 1 Kachel größer als der Tisch; *Turnhalle:* Gummimatten unter den Gewichtsbänken.
2. **Eine Möbelserie je Raum:** gleiche Farbe und gleiches Material, Paare identisch. *Generic Home:*
   alles Holz in einem Ton, zwei gleiche Schränke, zwei gleiche Sessel; *Eisdiele:* alles rosa-weiß;
   *TV-Studio:* weiß-blau; *Museum:* Vitrinen und Pulte aus derselben Serie. (Passt zu 3.2 und 3.3.)
3. **Kleinkram** liegt auf Ablagen (Bücher und Lampe auf dem Beistelltisch, Vase auf der Kommode,
   Becher auf der Theke), in Gruppen von 2–3 Stück. Am Boden nur, was dort hingehört und höchstens 1–2
   Stück je Wohnraum: *Generic Home:* Hut und Skateboard vor dem Etagenbett (Kinderzimmer);
   *Turnhalle:* Hanteln und Bälle neben den Geräten. **Ergänzung zu Prüfliste 2** („nichts liegt
   unpassend am Boden“): Der Zeichner legt wenige passende Dinge bewusst auf den Boden; die Regel bleibt.

### 8.5 Gebäude außen (Beispiele aus Modern Exteriors)

1. **Eingang mittig in der Fassade**, davor Stufen oder eine Treppe in Türbreite, die bis auf den
   Gehweg reicht. *Palast:* Säulenportal mittig, Treppe 6 Kacheln breit, Laternenpfosten links und
   rechts der Treppe; *Bürohaus „G-Neric Corp“:* Glastür mittig unter dem Firmenschild.
2. **Schild und Name über der Tür**, nicht daneben. *Bürohaus, Eisenwarenladen* (Markise über den
   Schaufenstern).
3. **Bank direkt an der Fassade neben der Tür**, Sitzfläche zum Gehweg. *Condo 6:* Bank zwischen
   Haustür und Garagentor.

### 8.6 Was der Kartenbauer prüfen könnte (Vorschlag für `kartenregeln.py`)

- **Belegung:** Anteil der Bodenkacheln unter Möbeln mit Kollision 20–45 %, darunter „karg“, darüber
  „vollgestellt“ (Messung wie 8.2.6).
- **Freier Gang:** von jedem Eingang ein Weg von 2 Kacheln Breite bis in die Raummitte (Breitensuche
  mit Abstandsprüfung).
- **Möbel an der Wand:** große Möbel (`art` schrank, regal, bett, theke, kamin) berühren mit der
  Rückseite eine Wand.
- **Gruppen:** Stühle und Hocker grenzen ohne Lücke an ihren Tisch (`zu`); zwischen zwei Gruppen
  mindestens 1 Kachel Boden.
- **Blickabstand:** Sofa und Sessel mit `zu` auf Fernseher oder Kamin stehen 2–4 Kacheln davor.
- **Matte vor Tür:** vor jeder Tür `an_wand` die Kachel darunter frei; Hinweis, wenn dort keine Matte
  liegt.
- **Wandschmuck mittig:** Bilder und Fenster über einem Möbel stehen mit ihrer Mitte höchstens
  4 Pixel neben dessen Mitte.
- **Teppich:** jeder Teppich überlappt eine Gruppe (Tisch, Sofa, Bett) oder liegt direkt davor und
  ragt höchstens 1 Kachel darüber hinaus; nie unter `art` schrank oder regal.
- **Paare gleich:** Stühle an einem Tisch und gespiegelte Paare an einer Wand benutzen dieselbe
  Möbelserie (gleicher Schlüssel bis auf die Blickrichtung).
- **Kleinkram am Boden:** Einträge mit `art` deko und Höhe 16 nur auf einer Ablage (`auf`), außer der
  Ort erlaubt Bodenkram (Kinderzimmer, Turnhalle).

Nur mit der Bildprüfung zu beurteilen: Symmetrie an der Hauptwand, ob Wandschmuck zur Funktion passt,
Stil einer Möbelserie.
