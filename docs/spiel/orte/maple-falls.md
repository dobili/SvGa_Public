# Maple Falls

Stand: 9.11.2026. Ortsdokument nach dem Verfahren in `docs/spiel/orte/README.md`: Ortsplan,
Ortsbild, Abgleich mit der Geschichte, Bühnenbilder. Quellen: `05_Story_Bibel.md` (Abschnitte 1,
2, 3.1, Szenen 1 bis 13), `09_Weltbeschreibung.md` (5.1, Belebung), `ortsprofile.json`,
`KARTENREGELN.md`. Ausgearbeitet ist bisher das Bühnenbild des Erdgeschosses (Muster); die übrigen
folgen nach der Durchsicht durch den Autor.

## 1. Ortsplan

Norden ist oben, auf allen Karten. Der Fluss kommt im Norden über den Wasserfall, fließt hinter
den Häusern der Birch Lane nach Osten und begleitet dann den Park. Alles, was man betreten kann,
liegt an der Birch Lane oder im Park.

```
                         N
     Wasserfall · Fluss (hinter den Dächern, nicht begehbar) ──────────────►
 ┌────────────────── mapleFalls.aussen (56 × 33) ──────────────────┐┌── mapleFalls.park (30 × 20) ──┐
 │ [Haus Whitlock] [Lily]  [Hayes]  [Juno]   [Schule + Fahnenmast]  ││ ~~~~~ Fluss, Ufer, Enten ~~~~~ │
 │  Garten, Zäune, Ahorn als Allee                                  ││  Wiese, Halfpipe, Kiosk Patel  │
 │ ─────── Gehweg Nord ───────────────────────────────────────────  ││  Bänke am Weg                  │
 │ ═══════ Birch Lane ════════════════════════════════════════════ ═╪╪═ Parkstraße ═══════════════ ═╪═► Landstraße
 │ ─────── Gehweg Süd ────────────────────────────────────────────  ││  Bushaltestelle (Schulbus)     │
 │ [Haltestelle] [Haus] [Haus] [Haus]   [Diner mit Leuchtreklame]   ││                                │
 └──────────────────────────────────────────────────────────────────┘└────────────────────────────────┘
```

### 1.1 Gebäude und Maße

| Gebäude                                    | Außen (Fassade, Kacheln)                                                                                                          | Innen                                                                         | Begehbar       |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------- |
| Haus Whitlock (Held und Mama)              | Holzhaus mit Veranda, eineinhalb Geschosse, Fassade 11 breit, Haustür in der Südfassade bei Spalte 3 der Fassade (27 % von links) | Erdgeschoss `wohnzimmer` 22 × 14, Dachboden `dachboden` 18 × 11               | ja             |
| Nachbarhaus Lily (östlich)                 | Holzhaus, Fassade 9, Katze auf der Veranda                                                                                        | –                                                                             | nein           |
| Haus Hayes (Leerstand, „Zu verkaufen“)     | Holzhaus, Fassade 9                                                                                                               | –                                                                             | nein           |
| Haus Martínez (Juno, „zwei Häuser weiter“) | Holzhaus, Fassade 9, Fahrrad am Zaun                                                                                              | –                                                                             | nein           |
| Maple Falls High                           | Backstein, Fassade 16, Fahnenmast davor, Doppeltür in der Mitte der Südfassade                                                    | `clubraum` 18 × 13 (Vereinfachung: die Schultür führt direkt in den Clubraum) | ja             |
| Häuser Südseite                            | Holzhäuser, je Fassade 8–9, Türen in der Nordfassade zur Straße                                                                   | –                                                                             | nein           |
| Diner                                      | Flachbau mit Leuchtreklame, Fassade 12                                                                                            | –                                                                             | nein (Kulisse) |
| Kiosk Mr. Patel (Park)                     | Verkaufswagen mit Markise, 3 breit                                                                                                | – (Laden über Dialog)                                                         | nein           |

Regel für alle Häuser: Die Fassade ist halb so breit wie das Erdgeschoss innen (gerundet), die Tür
sitzt außen und innen an derselben relativen Stelle (gleiche Wand, gleicher Anteil von links, ±1
Kachel). Fenster gibt es innen nur an Nordwänden (die Ansicht zeigt nur dort Wandflächen); außen
zeigt die Südfassade Fenster. Das ist im Genre üblich und kein Widerspruch.

### 1.2 Übergänge

| Von (Karte, Auslöser, Feld)                           | Nach (Karte, Auslöser, Feld)                       | Lage                                                                                                                  |
| ----------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| aussen `haustuer` (Tür Haus Whitlock, Südfassade)     | wohnzimmer `haustuer` (Südwand, Spalte 6)          | Hinein geht es nach Norden; innen kommt man an der Südwand an und schaut nach oben.                                   |
| wohnzimmer `treppeOben` (oberste Stufe, Nordwestecke) | dachboden `treppe` (Bodenöffnung, Nordwestecke)    | Beide Treppen liegen in der Nordwestecke übereinander. Unten führt die Treppe nach oben, oben die Öffnung nach unten. |
| aussen `schule` (Doppeltür der Schule)                | clubraum `schule` (Südwand, Mitte)                 | Hinein nach Norden, Ankunft an der Südwand.                                                                           |
| aussen `park` (Ostrand, Birch Lane)                   | park `park` (Westrand, Parkstraße)                 | Straße läuft über den Rand weiter, gleiche Breite.                                                                    |
| park `landstrasse` (Ostrand, Parkstraße)              | wegMapleCedar.landstrasse `zurueckPark` (Westrand) | Straße läuft über den Rand weiter.                                                                                    |
| park `bushaltestelle` (Dialog, Reise)                 | cedarCreek.aussen `bushaltestelle`                 | Busfahrt.                                                                                                             |

Die Prüfung im Kartenbauer (`pipeline/abenteuer/uebergaenge.py`) verlangt: Jeder Übergang hat sein
Gegenstück auf der Zielkarte; Türen liegen auf der Wand, durch die man den Raum verlässt
(Südwand innen ↔ Tür in einer Südfassade außen); Randübergänge liegen auf dem passenden Rand
(Ost ↔ West) und die Straße oder der Weg ist auf beiden Seiten gleich breit.

## 2. Ortsbild

Maple Falls hört man, bevor man es sieht. Hinter den Dächern der Birch Lane fällt der Fluss über
eine Kante aus dunklem Fels, und das Rauschen liegt über der ganzen Stadt wie ein Teppich, auf den
alle anderen Geräusche gestellt werden: das Klappern eines Briefkastendeckels, ein Rasenmäher drei
Gärten weiter, die Schulglocke, die um acht Uhr zwei Minuten zu früh läutet, weil niemand sie seit
Jahren gestellt hat.

Es ist Spätsommer. Die Ahornbäume, die in gleichen Abständen den Gehweg säumen, sind noch grün,
aber an den Rändern der Blätter brennt schon das erste Rot, als hätte jemand sie mit einem
Pinsel nachgezogen. Morgens liegt Tau auf den Rasenflächen der Vorgärten, mittags riecht es nach
warmem Holz und geschnittenem Gras, abends nach Holzkohle, wenn irgendwo gegrillt wird.

Die Birch Lane ist eine Straße, auf der jeder jeden grüßt. Die Häuser sind aus Holz, weiß, hellblau
oder salbeigrün gestrichen, mit Veranden, auf denen Schaukelstühle und vergessene Kaffeebecher
stehen. Jeder Vorgarten hat seinen niedrigen Zaun oder seine Hecke, einen Plattenweg zur Tür und
einen Briefkasten an der Straße, an dem der Name schon etwas verblichen ist. Auf der Veranda von
Lilys Familie schläft eine graue Katze, die sich nur bewegt, um der Sonne zu folgen. Das Haus
dazwischen steht leer; im Fenster lehnt ein Schild „Zu verkaufen“.

Das Haus der alten Mrs. Whitlock ist das älteste der Straße. Seine Farbe ist ein müdes Weiß, die
Verandastufen knarren, und auf dem Dach fehlt eine Schindel. Im Garten dahinter stehen zwei alte
Ahorne, deren Kronen bis an das kleine Dachbodenfenster reichen. Drinnen riecht es nach Umzug:
Pappe, Klebeband, kalte Pizza. Die Möbel der Familie sind einfach und gebraucht, aber heil; nur
oben unter dem Dach steht noch alles, was die Whitlocks in hundertfünfzig Jahren nicht
weggeworfen haben.

Am östlichen Ende der Straße steht die Maple Falls High, ein Backsteinbau von 1962 mit einem
Fahnenmast, an dem die Flagge träge im Wind hängt. Im Erdgeschoss, hinter dem dritten Fenster, ist
das Klassenzimmer, in dem nachmittags das Schachteam trainiert; in einer Vitrine stehen die Pokale
von 1994, als Maple Falls zuletzt etwas gewonnen hat. Gegenüber, auf der Südseite, leuchtet am
Abend die Reklame des Diners, ein rotes „Open“, bei dem das „p“ flackert.

Folgt man der Straße nach Osten, wird sie zur Parkstraße. Der Stadtpark liegt am Fluss, der hier
breit und ruhig ist. Enten treiben am Ufer, ein Steg aus grauem Holz ragt ins Wasser. Auf der
Wiese steht eine Halfpipe mit abgeplatztem Lack, auf deren Kante Jo sitzt und Blitzpartien um Limo
spielt. Am Hauptweg parkt der Verkaufswagen von Mr. Patel mit gestreifter Markise; er verkauft
Zeitungen, Limo und seit dreißig Jahren Taschenschachspiele. Auf der Bank unter der großen Eiche
sitzt jeden Nachmittag Mr. Abernathy mit Reiseschach und Thermoskanne. Am Ostrand wartet die
Bushaltestelle, und dahinter beginnt die Landstraße nach Cedar Creek, zwischen Feldern und Zäunen.

## 3. Abgleich mit der Geschichte

### 3.1 Was die Geschichte verlangt

| Karte      | Szenen                                          | Figuren                                       | Auslöser und Gegenstände                                                                                                                                                  | Belebung                                                                                                          |
| ---------- | ----------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| wohnzimmer | 1, 4, 13; später Ironwood-Vorspiel, Akt 3 und 4 | Mama                                          | `haustuer`, `treppeOben`, `fotoGrandma`, `kartonKueche`, `pizzakarton`; Kiste „Whitlock – nicht wegwerfen“ (Szene 1); Zettel vom Schachteam aus dem Briefkasten (Szene 4) | –                                                                                                                 |
| dachboden  | 2, 3, nach 12; Akt 4 (Szene nach der Arena)     | Ambrose (im Brett)                            | `treppe`, `brett`, `hutschachtel`, `spiegel`, `zeitungen1961`                                                                                                             | Staub im Licht                                                                                                    |
| aussen     | 5, 8                                            | Juno (Haltestelle), Lily (vor ihrem Haus)     | `haustuer`, `schule`, `park`; Bushaltestelle des Schulbusses (Szene 5)                                                                                                    | Briefträgerin, Kind mit Ball vor der Schule, Mann harkt Laub; Eichhörnchen am Zaun, Katze auf der Veranda, Krähen |
| clubraum   | 5, 6, 9, 11, 12                                 | Coach Delgado, Sam, Juno, Victor, Graham Hale | `schule`, `pokalvitrine`, `brettOhneDame`, `plakatZaehlen`; vier Bretter                                                                                                  | –                                                                                                                 |
| park       | 7, 10, 10a, 13                                  | Mr. Abernathy, Jo, Mr. Patel                  | `park`, `landstrasse`, `bushaltestelle`, `parkbank` (Abernathys Bank), zweite Bank mit dem vergessenen Reisebrett, `kiosk` (Laden `mapleFalls.kiosk`)                     | Skater, Rentner auf der Bank; Enten, die folgen, wer stehen bleibt                                                |

### 3.2 Was aus dem Ortsbild bleibt, was sich ändert, was entfällt

| Element                                                | Entscheidung                                                                                    | Grund                                                                                                                                                      |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wasserfall hinter den Dächern                          | bleibt, als Kachelanimation am oberen Rand der Außenkarte                                       | Weltbeschreibung 5.1; gibt der Stadt ihren Namen.                                                                                                          |
| Küche „in der Ecke“ des Wohnzimmers (Weltbeschreibung) | geändert: eigene Küche hinter einem Durchgang im selben Erdgeschoss                             | Regel 2.1 (keine Küchenmöbel im Wohnzimmer); Rückmeldung des Autors zu Runde 3. Die Szenen brauchen nur den Karton „Küche?“, der jetzt in der Küche steht. |
| Fernseher                                              | bleibt, auf einem Lowboard an der Nordwand, nicht neben der Haustür                             | Regel 4.2.                                                                                                                                                 |
| Schlafzimmer                                           | nur als geschlossene Türen im Erdgeschoss (nicht betretbar)                                     | Die Geschichte braucht sie nicht; ohne sie wäre unklar, wo die Familie schläft.                                                                            |
| Kaputte Möbel                                          | nur auf dem Dachboden                                                                           | Ortsprofil: unten neu oder gebraucht.                                                                                                                      |
| Haus Hayes „Zu verkaufen“                              | neu                                                                                             | erklärt den dritten Bauplatz zwischen Lily und Juno ohne neue Figur.                                                                                       |
| Diner                                                  | bleibt als Kulisse (nicht betretbar)                                                            | Weltbeschreibung; Belebung „Kellnerin wischt Tische“ sieht man durchs Fenster nicht, also entfällt sie in Akt 1.                                           |
| Briefkasten am Haus Whitlock                           | neu, Pflicht                                                                                    | Szene 4: „Zettel im Briefkasten“.                                                                                                                          |
| Steg im Park                                           | bleibt                                                                                          | Ortsbild; beginnt am Ufer und ragt ins Wasser (Regel 6.5).                                                                                                 |
| Schulglocke zwei Minuten zu früh                       | nur Text (Belebung, Dialog möglich)                                                             | kein Bild nötig.                                                                                                                                           |
| Bushaltestelle                                         | zwei: eine an der Birch Lane (Szene 5, Juno), eine im Park (Szene 13, Abfahrt nach Cedar Creek) | Story-Bibel nennt beide; die Birch-Lane-Haltestelle ist der Schulbus am Morgen, die im Park der Bus über Land.                                             |

## 4. Bühnenbilder

### 4.1 Erdgeschoss Haus Whitlock (`mapleFalls.wohnzimmer`), Muster

**Größe:** 22 × 14 Kacheln. Nordwand: Reihe 0 Wandkrone, Reihen 1 und 2 Wandfläche (creme, mit
Sockelleiste). Boden ab Reihe 3. Südwand Reihe 13, Westwand Spalte 0, Ostwand Spalte 21.
Innenwand zwischen Wohnzimmer und Küche in Spalte 13, mit Durchgang (Türrahmen ohne Tür) in den
Reihen 7 und 8. Boden: helle Holzdielen im Wohnzimmer, Fliesen (hell) in der Küche.

**Licht und Stimmung:** Spätnachmittag, Licht fällt schräg durch die Nordfenster (im Spiel ohne
eigenes Licht). Alles ist sauber, aber unfertig: Kartons stehen noch überall, und nichts hängt
außer dem Foto.

**Laufwege (frei halten):** Haustür (6, 13) → hinauf bis Reihe 10 → nach Westen bis Spalte 2 →
hinauf bis zum Antritt der Treppe (2, 6). Haustür → nach Osten durch den Durchgang (13, 7–8) zum
Esstisch. Jeder Auslöser ist von einem freien Nachbarfeld erreichbar.

**Zonen und Inventar** (Feld = linke obere Kachel des Gegenstands, Spalte/Reihe):

| Zone     | Gegenstand                                           | Wo                                                                                                              | Ausrichtung                      | Material, Stil, Zustand                                   | Zweck                                                                    |
| -------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| Treppe   | Holztreppe nach oben mit Geländer                    | (1, 3) bis (2, 5) an der Nordwand                                                                               | führt nach oben (Nord)           | Holz, landhaus, gebraucht                                 | Weg zum Dachboden; Auslöser `treppeOben` auf (1, 3), Antritt (2, 6) frei |
| Treppe   | Kiste „Whitlock – nicht wegwerfen“                   | (3, 6) neben dem Antritt                                                                                        | –                                | Pappe, alt                                                | Szene 1: die Kiste, die der Held hinaufträgt                             |
| Nordwand | Fenster mit Gardinen davor                           | Wandfläche (4, 1) und (11, 1)                                                                                   | –                                | Holzrahmen, weiße Gardine                                 | Licht, Blick in den Garten                                               |
| Nordwand | Foto von Grandma Whitlock, gerahmt                   | Wandfläche (6, 1)                                                                                               | –                                | Holzrahmen, alt                                           | Auslöser `fotoGrandma` auf (6, 3), man steht davor                       |
| Sitzecke | Lowboard mit Fernseher darauf                        | (7, 3), 3 breit                                                                                                 | Vorderseite unten (zum Raum)     | Holz hell, gebraucht; Fernseher steht ganz auf der Platte | Regel 4.2                                                                |
| Sitzecke | Teppich                                              | (6, 5), 5 × 4                                                                                                   | flach                            | Stoff, gemustert, gebraucht                               | fasst die Sitzecke                                                       |
| Sitzecke | Couchtisch                                           | (7, 6), 2 × 1                                                                                                   | –                                | Holz hell                                                 | darauf Fernbedienung und Becher                                          |
| Sitzecke | Sofa, von hinten gesehen                             | (6, 8), 4 × 2                                                                                                   | blickt nach oben zum Fernseher   | Stoff grün, gebraucht                                     | Sofa zum Fernseher (Regel 4.5)                                           |
| Sitzecke | Sessel                                               | (11, 6)                                                                                                         | blickt nach links zum Couchtisch | Stoff, passend zum Sofa (gleiche Serie)                   | zweiter Sitzplatz                                                        |
| Sitzecke | Stehlampe                                            | (12, 5), neben dem Sessel                                                                                       | –                                | Metall, Schirm creme                                      | Regel 4.4                                                                |
| Umzug    | Kartonstapel (2–3 Kartons)                           | (1, 8) bis (1, 11) entlang der Westwand                                                                         | –                                | Pappe                                                     | Umzug, lässt Spalte 2 frei                                               |
| Umzug    | hoher Kartonstapel                                   | (10, 10) hinter dem Sofa                                                                                        | –                                | Pappe                                                     | Story-Bibel: „ein hoher Stapel hinter dem Sofa“                          |
| Umzug    | Pizzakarton, leer                                    | (3, 9) auf dem Boden neben dem Laufweg                                                                                           | flach                            | Pappe                                                     | Auslöser `pizzakarton`                                                   |
| Westwand | Tür zum Schlafzimmer (geschlossen)                   | Westwand, Reihe 7 (als Tür in der Wand, (1, 7) bleibt frei)                                                                         | –                                | Holz                                                      | nur Kulisse                                                              |
| Ecken    | Zimmerpflanze im Topf                                | (1, 12) und (12, 12)                                                                                            | –                                | Pflanze, Keramik                                          | Ecken (Regel 4.4)                                                        |
| Eingang  | Fußmatte                                             | (6, 12) vor der Haustür                                                                                         | flach                            | Stoff                                                     | Eingang                                                                  |
| Eingang  | Schuhregal mit Schuhen                               | (4, 12) neben der Haustür (die Südwand hat keine Wandfläche für Haken)                                          | Vorderseite unten                | Holz                                                      | Spuren von Leben                                                         |
| Küche    | Küchenzeile: Spüle, Herd, Arbeitsplatte, Kühlschrank | (14, 3) bis (20, 3) an der Nordwand, lückenlos; Kühlschrank in der Ecke (20, 3)                                 | Vorderseite unten                | weiß und Holz, gebraucht, eine Serie                      | Kochen                                                                   |
| Küche    | Fenster über der Spüle                               | Wandfläche (16, 1)                                                                                              | –                                | –                                                         | Licht                                                                    |
| Küche    | Kleinkram auf der Arbeitsplatte                      | Kaffeemaschine, Obstschale                                                                                      | auf                              | –                                                         | Leben                                                                    |
| Küche    | Esstisch, rechteckig, mit vier gleichen Stühlen      | Tisch (16, 7), 3 × 2; Stühle oben (16, 6) und (18, 6) Sitz nach unten, unten (16, 9) und (18, 9) Sitz nach oben | Stühle zum Tisch                 | Holz hell, eine Serie                                     | Szene 4 und später                                                       |
| Küche    | Mamas Laptop und Papierstapel                        | auf dem Esstisch                                                                                                | auf                              | –                                                         | Mama sortiert Papiere                                                    |
| Küche    | Mama                                                 | (19, 8) neben dem Tisch                                                                                         | schaut nach links                | –                                                         | Figur `mutter`                                                           |
| Küche    | Karton „Küche?“                                      | (15, 11)                                                                                                        | –                                | Pappe, beschriftet                                        | Auslöser `kartonKueche`                                                  |
| Küche    | Mülleimer                                            | (20, 11)                                                                                                        | –                                | Metall                                                    | Leben                                                                    |
| Küche    | Wanduhr                                              | Wandfläche (19, 1)                                                                                              | –                                | –                                                         | Leben                                                                    |
| Eingang  | Haustür                                              | Südwand (6, 13)                                                                                                 | –                                | Holz                                                      | Auslöser `haustuer`, Start (6, 12) mit Blick nach oben                   |

**Bezug zu anderen Karten:** Die Haustür liegt bei 27 % der Breite in der Südwand wie außen in der
Fassade (Spalte 3 von 11). Die Treppe in der Nordwestecke liegt unter der Bodenöffnung des
Dachbodens (ebenfalls Nordwestecke). Die Küche liegt im Osten; außen zeigt die Ostseite des Hauses
das Küchenfenster zum Nachbarhaus.

### 4.2 bis 4.5

Dachboden, Außen, Clubraum und Park folgen nach demselben Muster, sobald der Autor das Muster
gesehen hat.
