# Lektorat der Lesefassung, 17.11.2026

Auftrag des Haupt-Chats (Wunsch des Autors): die ganze Geschichte als Lesefassung, so wie ein
Spieler sie erlebt, und ein Lektorat dieser Fassung. Die Lesefassung liegt in
`docs/spiel/auftraege/lesefassung_17-11.md` (erzeugt mit
`node pipeline/abenteuer/lesefassung.cjs --ziel DATEI.md`, Stand nach dem Lektorat). Vier Lektoren
haben je einen Akt ganz gelesen und Klares direkt in den Ink-Dateien behoben: Akt 1 14 Stellen,
Akt 2 23, Akt 3 22, Akt 4 13, dazu Ambroses Zeilen nach dem Abschied (Entscheidung Q21-5: nach dem
Finale spricht er nicht mehr) in 19 weiteren Dateien. Größere Story-Fragen sind nur gemeldet.

Grenzen: Die Lesefassung zeigt einen gründlichen Spieler, der alles anfasst, neugierig antwortet und
fast alle Partien beim ersten Versuch gewinnt. 102 von 1100 Knoten (Niederlagen, Wartezustände,
Varianten des Clubkampfs) kommen darin nicht vor und sind als Verlauf nicht gelesen. Nichts wurde im
laufenden Spiel nachgespielt.

## Akt 1

## Lektorat der Lesefassung: Akt 1 (17.11.2026)

Gelesen: `akt1.md` ganz (Dialoge 1 bis 248, Zeile 1 bis 3644). Geändert: 14 Stellen in 8 Ink-Dateien. Nichts committet, nichts gepusht.

### 1. Eindruck

Akt 1 trägt. Der Bogen von Ambrose ist klar gebaut und steigert sich an den richtigen Stellen: Dachboden, erste Nacht („Er.“), Heimweg nach der Nadel („Nein. Das ist das Merkwürdige.“), Victor, Fährstein, Archiv, Steg. Die stärksten Szenen sind das Archiv und der Steg; beide kommen ohne Schacherklärung aus. Mamas Geheimnis wird zweimal ohne Worte gezeigt (Tisch, Diner) und nie ausgesprochen, das hält.

Maple Falls liest sich am Anfang dicht und warm. Der Weg nach Cedar Creek ist die schwächste Strecke: viele kleine Stationen (Tafel, Formular, Flohmarkt, Blatt, Apfelstand, Wanderer, Nia, Joggerin, Münzen) ohne Stimme von Juno oder Ambrose dazwischen. Das Schweigen von Ambrose ist gewollt und zahlt sich am Fährstein aus, aber Junos Erzählung auf der Landstraße (Carla, „Gegen Mrs. Okafor hat noch niemand aus Maple Falls gewonnen“) hört nur, wer die Tafel **nicht** löst (Frage 1). Damit fehlt gerade dem gründlichen Spieler der Einsatz für den Clubkampf in Cedar Creek.

Schach wird fast nirgends doziert; die Erklärungen sind kurz und sitzen in der Szene (Gabel bei Lily, „Was hängt?“, Bauer zuerst). Falsche Schachaussagen habe ich keine gefunden. Wiederholungen gibt es als Leitmotive (Fußnote/sechs Wörter, „Es gibt viele“, Buchhalter, Radiergummi); sie funktionieren. Echte Doppelungen waren wenige und sind behoben. Als Lieblingswendung fällt „… läuft nicht weg“ auf (sieben Figuren sagen es, fast nur in Ablehnungszweigen) und Ambroses „Zu meiner Zeit“ (in der Lesefassung viermal, im Ink öfter); beides stört beim Lesen nicht, sollte aber nicht weiter wachsen.

### 2. Geändert

| Datei                  | Knoten                 | vorher → nachher                                                                                                                                                                                                                                                                                                                      | Grund                                                                                                                                                                                                                                                                              |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maple-falls-wohnzimmer | `ankunft_kurz`         | Mama: „Da bist du ja. Warst du schon auf dem Dachboden? Staubig, oder?“ / „Hörst du das Rauschen? …“, gleich danach „Du kommst mit dem alten Brett die Treppe herunter.“ → die beiden Mama-Zeilen nur noch, wenn die erste Lektion noch nicht besprochen ist (Bedingung `not ersteLektionBesprochen`); sonst beginnt gleich der Abend | Sprung (Dialog 10): Mama begrüßt {held}, bevor {held} die Treppe herunterkommt, und fragt nach dem Dachboden, während das Brett schon im Arm ist. Seit die Haustür bis nach der Lektion zu bleibt, ist das der Weg aller Spieler. Eingriff in eine Bedingung, keine neue Variable. |
| maple-falls-wohnzimmer | `aufbruch`             | „Du trägst es seit Tagen herum.“ → „… seit Wochen herum.“                                                                                                                                                                                                                                                                             | Vier Zeilen vorher sagt Mama „in vier Wochen“.                                                                                                                                                                                                                                     |
| maple-falls-dachboden  | `nach_erster_partie`   | „Der Fingerzeig bleibt dir. Ich zeige die Figur, die arbeiten will. Den Zug findest du selbst.“ → „… Die Figur zeige ich. Den Zug findest du selbst.“                                                                                                                                                                                 | „die Figur, die arbeiten will“ stand wortgleich schon vor der Partie (Dialog 5 und 6).                                                                                                                                                                                             |
| maple-falls-aussen     | `calloway_auf_dem_weg` | „Juno winkt dir von der Haltestelle aus zu.“ → „Von der Haltestelle winkt dir jemand zu.“                                                                                                                                                                                                                                             | Der Erzähler nannte Juno, zwei Zeilen bevor sie sich vorstellt (Dialog 12).                                                                                                                                                                                                        |
| ansehen-maple-falls    | `brett_ohne_dame`      | „Ein Radiergummi als Dame. Wenigstens zieht er nicht zu früh heraus.“ → „Wenigstens zieht diese Dame nicht zu früh heraus.“                                                                                                                                                                                                           | Zwei Ambrose-Sätze im selben Raum begannen gleich („Ein Radiergummi als Dame.“, Dialog 18 und 20).                                                                                                                                                                                 |
| maple-falls-clubraum   | `sam_nach_revanche`    | „Okay. Die Dame bleibt zu Hause. Fürs Erste.“ → „Okay. Die Chefin war brav zu Hause. Verloren hab ich trotzdem.“                                                                                                                                                                                                                      | Derselbe Satz stand direkt vor der Partie („Die Dame bleibt erst mal zu Hause“, Dialog 59 und 60).                                                                                                                                                                                 |
| maple-falls-clubraum   | `sam_nach_revanche`    | „Hab ich nie ausnutzen können. Aber du vielleicht.“ → mit Nadel: „… Du schon, wie es aussieht.“ (ohne Nadel unverändert)                                                                                                                                                                                                              | Sams Tipp zur Trainerin kam als Aussicht, obwohl der Coach schon geschlagen war (Inline-Bedingung `nadelMapleFalls > 0`).                                                                                                                                                          |
| maple-falls-park       | `bibliothekar_alltag`  | „Margaret spielte jeden Sonntag. Per Post. Ein Zug, eine Briefmarke.“ → „Margaret spielte jeden Sonntag per Post. Die Schachbücher dazu hat sie bei mir geliehen. Alle.“                                                                                                                                                              | Wortgleich mit Mrs. Calloway (Dialog 12 und 102); jetzt in der Stimme des Bibliothekars.                                                                                                                                                                                           |
| cedar-creek-aussen     | `bus_zurueck`          | „Der Linienbus nach Maple Falls fährt jede Stunde. …“ → „Die Haltestelle von Cedar Creek. …“                                                                                                                                                                                                                                          | Widerspruch zum Zettel in Maple Falls („Mr. Kettering fährt nach Cedar Creek nur samstags“), der der Grund für den Fußweg ist. Die Gegenseite war am Vormittag schon bereinigt.                                                                                                    |
| cedar-creek-aussen     | `kettering`            | neu am Anfang: `{nachtImLesesaal and not teamAngekommen: -> team_kommt}`                                                                                                                                                                                                                                                              | Logik (Dialog 177): Am Samstagmorgen las Mr. Kettering an der Haltestelle Zeitung, und im selben Dialog klapperte sein Bus erst heran. Jetzt kommt zuerst das Team.                                                                                                                |
| cedar-creek-aussen     | `sterne`               | „Am Steg liegen Decken. Mae hat ein Teleskop aufgebaut …“ → „Mae hat ein Teleskop aufgebaut …“                                                                                                                                                                                                                                        | Zwei Zeilen vorher: „Am Steg sitzen Mae, Dex und Juno auf einer Decke.“                                                                                                                                                                                                            |
| cedar-creek-aussen     | `sterne`               | „Nach Mitternacht geht ihr hinüber in den Lesesaal.“ → „Dann geht ihr hinüber …“                                                                                                                                                                                                                                                      | „bis nach Mitternacht“ stand zwei Zeilen vorher.                                                                                                                                                                                                                                   |
| cedar-creek-bibliothek | `okafor_bis_morgen`    | auf „Ich geh noch zum Steg.“: „Geduld ist auch ein Zug.“ → „Geh nur. Am Wasser wird es abends kalt.“                                                                                                                                                                                                                                  | Die Antwort passte nicht zur Wahl (Dialog 172); der Satz bleibt beim Clubkampf („Noch nicht.“), wo er passt.                                                                                                                                                                       |
| cedar-creek-bibliothek | `okafor_nadel`         | Mrs. Okafor: „Sie reicht dir die Nadel über das Brett. Revanche, wenn ich ausgeschlafen bin.“ → Erzählerzeile + Okafor-Zeile (`#klang:fanfare` an der Erzählerzeile)                                                                                                                                                                  | Erzählsatz stand in ihrer Sprechzeile (Dialog 191).                                                                                                                                                                                                                                |

Unverändert geblieben: `kuerbishof.ink`, `weg-maple-cedar.ink`, `cedar-creek-archiv.ink`, `-waschsalon.ink`, `-drechslerei.ink`, `ansehen-cedar-creek.ink`, `maple-falls-diner.ink`.

### 3. Größere Fragen

1. **Junos Erzählung auf der Landstraße fehlt dem gründlichen Spieler** (`weg-maple-cedar.juno_weg`, in der Lesefassung gar nicht vorhanden; Tafel ist Dialog 104). Der Knoten läuft nur nach der Wahl „Weitergehen“ an der Rätseltafel. Wer die Tafel löst, hört nie von Carla und nie „Gegen Mrs. Okafor hat noch niemand aus Maple Falls gewonnen“. Vorschlag: `juno_weg` an eine Station hängen, die jeder passiert (erster Besuch am Apfelstand oder beim Wanderer), oder nach „Gelöst!“ einmal nachholen (braucht eine VAR).
2. **Warum zu Fuß und warum schon Freitag** wird nie gesagt. In Dialog 87 erfährt der Leser es als fertige Tatsache aus der Antwortwahl („Juno und ich gehen Freitag schon. Zu Fuß.“); Juno schlägt es nirgends vor, in Dialog 74 sagt sie nur „Samstag Cedar Creek! Ich packe Kekse ein.“ Ein Satz von Juno nach der Victor-Szene würde reichen (etwa in `juno_alltag` mit `kenntHale`).
3. **Der Bus am Freitag in Cedar Creek.** Der Text ist entschärft, aber Mr. Kettering steht als Figur schon am Freitag an der Haltestelle und fährt auf Wunsch nach Maple Falls (Dialog 144, 152), obwohl er „nur samstags“ fährt und am Samstag um acht erst ankommt. Sauber wäre: Figur und Rückfahrt erst ab `teamAngekommen` (Kartendaten, `orte.json`).
4. **„Revanche“ gegen Sam** (Dialog 59, `sam_revanche_angebot`, Questtext „Die Revanche gegen Sam spielen.“): {held} hat vorher nie gegen Sam gespielt. Der Leser fragt sich, wofür. „Eine Partie? Jetzt?“ wäre klarer; betrifft auch `quest.samsDame.schritt2`.
5. **„Gestern hast du gesagt, Zählen ist alles.“** (Dialog 204, `programmheft_danach`): Der Zeitbezug ist schon gemeldet. Neu: Ambrose sagt diesen Satz im Spiel nie; er lehrt „Was hängt?“ und spottet über den Buchhalter. Die Wahl zitiert etwas, das nur im Roman fällt. Vorschlag: „Du hast mir doch das Zählen beigebracht.“
6. **Hector verspricht Pommes aufs Haus** (Dialog 38), löst es am Diner-Abend aber nicht ein; dort lädt Mama ein. Kleinigkeit, ein Halbsatz von Hector würde es schließen.
7. **„Am ersten Abend“** meint bei Hector den Diner-Abend (Dialog 42, 73), bei Mama in Akt 2 den Abend mit dem Tisch. Der Diner-Abend ist frühestens der zweite Tag. Vorschlag bei Hector: „Am ersten Abend hier!“.
8. **Mrs. Calloway** (Dialog 63): Auf „Es war knapp.“ nach einem Sieg folgt „Sie mag Leute, die verlieren können.“ Der Satz trägt Ambroses Pointe, hängt aber in der Luft. Nicht geändert.
9. **Start von Akt 2 steht in `akt1.md`** (Dialoge 225 bis 248, Weg nach Riverton, Dateien anderer Akte). Dort nichts Auffälliges; „Nehmt einen Schirm“ sagen Mr. Quinn (237) und Mrs. Fenwick (240) kurz nacheinander, und Mrs. Fenwicks Lehre steht zweimal (230, 248).
10. Roman-Wortlaute, an denen ein junger Leser hängen kann, die ich gelassen habe: „Schnell war sie. Du warst da.“ (125), „Das war keine Falle wert.“ (191), „Jemand sagte: Später.“ (195).

### 4. Eigenheiten der Lesefassung

- **Abende gestapelt:** Erste Nacht, Abend nach Sam, nach Juno, nach Sams Dame stehen als Dialoge 43, 44, 49, 50 hintereinander, weil die Simulation erst spät ins Zimmer zurückkehrt. Die erste Nacht wird in Dialog 10 angekündigt und kommt 33 Dialoge später, nach dem Diner-Abend.
- **Ansehen vor dem Gespräch:** Im Clubraum stehen Vitrine, Radiergummi und Plakat (17 bis 19) vor der Szene mit dem Coach (20), die sie einführt. Ebenso Diner: Hector allein (38) vor dem Diner-Abend (42), dadurch „Bestellung läuft!“ zweimal.
- **Programmheft nach dem Finale:** Die Erinnerung an New York und der erste „Kim.“ (203, 204) stehen nach dem Steg (195), wo Ambrose noch „Lehrling“ sagt. Im Spiel liegt das Heft gleich nach der Zeitung bereit; die Simulation fasst es erst später wieder an.
- **Gold sofort:** Weil jede Partie gleich mit bester Nadel gewonnen wird, fehlen nach Mrs. Okafor der Pfiff des Coachs und Junos „Der Bus fährt um sieben. Geh nur zum Steg.“ (nur bei `nadelCedarCreek == 1`). Der Übergang zum Steg wirkt dadurch unvermittelt.
- **Texte außerhalb des Dialogs fehlen:** der Tagebucheintrag „Ich will besser werden.“ (Dialog 81 endet auf „In deiner eigenen Schrift, ohne Glitzer.“), die Momente im Clubkampf („Lass mich“, auf die sich „Ich hätte dich die Partie gekostet“ bezieht), „Was hängt?“ in der ersten Partie.
- **Hin und her:** Busfahrt zurück nach Maple Falls mitten in der Ankunft (144), `stamm_s2` unter „Maple Falls“ (126), Zwillinge zweimal mit beiden Antworten (150, 151), „Cedar Creek? Den Namen habe ich nie gehört.“ zweimal (88, 89), Mr. Kettering dreimal mit demselben Einstieg.
- **Kopfzeile nennt den Einstieg, nicht den Knoten mit Text:** z. B. `maple-falls-aussen.juno` über der Calloway-Szene, `clubraum.coach` über Victor. Für die Fundstelle wäre der Knoten der ersten Zeile hilfreicher.
- Die Datei `akt1.md` reicht bis in Akt 2 hinein (ab Dialog 225).

### 5. Prüfungen

Nach der letzten Änderung, alles im ersten Lauf, keine zeitweiligen Fehler durch andere Lektoren:

- `python -m pipeline.abenteuer.sprache`: 0 Funde.
- `python -m pipeline.abenteuer.inkbesuche`: 0 Befunde.
- `python -m pytest -q -k "not chaos" pipeline/tests`: 1596 bestanden, 12 übersprungen, 1 abgewählt.
- `npx vitest run src/abenteuer`: 108 Dateien, 566 Tests bestanden.
- `node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1 --sekunden 300`: „Meldungen: keine“.
- Zusätzlich die Lesefassung neu erzeugt (in meinen Scratchpad-Ordner `lektor1/`) und die geänderten Stellen dort nachgelesen: 12 der 14 erscheinen wie gewollt. Nicht nachgelesen sind Mr. Abernathys neuer Satz (Zufallssatz, nicht gesucht) und der letzte Wortlaut an der Haltestelle („Die Haltestelle von Cedar Creek.“; den habe ich nach dem Erzeugen noch einmal geändert, danach liefen nur die fünf Prüfungen oben).

### 6. Nicht gelesen, nicht geprüft

- `akt1.md` habe ich Zeile für Zeile gelesen. Die 15 Ink-Dateien meines Akts habe ich ganz gelesen, außer `ansehen-cedar-creek.ink` (nur die Textzeilen, nicht die Bedingungen).
- Story-Bibel: nur Abschnitt 0, 1 und 5 ganz, sonst per Suche. Roman nur per Suche nach einzelnen Sätzen. Vom Bericht der Dialogprüfung vom Vormittag Teil 1 und 2 ganz (Zeile 1 bis 198), Teil 3 bis 5 nicht.
- Nicht im Spiel gesehen: Zwei Änderungen liegen auf Wegen, die die Lesefassung nicht geht (Mamas Begrüßung vor der besprochenen Lektion; Sams Tipp ohne Nadel). Sie sind übersetzt und durch Tests und Simulation gelaufen, aber nicht einzeln durchgespielt. Die App habe ich nicht gestartet.
- Stellungen, FEN und Aufgaben der Runden und Begegnungen habe ich nicht geprüft, nur die Schachaussagen im Dialogtext.
- Chaos-Lauf, Playwright, `npm run pruefen` als Ganzes: nicht gelaufen. `app/public/abenteuer/` nicht neu gebaut.
- `maple-falls-clubraum.ink` hat jetzt 464 Zeilen (Regel: unter 400; war schon vorher darüber).

## Akt 2

## Lektorat Lesefassung, Akt 2 (Riverton, Ironwood und die Wege dorthin)

Stand 17.11.2026. Nichts committet, nichts gepusht. Geändert sind nur Ink-Dateien von Akt 2
(`inhalte/abenteuer/dialoge/de/`), keine Akt-1-Datei, keine Daten, keine Tests.

### 1. Eindruck

Akt 2 trägt. Er hat zwei klare Bögen, die sich gut ablösen: Riverton erzählt den Verlust (Slick, der
Pavillon, Ambroses Versuchung), Ironwood die Heilung (Mama, Big Joe, das blaue Heft), und der Kauf
am Werkstor nimmt das Gewonnene gleich wieder weg. Die stärksten Stellen sind die stillen: Mrs.
Albescu und der Schlüssel, der Wohnwagen mit den Dosenpokalen, Mamas Erzählung in der Küche,
„Du hättest noch mal klingeln können“, der leere Umschlag. Ambroses Faden (Tische, London, „Besser
als ich“, „Es war schön. Und es hat gestimmt. Beides.“) ist über den ganzen Akt sauber geführt, und
Victor hat mit „Zwei.“, „Vater. Vielleicht …“ und der Brücke drei kurze, genaue Auftritte.
Der Akt hängt an zwei Stellen. Erstens zwischen Riverton und Ironwood: Nach dem Wohnwagen gibt es
keine laufende Quest und keinen Grund, nach Ironwood zu gehen; der Grund (Freundschaftsturnier,
Mamas Verbot) kommt erst bei der Ankunft. Zweitens fällt Lockport aus dem Ton: Dort reden die
Figuren nur als Erzählzeilen in Anführungszeichen und stellen sich mit vollem Namen und Beruf vor.
Störend waren außerdem Stimmungszeilen, die vor jeder Szene derselben Figur gewürfelt werden und
manchmal dem Geschehen widersprechen (Slick „gewinnt trotzdem“ direkt vor seiner Niederlage), und
der Stand nach dem Kauf, den die Kantine in den Texten nicht kannte. Schach wird nirgends doziert;
die Schachaussagen stimmen bis auf eine Kleinigkeit am Kreidespringer.

### 2. Geändert

| Datei                        | Knoten                       | vorher → nachher                                                                                                                                                                                                                                                                                        | Grund                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `riverton-pavillon.ink`      | `slick`                      | Eine gewürfelte Stimmungszeile aus vier vor jedem Zweig → nach dem Clubkampf (`nadelRiverton > clubkampfRivertonNadel` oder `clubkampfRivertonBesprochen`) nur noch „Unter dem Dach riecht es nach nassem Holz und Limonade.“ oder „Vom Fluss weht ein kühler Wind durchs Geländer.“; vorher wie bisher | Sprung: „Slick schiebt eine Figur, ohne hinzusehen, und gewinnt trotzdem.“ stand direkt vor „Slick legt seinen König nicht um“ (Dialog 302) und vor dem Montag ohne Steintische (307); Uhren und Partieformulare gibt es dann nicht mehr. Die Zeile bleibt im Knoten, weil die Quest auf `slick` wartet. |
| `riverton-pavillon.ink`      | `ray_alltag`                 | Drei gewürfelte Sätze jederzeit → vor der Nadel nur „Slick zieht zu schnell. Der Alte hat ihm das vierzehn Jahre lang gesagt.“; „Der Pavillon war unsere Endhaltestelle …“ und „Wenn du nach Ironwood fährst …“ erst mit `nadelRiverton > 0`                                                            | Zu früh: „war unsere Endhaltestelle“ fiel vor dem letzten Spiel, und Ray wusste vor dem Clubkampf von Ironwood (Dialog 295), von dem noch niemand gesprochen hatte.                                                                                                                                      |
| `riverton-pavillon.ink`      | `ray_erst_tamsin`            | „Ein Bus hält auch nicht zweimal an derselben Haltestelle.“ → „Ein Bus fährt seine Haltestellen auch der Reihe nach an.“                                                                                                                                                                                | Das Bild passte nicht zu „Erst Tamsin, dann ich“ (Reihenfolge, nicht Wiederholung).                                                                                                                                                                                                                      |
| `riverton-wohnwagen.ink`     | `slick_abschied`             | „Er setzt sich aufs Bett. Ohne das Reden sieht er jünger aus.“ → „Er setzt sich aufs Bett und sieht hinauf zu den Dosen.“                                                                                                                                                                               | Wiederholung: Derselbe Satz steht eine Szene vorher am Montag im Pavillon (`slick_alltag`); dort bleibt er.                                                                                                                                                                                              |
| `riverton-wohnwagen.ink`     | `slick_fluss`                | „Er hat recht.“ / „Er hat recht, und es ist ein Unrecht, …“ → „Slick ist im Recht.“ / „Er ist im Recht, und es ist ein Unrecht, …“                                                                                                                                                                      | Bezug: Slick hat nichts behauptet, womit er recht haben könnte, und das letzte „Er“ davor war der Springer. Gemeint ist: Er ist im Recht.                                                                                                                                                                |
| `riverton-bahnhofshalle.ink` | `pops`                       | „Slick kauft jeden Morgen eine Limo. Heute zwei. Er ist nervös.“ jederzeit → nur solange `nadelRiverton == 0`                                                                                                                                                                                           | Stand: Der Satz fiel nach dem letzten Spiel (Dialog 306).                                                                                                                                                                                                                                                |
| `riverton-bahnhofshalle.ink` | `fund_zeitungsausschnitt`    | Pops spricht sofort → davor, wenn `not popsGetroffen`: „Der Mann hinter dem Zeitungsstand beugt sich herüber.“                                                                                                                                                                                          | Erstes Treffen: In der Lesefassung redet Pops zweimal (278, 281), bevor er sich vorstellt (283).                                                                                                                                                                                                         |
| `riverton-bahnhofshalle.ink` | `fund_taubenfeder`           | „Auf der Bank neben Mr. Harlan …“ → „neben {harlanGetroffen:Mr. Harlan\|dem Mann mit der Lupenbrille} …“                                                                                                                                                                                                | Der Erzähler nannte den Namen vor dem ersten Treffen (280 vor 281).                                                                                                                                                                                                                                      |
| `erinnerung-london.ink`      | `schachtisch`                | Nach der Runde immer „… stellen sie die Figuren wieder auf …“ → erst nach dem Schlussbild an der Uhr (`londonSchlussGesehen`); davor „Am Tisch in der Mitte rührt sich niemand. Nur die große Uhr an der Wand tickt.“                                                                                   | Sprung: In Dialog 273 standen die Figuren schon wieder, in 274 fiel dann erst das Matt. Der neue Satz weist auch zur Uhr.                                                                                                                                                                                |
| `weg-riverton-ironwood.ink`  | `zeitnot_trick`              | nach „Ambrose ist sehr still.“ neu: „Dann redet er von etwas ganz anderem, ein wenig zu schnell.“                                                                                                                                                                                                       | Tonbruch: Vom Schweigen über Hales Brücke ging es ohne Übergang lächelnd zum Kerzentrick. Jetzt ist es ein Ausweichen, das zu „Es gibt viele Brücken“ passt.                                                                                                                                             |
| `weg-riverton-ironwood.ink`  | `brueckenbauern`             | „Über dem Kanal surrt etwas. Eine kleine Drohne steht in der Luft …“ → mit `gefundenSpurPM1`: „Über dem Kanal surrt die Drohne und dreht sich zum Tisch.“                                                                                                                                               | Wiederholung: Die Drohne wurde zweimal neu eingeführt (330 und 333).                                                                                                                                                                                                                                     |
| `weg-riverton-ironwood.ink`  | `finch_laeufer_a`            | „ein weißer Läufer aus hellem Holz“ → „ein weißer Läufer aus Buchsbaum“                                                                                                                                                                                                                                 | Verwechslung: „Läufer aus hellem Holz“ heißt kurz vorher der Läufer des Satzes „Waldholz“ in Riverton (252). Finchs Figuren sind sonst „aus Buchsbaum“, der Fund heißt „Läufer aus Buchsbaum“.                                                                                                           |
| `weg-riverton-ironwood.ink`  | `kreide1` (raten, Td7)       | „Aber der König hat noch Luft.“ → „Aber er gibt nicht einmal Schach.“                                                                                                                                                                                                                                   | Schach: Der schwarze König hat gerade keine Luft, deshalb ist Td8 matt.                                                                                                                                                                                                                                  |
| `ironwood-kantine.ink`       | `big_joe`                    | Eine gewürfelte Stimmungszeile aus drei vor jedem Zweig → nach dem Kauf: „Über der Essensausgabe hängt das weiße Logo. An der Tür steht der Karton mit den Pokalen.“; direkt nach dem Sieg nur „Es riecht nach Kaffee, Eisen und nassen Jacken.“; sonst wie bisher                                      | Sprung: „Big Joe stellt Figuren auf sein Stahlbrett …“ stand vor „Ach, Kumpel“ und dem umgelegten König (429). Nach dem Kauf klapperten weiter Figuren an den langen Tischen (437). Neu mitgelesen: `kaufGesehen` aus `ironwood-aussen.ink`.                                                             |
| `ironwood-kantine.ink`       | `big_joe`                    | „… so behutsam, als wären sie aus Glas.“ → „… eine nach der anderen. Es klirrt kein einziges Mal.“                                                                                                                                                                                                      | Wiederholung: Das Bild vom Glas kam fünfmal (erstes Treffen, dreimal als Stimmungszeile, am Werkstor). Es bleibt beim ersten Treffen und bei Victors Blick am Werkstor, wo es zählt.                                                                                                                     |
| `ironwood-kantine.ink`       | `mama_nach_partie`           | „Juno klebt das Foto ins Tagebuch. Mit Glitzer. Diesmal ja.“ (Sprecher Juno) → Erzähler: „Juno klebt das Foto ins Tagebuch.“ / Juno: „Mit Glitzer. Diesmal ja.“                                                                                                                                         | Fehler: Juno sprach von sich in der dritten Person (Roman, Kapitel 27: Erzählsatz, dann Junos Worte).                                                                                                                                                                                                    |
| `ironwood-kantine.ink`       | `pokalregal`                 | nach dem Kauf weiter „Die Lücke im Regal ist noch da …“ → mit `kaufGesehen`: „Das Regal ist leer. Die Pokale stecken im Karton an der Tür. Nur das Messingschild hängt noch: 2001.“                                                                                                                     | Stand nach Akt 2: Big Joe trägt die Pokale hinaus; die Karte zeigt ab `kaufGesehen` das leere Regal und den Karton (Szene `ironwood-kantine-logo`), das Ortsblatt sagt „Nach dem Kauf ist das Regal leer“.                                                                                               |
| `ironwood-aussen.ink`        | `bus_silicon_bay_abfahrt`    | nach „… was Victor auf der Brücke wollte.“ neu: „Und warum du danach so lange auf ein Geländer gestarrt hast.“                                                                                                                                                                                          | Sprung: Juno hat die Einladung gelesen (432) und fragt trotzdem zum dritten Mal; die Antwort „In dem Brett wohnt jemand“ passte nicht zur Frage. Der Halbsatz steht so im Roman (Kapitel 30). Die Dialogprüfung vom 17.11. hatte die Stelle gemeldet (Querschnitt Juno), umgesetzt war nichts.           |
| `ironwood-aussen.ink`        | `bus_silicon_bay_abfahrt`    | vor „Damit du nicht vergisst, wie man verliert …“ neu: „Ich kann nur bis Mittwoch mit. Dann ist Schule.“                                                                                                                                                                                                | Widerspruch: Mama sagt „Juno, du passt auf“, Juno fährt mit, sagt aber „Oder mit mir, wenn ich anrufe“. Der Satz steht im Roman und bereitet Junos Abreise in Akt 3 vor („Am Morgen fährt Juno zurück“).                                                                                                 |
| `ironwood-museum.ink`        | `postsack`                   | Mr. Teague spricht sofort → davor, wenn `not teagueGetroffen`: „Ein sehr alter Mann in einer Weste kommt herüber. Er hütet das Museum.“                                                                                                                                                                 | Erstes Treffen: In der Lesefassung erzählt Mr. Teague den ganzen Umschlag (394, 395), bevor er sich vorstellt (399).                                                                                                                                                                                     |
| `ironwood-museum.ink`        | `fund_glasfunke`             | „… geschliffen wie ein Edelstein.“ → „… geschliffen wie ein Edelstein. Ein Funke aus Glas.“                                                                                                                                                                                                             | Fehlende Erklärung: Ambroses „in meinem Kaffeehaus hätte er nicht gebrannt“ hatte ohne das Wort „Funke“ keinen Bezug (der Fund heißt „Funke aus Glas“).                                                                                                                                                  |
| `ironwood-mamas-zimmer.ink`  | `oma_ruth`, `partieformular` | Oma Ruths Satz „Sie hat es eingerahmt und nie wieder angesehen.“ stand auch am Gegenstand → dort gestrichen; die Szene setzt `partieformular2001Gesehen`, danach kommt am Formular nur der kurze Satz                                                                                                   | Wiederholung und Sprung: Der Satz fiel zweimal wortgleich (384, 385), beim ersten Mal von einer Oma Ruth, die noch nicht aufgetreten war.                                                                                                                                                                |
| `weg-ironwood-silicon.ink`   | `werbetafel_zero`            | „Das ist ein großes Versprechen.“ → „Ich kannte keinen Spieler, der das versprechen konnte. Nicht einmal Morphy.“                                                                                                                                                                                       | Wiederholung: Derselbe Satz fällt 44 Dialoge später wortgleich an der Werbetafel in Silicon Bay (Akt 3, Dialog 500, `silicon-bay-aussen.werbetafel`). Dort bleibt er.                                                                                                                                    |

### 3. Größere Fragen

1. **Kein Anlass für Ironwood** (Dialoge 311 bis 364; `riverton-aussen.kanalweg`,
   `ironwood-aussen.ankunft_zu_fuss`, `quests.json`). Nach dem Wohnwagen steht „keine laufende
   Quest“, bis man Ironwood betritt (`ironwood.clubkampf` startet erst auf `ironwood.aussen`). Am
   Kanalweg sagt nur Ambrose „Ironwood. … Gehen wir.“ Das Freundschaftsturnier und Mamas „Nein“
   kommen erst bei der Ankunft, wenn man schon einen halben Tag gegangen ist; die schönere Fassung
   (`maple-falls-wohnzimmer.nicht_ironwood`, Zettel vom Coach, „eine Unterscheidung, die Advokaten
   machen“) sieht nur, wer zwischendurch nach Hause fährt, und die Simulation erreicht sie nie.
   Vorschlag: Nach dem Wohnwagen eine Hauptquest oder ein Schritt „Mit dem Zug nach Hause“ (dann
   läuft Szene 38 zu Hause für alle), oder Juno nennt das Turnier schon in Riverton, etwa nach
   Slicks Abschied.
2. **Lockport fällt aus dem Ton** (338 bis 363, 407 bis 411; `lockport-aussen.ink`,
   `lockport-gasthaus.ink`). Imogen, Ruben und Henrik sprechen als Erzählzeilen in
   Anführungszeichen und stellen sich mit Namen und Beruf vor („Ruben Castellano. Kapitän der
   Ashford Belle.“). Überall sonst haben Figuren eine eigene Sprecherzeile, und der Erzähler
   beschreibt. Die Namen gibt es in `texte/de.json` (`figur.imogen.name` usw.); mit Sprecher-Tags
   und Eintrag in die Liste der Figuren ohne Porträt läse es sich wie der Rest. Gleiches gilt für
   Marian Shaw am Bahndamm und den Straßenmusiker in Riverton. Nicht umgesetzt, weil es die
   App-Liste braucht.
3. **Die Kantine nach dem Kauf** (436 bis 444; `ironwood-kantine.ink`). Die Karte hat einen Zustand
   `kaufGesehen` (Logo, Karton mit Pokalen), das Ortsblatt sagt „die Kantine ist geschlossen“ und
   verlegt den Club später in Big Joes Garage. Im Spiel sitzen Big Joe, Hank, Priya und Mama weiter
   dort; Big Joe bietet die Revanche an, das Stahlbrett wird angesehen wie vorher (es wurde in 430
   hinausgetragen). Ich habe nur die Stimmungszeile und das Pokalregal angepasst. Offen: Soll die
   Kantine nach dem Kauf leer sein (Figuren weg, wie der Pavillon am Montag), und wo spielt man die
   Revanche?
4. **Treppe oder Brücke** (`riverton-pavillon.slick_alltag`, `riverton-aussen.eli`,
   `cedar-creek-drechslerei.dunmore`, Dialog 490). Slick sagt „Dann spielen wir eben auf der
   Treppe“, Tamsin „überall, wo eine Stufe frei ist“; Mr. Dunmore in Cedar Creek sagt nach Akt 2
   „Er spielt jetzt unter einer Brücke. Dach hat er“, und Eli sitzt „unter der Brücke“. Eines von
   beiden sollte gelten, oder ein Satz verbindet sie (Treppe unter der Steinbrücke).
5. **London kann sehr früh kommen** (268; `riverton-bahnhofshalle.uhr`). Die Erinnerung braucht nur
   `bildschirmtischeGesehen`. Wer zuerst in die Halle geht, erlebt „Am Abend ist euer Zug weg“ und
   Ambroses große Frage, bevor er Slick kennt; danach ist wieder heller Tag. Vorschlag: erst nach
   Tamsins oder Rays Aufgaben.
6. **London, Reihenfolge am Strand** (269 bis 271; `erinnerung-london.ink`). Die Ankunft in fremden
   Händen („Du stehst in einer Straße … Die Stimme kommt aus dir“) steht an der Kaffeehaustür. Wer
   vorher den Zeitungsjungen oder die Droschke anspricht, hört Ambrose schon reden („London, 1851.
   Bleib bei mir“), bevor die Lage erklärt ist. Die Ankunftszeilen gehören an den Kartenanfang.
7. **Finchs Figuren: „helles Holz“ in anderen Akten.** `weg-maple-cedar.ink` (Zeile 309),
   `weg-silicon-delacroix.ink` (258) und `bayou.ink` (158) sagen noch „aus hellem Holz“, alle anderen
   „aus Buchsbaum“. Auch `texte/de.json`, `fund.finchLaeuferA.text` („aus hellem Holz“).
8. **Rückfahrt durch Akt 1 (nur gemeldet, nichts geändert):**
   - 483 `maple-falls-clubraum.coach`: „Cedar Creek hast du hinter dir. In der Vitrine ist noch
     Platz für einen Pokal.“ Mit vier Nadeln veraltet.
   - 485 `maple-falls-aussen.juno`: „Cedar Creek hat im Tagebuch vier Seiten bekommen.“ Veraltet,
     und Juno steht in Maple Falls, während sie zugleich mitreist.
   - 497 `maple-falls-clubraum.sam`: redet noch von der Bibliothek in Cedar Creek; geht, klingt
     aber nach Akt 1.
   - 490 `cedar-creek-drechslerei.dunmore`: siehe Punkt 4.
   - 480/481 Mrs. Calloway, 484/495 Carla, 486/496 Hector, 478 Mr. Kettering, 491 Zwillinge, 487
     Ambrose: stimmig, Hectors „Mann im Anzug“ ist eine gute Vorbereitung.
9. **Mamas Küchenszene** (386; `maple-falls-wohnzimmer.mama_foto`, Akt-1-Datei). Elf Zeilen Mama am
   Stück, weit über der Sechs-Zeilen-Regel. Sie trägt; ich würde sie so lassen. Nur zur Kenntnis.
10. **Lieblingsformeln, nicht geändert:** „noch nie so“ dreimal an Höhepunkten (311 „Du hast ihn
    noch nie so gehört“, 395 „so still, wie du ihn noch nie gesehen hast“, 418 „Du hast Mama noch
    nie so gesehen“); „trotzdem“ als Pointe mindestens achtmal (Slick, Finns Kahn, beide
    Rätseltafeln, Limonade, Ada, Dunmore).

### 4. Eigenheiten der Lesefassung

- **Reihenfolge auf der Karte.** Die Simulation fasst Dinge an, bevor sie die Figur daneben
  anspricht: Pops, Mr. Harlan, Mr. Teague und Oma Ruth reden oder werden genannt, bevor sie
  auftreten (278 bis 283, 383 bis 385, 394 bis 399); der Nietenkopf kommt vor dem Bild der Brücke
  (324 vor 325); Pokalregal und Partieformular stehen doppelt (373/375, 384/385). Ein Spieler
  spricht meist zuerst die Figur an. Vorschlag: auf jeder neuen Karte zuerst Figuren, dann Dinge.
- **Kartenname in der Kopfzeile stimmt nicht immer.** `ironwood-kantine.mama` steht unter „Mamas
  altes Zimmer“ (416, 417, 427, 436, 440, 444), `maple-falls-aussen.carla` unter „Clubraum“ (484,
  495). Offenbar bleibt der Name der zuletzt betretenen Karte stehen.
- **Rückfahrten mitten im Akt.** 276 (Zug nach Cedar Creek), 289/290 (zurück zum Bahndamm), 365 (Bus
  nach Riverton gleich nach der Ankunft in Ironwood), 408 bis 411 (Kahn hin und her) lesen sich wie
  Handlung, sind aber nur Wege der Simulation. Auch 435 bis 444: Nach „Einsteigen“ in den Bus nach
  Silicon Bay steht man wieder in der Kantine.
- **Quest an der falschen Zeile.** „Quest begonnen: Der leere Umschlag“ hängt an Ednas Laden (393),
  „Quest begonnen: Die Stadt aus Glas“ an der Rätseltafel (445).
- **Zufallssätze.** Welche Stimmungszeile fällt, hängt vom Startwert ab; die Mängel in `slick` und
  `big_joe` sah man nur, weil dieser Startwert sie traf. Für das Lektorat wäre eine Liste aller
  Varianten je Knoten nützlich.
- **Akt-Grenze.** Der Weg nach Silicon Bay (445 bis 474) und die Abfahrt im Januar (434) stehen in
  Akt 2, gehören erzählerisch zu Akt 3 (Szenen 51 und 52).

### 5. Prüfungen

Alle nach der letzten Änderung, im Hauptordner mit dem venv:

- `python -m pipeline.abenteuer.sprache`: 0 Funde
- `python -m pipeline.abenteuer.inkbesuche`: 0 Befunde
- `python -m pytest -q -k "not chaos" pipeline/tests`: 1596 bestanden, 12 übersprungen
- `npx vitest run src/abenteuer`: 108 Dateien, 566 Tests bestanden
- `node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1 --sekunden 300`: „Meldungen: keine“,
  alle Sammelstränge vollständig
- Zeitweilige Fehler durch die anderen Lektoren: keine aufgetreten.
- Zur Kontrolle neu erzeugt (nur im Scratchpad):
  `arbeit/lektor2/akt2.md`.
  Die geänderten Stellen stehen dort wie beabsichtigt.

### 6. Nicht gelesen, nicht geprüft

- Gelesen: `akt2.md` ganz, Zeile 1 bis 3300; die letzten 150 Zeilen von `akt1.md`, die ersten 170
  von `akt3.md`.
- Ink ganz gelesen: alle 16 Dateien von Akt 2 (`riverton-*`, `ironwood-*`, `lockport-*`,
  `erinnerung-london`, `steinbruch`, `weg-riverton-ironwood`, `weg-ironwood-silicon`). Aus Akt-1-
  Dateien nur `maple-falls-wohnzimmer.nicht_ironwood` und der Verteiler `mutter`.
- Nicht in Spielreihenfolge gesehen: die Knoten, die die Lesefassung nicht erreicht (Niederlagen,
  Remis, `mama_moment_rost`, `mama_moment_angriff`, `clubkampf_schraubstock`, `clubkampf_stimmt_es`,
  `clubkampf_odum`, `tamsin_eli`, `noor`). Ich habe sie im Ink gelesen, aber nicht im Zusammenhang
  einer Partie.
- Nicht geprüft: Texte außerhalb der Dialoge (`texte/de.json`: Questtexte, Fundtexte, Tagebuch,
  Partiemomente), die Partien selbst, das Kartenbild der Kantine nach dem Kauf (nur die
  Szenenbeschreibung und der Unterschied der Möbel), `erinnerung-siedlung.ink` (kommt in Akt 2 nicht
  vor). Story-Bibel: Abschnitte 5, 7 bis 9 und die Szenen 47 bis 52 gelesen, den Rest von Abschnitt
  11 nicht.
- Die neuen Zeilen sind nicht im laufenden Spiel angesehen (Zeilenlänge im Dialogfenster); alle
  bleiben unter 140 Zeichen und zwei Sätzen, außer der Stimmungszeile am Pokalregal nach dem Kauf
  (drei kurze Sätze, 97 Zeichen).

## Akt 3

## Lektorat der Lesefassung: Akt 3 (17.11.2026)

Gelesen: `akt3.md` (Dialoge 498 bis 779, Silicon Bay, Pelikaninsel, Küstenfähre, Port Delacroix, Canyon,
Sternwarte, Desert Springs, Diner und Bergstraße), dazu das Ende von `akt2.md` und der Anfang von
`akt4.md`. Nichts committet, nichts gepusht.

### 1. Eindruck

Akt 3 ist der geschlossenste Bogen, den ich in dieser Fassung gelesen habe: Tablet-Nacht, Vorwurf,
Schweigen, Werkstatt, Felsbogen, Brief, Garage. Jede dieser Szenen nimmt einen Satz der vorigen wieder
auf („Und ich?“, „Er hat nicht ganz unrecht“, „so gut ich kann“, „Zug vierzehn“), und das trägt auch
dann, wenn der Spieler dazwischen Burritos kauft. Am stärksten sind Port Delacroix (der Vorwurf, das
Bretter-Sammeln mit „wie wenn ein Zahn fehlt“, Claire in der Werkstatt) und der Abend am Felsbogen;
die Garage mit Miras „Sag ihm das“ löst die Spannung mit einem Lachen, das verdient ist. Silicon Bay
liest sich kühl und genau, Victor und Nova bekommen mit wenigen Zeilen Gewicht. Der Akt hängt an
zwei Stellen: In der Turnhalle erlaubt das Spiel eine Reihenfolge, in der Miss Odile erst nach den
Aufgaben von Remy und Lou vorgestellt wird, und am Schluss läuft die Geschichte nach „Schwarz am Zug.“
in eine Reiseauswahl und dann in einen Diner, an dem der Auftakt des nächsten Kapitels („Es ist Sommer,
und du bist fünfzehn“) erst kommt, nachdem man dort schon zweimal mit Earl gesprochen hat.
Wiederholungen sind selten und meist Absicht (Leitsätze der Figuren); gestört haben nur Miss Odiles
zwei Leitsätze, die rund um den Clubkampf jeweils doppelt fielen, und „Wie seltsam. Und doch.“ an
zwei Stellen am Diner. Mehrmals wird etwas überreicht, ohne dass der Text sagt, was („Die gehört jetzt
dir“). Mama steht ohne ein Wort der Erklärung auf der Fähre, obwohl sie beim Abschied in Ironwood
Nachtschicht hatte. Schachlich habe ich nichts Falsches gefunden.

### 2. Geändert

22 Änderungen in 10 Dateien. Knotennamen und Tags unverändert; eine neue Variablenzeile
(`bugGesehen` in silicon-bay-aussen.ink, globale Variable aus weg-silicon-delacroix.ink).

| Datei                          | Knoten                | vorher → nachher                                                                                                                                                                                                               | Grund                                                                                                                                                                                                   |
| ------------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| silicon-bay-aussen.ink         | `faehre`              | (neu, nur vor der ersten Überfahrt) → **Mama steht schon an der Gangway, die Tasche über der Schulter. Das Notzelt in Port Delacroix braucht Hände, und sie hat zwei.**                                                        | Sprung: Mama hatte in Ironwood Nachtschicht und blieb zurück; auf der Fähre lehnt sie plötzlich in der Kombüsentür (584), ohne dass je gesagt wird, dass sie mitfährt. Satz nach dem Roman, Kapitel 35. |
| silicon-bay-aussen.ink         | Variablen             | – → **VAR bugGesehen = false**                                                                                                                                                                                                 | Für die Bedingung oben.                                                                                                                                                                                 |
| pelikaninsel.ink               | `coral`               | Hier, die mit dem Loch. → **Hier, die Muschel mit dem Loch.**                                                                                                                                                                  | „die“ hatte keinen Bezug; von Muscheln ist erst beim zweiten Besuch die Rede.                                                                                                                           |
| weg-silicon-delacroix.ink      | `kapitaen_horn`       | Die gehört jetzt dir. → **Die Mütze gehört jetzt dir.**                                                                                                                                                                        | Was er verschenkt, stand nirgends (nur im Fund).                                                                                                                                                        |
| port-delacroix-aussen.ink      | `batiste_nach_sieg`   | Er schiebt dir zwei Karten über die Kiste. → **… über das Brett.**                                                                                                                                                             | Das Brett steht auf einem Eimer; eine Kiste gibt es nicht.                                                                                                                                              |
| port-delacroix-aussen.ink      | `wuestenzug`          | Ambrose: „Wüste. Ich war nie in der Wüste. Es wird Zeit.“ → **gestrichen**                                                                                                                                                     | Die Zeile kann nur kommen, wenn man aus dem Canyon zurück ist (beim ersten Mal läuft der Abschied von Mama); dort hat er denselben Satz schon gesagt („Ich war nie in einer Wüste“).                    |
| port-delacroix-turnhalle.ink   | `odile_bretter`       | Und wenn du um die Nadel spielen willst: erst Remy, dann Lou, dann ich. → **{beide Reihen bestanden: Remy und Lou hast du hinter dir. Wenn du um die Nadel spielen willst: Ich bin hier. \| wie bisher}**                      | Sprung: Die Quest schickt nach dem Vorwurf zu Remy und Lou; wer danach Miss Odile anspricht, bekam die Reihenfolge erklärt, die er schon hinter sich hat (618 bis 621 vor 637).                         |
| port-delacroix-turnhalle.ink   | `odile_clubkampf`     | Es passiert die ganze Zeit etwas. Bauern sind die Melodie. Die Figuren spielen nur dazu. → **Es passiert die ganze Zeit etwas. Hör auf die Bauern.**                                                                           | Wiederholung: Derselbe Satz ist eine ihrer zwei Begrüßungen und stand fünf Zeilen vorher im selben Dialog (654).                                                                                        |
| port-delacroix-turnhalle.ink   | `odile_clubkampf`     | Noch einmal? Gut. Ein Plan ist kein Sprint. → **Noch einmal? Gut. Ich spiele wieder langsam.**                                                                                                                                 | „Ein Plan ist kein Sprint“ dreimal in acht Dialogen (654, 656, 661); bleibt im Clubkampf und bei Lou.                                                                                                   |
| port-delacroix-turnhalle.ink   | `remy_alltag`         | Remy übt Tonleitern auf der Trompete. Er hört kurz auf, als du vorbeigehst. (als Remys Rede) → **Tonleitern. Jeden Tag. Auch ohne Dach.**                                                                                      | Erzählsatz stand mit `#sprecher:remy` in einer Zufallsfolge mit zwei gesprochenen Sätzen; im Spiel sagte Remy „Remy übt Tonleitern …“ (650).                                                            |
| weg-delacroix-desert.ink       | `versoehnung_lektion` | … siehst du unter dem Felsbogen etwas, das du vorher nicht bemerkt hast. → **… siehst du etwas, das du vorher nicht bemerkt hast.**                                                                                            | Die nächste Zeile beginnt mit „Unter dem Felsbogen überspannt eine Brücke …“.                                                                                                                           |
| weg-delacroix-desert.ink       | `versoehnung_lektion` | (Brücke schon gefunden: derselbe Satz, dann gleich „Dreizehn Jahre danach.“) → **Als ihr absteigt, im letzten Grau, bleibt ihr an der Brücke unter dem Felsbogen stehen. J. H. auf jeder Niete, am Pfeiler die Platte: 1879.** | Logik: Wer die Brücke vorher angetippt hat, „bemerkte“ sie hier zum ersten Mal und antwortete auf eine Jahreszahl, die nicht dastand.                                                                   |
| weg-delacroix-desert.ink       | `seilschaft_ende`     | Hier, der gehört dir. → **Hier, der Karabiner gehört dir.**                                                                                                                                                                    | Bezug fehlte.                                                                                                                                                                                           |
| desert-springs-aussen.ink      | `buck_nach_sieg`      | Hier, die hab ich mal einem Lkw-Fahrer abgewonnen. → **Hier, die Karte hab ich …**                                                                                                                                             | Bezug fehlte.                                                                                                                                                                                           |
| desert-springs-aussen.ink      | `abend_motel`         | Der zweite Satz gefällt dir nicht. → **Der letzte Satz gefällt dir nicht.**                                                                                                                                                    | Die zweite Nachricht hat vier Sätze; gemeint ist „Er ist kein Mensch.“ (Im Roman stehen zwei Nachrichten, daher „der zweite“.) Victors neue erste Nachricht ist unverändert.                            |
| desert-springs-garage.ink      | `dot_reihe`           | Ich spiele seit fünfzig Jahren per Post. Ein Zug pro Woche, aber jeder sitzt. → **Bei mir geht ein Zug pro Woche zur Post. Aber jeder sitzt.**                                                                                 | „Fünfzig Jahre per Post“ dreimal hintereinander (Dot 715, Mira 718, Dot 719).                                                                                                                           |
| desert-springs-antiquariat.ink | `okoro_brief`         | Reihenfolge: „Zwei Umschläge …“, „Seine Antwort … Seite, die fehlt.“, „Den Brief hat er … nie geöffnet.“ → **„Zwei Umschläge …“, „Den Brief hat er … nie geöffnet.“, „Seine Antwort … Seite, die fehlt.“**                     | Fluss: Umschlag und Brief gehören zusammen; die fehlende Seite steht jetzt am Schluss und weist nach vorn (Akt 4). Wortlaut unverändert.                                                                |
| desert-springs-antiquariat.ink | `okoro_brief`         | … bis der Richtige kommt. → **… bis jemand sie braucht.**                                                                                                                                                                      | Geschlechtsneutral für {held} (Story-Bibel 5.2); gemeint ist das Kind am Schalter.                                                                                                                      |
| weg-desert-summit.ink          | `tafel`               | Nur Könige und Bauern. Wie seltsam. Und doch. → **Nur Könige und Bauern. So wenig Holz, und kein Zug ist leicht.**                                                                                                             | Dieselbe Wendung sagt Ambrose am selben Ort zum Königsrennen (747 und 758).                                                                                                                             |
| weg-desert-summit.ink          | `ereignis_funkschach` | Aus dem Funkgerät rauscht es. „{held} Junior, bist du da? …“ (alles als Mama Bear) → **Erzählzeile, dann Mama Bears Satz**                                                                                                     | Erzählung stand in der Zeile der Sprecherin (764).                                                                                                                                                      |
| weg-desert-summit.ink          | `hinterzimmer_tuer`   | {held} klopft dreimal. → **Du klopfst dreimal.**                                                                                                                                                                               | Erzählung spricht den Helden überall mit „du“ an (769).                                                                                                                                                 |
| weg-desert-summit.ink          | `quelle`              | {held} trinkt ein paar Schlucke. → **Du trinkst ein paar Schlucke.**                                                                                                                                                           | Wie oben (762).                                                                                                                                                                                         |

Hinweis: `port-delacroix-musikhaus.ink` ist während meiner Arbeit von jemand anderem geändert worden
(Ambrose-Zeilen hinter `not abschiedGesehen`); von mir stammt dort nichts.

### 3. Größere Fragen

1. **Auftakt am Diner kommt zu spät (746 bis 758, `weg-desert-summit.diner_ankunft`, `earl`).** Der
   Auftakt „Es ist Sommer, und du bist fünfzehn … An einem Diner … haltet ihr zum Tanken … Ich bin
   Earl“ hängt an Earl und am Übergang zur Bergstraße. Wer vorher das Neon-K (749) oder das Funkgerät
   (750) antippt, hat schon zweimal mit Earl gesprochen. Dazu endet der Highway-Dialog schon mit „Nach
   einer Stunde taucht ein Diner mit Neonschild auf. Mama hält an.“ (746); die Ankunft steht also
   doppelt. Vorschlag: `diner_ankunft` als Ereignis beim ersten Betreten der Karte (orte.json), den
   Schlusssatz des Highways streichen. Kleinigkeit dabei: „Neonschild in Form eines Königs“ (758)
   gegen den Schriftzug „KING'S DINER“ mit dem fehlenden K (749, 768).
2. **Schluss am Bahnhof (740, `desert-springs-aussen.bahnhof_ende`).** Nach „Schwarz am Zug.“ folgt im
   selben Dialog „Der Zug fährt gleich. Wohin?“ mit der Reiseauswahl. Das nimmt dem Schlussbild die
   Pause, und die Geschichte geht danach mit Dots Auto weiter, nicht mit dem Zug. Vorschlag: Der
   Schlussdialog endet bei „Schwarz am Zug.“; die Fahrten gibt es beim nächsten Ansprechen.
3. **Reihenfolge in der Turnhalle (617 bis 637).** Nach dem Vorwurf zeigt die Quest auf Remy; Miss
   Odiles Szene mit Geigenkasten, Handkarren und ihrem Namen („Die Frau mit dem weißen Haar heißt Miss
   Odile“) kommt erst, wenn man sie von sich aus anspricht, im schlechtesten Fall nach beiden Reihen.
   Ich habe nur ihren letzten Satz angepasst. Besser wäre, `odile_bretter` schlösse an den Vorwurf an
   (Roman: Kapitel 37 folgt auf 36) oder Remy verwiese vor seiner Reihe an sie.
4. **Quests, die zu früh beginnen (quests.json, nicht geändert).** „Eine Batterie für das Leuchtfeuer“
   beginnt im Eisenwarenladen mit „Ich schaue nur.“ (511), bevor der Held das dunkle Leuchtfeuer
   gesehen hat (549); daneben läuft „Das Leuchtfeuer“ mit fast demselben Auftrag. „Erinnerung: Die
   Werkstatt, 1852“ beginnt beim Satz „Du hast keinen Grund, sie anzufassen.“ (625).
5. **Questtext (texte/de.json, nicht geändert):** `quest.wiederaufbau.schritt3` „Nach der Simultan mit
   Miss Odile reden.“ → „Nach dem Simultan …“ (im Dialog heißt es seit heute „ein Simultan“).
6. **Dr. Lin und die Spielberichte (526, 530, `silicon-bay-akademie.lin_tisch_aus`, `lin_alltag`).**
   „Ich habe die Spielberichte meiner Klasse nie so genau angesehen“ nach dem Clubkampf liest sich
   als Vorahnung und trägt. Die Alltagszeile „… noch einmal angesehen. Ich schlafe schlecht.“ kann
   aber vor Victors Speicherstift (535) kommen und nimmt ihm etwas vorweg. Vorschlag: diese eine
   Zeile erst nach der Auswertung (`siliconBayAuswertungBestanden`).
7. **Ambrose nach der Tablet-Nacht in Silicon Bay.** An der Werbetafel schweigt er (542), im
   Eisenwarenladen sagt er heiter „Ein Licht für die Insel. Manche Züge macht man für andere.“ (559).
   Kein Fehler, aber der Ton der gebannten Tage wäre einheitlicher, wenn die Zeile nur vor der Nacht
   käme.
8. **„Sie sind aneinander vorbeigefahren.“ (686, `weg-delacroix-desert.erzaehlung_1866`).** Gemeint
   sind der leere Umschlag und Ambrose; ein Leser kann „sie“ auf Hale und Ambrose beziehen, und Hale
   ist nicht gefahren. Vorschlag: „Der Umschlag und er sind aneinander vorbeigefahren.“ Nicht
   geändert, weil der Satz aus dem Roman stammt und an der empfindlichsten Stelle steht.
9. **Mrs. Holloway nimmt Ambroses erste Frage vorweg (681 vor 686).** „Wer angreift, braucht mehr
   Figuren am König als der Verteidiger“ steht am Wanderschild, eine Karte vor der Lektion am
   Felsbogen („Erste Frage: Wie viele Angreifer am König …“). Als Hinweis zur Tafel ist das richtig;
   die Lektion verliert dadurch etwas. Möglich: Mrs. Holloway spricht nur vom Wasser, bis die Lektion
   gelaufen ist.
10. **Zahlen:** Remy spricht von zwanzig Bildschirmen (617), die Mappe am Deich von „40
    Bildschirmtischen“ (590). Vermutlich Absicht (geplant und geliefert), sonst angleichen.
11. **Kontrollzüge im Brief (726):** „Neunundzwanzig bis zweiunddreißig. Zur Kontrolle“, während der 39. Zug unterwegs ist. In `docs/spiel/22_Dialogpruefung.md` (D2.1) schon behandelt; hier nur der
    Vermerk, dass ein aufmerksamer Leser an der Stelle stutzt.

### 4. Eigenheiten der Lesefassung

- **Aktgrenzen.** Weg 4 (Bus, Raststätte, Glasbrücke mit dem Fund des Ohrstöpsels) steht am Ende von
  `akt2.md`; Akt 3 beginnt mit der Ankunft, die noch unter „Schnellstraße · Glasbrücke“ einsortiert
  ist, und der „Stöpsel von der Glasbrücke“ (539) hat im Akt keinen Vorlauf. Umgekehrt steht Weg 7
  (Diner, Bergstraße, 747 bis 779) am Ende von Akt 3, gehört aber nach Inhalt und Dateikopf zu Akt 4.
- **Geschenke ohne Namen.** `gibFund` und `gibKarte` erscheinen nicht. Dadurch fielen die Stellen mit
  „die gehört dir“ auf (gut), aber an anderen Stellen fehlt dem Leser, was er bekommt. Vorschlag: eine
  Zeile „[Fund: …]“ oder „[Karte: …]“.
- **Reihenfolge innerhalb einer Karte.** Theo mit dem Tablet vor Dr. Lin (515, 516), die Werkstatt
  und Henri vor dem Leim-Auftrag (625 bis 629 vor 649), Remy und Lou vor Miss Odile. Das Spiel lässt
  es zu; nur die Turnhalle ist dabei ein Mangel (Frage 3).
- **Rückwege.** 557/558, 632/633, 702 bis 709, 728/729, 774 bis 777 bestehen nur aus
  Übergangssätzen und Leerständen („nur noch Sand“). 703 zeigt den Dialog des Wüstenzugs als Ankunft
  in Port Delacroix.
- **Schleifen durch die Wahlregel.** Earls Königsrennen wird dreimal vollständig erklärt (758, 773,
  778), weil „dieselbe Auswahl, nächste Antwort“ zweimal auf „Erklär mir das noch einmal“ fällt.
  Ähnlich 670: „Noch nicht.“ vor einer Revanche, die schon gespielt ist.
- **Zweitzustände der Dinge zum Ansehen** stehen in Blöcken hintereinander (592 bis 603 auf der
  Fähre, 763 bis 767 am Diner); beim Lesen sind das Listen, im Spiel fallen sie nicht auf.
- **Erzählzeilen mit wörtlicher Rede namenloser Figuren** (Eisenwarenhändler 511, 559; die Häuser
  639 bis 642) stehen kursiv wie Erzählung; das ist im Ink so und kein Fehler des Werkzeugs.

### 5. Prüfungen

Nach den Änderungen, venv des Repositorys, `PYTHONPATH=/home/user/SvGa_Public`:

- `python -m pipeline.abenteuer.sprache`: 0 Funde.
- `python -m pipeline.abenteuer.inkbesuche`: 0 Befunde.
- `python -m pytest -q -k "not chaos" pipeline/tests`: 1596 bestanden, 12 übersprungen, 1 abgewählt.
- `cd app && npx vitest run src/abenteuer`: 108 Dateien, 566 Tests bestanden.
- `node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1 --sekunden 300`: „Meldungen: keine“,
  nie besuchte Orte: keine, alle vier Sammelstränge vollständig.
- Lesefassung neu erzeugt (in den Scratchpad, `lektor3_neu/`): alle geänderten Zeilen stehen wie
  beabsichtigt da; Akt 3 weiter 282 Dialoge.

Kein Lauf musste wiederholt werden. Nicht gelaufen: `npm run pruefen` als Ganzes, Playwright.

### 6. Nicht gelesen / nicht geprüft

- `akt3.md` habe ich von Zeile 1 bis 3785 gelesen, dazu die letzten 150 Zeilen von `akt2.md` und den
  Anfang von `akt4.md` (Dialoge 780 bis 790).
- Ink: Vollständig gelesen habe ich port-delacroix-turnhalle, -aussen, -werkstatt, silicon-bay-aussen,
  -akademie, -lobby, -serverraum, desert-springs-aussen, -garage (ab Zeile 60), pelikaninsel und
  weg-desert-summit. Nur in den Knoten, die mir in der Lesefassung auffielen: weg-silicon-delacroix,
  weg-delacroix-desert, desert-springs-antiquariat. Gar nicht geöffnet: sternwarte.ink und
  port-delacroix-musikhaus.ink (nur über die Lesefassung gelesen).
- Die 102 Knoten, die in der Lesefassung fehlen (Niederlagen, Remis, Wartesätze, Partiemomente wie
  `clubkampf_sturm` und `clubkampf_atme`), habe ich nur gesehen, soweit sie in den vollständig
  gelesenen Dateien stehen; als Verlauf geprüft sind sie nicht.
- Texte außerhalb der Dialoge (Questtexte, Tagebuch, Aufgabenstellungen, Partiekommentare) und die
  Stellungen selbst habe ich nicht geprüft. Mit dem Roman verglichen habe ich nur zwei Stellen
  (Victors Nachricht, Mamas Mitfahrt).

## Akt 4

## Lektorat der Lesefassung, Akt 4 und Teil nach dem Abspann (17.11.2026)

Grundlage: `akt4.md` (Dialoge 780 bis 1188), Anschluss aus `akt3.md` (765 bis 779), Story-Bibel
Teil 4 (Abschnitte 25 bis 35) und Abschnitt 5, `ENTSCHEIDUNGEN.md` (Q21), Prüfbericht
`dialogpruefung_17-11/akt4.md`. Nichts committet, nichts gepusht.

### 1. Eindruck

Akt 4 ist der stärkste Bogen der vier: Er hat ein klares Gefälle von Wards Hütte (Stille, Endspiel,
Victors Zusammenbruch) über das Wiedersehen in Crossroads und die leichte Nacht im Camp bis zu
Ghost Town, und jede Station gibt Ambrose einen Schritt mehr Abschied („es ist still“, das Grab,
die letzte Kerze, die Nacht am Gehsteig, die Treppe). Die tragenden Szenen (Bergstation, Erinnerung
1866, Fernpartie, Aussage, Gang vor dem Finale, Abschied) lesen sich geschlossen und brauchen keine
Hilfe; die Rückbezüge (Ketchup, „Später?“, Suppenlöffel, sechs Wörter, „Er ist angekommen“) sitzen.
Schwächer sind die Ränder: An den Wegen wiederholt sich das Muster „Figur stellt Variante vor,
Ambrose kommentiert, heute geht es leider nicht“ fünfmal (Drache, Atomschach, Entenschach, Falke und
Bison, Drei-Schach, dazu Nebelschach); das liest sich nach der dritten Vertröstung wie ein
Versprechen, das nicht gehalten wird. Ambrose kommentiert in diesem Akt fast jeden Fund mit einem
Aphorismus; einzeln sind sie gut, in der Dichte nutzen sie sich ab, vor allem neben den großen
Szenen. Die Capital Arena hängt nirgends, nur die Kreidenacht steht zeitlich quer (eine „Nacht“ am
Turniermorgen). Echter Bruch war der Teil nach dem Abspann: Ambrose redete nach dem Abschied
munter weiter. Das ist für die Nebenschauplätze von Akt 4, das Musikhaus und den Bayou behoben;
für Szenen, die um ihn herum gebaut sind, und für Akt 1 bis 3 bleibt es offen (Abschnitt 3).

### 2. Geändert

#### 2.1 Ambrose nach dem Abschied

Befund der Klärung: Die Story-Bibel ist eindeutig. Abschnitt 33, Frage 5: „Ambroses Abschied
endgültig? Empfehlung: ja, … im Post-Game spricht er nicht mehr, nur der Zettel bleibt im Album.“
Der Autor hat das angenommen (`ENTSCHEIDUNGEN.md`, Q21-5: „endgültiger Abschied mit
Extra-Abspann“). Die Variable gibt es schon: `abschiedGesehen`, gesetzt am Anfang von
`capital-arena-aussen.abschied`, bisher nur vom Dachboden gelesen. Keine neue Variable.

Umsetzung: In 19 weiteren Dateien steht jetzt `VAR abschiedGesehen = false` (mit Kommentar, nur
gelesen; `capital-arena-aussen` und `maple-falls-dachboden` hatten sie schon), und die Ambrose-Zeilen der folgenden Knoten stehen in
`{not abschiedGesehen: … }`. Wortlaut unverändert, außer wo genannt. Vor dem Abschied ändert sich
nichts (in der neu erzeugten Lesefassung stehen alle Zeilen in Akt 4 wie vorher; nach dem Abspann
spricht Ambrose kein einziges Mal mehr).

| Datei                    | Knoten                                                                                                  | vorher → nachher                                                                                                                                                                                                                                                                                                        | Grund                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| port-delacroix-musikhaus | schild_aufhaengen                                                                                       | „Mein Vater hat für dieses Haus Klaviere gestimmt …“ → nur vor dem Abschied                                                                                                                                                                                                                                             | Dialog 1157 nach dem Abspann                                                                  |
| port-delacroix-musikhaus | blaeser_regel                                                                                           | drei Zeilen („Hier hilft dir nichts Auswendiggelerntes …“, „Als Kind …“, „Jetzt lerne ich es eben …“) → nur vor dem Abschied                                                                                                                                                                                            | Dialog 1160                                                                                   |
| port-delacroix-musikhaus | blaeser_set3                                                                                            | „Sie wird schneller und mutiger …“ → nur vor dem Abschied                                                                                                                                                                                                                                                               | Dialog 1183                                                                                   |
| port-delacroix-musikhaus | blaeser_setliste                                                                                        | „In meiner Stadt, mit gemischten Figuren …“ → nur vor dem Abschied                                                                                                                                                                                                                                                      | Dialog 1184                                                                                   |
| port-delacroix-musikhaus | loch_im_dach                                                                                            | `{ambroseSprichtWieder: …}` → `{ambroseSprichtWieder and not abschiedGesehen: …}`                                                                                                                                                                                                                                       | gleiche Regel                                                                                 |
| bayou                    | theron                                                                                                  | „Wie im Leben: Man sieht nie das ganze Brett …“ → nur vor dem Abschied                                                                                                                                                                                                                                                  | Dialog 1170                                                                                   |
| bayou                    | pepe_formular                                                                                           | „Warte. Zeig mir das Blatt.“ / „Das ist meine Schrift …“ → nach dem Abschied stattdessen Erzähler: „Es ist Ambroses Schrift. Eine Partie gegen einen Hafenarbeiter. Von ihr hat er nie erzählt.“                                                                                                                        | Dialog 1164; ohne die Zeile fehlte, wessen Partie das ist                                     |
| bayou                    | pepe_nach_partie                                                                                        | „Diesmal nicht. Diesmal nicht!“ / „Remis. Das hätte ich damals unterschrieben.“ / „Wieder verloren …“ → nach dem Abschied Erzähler: „Diesmal gewinnt Weiß. Du hättest es ihm gern gezeigt.“ / „Remis. Das hätte er damals wohl unterschrieben.“ / „Wieder verloren. Schön war es trotzdem, sie noch einmal zu spielen.“ | Dialog 1165; sonst begänne der Knoten mit dem Streichholz ohne Ergebnis                       |
| bayou                    | finch_bauer_c                                                                                           | „Unter dem Bauern ist ein Feld eingebrannt. Wer versteckt Schachfiguren in Fischreusen?“ → nach dem Abschied Erzähler: „Unter dem Bauern ist ein Feld eingebrannt.“                                                                                                                                                     | Dialog 1166; der Hinweis auf das Feld muss bleiben                                            |
| weg-ghost-capital        | odette_geloest                                                                                          | „Ein Problem will gelöst werden …“ → nur vor dem Abschied                                                                                                                                                                                                                                                               | Dialog 1187                                                                                   |
| weg-ghost-capital        | abe                                                                                                     | „Der König muss zum Leuchtturm. Wie wir alle.“ samt Erzählzeile „Es klingt nicht traurig …“ → nur vor dem Abschied                                                                                                                                                                                                      | Leuchtturm ist nachholbar                                                                     |
| weg-ghost-capital        | weltschachtag_funk                                                                                      | „So viele Menschen an einem Brett …“ → nur vor dem Abschied                                                                                                                                                                                                                                                             | Nebenquest, nachholbar                                                                        |
| capital-arena-aussen     | wanderer_buch                                                                                           | „Stellungen, die jemand aufgehoben hat. Das kenne ich.“ → nur vor dem Abschied                                                                                                                                                                                                                                          | Dialog 1188 (immer nach dem Finale)                                                           |
| capital-arena-halle      | lin_mappe                                                                                               | „Sechs Spuren …“ → nur vor dem Abschied                                                                                                                                                                                                                                                                                 | Nebenquest, nachholbar                                                                        |
| capital-arena-innenstadt | kreide5                                                                                                 | „Der Springer springt über die Mauer …“ → nur vor dem Abschied                                                                                                                                                                                                                                                          | Nebenquest                                                                                    |
| capital-arena-ubahnhof   | mo_victor                                                                                               | „Niemand fragt hier nach einem Namen …“ → nur vor dem Abschied                                                                                                                                                                                                                                                          | Nebenquest                                                                                    |
| summit-city-aussen       | sol_angebot, drachenfest_erstes_mal, drachenfest_angebot, fernrohr                                      | je eine Zeile → nur vor dem Abschied                                                                                                                                                                                                                                                                                    | Straßengegnerin (bei jeder Partie), Nebenschauplatz, Ansehen                                  |
| summit-city-bergladen    | theke                                                                                                   | „Ein Laden, der den Leuten traut …“ → nur vor dem Abschied                                                                                                                                                                                                                                                              | Laden, frei besuchbar                                                                         |
| summit-city-bergstation  | fund_pfeife                                                                                             | „Pfeif, und sie pfeifen zurück …“ → nur vor dem Abschied                                                                                                                                                                                                                                                                | Fund                                                                                          |
| summit-city-huette       | haraldsen_studie_mit                                                                                    | „Du willst sie mit einem Endspiel wach halten? …“ → nur vor dem Abschied                                                                                                                                                                                                                                                | Nebenquest                                                                                    |
| hochebene                | kira_vorfuehren (2 Zeilen), annek_schach, joss, diplom_ende                                             | → nur vor dem Abschied                                                                                                                                                                                                                                                                                                  | Nebenschauplatz L9, nachholbar                                                                |
| weg-summit-crossroads    | bell_regel (2 Zeilen), ray_regel, tafel, bisons, fund_bisonhaar, geysirblitz_angebot, spur_pm5, seite09 | → nur vor dem Abschied                                                                                                                                                                                                                                                                                                  | Weg mit Nebenquests; `bell_regel` und `ray_regel` laufen bei jedem „Erklär mir … noch einmal“ |
| crossroads-aussen        | wegweiser, viehgatter                                                                                   | → nur vor dem Abschied                                                                                                                                                                                                                                                                                                  | Ansehen                                                                                       |
| crossroads-raststaette   | darlene_lieferung                                                                                       | „Eine Kiste, ein Schlüssel und ein Auftrag …“ → nur vor dem Abschied                                                                                                                                                                                                                                                    | Nebenquest                                                                                    |
| jahrmarkt                | schachautomat_geloest                                                                                   | „In Kempelens Kiste saß auch ein Mensch …“ → nur vor dem Abschied                                                                                                                                                                                                                                                       | Nebenschauplatz                                                                               |
| weg-crossroads-pinewood  | tafel, rangerhaus (2 Zeilen), lebendschach_angebot, seite10, finch_dame, kreide4, greta_nach_partie     | → nur vor dem Abschied                                                                                                                                                                                                                                                                                                  | Weg zum Camp ist ein Abstecher (13_Wegenetz), also nachholbar                                 |
| weg-pinewood-ghost       | ereignis_tankstelle, greifarm_ende                                                                      | → nur vor dem Abschied (zusätzlich zu `ambroseSprichtWieder`)                                                                                                                                                                                                                                                           | Nebenquest                                                                                    |
| ghost-town-saloon        | klavier                                                                                                 | „Ein Klavier verstimmt sich …“ → nur vor dem Abschied                                                                                                                                                                                                                                                                   | Ansehen                                                                                       |
| goldmine                 | logbuch_gefunden                                                                                        | „Bei Kerzenlicht …“ → nur vor dem Abschied                                                                                                                                                                                                                                                                              | Nebenquest                                                                                    |

#### 2.2 Lektorat

| Datei                   | Knoten               | vorher → nachher                                                                                                                                                                                                                                        | Grund                                                                                                                                                                                                                                                                            |
| ----------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| summit-city-aussen      | drachenfest_alltag   | `-> drachenfest_angebot` → `-> END`                                                                                                                                                                                                                     | Bei jedem späteren Antippen des Brunnens kamen wieder „Alle Bretter sind belegt. Die Bergführer spielen bis Mitternacht …“ und Ambroses „Nächstes Mal setzen wir uns dazu“ (Dialoge 795, 803, 810), auch Tage nach dem Fest und direkt nach „Die Laternen vom Fest hängen noch“. |
| hochebene               | kira_vorfuehren      | „Ich könnte dir erklären, wie man dagegen spielt. Aber ich weiß es nicht.“ → „Ich würde dir gern erklären, wie man dagegen spielt. Aber ich weiß es nicht.“                                                                                             | „Ich könnte … Aber ich weiß es nicht“ widerspricht sich im Satz (837).                                                                                                                                                                                                           |
| weg-crossroads-pinewood | greta_erstes_treffen | Greta: „Greta macht die Augen auf. Der steht doch gar nicht …“ → Erzähler: „Greta macht die Augen auf.“, dann Greta: „Der steht doch gar nicht …“                                                                                                       | Erzählsatz stand in Gretas Rede (956).                                                                                                                                                                                                                                           |
| weg-pinewood-ghost      | greifarm_start       | Z-1 als Sprecher: „Auf seinem kleinen Bildschirm leuchtet: „Prototyp Z-1 …““ → dieselbe Zeile als Erzähler                                                                                                                                              | Erzählsatz stand als Rede des Greifarms (1015); die beiden Nachbarstellen waren am Vormittag schon so behoben.                                                                                                                                                                   |
| weg-pinewood-ghost      | greifarm_ende        | „Lasst ihn spielen, er hat sonst niemanden.“ → „Lass ihn spielen, …“                                                                                                                                                                                    | Ambrose spricht nur zu {held} (1016).                                                                                                                                                                                                                                            |
| ghost-town-aussen       | grab_erstes          | Pruitt: „Ein alter Mann mit Strohhut und einem Metalldetektor kommt zwischen den Kreuzen heran. Pruitt. Ich bin die Einwohnerzahl.“ → Erzähler: „Ein alter Mann … kommt zwischen den Kreuzen heran.“, dann Pruitt: „Pruitt. Ich bin die Einwohnerzahl.“ | Erzählsatz stand in Pruitts Rede (1027); trifft jeden, der zuerst zum Grab geht.                                                                                                                                                                                                 |
| ghost-town-aussen       | nacht_ambrose        | „… streiten, ob man eine Remispartie ins Tagebuch kleben darf.“ → „… ob man eine ganze Partie ins Tagebuch kleben darf.“                                                                                                                                | Die Fernpartie kann gewonnen oder verloren sein (in der Lesefassung gewonnen, 1048, dann „Remispartie“ in 1051).                                                                                                                                                                 |
| erinnerung-siedlung     | letzter_brief        | „Gib es dem Postreiter. Bring ihn nach Norden. Er wartet.“ → „Gib den Brief dem Postreiter. Er soll ihn nach Norden bringen. Dort wartet jemand.“                                                                                                       | Im Roman hält Ambrose Gideon den Brief hin („Gib es ihm. Bring ihn nach Norden.“); ohne die Geste liest man, Gideon solle den Postreiter nach Norden bringen (1044). Gideons „Wer?“ passt weiter.                                                                                |
| crossroads-raststaette  | darlene_lieferung    | „Nova sagt, du musst nach Ghost Town.“ → „Das Mädchen mit dem Tagebuch sagt, ihr wollt nach Ghost Town.“                                                                                                                                                | Nova weiß nichts von Ghost Town; {held} hat es ihr nie gesagt (931). Juno kennt den Plan. Widerspruch genügt.                                                                                                                                                                    |
| crossroads-raststaette  | varianten_tisch      | „Entenschach, von Ray im Sturmkeller.“ → „Entenschach, von Ray in der Prärie.“                                                                                                                                                                          | Ray erklärt es am Feldrand; der Sturm dreht ab, im Keller war niemand (880, 909).                                                                                                                                                                                                |
| capital-arena-halle     | nova_nach_partie     | „Zum ersten Mal weiß ich nicht, ob ich gewinne. Ich hab es keine Sekunde gewusst.“ → „Zum ersten Mal wusste ich nicht, ob ich gewinne. …“                                                                                                               | Sie sagt es nach der Partie, direkt nach „Ich hab verloren. Und ich weiß genau, wo.“ (1128). Der Kernsatz der Bibel bleibt, nur die Zeit stimmt.                                                                                                                                 |
| weg-ghost-capital       | wanderer_seiten      | „Alle dreizehn. Nach deinem Finale lasse ich sie binden.“ → „Alle dreizehn. Jetzt lasse ich sie binden.“                                                                                                                                                | Fiel in der Lesefassung nach dem Finale (1185); „jetzt“ passt vorher und nachher.                                                                                                                                                                                                |
| pinewood-camp-aussen    | ezra                 | „… Heute Abend ist Lagerfeuer.“ → „… Heute Abend ist {lagerfeuerGesehen:wieder }Lagerfeuer.“                                                                                                                                                            | Wer zuerst zum Feuer geht (Questziel), bekam danach die Ankündigung des Abends, den er schon erlebt hat (977, dann 981).                                                                                                                                                         |

### 3. Größere Fragen

1. **Ambrose nach dem Abschied, Rest.** Nicht angefasst, weil mehr als eine Zeile daran hängt:
   - **Partien gegen Ambrose:** „Blindschach gegen Ambrose“ bei Greta (`weg-crossroads-pinewood.greta_angebot`, `greta_nach_partie`, Dialoge 956, 957) und am Varianten-Tisch „Blindschach gegen Ambrose“, „Schach960 gegen Ambrose“ (`crossroads-raststaette.varianten_tisch`, 966, je mit einem Ambrose-Satz). Nach dem Abschied müsste die Wahl fehlen oder der Gegner ein anderer sein (Greta, Mabel). Vorschlag: nach dem Abschied „Blindschach gegen Greta“ und „Schach960 gegen Mabel“ mit eigener Begegnung.
   - **Szenen, die um ihn gebaut sind und nachholbar sind:** Das Pinewood Camp ist ein Abstecher (13_Wegenetz), also auch nach dem Finale spielbar: `pinewood-camp-aussen.es_ist_still` (976) und `lagerfeuer_abend` (977) sind Gespräche mit Ambrose, ebenso `weg-crossroads-pinewood.greta_erstes_treffen` (956) und `crossroads-raststaette.kaffeehaus` (912). Vorschlag: Diese vier vor der Abfahrt zur Arena sichern (wie `weg_capital` die Nacht in Ghost Town erzwingt) oder je eine Fassung ohne ihn.
   - **Clubkämpfe und Partiemomente bei Revanchen:** `summit-city-huette.clubkampf_heimweg` und die Momente der anderen Clubs sowie `begegnungen.json` (24 Stellen mit „ambrose“) laufen auch in Revanchen nach dem Finale.
   - **Akt 1 bis 3:** In den Dateien ohne die Variable stehen noch 519 Ambrose-Zeilen (dazu die Hauptszenen von Akt 4); die meisten liegen in Hauptszenen, die nur vor dem Abschied laufen. Sicher nachholbar sind die Ansehen-Knoten, Funde, Rätseltafeln, Seiten, Finch-Figuren und Kreidespringer der Wege, z. B. `weg-desert-summit.earl_regel` (bei jedem Erklären), `earl_k`, `tafel`, `kreide3`, dazu `sternwarte`, `lockport-*`, `ansehen-*`. Ich habe sie nicht geändert (drei Lektoren arbeiten gleichzeitig in diesen Dateien, und der Auftrag nannte die Stellen nach dem Abspann). Vorschlag: eine Prüfung statt Handarbeit, etwa ein Lauf der Gesamtsimulation, der nach dem Abschied alle Orte noch einmal abgeht und jede Zeile mit `#sprecher:ambrose` meldet.
   - **Statistensätze:** 23 Schlüssel `statist.….ambrose` in `texte/de.json` kennen keine Bedingung (App-Thema).
2. **Epilog passt nur zum Remis** (`maple-falls-dachboden`, Dialog 1182): „Du räumst die zwei Könige und den Springer ab.“ Die Arena-Stellen sind seit heute neutral („die Schlussstellung“), der Epilog nicht; nach einem Sieg in der Fernpartie steht anderes auf dem Brett. Datei gehört zu Akt 1, nicht geändert. Vorschlag: „Du räumst die Schlussstellung ab, Figur für Figur, und legst sie in den Geigenkasten.“
3. **Drachenfest zweimal** (781 und 813): Der Brunnen auf dem Marktplatz zeigt das Fest („Am Abend hängen Laternen …“), sobald man ihn antippt, also meist am ersten Tag. Am vierten Abend sagt Ward: „Unten ist heute das Drachenfest“, und nach Hastings steigt das Feuerwerk. Vorschlag: Vor `wardBleibGesehen` zeigt der Brunnen nur die Vorbereitung (Bierbänke, Laternen werden aufgehängt, das Mädchen erklärt den Drachen), das Fest selbst erst danach.
4. **Vorstellung nach dem ersten Auftritt:** Rangerin Bell spricht im Geysirblitz und am Infobrett (871 bis 873), bevor sie sich vorstellt (876). Abe leitet den Weltschachtag und verschenkt die Linse (1066 bis 1071), bevor er sagt, wer er ist (1073); dort steht auch erst „Die Farben kommen zurück, als ihr den See erreicht“, obwohl man schon lange am See ist. Am Lagerfeuer wird Sam gekitzelt (977), die Regel dazu erklärt Ezra erst danach (981). Vorschlag: je ein Merker, der die Vorstellung an den ersten Auftritt bindet; die Zeile mit den Farben in die Ankunft am Seeufer.
5. **Kreidenacht am Turniermorgen** (1096 bis 1099): „Am Morgen steht ihr davor“, dann die „Nacht der Kreidespringer“, dann die Vorrunde. Und Mo sagt am selben Tag: „Victor kommt jetzt jeden Donnerstag“ (1121). Vorschlag: Kreidenacht nur am Vorabend (zwischen Hotel und Morgen) oder nach dem Finale; Mos Satz erst nach dem Abschied.
6. **Vertröstungen an den Wegen:** Drache, Atomschach, Entenschach, Falke und Bison, Drei-Schach, Nebelschach, Königsrennen enden alle mit „heute nicht, nächstes Mal“ (781, 876, 880, 837, 1010, 1170, 773). Das ist der Bauplan (VARIANTE-FEHLT), liest sich aber als Reihe von sieben Absagen. Solange die Varianten fehlen, wären zwei oder drei verschiedene Ausgänge besser (Zuschauen bei einer kurzen Partie wie bei Kira und Juniper, statt „alle Bretter belegt“).
7. **Wiederholte Erklärung mit Ambrose-Kommentar:** `bell_regel`, `ray_regel`, `earl_regel` wiederholen bei „Erklär mir … noch einmal“ auch Ambroses Sätze (876 und 886, 880 und 890, 773 und 778). Das braucht je einen Merker (neue Variable), deshalb nur gemeldet.
8. **Ambrose-Dichte:** In Akt 4 kommentiert Ambrose fast jeden Fund (Bisonhaar, Seite 9, Seite 10, Finch-Dame, Kreide 4, Pfeife, Bergladen, Wegweiser, Viehgatter, Klavier). Vorschlag: ein Drittel streichen, damit die stillen Stellen (Juniper 1010, Leuchtturm 1073) mehr Gewicht haben. Nicht umgesetzt, weil es Geschmack ist.

### 4. Eigenheiten der Lesefassung

- **Wiederholte Erklärungen:** Die Regel „dieselbe Auswahl noch einmal, nächste Antwort“ wählt „Erklär mir … noch einmal“ bei Earl, Bell, Ray, Kira und Ezra zwei- bis dreimal (776/778, 886, 890, 849/861, 992/999); die ganze Erklärung steht dann wieder da. Für die Lesefassung reichte einmal.
- **Hin und zurück:** Der Spieler tritt aus einer Karte und kommt sofort wieder (804/805, 927/928, 965, 988/989, 1049/1050, 1119/1120); die Ankunftssätze stehen dann ohne Reise da und erzeugen Überschriften wie „Hinauf in die Berge“ mitten in Summit City.
- **Kartenname in der Kopfzeile:** Er ist der Standort des Spielers, nicht der des Knotens: `ghost-town-saloon.victor` unter „Ghost Town, Hauptstraße“ (1032, 1047), `crossroads-aussen.ankunft_zu_fuss` unter „Prärie“ (900), `capital-arena-aussen.ankunft_zu_fuss` unter „Leuchtturm“ (1089), `capital-arena-aussen.mama` unter „Turnierhalle“ (1117).
- **Fernbus:** Die Antwort „Maple Falls“ wird gewählt (903), es folgt keine Reise.
- **Halbfinale:** Die Partiemomente fehlen (Turmopfer, „Zusammen“, die Karte Mentor-Zug), weil keine Züge gespielt werden. Damit fehlt der Lesefassung der Höhepunkt von R29; sie zeigt nur den Zweig „nicht gerufen“ (1141) und deshalb den Extra-Abspann (1182). Wünschenswert: die Momente einer Partie als eigene Zeilen, mindestens für Halbfinale und Clubkämpfe.
- **Sprechername:** Mabel heißt durchgehend „Bläserin im Musikhaus“, auch nachdem sie sich vorgestellt hat (1160 bis 1184); „Partie gegen Bläserin im Musikhaus“.
- **Reihenfolge nach dem Abspann:** Der Epilog (1182) steht zwischen Set 2 und Set 3 von Schach960; Odette nennt „14 von fünfzehn“ (1074), bevor die Finch-Jagd als Quest erscheint (1186).
- **Tageszeit:** Der Spieler fasst Tag- und Nachtknoten derselben Karte nacheinander an (1028 „Über Ghost Town steht die Sonne“, 1040 „In der Nacht schlaft ihr im Saloon“); das ist kein Fehler der Geschichte.
- **Wortzahl:** Akt 4 hat nach den Änderungen 16 061 statt 16 132 Wörter, der Teil nach dem Abspann 1 226 statt 1 349.

### 5. Prüfungen

- `python -m pipeline.abenteuer.sprache`: 0 Funde
- `python -m pipeline.abenteuer.inkbesuche`: 0 Befunde
- `python -m pytest -q -k "not chaos" pipeline/tests`: 1596 bestanden, 12 übersprungen
- `cd app && npx vitest run src/abenteuer`: 108 Dateien, 566 Tests bestanden
- `node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1 --sekunden 300`: „Meldungen: keine“, keine nie besuchten Orte, Sammelstränge vollständig. Der erste Lauf brach mit „Compilation failed“ ab (zeitweiliger Fehler durch gleichzeitige Arbeit in einer anderen Datei; jede Ink-Datei einzeln übersetzt: 0 Fehler; Wiederholung ohne Befund).
- Lesefassung neu erzeugt (Scratchpad, `lektor4/neu.md`): nach dem Abspann keine Ambrose-Zeile mehr; die Zeilen vor dem Abschied stehen unverändert da.
- Hinweis für den Haupt-Chat: Die übersetzten Dialoge unter `app/public/abenteuer/dialoge/de/` sind Bauergebnis (`npm run vorbereiten`); ich habe sie nicht neu gebaut. Stand der Ink-Dateien vor meinen Änderungen: Scratchpad `lektor4/vorher/`.

### 6. Nicht gelesen, nicht geprüft

- `akt4.md` habe ich von der ersten bis zur letzten Zeile gelesen (Zeilen 1 bis 4980, in acht Abschnitten), dazu die letzten 150 Zeilen von `akt3.md`.
- In den Ink-Dateien habe ich nur die Knoten gelesen, an denen ich in der Lesefassung gestolpert bin, und alle Ambrose-Zeilen der Akt-4-Dateien mit ihrem Umfeld. Die 102 Knoten, die die Lesefassung nicht erreicht (Niederlagen, Remis, Wartesätze, `halbfinale_zusammen`, `clubkampf_heimweg`), habe ich nicht gelesen.
- Ob ein Knoten nach dem Abschied erreichbar ist, habe ich aus Ink, Story-Bibel und Wegenetz geschlossen, nicht aus `orte.json` und `quests.json` nachgerechnet. Die Bedingung schadet aber nirgends: Vor dem Abschied ist sie immer wahr.
- Die Erzählzeilen nach dem Abschied im Bayou (vier Sätze) sind neu geschrieben und vom Autor nicht gelesen.
- `weg-desert-summit` (gehört zu Akt 3), `maple-falls-dachboden` und alle anderen Dateien von Akt 1 bis 3 außer `port-delacroix-musikhaus` (nur Ambrose-Zeilen): nicht geändert.
- Die Schachangaben der Erinnerung 1866 und des Saloons habe ich gegen das PGN in Abschnitt 35 der Bibel gelesen (stimmen), nicht mit einem Programm nachgespielt. Variantenregeln hat der Prüfbericht vom Vormittag geprüft; ich habe sie nicht wiederholt.
