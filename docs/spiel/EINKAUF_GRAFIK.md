# Grafik für das Schach-Abenteuer: Pakete, Verwendung, Hochladen

Stand: 9.11.2026. Für den Autor zum Abhaken. Alle Pakete stammen von LimeZu (https://limezu.itch.io),
Lizenz: Nutzung und Bearbeitung in kommerziellen Projekten erlaubt, Namensnennung mit Link auf
limezu.itch.io (Abspann und `docs/spiel/LIZENZEN.md`), Weitergabe der Dateien verboten. Deshalb
kommen sie nur ins private Repository, nie ins öffentliche.

## 1. Gekauft und wofür

| Paket | Verwenden? | Wofür im Spiel |
| ----- | ---------- | -------------- |
| **Modern Exteriors** | ja, Grundlage | alle Außenkarten der Städte (Maple Falls bis Capital Arena), Straßen, Park, Bahnhof, Hafen und Deich in Port Delacroix, Strand, Bus und Fähre, Raststätten, Leuchtturm am Seeufer |
| **Modern Interiors** | ja, Grundlage | alle Innenräume: Dachboden, Wohnzimmer, Clubraum, Bibliothek, Archiv, Waschsalon, Wohnwagen, Kantine, Mamas Zimmer, Umkleide, Museum, Turnhalle, Musikhaus, Antiquariat, Saloon, Hütten, Bergladen, Diner, Kaffeehaus in London; Küchen und Keller; dazu die Figuren (Charakter-Generator) |
| **Modern Office (Revamped)** | ja | Silicon Bay (die KI-Firma): Lobby, Akademie, Serverraum; Turnierleitung und Pressebereich der Capital Arena; Schalter in der Bahnhofshalle von Riverton und in der Bergstation |
| **Modern Farm** | ja | das Land zwischen den Städten: Wege (Landstraße, Prärie, Hütten, Staubstraße), Pinewood Camp, Hochebene, der Schuppen in Riverton, Garage in Desert Springs; Zäune, Scheunen, Felder, Obstbäume; Tiere als Belebung (Hunde, Katzen, Hühner, Kühe); Bauern-Generator für Figuren auf dem Land |
| **Modern User Interface** | ja | Rahmen für Dialog, Deckwahl, Laden, Tagebuch, Kartenleiste, Reisekarte; Knöpfe; Gefühls-Symbole über Figuren; **Porträt-Generator** (Abschnitt 3) |
| **Fungus Cave** | später | eine Höhle oder ein Stollen (Canyonpfad, Felsbogen, alte Mine bei Ghost Town), falls die Geschichte eine braucht |
| **Dungeon tilesets 16×16** | kaum | älterer, düsterer Fantasy-Stil; höchstens ein Gewölbe unter dem Archiv. Nicht hochladen nötig |
| RPG Fantasy Battlers | nein | Kampfmonster, passen nicht |
| QGO | nein | gehört nicht zum Spiel |
| Serene Village, Kitchen and more (gratis) | nein | Vorgänger; Modern Interiors und Exteriors enthalten das verbessert |
| Basic platformer tileset | nein | Seitenansicht und 32 Pixel, das Spiel ist von oben gesehen mit 16 Pixeln |

Fehlt noch etwas? Nach dieser Liste nicht. Gebirge, Geysire und Riesenbäume (Summit City,
Geysirbecken, Riesenbäume) gibt es bei LimeZu nicht eigens; dafür reichen Felsen und Bäume aus
Exteriors und Farm, nachgefärbt. Das zeigt sich beim Zeichnen; dann melde ich mich.

## 2. Oberfläche im Spiel (Empfehlung, wird so umgesetzt, Widerspruch genügt)

- **Im Spiel** (Oberwelt, Dialog, Deckwahl, Laden, Tagebuch, Reisekarte, Abspann) bekommen alle
  Fenster und Knöpfe die Pixelrahmen aus Modern User Interface. Die Rahmen werden nachgefärbt, damit
  sie nah an den Farben der App bleiben (Grundfarbe und Akzent der App), so passt das Spiel zur Welt
  und fühlt sich trotzdem wie ein Teil der App an.
- **Die Schrift bleibt die Schrift der App**, keine Pixelschrift: Sie ist auf dem Handy besser
  lesbar, kann Umlaute und folgt der Schriftgröße, die der Leser in der App eingestellt hat.
- **Die Partie selbst** (Brett, Uhr, Züge) bleibt im Aussehen der App, damit Schach im Spiel genau
  so aussieht wie beim Üben. Nur die Kartenleiste unter dem Brett bekommt den Pixelrahmen.
- Technisch: Rahmen als 9-Teile-Bild (CSS `border-image`) mit scharfen Pixeln, ohne Mehrlast für die
  App, weil sie im Zusatzpaket des Spiels liegen.

## 3. Porträts

Gute Nachricht: **Modern User Interface enthält einen Porträt-Generator**, der zum
Charakter-Generator von Modern Interiors passt (9 Hauttöne, 29 Frisuren in je 6 Farben, 15
Zubehörteile; je Porträt Sprechen, Nicken, Kopfschütteln als kleine Animation). Damit sehen Porträt
und Figur auf der Karte gleich aus, und die Porträts bewegen die Lippen beim Sprechen.

- Andere Porträt-Sammlungen hat LimeZu nicht; die übrigen Pakete sind Waffen, Symbole und
  Fantasy-Kampffiguren.
- Ich setze die Porträts selbst aus den Einzelteilen zusammen (Skript), so wie heute die
  DiceBear-Bilder. Das Programm des Generators brauchst du dafür nicht zu starten.
- Grenzen, die ich prüfe, sobald die Dateien da sind: Alter (Kinder, Ambrose, Oma Ruth), Bärte,
  Kopfbedeckungen. Wo der Generator nicht reicht, bleibt das DiceBear-Bild oder ich male das Teil nach.
- Für die Vell-Familien gilt weiter die Sensibilitätslesung vor der Veröffentlichung.

## 4. Privates Repository anlegen und hochladen

- [ ] Auf GitHub ein neues **privates** Repository anlegen: https://github.com/new
      Name: `schach-abenteuer-inhalte`, Sichtbarkeit „Private“, sonst nichts ankreuzen.
- [ ] Aus jeder ZIP-Datei nur den Ordner mit der **16×16-Fassung** hochladen (die 32er und 48er
      nicht), jeweils in einen eigenen Ordner mit dem Paketnamen:
      `modern-exteriors/`, `modern-interiors/`, `modern-office/`, `modern-farm/`, `modern-ui/`,
      `fungus-cave/`.
      Bei Interiors, UI und Farm zusätzlich den Ordner mit den **Einzelteilen der Generatoren**
      (Körper, Haare, Kleidung, Porträtteile), falls er getrennt liegt; die Programme selbst (.exe,
      Linux-Build) nicht.
      Über die Weboberfläche: „Add file“ → „Upload files“, Ordner hineinziehen (am Rechner; höchstens
      100 Dateien und 25 MB je Datei pro Hochladen, also gegebenenfalls in mehreren Runden).
- [ ] Mir im Chat Bescheid sagen. Dann hänge ich das Repository an, richte den Paketbau ein und gebe
      niedrig-1 die Karten zum Nachzeichnen.

## 5. Danach (mache ich mit dir zusammen)

- [ ] **Zugang für den GitHub-Bau** (Q20-11): Damit die Bilder auch in der veröffentlichten App
      ankommen, braucht der Bau auf GitHub einen Lesezugang zum privaten Repository (ein „Deploy
      Key“). Die Anleitung schreibe ich, sobald das Repository da ist; den Schlüssel trägst du selbst
      in GitHub ein (keine Zugangsdaten in den Chat).

## Nicht nötig

- **Musik und Schrift:** dafür gibt es gute freie Stücke (CC0, etwa Kenney oder OpenGameArt), die ins
  öffentliche Repository dürfen.
