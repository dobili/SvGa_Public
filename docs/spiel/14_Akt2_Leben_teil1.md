# 14 Leben für die größeren Karten in Akt 2, Teil 1 (Entwurf)

Stand: 9.11.2026, Entwurf von mittel-3 für den Haupt-Chat. Teil 1 umfasst Weg 2 (Cedar Creek →
Riverton), Riverton, Weg 3 (Kanalweg und Eisenbrücke) und den Nebenort N2 Schleusendorf Lockport;
Teil 2 (mittel-4) umfasst Ironwood, Weg 4, Silicon Bay und N3 Steinbruch. Muster: `12_Akt1_Leben.md`.
Lage in Kacheln, Ortsbild und Bühnenbilder stehen in `orte/riverton.md`; Sperren, Nebenorte und
Rückkehr im Ganzen in `13_Wegenetz.md`.

Quellen: `05_Story_Bibel.md` (7 bis 15, Szenen 26 bis 40), `06_Regelwerk.md` (R13 Stellungsduell, R22
Revanchen, R27 Erhalt, R30a Runden, R40 Staffeln, R41 Reise), `07_Aufgabenzuordnung.md` (Clubs 3 und 4:
Kapitel 7 und 4, Gabel, Doppelangriff, Fesselung, Spieß), `08_Wege_und_Entdeckungen.md` (W2 bis W4,
E1 bis E5, G1), `09_Weltbeschreibung.md` (4, 4a, 5.4), `11_Karten_und_Gegenstaende.md` (7.1 Münzen,
7.3 Gegenstände), `13_Wegenetz.md` (3, 7), `orte.json`, `quests.json`, `funde.json`,
`pruefberichte/2026-11-09_akt1_wegenetz.md`.

## 0. Grundsätze

Es gelten die Grundsätze aus `12_Akt1_Leben.md`, Abschnitt 0, unverändert:

1. **Nichts an den Hauptszenen ändert sich.** Keine neue Figur weiß etwas über Ambrose, die Fernpartie,
   1851, 1858, 1866, Josiah Hale, Mamas Finale von 2001 oder Novas Geheimnis, bevor die Hauptszenen es
   erzählen. Andeutungen ja (ein Verkäufer, der im Laden nicht spielen darf; eine Brücke, die älter ist
   als das Werk), Auflösungen nein. Vor allem: Niemand in Riverton oder auf Weg 3 erwähnt Ironwood als
   Mamas Stadt oder die Nieten mit Initialen.
2. **Kleine Aufgaben** tragen `klein: true`: Sie zählen nicht für „alle Nebenquests einer Stadt“ (R27,
   Springervorgabe) und geben **keine Karte**, auch kein `fluestern` (Befund 12). Ausnahme nach 13,
   Grundsatz 6: Der Nebenort Lockport gibt als Lohn des ganzen Ortes **eine** leichte Hilfskarte.
3. **Belohnungen:** Münzen (10 je Aufgabe), Funde fürs Album, typisierte Steckbriefzeilen (C7). Zusammen
   bringen die neuen kleinen Aufgaben dieses Teils **70 Münzen** (Riverton 30, Weg 2 20, Weg 3 20) und
   Lockport **35** (13 nannte 30; dazu 5 für die Tafel S3). Die Wirtschaftssimulation
   (`gesamtsimulation.cjs --wirtschaft`) muss nach dem Einbau zeigen, dass die Grenzen aus 11 (7.1)
   halten; sonst sinken die kleinen Aufgaben auf 5 bis 10 (wie in 12, Entscheidung 4).
4. **Schach im Alltag nach dem Kapitel des Ortes:** Riverton und Weg 2 Kapitel 7 (Abschnitt 7.2, Motiv 1
   Gabel) und Kapitel 4 (Doppelangriff); Weg 3 und Lockport Kapitel 4 und 7 (Gabel, Fesselung, Spieß).
   Bewusste Ausnahme wie der Fährstein in Akt 1: Noors Wand auf Weg 3 ist ein **Spieß**, Vorgeschmack auf
   Priya in Ironwood. Buchbezug im Dialog nur als Kapitel und Abschnitt, nie mit Seiten.
5. **Lieber wenige gute Häuser als viele leere:** neu betretbar ist nur das Gasthaus in Lockport. Alles
   andere bleibt Kulisse mit Figuren davor.
6. **Keine Uhrzeit** (13, Grundsatz 7): Tagesabläufe sind `wann`-Varianten je Szene; Regen und Nebel sind
   feste Tönungen.

## 1. Weg 2: Zedernwald und Bahndamm (`wegCedarRiverton`)

Zwei Karten zu 140 und 150 Kacheln (zusammen 290, etwa 88 Sekunden zu Fuß). Bestehende Stationen bleiben:
Rätseltafel am Wegweiser (Runde `wegCedarRiverton.tafelWegweiser`), Mrs. Fenwick mit Weisheit, Mr. Quinn
(Szene 27), Funde Pfeilspitze, Springer aus Holz, Fahrkarte von 1958. Neu: Pfadfinder mit Schnitzeljagd im
Wald, Streckenwärterin am Damm, Durchlass mit Laterne (Rückweg), Kleingärten, Plakatwand.

### 1.1 Neue Nebenfiguren

| Figur         | Alter, Pronomen | Hintergrund (ein Satz)                                                                                                     | Platz (Karte)                                  | Tagesablauf (`wann`)                                                                          |
| ------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Leif Sorensen | 41, er          | Pfadfinderleiter aus Riverton, Lehrer für Erdkunde, legt mit seiner Gruppe jeden Herbst eine Schnitzeljagd durch den Wald. | zedernwald: Bachquelle (Z2), später Lager (Z9) | Morgen am Bach mit den Kindern, Tag im Lager, Abend packen sie ein.                           |
| Gwen Tolliver | 45, sie         | Streckenwärterin der Bahn, geht seit zwanzig Jahren dieselben neun Meilen und kennt jede Schwelle beim Klang.              | bahndamm: am Dammfuß (B2 bis B4)               | Morgen am Signal, Tag am Haltepunkt mit Mr. Quinn, Abend sitzt sie am Durchlass und schimpft. |

Die drei Pfadfinderkinder sind Statisten („Pfadfinder“, `tun`: Kreidepfeile malen, Steine stapeln).

Sprechweise und Beispielsätze:

- **Leif Sorensen:** begeistert, erklärt gern, Karten und Himmelsrichtungen. „Norden ist da, wo das Moos
  nicht wächst. Oder umgekehrt. Kinder, wo wächst das Moos?“ – „Jeder Pfeil ist eine Frage. Wer sie
  löst, findet den nächsten.“
- **Gwen Tolliver:** trocken, Bahnwörter, klopft beim Reden mit dem Hammer. „Klingt hohl. Die da muss
  raus.“ – „Meine Thermoskanne liegt im Durchlass. Da geh ich nicht rein. Da wohnt was.“ (Es wohnt eine
  Kröte darin.)
- **Mrs. Fenwick** (vorhanden) bekommt einen zweiten Satz für Rückkehrer: „Du schon wieder. Gut. Wege
  muss man zweimal gehen, damit sie einem gehören.“
- **Mr. Quinn** (vorhanden) bekommt nach Szene 27 den Satz: „Nächste Pause in Riverton. Pops macht den
  besten Kaffee am ganzen Netz.“ (Brücke zu Szene 30a.)

### 1.2 Neue Nebenaufgaben

**N-W2a Die Schnitzeljagd** · `raetsel` · `wegCedarRiverton.schnitzeljagd` (klein)

- **Figur und Ort:** Leif Sorensen an der Bachquelle (Z2), Ziel im Pfadfinderlager (Z9).
- **Ablauf:** (1) Leif erklärt: Drei Kreidepfeile an Bäumen, an jedem eine Frage; wer alle löst, darf die
  Fahne im Lager hissen. (2) Pfeil 1 (Z3), Pfeil 2 (Z7), Pfeil 3 (Z9): Auf dem Stamm ist ein kleines
  Diagramm mit Kreide; die Frage „Welcher Zug greift zwei Figuren auf einmal an?“ wird als Wahl im Dialog
  beantwortet (drei Möglichkeiten, Kapitel 7, Abschnitt 7.2, Motiv 1, und Kapitel 4, Doppelangriff).
  Falsch heißt: noch einmal ansehen, kein Abzug. (3) Im Lager hissen {held} und die Kinder die Fahne.
- **Belohnung:** 10 Münzen, Fund „Pfadfinderabzeichen mit Springer“ (`abzeichenSpringer`, Album).
- **Zeit:** 4 bis 6 Minuten (nutzt die Länge des Waldes).
- **Voraussetzung:** keine; sinnvoll nach der Tafel am Wegweiser, weil dort dasselbe Motiv als Aufgabe
  kommt. Unterschied zur Tafel: drei Einzelfragen im Gehen statt einer Runde am Ort.

**N-W2b Gwens Thermoskanne** · `hilfe` · `wegCedarRiverton.thermoskanne` (klein)

- **Figur und Ort:** Gwen Tolliver am Bahndamm; Durchlass unter dem Damm (B5, Sperre S14).
- **Ablauf:** (1) Gwen hat beim Prüfen des Durchlasses ihre Thermoskanne fallen lassen; drinnen ist es
  stockdunkel. Ohne Laterne sagt {held}: „Zu dunkel.“ (2) Mit der **Laterne** (Laden Ironwood, Edna)
  wird der Durchlass sichtbar: eine Kröte, alte Ziegel, die Kanne. (3) Zurück zu Gwen. Sie schenkt aus
  der Kanne ein und erklärt beim Trinken: „Zwei Züge auf einem Gleis. Der vordere kann nicht weg, sonst
  fährt der hintere durch.“ Wahl im Dialog: Wie heißt das auf dem Brett? (Spieß / Fesselung / Gabel;
  Kapitel 4, Spieß und Fesselung; beide ersten Antworten gelten mit Erklärung).
- **Belohnung:** 10 Münzen, Fund „Emaillebecher der Bahn“ (`emaillebecher`, Album).
- **Zeit:** 3 bis 4 Minuten (ohne den Rückweg).
- **Voraussetzung:** Gegenstand `laterne`; damit ein **Rückweg mit Lohn** (13, Grundsatz 5). Die
  Hauptgeschichte braucht den Durchlass nie.

### 1.3 Funde und Entdeckungen

| Karte, Abschnitt        | Entdeckung (Bestehendes in Klammern, Funde fett)                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| Zedernwald Z1 (0–13)    | Grenzstein „Cedar Creek / Riverton“ (`grenzstein`), Eichhörnchen                                     |
| Zedernwald Z2 (14–27)   | Leif und die Pfadfinder (N-W2a)                                                                      |
| Zedernwald Z3 (28–41)   | Specht an der toten Zeder, Pfeil 1                                                                   |
| Zedernwald Z4 (42–55)   | (Mrs. Fenwick mit Weisheit)                                                                          |
| Zedernwald Z5 (56–69)   | (Wegweiser mit Rätseltafel); Trittsteine; (**Pfeilspitze** unter dem Farn, versteckt)                |
| Zedernwald Z6 (70–83)   | Holzsteg, angenagte Stämme (Biber, nur Spuren)                                                       |
| Zedernwald Z7 (84–97)   | Pilzring, Pfeil 2                                                                                    |
| Zedernwald Z8 (98–111)  | Lichtung mit Rehen; (**Springer aus Holz** im hohlen Stamm, versteckt)                               |
| Zedernwald Z9 (112–125) | Pfeil 3, Pfadfinderlager mit Fahne                                                                   |
| Zedernwald Z10          | Zugpfiff, Signalmast in der Ferne                                                                    |
| Bahndamm B1–B2          | Hase; Gwen am Dammfuß                                                                                |
| Bahndamm B3             | Signalmast (`signal`: „Rot heißt warten. Grün heißt nicht trödeln.“)                                 |
| Bahndamm B4             | (Haltepunkt mit Mr. Quinn, Szene 27); (**Fahrkarte von 1958** im Schotter)                           |
| Bahndamm B5             | Durchlass (S14, Laterne), Thermoskanne                                                               |
| Bahndamm B6             | Aussicht über den Fluss (`aussichtFluss`)                                                            |
| Bahndamm B7             | Kleingärten mit Gärtnerin (Statist), Kürbisse an der Pforte                                          |
| Bahndamm B8             | Güterwaggon mit Katze                                                                                |
| Bahndamm B9             | Plakatwand „Perfect Move Park“ (`plakatPerfectMove`, Juno: „Ohne Wartezeit? Wo bleibt da der Spaß?“) |
| Bahndamm B10            | Uhrturm von Riverton in Sicht, Güterzug                                                              |

## 2. Riverton

Außenkarte 72 × 56 (`orte/riverton.md`, 1.3). Der neue Platz geht an: Markt an der Water Street,
Kanalbecken mit Anleger und Pegelhaus, Uferpromenade mit Kaitreppe unter der Brücke, Wohnwagenplatz am
Westende des Parks, Bahnhofsvorplatz mit Bushaltestelle und Brunnen.

### 2.1 Neue Nebenfiguren

| Figur               | Alter, Pronomen | Hintergrund (ein Satz)                                                                                                      | Platz (Karte)                                      | Tagesablauf (`wann`)                                                                           |
| ------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Dima Wolkow         | 34, er          | Akkordeonspieler unter der Steinbrücke, kam vor zehn Jahren mit dem Zug und ist geblieben, „weil der Bogen so schön hallt“. | aussen: Kai unter dem ersten Brückenbogen          | Morgen stimmt er, Tag spielt er für die Pendler, Abend spielt er für die Möwen.                |
| Rosalind „Roz“ Pike | 52, sie         | Gemüsehändlerin am Markt, rechnet im Kopf schneller als jede Kasse und gibt immer einen Apfel zu viel.                      | aussen: Markt, Gemüsestand                         | Morgen baut sie auf, Tag verkauft sie, Abend zählt sie mit Pops die Woche.                     |
| Kyle Brandt         | 22, er          | Verkäufer im Perfect-Move-Laden, spielt in jeder Pause heimlich auf einem Magnetbrett und darf es im Laden nicht.           | aussen: Gehweg vor dem Handyladen                  | Tag im Laden (hinter der Glasfront), in der Pause draußen mit dem Brett, Abend schließt er ab. |
| Pip Delaney         | 9, sie          | Kind aus den Reihenhäusern, springt in jede Pfütze und nur in Springersprüngen, seit sie den Pavillon kennt.                | aussen: Uferpromenade (A3), Pfützen am Pavillon    | Nach der Schule in den Pfützen, später auf der Wiese, Abend ruft ihre Großmutter vom Fenster.  |
| Desmond Grant       | 61, er          | Kanalmeister im Pegelhaus, misst dreimal am Tag den Wasserstand und schreibt ihn in ein Buch, das seit 1931 geführt wird.   | aussen: Pegelhaus am Kanalbecken, Hochwassergatter | Morgen am Pegel, Tag am Gatter, Abend schreibt er ins Pegelbuch.                               |

Bestehende Figuren bleiben (Slick, Tamsin, Ray, Mr. Harlan, Pops, Mrs. Albescu, Nova, Victor). Statisten:
Pendler mit Schirmen, Gabelstaplerfahrer am Güterschuppen, Angler auf der Ufermauer, Kameraleute in
Szene 29, Kellnerin im Café (draußen).

Sprechweise und Beispielsätze:

- **Dima:** singt halb, spricht in Takten. „Eins, zwei, drei, und – Brücke! Hörst du, wie sie
  antwortet?“ – „Slick kommt jeden Morgen vorbei. Er pfeift falsch. Aber schnell.“
- **Roz Pike:** rechnet laut, schnell, mütterlich. „Drei Äpfel, zwei Birnen, macht vier fünfzig, nimm
  den Kürbis mit, der guckt dich an.“ – „Ein Griff, zwei Äpfel. So kauft man ein. Und so spielt Slick.“
- **Kyle Brandt:** freundlich, ein bisschen verlegen, Verkaufssätze, die er selbst nicht ganz glaubt.
  „Perfect Move – Schach ohne Wartezeit! … Willst du eins? Nein? Gut. Ich auch nicht.“ – „Im Laden darf
  ich nicht spielen. Steht im Vertrag. Hier draußen ist Pause.“ (Andeutung, dass der Konzern das echte
  Brett nicht mag; nichts über Hale, Nova oder die Akademie.)
- **Pip Delaney:** atemlos, Fragen. „Ich spring nur wie das Pferdchen. Zwei vor, eins zur Seite. Wenn ich
  richtig springe, kriege ich zwei Tauben auf einmal nass!“ – „Warum leuchten die neuen Tische? Haben die
  Angst im Dunkeln?“
- **Desmond Grant:** langsam, Zahlen, Pegelstände. „Achtzig über normal. Da geht keiner auf den Pfad.“ –
  nach der Nadel: „Wasser ist runter. Der Regen hat aufgehört, als euer Spiel aus war. Zufall, sagt meine
  Frau.“

### 2.2 Neue Nebenaufgaben

**N-RT1 Dimas Notenblätter** · `hilfe` · `riverton.notenblaetter` (klein)

- **Figur und Ort:** Dima unter der Brücke (Kaitreppe).
- **Ablauf:** (1) Der Wind hat drei Notenblätter vom Pult geweht. (2) Blatt 1 klebt am Wartehäuschen der
  Bushaltestelle (Vorplatz). (3) Blatt 2 hat Roz am Gemüsestand aufgehoben; sie gibt es nur gegen eine
  Antwort: „Ein Griff, zwei Äpfel. Wie heißt das auf dem Brett?“ (Wahl im Dialog: Doppelangriff / Gabel
  / beides richtig; Kapitel 4, Doppelangriff, und Kapitel 7, Abschnitt 7.2). (4) Blatt 3 liegt nass auf
  der Treppe des Pavillons. (5) Zurück zu Dima; er spielt das Lied, das auf den Blättern steht, einen
  Walzer mit dem Titel „Gabel-Walzer“, den er für Slick geschrieben hat.
- **Belohnung:** 10 Münzen, Fund „Notenblatt ‚Gabel-Walzer‘“ (`notenblatt`, Album). Danach spielt Dima
  als Belebung dieses Lied (Klang), wenn {held} vorbeikommt.
- **Zeit:** 5 bis 7 Minuten (führt über Vorplatz, Markt, Brücke und Park).
- **Voraussetzung:** nach Szene 28 (Ankunft). Der Fund „Läufer aus Holz“ bei Dima bleibt davon getrennt
  und versteckt.

**N-RT2 Pips Pfützen** · `raetsel` · `riverton.pfuetzen` (klein)

- **Figur und Ort:** Pip an der Uferpromenade (A3); die Pfützen am Pavillon.
- **Ablauf:** (1) Pip springt nur in Springersprüngen und will „zwei Tauben auf einmal nass machen“. (2)
  Aufgabenrunde `riverton.pfuetzen` mit `anzahl` 2, Thema `doppelangriff` (Springergabeln; R30a, Kapitel
  7, Abschnitt 7.2, Motiv 1). Ambrose: „Ein Kind, das wie ein Springer denkt. Es gibt Hoffnung.“ (3) Pip
  springt, die Tauben fliegen auf (Tiere, `fliegen`), Pip jubelt.
- **Belohnung:** 10 Münzen, Fund „Glasmurmel mit Springer“ (`murmel`, Album).
- **Zeit:** 3 bis 5 Minuten.
- **Voraussetzung:** nach Szene 32 (erste Aufgabenreihe, Tamsins Gabeln), damit das Motiv bekannt ist.

**N-RT3 Kyles Pause** · `begegnung` · `riverton.kyle` (klein)

- **Figur und Ort:** Kyle Brandt vor dem Handyladen.
- **Ablauf:** (1) Nach Szene 29 sitzt Kyle in der Pause auf der Stufe vor dem Laden mit einem
  Magnetbrett. „Spielst du? Schnell, bevor die Pause um ist.“ (2) Stellungsduell (R13), 10 Züge
  (Straße), Thema Doppelangriff; Startvorteil nach R13, kein Matt in drei oder weniger, die Pipeline prüft
  die Stellung beim Einbau (Befund 15). (3) Gewinnt {held}, lacht Kyle: „Das hat mir kein Tablet
  gezeigt.“ Verliert {held}: „Siehst du, ich bin gar nicht so schlecht. Sag’s keinem.“ Wiederholbar
  (R22).
- **Belohnung:** 10 Münzen beim ersten Sieg. Kyle bekommt ein Gegnerprofil (`riverton.kyle`, Stärke
  Straße) mit der typisierten Steckbriefzeile `{ "art": "fehlerart", "wert": "taktikUebersehen" }`
  („spielt, was das Tablet vorschlagen würde, und übersieht, was es ihm nicht zeigt“; Befund 13), die
  der Sieg freischaltet. Nach Szene 37 steht Kyle unter den Zuschauern am Pavillon (Statist ohne
  Wirkung): „Ich wollte nur sehen, wie es ohne Bildschirm aussieht.“
- **Zeit:** 5 bis 8 Minuten.

### 2.3 Gebäude

| Gebäude                         | Status                       | Figur               | Dinge zum Ansehen (Auslöser `gegenstand`)                                                                                                                                               |
| ------------------------------- | ---------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bahnhof mit Bahnhofshalle       | betretbar (vorhanden)        | Pops, Mr. Harlan    | (`grosseUhr`, `zeitungsstand`, Funde); neu `fahrplantafel` („Cedar Creek 7:10, 12:10, 17:10. Ironwood: siehe Bus.“), `fundbuero` („Gefunden: ein Regenschirm. Noch einer. Noch einer.“) |
| Parkpavillon                    | betretbar (vorhanden)        | Slick, Tamsin, Ray  | (`gedenktafel`, `limonadenglas`); neu `uhrKlebeband` („Sie geht. Fragt nicht, wie.“)                                                                                                    |
| Slicks Wohnwagen                | betretbar nach dem Clubkampf | Slick               | (`dosentrophaeen`); neu `brettBett`, `kurierrad`                                                                                                                                        |
| Schuppen                        | betretbar mit Schlüssel (E4) | –                   | (`fahrrad`); neu `werkzeugwand`                                                                                                                                                         |
| Fahrradwerkstatt Albescu        | Kulisse                      | Mrs. Albescu        | Rolltor mit Schild (`werkstattTor`: „Geschlossen seit dem Frühjahr. Die Fahrräder vermissen mich.“)                                                                                     |
| Handyladen „Perfect Move Store“ | Kulisse                      | Kyle                | (`handyladen`)                                                                                                                                                                          |
| Markt                           | Platz                        | Roz                 | Stände (Belebung), Roz als Figur                                                                                                                                                        |
| Café „Dockside“                 | Kulisse                      | Kellnerin (Statist) | –                                                                                                                                                                                       |
| Pegelhaus                       | Kulisse                      | Desmond Grant       | `pegel` („Pegelbuch seit 1931. Jeder Regen steht drin.“)                                                                                                                                |
| Anleger                         | Platz                        | –                   | `anlegerSchild` („Lastkahn Ashford Belle: Riverton – Lockport – Ironwood. Fahrten nach Ansage.“), ab L3 Reise                                                                           |
| Bushaltestelle                  | Kulisse                      | –                   | `busIronwood` (Reise nach `besuchtIronwood`)                                                                                                                                            |

### 2.4 Funde und Entdeckungen

Abschnitte wie in `orte/riverton.md` 1.3 (A bis D zu je 18 Spalten, Reihen 1 bis 4).

| Abschnitt           | Entdeckung (Funde fett, Bestehendes in Klammern)                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| A1 Gleisfeld        | Ratten huschen (Geräusch), Sichtachse auf den Uhrturm                                                               |
| B1 Bahnhof          | Stellwerk mit Hebeln, (Bahnhofstür)                                                                                 |
| C1 Güterschuppen    | Laderampe, Gabelstaplerfahrer (Statist: „Kisten für Ironwood. Immer Kisten für Ironwood.“)                          |
| D1 Wasserturm       | Tauben auf dem Tank                                                                                                 |
| A2 Westende         | Kyle (N-RT3), (`handyladen`)                                                                                        |
| B2 Vorplatz, Markt  | Wegweiser (`wegweiserRiverton`), Brunnen mit Tauben, Roz                                                            |
| C2 Water Street     | (Mrs. Albescu), Werkstatttor (`werkstattTor`), Bushaltestelle, Banner                                               |
| D2 Lagerhäuser      | Möwen, Wendeplatz                                                                                                   |
| A3 Westufer         | Pip (N-RT2), Bank mit Blick über den Fluss                                                                          |
| B3 Hinter dem Markt | (Schuppen), Angler auf der Ufermauer                                                                                |
| C3 Brücke           | Dima (N-RT1); (**Läufer aus Holz**, versteckt)                                                                      |
| D3 Kai              | Kran, Möwen streiten um Pommes                                                                                      |
| A4 Wohnwagenplatz   | (Wohnwagen), Kurierrad, Grill                                                                                       |
| B4 Wiese            | (Bildschirmtische), Brunnen                                                                                         |
| C4 Pavillon         | (Pavillon), Parktor mit Plakat, Pfützen mit Spiegelung                                                              |
| D4 Kanalbecken      | Anleger (`anlegerSchild`), Pegelhaus mit Desmond (`pegel`), Hochwassergatter                                        |
| Bahnhofshalle       | (**Zeitungsausschnitt** hinter dem Ständer, versteckt), (**Taubenfeder** auf Harlans Bank), Fahrplantafel, Fundbüro |

## 3. Weg 3: Kanalweg und Eisenbrücke (`wegRivertonIronwood`)

Zwei Karten zu 190 und 160 Reihen (zusammen 350, etwa 113 Sekunden zu Fuß, 56 mit dem Fahrrad).
Bestehende Stationen bleiben: Rätseltafel an der Bushaltestelle ohne Bus (Runde
`wegRivertonIronwood.tafelHaltestelle`, die einzige Tafel auf Weg 3, Befund 1), Mr. Dale mit Weisheit,
Funde Zahnrad und Nietenkopf, Szene 40 auf der Brücke. Neu: Graffiti-Künstlerin an der Fabrikmauer,
Anstreicher an der Eisenbrücke, Abzweig nach Lockport mit Wegweiser, Rastanleger mit Flaschenpost.

### 3.1 Neue Nebenfiguren

| Figur       | Alter, Pronomen | Hintergrund (ein Satz)                                                                                                   | Platz (Karte)                      | Tagesablauf (`wann`)                                                                    |
| ----------- | --------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------------------- |
| Noor Haddad | 19, sie         | Kunststudentin aus Riverton, sprüht ein riesiges Schachbrett auf die Mauer der alten Spinnerei, mit Erlaubnis, sagt sie. | kanalweg: vor der Fabrikmauer (K2) | Morgen grundiert sie, Tag sprüht sie, Abend fotografiert sie die Wand im letzten Licht. |
| Corwin Lund | 58, er          | Anstreicher der Kanalverwaltung, streicht seit vier Jahren die Eisenbrücke und ist immer gerade am anderen Ende fertig.  | bruecke: Brückenkopf (BR4)         | Morgen rührt er Farbe, Tag streicht er, Abend sitzt er auf der Bank in BR6.             |

Sprechweise und Beispielsätze:

- **Noor Haddad:** schnell, Farbwörter, begeistert. „Der Turm kriegt Ultramarin. Und dahinter, auf
  derselben Linie, die Dame. Siehst du’s? Nein? Warte, bis ich fertig bin.“ – „Wände sind Bretter, die
  nicht umfallen.“
- **Corwin Lund:** gemächlich, Wetterwörter. „Der Wind nimmt die Hälfte. Die andere Hälfte nimmt der
  Rost.“ – „Die Brücke ist älter als das Werk da unten. Die Nieten halten besser als meine Farbe.“ (Nichts
  über die Initialen; die findet {held} in Szene 40 selbst.)
- **Mr. Dale** (vorhanden) bekommt einen Satz für Rückkehrer mit Fahrrad: „Mit dem Rad, hm? Ein Bauer
  zieht nie zurück. Ein Fahrrad schon. Glück gehabt.“

### 3.2 Neue Nebenaufgaben

**N-W3a Noors Wand** · `raetsel` · `wegRivertonIronwood.wand` (klein)

- **Figur und Ort:** Noor Haddad vor der Fabrikmauer (K2).
- **Ablauf:** (1) Noor hat Figuren auf ein riesiges Brett gesprüht und will „eine Linie, auf der zwei
  Figuren hintereinander stehen und die vordere weg muss“. (2) Aufgabenrunde `wegRivertonIronwood.wand`
  mit `anzahl` 2, Thema `spiess` (R30a; Kapitel 4, Spieß; bewusste Ausnahme vom Grundsatz „Weg = Thema
  des letzten Clubs“, Vorgeschmack auf Priya in Ironwood). (3) Noor sprüht die Lösung an die Wand.
- **Belohnung:** 10 Münzen, Fund „Foto von Noors Wand“ (`fotoWand`, Album). Rückkehr: In Akt 3 ist die
  Wand fertig (Objektebene, 13 §7.3), Noor hat ein neues Motiv.
- **Zeit:** 3 bis 5 Minuten.
- **Voraussetzung:** keine.

**N-W3b Corwins Farbeimer** · `hilfe` · `wegRivertonIronwood.farbeimer` (klein)

- **Figur und Ort:** Corwin Lund am Brückenkopf (BR4); der Eimer liegt an der zweiten Kehre (BR8).
- **Ablauf:** (1) Der Wind hat einen Farbeimer den Hang hinuntergerollt. (2) {held} holt ihn an der
  zweiten Kehre (Serpentinen hin und zurück, die Strecke ist das Erlebnis). (3) Corwin bindet den Eimer
  ans Geländer: „So. Jetzt hängt er fest. Der kann nicht weg, sonst kippt die Leiter.“ Wahl im Dialog:
  „Wie im Schach, wenn eine Figur nicht weg darf, weil dahinter …“ (der König / die Dame steht; Kapitel 4,
  Fesselung; beide Antworten gelten mit Erklärung, absolute und relative Fesselung).
- **Belohnung:** 10 Münzen.
- **Zeit:** 3 bis 4 Minuten.
- **Voraussetzung:** keine; wer den Weg nach Ironwood zum ersten Mal geht, kommt in Szene 40 ohnehin hier
  vorbei. Corwin steht in Szene 40 nicht im Bild (er macht gerade Pause auf der Bank in BR6), damit
  Ambroses Gespräch auf der Brücke allein bleibt.

### 3.3 Funde und Entdeckungen

| Karte, Abschnitt | Entdeckung                                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kanalweg K1      | Hochwassergatter (offen), Meilenstein „Meile 0“ (`meilenstein`), Möwe auf dem Poller                                                               |
| Kanalweg K2      | Noors Wand (N-W3a)                                                                                                                                 |
| Kanalweg K3      | (**Zahnrad** am Zaun der leeren Fabrik), Krähen                                                                                                    |
| Kanalweg K4      | (Rätseltafel an der Bushaltestelle ohne Bus), Drehbrücke                                                                                           |
| Kanalweg K5–K6   | Schornstein, Brombeeren, Kahnwrack mit Bisamratte                                                                                                  |
| Kanalweg K7      | Wegweiser nach Lockport, Treidelbrücke, Sicht auf Lockport                                                                                         |
| Kanalweg K8      | Rastbank (`rastKanal`), Libellen                                                                                                                   |
| Kanalweg K9–K10  | (Mr. Dale am Zaun), Scheune, Hühner                                                                                                                |
| Kanalweg K11     | **Flaschenpost** am Rastanleger (`fundFlaschenpost`, Album: ein Zettel von Finn, „Wer das findet: komm nach Lockport. Ich hab schon 41 Flaschen.“) |
| Kanalweg K12–K13 | Gänse, Pappeln, Rauch im Süden                                                                                                                     |
| Brücke BR2       | Wärterhaus (`waerterhaus`: „Vernagelt. Auf der Tür steht ‚Brückenwärter‘ und darunter ‚bin gleich zurück‘.“)                                       |
| Brücke BR4–BR5   | Corwin (N-W3b); (Szene 40); (**Nietenkopf** am Geländer); Aussicht ins Tal (`aussichtTal`)                                                         |
| Brücke BR6–BR11  | Bank mit Blick auf das Werk, Eidechse, Wegkreuz, Graffiti „Ironwood steel“                                                                         |

Die Flaschenpost ist ein kleiner Fund ohne Münzen; sie zeigt den Weg nach Lockport von der anderen Seite
(Grundsatz aus 12: man sieht, was hinter der Sperre liegt).

## 4. Nebenort N2 Schleusendorf Lockport (`lockport`)

Eine Außenkarte (56 × 40) und das Gasthaus (20 × 13), `orte/riverton.md` 1.6 und 4.10–4.11. Abstecher
vom Kanalweg (Q2), Sperre S3 am Steg über das Untertor der Schleuse. Thema und Figuren nach `13_Wegenetz.md`,
Abschnitt 3; hier ausgearbeitet. Alle Aufgaben tragen `klein: true` (13, Grundsatz 6).

### 4.1 Figuren

| Figur                    | Alter, Pronomen | Hintergrund (ein Satz)                                                                                                          | Platz                                                  | Tagesablauf (`wann`)                                                            |
| ------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Imogen Rourke            | 63, sie         | Schleusenwärterin in dritter Generation, läutet die Glocke für jeden Kahn und kennt alle Kapitäne am Klang ihres Horns.         | Nordufer am Wärterhaus, Tafel S3                       | Morgen an den Kurbeln, Tag an der Tafel, Abend läutet sie die Glocke zum Essen. |
| Kapitän Ruben Castellano | 47, er          | Fährt den Lastkahn „Ashford Belle“ zwischen Riverton und Ironwood, seit dem Herbst ohne Fracht, weil das Werk weniger bestellt. | Kai neben dem Kahn                                     | Morgen schrubbt er das Deck, Tag sitzt er am Kai, Abend im Gasthaus.            |
| Wirt Otto Lindgren       | 70, er          | Wirt des Gasthauses „Zur Schleuse“, Kegelkönig von 1979 bis 1994, verleiht Gummistiefel an alle, die zum Boot wollen.           | Gasthaus hinter dem Tresen; sein Boot am Bootsschuppen | Morgen kocht er, Tag am Tresen, Abend auf der Kegelbahn.                        |
| Finn Rourke              | 10, er          | Imogens Enkel, angelt Flaschen aus dem Becken und schickt sie mit Zetteln wieder los.                                           | Nordufer (B1)                                          | Nach der Schule am Ufer, Abend zählt er seine Flaschen.                         |

Nachnamen neu (13 nannte nur Vornamen); doppelte Namen sind geprüft. Statisten: Kegler im Gasthaus, eine
Frau hängt Wäsche auf, zwei Möwen auf den Pollern.

Sprechweise und Beispielsätze:

- **Imogen:** ruhig, Wassersprache. „Erst das Wasser, dann das Boot.“ – „Der Steg ist zu, Herbstwartung.
  Wer zwei Dinge zugleich im Blick hat, darf mit mir hinüber. Hier ist die Tafel.“
- **Kapitän Ruben:** tiefe Stimme, kurze Sätze, Seemannsbilder. „Ein Kahn ohne Fracht ist ein Haus ohne
  Leute.“ – „Zwei Ziele, ein Schuss. So legt man an. So gabelt man auch.“
- **Otto:** gemütlich, Kegelwörter. „Alle Neune! … Na ja, acht.“ – „Siehst du den Kegel in der Mitte? Der
  hält alle anderen. Fällt der, fallen sie alle.“
- **Finn:** stolz, Zahlen. „Einundvierzig Flaschen! Zweiundvierzig, wenn du meine gefunden hast.“

### 4.2 Sperre S3 und Tafel

- **Grund in der Welt:** Herbstwartung am Untertor; das Geländer des Stegs ist abgeschraubt. Imogen lässt
  nur hinüber, wer „zwei Dinge zugleich im Blick hat“, und führt {held} am Arm hinüber.
- **Öffnung:** Rätseltafel `lockport.tafelSchleuse` am Nordufer, `anzahl` 2, Thema `doppelangriff`
  (Gabeln; Kapitel 4 und Kapitel 7, Abschnitt 7.2); danach Dialogvariable `lockportSteg` = true, der Steg
  ist Objekt mit Bedingung. Belohnung 5 Münzen (wie die Tafeln der Wege).
- **Prüfung:** Die Hauptgeschichte braucht Lockport nie; die Sperre kann also nichts blockieren. Was
  hinter ihr liegt, sieht man vom Nordufer (Kahn, Gasthausschild, Kai).

### 4.3 Nebenaufgaben

**L1 Das Kahnrennen** · `raetsel` · `lockport.kahnrennen` (klein)

- **Figur und Ort:** Kapitän Ruben am Kai, Kreidetafel neben dem Kahn.
- **Ablauf:** (1) Finn und zwei Kinder lassen Spielzeugkähne im Becken um die Wette fahren; Ruben ist
  Schiedsrichter und malt Aufgaben an die Tafel: „Zwei Kähne gleichzeitig treffen.“ (2) Aufgabenrunde
  `lockport.kahnrennen`, `anzahl` 3, Thema `doppelangriff` (Gabeln, Kapitel 4 und 7). (3) Wer alle löst,
  darf den Startschuss geben (Dialog).
- **Belohnung:** 10 Münzen.
- **Zeit:** 4 bis 6 Minuten.

**L2 Der festgebundene Kahn** · `raetsel` · `lockport.taue` (klein)

- **Figur und Ort:** Wirt Otto (Gasthaus), sein Ruderboot am Bootsschuppen.
- **Ablauf:** (1) Otto will sein Boot für den Winter an Land holen, aber es hängt an vier Tauen, und
  „wenn du das falsche löst, kippt alles“. (2) Am Boot: Aufgabenrunde `lockport.taue`, `anzahl` 2, Thema
  `fesselung` (Kapitel 4, Fesselung; das Bild: ein Tau hält ein anderes, wie eine gefesselte Figur den
  König deckt). (3) Das Boot gleitet an Land; Otto gibt {held} ein Paar **Gummistiefel**: „Damit du beim
  nächsten Boot keine nassen Füße kriegst. Ich hab zwei Paar.“
- **Belohnung:** 10 Münzen, Gegenstand **Gummistiefel** (13, Grundsatz 4: Bayou im Winterhochwasser und
  Watt der Pelikaninsel, Akt 3).
- **Zeit:** 4 bis 5 Minuten.

**L3 Post für den Kapitän** · `hilfe` · `lockport.post` (klein)

- **Figur und Ort:** Big Joe in der Kantine von Ironwood (mittel-4) gibt einen Brief mit; Kapitän Ruben am
  Kai.
- **Ablauf:** (1) Nach Szene 39 (Big Joe getroffen) fragt Big Joe beim Ansprechen: „Kumpel, fährst du am
  Kanal entlang? Bring das Ruben in Lockport. Der Mann hat seit dem Sommer keine Fracht.“ (2) {held} bringt
  den Brief nach Lockport. (3) Ruben liest, lacht laut: Das Werk hat eine Fuhre Stahlträger für ihn,
  „solange es noch Werk ist“ (nur das, kein Wort über den späteren Verkauf). Ab jetzt fährt die „Ashford
  Belle“: Lastkahn-Schnellreise Riverton ↔ Lockport ↔ Ironwood, 5 Münzen je Fahrt (13 §3), Variable
  `lastkahnFrei`.
- **Schachbezug:** keiner (wie die Kühe in N1); bewusst eine Aufgabe nur für die Welt.
- **Belohnung:** 10 Münzen und die Schnellreise.
- **Zeit:** 3 Minuten (ohne den Weg).
- **Voraussetzung:** `bigJoeGetroffen` (Szene 39, mittel-4). Liegt nach Szene 38, also nach dem ersten
  Gang über Weg 3; die Hauptgeschichte braucht den Kahn nie.

### 4.4 Lohn des ganzen Ortes

- Münzen: 5 (Tafel) + 10 + 10 + 10 = **35** (13, Grundsatz 6: 30 bis 40).
- Funde: **„Kegel mit Kerbe“** (`kegelKerbe`, Album, im Gasthaus am Ende der Kegelbahn; Otto: „1979 hab
  ich mit dem alle Neune geworfen. Die Kerbe ist vom Jubeln.“).
- Gegenstand: **Gummistiefel** (L2).
- Schnellreise: Lastkahn (L3).
- **Eine** leichte Karte, wenn alle drei Aufgaben erledigt sind: **Auszeit** (`auszeit`, leicht,
  Verbrauch), von Imogen: „Erst das Wasser, dann das Boot. Manchmal muss man warten, bis die Kammer voll
  ist.“ **Abweichung von 13:** Dort stand Gefahrenradar; das hat jeder schon aus der ersten
  Aufgabenreihe in Maple Falls (R27), es würde immer zu 10 Münzen. Die Auszeit passt zur Schleuse und
  ist eine Verbrauchskarte, also nie doppelt. Schon umgesetzt in diesem Dokument; Widerspruch genügt.

### 4.5 Rückweg mit dem Fahrrad (13 §3)

Kapitän Ruben fordert nach L3 ein **Wettrennen gegen den Kahn**: Er legt in Lockport ab, {held} fährt mit
dem Rad über den Uferpfad und den Kanalweg zum Anleger in Riverton. Wer vor dem Kahn ankommt, bekommt 15
Münzen (einmal je Akt). Technik: dieselbe Zeitmessung auf der Karte wie Jos Rennen im Park von Maple
Falls (13 §3, neue Technik, einmal für beide).

## 5. Brücken zur Hauptgeschichte (ohne Änderung der Hauptszenen)

| Brücke                                         | Wo                  | Wirkung in der Geschichte                                                                                       |
| ---------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| Kyle darf im Laden nicht spielen               | N-RT3               | Der Konzern mag das echte Brett nicht; leise Vorbereitung auf Novas Erschöpfung (Szene 29), ohne ihr Geheimnis. |
| „Gabel-Walzer“ für Slick                       | Dima (N-RT1)        | Slick ist im Viertel beliebt; stützt Szene 36 (Zuschauer unter Schirmen) und Szene 37.                          |
| Roz: „Ein Griff, zwei Äpfel. So spielt Slick.“ | Markt               | Steckbrief-Gefühl vor Szene 34 (Slick sieht Gabeln sofort), ohne Steckbriefzeile.                               |
| Pip springt wie ein Springer                   | N-RT2               | Parkschach ist Teil des Alltags (09, 4a); macht den Verlust des Pavillons fühlbar.                              |
| Regen hört nach dem Clubkampf auf              | Desmond Grant       | Szene 36/37 bekommt ein Bild in der Welt; erklärt die Sperre des Kanalwegs.                                     |
| Quinn: „Pops macht den besten Kaffee“          | Bahndamm            | führt zu Szene 30a (Quinn trinkt Kaffee am Zeitungsstand).                                                      |
| Ruben ohne Fracht, Brief von Big Joe           | L3                  | Das Werk bestellt weniger: leise Vorbereitung auf Szene 49 (Kantine vermietet), ohne den Verkauf zu nennen.     |
| Corwin: „Die Brücke ist älter als das Werk“    | Eisenbrücke         | Gefühl von Geschichte vor dem Nietenkopf (Szene 40); keine Initialen, kein Name.                                |
| Finns Flaschenpost                             | Kanalweg → Lockport | lockt zum Nebenort; kein Bezug zu Briefen der Hauptgeschichte (Hales Brief bleibt in Szene 41 und Akt 3).       |
| Gummistiefel                                   | L2                  | Schlüssel für Akt 3 (Bayou, Watt; 13 Grundsatz 4).                                                              |

## 6. Wege, Sperren und Rückwege

Grundsätze wie in 12, Abschnitt 5: Man **sieht**, was hinter der Sperre liegt, eine Figur **nennt den
Grund** in einem Satz, der Grund ist Alltag.

| Nr. | Karte, Stelle                                           | Grund                                                                           | Öffnung                                                                                           | Öffnet rechtzeitig?                                                                          | Lohn                                                   |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| –   | Cedar Creek Ostrand → Zedernwald                        | Brücke über den Bach im Bau (Akt 1)                                             | `endeAkt1Gesehen` (wie heute)                                                                     | ja: Szene 26 folgt auf das Ende von Akt 1                                                    | Akt 2                                                  |
| –   | Riverton, Treidelpfad am Kanalbecken (Hochwassergatter) | Regen, Kanal achtzig über normal; Desmond Grant: „Da geht keiner auf den Pfad.“ | `nadelRiverton` ≥ 1 (wie heute in `orte.json`); in der Welt hört der Regen nach dem Clubkampf auf | ja: Weg 3 braucht erst Szene 40, und die kommt nach Szene 38, also nach der Nadel (Szene 36) | Weg 3, Lockport, Ironwood                              |
| S3  | Lockport, Steg über das Untertor                        | Herbstwartung, Geländer ab; Imogen                                              | Tafel `lockport.tafelSchleuse` (zwei Gabeln)                                                      | ja: Lockport ist nie Pflicht                                                                 | Nebenort N2                                            |
| S14 | Bahndamm, Durchlass unter dem Damm (neu)                | stockdunkel; Gwen: „Da wohnt was.“                                              | Gegenstand `laterne` (Ironwood, Edna)                                                             | ja: nie Pflicht                                                                              | N-W2b, Emaillebecher, 10 Münzen; Rückweg nach Ironwood |
| –   | Riverton, Slicks Wohnwagen                              | Slick ist im Pavillon                                                           | `clubkampfRivertonBesprochen` (wie heute)                                                         | ja: Szene 37 braucht den Wohnwagen erst nach dem Nachgespräch                                | Szene 37                                               |
| –   | Riverton, Schuppen                                      | Vorhängeschloss, Schlüssel verloren                                             | `schuppenOffen` nach dem Schlüssel (E4, Szene 33)                                                 | ja: nie Pflicht; das Fahrrad gibt es sonst bei Edna                                          | Fahrrad                                                |
| –   | Lastkahn                                                | „Keine Fracht, keine Fahrt.“                                                    | L3 (`lastkahnFrei`)                                                                               | ja: nie Pflicht                                                                              | Schnellreise auf dem Wasser                            |

**S14 ist neu** (Nummer nach S13 aus 13). Die Laterne öffnet damit in Akt 2 drei Stellen (Archivregal
Cedar Creek, Steinbruch N3, Durchlass am Bahndamm) und später Sternwarte und Goldmine (13, Grundsatz 4).

**Rückwege mit Lohn in diesem Teil:**

- **Laterne** (aus Ironwood) → Bahndamm: Durchlass, Gwens Thermoskanne (N-W2b).
- **Fahrrad** → Uferpfad nach Lockport: Wettrennen gegen den Kahn (4.5).
- **Big Joes Brief** (aus Ironwood) → Lockport: Lastkahn (L3).
- **Nach der Nadel von Riverton:** Mrs. Fenwick und Mr. Quinn haben einen neuen Satz, Kyle steht unter den
  Zuschauern; Revanchen gegen Quinn, Harlan und Kyle auf der neuen Stärke (R22).
- **Akt 3** (13, 7.2 und 7.3): Schnee auf den Bildschirmtischen, Slick in der Bahnhofshalle, Noors Wand
  fertig, Eis auf dem Becken in Lockport, Eiszapfen-Fund am Anleger in Riverton.

**Wahl:** Lockport vor oder nach Ironwood; L3 erst nach Szene 39. Seine Aufgaben nutzen Kapitel 4 und 7
wie die Clubs (13, 3).

## 7. Zeitbudget

| Ort                             | Neue Aufgaben (Minuten)     | Gebäude, Figuren, Funde (Minuten)          | Summe     |
| ------------------------------- | --------------------------- | ------------------------------------------ | --------- |
| Weg 2                           | 7–10 (N-W2a, N-W2b)         | 2–4 (Grenzstein, Signal, Gärten, Plakat)   | 9–14      |
| Riverton                        | 13–20 (N-RT1, N-RT2, N-RT3) | 4–6 (fünf Figuren, Pegel, Anleger, Funde)  | 17–26     |
| Weg 3                           | 6–9 (N-W3a, N-W3b)          | 2–4 (Meilenstein, Wegweiser, Flaschenpost) | 8–13      |
| **Teil 1 zusätzlich (ohne N2)** |                             |                                            | **34–53** |
| Lockport (Nebenort N2)          | 13–17 (Tafel, L1, L2, L3)   | 5–8 (Gang, Gasthaus, Figuren)              | 18–25     |

Liegt ein Testlauf darüber, fallen zuerst N-RT3 (Duell) und N-W3b weg. Kleine Aufgaben und Nebenorte
fallen nicht unter die Staffelzeiten von R40 (Akt 2 in Staffel 1: 3 bis 4 Stunden Hauptspiel); sie kommen
obendrauf und werden mit `spielzeitJeOrt` im ersten Testlauf nachgemessen (Befund 17). Die längeren Wege
(Laufzeit nach 7a.2) sind nicht mitgerechnet: Weg 2 dauert zu Fuß etwa anderthalb Minuten reine Laufzeit,
Weg 3 knapp zwei.

## 8. Änderungen an `orte.json` (für den Haupt-Chat)

Karten werden noch nicht gebaut; diese Liste gilt für den Einbau.

**`wegCedarRiverton`**

- `zurueckCedar.ziel` ist schon `{ "karte": "cedarCreek.aussen", "ausloeser": "zedernwald" }`
  (mittel-2; Randübergang, `orte/riverton.md` 1.8).
- Figuren neu: `wegCedarRiverton.sorensen`, `.tolliver`; Statisten „Pfadfinder“ (drei).
- Auslöser neu: `grenzstein`, `pfeil1`, `pfeil2`, `pfeil3`, `signal`, `durchlass` (`wenn: hatLaterne`,
  sonst Dialog „Zu dunkel.“), `aussichtFluss`, `plakatPerfectMove`.
- Quests: `wegCedarRiverton.schnitzeljagd`, `.thermoskanne` (beide `klein: true`).

**`riverton`**

- Figuren neu: `riverton.wolkow` (Dima), `.pike` (Roz), `.brandt` (Kyle), `.delaney` (Pip), `.grant`
  (Desmond). Kyle bekommt das Gegnerprofil und die Begegnung `riverton.kyle`; die Figur heißt
  `riverton.brandt`, damit Figur und Begegnung getrennt bleiben.
- Auslöser neu: `busIronwood` (Dialog, Reise), `anlegerSchild` (Dialog, Reise ab `lastkahnFrei`),
  `wegweiserRiverton`, `werkstattTor`, `pegel`, `fahrplantafel`, `fundbuero`, `uhrKlebeband`, `brettBett`,
  `kurierrad`, `werkzeugwand`; der Auslöser `kanalweg` behält `wenn: nadelRiverton` und bekommt den
  Dialog mit Desmond Grant (Hochwassergatter).
- Quests: `riverton.notenblaetter`, `riverton.pfuetzen`, `riverton.kyle` (alle `klein: true`); Runde
  `riverton.pfuetzen`.

**`wegRivertonIronwood`**

- Figuren neu: `wegRivertonIronwood.haddad` (Noor), `.lund` (Corwin).
- Auslöser neu: `lockport` (Übergang zum Ostrand von `lockport.aussen`, Westrand Reihen 98–99),
  `meilenstein`, `rastKanal`, `fundFlaschenpost`, `waerterhaus`, `aussichtTal`.
- Quests: `wegRivertonIronwood.wand`, `.farbeimer` (beide `klein: true`); Runde
  `wegRivertonIronwood.wand`.

**`lockport`** (neu, Vorschlag `art: "nebenort"` mit Schemaänderung beim Kartenbau von Akt 2, Nummer 0, Staffel 1; Technik, `orte/riverton.md` 3.3 Nr. 5)

- Karten: `lockport.aussen` (`karten/lockport-aussen.json`, außen, Musik vom Kanal oder neu),
  `lockport.gasthaus` (`karten/lockport-gasthaus.json`, innen).
- Figuren: `lockport.imogen`, `.ruben`, `.otto`, `.finn`.
- Auslöser: `kanalweg` (Übergang zurück zum Kanalweg), `gasthausTuer`, `gasthausAusgang`, `tafelSchleuse`,
  `steg` (Objekt mit `wenn: lockportSteg`), `kai` (Dialog, Reise ab `lastkahnFrei`), `glocke`, `pumpe`,
  `ottosBoot`, `kegelbahn`, `fundKegel`, `fotoHochwasser`.
- Quests: `lockport.kahnrennen`, `.taue`, `.post` (alle `klein: true`); Runden `lockport.tafelSchleuse`,
  `lockport.kahnrennen`, `lockport.taue`.

**Funde** (`funde.json`, neu): `abzeichenSpringer` (Weg 2), `emaillebecher` (Weg 2), `notenblatt`
(Riverton), `murmel` (Riverton), `fotoWand` (Weg 3), `flaschenpost` (Weg 3), `kegelKerbe` (Lockport).
Bestehende Funde bleiben; der Sammelzähler der Entdecker-Nadel (E5) zählt nur die Funde aus der
Story-Bibel, damit die Nadel erreichbar bleibt wie geplant (Vorschlag; sonst zählen die neuen mit).

**Gegenstände:** `gummistiefel` (neu, 13 Grundsatz 4; Herkunft L2).

**Dialogvariablen** (R42): `lockportSteg`, `lastkahnFrei`, `bigJoeGetroffen` (setzt mittel-4 in Szene 39
oder nutzt den vorhandenen Merker), Ausgänge `ausgangRivertonKyle` von der Hülle.
