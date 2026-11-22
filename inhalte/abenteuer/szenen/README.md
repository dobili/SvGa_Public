# Szenen: Karten aus Beschreibungen (Kartenbauer)

Seit 9.11.2026 (Rückmeldung des Autors) entstehen Karten in drei Schritten, nie mehr durch
nachträgliches Möblieren:

1. **Szenenbeschreibung** (`beschreibung` in der Szene, ausführlich und lebendig): Was für ein Ort ist
   es, wer lebt oder arbeitet dort, zu welcher Zeit spielt er (Story-Bibel, Weltbeschreibung)? Wo
   sind Wände, Türen, Fenster, welcher Boden? Jeder Gegenstand mit seinem Platz und Bezug („Fernseher
   auf dem Lowboard an der Nordwand“, „Landkarte an der Wand über der Bank“, „Kartons gestapelt in der
   Ecke“). Laufwege und die Stellen, an denen die Geschichte etwas auslöst. Nicht karg: Ein bewohnter
   Raum hat Pflanzen, Bilder, Kleinkram, Spuren von Leben.
2. **Bau** mit dem Kartenbauer (unten), danach Hintergrund und Vorschau zeichnen.
3. **Bildprüfung** der Vorschau gegen die Beschreibung und die Prüfliste (unten). Ändern, neu bauen,
   neu prüfen; höchstens drei Runden, dann melden.

## Format einer Szene (`<datei>.json`)

```json
{
  "karte": "mapleFalls.wohnzimmer", // Kennung wie in orte.json
  "datei": "karten/maple-falls-wohnzimmer.json",
  "art": "innen", // innen oder aussen
  "beschreibung": "…",
  "wand": "creme", // innen: Wandstil (materialien.json, waende)
  "wandart": "hecke", // aussen: „#“ als Boden dieser Art statt Wandkrone
  "boden": "holzHell", // Standardboden (materialien.json, boeden)
  "boeden": { "t": "teppichRot" }, // weitere Böden je Buchstabe im Raster
  "bruecken": ["h"], // begehbar, gezeichnet als Wasser mit Ufer; Brückenbild als Möbel darauf
  "ufer": "stein", // optional: alles Wasser mit Steinkante statt Grasufer (Kai, Schleuse, Steinbruch);
  // "rumpf": Bordwand eines Schiffs, das Deck ist dann das Land (Fährdeck)
  // "sinter": Sinterrand heißer Quellen (Geysirbecken)
  "dicht": true, // nur Lager und Archive: Belegung bis 60 % statt 45 % (dichte Regalreihen)
  "stollen": true, // nur Stollen und Höhlen: Belegung ab 10 % statt 20 % (Gänge, keine Räume)
  // Fels (Steinbruch, Stollen): "wand": "fels" zeichnet Wände als Felskrone und zwei Reihen
  // Felswand (auch draußen, mit oder ohne "wandart"); Böden "schotter" und "felsboden".
  // Damm (Bahndamm, Deich): "wand": "damm" zeichnet "#" über einem Boden als Grashang (Regel 10.49).
  // Roter Fels (Canyon, Wüste): "wand": "felsRot", Böden "sandRot" und "felsbodenRot".
  // Geysirbecken: Boden "sinter" (heller Sinter, selten Risse und orange Bakterienränder).
  // Zweite Fassung einer Karte (Musikhaus nach musikhausOffen): "zustand_der_karte": "<flag>",
  // eigene Datei; der Hintergrund heißt dann <kennung>-<flag>.png (die App tauscht ab Runde 6).
  "raster": ["####", "#..#", "####"], // # Wand, . Boden, ~ Wasser, Leerzeichen: nichts
  "objekte": [
    { "moebel": "wzSofa", "feld": [2, 2] }, // linke obere Kachel
    { "moebel": "wzCouchtisch", "feld": [3, 5], "id": "tisch" },
    { "moebel": "wzFernseher", "auf": "tisch" }, // steht auf „tisch“
    { "moebel": "wzBild", "feld": [7, 1], "an_wand": true, "versatz": [8, 8] }
  ],
  "ausloeser": [
    {
      "name": "start",
      "feld": [7, 10],
      "eigenschaften": { "richtung": "oben" }
    },
    { "name": "kartonKueche", "feld": [12, 5], "auf_moebel": true }
  ],
  "figuren": [{ "name": "mutter", "feld": [11, 8] }],
  "belebung": [
    {
      "name": "katze",
      "typ": "tier",
      "feld": [9, 18],
      "eigenschaften": { "von": "9,18", "bis": "9,18", "verhalten": "sitzen" }
    }
  ],
  "eigenschaften": { "stil": "kueste" },
  "sperren": [[0, 7]], // Kollisionspinsel: zusätzlich gesperrte Kacheln (unsichtbare Sperre)
  // Geräuschquellen (geraeuschquellen.py): abgeleitet aus Wasser und Möbeln; von Hand
  // false (keine) oder {"ohne": ["wasser"], "dazu": [{"feld": [x, y]}, {"bereich": [x, y, b, h]}]}
  "geraeuschquellen": { "dazu": [{ "feld": [30, 2] }] },
  // Musiker (Zusatzspur des Ortsthemas wird in der Nähe hörbar): Namen wie in der Tiled-Karte;
  // jede Jukebox zählt von selbst (geraeuschquellen.py, Art „musik“)
  "musikquellen": ["gitarrist"],
  "freigeben": [[5, 3]], // begehbar, egal welches Möbel oder Rasterzeichen darunter liegt
  "freigeben_grund": "…" // Pflicht bei Freigaben auf Wand oder Wasser (kollisionspinsel.py)
}
```

- **Innenräume:** Die Nordwand ist drei Reihen `#` dick (oberste Reihe Wandkrone, zwei Reihen
  Wandfläche); Seiten- und Südwände eine Reihe. Fenster, Bilder, Türen zum Nebenraum hängen
  `an_wand` auf den Reihen der Wandfläche. Hohe Möbel (Schrank, Kühlschrank) stehen mit dem Fuß auf
  der ersten Bodenreihe und überdecken die Wandfläche.
- **Außen:** Häuser sind ganze Gebäude aus dem Register (keine Wandblöcke); der Übergang liegt auf
  der Kachel direkt unter der Haustür. Bäume ganz (nicht Krone oder Stamm allein).
- **Belebung** (Regel 10.53, `docs/spiel/16_Statisten_und_Tiere.md`):
  - Statisten: `"typ": "statist"`, Eigenschaften `von`, `bis`, `tun`, `wann`. Ansprechbare Statisten
    haben zusätzlich `sagt` mit dem Textschlüssel `statist.<karte>.<name>`. Wer einen Zug vorspielt, hat `zeigt` mit der Kennung aus `inhalte/abenteuer/vorfuehrungen.json`.
  - Tiere: `"typ": "tier"` mit `verhalten` (`sitzen`, `fliegen`, `ausweichen`, `flitzen`, `folgen`,
    `rennen`, `schwimmen`, `schlafen`).
- **Auslöser** und Figuren behalten ihre Namen aus orte.json; Übergänge anderer Karten zeigen auf sie.
- **Möbel** kommen aus `inhalte/abenteuer/moebel/<ort>.json`, eine Datei je Ort (`maple-falls.json`,
  `cedar-creek.json`, `weg-maple-cedar.json` …; Ort ohne Datei: neue anlegen). Neue Einträge mit Pfad aus
  dem Register und Größe aus der Datei. Namen bleiben über alle Dateien eindeutig (Test
  `test_moebel_namen_eindeutig`); die Vorsilbe des Namens nennt die Karte (`mf4`, `cc4`, `wg4` …).
  Bauteile („Modular“, „Left“, „Top“ …) nur zusammen mit ihren Gegenstücken (`"bauteil_ok": true`).

## Befehle (Hauptordner)

```bash
python -m pipeline.abenteuer.kartenbau inhalte/abenteuer/szenen/<datei>.json        # Karte + Prüfung
python -m pipeline.abenteuer.kartenbild PRIVAT VORSCHAU inhalte/abenteuer/szenen/<datei>.json   # braucht Pillow
```

`PRIVAT` = Klon von `dobili/schach-abenteuer-inhalte`, `VORSCHAU` = ein Ordner außerhalb der
Repositorys. Der Hintergrund landet in `PRIVAT/spiel/grafik/karten/<kennung>.png` (nicht ins
öffentliche Repository!).

## Angaben je Möbel in moebel/<ort>.json (für die Regeln, Pflicht für neue und benutzte Einträge)

`art` (stuhl, tisch, sofa, schrank, regal, bett, pflanze, lampe, treppe, geraet, deko, gebaeude, baum,
zaun, strassenmoebel …), `blick` (unten, oben, links, rechts: wohin Vorderseite oder Sitzfläche zeigt;
bei Teppichen und Bäumen weglassen), `zustand` (neu, gebraucht, alt, kaputt), `stil` (modern, klassisch,
rustikal, industrie, natur, kinder …). Jedes Bild vorher ansehen; das Register irrt manchmal.

Schrägstücke der Landstraße (`"schraeg": "unten"` oder `"oben"`, etwa `wg14LandstrasseSchraegUnten`,
48 × 64): Eine drei Kacheln breite Straße springt nicht mehr als Stufe um eine Reihe, sondern in einem
Fenster von drei Spalten als weiche S-Kurve. Das Stück liegt mit der linken oberen Ecke auf der oberen
der beiden Lagen; im Fenster trägt das Raster nur die zwei gemeinsamen Reihen (die Breitenprüfung
zählt das Stück als Stufe). Mehrere Versätze folgen in aneinandergrenzenden Fenstern aufeinander.

Szenen legen fest: `"zustand": ["neu", "gebraucht"]` (Standard) und `"stil": ["modern", "klassisch"]`.
Kaputtes nur, wo die Geschichte es erklärt (Ghost Town, Turnhalle nach dem Sturm, Dachboden mit
altem Gerümpel als _eigene Ecke_, nicht gemischt).

Form im Eintrag einer Szene (Karteneditor, `pipeline/abenteuer/objektform.py`, alle optional):
`"drehung": 90` (0, 90, 180, 270 im Uhrzeigersinn; Breite und Höhe tauschen, auch für die
Kollision), `"spiegeln": true` (waagrecht), `"massstab": 1.5` (0,5 bis 3), `"ebene": 2` (wird zur
berechneten Tiefe addiert: vor oder hinter Nachbarn). `feld` und `versatz` nennen die linke obere
Ecke des gedrehten Rechtecks.
Mit `massstab` wächst die Kollision mit dem Bild (`objektmassstab.py`): Eine Kachel sperrt, wenn
die skalierte Standfläche sie zu mehr als einem Viertel deckt, auch angefangene Reste rechts und unten.
`"zuschnitt": [26, 0, 32, 0]` (Editor 1.5, `objektzuschnitt.py`): Pixel links, oben, rechts und
unten des Katalogbilds, die wegfallen, vor Maßstab und Drehung; das Objekt ist dann so groß wie der
Ausschnitt, die Katalogmaske wird mitbeschnitten (ein Pfosten aus einem Zaunstück).
`"deckkraft": 50` (25, 50, 75; 100 ist Standard und fehlt): Das Bild ist durchsichtig, die
Kollision bleibt.

Figuren (`figuren`): `name`, `feld` und optional `sitzt` (Blickrichtung oder `true`), `blick`
(stehend: oben, unten, links, rechts) und `versatz: [dx, dy]` (Karteneditor 1.8, Wunsch des Autors
vom 22.11.2026): feiner Versatz nur des Bildes in Kartenpixeln, ganze Zahlen von −8 bis 8, etwa damit
eine Sitzende auf ihrem Stuhl sitzt. Feld, Kollision und Ansprechen bleiben beim Feld; die App rückt
nur das Bild (oberwelt/figurversatz.ts), die Karte trägt ihn als Eigenschaft `versatz` („dx,dy“).

Kollision nur an dieser Stelle (Karteneditor, `pipeline/abenteuer/objektkollision.py`, optional):
`"kollision": false` (durchgehbar) oder `true` (sperrt) statt der Angabe im Katalog, `"maske"`
(wie im Katalog; dreht und spiegelt mit der Form) und `"begehbar_grund"` (Pflicht, wenn ein nicht
flaches Möbel, das laut Katalog sperrt, hier durchgehbar wird, Regel 10.69). Bodenkacheln
(`bk…`, Art `boden_teil`) über einer Treppe nach unten liegen darüber; die Treppe wird flach
gezeichnet und gilt als Loch im Boden (`pipeline/abenteuer/bodenteile.py`, Regel 10.84).

Beziehungen im Eintrag einer Szene: `"auf": "<id>"` (steht auf; muss auf die Platte passen; hat das Bild durchsichtige Ränder, nennt die Möbelangabe `"sichtbar_breite"` die Breite der deckenden Pixel, dann vergleicht die Prüfung sichtbar mit sichtbar),
`"an_wand": true`, `"zu": "<id>"` (Stuhl oder Sofa schaut zu Tisch oder Fernseher).

## Regeln für die Anordnung (Rückmeldungen des Autors, 9.11.2026)

- **Beziehungen:** Stühle stehen an Tischen und zeigen mit der Sitzfläche zum Tisch. Der Fernseher
  steht auf Lowboard oder Fernsehtisch an der Wand, nie auf dem Esstisch, nie mitten im Raum; mit
  etwas Abstand davor Sitzplätze mit Blick zu ihm. Pflanzen und Stehlampen in Ecken, an Wänden oder
  neben passenden Möbeln, nie allein mitten im Raum. Schachbretter liegen ganz auf einem Tisch
  (`spiel/eigene/schachbrett_klein*.png` für schmale Tische), nicht auf Bühnen oder dem Boden.
- **Drehung:** Möbel mit Schubladen, Türen, Bildschirmen zeigen in den Raum, nicht zur Wand; an der
  linken Wand nach rechts, an der rechten nach links. Geräte wie Waschmaschinen ebenso.
- **Ganze Dinge:** keine angeschnittenen Bauteile (Prüfung meldet „wirkt angeschnitten“); Mehrteiliges
  nur vollständig. Nichts verdeckt anderes (Pinnwand hinter Waschmaschine) oder eine Figur.
- **Zustand und Stil:** ein Stil je Ort; neues neben neuem, Altes nur gewollt.
- **Begehbarkeit:** Treppen mit freiem Antritt; Wege laufen bis zum Kartenrand oder Ausgang;
  Zäune sind geschlossene Linien mit passenden Ecken.
- **Draußen:** Bäume in Wohngebieten gepflanzt (Reihen an der Straße, Vorgärten, symmetrisch);
  zufällig nur in Wald und Wildnis. Laternen direkt an Weg oder Straße. Bushaltestelle zur Straße.
  Wohnhäuser neben Wohnhäusern; Industrie nur, wo die Geschichte es sagt. Schilder und Werbung passen
  zur Zeit und zum Ort (keine Autobahn-Anzeigetafel in der Kleinstadt). Felder sind groß genug für
  einen Traktor. Pflanzen müssen als solche erkennbar sein.
- **Innen und außen stimmig:** Ein Haus draußen passt zu seinen Räumen drinnen (Größe, Stand).

## Prüfliste für die Bildprüfung

0. Alle Befunde von `kartenbau` und `kartenbild` sind behoben (oder im Bericht begründet).

1. Ist jedes Ding ganz zu sehen und als das erkennbar, was die Beschreibung sagt?
2. Steht alles an einem logischen Ort (auf Tisch, an Wand, in Ecke), nichts schwebt oder liegt
   unpassend am Boden? Passt jedes Ding zum Ort (keine Parkbank im Wohnzimmer)?
3. Sind Wände, Türen und Fenster wie in einem echten Gebäude (Türen in Wänden, Fenster an Außenwänden)?
4. Gibt es freie Laufwege zu allen Auslösern und Figuren, und wirkt der Ort lebendig, nicht karg?
5. Passen Größenverhältnisse (Tisch nicht größer als Schrank, Stuhl am Tisch, Blickrichtung zum Tisch)?

`"vorn": true` an einem Objekt: wird nach seinem Fuß vor anderen gezeichnet, hat aber keine Kollision und
keine Überlappungsprüfung (Fahnenmast, Laterne oder Schild vor einer Fassade).

## Möbel: begehbare Reihen unten

Ein Möbel in `inhalte/abenteuer/moebel/<ort>.json` kann `"frei_unten": N` tragen: Die untersten N
Kachelreihen des Bildes sperren nicht (Gang vor den Motelzimmern, Veranda des alten Bahnhofs).
Kartenbau, Prüfungen und App rechnen gleich.

Für alles Feinere gibt es `"maske": ["....", "#..#", "#..#"]`: je Kachelreihe des Bildes eine
Zeichenkette, `#` sperrt, `.` ist frei (offenes Tor nur an den Pfosten, Viehgatter quer mit
oberster Reihe, Mammutbaum nur am Stammfuß). Die Maske ersetzt die Standardregel und
`frei_unten`; Regel in `pipeline/abenteuer/maske.py`.

## Felskanten aus Klippenkacheln (`"kante": "klippe"`, Runde 8)

Mit `"kante": "klippe"` zeichnet `kartenbild` Bänder aus drei Reihen `#` über einem Boden wie LimeZu
(Vorbild Modern Exteriors 048): oben eine gewellte Kante, darunter Felswand, unten ein Grasfuß; an den
Enden eines Abschnitts Randkacheln. Liegt über der Kante kein Gras, nimmt sie die Erdvariante. Rampen
aus Erde oder Schotter durch ein Band bekommen eine in den Fels geschlagene Treppe, Straßen nicht.
Dicke Wandflächen ohne Boden darunter zeigen die obere Fläche. Ohne den Schlüssel bleibt alles wie
bisher. Logik: `pipeline/abenteuer/klippe.py`, Test: `pipeline/tests/test_abenteuer_klippe.py`.
Benutzt von: `steinbruch-grube`, `weg-desert-summit-bergstrasse`. Nicht bei roten Felsen (`felsRot`,
Sternwarte, Wüste): LimeZus Klippe hat nur Gras- und Erdfuß, der grüne Fuß passt nicht auf roten Sand.
Dafür gibt es seit Runde 9 `"fels": "rot"` neben `"kante": "klippe"`: Die Kanten kommen dann aus
`spiel/eigene/klippe_rot.png` (Bildwunsch `docs/spiel/auftraege/bildwuensche/klippe_rot.py`, die
Erdklippe rot umgefärbt, Fuß aus rotem Sand). Fehlt das Bild, bleibt die braune Klippe.
