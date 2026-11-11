# Prompts für Gemini, Teil 5: Bilder aus der zweiten Rückmeldung (R071 bis R151)

Stand: 12.11.2026 (Haupt-Chat). Vorab im Katalog geprüft: Schließfächer, Koffer, Küchenzeile mit
Spüle, senkrechte Zaunstücke und Ticketautomaten gibt es in den Paketen; der Tanker ist der neue
Lastkahn aus Teil 4. **Diese Liste nennt nur, was in keinem Paket steckt.** Teil 4 ist erledigt.

## So geht es (wie bei Teil 4)

1. Je Prompt ein **neuer** Gemini-Chat, den gemeinsamen Kopf davor.
2. **Jedem Prompt `ki-roh/stilvorlage.png` beilegen.**
3. Vor dem Hochladen prüfen:
   - Gemini hat **nichts aus der Stilvorlage abgezeichnet** (Farbleiste, Lastwagen, Bagger, Tiere);
   - Hintergrund ist reines Magenta, kein Raster, keine Schrift;
   - Gebäude haben Dach von oben und Front; Türen sind etwa so hoch wie die Figur (1 × 2 Kacheln).
4. Hochladen nach `ki-roh/<Dateiname>` in voller Größe, dann dem Haupt-Chat Bescheid sagen.

**Reihenfolge nach Nutzen:** 1 und 2 zuerst (Riverton, das spielt man früh), dann 3.

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

## 1. Fahrkartenschalter

**Für:** Bahnhofshalle Riverton (R097), später andere Bahnhöfe.
**Datei:** `ki-roh/fahrkartenschalter.jpg`. **Ziel:** 96 × 64 Pixel.

```
OBJECT: an old railway station ticket counter standing against a wall, seen from the front and slightly from above: 6 tiles wide and 4 tiles tall (96x64 pixels). A long dark wooden counter whose top surface is visible as a strip, on it a glazed wooden screen with three arched ticket windows with small brass grilles and a coin tray under each; behind the glass we see dim shelves. Above the screen a blank brass sign board (no letters). A small brass bell on the counter.
```

---

## 2. Große Schachfiguren für das Bodenbrett

**Für:** Pavillon Riverton (R128): Schachbrett im Boden mit großen Figuren.
**Datei:** `ki-roh/schachfiguren_gross.jpg`. **Ziel:** je 16 × 32 Pixel.

```
OBJECTS: large garden chess pieces made of turned wood, standing on the ground, seen from the front and slightly from above, each 1 tile wide and 2 tiles tall (16x32 pixels), all at the same scale, in two rows of six with plenty of space between them. Each piece has a round base whose top we can see a little, a clear classic Staunton shape and a soft highlight on the left.
Row 1, WHITE pieces (cream-coloured wood): king, queen, rook, bishop, knight (horse head facing right), pawn.
Row 2, BLACK pieces (dark walnut wood): king, queen, rook, bishop, knight (horse head facing right), pawn.
The pawn is shorter than the other pieces. No board, no shadow.
```

---

## 3. London 1851: Häuser, Kutsche, Gaslaterne

**Für:** Erinnerung London, Strand (R104). Die alten Häuser sind zu hoch gestreckt (Tür doppelt so
hoch wie die Figur), Kutsche und Laternen sind flach.
**Datei:** `ki-roh/london_haeuser.jpg` und `ki-roh/london_strasse.jpg`.
**Ziel:** Häuser je 96 × 144 Pixel; Kutsche 96 × 48; Laterne 16 × 48.

```
OBJECTS: five Victorian London shop houses of 1851 in one row, each 6 tiles wide and 9 tiles tall (96x144 pixels), same scale. Each house: at the top the slate roof seen from above with a ridge, chimney pots and a darker far side; below it a narrow three-storey front of sooty brick with sash windows; at the bottom a shop front with a door. IMPORTANT SCALE: the shop door is only 1 tile wide and 2 tiles tall (16x32 pixels), a person is exactly as tall as the door.
1. Bookshop: dark red shop front, books in the window. 2. Tailor: green shop front, a dress form in the window. 3. Coffee house: bow window with warm light, a blank hanging sign. 4. Chess divan: black-and-gold shop front, a chessboard pattern on the blank sign, gas lamps beside the door. 5. Pub: dark timber front, a barrel beside the door.
No letters on any sign.
```

Zweites Blatt, gleicher Kopf und gleiches Bild:

```
OBJECTS, three objects with plenty of space between them, same scale:
1. A London hansom cab of 1851 with its horse, seen from the side and slightly from above, facing RIGHT: 6 tiles long and 3 tiles tall (96x48 pixels). Black two-wheeled cab with a folding hood whose top we see from above, the driver's high seat at the back (no driver), one brown horse in harness in front.
2. The same cab and horse facing LEFT.
3. A Victorian cast-iron gas street lamp: 1 tile wide and 3 tiles tall (16x48 pixels). Fluted black post on a square base, a four-sided glass lantern with a warm yellow flame, a small ladder bar under the lantern. The base is seen slightly from above.
```

---

## 4. Fußgängerbrücke und Sperre

**Für:** Kanalweg (R123), Lockport (R133). Von oben gesehen, ohne Bogenseite.
**Datei:** `ki-roh/fussgaengerbruecke.jpg`. **Ziel:** 48 × 96, 96 × 48, 32 × 32 Pixel.

```
OBJECTS, three objects with plenty of space between them, same scale. We look straight down onto the bridges from above (camera above, tilted only slightly): we see the walkway and both railings, NOT the arches and NOT the side of the bridge.
1. A narrow iron footbridge over a canal, running from TOP to BOTTOM: 3 tiles wide and 6 tiles long (48x96 pixels). Walkway of worn wooden planks laid crosswise, a black iron railing with posts on the left and on the right, stone abutments with two steps at the top end and at the bottom end.
2. The same footbridge running from LEFT to RIGHT: 6 tiles wide and 3 tiles tall (96x48 pixels); the far railing is seen above the walkway, the near railing below it.
3. A road barrier: a red-and-white striped wooden trestle with a blank round red sign on a post (no letters), 2 tiles wide and 2 tiles tall (32x32 pixels), seen from the front and slightly from above.
```

---

## 5. Kegelbahn

**Für:** Gasthaus zur Schleuse, Lockport (R148 bis R150).
**Datei:** `ki-roh/kegelbahn.jpg`. **Ziel:** 96 × 32, 32 × 48, 32 × 48, 16 × 16 Pixel.

```
OBJECTS for an old German nine-pin bowling alley in a village inn, with plenty of space between them, same scale, each seen from the front and slightly from above so that the top surface is visible:
1. A piece of the lane, running from LEFT to RIGHT, 6 tiles long and 2 tiles tall (96x32 pixels): polished narrow wooden lane seen from above with a raised wooden side board (gutter wall) along the top edge and along the bottom edge; the boards have visible thickness. The piece must be repeatable left to right.
2. The pin end: a padded leather back wall (ball stop) in a wooden frame, 2 tiles wide and 3 tiles tall (32x48 pixels), with a pit in front of it, seen from above and from the front.
3. A wooden rack with nine spare pins on two shelves and three bowling balls on the bottom shelf, 2 tiles wide and 3 tiles tall (32x48 pixels), with a visible top surface.
4. Nine wooden pins standing in a diamond formation seen from above and slightly from the front, inside 1 tile (16x16 pixels) drawn twice as large (2x2 tiles, 32x32 pixels).
```

---

## 6. Schach-Graffiti und schwimmende Ente

**Für:** Mauer am Kanalweg (R116, R117); Enten im Kanal (R126).
**Datei:** `ki-roh/graffiti_enten.jpg`. **Ziel:** Graffiti je 32 × 32 Pixel, Enten je 16 × 16.

```
OBJECTS in two rows, plenty of space between them.
Row 1: six pieces of spray-paint graffiti for a brick wall, each inside 2x2 tiles (32x32 pixels), flat (they are paint on a wall): a chess king, queen, rook, bishop, knight and pawn, each as a bold stencil-style silhouette filled with one bright colour (white, yellow, turquoise, orange, lime green, pink) with a darker spray outline, a few paint drips at the bottom and a soft speckled spray edge. No letters.
Row 2: four ducks swimming, each inside 1 tile (16x16 pixels) drawn at the same scale as row 1: we see only the body above the water line, no feet, with two small white ripple lines at the water line. 1. brown female duck facing RIGHT, 2. mallard drake with green head facing RIGHT, 3. the female facing LEFT, 4. the drake facing LEFT.
```
