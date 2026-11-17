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

## Gesamt (alle 273 offenen Punkte, nach Runde 2)

| Ergebnis                        | Anzahl |
| ------------------------------- | ------ |
| BESTANDEN                       | 152    |
| FEHLER (in Runde 2 behoben)     | 1      |
| ABWEICHUNG (Frage an den Autor) | 1      |
| ÜBERHOLT                        | 6      |
| NUR AUTOR                       | 113    |
| OFFEN                           | 0      |

- Der Autor kann die 152 bestandenen Punkte abhaken, wenn ihm die Zeile genügt. Steht dort „nicht
  geprüft“ oder „offen für dich“, bleibt genau dieser Teil.
- Die 6 überholten Punkte beschreiben einen älteren Stand und können ebenfalls weg.
- Runde 2 (Abschnitt ganz unten) hat alle 47 offenen Punkte maschinell geprüft. Dafür setzt die Hilfe
  `app/tests/e2e/zustand.ts` Zustände direkt in den Speicher; dazu kommen die gefälschte Uhr
  (`page.clock`) und der Flugmodus (`offlinehilfen.ts`). Dabei ist ein Fehler der App aufgefallen
  und behoben (N2495). N2598 ist eine Modellfrage an den Autor.
- Neue dauerhafte Prüfungen:
  - Runde 1:
    - `varianten.spec.ts`: Haken der Engine-Folgen vorab an.
    - `varianten-stufe4.spec.ts`: eigene Züge an einer Abbildung als Variante.
    - `wochenziel.spec.ts`: Plan ändern und entfernen.
  - Runde 2:
    - `heute-zustaende.spec.ts`
    - `auswertung-varianten.spec.ts`, `auswertung-kurve.spec.ts`
    - `taktik-wiederholung.spec.ts`, `trainer-feinheiten.spec.ts`
    - `offline-zusatz.spec.ts`
    - `sicherung-zustaende.spec.ts`
    - `zeitablauf.spec.ts`
    - `profil-und-seiten.spec.ts`

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

## Paket 3: N2480 bis N2549, 0.3.45 (38 Punkte)

| Nummer | Ergebnis  | Beleg/Foto                                                                             | Hinweis                                                        |
| ------ | --------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| N2480  | BESTANDEN | spielen: „2. g4?? erlaubt Matt … kein Zurücknehmen“                                    | Aufgeben und Wiederöffnen nicht geprüft.                       |
| N2481  | OFFEN     | –                                                                                      | Braucht eine verlorene Partie mit „Bester Zug“.                |
| N2482  | BESTANDEN | auswertung-zeitleiste: „Zeitleiste waagerecht und Zur Stellung“ (393 × 851, 320 × 568) | Phasenkarte und Daumenwischen nicht geprüft.                   |
| N2483  | BESTANDEN | auswertung-zeitleiste: „Zeitleiste waagerecht und Zur Stellung“ (393 × 851, 320 × 568) | Zwei schnelle Tipps nicht geprüft.                             |
| N2484  | BESTANDEN | auswertung-zeitleiste: „Zeitleiste waagerecht und Zur Stellung“ (393 × 851, 320 × 568) |                                                                |
| N2485  | BESTANDEN | auswertung-zeitleiste: „Zeitleiste waagerecht und Zur Stellung“ (393 × 851, 320 × 568) |                                                                |
| N2486  | BESTANDEN | auswertung-zeitleiste: „Zeitleiste waagerecht und Zur Stellung“ (393 × 851, 320 × 568) | Bewegung reduziert: kein weiches Scrollen.                     |
| N2487  | NUR AUTOR | –                                                                                      | Aussehen hell/dunkel, Querformat, Tablet.                      |
| N2530  | BESTANDEN | trainer-repertoire: „Startkarte …“, „Königsgambit als Weiß …“                          | Übereinstimmung mit Kapitel 3 beurteilt der Autor.             |
| N2531  | OFFEN     | –                                                                                      | Gedächtnis je Quelle nicht nachgestellt.                       |
| N2532  | NUR AUTOR | –                                                                                      | Frage „Passt das so?“.                                         |
| N2533  | BESTANDEN | trainer-repertoire: „Italienisch aus der Praxis …“                                     |                                                                |
| N2534  | BESTANDEN | trainer-repertoire: „Italienisch aus der Praxis …“                                     | Herkunft, falscher Zug mit Meldung.                            |
| N2535  | BESTANDEN | trainer-repertoire: „Italienisch …“, „Startkarte …“                                    | Neuladen statt App schließen.                                  |
| N2536  | BESTANDEN | Texte `tour.trainer.repertoire.*` in `de.json`                                         |                                                                |
| N2540  | BESTANDEN | sammlung-bearbeiten: „Fehlerdatenbank: Kachel im Training …“                           | Reihenfolge der Kacheln nicht geprüft.                         |
| N2541  | BESTANDEN | sammlung-bearbeiten: „Auswertung: nach „Merken“ Bestätigung …“                         |                                                                |
| N2542  | BESTANDEN | sammlung-bearbeiten: „Auswertung: …“                                                   |                                                                |
| N2543  | BESTANDEN | sammlung-bearbeiten: „Lernsammlung: anlegen, Plan ergänzen …“                          |                                                                |
| N2544  | BESTANDEN | sammlung-bearbeiten: „Lernsammlung: …“                                                 | Gruppe „Narrenmatt“.                                           |
| N2545  | BESTANDEN | sammlung-bearbeiten: „Lernsammlung: …“                                                 | 10 Sekunden nicht geprüft.                                     |
| N2546  | BESTANDEN | sammlung-bearbeiten: „Fehlerdatenbank: …“                                              | Auswertung zählt beim neuen Kapitel.                           |
| N2547  | BESTANDEN | sammlung-bearbeiten: „Fehlerdatenbank: …“                                              |                                                                |
| N2548  | BESTANDEN | `src/tour/touren.ts` und tour: „jede Tour der Bereiche …“                              |                                                                |
| N2490  | BESTANDEN | fehlertest-3: „geteilter Link bei offener App …“                                       |                                                                |
| N2491  | BESTANDEN | fehlertest-3: „Startwahl aus den Einstellungen …“                                      |                                                                |
| N2492  | BESTANDEN | fehlertest-3: „Zurück-Taste bei offener Startwahl …“                                   |                                                                |
| N2493  | BESTANDEN | fehlertest-3: „„Los geht's“ im Profil …“                                               | Orden „Teil Endspiel“ nicht geprüft.                           |
| N2494  | BESTANDEN | fehlertest-3: „Maia laden ohne Netz …“                                                 |                                                                |
| N2495  | OFFEN     | –                                                                                      | Keine Gratulation nach Einspielen: nicht nachgestellt.         |
| N2496  | BESTANDEN | fehlertest-3: „Gratulation zum vollen Ring …“                                          |                                                                |
| N2497  | BESTANDEN | fehlertest-3: „QR-Code ?start=buch …“                                                  |                                                                |
| N2498  | BESTANDEN | fehlertest-3: „App offen über Mitternacht …“                                           |                                                                |
| N2550  | BESTANDEN | trainer-repertoire: „Old Sicilian …“                                                   | Satz „um 1200“; Verständlichkeit beurteilt der Autor.          |
| N2551  | BESTANDEN | trainer-repertoire: „Old Sicilian …“                                                   | Gefühl für die Länge beim Autor.                               |
| N2552  | BESTANDEN | Erkundung: Englische Eröffnung als Schwarz                                             | Knopf „1 Variante“, App zieht 1. c4.                           |
| N2553  | OFFEN     | –                                                                                      | Ohne Netz nicht nachgestellt.                                  |
| N2549  | BESTANDEN | sammlung-bearbeiten: „Auswertung: …“                                                   | „Zur Stellung“ zeigt 12. O-O-O??, eingetragen wird dieser Zug. |

Zusammen: 32 BESTANDEN, 0 FEHLER, 2 NUR AUTOR, 4 OFFEN.

## Paket 4: N2440 bis N2329, 0.3.44 bis 0.3.38 (58 Punkte)

| Nummer | Ergebnis  | Beleg/Foto                                                                                | Hinweis                                                                |
| ------ | --------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| N2440  | OFFEN     | –                                                                                         | Karte „Heute“ mitten im Buch nicht nachgestellt.                       |
| N2441  | OFFEN     | –                                                                                         | Eigenes Ziel „Übungen von Kapitel 3“.                                  |
| N2442  | OFFEN     | –                                                                                         | Über 20 fällige Karten.                                                |
| N2443  | OFFEN     | –                                                                                         | Alles erledigt: Kachel „Partie“.                                       |
| N2444  | OFFEN     | –                                                                                         | Zähltrainer: Seite am Zug über fünf Aufgaben.                          |
| N2445  | NUR AUTOR | –                                                                                         | Bilder der Werkzeugseite ansehen.                                      |
| N2446  | OFFEN     | –                                                                                         | Kapitelseite mit 150 % Schrift.                                        |
| N2460  | BESTANDEN | auswertungbilder: „Züge von Derya“                                                        |                                                                        |
| N2461  | OFFEN     | –                                                                                         | Leere Fläche über „Eigene Bots verwalten“.                             |
| N2462  | BESTANDEN | fehlertest-spielen: „PGN in deutscher Notation mit Doppeltipp …“                          |                                                                        |
| N2463  | BESTANDEN | fehlertest-spielen: „PGN einer Schachvariante …“                                          |                                                                        |
| N2464  | BESTANDEN | fehlertest-spielen: „zwei Tabs: Änderung im ersten Tab überlebt …“                        | Anders als der Zwei-Tab-Test der Varianten (Nebenbefund) grün.         |
| N2465  | OFFEN     | –                                                                                         | Zahl der Partien in der Rückfrage.                                     |
| N2466  | OFFEN     | –                                                                                         | Zug genau beim Zeitablauf.                                             |
| N2467  | OFFEN     | –                                                                                         | Datum nach Mitternacht in PGN und Sicherung.                           |
| N2420  | BESTANDEN | startseite: „Impressum, Datenschutz und Lizenzen …“                                       | onnxruntime-Bausteine und Bauwerkzeuge; übrige Einträge nicht geprüft. |
| N2421  | BESTANDEN | startseite: „Impressum, Datenschutz und Lizenzen …“                                       | CC BY-SA liegt in der App; Flugmodus nicht geprüft.                    |
| N2422  | BESTANDEN | startseite: „Impressum, Datenschutz und Lizenzen …“                                       | GPL 3.0 oder neuer, Quelltext, Lizenzen.                               |
| N2423  | OFFEN     | –                                                                                         | Fußzeile der Trainingsseiten.                                          |
| N2424  | OFFEN     | sprache: „Sprache: … Lizenzen“ (nur Überschrift und Link)                                 | Neue Einträge auf Englisch nicht geprüft.                              |
| N2430  | BESTANDEN | `pipeline.wiki.baue_seiten()`                                                             | Inhalt der Seite; Dashboard selbst nicht geprüft.                      |
| N2431  | NUR AUTOR | `pipeline.wiki.baue_seiten()`                                                             | Beide genannten Abläufe da; Verständlichkeit beim Autor.               |
| N2432  | BESTANDEN | `pipeline.wiki.baue_seiten()`                                                             | Kein Treffer in 336 Seiten.                                            |
| N2433  | NUR AUTOR | –                                                                                         | Konzeptkarte auf dem Handy.                                            |
| N2434  | NUR AUTOR | –                                                                                         | Eindruck der Zahlen.                                                   |
| N2370  | BESTANDEN | tour: „erster Start: Startwahl, einmal …“                                                 |                                                                        |
| N2371  | BESTANDEN | tour: „Startwahl „Ich lese das Buch“ …“                                                   | „An die Hand nehmen“ beurteilt der Autor.                              |
| N2372  | BESTANDEN | tour: „Startwahl „spielen“ führt durch Spielen …“                                         |                                                                        |
| N2373  | BESTANDEN | tour: „… ?start=buch beginnt ohne Frage …“; fehlertest-3 (Rundgang aus den Einstellungen) |                                                                        |
| N2374  | OFFEN     | –                                                                                         | Kennzahlen im Profil.                                                  |
| N2375  | BESTANDEN | naechster-schritt: „Karte „Heute“: Neue fangen bei Abb. 0.1 an …“                         | Teilfälle nicht geprüft.                                               |
| N2400  | BESTANDEN | nebenaufgaben: „Profil: Infofenster zu Orden, Abzeichen und Ring …“                       |                                                                        |
| N2401  | BESTANDEN | nebenaufgaben: „Profil: …“                                                                | Glanzstück und „Als Nächstes“ nicht geprüft.                           |
| N2404  | BESTANDEN | nebenaufgaben: „Lernpfad: Nebenaufgaben …“ (360 px)                                       | Ruhe des Weges beim Autor.                                             |
| N2405  | NUR AUTOR | nebenaufgaben: „Lernpfad: …“                                                              | Liste da; Niveau der Stücke beim Autor.                                |
| N2406  | BESTANDEN | nebenaufgaben: „Lernpfad: …“                                                              | Nur „Trainer Kapitel 0“.                                               |
| N2409  | NUR AUTOR | –                                                                                         | Name, Bild, Bedingung.                                                 |
| N2410  | BESTANDEN | nebenaufgaben: „axe (dunkel) …“                                                           | Kontrast maschinell; Lesbarkeit beim Autor.                            |
| N2412  | OFFEN     | –                                                                                         | Ring bis 17.                                                           |
| N2361  | OFFEN     | –                                                                                         | Texte der Profil-Tour nicht einzeln geprüft.                           |
| N2362  | OFFEN     | –                                                                                         | Jeder Schritt auf jeder Spielen-Seite.                                 |
| N2363  | NUR AUTOR | –                                                                                         | Meldung, wenn ein Text nicht passt.                                    |
| N2350  | NUR AUTOR | –                                                                                         | Wirkung der Leerzustände.                                              |
| N2352  | NUR AUTOR | –                                                                                         | Inhalt der zwei Sätze.                                                 |
| N2353  | BESTANDEN | wenigertext-seiten: „P3, P13: Partiekopf …“ (hell, dunkel)                                | ⓘ-Text und Kopf über der Auswertung nicht geprüft.                     |
| N2356  | NUR AUTOR | –                                                                                         | Treffen die Kurzzeilen den Schritt.                                    |
| N2341  | NUR AUTOR | –                                                                                         | Meldung bei unpassender Legende.                                       |
| N2344  | BESTANDEN | werkzeuge-k6-k12: „Werkzeug Kandidaten (Abb. 12.1) …“                                     |                                                                        |
| N2300  | ÜBERHOLT  | einstellungen: „Aussehen: …“                                                              | Brettvorschau seit 0.3.53 entfernt (N2600).                            |
| N2304  | NUR AUTOR | –                                                                                         | Treffen mit dem Finger.                                                |
| N2308  | NUR AUTOR | –                                                                                         | Fehlt etwas?                                                           |
| N2309  | NUR AUTOR | –                                                                                         | Texte der Tour gegen den Eindruck.                                     |
| N2317  | NUR AUTOR | –                                                                                         | Wärme und Akku auf dem älteren Handy.                                  |
| N2316  | NUR AUTOR | –                                                                                         | Flüssigkeit auf dem Redmi.                                             |
| N2339  | OFFEN     | rivale: „Rivalenkarte: … Revanche gegen Tom …“ (nur Rivalenkarte)                         | „Zuletzt gespielt“ und angeheftetes Ziel nicht geprüft.                |
| N2321  | NUR AUTOR | –                                                                                         | Eindruck der Zeitleiste.                                               |
| N2325  | OFFEN     | –                                                                                         | Kurve mit Finger und zwei Fingern.                                     |
| N2329  | OFFEN     | –                                                                                         | Liste „Nichts verloren“ nicht vollständig nachgestellt.                |

Zusammen: 21 BESTANDEN, 0 FEHLER, 1 ÜBERHOLT, 17 NUR AUTOR, 19 OFFEN.

## Paket 5: N2254 bis N2636, 0.3.38 bis 0.2.131 und Abenteuer (91 Punkte)

Fast alle Punkte dieses Teils fragen nach Eindruck, Geschmack oder Gefühl („Gefällt dir …?“, „Passt …?“, „Klingt …?“) oder brauchen ein echtes Gerät. Sie bleiben beim Autor; die Tabelle nennt nur die Ausnahmen ausführlich.

| Nummer | Ergebnis  | Beleg/Foto                                           | Hinweis                                                  |
| ------ | --------- | ---------------------------------------------------- | -------------------------------------------------------- |
| N2254  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2257  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2280  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2284  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2290  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2291  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2292  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2295  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2296  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2310  | OFFEN     | –                                                    | Braucht mehrere ausgewertete gewertete Partien.          |
| N2261  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2263  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2266  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2270  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2274  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2240  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2241  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2243  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2246  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2181  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2184  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2185  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2186  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2188  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2190  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2195  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2196  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2198  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2212  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2218  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2207  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2208  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2230  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2238  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2221  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2224  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2141  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2145  | OFFEN     | –                                                    | Gewonnene gewertete Partie ohne Patzer.                  |
| N2147  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2160  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2163  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2165  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2166  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2167  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2150  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2156  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2136  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2137  | BESTANDEN | wochenziel: „Übungsplan: …“ (ergänzt)                | Ändern und Entfernen.                                    |
| N2138  | NUR AUTOR | –                                                    | Kalender auf dem iPhone.                                 |
| N2139  | NUR AUTOR | –                                                    | Kalender unter Android.                                  |
| N2100  | NUR AUTOR | –                                                    | Update auf dem echten Handy.                             |
| N2002  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2006  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2007  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2012  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1044  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1045  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1046  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1048  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1090  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1091  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1095  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1083  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1084  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1087  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1072  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1073  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1074  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1075  | OFFEN     | –                                                    | Falscher Zug in einer Lichess-Aufgabe.                   |
| N1076  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1078  | OFFEN     | –                                                    | Zusatzaufgaben im Flugmodus.                             |
| N1061  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1064  | OFFEN     | –                                                    | Listen „Zug erraten“ ohne Netz.                          |
| N1052  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1040  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1036  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1034  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1030  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1031  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1023  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N1013  | OFFEN     | –                                                    | Pfeile in „Zug erraten“.                                 |
| N990   | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N993   | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N924   | NUR AUTOR | –                                                    | Installierte App unter Android.                          |
| N935   | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2631  | NUR AUTOR | –                                                    | Ton am iPhone.                                           |
| N2632  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2633  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |
| N2634  | NUR AUTOR | Spieltest 17.11. (`rueckmeldung/spieltest_17-11.md`) | 73 von 73 Übergängen laufen; Eindruck je Ort beim Autor. |
| N2635  | NUR AUTOR | –                                                    | Karteneditor am PC.                                      |
| N2636  | NUR AUTOR | –                                                    | Frage nach Eindruck, Geschmack oder Gefühl.              |

Zusammen: 1 BESTANDEN, 0 FEHLER, 84 NUR AUTOR, 6 OFFEN.

## Runde 2: die 47 offenen Punkte (47 Punkte)

Auftrag des Hauptchats am 17.11. nachmittags: die OFFEN-Punkte maschinell prüfbar machen. Belege sind die neuen e2e-Tests (Dateinamen ohne `.spec.ts`).

| Nummer | Ergebnis        | Beleg/Foto                   | Hinweis                                                                              |
| ------ | --------------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| N2440  | BESTANDEN       | heute-zustaende              | Kapitel 0 bis 5 gelesen, Kapitel 6 begonnen: Übungen Kapitel 5.                      |
| N2441  | BESTANDEN       | heute-zustaende              | Ziel Kapitel 3 angeheftet.                                                           |
| N2442  | BESTANDEN       | heute-zustaende              | 200 fällig: „20 in etwa 14 Min“, Satz im Vorlesetext.                                |
| N2443  | BESTANDEN       | heute-zustaende              | Letzte Kachel „Partie“.                                                              |
| N2590  | BESTANDEN       | heute-zustaende              | Kurzplan unter den Vorschlägen, öffnet die Kurzpläne.                                |
| N2591  | BESTANDEN       | heute-zustaende              | Startweg „Spielen“: Partie vorn.                                                     |
| N2592  | BESTANDEN       | heute-zustaende              | Wertung 900: Bots bis Stufe 5, Kapitelziel, keine Engine-Bots.                       |
| N2598  | ABWEICHUNG      | heute-zustaende              | Eröffnung bestanden; Endspiel nie, Blitz nie (Spanne des Modells über SCHMAL).       |
| N2310  | BESTANDEN       | heute-zustaende              | Balken öffnet die Kurve mit Spanne.                                                  |
| N2588  | BESTANDEN       | auswertungbilder (bestehend) | Nur der echte Patzer der Engine hat eine Kachel.                                     |
| N2603  | BESTANDEN       | auswertung-varianten         | Findezeile mit „Üben“ an 8. Sc3?, nicht am Theoriezug.                               |
| N2481  | BESTANDEN       | auswertung-varianten         | Verloren mit besten Zügen: kein „?“.                                                 |
| N2509  | BESTANDEN       | auswertung-varianten         | Engine-Abzweige an beiden Fehlern und am Patzer der Engine.                          |
| N2510  | BESTANDEN       | auswertung-varianten         | „1 eigene Variante“ in Auswertung und Liste.                                         |
| N2512  | BESTANDEN       | auswertung-varianten         | Probepartie mit Weiß, „Verwerfen“ speichert nichts.                                  |
| N2571  | BESTANDEN       | auswertung-varianten         | Zugarten sofort, Analyse nur 3 neue Stellungen.                                      |
| N2580  | BESTANDEN       | auswertung-varianten         | Balken mit Zahl im Baum.                                                             |
| N2565  | BESTANDEN       | auswertung-varianten         | Analyse läuft nach dem Verlassen weiter.                                             |
| N2567  | BESTANDEN       | auswertung-varianten         | „[%eval]“: Balken sofort, Zugarten nach der Analyse.                                 |
| N2329  | ÜBERHOLT        | bestehende Tests             | Zurücknehmen nach dem Ende und alte Knöpfe gibt es nicht mehr.                       |
| N2325  | BESTANDEN       | auswertung-kurve             | Finger und zwei Finger über CDP.                                                     |
| N2145  | BESTANDEN       | auswertung-varianten         | „30 Halbzüge ohne Patzer“.                                                           |
| N2594  | BESTANDEN       | taktik-wiederholung          | „Ebenfalls dabei: Hinlenkung.“; Wortlaut bei einem Motiv „Nicht ganz. Das Motiv: …“. |
| N2595  | BESTANDEN       | taktik-wiederholung          | Dh1+ löst 7.60, Sc5+ bleibt falsch.                                                  |
| N2586  | BESTANDEN       | Erkundung (Zufallsrunden)    | Meldung wörtlich wie beschrieben.                                                    |
| N2444  | BESTANDEN       | trainer-feinheiten           | Rechnung nennt die Seite unter dem Brett.                                            |
| N2531  | BESTANDEN       | trainer-feinheiten           | Gedächtnis je Quelle.                                                                |
| N2526  | BESTANDEN       | trainer-feinheiten           | Steckbrief und Wiener Partie aus „Nur Praxis“.                                       |
| N1075  | BESTANDEN       | taktik-wiederholung          | Lichess-Aufgabe, falscher Zug.                                                       |
| N1013  | BESTANDEN       | trainer-feinheiten           | Pfeile in „Zug erraten“.                                                             |
| N2553  | BESTANDEN       | offline-zusatz               | Praxis-Runde im Flugmodus verlängert.                                                |
| N1078  | BESTANDEN       | offline-zusatz               | Zusatzaufgaben im Flugmodus.                                                         |
| N1064  | BESTANDEN       | offline-zusatz               | Zusatzpartien im Flugmodus.                                                          |
| N2465  | BESTANDEN       | sicherung-zustaende          | „Partien: 1“.                                                                        |
| N2495  | FEHLER, behoben | sicherung-zustaende          | „Neue Stufe erreicht“ nach dem Einspielen; jetzt vergessen (vergissGefeierteStufe).  |
| N2467  | BESTANDEN       | sicherung-zustaende          | 0:30 Uhr Berlin: Sicherung und PGN mit dem 18.11.                                    |
| N2466  | BESTANDEN       | zeitablauf                   | Zug nach Zeitablauf wird nicht ausgeführt.                                           |
| N2593  | BESTANDEN       | profil-und-seiten            | Warum-Fragen und Lernziele sinken je um eins.                                        |
| N2374  | BESTANDEN       | profil-und-seiten            | Drei Kacheln, Null blass.                                                            |
| N2412  | BESTANDEN       | profil-und-seiten            | „0 von 17“.                                                                          |
| N2361  | BESTANDEN       | profil-und-seiten            | Tour mit allen Karten, Wertung als Kacheln.                                          |
| N2362  | BESTANDEN       | profil-und-seiten            | Jeder Schritt hebt ein Ziel hervor.                                                  |
| N2446  | BESTANDEN       | profil-und-seiten            | Kapitel 0 bei 150 % ohne Überstand.                                                  |
| N2461  | BESTANDEN       | Bildschirmfoto (lokal)       | Keine leere Fläche.                                                                  |
| N2423  | BESTANDEN       | profil-und-seiten            | Fußzeilen mit „Lizenzen“.                                                            |
| N2424  | BESTANDEN       | profil-und-seiten            | Neue Einträge auf Englisch.                                                          |
| N2339  | BESTANDEN       | profil-und-seiten            | „Zuletzt gespielt“ und Revanche.                                                     |

Zusammen: 44 BESTANDEN, 1 ABWEICHUNG, 1 ÜBERHOLT, 1 FEHLER, behoben.

### Befunde aus Runde 2

- **N2495, behoben:** Auf einem neuen Gerät merkt der erste Start Stufe 1. Nach dem Einspielen
  einer Sicherung mit höherer Stufe gratulierte die App zu einer längst erreichten Stufe.
  - Ursache: Die gefeierte Stufe ist ein Merker des Geräts und reist nicht mit der Sicherung.
  - Korrektur: `Datensicherung.tsx` ruft nach dem Einspielen `vergissGefeierteStufe()` auf
    (`abzeichenstand.ts`). Die Meldung merkt die Stufe dann still wie beim ersten Start.
  - Belegt durch einen Komponententest und `sicherung-zustaende.spec.ts`.
- **N2598, Frage an den Autor:** Der Hinweis „Aus deinen Partien“ kann für das Endspiel nie
  erscheinen, im Blitz für keine Phase.
  - Ursache: Die Spanne des Elo-Modells je Phase (`ELO_MODELLE[tempo].phasen[…].spanne`) bleibt
    dort auch nach zehn Partien über SCHMAL = 460.
  - Werte nach zehn Partien: Endspiel ±954 (Schnellschach), ±1241 (Blitz), ±658 (Klassisch);
    Blitz-Eröffnung ±538.
  - Das ist eine Modell- und Grenzfrage, deshalb nicht geändert.
- **Kein Fehler, nur zur Vorsicht:** Eine eingespielte Partie mit widersprüchlichen Werten (Matt
  von Weiß, Werte für Schwarz) lässt die App die Auswertung im Hintergrund neu rechnen. Tests
  brauchen deshalb stimmige Werte (`auswertung-varianten.spec.ts`).
- **Testhinweis:** Erst eine gezeigte Abzeichen-Meldung schreibt das Datum in „verdient“ und damit
  in die Sicherung. Tests mit Sicherungen dürfen die Meldungen auf dem ersten Gerät nicht
  stummschalten.

### Nebenbefund außerhalb der Punkte

- `varianten.spec.ts`, Test „zwei Tabs: eine Variante im ersten Tab überlebt eine Änderung im
  zweiten“, schlägt auf beta d3bb7ceb lokal dreimal von drei fehl.
- Ablauf: Der erste Tab speichert die Variante nach 1. e4. Der zweite Tab liest eine PGN-Partie ein.
  Dann zieht der erste Tab 1... e5 und lädt neu.
- Erwartet „2 Züge“, die Variante hat nur „1 Zug“. Der Zug nach der Änderung im anderen Tab geht
  verloren.
- Möglicher Rückschritt beim Speichern über mehrere Tabs. Nicht weiter untersucht, an den Hauptchat
  gemeldet.
- Der entsprechende Test für Profil und Partien („zwei Tabs: Änderung im ersten Tab überlebt …“ in
  `fehlertest-spielen.spec.ts`) ist grün. Betroffen sind also nur Varianten.
