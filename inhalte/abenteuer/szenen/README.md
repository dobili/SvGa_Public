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
  "karte": "mapleFalls.wohnzimmer",          // Kennung wie in orte.json
  "datei": "karten/maple-falls-wohnzimmer.json",
  "art": "innen",                             // innen oder aussen
  "beschreibung": "…",
  "wand": "creme",                            // innen: Wandstil (materialien.json, waende)
  "wandart": "hecke",                         // aussen: „#“ als Boden dieser Art statt Wandkrone
  "boden": "holzHell",                        // Standardboden (materialien.json, boeden)
  "boeden": { "t": "teppichRot" },            // weitere Böden je Buchstabe im Raster
  "raster": ["####", "#..#", "####"],         // # Wand, . Boden, ~ Wasser, Leerzeichen: nichts
  "objekte": [
    { "moebel": "wzSofa", "feld": [2, 2] },                       // linke obere Kachel
    { "moebel": "wzCouchtisch", "feld": [3, 5], "id": "tisch" },
    { "moebel": "wzFernseher", "auf": "tisch" },                   // steht auf „tisch“
    { "moebel": "wzBild", "feld": [7, 1], "an_wand": true, "versatz": [8, 8] }
  ],
  "ausloeser": [{ "name": "start", "feld": [7, 10], "eigenschaften": { "richtung": "oben" } },
                { "name": "kartonKueche", "feld": [12, 5], "auf_moebel": true }],
  "figuren": [{ "name": "mutter", "feld": [11, 8] }],
  "belebung": [{ "name": "katze", "typ": "tier", "feld": [9, 18], "eigenschaften": { "von": "9,18", "bis": "9,18", "verhalten": "sitzen" } }],
  "eigenschaften": { "stil": "kueste" }
}
```

- **Innenräume:** Die Nordwand ist drei Reihen `#` dick (oberste Reihe Wandkrone, zwei Reihen
  Wandfläche); Seiten- und Südwände eine Reihe. Fenster, Bilder, Türen zum Nebenraum hängen
  `an_wand` auf den Reihen der Wandfläche. Hohe Möbel (Schrank, Kühlschrank) stehen mit dem Fuß auf
  der ersten Bodenreihe und überdecken die Wandfläche.
- **Außen:** Häuser sind ganze Gebäude aus dem Register (keine Wandblöcke); der Übergang liegt auf
  der Kachel direkt unter der Haustür. Bäume ganz (nicht Krone oder Stamm allein).
- **Auslöser** und Figuren behalten ihre Namen aus orte.json; Übergänge anderer Karten zeigen auf sie.
- **Möbel** kommen aus `moebel.json` (neue Einträge mit Pfad aus dem Register, Größe aus der Datei).
  Bauteile („Modular“, „Left“, „Top“ …) nur zusammen mit ihren Gegenstücken (`"bauteil_ok": true`).

## Befehle (Hauptordner)

```bash
python -m pipeline.abenteuer.kartenbau inhalte/abenteuer/szenen/<datei>.json        # Karte + Prüfung
python -m pipeline.abenteuer.kartenbild PRIVAT VORSCHAU inhalte/abenteuer/szenen/<datei>.json   # braucht Pillow
```

`PRIVAT` = Klon von `dobili/schach-abenteuer-inhalte`, `VORSCHAU` = ein Ordner außerhalb der
Repositorys. Der Hintergrund landet in `PRIVAT/spiel/grafik/karten/<kennung>.png` (nicht ins
öffentliche Repository!).

## Prüfliste für die Bildprüfung

1. Ist jedes Ding ganz zu sehen und als das erkennbar, was die Beschreibung sagt?
2. Steht alles an einem logischen Ort (auf Tisch, an Wand, in Ecke), nichts schwebt oder liegt
   unpassend am Boden? Passt jedes Ding zum Ort (keine Parkbank im Wohnzimmer)?
3. Sind Wände, Türen und Fenster wie in einem echten Gebäude (Türen in Wänden, Fenster an Außenwänden)?
4. Gibt es freie Laufwege zu allen Auslösern und Figuren, und wirkt der Ort lebendig, nicht karg?
5. Passen Größenverhältnisse (Tisch nicht größer als Schrank, Stuhl am Tisch, Blickrichtung zum Tisch)?
