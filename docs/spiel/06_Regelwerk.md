# Schach-Abenteuer – Regelwerk (Schritt 2)

Stand: 07.11.2026, Helfer mittel-2. Grundlage: `01_Konzeptsammlung.md` (Entwurf Regelwerk), `02_Pruefung_Vorschlaege_Projektplan.md` (Abschnitte 2.7 und 5), `04_Architektur.md` (Abschnitte 3 bis 5), `ENTSCHEIDUNGEN.md` (A2, A5, A6, A7, A8, B1, B2, C1, C3, C6, C7), die Verträge in `app/src/abenteuer/schnittstelle/` und die Beispieldaten in `inhalte/abenteuer/`. Es gilt als abgesegnet, solange der Autor nicht widerspricht (CLAUDE.md, Regel 9).

Grundsatz (Konzept): Es wird immer reguläres Schach gespielt. Hilfen ändern Informationen, Züge oder die Startstellung, nie die Zugregeln. Gegner werden nie heimlich geschwächt; jede Schwächung ist vor der Partie sichtbar.

Jede Regel hat eine Kennung (R1, R2 …). Code und Tests nennen sie im Kommentar („Regel: Regelwerk R12, Clubnadel aus Karten“). Zahlen, die nach den Testpartien des Autors noch wandern dürfen, sind als **Startwert** markiert; sie stehen später an einer Stelle im Code (`gegnerstaerke.ts`, `clubnadel.ts` usw.) als benannte Konstanten.

## Begriffe

| Begriff      | Bedeutung                                                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| A            | Aktuelle Wertung des Lesers für das Abenteuer (R2)                                                                               |
| E            | Eingangswertung beim Start des Abenteuers, nach 10 Partien eingefroren (R3)                                                      |
| Z            | Zielstärke (Ziel-Elo) eines Gegners für eine bestimmte Partie (R4, R5)                                                           |
| s            | Stufe der Engine der App, 1 bis 10 (`engine/stufen.ts`), geeicht auf 300 · s Elo                                                 |
| h            | Fehlerhäufigkeit der Partieeinstellung, 1 = wie Menschen der Stufe                                                               |
| Begegnung    | Ein Versuch gegen einen Gegner, mit eigener Kennung `ort.name.n`; ein Wiedereinstieg gehört zur Begegnung, aus der er hervorgeht |
| Ganze Partie | Format `partie` aus der Grundstellung oder mit Vorgabe                                                                           |
| Clubkampf    | Ganze Partie gegen den Clubchef um die Clubnadel                                                                                 |

## 1. Spielstärke

### R1 Ablauf der Stärkeberechnung

Vor jeder Partie rechnet eine reine Funktion in dieser Reihenfolge:

1. Bezugswert nach Rolle (R4): A oder E.
2. Zielstärke Z = Bezugswert + Versatz des Profils (`Gegnerprofil.staerke`) + Post-Game-Aufschlag (R10) + Liga-Aufschlag (R22).
3. Stufe s und Grundhäufigkeit h₀ aus Z (R6).
4. Stufe je Phase = s + `phasenversatz` der Phase, begrenzt auf 1 bis 10 (R7).
5. Zustandsfaktor f aus „abgelenkt“ und „überheblich“ (R8, R9).
6. h = h₀ · f, begrenzt auf 0,5 bis 2,5 (R7).

Ergebnis ist ein `Gerechnetestaerke` (zielElo = Z, stufenJePhase, haeufigkeit = h), das der `Partieauftrag` trägt.

### R2 Aktuelle Wertung A

- A ist die **Abenteuerwertung** im Spielstand, nicht direkt die Wertung der App. Grund: Story-Partien zählen nicht für die Elo-Wertung der App (Entscheidung A2). Ein Kind, das nur das Abenteuer spielt, hätte sonst eine Wertung, die nie steigt, und die Straßengegner würden nie stärker.
- Start: A = Wertung der App (klassische Zeitklasse, `Appdienste`), wenn vorhanden; sonst **600** (Startwert). Die erste Partie mit Schätzung (`Partieergebnis.geschaetzteStaerke`) ersetzt den Startwert, wenn der Leser keine App-Wertung hatte.
- Nach jeder gewerteten Partie der App: A += Änderung der App-Wertung seit dem letzten Lesen.
- Nach jeder Story-Partie, die R38 als „zählt für A“ einstuft: A += K · (S − W), mit S = 1 / 0,5 / 0 für Sieg / Remis / Niederlage, W = 1 / (1 + 10^((Z − A) / 400)), K = 32 in den ersten 10 solchen Partien, danach 20 (wie `spiel/wertung.ts`). Z ist die Zielstärke **vor** dem Zustandsfaktor.
- A ist nie kleiner als 100.
- Vertrag: braucht zwei Felder im Spielstand (siehe Bericht, Vorschlag V1).

### R3 Eingangswertung E

- Hat die App beim Start mindestens 10 gewertete Partien, ist E = A beim Start und sofort fest (`eingangPartien` = 10).
- Sonst gilt E = A, bis `eingangPartien` 10 erreicht; gezählt werden gewertete Partien der App und Story-Partien, die für A zählen (R38). Danach ist E fest (Entscheidung A6, Ergänzung des Autors).
- Clubchefs, die vor dem Einfrieren gespielt werden, rechnen mit dem vorläufigen E. Eine schon gewonnene Clubnadel bleibt, auch wenn E später steigt.

### R4 Zielstärke je Rolle

| Rolle (`Gegnerrolle`) | Bezugswert  | Versatz im Profil                   | Beispiel E = A = 800       |
| --------------------- | ----------- | ----------------------------------- | -------------------------- |
| `strasse`             | A           | −150 bis 0, üblich −100             | 700                        |
| `clubmitglied`        | A           | −100 bis +50, üblich 0              | 800 (Sam: −50 → 750)       |
| `clubchef` Club n     | E           | genau 160 + 60 · n                  | Club 1: 1020, Club 8: 1440 |
| `story`               | E oder fest | frei, Begründung in der Story-Bibel | Victor am Anfang: E + 500  |
| `turnier`             | E           | nach Liga (R22)                     | Silber-Liga: 1450 bis 1600 |

Die Versatzbereiche sind Prüfregeln: Ein Test der Pipeline (`test_abenteuer.py`) meldet Profile außerhalb. Der Clubchef-Versatz folgt aus der Clubnummer in `orte.json` (Coach Delgado, Club 1: 220 ✓).

### R5 Bezugspunkt für Akt und Durchlauf

- Clubchefs rechnen immer mit E, nie mit A: Die Lücke wächst von +220 (Club 1) auf +640 (Club 8) und wird durch Lernen, Vorbereitung und Karten geschlossen (`04_Architektur.md`, Abschnitt 4).
- Straße und Clubmitglieder rechnen immer mit A: Sie wachsen mit dem Leser und bleiben fair.

### R6 Umrechnung Z → Stufe und Grundhäufigkeit

- s = Z / 300, kaufmännisch gerundet (x,5 nach oben), begrenzt auf 1 bis 10.
- Abstand d = Z − 300 · s (liegt zwischen −150 und +150, außer an den Rändern).
- h₀ = 1,4^(−d / 150). Also: 150 unter dem Eichpunkt h₀ = 1,4 (mehr Fehler), auf dem Eichpunkt 1,0, 150 darüber etwa 0,71 (weniger Fehler).
- Startwerte: Eichpunkt 300 · s, bis die gemessenen Stärken aus `engine/botstaerke-daten.ts` übernommen werden; Basis 1,4 je 150 Elo. Beides wird mit einem Test gegen die gemessenen Bot-Stärken geeicht.

Abweichung von `04_Architektur.md`, Abschnitt 4 (dort „Stufe aufgerundet, Häufigkeit linear 1,4 am unteren bis 0,7 am oberen Rand“): Wenn Stufe s auf 300 · s geeicht ist, müsste am oberen Rand h = 1 stehen, nicht 0,7, sonst spielt der Gegner dort stärker als sein Ziel. Mit dem Runden auf die nächste Stufe liegt der Eichpunkt in der Mitte, und 1,4 und 0,7 bleiben die Ränder. Vorschlag V2 im Bericht.

Beispiele ohne Zustand (Stufe s, Häufigkeit h):

| Gegner                     | E = 600         | E = 800         | E = 1200        |
| -------------------------- | --------------- | --------------- | --------------- |
| Straße (A − 100, A = E)    | 500: s 2, 1,25  | 700: s 2, 0,80  | 1100: s 4, 1,25 |
| Clubmitglied (A)           | 600: s 2, 1,00  | 800: s 3, 1,25  | 1200: s 4, 1,00 |
| Victor zu Beginn (E + 500) | 1100: s 4, 1,25 | 1300: s 4, 0,80 | 1700: s 6, 1,25 |
| Clubchef 1 (E + 220)       | 820: s 3, 1,20  | 1020: s 3, 0,76 | 1420: s 5, 1,20 |
| Clubchef 2 (E + 280)       | 880: s 3, 1,05  | 1080: s 4, 1,31 | 1480: s 5, 1,05 |
| Clubchef 4 (E + 400)       | 1000: s 3, 0,80 | 1200: s 4, 1,00 | 1600: s 5, 0,80 |
| Clubchef 8 (E + 640)       | 1240: s 4, 0,91 | 1440: s 5, 1,14 | 1840: s 6, 0,91 |
| Finale Victor (E + 800)    | 1400: s 5, 1,25 | 1600: s 5, 0,80 | 2000: s 7, 1,25 |

Mit Zustand „abgelenkt“ 1,4: Clubchef 1 bei E = 800 → h = 0,76 · 1,4 = 1,06.

### R7 Phasen und Grenzen

- Stufe je Phase = s + `phasenversatz[phase]` (fehlend 0), begrenzt auf 1 bis 10. Beispiel Coach Delgado (Endspiel −1) bei Z = 1020: Eröffnung 3, Mittelspiel 3, Endspiel 2.
- h wird nach dem Zustandsfaktor auf 0,5 bis 2,5 begrenzt (Startwerte). Grund: Unter 0,5 und über 2,5 sind die Fehler der Engine nicht mehr menschlich glaubhaft.

### R8 Zustand „abgelenkt“

- Setzt eine Begegnungs-Quest über `setzeZustand(gegner, faktor, grund)`; erlaubte Faktoren 1,3, 1,4, 1,5 (Entsprechung grob 100 bis 200 Elo, `04_Architektur.md`).
- Sichtbar: Der Dialog vor der Partie nennt den Grund (Textschlüssel `zustand.*`), am Brett steht ein Symbol neben dem Gegnernamen.
- Gilt für die nächste Begegnung mit diesem Gegner einschließlich ihres Wiedereinstiegs; danach wird `Figurenstand.abgelenkt` auf null gesetzt („Revanche, wenn ich ausgeschlafen bin!“).
- Nicht für Story-Partien mit festem Verlauf (R33).

### R9 Zustand „überheblich“ nach Niederlagen

- Faktor ü = 1 + 0,15 · n, höchstens 1,6. n = Zahl der verlorenen ganzen Partien gegen diesen Gegner seit dem letzten Sieg oder Remis (aus dem Partieprotokoll gezählt, Ausgang `niederlage`, Format `partie`). Ein verlorener Wiedereinstieg zählt nicht extra; abgebrochene Partien zählen nicht.
- Gilt für Rollen `clubchef`, `clubmitglied` und `turnier`; nicht für `strasse` (dort ohnehin unter A) und nicht für `story`.
- Sichtbar vor der Partie: Zeile des Gegners („Na, schon wieder da?“) und Symbol am Brett (Textschlüssel `zustand.ueberheblich`).
- Zustandsfaktor gesamt f = abgelenkt · ü, höchstens 2,0 (Startwert), dann R7.
- Beispiel: Coach Delgado, E = 800, zwei Niederlagen → ü = 1,30; h = 0,76 · 1,30 = 0,99.

### R10 Post-Game

- Im zweiten Durchlauf (`handlung.durchlauf` ≥ 2) bekommt jeder Gegner +300 auf Z, auch Straße und Clubmitglieder. Zustände und Grenzen gelten weiter.
- Clubnadeln des zweiten Durchlaufs werden getrennt geführt (Vorschlag V5).

### R11 Zustand „analysiert“

- Ändert die Stärke nicht. Der Leser sieht im Partiefenster die freigeschalteten Steckbriefzeilen des Gegners (Entscheidung C7); `Clubstand.steckbrief` hält, welche.
- Freigeschaltet durch Vorbereitungs-Quests (`schalteSteckbrief`) in der Reihenfolge von `Gegnerprofil.steckbrief`.

## 2. Partieformate

### R12 Ganze Partie

- Start aus der Grundstellung oder mit Vorgabe (R26). Ohne Uhr (R16).
- Farbe des Lesers: im Clubkampf Weiß beim ersten Versuch, danach abwechselnd; Straße zufällig; Story und Turnier legt die Begegnung fest. Grund: Weiß ist für Kinder leichter, Abwechseln verhindert, dass ein Clubchef nur mit einer Farbe geübt wird.
- Ende nur nach den Regeln: Matt, Aufgabe, Patt, dreifache Wiederholung, 50-Züge-Regel, ungenügendes Material. Remisangebote gibt es im Abenteuer nicht (sonst ließe sich Bronze gegen den Clubchef billig holen).

### R13 Stellungsduell (Entscheidung C1)

| Feld                | Regel                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Rollen              | vor allem `strasse`, Rätsel-Quests, Clubmitglieder als Abwechslung; nie Clubkampf                                             |
| Startvorteil        | Leser am Zug, Bewertung +0,8 bis +2,5 Bauern aus Sicht des Lesers (Auswertungs-Engine, Tiefe 12), kein Matt in 3 oder weniger |
| `zuege`             | Straße 10, Clubmitglied 12, Rätsel-Quest 8 bis 15 (Startwerte)                                                                |
| `mindestvorteil`    | 1,0 Bauern (Startwert); höchstens der Startvorteil                                                                            |
| Sieg                | Leser setzt matt, oder nach `zuege` eigenen Zügen Bewertung ≥ `mindestvorteil`                                                |
| Remis               | Remis nach den Regeln, oder nach `zuege` Zügen Bewertung zwischen 0 und `mindestvorteil`                                      |
| Niederlage          | Leser wird matt oder gibt auf, oder nach `zuege` Zügen Bewertung ≤ 0                                                          |
| Gegnerstärke        | wie die Rolle (R4); `eroeffnung` spielt keine Rolle                                                                           |
| Karten              | erlaubt außer Vorgaben und Zeitbonus                                                                                          |
| Kein Wiedereinstieg | Das Duell ist kurz; nach einer Niederlage wird es neu gestartet                                                               |

Quellen der Stellungen (`Startstellung`): `abbildung` (Buchabbildung des Clubkapitels), `meisterpartie` (Meisterpartien des Trainers „Zug erraten“, `inhalte/zusatzpartien`), `fen` (Lichess-Eröffnungen; später Bot-gegen-Bot-Stellungen passend zur Stärke). Die Pipeline prüft jede vorgemerkte Stellung einmal auf den Startvorteil; die App rechnet ihn nicht zur Laufzeit.

### R14 Wiedereinstieg am Kipppunkt (Entscheidungen B1, B2)

Bedingungen, alle nötig:

1. Die Begegnung war eine ganze Partie und endete mit `niederlage` (nicht Remis, nicht abgebrochen).
2. Der entscheidende Fehler ist der Zug des Lesers mit dem größten Verlust.
3. Kipppunkt = die letzte Stellung vor diesem Fehler (Leser am Zug), deren Bewertung aus Sicht des Lesers zwischen −1,0 und +1,0 Bauern liegt; rückwärts gesucht, beginnend bei der Stellung vor dem Fehler.
4. Der Kipppunkt liegt nach Zug 10, also Halbzug ≥ 20.
5. Einmal je Begegnung: Ein verlorener Wiedereinstieg bietet keinen weiteren an.
6. Nicht in Story-Partien mit festem Verlauf (R33), nicht im Stellungsduell.

Ablauf: neuer `Partieauftrag` mit `format: wiedereinstieg`, `startstellung: fen` des Kipppunkts, gleichem Profil, gleichem Zustand (keine neue Überheblichkeit), gleichem Deck. Folgen für die Clubnadel: R20. Gegen Straßengegner ohne Folgen.

### R15 Karten im Wiedereinstieg

- Karten, die in der verlorenen Partie bis zum Kipppunkt gespielt wurden, zählen für die Nadel weiter; dauerhafte Karten davon sind im Wiedereinstieg nicht noch einmal spielbar.
- Karten, die nach dem Kipppunkt gespielt wurden, zählen nicht; verbrauchte Karten bleiben verbraucht.

### R16 Uhr

- Keine Uhr im Hauptspiel (`uhr: null`), auch nicht im Clubkampf (Dokument 02, 2.7).
- Einzige Ausnahme: der Zeitdruck-Spezialist der Landesmeisterschaft, 5 Minuten plus 3 Sekunden je Zug (Startwert). Nur dort ist die Karte Zeitbonus spielbar (R24).

## 3. Clubnadeln (Entscheidung C6)

### R17 Kartenstufe einer Partie

Aus den gespielten Karten (`Partieergebnis.gespielteKarten`, im Wiedereinstieg mit R15) ergibt sich:

| Gespielte Karten                                   | Kartenstufe der Partie |
| -------------------------------------------------- | ---------------------- |
| keine                                              | gold                   |
| eine oder zwei leichte, keine mittlere oder starke | silber                 |
| drei leichte                                       | bronze                 |
| mindestens eine mittlere oder starke               | bronze                 |

Nicht als gespielte Karte zählen: Sanduhr (R25) und Mentor-Zug im Halbfinale (R29).

### R18 Clubnadel aus dem Ausgang

| Ausgang des Clubkampfs               | Clubnadel                                    |
| ------------------------------------ | -------------------------------------------- |
| Sieg, ohne Wiedereinstieg            | Kartenstufe (R17)                            |
| Sieg im Wiedereinstieg, ohne Sanduhr | schlechtere von Kartenstufe und Silber (R20) |
| Sieg im Wiedereinstieg, mit Sanduhr  | Kartenstufe (R17)                            |
| Remis (auch im Wiedereinstieg)       | Bronze, mit Revanche-Angebot (R19)           |
| Niederlage, abgebrochen              | keine                                        |

### R19 Remis

- Gegen den Clubchef: Bronze, unabhängig von den Karten. Der Clubchef bietet sofort eine Revanche an („Das war knapp. Noch einmal?“), die Story geht aber weiter.
- Gegen alle anderen Rollen außer `turnier`: Remis zählt wie ein Sieg (Quest-Schritte mit Ausgang `sieg` sind erfüllt, Belohnungen kommen).
- Im Turnier: Regel der Landesmeisterschaft (Frage F4).

### R20 Wiedereinstieg und Nadel

Ein Sieg im Wiedereinstieg gibt höchstens Silber (Entscheidung B2), mit der Karte Sanduhr ohne diese Grenze. Beispiel: Wiedereinstieg ohne Karten gewonnen → Silber; mit Fluestern gewonnen → Bronze.

### R21 Verbesserung

- `Clubstand.nadel` = beste je erreichte Nadel (Gold > Silber > Bronze); eine schlechtere neue Partie ändert nichts.
- Der Clubchef ist jederzeit erneut spielbar, mit derselben Formel (E ist dann fest). Nach einem Sieg beginnt die Überheblichkeit wieder bei 0 (R9).
- Belohnungen für die erste Nadel eines Clubs (R27) gibt es nur einmal; für die erste Goldnadel eines Clubs gibt es zusätzlich „Ambroses Notiz in Gold“ (Sammelstück ohne Spielwirkung).

### R22 Punkte für die Liga

| Nadel  | Punkte |
| ------ | ------ |
| Gold   | 3      |
| Silber | 2      |
| Bronze | 1      |
| keine  | 0      |

- Höchstwert 24 bei acht Clubs. Liga: Bronze ab 8 Punkten, Silber ab 16, Gold ab 22 (Dokument 02, 2.7).
- Weil die Landesmeisterschaft acht Nadeln voraussetzt, ist die Bronze-Liga immer erreicht; unter 8 Punkte kommt niemand, der dort ankommt.
- Staffel 1 hat vier Clubs (höchstens 12 Punkte): Das Clubtagebuch zeigt die Punkte, eine Liga gibt es erst mit Staffel 2.
- Gezählt wird beim Betreten der Landesmeisterschaft; `handlung.liga` wird dann gesetzt. Bessere Nadeln danach heben die Liga erst im Post-Game (Weltmeisterschaft).

Die Liga bestimmt die Stärke der Landesmeisterschaft (Staffel 2, Frage F3):

| Liga   | Vorrunde und Halbfinale | Finale Victor |
| ------ | ----------------------- | ------------- |
| Bronze | E + 550 bis E + 650     | E + 700       |
| Silber | E + 650 bis E + 750     | E + 800       |
| Gold   | E + 750 bis E + 850     | E + 900       |

Silber entspricht den Werten aus `04_Architektur.md`, Abschnitt 4. Die vier Vorrundengegner steigen in gleichen Schritten innerhalb der Spanne.

## 4. Hilfskarten

### R23 Die neun Sorten

Daten aus `inhalte/abenteuer/karten.json`; Wirkung als Ablauf der Kartenleiste.

| Kennung           | Stufe  | Art       | Zeitpunkt | Wirkung                                                                                                           |
| ----------------- | ------ | --------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| `fingerzeig`      | leicht | dauerhaft | während   | Markiert das Startfeld des besten Engine-Zuges (Tiefe 12), nicht das Ziel                                         |
| `gefahrenradar`   | leicht | dauerhaft | während   | Markiert eigene Figuren, die angegriffen und nicht ausreichend gedeckt sind (Zählen, Kap. 1.4; Warnsignale W1–W7) |
| `zweiteChance`    | leicht | verbrauch | während   | Nimmt den letzten eigenen Zug und die Antwort des Gegners zurück                                                  |
| `fluestern`       | mittel | verbrauch | während   | Zeigt die drei besten Kandidatenzüge als Pfeile, ohne Reihenfolge und ohne Bewertung                              |
| `mentorzug`       | mittel | verbrauch | während   | Ambrose führt den besten Engine-Zug aus (Tiefe 14)                                                                |
| `bauernvorgabe`   | stark  | verbrauch | vorher    | Gegner startet ohne den f-Bauern (R26)                                                                            |
| `springervorgabe` | stark  | verbrauch | vorher    | Gegner startet ohne den Königsspringer (R26)                                                                      |
| `zeitbonus`       | leicht | verbrauch | vorher    | +120 Sekunden Bedenkzeit, nur gegen den Zeitdruck-Spezialisten (R16)                                              |
| `sanduhr`         | mittel | verbrauch | nachher   | Wiedereinstieg ohne Grenze bei der Nadel (R25); nur im Post-Game                                                  |

### R24 Spielen von Karten

- Deck: höchstens `DECKGROESSE` = 3 Karten, jede Sorte einmal, höchstens eine Vorgabe. Gewählt vor der Partie im Dialog vor dem Brett.
- Jede Karte einmal je Partie. Dauerhafte Karten bleiben im Besitz, Verbrauchskarten werden beim Spielen abgezogen (sofort im Spielstand, `04_Architektur.md`, Abschnitt 3, Schritt 4).
- Karten „während“: nur wenn der Leser am Zug ist, die Partie läuft und die Engine nicht denkt (`engineDenkt`); höchstens eine Karte je eigenem Zug.
- `zweiteChance` erst ab dem ersten eigenen Zug, nicht nach Partieende.
- Karten „vorher“: werden beim Start angewandt und tragen Halbzug 0 im `Kartenspiel`.
- `zeitbonus` und Vorgaben nur in ganzen Partien aus der Grundstellung.

### R25 Sanduhr

- Wird beim Angebot des Wiedereinstiegs aus dem Besitz gespielt, nicht aus dem Deck. Zählt nicht als gespielte Karte (R17).
- Der Vertrag kennt nur „vorher“ und „während“; nötig ist „nachher“ (Vorschlag V3).

### R26 Vorgaben: Feld und Spiegelung

- Das Feld in `karten.json` (`f2`, `g1`) nennt die Figur aus Sicht eines weißen Gegners. Spielt der Gegner Schwarz, wird die Reihe gespiegelt (Reihe r → 9 − r): `f2` → `f7`, `g1` → `g8`.
- Beispiele (Leser Weiß, Gegner Schwarz ohne Springer g8): `rnbqkb1r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`; ohne Bauer f7: `rnbqkbnr/ppppp1pp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`.
- Rochaderechte bleiben, weil weder Turm noch König fehlen. Eröffnungsbuch und Praxisbuch sind in Vorgabepartien aus (`eroeffnung` wird `frei`).
- Hinweis: Der Kommentar in `karten.ts` nennt „f7“, „g8“ als Beispiel, die Daten „f2“, „g1“; die Regel hier gilt für beide Schreibweisen, wenn das Feld als „aus Sicht eines weißen Gegners“ gelesen wird (Vorschlag V4).

### R27 Erhalt

| Anlass                                                   | Karte                                  | Anzahl |
| -------------------------------------------------------- | -------------------------------------- | ------ |
| Ambrose erwacht (Quest `mapleFalls.dasBrett`, Schritt 2) | `fingerzeig`                           | 1      |
| Erste bestandene Aufgabenreihe Club 1                    | `gefahrenradar`                        | 1      |
| Erste bestandene Aufgabenreihe Club 2 bis 8              | `zweiteChance`                         | 1      |
| Erster Sieg gegen einen Straßengegner                    | `zweiteChance`                         | 1      |
| Hilfe-Quest erledigt                                     | `fluestern` (Questdaten dürfen ändern) | 1      |
| Begegnungs-Quest erledigt                                | laut Questdaten (Sam: `zweiteChance`)  | 1–2    |
| Rätsel-Quest erledigt                                    | `fluestern`                            | 1      |
| Erste Clubnadel eines Clubs (jede Stufe)                 | `mentorzug` und „Ambroses Notiz“       | 1      |
| Erinnerung (Zugerraten) mit mindestens 70 Prozent (R31)  | `bauernvorgabe` und ein Partiefragment | 1      |
| Alle Nebenquests einer Stadt erledigt                    | `springervorgabe`                      | 1      |
| Pinewood-Camp-Aufgaben (Staffel 2)                       | `zeitbonus`                            | 2      |
| Post-Game: erste Goldnadel je Club im zweiten Durchlauf  | `sanduhr`                              | 1      |

- Dauerhafte Karten kommen nur einmal; ein zweiter Erhalt gibt stattdessen eine `zweiteChance`.
- Höchstbestand je Verbrauchskarte 9 (Startwert); darüber sagt Ambrose „Deine Tasche ist voll“ und die Karte verfällt.
- „Ambroses Notiz“ (Stellung des Schlüsselmoments) ist ein Sammelstück im Album ohne Spielwirkung, keine Kartensorte.

### R28 Story-Sperren

| Partie                                                     | Karten                                |
| ---------------------------------------------------------- | ------------------------------------- |
| Erstes Treffen mit Victor (fester Verlauf, R33)            | gesperrt (`kartenErlaubt: false`)     |
| Clubkampf Old Harbor (Tiefpunkt, Held spielt ohne Ambrose) | gesperrt                              |
| Finale gegen Victor                                        | gesperrt                              |
| Halbfinale gegen den ZERO-gestützten Spieler               | erlaubt, Sonderregel Mentor-Zug (R29) |

### R29 Mentor-Zug in Akt 3 und im Halbfinale

- Von der Szene „Tiefpunkt“ (Old Harbor) bis zur Szene „Versöhnung“ (Desert Springs) ist `mentorzug` gesperrt: Er lässt sich nicht ins Deck legen; im Album trägt er ein Schloss mit Ambroses Satz.
- Im Halbfinale liegt der Mentor-Zug ohne Besitz als vierte Karte frei im Deck, einmal spielbar, ohne Verbrauch und ohne Folge für die Wertung („Held und Ambrose spielen gemeinsam“). Wer ihn nicht spielt, bekommt den Extra-Abspann (Dokument 02, 2.7).
- Der Vertrag hat dafür noch kein Feld (Vorschlag V6).

## 5. Aufgabenreihen (Entscheidungen A7, A8)

### R30 Umfang aus dem Zeitbudget

- Zeitbudget T je Club in `orte.json` (`club.aufgaben.minuten`), Richtwert 10 bis 15 Minuten.
- Schwierigkeit aus A (Startwerte):

| A         | Schwierigkeit | Sekunden je Motivaufgabe |
| --------- | ------------- | ------------------------ |
| unter 700 | 1             | 50                       |
| 700–999   | 2             | 60                       |
| 1000–1299 | 3             | 90                       |
| 1300–1599 | 4             | 120                      |
| ab 1600   | 5             | 150                      |

- Buchübungen: alle in `club.aufgaben.buchuebungen` genannten, höchstens 3, je 120 Sekunden.
- Motivaufgaben: (T · 60 − 120 · Zahl der Buchübungen) / Sekunden je Aufgabe, abgerundet, aus den `themen` des Clubs.
- Gesamtzahl begrenzt auf 8 bis 15.
- Beispiel Club 1 (T = 12, drei Buchübungen), A = 800: 3 Buchübungen + (720 − 360) / 60 = 6 Motivaufgaben = 9 Aufgaben. Mit T = 15: 3 + 9 = 12.
- Das Spiel ist ohne Buch spielbar: Die Buchübungen kommen aus den Daten der App (Abbildung mit FEN), der Leser braucht das Buch nicht.

### R31 Verteilung, Bestehen, zweite Runde

- Die Aufgaben kommen in Blöcken zu 4 bis 6 von den Clubmitgliedern (`club.mitglieder`), Buchübungen zuerst. Reichen die Mitglieder nicht, stellt der Clubchef den letzten Block.
- Wertung je Aufgabe: richtig 1, mit Hilfe 0,5, falsch 0 (Stufen des Trainers der App).
- Bestanden ab 70 Prozent der möglichen Punkte. Beispiel 9 Aufgaben: ab 6,3 Punkten, also etwa 6 richtige und eine mit Hilfe.
- Nicht bestanden: Dasselbe Mitglied stellt eine zweite Runde mit neuen Aufgaben (keine aus der ersten), gleiche Zahl, Schwierigkeit eine Stufe niedriger (mindestens 1). Weitere Runden wie die zweite, ohne Grenze.
- Die bestandene Aufgabenreihe ist Voraussetzung für den Clubkampf (`Clubstand.aufgabenreihe`).
- Erinnerungen Ambroses (Zugerraten, Entscheidung C3) folgen derselben 70-Prozent-Grenze, gezählt über die Züge der Partie, die der Leser errät.

### R32 Zählen in der App

Jede Aufgabenrunde im Spiel hat `zaehltFuerApp: true`: Sie läuft durch `NACH_DER_RUNDE` der App und zählt für die Wiederholung (Leitner) und das Tagesprotokoll (Entscheidung A8). So sieht der Leser in der App denselben Lernstand.

## 6. Niederlage und Tempo

### R33 Story-Partie mit festem Verlauf: Victor zu Beginn

- Victor (Rolle `story`, E + 500) spielt Weiß; der Leser übernimmt Schwarz in einer schon schlechten Stellung um Zug 12 (Bewertung −2,5 bis −4 Bauern aus Sicht des Lesers, Tiefe 12). Ambrose erzählt, wie es dazu kam („Du hast schon zwei Figuren verloren“). Die Stellung legt die Story-Bibel fest.
- Karten gesperrt, kein Wiedereinstieg, keine Überheblichkeit, keine Ablenkung, zählt weder für die App noch für A (`zaehltFuerApp: false`).
- Jeder Ausgang führt die Story weiter, mit zwei Dialogvarianten: Niederlage → Victor herablassend, Ambrose tröstet („Er hat nicht dich besiegt, sondern diese Stellung“). Remis oder Sieg → Victor fassungslos („Glück gehabt“), Dialogvariable `victorUeberrascht` = 1, Sammelstück „Ambroses Notiz“ mit der Stellung.
- Grund: Dokument 02, 2.7 verlangt, dass der Leser die Niederlage nicht als unfair erlebt; die schlechte Stellung erklärt sie, beide Varianten verhindern eine Sackgasse.

### R34 Ablauf nach einer Niederlage

1. Kurzer Ergebnisbildschirm (ein Satz, aufmunternd, keine Zahlen).
2. Ambrose zeigt **einen** Moment: den entscheidenden Fehler (`Kipppunkt.fehler` oder sonst den Schlüsselmoment mit dem größten Verlust des Lesers), mit Buchbezug, wenn erkannt.
3. Angebot, wenn R14 erfüllt: „Ab hier noch einmal“ (Wiedereinstieg), „Ganz von vorn“, „Später“. Mit Sanduhr im Besitz zusätzlich „Mit Sanduhr ab hier“.
4. Der Gegner wird für den nächsten ganzen Versuch sichtbar überheblich (R9).
5. Nach der dritten Niederlage in Folge gegen denselben Gegner schlägt Ambrose eine Hilfe vor: Aufgabenreihe des Clubs noch einmal, eine Begegnungs-Quest (Ablenkung, Steckbrief) oder eine Karte. Nur ein Vorschlag, keine Sperre.

### R35 Abbruch und Aufgabe

- Aufgabe ist eine Niederlage (mit allen Folgen aus R34).
- Verlässt der Leser die Partie ohne Aufgabe (Ausgang `abgebrochen`), zählt sie nirgends: keine Nadel, keine Überheblichkeit, keine Wertung, kein Protokolleintrag für Statistiken; verbrauchte Karten bleiben verbraucht. `laufendePartie` bleibt gesetzt, bis der Leser sie fortsetzt oder neu beginnt.

### R36 Nach einem Sieg

- Ambrose zeigt die zwei Schlüsselmomente (`Partieergebnis.momente`, höchstens zwei).
- Belohnungen nach R27, Nadel nach R18.

## 7. Zählen in der App (Entscheidung A2)

### R37 Was wofür zählt

| Partie oder Runde                                  | `zaehltFuerApp` | Partienliste, Tagesprotokoll, Erfahrung, Rekorde | Elo der App, Rivalen, Duelle | A und E (R2, R3) |
| -------------------------------------------------- | --------------- | ------------------------------------------------ | ---------------------------- | ---------------- |
| Ganze Partie aus der Grundstellung                 | ja              | ja                                               | nie                          | ja (R38)         |
| Ganze Partie mit Vorgabe                           | nein            | nein                                             | nie                          | nein             |
| Wiedereinstieg                                     | nein            | nein                                             | nie                          | nein             |
| Stellungsduell                                     | nein            | nein                                             | nie                          | nein             |
| Story-Partie mit festem Verlauf (Victor zu Beginn) | nein            | nein                                             | nie                          | nein             |
| Aufgabenrunde                                      | ja              | Wiederholung und Tagesprotokoll                  | –                            | –                |
| Erinnerung (Zugerraten)                            | ja              | Tagesprotokoll wie der Trainer „Zug erraten“     | –                            | –                |

- `zaehltFuerApp` steht im Partieauftrag, also vor dem Start; deshalb hängt es nicht davon ab, ob in der Partie Karten gespielt werden.
- Ungewertet im Sinn der App (`gewertet: false`) ist jede Story-Partie (`04_Architektur.md`, Abschnitt 3).

### R38 Zählt für A

Eine Story-Partie zählt für A (R2) und für `eingangPartien` (R3), wenn alle gelten: ganze Partie aus der Grundstellung, `zaehltFuerApp: true`, Ausgang nicht `abgebrochen`, keine mittlere oder starke Karte gespielt. Grund: Mit Mentor-Zug oder Flüstern gewonnene Partien würden A künstlich heben und Straßengegner zu stark machen.

## 8. Spielzeit-Richtwerte

### R39 Clubbesuch (Staffel 1)

| Baustein                                 | Minuten    | Messung im Spielstand                       |
| ---------------------------------------- | ---------- | ------------------------------------------- |
| Ankunft, Laufen, Dialoge der Stadt       | 5–10       | Spielzeit je Ort minus Partien und Aufgaben |
| Nebenquests (2–3) mit Straßenpartien     | 20–30      | Partiedauern Straße und Duelle              |
| Erinnerung Ambroses (Zugerraten)         | 5–8        | Dauer der Runde                             |
| Aufgabenreihe                            | 10–15      | `Aufgabenergebnis.sekunden`                 |
| Clubkampf (ein Versuch)                  | 20–40      | `Partieergebnis.sekunden`                   |
| Wiederholungen nach Niederlagen (Mittel) | 10–20      | Partiedauern mit Ausgang `niederlage`       |
| **Summe Clubbesuch**                     | **70–120** |                                             |

### R40 Staffeln

| Abschnitt                                                      | Stunden  |
| -------------------------------------------------------------- | -------- |
| Akt 1: Intro, Fund des Bretts, erste Partie, Victor, Clubs 1–2 | 3–4      |
| Akt 2 in Staffel 1: Clubs 3–4, Cliffhanger                     | 3–4      |
| **Staffel 1**                                                  | **6–8**  |
| Akt 2 Rest und Akt 3: Clubs 5–7, Pinewood, Crossroads          | 5–6      |
| Akt 4: Club 8, Ghost Town, Landesmeisterschaft (6 Partien)     | 4–5      |
| **Staffel 2**                                                  | **9–11** |
| Post-Game (zweiter Durchlauf, Weltmeisterschaft)               | 5–10     |

- Grundlage: Dokument 02, 2.1 (18 Stunden Hauptspiel) und `04_Architektur.md`, Abschnitt 5 (Clubbesuch 60 bis 90 Minuten ohne Wiederholungen).
- Nachmessen: `spielzeitSekunden` reicht für die Summe; für die Tabelle braucht es die Spielzeit je Ort (Vorschlag V7). Liegt ein Testlauf des Autors um mehr als ein Drittel daneben, werden zuerst R30 (Aufgabenzahl) und R13 (Zugzahl der Duelle) angepasst, nicht die Stärke.

## 9. Offene Fragen an den Autor

| Nr. | Frage                                                                                           | Empfehlung (schon so ins Regelwerk geschrieben, Widerspruch genügt)                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| F1  | Eigene Abenteuerwertung A statt der App-Wertung (R2)?                                           | Ja. Ohne sie steigen Straßengegner bei Kindern, die nur das Abenteuer spielen, nie mit; die Elo der App bleibt unberührt (A2).                                                       |
| F2  | Umrechnung Z → Stufe mit Runden und Eichpunkt in der Mitte (R6) statt „aufrunden, 1,4 bis 0,7“? | Ja; die alte Formel lässt Gegner am oberen Stufenrand zu stark spielen. Endgültig nach dem Test gegen die gemessenen Bot-Stärken.                                                    |
| F3  | Liga bestimmt die Stärke der Landesmeisterschaft (R22)?                                         | Ja, ±100 je Liga um die Werte der Architektur; das macht Gold wertvoll, ohne die Bronze-Liga unschaffbar zu machen.                                                                  |
| F4  | Wie zählt Remis in der Landesmeisterschaft?                                                     | Vorrunde mit Punkten (Sieg 1, Remis ½), weiter mit 2 von 4; Halbfinale und Finale bei Remis ein Stellungsduell aus der Schlussstellung mit vertauschten Farben. Kommt mit Staffel 2. |
| F5  | Bestandene Aufgabenreihe als Voraussetzung für den Clubkampf, auch in Club 1?                   | Ja, Club 1 bleibt mit 9 bis 12 leichten Aufgaben kurz; so lernt der Leser die Regel gleich am Anfang.                                                                                |
| F6  | Remisangebote ganz weglassen (R12)?                                                             | Ja; sonst wäre Bronze gegen den Clubchef billig, und die Engine der App müsste Angebote bewerten.                                                                                    |
| F7  | Höchstens eine Vorgabe je Partie (R24)?                                                         | Ja; Bauer und Springer zusammen wären über 400 Elo und machen den Clubkampf beliebig.                                                                                                |
