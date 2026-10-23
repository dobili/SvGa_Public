# Was noch zu tun ist (für den Autor)

Stand: 19.10.2026, Version 0.2.116. **Diese Datei ist die einzige, die du brauchst:** Hier steht
alles, was du testen oder entscheiden sollst, mit allen Informationen dazu, und nur, was noch
offen ist. Erledigtes wandert nach `docs/ENTSCHEIDUNGEN.md` (musst du nicht lesen).

**In der App (seit 0.2.75):** Halte das Zahnrad unten rechts drei Sekunden gedrückt (am Rechner:
Adresse `/app/#aufgaben`). Dann öffnet sich diese Datei als Seite: Abbildungen, Trainer,
Spielen, Einstellungen und Nachschlagen im Text sind Links, jeder Punkt hat einen Haken und eine
Notiz. „Stand in die Zwischenablage“ legt alles Abgehakte und Notierte als Text ab („N306 ok“,
„N305: Pfeil fehlt“), den du in den Chat einfügst.

**So antwortest du:** im Chat mit den Kürzeln, etwa „N203 ok“, „N205 falscher Pfeil“, „X5: so
lassen“, „T1: Vorschläge übernehmen“. Claude trägt alles ein. Bei Fehlern in der App hilft
**Einstellungen (Zahnrad) › Fehler melden**: Den kopierten Text mitschicken (App-Version,
Datenstand, Gerät), bei allem anderen kurz, **was** du getan hast und **was** passiert ist, gern
mit Bildschirmfoto.

Adresse: <https://schach-von-grund-auf.com/app/> (oder die installierte App). Vorher in den
Einstellungen prüfen, dass „App-Version 0.2.116“ dasteht; sonst die App neu laden.

Reihenfolge nach Wichtigkeit: Teil 1 testen (neueste Nummern zuerst), dann Teil 2: oben „Nur
bestätigen“ mit einem Satz („alle ok außer …“), darunter die Entscheidungen. Alle
Nummern gelten für die aktuelle Version; frühere Versionen musst du nicht mehr getrennt testen.

---

## Teil 1: Testen auf dem Handy

Alle Punkte bis 0.2.115 hast du am 19.10.2026 abgehakt; sie stehen jetzt in
`docs/ENTSCHEIDUNGEN.md`. Deine Notizen und Wünsche aus derselben Rückmeldung arbeitet Claude als
Arbeitsliste R1 bis R26 ab (`docs/FORTSCHRITT.md`). Neue Testpunkte kommen hier hinzu, sobald ein
Teil fertig ist.

### Neu auf Zweig p2-brett (Brett und Bedienung; Opus, 23.10.2026)

- [ ] N650. **Tippen (R35):** Spielen › „Partie beginnen“. Tippe den Springer g1 an, dann nicht
      genau f3, sondern knapp daneben (etwa auf den linken Rand von g3): Der Springer zieht nach
      f3. Ein Tipp in die Mitte eines anderen Feldes wählt wie bisher ab. Nur genau auf der Kante
      zwischen zwei möglichen Zielfeldern geschieht nichts, die Figur bleibt gewählt. Ein Tipp
      zählt jetzt auch, wenn der Finger dabei etwas rutscht, und gleich nach einem Wischen. Ist
      eine Figur gewählt, scrollt die Seite über dem Brett nicht. Erkennt die App deine Tipps
      jetzt zuverlässig?

### Neu in 0.2.116 (etwa 5 Minuten; deine Rückmeldung vom 19.10.2026, Opus)

- [ ] N600. **„KI“ statt „Claude“:** Abb. 8.25 öffnen. Unter der Zugleiste steht jetzt „Zugfolge
      von einer KI konstruiert, nicht aus dem Buch …“.
- [ ] N601. **Leiste nur mit Symbolen:** Die Leiste unten zeigt Buch, Training, Spielen,
      Nachschlagen und Einstellungen nur noch als größere Symbole, ohne Beschriftung (lange
      drücken auf dem Zahnrad öffnet weiter diese Seite). Gut zu treffen und klar genug?
- [ ] N602. **Einstellungen:** Öffne Einstellungen. In der Kachel „Einstellungen“ ist zuerst der
      Reiter „Training“ gewählt.
- [ ] N603. **Bots nach Stärke:** Spielen › „Vorgefertigte Bots“, eine Stufe aufklappen: Die Bots
      stehen vom schwächsten zum stärksten (Zahl unter dem Porträt), auch bei „Zum Spaß“.
- [ ] N604. **Namen der Stufen (S24):** Die Stufen heißen jetzt nach ihren Zahlen: 1 Einsteiger,
      2 Anfänger, 3 Gelegenheitsspieler, 4 Vereinsspieler, 5 Starker Vereinsspieler, 6 Experte,
      7 Meister, 8 Großmeister. Die Zahlen folgen der Skala von Lichess und chess.com, nicht der
      FIDE; deshalb klingen „Meister“ und „Großmeister“ vielleicht zu hoch. Passt es so?
- [ ] N605. **Röntgen-Trainer, Schritt 3 (N194):** Training › „Schach-Röntgen-Trainer“, bis
      Schritt 3. Der Text sagt jetzt: Schachs und alle Schläge markieren, die nach dem Abtausch auf
      dem Zielfeld kein Material verlieren; Verlustschläge darf man weglassen; die Schläge mit
      Gewinn sind die Drohungen und brauchen keine eigene Markierung. Verständlich?
- [ ] N606. **Erklärung und Zuklappen:** Öffne Abb. 2.2 und tippe das Lesezeichen „Sammlung“
      unter dem Brett: Oben im Formular steht „In die Lernsammlung“ mit Fragezeichen. Im
      Rückblick einer Partie haben „In die Fehlerdatenbank“ und „In die Lernsammlung“ jetzt ein
      Fragezeichen, und ein zweiter Tipp auf den Knopf klappt das Formular wieder zu.
- [ ] N607. **Zeichen in der Zielbilanz-Übung:** Training › „Zielbilanz-Übung“: Die Knöpfe heißen
      „✓ ja“, „◐ teils“ und „✗ nein“ wie die Zeichen im Buch.
- [ ] N608. **Klappen über „Partie beginnen“:** Spielen. Über „Partie beginnen“ stehen Farbe,
      Bedenkzeit und „Gewertete Partie“; darunter zwei Klappen: „Spielhilfen“ (mit „Züge
      zurücknehmen erlauben“, Symbole am Brett, Werkzeuge und Engine) und „Eröffnung festlegen“
      (nur aus der Grundstellung gegen die Engine). Übersichtlich so?
- [ ] N609. **Buchzitate auf Englisch (EN2):** Einstellungen › Anzeige › „English (preview)“,
      dann Nachschlagen › Endspielregeln: „The six golden endgame rules“ mit „Rule 1: Activate
      your king“ bis „Rule 6: Calculate through to promotion“. Alle 27 Zitate stehen in
      `docs/ENTSCHEIDUNGEN.md`. Passen sie, bis dein englisches Buch erscheint?
- [ ] N610. **Aufgabe wiederholen:** In jedem Trainer (etwa Training › Taktiktrainer) steht nach
      der Antwort neben „Weiter“ der Knopf „Aufgabe wiederholen“. Er setzt die Aufgabe auf den
      Anfang zurück; gezählt wird weiter nur die erste Antwort.
- [ ] N611. **Aufklapplisten in den Trainern:** Repertoire-Trainer und Abweichungsmodus (Eröffnung),
      Taktiktrainer (Thema), Endspieltrainer („Was üben?“) und Zug erraten (Partie) wählen jetzt
      aus einer Aufklappliste statt aus vielen Knöpfen. Seite und Stufe bleiben Knöpfe. Besser so?
- [ ] N612. **Zahlen im Zähltrainer:** Training › Zähltrainer › „Bilanz zählen“: Angreifer,
      Verteidiger und Gewinn stellst du jetzt mit „−“ und „+“ ein, die Zahl steht groß dazwischen.
      Überall sonst stehen Zahlen und Wörter mittig in ihren Knöpfen. Schöner so?
- [ ] N613. **Wo übe ich? (Trainingsseiten):** Im Browser
      <https://schach-von-grund-auf.com/training/kap06/> öffnen. Oben erklärt ein Satz die Marken;
      vor jeder Übung steht klein, wo du sie machst: „Lichess“, „Website“, „App“ (Abbildung im
      Text, ein Tipp öffnet sie in der App), „Brett“ (echtes Schachbrett) oder „Eigene Partien“.
      Die Texte selbst sind wie im Buch. Klar genug, oder fehlt dir noch etwas?
- [ ] N614. **Urteil der Engine nach „Erst selbst denken“ (NA1):** Einstellungen › Reiter
      „Training“ › „Auch vor Werkzeugen und Engine“ auf „an“. Abb. 1.26 öffnen, „Weiß besser“
      wählen, „Ich habe nachgedacht“. Unter dem Brett steht nach etwa drei Sekunden: „Die Engine
      sagt: ausgeglichen (+0,…), also ‚ausgeglichen‘.“ Zurück zum Buch, Abb. 1.26 noch einmal
      öffnen und „gleich“ wählen: Es kommt „Richtig eingeschätzt!“. Beim dritten Öffnen sind die
      Werkzeuge gleich da, ohne Frage. Als ausgeglichen gilt bis ±0,5 Bauern.
- [ ] N615. **Denkroutine am Brett (F2):** Training › „Denkroutine-Trainer“. Nach der Minute
      „Kandidaten am Brett ziehen“: Du ziehst Kandidat 1 auf dem Brett, dann in der Stellung
      danach die stärkste Antwort des Gegners; das Brett springt zurück, dann Kandidat 2 und seine
      Antwort. Danach rechnet die Engine wie bisher. „Letzten Zug zurücknehmen“ korrigiert einen
      Fehlgriff; denselben Kandidaten zweimal nimmt die App nicht an. Angenehmer als die Textfelder?
- [ ] N616. **Faktorenbilanz-Trainer wie im Buch:** Training › „Faktorenbilanz-Trainer“. Material
      und Zeit stellst du jetzt an einer Waage ein („◀ Weiß vorn“, „gerade“, „Schwarz vorn ▶“);
      sie neigt sich zur gewählten Seite. Königssicherheit und Aktivität bewertest du je Seite mit
      ✓ (gut), ◐ (teils) oder ✗ (schlecht) wie in der Tabelle des Buches; verglichen wird, wer
      danach vorn liegt. Passt das so?
- [ ] N617. **Partienliste mit Symbolen (ab vier Partien):** Spielen › „Deine letzten Partien“.
      Über der Liste stehen Symbole zum An- und Ausschalten: Pokal, Handschlag, Kreuz (Ergebnis),
      Stern und durchgestrichener Stern (gewertet oder nicht), heller und dunkler Kreis (deine
      Farbe), Bot, Chip und zwei Personen (Gegner: Bot, Engine nach Stufe, zu zweit). Mehrere
      zugleich: In einer Gruppe gilt „oder“, zwischen den Gruppen „und“. Darunter die Sortierung:
      Kalender (Datum), Kurve (deine Spielstärke), gekreuzte Schwerter (Stärke des Gegners) und
      ein Pfeil für die Richtung. Lange drücken oder darüberfahren zeigt den Namen jedes Symbols.
- [ ] N618. **Partie einlesen (PGN):** Spielen › „Deine letzten Partien“ › „Partie einlesen (PGN)“.
      Eine Partie von Lichess oder chess.com einfügen (oder eine .pgn-Datei wählen), deine Farbe
      wählen, „Einlesen und auswerten“. Die Partie öffnet sich als „Eingelesene Partie“ mit den
      Namen, die Auswertung läuft, und in der Liste steht sie ungewertet mit eigenem Symbol
      (Filter „eingelesene Partien“). Für deine Wertung zählt sie nicht.

### Neu in 0.2.117 (menschliche Bots, zehn Stufen; Opus, 20. bis 22.10.2026)

Die Zahlen unter den Bots kommen aus der laufenden Messung; bis sie fertig ist, zählt das
Spielgefühl.

- [ ] N620. **Zehn Stufen (dein Vorschlag vom 21.10.):** Spielen › Stufe. Die Regler für Eröffnung,
      Mittelspiel und Endspiel gehen jetzt von 1 bis 10 (Neuling bis Engine). Ohne Bot spielt die
      Stufe ohne Zusatzfehler, gemessen etwa 300 Elo je Stufe: Stufe 1 fast zufällig (etwa 270),
      Stufe 4 etwa 1050, Stufe 7 etwa 2150, Stufe 10 die volle Engine (etwa 3000). Spiele je eine
      kurze Partie gegen Stufe 1 und Stufe 4: Fühlt sich der Abstand richtig an?
- [ ] N621. **Deine alten Einstellungen:** Hattest du vorher eine Stufe gewählt oder eigene Gegner
      angelegt, sind sie umgerechnet: alte Stufe 1 → 3, 2 → 4, 3 und 4 → 6, 5 → 7, 6 → 8, 7 → 9,
      8 → 10 (nach den Zahlen, die die App bisher zeigte). Stimmt das bei dir?
- [ ] N622. **Neue Bots:** Spielen › „Vorgefertigte Bots“. 64 Bots mit neuen Namen und den bekannten
      Gesichtern, eingeordnet nach ihrer gemessenen Zahl in die Gruppen 1 bis 10, dazu vier Spaß-Bots
      (Kiki, Onkel Otto, Tante Hilde, Bodo), die zwischendurch völlig beliebig ziehen. Die Bots
      machen zusätzlich zu ihrer Stufe die Fehler, die Menschen ihrer Stärke auf Lichess machen
      (übersehene Drohungen und Taktik, mal ein grober Patzer). Fühlt sich das menschlicher an?
- [ ] N623. **Bedenkzeit der Bots:** Partie mit 5 + 3 gegen einen Bot. Er denkt sichtbar etwa eine
      halbe bis knapp drei Sekunden; seine Uhr springt dann auf den Stand nach der Bedenkzeit, die
      ein Mensch gebraucht hätte: Eröffnungszüge und Wiederschläge schnell, schwierige Stellungen
      länger. Unter einer Minute zieht er schneller und macht mehr Fehler.
- [ ] N624. **Blitz 3 + 2 und 3 + 0:** Spielen › Bedenkzeit: Es gibt jetzt auch „3 + 2“ und „3 + 0“.
- [ ] N625. **Notmodus (deine Idee vom 21.10.):** Spiele 3 + 0 gegen einen Bot und lass dir Zeit,
      bis er unter zehn Sekunden ist. Reicht seine Zeit nicht mehr, verliert er nicht sofort: Seine
      Uhr steht dann auf 0:01, und er zieht danach fast ohne Pause vorbereitete Vorzüge (je eine
      Zehntelsekunde). Passt keiner zu deinem Zug, verliert er auf Zeit. Mit 3 + 2 kommt er über
      fünf Sekunden wieder heraus. Wirkt das wie ein Mensch, der in Zeitnot vorauszieht?
- [ ] N626. **Eigene Gegner:** Spielen › „Eigene Gegner“ › neuer Gegner. Die Stufen sind seine
      Grundstärke; abgehakte Fehlerarten und blinde Flecken kommen wie bei Menschen dazu (nicht
      abgehakte sind aus). Die Zahl in der Sprechblase zieht ab, was die Zusatzfehler kosten.
      Unter „Erweitert“: Regler für die Häufigkeit insgesamt, je Fehlerart und je Fleck und der
      Höchstverlust je Art (ganz rechts „unbegrenzt“). Verständlich?
- [ ] N627. **Einstellungen › Fehlerarten:** Die Abhakliste heißt jetzt „Fehlerarten der
      vorgefertigten Bots“ und gilt nur für sie; die Stufen ohne Bot machen keine Zusatzfehler.

---

## Teil 2: Entscheiden

Zurzeit ist nichts offen. Bei den Wünschen der Arbeitsliste nimmt Claude zunächst die eigene
Empfehlung und stellt sie dir am Ende hier zur Prüfung („Schon umgesetzt, Widerspruch genügt“).
