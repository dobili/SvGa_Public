# Maple Falls

Stand: 9.11.2026, überarbeitet von mittel-1 nach dem Prüfbericht
`pruefberichte/2026-11-09_akt1_wegenetz.md` (Befunde 5, 9, 10, 23, 38) auf den Stand von
`12_Akt1_Leben.md` und Maßstab 7a.2. Ortsdokument nach dem Verfahren in `docs/spiel/orte/README.md`:
Ortsplan, Ortsbild, Abgleich mit der Geschichte, Bühnenbilder, dazu die Platzhalter für die
Rückkehr (13, 7.4). Quellen: `05_Story_Bibel.md` (Abschnitte 1, 2, 3.1, Szenen 1 bis 13),
`09_Weltbeschreibung.md` (5.1, Belebung), `12_Akt1_Leben.md`, `13_Wegenetz.md`, `ortsprofile.json`,
`KARTENREGELN.md`. Ausgearbeitet ist das Bühnenbild des Erdgeschosses (Muster); die übrigen folgen
nach der Durchsicht durch den Autor.

## 1. Ortsplan

Norden ist oben, auf allen Karten. Der Fluss kommt im Nordwesten über den Wasserfall, fließt hinter
den Gärten der Birch Lane nach Osten, liegt im Park am Nordrand, biegt im Ostteil des Parks nach
Süden ab, unterquert die Brücke der Parkstraße und begleitet danach die Landstraße auf ihrer
Südseite (Befund 5, abgestimmt mit mittel-2). Alles, was man betreten kann, liegt an der Birch Lane
oder im Park. Felder sind (Spalte, Reihe), Bereiche „Spalten / Reihen“.

```
                         N
 Wasserfall ≈≈≈≈≈≈≈≈≈≈≈≈ Fluss (Reihen 0–2, nicht begehbar) ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈┐
┌──────────────────────── mapleFalls.aussen (64 × 36) ────────────────────────┐┌──── mapleFalls.park (44 × 32) ─────┐
│ A       B       C       D       E       F       G       H                    ││ A    B Fußsteg C     D    E≈≈ F     │
│ [Whitlock][Lily]   [Martínez] [Diner]  ¦ [Schule + Fahnenmast]   Bäume      ││ Steg │  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈ ≈≈ Wiese  │
│  Gärten bis zum Ufer, Ahorne       Parkplatz ¦ Schulhof                     ││ Eiche  Halfpipe  Kiosk ≈≈        │
│ ─── Gehweg Nord (14) ─────────────────────────────────────────────────────  ││ Uferweg mit Kurve ──┐  ≈≈        │
│ ═══ Birch Lane (Reihen 15–17) ════════════════════════════════════════════ ═╪╪═ Parkstraße (15–17) ═[Brücke]═══ ═╪═► Landstraße
│ ─── Gehweg Süd (18) ──────────────────────────────────────────────────────  ││ Hauptweg  Haltestelle ≈≈         │
│ [Calloway] Halt. [Hayes]Einf.[Fisk]  [Süd 4]   [Spielplatz]                 ││  ╰─ Brett-Platz  Teich ≈≈≈≈≈≈≈≈≈≈≈╪═► Fluss
│  Gärten Süd                                                                 ││ Wiese, Bäume                       │
│  ╰──── Hinterweg mit zwei Kurven (Reihen 30–32) ──────────────╯              ││                                    │
└─────────────────────────────────────────────────────────────────────────────┘└────────────────────────────────────┘
```

### 1.1 Außenkarte `mapleFalls.aussen`, 64 × 36

**Gebaut: 64 × 41, siehe 4.5; der folgende Plan ist der Entwurf.** **Größe und Ausnahme:** 64 × 36 statt höchstens 60 (7a.2), begründete Ausnahme (Befund 10): Die
Nordseite trägt Haus Whitlock (10), Lily (9), Martínez (9, „zwei Häuser weiter“, Bibel), Diner (9)
und Schule (16), zusammen 53 Kacheln Fassade; mit je einer Kachel Abstand, dem Durchgang zum Ufer
neben der Schule und dem Rand sind es 64. Die Alternative (Schule an den Ostrand, Spielplatz
dahinter) hätte die Schule aus der Sichtachse der Straße genommen. Laufzeit: Birch Lane 64 Kacheln,
18 Sekunden.

**Reihen (Nord nach Süd):** 0–2 Fluss, im Westen (Spalten 0–7) mit dem Wasserfall über dunklem Fels
(Kachelanimation am oberen Rand); 3 Ufer mit Schilf und Gartenzäunen; 3–5 Gärten Nord; 5–10 Häuser
Nord (Schule ab 5, Wohnhäuser ab 6); 11–13 Vorgärten, Parkplatz und Schulhof; 14 Gehweg Nord; 15–17
Birch Lane; 18 Gehweg Süd; 19–21 Vorgärten Süd; 22–26 Häuser Süd; 27–29 Gärten Süd; 30–32
Hinterweg; 33–35 Hecke und Bäume am Südrand.

**Gebäude und Plätze:**

| Gebäude                            | Lage außen (Spalten / Reihen), Tür                                                      | Fassade                                                | Innen                                                                            | Begehbar     |
| ---------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- | ------------ |
| Haus Whitlock (Held und Mama)      | 2–11 / 6–10, Haustür (5, 10) in der Südfassade (Spalte 3 von 10)                        | Holzhaus mit Veranda, eineinhalb Geschosse, 10 breit   | `wohnzimmer` 20 × 13 (4.1), `dachboden` 14 × 11 (4.2)                            | ja           |
| Haus Lily                          | 13–21 / 6–10                                                                            | Holzhaus, 9, Katze auf der Veranda                     | –                                                                                | nein         |
| Haus Martínez (Juno, Carla)        | 23–31 / 6–10; Fahrrad am Zaun (32, 13)                                                  | Holzhaus, 9                                            | –                                                                                | nein         |
| Diner „Falls Diner“                | 33–41 / 7–10, Tür (37, 10) in der Südfassade (Spalte 4 von 9); Parkplatz 33–41 / 11–13  | Flachbau, 9, Leuchtreklame „Open“ auf dem Dach (38, 7) | `diner` 30 × 16, Tür Südwand (7, 15) (neu gedacht 4.4; Fassade 8, Abweichung)    | ja (neu, 12) |
| Durchgang zum Ufer                 | 42–43 / 3–13, Hecken beidseits, Bank am Ufer (42, 4)                                    | –                                                      | –                                                                                | Weg          |
| Maple Falls High                   | 44–59 / 5–10, Doppeltür (51–52, 10) in der Mitte der Südfassade; Schulhof 44–59 / 11–13 | Backstein, 16, Fahnenmast (47, 12)                     | `clubraum` 26 × 15, Tür (13, 14) (Vereinfachung: Schultür führt in den Clubraum) | ja           |
| Haus Calloway (gegenüber Whitlock) | 3–11 / 22–26, Tür (7, 22) zur Straße; Veranda 4–10 / 21 mit Schaukelstuhl               | Holzhaus, 9, Blumenkästen                              | –                                                                                | nein         |
| Haltestelle Schulbus               | Schild (14, 18), Wartehäuschen 13–15 / 19                                               | –                                                      | –                                                                                | –            |
| Haus Hayes (Leerstand)             | 17–25 / 22–26; Einfahrt 26–27 / 19–26 frei; Schild „Zu verkaufen“ (19, 20)              | Holzhaus, 9                                            | –                                                                                | nein         |
| Haus Fisk (Owens Familie)          | 29–37 / 22–26                                                                           | Holzhaus, 9                                            | –                                                                                | nein         |
| Haus Süd 4                         | 39–47 / 22–26                                                                           | Holzhaus, 8                                            | –                                                                                | nein         |
| Spielplatz (gegenüber der Schule)  | 49–59 / 19–26: Sandkasten 52–54 / 22–23, Schaukel 56–57 / 20–21, Bank (50, 25)          | –                                                      | –                                                                                | Platz        |

Regel für alle Häuser: Die Fassade ist halb so breit wie das Erdgeschoss innen (gerundet), die Tür
sitzt außen und innen an derselben relativen Stelle (gleiche Wand, gleicher Anteil von links, ±1
Kachel). Fenster gibt es innen nur an Nordwänden (die Ansicht zeigt nur dort Wandflächen); außen
zeigt die Südfassade Fenster, auch die der Räume, die innen im Osten liegen. Das ist im Genre üblich
und kein Widerspruch. Häuser der Südseite sind Kulisse; ihre Türen zeigen zur Straße (Nordfassade).

**Abschnitte** (je etwa ein Bildschirm, 8 Spalten; Reihe 1 = Nordseite bis Straßenmitte, Reihe 2 =
Südseite):

| Abschnitt | Bereich       | Thema                         | Zum Entdecken                                                                        |
| --------- | ------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| A1        | 0–7 / 0–16    | Wasserfall und Haus Whitlock  | Wasserfall, Briefkasten mit verblichenem „Whitlock“ (`briefkastenWhitlock`, (6, 13)) |
| B1        | 8–15 / 0–16   | Lilys Haus                    | Katze auf der Veranda, Eichhörnchen am Zaun                                          |
| C1–D1     | 16–31 / 0–16  | Haus Martínez                 | Carla am Fahrrad (N-MF3), Mann harkt Laub (Statist)                                  |
| E1        | 32–39 / 0–16  | Diner und Parkplatz           | Leuchtreklame mit flackerndem „p“ (`reklame`, (38, 11)), Tür zum Diner               |
| F1        | 40–47 / 0–16  | Durchgang zum Ufer, Schulhof  | Bank am Ufer mit Blick auf den Fluss, Fahnenmast mit Mr. Pratt (`fahnenmast`)        |
| G1–H1     | 48–63 / 0–16  | Schule                        | Doppeltür, Platz für die Plakatwand (5), Krähen auf dem Dach                         |
| A2–B2     | 0–15 / 17–35  | Mrs. Calloway und Haltestelle | Mrs. Calloway (`blumenkasten`, (5, 21)), `fahrplan` („Schulbus 7:42“, (14, 18))      |
| C2–D2     | 16–31 / 17–35 | Leerstand Hayes               | Schild „Zu verkaufen“, leere Einfahrt, Wäscheleine im Garten                         |
| E2–F2     | 32–47 / 17–35 | Häuser Fisk und Süd 4         | Briefträgerin Wanda Kessler auf ihrer Runde (N-MF2), Hinterweg                       |
| G2–H2     | 48–63 / 17–35 | Spielplatz                    | Owen; **„Bauer aus Plastik“** im Sandkasten (`fundBauer`, (53, 22))                  |

**Wegeführung:** Die Birch Lane (3 breit, Gehwege je 1) ist gerade, weil sie die Sichtachse trägt:
Von der Haustür Whitlock sieht man nach Osten schon nach einem Bildschirm die Schule und dahinter
die Bäume des Parks. Kurven hat der **Hinterweg** (2 breit): Er beginnt am Spielplatz (54, 27), läuft
in zwei Bögen hinter den Gärten der Südseite nach Westen (Reihen 30–32) und kommt neben der
Haltestelle (16, 21–29) wieder an die Straße, die Abkürzung der Kinder. Der Durchgang zum Ufer
(42–43) ist der zweite Abzweig, mit Bank als Ziel.

**Ränder:** Norden Fluss mit Wasserfall, Westen Wald hinter dem Wasserfall, Süden Hecke und Bäume.
Nur der Ostrand ist offen (Birch Lane → Park).

### 1.2 Park `mapleFalls.park`, 44 × 32

**Fluss (Befund 5):** Wasser 0–33 / 0–2 am Nordrand mit Ufer und Schilf in Reihe 3; ab Spalte 30
biegt er nach Süden (Wasser 31–34 / 3–19), unterquert die **Brücke der Parkstraße** (31–34 / 15–17,
Holzgeländer) und läuft dann nach Osten aus der Karte (Wasser 31–43 / 20–22). Auf der Landstraße
liegt er südlich der Straße.

| Ort im Park                  | Lage (Spalten / Reihen)                                          | Inhalt                                                                                                                                                          |
| ---------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Steg (S5)                    | Steg 5 / 1–2, Absperrband (5, 3), alter Pfosten (7, 3)           | Steg ins Wasser; bis `nadelMapleFalls ≥ 1` abgesperrt (`absperrungSteg`), danach neu (`stegNeu`); `fundInitialen` am Pfosten, `aussichtWasserfall` vom Stegende |
| Fußsteg zum Zedernpfad (S2)  | 10–11 / 0–2 über den Fluss, Schild (12, 3)                       | Übergang `zedernpfad` am Nordrand; Schild „Sturmschaden“ (`schildZedernpfad`) bis zur Öffnung; den Stamm zeigt erst die Pfadkarte                               |
| Uferweg                      | 2–29 / 4–5, Kurve 28–29 / 6–14 bis zur Parkstraße                | Hauptweg im Norden, 2 breit; Startlinie für Jos Rennen (14, 4)                                                                                                  |
| Große Eiche, Abernathys Bank | Eiche 2–5 / 8–11, Bank `parkbank` 3–4 / 12, zweite Bank 7–8 / 12 | Mr. Abernathy; zweite Bank mit dem vergessenen Reisebrett (Akt 1), später für seinen Schüler                                                                    |
| Halfpipe                     | 15–21 / 7–10, Jo (18, 11)                                        | Jo, Skater (Statist)                                                                                                                                            |
| Kiosk Mr. Patel              | 24–26 / 11–13 (Markise nach Süden), Patel (25, 14)               | `kiosk` (Laden `mapleFalls.kiosk`)                                                                                                                              |
| Parkstraße                   | 0–43 / 15–17, Gehwege 14 und 18                                  | Fortsetzung der Birch Lane, Brücke 31–34                                                                                                                        |
| Bushaltestelle               | Schild (26, 19), Wartehäuschen 25–28 / 19–20                     | `bushaltestelle`: Szene 13 wartet hier der Schulbus (Bibel), danach der Überlandbus mit Mr. Kettering (12)                                                      |
| Hauptweg Süd                 | von (12, 18) im Bogen nach Südwesten bis 9–13 / 22–25            | 2 breit, endet am freien Platz für das öffentliche Brett (5)                                                                                                    |
| Teich                        | 17–23 / 23–27                                                    | Enten, die folgen, wer stehen bleibt                                                                                                                            |
| Ostteil jenseits des Flusses | 35–43 / 3–14 und 35–43 / 18–19                                   | Wiese mit Bäumen, Landstraße beginnt am Ostrand                                                                                                                 |

**Abschnitte:** A (0–7) Steg und Eiche, B (8–15) Fußsteg und Brett-Platz, C (16–23) Halfpipe und
Teich, D (24–31) Kiosk und Haltestelle, E (32–39) Flussbiegung und Brücke, F (40–43) Ortsausgang.
Sichtachse: Von der Parkstraße am Westrand sieht man die Brücke nach etwa einem Bildschirm.
Laufzeit quer 44 Kacheln, 13 Sekunden.

### 1.3 Übergänge (Felder auf beiden Seiten)

| Von (Karte, Auslöser, Feld)                         | Nach (Karte, Auslöser, Feld; Ankunft)                                        | Lage                                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| aussen `haustuer` (3, 23), unter der Veranda        | wohnzimmer `haustuer` (5, 12); Ankunft (5, 11), Blick nach oben              | Südfassade 22 % ↔ Südwand 25 % (gebaut, 4.5).                                   |
| wohnzimmer `treppeOben` (1, 3)                      | dachboden `treppe` (Nordwestecke, Feld im Bühnenbild Dachboden)              | Beide Treppen liegen in der Nordwestecke übereinander.                          |
| aussen `dinerTuer` (33, 23)                         | diner `dinerAusgang` (7, 15); Ankunft (7, 13)                                | Südfassade 25 % ↔ Südwand 25 % (4.4).                                           |
| aussen `schule` (47, 23), vor der Treppe            | clubraum `schule` (9, 12); Ankunft `start` (9, 11)                           | Südfassade ↔ Südwand Mitte (gebaut, 4.5).                                       |
| aussen `park` Ostrand (63, 25–27); Ankunft (62, 26) | park `park` Westrand (0, 15–17); Ankunft (1, 16)                             | Straße läuft über den Rand, 3 breit.                                            |
| park `landstrasse` Ostrand (43, 15–17)              | wegMapleCedar.landstrasse `zurueckPark` Westrand (0, 15–17); Ankunft (1, 16) | Reihen mit mittel-2 abgestimmt (cedar-creek.md); Fluss dort südlich der Straße. |
| park `zedernpfad` Nordrand (10, 0) und (11, 0)      | zedernpfad `zedernZurueckPark` Südrand (10–11, 23)                           | über den Fußsteg; Zedernpfad Q1, Sperre S2.                                     |
| park `bushaltestelle` (26, 19), Dialog              | cedarCreek.aussen `bushaltestelle`                                           | Busfahrt (R41).                                                                 |

Die Prüfung im Kartenbauer (`pipeline/abenteuer/uebergaenge.py`) verlangt: Jeder Übergang hat sein
Gegenstück auf der Zielkarte; Türen liegen auf der Wand, durch die man den Raum verlässt
(Südwand innen ↔ Tür in einer Südfassade außen); Randübergänge liegen auf dem passenden Rand
(Ost ↔ West) und die Straße oder der Weg ist auf beiden Seiten gleich breit.

## 2. Ortsbild

Maple Falls hört man, bevor man es sieht. Hinter den Gärten der Birch Lane fällt der Fluss über
eine Kante aus dunklem Fels, und das Rauschen liegt über der ganzen Stadt wie ein Teppich, auf den
alle anderen Geräusche gestellt werden: das Klappern eines Briefkastendeckels, ein Rasenmäher drei
Gärten weiter, die Schulglocke, die um acht Uhr zwei Minuten zu früh läutet, weil niemand sie seit
Jahren gestellt hat.

Es ist Spätsommer. Die Ahornbäume, die in gleichen Abständen den Gehweg säumen, sind noch grün,
aber an den Rändern der Blätter brennt schon das erste Rot, als hätte jemand sie mit einem
Pinsel nachgezogen. Morgens liegt Tau auf den Rasenflächen der Vorgärten, mittags riecht es nach
warmem Holz und geschnittenem Gras, abends nach Holzkohle, wenn irgendwo gegrillt wird, und nach
Kaffee und Gegrilltem aus dem Diner.

Die Birch Lane ist eine Straße, auf der jeder jeden grüßt. Die Häuser sind aus Holz, weiß, hellblau
oder salbeigrün gestrichen, mit Veranden, auf denen Schaukelstühle und vergessene Kaffeebecher
stehen. Jeder Vorgarten hat seinen niedrigen Zaun oder seine Hecke, einen Plattenweg zur Tür und
einen Briefkasten an der Straße, an dem der Name schon etwas verblichen ist. Auf der Veranda von
Lilys Familie schläft eine graue Katze, die sich nur bewegt, um der Sonne zu folgen. Gegenüber
strickt Mrs. Calloway auf ihrer Veranda und sieht jedem nach, der vorbeigeht; zwei Häuser weiter
steht das Haus der Hayes leer, im Fenster lehnt ein Schild „Zu verkaufen“, und die Einfahrt wartet
auf einen Umzugswagen.

Das Haus der alten Mrs. Whitlock ist das älteste der Straße. Seine Farbe ist ein müdes Weiß, die
Verandastufen knarren, und auf dem Dach fehlt eine Schindel. Im Garten dahinter stehen zwei alte
Ahorne, deren Kronen bis an das kleine Dachbodenfenster reichen. Drinnen riecht es nach Umzug:
Pappe, Klebeband, kalte Pizza. Die Möbel der Familie sind einfach und gebraucht, aber heil; nur
oben unter dem Dach steht noch alles, was die Whitlocks in hundertfünfzig Jahren nicht
weggeworfen haben.

Weiter östlich, auf derselben Seite, steht das Diner, ein Flachbau mit Chromleisten; am Abend
leuchtet die Reklame, ein rotes „Open“, bei dem das „p“ flackert. Daneben die Maple Falls High, ein
Backsteinbau von 1962 mit einem Fahnenmast, an dem die Flagge träge im Wind hängt. Im Erdgeschoss,
hinter dem dritten Fenster, ist das Klassenzimmer, in dem nachmittags das Schachteam trainiert; in
einer Vitrine stehen die Pokale von 1994, als Maple Falls zuletzt etwas gewonnen hat. Gegenüber
der Schule quietscht eine Schaukel auf dem Spielplatz.

Folgt man der Straße nach Osten, wird sie zur Parkstraße. Der Stadtpark liegt am Fluss, der hier
breit und ruhig ist. Enten treiben am Ufer, ein Steg aus grauem Holz ragt ins Wasser, und daneben
führt ein schmaler Fußsteg hinüber zum Waldrand, wo der Zedernpfad über den Hügel beginnt. Auf der
Wiese steht eine Halfpipe mit abgeplatztem Lack, auf deren Kante Jo sitzt und Blitzpartien um Limo
spielt. Am Hauptweg parkt der Verkaufswagen von Mr. Patel mit gestreifter Markise; er verkauft
Zeitungen, Limo und seit dreißig Jahren Taschenschachspiele. Auf der Bank unter der großen Eiche
sitzt jeden Nachmittag Mr. Abernathy mit Reiseschach und Thermoskanne. Im Osten biegt der Fluss nach
Süden ab, die Parkstraße überquert ihn auf einer kleinen Holzbrücke, und dahinter beginnt die
Landstraße nach Cedar Creek, zwischen Feldern und Zäunen, mit dem Fluss an ihrer Seite.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

| Karte      | Szenen                                          | Figuren                                                                                  | Auslöser und Gegenstände                                                                                                                                                                            | Belebung                                                             |
| ---------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| wohnzimmer | 1, 4, 13; später Ironwood-Vorspiel, Akt 3 und 4 | Mama                                                                                     | `haustuer`, `treppeOben`, `fotoGrandma`, `kartonKueche`, `pizzakarton`; Kiste „Whitlock – nicht wegwerfen“ (Szene 1); Zettel vom Schachteam aus dem Briefkasten (Szene 4)                           | –                                                                    |
| dachboden  | 2, 3, nach 12; Akt 4 (Szene nach der Arena)     | Ambrose (im Brett)                                                                       | `treppe`, `brett`, `hutschachtel`, `spiegel`, `zeitungen1961`                                                                                                                                       | Staub im Licht                                                       |
| aussen     | 5, 8; Nebenaufgaben aus 12                      | Juno (Haltestelle), Lily; neu (12): Mrs. Calloway, Wanda Kessler, Mr. Pratt, Carla, Owen | `haustuer`, `dinerTuer`, `schule`, `park`; `briefkastenWhitlock`, `blumenkasten`, `fahnenmast`, `sandkasten`, `fundBauer`, `reklame`, `fahrplan`                                                    | Mann harkt Laub; Eichhörnchen am Zaun, Katze auf der Veranda, Krähen |
| diner      | Nebenaufgabe N-MF1 (12)                         | Hector Sandoval, Kellnerin (Statist)                                                     | `dinerAusgang`, `jukebox`, `fotoSchule1962`, `tischsetWand`                                                                                                                                         | Kellnerin wischt Tische                                              |
| clubraum   | 5, 6, 9, 11, 12                                 | Coach Delgado, Sam, Juno, Victor, Graham Hale                                            | `schule`, `pokalvitrine`, `brettOhneDame`, `plakatZaehlen`; vier Bretter                                                                                                                            | –                                                                    |
| park       | 7, 10, 10a, 13; S5 und S2 (12)                  | Mr. Abernathy, Jo, Mr. Patel                                                             | `park`, `landstrasse`, `zedernpfad`, `bushaltestelle`, `parkbank`, zweite Bank mit dem vergessenen Reisebrett, `kiosk`; `absperrungSteg`, `fundInitialen`, `aussichtWasserfall`, `schildZedernpfad` | Skater, Rentner auf der Bank; Enten, die folgen, wer stehen bleibt   |

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

| Element                                                | Entscheidung                                                                                                  | Grund                                                                                                                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wasserfall hinter den Gärten                           | bleibt, als Kachelanimation am oberen Rand der Außenkarte (Westen)                                            | Weltbeschreibung 5.1; gibt der Stadt ihren Namen.                                                                                                          |
| Küche „in der Ecke“ des Wohnzimmers (Weltbeschreibung) | geändert: eigene Küche hinter einem Durchgang im selben Erdgeschoss                                           | Regel 2.1 (keine Küchenmöbel im Wohnzimmer); Rückmeldung des Autors zu Runde 3. Die Szenen brauchen nur den Karton „Küche?“, der jetzt in der Küche steht. |
| Fernseher                                              | bleibt, auf einem Lowboard an der Nordwand, nicht neben der Haustür                                           | Regel 4.2.                                                                                                                                                 |
| Schlafzimmer                                           | nur als geschlossene Tür im Erdgeschoss (nicht betretbar)                                                     | Die Geschichte braucht sie nicht; ohne sie wäre unklar, wo die Familie schläft.                                                                            |
| Kaputte Möbel                                          | nur auf dem Dachboden                                                                                         | Ortsprofil: unten neu oder gebraucht.                                                                                                                      |
| Haus Hayes „Zu verkaufen“                              | Südseite, mit freier Einfahrt                                                                                 | Ohne neue Figur; die Einfahrt trägt den Umzugswagen bei der Rückkehr (13, 7.4). Die Nordseite braucht den Platz für das Diner.                             |
| Diner                                                  | **geändert:** Nordseite, betretbar, Fassade 9 (12, Befund 9)                                                  | N-MF1 spielt drinnen; Tür und Nischen an der Südwand, Fenster hinter dem Tresen an der Nordwand passen zur Ansicht.                                        |
| Haus Calloway                                          | neu, gegenüber dem Whitlock-Haus                                                                              | 12: Nachbarin über sechzig Jahre, erzählt vom Fernschach per Post und von den Initialen.                                                                   |
| Spielplatz                                             | gegenüber der Schule statt zwischen Martínez und Schule                                                       | Die Nordseite ist voll (Befund 10); vor der Schule sieht man ihn von der Straße.                                                                           |
| Briefkasten am Haus Whitlock                           | neu, Pflicht                                                                                                  | Szene 4: „Zettel im Briefkasten“; N-MF2 (Schachkurier).                                                                                                    |
| Steg im Park                                           | bleibt, im Nordwesten; abgesperrt bis `nadelMapleFalls ≥ 1` (S5)                                              | Ortsbild; Sperre mit Lohn (12, Abschnitt 5). Beginnt am Ufer und ragt ins Wasser (Regel 6.5).                                                              |
| Fluss im Park                                          | Nordrand, Biegung nach Süden, Brücke der Parkstraße                                                           | Befund 5: ein Fluss für Maple Falls, Park und Landstraße.                                                                                                  |
| Zedernpfad                                             | Fußsteg im Nordwesten des Parks, Schild bis zur Öffnung; der Stamm liegt auf der Pfadkarte                    | 13 (Q1, S2) und Befund 22.                                                                                                                                 |
| Schulglocke zwei Minuten zu früh                       | nur Text (Belebung, Dialog möglich)                                                                           | kein Bild nötig.                                                                                                                                           |
| Bushaltestellen                                        | zwei: Birch Lane (Schulbus morgens, Szene 5) und Park (Szene 13 wartet dort der Schulbus; danach Überlandbus) | Story-Bibel Szene 5 und 13 (Befund 23); der Überlandbus mit Mr. Kettering kommt aus 12.                                                                    |

### 3.3 Runde 8: Größe der Innenräume (KARTENREGELN 10.56, mittel-1)

Geprüft nach Gebäude außen und Zweck:

| Raum       | Gebäude außen (Kacheln)         | Größe vorher | Größe jetzt | Begründung                                                                                                                                                            |
| ---------- | ------------------------------- | ------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wohnzimmer | Villa 9 × 13, zwei Stockwerke   | 20 × 13      | 20 × 13     | Wohnzimmer mit Küche und Treppe; schon größer als das Haus von außen, für eine Familie passend.                                                                       |
| Dachboden  | dieselbe Villa, unter dem Dach  | 14 × 11      | 14 × 11     | Ein Dachboden ist enger als das Stockwerk darunter; Truhen und Kisten füllen ihn.                                                                                     |
| Clubraum   | Schule 24 × 23, größtes Gebäude | 18 × 13      | **26 × 15** | Am Clubkampf spielen sechs Bretter gleichzeitig, Eltern warten an der Tür. Jetzt sechs Tische in zwei Reihen, ein Gang vor der Tür, Regale und Kommode an den Wänden. |
| Diner      | Diner 8 × 9                     | 30 × 16      | 30 × 16     | Gastraum mit Theke, Nischen, Küche und Toiletten; schon so groß wie ein echtes Diner.                                                                                 |

Zustände (10.63) folgen, sobald mittel-2 die Technik meldet: Dachboden mit und ohne das alte Brett
(nachdem {held} es gefunden hat, liegt es nicht mehr dort).

### 3.4 Runde 8: Zustände der Innenräume (KARTENREGELN 10.63, mittel-1)

| Karte                   | Zustand      | Bedingung              | Zustand: wann, was, warum                                                                                                                                              |
| ----------------------- | ------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mapleFalls.dachboden`  | `ohne-brett` | `ersterAbendGesehen`   | Ab Szene 4 steht der runde Tisch leer: Der Held trägt das Brett von da an bei sich. Der Auslöser `brett` bleibt, Ambrose spricht aus dem Gepäck.                       |
| `mapleFalls.wohnzimmer` | `ausgepackt` | `aufbruchGesehen`      | Ab Szene 13 sind die Umzugskartons ausgepackt; Sofa, Couchtisch und ein niedriges Regal stehen an ihrer Stelle. Die Kiste in der Küche bleibt, `pizzakarton` entfällt. |
| `mapleFalls.clubraum`   | `pokal`      | `nadelMapleFalls >= 1` | Nach dem gewonnenen Clubkampf steht der neue Pokal auf dem Lehrertisch von Coach Delgado.                                                                              |
| `mapleFalls.diner`      | –            | –                      | Kein fester Wechsel in der Geschichte.                                                                                                                                 |

## 4. Bühnenbilder

### 4.0a Varianten B und C (KARTENREGELN 10.37)

Für Wohnzimmer, Dachboden und Birch Lane liegen in `inhalte/abenteuer/szenen/varianten/` je zwei
weitere Varianten; gleich bleiben Größe, Wände, Türen, Fenster, Übergänge, Auslöser und Figuren.

- **Wohnzimmer B (Landhaus):** Holzwände, dunkle Dielen, graue Küchenfliesen; Sitzecke mit grauem
  Sofa, rundem Tisch und Stehlampe an der Westwand; Küche mit Herd und Topf, Esstisch an der Südseite.
  **C (modern):** hellgraue Wände, Dielen in der Küche; zwei weiße Sessel an einem runden Tisch auf
  rosa Teppich, hohes Bücherregal; Kühlschrank in der Nordwestecke der Küche, Holztisch mit Hockern
  in der Mitte.
- **Dachboden B (Nähecke):** Kommode mit Stoffrollen und Nähmaschine an der Westwand, Tisch mit Brett
  rechts unter dem Fenster, abgedeckte Truhe mit Teddy. **C (abgedeckte Möbel):** zwei alte Schränke,
  Waldbild, Teppich mit Tisch gleich neben der Luke, zwei abgedeckte Truhen und Kisten an Ost- und
  Südwand.
- **Birch Lane B:** Säulen- und niedrige Hecken statt Zäunen, Martínez in grüner Villa, auf der
  Südseite ein blaues Stadthaus (Hayes), ein Bauernhaus (Fisk), ein Flachdachhaus mit Gartenhaus;
  Bach in flachem Bogen, wenige Bäume, Laternen mit langem Ausleger, kleiner Spielplatz. **C:**
  Eisenzaun auf Ziegelsockel, Martínez im kleinen Bauernhaus, auf der Südseite Flachdachhaus (Hayes)
  und zwei Wohnwagen; Bach in vielen Bögen, Gemüsebeete, Laternen mit Bogenarm, Spielturm und Wippe.

### 4.0 Nacharbeit nach der Rückmeldung des Autors zu Runde 4 (KARTENREGELN 10)

Diese Änderungen gehen den Tabellen in 4.1 bis 4.5 vor.

- **Wohnzimmer (4.1):** Haustür als Bild in der Südwand (5, 11) statt Lücke, Fußmatte innen direkt
  davor (5, 10), Start (5, 10). Der Fernseher steht mit seinem Fuß auf dem Sideboard (7, 2)
  (`mf4FernseherStand`, `sichtbar_breite` 29 auf der Platte mit `sichtbar_breite` 30); die
  niedrige Kommode steht unter dem Fenster (4, 2) und trägt ab Akt 2 Mamas Foto. Die Treppe läuft an
  der Westwand in die Nordwand hinauf (1, 0), Auslöser `treppeOben` (2, 3), Antritt (2, 4).
  Arbeitsplatten nach vorn gesetzt (versatz 6 px), damit sie unter dem Fenster bündig mit Herd und
  Kühlschrank stehen; kein Bild mehr über dem Herd. Kisten bleiben (Umzug), geordnet an den Wänden.
- **Dachboden (4.2):** Statt der Verandatreppe liegt in der Nordwestecke an der Wand die Bodenluke
  mit Leiter (`mf4Luke`, eigene Grafik des Haupt-Chats) bei (1, 2); Auslöser `treppe` auf der Öffnung
  (1, 4), Start (2, 5) wie STARTPOSITION der App. Das Waldbild hängt wieder an der Nordwand (4, 1).
- **Clubraum (4.3):** Tür als Bild in der Südwand (9, 11), Fußmatte innen davor (9, 10), Start (9, 10). Pokal steht auf der Platte der Anrichte, die Pinnwand hängt 6 px unter der
  Wandkrone, der Globus steht auf dem Lehrerpult neben dem Buch.
- **Birch Lane (4.5):** Der Bach kommt vom Westrand, windet sich in Stufen hinter den Gärten und fließt vor der Schule nach Norden aus der Karte (35–36 / 0–1), damit das Schuldach ihn nicht überdeckt; der Wasserfall
  kommt zwischen Felsen über eine Geländestufe. Die Schulbushaltestelle steht vor der Schule rechts
  der Treppe (57, 21), offen zur Straße, mit Bank (55, 22) und Mülltonne; der Fahnenmast links der
  Treppe (41, 15). Laternen stehen direkt am südlichen Gehweg (Fuß Reihe 29), eine Bauart; Straßenbäume
  wechseln zwischen grünem und rotem Laubbaum. Der Spielplatz ist eingezäunt (49–62 / 31–40) mit Tor
  oben, Trampelpfad vom Gehweg, Sand, zwei Elternbänken mit Blick auf die Geräte und Abfalleimer.
  Schilder mit Zweck: „Sackgasse“ am Wendehammer (7, 29), „Zu verkaufen“ an der Einfahrt Hayes
  (25, 31); andere kleine Schilder gibt es nicht.

### 4.1 Erdgeschoss Haus Whitlock (`mapleFalls.wohnzimmer`), Muster

**Größe:** 20 × 13 Kacheln (7a.2: zwei Räume nebeneinander). Nordwand: Reihe 0 Wandkrone, Reihen 1
und 2 Wandfläche (creme, mit Sockelleiste). Boden ab Reihe 3. Südwand Reihe 12, Westwand Spalte 0,
Ostwand Spalte 19. Innenwand zwischen Wohnzimmer (Spalten 1–10) und Küche (Spalten 12–18) in Spalte
11, mit Durchgang (Türrahmen ohne Tür) in den Reihen 7 und 8. Boden: helle Holzdielen im Wohnzimmer,
Fliesen (hell) in der Küche.

**Licht und Stimmung:** Spätnachmittag, Licht fällt schräg durch die Nordfenster (im Spiel ohne
eigenes Licht). Alles ist sauber, aber unfertig: Kartons stehen noch überall, und nichts hängt
außer dem Foto.

**Laufwege (frei halten):** Haustür (5, 12) → hinauf bis Reihe 10 → nach Westen bis Spalte 2 →
hinauf bis zum Antritt der Treppe (2, 6). Haustür → nach Osten bis Spalte 10 → hinauf bis Reihe 8 →
durch den Durchgang (11, 7–8) zum Esstisch. Jeder Auslöser ist von einem freien Nachbarfeld
erreichbar.

**Zonen und Inventar** (gebaut in Runde 4, Szene `maple-falls-wohnzimmer.json`; Feld = linke obere
Kachel, hohe Möbel überdecken die Wandfläche; Möbel mit Vorsilbe `mf4` in `moebel.json`):

| Zone     | Gegenstand                                              | Feld, Größe                                                                                            | Ausrichtung                     | Material, Stil, Zustand             | Zweck                                                                      |
| -------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| Treppe   | Holztreppe mit Geländer (`mf4Treppe`)                   | (1, 2), 3 × 4                                                                                          | führt nach oben (Nord)          | Holz, klassisch, gebraucht          | Weg zum Dachboden; Auslöser `treppeOben` (2, 3), Antritt (2, 6) frei       |
| Treppe   | Kiste „Whitlock – nicht wegwerfen“                      | (4, 5), 1 × 2                                                                                          | –                               | Pappe                               | Szene 1: die Kiste, die der Held hinaufträgt                               |
| Nordwand | Anrichte (`mf4Anrichte`)                                | (4, 2), 2 × 2, Platte frei                                                                             | Vorderseite unten               | Holz rotbraun, klassisch, gebraucht | Platz für Mamas altes Turnierfoto ab Akt 2 (5)                             |
| Nordwand | Fenster                                                 | Wandfläche (4, 1), 2 breit                                                                             | –                               | Holzrahmen                          | Licht, Blick in den Garten                                                 |
| Nordwand | Foto von Grandma Whitlock, gerahmt                      | Wandfläche (6, 1)                                                                                      | –                               | dunkler Rahmen, alt                 | Auslöser `fotoGrandma` auf (6, 3), man steht davor                         |
| Sitzecke | Lowboard (`mf4Lowboard`), Fernseher an der Wand darüber | Lowboard (7, 2), 2 × 2; Fernseher `an_wand` (7, 1)                                                     | Vorderseite unten (zum Raum)    | Holz hell, gebraucht                | Regel 4.2 (der Fernseher ist so breit wie die Platte, deshalb an der Wand) |
| Nordwand | Tür zum Schlafzimmer (geschlossen)                      | Wandfläche (10, 1)                                                                                     | –                               | Holz                                | nur Kulisse (statt in der Westwand: Seitenwände tragen keine Türen)        |
| Sitzecke | Teppich                                                 | (6, 4), 4 × 3                                                                                          | flach                           | Stoff, gemustert                    | fasst die Sitzecke                                                         |
| Sitzecke | zwei gelbe Sessel, von hinten (`mf4SesselHinten`)       | (6, 6) und (8, 6), je 2 × 2                                                                            | blicken nach oben zum Fernseher | Stoff gelb, klassisch, gebraucht    | statt Sofa: Der Katalog hat kein ganzes Sofa von hinten; Abstand 2         |
| Sitzecke | Stehlampe                                               | (10, 5), 1 × 3                                                                                         | –                               | Metall, Schirm blau                 | neben dem rechten Sessel (Regel 4.4)                                       |
| Umzug    | Umzugskartons in zwei Gruppen an den Wänden             | Westwand (1, 7) und (1, 9); an der Innenwand hinter den Sesseln (8, 9), (9, 9), (10, 9); Küche (12, 3) | –                               | Pappe, neu                          | Rückmeldung Haupt-Chat: keine einzelnen Kisten mitten im Raum              |
| Umzug    | Pizzakarton (vorderster Karton der Gruppe)              | (8, 9), 1 × 2                                                                                          | –                               | Pappe                               | Auslöser `pizzakarton` (8, 10)                                             |
| Ecken    | Zimmerpflanze, Palme                                    | Pflanze (1, 10); Palme in der Südostecke der Küche (17, 10)                                            | –                               | Pflanze                             | Ecken (Regel 4.4)                                                          |
| Eingang  | Haustür                                                 | Südwand (5, 12)                                                                                        | –                               | Lücke in der Südwand                | Auslöser `haustuer`, Start (5, 11) mit Blick nach oben                     |
| Eingang  | Fußmatte                                                | (5, 11), flach                                                                                         | –                               | Stoff                               | vor der Haustür                                                            |
| Nordwand | schmales Bücherregal                                    | (9, 1), 1 × 3                                                                                          | Vorderseite unten               | Holz, bunte Bücher                  | Leben (Rückmeldung Haupt-Chat)                                             |
| Küche    | Küchenzeile: zwei Arbeitsplatten, Herd, Kühlschrank     | Platten (13, 2) und (15, 2), Herd (17, 2), Kühlschrank (18, 1), lückenlos                              | Vorderseite unten               | Holz und Grau-Blau, gebraucht       | Kochen                                                                     |
| Küche    | Fenster über der Arbeitsplatte, Bild                    | Wandfläche (14, 1); Bild (17, 1)                                                                       | –                               | Holzrahmen                          | Licht, Leben                                                               |
| Küche    | runder Esstisch mit zwei Stühlen                        | Tisch (14, 6), 2 × 2; Stühle (13, 6) Sitz nach rechts, (16, 6) Sitz nach links                         | Stühle zum Tisch                | Holz hell, eine Serie               | Szene 4 und später (der Katalog hat Küchenstühle nur von der Seite)        |
| Küche    | Mama                                                    | (17, 7) neben dem Tisch                                                                                | schaut nach links               | –                                   | Figur `mutter`                                                             |
| Küche    | Karton „Küche?“                                         | (12, 9), 1 × 2                                                                                         | –                               | Pappe                               | Auslöser `kartonKueche` (12, 10)                                           |

Abweichungen vom Entwurf: kein Couchtisch und kein Sofa (nicht im Katalog als ganzes Bild von
hinten), runder statt rechteckiger Esstisch mit zwei statt vier Stühlen, kein Schuhregal, keine
Wanduhr und kein Mülleimer (für innen nicht im Katalog). Belegung etwa 25 %.

**Bezug zu anderen Karten:** Die Haustür liegt bei 25 % der Breite in der Südwand, außen bei 30 %
(Spalte 3 von 10; Regel ±1 Kachel). Die Fassade ist 10 breit, halb so breit wie innen. Die Treppe
in der Nordwestecke liegt unter der Bodenöffnung des Dachbodens (ebenfalls Nordwestecke). Die Küche
liegt im Osten; außen zeigt der östliche Teil der Südfassade ihr Fenster (Genre-Regel in 1.1, statt
eines Fensters in der Ostseite; Befund 38).

### 4.2 Dachboden Haus Whitlock (`mapleFalls.dachboden`)

**Größe:** 14 × 11 (7a.2, Wohnraum). Nordwand Reihen 0–2 (Holzwand), Boden alte Dielen ab Reihe 3,
Südwand Reihe 10. Ein Raum unter dem Dach, kein Ausgang außer der Treppe.

**Licht und Stimmung:** erster Abend nach dem Umzug, Spätsommerlicht durch das Sprossenfenster.
Alles ist alt, aber ordentlich abgestellt; das Gerümpel steht in Gruppen an den Wänden, die Mitte
bleibt frei (Ortsprofil, Rückmeldung Haupt-Chat).

| Zone     | Gegenstand                                                                                                   | Feld, Größe                                                          | Zweck                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Treppe   | Treppe nach unten zwischen zwei Pfosten, Geländer an der Wand (`mf4TreppeAb`, eigene Grafik des Haupt-Chats) | (1, 0), 6 × 5                                                        | Nordwestecke über der Treppe im Erdgeschoss; Auslöser `treppe` (3, 4), Start (3, 5) |
| Nordwand | Sprossenfenster, Bauernschrank, Bücherregal                                                                  | (7, 1); (9, 1); (11, 1)                                              | Licht; vergilbte Bücher                                                             |
| Mitte    | Teppich, runder Tisch mit Brett, zwei Stühle, Stehlampe                                                      | Teppich (6, 4); Tisch (6, 5); Stühle (5, 5) und (8, 5); Lampe (9, 4) | Szene 2 und 3: `brett` (6, 6)                                                       |
| Ostwand  | zwei Kistenstapel                                                                                            | (11, 4) und (11, 7)                                                  | Gerümpel                                                                            |
| Südwand  | Kiste mit Tuch, Zeitungen 1961, Hutschachtel, Standspiegel                                                   | (1, 9); (3, 7); (8, 8); (10, 7)                                      | `zeitungen1961` (3, 9), `hutschachtel` (8, 9), `spiegel` (10, 8)                    |

Das Waldbild entfällt (die breite Treppe braucht die Wandfläche).

### 4.3 Clubraum der Maple Falls High (`mapleFalls.clubraum`), Runde 8 nach dem zweiten Gutachten

**Größe:** 26 × 15 (KARTENREGELN 10.56, Tabelle in 3.3). Nordwand Reihen 0–2, Tür mittig in der
Südwand (13, 14), Start (13, 13). Heller Holzboden, roter Teppich mit goldenem Rand (eigene Teile
`teppich_*`) x 4–21, y 6–12, rundum eine Kachel Abstand zu den Tischen.

| Zone     | Gegenstand                                                                              | Feld                                                  | Zweck                                             |
| -------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------- |
| Nordwand | Fenster, Weltkarte, Fenster, Wanduhr, Kreidetafel, Pinnwand, Plakat, Garderobe, Fenster | 2, 5, 8, 10, 12, 15, 17, 19, 23 (Reihe 1)             | Bilder enden auf gleicher Höhe über der Fußleiste |
| Nord     | Pokaltisch mit dem Pokal von 1994 vorn, Glasschrank, Kartons mit Schachsets             | (4, 3), (6, 3), (9, 3)                                | `pokalvitrine` (4, 5)                             |
| Nord     | Lehrertisch mit Globus unter der Tafel, Coach dahinter                                  | Tisch (12, 4), Coach (13, 3)                          | Demonstration an der Tafel                        |
| Nordost  | Doppelspind                                                                             | (21, 3)                                               | Taschen; Jacken an der Garderobe darüber links    |
| Seiten   | je ein schmales Bücherregal und eine Elternbank, Rücken zur Wand                        | West (1, 5), (1, 8); Ost (24, 5), (24, 8)             | Mutter sitzt auf der Westbank (1, 9)              |
| Ecken    | hohe Pflanzen oben, Palmen unten                                                        | (1, 3), (24, 3), (1, 12), (23, 12)                    |                                                   |
| Mitte    | sechs runde Holztische, je Brett und Schachuhr, zwei Stühle                             | (6, 7), (12, 7), (18, 7), (6, 10), (12, 10), (18, 10) | `brettOhneDame` (18, 7), Brett ohne weiße Dame    |

Figuren: Coach Delgado hinter dem Lehrertisch, Sam im Gang (9, 9). Belebung sitzt: Schülerin am
Tisch (11, 7), Clubmitglied (14, 10), Mutter auf der Bank (1, 9).

#### Antworten auf das zweite Gutachten (10.11.2026)

Behoben: 1–3 (Pokaltisch mit Pokalen und dem Pokal von 1994 vorn statt der offenen Vitrine),
4 (Doppelspind statt der Spinde, die wie Kühlschränke aussahen), 5 (Pinnwand hängt über freiem
Boden), 6 (alle Wandbilder enden auf einer Höhe), 7 (Plakat „Erst zählen“), 8–9 (niedriges Regal
weg, Pflanzen in allen vier Ecken), 10 (Lehrertisch unter der Tafel), 11 (drei Fenster),
12–13 und 16 (Lehrertisch von vorn, Coach dahinter, Globus auf der Platte), 14–15 (je ein
schmales Regal an West- und Ostwand, Pflanzen getrennt), 17 (roter Teppich mit Rand), 19–20 (Brett
ohne Dame, aufgebaute Bretter, Schachuhren), 21 (Tische mittig, eine Kachel Rand), 22–26
(Statisten sitzen an Brettern und auf der Bank), 27 (Demotafel weg), 28 (Bänke mit dem Rücken an
der Seitenwand, Blick zu den Tischen), 29 (Fußmatte weg), 31 (Ecken), 32 (Wanduhr, Garderobe,
Pinnwand als Tabelle des Clubkampfs, Kartons).

Begründet statt geändert:

- **18 Tische nicht dunkel:** Der Katalog hat keinen dunklen runden Tisch; die Beschreibung sagt
  jetzt „runde Holztische“.
- **30 Tür:** Die Tür ist dieselbe Südtür wie in den übrigen Innenräumen von Maple Falls; ein
  eigenes Bild mit Rahmen wäre ein Wunsch für alle Räume, nicht nur für diesen.
- **32 Lampen und Papierkorb:** nicht eingebaut; drei Fenster geben Licht, der Raum ist nach der
  Prüfung des Kartenbauers ausreichend belegt.

### 4.4 Diner (`mapleFalls.diner`), neu gedacht (mittel-3, 9.11.2026)

**Stand nach Runde 5 (gewählt: Variante C, überarbeitet nach den Hinweisen des Autors, 10.11.2026):**
Größe 30 × 16 und Tür (7, 15) bleiben. Die Großküche liegt jetzt im Norden (Spalten 13–23, Reihen 3–6)
hinter einer drei Reihen hohen Wand (Reihen 7–9, Regel 39); in ihrer Wandfläche die Durchreiche als
Fenster (18, 8), Pinnwand (13, 8), Foto 1962 (16, 8) und die Küchentür (27, 8). Davor der Gang des
Personals (Reihe 10), die rote Bar (Spalten 14–25) mit sechs Hockern direkt davor und der Kaffeemaschine
auf der Platte; die Kassentheke am Westende (12–13), Kasse zum Gast. Hinter der Küche das Lager (25–28)
mit Vorratsregalen und Kartons. Zwei Toiletten (Spalten 1–2 und 4–5) hinter einer drei Reihen hohen
Wand mit Türen (2, 8) und (4, 8). Im früher leeren Teil oben links Spielautomaten-Ecke mit Bildern,
eine Nische und eine Wartebank; unten links zwei Nischen mit runden Tischen zwischen den Lehnstühlen.
Niedrige Glastür in der Südwand (eigenes Bild), Fußmatte davor. Die Tabelle unten beschreibt den
früheren Stand A; die Szene in `szenen/maple-falls-diner.json` gilt.

Rückmeldung des Autors zu Runde 4: „kein Diner, zu kläglich, nicht mal eine Mensa“ (KARTENREGELN 10.30).
Neu geplant und gebaut nach dieser Liste.

**Was ein amerikanisches Kleinstadt-Diner braucht (10.30), in welcher Zahl:**

| Bereich     | Was                                                                                 | Zahl                            |
| ----------- | ----------------------------------------------------------------------------------- | ------------------------------- |
| Eingang     | Tür in der Südwand mit Fußmatte innen davor                                         | 1                               |
| Gastraum    | lange Theke mit Hockern davor                                                       | 13 Kacheln Theke, 6 Hocker      |
| Gastraum    | Kasse hinter der Theke, zum Gast hin, nahe der Tür                                  | 1 (Kassentheke)                 |
| Gastraum    | Sitznischen mit Tisch und zwei Sitzen                                               | 4 (16 Plätze mit der Theke: 22) |
| Gastraum    | Rückbuffet hinter der Theke: Kaffeemaschine, Milchshake-Mixer, Kuchenvitrine, Radio | 1 Zeile ohne Lücke              |
| Gastraum    | Pinnwand mit Tischsets, Foto 1962, Fenster                                          | je 1, Fenster 2                 |
| Durchreiche | Öffnung in der Wand zur Küche mit Geschirrablage                                    | 1                               |
| Großküche   | abgetrennt, mit Personaltür; mehrere Herde, Grillplatte, Fritteuse, Abzugshauben    | Herde 2, Hauben 2, je 1         |
| Großküche   | Kühlung, Arbeitstische aus Stahl, Spültisch                                         | Kühlschränke 2, Tische 2        |
| Lager       | hinter der Küche, Kartons (Grund: Vorrat), Kühltruhe                                | 1 Raum                          |
| Toiletten   | über einen Flur vom Gastraum, getrennt                                              | 2 (je WC und Handwaschbecken)   |

**Größe:** 30 × 16. **Begründete Ausnahme** von 7a.2 (öffentlicher Raum 14–20 × 10–14): Der Autor verlangt
ein vollständiges Diner mit Großküche, Lager und Toiletten; das passt nicht auf einen Bildschirm. Der
Gastraum allein (19 × 12) liegt im Rahmen eines großen Saals, die Nebenräume liegen dahinter. Laufweg
von der Tür bis zur Theke 5 Kacheln.

**Raster:** Nordwand Reihen 0–2 (rot), Boden weiße Fliesen, Südwand Reihe 15 mit der Tür bei Spalte 7
(25 %, wie die Tür der Fassade außen bei Spalte 2 von 8). Innenwände: Trennwand Spalte 20 (Reihen 3–14) mit Durchreiche (20, 4), Küchentür (20, 7) und
Gang zum Flur (20, 10); Wand Reihe 9 (Spalten 21–28) mit Lagertür (27, 9); Flur Reihe 10; Wand Reihe 11
(Spalten 21–25) mit den Toilettentüren (22, 11) und (24, 11); Wand Spalte 23 zwischen den Toiletten
(Reihen 12–14) und Spalte 26 vor dem Lager (Reihen 10–14).

**Laufwege:** Tür (7, 15) → Start (7, 13) → nach oben zur Kassentheke und zu den Hockern; nach links
zur ersten Nische, nach rechts zu den drei Nischen östlich der Tür und durch den Gang (20, 10) zu den
Toiletten. Hinter die Theke kommt man durch die Klappe (5, 6–8) oder von der Küche; das Personal geht
durch die Küchentür.

| Zone        | Gegenstand                                                                                              | Feld                                                                                                             | Möbel                                                                                 | Zweck                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Nordwand    | Pinnwand mit Tischsets, Foto 1962 (4 bis 5 Pixel unter der Krone), zwei Fenster                         | Pinnwand (10, 1), Foto (13, 1), Fenster (15, 1), (17, 1)                                                         | `mf4Pinnwand`, `wzBild`, `wzFenster`                                                  | `tischsetWand`, `fotoSchule1962` (Runde 5)                                         |
| Rückbuffet  | drei Holzschränke, Kuchenvitrine mit Donuts, darauf Kaffeemaschine und Mixer                            | Schränke (2, 2), (4, 2), (6, 2); Vitrine (8, 2)                                                                  | `mf5Buffet`, `mf5Kuchenvitrine`, `mf5Kaffeemaschine`, `mf5Mixer`                      | Radio (`radio`, Runde 5) auf dem Schrank (6, 2), ohne Bild im Katalog: man hört es |
| Theke       | kurzes Thekenstück (2–4), Klappe (5), Kassentheke (6–7), lange rote Theke (8–18)                        | Reihen 6–8                                                                                                       | `mf5ThekeLinks`, `mf5ThekeMitte`, `mf5ThekeRechts`, `mf5Kassentheke`                  | Kasse zum Gast hin, direkt über der Tür; Hector dahinter (5, 4)                    |
| Theke       | sechs rote Barhocker                                                                                    | (3, 8), (9, 8), (11, 8), (13, 8), (15, 8), (17, 8)                                                               | `mf5Hocker`                                                                           | N-MF1 am Tresen                                                                    |
| Südwand     | vier Sitznischen: kleiner Tisch, zwei Stühle mit hoher Lehne; die drei östlichen Rücken an Rücken       | Tische (2, 13), (11, 13), (14, 13), (17, 13); Stühle links und rechts                                            | `mf5Nischentisch`, `mf5NischenstuhlRechts`, `mf5NischenstuhlLinks`                    | Gäste; Tischset-Rätsel                                                             |
| Eingang     | Tür, Fußmatte                                                                                           | (7, 14)                                                                                                          | `mf5Eingangstuer`, `mf4Fussmatte`                                                     | `dinerAusgang` (7, 15), Start (7, 13)                                              |
| Ecken       | Pflanzen                                                                                                | (1, 10), (19, 12)                                                                                                | `wzPflanze`                                                                           | Regel 4.4                                                                          |
| Durchreiche | Geschirrständer in der Wandöffnung                                                                      | (20, 4)                                                                                                          | `mf5Geschirr`                                                                         | Teller gehen von der Küche nach vorn                                               |
| Großküche   | zwei Gastroherde mit Abzugshauben, Grillplatte, Fritteuse, zwei Kühlschränke, lückenlos an der Nordwand | Herde (21, 2), (22, 2); Hauben (21, 1), (22, 1); Grill (23, 2); Fritteuse (25, 2); Kühlschränke (27, 1), (28, 1) | `mf5Gastroherd`, `mf5Dunstabzug`, `mf5Grillplatte`, `mf5Fritteuse`, `mf5Kuehlschrank` | Kochen                                                                             |
| Großküche   | Spültisch und Arbeitstisch aus Stahl, Brotbrett                                                         | (22, 6), (25, 6)                                                                                                 | `mf5Stahltisch`, `mf5Spuele`, `mf5Brotbrett`                                          | Arbeit in der Mitte                                                                |
| Lager       | Kühltruhe, Kartonstapel                                                                                 | (28, 8), (27, 10), (27, 12)                                                                                      | `mf5Kuehlschrank`, `mf4KartonStapel`, `wzKartonstapelHoch`                            | Vorrat (Grund für Kisten, 10.18)                                                   |
| Toiletten   | je WC (Spülkasten an der Wand) und Handwaschbecken                                                      | WC (21, 11), (25, 11); Becken (22, 13), (24, 13)                                                                 | `mf5Toilette`, `mf5Handwaschbecken`                                                   | –                                                                                  |

Belebung: Kellnerin (Statist) bringt Teller zwischen (4, 11) und (18, 11). Figur Hector Sandoval (5, 4)
und die Auslöser `tischsetWand`, `fotoSchule1962`, `radio` setzt die Szene mit ihren Dialogen in
Runde 5 (heute nicht in `orte.json`; die Felder stehen in der Tabelle).

**Außen (abgestimmt mit mittel-1, 9.11.2026):** Auf der Nordseite der Birch Lane sind zwischen dem
Zaun Martínez (Spalte 30) und der Schule (ab 39) nur 8 Kacheln frei, und der Katalog hat keine
Ladenfassade breiter als 8. Die Fassade bleibt deshalb Hardware_Store, 8 × 9, mit Markise und
DINER-Schild; die Glastür liegt bei Spalte 2 von 8 (25 %), `dinerTuer` (33, 23) darunter. Innen sitzt
die Tür deshalb bei Spalte 7 von 30 (25 %). **Begründete Abweichung** von der Regel „Fassade halb so breit
wie innen“: Das Diner ist ein Flachbau, der sich hinter den Nachbargrundstücken nach hinten und zur Seite
ausdehnt (Küche, Lager, Toiletten); von der Straße sieht man nur den Gastraum. Eine breitere Fassade
ginge nur mit einer längeren Birch Lane oder einem eigenen Fassadenbild (Entscheidung Haupt-Chat).

**Varianten (KARTENREGELN 10.37, mittel-3):** A ist die Szene oben. B
(`szenen/varianten/maple-falls-diner-b.json`): schlichter und kühler, blaue Wände, graue Fliesen,
Glastheke aus Holz und Glas mit fünf blauen Hockern, drei runde Tische statt Nischen, Küche umgestellt
(Kühlschränke links, Grillplatte frei in der Mitte). C (`…-c.json`): reicher, Fünfziger-Diner mit voller
Bar, sieben Nischen (sechs auf rotem Teppich), zwei Spielautomaten, Bilder, drei Herde unter drei
Hauben. Gleich in allen dreien: Größe, Wände, Tür (7, 15), Fenster, Durchreiche, Lager, Toiletten,
Übergang und Auslöser.

**Offen für den Haupt-Chat:** `werkzeuge/schatten.py` für `mf5Hocker`, `mf5Kaffeemaschine`, `mf5Mixer`
(grauer Festschatten, 10.5; keine Black_Shadow-Fassung im Katalog).

### 4.5 Außenkarte Birch Lane (`mapleFalls.aussen`), gebaut

**Gebaut in Runde 4: 64 × 43** (nach der Bildprüfung des Haupt-Chats). Die gebaute Lage geht dem Plan
in 1.1 vor; die Abweichungen kommen von den Größen der ganzen Gebäude im Katalog (Holzhäuser 9 × 13
mit Dach und Veranda, Schule 24 × 23, Häuser der Südseite 8 × 10 und 10 × 9).

| Reihen | Inhalt                                                                                                                                                                                        |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–3    | Wasserfall (2, 0) (eigene Grafik), Fluss in den Reihen 2–3 von Rand zu Rand, auch hinter der Schule                                                                                           |
| 4–9    | Gärten Nord: Ahorne, Laubbäume, Gemüsebeet, Gartenbank, Büsche                                                                                                                                |
| 4–23   | niedrige Eisenzäune: Seiten in den Spalten 10, 20, 30; vorn Reihe 23 mit Pforten (3–4, 13–14, 23–24) und den Briefkästen in der Zaunlinie (5, 15, 25)                                         |
| 10–22  | Nordseite: Whitlock (1, 10), Lily (11, 10), Martínez (21, 10), Diner (31, 14) mit Tisch davor (36–37, 22), Schule (39, 0)                                                                     |
| 24–28  | Gehweg Nord, Birch Lane (25–27), Gehweg Süd                                                                                                                                                   |
| 29–31  | Grünstreifen: Straßenbäume und Laternen im Wechsel, Haltestelle (12, 29) mit Bank (9, 30) und Mülltonne (17, 30), Schild „Zu verkaufen“ (25, 31)                                              |
| 31–40  | Südseite: Calloway (1, 32), Hayes (18, 31) mit Einfahrt 26–27, Fisk (29, 32), Süd 4 (40, 31); Zäune zwischen den Grundstücken (Spalten 11, 17, 48), Beet und Büsche; Spielplatz 50–61 / 32–39 |
| 41     | Plattenweg vor den Häusern der Südseite (ihre Haustüren zeigen nach Süden, wie bei allen Häusern im Bild)                                                                                     |
| 42     | Hecke                                                                                                                                                                                         |

**Übergänge (gebaut):** `haustuer` (3, 23) in der Pforte, Start (3, 24); `dinerTuer` (33, 23) ↔ Diner
(4, 11); `schule` (47, 23) vor der Treppe; `park` Ostrand (63, 25–27).

**Fahnenmast** (eigene Grafik) rechts neben der Freitreppe (57, 15), mit `vorn` vor der Fassade gezeichnet.
**Diner-Schild** (eigene Grafik „DINER“) über der Markise, mit `auf` am Diner. **Westende:** Die Birch Lane
endet an einem runden Wendehammer (1–5 / 24–28) mit drei Pollern (1, 25–27) und einem Schild „Sackgasse“
(7, 29); der Rand bleibt zu (Regel 5.1: die Straße endet an einem Ziel). Die Grundstücke der Südseite
haben Seitenzäune, aber keinen Zaun zur Straße, weil der Grünstreifen den Platz braucht.

### 4.6 Park (`mapleFalls.park`), gebaut

**Gebaut in Runde 4: 44 × 32**, Lage wie in 1.2 mit diesen Abweichungen: Der Steg S5 ist ein morscher
Steg im Wasser (4, 1) mit rot-weißer Sperrlatte `absperrungSteg` (5, 3); der Fußsteg zum Zedernpfad
(10–11, 0–2) ist ein Holzsteg auf Pfählen (Camping Pier_Bridge_1 und _2) über Dielen, das Schild „Sturmschaden“ (Wegweiser-Tafel) steht an seinem Ende (12, 3).
Statt der Halfpipe (Entscheidung Haupt-Chat, in 12): kleiner Basketballplatz aus Asphalt (24–30 / 23–29)
mit Korb (27, 21); Jo sitzt daneben auf einer langen Bank am Fluss (31, 24), Figur (32, 27). Eine niedrige
Mauer gibt es im Katalog nicht. Die Brücke der Parkstraße ist die
Straße selbst über dem Fluss, ohne Geländer (kein Brückenbild im Katalog). Kiosk Patel (24, 10) mit
Laterne, Abernathys Bank `parkbank` (3, 11) und zweite Bank (7, 11), Bushaltestelle (24, 18),
Brett-Platz (9–13 / 22–25) mit Bank, Teich (17–23 / 23–27), Bäume.

**Nach der Bildprüfung des Haupt-Chats:** Der Fluss läuft ohne Lücke unter der Parkstraße durch; die
Brücke (31–34 / 15–17) hat Holzdielen und auf beiden Seiten ein Geländer über dem Wasser (Reihen 14 und
18). Der Steg S5 ist jetzt ein gerader Holzsteg vom Ufer ins Wasser (5–6 / 0–3), die Sperrlatte steht
am Ufer (5, 4). Am Uferweg stehen vier Bäume in gleichen Abständen (1, 7, 13, 19) mit Laternen dazwischen
(5, 11, 17, 23); der Erdweg endet auf einem kleinen Pflasterstück am Gehweg (28–29, 13). Blumenbeete
(14, 22) und (19, 13), Abfalleimer (2, 12) und (16, 23), Bäume am Teich (13, 28) und im Osten (35, 28).
Für Jo fehlt eine Mauer im Katalog; er sitzt auf der Bank am Basketballplatz.

**Runde 6 (mittel-4, 9.11.2026), nach der Rückmeldung des Autors** (`pruefberichte/2026-11-09_runde4_autor.md`,
Zeilen „Park“; KARTENREGELN 10). Größe bleibt 44 × 32, Szene `szenen/maple-falls-park.json`, Möbel
mit Vorsilbe `mf6` in `moebel/maple-falls.json`. Bühnenbild:

- **Fluss** (10.23, 10.1): Nordufer durchgehend in Reihe 1 (Gebüsch als Waldrand, Lücke nur am Pfad
  10–11), Wasser in den Reihen 2–4 mit zwei Buchten bis Reihe 5 (Spalten 3–8 am Steg, 14–20, 25–33),
  Biegung nach Süden bei Spalten 29–34, gewundener Lauf (Spalten 29–35 je nach Reihe) unter der
  Straßenbrücke (31–34 / 15–17) durch, danach Bogen nach Osten und am Ostrand in den Reihen 20–23 zur
  Landstraße. Am Westrand (Reihen 2–4) und Ostrand reicht er bis an den Kartenrand, nirgends
  unterbrochen.
- **Fußsteg zum Zedernpfad** (10.6): eigene Fußgängerbrücke mit Geländer (`spiel/eigene/bruecke_fuss_laengs_3`)
  über den Brückenfeldern `h` (10–11 / 2–4, Szene `bruecken`); die Straßenbrücke (31–34 / 15–17) ist
  `bruecke_strasse_gehweg_quer_4` (Gehwege laufen mit über die Brücke, Brüstung außen; Felder 31–34 / 14–18), der Fluss läuft darunter mit Ufer weiter; Pfad 10–11
  vom Nordrand (Übergang `zedernpfad`, Felder unverändert) bis zum Uferweg. Das Schild „Sturmschaden“
  (`schildZedernpfad`, 13 §7.4, S2) steht am Wegrand (12, 5), nicht auf dem Pfad.
- **Steg S5** (12, 13 §7.4): morscher Steg als ganzes Bild (Pier_26) draußen im Fluss (5–6 / 2–3), die
  Uferkante läuft durch; davor am Ufer der Absperrbock „GESPERRT“ `absperrungSteg` (5–6 / 5–6, eigenes
  Bild, Regel 48), neben dem Uferweg. Der neue
  Steg nach der ersten Nadel folgt als Objekt mit Bedingung in Runde 5.
- **Uferweg** (Erde, 2 breit) Reihen 7–8 von West nach Ost, Kurve 27–28 / 9–13 zur Parkstraße.
- **Nordteil:** Abernathys Bank `parkbank` (3, 11) mit zweiter Bank (1, 11) daneben, beide zum Weg;
  Abfalleimer (5, 11); Bäume abwechselnd (Laubbaum 6, 9; Ahorn 10, 9); Bank des Rentners (17, 11) mit
  Abfalleimer; Kiosk Patel (24, 10), Auslöser `kiosk` (25, 13) unverändert.
- **Laternen** (10.19): eine Bauart (Street_Lamp_5) am Uferweg (2, 15, 24; Fuß in Reihe 9), an der
  Straße nördlich (14, 22, 38; Fuß in Reihe 13) und südlich (9, 21, 38; Fuß in Reihe 19), jeweils direkt
  am Weg oder Gehweg, ohne Kollision (`vorn`), damit der schmale Gehweg frei bleibt.
- **Bushaltestelle** (10.17): Wartehäuschen von hinten (Bus_Stop_2, 24–28 / 22–24), offen nach Norden
  zur Straße; davor eine Wartefläche aus Pflaster (23–29 / 19–21) am Gehweg; Auslöser
  `bushaltestelle` (23, 20) neben dem Wartehäuschen; seit Runde 8 steht es auf dem Pflaster an der Straße (24, 19), offen nach Norden (Bild `wartehaus_hinten`).
- **Basketballplatz** (10.22): ganzer Platz mit Linien, Rand und zwei Körben (Basketball_Court_5,
  1–14 / 20–30); zwei Seitenbänke (15, 22) und (15, 26) mit Blick nach links zum Feld; Jo (Figur
  `skaterJo`) an der oberen Bank (16, 24).
- **Pflasterplatz** (Platz für das öffentliche Brett im Post-Game, 13 §7.4): 17–21 / 21–25, über einen
  Pflasterstreifen (18–19 / 19–20) an den Gehweg angeschlossen; Bank am Ostrand (22, 22) mit Blick auf
  den Platz; Blumenkasten am Südrand des Pflasters (18, 26).
- **Teich** (10.23): unregelmäßig (22–29 / 25–29), mit Grasrand zum Kartenrand; drei Seerosen
  (Props_Water_11 bis 13) im Wasser, Enten am Ufer.
- **Ostteil:** Wiese mit Ahorn (36, 3) und Laubbaum (38, 8) nördlich, Bäume (31, 26) und (39, 25)
  südlich des Flusses.

Abschnitte (je etwa ein Bildschirm, 11 Spalten): A (0–10) Steg S5, Fußsteg, Abernathys Bänke,
Basketballplatz; B (11–21) Uferweg, Rentnerbank, Pflasterplatz, Jo; C (22–32) Kiosk, Haltestelle,
Teich, Flussbiegung; D (33–43) Brücke, Ostwiese, Fluss zur Landstraße. Laufzeit quer 44 Kacheln, 13 s.

Bildprüfung (drei Runden): Fluss berührte oben den Rand (Nordufer geschlossen), Teich lief in den
Südrand (eine Reihe Gras dazwischen), Pfad zum Platz hing frei (Pflasterstreifen), Kurve des
Uferwegs lief unter den Kiosk (zurück auf 27–28). Danach mit der verbesserten Zeichnung des Haupt-Chats
(Innenecken, Ränder, Wellen, Brückenfelder) neu gezeichnet und geprüft: ohne Befund. Die Meldungen „Laterne allein mitten im Raum“ (Regel für
Innenräume) und „wirkt angeschnitten“ (Pier_26 ist absichtlich zerbrochen, die Seerosen sind Wasserkacheln) sind begründet; die
Katalogangaben dazu stehen in `katalog_korrekturen/mittel-4.json`.

**Übergänge (gebaut):** `park` Westrand (0, 15–17) ↔ Birch Lane (63, 25–27); `landstrasse` Ostrand
(43, 15–17) ↔ Landstraße `zurueckPark` (0, 15–17); `zedernpfad` Nordrand (10–11, 0) ↔ Pfadkarte
`zedernZurueckPark` (10–11, 23), in `orte.json` eingetragen; `bushaltestelle` (26, 21); `kiosk` (25, 13).

## 5. Platzhalter für die Rückkehr

Damit die Karten die Rückkehr in späteren Akten tragen, ohne neu gezeichnet zu werden
(`13_Wegenetz.md`, 7.4). Alle Platzhalter sind Objekte mit Bedingung oder freie Felder.

| Karte      | Platzhalter                              | Feld oder Bereich                                                              | Wofür                                           |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| aussen     | Einfahrt Hayes frei                      | 26–27 / 19–26                                                                  | Umzugswagen bei der Rückkehr                    |
| aussen     | Schild „Zu verkaufen“ als eigenes Objekt | (19, 20)                                                                       | verschwindet, wenn jemand einzieht              |
| aussen     | Feld für Kürbisse oder Lichterketten     | Verandas: Whitlock (3, 11), Lily (14, 11), Martínez (24, 11), Calloway (4, 21) | Jahreszeiten auf der Objektebene                |
| aussen     | Plakatwand an der Schule                 | 55–57 / 11                                                                     | Plakate je Akt                                  |
| aussen     | leere Werbetafel am Diner                | 33–34 / 11 am Parkplatz                                                        | Werbung je Akt                                  |
| park       | Schild am Fußsteg zum Zedernpfad         | (12, 3), Bedingung bis zur Öffnung von S2                                      | verschwindet; der Stamm liegt auf der Pfadkarte |
| park       | Absperrband am Steg (`absperrungSteg`)   | (5, 3), Bedingung `nadelMapleFalls ≥ 1` → neuer Steg                           | S5                                              |
| park       | zweite Bank neben Abernathys Bank        | 7–8 / 12                                                                       | Abernathys Schüler (später)                     |
| park       | Startlinie für Jos Rennen                | (14, 4) am Uferweg                                                             | Rennen mit dem Fahrrad (13, Akt 2)              |
| park       | freier Platz für das öffentliche Brett   | 9–13 / 22–25 am Ende des Hauptwegs Süd                                         | Post-Game                                       |
| clubraum   | freie Wandfläche für das Nadel-Plakat    | Nordwand (13, 1)–(14, 2) über dem Pult (4.3)                                   | Nadeln des Helden                               |
| wohnzimmer | Platz auf der Anrichte                   | (4, 3), Platte frei                                                            | Mamas altes Turnierfoto ab Akt 2                |

## Runde 7 (10.11.2026): Gebäude und Belebung

Nach Regel 10.51 und 10.53, ohne das gewählte Bild zu ändern. Drei Kulissenhäuser in voller Größe,
ohne Innenraum (Wunsch des Autors: Größe zeigen): `mf8KulisseBauernhaus` in zweiter Reihe hinter dem
Diner (31, 4); `mf8KulisseLaden` (Markt) an der Hintergasse im Süden, in der Lücke zwischen den beiden
Bauernhäusern (11, 32), dafür sind die Seitenzäune der Lücke und das Beet weg; `mf8KulisseStadthaus`
am Ostrand (57, 30). Der Spielplatz ist dafür schmaler (Spalten 49–56) und behält Sandkasten,
Klettergerüst, Schaukel, Bank und Mülleimer; die Rutsche ist weg. Damit 12 Gebäude. Belebung: 12
Statisten, 9 davon ansprechbar (`statist.mapleFalls.aussen.*`), dazu Hund, Tauben, Eichhörnchen und
Katze. Die Kinder mit Kreide zeigen die Königsjagd Lasker gegen Thomas, London 1912
(`zeigt: laskerThomas`).

## Runde 8 (10.11.2026): Notizen des Autors und Zustände (niedrig-1)

**Umgesetzt (Revision 2):**

- Straße: Das Haus hinter dem Diner ist ein kleineres Haus mit gepflastertem Vorplatz; ein Weg
  zwischen Diner und Schule (Spalte 38) führt hinauf, statt eines Hinterausgangs. Der Zaun links hat
  einen Endpfosten. Das Seeufer im Norden ist nicht mehr gerade (Regel 23).
- Park: breiter Absperrbock, „GESPERRT“ ganz lesbar; der Limowagen trägt Waren, eine Verkäuferin
  steht daneben (10.59); Reisebrett auf Abernathys Bank; eigene Halfpipe neben dem Basketballplatz,
  Jo an ihrer Kante.

**Antworten auf die Fragen des Autors:**

- _Soll die Straße links nicht weitergehen?_ Nein. Westlich von Maple Falls liegt in der Geschichte
  nichts; die Birch Lane endet in einem Wendehammer mit Hecke. Umgesetzt.
- _Reisebrett sichtbar?_ Ja, als kleines Brett auf der Bank (Auslöser `parkbank` bleibt).
- _Schulbus schon zu sehen?_ Nein, erst in Szene 13 (Aufbruch). Bis dahin ist die Haltestelle leer;
  der Bus ist ein Zustand der Karte (unten).
- _Absperrung am kaputten Steg?_ Richtig so: Der morsche Steg ist Sperre S5. Der begehbare Steg führt
  zum Zedernpfad, an seinem Ende das Schild „Sturmschaden“ (S2).

**Zustände (10.63), gebaut (Szenen `maple-falls-park-<zustand>.json`, Schlüssel in `orte.json`):**

| Karte               | Zustand    | Bedingung                                            | Zustand: wann, was, warum                                                                                                |
| ------------------- | ---------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `mapleFalls.park`   | `steg-neu` | `nadelMapleFalls >= 1`                               | Nach der ersten Clubnadel: Absperrung weg, Mr. Pratts neuer Steg ersetzt den morschen (S5).                              |
| `mapleFalls.park`   | `schulbus` | `aufbruchGesehen und nicht ankunftCedarCreekGesehen` | Szene 13 bis zur Ankunft in Cedar Creek: Der Schulbus wartet vor der Haltestelle; mit neuem Steg (liegt nach der Nadel). |
| `mapleFalls.aussen` | –          | –                                                    | Kein fester Wechsel.                                                                                                     |

Das Schild „Sturmschaden“ am Zedernpfad steht nicht als Bild auf der Parkkarte; S2 bleibt dort ein
Übergang mit Dialog, darum kein Zustand.

## Gutachten Runde 8: Antworten (niedrig-1, 10.11.2026)

Gutachten in `docs/spiel/auftraege/gutachten/`. „Technik“ heißt: zentral gelöst für alle Karten
(Tierbilder, Laternenhöhe, Fußmatte, Stufendiagonalen), hier nicht einzeln umgebaut.

**Park** (Commit „Park nach dem Gutachten“):

- Behoben: 1, 2 (der morsche Steg ragt vom Südufer ins Wasser, ein Pfad führt zur Absperrung), 9
  (zwei überzählige Laternen weg), 11, 12 (Brett auf der Sitzfläche, Abernathy vor seiner Bank),
  22 (Weg zum Basketballplatz), 25, 26 (die zwei Pflasterflecken sind ein Platz), 29 (Blumenbeete),
  17, 30 (Bäume im Osten und Südosten). Der neue Steg ist Zustand `steg-neu`.
- Technik: 4, 28 (Enten und Krähen sind dasselbe Bild), 8 (Laternenhöhe).
- Perspektive: 14, 27 (Bänke und Wartehäuschen gibt es nur von vorn; das Häuschen zeigt seine Front
  nach Süden, die Haltestelle liegt darum südlich der Straße), 16, 24 (Figuren nur stehend).
- Fehlendes Bild: 18 (Holzbrücke; die Straßenbrücke nutzt das Brückenbild aus dem Paket), 19, 20
  (Fahrbahnmarkierung, Zebrastreifen), 21 (kleines Feld mit einem Korb; Bildwunsch), 23 (die
  Halfpipe ist schwer zu erkennen; Bildwunsch).
- Zur Nachprüfung: 3, 5, 6, 7, 10, 13, 15.

**Maple Falls außen** (Commit „Maple Falls Straße nach dem Gutachten“):

- Behoben: 25, 27–31 (die Südhäuser zeigen der Birch Lane eingezäunte Gärten mit Gartenhaus, Beet
  und Baum; die Türen liegen an der Gasse dahinter, weil jedes Hausbild seine Tür unten hat), 26
  (Wohnhaus statt „MARKET“), 9 (Holzhaus statt Flachdachhaus hinter dem Diner), 11 (Wendehammer
  mit Gehweg rundherum), 17 (Freitreppe bis zum Gehweg gepflastert), 15 (Tisch ohne Stühle weg),
  33 (zweite Elternbank).
- Technik: 3, 13, 20 (Tierbilder), 22, 23 (Laternen), 2 (Stufen).
- Perspektive: 6 (Bänke von vorn), 8, 14, 37, 38 (Figuren ohne Werkzeug in der Hand).
- Fehlendes Bild: 21 (Markierung), 24 (Auto und Rad; der Schulbus kommt als Zustand `schulbus` in
  den Park), 16 (eigenes Diner-Bild), 32 (Rutsche), 35 (Sandboden).
- Gewollt: 1 (der Bach läuft am Nordrand aus der Karte).
- Zur Nachprüfung: 4, 5, 7, 10, 12, 18, 19, 34, 36.
