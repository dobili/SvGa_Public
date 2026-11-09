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
   Türrahmen); keine nackten Lücken. Innerhalb einer Wohnung sind offene Durchgänge ohne Türbild
   erlaubt, wenn die Wand daneben sauber endet (Abschnitt 8); Außentüren und Türen zu fremden
   Räumen sind immer Türbilder. Ausgangstüren liegen auf der Wand, durch die man den Raum verlässt.
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
   Kleinkram steht auf Ablagen; am Boden nur, was dort hingehört (Schuhe, Skateboard, Hanteln,
   Kartons beim Umzug).

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
2. In Städten liegen Gehwege beidseitig an Straßen, mit Bordstein auf beiden Seiten. In Dörfern,
   auf Höfen und über Land gibt es weiche Erdwege ohne Gehweg (Abschnitt 9).
3. Jedes Haus hat einen Weg von der Tür zur Straße oder zum Gehweg (Wohnblocks und Läden an einem
   Platz öffnen direkt auf den Platz); Wohnhäuser haben Vorgarten und
   Zaun oder Hecke um das Grundstück, je nach Ortsprofil. Häuser stehen an der Straße.
4. Nachbarschaft nach Ortsprofil: Wohnhäuser neben Wohnhäusern; Industrie oder Gewerbe nur, wo die
   Geschichte es sagt. Villa mit großem Garten.
5. Außen und innen passen zusammen: Größe, Stil und Wohlstand des Hauses draußen entsprechen den
   Innenkarten. Türbild passt zum Gebäude.
6. Hindernisse auf Wegen nur, wenn die Geschichte es will (Baumstümpfe stehen neben, nicht auf dem Weg).
7. Straßenmöbel: Laternen direkt an Weg oder Straße; Bänke am Weg, zum Weg gewandt (oder vom Weg weg
   zu einer Aussicht, dann direkt am Weg und mit etwas zu sehen); Bushaltestelle zur Straße;
   Blumenkästen parallel zum Weg, gern am Zaun oder an der Fassade, auch auf dem Gehweg wie
   beim Zeichner (Abschnitt 9), aber nie über die ganze Breite: Es bleibt immer mindestens eine Kachel
   zum Vorbeigehen frei; Mülleimer und Kästen nur mit erkennbarem
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

## 7a. Maßstab und Laufzeiten

Wunsch des Autors (9.11.2026): Außenkarten müssen sich so groß anfühlen wie der Ort, den sie
zeigen. Der Held läuft 3,5 Kacheln je Sekunde (56 px); eine Kachel ist etwa ein Meter. Die Kamera
zeigt im Hochformat etwa 8 × 15 Kacheln. Laufzeiten ohne Umwege:

| Art                       | Laufzeit                                | Größe in Kacheln              |
| ------------------------- | --------------------------------------- | ----------------------------- |
| Raum                      | 3–6 s                                   | nach Inhalt, etwa 16–25 breit |
| Stadt außen (Hauptstraße) | 25–40 s quer                            | 90–140 breit                  |
| Park, Platz               | 15–25 s                                 | 50–80                         |
| Weg zwischen zwei Orten   | 1,5–2,5 min gesamt, auf 2–3 Karten      | je Karte 100–150 lang         |
| Feld, Weide               | größer als ein Bildschirm, bis zum Rand | mindestens 25 × 20            |

1. Wege zwischen Orten winden sich und haben Abzweigungen (Hof, Aussicht, Bach), damit sie nicht
   wie ein Flur wirken.
2. Etwa jeder Bildschirm hat etwas zum Entdecken: Fund, Statist, Tier, Schild, Aussicht. **[auto]**
   (Abstand zwischen Auslösern, Figuren und Belebung höchstens etwa 25 Kacheln.)
3. Gebäude haben außen echte Größe: Gärten, Höfe und Felder mit Platz; eine Villa mit großem Garten.

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
   Tresen und Licht). _Generic Home:_ `Layer_1` zeigt nur Dielen, Fliesen und Wände.
2. **Nordwand zwei Reihen Wandfläche** mit schmaler heller Kante oben; Seitenwände nur als schmale
   Kante mit Schattenkeil zum Boden. _Generic Home, Wohnanlage, Turnhalle._ (Passt zu 2. und zum
   Kartenbauer.)
3. **Innenwände zwischen zwei Räumen** bekommen auf der Südseite wieder zwei Reihen Wandfläche; der
   Raum darunter hat seine eigene „Nordwand“. _Generic Home:_ der Eingangsraum unten hat eine eigene
   Wandfläche mit zwei Schränken davor; _Museum Raum 2:_ jede Abteilung beginnt mit einer Wand.
4. **Durchgänge zwischen Räumen sind offene Lücken** von 1 bis 3 Kacheln Breite, durch die der
   Boden weiterläuft, ohne Türbild. Türbilder nur dort, wo eine Wohnung, ein Zimmer oder das Haus
   endet. _Generic Home:_ Flur links und rechts und der Gang nach unten offen, eine Tür nur oben;
   _Wohnanlage 2:_ vier Wohnungstüren nebeneinander. **Widerspruch zu 2.2** („keine nackten Lücken“):
   Beim Zeichner sind offene Durchgänge innerhalb einer Wohnung üblich; 2.2 bleibt unverändert.
5. **Türen** sitzen in der Wandfläche, ihre Unterkante auf der Bodenlinie; direkt davor auf der ersten
   Bodenreihe liegt eine Fußmatte, so breit wie die Tür. _Wohnanlage 2:_ jede der vier Türen mit
   eigener Matte; _Turnhalle 2:_ Matte vor dem Durchgang oben rechts. Ausgänge in der Südwand sind eine
   Lücke von 2–4 Kacheln, oft mit Matte davor oder dahinter (_Eisdiele_, _Generic Home_).
6. **Fenster** hängen in der Wandfläche, mittig über einem Möbel oder zwischen zwei Möbeln; Gardinen
   oder Rollos so breit wie das Fenster. _Turnhalle:_ großes Fenster über der Hantelecke;
   _japanisches Haus:_ zwei Schiebefenster je über einer Möbelgruppe; _TV-Studio:_ gestreifte Vorhänge
   links und rechts über den Hockern.

### 8.2 Anordnung und Abstände

1. **Möbel an die Wände, Mitte frei.** Große Stücke (Schrank, Kamin, Regal, Theke, Bett) stehen mit
   dem Rücken an einer Wand; die Raummitte bleibt als Lauffläche frei, mindestens 2 Kacheln breit von
   jedem Eingang aus. _Generic Home:_ Mitte 6 × 3 Kacheln frei; _Eisdiele:_ Gang 3 Kacheln breit von
   der Tür zur Theke; _Museum Raum 3:_ Mittelgang 2 Kacheln.
2. **Symmetrie an der Hauptwand:** Das wichtigste Stück steht mittig, gleiche Stücke links und rechts
   davon im gleichen Abstand. _Generic Home:_ Kamin mittig, je ein Sessel links und rechts, Abstand 0;
   die beiden Kleiderschränke unten spiegeln sich um die Tür. _Eisdiele:_ Speisekarte mittig, je ein
   Eisautomat und ein Herz-Schild links und rechts. _TV-Studio:_ Moderationstisch mittig, Lampen,
   Hocker und Vorhänge gespiegelt. _Museum Eingang:_ Vitrinen gespiegelt um den Eingang.
3. **Gruppen dicht, Gruppen untereinander mit Luft.** Was zusammengehört, steht ohne Lücke
   (Stühle direkt am Tisch, Sessel direkt neben dem Kamin, Hocker direkt an der Theke); zwischen zwei
   Gruppen liegt mindestens 1 Kachel Boden. _Eisdiele:_ Tisch 1 × 2 mit je zwei Stühlen links und
   rechts ohne Abstand, die beiden Gruppen 4 Kacheln auseinander. _Japanisches Haus:_ Sitzkissen direkt
   am niedrigen Tisch. _Schießstand:_ Hocker eine Reihe vor dem langen Tresen.
4. **Reihen gleicher Geräte** stehen in gleichem Abstand nebeneinander: _Turnhalle:_ zwei Laufbänder
   mit 1 Kachel Abstand, drei Boxsäcke in gleichem Abstand an der Nordwand; _Schießstand:_ vier
   Bahnen, je Monitor und Scheibe übereinander; _Museum Raum 1:_ drei Vitrinen mit je einem Lesepult
   rechts daneben.
5. **Blickrichtung:** Sitzende schauen zur Mitte der Gruppe (Stühle zum Tisch, Publikumsstühle im
   TV-Studio zum Moderationstisch, 3 Reihen davor). Sitzplätze vor einem Blickziel stehen 2–4 Kacheln
   entfernt. _TV-Studio:_ Zuschauerstühle 3 Reihen vor dem Tisch; _Generic Home:_ Teppich 1 Reihe vor
   dem Kamin, dahinter frei.
6. **Belegung:** Ebene 2 belegt (mit Teppichen und Wandschmuck, gemessen an allen Kacheln des Raums
   einschließlich Wände) bei Wohnräumen 39–54 % (Wohnanlage 39–41 %, Generic Home 46 %, japanisches
   Haus 54 %), bei Läden und Hallen 51–59 % (Eisdiele 58 %, Museum 52–59 %, Turnhalle 57 %), bei
   Studios und Fluren 33–41 % (TV-Studio 38 %, Schießstand 41 %, Museum Raum 1 33 %). Ohne Teppiche und
   Wandschmuck ist etwa ein Drittel der Bodenkacheln mit Möbeln belegt.

### 8.3 Pflanzen, Lampen, Wandschmuck

1. **Pflanzen** stehen an Durchgängen (je eine links und rechts), in Raumecken oder in Lücken
   zwischen Möbeln an der Wand; nie frei im Raum. _Generic Home:_ je eine Pflanze an den Fluren links
   und rechts, je eine in den unteren Ecken des Eingangs; _Wohnanlage 2:_ Pflanzen zwischen den Türen
   und in den Ecken unten; _japanisches Haus:_ zwei Bonsai rechts und links im Eingang. (Passt zu 4.4.)
2. **Lampen:** In Wohnräumen kleine Lampen auf Ablagen (Beistelltisch, Kommode) oder Wandleuchten an
   den Seitenwänden der Flure; Stehlampen kommen in keinem Beispiel vor. _Generic Home:_ Lampe mit
   Büchern auf dem Beistelltisch, Wandleuchten in beiden Fluren. _TV-Studio:_ Strahler als Reihe in der
   obersten Wandflächenreihe, Scheinwerfer auf Stativen in den Ecken.
3. **Wandschmuck** sitzt ganz in der Wandfläche, mittig über einem Möbel, zwischen zwei Möbeln oder in
   gleichen Abständen; Schilder mit Text gehören zur Funktion des Raums. _Museum Raum 1:_ Bilder mit
   Schildchen darunter und Lesetafeln dazwischen; _japanisches Haus:_ zwei Rollbilder links und rechts
   vom runden Fenster; _Eisdiele:_ Herz-Schilder und Löffel über den Automaten.

### 8.4 Teppiche, Stile, Kleinkram

1. **Teppiche** liegen rechteckig auf dem Raster, unter oder direkt vor einer Gruppe, nie unter
   Schränken an der Wand; sie ragen höchstens 1 Kachel über die Gruppe hinaus. _Generic Home:_ 2 × 2 vor
   dem Kamin, ein zweiter neben dem Etagenbett; _japanisches Haus:_ Tatami-Matten unter jeder
   Sitzgruppe, je 1 Kachel größer als der Tisch; _Turnhalle:_ Gummimatten unter den Gewichtsbänken.
2. **Eine Möbelserie je Raum:** gleiche Farbe und gleiches Material, Paare identisch. _Generic Home:_
   alles Holz in einem Ton, zwei gleiche Schränke, zwei gleiche Sessel; _Eisdiele:_ alles rosa-weiß;
   _TV-Studio:_ weiß-blau; _Museum:_ Vitrinen und Pulte aus derselben Serie. (Passt zu 3.2 und 3.3.)
3. **Kleinkram** liegt auf Ablagen (Bücher und Lampe auf dem Beistelltisch, Vase auf der Kommode,
   Becher auf der Theke), in Gruppen von 2–3 Stück. Am Boden nur, was dort hingehört und höchstens 1–2
   Stück je Wohnraum: _Generic Home:_ Hut und Skateboard vor dem Etagenbett (Kinderzimmer);
   _Turnhalle:_ Hanteln und Bälle neben den Geräten. **Ergänzung zu Prüfliste 2** („nichts liegt
   unpassend am Boden“): Der Zeichner legt wenige passende Dinge bewusst auf den Boden; die Regel bleibt.

### 8.5 Gebäude außen (Beispiele aus Modern Exteriors)

1. **Eingang mittig in der Fassade**, davor Stufen oder eine Treppe in Türbreite, die bis auf den
   Gehweg reicht. _Palast:_ Säulenportal mittig, Treppe 6 Kacheln breit, Laternenpfosten links und
   rechts der Treppe; _Bürohaus „G-Neric Corp“:_ Glastür mittig unter dem Firmenschild.
2. **Schild und Name über der Tür**, nicht daneben. _Bürohaus, Eisenwarenladen_ (Markise über den
   Schaufenstern).
3. **Bank direkt an der Fassade neben der Tür**, Sitzfläche zum Gehweg. _Condo 6:_ Bank zwischen
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
