# Ghost Town (`ghostTown`) und die Erinnerung „Die letzte Kerze, 1866“ (`erinnerungSiedlung`)

Ortsdokument nach `README.md` (vier Teile, Zusatz für große Außenkarten). Verfasst von niedrig-1 in der
Nacht 9./10.11.2026 (Auftrag `auftraege/runde5c_akt4.md`). Grundlagen: Story-Bibel Teil 4, Abschnitte 25
bis 35, besonders 26 (Zeitlinie 1866/67), 27.3 (Mr. Pruitt), 28 (Welt) und die Szenen 98 bis 101 in 29;
Weltbeschreibung 5.8 und 5.13 (`09_Weltbeschreibung.md`); Wegenetz Abschnitt 5 (`13_Wegenetz.md`:
Nebenort N7 Goldmine, Sperre S11, Abkürzung Q4); Varianten-Grundsatz in
`10_Sprueche_Schauplaetze_Varianten.md`. Maßstab nach `KARTENREGELN.md` 7a.2: mittlere Stadt (Ort 11 in
Akt 4), Innenräume wie Gasthaus und Wohnhaus.

## 1. Ortsplan

### 1.0 Lage in der Welt

Ghost Town ist die verlassene Goldgräberstadt in der Wüste zwischen Pinewood Camp und den Großen Seen.
Man kommt von **Westen** über die Staubstraße (Weg 10, `wegPinewoodGhost.staubstrasse`) und verlässt
den Ort nach **Osten** zum Seeufer (Weg 11, `wegGhostCapital.seeufer`), das erst nach der Fernpartie
offen ist (S12 liegt am Seeufer). Nördlich, in der Bruchkante über der Stadt, liegt der Stollen der
**Goldmine** (Nebenort N7, Sperre S11). Die **Alte Minenstraße** (Q4, Abkürzung nach Crossroads) mündet
von Süden; sie bekommt eine eigene Karte erst in Runde 6 (siehe 3.3), der Südrand ist dafür in den
Spalten 12–14 vorbereitet (Erdweg endet am Viehgatter S13).

```text
                                   N
          Bruchkante aus rotem Fels (Reihen 0–4), Stollen der Goldmine N7 (S11) bei 40–43
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │ Felsen, Kakteen        Wasserturm   Lore, Gleisrest ┆ Stollen (Bretter, Schild) │
  │   [Laden]  [Hufschmied]  [ SALOON ]  [Sheriff] [Bank/Prüfamt]  ┆               │
  │ ─ Bretterweg Reihe 20 ───── Tür (27, 20) ─────────────────────────────────────│
  W ══ Hauptstraße „Front Street“ Erde, 3 Felder, Reihen 21–23 ════════════════════ O
  │   Stall, Tränke   Planwagen   Brunnen     ┆ Abzweig                Haltestelle │
  │  Hügel mit Bank  ┆ Q4 (Süd, später)       Friedhof mit Holzzaun und Tor       │
  │  (Sternenhimmel) ┆                         Gräber, Kreuze; Grab ohne Namen    │
  └──────────────────────────────────────────────────────────────────────────────┘
```

Die Erinnerung „Die letzte Kerze“ (`erinnerungSiedlung`) ist keine Karte in der Gegenwart: Man gelangt
über das versteckte Postreiterabzeichen im Saloon (`abzeichen`, erst nach `abzeichenGefunden`) in die
Bretterhütte von 1866 und kehrt über ihre Tür (`rueckkehr`) in den Saloon zurück. Sepia gilt nur als
Tönung der Szene (Bibel 28, Weltbeschreibung 5.13); die Karten selbst sind farbig gezeichnet.

### 1.1 Ghost Town außen (`ghostTown.aussen`, 56 × 40)

Hauptstraße **Front Street** aus festgetretener Erde, drei Felder breit, in den **Reihen 21–23** von Rand
zu Rand, in der Mitte (Spalten 24–34) eine Reihe nach Süden versetzt, wo der Brunnen steht. Nördlich der
Straße ein **Bretterweg** (Reihe 20, Holz) vor der Häuserzeile mit falschen Fassaden; alle Türen nach
Süden. Hinter den Häusern steigen Geröll und roter Fels zur **Bruchkante** (Reihen 0–4, Wand `fels`)
an, in der der Stolleneingang der Goldmine sitzt (Spalten 32–33); ein Erdweg, zwei Felder breit, führt
von der Straße zwischen Saloon und Sheriff hinauf (Spalten 32–33). Südlich der Straße Stall, Tränke,
Wasserturm und ein umgekippter Planwagen; im Südosten der **Friedhof** in einem Holzzaun mit Tor, im
Südwesten ein **Hügel** mit einer Bank für den Blick in den Sternenhimmel (Szene 101).

| Abschnitt (Spalten / Reihen)       | Thema             | Inhalt                                                                                                          | Zum Entdecken                               |
| ---------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| G1 Ortseingang (0–13 / 14–30)      | aus dem Staub     | Staubstraße mündet, Ortsschild „Gold Hill, pop. 0“, Kakteen, Laden mit Veranda                                  | Tumbleweed rollt über die Straße (Belebung) |
| G2 Hufschmied (14–23 / 8–20)       | Eisen und Holz    | Schmiede mit Amboss, Pferdetränke, Wagenrad an der Wand                                                         | Geier auf dem Dachfirst                     |
| G3 Saloon (22–33 / 6–20)           | Herz der Stadt    | zweistöckiger Saloon mit Schwingtür (27, 20), Balkon, Fässer am Bretterweg                                      | Tür (`saloonTuer`), Klavierklänge bei Wind  |
| G4 Sheriff, Prüfamt (34–51 / 8–20) | Recht und Gold    | Sheriffbüro mit Gitterfenster, Prüfamt mit Waage, Abzweig zur Mine                                              | Steckbrief am Brett                         |
| G5 Goldmine (36–50 / 0–8)          | der Stollen       | Stolleneingang mit Holzstützen, quer genagelte Bretter, Schild „Betreten verboten – Pruitt“, Lore auf Gleisrest | Sperre S11 sichtbar (dunkel, abgesperrt)    |
| G6 Brunnen (24–34 / 23–28)         | Wasser, das fehlt | gemauerter Brunnen ohne Seil, Wasserturm, umgekippter Planwagen                                                 | Eimer im Sand                               |
| G7 Hügel (2–14 / 30–38)            | Nachthimmel       | Sandhügel mit Bank nach Süden, Kakteen, Felsen                                                                  | `sternenhimmel` (Szene 101)                 |
| G8 Friedhof (34–53 / 28–38)        | Gräber im Sand    | Holzzaun mit Tor, Reihen von Holzkreuzen und Grabhügeln; am Ostrand das **Grab ohne Namen**                     | `grab` (Szene 98), Geierkreis darüber       |
| G9 Ortsausgang (52–55 / 14–30)     | zum See           | Haltestelle (Victor kommt mit dem Bus), Straße nach Osten                                                       | Victor am Haltestellenschild                |

**Sichtachsen:** Vom Ortseingang (G1) sieht man die Straße entlang den Saloon und dahinter die
Bruchkante mit dem Stollen; vom Brunnen (G6) das Friedhofstor; vom Hügel (G7) über die Dächer.

**Ränder:** Norden Bruchkante aus rotem Fels (Wand `fels`), nur der Stollen öffnet sie (gesperrt);
Westen und Osten Wüste mit Felsen und Kakteen, offen nur die Straße (Reihen 21–23); Süden Wüste und
Felsen, im Westen die Stelle für Q4 (Spalten 12–14, später Viehgatter S13).

**Abzweige:** zwei mit Ziel (Stollen G5, Friedhofstor G8), ein Trampelpfad zum Hügel (G7).
**Laufzeit:** Hauptstraße 56 Kacheln, mit Abzweigen etwa 110 Kacheln, gut 30 Sekunden.

### 1.2 Saloon (`ghostTown.saloon`, 20 × 14)

Gastraum eines zweistöckigen Holzsaloons. Nordwand Reihen 0–2 Holz, Boden Dielen, Südwand Reihe 13 mit
der **Schwingtür bei Spalte 10** (Ankunft (10, 12)). Theke an der Nordwand links, Klavier rechts,
Treppe nach oben an der Ostwand (Kulisse), Tische mit Stühlen; in der Mitte der staubige Tisch, auf
dem {held} und Victor die Fernpartie aufstellen (`fernpartieBrett`). Unter der Treppe im Dunkel liegt
das Postreiterabzeichen (`abzeichen`, Übergang in die Erinnerung, nur nach `abzeichenGefunden`).

### 1.3 Die Bretterhütte, 1866 (`erinnerungSiedlung.huette`, 12 × 10)

Eine Bretterhütte der Bergbausiedlung. Wände Holz (Nordwand Reihen 0–2), Boden grobe Dielen, Südwand
Reihe 9 mit der **Tür bei Spalte 6** (Ankunft (6, 8)). Pritsche an der Westwand, Tisch mit Kerze und
dem Brett in der Mitte (`kerze`), Ofen in der Nordostecke, Kisten, ein Fenster mit Blick in die Nacht;
der Postreiter wartet an der Tür.

### 1.4 Übergänge (Felder auf beiden Seiten)

| Von (Karte, Auslöser, Feld)                                | Nach (Karte, Auslöser, Feld; Ankunft)                                    | Lage, Bedingung                                                                                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| staubstrasse `weiterGhost` (Ostrand, Reihen 14–15)         | aussen `wegPinewood` (Westrand, Spalte 0, Reihen 21–22; Ankunft (1, 22)) | zwei Felder auf beiden Seiten (Schotterpiste, mittel-4); die Front Street wird am Rand von drei auf zwei Felder schmaler |
| aussen `wegCapital` (Ostrand, Spalte 55, Reihen 21–22)     | seeufer `zurueckGhost` (Westrand, Reihen 14–15)                          | `wenn: fernpartieGespielt`; zwei Felder Erdweg auf beiden Seiten (mittel-1)                                              |
| aussen `saloonTuer` (27, 20), Schwingtür in der Südfassade | saloon `saloonAusgang` (10, 13); Ankunft (10, 12)                        | Südfassade ↔ Südwand, Tür bei 50 %                                                                                       |
| saloon `abzeichen` (unter der Treppe)                      | huette `ankunft` (6, 8)                                                  | Erinnerung, `wenn: abzeichenGefunden`                                                                                    |
| huette `rueckkehr` (6, 9), Tür der Hütte                   | saloon `abzeichen`                                                       | zurück in die Gegenwart                                                                                                  |
| (später) Q4 Alte Minenstraße                               | aussen Südrand, vier Felder Schotter                                     | Runde 6: eigene Karte; das Viehgatter S13 steht am Ostrand von Crossroads (mittel-3)                                     |

## 2. Ortsbild

Mittag, und die Sonne steht so hoch, dass die Häuser keinen Schatten werfen. Gold Hill hieß die Stadt,
als hier noch jemand wohnte; jetzt nennt sie jeder Ghost Town, und das Ortsschild am Westeingang zählt
die Einwohner mit einer verwitterten Null. Die Front Street ist breit genug, dass zwei Ochsenkarren
aneinander vorbeikamen. Heute rollt nur ein Tumbleweed darüber, bleibt am Bretterweg hängen und rollt
weiter, wenn der heiße Wind wieder einsetzt.

Die Häuser stehen mit ihren falschen Fassaden zur Straße, als wollten sie größer aussehen, als sie je
waren: der Laden mit der Veranda, die Schmiede mit dem Amboss, der Saloon mit Balkon und Schwingtür,
das Sheriffbüro mit Gitter vor dem Fenster, das Prüfamt, in dem einmal Gold gewogen wurde. Das Holz
ist grau geworden, die Farbe nur noch in den Ritzen zu ahnen. Es riecht nach Staub, heißem Harz und
irgendwo nach Eisen. Hinter der Häuserzeile steigt Geröll zur roten Bruchkante an, und darin klafft der
Stolleneingang der Goldmine: Holzstützen, quer genagelte Bretter, ein Schild von Mr. Pruitt, „Betreten
verboten“, und davor eine Lore auf einem Rest Gleis.

Mr. Pruitt ist der einzige, der noch hier ist. Ein alter Mann mit Hut und Metalldetektor, der die
Straße abschreitet, als suche er etwas Bestimmtes, und dabei Geschichten sammelt: wer hier Gold fand
und wer nicht, wer im Saloon Karten spielte, wer am Fieber starb. Er kennt jedes Grab auf dem Friedhof
im Südosten, wo Holzkreuze schief im Sand stehen und ein Zaun mit einem Tor das Ganze umschließt, als
müsse man es festhalten. Am äußersten Rand, fast schon draußen, liegt ein Grab ohne Namen. Über dem
Friedhof kreisen Geier.

Im Saloon ist es kühl und dunkel. Durch die Ritzen der Bretter fallen Lichtstreifen, in denen Staub
tanzt. Die Theke trägt noch Gläser, das Klavier hat drei stumme Tasten, und mitten im Raum steht ein
Tisch, auf dem jemand einmal Schach gespielt haben muss: Die Holzplatte hat ein abgewetztes Quadrat.
Unter der Treppe, wo kein Licht hinkommt, liegt etwas Kleines aus Messing.

Nachts, wenn die Hitze aus dem Sand steigt, ist der Himmel über Ghost Town so voller Sterne, wie ihn
{held} noch nie gesehen hat. Auf dem Hügel im Südwesten steht eine Bank, von der aus man über die
Dächer und den Friedhof bis zum Horizont sieht.

**1866.** Dieselbe Gegend, nur jung: Die Siedlung besteht aus Zelten und Bretterhütten, die Mine ist
gerade eröffnet. In einer der Hütten liegt Ambrose im Fieber. Eine Kerze, ein Tisch, das Brett mit der
Stellung seiner Fernpartie, ein Brief. Draußen wartet der Postreiter.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

| Szene (Bibel 29)                | Karte                       | Verlangt                                                                                      |
| ------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| 98 Ghost Town                   | `ghostTown.aussen`          | Mr. Pruitt führt zum Grab ohne Namen am Rand des Friedhofs (`grab`); Victor kommt mit dem Bus |
| 99 Flashback: Die letzte Kerze  | `erinnerungSiedlung.huette` | Bretterhütte, Fieber (nur angedeutet), Kerze (`kerze`), Brett, Postreiter an der Tür          |
| 100 Die Fernpartie              | `ghostTown.saloon`          | Tisch mit dem Brett (`fernpartieBrett`), Victor, Mr. Pruitt                                   |
| 101 Die Nacht in Ghost Town     | `ghostTown.aussen`          | Ort mit Blick in die Sterne (`sternenhimmel`)                                                 |
| Entdeckung (Bibel 30)           | `ghostTown.saloon`          | Postreiterabzeichen versteckt, mit Laterne (`abzeichen`, Übergang in die Erinnerung)          |
| Sperre S11 (Wegenetz 5)         | `ghostTown.aussen`          | Stollen der Goldmine dunkel und abgesperrt von Mr. Pruitt                                     |
| Post-Game „Das Echo“ (Bibel 30) | `ghostTown.aussen`          | nachts am Grab; braucht nur den Platz am Grab                                                 |

### 3.2 Was bleibt, was sich ändert, was entfällt

| Element                          | Entscheidung | Grund                                                                                           |
| -------------------------------- | ------------ | ----------------------------------------------------------------------------------------------- |
| Hauptstraße mit Holzfassaden     | bleibt       | Weltbeschreibung 5.13                                                                           |
| Friedhof mit dem Grab ohne Namen | bleibt       | Szene 98; das Grab liegt am Rand, nicht in der Reihe                                            |
| Mr. Pruitt mit Metalldetektor    | bleibt       | außen als Statist mit Metalldetektor (`metallsucher`), die Figur `pruitt` im Saloon (Szene 100) |
| Geier                            | bleibt       | Geierkreis über dem Friedhof (eigenes Bild `geierkreis`)                                        |
| Goldmine N7                      | als Kulisse  | Stolleneingang am Rand mit S11; die Mine selbst ist ein Nebenort für später                     |
| Sepia                            | nur Szene    | Bibel 28; Karte farbig (Auftrag)                                                                |
| Haltestelle                      | neu          | Victor „kommt mit dem Bus nach“ (Szene 98)                                                      |
| Hügel mit Bank                   | neu          | Platz für Szene 101 (`sternenhimmel`) mit freier Sicht                                          |
| Pferde                           | entfällt     | die Stadt ist verlassen; Stall und Tränke leer                                                  |

### 3.3 Für Runde 6 (Auslöser und Bilder)

- Q4 Alte Minenstraße: eigene Karte (etwa 150 Kacheln), Übergang am Südrand (Spalten 12–14) mit dem
  Viehgatter S13; Auslöser `minenstrasse` in `orte.json` fehlt noch.
- Goldmine N7 (Stollen innen) mit Laterne; Auslöser am Stolleneingang (`stollen`) fehlt.
- Ansehen: Ortsschild, Steckbrief, Klavier, Amboss (keine Auslöser in `orte.json`).
- Bilder beim Haupt-Chat bestellt (Stand dieser Runde, siehe Meldung): Saloon-Fassade, falsche
  Holzfassaden (Laden, Schmiede, Sheriff, Prüfamt), Stolleneingang der Goldmine, Tumbleweed,
  Wagenrad, umgekippter Planwagen. Bis dahin Ersatz aus dem Katalog (in den Szenen genannt).

## 4. Bühnenbilder

### 4.1 Ghost Town außen (`ghostTown.aussen`)

**Größe** 56 × 40. **Boden** Sand (Wüste), Hauptstraße und Wege Erde, Bretterweg Dielen. **Wand** `fels`
für die Bruchkante (Reihen 0–4). **Grundtönung** Mittag im Hochsommer; Sepia nur über die Szene.

| Gegenstand                  | Feld (links oben) | Ausrichtung  | Material, Stil  | Zustand    | Zweck                 |
| --------------------------- | ----------------- | ------------ | --------------- | ---------- | --------------------- |
| Ortsschild „Gold Hill“      | (4, 18)           | zur Straße   | Holz, ländlich  | verwittert | G1                    |
| Laden mit Veranda           | (3, 10)           | Tür Süd      | Holz            | verwittert | Kulisse               |
| Schmiede                    | (15, 10)          | Tür Süd      | Holz, Eisen     | verwittert | Kulisse, Amboss davor |
| Saloon                      | (22, 8)           | Tür (27, 20) | Holz            | verwittert | `saloonTuer`          |
| Sheriffbüro                 | (35, 11)          | Tür Süd      | Holz            | verwittert | Kulisse               |
| Prüfamt                     | (47, 11)          | Tür Süd      | Holz, Backstein | verwittert | Kulisse               |
| Stolleneingang mit Brettern | (40, 2)           | Süd          | Fels, Holz      | alt        | S11 (gesperrt)        |
| Lore auf Gleisrest          | (43, 6)           | –            | Eisen           | rostig     | G5                    |
| Wasserturm                  | (14, 25)          | –            | Holz            | alt        | Sichtpunkt            |
| Brunnen                     | (28, 25)          | –            | Stein           | alt        | G6                    |
| Friedhof: Zaun, Tor, Kreuze | (34–53, 28–38)    | Tor Nord     | Holz            | alt        | G8                    |
| Grab ohne Namen             | (52, 33)          | –            | Erde, Holz      | alt        | `grab`                |
| Bank auf dem Hügel          | (7, 33)           | nach Süden   | Holz            | alt        | `sternenhimmel`       |
| Haltestellenschild          | (52, 20)          | zur Straße   | Metall          | rostig     | Victor                |

Belebung: `metallsucher` (Mr. Pruitt mit Detektor, Hauptstraße), Geierkreis über dem Friedhof, Eule
nachts auf dem Wasserturm, Tumbleweed, Echse auf dem Felsen.

### 4.2 Saloon (`ghostTown.saloon`)

**Größe** 20 × 14. **Wand** Holz (Nordwand Reihen 0–2), **Boden** Dielen, Südwand Reihe 13 mit der
Schwingtür bei Spalte 10 und Fußmatte davor.

| Gegenstand                          | Feld            | Ausrichtung | Zweck                          |
| ----------------------------------- | --------------- | ----------- | ------------------------------ |
| Theke mit Gläsern                   | (2, 3), 7 breit | Front Süd   | Gastraum                       |
| Regal mit Flaschen hinter der Theke | Wand (2–8, 1)   | –           | Wandfläche                     |
| Klavier                             | (15, 3)         | Front Süd   | Klang                          |
| Treppe nach oben (Kulisse)          | Ostwand (17, 5) | –           | `abzeichen` darunter (17, 11)  |
| Spieltisch mit Brett                | (8, 7)          | –           | `fernpartieBrett`, zwei Stühle |
| Tische mit Stühlen                  | (3, 9), (13, 9) | –           | Gastraum                       |
| Fässer, Laterne, Spucknapf          | Ecken           | –           | Spuren                         |

Figur: `pruitt` am Tisch. Belebung: Staubwirbel im Lichtstreifen (`wind`).

### 4.3 Die Bretterhütte (`erinnerungSiedlung.huette`)

**Größe** 12 × 10. **Wand** Holz, **Boden** Dielen, Südwand Reihe 9 mit der Tür bei Spalte 6.

| Gegenstand                   | Feld        | Zweck                   |
| ---------------------------- | ----------- | ----------------------- |
| Pritsche mit Decke           | (1, 3)      | Fieber (nur angedeutet) |
| Tisch mit Kerze und Brett    | (5, 4)      | `kerze`                 |
| Stuhl                        | (5, 6)      | am Tisch                |
| Ofen                         | (9, 2)      | Wärme, Ecke NO          |
| Kisten, Laterne, Mantelhaken | Ecken       | Spuren                  |
| Fenster mit Nachthimmel      | Wand (8, 1) | Blick hinaus            |

Figur: `postreiter` an der Tür (6, 7).

### 4.4 Gebaut (Stand Runde 5c)

Variante A in `szenen/`, B und C in `szenen/varianten/`. Abweichungen vom Plan oben: Der Weg zur Mine
liegt zwischen Saloon und Sheriff (Spalten 30–31 in A, 18–19 in B, 29–30 in C), der Stolleneingang
(4 × 4, vernagelt) steht in einer Lücke der roten Bruchkante; der Auslöser `goldmine` (Nebenort N7,
mittel-4) liegt auf den beiden Wegfeldern direkt davor in Reihe 5; Saloon-Tür bei (27, 20) in A und C, (29, 20) in B. Das Friedhofstor steht offen
(Lücke zwischen Zaunenden), damit das Grab ohne Namen erreichbar ist. Ersatzbilder bis zu den
bestellten: Holzhäuser aus dem Katalog (Post_Apocalyptic_House, Farmer_House, Barn_Small), Absperrbock
statt Stolleneingang. Im Saloon liegt die Theke an der Nordwand, die Treppe an der Ost- (A, C) oder
Westwand (B). In der Hütte steht ein Einzelbett statt einer Pritsche.

Boden nach der Durchsicht (Haupt-Chat, 9.11.2026): roter Sand (`sandRot`) statt des grünlich gefleckten
Sands, Bruchkante `felsRot` wie in Desert Springs. Front Street und Wege in rotem Felsboden
(`felsbodenRot`) statt Erde, weil die Erde einen grünen Grasrand zeichnet, der in der Wüste falsch
wirkt. Keine Büsche mehr, nur Kakteen, Steine und Tumbleweeds.

### 4.5 Runde 7 (10.11.2026): mehr Häuser, mehr Leben

Regel 10.51 und 10.53. Jede Variante hat jetzt 12 Gebäude mit den neuen eigenen Westernfassaden
(`gt8Bank`, `gt8Post` „Stage & Mail“, `gt8Barbier`, `gt8Bestatter`, `gt8Hotel`, `gt8Mietstall`
„Livery“) und Bretterhütten (`gt8HuetteA`, `gt8HuetteB`) in zweiter Reihe. A: Hütten und Post hinter
den Fassaden, Bank, Hotel und Mietstall auf der Südseite der Front Street. B: Bank, Post und Barbier
schließen die Häuserzeile der Nordseite, Bestatter, Hotel und Mietstall stehen auf der Südseite neben
dem Friedhof, drei Hütten dahinter. C: Post und Barbier in zweiter Reihe, Hotel und Mietstall
südlich. Belebung in allen Varianten gleich: Mr. Pruitts Metallsucher und 12 Sommergäste und
Durchreisende, 8 davon ansprechbar (`statist.ghostTown.aussen.*`), dazu Geier, Eule auf dem
Wasserturm (nachts), Eidechse und ein alter Hund, der {held} folgt (Dokument 16, 5.3).

### 4.6 Runde 6 (10.11.2026): Ansehen (niedrig-1)

| Auslöser     | Karte  | Feld A   | Feld B   | Feld C   | Inhalt                                                                                     |
| ------------ | ------ | -------- | -------- | -------- | ------------------------------------------------------------------------------------------ |
| `ortsschild` | aussen | (1, 20)  | (3, 19)  | (8, 20)  | „Gold Hill, pop. 312“, mit Kreide auf Null; Schild `gt7Schild` neu in A (1, 18), C (8, 18) |
| `steckbrief` | aussen | (35, 20) | (42, 20) | (34, 20) | Steckbrief am Sheriffbüro                                                                  |
| `amboss`     | aussen | (12, 20) | (40, 33) | (11, 20) | vor der Schmiede (A, C), in B vor dem Mietstall                                            |
| `klavier`    | saloon | (15, 4)  | (2, 4)   | (12, 4)  | drei stumme Tasten; Ambrose sagt einen Satz                                                |

Alle als `art: dialog` in `ghost-town-aussen.ink` und `ghost-town-saloon.ink`. `stollen` (S11) und die
Alte Minenstraße bleiben bei mittel-4.

Die Erinnerung `erinnerungSiedlung.huette` hat in allen drei Varianten die Tönung `sepia`; Ghost Town
selbst bleibt farbig (Bibel 28, nur die Szene).

## Runde 9 (10.11.2026): Antworten auf die Mängel der Variantenwahl (niedrig-1)

**Ghost Town außen (Wahl C):**

1. _Front Street hebt sich nicht vom Sand ab, ohne Rand:_ Die Straße ist jetzt heller Staubsand
   (`sand`) auf rotem Wüstensand, davor durchgehend der Bretterweg der Nordseite. Erde mit Rand
   (`erde`) ging nicht: Ihr Rand ist Gras.
2. _Häuser der hinteren Reihe ohne Weg:_ Hinter der vorderen Reihe läuft eine Gasse aus rotem
   Felsboden (Reihe 12) mit Stichen zu Post, Barbier und den zwei Hütten. Sie mündet in den Weg zur
   Mine und damit in die Front Street. Hinter Hotel, Mietstall und Bestatter liegt ebenso eine Gasse
   (Reihe 35), die über den Weg zum Sternenhimmel an die Straße anschließt. Die Häuser haben ihre Tür
   im Bild unten, deshalb liegen die Gassen hinter den Häusern.
3. _Friedhof größer als der Ort, Südwesten leer:_ Der Friedhof ist auf 13 × 9 Kacheln verkleinert
   (x 40–52). Das Tor liegt mit eigenem Weg im Norden, das offene Grab und das Grab ohne Namen sind
   drin. Auf der frei gewordenen Fläche steht der Bestatter (Undertaker) neben dem Friedhof. Im
   Südwesten stehen Heu, Tränke und ein Fass beim Mietstall, das Windrad aus der Beschreibung ist im
   Nordosten ergänzt.

**Zustand `mine-offen` (`goldmineOffen`, Sperre S11):** Am Stolleneingang sind die Bretter mit dem
roten Kreuz weg, das Gleis führt ins Dunkel. Das Bild steht als Bildwunsch in
`niedrig1_runde9_karten.py` (`stollen_eingang_offen.png`).

**Saloon (Wahl A):**

1. _Treppe frei im Raum, kommt nirgends an:_ Die Treppe steht in der Nordostecke und führt durch die
   Decke zu den Zimmern. An ihrem Fuß liegt im Dunkel das Postreiterabzeichen (Auslöser 18, 4).
2. _Nur zwei Barhocker:_ Es sind jetzt vier. Ein Tourist lehnt an der Theke. Sitzen können Figuren
   nicht, sie haben nur Bilder im Stehen.
3. _Fässer in drei Ecken ohne Grund:_ Es bleiben zwei Bierfässer am Ende der Theke. Die Dielen sind
   der Boden des Pakets und bleiben, wie sie sind.

Zustände: keine. Die Fernpartie ändert nichts Festes im Raum.

**Goldmine, Stollen (Wahl A):**

1. _Wand und Boden dieselbe Felstextur:_ Der Boden ist jetzt festgetretener Schotter, die Wände
   bleiben roher Fels.
2. _Steine mit Grasrand in Ketten an den Wänden:_ Die Steine sind weg. Es liegen einzelne
   Schotterhaufen da, dazu Grubenholz und Fässer.
3. _Grubenholz von der Seite, Lore ohne Gleis, keine Kiste für das Logbuch:_
   - Das Grubenholz liegt als Stapel.
   - Die Lore steht auf einem kurzen Abstellgleis mit Gleisende.
   - Neben dem Tisch steht eine Truhe.
   - Eine zweite Lore steht auf dem Hauptgleis.
   - Der Gang hinter dem Prellbock ist zu, der Prellbock steht am Stollenende.

Zustände: keine. Das Logbuch ist ein Fund, kein festes Objekt.

**Siedlungshütte 1866 (Wahl A):**

1. _Postreiter mitten im Raum, Zwergenfigur:_ Er wartet jetzt an der Tür (7, 8). Das Figurenbild
   `figuren/postreiter.png` stammt von der Figurentechnik. Ein Postreiter mit Hut und Staubmantel ist
   ein Wunsch an den Haupt-Chat.
2. _Heller Tisch, keine Kerze, Tageslicht im Fenster:_ Der Tisch ist dunkles Holz, das Fenster zeigt
   den Nachthimmel mit Sternen (Bildwunsch `tisch_rund_dunkel.png`, `fenster_nacht.png`). Die Kerze
   steht auf dem Tisch.
3. _Kisten, Lampe und Kleiderhaufen ineinander, Ofen vor der Wand:_ Drei Kisten sind gestapelt,
   darauf die Petroleumlampe. Der Kleiderhaufen ist weg, der Ofen steht an der Wand.

Zustände: keine (eine Erinnerung, ein Abend).
