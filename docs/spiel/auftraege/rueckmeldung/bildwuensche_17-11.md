# Bildwünsche aus der Nacht zum 17.11.2026

Bilder, die bei der Arbeit an Innenräumen, Außenkarten und Rückmeldungen in der Nacht zum 17.11.2026
gefehlt haben (Helfer mittel-2 im Auftrag des Hauptchats). Alle sind freiwillig: Die Karten
funktionieren heute mit Notlösungen. Je Bild stehen Zweck, Größe in Pixeln, Perspektive und ein
Prompt zum Kopieren.

Für alle Gemini-Bilder gilt wie bisher: ein eigener Chat je Bild, keine gekauften Bilder als
Vorlage, keine Schrift im Bild (Gemini malt sonst Zeichensalat; Schilder kommen als eigenes Bild
dazu). Die Größen sind die Zielgröße im Spiel; Gemini liefert meist größer, der Hauptchat rechnet
auf das Pixelraster herunter.

## 1. Sitzbilder der Figuren (PixelLab)

- **Zweck:** Sitzende Figuren sitzen sichtbar auf ihrem Stuhl, ihrem Sessel oder ihrer Bank (R020).
  Seit dem 17.11. setzt die App sie richtig auf den Sitzplatz, zeigt aber das Standbild. Mit
  Sitzbildern sieht man die Knie und den Stuhl darunter.
- **Für wen:** die Figuren Lily, Owen, Sam, Mrs. Calloway, Abernathy, Carla (Club) und Dash sowie
  Slick auf der Bank in der Bahnhofshalle; dazu die Statistenbögen statist-05, -06, -07, -09, -11,
  -12, -13, -14, -16 und -18 (Gäste, Leser, Schachspieler).
- **Größe:** wie die Laufbilder der Figur (Bogen der Figur, je Richtung ein Bild).
- **Perspektive:** vier Richtungen wie die Laufbilder (rechts, oben, links, unten).
- **Vorgehen in PixelLab:** die vorhandene Figur öffnen, „Template motion“ → „Sitting“ für alle vier
  Richtungen. Der Export legt `animations/Sitting/<richtung>/frame_000.png` an; der Paketbau nimmt
  je Richtung das erste Bild als dritte Reihe des Bogens.
- **Prompt (falls PixelLab eine Beschreibung verlangt):** „Dieselbe Figur sitzt auf einem Stuhl ohne
  Lehne, Hände auf den Knien, Rücken gerade, gleiche Kleidung und Farben, gleiche Pixelgröße wie
  die Laufbilder, transparenter Hintergrund.“

## 2. Rettungsboot an der Fähre

- **Zweck:** Achterdeck der Seefähre zwischen Silicon Bay und Port Delacroix (Weg „Fähre“). Dort
  steht heute ein kleines Ruderboot; ein Rettungsboot in Halterungen passt zum Schiff.
- **Größe:** 48 × 32 Pixel (3 × 2 Kacheln).
- **Perspektive:** Draufsicht schräg von oben wie die übrigen Karten, Längsachse waagerecht.
- **Prompt:** „Pixel-Art, Draufsicht wie ein 16-bit-Rollenspiel, ein kleines oranges Rettungsboot mit
  weißem Rand und Plane darüber, hängt in zwei grauen Metallhalterungen an Deck, Längsachse
  waagerecht, Gesamtbild 48 × 32 Pixel, klare Umrisse, leichter Schatten nach unten, transparenter
  Hintergrund.“

## 3. Winterdach für das Rasthaus

- **Zweck:** Das Rasthaus an der Küstenstraße (`ws5Rasthaus`, eigenes Bild `fassade_rasthaus.png`)
  steht auch in der Winterfassung. Heute bleibt im Winter nur ein glattes grünes Dach; ein Dach mit
  Schnee passt zur Jahreszeit.
- **Größe:** 128 × 144 Pixel, genau der Umriss des vorhandenen Bilds (gleiche Tür, gleiche Fenster).
- **Perspektive:** wie das vorhandene Bild (Front gerade von vorn, Dach von schräg oben).
- **Prompt:** „Pixel-Art, Draufsicht wie ein 16-bit-Rollenspiel. Nimm das angehängte Rasthaus und
  ändere nur das Dach: Auf dem flachen Dach liegt eine dicke, weiche Schneeschicht mit runden
  Kanten, an der vorderen Dachkante hängen ein paar kleine Eiszapfen. Wände, Tür, Fenster, Markise
  und Größe bleiben genau gleich, 128 × 144 Pixel, transparenter Hintergrund.“ (Vorlage: das eigene
  Bild `fassade_rasthaus.png`, kein Paketbild.)

## 4. Turnhalle der Schule auf der Hochebene

- **Zweck:** Auf der Hochebene steht als Turnhalle heute eine kleine Scheune mit einem Schild
  „Turnhalle“ (Notlösung). Eine richtige Schulturnhalle passt zum Schulhaus mit rotem Walmdach.
- **Größe:** 160 × 144 Pixel (10 Kacheln breit, Grundriss etwa 10 × 5 Kacheln).
- **Perspektive:** Front gerade von vorn, Dach von schräg oben wie die übrigen Gebäude.
- **Prompt:** „Pixel-Art, Draufsicht wie ein 16-bit-Rollenspiel, eine einstöckige Schulturnhalle aus
  hellem Backstein mit flachem, leicht gewölbtem Blechdach, eine breite Doppeltür in der Mitte der
  Front mit zwei Stufen davor, links und rechts je zwei hohe schmale Fenster unter dem Dach, ohne
  Schrift, Gesamtbild 160 × 144 Pixel, passt zu einem Schulhaus mit rotem Walmdach, transparenter
  Hintergrund.“ (Das Schild „Turnhalle“ gibt es schon als eigenes Bild.)

## 5. Glücksrad für den Jahrmarkt

- **Zweck:** Auf dem Festplatz des Jahrmarkts fehlt das Glücksrad (die Statisten reden heute davon
  nicht mehr). Die Bude „Dosenwerfen“ und die Zuckerwatte sind laut `docs/spiel/orte/jahrmarkt.md`
  schon geliefert; sie müssen nur wieder auf die Karte (Fable-Chat).
- **Größe:** 48 × 64 Pixel (3 × 4 Kacheln).
- **Perspektive:** gerade von vorn, das Rad senkrecht stehend.
- **Prompt:** „Pixel-Art, Draufsicht wie ein 16-bit-Rollenspiel, ein Glücksrad auf einem Jahrmarkt:
  großes rundes Rad mit acht bunten Feldern (rot, gelb, blau, grün im Wechsel), goldener Rand mit
  kleinen Glühbirnen, ein roter Zeiger oben, steht auf einem kleinen Holzpodest mit gestreifter
  Stoffverkleidung, ohne Schrift und ohne Zahlen, Gesamtbild 48 × 64 Pixel, transparenter
  Hintergrund.“

## 6. Größerer Pavillon in Riverton

- **Zweck:** Slicks Club im Pavillon ist innen 22 × 15 Kacheln groß; der Pavillon außen ist nur
  8 × 5 (R065, Rückfrage RO36 zur Form). Gebraucht wird der Pavillon etwa 1,4-mal so groß. Gilt nur,
  wenn der Autor bei RO36 nicht anders entscheidet.
- **Größe:** 176 × 208 Pixel (11 × 13 Kacheln, Grundriss etwa 11 × 7).
- **Perspektive:** wie das vorhandene Bild `pavillon_achteck.png` (Dach von schräg oben, Eingang in
  der Mitte der Südseite).
- **Prompt (offen wie heute):** „Pixel-Art, Draufsicht wie ein 16-bit-Rollenspiel, ein großer
  achteckiger Parkpavillon mit grünem Blechdach, weißen Pfosten und weißem Geländer ringsum, Dielen
  aus hellem Holz, Eingang mit zwei Stufen in der Mitte der Vorderseite, Gesamtbild 176 × 208 Pixel,
  im Stil des angehängten kleineren Pavillons, transparenter Hintergrund.“
- **Prompt (geschlossen, falls der Autor bei RO36 einen Holzsaal wählt):** wie oben, aber „Wände aus
  weiß gestrichenen Holzbrettern mit einer Reihe Sprossenfenster auf jeder Seite statt Geländer“.

## 7. Alter Bahnhof als Heimatmuseum in Ironwood

- **Zweck:** Das Heimatmuseum liegt „im alten Bahnhof“, außen steht heute ein schmales graues
  Stadthaus (6 × 3). Innen ist das Museum 21 × 11 Kacheln groß; außen braucht es mindestens
  10 × 4 Kacheln Grundriss (R065).
- **Größe:** 160 × 144 Pixel (10 Kacheln breit, Grundriss etwa 10 × 4).
- **Perspektive:** Front gerade von vorn, Dach von schräg oben.
- **Prompt:** „Pixel-Art, Draufsicht wie ein 16-bit-Rollenspiel, ein kleiner alter Bahnhof aus
  dunkelrotem Backstein in einer Industriestadt, Satteldach aus grauem Schiefer, in der Mitte über
  der Doppeltür ein kleiner Uhrgiebel mit runder Uhr, links und rechts je zwei hohe Bogenfenster,
  ein schmales Vordach aus Eisen über der Tür, ohne Schrift, Gesamtbild 160 × 144 Pixel,
  transparenter Hintergrund.“

## 8. Breitere Werkskantine in Ironwood

- **Zweck:** Die Kantine des Werks mit Küche, Gastraum und Big Joes Schachecke ist innen 34 × 16
  Kacheln; das Gebäude außen ist 13 Kacheln breit. Gebraucht werden mindestens 22 × 8 Kacheln
  Grundriss (R065).
- **Größe:** 352 × 224 Pixel (22 Kacheln breit, Grundriss etwa 22 × 8).
- **Perspektive:** Front gerade von vorn, Flachdach von schräg oben.
- **Prompt:** „Pixel-Art, Draufsicht wie ein 16-bit-Rollenspiel, eine lange einstöckige Werkskantine
  aus Backstein und Wellblech neben einem Stahlwerk, flaches Dach mit zwei Lüftern und einem
  Schornstein, eine breite Doppeltür in der Mitte, links eine Reihe Küchenfenster mit Lüftungsgitter,
  rechts große Sprossenfenster, ohne Schrift, Gesamtbild 352 × 224 Pixel, transparenter
  Hintergrund.“

## Keine neuen Bilder nötig

- **Schneeräumroboter in der Altstadt von Silicon Bay:** Er sieht schon aus wie der Lieferroboter;
  nur der Name passt nicht (kein Schnee an der Küste, RO21). Umbenennen genügt (Wunsch an den
  Fable-Chat).
- **Brücken an der Schleuse Lockport (R133):** mit vorhandenen Bildern gelöst (Fußgängersteg mit
  Geländerpfosten, breiter GESPERRT-Bock mit Schatten).
