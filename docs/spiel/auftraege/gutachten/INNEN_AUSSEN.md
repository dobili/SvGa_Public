# Innenraum gegen Gebäude (R065)

Geführt vom Gutachter-Chat, Stand 11.11.2026 (öffentlicher Zweig nach 45c4bc5b). Für jede Tür,
die von einer Außenkarte in einen Innenraum führt, steht hier das Gebäudebild darüber mit seiner
Größe in Kacheln, der begehbare Innenraum (breiteste Zeile und Zahl der Zeilen ohne Wand) und
die Lage des Eingangs als Anteil der Breite (0 = links, 1 = rechts).

So gemessen: aus den Szenen (`objekte`, `raster`, `ausloeser`) und `orte.json`, nicht am Bild.
Die Höhe eines Gebäudebilds enthält Dach und Fassade; vergleichbar ist deshalb nur die Breite.
„Faktor Breite“ ist begehbare Innenbreite durch Gebäudebreite. Ab 1,5 nenne ich den Raum zu
breit, ab 2,5 viel zu breit. Ein Eingang gilt als versetzt, wenn die Lage außen und innen um
0,2 oder mehr auseinanderliegt. Für vier Gebäude habe ich das Bild von Hand zugeordnet
(Wohnzimmer, Clubraum, Arena-Halle, Bibliothek). Stollen und U-Bahnhof liegen unter der Erde
und sind nicht verglichen.

## Abweichungen, größte zuerst

| Innenraum                    | Gebäude außen                                                           | Außen (B × H) | Innen begehbar (B × H) | Faktor Breite | Eingang außen / innen | Urteil                               |
| ---------------------------- | ----------------------------------------------------------------------- | ------------- | ---------------------- | ------------- | --------------------- | ------------------------------------ |
| ironwood-museum              | `Generic_Building_Condo_5_2` auf ironwood-aussen                        | 6 × 11        | 32 × 14                | 5.3           | 0.50 / 0.34           | Raum viel zu breit                   |
| portDelacroix-turnhalle      | `werk_halle` auf portDelacroix-aussen                                   | 6 × 6         | 24 × 13                | 4.0           | 0.50 / 0.52           | Raum viel zu breit                   |
| mapleFalls-diner             | `fassade_diner` auf mapleFalls-aussen                                   | 8 × 9         | 28 × 13                | 3.5           | 0.25 / 0.25           | Raum viel zu breit                   |
| ironwood-umkleide            | `City_Props_Container_House_1` auf ironwood-aussen                      | 5 × 5         | 14 × 8                 | 2.8           | 0.50 / 0.41           | Raum viel zu breit                   |
| lockport-gasthaus            | `Farmer_House_2` auf lockport-aussen                                    | 10 × 9        | 28 × 11                | 2.8           | 0.75 / 0.72           | Raum viel zu breit                   |
| desertSprings-garage         | `garage_rolltor` auf desertSprings-aussen                               | 6 × 6         | 16 × 9                 | 2.7           | 0.75 / 0.53           | Raum viel zu breit, Eingang versetzt |
| ironwood-mamasZimmer         | `Generic_Building_Condo_3_45` auf ironwood-aussen                       | 6 × 10        | 16 × 9                 | 2.7           | 0.42 / 0.47           | Raum viel zu breit                   |
| riverton-schuppen            | `gartenhaus_braun` auf riverton-aussen                                  | 3 × 4         | 8 × 5                  | 2.7           | 0.50 / 0.55           | Raum viel zu breit                   |
| ironwood-kantine             | `Generic_Building_Condo_6` auf ironwood-aussen                          | 13 × 16       | 34 × 16                | 2.6           | 0.27 / 0.51           | Raum viel zu breit, Eingang versetzt |
| riverton-wohnwagen           | `Camping_Mobile_House_Small_1` auf riverton-aussen                      | 6 × 6         | 15 × 4                 | 2.5           | 0.42 / 0.50           | Raum viel zu breit                   |
| erinnerungLondon-kaffeehaus  | `london_kaffeehaus_hell` auf erinnerungLondon-strand                    | 7 × 12        | 16 × 10                | 2.3           | 0.64 / 0.47           | Raum zu breit                        |
| crossroads-raststaette       | `diner_wagen` auf crossroads-aussen                                     | 10 × 7        | 22 × 15                | 2.2           | 0.50 / 0.52           | Raum zu breit                        |
| mapleFalls-wohnzimmer        | `Villa_1` auf mapleFalls-aussen                                         | 9 × 13        | 18 × 10                | 2.0           | 0.28 / 0.28           | Raum zu breit                        |
| summitCity-huette            | `berghuette` auf summitCity-aussen                                      | 8 × 7         | 16 × 10                | 2.0           | 0.50 / 0.47           | Raum zu breit                        |
| summitCity-bergstation       | `seilbahn_talstation` auf summitCity-aussen                             | 8 × 8         | 16 × 8                 | 2.0           | 0.50 / 0.81           | Raum zu breit, Eingang versetzt      |
| riverton-pavillon            | `riverton_pavillon` auf riverton-aussen                                 | 12 × 4        | 22 × 15                | 1.8           | 0.46 / 0.52           | Raum zu breit                        |
| siliconBay-lobby             | `konzernturm_hoch` auf siliconBay-aussen                                | 12 × 29       | 22 × 11                | 1.8           | 0.54 / 0.52           | Raum zu breit                        |
| desertSprings-antiquariat    | `bahnhof_alt_veranda` auf desertSprings-aussen                          | 10 × 8        | 18 × 10                | 1.8           | 0.50 / 0.53           | Raum zu breit                        |
| ghostTown-saloon             | `saloon_fassade` auf ghostTown-aussen                                   | 10 × 9        | 18 × 11                | 1.8           | 0.50 / 0.53           | Raum zu breit                        |
| portDelacroix-werkstatt      | `haus_farm2_grau` auf portDelacroix-aussen                              | 10 × 9        | 18 × 10                | 1.8           | 0.75 / 0.53           | Raum zu breit, Eingang versetzt      |
| cedarCreek-drechslerei       | `Barn_Small` auf cedarCreek-aussen                                      | 8 × 10        | 14 × 8                 | 1.8           | 0.31 / 0.28           | Raum zu breit                        |
| sternwarte-kuppel            | `sternwarte_aussen` auf sternwarte-felsnase                             | 7 × 8         | 12 × 9                 | 1.7           | 0.50 / 0.54           | Raum zu breit                        |
| summitCity-bergladen         | `bergladen` auf summitCity-aussen                                       | 7 × 6         | 12 × 7                 | 1.7           | 0.50 / 0.46           | Raum zu breit                        |
| wegPinewoodGhost-tankstelle  | `City_Props_Junk_Shack_1` auf wegPinewoodGhost-staubstrasse             | 6 × 6         | 10 × 7                 | 1.7           | 0.75 / 0.54           | Raum zu breit, Eingang versetzt      |
| cedarCreek-waschsalon        | `fassade_waschsalon` auf cedarCreek-aussen                              | 8 × 9         | 12 × 8                 | 1.5           | 0.25 / 0.54           | Raum zu breit, Eingang versetzt      |
| portDelacroix-musikhaus      | `24_Additional_Houses_Post_Apocalyptic_House_` auf portDelacroix-aussen | 13 × 10       | 18 × 11                | 1.4           | 0.62 / 0.53           | passt                                |
| siliconBay-akademie          | `Office_Example_2` auf siliconBay-aussen                                | 19 × 18       | 24 × 17                | 1.3           | 0.34 / 0.33           | passt                                |
| wegDesertSummit-hinterzimmer | `diner_wagen` auf wegDesertSummit-diner                                 | 10 × 7        | 12 × 8                 | 1.2           | 0.50 / 0.54           | passt                                |
| capitalArena-halle           | `Palace_Example_1 (Arena)` auf capitalArena-aussen                      | 25 × 34       | 28 × 17                | 1.1           | 0.50 / 0.52           | passt                                |
| riverton-bahnhofshalle       | `riverton_bahnhof` auf riverton-aussen                                  | 22 × 15       | 24 × 13                | 1.1           | 0.50 / 0.50           | passt                                |
| mapleFalls-clubraum          | `School_1` auf mapleFalls-aussen                                        | 24 × 23       | 24 × 12                | 1.0           | 0.35 / 0.52           | passt                                |
| cedarCreek-bibliothek        | `Victorian_House_5 mit Seiteneingang` auf cedarCreek-aussen             | 22 × 16       | 20 × 13                | 0.9           | 0.07 / 0.16           | passt                                |

## Was daraus folgt

- **Fast jeder Innenraum ist breiter als sein Haus.** Nach Entscheidung 9 braucht jeder dieser
  Räume entweder ein größeres Gebäudebild oder einen kleineren Raum. Wo der Raum bleiben soll,
  muss das Haus außen wachsen; Türen zu weiteren Räumen helfen nur, wenn der Raum kleiner ist
  als das Haus.
- **Am stärksten:** Museum Ironwood (32 breit in einem 6 breiten Haus), Turnhalle Port Delacroix
  (24 in 6), Diner Maple Falls (28 in 8), Lockport Gasthaus (28 in 10), Kantine Ironwood
  (34 in 13), Schuppen und Wohnwagen Riverton, Garage Desert Springs.
- **Eingang versetzt:** siehe Spalte Urteil; dort liegt die Tür innen an anderer Stelle der
  Breite als außen.
- **Kleiner als das Haus und deshalb mit Türen zu erklären:** Clubraum in der Schule
  (24 × 12 in einem Bau von 24 × 23: Flurtür fehlt), Bibliothek (R063, R064: Vorraum unter dem
  Balkon, Tür zum Treppenhaus), Halle in der Arena, Lobby im Konzernturm (Aufzüge sind da),
  Mamas Zimmer im Mietshaus (Wohnungstür statt Haustür).

## Innen zu innen

| Von                                                           | Nach                                                          | Lage oben      | Lage unten    | Urteil                                                                                                                         |
| ------------------------------------------------------------- | ------------------------------------------------------------- | -------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| cedar-creek-bibliothek, Kellertür (19, 3) von 22 × 17         | cedar-creek-archiv, Treppe (10–12, 3–4) von 14 × 11           | Nordostecke    | Nordostecke   | R066: Die Treppe liegt unten an derselben Ecke wie die Tür oben; der Keller ist kleiner als der Saal und liegt nicht unter ihm |
| maple-falls-wohnzimmer, Treppe (1–3, 3–4) von 20 × 13         | maple-falls-dachboden, Luke (1–2, 3–4) von 14 × 11            | Nordwestecke   | Nordwestecke  | passt; der Dachboden ist schmaler als das Erdgeschoss, was unter einem Dach stimmt                                             |
| silicon-bay-akademie, Tür (12, 3) in der Nordwand von 26 × 20 | silicon-bay-serverraum, Tür (7, 9) in der Südwand von 14 × 10 | Nordwand Mitte | Südwand Mitte | passt                                                                                                                          |
| ghost-town-saloon (18, 6)                                     | erinnerung-siedlung-huette (6, 9)                             | –              | –             | Erinnerung, kein baulicher Zusammenhang                                                                                        |

## Nicht geprüft

Ob Fenster, Türen und Anbauten des Gebäudebilds zur Raumform passen (etwa ein L-förmiges Haus
mit rechteckigem Raum), habe ich nicht am Bild verglichen; das folgt mit den geänderten Karten.
