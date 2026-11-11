# Prompts für Gemini, Teil 3: Kutter, Bus, Gleise, Kleinteile

Stand: 11.11.2026 (Haupt-Chat). Dritte Sammlung aus den Gutachten. Teil 1 und Teil 2 sind erledigt
und eingebaut.

## So geht es (wie bisher)

1. Je Prompt ein **neuer** Gemini-Chat. Der gemeinsame Kopf unten gehört vor **jeden** Prompt.
2. Vor dem Hochladen prüfen:
   - gerade Ansicht, nicht über Eck;
   - harte, gleich große Pixel;
   - Magenta als Hintergrund, **kein Raster und keine Hilfslinien**;
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

## 1. Fischkutter

**Für:** alter Hafen Silicon Bay (statt des Ruderboots), Lockport, Port Delacroix.
**Datei:** `ki-roh/kutter.jpg`. **Ziel:** 160 × 64 Pixel (Seite), 48 × 144 Pixel (längs).

```
OBJECTS: an old wooden fishing trawler (small fishing cutter), dark green hull with a red waterline stripe, white wheelhouse near the stern, a mast with a boom, nets and fish crates on the deck, a few orange buoys. No water, no waves.
1. Seen from above and slightly from the side, bow pointing LEFT: 10 tiles long and 4 tiles tall (160x64 pixels). We see the deck from above and the near side of the hull below it.
2. The mirror image, bow pointing RIGHT.
3. Lying lengthwise from top to bottom, bow pointing UP, seen from above: 3 tiles wide and 9 tiles long (48x144 pixels): deck, wheelhouse roof, mast.
All three the same boat and the same scale.
```

---

## 2. Bus von vorn und von hinten

**Für:** Werksbus Ironwood, Stadtbusse. Regel 10.64: Bus 3 × 8 Kacheln. Der vorhandene ist zu kurz.
**Datei:** `ki-roh/bus.jpg`. **Ziel:** je 48 × 128 Pixel.

```
OBJECTS: city buses standing on a road that runs from top to bottom, each a tall narrow shape 3 tiles wide and 8 tiles long (48x128 pixels), seen from above and slightly from one end:
1. A grey-blue works bus driving DOWN toward the viewer: windscreen, destination box without letters, headlights and bumper as a strip at the bottom; long roof with two roof hatches and an air-conditioning box above.
2. The same grey-blue bus driving UP away from the viewer: long roof, and at the bottom the rear window, tail lights and bumper.
3. A yellow American school bus driving DOWN toward the viewer, same layout, with the typical bonnet (hood) at the bottom.
4. The same yellow school bus driving UP away from the viewer, with the rear emergency door at the bottom.
All four the same scale. No letters.
```

---

## 3. Gleisbogen und Weiche für die Feldbahn

**Für:** Goldmine (Stollen), Steinbruch. Schmale Lorengleise, bisher nur gerade Stücke.
**Datei:** `ki-roh/gleis_teile.jpg`. **Ziel:** je 32 × 32 Pixel.

```
OBJECTS: pieces of a narrow-gauge mine railway track seen exactly from above, each piece inside a 2x2 tile box (32x32 pixels), all at the same scale and with the same look: two thin rusty steel rails on short dark wooden sleepers, a little gravel between the sleepers. The rails are 1 tile apart. Each piece must start and end exactly in the middle of a box edge so that pieces connect.
Row 1: 1. straight track running left to right, 2. straight track running top to bottom, 3. a 90-degree curve from the LEFT edge to the BOTTOM edge, 4. a 90-degree curve from the RIGHT edge to the BOTTOM edge.
Row 2: 5. a 90-degree curve from the LEFT edge to the TOP edge, 6. a 90-degree curve from the RIGHT edge to the TOP edge, 7. a switch (turnout): straight track left to right with a branch curving off to the BOTTOM edge, with a small switch lever beside it, 8. the same switch with the branch curving off to the TOP edge.
```

---

## 4. Kleinteile für Western und Hafen

**Für:** Ghost Town (Anbindebalken, Tränke), Kantine Ironwood (Kasse, Speiseplan), Hafen.
**Datei:** `ki-roh/kleinteile.jpg`.
**Ziel:** siehe Liste, alle im selben Maßstab.

```
OBJECTS, in one row, all at the same scale, each seen from the front and slightly from above:
1. A wooden hitching rail for horses (two posts and a horizontal beam, a rope tied around it): 3 tiles wide, 1 tile tall (48x16 pixels).
2. A wooden horse water trough filled with water: 2 tiles wide, 1 tile tall (32x16 pixels).
3. A canteen cash desk: a steel counter with an old cash register and a tray rail: 2 tiles wide, 2 tiles tall (32x32 pixels).
4. A wall menu board for a factory canteen: black board with three rows of small white dashes instead of text and three small food pictures: 2 tiles wide, 1 tile tall (32x16 pixels).
5. A stack of lobster pots (crab traps) with a coil of rope: 2 tiles wide, 2 tiles tall (32x32 pixels).
6. A harbour bollard (cast iron mooring post) with a thick rope around it: 1 tile wide, 1 tile tall (16x16 pixels).
No letters anywhere.
```
