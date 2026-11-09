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

### 1.4 Cedar Creek (`cedarCreek.aussen`, 56 × 36)

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

| Gebäude                       | Außen (Fassade, Kacheln)                                                     | Innen (7a.2)                                                                             | Begehbar |
| ----------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------- |
| Bibliothek (1890)             | Backstein, Hauptbau 11 breit mit Turm, Doppeltür im Turm bei 6 von 11 (50 %) | Lesesaal `bibliothek` 22 × 16 (großer Saal; heute 18 × 14), Tür Südwand Spalte 11 (50 %) | ja       |
| Archiv (Keller)               | – (unter dem östlichen Teil der Bibliothek)                                  | `archiv` 14 × 11, liegt unter den Spalten 8 bis 21 des Lesesaals                         | ja       |
| Waschsalon Mr. Boateng        | Flachbau, Fassade 7, Tür bei 4 von 7 (50 %)                                  | `waschsalon` 14 × 11, Tür Südwand Spalte 7 (50 %)                                        | ja       |
| Drechslerei Dunmore (neu)     | Holz, Fassade 8, Tür bei 5 von 8 (50 %)                                      | `drechslerei` 16 × 11 (12), Tür Südwand Spalte 8                                         | ja       |
| Haus Süd 1 (Holm), Haus Süd 2 | Holz, je Fassade 7, Tür in der Nordfassade zur Straße                        | –                                                                                        | nein     |
| Kanuverleih                   | Bootsschuppen am Ufer, 6 breit                                               | –                                                                                        | Kulisse  |
| Bushaltestelle                | Wartehäuschen 3 breit                                                        | –                                                                                        | Kulisse  |

Die Fassade ist halb so breit wie das Erdgeschoss innen, die Tür sitzt außen und innen an derselben
relativen Stelle (±1 Kachel). Treppen liegen übereinander: Die Kellertreppe der Bibliothek liegt an
der Nordwand bei Spalte 19 (Nordostbereich des 22 breiten Saals), die Treppe im Archiv deshalb bei
Spalte 11 (19 − 8).

### 1.6 Übergänge

| Von (Karte, Auslöser, Feld)                                          | Nach (Karte, Auslöser, Feld)                                                  | Lage                                                                                   |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| mapleFalls.park `landstrasse` (Ostrand, Spalte 43, Reihen 15–17)     | landstrasse `zurueckPark` (Westrand, Spalte 0, Reihen 15–17)                  | Parkstraße und Feldweg je drei Felder, gleiche Reihen (mit mittel-1 abgestimmt)        |
| landstrasse `weiterFluss` (Ostrand, Spalte 119, Reihen 15–16)        | flussweg `zurueckLandstrasse` (Westrand, Spalte 0, Reihen 15–16)              | Feldweg geht in den Uferweg über                                                       |
| flussweg `weiterCedar` (Ostrand, Spalte 119, Reihen 15–16)           | cedarCreek.aussen `flussweg` (neu, Westrand, Spalte 0, Reihen 20–21)          | Uferweg geht in die Hauptstraße über; Dialog `ankunft_zu_fuss` bleibt an `weiterCedar` |
| mapleFalls.park `zedernpfad` (neu, Nordrand, Spalten 10–11, Reihe 0) | zedernpfad `zurueckPark` (neu, Südrand, Spalten 10–11, Reihe 23)              | hinter dem Fußsteg über den Fluss; Pfad je zwei Felder                                 |
| zedernpfad `weiterCedar` (neu, Ostrand, Spalte 99, Reihen 4–5)       | cedarCreek.aussen `zedernpfad` (neu, Westrand, Spalte 0, Reihen 4–5)          | Pfad je zwei Felder; Sperre S2 liegt westlich der Kuppe                                |
| mapleFalls.park `bushaltestelle` (Dialog, Reise)                     | cedarCreek.aussen `bushaltestelle` (35, 19)                                   | Busfahrt                                                                               |
| cedarCreek.aussen `busZurueck` (34, 19, Dialog, Reise)               | mapleFalls.park `bushaltestelle`                                              | Busfahrt zurück                                                                        |
| aussen `drechslereiTuer` (6, 18)                                     | drechslerei `drechslereiAusgang` (Südwand, Spalte 8)                          | hinein nach Norden                                                                     |
| aussen `waschsalonTuer` (15, 18)                                     | waschsalon `waschsalonAusgang` (Südwand, Spalte 7)                            | hinein nach Norden                                                                     |
| aussen `bibliothekTuer` (25, 18)                                     | bibliothek `bibliothekAusgang` (Südwand, Spalte 11)                           | hinein nach Norden                                                                     |
| bibliothek `kellertreppe` (Nordwand, Spalte 19)                      | archiv `kellerAusgang` (Nordwand, Spalte 11)                                  | Treppen übereinander; oben nach unten, unten nach oben (Regel 2.4)                     |
| aussen `zedernwald` (Ostrand, Spalte 55, Reihen 8–9)                 | wegCedarRiverton.zedernwald `zurueckCedar` (Westrand, Reihen 8–9 nach Neubau) | nach der Brücke; nur nach `endeAkt1Gesehen`                                            |

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

## 4. Bühnenbilder

Runde 4 (9.11.2026). Je Karte Größe, Wände, Böden, Laufwege, Zonen und Inventar; die Möbel stehen in
`inhalte/abenteuer/moebel.json` mit der Vorsilbe `cc4`, die Szenen in `inhalte/abenteuer/szenen/`.
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

| Zone      | Gegenstand                                  | Feld                           | Ausrichtung            | Material, Stil, Zustand    | Zweck                                                      |
| --------- | ------------------------------------------- | ------------------------------ | ---------------------- | -------------------------- | ---------------------------------------------------------- |
| Nordwand  | vier Waschmaschinen (eine Serie, lückenlos) | (1, 2), (3, 2), (5, 2), (7, 2) | Vorderseite unten      | weiß, modern, gebraucht    | Waschen                                                    |
| Nordwand  | zwei schmale Trockner (dieselbe Bauart)     | (9, 2), (10, 2)                | Vorderseite unten      | weiß, modern, gebraucht    | Trocknen; auf dem linken das Steckschachbrett (`trockner`) |
| Nordwand  | Pinnwand mit Zetteln                        | Wandfläche (9, 1)              | –                      | Kork, einfach              | Zettel „Verloren: ein Turm“ (`zettelTurm` davor, (10, 4))  |
| Ecke NO   | Regal mit Waschmittel, Gläsern und Korb     | (11, 1)                        | Vorderseite unten      | weiß und Glas, gebraucht   | Waschmittelregal                                           |
| Ostwand   | Getränkeautomat, Leuchtfläche nach links    | (12, 4)                        | zeigt in den Raum      | Metall, modern             | `automat` davor (11, 5)                                    |
| Mitte     | zwei Arbeitstische aus Edelstahl            | (4, 5), (6, 5)                 | –                      | Edelstahl, modern          | Falttisch; Mr. Boateng davor (6, 8)                        |
| Mitte     | voller Wäschekorb                           | (8, 5)                         | –                      | Korbgeflecht               | Spuren von Leben                                           |
| Westseite | drei Wartesitze in Reihe                    | (1, 7)                         | Sitzflächen nach unten | oranger Kunststoff, modern | Warten; Comicheft darauf (`comicheft`, (2, 8))             |
| Westseite | zweiter Wäschekorb                          | (4, 8)                         | –                      | Korbgeflecht               | Leben                                                      |
| Ecken     | Zimmerpflanzen                              | (1, 4), (12, 8)                | –                      | Pflanze, Keramik           | Regel 4.4                                                  |
| Eingang   | Start                                       | (7, 9)                         | Blick nach oben        | –                          | Ankunft                                                    |

Belebung: eine Kundin geht zwischen (9, 8) und (11, 8) auf und ab. Offen: Ein eigenes Trocknerbild gibt
es im Katalog nicht; die Trockner sind schmale Frontlader derselben Serie.

### 4.2 Archiv (`cedarCreek.archiv`)

**Größe:** 14 × 11. Nordwand Reihen 0–2 Backstein, Boden ab Reihe 3 Stein, Seiten- und Südwand eine
Reihe, keine Tür: Der einzige Ausgang ist die Treppe nach oben. Kühl, still, lange nicht benutzt.

**Laufwege:** Treppe (11, 3) → Start (11, 5), Antritt frei → nach links zwischen Regalen und Kartonreihen zum
offenen Karton (4, 7), nach rechts zum Lesetisch, nach vorn zum Wasserfleck (8, 9).

| Zone     | Gegenstand                                         | Feld                            | Ausrichtung       | Material, Stil, Zustand  | Zweck                                                                               |
| -------- | -------------------------------------------------- | ------------------------------- | ----------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| Nordwand | steile Holztreppe nach oben                        | (10, 1), 3 × 4                  | führt nach oben   | Holz dunkel, klassisch   | `kellerAusgang` (11, 3); unter der Kellertür der Bibliothek (Spalte 19 − 8)         |
| Nordwand | vier hohe Regale mit Zeitungsjahrgängen und Mappen | (1, 1), (3, 1), (6, 1), (8, 1)  | Vorderseite unten | Holz, klassisch, alt     | Archiv; das Regal bei (8, 1) ist das dunkle Regal für die Laterne (R3, Platzhalter) |
| Nordwand | Boxerfoto im Goldrahmen                            | Wandfläche (5, 1)               | –                 | alt                      | `boxerfoto` (5, 3)                                                                  |
| Mitte    | Archivkartons in zwei Reihen                       | Reihe 5: 2, 4, 6; Reihe 7: 2, 6 | –                 | Pappe, gebraucht         | Archiv                                                                              |
| Mitte    | offener Karton „1850–1859“                         | (4, 7)                          | –                 | Pappe                    | `karton1858`                                                                        |
| Westwand | Stapel höherer Kartons                             | (1, 4), (1, 6)                  | –                 | Pappe                    | geordnete Stapel an der Wand                                                        |
| Ecke SO  | Lesetisch mit aufgeschlagenem Buch, Stuhl dahinter | Tisch (9, 7), Stuhl (9, 5)      | Stuhl zum Tisch   | Holz und Grün, klassisch | `programmheft` auf dem Tisch (10, 7)                                                |
| Ecke SO  | Stehlampe neben dem Tisch                          | (11, 6)                         | –                 | Holz, Stoffschirm        | Licht (Regel 4.4)                                                                   |
| Boden    | Wasserfleck in Form eines Springers                | (8, 9)                          | –                 | –                        | `wasserfleck`                                                                       |

Offen: Aktenschränke und Regale mit Archivkartons gibt es im Katalog nicht; die Regale zeigen
gebundene Bände und Mappen.

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
| L2                   | Kuhweide 17–29 × 18–24, geschlossener Zaun mit Ecken, Tor oben (22–24), Tränke innen am Zaun, Zettel „Bitte schließen“ am Tor; Kühe als Belebung                                                                                                                          |
| L3                   | Krähen über dem Feld, Laubbaumgruppe südlich                                                                                                                                                                                                                              |
| L4                   | Wegweiser mit vier Armen an der Kreuzung (49, 12); gegenüber Adas Apfelstand (50, 18) mit Äpfeln, Geräteschuppen (57, 18), Obstwiese mit drei Apfelbäumchen in einer Reihe                                                                                                |
| L5                   | Mais, Wanderer auf dem Weg (67, 16)                                                                                                                                                                                                                                       |
| L6                   | Bank direkt am Weg (80, 14, zum Weg), Nia daneben, zwei Heuhaufen, Laubbaum und roter Herbstbaum                                                                                                                                                                          |
| L7                   | Buschgruppe 94–102 × 12–14 mit Lücke von oben; `fundFormular` (97, 13)                                                                                                                                                                                                    |
| L8                   | Erlen am Fluss (106, 110, 114), Hase am Feldrand                                                                                                                                                                                                                          |

Kleinflora (Gras, Farn, Pilze, Blumen, Steine, kleine Büsche) in Gruppen von ein bis drei südlich
des Weges, Felsgruppen und Wildblumen vereinzelt. Belebung: Otis, Tessa (joggt), Radfahrer, Kühe,
Krähen, Hase, Reh. Offen: Hufeisen (`fundHufeisen`) und Weidetor als Auslöser folgen in Runde 5.
