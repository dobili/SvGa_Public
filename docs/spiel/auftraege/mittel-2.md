# Auftrag mittel-2: Schach960 am Varianten-Tisch (Inhalte)

**Stand:** fertig (mittel-2, 09.11.2026; Auftrag vom Haupt-Chat, sechzehnter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** Ink-Dateien der Orte mit Varianten-Tisch und der Wege, `begegnungen.json` (nur neue
Einträge), `gegner.json` (nur neue Einträge), `orte.json` (nur neue Figuren), `quests.json` (nur
neue Nebenquests), `funde.json`, `texte/de.json` (nur neue Schlüssel), `inhalte/abenteuer/portraets/`
(nur neue Bilder), `docs/spiel/10_Sprueche_Schauplaetze_Varianten.md`, `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests`, im Ordner `app/` `npm run pruefen`

## Ziel

V1 Schach960 (Abschnitt 3 in `docs/spiel/10_…`) kommt ins Spiel. Der Haupt-Chat baut die Technik:
Begegnungen bekommen `"variante": "schach960"`, die Startstellung wird zufällig ausgelost (oder fest
mit `"startnummer": 0 bis 959`), Rochade nach 960-Regeln, die Engine spielt mit. Du baust die Inhalte.

## Vorgaben

1. Ein Varianten-Tisch mit Schach960 in einer passenden Stadt (Vorschlag Silicon Bay: die Studenten
   der Akademie spielen „gegen das Auswendiglernen“; oder dein besserer Vorschlag aus der Bibel),
   eine Figur mit zwei bis drei Begegnungen steigender Stärke, Belohnung Münzen und ein Fund, keine
   Nadeln (Varianten zählen nie für Nadeln, Wertung oder die App).
2. Ambrose erklärt beim ersten Mal in zwei, drei Sätzen die Regeln (Grundreihe gemischt, Läufer auf
   verschiedenen Farben, König zwischen den Türmen, Rochade: König und Turm landen auf denselben
   Feldern wie im normalen Schach) und warum das gut tut: Eröffnungswissen hilft nicht, nur Grundsätze
   (Entwicklung, Zentrum, Königssicherheit; Buchbezug Kapitel 2 und 3).
3. Schreibe `"variante": "schach960"` in die Begegnungen; solange die Technik fehlt, meldet der Test
   der Pipeline den Wert vielleicht als unbekannt: dann im Bericht nennen, der Haupt-Chat ergänzt das
   Schema.

## Bericht

**Fertig** auf `abenteuer-regelwerk` (Basis 36835075 hereingeholt). Prüfungen: `pytest pipeline/tests`
622 bestanden, `npm run pruefen` 362 Dateien und 2422 Tests, Prettier für die geänderten JSON-Dateien;
Simulation und 300 Zufallsdurchläufe je Datei ohne Fehler.

**Ort:** nicht Silicon Bay, sondern das **Musikhaus in Port Delacroix** (Bibel und `10`, L1: „Wir
spielen nie zweimal dasselbe Stück“). Gründe: Die Bläserin steht dort schon als Figur
(`portDelacroix.blaeser`, Porträt vorhanden), die Szene passt zu Ambrose (Geburtsstadt, als Kind
dagegen, lernt es jetzt), und die Akademie in Silicon Bay steht für den Konzern, nicht für Freude am
Spiel. Freigeschaltet nach dem Wiederaufbau (`musikhausOffen`).

**Inhalt**

- **Dialog** `port-delacroix-musikhaus.ink`, Knoten `blaeser`: `blaeser_regel` (Mabel stellt sich
  vor, Ambrose erklärt in drei Sätzen die Regeln: Grundreihe gemischt, Läufer auf verschiedenen
  Farben, König zwischen den Türmen, Rochade auf dieselben Felder wie im normalen Schach; dazu warum
  das gut tut: kein Eröffnungsbuch, nur Entwicklung, Zentrum, Königssicherheit, Kapitel 2 und 3),
  `blaeser_set1` bis `blaeser_set3`, `blaeser_setliste` (Fund), `blaeser_alltag` (weitere Sets).
  Der Kopf der Datei ist angepasst.
- **Varianten-Tisch** `crossroads-raststaette.ink`: Schach960 erscheint in der Liste („Das geht
  schon“) und ist spielbar gegen Ambrose (`crossroads.schach960`).
- **Gegner** (`gegner.json`): `portDelacroix.blaeserSet1` (aktuell − 100), `blaeserSet2` (aktuell),
  `blaeserSet3` (aktuell + 100), Rolle `story`, Stil `angreifer`, Eröffnung `frei`, Porträt
  `blaeser.svg`.
- **Begegnungen:** `portDelacroix.schach960Set1` bis `Set3` und `crossroads.schach960` (Farbe
  Zufall, Partie, Karten gesperrt).
- **Quest** `portDelacroix.schach960` „Nie zweimal dasselbe Stück“ (Start mit `blaeser_regel`, drei
  Schritte je Set, Sieg oder Remis, 15, 20 und 30 Münzen). **Fund** `setliste960` („Setliste mit
  Startnummern“). 6 neue Texte. `10_…` Abschnitt 3 mit dem Stand ergänzt.

**Wichtig: `"variante": "schach960"` fehlt noch in den vier Begegnungen.** Das Schema
(`schemas/abenteuer-begegnungen.schema.json`, Stand 36835075) kennt nur `"blind"`; mit dem Feld
schlägt `test_beispiel_passt_zum_schema[begegnungen.json…]` fehl. Nach Regel 5 in CLAUDE.md (jeder
Stand besteht alle Tests) habe ich es deshalb vorerst weggelassen. Sobald das Schema `schach960`
kennt, ergänze ich es (oder der Haupt-Chat beim Zusammenführen): je Begegnung
`"variante": "schach960"` nach `"kartenErlaubt": false` in `portDelacroix.schach960Set1`, `Set2`,
`Set3` und `crossroads.schach960`. Bis dahin wären es normale Partien aus der Grundstellung; sie zählen trotzdem nicht für Nadeln (Rolle Story) und nicht für die App (`"zaehltFuerApp": false` steht schon drin). Bitte also nicht ohne das Feld nach `main` nehmen.

**Entscheidungen**

1. Drei Gegnerprofile statt einem: Die Stärke steht im Gegner, nicht in der Begegnung; „drei Sets“
   erklären die steigende Stärke in der Welt.
2. Rolle `story` (frei), damit keine Münzen für Straßensiege doppelt kommen; die Münzen gibt die
   Quest.
3. Karten gesperrt wie beim Blindschach: Hilfskarten setzen normale Stellungen voraus.
4. Sieg oder Remis genügt für das nächste Set.

## Bericht des letzten Auftrags, zur Nachlese

**Fertig** auf `abenteuer-regelwerk` (Basis e198937a hereingeholt). Prüfungen: `pytest pipeline/tests`
595 bestanden, `npm run pruefen` 362 Dateien und 2422 Tests, Paketbau läuft, Prettier für die
geänderten Dateien (außer `quests.json`, das schon vorher nicht formatiert war; nur angefügt).

**Inhalt**

- **Figuren** in `orte.json` (Ort `hochebene`): `hochebene.kira` (Kira Vell, 13, Schülerin, am
  Steintisch bei den Felstürmen), `hochebene.annek` (Annek Vell, Lehrerin für Mathematik und Sport,
  ihre Tante), `hochebene.joss` (Joss Vell, Mechaniker, hält den Schulbus am Leben). Neue Auslöser
  `steintisch` (Felstürme), `werkstatt` und `aushang` (Schule).
- **Porträts** per Skript: `annek`, `joss`, `kira` (heutige Kleidung, kein Schmuck, keine Tracht;
  durchgesehen). Dazu `blaeser` und `postreiter`, die das Skript als fehlend meldete (Figuren von
  mittel-1).
- **Dialog** `hochebene.ink`: `kira` mit `kira_regel` und `kira_vorfuehren` (Regel, Herkunft als
  Familiengeschichte, kurze Vorführpartie, die {held} verliert, Ambroses Satz, Vertröstung),
  `kira_geschenk`, `kira_alltag`; `annek` mit `annek_erstes_treffen` und `annek_schach` („Euer
  Springer springt wie unser Falke. Nur feiger.“), `annek_alltag`; `joss` (der Mann von Perfect Move
  und die App; „Bei uns sagt dir nach jedem Zug die Großtante, was du falsch gemacht hast“),
  `joss_alltag`; `steintisch`, `werkstatt`, `aushang` (nach Anneks Lektion: „Schach-AG, freitags“),
  `zurueck`.
- **Quest** `hochebene.falkeUndBison` (Begegnung, Start beim Betreten der Felstürme): Kira zeigt das
  Spiel, {held} bringt Annek Schach bei, Kira schenkt den Falken.
- **Fund** `falkeAusHolz` (Kiras Werkstück aus dem Werkunterricht). Variable
  `varianteFalkeUndBisonGelernt` für den Varianten-Tisch.
- **Bibel** Szene 82 neu gefasst.
- **Simulation:** ein Durchgang in ungünstiger Reihenfolge (Schule vor den Felstürmen), Quest
  erledigt, Fund da; 300 Zufallsdurchläufe ohne Fehler, jede Zeile mit Sprecher.

**Entscheidungen**

1. **Name des Spiels:** „Falke und Bison“ wie im Auftrag; „Falkenweg“ aus der alten Bibel fällt weg
   („bei uns heißt das Spiel einfach Falke und Bison“, nüchtern statt exotisch).
2. **Herkunft des Spiels als Familiengeschichte:** Die Urgroßmutter schnitzte zwei Ersatzfiguren,
   als dem Schulschach im Winter zwei fehlten; Falke wegen der Falken über den Felstürmen, Bison
   „weil ihr Bruder so stur war“. Damit gibt es keine Legende, keine Ahnen, nichts Heiliges.
3. **Fund „Falke aus Holz“ statt „Falkenfeder aus Holz“:** Federn stehen auf der Liste der
   Klischees.
4. **Wörter, die nicht vorkommen:** Volk, Stamm, Reservat, Häuptling, Geister, Ahnen, Zeremonie,
   heilig, Natur als Lehrerin. Die Figuren sehen Ambrose nicht und sagen nichts Geheimnisvolles über
   ihn; „Vell“ ist ein Familienname, keine Volksbezeichnung.
5. **Ambrose** sagt nur zwei Sätze, beide über das Spielen.
6. **Variante** nicht gebaut: Kira führt vor und vertröstet (`VARIANTE-FEHLT` in
   `kira_vorfuehren`). Die Zeile am Varianten-Tisch (`crossroads-raststaette.ink`) durfte ich nicht
   ändern; Vorschlag für den Haupt-Chat: dort
   `{varianteFalkeUndBisonGelernt: Falke und Bison, von Kira an den Felstürmen. Kommt bald an den Tisch.}`
   ergänzen (und `varianteFalkeUndBisonGelernt` in die Bedingung „kennst noch keine“ aufnehmen).
7. **Nicht geändert, aber nicht mehr stimmig** (außerhalb von Szene 82): Bibel Abschnitt 28
   (Tabelle, Figuren „Lehrerin, Mechaniker, Schülerin“ stimmt noch) und Abschnitt 30 (Fundtabelle
   „Falkenfeder aus Holz“, Satz bleibt gleich): Zeile in „Falke aus Holz“ umbenennen.

**Für die Gegenlesung besonders ansehen**

1. Ob es überhaupt passt, dass eine erfundene Gemeinschaft an eine reale Landschaft (Hochebene mit
   roten Felstürmen) angelehnt ist; der Ort hat keinen realen Namen.
2. Kiras Erklärung der Herkunft (`kira_regel`): Ist die Familiengeschichte unverfänglich?
3. Joss und der Konzern (`joss`): Der Witz über die Großtante und die App, damit die Figur nicht als
   „gegen Technik“ gelesen wird (er repariert ja alles).
4. Anneks Satz „Euer Springer springt wie unser Falke. Nur feiger.“ („euer“/„unser“ als Gegensatz).
5. Die Bilder `annek`, `joss`, `kira` (Hauttöne h6/h7, Frisuren) und die Karte der Hochebene
   (Gestaltung durch niedrig-1, Weltbeschreibung 5.9: keine Zeichen, keine Deko aus fremden Kulturen).
6. Der Aushang „Falke-und-Bison-Turnier der Schule“: das Spiel als gewöhnlicher Schulsport.

**Für niedrig-1: Objekte auf den Karten der Hochebene**

| Karte                    | Objekt       | Art                   | Hinweis                                |
| ------------------------ | ------------ | --------------------- | -------------------------------------- |
| `hochebene.felsentuerme` | `kira`       | Figur                 | am Steintisch                          |
| `hochebene.felsentuerme` | `steintisch` | Auslöser (Gegenstand) | flacher Stein mit eingeritzten Feldern |
| `hochebene.schule`       | `annek`      | Figur                 | vor der Turnhalle, am Basketballkorb   |
| `hochebene.schule`       | `joss`       | Figur                 | an der Werkstatt neben dem Schulbus    |
| `hochebene.schule`       | `werkstatt`  | Auslöser (Gegenstand) | offene Werkstatt, Werkbank             |
| `hochebene.schule`       | `aushang`    | Auslöser (Gegenstand) | Schwarzes Brett an der Schulwand       |

Figurenbilder (Sprites) `figuren/kira.png`, `figuren/annek.png`, `figuren/joss.png` fehlen noch wie
bei den anderen Figuren von Akt 4.

## Bericht des letzten Auftrags, zur Nachlese

**Fertig** auf `abenteuer-regelwerk` (Basis 40b183ac hereingeholt). Prüfungen: `pytest pipeline/tests`
470 bestanden, `npm run pruefen` 362 Dateien und 2422 Tests, Paketbau kompiliert alle Ink-Dateien,
Simulation (siehe unten).

**Dialoge** (alle Knoten aus der Liste in `mittel-1.md`, dazu Unterknoten):

- `weg-desert-summit.ink` (Szene 81): `earl` (Königsrennen, Regel mit Buchbezug Kapitel 8),
  `tafel`, `fund_neon`, `zurueck_desert`, `abzweig_hochebene`.
- `hochebene.ink`: nur `zurueck` (stiller Ort ohne Figuren, bis Q21-1 beantwortet ist).
- `summit-city-aussen.ink`: `ankunft_zu_fuss` mit `ankunft_summit` (Szene 83: Mama, Juno, Plakate,
  Victor mit dem Mann im Anzug), `sol` (Szene 89, beim ersten Sieg Kühler Kopf), `seilbahn` (Hinweis
  auf Victor nach der Krise), `drachenfest` (Szene 90, Regel, Drachenschuppe), `weg_desert`,
  `weg_crossroads` (Abschied von Summit City).
- `summit-city-huette.ink`: `ward` mit `ward_lektion` (Szene 84, Opposition), `ward_erinnerung` und
  `ward_nach_erinnerung` (Szene 85), `victor_krise` (Szene 87, Buchbezug Kapitel 12.6),
  Clubkampf, Niederlage, Sieg, Alltag mit Revanche; `kit`, `haraldsen` (Szene 86), `pokal`,
  `kaminfeuer`.
- `summit-city-bergstation.ink`: `victor` mit `victor_bergstation` (Wahl „Dann spielen wir“ /
  „Erzähl“), `victor_spielen`, `victor_seite` (Szene 88, jeder Ausgang, Hales Seite, Ambroses
  „Ein Hale eben“), `fund_pfeife`.
- `summit-city-bergladen.ink`: `theke` (Laden, Haraldsen ist in der Hütte, Blechdose).
- `weg-summit-crossroads.ink` (Szene 92): `bell` (Atomschach, Buchbezug Kapitel 1), `ray`
  (Entenschach, Tomás’ und Miras Onkel), `tafel`, `bisons` (warten oder vorbeigehen),
  `fund_bisonhaar`, `sturmkeller`, `zurueck_summit`.
- `crossroads-aussen.ink` (Szene 93): `ankunft_zu_fuss` mit `ankunft_crossroads`, `slick`, `mira`
  (mit Tomás), `big_joe`, `rosie` (öffnet `siliconBay.foodtruck`), `wegweiser`, `weg_summit`,
  `weg_pinewood`.
- `crossroads-raststaette.ink`: `darlene` (Laden), `nova` mit `nova_bitte` (beide Antworten führen
  weiter), `varianten_tisch` (listet alle gelernten Varianten, Blindschach spielbar),
  `fund_postkarte`.
- `weg-crossroads-pinewood.ink` (Szene 94): `greta` (Blindschach gegen Ambrose, Buchbezug
  Kapitel 11), `tafel`, `rangerhaus`, `zurueck_crossroads`.
- `pinewood-camp-aussen.ink` (Szenen 95 und 96): `ankunft_zu_fuss` mit `ankunft_camp`, `ezra`
  (Regeln Räuberschach und Tandem), `lagerfeuer` mit `lagerfeuer_abend` (Mae zeigt Sterne,
  Ambroses leiser Satz, Marshmallow-Stock), `hollis` (beim ersten Sieg Zweite Chance), `dex`, `mae`,
  `lou`, `tamsin`, `kiosk`, `weg_crossroads`, `weg_ghost`.
- `desert-springs-aussen.ink`, nur `highway`: Mama hat die Fahrkarten zurückgegeben und leiht Dots
  Auto; Juno kommt mit dem Bus nach Summit City.

**Daten** (jeweils eigener Block am Ende der Datei, nur Zeilen angefügt):

- `begegnungen.json`: `wegCrossroadsPinewood.blindschach` (Gegner `mapleFalls.ambrose`, Farbe
  Zufall, Partie aus der Grundstellung, Karten gesperrt, `variante: "blind"`).
- `runden.json`: `summitCity.reiheKit` (`umwandlung`, `endspiel`), `summitCity.reiheHaraldsen`
  (`endspiel`), `summitCity.erinnerungHastings` (`klassik-steinitz-bardeleben` ab Zug 17 mit
  Weiß), Tafeln `wegDesertSummit.tafel` (`endspiel`, 3), `wegSummitCrossroads.tafel` (`haengend`,
  3, „vorher zählen“), `wegCrossroadsPinewood.tafel` (`matt2`, 3, „erst rechnen“).
- `quests.json`: Haupt `summitCity.endspiel` (7 Schritte: Ankunft, Lektion, Kit mit Zweiter Chance,
  Haraldsen, Victors Niederlage, Bergstation, Clubkampf mit Mentor-Zug), `summitCity.erinnerungHastings`
  (Fragment 8, 20 Münzen), Haupt `crossroads.treffpunkt` (Ankunft, Novas Bitte), Haupt
  `pinewoodCamp.sommercamp` (Ankunft, Lagerfeuer), Tafel-Quests `wegDesertSummit.tafelDiner`,
  `wegSummitCrossroads.tafelGeysir`, `wegCrossroadsPinewood.tafelHuette`. **Geändert:**
  `siliconBay.fehlendeSeite` bekommt Schritt 2 (`summit-city-bergstation.victor_seite`, Gegenstand
  `halesSeite`).
- `funde.json`: `neonK` (10 Münzen), `murmeltierpfeife` (5), `drachenschuppe`, `bisonhaar` (5),
  `postkarteStaedte`, `marshmallowStock`.
- `laeden.json`: `summitCity.bergladen` (Zweite Chance 20, Flüstern 40, Endspielkompass 60,
  Seilbahnkarte 15), `crossroads.raststaette` (Zweite Chance, Fingerzeig, Gefahrenradar, Flüstern,
  Waage, Remisangebot, Was droht?, Farbwahl, Limo zu den Preisen der früheren Läden),
  `pinewoodCamp.kiosk` (Limo 5, Marshmallows 5).
- `texte/de.json`: 42 neue Schlüssel (Quests, Funde, Läden, Gegenstände `seilbahnkarte`,
  `marshmallows`, `halesSeite`).

**Simulation** mit inkjs (Knoten wie im Spiel gemeldet, Variablen beim Dialogende zurückgeschrieben
wie in `Oberwelt.beiDialogende`, Quests wie `regeln/quests.ts`): ein Durchgang von `highway` bis
`weg_ghost` mit verlorener und gewonnener Sol-Partie, abgebrochener und verlorener Partie gegen
Victor, verlorenem und gewonnenem Clubkampf; alle sieben neuen Quests erledigt, „Die fehlende Seite“
aus Akt 3 schließt an der Bergstation. Dazu 300 Zufallsdurchläufe je Datei mit zufälligen Variablen
und Wahlen: keine Fehler, jede Zeile hat einen Sprecher, alle Knoten aus `orte.json` vorhanden.

**Varianten, die noch fehlen** (in den Dialogen mit `VARIANTE-FEHLT` markiert; die Figur erklärt
die Regel, setzt `variante<Name>Gelernt` und vertröstet in der Welt, etwa „alle Bretter belegt“):

1. Königsrennen (Earl, `weg-desert-summit.earl_angebot`)
2. Drache (Drachenfest, `summit-city-aussen.drachenfest_angebot`)
3. Atomschach (Bell, `weg-summit-crossroads.bell_angebot`)
4. Entenschach (Ray, `weg-summit-crossroads.ray_angebot`)
5. Tandem und Räuberschach (Ezra und Lagerfeuer, `pinewood-camp-aussen.lagerfeuer_abend`)
6. Varianten-Tisch: alle außer Blindschach „kommt bald“
7. Falkenweg (Hochebene): wartet auf Q21-1, keine Figuren, kein Dialog außer dem Rückweg.

Sobald eine Variante gebaut ist, genügt je eine Begegnung und ein `beginnePartie` an der markierten
Stelle (und eine Wahl am Varianten-Tisch).

**Entscheidungen**

1. **Blindschach gegen Ambrose:** Greta hat kein Gegnerprofil, und `gegner.json` war nicht
   freigegeben. Die Bibel gibt Ambrose den Satz „Ich habe zwölf Jahre lang Partien in Briefen
   gespielt“; deshalb spielt er (`mapleFalls.ambrose`, Stärke wie der Leser). Greta schreibt mit.
   Wer später eine eigene Gegnerin will: Gegner `wegCrossroadsPinewood.greta` anlegen und nur
   `gegner` in der Begegnung tauschen.
2. **Reihen ohne Buchübungen:** Die zwölf Buchübungen des Clubs (`ueb:opposition-anwenden` usw.)
   gibt es im Taktiktrainer noch nicht; die Reihen nutzen die Themen `endspiel` (jetzt
   angeschlossen) und `umwandlung`.
3. **Fragment 8:** Ward findet nach der Erinnerung einen Zettel mit vier Zugpaaren der Fernpartie
   in ihrem Heft (Wirkung `fragment` mit `halbzug: 8`, wie die Fragmente 6 und 7).
4. **Hales Seite** als Gegenstand in Schritt 2 der Akt-3-Quest, nicht in der Hauptquest, damit der
   Gegenstand nur einmal kommt. Die Hauptquest setzt dort nur die Szene `akt4.bergstation`.
5. **Neue Szenen-Kennungen:** `akt4.novaBitte`, `akt4.lagerfeuer` (dazu die aus der Bibel).
6. **Drachenschuppe** schon beim Erklären der Regel (Geschenk für alle, die zum ersten Mal
   mitmachen), weil man die Variante noch nicht spielen kann.
7. **Darlenes Laden** ohne Bretthintergründe: `laeden.json` kennt nur Karten und Gegenstände.
   Vorschlag für die Hülle: Warenart `extra` (Bretthintergründe aller Städte, je 40).
8. **Marshmallows und Seilbahnkarte** sind Gegenstände ohne Wirkung (Album). Die Seilbahn fährt
   ohne Karte; eine Sperre bräuchte `wenn` in `orte.json` (nicht freigegeben).
9. **Anreise über Weg 7:** Mama fährt mit Dots Auto, Juno kommt mit dem Bus nach Summit City; so
   passen die Fahrkarten vom Ende von Akt 3 und das Diner an der Straße zusammen.
10. **Bisons** blockieren nur erzählt (Wahl „Warten“); der Übergang zur Prärie hat keine Sperre.

**Für mittel-1 und die Capital Arena:** `novaBitteGehoert` und `novaHilfeZugesagt`
(Crossroads, Szene 93), `victorSeiteGegeben`, `victorKriseGesehen`, `variante<Name>Gelernt`,
`lagerfeuerGesehen`. Rückweg von Weg 7 zeigt weiter auf `bahnhof` (Entscheidung 5 von mittel-1).

**Hinweis:** `runden.json` war schon vor diesem Auftrag nicht mit Prettier formatiert; ich habe nur
angefügt, nicht umformatiert. `quests.json` besteht Prettier.

## Bericht des letzten Auftrags, zur Nachlese

**Fertig** auf `abenteuer-regelwerk` (Basis 19d3d91a hereingeholt). Prüfungen: `pytest pipeline/tests`
470, `npm run pruefen` 362 Dateien und 2418 Tests, Prettier.

**1. Porträts Akt 4:** 20 neue Einträge in `erzeuge-figurenbilder.mjs`, 20 neue SVG (zusammen jetzt
81). Namen (kebab-case des Namens, bei Doppelung mit Nachnamen; **für mittel-1 als Dateinamen in
`gegner.json` und `orte.json`**): `ward`, `kit`, `haraldsen`, `sol`, `darlene`, `hollis`, `ezra`,
`pruitt`, `bea`, `marcus`, `tobias`, `kade`, `turnierleiterin`, `earl` (Fernfahrer Earl Dubois),
`bell` (Rangerin am Geysir), `ray-castillo` (Sturmjäger; `ray` ist Rivertons Ray), `greta`,
`juniper`, `abe`, `theron`. Die Vell-Familie fehlt absichtlich (Q21-1 offen). Kontaktbogen
durchgesehen. `--pruefen` meldet heute nichts, weil mittel-1 die Figuren noch nicht eingetragen
hat; sobald andere Namen kommen, meldet das Skript sie.

**2. Fernpartie** in der Bibel, neuer Abschnitt 35: Evans-Gambit (Eröffnung von Hand), danach mit
Stockfish 19 je Zug eine menschliche Wahl unter den Zügen bis 0,35 Bauern unter dem besten; 40 Züge,
PGN mit Kopfzeilen, deutsche Lesefassung. Ambroses Doppelopfer 35. Lxh6 gxh6 36. Sxf6+ als Höhepunkt,
Hale hält mit zwei Springern gegen den Turm.

- **Fragmente 0 bis 8**: Fragment n = Halbzüge 8n + 1 bis 8n + 8 (Tabelle mit Herkunft je Akt; die
  vorhandenen Quest-Wirkungen 0 bis 7 passen, Fragment 8 kommt mit Wards Erinnerung).
- **Zugerraten** im Flashback: Halbzüge 73 bis 79, Ambroses letzter Zug **40. Kxg3**; Hales Antwort
  **40… b5** (Halbzug 80) steht auf der Seite.
- **Endstellung** für das Stellungsduell `6k1/p2R4/2n4p/1p6/2n1P3/6KP/P5P1/8 w - - 0 41`: +1,44
  (Tiefe 14), +1,44 (16), +1,85 (18), kein schnelles Matt, R13 erfüllt. Ein erster Kandidat (Seed 63)
  sah bei Tiefe 14 gut aus, stieg aber bei Tiefe 16 bis 18 auf +3 bis +4; deshalb prüft die Suche
  jetzt drei Tiefen.
- Vorschlag Begegnung `ghostTown.fernpartie`: Stellungsduell 15 Züge, Mindestvorteil 1,0, Leser Weiß,
  ohne Uhr, Karten gesperrt, Victor (story, E + 400).

## Bericht des letzten Auftrags, zur Nachlese

**Fertig** auf `abenteuer-regelwerk` (Basis 85951f66 hereingeholt). `05_Story_Bibel.md` hat Teil 4
„Akt 4“ (Abschnitte 25 bis 34, Szenen 81 bis 110); `09_Weltbeschreibung.md` neue Abschnitte 5.9 bis
5.14 zu den Orten und Wegen von Akt 4. Prettier besteht.

**Inhalt nach Vorgaben**

1. **Form wie Akt 3:** Kern in sieben Sätzen, Zeitlinie, Figuren (Ward als Clubchefin 8 mit E + 640,
   Kit, Haraldsen, Sol; Darlene, Hollis, Ezra, Pruitt; vier Vorrundengegner, Kade Sterling als
   Konzern-Junior), Welt mit fünf Wegen, Szenenliste mit Ort, Figuren, Zweck, Dauer, Buchbezug,
   Quests und Belohnungen, Funde, Läden, Karten und Sperren, sechs offene Fragen mit Empfehlung.
   Victors Krise und Befreiung (Summit City), die fehlende Seite, die Fernpartie in Ghost Town
   (Victor spielt Hales Züge), Novas Aussage mit Dr. Lin (Bibel Akt 3, Frage 4), Halbfinale,
   Finale, Ambroses Abschied, Post-Game.
2. **Landschaften L1 bis L10** als Nebenschauplätze mit ihrer Variante (Abschnitt 28): L8 und L9 an
   Weg 7, L10 in Summit City, L4 und L6 an Weg 8, L2 an Weg 9, L3 an Weg 10, L7 an Weg 11, L1 und L5
   als freiwillige Rückkehr nach Port Delacroix; Tandem und Räuberschach im Camp. Hauptstory und
   Clubs bleiben klassisch. **O5** (Szene 82): erfundene „Vell-Familien“, moderne Figuren (Lehrerin,
   Mechaniker, Schülerin), eigenes Spiel „Falkenweg“ mit Falke und Bison, keine Kostüme, keine
   heiligen Zeichen; **Rückfrage an den Autor** in Abschnitt 33, Frage 1.
3. **R29 und Extra-Abspann:** Szene 106 (Mentor-Zug frei als vierte Karte, ohne Verbrauch;
   „unsterbliche Partie mit dir“), Szene 109 (Extra-Abspann nur ohne Mentor-Zug: Zettel „Du hast mich
   nicht gebraucht“). Finale ohne Karten (R28).
4. **Technikliste** in Abschnitt 34 (Turniermodus, Stärkewechsel mitten in der Partie, freie vierte
   Karte, Varianten mit Fairy-Stockfish, Varianten-Tisch, Fernpartie bauen, Abspann, neue
   Figurenbilder, Post-Game).

**Entscheidungen und Hinweise**

- **Erinnerung in Summit City** ist Wards Erinnerung (Steinitz gegen von Bardeleben, Hastings 1895,
  `klassik-steinitz-bardeleben`), nicht Ambroses: Er starb 1866, und vor 1866 hat die Sammlung keine
  unbenutzte Partie mehr.
- **Halbfinale:** Der Konzern schickt Kade mit Gerät; Nova spielt in der Vorrunde ehrlich und sagt
  aus. So wird Nova nicht zur Gegnerin, die man vorführt, und das Aufdecken geschieht im Spiel.
- **Vorrunde** nach Regelwerk Frage F4 (Sieg 1, Remis ½, weiter ab 2,5 von 4).
- **Fragment 8** kommt aus Wards Erinnerung; Hales Antwort steht auf der Seite (Szene 88). Die
  Fernpartie selbst muss ein Folgeauftrag mit der Engine bauen (Technikliste, Punkt 6).
- Neue Dialogvariablen: `fernpartieGespielt`, `mentorzugImHalbfinaleGespielt`,
  `variante<Name>Gelernt`.

## Bericht des letzten Auftrags, zur Nachlese

**Fertig** auf `abenteuer-regelwerk` (Basis b795b32e hereingeholt).

**Lizenz (zuerst geprüft):** `@dicebear/pixel-art` 9.4.3, `package.json`: „license“: „MIT“ (Code);
`LICENSE`: „Design … Source: Pixel Art (Figma) … Designer: DiceBear … License: CC0 1.0“, Code MIT
(Florian Körner); ebenso im `README.md`. Öffentliche und kommerzielle Nutzung erlaubt, Nennung
freiwillig. Eingetragen in `docs/spiel/LIZENZEN.md` (Abschnitt Material). Das Paket ist nur zum
Erzeugen installiert (`npm install --no-save`), nicht in `package.json` und nicht in der App.

**Skript** `app/skripte/erzeuge-figurenbilder.mjs` (Aufbau wie `erzeuge-gegnerbilder.mjs`):
Tabelle mit 60 Einträgen (Frisur, Haarfarbe, Hautton, Kleidung, Kleidungsfarbe, Brille, Bart, Hut)
für alle Porträtnamen aus `gegner.json` und den Figuren in `orte.json`, dazu `ambrose-jung`.
Deterministisch (Startwert = Name), standardmäßig nur fehlende Bilder, `--alle` erzeugt neu,
`--pruefen` meldet Figuren ohne Tabelleneintrag (heute keine). Graue und weiße Haare für die
Älteren als eigene Farbwerte, acht Hauttöne über alle Städte verteilt.

**Bilder:** 60 SVG zu 128 × 128 (Raster 32 × 32), ohne Hintergrund, zusammen 244 KB, in
`inhalte/abenteuer/portraets/`. Durchgesehen als Kontaktbogen; Ambrose alt (mit Bart) und jung
unterscheiden sich, Victor erscheint in allen Orten mit demselben Bild.

**Prüfungen:** `pytest pipeline/tests` 470, `npm run pruefen` 361 Dateien und 2414 Tests (auch ohne
das Pixel-Art-Paket in `node_modules`, wie in der CI), Paketbau läuft.

**Was im Paketbau und in der Anzeige fehlt (Vorschläge)**

1. **Paketbau:** `baue-abenteuerpaket.mjs` packt heute keine Porträts. Vorschlag: alle
   `inhalte/abenteuer/portraets/*.svg` als Gruppe `portraets` ins Paket (wie `karten/`); liegt
   unter `app/inhalte-privat/abenteuer/portraets/` eine gleichnamige Datei (später gekaufte oder
   gezeichnete Bilder), geht sie vor, wie bei der Grafik.
2. **Pfade in `gegner.json`:** `portraet` zeigt auf `portraets/<name>.webp`; die Bilder sind SVG.
   Entweder die Pfade auf `.svg` umstellen (Schema erlaubt `svg`) oder beim Laden die Endung
   ignorieren und den Namen nehmen.
3. **Dialog:** Porträt links neben der Sprechblase, aus dem Tag `#sprecher:<kennung>`. Die Kennungen
   sind camelCase (`bigJoe`, `omaRuth`, `coachDelgado`), die Dateien kebab-case (`big-joe.svg`):
   eine kleine Umrechnung (camelCase → kebab) genügt; `erzaehler` ohne Bild, `ambrose` in Orten der
   Art `erinnerung` als `ambrose-jung`. Größe 64 bis 96 Pixel mit `image-rendering: pixelated`.
4. **Stimmungen** (`#stimmung:froh`, `traurig`, `streng`, …): Der Stil kennt Münder `happy01–13` und
   `sad01–10`. Vorschlag: für Hauptfiguren je Stimmung eine zweite Datei (`ambrose-traurig.svg`) mit
   anderem Mund erzeugen; das Skript kann dafür eine zweite Tabelle bekommen.
5. **Partieansicht:** Das Porträt des Gegners aus `gegner.json` statt des Bot-Porträts der App
   (Stellungnahme, Abschnitt 1: „Clubchefs und Story-Figuren brauchen eigene Porträts“).

## Bericht des letzten Auftrags, zur Nachlese

**Fertig** auf `abenteuer-regelwerk` (Basis d0437d2c hereingeholt).

**Dialoge** (alle Knoten aus der Liste von mittel-1, dazu Unterknoten):

- `weg-ironwood-silicon.ink` (Szene 52): `kowalczyk` (Weisheit Kapitel 1.2), `joggerin` (Duell mit
  Uhr, Wiederholung), `zurueck_ironwood`, `tafel` (Runde), `fund_anstecker`, `fund_ohrstoepsel`.
- `silicon-bay-aussen.ink`: `ankunft_zu_fuss` (Szene 53, Victor holt ab), `dash` (Szene 54, Sprüche,
  beim ersten Sieg `gibKarte("gruebelfalle")`), `rosie`, `glasbruecke`, `hotel` mit `hotel_nacht`
  (Szene 61, nach der Clubnadel), `bus_ironwood` (`reise` zum Bus in Ironwood), `faehre` (Sperre bis
  `nadelSiliconBay`).
- `silicon-bay-akademie.ink`: `lin` (Szene 55, Reihe offen, Szene 59 „Warum man im Club schweigt“,
  Clubkampf, nach Niederlage/Sieg, Alltag mit Revanche), `theo` (Probepartie, Tablet, Reihe, öffnet
  nach der Auswertung den Serverraum: `serverraumOffen`), `nova` (Reihe, Bitte nach dem Fund),
  `serverraum_zu`.
- `silicon-bay-lobby.ink`: `victor` mit `victor_berichte` (Szene 56, Runde `siliconBay.auswertung`)
  und `victor_falsch` („Das ist falsch.“, Buchbezug Kapitel 12.2), `empfangsroboter`, `vitrine` mit
  `vitrine_foto` (Szene 57, übergreifende Quest „Die fehlende Seite“).
- `silicon-bay-serverraum.ink`: `schummelgeraete` (Ohrempfänger, Nova bittet um Schweigen).
- `ironwood-aussen.ink`, nur `bus_silicon_bay`: Szene 51 (Mama, Juno) und 51a (Reisebrett), dann
  `reise("wegIronwoodSilicon.raststaette", "start")`; neue Variable `abfahrtSiliconGesehen`.

**Quests** (eigener Block hinter Akt 2): Haupt `siliconBay.akademie` (7 Schritte: Glasbrücke mit
Reisebrett, Ankunft, Dr. Lin, Reihe Theo, Reihe Nova mit Zweiter Chance, Clubkampf mit Mentor-Zug,
Hotelnacht), `siliconBay.spielberichte` (Auswertung → Steckbrief und „analysiert“ für Dr. Lin;
Serverraum → Gegenstand `ohrempfaenger`), `siliconBay.fehlendeSeite` (Gegenstand `notizbuchseite`),
`wegIronwoodSilicon.tafelRaststaette`. **Runden:** `wegIronwoodSilicon.tafel` (3), `siliconBay.reiheTheo`,
`siliconBay.reiheNova`, `siliconBay.auswertung` (3); Novas Reihe und die Tafel nutzen nach dem Hinweis
des Haupt-Chats das neue Thema `falle`. **Texte:** 15 neue Schlüssel.

**Prüfungen:** `pytest pipeline/tests` 385 bestanden; Paketbau kompiliert alle Ink-Dateien;
Simulation mit inkjs (alle Knoten wie im Spiel gemeldet, Variablen beim Dialogende zurückgeschrieben
wie in `Oberwelt.beiDialogende`, Quests wie `regeln/quests.ts`): ein Durchgang von der Abfahrt in
Ironwood bis zur Fähre mit verlorener und gewonnener Joggerin- und Clubpartie; alle vier Quests
erledigt. `npm run pruefen`: bestanden (nach dem Hereinholen von 62297ddb: 360 Dateien, 2411 Tests; pytest 470).

**Befunde**

1. **Fehler in der Hülle bzw. in den Dialogen (wichtig):** Beim Dialogende schreibt
   `beiDialogende` alle Ink-Variablen in `dialogvariablen` zurück. Deklariert eine Datei
   `VAR gefunden<Fund> = false` und ruft im selben Dialog `gibFund`, überschreibt der Startwert den
   Wert, den die Hülle gerade gesetzt hat. Betroffen heute: `cedar-creek-aussen.ink`
   (`gefundenSchluessel`): Der Schlüssel vom Steg wird gefunden, aber `gefundenSchluessel` bleibt
   false, also bietet Mrs. Albescu in Riverton den Schuppen nie an. Vorschlag: In `beiDialogende`
   Werte nicht zurückschreiben, die die Hülle im Dialog gesetzt hat (Funde, Besitz), oder in den
   Dialogen eigene Merker benutzen wie hier. Meine Dateien benutzen eigene Merker.
2. **Funde fehlen in `funde.json`** (nicht meine Datei): Der Querverweis-Test verlangt jeden
   `gibFund`. Vorschlag für Einträge: `anstecker` (Weg 4, 5 Münzen), `ohrstoepsel` (Weg 4),
   `zeroTablet` (Silicon Bay, Theos Geschenk), `ohrempfaenger` und `notizbuchseite` (heute als
   Quest-Gegenstand), `holzdame` (Campus, versteckt; noch kein Auslöser in `orte.json`). Bis dahin
   merken sich die Dialoge die kleinen Funde selbst.
3. **Laden fehlt:** `siliconBay.foodtruck` (Rosie) steht nicht in `laeden.json`; Rosie erzählt nur.
   Angebot laut Bibel Abschnitt 22.
4. **Buchübungen des Clubs** (`ueb:spannung-halten`, `ueb:k2-italienisch-sg5`, `ueb:k2-carokann-h4`,
   `ueb:lasker-falle`) liegen nicht im Taktiktrainer; die Reihen nutzen nur Themen (`haengend`, `falle`). Die Auswertung der Spielberichte (Szene 56) läuft als Runde mit dem Thema `haengend`,
   bis es eine Aufgabenart „Welcher Zug ist zu gut?“ gibt.
5. **Szenen-Wirkungen:** Hauptquest setzt `akt3.abfahrt` bis `akt3.ambroseGebannt`; Nebenquests setzen
   keine Szene, damit die Haupthandlung nicht springt.

## Letzter Auftrag (erledigt, zur Nachlese)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `docs/spiel/05_Story_Bibel.md` (neuer Teil „Akt 3“ anhängen),
`docs/spiel/09_Weltbeschreibung.md` (Abschnitte 5.6 bis 5.8 und die Karte in Abschnitt 1, soweit
Akt 3 sie ändert), `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** `npx prettier --check ../docs/spiel` in `app/`

## Ziel

Akt 3 in derselben Form wie Akt 2 (Szenen mit Nummern, Ort, Figuren, Zweck, Dauer, Buchbezug,
Quests, Belohnungen, Wege, Funde, Läden), mit den neuen Schauplätzen aus `10`, Abschnitt 2.

## Vorgaben

1. **Orte:** Silicon Bay (Konzern-Akademie, Dr. Lin, Schummelgeräte, Ambrose fasziniert von der
   KI), **Port Delacroix** statt Old Harbor (O1, O2: Ambroses Geburtsstadt, vom Hurrikan
   zerstörter Club im alten Musikhaus, Wiederaufbau als Nebenquest über drei Besuche, Tiefpunkt:
   Schummelvorwurf, der Held spielt ohne Ambrose, Versöhnung über die Nachfahren, die Klavierbauer
   Whitlock-Duval mit einer Teenagerin ohne Schachinteresse), Desert Springs mit Canyon-Weg (O4,
   Mira). Clubs, Buchkapitel nach `07_Aufgabenzuordnung.md`.
2. **Wege** zwischen Ironwood → Silicon Bay → Port Delacroix → Desert Springs mit Stationen (W4),
   Verkehrsmittel nach 08 (Bus, Fähre oder Küstenzug, Zug durch die Wüste).
3. **Sprüche** (S1 bis S6): Straßengegner mit eigenen Sprüchen und Immunität im Steckbrief; eine
   Szene, in der Ambrose erklärt, warum im Club geschwiegen wird.
4. **Funde und übergreifende Quests:** „Umschlag ohne Brief“ und „Nietenkopf J. H.“ aus Akt 2
   auflösen; eine neue übergreifende Quest anlegen, die in Akt 4 aufgeht.
5. **Ein Flashback** in Port Delacroix (Ambroses Kindheit in der Klavierwerkstatt, kurz, mit einer
   Stellung aus `inhalte/zusatzpartien/klassiker.json`).
6. **Ton:** Der Hurrikan ist echt und ernst, aber nicht traurig erzählt; Wiederaufbau ist Hoffnung.
   Keine realen Personen, Firmen oder Katastrophen-Namen.

## Was nicht dazugehört

Akt 4 (das erfundene Volk O5 und die Varianten kommen dort), Daten, Dialoge, Karten.

## Bericht

**Fertig** auf `abenteuer-regelwerk` (Basis bc09d58a hereingeholt). `05_Story_Bibel.md` hat einen
neuen Teil 3 „Akt 3“ (Abschnitte 16 bis 24, Szenen 51 bis 80, etwa 5 bis 6 Stunden);
`09_Weltbeschreibung.md`: Karte in Abschnitt 1 (Port Delacroix statt Old Harbor, Reise über Ashford
hinaus) und Abschnitte 5.6 bis 5.8 neu. Prettier besteht.

**Inhalt nach Vorgaben**

1. **Orte und Clubs:** Silicon Bay (Club 5, Dr. Lin, E + 460, Eröffnungsgrundsätze; Nova, Theo;
   Straße Dash; Laden Rosies Food-Truck), Port Delacroix (Club 6, Miss Odile, E + 520,
   Bauernstruktur und Pläne; Remy, Lou; Straße Mr. Batiste; Nachfahren Henri und Céleste
   Whitlock-Duval; Laden Gebäckstand), Desert Springs (Club 7, Mira, E + 580, Königsangriff und
   Opfer; Tomás, Dot; Straße Buck; Laden Antiquariat Mr. Okoro). Buchübungen nach `07`.
   Tiefpunkt (Szene 63, Vorwurf durch Remy, Clubkampf ohne Karten, R28/R29), Versöhnung in zwei
   Stufen: Nachfahren in Port Delacroix (Szene 68, O2), ganz im Canyon (Szene 73).
2. **Wege:** `wegIronwoodSilicon` (Bus bis zur Raststätte, Glasbrücke zu Fuß),
   `wegSiliconDelacroix` (Küstenfähre als begehbares Deck, Deich), `wegDelacroixDesert` (Wüstenzug,
   Canyonpfad, Felsbogen), je mit Rätseltafel, Gegner mit Uhr oder Mira, Funden, Figur mit Weisheit.
3. **Sprüche:** Dash (immun gegen „Großes Maul“), Batiste (immun gegen beide), Buck und der
   Schiffskoch (nicht immun), eigene Sprüche je Gegner; Szene 59: Ambrose erklärt, warum im Club
   geschwiegen wird (S2). Grübelfalle und Großes Maul als Belohnungen (Z4: nicht im Laden).
4. **Funde und E4:** 14 Funde; „Umschlag ohne Brief“ aufgelöst (Szene 76, Hales Brief „Ich
   warte.“), „Nietenkopf J. H.“ aufgelöst (Szene 73, Canyonbrücke von 1879); neu **„Die fehlende
   Seite“** (Notizbuch der Hales in der Lobby von Silicon Bay, Victor hat die Seite, Auflösung Akt 4
   in Summit City und Ghost Town).
5. **Flashback:** Klavierwerkstatt 1840 und 1852, Zugerraten `klassik-unsterbliche` Züge 1 bis 11.
6. **Ton:** Hurrikan als Vergangenheit, Wiederaufbau über drei Besuche als Hoffnung; keine realen
   Personen, Firmen oder Sturmnamen.

**Widersprüche und Vorschläge für gesperrte Stellen**

- **Geburtsort:** Teil 1 (Zeitlinie, 2.2) nennt New Orleans. Vorschlag: Zeile 1831 in Teil 1 auf
  „Port Delacroix, im Delta vor New Orleans; Schach in den Kaffeehäusern von New Orleans“ ändern.
- **Jahreszeit:** O1 sagt Spätsommer, 09 Abschnitt 2 setzt Akt 3 in Winter/Frühjahr. Gelöst:
  Hurrikan im letzten Spätsommer, Akt 3 im Winter danach. 09 Abschnitt 2 (Akt-3-Zeile „Old Harbor
  Sturm und Gischt“), Abschnitt 3.5 (Hafenkneipe), 4 und 4a (Old Harbor) nennen noch Old Harbor;
  durfte ich nicht ändern.
- **Flashback-Partie:** `klassiker.json` hat vor 1866 nur drei Partien, alle benutzt (Paulsen–Morphy
  in Cedar Creek, Unsterbliche in Riverton, Bird–Morphy in Ironwood). Vorschlag: eine öffentliche
  Partie aus den 1830er/1840er Jahren aufnehmen (C3 erlaubt das), dann den Flashback umstellen.
- **Steckbrief:** Immunität gegen Sprüche (S4) braucht eine neue Art der Steckbriefzeile, etwa
  `{ "art": "spruch", "wert": "immun:grossesMaul" }`.
- **Erinnerung 1858** (Szene 77): Stellung aus Ambroses erfundener Matchpartie muss mit der Engine
  gebaut werden (R13), eigener Auftrag.
- **Neue Dialogvariablen:** `ambroseSprichtWieder`, `musikhausOffen`, `briefGelesen`.
- **Begegnungen ohne Stellung:** Joggerin (Weg 4) und Schiffskoch (Weg 5) brauchen noch geprüfte
  Stellungen; Batiste 6.5 und Buck 8.44 sind geprüft.

**Offen:** nichts Blockierendes; sechs Fragen mit Empfehlung in Abschnitt 24 der Bibel.
