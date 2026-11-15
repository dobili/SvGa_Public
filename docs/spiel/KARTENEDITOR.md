# Karteneditor: Anleitung

Mit dem Karteneditor rückst du Karten des Schach-Abenteuers selbst zurecht: Bilder verschieben,
drehen, kopieren, löschen, neue aus der Bibliothek holen. Er läuft am Windows-PC in Chrome oder
Edge, ohne Installation und ohne Internet.

## 1. Herunterladen

1. Im privaten Repository `schach-abenteuer-inhalte` den Ordner `editor` öffnen.
2. Den ganzen Ordner herunterladen (auf GitHub: „Code“ → „Download ZIP“, dann entpacken).
3. Wichtig: `index.html`, `daten.js`, `editor.css` und der Ordner `js` müssen
   zusammen in einem Ordner liegen.

Das Paket ist etwa 13 MB groß. Es enthält alle Karten und Bilder. Nicht weitergeben:
Die gekauften Bilder dürfen nicht öffentlich werden.

## 2. Öffnen

Doppelklick auf `index.html`. Die Seite öffnet sich in Chrome oder Edge.

- Links: alle Karten, nach Ort sortiert, mit Suchfeld.
- Mitte: die Karte wie im Spiel.
- Rechts oben: das ausgewählte Bild mit allen Knöpfen.
- Rechts unten: die Bibliothek mit allen Bildern.

Ein gelber Punkt ● in der Kartenliste heißt: Diese Karte hast du geändert.
„+1“ oder „+2“ heißt: Es gibt Fassungen derselben Karte (etwa das Diner mit und ohne Tischset).

## 3. Bedienung

**Auswählen**

- Klick auf ein Bild wählt es aus (gelber Rahmen).
- Liegen mehrere Bilder übereinander, erscheint eine kleine Liste. Dort das richtige anklicken.
  Oder einfach noch einmal an dieselbe Stelle klicken: Dann kommt das Bild darunter.
- Strg+Klick nimmt ein weiteres Bild dazu oder wieder heraus.
- Auf freier Fläche ziehen: Rechteck, alles darin wird ausgewählt. Mit Strg kommt es dazu.

**Verschieben**

- Ziehen: Das Bild rastet auf die Kacheln ein.
- Alt gedrückt halten beim Ziehen: pixelgenau.
- Pfeiltasten: 1 Pixel. Mit Umschalt: eine Kachel.
- Auslöser (blau), Figuren (rosa) und Belebung (grün) lassen sich genauso verschieben.

**Bearbeiten** (wirkt immer auf alles Ausgewählte)

- Drehen: Knöpfe ⟲ und ⟳ oder Taste R.
- Spiegeln: Knopf oder Taste H.
- Größe: Knöpfe − und + oder eine Zahl zwischen 50 und 300 %.
- Ebene: „nach vorn“ und „nach hinten“ legen ein Bild vor oder hinter seinen Nachbarn,
  ⇈ und ⇊ ganz nach vorn oder ganz nach hinten. Die Zahl zeigt die Verschiebung.
- Duplizieren: Strg+D. Mehrere Bilder werden als Gruppe kopiert, mit gleichen Abständen,
  eine Kachel versetzt. Danach sind die Kopien ausgewählt.
- Löschen: Entf. Was auf einem Tisch steht, verschwindet mit dem Tisch.

**Neue Bilder**

- Rechts unten in der Bibliothek suchen („Sofa“, „Brücke“, „Laterne“) oder die Gruppen aufklappen.
- Ein Bild in die Karte ziehen. Oder anklicken: Es landet in der Mitte der Ansicht.
- „Zuletzt benutzt“ steht ganz oben.

**Ansicht**

- Mausrad: zoomen. Rechte Maustaste ziehen (oder Leertaste + Ziehen): Ansicht verschieben.
- Raster: Kacheln mit Koordinaten, wie in deinen Notizen „(x, y)“. Unten links steht immer
  die Kachel unter der Maus.
- Kollision: rot, wo man nicht laufen kann.
- Nur Umgebung: blendet Möbel, Deko und Figuren aus.
- Umgebung sperren: Boden, Wände und Gebäude lassen sich nicht mehr anklicken.
- Vorher: zeigt das Original zum Vergleich.
- Pinsel: malt den Boden um (Boden, Wand, Wasser oder die Sonderböden der Karte).
  Der genaue Rand wird erst beim Einarbeiten gezeichnet.

**Zur Umgebung zählen:** Gebäude, Häuser, Gebäudeteile, Türme, Stollen, Tribünen, Brücken,
Stege, Wasser, Felsen, Gleise, Bodenbilder, Bordsteine und Straßenmarkierungen.
Alles andere (Möbel, Deko, Pflanzen, Bäume, Zäune, Türen, Fahrzeuge) sind Objekte.

**Fassungen:** Hat eine Karte Fassungen, steht rechts ein grüner Hinweis. Der Knopf
„Auswahl auf Fassungen übertragen“ verschiebt dieselben Bilder dort genauso.

**Notizen:** Rechts gibt es ein Feld „Notiz zur Karte“ und bei einem ausgewählten Bild
„Notiz zu diesem Objekt“. Schreib dort kurz, warum. Das kommt mit in die Datei.

## 4. Tastenkürzel

Taste ? zeigt alle Kürzel.

| Taste                 | Wirkung                       |
| --------------------- | ----------------------------- |
| Strg+Z / Strg+Y       | rückgängig / wiederholen      |
| Strg+D                | duplizieren                   |
| Entf                  | löschen                       |
| R / Umschalt+R        | drehen rechts / links         |
| H                     | spiegeln                      |
| Bild auf / Bild ab    | nach vorn / nach hinten       |
| Pfeile (+ Umschalt)   | 1 Pixel (1 Kachel)            |
| Strg+A                | alles auswählen               |
| Strg+S                | Änderungen herunterladen      |
| G, K, M               | Raster, Kollision, Markierung |
| U, L, V, B            | Umgebung, Sperren, Vorher, Pinsel |
| F                     | ganze Karte zeigen            |
| Esc                   | Auswahl aufheben              |

## 5. Speichern und zurückschicken

- Deine Änderungen bleiben im Browser gespeichert, auch nach dem Schließen.
  Die Originalkarten werden nie überschrieben.
- Fertig? Oben auf „Änderungen herunterladen“ klicken. Es entsteht eine Datei
  `karteneditor-aenderungen-…json` im Download-Ordner. Sie enthält alle geänderten Karten.
- Diese Datei im privaten Repository in den Ordner `editor/rueck/` hochladen
  (auf GitHub: „Add file“ → „Upload files“).
- Dem Chat Bescheid sagen. Er arbeitet die Änderungen ein, baut die Karten neu und
  schickt dir einen Bericht.
- Danach ein neues Paket herunterladen und „Verwerfen“ klicken, damit der Editor
  wieder bei den neuen Karten anfängt.

## Für den Chat (technisch)

- Paket bauen: `python -m pipeline.abenteuer.editorpaket PRIVAT PRIVAT/editor`
- Rücklauf: `python -m pipeline.abenteuer.editorrueck PRIVAT/editor/rueck/DATEI.json --privat PRIVAT`
  schreibt die Szenen, legt Bericht und Vorschauen nach `buch/arbeit/editor/` und baut die Karten.
  Wurde eine Szene inzwischen anders geändert, bleibt sie unberührt (Konflikt im Bericht,
  `--erzwingen` überschreibt).
- Neue Objektfelder (pipeline/abenteuer/objektform.py): `drehung` (0, 90, 180, 270),
  `spiegeln`, `massstab` (0,5 bis 3) und `ebene` (ganze Zahl, wird zur Tiefe des Kartenbaus
  addiert; Entscheidung: Verschiebung statt fester Tiefe, damit die Tiefe beim Verschieben
  dem Fuß des Bildes folgt).
- Test: `node werkzeuge/karteneditor/test/editor.test.cjs` (Playwright, Chromium über file://).
