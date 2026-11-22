# Brettbeispiele im Dialog (22.11.2026, mittel-3)

Wunsch des Autors: Erklärt eine Figur ein Schachkonzept, eine Regel oder ein Werkzeug des Buches,
zeigt sie es an einem Beispiel auf dem Brett, sofern sie plausibel ein Brett dabei hat.

Bestandsaufnahme mit `python -m pipeline.abenteuer.brettbeispiel --bericht …`: 83 Fundstellen,
14 davon mit Brett, dazu drei Zeilen in Mamas Erinnerung (Spieß in drei Bildern). Die übrigen
stehen mit Grund in `pipeline/abenteuer/brettbeispiel_ohne.py`. Begriffe aus dem Glossar des Buches;
allgemeine Wörter (Zeit, Matt, Figur) und Alltagswörter (Loch, Flügel, Batterie) zählen nicht.

## Die 15 Beispiele

| Kennung             | Konzept                          | Stellung                     | Wer zeigt es                                     |
| ------------------- | -------------------------------- | ---------------------------- | ------------------------------------------------ |
| springergabel       | Gabel                            | Buch 7.2                     | Lily am Kreidebrett (Maple Falls)                |
| springerfarbe       | Springerzug                      | eigene                       | Mrs. Calloway, Brett auf dem Tischchen (Stufe D) |
| bauerngabel         | Gabel                            | eigene                       | Slick im Pavillon (Riverton)                     |
| damengabel          | Doppelangriff                    | Buch 7.1                     | Tamsin im Pavillon                               |
| fesselung           | Fesselung                        | eigene                       | Big Joe in der Kantine (Ironwood)                |
| turmspiess          | Spieß                            | Buch 7.6                     | Priya in der Kantine                             |
| mamaspiess          | Spieß                            | eigene, nach Mamas Erzählung | Mama im Wohnzimmer (drei Bilder)                 |
| opposition          | Opposition                       | eigene                       | Ward in der Hütte (Summit City)                  |
| quadrat             | Quadratregel                     | Buch 8.35                    | Kit in der Hütte                                 |
| turmhinterfreibauer | Freibauer, Tarrasch-Regel        | eigene                       | Haraldsen in der Hütte                           |
| anastasia           | Anastasia-Matt                   | Buch 7.37                    | Mae in der Bibliothek (Cedar Creek)              |
| zentrum             | Zentrum, Entwicklung, König      | eigene (Italienisch, 4.O-O)  | Theo in der Akademie (Silicon Bay)               |
| damengambit         | Gambit                           | eigene (1.d4 d5 2.c4)        | Mama in der Kantine                              |
| schach960           | Grundreihe in Schach960          | eigene                       | Bläser im Musikhaus (Port Delacroix)             |
| angreiferzaehlen    | Angreifer und Verteidiger zählen | eigene                       | Ambrose in der Wüste (Brett aus Licht)           |

Buchstellungen stammen aus den App-Daten (FEN, Pfeile), der Buchtext ist nicht kopiert. Wo das Buch
nur volle Bretter hat (Fesselung, Opposition: 15 bis 32 Steine), steht eine einfache Stellung mit
wenigen Steinen (Kinder).

## Alle Fundstellen

| Stelle                                                 | Sprecher  | Konzept             | Brett                                                                                                                  |
| ------------------------------------------------------ | --------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| capital-arena-halle.ink:122 (vorrunde_naechste)        | erzaehler | Gabel               | ohne: kein Erklären: Der Begriff fällt nebenbei (Erzähler stellt Gegner vor)                                           |
| capital-arena-halle.ink:226 (pause_nach_runde2)        | ambrose   | Stiller Zug         | ohne: kein Erklären: Der Begriff fällt nebenbei (Rückblick auf Partien)                                                |
| capital-arena-halle.ink:229 (pause_nach_runde2)        | ambrose   | Stiller Zug         | ohne: kein Erklären: Der Begriff fällt nebenbei (Rückblick auf Partien)                                                |
| capital-arena-halle.ink:363 (halbfinale_turm)          | erzaehler | Regel oder Werkzeug | ohne: Partie läuft: Das echte Brett steht da                                                                           |
| capital-arena-halle.ink:478 (vor_dem_finale_mama)      | mutter    | Grundreihe          | ohne: kein Erklären: Der Begriff fällt nebenbei (Ratschlag vor dem Finale)                                             |
| capital-arena-halle.ink:566 (marcus)                   | marcus    | Gabel               | ohne: kein Erklären: Der Begriff fällt nebenbei (Marcus stellt sich vor)                                               |
| capital-arena-halle.ink:572 (marcus)                   | marcus    | Gabel               | ohne: kein Erklären: Der Begriff fällt nebenbei (Marcus stellt sich vor)                                               |
| cedar-creek-bibliothek.ink:331 (mae_alltag)            | mae       | Erstickungsmatt     | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung                                                        |
| cedar-creek-bibliothek.ink:333 (mae_alltag)            | mae       | Erstickungsmatt     | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung                                                        |
| cedar-creek-bibliothek.ink:381 (clubkampf_bauer)       | erzaehler | Regel oder Werkzeug | ohne: Partie läuft: Das echte Brett steht da                                                                           |
| cedar-creek-bibliothek.ink:387 (clubkampf_bauer)       | erzaehler | Grundreihe          | ohne: Partie läuft: Das echte Brett steht da                                                                           |
| cedar-creek-waschsalon.ink:93 (boateng_alltag)         | boateng   | Erstickungsmatt     | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung                                                        |
| crossroads-aussen.ink:131 (rosie)                      | rosie     | Doppelangriff       | ohne: Vergleich im Alltag, keine Erklärung am Brett (scharf wie ein Doppelangriff)                                     |
| crossroads-raststaette.ink:217 (varianten_tisch)       | erzaehler | Grundreihe          | ohne: kein Erklären: Der Begriff fällt nebenbei (Erzähler am Variantentisch)                                           |
| crossroads-raststaette.ink:252 (tisch_nach_partie)     | ambrose   | Grundreihe          | ohne: kein Erklären: Der Begriff fällt nebenbei (Rat nach der Partie)                                                  |
| desert-springs-antiquariat.ink:62 (okoro_kiste)        | erzaehler | Fesselung           | ohne: Rätsel folgt: Ein Brett verriete die Lösung (Siegelstellung)                                                     |
| desert-springs-garage.ink:157 (clubkampf_sturm)        | ambrose   | Regel oder Werkzeug | ohne: Partie läuft: Das echte Brett steht da                                                                           |
| desert-springs-garage.ink:259 (mira_erinnerung)        | erzaehler | Offene Linie        | ohne: Erinnerung mit eigenem Bild (#bild:stellung18)                                                                   |
| desert-springs-garage.ink:288 (mira_nach_erinnerung)   | erzaehler | Regel oder Werkzeug | ohne: Partie läuft: Das echte Brett steht da                                                                           |
| ghost-town-saloon.ink:78 (victor_aufstellen)           | ambrose   | Gambit              | ohne: Die Fernpartie wird gleich am echten Brett nachgespielt                                                          |
| goldmine.ink:59 (lore)                                 | erzaehler | Freibauer           | ohne: Vergleich im Alltag, keine Erklärung am Brett (Turm hinter der Lore)                                             |
| hochebene.ink:58 (kira_regel)                          | kira      | Regel oder Werkzeug | ohne: Spielvariante mit eigenen Figuren, die der Figurensatz nicht hat (Falke und Bison)                               |
| hochebene.ink:59 (kira_regel)                          | kira      | Grundreihe          | ohne: Spielvariante mit eigenen Figuren, die der Figurensatz nicht hat (Falke und Bison)                               |
| hochebene.ink:94 (kira_alltag)                         | kira      | Grundreihe          | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung                                                        |
| ironwood-kantine.ink:103 (big_joe_erkennt)             | bigJoe    | Fesselung           | `#brett:fesselung`                                                                                                     |
| ironwood-kantine.ink:104 (big_joe_erkennt)             | priya     | Fesselung           | `#brett:turmspiess.1`                                                                                                  |
| ironwood-kantine.ink:138 (big_joe_reihe_offen)         | bigJoe    | Fesselung           | ohne: kein Erklären: Der Begriff fällt nebenbei (stellt Hank und Priya vor)                                            |
| ironwood-kantine.ink:141 (big_joe_reihe_offen)         | bigJoe    | Spieß               | ohne: kein Erklären: Der Begriff fällt nebenbei (stellt Hank und Priya vor)                                            |
| ironwood-kantine.ink:174 (big_joe_clubkampf)           | mutter    | Grundreihe          | ohne: kein Erklären: Der Begriff fällt nebenbei (Zuruf im Clubkampf)                                                   |
| ironwood-kantine.ink:223 (big_joe_nach_sieg)           | bigJoe    | Grundreihe          | ohne: kein Erklären: Der Begriff fällt nebenbei (Rückblick)                                                            |
| ironwood-kantine.ink:262 (big_joe_alltag)              | bigJoe    | Fesselung           | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung                                                        |
| ironwood-kantine.ink:431 (clubkampf_stimmt_es)         | erzaehler | Grundreihe          | ohne: Partie läuft: Das echte Brett steht da                                                                           |
| ironwood-kantine.ink:454 (mama_karte)                  | mutter    | Zentrum             | `#brett:damengambit`                                                                                                   |
| ironwood-kantine.ink:466 (mama_alltag)                 | mutter    | Grundreihe          | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung                                                        |
| ironwood-kantine.ink:492 (hank_reihe)                  | hank      | Fesselung           | ohne: Rätsel folgt: Ein Brett verriete die Lösung (Fesselungen)                                                        |
| ironwood-kantine.ink:505 (priya)                       | priya     | Spieß               | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung (Spieß bei Big Joe gezeigt)                            |
| ironwood-kantine.ink:515 (priya)                       | priya     | Fesselung           | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung (Spieß bei Big Joe gezeigt)                            |
| ironwood-kantine.ink:520 (priya_reihe)                 | priya     | Spieß               | ohne: Rätsel folgt: Ein Brett verriete die Lösung (Spieße)                                                             |
| ironwood-kantine.ink:560 (hank_reihe_danach)           | hank      | Spieß               | ohne: kein Erklären: Der Begriff fällt nebenbei (nach der Runde)                                                       |
| ironwood-kantine.ink:566 (priya_reihe_danach)          | priya     | Spieß               | ohne: kein Erklären: Der Begriff fällt nebenbei (nach der Runde)                                                       |
| ironwood-museum.ink:59 (postsack)                      | erzaehler | Fesselung           | ohne: Rätsel folgt: Ein Brett verriete die Lösung (Siegelstellung als #bild)                                           |
| ironwood-museum.ink:61 (postsack)                      | erzaehler | Fesselung           | ohne: Rätsel folgt: Ein Brett verriete die Lösung (Siegelstellung als #bild)                                           |
| kuerbishof.ink:79 (kuerbiswaage)                       | omaMiller | Umwandlung          | ohne: Vergleich im Alltag, keine Erklärung am Brett (Bauer kurz vor der Umwandlung)                                    |
| lockport-aussen.ink:101 (kai_auswahl)                  | ruben     | Gabel               | ohne: Vergleich im Alltag, keine Erklärung am Brett (beim Angeln)                                                      |
| maple-falls-aussen.ink:193 (lily_danke)                | lily      | Gabel               | `#brett:springergabel`                                                                                                 |
| maple-falls-aussen.ink:201 (lily_alltag)               | lily      | Gabel               | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung                                                        |
| maple-falls-aussen.ink:282 (calloway_d)                | calloway  | Regel oder Werkzeug | `#brett:springerfarbe`                                                                                                 |
| maple-falls-park.ink:97 (bibliothekar_brief)           | ambrose   | Gambit              | ohne: kein Erklären: Der Begriff fällt nebenbei (Ambrose liest einen Brief)                                            |
| maple-falls-wohnzimmer.ink:229 (mama_foto)             | mutter    | Spieß               | `#brett:mamaspiess.2`                                                                                                  |
| maple-falls-wohnzimmer.ink:268 (mutter_alltag)         | mutter    | Grundreihe          | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung                                                        |
| port-delacroix-musikhaus.ink:91 (blaeser_regel)        | blaeser   | Grundreihe          | `#brett:schach960`                                                                                                     |
| port-delacroix-musikhaus.ink:93 (blaeser_regel)        | blaeser   | Regel oder Werkzeug | ohne: Rochade in Schach960: Grundreihe ist gezeigt, die Rochade folgt im Spiel                                         |
| port-delacroix-musikhaus.ink:94 (blaeser_regel)        | blaeser   | Regel oder Werkzeug | ohne: Rochade in Schach960: Grundreihe ist gezeigt, die Rochade folgt im Spiel                                         |
| port-delacroix-musikhaus.ink:103 (blaeser_set1)        | blaeser   | Grundreihe          | ohne: Rätsel folgt: Ein Brett verriete die Lösung (Set folgt mit eigener Grundreihe)                                   |
| port-delacroix-musikhaus.ink:153 (blaeser_alltag)      | blaeser   | Regel oder Werkzeug | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung                                                        |
| port-delacroix-musikhaus.ink:186 (set1_danach)         | blaeser   | Grundreihe          | ohne: kein Erklären: Der Begriff fällt nebenbei                                                                        |
| port-delacroix-musikhaus.ink:211 (set2_danach)         | blaeser   | Grundreihe          | ohne: kein Erklären: Der Begriff fällt nebenbei                                                                        |
| port-delacroix-musikhaus.ink:234 (set3_danach)         | blaeser   | Grundreihe          | ohne: kein Erklären: Der Begriff fällt nebenbei                                                                        |
| port-delacroix-turnhalle.ink:227 (odile_nach_partie)   | odile     | Königsflügel        | ohne: kein Erklären: Der Begriff fällt nebenbei (Rückblick)                                                            |
| riverton-pavillon.ink:82 (slick_erstes_treffen)        | slick     | Gabel               | `#brett:bauerngabel.1`                                                                                                 |
| riverton-pavillon.ink:252 (tamsin_erstes_treffen)      | tamsin    | Gabel               | `#brett:damengabel`                                                                                                    |
| riverton-pavillon.ink:361 (ray_mulde)                  | ambrose   | Gabel               | ohne: Vergleich im Alltag, keine Erklärung am Brett (zwei Briefe; Gabel im Pavillon gezeigt)                           |
| silicon-bay-akademie.ink:200 (theo_karte)              | theo      | Entwicklung         | `#brett:zentrum`                                                                                                       |
| summit-city-aussen.ink:185 (drachenfest_regel)         | erzaehler | Regel oder Werkzeug | ohne: Spielvariante mit eigenen Figuren, die der Figurensatz nicht hat (Drache)                                        |
| summit-city-bergstation.ink:240 (victor_gabel)         | victor    | Gabel               | ohne: Partie läuft: Das echte Brett steht da                                                                           |
| summit-city-huette.ink:108 (ward_lektion)              | ward      | Opposition          | `#brett:opposition`                                                                                                    |
| summit-city-huette.ink:366 (victor_krise)              | erzaehler | Opposition          | ohne: Partie läuft: Das echte Brett steht da                                                                           |
| summit-city-huette.ink:408 (kit_karte)                 | kit       | Freibauer           | ohne: Partiekarte mit Aufzählung; Quadrat und Opposition sind gezeigt                                                  |
| summit-city-huette.ink:421 (kit_reihe)                 | kit       | Regel oder Werkzeug | `#brett:quadrat`                                                                                                       |
| summit-city-huette.ink:422 (kit_reihe)                 | kit       | Opposition          | ohne: Aufzählung nach dem Quadrat; Opposition zeigt Ward                                                               |
| summit-city-huette.ink:459 (haraldsen_karte)           | haraldsen | Freibauer           | ohne: Partiekarte; Turm hinter dem Freibauern zeigt Haraldsen in seiner Reihe                                          |
| summit-city-huette.ink:518 (haraldsen_reihe)           | haraldsen | Freibauer           | `#brett:turmhinterfreibauer`                                                                                           |
| weg-cedar-riverton.ink:92 (tafel)                      | ambrose   | Doppelangriff       | ohne: Rätsel folgt: Ein Brett verriete die Lösung (Tafel mit drei Diagrammen)                                          |
| weg-delacroix-desert.ink:49 (holloway)                 | holloway  | Regel oder Werkzeug | ohne: Vergleich im Alltag, keine Erklärung am Brett (Wanderin am Wasserrohr, kein Brett)                               |
| weg-delacroix-desert.ink:225 (versoehnung_lektion)     | ambrose   | Regel oder Werkzeug | `#brett:angreiferzaehlen`                                                                                              |
| weg-ghost-capital.ink:198 (weltschachtag_danach)       | erzaehler | Rochade             | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung                                                        |
| weg-ghost-capital.ink:232 (odette_erstes)              | odette    | Gambit              | ohne: kein Erklären: Der Begriff fällt nebenbei (Gambit heißt ihr Wohnmobil)                                           |
| weg-ghost-capital.ink:326 (odette_danach)              | odette    | Gambit              | ohne: Zufallszeile; das Beispiel steht bei der ersten Erklärung                                                        |
| weg-maple-cedar.ink:285 (ereignis_flohmarkt)           | erzaehler | Gambit              | ohne: kein Erklären: Der Begriff fällt nebenbei (Wohnmobil Gambit)                                                     |
| weg-maple-cedar.ink:299 (flohmarkt_angebot)            | odette    | Patt                | ohne: Rätsel folgt: Ein Brett verriete die Lösung (Matt in einem Zug)                                                  |
| weg-maple-cedar.ink:534 (flohmarkt_rueckmeldung)       | odette    | Patt                | ohne: kein Erklären: Der Begriff fällt nebenbei (nach dem Rätsel)                                                      |
| weg-riverton-ironwood.ink:266 (kreidespringer_geloest) | erzaehler | Grundreihe          | ohne: Das Rätsel ist eben gelöst, sein Brett war da                                                                    |
| weg-summit-crossroads.ink:65 (bell_regel_erstmals)     | ambrose   | Regel oder Werkzeug | ohne: Spielvariante mit eigenen Figuren, die der Figurensatz nicht hat (Atomschach; Zählen zeigt Ambrose in der Wüste) |
