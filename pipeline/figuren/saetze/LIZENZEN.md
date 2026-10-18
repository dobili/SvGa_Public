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

## Voraussetzungen

- Die App steht unter **GPLv3 oder später**. Mit reiner GPLv2 wären `klassisch-chessnut`
  (Apache 2.0) und `modern-mpchess` (GPLv3+) nicht vereinbar.
- MIT und Apache verlangen, dass der Lizenztext mit Copyright-Zeile mitgeliefert wird.
- Bei Merida und mpchess stammt die Lizenzangabe aus der Lichess-Liste
  (lichess-org/lila, Datei COPYING.md); eine Lizenzdatei des Urhebers selbst lag nicht vor.
