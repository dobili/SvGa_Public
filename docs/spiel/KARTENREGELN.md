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
