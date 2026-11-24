# Sitz- und Schlafzustände: Wo muss eine Figur wirklich sitzen? (23.11.2026)

Auftrag des Hauptchats (Nacht): Alle 56 fehlenden PixelLab-Zustände der Seite `fehlende.html`
daraufhin prüfen, ob die Figur dort sitzen oder liegen muss oder ob ein Stehplatz neben dem Möbel
genauso gut erzählt. Ziel: Der Autor muss in PixelLab weniger bauen. Dazu kamen die Befunde von
mittel-1 aus Fotos mit echten Bildern: Ersatzfelder hinter der Wand und unter Dächern, die Mutter um
18 Uhr neben statt auf dem Stuhl, ein Haarschopf zwischen den Nischenbänken des Diners.

## Zurückgebaut am 24.11.2026 (Widerspruch des Autors zu RO51)

Der Autor: „Nicht realistisch, dass Leute ständig neben Sitzgelegenheiten stehen und sich nie
setzen.“ Deshalb gilt wieder:

- Die Sitzblöcke sitzen wieder auf ihrem Möbel (154 Blöcke). Solange eine Person kein Stuhlbild hat,
  steht sie auf dem guten Stehplatz aus `stehplatz.py` daneben (`ohnesitzbild.json`, gefüllt von
  `figurenzustaende --privat`). Kommt das Bild, sitzt sie von selbst.
- Stehend bleiben nur Plätze ohne Stuhl in einer Fassung der Karte (15 Blöcke):
  - Mutter abends und nachts im Wohnzimmer: Ihr Stuhl (18, 6) steht nur am Umzugstag.
  - Big Joe, Graham Hale, Gus, Hank, Priya und Teague nachts in der Kantine: Die geräumte Fassung
    (Akt 3, `ironwood-kantine-logo`) hat keine Stühle. Graham Hale, Gus, Priya und Teague fielen
    erst beim Rückbau auf, weil die Prüfung jetzt jede Fassung sieht.
- Hanks Satz in der Kantine bleibt „steht allein am Ende des Tischs“, bis er ein Sitzbild hat.
- `WARTET_AUF_BILD` enthält wieder alle 56 fehlenden Zustände (54 Stuhl, 2 Liegen); Owen (hat sein Stuhlbild) und statist-18 (Typ Studentin) sind erledigt.
- Für die Bildmappe: `buch/arbeit/zustaende/sitzauftrag.json` (nur lokal) nennt je Bild die
  gebrauchten Sitzrichtungen aus dem Blick des Sitzmöbels; links und rechts sind ein gespiegeltes
  Bild.

Der Rest dieses Berichts beschreibt den Stand vom 23.11.2026.

## Ergebnis (23.11.2026, zurückgebaut)

- Von 56 fehlenden Zuständen bleiben 2: Lucia (Liegen) und Oma Ruth (Liegen), beide im Bett.
- Die 156 Sitzblöcke der Tabelle unten sind Stehplätze neben dem Möbel geworden. Dazu kommen 5 Blöcke
  von Mutter und Big Joe (Abschnitt „Die drei Bildbefunde“), zusammen 161.
- `WARTET_AUF_BILD` (`figurenzustaende_ablauf.py`) enthält nur noch die beiden Betten.
- `app/src/abenteuer/regeln/ohnesitzbild.json` ist leer. Der Privatbau baut nach.
- Prüfungen grün:
  - Tagesabläufe: 0 Befunde, jetzt in jeder Fassung einer Karte.
  - Stehplätze und Ersatzfelder (neuer Dauertest).
  - Figurenzustände: keine neuen Lücken.
  - Verdeckung, Figurensperre, Durchlass, Kopfkachel.

## Vorgehen

- Alle 56 Zustände stammen aus den Tagesabläufen: 158 Blöcke, meist Feierabend (16 bis 21 Uhr) und
  Nacht auf einer Bank, einige im Diner, in der Kantine, im Saloon oder im U-Bahnhof.
- Je Figur das Gespräch gelesen (Knoten aus `orte.json`), gesucht nach Sitzen, Bank, Stuhl,
  Hocker, Bett, Schlafen:
  - Nur Hank erzählt am Ort eines Sitzblocks vom Sitzen. Sein Fall steht im Abschnitt „Die drei
    Bildbefunde“.
  - Dime sagt „Setz dich“ an der Brücke, wo er laut Ablauf steht; seine Bank am Kanalweg ist
    Feierabend.
- Liegen im Bett lässt sich nicht im Stehen erzählen; das bleibt.
- Neuer Stehplatz:
  - Ein guter Platz ist das nächste freie, erreichbare Feld neben dem Möbel. Die Fußmitte liegt in
    keinem Bild eines nicht flachen Möbels: nicht unter Tisch, Dach oder Krone, nicht hinter einer
    Wand, nicht auf einem Tisch.
  - Er gilt in jeder Fassung der Karte und versperrt keinen Weg.
  - Wer zur selben Stunde an derselben Bank stand, schaut den Nachbarn an, sonst zum Betrachter.
  - Dafür trägt ein Block jetzt `blick` (`regeln/tagesablauf.ts`, Test in `tagesablauf.test.ts`).
- Von Hand gesetzt, weil sonst ein Weg zu war:
  - Diner: Juno (8, 10) und Skater Jo (9, 10).
  - Turnhalle: Bläser (16, 14) und Batiste (17, 14).
  - Kantine: Teague (10, 9).
  - Canyonpfad: Holloway (62, 12).
  - Innenstadt: Turnierleiterin (32, 49).

## Die drei Bildbefunde

- **Ersatzfelder außerhalb des Raums** (Diner hinter der rechten Wand, Park unter dem Dach):
  - Ursache: `figurenzustaende_ablauf.nachbarfeld` prüfte nur, ob ein Möbel mit Kollision auf dem
    Feld steht, nicht Wand, Erreichbarkeit oder Bilder darüber.
  - Jetzt wählt es mit `stehplatz.py`: erreichbar, nicht unter oder in einem Bild, kein neuer
    versperrter Weg. Findet es keinen solchen Platz, gibt es kein Ersatzfeld; dann sitzt die Figur
    wie in den Szenen mit angehobenem Standbild, statt auf dem Stuhl zu stehen.
  - Die Aufstellungsprüfung in `tagesablauf.py` setzt die Ersatzfelder jetzt wie die App ein.
  - Dauertest `test_abenteuer_stehplatz.py`.
- **Mutter um 18 Uhr neben dem Stuhl:**
  - Ihr Abendplatz (18, 6) ist nur am Umzugstag ein Stuhl. Nach dem ersten Abend gilt das Wohnzimmer
    mit Esstisch, dort stehen die Stühle auf (13, 6) und (16, 6).
  - Die Prüfung sah bisher nur die Grundkarte. Jetzt prüft `tagesablauf.py` jeden Block in jeder
    Fassung.
  - Mutter steht abends und nachts auf (18, 7).
  - Dabei fielen auch Big Joe und Hank in der Kantine auf: In der geräumten Fassung (Akt 3) gibt es
    keine Stühle. Big Joe steht jetzt auf (29, 10), Hank auf (14, 9).
- **Haarschopf zwischen den Nischenbänken (22 Uhr):**
  - Coach Delgado stand dort, zuerst auf dem alten Ersatzfeld (15, 4) hinter der Wand, nach der
    ersten Umstellung auf (13, 4) im Bild eines Nischentischs.
  - Jetzt steht er auf (10, 4).
  - Dass es nur in einem von zwei Läufen auftrat, passt zur Uhr: Juno und Skater Jo sind nur bis
    22 Uhr dort, Coach bis 1 Uhr.

## Zur Entscheidung (Empfehlungen, nicht umgesetzt)

- Hank: Sein Gespräch sagt „sitzt allein am Ende des Tischs“. In der Szene stand er aber schon vorher
  tagsüber auf (17, 13). Empfehlung: Satz anpassen („steht allein am Ende des Tischs“) oder ihm in
  der Szene einen Stuhl geben; dann braucht er ein Sitzbild.
- Lucia und Oma Ruth könnten im Schlaf unsichtbar sein wie alle anderen Schlafenden; dann bräuchte
  niemand mehr ein neues Bild. Dagegen spricht: Jemand hat die beiden bewusst ins Bett gelegt, und
  ein Bett mit Schlafender erzählt mehr als ein leeres.

## Tabelle

| Figur (Bild)                      | Zustand | Stelle (Möbel), Uhrzeit                                                      | Sitzen nötig | Grund, jetzt                                                                                                                                                                                  |
| --------------------------------- | ------- | ---------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ada (ada)                         | Stuhl   | wegMapleCedar.landstrasse (80, 14) (wg4Bank), 16-21, 21-0, 3-6 Uhr           | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (80, 15) Blick rechts                                                                                                    |
| batiste (batiste)                 | Stuhl   | portDelacroix.turnhalle (20, 13) (pd6Bank), 18-21, 21-1, 4-6 Uhr             | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (17, 14) Blick links                                                                                                     |
| bea (bea)                         | Stuhl   | capitalArena.aussen (23, 45) (ca7Bank), 16-21 Uhr                            | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (24, 45) Blick unten                                                                                                     |
| bea (bea)                         | Stuhl   | capitalArena.ubahnhof (19, 12) (ca9Hocker), 1-6, 21-22 Uhr                   | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (19, 13) Blick unten                                                                                                     |
| blaeser (blaeser)                 | Stuhl   | portDelacroix.turnhalle (19, 13) (pd6Bank), 17-21, 21-1, 4-6 Uhr             | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (16, 14) Blick rechts                                                                                                    |
| boateng (boateng)                 | Stuhl   | cedarCreek.aussen (17, 6) (cc11BahnsteigbankHinten), 16-21, 21-0, 3-6 Uhr    | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (17, 7) Blick unten                                                                                                      |
| celeste (celeste)                 | Stuhl   | portDelacroix.aussen (5, 14) (cc4Bahnbank), 1-6, 18-21, 21-22 Uhr            | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (5, 15) Blick links                                                                                                      |
| coachDelgado (coach-delgado)      | Stuhl   | mapleFalls.diner (14, 4) (mf12NischenbankLinks), 21-1, 4-6 Uhr               | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (10, 4) Blick unten                                                                                                      |
| coachDelgado (coach-delgado)      | Stuhl   | mapleFalls.park (15, 22) (mf6BankSeiteLinks), 18-21 Uhr                      | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (14, 22) Blick unten                                                                                                     |
| dale (dale)                       | Stuhl   | wegRivertonIronwood.kanalweg (12, 38) (mfBank), 2-6, 21-23 Uhr               | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (12, 36) Blick links, (13, 164) Blick unten                                                                              |
| dale (dale)                       | Stuhl   | wegRivertonIronwood.kanalweg (14, 164) (mfBank), 18-21 Uhr                   | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (12, 36) Blick links, (13, 164) Blick unten                                                                              |
| dime (dime)                       | Stuhl   | wegRivertonIronwood.kanalweg (12, 37) (mfBank), 21-2, 5-6 Uhr                | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (11, 36) Blick rechts, (15, 38) Blick unten                                                                              |
| dime (dime)                       | Stuhl   | wegRivertonIronwood.kanalweg (13, 38) (mfBank), 18-21 Uhr                    | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (11, 36) Blick rechts, (15, 38) Blick unten                                                                              |
| dolores (dolores)                 | Stuhl   | jahrmarkt.festplatz (32, 15) (n15TribueneBlickOben), 18-21, 2-6, 21-23 Uhr   | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (32, 16) Blick unten                                                                                                     |
| dunmore (dunmore)                 | Stuhl   | cedarCreek.aussen (30, 30) (cc4Stammbank), 16-21, 21-0, 3-6 Uhr              | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (30, 29) Blick unten                                                                                                     |
| earl (earl)                       | Stuhl   | wegDesertSummit.diner (7, 19) (wds6Bank), 18-21, 21-0, 3-6 Uhr               | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (7, 20) Blick links                                                                                                      |
| fenwick (fenwick)                 | Stuhl   | wegCedarRiverton.zedernwald (54, 2) (wg4Baumstammbank), 18-21, 21-0, 3-6 Uhr | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (54, 3) Blick unten                                                                                                      |
| gegnerin (nia)                    | Stuhl   | wegMapleCedar.flussweg (86, 13) (wg4Bank), 18-21, 2-6, 21-23 Uhr             | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (86, 14) Blick unten                                                                                                     |
| grahamHale (graham-hale)          | Stuhl   | ironwood.aussen (14, 49) (rvBahnsteigbank), 17-21 Uhr                        | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (14, 50) Blick links                                                                                                     |
| grahamHale (graham-hale)          | Stuhl   | ironwood.kantine (28, 15) (wzStuhlRechts), 2-6, 21-23 Uhr                    | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (27, 15) Blick unten                                                                                                     |
| greta (greta)                     | Stuhl   | wegCrossroadsPinewood.huetten (60, 22) (mfBank), 16-21, 2-6, 21-23 Uhr       | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (61, 22) Blick unten                                                                                                     |
| guidry (guidry)                   | Stuhl   | wegSiliconDelacroix.faehre (17, 38) (sd6Liegestuhl), 16-21, 2-6, 21-23 Uhr   | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (18, 38) Blick unten                                                                                                     |
| gus (gus)                         | Stuhl   | ironwood.aussen (65, 45) (mf2BankLang), 18-21 Uhr                            | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (64, 45) Blick unten                                                                                                     |
| gus (gus)                         | Stuhl   | ironwood.kantine (30, 12) (wzStuhlRechts), 21-2, 5-6 Uhr                     | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (30, 13) Blick unten                                                                                                     |
| hank (hank)                       | Stuhl   | ironwood.aussen (13, 49) (rvBahnsteigbank), 17-21 Uhr                        | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (13, 50) Blick unten                                                                                                     |
| hank (hank)                       | Stuhl   | ironwood.kantine (13, 11) (cc4StuhlVorn), 2-6, 21-23 Uhr                     | nein         | Sein Gespräch sagt „sitzt allein am Ende des Tischs“, aber nach der Räumung (Akt 3) hat die Kantine keine Stühle, und ein Block gilt für beide Fassungen; steht jetzt auf (14, 9) Blick unten |
| harlan (harlan)                   | Stuhl   | riverton.aussen (21, 6) (rv8Bahnsteigbank), 18-21 Uhr                        | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (21, 7) Blick unten                                                                                                      |
| harlan (harlan)                   | Stuhl   | riverton.bahnhofshalle (10, 11) (rv8Zweierbank), 2-6, 21-23 Uhr              | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (9, 11) Blick unten                                                                                                      |
| henri (henri)                     | Stuhl   | portDelacroix.werkstatt (4, 10) (pd9Klavierhocker), 17-21, 21-0, 3-6 Uhr     | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (4, 11) Blick unten                                                                                                      |
| holloway (holloway)               | Stuhl   | wegDelacroixDesert.canyonpfad (60, 12) (mfBank), 16-21, 2-6, 21-23 Uhr       | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (62, 12) Blick unten                                                                                                     |
| joggerin (joggerin)               | Stuhl   | wegMapleCedar.landstrasse (81, 14) (wg4Bank), 16-21, 21-2, 5-6 Uhr           | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (81, 15) Blick links                                                                                                     |
| juniper (juniper)                 | Stuhl   | wegPinewoodGhost.canyonrand (93, 9) (mfBank), 18-21, 2-6, 21-23 Uhr          | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (92, 9) Blick unten                                                                                                      |
| juno (juno)                       | Stuhl   | mapleFalls.diner (14, 10) (mf12NischenbankLinks), 1-6, 21-22 Uhr             | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (8, 10) Blick rechts                                                                                                     |
| juno (juno)                       | Stuhl   | mapleFalls.park (22, 24) (mf6BankSeiteLinks), 17-21 Uhr                      | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (22, 25) Blick unten                                                                                                     |
| kade (kade)                       | Stuhl   | capitalArena.innenstadt (30, 50) (ca7Bank), 18-21 Uhr                        | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (29, 50) Blick unten                                                                                                     |
| kade (kade)                       | Stuhl   | capitalArena.ubahnhof (12, 12) (ca9Hocker), 1-6, 21-22 Uhr                   | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (12, 13) Blick unten                                                                                                     |
| kiki (kiki)                       | Stuhl   | wegIronwoodSilicon.glasbruecke (84, 10) (ws5Bank), 18-21 Uhr                 | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (84, 11) Blick unten                                                                                                     |
| kiki (kiki)                       | Stuhl   | wegIronwoodSilicon.raststaette (31, 14) (ws5Bank), 21-0, 3-6 Uhr             | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (31, 15) Blick unten                                                                                                     |
| kit (kit)                         | Stuhl   | summitCity.aussen (33, 39) (parkbank), 1-6, 17-21, 21-22 Uhr                 | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (33, 40) Blick unten                                                                                                     |
| lin (lin)                         | Stuhl   | siliconBay.hafen (22, 27) (mfBank), 18-21, 21-0, 3-6 Uhr                     | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (21, 27) Blick unten                                                                                                     |
| lou (lou)                         | Stuhl   | portDelacroix.aussen (4, 14) (cc4Bahnbank), 17-21 Uhr                        | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (4, 15) Blick unten                                                                                                      |
| lucia (lucia)                     | liegen  | sternwarte.kuppel (1, 6) (sw15BettGrauKopfWest), 23-2 Uhr                    | ja           | Schlaf im Bett; Liegen lässt sich nicht im Stehen erzählen                                                                                                                                    |
| lucia (lucia)                     | Stuhl   | sternwarte.felsnase (2, 7) (mf9BankLinks), 18-21, 2-6, 21-23 Uhr             | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (2, 8) Blick unten                                                                                                       |
| marcus (marcus)                   | Stuhl   | capitalArena.innenstadt (30, 51) (ca7Bank), 16-21 Uhr                        | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (30, 49) Blick rechts                                                                                                    |
| marcus (marcus)                   | Stuhl   | capitalArena.ubahnhof (3, 9) (ci8Bank), 1-6, 21-22 Uhr                       | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (3, 10) Blick links                                                                                                      |
| mira (mira)                       | Stuhl   | desertSprings.aussen (20, 6) (rvBahnsteigbank), 16-21 Uhr                    | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (19, 6) Blick unten                                                                                                      |
| ngata (ngata)                     | Stuhl   | sternwarte.felsnase (2, 5) (mf9BankLinks), 18-21, 21-2, 5-6 Uhr              | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (1, 5) Blick unten                                                                                                       |
| odette (odette)                   | Stuhl   | wegGhostCapital.seeufer (108, 19) (gc7Bank), 18-21, 2-6, 21-23 Uhr           | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (108, 20) Blick unten                                                                                                    |
| odile (odile)                     | Stuhl   | portDelacroix.turnhalle (14, 7) (pd6StuhlRuecken), 17-21, 21-0, 3-6 Uhr      | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (13, 7) Blick unten                                                                                                      |
| okafor (okafor)                   | Stuhl   | cedarCreek.aussen (31, 30) (cc4Stammbank), 16-21, 2-6, 21-23 Uhr             | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (31, 31) Blick unten                                                                                                     |
| omaRuth (oma-ruth)                | liegen  | ironwood.mamasZimmer (8, 4) (iw5BettLila), 2-5 Uhr                           | ja           | Schlaf im Bett; Liegen lässt sich nicht im Stehen erzählen                                                                                                                                    |
| omaRuth (oma-ruth)                | Stuhl   | ironwood.mamasZimmer (3, 6) (cc4StuhlVorn), 16-21, 21-2, 5-6 Uhr             | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (4, 5) Blick unten                                                                                                       |
| pratt (pratt)                     | Stuhl   | wegMapleCedar.flussweg (54, 20) (wg4Bank), 18-21, 2-6, 21-23 Uhr             | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (54, 21) Blick unten                                                                                                     |
| priya (priya)                     | Stuhl   | ironwood.aussen (12, 49) (rvBahnsteigbank), 17-21 Uhr                        | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (12, 50) Blick rechts                                                                                                    |
| priya (priya)                     | Stuhl   | ironwood.kantine (15, 12) (cc4StuhlRuecken), 2-6, 21-23 Uhr                  | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (16, 12) Blick unten                                                                                                     |
| pruitt (pruitt)                   | Stuhl   | ghostTown.saloon (5, 10) (gt7StuhlL), 18-21, 2-6, 21-23 Uhr                  | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (5, 11) Blick unten                                                                                                      |
| ray (ray-castillo)                | Stuhl   | wegSummitCrossroads.geysirbecken (23, 61) (mfBank), 17-21, 2-6, 21-23 Uhr    | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (23, 59) Blick unten                                                                                                     |
| remy (remy)                       | Stuhl   | portDelacroix.aussen (3, 14) (cc4Bahnbank), 1-6, 16-21, 21-22 Uhr            | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (3, 15) Blick rechts                                                                                                     |
| rosa (rosa)                       | Stuhl   | cedarCreek.aussen (50, 24) (cc5BankZumBach), 16-21, 21-2, 5-6 Uhr            | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (49, 24) Blick unten                                                                                                     |
| ruthKeene (ruth-keene)            | Stuhl   | wegDesertSummit.diner (6, 19) (wds6Bank), 17-21, 2-6, 21-23 Uhr              | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (6, 20) Blick rechts                                                                                                     |
| schaffner (schaffner)             | Stuhl   | wegCedarRiverton.bahndamm (39, 4) (wc8StellwerkBank), 16-21, 2-6, 21-23 Uhr  | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (39, 5) Blick unten                                                                                                      |
| schiffskoch (schiffskoch)         | Stuhl   | wegSiliconDelacroix.faehre (16, 38) (sd6Liegestuhl), 18-21, 21-2, 5-6 Uhr    | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (16, 37) Blick unten                                                                                                     |
| skaterJo (skater-jo)              | Stuhl   | mapleFalls.diner (14, 9) (mf12NischenbankLinks), 1-6, 21-22 Uhr              | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (9, 10) Blick links                                                                                                      |
| skaterJo (skater-jo)              | Stuhl   | mapleFalls.park (22, 23) (mf6BankSeiteLinks), 16-21 Uhr                      | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (23, 23) Blick unten                                                                                                     |
| sol (sol)                         | Stuhl   | summitCity.aussen (40, 39) (parkbank), 18-21, 21-1, 4-6 Uhr                  | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (40, 40) Blick unten                                                                                                     |
| tamsin (tamsin)                   | Stuhl   | riverton.aussen (17, 19) (cc5BankZumBach), 16-21 Uhr                         | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (16, 19) Blick unten                                                                                                     |
| teague (teague)                   | Stuhl   | ironwood.aussen (30, 46) (mfBank), 18-21 Uhr                                 | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (29, 46) Blick unten                                                                                                     |
| teague (teague)                   | Stuhl   | ironwood.kantine (12, 11) (cc4StuhlVorn), 21-2, 5-6 Uhr                      | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (10, 9) Blick unten                                                                                                      |
| tobias (tobias)                   | Stuhl   | capitalArena.innenstadt (31, 50) (ca7Bank), 18-21 Uhr                        | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (31, 49) Blick unten                                                                                                     |
| tobias (tobias)                   | Stuhl   | capitalArena.ubahnhof (26, 12) (ca9Hocker), 1-6, 21-22 Uhr                   | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (26, 13) Blick unten                                                                                                     |
| tomas (tomas)                     | Stuhl   | desertSprings.aussen (21, 6) (rvBahnsteigbank), 1-6, 18-21, 21-22 Uhr        | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (21, 7) Blick unten                                                                                                      |
| turnierleiterin (turnierleiterin) | Stuhl   | capitalArena.innenstadt (31, 51) (ca7Bank), 18-21 Uhr                        | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (32, 49) Blick links                                                                                                     |
| turnierleiterin (turnierleiterin) | Stuhl   | capitalArena.ubahnhof (2, 9) (ci8Bank), 21-1, 4-6 Uhr                        | nein         | Feierabend oder Nacht, kein Gespräch erzählt Sitzen; steht jetzt auf (2, 10) Blick rechts                                                                                                     |
