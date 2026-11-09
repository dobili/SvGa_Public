# Regelwerk für Karten des Schach-Abenteuers

Stand: 9.11.2026. Abgeleitet aus allen Rückmeldungen des Autors zu den Kartenrunden 1 bis 3 (Wortlaut
in `docs/spiel/ENTSCHEIDUNGEN.md`). Gilt für jede Karte; der Kartenbauer prüft, was sich prüfen lässt
(markiert mit **[auto]**), den Rest die Bildprüfung. Ergänzungen kommen hierher, nicht in Einzelaufträge.

## 1. Grundsatz

Jede Karte muss als echter Ort glaubwürdig sein. Vor dem Bau steht das **Ortsprofil**
(`inhalte/abenteuer/ortsprofile.json`: Zweck, Epoche, Wohlstand, Stil, erlaubter Zustand, Nachbarschaft)
und eine ausführliche Szenenbeschreibung. Nur Bilder aus dem **Katalog** (`register/katalog.json` im
privaten Repository) werden verbaut; ihre Angaben steuern die Regeln.

## 2. Räume, Wände, Türen

1. Jeder Raum hat eine Funktion (Wohnen, Küche, Bad, Schlafen, Büro, Schule, Lager …). Möbel einer
   anderen Funktion gehören nicht hinein (keine Küchenzeile im Wohnzimmer, außer das Ortsprofil sagt
   „Einzimmerwohnung“). **[auto]** über `raumfunktion` im Katalog.
2. Jede Öffnung in einer Wand ist entweder eine Tür (Bild) oder ein bewusster Durchgang (Bogen,
   Türrahmen); keine nackten Lücken. Innerhalb einer Wohnung sind offene Durchgänge ohne Türbild
   erlaubt, wenn die Wand daneben sauber endet (Abschnitt 8); Außentüren und Türen zu fremden
   Räumen sind immer Türbilder. Ausgangstüren liegen auf der Wand, durch die man den Raum verlässt.
3. Nichts steht in einer Wand: Möbel stehen mit dem Fuß auf Boden vor der Wand. **[auto]**
4. Treppen führen in die richtige Richtung: vom Dachboden nach unten, vom Erdgeschoss nach oben;
   der Antritt ist frei. **[auto]** über `treppe` (auf/ab) im Katalog.
5. Fenster an Außenwänden; Gardinen hängen **vor** dem Fenster (gezeichnet darüber). **[auto]** über
   `befestigung: ueber` und Reihenfolge.
6. Wandschmuck überlappt nichts (Pinnwand nicht hinter Automat oder Maschine). **[auto]**

## 3. Möbel: Zustand, Stil, Wiederholung

1. Zustand passt zum Ort: kaputt oder verwittert nur, wo das Ortsprofil es erlaubt (Dachboden mit
   Gerümpel, Ghost Town, Turnhalle nach dem Sturm). **[auto]**
2. Ein Stil je Ort, passend zu Epoche und Wohlstand (Villa gehoben, Reihenhaus einfach). **[auto]**
3. Gleichartiges ist gleich groß und gleich gestaltet (alle Waschmaschinen gleich, Stuhlpaare gleich).
4. Blickfänge (Globus, Pokal, Ritterrüstung) sparsam und nur, wo sie hingehören; nicht jedes Bild
   überall. **[auto]** über `einzigartig` im Katalog: höchstens einmal je Ort.
5. Lieber weniger, dafür stimmig; aber nicht karg: bewohnte Räume haben Kleinkram und Spuren von Leben.
   Kleinkram steht auf Ablagen; am Boden nur, was dort hingehört (Schuhe, Skateboard, Hanteln,
   Kartons beim Umzug).

## 4. Beziehungen und Ausrichtung

1. Stühle stehen an Tischen, Sitzfläche zum Tisch; gleiche Stühle um einen Tisch. **[auto]**
2. Fernseher stehen auf einem Lowboard oder Fernsehtisch an der Wand (oder hängen an der Wand,
   dann ohne Möbel davor), nicht neben der Eingangstür; davor mit Abstand Sitzplätze mit Blick zu ihm.
   **[auto]** teilweise.
3. Was „auf“ etwas steht, steht ganz auf dessen Ablagefläche (Globus auf Pult, Pokal auf Anrichte,
   Brett auf Tisch), nie daneben, darüber oder schwebend. **[auto]** über `ablage` im Katalog.
4. Pflanzen und Stehlampen in Ecken, an Wänden, an Durchgängen oder direkt neben passenden Möbeln
   (Lampe neben Sessel oder Schreibtisch). **[auto]**
5. Möbel mit Vorderseite (Schubladen, Türen, Bildschirme, Geräte) zeigen in den Raum, nicht zur
   Wand; Sofas zeigen zu Fernseher oder Couchtisch. **[auto]** über `blick`.
6. Reihen (Waschmaschinen, Spinde, Regale) stehen lückenlos nebeneinander an einer Wand.
7. Nichts verdeckt eine Figur oder einen Auslöser. **[auto]**

## 5. Außen: Straßen, Wege, Grundstücke

1. Straßen und Wege laufen bis zum Kartenrand oder zu einem Ziel (Tür, Platz, Kreuzung), nie ins Leere.
   **[auto]**
2. In Städten liegen Gehwege beidseitig an Straßen, mit Bordstein auf beiden Seiten. In Dörfern,
   auf Höfen und über Land gibt es weiche Erdwege ohne Gehweg (Abschnitt 9).
3. Jedes Haus hat einen Weg von der Tür zur Straße oder zum Gehweg (Wohnblocks und Läden an einem
   Platz öffnen direkt auf den Platz); Wohnhäuser haben Vorgarten und
   Zaun oder Hecke um das Grundstück, je nach Ortsprofil. Häuser stehen an der Straße.
4. Nachbarschaft nach Ortsprofil: Wohnhäuser neben Wohnhäusern; Industrie oder Gewerbe nur, wo die
   Geschichte es sagt. Villa mit großem Garten.
5. Außen und innen passen zusammen: Größe, Stil und Wohlstand des Hauses draußen entsprechen den
   Innenkarten. Türbild passt zum Gebäude.
6. Hindernisse auf Wegen nur, wenn die Geschichte es will (Baumstümpfe stehen neben, nicht auf dem Weg).
7. Straßenmöbel: Laternen direkt an Weg oder Straße; Bänke am Weg, zum Weg gewandt (oder vom Weg weg
   zu einer Aussicht, dann direkt am Weg und mit etwas zu sehen); Bushaltestelle zur Straße;
   Blumenkästen parallel zum Weg, gern am Zaun oder an der Fassade, auch auf dem Gehweg wie
   beim Zeichner (Abschnitt 9), aber nie über die ganze Breite: Es bleibt immer mindestens eine Kachel
   zum Vorbeigehen frei; Mülleimer und Kästen nur mit erkennbarem
   Zweck (Stromkasten an der Ecke, Mülltonne am Haus).
8. Schilder: Wegweiser mit mehreren Richtungen nur an Kreuzungen; Schilder tragen erkennbaren,
   passenden Inhalt (keine Autobahntafel „SALE“ in der Kleinstadt); Text zum Betrachter oder zum Weg.

## 6. Natur und Wasser

1. Gras und Böden mit Abwechslung, keine sichtbare Wiederholung; keine unbegründeten Streifen oder
   Flächen ohne Textur. **[auto]** Varianten.
2. Bäume in Wohngebieten gepflanzt (Alleen in gleichem Abstand, Vorgärten, symmetrisch); in Wald und
   Wildnis natürlich in Gruppen. Flora abwechslungsreich (Bäume, Büsche, Blumen, Gräser, Steine).
3. Felder reichen bis zum Rand (wirken größer); Gerät am Feldrand oder an der Einfahrt, nicht mitten im
   Feld.
4. Gewässer: große Gewässer (Fluss, See, Meer) reichen bis zum Kartenrand; nur Teiche sind rundum
   geschlossen. Ufer mit Rand. **[auto]** Ränder.
5. Stege beginnen am Ufer und ragen ins Wasser; Brücken verbinden zwei Ufer.
6. Pflanzen und Gegenstände müssen als solche erkennbar sein (keine „grünen Säulen“).

## 7. Bilder (Katalog)

1. Nur ganze Gegenstände; Bauteile nur zusammen mit ihren Gegenstücken. **[auto]**
2. Schatten: die Fassung mit halbdurchsichtigem Schatten (`*_Black_Shadow_*`), nie den grauen
   Festschatten, der nur auf einem Boden passt. **[auto]**
3. Jedes Bild ist im Katalog beschrieben, bevor es verbaut wird.

## 7a. Maßstab und Laufzeiten (nach dem Vorbild Pokémon)

Wunsch des Autors (9.11.2026): Die Größenverhältnisse folgen den Pokémon-Spielen der Generationen 1
bis 3 (Rot/Blau, Gold/Silber/Kristall, Rubin/Saphir/Smaragd). Deren Karten sind aus den
Disassemblies genau bekannt (7a.1); ein Schritt ist dort eine Kachel von 16 Pixeln, wie bei uns.
Unser Held läuft 3,5 Kacheln je Sekunde, das Fahrrad 7; in Pokémon sind es 3,75 beim Gehen, 7,5 beim
Rennen oder Fahrrad (Gen 1 und 3) und bis 15 mit dem Mach-Rad (Gen 3). Die Pokémon-Kamera zeigt
10 × 9 Schritte (Game Boy) oder 15 × 10 (Game Boy Advance); unsere zeigt 8 × 15 (Hochformat) oder
17 × 8 (Querformat), also etwa gleich viel. Deshalb übernehmen wir die Maße fast eins zu eins.

### 7a.1 Quellen: Kartenmaße in Pokémon

Maße in Schritten (= Kacheln), Breite × Höhe. Gen 1 und 2 geben die Größe in Blöcken zu 2 × 2
Schritten an (hier umgerechnet), Gen 3 direkt in Schritten (Metatiles). Durchquerung: längere Seite
bei 3,75 Schritten je Sekunde, ohne Kämpfe und Umwege.

| Kartenart                     | Beispiele (Spiel, Kennung im Quellcode)                                                                                                     | Breite × Höhe                                                      | Durchquerung |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------ |
| Kleine Startstadt             | Rot: `PALLET_TOWN`, `LAVENDER_TOWN`; Kristall: `NEW_BARK_TOWN`; Smaragd: `LITTLEROOT_TOWN`, `OLDALE_TOWN`                                   | 20 × 18, 20 × 18, 20 × 20                                          | 5 s          |
| Mittlere Stadt                | Rot: `VIRIDIAN_CITY`, `PEWTER_CITY`; Kristall: `VIOLET_CITY`, `GOLDENROD_CITY`; Smaragd: `PETALBURG_CITY`                                   | 40 × 36, 40 × 36, 30 × 30                                          | 8–11 s       |
| Große Stadt                   | Rot: `CELADON_CITY`; Smaragd: `RUSTBORO_CITY`, `SLATEPORT_CITY`, `LILYCOVE_CITY`                                                            | 50 × 36, 40 × 60, 40 × 60, 80 × 40                                 | 13–21 s      |
| Kurze Route                   | Rot: `ROUTE_1`, `ROUTE_22`; Kristall: `ROUTE_31`; Smaragd: `ROUTE101`                                                                       | 20 × 36, 40 × 18, 40 × 18, 20 × 20                                 | 5–11 s       |
| Mittlere Route                | Rot: `ROUTE_2`, `ROUTE_3`; Kristall: `ROUTE_29`, `ROUTE_30`; Smaragd: `ROUTE102`, `ROUTE104`                                                | 20 × 72, 70 × 18, 60 × 18, 20 × 54, 50 × 20, 40 × 80               | 13–21 s      |
| Lange Route                   | Rot: `ROUTE_4`, `ROUTE_12`, `ROUTE_17`, `ROUTE_20`; Kristall: `ROUTE_32`; Smaragd: `ROUTE110`, `ROUTE119`                                   | 90 × 18, 20 × 108, 20 × 144, 100 × 18, 20 × 90, 40 × 100, 40 × 140 | 24–39 s      |
| Wohnhaus (Erdgeschoss)        | Rot: `REDS_HOUSE_1F`; Kristall: `PLAYERS_HOUSE_1F`; Smaragd: `LITTLEROOT_TOWN_BRENDANS_HOUSE_1F`                                            | 8 × 8, 10 × 8, 11 × 9                                              | 2–3 s        |
| Labor                         | Rot: `OAKS_LAB`; Kristall: `ELMS_LAB`                                                                                                       | 10 × 12                                                            | 3 s          |
| Pokécenter                    | Rot: `VIRIDIAN_POKECENTER`; Kristall: `CHERRYGROVE_POKECENTER_1F`; Smaragd: `POKEMON_CENTER_1F`                                             | 14 × 8, 10 × 8, 14 × 9                                             | 3–4 s        |
| Laden                         | Rot: `VIRIDIAN_MART`; Kristall: `CHERRYGROVE_MART`; Smaragd: `MART`                                                                         | 8 × 8, 12 × 8, 11 × 8                                              | 2–3 s        |
| Arena                         | Rot: `PEWTER_GYM`, `CERULEAN_GYM`; Kristall: `VIOLET_GYM`; Smaragd: `RUSTBORO_CITY_GYM`                                                     | 10 × 14, 10 × 16, 11 × 20                                          | 4–5 s        |
| Mehrstöckiges Gebäude (Etage) | Rot: `CELADON_MART_1F`, `SILPH_CO_1F`; Kristall: `GOLDENROD_DEPT_STORE_1F`, `SPROUT_TOWER_1F`; Smaragd: `LILYCOVE_CITY_DEPARTMENT_STORE_1F` | 20 × 8, 30 × 18, 16 × 8, 20 × 16, 18 × 8                           | 4–8 s        |
| Wald                          | Rot: `VIRIDIAN_FOREST`; Kristall: `ILEX_FOREST`; Smaragd: `PETALBURG_WOODS`                                                                 | 34 × 48, 30 × 54, 48 × 44                                          | 13–14 s      |
| Höhle (eine Etage)            | Rot: `MT_MOON_1F`, `ROCK_TUNNEL_1F`; Kristall: `UNION_CAVE_1F`; Smaragd: `GRANITE_CAVE_1F`, `RUSTURF_TUNNEL`                                | 40 × 36, 20 × 36, 42 × 15, 36 × 24                                 | 10–11 s      |

Quellen:

- Gen 1: [pret/pokered, `constants/map_constants.asm`](https://github.com/pret/pokered/blob/master/constants/map_constants.asm)
  (Breite und Höhe in Blöcken).
- Gen 2: [pret/pokecrystal, `constants/map_constants.asm`](https://github.com/pret/pokecrystal/blob/master/constants/map_constants.asm)
  (Kommentar im Makro: „width: in blocks“).
- Gen 3: [pret/pokeemerald, `data/layouts/layouts.json`](https://github.com/pret/pokeemerald/blob/master/data/layouts/layouts.json)
  (Breite und Höhe in Metatiles = Schritten).
- Gehen und Fahrrad Gen 1: [pret/pokered, `home/overworld.asm`](https://github.com/pret/pokered/blob/master/home/overworld.asm)
  (`wWalkCounter` = 8 Teilschritte je Schritt, `DoBikeSpeedup` verdoppelt).
- Gehen, Rennen, Rad Gen 3: [pret/pokeemerald, `src/event_object_movement.c`](https://github.com/pret/pokeemerald/blob/master/src/event_object_movement.c)
  (`sStepTimes`: 16 Bilder je Schritt beim Gehen, 8 beim Rennen und Surfen, 4 beim Mach-Rad mit
  Höchstgeschwindigkeit; bei etwa 60 Bildern je Sekunde 3,75, 7,5 und 15 Schritte je Sekunde).
- Gen 4 und 5 (Diamant/Perl, Schwarz/Weiß) setzen ihre Welt aus Kartenfeldern von je 32 × 32 Schritten
  zusammen ([DS Pokémon Hacking, Mapping](https://ds-pokemon-hacking.github.io/docs/generation-iv/guides/mapping));
  wie viele Felder eine Stadt oder Route belegt, ließ sich ohne Kartendaten nicht belegen. Diese
  Generationen fehlen deshalb in der Tabelle.

Lesart: Pokémon-Routen sind schmal und lang (20 Schritte breit, also etwa ein bis zwei Bildschirme)
oder breit und flach (18 bis 20 hoch). Städte sind zwei bis sechs Bildschirme groß. Innenräume
passen fast auf einen Bildschirm.

### 7a.2 Entscheidung des Autors: Pokémon mal 1,5 bis 2

Entschieden am 9.11.2026: Die Form folgt Pokémon (schmale, lange Wege; kompakte Städte; große
Städte in Vierteln; Räume auf etwa einem Bildschirm), die Größe ist aber draußen anderthalb- bis
doppelt so groß, weil bei uns keine Kämpfe im hohen Gras das Laufen unterbrechen. Räume sind etwa
anderthalbmal so groß wie bei Pokémon, weil die Möbel von LimeZu größer sind und Räume belebt
wirken sollen. Diese Werte gehen der Tabelle unten (Pokémon eins zu eins) vor:

| Kartenart                                       | Größe in Kacheln                                    | Durchquerung zu Fuß |
| ----------------------------------------------- | --------------------------------------------------- | ------------------- |
| Kleiner Ort (Maple Falls, Cedar Creek)          | 40–60 × 30–40                                       | 12–17 s             |
| Mittlere Stadt (Riverton, Ironwood)             | 60–80 × 50–60                                       | 17–23 s             |
| Große Stadt                                     | Viertel zu je 60–80 × 40–60                         | je 17–23 s          |
| Weg zwischen zwei Orten in Akt 1                | 2 Karten, zusammen 220–280 lang, 20–30 quer         | 65–80 s             |
| Weg ab Akt 2                                    | 2 Karten, zusammen 280–400 lang                     | 80–115 s            |
| Wohnraum, Erdgeschoss einer Wohnung             | 12–16 × 10–13; zwei Räume nebeneinander bis 20 × 13 | 4–6 s               |
| Öffentlicher Raum (Laden, Waschsalon, Clubraum) | 14–20 × 10–14                                       | 4–6 s               |
| Großer Saal (Bibliothek, Turnierhalle)          | 20–30 × 14–20                                       | 6–9 s               |
| Wald, Höhle                                     | 1,5 bis 2 mal die Pokémon-Werte unten               | –                   |

Die Regeln 1 bis 8 unten gelten mit diesen Größen weiter; Abstand der Entdeckungen höchstens etwa
15 Kacheln entlang des Hauptwegs.

### 7a.3 Pokémon eins zu eins (Grundlage)

Unsere Größen (Werte nach dem Vorbild Pokémon)

Bei 3,5 Kacheln je Sekunde dauert alles etwa 7 % länger als in Pokémon. Gemessen wird ohne Umwege
entlang des Hauptwegs.

| Kartenart                                                              | Größe in Kacheln (Breite × Höhe)                | Durchquerung zu Fuß | Bildschirme (Hochformat 8 × 15) |
| ---------------------------------------------------------------------- | ----------------------------------------------- | ------------------- | ------------------------------- |
| Kleiner Ort (Maple Falls, Cedar Creek)                                 | 20–30 × 18–24, als Randkarten höchstens 40 × 24 | 6–10 s              | 3–6                             |
| Mittlere Stadt (Riverton, Ironwood)                                    | 40 × 36 bis 40 × 40                             | 11–12 s             | 10–14                           |
| Große Stadt (Silicon Bay, Capital)                                     | 50 × 36 bis 80 × 40 oder 40 × 60                | 15–23 s             | 15–27                           |
| Kurzer Weg                                                             | 20 × 36 oder 40 × 18                            | 10–12 s             | 5–6                             |
| Mittlerer Weg                                                          | 20 × 54 bis 20 × 72, oder 50–70 × 18–20         | 15–21 s             | 9–12                            |
| Langer Weg                                                             | 20 × 90 bis 20 × 140, oder 90–100 × 18          | 26–40 s             | 15–23                           |
| Wohnraum (Erdgeschoss, Wohnung)                                        | 8–11 × 8–9                                      | 3 s                 | 1                               |
| Öffentlicher Raum (Laden, Café, Waschsalon)                            | 10–14 × 8–9                                     | 3–4 s               | 1–2                             |
| Clubraum, Arena                                                        | 10–11 × 14–20                                   | 4–6 s               | 2                               |
| Großer Saal, Etage eines Großbaus (Bibliothek, Kaufhaus, Turnierhalle) | 16–30 × 8–18                                    | 5–9 s               | 2–4                             |
| Wald                                                                   | 30–48 × 44–54                                   | 13–15 s             | 11–22                           |
| Höhle, Keller mit Gängen (eine Etage)                                  | 20–40 × 15–36                                   | 10–12 s             | 3–12                            |
| Feld, Weide auf einer Außenkarte                                       | größer als ein Bildschirm, bis zum Rand         | –                   | –                               |

Regeln:

1. **Ein Weg zwischen zwei Orten** ist eine Karte, höchstens zwei (wie Pokémon-Routen, die nur
   selten geteilt sind). Zwei Karten nur, wenn die Landschaft wechselt (Landstraße, dann Flussweg);
   zusammen höchstens die Größe eines langen Wegs. Die Länge wächst mit dem Akt: in Akt 1 kurze Wege,
   in Akt 2 mittlere, ab Akt 3 lange.
2. **Form:** Ein Weg ist schmal und lang (18 bis 20 Kacheln quer zur Laufrichtung, also etwa ein
   Hochformat-Bildschirm breit plus Rand) oder breit und flach. Er windet sich innerhalb dieses
   Streifens; quer gibt es Platz für Abzweige von 3 bis 8 Kacheln.
3. **Abzweigungen:** kurzer Weg mindestens eine, mittlerer zwei, langer drei bis vier. Jede endet
   an etwas: Fund, Aussicht, Figur, Tafel, Haus, Steg (Regel 9.6.2). Sackgassen ohne Ziel gibt es nicht.
4. **Entdeckungen:** je Bildschirm (etwa 8 × 15 Kacheln) entlang des Hauptwegs eine Sache zum
   Ansehen oder Mitnehmen (Fund, Statist, Tier, Schild, Aussicht); auf einem Weg dazu zwei bis vier
   Stationen nach W4 (Tafel, Gegner, Figur mit Weisheit, Fund). **[auto]** Abstand zwischen
   Auslösern, Figuren und Belebung höchstens etwa 15 Kacheln entlang des Hauptwegs.
5. **Innenräume** bleiben klein: Wohnräume passen auf einen Bildschirm; was mehr Platz braucht,
   bekommt Räume hinter Türen oder Etagen statt einer größeren Karte.
6. **Städte** sind kompakt: Alles Wichtige eines kleinen Ortes ist in 10 Sekunden zu Fuß erreichbar,
   in einer großen Stadt in 20. Größere Städte bekommen Viertel als eigene Außenkarten statt einer
   Riesenkarte.
7. **Dichte:** Gebäude stehen eng, Wege sind 2 Kacheln breit, Straßen 2 bis 4; Freiflächen sind
   Plätze, Parks, Felder oder Wasser mit Inhalt (Regel 9.9).
8. **Fahrrad** (doppelt so schnell): lohnt sich erst ab mittleren Wegen; kurze Wege sind zu Fuß in
   gut 10 Sekunden durchquert.

**Abweichung vom vorigen Stand (9.11.2026, vormittags):** Dort standen Städte mit 90 bis 140 Kacheln
Breite, Räume mit 16 bis 25 und Wege mit 2 bis 3 Karten zu je 100 bis 150 Kacheln (1,5 bis 2,5
Minuten). Nach dem Vorbild Pokémon sind Städte etwa halb so groß, Räume deutlich kleiner und Wege
etwa so lang wie bisher eine Karte. Unsere heutigen Karten (Cedar Creek außen 44 × 24, Landstraße
34 × 22, Bibliothek 18 × 14, Wohnzimmer 22 × 14) liegen bei Außenkarten im Rahmen, bei Innenräumen
darüber.

## 8. Vorbild: Beispielräume des Zeichners

Abgeleitet aus den fertig eingerichteten Räumen, die LimeZu den Paketen beilegt (privates Repository,
`modern-interiors/6_Home_Designs/*/16x16/*preview*.png` mit `layer_*`: Generic Home, Wohnanlage
(Condominium) 1 und 2, japanisches Haus, Turnhalle 1 und 2, Eisdiele, TV-Studio, Schießstand, Museum
Eingang und Räume 1–4) und den zusammengesetzten Gebäuden aus Modern Exteriors (`*Example*`: Palast,
Bürohaus, Condo 6, Eisenwarenladen). Ganze Straßenszenen liegen den Außenpaketen nicht bei; für außen
gibt es deshalb nur Regeln zu Gebäuden. Kacheln = 16 Pixel; „Reihe“ zählt von oben.

### 8.1 Ebenen und Wände

1. **Zwei Ebenen:** Boden und Wände liegen allein auf Ebene 1; alles andere, auch Teppiche, Türen,
   Fenster und Wandschmuck, auf Ebene 2 (Eisdiele und TV-Studio haben eine dritte für Dinge auf
   Tresen und Licht). _Generic Home:_ `Layer_1` zeigt nur Dielen, Fliesen und Wände.
2. **Nordwand zwei Reihen Wandfläche** mit schmaler heller Kante oben; Seitenwände nur als schmale
   Kante mit Schattenkeil zum Boden. _Generic Home, Wohnanlage, Turnhalle._ (Passt zu 2. und zum
   Kartenbauer.)
3. **Innenwände zwischen zwei Räumen** bekommen auf der Südseite wieder zwei Reihen Wandfläche; der
   Raum darunter hat seine eigene „Nordwand“. _Generic Home:_ der Eingangsraum unten hat eine eigene
   Wandfläche mit zwei Schränken davor; _Museum Raum 2:_ jede Abteilung beginnt mit einer Wand.
4. **Durchgänge zwischen Räumen sind offene Lücken** von 1 bis 3 Kacheln Breite, durch die der
   Boden weiterläuft, ohne Türbild. Türbilder nur dort, wo eine Wohnung, ein Zimmer oder das Haus
   endet. _Generic Home:_ Flur links und rechts und der Gang nach unten offen, eine Tür nur oben;
   _Wohnanlage 2:_ vier Wohnungstüren nebeneinander. **Widerspruch zu 2.2** („keine nackten Lücken“):
   Beim Zeichner sind offene Durchgänge innerhalb einer Wohnung üblich; 2.2 bleibt unverändert.
5. **Türen** sitzen in der Wandfläche, ihre Unterkante auf der Bodenlinie; direkt davor auf der ersten
   Bodenreihe liegt eine Fußmatte, so breit wie die Tür. _Wohnanlage 2:_ jede der vier Türen mit
   eigener Matte; _Turnhalle 2:_ Matte vor dem Durchgang oben rechts. Ausgänge in der Südwand sind eine
   Lücke von 2–4 Kacheln, oft mit Matte davor oder dahinter (_Eisdiele_, _Generic Home_).
6. **Fenster** hängen in der Wandfläche, mittig über einem Möbel oder zwischen zwei Möbeln; Gardinen
   oder Rollos so breit wie das Fenster. _Turnhalle:_ großes Fenster über der Hantelecke;
   _japanisches Haus:_ zwei Schiebefenster je über einer Möbelgruppe; _TV-Studio:_ gestreifte Vorhänge
   links und rechts über den Hockern.

### 8.2 Anordnung und Abstände

1. **Möbel an die Wände, Mitte frei.** Große Stücke (Schrank, Kamin, Regal, Theke, Bett) stehen mit
   dem Rücken an einer Wand; die Raummitte bleibt als Lauffläche frei, mindestens 2 Kacheln breit von
   jedem Eingang aus. _Generic Home:_ Mitte 6 × 3 Kacheln frei; _Eisdiele:_ Gang 3 Kacheln breit von
   der Tür zur Theke; _Museum Raum 3:_ Mittelgang 2 Kacheln.
2. **Symmetrie an der Hauptwand:** Das wichtigste Stück steht mittig, gleiche Stücke links und rechts
   davon im gleichen Abstand. _Generic Home:_ Kamin mittig, je ein Sessel links und rechts, Abstand 0;
   die beiden Kleiderschränke unten spiegeln sich um die Tür. _Eisdiele:_ Speisekarte mittig, je ein
   Eisautomat und ein Herz-Schild links und rechts. _TV-Studio:_ Moderationstisch mittig, Lampen,
   Hocker und Vorhänge gespiegelt. _Museum Eingang:_ Vitrinen gespiegelt um den Eingang.
3. **Gruppen dicht, Gruppen untereinander mit Luft.** Was zusammengehört, steht ohne Lücke
   (Stühle direkt am Tisch, Sessel direkt neben dem Kamin, Hocker direkt an der Theke); zwischen zwei
   Gruppen liegt mindestens 1 Kachel Boden. _Eisdiele:_ Tisch 1 × 2 mit je zwei Stühlen links und
   rechts ohne Abstand, die beiden Gruppen 4 Kacheln auseinander. _Japanisches Haus:_ Sitzkissen direkt
   am niedrigen Tisch. _Schießstand:_ Hocker eine Reihe vor dem langen Tresen.
4. **Reihen gleicher Geräte** stehen in gleichem Abstand nebeneinander: _Turnhalle:_ zwei Laufbänder
   mit 1 Kachel Abstand, drei Boxsäcke in gleichem Abstand an der Nordwand; _Schießstand:_ vier
   Bahnen, je Monitor und Scheibe übereinander; _Museum Raum 1:_ drei Vitrinen mit je einem Lesepult
   rechts daneben.
5. **Blickrichtung:** Sitzende schauen zur Mitte der Gruppe (Stühle zum Tisch, Publikumsstühle im
   TV-Studio zum Moderationstisch, 3 Reihen davor). Sitzplätze vor einem Blickziel stehen 2–4 Kacheln
   entfernt. _TV-Studio:_ Zuschauerstühle 3 Reihen vor dem Tisch; _Generic Home:_ Teppich 1 Reihe vor
   dem Kamin, dahinter frei.
6. **Belegung:** Ebene 2 belegt (mit Teppichen und Wandschmuck, gemessen an allen Kacheln des Raums
   einschließlich Wände) bei Wohnräumen 39–54 % (Wohnanlage 39–41 %, Generic Home 46 %, japanisches
   Haus 54 %), bei Läden und Hallen 51–59 % (Eisdiele 58 %, Museum 52–59 %, Turnhalle 57 %), bei
   Studios und Fluren 33–41 % (TV-Studio 38 %, Schießstand 41 %, Museum Raum 1 33 %). Ohne Teppiche und
   Wandschmuck ist etwa ein Drittel der Bodenkacheln mit Möbeln belegt.

### 8.3 Pflanzen, Lampen, Wandschmuck

1. **Pflanzen** stehen an Durchgängen (je eine links und rechts), in Raumecken oder in Lücken
   zwischen Möbeln an der Wand; nie frei im Raum. _Generic Home:_ je eine Pflanze an den Fluren links
   und rechts, je eine in den unteren Ecken des Eingangs; _Wohnanlage 2:_ Pflanzen zwischen den Türen
   und in den Ecken unten; _japanisches Haus:_ zwei Bonsai rechts und links im Eingang. (Passt zu 4.4.)
2. **Lampen:** In Wohnräumen kleine Lampen auf Ablagen (Beistelltisch, Kommode) oder Wandleuchten an
   den Seitenwänden der Flure; Stehlampen kommen in keinem Beispiel vor. _Generic Home:_ Lampe mit
   Büchern auf dem Beistelltisch, Wandleuchten in beiden Fluren. _TV-Studio:_ Strahler als Reihe in der
   obersten Wandflächenreihe, Scheinwerfer auf Stativen in den Ecken.
3. **Wandschmuck** sitzt ganz in der Wandfläche, mittig über einem Möbel, zwischen zwei Möbeln oder in
   gleichen Abständen; Schilder mit Text gehören zur Funktion des Raums. _Museum Raum 1:_ Bilder mit
   Schildchen darunter und Lesetafeln dazwischen; _japanisches Haus:_ zwei Rollbilder links und rechts
   vom runden Fenster; _Eisdiele:_ Herz-Schilder und Löffel über den Automaten.

### 8.4 Teppiche, Stile, Kleinkram

1. **Teppiche** liegen rechteckig auf dem Raster, unter oder direkt vor einer Gruppe, nie unter
   Schränken an der Wand; sie ragen höchstens 1 Kachel über die Gruppe hinaus. _Generic Home:_ 2 × 2 vor
   dem Kamin, ein zweiter neben dem Etagenbett; _japanisches Haus:_ Tatami-Matten unter jeder
   Sitzgruppe, je 1 Kachel größer als der Tisch; _Turnhalle:_ Gummimatten unter den Gewichtsbänken.
2. **Eine Möbelserie je Raum:** gleiche Farbe und gleiches Material, Paare identisch. _Generic Home:_
   alles Holz in einem Ton, zwei gleiche Schränke, zwei gleiche Sessel; _Eisdiele:_ alles rosa-weiß;
   _TV-Studio:_ weiß-blau; _Museum:_ Vitrinen und Pulte aus derselben Serie. (Passt zu 3.2 und 3.3.)
3. **Kleinkram** liegt auf Ablagen (Bücher und Lampe auf dem Beistelltisch, Vase auf der Kommode,
   Becher auf der Theke), in Gruppen von 2–3 Stück. Am Boden nur, was dort hingehört und höchstens 1–2
   Stück je Wohnraum: _Generic Home:_ Hut und Skateboard vor dem Etagenbett (Kinderzimmer);
   _Turnhalle:_ Hanteln und Bälle neben den Geräten. **Ergänzung zu Prüfliste 2** („nichts liegt
   unpassend am Boden“): Der Zeichner legt wenige passende Dinge bewusst auf den Boden; die Regel bleibt.

### 8.5 Gebäude außen (Beispiele aus Modern Exteriors)

1. **Eingang mittig in der Fassade**, davor Stufen oder eine Treppe in Türbreite, die bis auf den
   Gehweg reicht. _Palast:_ Säulenportal mittig, Treppe 6 Kacheln breit, Laternenpfosten links und
   rechts der Treppe; _Bürohaus „G-Neric Corp“:_ Glastür mittig unter dem Firmenschild.
2. **Schild und Name über der Tür**, nicht daneben. _Bürohaus, Eisenwarenladen_ (Markise über den
   Schaufenstern).
3. **Bank direkt an der Fassade neben der Tür**, Sitzfläche zum Gehweg. _Condo 6:_ Bank zwischen
   Haustür und Garagentor.

### 8.6 Was der Kartenbauer prüfen könnte (Vorschlag für `kartenregeln.py`)

- **Belegung:** Anteil der Bodenkacheln unter Möbeln mit Kollision 20–45 %, darunter „karg“, darüber
  „vollgestellt“ (Messung wie 8.2.6).
- **Freier Gang:** von jedem Eingang ein Weg von 2 Kacheln Breite bis in die Raummitte (Breitensuche
  mit Abstandsprüfung).
- **Möbel an der Wand:** große Möbel (`art` schrank, regal, bett, theke, kamin) berühren mit der
  Rückseite eine Wand.
- **Gruppen:** Stühle und Hocker grenzen ohne Lücke an ihren Tisch (`zu`); zwischen zwei Gruppen
  mindestens 1 Kachel Boden.
- **Blickabstand:** Sofa und Sessel mit `zu` auf Fernseher oder Kamin stehen 2–4 Kacheln davor.
- **Matte vor Tür:** vor jeder Tür `an_wand` die Kachel darunter frei; Hinweis, wenn dort keine Matte
  liegt.
- **Wandschmuck mittig:** Bilder und Fenster über einem Möbel stehen mit ihrer Mitte höchstens
  4 Pixel neben dessen Mitte.
- **Teppich:** jeder Teppich überlappt eine Gruppe (Tisch, Sofa, Bett) oder liegt direkt davor und
  ragt höchstens 1 Kachel darüber hinaus; nie unter `art` schrank oder regal.
- **Paare gleich:** Stühle an einem Tisch und gespiegelte Paare an einer Wand benutzen dieselbe
  Möbelserie (gleicher Schlüssel bis auf die Blickrichtung).
- **Kleinkram am Boden:** Einträge mit `art` deko und Höhe 16 nur auf einer Ablage (`auf`), außer der
  Ort erlaubt Bodenkram (Kinderzimmer, Turnhalle).

Nur mit der Bildprüfung zu beurteilen: Symmetrie an der Hauptwand, ob Wandschmuck zur Funktion passt,
Stil einer Möbelserie.

## 9. Vorbild: Szenen aus dem Netz

Stand: 9.11.2026 (mittel-2). Abgeleitet aus den Beispielszenen, die LimeZu selbst mit seinen Paketen
zusammengesetzt hat (Verkaufsseiten auf itch.io). Spiele mit nachweislich verwendeter LimeZu-Grafik
fanden sich kaum: ein Steam-Titel mit Inhalten nur für Erwachsene (nicht verwendet), ein Spiel ohne
Nennung der Grafik (nicht verwendet). Die Szenen des Herstellers sind deshalb das Vorbild. Es werden
nur Regeln übernommen, keine Bilder; nichts davon liegt im Repository.

### 9.1 Quellen

| Kürzel | Seite                                                          | Bild (Link)                                                                                                | Inhalt                                                    |
| ------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| E1     | [Modern Exteriors](https://limezu.itch.io/modernexteriors)     | [Haus mit Garten](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi84ODI2NDUxLmdpZg==/original/srsSOL.gif)          | Einfamilienhaus, Zaun, Gehweg, Bushaltestelle             |
| E2     | Modern Exteriors                                               | [Straße mit Zebrastreifen](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi84NDQ0NjcwLmdpZg==/original/2NrZRf.gif) | Kreuzungsbereich, Bordstein, Ampel, Baumscheiben, Bänke   |
| E3     | Modern Exteriors                                               | [Wohnblocks und Parkplatz](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi83NzMxMTU1LmdpZg==/original/ZK4jma.gif) | Plattenplatz, Hauseingänge, Hecken mit Pollern, Parkreihe |
| E4     | Modern Exteriors                                               | [Spielplatz im Block](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi83NzMxMTU0LmdpZg==/original/1Wl0qu.gif)      | Park als Rasenfeld mit Baumreihe, Laternen                |
| E5     | Modern Exteriors                                               | [Einkaufszentrum](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi84NzA0NjM5LmdpZg==/original/NhCQ8G.gif)          | Vorplatz, Pflanzkübel, Einfahrt Tiefgarage, Ampel         |
| E6     | Modern Exteriors                                               | [Flohmarkt am Platz](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi83ODA1MzY0LmdpZg==/original/i4NAk%2F.gif)     | Pflasterplatz, Brunnen, Bänke, Laternen                   |
| E7     | Modern Exteriors                                               | [Kreuzung mit Ampel](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi83NzMxMTU2LmdpZg==/original/%2Bg7p3a.gif)     | Haltelinie, Zebrastreifen, Ampelmast an der Ecke          |
| E8     | Modern Exteriors                                               | [Steg im See](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi85NjMxNzg3LmdpZg==/original/RpT5UX.gif)              | Holzsteg, Pfähle, Boot                                    |
| E9     | Modern Exteriors                                               | [Wohnwagen am Waldrand](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi85OTEyMzE0LmdpZg==/original/%2B73hqN.gif)  | Lichtung, Pfade, Picknicktisch, Teich am Rand             |
| E10    | Modern Exteriors                                               | [Basketballplatz](https://img.itch.zone/aW1hZ2UvMTMyOTQyNi8xMDc5NzYyNy5naWY=/original/9jJhcs.gif)          | Sportplatz im Wald, Bänke, Flutlicht                      |
| F1     | [Modern Farm](https://limezu.itch.io/modernfarm)               | [Markt und Scheune](https://img.itch.zone/aW1hZ2UvMzM1NDAxNC8zMTY2ODQxNS5naWY=/original/pHbX0m.gif)        | Feldweg, Marktstände, Weide mit Zaun, Hundehütte          |
| F2     | Modern Farm                                                    | [Hof mit Gemüsegarten](https://img.itch.zone/aW1hZ2UvMzM1NDAxNC8zMTY2ODQxNC5naWY=/original/zutQCy.gif)     | Beete im Zaun, Hühnerstall, Traktor, Baumgruppen          |
| F3     | Modern Farm                                                    | [Bauernhaus im Wald](https://img.itch.zone/aW1hZ2UvMzM1NDAxNC8zMTY2ODQxMi5naWY=/original/D1nuDA.gif)       | Hofplatz, Brunnen, eingezäunte Felder                     |
| F4     | Modern Farm                                                    | [Feld, Palmen, Strand](https://img.itch.zone/aW1hZ2UvMzM1NDAxNC8zMTY2ODQxMS5naWY=/original/mgaZs5.gif)     | Feld mit Eckpfosten, Plantage, Strand und Meer            |
| F5     | Modern Farm                                                    | [Käserei und Silo](https://img.itch.zone/aW1hZ2UvMzM1NDAxNC8zMTY2ODQxMy5naWY=/original/fHV08S.gif)         | Teich mit Sandufer, Pferche                               |
| S1     | [Serene Village](https://limezu.itch.io/serenevillagerevamped) | [Dorf am Wasser](https://img.itch.zone/aW1nLzQ5ODA4NTAuZ2lm/original/edO3Z6.gif)                           | Häuser mit Zaun, Dorfstraße, Brücke, Steg, Strand, Teiche |

### 9.2 Straßen, Gehwege, Bordsteine (Stadt)

1. Eine Fahrbahn hat auf jeder Seite eine durchgehende Bordsteinkante, dahinter den Gehweg; die
   Kante läuft ohne Lücke bis zum Kartenrand oder bis zur Kreuzung. Beispiel: E2, beide Seiten der
   Straße. **[auto]** Kante neben jeder Fahrbahnkachel.
2. Fahrbahnen haben eine Mittellinie (gestrichelt), die an Kreuzungen und Zebrastreifen aussetzt.
   Beispiel: E2, E7.
3. Zebrastreifen liegen quer zur Fahrbahn, verbinden zwei Gehwege und haben an beiden Enden eine
   Ampel oder ein Schild am Bordstein. Beispiel: E2 (Ampel oben und unten), E7.
4. An Kreuzungen biegt der Bordstein um die Ecke; Ampelmasten stehen auf der Ecke des Gehwegs, nicht
   auf der Fahrbahn. Beispiel: E7.
5. Parkplätze liegen als markierte Buchten an der Fahrbahn, mit „P“ und Trennstrichen; der Gehweg
   bleibt davor frei. Beispiel: E3 (Parkreihe), E5.
6. Gehwege sind breiter als ein Feld (meist zwei bis vier), einheitlich gepflastert; Beläge wechseln
   nur an Grundstücks- oder Platzgrenzen. Beispiel: E1 (heller Plattenbelag vor dem Grundstück), E3.

### 9.3 Grundstücke und Häuser

1. Ein Wohngrundstück ist ringsum eingefasst (Zaun, Gitter oder Hecke), mit genau einer Pforte zur
   Straße; die Pforte hat zwei Pfosten und der Weg führt von ihr gerade zur Haustür. Beispiel: E1
   (Gitterzaun, Pforte unten links), S1 (Holzzaun mit Lücke vor der Tür).
2. Neben der Pforte, außerhalb des Zauns: Briefkasten; am Zaun entlang: Mülltonnen; beides auf der
   Grundstücksseite des Gehwegs, nie mitten darauf. Beispiel: E1 (Briefkasten links, Tonnen am Zaun),
   S1 (roter Briefkasten am Weg).
3. Links und rechts der Haustür stehen Blumenkästen oder Kübel, symmetrisch. Beispiel: S1 (alle
   Häuser), E3 (Bäume in Kübeln links und rechts der Eingänge).
4. In der Stadt öffnen Wohnblocks direkt auf den Gehweg oder Platz, mit Treppenstufen vor der Tür und
   je einer Laterne oder einem Kübel daneben; zwischen Blocks steht ein niedriges Gitter.
   Beispiel: E3.
5. Ein Garten ist belebt und gegliedert: Weg, Rasen, Beete, Spielzeug oder Gartenmöbel in Gruppen,
   nichts frei schwebend auf dem Weg. Beispiel: E1 (Sandkasten, Wippe, Trampolin je auf Rasen).
6. Ein Bauernhaus hat einen großen Hofplatz aus Erde vor Haus und Scheune; Fahrzeuge stehen am Rand
   des Hofplatzes, nahe Haus oder Scheune. Beispiel: F3 (Traktor neben dem Haus), F2.

### 9.4 Straßenmöbel und Schilder

1. Laternen stehen am äußeren Rand des Gehwegs (zur Fahrbahn) oder an Platzecken, in gleichem
   Abstand; nie mitten auf dem Weg. Beispiel: E1 (zwei Laternen an den Ecken), E6 (Laternen ringsum).
2. Straßenbäume stehen in Baumscheiben oder Kübeln am Bordstein, in gleichem Abstand. Beispiel: E2,
   E5 (Kübel links und rechts des Eingangs).
3. Bänke stehen neben Baumscheiben, Hecken oder einem Brunnen, mit der Sitzfläche zum Weg oder zum
   Brunnen; je zwei gegenüber, wenn es einen Mittelpunkt gibt. Beispiel: E2, E6 (Bänke um den Brunnen).
4. Die Bushaltestelle (Wartehäuschen) steht am Bordstein, mit dem Haltestellenschild daneben; die
   offene Seite zeigt zum Gehweg. Beispiel: E1.
5. Hydranten, Ampeln und Verkehrsschilder stehen auf dem Gehweg am Bordstein. Beispiel: E2.
6. Hecken mit Pollern trennen Gehweg und Parkplatz in einer geraden Reihe. Beispiel: E3, E4.
7. Wegweiser stehen dort, wo sich Wege teilen oder ein Weg beginnt (Brücke, Steg, Pforte), nicht
   frei in der Wiese. Beispiel: S1 (Schild an Brücke und Steg).

### 9.5 Plätze und Parks

1. Ein Platz hat einen Mittelpunkt (Brunnen, Denkmal) mit Bänken drumherum; Laternen säumen den
   Rand. Beispiel: E6.
2. Ein Stadtpark ist ein klar begrenztes Rasenfeld mit Kante; Bäume stehen als Reihe an seinem Rand,
   Spielgeräte innen mit Abstand zur Reihe. Beispiel: E4.
3. Sport- und Spielplätze haben einen eigenen Belag mit Linien; Bänke oder Tribünen stehen außen an
   den Längsseiten. Beispiel: E10.

### 9.6 Dorf, Feldwege und Höfe

1. Erdwege im Dorf und auf dem Hof haben unregelmäßige, weiche Ränder mit Grasbüscheln; sie werden
   vor Türen, Ständen und Toren breiter (Vorplatz). Stadtstraßen sind dagegen gerade. Beispiel: F1
   (Weg weitet sich vor Scheunentor und Marktständen), S1 (Dorfstraße gerade, Abzweige zu den Häusern).
2. Jeder Weg endet an einem Ziel (Tür, Tor, Steg, Brücke, Platz) oder am Kartenrand. Beispiel: S1
   (Wege enden an Pforten, Treppe in der Steinmauer, Brücke). Bestätigt 5.1.
3. Wo ein Weg eine Mauer oder einen Hang kreuzt, liegt eine Treppe; die Mauer läuft sonst geschlossen.
   Beispiel: S1 (Treppen in der Steinmauer oben).
4. Felder sind Rechtecke aus Ackerboden in einem eigenen Zaun mit Eckpfosten; mehrere Beete sind
   durch Grasstreifen getrennt; Vogelscheuche oder Sprenger stehen im Beet. Beispiel: F2, F3, F4.
5. Weiden und Pferche haben einen Holzzaun mit Tor; Tränke und Futtertrog stehen innen am Zaun.
   Beispiel: F1 (Kühe, Trog am unteren Zaun).
6. Marktstände stehen in einer Reihe mit der Front zum Weg; Kisten und Fässer gruppieren sich neben
   den Ständen. Beispiel: F1.
7. Kleine Dinge des Hofs (Holzstapel, Leiter am Baum, Brunnen, Hundehütte) stehen am Haus oder an
   Bäumen, nicht frei auf dem Hofplatz. Beispiel: F3 (Brunnen neben dem Haus, Leiter am Baum).

### 9.7 Wasser, Ufer, Stege, Brücken, Strand

1. Ufer haben immer eine Kante (Grasabbruch oder Sandstreifen) zwischen Land und Wasser; das Wasser
   reicht bei See und Meer bis zum Kartenrand. Beispiel: S1, F4. Bestätigt 6.4.
2. Teiche sind rundum geschlossen, mit hellem Rand (Sand oder Stein), und stehen in Gärten oder auf
   Weiden. Beispiel: S1 (zwei Teiche), F5.
3. Ein Strand ist ein Sandstreifen zwischen Gras und Wasser; seine Wasserkante ist gewellt, die
   Graskante gerade oder als kleine Stufe. Beispiel: F4, S1 (Badebucht).
4. Stege beginnen am Ufer, ragen gerade ins Wasser und stehen auf sichtbaren Pfählen; Boote liegen
   längs am Steg. Beispiel: E8, S1 (langer Steg zur Insel). Bestätigt 6.5.
5. Brücken liegen quer zur Wasserrinne, ihre Enden liegen auf beiden Ufern auf; die Bretter laufen
   quer zur Gehrichtung. Beispiel: S1 (Holzbrücke über den Kanal).
6. Steine, Felsen und Schilf stehen am Ufer und auf kleinen Inseln, nicht im offenen Wasser.
   Beispiel: S1.

### 9.8 Bäume und Flora

1. Wald und Waldrand sind dicht: Bäume überlappen in mehreren Reihen und schließen den Kartenrand ab.
   Beispiel: F3 (Nadelwald hinter dem Haus), S1 (Wald links), E9.
2. Zwischen Bereichen eines Hofs stehen Baumgruppen aus drei bis sechs Bäumen als Trenner, nicht
   einzelne Bäume in gleichem Abstand. Beispiel: F2 (Gruppe zwischen Scheune und Stall).
3. In der Stadt dagegen gepflanzt und geordnet: Kegelbäume als Reihe, Bäume in Kübeln, symmetrisch
   zu Eingängen. Beispiel: E3, E4. Bestätigt 6.2.
4. Obstbäume stehen beim Haus oder als Obstgarten in Reihen, mit Kiste oder Leiter. Beispiel: F2,
   F1 (Orangenbäume mit Kisten).
5. Kleinflora (Blumen, Pilze, Steine, Baumstümpfe) in Grüppchen von zwei bis fünf am Rand von Wegen,
   an Zäunen und unter Bäumen; nie auf dem Weg. Beispiel: S1, F3, E9.

### 9.9 Dichte

1. Szenen sind dicht belegt: Auf etwa jedem zweiten bis dritten Feld außerhalb der Wege steht etwas
   (Pflanze, Möbel, Gegenstand, Figur); freie Flächen sind Wege, Plätze, Rasen eines Parks oder
   Hofplatz. Beispiel: E1, F1, S1.
2. Freie Flächen haben trotzdem Belag mit Abwechslung (Grasbüschel, Blumen, Steinchen). Beispiel: S1,
   E9. Bestätigt 6.1.

### 9.10 Widersprüche zu bestehenden Regeln (nicht geändert)

1. **5.7 „Blumenkästen nie auf dem Gehweg“:** In E1 stehen Blumenkästen auf dem Gehweg direkt am
   Grundstückszaun, in E5 Pflanzkübel in Reihen auf dem Vorplatz. Beides lässt den Gehweg frei, weil
   sie an der Grundstücksgrenze bzw. auf einem breiten Platz stehen. Vorschlag zur Klärung: „nie
   mitten auf dem Gehweg; an Zaun oder Hauswand oder auf breiten Plätzen erlaubt.“
2. **5.3 „Jedes Haus hat einen Weg von der Tür zur Straße“:** Wohnblocks in E3 haben keinen eigenen
   Weg; die Tür öffnet direkt auf den gepflasterten Platz. Das passt zur Regel, wenn der Platz als
   Gehweg gilt.
3. **5.2 „Gehwege beidseitig an Straßen“:** In F1 und S1 (Dorf, Hof) haben Erdwege keine Gehwege und
   keine Kanten; die Regel gilt nur für Stadtstraßen.

## 10. Regeln aus der Rückmeldung des Autors zu Runde 4 (9.11.2026)

Der Autor hat alle 14 Karten von Akt 1 angesehen. Die Fehler kamen immer wieder; deshalb gelten sie
jetzt als Regeln für alle Karten. Die Bildprüfung geht diese Liste Punkt für Punkt durch. Was das
Werkzeug erledigt, steht dabei; daran arbeiten die Helfer nicht vorbei.

### 10.1 Zeichnung (Werkzeug, Haupt-Chat)

1. **Ränder durchgehend.** Wege, Ufer und Beläge haben überall ihre Randkacheln, auch an inneren
   Ecken und schrägen Anschlüssen; kein blaues oder erdiges Feld stößt ohne Rand an Gras.
2. **Bis an den Kartenrand.** Wege, Flüsse, Zäune und Gleise, die die Karte verlassen, sind bis in
   die letzte Spalte oder Reihe gezeichnet.
3. **Übergänge zwischen Belägen ohne Grasnaht.** Trampelpfad an Pflaster, Erde an Asphalt: Der
   Rand eines Belags (die abgerundete Graskante) gibt es nur zum Gras hin, nie zwischen zwei
   Belägen.
4. **Wasser lebt.** Wasser bekommt Struktur (Wellen, Glanz, Varianten), keine einfarbige Fläche.
5. **Kein grauer Schleier.** Möbel mit dem deckenden grauen Schatten von LimeZu bekommen den
   durchscheinenden Schatten (Black_Shadow-Fassung oder `werkzeuge/schatten.py`); die Bildprüfung
   meldet jeden grauen Festschatten.
6. **Brücken und Stege sind Bauwerke.** Unter einer Brücke läuft das Wasser mit Ufer weiter; die
   Brücke selbst ist ein Brücken- oder Stegbild aus dem Katalog (Bohlen, Geländer, Pfosten), keine
   Bodenfläche aus Dielen auf Gras.

### 10.2 Türen und Durchgänge

7. **Ausgänge haben Türen.** Wo ein Raum ins Freie oder in ein anderes Gebäude führt, steht eine
   Tür (Bild aus dem Katalog), keine Lücke in der Wand. Offene Durchgänge innerhalb einer Wohnung
   bleiben erlaubt (Abschnitt 9.10).
8. **Fußmatten liegen direkt vor der Tür**, innen auf dem ersten Feld vor der Schwelle.
9. **Außen passen Tür und Fassade.** Eine Tür ersetzt nie ein gezeichnetes Fenster der Fassade; das
   Gebäudebild muss eine Türstelle haben oder eine Fassung mit Tür sein. Laternen, Stufen und Schilder
   am Eingang stehen symmetrisch zur Tür.

### 10.3 Möbel: Bild passt zur Stelle

10. **Wandbilder hängen auf Wandhöhe.** Schwarze Bretter, Tafeln und Bilder sitzen mit ihrer
    Oberkante deutlich unter der Wandkrone (mindestens 4 Pixel Abstand), nie bündig an der Decke.
11. **Was auf einem Tisch steht, steht auf der Platte.** Die Unterkante des Gegenstands liegt auf der
    Tischplatte, nicht darüber (schwebende Statue) und nicht auf der Zarge.
12. **Tische für Aufbauten sind leer.** Wer etwas auf einen Tisch stellt (Schachbrett, Lampe),
    nimmt ein Tischbild ohne eigenen Inhalt; kein Brett auf einem Buch, keine Lampe auf einem
    Bücherstapel.
13. **Kleine Dinge gehören auf Möbel.** Globus, Lampe für den Tisch, Fernseher mit Standfuß, Radio
    und Pflanzen im Topf in Tischgröße stehen auf Tisch, Kommode oder Anrichte. Fernseher an der Wand
    nur als Wandfernseher (Bild ohne Fuß).
14. **Küchenzeilen sind zusammenhängend.** Arbeitsplatten, Herd und Spüle bilden eine lückenlose
    Zeile; über und hinter dem Herd hängt nichts Brennbares (kein Bild, kein Regal mit Büchern).
15. **Fenster bleiben frei.** Hohe Möbel (Schränke, Regale, Hochschränke) stehen nicht vor
    Fenstern; niedrige Möbel (Arbeitsplatte, Sofa) dürfen darunter, wenn das Bild sie niedriger als
    die Fensterbank zeigt.
16. **Treppen an der Wand.** Treppen lehnen an einer Wand oder liegen in einer Wandnische;
    freistehend nur mit Geländer auf beiden Seiten und einem Grund im Bühnenbild. Eine Bodentreppe
    zum Dachboden ist eine Luke mit Leiter oder schmaler Stiege, keine Verandatreppe.
17. **Sitzbänke schauen zu dem, was man ansieht**: zum Weg, zum Platz, zum Spielfeld, zum Wasser.
    Wartehäuschen und Bank der Bushaltestelle öffnen sich zur Straße.
18. **Kisten auf dem Boden brauchen einen Grund** in der Geschichte (Einzug, Lager); sonst stehen sie
    nicht herum.

### 10.4 Außen

19. **Straßenlaternen stehen am Straßenrand** (auf dem Gehweg oder direkt daneben), eine Bauart je
    Straßenabschnitt; Lampen in Parks nur an Wegen.
20. **Bäume abwechseln.** Nebeneinander stehende Bäume nutzen mindestens zwei Arten oder gespiegelte
    Fassungen; keine Allee aus lauter gleichen Bildern.
21. **Spielplätze sind eingezäunt**, mit Sand unter Schaukel und Klettergerüst, einem ausgetretenen
    Pfad zum Eingang und Bänken für Eltern mit Blick auf die Geräte.
22. **Spielfelder sind ganz**: Rand oder Linie um den Platz, zwei Körbe beim Basketball, Bank mit Blick
    zum Feld.
23. **Natürliches Wasser ist nicht gerade.** Bäche und Flüsse winden sich, Teiche sind rund oder
    unregelmäßig; Gerade nur bei Kanal, Becken oder Graben mit Mauer. Wasserfälle brauchen Felsen
    oder eine Geländestufe, aus der sie kommen.
24. **Boote liegen längs** zum Ufer oder am Steg, festgemacht; an einem Steg dürfen mehrere liegen.
25. **Buden, Hütten und Stände stehen am Weg** mit der Tür oder Theke zum Weg; vor einer Tür, die
    oft benutzt wird, führt ein Trampelpfad hin.
26. **Schilder haben einen Grund und einen Ort.** Wegweiser zeigen nur die Richtungen, die es an der
    Kreuzung gibt; Schilder stehen am Wegrand, nie mitten auf dem Weg. Ein Schild ohne Aufgabe in der
    Geschichte fällt weg.
27. **Zäune sind geschlossen oder haben Enden.** Jede Lücke endet an Pfosten; Tore sitzen auf
    derselben Linie wie der Zaun.
28. **Straßen enden sinnvoll**: Wendehammer, Platz oder Übergang auf einen Weg mit Pfosten, nie
    abgeschnitten.
29. **Sperren sind dicht.** Eine Sperre auf einem Weg (Stämme, Zaun, Wasser) lässt sich nicht
    umgehen: Wald, Felsen oder Wasser schließen links und rechts bis an den Kartenrand oder an eine
    andere Sperre. Unsichtbare Wände gibt es nicht. Die Sperre sieht nach ihrem Grund aus
    (umgestürzte Bäume nach einem Sturm, nicht gesägte Stämme, wenn es Sturm war).

### 10.5 Räume nach ihrem Zweck

30. **Ein Raum hat alles, was sein Zweck verlangt, in der passenden Größe.** Vor dem Bühnenbild steht
    eine Liste: Was gehört in diesen Raum, in welcher Zahl? Beispiele:
    - Diner: Gastraum mit Sitznischen und Tischen, Theke mit Hockern, Kasse hinter der Theke zum
      Gast hin, Durchreiche; abgetrennte Großküche (mehrere Herde, Grill, Fritteuse, Arbeitstische
      aus Stahl, Kühlung), Lager, Toiletten.
    - Bibliothek: Regalreihen mit Gängen, Lesetische mit Lampen, Ausleihtheke.
    - Archiv: dichte Regalreihen, Kisten sortiert und beschriftet, Arbeitsplatz in einer Ecke.
    - Werkstatt: Werkbänke, Maschinen, Material, Werkzeugwand; die Mitte ist Arbeitsfläche mit
      etwas darauf (Werkstück, Böcke).
31. **Möbel gehören zu einer Gruppe.** Ein Regal zwischen zwei Werkbänken gehört zu einer davon
    (näher dran, gleiche Achse); nichts steht allein genau in der Mitte zwischen zwei Gruppen.

### 10.6 Zusammenhang draußen (zweite Rückmeldung des Autors, 9.11.2026, mit Prüfung im Werkzeug)

32. **Was zusammenhängt, ist durchgehend.** Flüsse, Bäche, Wege, Straßen, Gleise und Zäune haben keine
    Unterbrechung: Ein Bach endet nur am Kartenrand, in einem See oder an einer Quelle mit Felsen;
    ein Weg führt zu einem Kartenrand, einer Tür, einem Steg, einem Auslöser oder einem anderen
    Belag. Prüfung: `pipeline/abenteuer/zusammenhang.py` im Kartenbauer („Bach endet“, „führt
    nirgendwohin“).
33. **Mindestbreiten.** Straße mindestens 3 Kacheln (zwei Spuren), Weg und Trampelpfad mindestens
    2 Kacheln, auch kurze Zugänge: Einen Weg von einer Kachel Breite kann LimeZus Randsatz nicht
    zeichnen. Prüfung: „zu schmal“.
34. **Gleichmäßige Breite.** Straßen und Wege werden von Feld zu Feld höchstens eine Kachel breiter
    oder schmaler, Flüsse höchstens zwei; ein Wendehammer oder Platz wird über mehrere Felder
    angelegt, nicht als Sprung. Teiche und Seen sind frei. Prüfung: „sprunghaft“.
35. **Zäune ohne Lücke.** Eine Lücke in einer Zaunreihe ist ein Tor oder Durchgang und endet auf
    beiden Seiten an einem End- oder Eckstück; kein Zaunteil sitzt ein paar Pixel höher oder tiefer
    als sein Nachbar. Prüfung: „Zaunlücke“, „versetzt“.
36. **Randspur auf der Zeichnung.** Nach dem Zeichnen zieht `pipeline/abenteuer/randspur.py` jeden
    Rand von Wasser und Erdwegen nach: Wo Wasser oder Weg an Gras oder Hecke grenzt, muss die
    gezeichnete Kachel dort ihren Rand zeigen, an inneren Ecken die Innenecke. Unter Holzbrücken
    läuft das Wasser ohne Ufer weiter. Befund: „Randlücke“.

### 10.7 Drei Varianten je Karte (Wunsch des Autors, 9.11.2026)

37. **Jede Karte entsteht in drei Varianten**, damit der Autor die beste wählt und dazu Hinweise
    gibt. Gleich in allen dreien: Größe, Wände, Türen, Fenster, Übergänge mit ihren Feldern,
    Auslöser und Figuren mit Namen (ihre Felder dürfen sich nur ändern, wenn sie kein Übergang sind
    und ihr Gegenstand mitwandert), alles, was die Geschichte verlangt (Ortsdokument, 12/13/14).
    Verschieden: Anordnung, Wahl der Möbelserie und Bilder, Deko, Dichte (eine schlichtere, eine
    reichere), draußen Verlauf von Wegen und Bächen innerhalb ihrer festen Enden, Bäume, Beete,
    Kleinkram. Jede Variante besteht alle Prüfungen für sich. Ablage: Variante A ist die Szene in
    `inhalte/abenteuer/szenen/`, B und C liegen in `inhalte/abenteuer/szenen/varianten/` (siehe
    README dort). Nach der Wahl des Autors wird die gewählte Variante zur Szene, die anderen bleiben
    zum Nachschlagen.
