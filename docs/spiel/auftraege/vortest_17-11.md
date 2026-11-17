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
  - **ÜBERHOLT**: Der Text beschreibt einen älteren Stand, die App verhält sich nach einem späteren
    Punkt richtig. In `AUFGABEN_AUTOR.md` steht „Vorgeprüft: Abweichung, nur im Text: …“.
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
| N2576  | BESTANDEN | varianten: „Laden aus Grundstellung, FEN, …, Partie (mit Engine-Folgen) …“ (Prüfung ergänzt)      | Haken vorab an (neu im Test); Gabel und Neue Variante teilen sich die Wahl. Abzweige nicht geprüft.       |
| N2577  | BESTANDEN | wie N2576 (Prüfung ergänzt)                                                                       | „Auch an Fehlern des Gegners“ vorab an.                                                                   |
| N2578  | BESTANDEN | varianten-stufe3: „Nach der Analyse: Engine-Folgen als Abzweige …“                                |                                                                                                           |
| N2579  | BESTANDEN | varianten-stufe3: „Nach der Analyse: … Endbretter und Balken in der Karte“                        |                                                                                                           |
| N2580  | OFFEN     | –                                                                                                 | Balken mit Zahl in der Baumansicht nicht geprüft.                                                         |
| N2575  | BESTANDEN | tour: „jede Tour der Bereiche läuft bis zum Ende durch“; Texte in `de.json`                       | Variante beginnt mit dem Titel; Liste nennt Stift und Papierkorb; Lernsammlung, Fehler: „Rückgängig“.     |
| N2570  | BESTANDEN | varianten-stufe4: „Meisterpartie: Buchpartie aus Kapitel 11 und berühmter Klassiker als Variante“ | Nicht geprüft: „Aktuelle Turniere“.                                                                       |
| N2572  | BESTANDEN | varianten: „Speichern nur per Abfrage …“                                                          | Nicht geprüft: Nachfrage bei Karte, Von hier spielen, Abfragen, Gabel-Knopf an einer Abbildung.           |
| N2573  | BESTANDEN | varianten-stufe2: „Baum: Abzweig-Karten …“, „Karte: öffnen, verschieben, zoomen …“                |                                                                                                           |

Zusammen: 21 BESTANDEN, 0 FEHLER, 8 NUR AUTOR, 11 OFFEN.

## Paket 2: N2571 bis N2559 (46 Punkte)

| Nummer | Ergebnis  | Beleg/Foto                                                                            | Hinweis                                                                                   |
| ------ | --------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| N2571  | OFFEN     | –                                                                                     | Werte aus der Auswertung in der Variante nicht nachgestellt.                              |
| N2500  | ÜBERHOLT  | Erkundung, Bildschirmfoto lokal                                                       | Neun Kacheln statt sieben (dazu „Ganze Eröffnung“, „Meisterpartie“). Kein Fehler der App. |
| N2501  | BESTANDEN | varianten: „Variante aus Abb. 2.40 …“                                                 | Gabel, zwei Chips, zwei blaue Pfeile mit ★.                                               |
| N2502  | ÜBERHOLT  | varianten: „Variante aus Abb. 2.40 …“                                                 | Seit N2572 „nicht gespeichert“ bis „Speichern“; danach Gabel 3, De7 in Gold.              |
| N2503  | BESTANDEN | varianten: „Variante aus Abb. 2.40 …“                                                 | Menü über „Menü am Zug“; langer Druck und Zugzeichen nicht geprüft.                       |
| N2504  | BESTANDEN | varianten: „Variante aus Abb. 2.40 …“                                                 | Kommentar nach Neuladen da; goldener Punkt nicht geprüft.                                 |
| N2505  | BESTANDEN | varianten: „PGN einlesen, umbenennen …“                                               | Umbenennen, Löschen mit Rückfrage. Lichess nicht geprüft.                                 |
| N2506  | BESTANDEN | varianten-stufe4: „Abbildung: eigene Züge als Variante speichern …“ (neu)             | Mit h6 und La4 an Abb. 2.2; „1 eigene Variante“ an der Abbildung.                         |
| N2507  | BESTANDEN | varianten: „PGN einlesen …“, „Laden aus … FEN …“                                      |                                                                                           |
| N2508  | BESTANDEN | varianten: „Laden aus Grundstellung, FEN, Stellungseditor, Partie …“                  | Titel und Kommentare aus Satz und Plan.                                                   |
| N2509  | OFFEN     | –                                                                                     | Gabel im Rückblick mit Engine-Folgen hat keinen Test.                                     |
| N2510  | OFFEN     | –                                                                                     | Zahl eigener Varianten in Partienliste und Auswertung nicht geprüft.                      |
| N2511  | BESTANDEN | varianten: „Probepartie von hier …“                                                   | Wertung, Rekorde, Tagesziel nicht einzeln geprüft.                                        |
| N2512  | OFFEN     | –                                                                                     | Probepartie aus dem Gabel-Blatt der Auswertung.                                           |
| N2513  | BESTANDEN | varianten: „Sicherung aus einer neueren App …“                                        | Rückfrage nennt „Varianten: 200“, Einspielen bringt sie mit.                              |
| N2514  | BESTANDEN | Erkundung: Touren auf Liste und Variante bis zum Ende                                 | Schritte zu Titel, Gabel, Brett, Notiz, Stift, Analyse, Baum, Spielen, Abfragen.          |
| N2515  | NUR AUTOR | –                                                                                     | Englische Texte lesen.                                                                    |
| N2516  | ÜBERHOLT  | varianten-stufe2: „Stift: Pfeile und Rahmen …“                                        | Status erst „nicht gespeichert“; sonst wie beschrieben.                                   |
| N2517  | BESTANDEN | varianten-stufe2: „Stift: …“                                                          | Gleicher Pfeil nimmt ihn weg, Nummern rücken nach, Radierer und Rückgängig.               |
| N2518  | BESTANDEN | varianten-stufe2: „Stift: …“                                                          | Legende zeigt nur Beschriftetes, nach Neuladen da.                                        |
| N2519  | BESTANDEN | varianten-stufe2: „Baum: …“                                                           |                                                                                           |
| N2520  | BESTANDEN | varianten-stufe2: „Karte: …“, „Karte: zwei Finger zoomen“                             |                                                                                           |
| N2521  | BESTANDEN | varianten-stufe2: „Karte: …“                                                          | Zurück führt zur Abbildung, kein zweiter Entwurf.                                         |
| N2522  | BESTANDEN | varianten-stufe2: „Karte: …“                                                          | Liste da; Bildschirmleser nicht geprüft.                                                  |
| N2523  | BESTANDEN | varianten-stufe2: „PGN: Pfeile, Felder, Nummerntexte …“                               | Lichess nicht geprüft.                                                                    |
| N2524  | BESTANDEN | varianten-stufe2: „PGN: …“                                                            | Englisch und Tour nicht geprüft.                                                          |
| N2560  | BESTANDEN | varianten-stufe3: „Analyse: …“                                                        | Blättern während der Analyse.                                                             |
| N2561  | ÜBERHOLT  | varianten-stufe3: „Analyse: …“                                                        | Goldener statt grüner Pfeil (N2581); Symbole, Marke, Balken wie beschrieben.              |
| N2562  | BESTANDEN | varianten-stufe3: „Analyse: …“                                                        | Schalter gemerkt, Werte im Speicher.                                                      |
| N2563  | BESTANDEN | varianten-stufe3: „Analyse: …“                                                        |                                                                                           |
| N2564  | BESTANDEN | varianten-stufe3: „Analyse abbrechen …“                                               | Zweite Analyse nur für den Rest nicht geprüft.                                            |
| N2565  | OFFEN     | –                                                                                     | Analyse im Hintergrund nach Verlassen.                                                    |
| N2566  | BESTANDEN | varianten-stufe3: „Analyse: …“ (PGN mit Werten)                                       | Lichess nicht geprüft.                                                                    |
| N2567  | OFFEN     | –                                                                                     | Lichess-PGN mit Bewertungen.                                                              |
| N2568  | BESTANDEN | varianten-stufe3: „Probepartie läuft …“                                               |                                                                                           |
| N2569  | NUR AUTOR | –                                                                                     | Englische Texte lesen.                                                                    |
| N2525  | BESTANDEN | varianten-stufe4: „Ganze Eröffnung …“                                                 |                                                                                           |
| N2526  | OFFEN     | –                                                                                     | Steckbrief und „Nur Praxis“.                                                              |
| N2527  | BESTANDEN | varianten-stufe4: „Übung erst nach dem Lösen …“                                       | Taktik und Repertoire nicht geprüft.                                                      |
| N2528  | BESTANDEN | varianten-stufe4: „Variante abfragen …“                                               |                                                                                           |
| N2529  | BESTANDEN | varianten-stufe4: „Lernsammlung: Variante …“                                          | Fehlereintrag und „lösen“ nicht geprüft.                                                  |
| N2555  | BESTANDEN | zurueck-blatt: „Lernpfad: Zurück schließt das Infofenster …“                          |                                                                                           |
| N2556  | BESTANDEN | zurueck-blatt: „Profil-Startseite …“, „Partie einstellen …“, „Auswertung: … Teilen …“ |                                                                                           |
| N2557  | BESTANDEN | zurueck-blatt: „kaputter Herausforderungslink …“                                      | Auch mit `?fbclid=abc`.                                                                   |
| N2558  | BESTANDEN | zurueck-blatt: „Auswertung: … „Neue Partie“ …“                                        | 30-Minuten-Plan nicht geprüft.                                                            |
| N2559  | BESTANDEN | Erkundung: Rundgang, dann Zurück                                                      | Tour endet, die Seite bleibt.                                                             |

Zusammen: 33 BESTANDEN, 0 FEHLER, 4 ÜBERHOLT (der Text beschreibt einen älteren Stand, die App ist richtig; in `AUFGABEN_AUTOR.md` als „Vorgeprüft: Abweichung, nur im Text“), 2 NUR AUTOR, 7 OFFEN.

### Nebenbefund außerhalb der Punkte

- `varianten.spec.ts`, Test „zwei Tabs: eine Variante im ersten Tab überlebt eine Änderung im
  zweiten“, schlägt auf beta d3bb7ceb lokal dreimal von drei fehl.
- Ablauf: Der erste Tab speichert die Variante nach 1. e4. Der zweite Tab liest eine PGN-Partie ein.
  Dann zieht der erste Tab 1... e5 und lädt neu.
- Erwartet „2 Züge“, die Variante hat nur „1 Zug“. Der Zug nach der Änderung im anderen Tab geht
  verloren.
- Möglicher Rückschritt beim Speichern über mehrere Tabs. Nicht weiter untersucht, an den Hauptchat
  gemeldet.
