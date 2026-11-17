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

- Auswahl der fremden Eröffnung nach dem Eröffnungsprofil oder nach den Schwächen des Lesers:
  Dafür müsste der Auftrag zur Laufzeit das Profil lesen. Vorgemerkt in R13c.
- Meisterpartien als Quelle (`startstellung: meisterpartie`) löst die App weiterhin nicht auf.

## Befund am Rande

Die Simultanbretter auf Weg 11 (`wegGhostCapital.simultan1` bis `5`, Stellungsduelle mit
Mindestvorteil 0,5) starten zwischen −0,2 und +5,4. Brett 1 ist fast gewonnen, die Bretter 2 bis 5
sind ausgeglichen. Die Prüfung nimmt sie aus, weil die Simultanvorstellung eigene Regeln hat
(partieformen.json). Bitte prüfen, ob das so gewollt ist.
