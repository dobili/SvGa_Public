# `inhalte/abenteuer/` – Daten des Schach-Abenteuers

Hier liegen die Inhalte des Spiels, die ins öffentliche Repository dürfen: Verzeichnisse der
Gegner, Karten, Quests und Orte, die Spieltexte, die Dialoge und die Tiled-Karten. Grafik, Musik
und Porträts liegen im privaten Repository (Entscheidung A10) und kommen beim Build dazu.
Verträge: `schemas/abenteuer-*.schema.json`; die App erzeugt ihre Typen daraus
(`app/skripte/erzeuge-typen.mjs`), die Pipeline prüft die Beispiele (`pipeline/tests/test_abenteuer.py`).
Hintergrund: `docs/spiel/04_Architektur.md`, Abschnitt 2 und 9.

| Datei              | Schema             | Inhalt                                                                                                                                     |
| ------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `gegner.json`      | `abenteuer-gegner` | Gegnerprofile: Rolle, Zielstärke (fest, relativ zur aktuellen oder zur Eingangswertung), Fehlergewichte, Stil, Eröffnung, Steckbriefzeilen |
| `karten.json`      | `abenteuer-karten` | Hilfskarten mit Stufe, Art (dauerhaft, verbrauch), Wirkung, Zeitpunkt                                                                      |
| `quests.json`      | `abenteuer-quests` | Quests als Schrittfolgen: Ereignis (dialog, partie, aufgaben, ort) und Wirkungen (karte, steckbrief, zustand, szene, fragment)             |
| `orte.json`        | `abenteuer-orte`   | Orte mit Tiled-Karten, Figuren (Sprite, Dialogknoten, Gegner), Bedeutung der Auslöser, Club mit Buchkapiteln und Aufgabenreihe             |
| `texte/de.json`    | `abenteuer-texte`  | Oberflächentexte des Spiels, flache Schlüssel `bereich.name.feld`, Platzhalter `{name}`                                                    |
| `dialoge/de/*.ink` | –                  | Dialoge in Ink, eine Datei je Ort oder Szene                                                                                               |
| `karten/*.json`    | –                  | Tiled-Karten (JSON, orthogonal, 16 px)                                                                                                     |

## Kennungen

- Orte: `mapleFalls` (Kleinbuchstabe, dann CamelCase). Karten und Figuren: `ort.name`
  (`mapleFalls.dachboden`, `mapleFalls.coachDelgado`). Gegner heißen wie ihre Figur.
- Quests und Begegnungen: `ort.name` (`mapleFalls.dasBrett`, `mapleFalls.ersteLektion`).
- Dialogknoten: `datei.knoten` mit der Ink-Datei ohne Endung (`maple-falls-dachboden.ambrose_erwacht`).
- Textschlüssel: `bereich.name.feld` (`figur.ambrose.name`, `karte.fingerzeig.spruch`).

## Ink-Dialoge (`dialoge/<sprache>/<datei>.ink`)

- Knoten `=== name ===` sind die Einsprungpunkte; Quests warten auf „datei.knoten“.
- Tags am Zeilenende steuern die Anzeige: `#sprecher:ambrose` (Porträt und Name),
  `#stimmung:streng` (Porträtvariante), `#pause` (eine Sekunde) oder `#pause:3` (Sekunden,
  höchstens 10; „Weiter“ ist so lange gesperrt).
- Ton (T1, T2): `#musik:kennung` wechselt die Musik der Szene (Datei `musik/<kennung>.m4a`, sonst
  `.ogg`), `#musik:aus` blendet aus, `#musik:karte` kehrt zur Musik der Karte zurück,
  `#musik:bleibt` behält die Szenenmusik über das Dialogende hinaus (eigene Zeile, weil gleichnamige
  Tags in einer Zeile nur den letzten gelten lassen). `#geraeusch:kennung` und `#geraeusch:aus` für
  ein Dauergeräusch (`klang/<kennung>.m4a`), `#klang:knarren` spielt ein Geräusch einmal. Musik und
  Geräusch einer Karte stehen in `orte.json` (`musik`, `geraeusch`). Fehlende Dateien bleiben still.
- Bühne (T6, T9): `#licht:abend` legt für den Rest des Dialogs ein Licht über die Karte (`tag` =
  keines; am Dialogende kehrt das Licht der Karte zurück, Wechsel blenden in zwei Sekunden um).
  `#figur:<objektname>:aus|halb|ein` blendet eine Figur der Karte in einer Sekunde (nur bis zum
  Verlassen der Karte; ausgeblendet sperrt sie den Weg nicht). `#erscheint` blendet das Porträt in
  zwei Sekunden ein, `#geist` zeigt es halb durchsichtig.
- Teilchen (T8): `teilchen` je Karte in `orte.json` (`staub` im Lichtstreifen, `sternschnuppen`,
  `nebel`; Winterkarten haben Schnee). `#teilchen:staub` wechselt sie bis zum Dialogende,
  `#teilchen:aus` nimmt sie weg. Auf dem Handy höchstens 40 Teilchen.
- Erinnerung (T10): `#erinnerung` an einer Zeile zeigt den Dialog im Sepia-Rahmen und die Karte in
  Sepia, bis `#erinnerung:aus` oder bis der Dialog endet.
- Porträtfassungen (T4): `#stimmung:jung|ertappt|riss|alt|lachtOhneSpott|muede` zeigt
  `portraets/<sprecher>-<fassung>.svg` (kebab-case, etwa `mira-lacht-ohne-spott.svg`); fehlt die
  Datei, die Grundfassung. Andere Stimmungen zeigen immer die Grundfassung. Porträtblätter: je Figur ein Blatt
  `portraets/blatt/<name>.png` im privaten Repository mit sechs Fassungen à 64 × 64 (3 × 2: neutral,
  lächelt, nachdenklich, überrascht, bitter, lacht; Ambrose jung als eigenes Blatt
  `ambrose-jung.png`). Welche Stimmung welches Feld zeigt, steht in `portraetblatt.json`
  (konfigurierbar, Schema `abenteuer-portraetblatt`). Ein Einzelbild
  `portraets/gross/<name>[-<fassung>].webp|png` geht dem Blatt vor (Sonderfassungen wie `riss`);
  das SVG bleibt Rückfall.
- Tondateien: Die Kennung wird zum Dateinamen (camelCase → kebab-case, ein Punkt bleibt:
  `ambrose.lassMich` → `musik/ambrose.lass-mich.m4a`). Im privaten Repository liegt der Ton von
  Akt 1 direkt in `musik/` und `klang/` (Grundpaket), der Ton der Akte 2 bis 4 in `musik/akt2/` …
  `klang/akt4/`; das Spiel lädt ihn beim Betreten des Akts nach, das Spielmenü bietet „Musik der
  späteren Akte jetzt laden“. Kurze Motive erzeugt der Browser selbst, ohne Datei: `#klang:aha`,
  `konzern`, `hale`, `aufgabe`, `fehler`, `atme`, `kerzenton` und `blindschach.<feld>` (ein Ton je
  Feld: Linie = Stufe, Reihe = Lage). Eine Datei gleichen Namens wird dann nicht gebraucht.
- Bild (T7): `#bild:kennung` zeigt `bilder/<kennung>.webp` (privater Ordner `bilder/`, höchstens
  1024 Pixel breit) groß über der Zeile; „Weiter“ schließt es mit der Zeile. Fehlt die Datei,
  erscheint die Zeile ohne Bild.
- Externe Funktionen (`EXTERNAL`) führt die React-Hülle aus und schreibt in den Spielstand:
  `gibKarte(kennung)`, `setzeSzene(kennung)`, `beginnePartie(begegnung)`, `beginneAufgaben(runde)`,
  `setzeZustand(gegner, faktor, grund)`, `schalteSteckbrief(gegner, zeile)`, `gibFund(kennung)`,
  `oeffneLaden(kennung)`, `reise(karte, ausloeser)`, `beginneGedaechtnis(kennung)`,
  `beginneSimultan(kennung)`, `zeigeVorfuehrung(kennung)`, `setzeToenung(name)`, `zeigeAbspann()`, `zeigeFensterbank()` (alle Funde des Helden, T15), `schreibeTagebuch(name)` (eine Seite im Tagebuch mit Schreibanimation, Text
  `tagebuch.eintrag.<name>`, Roman Kap. 9)
  und `zahle(muenzen)`. `zahle` zieht einen festen Preis ab (Lastkahn: 5 Münzen); reicht das Geld
  nicht, geschieht nichts. Deshalb fragt der Dialog vorher die Variable `muenzen` ab
  (`VAR muenzen = 0`, beim Öffnen aus dem Spielstand gesetzt) und sagt sonst „nicht genug“.
- Globale `VAR` liegen im Spielstand (`dialogvariablen`) und überleben Szenen; `held` ist der Name
  des Helden.
- Beim Build übersetzt der JavaScript-Compiler von inkjs jede Datei nach JSON ins Zusatzpaket
  (Gruppe `dialoge`). Die Ink-Quelle bleibt die Wahrheit; JSON wird nie von Hand bearbeitet.
- Beispiel: `dialoge/de/maple-falls-dachboden.ink` (Fund des Bretts, Ambrose erwacht, erste Karte,
  Übergang in die erste Partie).

## Partiemomente (`begegnungen.json`, `momente`)

Eine Sprechzeile mit Porträt erscheint mitten in der Partie oben über dem Brett (Atmosphäre T5).
Sie blockiert nichts, die Engine wartet nicht, und sie verschwindet nach einer Lesedauer oder auf
Tipp. Jeder Moment kommt höchstens einmal je Partie.

```json
"momente": [
  { "wenn": { "zug": 12 }, "sprecher": "ambrose", "text": "moment.clubkampf.zaehl", "klang": "herzschlag" },
  { "wenn": { "merkmal": "schachGegen" }, "sprecher": "ambrose", "text": "moment.okafor.lassMich", "musik": "aus" }
]
```

- `wenn` darf mehrere Bedingungen verbinden; alle müssen gelten.
- `zug`: direkt nach dem n-ten Zug des Helden; `abZug`: frühestens nach so vielen Zügen;
  `uhrUnter`: nur wenn die Uhr des Helden weniger Sekunden zeigt (Partie mit Uhr).
- `merkmal` gilt für den letzten Halbzug: `schachGegen` (der Held steht im Schach),
  `schachGegeben`, `damenTausch` (die letzte Dame verschwindet), `materialMinus3` (der Held fällt
  auf drei Bauerneinheiten Rückstand), `geschlagen:<figur>` (der Gegner schlägt `bauer`,
  `springer`, `laeufer`, `turm` oder `dame` des Helden).
- Vor dem Zug des Helden (nach dem Zug des Gegners): `koeder` (ein Bauer ist schlagbar, danach
  setzt der Gegner in höchstens zwei Zügen matt) und `turmopfer` (ein Turm kann neben den
  gegnerischen König ziehen und ginge im Abtausch verloren; ob das Opfer korrekt wäre, prüft die
  App nicht).
- Geführter Moment (T11): `dialog` (`datei.knoten`) statt `text` öffnet einen Ink-Dialog mit
  Wahlen über dem Brett; die Uhr des Helden steht, solange er offen ist. Variablen gehen in den
  Spielstand, Oberwelt-Funktionen (Karten, Reisen, Läden) wirken hier nicht, und Quests hören die
  Knoten nicht. Der Dialog führt keinen Zug aus.
- Rückfall für seltene Merkmale: `koeder` und `turmopfer` kommen nicht in jeder Partie vor. Soll
  der Moment sicher kommen, folgt ein zweiter Eintrag mit demselben `dialog` und nur `abZug`
  (etwa 20). Weil jeder Moment höchstens einmal kommt und der Dialog seine Variable setzt
  (`clubkampfZaehlGesagt`), fragt der Knoten am Anfang die Variable ab und endet sofort, wenn er
  schon lief; ein Knoten ohne Zeile schließt den Dialog ohne Anzeige.
- Lösen mehrere Momente zugleich aus, spricht der erste der Liste; die anderen sind verbraucht.
- `text` steht in `texte/<sprache>.json`, der Name kommt aus `figur.<sprecher>.name`; `klang` und
  `musik` wirken wie die Dialogtags.

## Spielstärke durch Dialog (`begegnungen.json`, `staerkeNach`)

`"staerkeNach": [{ "wenn": "atmeGesagt", "stufe": 1, "profil": "positionsspieler" }]`: Sobald die
Bedingung gilt (Sprache wie `wenn` in `orte.json`, meist eine Variable aus einem Partiemoment mit
Dialog), spielt der Gegner für den Rest der Partie um `stufe` Stufen stärker (negativ: schwächer, in
allen Phasen, Grenzen 1 bis 10) und mit `profil` im Stil dieses Namens (`positionsspieler`: ruhiger,
weniger Opfer). Jeder Eintrag wirkt einmal je Partie, auch nach dem Neuladen.

## Aufgabenrunden (`runden.json`)

- `danach` (`datei.knoten`): Ein Dialog, der nach der Runde von selbst startet, sobald die
  Ergebniskarte geschlossen ist; er kann über Dialogvariablen nach dem Ergebnis verzweigen.

- Eine Runde (Ink: `beginneAufgaben("ort.runde")`) nennt Steller (Figur), Buchübungen (`ueb:…`,
  Teilmenge von `club.aufgaben.buchuebungen` des Ortes), Themen der Trainer (`haengend`, `matt1`,
  `mattbilder`, Motive wie `doppelangriff`) und `reihe` (gehört zur Aufgabenreihe vor dem
  Clubkampf). Die Zahl der Motivaufgaben folgt dem Zeitbudget des Clubs (Regelwerk R30), außer die
  Runde nennt `anzahl` (Rätsel, Erinnerungen).
- Buchübungen müssen als Aufgaben des Taktiktrainers vorliegen (Lösungszug); Zählübungen und
  Mattführungen fallen derzeit heraus.
- Quests warten mit `{ "art": "aufgaben", "runde": "ort.runde" }` auf die bestandene Runde.

## Bedingungen und Zustände der Karten (Runde 8)

- **Bedingungen** stehen in `wenn` an Übergängen und als Schlüssel in `zustaende` einer Karte
  (`orte.json`). Sprache: eine Variable (`musikhausOffen`, Besitz wie `hatLaterne`), ein Vergleich
  mit Zahl, `"Text"` oder `wahr`/`falsch` (`nadelMapleFalls >= 1`, `ausgangIronwoodGus == "sieg"`),
  verknüpft mit `nicht`, `und`, `oder` und Klammern; `und` bindet stärker als `oder`. Eine fehlende
  Variable zählt als 0, leerer Text oder falsch. Dieselbe Sprache steht in
  `app/src/abenteuer/regeln/bedingung.ts`, `pipeline/abenteuer/bedingung.py` und
  `pipeline/abenteuer/bedingung.cjs` (Gesamtsimulation).
- **Figuren mit Bedingung:** Eine Figur in `orte.json` kann `wenn` tragen; sie steht dann nur auf
  der Karte, wenn die Bedingung beim Betreten gilt (Stufen A bis D der kleinen Geschichten). Soll
  dieselbe Person auf zwei Karten stehen, bekommt sie je Karte ein eigenes Objekt und eine eigene
  Kennung mit demselben Dialog, etwa `wegMapleCedar.tessa` (Landstraße, `nadelCedarCreek == 0`) und
  `wegMapleCedar.tessaFluss` (Flussweg, `nadelCedarCreek > 0 und nadelRiverton == 0`).
- **Möbel mit Bedingung:** Ein Szenenobjekt kann `wenn` tragen (gleiche Sprache). Der Kartenbau
  schreibt es als Eigenschaft `wenn` in die Tiled-Karte; die App lässt das Möbel samt Kollision weg,
  solange die Bedingung beim Betreten nicht gilt. Was mit `auf` auf einem bedingten Möbel steht,
  erbt dessen Bedingung. Möbel liegen nie im Hintergrundbild, deshalb braucht es dafür keine
  Kartenkopie. Die Prüfungen des Kartenbaus (Durchgänge, Überdeckung) rechnen mit dem Möbel.
- **Zustände:** `"zustaende": { "<bedingung>": "karten/<basis>-<zustand>.json", … }`. Der letzte
  Eintrag, dessen Bedingung gilt, wird geladen; ohne passenden die Grundkarte. Je Zustand eine
  Szene `szenen/<basis>-<zustand>.json` mit `zustand_der_karte` = derselben Bedingung und einer
  `beschreibung`, die mit „Zustand: …“ beginnt (wann in der Geschichte, was sich ändert, warum).
  `kartenbild` zeichnet dazu `grafik/karten/<kennung>-<zustand>.png`. Beispiel Park:
  `"nadelMapleFalls < 1": "karten/maple-falls-park-steg-gesperrt.json"`.
- **Winter** (Entscheidung 10.11.2026): Eine Zustandsszene mit `"jahreszeit": "winter"` wird
  umgefärbt, ohne eigene Schneebilder. `kartenbild` färbt den Hintergrund (Gras und Laub werden
  Schnee, Erde entsättigt, Wasser kühler; `pipeline/abenteuer/winter.py`). Die App färbt die
  Möbel beim Laden genauso um, aber ohne die Wasserregel (`oberwelt/winter.ts`), und lässt Schnee
  fallen (`oberwelt/schneefall.ts`). Blumen und Pilze bleiben bunt; `kartenbild` meldet sie in
  Winterszenen, sie gehören dort weg.
- **Licht** (Atmosphäre T6): `licht` je Karte in `orte.json` (`tag` = kein Schleier, `abend`,
  `nacht`, `nebel`, `dunst`, `serverblau`, `sepia`, `dunkel`) geht vor der `toenung` der Szene,
  ohne die Szene anzufassen. `licht_zustaende` (Bedingung → Licht, der letzte passende gilt)
  ersetzt `licht`, etwa `{"nadelGhostCanyon >= 1": "abend"}`. `setzeToenung` im Dialog geht vor.
- **Klangquellen** (Atmosphäre T28): `klangquellen` je Karte in `orte.json`,
  `[{"objekt": "rosiesWagen", "musik": "rosie", "reichweite": 20}]`. `objekt` ist der Name eines
  Objekts der Tiled-Karte (jede Art), `musik` eine Kennung wie bei `#musik`, `reichweite` in
  Feldern (Vorgabe 20). Voll bis zur halben Reichweite, dann leiser bis still; die Musik der Karte
  weicht im selben Maß. pytest prüft, dass es das Objekt gibt.
- **Liste für den Autor:** `python -m pipeline.abenteuer.zustaende` (Text) oder `--json`.
  `pipeline/tests/test_abenteuer_zustaende.py` prüft Lesbarkeit, bekannte Variablen, Dateinamen und
  den „Zustand:“-Satz.

## Tiled-Karten (`karten/<ort>-<karte>.json`)

- Orthogonal, 16-px-Kacheln, JSON-Export von Tiled 1.11 (Claude schreibt die Dateien direkt; der
  Autor kann sie in Tiled öffnen).
- Ebenen in fester Reihenfolge: `boden` (Kachelebene), `waende` (Kachelebene, über dem Boden),
  `objekte` (Kachelebene, über den Figuren, wenn `properties.ueberFiguren` gesetzt ist),
  `ausloeser` (Objektebene).
- Kollision steht am Kachelsatz: Kacheln mit der Eigenschaft `kollision = true` sind nicht begehbar.
- Kachelstil (gekaufte Grafik): automatisch innen, Stadt, Natur (Wege) oder Wüste; eine Karteneigenschaft
  `stil` (etwa `kueste`: Wand = Wasser, Teppich = Holzsteg) geht vor.
- Möbel und Schmuck (gekaufte Grafik): Objekte mit `type = "moebel"` in der Ebene `ausloeser`,
  Name = Schlüssel in `moebel/<ort>.json` (Pfad im privaten Register, Breite, Höhe, `kollision`; eine
  Datei je Ort, gemeinsame Einträge in `moebel/allgemein.json`, Namen über alle Dateien eindeutig), `x`/`y`
  = linke obere Ecke in Pixeln auf dem Kachelraster. Mit `kollision` ist alles außer der obersten
  Kachelreihe gesperrt; ein Möbel darf keinen Auslöser und keine Figur zustellen (Test).
- Objekte der Ebene `ausloeser` haben `type = "ausloeser"` und einen Namen, der in `orte.json`
  unter `ausloeser` erklärt wird (`start`, `uebergang`, `dialog`, `gegenstand`). Ein Objekt
  `start` mit `richtung` ist der Standardeinstieg. Übergänge (`ziel.karte`, `ziel.ausloeser`)
  gelten je Ort; heißt der Rückweg gleich (Tür „schule“ auf beiden Karten), bekommt der zweite
  Eintrag in `orte.json` das Feld `karte` und geht auf dieser Karte vor. Zwischen Orten reist man
  nicht über Übergänge, sondern über einen Dialog (Bus) mit `~ reise("ort.karte", "ausloeser")`,
  oder zu Fuß über einen Weg: ein Ort mit `art: "weg"` (Nummer 0, ohne Club), dessen Übergänge in
  die Nachbarstädte führen dürfen (docs/spiel/08, W1; Beispiel `wegMapleCedar`).
- Ein Übergang kann `dialog` haben (läuft vor dem Wechsel: Abschied, Ankunft) und `wenn` (eine
  Dialogvariable; ist sie nicht wahr, läuft nur der Dialog, der Held bleibt). Beispiel: Park,
  `landstrasse` mit `wenn: aufbruchGesehen`.
- Figuren stehen nicht in der Tiled-Datei, sondern als Objekte mit dem Namen der Figur in der
  Ebene `ausloeser` (später: `type = "figur"`), damit `orte.json` die Wahrheit über Dialog und
  Gegner bleibt.
- Kachelsätze sind eingebettet (kein `.tsx`), Bildpfad relativ zum Paketordner. Im Prototyp:
  `grafik/platzhalter.png` (CC0), 4 × 4 Kacheln. Gekaufte Grafik (LimeZu) liegt nur lokal unter
  `app/inhalte-privat/abenteuer/grafik/` (gleiche Dateinamen); der Paketbau nimmt sie, wenn sie da
  ist, sonst zeichnet er die Platzhalter.
- Figuren aus PixelLab (Entscheidung zum Stil, 13.11.2026): je Figur ein Ordner
  `figuren-neu/<name>/` im privaten Repository, wie PixelLab ihn exportiert (`rotations/<richtung>.png`
  32 × 32, `animations/Walk/<richtung>/frame_00N.png` 48 × 48). Der Paketbau
  (`app/skripte/figurenbogen.mjs`) setzt daraus `figuren32/<name>.png` zusammen: Rahmen 32 × 32 in
  der Ordnung von LimeZu, Laufbilder um die Mitte auf 32 × 32 zugeschnitten (Füße auf Zeile 30, wie
  die Standbilder), den Bodenschatten des Exports überall entfernt; fehlt eine Laufrichtung, wird
  links aus rechts gespiegelt, sonst bleibt das Standbild. `<name>` ist der Name des alten Bogens
  (`figuren/juno.png` → `figuren-neu/juno/`, der Held `held-0`); wo es keinen neuen gibt, gilt
  LimeZu. Die Figur ist etwa 28 Pixel hoch, die Kollision bleibt die Kachel der Füße. Jede Figur
  wird so verschoben, dass die Füße ihrer Standbilder auf Zeile 30 stehen (Kinder stehen im Export
  oft höher). Einen alten Bogen braucht es nicht: `sprite: figuren/ada.png` findet
  `figuren32/ada.png`, ebenso Statisten mit `eigenschaften.bild: "otis"`.
- Geister (Wunsch des Autors, 13.11.2026): Eine Figur mit `"geist": true` in orte.json (bisher
  Ambrose, `mapleFalls.ambrose`) steht auf jeder Karte leicht durchsichtig (Deckkraft 0,7), ganz
  leicht kühl getönt und schwebt sanft um 1 Pixel auf und ab; die Kollision bleibt die Fußkachel.
  Ihr Porträt im Dialog ist leicht durchsichtig (0,75). In Erinnerungen (Sepia, der junge Ambrose)
  sieht sie normal aus, und die Marken `#geist` (halb durchsichtig) und `#erscheint` (einblenden)
  gehen wie bisher vor. Die Eigenschaft gilt für jede Figur, nicht nur für Ambrose; der Sprecher im
  Dialog ist der Kurzname der Kennung (`#sprecher:ambrose`). Regeln: `app/src/abenteuer/regeln/geist.ts`.
- Beispiel: `karten/maple-falls-dachboden.json` (12 × 10, Auslöser `start`, `brett`, `treppe`),
  erzeugt mit einem kleinen Skript; die Kacheln 1–8 sind Boden, Wand, Kiste, Teppich, Brett,
  Treppe, Lampe, Fenster.
