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
  - Der Lauf begann noch ohne die Korrekturen. Ein zweiter Lauf mit Korrekturen läuft zur
    Bestätigung (Ergebnis in der Meldung an den Hauptchat).
  - Akt 1 hat keinen Laden auf dem Weg. Das Abbrechen eines Ladens kam deshalb nicht vor; es gehört
    in eine eilige Strecke über Akt 2.
- **Schwacher Spieler, quer, Akt 1 und 2**: siehe Meldung an den Hauptchat.

## 4. Grenzen

- Der Doppeltipp auf eine Antwort selbst ist nicht nachgebaut. Antworten tippt der eilige Spieler
  einzeln.
- Die Wache kennt nur die Fenster mit Testkennung. Neue Fenster gehören in `FENSTER` in `wache.ts`.
