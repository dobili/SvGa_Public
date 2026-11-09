# Ironwood und der Alte Steinbruch (N3)

Stand: 9.11.2026, Entwurf von mittel-4 für den Haupt-Chat. Ortsdokument nach dem Verfahren in
`docs/spiel/orte/README.md`: Ortsplan, Ortsbild, Abgleich mit der Geschichte, Bühnenbilder. Es umfasst
Ironwood (Ort 4, Akt 2) und den Nebenort N3 Alter Steinbruch hinter dem Bahnhof. Der Weg W3 von
Riverton (`wegRivertonIronwood`) gehört mittel-3; der Übergang W3 ↔ Ironwood ist in 1.6 mit ihm
abgestimmt. Leben, kleine Aufgaben und Funde stehen in `docs/spiel/14_Akt2_Leben_teil2.md`.
Quellen: `05_Story_Bibel.md` (7 bis 15, Szenen 38 bis 51a), `09_Weltbeschreibung.md` (4, 4a, 5.5),
`13_Wegenetz.md` (3, 7), `KARTENREGELN.md` (7a.2 und 9), `orte.json`, `quests.json`, `funde.json`,
der Prüfbericht `pruefberichte/2026-11-09_akt1_wegenetz.md` (Fehler, die nicht wieder vorkommen
sollen: Sperren ohne Öffnung vor dem Bedarf, Geheimnisse zu früh, Übergänge ohne Gegenstück,
Maße außerhalb von 7a.2, ungeprüfte Doppelungen). Karten werden noch nicht gebaut.

## 1. Ortsplan

Norden ist oben, auf allen Karten. Felder sind (Spalte, Reihe), Bereiche „Spalten / Reihen“.

**Lage in der Welt** (Weltkarte in 13): Riverton liegt im Norden; der Weg W3 kommt über die
Eisenbrücke und den Abhang von **Norden** herunter. Die Schnellstraße nach Silicon Bay verlässt die
Stadt nach **Westen** über die Stahlbrücke; dorthin fährt nur der Bus. Der Steinbruch (N3) liegt im
**Osten**, hinter dem Güterbahnhof. Der **Kanal** von Riverton (mit dem Lastkahn über Lockport)
fließt am Westrand von Nord nach Süd durch die Stadt.

**Größe:** `ironwood.aussen` 80 × 60 (mittlere Stadt nach 7a.2: 60–80 × 50–60, 17–23 s). Heute
gebaut: 32 × 24. Die obere Grenze ist nötig, weil die Stadt vier Welten trägt: das Werk mit Kantine
und Umkleide, die Wohnstraße der Familie, die Hauptstraße mit Laden und Haltestelle und den alten
Bahnhof mit Güterbahnhof und Weg zum Steinbruch.

### 1.1 Außenkarte `ironwood.aussen`, 80 × 60

**Reihen (Nord nach Süd):** 0–3 Abhang (Böschung, Fels, Gestrüpp; Treppe 24–25); 4–10 Reihenhäuser
der Elm Street (Türen in Reihe 10); 11 Stufen und schmale Vorgärten; 12 Gehweg; 13–14 Elm Street
(Wohnstraße, zwei Felder); 15 Gehweg; 16–17 Hinterhöfe; 18–27 Häuserzeile Hauptstraße Nord (Türen in
Reihe 27) und Werkhof; 28 Gehweg Nord; 29–31 Hauptstraße (drei Felder, Mittellinie); 32 Gehweg Süd;
33–41 Haltestelle, alter Bahnhof, Kirche, Parkplatz (Schauseiten nach Süden); 42–45 Platz am alten
Bahnsteig; 46–51 Gleise (drei Gleise); 52–59 Lokschuppen-Ruine, Güterbahnhof, Steinbruchweg.

**Spalten (West nach Ost):** 0–2 Westufer (Böschung, Schnellstraße, Bahndamm); 3 Ufer; 4–9 Kanal
(Wasser, Nord- bis Südrand); 10 Ufer; 11–12 Uferweg und Kai; ab 11 die Stadt; 47 Werkszaun; 48–79
Werk (nördlich der Hauptstraße).

```
                                               N
 Spalte:  0    4     10  16        24 26       32        40   47 48        56        64        72     79
 Reihe 0  ┌─┬──≈≈≈≈≈≈──┬─────────── Abhang ─╥╥─────────────────┬┬═══ Hallen, Schornsteine, Kranbahn ═══┐
          │B│ ≈Kanal≈ │  Brombeeren, Fels  ║║ Treppe (W3)      ││ ▲Rauch ▲Rauch          Portalkran     │
 Reihe 4  │ö│ ≈≈≈≈≈≈ │[Nr.2 ][Nr.4 ]  ║║[Nr.6 ][Nr.8 ][Nr.10 Ruth]││                        Stahlträger   │
          │s│ ≈≈≈≈≈≈ │ Elm Street Nord, Türen R10, Stufen R11      ││ [Kantine 12]   [Umkleide 7]           │
 Reihe 12 │c│ ≈≈≈≈≈≈ ├─ Gehweg ─────────────────────────────────┤P│ Tür (56,17)    Tür (69,17)            │
 R13–14   │h│ ≈≈≈≈≈≈ ║══ Elm Street ══════════════════════════ ║f│                                       │
 Reihe 15 │u│ ≈≈≈≈≈≈ ├─ Gehweg (Kreidebrett) ────────────────────┤o│   Werkhof          Werksbus-Halteplatz│
 R16–17   │n│ ≈≈≈≈≈≈ ║ Hinterhöfe, Wäsche  ║║  Hinterhöfe           │r│                                       │
 Reihe 18 │g│ ≈≈Kahn≈ ║[Kai ][Edna 7] ║║[Kneipe 9][Kohlen 10]  │t│        [Pförtner]                     │
 Reihe 27 │ │ ≈≈≈≈≈≈ ║ Anleger  Fenster║║ Gasse                │e│  ══Werkstor 56–60══          Schranke │
 Reihe 28 ├─┼────────┼─ Gehweg Nord ──────────────────────────────────────────────────────────────────────┤
 R29–31   ═══Brücke═══╪══ Hauptstraße (Mittellinie) ════════════════════════════════════════════╪═Schranke═► Rand zu
 Reihe 32 ├─┼────────┼─ Gehweg Süd ─[Halt.]────────────────────────────────────────────────────────────┤
 R33–41   │ │ ≈≈≈≈≈≈ │Grün ║[Alter Bahnhof 13]║[Kirche 10]║  Parkplatz der Schichtarbeiter           │
          │ │ ≈≈≈≈≈≈ │Bank ║ Uhrturm, Tür R41 ║ Tür R41   ║  Hecke mit Pollern, Big Joes Pickup       │
 R42–45   │ │ ≈≈≈≈≈≈ │[Lok]── Platz am alten Bahnsteig, Bänke, Laternen ───────────────╥ Weg ──────────────┤
 R46–51   ══Eisenbahnbrücke══════ Gleise 1–3 (bis West- und Ostrand) ═════════════════╬╬ Bahnübergang ═══════►
 R52–59   │ │ ≈≈≈≈≈≈ │ Brachland  [Lokschuppen-Ruine] [Güterschuppen]  Gus  [Stellwerk] ╚═ Steinbruchweg ═► Ostrand R57–58 (N3)
 Reihe 59 └─┴─≈≈≈≈≈≈──┴───────────────────────── Gebüsch, Böschung ──────────────────────────────────────┘
```

**Wegeführung:** Der Hauptweg beginnt an der Treppe (24–25, 0–3), läuft die **Gasse** (24–25,
16–27) gerade nach Süden auf die Hauptstraße, dort nach Osten zum **Werkstor** (56–60, 27) und nach
Westen zur **Haltestelle** an der Brücke (13–16, 32). Die Gasse ist bewusst gerade: Sie ist die
Sichtachse vom Abhang auf den Uhrturm des alten Bahnhofs (24, 34). Kurven und Richtungswechsel
haben die Nebenwege: der Uferweg am Kanal (11–12, 12–28) mit dem Kai, die Bahnhofstraße (16–17,
33–41) zum Platz, der Weg über den Platz am alten Bahnsteig zum Bahnübergang (62–63, 45–52) und der
Steinbruchweg, der hinter dem Güterbahnhof zweimal abknickt (62–63, 52–56; 63–79, 57–58). Abzweige
nach 7a.2 (mittlere Stadt) mit Ziel: Uferweg → Kai und Lastkahn; Bahnhofstraße und Kirchgasse →
Platz, Lok, Museumstür; Bahnübergang → Gus und Steinbruch; Elm Street → Haus von Oma Ruth und
Werkspforte (geschlossen, Ziel ist das Schild).

**Sichtachsen:**

| Standort                               | Ziel                                          | Warum                                                        |
| -------------------------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| oben an der Treppe (24, 1), Ankunft W3 | Uhrturm des alten Bahnhofs (24, 34)           | Ankunft zu Fuß: Man sieht die ganze Stadt bis zum Bahnhof.   |
| Haltestelle (14, 32), Ankunft mit Bus  | Schornsteine mit Rauch über dem Werk (52–60)  | Wer mit dem Bus kommt, sieht zuerst das Werk.                |
| Hauptstraße (40, 30)                   | Werkstor mit Schild (56–60, 27)               | Szene 49: Das neue Schild hängt dort, wo jeder hinsieht.     |
| Platz am Bahnsteig (30, 43)            | Gittertor zum Steinbruch hinter dem Güterbahnhof (76, 57–58) | Man sieht das Tor, bevor man den Weg dorthin findet. |
| Brückenmitte (6, 32)                   | Hauptstraße bis zum Werk, Schnee in Szene 50  | Abschied am Ende von Akt 2.                                  |

**Ränder:** Norden Abhang mit Fels und Gestrüpp (nur die Treppe öffnet ihn, Übergang W3). Westen
jenseits des Kanals Böschung; die Schnellstraße läuft über die Brücke an den Westrand, aber der
Gehweg endet am Schild „Kraftfahrstraße – keine Fußgänger“ am Westende der Brücke (2, 32); dahinter
Leitplanke. Die Gleise laufen an West- und Ostrand, mit Zaun; über die Gleise führt nur der
Bahnübergang. Osten: Hauptstraße endet an der Schranke „Werkszufahrt Ost – nur Lieferverkehr“
(75, 29–31); Werkshallen bis zum Rand; nur der Steinbruchweg öffnet den Ostrand (Reihen 57–58).
Süden dichtes Gebüsch auf der Böschung. Der Kanal reicht über Nord- und Südrand (Regel 6.4).

### 1.2 Abschnitte

Abschnitte zu je 16 × 15 Kacheln (fünf Spalten A bis E, vier Reihen 1 bis 4), etwa zwei
Hochformat-Bildschirme. Benachbarte Abschnitte haben verschiedene Themen.

| Abschnitt          | Bereich       | Thema                           | Inhalt                                                                                                                      | Zum Entdecken                                                                  |
| ------------------ | ------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| A1 Kanal Nord      | 0–15 / 0–14   | Kanal unter dem Abhang          | Kanal mit Ufer, Westböschung, Elm Street Nr. 2 am Westende, Uferweg beginnt an der Elm Street                               | Krähen auf dem Geländer, Brombeeren am Hang                                    |
| B1 Treppe          | 16–31 / 0–14  | Ankunft zu Fuß                  | Treppe vom Abhang (Ankunft W3), Nr. 4 und Nr. 6, Blick über die Stadt                                                       | Aussicht oben an der Treppe (`aussichtTreppe`), Mrs. Brody fegt den Gehweg     |
| C1 Elm Street Ost  | 32–47 / 0–14  | Wohnstraße der Familie          | Nr. 8, Eckhaus Nr. 10 von Oma Ruth mit Spitzengardine, Werkspforte am Ostende                                               | Schild „Werkspforte – nur Schichtpersonal“, Kohleneimer vor Nr. 8              |
| D1 Hallen          | 48–63 / 0–14  | Das Werk arbeitet               | Hallen mit Schornsteinen (Rauch und Funken animiert), Kantine im Werkhof                                                    | Funkenflug, Sirene zum Schichtwechsel                                          |
| E1 Kranbahn        | 64–79 / 0–14  | Stahl unter freiem Himmel       | Portalkran über dem Lagerplatz, Stahlträgerbündel, Umkleide                                                                 | Krähen auf den Trägern, Kranführerkabine (Big Joes Arbeitsplatz, Ansehen)      |
| A2 Kai             | 0–15 / 15–29  | Wasser und Lastkahn             | Kai mit Pollern, Kanalmeisterei (Schuppen), Liegeplatz des Lastkahns, Uferweg bis zur Hauptstraße                           | Schild „Anleger – Lastkahn Ashford Belle“, Lastkahn (nach Öffnung)             |
| B2 Laden und Gasse | 16–31 / 15–29 | Einkaufen                       | Kreidebrett auf dem Gehweg Süd der Elm Street, Hinterhöfe, Eisenwaren Edna mit Verkaufsfenster, Gasse, Kneipe               | Kreidekinder (N-IW1), Eisenwarenfenster (`eisenwarenfenster`)                  |
| C2 Kohlenhof       | 32–47 / 15–29 | Alter Alltag                    | Kohlenhandlung mit Kohlenhaufen im Hof, Hinterhöfe mit Wäscheleinen                                                         | Frau trägt Kohle (Mrs. Brody), Wäscheleine                                     |
| D2 Werkstor        | 48–63 / 15–29 | Eingang zum Werk                | Werkhof, Pförtnerhaus mit Mr. Pike, Werkstor als Schiebetor                                                                 | Schichtwechsel (Gruppen), **Stahlperle** im Rinnstein (`fundStahlperle`)        |
| E2 Halteplatz      | 64–79 / 15–29 | Werksverkehr                    | Werksbus-Halteplatz im Werkhof (Platzhalter Akt 3), Lagerplatz, Schranke der Werkszufahrt Ost                               | Schild an der Schranke, Gabelstapler (Belebung)                                |
| A3 Brücke          | 0–15 / 30–44  | Ankunft mit dem Bus             | Stahlbrücke mit Nieten „J. H.“, Haltestelle, Grünstreifen am Kanal, Lok-Denkmal am Platz                                    | Nieten (`nietenBruecke`), **Essensmarke** unter der Haltestellenbank           |
| B3 Alter Bahnhof   | 16–31 / 30–44 | Geschichte der Stadt            | Rückseite des alten Bahnhofs zur Hauptstraße, Uhrturm, Bahnhofstraße, Museumstür auf der Platzseite                         | Uhrturm (Sichtachse), Mr. Flores mit den Tauben am Platz                       |
| C3 Kirche          | 32–47 / 30–44 | Stille                          | Kirche St. Barbara (Schutzpatronin der Hütten- und Bergleute), Kirchgasse                                                   | Barbara-Figur über der Tür mit Grubenlampe (Ansehen)                           |
| D3 Parkplatz       | 48–63 / 30–44 | Schicht kommt, Schicht geht     | Parkplatz der Schichtarbeiter hinter Hecke mit Pollern, Weg über den Platz zum Bahnübergang                                 | Big Joes Pickup mit Kranhaken-Anhänger (`pickup`, Ansehen)                     |
| E3 Schranke        | 64–79 / 30–44 | Ende der Straße                 | Hauptstraße bis zur Schranke, Parkplatzende, Platz am Bahnsteig endet am Zaun                                               | Lieferwagen wartet an der Schranke (Belebung)                                  |
| A4 Eisenbahnbrücke | 0–15 / 45–59  | Gleise über dem Wasser          | Eisenbahnbrücke über den Kanal, Kanal nach Süden, Brachland                                                                 | altes Formsignal am Gleis, Güterzug fährt vorbei (Belebung)                    |
| B4 Lokschuppen     | 16–31 / 45–59 | Ruine                           | Gleise, Lokschuppen-Ruine (Kulisse, dachlos), Schotter, Löwenzahn                                                           | Fledermäuse am Abend (Tönung Abend)                                            |
| C4 Güterschuppen   | 32–47 / 45–59 | Fracht                          | Gleise, Güterschuppen mit Laderampe, Kisten und Fässer gruppiert                                                            | Kreidezahlen an der Rampe (Ansehen), Rangierer pfeift                          |
| D4 Gus             | 48–63 / 45–59 | Pause am Güterbahnhof           | Bahnübergang (Andreaskreuz, Umlaufgitter), Kabeltrommeln, Gus auf der umgedrehten Trommel                                   | Gus (Szene 45), Thermosflasche und Uhr auf der Trommel                         |
| E4 Steinbruchweg   | 64–79 / 45–59 | Abstecher                       | Stellwerk, Steinbruchweg mit zwei Knicken, Gittertor „Steinbruch – stillgelegt – Betreten auf eigene Gefahr“ (76, 57–58)    | Tor (Sichtachse), Ausblick auf die Steinbruchkante hinter dem Tor             |

**Laufzeit:** Hauptweg Treppe → Gasse → Hauptstraße → Werkstor etwa 62 Kacheln (18 s), zur
Haltestelle weitere 12 (zusammen 21 s). Quer über die Hauptstraße 80 Kacheln, 23 s. Liegt im
Rahmen 17–23 s.

### 1.3 Gebäude und Maße

| Gebäude                             | Lage außen (Spalten / Reihen), Tür                                                          | Fassade                                                         | Innen (7a.2)                                                                      | Begehbar   |
| ----------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------- |
| Reihenhaus Nr. 10, Oma Ruth (Eck)   | 38–46 / 4–10, Haustür (42, 10) in der Südfassade (4 von 9, 44 %)                            | Backstein, zweigeschossig, Spitzengardine, 9 breit              | `mamasZimmer` 18 × 12 (Wohnküche und Mamas Zimmer), Haustür Südwand Spalte 8     | ja         |
| Reihenhäuser Nr. 2 bis 8            | 12–17, 18–23, 26–31, 32–37 / 4–10, Türen in Reihe 10                                        | Backstein, je 6 breit, gleiche Bauart                           | –                                                                                 | nein       |
| Kantine des Stahlwerks              | 50–61 / 11–17 im Werkhof, Tür (56, 17) in der Südfassade (6 von 12, 50 %)                   | Flachbau, Backstein und Wellblech, 12 breit, Schild „Kantine“  | `kantine` 24 × 16 (Clubraum mit langen Tischen, großer Saal), Tür Südwand Spalte 12 | ja       |
| Umkleide des Werks                  | 66–72 / 11–17, Tür (69, 17) (3 von 7)                                                       | Flachbau, 7 breit                                               | `umkleide` 14 × 10, Tür Südwand Spalte 7                                          | ja         |
| Alter Bahnhof (Heimatmuseum)        | 18–30 / 34–41, Tür (24, 41) in der Südfassade zur Platzseite (6 von 13), Uhrturm über der Tür | Backstein 1870, 13 breit, Uhrturm                              | `museum` 26 × 14 (alte Schalterhalle), Tür Südwand Spalte 13                      | ja         |
| Eisenwaren Edna                     | 17–23 / 18–27, Verkaufsfenster (20, 27) in der Südfassade                                   | Backstein, 7 breit, Markise über dem Fenster                    | –                                                                                 | Kulisse (Fenster) |
| Kneipe „Zum Hochofen“               | 26–34 / 18–27, Tür (30, 27)                                                                 | Backstein, 9 breit, Leuchtschild                                | –                                                                                 | nein       |
| Kohlenhandlung                      | 36–45 / 18–27, Hoftor (40–41, 27), Kohlenhaufen im Hof 36–45 / 16–17                        | Holzschuppen und Bürohaus, 10 breit                             | –                                                                                 | nein       |
| Kirche St. Barbara                  | 33–42 / 33–41, Tür (37, 41) zur Platzseite                                                  | Backstein, 10 breit, Glockenturm                                | –                                                                                 | nein       |
| Pförtnerhaus                        | 61–63 / 23–26, Schiebefenster zum Tor                                                       | Flachbau, 3 breit                                               | –                                                                                 | Kulisse    |
| Werkshallen                         | 48–79 / 0–9                                                                                 | Hallen mit Sheddach, zwei Schornsteine (52, 0) und (58, 0)     | –                                                                                 | Kulisse    |
| Kanalmeisterei                      | 13–16 / 19–23                                                                               | Holzschuppen, 4 breit                                           | –                                                                                 | Kulisse    |
| Güterschuppen, Stellwerk, Lokschuppen-Ruine | 36–47 / 52–57; 66–69 / 52–56; 18–30 / 53–58                                         | Backstein und Holz                                              | –                                                                                 | Kulisse    |
| Haltestelle                         | Schilder (12, 32) und (15, 32), Wartehäuschen 12–15 / 33–34, offene Seite nach Norden       | Glas und Stahl, 4 breit                                         | –                                                                                 | Kulisse    |

Regel wie in Maple Falls und Cedar Creek: Die Fassade ist halb so breit wie das Erdgeschoss innen,
die Tür sitzt außen und innen an derselben relativen Stelle (±1 Kachel). Ausnahme: Der alte
Bahnhof hat 13 Kacheln Fassade, innen 26. Gebäude südlich der Hauptstraße zeigen ihre Schauseite mit
Tür nach Süden zum Platz am alten Bahnsteig; zur Hauptstraße zeigen sie Rückseiten mit Fenstern. Das
ist ehrlich: Der Bahnhof wurde für die Reisenden auf dem Bahnsteig gebaut, nicht für die Straße.

### 1.4 Nebenort N3: Alter Steinbruch (`steinbruch`)

Neuer Ort mit `art: "nebenort"` (Vorschlag für die Kennung und den Wert; N1 und N2 brauchen dieselbe
Entscheidung). Zwei Karten. Laufzeit: Zufahrt und Grube etwa 100 Kacheln (29 s), der Stollen etwa 45
(13 s). Das ist ein Abstecher nach 13 („wie ein halber Weg“), weil der Steinbruch selbst das Ziel ist.

**Grube `steinbruch.grube`, 70 × 50** (Höhle und Gelände nach 7a.2: 1,5 bis 2 mal Pokémon). Die
Zufahrt (Schotter, zwei Felder) kommt am **Westrand** in den Reihen 6–7 an, läuft oben an der
Bruchkante nach Osten (Reihen 6–8, Spalten 0–40), an Hargroves Bude vorbei, knickt bei Spalte 42 nach
Süden und fällt in zwei Serpentinen (Spalten 42–50, Reihen 9–24) auf die **Sohle** (Reihen 25–49).
Die Sohle ist Schotter und Fels, mit dem **Wasserloch** (Teich, rundum geschlossen, Spalten 12–32,
Reihen 30–42; der Himmel spiegelt sich), einem **Lorengleis** vom Stollenmund im Südosten über drei
Weichen zur alten **Brechanlage** im Nordwesten der Sohle (Spalten 4–10, Reihen 25–31), der
**Graffiti-Wand** von 1980 an der Felswand im Nordosten der Sohle (Spalten 60–68, Reihe 26) und dem **Stollenmund**
(Spalten 56–58, Reihen 40–42, Holzrahmen, Schild „Stollen 2 – ohne Licht Lebensgefahr“). Felswände
schließen Nord-, Ost- und Südrand; der Westrand ist oberhalb der Zufahrt Fels, unterhalb Wand.

| Abschnitt      | Bereich (Spalten / Reihen) | Thema                 | Zum Entdecken                                                                                                   |
| -------------- | -------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------- |
| G1 Zufahrt     | 0–23 / 0–24                | Ankunft an der Kante  | Kette über der alten Zufahrt mit Schild „Hargrove & Söhne, gegr. 1868“ (Ansehen), Birken am Rand                |
| G2 Aussicht    | 24–41 / 0–24               | Blick in die Tiefe    | Aussichtspunkt mit Geländer (26–28, 9–10), Lena fotografiert; `aussichtGrube`                                   |
| G3 Bude        | 42–69 / 0–24               | Hargroves Reich       | Vorarbeiterbude (52–58, 3–8) mit Bank davor, Mr. Hargrove; Serpentinen hinunter                                 |
| G4 Brechanlage | 0–23 / 25–49               | Rost                  | Brechanlage (Kulisse), Ende des Lorengleises mit Prellbock                                                      |
| G5 Wasserloch  | 24–45 / 25–49              | Spiegel               | Wasserloch mit Felsrand, eine Libelle; Steine zum Hüpfen am Ufer (Ansehen)                                      |
| G6 Stollenmund | 46–69 / 25–49              | Dunkel                | Lorengleis mit drei Weichen (Lorenbahn N-ST1), Stollenmund (S4), zwei Kinder mit Taschenlampen, Graffiti-Wand    |

**Stollen `steinbruch.stollen`, 40 × 24** (Höhle, eine Etage; Pokémon 20–40 × 15–36). Eingang am
**Südrand** (Spalten 18–19, Reihe 23), der Gang (zwei Felder, Stützbalken alle vier Felder, Gleis in
der Mitte) läuft nach Norden, gabelt sich bei Reihe 14: links ein Seitenstollen nach Nordwesten zur
**Nische** (4–7, 3–5, Mamas Versteck, nach Szene 43), rechts der Hauptgang zur **Kaverne** (Hallraum,
24–36, 2–10) mit dem Echo. Feste Tönung „dunkel“; mit Laterne ein Lichtkreis von vier Feldern um den
Helden (Technik aus 13: `hatLaterne`).

### 1.5 Platzhalter für Rückkehr und Weltzustand (13, Abschnitte 7.2 und 7.4)

- `ironwood.aussen`: **Werksbus-Halteplatz** im Werkhof (66–74, 21–25), leer bis Akt 3; **Gittertor
  zum Steinbruch** hinter dem Güterbahnhof (76, 57–58); **Schild am Werkstor** „Kantine vermietet:
  Trainingszentrum Perfect Move“ (Objekt mit Bedingung, ab Szene 49); **Schnee** als Objektebene
  (Dächer, Gehwege, ab Szene 50); **Lastkahn** am Kai (Objekt, nach der Öffnung, 1.6);
  **Logo von Perfect Move** über der Kantinentür außen (Akt 3).
- `ironwood.kantine`: freie Wandfläche über der Essensausgabe für das Logo von Perfect Move (Objekt,
  Akt 3, später entfernt); Karton mit Pokalen an der Tür (Szene 49).
- `ironwood.museum`: Platz in der Vitrine rechts neben der Zeitung von 1858 für Brief und Umschlag
  (R5, Akt 3).
- `ironwood.umkleide`: freie Ecke für einen Klapptisch mit Brett (Akt 4: Hank trainiert Kinder).
- `steinbruch.stollen`: Nische mit losem Stein; die Blechdose mit Mamas Steckschach ist ein Objekt mit
  Bedingung `mamaSpielt` (Szene 43), vorher liegen dort nur Steine.
- `steinbruch.grube`: je Akt eine Kleinigkeit (13, 7.3): Akt 3 Eis am Rand des Wasserlochs, Akt 4
  Lena stellt ihr Buch auf der Bank vor der Bude aus.

### 1.6 Übergänge (Felder auf beiden Seiten)

| Von (Karte, Auslöser, Feld)                                         | Nach (Karte, Auslöser, Feld; Ankunft)                                                                                       | Lage, Bedingung                                                                                                                                              |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| aussen `kanalweg` Nordrand (24–25, 0); Ankunft (24, 1), Blick Süden | wegRivertonIronwood.bruecke `weiterIronwood` Südrand, Spalten 24–25 (Vorschlag an mittel-3, siehe unten)                     | Treppe am Ende des Abhangs, zwei Felder; Dialog `ankunft_zu_fuss` bleibt an `weiterIronwood`                                                                |
| aussen `bushaltestelle` (14, 32), Start                             | –                                                                                                                           | Ankunft mit dem Bus (Schnellreise, Szene 43 mit Mama, Rückkehr)                                                                                              |
| aussen `busRiverton` (12, 32), Dialog, Reise                        | Haltestelle in Riverton (Auslöser bei mittel-3)                                                                             | erst nach `besuchtIronwood`; 10 Münzen, nach der Clubnadel von Ironwood frei (Bibel 10.3, W2)                                                               |
| aussen `busSiliconBay` (15, 32), Dialog, Reise                      | wegIronwoodSilicon.raststaette `zurueckIronwood` (Haltestelle der Raststätte)                                               | erst nach Szene 50 (`akt2.einladung`); vorher sagt der Busfahrer, ohne Einladung lasse man niemanden aus dem Bus (`silicon-bay.md`)                           |
| aussen `kantineTuer` (56, 17)                                       | kantine `kantineAusgang` (Südwand, Spalte 12); Ankunft (12, 14)                                                             | Südfassade 50 % ↔ Südwand 50 %; offen erst nach Szene 38 (Bedingung `verbotGesehen`, neu), vorher Dialog des Pförtners                                       |
| aussen `umkleideTuer` (69, 17)                                      | umkleide `umkleideAusgang` (Südwand, Spalte 7); Ankunft (7, 8)                                                              | Südfassade 43 % ↔ Südwand 50 %                                                                                                                              |
| aussen `haustuerRuth` (42, 10)                                      | mamasZimmer `zimmerAusgang` (Südwand, Spalte 8); Ankunft (8, 10)                                                            | Südfassade 44 % ↔ Südwand 44 %; wie heute `wenn: elmStreetBekannt` (Szene 39)                                                                                |
| aussen `museumTuer` (24, 41), Platzseite                            | museum `museumAusgang` (Südwand, Spalte 13); Ankunft (13, 12)                                                               | Südfassade 46 % ↔ Südwand 50 %                                                                                                                              |
| aussen `steinbruch` (neu) Ostrand (79, 57–58); Ankunft (78, 57)     | steinbruch.grube `zurueckIronwood` (neu) Westrand (0, 6–7); Ankunft (1, 6)                                                  | Steinbruchweg durch das offene Gittertor; Schotter, zwei Felder                                                                                              |
| steinbruch.grube `stollen` (neu), Stollenmund (57, 42)              | steinbruch.stollen `stollenAusgang` (neu) Südrand (18–19, 23); Ankunft (18, 22), Blick Norden                               | S4: `wenn: hatLaterne`; ohne Laterne Dialog „Zu dunkel. Die Kinder trauen sich auch nur bis hierher.“                                                        |
| aussen `anleger` (neu, 12, 22), Dialog, Reise                       | Anleger in Lockport und Riverton (Lastkahn, mittel-3)                                                                       | nach Szene 39 (Big Joe kennt den Kapitän, 13 §3); 5 Münzen                                                                                                   |

**Abstimmung mit mittel-3 (W3 ↔ Ironwood):** Vorschlag: Die Brückenkarte von W3 endet am **Südrand**
mit dem Weg in den Spalten 24–25 (Ende des Abhangs, Treppenansatz), der Kanal verlässt sie am Südrand
in den Spalten 4–9 (Ufer 3 und 10), damit er in Ironwood an derselben Stelle über den Nordrand
hereinkommt. Läuft die Brückenkarte von West nach Ost, verlege ich die Ankunft an den Westrand von
Ironwood; das ist auf meiner Seite mit einer Zeile erledigt. Das Ergebnis der Abstimmung steht in
der Fußnote dieses Abschnitts, sobald mittel-3 geantwortet hat.

Änderungen in `orte.json` für den Haupt-Chat: neue Auslöser `steinbruch` und `anleger` auf
`ironwood.aussen`, Bedingung `verbotGesehen` auf `kantineTuer` (Dialog am Pförtnerhaus), neuer Ort
`steinbruch` mit den Karten `steinbruch.grube` und `steinbruch.stollen` und den Auslösern
`zurueckIronwood`, `stollen` (`wenn: hatLaterne`) und `stollenAusgang`; dazu die Auslöser aus 14
(Abschnitt 6).

## 2. Ortsbild

Wer von Riverton kommt, sieht Ironwood zuerst von oben. Am Ende des Kanalwegs fällt der Abhang
steil ab, eine Steintreppe mit Eisengeländer führt hinunter, und darunter liegt die Stadt in einem
grauen Tal, als hätte jemand sie in eine Schüssel gesetzt. Rechts arbeitet das Werk: lange Hallen
mit Sägezahndächern, zwei Schornsteine, aus denen Rauch steigt, der sich nicht entscheiden kann, ob
er nach Riverton oder nach Silicon Bay will. Manchmal fliegen Funken auf, und unten auf dem
Lagerplatz quietscht ein Portalkran, der Stahlträger von einem Stapel auf den anderen hebt. Links
liegt der Kanal, schwarz und still, und am Ende der Gasse, die von der Treppe gerade nach unten führt,
steht ein Uhrturm, dessen Zeiger seit Jahren auf zwanzig nach vier stehen.

Unten an der Treppe beginnt die Elm Street. Reihenhäuser aus dunkelrotem Backstein stehen dicht an
dicht, jedes mit zwei Stufen vor der Tür und einem Fenster, hinter dem ein Fernseher flackert. Es
riecht nach Kohle, denn in der Elm Street heizen noch viele mit dem Ofen; eine alte Frau trägt zwei
Eimer über den Gehweg und bleibt bei jedem dritten Schritt stehen. Auf dem Gehweg haben Kinder mit
Kreide ein Schachbrett gemalt, krumm, mit einem Feld zu viel, und spielen mit Kronkorken. Das letzte
Haus vor dem Werkszaun ist ein Eckhaus mit einer weißen Spitzengardine, die so sauber ist, dass sie
in dieser Straße auffällt. Hinter dem Zaun summt das Werk Tag und Nacht.

Die Hauptstraße ist breit und rußig. Bei Edna gibt es alles, was hält: Schrauben in Gläsern, Seile,
Laternen und neuerdings Fahrradteile, verkauft durch ein Fenster mit grüner Markise, hinter dem eine
Frau mit Brille sitzt und jeden Satz mit „Das hält“ beendet. Daneben die Kneipe „Zum Hochofen“, deren
Leuchtschild nur noch „Zum Hoch“ zeigt, und die Kohlenhandlung mit einem schwarzen Berg im Hof.
Gegenüber steht der alte Bahnhof mit dem Rücken zur Straße. Personenzüge halten hier nicht mehr;
die Bahnsteigseite ist ein gepflasterter Platz geworden, mit Bänken, Laternen und einer kleinen
Dampflok auf einem Sockel, auf die die Kinder klettern, obwohl ein Schild es verbietet. Im
Bahnhofsgebäude hat Mr. Teague das Heimatmuseum eingerichtet: alte Schalter, eine Standuhr, die
lauter tickt als nötig, und Postsäcke, die seit hundertfünfzig Jahren niemand geöffnet hat.

Am Werkstor sitzt der Pförtner in seinem Häuschen und schreibt jeden auf, der hinein will. Zum
Schichtwechsel heult eine Sirene, das Schiebetor rollt zur Seite, und dann kommen sie: Männer und
Frauen in grauen Jacken, mit Henkelmännern und Helmen unter dem Arm, sie reden laut und lachen über
etwas, das man nur versteht, wenn man dabei war. Im Werkhof steht die Kantine, ein flacher Bau aus
Backstein und Wellblech. Drinnen ist es warm. Ein großer Ofen bullert in der Ecke, auf ihm schläft
die Werkskatze, an langen Tischen trinken Leute Kaffee aus Bechern mit Beulen, und an einem Tisch
nahe am Ofen liegt ein Schachbrett aus Stahl, geschweißt, mit Figuren, die man mit zwei Fingern kaum
heben kann. Im Pokalregal an der Wand fehlt ein Pokal. Niemand spricht darüber.

Hinter dem alten Bahnhof liegen die Gleise. Güterzüge rollen langsam vorbei, und wenn sie halten,
setzt sich am Güterschuppen ein Rangierer auf eine umgedrehte Kabeltrommel, stellt eine Schachuhr
neben sein Sandwich und wartet. Weiter östlich steht die Ruine eines Lokschuppens ohne Dach, in der
abends die Fledermäuse wohnen, und hinter dem Stellwerk führt ein Schotterweg zu einem Gittertor.
Dahinter, man sieht es schon von weitem, bricht das Land ab: der alte Steinbruch, aus dem einmal der
Granit für die Brücken dieser Stadt kam.

Der Steinbruch ist eine Welt für sich. Oben an der Kante steht eine Bretterbude mit einer Bank davor,
auf der ein alter Vorarbeiter sitzt und Steine ansieht, als würden sie ihm antworten. Unten liegt
ein Wasserloch, so ruhig, dass der Himmel darin doppelt ist. Rostige Loren stehen auf einem Gleis,
das zu einem schwarzen Loch in der Felswand führt, und an der Wand daneben haben die Kinder der
Stahlwerker 1980 ihre Namen gesprüht. Es ist kühl hier, auch wenn oben die Sonne scheint, und jedes
Geräusch kommt zweimal zurück.

Im Spätherbst wird Ironwood dunkel, bevor man nach Hause will. Die Laternen gehen an, das Werk glüht
orange in den Himmel, und an dem Abend, an dem Victor über die Brücke kommt, fällt der erste Schnee
auf die Nieten mit den Buchstaben „J. H.“.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

Figuren, kleine Aufgaben und Funde aus `14_Akt2_Leben_teil2.md` kommen zu dieser Tabelle hinzu; hier
stehen die Szenen der Story-Bibel und das Wegenetz.

| Karte       | Szenen                         | Figuren                                                                                       | Auslöser und Gegenstände                                                                                                                                                      | Belebung                                                                  |
| ----------- | ------------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| aussen      | 40 (Ankunft), 42, 45, 49, 50, 51, 51a, R5 | Gus, Edna (Fenster), Victor, Graham Hale, Big Joe (Szene 49), Mama, Juno; Figuren aus 14 | `kanalweg`, `bushaltestelle`, `busRiverton`, `busSiliconBay`, `kantineTuer`, `haustuerRuth`, `umkleideTuer`, `museumTuer`, `eisenwarenfenster`, `kreidebrett`; neu `steinbruch`, `anleger`, `nietenBruecke` | Schichtwechsel, Frau trägt Kohle, Kreidekinder, Taubenmann; Krähen, Tauben, Fledermäuse; Rauch und Funken |
| kantine     | 39, 43, 44, 46, 48             | Big Joe, Hank, Priya, Mama, Juno; Kantinenkoch (14)                                           | `kantineAusgang`, `pokalregal`, `stahlbrett`; Schichtplan, Kaffeemaschine mit Beule, Foto der Werksmannschaft (09)                                                           | Werkskatze am Ofen                                                        |
| mamasZimmer | 39, 39a, 43                    | Oma Ruth, Juno                                                                                | `zimmerAusgang`, `medaille`, `partieformular2001`; Foto 2001 (Fund `foto2001`), Turnierheft (Schublade)                                                                       | –                                                                         |
| umkleide    | – (Fund)                       | –                                                                                             | `umkleideAusgang`, `schliessfach` (Fund `holzturm`, Laterne)                                                                                                                  | tropfende Dusche (Klang)                                                  |
| museum      | 41, 47, R5                     | Mr. Teague                                                                                    | `museumAusgang`, `postsack`, `vitrine1858`, `fundGlasfunke`                                                                                                                   | Standuhr (Klang)                                                          |
| steinbruch  | N3 (13 §3)                     | Mr. Hargrove, Lena, zwei Stahlwerkerkinder                                                    | `zurueckIronwood`, `stollen` (S4), `stollenAusgang`, Lorenbahn, Echo, Mamas Versteck (nach Szene 43)                                                                          | Libelle, Krähe auf der Kante                                              |

**Sperren und ihre Öffnung, geprüft gegen den Bedarf der Hauptgeschichte:**

| Sperre                                  | Öffnet                                       | Gebraucht ab                    | Prüfung                                                                                         |
| --------------------------------------- | -------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| W3 (Riverton `kanalweg`)                | `nadelRiverton` (heute)                      | Szene 39                        | Szene 38 folgt auf die Nadel von Riverton; also offen.                                          |
| Kantinentür                             | nach Szene 38 (`verbotGesehen`)              | Szene 39 (erster Kantinenbesuch) | öffnet vorher. Vor Szene 38: Mr. Pike, „Gäste erst zum Turnier, Kumpel. Der Zettel hängt noch nicht.“ |
| Haus von Oma Ruth                       | `elmStreetBekannt` (Big Joe, Szene 39)       | Szene 39, zweiter Teil          | setzt dieselbe Szene; also offen.                                                               |
| Bus nach Silicon Bay                    | nach Szene 50 (`akt2.einladung`)             | Szene 51                        | öffnet vorher.                                                                                  |
| Bus nach Riverton                       | `besuchtIronwood`                            | nie (Schnellreise)              | Rückweg zu Fuß über W3 geht immer.                                                              |
| Lastkahn am Anleger                     | nach Szene 39                                | nie (Schnellreise)              | freiwillig.                                                                                     |
| Stollen (S4)                            | Laterne (Edna, 60 Münzen)                    | nie (Nebenort)                  | freiwillig; Laterne nach 11 mit ≈ 420 Münzen bezahlbar.                                         |
| Mamas Versteck im Stollen               | `mamaSpielt` (Szene 43) und Laterne          | nie                             | erst nach Szene 43, damit nichts von Mamas Geschichte vorher herauskommt (Befund 3).            |

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

| Element                                  | Entscheidung                                                                                                     | Grund                                                                                                                                                       |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Größe                                    | 80 × 60 statt 32 × 24                                                                                            | `KARTENREGELN.md` 7a.2 (mittlere Stadt 60–80 × 50–60); die Stadt hat vier Bereiche (Werk, Elm Street, Hauptstraße, Bahn).                                   |
| Ankunft zu Fuß an der Bushaltestelle     | geändert: Ankunft über die Treppe am Nordrand; der Bus hält an der Brücke                                        | Wege laufen über den Rand weiter (Regel 5.1); wer läuft, kommt nicht aus dem Bus. Wie in Cedar Creek.                                                        |
| Brücke mit Nieten „J. H.“                | bleibt als Stahlbrücke der Schnellstraße über den Kanal, mit Gehweg bis zur Brückenmitte                         | Szene 50 (Brücke und Haltestelle an der Schnellstraße); Ambrose sieht dort die Nieten. Die Eisenbrücke auf W3 trägt dieselben Initialen (mittel-3).        |
| Schnellstraße zu Fuß                     | entfällt: Gehweg endet an der Brücke, Schild „Kraftfahrstraße“                                                   | Bibel 19.1: nach Silicon Bay nur mit dem Bus bis zur Raststätte; das Schild erklärt den geschlossenen Westrand.                                             |
| Kantine im Werk                          | bleibt, im Werkhof hinter dem Werkstor                                                                           | Szene 49 spielt am Werkstor; das Werk vermietet die Kantine. Der Weg durchs Tor macht das sichtbar.                                                         |
| Umkleide                                 | bleibt im Werkhof neben der Kantine                                                                              | Bibel 10.4 („Umkleide des Werks“).                                                                                                                         |
| Elm Street                               | bleibt, als Wohnstraße unter dem Abhang mit sechs Reihenhäusern; Oma Ruth im Eckhaus am Werkszaun                | Bibel 9.3 und Szene 39; Reihenhäuser stehen an der Straße (Regel 5.3), Stufen statt Vorgarten (Stadt, Regel 9.3.4).                                         |
| Eisenwaren mit Verkaufsfenster           | bleibt, an der Hauptstraße, Kulisse mit Fenster                                                                  | Bibel 9.3 und 42 (`oeffneLaden`); kein Innenraum nötig.                                                                                                     |
| Güterbahnhof mit Gus                     | bleibt südlich der Gleise; Gus auf der umgedrehten Kabeltrommel                                                  | Szene 45, 09 (5.5).                                                                                                                                        |
| Alter Bahnhof mit Museum                 | bleibt; Tür zur Platzseite, der alte Bahnsteig ist ein Platz                                                     | Bibel 9.3 (Mr. Teague, alter Bahnhof); Schauseite nach Süden, damit die Tür im Bild sichtbar ist.                                                          |
| Kinder malen Bretter mit Kreide          | bleibt, auf dem Gehweg Süd der Elm Street (`kreidebrett`); die Kinder bekommen Namen (14)                         | 09 (5.5 und 4a).                                                                                                                                           |
| Kneipe (09, 4a)                          | bleibt als Kulisse „Zum Hochofen“                                                                                | Wirtschaft der Stadt (4a); kein Innenraum, damit Ironwood bei fünf Innenräumen bleibt.                                                                     |
| Mann füttert Tauben (09, 4a)             | bleibt, am Platz bei der Lok (Mr. Flores, 14)                                                                    | 4a; der Platz am alten Bahnsteig braucht eine ruhige Figur.                                                                                                |
| Kanal und Lastkahn                       | neu in Ironwood: Kanal am Westrand, Anleger am Kai                                                               | 13 §3 (Lastkahn bis Ironwood, Big Joe kennt den Kapitän); W3 ist ein Kanalweg.                                                                             |
| Tor zum Steinbruch hinter dem Bahnhof    | neu, am Ostrand hinter dem Güterbahnhof                                                                          | 13 §3 (N3 „hinter dem Bahnhof“) und 7.4.                                                                                                                   |
| Kirche St. Barbara, Parkplatz            | neu, Kulisse                                                                                                     | füllt den Süden der Hauptstraße mit Inhalt (Regel 9.9); Barbara ist die Schutzpatronin der Hütten- und Bergleute, passt zu Werk und Steinbruch.             |
| Haltebucht Werksbus                      | im Werkhof statt an der Straße                                                                                   | 13 §7.4; so bleibt der Gehweg durchgehend (Regel 9.2.1).                                                                                                   |
| Erster Schnee                            | Objektebene Schnee ab Szene 50, Tönung Abend                                                                     | Bibel 10.4, Szene 50; keine Uhrzeit (13, Grundsatz 7).                                                                                                     |

## 4. Bühnenbilder

Feld = linke obere Kachel (Spalte, Reihe). Möbel nach dem Katalog; wo ein Bild fehlen könnte, steht
„Offen“. Die Szenen für den Kartenbauer entstehen nach der Durchsicht.

### 4.1 Außenkarte (`ironwood.aussen`)

**Größe** 80 × 60. **Boden:** Asphalt mit Mittellinie (Hauptstraße), Gehwege aus grauen Platten mit
Bordstein beidseitig (Regel 9.2.1), Elm Street Asphalt mit schmalen Gehwegen, Werkhof Beton, Platz
am alten Bahnsteig Kopfsteinpflaster, Gleise auf Schotter, Brachland Schotter mit Gras und
Löwenzahn, Kanal Wasser mit Steinufer. **Rand** wie in 1.1. **Grundtönung** Herbsttag, grau;
Szene 50 Abend mit Schnee.

| Abschnitt | Inventar (Gegenstand, Feld, Ausrichtung, Material und Zustand, Zweck)                                                                                                                                                                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1        | Kanal 4–9 / 0–59 mit Steinufer 3 und 10; Eisengeländer am Ostufer 10 / 0–11; Brombeerbüsche am Hang 11–15 / 0–3; Elm Street Nr. 2 (12–17 / 4–10), Stufen (14, 11), Mülltonne am Haus (17, 11); Laterne (13, 12)                                                                                       |
| B1        | Treppe 24–25 / 0–3, Steinstufen mit Geländer beidseitig, Antritt oben frei; Hangbüsche und Felsgruppen 16–23 und 26–31 / 0–3; Nr. 4 (18–23), Nr. 6 (26–31), je zwei Stufen und ein Blumenkübel neben der Tür; Laterne (25, 12), Bank am Treppenfuß (22, 12, zur Straße)                                 |
| C1        | Nr. 8 (32–37) mit zwei Kohleneimern neben den Stufen; Eckhaus Nr. 10 (38–46) mit Spitzengardine, Briefkasten an der Hauswand (43, 11), zwei Blumenkübel; Werkspforte im Zaun (47, 13–14) mit Schild (46, 12); Laterne (39, 12)                                                                          |
| D1        | Werkshallen 48–63 / 0–9 (Sheddach, Kulisse), Schornsteine (52, 0) und (58, 0) mit Rauch und Funken (Animation); Kantine 50–61 / 11–17, Tür (56, 17) mit Vordach, Fußmatte (56, 18), Bank an der Fassade (52, 18), Fahrradständer (59, 18)                                                              |
| E1        | Halle 64–79 / 0–9; Portalkran über dem Lagerplatz 72–79 / 10–20 (Kulisse mit Kabine), Stahlträgerbündel (73, 14), (76, 17); Umkleide 66–72 / 11–17, Tür (69, 17), Fußmatte                                                                                                                         |
| A2        | Kai 11–16 / 18–27 aus Steinplatten, drei Poller (11, 19), (11, 23), (11, 26), Rettungsring am Pfahl (12, 21), Kanalmeisterei 13–16 / 19–23 (Holzschuppen), Schild „Anleger“ (14, 24); Liegeplatz des Lastkahns im Wasser 5–9 / 19–25 (Objekt, ohne Kollision für das Wasser)                          |
| B2        | Kreidebrett auf dem Gehweg Süd der Elm Street (28–31, 15, Bodenbild) mit `kreidebrett` (30, 15); Hinterhöfe 17–23 und 26–34 / 16–17 mit Holzzaun, Wäscheleine, Mülltonnen; Eisenwaren 17–23 / 18–27, Markise über dem Fenster (20, 26), Schaukasten mit Laternen (18, 27); Gasse 24–25 / 16–27 mit Laterne (24, 20); Kneipe 26–34 / 18–27 |
| C2        | Kohlenhandlung 36–45 / 18–27 mit Hoftor (40–41, 27), Kohlenhaufen 37–44 / 16–17 hinter Bretterwand, Schubkarre (36, 17), Waage (44, 17); Laterne (41, 28)                                                                                                                                         |
| D2        | Werkszaun (Gitter) 47 / 0–27 und 48–79 / 27; Werkstor 56–60 / 27 (Schiebetor, offen); Pförtnerhaus 61–63 / 23–26 mit Schiebefenster zum Tor, Schranke (55, 26); Werkhof Beton; Feuerlöscher an der Kantinenwand (60, 17); Stahlperle im Rinnstein (58, 28)                                          |
| E2        | Werksbus-Halteplatz 66–74 / 21–25 (Bodenmarkierung, leer), Gabelstapler (77, 23, fährt hin und her), Stapel Paletten (65, 20); Schranke (75, 29–31) mit Schild „Werkszufahrt Ost – nur Lieferverkehr“ (74, 28)                                                                                     |
| A3        | Stahlbrücke 3–10 / 29–32, genietetes Fachwerk, Gehweg Süd über der Brücke bis (3, 32), Schild „Kraftfahrstraße – keine Fußgänger“ (2, 32), Leitplanke 0–2 / 28 und 33; `nietenBruecke` am Geländer (6, 33); Haltestelle: Schild Linie Riverton (12, 32), Schild Fernlinie Silicon Bay (15, 32), Wartehäuschen 12–15 / 33–34 mit Bank, `bushaltestelle` (14, 32); Grünstreifen 11–15 / 35–41 mit zwei Linden in Baumscheiben; Lok auf Sockel 11–15 / 42–44 (Kulisse, Schild „Nicht klettern“ (13, 41)); der Ausgang der Bahnhofstraße (16–17, 42) bleibt frei |
| B3        | Alter Bahnhof 18–30 / 34–41, Rückseite mit hohen Fenstern zur Straße, Uhrturm (24, 34) über der Tür; Bahnhofstraße 16–17 / 33–41 (Pflaster); Museumstür (24, 41) mit zwei Laternen links und rechts (22, 42), (26, 42) und Schild „Heimatmuseum“ über der Tür; Bänke am Platz (20, 43), (28, 43), zum Platz |
| C3        | Kirchgasse 31–32 / 33–41; Kirche 33–42 / 33–41 mit Glockenturm, Barbara-Figur in einer Nische über der Tür (37, 39), Tür (37, 41); zwei Kegelbäume symmetrisch (34, 42), (40, 42); Laterne (44, 43)                                                                                              |
| D3        | Hecke mit Pollern 45–79 / 33 (Lücke 52–54 als Einfahrt); Parkplatz 45–79 / 34–41 mit Markierung, sechs Autos, Big Joes Pickup (56, 36) mit Kranhaken-Anhänger am Spiegel (`pickup` (56, 38)); Weg über den Platz 45–63 / 42–45                                                                       |
| E3        | Hauptstraße bis zur Schranke, Parkplatzende; Lieferwagen (72, 30) wartet (Belebung); Zaun am Platzende (66, 42–45)                                                                                                                                                                                 |
| A4        | Bahnsteigkante mit Geländer 11–61 / 45; Eisenbahnbrücke 3–10 / 46–51 (Fachwerk); Gleise 0–79 / 46–51 mit Zaun am Südrand der Gleise (Reihe 52, Lücke am Bahnübergang); Formsignal (13, 52)                                                                                                       |
| B4        | Lokschuppen-Ruine 18–30 / 53–58 (Mauern ohne Dach, Gras darin), Brachland mit Schotter, Löwenzahn, Steinen in Gruppen                                                                                                                                                                         |
| C4        | Güterschuppen 36–47 / 52–57 mit Laderampe 36–47 / 58, Kisten und Fässer gruppiert (36, 58), (45, 58); Kreidezahlen an der Rampe (`rampe`, (40, 58))                                                                                                                                              |
| D4        | Bahnübergang 62–63 / 45–52 mit Andreaskreuzen (61, 45), (64, 52) und Umlaufgittern; drei Kabeltrommeln (56, 54), (58, 56), (52, 55), auf der mittleren Gus (58, 55) mit Schachuhr; Container gestapelt 48–51 / 53–55                                                                              |
| E4        | Stellwerk 66–69 / 52–56 (Kulisse, Fenster oben); Steinbruchweg 62–63 / 52–56, dann 63–79 / 57–58 (Schotter); Gittertor (76, 57–58) mit Pfosten (76, 56) und (76, 59), offen mit Schild „Steinbruch Hargrove & Söhne – stillgelegt – Betreten auf eigene Gefahr“ (75, 56); Büsche dicht am Südrand                                     |

Kleinflora sparsam (Stadt): Löwenzahn und Gras in Fugen, Brombeeren am Hang, Linden und Kegelbäume
geordnet (Regel 9.8.3). **Belebung** (09, 3 und 4a): Rauch und Funken (Kachelanimation), Krähen auf
Trägern und Geländer (`fliegen`), Tauben am Platz (`folgen`), Fledermäuse am Abend; Statisten:
Schichtwechsel (Gruppe von vier, Werkstor ↔ Parkplatz, `wann: morgen, abend`), Frau mit Kohleneimern
(Mrs. Brody, Kohlenhof ↔ Elm Street), Kreidekinder, Mann mit Tauben (Mr. Flores), Gabelstapler im
Werkhof, Güterzug (Kulisse, fährt über Gleis 2).

### 4.2 Kantine, Clubraum des Werksclubs (`ironwood.kantine`)

**Größe:** 24 × 16 (großer Saal nach 7a.2; Clubkampf, Mamas Partie, Feier). Nordwand Reihen 0–2
weiß gefliest bis Brusthöhe, darüber Backstein; Boden graues Linoleum; Südwand Reihe 15 mit der
Doppeltür bei Spalte 12. Zwei Fenster in der Nordwand mit Blick auf die Hallen.

**Stimmung:** warm im kalten Werk; Ofen bullert, Kaffee, Eintopf, Metallgeruch an den Jacken.

**Laufwege:** Tür (12, 15) → Start (12, 14) → Mittelgang nach oben (Spalten 11–12 frei bis zur
Essensausgabe); links zu den langen Tischen der Schicht; rechts zum Clubtisch am Ofen und zu Big Joe.

| Zone         | Gegenstand                                                    | Feld                                         | Ausrichtung       | Material, Stil, Zustand        | Zweck                                                                    |
| ------------ | ------------------------------------------------------------- | -------------------------------------------- | ----------------- | ------------------------------ | ------------------------------------------------------------------------ |
| Nordwand     | Essensausgabe (Theke) mit Warmhaltebehältern                  | (2, 2), 7 × 2                                | Vorderseite unten | Edelstahl, gebraucht           | Kantine; Rocco dahinter (5, 1)                                           |
| Nordwand     | Kaffeemaschine mit Beule auf der Theke                        | (8, 2)                                       | –                 | Metall, alt                    | Ansehen `kaffeemaschine` (09)                                            |
| Nordwand     | freie Wandfläche über der Theke                               | Wandfläche (3–7, 1)                          | –                 | –                              | Platzhalter Logo Perfect Move (Akt 3)                                    |
| Nordwand     | Schichtplan an Pinnwand                                       | Wandfläche (10, 1)                           | –                 | Kork                           | Ansehen `schichtplan` (09)                                               |
| Nordwand     | Pokalregal mit Pokalen, eine Lücke                            | (13, 1), 4 breit                             | Vorderseite unten | Holz dunkel, gebraucht         | `pokalregal` (14, 3); die Lücke ist der Pokal von 2001 (Szene 39)       |
| Nordwand     | Foto der Werksmannschaft im Rahmen                            | Wandfläche (18, 1)                           | –                 | alt                            | Ansehen `fotoMannschaft` (09)                                            |
| Nordwand     | zwei Fenster                                                  | Wandfläche (11, 1), (20, 1)                  | –                 | Stahlrahmen                    | Licht                                                                    |
| Ostwand      | großer Kanonenofen mit Rohr, Kohleneimer daneben             | Ofen (21, 5), Eimer (22, 8)                  | –                 | Gusseisen, alt                 | Wärme; Werkskatze auf dem Teppich davor (20, 7), `sitzen`                |
| Mitte rechts | Clubtisch mit Big Joes Stahlbrett, vier gleiche Stühle        | Tisch (15, 6), 3 × 2; Stühle (14, 6), (18, 6), (15, 5), (16, 8) | zum Tisch | Holz, Stahlbrett geschweißt | `stahlbrett` (16, 6); Big Joe (18, 5)                                    |
| Mitte links  | zwei lange Tische der Schicht mit Bänken oben und unten       | Tische (2, 6) und (2, 10), je 7 × 1; Bänke Reihen 5, 7, 9, 11 | zum Tisch | Holz, gebraucht                | Hank (4, 9), Priya (7, 7); Mamas Partie an Tisch 2 (Szene 43)            |
| Mitte rechts | zweiter Clubtisch (Aufgabenreihen, Feier)                     | (15, 10), 3 × 2 mit vier Stühlen             | zum Tisch         | Holz                           | Reihen von Hank und Priya                                                |
| Südwand      | Garderobe mit Helmen und Jacken                               | (2, 13), 3 breit                             | –                 | Metall                         | Spuren von Leben                                                         |
| Ecke SO      | Getränkekühlschrank                                           | (22, 12)                                     | zeigt in den Raum | Metall, gebraucht              | Kantine                                                                  |
| Ecken        | Gummibaum, Stapel Henkelmänner auf einem Rollwagen            | (1, 4), (9, 12)                              | –                 | Pflanze; Metall                | Regel 4.4; N-IW2                                                         |
| Eingang      | Start                                                         | (12, 14)                                     | Blick nach oben   | –                              | Ankunft                                                                  |

Belebung: Werkskatze, Rocco wischt zwischen (3, 4) und (9, 4). Feier (Szene 44): Lichterkette als
Objektebene über den Tischen. Offen: Ein Kanonenofen ist im Katalog wahrscheinlich; ein Stahlbrett
nicht (ein dunkles Brett vertritt es).

### 4.3 Wohnküche und Mamas Zimmer (`ironwood.mamasZimmer`)

**Größe:** 18 × 12 (zwei Räume nebeneinander nach 7a.2: bis 20 × 13). Links Oma Ruths **Wohnküche**
(Spalten 0–9), rechts **Mamas Zimmer** (Spalten 11–17) hinter einer Innenwand (Spalte 10) mit Tür bei
(10, 7) (Türbild, Regel 2.2: Zimmer endet). Nordwand Reihen 0–2 Tapete (Wohnküche mit Blümchen,
Mamas Zimmer hellblau), Boden Dielen, Südwand Reihe 11 mit der Haustür bei Spalte 8.

**Stimmung:** Wohnküche warm und voll, Mamas Zimmer still und aufgeräumt, „falls sie mal wieder
schlafen will“.

**Laufwege:** Tür (8, 11) → Start (8, 10) → nach oben zum Küchentisch; nach rechts durch die Tür
(10, 7) in Mamas Zimmer.

| Zone             | Gegenstand                                                     | Feld                        | Ausrichtung        | Material, Stil, Zustand   | Zweck                                                                    |
| ---------------- | -------------------------------------------------------------- | --------------------------- | ------------------ | ------------------------- | ------------------------------------------------------------------------ |
| Wohnküche Nord   | Küchenzeile mit Herd, Spüle, Hängeschrank                      | (1, 1), 5 × 2               | Vorderseite unten  | Holz hell, alt, gepflegt  | Küche                                                                    |
| Wohnküche Nord   | Fenster mit Gardine                                            | Wandfläche (7, 1)           | –                  | Holz, Spitze              | Licht                                                                    |
| Wohnküche Mitte  | Küchentisch mit Wachstuch, vier gleiche Stühle                 | Tisch (3, 5), 2 × 2         | Stühle zum Tisch   | Holz, gebraucht           | Oma Ruth (5, 7) empfängt hier                                            |
| Wohnküche West   | Telefon mit Schnur auf einem Tischchen, Sessel                 | Tischchen (1, 8), Sessel (2, 8) | Sessel zum Raum | Stoff, alt               | Ansehen `telefon` („Sonntags um sechs. Immer.“, 14)                      |
| Wohnküche Ost    | Kohleofen, Holzkorb                                            | (8, 3), (8, 5)              | –                  | Gusseisen                 | Wärme                                                                    |
| Wohnküche Süd    | Garderobe mit Mänteln, Fußmatte innen                          | (6, 10), Matte (8, 10)      | –                  | Holz                      | Eingang                                                                  |
| Zimmer Nord      | Bett mit gestreifter Decke                                     | (12, 1), 2 × 3              | Kopfende oben      | Holz, gepflegt            | Mamas Bett                                                               |
| Zimmer Nord      | Poster einer Band von 2000, Fenster                            | Wandfläche (14, 1), (16, 1) | –                  | Papier; Glas              | Spuren von Leben                                                         |
| Zimmer Ost       | Schreibtisch mit Lampe und Stuhl, Schublade                    | Tisch (15, 5), Stuhl (15, 4) | Stuhl zum Tisch   | Holz                      | Turnierheft in der Schublade (Szene 39a)                                 |
| Zimmer Ost       | Silbermedaille am Nagel                                        | Wandfläche über dem Tisch   | –                  | Metall                    | `medaille` (16, 6)                                                       |
| Zimmer West      | Partieformular unter Glas im Rahmen, Foto 2001 daneben         | Wand der Innenwand (11, 4)  | –                  | Glas, Holz                | `partieformular2001` (12, 5); Fund `foto2001` (Szene 39)                 |
| Zimmer Süd       | Kommode mit Spiegel, Stofftier                                 | (13, 9)                     | Vorderseite unten  | Holz                      | Spuren von Leben                                                         |
| Ecken            | Pflanze im Topf                                                | (1, 10), (17, 9)            | –                  | Pflanze                   | Regel 4.4                                                                |

Hinweis: Nichts im Raum zeigt ein Schachbrett offen; das Turnierheft liegt in der Schublade, das
Partieformular hängt an der Innenwand, die man erst im Zimmer sieht.

### 4.4 Umkleide des Werks (`ironwood.umkleide`)

**Größe:** 14 × 10 (öffentlicher Raum nach 7a.2, unterer Rand). Nordwand Reihen 0–2 Fliesen
weiß-grau, Boden graue Fliesen, Südwand Reihe 9 mit der Tür bei Spalte 7. Licht flackert in der
Nordostecke (die Lampe ist kaputt; dort ist es zu dunkel ohne Laterne).

| Zone       | Gegenstand                                       | Feld                                   | Ausrichtung       | Material, Stil, Zustand | Zweck                                                                        |
| ---------- | ------------------------------------------------ | -------------------------------------- | ----------------- | ----------------------- | ---------------------------------------------------------------------------- |
| Nordwand   | sechs gleiche Spinde lückenlos                   | (1, 1) bis (6, 1)                      | Türen unten       | Metall grau, gebraucht  | Umkleide                                                                     |
| Ecke NO    | zwei Spinde im Dunkeln, einer mit Vorhängeschloss | (10, 1), (11, 1)                      | Türen unten       | Metall, alt             | `schliessfach` (11, 3): Fund `holzturm` nur mit Laterne                      |
| Ostwand    | Duschecke mit zwei Brausen, Fliesen              | 12–13 / 3–6                            | –                 | Fliesen, alt            | tropfende Dusche (Klang)                                                     |
| Mitte      | zwei Umkleidebänke                               | (3, 4), (3, 6), je 5 × 1               | –                 | Holz und Metall         | vergessener Helm auf der unteren Bank (5, 6), Ansehen `helm`                 |
| Westwand   | Handtuchhaken mit Handtüchern, kleiner Spiegel   | (1, 4), (1, 5)                         | –                 | Metall                  | Spuren von Leben                                                             |
| Ecke SW    | freie Ecke                                       | 1–3 / 7–8                              | –                 | –                       | Platzhalter Klapptisch mit Brett (Akt 4, Hank trainiert Kinder)             |

### 4.5 Heimatmuseum im alten Bahnhof (`ironwood.museum`)

**Größe:** 26 × 14 (großer Saal; alte Schalterhalle). Nordwand Reihen 0–2 Holzvertäfelung mit drei
Schalterfenstern, Boden Terrazzo, Südwand Reihe 13 mit der Doppeltür bei Spalte 13. Zwei hohe Fenster.

**Stimmung:** still, Staub im Licht, die Standuhr tickt lauter als nötig.

**Laufwege:** Tür (13, 13) → Start (13, 12) → Mittelgang nach oben zu Mr. Teagues Pult; links die
Postsäcke, rechts die Vitrinen.

| Zone         | Gegenstand                                                  | Feld                          | Ausrichtung       | Material, Stil, Zustand   | Zweck                                                                                   |
| ------------ | ----------------------------------------------------------- | ----------------------------- | ----------------- | ------------------------- | --------------------------------------------------------------------------------------- |
| Nordwand     | drei Fahrkartenschalter mit Gitter (eine Serie)             | Wandfläche (4, 1), (9, 1), (16, 1) | –            | Holz dunkel, Messing, alt | alte Schalter (Bibel 10.4)                                                              |
| Nordwand     | Standuhr mittig                                             | (13, 1)                       | Vorderseite unten | Holz, antik               | Klang; Blickfang einmal je Ort                                                          |
| Nordwand     | zwei hohe Fenster                                           | Wandfläche (7, 1), (19, 1)    | –                 | Holz                      | Licht                                                                                   |
| Mitte        | Pult mit Besucherbuch, Hocker                               | Pult (12, 5), Hocker (13, 4)  | –                 | Holz                      | Mr. Teague (14, 5)                                                                      |
| Westseite    | Postsäcke gestapelt auf einem Gepäckkarren                  | (2, 6), 3 × 2; Säcke (2, 9), (4, 9) | –           | Leinen, Wachssiegel, alt  | `postsack` (3, 8) (Szene 41)                                                            |
| Westseite    | Wartebank aus Holz an der Westwand                          | (1, 11)                       | Sitzfläche Ost    | Holz, alt                 | Ansehen; Ambrose sitzt hier in Szene 47                                                 |
| Ostseite     | Vitrine mit der Zeitung von 1858, rechts daneben ein Fach frei | (19, 6), 2 × 2; frei (21, 6) | –                 | Glas und Holz             | `vitrine1858` (20, 8) (Szene 47); freies Fach für Brief und Umschlag (R5)               |
| Ostseite     | Schaukasten mit Werksgeschichte und dem Glasfunken          | (19, 10), 2 × 1               | –                 | Glas                      | `fundGlasfunke` (20, 11)                                                                |
| Ostseite     | Fotos vom Bahnhof 1870 und vom Bau der Brücke               | Wandfläche (23, 1)            | –                 | alt                       | Ansehen `fotoBruecke` (Brücke im Bau, keine Namen)                                      |
| Ecken        | Pflanzen, Eimer mit Schirmen                                | (1, 4), (24, 11)              | –                 | –                         | Regel 4.4                                                                               |

Hinweis: Das Foto vom Brückenbau zeigt Arbeiter und Gerüste, keinen Namen; „J. H.“ steht nur auf den
Nieten draußen. So bleibt die Verbindung zu Hale eine Frage von Juno (Bibel 12).

### 4.6 Steinbruch, Grube (`steinbruch.grube`)

**Größe** 70 × 50, Norden oben. **Boden:** Schotter auf der Zufahrt, Fels und Geröll auf der Sohle,
Gras und Birken oben an der Kante. **Rand:** Felswände. **Tönung** kühl; Laub in den Fugen.

| Abschnitt | Inventar                                                                                                                                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1        | Zufahrt 0–41 / 6–7 (Schotter), Kette zwischen zwei Pfosten an der alten Zufahrt (8, 4–5) mit Schild „Hargrove & Söhne, gegr. 1868“ (`schildHargrove`); Birkengruppe 2–8 / 0–3; Felskante mit Geländerresten 0–23 / 9                     |
| G2        | Aussichtspunkt 26–28 / 9–10 mit Geländer, Bank (27, 8, zur Grube), `aussichtGrube` (27, 9); Lena mit Kamera auf Stativ (24, 9)                                                                                                          |
| G3        | Vorarbeiterbude 52–58 / 3–8 (Bretter, Tür unten (55, 8)), Bank davor (52, 9) mit Mr. Hargrove, Werkzeugkiste (59, 8); Serpentinen 42–50 / 9–24 mit Leitplanken aus Holz an den Kehren                                                    |
| G4        | Brechanlage 4–10 / 25–31 (Kulisse, rostig), Prellbock (11, 32), Lore mit Steinen am Gleisende (12, 32)                                                                                                                                  |
| G5        | Wasserloch 12–32 / 30–42 (Teich, Felsrand ringsum), flache Steine am Ufer (`steine`, (33, 36)), Libelle (Tier)                                                                                                                         |
| G6        | Lorengleis vom Stollenmund (57, 42) über die Sohle zur Brechanlage, drei Weichen mit Hebel (48, 38), (40, 33), (30, 28) für N-ST1; zwei Loren (50, 39), (36, 31); Stollenmund 56–58 / 40–42 mit Holzrahmen und Schild; zwei Kinder (54, 43); Graffiti-Wand 60–68 / 26 (Bild an der Felswand) |

Belebung: Krähe auf der Kante, Libelle über dem Wasser, Echo als Klang. Offen: Loren und
Brechanlage sind vermutlich nicht im Katalog (Ersatz: Industrieteile aus Modern Exteriors).

### 4.7 Steinbruch, Stollen (`steinbruch.stollen`)

**Größe** 40 × 24. **Boden** Fels mit Gleis in der Mitte des Hauptgangs; Wände Fels, Stützbalken aus
Holz alle vier Felder. **Tönung** dunkel; mit Laterne Lichtkreis von vier Feldern.

| Zone          | Gegenstand                                                    | Feld                         | Zweck                                                                                       |
| ------------- | ------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| Eingang       | Holzrahmen, Tageslicht fällt herein                           | 17–20 / 21–23                | `stollenAusgang` (18–19, 23)                                                                |
| Hauptgang     | Gang nach Norden, Gleis, Stützbalken                          | 18–19 / 10–22                | Laufweg                                                                                     |
| Gabelung      | alter Haken mit einer leeren Grubenlampe                      | (17, 14)                     | Ansehen `lampenhaken` („Hier hing Licht. Jetzt hängt hier Rost.“)                           |
| Seitenstollen | Gang nach Nordwesten                                          | 6–17 / 5–14                  | zur Nische                                                                                  |
| Nische        | Nische mit losem Stein; nach Szene 43 Blechdose (Objekt)      | 4–7 / 3–5                    | Mamas Versteck (N-ST2), vorher nur Steine                                                   |
| Kaverne       | Hallraum mit Tropfsteinresten, Pfütze, abgestellte Lore        | 24–36 / 2–10                 | `echo` (30, 6) (N-ST3)                                                                      |
| überall       | Geröll in Gruppen, Wassertropfen (Klang), Stützbalken         | –                            | Regel 9.8.5 entsprechend (Kleinkram nur am Rand)                                            |
