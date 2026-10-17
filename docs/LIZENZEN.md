# Lizenzen

| Teil                                                                                                                   | Lizenz                              | Lizenztext                                                    |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| Code der App und der Pipeline                                                                                          | GNU GPL 3.0 oder neuer              | `LICENSE` (auch in der App: `/lizenzen/gpl-3.0.txt`)          |
| Buchinhalte (Stellungen, Bildunterschriften, Cover)                                                                    | Alle Rechte vorbehalten             | –                                                             |
| Trainingsseiten (`inhalte/de/training/`, Texte aus dem Buch)                                                           | Alle Rechte vorbehalten             | –                                                             |
| Stockfish 19 (Stockfish.js von Nathan Rugg / Chess.com)                                                                | GNU GPL 3.0                         | `/engine/LIZENZ-stockfish.txt` (beim Build aus dem npm-Paket) |
| chessops (Lichess, Niklas Fiekas)                                                                                      | GNU GPL 3.0                         | wie oben                                                      |
| Figurenschrift SkakNew-Diagram (Ulrich Dirr)                                                                           | LPPL 1.2 oder neuer                 | `app/public/lizenzen/lppl-1.3c.txt`                           |
| Figurensatz „klassisch“ (Colin M. L. Burnett, über Lichess)                                                            | GNU GPL 2.0 oder neuer              | wie der Code (GPL 3.0)                                        |
| Figurensatz „Holz“ (Merida von Armando Hernandez Marroquin, über Lichess; umgefärbt)                                   | GNU GPL 2.0 oder neuer              | wie der Code (GPL 3.0)                                        |
| Trainer-Aufgaben aus der Lichess-Puzzle-Datenbank (`inhalte/de/trainer/taktik.json`, `falle.json`, Herkunft `lichess`) | CC0 1.0 (gemeinfrei)                | – (keine Pflichten; Herkunft in `docs/TRAINERDATEN.md`)       |
| Source Sans 3, Source Serif 4 (Adobe)                                                                                  | SIL Open Font License 1.1           | `app/public/lizenzen/ofl-*.txt`                               |
| Holzbilder der Brettfarbe „Holz“ (ambientCG, Wood095 und Wood026)                                                      | CC0 1.0 (gemeinfrei)                | – (keine Pflichten; Herkunft unter Hinweise)                  |
| Porträts der vorgefertigten Gegner (`app/public/gegner/`, Stil „Personas“ von Draftbit, erzeugt mit DiceBear)          | CC BY 4.0 (Zeichnungen), MIT (Code) | `app/public/lizenzen/cc-by-4.0.txt`                           |
| Eröffnungsnamen (Lichess chess-openings, `inhalte/lichess/`)                                                           | CC0 1.0 (gemeinfrei)                | – (keine Pflichten; Herkunft in `inhalte/lichess/README.md`)  |
| React, Vite, Workbox, vite-plugin-pwa                                                                                  | MIT                                 | in den npm-Paketen                                            |
| Lucide-Symbole                                                                                                         | ISC                                 | im npm-Paket `lucide-react`                                   |
| idb                                                                                                                    | ISC                                 | im npm-Paket `idb` (ab dem Modul Speicher)                    |

## Hinweise

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
- **Figurensatz „klassisch“ (seit 0.2.33, bis 0.2.38 „kontrastreich“):** `app/public/figuren/klassisch/*.svg`,
  unverändert aus `lichess-org/lila`, Ordner `public/piece/cburnett` (laut `COPYING.md` dort:
  Colin M. L. Burnett, GPLv2+).
- **Figurensatz „Holz“ (seit 0.2.58 Merida; 0.2.39 bis 0.2.57 die klassischen Figuren umgefärbt):**
  `app/public/figuren/holz/*.svg` aus `lichess-org/lila`, Ordner `public/piece/merida` (laut
  `COPYING.md` dort: Armando Hernandez Marroquin, GPLv2+), mit anderen Farben (Elfenbein und
  dunkles Nussbaum, Wunsch des Autors: eigene Formen je Figurensatz). GPLv2+ ist mit der GPL 3.0
  des Codes verträglich.
- **Lichess-Puzzle-Datenbank (seit 0.2.39, Trainerdaten):** https://database.lichess.org/#puzzles,
  CC0 1.0. In den Daten stehen je Aufgabe Stellung, Lösung, Kennung, Wertung und die Adresse der
  Partie; die Datenbank selbst (300 MB) bleibt lokal. Einzelheiten in `docs/TRAINERDATEN.md`.
- **Porträts der Gegner (seit 0.2.64):** `app/public/gegner/<kennung>.svg`, erzeugt mit
  `app/skripte/erzeuge-gegnerbilder.mjs` aus DiceBear (https://dicebear.com, Code MIT, Florian
  Körner), Stil „Personas“ (https://personas.draftbit.com, Draftbit, CC BY 4.0). Je Gegner aus der
  Kennung erzeugt, mit Vorgaben für Frisur, Bart und Haarfarbe und einheitlichem Hintergrund. Die
  Namensnennung steht in der App unter Einstellungen → Lizenzen; der Lizenztext liegt in
  `app/public/lizenzen/cc-by-4.0.txt`. Die Pakete sind keine Abhängigkeit der App (nur zum
  Erzeugen, `npm install --no-save`).
- **Holzbilder:** `app/public/holz/hell.webp` und `dunkel.webp` stammen von ambientCG
  (https://ambientcg.com/a/Wood095 und /a/Wood026, Farbkarte „Color“ in 1K), Lizenz CC0 1.0.
  Bearbeitung (14.10.2026): um 90° gedreht, damit die Faser längs läuft; das helle Bild ist
  nahtlos nebeneinandergelegt, bis es quadratisch ist; das dunkle um 30 % aufgehellt, damit
  schwarze Figuren sich abheben; als WebP (Qualität 80) gespeichert.
