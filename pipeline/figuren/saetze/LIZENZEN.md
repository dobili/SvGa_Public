# Figurensätze der App – Herkunft und Lizenzen

Stand: 18.10.2026. In der App seit 0.2.82 (Einstellungen › Figurensatz); Kopien der Dateien in
`app/public/figuren/<satz>/`.
Jeder Ordner enthält 12 SVG-Dateien: `w` = Weiß, `b` = Schwarz,
dann `K` König, `Q` Dame, `R` Turm, `B` Läufer, `N` Springer, `P` Bauer.

Die Lizenztexte liegen im Ordner `lizenzen/`. Dieser Hinweis (oder eine gleichwertige
Seite „Lizenzen“ in der App) muss mit der App weitergegeben werden.

## Klassisch

| Ordner | Satz | Urheber | Lizenz | Quelle |
|---|---|---|---|---|
| `klassisch-cburnett` | cburnett | Colin M.L. Burnett | GPLv2 oder später (auch BSD, GFDL, CC BY-SA 3.0 wählbar) | Lichess: public/piece/cburnett; Wikimedia Commons |
| `klassisch-merida` | Merida | Armando Hernandez Marroquin | GPLv2 oder später (laut Lichess) | Lichess: public/piece/merida |
| `klassisch-chessnut` | Chessnut | Alexis Luengas, Copyright 2015 | Apache License 2.0 | https://github.com/LexLuengas/chessnut-pieces |

## Modern

| Ordner | Satz | Urheber | Lizenz | Quelle |
|---|---|---|---|---|
| `modern-mpchess` | mpchess | Maxime Chupin | GPLv3 oder später (laut Lichess) | Lichess: public/piece/mpchess |
| `modern-celtic` | Celtic | Maurizio Monge | MIT | https://github.com/maurimo/chess-art |
| `modern-spatial` | Spatial | Maurizio Monge | MIT | https://github.com/maurimo/chess-art |

## Holz

Die Holzsätze sind Bearbeitungen. Gegenüber dem Original wurden die Füllfarben durch
eine Holzmaserung ersetzt und die Konturen braun gefärbt. Die Formen sind unverändert.
Das Skript dafür ist `pipeline/figuren/holz_maserung.py`; es liest die unveränderten Originale aus
`quelle/` (RhosGFX, Fantasy, Livius) und schreibt die drei `holz-*`-Ordner neu.

| Ordner | Name | Original | Urheber des Originals | Lizenz |
|---|---|---|---|---|
| `holz-kiefer-kirsche` | Kiefer & Kirsche | RhosGFX | RhosGFX (https://rhosgfx.itch.io/vector-chess-pieces) | CC0 1.0 (gemeinfrei) |
| `holz-eiche-mahagoni` | Eiche & Mahagoni | Fantasy | Maurizio Monge (https://github.com/maurimo/chess-art) | MIT |
| `holz-esche-ebenholz` | Esche & Ebenholz | Livius | Martin Sedlák (https://github.com/kmar/chess_svg_piece_sets) | CC0 1.0 (gemeinfrei) |

Bearbeitung der Holzsätze: Dominik Bilitewski, 2026. Die Bearbeitungen stehen unter
derselben Lizenz wie das jeweilige Original.

## Pixelfiguren des Schach-Abenteuers (seit 14.11.2026)

Die Bretter des Schach-Abenteuers (`app/src/abenteuer/brett/`, docs/spiel/30, Abschnitt 5)
zeigen Pixelfiguren. Ihre Formen sind aus den weißen Figuren von **Kiefer & Kirsche** abgeleitet
(Original: RhosGFX, „Vector Chess Pieces“, https://rhosgfx.itch.io/vector-chess-pieces, unverändert
in `quelle/rhosgfx/`; laut Seite des Urhebers geprüft am 14.11.2026: „This project is offered for
free under Creative Commons CC0“): jede Figur auf ein Raster von 18 × 18 Feldern gerechnet (Umriss,
Körper, Schatten nach Mehrheit der Pixel) und von Hand nachgebessert (symmetrisch, Kreuz, Krone,
Zinnen und Kerbe des Läufers freigestellt, Bauer runder). Die Raster stehen als Text in
`app/src/abenteuer/brett/pixelfiguren.ts`; es gibt keine Bilddateien. Die Farben je Material
(Holz, Plastik, Stein, Metall, glatt, Ton, poliert, Sepia) sind eine Tönung derselben Zeichnung
(`materialien.ts`). Lizenz der Bearbeitung wie das Original: CC0 1.0 (gemeinfrei).

## Gold (freischaltbares Extra)

Der Satz „Gold“ ist eine Bearbeitung von Cburnett (seit Gamifizierung P7, 31.10.2026; wählbar ab
Stufe 5). Weiße Figuren haben einen goldenen Verlauf und eine dunkelbraune Kontur, schwarze das
Navy der App mit goldener Kontur und goldenen Innenlinien. Die Formen sind unverändert. Das Skript
dafür ist `pipeline/figuren/gold_umfaerben.py`; es liest `klassisch-cburnett/` und schreibt
`gold/` (und die Kopie in `app/public/figuren/gold/`).

| Ordner | Name | Original | Urheber des Originals | Lizenz |
|---|---|---|---|---|
| `gold` | Gold | cburnett | Colin M.L. Burnett | GPLv2 oder später (in der App unter GPLv3) |

Bearbeitung des Goldsatzes: Dominik Bilitewski, 2026, unter derselben Lizenz wie das Original.

## Voraussetzungen

- Die App steht unter **GPLv3 oder später**. Mit reiner GPLv2 wären `klassisch-chessnut`
  (Apache 2.0) und `modern-mpchess` (GPLv3+) nicht vereinbar.
- MIT und Apache verlangen, dass der Lizenztext mit Copyright-Zeile mitgeliefert wird.
- Bei Merida und mpchess stammt die Lizenzangabe aus der Lichess-Liste
  (lichess-org/lila, Datei COPYING.md); eine Lizenzdatei des Urhebers selbst lag nicht vor.
