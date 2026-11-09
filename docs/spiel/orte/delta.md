# Wege zum Delta: Küstenfähre, Deich und Bayou

Stand: 9.11.2026, nachts, Entwurf von mittel-3 für den Haupt-Chat. Ortsdokument nach
`docs/spiel/orte/README.md` (Ortsplan, Ortsbild, Abgleich, Bühnenbilder). Es umfasst Weg 5 von Silicon
Bay nach Port Delacroix (`wegSiliconDelacroix`: Fährdeck und Deich) und den Abzweig L5 Bayou
(`bayou.steg`) hinter Port Delacroix. Port Delacroix selbst beschreibt mittel-1 in
`orte/port-delacroix.md`; die Ränder sind mit mittel-1 abgestimmt (Abschnitt 1.4). Maßstab:
`KARTENREGELN.md` 7a.2. Quellen: `05_Story_Bibel.md` 19.3 und Szene 62, Funde-Tabelle (Flaschenpost,
Muschel mit Loch), 28 (L5 Bayou, Theron); `09_Weltbeschreibung.md` 5.7 und 5.9; `13_Wegenetz.md`
Abschnitt 4 (S7 entfällt, S8 Hochwasser); `10_Sprueche_Schauplaetze_Varianten.md` L5 (Nebelschach);
`orte/silicon-bay.md` (Hafen, `faehre` (4, 29)); `orte.json`.

Feld = (Spalte, Reihe), linke obere Kachel; Bereiche „Spalten / Reihen“. Norden ist oben.

## 1. Ortsplan

### 1.0 Lage in der Welt

```text
   Silicon Bay, Hafen ── Küstenfähre (zwei Tage nach Süden) ──► Fährdeck (eine Karte, das Schiff)
                                                                     │ Bugrampe
                                                                     ▼
   Anleger ══ Deich (West → Ost, Meer im Norden, Marsch im Süden) ══► Port Delacroix (Westrand)
                                                                         │ Ostrand
                                                                         ▼
                                                              Bayou Noir (Stege, Abzweig L5)
```

Weg 5 hat zwei Karten wie jeder Weg ab Akt 2 (7a.2: zusammen 280–400 lang): das Fährdeck (80 lang,
nur Schiff; die zwei Tage Fahrt erzählt der Übergang) und den Deich (220 lang). Zusammen 300 Kacheln,
etwa 90 Sekunden zu Fuß. Der Bayou ist ein Abzweig mit einer Karte (L5, freiwillige Rückkehr, Bibel 28).

| Karte                        | Größe    | Lauf (Kacheln)                        | Zeit (3,5/s) | Abzweige                                           |
| ---------------------------- | -------- | ------------------------------------- | ------------ | -------------------------------------------------- |
| `wegSiliconDelacroix.faehre` | 30 × 80  | Heck → Bug ≈ 70, mit Salon-Runde ≈ 90 | ≈ 26 s       | Bordbar, Salon, Vorderdeck (offenes Deck)          |
| `wegSiliconDelacroix.deich`  | 220 × 30 | Anleger → Ostrand ≈ 215               | ≈ 62 s       | Anlegesteg, Rampe zur Marsch, Rampe zum Pumpenhaus |
| `bayou.steg`                 | 48 × 36  | Westrand → Theron → Nebelsteg ≈ 55    | ≈ 16 s       | Stegschleife zur Zypresseninsel, Luftboot-Anleger  |

### 1.1 Fährdeck (`wegSiliconDelacroix.faehre`, 30 × 80)

Die Küstenfähre ist eine stumpfe Auto- und Personenfähre. Die Karte zeigt nur das Schiff auf offener
See: Wasser bis an alle Ränder, das Deck in der Mitte, Bug nach Süden (Fahrtrichtung). Das Deck ist
Holz (`holzDunkel`), ringsum Bordwand (`"ufer": "rumpf"`, bestellt; bis dahin `"stein"`) und Reling
(Zaunsatz 2, helles Metall).

```text
 Spalte: 0      7               22      29
 R0–3   ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈   Kielwasser, Möwen
 R4     ≈≈≈≈≈≈ ╔═Reling══╡FR╞══Reling═╗ ≈≈  Fallreep am Heck (14–15, 4): zurueckSilicon
 R5–19  ≈≈≈≈≈≈ ║ Achterdeck: Ladung,   ║ ≈≈  Container, Kisten, Rettungsboot, Start (14, 6)
 R20–27 ≈≈≈≈≈≈ ║ Bordbar (Kombüse)     ║ ≈≈  Schiffskoch Mr. Ruiz mit Schachbrett
 R28–38 ≈≈≈≈≈≈ ║ Salon (Deckhaus) +Tafel║ ≈≈  Rätseltafel an der Salonwand
 R39–64 ≈≈≈≈≈≈ ║ Vorderdeck: Bänke,     ║ ≈≈  Liegestühle, Rettungsringe, Flaschenpost an der Reling
 R65–72 ≈≈≈≈≈≈ ║ Bug: Poller, Taue      ║ ≈≈  Pelikan auf der Reling
 R73    ≈≈≈≈≈≈ ╚═Reling══╡BR╞══Reling═╝ ≈≈  Bugrampe (14–15, 73): weiterDeich
 R74–79 ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈   Bugwelle, Delfin (einmal)
```

Deck 7–22 / 4–73 (16 × 70), Reling auf der äußeren Kachelreihe, begehbar 8–21 / 5–72. Die Bibel nennt
„zwei Decks“: Das Oberdeck mit Steuerhaus liegt als Kulisse auf dem Salon (Dach mit Brückenfenstern),
begehbar ist das Hauptdeck. Das hält die Karte auf einem Laufweg und vermeidet Treppen ohne Ziel.

| Abschnitt (Reihen)    | Thema           | Zum Entdecken                                                |
| --------------------- | --------------- | ------------------------------------------------------------ |
| F1 Achterdeck (4–19)  | Abfahrt, Ladung | Fallreep zurück (`zurueckSilicon`), Kielwasser, Container    |
| F2 Bordbar (20–27)    | Kombüse         | Mr. Ruiz, Schnellschach mit Uhr (Figur `schiffskoch`)        |
| F3 Salon (28–38)      | Rätsel          | Rätseltafel 3 Bauernstrukturen (`tafel`)                     |
| F4 Vorderdeck (39–64) | Wind und Weite  | Flaschenpost an der Reling (`fundFlaschenpost`), Liegestühle |
| F5 Bug (65–73)        | Ankunft         | Pelikan, Bugrampe (`weiterDeich`), Delfin als Belebung       |

**Sichtachse:** Vom Achterdeck sieht man über die Mittellinie bis zum Bug und zur Bugrampe.
**Ränder:** Wasser ringsum; nur Fallreep und Bugrampe sind Übergänge (beide als Dialog „Reise“).

### 1.2 Deich (`wegSiliconDelacroix.deich`, 220 × 30)

Der Deich läuft von West nach Ost, vom Fähranleger bis an den Westrand von Port Delacroix. Im Norden
das Meer mit Steinschüttung (`"ufer": "stein"`, Reihen 0–4), oben die Deichkrone mit dem Weg (Erde, zwei
Felder, Reihen 5–6), Reihe 7 Grasstreifen, im Süden der Hang (`"wand": "damm"`, Reihen 8–10) hinunter in
die Marsch. Die Reihen sind mit mittel-1 abgestimmt: Port Delacroix setzt Meer, Krone und Hang am
Westrand in denselben Reihen fort.

```text
 Spalte: 0        20        60        96        140       160       200     219
 R0–4   ≈≈≈≈║Steg║≈≈≈≈≈≈≈≈≈≈≈≈ Meer, Steinschüttung, Möwen, Bojen ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
 R5–6   ══ Deichkrone (Erde, 2) ═════════════════════════════════════════════════► PD
 R7     ─ Grasstreifen ─ Sandsäcke am Loch (57–64) ─────────────────────────────────
 R8–10  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ Hang ▓▓▓║R1║▓▓▓▓▓▓▓▓▓▓▓▓║R2║▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 R11–28 Marsch: Gras, Schilf, Wrack eines Kutters, Zypressen; Pumpenhaus; Dächer von PD im Osten
```

| Abschnitt (Spalten)     | Thema                  | Zum Entdecken                                                                   |
| ----------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| D1 Anleger (0–19)       | Ankunft vom Schiff     | Anlegesteg 10–11 / 1–4, Fähre am Steg, `zurueckFaehre` (10–11, 1), Poller       |
| D2 Krone (20–39)        | Wind                   | Bojen im Meer, Möwen auf Pfählen                                                |
| D3 Treibgut (40–57)     | Spuren des Sturms      | angespülte Kisten und Planken an der Schüttung                                  |
| D4 Loch (58–75)         | Weisheit               | Mr. Guidry (61, 7) stopft das Loch mit Sandsäcken (Figur `guidry`)              |
| D5 Rampe 1 (76–99)      | hinunter in die Marsch | Rampe R1 96–97 / 7–10, Tümpel mit Schilf                                        |
| D6 Marsch (100–119)     | versteckt              | Muschel mit Loch zwischen Schilf (`fundMuschel` (106, 25), Pfad 96–107 / 11–25) |
| D7 Wrack (120–139)      | Hurrikan               | Kutter auf der Seite in der Marsch, Reiher                                      |
| D8 Pumpenhaus (140–159) | Technik                | Rampe R2 152–153 / 7–10, Vorplatz 150–155 / 15–16, Pumpenhaus ab (151, 17)      |
| D9 Zypressen (160–179)  | Stille                 | Zypressen mit Moos, Fischreiher                                                 |
| D10 Ausblick (180–199)  | erster Blick           | abgedeckte Dächer und Bauzäune von Port Delacroix im Südosten (Kulisse)         |
| D11 Ortsrand (200–219)  | Ankunft                | Ortsschild „Port Delacroix“, `weiterDelacroix` (219, 5–6)                       |

**Wegeführung:** Der Deich ist ein Bauwerk und läuft gerade; Abwechslung bringen die Rampen und der
Steg. Zwei Abzweige mit Ziel (Muschel, Pumpenhaus), der Steg ist der Anfang. **Sichtachse:** Von der
Krone bei D9 sieht man die Dächer von Port Delacroix (D10) einen Bildschirm vorher. **Ränder:** Meer im
Norden bis zum Rand, Marsch im Süden mit Gestrüpp; offen sind nur Steg (Fähre) und Ostrand.

### 1.3 Bayou (`bayou.steg`, 48 × 36)

Schwarzes, stilles Wasser bis an alle Ränder, darin Grasinseln (Bülten) mit Zypressen, verbunden
durch Holzstege (Brückenbilder auf `h`). Von Port Delacroix kommt man am Westrand auf einem Steg an.

```text
 Spalte: 0      8   12          24     30            46
 R0–8   ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈[Zypresseninsel 30–44 / 3–13]≈≈
 R9–16  ≈≈≈≈≈≈≈≈≈≈[Theron-Insel 12–22 / 10–24]≈≈≈≈║Steg 34–35║≈≈≈≈≈
 R17–18 ═Steg═[S8]═══╣ Hütte, Luftboot ╠══Steg══►[Nebelsteg 24–29]   nebel (28, 17)
 R19–35 ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈ Seerosen, Alligatoraugen ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
```

| Abschnitt            | Thema           | Zum Entdecken                                                     |
| -------------------- | --------------- | ----------------------------------------------------------------- |
| B1 Eingang (0–11)    | Hochwasser (S8) | überfluteter Steg 8–10 / 17–18 (Sperre S8, nur mit Gummistiefeln) |
| B2 Theron (12–22)    | Luftbootführer  | Hütte, Luftboot am Steg, Theron (17, 20) (Figur `theron`)         |
| B3 Nebelsteg (23–29) | Nebelschach     | Steg endet im Nebel (`nebel` (28, 17))                            |
| B4 Zypressen (30–46) | Stille          | Stegschleife zur Zypresseninsel, Reiher, Alligatoraugen           |

**Ränder:** Wasser ringsum; offen ist nur der Westrand (Steg).

### 1.4 Übergänge (Felder auf beiden Seiten)

| Auslöser hier                                              | Gegenstück                                            | Bemerkung                                                                                  |
| ---------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| faehre `zurueckSilicon` (14–15, 4), Dialog                 | siliconBay.hafen `faehre` (4, 29)                     | Fallreep am Heck; Reise zurück                                                             |
| siliconBay.hafen `faehre` (4, 29), Dialog                  | faehre `zurueckSilicon` (14–15, 4); Ankunft (14, 6)   | `wenn: nadelSiliconBay`; das Ziel war `start` und führte nicht zurück                      |
| faehre `weiterDeich` (14–15, 73)                           | deich `zurueckFaehre` (10–11, 1)                      | Bugrampe ↔ Ende des Anlegestegs                                                            |
| deich `weiterDelacroix` (219, 5–6), Dialog                 | portDelacroix.aussen `deich` (0, 5–6); Ankunft (1, 5) | Deichkrone läuft am Westrand von Port Delacroix weiter (mittel-1, 70 × 58)                 |
| portDelacroix.aussen `bayou` (69, 53–54); Ankunft (68, 53) | bayou `zurueckDelacroix` (0, 17–18)                   | Marschpfad bei mittel-1, Steg bei mir; `wenn: musikhausOffen` auf der Seite Port Delacroix |

Befund: In `orte.json` zielte `bayou.zurueckDelacroix` auf `portDelacroix.aussen`/`deich`; richtig ist
`bayou` (korrigiert).

## 2. Ortsbild

### 2.1 Die Küstenfähre

Die „Gulf Star“ ist alt, weiß gestrichen über Rost und riecht nach Diesel, Kaffee und Salz. Zwei Tage
dauert die Fahrt nach Süden; die Passagiere sitzen auf Bänken im Wind, schlafen in Liegestühlen oder
im Salon, wo eine Kreidetafel die Rätsel des Kapitäns trägt. Hinten an der Bordbar brät Mr. Ruiz
Eier und spielt mit jedem, der eine Minute Zeit hat, Schnellschach auf einem fleckigen Brett. Möwen
folgen dem Kielwasser, ein Pelikan sitzt auf der Bugreling, als gehöre ihm das Schiff. Einmal taucht
ein Delfin neben dem Bug auf. Ambrose wird unruhig, je wärmer der Wind wird: „Salz und Holz. Ich kenne
diese Luft.“

### 2.2 Der Deich

Am Anleger riecht es nach Teer und nassem Gras. Der Deich trägt einen Weg aus festgetretener Erde;
links das graue Meer gegen die Steinschüttung, rechts die Marsch mit Tümpeln, Schilf und schiefen
Zypressen. Der Hurrikan hat Kisten und Planken an den Deich gespült, unten liegt ein Kutter auf der
Seite. An einer Stelle ist die Krone weggebrochen; Mr. Guidry, ein Mann mit Strohhut und Schaufel,
stopft das Loch mit Sandsäcken: „Ein Loch im Deich ist wie ein Loch in der Bauernkette. Man stopft es,
bevor es größer wird.“ Am Ende des Deichs sieht man die Stadt: Planen auf den Dächern, Bauzäune, und
von irgendwo Musik aus einem Zelt.

### 2.3 Bayou Noir

Hinter Port Delacroix wird das Wasser schwarz und still. Stege aus grauem Holz laufen zwischen
Zypressen, von denen Moos hängt; Libellen, Frösche, und manchmal zwei Augen knapp über dem Wasser.
Im Winter steht das Hochwasser über dem ersten Steg, nur wer Gummistiefel hat, kommt durch. Theron,
der Luftbootführer, sitzt vor seiner Hütte und flickt einen Propeller. Am Ende des Stegs liegt der
Nebel so dicht, dass man nur sieht, was man erreichen kann: Nebelschach.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

| Karte  | Szene / Quelle            | Figuren                              | Auslöser (orte.json)                                                  | Belebung                                    |
| ------ | ------------------------- | ------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------- |
| faehre | 62, Bibel 19.3            | Schiffskoch Mr. Ruiz (`schiffskoch`) | `start`, `zurueckSilicon`, `tafel`, `fundFlaschenpost`, `weiterDeich` | Möwen, Pelikan, Delfin, Matrose, Passagiere |
| deich  | 62, Bibel 19.3            | Mr. Guidry (`guidry`)                | `start`, `zurueckFaehre`, `fundMuschel`, `weiterDelacroix`            | Möwen, Reiher, Helfer mit Schubkarre        |
| bayou  | Bibel 28 (L5), 13 §4 (S8) | Theron (`theron`)                    | `start`, `zurueckDelacroix`, `nebel`                                  | Reiher, Frösche, Libellen, Alligator        |

### 3.2 Was bleibt, was sich ändert, was entfällt

| Element                    | Entscheidung                                        | Grund                                                                                 |
| -------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Zwei Decks der Fähre       | geändert: Oberdeck als Kulisse auf dem Salon        | Ein begehbares Deck, keine Treppe ohne Ziel; die Karte bleibt ein Laufweg             |
| Rätseltafel „im Salon“     | geändert: an der Salonwand vor dem Eingang          | Draußen gibt es keine Innenräume; der Salon ist ein Deckhaus (Kulisse)                |
| Deich als Weg in die Stadt | bleibt, als Querkarte West → Ost                    | Regel 10.49: Der Hang ist nur als Südhang sichtbar                                    |
| Hauptweg mit Kurven (7a)   | geändert: gerader Deich, dafür Steg und zwei Rampen | Ein Deich ist ein gerades Bauwerk; Abwechslung durch Abzweige mit Ziel                |
| Sperre S8                  | bleibt als überfluteter Steg                        | 13 §4; das Bild „steg_ueberflutet“ ist bestellt, bis dahin Steg ohne Planken (Wasser) |
| Nebel                      | als Auslöser `nebel`; Tönung der Karte für Runde 6  | Die Karte kennt noch keine Tönung; Nebel kommt mit der Szene                          |

### 3.3 Für Runde 6 (Auslöser und Bilder)

- Neue Auslöser: `ladung` (Achterdeck, Ansehen), `delfin` (einmalige Animation), `pumpenhaus` (Deich,
  Ansehen), `luftboot` (Bayou, Ansehen), `sperreHochwasser` (S8 am überfluteten Steg).
- Bestellte Bilder (Haupt-Chat): `wasser_rumpf.png` (Bordwand, `"ufer": "rumpf"`),
  `steg_ueberflutet_laengs_3.png`, `sandsaecke_reihe.png`, `sandsaecke_haufen.png`, `schilf.png`,
  `schilf_breit.png`, `sumpfzypresse.png`, `luftboot.png`. Bis sie kommen: Ersatz nach den
  Beschreibungen der Szenen.

## 4. Bühnenbilder

### 4.1 Fährdeck

**Boden** Holz dunkel (Deck), Wasser ringsum. **Reling** Zaunsatz 2 auf der Randreihe, Lücken nur am
Fallreep (14–15, 4) und an der Bugrampe (14–15, 73), jeweils mit Endstücken.

| Zone       | Gegenstand                                | Feld (A)           | Zweck                                          |
| ---------- | ----------------------------------------- | ------------------ | ---------------------------------------------- |
| Achterdeck | Container, Kisten, Fässer, Rettungsboot   | 9–20 / 8–18        | Ladung, Abwechslung                            |
| Bordbar    | Schiffsbar (Beach Ship Bar), Barhocker    | (8, 20)            | Mr. Ruiz (16, 25), Schnellschach               |
| Salon      | Deckhaus (Container House), Rätseltafel   | (11, 29), (17, 34) | `tafel` (17, 36)                               |
| Vorderdeck | Bänke in Reihen zum Bug, Liegestühle      | 9–20 / 40–62       | Passagiere, Flaschenpost (8, 52) an der Reling |
| Bug        | Poller, Taue, Rettungsringe an der Reling | 9–20 / 65–72       | Pelikan, Bugrampe                              |

### 4.2 Deich

**Boden** Gras; Weg Erde; Hang `wand: damm` (Reihen 8–10); Meer mit Steinufer. Steg `h` 10–11 / 1–4 mit
Fußbrücke, Fähre am Steg. Inventar je Abschnitt nach 1.2; Sandsäcke am Loch (57–64 / 7), Pumpenhaus
(156, 17), Kutterwrack (124, 18), Ortsschild (210, 7).

### 4.3 Bayou

**Boden** Gras auf den Inseln, Wasser dunkel (Szene, Tönung in Runde 6), Stege `h` mit Fußbrücken
quer und längs. Hütte (14, 12), Luftboot am Steg (20, 22), Theron (17, 20), Nebelsteg-Ende (28, 17),
Zypressen auf beiden Inseln.
