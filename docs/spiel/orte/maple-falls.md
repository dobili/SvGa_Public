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

| Gebäude                            | Lage außen (Spalten / Reihen), Tür                                                      | Fassade                                                | Innen                                                                           | Begehbar     |
| ---------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------ |
| Haus Whitlock (Held und Mama)      | 2–11 / 6–10, Haustür (5, 10) in der Südfassade (Spalte 3 von 10)                        | Holzhaus mit Veranda, eineinhalb Geschosse, 10 breit   | `wohnzimmer` 20 × 13 (4.1), `dachboden` 14 × 11 (4.2)                           | ja           |
| Haus Lily                          | 13–21 / 6–10                                                                            | Holzhaus, 9, Katze auf der Veranda                     | –                                                                               | nein         |
| Haus Martínez (Juno, Carla)        | 23–31 / 6–10; Fahrrad am Zaun (32, 13)                                                  | Holzhaus, 9                                            | –                                                                               | nein         |
| Diner „Falls Diner“                | 33–41 / 7–10, Tür (37, 10) in der Südfassade (Spalte 4 von 9); Parkplatz 33–41 / 11–13  | Flachbau, 9, Leuchtreklame „Open“ auf dem Dach (38, 7) | `diner` 18 × 12, Tür Südwand (4, 11) (Befund 9; gebaut 4.4)                     | ja (neu, 12) |
| Durchgang zum Ufer                 | 42–43 / 3–13, Hecken beidseits, Bank am Ufer (42, 4)                                    | –                                                      | –                                                                               | Weg          |
| Maple Falls High                   | 44–59 / 5–10, Doppeltür (51–52, 10) in der Mitte der Südfassade; Schulhof 44–59 / 11–13 | Backstein, 16, Fahnenmast (47, 12)                     | `clubraum` 18 × 13, Tür (9, 12) (Vereinfachung: Schultür führt in den Clubraum) | ja           |
| Haus Calloway (gegenüber Whitlock) | 3–11 / 22–26, Tür (7, 22) zur Straße; Veranda 4–10 / 21 mit Schaukelstuhl               | Holzhaus, 9, Blumenkästen                              | –                                                                               | nein         |
| Haltestelle Schulbus               | Schild (14, 18), Wartehäuschen 13–15 / 19                                               | –                                                      | –                                                                               | –            |
| Haus Hayes (Leerstand)             | 17–25 / 22–26; Einfahrt 26–27 / 19–26 frei; Schild „Zu verkaufen“ (19, 20)              | Holzhaus, 9                                            | –                                                                               | nein         |
| Haus Fisk (Owens Familie)          | 29–37 / 22–26                                                                           | Holzhaus, 9                                            | –                                                                               | nein         |
| Haus Süd 4                         | 39–47 / 22–26                                                                           | Holzhaus, 8                                            | –                                                                               | nein         |
| Spielplatz (gegenüber der Schule)  | 49–59 / 19–26: Sandkasten 52–54 / 22–23, Schaukel 56–57 / 20–21, Bank (50, 25)          | –                                                      | –                                                                               | Platz        |

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
| aussen `dinerTuer` (33, 23)                         | diner `dinerAusgang` (4, 11); Ankunft (4, 10)                                | Südfassade 25 % ↔ Südwand 22 % (gebaut, 4.5).                                   |
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

## 4. Bühnenbilder

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

### 4.3 Clubraum der Maple Falls High (`mapleFalls.clubraum`)

**Größe:** 18 × 13 (7a.2, öffentlicher Raum 14–20 × 10–14). Nordwand Reihen 0–2, Tür in der
Südwand (9, 12), Start (9, 11). Heller Holzboden, cremefarbene Wände.

**Laufwege:** Tür → Gang zwischen den Tischen (Spalten 6–7 und 12–13) nach oben zu Tafel, Pult und
Anrichte. Szenen 5, 6, 9, 11, 12.

| Zone     | Gegenstand                                                     | Feld                                               | Zweck                                                 |
| -------- | -------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| Nordwand | Pinnwand, zwei Fenster, Weltkarte, Tafel, Plakat „Erst zählen“ | (1, 1); (3, 1) und (11, 1); (5, 1); (7, 1); (9, 1) | Auslöser `plakatZaehlen` (9, 3)                       |
| Nordwand | freie Wandfläche                                               | (13, 1)–(14, 2) über dem Pult                      | Platzhalter Nadel-Plakat (5)                          |
| West     | Anrichte mit Pokal von 1994                                    | (1, 2)                                             | Auslöser `pokalvitrine` (1, 3)                        |
| Ost      | Lehrerpult mit Globus, zwei Spinde                             | Pult (13, 3); Spinde (15, 2) und (16, 2)           | Coach Delgado (12, 4)                                 |
| Ost      | zwei niedrige Bücherregale                                     | (14, 5) und (14, 8), je 2 × 3 (neu in Runde 4)     | Schachbücher; gegen die karge Ostseite                |
| Mitte    | vier Spieltische mit Brett und je zwei Stühlen                 | Tische (3, 5), (9, 5), (3, 8), (9, 8)              | die vier Bretter; `brettOhneDame` (10, 9); Sam (4, 4) |
| Ecken    | Pflanzen                                                       | (1, 9) und (16, 9)                                 | Regel 4.4                                             |

### 4.4 Diner (`mapleFalls.diner`, neu)

**Größe:** 18 × 12 (7a.2, öffentlicher Raum). Nordwand Reihen 0–2 (rot), Boden weiße Fliesen, Tür in
der Südwand (4, 11), Start (4, 10); außen Auslöser (33, 23) unter der Tür der Südfassade (22 % ↔ 25 %). Übergänge
`dinerTuer` ↔ `dinerAusgang` in `orte.json`.

**Laufwege:** Tür → nach oben zu den Hockern und zur Kasse; nach links und rechts zu den Sitzecken.

| Zone     | Gegenstand                                              | Feld                                                                                         | Zweck                                                               |
| -------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Nordwand | zwei Fenster, Pinnwand mit Tischsets, Foto 1962         | (3, 1), (6, 1); Pinnwand (9, 1); Foto (11, 1)                                                | `tischsetWand`, `fotoSchule1962` (Auslöser folgen in Runde 5)       |
| Tresen   | vier Glasvitrinen (`mf4Vitrine`) und Kasse (`mf4Kasse`) | Vitrinen (3, 4), (5, 4), (7, 4), (11, 4); Kasse (9, 3)                                       | Hector dahinter (Reihe 3); Kasse mit dem Foto daneben               |
| Tresen   | vier Barhocker (`mf4Barhocker`)                         | (3, 5), (5, 5), (7, 5), (11, 5)                                                              | Gäste; N-MF1 am Tresen                                              |
| Küche    | Arbeitsplatte, Herd, Kühlschrank                        | (13, 2), (15, 2), (16, 1)                                                                    | Durchreiche-Ecke                                                    |
| Südwand  | zwei Sitzecken: runder Tisch, zwei Stühle               | Tische (7, 8) und (12, 8); Stühle (6, 8), (9, 8), (11, 8), (14, 8); Pflanzen (1, 9), (16, 9) | statt vier Sitznischen: Der Katalog hat keine Sitzbänke für Nischen |
| Ecken    | Pflanzen                                                | (1, 3), (16, 9)                                                                              | Regel 4.4                                                           |

Abweichungen vom Vorschlag in 12: keine Jukebox (im Katalog nicht vorhanden; `jukebox` entfällt oder
wird ein Radio in Runde 5), zwei statt vier Sitzecken.

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

**Offen:** Der Fahnenmast (eigene Grafik, 3 × 9) lässt sich nicht neben die Freitreppe stellen,
ohne das Schulbild zu überlappen; ohne Kollision zeichnet der Kartenbauer ihn hinter die Schule.
Kein Schild für das Diner im Katalog. Straße und Gehweg enden eine Kachel vor dem Westrand, weil
der Rand ohne Übergang geschlossen sein muss (Test „Rand geschlossen“). Die Grundstücke der Südseite
haben Seitenzäune, aber keinen Zaun zur Straße, weil der Grünstreifen den Platz braucht.

### 4.6 Park (`mapleFalls.park`), gebaut

**Gebaut in Runde 4: 44 × 32**, Lage wie in 1.2 mit diesen Abweichungen: Der Steg S5 ist ein morscher
Steg im Wasser (4, 1) mit rot-weißer Sperrlatte `absperrungSteg` (5, 3); der Fußsteg zum Zedernpfad
(10–11, 0–2) ist aus Dielen, das Schild „Sturmschaden“ (Wegweiser-Tafel) steht an seinem Ende (12, 3).
Keine Halfpipe im Katalog: Jo sitzt an der langen Bank (19, 11). Die Brücke der Parkstraße ist die
Straße selbst über dem Fluss, ohne Geländer (kein Brückenbild im Katalog). Kiosk Patel (24, 10) mit
Laterne, Abernathys Bank `parkbank` (3, 11) und zweite Bank (7, 11), Bushaltestelle (24, 18),
Brett-Platz (9–13 / 22–25) mit Bank, Teich (17–23 / 23–27), Bäume.

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
