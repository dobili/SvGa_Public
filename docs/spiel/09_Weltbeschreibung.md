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
   Küstenstraße (Fähre)
         v
   [6 Old Harbor] --Wüstenstraße (Zug)--> [7 Desert Springs] --Bergstraße--> [8 Summit City]
                                                 |
                                          [9 Crossroads] (Rastort, alle Wege kreuzen sich)
                                                 |
                             [10 Pinewood Camp] ... [11 Ghost Town] ... [12 Capital Arena]
```

Richtung der Reise: von klein und warm (Holz, Ahorn) über laut und grau (Stahl, Glas) zu weit und
hell (Küste, Wüste, Berge) und zurück in die Mitte (Hauptstadt). Die Grafik folgt dieser Kurve:
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

- **Außen:** Parkpavillon mit Brettern (der Club), Brücke über den Fluss, Bahnhof, ein
  Handyladen (Laden), Bushaltestelle, Regenpfützen mit Spiegelung.
- **Innen:** Pavillon (offen, Regen auf dem Dach), Bahnhofshalle (Zeitungsstand, Uhr, Flashback-
  Auslöser), Slicks Wohnwagen (Schach-Trophäen aus Dosen).
- **Verbindungen:** Zug (Cedar Creek ↔ Riverton), Kanalweg mit Fahrrad nach Ironwood.

### 5.5 Ironwood (Akt 2)

Stahlstadt, Rauch, Brücken, Werksschornsteine, Kälte. Der Club trifft sich in der Werkskantine;
Mamas Geheimnis liegt hier. Grau mit einem warmen Kern (die Kantine, der Ofen).

- **Außen:** Werkstor, Brücke, Reihenhäuser, Kantine, ein Kiosk; Rauch und Funken animiert.
- **Innen:** Kantine (lange Tische, Ofen, Big Joes Brett aus Stahl), Mamas altes Zimmer im
  Reihenhaus der Großeltern (das Geheimnis), die Umkleide (Schließfach mit Fund).
- **Verbindungen:** Kanalweg (Riverton), Schnellstraße mit Bus nach Silicon Bay (Cliffhanger).

### 5.6 Silicon Bay (Akt 3)

Glasstadt am Wasser, Kunstlicht, keine Jahreszeit, keine Tiere. Konzern-Akademie mit
Bildschirmen statt Brettern. Die Welt ist hier sauber und falsch.

- **Außen:** Campus mit Glasgebäuden, Straßenbahn, Werbetafeln (ZERO-Arbeitsname), ein
  Food-Truck (Laden).
- **Innen:** Akademie (Glasbüro, Bildschirme, Dr. Lin), Serverraum (Fund, Schummelgerät), die
  Straßenbahn als Innenraum für einen Dialog.
- **Verbindungen:** Bus (Ironwood), Fähre (Old Harbor).

### 5.7 Old Harbor (Akt 3, Tiefpunkt)

Hafen, Sturm, Gischt, Fischkisten, eine Kneipe mit Brettern aus Treibholz. Hier spielt der Held
ohne Ambrose; die Karte ist dunkler als alle davor.

- **Außen:** Kai, Fähranleger, Leuchtturm (Lichtkegel animiert), Fischmarkt (Laden).
- **Innen:** Hafenkneipe (Club), Leuchtturmstube (Flashback), Fischhalle.
- **Verbindungen:** Fähre (Silicon Bay), Küstenzug nach Desert Springs.

### 5.8 Desert Springs, Summit City, Crossroads, Pinewood Camp, Ghost Town, Capital Arena (Akt 3 und 4)

Je ein Bild für die Grafikplanung: Wüstenstadt mit Motel und Diner (Mira, Wunderkind; Garage als
Clubraum); Bergstadt mit Seilbahn und Berghütte (Großmeisterin Ward, Endspiele am Kaminfeuer);
Crossroads als Raststätte an einem Kreuz von vier Straßen (alle Rivalen, Nebenquests, Laden);
Pinewood Camp mit Hütten am See (Sommer, Lagerfeuer, Bretter auf Baumstümpfen); Ghost Town als
verlassene Goldgräberstadt mit Saloon und Friedhof (Ambroses Grab, Sepia auch am Tag); Capital
Arena als Halle mit Tribünen (Landesmeisterschaft). Details kommen mit der Bibel zu Akt 3 und 4.

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
- Tiere und Statisten als Objekte `type = "tier"` / `"statist"` mit Laufweg (zwei Punkte).
- Animierte Kacheln (Tiled-Animationen werden von Phaser unterstützt) und Partikel (Regen, Rauch).
- Bedingte Objektkacheln (`objekte`-Ebene mit Eigenschaft `wenn` = Dialogvariable).
- Hintergrundgeräusch je Karte (`geraeusch` in `orte.json`), Musik gibt es schon.
