# Auftrag mittel-1: Dialoge und Quests für Weg 10, Ghost Town, Weg 11, Capital Arena, Bayou

**Stand:** offen (Haupt-Chat, 08.11.2026, achtzehnter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** die Ink-Dateien dieser Orte und der Erinnerung `erinnerung-siedlung.ink` (neu),
`port-delacroix-aussen.ink` (nur `bayou`), `port-delacroix-musikhaus.ink` (nur `blaeser`),
`quests.json`, `runden.json`, `begegnungen.json`, `funde.json`, `laeden.json`, `texte/de.json` (nur
neue Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen`, Simulation

## Ziel

Dialoge, Quests, Runden, Begegnungen für `wegPinewoodGhost`, `ghostTown` (Fernpartie mit Victor,
Flashback 1866 als Erinnerung, Duell-FEN aus Bibel Abschnitt 35), `wegGhostCapital`, `capitalArena`
(Landesmeisterschaft: Vorrunde als vier Begegnungen mit Punkten in Ink, Novas Aussage, Halbfinale
gegen Kade mit `abgelenktAb` und `freieKarten`, Finale ohne Karten nach R28, Ambroses Abschied mit
`zeigeAbspann()`), `bayou`. mittel-2 schreibt parallel Weg 7 bis Pinewood Camp. Neue Einträge in
gemeinsamen Dateien in einem eigenen Block.

Neue Technik, die ihr in Akt 4 nutzen könnt (Haupt-Chat, 8.11.2026, Einzelheiten in
`docs/spiel/ENTSCHEIDUNGEN.md`): Ink-Funktion `zeigeAbspann()` (Abspann nach dem Dialog);
Begegnungsfelder `freieKarten` (Halbfinale: `["mentorzug"]`, setzt `mentorzugFreiGespielt`),
`abgelenktAb {halbzug, faktor}` (Stärkewechsel, Halbfinale) und `variante: "blind"` (Blindschach);
Runden mit `erinnerung` (Zugerraten einer Klassikerpartie) und den Themen `falle`, `struktur`,
`endspiel`; Siegzähler `siege<Begegnung>`; Turnierrunden ohne neue Technik als Begegnungen mit
Punkten in Ink (`ausgang<Begegnung>`).

## Bericht

(vom Helfer auszufüllen)

## Bericht des letzten Auftrags, zur Nachlese

**Fertig:**

- **13 Orte** in `orte.json` (Staffel 2): Städte `summitCity` (Nr. 8, Club 8), `crossroads` (9),
  `pinewoodCamp` (10), `ghostTown` (11), `capitalArena` (12); Wege `wegDesertSummit`,
  `wegSummitCrossroads`, `wegCrossroadsPinewood`, `wegPinewoodGhost`, `wegGhostCapital`; die
  Abzweigung `hochebene` und die Rückkehr `bayou` (L5) als Ort-Art `weg`; die Erinnerung
  `erinnerungSiedlung` (Szene 99, Sepia) als Ort-Art `erinnerung`. 25 Karten, alle Übergänge in
  beiden Richtungen, Hauptroute Desert Springs → Summit City → Crossroads → Pinewood Camp → Ghost
  Town → Capital Arena. Sperren: Weg 8 nach der Nadel von Summit City (`nadelSummitCity`), Weg 11
  nach der Fernpartie (`fernpartieGespielt`).
- **Club 8** „Endspielrunde in der Berghütte“: Kapitel 8 und 9, Chefin Ward, Mitglieder Kit und
  Haraldsen, zwölf Buchübungen aus 07 (Opposition bis falscher Läufer), Themen `endspiel` und
  `umwandlung`.
- **12 Gegner** in `gegner.json` mit Steckbrief: Ward (Clubchefin, E + 640, Endspiel +1,
  Eröffnung −1, Schwäche Tempoverlust, Damengambit mit 25 % Abweichung), Kit und Haraldsen
  (Clubmitglieder, Endspiel +1), Sol (Straße, A − 50), Victor frei (Story, E + 400, Szene 88),
  Hollis (Straße, A − 100), die Turniergegner Bea (E + 550), Marcus (E + 583, blinder Fleck
  stille Züge), Nova (E + 617), Tobias (E + 650), Kade (E + 650, `menschlich: false`) und Victor im
  Finale (E + 700). Die Turnierstärken sind die Werte der Bronze-Liga; die Liga legt nach R22
  ihren Aufschlag darauf. Keiner ist gegen Sprüche immun (Bibel: keine Sprüche im Turnier, Sol
  nicht immun).
- **4 Begegnungen** in `begegnungen.json`: `summitCity.clubkampf` (Wahl der Zeit, Karten erlaubt),
  `summitCity.victorFrei` (Grundstellung, ohne Uhr, Karten erlaubt), `summitCity.sol`
  (Stellungsduell 3 + 2), `pinewoodCamp.hollis` (Stellungsduell ohne Uhr).
- **62 Textschlüssel** (Orte, Karten, Figuren, Club, `steckbrief.fleck.ruhig` für Marcus).
- Prüfungen: pytest 470 bestanden (die neuen Karten sind noch nicht gezeichnet und werden
  übersprungen), `npm run pruefen` grün, Abenteuerpaket baut.

**Entscheidungen:**

1. **Stellungen der Straßenduelle, geprüft mit Stockfish 19:** Die Bibel nennt für Sol 8.44 oder
   8.48; beide sind zu groß (8.44: +2,84 bei Tiefe 28, 8.48: +6,1). Kein Diagramm aus Kapitel 8 mit
   Weiß am Zug liegt bei etwa +1 (alle Werte zwischen 0 und +0,4 oder über +2,4). Aus Kapitel 9
   lagen 9.41 und 9.53 bei +1,1 und +0,8, aber beide sind theoretisch remis (falscher Läufer,
   Randbauer). **Sol** spielt deshalb **6.21** (+0,84 bei Tiefe 24), **Hollis** wie in der Bibel
   **6.14** (+0,83 bei Tiefe 24); 6.5 bleibt bei Batiste.
2. **Hochebene neutral (Q21-1 offen):** Ort `hochebene` mit den Karten `felsentuerme` und `schule`
   (eine Schule passt zu beiden Antworten), noch ohne Figuren und ohne Begegnung.
3. **Varianten und Meisterschaft ohne Begegnungen:** Figuren und Auslöser stehen (Earl, Bell, Ray,
   Greta, Juniper, Abe, Theron, die Bläserin im Musikhaus, Drachenbrunnen, Varianten-Tisch,
   Lagerfeuer, Turniertafel). Begegnungen für L1 bis L10, für die Vorrunde, das Halbfinale und das
   Finale folgen mit der neuen Technik (Bibel, Abschnitt 34). Die Gegnerprofile der Meisterschaft
   sind schon da.
4. **Fernpartie ohne Begegnung:** Die Endspielstellung entsteht erst mit der Engine (Folgeauftrag
   Fernpartie, mittel-2); Victor im Saloon hat deshalb noch keinen Gegner-Eintrag. Für die Partie
   kann `summitCity.victor` (E + 400) dienen, wie es die Bibel verlangt.
5. **Anschluss an Akt 3:** Neue Auslöser in bestehenden Orten: `desertSprings.highway` (zum Weg 7,
   wenn `endeAkt3Gesehen`), `portDelacroix.bayou` (zum Bayou, wenn `musikhausOffen`) und die Figur
   `portDelacroix.blaeser` im Musikhaus (L1). Die Karten von Desert Springs und Port Delacroix sind
   schon gezeichnet; die Rückwege zielen deshalb vorerst auf vorhandene Objekte (`bahnhof` und
   `deich`). Sobald niedrig-1 die Objekte `highway` und `bayou` ergänzt, sollen die Rückwege
   dorthin zeigen.
6. **Flashback in Ghost Town:** Der Übergang `abzeichen` im Saloon führt nach dem Fund des
   Postreiterabzeichens (`abzeichenGefunden`) in die Erinnerung; `rueckkehr` führt zurück an
   dieselbe Stelle.
7. **Porträts:** `portraets/<name>.svg` wie bisher; Victor und Nova nutzen ihre vorhandenen Bilder.

**Zu zeichnende Karten (für niedrig-1).** 25 Karten; je Karte ein `start` für die erste Karte eines
Weges, sonst Ankunft an den genannten Objekten:

| Karte                                                          | Datei                                              | Art   | Objekte (Figuren und Auslöser)                                                                                              |
| -------------------------------------------------------------- | -------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------- |
| `wegDesertSummit.diner` (Diner an der Wüstenstraße)            | `karten/weg-desert-summit-diner.json`              | außen | earl; start, zurueckDesert, tafel, fundNeonK, weiterBergstrasse                                                             |
| `wegDesertSummit.bergstrasse` (Bergstraße)                     | `karten/weg-desert-summit-bergstrasse.json`        | außen | –; zurueckDiner, abzweigHochebene, weiterSummit                                                                             |
| `hochebene.felsentuerme` (Felsentürme)                         | `karten/hochebene-felsentuerme.json`               | außen | –; start, zurueckBergstrasse, weiterSchule                                                                                  |
| `hochebene.schule` (Schule am Rand der Hochebene)              | `karten/hochebene-schule.json`                     | außen | –; zurueckFelsentuerme                                                                                                      |
| `summitCity.aussen` (Summit City, Talstation)                  | `karten/summit-city-aussen.json`                   | außen | sol; wegDesert, huetteTuer, bergladenTuer, seilbahnTal, drachenbrunnen, wegCrossroads                                       |
| `summitCity.huette` (Hütte der Großmeisterin)                  | `karten/summit-city-huette.json`                   | innen | ward, kit, haraldsen; huetteAusgang, pokal, kaminfeuer                                                                      |
| `summitCity.bergstation` (Bergstation der Seilbahn)            | `karten/summit-city-bergstation.json`              | innen | victor; seilbahnBerg, fundMurmeltierpfeife                                                                                  |
| `summitCity.bergladen` (Bergladen)                             | `karten/summit-city-bergladen.json`                | innen | –; bergladenAusgang, theke                                                                                                  |
| `wegSummitCrossroads.geysirbecken` (Geysirbecken)              | `karten/weg-summit-crossroads-geysirbecken.json`   | außen | bell; start, zurueckSummit, tafel, fundBisonhaar, bisons, weiterPraerie                                                     |
| `wegSummitCrossroads.praerie` (Prärie)                         | `karten/weg-summit-crossroads-praerie.json`        | außen | ray; zurueckGeysirbecken, sturmkeller, weiterCrossroads                                                                     |
| `crossroads.aussen` (Crossroads, Kreuzung)                     | `karten/crossroads-aussen.json`                    | außen | slick, mira, bigJoe, rosie; wegSummit, raststaetteTuer, wegweiser, wegPinewood                                              |
| `crossroads.raststaette` (Raststätte von Darlene)              | `karten/crossroads-raststaette.json`               | innen | darlene, nova; raststaetteAusgang, variantenTisch, postkarten                                                               |
| `wegCrossroadsPinewood.huetten` (Schutzhütte am Fernwanderweg) | `karten/weg-crossroads-pinewood-huetten.json`      | außen | greta; start, zurueckCrossroads, tafel, weiterRiesenbaeume                                                                  |
| `wegCrossroadsPinewood.riesenbaeume` (Unter den Riesenbäumen)  | `karten/weg-crossroads-pinewood-riesenbaeume.json` | außen | –; zurueckHuetten, rangerhaus, weiterCamp                                                                                   |
| `pinewoodCamp.aussen` (Pinewood Camp am See)                   | `karten/pinewood-camp-aussen.json`                 | außen | ezra, hollis, dex, mae, lou, tamsin; wegCrossroads, lagerfeuer, kiosk, wegGhost                                             |
| `wegPinewoodGhost.canyonrand` (Canyonrand)                     | `karten/weg-pinewood-ghost-canyonrand.json`        | außen | juniper; start, zurueckCamp, tafel, weiterStaubstrasse                                                                      |
| `wegPinewoodGhost.staubstrasse` (Staubstraße)                  | `karten/weg-pinewood-ghost-staubstrasse.json`      | außen | –; zurueckCanyonrand, weiterGhost                                                                                           |
| `ghostTown.aussen` (Ghost Town, Hauptstraße)                   | `karten/ghost-town-aussen.json`                    | außen | pruitt; wegPinewood, saloonTuer, grab, sternenhimmel, wegCapital                                                            |
| `ghostTown.saloon` (Saloon)                                    | `karten/ghost-town-saloon.json`                    | innen | victor; saloonAusgang, fernpartieBrett, abzeichen                                                                           |
| `erinnerungSiedlung.huette` (Bretterhütte, 1866)               | `karten/erinnerung-siedlung-huette.json`           | innen | postreiter; ankunft, kerze, rueckkehr                                                                                       |
| `wegGhostCapital.seeufer` (Seeufer)                            | `karten/weg-ghost-capital-seeufer.json`            | außen | –; start, zurueckGhost, tafel, weiterLeuchtturm                                                                             |
| `wegGhostCapital.leuchtturm` (Leuchtturm)                      | `karten/weg-ghost-capital-leuchtturm.json`         | außen | abe; zurueckSeeufer, fundLinse, weiterCapital                                                                               |
| `capitalArena.aussen` (Capital Arena, Vorplatz)                | `karten/capital-arena-aussen.json`                 | außen | mama, juno; wegGhost, halleTuer, treppe                                                                                     |
| `capitalArena.halle` (Turnierhalle)                            | `karten/capital-arena-halle.json`                  | innen | turnierleiterin, lin, grahamHale, bea, marcus, nova, tobias, kade, victor; halleAusgang, turniertafel, pressetisch, fanshop |
| `bayou.steg` (Bootssteg im Bayou)                              | `karten/bayou-steg.json`                           | außen | theron; start, zurueckDelacroix, nebel                                                                                      |

**Für die Dialoge (Knoten aus `orte.json`):**

- `bayou.ink`: theron, zurueck_delacroix, nebel
- `capital-arena-aussen.ink`: ankunft_zu_fuss, mama, juno, weg_ghost, halle_betreten, treppe
- `capital-arena-halle.ink`: turnierleiterin, lin, graham_hale, bea, marcus, nova, tobias, kade, victor, turniertafel, pressetisch, fanshop
- `crossroads-aussen.ink`: ankunft_zu_fuss, slick, mira, big_joe, rosie, weg_summit, wegweiser, weg_pinewood
- `crossroads-raststaette.ink`: darlene, nova, varianten_tisch, fund_postkarte
- `desert-springs-aussen.ink`: highway
- `erinnerung-siedlung.ink`: postreiter, kerze, rueckkehr
- `ghost-town-aussen.ink`: ankunft_zu_fuss, pruitt, weg_pinewood, grab, nacht, weg_capital
- `ghost-town-saloon.ink`: victor, brett, fund_abzeichen
- `hochebene.ink`: zurueck
- `pinewood-camp-aussen.ink`: ankunft_zu_fuss, ezra, hollis, dex, mae, lou, tamsin, weg_crossroads, lagerfeuer, kiosk, weg_ghost
- `port-delacroix-aussen.ink`: bayou
- `port-delacroix-musikhaus.ink`: blaeser
- `summit-city-aussen.ink`: ankunft_zu_fuss, sol, weg_desert, seilbahn, drachenfest, weg_crossroads
- `summit-city-bergladen.ink`: theke
- `summit-city-bergstation.ink`: victor, fund_pfeife
- `summit-city-huette.ink`: ward, kit, haraldsen, pokal, kaminfeuer
- `weg-crossroads-pinewood.ink`: greta, zurueck_crossroads, tafel, rangerhaus
- `weg-desert-summit.ink`: earl, zurueck_desert, tafel, fund_neon, abzweig_hochebene
- `weg-ghost-capital.ink`: abe, zurueck_ghost, tafel, fund_linse
- `weg-pinewood-ghost.ink`: juniper, zurueck_camp, tafel
- `weg-summit-crossroads.ink`: bell, ray, zurueck_summit, tafel, fund_bisonhaar, bisons, sturmkeller

**Offen für den Haupt-Chat:**

- Runden für Akt 4 (`runden.json` war nicht freigegeben): `summitCity.reiheKit`,
  `summitCity.reiheHaraldsen`, `summitCity.erinnerungHastings` (`klassik-steinitz-bardeleben`, Weiß
  ab Zug 17), die Tafeln der fünf Wege.
- Läden aus Abschnitt 31 (`summitCity.bergladen`, `crossroads.raststaette`, `pinewoodCamp.kiosk`,
  `capitalArena.fanshop`), Funde aus Abschnitt 30, Quests.
- Thema `endspiel` für Runden ist noch nicht an den Endspieltrainer angeschlossen; bis dahin wirkt
  im Club nur `umwandlung`.

## Bericht des letzten Auftrags, zur Nachlese

**Erledigt.**

1. **Funde:** neun Einträge in `funde.json` mit Name und Text: `anstecker` (5 Münzen),
   `ohrstoepsel`, `zeroTablet` (von mittel-2), `flaschenpost` (10), `muschelMitLoch` (5),
   `erstesBrettMusikhaus` (Extra `brett-musikhaus-am-kai`), `eidechsenhaut` (5),
   `nietenCanyonbruecke`, `halesBrief`. Münzen nach der Fundtabelle der Bibel (Abschnitt 21). Alle
   `gibFund`-Aufrufe sind aktiv, auch in `weg-ironwood-silicon.ink` und `silicon-bay-akademie.ink`.
   Die Dialoge behalten ihre eigenen Merker (Befund 1 von mittel-2: `gefunden<Fund>` würde beim
   Dialogende überschrieben).
2. **Läden:** `siliconBay.foodtruck` (Rosie: Zweite Chance 20, Flüstern 40, Waage 15),
   `portDelacroix.gebaeckstand` (Mrs. Arceneaux: Zweite Chance 20, Fingerzeig 15, Remisangebot 35),
   `desertSprings.antiquariat` (Mr. Okoro: Flüstern 40, Was droht? 60, Zweite Chance 20). Preise wie in
   den Läden von Akt 1 und 2 (11, Abschnitt 7.2). Die drei Figuren öffnen ihren Laden nach dem
   Gespräch (`oeffneLaden`). Keine Sprüche im Laden (Z4), kein Mentor-Zug und keine Vorgabe (G3).
   **Pokerface** wird bei Batistes erstem Sieg zu Zweite Chance (Bibel) und Kühler Kopf, der ruhigen
   Zeitkarte, die zu „ein Gesicht wie das Wasser“ passt. **Schutzengel** wird bei Miss Odile nach der
   Simultan zu „Was droht?“: Diese Karte zeigt, was man verlieren kann.
3. **Buck:** Buck hat die Rolle `strasse`, also schreibt die Hülle beim Sieg schon 10 Münzen gut
   (`MUENZEN.strassensieg`); dafür brauchte es nichts Neues. Startstellung geprüft mit Stockfish 19:
   Abbildung 8.44 (Bauernendspiel, Mehrheit und Durchbruch) steht bei Tiefe 28 auf +2,84 für Weiß,
   über der Grenze von R13 (+0,8 bis +2,5) und weit über „etwa +1“. Abbildung 1.36 steht bei Tiefe
   20 auf +1,10. **Entscheidung:** Buck bleibt bei 1.36, `begegnungen.json` unverändert.
4. **Erinnerung 1858 (Szene 77):** Runde `desertSprings.erinnerung1858` mit
   `klassik-bird-morphy` ab Zug 11 mit Schwarz, Quest `desertSprings.erinnerung1858` (begegnung,
   Fragment 6, 20 Münzen, danach Miras Satz „Das Opfer war richtig!“ und Ambroses Antwort). Angeboten
   wird sie bei Mira nach dem Clubkampf („Ambrose will dir etwas zeigen“), am Abend in der Garage.
   **Entscheidung:** Die Bibel will Ambroses erfundene Partie gegen Hale mit Weiß. Die Sammlung hat
   vor 1866 nur drei Partien, alle schon benutzt. Ambrose erzählt deshalb, er habe 1858 geopfert wie
   Morphy im selben Jahr in London und dann gezögert; der Held spielt Morphys Züge. Das Jahr stimmt,
   und Miras Satz passt genau. Nachteile: Schwarz statt Weiß, und der Schluss ab Zug 17 kommt auch
   in Ironwood vor. Besser wäre eine weitere gemeinfreie Partie aus der Zeit vor 1866 in
   `klassiker.json` (Vorschlag von mittel-2). Den Werkstatt-Flashback musste ich nicht umstellen: er
   nutzt das Erinnerungsformat schon (Unsterbliche ab Zug 1 mit Weiß); `mattbilder` steht nur, weil
   der Test Themen verlangt.
5. **Mentor-Zug (R29):** Die Quest gibt den Mentor-Zug aus Port Delacroix nicht mehr beim Clubkampf,
   sondern bei der Versöhnung (`desertSprings.versoehnung`, Schritt 2, `versoehnung_abend`); Ambrose
   sagt dazu: „Den Mentor-Zug aus Port Delacroix habe ich dir aufgehoben.“ Weil der Wüstenzug erst nach
   der Nadel von Port Delacroix fährt, ist der Sieg dann immer schon errungen. Das erfüllt „erst nach
   der Versöhnung spielbar“ für diese Karte. **Rest für die Hülle:** Mentor-Züge aus früheren Clubs
   kann der Held zwischen Vorwurf und Versöhnung noch spielen. Eine vollständige Sperre bräuchte in
   der Hülle die Regel „Mentor-Zug nicht spielbar, wenn `tiefpunktGesehen` und nicht
   `versoehnungGesehen`“ (beide Dialogvariablen gibt es).

**Prüfungen:** pytest 470 bestanden; `npm run pruefen` vollständig grün (361 Dateien, 2414 Tests);
Abenteuerpaket baut. Simulation von der Fähre bis zum Schild: alle neun Quests von Akt 3 fertig,
Funde, Läden und Karten feuern an der richtigen Stelle. Zufallsdurchläufe aller Knoten ohne Fehler.
`quests.json` und `runden.json` sind mit prettier formatiert (das betraf auch eine Zeile des
Haupt-Chats).

**Weiter offen (nicht in diesem Auftrag):** Fahrkarten und Album-Waren aus Abschnitt 22 der Bibel
(Fährfahrkarte, Zugfahrkarte, Bretthintergrund, Spende, altes Schachbuch) gibt es als Gegenstand oder
Extra noch nicht; die Monatskarte deckt das Reisen ab. Funde ohne Auslöser in `orte.json`:
Trompetenmundstück, Miras Pokal, Holzdame, Altes Foto (Szene 68).

## Bericht des letzten Auftrags, zur Nachlese

**Erledigt (erster Push: Weg 5 und Port Delacroix).**

- Fünf Ink-Dateien: `weg-silicon-delacroix.ink` (Szene 62: Schiffskoch Mr. Ruiz mit Uhr, Mr. Guidry
  mit Weisheit Kapitel 5, Rätseltafel, Funde Flaschenpost und Muschel, Mama an Bord),
  `port-delacroix-aussen.ink` (Ankunft, Bretter sammeln an vier Häusern, Batiste, Mrs. Arceneaux,
  Wüstenzug), `port-delacroix-turnhalle.ink` (Szene 63 Vorwurf, Reihen bei Remy und Lou, Szene 67
  Clubkampf ohne Karten, Szene 69 Simultan mit Remys Entschuldigung), `port-delacroix-werkstatt.ink`
  (Szene 66 Flashback an der Werkbank, Szene 68 Nachfahren mit Foto und Céleste),
  `port-delacroix-musikhaus.ink` (Szene 70 Das Schild). Alle Knoten aus `orte.json` sind vorhanden.
- Fünf Runden in `runden.json`: `wegSiliconDelacroix.tafel` (3 Aufgaben), `portDelacroix.reiheRemy`
  (Bauernstrukturen), `portDelacroix.reiheLou` (Pläne, Läufer), `portDelacroix.simultan` (3 Aufgaben
  Doppelangriff und Fesselung, Kinder der Stadt), `portDelacroix.flashbackWerkstatt` (Zugraten
  `klassik-unsterbliche` ab Zug 1 mit Weiß).
- Fünf Quests in `quests.json`: Hauptquest `portDelacroix.tiefpunkt` (Vorwurf, Remy, Lou, Clubkampf
  mit Szene `akt3.clubnadelPortDelacroix` und Mentor-Zug, Handschlag bei Miss Odile), Nebenquests
  `portDelacroix.wiederaufbau` (hilfe, vier Schritte über drei Besuche, 20 Münzen, Springervorgabe),
  `portDelacroix.nachfahren` (begegnung, Partie gegen Céleste bei jedem Ausgang, Szene
  `akt3.nachfahren`), `portDelacroix.flashbackWerkstatt` (Fragment 5, Szene
  `akt3.flashbackWerkstatt`), `wegSiliconDelacroix.tafelSalon` (raetsel). 20 neue Textschlüssel.
- Prüfungen: Simulation des ganzen Wegs mit Abbruch, Niederlage und Sieg im Clubkampf und
  Niederlage gegen Céleste: alle fünf Quests fertig, keine Sackgasse. Zufallsdurchläufe aller Knoten
  ohne Fehler, keine Zeile über zwei Sätze. pytest 385 bestanden, 85 übersprungen; Abenteuerpaket
  baut. `npm run pruefen`: 2408 von 2409 bestanden. **Ein Test schlägt fehl, bitte im Haupt-Chat
  nachziehen:** `app/src/abenteuer/anbindung/erinnerung.test.ts`, Zeile 20, zählt die Erinnerungen
  in `runden.json` fest mit `toBe(3)`; mit dem Werkstatt-Flashback sind es 4. Mit `toBe(4)` bestehen
  beide Tests der Datei (lokal geprüft). Die Datei gehört nicht zu meinen erlaubten Dateien, deshalb
  habe ich sie nicht geändert.

**Entscheidungen.**

1. _Ambroses Schweigen._ Nach dem Vorwurf hat Ambrose je Szene höchstens einen Satz („Spiel deine
   Partie.“ vor dem Clubkampf, „Hier. Hier war es.“ an der Werkbank, „Das bin ich.“ beim Foto), bis
   die Partie gegen Céleste `ambroseSprichtWieder` setzt. Die Variable setzt der Dialog nach der
   Partie, nicht die Hülle; die Quest wartet auf diesen Knoten.
2. _Vorwurf beim ersten Ansprechen._ Wer in der Turnhalle Odile, Remy oder Lou anspricht, erlebt
   zuerst den Vorwurf. Die Hauptquest beginnt beim Betreten der Turnhalle (Start und erster Schritt
   dürfen nicht gleich sein).
3. _Reihenfolge._ Remy vor Lou vor Miss Odile, wie in den anderen Clubs. Die Nachfahren und der
   Flashback setzen den Vorwurf voraus (sonst bräche Ambrose ein Schweigen, das es noch nicht gibt);
   vorher stellt sich Henri nur vor.
4. _Wiederaufbau mit vier Schritten._ Bretter, Simultan, Dank bei Odile (mit Remys Entschuldigung
   und der Karte Schutzengel), Schild. Das Schild hängt erst, wenn `simultanGedankt` und
   `nadelDesertSprings > 0` gelten; so kann kein Schritt übersprungen werden. Die 30 Münzen der
   Simultan gehen laut Bibel in die Kasse; deshalb keine Münzen für den Helden.
5. _Flashback ohne Sepia-Karte._ `orte.json` durfte ich nicht ändern; der Flashback läuft als
   Zugraten an der Werkbank, Teil 1 (1840) wird erzählt. Das Zugraten-Format kennt kein Endzug; die
   Bibel will Zug 1 bis 11. Vorschlag: Feld `bisZug` im Erinnerungsformat oder eine eigene
   Erinnerungskarte `flashback.werkstatt`.
6. _Geburtsort._ Ambrose sagt bei der Ankunft, er sei hier geboren, nicht in New Orleans; das folgt
   der Zeitlinie 1831 und der Empfehlung im Bibelbericht.

**Fehlt in anderen Dateien (bitte nachtragen, die Aufrufe stehen als Kommentar bereit).**

- `karten.json`: `pokerface` (Batiste, erster Sieg; die Zeile „Mach ein Gesicht wie das Wasser“ steht
  schon in `batiste_nach_sieg`) und `schutzengel` (`port-delacroix-turnhalle.odile_nach_simultan`).
- `funde.json`: `flaschenpost`, `muschelMitLoch` (Weg 5), `erstesBrettMusikhaus`
  (`port-delacroix-musikhaus.schild_aufhaengen`); das Trompetenmundstück aus der Fundtabelle hat noch
  keinen Auslöser in `orte.json`.
- Laden bei Mrs. Arceneaux: noch kein Laden, sie spricht nur.
- Mentor-Zug aus dem Clubkampf: Die Bibel will ihn erst nach der Versöhnung spielbar (R29); die
  Sperre gehört in die Hülle.

**Erledigt (zweiter Push: Weg 6 und Desert Springs).**

- Vier Ink-Dateien: `weg-delacroix-desert.ink` (Szene 71 Mrs. Holloway mit der Goldenen
  Angriffsregel, Kapitel 1, Abschnitt 1.6, Rätseltafel, Fund Eidechsenhaut; Szene 72 Mira auf dem
  Stein; Szene 73 Versöhnung am Felsbogen mit drei Wahlen, 1866 und der Lektion zum romantischen
  Opfer; Fund Nieten J. H.), `desert-springs-aussen.ink` (Ankunft, Szene 74 Buck mit Großes Maul
  beim ersten Sieg, Szene 79 Abend am Motel, Szene 80 Ende von Akt 3 mit Reise nach Port Delacroix
  oder Maple Falls), `desert-springs-garage.ink` (Mira, Tomás, Dot, Szene 75 und 78, Dots Hinweis
  auf das Antiquariat), `desert-springs-antiquariat.ink` (Szene 76 Der Brief). Alle Knoten aus
  `orte.json` sind vorhanden.
- Vier Runden: `wegDelacroixDesert.tafel` (3 Aufgaben, Mattbilder), `desertSprings.reiheTomas`
  (Mattbilder mit Opfer, Übungen a10 und a11), `desertSprings.reiheDot` (Königsangriff,
  Morphy-Checkliste und a14), `desertSprings.siegel` (1 Aufgabe, Fesselung).
- Drei Quests: Hauptquest `desertSprings.versoehnung` (Mira auf dem Stein, Versöhnung, Tomás mit
  Zweiter Chance, Dot, Clubkampf mit Nadel und Mentor-Zug, Abend am Motel, Ende von Akt 3, sieben
  Schritte mit den Szenen `akt3.miraStein` bis `akt3.ende`), `desertSprings.brief` (raetsel,
  Fragment 7, Flüstern), `wegDelacroixDesert.tafelCanyon` (raetsel). 13 neue Textschlüssel.
- Prüfungen: Die Simulation läuft von der Fähre bis zum Schild in Port Delacroix nach der
  Rückreise; alle acht Quests von Akt 3 aus beiden Pushes sind fertig. Dabei sind auch „zu früh am
  Felsbogen“ und eine Niederlage im Clubkampf durchgespielt. Zufallsdurchläufe aller Knoten ohne
  Fehler, pytest grün, Abenteuerpaket baut. `npm run pruefen`: wie im ersten Push bleibt nur der
  Zähltest der Erinnerungen offen.

**Entscheidungen (zweiter Push).**

7. _Der Club wartet auf die Versöhnung._ Die Hauptquest läuft streng der Reihe nach. Deshalb
   stellen Tomás und Dot ihre Reihen erst nach der Versöhnung; vorher schickt Tomás den Helden zu
   Mira in den Canyon oder an den Felsbogen. Die Versöhnung wartet auf Miras Stein („noch früh am
   Tag“). So kann kein Schritt verloren gehen.
8. _Ambrose auf Weg 6._ Seine Zeilen vor der Versöhnung hängen an `ambroseSprichtWieder`. Wer die
   Nachfahren ausgelassen hat, hört ihn erst am Felsbogen wieder; die Versöhnung setzt die Variable
   selbst.
9. _Lektion ohne zwei Bildschirme._ Das romantische Opfer erzählt Ambrose mit zwei Stellungen auf
   dem alten Brett und den Fundstellen (Kapitel 1, Abschnitt 1.6; Kapitel 11, Abschnitt 11.2), ohne
   Buchtext. Eine echte Lektion mit zwei Brettern bräuchte ein eigenes Format in der Hülle.
10. _Mentor-Zug nach der Versöhnung._ Die Sperre R29 endet mit `versoehnungGesehen`; die Hülle
    sollte diese Variable für die Freigabe abfragen.
11. _Brief auch ohne Umschlag._ Wer den Umschlag aus Ironwood hat (`gefundenUmschlag`), sieht, dass
    das Siegel passt; ohne ihn geht die Quest trotzdem. Dots Hinweis startet die Quest.
12. _Mama am Bahnsteig._ Für Szene 80 wartet Mama in Desert Springs am Bahnhof; die Abfahrt bietet
    Port Delacroix (für das Schild) und Maple Falls an.

**Fehlt noch (zweiter Push).**

- `funde.json`: `eidechsenhaut`, `nietenCanyonbruecke`, der Gegenstand „Hales Brief“ (Szene 76,
  Wirkung der Quest `desertSprings.brief`); die Aufrufe stehen als Kommentar bereit.
- `laeden.json`: Laden von Mr. Okoro im Antiquariat (Karten, Fahrkarten, alte Bücher).
- Szene 77 „Erinnerung 1858“: Es gibt noch keine Begegnung und keine Stellung (Folgeauftrag mit der
  Engine); Quest und Dialog fehlen deshalb.
- Buck: Die 10 Münzen aus der Bibel fehlen; Ink kann keine Münzen geben, und `begegnungen.json` hat
  für Buck keine Belohnung. Die Startstellung ist Abbildung 1.36, die Bibel nennt 8.44 (bitte prüfen).
