# Codeführer: Kartenbau

Karten werden nicht von Hand in Tiled gemalt. Jede Karte hat eine **Szene**
(`inhalte/abenteuer/szenen/<datei>.json`, Format in `inhalte/abenteuer/szenen/README.md`), und der
Kartenbauer macht daraus die Tiled-Karte. Die Regeln dafür stehen in `docs/spiel/KARTENREGELN.md`
(Regeln 10.x); der Code liegt in `pipeline/abenteuer/`.

## Ablauf

1. **`kartenbau.py`** liest die Szene, setzt Wände aus Wandkrone und Wandfläche, Möbel „auf“
   anderen oder „an der Wand“, Böden, Säume, Straßen, Wasser und Auslöser. Er prüft dabei die
   Regeln (nichts über den Rand, keine Überlappung von Möbeln mit Kollision) und meldet Befunde.
   Aufruf: `python -m pipeline.abenteuer.kartenbau inhalte/abenteuer/szenen/*.json`.
2. **`kartentiled.py`** schreibt die Tiled-Karte nach `inhalte/abenteuer/karten/<datei>.json`
   (Raster für die Kollision, Möbel als Objekte).
3. **`kartenbild.py`** zeichnet aus der gekauften Grafik das Hintergrundbild und eine Vorschau
   (braucht Pillow und das private Repository). Vorschauen bleiben lokal.

## Bausteine

- **Möbel und Katalog**: `moebelliste.py` (alle Möbeldateien je Ort), `katalog.py` (Katalog der
  Grafik im privaten Repository), `kartenregeln.py` (Drehung, Beziehungen, Zustand, Stil),
  `maske.py`, `feinmasken.py`, `kollisionfein.py`, `objektform.py`, `objektzuschnitt.py`,
  `objektmassstab.py`, `objektkollision.py`.
- **Boden und Gelände**: `bodenraster.py`, `bodenkacheln.py`, `bodenvariation.py`, `saum.py`,
  `randspur.py`, `klippe.py`, `kehren.py`, `strasse.py`, `strassenart.py`, `hoehen.py`.
- **Gebaute Bilder**: `schildbild.py`, `vitrinenbild.py`, `schraegzaun.py`, `seitentreppe.py`,
  `treppenloch.py`, `belebungsbilder.py`.
- **Zustände und Winter**: `zustaende.py` (Liste je Karte), `winter.py` (Umfärben),
  `toenung.py` (Schleier über der Vorschau wie in der App).
- **Belebung**: `belebung.py` (genug Statisten und Tiere, jeder Statist hat einen Satz),
  `vorfuehrungen.py`.

## Ganze Welt

- `weltpuzzle.py` legt alle Außenkarten über ihre Zugänge aneinander und meldet Überlappungen,
  offene Ringe und Randbrüche.
- `weltkarte.py` baut eine Weltkarte mit allen Karten, Ausgängen und Reisen (nichts davon kommt
  ins private Paket).

## Was nicht ins öffentliche Repository kommt

Grafik, Vorschauen, Kontaktbögen und Berichte bleiben im privaten Repository oder unter
`buch/arbeit/` (nur lokal). Ins öffentliche Repository kommen Szenen, Tiled-Karten und Code.
