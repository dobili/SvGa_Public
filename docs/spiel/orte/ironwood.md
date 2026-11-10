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

**Reihen (Nord nach Süd):** 0–3 Abhang (Böschung, Fels, Gestrüpp; Treppe 24–25 / 0–3 vom Nordrand); 4–10 Reihenhäuser
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

**Wegeführung:** Der Hauptweg kommt am Nordrand in den Spalten 24–25 an (Ende des Abhangs von W3),
läuft die **Treppe** (24–25, 0–3) hinunter und die **Gasse** (24–25, 16–27) gerade nach Süden auf die Hauptstraße, dort nach Osten zum **Werkstor** (56–60, 27) und nach
Westen zur **Haltestelle** an der Brücke (13–16, 32). Die Gasse ist bewusst gerade: Sie ist die
Sichtachse vom Abhang auf den Uhrturm des alten Bahnhofs (24, 34). Kurven und Richtungswechsel
haben die Nebenwege: der Uferweg am Kanal (11–12, 12–28) mit dem Kai, die Bahnhofstraße (16–17,
33–41) zum Platz, der Weg über den Platz am alten Bahnsteig zum Bahnübergang (62–63, 45–52) und der
Steinbruchweg, der hinter dem Güterbahnhof zweimal abknickt (62–63, 52–56; 63–79, 57–58). Abzweige
nach 7a.2 (mittlere Stadt) mit Ziel: Uferweg → Kai und Lastkahn; Bahnhofstraße und Kirchgasse →
Platz, Lok, Museumstür; Bahnübergang → Gus und Steinbruch; Elm Street → Haus von Oma Ruth und
Werkspforte (geschlossen, Ziel ist das Schild).

**Sichtachsen:**

| Standort                                             | Ziel                                                         | Warum                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| oben an der Treppe (24, 1), nach der Ankunft über W3 | Uhrturm des alten Bahnhofs (24, 34)                          | Ankunft zu Fuß: Man sieht die ganze Stadt bis zum Bahnhof. |
| Haltestelle (14, 32), Ankunft mit Bus                | Schornsteine mit Rauch über dem Werk (52–60)                 | Wer mit dem Bus kommt, sieht zuerst das Werk.              |
| Hauptstraße (40, 30)                                 | Werkstor mit Schild (56–60, 27)                              | Szene 49: Das neue Schild hängt dort, wo jeder hinsieht.   |
| Platz am Bahnsteig (30, 43)                          | Gittertor zum Steinbruch hinter dem Güterbahnhof (76, 57–58) | Man sieht das Tor, bevor man den Weg dorthin findet.       |
| Brückenmitte (6, 32)                                 | Hauptstraße bis zum Werk, Schnee in Szene 50                 | Abschied am Ende von Akt 2.                                |

**Ränder:** Norden Abhang mit Fels und Gestrüpp (nur die Treppe öffnet ihn, Spalten 24–25, Übergang W3). Westen
jenseits des Kanals Böschung; die Schnellstraße läuft über die Brücke an den Westrand, aber der
Gehweg endet am Schild „Kraftfahrstraße – keine Fußgänger“ am Westende der Brücke (2, 32); dahinter
Leitplanke. Die Gleise laufen an West- und Ostrand, mit Zaun; über die Gleise führt nur der
Bahnübergang. Osten: Hauptstraße endet an der Schranke „Werkszufahrt Ost – nur Lieferverkehr“
(75, 29–31); Werkshallen bis zum Rand; nur der Steinbruchweg öffnet den Ostrand (Reihen 57–58).
Süden dichtes Gebüsch auf der Böschung. Der Kanal reicht über Nord- und Südrand (Regel 6.4).

### 1.2 Abschnitte

Abschnitte zu je 16 × 15 Kacheln (fünf Spalten A bis E, vier Reihen 1 bis 4), etwa zwei
Hochformat-Bildschirme. Benachbarte Abschnitte haben verschiedene Themen.

| Abschnitt          | Bereich       | Thema                       | Inhalt                                                                                                                   | Zum Entdecken                                                              |
| ------------------ | ------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| A1 Kanal Nord      | 0–15 / 0–14   | Kanal unter dem Abhang      | Kanal mit Ufer, Westböschung, Elm Street Nr. 2 am Westende, Uferweg beginnt an der Elm Street                            | Krähen auf dem Geländer, Brombeeren am Hang                                |
| B1 Treppe          | 16–31 / 0–14  | Ankunft zu Fuß              | Treppe vom Abhang (Ankunft W3), Nr. 4 und Nr. 6, Blick über die Stadt                                                    | Aussicht oben an der Treppe (`aussichtTreppe`), Mrs. Brody fegt den Gehweg |
| C1 Elm Street Ost  | 32–47 / 0–14  | Wohnstraße der Familie      | Nr. 8, Eckhaus Nr. 10 von Oma Ruth mit Spitzengardine, Werkspforte am Ostende                                            | Schild „Werkspforte – nur Schichtpersonal“, Kohleneimer vor Nr. 8          |
| D1 Hallen          | 48–63 / 0–14  | Das Werk arbeitet           | Hallen mit Schornsteinen (Rauch und Funken animiert), Kantine im Werkhof                                                 | Funkenflug, Sirene zum Schichtwechsel                                      |
| E1 Kranbahn        | 64–79 / 0–14  | Stahl unter freiem Himmel   | Portalkran über dem Lagerplatz, Stahlträgerbündel, Umkleide                                                              | Krähen auf den Trägern, Kranführerkabine (Big Joes Arbeitsplatz, Ansehen)  |
| A2 Kai             | 0–15 / 15–29  | Wasser und Lastkahn         | Kai mit Pollern, Kanalmeisterei (Schuppen), Liegeplatz des Lastkahns, Uferweg bis zur Hauptstraße                        | Schild „Anleger – Lastkahn Ashford Belle“, Lastkahn (nach Öffnung)         |
| B2 Laden und Gasse | 16–31 / 15–29 | Einkaufen                   | Kreidebrett auf dem Gehweg Süd der Elm Street, Hinterhöfe, Eisenwaren Edna mit Verkaufsfenster, Gasse, Kneipe            | Kreidekinder (N-IW1), Eisenwarenfenster (`eisenwarenfenster`)              |
| C2 Kohlenhof       | 32–47 / 15–29 | Alter Alltag                | Kohlenhandlung mit Kohlenhaufen im Hof, Hinterhöfe mit Wäscheleinen                                                      | Frau trägt Kohle (Mrs. Brody), Wäscheleine                                 |
| D2 Werkstor        | 48–63 / 15–29 | Eingang zum Werk            | Werkhof, Pförtnerhaus mit Mr. Kerrigan, Werkstor als Schiebetor                                                          | Schichtwechsel (Gruppen), **Stahlperle** im Rinnstein (`fundStahlperle`)   |
| E2 Halteplatz      | 64–79 / 15–29 | Werksverkehr                | Werksbus-Halteplatz im Werkhof (Platzhalter Akt 3), Lagerplatz, Schranke der Werkszufahrt Ost                            | Schild an der Schranke, Gabelstapler (Belebung)                            |
| A3 Brücke          | 0–15 / 30–44  | Ankunft mit dem Bus         | Stahlbrücke mit Nieten „J. H.“, Haltestelle, Grünstreifen am Kanal, Lok-Denkmal am Platz                                 | Nieten (`nietenBruecke`), **Essensmarke** unter der Haltestellenbank       |
| B3 Alter Bahnhof   | 16–31 / 30–44 | Geschichte der Stadt        | Rückseite des alten Bahnhofs zur Hauptstraße, Uhrturm, Bahnhofstraße, Museumstür auf der Platzseite                      | Uhrturm (Sichtachse), Mr. Flores mit den Tauben am Platz                   |
| C3 Kirche          | 32–47 / 30–44 | Stille                      | Kirche St. Barbara (Schutzpatronin der Hütten- und Bergleute), Kirchgasse                                                | Barbara-Figur über der Tür mit Grubenlampe (Ansehen)                       |
| D3 Parkplatz       | 48–63 / 30–44 | Schicht kommt, Schicht geht | Parkplatz der Schichtarbeiter hinter Hecke mit Pollern, Weg über den Platz zum Bahnübergang                              | Big Joes Pickup mit Kranhaken-Anhänger (`pickup`, Ansehen)                 |
| E3 Schranke        | 64–79 / 30–44 | Ende der Straße             | Hauptstraße bis zur Schranke, Parkplatzende, Platz am Bahnsteig endet am Zaun                                            | Lieferwagen wartet an der Schranke (Belebung)                              |
| A4 Eisenbahnbrücke | 0–15 / 45–59  | Gleise über dem Wasser      | Eisenbahnbrücke über den Kanal, Kanal nach Süden, Brachland                                                              | altes Formsignal am Gleis, Güterzug fährt vorbei (Belebung)                |
| B4 Lokschuppen     | 16–31 / 45–59 | Ruine                       | Gleise, Lokschuppen-Ruine (Kulisse, dachlos), Schotter, Löwenzahn                                                        | Fledermäuse am Abend (Tönung Abend)                                        |
| C4 Güterschuppen   | 32–47 / 45–59 | Fracht                      | Gleise, Güterschuppen mit Laderampe, Kisten und Fässer gruppiert                                                         | Kreidezahlen an der Rampe (Ansehen), Rangierer pfeift                      |
| D4 Gus             | 48–63 / 45–59 | Pause am Güterbahnhof       | Bahnübergang (Andreaskreuz, Umlaufgitter), Kabeltrommeln, Gus auf der umgedrehten Trommel                                | Gus (Szene 45), Thermosflasche und Uhr auf der Trommel                     |
| E4 Steinbruchweg   | 64–79 / 45–59 | Abstecher                   | Stellwerk, Steinbruchweg mit zwei Knicken, Gittertor „Steinbruch – stillgelegt – Betreten auf eigene Gefahr“ (76, 57–58) | Tor (Sichtachse), Ausblick auf die Steinbruchkante hinter dem Tor          |

**Laufzeit:** Hauptweg Nordrand → Treppe → Gasse → Hauptstraße → Werkstor etwa 62 Kacheln (18 s),
zur Haltestelle etwa 40 (11 s). Quer über die Hauptstraße 80 Kacheln, 23 s. Liegt im
Rahmen 17–23 s.

### 1.3 Gebäude und Maße

| Gebäude                                     | Lage außen (Spalten / Reihen), Tür                                                            | Fassade                                                       | Innen (7a.2)                                                                        | Begehbar          |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------- |
| Reihenhaus Nr. 10, Oma Ruth (Eck)           | 38–46 / 4–10, Haustür (42, 10) in der Südfassade (4 von 9, 44 %)                              | Backstein, zweigeschossig, Spitzengardine, 9 breit            | `mamasZimmer` 18 × 12 (Wohnküche und Mamas Zimmer), Haustür Südwand Spalte 8        | ja                |
| Reihenhäuser Nr. 2 bis 8                    | 12–17, 18–23, 26–31, 32–37 / 4–10, Türen in Reihe 10                                          | Backstein, je 6 breit, gleiche Bauart                         | –                                                                                   | nein              |
| Kantine des Stahlwerks                      | 50–61 / 11–17 im Werkhof, Tür (56, 17) in der Südfassade (6 von 12, 50 %)                     | Flachbau, Backstein und Wellblech, 12 breit, Schild „Kantine“ | `kantine` 24 × 16 (Clubraum mit langen Tischen, großer Saal), Tür Südwand Spalte 12 | ja                |
| Umkleide des Werks                          | 64–70 / 11–17, Tür (67, 17) (3 von 7)                                                         | Flachbau, 7 breit                                             | `umkleide` 14 × 10, Tür Südwand Spalte 7                                            | ja                |
| Alter Bahnhof (Heimatmuseum)                | 18–30 / 34–41, Tür (24, 41) in der Südfassade zur Platzseite (6 von 13), Uhrturm über der Tür | Backstein 1870, 13 breit, Uhrturm                             | `museum` 26 × 14 (alte Schalterhalle), Tür Südwand Spalte 13                        | ja                |
| Eisenwaren Edna                             | 17–23 / 18–27, Verkaufsfenster (20, 27) in der Südfassade                                     | Backstein, 7 breit, Markise über dem Fenster                  | –                                                                                   | Kulisse (Fenster) |
| Kneipe „Zum Hochofen“                       | 26–34 / 18–27, Tür (30, 27)                                                                   | Backstein, 9 breit, Leuchtschild                              | –                                                                                   | nein              |
| Kohlenhandlung                              | 36–45 / 18–27, Hoftor (40–41, 27), Kohlenhaufen im Hof 36–45 / 16–17                          | Holzschuppen und Bürohaus, 10 breit                           | –                                                                                   | nein              |
| Kirche St. Barbara                          | 33–42 / 33–41, Tür (37, 41) zur Platzseite                                                    | Backstein, 10 breit, Glockenturm                              | –                                                                                   | nein              |
| Pförtnerhaus                                | 61–63 / 23–26, Schiebefenster zum Tor                                                         | Flachbau, 3 breit                                             | –                                                                                   | Kulisse           |
| Werkshallen                                 | 48–79 / 0–9                                                                                   | Hallen mit Sheddach, zwei Schornsteine (52, 0) und (58, 0)    | –                                                                                   | Kulisse           |
| Kanalmeisterei                              | 13–16 / 19–23                                                                                 | Holzschuppen, 4 breit                                         | –                                                                                   | Kulisse           |
| Güterschuppen, Stellwerk, Lokschuppen-Ruine | 36–47 / 52–57; 66–69 / 52–56; 18–30 / 53–58                                                   | Backstein und Holz                                            | –                                                                                   | Kulisse           |
| Haltestelle                                 | Schilder (12, 32) und (15, 32), Wartehäuschen 12–15 / 33–34, offene Seite nach Norden         | Glas und Stahl, 4 breit                                       | –                                                                                   | Kulisse           |

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
(Spalten 56–58, Reihen 40–42, Holzrahmen, Schild „Stollen 2 – nur mit Licht“). Felswände
schließen Nord-, Ost- und Südrand; der Westrand ist oberhalb der Zufahrt Fels, unterhalb Wand.

| Abschnitt      | Bereich (Spalten / Reihen) | Thema                | Zum Entdecken                                                                                                 |
| -------------- | -------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| G1 Zufahrt     | 0–23 / 0–24                | Ankunft an der Kante | Kette über der alten Zufahrt mit Schild „Hargrove & Söhne, gegr. 1868“ (Ansehen), Birken am Rand              |
| G2 Aussicht    | 24–41 / 0–24               | Blick in die Tiefe   | Aussichtspunkt mit Geländer (26–28, 9–10), Lena fotografiert; `aussichtGrube`                                 |
| G3 Bude        | 42–69 / 0–24               | Hargroves Reich      | Vorarbeiterbude (52–58, 3–8) mit Bank davor, Mr. Hargrove; Serpentinen hinunter                               |
| G4 Brechanlage | 0–23 / 25–49               | Rost                 | Brechanlage (Kulisse), Ende des Lorengleises mit Prellbock                                                    |
| G5 Wasserloch  | 24–45 / 25–49              | Spiegel              | Wasserloch mit Felsrand, eine Libelle; Steine zum Hüpfen am Ufer (Ansehen)                                    |
| G6 Stollenmund | 46–69 / 25–49              | Dunkel               | Lorengleis mit drei Weichen (Lorenbahn N-ST1), Stollenmund (S4), zwei Kinder mit Taschenlampen, Graffiti-Wand |

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

| Von (Karte, Auslöser, Feld)                                         | Nach (Karte, Auslöser, Feld; Ankunft)                                                              | Lage, Bedingung                                                                                                                                           |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aussen `kanalweg` Nordrand (24–25, 0); Ankunft (24, 1), Blick Süden | wegRivertonIronwood.bruecke `weiterIronwood` Südrand (24–25, 159); Ankunft (24, 158), Blick Norden | Treppe am Ende des Abhangs, zwei Felder, gleiche Spalten auf beiden Seiten (mit mittel-3 abgestimmt); Dialog `ankunft_zu_fuss` bleibt an `weiterIronwood` |
| aussen `bushaltestelle` (14, 32), Start                             | –                                                                                                  | Ankunft mit dem Bus (Schnellreise, Szene 43 mit Mama, Rückkehr)                                                                                           |
| aussen `busRiverton` (12, 32), Dialog, Reise                        | riverton.aussen `busIronwood` (Schild (49, 18), `orte/riverton.md`, mittel-3)                      | erst nach `besuchtIronwood`; 10 Münzen, nach der Clubnadel von Ironwood frei (Bibel 10.3, W2)                                                             |
| aussen `busSiliconBay` (15, 32), Dialog, Reise                      | wegIronwoodSilicon.raststaette `start` (140, 20) an der Haltestelle der Raststätte                 | erst nach Szene 50 (`einladungGesehen`, neu); vorher sagt der Busfahrer, ohne Einladung lasse man niemanden aus dem Bus (`silicon-bay.md`)                |
| aussen `kantineTuer` (56, 17)                                       | kantine `kantineAusgang` (Südwand, Spalte 12); Ankunft (12, 14)                                    | Südfassade 50 % ↔ Südwand 50 %; offen erst nach Szene 38 (Bedingung `verbotGesehen`, neu), vorher Dialog des Pförtners                                    |
| aussen `umkleideTuer` (69, 17)                                      | umkleide `umkleideAusgang` (Südwand, Spalte 7); Ankunft (7, 8)                                     | Südfassade 43 % ↔ Südwand 50 %                                                                                                                            |
| aussen `haustuerRuth` (42, 10)                                      | mamasZimmer `zimmerAusgang` (Südwand, Spalte 8); Ankunft (8, 10)                                   | Südfassade 44 % ↔ Südwand 44 %; wie heute `wenn: elmStreetBekannt` (Szene 39)                                                                             |
| aussen `museumTuer` (24, 46), Platzseite                            | museum `museumAusgang` (Südwand, Spalte 13); Ankunft (13, 12)                                      | Südfassade 46 % ↔ Südwand 50 %                                                                                                                            |
| aussen `steinbruch` (neu) Ostrand (79, 57–58); Ankunft (78, 57)     | steinbruch.grube `zurueckIronwood` (neu) Westrand (0, 6–7); Ankunft (1, 6)                         | Steinbruchweg durch das offene Gittertor; Schotter, zwei Felder                                                                                           |
| steinbruch.grube `stollen` (neu), Stollenmund (57, 42)              | steinbruch.stollen `stollenAusgang` (neu) Südrand (18–19, 23); Ankunft (18, 22), Blick Norden      | S4: `wenn: hatLaterne`; ohne Laterne Dialog „Zu dunkel. Die Kinder trauen sich auch nur bis hierher.“                                                     |
| aussen `anleger` (neu, 12, 22), Dialog, Reise                       | riverton.aussen `anlegerSchild` (56, 43) und lockport.aussen `kai` (14, 20) (Lastkahn, mittel-3)   | `wenn: lastkahnFrei` (gesetzt in „Post für den Kapitän“ von mittel-3, ab Szene 39: Big Joe kennt den Kapitän, 13 §3); 5 Münzen                            |

**Stand der gebauten Karte (Runde 5, 9.11.2026, mittel-4):** Die Szene `szenen/ironwood-aussen.json`
(mit den Varianten B und C) setzt den Plan mit dem Katalog um und weicht in diesen Punkten ab: Die
Umkleide ist ein Container mit der Tür bei Spalte 69; das Heimatmuseum (altes Postgebäude) steht 20–27 /
33–45 mit der Tür zum Platz bei (24, 45), Auslöser (24, 46); der Platz liegt in den Reihen 46–48, zwei
Gleise in 49–52 enden im Westen an Prellböcken vor dem Kanal (keine Eisenbahnbrücke im Katalog); der
Steinbruchweg läuft in den Reihen 56–57 und endet vorerst an einer Absperrung (77, 56), bis es den Ort
`steinbruch` gibt. Eine Querstraße (43–45) verbindet die Elm Street mit der Hauptstraße. Das Werk
besteht aus Hallen mit Sheddach, Schornsteinen und einem Portalkran über dem Lager (eigene Bilder); die
Lok steht als Denkmal vor dem Museum, einem grauen Stadthaus ohne Schriftzug. Die Elm Street endet im
Westen an einem Wendeplatz, südlich der Gleise liegen je nach Variante Schrebergärten, ein Holzlager
oder Blumengärten, der Bahnübergang hat Holzplatten über beiden Gleisen; `anleger` und `nietenBruecke` brauchen neue Dialoge und sind noch nicht gesetzt.

**Innenräume (Runde 5, 9.11.2026, mittel-4):** Kantine 24 × 16, Wohnküche mit Mamas Zimmer 18 × 12,
Umkleide 14 × 10 und Museum 26 × 14 stehen als Szenen mit je drei Varianten. Abweichungen: `pokalregal`
(14, 4) vor dem Regal statt in der Wand; im Museum fehlt eine Standuhr im Katalog, dafür hängt ein
Fahrplan in der Mitte der Nordwand; der Gepäckkarren ist eine Sackkarre mit Postsäcken; in der Umkleide
sind die Duschen Duschwannen (das alte Duschbild war im Katalog unklar).

**Abstimmung mit mittel-3 (W3 ↔ Ironwood), entschieden vom Haupt-Chat am 9.11.2026:** Die
Brückenkarte von W3 (`wegRivertonIronwood.bruecke`, 30 × 160, `orte/riverton.md` 1.5, Commit
a5a08fdc) endet am **Südrand** in Reihe 159 mit dem Weg in den Spalten 24–25 und dem Kanal in den
Spalten 4–9 (Ufer 3 und 10). Ironwood übernimmt dieselben Spalten am Nordrand: Treppe 24–25, Kanal
4–9. Anleger (`anleger`, Bedingung `lastkahnFrei` aus L3, Brief von Big Joe nach Szene 39) und
Haltestelle (`busRiverton` ↔ `busIronwood`) wie in der Tabelle.

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

| Karte       | Szenen                                    | Figuren                                                                                  | Auslöser und Gegenstände                                                                                                                                                                                    | Belebung                                                                                                  |
| ----------- | ----------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| aussen      | 40 (Ankunft), 42, 45, 49, 50, 51, 51a, R5 | Gus, Edna (Fenster), Victor, Graham Hale, Big Joe (Szene 49), Mama, Juno; Figuren aus 14 | `kanalweg`, `bushaltestelle`, `busRiverton`, `busSiliconBay`, `kantineTuer`, `haustuerRuth`, `umkleideTuer`, `museumTuer`, `eisenwarenfenster`, `kreidebrett`; neu `steinbruch`, `anleger`, `nietenBruecke` | Schichtwechsel, Frau trägt Kohle, Kreidekinder, Taubenmann; Krähen, Tauben, Fledermäuse; Rauch und Funken |
| kantine     | 39, 43, 44, 46, 48                        | Big Joe, Hank, Priya, Mama, Juno; Kantinenkoch (14)                                      | `kantineAusgang`, `pokalregal`, `stahlbrett`; Schichtplan, Kaffeemaschine mit Beule, Foto der Werksmannschaft (09)                                                                                          | Werkskatze am Ofen                                                                                        |
| mamasZimmer | 39, 39a, 43                               | Oma Ruth, Juno                                                                           | `zimmerAusgang`, `medaille`, `partieformular2001`; Foto 2001 (Fund `foto2001`), Turnierheft (Schublade)                                                                                                     | –                                                                                                         |
| umkleide    | – (Fund)                                  | –                                                                                        | `umkleideAusgang`, `schliessfach` (Fund `holzturm`, Laterne)                                                                                                                                                | tropfende Dusche (Klang)                                                                                  |
| museum      | 41, 47, R5                                | Mr. Teague                                                                               | `museumAusgang`, `postsack`, `vitrine1858`, `fundGlasfunke`                                                                                                                                                 | Standuhr (Klang)                                                                                          |
| steinbruch  | N3 (13 §3)                                | Mr. Hargrove, Lena, zwei Stahlwerkerkinder                                               | `zurueckIronwood`, `stollen` (S4), `stollenAusgang`, Lorenbahn, Echo, Mamas Versteck (nach Szene 43)                                                                                                        | Libelle, Krähe auf der Kante                                                                              |

**Sperren und ihre Öffnung, geprüft gegen den Bedarf der Hauptgeschichte:**

| Sperre                    | Öffnet                                 | Gebraucht ab                     | Prüfung                                                                                                   |
| ------------------------- | -------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| W3 (Riverton `kanalweg`)  | `nadelRiverton` (heute)                | Szene 39                         | Szene 38 folgt auf die Nadel von Riverton; also offen.                                                    |
| Kantinentür               | nach Szene 38 (`verbotGesehen`)        | Szene 39 (erster Kantinenbesuch) | öffnet vorher. Vor Szene 38: Mr. Kerrigan, „Gäste erst zum Turnier, Kumpel. Der Zettel hängt noch nicht.“ |
| Haus von Oma Ruth         | `elmStreetBekannt` (Big Joe, Szene 39) | Szene 39, zweiter Teil           | setzt dieselbe Szene; also offen.                                                                         |
| Bus nach Silicon Bay      | nach Szene 50 (`einladungGesehen`)     | Szene 51                         | öffnet vorher.                                                                                            |
| Bus nach Riverton         | `besuchtIronwood`                      | nie (Schnellreise)               | Rückweg zu Fuß über W3 geht immer.                                                                        |
| Lastkahn am Anleger       | nach Szene 39                          | nie (Schnellreise)               | freiwillig.                                                                                               |
| Stollen (S4)              | Laterne (Edna, 60 Münzen)              | nie (Nebenort)                   | freiwillig; Laterne nach 11 mit ≈ 420 Münzen bezahlbar.                                                   |
| Mamas Versteck im Stollen | `mamaSpielt` (Szene 43) und Laterne    | nie                              | erst nach Szene 43, damit nichts von Mamas Geschichte vorher herauskommt (Befund 3).                      |

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

| Element                               | Entscheidung                                                                                                             | Grund                                                                                                                                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Größe                                 | 80 × 60 statt 32 × 24                                                                                                    | `KARTENREGELN.md` 7a.2 (mittlere Stadt 60–80 × 50–60); die Stadt hat vier Bereiche (Werk, Elm Street, Hauptstraße, Bahn).                                                                                                                            |
| Ankunft zu Fuß an der Bushaltestelle  | geändert: Ankunft über die Treppe am Nordrand; der Bus hält an der Brücke                                                | Wege laufen über den Rand weiter (Regel 5.1); wer läuft, kommt nicht aus dem Bus. Wie in Cedar Creek.                                                                                                                                                |
| Brücke mit Nieten „J. H.“             | bleibt als Stahlbrücke der Schnellstraße über den Kanal, mit Gehweg bis zur Brückenmitte                                 | Szene 50 (Brücke und Haltestelle an der Schnellstraße); Ambrose sieht dort die Nieten. Die Eisenbrücke auf W3 trägt dieselben Initialen (mittel-3).                                                                                                  |
| Schnellstraße zu Fuß                  | entfällt: Gehweg endet an der Brücke, Schild „Kraftfahrstraße“                                                           | Bibel 19.1: nach Silicon Bay nur mit dem Bus bis zur Raststätte; das Schild erklärt den geschlossenen Westrand.                                                                                                                                      |
| Kantine im Werk                       | bleibt, im Werkhof hinter dem Werkstor                                                                                   | Szene 49 spielt am Werkstor; das Werk vermietet die Kantine. Der Weg durchs Tor macht das sichtbar.                                                                                                                                                  |
| Umkleide                              | bleibt im Werkhof neben der Kantine                                                                                      | Bibel 10.4 („Umkleide des Werks“).                                                                                                                                                                                                                   |
| Elm Street                            | bleibt, als Wohnstraße unter dem Abhang mit fünf Reihenhäusern (Nr. 2 bis 10); Oma Ruth im Eckhaus am Werkszaun          | Bibel 9.3 und Szene 39; Reihenhäuser stehen an der Straße (Regel 5.3), Stufen statt Vorgarten (Stadt, Regel 9.3.4).                                                                                                                                  |
| Eisenwaren mit Verkaufsfenster        | bleibt, an der Hauptstraße, Kulisse mit Fenster                                                                          | Bibel 9.3 und 42 (`oeffneLaden`); kein Innenraum nötig.                                                                                                                                                                                              |
| Güterbahnhof mit Gus                  | bleibt südlich der Gleise; Gus auf der umgedrehten Kabeltrommel                                                          | Szene 45, 09 (5.5).                                                                                                                                                                                                                                  |
| Alter Bahnhof mit Museum              | bleibt; Tür zur Platzseite, der alte Bahnsteig ist ein Platz; Backsteinbau von 1870 an der Stelle des alten Holzbahnhofs | Bibel 9.3 (Mr. Teague, alter Bahnhof); Schauseite nach Süden, damit die Tür im Bild sichtbar ist. Der Brief von 1866 blieb im Postamt des Holzbahnhofs liegen; beim Neubau 1870 kamen die Postsäcke ins neue Gebäude (Prüfbericht Akt 2, Befund 22). |
| Kinder malen Bretter mit Kreide       | bleibt, auf dem Gehweg Süd der Elm Street (`kreidebrett`); die Kinder bekommen Namen (14)                                | 09 (5.5 und 4a).                                                                                                                                                                                                                                     |
| Kneipe (09, 4a)                       | bleibt als Kulisse „Zum Hochofen“                                                                                        | Wirtschaft der Stadt (4a); kein Innenraum, damit Ironwood bei fünf Innenräumen bleibt.                                                                                                                                                               |
| Mann füttert Tauben (09, 4a)          | bleibt, am Platz bei der Lok (Mr. Flores, 14)                                                                            | 4a; der Platz am alten Bahnsteig braucht eine ruhige Figur.                                                                                                                                                                                          |
| Kanal und Lastkahn                    | neu in Ironwood: Kanal am Westrand, Anleger am Kai                                                                       | 13 §3 (Lastkahn bis Ironwood, Big Joe kennt den Kapitän); W3 ist ein Kanalweg.                                                                                                                                                                       |
| Tor zum Steinbruch hinter dem Bahnhof | neu, am Ostrand hinter dem Güterbahnhof                                                                                  | 13 §3 (N3 „hinter dem Bahnhof“) und 7.4.                                                                                                                                                                                                             |
| Kirche St. Barbara, Parkplatz         | neu, Kulisse                                                                                                             | füllt den Süden der Hauptstraße mit Inhalt (Regel 9.9); Barbara ist die Schutzpatronin der Hütten- und Bergleute, passt zu Werk und Steinbruch.                                                                                                      |
| Haltebucht Werksbus                   | im Werkhof statt an der Straße                                                                                           | 13 §7.4; so bleibt der Gehweg durchgehend (Regel 9.2.1).                                                                                                                                                                                             |
| Erster Schnee                         | Objektebene Schnee ab Szene 50, Tönung Abend                                                                             | Bibel 10.4, Szene 50; keine Uhrzeit (13, Grundsatz 7).                                                                                                                                                                                               |

## 4. Bühnenbilder

Feld = linke obere Kachel (Spalte, Reihe). Möbel nach dem Katalog; wo ein Bild fehlen könnte, steht
„Offen“. Die Szenen für den Kartenbauer entstehen nach der Durchsicht.

### 4.1 Außenkarte (`ironwood.aussen`)

**Größe** 80 × 60. **Boden:** Asphalt mit Mittellinie (Hauptstraße), Gehwege aus grauen Platten mit
Bordstein beidseitig (Regel 9.2.1), Elm Street Asphalt mit schmalen Gehwegen, Werkhof Beton, Platz
am alten Bahnsteig Kopfsteinpflaster, Gleise auf Schotter, Brachland Schotter mit Gras und
Löwenzahn, Kanal Wasser mit Steinufer. **Rand** wie in 1.1. **Grundtönung** Herbsttag, grau;
Szene 50 Abend mit Schnee.

| Abschnitt | Inventar (Gegenstand, Feld, Ausrichtung, Material und Zustand, Zweck)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A1        | Kanal 4–9 / 0–59 mit Steinufer 3 und 10; Eisengeländer am Ostufer 10 / 0–11; Brombeerbüsche am Hang 11–15 / 0–3; Elm Street Nr. 2 (12–17 / 4–10), Stufen (14, 11), Mülltonne am Haus (17, 11); Laterne (13, 12)                                                                                                                                                                                                                                                                                                                                              |
| B1        | Treppe 24–25 / 0–3, Steinstufen mit Geländer beidseitig, Antritt oben frei; Hangbüsche und Felsgruppen 16–23 und 26–31 / 0–3; Nr. 4 (18–23), Nr. 6 (26–31), je zwei Stufen und ein Blumenkübel neben der Tür; Laterne (25, 12), Bank am Treppenfuß (22, 12, zur Straße)                                                                                                                                                                                                                                                                                      |
| C1        | Nr. 8 (32–37) mit zwei Kohleneimern neben den Stufen; Eckhaus Nr. 10 (38–46) mit Spitzengardine, Briefkasten an der Hauswand (43, 11), zwei Blumenkübel; Werkspforte im Zaun (47, 13–14) mit Schild (46, 12); Laterne (39, 12)                                                                                                                                                                                                                                                                                                                               |
| D1        | Werkshallen 48–63 / 0–9 (Sheddach, Kulisse), Schornsteine (52, 0) und (58, 0) mit Rauch und Funken (Animation); Kantine 50–61 / 11–17, Tür (56, 17) mit Vordach, Fußmatte (56, 18), Bank an der Fassade (52, 18), Fahrradständer (59, 18)                                                                                                                                                                                                                                                                                                                    |
| E1        | Halle 64–79 / 0–9; Portalkran über dem Lagerplatz 72–79 / 10–20 (Kulisse mit Kabine), Stahlträgerbündel (73, 14), (76, 17); Umkleide 64–70 / 11–17, Tür (67, 17), Fußmatte; Portalkran 72–79 frei davon (eine Spalte Abstand)                                                                                                                                                                                                                                                                                                                                |
| A2        | Kai 11–16 / 18–27 aus Steinplatten, drei Poller (11, 19), (11, 23), (11, 26), Rettungsring am Pfahl (12, 21), Kanalmeisterei 13–16 / 19–23 (Holzschuppen), Schild „Anleger“ (14, 24); Liegeplatz des Lastkahns im Wasser 5–9 / 19–25 (Objekt, ohne Kollision für das Wasser)                                                                                                                                                                                                                                                                                 |
| B2        | Kreidebrett auf dem Gehweg Süd der Elm Street (28–31, 15, Bodenbild) mit `kreidebrett` (30, 15); Hinterhöfe 17–23 und 26–34 / 16–17 mit Holzzaun, Wäscheleine, Mülltonnen; Eisenwaren 17–23 / 18–27, Markise über dem Fenster (20, 26), Schaukasten mit Laternen (18, 27); Gasse 24–25 / 16–27 mit Laterne (24, 20); Kneipe 26–34 / 18–27                                                                                                                                                                                                                    |
| C2        | Kohlenhandlung 36–45 / 18–27 mit Hoftor (40–41, 27), Kohlenhaufen 37–44 / 16–17 hinter Bretterwand, Schubkarre (36, 17), Waage (44, 17); Laterne (41, 28)                                                                                                                                                                                                                                                                                                                                                                                                    |
| D2        | Werkszaun (Gitter) 47 / 0–27 und 48–79 / 27; Werkstor 56–60 / 27 (Schiebetor, offen); Pförtnerhaus 61–63 / 23–26 mit Schiebefenster zum Tor, Schranke (55, 26); Werkhof Beton; Feuerlöscher an der Kantinenwand (60, 17); Stahlperle im Rinnstein (58, 28)                                                                                                                                                                                                                                                                                                   |
| E2        | Werksbus-Halteplatz 66–74 / 21–25 (Bodenmarkierung, leer), Gabelstapler (77, 23, fährt hin und her), Stapel Paletten (65, 20); Schranke (75, 29–31) mit Schild „Werkszufahrt Ost – nur Lieferverkehr“ (74, 28)                                                                                                                                                                                                                                                                                                                                               |
| A3        | Stahlbrücke 3–10 / 29–32, genietetes Fachwerk, Gehweg Süd über der Brücke bis (3, 32), Schild „Kraftfahrstraße – keine Fußgänger“ (2, 32), Leitplanke 0–2 / 28 und 33; `nietenBruecke` am Geländer (6, 33); Haltestelle: Schild Linie Riverton (12, 32), Schild Fernlinie Silicon Bay (15, 32), Wartehäuschen 12–15 / 33–34 mit Bank, `bushaltestelle` (14, 32); Grünstreifen 11–15 / 35–41 mit zwei Linden in Baumscheiben; Lok auf Sockel 11–15 / 42–44 (Kulisse, Schild „Nicht klettern“ (13, 41)); der Ausgang der Bahnhofstraße (16–17, 42) bleibt frei |
| B3        | Alter Bahnhof 18–30 / 34–41, Rückseite mit hohen Fenstern zur Straße, Uhrturm (24, 34) über der Tür; Bahnhofstraße 16–17 / 33–41 (Pflaster); Museumstür (24, 41) mit zwei Laternen links und rechts (22, 42), (26, 42) und Schild „Heimatmuseum“ über der Tür; Bänke am Platz (20, 43), (28, 43), zum Platz                                                                                                                                                                                                                                                  |
| C3        | Kirchgasse 31–32 / 33–41; Kirche 33–42 / 33–41 mit Glockenturm, Barbara-Figur in einer Nische über der Tür (37, 39), Tür (37, 41); zwei Kegelbäume symmetrisch (34, 42), (40, 42); Laterne (44, 43)                                                                                                                                                                                                                                                                                                                                                          |
| D3        | Hecke mit Pollern 45–79 / 33 (Lücke 52–54 als Einfahrt); Parkplatz 45–79 / 34–41 mit Markierung, sechs Autos, Big Joes Pickup (56, 36) mit Kranhaken-Anhänger am Spiegel (`pickup` (56, 38)); Weg über den Platz 45–63 / 42–45                                                                                                                                                                                                                                                                                                                               |
| E3        | Hauptstraße bis zur Schranke, Parkplatzende; Lieferwagen (72, 30) wartet (Belebung); Zaun am Platzende (66, 42–45)                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| A4        | Bahnsteigkante mit Geländer 11–61 / 45; Eisenbahnbrücke 3–10 / 46–51 (Fachwerk); Gleise 0–79 / 46–51 mit Zaun am Südrand der Gleise (Reihe 52, Lücke am Bahnübergang); Formsignal (13, 52)                                                                                                                                                                                                                                                                                                                                                                   |
| B4        | Lokschuppen-Ruine 18–30 / 53–58 (Mauern ohne Dach, Gras darin), Brachland mit Schotter, Löwenzahn, Steinen in Gruppen                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| C4        | Güterschuppen 36–47 / 52–57 mit Laderampe 36–47 / 58, Kisten und Fässer gruppiert (36, 58), (45, 58); Kreidezahlen an der Rampe (`rampe`, (40, 58))                                                                                                                                                                                                                                                                                                                                                                                                          |
| D4        | Bahnübergang 62–63 / 45–52 mit Andreaskreuzen (61, 45), (64, 52) und Umlaufgittern; drei Kabeltrommeln (56, 54), (58, 56), (52, 55), auf der mittleren Gus (58, 55) mit Schachuhr; Container gestapelt 48–51 / 53–55                                                                                                                                                                                                                                                                                                                                         |
| E4        | Stellwerk 66–69 / 52–56 (Kulisse, Fenster oben); Steinbruchweg 62–63 / 52–56, dann 63–79 / 57–58 (Schotter); Gittertor (76, 57–58) mit Pfosten (76, 56) und (76, 59), offen mit Schild „Steinbruch Hargrove & Söhne – stillgelegt – Betreten auf eigene Gefahr“ (75, 56); Büsche dicht am Südrand                                                                                                                                                                                                                                                            |

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

| Zone         | Gegenstand                                              | Feld                                                            | Ausrichtung       | Material, Stil, Zustand     | Zweck                                                             |
| ------------ | ------------------------------------------------------- | --------------------------------------------------------------- | ----------------- | --------------------------- | ----------------------------------------------------------------- |
| Nordwand     | Essensausgabe (Theke) mit Warmhaltebehältern            | (2, 4), 7 × 1, vor der Nordwand                                 | Vorderseite unten | Edelstahl, gebraucht        | Kantine; Rocco dahinter auf dem Boden (5, 3), nicht in der Wand   |
| Nordwand     | Kaffeemaschine mit Beule auf der Theke                  | (8, 4)                                                          | –                 | Metall, alt                 | Ansehen `kaffeemaschine` (09)                                     |
| Nordwand     | freie Wandfläche über der Theke                         | Wandfläche (3–7, 1)                                             | –                 | –                           | Platzhalter Logo Perfect Move (Akt 3)                             |
| Nordwand     | Schichtplan an Pinnwand                                 | Wandfläche (10, 1)                                              | –                 | Kork                        | Ansehen `schichtplan` (09)                                        |
| Nordwand     | Pokalregal mit Pokalen, eine Lücke                      | (13, 1), 4 breit                                                | Vorderseite unten | Holz dunkel, gebraucht      | `pokalregal` (14, 3); die Lücke ist der Pokal von 2001 (Szene 39) |
| Nordwand     | Foto der Werksmannschaft im Rahmen                      | Wandfläche (18, 1)                                              | –                 | alt                         | Ansehen `fotoMannschaft` (09)                                     |
| Nordwand     | zwei Fenster                                            | Wandfläche (11, 1), (20, 1)                                     | –                 | Stahlrahmen                 | Licht                                                             |
| Ostwand      | großer Kanonenofen mit Rohr, Kohleneimer daneben        | Ofen (21, 5), Eimer (22, 8)                                     | –                 | Gusseisen, alt              | Wärme; Werkskatze auf dem Teppich davor (20, 7), `sitzen`         |
| Mitte rechts | Clubtisch mit Big Joes Stahlbrett, vier gleiche Stühle  | Tisch (15, 6), 3 × 2; Stühle (14, 6), (18, 6), (15, 5), (16, 8) | zum Tisch         | Holz, Stahlbrett geschweißt | `stahlbrett` (16, 6); Big Joe (18, 5)                             |
| Mitte links  | zwei lange Tische der Schicht mit Bänken oben und unten | Tische (2, 7) und (2, 11), je 7 × 1; Bänke Reihen 6, 8, 10, 12  | zum Tisch         | Holz, gebraucht             | Hank (4, 10), Priya (7, 8); Mamas Partie an Tisch 2 (Szene 43)    |
| Mitte rechts | zweiter Clubtisch (Aufgabenreihen, Feier)               | (15, 10), 3 × 2 mit vier Stühlen                                | zum Tisch         | Holz                        | Reihen von Hank und Priya                                         |
| Südwand      | Garderobe mit Helmen und Jacken                         | (2, 14), 3 breit                                                | –                 | Metall                      | Spuren von Leben                                                  |
| Ecke SO      | Getränkekühlschrank                                     | (22, 12)                                                        | zeigt in den Raum | Metall, gebraucht           | Kantine                                                           |
| Ecken        | Gummibaum, Stapel Henkelmänner auf einem Rollwagen      | (1, 4), (9, 12)                                                 | –                 | Pflanze; Metall             | Regel 4.4; N-IW2                                                  |
| Eingang      | Start                                                   | (12, 14)                                                        | Blick nach oben   | –                           | Ankunft                                                           |

Belebung: Werkskatze, Rocco wischt den Mittelgang zwischen (11, 5) und (11, 12). Feier (Szene 44): Lichterkette als
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

| Zone            | Gegenstand                                             | Feld                            | Ausrichtung       | Material, Stil, Zustand  | Zweck                                                    |
| --------------- | ------------------------------------------------------ | ------------------------------- | ----------------- | ------------------------ | -------------------------------------------------------- |
| Wohnküche Nord  | Küchenzeile mit Herd, Spüle, Hängeschrank              | (1, 1), 5 × 2                   | Vorderseite unten | Holz hell, alt, gepflegt | Küche                                                    |
| Wohnküche Nord  | Fenster mit Gardine                                    | Wandfläche (7, 1)               | –                 | Holz, Spitze             | Licht                                                    |
| Wohnküche Mitte | Küchentisch mit Wachstuch, vier gleiche Stühle         | Tisch (3, 5), 2 × 2             | Stühle zum Tisch  | Holz, gebraucht          | Oma Ruth (5, 7) empfängt hier                            |
| Wohnküche West  | Telefon mit Schnur auf einem Tischchen, Sessel         | Tischchen (1, 8), Sessel (2, 8) | Sessel zum Raum   | Stoff, alt               | Ansehen `telefon` („Sonntags. Immer.“, 14)               |
| Wohnküche Ost   | Kohleofen, Holzkorb                                    | (8, 3), (8, 5)                  | –                 | Gusseisen                | Wärme                                                    |
| Wohnküche Süd   | Garderobe mit Mänteln, Fußmatte innen                  | (6, 10), Matte (8, 10)          | –                 | Holz                     | Eingang                                                  |
| Zimmer Nord     | Bett mit gestreifter Decke                             | (12, 1), 2 × 3                  | Kopfende oben     | Holz, gepflegt           | Mamas Bett                                               |
| Zimmer Nord     | Poster einer Band von 2000, Fenster                    | Wandfläche (14, 1), (16, 1)     | –                 | Papier; Glas             | Spuren von Leben                                         |
| Zimmer Ost      | Schreibtisch mit Lampe und Stuhl, Schublade            | Tisch (15, 5), Stuhl (15, 4)    | Stuhl zum Tisch   | Holz                     | Turnierheft in der Schublade (Szene 39a)                 |
| Zimmer Ost      | Silbermedaille am Nagel                                | Wandfläche über dem Tisch       | –                 | Metall                   | `medaille` (16, 6)                                       |
| Zimmer West     | Partieformular unter Glas im Rahmen, Foto 2001 daneben | Wand der Innenwand (11, 4)      | –                 | Glas, Holz               | `partieformular2001` (12, 5); Fund `foto2001` (Szene 39) |
| Zimmer Süd      | Kommode mit Spiegel, Stofftier                         | (13, 9)                         | Vorderseite unten | Holz                     | Spuren von Leben                                         |
| Ecken           | Pflanze im Topf                                        | (1, 10), (17, 9)                | –                 | Pflanze                  | Regel 4.4                                                |

Hinweis: Nichts im Raum zeigt ein Schachbrett offen; das Turnierheft liegt in der Schublade, das
Partieformular hängt an der Innenwand, die man erst im Zimmer sieht.

### 4.4 Umkleide des Werks (`ironwood.umkleide`)

**Größe:** 14 × 10 (öffentlicher Raum nach 7a.2, unterer Rand). Nordwand Reihen 0–2 Fliesen
weiß-grau, Boden graue Fliesen, Südwand Reihe 9 mit der Tür bei Spalte 7. Licht flackert in der
Nordostecke (die Lampe ist kaputt; dort ist es zu dunkel ohne Laterne).

| Zone     | Gegenstand                                        | Feld                     | Ausrichtung | Material, Stil, Zustand | Zweck                                                           |
| -------- | ------------------------------------------------- | ------------------------ | ----------- | ----------------------- | --------------------------------------------------------------- |
| Nordwand | sechs gleiche Spinde lückenlos                    | (1, 1) bis (6, 1)        | Türen unten | Metall grau, gebraucht  | Umkleide                                                        |
| Ecke NO  | zwei Spinde im Dunkeln, einer mit Vorhängeschloss | (10, 1), (11, 1)         | Türen unten | Metall, alt             | `schliessfach` (11, 3): Fund `holzturm` nur mit Laterne         |
| Ostwand  | Duschecke mit zwei Brausen, Fliesen               | 12–13 / 3–6              | –           | Fliesen, alt            | tropfende Dusche (Klang)                                        |
| Mitte    | zwei Umkleidebänke                                | (3, 4), (3, 6), je 5 × 1 | –           | Holz und Metall         | vergessener Helm auf der unteren Bank (5, 6), Ansehen `helm`    |
| Westwand | Handtuchhaken mit Handtüchern, kleiner Spiegel    | (1, 4), (1, 5)           | –           | Metall                  | Spuren von Leben                                                |
| Ecke SW  | freie Ecke                                        | 1–3 / 7–8                | –           | –                       | Platzhalter Klapptisch mit Brett (Akt 4, Hank trainiert Kinder) |

### 4.5 Heimatmuseum im alten Bahnhof (`ironwood.museum`)

**Größe:** 26 × 14 (großer Saal; alte Schalterhalle). Nordwand Reihen 0–2 Holzvertäfelung mit drei
Schalterfenstern, Boden Terrazzo, Südwand Reihe 13 mit der Doppeltür bei Spalte 13. Zwei hohe Fenster.

**Stimmung:** still, Staub im Licht, die Standuhr tickt lauter als nötig.

**Laufwege:** Tür (13, 13) → Start (13, 12) → Mittelgang nach oben zu Mr. Teagues Pult; links die
Postsäcke, rechts die Vitrinen.

| Zone      | Gegenstand                                                     | Feld                                | Ausrichtung       | Material, Stil, Zustand   | Zweck                                                                     |
| --------- | -------------------------------------------------------------- | ----------------------------------- | ----------------- | ------------------------- | ------------------------------------------------------------------------- |
| Nordwand  | drei Fahrkartenschalter mit Gitter (eine Serie)                | Wandfläche (4, 1), (9, 1), (16, 1)  | –                 | Holz dunkel, Messing, alt | alte Schalter (Bibel 10.4)                                                |
| Nordwand  | Standuhr mittig                                                | (13, 1)                             | Vorderseite unten | Holz, antik               | Klang; Blickfang einmal je Ort                                            |
| Nordwand  | zwei hohe Fenster                                              | Wandfläche (7, 1), (19, 1)          | –                 | Holz                      | Licht                                                                     |
| Mitte     | Pult mit Besucherbuch, Hocker                                  | Pult (12, 5), Hocker (13, 4)        | –                 | Holz                      | Mr. Teague (14, 5)                                                        |
| Westseite | Postsäcke gestapelt auf einem Gepäckkarren                     | (2, 6), 3 × 2; Säcke (2, 9), (4, 9) | –                 | Leinen, Wachssiegel, alt  | `postsack` (3, 8) (Szene 41)                                              |
| Westseite | Wartebank aus Holz an der Westwand                             | (1, 11)                             | Sitzfläche Ost    | Holz, alt                 | Ansehen; Ambrose sitzt hier in Szene 47                                   |
| Ostseite  | Vitrine mit der Zeitung von 1858, rechts daneben ein Fach frei | (19, 6), 2 × 2; frei (21, 6)        | –                 | Glas und Holz             | `vitrine1858` (20, 8) (Szene 47); freies Fach für Brief und Umschlag (R5) |
| Ostseite  | Schaukasten mit Werksgeschichte und dem Glasfunken             | (19, 10), 2 × 1                     | –                 | Glas                      | `fundGlasfunke` (20, 11)                                                  |
| Ostseite  | Fotos vom Bahnhof 1870 und vom Bau der Brücke                  | Wandfläche (23, 1)                  | –                 | alt                       | Ansehen `fotoBruecke` (Brücke im Bau, keine Namen)                        |
| Ecken     | Pflanzen, Eimer mit Schirmen                                   | (1, 4), (24, 11)                    | –                 | –                         | Regel 4.4                                                                 |

Hinweis: Das Foto vom Brückenbau zeigt Arbeiter und Gerüste, keinen Namen; „J. H.“ steht nur auf den
Nieten draußen. So bleibt die Verbindung zu Hale eine Frage von Juno (Bibel 12).

### 4.6 Steinbruch, Grube (`steinbruch.grube`)

**Größe** 70 × 50, Norden oben. **Boden:** Schotter auf der Zufahrt, Fels und Geröll auf der Sohle,
Gras und Birken oben an der Kante. **Rand:** Felswände. **Tönung** kühl; Laub in den Fugen.

| Abschnitt | Inventar                                                                                                                                                                                                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1        | Zufahrt 0–41 / 6–7 (Schotter), Kette zwischen zwei Pfosten an der alten Zufahrt (8, 4–5) mit Schild „Hargrove & Söhne, gegr. 1868“ (`schildHargrove`); Birkengruppe 2–8 / 0–3; Felskante mit Geländerresten 0–23 / 9                                                                         |
| G2        | Aussichtspunkt 26–28 / 9–10 mit Geländer, Bank (27, 8, zur Grube), `aussichtGrube` (27, 9); Lena mit Kamera auf Stativ (24, 9)                                                                                                                                                               |
| G3        | Vorarbeiterbude 52–58 / 3–8 (Bretter, Tür unten (55, 8)), Bank davor (52, 9) mit Mr. Hargrove, Werkzeugkiste (59, 8); Serpentinen 42–50 / 9–24 mit Leitplanken aus Holz an den Kehren                                                                                                        |
| G4        | Brechanlage 4–10 / 25–31 (Kulisse, rostig), Prellbock (11, 32), Lore mit Steinen am Gleisende (12, 32); Granitblock mit geritzten Zügen in alter Notation (9, 33), erst nach N-ST1 freigelegt (`granitblock`, Fragment-Hinweis)                                                              |
| G5        | Wasserloch 12–32 / 30–42 (Teich, Felsrand ringsum), flache Steine am Ufer (`steine`, (33, 36)), Libelle (Tier)                                                                                                                                                                               |
| G6        | Lorengleis vom Stollenmund (57, 42) über die Sohle zur Brechanlage, drei Weichen mit Hebel (48, 38), (40, 33), (30, 28) für N-ST1; zwei Loren (50, 39), (36, 31); Stollenmund 56–58 / 40–42 mit Holzrahmen und Schild; zwei Kinder (54, 43); Graffiti-Wand 60–68 / 26 (Bild an der Felswand) |

Belebung: Krähe auf der Kante, Libelle über dem Wasser, Echo als Klang. Offen: Loren und
Brechanlage sind vermutlich nicht im Katalog (Ersatz: Industrieteile aus Modern Exteriors).

### 4.7 Steinbruch, Stollen (`steinbruch.stollen`)

**Größe** 40 × 24. **Boden** Fels mit Gleis in der Mitte des Hauptgangs; Wände Fels, Stützbalken aus
Holz alle vier Felder. **Tönung** dunkel; mit Laterne Lichtkreis von vier Feldern.

| Zone          | Gegenstand                                               | Feld          | Zweck                                                             |
| ------------- | -------------------------------------------------------- | ------------- | ----------------------------------------------------------------- |
| Eingang       | Holzrahmen, Tageslicht fällt herein                      | 17–20 / 21–23 | `stollenAusgang` (18–19, 23)                                      |
| Hauptgang     | Gang nach Norden, Gleis, Stützbalken                     | 18–19 / 10–22 | Laufweg                                                           |
| Gabelung      | alter Haken mit einer leeren Grubenlampe                 | (17, 14)      | Ansehen `lampenhaken` („Hier hing Licht. Jetzt hängt hier Rost.“) |
| Seitenstollen | Gang nach Nordwesten                                     | 6–17 / 5–14   | zur Nische                                                        |
| Nische        | Nische mit losem Stein; nach Szene 43 Blechdose (Objekt) | 4–7 / 3–5     | Mamas Versteck (N-ST2), vorher nur Steine                         |
| Kaverne       | Hallraum mit Tropfsteinresten, Pfütze, abgestellte Lore  | 24–36 / 2–10  | `echo` (30, 6) (N-ST3)                                            |
| überall       | Geröll in Gruppen, Wassertropfen (Klang), Stützbalken    | –             | Regel 9.8.5 entsprechend (Kleinkram nur am Rand)                  |

## Runde 7: Steinbruch, Leben und Finch-Figur (10.11.2026, mittel-4)

Zu Hargrove, Lena und den Kindern kommen drei ansprechbare Statisten (`statist.steinbruch.grube.*`):

- Steinmetz (Abzug wie beim Sprengen);
- Wanderer (Rukh, der Streitwagen, 16, 4.1 Nr. 4);
- Fotografin am Abend (Krähen an der Kante).

Tiere: Krähe, Fledermäuse, Fuchs, Hasen, Falke, Eidechse.

**3.3 Feld für Runde 6:** `finchBauerF` in `steinbruch.grube` bei (59, 42) in A, B und C, begehbar,
mit Finkenzeichen aus Kreide.

## Runde 6: Steinbruch (10.11.2026, mittel-4)

- **Fund:** `finchBauerF` (59, 42).
- **Ansehen:** `graffiti` (Wolf und Krone an der Felswand), `bagger`.
- **Offen:** Sperre S4 (Laterne) am Übergang in Ironwood gehört zu mittel-2, ebenso Tönung und
  Lichtkreis im Stollen.

**Sperre S4, umgesetzt in Runde 6 (mittel-2):** Der Übergang `steinbruch` in Ironwood hat
`wenn: hatLaterne` und den Dialog `ironwood-aussen.steinbruch_sperre` (dunkler Hohlweg; ohne Laterne
der Hinweis auf Edna). Der Stollen ist dunkel (`toenung: dunkel`); mit Laterne sieht {held} vier
Felder weit. Offen: Abendtönung und Schnee in Ironwood ab Szene 50 (Tönung über `setzeToenung` im
Dialog der Szene; Schnee braucht eine Objektebene).

## Runde 8 (10.11.2026): Ironwood außen und Kantine nach den Notizen des Autors (mittel-4)

Variante C ist die Hauptfassung (`ironwood-aussen.json`, ohne Feld `variante`), A und B bleiben als
Archiv liegen.

**Außen, umgesetzt:**

- Kanal am Westrand acht Felder breit (Spalten 2–9, wie auf der Eisenbrücke) mit Steinufer; Poller am
  Kai alle vier Reihen. Die Hauptstraße quert ihn auf einer Straßenbrücke mit Gehwegen
  (`iw8StrassenbrueckeGehwegQuer10`) und führt nach Westen aus der Stadt.
- Hauptstraße und Seitenstraße durchgehend mit Pflaster eingefasst; die Seitenstraße mündet ohne
  Pflasterstreifen in die Hauptstraße, der Parkplatz oben links hat einen Gehweg.
- Gleise: Im Westen enden sie am alten Bahnhof (Heimatmuseum) an einem Prellbock quer zum Gleis,
  im Osten laufen sie bis an den Rand, zum Werk und zum Steinbruch. Der Übergang ist ins Gleis
  eingelassen (begehbar, Schienen durchgehend). Die waagerechten Absperrungen sind weg.
- Laternen an der Promenade über den Gleisen stehen alle oben, alle 12 Spalten; an der Hauptstraße
  bleibt der Wechsel oben/unten.
- Industrie: Statt der flachen Hallenfassaden eine Werkshalle mit Dach (`wr5FabrikhalleB`) mit Weg in
  den Werkhof; statt des unklaren Krans Container und Fässer; eine Werkstattbude im Hof. Der Zaun ist
  durchgehend, beginnt oben mit Endstück und hat am Werkstor Endpfosten aus demselben Zaun.
- Lok-Denkmal ohne Tiefe entfernt; an seiner Stelle Beet und Bank, daneben das Stellwerkhäuschen
  am Prellbock und ein Gerätehaus des Museums.
- Markt: Waren auf jedem Stand (Körbe mit Kürbis, Kohl, Mais, Beeren, Karotten), an jedem Stand ein
  Händler (`marktstand1`–`6`). Der Platz reicht bis an die Promenade, eine Hecke fasst ihn im Osten ein.
- Kapelle: Weg von der Tür zur Promenade, kleiner Friedhof mit Zaun, Gräbern und Büschen.
- Mehr Abwechslung: Eiche und Laubbaum statt zweier gleicher Bäume, ein blühender Busch.

**Antwort auf die Frage des Autors zur Kapelle:** Es ist die Kirche St. Barbara aus dem Ortsplan
(1.3, 3.2). Barbara ist die Schutzpatronin der Hütten- und Bergleute; sie passt zu Werk und
Steinbruch. In der Handlung hat sie keine Szene; sie ist Ortsbild, mit Friedhof der Werksleute.
Der Markt hat geöffnet (Händler und Waren); in Akt 3 ist er verschneit (Zustand, siehe unten).

**Kantine (Regel 10.56):** 36 × 20 statt 24 × 16, so breit wie das Kantinengebäude außen (13 Kacheln
Fassade, Speisesaal und Clubraum). Links drei lange Tische der Schicht mit Stühlen, Wasserspender und
Getränkeautomat am Mittelgang (Spalten 16–20 frei bis zur Ausgabe); rechts Big Joes Clubtisch vor dem
Ofen und zwei weitere Clubtische, Spinde an der Südwand. Tür (18, 19), Start (18, 17),
`pokalregal` (21, 4), `stahlbrett` (25, 7); Big Joe (26, 6), Hank (16, 16), Priya (16, 9).

**Zustände (Regel 10.63), gebaut, sobald mittel-2 die Technik meldet:**

| Karte   | Zustand           | Wann und warum                                                                      |
| ------- | ----------------- | ----------------------------------------------------------------------------------- |
| aussen  | Kantine vermietet | ab Szene 49 (`kaufGesehen`): Schild am Werkstor, Logo von Perfect Move über der Tür |
| aussen  | Winter            | ab Szene 50: Schnee auf Dächern und Gehwegen, Markt verschneit ohne Händler         |
| aussen  | Werksbus          | Akt 4 (`endeAkt3Gesehen`): Werksbus im Werkhof, Big Joe fährt zur Meisterschaft     |
| aussen  | Lastkahn          | nach der Öffnung (`lastkahnFrei`): Lastkahn am Kai                                  |
| aussen  | Steinbruch offen  | mit Laterne (`hatLaterne`, S4): Gittertor zum Steinbruch steht offen                |
| kantine | Logo              | Akt 3 (`kaufGesehen`): Logo von Perfect Move über der Ausgabe, Karton mit Pokalen   |

### Runde 8, Nachtrag: Innenräume, Grube und Stollen (Notizen 12–30 und Gutachten)

**Kantine (`ironwood-kantine`, 36 × 20; ersetzt die Fassung oben):** Die Küche liegt links hinter einer
Trennwand (Spalte 14) und der langen Essensausgabe (Theke 1–8 / 7–8 mit Kaffeemaschine, Warmhaltetheke
aus Glas 9–12, Kasse (13, 9), Mülleimer zur Geschirrrückgabe). In der Küche stehen zwei Kühlschränke,
der Gastroherd unter einer Haube, zwei Herde unter einer zweiten Haube, die Spüle mit Geschirr auf einer
Platte und eine Anrichte, alle mit dem Rücken an der Nordwand. Der Gastraum hat drei Tischreihen
(Reihen 5, 11, 15); der Mittelgang (Spalten 16–19) führt frei von der Tür zur Ausgabe. Wasserspender und
Getränkeautomat stehen an der Westwand, Spinde (Türen zum Raum), Uhr und Pinnwand an der Nordwand. Die
Schachecke rechts ist auf Dielen und durch eine Pflanzenreihe abgesetzt: der Ofen an der Nordwand, davor
Big Joes Clubtisch, zwei weitere Clubtische auf Teppichen, alle drei mit Brett; Pokalregal mit Pokal,
Foto, Bücherregal, Stehlampe, Pflanzen.

Zum Gutachten: Küche, Ausgabe, Spüle, Geräte, Kaffeemaschine auf breiter Theke, Tellergestell auf der
Platte, Pokal, Ofen an der Wand, Spinde, Leere, Wasserspender, Uhr und Mülleimer sind umgesetzt. Nicht
umgesetzt: Bänke statt Stühlen (die Stühle stehen zu den Tischen und füllen die Reihen; Bänke gibt es nur
als Parkbänke), Tabletts und Becher auf den Tischen (kein passendes Bild), Lampen an der Decke (die
Draufsicht zeigt keine Decke). Die Fußmatte liegt nach Regel 10.8 direkt an der Tür im Durchgang; das ist
die Lage „vor der Tür“, die der Kartenbauer prüft.

**Museum (`ironwood-museum`, 34 × 18, zwei Räume):** Schalterhalle mit dem alten Fahrkartenschalter
(Bild aus dem Museumspaket statt der Computer), drei hohen Fenstern, dem Fahrplan vor der Wand, rotem
Mittelgang zum Pult von Mr. Teague, zwei großen Vitrinen mit Platz ringsum und einer Reihe gefüllter
Vitrinen an der Südseite (Zeitung von 1858; freies Fach für Brief und Umschlag, R5). Die Postsäcke von
1866 sind ein Ausstellungsstück auf dem Gepäckkarren hinter Absperrpfosten (Szene 41). Durch einen
Durchgang der Nebenraum über Werk und Stadt: Bilder an der Wand, Foto vom Brückenbau, große Vitrine, drei
Schaukästen (Glasfunke). Kiste, Fass, Koffer und der Tisch mit Stuhl und Schemel sind weg.

**Umkleide (`ironwood-umkleide`, 16 × 12):** Der Doppelspind steht direkt neben den sechs Spinden, die
Duschen sind zwei Kabinen mit Brause an der Nordwand hinter einer durchsichtigen Trennwand, an der Wand
hängt ein Wandspiegel über dem Handwaschbecken.

**Mamas Zimmer (`ironwood-mamas-zimmer`):** Der Ofen steht mit dem Rücken an der Nordwand, daneben eine
Leseecke mit Sessel und Stehlampe (Antwort auf „Wozu dient die Ecke oben?“: Oma Ruths Platz am Ofen).
Die Stühle stehen vor und hinter dem runden Tisch. Der Kleiderschrank steht im Schlafzimmer an der
Nordwand, nicht mehr vor der Tür; der Couchtisch ist weg, dafür ein Teppich. Das Zimmer bleibt karg (Mama
arbeitet Nachtschicht), aber vollständig: Bett, Kleiderschrank, Schreibtisch.

**Steinbruchgrube (`steinbruch-grube`): Grundfrage.** Die Karte zeigt den alten Steinbruch von oben in
drei Höhen: oben die Wiese an der Bruchkante mit der Zufahrt, darunter die Abbaustufe aus Felsboden, ganz
unten die Sohle aus Schotter. So zeigt das Bild die Höhen:

- Die Felskanten verlaufen unregelmäßig (Versatz je Abschnitt), am Fuß jeder Kante liegt Geröll.
- Rampen führen schräg und in Stufen durch die Kanten, als Serpentine: oben im Osten hinunter, auf der
  Abbaustufe zurück nach Westen, dort zur Sohle.
- Jede Höhe hat ihren eigenen Boden (Wiese, Felsboden, Schotter); Birken stehen nur oben an der Kante.
- Die Felswände rahmen die Sohle auch im Westen und Osten.

Umgesetzt aus Notizen und Gutachten: Zufahrt aus Erde mit Rand zur Wiese, Kette mit Schild an der
Einfahrt, Bude neben dem Weg mit Tür zur Zufahrt, Bank mit Blick in die Grube, Aussichtspunkt mit Geländer
(die Figuren stehen dort gesichert), gesägte Granitquader in Reihen auf der Abbaustufe, natürliches
Wasserloch ohne Einfassung mit Schilf, Stollenmund in der unteren Felskante statt in einem freistehenden
Block, Feldbahn in schmaler Spur mit passenden Loren vom Stollenmund bis zum Prellbock am Verladeplatz,
Radlader daneben, Werkzeugschuppen mit freier Tür, Graffiti nur auf der Felswand im Nordosten, das Haus aus
Erde und die orangen Kästen sind weg. Neue Bilder als Entwurf: `bildwuensche/feldbahn.py`,
`steinquader.py`.

**Stollen (`steinbruch-stollen`):** Die Feldbahn läuft im Hauptgang vom Prellbock an der Abbaukammer bis
an den unteren Rand (Ausgang), eine Lore steht darauf. Türstöcke aus Grubenholz (zwei Stempel und eine
Kappe, `bildwuensche/grubenholz.py`) stehen im Gang, die Stämme in den Wänden sind weg.

**Allgemeine Punkte an Ironwood außen:** Kein Hausbild mehr als zweimal (die Kneipe ist jetzt grau),
keine Heckenstücke am Markt (die Bäume am Rand fassen den Platz ein).

**Abgleich mit den LimeZu-Vorbildern (Modern Exteriors 048, 050, 015):** Das Wasserloch der Grube hat
jetzt wie im Vorbild 048 Schilf am Rand und Seerosen. Die Felskanten zeichnet der Kartenbauer mit dem
Material `fels` als gerade Bänder; LimeZu zeigt Kanten mit gewellter Oberkante, Leitern und Stufen im
Fels. Das braucht ein Kantenmaterial im Kartenbild (Haupt-Chat oder mittel-2); vorgeschlagen in der
Meldung an den Haupt-Chat. Friedhof (050) und Werkhof (015) passen in Aufbau (Zaun ringsum, Wege, Kapelle
am Rand; Container, Fässer, Wellblech) zu den Vorbildern.

**Zustände (gebaut, Technik von mittel-2; `python -m pipeline.abenteuer.zustaende`):**

| Karte   | Zustand       | Bedingung         | Was sich ändert                                                                    |
| ------- | ------------- | ----------------- | ---------------------------------------------------------------------------------- |
| aussen  | vermietet     | `kaufGesehen`     | Akt 3: Schild von Perfect Move am Werkstor, Werksbus im Werkhof                    |
| aussen  | meisterschaft | `endeAkt3Gesehen` | Akt 4: Schild bleibt, der Werksbus ist zur Meisterschaft nach Crossroads unterwegs |
| kantine | logo          | `kaufGesehen`     | Akt 3: Logo von Perfect Move über der Ausgabe, Karton mit Pokalen an der Tür       |

Nicht gebaut, mit Grund: **Winter** (Szene 50) kommt mit der Schneefärbung von mittel-2 (Entscheidung
vom 10.11.2026), nicht als eigene Szene. **Lastkahn am Kai:** Der Kanal läuft in Ironwood von Nord nach
Süd; den Lastkahn gibt es nur in Ost-West-Ansicht, er läge quer im Kanal (Regel 24). **Rückkauf des
Clubs** (nach dem Spiel): Dafür gibt es noch keine Variable. **Gittertor zum Steinbruch:** Die Sperre
S4 betrifft den Stollen (Laterne), nicht die Zufahrt; der Absperrbock bleibt Ortsbild.

### Gutachten Runde 8: Umsetzung und Begründungen

**Ironwood außen:** Bahnübergang mit Bohlen und zwei Andreaskreuzen (der Weg nach Süden zu Gus ist
erreichbar, Test „erreichbar“), Prellbock am alten Bahnhof, Hauptstraße endet am Kai statt auf einer Brücke
ins Wasser, Haltestelle auf der Nordseite mit Blick zur Straße, Schornsteine auf dem Werkhof. Nicht
umgesetzt: **Markierungen und Bordsteine** der Straßen brauchen ein Straßenmaterial im Kartenbild
(Gehwege aus Pflaster sind da); **gleiche Häuser** ersetzt mittel-1 für alle Karten.

**Kantine:** Speiseplan über der Ausgabe, Kasse auf der Theke, Warmhaltevitrine auf einer Theke, Fenster,
zwei Stühle je Schachtisch. Die Küchenzeile ist lückenlos (Kühlschränke, Herde, Theke, Anrichte).

**Museum:** Vitrinen mit Dokumenten, Werkzeugen und Gesteinen statt Schädeln, Infotafeln an der Wand,
Läufer nur von der Tür bis vor das Pult, keine Absperrpfosten ohne Seil; Bänke und Pflanzen füllen die
Räume.

**Umkleide:** Doppelspind aus zwei Spinden, Duschkabinen mit Tür und Trennwand, Bank vor den Kabinen.

**Mamas Zimmer:** gerahmtes Partieformular, zwei Stühle (Mama und Oma Ruth), Spüle auf der Theke.

**Zweiter Durchgang (Detailbefunde, 10.11.2026):**

- **Ironwood außen:** Marktplatz gepflastert, Statisten von der Fahrbahn auf den nächsten Gehweg,
  Laterne aus der Einfahrt gerückt, Rangierer am Gleis, Lieferfahrer am Laden, Tauben auf dem Platz,
  mehr Lager (Fässer, Container, Bretter) im Werkhof.
- **Kantine** (`gutachten/ironwood-kantine-2.md`): Herde mit gleicher Vorderkante (3), Koch vor dem
  Herd mit Suppentopf (5), Arbeitstisch in der Küche (6), Geschirr auf dem Tresen (9), Mülleimer aus dem
  Gang in die Südwestecke (11), vierter Clubtisch auf den leeren Dielen (26), zwei Pflanzensorten an der
  Kante (27); die Beschreibung nennt keine Bank mehr (21). Nicht umgesetzt: **Hauben (4)** – das Paket hat
  nur die schmale Haube; **leere Tische, niemand sitzt (12)** – es gibt kein Bild für Tabletts oder
  sitzende Statisten, das Geschirrbild ist ein Abtropfgestell; **Stühle an der Südwand (13)** – der Raum ist
  nach Regel 10.56 so groß wie das Gebäude, die Reihe dahinter bleibt frei; **Uhr (14)** – einzige
  Wanduhr im Paket; **Spinde (15)** – einziges Spindbild, Bildwunsch an mittel-1; **Mittelgang (16)** –
  er führt zur Querstraße vor der Ausgabe; **Getränkeautomat (18)** – nur als Frontbild vorhanden;
  **Pokal, Foto, Katze (22–24)** – Bilder des Pakets; **Dielen unscharf (25)** – Material des Kartenbilds;
  **Fußmatte und Tür (28)** – gilt für alle Karten.
- **Museum** (`gutachten/ironwood-museum.md`): Läufer mit Knick bis vor das Pult (1), Holzbank statt
  Metalltisch (7, 19), dunkle Dielen statt Kantinenfliesen (13), drei Schulkinder beim Lehrer (11).
  Nicht umgesetzt: **Läufer rot (1)** – die Beschreibung sagt blau; **Postsäcke (4)** und **Schalter
  „TICKET“ (12)** – Bilder des Pakets, ein deutsches Schalterbild ist ein Bildwunsch; **Südreihe (9)** –
  der Läufer teilt sie; **Bilder und Brückenfoto (14, 15)** – Ansichten von Hütte, Kanal und Brücke wären
  eigene Bilder (Bildwunsch); **Glasfunke (16)** – der Fund ist ein Auslöser vor dem Schaukasten;
  **Wandstück im Durchgang (18)** – so zeichnet das Kartenbild jede Wandöffnung.
- **Umkleide** (`gutachten/ironwood-umkleide.md`): Bänke in der Mitte (10), der Arbeiter zieht sich nach
  der Schicht um (11), Haken mit Jacken an der Westwand und ein Mülleimer (12). Nicht umgesetzt:
  **Fliesen unscharf (6)** – Material; **Spinde (8)** – wie Kantine; **Bänke mit Lehne (9)** – eine
  niedrige Bank ohne Lehne gibt es im Paket nicht; **Fenster (12)** – die Umkleide liegt innen im Werk;
  **Fußmatte und Tür (13)** – alle Karten.
- **Mamas Zimmer** (`gutachten/ironwood-mamas-zimmer.md`): Obstschale auf dem Tisch (3), zwei verschiedene
  Herde (6), Läufer im leeren Westen (8), Teddy entfernt (11), Mama steht neben dem Bett statt auf dem
  Teppichrand (13). Nicht umgesetzt: **Arbeitsplatte (5)** – eigenes Thekenbild; **Leseecke (7)** – Sessel
  und Stehlampe reichen für „karg“; **Fliesen und Dielen unscharf (9, 14)** – Material; **Bett (12)** –
  Bild des Pakets; **Durchgang (15)** – Kartenbild; **Holzwand (16)** – eine Wandart je Szene;
  **Fußmatte und Tür (17)** – alle Karten.

**Steinbruchgrube** (`gutachten/steinbruch-grube-2.md`, geprüft war noch die Fassung ohne
Klippenkacheln): Kanten jetzt aus Klippenkacheln ohne Kästen (2, 3), Rampen mit Treppen bzw. als
gepflasterte Fahrrampe (4), Seitenwände gleich breit (5), Geröll ohne Grasrand in unregelmäßigem Abstand
(6), Birken an der Bruchkante (9), Bank am Aussichtspunkt mit Blick in die Grube (10), Metallgeländer (11),
Falke über der Wiese (12), Büsche und Blumen auf der Wiese (13), Blöcke in zwei Gruppen, Abraum, Pfützen
und Grubenholz auf der Stufe (14–16), kleineres Wasserloch (19) mit Schilf und Seerosen (18), Blechhütte
statt Hundehütte (20), Lichtmast entfernt (21), Abraum und Pfütze auf der Sohle (22), Hasen entfernt (23).
Nicht umgesetzt: **Rahmen (1):** Die Ränder zeigen jetzt die obere Fläche statt einer Wand; ganz offen
dürfen sie nach Regel 5.1 nicht sein. **Kette (8):** Statt einer Kette stehen zwei Poller mit Schild an der
Einfahrt (Beschreibung angepasst). **Kinder (24):** Die Belebung ist eine Figur mit dem Namen „kinder“, die
Sprechblase redet von beiden. **Verladeplatz (25):** Der Bruch ist stillgelegt; die Loren brachten die
Blöcke zum Verladeplatz, Laster fuhren über die gepflasterte Rampe im Westen hinauf.

**Stollen** (`gutachten/steinbruch-stollen.md`): Wände sind jetzt Dunkel, nur über den Böden steht eine
Felswand (1, 5); Steine ohne Gras, weniger und unregelmäßig (2, 3); Tageslicht am Eingang (4); zwei Loren
auf dem Gleis (6); Türstöcke in gleichem Abstand, auch an der Gabelung und im Seitenstollen (7, 16);
Grubenholz als Stapel statt Zaunstück, Kiste und Fässer entfernt (9–11); Kaverne mit unregelmäßigen Wänden
(12); kleine Nische mit dem losen Stein vor Mamas Versteck (14, 15); Karte auf 33 Spalten gekürzt (17).
Nicht umgesetzt: **Gleis links im Gang (8)** ist gewollt (rechts der Laufweg); **Fledermaus (13)** hat
noch kein Tierbild.

### Gutachten Runde 8, zweite und dritte Prüfung (10.11.2026, mittel-4)

Gutachten `ironwood-aussen-2.md`, `ironwood-kantine-3.md`, `ironwood-innen-2.md`,
`steinbruch-grube-3.md`, `steinbruch-stollen-2.md`, `zustaende-runde8.md`.

- **Ironwood außen:** Straßen mit Mittel- und Randlinien; zwei der sechs gleichen Wohnblöcke ersetzt
  (Reihenhaus, Laden), jedes Bild höchstens zweimal; der alte Bahnhof steht am Bahnsteig vor den
  Prellböcken (statt der Gartenhäuschen); im Bahnübergang liegen Bohlen, die Schienen sind dort
  unterbrochen; Haus des Schrankenwärters am Übergang; Hecke um den Markt mit Zugängen; Schranke im
  Werkstor; in den Zuständen hängt das Schild „PERFECT MOVE“ an der Fassade der Werkshalle. Nicht
  umgesetzt: **Straßenbrücke** – die Hauptstraße endet an der Kaimauer (Beschreibung angepasst); eine
  Brücke über den Kanal bräuchte ein eigenes Bild. **Verkäufer vor den Ständen** – das Standbild hat
  hinter der Auslage keinen Platz. **Werkshalle, Schuppen, Kiosk** – Bilder des Pakets, das gleiche
  Steinhaus am Kanalweg ist die Fabrik desselben Werks. **Werksbus** – Seitenansicht des Pakets.
- **Kantine:** Kaffeemaschine, Geschirr und Kasse stehen nebeneinander auf der Ausgabe (bei „auf“
  zählt nur der Versatz); Speiseplan an der Nordwand des Gastraums; Gäste sitzen an sieben Tischen;
  Zustand „logo“: Schild über der Ausgabe, die Pokale liegen im Karton. Nicht umgesetzt: **Spinde,
  Haube, Uhr, Automat, Stuhlbilder** – Bilder des Pakets; **Warmhaltetheke** bleibt die Glasvitrine.
- **Museum:** ruhige Dielen; eigene Vitrinen mit Zeitung von 1858, Bahnlaterne, leerem Fach für Brief
  und Umschlag, Werkzeug und dem Glasfunken (Bildwunsch `bildwuensche/museum_vitrinen.py`); große
  Vitrine mit Bank im Nebenraum; Pflanze aus der Hallenmitte entfernt. Nicht umgesetzt: **Läufer** –
  das Material „teppichBlau“ ist das einzige blaue; **Kunstdrucke, Postsäcke, „TICKET“** – Bilder des
  Pakets.
- **Umkleide:** schwarzer Doppelspind mit dem Schließfach, Kabinen eine Reihe tiefer (Brausen nicht
  mehr über der Wand), Türen direkt davor, Trennwand schließt den Streifen; Mülleimer zur Tür hin;
  der Arbeiter sitzt auf der Bank. Nicht umgesetzt: **Spinde wie Kühlschränke, Waschbecken, Bänke,
  Garderobe von vorn** – Bilder des Pakets.
- **Mamas Zimmer:** Obstschale steht auf dem Tisch, Stühle mittig, Küchenschrank statt rosa Läufer,
  Garderobe an der Tür. Nicht umgesetzt: **Kleiderschrank** ist höher als die Wandfläche (Bild).
- **Steinbruchgrube:** Kein oranger Rahmen mehr: Dicke Ränder zeigen die Wiese (`"hochflaeche":
"gras"`, `klippe.py` nimmt Gras oder Erde nach dem nächsten Boden); Grundboden Gras, damit die
  Zufahrt ihren Grasrand bekommt; Treppen nur noch auf echten Rampen (keine Tritte in
  Einbuchtungen); Birken nicht mehr am Weg; Bretterhütte statt Automatenhäuschen; Blöcke
  unregelmäßig, Abraum auf Stufe und Sohle. Nicht umgesetzt: **Fuchs** – das Tierbild „fuchs“ aus
  `belebungsbilder.py`; **Feldbahn** endet am Verladeplatz, Laster fuhren über die Westrampe.
- **Stollen:** Wandmaterial `felsStollen`: Über den Felswänden ist es dunkel (keine Bodenkästen mehr);
  der lose Stein ist ein flacher Stein, anders als die Brocken; die Grubenlampen hängen an der Wand;
  Brocken nicht mehr in Reihe.

**Gemini-Bilder (10.11.2026):** Im Museum hängen alte Fotos von Brücke, Werk, Bahnhof und Arbeitern
statt der Kunstdrucke (Nebenraum) und zwei weitere zwischen den Fenstern der Halle. In der Umkleide
stehen Bänke ohne Lehne und ein Haken mit Jacke und Schutzhelm. Damit sind „Parkbänke“, „Kunstdrucke“
und „Brückenfoto unleserlich“ aus den Gutachten erledigt.

**Restpunkte (Gutachten `mittel-4-nachtrag.md`, 10.11.2026):** Museum: statt der drei Vitrinen mit
grauem Inhalt ein Lokmodell, alte Fahrkarten und eine Schaffnermütze (Bildwunsch
`museum_vitrinen.py`, erweitert), Pult von vorn. Umkleide: hoher Metallschrank als Doppelspind,
Trennwand schließt den Spalt, Mülleimer an der Westwand. Nicht umgesetzt: **Läufer** – es gibt nur die
zwei Teppichmaterialien mit Muster; **„TICKET“** – Bild des Pakets.

**Fahrzeuge (10.65, 10.11.2026):** Im Zustand „vermietet“ steht der Werksbus in Vorderansicht
(`fz11BusAb`) im Werkhof statt in Seitenansicht.

**Werksbus (10.11.2026, abends):** Das Bild `fz11BusAb` ist 3 × 7 Kacheln, sichtbar etwa 6,5 lang; ein
längeres Busbild in Vorderansicht gibt es im Katalog nicht (Soll 7–9 nach 10.64).
