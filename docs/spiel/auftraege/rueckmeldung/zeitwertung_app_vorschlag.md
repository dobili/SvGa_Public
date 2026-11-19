# Zeitwertung: Umsetzung im Spiel und Vorschlag für die App (19.11.2026, mittel-4)

Teil A beschreibt, was im Spiel eingebaut ist; Teil B ist der Vorschlag für die App (dort ist
nichts eingebaut).

## Teil A: Spiel (eingebaut)

### Regel

Wunsch des Autors: Wo Gegner die Zeitwahl anbieten (Deckwahl: ohne Uhr, Schnellschach 10 + 5,
Blitz 3 + 2), wird wie in der App gewertet. A bleibt eine Zahl auf dem Schnellschach-Maßstab.

1. **Klasse der Partie:** `wertungstempo` der gewählten Uhr aus `spiel/elomodell.ts`. Ohne Uhr gilt
   Schnellschach. Die genutzte Zeit stuft nur herab (`regeln/zeitwertung.ts`, ab 20 eigenen Zügen).
2. **A und Gegner in dieser Klasse:**
   - A_k = `wertungInZeitklasse(A)`
   - Z_k = `zahlInZeitklasse(Z)` + `uhrAbzug` (aus `engine/zeitklassenabstand.ts` und
     `engine/botstaerke.ts`)
   - Das ist dieselbe Gegnerzahl je Zeitklasse wie in der App. Der Bot spielt dort in Blitz wie ein
     Mensch dieser Blitz-Zahl.
3. **Elo-Schritt in der Klasse:** A_k' = A_k + K · (Ergebnis − Erwartung(A_k, Z_k)).
4. **Zurück auf Schnellschach:** mit derselben Abstandsrechnung, als Umkehrung von
   `wertungInZeitklasse` (`schnellschachAus`).
5. **Begegnungen ohne Zeitwahl bleiben, wie sie sind**, auch mit fester Uhr.

### Wo es steht

- **Reine Funktionen:**
  - `app/src/abenteuer/regeln/zeitwertung.ts`: genutzte Zeit, ohne Importe, für die App übernehmbar.
  - `app/src/abenteuer/regeln/zeitklassenwertung.ts`: Klasse, Schritt, Umkehrung.
- **Einbau:**
  - `regeln/wertung.ts`: `nachStoryPartie` bekommt die Zeitlage.
  - `regeln/rueckweg.ts`: setzt die Zeitlage zusammen.
  - `oberwelt/partiestart.ts`: vermerkt beim Start `zeitwahl` und `uhrAbzug` in der laufenden
    Wertung.
  - `anbindung/partieergebnis.ts`: Uhrstand am Ende als `uhrbilanz` im Partieergebnis.
- **Spielstand:** Neue, optionale Felder: `laufendeWertung.zeitwahl`, `laufendeWertung.uhrAbzug`,
  `Partieergebnis.uhrbilanz`. Ältere Stände laufen weiter.

### Zahlen aus der Story

K = 20; in Klammern der bisherige Schritt (Schnellschach):

| Partie                                    | Blitz-Niederlage | Blitz-Sieg      |
| ----------------------------------------- | ---------------- | --------------- |
| Clubchef 1 in Maple Falls (A 800, Z 1020) | 794,1 (795,6)    | 817,2 (815,6)   |
| Gleich starker Gegner (A 1000, Z 1000)    | 987,2 (990)      | 1012,8 (1010)   |
| A 1500 gegen Z 1700                       | 1495,7 (1495,2)  | 1515,1 (1515,2) |

### Befund: Die App-Regel lässt Blitz nicht weniger zählen

- **Zur Frage nach dem Maßstab des Bots:**
  - Seine feste Zahl Z steht auf dem Schnellschach-Maßstab.
  - In der App spielt er in Blitz wie ein Mensch der Blitz-Zahl Z_k. Das Wahlmodell ist nach der
    Wertung in der Zeitklasse geeicht (`engine/wahlkorrektur.ts`), er wird mit der Uhr also
    „menschlich langsamer“.
- **Folge:** Spieler und Gegner werden um denselben Abstand verschoben, die Erwartung bleibt fast
  gleich.
- **Bei Einsteigern ist die Blitz-Skala gestaucht** (Schnellschach 1000 → Blitz 882, 1290 → 1121).
  Ein Schritt von K Blitz-Punkten ist dort beim Zurückrechnen bis zu einem Viertel mehr
  Schnellschach-Punkte.
- **Ergebnis:** Eine geblitzte Niederlage senkt A etwas mehr als eine bedachte, und ein geblitzter
  Sieg bringt etwas mehr. Das entspricht der App, wo eine Blitz-Partie die Blitz-Wertung genauso
  bewegt.
- **Abweichung von der früheren Nachricht:** Der Wunsch „geblitzte Niederlage senkt A weniger,
  geblitzter Sieg bringt nicht mehr als nötig“ aus dieser Nachricht ergibt sich so nicht. Weil die
  spätere Anweisung „genau wie in der App“ galt, ist die App-Regel eingebaut.

### Option (nicht eingebaut): Gewicht für schnellere Klassen

Soll Blitz für A ausdrücklich weniger zählen (wie beim Weltschachbund, wo Blitz die
Langschach-Zahl nicht berührt), wäre die einfachste saubere Regel ein Gewicht auf K:

- Blitz zählt mit K × 0,5 und wird mit derselben Rechnung zurückgehoben.
- Eine geblitzte Niederlage gegen den Clubchef 1 kostete dann etwa 3 statt 6 Punkte.
- Ein geblitzter Sieg brächte etwa 9 statt 17.
- Beides ist eine Änderung an einer Zeile in `schrittInKlasse` (Faktor je Klasse) mit Tests.

### Klassisch

Im Spiel gibt es keine klassische Zeitwahl (`regeln/zeitkarten.ts`, `ZEITKLASSEN`: ohne,
schnell, blitz). Nicht hinzugefügt. Empfehlung: Wenn gewünscht, als „Klassisch 30 + 20“ wie in der
App. Die Rechnung oben kann es schon (`classical`).

### Partien ohne Uhr

- **Zugzeiten:** Die Partie speichert keine Zugzeiten. Es gibt nur die Gesamtdauer von Beginn bis
  Ende (`Partieergebnis.sekunden`), und darin stecken die Bedenkzeit des Gegners, die Animationen
  und Pausen (App im Hintergrund).
- **„Durchrauschen“** ließe sich daraus nur grob schätzen und würde Leser mit Pausen falsch
  einordnen.
- **Empfehlung:** Ohne Uhr bleibt Schnellschach (so auch der Wunsch des Autors). Will man es
  später, müsste die Partie je Zug die Zeit seit dem letzten Gegnerzug speichern; das wäre ein
  neues Feld in `spiel/partie.ts`.

### Ambroses Zeit-Hinweise (eingebaut)

- **Wo es steht:** `regeln/zeithinweis.ts`, `regeln/zeithinweis-lage.ts`, `anbindung/Zeithinweis.tsx`.
- **„zu schnell“ und „zu langsam“ in der Partie:**
  - Ab dem 10. eigenen Zug, mit 8 Zügen Abstand, höchstens zweimal je Partie.
  - Erst nach der ersten Clubnadel.
  - Ambrose schweigt, wo er nicht da ist, und gegen sich selbst am Reisebrett.
  - „Zu langsam“ gibt es nicht unter 30 Sekunden; dort spricht schon das Tischgespräch zur Zeitnot.
- **Am Ende:** Einmal kommt ein Satz, wenn eine Schnellschach-Partie mit Zeitwahl als Blitz zählt.
- **Platz und Texte:** Die Sätze stehen in der Sprechblase unten (nie über dem Brett), unter
  `tisch.ambrose.zuSchnell.*`, `tisch.ambrose.zuLangsam.*` und `tisch.ambrose.geblitzt.*`.

## Teil B: Vorschlag für die App (nicht eingebaut)

Idee des Autors: Wer eine Partie mit 15 Minuten spielt, aber nur 2 Minuten nutzt, hat in
Wahrheit geblitzt; die Partie soll dann als Blitz zählen. Im Spiel liegt die Logik schon als
eigenständige, reine Funktion vor. Dieser Vorschlag beschreibt, wie die App sie übernehmen kann.
In der App ist noch nichts eingebaut. Eine erste Fassung war probeweise gebaut und mit allen
Prüfungen grün; sie wurde auf Wunsch des Autors wieder entfernt. Die Stellen unten sind also
belegt, nicht geschätzt.

### Die Funktion

Für die App gilt dieselbe Rechnung, als Option beschrieben. Eine herabgestufte Partie zählt in
der Kette der schnelleren Klasse, mit der Gegnerzahl in dieser Klasse (`zahlInZeitklasse`). Ein
Gewicht wie in Teil A wäre auch in der App möglich, würde aber die Ketten je Zeitklasse verwässern;
dort ist es weniger nötig, weil jede Klasse ihre eigene Zahl hat.

`app/src/abenteuer/regeln/zeitwertung.ts` hat keine Importe. Die App kann die Datei nach
`app/src/spiel/` verschieben oder kopieren; das Spiel importiert sie dann von dort.

- `zeitwertung(bilanz)`: Die Eingabe enthält Grundzeit, Zuschlag, eigene Züge, ob der Leser den
  ersten Zug machte, und die Restzeit am Ende. Die Ausgabe enthält die genutzte Zeit, den Schnitt
  je Zug, die eingestellte und die gewertete Klasse. Mit weniger als 20 eigenen Zügen ist sie
  `null`.
- `klasseDerDauer`, `klasseDerBedenkzeit`: Sie nutzen die Grenzen von Lichess, dieselben wie
  `spiel/zeitklasse.ts`. Beim Übernehmen sollte `spiel/zeitklasse.ts` `klasseDerDauer` aus der
  Funktion nutzen, damit die Grenzen nur einmal im Code stehen.
- Tests: `app/src/abenteuer/regeln/zeitwertung.test.ts` (7 Fälle).

### Schwellen

- **Genutzte Zeit:** Grundzeit + Zuschlag × Zuschläge − Restzeit am Ende. Der allererste Zug der
  Partie bekommt keinen Zuschlag, weil `spiel/uhr.ts` mit `druecke` dann nur die Gegneruhr
  startet. Zuschläge = eigene Züge − 1, wenn der Leser begann, sonst gleich der Zahl der eigenen
  Züge.
- **Geschätzte Dauer:** Schnitt je eigenem Zug × 40. Die Einordnung ist: unter 180 s Bullet,
  unter 480 s Blitz, unter 1500 s Schnellschach, sonst klassisch.
- **Nur herabstufen:** Gewertet wird in der schnelleren der beiden Klassen (eingestellt,
  effektiv).
- **Mindestlänge:** Erst ab 20 eigenen Zügen wird umgestuft. Ein frühes Matt oder eine frühe
  Aufgabe bleibt in der eingestellten Klasse.
- **Wertung kennt kein Bullet:** Die App-Wertung hat nur `blitz`, `rapid` und `classical`
  (`spiel/elomodell.ts`, `WERTUNGSTEMPI`). Bullet wird dort deshalb als Blitz gewertet.
- **Beispiele mit 15 + 10:** 4 s je Zug → Blitz; 10 s → Blitz; 15 s → bleibt Schnellschach.
- **Beispiel mit 60 + 0:** 30 s je Zug → Schnellschach.

### Betroffene Stellen der App

#### Neu: `spiel/genutzteZeit.ts` (Brücke von der Partie zur Funktion)

- `wertungstempoDerPartie(partie): Wertungstempo`
  - Die Bilanz kommt aus `partie.einstellung.uhr` und dem Uhrstand am Ende (`partie.uhr.restMs`
    der eigenen Farbe).
  - Die eigenen Züge kommen aus `partie.zuege.length`, der Seite am Zug der `startFen` und
    `eigeneFarbe`.
  - Ohne Uhr bleibt `wertungstempo(uhr)`.
- `herabstufung(partie)`: liefert `{ tempo, sekunden }` für die Anzeige oder `null`.
- **Schutz:** Eine Uhr, die nie lief (`partie.uhr.seitMs === 0`, Stand wie `neueUhr`), gilt wie
  keine Uhr. Sonst würde eine Partie ohne gedrückte Uhr als extrem schnell gewertet.
- **Uhrstand am Ende:** `spiel/ablauf.ts` hält die Uhr am Partieende an (`halte`). `restMs` ist
  dann der Endstand, und `seitMs` ist größer als 0.

#### Geändert: `spiel/wertung.ts`, drei Stellen, je `wertungstempo(p.einstellung.uhr)` → `wertungstempoDerPartie(p)`

1. `staerkeDerPartie`: Das Elo-Modell schätzt die Spielstärke der Partie mit dem Zeitklassen-Modell
   der gewerteten Klasse.
2. `staerkeLetzterPartien`: Filter der Partien je Zeitklasse (Karte „Deine Spielstärke“).
3. `wertungspunktFuer`: In diese Kette geht der neue Wertungspunkt; `tempo` steht im Punkt.

#### Geändert: Anzeige `ui/komponenten/partie/Ergebniskopf.tsx`

- Unter der Zeile „Matt … im 29. Zug“ steht bei gewerteten, herabgestuften Partien ein Satz mit
  `data-testid="ergebniskopf-herabgestuft"`.
- Neue i18n-Schlüssel in `de.json` und `en.json`:
  - `auswertungneu.herabgestuft`: „Gewertet als {zeitklasse}: im Schnitt {sekunden} Sekunden je
    Zug.“ / „Rated as {zeitklasse}: {sekunden} seconds per move on average.“
  - `auswertungneu.herabgestuftEins`: für 1 Sekunde oder weniger, „… im Schnitt etwa eine Sekunde
    je Zug.“
- Den Namen der Zeitklasse liefert `zeitklassenname` aus
  `ui/komponenten/fortschritt/wertungstext.ts`.

#### Bewusst nicht geändert (Empfehlung)

Diese Stellen beschreiben die Einstellung der Partie, nicht die Leistung des Lesers:

- `speicher/besiegt.ts`: „besiegt“ je Zeitklasse
- `ui/komponenten/partienliste/Partiezeile.tsx`: Zeitartzeichen in der Partienliste
- `spiel/botzeit.ts`, `engine/botstaerke.ts`: Zeitmodell und Stärke der Bots
- `training/rivalenfolge.ts`
- Spielstart: `uhrwahl`, `vorbelegung`, `Vorschlagskarte`, `useVorschlaege`

Wer in der Partienliste trotzdem die gewertete Klasse sehen will, könnte in `Partiezeile.tsx`
das Zeichen über `wertungstempoDerPartie` wählen. Das würde ich aber erst nach Rückmeldung des
Autors tun.

### Alte Partien

- **Kein neues Speicherformat:** Alles kommt aus dem gespeicherten Uhrstand.
- **Schon gezählte Wertungspunkte bleiben**, wie sie sind; sie tragen ihr `tempo` und werden nicht
  neu berechnet. Eine Neuberechnung der Ketten aus allen Partien wäre möglich, würde aber
  vertraute Zahlen des Lesers verschieben. Ich empfehle sie nicht.
- **Rückwirkende Folge:** `staerkeLetzterPartien` und `staerkeDerPartie` rechnen bei jedem Aufruf
  neu. Alte Partien mit Uhr, die schnell gespielt wurden, wandern deshalb sofort in die
  Spielstärke-Schätzung der schnelleren Klasse. Das ist erwünscht (die Schätzung wird
  ehrlicher), sollte aber in den Notizen zur Version stehen.

### Nötige Tests

- `spiel/zeitklasse.test.ts`:
  - `klasseDerDauer` an den Grenzen
  - 15 + 10 mit 4, 10 und 15 s je Zug
  - 3 + 2 und 60 + 0 (nur herabstufen)
  - unter 20 Zügen
  - Schwarz mit 19 Zügen
  - ohne Uhr; Uhr nie gelaufen
  - Zeitüberschreitung
  - Eine Testpartie: Spanisch, Breyer, 39 Halbzüge; Weiß hat 20 Züge.
- `spiel/wertung.test.ts`: 15 + 10 mit 4 s je Zug → `wertungspunktFuer(...).tempo === "blitz"`,
  `staerkeLetzterPartien(..., "blitz")` nicht null, `"rapid"` null; mit 30 s je Zug bleibt `rapid`.
- **Vorsicht bei vorhandenen Tests:** Ein Testhelfer, der Partien mit Uhr ohne gedrückte Uhr baut,
  hat `seitMs === 0`. Der Schutz oben hält solche Tests unverändert. Ohne den Schutz würden sie
  herabgestuft.
- **e2e:** Eine ganze Partie mit 20 eigenen Zügen ist in Playwright teuer. Ein Komponententest des
  Ergebniskopfs mit fertiger Partie genügt.

### Mögliche Konflikte

- **Abenteuer:** Partien aus dem Spiel mit `zaehltFuerApp` landen als Partien der App mit Uhr und
  würden ebenfalls umgestuft. Das passt zur Idee. Die Abenteuerwertung A (`regeln/wertung.ts`)
  hat keine Zeitklassen und bleibt unberührt.
- **Pausen:** Steht die Uhr in einer Pause, startet der nächste Druck die Gegneruhr ohne
  Zuschlag. Die genutzte Zeit wirkt dann etwas länger, also eher langsamer. Eine Partie wird
  dadurch nie zu Unrecht herabgestuft.
- **Eigene Stufen und Bots mit Zeitmodell:** Die Bots spielen weiter nach der eingestellten Uhr.
  Nur die Wertung des Lesers wechselt die Klasse.
- **Anzeige der Uhr in der Startleiste:** Sie bleibt bei der Einstellung. Der Leser erfährt die
  Umstufung erst im Ergebnis, das ist gewollt.
