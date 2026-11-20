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
  - Akt 1 hat keinen Laden auf dem Weg. Das Abbrechen eines Ladens kam deshalb nicht vor; es gehört
    in eine eilige Strecke über Akt 2.
- **Eiliger Spieler, Bestätigung mit Korrekturen**: Ergebnis in der Meldung an den Hauptchat.
  Unterwegs hing der Lauf zweimal an Fehlern des Durchlaufs, nicht des Spiels:
  - Endlose Revanche gegen Nia: Die erste Antwort des Eiligen stand nicht im Antwortgedächtnis,
    danach galt „Noch eine.“ wieder als neu. Jetzt vermerkt `merkeWahl` (fenster.ts) auch seine
    Antworten; Test in `fenster.test.ts`. Die Einordnung der Antworten steht jetzt in
    `antworten.ts` (Größengrenze von fenster.ts).
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

## 4. Grenzen

- Der Doppeltipp auf eine Antwort selbst ist nicht nachgebaut. Antworten tippt der eilige Spieler
  einzeln.
- Die Wache kennt nur die Fenster mit Testkennung. Neue Fenster gehören in `FENSTER` in `wache.ts`.
