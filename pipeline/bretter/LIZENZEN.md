# Bretter der App – Herkunft und Lizenzen

Stand: 18.10.2026. Auswahl des Autors für die Einstellung „Brettfarben“; in der App seit 0.2.84. Werte und Dateinamen in `farben.json`.

## Farben

Wie im Buch, Grün (beide schon in der App), Braun, Blau, Sand, Koralle, Lavendel, Nacht.
Reine Farbwerte, keine Lizenz nötig.

## Holz

Ahorn & Nussbaum: die beiden Holzfotos, die schon in der App sind (`app/public/holz/`, ambientCG
Wood095 und Wood026, CC0, siehe `docs/LIZENZEN.md`). Faser längs, Maserung normal, also genau wie
heute; es gibt keine weiteren Holzoptionen.

## Materialbretter

Ganze Brettbilder (8 × 8 Felder, 1024 × 1024 Pixel, a8 oben links hell) aus dem Lichess-Repository
`lichess-org/lila`, Ordner `public/images/board/`. Lizenz laut `COPYING.md` dort: AGPLv3 oder
neuer, Urheber „the lila authors and pirouetti“. Lizenztext: `lizenzen/AGPL-3.0.txt`.

| Datei | Name in der App | Original bei Lichess |
|---|---|---|
| `bilder/intarsie-ahorn.jpg` | Intarsie Ahorn & Kirsche | `maple2.jpg` |
| `bilder/holz-klassisch.jpg` | Holz klassisch | `wood4.jpg` |
| `bilder/marmor-gruen.jpg` | Marmor grün | `marble.jpg` |

Die Bilder hier sind unverändert; die App liefert sie als WebP (Qualität 82, `app/public/bretter/`),
weil ihr Offline-Speicher keine JPEG-Dateien vorhält. Die AGPLv3 lässt sich mit der GPLv3 der App kombinieren
(GPLv3 Abschnitt 13); für diese Bilder gelten weiter die AGPL-Bedingungen, vor allem der Zugang zum
Quelltext für Nutzer über das Netz. Das erfüllt das öffentliche Repository. Die Lizenzseite der App nennt sie
(Lizenztext `app/public/lizenzen/agpl-3.0.txt`).
