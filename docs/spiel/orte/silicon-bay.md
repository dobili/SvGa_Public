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

| Abschnitt (Spalten)       | Thema                  | Inhalt                                                                                                                                                                                     | Zum Entdecken                                                        |
| ------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| R1 (140–159) Busbucht     | Ankunft mit dem Bus    | Busbucht an der Fahrgasse (132–146 / 19–20), Haltestelle (139, 21) mit Wartehäuschen, Ostteil des Rasthauses, Picknickwiese mit Tischen (Reihen 21–27)                                    | **Werbe-Anstecker ZERO** am Picknicktisch (`fundAnstecker`), Busfahrer Briggs in der Pause |
| R2 (120–139) Rasthaus     | Kaffee und Rätsel      | Rasthaus (130–148 / 7–14, Tür (139, 14)) mit Vordach, Kaffeeautomat unter dem Vordach mit Rätseltafel; Tankstelle (112–124 / 7–14)                                                         | Rätseltafel (`tafel`, 3 Eröffnungsfallen), Zapfsäulen                |
| R3 (100–119) Lkw-Platz    | Fernfahrer             | Lkw-Parkplatz (110–128 / 21–27) mit Mrs. Kowalczyks Lastwagen; Abfahrt; Beginn des Küstenpfads mit **Wegweiser** (104, 21: Silicon Bay ←, Rasthaus →)                                   | Mrs. Kowalczyk mit Weisheit („Erst die Figuren raus, dann die Dame.“) |
| R4 (80–99) Salzwiese      | hinaus aus dem Lärm    | Pfad zwischen Wall und Salzwiese, Strandhafer, Reihe alter Zaunpfähle                                                                                                                       | Austernfischer im Watt (Tier, `fliegen`), Radfahrer überholt         |
| R5 (60–79) Vogelhütte     | Zählen                 | **Abzweig 1** nach Süden (3 Felder, Bohlensteg) zur Vogelhütte auf Stelzen am Watt (66–71 / 21–24) mit Mr. Oakes                                                                           | Mr. Oakes und seine Vogelliste (N-W4a)                               |
| R6 (40–59) Düne           | Aussicht               | **Abzweig 2** nach Norden auf die Düne (48–52 / 12–15) mit Bank; Blick über die Bucht                                                                                                      | `aussichtDuene`: Pelikaninsel, die Glastürme, die Glasbrücke         |
| R7 (20–39) Priel          | Wasser unter den Füßen | Holzsteg über einen Priel (26–31 / 17–20), Möwen auf den Pfählen                                                                                                                           | Möwen (`fliegen`), Krebsspuren im Sand (Ansehen)                     |
| R8 (0–19) Stadtrand       | erstes Glas            | Ende der Dünen, erste Glaslaternen, Ortsschild „Silicon Bay – Stadt der Zukunft“ (8, 16, Schrift zum Weg); Pfad am Westrand in den Reihen 18–19                                            | Sichtachse auf die Glasbrücke und die Türme                          |

Laufzeit: Haltestelle → Westrand etwa 150 Kacheln, 43 s. Ränder: Norden Schnellstraße hinter dem
Wall und der Leitplanke (Kraftfahrstraße), Osten Auffahrt mit Schild „Keine Fußgänger“, Süden und
Westen die Bucht; nur der Pfad öffnet den Westrand.

### 1.2 Glasbrücke (`wegIronwoodSilicon.glasbruecke`, 140 × 26)

Von Ost nach West: Der Pfad kommt am **Ostrand** in den Reihen 18–19 an und steigt auf einer
**Rampe** mit zwei Kehren (112–135 / 10–20) auf die Höhe der Brücke. Das **Brückendeck** aus Glas
(vier Felder breit, Glasgeländer beidseitig) liegt in den Reihen 10–13 von Spalte 111 bis 30 und
überspannt die **Autobahn**, die von Nord nach Süd unter der Brücke durchläuft (Spalten 48–92,
sechs Fahrstreifen, bis Nord- und Südrand, Autos animiert, ohne Kollision für das Deck). In der Mitte
springt nach Norden eine **Aussichtsplattform** vor (**Abzweig 3**, 66–74 / 5–9). Im Westen der
**Brückenkopf** mit Aufzugsturm (24–29 / 6–12) und Treppe hinunter (22–29 / 13–20) auf den
**Stadtrand-Platz** (0–21 / 14–25); der Weg verlässt den Westrand in den Reihen 18–19.

| Abschnitt (Spalten)       | Thema                    | Inhalt                                                                                                     | Zum Entdecken                                                           |
| ------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| B1 (120–139) Rampe        | Aufstieg                 | Rampe mit Kehren, Grasböschung mit Strandhafer, letzte Möwe auf dem Geländer                               | Schild „Ab hier: Smart City – Bitte Sensoren nicht verdecken“ (Ansehen) |
| B2 (100–119) Brückenanfang | Glas unter den Füßen    | Deck beginnt, durch das Glas sieht man die Autobahn                                                        | Joggerin Skye beginnt ihre Runde                                        |
| B3 (80–99) Autobahn Ost   | Verkehr                  | Deck über den östlichen Fahrstreifen, Glasbank (84, 9) zum Deck                                            | **verlorener Ohrstöpsel** unter der Glasbank (`fundOhrstoepsel`)        |
| B4 (60–79) Plattform      | Aussicht                 | Aussichtsplattform mit Fernglas auf einer Säule (70, 6)                                                    | Blick auf das Autobahnkreuz und den Campus (`aussichtPlattform`)        |
| B5 (40–59) Autobahn West  | Stellungsduell           | Deck über den westlichen Fahrstreifen; Joggerin wartet am Geländer                                         | Skye fordert zum Duell (Stellungsduell mit Uhr 3 + 2, Szene 52)         |
| B6 (20–39) Brückenkopf    | Ankunft in der Stadt     | Brückenkopf, Aufzugsturm (Kulisse, Tür „Außer Betrieb“), Treppe                                            | Lieferroboter rollt die Rampe neben der Treppe hinunter                 |
| B7 (0–19) Stadtrand-Platz | erster Platz             | Platz mit Glaslaternen, Kübel mit Gräsern, Werbetafel mit ZERO (10, 12)                                    | Werbetafel (Ansehen: „ZERO – Nie wieder Fehler.“)                       |

Laufzeit: etwa 155 Kacheln mit den Kehren, 44 s. Ränder: Autobahn nach Nord und Süd unter der Brücke
(kein Weg hinunter), Böschung und Lärmschutzwand an den Rändern, nur Ost- und Westende offen.

### 1.3 Silicon Bay, Campus (`siliconBay.aussen`, 72 × 52)

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

| Abschnitt              | Bereich       | Thema                     | Inhalt                                                                                                    | Zum Entdecken                                                              |
| ---------------------- | ------------- | ------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| A1 Konzernturm         | 0–17 / 0–17   | Macht                     | Konzernturm Perfect Move (3–14 / 2–20), Glasportal mit Firmenschild über der Tür                          | Drohne kreist vor der Fassade (Tier-Ersatz, 09)                            |
| B1 Akademie            | 18–35 / 0–17  | Schule aus Glas           | Akademie (22–33 / 2–20), Glaswürfel; durch die Fenster sieht man Bildschirmbretter                        | Schild „Perfect Move Academy – Train like a Champion“ (Ansehen)            |
| C1 Hotel               | 36–53 / 0–17  | Übernachten               | Hotel Bayview (40–49 / 2–20), Drehtür, Gepäckroboter                                                      | `hotel` (Szene 61, Nachttönung)                                            |
| D1 Werbetafeln         | 54–71 / 0–17  | Licht ohne Pause          | Werbetafelwand mit ZERO (54–71 / 2–16), Wartehäuschen der Fernlinie (58–61 / 17–20, offen nach Süden)     | Werbefilm wechselt (Animation)                                             |
| A2 Tunnel, Food-Truck  | 0–17 / 18–34  | Das Einzige, was nicht leuchtet | Straßenbahn kommt aus dem Tunnelportal (0, 23–26); Food-Truck von Rosie (4–10 / 31–34), Bank davor (6, 36) | Rosie, Dash auf der Bank (Szene 54)                                    |
| B2 Haltestelle         | 18–35 / 18–34 | Unterwegs                 | Straßenbahnhalt „Akademie“ (Bahnsteiginsel 20–30 / 24–25 mit Glasdach), Wachmann Ellis auf Runde         | Ellis (N-SB2)                                                              |
| C2 Roboterspur         | 36–53 / 18–34 | Ausweichen                | Boulevard, Lieferroboter auf beiden Spuren                                                                | Lieferroboter fährt {held} fast um (Szene 53, Auslöser `roboter` (44, 23)) |
| D2 Ankunft             | 54–71 / 18–34 | Ankunft zu Fuß und mit Bus | Ende der Glasbrücke (Ostrand 21–22), Haltestelle der Fernlinie (60, 21), Endhaltestelle der Straßenbahn mit Prellbock (66, 24–25), Cilla in der Pause | `busIronwood`, Cilla und ihr Papierfahrplan (N-SB1)        |
| A3 Innovation Lab      | 0–17 / 35–51  | Arbeit hinter Glas        | Glaswürfel „Innovation Lab“ (1–14 / 38–46, Kulisse), Menschen mit Bildschirmen hinter der Scheibe         | Kendra in der Mittagspause auf der Stufe (N-SB3)                           |
| B3 Platz West          | 18–35 / 35–51 | Kübel in Reihen           | Kübel mit Gräsern in zwei Reihen, Bänke zum Wasserspiel, Treppe zum Hafen                                 | **Holzbauer** in einem Kübel (`fundHolzbauer`)                             |
| C3 Wasserspiel         | 36–53 / 35–51 | Mitte der Stadt           | LED-Wasserspiel (40–45 / 36–41), Bänke ringsum, Lieferroboter-Ladestation (50–53 / 31–33)                 | Wasserspiel wechselt die Farbe (Animation)                                 |
| D3 Café, Brüstung      | 54–71 / 35–51 | Blick aufs Wasser         | Café Byte (56–69 / 31–38, Glaspavillon, Kulisse), Glasbrüstung mit Blick auf die Bucht                    | Aussicht von der Brüstung auf Fähranleger und Pelikaninsel (`aussichtBucht`) |

**Wegeführung:** Der Boulevard ist gerade (Stadtstraße, Regel 9.6.1) und trägt die Sichtachse von
der Glasbrücke nach Westen auf den Konzernturm. Abzweige mit Ziel: Akademie, Lobby, Hotel (Türen),
Food-Truck mit Bank, Wasserspiel, Treppe zum Hafen. Der Weg über den Platz geht schräg von der
Straßenbahnhaltestelle zum Wasserspiel und weiter zur Treppe (Pflasterband, zwei Felder).

**Sichtachsen:**

| Standort                          | Ziel                                         | Warum                                                                  |
| --------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| Ankunft von der Glasbrücke (70, 21) | Konzernturm am Ende des Boulevards (9, 2)  | Der Turm ist das Erste und Größte, was man sieht (Szene 53).           |
| Boulevard (30, 27)                | Wasserspiel mit Lichtfarben (42, 38)         | lenkt auf den Platz und den Food-Truck.                                |
| Brüstung (60, 47)                 | Pelikaninsel und Fähranleger im Hafen        | Vorgeschmack auf N4 und W5, bevor man die Treppe findet.               |

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

| Abschnitt               | Bereich       | Thema                  | Inhalt                                                                                                                         | Zum Entdecken                                                         |
| ----------------------- | ------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| A1 Fischhalle           | 0–15 / 0–19   | Was einmal war         | Fischhalle (2–13 / 6–15, geschlossen, Kulisse), verblichenes Schild „Fresh Fish Daily“                                         | Netze an der Wand (Ansehen)                                           |
| B1 Leerer Laden         | 16–31 / 0–19  | Hoffnung im Schaufenster | Ames Kurzwaren (16–23 / 6–15), leer, Schild „Bald geöffnet“ im Fenster; Hafenmeisterei (25–30 / 6–15, Kulisse); Mr. Ames auf einer Kiste (20, 16) | Schaufenster mit einem einzelnen Holzbrett darin (Ansehen, `schaufenster`) |
| C1 Treppe und Store     | 32–47 / 0–19  | Neu neben alt          | Treppe vom Campus, Gasse; Perfect Move Store (38–51 / 6–15, Glas, Tablets im Fenster, Kulisse)                                 | Bildschirm im Store zeigt Novas Gesicht (Ansehen)                     |
| D1 Fährhäuschen         | 48–63 / 0–19  | Warten                 | Ende des Stores, Fährhäuschen der Inselfähre (56–60 / 16–20) mit Fahrplan „Pelikaninsel – sonntags“                           | Mr. Finch                                                             |
| A2 Küstenfähre          | 0–15 / 20–39  | Fernweh                | Terminal der Küstenfähre (0–12 / 18–29) mit Rampe, Fähre im Wasser (2–12 / 31–37, Objekt)                                      | `faehre` (6, 29), nach der Nadel (W5)                                 |
| B2 Kai                  | 16–31 / 20–39 | Sitzen am Wasser       | Bänke zum Wasser (18, 28), (24, 28), Poller, Laternen                                                                          | Mr. Ames erzählt vom alten Hafen                                      |
| C2 Fernrohr             | 32–47 / 20–39 | Weitsicht              | Münzfernrohr (40, 27) auf die Bucht, Kaikante                                                                                  | `fernrohr` (Pelikaninsel), **Seeglas** an der Kaikante (`fundSeeglas`) |
| D2 Inselfähre           | 48–63 / 20–39 | Die andere Seite       | Steg der Inselfähre (52–55 / 22–35), Boot am Steg (56, 30, Objekt)                                                             | S6: `inselfaehre` (53, 22), nach der Nadel offen                      |

**Ränder:** Norden Stützmauer mit Sitzstufen (nur die Treppe führt hinauf), Westen Zaun des
Fährterminals, Osten Mole mit Geländer, Süden die Bucht. **Laufzeit:** Promenade 64 Kacheln, 18 s.

### 1.5 Gebäude und Maße

| Gebäude                      | Lage außen (Spalten / Reihen), Tür                                      | Fassade                                           | Innen (7a.2)                                                              | Begehbar |
| ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| Konzernturm Perfect Move     | Campus 3–14 / 2–20, Glasportal (9, 20) (6 von 12, 50 %)                 | Glas und Stahl, 12 breit (Sockel), Turm darüber   | `lobby` 24 × 14 (Eingangshalle), Tür Südwand Spalte 12                    | ja       |
| Akademie                     | Campus 22–33 / 2–20, Glastür (28, 20) (6 von 12, 50 %)                  | Glaswürfel, 12 breit                              | `akademie` 24 × 16 (großer Saal), Tür Südwand Spalte 12; Tür zum Serverraum Nordwand Spalte 21 | ja |
| Serverraum                   | hinter der Akademie (keine eigene Fassade)                              | –                                                 | `serverraum` 14 × 10, Tür Südwand Spalte 7                                | ja       |
| Hotel Bayview                | Campus 40–49 / 2–20, Drehtür (45, 20)                                   | Glas, 10 breit                                    | –                                                                         | Kulisse  |
| Food-Truck Rosie             | Campus 4–10 / 31–34, Verkaufsfenster nach Süden (7, 34)                 | Lieferwagen mit Klappe, 7 breit                   | –                                                                         | Kulisse (Laden) |
| Café Byte, Innovation Lab    | Campus 56–69 / 31–38; 1–14 / 38–46                                      | Glaspavillon, Glaswürfel                          | –                                                                         | Kulisse  |
| Ames Kurzwaren (leerer Laden) | Hafen 16–23 / 6–15, Tür (19, 15)                                       | Backstein 1952, 8 breit, Schaufenster             | später (Post-Game): Dr. Lins Club, 16 × 11                                | Kulisse  |
| Fischhalle, Hafenmeisterei   | Hafen 2–13 / 6–15; 25–30 / 6–15                                         | Backstein, Holztore                               | –                                                                         | Kulisse  |
| Perfect Move Store           | Hafen 38–51 / 6–15                                                      | Glas                                              | –                                                                         | Kulisse  |
| Fährterminal, Fährhäuschen   | Hafen 0–12 / 18–29; 56–60 / 16–20                                       | Glas und Stahl; Holz                              | –                                                                         | Kulisse  |

Die Fassade ist halb so breit wie das Erdgeschoss innen, die Tür sitzt außen und innen an derselben
relativen Stelle (±1 Kachel). Der Serverraum liegt hinter der Nordwand der Akademie; man betritt ihn
durch die Nordwand und kommt an seiner Südwand an (Regel 2.2: Ausgangstür auf der Wand, durch die
man den Raum verlässt).

### 1.6 Übergänge (Felder auf beiden Seiten)

| Von (Karte, Auslöser, Feld)                                                  | Nach (Karte, Auslöser, Feld; Ankunft)                                             | Lage, Bedingung                                                                                                                         |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| ironwood.aussen `busSiliconBay` (15, 32), Dialog, Reise                      | raststaette `start` (140, 20), Blick nach Westen                                  | Busfahrt; erst nach Szene 50 (`akt2.einladung`); vorher Busfahrer Briggs: „Silicon Bay? Ohne Einladung lassen die dich nicht mal aussteigen.“ |
| raststaette `zurueckIronwood` (139, 21), Dialog, Reise                       | ironwood.aussen `bushaltestelle` (14, 32)                                          | Busfahrt zurück (heute Ziel `busSiliconBay`; Vorschlag: Ziel `bushaltestelle`, weil dort der Start liegt)                              |
| raststaette `weiterGlasbruecke` Westrand (0, 18–19)                          | glasbruecke `zurueckRaststaette` Ostrand (139, 18–19); Ankunft (138, 18)          | Pfad je zwei Felder                                                                                                                     |
| glasbruecke `weiterSilicon` Westrand (0, 18–19)                              | siliconBay.aussen `glasbruecke` Ostrand (71, 21–22); Ankunft (70, 21)             | Platz geht in den Gehweg Nord über; Dialog `ankunft_zu_fuss` bleibt an `weiterSilicon`                                                  |
| siliconBay.aussen `busIronwood` (60, 21), Dialog, Reise                      | ironwood.aussen `bushaltestelle` (14, 32)                                          | Fernlinie zurück, ohne Umweg über die Raststätte; nach W2 erst nach dem ersten Fußweg                                                   |
| aussen `akademieTuer` (28, 20)                                               | akademie `akademieAusgang` (Südwand, Spalte 12); Ankunft (12, 14)                 | 50 % ↔ 50 %                                                                                                                             |
| akademie `serverraumTuer` Nordwand (21, 2), Feld davor (21, 3)               | serverraum `serverraumAusgang` (Südwand, Spalte 7); Ankunft (7, 8)                | wie heute `wenn: serverraumOffen` (Szene 56)                                                                                            |
| aussen `lobbyTuer` (9, 20)                                                   | lobby `lobbyAusgang` (Südwand, Spalte 12); Ankunft (12, 12)                       | 50 % ↔ 50 %                                                                                                                             |
| aussen `hafen` (neu) Südrand (32–35, 51); Ankunft (33, 50)                   | hafen `campus` (neu) Nordrand (32–35, 0); Ankunft (33, 1)                         | Treppe, vier Felder breit                                                                                                               |
| hafen `faehre` (6, 29), Dialog, Reise                                        | wegSiliconDelacroix.faehre `start`                                                | heute auf `siliconBay.aussen`; zieht auf den Hafen um; `wenn: nadelSiliconBay` bleibt                                                   |
| hafen `inselfaehre` (neu, 53, 22), Dialog, Reise                             | Pelikaninsel (N4, Kennung bei Bau)                                                | S6: nach der Nadel von Silicon Bay dauerhaft offen (13 §4, Befund 16)                                                                   |

Änderungen in `orte.json` für den Haupt-Chat: neue Karte `siliconBay.hafen` mit `campus`, `faehre`
(umgezogen), `inselfaehre`; neuer Auslöser `hafen` auf `siliconBay.aussen`; Ziel von
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

| Karte       | Szenen                 | Figuren                                                                       | Auslöser und Gegenstände                                                                                                       | Belebung                                                   |
| ----------- | ---------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| raststaette | 52                     | Mrs. Kowalczyk (Weisheit), Juno; Busfahrer, Mr. Oakes (14)                    | `start`, `zurueckIronwood`, `tafel` (Runde `wegIronwoodSilicon.tafel`), `fundAnstecker`, `weiterGlasbruecke`                   | Austernfischer, Möwen, Radfahrer, Lastwagen                |
| glasbruecke | 52                     | Joggerin (Gegnerin, Stellungsduell 3 + 2)                                     | `zurueckRaststaette`, `fundOhrstoepsel`, `weiterSilicon` (Ankunftsdialog)                                                      | Autos unter dem Deck, Lieferroboter, letzte Möwe           |
| aussen      | 53, 54, 61             | Victor, Juno, Dash, Rosie; Figuren aus 14                                     | `glasbruecke`, `akademieTuer`, `lobbyTuer`, `hotel`, `busIronwood`; neu `hafen`, `roboter`                                     | Drohne, Lieferroboter, Menschen mit Bildschirmen, Wachmann |
| hafen       | 62 (Abfahrt W5), N4    | Mr. Ames, Mr. Finch (14)                                                      | `campus`, `faehre` (umgezogen), `inselfaehre`                                                                                  | Fähren (Objekte), Wellen                                   |
| akademie    | 55, 56, 58, 59, 60; R4 | Dr. Lin, Nova, Theo, Victor                                                   | `akademieAusgang`, `serverraumTuer`; Rangliste, Glaspokal, Zettel „Drei Ziele“ (09)                                            | Staubsaugerroboter                                         |
| serverraum  | 56                     | Nova (kommt dazu)                                                             | `serverraumAusgang`, `schummelgeraete` (Fund „Ohrempfänger“)                                                                    | Blinken, Lüfter (Klang)                                    |
| lobby       | 57                     | Victor, Empfangsroboter                                                       | `lobbyAusgang`, `vitrineHale` (Quest `siliconBay.fehlendeSeite`)                                                                | Empfangsroboter dreht sich                                 |

**Sperren und ihre Öffnung, geprüft gegen den Bedarf der Hauptgeschichte:**

| Sperre                         | Öffnet                                 | Gebraucht ab | Prüfung                                                                                           |
| ------------------------------ | -------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| Bus Ironwood → Raststätte      | nach Szene 50 (`einladungGesehen`)     | Szene 51/52  | öffnet vorher; Szene 51 spielt an derselben Haltestelle.                                          |
| Bus Silicon Bay → Ironwood     | nach dem ersten Fußweg (W2)            | nie          | Rückweg über Glasbrücke und Raststätte geht immer.                                                |
| Serverraum                     | `serverraumOffen` (heute)              | Szene 56     | wird in Szene 56 selbst gesetzt.                                                                  |
| Küstenfähre (W5)               | `nadelSiliconBay` (heute)              | Szene 62     | Szene 60 gibt die Nadel; also offen.                                                              |
| Inselfähre (S6)                | `nadelSiliconBay`                      | nie (N4)     | freiwillig; „sonntags“ ist nur Erzählung (Befund 16).                                             |
| Treppe zum Hafen               | immer offen                            | Szene 62     | –                                                                                                 |

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

| Element                                  | Entscheidung                                                                                    | Grund                                                                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Größen                                   | Raststätte 160 × 28, Glasbrücke 140 × 26, Campus 72 × 52, Hafen 64 × 40                         | `KARTENREGELN.md` 7a.2 (Weg ab Akt 2; große Stadt in Vierteln); heute 28 × 20 und 32 × 24.                                |
| Ein Außenviertel                         | geändert: zwei Viertel (Campus, Hafen)                                                          | große Stadt (Regel 7a.2.6); Fähren, Anleger und leerer Laden (13 §7.4) brauchen eine Uferkarte.                           |
| Bus bis zur Raststätte, dann zu Fuß      | bleibt; der Weg zu Fuß ist der Küstenpfad mit Glasbrücke                                        | Bibel 19.1; die Schnellstraße hat keinen Gehweg (Kraftfahrstraße), deshalb ein eigener Pfad hinter dem Lärmschutzwall.     |
| Rätseltafel am Kaffeeautomaten           | bleibt, unter dem Vordach des Rasthauses                                                        | Bibel 19.1 und W4.                                                                                                         |
| Joggerin mit Smartwatch                  | bleibt, auf der Glasbrücke                                                                      | Bibel 19.1, Szene 52.                                                                                                      |
| Ohrstöpsel                               | bleibt, unter der Glasbank auf der Brücke                                                       | Bibel 19.1 (der Empfänger passt zu Szene 56).                                                                              |
| Tiere                                    | keine in der Stadt; der Küstenpfad hat Vögel, die an der Brücke aufhören                        | 09 (4, 4a): Absicht; der Gegensatz macht den Grundsatz sichtbar, ohne ihn zu brechen.                                     |
| Bäume                                    | keine in der Stadt, nur Kübel mit Gräsern in Reihen                                             | Szene 53 („Kein Baum.“); Regel 9.8.3 (geordnet in der Stadt) gilt für die Kübel.                                          |
| Straßenbahn                              | bleibt als Kulisse mit Haltestelle und Endhaltestelle; keine Schnellreise                       | 09 (5.6); die Viertel liegen nah genug für die Treppe.                                                                    |
| Food-Truck mit Bank                      | bleibt, am Westrand des Platzes                                                                 | Szene 54; Bank vor dem Truck, zum Platz gewandt.                                                                           |
| Hotel (Szene 61)                         | Kulisse mit Auslöser an der Drehtür                                                             | Szene 61 ist ein Dialog in der Nacht; kein Innenraum nötig (wie heute `hotel` als Gegenstand).                            |
| Lobby als eigener Turm                   | Konzernturm am Ende des Boulevards                                                              | Szene 57; Sichtachse von der Glasbrücke.                                                                                  |
| Anleger für die Inselfähre, leerer Laden | im Hafen statt auf dem Campus                                                                   | 13 §7.4; am Wasser glaubwürdig (Regel 1).                                                                                  |
| Fähre nach Port Delacroix                | Auslöser zieht vom Campus in den Hafen                                                          | Eine Fähre legt am Wasser an (Regel 6.5 entsprechend).                                                                     |

## 4. Bühnenbilder

Feld = linke obere Kachel (Spalte, Reihe). Möbel nach dem Katalog; „Offen“ heißt, das Bild fehlt
vermutlich. Die Szenen für den Kartenbauer entstehen nach der Durchsicht.

### 4.1 Raststätte (`wegIronwoodSilicon.raststaette`)

**Größe** 160 × 28. **Boden:** Asphalt (Schnellstraße, Fahrgasse, Parkplätze mit Markierung),
Betonplatten (Vorplatz), Gras mit Varianten (Picknickwiese), Sand und Holzbohlen (Pfad), Strandgras
(Salzwiese), Watt und Wasser (Bucht). **Grundtönung** Wintermorgen, klar.

| Abschnitt | Inventar                                                                                                                                                                                                                          |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1        | Busbucht 132–146 / 19–20 mit Bus (Objekt, wenn Ankunft), Haltestellenschild (139, 21), Wartehäuschen 140–143 / 22–23 (offen nach Norden), `start` (140, 20); Picknicktische mit Bänken (148, 23), (153, 23), (150, 26), Mülleimer neben jedem Tisch, `fundAnstecker` (151, 24); Auffahrt 150–159 / 17–18 mit Schild „Keine Fußgänger“ (156, 16) |
| R2        | Rasthaus 130–148 / 7–14 (Tür (139, 14), Vordach 134–146 / 15), Kaffeeautomat unter dem Vordach (144, 15) mit Rätseltafel daneben (145, 15), `tafel` (145, 16); zwei Stehtische (136, 16), (140, 16); Tankstelle 112–124 / 7–14 mit Dach und zwei Zapfsäulen (116, 12), (120, 12) |
| R3        | Lkw-Parkplatz 110–128 / 21–27 mit drei Lastwagen in Buchten, Mrs. Kowalczyk auf dem Trittbrett ihres Lastwagens (114, 24); Abfahrt 104–110 / 5–16; Wegweiser mit zwei Armen (104, 21) am Pfadbeginn; Mülltonnen am Rasthaus |
| R4        | Pfad 80–103 / 19–22 mit Bogen nach Norden; Lärmschutzwall 0–103 / 6–11 mit Büschen dicht; Reihe alter Zaunpfähle in der Salzwiese (84–98, 23); Strandhafer in Gruppen                                                            |
| R5        | Pfad 60–79 / 17–19; Abzweig Bohlensteg 68–69 / 20–21 zur Vogelhütte 66–71 / 21–24 auf Stelzen (Fenster nach Süden), Mr. Oakes darin (68, 22); Austernfischer im Watt                                                              |
| R6        | Pfad 40–59 / 16–18; Abzweig auf die Düne 49–50 / 13–15, Bank auf der Düne (50, 12, zur Bucht), `aussichtDuene` (50, 13); Strandhafer dicht um die Düne                                                                            |
| R7        | Holzsteg über den Priel 26–31 / 17–20 (Bohlen quer zur Gehrichtung, Regel 9.7.5), Pfähle mit Möwen (25, 23), (32, 24); Wasserlauf des Priels 27–30 / 21–27 bis zur Bucht                                                         |
| R8        | Pfad 0–25 / 18–19; Glaslaternen (6, 17), (14, 17); Ortsschild „Silicon Bay – Stadt der Zukunft“ (8, 16, Schrift zum Weg)                                                                                                           |

Belebung: Austernfischer (`fliegen`), Möwen (`fliegen`), Radfahrer (Pfad, hin und her), Lastwagen
auf der Schnellstraße (Kulisse), Busfahrer Briggs am Wartehäuschen. Offen: Lastwagen und Zapfsäulen
gibt es in Modern Exteriors; eine Vogelhütte auf Stelzen vermutlich nicht (Ersatz: Hochsitz).

### 4.2 Glasbrücke (`wegIronwoodSilicon.glasbruecke`)

**Größe** 140 × 26. **Boden:** Gras und Strandhafer an der Rampe, Beton (Rampe, Brückenkopf, Platz),
Glas mit hellem Rahmen (Deck), Asphalt mit Fahrstreifen (Autobahn unter dem Deck). **Grundtönung**
Wintertag, hell, kühle Farben.

| Abschnitt | Inventar                                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| B1        | Rampe 112–135 / 10–20 mit zwei Kehren und Geländer; Schild „Smart City“ (130, 17); Möwe auf dem Geländer (114, 10); Strandhafer an der Böschung                                 |
| B2        | Deck 100–111 / 10–13 mit Glasgeländer in Reihen 9 und 14; Laternen aus Glas alle acht Felder                                                                                     |
| B3        | Deck über der Autobahn; Glasbank (84, 9) zum Deck, `fundOhrstoepsel` (85, 10); Autobahn 48–92 / 0–25 unter dem Deck (sechs Fahrstreifen, Autos animiert)                      |
| B4        | Aussichtsplattform 66–74 / 5–9 mit Fernglas auf Säule (70, 6), `aussichtPlattform` (70, 7)                                                                                     |
| B5        | Deck 40–59 / 10–13; Joggerin Skye am Geländer (50, 10), Laufweg von (44, 11) bis (104, 11)                                                                                      |
| B6        | Brückenkopf 22–39 / 6–13, Aufzugsturm 24–29 / 6–12 (Tür „Außer Betrieb“), Treppe 22–25 / 13–20 nach unten, Roboterrampe daneben (26–27 / 13–20)                                |
| B7        | Stadtrand-Platz 0–21 / 14–25 (helle Platten), Glaslaternen (4, 15), (16, 15), Kübel mit Gräsern in einer Reihe (2–18, 23), Werbetafel (10, 12); Weg zum Westrand in Reihen 18–19 |

Belebung: Joggerin, Lieferroboter (Rampe ↔ Platz), Autos unter dem Deck; keine Tiere westlich der
Rampe.

### 4.3 Silicon Bay, Campus (`siliconBay.aussen`)

**Größe** 72 × 52. **Boden:** helle Großplatten (Gehwege, Platz), blau markierte Roboterspuren,
Gleise in hellem Beton, Glasbrüstung am Südrand. **Grundtönung** Kunstlicht, kühl; Szene 61 Nacht mit
leuchtenden Fassaden.

| Abschnitt | Inventar                                                                                                                                                                                  |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1        | Konzernturm 3–14 / 2–20, Glasportal mit Firmenschild über der Tür (9, 19), zwei Kübel links und rechts (7, 20), (11, 20), Drohne (Belebung)                                                |
| B1        | Akademie 22–33 / 2–20, Glastür (28, 20) mit Fußmatte, Bank an der Fassade (24, 21, zum Gehweg), Schild über der Tür                                                                       |
| C1        | Hotel 40–49 / 2–20, Drehtür (45, 20), Gepäckroboter (47, 21), `hotel` (45, 21); Glaslaternen am Gehwegrand (38, 22), (52, 22)                                                              |
| D1        | Werbetafelwand 54–71 / 2–16 (Bildschirme, Animation); Wartehäuschen 58–61 / 17–20 (offen nach Süden), Schild der Fernlinie (60, 21), `busIronwood` (60, 21)                                |
| A2        | Tunnelportal 0–1 / 23–26 mit Gitter „Nur Bahnbetrieb“; Food-Truck 4–10 / 31–34 mit Klappe und Tafel „Burritos“, Verkaufsfenster (7, 34); Bank (6, 36, zum Truck) mit Dash; Mülleimer (9, 36) |
| B2        | Bahnsteiginsel 20–30 / 24–25 mit Glasdach, Fahrplanbildschirm (25, 24); Ellis auf Runde zwischen (18, 28) und (34, 28)                                                                     |
| C2        | Roboterspuren Reihen 23 und 26 mit Lieferrobotern (Belebung), `roboter` (44, 23) für Szene 53                                                                                              |
| D2        | Ende der Glasbrücke am Ostrand (71, 21–22) mit Lärmschutzwand aus Glas daneben (71, 0–20, 23–28); Endhaltestelle mit Prellbock (66, 24–25), Straßenbahn steht (60–65 / 24–25, Objekt), Cilla daneben (63, 27) |
| A3        | Innovation Lab 1–14 / 38–46 (Glas, Kulisse), Stufe vor dem Eingang (7, 47), Kendra darauf (7, 47)                                                                                          |
| B3        | Kübel mit Gräsern in zwei Reihen (20–34, 32) und (20–34, 44), `fundHolzbauer` im Kübel (26, 44); Bänke (22, 38), (30, 38) zum Wasserspiel; Treppe 32–35 / 47–51                           |
| C3        | LED-Wasserspiel 40–45 / 36–41 mit Rand; vier Bänke gegenüber (38, 38), (47, 38), (42, 34), (42, 43), je zum Wasserspiel; Ladestation 50–53 / 31–33 mit zwei Robotern                         |
| D3        | Café Byte 56–69 / 31–38 (Glaspavillon, Stehtische davor (58, 39), (64, 39)); Glasbrüstung 0–71 / 50 außer der Treppe; `aussichtBucht` (60, 49)                                             |

Belebung (09, 4a): Menschen mit Bildschirmen (zwei Statisten auf dem Platz, `wann: tag`), Besucher
mit Namensschildern, Lieferroboter, Drohne, Staubsaugerroboter vor dem Café; keine Tiere. Klang:
Summen, leise Werbejingles, kein Vogel.

### 4.4 Silicon Bay, Hafen (`siliconBay.hafen`, neu)

**Größe** 64 × 40. **Boden:** Sitzstufen aus Beton (Treppe), Kopfsteinpflaster (Gasse), Holzbohlen
(Promenade), Steinplatten (Kai), Wasser mit Kaikante. **Grundtönung** Wintertag, Wind.

| Abschnitt | Inventar                                                                                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1        | Fischhalle 2–13 / 6–15 mit Holztor (7, 15) geschlossen, Schild „Fresh Fish Daily“ verblichen, Netze an der Fassade (Ansehen `netze`), Fischkisten gestapelt (12, 16)       |
| B1        | Ames Kurzwaren 16–23 / 6–15, Tür (19, 15), Schaufenster mit Holzbrett und Zettel „Bald geöffnet“ (`schaufenster` (21, 16)); Kiste (20, 16) mit Mr. Ames; Hafenmeisterei 25–30 / 6–15 |
| C1        | Treppe 32–35 / 0–5 mit Sitzstufen 20–47 / 0–5; Gasse 32–35 / 6–15 (Pflaster), Laterne (31, 10); Perfect Move Store 38–51 / 6–15 (Glas, Bildschirm im Fenster (44, 15))       |
| D1        | Fährhäuschen 56–60 / 16–20 (Holz, Fenster nach Süden), Fahrplan „Pelikaninsel – sonntags“ (55, 20), Mr. Finch davor (58, 21)                                                |
| A2        | Fährterminal 0–12 / 18–29 mit Glasdach, Rampe zur Fähre (5–7 / 29–30), Fähre im Wasser 2–12 / 31–37 (Objekt), `faehre` (6, 29); Zaun am Westrand                            |
| B2        | Bänke zum Wasser (18, 28), (24, 28), Poller an der Kaikante (16, 30), (22, 30), (28, 30), Laternen (20, 22), (28, 22)                                                       |
| C2        | Münzfernrohr (40, 27), `fernrohr` (40, 28); `fundSeeglas` an der Kaikante (36, 29); Rettungsring an der Laterne (44, 22)                                                   |
| D2        | Steg der Inselfähre 52–55 / 22–35 auf Pfählen, Boot längs am Steg (56, 30, Objekt), `inselfaehre` (53, 22); Mole mit Geländer am Ostrand 60–63 / 22–30                     |

Belebung: Wellen und Boote (Objekte), Mr. Ames, Mr. Finch, eine Frau mit Kinderwagen auf der
Promenade; keine Tiere bis zur Öffnung der Inselfähre (dann Pelikan „Bishop“ auf dem Bootsgeländer).

### 4.5 Akademie (`siliconBay.akademie`)

**Größe:** 24 × 16 (großer Saal). Nordwand Reihen 0–2 Glas mit weißen Rahmen (Blick auf die
Bürotürme), Boden heller Kunststoff, Südwand Reihe 15 mit der Glastür bei Spalte 12; in der
Nordwand bei Spalte 21 die Tür zum Serverraum (Metall, Kartenleser).

**Stimmung:** Kunstlicht, leises Summen, Klicken von Bildschirmen; kein Holz außer auf Dr. Lins Tisch.

**Laufwege:** Tür (12, 15) → Start (12, 14) → Mittelgang nach oben zur Datenwand; links die
Bildschirmtische, rechts Dr. Lins Schreibtisch und die Serverraumtür.

| Zone         | Gegenstand                                                    | Feld                                    | Ausrichtung       | Material, Stil, Zustand | Zweck                                                                 |
| ------------ | ------------------------------------------------------------- | --------------------------------------- | ----------------- | ----------------------- | --------------------------------------------------------------------- |
| Nordwand     | Datenwand aus vier Bildschirmen mit Rangliste                 | Wandfläche (8–15, 1)                    | –                 | Glas, modern, neu       | Ansehen `rangliste` (09); Theo davor (11, 4)                          |
| Nordwand     | Tür zum Serverraum mit Kartenleser                            | Wandfläche (21, 1)                      | –                 | Metall                  | `serverraumTuer` (21, 3), `wenn: serverraumOffen`                     |
| Westwand     | breite Fensterbank mit Kissen                                 | (1, 4), 1 × 4                           | Sitzfläche Ost    | weiß, modern            | Nova sitzt hier (Szene 55); Platzhalter Akt 4 leer                    |
| Mitte links  | sechs Bildschirmtische in zwei Reihen, je ein Stuhl           | Tische (3, 6), (6, 6), (9, 6), (3, 10), (6, 10), (9, 10) | Stühle zum Tisch | weiß, modern, neu | Bildschirmbretter; Probepartie (Szene 55), Reihen (Szene 58)          |
| Mitte rechts | Dr. Lins Schreibtisch mit einem einzigen Holzbrett, Stuhl     | Tisch (16, 7), 3 × 2; Stuhl (17, 6)     | Stuhl zum Tisch   | weiß, Holzbrett alt     | Dr. Lin (18, 6); Clubkampf (Szene 60) an diesem Tisch                 |
| Mitte rechts | Zettel „Drei Ziele“ in Handschrift an der Glaswand            | Wandfläche (18, 1)                      | –                 | Papier                  | Ansehen `dreiZiele` (09)                                              |
| Ostwand      | Vitrine mit Glaspokal                                         | (22, 10)                                | –                 | Glas, einmal je Ort     | Ansehen `glaspokal` (09)                                              |
| Ecke SO      | Kunstpflanze in weißem Kübel, Staubsaugerroboter-Station      | (22, 13), (20, 13)                      | –                 | Kunststoff              | Regel 4.4; Staubsaugerroboter (Belebung)                              |
| Ecke SW      | Kamera auf Stativ, Ringlicht                                  | (1, 12)                                 | –                 | modern                  | Nova lächelt in die Kamera (Szene 55)                                 |

Offen: Bildschirmtische mit Schachbrett sind im Katalog wahrscheinlich nur als Bürotische mit
Monitor vorhanden; das genügt.

### 4.6 Serverraum (`siliconBay.serverraum`)

**Größe:** 14 × 10. Nordwand Reihen 0–2 grau, Boden Doppelboden mit Lochplatten, Südwand Reihe 9 mit
der Tür bei Spalte 7. Kalt, blaues Licht, Lüfter.

| Zone       | Gegenstand                                          | Feld                         | Ausrichtung     | Material, Stil | Zweck                                                         |
| ---------- | --------------------------------------------------- | ---------------------------- | --------------- | -------------- | ------------------------------------------------------------- |
| Nordwand   | fünf Serverschränke lückenlos                       | (1, 1) bis (9, 1), je 2 breit | Front unten    | Metall, modern | Blinken (Animation)                                           |
| Mitte      | zweite Reihe Serverschränke                         | (3, 5) bis (7, 5)            | Front unten     | Metall         | Gang hinter der Reihe frei                                    |
| Ostwand    | Schubladenschrank aus Metall                        | (12, 4)                      | Front zum Raum  | Metall         | `schummelgeraete` (11, 5): Fund „Ohrempfänger“ (Szene 56)     |
| Ecke NO    | Klimagerät                                          | (12, 1)                      | Front unten     | Metall         | Klang                                                         |
| Ecke SW    | Arbeitstisch mit Laptop und Stuhl                   | Tisch (1, 7), Stuhl (2, 7)   | Stuhl zum Tisch | modern         | Platz, an dem Nova dazukommt (Szene 56)                        |

### 4.7 Lobby im Konzernturm (`siliconBay.lobby`)

**Größe:** 24 × 14 (Eingangshalle). Nordwand Reihen 0–2 dunkler Stein mit Firmenschriftzug, Boden
polierter Stein, Südwand Reihe 13 mit dem Glasportal bei Spalte 12.

| Zone        | Gegenstand                                                                 | Feld                     | Ausrichtung       | Material, Stil        | Zweck                                                                    |
| ----------- | -------------------------------------------------------------------------- | ------------------------ | ----------------- | --------------------- | ------------------------------------------------------------------------ |
| Nordwand    | zwei Aufzüge (Kulisse)                                                     | Wandfläche (3, 1), (7, 1) | –                | Metall                | Schild „Nur mit Ausweis“                                                 |
| Nordwand    | Zeitleiste der Firmengeschichte auf Bildschirmen                           | Wandfläche (14–20, 1)    | –                 | Glas                  | Ansehen `zeitleiste` (Gründung, Brücken, Rechenmaschinen, ZERO; keine Namen außer „Hale“) |
| Mitte       | Vitrine „Hale – Ingenieure seit 1850“ mit Rechenschieber, Brückenzeichnung, Notizbuch | (11, 6), 2 × 2 | –           | Glas und Holz, antik  | `vitrineHale` (12, 8) (Szene 57); freies Fach unten (Platzhalter)        |
| Ostseite    | Empfangstresen mit Empfangsroboter                                         | (18, 6), 4 × 1           | Vorderseite unten | weiß, modern          | Empfangsroboter (19, 5)                                                  |
| Westseite   | Sitzgruppe aus zwei Sofas und Glastisch                                    | Sofas (2, 8), (2, 11); Tisch (3, 9) | zum Tisch | Leder, modern     | Victor wartet hier (Szene 57)                                            |
| Ecken       | Kunstpflanzen in Kübeln                                                    | (1, 4), (22, 4), (1, 12), (22, 12) | –       | Kunststoff            | Regel 4.4, symmetrisch                                                   |
