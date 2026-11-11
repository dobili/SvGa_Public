# Erinnerung: London 1851 (`erinnerungLondon`)

Stand: 9.11.2026, nachts, Entwurf von mittel-2. Ortsdokument nach `README.md`, kurz, weil die Erinnerung
nur zwei kleine Karten hat. Quellen: `05_Story_Bibel.md` Szene 35 „Flashback: London, 1851“ und Zeitlinie
(Abschnitt 8, Jahr 1851), `orte.json` (Ort `erinnerungLondon`). Feld = (Spalte, Reihe), Norden oben.

## 1. Ortsplan

Szene 35: Am Abend nach Szene 29 erinnert sich Ambrose in der Bahnhofshalle von Riverton. Der
zwanzigjährige Ambrose ist mit seinem Vater in London, um Klavierholz zu kaufen; in einem Kaffeehaus
am **Strand** (der Straße, nicht am Meer) sieht er die „Unsterbliche Partie“ Anderssen gegen
Kieseritzky. Man spielt Ambrose. Die Erinnerung ist in Sepia getönt (nur als Szene; die Karten bleiben
farbig).

| Karte                         | Größe   | Lauf                       | Zeit  |
| ----------------------------- | ------- | -------------------------- | ----- |
| `erinnerungLondon.strand`     | 44 × 22 | Westende → Kaffeehaus ≈ 25 | ≈ 7 s |
| `erinnerungLondon.kaffeehaus` | 18 × 13 | Tür → Schachtisch ≈ 8      | ≈ 3 s |

### 1.1 Strand (`erinnerungLondon.strand`, 44 × 22)

```text
 Spalte 0       10        20        30        43
 R0  ┌──────────────────────────────────────────┐
 R1  │ [Fassade][Fassade][KAFFEEHAUS][Fassade][Fassade] │  Reihenhausfronten, Läden
 R8  │ Gaslaterne   Laterne     Tür (21, 8)   Laterne   │
 R9  │ ═══════════ Gehweg (Steinplatten) ══════════════ │
 R11 │ ▶ Ankunft  [Droschke]   Kopfsteinpflaster        │  der Strand
 R15 │ ═══════════ Gehweg ═════════════════════════════ │
 R17 │ Händlerkarren, Fässer, Zeitungskarren, Mauer     │
 R21 └──────────────────────────────────────────┘
```

- **Nordseite:** Reihenhausfronten aus Ziegel und Putz (Reihen 1–8), in der Mitte das Kaffeehaus (Spalten
  18–24) mit Tür bei (21, 8); Auslöser `kaffeehausTuer` (21, 9).
- **Straße:** Gehweg aus Steinplatten (Reihen 9–10), Fahrbahn aus Kopfsteinpflaster (11–14), Gehweg (15–16),
  dann Händlerkarren und eine Ziegelmauer (17–21). Gaslaternen an beiden Gehwegen.
- **Ankunft:** am Westende (2, 12), Blick nach rechts (`ankunft`). Die Karte hat keinen offenen Rand: Man
  geht nur ins Kaffeehaus.
- **Droschke** mit Pferd auf der Fahrbahn bei (8, 11), Auslöser `droschke` (9, 15) am Gehweg.

### 1.2 Kaffeehaus (`erinnerungLondon.kaffeehaus`, 18 × 13)

Dunkles Holz, Dielen, Lederbänke an der Nordwand, ein Ofen, Bilder; Schachtische mit Kerzen, Zeitungen
an Haltern. In der Mitte der **Schachtisch** mit Anderssen und Kieseritzky (Statisten), dahinter steht
man als Ambrose (`schachtisch` (9, 8)). Theke rechts mit dem Kellner, links der Zeitungsleser. Tür in der
Südwand (8, 12), `tuer`; `rueckkehr` (Dialog zurück in die Gegenwart) bei (8, 4) vor dem Ofen.

### 1.3 Übergänge

| Auslöser                        | Gegenstück                |
| ------------------------------- | ------------------------- |
| strand `kaffeehausTuer` (21, 9) | kaffeehaus `tuer` (8, 12) |

## 2. Ortsbild

London im Herbst 1851, das Jahr der Weltausstellung. Auf dem Strand rattern Droschken über das
Kopfsteinpflaster, ein Zeitungsjunge ruft die Schlagzeilen, ein Laternenanzünder geht mit seiner Stange
von Laterne zu Laterne. Es riecht nach Pferd, Kohlenrauch und nassem Stein. Die Häuser stehen dicht
an dicht, unten Läden mit kleinen Scheiben. Zwischen ihnen ein Kaffeehaus mit dunkler Holzfront und
Kerzenlicht hinter den Fenstern.

Drinnen ist es warm und laut und doch still an einem Tisch: Dort spielen zwei Herren, um die sich
Zuschauer drängen. Kaffee, Zeitungsrascheln, Tabakrauch (nur als Wort). Ambrose, zwanzig, steht hinter
ihnen und sieht, wie einer beide Türme und die Dame gibt und trotzdem gewinnt.

## 3. Abgleich mit der Geschichte

- **Szene 35:** Gang durch das Kaffeehaus (Zeitungsleser, Kaffeeduft), Ambrose hinter zwei Spielern, dann
  Zugerraten. → Kaffeehaus mit Zeitungsleser, Kellner, Schachtisch in der Mitte; Straße als kurzer Weg.
- **Figuren (orte.json):** Zeitungsjunge (Strand), Kellner und Zeitungsleser (Kaffeehaus).
- **Bleibt:** Strand als Straße, Kaffeehaus, Droschke, Gaslaternen. **Ändert sich:** nichts.
  **Entfällt:** der Vater (nur im Dialog erwähnt), das Klavierholz (Erzählung).
- **Für Runde 6:** `zeitungskarren`, `laternenanzuender` als Ansehen-Auslöser.
- **Bilder** sind beim Haupt-Chat bestellt (Fassaden, Kaffeehausfront, Droschke, Zeitungskarren,
  Lederbank, Kerzenleuchter, Zeitungshalter); eingesetzt am 9.11.2026 nachts.

## 4. Bühnenbilder

- **Strand:** Boden Kopfsteinpflaster (`pflaster`), Gehwege `stein`, Rand Ziegelmauer (`wandart: stein`).
  Fassaden (2, 1), (9, 1), (25, 1), (32, 1), (38, 1); Kaffeehaus (18, 1); Gaslaternen (6, 8), (15, 8),
  (28, 8), (36, 8), (12, 15), (30, 15); Droschke (8, 11); Händlerkarren (20, 17), Fässer (26, 17),
  Zeitungskarren (14, 17); Zeitungsjunge (14, 10).
- **Kaffeehaus:** Wand `holz`, Boden `holzDunkel`; Lederbänke an der Nordwand, Ofen (8, 1), Bilder,
  Schachtische (3, 6), (13, 6), (8, 7) mit Kerzen, Theke (14, 3), Zeitungshalter (1, 4).
- **Varianten:** A wie oben; B schlichter (weniger Fassaden, ein Tisch weniger, keine Droschke auf der
  Fahrbahn, sondern am Rand); C reicher (Marktkarren, zwei Droschken, Kaffeehaus mit Galerie aus
  Bänken und mehr Gästen).

## Runde 9 (10.11.2026): Antworten auf die Mängel der Variantenwahl (niedrig-1)

Beide Karten haben jetzt `"toenung": "sepia"` wie die Siedlungshütte.

**Kaffeehaus (Wahl A):**

1. _Niemand sitzt, niemand drängt sich am mittleren Tisch:_ Anderssen und Kieseritzky stehen an
   ihren Stühlen. Drei Zuschauer stehen um den mittleren Tisch, einer beugt sich über das Brett. Im
   Sitzen gibt es keine Figurenbilder.
2. _Kein Sepia, lauter Dielenboden:_ Der Boden ist ruhige Dielung, das Sepia kommt aus der Tönung der
   Szene.
3. _Kellner vor der Theke, Lederbank ohne Tisch:_
   - Die Theke ist zwei Reihen nach vorn gerückt, der Kellner steht dahinter.
   - Vor der Lederbank steht ein Tisch mit Kerze.
   - Die drei Schachtische stehen eine Reihe tiefer.

**Strand (Wahl A):**

1. _Acht statt fünf Fronten:_ Es sind jetzt fünf, wie die Beschreibung sagt: zwei links, das
   Kaffeehaus in der Mitte, zwei rechts. Die Karte ist dafür 29 statt 44 Kacheln breit, dahinter
   verliert sich die Erinnerung im Dunkel. Es gibt drei Fassadenbilder, die Front „TABAK“ kommt
   deshalb zweimal vor; das ist das Höchstmaß nach dem Prüfregelwerk.
2. _Flache Fassaden, Laternen vor Schrift und Tür:_
   - Die Gaslaternen stehen auf den Grenzen zwischen zwei Häusern an der Bordsteinkante.
   - Die Fassaden zeigen Dach und Schornsteine. Tiefe in Schrägansicht hätten sie nur mit neuen
     Bildern; das ist ein Wunsch an den Haupt-Chat.
3. _Kein Sepia, Tauben auf der Fahrbahn, südlicher Gehweg leer:_
   - Die Szene ist in Sepia getönt.
   - Die Tauben sitzen auf dem südlichen Gehweg.
   - Dort stehen jetzt außerdem ein Blumenmädchen, ein Schuhputzer, der Zeitungskarren, ein
     Händlerkarren und Fässer.

Zustände: keine (eine Erinnerung).

## Gutachten Runde 9: Antworten (niedrig-1, 10.11.2026)

- **Kaffeehaus:** Das zweite Bild ist ein anderes. Die Zuschauer stehen neben den Stühlen, nicht
  darin; die Spieler sitzen.
- **Strand:** Die fünfte Front ist ein Hutmacher („HUETE“) statt eines zweiten Tabakladens
  (Bildwunsch `fassade_london_d_tief.png`). Ein Kutscher wartet neben der Droschke.

## Helle Ladenzone (niedrig-1, 11.11.2026)

Gutachten `niedrig-1-5.md`: Schaufenster und Türen am Strand waren kaum zu erkennen. Die fünf
Fronten bekommen eine beleuchtete Ladenzone (Bildwunsch `london_<name>_hell.png` aus
`niedrig1_runde10.py`): Das Erdgeschoss ist heller, hinter dem Glas brennt warmes Gaslicht. Die
Möbel `el11*` zeigen auf die neuen Bilder.
