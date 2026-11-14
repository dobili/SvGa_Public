# 25 Figurenprompts: PixelLab und Gemini für jede Figur

Stand 13.11.2026, mittel-4. Fertige Prompts zum Kopieren für jede Figur, die im Spiel spricht
(`figur.<kennung>.name` in `inhalte/abenteuer/texte/de.json`, 127 Einträge) oder auf einer Karte
steht, dazu die Hauptfiguren der Story-Bibel, die neuen Figuren aus dem Roman und 17 Typen für die
Statisten. Arbeitsweise, Einstellungen und Vorlage: `24_Figuren_und_Portraets.md`.

Woher das Aussehen kommt, steht bei jeder Figur unter „Aussehen“: Story-Bibel (`05`), Roman
(`roman/`), Statisten (`16`), Leben der Orte (`12`, `14`), Wege und Routen (`13`, `15`),
Ortsblätter (`20`). Wo dort nichts steht, ist es passend erfunden und mit **frei** gekennzeichnet.
Herkunft und Hautfarbe sind so vielfältig, wie die Bibel die Figuren anlegt.

## So benutzen

1. **PixelLab** (je Figur): „Create from Text“, Humanoid, v3, Leinwand 32×32, Ansicht „Low
   Top-Down“, Detail „Highly detailed“, Umriss „Default“. Den englischen Prompt einfügen (alle unter
   400 Zeichen, geprüft). Danach Animation „Template motion“, Skeleton v3, Walking, Richtungen South,
   East, North, West. ZIP nach `spiel/figuren-neu/<kennung>/` im privaten Repository.
2. **Gemini** (je Figur): das Standbild `south` aus `rotations/` anhängen und den deutschen Prompt
   einfügen. Hauptfiguren bekommen ein Blatt 3×2 (neutral, lächelt, nachdenklich, überrascht,
   bitter, lacht), Nebenfiguren mit wenig Text ein Blatt 2×1 (neutral, lächelt). Der Hauptchat
   schneidet und rechnet auf 64×64 herunter.
3. **Fassungen:** Was eine Figur zusätzlich braucht (Ambrose jung, Mama auf dem Foto von 2001,
   Victor mit Riss …), steht unter ihrem Abschnitt: entweder eine eigene PixelLab-Figur (mit
   Laufanimation) oder ein einzelnes Porträt in Gemini mit derselben Vorlage.
4. **Kinder und Jugendliche** haben im Prompt „short, child height“ (etwa 28 Pixel hoch, passen
   unter jeden Türsturz). Erwachsene ohne Zusatz; nach dem Erzeugen prüfen, dass sie höchstens 32
   Pixel hoch sind.
5. **Ambrose** farbig erzeugen, mit blasser Haut; das Geisterhafte macht das Spiel. **Juno** ist
   schon fertig.

## Reihenfolge und Aufwand

Zuerst Akt 1 (Vertikalschnitt), dann Akt 2, 3 und 4. Die Statisten-Typen für Akt 1 (`kindA`,
`kindB`, `jugend`, `rentner`, `rentnerin`, `bauer`, `service`, `fahrer`) gleich mit Akt 1. Eine
Figur kostet etwa 6 Generierungen (2 für die Figur, 4 für die Laufrichtungen); der Greifarm Z-1
ohne Laufen 2. „Einträge“ zählt die Abschnitte, „neue PixelLab-Figuren“ zusätzlich die eigenen
Fassungen (Ambrose jung, Victor und Nova im Pullover), ohne die fertige Juno.

| Stufe | Teil        | Einträge | neue PixelLab-Figuren | Generierungen (geschätzt) | Gemini-Bilder |
| ----- | ----------- | -------- | --------------------- | ------------------------- | ------------- |
| 1     | Akt 1       | 35       | 36                    | 216                       | 42            |
| 2     | Akt 2       | 28       | 29                    | 174                       | 32            |
| 3     | Akt 3       | 35       | 35                    | 210                       | 34            |
| 4     | Akt 4       | 35       | 35                    | 206                       | 34            |
| 5     | Statisten   | 17       | 17                    | 102                       | 17            |
| 6     | Nur Porträt | 2        | 0                     | 0                         | 2             |
|       | **Summe**   |          | **152**               | **etwa 908**              | **161**       |

Mit dem Gratiskontingent reicht das nicht. Akt 1 allein (etwa 216 Generierungen, dazu etwa 48
für die acht Statisten-Typen von Akt 1) ist der erste sinnvolle Schritt mit dem Abo (Dokument 24).

## Hinweise und offene Punkte

- **Gleiche Figur, zwei Kennungen:** `mamaBear` und `ruthKeene` (Ruth Keene, „Mama Bear“); `z1` und
  `greifarm` (Z-1). Je eine Figur erzeugen.
- **Keine Figur:** `tafel` (die Rätseltafel) ist ein Ding, keine Person.
- **Der Schmied von 1866 heißt im Roman Gideon** (Kapitel 56, 57); die Kennung `gideon` ist neu.
  `tobias` ist Tobias Wren, der Vorrundengegner.
- **Marian Shaw:** Die Stellwerkswärterin am Bahndamm heißt jetzt Marian Shaw (Kennung `rosalind`, vorher Rosalind Marsh).
- **Neue Kennungen** (Figuren aus dem Roman ohne Eintrag in den Spieltexten): `held`, `owen`, `eli`,
  `kieseritzky`, `anderssen`, `morphy`, `claire`, `vaterWhitlock`, `gideon`, dazu die Fassungen
  `ambroseJung`, `victorPullover`, `novaPullover` und die Porträts `josiahHale`, `margaretWhitlock`.
- **Familie Vell (Hochebene):** heutige Kleidung, keine Kostüme; die Sensibilitätslesung vor der
  Veröffentlichung gilt weiter.

## Akt 1: Maple Falls, der Weg, Kürbishof, Cedar Creek (Vertikalschnitt)

### `held` – {held} (Spielfigur)

- **Rolle:** Die Spielfigur; Name wählbar, ohne festes Geschlecht.
- **Akt:** 1–4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** frei (Bibel: 14, still, beobachtet viel; Geschlecht offen)

PixelLab:

```
14 year old teenager, short, child height, androgynous, quiet and observant, short messy chestnut brown hair, calm brown eyes, dark green zip jacket over a light grey t-shirt, dark blue jeans, red sneakers, small canvas backpack, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

_Hinweis:_ Der Held spricht nur in Antwortwahlen und braucht kein Porträtblatt. Die Clubnadeln an der Jacke zeichnet das Spiel nicht in die Figur.

### `ambrose` – Ambrose Whitlock

- **Rolle:** Der Geist im Brett, Schachmeister von 1858, Mentor.
- **Akt:** 1–4
- **Größe:** erwachsen
- **Aussehen:** Roman Kap. 2 (langer Rock mit hohem Kragen, Haar zurückgekämmt); Farben frei

PixelLab:

```
man about 35, thin, upright and proud, pale skin, dark brown hair combed back, sharp narrow face, long charcoal frock coat with high collar, burgundy waistcoat, white cravat, dark trousers, black boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mann um die 35, schmal und aufrecht, blasse Haut, dunkles zurückgekämmtes Haar, langer dunkler Gehrock mit hohem Kragen, weinrote Weste, weiße Halsbinde. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

_Erzeugen:_ Farbig erzeugen, mit natürlicher blasser Haut. Das Geisterhafte macht das Spiel (`#geist`, halb durchsichtig); nichts Durchsichtiges in den Prompt schreiben.

PixelLab, ambroseJung (eigene Figur, London 1851, spielbar):

```
young man about 20, slim, eager, pale skin, dark brown hair a little longer and untidy, no beard, dark green travelling coat, grey waistcoat, loose white cravat, dark trousers, worn black boots, ink stains on fingers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Fassung „alt“:

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Ambrose, gleiche Figur, aber müde und älter wirkend, Schatten unter den Augen, ein paar graue Strähnen, ernster Blick.
```

Gemini, Fassung „lacht ohne Spott“:

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Ambrose lacht offen und warm über sich selbst, Augen fast geschlossen, kein Spott im Gesicht.
```

Gemini, Fassung „gebannt“:

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Ambrose starrt gebannt auf etwas Leuchtendes außerhalb des Bildes, Gesicht von kaltem bläulichem Licht beleuchtet, leicht geöffneter Mund.
```

### `mutter` – Mama (Laura)

- **Rolle:** Mutter des Helden, Krankenpflegerin; spielte als Jugendliche Turniere.
- **Akt:** 1–4
- **Größe:** erwachsen
- **Aussehen:** Roman (Haare mit Stift hochgesteckt, Hände in den Ärmeln der Strickjacke); Hautton frei

PixelLab:

```
woman in her early forties, warm and tired, light brown skin, dark brown hair pinned up loosely with a pencil, soft eyes, faded teal hospital scrubs top under an oatmeal knitted cardigan with long sleeves, dark trousers, white clogs, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Frau Anfang vierzig, müde und warm, hellbraune Haut, dunkelbraunes Haar mit einem Bleistift locker hochgesteckt, beige Strickjacke mit langen Ärmeln über türkisfarbenem Pflegeoberteil. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

Gemini, Fassung „ertappt“:

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Mama, ertappt: Blick kurz zur Seite, die Hände in die Ärmel der Strickjacke geschoben, angedeutetes schuldbewusstes Lächeln.
```

Gemini, Fassung „Foto 2001“ (Mama mit 16):

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: dieselbe Frau als 16-jähriges Mädchen im Jahr 2001, langes dunkles Haar offen, ernster Blick, dunkelblaue Schuljacke mit einer Schachnadel, Foto mit leicht verblassten Farben.
```

### `juno` – Juno Martínez

- **Rolle:** Beste Freundin, führt das Clubtagebuch.
- **Akt:** 1–4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** fertig (Prompt aus Dokument 24)

PixelLab: (schon erzeugt)

```
14 year old girl, short, child height, curious and lively, dark curly hair in a low loose ponytail, freckles, bright lemon yellow rain jacket over a navy and white striped shirt, blue jeans, white sneakers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 14 Jahren, dunkle Locken im lockeren Pferdeschwanz, Sommersprossen, zitronengelbe Regenjacke über blau-weiß gestreiftem Shirt. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

_Stand:_ Figur ist schon erzeugt. Nur das Porträtblatt fehlt, falls noch nicht gemacht.

### `victor` – Victor Hale

- **Rolle:** Der Rivale, 15, Sohn von Graham Hale.
- **Akt:** 1–4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Roman (weiße Jacke mit Namen, Tablet); Haar und Farben frei

PixelLab:

```
15 year old boy, short, child height, composed and cold, light skin, neat ash blond hair parted at the side, grey eyes, white tracksuit jacket with his name on the chest, grey trousers, white sneakers, black tablet in hand, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 15 Jahren, beherrscht und kühl, helle Haut, ordentlich gescheiteltes aschblondes Haar, weiße Trainingsjacke mit aufgedrucktem Namen, Tablet in der Hand. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

PixelLab, victorPullover (eigene Figur, Akt 4, ohne Tablet):

```
15 year old boy, short, child height, unsure, light skin, ash blond hair falling over his ears, grey eyes, oversized moss green knitted sweater, grey trousers, white sneakers, empty hands, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Fassung „Riss“:

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Victor, für einen Moment ungeschützt: Blick nach unten, Mund leicht geöffnet, als fehle ihm die Antwort.
```

Gemini, Fassung „lacht“ (Akt 4):

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Victor lacht zum ersten Mal ehrlich, Haar fällt über die Ohren, oliv-grüner zu großer Pullover statt weißer Jacke.
```

### `grahamHale` – Graham Hale

- **Rolle:** Victors Vater, Entwickler bei Perfect Move, baute ZERO.
- **Akt:** 1–4
- **Größe:** erwachsen
- **Aussehen:** Bibel (telefoniert ständig); Aussehen frei

PixelLab:

```
man about 50, busy and polite, light skin, short greying blond hair, rimless glasses, smartphone at his ear, slim navy suit, light blue shirt without tie, brown leather shoes, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mann um die 50, höflich und gehetzt, helle Haut, kurzes ergrautes blondes Haar, randlose Brille, Handy am Ohr, schmaler dunkelblauer Anzug. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `coachDelgado` – Coach Delgado (Marisol Delgado)

- **Rolle:** Clubchefin 1, Mathelehrerin und Schachcoach in Maple Falls.
- **Akt:** 1, 2, 4
- **Größe:** erwachsen
- **Aussehen:** Bibel (früher Fußballtrainerin, Pfiff); Kleidung frei

PixelLab:

```
Latina woman in her late thirties, sporty and loud-hearted, medium brown skin, black hair in a high ponytail, red and white varsity jacket, grey t-shirt, black track pants, running shoes, silver whistle on a red lanyard, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Latina Ende dreißig, sportlich und herzlich, mittelbraune Haut, schwarzer hoher Pferdeschwanz, rot-weiße Collegejacke, silberne Trillerpfeife am roten Band. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `sam` – Sam Brooks

- **Rolle:** Bestes Brett des Teams in Maple Falls, laut, frühe Dame.
- **Akt:** 1, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel (laut, schnell); Aussehen frei

PixelLab:

```
15 year old boy, short, child height, loud and cheerful, dark brown skin, short twists, wide grin, orange basketball jersey over a white t-shirt, black shorts, high-top sneakers, a chess clock under his arm, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 15 Jahren, laut und fröhlich, dunkelbraune Haut, kurze Twists, breites Grinsen, oranges Basketballtrikot, Schachuhr unter dem Arm. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `skaterJo` – Jo

- **Rolle:** Skaterin im Park, Blitz um Limo.
- **Akt:** 1
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel (Skaterin, 16); Aussehen frei

PixelLab:

```
16 year old girl, short, child height, cool and fair, light tan skin, short dyed teal bob, beanie, oversized black hoodie with skateboard print, ripped grey jeans, checkered skate shoes, skateboard under her arm, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 16 Jahren, lässig, kurzer türkis gefärbter Bob, Mütze, schwarzer Hoodie, Skateboard unter dem Arm. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `lily` – Lily

- **Rolle:** Nachbarskind, lernt den Springer; im Epilog die neue Schülerin auf dem Dachboden.
- **Akt:** 1, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel (8, Nachbarskind); Aussehen frei

PixelLab:

```
8 year old girl, short, child height, eager, light skin, red hair in two pigtails, gap-toothed smile, yellow dungarees over a white t-shirt, green rubber boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 8 Jahren, rote Zöpfe, Zahnlücke, gelbe Latzhose, grüne Gummistiefel. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `abernathy` – Mr. Abernathy

- **Rolle:** Pensionierter Bibliothekar im Park, war mit Mrs. Whitlock befreundet.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** Bibel (Brille, verliert Dinge); Kleidung frei

PixelLab:

```
old man about 80, kind and forgetful, light skin, wispy white hair, round glasses pushed up on his forehead, brown tweed jacket with elbow patches, mustard cardigan, beige trousers, thermos flask, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: alter Mann um die 80, freundlich und vergesslich, weißes dünnes Haar, runde Brille auf der Stirn, braunes Tweedsakko, senfgelbe Strickjacke, Thermoskanne. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `calloway` – Mrs. Eunice Calloway

- **Rolle:** Nachbarin gegenüber, sechzig Jahre lang Freundin von Mrs. Whitlock.
- **Akt:** 1, 4
- **Größe:** erwachsen
- **Aussehen:** Ortsblatt (Veranda, Kartenspiel); Aussehen frei

PixelLab:

```
old woman about 79, gentle and lonely, dark brown skin, short silver curls, pearl earrings, lavender cardigan over a floral dress, beige slippers, a deck of playing cards in her hand, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: alte Frau um die 79, sanft, dunkelbraune Haut, kurze silberne Locken, Perlenohrringe, lavendelfarbene Strickjacke über geblümtem Kleid, Kartenspiel in der Hand. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `hector` – Hector Sandoval

- **Rolle:** Koch und Besitzer des Diners in Maple Falls.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** Roman (Name auf der Schürze); Aussehen frei

PixelLab:

```
Mexican American man in his mid forties, friendly and chatty, medium brown skin, thick black moustache, short black hair, white cook's apron with his name stitched on it, rolled-up blue shirt sleeves, black trousers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: mexikanisch-amerikanischer Koch Mitte vierzig, dicker schwarzer Schnurrbart, weiße Schürze mit aufgesticktem Namen, hochgekrempelte blaue Hemdsärmel. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `carla` – Carla Martínez

- **Rolle:** Junos große Schwester, spielte drei Jahre im Team.
- **Akt:** 1, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Ortsblatt (repariert ein Fahrrad); Aussehen frei

PixelLab:

```
17 year old girl, short, child height, reserved and sharp, light brown skin, long dark wavy hair in a messy bun, grease smudge on her cheek, faded denim jacket, black t-shirt, cargo trousers, work boots, bicycle spanner, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 17 Jahren, zurückhaltend, langes dunkles Haar im unordentlichen Knoten, Ölfleck auf der Wange, verwaschene Jeansjacke, Fahrradschlüssel. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `pratt` – Mr. Gideon Pratt

- **Rolle:** Hausmeister der Maple Falls High seit 1989.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** Leben Akt 1 (poliert die Pokale); Aussehen frei

PixelLab:

```
man about 67, proud and tidy, dark skin, short grey hair, grey moustache, navy blue janitor overall with a name patch, ring of keys on his belt, polishing cloth in his hand, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Hausmeister um die 67, stolz und ordentlich, dunkle Haut, graues Haar und grauer Schnurrbart, dunkelblauer Arbeitsoverall, Schlüsselbund am Gürtel. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `okafor` – Mrs. Grace Okafor

- **Rolle:** Clubchefin 2 in Cedar Creek, Hüterin des Archivs.
- **Akt:** 1, 2, 4
- **Größe:** erwachsen
- **Aussehen:** Roman (klein, aufrecht, graues Haar, Brille an einer Kette, dunkelblaues Kleid)

PixelLab:

```
Nigerian American woman in her early seventies, small, upright and calm, dark skin, short grey hair, glasses on a beaded chain, dark blue dress with a white collar, knitted shawl, low shoes, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Nigerianisch-amerikanische Frau Anfang siebzig, klein und sehr aufrecht, dunkle Haut, kurzes graues Haar, Brille an einer Kette, dunkelblaues Kleid. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

Gemini, Fassung „müde“:

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Mrs. Okafor, müde: Brille abgenommen in der Hand, Augen geschlossen, leichtes Lächeln.
```

### `dex` – Dexter „Dex“ Okafor

- **Rolle:** Enkel von Mrs. Okafor, Bastler.
- **Akt:** 1, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel (Bastler); Aussehen frei

PixelLab:

```
13 year old boy, short, child height, inventive and focused, dark skin, short black hair, goggles pushed up on his forehead, olive utility vest with many pockets over a red t-shirt, khaki shorts, sneakers, small screwdriver, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 13 Jahren, Bastler, dunkle Haut, Schutzbrille auf der Stirn, olivgrüne Weste mit vielen Taschen, Schraubenzieher. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `mae` – Mae Lindqvist

- **Rolle:** Jüngstes Clubmitglied in Cedar Creek, Mattbilder-Expertin.
- **Akt:** 1, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel (Teleskop, Mattbilder); Aussehen frei

PixelLab:

```
11 year old girl, short, child height, small, dreamy and bright, pale skin, long straight platinum blond hair with a star hair clip, round glasses, dark blue sweater with little white stars, grey skirt, red shoes, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 11 Jahren, verträumt, sehr helles blondes Haar mit Sternspange, runde Brille, dunkelblauer Pullover mit weißen Sternen. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `boateng` – Mr. Boateng

- **Rolle:** Besitzer des Waschsalons in Cedar Creek.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** Roman (große ruhige Hände, bester Hut); Aussehen frei

PixelLab:

```
Ghanaian American man in his mid sixties, calm and humorous, dark skin, short grey beard, very large calm hands, flat cap, short-sleeved white shirt, grey trousers, laundry basket, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: ghanaisch-amerikanischer Mann Mitte sechzig, ruhig, kurzer grauer Bart, große Hände, Schiebermütze, weißes kurzärmeliges Hemd. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `rosa` – Rosa

- **Rolle:** Anglerin am Steg in Cedar Creek.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** Bibel (Anglerin); Aussehen frei

PixelLab:

```
woman in her late fifties, patient, tanned skin, grey braid, wide straw hat, khaki fishing vest over a blue checked shirt, rolled-up jeans, rubber boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Anglerin Ende fünfzig, grauer Zopf, breiter Strohhut, Anglerweste, karierte Bluse. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `nia` – Nia

- **Rolle:** Straßengegnerin am Ortsausgang von Maple Falls, schnell.
- **Akt:** 1
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** frei

PixelLab:

```
12 year old girl, short, child height, fast and competitive, dark brown skin, box braids tied back, pink headband, purple running jacket, black leggings, neon sneakers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 12 Jahren, schnell und ehrgeizig, Zöpfe (Box Braids), pinkes Stirnband, lila Laufjacke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `patel` – Mr. Patel

- **Rolle:** Führt den Kiosk am Parkeingang in Maple Falls.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** Roman (sieht über die Brille); Aussehen frei

PixelLab:

```
Indian American man in his fifties, observant, brown skin, neat grey-streaked hair, reading glasses on his nose, maroon sweater vest over a white shirt, beige trousers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: indisch-amerikanischer Mann um die 55, Lesebrille auf der Nase, weinroter Pullunder über weißem Hemd. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `fenwick` – Mrs. Fenwick

- **Rolle:** Wanderin am Wegweiser, ein Satz Schachweisheit.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** Wege (Rucksack und Stock); Aussehen frei

PixelLab:

```
woman in her sixties, brisk, light skin, short white hair, red windbreaker, hiking trousers, boots, big backpack and a walking stick, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Wanderin um die 65, kurzes weißes Haar, rote Windjacke, großer Rucksack und Wanderstock. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `ada` – Ada Brennan

- **Rolle:** Bäuerin mit der Ehrlichkeitskasse am Apfelstand.
- **Akt:** 1, 2
- **Größe:** erwachsen
- **Aussehen:** Leben Akt 1 (Apfelstand); Aussehen frei

PixelLab:

```
farm woman about 56, practical and fair, sun-tanned skin, greying auburn hair in a bun, green quilted vest over a red flannel shirt, work jeans, rubber boots, basket of apples, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Bäuerin um die 56, rotbraunes ergrauendes Haar im Knoten, grüne Steppweste über rotem Flanellhemd, Korb mit Äpfeln. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `otis` – Otis Brennan

- **Rolle:** Adas Mann, fährt Traktor und redet mit den Kühen.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** Leben Akt 1; Aussehen frei

PixelLab:

```
farmer about 59, quiet and gentle, weathered tanned skin, grey stubble, faded green cap, blue denim overalls over a grey shirt, work boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Bauer um die 59, wortkarg, grauer Bartschatten, verblichene grüne Kappe, blaue Latzhose. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `silas` – Silas Reed

- **Rolle:** Angler am Flussweg, fängt nie etwas.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** Leben Akt 1; Aussehen frei

PixelLab:

```
old man about 74, dreamy, dark skin, white beard, battered fishing hat with lures, brown oilskin jacket, rolled-up trousers, fishing rod, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: alter Angler um die 74, weißer Bart, abgegriffener Anglerhut, brauner Wachsmantel, Angelrute. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `joggerin` – Tessa Vance (die Joggerin)

- **Rolle:** Krankenschwester, trainiert für ihren ersten langen Lauf.
- **Akt:** 1, 2
- **Größe:** erwachsen
- **Aussehen:** Ortsblatt Weg; Aussehen frei

PixelLab:

```
young woman about 24, determined, light brown skin, black hair in a tight high ponytail, coral running top, black running tights, white running shoes, sports watch, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: junge Läuferin um die 24, schwarzer hoher Pferdeschwanz, korallenrotes Laufshirt, schwarze Laufhose. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `kettering` – Mr. Lyle Kettering

- **Rolle:** Fährt seit 31 Jahren den Bus nach Cedar Creek.
- **Akt:** 1, 2
- **Größe:** erwachsen
- **Aussehen:** Leben Akt 1, Roman; Aussehen frei

PixelLab:

```
bus driver about 58, steady and kind, light skin, grey crew cut, grey moustache, blue driver's uniform shirt with a badge, dark tie, navy trousers, thermos of coffee, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Busfahrer um die 58, graue Bürstenfrisur, grauer Schnurrbart, blaues Uniformhemd mit Abzeichen. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `dunmore` – Mr. Ansel Dunmore

- **Rolle:** Drechsler in Cedar Creek, dreht Figuren für den Club.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** Leben Akt 1; Aussehen frei

PixelLab:

```
woodturner about 63, careful, light skin, curly grey hair full of wood shavings, short grey beard, leather work apron over a green flannel shirt, brown trousers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Drechsler um die 63, lockiges graues Haar mit Holzspänen, kurzer grauer Bart, Lederschürze über grünem Flanellhemd. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `ivy` – Ivy Pell

- **Rolle:** Zwillingsschwester, streitet auf der Bibliothekstreppe.
- **Akt:** 1
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Leben Akt 1; Aussehen frei

PixelLab:

```
9 year old girl, short, child height, stubborn and funny, light brown skin, curly dark brown hair in two puffs, orange raincoat, blue leggings, yellow boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 9 Jahren, dunkle Locken in zwei Puscheln, orange Regenjacke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `jonah` – Jonah Pell

- **Rolle:** Zwillingsbruder, streitet auf der Bibliothekstreppe.
- **Akt:** 1
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Leben Akt 1; Aussehen frei

PixelLab:

```
9 year old boy, short, child height, stubborn and funny, light brown skin, curly dark brown short hair, blue raincoat, orange trousers, yellow boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 9 Jahren, kurze dunkle Locken, blaue Regenjacke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `owen` – Owen Fisk

- **Rolle:** Kind aus der Südseite in Maple Falls mit Ball; lernt später Karten und Schach bei Mrs. Calloway.
- **Akt:** 1, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Leben Akt 1 (Kind mit Ball); Aussehen frei

PixelLab:

```
7 year old boy, short, child height, bouncy, light brown skin, short curly hair, missing front tooth, red t-shirt with a white star, blue shorts, scuffed sneakers, red ball under his arm, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 7 Jahren, kurze Locken, Zahnlücke, rotes Shirt mit weißem Stern, roter Ball unter dem Arm. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `walt` – Walt Miller

- **Rolle:** Bauer am Kürbishof, lässt niemanden aufs Feld.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
farmer about 55, grumpy but fair, sunburnt light skin, grey stubble, orange cap, brown canvas work jacket over a checked shirt, jeans, rubber boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Bauer um die 55, grauer Bartschatten, orange Kappe, braune Arbeitsjacke über kariertem Hemd. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `clover` – Clover Miller

- **Rolle:** Tochter der Millers, baut jedes Jahr den Irrgarten.
- **Akt:** 1
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Kürbishof (baut den Irrgarten); Aussehen frei

PixelLab:

```
12 year old girl, short, child height, inventive, light skin, freckles, long ginger hair in two braids, straw hat, green dungarees over a yellow shirt, rubber boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 12 Jahren, Sommersprossen, rote Zöpfe, Strohhut, grüne Latzhose. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `omaMiller` – Oma Miller

- **Rolle:** Verkauft im Hofladen Kuchen und erzählt.
- **Akt:** 1
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
grandmother about 78, cosy storyteller, light skin, white hair in a bun, round glasses, pumpkin orange cardigan, long brown skirt, apron with flour, pie dish, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Großmutter um die 78, weißer Knoten, runde Brille, kürbisorange Strickjacke, Schürze mit Mehl, Kuchenform. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

## Akt 2: Bahndamm, Riverton, Kanalweg, Ironwood, Schleuse, Erinnerung London

### `slick` – Slick (Marcus Bellamy)

- **Rolle:** Clubchef 3 in Riverton, Fahrradkurier, Blitz im Pavillon.
- **Akt:** 2, 3, 4
- **Größe:** erwachsen
- **Aussehen:** Bibel (Fahrradkurier, großmäulig); Aussehen frei

PixelLab:

```
Black man in his mid twenties, fast and cheeky, dark skin, short twists under a backwards red cap, big grin, yellow courier windbreaker, black cargo shorts, high-top sneakers, messenger bag, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Schwarzer Mann Mitte zwanzig, schnell und frech, kurze Twists unter einer verkehrt herum getragenen roten Kappe, gelbe Kurierjacke, Kuriertasche. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

Gemini, Fassung „leise“:

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Slick ohne Grinsen, Kappe abgenommen in der Hand, Blick nach unten, ruhig.
```

### `tamsin` – Tamsin Ortega

- **Rolle:** Clubmitglied in Riverton, spielt nur Blitz.
- **Akt:** 2, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel (zählt Sekunden); Aussehen frei

PixelLab:

```
12 year old girl, short, child height, hyper and quick, light brown skin, short black hair with a side clip, green raincoat, striped leggings, red sneakers, digital stopwatch around her neck, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 12 Jahren, quirlig, kurzes schwarzes Haar mit Spange, grüne Regenjacke, Stoppuhr um den Hals. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `ray` – Ray Jessup

- **Rolle:** Clubmitglied in Riverton, ehemaliger Busfahrer.
- **Akt:** 2, 4
- **Größe:** erwachsen
- **Aussehen:** Roman (bester Hut); Aussehen frei

PixelLab:

```
old man in his early seventies, warm storyteller, dark skin, white moustache, his best brown felt hat, beige raincoat, brown trousers, old bus timetable in his pocket, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: alter Mann Anfang siebzig, weißer Schnurrbart, bester brauner Filzhut, beiger Regenmantel. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `harlan` – Mr. Harlan

- **Rolle:** Pensionierter Uhrmacher in der Bahnhofshalle, sehr langsam.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Bibel (Lupenbrille, Uhr); Kleidung frei

PixelLab:

```
old watchmaker in his late sixties, precise and slow, light skin, bald with white side hair, jeweller's loupe glasses, dark green waistcoat with a pocket watch chain, white shirt, grey trousers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Uhrmacher Ende sechzig, Glatze mit weißem Haarkranz, Lupenbrille, dunkelgrüne Weste mit Taschenuhrkette. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `pops` – Pops (Theodore Banks)

- **Rolle:** Zeitungsstand in der Bahnhofshalle von Riverton.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
man in his early sixties, jovial, dark brown skin, grey goatee, flat newsboy cap, brown cardigan over a white shirt, red bow tie, rolled newspaper, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mann Anfang sechzig, gemütlich, grauer Kinnbart, Schiebermütze, braune Strickjacke, rote Fliege. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `albescu` – Mrs. Ileana Albescu

- **Rolle:** Hatte die Fahrradwerkstatt hinter dem Park.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
Romanian American woman about 50, tough and kind, light skin, short dark hair with grey streaks, grease-stained blue work jacket, black trousers, heavy boots, rusty key on a string, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: rumänisch-amerikanische Frau um die 50, dunkles kurzes Haar mit grauen Strähnen, ölverschmierte blaue Arbeitsjacke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `nova` – Nova Sinclair

- **Rolle:** Highschool-Champion mit Vertrag bei Perfect Move.
- **Akt:** 2, 3, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Roman (weiße Jacke mit Zeichen, später zu großer Pullover, Ohrstöpsel)

PixelLab:

```
16 year old girl, short, child height, polished smile, tired eyes, light brown skin, sleek long black hair worn loose over her ears, white Perfect Move jacket with a silver logo, white trousers, white sneakers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 16 Jahren, einstudiertes Lächeln, müde Augen, langes glattes schwarzes Haar über den Ohren, weiße Jacke mit silbernem Logo. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

PixelLab, novaPullover (eigene Figur, Akt 3 und 4):

```
16 year old girl, short, child height, quiet, light brown skin, long black hair tied back so both ears are free, oversized grey knitted sweater, dark jeans, white sneakers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Fassung „Kamera aus“:

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Nova ohne Lächeln, erschöpft, Blick ins Leere, eine Hand am Ohr.
```

Gemini, Fassung „frei“ (Akt 4):

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Nova mit zurückgebundenem Haar, beide Ohren frei, grauer zu großer Pullover, unsicheres echtes Lächeln.
```

### `dale` – Mr. Dale

- **Rolle:** Bauer am Zaun auf dem Weg, ein Satz zum Bauern.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
farmer in his sixties, slow-spoken, tanned skin, grey beard, straw hat, plaid shirt, denim overalls, pitchfork, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Bauer um die 65, grauer Bart, Strohhut, kariertes Hemd, Latzhose. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `noor` – Noor Haddad

- **Rolle:** Kunststudentin, sprüht das Wandbild am Kanalweg.
- **Akt:** 2, 4
- **Größe:** erwachsen
- **Aussehen:** Leben Akt 2 (Wandbild); Aussehen frei

PixelLab:

```
Arab American young woman about 19, focused artist, olive skin, dark hair under a paint-splattered bandana, paint-stained white overalls over a black t-shirt, yellow sneakers, spray can, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: arabisch-amerikanische Kunststudentin um die 19, Haare unter einem farbbespritzten Tuch, farbverschmierter weißer Overall, Sprühdose. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `schaffner` – Mr. Quinn

- **Rolle:** Zugschaffner am Bahndamm, erster Gegner mit Uhr.
- **Akt:** 2, 4
- **Größe:** erwachsen
- **Aussehen:** Roman (Uniform, Mütze im Nacken); Gesicht frei

PixelLab:

```
train conductor about 55, dutiful and dry, light skin, red-grey sideburns, navy railway uniform with brass buttons, peaked cap pushed back, pocket watch, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Zugschaffner um die 55, rotgraue Koteletten, dunkelblaue Bahnuniform mit Messingknöpfen, Mütze im Nacken. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `bigJoe` – Big Joe (Joseph Kowalski)

- **Rolle:** Clubchef 4, Kranführer, Werksclub in der Kantine; Mamas Trainer.
- **Akt:** 2, 4
- **Größe:** erwachsen
- **Aussehen:** Roman (Hände wie Schaufeln); Kleidung frei

PixelLab:

```
huge broad man in his late fifties, loud and gentle, light skin, ruddy cheeks, bald head, thick grey beard, very large hands, orange high-visibility vest over a brown work shirt, jeans, steel-toe boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: riesiger Mann Ende fünfzig, laut und sanft, Glatze, dichter grauer Bart, sehr große Hände, orange Warnweste über braunem Arbeitshemd. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `hank` – Hank Morrow

- **Rolle:** Clubmitglied in Ironwood, Schichtarbeiter.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
steelworker in his mid forties, taciturn, light skin, stubble, grey beanie, navy work jacket with reflective stripes, work trousers, boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Stahlarbeiter Mitte vierzig, wortkarg, Bartschatten, graue Mütze, dunkelblaue Arbeitsjacke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `priya` – Priya Raman

- **Rolle:** Werkstudentin im Stahlwerk, will Brücken bauen.
- **Akt:** 2, 4
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
Indian American young woman about 19, sharp and eager, brown skin, long black braid, white hard hat under her arm, teal engineering jacket, grey trousers, boots, rolled blueprint, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: indisch-amerikanische Studentin um die 19, langer schwarzer Zopf, weißer Schutzhelm unter dem Arm, Bauplanrolle. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `gus` – Gus Petrakis

- **Rolle:** Rangierer am Güterbahnhof, Blitz in der Pause.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
Greek American railway shunter about 60, jolly, olive skin, big grey moustache, orange safety vest over a grey shirt, work gloves in pocket, sandwich in hand, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: griechisch-amerikanischer Rangierer um die 60, großer grauer Schnurrbart, orange Warnweste, Sandwich in der Hand. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `edna` – Edna Price

- **Rolle:** Eisenwarenhändlerin in Ironwood.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
shopkeeper woman about 70, no-nonsense, light skin, short permed grey hair, half-moon glasses, brown shop coat with pens in the pocket, grey skirt, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Eisenwarenhändlerin um die 70, kurze graue Dauerwelle, Halbmondbrille, brauner Ladenkittel. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `teague` – Mr. Walter Teague

- **Rolle:** Hüter des Heimatmuseums im alten Bahnhof von Ironwood.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Roman (so dünn, dass die Weste um ihn steht, sieht über die Brille)

PixelLab:

```
very thin old man about 80, solemn and kind, light skin, sparse white hair combed flat, glasses, oversized grey waistcoat over a white shirt, dark trousers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: sehr dünner alter Mann um die 80, weißes Haar glatt gekämmt, Brille, zu weite graue Weste. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `omaRuth` – Oma Ruth

- **Rolle:** Mamas Mutter in der Elm Street, Ironwood.
- **Akt:** 2, 4
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
grandmother in her mid seventies, warm and sharp, light brown skin, short white curls, glasses, pale blue housecoat over a flowered blouse, slippers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Großmutter Mitte siebzig, kurze weiße Locken, Brille, hellblauer Hauskittel über geblümter Bluse. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `eli` – Eli

- **Rolle:** Stiller Junge am Bildschirmtisch in Riverton.
- **Akt:** 2
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Roman (Akt 2); Aussehen frei

PixelLab:

```
10 year old boy, short, child height, shy, light skin, messy brown hair, big headphones around his neck, blue hoodie, grey trousers, sneakers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 10 Jahren, schüchtern, zerzaustes braunes Haar, Kopfhörer um den Hals, blauer Hoodie. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `zeitungsjunge` – Zeitungsjunge

- **Rolle:** Verkauft Zeitungen in Riverton.
- **Akt:** 2
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** frei

PixelLab:

```
12 year old boy, short, child height, lively, freckled light skin, red hair under a grey flat cap, brown vest over a white shirt, knee-length trousers, canvas bag full of newspapers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 12 Jahren, Sommersprossen, rotes Haar unter grauer Schiebermütze, Tasche voller Zeitungen. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `rosalind` – Marian Shaw

- **Rolle:** Wärterin im alten Stellwerk am Bahndamm (früher „Rosalind Marsh“, seit 13.11.2026 Marian Shaw; Kennung bleibt `rosalind`).
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Routen (Stellwerk); Aussehen frei

PixelLab:

```
signal keeper woman about 68, sturdy and sharp-eyed, light skin, grey hair in a short braid, dark green railway jacket, grey trousers, sturdy boots, brass lantern, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Stellwerkswärterin um die 68, grauer kurzer Zopf, dunkelgrüne Bahnjacke, Messinglaterne. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `imogen` – Imogen Rourke

- **Rolle:** Schleusenwärterin in dritter Generation.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Leben Akt 2; Aussehen frei

PixelLab:

```
lock keeper woman about 63, weathered and cheerful, light skin, wind-blown grey curls, yellow oilskin coat, dark green trousers, rubber boots, small brass bell, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Schleusenwärterin um die 63, windzerzauste graue Locken, gelbe Ölhaut-Jacke, kleine Messingglocke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `henrik` – Henrik Dahl

- **Rolle:** Wirt des Gasthauses „Zur Schleuse“, Kegelkönig.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Leben Akt 2; Aussehen frei

PixelLab:

```
innkeeper about 70, jovial, pink light skin, white beard, round belly, white shirt with rolled sleeves, red suspenders, long blue apron, pair of rubber boots in hand, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Wirt um die 70, weißer Bart, runder Bauch, rote Hosenträger, lange blaue Schürze. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `ruben` – Kapitän Ruben Castellano

- **Rolle:** Fährt den Lastkahn zwischen Riverton und Ironwood.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Leben Akt 2; Aussehen frei

PixelLab:

```
Puerto Rican barge captain about 47, proud, tan skin, short black beard with grey, navy captain's cap, navy pea coat, dark trousers, boots, coiled rope on shoulder, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: puerto-ricanischer Kapitän um die 47, schwarzer Bart mit Grau, dunkelblaue Kapitänsmütze, Seemannsjacke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `odette` – Odette Finch

- **Rolle:** Schachproblem-Komponistin im Wohnmobil „Gambit“, führt die Finch-Jagd.
- **Akt:** 1–4
- **Größe:** erwachsen
- **Aussehen:** Routen (Finch-Jagd); Aussehen frei

PixelLab:

```
elegant old woman about 71, mischievous, light skin, silver bob, cat-eye glasses, teal silk scarf, mustard coat, dark trousers, booklet of chess puzzles, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: elegante alte Frau um die 71, silberner Bob, Katzenaugenbrille, türkiser Seidenschal, senfgelber Mantel, Heft mit Schachproblemen. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `kieseritzky` – Lionel Kieseritzky (London 1851)

- **Rolle:** Verlierer der Unsterblichen Partie, läuft zum Telegrafenamt.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Roman Kap. 21 (Strahlen, läuft ohne Hut); Aussehen frei

PixelLab:

```
man about 45 in 1851 London, excitable and beaming, pale skin, dark curly hair and side whiskers, brown frock coat, patterned waistcoat, loosened cravat, no hat, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mann um die 45 im London von 1851, strahlend und aufgeregt, dunkle Locken und Koteletten, brauner Gehrock. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

Gemini, Fassung „strahlt“:

```
Vorlage: ein Feld aus dem fertigen Porträtblatt dieser Figur anhängen (am besten „neutral“), nicht die kleine Spielfigur. Zeichne ein einzelnes quadratisches Porträt dieser Figur im selben Stil, derselben Pixelgröße und mit demselben Gesicht wie die Vorlage, Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Kieseritzky strahlt über das ganze Gesicht, obwohl er verloren hat.
```

### `anderssen` – Adolf Anderssen (London 1851)

- **Rolle:** Gewinner der Unsterblichen Partie, Mathematiklehrer.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Roman Kap. 21 (Mathematiklehrer); Aussehen frei

PixelLab:

```
man about 33 in 1851 London, calm and modest, pale skin, neat dark hair, short beard, plain black frock coat, white shirt with high collar, grey trousers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mann um die 33 im London von 1851, ruhig und bescheiden, kurzer Bart, schlichter schwarzer Gehrock. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `zeitungsleser` – Zeitungsleser (London 1851)

- **Rolle:** Gast im Kaffeehaus der Erinnerung.
- **Akt:** 2
- **Größe:** erwachsen
- **Aussehen:** Bibel (Kaffeehaus); Aussehen frei

PixelLab:

```
Victorian gentleman about 50, absorbed, pale skin, grey mutton chops, top hat, dark coat, holding an open newspaper, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: viktorianischer Herr um die 50, graue Koteletten, Zylinder, offene Zeitung. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `morphy` – Paul Morphy (New York 1857)

- **Rolle:** Ambroses bewundertes Vorbild, nur in Erinnerungen.
- **Akt:** 1, 2
- **Größe:** erwachsen
- **Aussehen:** Roman (Erinnerungen); Aussehen frei

PixelLab:

```
young man about 20 in 1857, quiet and brilliant, pale skin, dark hair parted in the middle, clean-shaven, elegant black frock coat, white shirt, black bow tie, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: junger Mann um die 20 im Jahr 1857, still und glänzend, dunkles gescheiteltes Haar, eleganter schwarzer Gehrock. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

## Akt 3: Silicon Bay, Fähre, Port Delacroix, Pelikaninsel, Desert Springs, Sternwarte

### `lin` – Dr. Evelyn Lin

- **Rolle:** Clubchefin 5, leitet die Schachakademie in Silicon Bay.
- **Akt:** 3, 4
- **Größe:** erwachsen
- **Aussehen:** Roman (kurzes graues Haar, Brille auf der Stirn)

PixelLab:

```
Chinese American woman in her mid forties, direct and honest, light skin, short grey hair, glasses pushed up on her forehead, white lab-style blazer over a black turtleneck, grey trousers, tablet in hand, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: chinesisch-amerikanische Frau Mitte vierzig, kurzes graues Haar, Brille auf der Stirn, weißer Blazer über schwarzem Rollkragen. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `theo` – Theodore „Theo“ Park

- **Rolle:** Datenfreak der Akademie.
- **Akt:** 3, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
Korean American boy, short, child height, 14, earnest, light skin, straight black hair with a fringe, thin glasses, white academy polo with a silver logo, navy trousers, smartwatch, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: koreanisch-amerikanischer Junge von 14, glattes schwarzes Haar mit Pony, dünne Brille, weißes Akademie-Polo. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `dash` – Dashiell „Dash“ Moore

- **Rolle:** Lieferradfahrer, Blitz in der Mittagspause.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
young man about 19, fast-talking, dark brown skin, short fade haircut, bike helmet on his head, lime green delivery jacket, black shorts, cycling shoes, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: junger Mann um die 19, schnell und redselig, Kurzhaarschnitt, Fahrradhelm, limettengrüne Lieferjacke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `rosie` – Rosie (Rosalind Ortiz)

- **Rolle:** Food-Truck in Silicon Bay, der einzige Farbfleck.
- **Akt:** 3, 4
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
Mexican American woman in her early thirties, warm and loud, brown skin, curly black hair in a red bandana, red food-truck apron over a yellow t-shirt, jeans, big hoop earrings, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: mexikanisch-amerikanische Frau Anfang dreißig, schwarze Locken unter rotem Tuch, rote Schürze, große Kreolen. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `empfangsroboter` – Empfangsroboter

- **Rolle:** Roboter am Empfang der Akademie.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
small friendly reception robot, white glossy rounded body, round head with a dark visor showing two blue light eyes, short arms, moves on a single wheel, silver chess pawn logo on its chest, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

_Erzeugen:_ In PixelLab nicht als Humanoid, sondern als Objekt oder „Non-humanoid“ erzeugen; Laufanimation als Rollen.

### `kiki` – Kiki Blitz

- **Rolle:** Streamerin mit Ringlicht auf der Glasbrücke.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** Routen; Aussehen frei

PixelLab:

```
young woman about 19, bubbly streamer, light tan skin, pink and purple ombre hair in space buns, white headset, pastel blue oversized jacket, black skirt, platform sneakers, phone on a stick, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Streamerin um die 19, rosa-lila Haar in zwei Dutts, weißes Headset, hellblaue zu große Jacke, Handy am Stab. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `kowalczyk` – Mrs. Kowalczyk

- **Rolle:** Fernfahrerin an der Raststätte, ein Satz Schachweisheit.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
truck driver woman about 55, gruff and kind, light skin, short dyed red hair, trucker cap, black leather vest over a checked shirt, jeans, boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Fernfahrerin um die 55, kurzes rot gefärbtes Haar, Truckerkappe, schwarze Lederweste. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `schiffskoch` – Mr. Ruiz

- **Rolle:** Schiffskoch auf der Küstenfähre.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
ship's cook about 50, cheerful, brown skin, black moustache, white cook's cap, white double-breasted jacket with a stain, checked trousers, ladle, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Schiffskoch um die 50, schwarzer Schnurrbart, weiße Kochmütze, Kelle. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `kapitaen` – Kapitän Fall

- **Rolle:** Kapitän der Küstenfähre.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
ferry captain about 60, calm, weathered light skin, white beard, white captain's cap, navy coat with gold buttons, dark trousers, binoculars, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Fährkapitän um die 60, weißer Bart, weiße Kapitänsmütze, dunkelblauer Mantel mit Goldknöpfen. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `faehrmann` – Der Fährmann (Silas Pike)

- **Rolle:** Fährt die Inselfähre „nur sonntags“.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** Leben (Silas Pike); Aussehen frei

PixelLab:

```
old ferryman about 66, secretive, tanned skin, grey ponytail, faded blue knit cap, grey wool sweater, oilskin trousers, rope over shoulder, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: alter Fährmann um die 66, grauer Pferdeschwanz, blaue Strickmütze, grauer Wollpullover. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `guidry` – Mr. Guidry

- **Rolle:** Arbeiter am Deich, ein Satz zur Bauernkette.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
Cajun man about 45, steady, tanned skin, black stubble, mud-stained white t-shirt, green waders, shovel, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mann um die 45 aus dem Delta, Bartschatten, schlammverschmiertes weißes Shirt, grüne Wathose, Schaufel. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `odile` – Miss Odile Fontaine

- **Rolle:** Clubchefin 6, Musiklehrerin, Club im alten Musikhaus.
- **Akt:** 3, 4
- **Größe:** erwachsen
- **Aussehen:** Roman (Kleid mit Notenschlüsseln, weißes Haar)

PixelLab:

```
Creole woman in her early sixties, dignified and warm, dark brown skin, white hair in a neat bun, small gold earrings, navy dress with tiny white treble clefs, white cardigan, low heels, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: kreolische Frau Anfang sechzig, würdevoll, dunkelbraune Haut, weißes Haar im Knoten, dunkelblaues Kleid mit kleinen weißen Notenschlüsseln. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `remy` – Rémy Arceneaux

- **Rolle:** Clubmitglied, Trompeter, stolz auf seine Stadt.
- **Akt:** 3, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Roman (Trompetenkasten); Aussehen frei

PixelLab:

```
16 year old boy, short, child height, proud and fiery, dark brown skin, short black hair, purple school band jacket with gold trim, black trousers, sneakers, trumpet case, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 16 Jahren, stolz, dunkelbraune Haut, lila Schulbandjacke mit Goldrand, Trompetenkasten. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `lou` – Lou (Louise Thibodeaux)

- **Rolle:** Clubmitglied, sammelt Muscheln und Pläne.
- **Akt:** 3, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Roman (Muscheln im Haar)

PixelLab:

```
12 year old girl, short, child height, imaginative, light tan skin, long tangled brown hair with small shells woven in, turquoise t-shirt, denim shorts, sandals, notebook, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 12 Jahren, langes verwuscheltes braunes Haar mit eingeflochtenen Muscheln, türkises Shirt, Notizbuch. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `batiste` – Mr. Lucien Batiste

- **Rolle:** Flickt am Kai Boote, Straßengegner.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
Creole boat mender in his late fifties, unhurried, dark skin, grey stubble, straw boater hat, faded red shirt with rolled sleeves, canvas trousers, bare feet, mallet, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: kreolischer Bootsflicker Ende fünfzig, grauer Bartschatten, Strohhut, verblichenes rotes Hemd, barfuß. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `henri` – Henri Whitlock-Duval

- **Rolle:** Klavierbauer in sechster Generation, Nachfahre von Ambroses Familie.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
Creole piano builder about 50, gentle, medium brown skin, short curly grey-black hair, thin moustache, sawdust on a brown leather apron, white shirt, tuning fork in the pocket, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Klavierbauer um die 50, mittelbraune Haut, kurzes lockiges grauschwarzes Haar, dünner Schnurrbart, Lederschürze mit Sägemehl. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `celeste` – Céleste Whitlock-Duval

- **Rolle:** Henris Tochter, macht Musik am Laptop, skatet.
- **Akt:** 3
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
15 year old girl, short, child height, relaxed, medium brown skin, curly hair in a high puff, big white headphones, oversized orange hoodie, black shorts over leggings, skateboard, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 15 Jahren, lockiges Haar im hohen Puschel, große weiße Kopfhörer, oranger Hoodie, Skateboard. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `arceneaux` – Mrs. Arceneaux

- **Rolle:** Remys Großmutter, Gebäckstand vor der Turnhalle.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
Creole grandmother in her seventies, proud, dark brown skin, grey hair under a colourful head wrap, flowered apron over a pink dress, tray of beignets, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: kreolische Großmutter um die 75, buntes Kopftuch, geblümte Schürze, Blech mit Gebäck. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `pepe` – Pépé Thibodeaux

- **Rolle:** Alter Fischer auf dem Hausboot, Lous Urgroßvater.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** Wege; Aussehen frei

PixelLab:

```
very old fisherman about 84, wry, tanned wrinkled skin, white stubble, faded captain's cap, patched blue shirt, suspenders, rubber boots, tin box, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: sehr alter Fischer um die 84, weißer Bartschatten, verblichene Kapitänsmütze, geflicktes blaues Hemd, Blechkiste. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `blaeser` – Mabel (Bläserin im Musikhaus)

- **Rolle:** Spielt nach dem Wiederaufbau im Musikhaus.
- **Akt:** 3, 4
- **Größe:** erwachsen
- **Aussehen:** Leben (Mabel); Aussehen frei

PixelLab:

```
Black woman about 40, joyful musician, dark skin, short natural hair, gold hoop earrings, sequined purple vest over a white shirt, black trousers, trombone, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Musikerin um die 40, kurzes Naturhaar, goldene Kreolen, lila Paillettenweste, Posaune. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `theron` – Theron

- **Rolle:** Luftbootführer im Delta.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
airboat driver about 35, laid-back, tanned skin, sun-bleached blond hair, aviator sunglasses, sleeveless green shirt, cargo shorts, ear protectors around his neck, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Luftbootführer um die 35, sonnengebleichtes Haar, Pilotenbrille, ärmelloses grünes Shirt. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `delphine` – Delphine

- **Rolle:** Fischerin auf der Pelikaninsel.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
fisherwoman about 50, tough and witty, dark brown skin, short grey locs, orange fishing bib overalls, rubber boots, fish basket, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Fischerin um die 50, kurze graue Locs, orange Fischerlatzhose, Fischkorb. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `oldPete` – Old Pete

- **Rolle:** Netzmacher auf der Pelikaninsel.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
old net maker about 75, patient, weathered light skin, long white beard, knitted grey cap, thick cream fisherman's sweater, canvas trousers, fishing net over his arm, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: alter Netzmacher um die 75, langer weißer Bart, graue Strickmütze, dicker Fischerpullover, Netz über dem Arm. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `coral` – Coral

- **Rolle:** Kind auf der Pelikaninsel, sammelt Muscheln im Watt.
- **Akt:** 3
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** frei

PixelLab:

```
8 year old girl, short, child height, curious, brown skin, two curly pigtails, yellow raincoat, red rubber boots, bucket of shells, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 8 Jahren, zwei lockige Zöpfe, gelbe Regenjacke, rote Gummistiefel, Eimer mit Muscheln. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `mira` – Mira Castillo

- **Rolle:** Clubchefin 7 in Desert Springs, Wunderkind.
- **Akt:** 3, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel (Wunderkind, Stein im Canyon); Aussehen frei

PixelLab:

```
10 year old girl, short, child height, serious and quick, brown skin, black hair in a thick braid, dusty red bandana around her neck, sun-faded green t-shirt, khaki shorts, sneakers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 10 Jahren, ernst und schnell, dicker schwarzer Zopf, staubiges rotes Halstuch, ausgeblichenes grünes Shirt. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `tomas` – Tomás Castillo

- **Rolle:** Miras Bruder, Mechaniker in der Garage.
- **Akt:** 3, 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
17 year old boy, short, child height, easygoing, brown skin, black hair under a backwards cap, oil-stained grey mechanic's overall with rolled sleeves, work boots, ratchet wrench, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 17 Jahren, gelassen, schwarze Haare unter verkehrter Kappe, ölverschmierter grauer Mechanikeroverall, Ratschenschlüssel. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `dot` – Dot (Dorothy Marsh)

- **Rolle:** Motelbesitzerin, Fernschach mit Mrs. Whitlock.
- **Akt:** 3, 4
- **Größe:** erwachsen
- **Aussehen:** Roman (Lockenwickler)

PixelLab:

```
old woman about 70, eccentric and warm, light skin, grey hair in pink curlers, cat-eye glasses, turquoise housecoat over a flowered dress, slippers, bundle of letters, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: alte Frau um die 70, graue Haare auf rosa Lockenwicklern, Katzenaugenbrille, türkiser Hausmantel, Briefbündel. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `buck` – Buck Harmon

- **Rolle:** Tankwart, Blitz auf der Motorhaube.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** Roman (Zahnstocher)

PixelLab:

```
gas station attendant about 60, loud joker, sunburnt light skin, grey stubble, toothpick in mouth, red cap, grease-stained blue work shirt with name patch, jeans, boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Tankwart um die 60, Zahnstocher im Mund, rote Kappe, blaues Arbeitshemd mit Namensschild. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `okoro` – Mr. Samuel Okoro

- **Rolle:** Antiquariat im alten Bahnhof, hütet den Nachlass der Hales.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
Nigerian American bookseller about 70, quiet and courteous, dark skin, short white hair, white goatee, glasses, brown cardigan over a white shirt, bow tie, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: nigerianisch-amerikanischer Buchhändler um die 70, kurzes weißes Haar, weißer Kinnbart, Brille, braune Strickjacke, Fliege. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `hafenarbeiter` – Der Hafenarbeiter von 1852

- **Rolle:** Schlug Ambrose in einer Partie am Kai (Erinnerung).
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
dock worker about 30 in 1852, strong and modest, dark skin, short beard, worn linen shirt, brown vest, cap, rolled trousers, bare forearms, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Hafenarbeiter um die 30 im Jahr 1852, kräftig und bescheiden, kurzer Bart, abgetragenes Leinenhemd, Mütze. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `claire` – Claire Whitlock (1852)

- **Rolle:** Ambroses kleine Schwester in der Erinnerung.
- **Akt:** 3
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Roman Kap. 38 (Kleid mit Leimflecken)

PixelLab:

```
8 year old girl in 1852, short, child height, bright and cheeky, pale skin, dark hair in two braids, plain blue cotton dress with glue stains, white apron, black boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 8 Jahren im Jahr 1852, frech, dunkle Zöpfe, schlichtes blaues Kleid mit Leimflecken, weiße Schürze. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `vaterWhitlock` – Ambroses Vater (1840 und 1852)

- **Rolle:** Klavierbauer und -stimmer in der Erinnerung.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** Roman Kap. 38 (graues Haar, Werkbank)

PixelLab:

```
piano tuner about 45 in 1852, patient, pale skin, grey hair, short grey beard, brown leather apron over a white shirt with rolled sleeves, waistcoat, tuning hammer in hand, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Klavierstimmer um die 45 im Jahr 1852, graues Haar, kurzer grauer Bart, Lederschürze, Stimmhammer. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `holloway` – Mrs. Holloway

- **Rolle:** Wanderin, ein Satz zum Königsangriff.
- **Akt:** 3
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
hiker woman about 60, energetic, dark brown skin, short grey natural hair, sun visor, purple hiking jacket, grey trousers, boots, map in hand, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Wanderin um die 60, kurzes graues Naturhaar, Sonnenschild, lila Wanderjacke, Karte in der Hand. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `ngata` – Dr. Ngata

- **Rolle:** Astronom an der Sternwarte, spielt nachts per Funk.
- **Akt:** 3, 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
Maori New Zealander astronomer about 55, warm and curious, brown skin, grey curly hair, short beard, thick glasses, dark blue down jacket over a star-print shirt, headlamp, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Astronom um die 55, graues lockiges Haar, kurzer Bart, dicke Brille, dunkelblaue Daunenjacke, Stirnlampe. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `lucia` – Lucía

- **Rolle:** Studentin an der Sternwarte.
- **Akt:** 3, 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
astronomy student about 23, cheerful, light brown skin, long black hair in a messy bun with a pencil, red knitted scarf, grey parka, notebook, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Studentin um die 23, langer schwarzer Knoten mit Bleistift, roter Strickschal, grauer Parka. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

## Akt 4: Hochebene, Summit City, Crossroads, Pinewood, Ghost Town, See, Capital Arena

### `ward` – Großmeisterin Eleanor Ward

- **Rolle:** Clubchefin 8 in Summit City, Endspiele.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Roman (schmal, weißes Haar streng zurückgebunden)

PixelLab:

```
slim woman in her mid sixties, austere and kind, pale skin, white hair tied back strictly, dark grey wool coat, cream turtleneck, dark trousers, hiking boots, a single silver pin, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: schmale Frau Mitte sechzig, streng und freundlich, weißes streng zurückgebundenes Haar, dunkelgrauer Wollmantel, cremefarbener Rollkragen. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `kit` – Kit Aldana

- **Rolle:** Clubmitglied in Summit City, Bergführerkind.
- **Akt:** 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
15 year old girl, short, child height, outdoorsy, tan skin, short black hair under a red knit beanie, orange fleece jacket, grey hiking trousers, hiking boots, coil of rope, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 15 Jahren, kurzes schwarzes Haar unter roter Strickmütze, orange Fleecejacke, Seil über der Schulter. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `haraldsen` – Mr. Nils Haraldsen

- **Rolle:** Seilbahnwärter in Summit City.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Roman (Pullover); Aussehen frei

PixelLab:

```
Norwegian American man about 70, calm, ruddy light skin, white beard, wool cap, thick patterned Nordic sweater, navy trousers, boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: norwegisch-amerikanischer Mann um die 70, weißer Bart, Wollmütze, dicker gemusterter Norwegerpullover. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `sol` – Bergführerin Sol (Soledad Reyna)

- **Rolle:** Straßengegnerin am Berg.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
mountain guide woman in her mid thirties, confident, brown skin, long black braid, sunglasses on her head, red softshell jacket, black climbing trousers, boots, carabiners on harness, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Bergführerin Mitte dreißig, langer schwarzer Zopf, Sonnenbrille auf dem Kopf, rote Jacke, Karabiner am Gurt. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `wren` – Wren Okoro

- **Rolle:** Kletterin an den Felstürmen (unten am Seil).
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
young climber woman about 25, steady, dark skin, short natural hair under a white helmet, purple climbing top, grey trousers, harness with rope, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Kletterin um die 25, kurzes Naturhaar unter weißem Helm, lila Kletteroberteil, Gurt mit Seil. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `ferris` – Sol Ferris

- **Rolle:** Kletterin an den Felstürmen (oben am Seil).
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
young climber woman about 28, daring, freckled light skin, copper red hair in a braid, orange helmet, teal climbing top, beige trousers, harness, chalk bag, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Kletterin um die 28, Sommersprossen, kupferroter Zopf, oranger Helm, Kreidebeutel. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `kira` – Kira Vell

- **Rolle:** Schülerin auf der Hochebene, erklärt „Falke und Bison“.
- **Akt:** 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel (heutige Kleidung, keine Kostüme); Aussehen frei

PixelLab:

```
13 year old girl, short, child height, confident and funny, medium brown skin, long straight black hair, denim jacket with patches over a red hoodie, black jeans, sneakers, carved wooden falcon chess piece, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 13 Jahren, selbstbewusst und witzig, langes glattes schwarzes Haar, Jeansjacke mit Aufnähern über rotem Hoodie, geschnitzte Falkenfigur. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

_Hinweis:_ Familie Vell: Menschen von heute mit heutiger Kleidung. Keine Kostüme, keine Federn, kein Schmuck, der eine Herkunft „ausstellt“. Für die Vell-Familien gilt die Sensibilitätslesung vor der Veröffentlichung.

### `annek` – Annek Vell

- **Rolle:** Lehrerin auf der Hochebene (Mathematik und Sport), Kiras Tante.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Bibel (heutige Kleidung); Aussehen frei

PixelLab:

```
woman about 40, brisk teacher, medium brown skin, black hair in a low ponytail, whistle around her neck, navy school fleece jacket, grey sweatpants, running shoes, clipboard, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Lehrerin um die 40, schwarzer tiefer Pferdeschwanz, Pfeife um den Hals, dunkelblaue Schul-Fleecejacke, Klemmbrett. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `joss` – Joss Vell

- **Rolle:** Mechaniker auf der Hochebene.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Bibel (heutige Kleidung); Aussehen frei

PixelLab:

```
man about 45, laid-back mechanic, medium brown skin, short black hair, short beard, faded blue work shirt, dark jeans, work boots, wrench in his back pocket, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mechaniker um die 45, kurzes schwarzes Haar, kurzer Bart, verblichenes blaues Arbeitshemd. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `darlene` – Darlene Moss

- **Rolle:** Betreibt die Raststätte in Crossroads und den Varianten-Tisch.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
diner owner woman about 60, big laugh, light skin, big teased blonde hair, pink waitress dress with white collar, white apron, coffee pot, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Raststättenwirtin um die 60, große toupierte blonde Haare, rosa Kellnerinnenkleid, Kaffeekanne. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `bell` – Rangerin Bell

- **Rolle:** Rangerin am Geysirbecken.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
park ranger woman about 45, firm and friendly, dark brown skin, short grey-black hair, flat-brimmed ranger hat, khaki ranger shirt with badge, olive trousers, boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Rangerin um die 45, kurzes grauschwarzes Haar, Rangerhut, khakifarbenes Hemd mit Abzeichen. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `rayCastillo` – Ray Castillo

- **Rolle:** Sturmjäger auf der Prärie.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
storm chaser man about 40, excited, tan skin, black stubble, red cap, windbreaker covered in weather patches, cargo trousers, boots, handheld weather meter, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Sturmjäger um die 40, Bartschatten, rote Kappe, Windjacke mit Aufnähern, Messgerät in der Hand. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `dolores` – Dolores

- **Rolle:** Schaustellerin mit Automaten am Jahrmarkt.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
fairground woman about 50, theatrical, olive skin, big black curls, red lipstick, gold hoop earrings, purple velvet waistcoat over a white blouse, long black skirt, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Schaustellerin um die 50, große schwarze Locken, roter Lippenstift, lila Samtweste. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `ike` – Ike

- **Rolle:** Sohn der Schaustellerin, spielt gern.
- **Akt:** 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** frei

PixelLab:

```
11 year old boy, short, child height, friendly, olive skin, curly black hair, oversized red bow tie, striped red and white shirt, black shorts, sneakers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 11 Jahren, freundlich, schwarze Locken, große rote Fliege, rot-weiß gestreiftes Hemd. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `hollis` – Rangerin Maya Hollis

- **Rolle:** Rangerin im Pinewood Camp, Straßengegnerin.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
park ranger woman in her late twenties, calm, light skin, auburn hair in a low bun, green ranger cap, olive ranger jacket with patch, khaki trousers, boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Rangerin Ende zwanzig, rotbraunes Haar im Knoten, grüne Rangermütze, olivgrüne Jacke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `ezra` – Ezra Quint

- **Rolle:** Camp-Betreuer in Pinewood, Gitarre mit zwei fehlenden Saiten.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Roman (Gitarre); Aussehen frei

PixelLab:

```
camp counselor about 20, goofy and warm, light brown skin, curly dark hair, bright orange camp t-shirt, khaki shorts, sneakers, acoustic guitar on his back, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Campbetreuer um die 20, lockiges dunkles Haar, knallorange Camp-Shirt, Gitarre auf dem Rücken. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `greta` – Greta

- **Rolle:** Hüttenwirtin am Fernwanderweg.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
hut keeper woman about 55, hearty, ruddy light skin, blonde braids pinned around her head, green dirndl-free plain wool dress with a grey apron, thick socks, clogs, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Hüttenwirtin um die 55, blonde um den Kopf gesteckte Zöpfe, schlichtes grünes Wollkleid mit grauer Schürze. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `juniper` – Juniper

- **Rolle:** Kletterin am Rand des Fernwanderwegs.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
young woman about 22, wild and cheerful, tanned skin, messy blonde dreadlocks, yellow climbing helmet, red tank top, rolled climbing trousers, chalky hands, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Kletterin um die 22, wilde blonde Dreadlocks, gelber Helm, rotes Top. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `pruitt` – Mr. Pruitt

- **Rolle:** Einziger Bewohner von Ghost Town, Metalldetektor.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Roman (sehr helle Augen unter dem Hut)

PixelLab:

```
old prospector-looking man about 78, quiet, weathered tanned skin, very pale blue eyes, white stubble, wide dusty brown hat, faded denim shirt, leather vest, metal detector, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: alter Mann um die 78, sehr helle blaue Augen unter breitem staubigem Hut, verblichenes Jeanshemd, Lederweste, Metalldetektor. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `gideon` – Gideon (Schmied, 1866)

- **Rolle:** Schmied der Siedlung, bei Ambrose in der letzten Nacht.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Roman Kap. 56, 57 (Hände wie Big Joe, zählt Springerzüge)

PixelLab:

```
blacksmith about 40 in 1866, big and gentle, dark skin, shaved head, short beard, huge hands, leather apron over a rough grey shirt with rolled sleeves, heavy boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Schmied um die 40 im Jahr 1866, groß und sanft, kahl rasiert, kurzer Bart, riesige Hände, Lederschürze. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `postreiter` – Postreiter (1866)

- **Rolle:** Nimmt Ambroses letzten Brief mit.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
mail rider about 25 in 1866, hurried, light skin, dusty brown hair, wide hat, long canvas duster coat, leather satchel, riding boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Postreiter um die 25 im Jahr 1866, staubiges Haar, breiter Hut, langer Staubmantel, Ledertasche. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `abe` – Abe Lindgren

- **Rolle:** Leuchtturmwärter am See, „König der Hügel“.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
lighthouse keeper about 72, gentle storyteller, light skin, white beard, navy knit cap, thick navy sweater, yellow oilskin trousers, brass telescope, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Leuchtturmwärter um die 72, weißer Bart, dunkelblaue Strickmütze und Pullover, Messingfernrohr. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `earl` – Earl Dubois

- **Rolle:** Fernfahrer, Stammgast im Diner an der Wüstenstraße.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Wege; Aussehen frei

PixelLab:

```
Black trucker about 60, easygoing, dark skin, grey beard, red trucker cap, brown leather jacket over a white t-shirt, jeans, cowboy boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Schwarzer Fernfahrer um die 60, grauer Bart, rote Truckerkappe, braune Lederjacke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `mags` – Mags

- **Rolle:** Kreidespringerin im Hinterzimmer des Diners, Funkschach.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
woman about 35, sharp and quick, light skin, short platinum hair, black leather jacket covered in chalk dust, grey t-shirt, black jeans, piece of chalk behind her ear, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Frau um die 35, kurzes platinblondes Haar, schwarze Lederjacke voller Kreidestaub, Kreide hinter dem Ohr. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `ruthKeene` – Ruth Keene („Mama Bear“)

- **Rolle:** Fernfahrerin, Funkschach; auch Gegnerin beim Kreidespringer-Turnier.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Akt 4 (Funk, eigene Uhr); Aussehen frei

PixelLab:

```
big-hearted trucker woman about 55, sturdy, light brown skin, grey curls, black trucker cap with a bear patch, red flannel shirt, denim vest, jeans, boots, own chess clock, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Fernfahrerin um die 55, graue Locken, schwarze Kappe mit Bärenaufnäher, rotes Flanellhemd, eigene Schachuhr. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

_Hinweis:_ `mamaBear` und `ruthKeene` sind dieselbe Person: eine Figur, zwei Kennungen.

### `mo` – Mo

- **Rolle:** Gastgeberin der „Nacht der Kreidespringer“ im U-Bahnhof.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
street event host about 30, energetic, dark brown skin, shaved sides with short locs on top, neon yellow bomber jacket, black t-shirt, black jeans, sneakers, chalk in hand, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Gastgeberin um die 30, kurze Locs, neongelbe Bomberjacke, Kreide in der Hand. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `dime` – Dime

- **Rolle:** Anführer der Blitzspieler im U-Bahnhof, redet ununterbrochen.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Wege (Dime, 40); Aussehen frei

PixelLab:

```
fast-talking man about 40, flashy, light skin, slicked back black hair, gold chain, shiny green tracksuit, white sneakers, chess clock, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mann um die 40, redet ununterbrochen, zurückgegelte schwarze Haare, Goldkette, glänzender grüner Trainingsanzug. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `turnierleiterin` – Turnierleiterin

- **Rolle:** Leitet die Landesmeisterschaft in der Capital Arena.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
tournament director woman about 55, fair and firm, dark skin, short grey afro, rectangular glasses, navy blazer with an official badge, white blouse, grey trousers, clipboard, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Turnierleiterin um die 55, kurzes graues Afro-Haar, eckige Brille, dunkelblauer Blazer mit Abzeichen, Klemmbrett. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `bea` – Bea Lindqvist

- **Rolle:** Vorrundengegnerin bei der Meisterschaft.
- **Akt:** 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel (17, sie); Aussehen frei

PixelLab:

```
17 year old girl, short, child height, cheerful and sharp, pale skin, long blonde hair in a side braid, round glasses, yellow cardigan over a white blouse, blue jeans, sneakers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mädchen von 17 Jahren, blonder Seitenzopf, runde Brille, gelbe Strickjacke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `marcus` – Marcus Oyelaran

- **Rolle:** Vorrundengegner bei der Meisterschaft.
- **Akt:** 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel (16, er); Aussehen frei

PixelLab:

```
16 year old boy, short, child height, polite and intense, dark skin, short neat hair, navy blazer with a school crest over a white shirt, grey trousers, black shoes, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 16 Jahren, höflich und konzentriert, dunkle Haut, dunkelblauer Schulblazer. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `tobias` – Tobias Wren

- **Rolle:** Vorrundengegner, Zeitdruck-Spezialist.
- **Akt:** 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel (18, er); Aussehen frei

PixelLab:

```
18 year old boy, short, child height, nervous energy, light skin, messy brown hair, black hoodie, grey joggers, sneakers, tapping fingers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 18 Jahren, nervös, zerzaustes braunes Haar, schwarzer Hoodie. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `kade` – Kade Sterling

- **Rolle:** Konzern-Junior im Halbfinale, Gerät im Schuh.
- **Akt:** 4
- **Größe:** Kind oder jugendlich („short, child height“)
- **Aussehen:** Bibel; Aussehen frei

PixelLab:

```
17 year old boy, short, child height, arrogant and stiff, light skin, slicked-back blond hair, white Perfect Move team jacket with silver logo, black trousers, white high-tech sneakers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (3×2):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Junge von 17 Jahren, arrogant, zurückgekämmtes blondes Haar, weiße Konzern-Teamjacke, weiße Hightech-Turnschuhe. Blatt mit 3 Spalten × 2 Zeilen, sechs gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt, nachdenklich, überrascht, bitter, lacht. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `kellner` – Kellner

- **Rolle:** Kellner im Café der Innenstadt (Capital Arena).
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** frei

PixelLab:

```
waiter about 30, polite, light brown skin, neat black hair, black vest over a white shirt, black bow tie, long black apron, tray, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Kellner um die 30, schwarze Weste über weißem Hemd, schwarze Fliege, Tablett. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `wanderer` – Wanderer

- **Rolle:** Wanderer an Bergstraße und Fernwanderweg (Statist mit Sprüchen).
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Entscheidungen (gelber Rucksack)

PixelLab:

```
hiker man about 50, steady, light skin, grey beard, bucket hat, big yellow backpack, blue fleece, hiking shorts, walking poles, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Wanderer um die 50, grauer Bart, Fischerhut, großer gelber Rucksack, Wanderstöcke. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `z1` – Z-1 (Greifarm)

- **Rolle:** Prototyp in der alten Tankstelle, spielt allein Schach.
- **Akt:** 4
- **Größe:** erwachsen
- **Aussehen:** Wege; Aussehen frei

PixelLab:

```
old industrial robot arm prototype bolted to a table, scratched white paint, orange joints, two-finger gripper, small red status light, cables, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

_Erzeugen:_ Kein Humanoid und keine Laufanimation: als Objekt erzeugen (`z1` und `greifarm` sind dieselbe Figur).

## Nur Porträt (Fotos und Standbilder, keine Kartenfigur)

### `josiahHale` – Josiah Hale (1858)

- **Rolle:** Ambroses Gegner von 1858, Brückenbauer; Victors Vorfahr.
- **Aussehen:** frei (Familienähnlichkeit mit Victor: gleiche Haarfarbe, gleiche Augen)

Gemini (ohne Vorlage, ein Feld):

```
Zeichne ein einzelnes quadratisches Porträt im Pixelstil wie die übrigen Figuren des Spiels (16-Bit, weiche Schattierung), Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: Mann um die 35 im Jahr 1858, aufrecht und ernst, helle Haut, kurzes aschblondes Haar, gestutzter Backenbart, schlichter dunkelgrauer Gehrock mit hohem Kragen, Taschenuhr; Blick direkt in die Kamera.
```

### `margaretWhitlock` – Margaret Whitlock

- **Rolle:** Die alte Mrs. Whitlock, hat das Brett sechzig Jahre abgestaubt; nur auf Fotos.
- **Aussehen:** frei

Gemini (ohne Vorlage, ein Feld):

```
Zeichne ein einzelnes quadratisches Porträt im Pixelstil wie die übrigen Figuren des Spiels (16-Bit, weiche Schattierung), Kopf und Schultern von vorn, Hintergrund einfarbig hellgrün #00FF00, keine Schrift: alte Frau um die 85, freundlich und listig, helle Haut, weißes hochgestecktes Haar, Perlenkette, hellblaue Strickjacke, ein Brief in der Hand.
```

## Statisten: 17 Typen statt vieler Einzelner

Jeder Typ wird einmal erzeugt und je Akt mit anderem Namen und Satz wiederverwendet (`16_Statisten_und_Tiere.md`). Statisten brauchen nur das Porträtblatt 2×1 (neutral, lächelt). Für Akt 1 zuerst: `kindA`, `kindB`, `jugend`, `rentner`, `rentnerin`, `bauer`, `service`, `fahrer`.

### `statist.kindA` – Kind A (Grundschule, Mädchen)

- **Wo:** Spielplatz, Kreidebrett, Schulhof, Camp.
- **Größe:** Kind oder jugendlich

PixelLab:

```
8 year old girl, short, child height, playful, brown skin, hair in two puffs, pink t-shirt, purple shorts, sneakers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Kind A (Grundschule, Mädchen), genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.kindB` – Kind B (Grundschule, Junge)

- **Wo:** Spielplatz, Pfützen, Stollenmund, Camp.
- **Größe:** Kind oder jugendlich

PixelLab:

```
9 year old boy, short, child height, adventurous, light skin, messy blond hair, green t-shirt, cargo shorts, sneakers, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Kind B (Grundschule, Junge), genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.jugend` – Jugendliche Person

- **Wo:** Park, Skateplatz, Kanalweg, U-Bahnhof.
- **Größe:** Kind oder jugendlich

PixelLab:

```
16 year old teenager, short, child height, relaxed, light brown skin, short dark hair under a grey beanie, oversized navy hoodie, black jeans, sneakers, phone in hand, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Jugendliche Person, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.studentin` – Studentin oder Student

- **Wo:** Akademie, Campus, Sternwarte, Bibliothek.
- **Größe:** erwachsen

PixelLab:

```
university student about 21, busy, East Asian, black bob haircut, round glasses, mustard cardigan, white t-shirt, jeans, tote bag with books, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Studentin oder Student, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.konzern` – Mitarbeiterin von Perfect Move

- **Wo:** Silicon Bay, Bildschirmtische, Riverton, Ironwood.
- **Größe:** erwachsen

PixelLab:

```
corporate employee about 30, smooth smile, light skin, sleek ponytail, white jacket with a small silver logo, white trousers, white sneakers, tablet, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mitarbeiterin von Perfect Move, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.anzug` – Mann im grauen Anzug

- **Wo:** Begleiter von Graham Hale und Victor in Akt 4; Pächter im Diner.
- **Größe:** erwachsen

PixelLab:

```
man about 45, cold and polite, light skin, slicked grey hair, dark sunglasses, grey suit, white shirt, dark grey tie, two phones in hand, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mann im grauen Anzug, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.arbeiter` – Arbeiterin oder Arbeiter im Werk

- **Wo:** Ironwood, Steinbruch, Güterbahnhof.
- **Größe:** erwachsen

PixelLab:

```
factory worker about 40, sturdy, dark skin, yellow hard hat, orange high-visibility vest over a grey work shirt, work trousers, steel-toe boots, lunch box, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Arbeiterin oder Arbeiter im Werk, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.bauer` – Bäuerin oder Bauer

- **Wo:** Landstraße, Kürbishof, Prärie.
- **Größe:** erwachsen

PixelLab:

```
farmer about 50, sunburnt light skin, straw hat, plaid shirt, denim overalls, rubber boots, basket of vegetables, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Bäuerin oder Bauer, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.rentner` – Rentner

- **Wo:** Parkbänke, Bahnhof, Kai, Diner.
- **Größe:** erwachsen

PixelLab:

```
old man about 75, calm, brown skin, white beard, brown flat cap, beige cardigan, grey trousers, walking stick, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Rentner, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.rentnerin` – Rentnerin

- **Wo:** Vorgärten, Markt, Bibliothek, Motel.
- **Größe:** erwachsen

PixelLab:

```
old woman about 75, kind, light skin, short white curls, glasses on a chain, lavender cardigan, floral skirt, handbag, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Rentnerin, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.wanderer` – Wanderin oder Wanderer

- **Wo:** Wege, Canyon, Fernwanderweg, Bergstraße.
- **Größe:** erwachsen

PixelLab:

```
hiker about 35, fit, tan skin, short brown hair, red cap, teal fleece jacket, hiking shorts, boots, big backpack, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Wanderin oder Wanderer, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.fischer` – Fischerin, Fischer, Hafenarbeit

- **Wo:** Kai, Fähre, Pelikaninsel, Delta.
- **Größe:** erwachsen

PixelLab:

```
fisherman about 55, weathered, dark skin, grey stubble, blue knit cap, yellow oilskin jacket, rubber boots, coiled rope, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Fischerin, Fischer, Hafenarbeit, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.musik` – Musikerin oder Musiker

- **Wo:** Port Delacroix, Riverton, Arena.
- **Größe:** erwachsen

PixelLab:

```
street musician about 30, cheerful, dark brown skin, short locs, colourful patterned shirt, brown vest, black trousers, saxophone, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Musikerin oder Musiker, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.ranger` – Rangerin oder Ranger

- **Wo:** Geysire, Pinewood, Canyon, Summit City.
- **Größe:** erwachsen

PixelLab:

```
park ranger about 35, friendly, light skin, flat-brimmed ranger hat, khaki shirt with badge, olive trousers, boots, radio on belt, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Rangerin oder Ranger, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.service` – Bedienung

- **Wo:** Diner, Kantine, Café, Raststätte.
- **Größe:** erwachsen

PixelLab:

```
waitress about 25, friendly, light brown skin, curly hair in a ponytail, light blue diner uniform dress, white apron, notepad, coffee pot, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Bedienung, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.fahrer` – Bus- und Fernfahrer

- **Wo:** Haltestellen, Raststätte, Diner.
- **Größe:** erwachsen

PixelLab:

```
driver about 50, easygoing, light skin, grey stubble, blue cap, blue work jacket with a name patch, jeans, thermos, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Bus- und Fernfahrer, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```

### `statist.hist` – Mensch des 19. Jahrhunderts

- **Wo:** Erinnerungen: London 1851, New York 1857, Port Delacroix 1852, Siedlung 1866.
- **Größe:** erwachsen

PixelLab:

```
townsperson about 40 in the 1850s, plain, light skin, side whiskers, bowler hat, brown wool coat, waistcoat, dark trousers, boots, slightly stylized proportions with a larger head (about one third of the body height), detailed expressive face with clear eyes, eyebrows and mouth, soft shading
```

Gemini, Porträtblatt (2×1):

```
Vorlage: Standbild south dieser Figur anhängen. Zeichne ein Porträtblatt dieser Figur. Die Vorlage ist eine kleine Spielfigur von nur 32 Pixeln Höhe: Übernimm von ihr nur Hautfarbe, Haarfarbe, Frisur und Kleidung, NICHT ihre grobe Pixelgröße. Jedes Porträt ist Pixelkunst mit etwa 64 × 64 Pixeln je Feld, also viel feiner als die Vorlage: klare Augen mit Lichtpunkt, Augenbrauen, Nase und ein ausdrucksvoller Mund, weiche Schattierung in 2 bis 3 Stufen, dunkler Umriss, harte Pixelkanten ohne Weichzeichnen. Die Figur: Mensch des 19. Jahrhunderts, genau wie die Vorlage. Blatt mit 2 Spalten × 1 Zeile, zwei gleich große quadratische Felder, in jedem Feld Kopf und Schultern von vorn, Blick zum Betrachter. Ausdrücke in dieser Reihenfolge: neutral, lächelt. Hintergrund in jedem Feld einfarbig hellgrün #00FF00, keine Ränder, keine Schrift.
```
