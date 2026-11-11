# Prompts für Gemini, Teil 4: Ersatz für die Abziehbilder (ersetzt Teil 3)

Stand: 11.11.2026 (Haupt-Chat). Aus der Sichtung aller 558 eigenen Bilder (`gutachten/ABZIEHBILDER.md`):
Diese Bilder gibt es in keinem Paket und sie lassen sich nicht aus Paketteilen bauen. **Teil 3 ist damit
überholt:** Kutter und Bus stehen hier wieder, Gleise und Kleinteile haben die Helfer selbst gebaut.

## So geht es

1. Je Prompt ein **neuer** Gemini-Chat.
2. **Jedem Prompt das Bild `ki-roh/stilvorlage.png` beilegen** (privates Repository). Es zeigt Farben
   und Stil; Gemini soll nichts daraus abzeichnen.
3. Den gemeinsamen Kopf unten vor **jeden** Prompt kopieren.
4. Vor dem Hochladen prüfen:
   - Gebäude haben ein Dach von oben **und** eine Front, sie wirken körperlich;
   - gerade Ansicht, nicht über Eck;
   - harte, gleich große Pixel; Magenta als Hintergrund, kein Raster, keine Hilfslinien;
   - keine Schrift.
5. Hochladen nach `ki-roh/<Dateiname>` (JPEG ist in Ordnung), mehrere Fassungen als `_v2`, `_v3`.
6. Dem Haupt-Chat Bescheid sagen.

**Reihenfolge nach Nutzen:** 1 bis 3 zuerst (sie stehen in den meisten Karten und in Akt 1).

## Gemeinsamer Kopf (vor jeden Prompt kopieren)

```
Pixel art game sprite sheet for a top-down RPG.

VIEW: straight front-facing top-down view like classic 16-bit RPG town maps (camera looks down at about 45 degrees: we see the top of objects and a little of their front side). NOT isometric, NOT rotated, NOT diagonal.

PIXEL STYLE: chunky pixel art on a 16x16 pixel tile grid, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur. 1-pixel dark slate outline (#3A3A50). 2-3 flat shades per color, light from the top left. Simple, readable shapes. A person in this game is 1 tile wide and 2 tiles tall.

BACKGROUND: solid flat magenta (#FF00FF) everywhere. No shadow, no ground, no road, no text, no letters, no frame. Plenty of magenta space between objects.

STYLE REFERENCE: The attached image is a style reference only. Match its pixel size, outline thickness, shading (2-3 flat shades, light from the top left), level of detail and the color palette shown in its top row. Do NOT copy any object from the reference. Draw only the objects described below.

BUILDINGS: every building is seen from the front and from above at the same time, like in classic 16-bit RPG towns: the upper half of the picture is the ROOF seen from above (with a ridge line, roof tiles or planks, a chimney, a darker shaded side), the lower half is the FRONT WALL with door and windows. The building must look solid and three-dimensional, never like a flat sticker. The door is in the front wall at the bottom.
```

---

## 1. Gartenschuppen und Bootsschuppen

**Für:** Gärten in Maple Falls, Cedar Creek und 35 weiteren Karten; Ufer in Cedar Creek, Lockport,
Pinewood. **Datei:** `ki-roh/schuppen.jpg`. **Ziel:** je 48 × 64 Pixel.

```
OBJECTS: five small wooden sheds in one row, each 3 tiles wide and 4 tiles tall (48x64 pixels), all at the same scale. Each shed: a gabled roof seen from above filling the upper half (ridge running left to right, roof planks or shingles, darker on the far side), below it the front wall of vertical wooden boards with one door and one small window.
1. Garden shed, brown boards, dark grey roof. 2. Garden shed, blue boards, grey roof. 3. Garden shed, red boards, dark roof. 4. Garden shed, white boards, green roof.
5. Boat shed: weathered grey boards, a wide double door in the front, a life ring and an oar hanging beside the door, tar-paper roof.
```

---

## 2. Blockhütten

**Für:** Hütten in Summit City, Pinewood Camp, an den Wegen, Bergladen, Campkiosk, Rangerhaus.
**Datei:** `ki-roh/blockhuetten.jpg`. **Ziel:** je 80 × 80 Pixel, die Rangerstation 112 × 96.

```
OBJECTS: four log cabins in one row, same scale.
1. Small log cabin, 5 tiles wide and 5 tiles tall (80x80 pixels): shingle roof seen from above with a clear ridge and a stone chimney, front wall of round logs with a door in the middle and one window, a small porch step.
2. The same cabin with a green roof and a stack of firewood beside the door.
3. Mountain shop cabin, 5x5 tiles: same log walls, a wide shop window with skis and backpacks behind the glass, a striped awning over the window, a blank wooden sign board above the door (no letters).
4. Ranger station, 7 tiles wide and 6 tiles tall (112x96 pixels): log walls, green metal roof seen from above, a covered porch across the front with two posts, a flagpole beside it (plain flag, no symbols).
```

---

## 3. Westernhäuser mit Dach

**Für:** Ghost Town (zehn Fronten, bisher flache Scheinfassaden von vorn).
**Datei:** `ki-roh/western.jpg` und `ki-roh/western_2.jpg`. **Ziel:** je 96 × 112 Pixel.

```
OBJECTS: four abandoned Old West buildings in one row, each 6 tiles wide and 7 tiles tall (96x112 pixels), same scale. Each one: at the top we see the long wooden shingle roof from above running back behind a tall false front; below it the weathered false-front facade of grey-brown boards with a boardwalk porch and porch roof. Some boards are missing, windows are dusty or broken. A blank sign board on each false front (no letters).
1. Saloon with swinging doors. 2. Hotel with a balcony on the upper floor. 3. Livery stable with a wide barn door, one door half open. 4. Sheriff's office with a barred window.
```

Zweites Blatt, gleicher Kopf und gleiches Bild:

```
OBJECTS: four abandoned Old West buildings in one row, each 6 tiles wide and 7 tiles tall (96x112 pixels), same scale. Each one: at the top we see the long wooden shingle roof from above running back behind a tall false front; below it the weathered false-front facade of grey-brown boards with a boardwalk porch and porch roof. A blank sign board on each false front (no letters).
1. General store with a shop window. 2. Barber shop with a striped barber pole. 3. Post and stagecoach office with a mail slot and a wagon wheel leaning on the wall. 4. Blacksmith with an open front, anvil and cold forge visible inside.
```

---

## 4. Halfpipe und Pokalvitrine

**Für:** Stadtpark Maple Falls; Clubraum der Schule. **Datei:** `ki-roh/halfpipe_vitrine.jpg`.
**Ziel:** 64 × 48 Pixel und 32 × 48 Pixel.

```
OBJECTS, two objects with plenty of space between them:
1. A small wooden skateboard mini ramp (half-pipe) for a town park, seen from above and slightly from the front: 4 tiles wide and 3 tiles tall (64x48 pixels). We look into the curved riding surface of plywood, with a flat deck and a metal coping rail on the left and on the right end, wooden support frame visible at the front, a few scuff marks.
2. A school trophy cabinet seen from the front and slightly from above: 2 tiles wide and 3 tiles tall (32x48 pixels). Dark wood, we see the top surface of the cabinet as a strip at the top, two glass doors, three shelves with small golden and silver cups and one chess trophy.
```

---

## 5. Stellwerk, Schornstein, Werkhalle

**Für:** Bahndamm; Ironwood. **Datei:** `ki-roh/werk.jpg`.
**Ziel:** 64 × 80, 32 × 112, 96 × 96 Pixel.

```
OBJECTS, three objects with plenty of space between them, same scale:
1. A small old railway signal box: 4 tiles wide and 5 tiles tall (64x80 pixels). Brick ground floor, a glazed upper floor with many small window panes, a hipped slate roof seen from above, an outside wooden staircase on the right side.
2. A tall round brick factory chimney seen from the front and slightly from above: 2 tiles wide and 7 tiles tall (32x112 pixels). Round, slightly tapering, iron bands, we see the dark round opening at the top as an ellipse, soot at the top. Shading on the right side so that it looks round.
3. An old brick factory hall: 6 tiles wide and 6 tiles tall (96x96 pixels). A saw-tooth roof with three ridges and skylights seen from above in the upper half, below it the brick front wall with tall arched windows and a big sliding gate.
```

---

## 6. Speisewagen des Diners

**Für:** Diner an der Bergstraße. **Datei:** `ki-roh/diner_wagen.jpg`. **Ziel:** 160 × 112 Pixel.

```
OBJECT: an American roadside diner built from an old streamlined railway dining car, 10 tiles wide and 7 tiles tall (160x112 pixels). In the upper part we see the rounded stainless steel roof from above with two roof vents and reflections; below it the long front side: a row of windows with a red stripe under them, a double door in the middle with three steps, rounded ends. The whole car stands on a low concrete base. No sign, no letters.
```

---

## 7. Fähre, Deckhaus, Fährhäuschen

**Für:** Fährstrecke im Delta, alter Hafen, Lockport. **Datei:** `ki-roh/faehre.jpg`.
**Ziel:** 320 × 96, 160 × 112, 96 × 112 Pixel.

```
OBJECTS, three objects with plenty of space between them, same scale:
1. A small car and passenger ferry seen from above and slightly from the side, bow pointing LEFT: 20 tiles long and 6 tiles tall (320x96 pixels). White hull with a blue stripe and a red waterline, we see the whole deck from above (open car deck at the front with white lane lines, railings all around), a two-storey white deckhouse with a red funnel near the stern, lifeboats, life rings. The near side of the hull is visible below the deck. No water.
2. The deckhouse of that ferry alone as a building: 10 tiles wide and 7 tiles tall (160x112 pixels). White steel walls, a row of round portholes and a door in the front, the flat roof seen from above with a red funnel, a radar mast and railings.
3. A small ferry ticket house on a quay: 6 tiles wide and 7 tiles tall (96x112 pixels). White wooden walls, blue gabled roof seen from above with a small clock turret on the ridge, a ticket window and a door in the front wall, a bench beside the door.
```

---

## 8. Fischkutter und Lastkahn

**Für:** alter Hafen, Lockport, Port Delacroix; Kanal bei Riverton und Ironwood.
**Datei:** `ki-roh/kutter.jpg`. **Ziel:** 160 × 64, 48 × 144, 192 × 64 Pixel.

```
OBJECTS, three boats with plenty of space between them, same scale. No water, no waves.
1. An old wooden fishing trawler seen from above and slightly from the side, bow pointing LEFT: 10 tiles long and 4 tiles tall (160x64 pixels). Dark green hull with a red waterline stripe, white wheelhouse near the stern, a mast with a boom, nets and fish crates on the deck, orange buoys. We see the deck from above and the near side of the hull below it.
2. The same trawler lying lengthwise, bow pointing UP, seen from above: 3 tiles wide and 9 tiles long (48x144 pixels).
3. A long flat canal barge seen from above and slightly from the side, bow pointing LEFT: 12 tiles long and 4 tiles tall (192x64 pixels). Black steel hull whose near side is clearly visible below the deck, an open hold full of coal covered half by a tarpaulin, a small cabin at the stern with a stovepipe, coiled ropes.
```

---

## 9. Bus von vorn und von hinten

**Für:** Werksbus Ironwood, Stadtbusse, Schulbus. Regel 10.64: 3 × 8 Kacheln.
**Datei:** `ki-roh/bus.jpg`. **Ziel:** je 48 × 128 Pixel.

```
OBJECTS: buses standing on a road that runs from top to bottom, each a tall narrow shape 3 tiles wide and 8 tiles long (48x128 pixels), seen from above and slightly from one end, same scale:
1. A grey-blue works bus driving DOWN toward the viewer: windscreen, blank destination box, headlights and bumper as a strip at the bottom; long roof with two roof hatches and an air-conditioning box above.
2. The same bus driving UP away from the viewer: long roof, and at the bottom the rear window, tail lights and bumper.
3. A yellow American school bus driving DOWN toward the viewer, with the typical bonnet (hood) at the bottom.
4. The same school bus driving UP away from the viewer, with the rear emergency door at the bottom.
```

---

## 10. Zuckerwattewagen

**Für:** Jahrmarkt, Capital Arena. **Datei:** `ki-roh/zuckerwatte.jpg`. **Ziel:** 32 × 48 Pixel.

```
OBJECT: a small cotton candy cart for a fairground, seen from the front and slightly from above: 2 tiles wide and 3 tiles tall (32x48 pixels). Pink-and-white striped canopy seen partly from above, a glass case with a spinning drum, two big pink cotton candy puffs on sticks, two spoked wheels and a push handle. No letters.
```

---

## 11. Wohnhäuser von hinten

**Für:** Häuser, die südlich einer Straße stehen und ihre Rückseite zeigen (Cedar Creek, Maple
Falls, Riverton und andere). **Datei:** `ki-roh/haus_hinten.jpg`. **Ziel:** je 96 × 96 Pixel.

```
OBJECTS: four small American family houses seen from BEHIND, in one row, each 6 tiles wide and 6 tiles tall (96x96 pixels), same scale. We stand in the back garden: the upper half of each picture is the gabled shingle roof seen from above (ridge running left to right, a brick chimney, a darker shaded far side), the lower half is the BACK WALL of horizontal wooden siding with two or three windows with curtains and a plain back door with two steps. Each house has one detail at the back: 1. light blue siding, grey roof, a small lean-to shed. 2. brown siding, dark brown roof, a stack of firewood. 3. red siding, dark grey roof, a rain barrel and a drainpipe. 4. cream siding, green roof, a clothesline post and a cellar hatch.
No front door, no porch, no mailbox, no house number.
```
