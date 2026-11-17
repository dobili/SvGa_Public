# Vortest der Testpunkte in `docs/AUFGABEN_AUTOR.md`, 17.11.2026

Ziel: Der Autor soll nur noch prüfen müssen, was eine Maschine nicht prüfen kann. Claude geht die
offenen Punkte von oben nach unten durch und stellt nach, was sich mit Playwright in Handygröße
nachstellen lässt.

## So geprüft

- Stand: Zweig beta (d3bb7ceb), `npm run build`, Chromium (Projekt „android-chromium“, Handygröße),
  ohne die echte Grafik des Abenteuers.
- Beleg sind die e2e-Tests in `app/tests/e2e` (Datei und Testname). Bildschirmfotos nur lokal.
- Ergebnisse:
  - **BESTANDEN**: Ablauf und sichtbares Ergebnis wie beschrieben. Gibt es Teile, die kein Test
    abdeckt, nennt die Zeile in `AUFGABEN_AUTOR.md` sie unter „nicht geprüft“.
  - **FEHLER**: Abweichung.
  - **NUR AUTOR**: Gefühl, Lesbarkeit, echtes Gerät, Ton, Geschmack.
  - **OFFEN**: Wäre nachstellbar, ist aber in diesem Durchgang nicht vorgeprüft (Zustand aufwendig,
    etwa viele ausgewertete Partien). In `AUFGABEN_AUTOR.md` steht dazu nichts.
- In `AUFGABEN_AUTOR.md` ist nichts abgehakt oder gelöscht. Bei BESTANDEN steht am Ende des Punktes
  „Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße)“, bei FEHLER „Vorgeprüft:
  Abweichung …“.

## Paket 1: N2616 bis N2573 (40 Punkte)

| Nummer | Ergebnis  | Beleg/Foto                                                                                        | Hinweis                                                                                                   |
| ------ | --------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| N2616  | NUR AUTOR | –                                                                                                 | Offen ist nur Delgados „überheblich“ und ob er spürbar lockerer spielt; der Rest ist am 15.11. geprüft.   |
| N2620  | NUR AUTOR | –                                                                                                 | Karten in echten Partien und Sams Karte nach der Todsünden-Runde; Läden am 15.11. geprüft.                |
| N2621  | NUR AUTOR | –                                                                                                 | Frage nach Verständlichkeit; die Abläufe sind am 15.11. geprüft.                                          |
| N2628  | NUR AUTOR | –                                                                                                 | Schlüssel bei GitHub und Cloudflare anlegen, das kann nur der Autor.                                      |
| N2629  | NUR AUTOR | –                                                                                                 | Geschmack (Figuren, Möbel, Rahmen).                                                                       |
| N2630  | NUR AUTOR | –                                                                                                 | Rochade per Tipp auf echtem Handy; Regeln und Start am 15.11. geprüft.                                    |
| N2602  | BESTANDEN | auswertung-zeitleiste: „Findezeile mit Kapitel und Üben an 8. Sc3?“, „Warum-Zeile …“              | Zeile, Aufklappen, „Üben“ öffnet den Zähltrainer; doppelte Zeile entfällt. Nicht geprüft: „Verpasst“.     |
| N2603  | OFFEN     | –                                                                                                 | Rückblick Zug für Zug; kein Test.                                                                         |
| N2604  | BESTANDEN | naechster-schritt: „Muster aus deinen Partien …“                                                  | „Drohung stehen gelassen · 3 von 5 Partien · Kapitel 1“, Knopf öffnet den Trainer. Verschwinden nicht.    |
| N2600  | BESTANDEN | einstellungen: beide Tests „Aussehen: …“                                                          | Keine Vorschau mehr, Zeile führt zu „Dein Aussehen“, Grün und Merida gelten im Buch, „Ab Stufe 5“.        |
| N2601  | BESTANDEN | auswertung-zeitleiste: „Warum-Zeile mit Kapitel und Üben an 12. O-O-O??“                          | „Drohung stehen gelassen (Kapitel 1)“, Fundstelle, „Üben“. Ob der Grund passt, beurteilt der Autor.       |
| N2599  | BESTANDEN | auswertung-ruhig: beide Tests                                                                     | Einzeilig und aufgeklappt bleiben Brett und Knöpfe am Platz; Linienknöpfe spielen vor, „Partie“ zurück.   |
| N2585  | NUR AUTOR | Komponententest `src/ui/brett/treffer.test.ts`                                                    | Regel belegt (eigene Figur unter dem Finger geht vor, Tipp knapp daneben zieht); Gefühl am Finger.        |
| N2586  | OFFEN     | –                                                                                                 | Röntgentrainer mit passender Aufgabe; kein Test.                                                          |
| N2587  | NUR AUTOR | –                                                                                                 | Dauer der Auswertung auf dem echten Gerät.                                                                |
| N2588  | OFFEN     | –                                                                                                 | Braucht eine Partie mit absichtlichen Engine-Fehlern verschiedener Größe.                                 |
| N2589  | BESTANDEN | wenigertext-seiten: „P4, P5: Kapitelringe und Lernpfad-Kopf“ (hell und dunkel)                    | Geprüft an Kapitel 1: Abbildungen, Übungen, Lernziele öffnen die Checkliste mit aufgeklappter Karte.      |
| N2590  | OFFEN     | –                                                                                                 | Braucht einen Stand, in dem man schon Aufgaben lösen kann; Neue sehen nur „Anfangen“.                     |
| N2591  | OFFEN     | Komponententest `src/training/startweg.test.ts`                                                   | Zeile „Was zuerst kommt“ mit Buch/Spielen/Umsehen ist da; die Reihenfolge belegt nur der Komponententest. |
| N2593  | OFFEN     | lernpfad: „Lernpfad: Stationen …“ (nur Lernziele in Kapitel 0)                                    | Warum-Fragen und Lernziele in Kapitel 1 nicht nachgestellt.                                               |
| N2596  | BESTANDEN | auswertung-zweige: „Engine-Folgen als Zweige in der Zugliste …“                                   | Die Wahl der Linie läuft heute über die Knöpfe aus N2599, nicht mehr unter der Zugliste.                  |
| N2597  | BESTANDEN | wochenziel: „Übungsplan: Tage und Dauer wählen …“                                                 | Tage, Dauer, keine Uhrzeit, „von 30 Minuten geschafft“, „Jetzt üben“. Minutenzählung nicht geprüft.       |
| N2598  | OFFEN     | –                                                                                                 | Braucht 5 und mehr gewertete, ausgewertete Partien mit schwacher Phase.                                   |
| N2592  | OFFEN     | –                                                                                                 | Zielvorschläge bei Wertung 900 nicht nachgestellt.                                                        |
| N2594  | OFFEN     | Komponententests `src/analyse/k7-motiv.test.ts`, `src/training/taktikalternativen.test.ts`        | Logik der Motive belegt, die Meldungen im Trainer nicht.                                                  |
| N2595  | OFFEN     | Komponententest `src/training/taktikalternativen.test.ts` (Abb. 7.60 Dh1+, Abb. 7.11 Sc5+)        | Logik belegt, der Ablauf im Trainer nicht.                                                                |
| N2582  | BESTANDEN | varianten-stufe2: „Nummern: ein Bereich mit nur einer Nummer …“                                   |                                                                                                           |
| N2583  | BESTANDEN | varianten-stufe2: „Nummern: …“                                                                    |                                                                                                           |
| N2584  | BESTANDEN | varianten-stufe2: „PGN: Pfeile, Felder, Nummerntexte und Legende hin und zurück“                  |                                                                                                           |
| N2581  | BESTANDEN | varianten-stufe3: „Analyse: Fortschritt, Zugarten, Balken, Engine-Pfeil …“                        | Goldener Pfeil statt 3... Sf6??, Schalter aus und an.                                                     |
| N2574  | BESTANDEN | varianten: „Liste: Stift benennt um, Papierkorb löscht nach Nachfrage; Titel mit Stift“           |                                                                                                           |
| N2576  | BESTANDEN | varianten: „Laden aus Grundstellung, FEN, …, Partie (mit Engine-Folgen) …“ (Prüfung ergänzt)      | Haken vorab an (neu im Test). Gabel und Neue Variante teilen sich die Wahl (`folgenstand.ts`).            |
| N2577  | BESTANDEN | wie N2576 (Prüfung ergänzt)                                                                       | „Auch an Fehlern des Gegners“ vorab an.                                                                   |
| N2578  | BESTANDEN | varianten-stufe3: „Nach der Analyse: Engine-Folgen als Abzweige …“                                |                                                                                                           |
| N2579  | BESTANDEN | varianten-stufe3: „Nach der Analyse: … Endbretter und Balken in der Karte“                        |                                                                                                           |
| N2580  | OFFEN     | –                                                                                                 | Balken mit Zahl in der Baumansicht nicht geprüft.                                                         |
| N2575  | BESTANDEN | tour: „jede Tour der Bereiche läuft bis zum Ende durch“; Texte in `de.json`                       | Variante beginnt mit dem Titel; Liste nennt Stift und Papierkorb; Lernsammlung, Fehler: „Rückgängig“.     |
| N2570  | BESTANDEN | varianten-stufe4: „Meisterpartie: Buchpartie aus Kapitel 11 und berühmter Klassiker als Variante“ | Nicht geprüft: „Aktuelle Turniere“.                                                                       |
| N2572  | BESTANDEN | varianten: „Speichern nur per Abfrage …“                                                          | Nicht geprüft: Nachfrage bei Karte, Von hier spielen, Abfragen, Gabel-Knopf an einer Abbildung.           |
| N2573  | BESTANDEN | varianten-stufe2: „Baum: Abzweig-Karten …“, „Karte: öffnen, verschieben, zoomen …“                |                                                                                                           |

Zusammen: 21 BESTANDEN, 0 FEHLER, 8 NUR AUTOR, 11 OFFEN.

### Nebenbefund außerhalb der Punkte

- `varianten.spec.ts`, Test „zwei Tabs: eine Variante im ersten Tab überlebt eine Änderung im
  zweiten“, schlägt auf beta d3bb7ceb lokal dreimal von drei fehl.
- Ablauf: Der erste Tab speichert die Variante nach 1. e4. Der zweite Tab liest eine PGN-Partie ein.
  Dann zieht der erste Tab 1... e5 und lädt neu.
- Erwartet „2 Züge“, die Variante hat nur „1 Zug“. Der Zug nach der Änderung im anderen Tab geht
  verloren.
- Möglicher Rückschritt beim Speichern über mehrere Tabs. Nicht weiter untersucht, an den Hauptchat
  gemeldet.
