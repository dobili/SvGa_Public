# Port Delacroix (Ort 6, Akt 3)

Stand: 9.11.2026 nachts, Entwurf von mittel-1 für den Haupt-Chat. Ortsdokument nach
`docs/spiel/orte/README.md`: Ortsplan, Ortsbild, Abgleich mit der Geschichte, Bühnenbilder. Es umfasst
die Stadt `portDelacroix` mit Außenkarte und drei Innenräumen. Die Wege dorthin und weiter beschreiben
`delta.md` (mittel-3: Fährdeck, Deich, Bayou) und `desert-springs.md` (mittel-4: Canyonpfad); dieses
Dokument legt nur die Felder auf der Seite von Port Delacroix fest. Maßstab: `KARTENREGELN.md` 7a.2.
Quellen: `05_Story_Bibel.md` 16 bis 20 (Szenen 62 bis 70), `09_Weltbeschreibung.md` 5.7,
`13_Wegenetz.md` 4 (S7, S8), `orte.json`, Muster `orte/riverton.md` und `orte/silicon-bay.md`.

Feld = (Spalte, Reihe), linke obere Kachel; Bereiche „Spalten / Reihen“. Norden ist oben.

## 1. Ortsplan

### 1.0 Lage in der Welt

```text
                                      N
                         Meer (Delta, Steinufer)
 wegSiliconDelacroix.deich ══ Deichkrone (W→O) ══╗
 (Querkarte, mittel-3)                            ║ Rampe
 Wüstenzug ◄── Bahnsteig ── [PORT DELACROIX] ── Kai ≈ Hafenbecken ≈
 (wegDelacroixDesert)                              Marsch ── Marschpfad ──► [Bayou] (bayou.steg, S8)
```

Port Delacroix liegt hinter einem Deich am Delta. Wer mit der Küstenfähre kommt, läuft von Westen auf
der Deichkrone heran (die Deichkarte von mittel-3 ist eine Querkarte), hat das Meer zur Linken und die
Stadt unter sich und steigt über eine Rampe hinunter. Im Osten öffnet sich das Hafenbecken mit dem
Kai, im Westen hält der Wüstenzug an einem einfachen Bahnsteig, im Südosten beginnt hinter den letzten
Häusern das Marschland mit dem Pfad zum Bayou.

**Maße und Laufzeiten (7a.2, mittlere Stadt 60–80 × 50–60):**

| Karte                     | Größe   | Hauptweg                                | Zeit zu Fuß |
| ------------------------- | ------- | --------------------------------------- | ----------- |
| `portDelacroix.aussen`    | 70 × 58 | Westrand (Deich) → Rampe → Turnhalle 45 | ≈ 13 s      |
|                           |         | Rampe → Kai → Musikhaus 52              | ≈ 15 s      |
|                           |         | Bahnsteig → Bayou (Ostrand) 80          | ≈ 23 s      |
| `portDelacroix.turnhalle` | 26 × 16 | Tür → Lehrertisch 12                    | ≈ 3 s       |
| `portDelacroix.werkstatt` | 20 × 13 | Tür → Hobelbank 8                       | ≈ 3 s       |
| `portDelacroix.musikhaus` | 20 × 14 | Tür → Nordwand 10                       | ≈ 3 s       |

### 1.1 Port Delacroix außen (`portDelacroix.aussen`, 70 × 58)

Abschnitte zu je etwa 17 × 14 Kacheln (Spalten A bis D, Reihen 1 bis 4).

```text
                                                  N
 Spalte: 0     6            18            35            52  56            69
 R0–4   ┌≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈ Meer (Steinufer) ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈┐
 R5–6   ◄═ deich ══ Deichkrone (Erde) ══════════════════════════════╗══┐≈≈≈≈≈≈≈≈≈≈≈≈≈│
 R7–9   │ Sandsäcke · Hang (wand: damm) ════════ Rampe 29–30 ║   │≈ Hafenbecken ≈│
 R10–24 │Gleis│Bahn-│ [Haus 1]   [TURNHALLE 20–32]  [Gebäck] [Haus 2] │Kai│≈ Boote  ≈│
 R25    │     │steig│──────── Gehweg ─────────────────────────────── │   │≈ Steg   ≈│
 R26–28 │     │     │════════ Rue du Port (Asphalt) ═══════════════╗  │   │≈        ≈│
 R29    │     │     │──────── Gehweg ──────────────────────────────╢  │   │≈        ≈│
 R30–40 │     │     │ Gasse│ Platz: Clubzelt, Notzelt, Bläser │[MUSIKHAUS-RUINE]│≈ ≈│
 R41–42 │     │     │──────┴── Uferweg ────────────────────────────── Kai ─────┤≈ ≈│
 R43–52 │     │     │[WERKSTATT 8–17]│ [Haus 3] [Haus 4]  Gärten, Wäsche │   Marsch  │
 R53–54 │     │     │═════ Rue des Facteurs (Pflaster) ═══ Marschpfad ═══════► bayou │
 R55–57 └─────┴─────┴──── Marsch, Schilf, Hecke ──────────────────────────────────────┘
             A                B                C                 D
```

**Reihen (Nord nach Süd):** 0–4 Meer mit Steinkante; 5–6 Deichkrone (Erde), vom Westrand bis zum Kai;
7 Gras mit Sandsäcken; 8–9 Hang des Deichs (`"wand": "damm"`, Regel 10.49), offen nur an der Rampe
(Spalten 29–30); 10–24 Nordseite der Rue du Port; 25 Gehweg; 26–28 **Rue du Port**; 29 Gehweg;
30–40 Platz mit Zelten, Gasse und Musikhaus; 41–42 Uferweg; 43–52 Nordseite der Rue des Facteurs;
53–54 **Rue des Facteurs**, im Osten als Marschpfad bis zum Ostrand; 55–57 Marsch mit Schilf und Hecke.

**Spalten (West nach Ost):** 0–2 Gleis des Wüstenzugs (Schotter, ein Gleis längs, ab Reihe 10), 3–5
Bahnsteig, 6–51 Stadt, 52–55 Kai mit Steinkante (Reihen 10–48), 56–69 Hafenbecken (Reihen 0–48, mit dem
Meer im Norden verbunden; Wasser bis zum Nord- und Ostrand, `"ufer": "stein"`); südöstlich (52–69 /
49–57) Marsch mit dem Pfad zum Bayou.

**Gebäude und Plätze:**

| Gebäude, Platz                        | Lage außen (Spalten / Reihen), Tür                                                         | Fassade                                                   | Innen                                                     | Begehbar |
| ------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------- | --------------------------------------------------------- | -------- |
| Turnhalle der Schule (Ausweichclub)   | 20–32 / 9–24, Tür unten links im Bild, Auslöser `turnhalleTuer` vor der Tür auf dem Gehweg | 13 breit, grauer Bau mit Bogenfenstern und Rolltor        | `turnhalle` 26 × 16, Doppeltür Südwand Spalte 13          | ja       |
| Klavierwerkstatt Whitlock-Duval       | 8–17 / 44–52, Tür rechts im Bild, Auslöser `werkstattTuer` vor der Tür (Reihe 53)          | 10 breit, Holzhaus mit hohem Dach, Erker, Plane über Dach | `werkstatt` 20 × 13, Tür Südwand Spalte 10                | ja       |
| Musikhaus am Kai (Ruine)              | 39–51 / 31–40, Tür mit Stufen, Auslöser `musikhausTuer` vor der Tür (Reihe 41)             | 13 breit, rostiges Blechdach, Bauzaun links und rechts    | `musikhaus` 20 × 14, Tür Südwand Spalte 10; Ruine und neu | ja       |
| Gebäckstand von Mrs. Arceneaux        | 34–36 / 22–24 vor der Turnhalle, Front zum Gehweg                                          | Verkaufswagen mit Markise und Vitrine                     | –                                                         | Laden    |
| Häuser der Familien (Bretter sammeln) | Haus 1 (8, 21), Haus 2 (40, 21), Haus 3 (22, 49), Haus 4 (28, 49); je Tür unten Mitte      | kleine bunte Holzhäuser mit Wellblechdach                 | –                                                         | Kulisse  |
| Clubzelt und Notzelt                  | 20–23 / 32–35 und 27–30 / 32–34 auf dem Platz                                              | Zeltbahnen blau und braun                                 | –                                                         | Kulisse  |
| Bahnsteig des Wüstenzugs              | 3–5 / 12–24, Wartehäuschen, Auslöser `wuestenzug` (4, 19)                                  | Holzbohlen, Schild                                        | –                                                         | Reise    |
| Kai mit Fischerbooten                 | 52–55 / 10–48, Boote im Becken, Steg (56–57 / 23–24)                                       | Steinkante                                                | –                                                         | Platz    |

**Wegeführung:** Vom Westrand läuft die Deichkrone (Reihen 5–6, Erde, zwei Felder) nach Osten; an der
Rampe (29–30 / 7–9) geht es hinunter auf die Rue du Port (Asphalt, drei Felder, Gehwege je eins, Regel
9.2.1), die vom Bahnsteig im Westen bis zum Kai im Osten läuft und dort endet (Gehweg rundherum,
Regel 47). Die Deichkrone läuft weiter bis an den Kai und steigt dort über eine zweite Rampe ab. Von der
Rue du Port führt eine gepflasterte Gasse (Spalten 18–19) zwischen Werkstatt und Platz nach Süden zur
Rue des Facteurs. Der Platz (20–38 / 30–40) ist offen und gepflastert, der Uferweg (Reihen 41–42)
verbindet Gasse, Platz, Musikhaus und Kai. Die Rue des Facteurs (Reihen 53–54, Pflaster) läuft vom
Bahnsteig nach Osten und geht hinter dem Kai als Marschpfad (Erde) bis zum Ostrand zum Bayou.

**Sichtachsen:** (1) Von der Deichkrone nach Süden über die ganze Stadt: Dächer mit Planen, die Zelte,
das rostige Dach des Musikhauses. (2) Von der Rue du Port nach Osten das Hafenbecken mit Batistes Boot.
(3) Von der Gasse nach Süden die Werkstatt mit der Plane auf dem Dach. (4) Vom Bahnsteig nach Osten
die ganze Rue du Port bis zum Wasser.

**Ränder:** Norden Meer bis zum Rand (Regel 6.4); Westen Deichkrone (Übergang), darunter Gleis und
Hecke; Osten Hafenbecken bis zum Rand, im Südosten Marsch mit dem Marschpfad (Übergang); Süden Marsch mit
Schilf und Hecke.

**Laufzeit:** Westrand → Deichkrone → Rampe → Rue du Port → Turnhalle ≈ 45 Kacheln (13 s); Rampe → Kai →
Uferweg → Musikhaus ≈ 52 Kacheln (15 s); vom Bahnsteig zum Bayou ≈ 80 Kacheln (23 s).

### 1.2 Gebäude und Maße

| Gebäude                       | Außen (Fassade)             | Innen (7a.2)                                        | Begehbar |
| ----------------------------- | --------------------------- | --------------------------------------------------- | -------- |
| Turnhalle                     | 13, Tür links im Bild       | 26 × 16 (großer Saal), Tür Südwand Spalte 13 (50 %) | ja       |
| Klavierwerkstatt              | 10, Tür bei 8 von 10        | 20 × 13 (Werkstatt), Tür Südwand Spalte 10 (50 %)   | ja       |
| Musikhaus (Ruine, später neu) | 13, Tür bei 7 von 13 (54 %) | 20 × 14 (Clubraum), Tür Südwand Spalte 10 (50 %)    | ja       |

Abweichung: Die Tür der Turnhalle sitzt im Fassadenbild links (das Bild hat nur dort eine Tür); innen
liegt sie mittig, weil die Halle von einem Vorraum betreten wird (Regel: Tür außen und innen an
derselben relativen Stelle ±1 Kachel; hier bewusste Ausnahme, Befund 3.3 Nr. 4).

### 1.3 Übergänge (Felder auf beiden Seiten)

Abgestimmt mit mittel-3 (9.11.2026 nachts) und dem Haupt-Chat.

| Von (Karte, Auslöser, Feld)                                     | Nach (Karte, Auslöser, Feld; Ankunft)                                          | Lage                                                                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| portDelacroix.aussen `deich` (Westrand, Spalte 0, Reihen 5–6)   | wegSiliconDelacroix.deich `weiterDelacroix` (Ostrand, Deichkrone, zwei Felder) | Deichkrone je zwei Felder, Meer nördlich, Hang südlich auf beiden Karten; Ankunft (1, 5)                                              |
| portDelacroix.aussen `turnhalleTuer` (vor der Tür, Reihe 25)    | turnhalle `turnhalleAusgang` (13, 15); Ankunft (13, 14), Blick nach oben       | Südfassade ↔ Südwand                                                                                                                  |
| portDelacroix.aussen `werkstattTuer` (vor der Tür, Reihe 53)    | werkstatt `werkstattAusgang` (10, 12); Ankunft (10, 11)                        | Südfassade ↔ Südwand                                                                                                                  |
| portDelacroix.aussen `musikhausTuer` (vor der Tür, Reihe 41)    | musikhaus `musikhausAusgang` (10, 13); Ankunft (10, 12)                        | Südfassade ↔ Südwand; dieselben Felder in Ruine und neuem Clubraum                                                                    |
| portDelacroix.aussen `wuestenzug` (4, 19, Bahnsteig)            | wegDelacroixDesert.canyonpfad `start`                                          | Reise wie der Bus: Auslöser der Art `dialog`, `wenn: nadelPortDelacroix`; zurück zielt `zurueckDelacroix` (mittel-4) auf `wuestenzug` |
| portDelacroix.aussen `bayou` (Ostrand, Spalte 69, Reihen 53–54) | bayou.steg `zurueckDelacroix` (Westrand, zwei Felder)                          | Marschpfad je zwei Felder; `wenn: musikhausOffen` (S8); Ankunft (68, 53)                                                              |
| Küstenfähre zurück (Freifahrt nach Szene 70, S7)                | über den Deich und das Fährdeck (mittel-3)                                     | keine eigene Stelle in der Stadt                                                                                                      |

### 1.4 Platzhalter für Rückkehr und Weltzustand

- `portDelacroix.musikhaus`: zwei Zustände derselben Karte. **Ruine** (bis Szene 70): nasse Dielen,
  Loch im Dach, Himmel, fehlende Dielen, Trümmer, Planen, ein gerettetes Klavier unter einer Plane.
  **Neuer Clubraum** (`musikhausOffen`, ab Szene 70): neue Dielen, Tische mit Brettern, Henris
  gestiftetes Klavier, das Schild „Musik- und Schachclub Port Delacroix, seit 1889“ über der Tür.
- `portDelacroix.aussen`: nach `musikhausOffen` Bauzaun weg, neues Dach (Objekt mit Bedingung, wenn der
  Kartenbauer es kann; sonst bleibt außen der Bauzaun als Spur der Bauzeit).
- `portDelacroix.turnhalle`: Plakat „Wir spielen weiter“ bleibt; nach Szene 69 eine volle Spendenkasse.

## 2. Ortsbild

Port Delacroix riecht nach Salz, nassem Holz und frisch gesägten Brettern. Der Winter nach dem
Hurrikan ist nass: Es regnet in Schauern, dazwischen bricht Sonne durch und glänzt auf den Pfützen und
den blauen Planen, die über halb abgedeckte Dächer gespannt sind. Wer vom Fähranleger kommt, läuft
auf dem Deich heran, hoch über den Dächern, an Sandsäcken vorbei, die noch vom Sturm aufgestapelt
liegen, und sieht die ganze Stadt auf einmal: bunte Holzhäuser, zwei Zelte auf dem Platz, das große
graue Schulgebäude, und am Wasser ein langes Haus mit rostigem Dach, um das ein Bauzaun läuft.

Über die Rampe geht es hinunter auf die Rue du Port. Überall wird gearbeitet. Auf den Dächern klopfen
Handwerker, auf dem Platz stapeln Helfer Bretter, und irgendwo spielt immer jemand: ein Bläser sitzt
auf einer Kiste vor dem Clubzelt und übt dieselbe Melodie, bis sie sitzt. Vor der Turnhalle verkauft
Mrs. Arceneaux Gebäck aus einem kleinen Wagen mit gestreifter Markise; auf einem Pappschild steht,
dass der Erlös in den Wiederaufbau geht. Im Notzelt neben dem Clubzelt verbindet Mama Hände und
Knie.

Am Kai liegen Fischerboote, Pelikane sitzen auf den Pollern, eine Katze schläft auf einem Bootsdach.
Mr. Batiste flickt ein Netz und spielt dabei Schach auf einem umgedrehten Eimer. Das Musikhaus daneben
war hundertdreißig Jahre lang der Ort, an dem die Stadt Musik und Schach gemacht hat; jetzt hat das
Dach ein Loch, durch die Fenster sieht man den Himmel, und über dem Eingang hängt kein Schild mehr.

Im Süden wird die Stadt leiser. In der Rue des Facteurs, der Straße der Instrumentenbauer, steht die
Klavierwerkstatt der Whitlock-Duvals mit einer Plane über dem Dach; aus der offenen Tür riecht es nach
gehobeltem Holz. Hinter den letzten Gärten mit Wäscheleinen beginnt das Marschland: Schilf, Nebel am
Morgen, und ein schmaler Pfad, der zum Bayou führt und im Winter unter Wasser steht. Ganz im Westen,
an einem Bahnsteig aus Holzbohlen, wartet einmal am Tag der Wüstenzug.

Der Ton ist Hoffnung: Niemand jammert, alle packen an, und wer nichts tragen kann, macht Musik.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

| Szene                  | Karte                        | Verlangt                                                                                    | Auslöser, Figuren (orte.json)                              |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 62 Ankunft             | aussen                       | Ankunft über den Deich, erster Blick auf die Stadt (Planen, Bauzäune, Musik aus einem Zelt) | `deich`; Dialog `ankunft_zu_fuss` am Deich                 |
| 63 Vorwurf             | turnhalle                    | Regionalturnier: viele Tische, Publikum, Odile, Remy, Lou, Mama                             | Figuren `odile`, `remy`, `lou`                             |
| 64 Bretter sammeln     | aussen                       | vier Häuser mit je einem Auslöser, Odile sortiert                                           | `brettHaus1` bis `brettHaus4`, `gebaeckstand`, `arceneaux` |
| 65 Batiste am Kai      | aussen                       | Batiste am Kai mit Eimer und Booten                                                         | Figur `batiste`                                            |
| 66 Flashback Werkstatt | werkstatt (und aussen davor) | Geruch nach Holz vor der Werkstatt, Hobelbank                                               | `werkbank` (in der Werkstatt), `werkstattTuer`             |
| 67 Clubkampf           | turnhalle                    | Partie an einem Tisch, Publikum                                                             | `odile`                                                    |
| 68 Nachfahren          | werkstatt                    | Klaviere, altes Foto an der Wand, Célestes Laptop auf einem Flügel                          | `henri`, `celeste`                                         |
| 69 Benefiz-Simultan    | turnhalle                    | drei Bretter nebeneinander, Spendenkasse, Kinder                                            | `odile`, `remy`, `lou`                                     |
| 70 Das Schild          | musikhaus                    | neues Dach, Klavier, Bretter auf den Tischen, Schild über der Tür                           | `schild`                                                   |
| Bläser                 | aussen                       | Bläser auf einer Kiste                                                                      | Figur `blaeser`                                            |

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

- **Bleibt:** Deich mit Sandsäcken, Rue du Port, Turnhalle, Gebäckstand, Zelte, Kai mit Booten und
  Batiste, Musikhaus mit Bauzaun, Rue des Facteurs mit der Werkstatt, Marsch zum Bayou, Bahnsteig.
- **Ändert sich:** Die Handwerker auf den Dächern sind Statisten am Boden (Dächer sind Bilder); der
  Reiher steht am Kai statt im Bauzaun; Nebel nur als Tönung der Bayou-Karte.
- **Entfällt (für Runde 6):** Auslöser zum Ansehen ohne Eintrag in orte.json: Spendenkasse, nasses
  Notenheft, Plakat „Wir spielen weiter“ (Turnhalle), altes Foto und Célestes Laptop (Werkstatt),
  Bauzaun und Loch im Dach (Musikhaus). Die Gegenstände stehen auf der Karte, die Auslöser kommen mit
  den Dialogen in Runde 6.

### 3.3 Befunde und offene Punkte für den Haupt-Chat

1. **Wüstenzug** (entschieden vom Haupt-Chat): Reise wie der Bus, `wuestenzug` ist ein Auslöser der Art
   `dialog` mit Ziel canyonpfad `start`; `canyonpfad.zurueckDelacroix` zielt auf `wuestenzug`
   (mittel-4).
2. `bayou.zurueckDelacroix` zielte auf `deich`; mittel-3 korrigiert auf `bayou`.
3. Felder am Deich (Westrand, Reihen 5–6) und am Bayou (Ostrand, Reihen 53–54) sind mit mittel-3
   abgestimmt; Breite zwei Felder.
4. Turnhallentür: Ausnahme von „gleiche relative Stelle“ (siehe 1.2).
5. **Musikhaus in zwei Zuständen** (entschieden vom Haupt-Chat): A, B, C (`port-delacroix-musikhaus.json`
   und Varianten) sind die Ruine; der neue Clubraum ist eine zweite Szene derselben Karte,
   `port-delacroix-musikhaus-neu.json` mit `"zustand_der_karte": "musikhausOffen"` (Datei
   `karten/port-delacroix-musikhaus-neu.json`, gleiche Größe, Tür und Auslöser), ebenfalls in drei
   Varianten. Die App wertet das Feld erst in Runde 6 aus.
6. Fehlende Bilder (beim Haupt-Chat in Arbeit, bis dahin Ersatz): Flügel mit Laptop, Klavier unter
   Plane, Sandsäcke, Bauzaun mit Plane, Schild „Musik- und Schachclub Port Delacroix, seit 1889“,
   Basketballkorb an der Wand, Dielen mit Loch und nasse Dielen (Ruine).

## 4. Bühnenbilder

Möbel mit Vorsilbe `pd6` in `inhalte/abenteuer/moebel/port-delacroix.json`. Stil des Ortes: rustikal
und klassisch (Holz, alt, gebraucht), Zustand gebraucht bis alt, in der Ruine auch kaputt.

### 4.1 Turnhalle (`portDelacroix.turnhalle`)

**Größe:** 26 × 16 (großer Saal). Nordwand Reihen 0–2 helle Wand mit hohen Fenstern, Boden Holz hell
(Hallenboden), Südwand Reihe 15 mit der Doppeltür bei Spalte 13. **Stimmung:** Hall, Klappstühle,
Regen am Fenster, gerettete Bretter aller Sorten.

**Laufwege:** Tür (13, 15) → Start (13, 14) → Mittelgang nach oben zur Bühne; links und rechts je zwei
Reihen Klapptische; Spielfeld-Linien als Bodenbild unter den Tischen.

| Zone     | Gegenstand                                      | Feld                     | Material, Stil, Zustand | Zweck                             |
| -------- | ----------------------------------------------- | ------------------------ | ----------------------- | --------------------------------- |
| Nordwand | zwei Basketballkörbe, drei Fenster              | Wandfläche               | Metall, Glas            | Turnhalle erkennbar               |
| Nord     | Bühne oder Lehrertisch mit Turnieruhr           | (11, 3), 4 × 2           | Holz, gebraucht         | Odile beim Clubkampf (Szene 67)   |
| Mitte    | Klapptische mit Brettern, je zwei Stühle        | vier Reihen links/rechts | Holz, Metall, gebraucht | Turnier, Simultan (Szenen 63, 69) |
| Westwand | Regal mit geretteten Brettern und Figurenkisten | (1, 4)                   | Holz, alt               | Spuren des Sammelns (Szene 64)    |
| Ostwand  | Plakat „Wir spielen weiter“, Spendenkasse       | Wandfläche, (23, 4)      | Papier, Blech           | Ansehen (Runde 6)                 |
| Ecke SW  | Bälle, Matten                                   | (1, 12)                  | Leder, Stoff            | Turnhalle                         |

### 4.2 Klavierwerkstatt (`portDelacroix.werkstatt`)

**Größe:** 20 × 13. Holzwände, dunkle Dielen mit Spänen, Südwand Reihe 12 mit der Tür bei Spalte 10.
**Stimmung:** Geruch nach Holz, Licht durch ein Dachfenster, Klaviere unter Planen.

| Zone     | Gegenstand                                | Feld          | Zweck                            |
| -------- | ----------------------------------------- | ------------- | -------------------------------- |
| Nordwand | Hobelbank mit Werkzeug                    | (8, 2), 4 × 2 | `werkbank` (Flashback, Szene 66) |
| Nordwand | altes Foto (junger Mann mit Schachbrett)  | Wandfläche    | Szene 68 (Ansehen in Runde 6)    |
| Westen   | zwei aufrechte Klaviere, eins unter Plane | (1, 3)…       | Werkstatt                        |
| Osten    | Flügel mit Célestes Laptop                | (14, 5)       | Szene 68                         |
| Mitte    | Sägebock, Bretterstapel, Werkzeugkiste    | (5, 7)…       | Arbeit                           |

### 4.3 Musikhaus (`portDelacroix.musikhaus`, zwei Zustände)

**Größe:** 20 × 14. Südwand Reihe 13 mit der Tür bei Spalte 10.

- **Ruine:** Wände aus altem Holz, nasse dunkle Dielen, Teile fehlen (Löcher mit Erde/Wasser
  darunter), Pfützen, Trümmer, Planen, ein Klavier unter einer Plane, umgestürzte Stühle; Licht von
  oben (Himmel durchs Dach) als Tönung, wenn möglich.
- **Neuer Clubraum:** helle neue Dielen, Wände gestrichen, vier Tische mit Brettern, Henris Klavier,
  Notenständer, das Schild über der Tür, Pflanzen.

### 4.4 Port Delacroix außen (`portDelacroix.aussen`)

Wie 1.1. **Boden:** Gras, Erde (Deichweg, Marschpfad), Asphalt (Rue du Port), Pflaster (Gehwege,
Platz, Kai, Rue des Facteurs), Schotter (Gleis), Wasser mit Steinkante (`"ufer": "stein"`). **Wand:**
`"wand": "damm"` für die Böschung (Reihen 4–5), sonst `wandart` Hecke am Rand. **Inventar:** Sandsäcke
auf dem Deich, Bauzaun um das Musikhaus, zwei Zelte, Bläser auf Kiste, Gebäckstand, Boote, Steg,
Fässer und Netze am Kai, Laternen an den Straßen, Wäscheleinen in den Gärten, Schilf in der Marsch,
Wartehäuschen am Bahnsteig. **Belebung:** Pelikane und Möwen am Kai, Katze auf dem Boot, Helfer mit
Brettern, Kinder mit Ball zwischen den Zelten, Reiher am Wasser.
