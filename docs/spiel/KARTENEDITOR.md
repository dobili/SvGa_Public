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
- Deckkraft: Knöpfe 25 %, 50 %, 75 % und 100 % machen ein Bild durchsichtig (etwa einen Lichtkegel);
  man stößt trotzdem genauso daran an. Duplizieren behält die Deckkraft.
- Ebene: „nach vorn“ und „nach hinten“ legen ein Bild vor oder hinter seinen Nachbarn,
  ⇈ und ⇊ ganz nach vorn oder ganz nach hinten. Die Zahl zeigt die Verschiebung.
- Duplizieren: Strg+D. Mehrere Bilder werden als Gruppe kopiert, mit gleichen Abständen,
  eine Kachel versetzt. Danach sind die Kopien ausgewählt.
- Löschen: Entf. Was auf einem Tisch steht, verschwindet mit dem Tisch.
  Entf löscht auch Auslöser (blau). Figuren (rosa) und Belebung (grün) erst nach einer Rückfrage,
  weil sie zur Geschichte gehören; die Rückfrage nennt das Gespräch der Figur. Strg+Z holt sie zurück.
- Strg+D bei Auslösern, Figuren und Belebung: Kopie eine Kachel rechts daneben (bei Statisten
  wandert der Laufweg mit).

**Zuschneiden** (Feld „Zuschnitt“ rechts, sobald ein Bild ausgewählt ist)

Beispiel: Du brauchst nur den Pfosten eines Zauns (oder eines Viehgatters).

1. Den Zaun aus der Bibliothek holen und auswählen.
2. „Zuschneiden“ drücken. An den vier Kanten erscheinen orange Griffe.
3. Die rechte Kante nach links ziehen, bis nur noch der Pfosten übrig ist. Die Kante rastet auf
   Pixel ein, mit Alt springt sie in 16-Pixel-Schritten. Was weggeschnitten wird, siehst du
   halbdurchsichtig daneben.
4. „Fertig“ oder Esc.

- Statt zu ziehen kannst du die vier Zahlen eintragen (links, oben, rechts, unten: so viele Pixel
  fallen weg) oder mit − und + ändern (1 Pixel, mit Umschalt 16 Pixel).
- Die Zahlen gelten für das Bild, wie es im Katalog liegt, auch wenn du es gedreht oder gespiegelt
  hast. Die Griffe greifen immer die Kante, die du siehst.
- Die linke obere Ecke des Ausschnitts bleibt an ihrer Stelle, wenn du rechts oder unten
  schneidest; schneidest du links oder oben, rückt das Bild mit, und die anderen Kanten bleiben stehen.
- Die Kollision folgt dem Ausschnitt: Kacheln, die ganz wegfallen, sperren nicht mehr.
- „Zuschnitt aufheben“: wieder das ganze Bild.
- Sind mehrere Bilder ausgewählt, gilt der Zuschnitt für alle gleichen Bilder.
- Strg+D behält den Zuschnitt: So setzt du einen Pfosten mehrmals.
- „Als eigenes Bild merken“: Der Ausschnitt steht dann in der Bibliothek unter „Eigene
  Zuschnitte“ (nur in diesem Browser). Anklicken oder in die Karte ziehen setzt ihn mit Zuschnitt;
  × entfernt ihn aus der Liste.
- Strg+Z macht jeden Schritt rückgängig.

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
- Pinsel (B): malt den Boden um (Boden, Wand, Wasser, die Sonderböden der Karte oder „Leer“: schwarz, nicht begehbar, entfernt den Boden).
- Felswände draußen (etwa Zedernpfad) sind kein Bild, sondern „#“ im Boden: Pinsel, „# Felswand (Klippe)“. Der Editor zeigt neue Felsfelder braun, die echte Klippe zeichnet erst der Kartenbau. Eine Wand muss bis zum Rand oder an eine andere Wand laufen.
- Änderungen laden: öffnet eine früher heruntergeladene Änderungsdatei wieder, auch aus einer älteren Editorfassung, und du arbeitest dort weiter.
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

**Kollision fein** (Knopf „Fein“, Taste F)

Sperrt ein Viertel, die Hälfte oder drei Viertel einer Kachel, waagrecht und senkrecht getrennt:
Jede Kachel hat 4 × 4 Zellen von je 4 Pixeln.

- Kollisionspinsel oder „Kollision bearbeiten“ an, dann „Fein“ (F): blaues Gitter, Malen, Radierer,
  Umschalt+Ziehen und Strg+Z in Zellen. Noch einmal F: ganze Kacheln; Esc beendet beides.
- Gelb sind genau die gesperrten Zellen; feine Sperren braun gestrichelt, Freigaben grün umrandet.
- Der Held ist 12 Pixel breit, drei Viertel einer Kachel: Durch eine Lücke von drei Vierteln passt
  er gerade noch, durch eine halbe nicht. Der Kartenbau meldet zu enge Wege.
- Brauner Punkt: Die Kachel ist nur zum Teil gesperrt, zählt aber für Ankunft, Tiere, Statisten
  und Tippschritt als gesperrt. Diese stellen den Helden in die Kachelmitte; dort reicht er bis 2
  Pixel an jede Kante und berührte schon ein gesperrtes Viertel. Gehen kann er bis an die Kante.

**Übergänge und Auslöser**

Kurz: siehe Abschnitt 4 „Übergänge und Ankunft“. Für eine Kopie eines vorhandenen Auslösers:
rechts unter „Übergänge“ in der Liste „wie treppe“ wählen, „Übergang hier“, Kachel anklicken.

**Zur Umgebung zählen:** Gebäude, Häuser, Gebäudeteile, Türme, Stollen, Tribünen, Brücken,
Stege, Wasser, Felsen, Gleise, Bodenbilder, Bordsteine und Straßenmarkierungen.
Alles andere (Möbel, Deko, Pflanzen, Bäume, Zäune, Türen, Fahrzeuge) sind Objekte.

**Fassungen:** Hat eine Karte Fassungen, steht rechts ein grüner Hinweis. Der Knopf
„Auswahl auf Fassungen übertragen“ verschiebt dieselben Bilder dort genauso.

**Blickrichtung (ab 1.7):** Figuren und stehende Statisten zeigt der Editor als Bild in ihrer
Blickrichtung (ohne Bild als Kreis mit Pfeil). Eine oder mehrere auswählen (Strg+Klick), rechts
unter „Blick“ ↑ ↓ ← → wählen; „Vorgabe“ heißt nach unten. Wer am Tresen steht, schaut zum
Tresen, zwei im Gespräch schauen einander an. Sitzende behalten ihre Sitzrichtung.

**Notizen:** Rechts gibt es ein Feld „Notiz zur Karte“ und bei einem ausgewählten Bild
„Notiz zu diesem Objekt“. Schreib dort kurz, warum. Das kommt mit in die Datei.

## 4. Übergänge und Ankunft

Ein Übergang hat zwei Seiten, etwa die Treppe im Wohnzimmer und die Treppe im Zimmer oben. Jede
Seite ist ein blauer Auslöser auf ihrer Karte und sagt, wohin sie führt.

**Sehen, wohin es geht**

- Unter jedem Übergang steht hellblau „→ Zielkarte · Zielauslöser“.
- Das kleine Fußsymbol mit Pfeil zeigt, wo der Held ankommt, wenn er von der anderen Seite
  kommt, und wohin er schaut. Weiß: von selbst gewählt. Türkis: von dir festgelegt.
  Rot: so geht es nicht (Feld gesperrt oder auf einem Auslöser).
- Übergang anklicken, rechts „Zum Ziel“: Die Zielkarte geht auf, die Gegenseite ist ausgewählt.

**Neuen Übergang anlegen**

1. Rechts unter „Übergänge“ auf „Neuer Übergang“ tippen.
2. Art wählen (tuer, treppe, weg …). Zielkarte suchen und wählen.
3. Ziel: einen Auslöser der Zielkarte wählen. Oder „neuen Gegenauslöser anlegen“.
4. Den Namen schlägt der Editor vor („treppeDiner“). Du kannst ihn ändern.
5. Durchgang: in welche Richtung man hineingeht (oben bei einer Treppe nach oben). Leer: von selbst.
6. „Setzen“, dann die Kachel anklicken. Für mehrere Kacheln über sie ziehen.
7. Mit neuem Gegenauslöser öffnet sich danach die Zielkarte. Dort die Stelle anklicken.
   Fertig: Beide Seiten verweisen aufeinander.

Neue Übergänge kommen auch in die Fassungen der Karte (etwa Diner mit Tischset).
Strg+D setzt ein weiteres Feld daneben, Entf löscht eins.

**Ankunft**

Jede Seite hat ihren eigenen Ankunftsort. Beispiel Wohnzimmer: Wer die Treppe herunterkommt, steht
neben der Treppe. Wer von draußen kommt, steht neben der Haustür.

- Von selbst: Der Held steht auf dem freien Feld neben dem Auslöser mit dem meisten Platz und
  schaut vom Durchgang weg.
- Selbst festlegen: Übergang anklicken, „Ankunft festlegen“, Feld anklicken. Bei „Blick“ die
  Richtung wählen. „Automatisch“ macht es rückgängig.
- Das Feld muss frei sein und darf nicht auf einem Auslöser liegen. Sonst ist das Symbol rot.
- Der Auslöser „start“ ist etwas anderes: Er gilt nur für Reisen (Bus, Fähre) und den Spielbeginn.
  Dort steht der Held genau auf dem Feld.

**Ziel ändern oder entfernen**

- Übergang anklicken, „Ziel ändern“: neue Zielkarte und Zielauslöser, „Ziel übernehmen“.
  Mit „Rückweg umstellen“ zeigt die Gegenseite gleich zurück.
- „Übergang entfernen“ löscht alle Felder des Übergangs auf dieser Karte und sein Ziel.
  Führt von woanders noch etwas hierher, warnt der Bericht.

## 5. Treppenabgang selbst bauen

So entsteht ein Loch im Boden ohne eigenes Lochbild:

1. Eine Treppe nach unten aus der Bibliothek holen (Suche „Treppe ab“) und hinlegen.
2. Bibliothek, Suche „bk“ oder den Boden der Karte („Dielen“, „Fliesen“, „Teppich“,
   „Stein“, „Gras“, „Erde“): Diese Bodenkacheln (16 × 16) auf den Teil der Treppe legen,
   der Boden sein soll. Sie liegen immer über der Treppe, man läuft darüber.
3. Die Treppe auswählen, „Kollision bearbeiten“: Abgedeckte Kacheln grün (frei),
   Lochränder und tiefe Stufen rot (gesperrt), die Einstiegskachel grün.
4. „wie treppe“ wählen, „Übergang hier“, Einstiegskachel anklicken; für zwei Kacheln Strg+D.
   Oder „Neuer Übergang“ (Abschnitt 4), wenn die Treppe woandershin führen soll.
5. Wie immer herunterladen und schicken.

Eine abgedeckte Treppe nach unten gilt im Kartenbau als Loch im Boden (Regel 10.84) und wird
flach gezeichnet: Der Held läuft über die Dielen, nicht darunter.

## 6. Tastenkürzel

Taste ? zeigt alle Kürzel.

| Taste               | Wirkung                                                                             |
| ------------------- | ----------------------------------------------------------------------------------- |
| Strg+Z / Strg+Y     | rückgängig / wiederholen                                                            |
| Strg+D              | duplizieren                                                                         |
| Entf                | löschen (Figuren mit Rückfrage)                                                     |
| R / Umschalt+R      | drehen rechts / links                                                               |
| H                   | spiegeln                                                                            |
| Bild auf / Bild ab  | nach vorn / nach hinten                                                             |
| Pfeile (+ Umschalt) | 1 Pixel (1 Kachel)                                                                  |
| Strg+A              | alles auswählen                                                                     |
| Strg+S              | Änderungen herunterladen                                                            |
| G, K, M             | Raster, Kollision, Markierung                                                       |
| U, L, V, B          | Umgebung, Sperren, Vorher, Pinsel                                                   |
| S, O, X             | Kollisionspinsel: sperren, freigeben, Radierer                                      |
| F                   | ganze Karte zeigen; im Kollisionspinsel und bei „Kollision bearbeiten“: Fein an/aus |
| Esc                 | Auswahl aufheben, Modus beenden                                                     |

## 7. Speichern und zurückschicken

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
  die Katalogmaske auch mit Maßstab; ohne eigene Maske wird die Standfläche des Katalogs mit dem
  Bild skaliert, und eine Kachel sperrt, wenn sie zu mehr als einem Viertel gedeckt ist,
  `objektmassstab.py`, im Editor `js/massstab.js`), `begehbar_grund` (Pflicht, wenn ein nicht flaches, laut
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
- Editor 1.4 (16.11.2026), Übergänge (js/uebergaenge.js, ankunft.js, ausloeser.js, uebergangsfeld.js):
  - Paket: `uebergaenge` (je Ort die Übergänge aus orte.json, nur `name`, `karte`, `art`, `ziel`)
    und `karten` (Kennung, Ort, Namen, Szenendatei der Grundkarte) für die Zielwahl.
  - Änderungsdatei: `uebergaenge` mit `vorher` und `nachher` je geändertem Ort. Der Rücklauf
    (pipeline/abenteuer/editoruebergaenge.py) schreibt neue, geänderte und gelöschte Übergänge nach
    orte.json (übrige Felder wie `wenn` bleiben, Stil Prettier Breite 80 bleibt; `--orte` für eine
    Kopie), nennt sie im Bericht und warnt, wenn ein gelöschter Auslöser noch Ziel eines Übergangs
    ist. Neue Definitionen tragen immer `karte`.
  - Auslöser-Eigenschaften `ankunft` („x,y“) und `blick`: festes Ankunftsfeld. App:
    oberwelt/ankunft.ts (festeAnkunft, ohne `blick` vom nächsten Auslöserfeld weg), Lauftest:
    `ankunftsfehler`, Pipeline: pipeline/abenteuer/ankunftsfeld.py (in `uebergaenge` und
    `uebergangsbilder`): Feld lesbar, in der Karte, frei (auch von Figuren), auf keinem Auslöser
    außer `start`, `blick` gültig, alle Felder eines Auslösers gleich.
  - Die Ankunftsanzeige baut ankunft.ts in JS nach (js/ankunft.js); Änderungen dort nachziehen.
- Editor 1.5 (16.11.2026), Zuschnitt (js/zuschnitt.js, js/zuschnittfeld.js,
  pipeline/abenteuer/objektzuschnitt.py):
  - Objektfeld `zuschnitt`: `[links, oben, rechts, unten]` in Pixeln des Katalogbilds (nach dessen
    `ausschnitt`), vor Maßstab, Spiegeln und Drehung. Das Objekt ist so groß wie der Ausschnitt;
    `feld` und `versatz` nennen seine linke obere Ecke. Lauter Nullen gelten als kein Zuschnitt.
  - Maske: Die Katalogmaske (auch die Standardregel mit `frei_unten`) wird mitbeschnitten. Das
    Raster des Ausschnitts beginnt an seiner Ecke und zählt angefangene Kacheln (aufgerundet); eine
    neue Kachel sperrt, wenn sie eine gesperrte Katalogkachel berührt. Ganz weggeschnittene Kacheln
    entfallen, angeschnittene bleiben, solange etwas übrig ist. Beschnitten trägt das Objekt immer
    eine Maske (mit Maßstab die skalierte Standfläche des Katalogs im aufgerundeten Raster); eine eigene `maske` gilt im
    Raster des beschnittenen, skalierten Bildes. Die Tiefe folgt der unteren Kante des Ausschnitts.
  - Kartenbau und Prüfungen über `objektform.geformt` und `formbild` (`zuschnitt` gehört zu
    `FORMFELDER`); `objektrichtung.forme_rechteck` verschiebt und begrenzt `platte`. Befund im
    Kartenbau, wenn nichts übrig bleibt oder der Wert keine vier ganzen Zahlen ab 0 sind.
  - Tiled: Eigenschaft `zuschnitt` als Text „26,0,32,0“; die App (oberwelt/moebelzuschnitt.ts,
    moebelform.ts) rechnet Größe und Maske gleich, moebel.ts zeichnet einen eigenen Phaser-Rahmen
    im Möbelrahmen („<name>|zuschnitt:…“), damit Ursprung, Drehung und Spiegeln wie sonst wirken.
  - Rücklauf (pipeline/abenteuer/editorzuschnitt.py): Zeile „Zuschnitt: BILD (x, y) beschnitten auf
    B × H: links …“; kommt derselbe Zuschnitt in mindestens zwei Karten oder an drei Stellen vor,
    schlägt der Abschnitt „Wiederholte Zuschnitte“ einen eigenen Katalogeintrag vor (quelle,
    ausschnitt, Größe, Maske), legt ihn aber nicht an.
  - Eigene Zuschnitte der Bibliothek liegen nur im Browser (localStorage
    `karteneditor-zuschnitte-v1`).
  - Deckkraft (js/deckkraft.js): Objektfeld `deckkraft` 25, 50 oder 75 (100 = Standard, Feld fehlt);
    Tiled-Eigenschaft `deckkraft` (int), App `setAlpha` (moebel.ts, moebelform.deckkraftAus),
    Vorschau `objektform.mit_deckkraft` (kartenbild, Rücklauf), Bericht „Deckkraft: … 100 → 50 %“.
    Kollision und Tiefe bleiben; Pixelprüfungen sehen das Bild ohne Deckkraft.
- Editor 1.6 (16.11.2026), Kollision fein (js/fein.js, feinmalen.js; pipeline/abenteuer/kollisionfein.py,
  feinbericht.py, engstelle.py; App oberwelt/feinsperren.ts):
  - Szene `sperren_fein`, `freigeben_fein`: `[x, y, maske]`, 16 Zeichen „#“/„.“ je Kachel, Reihe für
    Reihe („#“ = gesperrt bzw. freigegeben). Objekt `maske_fein`: je Kachel 4 Zeichen × 4 Zeilen, ungedreht
    wie `maske`, ersetzt sie; `objektform.geformt` dreht mit und leitet `maske` ab. Ganze Kacheln und
    einheitliche Masken schreibt der Editor grob. Befunde: grob und fein zugleich, Zellen gesperrt und
    frei, `maske` und `maske_fein`, Wandfreigabe ohne Grund, Auslöser auf feiner Sperre.
  - Ganzkachel-Regel (Held 12 × 12 mittig, Pixel 2 bis 14): Kachel mit gesperrter Zelle ist gesperrt
    (`durchgang.gesperrte_felder` über `sperrzellen`, App `begehbar.sperrkacheln`, Tiere über die
    Möbelgruppe in `sperrkarte.ts`, Tippschritt endet in der eigenen Kachelmitte). Gemeinsame Fälle:
    `app/src/abenteuer/oberwelt/feinsperren.faelle.json` (Vitest und pytest; der pytest prüft, dass
    die Datei zum Kartenbau passt).
  - Tiled: feine Freigabe in Wand/Wasser/Leere wird Boden; Karteneigenschaft `sperren_fein`
    („x,y,maske;…“) trägt feine Sperren und den Rest solcher Wände; Möbel mit feiner Maske (auch durch
    `gib_frei_fein`) tragen `maske_fein` („..##/…“, geformt) und `maske`. Die App fasst Zellen zu
    Physik-Rechtecken zusammen (`zellrechtecke`, `moebel.fuegeSperrflaechenHinzu`).
  - Engstelle (nur mit feinen Feldern): 4-px-Raster, Körper 12 px; Befund, wenn ein Ziel nur ohne
    die feinen Felder erreichbar ist, Hinweis unter 16 px.
  - Rücklauf: „Kollision: Pinsel sperrt fein … : (5, 7) obere Hälfte“, „maske_fein (0, 1) untere
    Hälfte“. Anzeige ohne feine Felder wie bisher, sonst in Zellen mit Punkt für Teilkacheln.
- Editor 1.7 (16.11.2026), Blickrichtung (js/blick.js; Rückmeldung R008):
  - Figur der Szene `blick`, Statist `eigenschaften.blick`: oben, unten, links oder rechts; „Vorgabe“
    entfernt das Feld (App zeigt dann unten). Sitzende (`sitzt`) bekommen kein `blick`.
  - Paket: `personenbilder` (Bogen → vier Standbilder rechts, oben, links, unten als data-URL) und je
    Szene `personen` (`f:<name>` bzw. `b:<name>|<bild>` → Bogen); gebaut von
    pipeline/abenteuer/editorpersonen.py mit `belebungsvorschau.figurbild` (PixelLab mit 2/3).
  - Rücklauf: Figuren und Belebung kommen ganz aus „nachher“, `blick` bleibt erhalten; Bericht
    „Blick (figuren): hector Vorgabe → links“. Prüfung danach: `python -m pipeline.abenteuer.blickrichtung`.
- Test: `node werkzeuge/karteneditor/test/editor.test.cjs` (Playwright, Chromium über file://),
  Kollision und Treppenabgang in `test/kollision.cjs` (an einer Kopie des Dachbodens im Testordner),
  Figuren, Varianten und Bodenkacheln in `test/figuren.cjs`, Kollisionspinsel in `test/pinsel.cjs`,
  Übergänge (neuer Übergang mit Gegenauslöser, Ankunft, „Zum Ziel“, Rücklauf in eine Kopie von
  orte.json) in `test/uebergaenge.cjs`, Zuschnitt in `test/zuschnitt.cjs`, Kollision fein in
  `test/fein.cjs`, Blickrichtung in `test/blick.cjs`.
