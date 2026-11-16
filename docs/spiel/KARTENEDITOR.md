# Karteneditor: Anleitung

Mit dem Karteneditor rückst du Karten des Schach-Abenteuers selbst zurecht: Bilder verschieben,
drehen, kopieren, löschen, neue aus der Bibliothek holen. Er läuft am Windows-PC in Chrome oder
Edge, ohne Installation und ohne Internet.

## 1. Herunterladen

1. Im privaten Repository `schach-abenteuer-inhalte` den Ordner `editor` öffnen.
2. Den ganzen Ordner herunterladen (auf GitHub: „Code“ → „Download ZIP“, dann entpacken).
3. Wichtig: `index.html`, `daten.js`, `editor.css` und der Ordner `js` müssen
   zusammen in einem Ordner liegen.

Das Paket ist etwa 16 MB groß. Es enthält alle Karten und Bilder. Nicht weitergeben:
Die gekauften Bilder dürfen nicht öffentlich werden.

## 2. Öffnen

Doppelklick auf `index.html`. Die Seite öffnet sich in Chrome oder Edge.

- Links: alle Karten, nach Ort sortiert, mit Suchfeld.
- Mitte: die Karte wie im Spiel.
- Rechts oben: das ausgewählte Bild mit allen Knöpfen.
- Rechts unten: die Bibliothek mit allen Bildern.

Ein gelber Punkt ● in der Kartenliste heißt: Diese Karte hast du geändert.
„+1“ oder „+2“ heißt: Es gibt Fassungen derselben Karte (etwa das Diner mit und ohne Tischset).
Ganz unten steht die Gruppe „Varianten“: die Varianten B und C der Karten (zur Wahl gebaut). Auch
sie lassen sich bearbeiten; der Rücklauf schreibt sie an ihren Platz zurück.

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
  Entf löscht auch Auslöser (blau). Figuren (rosa) und Belebung (grün) erst nach einer Rückfrage,
  weil sie zur Geschichte gehören; die Rückfrage nennt das Gespräch der Figur. Strg+Z holt sie zurück.
- Strg+D bei Auslösern, Figuren und Belebung: Kopie eine Kachel rechts daneben (bei Statisten
  wandert der Laufweg mit).

**Neue Bilder**

- Rechts unten in der Bibliothek suchen („Sofa“, „Brücke“, „Laterne“) oder die Gruppen aufklappen.
- Ein Bild in die Karte ziehen. Oder anklicken: Es landet in der Mitte der Ansicht.
- „Zuletzt benutzt“ steht ganz oben.

**Ansicht**

- Mausrad: zoomen. Rechte Maustaste ziehen (oder Leertaste + Ziehen): Ansicht verschieben.
- Raster: Kacheln mit Koordinaten, wie in deinen Notizen „(x, y)“. Unten links steht immer
  die Kachel unter der Maus.
- Kollision (Taste K): transparent gelb mit gelbem Rand, wo man nicht laufen kann, auch unter ausgeblendeten Bildern.
  Figuren und Statisten, die an einem Fleck stehen, sperren ihre Kachel wie im Spiel. Steht jemand
  nur manchmal da (eine Figur erst ab einem Punkt der Geschichte, ein Statist nur tagsüber), hat
  seine Kachel einen gestrichelten Rand. Wer herumläuft, sperrt nicht.
- Nur Umgebung: blendet Möbel, Deko und Figuren aus.
- Umgebung sperren: Boden, Wände und Gebäude lassen sich nicht mehr anklicken. Ausnahme:
  Bodenkacheln, die auf einem Möbel liegen (Dielen über der Treppe nach unten), bleiben anwählbar.
- Vorher: zeigt das Original zum Vergleich.
- Pinsel: malt den Boden um (Boden, Wand, Wasser oder die Sonderböden der Karte).
  Der genaue Rand wird erst beim Einarbeiten gezeichnet.

**Durchgehen oder sperren** (Feld „Kollision“ rechts, wirkt auf alles Ausgewählte)

- „Sperrt“: wie eine Wand. „Durchgehbar“: man läuft hindurch.
- Bei „Durchgehbar“ erscheint ein Feld für den Grund. Kurz schreiben, warum
  (etwa „nur ein Schatten“). Ohne Grund steht ein gelber Hinweis da, und der Bericht meldet es.
- „Kollision bearbeiten“ (ein Bild auswählen): Die Kacheln des Bildes werden grün (frei) und
  rot (gesperrt). Klick auf eine Kachel schaltet sie um. „Fertig“ oder Esc beendet das.
- „Zurück zum Katalog“: Das Bild sperrt wieder wie überall.
- Das gilt nur an dieser Stelle. Dasselbe Möbel anderswo bleibt, wie es ist.
- Strg+Z macht jeden Klick rückgängig.

**Kollision malen** (Knopf „Kollisionspinsel“ oben, Tasten S, O, X)

Mit dem Kollisionspinsel malst du Kacheln einfach als gesperrt oder frei, egal welches Bild
dort liegt. Beispiel: Ein Gebäudebild sperrt eine Fläche, durch die man gehen können soll. Oder am
Rand fehlt eine unsichtbare Sperre.

- „Sperren“ (Taste S): Die Kachel sperrt wie eine Wand. Sie wird gelb mit einem kleinen Kreuz.
- „Freigeben“ (Taste O): Man kann hier gehen, auch wenn ein Bild oder die Wand darunter
  sperrt. Die Kachel bekommt eine grüne Umrandung: Dort hast du etwas übersteuert.
  Figuren und Statisten halten den Helden trotzdem auf.
- „Radierer“ (Taste X): Entfernt, was du gemalt hast. Dann gilt wieder, was Bilder und Wände sagen.
- Mit gedrückter Maus über mehrere Kacheln ziehen. Mit Umschalt ziehen: ein ganzes Rechteck.
- Dieselbe Taste noch einmal oder Esc beendet den Pinsel. Die Kollisionsanzeige geht von selbst an.
- Freigabe in einer Wand: Rechts erscheint ein Feld für den Grund (etwa „Geheimgang“). Ohne Grund
  meldet der Kartenbau das.
- Strg+Z macht jeden Strich rückgängig. „Auf Fassungen übertragen“ nimmt die Kacheln mit.

Unterschied zu „Kollision bearbeiten“: Das ändert ein einzelnes Bild an dieser Stelle (wandert
mit, wenn du das Bild verschiebst). Der Kollisionspinsel gilt für die Kachel der Karte, egal was
dort liegt, und bleibt, wenn du das Bild verschiebst.

**Übergänge und Auslöser**

- Rechts „Übergang oder Auslöser anlegen“: in der Liste „wie treppe“ (oder einen anderen) wählen,
  „Übergang hier“ drücken, dann die Kachel anklicken. Es entsteht eine Kopie mit gleichem Ziel.
- Strg+D setzt eine weitere Kopie rechts daneben (für breite Durchgänge). Entf löscht sie.

**Zur Umgebung zählen:** Gebäude, Häuser, Gebäudeteile, Türme, Stollen, Tribünen, Brücken,
Stege, Wasser, Felsen, Gleise, Bodenbilder, Bordsteine und Straßenmarkierungen.
Alles andere (Möbel, Deko, Pflanzen, Bäume, Zäune, Türen, Fahrzeuge) sind Objekte.

**Fassungen:** Hat eine Karte Fassungen, steht rechts ein grüner Hinweis. Der Knopf
„Auswahl auf Fassungen übertragen“ verschiebt dieselben Bilder dort genauso.

**Notizen:** Rechts gibt es ein Feld „Notiz zur Karte“ und bei einem ausgewählten Bild
„Notiz zu diesem Objekt“. Schreib dort kurz, warum. Das kommt mit in die Datei.

## 4. Treppenabgang selbst bauen

So entsteht ein Loch im Boden ohne eigenes Lochbild:

1. Eine Treppe nach unten aus der Bibliothek holen (Suche „Treppe ab“) und hinlegen.
2. Bibliothek, Suche „bk“ oder den Boden der Karte („Dielen“, „Fliesen“, „Teppich“,
   „Stein“, „Gras“, „Erde“): Diese Bodenkacheln (16 × 16) auf den Teil der Treppe legen,
   der Boden sein soll. Sie liegen immer über der Treppe, man läuft darüber.
3. Die Treppe auswählen, „Kollision bearbeiten“: Abgedeckte Kacheln grün (frei),
   Lochränder und tiefe Stufen rot (gesperrt), die Einstiegskachel grün.
4. „wie treppe“ wählen, „Übergang hier“, Einstiegskachel anklicken; für zwei Kacheln Strg+D.
5. Wie immer herunterladen und schicken.

Eine abgedeckte Treppe nach unten gilt im Kartenbau als Loch im Boden (Regel 10.84) und wird
flach gezeichnet: Der Held läuft über die Dielen, nicht darunter.

## 5. Tastenkürzel

Taste ? zeigt alle Kürzel.

| Taste                 | Wirkung                       |
| --------------------- | ----------------------------- |
| Strg+Z / Strg+Y       | rückgängig / wiederholen      |
| Strg+D                | duplizieren                   |
| Entf                  | löschen (Figuren mit Rückfrage) |
| R / Umschalt+R        | drehen rechts / links         |
| H                     | spiegeln                      |
| Bild auf / Bild ab    | nach vorn / nach hinten       |
| Pfeile (+ Umschalt)   | 1 Pixel (1 Kachel)            |
| Strg+A                | alles auswählen               |
| Strg+S                | Änderungen herunterladen      |
| G, K, M               | Raster, Kollision, Markierung |
| U, L, V, B            | Umgebung, Sperren, Vorher, Pinsel |
| S, O, X               | Kollisionspinsel: sperren, freigeben, Radierer |
| F                     | ganze Karte zeigen            |
| Esc                   | Auswahl aufheben, Modus beenden |

## 6. Speichern und zurückschicken

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
- Kollision je Objekt (pipeline/abenteuer/objektkollision.py): `kollision` (bool), `maske` (wie
  im Katalog, im Raster des ungedrehten, skalierten Bildes; dreht und spiegelt mit, bleibt anders als
  die Katalogmaske auch mit Maßstab), `begehbar_grund` (Pflicht, wenn ein nicht flaches, laut
  Katalog sperrendes Möbel hier durchgehbar wird; sonst Befund im Kartenbau). Die Karte trägt die
  geformte Maske als Eigenschaft `maske` („#.../....“), die App liest sie (oberwelt/moebelform.ts).
  Der Rücklauf nennt jede Übersteuerung mit Katalogwert und Grund und sammelt sie am Ende unter
  „Kollision an einzelnen Stellen“: Daraus lässt sich ablesen, welche Katalogeinträge falsch sind.
- Bodenkacheln: `python -m pipeline.abenteuer.bodenkacheln` erzeugt `moebel/bodenkacheln.json`
  aus materialien.json (Feld, unter_wand, Randblock, Wand oben/unten/Krone; `ausschnitt` aus dem
  Bogen). Über einem Abgang (treppe, runter) liegen Bodenteile direkt darüber und der Abgang wird
  flach und zählt als Bodenöffnung (pipeline/abenteuer/bodenteile.py).
- Änderungsdatei ab Editor 1.1: `markierungen` (Zuordnung je Auslöser, Figur, Belebung), damit der
  Rücklauf neue und gelöschte Auslöser meldet.
- Editor 1.2 (16.11.2026):
  - Figuren als Hindernis wie in der App (oberwelt/begehbar.ts): Figuren und stehende Belebung
    (von gleich bis, Tiere ohne fliegen, schwimmen, folgen) sperren; bedingt (Figur mit `wenn` in
    orte.json, Statist mit `wann` außer `immer`) gestrichelt. Das Paket trägt dafür je Karte
    `figurangaben` (Name → `wenn`, `dialog`).
  - Figuren und Belebung löschen (Rückfrage, js/markierungen.js) und kopieren. Der Rücklauf warnt
    (pipeline/abenteuer/editorfiguren.py), wenn eine gelöschte Figur einen `dialog` (Ink-Knoten) hat
    oder eine Quest ihren Knoten oder sie als `ziel.objekt` braucht, und nennt die Karten, auf denen
    sie noch steht; ebenso doppelte Figuren nach einer Kopie und gelöschte Statisten mit `sagt`.
  - Varianten: `szenen/varianten/*.json` im Paket als `varianten/<name>.json`, Gruppe „Varianten“,
    ohne Hintergrund (der Editor zeichnet Boden und Wandflächen selbst); der Rücklauf schreibt dorthin
    zurück und baut sie wie jede Szene.
  - „Umgebung sperren“: Statt eines eigenen Schalters bleiben Bodenkacheln (Art `boden_teil`)
    anwählbar, wenn sie ein Nicht-Umgebungs-Bild berühren. Einfacher als ein weiterer Knopf, und die
    438 Kaimauerstücke in Silicon Bay (auch `boden_teil`) bleiben gesperrt, solange sie kein Möbel berühren.
  - Prüfungen mit Formfeldern (pipeline/abenteuer/objektrichtung.py): Ausrichtung (10.78),
    Tischlage (10.79), Anordnung (10.80 ff.), Fahrzeuge (10.65) und Übergangsbilder (10.77) lesen
    Blick, Lauf, Ende und Platte so, wie das Bild auf der Karte liegt (gespiegelt: links und rechts
    tauschen; gedreht: die Richtung dreht mit); Pixelprüfungen mit `objektform.formbild` und dem
    Katalogfeld `ausschnitt`. Der Bericht zeigt eine eigene Maske so, wie sie auf der Karte liegt.
- Editor 1.3 (16.11.2026), Kollisionspinsel (js/pinsel.js, pipeline/abenteuer/kollisionspinsel.py):
  - Szenenfelder `sperren` und `freigeben` (Listen `[x, y]`) und `freigeben_grund`. Die Freigabe
    sticht Möbel, Masken und Raster, nicht Figuren. Eine Maskenkachel eines Möbels entfällt, wenn
    ihr Pixelrechteck eine Freigabe berührt (wie begehbar.ts bei Feinschub).
  - Kartenbau: `platziere` nimmt die Kacheln aus den Masken (`gib_frei`), die Tiled-Karte trägt
    Sperren als Wandkachel in `waende`, Freigaben als Boden, geänderte Masken als Eigenschaft
    `maske` und die Karteneigenschaften `sperren` und `freigeben` („3,4;5,6“, App:
    oberwelt/begehbar.ts, Prüfung: karten.blockiert). Durchgang, Übergänge, Figurensperre,
    Abkürzung und Kartenregeln (Eingänge, Türen) rechnen mit `gesperrte_felder(…, szene)`.
  - Befunde: Freigabe auf Wand, Wasser oder Leere ohne `freigeben_grund`, Kacheln außerhalb, in
    beiden Listen, Auslöser auf einer gemalten Sperre. Hinweise: Freigabe auf ohnehin freier und
    Sperre auf ohnehin gesperrter Kachel. Der Editor schreibt solche Kacheln gar nicht erst.
  - Rücklauf: „Kollision: Pinsel sperrt / gibt frei unter BILD (sperrte dort)“ je Karte, gruppiert
    nach dem Bild darunter; die Zeilen stehen auch unter „Kollision an einzelnen Stellen“.
  - Kollisionsanzeige wie die App: Ein Möbel mit Feinschub sperrt jede berührte Kachel (vorher
    zeigte der Editor die Kachel nach `x // 16`).
- Test: `node werkzeuge/karteneditor/test/editor.test.cjs` (Playwright, Chromium über file://),
  Kollision und Treppenabgang in `test/kollision.cjs` (an einer Kopie des Dachbodens im Testordner),
  Figuren, Varianten und Bodenkacheln in `test/figuren.cjs`, Kollisionspinsel in `test/pinsel.cjs`.
