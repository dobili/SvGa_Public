# Schwacher Spieler im Spieler-Durchlauf (Nachtauftrag 19.11.2026)

Auftrag des Hauptchats: die Grenzen des Spieler-Durchlaufs schließen. Fables Löser spielt
stärker als ein Leser mit 1200 und verliert nie; Niederlagen, Wiedereinstieg und Notausgänge
wurden deshalb nie im Browser gespielt. Dazu zwei Beobachtungen von Fable nachprüfen: Henris
Werkstatt (Aufgabe falsch gelöst) und das Musikhaus von Port Delacroix (vier Figuren ohne
Aktionsknopf).

**Kurz:** Stand wird nach den Läufen ergänzt (Abschnitt 4).

## 1. Fables Beobachtungen

- **Henris Werkstatt (Spielfehler, behoben).** Die Aufgabe ist Zugerraten der Unsterblichen
  Partie (Anderssen–Kieseritzky, London 1851); die Züge in `klassiker.json` stimmen. Laut
  Story-Bibel (Szene 66) gilt der Flashback nur für Zug 1 bis 11. In `runden.json` fehlte das
  Ende: Man riet alle 23 Züge, auch den Schluss, den der Flashback in Riverton schon zeigt, und
  brauchte für das Bestehen 12 Treffer statt 6. Neu: `erinnerung.bisZug` (Schema, Schnittstelle,
  `anbindung/erinnerung.ts`, Test `erinnerung.test.ts`); die Werkstatt hat `bisZug: 11`. Der
  Durchlauf rät solche Partien weiter mit der Engine und trifft deshalb selten; das ist eine
  Grenze des Durchlaufs, kein Fehler der Aufgabe.
- **Musikhaus (kein Spielfehler).** Die neue Ansprechprobe (`tests/durchlauf/ansprechprobe.spec.ts`)
  geht im Browser zu jeder Figur einer Karte und prüft den Aktionsknopf. Im eröffneten Musikhaus
  (`musikhausOffen`) haben Miss Odile, Henri, Remy und Lou einen Knopf und sprechen. Fables
  Meldung war ein Fehler des Durchlaufs. Dabei fiel auf: Remy, Lou und Henri sprachen dort noch
  von der kommenden Eröffnung („Komm zur Eröffnung … du hängst das Schild auf“). Sie haben jetzt
  eigene Sätze für die Zeit nach der Eröffnung.

## 2. Der schwache Spieler

`DURCHLAUF_SPIELER=schwach` (`tests/durchlauf/schwach.ts`, Test `schwach.test.ts`): Der Spieler
verliert den ersten Versuch jeder Partie und jeder Aufgabenrunde und spielt den zweiten wie der
gewöhnliche Durchlauf. Die Wegsperre S17 verliert er dreimal; der dritte Fehlversuch öffnet sie
(Notausgang). Die Art des Verlierens wechselt reihum, damit jede Art im Browser vorkommt:

| Partie                                                  | Runde                                                                  |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| schwächster Zug bis zum Ende                            | schwächster Zug, dann „Ich komme nicht drauf“                          |
| nach vier eigenen Zügen „Aufgeben“                      | ab Aufgabe 2 Zurück-Taste, auf der Fortsetzungskarte „Runde abbrechen“ |
| nach vier eigenen Zügen Neuladen, dann weiterspielen    | ab Aufgabe 2 Neuladen, dann weitermachen                               |
| nach vier eigenen Zügen Zurück-Taste, „Partie aufgeben“ |                                                                        |

Dazu prüft `tests/durchlauf/rueckmeldung.ts` nach jeder Partie und Runde, die ein Dialog gestartet
hat, ob danach der Dialog wieder aufgeht (Rückmeldung nach dem Ergebnis); das Protokoll hat je
Rückmeldung eine Zeile „RÜCKMELDUNG nach …“ mit dem ersten Satz.

Aufruf wie der Durchlauf, mit `DURCHLAUF_SPIELER=schwach`; für S17 ab dem simulierten Stand am
Ende von Akt 3 (`node pipeline/abenteuer/aktstand.cjs --akt 4 --ziel /tmp/akt4.json`,
`DURCHLAUF_STAND=/tmp/akt4.json`).

## 3. Funde

1. **Neuladen mitten in Ambroses Abschied nahm das Spielende weg (behoben).** Der schwache Spieler
   lädt etwa alle 40 Dialogzeilen mitten im Gespräch neu. Auf der Treppe vor der Arena traf es
   Ambroses Rede („Ich muss dir etwas sagen.“). Danach sagte die Treppe nur noch „Auf der Treppe
   vor der Arena ist es still geworden.“: kein Abspann, keine Reise auf den Dachboden, kein
   Zielhinweis. Ursache: `abschiedGesehen` stand am Anfang der Szene, und die App sichert die
   Variablen bei jedem neuen Knoten (Chaos-Befund vom 14.11.), während Abspann und Reise erst am
   Ende des Gesprächs kommen. Der Questschritt war schon mit dem ersten Knoten erledigt. Jetzt
   setzt erst `abschied_ende` den Schalter, und der Questschritt hängt an `abschied_ende`; nach
   einem Neuladen beginnt der Abschied von vorn. Test: `dialog/abschied.test.ts`. Geprüft habe ich
   alle Szenen, in denen ein solcher Schalter vor einer Reise, einem Abspann, einer Partie oder
   einer Runde in einem späteren Knoten steht: Bei allen anderen führt die Weiche nach dem
   Neuladen wieder zur Folge (London, Bus nach Silicon Bay, Oma Ruth, Mamas Foto) oder die Folge
   ist eine Abkürzung mit „Noch nicht“ (Aufbruch nach Ironwood, Heimfahrt aus Riverton) oder ein
   Angebot, das die Weiche wieder anbietet (erstes Treffen, dann Partie oder Runde).
   Im Browser bestätigt mit der neuen Neuladeprobe (`tests/durchlauf/neuladeprobe.spec.ts`, Stand
   von `aktstand.cjs --bis finaleBesprochen`): Neuladen bei „Ich muss dir etwas sagen“, danach
   beginnt der Abschied mit „Der Abend ist lang und golden …“, und der Abspann erscheint.
2. **Revanche um eine bessere Nadel ohne Reaktion (behoben, alle acht Clubs).** Mira hatte schon
   eine Nadel; der Held verlor die Revanche, und danach kam nur ein Alltagssatz („Im Canyon
   antwortet das Echo …“). Dasselbe galt für Remis und für einen Sieg ohne bessere Nadel, in
   allen Clubs mit „Revanche um eine bessere Nadel?“ oder „Noch eine Partie um die Nadel.“. Die
   Gesamtsimulation verliert nie eine Revanche und sah es nicht. Jetzt setzt die Revanche
   `revanche<Ort>`, und die Weiche des Clubchefs führt nach der Partie in `<chef>_nach_revanche`:
   ein Satz zu Sieg, Remis oder Niederlage („Diesmal nicht. Deine Nadel behältst du natürlich.“),
   dann „Noch einmal.“ oder „Später.“. Bei Miss Odile gilt die Revanche erst mit „Ich bin
   bereit.“ als begonnen; sonst hätte ein „Noch nicht.“ den Schalter stehen lassen. Test:
   `dialog/revanche.test.ts` (48 Fälle).
3. **Remis in Stellungsduell und Endspiel galt als Sieg (behoben, zwölf Begegnungen).** Im
   Browser: Endspiel bei Sol (König und Bauer gegen König, „gewinnen“), der Bauer ging verloren,
   Ausgang remis. Sol sagte „Gewonnen, und keine Sekunde Panik.“ und gab die Karte „Kühler Kopf“.
   Ursache: Die Weiche fragte nur „niederlage“ ab, alles andere ging in `sol_nach_sieg`. Im
   Stellungsduell und im Vorteil herausarbeiten (R13, R13b) und im Endspiel „gewinnen“ (R13a)
   ist ein Remis ein eigener Ausgang (Vorteil unter dem Mindestvorteil), für einen Leser mit 1200
   sogar häufig. Betroffen waren Rosa, Buck, Gus, Skater Jo, Hollis, Batiste, Harlan, Dash, Sol,
   Mr. Quinn, die Joggerin und Nia. Jetzt hat jede Weiche einen Zweig `…_nach_remis` mit einem Satz
   der Figur und denselben Wahlen wie nach der Niederlage (Revanche, Nicht jetzt); Karten gibt es
   weiter nur für den Sieg. Dauerprüfung: `pipeline/tests/test_abenteuer_remisweiche.py` (jede
   Weiche einer Begegnung, die remis enden kann und die Niederlage abfragt, fragt auch das Remis
   ab). `rueckmeldung.cjs` hatte das durchgelassen, weil es nur prüft, dass ein Zweig den Ausgang
   abfragt, nicht, ob es der richtige ist.
4. **Ambrose schwieg nach dem verlorenen Clubkampf (behoben, sechs Clubs).** Im Browser sprach
   nach den Niederlagen in Maple Falls und Cedar Creek nur der Clubchef; Ambroses Satz in Maple
   Falls kam erst nach dem Sieg. Jetzt sagt Ambrose in Maple Falls, Cedar Creek, Riverton,
   Ironwood, Desert Springs und Summit City nach dem verlorenen Clubkampf einen Satz zur Partie
   (Silicon Bay hatte schon einen; in Port Delacroix schweigt er nach der Geschichte). Nach dem
   Abschied schweigt er. Dabei gefunden: Sein Satz in Silicon Bay hatte keine Bedingung und wäre
   auch nach dem Abschied gekommen. Test: zweiter Teil von `dialog/revanche.test.ts`.
5. **Musikhaus-Sätze nach der Eröffnung** (Abschnitt 1).
6. **Werkstatt-Flashback zu lang** (Abschnitt 1).

Fehler des Durchlaufs, die der schwache Spieler aufdeckte (behoben):

- Seit der Rückmeldung nach dem Ergebnis fragt Mr. Batiste nach einem Sieg „Noch eine Partie.“;
  der Durchlauf zählte diese Antwort je Spielstand und spielte endlos gegen ihn. Behoben ist das
  mit der Lösung von mittel-1 auf `beta` (Wiederholungen wählt er je Frage nur einmal); meine
  gleichwertige Fassung ist beim Zusammenführen entfallen.
- Nach „Ambrose fragen“ wird die Hilfe länger, und „Ich komme nicht drauf“ liegt im Hochformat
  unter dem Bildrand. Der Durchlauf sah nur das Bild und zog zehn Minuten lang falsche Züge; jetzt
  rollt er hin wie ein Mensch. Für einen Menschen ist das kein Hindernis (Rollen), aber eine
  Beobachtung: Der Knopf zum Aufgeben ist nach der Hilfe nicht mehr zu sehen.
- Die Kennung einer Partie trägt die Partie („mapleFalls.ersteLektion#mwo0…“); der schwache
  Spieler zählte deshalb jeden Versuch als ersten.
- Partien mit fester Zugzahl: Das Ende stand erst nach dem Bildwechsel im Speicher; der Durchlauf
  meldete „offen“. Er liest jetzt nach dem Ende noch einmal.

## 4. Im Browser gesehen

Zwei Strecken im Hochformat (Pixel 7), Chromium, gebauter Stand, schwacher Spieler:

- **Strecke 1** vom neuen Spiel: Akt 1 ganz, dann Akt 2 (läuft weiter).
- **Strecke 4** ab dem simulierten Stand am Ende von Akt 3 (Desert Springs): Wüste, Wegsperre S17,
  Summit City.

Was jeweils geschah (Auszug; jede Zeile ein erster Versuch, der zweite gewann oder bestand):

| Begegnung                              | Wie verloren                           | Danach (erste Zeile der Rückmeldung)                                                                                     |
| -------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Erste Lektion (Ambrose)                | schwache Züge, matt                    | Ambrose: „Verloren. Gut. Jetzt weißt du, was du lernen willst.“                                                          |
| Clubkampf Maple Falls                  | aufgegeben nach vier Zügen             | Coach Delgado: „Das war nichts für heute. …“ (Ambrose: siehe Fund 4)                                                     |
| Victor (Maple Falls)                   | neu geladen mitten in der Partie, matt | Szene mit Victor, Graham Hale und Juno ganz                                                                              |
| Skater Jo, Rosa                        | Zurück-Taste, „Partie aufgeben“        | keine Rückmeldung (gewollt), Angebot beim nächsten Ansprechen                                                            |
| Nia (Landstraße)                       | aufgegeben                             | Nia: „Board tragen! War nur Spaß. Noch eine Runde?“                                                                      |
| Clubkampf Cedar Creek                  | schwache Züge, matt                    | Mrs. Okafor: „Diesmal nicht. Aber du hast lange gehalten. …“                                                             |
| Wegsperre S15 (Zedernwald)             | verloren, dann remis                   | Zoe: „Datenpunkt 4113. Danke.“, nach dem Remis lässt Benji durch                                                         |
| Clubkampf Riverton                     | aufgegeben                             | Slick (Fund 4: Ambrose ergänzt)                                                                                          |
| Mama (Ironwood)                        | neu geladen, matt                      | „Ihr habt zu Ende gespielt. Mama hat gewonnen. …“                                                                        |
| Batiste, Buck                          | schwache Züge, neu geladen             | Batiste: „Junge Leute reden. …“, Buck: „Zu langsam an der Zapfsäule! …“                                                  |
| Clubkampf Desert Springs (Revanche)    | aufgegeben                             | nur Alltagssatz (Fund 2, behoben)                                                                                        |
| Wegsperre S17 (Diner)                  | dreimal matt                           | Zoe: „Das zähle ich nicht mehr. …“, beim dritten Mal „Dreimal ehrlich versucht. Das reicht uns. Geh durch.“ (Notausgang) |
| Sol (Summit City)                      | Bauer verloren, remis                  | „Gewonnen, und keine Sekunde Panik.“ (Fund 3, behoben)                                                                   |
| Victor (Bergstation)                   | schwache Züge, matt                    | „Wer gewonnen hat, ist nicht wichtig. Victor sieht leichter aus als vorher.“                                             |
| Clubkampf Summit City                  | schwache Züge, matt                    | Großmeisterin Ward: „Verloren. Und? Hast du gesehen, wo?“                                                                |
| Abschied auf der Treppe (kein Verlust) | neu geladen mitten in Ambroses Rede    | danach nur „Auf der Treppe … still geworden“ (Fund 1, behoben)                                                           |

Runden: Sam, Juno, Lily, Dex, Mae, Tamsin, Ray, Hank, die Tafeln an der Landstraße und am Diner,
Kit: jeweils erst 0 Punkte, abgebrochen oder neu geladen, dann bestanden. Nach jeder bestandenen
Runde kam die Reaktion der Figur.

Wiedereinstieg und Neuladen:

- Neuladen mitten in einer Partie: Die App öffnet die Partie sofort wieder (keine
  Fortsetzungskarte); weiterspielen geht.
- Neuladen mitten in einer Runde: Die App öffnet die Runde wieder und macht bei der nächsten
  offenen Aufgabe weiter (Zwischenstand, R5).
- Zurück-Taste mitten in Partie oder Runde: In der Welt steht die Fortsetzungskarte; „Partie
  aufgeben und in der Stadt bleiben“ und „Runde abbrechen“ beenden ohne Rückmeldung, die Figur
  bietet beim nächsten Ansprechen wieder an.
- Nach jeder Niederlage ging es weiter; Strecke 1 kam mit allen Verlusten durch Akt 1 in Akt 2.

Neuladen mitten im Gespräch (bisher 22 Fälle in drei Strecken): Außer dem Abschied (Fund 1)
begann jede Szene beim nächsten Ansprechen wieder oder war reine Kulisse; nichts kam doppelt
(keine Meldung „Gefunden“ oder „Neu im Tagebuch“ zweimal). Dazu ein behobener Fall: Lud man
mitten in einer Rückmeldung nach dem Ergebnis neu (Victor in Silicon Bay nach der Auswertung, „Das
ist falsch.“), ging sie danach nicht wieder auf; sie kam erst, wenn man die Figur ansprach, und
kein Zielhinweis zeigte dorthin. Jetzt merkt der Spielstand die offene Rückmeldung
(`rueckmeldungOffen`) bis zum Ende des Gesprächs, und die Oberwelt öffnet sie nach dem Neuladen
wieder (`oberwelt/nachergebnis.ts`, `useOffeneRueckmeldung`). Test: `nachergebnis.test.ts` und im
Browser `tests/e2e/abenteuer.spec.ts` (Neuladen in Ambroses Rückmeldung nach der ersten Lektion).

Halbfinale: Nach Ambroses Moment („Dieser Zug, Kim.“) nahm das Brett Dd1–f3 dreimal nicht an,
und der Durchlauf meldete „Zug kommt nicht an“. Das ist das gewollte Zugerraten (Story-Bibel,
Szene 106): beliebig viele Versuche, nach drei Fehlversuchen ein Hinweis. Danach fand er den Zug
und gewann.

Fehler des Durchlaufs (kein Spielfund): „Übergang unerreichbar“ an der Bergstraße (alte Kachel
nach dem Kartenwechsel, wie schon am 18.11.), „kein Aktionsknopf“ am Flohmarkt (der Held stand
nach dem Gespräch noch auf dem Auslöser, der erst nach einem Schritt herunter wieder zählt), und
nach einem Abbruch wählte er bei Kit nur noch „Nicht jetzt“ (behoben: Nach dem Abbruch gelten die
Antworten wieder als neu).

## 5. Nachtrag 20.11.2026: Reaktionen aus dem Lektorat von mittel-1

mittel-1 fand beim Lesen der Lesefassung Stellen, an denen nach einer Partie oder Runde keine
Reaktion auf das Ergebnis kam, die `rueckmeldung.cjs` aber nicht meldete. Behoben:

- Kreidenacht: Mo sagt vor Runde zwei und drei etwas zur vorigen Runde, und bei Victors Kapuze
  geht die Erzählung auf die dritte Runde ein.
- Mabel: Nach dem Sieg in Set 2 ein eigener Satz; nach einem verlorenen Set folgt auf „Noch
  einmal?“ jetzt die Wahl „Noch einmal.“ oder „Nicht jetzt.“ (vorher Ende ohne Wahl).
- Greta: Ihr erster Satz hängt am Ausgang (vorher Zufallssätze, auch nach einer Niederlage).
- Jo: Er ist pleite und gibt nach seiner Niederlage keine Limo mehr aus.
- Buck: Er reagiert auf den Sieg statt auf einen Moment der Partie, den es nicht gab.
- Slick: Den Montag im Pavillon gibt es einmal; danach sitzt er auf der Treppe.

Warum das Werkzeug sie nicht fand, und was jetzt gilt:

1. Eine „Kaskade“ (der Zweig nach einer nicht genommenen Ausgangsabfrage) zählte auch dann, wenn
   die Abfrage nur „noch nicht gespielt“ war (`== ""`, `"abgebrochen"`), und auch, wenn sie nur
   zum nächsten Angebot weiterging (`mo_runde1` → `mo_runde2`, `blaeser_set2` → `blaeser_set3`).
   Beides zählt nicht mehr.
2. Die Kopfzeile einer Fallunterscheidung (`{ausgang…Set2:`) zählte allein als Reaktion. Jetzt
   muss der Fall zum Ausgang Text haben; ein einfacher Bedingungsblock zählt nur, wenn seine
   Bedingung zum Ausgang passt.
3. Eine passende Weiterleitung zählte auch, wenn sie nur in eine Weiche führte. Jetzt nicht mehr.
4. Neu: Endet eine Rückmeldung mit einer Frage nach einer neuen Partie oder Runde („Noch einmal?“)
   ohne Wahl, ist das ein Fund (die Simulation liefert dafür die letzte Zeile).

Damit fand das Werkzeug weitere Stellen, alle behoben:

- Céleste nach ihrem Sieg
- die Lore in der Goldmine und zehn Rätseltafeln an den Wegen nach einem Fehlversuch
- Lilys „Zeig's mir nochmal, ja?“ ohne Wahl
- Hastings 1895 ohne Bestehen (neue Rückmeldung `hastings_danach`)

Damit Tafeln einen Fehlversuch erkennen, setzt die App nach jeder gespielten Runde
`<name>Versucht` und `<ort><Name>Versucht`, auch ohne Bestehen (`regeln/dialogvariablen.ts`, in der
Gesamtsimulation ebenso). Stand: 0 Funde. Jo, Buck und Greta waren Textfragen, die kein Werkzeug
erkennt.
