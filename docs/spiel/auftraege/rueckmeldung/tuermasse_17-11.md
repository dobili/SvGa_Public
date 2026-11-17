# Türmaße der Gebäude auf Außenkarten (Regel 10.92), 17.11.2026

Erzeugt mit `python -m pipeline.abenteuer.tuergroesse --bericht <diese Datei>`. Türmaße aus
`inhalte/abenteuer/katalog_korrekturen/tuermasse.json`: „von Hand“ mit der Lupe abgelesen,
„gemessen“ automatisch (`python -m pipeline.abenteuer.tuermessung PRIVAT`) und im Bild geprüft.
Die Gebäude selbst sind unverändert; der nötige massstab ist ein Vorschlag.

Stand der Türmaße (Gebäudebilder): 74 gemessen, 31 nicht messbar, 81 von Hand.

## Türen kleiner als die Figur (11.3 × 20 Kartenpixel)

16 Gebäude; Tür im ungeskalierten Bild, „nötig“ ist der kleinste
massstab, bei dem die Tür die Figur fasst. Groß genug: 201 Gebäude.

| Gebäude          | Bild                                                         | Tür     | Herkunft | nötig | Karten (Feld, massstab jetzt)                                                                                                                                                                                             |
| ---------------- | ------------------------------------------------------------ | ------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ca10Cafe         | fassade_cafe.png                                             | 30 × 17 | von Hand | 1.18  | capital-arena-aussen (41, 48) ×1                                                                                                                                                                                          |
| ca8Eisenwaren    | fassade_eisenwaren.png                                       | 30 × 17 | von Hand | 1.18  | capital-arena-aussen (10, 48) ×1                                                                                                                                                                                          |
| ds8Gemischtwaren | fassade_kramladen.png                                        | 30 × 17 | von Hand | 1.18  | desert-springs-aussen-meisterschaft (46, 22) ×1, desert-springs-aussen (46, 22) ×1, lockport-aussen-boot-an-land (28, 23) ×1, lockport-aussen-steg-offen (28, 23) ×1, lockport-aussen (28, 23) ×1                         |
| gc7Leuchtturm    | 21_Beach_16x16_Example_Lighthouse.png                        | 24 × 18 | gemessen | 1.11  | weg-ghost-capital-leuchtturm (60, 1) ×1                                                                                                                                                                                   |
| iw5Eisenwaren    | ME_Singles_Generic_Building_16x16_Hardware_Store_Example.png | 29 × 18 | von Hand | 1.11  | crossroads-aussen-gatter-offen (38, 36) ×1, crossroads-aussen (38, 36) ×1                                                                                                                                                 |
| iw5Laden         | fassade_kramladen.png                                        | 30 × 17 | von Hand | 1.18  | ironwood-aussen-meisterschaft (32, 2) ×1, ironwood-aussen-meisterschaft (16, 19) ×1, ironwood-aussen-vermietet (32, 2) ×1, ironwood-aussen-vermietet (16, 19) ×1, ironwood-aussen (32, 2) ×1, ironwood-aussen (16, 19) ×1 |
| mf2Waschsalon    | fassade_waschsalon.png                                       | 31 × 17 | von Hand | 1.18  | cedar-creek-aussen-samstag (12, 10) ×1, cedar-creek-aussen (12, 10) ×1                                                                                                                                                    |
| mf4Diner         | fassade_diner.png                                            | 29 × 17 | von Hand | 1.18  | desert-springs-aussen-meisterschaft (9, 7) ×1, desert-springs-aussen (9, 7) ×1, maple-falls-aussen (30, 14) ×1                                                                                                            |
| mf4VillaLila     | ME_Singles_Villas_16x16_Villa_3.png                          | 18 × 19 | von Hand | 1.05  | maple-falls-aussen (11, 10) ×1                                                                                                                                                                                            |
| mf4VillaRot      | ME_Singles_Villas_16x16_Villa_5.png                          | 18 × 19 | von Hand | 1.05  | maple-falls-aussen (21, 10) ×1                                                                                                                                                                                            |
| mf4VillaWhitlock | villa_whitlock.png                                           | 18 × 19 | von Hand | 1.05  | maple-falls-aussen (1, 10) ×1                                                                                                                                                                                             |
| rv5Cafe          | fassade_cafe.png                                             | 30 × 17 | von Hand | 1.18  | riverton-aussen-nachspiel (42, 27) ×1, riverton-aussen-tische-kaputt (42, 27) ×1, riverton-aussen-trainingszentrum (42, 27) ×1, riverton-aussen-unterschriften (42, 27) ×1, riverton-aussen (42, 27) ×1                   |
| sa8Eisenwaren    | fassade_eisenwaren.png                                       | 30 × 17 | von Hand | 1.18  | silicon-bay-altstadt (22, 32) ×1                                                                                                                                                                                          |
| sa8Polizei2      | ME_Singles_Police_Station_16x16_Police_Station_Small_2.png   | 20 × 16 | von Hand | 1.25  | silicon-bay-altstadt (8, 8) ×1                                                                                                                                                                                            |
| sb5Leuchtturm    | 21_Beach_16x16_Example_Lighthouse.png                        | 24 × 18 | gemessen | 1.11  | silicon-bay-hafen (56, 21) ×1                                                                                                                                                                                             |
| ws5Rasthaus      | fassade_rasthaus.png                                         | 30 × 17 | von Hand | 1.18  | weg-ironwood-silicon-raststaette (134, 7) ×1                                                                                                                                                                              |

## Gebäude ohne Türmaß (32)

| Gebäude               | Bild                                                            | Stand         | Grund                                                                     |
| --------------------- | --------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------- |
| ca8Hochhaus           | ME_Singles_Generic_Building_16x16_Condo_Example.png             | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| ca8Wohnhaus8          | ME_Singles_Generic_Building_16x16_Condo_8.png                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| ca8Wohnhaus9          | ME_Singles_Generic_Building_16x16_Condo_9.png                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| ca8Wohnhaus9B         | ME_Singles_Generic_Building_16x16_Condo_9_Example.png           | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| dd6Wasserturm         | ME_Singles_City_Props_16x16_Water_Tower_2.png                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| ds6TankstelleGross    | ME_Singles_Vehicles_16x16_Gas_Station_2.png                     | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| fzDeckhausGemini      | faehre_deckhaus_gemini.png                                      | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| gcFaehrhausHolz       | faehrhaus_see.png                                               | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| iw5Schornstein        | fabrikschornstein.png                                           | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| mf2Bibliothek         | 24_Additional_Houses_Victorian_House_5_16x16.png                | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| n4Leuchtfeuer         | leuchtfeuer.png                                                 | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| n6Gestell             | 21_Beach_16x16_Example_Small_Stage_Structure.png                | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| pd6Rohbau             | ME_Singles_Worksite_16x16_Building_Skeleton_1.png               | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| pd6ZeltFlach          | ME_Singles_Camping_16x16_Tent_4.png                             | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| pw7Kiosk              | campkiosk.png                                                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| rv5Kaffeekiosk        | ME_Singles_City_Props_16x16_Kiosk_Coffee_Cup.png                | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| rv5Pavillon           | ME_Singles_Garden_16x16_Pergola_Structure.png                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| rv5Wasserturm         | ME_Singles_City_Props_16x16_Water_Tower_1.png                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| rv8Infokiosk          | ME_Singles_City_Props_16x16_Kiosk_Infopoint_1.png               | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| rv8Stellwerk          | ME_Singles_Villas_16x16_Tree_House_House_1.png                  | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| sa8Viktorianisch      | 24_Additional_Houses_Victorian_House_7_16x16.png                | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| sb10KaffeebecherKlein | kaffeebecher_klein.png                                          | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| sb8Faehrhaeuschen     | ME_Singles_Police_Station_16x16_Police_Station_Roof_Cabin_1.png | nicht messbar | keine Tür im Bild (Automatenhäuschen auf dem Dach), im Bild geprüft       |
| sb9TunnelportalFlach  | tunnelportal_west_4.png                                         | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| sc8Stall              | Stable_Example_Outside_16x16.png                                | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| sd6Steuerhaus         | ME_Singles_Police_Station_16x16_Police_Station_Roof_Cabin_1.png | nicht messbar | keine Tür im Bild (Automatenhäuschen auf dem Dach), im Bild geprüft       |
| wc14Stellwerk         | stellwerk_ziegel.png                                            | nicht messbar | Eingang oben über die Außentreppe, im Bild kaum zu sehen; im Bild geprüft |
| wds6Motelzeile        | motelzeile.png                                                  | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| wds6Tankstelle        | ME_Singles_Vehicles_16x16_Gas_Station_Petrol_Pump_1.png         | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| wr5Huehnerstall       | Chicken_Coop_16x16.png                                          | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| wr5Ziegelturm2        | Silos_1_16x16.png                                               | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |
| wr8SiloKurz           | silo_kurz.png                                                   | nicht messbar | keine Türangabe (Katalog „tuer“ oder Grundriss)                           |

## Liste: alle zu kleinen Türen (Gebäude, Karte, Feld, nötiger massstab)

- ca10Cafe auf capital-arena-aussen (41, 48): massstab 1 → mindestens 1.18
- ca8Eisenwaren auf capital-arena-aussen (10, 48): massstab 1 → mindestens 1.18
- ds8Gemischtwaren auf desert-springs-aussen-meisterschaft (46, 22): massstab 1 → mindestens 1.18
- ds8Gemischtwaren auf desert-springs-aussen (46, 22): massstab 1 → mindestens 1.18
- ds8Gemischtwaren auf lockport-aussen-boot-an-land (28, 23): massstab 1 → mindestens 1.18
- ds8Gemischtwaren auf lockport-aussen-steg-offen (28, 23): massstab 1 → mindestens 1.18
- ds8Gemischtwaren auf lockport-aussen (28, 23): massstab 1 → mindestens 1.18
- gc7Leuchtturm auf weg-ghost-capital-leuchtturm (60, 1): massstab 1 → mindestens 1.11
- iw5Eisenwaren auf crossroads-aussen-gatter-offen (38, 36): massstab 1 → mindestens 1.11
- iw5Eisenwaren auf crossroads-aussen (38, 36): massstab 1 → mindestens 1.11
- iw5Laden auf ironwood-aussen-meisterschaft (32, 2): massstab 1 → mindestens 1.18
- iw5Laden auf ironwood-aussen-meisterschaft (16, 19): massstab 1 → mindestens 1.18
- iw5Laden auf ironwood-aussen-vermietet (32, 2): massstab 1 → mindestens 1.18
- iw5Laden auf ironwood-aussen-vermietet (16, 19): massstab 1 → mindestens 1.18
- iw5Laden auf ironwood-aussen (32, 2): massstab 1 → mindestens 1.18
- iw5Laden auf ironwood-aussen (16, 19): massstab 1 → mindestens 1.18
- mf2Waschsalon auf cedar-creek-aussen-samstag (12, 10): massstab 1 → mindestens 1.18
- mf2Waschsalon auf cedar-creek-aussen (12, 10): massstab 1 → mindestens 1.18
- mf4Diner auf desert-springs-aussen-meisterschaft (9, 7): massstab 1 → mindestens 1.18
- mf4Diner auf desert-springs-aussen (9, 7): massstab 1 → mindestens 1.18
- mf4Diner auf maple-falls-aussen (30, 14): massstab 1 → mindestens 1.18
- mf4VillaLila auf maple-falls-aussen (11, 10): massstab 1 → mindestens 1.05
- mf4VillaRot auf maple-falls-aussen (21, 10): massstab 1 → mindestens 1.05
- mf4VillaWhitlock auf maple-falls-aussen (1, 10): massstab 1 → mindestens 1.05
- rv5Cafe auf riverton-aussen-nachspiel (42, 27): massstab 1 → mindestens 1.18
- rv5Cafe auf riverton-aussen-tische-kaputt (42, 27): massstab 1 → mindestens 1.18
- rv5Cafe auf riverton-aussen-trainingszentrum (42, 27): massstab 1 → mindestens 1.18
- rv5Cafe auf riverton-aussen-unterschriften (42, 27): massstab 1 → mindestens 1.18
- rv5Cafe auf riverton-aussen (42, 27): massstab 1 → mindestens 1.18
- sa8Eisenwaren auf silicon-bay-altstadt (22, 32): massstab 1 → mindestens 1.18
- sa8Polizei2 auf silicon-bay-altstadt (8, 8): massstab 1 → mindestens 1.25
- sb5Leuchtturm auf silicon-bay-hafen (56, 21): massstab 1 → mindestens 1.11
- ws5Rasthaus auf weg-ironwood-silicon-raststaette (134, 7): massstab 1 → mindestens 1.18
