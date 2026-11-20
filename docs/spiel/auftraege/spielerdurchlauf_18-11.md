# Spieler-Durchlauf: das Abenteuer nur mit Spielereingaben (18. und 19.11.2026)

Auftrag des Autors (18.11.2026): das ganze Schach-Abenteuer im echten Browser nur mit den Eingaben
eines Spielers durchspielen, die Spielzeit je Akt messen und jede Stelle melden, an der ein Spieler
mit diesen Eingaben nicht weiterkommt.

**Kurz:** Strecke A hat das Spiel vom neuen Spiel bis zum Abspann nur mit Spielereingaben
gespielt (28 Abschnitte, ein Browserprofil): alle vier Akte, alle Clubkämpfe, die Wegsperren S15
bis S17, das Turnier in der Capital Arena und den Abschied von Ambrose. Strecke C erreichte den
Abspann ein zweites Mal von einem Stand aus, den die Gesamtsimulation erspielt hat. Nicht gespielt
sind Pinewood Camp (beide Läufe nahmen die Abkürzung über die Alte Minenstraße), der Epilog und
das Querformat über Akt 1 hinaus. Acht Funde: sechs behoben (1, 2, 5, 6, 7, 8), einer von einer
anderen Sitzung behoben und im Browser bestätigt (4, Bergstation), einer erwies sich als Fehler
des Durchlaufs (3).

**Nachtrag Etappe 6 (20.11.2026):** Das Querformat (863 × 360) ist jetzt in allen vier Akten
gespielt, aber nicht an einem Stück bis zum Abspann: Strecke E (durchgehend ab neuem Spiel) kam
bis Desert Springs in Akt 3, Strecke F (ab simuliertem Stand) von Ironwood bis in die Hütte von
Summit City, Strecke G (ab simuliertem Stand) von Desert Springs bis zum Abspann. Strecke A hat
im Hochformat nach dem Abspann auch den Epilog gespielt. Zwei neue Funde (9 und 10), beide
behoben. Einzelheiten in Abschnitt 9.

## 1. Wie gespielt wurde

- Werkzeug: `app/tests/durchlauf/` mit eigener Einstellung `app/playwright.durchlauf.config.ts`
  (Chromium, Pixel 7, Hochformat 412 × 839 und Querformat 863 × 360). Nicht in CI.
- Eingaben: Finger auf dem Steuerkreuz (Berührung halten), Aktionsknopf, Dialogknöpfe und
  Antworten, Deckwahl, Laden, Brett per Antippen. Kein Testknopf, kein Aufruf von App-Funktionen.
- Gelesen wird zum Entscheiden: Anzeige, Speicher der App, Karten und Quests aus
  `inhalte/abenteuer`, die Ink-Quellen (wer führt zu welchem Knoten), bei Fallenaufgaben die
  Trainerdaten (das Brett ist dort nur ein Bild).
- Partien: Stockfish unter Node, meist der beste Zug bei kleiner Tiefe, in einem Viertel der Züge
  ein fast gleich guter. Das ist stärker als ein Leser mit 1200; die Partien sind deshalb eher kurz,
  und der Lauf hat alle Partien gewonnen.
- Etappen: Der Browser behält sein Profil; jeder Aufruf spielt den erspielten Stand weiter.
- Zusatz für Akt 3 und 4: `pipeline/abenteuer/aktstand.cjs` lässt die Gesamtsimulation bis zum
  Ende des vorigen Akts spielen; der Durchlauf schreibt diesen Stand einmal in den Speicher, bevor
  das Abenteuer öffnet (`DURCHLAUF_STAND`). Danach gelten nur Spielereingaben. Solche Strecken
  heißen unten „ab simuliertem Stand“.

## 2. Wie weit der Lauf kam

| Strecke                 | Format | Beginn                         | Gespielt bis                                                                                                                                | Ende der Strecke                                   |
| ----------------------- | ------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| A, durchgehend          | hoch   | neues Spiel                    | Akt 1 bis 4 ganz (alle Clubkämpfe, Wegsperren S15, S16, S17, Alte Minenstraße, Ghost Town, Capital Arena mit sechs Turnierpartien), Abspann | Abspann erreicht                                   |
| B, ab simuliertem Stand | hoch   | Ironwood, Ende von Akt 2       | Akt 3 ganz: Wegsperre S16, Silicon Bay, Fähre, Port Delacroix, Desert Springs bis zum Bahnhof                                               | Aktende                                            |
| C, ab simuliertem Stand | hoch   | Desert Springs, Ende von Akt 3 | Akt 4: Wegsperre S17, Summit City ganz, Crossroads, Alte Minenstraße, Ghost Town, Seeufer, Capital Arena (sechs Turnierpartien), Abspann    | Abspann erreicht                                   |
| D                       | quer   | neues Spiel                    | Akt 1 bis nach der Partie gegen Victor, Kiosk im Park                                                                                       | Funde 6 und 7, danach abgebrochen (wie vereinbart) |

Nicht gespielt: Pinewood Camp (beide Läufe nahmen mit Darlenes Schlüssel die Alte Minenstraße von
Crossroads nach Ghost Town; das ist eine gewollte Abkürzung, das Camp ist kein Pflichtort), der
Epilog in Maple Falls (der Durchlauf endet am Abspann), das Querformat über Akt 1 hinaus.

## 3. Gemessen

Laufen ist aus den gelaufenen Kacheln gerechnet (16 Pixel bei 56 Pixeln je Sekunde), damit die Last
zweier Browser die Zahl nicht verfälscht. Wörter sind gelesene Dialogzeilen plus Meldungen,
Ergebniskarten und Aufgabentexte.

| Strecke  | Akt                           | Kacheln | Laufen (min) | Kartenwechsel | Dialogzeilen | Wörter | Partien | Halbzüge (eigene) | Runden (Aufgaben) |
| -------- | ----------------------------- | ------- | ------------ | ------------- | ------------ | ------ | ------- | ----------------- | ----------------- |
| A        | 1, ganz                       | 4035    | 19,2         | 146           | 675          | 10 333 | 9       | 304 (154)         | 6 (27)            |
| A        | 2, ganz, mit langen Irrwegen  | 30 517  | 145,3        | 324           | 1481         | 25 290 | 37      | 765 (388)         | 14 (46)           |
| A        | 3, ganz                       | 6023    | 28,7         | 59            | 887          | 16 195 | 25      | 690 (348)         | 14 (51)           |
| A        | 4, bis Abspann, ohne Pinewood | 3806    | 18,1         | 42            | 719          | 11 392 | 17      | 798 (401)         | 5 (13)            |
| B        | 2, Rest ab Ironwood           | 2507    | 11,9         | 19            | 141          | 2424   | 6       | 164 (81)          | 0                 |
| B        | 3, ganz                       | 6867    | 32,7         | 67            | 675          | 12 876 | 14      | 604 (304)         | 13 (59)           |
| C        | 3, Diner (S17)                | 245     | 1,2          | 4             | 17           | 372    | 1       | 30 (15)           | 0                 |
| C        | 4, bis Abspann, ohne Pinewood | 10 871  | 51,8         | 96            | 1046         | 17 716 | 29      | 882 (445)         | 6 (18)            |
| D (quer) | 1, bis Victor                 | 561     | 2,7          | 13            | 213          | 3248   | 3       | 173 (88)          | 2 (7)             |

Einschränkungen dieser Zahlen:

- Akt 1 (Strecke A) enthält Umwege des Durchlaufs: eine Türschleife am Waschsalon, viermal die
  Nebenpartie gegen Rosa, zwei Nebenrunden. Die Zahlen liegen deshalb zwischen „zügig“ und
  „gründlich“.
- Akt 2 der Strecke A ist nicht brauchbar als Maß: Der Durchlauf lief dort lange zwischen Riverton,
  Cedar Creek und Maple Falls hin und her (30 517 Kacheln, 37 Partien, die meisten Wiederholungen
  von Nebenpartien), erst wegen Fund 5, dann weil sein Planer den Bus von Ironwood zur Raststätte
  nicht kannte (Fehler des Durchlaufs, behoben).
- Akt 3 enthält in beiden Strecken Nebenpartien und Nebenrunden (Batiste bis zu neunmal, Buck,
  Schiffskoch); Akt 4 der Strecke C enthält einen Abstecher zurück nach Port Delacroix und Desert
  Springs (offene Nebenquests des simulierten Stands) und fünf Partien gegen Sol. Akt 4 der
  Strecke A ist ohne solche Umwege gespielt und deshalb das bessere Maß.
- Ladezeiten: Das Spielpaket lud beim ersten Start in 9 bis 18 Sekunden (lokaler Server, kein
  Mobilfunk); Kartenwechsel dauerten zusammen unter 15 Sekunden je Akt. Für die Spielzeit zählen
  sie nicht.
- Aufgabenrunden: Der Löser bestand die meisten Runden beim ersten Versuch; Nova (Fallen) brauchte
  bis zu drei Anläufe, die Aufgabe in Henris Werkstatt (Strecke A) blieb falsch.

## 4. Geschätzte Spielzeit

Annahmen (in `app/tests/durchlauf/auswertung.ts`): zügig liest 180 Wörter je Minute, läuft die
gemessenen Wege, braucht 15 Sekunden je eigenem Zug und 45 Sekunden je Aufgabe. Gründlich liest
120 Wörter je Minute (Kinder), läuft anderthalbmal so weit, 15 Sekunden je Zug, 90 Sekunden je
Aufgabe.

**Aus Messung geschätzt:**

| Akt | Strecke                            | Spieler   | Lesen | Laufen | Partien | Aufgaben | Summe (min) |
| --- | ---------------------------------- | --------- | ----- | ------ | ------- | -------- | ----------- |
| 1   | A                                  | zügig     | 64    | 19     | 39      | 20       | 142         |
| 1   | A                                  | gründlich | 99    | 29     | 39      | 41       | 207         |
| 3   | A (durchgehend)                    | zügig     | 99    | 29     | 87      | 38       | 253         |
| 3   | A (durchgehend)                    | gründlich | 153   | 43     | 87      | 77       | 360         |
| 3   | B (ab simuliertem Stand)           | zügig     | 78    | 33     | 76      | 44       | 231         |
| 3   | B (ab simuliertem Stand)           | gründlich | 121   | 49     | 76      | 89       | 335         |
| 4   | A (durchgehend, ohne Pinewood)     | zügig     | 70    | 18     | 100     | 10       | 198         |
| 4   | A (durchgehend, ohne Pinewood)     | gründlich | 108   | 27     | 100     | 20       | 255         |
| 4   | C (ab simul. Stand, ohne Pinewood) | zügig     | 109   | 52     | 111     | 14       | 285         |
| 4   | C (ab simul. Stand, ohne Pinewood) | gründlich | 168   | 78     | 111     | 27       | 384         |

**Gerechnet (Akt 2):** Die Messung von Akt 2 taugt wegen der Irrwege nicht. Maßstab ist Akt 1: Die
Summe von Akt 1 mal dem Verhältnis der Wortzahlen der Lesefassung der Gesamtsimulation (Akt 1:
17 253 Wörter, Akt 2: 16 942) ergibt 139 Minuten zügig und 203 gründlich.

| Akt  | zügig (min)            | gründlich (min)   | Art der Zahl                                    |
| ---- | ---------------------- | ----------------- | ----------------------------------------------- |
| 1    | 142                    | 207               | aus Messung geschätzt                           |
| 2    | 139                    | 203               | gerechnet                                       |
| 3    | 253                    | 360               | aus Messung geschätzt (Strecke A)               |
| 4    | 234                    | 306               | aus Messung geschätzt (Strecke A), mit Pinewood |
| 5    | 3                      | 4                 | aus Messung geschätzt (Epilog)                  |
| alle | 771 (knapp 13 Stunden) | 1080 (18 Stunden) | Summe                                           |

Die frühere Rechnung nur aus Wortzahlen (651 und 950 Minuten) lag für Akt 3 und 4 zu niedrig: Dort
kosten die Partien mehr als das Lesen (in Akt 4 allein sechs Turnierpartien mit 30 bis 82
Halbzügen). Zu hoch sind die Zahlen, soweit Nebenpartien mehrfach gespielt wurden; zu niedrig,
soweit ein Leser länger als 15 Sekunden je Zug braucht, Partien verliert und wiederholt.

Nachtrag (19.11.2026): Pinewood Camp (36 Minuten zügig, 51 gründlich) und der Epilog nach dem
Abspann (3 und 4 Minuten) sind nachgemessen und oben eingerechnet; Lauf und Funde in
`spielerdurchlauf_pinewood_epilog_19-11.md`.

## 5. Funde

1. **Eingeschlossen im Clubraum von Maple Falls (behoben).** Wer Coach Delgado von rechts
   ansprach, stand nach der Partie gegen Victor zwischen Coach, Pult, Regal und Schreibtisch und
   kam nie mehr heraus (die Fassung der Karte nach der Szene stellt ein Pult dazu). Zweimal im
   Browser erlebt. Behebung allgemein: `oberwelt/einschluss.ts` rückt den Helden beim Laden jeder
   Karte aus einer kleinen Nische ohne Weg zu einem Übergang auf die nächste ganz freie Kachel.
   Test: `einschluss.test.ts` (Nische, Gegenproben, alle Ankunfts- und Startfelder aller Karten).
2. **Zielhinweis zeigt auf der Zielkarte nichts (behoben).** 34 Schritte von Hauptquests nannten
   nur einen Dialogknoten mitten im Gespräch; der Hinweis führte dann bis zur Karte und zeigte
   dort auf nichts. Nach Victor musste man Coach Delgado noch einmal ansprechen, ohne Hinweis.
   Jetzt steht in `quests.json` an 31 Schritten ein `ziel`: drei bei `mapleFalls.besserWerden`,
   23 weitere, wo genau eine Figur oder ein Auslöser der Zielkarte zum Knoten führt, und fünf, bei
   denen mehrere in Frage kamen (Abschnitt 5a, als RO40 beim Autor). Vier Ankünfte brauchen keins.
3. **Stillstand in Sams erster Aufgabe (kein Fund des Spiels).** Zweimal blieb der Lauf dort
   stehen. Mit dem berichtigten Skript und frischem Profil (Querformat) trat es nicht mehr auf;
   Ursache war sehr wahrscheinlich ein Fehler des Durchlaufs (ein Griff nach einem Element ohne
   Frist). Ein Beweisbild des Stillstands gibt es nicht.
4. **Bergstation Summit City: Rückweg zur Seilbahn hakte (von einer anderen Sitzung behoben).**
   Am 18.11. kam der Held in drei von vier Versuchen vom Geländer nicht zurück zur Kabine: Zwischen
   Spind und Kabinenwand blieb nur ein Durchlass, der eine auf den Pixel genaue Höhe verlangte.
   Nach der Behebung (Prüfung `pipeline.abenteuer.durchlass`) kam Strecke C am 19.11. beim ersten
   Versuch hinauf und wieder hinunter, Strecke A danach ebenso; beide spielten Summit City zu
   Ende. Das sind zwei Durchgänge, kein Dauertest.
5. **Riverton nach dem Clubkampf: Quest schickte zum verschlossenen Wohnwagen (behoben).**
   Questtext und Zielhinweis sagten „Slick in seinem Wohnwagen besuchen“; die Tür meldete, drinnen
   sei niemand. Erst ein weiteres Gespräch mit Slick im Pavillon (der Montag) öffnet den
   Wohnwagen. Der Durchlauf fand das nicht; ein Mensch musste es erraten. Jetzt hat die Quest
   `riverton.parkclub` davor einen eigenen Schritt („Am Montag noch einmal zu Slick in den
   Pavillon gehen.“) mit Zielhinweis auf Slick, und die Tür des Wohnwagens sagt nach dem
   Clubkampf, dass Slick noch im Pavillon ist. Test: `zielsuche.test.ts`; die Gesamtsimulation
   läuft damit bis zum Abspann ohne Meldung. Im Browser bestätigt (Strecke A, 19.11.): Der Lauf
   ging nach dem Clubkampf zu Slick in den Pavillon, dann in den Wohnwagen und weiter nach
   Ironwood.
6. **Querformat, Deckwahl: Knopf zum Spielen unter dem Bildrand (behoben).** Bei 863 × 360 waren
   nur Bedenkzeit und der Rand der Karten zu sehen; das Fenster rollt, zeigt das aber nicht.
7. **Querformat, Laden: kein Ausgang zu sehen (behoben).** In Patels Kiosk standen nur die Waren im
   Bild, alle gesperrt, „Schließen“ lag unter dem Rand. Darunter lagen Steuerkreuz und
   Aktionsknopf verdeckt.
8. **Hochformat, Laden mit vielen Waren: kein Ausgang zu sehen (behoben).** In Darlenes Raststätte
   (Crossroads, dreizehn Waren) lag „Fertig“ auch im Hochformat 412 × 839 unter dem Rand (in den
   Strecken C und A, beide noch mit dem Bau vor der Behebung).
   Behebung für 6, 7 und 8: Der abschließende Knopf eines Fensters bleibt immer am unteren Rand
   stehen (`abenteuer.css`, zuerst nur für flache Fenster, seit Fund 8 für alle). Tests: die Zeile
   zur Deckwahl quer in `tests/e2e/abenteuer-randfaelle.spec.ts` und „Darlenes Raststätte“ in
   `tests/e2e/abenteuer-laden.spec.ts`. Den Laden im Querformat habe ich nach der Behebung nicht
   noch einmal im Browser angesehen.

### 5a. Hauptquest-Schritte mit mehreren möglichen Zielen (zu Fund 2)

Bei fünf Schritten führen mehrere Figuren oder Auslöser zum Knoten. Entschieden nach dem Maßstab
„wen muss der Spieler in diesem Schritt ansprechen, und was sagt der Questtext“; der Autor kann
widersprechen (RO40 in `docs/AUFGABEN_AUTOR.md`).

| Quest, Schritt               | Knoten                              | Gewähltes Ziel                       | Warum                                                                                                                                |
| ---------------------------- | ----------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ironwood.clubkampf`, 5      | `ironwood-aussen.kauf`              | Graham Hale am Werkstor              | Er ist der Käufer; Victor ist das Ziel des nächsten Schritts.                                                                        |
| `portDelacroix.tiefpunkt`, 1 | `port-delacroix-turnhalle.vorwurf`  | Miss Odile in der Turnhalle          | Sie leitet den Club; Remy und Lou sind die Ziele ihrer Aufgaben danach.                                                              |
| `ghostTown.fernpartie`, 2    | `erinnerung-siedlung.letzter_brief` | Kerze in der Erinnerung              | Die Kerze startet die Szene, Gideon führt nur zu ihr. Der Hinweis zeigt in Ghost Town auf den Laden; der Questtext nennt den Saloon. |
| `ghostTown.fernpartie`, 5    | `ghost-town-aussen.nacht_ambrose`   | Sternenhimmel                        | So sagt es der Questtext.                                                                                                            |
| `mapleFalls.epilog`, 1       | `maple-falls-dachboden.epilog`      | Brett auf dem Schreibtisch im Zimmer | So sagt es der Questtext; auf dem Dachboden steht kein Brett mehr.                                                                   |

Ohne `ziel` bleiben vier Ankünfte (`riverton.parkclub` 2, `summitCity.endspiel` 1,
`crossroads.treffpunkt` 1, `pinewoodCamp.sommercamp` 1): Der Knoten läuft am Übergang in den Ort,
und der Hinweis zeigt schon auf diesen Übergang. Die Schrittnummern zählen wie im Tagebuch ab 1.

Keine Funde in den gespielten Strecken: Dialog ohne Ausgang, Brett nicht bedienbar, Kamera.
Beobachtungen ohne Befund: Die Haustür in Maple Falls reagierte einmal nicht (beim nächsten Versuch
ging sie); im Musikhaus von Port Delacroix meldete der Durchlauf vier Figuren ohne Aktionsknopf
(er kennt dort wahrscheinlich die falsche Fassung der Karte; nicht nachgeprüft); nach jedem Neubau
erscheint „Jetzt aktualisieren“ und muss angetippt werden. Die Meldungen „Übergang … unerreichbar“ in den Protokollen (Schule in Maple
Falls, Kanalweg und Wohnwagen in Riverton, Wüstenzug und Deich in Port Delacroix, Felsbogen) waren
Fehler des Durchlaufs (alte Kachel nach dem Kartenwechsel, getrennte Kartenteile mit Steg).

## 6. Zoe und die Wegsperre S17

Im Browser beobachtet (Strecke C, 19.11., Hochformat): Am Diner beginnt die Stellung mit dem Zug
Dxd7, und Zoe schlägt mit Sxd7 zurück. Nach fünfzehn eigenen Zügen wertete die Hülle den Sieg, die
Truppe ließ durch, und der Übergang zur Bergstraße war offen.

Nicht im Browser gespielt: das Remis an S17 (zählt als Fehlversuch) und der Notausgang nach drei
Fehlversuchen. Dafür gelten weiter die vorhandenen Tests `abenteuer-wegsperre-partie.spec.ts` und
`src/abenteuer/dialog/wegsperre-s17.test.ts`.

Strecke A spielte S17 am 19.11. ein zweites Mal, diesmal durchgehend: wieder Sieg nach fünfzehn
eigenen Zügen. S15 (Zedernwald) und S16 (Raststätte) öffneten in den Strecken A und B jeweils mit
einem Sieg.

## 7. Grenzen des Durchlaufs

- Strukturaufgaben (Felder und Bauern markieren, Feldart, Plan) löst er mit den Regeln der App
  (`training/strukturtrainer.ts`), die Gedächtnisstellung baut er aus den abgelesenen Feldern auf
  (Felsbogen, 7 von 7). Das prüft die Bedienung, nicht die Schwierigkeit.
- Zwei Fahrten beginnen im Gespräch und sind fest eingebaut: der Bus von Ironwood zur Raststätte
  und der Zug von Desert Springs zum Diner.
- Fallenaufgaben beantwortet er aus den Trainerdaten, nicht aus der Stellung.
- Die Monatskarte (Reisen) benutzt er nicht; er läuft alle Wege.
- Statisten spricht er nicht an.
- Er spielt stärker als ein Leser mit 1200 und verliert nie; Niederlagen, Wiedereinstieg und
  Notausgänge kamen deshalb nicht vor. Nachtrag 19.11.2026: Mit `DURCHLAUF_SPIELER=schwach`
  verliert er jeden ersten Versuch, lädt neu, bricht ab und spielt S17 bis zum Notausgang
  (Bericht `schwacher_spieler_19-11.md`).
- Die simulierten Stände kennen keine Funde, Steckbriefe und Wertung; Nebenquests der Simulation
  standen dort offen und lenkten den Planer zeitweise ab.

## 8. Aufruf

```bash
cd app && npm run build
DURCHLAUF_ORDNER=/tmp/durchlauf DURCHLAUF_MINUTEN=30 CHROMIUM_PFAD=… \
  npx playwright test --config playwright.durchlauf.config.ts
# DURCHLAUF_FORMAT=quer, DURCHLAUF_EINGABE=tasten, DURCHLAUF_BIS_AKT=2
# Aktbeginn: node pipeline/abenteuer/aktstand.cjs --akt 4 --ziel /tmp/akt4.json
#            DURCHLAUF_STAND=/tmp/akt4.json DURCHLAUF_ORDNER=/tmp/akt4 …
```

Im Ordner liegen danach je Format `messung.json`, `protokoll.log`, `auswertung.md` und Bilder.

## 9. Etappe 6 (20.11.2026): Querformat und Epilog

Stand des Spiels: beta `1f7d960b`. Alle Strecken dieser Etappe im Querformat 863 × 360 (Pixel 7
quer), bis auf den Epilog.

### 9.1 Gespielt

| Strecke                 | Format | Beginn                         | Gespielt bis                                                                                                                                             | Ende der Strecke |
| ----------------------- | ------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| A (Fortsetzung)         | hoch   | Profil nach dem Abspann        | Epilog in Maple Falls („Ein Jahr später“, Lily), Quest `mapleFalls.epilog` erledigt                                                                      | Epilog erledigt  |
| E, durchgehend          | quer   | neues Spiel                    | Akt 1 und 2 ganz (Clubkämpfe Maple Falls, Cedar Creek, Riverton, Ironwood; S15, S16), Akt 3: Silicon Bay, Fähre, Port Delacroix, Desert Springs (Garage) | Zeit             |
| F, ab simuliertem Stand | quer   | Ironwood, Ende von Akt 2       | S16, Akt 3 ganz (Strukturaufgaben 5 von 5, Gedächtnisstellung 7 von 7, drei Clubkämpfe, S17), Akt 4 bis zur Hütte in Summit City                         | Zeit             |
| G, ab simuliertem Stand | quer   | Desert Springs, Ende von Akt 3 | S17, Summit City ganz, Crossroads, Alte Minenstraße, Ghost Town, Seeufer, Capital Arena (sechs Turnierpartien), Abspann                                  | Abspann erreicht |

Damit ist Strecke A im Hochformat an einem Stück gespielt: neues Spiel, Abspann, Epilog. Im
Querformat fehlt das Stück an einem Stück: Der Abspann ist nur ab simuliertem Stand erreicht, und
Pinewood Camp und der Epilog sind quer nicht gespielt. Pinewood Camp und den Epilog ab simuliertem
Stand hat der Nachtauftrag vom 19.11. im Hochformat gespielt
(`spielerdurchlauf_pinewood_epilog_19-11.md`); die Beobachtungen zum Musikhaus und zu Henris
Werkstatt hat er geklärt (`schwacher_spieler_19-11.md`: Musikhaus war ein Fehler des Durchlaufs,
Henris Aufgabe ein Spielfehler, behoben).

Gemessen (quer; Laufen aus Kacheln gerechnet wie in Abschnitt 3):

| Strecke | Akt                        | Kacheln | Laufen (min) | Kartenwechsel | Dialogzeilen | Wörter | Partien | Halbzüge (eigene) | Runden (Aufgaben) |
| ------- | -------------------------- | ------- | ------------ | ------------- | ------------ | ------ | ------- | ----------------- | ----------------- |
| E       | 1, ganz, mit 40 Partien Jo | 3504    | 16,7         | 54            | 1341         | 22 301 | 85      | 1255 (654)        | 10 (38)           |
| E       | 2, ganz                    | 1162    | 5,5          | 19            | 522          | 6907   | 5       | 212 (107)         | 7 (37)            |
| E       | 3, bis Desert Springs      | 3651    | 17,4         | 32            | 876          | 12 022 | 12      | 331 (169)         | 10 (41)           |
| F       | 2, Rest ab Ironwood        | 1805    | 8,6          | 8             | 116          | 1473   | 3       | 73 (36)           | 0                 |
| F       | 3, ganz                    | 7448    | 35,5         | 54            | 1187         | 16 989 | 25      | 763 (384)         | 12 (51)           |
| G       | 4, bis Abspann             | 2858    | 13,6         | 37            | 940          | 12 111 | 19      | 624 (315)         | 4 (14)            |

Akt 1 der Strecke E taugt nicht als Maß: Der Durchlauf spielte 40 Partien in Folge gegen Jo im
Park (Fehler des Durchlaufs, behoben: Er nahm die schon gespielte Revanche statt „Gleich.“). Akt 2
der Strecke E ist der erste ganze Akt 2 ohne Irrwege: 103 Minuten zügig, 158 gründlich nach den
Annahmen aus Abschnitt 4 (gerechnet waren 139 und 203). Die Spielzeit hängt nicht vom Format ab;
die Summen in Abschnitt 4 habe ich deshalb nicht geändert.

### 9.2 Randprüfung

Neu im Durchlauf (`tests/durchlauf/randpruefung.ts`): Jedes Fenster, das in einem Abschnitt zum
ersten Mal erscheint, wird fotografiert und darauf geprüft, ob ein Knopf außerhalb des Bildes
liegt oder verdeckt ist und ob er sich durch Rollen erreichen lässt. Einmal je Abschnitt öffnet
der Durchlauf dazu Tagebuch, Reisebrett, Reisen und Spielmenü und schließt sie mit der
Zurück-Taste. Die Bilder liegen im Ordner des Laufs unter `quer/bilder/fenster-…png`.

Im Querformat gesehen und ohne festen Befund: Dialog mit und ohne Antworten, Meldung, Deckwahl
(mit Lupe, Bedenkzeit, Karten), Partie mit und ohne Kurzform und Erzählung, Ergebniskarte,
Aufgabenrunde, Zugerraten, Strukturaufgaben, Gedächtnisstellung, Rundenergebnis, Laden (Kiosk,
Antiquariat, Bergladen, Fanshop), Tagebuch, Spielmenü, Turnierpartien, Abspann. Nicht gesehen: das
Fenster „Reisen“ (der Knopf erschien in den gespielten Ständen nicht).

### 9.3 Funde

9. **Abspann nennt Figuren mehrfach (behoben).** Im Abspann stand „Mama“ dreimal, einmal mit einem
   zerbrochenen Bild; acht Figuren standen doppelt oder dreifach (Coach Delgado, Juno, Carla,
   Mr. Pratt, Ivy, Jonah, Tessa). Die Liste zählte nach der Kennung der Figur statt nach dem
   Namen. Jetzt steht jeder Name einmal, mit dem Porträt der Kennung, die zum Namen gehört
   (`oberwelt/abspannfiguren.ts`, Test `Abspann.test.ts`). Der Fund hängt nicht am Format.
10. **Hinweis „Neue Version verfügbar“ schiebt das Spiel aus dem Bild (behoben).** Der Hinweis
    stand über der Seite und drückte das Abenteuer um seine Höhe (60 Pixel) nach unten. Im
    Querformat lag „Nach unten“ des Steuerkreuzes damit ganz unter dem Rand (gemessen: Oberkante
    bei 359 von 360 Pixeln). Jetzt liegt der Hinweis über dem Spiel und verschiebt nichts
    (`abenteuer.css`). Geprüft, indem die neue Regel in den alten Stand eingespielt wurde:
    Oberkante danach bei 299. Einen frischen Start mit Hinweis und neuer Regel habe ich nicht
    gesehen; bis zur nächsten Größenänderung blieb im Versuch unten ein weißer Streifen stehen.

Kleinere Änderungen für das Querformat (`abenteuer.css`):

- Deckwahl: Der Steckbrief der Lupe steht quer in einer Zeile neben seiner Überschrift, und die
  Überschriften „Bedenkzeit“ und „Farbe“ kosten quer keine Zeile mehr (für Vorleseprogramme
  bleiben sie). Vorher war mit Lupe und Bedenkzeit von den Karten ohne Rollen nichts zu sehen.
  Test: Zeile in `tests/e2e/abenteuer-querformat.spec.ts`.
- Der stehende Knopf eines Fensters („Schließen“ im Tagebuch, „Fertig“ im Laden) deckt jetzt den
  Streifen über und unter sich ab; vorher schien dort eine halbe Zeile des rollenden Inhalts durch.

Beobachtungen ohne Änderung:

- Quer liegt die Deckwahl über der Meldungsleiste: „Weiter“ einer Meldung („Neu im Tagebuch“) ist
  erst nach der Deckwahl zu erreichen.
- Im Laden und im Abspann liegt der stehende Knopf quer über einer Reihe des Inhalts; man erreicht
  alles durch Rollen.
- Vor „Ans Brett“ ist quer die letzte Zeile des Ziels angeschnitten, und „Aufgeben“ liegt weiter
  unten in der rollenden Spalte; nach „Ans Brett“ steht alles im Bild.
- Nach jedem Neubau meldete der Durchlauf einmal „Spielpaket lädt nicht in 300 s“: Zwei Browser
  luden zugleich das Paket mit den echten Grafiken (122 MB) vom lokalen Server. Mit dem
  öffentlichen Paket (10 MB) nicht geprüft.
