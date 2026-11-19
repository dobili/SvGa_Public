# Spieler-Durchlauf: das Abenteuer nur mit Spielereingaben (18. und 19.11.2026)

Auftrag des Autors (18.11.2026): das ganze Schach-Abenteuer im echten Browser nur mit den Eingaben
eines Spielers durchspielen, die Spielzeit je Akt messen und jede Stelle melden, an der ein Spieler
mit diesen Eingaben nicht weiterkommt.

**Kurz:** Der Lauf kam nicht bis zum Abspann. Durchgehend gespielt ist Akt 1 ganz und Akt 2 bis
Riverton. Akt 3 und der Anfang von Akt 4 sind in Teilen gespielt, aber von einem Stand aus, den
die Gesamtsimulation erspielt hat. Der Rest ist nicht gespielt; seine Spielzeit steht unten nur als
Rechnung. Sieben Funde: vier behoben (1, 5, 6, 7), einer zum größten Teil (2), einer offen (4,
Bergstation), und einer erwies sich als Fehler des Durchlaufs (3).

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

| Strecke                 | Format | Beginn                         | Gespielt bis                                                                                  | Ende der Strecke                                                 |
| ----------------------- | ------ | ------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| A, durchgehend          | hoch   | neues Spiel                    | Akt 1 ganz (Maple Falls, Cedar Creek, Wegsperre S15), Akt 2 bis Riverton nach dem Clubkampf   | Fund 5: Der Lauf fand den Weg zum Wohnwagen nicht                |
| B, ab simuliertem Stand | hoch   | Ironwood, Ende von Akt 2       | Wegsperre S16, Silicon Bay (beide Reihen, Clubkampf), Fähre, Port Delacroix bis zur Turnhalle | Strukturaufgaben, die der Löser des Durchlaufs nicht kann        |
| C, ab simuliertem Stand | hoch   | Desert Springs, Ende von Akt 3 | Wegsperre S17 am Diner, Bergstraße, Summit City bis zur Bergstation                           | Fund 4 und fehlende Zeit                                         |
| D                       | quer   | neues Spiel                    | Akt 1 bis nach der Partie gegen Victor, Kiosk im Park                                         | Funde 6 und 7, danach abgebrochen (kurze Strecke wie vereinbart) |

Nicht gespielt: Akt 2 ab dem Wohnwagen in Riverton bis Ironwood (Mamas Finale, Clubkampf Ironwood
nur in Strecke B aus dem simulierten Stand heraus), Akt 3 ab der Turnhalle von Port Delacroix
(Desert Springs ganz), Akt 4 ab der Hütte in Summit City (Crossroads, Pinewood Camp, Ghost Town,
Capital Arena), Abspann und Epilog. Querformat über Akt 1 hinaus.

## 3. Gemessen

Laufen ist aus den gelaufenen Kacheln gerechnet (16 Pixel bei 56 Pixeln je Sekunde), damit die Last
zweier Browser die Zahl nicht verfälscht. Wörter sind gelesene Dialogzeilen plus Meldungen,
Ergebniskarten und Aufgabentexte.

| Strecke  | Akt                   | Kacheln | Laufen (min) | Kartenwechsel | Dialogzeilen | Wörter | Partien | Halbzüge (eigene) | Runden (Aufgaben) |
| -------- | --------------------- | ------- | ------------ | ------------- | ------------ | ------ | ------- | ----------------- | ----------------- |
| A        | 1, ganz               | 4035    | 19,2         | 146           | 675          | 10 333 | 9       | 304 (154)         | 6 (27)            |
| A        | 2, bis Riverton       | 15 794  | 75,2         | 128           | 294          | 4960   | 4       | 92 (46)           | 4 (16)            |
| B        | 2, Rest ab Ironwood   | 2507    | 11,9         | 19            | 141          | 2424   | 6       | 164 (81)          | 0                 |
| B        | 3, bis Port Delacroix | 4642    | 22,1         | 36            | 250          | 4671   | 3       | 139 (70)          | 6 (28)            |
| C        | 3, Diner (S17)        | 245     | 1,2          | 4             | 17           | 372    | 1       | 30 (15)           | 0                 |
| C        | 4, bis Bergstation    | 2388    | 11,4         | 20            | 154          | 2795   | 0       | 0                 | 0                 |
| D (quer) | 1, bis Victor         | 561     | 2,7          | 13            | 213          | 3248   | 3       | 173 (88)          | 2 (7)             |

Einschränkungen dieser Zahlen:

- Akt 1 (Strecke A) enthält Umwege des Durchlaufs: eine Türschleife am Waschsalon, viermal die
  Nebenpartie gegen Rosa, zwei Nebenrunden. Die Zahlen liegen deshalb zwischen „zügig“ und
  „gründlich“.
- Akt 2 der Strecke A ist nicht brauchbar als Maß: Der Durchlauf lief dort lange zwischen Riverton
  und Maple Falls hin und her (15 794 Kacheln), weil er den nächsten Schritt nicht fand (Fund 5).
- Ladezeiten: Das Spielpaket lud beim ersten Start in 9 bis 18 Sekunden (lokaler Server, kein
  Mobilfunk); Kartenwechsel dauerten zusammen unter 15 Sekunden je Akt. Für die Spielzeit zählen
  sie nicht.
- Aufgabenrunden: Der Löser bestand fast alle Runden beim ersten Versuch; Nova (Fallen) brauchte
  drei Anläufe.

## 4. Geschätzte Spielzeit

Annahmen (in `app/tests/durchlauf/auswertung.ts`): zügig liest 180 Wörter je Minute, läuft die
gemessenen Wege, braucht 15 Sekunden je eigenem Zug und 45 Sekunden je Aufgabe. Gründlich liest
120 Wörter je Minute (Kinder), läuft anderthalbmal so weit, 15 Sekunden je Zug, 90 Sekunden je
Aufgabe.

**Aus Messung geschätzt (nur Akt 1 ist ein ganzer Akt):**

| Akt | Spieler   | Lesen | Laufen | Partien | Aufgaben | Summe (min) |
| --- | --------- | ----- | ------ | ------- | -------- | ----------- |
| 1   | zügig     | 64    | 19     | 39      | 20       | 142         |
| 1   | gründlich | 99    | 29     | 39      | 41       | 207         |

**Gerechnet, nicht gespielt (Akt 2 bis 4):** Maßstab ist Akt 1. Die Summe von Akt 1 wird mit dem
Verhältnis der Wortzahlen der Lesefassung der Gesamtsimulation malgenommen (Akt 1: 17 253 Wörter,
Akt 2: 16 942, Akt 3: 19 074, Akt 4: 25 946). Das setzt voraus, dass Laufen, Partien und Aufgaben
je Wort in allen Akten gleich viel Zeit kosten; für Akt 4 mit seinen Turnierpartien (19 Partien in
der Lesefassung gegen 7 in Akt 1) ist das eher zu wenig.

| Akt  | Faktor | zügig (min)            | gründlich (min)        | Art der Zahl          |
| ---- | ------ | ---------------------- | ---------------------- | --------------------- |
| 1    | 1,00   | 142                    | 207                    | aus Messung geschätzt |
| 2    | 0,98   | 139                    | 203                    | gerechnet             |
| 3    | 1,11   | 157                    | 229                    | gerechnet             |
| 4    | 1,50   | 213                    | 311                    | gerechnet             |
| alle |        | 651 (knapp 11 Stunden) | 950 (knapp 16 Stunden) | gerechnet             |

Zum Vergleich die Teilstrecken: Akt 3 bis Port Delacroix (etwa das erste Drittel des Akts) ergab
gemessen 89 Minuten zügig; das passt eher zu einem längeren Akt 3 als gerechnet.

## 5. Funde

1. **Eingeschlossen im Clubraum von Maple Falls (behoben).** Wer Coach Delgado von rechts
   ansprach, stand nach der Partie gegen Victor zwischen Coach, Pult, Regal und Schreibtisch und
   kam nie mehr heraus (die Fassung der Karte nach der Szene stellt ein Pult dazu). Zweimal im
   Browser erlebt. Behebung allgemein: `oberwelt/einschluss.ts` rückt den Helden beim Laden jeder
   Karte aus einer kleinen Nische ohne Weg zu einem Übergang auf die nächste ganz freie Kachel.
   Test: `einschluss.test.ts` (Nische, Gegenproben, alle Ankunfts- und Startfelder aller Karten).
2. **Zielhinweis zeigt auf der Zielkarte nichts (behoben bis auf neun Schritte).** 34 Schritte von
   Hauptquests nannten nur einen Dialogknoten mitten im Gespräch; der Hinweis führte dann bis zur
   Karte und zeigte dort auf nichts. Nach Victor musste man Coach Delgado noch einmal ansprechen,
   ohne Hinweis. Jetzt steht in `quests.json` an 26 Schritten ein `ziel` (drei bei
   `mapleFalls.besserWerden`, 23 weitere), überall dort, wo genau eine Figur oder ein Auslöser der
   Zielkarte zum Knoten führt. Die neun übrigen stehen in Abschnitt 5a.
3. **Stillstand in Sams erster Aufgabe (kein Fund des Spiels).** Zweimal blieb der Lauf dort
   stehen. Mit dem berichtigten Skript und frischem Profil (Querformat) trat es nicht mehr auf;
   Ursache war sehr wahrscheinlich ein Fehler des Durchlaufs (ein Griff nach einem Element ohne
   Frist). Ein Beweisbild des Stillstands gibt es nicht.
4. **Bergstation Summit City: Rückweg zur Seilbahn hakt (offen).** In drei von vier Versuchen kam
   der Held vom Geländer nicht zurück zur Kabine, auch nicht mit Rütteln. Die Kollision lässt
   zwischen Spind und Kabinenwand nur einen Durchlass, der eine auf den Pixel genaue Höhe verlangt
   (die Laufhilfe trifft sie nicht immer). Ein Spieler kann dort oben festsitzen. Empfehlung: den
   Spind eine Kachel versetzen oder seine feine Maske kürzen; nicht umgebaut, weil der Kartenbau
   dafür nötig ist.
5. **Riverton nach dem Clubkampf: Quest schickte zum verschlossenen Wohnwagen (behoben).**
   Questtext und Zielhinweis sagten „Slick in seinem Wohnwagen besuchen“; die Tür meldete, drinnen
   sei niemand. Erst ein weiteres Gespräch mit Slick im Pavillon (der Montag) öffnet den
   Wohnwagen. Der Durchlauf fand das nicht; ein Mensch musste es erraten. Jetzt hat die Quest
   `riverton.parkclub` davor einen eigenen Schritt („Am Montag noch einmal zu Slick in den
   Pavillon gehen.“) mit Zielhinweis auf Slick, und die Tür des Wohnwagens sagt nach dem
   Clubkampf, dass Slick noch im Pavillon ist. Test: `zielsuche.test.ts`; die Gesamtsimulation
   läuft damit bis zum Abspann ohne Meldung. Im Browser nicht nachgespielt.
6. **Querformat, Deckwahl: Knopf zum Spielen unter dem Bildrand (behoben).** Bei 863 × 360 waren
   nur Bedenkzeit und der Rand der Karten zu sehen; das Fenster rollt, zeigt das aber nicht.
7. **Querformat, Laden: kein Ausgang zu sehen (behoben).** In Patels Kiosk standen nur die Waren im
   Bild, alle gesperrt, „Schließen“ lag unter dem Rand. Darunter lagen Steuerkreuz und
   Aktionsknopf verdeckt.
   Behebung für 6 und 7: In flachen Fenstern (Höhe bis 480 Pixel) bleibt der abschließende Knopf
   am unteren Rand des Fensters stehen (`abenteuer.css`). Test: die Zeile zur Deckwahl quer in
   `tests/e2e/abenteuer-randfaelle.spec.ts`. Den Laden im Querformat habe ich nach der Behebung
   nicht noch einmal im Browser angesehen.

### 5a. Hauptquest-Schritte ohne `ziel` (Reststand zu Fund 2)

Nicht geraten, weil keine Figur und kein Auslöser eindeutig passt:

| Quest, Schritt               | Knoten                                 | Warum kein `ziel`                                                                                |
| ---------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `riverton.parkclub`, 2       | `riverton-aussen.ankunft`              | Ankunft: Der Knoten läuft am Übergang vom Bahndamm; der Hinweis zeigt schon auf diesen Übergang. |
| `summitCity.endspiel`, 1     | `summit-city-aussen.ankunft_summit`    | Ankunft über die Bergstraße, wie oben.                                                           |
| `crossroads.treffpunkt`, 1   | `crossroads-aussen.ankunft_crossroads` | Ankunft über die Prärie, wie oben.                                                               |
| `pinewoodCamp.sommercamp`, 1 | `pinewood-camp-aussen.ankunft_camp`    | Ankunft über die Riesenbäume, wie oben.                                                          |
| `ironwood.clubkampf`, 5      | `ironwood-aussen.kauf`                 | Zwei Figuren führen hin: Victor und Graham Hale.                                                 |
| `portDelacroix.tiefpunkt`, 1 | `port-delacroix-turnhalle.vorwurf`     | Drei Figuren führen hin: Odile, Remy und Lou (auch im Musikhaus).                                |
| `ghostTown.fernpartie`, 2    | `erinnerung-siedlung.letzter_brief`    | In der Erinnerung führen Gideon und die Kerze hin; der Weg in die Erinnerung beginnt woanders.   |
| `ghostTown.fernpartie`, 5    | `ghost-town-aussen.nacht_ambrose`      | Sternenhimmel oder der Weg zur Hauptstadt.                                                       |
| `mapleFalls.epilog`, 1       | `maple-falls-dachboden.epilog`         | Brett auf dem Dachboden, Brett am Schreibtisch oder Ambrose im Zimmer.                           |

Die Schrittnummern zählen wie im Tagebuch ab 1. Bei den vier Ankünften fehlt nichts; bei den fünf
anderen entscheidet der Autor, wohin der Hinweis zeigen soll.

Keine Funde in den gespielten Strecken: Dialog ohne Ausgang, Brett nicht bedienbar, Übergang ohne
Reaktion, Kamera. Die Meldungen „Übergang … unerreichbar“ in den Protokollen (Schule in Maple
Falls, Kanalweg und Wohnwagen in Riverton, Wüstenzug und Deich in Port Delacroix, Felsbogen) waren
Fehler des Durchlaufs (alte Kachel nach dem Kartenwechsel, getrennte Kartenteile mit Steg).

## 6. Zoe und die Wegsperre S17

Im Browser beobachtet (Strecke C, 19.11., Hochformat): Am Diner beginnt die Stellung mit dem Zug
Dxd7, und Zoe schlägt mit Sxd7 zurück. Nach fünfzehn eigenen Zügen wertete die Hülle den Sieg, die
Truppe ließ durch, und der Übergang zur Bergstraße war offen.

Nicht im Browser gespielt: das Remis an S17 (zählt als Fehlversuch) und der Notausgang nach drei
Fehlversuchen. Dafür gelten weiter die vorhandenen Tests `abenteuer-wegsperre-partie.spec.ts` und
`src/abenteuer/dialog/wegsperre-s17.test.ts`.

S15 (Zedernwald) und S16 (Raststätte) öffneten in den Strecken A und B jeweils mit einem Sieg.

## 7. Grenzen des Durchlaufs

- Der Löser kann keine Strukturaufgaben (Felder und Bauern markieren) und baut die
  Gedächtnisstellung nicht auf. Damit endet jede Strecke spätestens in Port Delacroix.
- Fallenaufgaben beantwortet er aus den Trainerdaten, nicht aus der Stellung.
- Die Monatskarte (Reisen) benutzt er nicht; er läuft alle Wege.
- Statisten spricht er nicht an.
- Er spielt stärker als ein Leser mit 1200 und verliert nie; Niederlagen, Wiedereinstieg und
  Notausgänge kamen deshalb nicht vor.
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
