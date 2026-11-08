# Auftrag mittel-1: Gesamtsimulation dauerhaft ablegen

**Stand:** fertig, zusammengeführt (Haupt-Chat, 08.11.2026, zwanzigster Auftrag; Ausnahmeliste geleert, weil niedrig-1 die fünf Figuren gesetzt hat)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `pipeline/abenteuer/gesamtsimulation.cjs` (neu), `pipeline/tests/test_abenteuer_simulation.py`
(neu), Ink-Dateien und `quests.json` nur für Befunde des Skripts, `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen`

## Ziel

Dein Vorschlag ist angenommen: Das Skript der Gesamtsimulation kommt nach
`pipeline/abenteuer/gesamtsimulation.cjs`, damit jeder spätere Umbau gegen Sackgassen geprüft wird.

## Vorgaben

1. Dateikopf auf Deutsch (Zweck, Aufruf, Ausgabe), Kommentare nach CLAUDE.md, keine Pfade außerhalb
   des Repositorys. Aufruf aus dem Hauptordner: `node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1`.
   Ausgabe: hängende Quests, nie erreichte Knoten, Figuren ohne Karte; Rückgabewert ungleich 0 bei
   Sackgassen oder fehlendem Abspann.
2. Figuren ohne Karte nicht mehr ersatzweise setzen, sondern als Befund melden (niedrig-1 setzt die
   fünf Figuren gerade auf die Karten; bis dahin darf der Test sie als bekannte Ausnahme führen, mit
   Kommentar, damit die Liste danach gelöscht wird).
3. Test `pipeline/tests/test_abenteuer_simulation.py`: läuft mit einem Startwert und nur, wenn die
   Umgebungsvariable `ABENTEUER_SIMULATION=1` gesetzt ist (sonst `pytest.skip` mit Begründung), damit
   der gewöhnliche Testlauf schnell bleibt. Wenn sich die Laufzeit für einen Startwert deutlich unter
   eine Minute drücken lässt, gern ohne diese Bedingung; dann im Bericht sagen.
4. Victor und Juno im Clubraum: Bleibt beim Umweg über den Coach (Figuren in `orte.json` können nicht
   bedingt erscheinen, und Victor dauerhaft im Clubraum passt nicht zur Geschichte). Kein Handlungsbedarf.

## Bericht

**Erledigt.**

- `pipeline/abenteuer/gesamtsimulation.cjs` (Erkunden, Bericht, Aufruf) und
  `pipeline/abenteuer/gesamtsimulation-regeln.cjs` (Spieldaten, Spielstand, Quests, Dialoge, Folgen
  wie in der App). **Entscheidung:** zwei Dateien statt einer, weil eine Datei fast 500 Zeilen hätte
  und CLAUDE.md, Regel 4, unter 400 verlangt. Dateikopf auf Deutsch mit Zweck, Aufruf und Ausgabe,
  Pfade nur innerhalb des Repositorys (inkjs aus `app/node_modules`).
- Aufruf aus dem Hauptordner: `node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1`
  (dazu `--sekunden N` als Zeitbudget, `--ersatz a.b,c.d` setzt bekannte Figuren ohne Karte
  ersatzweise auf die Karte ihrer Dialogdatei). Ausgabe: Abspann ja oder nein, besuchte Orte,
  offene Quests (hängend oder nie begonnen), nie erreichte Knoten, Figuren ohne Karte, Rückkehr mit
  der Monatskarte, nie besuchte Orte, Meldungen (fehlende Dialoge, Knoten, Karten, Begegnungen).
  **Rückgabewert 1**, wenn eine Hauptquest nicht fertig wird, eine begonnene Quest hängt, der
  Abspann fehlt oder Daten fehlen; sonst 0. Nie begonnene Nebenquests zählen nicht (manche sind
  freiwillig, etwa die Feier in Ironwood, die es nur vor dem Clubkampf gibt).
- Figuren ohne Karte werden nur noch gemeldet, nicht mehr ersatzweise gesetzt (außer mit
  `--ersatz`). Der Test führt die fünf bekannten (`mapleFalls.juno`, `mapleFalls.abernathy`,
  `mapleFalls.lily`, `pinewoodCamp.lou`, `pinewoodCamp.tamsin`) in `BEKANNT_OHNE_KARTE`, mit
  Kommentar: Steht eine davon auf ihrer Karte, schlägt der Test fehl, bis der Eintrag gelöscht ist.
- `pipeline/tests/test_abenteuer_simulation.py`: ein Startwert, nur mit `ABENTEUER_SIMULATION=1`
  (sonst `pytest.skip` mit Begründung; ebenso ohne Node oder ohne `app/node_modules/inkjs`).
  Prüft Rückgabewert 0, Abspann, keine offene Hauptquest und die Liste der Figuren ohne Karte.
- **Laufzeit:** etwa 64 Sekunden für einen Startwert, also nicht deutlich unter einer Minute; die
  Bedingung `ABENTEUER_SIMULATION=1` bleibt. Schneller wurde der Lauf vor allem durch gezieltes
  Laufen: Der Spieler sucht mit einer Breitensuche die erreichbare Karte des Gebiets, die er am
  längsten nicht besucht hat, statt zufällig umherzugehen, und fasst Dinge, die sich im selben
  Zustand nichts mehr tun, nicht immer wieder an.
- Mit den Startwerten 1 bis 4: in allen Läufen Abspann, alle Hauptquests fertig, Rückgabewert 0.
  Nie begonnen bleiben nur `mapleFalls.verlorenesBrett` und `mapleFalls.lilysSpringer` (Lily und
  der Bibliothekar fehlen auf der Karte) und in zwei Läufen die freiwillige `ironwood.feier`.

**Befund des Skripts, behoben:** `cedar-creek-archiv.ink`: Wer beim Ordnen „Später helfen“ sagte und
danach die Clubnadel holte, bekam das Ordnen nie wieder angeboten (Bedingung `nadelCedarCreek ==
0`), die Quest `cedarCreek.archivOrdnen` hing. Neu: `ordnenAngeboten`, einmal angeboten bleibt
das Angebot.

**Prüfungen:** pytest 595 bestanden, 2 übersprungen (die Simulation ohne Umgebungsvariable); mit
`ABENTEUER_SIMULATION=1` beide bestanden (64 Sekunden). ruff sauber, `npm run pruefen` grün
(2422 Tests).

## Bericht des letzten Auftrags, zur Nachlese

**1. Akt 4 abgestimmt (Commit 76d88e57).**

- Capital Arena: Novas Aussage hat drei Fassungen. `novaHilfeZugesagt`: Der Held steht neben ihr wie
  versprochen, sie dankt. Nur `novaBitteGehoert` (in Crossroads abgelehnt): Sie sucht den Helden im
  Saal und schafft es allein. Keins von beiden: Sie steht allein da. Dazu passen Novas Satz nach der
  Aussage und ihr Daumen bei der Ankunft (Szene 103).
- Ghost Town: Victor liest `hatHalesSeite` (die Seite liegt beim Helden, der Held gibt sie nach der
  Partie zurück) und `victorSeiteGegeben` (Seite gegeben, aber nicht mehr im Besitz: Victor kennt sie
  auswendig). Fehlt beides, zieht Victor sie selbst aus seinem Buch.

**2. Gesamtsimulation vom Dachboden bis zum Abspann.**

Ein Spieler-Simulator (Node, inkjs), der wie `Oberwelt.tsx` arbeitet: Figuren und Auslöser aus den
gezeichneten Tiled-Karten, Knoten werden gemeldet, sobald eine Zeile darin steht, Quests streng der
Reihe nach. Übergänge mit Dialog prüfen `wenn` nach dem Dialog, Übergänge ohne Dialog gelten sofort;
`reise`, Läden (Gegenstände), Funde, Karten, `zeigeAbspann()` sind eingebaut. Jede Begegnung läuft
abgebrochen → niederlage → remis → sieg, jede Runde erst nicht bestanden, dann bestanden; die Wahlen
sind zufällig mit festem Startwert. Der Simulator geht die Gebiete in der Reihenfolge der Bibel ab,
fasst in jedem Gebiet alles an, bis sich nichts mehr ändert, und reist am Ende mit der Monatskarte
dorthin zurück, wo noch Quests offen sind.

**Ergebnis mit vier Startwerten:** In allen vier Läufen kommt der Abspann, alle Hauptquests von Akt 1
bis Akt 4 sind fertig, alle 26 Orte außer dem Bayou werden besucht. Offen bleibt in einem Lauf die
Nebenquest `desertSprings.erinnerung1858` (in den anderen drei fertig, also ein Zufall der Wahlen).
Den Bayou erreicht man über `portDelacroix.bayou`, sobald `musikhausOffen` gilt; der Simulator macht
die Rückkehr nach Port Delacroix nur für die offenen Quests und geht nicht mehr hinaus.

**Gefunden und behoben (meine Dateien):**

1. _Akt 1, Dachboden (Sackgasse):_ Wer den König fallen lässt und wegrennt, hat `brettBeruehrt`; beim
   zweiten Mal sprang der Dialog direkt zu Ambroses Knoten, `ambrose_erwacht` kam nie, die erste
   Hauptquest `mapleFalls.dasBrett` hing. Jetzt führt `ambrose` zuerst nach `ambrose_erwacht`, bis er
   gesehen ist (`ambroseErwachtGesehen`).
2. _Akt 1, Wohnzimmer (Sackgasse):_ Mama zeigte den ersten Abend schon vor dem Gespräch mit Ambrose
   nach der ersten Partie; die Quest `mapleFalls.ersterAbend` beginnt aber erst dort und wartete dann
   für immer. Mama wartet jetzt auf `ersteLektionBesprochen`.
3. _Akt 1, Clubraum (Sackgasse):_ In `orte.json` gibt es weder Victor in Maple Falls noch Juno im
   Clubraum; `victor_trifft` (Start von `mapleFalls.besserWerden`, setzt `kenntHale`) und Junos Reihe
   waren unerreichbar, also kam niemand aus Maple Falls heraus. Der Coach führt jetzt zu Junos Reihe
   (nach Sams Reihe) und zu Victor (nach der Clubnadel). Folge: `victor_weg` ist nicht mehr erreichbar
   (nur ein Alltagssatz).
4. _Quest `ironwood.turnierheft` (Sackgasse, Haupt-Chat):_ Start und erster Schritt warteten auf
   denselben Knoten `oma_ruth_heft`, der nur einmal kommt. Start jetzt beim Betreten von Mamas Zimmer.
   Eine Prüfung aller Quests auf dieses Muster fand sonst nichts.
5. _Port Delacroix:_ Wer nach dem Clubkampf gleich den Wüstenzug nahm, ließ die Hauptquest
   `portDelacroix.tiefpunkt` für immer offen (letzter Schritt war Odiles Handschlag). Der Handschlag
   bleibt als Szene, ist aber kein Questschritt mehr.
6. _Ghost Town:_ Ebenso fehlte die Nacht (Szene 101), wenn man nach der Fernpartie sofort zum Bus ging.
   Der Bus-Dialog spielt die Nacht jetzt vorher.

**Für den Haupt-Chat oder niedrig-1 (nicht meine Dateien):**

- Figuren ohne Platz auf einer gezeichneten Karte: `mapleFalls.juno`, `mapleFalls.lily`,
  `mapleFalls.abernathy`, `pinewoodCamp.lou`, `pinewoodCamp.tamsin`. Ohne sie fehlen in der App Junos
  Begegnung draußen, Lilys Springer-Quest, der Bibliothekar mit dem Brief (Fragment, `kenntHale`!) und
  zwei Kinder im Camp. Der Simulator setzt sie ersatzweise auf die Karte ihrer Dialogdatei.
- In `orte.json` eine Figur `mapleFalls.victor` (Clubraum, `maple-falls-clubraum.victor`) und Juno im
  Clubraum wären sauberer als der Umweg über den Coach.
- Knoten, die in keinem Lauf vorkamen, sind nur andere Reihenfolgen (etwa Mama vor dem Dachboden,
  Henri vor dem Vorwurf): `maple-falls-wohnzimmer.ankunft`, `cedar-creek-aussen.ankunft`,
  `cedar-creek-archiv.karton_fremd`, `maple-falls-aussen.juno_zum_club`,
  `maple-falls-clubraum.victor_ueberrascht`, `port-delacroix-werkstatt.henri_vorher`,
  `riverton-aussen.albescu_wartet`, `desert-springs-garage.garage_wartet`; dazu der Bayou (siehe oben).
- Variablen: Nur von der Hülle gesetzt und in Ink gelesen (richtig so): `hatFahrrad`, `hatLaterne`,
  `hatLimo`, `hatHalesSeite`, `mentorzugFreiGespielt`, `siegeRivertonHarlan`. Deklariert, aber nicht
  benutzt (harmlos, mittel-2): `held` in `silicon-bay-lobby`, `summit-city-aussen`,
  `summit-city-bergstation`; `nadelSummitCity` in `summit-city-aussen`. Nie gesetzte Variablen, die
  eine Szene sperren, gibt es nicht mehr.

**Das Skript:** liegt vorerst nur lokal (`gesamtsimulation.cjs`, etwa 300 Zeilen, Laufzeit etwa vier
Minuten je Startwert, die Ausgabe nennt hängende Quests, nie erreichte Knoten, Figuren ohne Karte und
nie besuchte Orte). Vorschlag laut Vorgabe 3: als `pipeline/abenteuer/gesamtsimulation.cjs` mit einem
Test in `pipeline/tests/`, der es mit Node aufruft (übersprungen ohne Node) und verlangt, dass alle
Hauptquests fertig werden und der Abspann kommt. Ich lege es ab, sobald der Haupt-Chat zustimmt.

**Prüfungen:** pytest 595 bestanden, `npm run pruefen` grün (2422 Tests), Abenteuerpaket baut,
Zufallsdurchläufe aller Knoten ohne Fehler.

## Bericht des letzten Auftrags, zur Nachlese

**Erledigt.**

- **Acht Ink-Dateien neu:** `weg-pinewood-ghost.ink` (Szene 97, Juniper mit Drei-Schach, Tafel),
  `ghost-town-aussen.ink` (Ankunft, Mr. Pruitt, Szene 98 das Grab, Szene 101 die Nacht),
  `ghost-town-saloon.ink` (Szene 100 Fernpartie mit Victor, Auslöser des Flashbacks über das
  Postreiterabzeichen), `erinnerung-siedlung.ink` (Szene 99 Die letzte Kerze),
  `weg-ghost-capital.ink` (Szene 102, Abe Lindgren mit König der Hügel, Tafel, Linse),
  `capital-arena-aussen.ink` (Ankunft, Szene 103 mit der Liga aus den acht Nadeln, Mama, Juno,
  Szene 109 Abschied mit `zeigeAbspann()`), `capital-arena-halle.ink` (Szenen 104 bis 108),
  `bayou.ink` (L5, Theron). Dazu die Knoten `bayou` in `port-delacroix-aussen.ink` und `blaeser`
  in `port-delacroix-musikhaus.ink` (L1). Alle Knoten aus `orte.json` sind vorhanden.
- **Begegnungen:** `capitalArena.runde1` bis `runde4` (Turnier, Farbe zufällig, Wahl der Zeit,
  Runde 4 fest 5 + 3), `capitalArena.halbfinale` (Kade, `freieKarten: ["mentorzug"]`,
  `abgelenktAb: {halbzug: 40, faktor: 1.5}`), `capitalArena.finale` (Victor, keine Karten).
  `ghostTown.fernpartie` stand schon aus dem letzten Auftrag.
- **Runden:** `wegPinewoodGhost.tafel` (Abzug, Doppelschach), `wegGhostCapital.tafel` (Thema
  `endspiel`).
- **Quests:** Hauptquest `ghostTown.fernpartie` (Grab, Flashback, Partie bei jedem Ausgang, Victor,
  Nacht; Szenen `akt4.ghostTown` bis `akt4.ambroseSagtEs`), Hauptquest `capitalArena.meisterschaft`
  (Arena, Vorrunde geschafft, Aussage, Halbfinale gewonnen, vor dem Finale, Finale bei jedem
  Ausgang, Abschied; Szenen `akt4.arena` bis `akt4.abschied`), zwei Tafel-Quests.
- **Funde:** `postreiterabzeichen`, `schlussstellungFernpartie` (Extra `brett-fernpartie-1866`),
  `leuchtturmlinse` (10 Münzen), `teilnehmerausweis`. **Laden:** `capitalArena.fanshop` (Schal 20,
  Teilnehmeranstecker 10, beides ohne Spielwirkung). 30 neue Textschlüssel.
- **Prüfungen:** pytest 470 bestanden, `npm run pruefen` grün (2422 Tests), das Paket baut. Die
  Simulation spielt von Weg 10 bis zum Abschied, mit abgebrochener Fernpartie, verlorener
  Vorrunde (1,5 Punkte, dann Wiederholung von Runde 1), verlorenem Halbfinale und Remis im Finale:
  alle vier Quests fertig. Zufallsdurchläufe aller Knoten ohne Fehler.

**Entscheidungen.**

1. **Turniermodus in Ink:** `punkt()` zählt Sieg 1 und Remis ½, `punktetext()` schreibt „1,5“.
   Die Turnierleiterin bietet die nächste ungespielte Runde an; sind alle gespielt und es reicht
   nicht, bietet sie die erste nicht gewonnene Runde noch einmal an. Ab 2,5 Punkten geht es weiter.
2. **Halbfinale nur mit Sieg:** Ein K.-o.-Spiel braucht einen Sieger; bei Remis oder Niederlage
   spielt man noch einmal. Ambrose sagt vor der Partie „Ein einziges Mal …“, im Gang vor dem
   Finale je nach `mentorzugFreiGespielt` „Das war meine unsterbliche Partie. Mit dir.“ oder „Du
   hast mich nicht gerufen. Und trotzdem gewonnen.“ Im Finale schweigt er.
3. **Flashback 1866 ohne Klassikersammlung:** Die Fernpartie steht nicht in `klassiker.json` (nicht
   meine Datei); deshalb rät der Held die vier Züge 37. Txd7, 38. Da3, 39. Dg3+, 40. Kxg3 als Wahl
   im Dialog, mit je zwei legalen falschen Zügen und freundlicher Berichtigung, und am Ende einer
   Zählung („Vier von vier“). Mit einer Klassiker-Kennung für die Fernpartie ließe sich das auf
   eine Runde mit `erinnerung` (ab Zug 37, Weiß) umstellen.
4. **Reihenfolge in Ghost Town:** Grab → Abzeichen (erst nach dem Grab zu finden; mit Laterne
   anders erzählt, aber ohne Laterne nicht gesperrt) → Erinnerung → Fernpartie → Nacht. Der Bus
   zur Arena fährt erst nach der Fernpartie (`fernpartieGespielt`, Bedingung in `orte.json`).
5. **Hales Seite und Brief:** Victor liest `gefundenHalesSeite` (angenommener Fund `halesSeite` von
   mittel-2, Szene 88) und `briefGelesen`; fehlen sie, kennt er Hales Antwort auswendig. Nichts
   ist hart gesperrt, damit die Hauptquest nicht an einer Nebenquest hängt.
6. **Liga in Ink:** Juno zählt die Nadeln der acht Clubs selbst zusammen und nennt die Liga (R22).
7. **Sprecher ohne Porträt:** Postreiter und Bläserin sprechen als Erzähler (der Porträt-Test
   verlangt für jeden Sprecher ein Bild).
8. **Varianten** (Drei-Schach, König der Hügel, Nebelschach, Schach960) werden nur erzählt, bis die
   Technik da ist.

**Offen (nicht meine Dateien):**

- Keine Sprüche im Turnier (S2): `kartenErlaubt` gilt für alle Karten. Vorschlag: den Turniergegnern
  in `gegner.json` `immunGegen` mit den Spruchkarten geben (außer Kühler Kopf für Tobias, der ist
  eine Zeitkarte), oder ein Begegnungsfeld `spruecheErlaubt: false`.
- Fragment 8 (Ward, Summit City) bei mittel-2.
- Fund `halesSeite` (mittel-2): Name bitte so, sonst die Variable in `ghost-town-saloon.ink` anpassen.

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
- **5 Begegnungen** in `begegnungen.json`: `ghostTown.fernpartie` (Stellungsduell, siehe Entscheidung 4), `summitCity.clubkampf` (Wahl der Zeit, Karten erlaubt),
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
4. **Fernpartie (Nachtrag nach Bibel, Abschnitt 35):** Begegnung `ghostTown.fernpartie` als
   Stellungsduell aus der Duell-FEN `6k1/p2R4/2n4p/1p6/2n1P3/6KP/P5P1/8 w - - 0 41` (Turm gegen zwei
   Springer, +1,44 bis +1,85 nach der Bibel), 15 Züge, Mindestvorteil 1,0, Leser Weiß, ohne Uhr,
   Karten gesperrt. Gegner ist `summitCity.victor` (Story, E + 400); Victor im Saloon trägt diesen
   Gegner. Fragment 8 (Ward, Erinnerung Hastings) fehlt noch, bis die Quests von Akt 4 stehen.
5. **Anschluss an Akt 3:** Neue Auslöser in bestehenden Orten: `desertSprings.highway` (zum Weg 7,
   wenn `endeAkt3Gesehen`), `portDelacroix.bayou` (zum Bayou, wenn `musikhausOffen`) und die Figur
   `portDelacroix.blaeser` im Musikhaus (L1). Die Karten von Desert Springs und Port Delacroix sind
   schon gezeichnet; die Rückwege zielen deshalb vorerst auf vorhandene Objekte (`bahnhof` und
   `deich`). Sobald niedrig-1 die Objekte `highway` und `bayou` ergänzt, sollen die Rückwege
   dorthin zeigen.
6. **Flashback in Ghost Town:** Der Übergang `abzeichen` im Saloon führt nach dem Fund des
   Postreiterabzeichens (`abzeichenGefunden`) in die Erinnerung; `rueckkehr` führt zurück an
   dieselbe Stelle.
7. **Porträts:** `portraets/<name>.svg` mit den Namen der 20 Porträts von mittel-2 (alle vorhanden); Victor und Nova nutzen ihre vorhandenen Bilder, Ray Castillo heißt als Figur `figuren/ray-castillo.png`.

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
