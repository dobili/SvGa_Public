# Auftrag: Akt 3, Ortsdokumente und Karten in drei Varianten (Nacht 9./10.11.2026)

**Basis:** `claude/friendly-shannon-y8bf90` hereinholen (ad52c52b oder neuer), privates Repository auf
`main` neu holen (756f1272 oder neuer). Der Autor schläft und hat die Nacht freigegeben: keine
Rückfragen an ihn. Entscheidungen trefft ihr nach den Regeln, oder ihr fragt den Haupt-Chat.

## Grundlagen, in dieser Reihenfolge

1. `docs/spiel/orte/README.md`: vier Teile je Ortsdokument, Zusatz für große Außenkarten.
2. `docs/spiel/KARTENREGELN.md`, Abschnitt 10 (Regeln 1 bis 49). Neu seit Runde 5:
   - 10.37: Varianten-Prüfung im Kartenbauer.
   - 10.6: `"ufer": "stein"`, Schleusentore.
   - 10.49: Höhen mit `"wand": "damm"` oder `"fels"`.
3. `docs/spiel/05_Story_Bibel.md`, Teil 3: Abschnitte 16 bis 23, besonders 19 (Welt) und 20 (Szenen).
4. `docs/spiel/09_Weltbeschreibung.md`, 5.7 bis 5.9, und `docs/spiel/13_Wegenetz.md`, Abschnitt 4
   (Sperren S6 bis S9, Bayou mit Gummistiefeln).
5. Vorbild: `docs/spiel/orte/riverton.md` (Ort mit Wegen) und `silicon-bay.md`.

## Ablauf

1. **Ortsdokument** `docs/spiel/orte/<ort>.md` mit allen vier Teilen. Es braucht:
   - Ortsplan mit Maßen und Übergangstabelle (Felder auf beiden Seiten, auch zu Silicon Bay und
     zum Nachbarort);
   - für große Außenkarten Abschnitte, Sichtachsen und Laufzeit.

   Zuerst committen und pushen, dem Haupt-Chat Bescheid geben, dann ohne Warten weiter.

2. **Karten:** je Karte A (in `szenen/`), B und C (`szenen/varianten/`). Ablauf wie in
   `runde5_karten.md`:
   - beschreibung, Raster, Möbel;
   - `kartenbau` ohne Befunde, auch ohne Varianten-Befund;
   - `kartenbild`, Bildprüfung;
   - pytest, ruff, Prettier, Commit, Push, Meldung.
3. **Übergänge** in `inhalte/abenteuer/orte.json`, Gegenstücke prüfen (`python -m
pipeline.abenteuer.uebergaenge`). Die Karten gibt es schon als Platzhalter
   (`inhalte/abenteuer/karten/<datei>.json`); Kennungen und Auslösernamen bleiben.
4. **Keine Dialoge oder Quests.** Auslöser für Ansehen und Funde nur, wenn es sie in orte.json
   schon gibt. Sonst im Ortsdokument unter 3.3 als „für Runde 6“ vermerken.
5. **Fehlende Bilder:** Erst den Katalog durchsuchen, dann die eigenen Bilder in
   `spiel/eigene/`. Was fehlt, beim Haupt-Chat bestellen: Name, Größe in Pixeln, Ansicht,
   Inhalt. Bis es kommt, einen Ersatz setzen und ihn in der Beschreibung nennen.

## Verteilung und Vorsilben der Möbel

| Helfer    | Ortsdokument                | Karten                                                                                                    | Vorsilbe                           |
| --------- | --------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| mittel-1  | `port-delacroix.md`         | `portDelacroix.aussen`, `.turnhalle`, `.werkstatt`, `.musikhaus` (Ruine und neuer Clubraum als `zustand`) | `pd6` (moebel/port-delacroix.json) |
| mittel-3  | `delta.md` (Wege zum Delta) | `wegSiliconDelacroix.faehre` (Fährdeck), `.deich`, `bayou.steg`                                           | `sd6`, `by6`                       |
| mittel-4  | `desert-springs.md`         | `wegDelacroixDesert.canyonpfad`, `.felsbogen`, `desertSprings.aussen`, `.garage`, `.antiquariat`          | `dd6`, `ds6`                       |
| mittel-2  | (nach Hafen und Steinbruch) | Rückfrage beim Haupt-Chat                                                                                 |                                    |
| niedrig-1 | (nach Serverraum und Lobby) | Rückfrage beim Haupt-Chat                                                                                 |                                    |

**Hinweise zu den Orten**

- **Port Delacroix:**
  - Der nasse Winter nach dem Hurrikan, aber der Ton ist Hoffnung: Bauzäune, Planen, Zelte,
    Sandsäcke, Musik.
  - Der Kai bekommt `"ufer": "stein"`.
  - Die Ruine des Musikhauses hat Himmel durchs Dach: Boden nass, ein Teil der Dielen fehlt.
- **Fährdeck:** Es ist eine Karte auf dem Schiff (Deck mit Reling, Bänke, Rettungsringe, Kajüte),
  ringsum Wasser bis zum Rand.
- **Deich:** Er liegt erhöht über dem Marschland (Regel 10.49, `wand: damm`).
- **Bayou:** Stege über dunklem Wasser, Nebel als Tönung (nur Szene), Luftboot. Die Sperre S8
  (Hochwasser) ist ein überfluteter Steg.
- **Canyonpfad und Felsbogen:** Roter Fels, also `wand: fels` mit dem Boden `felsboden`. Sieht der
  Fels zu grau aus, beim Haupt-Chat einen roten Felsbogen bestellen.
- **Eisenbahnbrücke von 1879:** Die Nieten „J. H.“ gehören zur Geschichte von Akt 2; sichtbar
  machen.
