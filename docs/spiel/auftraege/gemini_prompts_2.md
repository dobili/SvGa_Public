# Prompts für Gemini, Teil 2: Brücke, Tiere, Fahrzeuge

Stand: 10.11.2026 (Haupt-Chat). Zweite Sammlung aus den Gutachten und der Fahrzeugsichtung von
mittel-2. Teil 1 (`gemini_prompts.md`, 14 Bilder) ist erledigt und eingebaut.

## So geht es (wie bei Teil 1)

1. Je Prompt ein **neuer** Gemini-Chat. Der gemeinsame Kopf unten gehört vor **jeden** Prompt.
2. Vor dem Hochladen prüfen:
   - gerade Ansicht, nicht über Eck;
   - harte, gleich große Pixel;
   - Magenta als Hintergrund;
   - keine Schrift.
3. Hochladen ins private Repository unter `ki-roh/<Dateiname>` (JPEG ist in Ordnung). Mehrere
   Fassungen gern als `_v2`, `_v3`.
4. Dem Haupt-Chat Bescheid sagen. Er macht Spielbilder daraus und verteilt sie.

## Gemeinsamer Kopf (vor jeden Prompt kopieren)

```
Pixel art game sprite sheet for a top-down RPG.

VIEW: straight front-facing top-down view like classic 16-bit RPG town maps (camera looks down at about 45 degrees: we see the top of objects and a little of their front side). NOT isometric, NOT rotated, NOT diagonal.

PIXEL STYLE: chunky pixel art on a 16x16 pixel tile grid, enlarged so that every sprite pixel is an exactly square block of 10x10 screen pixels on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur. 1-pixel dark slate outline (#3A3A50). 2-3 flat shades per color, light from the top left. Simple, readable shapes. A person in this game is 1 tile wide and 2 tiles tall.

BACKGROUND: solid flat magenta (#FF00FF) everywhere. No shadow, no ground, no road, no text, no letters, no frame. Plenty of magenta space between objects.
```

---

## 1. Steinbrücke für Riverton

**Für:** Riverton außen, Straßenbrücke über den Ashford River (Wunsch mittel-3).
**Datei:** `ki-roh/steinbruecke.jpg`. **Ziel:** 5 Kacheln breit, 7 Kacheln lang (80 × 112 Pixel).

```
OBJECT: an old stone road bridge over a river, running from TOP to BOTTOM of the picture (north-south), 5 tiles wide and 7 tiles long (80x112 pixels). We look down on the deck: a grey asphalt roadway 3 tiles wide in the middle, with a low stone parapet wall and a narrow pavement on the left and on the right. The roadway must end flush and straight at the top edge and at the bottom edge, so that a road can connect there. On the RIGHT side of the bridge, below the parapet, we see the side of the bridge: two round stone arches and one stone pillar between them standing in the water, drawn as a dark strip about 1 tile wide with the arch openings dark. Grey-brown weathered stone blocks. Do NOT draw the water.
```

---

## 2. Pferd

**Für:** Pferdekoppel auf der Hochebene (dort steht bisher ein Esel) und andere Koppeln.
**Datei:** `ki-roh/pferd.jpg`. **Ziel:** je 32 × 32 Pixel.

```
OBJECTS: one brown horse with a black mane and tail, shown in four poses in one row, each inside a 2x2 tile box (32x32 pixels), all at the same scale: 1. seen from the front (walking toward the viewer), 2. side view facing RIGHT, standing, 3. seen from behind, 4. side view facing right with the head down, grazing. No saddle, no rider.
Second row, same four poses: a white-grey horse with a dark mane.
```

---

## 3. Fuchs und Kojote

**Für:** Steinbruch (Fuchs), Felsnase und Wüste (Kojote). Bisher steht ein Hund dafür.
**Datei:** `ki-roh/fuchs_kojote.jpg`. **Ziel:** je 32 × 32 Pixel.

```
OBJECTS, two rows of four poses, each inside a 2x2 tile box (32x32 pixels), all at the same scale. The animals are small: about 1 tile tall and 1.5 tiles long.
Row 1: a red fox with a white tail tip and black legs: 1. seen from the front, 2. side view facing RIGHT, standing, 3. seen from behind (bushy tail), 4. side view facing right, sitting.
Row 2: a coyote, sandy grey-brown, leaner and with longer legs than the fox, same four poses.
```

---

## 4. Lastwagen von vorn und von hinten

**Für:** Raststätte, Bergstraße, Ironwood, Hafen. Regel 10.64: Lastwagen 9–11 × 3 Kacheln; von
vorn oder hinten sieht man ihn 3 Kacheln breit und etwa 9 Kacheln lang von oben.
**Datei:** `ki-roh/lastwagen.jpg`. **Ziel:** je 48 × 144 Pixel.

```
OBJECTS: a box truck (delivery lorry with a white cargo box and a red cab), drawn standing on a road that runs from top to bottom, so the truck is a tall narrow shape: 3 tiles wide and 9 tiles long (48x144 pixels). We look down on it from above and slightly from one end.
1. LEFT: driving DOWN toward the viewer: the cab is at the bottom, we see the windscreen, headlights and bumper as a strip at the bottom, the roof of the cab above it and the long white roof of the cargo box above that.
2. RIGHT: driving UP away from the viewer: the cab is at the top (only its roof visible), the long white box roof below, and at the bottom the rear doors of the box with tail lights and bumper.
Both the same size and color.
```

---

## 5. Sattelzug von vorn, von hinten und nach links

**Für:** Diner (Fernfahrerplatz), Raststätte. Regel 10.64: 10 × 4 Kacheln.
**Datei:** `ki-roh/sattelzug.jpg`. **Ziel:** 48 × 160 Pixel (vorn, hinten) und 160 × 64 Pixel (links).

```
OBJECTS: an American semi-trailer truck: a blue tractor cab with chrome exhaust stacks pulling a long silver box trailer.
1. Driving DOWN toward the viewer, seen from above and slightly from the front: 3 tiles wide, 10 tiles long (48x160 pixels). Cab at the bottom with windscreen, grille and headlights; long silver trailer roof above.
2. Driving UP away from the viewer: same size. Cab roof at the top, trailer roof, and at the bottom the trailer's rear doors with tail lights.
3. Side view facing LEFT, seen from above and slightly from the side: 10 tiles long and 4 tiles tall (160x64 pixels). We see the roof of cab and trailer on top and the left side with the wheels below.
All three the same truck and the same scale.
```

---

## 6. Lieferwagen in vier Ansichten

**Für:** Deich (Messwagen), Städte, Lieferfahrer. Regel 10.64: 5–6 × 2,5 Kacheln.
**Datei:** `ki-roh/lieferwagen.jpg`.
**Ziel:** 96 × 48 Pixel (Seite), 48 × 96 Pixel (vorn, hinten).

```
OBJECTS: a white delivery van (panel van, no side windows in the cargo area, sliding door), four views at the same scale:
1. Side view facing RIGHT, seen from above and slightly from the side: 6 tiles long, 3 tiles tall (96x48 pixels): roof on top, right side with wheels below.
2. Side view facing LEFT, the mirror image.
3. Driving DOWN toward the viewer, seen from above: 3 tiles wide, 6 tiles long (48x96 pixels): windscreen, headlights and bumper at the bottom, long white roof above.
4. Driving UP away from the viewer: same size: roof, and at the bottom the two rear doors with tail lights.
```

---

## 7. Imbisswagen von vorn und von hinten

**Für:** Seeufer, Capital Arena, Jahrmarkt. Größe wie ein Lieferwagen.
**Datei:** `ki-roh/imbisswagen.jpg`. **Ziel:** je 48 × 96 Pixel.

```
OBJECTS: food trucks standing lengthwise from top to bottom, 3 tiles wide and 6 tiles long (48x96 pixels), seen from above and slightly from one end:
1. A red-and-white striped hot dog truck seen from the front (cab at the bottom: windscreen, headlights), a small striped awning sticking out on its right side.
2. The same truck seen from behind (rear door at the bottom, awning on its left side now).
3. A pastel blue-and-white ice cream truck seen from the front, a big ice cream cone figure on the roof.
4. The same ice cream truck seen from behind.
No letters on any sign.
```

---

## 8. Planwagen und Droschke von vorn und von hinten

**Für:** Ghost Town (Planwagen), London 1851 (Droschke). Ohne Pferde, die stehen extra.
**Datei:** `ki-roh/wagen_alt.jpg`. **Ziel:** je 48 × 80 Pixel.

```
OBJECTS: old horse-drawn vehicles WITHOUT horses, standing lengthwise from top to bottom, 3 tiles wide and 5 tiles long (48x80 pixels), seen from above and slightly from one end:
1. A covered pioneer wagon (prairie schooner) with a round white canvas top and big wooden wheels, seen from the front: the driver's bench and the wooden shaft (drawbar) pointing down at the bottom.
2. The same covered wagon seen from behind: the round canvas opening and tailgate at the bottom.
3. A black London hansom cab of 1851 with two large wheels and a folding hood, seen from the front: the shafts pointing down at the bottom.
4. The same cab seen from behind: the driver's high seat at the back.
```

---

## 9. Bagger von der Seite

**Für:** Steinbruch-Grube, Baustelle Port Delacroix.
**Datei:** `ki-roh/bagger.jpg`. **Ziel:** 112 × 64 Pixel.

```
OBJECT: a yellow tracked excavator (digger) seen from the side and slightly from above, facing RIGHT: crawler tracks, a rotating cab with a window, a two-part boom arm bent over to the right with a toothed bucket resting on the ground. 7 tiles long and 4 tiles tall (112x64 pixels). Slightly worn and dusty.
Next to it, the same excavator facing LEFT (mirror image).
```
