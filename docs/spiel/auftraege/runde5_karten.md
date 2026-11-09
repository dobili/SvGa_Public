# Auftrag: Nacharbeit Akt 1 und Karten von Akt 2 in drei Varianten (Nacht 9./10.11.2026)

**Basis:** `claude/friendly-shannon-y8bf90` hereinholen (2036b768 oder neuer), privates Repository auf
`main` neu holen (817ecc48 oder neuer). Der Autor schläft und hat die Nacht freigegeben: keine
Rückfragen an ihn, Entscheidungen trifft ihr nach den Regeln oder fragt den Haupt-Chat.

## Grundlagen, in dieser Reihenfolge

1. `docs/spiel/KARTENREGELN.md`, besonders Abschnitt 10 (Regeln 1 bis 48) — jede Regel gilt.
2. `docs/spiel/pruefberichte/2026-11-09_varianten_autor.md` (Hinweise des Autors je Karte).
3. Das Ortsdokument eures Ortes (`docs/spiel/orte/*.md`, Abschnitt 4 Bühnenbilder), dazu
   `docs/spiel/14_Akt2_Leben_teil1.md`/`teil2.md` und `13_Wegenetz.md`.
4. `inhalte/abenteuer/szenen/README.md` und `szenen/varianten/README.md`.

## Teil 1: Nacharbeit Akt 1

Die Zeilen eurer Karten im Bericht abarbeiten und als erledigt markieren. Eigene Bilder im privaten
Repository (`spiel/eigene/`): `tuer_sued_hell|holz|glas.png` (Türen für die Südwand, eine Kachel
hoch), `prellbock.png`, `absperrbock_gesperrt.png`, `bruecke_*` (Brücken). Die Prüfungen im
Kartenbauer melden jetzt auch Engstellen, Wände ohne Wandfläche und doppelte Einzelmöbel; die
gewählten Varianten liegen in `szenen/`, die früheren A in `szenen/varianten/*-a.json` (nicht
anfassen).

## Teil 2: Karten von Akt 2, je drei Varianten

Für jede Karte drei Varianten A (Szene in `szenen/`), B und C (in `szenen/varianten/`), so verschieden,
dass der Autor auf den ersten Blick drei Räume oder Orte sieht (Regel 37). Gleich bleiben Größe,
Türen, Übergänge mit ihren Feldern, Figuren und Auslöser mit Namen und alles, was Ortsdokument und
Geschichte verlangen. Neue Karten und Übergänge in `inhalte/abenteuer/orte.json` (Felder auf beiden
Seiten, Gegenstücke in den Nachbarorten prüfen). Keine neuen Dialoge oder Quests (Runde 6).

Möbel in `inhalte/abenteuer/moebel/<ort>.json` (neue Datei, wenn es den Ort noch nicht gibt), Vorsilben:
`rv5` Riverton, `wc5` Weg Cedar–Riverton, `wr5` Weg Riverton–Ironwood, `ld5` Lockport, `iw5`
Ironwood, `st5` Steinbruch, `ws5` Weg Ironwood–Silicon, `sb5` Silicon Bay.

## Ablauf je Karte

Szenenbeschreibung (`beschreibung`, ausführlich) → Raster und Möbel → `kartenbau` ohne Befunde →
`kartenbild` (Randspur, Matten, Schatten ohne Befund) → Bildprüfung gegen jede Regel aus Abschnitt
10, höchstens drei Runden → bei grauem Festschatten `werkzeuge/schatten.py` im privaten Repository
laufen lassen und dem Haupt-Chat sagen (er pusht dort). Katalog: unsichere Einträge vergrößert
ansehen und in `inhalte/abenteuer/katalog_korrekturen/<name>.json` eintragen.

Nach jeder fertigen Karte (alle drei Varianten): `python -m pytest -q pipeline/tests`,
`ruff check pipeline`, Prettier, committen, pushen, dem Haupt-Chat kurz Bescheid geben (Karte,
Commit, je Variante ein Satz). Dann die nächste Karte, ohne auf Antwort zu warten.

## Verteilung

| Helfer    | Akt 1 (zuerst)                                                        | Akt 2                                                                                                                           |
| --------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| mittel-1  | Wohnzimmer A, Dachboden C, Birch Lane A                               | `riverton.aussen`, `.bahnhofshalle`, `.pavillon`, `.wohnwagen`, `.schuppen`                                                     |
| mittel-3  | Diner C                                                               | `lockport.aussen`, `lockport.gasthaus`, `wegRivertonIronwood.kanalweg`, `.bruecke`                                              |
| mittel-4  | Park A, Bibliothek A                                                  | `ironwood.aussen`, `.kantine`, `.mamasZimmer`, `.umkleide`, `.museum`                                                           |
| mittel-2  | Ortskern Cedar Creek C, Drechslerei A, Südtüren Archiv und Waschsalon | `steinbruch.grube`, `.stollen`, `siliconBay.aussen`, `.hafen`, `.akademie`                                                      |
| niedrig-1 | Landstraße A, Flussweg C                                              | `wegCedarRiverton.zedernwald`, `.bahndamm`, `wegIronwoodSilicon.raststaette`, `.glasbruecke`, `siliconBay.serverraum`, `.lobby` |

Beim Hereinholen: Konflikte in `moebel/<ort>.json` als Vereinigung beider Seiten lösen, nie mit
`-X theirs`; Konfliktmarken vor dem Commit suchen.
