# Prompts für Gemini: fehlende Bilder

Stand: 10.11.2026 (Haupt-Chat). Für Dinge, die es in keinem Paket gibt (aus den Gutachten der
Runden 8 und 9). Der Autor erzeugt die Bilder mit Gemini. Das Werkzeug `werkzeuge/ki_bild.py` im
privaten Repository macht daraus Spielbilder: Es stellt frei, trennt die Fassungen und rechnet auf
die Zielgröße.

## So geht es

1. **Je Prompt ein neuer Gemini-Chat.** Nicht im selben Chat nachschieben, sonst bleibt Gemini am
   alten Bild hängen. Klappt etwas nicht, den Prompt in einem neuen Chat wiederholen und die
   betroffene Zeile verstärken (etwa „MUST be …“).
2. **Prüfen, bevor du hochlädst:**
   - gerade Ansicht von oben, nicht über Eck;
   - harte, gleich große Pixel;
   - Magenta als Hintergrund;
   - keine Schrift.
3. **Hochladen** ins private Repository unter `ki-roh/<Dateiname>` (GitHub → „Add file“ → „Upload
   files“, den Ordner vorn in den Namen schreiben). Der Dateiname steht über jedem Prompt.
4. **Aufbereiten:** Der Haupt-Chat bereitet das Bild auf und gibt es dem Helfer, der die Karte baut.
   Danach prüft der Gutachter.

Allen Prompts gemeinsam: Ansicht wie in klassischen 16-Bit-Rollenspielen, gerade von vorn-oben.
Eine Kachel hat 16 Pixel, eine Figur ist 2 Kacheln hoch. Gemini soll jeden Pixel als Block von
10 × 10 Bildpunkten zeichnen.

---

## 1. Lieferroboter von Perfect Move

**Für:** Silicon Bay Altstadt und Glasbrücke. Der Gutachter vermisst ihn zweimal.
**Datei:** `ki-roh/lieferroboter.png`. **Ziel:** 1 × 1 Kachel je Ansicht.

```
Pixel art game sprite sheet for a top-down RPG.

VIEW: straight front-facing top-down view like classic 16-bit RPG town maps. NOT isometric, NOT rotated. We see the top of the object and a little of its front side.

PIXEL STYLE: chunky pixel art for a 16x16 pixel sprite, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur. 1-pixel dark slate outline (#3A3A50). 2-3 flat shades per color, light from the top left. Simple, readable shapes.

BACKGROUND: solid flat magenta (#FF00FF). No shadow, no ground, no text, no frame.

OBJECT: a small six-wheeled sidewalk delivery robot of a tech company, about knee-high, like a cooler box on wheels. White body, royal-blue lid (#1E3C8C) with a small white knight chess piece logo on top, a short antenna with an orange flag, two small round camera eyes at the front, six small dark wheels.

Show three views side by side with plenty of magenta space between them, same size and style:
1. facing down (front toward the viewer),
2. facing right (side view),
3. facing up (back toward the viewer).
```

---

## 2. Hölzerne Fußgängerbrücke über einen Bach

**Für:** Park Maple Falls, Zedernwald und Flussweg. Der Gutachter vermisst die Holzbrücke mehrfach.
**Datei:** `ki-roh/holzbruecke.png`. **Ziel:** 3 Kacheln breit, 5 Kacheln lang.

```
Pixel art game sprite sheet for a top-down RPG.

VIEW: straight front-facing top-down view like classic 16-bit RPG maps. NOT isometric, NOT rotated. All edges horizontal or vertical.

PIXEL STYLE: chunky pixel art, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur. 1-pixel dark brown outline. 2-3 flat shades per color, light from the top left.

BACKGROUND: solid flat magenta (#FF00FF) around the bridge. Do NOT draw water or grass; the game draws those. No text.

OBJECT: a small wooden footbridge for a park, about 3 tiles wide (48 pixels) and 5 tiles long (80 pixels), crossing a stream. Plank deck with planks running across, a wooden handrail with posts on both long sides, the deck slightly raised in the middle (a gentle arch), a darker shadow strip under the deck at both ends where it meets the bank.

Show two versions side by side with plenty of magenta space:
1. LEFT: running from top to bottom (the deck is a vertical strip, handrails on the left and right).
2. RIGHT: running from left to right (the deck is a horizontal strip, handrails at top and bottom; the top handrail is seen from above, the bottom handrail shows its front side).
```

---

## 3. Eisenbrücke mit sichtbarer Höhe

**Für:** Weg Riverton–Ironwood 2 (Eisenbrücke). Laut Gutachten liegt die Brücke flach.
**Datei:** `ki-roh/eisenbruecke_hoch.png`. **Ziel:** etwa 12 × 5 Kacheln.

```
Pixel art game sprite for a top-down RPG.

VIEW: straight front-facing top-down view like classic 16-bit RPG maps, NOT isometric, NOT rotated. We look down on the bridge deck from above and slightly from the front, so we see the deck from above and the front face of the bridge below it.

PIXEL STYLE: chunky pixel art, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients. 1-pixel dark slate outline (#3A3A50). 2-3 flat shades per color, light from the top left.

BACKGROUND: solid flat magenta (#FF00FF). No water, no ground, no text.

OBJECT: an old riveted iron railway-and-footpath bridge from 1890, running from left to right, about 12 tiles long (192 pixels). Rust-red steel truss sides (a row of X-shaped girders) along the top and bottom edges of the deck; the deck between them is grey wooden planks with a narrow track of two rails in the middle. Below the front truss, the bridge clearly stands HIGH above the ground: we see the dark underside of the deck and two stone pillars going down, about 2 tiles tall, with a dark shadow below. At both ends a stone abutment (grey blocks) where the bridge meets the bank.
```

---

## 4. Großes Fernrohr für die Sternwarte (Kuppel innen)

**Für:** Sternwarte Kuppel. Laut Gutachten fehlt die Kuppel innen.
**Datei:** `ki-roh/fernrohr.png`. **Ziel:** etwa 3 × 4 Kacheln.

```
Pixel art game sprite for a top-down RPG interior.

VIEW: straight front-facing top-down view like classic 16-bit RPG interiors, NOT isometric, NOT rotated. We see objects from above and a little of their front.

PIXEL STYLE: chunky pixel art, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients. 1-pixel dark slate outline (#3A3A50). 2-3 flat shades per color, light from the top left.

BACKGROUND: solid flat magenta (#FF00FF). No floor, no walls, no text.

OBJECTS, side by side with plenty of magenta space:
1. A large old brass refracting telescope on a heavy dark-green cast-iron pier (column) with a round base, the long brass tube pointing up and to the upper left, a small eyepiece and a finder scope. About 3 tiles wide and 4 tiles tall (48x64 pixels).
2. A small wooden observer's chair with a tall adjustable back, 1 tile wide and 2 tiles tall.
3. A wooden desk with an open star atlas, a brass lamp and a few rolled star charts, 2 tiles wide and 2 tiles tall.
```

---

## 5. Gusseiserner Ofen

**Für:** Gasthaus Lockport. Laut Gutachten ist der Ofen in der Wand nicht erkennbar.
**Datei:** `ki-roh/ofen_gusseisen.png`. **Ziel:** 1 × 2 und 2 × 2 Kacheln.

```
Pixel art game sprite sheet for a top-down RPG interior.

VIEW: straight front-facing top-down view like classic 16-bit RPG interiors, NOT isometric, NOT rotated.

PIXEL STYLE: chunky pixel art, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients. 1-pixel dark outline. 2-3 flat shades per color, light from the top left.

BACKGROUND: solid flat magenta (#FF00FF). No floor, no wall, no text.

OBJECTS, side by side with plenty of magenta space:
1. A round black cast-iron pot-belly stove standing free on four small feet, a small glowing orange fire window in the front, a black stove pipe going straight up. 1 tile wide and 2 tiles tall (16x32 pixels).
2. A wide black cast-iron kitchen range for an old inn: flat cooktop with two round lids and a copper kettle on it, two oven doors in front, a short pipe at the back. 2 tiles wide and 2 tiles tall (32x32 pixels).
```

---

## 6. Tür zum Sturmkeller

**Für:** Prärie (Weg Summit–Crossroads). Rote Scheune mit Sturmkeller laut Beschreibung.
**Datei:** `ki-roh/sturmkeller.png`. **Ziel:** 2 × 2 Kacheln.

```
Pixel art game sprite sheet for a top-down RPG.

VIEW: straight front-facing top-down view like classic 16-bit RPG maps, NOT isometric, NOT rotated.

PIXEL STYLE: chunky pixel art, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients. 1-pixel dark outline. 2-3 flat shades per color, light from the top left.

BACKGROUND: solid flat magenta (#FF00FF). No grass, no ground, no text.

OBJECT: a storm cellar entrance on an American prairie farm: two slanted weathered wooden doors lying almost flat in a low concrete frame on the ground, with iron hinges and a heavy iron handle. About 2 tiles wide and 2 tiles deep (32x32 pixels).

Show two versions side by side with plenty of magenta space:
1. closed;
2. open: both doors folded outward to the sides, a dark opening with the top three concrete steps going down.
```

---

## 7. Londoner Häuserfronten von 1851

**Für:** Erinnerung London, Straße am Strand. Laut Gutachten flache Fronten ohne Tiefe. Die Sepia-Färbung
macht die App, darum normal bunt zeichnen.
**Datei:** `ki-roh/london_fronten.png`. **Ziel:** je etwa 6 Kacheln breit und 8 hoch.

```
Pixel art game sprite sheet for a top-down RPG town map.

VIEW: straight front-facing top-down view like classic 16-bit RPG town maps, NOT isometric, NOT rotated. Each building shows its roof from above (taking up the top part) and its front facade below it, so the buildings have depth.

PIXEL STYLE: chunky pixel art, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients. 1-pixel dark slate outline (#3A3A50). 2-3 flat shades per color, light from the top left.

BACKGROUND: solid flat magenta (#FF00FF). No street, no pavement, no text, no letters on any sign.

OBJECTS: five different narrow terraced shop houses of London in the year 1851, each about 6 tiles wide and 8 tiles tall (96x128 pixels), standing side by side with a small magenta gap between them. Dark grey slate roofs with chimneys, three storeys, sash windows, each with a ground-floor shop front with a large many-paned window and a door in the front facade:
1. a coffee house with a dark green shopfront and a hanging sign showing a coffee cup;
2. a bookshop with a dark red shopfront and books in the window;
3. a tailor with a dark blue shopfront and a bolt of cloth in the window;
4. a chess and gaming room with a brown wooden shopfront and a hanging sign showing a chess knight;
5. a narrow pub with a black shopfront, gas lamp beside the door and a barrel by the door.
Brick colors vary: yellow London stock brick, red brick, one stucco-white house.
```

---

## 8. Alte Fotografien für das Heimatmuseum Ironwood

**Für:** Ironwood Museum. Laut Gutachten sind die Bilder Kunstdrucke, das Brückenfoto ist eine graue Platte.
**Datei:** `ki-roh/museum_fotos.png`. **Ziel:** je 2 × 2 Kacheln.

```
Pixel art game sprite sheet for a top-down RPG interior, wall decorations.

VIEW: straight front view of pictures hanging flat on a wall, NOT isometric, NOT rotated.

PIXEL STYLE: chunky pixel art, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients. 1-pixel dark outline. Few flat shades.

BACKGROUND: solid flat magenta (#FF00FF). No wall, no text, no letters, no numbers.

OBJECTS: four framed old sepia photographs for a small town museum, each 2 tiles wide and 2 tiles tall (32x32 pixels), dark wooden frames, side by side with magenta space between them. Each photo is very simple and readable at small size:
1. an iron truss bridge over a river with a steam train on it;
2. a steelworks with three tall chimneys and smoke;
3. a small brick railway station with a clock;
4. a group of workers in caps standing in a row in front of a factory gate.
```

---

## 9. Postreiter (Figur, nur stehend)

**Für:** Erinnerung Siedlung. Die jetzige Figur wirkt wie ein Zwerg mit roter Mütze.
**Datei:** `ki-roh/postreiter.png`. **Ziel:** 16 × 32 Pixel je Ansicht.
**Hinweis:** Das ist ein Versuch. Figuren brauchen sonst Laufbilder; diese hier steht nur.

```
Pixel art character sprite sheet for a top-down RPG, standing poses only.

VIEW: classic 16-bit RPG character sprites, front-facing top-down style, NOT isometric.

PIXEL STYLE: chunky pixel art for a character 16 pixels wide and 32 pixels tall, with a slightly large head (cute proportions, the head is about a third of the height), enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients. 1-pixel dark outline. 2-3 flat shades per color.

BACKGROUND: solid flat magenta (#FF00FF). No shadow, no ground, no text.

CHARACTER: a Pony Express mail rider from about 1860: a young man with a wide-brimmed brown hat, a long dust-colored duster coat over a red shirt, a leather mail bag (mochila) over his shoulder, brown boots, a red neckerchief.

Show four standing poses side by side with magenta space between them, same size: facing down (toward the viewer), facing left, facing right, facing up (back to the viewer).
```

---

## 10. Umkleidebank ohne Lehne

**Für:** Ironwood Umkleide. Laut Gutachten stehen dort Parkbänke.
**Datei:** `ki-roh/umkleidebank.png`. **Ziel:** 3 × 1 Kachel.

```
Pixel art game sprite sheet for a top-down RPG interior.

VIEW: straight front-facing top-down view like classic 16-bit RPG interiors, NOT isometric, NOT rotated.

PIXEL STYLE: chunky pixel art, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients. 1-pixel dark outline. 2-3 flat shades per color, light from the top left.

BACKGROUND: solid flat magenta (#FF00FF). No floor, no text.

OBJECTS, side by side with plenty of magenta space:
1. A long locker-room bench WITHOUT backrest, horizontal: light wooden slats on a grey metal frame, 3 tiles long and 1 tile deep (48x16 pixels), seen from above with its thin front edge and two short legs visible.
2. The same bench vertical (rotated 90 degrees, 1 tile wide and 3 tiles long), seen from above.
3. A wall-mounted coat rack with a hanging work jacket and a hard hat, 2 tiles wide and 2 tiles tall (32x32 pixels), seen from the front.
```

---

## 11. Reh und Hirsch (niedrig-1)

**Für:** Zedernwald, Zedernpfad, Landstraße (L6). Die Gutachter sehen dort Ziegen; die Szenen nennen
Reh und Hirsch. **Datei:** `ki-roh/reh_hirsch.png`. **Ziel:** je Ansicht 2 × 2 Kacheln (32 × 32).

```
Pixel art game sprite sheet for a top-down RPG.

VIEW: straight front-facing top-down view like classic 16-bit RPG maps (we see the animal from slightly above, like the characters). NOT isometric, NOT rotated.

PIXEL STYLE: chunky pixel art for 32x32 pixel sprites, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur. 1-pixel dark brown outline (#3A2A20). 2-3 flat shades per color, light from the top left.

BACKGROUND: solid flat magenta (#FF00FF). No shadow, no ground, no text, no frame.

ANIMALS: a slender roe deer doe (reddish-brown summer coat, white rump patch, large ears, no antlers, thin legs) and a red deer stag (darker brown, light neck mane, antlers with several points). Both clearly deer, NOT goats, NOT sheep: long thin legs, long neck, small head.

Show for EACH animal four views in one row, plenty of magenta space between them, same size and style:
1. facing down (toward the viewer),
2. facing right (side view, walking),
3. facing up (away from the viewer),
4. facing right, head lowered grazing.
Row 1: the doe. Row 2: the stag.
```

---

## 12. Holzhäuser von hinten für die Südseite einer Straße (niedrig-1)

**Für:** Maple Falls (Birch Lane), Cedar Creek, Lockport. Ein Haus südlich einer West-Ost-Straße zeigt
in unserer Ansicht seine Rückseite. Die Bilder des Pakets haben die Haustür immer vorn. Deshalb
kehren die Häuser der Straße den Rücken zu (Gutachten Runde 8, dreimal). **Datei:**
`ki-roh/haus_rueckseite.png`. **Ziel:** 6 × 6 Kacheln (96 × 96).

```
Pixel art game sprite sheet for a top-down RPG, small-town America, wooden family houses.

VIEW: straight front-facing top-down view like classic 16-bit RPG town maps (Pokemon-like): we see the roof from above and one wall from the front. NOT isometric, NOT rotated.

PIXEL STYLE: chunky pixel art, every sprite pixel an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur. 1-pixel dark slate outline (#3A3A50). 2-3 flat shades per color, light from the top left.

BACKGROUND: solid flat magenta (#FF00FF). No ground, no text, no frame.

OBJECT: a one-and-a-half-storey wooden clapboard family house, about 6 tiles wide and 6 tiles tall including the roof (96x96 pixels). IMPORTANT: the street is BEHIND the house (at the top of the picture). So:
- the wall facing the viewer is the BACK of the house: two windows, a small plain back door with two steps, a garden tap, NO front door, NO porch on this side;
- at the TOP edge, above the roof ridge, a small covered front porch with a white railing and the top of a mailbox stick out, so it is clear the front door faces the street at the top.

Show three colour variants side by side with plenty of magenta space: light blue walls with a grey roof, cream walls with a red roof, sage green walls with a brown roof.
```

---

## 13. Bank von hinten (niedrig-1)

**Für:** Bahnsteig am Bahndamm, Park Maple Falls, Bahnsteig Cedar Creek. Wartende sollen zum Gleis
oder zum Fluss schauen, der nördlich von ihnen liegt. Dann sieht man die Bank von hinten (Gutachten
Runde 8). **Datei:** `ki-roh/bank_hinten.png`. **Ziel:** 3 × 2 Kacheln (48 × 32).

```
Pixel art game sprite sheet for a top-down RPG.

VIEW: straight front-facing top-down view like classic 16-bit RPG maps. NOT isometric, NOT rotated.

PIXEL STYLE: chunky pixel art, every sprite pixel an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur. 1-pixel dark slate outline (#3A3A50). 2-3 flat shades per color, light from the top left.

BACKGROUND: solid flat magenta (#FF00FF). No shadow, no ground, no text.

OBJECTS, side by side with plenty of magenta space, 3 tiles wide and 2 tiles tall each (48x32 pixels):
1. A green wooden park bench with cast-iron legs seen FROM BEHIND: in front we see the BACKREST from its back side (vertical slats and the iron frame), behind it the top of the seat. Someone sitting on it would look away from the viewer, toward the top of the picture.
2. The same bench in dark brown wood.
3. A railway platform bench of three joined green plastic seats on a metal beam, seen from behind (the backs of the three seats in front).
```
