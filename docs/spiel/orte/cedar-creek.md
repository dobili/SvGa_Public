# Cedar Creek und die Landstraße

Stand: 9.11.2026. Ortsdokument nach dem Verfahren in `docs/spiel/orte/README.md`: Ortsplan,
Ortsbild, Abgleich mit der Geschichte, Bühnenbilder. Es umfasst Cedar Creek (Ort 2) und den Weg
von Maple Falls dorthin (`wegMapleCedar`, Landstraße und Flussweg). Quellen: `05_Story_Bibel.md`
(Abschnitte 2.8, 2.10, 3.2, Szenen 14 bis 25, Route 2 in 10.1), `09_Weltbeschreibung.md` (5.2,
5.3, Belebung in `inhalte/abenteuer/szenen/`), `ortsprofile.json`, `KARTENREGELN.md`, `orte.json`
(Übergänge), die heutigen Szenen in `inhalte/abenteuer/szenen/` und die Übergangsprüfung
(`python -m pipeline.abenteuer.uebergaenge`). Die Bühnenbilder folgen nach der Durchsicht des
Musters (Maple Falls).

## 1. Ortsplan

Norden ist oben, auf allen Karten. Die Reise geht von Westen nach Osten: Maple Falls (Park) →
Landstraße → Flussweg → Cedar Creek → (ab Akt 2) Zedernwald nach Riverton. Der Fluss von Maple
Falls begleitet den Weg im Süden; hinter der Kuhweide der Landstraße biegt er nach Süden aus und
kommt am Flussweg zurück. Der Bach von Cedar Creek ist ein eigenes Gewässer: Er kommt im Norden aus
den Zedern, fließt am Ostrand des Ortes nach Süden und mündet südlich der Karte in den Fluss.

### 1.1 Der Weg: Landstraße und Flussweg (`wegMapleCedar`)

```
                                        N
 ┌──── mapleFalls.park (30 × 20) ────┐┌──────── wegMapleCedar.landstrasse (34 × 22) ────────┐┌──── wegMapleCedar.flussweg (28 × 20) ────┐
 │ Kiosk, Ahorn                       ││ Kornfeld bis an den West-, Nord- und Ostrand          ││ Ahorn und Erlen in Gruppen, Büsche        │
 │                                    ││ Vogelscheuche · Traktor am Gatter · Büsche (Fund)     ││ Fund Münzen unter dem Baum                │
 │                                    ││ ── Zaun ──────[Gatter]─── Zaun ───────────────────── ││                                           │
 │ ══ Parkstraße (Reihen 9–10) ══════ ╪╪═ Feldweg (Reihen 9–10) ══ Abzweig ═══════════════════╪╪═ Uferweg (Reihen 9–10) ══════════════ ╪═► Cedar Creek
 │ Bänke, Haltestelle (Bus)           ││ Tafel + Ortsschild „Maple Falls“ · Wegweiser am Abzweig││ Bank (Rast) · Ortsschild „Cedar Creek“     │
 │                                    ││ ── Zaun Kuhweide ──     Heuhaufen · Bank (Nia) · Bäume ││ ─── Ufer ──── Steg ─────────────────────── │
 │ ~~~~~ Fluss, Uferweg ~~~~~~~~~~~~~ ││ Kuhweide bis zum Südrand                               ││ ~~~~~~ Fluss bis West-, Ost-, Südrand ~~~~ │
 └────────────────────────────────────┘└────────────────────────────────────────────────────────┘└───────────────────────────────────────────┘
```

**Landstraße (34 × 22, wie heute).**

- **Feldweg** aus Erde mit weichen Rändern und Grasbüscheln (Regel 9.6.1), **zwei Felder breit**,
  Reihen 9 und 10, durchgehend von Westrand zu Ostrand. Er setzt die Parkstraße fort, die im Park
  ebenfalls in den Reihen 9 und 10 liegt.
- **Nördlich:** Kornfeld von Reihe 1 bis 7, reicht an West-, Nord- und Ostrand (Regel 6.3). Zaun in
  Reihe 8 über die ganze Breite, mit **Gatter** in den Spalten 12 und 13. Dort zweigt ein schmaler
  Feldweg nach Norden ab (zur Hofeinfahrt außerhalb der Karte): das ist die einzige Kreuzung, und
  nur hier steht der **Wegweiser** (Maple Falls ←, Cedar Creek →, Hof ↑; Regel 5.8). Der
  **Traktor** steht innen am Gatter (14, 6), die Vogelscheuche im Feld (6, 3). Die dichten
  **Büsche** mit dem Fund (`fundFormular`) stehen am Ostende des Feldes (26–30, 3–7), mit einer
  Lücke von oben.
- **Südlich:** Am Ortsausgang links die **Rätseltafel** mit Dach (`tafel`, 2–3, 11) und daneben das
  Ortsschild „Maple Falls“ mit der Rückseite zum Betrachter, wie ein Ortsausgangsschild. Ab Spalte 5
  der Zaun der **Kuhweide** (Reihe 12), die Weide reicht bis zum Südrand, Kühe darin. Ostwärts
  Heuhaufen (22, 12), die **Bank** direkt am Weg (25, 11) mit Blick nach Norden über das Feld, Nia
  daneben (`gegnerin`, 27, 11), zwei Laubbäume südlich der Bank.
- **Wanderer** (`wanderer`) auf dem Weg unterwegs, um Spalte 15.

**Flussweg (28 × 20, wie heute).**

- **Uferweg** aus Erde, zwei Felder breit, Reihen 9 und 10, von Westrand zu Ostrand.
- **Südlich:** Uferkante in Reihe 13, der **Fluss** von Reihe 14 bis zum Südrand und über West- und
  Ostrand hinaus (Regel 6.4). Die **Rastbank** (`rast`, 15, 11) steht direkt am Weg und schaut nach
  Süden auf das Wasser (Regel 5.7, Aussicht). Ein **Steg** beginnt am Ufer bei Spalte 21 und ragt
  bis Reihe 17 ins Wasser, auf Pfählen (Regel 9.7.4); ein Angler sitzt darauf. Schilf und Steine am
  Ufer, der Reiher im seichten Wasser.
- **Nördlich:** Ahorne und Erlen in Gruppen von drei bis fünf, Büsche, Wildblumen; der Fund
  `fundMuenzen` unter einem Baum (10, 6), vom Weg aus erreichbar.
- **Ortsschild** „Cedar Creek, gegr. 1851“ (`schildCedar`) am Ostende südlich des Weges (25, 11),
  Schrift zum Betrachter.

### 1.2 Cedar Creek (`cedarCreek`)

```
                                              N
 ┌─────────────────────────────── cedarCreek.aussen (44 × 24) ────────────────────────────────┐
 │ Zedern (Waldrand, dicht)                                                       │~ Bach ~│ Z│
 │                                                                                │        │ e│
 │  [Waschsalon 7]   L   [Bibliothek 9, Turm, Treppe, Laternen]     Zedern       ─Brücke══════╪═► Zedernwald (ab Akt 2)
 │                                                                                │        │ d│
 │ ─ Gehweg Nord ─────────────────────────────────────── Tafel·Plakat ─[Halt.]─ U │ ═Steg  │ e│
 │ ═ Hauptstraße (Reihen 16–17) ═════════════════════════════════ Wendeplatz ═══ f │        │ r│
 │ ─ Gehweg Süd ─────────────────────────────────────────────────────────────── e │        │ n│
 │  [Haus 1]  [Haus 2]   Wiese mit roten Zedern · Bank zum Bach                  r │        │  │
 └────────────────────────────────────────────────────────────────────────────────┴────────┴──┘
 ▲ Westrand: Hauptstraße ↔ Flussweg                                    Bach oben und unten bis zum Rand
```

**Außen (44 × 24, wie heute).**

- **Hauptstraße**, asphaltiert, **zwei Felder breit**, Reihen 16 und 17. Sie kommt am Westrand vom
  Flussweg und endet im Osten an einem **Wendeplatz** (Spalten 28 bis 33), vor dem Uferweg. Gehweg
  Nord in Reihe 15, Gehweg Süd in Reihe 18, mit Bordsteinkanten auf beiden Seiten (Regel 5.2 und
  9.2.1), beide bis zum Westrand und um den Wendeplatz herum.
- **Nordseite der Straße** (Fassaden mit Türen unten, Reihe 14):
  - **Waschsalon** (Spalten 2 bis 8, Fassade 7), Neonschild, rot-weiße Markisen, Tür bei Spalte 5;
    davor der Hund.
  - Zwischen Waschsalon und Bibliothek eine **Laterne** am Gehweg (Regel 9.4.1).
  - **Bibliothek** (Spalten 12 bis 20, Hauptbau 9 breit, mittig ein schiefergedeckter Turm),
    Backstein, Bogenfenster, Treppe mit drei Stufen zur hölzernen Doppeltür im Turm (Spalte 16),
    links und rechts der Treppe je eine Laterne (Regel 9.3.4). Das größte Gebäude des Ortes.
  - Östlich der Bibliothek Zedern, dann am Gehweg die hölzerne **Anschlagtafel** mit Zetteln vom
    Gemeindefest und dem Plakat von Perfect Move (`plakat`, 31, 14) und die **Bushaltestelle** mit
    Wartehäuschen an der Bordsteinkante des Wendeplatzes (`bushaltestelle` und `busZurueck`, 32,
    15), offene Seite zum Gehweg (Regel 9.4.4). Im Häuschen die Bank, auf der Victor sitzt.
- **Südseite der Straße:** zwei kleine **Wohnhäuser** aus Holz (Spalten 3 bis 8 und 11 bis 16) mit
  Vorgarten, Zaun ringsum, Pforte zum Gehweg Süd, Plattenweg zur Tür in der Nordfassade,
  Briefkasten außen an der Pforte (Regeln 9.3.1 und 9.3.2); nicht begehbar. Östlich davon eine
  **Wiese mit roten Zedern** in lockeren Gruppen bis zum Südrand und eine Bank am Uferweg mit Blick
  auf den Bach.
- **Bach** (Spalten 37 bis 41) von Nord- bis Südrand, Uferkante beidseitig, Schilf am Westufer.
  Westlich davon ein **Uferweg** aus Erde (Spalten 35 und 36) von Norden bis zum Südrand, der am
  Wendeplatz an die Straße anschließt. Der **Steg** (`steg`) beginnt am Westufer in Reihe 12 und
  ragt bis Spalte 40 ins Wasser; Rosa angelt an seinem Ende, ein Mann erneuert Bretter.
- **Ostufer und Brücke:** Östlich des Baches ein schmaler Streifen Zedernwald (Spalten 42 und 43).
  Eine **Holzbrücke** quer über den Bach in den Reihen 6 und 7 verbindet den Uferweg mit dem
  Ostufer, ein Waldweg (zwei Felder breit) führt von dort über den **Ostrand** in den Zedernwald
  (`zedernwald`, erst nach `endeAkt1Gesehen`; bis dahin steht ein Schild „Weg gesperrt,
  Brückenarbeiten“ an der Brücke). So beginnt der Weg nach Riverton „ab dem Steg, am Bach entlang“
  (Bibel 10.1), und der Bach bleibt oben und unten offen bis zum Rand.

### 1.3 Gebäude und Maße

| Gebäude                | Außen (Fassade, Kacheln)                                                                       | Innen                                                            | Begehbar |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- |
| Bibliothek (1890)      | Backstein, Hauptbau 9 breit mit Turm in der Mitte, Doppeltür im Turm bei Spalte 5 von 9 (50 %) | Lesesaal `bibliothek` 18 × 14, Tür Südwand Spalte 9 (50 %)       | ja       |
| Archiv (Keller)        | – (unter dem östlichen Teil der Bibliothek)                                                    | `archiv` 14 × 11, liegt unter den Spalten 4 bis 17 des Lesesaals | ja       |
| Waschsalon Mr. Boateng | Flachbau mit Schaufenstern, Fassade 7, Tür bei Spalte 4 von 7 (50 %)                           | `waschsalon` 14 × 11, Tür Südwand Spalte 7 (50 %)                | ja       |
| Wohnhaus 1 und 2       | Holz, je Fassade 6, Tür in der Nordfassade zur Straße                                          | –                                                                | nein     |
| Bushaltestelle         | Wartehäuschen 3 breit am Wendeplatz                                                            | –                                                                | Kulisse  |

Regel wie in Maple Falls: Die Fassade ist halb so breit wie das Erdgeschoss innen, die Tür sitzt
außen und innen an derselben relativen Stelle (±1 Kachel). Treppen liegen übereinander: Die
Kellertreppe der Bibliothek liegt in der Nordostecke (Spalte 15), deshalb liegt die Treppe im Archiv
bei Spalte 11 (15 − 4) an der Nordwand. Heute liegt sie in der Nordwestecke (Spalte 2); das ändert
das Bühnenbild.

### 1.4 Übergänge

| Von (Karte, Auslöser, Feld)                                 | Nach (Karte, Auslöser, Feld)                                   | Lage                                                                                                                 |
| ----------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| mapleFalls.park `landstrasse` (Ostrand, Reihen 9–10)        | landstrasse `zurueckPark` (Westrand, Reihen 9–10)              | Parkstraße und Feldweg je **zwei** Felder breit, gleiche Reihen.                                                     |
| landstrasse `weiterFluss` (Ostrand, Reihen 9–10)            | flussweg `zurueckLandstrasse` (Westrand, Reihen 9–10)          | Feldweg geht in den Uferweg über, je zwei Felder.                                                                    |
| flussweg `weiterCedar` (Ostrand, Reihen 9–10)               | cedarCreek.aussen **`flussweg`** (Westrand, Reihen 16–17), neu | Uferweg geht in die Hauptstraße über, je zwei Felder. Heute führt `weiterCedar` zur Bushaltestelle: ändern.          |
| mapleFalls.park `bushaltestelle` (Dialog, Reise)            | cedarCreek.aussen `bushaltestelle` (32, 15)                    | Busfahrt; Ankunft an der Haltestelle (Szene 14).                                                                     |
| cedarCreek.aussen `busZurueck` (Dialog, Reise)              | mapleFalls.park `bushaltestelle`                               | Busfahrt zurück.                                                                                                     |
| aussen `bibliothekTuer` (Doppeltür im Turm, Spalte 16)      | bibliothek `bibliothekAusgang` (Südwand, Spalte 9)             | Hinein nach Norden, Ankunft an der Südwand.                                                                          |
| bibliothek `kellertreppe` (Tür in der Nordwand, Spalte 15)  | archiv `kellerAusgang` (Treppe an der Nordwand, **Spalte 11**) | Treppen übereinander; oben führt die Treppe nach unten, unten nach oben (Regel 2.4).                                 |
| aussen `waschsalonTuer` (Spalte 5)                          | waschsalon `waschsalonAusgang` (Südwand, Spalte 7)             | Hinein nach Norden.                                                                                                  |
| aussen `zedernwald` (Ostrand hinter der Brücke, Reihen 6–7) | wegCedarRiverton.zedernwald `zurueckCedar` (Westrand)          | Waldweg je zwei Felder; nur nach `endeAkt1Gesehen`. Heute liegt `zedernwald` am **Westrand**: auf den Ostrand legen. |

**Was die Übergangsprüfung heute meldet** (Stand 9.11.2026) und wie es passen soll:

1. `mapleFalls.park landstrasse` ↔ `wegMapleCedar.landstrasse zurueckPark`: Weg ungleich breit
   (2 ↔ 1). Soll: Feldweg der Landstraße zwei Felder breit in den Reihen 9 und 10 (heute ein Feld in
   Reihe 11).
2. `mapleFalls.aussen park` ↔ `mapleFalls.park park`: ungleich breit (1 ↔ 2). Gehört zu Maple Falls;
   Soll dort: Birch Lane zwei Felder (siehe `maple-falls.md`).
3. Nicht gemeldet, aber falsch: Der Flussweg endet heute an der Bushaltestelle statt am Westrand
   von Cedar Creek, und der Zedernwald liegt am selben Westrand wie die Ankunft vom Flussweg. Mit
   dem Plan oben kommt man von Westen an und verlässt den Ort nach Osten.

Änderungen in `orte.json`, die der Plan voraussetzt (für den Haupt-Chat): neuer Auslöser
`flussweg` auf `cedarCreek.aussen` (Übergang zum Flussweg, Gegenstück von `weiterCedar`; der Dialog
`cedar-creek-aussen.ankunft_zu_fuss` bleibt an `weiterCedar`); `weiterCedar.ziel` auf
`{karte: cedarCreek.aussen, ausloeser: flussweg}`.

## 2. Ortsbild

Hinter dem Stadtpark von Maple Falls wird die Parkstraße zu einem Feldweg, und mit dem Asphalt
endet auch das Rauschen des Wasserfalls. Hier hört man den Wind im Korn. Das Feld des Bauern reicht
bis an den Himmel, nur eine Vogelscheuche mit verbeultem Hut steht darin, und am Gatter wartet ein
roter Traktor, als hätte jemand ihn mitten in einem Gedanken abgestellt. Auf der anderen Seite
grasen Kühe hinter einem Zaun, dessen Pfosten so schief stehen wie Zähne in einem alten Mund. An
der Bank neben dem Heuhaufen sitzt manchmal ein Mädchen mit Magnetschachspiel und wartet auf
jemanden, der sich traut.

Wo der Feldweg den Fluss wiederfindet, wird er weich und schattig. Erlen hängen über das Wasser,
morgens liegt Nebel auf dem Fluss, und ein Reiher steht so still im Schilf, dass man ihn für einen
Pfahl hält, bis er den Kopf dreht. Ein alter Steg ragt ins Wasser; auf ihm sitzt fast immer ein
Angler, der nie etwas fängt und nie traurig darüber ist. Am Ende des Weges steht ein grün
gestrichenes Schild mit weißen Buchstaben: „Cedar Creek, gegr. 1851“.

Cedar Creek ist kleiner als Maple Falls, und es scheint das zu wissen. Die Hauptstraße ist kurz und
endet, ehe sie richtig angefangen hat, an einem Wendeplatz vor dem Bach. Rote Zedern stehen um den
Ort wie ältere Verwandte, die aufpassen, und ihr Holz riecht warm, wenn die Sonne darauf fällt. Der
Bach ist schmal und schnell, er glitzert unter dem Steg und murmelt Tag und Nacht dasselbe Lied.

Über allem steht die Bibliothek. Sie wurde 1890 aus rotem Backstein gebaut, als man noch glaubte,
ein Ort brauche zuerst ein Haus für Bücher und dann alles andere. Ihr Turm hat ein Schieferdach, an
dem ein Eichelhäher sitzt; drei Stufen führen zu einer hölzernen Doppeltür, deren Messinggriffe von
hundert Jahren Händen hell gerieben sind. Links und rechts der Treppe brennen abends zwei alte
Laternen. Drinnen riecht es nach Papier, Bohnerwachs und ein wenig nach Kaffee aus der Kanne hinter
dem Tresen; grüne Leselampen werfen runde Lichtinseln auf die Tische, an denen nachmittags der
Schachclub von Mrs. Okafor sitzt. Unter dem Lesesaal, eine schmale Treppe hinunter, liegt das
Archiv: Kartons mit Jahreszahlen, eine Lampe, die flackert, wenn oben jemand über die Dielen geht,
und der kühle Geruch von Papier, das älter ist als alle Menschen im Ort.

Neben der Bibliothek brummt der Waschsalon von Mr. Boateng, ein Flachbau mit rot-weißen Markisen
und einem Neonschild, bei dem ein Buchstabe fehlt. Vor der Tür liegt ein Hund, der zu niemandem
gehört und allen. Gegenüber stehen zwei kleine Holzhäuser mit Blumenkästen unter den Fenstern und
Briefkästen an der Pforte. An der Bushaltestelle raucht der Fahrer des klappernden Überlandbusses
eine Zigarette, bevor er zurück nach Maple Falls fährt. An der Anschlagtafel daneben hängen Zettel
vom Gemeindefest, eine Katze wird vermisst, jemand verkauft ein Kanu, und mitten darauf klebt ein
glänzendes Plakat, das nicht hierher passt: „Perfect Move – Schach für die Zukunft. Bald auch in
deiner Stadt.“

Am Bach, auf dem Steg, sitzt Rosa mit ihrer Angel und einem Brett mit Magnetfiguren. Im Schilf
neben ihr liegt seit zwei Jahren ein verrosteter Schlüssel, den keiner vermisst. Abends, wenn die
Sonne hinter den Zedern verschwindet, kommen die Kinder mit einem Teleskop zum Steg, und auf der
anderen Seite des Baches führt eine alte Holzbrücke in den Wald, durch den man eines Tages nach
Riverton gehen wird. Die Zeit geht hier langsamer. Niemand in Cedar Creek findet das schlimm.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

| Karte       | Szenen                          | Figuren                                                        | Auslöser und Gegenstände                                                                                                                   | Belebung                                                       |
| ----------- | ------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| landstrasse | Route 1 (W4)                    | Nia (Straßengegnerin, Begegnung `wegMapleCedar.nia`), Wanderer | `zurueckPark`, `weiterFluss`, `tafel` (Runde `wegMapleCedar.tafel`), `fundFormular` (Fund „altes Partieformular“)                          | Bauer, Joggerin, Radfahrer, Kühe, Hase, Reh                    |
| flussweg    | Route 1 (W4)                    | –                                                              | `zurueckLandstrasse`, `weiterCedar` (Ankunftsdialog), `rast`, `fundMuenzen`, `schildCedar`                                                 | Angler, Joggerin, Reiher, Hase, Schmetterling; Nebel am Morgen |
| aussen      | 14, 21, 22, 23, 25; Akt 2 (Weg) | Rosa (Steg), Victor (Szene 21); Coach, Juno, Sam (Szene 14)    | `bushaltestelle`, `busZurueck`, `bibliothekTuer`, `waschsalonTuer`, `plakat`, `steg` (Sterne, Ende Akt 1, Fund `schluessel`), `zedernwald` | Busfahrer, Stegbauer, Hund, Reiher, Eichelhäher                |
| bibliothek  | 15, 16, 24                      | Mrs. Okafor, Dex, Mae                                          | `bibliothekAusgang`, `kellertreppe`, `zeitungsregal`, `globus`, `schildFluestern`; vier Bretter                                            | Leserin mit Bücherstapel                                       |
| archiv      | 18, 19, 20                      | Mrs. Okafor (zeitweise), Ambrose                               | `kellerAusgang`, `karton1858`, `programmheft`, `boxerfoto`, `wasserfleck`                                                                  | –                                                              |
| waschsalon  | 17                              | Mr. Boateng                                                    | `waschsalonAusgang`, `trockner`, `zettelTurm`, `comicheft`, `automat`                                                                      | Kundin                                                         |

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

| Element                                      | Entscheidung                                                                             | Grund                                                                                                                                        |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Ankunft zu Fuß an der Bushaltestelle         | geändert: Ankunft am Westrand auf der Hauptstraße; mit dem Bus weiter an der Haltestelle | Wege laufen über den Rand weiter (Regel 5.1, Übergangsprüfung); wer läuft, kommt nicht aus einem Bus.                                        |
| Zedernwald am Westrand                       | geändert: Ostrand, über eine Holzbrücke über den Bach                                    | Bibel 10.1: Waldweg „ab dem Steg, am Bach entlang“; Reiserichtung West → Ost; der Westrand gehört dem Flussweg.                              |
| Bach „rechts“                                | bleibt, reicht oben und unten bis zum Rand, mit Uferweg und Ufer beidseitig              | Ortsprofil (Pflicht), Regeln 6.4 und 9.7.1.                                                                                                  |
| Wasser im Flussweg („der Bach wird breiter“) | geändert: Es ist der Fluss von Maple Falls, nicht der Bach von Cedar Creek               | Der Bach liegt östlich, der Weg kommt von Westen; die Rastbank steht „am Fluss“ (Ink). Der Bach mündet südlich von Cedar Creek in den Fluss. |
| Victor auf der Bank auf der Wiese            | geändert: Victor sitzt im Wartehäuschen der Bushaltestelle                               | Szene 21: „sitzt allein an der Bushaltestelle“. Die Wiesenbank bleibt, zum Bach gewandt (Ortsprofil).                                        |
| Zwei kleine Wohnhäuser                       | neu, auf der Südseite, nicht begehbar                                                    | Ortsprofil (Nachbarschaft); ohne Häuser wäre der Ort nur Kulisse. Häuser an der Straße mit Grundstück (Regeln 5.3, 9.3).                     |
| Plakat von Perfect Move „an einer Mauer“     | geändert: auf der Anschlagtafel neben der Haltestelle                                    | Heutige Szene; eine Tafel erklärt, warum dort ein Plakat hängt (Regel 5.8, Schild mit Zusammenhang).                                         |
| Bibliothek mit Turm, Treppe und Laternen     | bleibt; Laternen symmetrisch an der Treppe                                               | Bibel 3.2, Weltbeschreibung 5.3, Regel 9.3.4.                                                                                                |
| Kellertreppe im Archiv                       | geändert: Nordwand, Spalte 11 (unter der Kellertür der Bibliothek)                       | Treppen liegen übereinander (Regel wie Maple Falls).                                                                                         |
| Wegweiser auf der Landstraße                 | geändert: nur am Abzweig zum Hof (Gatter), mit drei Richtungen                           | Regel 5.8 und Ortsprofil („Wegweiser nur an einer Kreuzung“); heute steht er am Rand ohne Kreuzung.                                          |
| Traktor mitten im Feld                       | geändert: innen am Gatter                                                                | Regel 6.3 und Ortsprofil.                                                                                                                    |
| Feldweg ein Feld breit                       | geändert: zwei Felder                                                                    | Übergangsprüfung: Parkstraße ist zwei Felder breit.                                                                                          |
| Fluss zwischen Park und Flussweg             | biegt hinter der Kuhweide nach Süden aus (auf der Landstraße nicht sichtbar)             | Die Landstraße zeigt Felder (Ortsprofil); so bleibt der Fluss trotzdem ein Gewässer, das zum Rand reicht.                                    |
| Brücke zum Zedernwald                        | neu; in Akt 1 mit Schild „Weg gesperrt, Brückenarbeiten“                                 | Der Übergang ist erst nach `endeAkt1Gesehen` offen; das Schild erklärt die Sperre in der Welt. Der Stegbauer (Belebung) passt dazu.          |
| Teleskop, Sternennacht                       | nur Dialog (Szene 22, Abend am Steg)                                                     | kein eigenes Bild nötig.                                                                                                                     |
| Schlüssel im Schilf                          | über den Dialog am Steg (`steg`, `gibFund("schluessel")`), kein eigenes Objekt           | wie heute; das Schilf am Westufer neben dem Steg ist der Ort.                                                                                |

## 4. Bühnenbilder

Folgen nach Durchsicht des Musters.
