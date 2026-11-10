# Cedar Creek und der Weg dorthin

Stand: 9.11.2026, überarbeitet nach dem Prüfbericht `docs/spiel/pruefberichte/2026-11-09_akt1_wegenetz.md`
(Befunde 5, 6, 11, 22, 28, 29). Ortsdokument nach dem Verfahren in `docs/spiel/orte/README.md`:
Ortsplan, Ortsbild, Abgleich mit der Geschichte, Bühnenbilder. Es umfasst Cedar Creek (Ort 2) und den
Weg von Maple Falls dorthin (`wegMapleCedar`: Landstraße, Flussweg und der Zedernpfad Q1). Maßstab:
`KARTENREGELN.md` 7a.2 (Pokémon mal 1,5 bis 2). Leben, Figuren und kleine Aufgaben kommen aus
`12_Akt1_Leben.md` (mittel-1), Sperren und Rückkehr aus `13_Wegenetz.md`. Quellen: `05_Story_Bibel.md`
(2.8, 2.10, 3.2, Szenen 14 bis 25, Route 2 in 10.1), `09_Weltbeschreibung.md` (5.2, 5.3),
`ortsprofile.json`, `orte.json`, die heutigen Szenen in `inhalte/abenteuer/szenen/` und die
Übergangsprüfung (`python -m pipeline.abenteuer.uebergaenge`). Die Bühnenbilder folgen nach der
Durchsicht des Musters (Maple Falls).

## 1. Ortsplan

Norden ist oben, auf allen Karten. Die Reise geht von Westen nach Osten: Maple Falls (Park) →
Landstraße → Flussweg → Cedar Creek → (ab Akt 2) Zedernwald nach Riverton. Der Zedernpfad (Q1) ist
die Abkürzung über die Hügelkuppe im Norden.

**Der Fluss** (Entscheidung zu Befund 5, abgestimmt mit `orte/maple-falls.md`): Er läuft im Park von
Maple Falls am Nordrand (Reihen 0–3), biegt ab Spalte 30 nach Süden ab, wird von der Parkstraße auf
einer Brücke (Spalten 31–34) gekreuzt und verlässt den Park am Ostrand in den Reihen 20–23, südlich
der Straße (Park nach `orte/maple-falls.md`, mit mittel-1 abgestimmt). Auf der Landstraße und
dem Flussweg begleitet er den Weg im Süden und reicht dort über West-, Ost- und Südrand. **Der Bach**
von Cedar Creek ist ein eigenes Gewässer: Er kommt im Norden aus den Zedern, fließt am Ostrand des
Ortes nach Süden und mündet südlich der Karte in den Fluss.

### 1.1 Landstraße (`wegMapleCedar.landstrasse`, 120 × 30)

Abschnitte zu je 15 Spalten über die ganze Höhe (etwa ein Querformat-Bildschirm breit). Der Feldweg
(Erde, weiche Ränder mit Grasbüscheln, Regel 9.6.1) ist am Westrand **drei Felder breit** (Reihen 15–17,
wie die Parkstraße), wird hinter dem Abzweig in L4 zum zwei Felder breiten Weg und windet sich
zwischen den Reihen 13 und 17: eine Kurve nach Norden in L2, eine nach Süden in L6, am Ostrand
Reihen 15–16. Der Fluss tritt am Westrand in den Reihen 20–23 ein (drei Reihen Abstand zur Straße)
und schwenkt in L2 nach Süden bis an den Südrand (Reihen 26–29); so entsteht zwischen Weg und Fluss
Platz für Kuhweide und Obstwiese. Laufzeit des Hauptwegs etwa 125 Kacheln, gut 35 s.

```
          N
 Spalte:  0        15        30        45        60        75        90       105      120
 Reihe 0  ┌─────────┬─────────┬─────────┬────╥────┬─────────┬─────────┬─────────┬─────────┐
          │ Feld der Brennans (Korn) bis Nord-   ║Feldweg│ Millers Mais bis Nord- und Ostrand │
          │ und Westrand · Vogelscheuche · Krähen║zu N1 │            Büsche (fundFormular) │
 Reihe 11 │──Zaun────────────────────────────[Gatter S1]──Zaun──────────────────────────────│
 Reihe 15 ═Feldweg (R15–17)╗          ╔════════════╩Wegweiser═══════════╗         ╔════════════════════ Ostrand → Flussweg
 Reihe 16 ═════════╝  Kurve   ╚═══════════════════════════════  ╚═Kurve═══╝
          │Tafel+Ortsschild│ Kuhweide (Millers Kühe) │Apfelstand·Schuppen│ Heuhaufen·Bank(Nia)│
          │ „Maple Falls“  │ Weidetor               │ Obstwiese Brennan  │ Laubbäume          │
 Reihe 25 │~~~~~~~~~~~~~~~~ Ufer ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
 Reihe 29 │~~~~~~~~~~~~~~~~~~~~~~~~~~~ Fluss (West-, Ost-, Südrand) ~~~~~~~~~~~~~~~~~~~~~~~~~~│
          └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
           L1        L2        L3        L4        L5        L6        L7        L8
```

| Abschnitt (Spalten)   | Thema                    | Inhalt (Bestehendes in Klammern)                                                                                                                                                                                                   | Zum Entdecken                          |
| --------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| L1 (0–15) Ortsausgang | Abschied von Maple Falls | (Rätseltafel mit Dach `tafel`, 3–4 × 18), Ortsschild „Maple Falls“ (Rückseite zum Betrachter, 6 × 18); südlich nah der Fluss (Reihen 20–23) mit Schilf; Feld der Brennans beginnt im Norden                                        | Tafel (Torwächter für S1)              |
| L2 (15–30) Kuhweide   | Weide am Fluss           | Weg kurvt nach Norden (Reihen 13–14); südlich die **Kuhweide** (Reihen 19–24) mit Weidetor „Bitte schließen“ (`weidetor`); darin die ausgebüxten Kühe vom Kürbishof Miller                                                         | Kühe (N1), Weidetor                    |
| L3 (30–45) Kornfeld   | Feld der Brennans        | im Norden Korn bis zum Rand (Regel 6.3), Vogelscheuche im Feld; Otis mit dem Traktor am Feldrand am Weg                                                                                                                            | Krähen, Otis                           |
| L4 (45–60) Abzweig    | Kreuzung, Herz des Weges | einzige Kreuzung: nach Norden der Feldweg zum Kürbishof (Gatter S1 in Reihe 11, Spalten 52–53), dort der **Wegweiser** (Maple Falls ←, Cedar Creek →, Hof Miller ↑); südlich gegenüber **Apfelstand** mit Ada, Schuppen, Obstwiese | Gatter S1, Apfelstand (N-W1), Schuppen |
| L5 (60–75) Mais       | Millers Mais             | nördlich hinter dem Abzweig Millers Mais bis Nord- und Ostrand; (Wanderer) auf dem Weg; im Graben das Hufeisen                                                                                                                     | **Hufeisen** (`fundHufeisen`)          |
| L6 (75–90) Rast       | Pause am Heuhaufen       | Weg kurvt nach Süden (Reihen 16–17); Heuhaufen, (Bank direkt am Weg, Blick über den Mais; Nia daneben `gegnerin`), zwei Laubbäume, einer schon rot                                                                                 | Nia (Straßengegnerin)                  |
| L7 (90–105) Büsche    | Versteck am Feldrand     | (dichte Büsche am Ende des Maisfelds mit Lücke von oben, `fundFormular`)                                                                                                                                                           | **Partieformular**                     |
| L8 (105–120) Ausblick | Übergang zum Flussweg    | Hase am Feldrand, Tessa läuft vorbei; am Ostrand sieht man schon Erlen am Fluss                                                                                                                                                    | Sichtachse auf die Erlen               |

Besitz und Lage (Befund 11): Nordwesten Feld der Brennans (Vogelscheuche, Traktor), Nordosten hinter
dem Abzweig Millers Mais, Süden die Kuhweide (Millers Kühe sind hineingelaufen) und die Obstwiese
der Brennans mit dem Apfelstand am Abzweig. Ränder: Norden Feld und Mais, Süden Fluss, Westen und
Osten nur der Weg.

### 1.2 Flussweg (`wegMapleCedar.flussweg`, 120 × 30)

Der Uferweg (Erde, zwei Felder) läuft am Westrand in den Reihen 15–16 an, folgt dem Fluss mit zwei
Bögen nach Süden (F3 und F5, bis Reihe 18) und steigt am Ende wieder auf die Reihen 15–16. Der Fluss
liegt südlich (Uferkante ab Reihe 20, Wasser bis zum Süd-, West- und Ostrand). Nördlich Erlen und
Ahorne in Gruppen. Reihenfolge der Stationen nach Befund 29: Münzen, Fährstelle, Rastbank, Steg.
Laufzeit etwa 125 Kacheln, gut 35 s.

| Abschnitt (Spalten)      | Thema              | Inhalt                                                                                                                                              | Zum Entdecken      |
| ------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| F1 (0–15) Erlen          | Schatten am Wasser | Erlen über dem Wasser, Nebel als Belebung am Morgen (feste Tönung je Szene, keine Uhrzeit)                                                          | Nebel, Libellen    |
| F2 (15–30) Baumgruppe    | Fund unter Bäumen  | Baumgruppe nördlich des Weges, darunter die Münzen (`fundMuenzen`)                                                                                  | **Münzen**         |
| F3 (30–45) Fährstelle    | alte Fähre         | **Abzweig** zum Ufer (3 Felder lang): Stein der Fährleute (`faehrstein`, N-W2), Fährpfosten (`faehrpfosten`)                                        | Fährstein, Pfosten |
| F4 (45–60) Rastbank      | Aussicht           | (Rastbank `rast` direkt am Weg, Blick nach Süden auf das Wasser), Reiher im Schilf                                                                  | Aussicht, Reiher   |
| F5 (60–75) Steg          | Angler             | **Abzweig** zum Steg; (Steg auf Pfählen, beginnt am Ufer, ragt bis Reihe 25 ins Wasser) mit Silas (heute Statist Angler)                            | Silas, Steg        |
| F6 (75–90) Ufer          | Picknickstelle     | am Ufer der Korken mit eingebranntem Springer (`fundKorken`)                                                                                        | **Korken**         |
| F7 (90–105) Wiese        | Blumen             | Wildblumen, Schmetterlinge, Tessa                                                                                                                   | Schmetterlinge     |
| F8 (105–120) Ortseingang | Ankunft            | (Ortsschild „Cedar Creek, gegr. 1851“ `schildCedar`, südlich des Weges, Schrift zum Betrachter); Sichtachse auf den Bibliotheksturm über den Zedern | Ortsschild, Turm   |

### 1.3 Zedernpfad (Q1, `wegMapleCedar.zedernpfad`, neu, 100 × 24)

Abkürzung über die Hügelkuppe, Befunde 22 und 28. Der Pfad (Erde, zwei Felder) beginnt am **Südrand**
bei den Spalten 10–11 (Anschluss an den Nordrand des Parks von Maple Falls bei den Spalten 10–11,
hinter dem Fußsteg über den Fluss im Nordwesten des Parks; daneben der Steg S5), steigt durch Zedern nach Nordosten zur **Kuppe** (Spalten 55–65,
Reihen 3–8) und fällt zum **Ostrand** in den Reihen 4–5 ab (Anschluss an den Nordwesten von Cedar
Creek). Länge etwa 105 Kacheln, etwa 29 s.

- **Stamm** (Sperre S2) quer über den Pfad bei Spalte 45, also auf der **Maple-Falls-Seite** der
  Kuppe; von dort sieht man die Kuppe. Im Park steht am Fußsteg nur das Schild „Sturmschaden“
  (`schildZedernpfad`, verschwindet nach der Öffnung; `orte/maple-falls.md`).
- **Kuppe** mit Bank (`aussichtKuppe`): Blick auf beide Orte und die Brückenbaustelle nach Riverton.
  Von Cedar Creek aus von Anfang an erreichbar.
- Fund „Zedernzapfen mit Initialen“ an der Kuppe; Abschnitte zu je etwa 15 Spalten mit Zedern,
  Felsen, Pilzen und einem Specht als Belebung.

### 1.4 Cedar Creek (`cedarCreek.aussen`, 60 × 40)

Abschnitte zu je 14 × 12 Kacheln (vier Spalten, drei Reihen: A Nord, B Mitte, C Süd).

```
                                                   N
 Spalte:  0            14            28            42         56
 Reihe 0  ┌────────────┬────────────┬────────────┬──┬────────┬──┐
  Westrand│Q1 Zedernpfad (R4–5)                 │U │ ~Bach~ │Z │
 R4–5 ════╗ Zedernwiese, Pfad nach SO           │f │        │e │
          ║                       Zedern        │e │══Brücke════╪═ Ostrand R8–9 → Zedernwald (Akt 2)
 Reihe 12 ├──╨─────────┼────────────┼────────────┤r │        │d │
          │[Drechslerei 8][Waschs. 7][Bibliothek 11, Turm]  │w │═Steg   │e │
          │   Tür 6    L  Tür 15   L Tür 25 L Bücherk. Tafel│e │        │r │
 Reihe 19 │── Gehweg Nord ──────────────────────────[Halt.]──│g │        │n │
 R20–21 ══╪═ Hauptstraße ════════════════════════ Wendeplatz══│  │        │  │
 Reihe 22 │── Gehweg Süd ──────────────────────────────────  │  │        │  │
 Reihe 24 ├────────────┼────────────┼────────────┤  │        │  │
          │[Haus Süd 1 Holm][Haus Süd 2] Zedernwiese (Ast)   │  │Kanuverleih│
          │ Zedernhecke    Pforten       Bank zum Bach       │  │ Eisvogel│  │
 Reihe 35 └────────────┴────────────┴────────────┴──┴────────┴──┘
                                                   Bach oben und unten bis zum Rand
```

- **Hauptstraße**, asphaltiert, zwei Felder breit, Reihen 20–21; sie kommt am Westrand vom Flussweg
  (Auslöser `flussweg`) und endet im Osten am **Wendeplatz** (Spalten 34–40, Reihen 18–23).
  Gehweg Nord Reihe 19, Gehweg Süd Reihe 22, Bordsteinkanten beidseitig, bis zum Westrand und um den
  Wendeplatz herum (Regel 9.2.1). Die Straße hat eine leichte Biegung bei Spalte 30, damit der
  Bibliotheksturm am Ende der Straße steht (Sichtachse vom Westrand).
- **Nordseite** (Türen unten in der Fassade, Reihe 18; Treppen und Vorplätze auf dem Gehweg Nord):
  - **Drechslerei Dunmore** (Spalten 2–9, Fassade 8, Tür Spalte 6), Holzstapel vor der Tür; neu aus 12.
  - Laterne bei Spalte 11.
  - **Waschsalon** (Spalten 12–18, Fassade 7, Tür Spalte 15), Neonschild, Markisen, Hund vor der Tür.
  - Laterne bei Spalte 19; im Rinnstein der Messingknopf (`fundKnopf`).
  - **Bibliothek** (Spalten 20–30, Hauptbau 11 breit mit Turm in der Mitte), Treppe mit drei Stufen
    zur Doppeltür im Turm (Spalte 25), Laternen links und rechts der Treppe, Bücherkasten an der Tür
    (`buecherkasten`), Zwillinge auf der Treppe, Schaukasten an der Fassade (Platzhalter, 13 §7.4).
  - **Anschlagtafel** (Spalte 32, Reihe 19) mit `plakat` und `raetselDerWoche`, wechselnde Zettel je
    Akt (Platzhalter); **Bushaltestelle** mit Wartehäuschen an der Bordsteinkante des Wendeplatzes
    (Spalten 34–36, Reihe 19; `bushaltestelle`, `busZurueck`), offene Seite zum Gehweg; Mr. Kettering
    mit Thermoskanne; im Häuschen die Bank, auf der Victor sitzt (Szene 21).
- **Haltepunkt der Bahn** (neu, Befund 8 der Prüfung Akt 2): Ein Gleis läuft an der Nordkante (Reihen 1–2)
  von Spalte 12 nach Osten, quert den Bach auf einer Holzbrücke (Spalten 50–55) und verlässt die Karte am
  Ostrand Richtung Riverton; im Westen endet es an einem Halteschild (11, 2). Darunter der gepflasterte
  Bahnsteig (Spalten 12–21, Reihen 3–4) mit grüner Bank, Stationsschild „Cedar Creek“, Fahrplantafel
  („Riverton: jeden Tag“, ohne Uhrzeiten) und dem Auslöser `bahnhof` (14, 3). Laufweg vom Platz über den
  Zedernpfad (Spalten 10–11) und dessen Ostende (Reihe 4) auf den Bahnsteig. Der Uferweg beginnt dafür
  erst in Reihe 3.
- **Hinter den Häusern** (Abschnitte A1 bis A3): Zedernwiese mit lockeren Zedern; der **Zedernpfad**
  kommt am Westrand in den Reihen 4–5 an und führt als Erdweg nach Südosten zum Gehweg Nord neben der
  Drechslerei (Spalte 10).
- **Südseite** (Abschnitte C1 bis C3): **Haus Süd 1** von Mrs. Holm (Spalten 3–9) mit Zedernhecke
  (`zedernhecke`), **Haus Süd 2** (Spalten 12–18), beide mit Vorgarten, Zaun, Pforte zum Gehweg Süd,
  Plattenweg zur Tür in der Nordfassade, Briefkasten außen an der Pforte; östlich davon die
  **Zedernwiese** bis zum Südrand mit dem Ast (`ast`, N-CC2) und einer Bank am Uferweg mit Blick auf
  den Bach.
- **Uferweg** (Erde, Spalten 41–42) von Nord- bis Südrand, am Wendeplatz an die Straße angeschlossen.
- **Bach** (Spalten 43–49) von Nord- bis Südrand, Uferkante beidseitig, Schilf am Westufer. Der
  **Steg** (`steg`) beginnt am Westufer in Reihe 14 und ragt bis Spalte 47 ins Wasser; Rosa an seinem
  Ende, der Stegbauer erneuert Bretter; Platz für eine zweite Angel und Eis am Ufer (Platzhalter).
  Südlich des Stegs am Westufer der **Kanuverleih** von Hattie Quill (Spalten 37–42, Reihen 26–29,
  Kulisse mit umgedrehtem Kanu); am Ufer südlich davon die Eisvogelfeder (`fundFeder`).
- **Ostufer und Brücke:** Zedernwald (Spalten 50–55). Eine **Holzbrücke** quer über den Bach in den
  Reihen 8–9; dahinter führt ein Waldweg (zwei Felder) über den **Ostrand** in den Zedernwald
  (`zedernwald`, erst nach `endeAkt1Gesehen`; bis dahin das Schild „Weg gesperrt, Brückenarbeiten“
  als eigenes Objekt an der Brücke).

### 1.5 Gebäude und Maße

| Gebäude                       | Außen (Fassade, Kacheln)                                                                | Innen (7a.2)                                                     | Begehbar |
| ----------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- |
| Bibliothek (1890)             | Backstein, 18 breit mit Turm links (Victorian House 5), Tür im Turm bei 3 von 18 (17 %) | Lesesaal `bibliothek` 22 × 16, Tür Südwand Spalte 4 (18 %)       | ja       |
| Archiv (Keller)               | – (unter dem östlichen Teil der Bibliothek)                                             | `archiv` 14 × 11, liegt unter den Spalten 8 bis 21 des Lesesaals | ja       |
| Waschsalon Mr. Boateng        | Flachbau, Fassade 8, Tür bei 4 von 8 (50 %)                                             | `waschsalon` 14 × 11, Tür Südwand Spalte 7 (50 %)                | ja       |
| Drechslerei Dunmore (neu)     | kleine Holzscheune, Fassade 8, Rolltor bei 2 von 8 (25 %)                               | `drechslerei` 16 × 11, Tür Südwand Spalte 4 (25 %)               | ja       |
| Haus Süd 1 (Holm), Haus Süd 2 | Holz, je Fassade 7, Tür in der Nordfassade zur Straße                                   | –                                                                | nein     |
| Kanuverleih                   | Bootsschuppen am Ufer, 6 breit                                                          | –                                                                | Kulisse  |
| Bushaltestelle                | Wartehäuschen 3 breit                                                                   | –                                                                | Kulisse  |

Die Fassade ist halb so breit wie das Erdgeschoss innen, die Tür sitzt außen und innen an derselben
relativen Stelle (±1 Kachel). Treppen liegen übereinander: Die Kellertreppe der Bibliothek liegt an
der Nordwand bei Spalte 19 (Nordostbereich des 22 breiten Saals), die Treppe im Archiv deshalb bei
Spalte 11 (19 − 8).

Abweichung Bibliothek: Den ganzen Backsteinbau mit Turm gibt es im Katalog nur als Victorian House 5,
18 Kacheln breit (Regel: 11). Er bleibt in dieser Breite, weil er das größte Haus des Ortes sein soll;
die Tür sitzt unten im Turm links (3 von 18), innen deshalb bei Spalte 4.

### 1.6 Übergänge

| Von (Karte, Auslöser, Feld)                                          | Nach (Karte, Auslöser, Feld)                                                  | Lage                                                                                                   |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| mapleFalls.park `landstrasse` (Ostrand, Spalte 43, Reihen 15–17)     | landstrasse `zurueckPark` (Westrand, Spalte 0, Reihen 15–17)                  | Parkstraße und Feldweg je drei Felder, gleiche Reihen (mit mittel-1 abgestimmt)                        |
| landstrasse `weiterFluss` (Ostrand, Spalte 119, Reihen 15–16)        | flussweg `zurueckLandstrasse` (Westrand, Spalte 0, Reihen 15–16)              | Feldweg geht in den Uferweg über                                                                       |
| flussweg `weiterCedar` (Ostrand, Spalte 119, Reihen 15–16)           | cedarCreek.aussen `flussweg` (neu, Westrand, Spalte 0, Reihen 20–21)          | Uferweg geht in die Hauptstraße über; Dialog `ankunft_zu_fuss` bleibt an `weiterCedar`                 |
| mapleFalls.park `zedernpfad` (neu, Nordrand, Spalten 10–11, Reihe 0) | zedernpfad `zurueckPark` (neu, Südrand, Spalten 10–11, Reihe 23)              | hinter dem Fußsteg über den Fluss; Pfad je zwei Felder                                                 |
| zedernpfad `weiterCedar` (neu, Ostrand, Spalte 99, Reihen 4–5)       | cedarCreek.aussen `zedernpfad` (neu, Westrand, Spalte 0, Reihen 4–5)          | Pfad je zwei Felder; Sperre S2 liegt westlich der Kuppe                                                |
| mapleFalls.park `bushaltestelle` (Dialog, Reise)                     | cedarCreek.aussen `bushaltestelle` (44, 19)                                   | Busfahrt                                                                                               |
| cedarCreek.aussen `busZurueck` (43, 19, Dialog, Reise)               | mapleFalls.park `bushaltestelle`                                              | Busfahrt zurück                                                                                        |
| riverton.bahnhofshalle `zugCedar` (Dialog, Reise; riverton.md 1.8)   | cedarCreek.aussen `bahnhof` (14, 3), Ankunft auf dem Bahnsteig                | Zug, 10 Münzen, frei nach der Nadel von Riverton; die Rückfahrt (Dialog am Bahnsteig) folgt in Runde 5 |
| aussen `drechslereiTuer` (4, 19)                                     | drechslerei `drechslereiAusgang` (Südwand, Spalte 4)                          | hinein nach Norden                                                                                     |
| aussen `waschsalonTuer` (16, 19)                                     | waschsalon `waschsalonAusgang` (Südwand, Spalte 7)                            | hinein nach Norden                                                                                     |
| aussen `bibliothekTuer` (25, 19)                                     | bibliothek `bibliothekAusgang` (Südwand, Spalte 4)                            | hinein nach Norden                                                                                     |
| bibliothek `kellertreppe` (Nordwand, Spalte 19)                      | archiv `kellerAusgang` (Nordwand, Spalte 11)                                  | Treppen übereinander; oben nach unten, unten nach oben (Regel 2.4)                                     |
| aussen `zedernwald` (Ostrand, Spalte 59, Reihen 8–9)                 | wegCedarRiverton.zedernwald `zurueckCedar` (Westrand, Reihen 8–9 nach Neubau) | nach der Brücke; nur nach `endeAkt1Gesehen`                                                            |

Umgesetzt (Runde 4, mittel-2): Karte `cedarCreek.drechslerei` mit `drechslereiTuer` und
`drechslereiAusgang`, Auslöser `flussweg` (Westrand, Reihen 20–21), `weiterCedar.ziel` auf `flussweg`,
`zurueckCedar` (Weg nach Riverton) auf `zedernwald`, Auslöser `zedernpfad` (Westrand, Reihen 4–5)
mit `zedernWeiterCedar` als Gegenstück.

Änderungen in `orte.json` für den Haupt-Chat: neue Auslöser `flussweg` und `zedernpfad` auf
`cedarCreek.aussen`, `zedernpfad` auf `mapleFalls.park`, neue Karte `wegMapleCedar.zedernpfad` mit
`zurueckPark` und `weiterCedar`, `weiterCedar.ziel` auf den Auslöser `flussweg`, Drechslerei als neue
Innenkarte; dazu die Auslöser aus 12 (Abschnitt 7).

### 1.7 Platzhalter für die Rückkehr (13, Abschnitt 7.4)

- `cedarCreek.aussen`: Schild „Brückenarbeiten“ an der Brücke (Objekt mit Bedingung); Anschlagtafel
  mit Zetteln je Akt; zweite Angel und Eis am Ufer (Akt 3); Schaukasten an der Bibliothek (Zeitung von
  1858 ab Akt 2); Plakat von Perfect Move überklebt ab Akt 2.
- `cedarCreek.bibliothek`: Wand oder Vitrine für die Kopie von Hales Seite (Post-Game).
- `cedarCreek.archiv`: dunkles Regal in einer Ecke, das erst mit Laterne etwas zeigt (R3).
- `wegMapleCedar.landstrasse`: Gatter mit Feldweg zum Kürbishof (S1), Weidetor; Platz für die drei
  Kühe auf der Weide (Objekte, die nach der Kuhsuche verschwinden).
- `wegMapleCedar.zedernpfad`: der Stamm als Objekt, das nach der Clubnadel verschwindet; Holzstapel
  vor der Drechslerei wächst danach (Mr. Dunmore nimmt das Holz mit).

## 2. Ortsbild

Hinter dem Stadtpark von Maple Falls rollt man über eine kleine Brücke, unter der der Fluss nach
Süden abbiegt, und dann wird die Parkstraße zu einem Feldweg. Mit dem Asphalt endet auch das
Rauschen des Wasserfalls; hier hört man den Wind im Korn. Das Feld der Brennans reicht bis an den
Himmel, nur eine Vogelscheuche mit verbeultem Hut steht darin, und am Feldrand tuckert Otis auf
seinem roten Traktor. Am Abzweig zum Hof der Millers verkauft Ada Äpfel aus einer Kiste mit
Ehrlichkeitskasse, und hinter dem Gatter wogt der Mais. Auf der Weide zwischen Weg und Fluss grasen
Kühe, die eigentlich gar nicht hierher gehören. An der Bank neben dem Heuhaufen sitzt manchmal ein
Mädchen mit Magnetschachspiel und wartet auf jemanden, der sich traut.

Wo der Weg dem Fluss näherkommt, wird er weich und schattig. Erlen hängen über das Wasser, morgens
liegt Nebel auf dem Fluss, und ein Reiher steht so still im Schilf, dass man ihn für einen Pfahl hält,
bis er den Kopf dreht. An der alten Fährstelle liegt ein flacher Stein mit eingeritzten Feldern; ein
Stück weiter ragt ein Steg ins Wasser, auf dem fast immer ein alter Angler sitzt, der nie etwas fängt
und nie traurig darüber ist. Am Ende des Weges steht ein grün gestrichenes Schild mit weißen
Buchstaben: „Cedar Creek, gegr. 1851“. Über den Zedern sieht man schon einen Turm.

Cedar Creek ist kleiner als Maple Falls, und es scheint das zu wissen. Die Hauptstraße ist kurz und
endet, ehe sie richtig angefangen hat, an einem Wendeplatz vor dem Bach. Rote Zedern stehen um den
Ort wie ältere Verwandte, die aufpassen, und ihr Holz riecht warm, wenn die Sonne darauf fällt; am
stärksten vor der Drechslerei von Mr. Dunmore, vor deren Tür sich Späne und Holzscheite stapeln.
Der Bach ist schmal und schnell, er glitzert unter dem Steg und murmelt Tag und Nacht dasselbe Lied.

Über allem steht die Bibliothek. Sie wurde 1890 aus rotem Backstein gebaut, als man noch glaubte,
ein Ort brauche zuerst ein Haus für Bücher und dann alles andere. Ihr Turm hat ein Schieferdach, an
dem ein Eichelhäher sitzt; drei Stufen führen zu einer hölzernen Doppeltür, deren Messinggriffe von
hundert Jahren Händen hell gerieben sind, und auf den Stufen streiten zwei Zwillinge darüber, ob der
König springen darf. Drinnen riecht es nach Papier, Bohnerwachs und ein wenig nach Kaffee aus der
Kanne hinter dem Tresen; grüne Leselampen werfen runde Lichtinseln auf die Tische, an denen
nachmittags der Schachclub von Mrs. Okafor sitzt. Unter dem Lesesaal, eine schmale Treppe hinunter,
liegt das Archiv: Kartons mit Jahreszahlen, eine Lampe, die flackert, wenn oben jemand über die
Dielen geht, und der kühle Geruch von Papier, das älter ist als alle Menschen im Ort.

Zwischen Drechslerei und Bibliothek brummt der Waschsalon von Mr. Boateng, ein Flachbau mit rot-weißen
Markisen und einem Neonschild, bei dem ein Buchstabe fehlt. Vor der Tür liegt ein Hund, der zu
niemandem gehört und allen. Gegenüber stehen zwei kleine Holzhäuser mit Blumenkästen unter den
Fenstern; an der Zedernhecke des ersten schneidet Mrs. Holm jeden Morgen dieselben drei Zweige. An der
Bushaltestelle trinkt Mr. Kettering, der Fahrer des klappernden Überlandbusses, Kaffee aus einer
Thermoskanne, bevor er zurück nach Maple Falls fährt. An der Anschlagtafel daneben hängen Zettel vom
Gemeindefest, das Rätsel der Woche, eine Katze wird vermisst, und mitten darauf klebt ein glänzendes
Plakat, das nicht hierher passt: „Perfect Move – Schach für die Zukunft. Bald auch in deiner Stadt.“

Am Bach, auf dem Steg, sitzt Rosa mit ihrer Angel und einem Brett mit Magnetfiguren. Im Schilf
neben ihr liegt seit zwei Jahren ein verrosteter Schlüssel, den keiner vermisst. Weiter südlich
spielt Hattie Quill auf einem umgedrehten Kanu Schach gegen jeden, der vorbeikommt. Abends, wenn die
Sonne hinter den Zedern verschwindet, kommen die Kinder mit einem Teleskop zum Steg, und auf der
anderen Seite des Baches führt eine alte Holzbrücke in den Wald, durch den man eines Tages nach
Riverton gehen wird. Die Zeit geht hier langsamer. Niemand in Cedar Creek findet das schlimm.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

Figuren, kleine Aufgaben und Funde aus `12_Akt1_Leben.md` (Abschnitte 2 und 3) kommen zu dieser
Tabelle hinzu; hier stehen die Szenen der Story-Bibel und die Wege.

| Karte       | Szenen                          | Figuren                                                                               | Auslöser und Gegenstände                                                                                                                                                                | Belebung                                             |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| landstrasse | Route 1 (W4)                    | Nia (Straßengegnerin, Begegnung `wegMapleCedar.nia`), Wanderer; Ada, Otis, Tessa (12) | `zurueckPark`, `weiterFluss`, `tafel` (Runde `wegMapleCedar.tafel`), `fundFormular`; Gatter S1, `apfelstand`, `schuppen`, `weidetor`, `fundHufeisen` (12)                               | Joggerin (Tessa), Radfahrer, Kühe, Hase, Reh, Krähen |
| flussweg    | Route 1 (W4)                    | Silas (12)                                                                            | `zurueckLandstrasse`, `weiterCedar` (Ankunftsdialog), `fundMuenzen`, `faehrstein`, `faehrpfosten`, `rast`, `fundKorken`, `schildCedar`                                                  | Reiher, Hase, Schmetterling; Nebel am Morgen         |
| zedernpfad  | Q1 (13)                         | Mr. Dunmore beim Stamm (nach der Clubnadel)                                           | `zurueckPark`, `weiterCedar`, Stamm (S2), `aussichtKuppe`, Zedernzapfen                                                                                                                 | Specht, Eichhörnchen                                 |
| aussen      | 14, 21, 22, 23, 25; Akt 2 (Weg) | Rosa (Steg), Victor (Szene 21); Coach, Juno, Sam (Szene 14); Figuren aus 12           | `bushaltestelle`, `busZurueck`, `bibliothekTuer`, `waschsalonTuer`, `drechslereiTuer`, `plakat`, `steg` (Sterne, Ende Akt 1, Fund `schluessel`), `zedernwald`, `flussweg`, `zedernpfad` | Stegbauer, Hund, Reiher, Eichelhäher                 |
| bibliothek  | 15, 16, 24                      | Mrs. Okafor, Dex, Mae; Miss Ashby (12)                                                | `bibliothekAusgang`, `kellertreppe`, `zeitungsregal`, `globus`, `schildFluestern`; vier Bretter                                                                                         | –                                                    |
| archiv      | 18, 19, 20                      | Mrs. Okafor (zeitweise), Ambrose                                                      | `kellerAusgang`, `karton1858`, `programmheft`, `boxerfoto`, `wasserfleck`                                                                                                               | –                                                    |
| waschsalon  | 17                              | Mr. Boateng                                                                           | `waschsalonAusgang`, `trockner`, `zettelTurm`, `comicheft`, `automat`                                                                                                                   | Kundin                                               |
| drechslerei | – (12, N-CC2)                   | Mr. Dunmore                                                                           | `drechslereiAusgang`, `drehbank`, `figurenregal`, `fotoSaegemuehle`                                                                                                                     | –                                                    |

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

| Element                                  | Entscheidung                                                                                      | Grund                                                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Größen                                   | Landstraße und Flussweg je 120 × 30, Zedernpfad 100 × 24, Cedar Creek 56 × 36, Bibliothek 22 × 16 | `KARTENREGELN.md` 7a.2 (Befund 6); heutige Karten 34 × 22, 28 × 20, 44 × 24, 18 × 14.                                               |
| Ankunft zu Fuß an der Bushaltestelle     | geändert: Ankunft am Westrand auf der Hauptstraße; mit dem Bus weiter an der Haltestelle          | Wege laufen über den Rand weiter (Regel 5.1, Übergangsprüfung); wer läuft, kommt nicht aus einem Bus.                               |
| Zedernwald am Westrand                   | geändert: Ostrand, über eine Holzbrücke über den Bach                                             | Bibel 10.1: Waldweg „ab dem Steg, am Bach entlang“; Reiserichtung West → Ost; der Westrand gehört Flussweg und Zedernpfad.          |
| Bach „rechts“                            | bleibt, reicht oben und unten bis zum Rand, mit Uferweg und Ufer beidseitig                       | Ortsprofil (Pflicht), Regeln 6.4 und 9.7.1.                                                                                         |
| Wasser auf Landstraße und Flussweg       | Fluss von Maple Falls im Süden beider Karten, nach der Brücke im Park (Befund 5)                  | Ein durchgehender Fluss; der Bach von Cedar Creek mündet südlich des Ortes in ihn.                                                  |
| Victor auf der Bank auf der Wiese        | geändert: Victor sitzt im Wartehäuschen der Bushaltestelle                                        | Szene 21: „sitzt allein an der Bushaltestelle“. Die Wiesenbank bleibt, zum Bach gewandt (Ortsprofil).                               |
| Waschsalon am Westende                   | geändert: Drechslerei am Westende, Waschsalon in der Mitte                                        | 12, Abschnitt 3 (Befund 6).                                                                                                         |
| Zwei kleine Wohnhäuser                   | bleiben, Haus Süd 1 mit Mrs. Holm (12)                                                            | Ortsprofil (Nachbarschaft); Häuser an der Straße mit Grundstück (Regeln 5.3, 9.3).                                                  |
| Plakat von Perfect Move „an einer Mauer“ | geändert: auf der Anschlagtafel neben der Haltestelle                                             | Eine Tafel erklärt, warum dort ein Plakat hängt (Regel 5.8).                                                                        |
| Bibliothek mit Turm, Treppe und Laternen | bleibt; Laternen symmetrisch an der Treppe; Turm als Sichtachse am Ende der Straße                | Bibel 3.2, Weltbeschreibung 5.3, Regel 9.3.4, README (große Außenkarten).                                                           |
| Kellertreppe im Archiv                   | geändert: Nordwand, Spalte 11 (unter der Kellertür der Bibliothek)                                | Treppen liegen übereinander (Regel wie Maple Falls).                                                                                |
| Wegweiser auf der Landstraße             | nur am Abzweig zum Kürbishof, mit drei Richtungen                                                 | Regel 5.8 und Ortsprofil („Wegweiser nur an einer Kreuzung“).                                                                       |
| Traktor mitten im Feld                   | geändert: am Feldrand am Weg (Otis)                                                               | Regel 6.3 und Ortsprofil; Befund 11.                                                                                                |
| Zedernpfad                               | neu (Q1), Stamm auf der Maple-Falls-Seite der Kuppe, Kuppe von Cedar Creek aus offen              | 13, Befund 22; Mr. Dunmore räumt den Stamm (Befund 34).                                                                             |
| Brücke zum Zedernwald                    | neu; in Akt 1 mit Schild „Weg gesperrt, Brückenarbeiten“                                          | Der Übergang ist erst nach `endeAkt1Gesehen` offen; das Schild erklärt die Sperre in der Welt. Der Stegbauer (Belebung) passt dazu. |
| Busfahrer raucht                         | entfällt: Mr. Kettering trinkt Kaffee aus der Thermoskanne                                        | Entscheidung des Haupt-Chats (12, Kinderspiel).                                                                                     |
| Teleskop, Sternennacht                   | nur Dialog (Szene 22, Abend am Steg)                                                              | kein eigenes Bild nötig.                                                                                                            |
| Schlüssel im Schilf                      | über den Dialog am Steg (`steg`, `gibFund("schluessel")`), kein eigenes Objekt                    | wie heute; das Schilf am Westufer neben dem Steg ist der Ort.                                                                       |

### 3.3a Runde 8: Größe der Innenräume (KARTENREGELN 10.56, mittel-1)

Geprüft nach Gebäude außen und Zweck; alle Räume bleiben, wie sie sind:

| Raum        | Gebäude außen (Kacheln)          | Größe   | Begründung                                                                                           |
| ----------- | -------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| Bibliothek  | Bibliotheksbau mit Seiteneingang | 22 × 17 | Lesesaal mit Regalreihen, Spieltischen und Ausleihe; der größte Raum des Orts.                       |
| Archiv      | Keller der Bibliothek            | 14 × 11 | Ein Kellerarchiv ist eng: Regale, Kisten, Treppe nach oben.                                          |
| Waschsalon  | Waschsalon 8 × 9                 | 14 × 11 | Zwei Reihen Maschinen, Bank, Getränkeautomat; so groß wie ein kleiner Waschsalon an der Hauptstraße. |
| Drechslerei | Werkstatt 8 × 10                 | 16 × 11 | Werkbank, Drehbank, Holzlager; eine Werkstatt für einen Handwerker.                                  |

### 3.4 Runde 8: Zustände der Innenräume (KARTENREGELN 10.63, mittel-1)

| Karte                    | Zustand    | Bedingung        | Zustand: wann, was, warum                                                                                                 |
| ------------------------ | ---------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `cedarCreek.archiv`      | `geordnet` | `archivGeordnet` | Nach der Nebenaufgabe „Das Archiv“ (Szene 18) stehen statt der nassen Kartons trockene, geschlossene Kartons.             |
| `cedarCreek.bibliothek`  | –          | –                | Kein fester Wechsel.                                                                                                      |
| `cedarCreek.waschsalon`  | –          | –                | Boateng klebt nach dem Rätsel eine neue Stellung auf; das ist ein Zettel auf dem Trockner, zu klein für ein eigenes Bild. |
| `cedarCreek.drechslerei` | –          | –                | Kein fester Wechsel.                                                                                                      |

## 4. Bühnenbilder

Runde 4 (9.11.2026). Je Karte Größe, Wände, Böden, Laufwege, Zonen und Inventar; die Möbel stehen in
`inhalte/abenteuer/moebel/cedar-creek.json` mit der Vorsilbe `cc4`, die Szenen in `inhalte/abenteuer/szenen/`.
Feld = linke obere Kachel (Spalte, Reihe). Bilder ohne sichere Katalogbeschreibung habe ich selbst
angesehen und in `inhalte/abenteuer/katalog_korrekturen/mittel-2.json` beschrieben.

### 4.1 Waschsalon (`cedarCreek.waschsalon`)

**Größe:** 14 × 11 (öffentlicher Raum nach 7a.2). Nordwand Reihen 0–2 (Krone, zwei Reihen Wandfläche
hellgrau), Boden ab Reihe 3 weiße Fliesen, Südwand Reihe 10 mit der Eingangstür bei Spalte 7 (50 %,
wie außen Spalte 4 von 7). Ein Fenster neben der Tür in der Südwand (Ortsprofil) zeigt die Ansicht
nicht; das Licht kommt wie in allen Räumen von Norden.

**Stimmung:** Vormittag, Maschinen brummen gleichmäßig, Waschpulver und warme Wäsche.

**Laufwege:** Tür (7, 10) → gerade nach oben zu den Arbeitstischen; links zu den Wartesitzen; rechts am
Automaten vorbei zur Pinnwand und zu den Trocknern. Reihe 4 bleibt frei vor allen Maschinen.

| Zone      | Gegenstand                                                          | Feld              | Ausrichtung            | Material, Stil, Zustand    | Zweck                                                      |
| --------- | ------------------------------------------------------------------- | ----------------- | ---------------------- | -------------------------- | ---------------------------------------------------------- |
| Nordwand  | acht schmale Waschmaschinen, lückenlos, zwei mit Wäschekorb obenauf | (1, 2) bis (8, 2) | Vorderseite unten      | weiß, modern, gebraucht    | Waschen                                                    |
| Nordwand  | zwei schmale Trockner (dieselbe Bauart)                             | (9, 2), (10, 2)   | Vorderseite unten      | weiß, modern, gebraucht    | Trocknen; auf dem linken das Steckschachbrett (`trockner`) |
| Nordwand  | Pinnwand mit Zetteln                                                | Wandfläche (9, 1) | –                      | Kork, einfach              | Zettel „Verloren: ein Turm“ (`zettelTurm` davor, (10, 4))  |
| Ecke NO   | Regal mit Waschmittel, Gläsern und Korb                             | (11, 1)           | Vorderseite unten      | weiß und Glas, gebraucht   | Waschmittelregal                                           |
| Ostwand   | Getränkeautomat, Leuchtfläche nach links                            | (12, 4)           | zeigt in den Raum      | Metall, modern             | `automat` davor (11, 5)                                    |
| Mitte     | zwei Arbeitstische aus Edelstahl                                    | (4, 5), (6, 5)    | –                      | Edelstahl, modern          | Falttisch; Mr. Boateng daneben (9, 7)                      |
| Mitte     | voller Wäschekorb                                                   | (8, 5)            | –                      | Korbgeflecht               | Spuren von Leben                                           |
| Westseite | drei Wartesitze in Reihe                                            | (1, 7)            | Sitzflächen nach unten | oranger Kunststoff, modern | Warten; Comicheft darauf (`comicheft`, (2, 8))             |
| Eingang   | Wäschekorb mit Pflanze obenauf, direkt neben der Tür                | (6, 8)            | –                      | Korbgeflecht               | Leben                                                      |
| Ecken     | Zimmerpflanzen                                                      | (1, 4), (12, 8)   | –                      | Pflanze, Keramik           | Regel 4.4                                                  |
| Eingang   | Fußmatte vor der Tür, Start                                         | (7, 9)            | Blick nach oben        | –                          | Ankunft (Regel 8.5)                                        |

Belebung: eine Kundin geht zwischen (9, 8) und (11, 8) auf und ab. Offen: Ein eigenes Trocknerbild gibt
es im Katalog nicht; die Trockner sind schmale Frontlader derselben Serie.

### 4.2 Archiv (`cedarCreek.archiv`)

**Größe:** 14 × 11. Nordwand Reihen 0–2 Backstein, Boden ab Reihe 3 Stein, Seiten- und Südwand eine
Reihe, keine Tür: Der einzige Ausgang ist die Treppe nach oben. Kühl, still, lange nicht benutzt.

**Laufwege:** Treppe (11, 3) → Start (11, 5), Antritt frei → nach links über die freie Mitte zum
offenen Karton (6, 5), nach unten rechts zum Lesetisch und zum Wasserfleck (10, 9).

| Zone     | Gegenstand                                                                    | Feld                                                       | Ausrichtung       | Material, Stil, Zustand  | Zweck                                                                               |
| -------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| Nordwand | steile Holztreppe nach oben                                                   | (10, 1), 3 × 4                                             | führt nach oben   | Holz dunkel, klassisch   | `kellerAusgang` (11, 3); unter der Kellertür der Bibliothek (Spalte 19 − 8)         |
| Nordwand | vier hohe Regale mit Zeitungsjahrgängen und Mappen                            | (1, 1), (3, 1), (6, 1), (8, 1)                             | Vorderseite unten | Holz, klassisch, alt     | Archiv; das Regal bei (8, 1) ist das dunkle Regal für die Laterne (R3, Platzhalter) |
| Nordwand | Boxerfoto im Goldrahmen                                                       | Wandfläche (5, 1)                                          | –                 | alt                      | `boxerfoto` (5, 3)                                                                  |
| Südwand  | Archivkartons in zwei dichten Reihen, hintere Reihe versetzt, bei 4 zwei hoch | vorn (1, 8), (3, 8), (5, 8); hinten (2, 7), (4, 7), (6, 7) | –                 | Pappe, gebraucht         | gestapeltes Archiv                                                                  |
| Mitte    | offener Karton „1850–1859“, frei nah am Lesetisch                             | (6, 4)                                                     | –                 | Pappe                    | `karton1858` (6, 5)                                                                 |
| Westwand | lückenlose Kartonsäule, hohe und flache im Wechsel                            | (1, 4) bis (1, 6)                                          | –                 | Pappe                    | geordnete Stapel an der Wand                                                        |
| Ecke SO  | Lesetisch mit aufgeschlagenem Buch, Stuhl direkt davor                        | Tisch (9, 7), Stuhl (9, 6)                                 | Stuhl zum Tisch   | Holz und Grün, klassisch | `programmheft` auf dem Tisch (10, 7)                                                |
| Ecke SO  | Stehlampe neben dem Tisch                                                     | (11, 6)                                                    | –                 | Holz, Stoffschirm        | Licht (Regel 4.4)                                                                   |
| Boden    | Wasserfleck in Form eines Springers                                           | (10, 9)                                                    | –                 | –                        | `wasserfleck`                                                                       |

Offen: Aktenschränke, Regale mit Archivkartons und ein Zeitungsstapel in Raumgröße fehlen im Katalog; die Regale
zeigen gebundene Bände und Mappen. Ein zweiter Tisch hätte den Raum über 45 % gefüllt und entfällt.

### 4.3 Drechslerei (`cedarCreek.drechslerei`, neu)

**Größe:** 16 × 11. Nordwand Reihen 0–2 Holz, Boden Dielen, Südwand Reihe 10 mit der Tür bei Spalte 4
(25 %, wie das Rolltor links in der Scheunenfassade, außen Spalte 4). Es riecht nach Zedernholz; Licht von Norden.

**Laufwege:** Tür (4, 10) → Start (4, 9) → nach oben; links zur Hobelbank und zu
Mr. Dunmore (2, 5), rechts zum Werktisch, zur Holzkiste und zu den Stämmen.

| Zone          | Gegenstand                                                 | Feld             | Ausrichtung       | Material, Stil, Zustand        | Zweck                                                                                                |
| ------------- | ---------------------------------------------------------- | ---------------- | ----------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Nordwand      | große Hobelbank mit Ablage und Bank (statt einer Drehbank) | (1, 1), 5 × 4    | Vorderseite unten | Holz hell, rustikal, gebraucht | Arbeitsplatz; darauf Bügelsäge, Späne und das gerahmte Foto (`drehbank`, `fotoSaegemuehle`, Runde 5) |
| Nordwand      | Holzregal mit Büchern und Schalen                          | (7, 1)           | Vorderseite unten | Holz, gebraucht                | `figurenregal` (Runde 5)                                                                             |
| Nordwand      | Werktisch mit Farbdosen, Pinseln, Rahmen                   | (10, 1), 3 × 3   | Vorderseite unten | Holz, rustikal                 | Bemalen der Figuren                                                                                  |
| Ecke NO       | Holzkiste mit Reststücken                                  | (13, 1)          | –                 | Holz und Metall                | Lager                                                                                                |
| Ostwand       | Stapel Rundholz, leere Holzkiste                           | (13, 4), (13, 7) | –                 | Holz                           | Lager                                                                                                |
| Ecke SW       | großer und kleiner Stapel Rundhölzer aus den Zedern        | (1, 8), (3, 8)   | –                 | Holz                           | Holzlager; Platzhalter für das Holz vom Zedernpfad (13 §7.4)                                         |
| Arbeitsplätze | zwei Holzhocker direkt an Hobelbank und Werktisch          | (3, 5), (11, 4)  | –                 | Holz                           | Sitz am Arbeitsplatz (Regel 4.1)                                                                     |

Offen: Der Katalog hat keine Drechselbank und kein Regal mit Holzfiguren; die Hobelbank vertritt die
Drehbank, das Regal zeigt Bücher und Schalen. Mr. Dunmore steht vorerst als Statist an der Hobelbank
(„dreht an der Drehbank“): Eine Figur braucht einen Dialog, und der kommt erst in Runde 5. Karte,
`drechslereiTuer` und `drechslereiAusgang` stehen in `orte.json`.

### 4.4 Bibliothek, Lesesaal (`cedarCreek.bibliothek`)

**Größe:** 22 × 16 (großer Saal nach 7a.2; vorher 18 × 14). Nordwand Reihen 0–2 hellgrau, Boden ruhige
Dielen (statt des unruhigen Parketts, Hinweis des Autors aus Runde 3), roter Teppich unter dem Schachtisch, Südwand Reihe 15 mit der Tür bei Spalte 4
(Turm links in der Fassade, Tür bei 3 von 18, außen Spalte 25). Zwei Fenster in der Nordwand.

**Laufwege:** Tür (4, 15) → Start (4, 14) → nach oben; rechts um den Schachtisch; rechts an
Lesetischen und Regalreihe vorbei zum Zeitungsregal und zur Kellertür (19, 3).

| Zone         | Gegenstand                                                                                           | Feld                                                              | Ausrichtung       | Material, Stil, Zustand             | Zweck                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------- | ----------------------------------- | ------------------------------------------------------------ |
| Nordwand     | hohe Bücherregale einer Serie                                                                        | (1, 1), (3, 1), (7, 1), (9, 1), (17, 1)                           | Vorderseite unten | Holz rotbraun, klassisch, gebraucht | Bibliothek                                                   |
| Nordwand     | zwei Fenster mit dunklem Holzrahmen                                                                  | Wandfläche (5, 1), (13, 1)                                        | –                 | Holz, Glas                          | Licht                                                        |
| Nordwand     | Pinnwand mit Schild „Bitte flüstern“                                                                 | Wandfläche (11, 1)                                                | –                 | Kork, klassisch                     | `schildFluestern` (11, 3)                                    |
| Nordwand     | niedriges Zeitungsregal                                                                              | (15, 1)                                                           | Vorderseite unten | Holz                                | `zeitungsregal` (16, 4)                                      |
| Nordwand     | Tür zur Kellertreppe                                                                                 | Wandfläche (19, 1)                                                | –                 | Holz                                | `kellertreppe` (19, 3); darunter liegt die Archivtreppe      |
| Mitte links  | Schachtisch aus zwei grünen Lesetischen mit vier Brettern (eines je Stuhlpaar) auf rotem Teppich     | (5, 7), (7, 7); Teppich Spalten 4–9, Reihen 5–9                   | –                 | Holz und Grün, klassisch            | Bibliotheksclub; Dex (4, 7), Mrs. Okafor (9, 7), Mae (6, 11) |
| Mitte links  | je vier gleiche Stühle oben (Blick nach unten) und unten (von hinten)                                | Reihe 6 und 8, Spalten 5–8                                        | zum Tisch         | Holz und Grün                       | Spieler                                                      |
| Mitte rechts | freistehende Regalreihe                                                                              | (13, 4), (15, 4), (17, 4)                                         | Vorderseite unten | Holz                                | Bücherreihe im Saal                                          |
| unten rechts | zwei Lesetische mit Leselampe, je ein Stuhl, Stehlampe                                               | Tische (13, 10), (16, 10); Stühle (13, 9), (16, 9); Lampe (18, 9) | Stühle zum Tisch  | Holz, Stoffschirm                   | Lesen                                                        |
| Eingang      | Ausleihtresen aus zwei Eckteilen (links mit Papier, rechts hoher Block), alte Registrierkasse darauf | (7, 11), (9, 11)                                                  | Vorderseite unten | Holz hell, klassisch                | Platz für Miss Ashby dahinter (Runde 5)                      |
| Ecke SO      | Globus                                                                                               | (19, 12)                                                          | –                 | Metall, klassisch, einmal je Ort    | `globus` (18, 12)                                            |
| Ecken        | Pflanzen                                                                                             | (1, 12), (20, 4)                                                  | –                 | Pflanze                             | Regel 4.4                                                    |

Nacharbeit nach der Wahl des Autors (Variante A, 9.11.2026 nachts, mittel-4): je Regalreihe ein
viertes Regal (11, 5) und (11, 9); niedrige Tür in der Südwand (`tuer_sued_holz`, (3, 16)), Matte
direkt davor; der Tresen ist ein ganzes Bild mit Kasse (8, 11) statt zweier Bauteile. Regale in
Seitenansicht für die Seitenwände (Regel 46) gibt es im Katalog nicht; gemeldet.

Belebung: eine Leserin geht zwischen (3, 13) und (9, 13). Platzhalter (13 §7.4): Für die Kopie von
Hales Seite (Post-Game) ist die Wandfläche rechts der Kellertür frei.

Folgen nach Durchsicht des Musters.

### 4.L Landstraße (`wegMapleCedar.landstrasse`, Bühnenbild, niedrig-1)

**Größe** 120 × 30, Norden oben. **Boden** Gras mit Varianten; Feldweg und Äcker aus Erde
(`e`, `f`); Fluss als Wasser mit Ufer über West-, Ost- und Südrand (Reihe 20 im Westen, ab Spalte 17
Reihe 26). **Rand** Randreihe als Gras (geschlossen), Felder und Fluss reichen optisch bis zum Rand.

**Wege:** Feldweg drei Felder breit (Reihen 15–17) bis Spalte 59, mit Kurve nach Norden in L2
(Reihen 13–15, Spalten 19–30); ab Spalte 60 zwei Felder (Reihen 15–16), Kurve nach Süden in L6
(Reihen 16–17), am Ostrand Reihen 15–16. Abzweig nach Norden zum Kürbishof bei Spalten 52–53 durch
das Gatter S1 (Lücke im Zaun, Reihe 11) bis zum Nordrand.

**Zonen und Inventar** (Feld = linke obere Kachel):

| Abschnitt            | Inventar                                                                                                                                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Norden, ganze Breite | Kornfeld der Brennans (Spalten 1–50, Korn auf jedem zweiten Feld), Vogelscheuche (10, 4), Traktor von Otis am Feldrand (36, 7, Blick links); Millers Mais (Spalten 54–118); durchgehender Holzzaun Reihe 11 (Satz Fence 4, Unterkante), Gatter-Lücke 52–53 mit Endpfosten |
| L1                   | Rätseltafel mit Dach (3, 12, `tafel`), Ortsschild „Maple Falls“ (7, 12) nördlich am Weg, Blick zum Weg                                                                                                                                                                    |
| L2                   | Kuhweide 17–29 × 18–24, geschlossener Zaun mit Ecken, Holztor oben (23–24) auf der Zaunlinie, Tränke innen am Zaun, Zettel „Bitte schließen“ am Tor; Kühe als Belebung                                                                                                    |
| L3                   | Krähen über dem Feld, Laubbaumgruppe südlich                                                                                                                                                                                                                              |
| L4                   | Weg biegt hier nach Süden (Reihen 18–20); Wegweiser mit drei Brettern an der Kreuzung (51, 16); nördlich direkt am Weg Adas Apfelstand (46, 14) mit Äpfeln, Geräteschuppen (56, 14), Obstwiese mit drei Apfelbäumchen in einer Reihe                                      |
| L5                   | Mais, Wanderer auf dem Weg (67, 16)                                                                                                                                                                                                                                       |
| L6                   | Bank direkt am Weg (80, 14, zum Weg), Nia daneben, zwei Heuhaufen, Laubbaum und roter Herbstbaum                                                                                                                                                                          |
| L7                   | Buschgruppe 94–102 × 12–14 mit Lücke von oben; `fundFormular` (97, 13)                                                                                                                                                                                                    |
| L8                   | Erlen am Fluss (106, 110, 114), Hase am Feldrand                                                                                                                                                                                                                          |

Kleinflora (Gras, Farn, Pilze, Blumen, Steine, kleine Büsche) in Gruppen von ein bis drei südlich
des Weges, Felsgruppen und Wildblumen vereinzelt. Belebung: Otis, Tessa (joggt), Radfahrer, Kühe,
Krähen, Hase, Reh. Offen: Hufeisen (`fundHufeisen`) und Weidetor als Auslöser folgen in Runde 5.

### 4.F Flussweg (`wegMapleCedar.flussweg`, Bühnenbild, niedrig-1)

**Größe** 120 × 30, Norden oben. **Boden** Gras mit Varianten, Weg aus Erde, Steg aus Stegbildern auf Brückenfeldern `h` über dem Wasser
(`d`), Fluss als Wasser mit Ufer im Süden (Reihen 20–21). **Rand** geschlossen, Übergänge West und
Ost in den Reihen 15–16.

**Wege:** Uferweg zwei Felder breit (Reihen 15–16) mit zwei Bögen nach Süden bis Reihe 17
(Spalten 30–47 und 60–77). Abzweig zur Fährstelle bei Spalten 38–39 (Reihen 18–19).

| Abschnitt  | Inventar                                                                            |
| ---------- | ----------------------------------------------------------------------------------- |
| Westen     | Baumgruppen im Norden, Münzfund (22, 12), Wildblumen                                |
| Fährstelle | Felsgruppe (36, 18), Stein der Fährleute                                            |
| Mitte      | Rastbank (52, 14) direkt am Weg, Blick zum Fluss, Auslöser `rast`                   |
| Steg       | Stegbilder Spalten 67–68, Reihen 20–23 über Wasser, zwei Boote längs (65 und 69)    |
| Osten      | Ortsschild „Cedar Creek“ (112, 17), Auslöser `schildCedar` (112, 18), Erlen am Ufer |

Belebung: Angler am Steg, Joggerin, Reiher, Hase, Schmetterlinge, Nebel über dem Wasser.

### 4.Z Zedernpfad (`wegMapleCedar.zedernpfad`, Bühnenbild, niedrig-1)

**Größe** 100 × 24, Norden oben. **Boden** Gras, Pfad aus Erde zwei Felder breit. **Rand**
geschlossen; Übergänge Süd (Spalten 10–11, `zedernZurueckPark`) und Ost (Reihen 4–5,
`zedernWeiterCedar`).

**Weg:** vom Südrand hoch bis Reihe 18, in Stufen nach Nordosten bis Reihe 10 (Spalte 36),
waagrecht bis Spalte 51, Anstieg zur Kuppe (Reihe 5, Spalten 55–65), dann Reihen 4–5 zum Ostrand.

| Abschnitt | Inventar                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------- |
| Wald      | Zedern in Gruppen von 2 bis 6, am Rand dichter, Lichtungen dazwischen                              |
| S2        | umgefallene Stämme mit Pilzen und Ästen (Sturmholz) quer über den Pfad bei Spalte 45 (Reihen 9–11) |
| Kuppe     | Lichtung, Baumstammbank (59, 3) in einem Steinkreis, Mitte frei für die Aussicht                   |
| überall   | Farne, Pilze, Steine, Felsgruppen                                                                  |

Belebung: Specht, Eichhörnchen. Offen: `aussichtKuppe`, Zedernzapfen und die Sperre S2 als Auslöser
folgen in Runde 5; die liegenden Stämme sperren den Pfad (einreihige Möbel sperren ihre Reihe), dichte Zedern von Rand zu Rand bei Spalte 44–46 schließen den Wald daneben. Hügelkanten gibt es im Katalog nicht.

### 4.5 Ortskern (`cedarCreek.aussen`)

**Größe:** 60 × 40 (vorher 44 × 24; vier Reihen mehr für die Gärten im Süden; 56 im Plan, vier Spalten mehr für die 18 breite Bibliothek).
Rand Hecke, offen am Westrand in den Reihen 20–21 (Hauptstraße, `flussweg`) und am Ostrand in den
Reihen 8–9 (Waldweg, `zedernwald`) und in den Reihen 4–5 (Zedernpfad, `zedernpfad`). Böden: Gras, Gehwege Pflaster (Reihen 19 und 22), Straße Asphalt (Reihen 20–21), Erde für Pfade
und Uferweg (Spalten 48–49), dunkles Holz für Brücke (Reihen 8–9) und Steg (Reihen 14–15, Spalten
50–53), Bach in den Spalten 50–55 von oben bis unten.

**Laufwege:** Start an der Haltestelle (44, 19) → Gehweg Nord nach Westen an Anschlagtafel,
Bibliothek, Waschsalon und Drechslerei vorbei → Straße nach Westen zum Flussweg. Nach Osten zum
Uferweg, nach oben über die Brücke zum Ostrand, nach unten am Steg und am Kanuverleih vorbei. Der
Zedernpfad kommt hinter der Drechslerei (Spalten 10–11) herunter. Südlich führen Gartenwege um die
beiden Wohnhäuser.

**Abschnitte und Entdeckungen** (je etwa ein Bildschirm, 7a.2 Regel 4):

| Abschnitt        | Felder                     | Entdeckung                                                    |
| ---------------- | -------------------------- | ------------------------------------------------------------- |
| Zedernwiese Nord | Spalten 1–20, Reihen 1–8   | Zedernpfad aus dem Wald, Eichelhäher                          |
| Hauptstraße West | Spalten 0–20, Reihen 9–22  | Drechslerei mit Holzstapel, Waschsalon mit Hund               |
| Bibliothek       | Spalten 21–47, Reihen 1–22 | Bibliothek, Anschlagtafel mit Plakat (`plakat`), Haltestelle  |
| Bach             | Spalten 48–59              | Steg mit Rosa (`steg`), Brücke in den Zedernwald, Reiher      |
| Südseite         | Reihen 23–34               | zwei Wohnhäuser, Zedernwiese mit Bänken, Kanuverleih mit Boot |

| Zone      | Gegenstand                                                                                                                              | Feld                                                                   | Ausrichtung                | Material, Stil, Zustand   | Zweck                                                                |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------- | ------------------------- | -------------------------------------------------------------------- |
| Nordseite | Drechslerei: kleine Holzscheune, Blechdach, Rolltor                                                                                     | (2, 9), 8 × 10                                                         | Vorderseite unten          | Holz, ländlich, gebraucht | `drechslereiTuer` (4, 19)                                            |
| Nordseite | Holzstapel aus Rundholz                                                                                                                 | (6, 18)                                                                | –                          | Holz                      | vor der Drechslerei; wächst nach dem Zedernpfad (13 §7.4)            |
| Nordseite | Waschsalon mit Markisen, darüber das türkise Neonschild „Waschsalon“ (eigenes Bild)                                                     | (12, 10), 8 × 9                                                        | Vorderseite unten          | klassisch, gebraucht      | `waschsalonTuer` (16, 19); Hund (17–19, 19)                          |
| Nordseite | zwei Laternen links und rechts der Bibliothekstreppe (vor der Fassade, ohne Kollision)                                                  | (21, 16), (26, 16)                                                     | –                          | Metall, klassisch         | geben dem Eingang Gewicht                                            |
| Nordseite | Bibliothek, Backstein mit Turm; unten im Turm ein Steinbogen mit zwei Lampen und Stufen zum Gehweg                                      | (22, 3), 18 × 16; Bogen 3 × 3 im Turm                                  | Vorderseite unten          | Backstein, klassisch, alt | `bibliothekTuer` (24, 19)                                            |
| Nordseite | Anschlagtafel mit Zetteln                                                                                                               | (40, 17)                                                               | Vorderseite unten          | Holz, ländlich            | `plakat` (40, 19); Zettel je Akt (13 §7.4)                           |
| Nordseite | Bushaltestelle mit Wartehäuschen                                                                                                        | (42, 16), 5 × 3                                                        | Vorderseite unten          | modern                    | Start, `bushaltestelle` (44, 19), `busZurueck` (43, 19)              |
| Nordrand  | Gleis (Holzschwellen, eine Reihe Gleisstücke), Bahnbrücke über den Bach, Halteschild am Westende                                        | Reihen 1–2, Spalten 12–59; Schild (11, 2)                              | –                          | Stahl und Holz, gebraucht | Bahn nach Riverton                                                   |
| Nordrand  | Bahnsteig mit grüner Bank, Stationsschild, Fahrplantafel                                                                                | Bahnsteig (12–21, 3–4); Bank (16, 4); Schild (19, 3); Tafel (20, 3)    | Bank Sitzfläche nach unten | Pflaster, klassisch       | `bahnhof` (14, 3)                                                    |
| Wiesen    | Zedern und Fichten                                                                                                                      | Nordwiese, Ostufer, Südwiese                                           | –                          | Natur                     | Wald um den Ort, Zedernholz                                          |
| Südseite  | zwei Holzhäuser mit rotem Dach in Gärten: Rasen, Plattenweg zur Tür, Blumenbeet, Zedernhecke im Süden, zwischen den Gärten und im Osten | Häuser (3, 24), (12, 24), je 8 × 10; Hecke Reihe 37, Spalten 11 und 21 | Vorderseite unten          | Holz, ländlich, gebraucht | Haus Holm (Mrs. Holm pflegt die Hecke) und Nachbarn, nicht betretbar |
| Südwiese  | Baumstammbank, Bank zum Bach, Mülleimer                                                                                                 | (29, 30), (45, 25), (46, 23)                                           | Vorderseite unten          | Holz, Metall              | Ruheplatz; Platz für den Ast (Runde 5)                               |
| Ufer      | Bootsschuppen des Kanuverleihs, Ruderboot im Bach                                                                                       | (45, 27), (50, 29)                                                     | –                          | Holz, Kunststoff          | Kanuverleih (Kulisse)                                                |
| Bach      | Steg, zwei Felder breit                                                                                                                 | (50–53, 14–15)                                                         | –                          | Holz dunkel               | `steg` (49, 14); Rosa (53, 14), Stegbauer (51, 15)                   |
| Bach      | Holzbrücke                                                                                                                              | (50–55, 8–9)                                                           | –                          | Holz dunkel               | zum Zedernwald (`zedernwald`, 59, 8–9)                               |

Belebung: Der Busfahrer steht auf der Straße bei der Haltestelle (42–44, 21) und trinkt Kaffee aus der
Thermoskanne (nicht mehr rauchend). Victor wartet am Häuschen (47, 19), Reiher am Ufer (49, 24),
Eichelhäher über der Nordwiese am Morgen.

Platzhalter (13 §7.4): Schild „Brückenarbeiten“ an der Brücke, Schaukasten an der Bibliothek, zweite
Angel am Steg, Ast auf der Südwiese, Kühe und Zettel kommen als Objekte in Runde 5. Freie Wiese
südlich der Straße (Spalten 22–44) bleibt für das Gemeindefest.

Offen: Der Katalog hat keinen Kanuständer und kein umgedrehtes Kanu; das Ruderboot vertritt sie.

Offen (Haltepunkt): `bahnhof` ist vorläufig nur
Ankunftspunkt (Art `start`, wie die Bushaltestelle); die Rückfahrt nach Riverton (Dialog am Bahnsteig, 10 Münzen)
kommt in Runde 5. Die Karte des Bahnhofs Riverton gibt es noch nicht; der Dialog `riverton-bahnhofshalle.zug`
führt schon auf `bahnhof`.

### 4.6 Nacharbeit nach der Rückmeldung des Autors (KARTENREGELN 10, Runde 5)

Diese Änderungen gehen den Tabellen in 4.1 bis 4.5 vor (Prüfbericht `2026-11-09_runde4_autor.md`,
Tabelle Cedar Creek). Neue Möbel tragen die Vorsilbe `cc5`.

**Ortskern (`cedarCreek.aussen`):**

- Bibliothek: Der Eingang ist der Seiteneingang des viktorianischen Hauses (Treppe mit Geländer,
  Holztür mit Rundbogenfenster, Balkon) links am Turm, Spalten 20–23 mit 12 px Feinschub, bündig am
  Turm; die Bibliothek selbst steht jetzt in den Spalten 24–41. Die Tür ersetzt kein Fenster mehr
  (10.9). `bibliothekTuer` (22, 19). Zwei Laternen symmetrisch zur Mitte der Treppe (x = 365 px).
  Innen liegt die Tür deshalb bei Spalte 3 (Tür außen bei 2,75 von 22 = 12,5 %).
- Bach gewunden, fünf Kacheln breit; linke Uferkante je Reihenblock: Reihen 0–3 Spalte 50, 4–6: 51,
  7–11: 52, 12–13: 51, 14–17: 50, 18–23: 51, 24–29: 52, 30–34: 51, 35–39: 50. Der Uferweg bleibt
  gerade (Spalten 48–49, ab Reihe 3); wo der Bach nach rechts schwingt, liegt Wiese dazwischen.
- Brücken und Steg sind Plankenbilder (Camping Pier 12/13) auf Wasser; die Szene nennt `"bruecken":
["h"]`, darunter zeichnet das Werkzeug Wasser mit Ufer (10.6). Bahnbrücke Reihen 1–2 (Spalten
  50–54) unter dem Gleis, Fußgängerbrücke Reihen 8–9 (Spalten 52–56) mit Erdweg von Uferweg und zum
  Ostrand, Steg Reihen 14–15 (Spalten 50–53) mit Pfählen am Ende (Pier 15).
- Boote längs (10.24): Schlauchboot am Steg festgemacht (50, 16), ein zweites am Ufer des
  Kanuverleihs (52, 25); das quer liegende Ruderboot entfällt.
- Trampelpfad zur Tür des Bootsschuppens (Reihe 31, Spalten 46–47) zum Uferweg (10.25). Bank am Ufer
  (50, 26), seitlich mit Blick zum Bach (10.17).
- Wendehammer am Ostende der Straße (Asphalt Spalten 41–46, Reihen 20–23, Pflaster ringsum) mit zwei
  Pollern zum Uferweg (47, 20) und (47, 22) (10.28). Die Anschlagtafel steht am Südrand des Platzes
  (41, 25) mit `plakat` (41, 27), der Mülleimer daneben.

**Bibliothek:** Schachtische und Lesetische sind leere Holztische (Basement 1, wie der Clubraum in
Maple Falls), darauf vier Bretter und zwei Leselampen (10.12). Der Globus steht auf einer niedrigen
Anrichte an der Ostwand (19, 7), `globus` (19, 9) (10.13). Zwei freistehende Regalreihen in den
Reihen 5 und 9 (Spalten 13–18) mit Gang dazwischen, mit Feinschub fast lückenlos (10.30). Lesetische
unten rechts (13, 13), (16, 13), Stühle davor, Stehlampe (19, 12). Notizbrett 6 px tiefer (10.10).
Ausgang: Türbild in der Südwand bei Spalte 3, Fußmatte davor (10.7, 10.8).

**Archiv:** Eine freistehende Regalreihe (Spalten 1–6, Reihe 5) mit Gang davor; drei Kartonstapel je
zwei hoch an der Südwand (Spalten 1–6); der offene Karton 1850–1859 frei bei (8, 7); Arbeitsplatz in
der Südostecke: leerer Tisch (11, 8) mit Leselampe und Programmheft, Stuhl davor (10.30).
`wasserfleck` (9, 4). Mehr als eine Regalreihe überschreitet die Belegungsgrenze von 45 %.

**Waschsalon:** Türbild in der Südwand bei Spalte 7, Fußmatte direkt davor, Notizbrett 6 px tiefer.

**Drechslerei:** In der Mitte ein Arbeitstisch (6, 5) mit Werkstück (Stammstück), Leiste und Hammer
(10.30); das Bücherregal steht direkt am Werktisch (8, 1) (10.31). Türbild in der Südwand bei Spalte 4,
Fußmatte davor.

**Werkzeug:** Die Regel „freie Kachel vor der Tür“ (`kartenregeln.pruefe_tueren`) prüft bei Türen in der
Südwand jetzt die Kachel im Raum über der Tür (Test `test_tuer_in_der_suedwand_braucht_freie_kachel_im_raum`).

**Haltepunkt (Nachtrag):** Stationsschild „CEDAR CREEK“ (eigenes Bild, 3 × 2) bei (13, 3), Bank (16, 4),
Fahrplantafel „FAHRPLAN“ (eigenes Bild) bei (19, 3); `bahnhof` liegt jetzt bei (16, 3) über der Bank.

### 4.7 Varianten B und C (KARTENREGELN 10.37)

Variante A ist die Szene in `inhalte/abenteuer/szenen/`; B und C liegen in
`inhalte/abenteuer/szenen/varianten/` (Möbel neu mit Vorsilbe `cc7`). Gleich in allen dreien: Größe,
Wände, Türen, Übergänge mit ihren Feldern, Auslöser und Figuren mit Namen, Haltepunkt, Brücken, Steg.
Die Bibliothek baut mittel-4. Das Archiv ist in allen drei Varianten `"dicht": true` (bis 60 % Belegung).

| Karte       | Variante A                                                                                                  | Variante B (schlichter)                                                                                                            | Variante C (reicher)                                                                                                                |
| ----------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Ortskern    | zwei Holzhäuser in Gärten mit Zedernhecke                                                                   | ein eingeschossiges Haus mit Doppelgarage, Rasengarten, wenige Zedern, offene Wiese, ein Boot; Bach schwingt in der Mitte weit aus | ein Haus mit Holzvordach, Beet und Briefkasten, gemischte Bäume, Laternen am Gehweg Nord, Picknickplatz; Bach schwingt im Süden aus |
| Archiv      | zwei versetzte Querreihen (links vorn, rechts hinten), Kartonstapel an der Südwand, Arbeitsplatz Südostecke | zwei Längsreihen mit Gang in der Mitte, Kartonsäule an der Ostwand, Arbeitsplatz Südwestecke                                       | Doppelreihe Rücken an Rücken mitten im Raum, Gänge ringsum, Kartons an der Südwand, Arbeitsplatz am Fuß der Treppe                  |
| Waschsalon  | Maschinenreihe an der Nordwand, Falttische in der Mitte, Wartesitze links                                   | Maschinen und Getränkeautomat an der Nordwand, Falttische an der Westwand, Sitzecke in der Südostecke                              | zweite Reihe Maschinen in der Mitte, Falttisch und Wartesitze unten, mehr Körbe und Pflanzen                                        |
| Drechslerei | Hobelbank links, Regal am Werktisch rechts, Arbeitstisch mit Werkstück in der Mitte                         | große Bank als Drehbank mitten im Raum, Werktisch und Regal an der Nordwand, Holzlager an der Ostwand                              | zwei Holztische als Werkbänke mit Werkzeug, Regal und Holzkiste, Hobelbank rechts, Werkstück in der Mitte, Holzlager an der Südwand |

## Runde 7 (10.11.2026): Gebäude und Belebung in `cedarCreek.aussen`

Nach Regel 10.51 und 10.53. Mit Zustimmung des Haupt-Chats wächst die Karte nach Süden auf
**60 × 50** (7a.2: kleiner Ort bis 60 × 50); das gewählte Bild oben bleibt. Unter der Zedernwiese
steht eine Häuserzeile in voller Größe mit Türen zur neuen **Südgasse** (Pflaster, Reihen 47–48),
die im Westen über die Gasse am Rand (Spalten 1–2) und im Osten über den Uferweg angebunden ist:
zwei Wohnhäuser mit Flachdach (3, 39) und (16, 39), Dorfladen (10, 39), Bauernhaus (23, 37),
breites Bauernhaus (32, 38), hohes Wohnhaus (42, 37). Dazu ein Stadthaus hinter der Bibliothek
(42, 3). Das Vordachhaus behält seinen Vorplatz (Reihe 38). Der Bach läuft gerade bis an den neuen
Südrand. Damit 13 Gebäude. Belebung: 12 Statisten, 9 ansprechbar (`statist.cedarCreek.aussen.*`),
dazu Hund, Reiher, Eichelhäher, Enten auf dem Bach und ein Eichhörnchen auf der Wiese. Der Rentner
am Picknicktisch zeigt Rubinsteins Unsterbliche (`zeigt: rubinsteinsUnsterbliche`).

## Runde 7 (10.11.2026): Weg 1 mit Ereignisort und Belebung

**Flohmarkt an der Landstraße** (Dokument 15, 2.1) in L7 südlich der Straße: Bauernhaus der
Verkäuferin (99, 17), davor ein Hof aus Schotter (Spalten 88–98, Reihen 19–24) mit Einfahrt von der
Straße (95–96, 17–18), Odettes Wohnmobil „Gambit“ (88, 19), drei Tische mit Kram, Kartons, Schild
„Garage Sales“ an der Straße (92, 17). Platz für drei bis sechs Figuren auf dem Hof. Möbel
`mf8Flohmarkt…`, `mf8Wohnmobil`.

### 3.3 Für Runde 6 (Felder bleiben begehbar)

| Auslöser            | Karte                       | Feld     | Was dort ist                                |
| ------------------- | --------------------------- | -------- | ------------------------------------------- |
| `ereignisFlohmarkt` | `wegMapleCedar.landstrasse` | (95, 21) | Odette Finch vor dem Wohnmobil              |
| `seite00`           | `wegMapleCedar.landstrasse` | (87, 17) | Buchseite Kapitel 0 im Graben neben dem Hof |
| `finchBauerA`       | `wegMapleCedar.flussweg`    | (54, 21) | unter der neuen Bank am Steg (54, 20)       |

Das Finkenzeichen aus Blech steht am Steg (58, 21), das Plakat „Flohmarkt SA“ gegenüber der
Einfahrt nördlich der Straße (95, 12) (eigene Bilder). **Belebung:** Landstraße mit der Frau, die die wilden Pferde beobachtet
(Dokument 16, 3.2, Beispiel 4, mit Ambroses Antwort), Verkäuferin und Kunde auf dem Hof, Pferde und
Eichhörnchen; Flussweg mit Vogelbeobachterin, Picknickvater, Kind beim Steinehüpfen, Enten, Eisvogel;
Zedernpfad mit Pilzsammlerin, Försterin, Landschaftsmaler, Kindern, Reh, Krähen, Hase, Eule. Jede
Karte hat mindestens 4 Statisten (3 ansprechbar) und 6 Tiere. Weg 1 ist vom Autor gewählt; die
Varianten in `szenen/varianten/` bleiben unverändert zum Nachschlagen.

## Runde 6 (10.11.2026): Weg 1, Park und Zedernpfad spielbar (niedrig-1)

| Auslöser (orte.json)     | Karte                       | Art        | Dialog / Bedingung                                                               |
| ------------------------ | --------------------------- | ---------- | -------------------------------------------------------------------------------- |
| `kuerbishof` (S1)        | `wegMapleCedar.landstrasse` | Übergang   | `wenn: wegMapleCedarTafelBestanden`, Zettel von Walt Miller (`gatter_s1`)        |
| `ereignisFlohmarkt`      | `wegMapleCedar.landstrasse` | Dialog     | Odette Finch, erst ab `nadelMapleFalls` ≥ 1; Runde `wegMapleCedar.finchFallen`   |
| `seite00`                | `wegMapleCedar.landstrasse` | Gegenstand | Fund `seite00`                                                                   |
| `finchBauerA`            | `wegMapleCedar.flussweg`    | Gegenstand | Fund `finchBauerA`                                                               |
| `zedernZurueckPark` (S2) | `wegMapleCedar.zedernpfad`  | Übergang   | `wenn: nadelCedarCreek`, Stamm (`stamm_s2`)                                      |
| `zedernpfad` (S2)        | `mapleFalls.park`           | Übergang   | `wenn: nadelCedarCreek`, Stamm von der Parkseite                                 |
| `steg` (S5)              | `mapleFalls.park` (5, 7)    | Gegenstand | Absperrband; ab `nadelMapleFalls` ≥ 1 neuer Steg, Aussicht, Fund `initialen1952` |

Quest `wegMapleCedar.flohmarkt` („Finchs Fallen“): Fallen lösen, dann bei Odette die Karte der
Finch-Jagd abholen (Funde `finchKarte`, `problemheft`). Die Karten von Flussweg und Zedernpfad in
`orte.json` zeigen jetzt auf die gewählten Fassungen (`weg-maple-cedar-flussweg.json`,
`weg-maple-cedar-zedernpfad.json`); `weg-maple-cedar-2.json` und `-3.json` sind die alten Stände.

**Nachtrag Runde 6 (niedrig-1):** Der Flussweg hat die feste Tönung `nebel` (F1, Nebel am Morgen).
Die Fundknoten heißen wie ihre Auslöser (`seite00`, `finch_bauer_a`) und zählen `buchseiten` und
`finchFiguren` hoch (Vereinbarung der Sammelstränge).

## Runde 8 (10.11.2026): Notizen des Autors und Zustände (niedrig-1)

**Umgesetzt:** Prellbock quer zum Gleis, Seiteneingang der Bibliothek bündig, Briefkasten am Wegrand,
Tiere aus dem Wasser (Akt-1-Nacharbeit); dazu ein Pflasterweg zum Stadthaus hinter der Bibliothek
(10.58). Weg 1: Angler auf dem Steg, Trampelweg weitet sich vor der Straße, Aufsteller „FLOHMARKT SA“
statt des hängenden Schilds, Tiere im Zedernpfad nicht mehr in Bäumen.

**Zustände (10.63), gebaut (Szenen `weg-maple-cedar-landstrasse-<zustand>.json`):**

| Karte                       | Zustand             | Bedingung                                             | Zustand: wann, was, warum                                                             |
| --------------------------- | ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `wegMapleCedar.landstrasse` | `flohmarkt-leer`    | `nadelMapleFalls < 1`                                 | Vor der ersten Nadel: nur das Wohnmobil auf dem Hof, die Tische mit Kram fehlen noch. |
| `wegMapleCedar.landstrasse` | `gatter-offen`      | `wegMapleCedarTafelBestanden`                         | Nach der Rätseltafel: Walt Miller hat das Gatter zum Kürbishof geöffnet (S1).         |
| `wegMapleCedar.landstrasse` | `gatter-offen-leer` | `wegMapleCedarTafelBestanden und nadelMapleFalls < 1` | Beides zugleich (letzter passender Eintrag gilt).                                     |

Keine Zustände: `cedarCreek.aussen` (die Brücke nach Riverton ist auf der Karte schon fertig, eine
Baustelle gibt es nicht), `wegMapleCedar.zedernpfad` (der Stamm von S2 ist kein Bild, nur der
Übergang mit Dialog), `wegMapleCedar.flussweg` (feste Tönung Nebel).

## Gutachten Runde 8: Antworten (niedrig-1, 10.11.2026)

Gutachten in `docs/spiel/auftraege/gutachten/`. „Technik“ heißt: zentral gelöst für alle Karten
(Tierbilder, Laternenhöhe, Fußmatte, Stufendiagonalen), hier nicht einzeln umgebaut.

**Cedar Creek außen** (Commit „Cedar Creek nach dem Gutachten“):

- Behoben: 31–34, 23 (drei kleine Holzhäuser mit Beeten und Bäumen statt Flachdachhäusern, Laden
  und Haus mit Satellitenschüsseln), 11 (Bus an der Haltestelle), 5 (Weg vom Stadthaus führt zum
  Uferweg statt in die Rückwand des Wartehäuschens), 17 (Hundehütte als Bootsschuppen weg).
- Technik: 8, 19, 29 (Tierbilder), 10 (Laternen), 20 (Stufen).
- Perspektive: 1 (Bänke von vorn), 24 (Hausbilder haben die Tür unten; die Südreihe zeigt der
  Straße darum die Gärten), 12, 21 (Figuren ohne Rad, Kinderwagen, Angel).
- Fehlendes Bild: 3 (erkennbare Zeder), 7 (eigenes Bild für den Waschsalon), 13 (Markierung).
- Zur Nachprüfung: 2, 4, 6, 9, 14–16, 18, 22, 25–28, 30.

**Landstraße** (Commit „Weg 1 nach dem Gutachten“):

- Behoben: 1–4, 7 (Felder als eigene Ackerbilder statt Pflanzen auf Wegerde; Pflanzenreihe am
  Nordrand weg; der Acker endet vor dem Abzweig).
- Technik: 9, 13, 29 (Tierbilder), 21 (Stufen).
- Perspektive: 14, 19, 23 (Figuren stehend, ohne Rad).
- Fehlendes Bild: 8 (Ortsschild mit Schrift), 16 (Schuppen statt Hundehütte; Bildwunsch), 18
  (Schilder mit Aufschrift).
- Gewollt: 25 (Flohmarkt und Hof gehören zur Quest S1 aus Runde 6; die Beschreibung wird
  nachgezogen).
- Zur Nachprüfung: 5, 6, 10–12, 15, 17, 20, 22, 24, 26–28, 30.

**Flussweg** (Commit „Weg 1 nach dem Gutachten“):

- Behoben: 1 (der Erdweg läuft über einen Schottervorplatz in die Straße aus).
- Technik: 10, 11, 19 (Tierbilder), 2 (Stufen).
- Perspektive: 20–22 (Figuren stehend, ohne Picknickdecke).
- Gewollt: 13 (der Fluss läuft am Südrand aus der Karte).
- Fehlendes Bild: 14 (Erlen), 8 (Vogelschild lesbar).
- Zur Nachprüfung: 3–7, 9, 12, 15–18.

**Zedernpfad** (Commit „Weg 1 nach dem Gutachten“):

- Behoben: 2–4 (neun Steine als Kreis um die Baumstammbank, keine Steine mehr auf dem Weg), 9, 11,
  15 (über 200 Zedern und Farne mehr).
- Nicht machbar: 1 (Höhe; es gibt keine Hangkacheln für Wald, nur die Böschung des Bahndamms).
- Technik: 16, 17, 18 (Tierbilder), 7 (Stufen).
- Fehlendes Bild: 10 (erkennbare Zeder), 6 (Sturmholz mit Wurzelteller).
- Perspektive: 19–22 (Figuren ohne Eimer, Leinwand, Farbe).
- Zur Nachprüfung: 5, 8, 12–14.

## Bootsschuppen und Regel 10.64 (niedrig-1, 10.11.2026)

- Der Bootsschuppen des Kanuverleihs (neues Bild `bootsschuppen.png` von mittel-1) steht wieder am
  Bach, wie die Beschreibung sagt: am Westufer auf Höhe der Picknickwiese, das Tor nach Süden zu einer
  kleinen Bucht, die in den Bach mündet. Das Ruderboot liegt daneben im Bach, die Bank zum Bach steht
  zwei Reihen weiter oben.
- Regel 10.64: Der Bus an der Haltestelle ist 7 × 4 Kacheln (Bus 7–9 × 3, die vierte Reihe ist das
  Dach in der Schrägansicht), die Ruderboote 2 × 4 (hochkant). Auch der Schulbus im Park (Zustand
  `schulbus`) ist 7 × 4. Der Traktor auf der Landstraße misst 5 × 4. Er steht nicht in der Liste der
  Regel, ist aber größer als ein Auto, wie es sein soll.

## Zweites Gutachten Runde 8: Antworten (niedrig-1, 10.11.2026)

Gutachten `maple-falls-cedar-creek-2.md` und `weg-maple-cedar-2.md`.

**Cedar Creek außen:**

- **Bus ragt in den Gehweg (10.65):** Er steht jetzt in einer Busbucht (Reihe 23 auf seiner Länge
  Asphalt), längs zur Straße.
- **Holzhäuser nicht an der Straße:** Statt des Wellblechhauses stehen direkt südlich der Straße zwei
  Blockhütten mit Gärten, Beet und Baum.
- **Spielzeughäuser (10.66):** In der Südreihe stehen drei Hütten 5 × 5 und ein Gartenhaus.
- **Flachdachblock:** Er ist weg, dort steht jetzt die Holzfällerhütte.
- **Bootsschuppen:** Er steht seit 3e2bf4af am Bach; der Gutachter sah den Stand davor.

**Flussweg:**

- **Fährstelle ohne Pfosten:** Ein Poller am Ufer hält das Fährboot, daneben steht ein Schild.
  Poller dürfen jetzt zum Wasser zeigen (`zum_wasser`).
- **Boote quer am Steg:** Die Ruderboote liegen längs am Steg, der quer zum Ufer ins Wasser ragt. Der
  Steg ist jetzt fünf Reihen lang, länger als die Boote.
- **Erlen:** Am Ufer stehen sechs Erlen.

**Landstraße:**

- **Mais ohne Ende:** Das Maisfeld endet bei Spalte 93 an einer Wiese mit Erlen und Blumen.
- **Apfelstand ohne Verkäuferin:** Eine Verkäuferin steht am Stand, Äpfel liegen auf dem Tresen.
- **Hof ohne Weg zur Tür:** Ein Kiesweg führt vom Flohmarktplatz am Ufer entlang zur Haustür. Die Tür
  liegt im Bild unten, also zum Fluss.

**Zedernpfad:**

- **Keine Höhe:** Zwei Felskanten (`"kante": "klippe"`) machen den Hang. Die erste trennt den
  Waldrand von der mittleren Stufe, die zweite die Kuppe; der Pfad steigt über Felstreppen hinauf.
- **Steinkreis und Bank:** Mein Stand aus Runde 8 war nicht gespeichert. Jetzt steht die
  Baumstammbank auf der Kuppe in einem Kreis aus zehn Steinen.
- **Sturmholz neben dem Weg:** Bei Spalte 38 liegen die Stämme quer über dem Weg (flach, man steigt
  darüber), daneben Äste.
- **Wald:** Er ist auf allen freien Feldern dichter, mit Abstand zum Weg.

## Drittes Gutachten Runde 8: Antworten (niedrig-1, 10.11.2026)

Gutachten `docs/spiel/auftraege/gutachten/niedrig-1-3.md`. Die Straßenmarkierung (8588ba4d) sah
der Gutachter noch nicht.

- **Lockport:**
  - Der Kahn liegt am Südkai, zwei Seile gehen zu den Pollern.
  - Statt sechs gleicher Schuppen stehen drei, dazu Beet, Baum und Blumen.
  - Das kleine Blumensymbol am Schiffsausrüster ist weg.
  - Die Tore gelten als lesbar. Das Bild mit Laufsteg (a4f3a8a2) ist erst ab dem nächsten Rendern
    des Hintergrunds zu sehen.
- **Gasthaus:**
  - Die Tafel trägt „KEGEL KOENIG“ mit Kreidezeilen (Bildwunsch `tafel_kegelkoenig.png`).
  - Das Kugelregal steht frontal unter der Bahn statt an der Westwand.
  - Fußmatte vor der Tür, Gläser auf allen Tischen.
- **Bahndamm:**
  - Der Rest des Abstellgleises ist Gras.
  - Die Kuhweide hat einen Zaun ringsum, im Süden mit Gatter am Durchlass. Die Nordmündung des
    Durchlasses liegt in der Böschung, die vom Betrachter wegfällt, und ist nicht zu sehen.
- **Maple Falls:**
  - Der gelbe Flachdachblock ist eine Blockhütte mit Baum.
  - Am Wendehammer steht ein Schild „Sackgasse“ (Bildwunsch). Der Hammer bleibt eckig, weil
    Asphalt mindestens drei Felder breit sein muss.
  - Der blaue Schuppen im Südgarten ist rot.
- **Park:**
  - Die Krähen sitzen am Ufer, die Enten schwimmen im Teich.
  - Die Straßenbrücke deckt den Fluss auf ihrer ganzen Breite ab, das Wasser läuft darunter durch.
  - Die Holzbrücke kommt mit Gemini-Prompt 2.
- **Cedar Creek:**
  - Die Hecke ist doppelt.
  - Der westliche Pflasterstreifen ist schmaler.
  - Der Bus steht längs in seiner Bucht. Sein Bild ist vier Reihen hoch, so berührt er die Kante
    der Bucht, nicht den Gehweg.
- **Flussweg:**
  - Der Nebel ist weg; die Karte spielt am Tag.
  - Die Ruderboote liegen längs zum Ufer zu beiden Seiten des Stegs.
- **Landstraße:**
  - Der Traktor steht längs am Straßenrand (10.65).
  - Der „Esel“ ist das Bild der Wildpferde; das gehört zur Tierzuordnung wie die Ziegen.
- **Zedernpfad:** Der Steinkreis ist geschlossen (zwölf Steine um die Bank). Die orangen
  Platzhalter an den Stufenenden löst mittel-4 zentral.

## Gemini-Bilder eingebaut (niedrig-1, 10.11.2026)

- **Reh und Hirsch:** Beide sind eigene Tierarten in `tierarten.json` (Schnitt „standbild“ wie
  der Bison). Damit zeigen Zedernwald, Zedernpfad und Landstraße keine Ziegen mehr.
- **Häuser von hinten (10.66):**
  - Maple Falls: Die vier Südhäuser der Birch Lane zeigen jetzt ihre Rückseite mit Hintertür. Oben
    sieht man den Vorbau mit Briefkasten zur Straße.
  - Cedar Creek: die beiden Häuser direkt südlich der Straße.
- **Bänke von hinten:**
  - Bahndamm: zwei Bahnsteigbänke, die zum Gleis schauen.
  - Cedar Creek: die Bahnsteigbank.
  - Park: die lange Bank am Uferweg schaut zum Fluss.
- **Holzbrücke:** Die Parkstraße überquert den Fluss auf der Holzbrücke (Beschreibung wie
  ursprünglich). Im Zedernwald steht sie statt des Stegs.
- **London:** Der Strand hat fünf schmale Fronten dicht an dicht: Buchladen, Schneider, Kaffeehaus,
  Schachsalon, Pub. Die Karte ist dafür 24 × 25 Kacheln groß; der Ladetest beginnt bei (2, 12).
- **Postreiter:** Der Figurenbogen entsteht aus den vier Gemini-Standbildern (Bildwunsch
  `postreiter_bogen`); beim Laufen wippt er.
- **Gasthaus:** Kanonenofen aus Gemini, daneben Brennholz. Der Küchenherd bleibt ungenutzt, weil
  die Küche nicht auf der Karte liegt.

## Viertes Gutachten Runde 8 und zweites Gutachten Runde 9: Antworten (niedrig-1, 10.11.2026)

Gutachten `niedrig-1-4.md` und `niedrig-1-runde9-2.md`. Der Gutachter sah die Karten noch ohne
die Gemini-Bilder.

- **Park:** Die Holzbrücke (Gemini) ersetzt die grauen Brüstungen, ein Überweg führt vom Uferweg
  zur Haltestelle (Bildwunsch `zebrastreifen_quer.png`).
- **Cedar Creek:** Der Bus steht in einer eigenen Bucht südlich neben der Fahrbahn (Rasterzeichen
  `b`, ohne Markierung), nicht mehr auf der Mittellinie.
- **Landstraße:** Der Traktor von Otis steht am Feldrand im abgeernteten Schlag, längs zum Weg,
  wie die Beschreibung sagt.
- **Kürbishof:**
  - Der Irrgarten ist dicht. Jedes Feld außerhalb der Gänge trägt Mais, die Gänge sind eine Kachel
    breit, um Morphy liegt eine Lichtung.
  - Der Traktor steht neben dem Hofweg vor der Scheune.
- **Goldmine:**
  - Das Wandmaterial ist `felsStollen` wie im Steinbruch-Stollen; die Bodenstreifen über den
    Wänden entfallen.
  - Ein Abzweiggleis führt vom Hauptgang in die Goldkammer. Die Lore steht längs darauf (Bild von
    der Seite, Regel 10.65).
  - Die orange Werkzeugkiste ist weg, das Geröll auf fünf Haufen begrenzt.
  - Für Stollen gilt die neue Szenenangabe `"stollen": true`: Mindestbelegung 10 % statt 20 %.
    Die alte Grenze hatte die vielen Holzstapel erzwungen.
