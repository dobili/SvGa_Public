# Kurze Partieformen (17.11.2026, mittel-3)

Auftrag des Hauptchats nach einem Wunsch des Autors: Nicht jede Begegnung soll eine ganze Partie
sein. Kurze Formate kommen öfter vor, abwechslungsreicher und mit erzähltem Einstieg.

## Was gebaut ist

- **Laufzeit für alle kurzen Formate:** Das Stellungsduell (R13) hatte bisher keine
  Zugbegrenzung zur Laufzeit; es lief wie eine ganze Partie aus einer Stellung. Jetzt endet jede
  kurze Form nach `zuege` eigenen Zügen und der Antwort des Gegners. Die Auswertungs-Engine
  bewertet dann mit Tiefe 12, und der Ausgang folgt der Regel des Formats
  (`app/src/abenteuer/regeln/kurzform.ts`, `anbindung/useKurzform.ts`). Neue Enden der App:
  „ziel“ (mit Sieger) und „zielRemis“ (Texte in `i18n/de.json` und `en.json`).
- **Neue Formate (Regelwerk R13a bis R13c):** `endspiel` mit Ziel `sieg` oder `remis`, `vorteil`
  (Vorteil herausarbeiten aus einer ausgeglichenen Stellung) und die Startstellung `eroeffnung`
  (Eröffnung fremd; danach ganze Partie oder Vorteil). Beim Endspiel „Remis halten“ ist ein Remis
  nach den Regeln ein Sieg, ein angenommenes Remisangebot (Karte) nicht.
- **Erzählter Einstieg:** Feld `erzaehlung` in begegnungen.json (`vorher`, optional `verlauf`,
  `nachher` je Ausgang), Texte unter `erzaehlung.*`. Die Spielhülle zeigt den Einstieg mit dem
  bisherigen Verlauf (bei Eröffnung fremd die Züge der Eröffnung) über der Kartenleiste. Er
  verschwindet beim ersten Zug oder mit „Ans Brett“. Während der Partie steht das Ziel mit den
  restlichen Zügen dort, nach dem Ende der Satz je Ausgang.
- **Prüfung der Stellungen:** `python -m pipeline.abenteuer.kurzformate` bewertet jede
  Startstellung einmal mit derselben Engine wie die App (Fenster je Format, Spielraum 0,1). Läuft
  auch als pytest, wenn die Engine da ist. Stand: 0 Funde.

## Einsatz

| Begegnung                         | Akt | vorher                | jetzt                                                      |
| --------------------------------- | --- | --------------------- | ---------------------------------------------------------- |
| `wegRivertonIronwood.dime`        | 2   | ganze Partie 3 + 2    | Eröffnung fremd (Caro-Kann, Vorstoß), dann Vorteil 12 Züge |
| `wegSiliconDelacroix.schiffskoch` | 3   | Stellungsduell (6.25) | Endspiel Remis halten, Schwarz, Abb. 9.46, 15 Züge         |
| `wegDesertSummit.kreideblitz`     | 4   | ganze Partie 3 + 2    | Vorteil herausarbeiten, Abb. 5.43, 10 Züge                 |
| `capitalArena.kreidenacht1`       | 4   | ganze Partie 3 + 2    | Endspiel gewinnen, Abb. 9.8 (Turm und Bauer), 20 Züge      |
| `summitCity.sol`                  | 4   | Stellungsduell (6.21) | Endspiel gewinnen, Abb. 8.27 (Opposition), 15 Züge         |

Damit sind drei von sieben ganzen Straßen- und Nebenpartien kurz. Nicht angefasst: Clubkämpfe,
Story-Partien mit festem Verlauf, Varianten (Blind, Schach960, nach Gehör), die Meisterschaft
(Balance 15.11.2026, Schwelle 2), Sams Revanche und Z-1 („Buch und Bruch“). Einen erzählten
Einstieg haben dazu Skater Jo (Akt 1), Mr. Harlan (Akt 2), Buck (Akt 3) und Rangerin Hollis
(Akt 4). Die Dialoge nennen das neue Format (Sol, Ruiz, Mags, Dime, Mo).

## Vorrat Bot gegen Bot (Zusatz des Autors, 17.11.2026)

- **Partien (seit 18.11.2026, Wunsch des Autors):** Vorgefertigte Bots der App spielen
  gegeneinander, über denselben Zugweg wie in einer Partie der App: Stufen je Phase, Fehlerarten
  mit Gewichten der Persönlichkeit, Stil, Maia an (wie `partiestart.ts` mit `mitMaia`) und die
  Eröffnung aus dem Praxisbuch (`EROEFFNUNG_PRAXIS`, Buchtiefe des Bots) statt vier zufälliger
  Halbzüge. Messlauf `app/src/abenteuer/vorratspartien.messung.ts` (Node, Stockfish lite,
  Maia über onnxruntime-node), je Band ein Lauf, etwa 15 bis 30 Sekunden je Partie; die Partien liegen
  nur lokal in `buch/arbeit/vorratspartien/`. Je Band spielen sechs bis sieben Bots mit
  mindestens vier Stilen jeder gegen jeden, im Wechsel der Farben (`vorratsbots.ts`).
- **Auswahl:** `python -m pipeline.abenteuer.stellungsvorrat --aus-partien
buch/arbeit/vorratspartien` geht die Partien durch: Ab Halbzug 16 wird jede Stellung mit
  Tiefe 12 bewertet, solange ihre Phase noch zu einem gesuchten Format passt. Je Partie kommt
  höchstens eine Stellung je Format in den Vorrat, mit der Zugfolge bis dahin und der Herkunft
  (`herkunft`: Bots, Stile, Halbzug). `--pruefen` bewertet alles noch einmal und prüft Zugfolge,
  Phase und Fenster. Stand 18.11.2026: 60 Partien je Band, für Band 1 und 2 je 30 mehr (ein
  „Remis halten“ fehlte), alle 160 Stellungen voll, `--pruefen` und `kurzformate` ohne Funde.
- **Rückfall:** `--erzeugen` lässt wie bis 17.11.2026 Stockfish 19 lite mit der Stufe des Bandes
  (Skill Level 0, 3, 6, 10, 15) gegen sich selbst spielen, nach vier zufälligen Halbzügen
  (`herkunft.quelle` „stockfish“). Nur nehmen, wenn die App-Bots nicht laufen.
- **Bänder:** bis 900, 900 bis 1200, 1200 bis 1500, 1500 bis 1800, ab 1800; je Format acht
  Stellungen.
- **Gegenprobe alt (Stockfish) → neu (App-Bots)** (`python -m pipeline.abenteuer.vorratsvergleich
ALT NEU`). Hängend: Figur ohne Bauern und Könige, angegriffen und ungedeckt. Figurenmaterial
  beider Seiten ohne Bauern (Grundstellung 62), Ungleichgewicht in Bauerneinheiten.

| Band  | Stellungen | mit hängender Figur | hängend je Stellung | Figurenmaterial | Ungleichgewicht | Halbzug | Eröffnungen (4 Halbzüge) | 1. e4, d4, Sf3, c4 |
| ----- | ---------- | ------------------- | ------------------- | --------------- | --------------- | ------- | ------------------------ | ------------------ |
| band1 | 32 → 32    | 41% → 34%           | 0.44 → 0.50         | 38.4 → 39.3     | 2.1 → 2.9       | 50 → 51 | 15 → 20                  | 16% → 50%          |
| band2 | 32 → 32    | 28% → 16%           | 0.34 → 0.19         | 39.0 → 40.3     | 2.1 → 2.6       | 51 → 44 | 17 → 20                  | 22% → 59%          |
| band3 | 32 → 32    | 16% → 22%           | 0.22 → 0.25         | 37.7 → 34.5     | 1.8 → 1.6       | 47 → 45 | 14 → 13                  | 12% → 78%          |
| band4 | 32 → 32    | 22% → 28%           | 0.22 → 0.41         | 38.4 → 39.5     | 1.1 → 1.4       | 49 → 44 | 11 → 16                  | 12% → 78%          |
| band5 | 32 → 32    | 28% → 9%            | 0.41 → 0.12         | 38.3 → 41.5     | 1.0 → 1.4       | 40 → 43 | 14 → 11                  | 6% → 91%           |
| alle  | 160 → 160  | 27% → 22%           | 0.33 → 0.29         | 38.4 → 39.0     | 1.6 → 2.0       | 47 → 45 | 71 → 70                  | 14% → 71%          |

Deutlich anders sind die Eröffnungen: Die alten Stellungen begannen mit zufälligen Zügen
(häufigste Anfänge `h4 f6`, `b4 Na6`, `e3 Nh6`, `b3 Na6`), die neuen mit dem, was Menschen der
Stärke spielen (`e4 e5`, `d4 d5`, `e4 c5`, `Nf3 d5`; in Band 1 auch `a3 e5`, wie im Praxisbuch
für schwache Spieler). Hängende Figuren und Material ändern sich wenig und ohne klare Richtung:
Die Fenster der Formate (etwa +0,8 bis +2,5) lassen grobe, noch offene Fehler ohnehin nicht zu;
die Fehler der Bots zeigen sich eher darin, wie eine Stellung entstand (etwa das frühe
Damenschach 4. De2+ vor `band3.vorteil1`), als in einer offen hängenden Figur im Übernahmepunkt.

- **App:** Startstellung `{ "art": "vorrat", "format": "stellungsduell" | "vorteil" |
"endspielSieg" | "endspielRemis" }`. Gewählt wird nach der Zielstärke des Gegners, zufällig
  und ohne Wiederholung, bis ein Format im Band durch ist (`vorratGenutzt` im Spielstand,
  `regeln/vorrat.ts`, `anbindung/vorratsstellung.ts`). Der Leser übernimmt die Seite am Zug. Der
  Einstieg zeigt die letzten zwölf Halbzüge der Vorgeschichte.
- **Eingesetzt:** Gus in Ironwood (Akt 2), die Joggerin auf der Glasbrücke (Akt 3) und Rangerin
  Hollis (Akt 4), alle als Stellungsduell aus dem Vorrat und mit erzähltem Einstieg. Ihre alten
  Abbildungen 6.14 und 4.41 lagen am unteren Rand des Fensters.
- **Kein Erzeugen auf dem Handy:** Eine Partie mit Prüfung braucht schon hier mit Node einige
  Sekunden, und nicht jede Partie liefert eine passende Stellung (Endspiele zum Halten sind
  selten). Mit der WebAssembly-Engine auf einem Kern eines Handys wäre es ein Vielfaches, also weit
  über „wenige Sekunden“.

## Für die Wegsperren (Fable-Chat)

- Endspiel: `"format": { "art": "endspiel", "zuege": 15, "ziel": "sieg" }` oder `"ziel": "remis"`,
  Startstellung am besten eine Abbildung aus Kapitel 8 oder 9 (Fenster: gewinnen +1,5 bis +8,
  halten −1,5 bis +0,3 aus Sicht des Lesers am Zug).
- Vorteil herausarbeiten: `"format": { "art": "vorteil", "zuege": 10, "mindestvorteil": 1.0 }`
  aus einer Stellung zwischen −0,5 und +0,5 (Abbildung, FEN oder `"startstellung": { "art":
"eroeffnung", "zuege": [...] }`).
- Erzählung: `"erzaehlung": { "vorher": "erzaehlung.x.vorher", "nachher": { "sieg": …,
"remis": …, "niederlage": … } }`, Texte in texte/de.json.
- Danach `python -m pipeline.abenteuer.kurzformate`.

## Nicht gebaut

- Auswahl der fremden Eröffnung nach den Schwächen des Lesers (Fehlerdatenbank): Dafür fehlt eine
  Zuordnung von Fehlerarten zu Eröffnungen. Die Auswahl nach dem, was der Leser selten spielt, ist
  gebaut (R13c, `alternativen`; Dime hat vier Eröffnungen zur Wahl).
- Meisterpartien als Quelle (`startstellung: meisterpartie`) löst die App weiterhin nicht auf.

## Simultan auf Weg 11 (nachgezogen)

Die Bretter `wegGhostCapital.simultan1` bis `5` starteten zwischen −0,2 und +5,4. Jetzt liegen
alle zwischen +0,9 und +1,4 aus Sicht des Lesers: 6.29 (Slick), 3.62 (Big Joe), 3.41 mit Schwarz
(Mrs. Okafor), 5.15 (Céleste, Bauernendspiel), 4.41 (Hollis). Die Ausnahme in der Prüfung ist
entfernt; `python -m pipeline.abenteuer.kurzformate` meldet 0 Funde.
