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
  Lederbank, Kerzenleuchter, Zeitungshalter); bis dahin Ersatz aus dem Katalog.

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
