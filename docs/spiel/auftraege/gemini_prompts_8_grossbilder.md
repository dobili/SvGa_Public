# Gemini-Prompts 8: Großbilder und Fundbilder

Stand 13.11.2026 (mittel-3, Auftrag des Hauptchats). Alle Bilder, die das Spiel als Großansicht zeigt
(`#bild:kennung` in den Ink-Dateien, Atmosphäre T7) und die Fundbilder, für die es noch keine Datei
gibt (Fensterbank T15). Je Bild ein neuer Chat, die Stilvorlage beilegen (`ki-roh/stilvorlage.png`
im privaten Repository, dieselbe wie in Gemini-Prompts 7). Anders als dort sind es Einzelbilder,
keine Sprite-Blätter: kein Magenta, das Motiv füllt das ganze Bild, der Bildausschnitt ist wie eine
Buchillustration in Pixelkunst.

**Ablage:** `bilder/<datei>.webp` im Zusatzpaket (Gruppe grafik). Großbilder höchstens 1024 px breit
(Ziel 1024 × 768, intern 256 × 192, Faktor 4, nächster Nachbar beim Vergrößern). Fundbilder 512 × 512
(intern 128 × 128).

**Text im Bild:** Pixeltext gerät bei Gemini fast immer unsauber. Deshalb enthält kein Bild Schrift;
wo das Motiv Text trägt (Zeitung 1858, Schilder, Briefe, Tagebuch), bleibt die Fläche leer, und das
Spiel legt den deutschen Text darüber. Das ist bei jedem Bild unter „Text“ vermerkt.

**Befund an den Hauptchat (Technik):** `dialog/grossbild.ts` erlaubt in Kennungen nur Buchstaben,
Ziffern und Bindestrich. Viele Ink-Marken verwenden Unterstriche (`#bild:blaues_heft`,
`#bild:schild_darlene` usw.); für sie zeigt das Spiel derzeit kein Bild. Vorschlag: im Regex den
Unterstrich zulassen und ihn wie camelCase in einen Bindestrich umsetzen. Die Dateinamen unten sind
schon so gebildet (`blaues_heft` → `bilder/blaues-heft.webp`).

**Fundbilder:** `funde.json` hat noch kein Feld `bild`. Vorschlag: `"bild": "bilder/fund-<kebab>.webp"`
je Fund; die Dateinamen unten folgen dem.

**Reihenfolge:** Akt 1 zuerst (Vertikalschnitt), dann Akt 2 bis 4, danach die Fundbilder in der
Reihenfolge von `funde.json`.

## Teil A: Großbilder

### Akt 1 (Vertikalschnitt)

#### A1. `zeitung1858`

**Zweck:** Die Zeitung „Crescent City Herald“ vom Oktober 1858 mit der Meldung Hale gegen Whitlock. **Szene:** Kap. 12, Archiv in Cedar Creek (cedar-creek-archiv, erzaehlung_1858).
**Datei:** `bilder/zeitung1858.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text im Bild: Zeitungskopf und Meldung („Mr. Hale, Ingenieur, schlägt Mr. Whitlock im Match, vier zu drei.“) legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a yellowed four-page newspaper from 1858 lying open on a wooden archive table under a green desk lamp, small columns of tiny grey lines suggesting text, one short paragraph area on the third page slightly highlighted by the lamp light, an advertisement box with a sailing ship next to it, dust in the light cone.
```

#### A2. `stellung1858`

**Zweck:** Die Stellung der siebten Partie von 1858 nach dem stillen Läuferzug. **Szene:** Kap. 12 Archiv (erzaehlung_1858_nein); Kap. 45 Garage in Desert Springs.
**Datei:** `bilder/stellung1858.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Keine Buchstaben oder Ziffern am Brettrand. Die genaue Stellung kann das Spiel als Brett darüberlegen; das Bild trägt die Stimmung.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: an old wooden chessboard seen from slightly above, a middlegame position with a white rook placed boldly in the middle of the black position and a black bishop that has just stepped back one square, candlelight from the left, a dark wood table edge at the bottom.
```

#### A3. `erinnerungNewYork`

**Zweck:** Programmheft des ersten amerikanischen Schachkongresses New York 1857, Einstieg in die Erinnerung. **Szene:** Kap. 12, Archiv (erinnerung).
**Datei:** `bilder/erinnerung-new-york.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text: Titel des Programmhefts legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a thin yellowed program booklet from the 1850s with a simple engraved eagle on its cover, lying on top of a cardboard box in a dim archive, soft golden light, edges of the booklet worn and soft.
```

#### A4. `sternenhimmel`

**Zweck:** Der Himmel über den Zedern, als Mae das Teleskop aufbaut. **Szene:** Kap. 14, Sternennacht am Steg in Cedar Creek (sterne).
**Datei:** `bilder/sternenhimmel.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a night sky full of stars above the black silhouettes of tall cedar trees, a small wooden jetty and calm dark water in the lower third reflecting the stars, a tiny red lamp glowing on the jetty, a home-made telescope on a tripod, one bright shooting star crossing the sky.
```

#### A5. `fotoRiverton`

**Zweck:** Das Foto auf Junos Handy: Bildschirmtische im Park von Riverton, niemand sitzt daran. **Szene:** Kap. 16, Busfahrt zurück (ende_akt1).
**Datei:** `bilder/foto-riverton.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text: Die Bildunterschrift („Mit Perfect Move. Ist das nicht toll?“) legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a phone photo shown on a phone screen held in a child's hand inside a dim bus: a park pavilion where white screen tables stand in a neat row, all chairs empty, cold white light on the screens, green trees around.
```

### Akt 2

#### A6. `zettel_ironwood`

**Zweck:** Coach Delgados schief kopierter Zettel zum Freundschaftsturnier in Ironwood. **Szene:** Akt 2, Kap. 23, Wohnzimmer in Maple Falls (maple-falls-wohnzimmer).
**Datei:** `bilder/zettel-ironwood.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text: „Freundschaftsturnier beim Stahlwerker-Club Ironwood. Vier Bretter. Wir fahren!!!“ legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a crooked photocopied flyer lying on a kitchen table, a simple drawing of four chessboards and a factory chimney on it, slightly grey copy streaks, a coffee mug next to it, warm evening light.
```

#### A7. `nietenkopf_jh`

**Zweck:** Ein Nietenkopf am Brückenpfosten mit den Initialen J. H. **Szene:** Akt 2, Kap. 24, Kanalweg (weg-riverton-ironwood).
**Datei:** `bilder/nietenkopf-jh.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Initialen nicht malen lassen (Pixeltext wird unsauber); „J. H.“ legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: close-up of a large round iron rivet head at the foot of a black riveted bridge post, rust and old paint around it, two small letters stamped into the rivet are left as a smooth blank spot, canal water reflecting light below.
```

#### A8. `siegel_stellung`

**Zweck:** Ein Wachssiegel, in das kleine Figuren in einem Gitter gedrückt sind. **Szene:** Akt 2, Ironwood, Museum (ironwood-museum).
**Datei:** `bilder/siegel-stellung.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: close-up of a dark red wax seal on old paper, pressed into the wax a tiny eight by eight grid with miniature chess pieces in relief, museum glass reflection in one corner.
```

#### A9. `umschlag_hale`

**Zweck:** Hales Umschlag aus dickem, gelblichem Papier. **Szene:** Akt 2, Ironwood, Museum (ironwood-museum).
**Datei:** `bilder/umschlag-hale.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text: Hales senkrechte Schrift legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a thick yellowish envelope from the 1860s lying in a museum display case, the address area left blank, a broken wax seal on the back flap visible at the edge, soft display light.
```

#### A10. `foto2001`

**Zweck:** Das Foto von 2001: ein Mädchen mit den Händen in den Ärmeln über einem Brett. **Szene:** Akt 2, Ironwood, Mamas altes Zimmer (ironwood-mamas-zimmer).
**Datei:** `bilder/foto2001.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text: Die Bildunterschrift legt das Spiel darüber. Keine reale Person.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: an old framed photograph on a wall: a teenage girl with her hands pulled into her sweater sleeves sitting over a chessboard in a gym hall, other tables blurred behind her, slightly faded colours of an early-2000s photo.
```

#### A11. `blaues_heft`

**Zweck:** Mamas blaues Heft: jede Seite eine Partie, darunter drei Sätze. **Szene:** Akt 2, Ironwood (ironwood-mamas-zimmer); Maple Falls (maple-falls-wohnzimmer).
**Datei:** `bilder/blaues-heft.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Keine lesbare Schrift; einzelne Sätze legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a blue school notebook lying open on a desk, each page with a small hand-drawn chessboard diagram and a few short lines of handwriting suggested as grey strokes, a pencil beside it.
```

#### A12. `partieformular2001`

**Zweck:** Das Partieformular von 2001 unter Glas. **Szene:** Akt 2, Ironwood, Mamas Zimmer.
**Datei:** `bilder/partieformular2001.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Keine lesbaren Züge; das Spiel legt Text darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a chess score sheet with two columns of handwritten moves suggested as rounded grey strokes, framed under glass, a slight reflection across the glass.
```

#### A13. `heft_neuer_satz`

**Zweck:** Mama schreibt einen neuen Satz in das blaue Heft. **Szene:** Akt 2, Kap. 28, Kantine in Ironwood (ironwood-kantine).
**Datei:** `bilder/heft-neuer-satz.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein lesbarer Text; „Es passiert jedem. Auch mir.“ legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: close-up of a hand writing with a pen in a blue notebook on a canteen table, the page with an old heading line and one fresh line of ink, warm lights and blurred people celebrating in the background.
```

#### A14. `pokalluecke_2001`

**Zweck:** Die Lücke in der Pokalreihe mit dem Messingschildchen 2001. **Szene:** Akt 2, Kap. 28, Kantine in Ironwood.
**Datei:** `bilder/pokalluecke-2001.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Die Zahl 2001 legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a long shelf of shiny trophies in a steelworks canteen, one gap in the row as wide as a hand, a small brass plate under the gap left blank, dust around where a trophy once stood.
```

#### A15. `stahlbrett`

**Zweck:** Das Schachbrett aus Stahl mit dicken Schweißnähten. **Szene:** Akt 2, Kap. 28, Kantine in Ironwood.
**Datei:** `bilder/stahlbrett.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a chessboard made of steel plates on a canteen table, light squares polished bright, dark squares blued by heat, thick weld seams along the edge, a heavy steel king standing on it.
```

#### A16. `schild_werkstor`

**Zweck:** Das neue weiße Schild des Konzerns am alten Werkstor. **Szene:** Akt 2, Kap. 29, Werkstor in Ironwood (ironwood-aussen).
**Datei:** `bilder/schild-werkstor.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text auf dem Schild: „Perfect Move Trainingszentrum Ironwood. Eröffnung im Januar.“ legt das Spiel darüber. Kein echtes Firmenlogo.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a glossy new white sign mounted on an old rusty steelworks gate in snow, the sign clean and cold against the dark iron, factory chimneys behind.
```

#### A17. `einladung_silber`

**Zweck:** Victors Einladung, weiß mit silberner Schrift. **Szene:** Akt 2, Kap. 29, Werkstor (ironwood-aussen).
**Datei:** `bilder/einladung-silber.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text: Die silberne Schrift legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a white invitation card with a thin silver border held out by a hand in a white sleeve, snowy dark background, the card face blank and shiny.
```

### Akt 3

#### A18. `tagebuch_september`

**Zweck:** Eine Seite in Junos Tagebuch mit rosa Tinte und Sticker. **Szene:** Kap. 30, Haltestelle in Ironwood (ironwood-aussen).
**Datei:** `bilder/tagebuch-september.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein lesbarer Text; der Satz legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: an open diary page with pink ink lines suggested as strokes, a lost chess game sketched as a tiny board, a star sticker and a cat sticker, slightly crumpled paper.
```

#### A19. `reisebrett`

**Zweck:** Junos Reisebrett: kleine Holzkiste mit Stickern. **Szene:** Kap. 30, Haltestelle in Ironwood.
**Datei:** `bilder/reisebrett.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text auf dem Deckel: „Clubtagebuch, Außenstelle.“ legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a small wooden travel chess box with a hinged lid covered in colourful stickers (stars, a pink heart, a cat), slightly open so tiny magnetic chess pieces are visible inside, held in two mittened hands in snow.
```

#### A20. `tagebuch_silicon_bay`

**Zweck:** Junos Tagebucheintrag mit Glitzer-Fragezeichen. **Szene:** Kap. 30 (ironwood-aussen).
**Datei:** `bilder/tagebuch-silicon-bay.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein lesbarer Text; das Fragezeichen darf bleiben.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a diary page with one short line of pink ink and a big glittery question mark drawn after it, sparkles drawn as small pixel stars.
```

#### A21. `mira_damenopfer`

**Zweck:** Mira hält die weiße Dame einen Atemzug lang in der Luft. **Szene:** Kap. 41, Canyonpfad (weg-delacroix-desert).
**Datei:** `bilder/mira-damenopfer.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a small girl's hand holding a white chess queen in the air above a chessboard set on a flat red rock in a desert canyon, black pieces below, red striped canyon walls and a bright blue sky, a lizard on a nearby stone.
```

#### A22. `platte_1879`

**Zweck:** Die eingegossene Platte am Brückenpfeiler, Nieten mit J. H. **Szene:** Kap. 42, Canyonbrücke (weg-delacroix-desert).
**Datei:** `bilder/platte-1879.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Jahreszahl 1879 und „J. H.“ legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: an old riveted iron bridge pier in a red desert canyon, a small cast iron plate set into the pier, rows of rivets around it, evening sun.
```

#### A23. `ortsschild_211`

**Zweck:** Das Ortsschild von Desert Springs. **Szene:** Kap. 43, Ortseingang Desert Springs (desert-springs-aussen).
**Datei:** `bilder/ortsschild-211.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text: „Desert Springs. Einwohner: 211. Schachspieler: 211.“ legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a weathered wooden town sign at the edge of a small desert town, two lines of blank sign area, cacti and a water tower behind, hot bright light.
```

#### A24. `nadel_kaktus`

**Zweck:** Die Clubnadel: ein kleiner Kaktus aus Kupfer mit einer Blüte. **Szene:** Kap. 46, Garage in Desert Springs (desert-springs-garage).
**Datei:** `bilder/nadel-kaktus.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a tiny copper pin shaped like a cactus with a single pink blossom, lying on top of an old oil can in a garage, warm light through the open garage door.
```

#### A25. `dosenpokal`

**Zweck:** Ein Pokal aus einer aufgeschnittenen Limonadendose. **Szene:** Akt 3, Garage in Desert Springs.
**Datei:** `bilder/dosenpokal.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Markenname auf der Dose.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a home-made trophy cut and bent from a soda can, held together with wire, standing on a shelf above a workbench, shiny and a little crooked.
```

#### A26. `weltkarte_nadeln`

**Zweck:** Eine Weltkarte mit Nadeln, von jeder ein Faden zu einer Postkarte. **Szene:** Akt 3, Garage in Desert Springs.
**Datei:** `bilder/weltkarte-nadeln.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Keine Ortsnamen auf Karte und Postkarten.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a large world map pinned to a garage wall, coloured pins in it, from each pin a red thread runs to a postcard pinned around the map edges, tools hanging nearby.
```

#### A27. `postkarten_wasserfall`

**Zweck:** Ein Stapel Postkarten, oben ein Wasserfall. **Szene:** Akt 3, Garage in Desert Springs.
**Datei:** `bilder/postkarten-wasserfall.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text auf den Karten.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a stack of old postcards on a table, the top one showing a waterfall in autumn woods, reading glasses lying next to it.
```

#### A28. `briefbuendel`

**Zweck:** Briefe, gebündelt mit Schnur, jedes Bündel ein Jahr. **Szene:** Kap. 44, Antiquariat in Desert Springs (desert-springs-antiquariat).
**Datei:** `bilder/briefbuendel.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Jahreszahlen der Bündel legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: bundles of old yellowed letters tied with string lying in an open wooden crate in a dusty antique shop, a bare light bulb above.
```

#### A29. `hales_brief`

**Zweck:** Hales Brief, zwölf senkrechte Zeilen. **Szene:** Kap. 44, Antiquariat in Desert Springs.
**Datei:** `bilder/hales-brief.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein lesbarer Text; das Spiel legt den Brief Zeile für Zeile darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: an old letter on thick paper with twelve evenly spaced lines suggested as straight grey strokes, lying under a bare light bulb on a wooden counter.
```

### Akt 4

#### A30. `schild_darlene`

**Zweck:** Darlenes Raststätte mit Veranda, Schild über der Tür. **Szene:** Kap. 53, Crossroads (crossroads-aussen).
**Datei:** `bilder/schild-darlene.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text: „Darlene's. Alle Wege. Alle Spiele.“ legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a low wide roadside diner with a porch all around at a crossroads of four empty roads, evening light, a big blank sign above the door, pickup trucks parked.
```

#### A31. `korkwand`

**Zweck:** Die Korkwand mit den kleinen Tafeln der Varianten. **Szene:** Kap. 53, Raststätte (crossroads-raststaette).
**Datei:** `bilder/korkwand.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Namen der Varianten legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a big cork board on a wooden diner wall, small hand-painted wooden boards hanging on nails, each with a tiny chess symbol (a king, an explosion, a hawk, a dragon), warm busy interior light.
```

#### A32. `schild_camp`

**Zweck:** Das Schild aus einem halben Baumstamm. **Szene:** Akt 4, Pinewood Camp (pinewood-camp-aussen).
**Datei:** `bilder/schild-camp.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text: „Pinewood Camp. Schach, Schwimmen, Schlafen. In dieser Reihenfolge.“ legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a sign made from half a tree trunk at the entrance of a forest summer camp, tall pines, a lake glimpse behind.
```

#### A33. `baerenspuren`

**Zweck:** Bärenspuren im weichen Waldboden, Nebel zwischen den Stämmen. **Szene:** Akt 4, Weg nach Pinewood (weg-crossroads-pinewood).
**Datei:** `bilder/baerenspuren.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: large bear paw prints with five toes in soft forest ground, mist between huge tree trunks, ferns at the edges.
```

#### A34. `zettel_39`

**Zweck:** Ein aufgerissener Brief neben einem Brett, eine Zeile senkrecht wie ein Zaun. **Szene:** Akt 4, Erinnerung in Ghost Town (erinnerung-siedlung).
**Datei:** `bilder/zettel-39.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein lesbarer Text: „39. … Dame schlägt g3, Schach.“ legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a torn-open old envelope and a letter with one single line of upright handwriting suggested as a straight stroke, lying next to an old chessboard on a rough table in a frontier house.
```

#### A35. `stein_brett`

**Zweck:** Ein niedriger Stein ohne Namen, eingeritzt acht mal acht Vierecke. **Szene:** Akt 4, Ghost Town (ghost-town-aussen).
**Datei:** `bilder/stein-brett.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a low flat stone without a name at the edge of a desert graveyard where the fence ends, an eight by eight grid scratched into its top, dry grass, wide empty desert behind.
```

#### A36. `blume_e4`

**Zweck:** Eine kleine gelbe Blume auf dem eingeritzten Feld e4. **Szene:** Akt 4, Ghost Town.
**Datei:** `bilder/blume-e4.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text; Koordinaten nicht malen.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: close-up of the same scratched eight by eight grid on a stone, one small yellow wildflower laid on one of the central squares.
```

#### A37. `tagebuch_zettel`

**Zweck:** Das alte Brett und Junos Tagebuch mit acht eingeklebten Zetteln. **Szene:** Akt 4, Saloon in Ghost Town (ghost-town-saloon).
**Datei:** `bilder/tagebuch-zettel.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Die Buchstaben am Brettrand (A. W. 1857) und die Zettel legt das Spiel darüber.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: an old dark wooden chessboard on a saloon table next to a fat diary with eight small notes glued in and sticking out, oil lamp light.
```

#### A38. `tapete_rosen`

**Zweck:** Ein Fetzen Tapete mit Rosen in einem leeren Zimmer. **Szene:** Akt 4, Saloon in Ghost Town.
**Datei:** `bilder/tapete-rosen.webp`. **Größe:** 1024 × 768 (intern 256 × 192).
**Text:** Kein Text.

```
Pixel art illustration for a cozy chess adventure game, shown full-screen in a dialogue like an illustration in a picture book.

FORMAT: one single image in landscape 4:3. NOT a sprite sheet, NOT a grid of objects, NO magenta background. The scene fills the whole image from edge to edge.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 256x192 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

SCENE: a scrap of old wallpaper with a faded rose pattern, as big as a hand, hanging in the corner of an empty wooden room in a ghost town, light through gaps in the planks.
```

## Teil B: Fundbilder

Ein Gegenstand je Bild, mittig, auf einem ruhigen hellen Grund (Pergament #E8DCC4) mit einem weichen
Schatten darunter, damit die Fensterbank sie einheitlich zeigt.

#### B1. `formular1857` (Altes Partieformular, wegMapleCedar)

**Datei:** `bilder/fund-formular1857.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: an old chess score sheet in a dented tin box, faded ink.
```

#### B2. `muenzenFlussweg` (Kiste am Flussufer, wegMapleCedar)

**Datei:** `bilder/fund-muenzen-flussweg.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small wooden chest on a river bank, a few coins inside.
```

#### B3. `pfeilspitze` (Pfeilspitze, wegCedarRiverton)

**Datei:** `bilder/fund-pfeilspitze.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a stone arrowhead lying under a fern.
```

#### B4. `fahrkarte1958` (Fahrkarte von 1958, wegCedarRiverton)

**Datei:** `bilder/fund-fahrkarte1958.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a yellowed cardboard railway ticket from the 1950s.
```

#### B5. `holzspringer` (Springer aus Holz, wegCedarRiverton)

**Datei:** `bilder/fund-holzspringer.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a smooth light wooden chess knight.
```

#### B6. `pavillonspringer` (Springer aus dem Pavillon, riverton)

**Datei:** `bilder/fund-pavillonspringer.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white stone chess knight with a chipped mane.
```

#### B7. `zeitungsausschnitt` (Zeitungsausschnitt Schachspalte, riverton)

**Datei:** `bilder/fund-zeitungsausschnitt.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a newspaper clipping of a chess column with a small diagram.
```

#### B8. `taubenfeder` (Taubenfeder, riverton)

**Datei:** `bilder/fund-taubenfeder.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a grey pigeon feather.
```

#### B9. `holzlaeufer` (Läufer aus Holz, riverton)

**Datei:** `bilder/fund-holzlaeufer.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a simple wooden chess bishop.
```

#### B10. `zahnrad` (Zahnrad, wegRivertonIronwood)

**Datei:** `bilder/fund-zahnrad.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small rusty iron cogwheel.
```

#### B11. `nietenkopf` (Nietenkopf mit Initialen J. H., wegRivertonIronwood)

**Datei:** `bilder/fund-nietenkopf.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a big round iron rivet head with two tiny blank stamped letters.
```

#### B12. `foto2001` (Foto von 2001, ironwood)

**Datei:** `bilder/fund-foto2001.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: an old photo of a girl at a chessboard in a gym.
```

#### B13. `umschlag` (Umschlag ohne Brief, ironwood)

**Datei:** `bilder/fund-umschlag.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: an empty old yellowish envelope with a broken seal.
```

#### B14. `holzturm` (Turm aus Holz, ironwood)

**Datei:** `bilder/fund-holzturm.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a wooden chess rook.
```

#### B15. `glasfunke` (Funke aus Glas, ironwood)

**Datei:** `bilder/fund-glasfunke.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small glowing piece of orange glass like a spark.
```

#### B16. `schluessel` (Verrosteter Schlüssel, cedarCreek)

**Datei:** `bilder/fund-schluessel.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a big rusty old key with a round handle.
```

#### B17. `anstecker` (Werbe-Anstecker ZERO, wegIronwoodSilicon)

**Datei:** `bilder/fund-anstecker.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a shiny white advertising pin badge with a stylised glass king.
```

#### B18. `ohrstoepsel` (Verlorener Ohrstöpsel, wegIronwoodSilicon)

**Datei:** `bilder/fund-ohrstoepsel.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a tiny skin-coloured earpiece with a small metal hole.
```

#### B19. `zeroTablet` (Tablet mit ZERO, siliconBay)

**Datei:** `bilder/fund-zero-tablet.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a thin white tablet showing a chessboard.
```

#### B20. `flaschenpost` (Flaschenpost, wegSiliconDelacroix)

**Datei:** `bilder/fund-flaschenpost.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a glass bottle with a rolled paper message inside.
```

#### B21. `muschelMitLoch` (Muschel mit Loch, wegSiliconDelacroix)

**Datei:** `bilder/fund-muschel-mit-loch.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a seashell with a small round hole.
```

#### B22. `erstesBrettMusikhaus` (Erstes Brett im neuen Musikhaus, portDelacroix)

**Datei:** `bilder/fund-erstes-brett-musikhaus.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: an old chessboard with water-darkened corners.
```

#### B23. `eidechsenhaut` (Eidechsenhaut, wegDelacroixDesert)

**Datei:** `bilder/fund-eidechsenhaut.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a shed lizard skin, pale and papery.
```

#### B24. `nietenCanyonbruecke` (Nieten J. H. an der Canyonbrücke, wegDelacroixDesert)

**Datei:** `bilder/fund-nieten-canyonbruecke.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: two old bridge rivets with tiny blank stamped letters.
```

#### B25. `halesBrief` (Hales Brief, desertSprings)

**Datei:** `bilder/fund-hales-brief.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: an old folded letter on thick paper.
```

#### B26. `postreiterabzeichen` (Postreiterabzeichen von 1866, ghostTown)

**Datei:** `bilder/fund-postreiterabzeichen.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: an old brass pony-rider badge.
```

#### B27. `schlussstellungFernpartie` (Schlussstellung der Fernpartie, ghostTown)

**Datei:** `bilder/fund-schlussstellung-fernpartie.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small sketch of a chess endgame with two kings and a knight.
```

#### B28. `leuchtturmlinse` (Leuchtturmlinse, wegGhostCapital)

**Datei:** `bilder/fund-leuchtturmlinse.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small curved glass lens from a lighthouse.
```

#### B29. `teilnehmerausweis` (Teilnehmerausweis, capitalArena)

**Datei:** `bilder/fund-teilnehmerausweis.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a tournament badge on a lanyard, name field blank.
```

#### B30. `neonK` (Neonbuchstabe „K“, wegDesertSummit)

**Datei:** `bilder/fund-neon-k.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a bent pink neon glass tube shaped like a letter K.
```

#### B31. `murmeltierpfeife` (Murmeltierpfeife, summitCity)

**Datei:** `bilder/fund-murmeltierpfeife.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small wooden whistle.
```

#### B32. `drachenschuppe` (Drachenschuppe aus Glas, summitCity)

**Datei:** `bilder/fund-drachenschuppe.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a green glass scale like a dragon's scale.
```

#### B33. `bisonhaar` (Bisonhaar am Zaun, wegSummitCrossroads)

**Datei:** `bilder/fund-bisonhaar.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a tuft of dark brown bison hair caught on barbed wire.
```

#### B34. `postkartenMargaret` (Postkarten von Margaret, desertSprings)

**Datei:** `bilder/fund-postkarten-margaret.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small stack of old postcards tied with ribbon.
```

#### B35. `postkarteStaedte` (Postkarte aller Städte, crossroads)

**Datei:** `bilder/fund-postkarte-staedte.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a postcard with small pictures of many towns.
```

#### B36. `marshmallowStock` (Marshmallow-Stock mit Kerben, pinewoodCamp)

**Datei:** `bilder/fund-marshmallow-stock.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a roasting stick with notches carved into it.
```

#### B37. `falkeAusHolz` (Falke aus Holz, hochebene)

**Datei:** `bilder/fund-falke-aus-holz.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small unfinished wooden hawk chess piece.
```

#### B38. `setliste960` (Setliste mit Startnummern, portDelacroix)

**Datei:** `bilder/fund-setliste960.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a band set list with numbers instead of songs.
```

#### B39. `finchKarte` (Karte der Finch-Jagd, wegMapleCedar)

**Datei:** `bilder/fund-finch-karte.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a hand-drawn treasure map with little chess pieces marked on it.
```

#### B40. `problemheft` (Problemheft von Odette Finch, wegMapleCedar)

**Datei:** `bilder/fund-problemheft.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a slim old booklet of chess puzzles with diagrams.
```

#### B41. `seite00` (Lose Seite (Landstraße), wegMapleCedar)

**Datei:** `bilder/fund-seite00.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a pencil-drawn chess position.
```

#### B42. `finchBauerA` (Finchs Bauer A, wegMapleCedar)

**Datei:** `bilder/fund-finch-bauer-a.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood pawn with a tiny finch carved on the base.
```

#### B43. `initialen1952` (Initialen im Geländer, mapleFalls)

**Datei:** `bilder/fund-initialen1952.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: initials carved into a wooden banister, shown as blank carved marks.
```

#### B44. `finchSpringerA` (Finchs Springer A, wegCedarRiverton)

**Datei:** `bilder/fund-finch-springer-a.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood knight with a tiny finch carved on the base.
```

#### B45. `signalkelle` (Signalkelle, wegCedarRiverton)

**Datei:** `bilder/fund-signalkelle.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a red and white railway signal paddle.
```

#### B46. `seite01` (Lose Seite (Bahndamm), wegCedarRiverton)

**Datei:** `bilder/fund-seite01.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a pencil-drawn chess position, gravel dust on it.
```

#### B47. `thermoskanneGwen` (Gwens Thermoskanne, wegCedarRiverton)

**Datei:** `bilder/fund-thermoskanne-gwen.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: an old dented thermos flask.
```

#### B48. `kegelKerbe` (Kegel mit Kerbe, lockport)

**Datei:** `bilder/fund-kegel-kerbe.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a bowling pin with a notch carved in it.
```

#### B49. `karabiner` (Karabiner, wegDelacroixDesert)

**Datei:** `bilder/fund-karabiner.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a metal climbing carabiner.
```

#### B50. `seite06` (Lose Seite (Felsbogen), wegDelacroixDesert)

**Datei:** `bilder/fund-seite06.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a drawn chess position held by two stones.
```

#### B51. `finchLaeuferB` (Weißer Läufer aus Buchsbaum, wegDelacroixDesert)

**Datei:** `bilder/fund-finch-laeufer-b.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood bishop with a tiny finch carved on the base.
```

#### B52. `finchBauerG` (Weißer Bauer aus Buchsbaum (G), sternwarte)

**Datei:** `bilder/fund-finch-bauer-g.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood pawn with a tiny finch carved on the base.
```

#### B53. `kreide3` (Kreidespringer am Diner, wegDesertSummit)

**Datei:** `bilder/fund-kreide3.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a chalk drawing of a chess knight on a wall.
```

#### B54. `finchSpringerB` (Weißer Springer aus Buchsbaum, wegDesertSummit)

**Datei:** `bilder/fund-finch-springer-b.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood knight with a tiny finch carved on the base.
```

#### B55. `seite08` (Lose Seite (Bergstraße), wegDesertSummit)

**Datei:** `bilder/fund-seite08.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a drawn chess position, tyre dirt on it.
```

#### B56. `spurPM4` (Frachtbrief mit Logo, wegDesertSummit)

**Datei:** `bilder/fund-spur-p-m4.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a freight document with a generic company logo, no readable text.
```

#### B57. `seite03` (Lose Seite (Hochebene), hochebene)

**Datei:** `bilder/fund-seite03.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a drawn chess position fluttering.
```

#### B58. `finchTurmB` (Weißer Turm aus Buchsbaum, hochebene)

**Datei:** `bilder/fund-finch-turm-b.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood rook with a tiny finch carved on the base.
```

#### B59. `diplomKira` (Bauerndiplom, selbst gemalt, hochebene)

**Datei:** `bilder/fund-diplom-kira.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a child's hand-painted certificate with a pawn drawing.
```

#### B60. `spurPM6` (Typenschild Z-1, wegPinewoodGhost)

**Datei:** `bilder/fund-spur-p-m6.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small metal type plate with a blank model number.
```

#### B61. `seite11` (Lose Seite (Werkstatt), wegPinewoodGhost)

**Datei:** `bilder/fund-seite11.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a drawn chess position, a little oily.
```

#### B62. `bauerZ1` (Bauer aus Metall, wegPinewoodGhost)

**Datei:** `bilder/fund-bauer-z1.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a metal chess pawn.
```

#### B63. `finchBauerE` (Weißer Bauer aus Buchsbaum (E), wegPinewoodGhost)

**Datei:** `bilder/fund-finch-bauer-e.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood pawn with a tiny finch carved on the base.
```

#### B64. `kuerbisschleife` (Blaue Schleife vom Kürbiswiegen, kuerbishof)

**Datei:** `bilder/fund-kuerbisschleife.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a blue prize ribbon rosette.
```

#### B65. `finchBauerH` (Weißer Bauer aus Buchsbaum (H), pelikaninsel)

**Datei:** `bilder/fund-finch-bauer-h.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood pawn with a tiny finch carved on the base.
```

#### B66. `treibholzTurm` (Treibholz-Turm, pelikaninsel)

**Datei:** `bilder/fund-treibholz-turm.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a chess rook carved from driftwood.
```

#### B67. `muschelCoral` (Muschel mit Loch, pelikaninsel)

**Datei:** `bilder/fund-muschel-coral.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a coral-pink seashell with a small hole.
```

#### B68. `finchBauerF` (Weißer Bauer aus Buchsbaum (F), steinbruch)

**Datei:** `bilder/fund-finch-bauer-f.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood pawn with a tiny finch carved on the base.
```

#### B69. `logbuch1866` (Logbuch der Mine von 1866, goldmine)

**Datei:** `bilder/fund-logbuch1866.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: an old leather mining logbook.
```

#### B70. `grubenlampe1866` (Grubenlampe von 1866, goldmine)

**Datei:** `bilder/fund-grubenlampe1866.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: an old brass miner's lamp.
```

#### B71. `goldkorn` (Goldkorn, goldmine)

**Datei:** `bilder/fund-goldkorn.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small gold nugget.
```

#### B72. `kreide2` (Kreidespringer K2, wegIronwoodSilicon)

**Datei:** `bilder/fund-kreide2.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a chalk drawing of a chess knight on a container wall.
```

#### B73. `finchBauerB` (Weißer Bauer aus Buchsbaum (B), wegIronwoodSilicon)

**Datei:** `bilder/fund-finch-bauer-b.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood pawn with a tiny finch carved on the base.
```

#### B74. `seite04` (Lose Seite (Rätseltafel), wegIronwoodSilicon)

**Datei:** `bilder/fund-seite04.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a drawn chess position under a puzzle board.
```

#### B75. `spurPM2` (Spur: Testfeld Signal, wegIronwoodSilicon)

**Datei:** `bilder/fund-spur-p-m2.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small sign reading nothing, with a radio wave symbol.
```

#### B76. `fotoLive` (Foto „Live“, wegIronwoodSilicon)

**Datei:** `bilder/fund-foto-live.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a photo of a girl streaming chess with a red live light, no text.
```

#### B77. `spurPM5` (Spur: Kühlung für Rechenzentrum Summit, wegSummitCrossroads)

**Datei:** `bilder/fund-spur-p-m5.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a cooling unit label with a snowflake symbol, no text.
```

#### B78. `finchBauerD` (Weißer Bauer aus Buchsbaum (D), wegSummitCrossroads)

**Datei:** `bilder/fund-finch-bauer-d.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood pawn with a tiny finch carved on the base.
```

#### B79. `seite09` (Lose Seite (Sturmkeller), wegSummitCrossroads)

**Datei:** `bilder/fund-seite09.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a drawn chess position caught on a cellar door.
```

#### B80. `rangerabzeichen` (Rangerabzeichen, wegSummitCrossroads)

**Datei:** `bilder/fund-rangerabzeichen.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a park ranger badge.
```

#### B81. `kreide4` (Kreidespringer K4, wegCrossroadsPinewood)

**Datei:** `bilder/fund-kreide4.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a chalk drawing of a chess knight on a tree stump.
```

#### B82. `seite10` (Lose Seite (Mammutbaum), wegCrossroadsPinewood)

**Datei:** `bilder/fund-seite10.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a drawn chess position between big tree roots.
```

#### B83. `finchDame` (Weiße Dame aus Buchsbaum, wegCrossroadsPinewood)

**Datei:** `bilder/fund-finch-dame.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood queen with a tiny finch carved on the base.
```

#### B84. `fotoLebendschach` (Foto „Lebendschach“, wegCrossroadsPinewood)

**Datei:** `bilder/fund-foto-lebendschach.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a photo of people standing as chess pieces on a giant board.
```

#### B85. `geheimnisTuerke` (Das Geheimnis des Schachtürken, jahrmarkt)

**Datei:** `bilder/fund-geheimnis-tuerke.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small old wooden cabinet with a chessboard on top and little doors.
```

#### B86. `seite02` (Lose Seite (Fähre), wegSiliconDelacroix)

**Datei:** `bilder/fund-seite02.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a damp loose sheet with a drawn chess position.
```

#### B87. `finchTurmA` (Finchs Turm, wegSiliconDelacroix)

**Datei:** `bilder/fund-finch-turm-a.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood rook with a tiny finch carved on the base.
```

#### B88. `spurPM3` (Mappe „Hochwasserhilfe“, wegSiliconDelacroix)

**Datei:** `bilder/fund-spur-p-m3.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a grey folder with a water drop symbol, no text.
```

#### B89. `kapitaensmuetze` (Kapitänsmütze, wegSiliconDelacroix)

**Datei:** `bilder/fund-kapitaensmuetze.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a navy blue captain's cap.
```

#### B90. `seite05` (Lose Seite (Bayou), bayou)

**Datei:** `bilder/fund-seite05.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a drawn chess position stuck to a root.
```

#### B91. `finchBauerC` (Finchs Bauer, bayou)

**Datei:** `bilder/fund-finch-bauer-c.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood pawn with a tiny finch carved on the base.
```

#### B92. `formularCafeDesExiles` (Partieformular von 1852, bayou)

**Datei:** `bilder/fund-formular-cafe-des-exiles.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: an old chess score sheet from the 1850s.
```

#### B93. `seite12` (Lose Seite (Seeufer), wegGhostCapital)

**Datei:** `bilder/fund-seite12.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a drawn chess position on a jetty post.
```

#### B94. `finchKoenig` (Finchs König, wegGhostCapital)

**Datei:** `bilder/fund-finch-koenig.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a white boxwood king with a tiny finch carved on the base.
```

#### B95. `finchsBuchsbaum` (Finchs Buchsbaum, wegGhostCapital)

**Datei:** `bilder/fund-finchs-buchsbaum.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small boxwood branch with a carving knife.
```

#### B96. `fotoWeltschachtag` (Foto „Weltschachtag“, wegGhostCapital)

**Datei:** `bilder/fund-foto-weltschachtag.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a photo of a lakeside stage with five chessboards.
```

#### B97. `kreide5` (Kreidespringer, Capital, capitalArena)

**Datei:** `bilder/fund-kreide5.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a chalk drawing of a chess knight on city pavement.
```

#### B98. `fotoKreidenacht` (Foto „Nacht der Kreidespringer“, capitalArena)

**Datei:** `bilder/fund-foto-kreidenacht.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a photo of chalk knights on a city square at night.
```

#### B99. `fotoMappe` (Foto „Die Mappe“, capitalArena)

**Datei:** `bilder/fund-foto-mappe.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a photo of a grey folder on a press table.
```

#### B100. `buchVonGrundAuf` (Die Sammlung des Wanderers, capitalArena)

**Datei:** `bilder/fund-buch-von-grund-auf.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a small bundle of old loose chess sheets with drawn positions, freshly bound together with string in a plain linen cover.
```

#### B101. `konservendose` (Konservendose mit Zettel, wegRivertonIronwood)

**Datei:** `bilder/fund-konservendose.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a tin can with a folded note inside.
```

#### B102. `finchLaeuferA` (Läufer aus Buchsbaum, wegRivertonIronwood)

**Datei:** `bilder/fund-finch-laeufer-a.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a boxwood bishop with a tiny finch carved on the base.
```

#### B103. `seite07` (Lose Seite (Kanal), wegRivertonIronwood)

**Datei:** `bilder/fund-seite07.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a loose sheet with a drawn chess position between canal stones.
```

#### B104. `spurPM1` (Foto der Drohne, wegRivertonIronwood)

**Datei:** `bilder/fund-spur-p-m1.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a photo of a small white drone in the sky.
```

#### B105. `kreide1` (Kreidespringer unter der Brücke, wegRivertonIronwood)

**Datei:** `bilder/fund-kreide1.webp`. **Größe:** 512 × 512 (intern 128 × 128). **Text:** keiner.

```
Pixel art item illustration for a cozy chess adventure game: one single object, centred, shown large like an item picture in an inventory.

FORMAT: one square image. NOT a sprite sheet, NO magenta background. Plain soft parchment background (#E8DCC4) with a small soft shadow under the object.

PIXEL STYLE: chunky pixel art at a low internal resolution of about 128x128 pixels, enlarged so that every pixel is an exactly square block on a strict grid. Hard edges, no anti-aliasing, no gradients, no blur, no dithering noise. 1-pixel dark slate outline (#3A3A50) on the main shapes. 2-3 flat shades per colour, light from the top left. Soft muted colours, warm and calm, readable at a glance.

STYLE REFERENCE: The attached image is a style reference only (palette, pixel size, outlines). Do NOT copy any object, building or text from it.

RULES: No text, no letters, no numbers, no logos anywhere in the image; leave sign, paper and plate areas blank so the game can lay text over them. No real persons, no recognisable faces of real people, no real brands. No frame, no border, no watermark.

OBJECT: a chalk drawing of a chess knight under a bridge.
```
