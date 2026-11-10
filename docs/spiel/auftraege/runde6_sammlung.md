# Sammlung für Runde 6

Stand: 10.11.2026, nachts, gesammelt von mittel-3 im Auftrag des Haupt-Chats. Nur gesammelt, nichts
erfunden und nichts umgesetzt. Quellen: die Ortsdokumente in `docs/spiel/orte/`, die Prüfberichte in
`docs/spiel/pruefberichte/`, die Aufträge in `docs/spiel/auftraege/` und die Sperrenliste in
`13_Wegenetz.md` (Abschnitte 2 bis 5). Abgeglichen mit `inhalte/abenteuer/orte.json` (Stand dieses
Zweigs): Welche Sperre dort schon eine Bedingung `wenn` hat, steht in Abschnitt 2.

## 1. Zusammenfassung nach Art

| Art      | Umfang                                                                                                                                                                                                                                                                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dialoge  | Viele Auslöser zum Ansehen stehen als Gegenstand auf der Karte, aber ohne Eintrag in `orte.json` (Summit City, Weg 7, Port Delacroix, Capital, London, Pinewood, Ghost Town, Riverton, Delta, Crossroads, Jahrmarkt, Kürbishof, Pelikaninsel, Sternwarte, Goldmine). Dazu Dialogwahlen (Kürbiswaage) und der Dialog an der geschlossenen Inselfähre. |
| Sperren  | Ohne Bedingung in `orte.json`: S1, S2, S3, S4, S5, S9, S11, S13, S14. Nur teilweise: S8 (Gummistiefel fehlen), S12 (`novaBitteGehoert` fehlt). Dazu das Tor des Kürbishofs, das Watt der Pelikaninsel (Gummistiefel) und das Geröll am Abzweig zur Sternwarte.                                                                                       |
| Figuren  | Mit Dialogen erst in Runde 6, bisher Statisten oder gar nicht auf der Karte: Dolores, Ike (Jahrmarkt); Walt Miller, Clover, Oma Miller (Kürbishof); Delphine, Old Pete, Coral, Bishop (Pelikaninsel); Dr. Ngata, Lucía, Mira (Sternwarte); Pruitt, Juniper (Goldmine). Mira braucht auf dem Canyonpfad eine eigene Figur.                            |
| Tönungen | Die Karten kennen noch keine Tönung. Verlangt: dunkles Wasser und Nebel im Bayou, Nachttönung der Sternwarte, Sepia für Ghost Town (Erinnerung), London und die Staubstraße, Nebel am Morgen (Pinewood, Cedar Creek), Dunkel mit Lichtkreis der Laterne (Steinbruch, Goldmine), Abend und Nacht in Ironwood und Silicon Bay.                         |
| Technik  | `zustand_der_karte` (Musikhaus) auswerten, eigener Hintergrund je Zustand; Lichtkreis der Laterne (`hatLaterne`); Schnellreise mit dem Fernbus (Q3); eigene Karte für die Alte Minenstraße (Q4); einmalige Animation (Delfin); Szenenvariante für das reparierte Neonschild; Geysirausbruch „zur vollen Stunde“ ohne Uhrzeit im Spiel.               |

## 2. Sperren (13_Wegenetz.md)

| Sperre | Ort, Karte                                    | Öffnet laut Wegenetz                                      | Stand in `orte.json`                                                            | Quelle                                                    |
| ------ | --------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| S1     | Landstraße, Tor zum Kürbishof (N1)            | Walt Miller lässt herein, wer denken kann (Rätseltafel)   | keine Bedingung; Tor in Runde 5 geschlossen                                     | 13 §2; `kuerbishof.md` 1, 3                               |
| S2     | Zedernpfad (Q1), Stamm                        | von der Cedar-Creek-Seite, Mr. Dunmore räumt den Stamm    | keine Bedingung am Auslöser `zedernpfad`                                        | 13 §2; `cedar-creek.md` 3                                 |
| S3     | Schleuse nach Lockport (Q2)                   | Tafel der Schleusenwärterin                               | keine Bedingung am Auslöser `lockport`                                          | 13 §3                                                     |
| S4     | Alter Steinbruch bei Ironwood (N3)            | Laterne                                                   | keine Bedingung am Auslöser `steinbruch`                                        | 13 §3; `ironwood.md` 1.4                                  |
| S5     | Park Maple Falls, Steg                        | nach der ersten Clubnadel (`nadelMapleFalls ≥ 1`)         | keine Bedingung am Auslöser `steg`                                              | 13 §2; `maple-falls.md` 3                                 |
| S6     | Fähre zur Pelikaninsel (N4)                   | Nadel von Silicon Bay                                     | vorhanden (`inselfaehre`: `nadelSiliconBay`); Dialog „fährt nur sonntags“ fehlt | 13 §4; `pelikaninsel.md` 3                                |
| S8     | Bayou hinter Port Delacroix                   | Gummistiefel und `musikhausOffen`; im Sommer ohne Stiefel | nur `musikhausOffen`; Auslöser `sperreHochwasser` am überfluteten Steg fehlt    | 13 §4; `delta.md` 3.3                                     |
| S9     | Sternwarte am Canyon (N5)                     | Laterne und Versöhnung (Szene 73)                         | keine Bedingung am Auslöser `sternwarte`; Abzweig auf dem Canyonpfad mit Geröll | 13 §4; `nebenorte-sued.md`; `desert-springs.md` 1.1 (CP9) |
| S10    | Weg 8 nach Crossroads, Ranger-Tor             | Nadel von Summit City                                     | vorhanden (`wegCrossroads`: `nadelSummitCity`)                                  | 13 §5; `crossroads.md` 1.5                                |
| S11    | Goldmine bei Ghost Town (N7)                  | Laterne und Pruitts Geschichte                            | keine Bedingung am Auslöser `goldmine`; Auslöser `stollen` am Eingang fehlt     | 13 §5; `ghost-town.md` 3.3; `nebenorte-sued.md`           |
| S12    | Weg 11 zur Capital Arena, Wachmann am Seeufer | `fernpartieGespielt` und `novaBitteGehoert`               | nur `fernpartieGespielt` (`wegCapital`); Absperrböcke stehen neben dem Weg      | 13 §5; Prüfbericht mittel-3, Seeufer                      |
| S13    | Alte Minenstraße Q4, Viehgatter in Crossroads | mit Szene 93: Darlene gibt den Gatterschlüssel mit        | kein Auslöser `viehgatter`, keine Karte für Q4, kein Auslöser `minenstrasse`    | 13 §5; `crossroads.md` 3.3; `ghost-town.md` 3.3           |
| S14    | Bahndamm auf W2, Durchlass unter dem Damm     | Laterne                                                   | kein Auslöser für den Durchlass                                                 | 13 §3                                                     |

## 3. Nach Ort

### Akt 1

| Karte                     | Auslöser bzw. Element                                                                    | Was fehlt                                                                                             | Quelle                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| kuerbishof.hof            | `irrgarten`, `kuerbiswaage`, `vogelscheuche`                                             | Auslöser; die Waage ist eine Dialogwahl, die Vogelscheuche „Morphy“ braucht ein Schild                | `kuerbishof.md` 3                                              |
| kuerbishof.hof            | Walt Miller, Clover, Oma Miller                                                          | Figuren mit Dialogen (bisher Statisten)                                                               | `kuerbishof.md` 3                                              |
| landstrasse ↔ kuerbishof  | Tor S1                                                                                   | Bedingung (Rätseltafel, Zusage für die Kuhsuche)                                                      | `kuerbishof.md` 1, 3                                           |
| mapleFalls.park           | Bushaltestelle, Basketballplatz, Teich, Pflasterquadrat, Bach, Stegteile, Laternen, Pfad | im Prüfbericht als „mittel-4, Runde 6“ offen; `maple-falls.md` meldet die Überarbeitung vom 9.11.2026 | `2026-11-09_runde4_autor.md` (Park); `maple-falls.md` 4 (Park) |
| wegMapleCedar.flussweg    | Nebel am Morgen                                                                          | Tönung (feste Tönung je Szene)                                                                        | `cedar-creek.md` 1.2 (F1)                                      |
| wegCedarRiverton.bahndamm | Tunnelportal im Damm                                                                     | Ansehen-Auslöser („zugemauert seit 1952“) oder Gitter                                                 | `2026-11-10_gegenpruefung_mittel-2.md` 2.13                    |

### Akt 2

| Karte                          | Auslöser bzw. Element                           | Was fehlt                                               | Quelle                     |
| ------------------------------ | ----------------------------------------------- | ------------------------------------------------------- | -------------------------- |
| wegRivertonIronwood (Kanalweg) | `meilenstein`, `rastKanal`, `fundKonservendose` | Auslöser mit Dialogen; Schild, Rastbank, Anleger stehen | `riverton.md` 4 (Kanalweg) |
| wegRivertonIronwood (Brücke)   | `waerterhaus`, `aussichtTal`                    | Auslöser                                                | `riverton.md` 4 (Brücke)   |
| ironwood.aussen                | Lokschuppen (Fledermäuse am Abend), Szene 50    | Tönung Abend, Schnee als Objektebene ab Szene 50        | `ironwood.md` 1.2, 3, 4.1  |
| steinbruch.stollen             | Stollen                                         | Tönung „dunkel“, Lichtkreis der Laterne (`hatLaterne`)  | `ironwood.md` 1.4, 4.7     |
| steinbruch.grube               | Grube                                           | Tönung kühl                                             | `ironwood.md` 4.6          |

### Akt 3

| Karte                         | Auslöser bzw. Element                                          | Was fehlt                                                                             | Quelle                                                |
| ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| siliconBay.aussen             | `hotel` (Szene 61)                                             | Nachttönung mit leuchtenden Fassaden                                                  | `silicon-bay.md` 1.3, 4.3                             |
| pelikaninsel.dorf             | `leuchtfeuer` (Batterie-Quest), `netze`, `watt`                | Auslöser; `watt` mit Bedingung Gummistiefel                                           | `pelikaninsel.md` 1, 3                                |
| pelikaninsel.dorf             | Delphine, Old Pete, Coral (sammelt Muscheln), Bishop           | Figuren mit Dialogen (bisher Statisten)                                               | `pelikaninsel.md` 1, 3                                |
| siliconBay.hafen              | geschlossene Inselfähre                                        | Dialog „fährt nur sonntags“                                                           | `pelikaninsel.md` 3                                   |
| wegSiliconDelacroix.faehrdeck | `ladung` (Achterdeck), `delfin`                                | Auslöser zum Ansehen; einmalige Animation                                             | `delta.md` 3.3                                        |
| wegSiliconDelacroix.deich     | `pumpenhaus`                                                   | Auslöser zum Ansehen                                                                  | `delta.md` 3.3                                        |
| bayou.steg                    | `luftboot`, `sperreHochwasser` (S8)                            | Auslöser; Bedingung Gummistiefel                                                      | `delta.md` 3.3                                        |
| bayou.steg                    | Wasser, Nebel                                                  | Tönung „dunkel“ und Nebel (bisher nur Auslöser `nebel`)                               | `delta.md` 1.3, 3.2, 4.3; `port-delacroix.md` 3       |
| portDelacroix.turnhalle       | Spendenkasse, nasses Notenheft, Plakat „Wir spielen weiter“    | Auslöser zum Ansehen                                                                  | `port-delacroix.md` 3, 4.1                            |
| portDelacroix.werkstatt       | altes Foto (Szene 68), Célestes Laptop                         | Auslöser zum Ansehen                                                                  | `port-delacroix.md` 3, 4.2                            |
| portDelacroix.musikhaus       | Bauzaun, Loch im Dach                                          | Auslöser zum Ansehen; Licht von oben als Tönung                                       | `port-delacroix.md` 3, 4.3                            |
| portDelacroix.musikhaus       | Ruine und neuer Clubraum (`zustand_der_karte: musikhausOffen`) | Auswertung in der App; `kartenbild` braucht je Zustand einen eigenen Hintergrundnamen | `port-delacroix.md` 3.3 (5), 4; `2026-11-10_nacht.md` |
| wegDelacroixDesert.canyonpfad | Mira an Miras Stein (Szene 72)                                 | eigene Figur auf dem Canyonpfad (gehört bisher zu Desert Springs)                     | `2026-11-10_nacht.md`                                 |
| wegDelacroixDesert.canyonpfad | Abzweig Sternwarte (CP9), Geröll                               | Sperre S9 (siehe Abschnitt 2)                                                         | `desert-springs.md` 1.1 (CP9)                         |
| sternwarte.felsnase, .kuppel  | Teleskop, Sternkarte                                           | Auslöser zum Ansehen; feste Nachttönung (nur als Szene)                               | `nebenorte-sued.md` 3; `runde5c_akt4.md`              |
| sternwarte                    | Dr. Ngata, Lucía, Mira (nach der Versöhnung)                   | Figuren und Dialoge in `orte.json`                                                    | `nebenorte-sued.md` 3                                 |

### Akt 4

| Karte                              | Auslöser bzw. Element                                                                                            | Was fehlt                                                                                 | Quelle                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| wegDesertSummit.diner              | `reklame` (D3), `motelschild` (D4), `aussicht` (D11)                                                             | Auslöser                                                                                  | `summit-weg.md` 3.3                                     |
| wegDesertSummit.diner              | Neonschild „KING'S DINER“ nach `fundNeonK`                                                                       | Variante der Szene mit repariertem Schild (Akt 4)                                         | `summit-weg.md` 3                                       |
| wegDesertSummit.bergstrasse        | `aussicht` (B3), `wegweiserHochebene` (B5), `quelle` (B6)                                                        | Auslöser                                                                                  | `summit-weg.md` 3.3                                     |
| wegDesertSummit                    | Hitze                                                                                                            | Tönung (Szene)                                                                            | `summit-weg.md` 1                                       |
| summitCity                         | `plakat` (S1), `fernrohr` (S5), `foto`, `teekanne` (Hütte), `fahrplan` (Bergstation), `wanderkarten` (Bergladen) | Auslöser                                                                                  | `summit-city.md` 3.3                                    |
| hochebene.felsentuerme, .schule    | `pferd`, `schildSchule`, `bus`; Figuren                                                                          | Auslöser; Figuren und Begegnung erst nach Q21-1                                           | `summit-city.md` 3.3; `auftraege/mittel-1.md`           |
| crossroads.aussen                  | `fernbus` (Haltestelle Q3)                                                                                       | Auslöser und Schnellreise                                                                 | `crossroads.md` 3.2, 3.3                                |
| crossroads.aussen                  | `viehgatter` (S13), Übergang zur Alten Minenstraße                                                               | Auslöser, Bedingung, Übergang                                                             | `crossroads.md` 1.3, 3.2, 3.3                           |
| wegSummitCrossroads.geysirbecken   | `geysirAusbruch`                                                                                                 | Auslöser zum Ansehen; im Dokument „zur vollen Stunde“, das Spiel kennt aber keine Uhrzeit | `crossroads.md` 3.3; `2026-11-09_akt1_wegenetz.md` 16   |
| wegSummitCrossroads.praerie        | `windrad`                                                                                                        | Auslöser zum Ansehen                                                                      | `crossroads.md` 3.3                                     |
| jahrmarkt.festplatz                | `schachautomat`, `riesenrad`, `losbude`                                                                          | Auslöser                                                                                  | `jahrmarkt.md` 3                                        |
| jahrmarkt.festplatz                | Dolores, Ike                                                                                                     | Figuren (Buster und Juno bleiben Belebung)                                                | `jahrmarkt.md` 3                                        |
| jahrmarkt.festplatz                | Lieferung von Darlene (S13)                                                                                      | Quest                                                                                     | `jahrmarkt.md` 3                                        |
| wegCrossroadsPinewood.riesenbaeume | Nebel am Morgen                                                                                                  | Tönung (Szene)                                                                            | `pinewood.md` 1.2, 3                                    |
| Pinewood (alle Karten)             | Wegweiser „LONG RIDGE TRAIL“, Bärenspur, Feuerstelle, Steg am See, Kanus, Kletterwand, liegengebliebener Wagen   | Auslöser zum Ansehen                                                                      | `pinewood.md` 3.3 (2)                                   |
| wegPinewoodGhost.staubstrasse      | Sepia                                                                                                            | Tönung (Szene)                                                                            | `pinewood.md` 1.5, 3                                    |
| ghostTown.aussen                   | Ortsschild, Steckbrief, Klavier, Amboss                                                                          | Auslöser zum Ansehen                                                                      | `ghost-town.md` 3.3                                     |
| ghostTown.aussen                   | Südrand (Spalten 12–14), Alte Minenstraße Q4                                                                     | eigene Karte (etwa 150 Kacheln), Auslöser `minenstrasse`                                  | `ghost-town.md` 1, 1 (Übergänge), 3.3                   |
| ghostTown.aussen                   | Stolleneingang der Goldmine                                                                                      | Auslöser `stollen`, Sperre S11                                                            | `ghost-town.md` 3.3                                     |
| erinnerungSiedlung.huette          | Erinnerung „Die letzte Kerze“                                                                                    | Sepia als Tönung der Szene                                                                | `ghost-town.md` 1                                       |
| goldmine.stollen                   | Logbuch (Tisch der Kammer), Funde, Goldader                                                                      | Auslöser; Lichtkreis der Laterne                                                          | `nebenorte-sued.md` 1.3, 3                              |
| goldmine                           | Pruitt, Juniper, Fledermäuse                                                                                     | Figuren                                                                                   | `nebenorte-sued.md` 3                                   |
| wegGhostCapital.seeufer            | Wachmann, Absperrböcke (S12)                                                                                     | Böcke quer über den Weg, in Runde 6 zur Seite schieben; Bedingung `novaBitteGehoert`      | `2026-11-10_gegenpruefung_mittel-3.md` (Seeufer); 13 §5 |
| capital                            | Fähre, Strandkorb, Fernrohr am Leuchtturm, Fahnen, Banner                                                        | Auslöser zum Ansehen                                                                      | `capital.md` 3                                          |
| erinnerungLondon.strand            | `zeitungskarren`, `laternenanzuender`                                                                            | Auslöser zum Ansehen                                                                      | `erinnerung-london.md` 3                                |
| erinnerungLondon                   | Sepia                                                                                                            | Tönung (Szene)                                                                            | `auftraege/mittel-1.md` (London)                        |

## 4. Technik, quer über die Orte

| Thema                    | Was fehlt                                                                                      | Quelle                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Tönung                   | Die Karten kennen noch keine Tönung; Nebel, Nacht, Dunkel, Abend, Sepia nur als Szene vermerkt | `delta.md` 3.2; `runde5b_akt3.md`; `runde5c_akt4.md`  |
| `zustand_der_karte`      | Die App wertet das Feld erst in Runde 6 aus; eigener Hintergrund je Zustand                    | `port-delacroix.md` 3.3 (5), 4; `2026-11-10_nacht.md` |
| Laterne                  | Lichtkreis von vier Feldern um den Helden (`hatLaterne`), Bedingung für S4, S9, S11, S14       | `ironwood.md` 1.4, 4.7; 13 §3–5                       |
| Gummistiefel             | Bedingung für S8 und das Watt der Pelikaninsel                                                 | 13 §4; `pelikaninsel.md` 3                            |
| Schnellreise             | Fernbus Q3 in Crossroads                                                                       | `crossroads.md` 3.2                                   |
| Querweg                  | Alte Minenstraße Q4 als eigene Karte zwischen Crossroads und Ghost Town                        | `ghost-town.md` 3.3; `crossroads.md` 1.3              |
| Animation                | Delfin am Fährdeck, einmalig                                                                   | `delta.md` 3.3                                        |
| Szenenvariante nach Fund | Neonschild in Akt 4 repariert, wenn das K zurückgebracht wurde                                 | `summit-weg.md` 3                                     |
| Ohne Uhrzeit             | Geysirausbruch „zur vollen Stunde“ widerspricht dem Grundsatz ohne Uhrzeit                     | `crossroads.md` 3.3; `2026-11-09_akt1_wegenetz.md` 16 |
| Dialoge, Quests          | Keine neuen Dialoge und Quests in Runde 5; alle Ansehen-Auslöser oben kommen mit den Dialogen  | `runde5_karten.md`; `runde5b_akt3.md` 4               |

## 5. Nachtrag Haupt-Chat (10.11.2026): Möbel, die etwas anderes zeigen als ihr Name

Die Katalogkorrekturen der Runde 7 (`inhalte/abenteuer/katalog_korrekturen/runde7.json`) haben
gezeigt, dass einige Bilder nicht zum Möbelnamen passen. Wer am Ort arbeitet, prüft, ob das Bild in
der Szene trotzdem stimmt, und tauscht es sonst:

| Möbel                             | zeigt tatsächlich                                    | Ort                      |
| --------------------------------- | ---------------------------------------------------- | ------------------------ |
| `rv5Gepaeckwagen`                 | Rollkoffer                                           | Riverton, Bahnhofshalle  |
| `rvBildschirmtisch`               | großer Standbildschirm mit Abfahrtsplan              | Riverton                 |
| `rv5Kommode`, `pd6Kommode`        | flacher Vitrinentisch mit Glasscheibe                | Riverton, Port Delacroix |
| `rv5Schalter`, `rvTicketschalter` | Teilstück eines Ticketschalters (mit 5 und 7)        | Riverton                 |
| `kisteRot`                        | Mittelstück einer Konferenztheke (mit 25 und 27)     | allgemein                |
| `wzSofa`                          | lila Polsterbank ohne Lehne                          | Maple Falls, Wohnzimmer  |
| `wds6Schranke`                    | mobiles Absperrgitter, kein Schlagbaum               | Wüste                    |
| `st5Schotterhaufen`               | braune Erdhaufen                                     | Steinbruch               |
| `ds8Sheriff`, `sc8Bergwacht`      | Wache mit „POLICE“ und Feuerwache mit „FIRE STATION“ | Desert Springs, Summit   |
