# Silicon Bay und der Weg dorthin (W4)

Stand: 9.11.2026, Entwurf von mittel-4 für den Haupt-Chat. Ortsdokument nach dem Verfahren in
`docs/spiel/orte/README.md`: Ortsplan, Ortsbild, Abgleich mit der Geschichte, Bühnenbilder. Es umfasst
den Weg W4 von Ironwood (`wegIronwoodSilicon`: Raststätte und Glasbrücke) und Silicon Bay (Ort 5).
**Zuordnung:** In der Story-Bibel gehören W4 und Silicon Bay zu Akt 3 (Staffel 2, Szenen 51 bis 61);
der Auftrag nennt sie „Akt 2, Teil 2“, weil sie an Ironwood anschließen. Die Szenennummern und
Jahreszeiten folgen der Bibel (Silicon Bay kennt keine Jahreszeit). Leben, kleine Aufgaben und Funde
stehen in `docs/spiel/14_Akt2_Leben_teil2.md`. Quellen: `05_Story_Bibel.md` (16 bis 24, Szenen 50 bis
61), `09_Weltbeschreibung.md` (4, 4a, 5.6), `13_Wegenetz.md` (4, 7), `KARTENREGELN.md` (7a.2, 9),
`orte.json`, `quests.json`, `funde.json`. Karten werden noch nicht gebaut.

## 1. Ortsplan

Norden ist oben, auf allen Karten. Felder sind (Spalte, Reihe), Bereiche „Spalten / Reihen“.

**Lage in der Welt** (Weltkarte in 13): Silicon Bay liegt **westlich** von Ironwood an der Küste. Der
Bus fährt von der Haltestelle an der Ironwood-Brücke über die Schnellstraße bis zur Raststätte; von
dort geht {held} nach **Westen** zu Fuß über den Küstenpfad und die Glasbrücke in die Stadt (Bibel
19.1, W2). Die Bucht liegt im Süden; von dort fahren die Küstenfähre nach Port Delacroix (W5) und
die Inselfähre zur Pelikaninsel (N4).

**Größen nach 7a.2:** Weg ab Akt 2 zwei Karten, zusammen 280 bis 400 lang (80 bis 115 s): Raststätte
160 × 28 und Glasbrücke 140 × 26, zusammen etwa 305 Kacheln Hauptweg, 87 s. Silicon Bay ist eine
**große Stadt** und bekommt zwei Viertel zu je 60 bis 80 × 40 bis 60: **Campus** (`siliconBay.aussen`,
72 × 52) und **Hafen** (`siliconBay.hafen`, neu, 64 × 40). Heute gebaut: Raststätte und Glasbrücke
je 28 × 20, Silicon Bay 32 × 24.

**Grundsatz der Stadt** (09, 4 und 5.6; Szene 53): Silicon Bay hat **keine Bäume und keine Tiere**,
nur Kübel mit akkurat geschnittenen Gräsern, Glas, Licht und Roboter. Der Küstenpfad davor ist
dagegen voller Vögel; an der Glasbrücke hören sie auf. Das ist Absicht und wird im Ortsbild erzählt.

### 1.1 Raststätte (`wegIronwoodSilicon.raststaette`, 160 × 28)

**Runde 8 (Revision 2 des Autors, Wahl C, mittel-1):**

- Die Schnellstraße hat zwei Spuren mit Rechtsverkehr: nach Westen oben, nach Osten unten. Die
  Autos sind von der Seite gesehen und fahren in Fahrtrichtung. Rand- und Mittellinie sind
  eingezeichnet.
- Der Lärmschutz hinter der Leitplanke ist eine zusammenhängende Hecke (Reihe 6, Spalten 1–103).
  Dahinter wechseln sich Bäume, Kugelbüsche und Büsche ab, statt immer desselben Busches.
- Laternen stehen nur noch an Rastplätzen:
  - an der Bank am Pfad (Laterne (29, 11), Mülleimer (32, 13));
  - zwischen den sechs Picknicktischen im Osten. Die Tische stehen in zwei Reihen zu drei (147,
    151, 155 / 21 und 24), daneben zwei Mülleimer. Der Anstecker liegt jetzt bei (150, 23).
- Die Vogelhütte steht bei (75, 18). Ein Erdweg führt von ihrer Tür nach Osten und zum Pfadbogen
  hinauf.
- Die Anlegepfosten stehen direkt am Ufer, auch in der Einbuchtung.
- Der Lastwagen von Mrs. Kowalczyk ist ein eigenes Bild mit Dach und Tiefe (Bildwunsch
  `lkw_schraeg.py`).
- Asphalt und Pflaster haben rundum einen Bordstein zum Gras.
- Die Anschlagtafel (131, 13) zeigt Zettel und steht mit der Vorderseite zur Fahrgasse.

Die **Schnellstraße** läuft im Norden über die ganze Breite (Reihen 0–4, Fahrbahnen mit
Mittelleitplanke, Leitplanke in Reihe 5), Kraftfahrstraße ohne Gehweg. Im Osten liegt der
**Rastplatz** (Spalten 104–159): Gebäude nördlich der Fahrgasse mit Türen nach Süden, die Fahrgasse
(Reihen 17–18) kommt über die Abfahrt (104–110 / 5–16) von der Schnellstraße und verlässt den Ostrand
als Auffahrt. Der **Küstenpfad** (Sand und Holzbohlen, zwei Felder) beginnt an der Südwestecke des
Lkw-Parkplatzes (104, 22) und windet sich zwischen den Reihen 14 und 22 nach Westen. Nördlich des
Pfades schließt ein **Lärmschutzwall** mit Büschen (0–103 / 6–11) die Schnellstraße ab; südlich liegen
Salzwiese (Reihen 20–23) und die **Bucht** mit Watt (Reihen 24–27, Spalten 0–100, bis West- und
Südrand). Wir gehen von Ost nach West; die Abschnitte sind in Gehrichtung nummeriert.

```
                                                         N
 Spalte:  0        20        40        60        80       100       120       140      159
 Reihe 0  ═══════════════════════════ Schnellstraße (Kraftfahrstraße) ══════════════════════════►
 Reihe 5  ─────────────────────────── Leitplanke ──────────────────╲Abfahrt──────────────────────
 R6–11    ▒▒▒▒▒▒▒▒▒▒ Lärmschutzwall mit Büschen ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ╲ [Tankstelle] [Rasthaus 19]
 R12–16   Ortsschild  ╭─Steg─╮   ▲Düne(Aussicht)    ╭Vogelhütte  ╲  Zapfsäulen  Tür, Vordach, Automat
 R17–18 ◄═Pfad R18–19═╯      ╰══════╮      ╭═══════╯   ╰══════╮    ══ Fahrgasse ═══════════════════► Auffahrt
 R19–23   Salzwiese, Strandhafer      ╰════╯ Priel             ╰═[Wegweiser]  Lkw-Parkplatz  Bus  Picknickwiese
 R24–27   ≈≈≈≈≈≈≈≈≈≈≈≈≈ Bucht mit Watt (bis West- und Südrand) ≈≈≈≈≈≈≈≈≈≈≈≈   Kowalczyk     ⌂Halt.  Tische
          └── R8 ──┴── R7 ──┴── R6 ──┴── R5 ──┴── R4 ──┴── R3 ──┴── R2 ──┴── R1 ──┘
```

| Abschnitt (Spalten)    | Thema                  | Inhalt                                                                                                                                                 | Zum Entdecken                                                                              |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| R1 (140–159) Busbucht  | Ankunft mit dem Bus    | Busbucht an der Fahrgasse (132–146 / 19–20), Haltestelle (139, 21) mit Wartehäuschen, Ostteil des Rasthauses, Picknickwiese mit Tischen (Reihen 21–27) | **Werbe-Anstecker ZERO** am Picknicktisch (`fundAnstecker`), Busfahrer Briggs in der Pause |
| R2 (120–139) Rasthaus  | Kaffee und Rätsel      | Rasthaus (130–148 / 7–14, Tür (139, 14)) mit Vordach, Kaffeeautomat unter dem Vordach mit Rätseltafel; Tankstelle (112–124 / 7–14)                     | Rätseltafel (`tafel`, 3 Eröffnungsfallen), Zapfsäulen                                      |
| R3 (100–119) Lkw-Platz | Fernfahrer             | Lkw-Parkplatz (110–128 / 21–27) mit Mrs. Kowalczyks Lastwagen; Abfahrt; Beginn des Küstenpfads mit **Wegweiser** (104, 21: Silicon Bay ←, Rasthaus →)  | Mrs. Kowalczyk mit Weisheit („Erst die Figuren raus, dann die Dame.“)                      |
| R4 (80–99) Salzwiese   | hinaus aus dem Lärm    | Pfad zwischen Wall und Salzwiese, Strandhafer, Reihe alter Zaunpfähle                                                                                  | Austernfischer im Watt (Tier, `fliegen`), Radfahrer überholt                               |
| R5 (60–79) Vogelhütte  | Zählen                 | **Abzweig 1** nach Süden (3 Felder, Bohlensteg) zur Vogelhütte auf Stelzen am Watt (66–71 / 21–24) mit Mr. Oakes                                       | Mr. Oakes und seine Vogelliste (N-W4a)                                                     |
| R6 (40–59) Düne        | Aussicht               | **Abzweig 2** nach Norden auf die Düne (48–52 / 12–15) mit Bank; Blick über die Bucht                                                                  | `aussichtDuene`: Pelikaninsel, die Glastürme, die Glasbrücke                               |
| R7 (20–39) Priel       | Wasser unter den Füßen | Holzsteg über einen Priel (26–31 / 17–20), Möwen auf den Pfählen                                                                                       | Möwen (`fliegen`), Krebsspuren im Sand (Ansehen)                                           |
| R8 (0–19) Stadtrand    | erstes Glas            | Ende der Dünen, erste Glaslaternen, Ortsschild „Silicon Bay – Stadt der Zukunft“ (8, 16, Schrift zum Weg); Pfad am Westrand in den Reihen 18–19        | Sichtachse auf die Glasbrücke und die Türme                                                |

Laufzeit: Haltestelle → Westrand etwa 150 Kacheln, 43 s. Ränder: Norden Schnellstraße hinter dem
Wall und der Leitplanke (Kraftfahrstraße), Osten Auffahrt mit Schild „Keine Fußgänger“, Süden und
Westen die Bucht; nur der Pfad öffnet den Westrand.

**Runde 8, nach dem Gutachten (mittel-1):**

- **Winter:** `jahreszeit: winter`. Akt 3 spielt laut Story-Bibel im Winter (Szene 51 „Abfahrt
  im Schnee“), Silicon Bay selbst hat keine Jahreszeit. Blumen sind weg.
- **Küste:**
  - Sandstrand (Boden `strand` mit Rand) zwei Kacheln breit am Wasser.
  - Runde Düne im Westen (x 1–21, y 10–17) mit Strandgras.
  - Am Ortsschild drei moderne Laternen.
- **Zufahrt:** Abfahrt von der Schnellstraße (x 101–104, y 5–19), die Leitplanke hat dort eine
  Lücke.
- **Tankstelle:** Fahrspur unter dem Dach (y 14–16); die Zapfsäulen stehen auf Asphalt, die
  Waschstraße fährt auf die Fahrspur aus.
- **Parkplatz:** zwei Buchten mit Linien, Autos in Buchten und auf der Fahrgasse.
- **Plätze aus Pflaster:**
  - Container, Imbisswagen und Haltestelle stehen auf Pflaster.
  - Der Picknickplatz hat vier Tische statt sechs, zwei Mülleimer und eine Laterne.
- **Grün:**
  - Die Hecke hat Lücken und drei Arten im Wechsel, das Gehölz dahinter steht in loser Folge.
  - Pflanzen auf dem Pfad, Poller in der Wiese und Blumen sind weg.
- Der Rastplatz-Asphalt hat ein eigenes Zeichen `z` (gleicher Boden). So prüft der Kartenbau
  Straße und Platz getrennt.
- **Begründet statt geändert:**
  - **Fahrzeuge:** Fahrzeuge auf Straßen von West nach Ost sind wie bei LimeZu von der Seite
    gezeichnet, solche auf Nord-Süd-Straßen von vorn oder hinten. Das ist die Schrägansicht von
    LimeZu (KARTENREGELN 10.60). Deshalb stehen auch die geparkten Autos jetzt quer.
  - **Größen:** Autos 4–5 × 3, Lastwagen 11 × 5 Bildkacheln; das entspricht 10.64 mit Dach.
  - **Vogelhütte:** Sie ist ein Gartenhaus mit Tür und Fenster (Punkt h) und bleibt in der Mitte
    am Pfadbogen.
  - **Vögel:** Ringelgänse und Möwen zeichnet die Belebung nach dem Namen; das betrifft die
    Tierbilder aller Karten.

**Zweites Gutachten (`gutachten/weg-ironwood-silicon-raststaette-2.md`, mittel-1):**

- **Sand** (Befunde 1, 2, 4): Das Material `strand` zeigt jetzt LimeZus hellen Strandsand
  (`21_Beach`) statt des orangen Bodens. Strand und Düne heben sich vom olivbraunen Pfad ab.
- **Laternen** (3): Die drei Laternen am Ortsschild stehen am Südrand des Pfads (y 17–20), nicht
  mehr auf der Düne.
- **Rastbank** (7): Sie steht auf hellen Platten (eigenes Zeichen `q`) mit moderner Laterne.
- **Watt** (9): Das Wasser ist grauer Schlick (`"ufer": "watt"`, Bildwunsch `wasser_watt.py`). Der
  Austernfischer sitzt am Sandrand (60, 22), die Strandläufer sitzen, die Ringelgänse schwimmen.
- **Parkplatz** (15, KARTENREGELN 10.65): Lastwagen und Auto stehen längs der Fahrgasse in Buchten
  mit senkrechten Trennlinien, Stoßstange an Stoßstange. Die quer markierten Buchten und das
  zweite Auto sind weg. Das Auto auf der Ausfahrt fährt weiter östlich (150, 17).
- **Waschstraße** (17): Vor dem Tor liegt Asphalt (Reihe 13). Es ist eine Waschbox, in die man
  vorwärts hinein- und wieder hinausfährt.
- **Rasthausdach** (18): Das Dach ist eine glatte Fläche ohne das grüne Fugennetz
  (`fassaden_zweck.py`, `GLATTES_DACH`).
- **Bäume** (10, KARTENREGELN 10.67): Die Kugelbäume ohne Stamm sind Bäume mit Stamm.
- Offen: Düne ohne Höhe (2), Priel mit Sandrahmen (5), Radfahrer ohne Rad (11), leerer Nordosten
  (25), Bus in der Busbucht (22).

**Drittes Gutachten (`gutachten/weg-ironwood-silicon-raststaette-3.md`, mittel-1):**

- **Priel und Watt (2, 3):** Das Watt ist jetzt ein Boden (`w`: `wasser_watt`), kein Wasser. Der
  Priel bleibt blaues Wasser und läuft ins Watt aus. Austernfischer und Ringelgänse sitzen im
  Watt.
- **Parkplatz (7):** Das zweite Auto auf der Fahrgasse ist weg. In der Busbucht hält ein Bus,
  längs zur Fahrgasse (10.65).
- **Container (8):** Er steht auf Pflaster.
- **Imbisswagen (9):** Ein Verkäufer steht an der Klappe.
- **Begründet:** Die Autos auf der Schnellstraße bleiben in Seitenansicht (4). Auf Ost-West-Straßen
  zeichnet LimeZu Fahrzeuge so (10.60), der Haupt-Chat hat das bestätigt. Die Waschstraße hat
  seit dem zweiten Gutachten Asphalt vor dem Tor (6).
- Offen: Laternen am Dünenfuß (1), Abfahrt ohne Verzögerungsstreifen (5), Vogelschild (10).

**Viertes Gutachten (`gutachten/weg-ironwood-silicon-raststaette-4.md`, „reif für den Autor“):**

- **Waschstraße (1):** Eine Zufahrt führt östlich um die Waschbox herum nach Norden (125–126,
  6–13), man fährt von hinten hinein und vorn hinaus.
- **Buchten (3, 4):** Die senkrechten Buchtlinien und das einzelne Auto sind weg. Lastwagen und
  Bus stehen längs am Rand der Fahrgasse.
- Offen: Abfahrt (2), Laternenabstand (5), Vogelschild (7).
- **Lastwagen (Gemini Teil 2, 10.11.2026):** Mrs. Kowalczyks Lastwagen ist das neue Bild von vorn
  (`wsr12Lastwagen`, `spiel/eigene/lastwagen_vorn.png`, (117, 18)) statt des Bildes aus
  `lkw_schraeg.py`. Lastwagen und Bus (jetzt von hinten, `fz11BusAuf`, (125, 19)) stehen in
  Längsbuchten (117–128, 18–26) mit drei weißen Linien (`wsr12Linie9`); die Fahrgasse zum
  Strandweg ist frei. Mrs. Kowalczyk steht neben ihrem Lastwagen (121, 25).

### 1.2 Glasbrücke (`wegIronwoodSilicon.glasbruecke`, 140 × 26), Runde 8 neu gebaut

**Neu gebaut nach der Revision des Autors (10.11.2026, „keine Variante passt“, mittel-1).** Die
Brücke war über die Autobahn geklebt, ohne Rampen, Pfeiler und Schatten; die Autobahn war nach
Autobreite etwa 18 Spuren breit und alle Autos fuhren in eine Richtung. Jetzt (Revision 2, Punkte
20–24):

- **Autobahn** von Nord nach Süd in den Spalten 54–81, bis an Nord- und Südrand: Seitenstreifen
  54 und 81 mit Leitplanke, vier Spuren nach Süden (55–66, je drei Kacheln, Autos von vorn), ein
  Mittelstreifen aus Beton mit Leitplanke (67–68), vier Spuren nach Norden (69–80, Autos von
  hinten). Rechtsverkehr: nach Süden fährt man im Bild links. Gestrichelte Linien zwischen den
  Spuren, durchgezogene am Rand und am Mittelstreifen (eigene Bilder `fahrbahn_*`).
- **Lärm- und Sichtschutz:** Grünstreifen 44–53 und 82–93 mit einer dichten Reihe Heckensäulen
  direkt an der Fahrbahn (52 und 83), dahinter verschiedene Bäume und Kugelbüsche.
- **Brücke** (eigene Bilder `glasbruecke.py`, Bildwunsch an den Haupt-Chat): Glasdeck vier Felder
  breit in den Reihen 10–13 von Spalte 42 bis 93, halb durchsichtig, Mittelstreifen matt; darunter
  ein Stahlträger und sieben Betonpfeiler (44, 51, 60, 67, 74, 84, 90); der Schatten liegt um
  anderthalb Kacheln nach Süden versetzt auf Fahrbahn und Gras. Glasgeländer auf beiden Seiten
  sperren (Südgeländer sperrt die Reihe 14 unter der Kante).
- **Rampen:** Betonrampen mit Querrillen im Westen (30–41) und Osten (94–105), deren Stirnwand zur
  Brücke hin von null auf die volle Höhe wächst; so sieht man, dass man hinauf- und hinuntergeht.
  Der Aufzugsturm und die Treppe fallen weg (Regel 10.61: ohne Treppe kein Grund für einen Aufzug).
- **Aussichtsplattform** (Abzweig 3) über dem Mittelstreifen, 63–71 / 5–9, Glas mit Geländer an
  drei Seiten; darauf Kikis Streamtisch (64, 6) mit Laptop, Ringlicht (63, 5), Fernglas.
  Daneben im östlichen Grünstreifen der Funkmast „Testfeld Signal“ (84, 1), der Kikis Stream stört
  (Fund `spurPM2`).
- **Plätze mit Einfassung:** Stadtrand-Platz 2–29 / 10–22 mit Bordstein rundum (eigene Bilder
  `einfassung_*`), zwei Rastplätze mit Laterne, Bank und Mülleimer (12 und 21, Reihen 8–11),
  vier Pflanzkästen am Südrand, zwei Kübel an der Rampe, Werbetafel von ZERO (3, 4) am Nordrand.
  Im Osten Pflasterweg mit Bordstein vom Rampenfuß (106–109 / 10–13) nach Süden und in den
  Reihen 18–19 zum Ostrand, ein Rastplatz mit Blick auf die Brücke (Laterne 113, Bank 114/16).
- Die Flächen unter und neben der Brücke (30–105 außer Deck und Rampen) erreicht man nicht: Das
  Geländer sperrt, der Boden dort ist Kulisse.

| Auslöser / Figur     | Feld                 | Hinweis                                     |
| -------------------- | -------------------- | ------------------------------------------- |
| `start`              | (138, 18)            | Blick nach Westen                           |
| `zurueckRaststaette` | (139, 18), (139, 19) | Ostrand                                     |
| `weiterSilicon`      | (0, 18), (0, 19)     | Westrand, Ankunftsdialog                    |
| `fundOhrstoepsel`    | (84, 10)             | auf der Bank am Nordgeländer des Decks      |
| `ereignisStream`     | (68, 8)              | auf der Plattform, Kiki (66, 8)             |
| `werbetafelZero`     | (5, 10)              | vor der Werbetafel am Platz                 |
| `schildSmartCity`    | (135, 17)            | vor dem Schild am Ostweg (Schild (135, 15)) |
| Joggerin Skye        | (50, 11)             | auf dem Deck über dem westlichen Grün       |

Laufzeit: Ostrand → Westrand etwa 150 Kacheln, gut 40 s. Die Varianten B und C unter
`szenen/varianten/` sind der alte Stand; sie gelten nicht mehr, Wahl ist dieser Neubau.

**Runde 8, nach dem Gutachten (mittel-1):**

- **Winter:** `jahreszeit: winter`, Blumen weg.
- **Pfeiler:** Sie stehen nur noch auf Grünstreifen, Seitenstreifen und Mittelstreifen (x 44,
  53, 67, 82, 91), nicht mehr in Fahrspuren.
- **Plattform:** zwei Pfeiler auf dem Mittelstreifen, durch das Glas zu sehen.
- **Rampe:** ein Querträger an der Fuge zwischen Rampe und Glas; die Farnbüschel an der
  Rampenwand sind weg.
- **Fund:** zwei weiße Ohrstöpsel unter der Bank (`fundOhrstoepsel`); das Fernglas ist weg.
- **Platz:**
  - Die Werbetafel zeigt jetzt „ZERO – Nie wieder Fehler“ (Bild `werbetafel_zero`).
  - Der Platz hat helle Platten (neuer Boden `platten` aus dem Straßenbogen) statt
    Kopfsteinpflaster.
  - Die Mitte ist gefüllt: Bäume in Pflanzbeeten, zwei Bänke, ein Kübel.
  - Die Laternen sind modern.
- **Rastplatz Ost:** steht auf einer Plattenbucht am Weg.
- **Tiere:** Die Krähe ist weg (gleiches Bild wie die Möwe), das Kaninchen läuft auf der Wiese.

**Zweites Gutachten (`gutachten/weg-ironwood-silicon-glasbruecke-2.md`, mittel-1):**

- **Matschsaum** (Befund 1): grauer, zur Wiese hin ausfransender Schneematsch an beiden Rändern
  der Autobahn (x 53 und x 81), Bildwunsch `matschsaum.py`.
- **Plattform** (2): Die zwei Pfeilerköpfe auf dem Mittelstreifen liegen jetzt sichtbar über dem
  Glas (`vorn`).
- **Lieferroboter** (5): Er steht als kleiner weißer Kastenroboter mit Fähnchen am Platz (28, 12),
  Bildwunsch `matschsaum.py`. Als Belebung zeichnet ihn die App nicht (keine Tierart), deshalb
  ist er ein Objekt; dafür laufen Krähen in der Nordostwiese (Regel 10.53, sechs Tiere).
- **Bäume** (8, KARTENREGELN 10.67): Die Kugelbäume ohne Stamm sind Bäume mit Stamm.
- Offen: Blickrichtung der Figuren, Stativ (4), Fußspuren im Schnee (7), Tauben und Spatzen mit
  demselben Bild (10, Tierbilder liegen bei mittel-2).

### 1.3 Silicon Bay, Campus (`siliconBay.aussen`, 72 × 60 seit Runde 7)

**Runde 7 (Regel 10.51, mittel-3, 10.11.2026):** Die Karte ist um acht Reihen nach Süden gewachsen.
Alles ab Reihe 47 liegt jetzt acht Reihen tiefer: Terrasse 55–59, Glasbrüstung in Reihe 56, Treppe
zum Hafen 32–35 / 55–59, Auslöser `hafen` in Reihe 59. In den neuen Reihen 47–54 steht die
**Uferzeile**: zwölf Kulissenhäuser (`sb8Markt1` bis `sb8Markt12`, „Market Small“) dicht an dicht,
Türen zur Terrasse; die Spalten 31–36 bleiben als Weg zur Treppe frei. In der Nordzeile füllen zwei
schmale Wohnhäuser (`sb8Condo51` bis `sb8Condo53`) die Lücken neben Konzernturm und Werbetafeln, in C
dazu ein Wohnhaus am Platz. Jede Variante hat damit mindestens 20 Gebäude. Belebung: 13 Statisten
(acht mit Satz, `statist.siliconBay.aussen.*`), dazu echte Tiere: Möwen über der Terrasse, Tauben
auf dem Platz, ein Hund an der Leine, eine Katze am Café (Entscheidung des Haupt-Chats: Die Stadt
wirkt steril, aber die Möwen lassen sich nicht vertreiben); Lieferroboter, Drohne,
Staubsaugerroboter, Roboterhund und Fensterputzdrohne bleiben zusätzlich.
Die Koordinaten der Tabellen unten gelten für die Reihen bis 46 weiter; darunter plus acht.

Abschnitte zu je 18 Spalten × etwa 17 Reihen (A bis D, 1 bis 3), zwölf Abschnitte.

**Reihen (Nord nach Süd):** 0–1 Glasfassaden der Bürotürme hinter dem Campus (Rand); 2–20
Gebäudezeile Nord (Türen in Reihe 20); 21–22 Gehweg Nord (zwei Felder, helle Platten); 23
Roboterspur (blau markiert); 24–25 Straßenbahngleise (Spalten 0–66, Prellbock bei 66); 26
Roboterspur; 27–28 Gehweg Süd; 29–46 Campus-Platz; 47–51 Terrasse über dem Hafen mit Glasbrüstung,
in der Mitte die Treppe zum Hafen (32–35 / 47–51).

```
                                                N
 Spalte:  0        9   14     22     28   33    40    45   49   54                     71
 Reihe 0  ┌───── Glasfassaden der Bürotürme (Rand) ─────────────────────────────────────────┐
 R2–20    │ [Konzernturm 12]   [Akademie 12]       [Hotel Bayview 10]   ▓ Werbetafelwand ▓  │
          │  Lobby, Tür (9,20)  Tür (28,20)         Tür (45,20)         ▓ ZERO-Bildschirme▓ │
          │                                                              [Wartehäuschen]   │
 R21–22   ├══ Gehweg Nord ═══════════════════════════════════════════════════════════════◄═ Glasbrücke (71, 21–22)
 R23–26   ▓Tunnel│ ─ Roboterspur ─ ═══ Straßenbahn ═══ Halt „Akademie“ ═══════════ ▐Prellbock  Endhaltestelle
 R27–28   ├══ Gehweg Süd ═════════════════════════════════════════════════════════════════┤
 R29–46   │[Food-Truck] Bank   Kübel  Kübel  ◯ LED-Wasserspiel ◯  Bänke   [Café Byte]      │
          │[Innovation Lab]   Platz mit Platten, Lieferroboter-Station                     │
 R47–51   └──────── Glasbrüstung ─────── ╔Treppe╗ ─────── Glasbrüstung ─────────────────────┘
                                         ▼ Hafen (32–35)
```

| Abschnitt             | Bereich       | Thema                           | Inhalt                                                                                                            | Zum Entdecken                                                                |
| --------------------- | ------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| A1 Konzernturm        | 0–17 / 0–17   | Macht                           | Konzernturm Perfect Move (3–14 / 2–20), Glasportal mit Firmenschild über der Tür                                  | Drohne kreist vor der Fassade (Tier-Ersatz, 09)                              |
| B1 Akademie           | 18–35 / 0–17  | Schule aus Glas                 | Akademie (22–33 / 2–20), Glaswürfel; durch die Fenster sieht man Bildschirmbretter                                | Schild „Perfect Move Academy – Train like a Champion“ (Ansehen)              |
| C1 Hotel              | 36–53 / 0–17  | Übernachten                     | Hotel Bayview (40–49 / 2–20), Drehtür, Gepäckroboter                                                              | `hotel` (Szene 61, Nachttönung)                                              |
| D1 Werbetafeln        | 54–71 / 0–17  | Licht ohne Pause                | Werbetafelwand mit ZERO (54–71 / 2–16), Infosäule mit Stadtplan (60, 21)                                          | Werbefilm wechselt (Animation)                                               |
| A2 Tunnel, Food-Truck | 0–17 / 18–34  | Das Einzige, was nicht leuchtet | Straßenbahn kommt aus dem Tunnelportal (0, 23–26); Food-Truck von Rosie (4–10 / 31–34), Bank davor (6, 36)        | Rosie, Dash auf der Bank (Szene 54)                                          |
| B2 Haltestelle        | 18–35 / 18–34 | Unterwegs                       | Straßenbahnhalt „Akademie“ (Bahnsteiginsel 20–30 / 24–25 mit Glasdach), Wachmann Ellis auf Runde                  | Ellis (N-SB2)                                                                |
| C2 Roboterspur        | 36–53 / 18–34 | Ausweichen                      | Boulevard, Lieferroboter auf beiden Spuren                                                                        | Lieferroboter fährt {held} fast um (Szene 53, Auslöser `roboter` (44, 23))   |
| D2 Ankunft            | 54–71 / 18–34 | Ankunft zu Fuß                  | Ende der Glasbrücke (Ostrand 21–22), Endhaltestelle der Straßenbahn mit Prellbock (66, 24–25), Cilla in der Pause | Infosäule (`infosaeule`, Ansehen), Cilla und ihr Papierfahrplan (N-SB1)      |
| A3 Innovation Lab     | 0–17 / 35–51  | Arbeit hinter Glas              | Glaswürfel „Innovation Lab“ (1–14 / 38–46, Kulisse), Menschen mit Bildschirmen hinter der Scheibe                 | Kendra in der Mittagspause auf der Stufe (N-SB3)                             |
| B3 Platz West         | 18–35 / 35–51 | Kübel in Reihen                 | Kübel mit Gräsern in zwei Reihen, Bänke zum Wasserspiel, Treppe zum Hafen                                         | **Kastanie** in einem Kübel (`fundKastanie`)                                 |
| C3 Wasserspiel        | 36–53 / 35–51 | Mitte der Stadt                 | LED-Wasserspiel (40–45 / 36–41), Bänke ringsum, Lieferroboter-Ladestation (50–53 / 31–33)                         | Wasserspiel wechselt die Farbe (Animation)                                   |
| D3 Café, Brüstung     | 54–71 / 35–51 | Blick aufs Wasser               | Café Byte (56–69 / 31–38, Glaspavillon, Kulisse), Glasbrüstung mit Blick auf die Bucht                            | Aussicht von der Brüstung auf Fähranleger und Pelikaninsel (`aussichtBucht`) |

**Wegeführung:** Der Boulevard ist gerade (Stadtstraße, Regel 9.6.1) und trägt die Sichtachse von
der Glasbrücke nach Westen auf den Konzernturm. Abzweige mit Ziel: Akademie, Lobby, Hotel (Türen),
Food-Truck mit Bank, Wasserspiel, Treppe zum Hafen. Der Weg über den Platz geht schräg von der
Straßenbahnhaltestelle zum Wasserspiel und weiter zur Treppe (Pflasterband, zwei Felder).

**Sichtachsen:**

| Standort                            | Ziel                                      | Warum                                                        |
| ----------------------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| Ankunft von der Glasbrücke (70, 21) | Konzernturm am Ende des Boulevards (9, 2) | Der Turm ist das Erste und Größte, was man sieht (Szene 53). |
| Boulevard (30, 27)                  | Wasserspiel mit Lichtfarben (42, 38)      | lenkt auf den Platz und den Food-Truck.                      |
| Brüstung (60, 47)                   | Pelikaninsel und Fähranleger im Hafen     | Vorgeschmack auf N4 und W5, bevor man die Treppe findet.     |

**Ränder:** Norden Bürotürme (Glasfassaden ohne Tür), Westen Tunnelportal der Straßenbahn
(Straßenbahn fährt hinein, Fußgänger nicht: Gitter „Nur Bahnbetrieb“) und Bürofassaden, Osten nur die
Glasbrücke offen (daneben Lärmschutzwand aus Glas), Süden die Glasbrüstung über dem Hafen; nur die
Treppe öffnet den Südrand. **Laufzeit:** Boulevard 72 Kacheln, 21 s.

### 1.4 Silicon Bay, Hafen (`siliconBay.hafen`, neu, 64 × 40)

Das zweite Viertel ist das alte Silicon Bay, bevor es so hieß: drei Häuser aus Backstein an der
Kaimauer, eine Fischhalle, die Fähranleger. Abschnitte zu je 16 × 20 (A bis D, 1 und 2).

**Reihen:** 0–5 Treppe vom Campus (32–35) zwischen Sitzstufen (20–47 / 0–5) und Stützmauer; 6–15
Häuserzeile am Hafen (Türen in Reihe 15), dazwischen die Gasse (32–35 / 6–15); 16–21 Promenade
(Holzbohlen) von West nach Ost; 22–29 Kai mit Bänken, Pollern, Fernrohr; 30 Kaikante; 31–39 Bucht
(Wasser bis West-, Süd- und Ostrand).

| Abschnitt           | Bereich       | Thema                    | Inhalt                                                                                                                                            | Zum Entdecken                                                              |
| ------------------- | ------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| A1 Fischhalle       | 0–15 / 0–19   | Was einmal war           | Fischhalle (2–13 / 6–15, geschlossen, Kulisse), verblichenes Schild „Fresh Fish Daily“                                                            | Netze an der Wand (Ansehen)                                                |
| B1 Leerer Laden     | 16–31 / 0–19  | Hoffnung im Schaufenster | Ames Kurzwaren (16–23 / 6–15), leer, Schild „Bald geöffnet“ im Fenster; Hafenmeisterei (25–30 / 6–15, Kulisse); Mr. Ames auf einer Kiste (20, 16) | Schaufenster mit einem einzelnen Holzbrett darin (Ansehen, `schaufenster`) |
| C1 Treppe und Store | 32–47 / 0–19  | Neu neben alt            | Treppe vom Campus, Gasse; Perfect Move Store (38–51 / 6–15, Glas, Tablets im Fenster, Kulisse)                                                    | Bildschirm im Store zeigt Novas Gesicht (Ansehen)                          |
| D1 Fährhäuschen     | 48–63 / 0–19  | Warten                   | Ende des Stores, Fährhäuschen der Inselfähre (56–60 / 16–20) mit Fahrplan „Pelikaninsel – sonntags“                                               | Mr. Pike                                                                   |
| A2 Küstenfähre      | 0–15 / 20–39  | Fernweh                  | Terminal der Küstenfähre (0–12 / 18–29) mit Rampe, Fähre im Wasser (2–12 / 31–37, Objekt)                                                         | `faehre` (6, 29), nach der Nadel (W5)                                      |
| B2 Kai              | 16–31 / 20–39 | Sitzen am Wasser         | Bänke zum Wasser (18, 28), (24, 28), Poller, Laternen                                                                                             | Mr. Ames erzählt vom alten Hafen                                           |
| C2 Fernrohr         | 32–47 / 20–39 | Weitsicht                | Münzfernrohr (40, 27) auf die Bucht, Kaikante                                                                                                     | `fernrohr` (Pelikaninsel), **Seeglas** an der Kaikante (`fundSeeglas`)     |
| D2 Inselfähre       | 48–63 / 20–39 | Die andere Seite         | Steg der Inselfähre (52–55 / 22–35), Boot am Steg (56, 30, Objekt)                                                                                | S6: `inselfaehre` (53, 22), nach der Nadel offen                           |

**Ränder:** Norden Stützmauer mit Sitzstufen (nur die Treppe führt hinauf), Westen Zaun des
Fährterminals, Osten Mole mit Geländer, Süden die Bucht. **Laufzeit:** Promenade 64 Kacheln, 18 s.

### 1.4a Silicon Bay, Altstadt (`siliconBay.altstadt`, neu in Runde 7, 72 × 56)

Das zweite Stadtviertel nach Regel 7a.3.6 und 10.51 (Szene mit `"viertel": true`): das Silicon Bay
vor dem Campus, mit Bäckerei, Metzgerei, Uhrmacher und Musikladen. Man kommt vom Gehweg Nord des
Campus herein: Übergang `altstadt` am Westrand des Campus (0, 21–22) ↔ `campus` am Ostrand der
Altstadt (71, 21–22), Ankunft (70, 21).

**Reihen:** 1–8 Hinterhöfe (Gras, Hecken); bis Reihe 20 Häuserzeile A mit Türen zum Gehweg (21–22);
23–25 Hauptstraße; 26 Gehweg Süd; 27–30 Gärten hinter Zeile B; bis Reihe 40 Häuserzeile B mit
Türen zum Marktplatz, zwei Gassen verbinden Straße und Platz; 41–50 Marktplatz mit Brunnen, Bänken,
Ständen und Kaffeekiosk; 51–54 Park am Südrand. Der Westrand ist geschlossen.

**Gebäude:** je Variante 21 bis 22 Kulissenhäuser ohne Innenraum: Läden (`sa8Laden1` bis
`sa8Laden12`, „Market Medium“), Kaufhäuser (`sa8Kaufhaus1` bis `6`), Postamt (`sa8Postamt1` bis `4`),
kleine Polizeiwache (`sa8Polizei1`, `2`), Eisenwarenladen (`sa8Eisenwaren`), Wohnhäuser (`sa8Condo9`,
`sb8Condo44` bis `53`), Kapelle (`iw5Kirche`). A und C mit Wochenmarkt, B schlicht.

**Runde 8 (mittel-3, 10.11.2026), Hauptfassung C nach den Notizen des Autors:**

- Dasselbe Gebäudebild höchstens zweimal (Punkt 25): Bäckerei, Metzgerei, Musikladen, Eisdiele und
  Angelladen sind jetzt ganze Läden aus dem Baukasten „Floor Modular Building“ (Bildwunsch
  `docs/spiel/auftraege/bildwuensche/altstadt.py`, Möbel `sa8Baeckerei` usw.), dazu ein schmales
  viktorianisches Haus und ein Wohnhaus; nur noch je zwei „Market Medium“ und „Market Small“, eine
  Polizeiwache.
- Die Kapelle hatte keine Rolle in der Geschichte und ist weg (Punkt 27); an ihrer Stelle ein kleiner
  Garten mit Baum.
- Der Kaffeekiosk steht jetzt in der Südzeile, seine Öffnung zeigt nach Süden zum Platz (Punkt 26).
- Die Bänke stehen links und rechts vom Brunnen und schauen zu ihm.
- Hecken als lückenlose Reihen (Punkt 23): an der Nordmauer, als Vorgartenhecke an der Straße mit
  den beiden Gassen als Durchgang, am Rand des Parks mit drei Eingängen. Sie fassen zugleich die
  Grasflächen gegen Pflaster ein (Punkt 22; eigene Randbilder für Gras gibt es nicht).
- Marktstände mit Obst- und Gemüsekörben, Marktfrau und Gemüsehändler an den Ständen (10.59); dafür
  sind Briefträgerin, Ladenbesitzer, Hundebesitzer und Hund weg (zwölf Statisten). Ein Hydrant für den
  Feuerwehrmann.

**Gutachten Altstadt (Runde 8, `gutachten/silicon-bay-altstadt.md`), behoben:** Die Altstadt liegt im
Winter (`"jahreszeit": "winter"`); die Story-Bibel nennt Silicon Bay „ohne Jahreszeit“, das gilt für
die Glasbauten des Campus, die Altstadt außerhalb hat Akt-3-Winter (Schnee, Schneemann der Kinder,
Weihnachtsbaum). Campus, Akademie und Hafen bleiben ohne Jahreszeit. Gärten hinter beiden Zeilen statt
Pflasterflecken, zwei Gartenschuppen; die Flachdachblöcke aus anderen Orten und die STORE- und
MARKET-Häuser mit Vorhängeschloss sind durch vier Wohnhäuser und vier offene Läden ersetzt (Bildwunsch
`altstadt.py`); Laternen am Gehweg, der Metzger fegt den Gehweg; der Marktplatz ist auf sieben Reihen
mit Steinrand verkleinert, mit Bäumen in Baumscheiben, zwei Ständen mit Händlerin und Händler (Stände
ohne Fischschild), Kreidezeichnung, Gitarrenkoffer und Weihnachtsbaum; der Park bekommt die freien
Reihen, eine Hecke mit drei gleichen Durchgängen, einen Weg, Bänke und den Schneemann
(`schneemann.py`). Nicht geändert: englische Ladenschilder (Silicon Bay, jetzt in der Beschreibung),
Fahrbahnmarkierung und Bordstein (keine Bodenbilder, Bodenvariation von mittel-2), die Roboter und
die aufrechte Katze (Belebungsbilder, nicht Kartenbild), der graue Flachbau des Eisenwarenladens
(mittel-1 ersetzt das Bild auf allen Karten).

**Zweites Gutachten (`gutachten/silicon-bay-altstadt-2.md`, Runde 9), behoben:** Die Straße ist
geräumt, mit Mittellinie, zwei Zebrastreifen an den Gassen und Schneewällen an beiden Rändern
(Bildwunsch `winterstrasse.py`, Möbel `sa9Schneewall…`, `sa9Zebrastreifen`). Der Parkweg ist ein
geräumter Weg aus Steinplatten mit Schneewall statt brauner Erde. Statt der grauen Rückseite
(Condo 9) steht ein Wohnhaus mit Haustür (`altstadt.py`, `wohnhaus_e`, Möbel `sa9WohnhausE`); die
Metzgerei rückt eine Spalte nach Osten, die Laterne steht in der Lücke. Der Marktplatz hat einen
Rand aus hellen Platten (`platten`). Der Mähroboter heißt im Winter Schneeräumroboter. Offen: Die
Roboter bleiben ohne Bild, bis der Lieferroboter des Autors (Gemini, `ki-roh/lieferroboter.png`)
kommt; der Gitarrenkoffer ist ein Bild mit zwei Koffern. Drittes Gutachten (`silicon-bay-altstadt-3.md`, „bereit für den Autor“),
Restpunkte: Die Laternen stehen an den Hausgrenzen statt vor den Schaufenstern; ein zweites Kind
rollt am Schneemann eine Schneekugel. Gemini-Bilder (Runde 9): Die Roboter
(Liefer-, Staubsauger-, Schneeräumroboter in der Altstadt, Saugroboter in der Akademie, Lieferroboter
und Roboterhund am Campus) zeigen jetzt den Lieferroboter von Perfect Move (Tierart `lieferroboter`
in `tierarten.json`, Schnitt `ansichten` aus `lieferroboter_rechts/_oben/_unten`). In der Akademie heißt
die Belebung jetzt `lieferroboter` und steht in der Beschreibung: Perfect Move erprobt seinen
Lieferroboter im eigenen Haus; ein flacher Saugroboter hätte ein eigenes Bild gebraucht. Campus und
alter Hafen sind für die erste Prüfung durchgesehen (10.64 bis 10.67): Der Asphalt des Campus ist das
Gleisbett der Bahn, die Hafenstraße ein Plattenweg, deshalb keine Fahrbahnmarkierung; Kaimauer und
Fähre in Normgröße stehen.

**Belebung:** zwölf Statisten, acht davon mit Satz (`statist.siliconBay.altstadt.*`): Bäckerin,
Uhrmacher, Musikhändler, Schülerin, Metzger (Perfect Move will die Straße kaufen), Rentnerpaar,
Feuerwehrmann, Eisverkäuferin und der Straßenmusiker (zeigt die Goldmünzen-Partie, `zeigt:
goldmuenzenPartie`, die Münzen nur als Gerücht); dazu Briefträgerin, Kinder, Ladenbesitzer und
Hundebesitzer. Tiere: Möwen, Tauben, Hund, Katze im Hinterhof; dazu Drohne, Lieferroboter,
Mähroboter und Staubsaugerroboter.

### 1.5 Gebäude und Maße

| Gebäude                       | Lage außen (Spalten / Reihen), Tür                      | Fassade                                         | Innen (7a.2)                                                                                   | Begehbar        |
| ----------------------------- | ------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------- |
| Konzernturm Perfect Move      | Campus 3–14 / 2–20, Glasportal (9, 20) (6 von 12, 50 %) | Glas und Stahl, 12 breit (Sockel), Turm darüber | `lobby` 24 × 14 (Eingangshalle), Tür Südwand Spalte 12                                         | ja              |
| Akademie                      | Campus 22–33 / 2–20, Glastür (28, 20) (6 von 12, 50 %)  | Glaswürfel, 12 breit                            | `akademie` 24 × 16 (großer Saal), Tür Südwand Spalte 12; Tür zum Serverraum Nordwand Spalte 21 | ja              |
| Serverraum                    | hinter der Akademie (keine eigene Fassade)              | –                                               | `serverraum` 14 × 10, Tür Südwand Spalte 7                                                     | ja              |
| Hotel Bayview                 | Campus 40–49 / 2–20, Drehtür (45, 20)                   | Glas, 10 breit                                  | –                                                                                              | Kulisse         |
| Food-Truck Rosie              | Campus 4–10 / 31–34, Verkaufsfenster nach Süden (7, 34) | Lieferwagen mit Klappe, 7 breit                 | –                                                                                              | Kulisse (Laden) |
| Café Byte, Innovation Lab     | Campus 56–69 / 31–38; 1–14 / 38–46                      | Glaspavillon, Glaswürfel                        | –                                                                                              | Kulisse         |
| Ames Kurzwaren (leerer Laden) | Hafen 16–23 / 6–15, Tür (19, 15)                        | Backstein 1952, 8 breit, Schaufenster           | später (Post-Game): Dr. Lins Club, 16 × 11                                                     | Kulisse         |
| Fischhalle, Hafenmeisterei    | Hafen 2–13 / 6–15; 25–30 / 6–15                         | Backstein, Holztore                             | –                                                                                              | Kulisse         |
| Perfect Move Store            | Hafen 38–51 / 6–15                                      | Glas                                            | –                                                                                              | Kulisse         |
| Fährterminal, Fährhäuschen    | Hafen 0–12 / 18–29; 56–60 / 16–20                       | Glas und Stahl; Holz                            | –                                                                                              | Kulisse         |

Die Fassade ist halb so breit wie das Erdgeschoss innen, die Tür sitzt außen und innen an derselben
relativen Stelle (±1 Kachel). Der Serverraum liegt hinter der Nordwand der Akademie; man betritt ihn
durch die Nordwand und kommt an seiner Südwand an (Regel 2.2: Ausgangstür auf der Wand, durch die
man den Raum verlässt).

### 1.6 Übergänge (Felder auf beiden Seiten)

| Von (Karte, Auslöser, Feld)                                             | Nach (Karte, Auslöser, Feld; Ankunft)                                    | Lage, Bedingung                                                                                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| ironwood.aussen `busSiliconBay` (15, 32), Dialog, Reise                 | raststaette `start` (140, 20), Blick nach Westen                         | Busfahrt; erst nach Szene 50 (`akt2.einladung`); vorher Busfahrer Briggs: „Silicon Bay? Ohne Einladung lassen die dich nicht mal aussteigen.“ |
| raststaette `zurueckIronwood` (139, 21), Dialog, Reise                  | ironwood.aussen `bushaltestelle` (14, 32)                                | Busfahrt zurück (heute Ziel `busSiliconBay`; Vorschlag: Ziel `bushaltestelle`, weil dort der Start liegt)                                     |
| raststaette `weiterGlasbruecke` Westrand (0, 18–19)                     | glasbruecke `zurueckRaststaette` Ostrand (139, 18–19); Ankunft (138, 18) | Pfad je zwei Felder                                                                                                                           |
| glasbruecke `weiterSilicon` Westrand (0, 18–19)                         | siliconBay.aussen `glasbruecke` Ostrand (71, 21–22); Ankunft (70, 21)    | Platz geht in den Gehweg Nord über; Dialog `ankunft_zu_fuss` bleibt an `weiterSilicon`                                                        |
| aussen `akademieTuer` (28, 20)                                          | akademie `akademieAusgang` (Südwand, Spalte 12); Ankunft (12, 14)        | 50 % ↔ 50 %                                                                                                                                   |
| akademie `serverraumTuer` Nordwand (21, 2), Feld davor (21, 3)          | serverraum `serverraumAusgang` (Südwand, Spalte 7); Ankunft (7, 8)       | wie heute `wenn: serverraumOffen` (Szene 56)                                                                                                  |
| aussen `lobbyTuer` (9, 20)                                              | lobby `lobbyAusgang` (Südwand, Spalte 12); Ankunft (12, 12)              | 50 % ↔ 50 %                                                                                                                                   |
| aussen `altstadt` (Runde 7) Westrand (0, 21–22)                         | altstadt `campus` Ostrand (71, 21–22); Ankunft (70, 21)                  | Gehweg Nord, zwei Felder                                                                                                                      |
| aussen `hafen` (neu) Südrand (32–35, 59 seit Runde 7); Ankunft (33, 58) | hafen `campus` (neu) Nordrand (32–35, 0); Ankunft (33, 1)                | Treppe, vier Felder breit                                                                                                                     |
| hafen `faehre` (6, 29), Dialog, Reise                                   | wegSiliconDelacroix.faehre `start`                                       | heute auf `siliconBay.aussen`; zieht auf den Hafen um; `wenn: nadelSiliconBay` bleibt                                                         |
| hafen `inselfaehre` (neu, 53, 22), Dialog, Reise                        | Pelikaninsel (N4, Kennung bei Bau)                                       | S6: nach der Nadel von Silicon Bay dauerhaft offen (13 §4, Befund 16)                                                                         |

Änderungen in `orte.json` für den Haupt-Chat: neue Karte `siliconBay.hafen` mit `campus`, `faehre`
(umgezogen), `inselfaehre`; neuer Auslöser `hafen` auf `siliconBay.aussen`; `busIronwood` entfällt
(Prüfbericht Akt 2, Befund 3: in der Stadt fährt kein Bus); Ziel von
`zurueckIronwood` auf `bushaltestelle`; Bedingung `einladungGesehen` (neu, Szene 50) für
`busSiliconBay` in Ironwood; dazu die Auslöser aus 14 (Abschnitt 6).

### 1.7 Platzhalter für Rückkehr und Weltzustand (13, Abschnitte 7.2 und 7.4)

- `siliconBay.hafen` (13 §7.4 nennt `siliconBay.aussen`; mit dem zweiten Viertel liegen beide hier):
  **Anleger der Inselfähre** (S6) und der **leere Laden** mit Schild „Bald geöffnet“ (Ames
  Kurzwaren; Post-Game: Dr. Lins Club ohne Bildschirme, Ladenschild als Objekt mit Bedingung).
  Pelikan „Bishop“ auf dem Geländer der Inselfähre, sobald sie fährt (N4: er begleitet die Fähre;
  das einzige Tier in Silicon Bay, Ambrose bemerkt es).
- `siliconBay.aussen`: Werbetafelwand zeigt ab Akt 4 Plakate der Meisterschaft (Objekt je Akt); am
  Food-Truck ab Akt 4 Theo ohne Tablet (13 §7.2); Bank vor dem Truck für Dash bleibt.
- `siliconBay.akademie`: Fensterbank für Nova (Akt 4 leer, „Nova ist fort“); Theos Platz an der
  Datenwand für R4 (Theo ohne Tablet, nach Szene 79).
- `siliconBay.lobby`: Vitrine mit freiem Fach unter dem Notizbuch (Vorschlag für Akt 4 oder Post-Game,
  wenn Hales Seite aus Szene 88 zum Notizbuch zurückkehrt; nur Platz, kein Inhalt, keine Festlegung der
  Geschichte).

## 2. Ortsbild

Der Bus aus Ironwood fährt eine Stunde über die Schnellstraße, und dann hält er an einer Raststätte,
wie es tausend gibt: eine Tankstelle mit gelbem Dach, ein Rasthaus mit Vordach, unter dem ein
Kaffeeautomat brummt, Lastwagen in einer langen Reihe. Der Busfahrer steigt aus, streckt sich und
sagt, weiter fahre er nicht, „die Stadt da vorne lässt keine alten Busse rein“. Am Automaten hat
jemand eine Tafel mit drei Schachaufgaben aufgehängt, und auf dem Lkw-Parkplatz sitzt eine
Fernfahrerin auf dem Trittbrett ihres Lastwagens und isst einen Apfel. Hinter dem Rastplatz beginnt
ein schmaler Pfad aus Holzbohlen und Sand, und sobald man den Lärmschutzwall im Rücken hat, hört man
das Meer.

Der Küstenpfad ist die letzte Wildnis vor der Stadt. Strandhafer wiegt sich im Wind, im Watt stochern
Austernfischer, Möwen streiten auf alten Zaunpfählen, und in einer Hütte auf Stelzen sitzt ein alter
Mann mit Fernglas und Notizbuch und zählt Vögel. Von einer Düne aus sieht man die ganze Bucht: weit
draußen eine flache Insel mit bunten Häusern auf Stelzen, und am anderen Ende, wo das Ufer sich
krümmt, Türme aus Glas, die in der Wintersonne so hell sind, dass man die Augen zusammenkneifen muss.

Dann kommt die Glasbrücke. Eine Rampe führt hinauf, und plötzlich läuft man auf Glas, unter einem
rauschen sechs Fahrstreifen Autobahn, und die Lastwagen sehen von oben aus wie Spielzeug. Die letzte
Möwe sitzt am Anfang der Brücke auf dem Geländer und fliegt nicht weiter. Auf dem Deck joggt eine
junge Frau mit einer Uhr am Handgelenk, die bei jedem Schritt piept; sie bleibt stehen, wenn man sie
ansieht, und fragt, ob man Schach spielt, „aber schnell, ich hab nur eine Runde“. Am Ende der Brücke
steht ein Aufzugsturm mit dem Schild „Außer Betrieb“, und daneben rollt ein Lieferroboter mit einem
Fähnchen die Rampe hinunter.

Silicon Bay ist sauber, als hätte jemand die ganze Stadt jeden Morgen abgewischt. Der Boulevard ist
breit und gerade, die Straßenbahn gleitet lautlos auf ihrer Spur, links und rechts von ihr rollen
Lieferroboter in markierten Bahnen, und wer nicht aufpasst, wird von einem fast umgefahren. Am Ende
des Boulevards steht der Turm von Perfect Move, so hoch, dass die Wolken an seiner Spitze hängen
bleiben. Daneben die Akademie, ein Würfel aus Glas, in dem Kinder vor Bildschirmen sitzen, auf denen
Schachbretter leuchten. Niemand hält eine Figur in der Hand. An einer Wand aus Bildschirmen läuft
ohne Pause derselbe Film: eine Hand, die eine Figur zieht, und darunter das Wort ZERO.

Es gibt keine Bäume. Es gibt Kübel mit Gräsern, die so genau geschnitten sind, dass sie aus Plastik
sein könnten, und ein Wasserspiel, das seine Farbe wechselt. Es gibt keine Tauben. Über dem Platz
kreist eine Drohne. Das Einzige, was nicht leuchtet, ist ein alter Lieferwagen mit Klappe am Rand
des Platzes: Rosies Food-Truck. Es riecht nach Bohnen und Koriander, eine Bank steht davor, und auf
der Bank sitzt ein junger Lieferfahrer mit Helm auf dem Schoß und einem Brett auf den Knien und redet,
noch bevor man ihn gegrüßt hat.

Hinter dem Platz fällt das Land über eine Glasbrüstung zum Hafen ab, und eine breite Treppe führt
hinunter in das Silicon Bay, das es vorher gab. Drei Häuser aus Backstein stehen an der Kaimauer, eine
Fischhalle mit verblichenem Schild, eine Hafenmeisterei, und ein kleiner Laden, in dessen Schaufenster
nichts liegt außer einem einzelnen Holzbrett und einem Zettel: „Bald geöffnet“. Davor sitzt ein alter
Mann auf einer Kiste und sieht aufs Wasser. Neben den alten Häusern glänzt ein Laden von Perfect Move,
in dessen Fenster ein Bildschirm das lächelnde Gesicht eines Mädchens zeigt. Am Kai warten zwei
Fähren: eine große nach Süden, eine kleine zur Insel. Die kleine fährt nur sonntags, sagt der
Fährmann, und welcher Tag heute ist, sagt er nicht.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

| Karte       | Szenen                 | Figuren                                                    | Auslöser und Gegenstände                                                                                     | Belebung                                                   |
| ----------- | ---------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| raststaette | 52                     | Mrs. Kowalczyk (Weisheit), Juno; Busfahrer, Mr. Oakes (14) | `start`, `zurueckIronwood`, `tafel` (Runde `wegIronwoodSilicon.tafel`), `fundAnstecker`, `weiterGlasbruecke` | Austernfischer, Möwen, Radfahrer, Lastwagen                |
| glasbruecke | 52                     | Joggerin (Gegnerin, Stellungsduell 3 + 2)                  | `zurueckRaststaette`, `fundOhrstoepsel`, `weiterSilicon` (Ankunftsdialog)                                    | Autos unter dem Deck, Lieferroboter, letzte Möwe           |
| aussen      | 53, 54, 61             | Victor, Juno, Dash, Rosie; Figuren aus 14                  | `glasbruecke`, `akademieTuer`, `lobbyTuer`, `hotel`; neu `hafen`, `roboter`, `infosaeule`                    | Drohne, Lieferroboter, Menschen mit Bildschirmen, Wachmann |
| hafen       | 62 (Abfahrt W5), N4    | Mr. Ames, Mr. Pike (14)                                    | `campus`, `faehre` (umgezogen), `inselfaehre`                                                                | Fähren (Objekte), Wellen                                   |
| akademie    | 55, 56, 58, 59, 60; R4 | Dr. Lin, Nova, Theo, Victor                                | `akademieAusgang`, `serverraumTuer`; Rangliste, Glaspokal, Zettel „Drei Ziele“ (09)                          | Staubsaugerroboter                                         |
| serverraum  | 56                     | Nova (kommt dazu)                                          | `serverraumAusgang`, `schummelgeraete` (Fund „Ohrempfänger“)                                                 | Blinken, Lüfter (Klang)                                    |
| lobby       | 57                     | Victor, Empfangsroboter                                    | `lobbyAusgang`, `vitrineHale` (Quest `siliconBay.fehlendeSeite`)                                             | Empfangsroboter dreht sich                                 |

**Sperren und ihre Öffnung, geprüft gegen den Bedarf der Hauptgeschichte:**

| Sperre                    | Öffnet                             | Gebraucht ab | Prüfung                                                                                              |
| ------------------------- | ---------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| Bus Ironwood → Raststätte | nach Szene 50 (`einladungGesehen`) | Szene 51/52  | öffnet vorher; Szene 51 spielt an derselben Haltestelle.                                             |
| Bus Raststätte → Ironwood | nach dem ersten Fußweg (W2)        | nie          | In der Stadt fährt kein Bus (Bibel 19.1); zurück geht es zu Fuß zur Raststätte und dort mit dem Bus. |
| Serverraum                | `serverraumOffen` (heute)          | Szene 56     | wird in Szene 56 selbst gesetzt.                                                                     |
| Küstenfähre (W5)          | `nadelSiliconBay` (heute)          | Szene 62     | Szene 60 gibt die Nadel; also offen.                                                                 |
| Inselfähre (S6)           | `nadelSiliconBay`                  | nie (N4)     | freiwillig; „sonntags“ ist nur Erzählung (Befund 16).                                                |
| Treppe zum Hafen          | immer offen                        | Szene 62     | –                                                                                                    |

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

| Element                                  | Entscheidung                                                              | Grund                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Größen                                   | Raststätte 160 × 28, Glasbrücke 140 × 26, Campus 72 × 52, Hafen 64 × 40   | `KARTENREGELN.md` 7a.2 (Weg ab Akt 2; große Stadt in Vierteln); heute 28 × 20 und 32 × 24.                             |
| Ein Außenviertel                         | geändert: zwei Viertel (Campus, Hafen)                                    | große Stadt (Regel 7a.2.6); Fähren, Anleger und leerer Laden (13 §7.4) brauchen eine Uferkarte.                        |
| Bus bis zur Raststätte, dann zu Fuß      | bleibt; der Weg zu Fuß ist der Küstenpfad mit Glasbrücke                  | Bibel 19.1; die Schnellstraße hat keinen Gehweg (Kraftfahrstraße), deshalb ein eigener Pfad hinter dem Lärmschutzwall. |
| Rätseltafel am Kaffeeautomaten           | bleibt, unter dem Vordach des Rasthauses                                  | Bibel 19.1 und W4.                                                                                                     |
| Joggerin mit Smartwatch                  | bleibt, auf der Glasbrücke                                                | Bibel 19.1, Szene 52.                                                                                                  |
| Ohrstöpsel                               | bleibt, unter der Glasbank auf der Brücke                                 | Bibel 19.1 (der Empfänger passt zu Szene 56).                                                                          |
| Tiere                                    | keine in der Stadt; der Küstenpfad hat Vögel, die an der Brücke aufhören  | 09 (4, 4a): Absicht; der Gegensatz macht den Grundsatz sichtbar, ohne ihn zu brechen.                                  |
| Bäume                                    | keine in der Stadt, nur Kübel mit Gräsern in Reihen                       | Szene 53 („Kein Baum.“); Regel 9.8.3 (geordnet in der Stadt) gilt für die Kübel.                                       |
| Straßenbahn                              | bleibt als Kulisse mit Haltestelle und Endhaltestelle; keine Schnellreise | 09 (5.6); die Viertel liegen nah genug für die Treppe.                                                                 |
| Food-Truck mit Bank                      | bleibt, am Westrand des Platzes                                           | Szene 54; Bank vor dem Truck, zum Platz gewandt.                                                                       |
| Hotel (Szene 61)                         | Kulisse mit Auslöser an der Drehtür                                       | Szene 61 ist ein Dialog in der Nacht; kein Innenraum nötig (wie heute `hotel` als Gegenstand).                         |
| Lobby als eigener Turm                   | Konzernturm am Ende des Boulevards                                        | Szene 57; Sichtachse von der Glasbrücke.                                                                               |
| Anleger für die Inselfähre, leerer Laden | im Hafen statt auf dem Campus                                             | 13 §7.4; am Wasser glaubwürdig (Regel 1).                                                                              |
| Fähre nach Port Delacroix                | Auslöser zieht vom Campus in den Hafen                                    | Eine Fähre legt am Wasser an (Regel 6.5 entsprechend).                                                                 |

### 3.3 Für Runde 6: Ereignisorte und Belebung auf Weg 4 (Runde 7, mittel-3, 10.11.2026)

**Stream auf der Glasbrücke (Dokument 15, 2.4):** Auf der Aussichtsplattform stehen ein Klapptisch
mit Laptop, das Ringlicht (`sb8Ringlicht`) und der Funkmast „Testfeld Signal“ (`sb8Funkmast`, sperrt nur
am Fuß). **Raststätte:** neben dem Rasthaus ein
Container (`wr5Container`, an seiner Wand der Kreidespringer `sb8Kreidespringer`, K2) und ein
Blumenkübel nahe der Tür mit Finkenzeichen (`sb8Finkenzeichen`, Finch-Bauer B).

| Auslöser         | A         | B         | C         | Ort                                              |
| ---------------- | --------- | --------- | --------- | ------------------------------------------------ |
| `ereignisStream` | (68, 8)   | (68, 8)   | (68, 8)   | glasbruecke, vor dem Klapptisch                  |
| `spurPM2`        | (84, 10)  | (84, 10)  | (84, 10)  | glasbruecke, gleiches Feld wie `fundOhrstoepsel` |
| `kreide2`        | (127, 11) | (124, 11) | (129, 11) | raststaette, vor dem Container                   |
| `finchBauerB`    | (140, 16) | (122, 16) | (142, 17) | raststaette, am Blumenkübel                      |
| `seite04`        | (128, 14) | (110, 14) | (130, 14) | raststaette, neben der Rätseltafel               |

**Belebung (Regel 10.53):** Glasbrücke (`statist.wegIronwoodSilicon.glasbruecke.*`): Pendlerin,
Kameramann (filmt für Kiki), Techniker (misst Funkwellen für Perfect Move), Rentnerin (Deep Blue, 1997) mit Satz, dazu der Lieferroboter; Möwe, Tauben, Krähe, Spatzen, Seeschwalben, Kaninchen.
Raststätte (`….raststaette.*`): Radfahrer, Busfahrer und Vogelzählerin (Austernfischer in einer Reihe
wie Bauern) mit Satz, dazu Mr. Oakes; Austernfischer, Möwen, Strandläufer, Ringelgänse, Krebse,
Hund.

### 3.4 Runde 6: Weg 4 und Silicon Bay spielbar (mittel-3)

Ereignis `ereignisStream` (Kiki Blitz, als Figur `wegIronwoodSilicon.kiki` am Stream-Tisch: seit Runde 8 (66, 8)) mit Aufgabenrunde `wegIronwoodSilicon.stream` (Fallen,
Kapitel 4) als Aufwärmen und danach der Begegnung `wegIronwoodSilicon.stream` gegen Kiki (Gegner
`wegIronwoodSilicon.kiki`): Partie 3 + 2 ab 1.e4 e5 2.Lc4 Sc6 3.Dh5, der Chat wählt Kikis Zug aus g6,
De7 und Sf6 (`kandidaten`); Sf6 ist der Fehler, Dxf7 matt und Quest gleichen Namens, Lohn Fund
`fotoLive`. Spur P2 gibt der Ohrstöpsel (`fund_ohrstoepsel` gibt jetzt auch `spurPM2`).
Fundstellen an der Raststätte `kreide2`, `finchBauerB`, `seite04`. Sperre S6: Die Inselfähre hat den
Dialog `silicon-bay-aussen.inselfaehre` (Fahrplan „sonntags“, nach der Nadel jeden Tag). Ansehen: `infosaeule` und `werbetafel` auf dem Campus,
`netze` an der Fischhalle im Hafen, `werbetafelZero` und `schildSmartCity` auf der Glasbrücke (je vor
dem Gegenstand, in allen Varianten). Batterie für das Leuchtfeuer der Pelikaninsel (Bitte von mittel-4): Auslöser `eisenwaren` vor dem
Eisenwarenladen der Altstadt (A (37, 41), B (17, 41), C (25, 41)), Quest `siliconBay.batterie` gibt den
Gegenstand `batterie`. Die Nacht im Hotel (Szene 61) setzt die Tönung `nacht` und am Morgen wieder `keine`. Die
Fundknoten zählen die Sammelstränge mit (`finchFiguren`, `buchseiten`, `spurenPM`, `kreideTreffpunkte`).

| Auslöser         | A       | B       | C       |
| ---------------- | ------- | ------- | ------- |
| `ereignisStream` | (68, 8) | (68, 8) | (68, 8) |

| Auslöser      | A         | B         | C         |
| ------------- | --------- | --------- | --------- |
| `kreide2`     | (127, 11) | (124, 11) | (129, 11) |
| `finchBauerB` | (140, 16) | (122, 16) | (142, 17) |
| `seite04`     | (128, 14) | (110, 14) | (130, 14) |

## 4. Bühnenbilder

Feld = linke obere Kachel (Spalte, Reihe). Möbel nach dem Katalog; „Offen“ heißt, das Bild fehlt
vermutlich. Die Szenen für den Kartenbauer entstehen nach der Durchsicht.

### 4.1 Raststätte (`wegIronwoodSilicon.raststaette`)

**Größe** 160 × 28. **Boden:** Asphalt (Schnellstraße, Fahrgasse, Parkplätze mit Markierung),
Betonplatten (Vorplatz), Gras mit Varianten (Picknickwiese), Sand und Holzbohlen (Pfad), Strandgras
(Salzwiese), Watt und Wasser (Bucht). **Grundtönung** Wintermorgen, klar.

| Abschnitt | Inventar                                                                                                                                                                                                                                                                                                                                        |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1        | Busbucht 132–146 / 19–20 mit Bus (Objekt, wenn Ankunft), Haltestellenschild (139, 21), Wartehäuschen 140–143 / 22–23 (offen nach Norden), `start` (140, 20); Picknicktische mit Bänken (148, 23), (153, 23), (150, 26), Mülleimer neben jedem Tisch, `fundAnstecker` (151, 24); Auffahrt 150–159 / 17–18 mit Schild „Keine Fußgänger“ (156, 16) |
| R2        | Rasthaus 130–148 / 7–14 (Tür (139, 14), Vordach 134–146 / 15), Kaffeeautomat unter dem Vordach (144, 15) mit Rätseltafel daneben (145, 15), `tafel` (145, 16); zwei Stehtische (136, 16), (140, 16); Tankstelle 112–124 / 7–14 mit Dach und zwei Zapfsäulen (116, 12), (120, 12)                                                                |
| R3        | Lkw-Parkplatz 110–128 / 21–27 mit drei Lastwagen in Buchten, Mrs. Kowalczyk auf dem Trittbrett ihres Lastwagens (114, 24); Abfahrt 104–110 / 5–16; Wegweiser mit zwei Armen (104, 21) am Pfadbeginn; Mülltonnen am Rasthaus                                                                                                                     |
| R4        | Pfad 80–103 / 19–22 mit Bogen nach Norden; Lärmschutzwall 0–103 / 6–11 mit Büschen dicht; Reihe alter Zaunpfähle in der Salzwiese (84–98, 23); Strandhafer in Gruppen                                                                                                                                                                           |
| R5        | Pfad 60–79 / 17–19; Abzweig Bohlensteg 68–69 / 20–21 zur Vogelhütte 66–71 / 21–24 auf Stelzen (Fenster nach Süden), Mr. Oakes darin (68, 22); Austernfischer im Watt                                                                                                                                                                            |
| R6        | Pfad 40–59 / 16–18; Abzweig auf die Düne 49–50 / 13–15, Bank auf der Düne (50, 12, zur Bucht), `aussichtDuene` (50, 13); Strandhafer dicht um die Düne                                                                                                                                                                                          |
| R7        | Holzsteg über den Priel 26–31 / 17–20 (Bohlen quer zur Gehrichtung, Regel 9.7.5), Pfähle mit Möwen (25, 23), (32, 24); Wasserlauf des Priels 27–30 / 21–27 bis zur Bucht                                                                                                                                                                        |
| R8        | Pfad 0–25 / 18–19; Glaslaternen (6, 17), (14, 17); Ortsschild „Silicon Bay – Stadt der Zukunft“ (8, 16, Schrift zum Weg)                                                                                                                                                                                                                        |

Belebung: Austernfischer (`fliegen`), Möwen (`fliegen`), Radfahrer (Pfad, hin und her), Lastwagen
auf der Schnellstraße (Kulisse), Busfahrer Briggs am Wartehäuschen. Offen: Lastwagen und Zapfsäulen
gibt es in Modern Exteriors; eine Vogelhütte auf Stelzen vermutlich nicht (Ersatz: Hochsitz).

### 4.2 Glasbrücke (`wegIronwoodSilicon.glasbruecke`)

**Größe** 140 × 26. **Boden:** Gras und Strandhafer an der Rampe, Beton (Rampe, Brückenkopf, Platz),
Glas mit hellem Rahmen (Deck), Asphalt mit Fahrstreifen (Autobahn unter dem Deck). **Grundtönung**
Wintertag, hell, kühle Farben.

| Abschnitt | Inventar                                                                                                                                                                         |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1        | Rampe 112–135 / 10–20 mit zwei Kehren und Geländer; Schild „Smart City“ (130, 17); Möwe auf dem Geländer (114, 10); Strandhafer an der Böschung                                  |
| B2        | Deck 100–111 / 10–13 mit Glasgeländer in Reihen 9 und 14; Laternen aus Glas alle acht Felder                                                                                     |
| B3        | Deck über der Autobahn; Glasbank (84, 9) zum Deck, `fundOhrstoepsel` (85, 10); Autobahn 48–92 / 0–25 unter dem Deck (sechs Fahrstreifen, Autos animiert)                         |
| B4        | Aussichtsplattform 66–74 / 5–9 mit Fernglas auf Säule (70, 6), `aussichtPlattform` (70, 7)                                                                                       |
| B5        | Deck 40–59 / 10–13; Joggerin Skye am Geländer (50, 10), Laufweg von (44, 11) bis (104, 11)                                                                                       |
| B6        | Brückenkopf 22–39 / 6–13, Aufzugsturm 24–29 / 6–12 (Tür „Außer Betrieb“), Treppe 22–25 / 13–20 nach unten, Roboterrampe daneben (26–27 / 13–20)                                  |
| B7        | Stadtrand-Platz 0–21 / 14–25 (helle Platten), Glaslaternen (4, 15), (16, 15), Kübel mit Gräsern in einer Reihe (2–18, 23), Werbetafel (10, 12); Weg zum Westrand in Reihen 18–19 |

Belebung: Joggerin, Lieferroboter (Rampe ↔ Platz), Autos unter dem Deck; keine Tiere westlich der
Rampe.

### 4.3 Silicon Bay, Campus (`siliconBay.aussen`)

**Größe** 72 × 52. **Boden:** helle Großplatten (Gehwege, Platz), blau markierte Roboterspuren,
Gleise in hellem Beton, Glasbrüstung am Südrand. **Grundtönung** Kunstlicht, kühl; Szene 61 Nacht mit
leuchtenden Fassaden.

| Abschnitt | Inventar                                                                                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1        | Konzernturm 3–14 / 2–20, Glasportal mit Firmenschild über der Tür (9, 19), zwei Kübel links und rechts (7, 20), (11, 20), Drohne (Belebung)                                                                   |
| B1        | Akademie 22–33 / 2–20, Glastür (28, 20) mit Fußmatte, Bank an der Fassade (24, 21, zum Gehweg), Schild über der Tür                                                                                           |
| C1        | Hotel 40–49 / 2–20, Drehtür (45, 20), Gepäckroboter (47, 21), `hotel` (45, 21); Glaslaternen am Gehwegrand (38, 22), (52, 22)                                                                                 |
| D1        | Werbetafelwand 54–71 / 2–16 (Bildschirme, Animation); Kübel mit Gräsern in einer Reihe (55–70, 18); Infosäule mit Stadtplan (60, 21), `infosaeule` (60, 22)                                                   |
| A2        | Tunnelportal 0–1 / 23–26 mit Gitter „Nur Bahnbetrieb“; Food-Truck 4–10 / 31–34 mit Klappe und Tafel „Burritos“, Verkaufsfenster (7, 34); Bank (6, 36, zum Truck) mit Dash; Mülleimer (9, 36)                  |
| B2        | Bahnsteiginsel 20–30 / 24–25 mit Glasdach, Fahrplanbildschirm (25, 24); Ellis auf Runde zwischen (18, 28) und (34, 28)                                                                                        |
| C2        | Roboterspuren Reihen 23 und 26 mit Lieferrobotern (Belebung), `roboter` (44, 23) für Szene 53                                                                                                                 |
| D2        | Ende der Glasbrücke am Ostrand (71, 21–22) mit Lärmschutzwand aus Glas daneben (71, 0–20, 23–28); Endhaltestelle mit Prellbock (66, 24–25), Straßenbahn steht (60–65 / 24–25, Objekt), Cilla daneben (63, 27) |
| A3        | Innovation Lab 1–14 / 38–46 (Glas, Kulisse), Stufe vor dem Eingang (7, 47), Kendra darauf (7, 47)                                                                                                             |
| B3        | Kübel mit Gräsern in zwei Reihen (20–34, 32) und (20–34, 44), `fundKastanie` im Kübel (26, 44); Bänke (22, 38), (30, 38) zum Wasserspiel; Treppe 32–35 / 47–51                                                |
| C3        | LED-Wasserspiel 40–45 / 36–41 mit Rand; vier Bänke gegenüber (38, 38), (47, 38), (42, 34), (42, 43), je zum Wasserspiel; Ladestation 50–53 / 31–33 mit zwei Robotern                                          |
| D3        | Café Byte 56–69 / 31–38 (Glaspavillon, Stehtische davor (58, 39), (64, 39)); Glasbrüstung 0–71 / 50 außer der Treppe; `aussichtBucht` (60, 49)                                                                |

Belebung (09, 4a): Menschen mit Bildschirmen (zwei Statisten auf dem Platz, `wann: tag`), Besucher
mit Namensschildern, Lieferroboter, Drohne, Staubsaugerroboter vor dem Café; keine Tiere. Klang:
Summen, leise Werbejingles, kein Vogel.

### 4.4 Silicon Bay, Hafen (`siliconBay.hafen`, neu)

**Größe** 64 × 40. **Boden:** Sitzstufen aus Beton (Treppe), Kopfsteinpflaster (Gasse), Holzbohlen
(Promenade), Steinplatten (Kai), Wasser mit Kaikante. **Grundtönung** Wintertag, Wind.

| Abschnitt | Inventar                                                                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A1        | Fischhalle 2–13 / 6–15 mit Holztor (7, 15) geschlossen, Schild „Fresh Fish Daily“ verblichen, Netze an der Fassade (Ansehen `netze`), Fischkisten gestapelt (12, 16)                 |
| B1        | Ames Kurzwaren 16–23 / 6–15, Tür (19, 15), Schaufenster mit Holzbrett und Zettel „Bald geöffnet“ (`schaufenster` (21, 16)); Kiste (20, 16) mit Mr. Ames; Hafenmeisterei 25–30 / 6–15 |
| C1        | Treppe 32–35 / 0–5 mit Sitzstufen 20–47 / 0–5; Gasse 32–35 / 6–15 (Pflaster), Laterne (31, 10); Perfect Move Store 38–51 / 6–15 (Glas, Bildschirm im Fenster (44, 15))               |
| D1        | Fährhäuschen 56–60 / 16–20 (Holz, Fenster nach Süden), Fahrplan „Pelikaninsel – sonntags“ (55, 20), Mr. Pike davor (58, 21)                                                          |
| A2        | Fährterminal 0–12 / 18–29 mit Glasdach, Rampe zur Fähre (5–7 / 29–30), Fähre im Wasser 2–12 / 31–37 (Objekt), `faehre` (6, 29); Zaun am Westrand                                     |
| B2        | Bänke zum Wasser (18, 28), (24, 28), Poller an der Kaikante (16, 30), (22, 30), (28, 30), Laternen (20, 22), (28, 22)                                                                |
| C2        | Münzfernrohr (40, 27), `fernrohr` (40, 28); `fundSeeglas` an der Kaikante (36, 29); Rettungsring an der Laterne (44, 22)                                                             |
| D2        | Steg der Inselfähre 52–55 / 22–35 auf Pfählen, Boot längs am Steg (56, 30, Objekt), `inselfaehre` (53, 22); Mole mit Geländer am Ostrand 60–63 / 22–30                               |

Belebung: Wellen und Boote (Objekte), Mr. Ames, Mr. Pike, eine Frau mit Kinderwagen auf der
Promenade; keine Tiere bis zur Öffnung der Inselfähre (dann Pelikan „Bishop“ auf dem Bootsgeländer).

### 4.5 Akademie (`siliconBay.akademie`)

**Neu gebaut in Runde 8 (mittel-3, 10.11.2026)** nach den Notizen des Autors (keine Variante passte:
Glaswand fehlte, Kapselmaschinen-Tische, Automaten mitten im Raum, Stühle nicht zum Tisch, nur ein Raum).

**Größe:** 26 × 20, drei Räume (10.56: der Glaswürfel außen ist groß genug für Saal, Foyer und Büro).

| Raum             | Felder        | Inhalt                                                                                                                                                                                                                                                                                                                                                               |
| ---------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trainingssaal    | 1–24 / 3–10   | Datenwand (Rangliste, Statistik) an der Nordwand, Theo davor (5, 3); vier weiße Tische für je zwei Schüler mit Flachbildschirm und Tastatur, Stühle von hinten zum Bildschirm; Vortragsecke mit großem Bildschirm und drei Stuhlreihen; Pausenecke im Nordosten mit Wasserspender, Getränke- und Snackautomat an der Wand; Nova mit Ringlicht an der Westwand (1, 9) |
| Glaswand         | 1–24 / 11–12  | gläserne Trennwand aus dem Büropaket; Durchgang zum Foyer bei 7–8, zum Büro bei 19–20                                                                                                                                                                                                                                                                                |
| Foyer            | 1–14 / 13–18  | Eingang Südwand (8, 19), Sitzgruppe (Sofa, Couchtisch, zwei Stühle zum Tisch), Empfangstisch mit Laptop, Vitrine mit dem Glaspokal                                                                                                                                                                                                                                   |
| Büro von Dr. Lin | 17–24 / 13–18 | zum Saal verglast, zum Foyer Wand; weißer Schreibtisch mit dem alten Holzbrett (Clubkampf, Szene 60), sein Stuhl dahinter, Besucherstuhl davor; Dr. Lin (18, 14)                                                                                                                                                                                                     |

Tür zum Serverraum in der Nordwand bei Spalte 12, Feld davor (12, 3). Eigene Bilder: Bildwunsch
`docs/spiel/auftraege/bildwuensche/akademie.py` (Möbel `sb8…` in `moebel/silicon-bay.json`).

### Runde 8 (mittel-3, 10.11.2026): Campus und alter Hafen nach den Notizen des Autors

- **Campus (`siliconBay.aussen`, Hauptfassung C):** Bahn auf den Gleisen, Prellbock quer zum
  Gleisende; Werbetafel am Gehweg; Waren und zwei Händler an den Marktständen; Bänke seitlich am
  Wasserspiel; Ladenzeile aus acht verschiedenen Läden (Bildwunsch `altstadt.py`, Teil Campus) und
  einem kleinen Supermarkt; Baumplatz mit eigenem hellem Steinboden; Hecke statt Glasgeländer an der
  Terrasse (die „Kante“ war das Glasgeländer); Infokiosk, Wohnhaus und Fahrradschuppen dazu (10.51).
  Bodenvariation (Punkt 31) kommt als Technik von mittel-2.
- **Alter Hafen (`siliconBay.hafen`, Hauptfassung C):** Küstenfähre neu gezeichnet, schräg von oben
  und 18 × 6 Kacheln groß (Bildwunsch `hafen_faehre.py`, KARTENREGELN 10.64: Personenfähre 16–20 × 6; der Kai ist
  länger als die Fähre); Fährhäuschen als Häuschen mit Dach statt
  flacher Front; der Kran ist weg; Ladebetrieb am kleinen Fischerboot mit Kisten und Fässern in Reihen und drei
  Arbeitern; ein Gemüsekarren mit Händlerin statt zwei leerer; keine Kisten mehr auf der Straße;
  Laternen am Straßenrand alle zehn Felder; die „H“-Taschen (Fischkisten) und der Fischeimer sind
  weg; um den Leuchtturm genug Land für den Weg zur Tür. Die Kaimauer fällt von vorn gesehen zum Wasser ab
  (`hafen-16/ground`, Wand mit Leitern und Reifenfendern, `sb8Kaimauer…`). Das Fischerboot des Pakets (6 × 3 Kacheln mit
  Angel) ist ein kleines Holzboot, kein Kutter; es bleibt so und heißt Fischerboot (10.64: zwischen Ruderboot
  und Motorboot). Ein Verlängern ergäbe nur ein langes Ruderboot.

Gutachten Runde 8 (`gutachten/silicon-bay-akademie.md`), behoben: Glaswand und Fenster aus gerahmten
Glasscheiben (Grocery 157) statt des grauen Bands; gläserne Eingangstür ohne Matte; Stahl-Doppeltür
zum Serverraum; zwei Fenster in der Nordwand; Foyer mit grauen Fliesen, Büro mit blauem Teppich;
an jedem Tisch ein Schüler, zwischen den Tischreihen ein Gang; Bildschirm mit Rangliste und großer
Vortragsbildschirm (Bildwunsch `akademie.py`), die Stuhlreihen mittig davor; Kaffeeautomat gleich
hoch wie der Getränkeautomat; Pausenecke mit zwei Sesseln im Osten; Glaspokal statt Goldpokal in der
Vitrine; weißer Beistelltisch statt Holzbank; Empfangsdame am Empfang, Kübelbaum im Foyer; Durchgang
vom Foyer ins Büro; Lin hinter seinem Schreibtisch, Bücherregal im Büro. Offen: Das Bild der
gläsernen Tür (`tuer_sued_glas.png`) wirkt braun; der Saugroboter ist eine Belebung ohne Bild.

Zweites Gutachten (`gutachten/silicon-bay-akademie-2.md`, Runde 9), behoben: Die Schüler stehen an
Stehpulten an der Stelle der leeren Stühle (Statisten können nicht sitzen; die Stühle der vier
Tische sind weg). Die Glaswand hat schmale Pfosten zwischen den Scheiben und an den Durchgängen und
eine Schwelle darunter (Bordsteinbilder `cr9BordL2`/`cr9BordQ…`). Der weiße Wandblock zwischen
Foyer und Büro ist weg; ein Bücherregal steht dort als Raumteiler, daneben eine Pflanze. Im Büro
steht ein Regal mit Büchern statt Dosen. Die Eingangstür ist die Glastür `sb8GlastuerSued`
(Bild seit Runde 8 im privaten Repository). Offen: Saugroboter (Bild des Autors aus Gemini kommt),
Sofa von hinten und Kübelbaum (nicht im Auftrag des Haupt-Chats). Drittes Gutachten (`silicon-bay-akademie-3.md`, „bereit für den Autor“), Restpunkte: zwei
Kübelpflanzen statt des großen Kübelbaums, zwei Stuhlreihen mit Fußraum statt drei dichter, der
Beistelltisch steht mittig vor den beiden Sesseln.

### Runde 9: erstes Gutachten zu Campus und altem Hafen (mittel-3, 10.11.2026)

`gutachten/silicon-bay-aussen-hafen.md`:

- **Campus (jetzt 72 × 70):**
  - Heller Plattenboden statt dunklem Kopfstein.
  - Konzernturm acht Geschosse hoch (Bildwunsch `campus.py`, `konzernturm_hoch`: das Bürohaus mit
    zweimal eingefügtem Geschossband); dafür zehn Reihen mehr im Norden, dahinter eine Baumreihe.
  - Tunnelportal am Westrand über der Fahrbahn (`tunnelportal_west`), der Gehweg daneben bleibt frei.
  - Am Ostrand das gläserne Deck der Glasbrücke mit Geländern; die Fahrbahn endet am Prellbock.
  - Hotel Bayview als hohes Haus mit Leuchtschild statt des Hauses mit Pultdach.
  - Zwei Werbetafeln ZERO (`wsgWerbetafelZero`) statt der Burgerwerbung.
  - Die Ladenzeile steht jetzt direkt südlich des Boulevards, ihre Fronten zeigen auf den Platz;
    Markt, Baumplatz mit dem Brunnen in der Mitte, Kaffeekiosk und Lab liegen davor.
  - Terrasse mit Hecke und gläserner Brüstung, Treppe mit Stufen in der Mitte. Das Wohnhaus auf dem
    Platz ist weg.
- **Alter Hafen:**
  - Fähre neu gezeichnet (`hafen_faehre.py`): Schlagschatten, Scheuerleiste, Wasserpass,
    Bullaugen, Decksplanken, Reling mit Pfosten, Gangway zum Kai.
  - Häuser mit Hafenbezug: Fischladen und Hafenbedarf (Bilder von mittel-1) statt Stadthaus und
    Bürohaus; Ames Laden mit Schild „Coming soon“ und Plakat „Bald geöffnet“; Hafenmeisterei mit
    Schild und Flagge; Netztrockner und Kisten auf der freien Fläche.
  - Treppe vom Campus in zwei Läufen, darunter eine Stützmauer über die ganze Breite.
  - Ladung am Ruderboot auf zwei Kisten und eine Fassgruppe verkleinert; ein Kutter kommt über die
    nächste Gemini-Datei. Am Steg der Inselfähre liegt ein Motorboot. Die Hafenstraße reicht bis zum
    Westrand.

### 4.6 Serverraum (`siliconBay.serverraum`)

**Größe:** 14 × 10. Nordwand Reihen 0–2 grau, Boden Doppelboden mit Lochplatten, Südwand Reihe 9 mit
der Tür bei Spalte 7. Kalt, blaues Licht, Lüfter.

| Zone     | Gegenstand                        | Feld                          | Ausrichtung     | Material, Stil | Zweck                                                     |
| -------- | --------------------------------- | ----------------------------- | --------------- | -------------- | --------------------------------------------------------- |
| Nordwand | fünf Serverschränke lückenlos     | (1, 1) bis (9, 1), je 2 breit | Front unten     | Metall, modern | Blinken (Animation)                                       |
| Mitte    | zweite Reihe Serverschränke       | (3, 5) bis (7, 5)             | Front unten     | Metall         | Gang hinter der Reihe frei                                |
| Ostwand  | Schubladenschrank aus Metall      | (12, 4)                       | Front zum Raum  | Metall         | `schummelgeraete` (11, 5): Fund „Ohrempfänger“ (Szene 56) |
| Ecke NO  | Klimagerät                        | (12, 1)                       | Front unten     | Metall         | Klang                                                     |
| Ecke SW  | Arbeitstisch mit Laptop und Stuhl | Tisch (1, 7), Stuhl (2, 7)    | Stuhl zum Tisch | modern         | Platz, an dem Nova dazukommt (Szene 56)                   |

### 4.7 Lobby im Konzernturm (`siliconBay.lobby`)

**Größe:** 24 × 14 (Eingangshalle). Nordwand Reihen 0–2 dunkler Stein mit Firmenschriftzug, Boden
polierter Stein, Südwand Reihe 13 mit dem Glasportal bei Spalte 12.

| Zone      | Gegenstand                                                                            | Feld                                | Ausrichtung       | Material, Stil       | Zweck                                                                                     |
| --------- | ------------------------------------------------------------------------------------- | ----------------------------------- | ----------------- | -------------------- | ----------------------------------------------------------------------------------------- |
| Nordwand  | zwei Aufzüge (Kulisse)                                                                | Wandfläche (3, 1), (7, 1)           | –                 | Metall               | Schild „Nur mit Ausweis“                                                                  |
| Nordwand  | Zeitleiste der Firmengeschichte auf Bildschirmen                                      | Wandfläche (14–20, 1)               | –                 | Glas                 | Ansehen `zeitleiste` (Gründung, Brücken, Rechenmaschinen, ZERO; keine Namen außer „Hale“) |
| Mitte     | Vitrine „Hale – Ingenieure seit 1850“ mit Rechenschieber, Brückenzeichnung, Notizbuch | (11, 6), 2 × 2                      | –                 | Glas und Holz, antik | `vitrineHale` (12, 8) (Szene 57); freies Fach unten (Platzhalter)                         |
| Ostseite  | Empfangstresen mit Empfangsroboter                                                    | (18, 6), 4 × 1                      | Vorderseite unten | weiß, modern         | Empfangsroboter (19, 5)                                                                   |
| Westseite | Sitzgruppe aus zwei Sofas und Glastisch                                               | Sofas (2, 8), (2, 11); Tisch (3, 9) | zum Tisch         | Leder, modern        | Victor wartet hier (Szene 57)                                                             |
| Ecken     | Kunstpflanzen in Kübeln                                                               | (1, 4), (22, 4), (1, 12), (22, 12)  | –                 | Kunststoff           | Regel 4.4, symmetrisch                                                                    |

## Lobby und Serverraum nach den aktuellen Regeln (niedrig-1, 10.11.2026)

- **Lobby (`siliconBay.lobby`):**
  - Die Lounge liegt auf blauem Teppich (abgesetzte Aufenthaltsecke). Sofa und Sessel stehen
    nebeneinander, davor ein Couchtisch statt des Schreibtischs.
  - Ein Besucher sitzt auf dem Sofa.
  - Die Besuchergruppe sind drei Figuren vor dem Empfang; der Roboter steht hinter dem Tresen.
  - Eine Pflanze mitten im Raum ist weg, die vier in den Ecken bleiben.
  - Größe 24 × 14: Eingangshalle eines Firmensitzes mit drei Aufzügen (10.56).
- **Serverraum (`siliconBay.serverraum`):**
  - Ruhiger Steinboden statt des lauten Schachbrettmusters.
  - Die zweite Schrankreihe hat zwei Schränke; ein dritter stellte den Gang vor der Tür zu. Die
    Beschreibung sagt das jetzt.
  - Keine Figuren, wie die Story-Bibel vorgibt: {held} findet die Schummelgeräte allein.
  - 14 × 10 passt zu einem Nebenraum der Akademie.

## Erstes Gutachten Lobby und Serverraum: Antworten (niedrig-1, 10.11.2026)

Gutachten `silicon-bay-lobby-serverraum.md`.

- **Lobby:**
  - Sitzgruppe zum Betrachter: Das Sofa steht an der Nordwand zwischen zwei Sesseln, davor ein
    runder Couchtisch. Ein Besucher sitzt auf dem Sofa.
  - Die Beschreibung folgt dem Bild: gemusterter Teppich, Bildschirme mit Kennzahlen, Sockel mit
    Pokalen.
  - Die Ausstellung steht mitten im Raum (Reihen 6–8), drei Reihen vor der Tür frei.
  - Die Tür ist die Glastür von mittel-3 (`sb8GlastuerSued`).
- **Serverraum:**
  - Neue Tönung `serverblau`, gleich in `toenung.ts`, `toenung.py` und im Kartenbau. Sie legt
    kaltes blaues Licht über den Raum.
  - Die Nordreihe ist ein Bild aus sechs Schränken ohne Lücken (Bildwunsch `serverreihe_6.png`).
  - Klimaschrank und Schubladenschrank sind eigene Bilder (`klimageraet_serverraum.png`,
    `schubladenschrank_metall.png`).
  - Der Arbeitsplatz hat einen Stuhl; die Tür ist die Glastür.
  - Offen: Kabel und Bodenlichter. Dafür gibt es keine Bilder.

## Zweites Gutachten Lobby und Serverraum: Antworten (niedrig-1, 10.11.2026)

- **Lobby:**
  - Die Sitzgruppe steht nicht mehr vor den Aufzügen, sondern im Südwesten des Raums (Teppich
    Reihen 7–11). Vor den drei Aufzügen sind vier Reihen frei.
  - Der leere Bildschirm ist weg. Zwei Bildschirme mit Kennzahlen hängen an der Nordwand
    (x 12 und x 16) und füllen auch das Wandstück neben den Aufzügen.
- **Serverraum:**
  - Die Schrankreihe ist nicht mehr angeschnitten: Das Bild ist 160 px breit, die sechs Schränke
    stehen mittig mit Rand links und rechts (`serverreihe_6.png`, neu rendern).
  - Der Stuhl steht direkt am Messplatz.

## Zweites Gutachten Campus und alter Hafen: Antworten (mittel-3, 10.11.2026)

- **Campus (`siliconBay.aussen`):**
  - Tunnel: Das Portal ist jetzt ein Betonbau quer über der Fahrbahn am Kartenrand (x 0–4,
    Reihen 32–36) mit einem dunklen Bogen nach Osten; Gleis und Asphalt verschwinden im Dunkel,
    links davon läuft nichts weiter (`tunnelportal_west.png`, 80 × 80, neu rendern).
  - Nordteil: Hinter den Häusern liegt ein Park mit Rasen (Boden `w`), zwei Baumreihen und
    Büschen. Zwischen Hotel und Wohnhaus ein Gartenhof mit Statuenbrunnen, zwei Bänken, vier
    Bäumen und Hecke zur Straße.
  - Baumplatz: Der Steinboden reicht von x 14 bis 53, Brunnen und Treppe liegen auf der
    Mittelachse; links und rechts stehen je zwei Baumspalten (x 16, 22 und 43, 49).
  - Der Kaffeebecher steht eine Kachel tiefer (62, 53).
- **Alter Hafen (`siliconBay.hafen`):**
  - Kai Mitte: Arbeitsplatz der Fischer mit gelbem Portalkran (nur die Beine sperren),
    Kistenstapel, Fischkisten, Netzgestellen, aufgelegtem Beiboot, Brettern, Fässern und zwei
    weiteren Bänken.
  - Fähre: Sie liegt eine Reihe höher an der Kaimauer und wird davor gezeichnet; die Gangway
    reicht auf den Kai (Auslöser `faehre` direkt darüber).
  - Häuserzeile: Zwischen Hafenbedarf und Kurzwaren steht die Bäckerei (`pd7Laden7`), die
    Hafenmeisterei steht gleich rechts der Treppe (x 37–42); die Netze trocknen östlich davon.
  - Der Kutter (nächste Gemini-Datei) ersetzt später das Ruderboot.

## Drittes Gutachten Campus und alter Hafen: Antworten (mittel-3, 11.11.2026)

- **Campus:** Das Hotel Bayview ist jetzt ein richtiges Hotel (`sb10HotelBayview`, LimeZu
  Hotel 1, 17 × 23, x 43–59, Tür mit drei Auslösern bei x 50–52, y 31); das braune Wohnhaus,
  das Schild und die Werbetafel daneben sind weg, vom Gartenhof bleibt ein Rasenstück mit zwei
  Bäumen. Der Kaffeebecher ist auf 4 × 6 Kacheln verkleinert (`kaffeebecher_klein.png`,
  Bildwunsch `kaffeebecher_klein.py`) und damit niedriger als die Läden. Die Möwen auf der
  Terrasse (lasen sich als Gänse) sind weg.
- **Alter Hafen:** Am Ostende der Hafenstraße steht der Angelladen (`sa8Angelladen`, x 55–61).
