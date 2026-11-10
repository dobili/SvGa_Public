# Auftrag Runde 7: Größere Städte, Ereignisorte an den Wegen, eine bewohnte Welt (10.11.2026)

**Basis:** `claude/friendly-shannon-y8bf90` hereinholen (der Commit dieses Auftrags oder neuer),
privates Repository auf `main` neu holen. Ablauf, Meldungen und Varianten wie in
`runde5b_akt3.md`. Der Autor hat die Arbeit freigegeben: keine Rückfragen an ihn. Fragen gehen an
den Haupt-Chat.

## Warum

Der Autor hat die Revisionsseite der Karten von Akt 2 bis 4 kurz angesehen (10.11.2026, morgens):

1. Die Städte haben zu wenige Gebäude für Pokémon-Maßstab. Nicht alle müssen begehbar sein, aber
   sie sollen Größe und Abwechslung zeigen.
2. Auf jedem Weg soll irgendwann etwas passieren, das man entdecken kann.
3. Es gibt viel zu wenige Menschen und Tiere. Statisten sollen etwas zu sagen haben: über die Welt,
   Lieblingszüge, Eröffnungen, Motive, Schachgeschichte, brillante Züge.

## Grundlagen, in dieser Reihenfolge

1. `docs/spiel/KARTENREGELN.md`, Abschnitt 10.9, Regeln 51 bis 53. Neu sind drei Prüfungen im
   Kartenbauer: „Stadt wirkt leer“ (Gebäude oder Belebung), „Weg wirkt leer“ und „Satz fehlt“.
2. `docs/spiel/15_Routen_Ereignisse.md`: das Ereignis jedes Wegs, mit Ereignisort, Bildern und
   Feldern (Abschnitt 2 und Tabelle in Abschnitt 3).
3. `docs/spiel/16_Statisten_und_Tiere.md`: wie viele, was sie sagen, der geprüfte Vorrat an
   Schachgeschichte (Abschnitt 4) und die Tiere.
4. Die Ortsdokumente deiner Orte in `docs/spiel/orte/`.

## Was je Karte zu tun ist

### Stadt (Außenkarte, in allen drei Varianten A, B, C)

1. **Gebäude auf die Mindestzahl bringen:** klein 12, mittel 20, gross 20 je Viertel (`groesse`
   steht jetzt in `orte.json`).
   - Kulissenhäuser mit Tür, aber ohne Innenraum.
   - Verschiedene Bilder: Reihenhäuser, Läden mit Markise, Wohnblocks, Hinterhäuser. Bilder kommen
     aus dem Katalog (`generic building`, `additional houses`, `villas`, `floor modular building`,
     `shopping center and markets`, `post office`, `fire station`, `police station`).
   - Zwei gleiche Bilder nie nebeneinander, höchstens drei gleiche je Karte.
2. **Karte darf wachsen** bis an die Obergrenze aus 7a.2:
   - kleiner Ort bis 60 × 40;
   - mittlere Stadt bis 80 × 60;
   - Viertel einer großen Stadt bis 80 × 60.

   Wächst sie, ziehen die Felder in `orte.json` mit; danach `python -m pipeline.abenteuer.uebergaenge`.

3. **Belebung auf die Mindestzahl bringen:** 12 Statisten, davon 6 mit `sagt`, und 4 Tiere. Die
   Sätze stehen in `inhalte/abenteuer/texte/de.json` unter `statist.<karte>.<name>`, nach
   Dokument 16, Abschnitt 3.
4. In B und C stehen dieselben Statisten mit denselben Sätzen; die Gebäude dürfen anders sein
   (Variantenprüfung 10.37).

### Weg (jede Karte, alle drei Varianten)

1. **Ereignisort aus Dokument 15 bauen:** Bilder und Platz für drei bis sechs Figuren.
   - Auslöser kommen erst in Runde 6.
   - Die Felder der Fundstellen (Seite, Finch-Figur, Spur, Kreidespringer) trägst du im
     Ortsdokument unter 3.3 „für Runde 6“ ein. Die Felder bleiben begehbar.
   - Kleine Zeichen sind schon sichtbar: Finkenzeichen, Kreidespringer, Plakat „Bald“.
2. **Belebung:** 4 Statisten, davon 3 mit `sagt`, und 6 Tiere. Mindestens ein Statist je Weg
   erzählt eine kleine Geschichte mit Tieren (Dokument 16, Abschnitt 5.3).

### Innenräume (nur öffentliche: Laden, Diner, Halle, Kantine, Raststätte)

- 2 bis 6 Statisten, alle mit `sagt`.

## Satzregeln (kurz)

- Ein bis drei kurze Sätze. Die Sprechweise passt zur Figur, zur Jahreszeit des Akts und zur
  Tageszeit.
- **Mischung je Karte:** keine Art aus 16, 3.2 mehr als dreimal.
- **Schachgeschichte:** nur aus 16, Abschnitt 4. Was nicht drinsteht, schlägst du dem Haupt-Chat
  vor. Menschen dürfen sich ungenau erinnern („glaube ich“), aber nichts Falsches behaupten.
- **Neutral für {held}** (Stilregel 5.2). Keine Markennamen außer Perfect Move.
- **Ambrose** antwortet bei höchstens jedem fünften Statisten (`….ambrose`).

## Verteilung

| Helfer    | Städte (Außenkarte, ggf. neues Viertel)                                                                            | Wege und Abzweige                                                                                                 | Vorsilbe neuer Möbel |
| --------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | -------------------- |
| mittel-1  | Port Delacroix (mittel); Capital (gross) mit **neuem Viertel `capitalArena.innenstadt`** samt U-Bahnhof (15, 2.14) | Weg 5 (`faehre`, `deich`), `bayou.steg`, Weg 11 (`seeufer`, `leuchtturm`)                                         | `pd7`, `ca8`, `ci8`  |
| mittel-2  | **zuerst die App** (unten), danach Riverton (mittel), Ironwood (mittel)                                            | Weg 3 (`kanalweg`, `bruecke`)                                                                                     | `rv8`, `iw8`, `ri8`  |
| mittel-3  | Silicon Bay (gross) mit **neuem Viertel `siliconBay.altstadt`**; Crossroads (klein)                                | Weg 4 (`raststaette`, `glasbruecke`), Weg 8 (`geysirbecken`, `praerie`), Weg 9 (`huetten`, `riesenbaeume`)        | `sb8`, `sa8`, `cr8`  |
| mittel-4  | Summit City (mittel), Desert Springs (klein), Pinewood Camp (klein)                                                | Weg 6 (`canyonpfad`, `felsbogen`), Weg 7 (`diner`, `bergstrasse`), `hochebene` (`felsentuerme`, `schule`), Weg 10 | `sc8`, `ds8`, `cp8`  |
| niedrig-1 | Maple Falls, Cedar Creek, Lockport, Ghost Town (alle klein)                                                        | Weg 1 (`landstrasse`, `flussweg`, `zedernpfad`), Weg 2 (`zedernwald`, `bahndamm`)                                 | `mf8`, `cc8`, `gt8`  |

**Hinweise:**

- **Maple Falls und Cedar Creek** sind vom Autor schon gewählt und haben nur eine Fassung. Dort nur
  Gebäude ergänzen (am Rand, hinter Häuserzeilen, zweite Reihe) und Belebung. Das Bild des Orts
  bleibt erkennbar.
- **Neue Viertel** (Capital, Silicon Bay): neue Karte in `orte.json` (Karten, Übergänge in beide
  Richtungen, Name in `texte/de.json`), Szene mit `"viertel": true`, Varianten B und C, Abschnitt im
  Ortsdokument.
- **Fehlende Bilder** wie immer beim Haupt-Chat bestellen. Tiere mit Laufbildern gibt es in
  `modern-farm/Animals` (Liste in 16, 5.2); wilde Tiere werden gezeichnet. Bis dahin genügt der
  Eintrag in `belebung`, die App zeigt einen Ersatz.

## mittel-2 zuerst: Statisten und Tiere in der App

Die App zeichnet `statist` und `tier` noch nicht (`app/src/abenteuer/oberwelt/szene.ts`, Zeile mit
„Statisten und Tiere … kommen mit der Grafik“). Bitte:

1. **Statisten** als Figuren mit Bögen im Format von LimeZu (`figurbilder.ts`):
   - Laufen zwischen `von` und `bis` mit Pausen; nur zu Tageszeiten, die zu `wann` passen
     (Vorgabe: immer).
   - Sie sperren wie Figuren nur, solange sie stehen. Der Held läuft nie fest.
   - Mit `sagt` sind sie ansprechbar wie ein Auslöser: Die Sprechblase zeigt den Satz aus den
     Texten, beim nächsten Mal den nächsten (`.1`, `.2` …), dazu Ambroses Antwort, wenn es eine
     gibt.
2. **Bögen für Statisten:** Im privaten Repository baut `werkzeuge/figuren.py` Figuren aus dem
   Generator. Erzeuge einen Vorrat von 40 Statistenbögen (Erwachsene, Ältere, Kinder; Sommer- und
   Winterkleidung) und ordne sie über den Namen oder eine Eigenschaft `bild` zu. Ohne Angabe wählt
   die App aus dem Vorrat fest nach dem Namen, damit derselbe Statist immer gleich aussieht.
3. **Tiere:**
   - Bögen aus `modern-farm/Animals` und die Tauben aus Modern Exteriors; Rahmengrößen nachsehen.
   - Verhalten nach Dokument 16, 5.1: `ausweichen` und `flitzen` laufen vor dem Helden weg,
     `folgen` läuft ihm nach, `fliegen` flattert auf.
   - Tiere sperren nie. Eine Schar wird als drei bis fünf Tiere gezeichnet.
   - Ohne eigenes Bild steht ein naher Ersatz aus einer Tabelle (Reh → Ziege, Möwe → Taube).
4. **Tests:**
   - Vitest für die Logik (Ausweichen, Satzfolge, Zuordnung);
   - ein Playwright-Test: Statist ansprechen, Satz erscheint;
   - `npm run pruefen`, `npm run build`, e2e Abenteuer grün.
5. **Vorführungen** (Dokument 16, 3.4): Ein Statist mit `zeigt` bietet nach seinem Satz an, den
   Zug vorzuspielen. Ein kleines Brett zeigt die Stellung aus `inhalte/abenteuer/vorfuehrungen.json`
   und spielt die Züge mit den Sätzen `vorfuehrung.<kennung>.<n>` nacheinander vor (vor und zurück
   wie im Folgespieler, ohne Balken). Die Daten müssen dafür ins Abenteuer-Paket der App.
6. **Leistung:** 30 Statisten und 15 Tiere auf einer Karte flüssig auf dem Handy, also ohne
   Physik für Tiere und nur Bewegung im Sichtbereich.

Danach Riverton, Ironwood und Weg 3 wie oben.

## Ende

- Kartenbauer ohne Befunde für alle deine Karten und Varianten;
- `kartenbild` für alle geänderten Karten, Bilder ansehen;
- pytest, ruff, Prettier, Commit, Push;
- Meldung an den Haupt-Chat mit Liste der Karten und neuen Bilder.
