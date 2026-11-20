# Eiliger Spieler im Durchlauf (20.11.2026)

Auftrag des Hauptchats vom 20.11.2026, 14:33. Im Spieler-Durchlauf gibt es einen „eiligen“ Spieler.
Gesucht sind Wettläufe, die ein ruhiger Spieler nie auslöst:

- doppelte Dialoge,
- verlorene Rückmeldungen,
- hängende Eingabepausen,
- Meldungen über offenen Fenstern.

Dazu lief der schwache Spieler im Querformat über Akt 1 und 2.

## 1. Der eilige Spieler

Aufruf wie der Durchlauf, dazu `DURCHLAUF_SPIELER=eilig` (Datei `app/tests/durchlauf/eilig.ts`).

| Was er tut                                                                                          | Wie oft                                 | Damit er trotzdem vorankommt                                                                                                         |
| --------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| tippt „Weiter“ sofort, ohne Pause danach                                                            | immer                                   | –                                                                                                                                    |
| tippt „Weiter“ doppelt (15 ms Abstand, an derselben Stelle)                                         | jedes zweite Mal                        | –                                                                                                                                    |
| tippt den Aktionsknopf doppelt (der zweite Tipp landet im neuen Fenster)                            | immer                                   | –                                                                                                                                    |
| nimmt die erste Antwort                                                                             | immer                                   | dieselbe erste Antwort auf dieselbe Frage höchstens zweimal, danach wählt er wie der gewöhnliche Durchlauf (sonst endlose Revanchen) |
| öffnet das Tagebuch und schließt es gleich wieder; jedes zweite Mal tippt er vorher einen Zielpfeil | jeder sechste Weltschritt               | –                                                                                                                                    |
| schließt einen Laden sofort, ohne zu kaufen                                                         | erster Besuch je Laden                  | beim nächsten Besuch kauft er                                                                                                        |
| läuft nach einem Kartenwechsel sofort zurück durch den Eingang                                      | jede zweite neue Karte, je Karte einmal | –                                                                                                                                    |

Die Wache (`app/tests/durchlauf/wache.ts`) liegt in jedem Durchlauf, auch beim ruhigen und beim
schwachen Spieler. Sie beobachtet die Seite im Browser bei jeder Änderung (MutationObserver), sieht
also auch, was zwischen zwei Lesungen des Durchlaufs kurz falsch steht. Sie meldet diese Funde:

- `doppelterDialog`: zwei Gesprächsfenster zugleich.
- `dialogZweimal`: ein Gespräch beginnt innerhalb von 2 s mit derselben Zeile wie das eben
  beendete, ohne Eingabe des Spielers dazwischen (Aktionsknopf, Steuerkreuz, Taste).
- `meldungUeberFenster`: die Meldungsleiste über einem offenen Fenster (Dialog, Tagebuch, Laden,
  Reisen, Kartenwahl, Vorführung, Gedächtnisstellung, Ergebniskarten).
- `haengendePause`: „Weiter“ ist länger als 8 s gesperrt. Die längste Pause im Spiel sind 3 s.

Verlorene Rückmeldungen meldet wie bisher `rueckmeldung.ts`.

## 2. Funde und Korrekturen

| Fund                                                                      | Wo                                                                                                                                                                         | Ursache                                                                                                                                                   | Korrektur                                                                                                                          | Test                                                                                                            |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Doppeltipp auf „Weiter“ wählt eine ungelesene Antwort                     | Jo im Park: Nach dem Sieg kam „Holst du eine?“ und gleich danach eine neue Partie. Die Zeile mit den Wahlen („Ich hol eine.“ / „Erst noch eine Partie.“) war nie zu sehen. | Der erste Tipp bringt die Wahlen. Der zweite trifft die Antwort, die jetzt dort liegt, wo „Weiter“ war. Mit der Tastatur geht dasselbe (zweimal Eingabe). | Neue Wahlen sind 300 ms lang gesperrt, wie „Weiter“ bei einer Pause (`dialog/wahlschutz.ts`). Den Fokus setzt die App erst danach. | `tests/e2e/abenteuer-doppeltipp.spec.ts`, geprüft an Mamas erstem Abend. Ohne Schutzzeit schlägt der Test fehl. |
| `meldungUeberFenster`: „Neu im Tagebuch: Limo für Jo“ über der Kartenwahl | Jo im Park                                                                                                                                                                 | Die Meldungsleiste wich nur Dialog und Ergebniskarten aus. Die Kartenwahl, das Tagebuch, der Laden und Reisen lagen darunter.                             | Die Meldung wartet, bis kein Fenster mehr offen ist (`Oberwelt.tsx`, `fensterOffen`).                                              | Kein eigener Test. Die Wache meldet es in jedem Durchlauf.                                                      |
| Steuerkreuz unter dem Bildschirmrand                                      | Schwacher Spieler quer, Cedar Creek, Bibliothek                                                                                                                            | Der Hinweis „Neue Version“ stand im Fluss der Seite und schob im Querformat alles nach unten (derselbe Grund wie früher beim Safari-Hinweis).             | Im Spiel (Vollbild) liegt der Hinweis als Leiste über dem Bild (`basis.css`, `.rahmen-vollbild .update-hinweis`).                  | Kein automatischer Test: Der Hinweis lässt sich im Oberflächentest nicht auslösen.                              |
| `dialogZweimal` an der umgestürzten Zeder                                 | Park                                                                                                                                                                       | Fehlalarm: Der Durchlauf lief selbst ein zweites Mal in den gesperrten Durchgang.                                                                         | Die Wache zählt jetzt auch Steuerkreuz und Pfeiltasten als Eingabe des Spielers.                                                   | –                                                                                                               |

## 3. Strecken

- **Eiliger Spieler, hochkant, Akt 1** (Start bis Akt 2): 38 Minuten.
  - 62 Hast-Aktionen: 56 Mal Tagebuch auf und zu (31 Mal mit Zielpfeil), 6 Mal sofort zurück
    durch die Tür.
  - 23 Rückmeldungen nach Ergebnis, keine verloren.
  - Keine doppelten Dialoge, keine hängende Pause.
  - Der Lauf begann noch ohne die Korrekturen.
  - Den Kiosk im Park besuchte dieser Lauf nicht.
- **Eiliger Spieler, Bestätigung mit Korrekturen** (eigenes Profil, Start bis Akt 2, in fünf
  Etappen wegen der Korrekturen am Durchlauf):
  - 0 Funde.
  - 75 Hast-Aktionen: 67 Mal Tagebuch auf und zu (36 Mal mit Zielpfeil), 8 Mal sofort zurück
    durch die Tür.
  - 134 Partien, die meisten davon in den Schleifen gegen Nia (siehe unten).
  - 141 Rückmeldungen nach Ergebnis, keine verloren.
  - Im Kiosk hat er gekauft statt abzubrechen. „Schließen“ lag im Hochformat unter den Waren,
    außerhalb des Bildes; der Abbruch verfiel. Jetzt rollt er hin (`schliesseLaden` in eilig.ts).
    Im Browser noch nicht bestätigt; das zeigt die nächste eilige Strecke.
  - Unterwegs hing der Lauf mehrmals an Fehlern des Durchlaufs, nicht des Spiels (folgende
    Punkte).
  - Endlose Revanche gegen Nia, zwei Ursachen:
    - Die erste Antwort des Eiligen stand nicht im Antwortgedächtnis, danach galt „Noch eine.“
      wieder als neu. Jetzt vermerkt `merkeWahl` (fenster.ts) auch seine Antworten.
    - War die Alternative („Ich muss weiter.“) einmal gewählt und gab es keinen echten Aufschub,
      nahm `waehleAntwort` als Ersatz wieder die Wiederholung, endlos. Jetzt kommt eine gewählte
      Wiederholung nur noch in Frage, wenn es nichts anderes gibt; „ich muss weiter“ zählt als
      Aufschub.
    - Die zweite Korrektur nahm danach am Bus in Cedar Creek immer „Mit dem Busfahrer reden“.
      Jetzt nimmt `waehleAntwort` ohne Aufschub die am seltensten gewählte Antwort; „noch
      bleiben“ zählt als Aufschub.
    - Tests in `fenster.test.ts`, alle drei schlagen ohne die jeweilige Korrektur fehl. Die Einordnung der
      Antworten steht jetzt in `antworten.ts` (Größengrenze von fenster.ts).
  - 26 Minuten „Jetzt aktualisieren“ ohne Wirkung. Das begann 15:52, kurz nach einem Neubau von
    `app/dist` mitten im Lauf. Mit demselben Profil und einer echten neuen Fassung lädt der Knopf
    sofort neu (geprüft im Hochformat mit dem neuen Stil). Wahrscheinlich hat der Lauf einen halb
    gebauten Stand erwischt; bei Lesern kommt das nicht vor. Nicht behoben. Regel für Läufe:
    `dist` nicht neu bauen, solange ein Durchlauf läuft.
- **Schwacher Spieler, quer, Akt 1 und 2** (Start bis Akt 3): 1 Stunde 43 Minuten.
  - 28 Partien: 12 Niederlagen, 14 Siege, 2 verlassen.
  - 59 Schwächen: 15 Mal Partie oder Runde verlassen, 9 Mal mitten im Gespräch neu geladen,
    7 Fortsetzungskarten, 3 Mal aufgegeben, dazu falsche Züge und abgebrochene Runden.
  - 40 Rückmeldungen nach Ergebnis, keine verloren.
  - Die neue Einleitung mit Mama und die Erzählzeilen (Treppe am Abend) liefen ohne Fund.
  - Funde:
    - Steuerkreuz unter dem Rand durch den Hinweis „Neue Version“ (behoben, siehe Abschnitt 2).
    - „Haustür reagiert nicht“: Last, nicht das Spiel. Die Karte wechselte kurz nach der Frist,
      während Build, Oberflächentests, Simulation und zwei Durchläufe zugleich liefen.
  - Den Zielpfeil im Tagebuch prüft der schwache Spieler nicht; das tut der eilige Spieler.

## 4. Akt 3 und 4 (zweiter Auftrag, 20.11.2026 abends)

Der eilige Spieler lief ab dem simulierten Beginn von Akt 3 (aktstand.cjs) bis Akt 4, dann ab dem
Beginn von Akt 4 bis zum Abspann, je hochkant und quer.

| Strecke        | Dauer            | Partien | Hast                            | Rückmeldungen      |
| -------------- | ---------------- | ------- | ------------------------------- | ------------------ |
| Akt 3 hochkant | 49 min           | 21      | 89, davon 3 Mal Laden sofort zu | 34, keine verloren |
| Akt 3 quer     | 3 Etappen, s. u. | 25      | 240 (viele im Kreis)            | 36, keine verloren |
| Akt 4 hochkant | 41 min           | 24      | 69, davon 5 Mal Laden sofort zu | 23, keine verloren |
| Akt 4 quer     | 38 min           | 23      | 71, davon 5 Mal Laden sofort zu | 22, keine verloren |

Revanchen (6 bis 7 je Strecke) und Erinnerungen (Siedlung, Hütte) liefen ohne Fund.

Spielfehler, behoben:

- **Meldung unter dem Abspann:** Am Ende von Akt 4 lag eine Meldung unter dem Abspann, ihr
  „Weiter“ war verdeckt (beide Formate).
  - Korrektur: Der Abspann zählt zu den offenen Fenstern, die Meldung wartet (`Oberwelt.tsx`).
  - Prüfung: Die Wache kennt den Abspann jetzt.
- **Kaputte Porträts:** Owen Fisk und Ivy zeigten im Abspann kaputte Bilder.
  - Ursache: Für eine fehlende Paketdatei liefert der Server die Startseite (HTML, Status 200).
  - Korrektur: `liesPaketdatei` behandelt das jetzt wie 404.
  - Tests: `startseite.test.ts` und `abenteuer-quertext.spec.ts`; der zweite schlug vorher mit
    einem kaputten Porträt fehl.
  - Offen: Owen Fisk und Ivy haben kein Porträt im Paket. Das ist eine Lücke im Bildmaterial
    (Meldung an den Hauptchat).

Fehler im Durchlauf, behoben mit Tests (`planer.test.ts`):

- **Pendeln zwischen Felsbogen und Desert Springs (162-mal).**
  - Erste Ursache: Die Kreiserkennung zählte je vollständigem Stand, und Übergangsdialoge und
    Zielpfeile ändern ihn bei jedem Durchgang. Jetzt zählt zusätzlich ein grober Zähler je
    Queststand (Schwelle 20).
  - Zweite Ursache: Der Planer zog den Beginn des Epilogs der laufenden Nebenquest „Der Brief“
    vor. Auf diese Nebenquest wartet der Clubkampf gegen Mira. Spätere Anfänge stehen jetzt
    hinter den Nebenquests.
- **Zugerraten im Halbfinale:**
  - Das Spiel nimmt dort nur den gesuchten Zug an, das ist gewollt.
  - Der Durchlauf tippte immer wieder seinen eigenen Zug; die Partie stand 120 s.
  - Jetzt probiert er je Stellung die übrigen Kandidaten.
- **Fehlalarme der Prüfwerkzeuge:**
  - Die Randprüfung kannte kein waagerechtes Rollen. Der Kartenfächer der Kartenwahl zeigt
    absichtlich 3¼ Karten.
  - Die Wache meldete Bretter, die die Seite am Rundenende aus dem Bild rollt; jetzt nur noch
    Bretter, die sich durch Rollen nicht ins Bild holen lassen.

Beobachtung für den Autor (kein Fehler im Code):

- In Desert Springs zeigt der Zielpfeil der Hauptquest auf Mira. Mira sagt dann „Dot sagt, du
  sollst erst zu Mr. Okoro.“
- Der Weg führt also über die Nebenquest „Der Brief“, deren Pfeil im Tagebuch eigens steht.
- Wer nur dem Hauptpfeil folgt, wird einmal weitergeschickt.

## 5. Grenzen

- Der Doppeltipp auf eine Antwort selbst ist nicht nachgebaut. Antworten tippt der eilige Spieler
  einzeln.
- Die Wache kennt nur die Fenster mit Testkennung. Neue Fenster gehören in `FENSTER` in `wache.ts`.
