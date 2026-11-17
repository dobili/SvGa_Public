# Türmaße der Gebäude auf Außenkarten (Regel 10.92), 17.11.2026

Erzeugt mit `python -m pipeline.abenteuer.tuergroesse --bericht <diese Datei>`. Türmaße aus
`inhalte/abenteuer/katalog_korrekturen/tuermasse.json`: „von Hand“ mit der Lupe abgelesen,
„gemessen“ automatisch (`python -m pipeline.abenteuer.tuermessung PRIVAT`) und im Bild geprüft.
Die Gebäude selbst sind unverändert; der nötige massstab ist ein Vorschlag.

Stand der Türmaße (Gebäudebilder): 74 gemessen, 53 nicht messbar, 45 verworfen, 14 von Hand.

## Türen kleiner als die Figur (11.3 × 20 Kartenpixel)

7 Gebäude; Tür im ungeskalierten Bild, „nötig“ ist der kleinste
massstab, bei dem die Tür die Figur fasst. Groß genug: 128 Gebäude.

| Gebäude          | Bild                                  | Tür     | Herkunft | nötig | Karten (Feld, massstab jetzt)                                                                                  |
| ---------------- | ------------------------------------- | ------- | -------- | ----- | -------------------------------------------------------------------------------------------------------------- |
| gc7Leuchtturm    | 21_Beach_16x16_Example_Lighthouse.png | 24 × 18 | gemessen | 1.11  | weg-ghost-capital-leuchtturm (60, 1) ×1                                                                        |
| mf2Waschsalon    | fassade_waschsalon.png                | 31 × 17 | von Hand | 1.18  | cedar-creek-aussen-samstag (12, 10) ×1, cedar-creek-aussen (12, 10) ×1                                         |
| mf4Diner         | fassade_diner.png                     | 29 × 17 | von Hand | 1.18  | desert-springs-aussen-meisterschaft (9, 7) ×1, desert-springs-aussen (9, 7) ×1, maple-falls-aussen (30, 14) ×1 |
| mf4VillaLila     | ME_Singles_Villas_16x16_Villa_3.png   | 18 × 19 | von Hand | 1.05  | maple-falls-aussen (11, 10) ×1                                                                                 |
| mf4VillaRot      | ME_Singles_Villas_16x16_Villa_5.png   | 18 × 19 | von Hand | 1.05  | maple-falls-aussen (21, 10) ×1                                                                                 |
| mf4VillaWhitlock | villa_whitlock.png                    | 18 × 19 | von Hand | 1.05  | maple-falls-aussen (1, 10) ×1                                                                                  |
| sb5Leuchtturm    | 21_Beach_16x16_Example_Lighthouse.png | 24 × 18 | gemessen | 1.11  | silicon-bay-hafen (56, 21) ×1                                                                                  |

## Gebäude ohne Türmaß (114)

| Gebäude               | Bild                                                            | Stand         | Grund                                                                     |
| --------------------- | --------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------- |
| by9HuetteKrebs        | huette_bretter_b.png                                            | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| by9HuetteTheron       | huette_bretter_a.png                                            | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| ca10Cafe              | fassade_cafe.png                                                | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| ca10Feuerwache        | feuerwache.png                                                  | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| ca10Polizei           | polizei.png                                                     | verworfen     | Treppe oder Stufen statt Tür gemessen                                     |
| ca7Arena              | ME_Singles_Garden_16x16_Palace_Example_1.png                    | nicht messbar | keine Türfläche gefunden                                                  |
| ca8Eisenwaren         | fassade_eisenwaren.png                                          | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| ca8Hochhaus           | ME_Singles_Generic_Building_16x16_Condo_Example.png             | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| ca8Reihenhaus2        | ME_Singles_Generic_Building_16x16_Condo_7_Example_2.png         | verworfen     | Treppe oder Stufen statt Tür gemessen                                     |
| ca8Reihenhaus3        | ME_Singles_Generic_Building_16x16_Condo_7_Example_3.png         | verworfen     | Treppe oder Stufen statt Tür gemessen                                     |
| ca8Wohnhaus8          | ME_Singles_Generic_Building_16x16_Condo_8.png                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| ca8Wohnhaus9          | ME_Singles_Generic_Building_16x16_Condo_9.png                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| ca8Wohnhaus9B         | ME_Singles_Generic_Building_16x16_Condo_9_Example.png           | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| cc12SchuppenRot       | schuppen_rot.png                                                | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| cc5Seiteneingang      | 24_Additional_Houses_Victorian_House_1_Side_Entrance_16x16.png  | verworfen     | Treppe oder Stufen statt Tür gemessen                                     |
| cr7Raststaette        | diner_wagen.png                                                 | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| cr8Holzfaellerhuette  | holzfaellerhuette.png                                           | nicht messbar | keine Türfläche gefunden                                                  |
| dd6Wasserturm         | ME_Singles_City_Props_16x16_Water_Tower_2.png                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| dd6Wuestenbahnhof     | wuestenbahnhof.png                                              | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| ds6BahnhofAlt         | bahnhof_alt_veranda.png                                         | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| ds6TankstelleGross    | ME_Singles_Vehicles_16x16_Gas_Station_2.png                     | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| ds8Gemischtwaren      | fassade_kramladen.png                                           | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| el11Buchladen         | london_buchladen_hell.png                                       | nicht messbar | keine Türfläche gefunden                                                  |
| el11Kaffeehaus        | london_kaffeehaus_hell.png                                      | nicht messbar | keine Türfläche gefunden                                                  |
| el11Pub               | london_pub_hell.png                                             | nicht messbar | keine Türfläche gefunden                                                  |
| el11Schachsalon       | london_schachsalon_hell.png                                     | nicht messbar | keine Türfläche gefunden                                                  |
| el11Schneider         | london_schneider_hell.png                                       | nicht messbar | keine Türfläche gefunden                                                  |
| fzDeckhausGemini      | faehre_deckhaus_gemini.png                                      | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| gcFaehrhausHolz       | faehrhaus_see.png                                               | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| gt7FassadeLaden       | fassade_laden.png                                               | nicht messbar | keine Türfläche gefunden                                                  |
| gt7FassadePruefamt    | fassade_pruefamt.png                                            | nicht messbar | keine Türfläche gefunden                                                  |
| gt7FassadeSheriff     | fassade_sheriff.png                                             | nicht messbar | keine Türfläche gefunden                                                  |
| gt8Barbier            | fassade_barbier.png                                             | nicht messbar | keine Türfläche gefunden                                                  |
| gt8Bestatter          | fassade_bestatter.png                                           | nicht messbar | keine Türfläche gefunden                                                  |
| gt8HuetteA            | huette_bretter_a.png                                            | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| gt8HuetteB            | huette_bretter_b.png                                            | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| gt8Post               | fassade_post.png                                                | nicht messbar | keine Türfläche gefunden                                                  |
| iw5Eisenwaren         | ME_Singles_Generic_Building_16x16_Hardware_Store_Example.png    | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| iw5Kirche             | ME_Singles_Graveyard_16x16_Grace_Chapel.png                     | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| iw5Laden              | fassade_kramladen.png                                           | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| iw5Schornstein        | fabrikschornstein.png                                           | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| iw5Schuppen           | ME_Singles_Garden_16x16_Brown_Wood_Storage.png                  | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| ld14BlockhuetteKamin  | blockhuette_kamin.png                                           | nicht messbar | keine Türfläche gefunden                                                  |
| ld14Bootsschuppen     | bootsschuppen_grau.png                                          | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| ld14HausGruen         | haus_farm2_gruen.png                                            | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| ld14SchuppenRot       | schuppen_rot.png                                                | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| mf2Bibliothek         | 24_Additional_Houses_Victorian_House_5_16x16.png                | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| mf7Gartenhaus         | ME_Singles_Garden_16x16_Blue_Brown_Wood_Storage.png             | nicht messbar | keine Türfläche gefunden                                                  |
| n4Leuchtfeuer         | leuchtfeuer.png                                                 | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| n4PfahlhausBlau       | pfahlhaus_blau.png                                              | verworfen     | Treppe oder Stufen statt Tür gemessen                                     |
| n4PfahlhausRot        | pfahlhaus_rot.png                                               | nicht messbar | keine Türfläche gefunden                                                  |
| n4PfahlhausWeiss      | pfahlhaus_weiss.png                                             | verworfen     | Treppe oder Stufen statt Tür gemessen                                     |
| n5Sternwarte          | sternwarte_aussen.png                                           | verworfen     | Mauer um die Tür mitgemessen, Tür ist schmaler                            |
| n6Gestell             | 21_Beach_16x16_Example_Small_Stage_Structure.png                | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| pd10WerkGruen         | haus_farm2_gruen.png                                            | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| pd6Rohbau             | ME_Singles_Worksite_16x16_Building_Skeleton_1.png               | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| pd6Zelt               | ME_Singles_Camping_16x16_Tent_1.png                             | verworfen     | Zelt oder Kleinbau ohne echte Tür                                         |
| pd6ZeltFlach          | ME_Singles_Camping_16x16_Tent_4.png                             | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| pd7Reihenhaus2        | ME_Singles_Generic_Building_16x16_Condo_7_Example_2.png         | verworfen     | Treppe oder Stufen statt Tür gemessen                                     |
| pw7Kiosk              | campkiosk.png                                                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| rv14Pumpenhaus        | schuppen_rot.png                                                | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| rv5Cafe               | fassade_cafe.png                                                | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| rv5Kaffeekiosk        | ME_Singles_City_Props_16x16_Kiosk_Coffee_Cup.png                | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| rv5Pavillon           | ME_Singles_Garden_16x16_Pergola_Structure.png                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| rv5Reihenhaus         | ME_Singles_Generic_Building_16x16_Condo_7_Example_1.png         | verworfen     | Treppe oder Stufen statt Tür gemessen                                     |
| rv5Schuppen           | ME_Singles_Garden_16x16_Brown_Wood_Storage.png                  | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| rv5Wasserturm         | ME_Singles_City_Props_16x16_Water_Tower_1.png                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| rv8Baeckerei          | baeckerei_haus.png                                              | nicht messbar | keine Türfläche gefunden                                                  |
| rv8Bahnhof            | riverton_bahnhof.png                                            | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| rv8Infokiosk          | ME_Singles_City_Props_16x16_Kiosk_Infopoint_1.png               | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| rv8Stellwerk          | ME_Singles_Villas_16x16_Tree_House_House_1.png                  | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| rvPavillonAchteck     | pavillon_achteck.png                                            | nicht messbar | keine Türfläche gefunden                                                  |
| sa8Baeckerei          | altstadt_baeckerei.png                                          | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| sa8Eisenwaren         | fassade_eisenwaren.png                                          | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| sa8LadenA             | altstadt_laden_a.png                                            | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sa8LadenB             | altstadt_laden_b.png                                            | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sa8LadenC             | altstadt_laden_c.png                                            | nicht messbar | keine Türfläche gefunden                                                  |
| sa8LadenD             | altstadt_laden_d.png                                            | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sa8Metzgerei          | altstadt_metzgerei.png                                          | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sa8Musikladen         | altstadt_musikladen.png                                         | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sa8Polizei2           | ME_Singles_Police_Station_16x16_Police_Station_Small_2.png      | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sa8Viktorianisch      | 24_Additional_Houses_Victorian_House_7_16x16.png                | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| sa8WohnhausA          | altstadt_wohnhaus_a.png                                         | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sa9WohnhausE          | altstadt_wohnhaus_e.png                                         | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sb10HotelBayview      | ME_Singles_Hotel_and_Hospital_16x16_Hotel_1.png                 | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| sb10KaffeebecherKlein | kaffeebecher_klein.png                                          | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| sb8Faehrhaeuschen     | ME_Singles_Police_Station_16x16_Police_Station_Roof_Cabin_1.png | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sb8LadenBimbum        | altstadt_campus_bimbum.png                                      | nicht messbar | keine Türfläche gefunden                                                  |
| sb8LadenCoolies       | altstadt_campus_coolies.png                                     | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sb8LadenDanger        | altstadt_campus_danger.png                                      | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sb8LadenFitness       | altstadt_campus_fitness.png                                     | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| sb8LadenGroove        | altstadt_campus_groove.png                                      | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sb8LadenMusik         | altstadt_campus_musik.png                                       | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sb8LadenPlume         | altstadt_campus_plume.png                                       | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sb9KonzernturmHoch    | konzernturm_hoch.png                                            | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| sb9TunnelportalFlach  | tunnelportal_west_4.png                                         | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| sc7Huette             | berghuette.png                                                  | nicht messbar | keine Türfläche gefunden                                                  |
| sc7Talstation         | seilbahn_talstation.png                                         | nicht messbar | keine Türfläche gefunden                                                  |
| sc8Stall              | Stable_Example_Outside_16x16.png                                | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| sd6Steuerhaus         | ME_Singles_Police_Station_16x16_Police_Station_Roof_Cabin_1.png | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| wc14SchuppenRot       | schuppen_rot.png                                                | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| wc14Stellwerk         | stellwerk_ziegel.png                                            | nicht messbar | keine Türfläche gefunden                                                  |
| wc5Gartenhaus         | ME_Singles_Garden_16x16_Brown_Wood_Storage.png                  | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| wc5GartenhausB        | ME_Singles_Garden_16x16_Red_Brown_Wood_Storage.png              | nicht messbar | keine Türfläche gefunden                                                  |
| wc5Zelt               | ME_Singles_Camping_16x16_Tent_1.png                             | verworfen     | Zelt oder Kleinbau ohne echte Tür                                         |
| wc5ZeltB              | ME_Singles_Camping_16x16_Tent_2.png                             | verworfen     | Zelt oder Kleinbau ohne echte Tür                                         |
| wds6Diner             | diner_wagen.png                                                 | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
| wds6Motelzeile        | motelzeile.png                                                  | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| wds6Tankstelle        | ME_Singles_Vehicles_16x16_Gas_Station_Petrol_Pump_1.png         | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| wr5Huehnerstall       | Chicken_Coop_16x16.png                                          | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| wr5Ziegelturm2        | Silos_1_16x16.png                                               | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| wr8SiloKurz           | silo_kurz.png                                                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| ws5Huette             | ME_Singles_Garden_16x16_Brown_Wood_Storage.png                  | verworfen     | Fenster, Schild oder Dach statt Tür gemessen                              |
| ws5Rasthaus           | fassade_rasthaus.png                                            | verworfen     | ein Flügel einer Doppeltür oder einer Glasfront gemessen, Tür ist breiter |
