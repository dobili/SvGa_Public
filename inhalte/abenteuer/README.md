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
- Porträtfassungen (T4): `#stimmung:jung|ertappt|riss|alt|lachtOhneSpott|muede` zeigt
  `portraets/<sprecher>-<fassung>.svg` (kebab-case, etwa `mira-lacht-ohne-spott.svg`); fehlt die
  Datei, die Grundfassung. Andere Stimmungen zeigen immer die Grundfassung.
- Bild (T7): `#bild:kennung` zeigt `bilder/<kennung>.webp` (privater Ordner `bilder/`, höchstens
  1024 Pixel breit) groß über der Zeile; „Weiter“ schließt es mit der Zeile. Fehlt die Datei,
  erscheint die Zeile ohne Bild.
- Externe Funktionen (`EXTERNAL`) führt die React-Hülle aus und schreibt in den Spielstand:
  `gibKarte(kennung)`, `setzeSzene(kennung)`, `beginnePartie(begegnung)`, `beginneAufgaben(runde)`,
  `setzeZustand(gegner, faktor, grund)`, `schalteSteckbrief(gegner, zeile)`, `gibFund(kennung)`,
  `oeffneLaden(kennung)`, `reise(karte, ausloeser)`, `beginneGedaechtnis(kennung)`,
  `beginneSimultan(kennung)`, `zeigeVorfuehrung(kennung)`, `setzeToenung(name)`, `zeigeAbspann()`
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

- `zug`: direkt nach dem n-ten Zug des Helden.
- `merkmal` gilt für den letzten Halbzug: `schachGegen` (der Held steht im Schach),
  `schachGegeben`, `damenTausch` (die letzte Dame verschwindet), `materialMinus3` (der Held fällt
  auf drei Bauerneinheiten Rückstand), `geschlagen:<figur>` (der Gegner schlägt `bauer`,
  `springer`, `laeufer`, `turm` oder `dame` des Helden).
- Lösen mehrere Momente zugleich aus, spricht der erste der Liste; die anderen sind verbraucht.
- `text` steht in `texte/<sprache>.json`, der Name kommt aus `figur.<sprecher>.name`; `klang` und
  `musik` wirken wie die Dialogtags.

## Aufgabenrunden (`runden.json`)

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
- Beispiel: `karten/maple-falls-dachboden.json` (12 × 10, Auslöser `start`, `brett`, `treppe`),
  erzeugt mit einem kleinen Skript; die Kacheln 1–8 sind Boden, Wand, Kiste, Teppich, Brett,
  Treppe, Lampe, Fenster.
