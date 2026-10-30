# Lizenzen

| Teil                                                                                                                   | Lizenz                              | Lizenztext                                                    |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| Code der App und der Pipeline                                                                                          | GNU GPL 3.0 oder neuer              | `LICENSE` (auch in der App: `/lizenzen/gpl-3.0.txt`)          |
| Buchinhalte (Stellungen, Bildunterschriften, Cover)                                                                    | Alle Rechte vorbehalten             | –                                                             |
| Trainingsseiten (`inhalte/de/training/`, Texte aus dem Buch)                                                           | Alle Rechte vorbehalten             | –                                                             |
| Stockfish 19 (Stockfish.js 19.0.1 von Nathan Rugg / Chess.com, Variante lite-single, Netz nn-61e7af4bb97d)            | GNU GPL 3.0                         | `/engine/LIZENZ-stockfish.txt` (beim Build aus dem npm-Paket) |
| chessops (Lichess, Niklas Fiekas), mit @badrap/result (MIT)                                                            | GNU GPL 3.0                         | `/lizenzen/bausteine.txt` (beim Build, siehe unten)           |
| Figurenschrift SkakNew-Diagram (Ulrich Dirr)                                                                           | LPPL 1.2 oder neuer                 | `app/public/lizenzen/lppl-1.3c.txt`                           |
| Figurensätze (9 Sätze, `app/public/figuren/`, Quelle `pipeline/figuren/saetze/`, seit 0.2.82)                         | je Satz: GPLv2+, GPLv3+, Apache 2.0, MIT, CC0 | `pipeline/figuren/saetze/LIZENZEN.md`; `app/public/lizenzen/` |
| Trainer-Aufgaben aus der Lichess-Puzzle-Datenbank (`inhalte/de/trainer/taktik.json`, `falle.json`, seit P4 `endspiel.json`, Herkunft `lichess`; seit Paket 8 `app/public/daten/zusatzaufgaben.json`) | CC0 1.0 (gemeinfrei) | – (keine Pflichten; Herkunft in `docs/TRAINERDATEN.md`)       |
| Source Sans 3, Source Serif 4 (Adobe)                                                                                  | SIL Open Font License 1.1           | `app/public/lizenzen/ofl-*.txt`                               |
| Holzbilder der Bretts „Ahorn & Nussbaum“ (ambientCG, Wood095 und Wood026)                                                      | CC0 1.0 (gemeinfrei)                | – (keine Pflichten; Herkunft unter Hinweise)                  |
| Materialbretter Intarsie Ahorn & Kirsche, Holz klassisch, Marmor grün (Lichess, `app/public/bretter/`, seit 0.2.84) | GNU AGPL 3.0 oder neuer | `app/public/lizenzen/agpl-3.0.txt`; `pipeline/bretter/LIZENZEN.md` |
| Porträts der Gegner und zur Wahl für eigene Bots (`app/public/gegner/`, Stil „Personas“ von Draftbit, erzeugt mit DiceBear)          | CC BY 4.0 (Zeichnungen), MIT (Code) | `app/public/lizenzen/cc-by-4.0.txt`                           |
| Eröffnungsnamen (Lichess chess-openings, `inhalte/lichess/`)                                                           | CC0 1.0 (gemeinfrei)                | – (keine Pflichten; Herkunft in `inhalte/lichess/README.md`)  |
| Praxisbuch: Eröffnungszüge aus der Lichess-Datenbank, September 2026 (`app/public/daten/praxisbuch.json`, seit 0.2.128) | CC0 1.0 (gemeinfrei) | – (keine Pflichten; Herkunft in `pipeline/praxisbuch/__init__.py`) |
| Maia-2 (CSSLab, University of Toronto; Netze Blitz und Schnellschach als ONNX in `app/public/maia/`, Zusatzpaket seit 0.2.143) | MIT | `app/public/lizenzen/mit-maia2.txt` |
| onnxruntime-web 1.20.1 (Microsoft; Laufzeit des Maia-Zusatzpakets, `app/public/maia/ort/`, beim Build aus dem npm-Paket) | MIT | `app/public/lizenzen/mit-onnxruntime.txt` |
| React, React DOM, Scheduler, Workbox, vite-plugin-pwa                                                                  | MIT                                 | `/lizenzen/bausteine.txt` (beim Build, siehe unten)           |
| Lucide-Symbole, idb                                                                                                    | ISC                                 | `/lizenzen/bausteine.txt` (beim Build, siehe unten)           |
| Wertungsvergleich (Zahlen aus chessgoals.com/rating-comparison, Juli 2026, in `app/src/spiel/umrechnung-daten.ts`, seit 0.2.125) | Fakten, kein Schutz; Quelle genannt | – (Herkunft in der Datei und in der Erklärung der App)        |

## Hinweise

- **Lizenztexte der npm-Pakete (seit 0.2.113):** Vite schreibt beim Build die Lizenztexte aller
  eingebauten Pakete mit ihren Copyright-Zeilen nach `/lizenzen/bausteine.txt`
  (`build.license` in `app/vite.config.ts`); die Lizenzseite der App verlinkt sie bei chessops,
  React, Workbox, Lucide, idb und @badrap/result. Grund: MIT und ISC verlangen, dass der Text mit
  ausgeliefert wird. Die Workbox-Module im Service Worker (workbox-precaching, -routing, -core)
  stehen unter derselben MIT-Lizenz von Google wie das dort aufgeführte workbox-window.
- **Schriften:** Die OFL-Texte in `app/public/lizenzen/` tragen seit 0.2.113 die Copyright-Zeile
  von Adobe aus `adobe-fonts/source-sans` und `adobe-fonts/source-serif`; Fontsource liefert
  dort fälschlich „Google Inc.“.

- **SkakNew:** Laut `pipeline/figuren/quelle/SkakNew.tex` (Zeile 25) gilt die LPPL 1.2 oder jede
  spätere Fassung; mitgeliefert wird die aktuelle Fassung 1.3c. Die App enthält nicht die Schrift
  selbst, sondern die daraus umgewandelten Umrisse als Vektorpfade
  (`app/src/ui/brett/figurenpfade.generiert.ts`). Die Datei trägt im Kopf Herkunft, Urheber und den
  Hinweis „umgewandelte Fassung“, wie es die LPPL für veränderte Werke verlangt; sie gibt sich
  nicht als die Originalschrift aus. Die Originaldateien liegen unverändert in
  `pipeline/figuren/quelle/`.
- **GPL und Buch:** Der Code wird wegen der GPL öffentlich. Der Buchtext gehört nicht dazu; er liegt
  nur im privaten Repository `dobili/schachbuch-quellen`. Ins öffentliche Repository kommen nur die
  erzeugten Daten der Abbildungen (Stellung, Markierungen, Bildunterschrift).
- In der App stehen alle Angaben unter **Einstellungen (Zahnrad) → Lizenzen** bzw. auf der Installationsseite unter
  „Lizenzen“.
- **Figurensätze (seit 0.2.82, Auswahl des Autors vom 18.10.2026):** Klassisch (cburnett, Merida,
  Chessnut), Modern (mpchess, Celtic, Spatial), Holz (Kiefer & Kirsche aus RhosGFX, Eiche &
  Mahagoni aus Fantasy, Esche & Ebenholz aus Livius). Die Holzsätze sind Bearbeitungen
  (`pipeline/figuren/holz_maserung.py`) unter der Lizenz ihres Originals. Urheber, Quelle und
  Lizenz je Satz: `pipeline/figuren/saetze/LIZENZEN.md`. Chessnut (Apache 2.0) und mpchess (GPLv3+)
  setzen GPLv3 voraus, das passt zur App. MIT- und Apache-Texte mit Copyright-Zeile liegen in
  `app/public/lizenzen/` und stehen in der App unter Einstellungen › Lizenzen. Sie ersetzen die
  früheren Sätze „klassisch“ (cburnett, 0.2.33) und „Holz“ (umgefärbtes Merida, 0.2.58).
- **Lichess-Puzzle-Datenbank (seit 0.2.39, Trainerdaten; seit P4 auch Endspielaufgaben):**
  https://database.lichess.org/#puzzles, CC0 1.0 (geprüft 23.10.2026: „The puzzle database is
  released under the Creative Commons CC0 license“). In den Daten stehen je Aufgabe Stellung,
  Lösung, Kennung, Wertung und die Adresse der Partie; die Datenbank selbst (300 MB) bleibt
  lokal. Einzelheiten in `docs/TRAINERDATEN.md`.
- **Zusatzaufgaben im Taktiktrainer (Paket 8, 30.10.2026):** 1000 Aufgaben derselben
  Lichess-Puzzle-Datenbank in `app/public/daten/zusatzaufgaben.json` (Kennung, Stellung, Züge,
  Wertung, ohne Partie-Adresse), CC0 1.0 (geprüft 30.10.2026 auf https://database.lichess.org/,
  Abschnitt Puzzles: „Database exports are released under the Creative Commons CC0 license.“).
  Die englischen Themennamen von Lichess (`translation/source/puzzleTheme.xml`, CC0) dienen nur
  der Zuordnung; die deutschen Namen sind eigene Begriffe aus dem Glossar des Buches, die
  deutschen Übersetzungen von Lichess (AGPL) werden nicht verwendet.
- **App-Symbol (seit 0.2.106):** `app/public/symbole/*.png` sind Ausschnitte des Buchcovers (alle
  Rechte vorbehalten wie das Cover), erzeugt mit `app/skripte/erzeuge-appsymbol.mjs`; nur das
  Symbol im Browser-Tab (`symbol.svg`) ist der Springer aus SkakNew.
- **Porträts der Gegner (seit 0.2.65):** `app/public/gegner/<kennung>.svg`, erzeugt mit
  `app/skripte/erzeuge-gegnerbilder.mjs` aus DiceBear (https://dicebear.com, Code MIT, Florian
  Körner), Stil „Personas“ (https://personas.draftbit.com, Draftbit, CC BY 4.0). Je Gegner aus der
  Kennung erzeugt, mit Vorgaben für Frisur, Bart und Haarfarbe; seit 0.2.106 ohne Hintergrund (die
  App legt je nach hellem oder dunklem Modus die Farbe dahinter, eine Änderung im Sinne von CC BY
  4.0, die in der Namensnennung „Remix“ heißt und schon in den Dateien steht). Die
  Namensnennung steht in der App unter Einstellungen → Lizenzen; der Lizenztext liegt in
  `app/public/lizenzen/cc-by-4.0.txt`. Bis 0.2.139 waren die Pakete keine Abhängigkeit der App
  (nur zum Erzeugen, `npm install --no-save`); seit 0.2.140 baut die App mit `@dicebear/core` und
  `@dicebear/personas` (je 9.4.3) im Baukasten selbst Porträts für das Profil und eigene Bots
  (`app/src/ui/profil/merkmale.ts`, nachgeladen). Ihre Lizenztexte stehen damit beim Build in
  `/lizenzen/bausteine.txt`.
  Seit 0.2.99 dazu 30 Porträts zur Wahl für eigene Bots (`wahl-01.svg` bis `wahl-30.svg`, erzeugt
  mit `app/skripte/erzeuge-portraetwahl.mjs`, gleiche Herkunft und Lizenz).
- **Materialbretter (seit 0.2.84, Auswahl des Autors vom 18.10.2026):** drei ganze Brettbilder aus
  dem Lichess-Repository `lichess-org/lila` (`public/images/board/maple2.jpg`, `wood4.jpg`,
  `marble.jpg`), Urheber „the lila authors and pirouetti“, AGPLv3 oder neuer. Die Originale liegen
  unverändert in `pipeline/bretter/bilder/`; in der App (`app/public/bretter/`) als WebP
  (Qualität 82), weil der Offline-Speicher der App keine JPEG-Dateien vorhält. Die AGPLv3 lässt sich
  mit der GPLv3 der App verbinden (GPLv3 Abschnitt 13); für die Bilder gelten weiter die
  AGPL-Bedingungen, vor allem der Zugang zum Quelltext über das Netz, den das öffentliche
  Repository erfüllt. Lizenztext und Namensnennung stehen in der App unter Einstellungen › Lizenzen.
- **Holzbilder:** `app/public/holz/hell.webp` und `dunkel.webp` stammen von ambientCG
  (https://ambientcg.com/a/Wood095 und /a/Wood026, Farbkarte „Color“ in 1K), Lizenz CC0 1.0.
  Bearbeitung (14.10.2026): um 90° gedreht, damit die Faser längs läuft; das helle Bild ist
  nahtlos nebeneinandergelegt, bis es quadratisch ist; das dunkle um 30 % aufgehellt, damit
  schwarze Figuren sich abheben; als WebP (Qualität 80) gespeichert.
