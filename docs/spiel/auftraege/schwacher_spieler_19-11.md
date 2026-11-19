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

1. **Revanche um eine bessere Nadel ohne Reaktion (behoben, alle acht Clubs).** Mira hatte schon
   eine Nadel; der Held verlor die Revanche, und danach kam nur ein Alltagssatz („Im Canyon
   antwortet das Echo …“). Dasselbe galt für Remis und für einen Sieg ohne bessere Nadel, in
   allen Clubs mit „Revanche um eine bessere Nadel?“ oder „Noch eine Partie um die Nadel.“. Die
   Gesamtsimulation verliert nie eine Revanche und sah es nicht. Jetzt setzt die Revanche
   `revanche<Ort>`, und die Weiche des Clubchefs führt nach der Partie in `<chef>_nach_revanche`:
   ein Satz zu Sieg, Remis oder Niederlage („Diesmal nicht. Deine Nadel behältst du natürlich.“),
   dann „Noch einmal.“ oder „Später.“. Bei Miss Odile gilt die Revanche erst mit „Ich bin
   bereit.“ als begonnen; sonst hätte ein „Noch nicht.“ den Schalter stehen lassen. Test:
   `dialog/revanche.test.ts` (48 Fälle).
2. **Remis in Stellungsduell und Endspiel galt als Sieg (behoben, zwölf Begegnungen).** Im
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
3. **Musikhaus-Sätze nach der Eröffnung** (Abschnitt 1).
4. **Werkstatt-Flashback zu lang** (Abschnitt 1).

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

Wird nach den Läufen ergänzt.
