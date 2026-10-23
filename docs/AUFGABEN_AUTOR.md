# Was noch zu tun ist (für den Autor)

Stand: 23.10.2026, Version 0.2.117 auf `main`, dazu der Zweig `p3-werkzeuge` (noch nicht auf
`main`). **Diese Datei ist die einzige, die du brauchst:** Hier steht
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

### Neu auf dem Zweig `p4-trainerinhalte` (Paket P4 Trainer-Inhalte; Fable, 23.10.2026)

Noch nicht auf main; enthält auch den Zweig `p3-werkzeuge` (N670 bis N679): Zum Testen den Zweig `p4-trainerinhalte` ansehen (oder warten, bis er
eingemischt ist). Alles unter Training.

- [ ] N690. **Falle oder Köder, neues Bild:** Training › „Falle oder Köder“ › Runde starten. Der
      Auftrag sagt jetzt: „Der Gegner hat gerade … gespielt (roter Pfeil) und bietet damit … an
      (grauer Pfeil). Falle oder Geschenk?“ Am Brett: roter Pfeil der Köder-Zug des Gegners,
      grauer Pfeil der mögliche Schlag. Vor der Antwort gibt es keinen Knopf „Warnsignale“ mehr.
- [ ] N691. **Nach der Antwort:** Bei einer Falle steht: „Nach … folgt …, und du wirst matt
      gesetzt / verlierst Material / deine Stellung ist deutlich schlechter. Du stündest x,x Bauern
      schlechter als vor dem Nehmen. Besser war … (goldener Pfeil).“ Darunter die Fortsetzung der
      Engine und die Warnsignale aus Kapitel 4 mit Marken am Brett (erst jetzt). Stimmt die
      Reihenfolge für dich?
- [ ] N692. **Keine Scheinfallen mehr:** Spiele eine Runde Stufe 1 und eine Runde Stufe 3. Jede
      „Falle“ hat eine echte Widerlegung: Nach dem Nehmen stehst du klar schlechter als vorher
      (die Aufgabe mit Wertung 753, in der Schwarz nach axb5 noch gut stand, ist weg). Fällt dir
      noch eine Aufgabe auf, bei der das Nehmen gar nicht schlecht ist? Dann Kennung aus der
      Zeile „Aus der freien Lichess-Datenbank“ notieren (Wertung genügt).
- [ ] N693. **Geschenk:** Bei einem Geschenk heißt es: „Nehmen mit … ist gut, der Zug … hat das
      Material wirklich hergegeben.“ Der rote Pfeil ist der Zug, der die Figur hängen ließ.
- [ ] N694. **Planbilanz-Übung, deine Sicht:** Training › „Planbilanz-Übung“ › Planfragen. Unter
      „Was will mein Gegner?“ fangen alle drei Antworten mit der Farbe des Gegners an („Schwarz
      will …“), keine mit deiner. Unter „Wo spiele ich?“ ist keine falsche Antwort mehr ein Satz
      über den Gegner, und keine gleicht der richtigen bis auf ein Feld.
- [ ] N695. **Figuren mit Farbe:** Unter „Welche Figur?“ heißt es „Dein Läufer c1 …“, „Deine
      Dame d1 …“; die falschen Antworten nennen andere eigene Figuren, nie gegnerische.
- [ ] N696. **Nur Mittelspiel:** In der Planbilanz-Übung kommen keine Endspiele mehr (Abb. 6.27,
      Turm gegen Springer, war dabei) und keine Eröffnungen (Abb. 6.4). Abb. 11.78 (Weiß am Zug)
      sagt jetzt „Die Kette e4–d5 zeigt dorthin“, nicht mehr „c3–b4“.
- [ ] N697. **Quadrat wie im Buch:** Training › „Endspieltrainer“ › „Kurzübungen starten“. Nach
      der Antwort auf „Holt der schwarze König den Bauern ein?“ zeigt das Brett den goldenen Pfeil
      des Bauernwegs und graue Pfeile für die übrigen Seiten des Quadrats (wie Abb. 8.35), kein
      goldenes Feld mehr; das Feld des Königs ist gold (holt ein) oder rot (zu spät).
- [ ] N698. **Schwerere Kurzübungen:** Aufgabe 5 bis 7 einer Runde: „Mit welchem Königszug holt
      er den Bauern ein?“ (drei Züge zur Wahl), „Mit welchem Zug nimmt Weiß/Schwarz die
      Opposition?“ und „Welcher Plan gilt in diesem Erkennungsbild?“ (vier Pläne als Text). Nach
      der Antwort goldener Pfeil des richtigen Zugs beziehungsweise der Name des Bildes.
- [ ] N699. **Freie Endspielaufgaben:** Endspieltrainer › „Was üben?“: Die Gruppen zeigen jetzt
      mehr Aufgaben (Bauernendspiele, Turmendspiele, Damenendspiele, Leichtfiguren). Starte eine
      Runde „Bauernendspiele“: Neben Buchstellungen kommen Aufgaben mit der Zeile „Aus der freien
      Lichess-Datenbank (Wertung …)“, Thema „Bauernendspiel“, Merksatz „Bauernendspiel aus einer
      echten Partie“. Spiel zwei davon aus: Fühlen sie sich wie echte Übungen an (du kannst
      scheitern, die Engine wehrt sich)?
- [ ] N700. **Remis halten:** Es gibt auch freie Remisaufgaben („Halte das Remis gegen die
      Engine“), vor allem in Turmendspielen. Eine davon spielen.
- [ ] N701. **Abb. 8.31 fehlt absichtlich:** Im Endspieltrainer kommt die Randbauer-Stellung
      Abb. 8.31 nicht mehr vor (Weiß zog zuerst und setzte sofort patt, du kamst nie an den Zug).
      Randbauer übst du an Abb. 8.61 und 8.63. Einverstanden?
- [ ] N702. **Strukturerkenner mit echten Stellungen:** Training › „Strukturerkenner“ › Runde
      starten. Das Brett zeigt die ganze Stellung; unter dem Brett schaltet „Nur das Skelett
      zeigen“ auf Bauern und Könige um und zurück („Alle Figuren zeigen“). Der Schalter gilt für
      alle Schritte der Aufgabe.
- [ ] N703. **Starke Felder auf der 4. bis 6. Reihe:** Schritt 1 fragt jetzt nach deiner 4. bis
      6. Reihe (deine Festlegung aus P3). Nach „Prüfen“ steht „Starke Felder: d5 (Vorposten), b6“;
      Vorposten sind die mit eigener Bauernstütze. Bei Abb. 5.8 (Najdorf, Weiß) muss d5 als
      Vorposten dabei sein.
- [ ] N704. **Feldart benennen:** Vor der Planwahl kommt (wenn die Stellung eines hergibt) ein
      Schritt „Welche Feldart ist das goldene Feld für dich?“ mit fünf Knöpfen: Loch, Schwaches
      Feld, Starkes Feld, Vorposten, Rückständiger Bauer. Nach der Wahl erklärt ein Satz die Art
      nach deinen Festlegungen. Gefragt ist immer die genaueste Art (Vorposten vor starkem Feld,
      Loch vor schwachem Feld). Passt das?
- [ ] N705. **Stellungen aus Partien:** Manche Aufgaben tragen die Zeile „Aus einer Partie des
      Buches (nach Abb. …)“: Mittelspielstellungen aus den Zugfolgen der Kapitel 2, 3, 6, 11 und
      12 (28 Stück, ab Zug 10, höchstens zwei je Zugfolge). Sind Struktur und Plan dort stimmig?

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

### Neu auf dem Zweig `p3-werkzeuge` (Werkzeuge und Strukturbegriffe; Fable, 23.10.2026)

Noch nicht auf `main`; die Punkte gelten, sobald der Zweig übernommen ist (dann steht in den
Einstellungen eine Version über 0.2.117). Die Werkzeuge findest du unter jeder Abbildung in der
Leiste unter dem Brett (Bündel „Skelett-Röntgen“, „Planfindung“, „Denkroutine“); „Sicht“ ist der
Schalter oben rechts in der Werkzeugkarte.

- [ ] N670. **Rückständiger Bauer (R44):** Abb. 5.8 öffnen, Bündel „Skelett-Röntgen“, Reiter
      „Bauern“, Sicht Schwarz. Bei d6 steht „rückständig – die Nachbarn stehen schon vor ihm,
      kein eigener Bauer deckt ihn mehr, der Gegner hält das Feld davor; Ziel auf der halboffenen
      Linie“, am Brett das Kürzel R. Abb. 5.7 (Kieseritzky), Sicht Schwarz: f7 und h7 heißen
      nicht mehr rückständig, sondern nur „besteht den Deckungstest nicht“ (U), weil kein weißer
      Bauer f6 oder h6 hält. Passt das zu deiner Festlegung?
- [ ] N671. **Löcher, starke Felder, Vorposten (R44):** Abb. 5.8, Reiter „Felder“, Sicht Weiß:
      „Starke Felder für Weiß“ mit „d5: starkes Feld – kein gegnerischer Bauer kann es mehr
      angreifen, ein eigener Bauer stützt es: ein Vorposten; erreichbar für c3 und d1“. Sicht
      Schwarz: „Löcher bei Schwarz (schwache Felder)“ mit „d5: Bauernloch – kein eigener Bauer
      kann es je wieder decken; der Gegner kann es nutzen“. Abb. 11.43, Sicht Weiß: d4 (eigene
      4. Reihe) und c5 stehen bei den starken Feldern. Unter „So prüft die App“ stehen die fünf
      Begriffe wie von dir festgelegt.
- [ ] N672. **Legende folgt der Sicht (R41):** Abb. 1.26, Symbol „Röntgen“ am Brett. Unter der
      Karte steht „Am Brett: Goldene Pfeile: Schachs, Gewinnschläge und Drohungen von Weiß. Rote
      Pfeile: Schachs und Drohungen von Schwarz …“. Nach „Sicht“ tauschen die Farben im Text.
      Dasselbe bei allen Werkzeugen mit Pfeilen oder Feldern (statt „der Seite der Sicht“ oder
      „eigene“ stehen jetzt Weiß und Schwarz).
- [ ] N673. **Nur die gewählte Seite (R41), Skelett:** Abb. 5.17, Reiter „Bauern“ (Schwarz am
      Zug): „Bauern von Schwarz“ vollständig (Deckungstest, Inseln, Linien), darunter nur noch
      „Ziele bei Weiß: d4: Isolani“. Reiter „Felder“, „Richtung“ und „Figuren“ zeigen nur noch die
      gewählte Seite; die andere über „Sicht“. Fehlt dir dabei etwas, etwa die Richtung des
      Gegners neben der eigenen?
- [ ] N674. **Nur die gewählte Seite (R41), Planbilanz:** Abb. 6.20, Bündel „Planfindung“, Reiter
      „Planbilanz“: Jede Planfrage hat nur noch die Zeile von Weiß („Weiß: Am Damenflügel …“);
      „Sicht“ zeigt Schwarz. Der Verweis auf die Planbilanz im Buch bleibt. Wo das Buch beide
      Seiten fragt oder vergleicht, bleiben beide mit Begründung unter „So prüft die App“:
      Schach-Röntgen (die Regel fragt nach den Schachs, Schlägen und Drohungen beider Seiten),
      Warnsignale (Gefahren bei dir, Ziele beim Gegner), Zielbilanz und Faktorenbilanz
      (Vergleichstabellen, Waage). Einverstanden?
- [ ] N675. **Werkzeugkarten einspaltig (R42):** Auf dem Handy stehen die Befunde jeder
      Werkzeugkarte untereinander, etwa Bündel „Denkroutine“, Reiter „Erfassen“ an Abb. 12.1. Erst
      auf dem Tablet (hochkant) oder einem breiten Bildschirm sind es zwei Spalten. Weniger
      Scrollen als vorher?
- [ ] N676. **Phase nur noch im Reiter „Phase“ (R42):** Abb. 12.1, Reiter „Erfassen“: Die Phase
      steht nur im Fazit („Mittelspiel. …“); Gründe und Werkzeuge stehen allein im Reiter „Phase“.
- [ ] N677. **Kandidaten mit Bewertung der Engine (R43):** Abb. 12.1, Reiter „Kandidaten“. Unter
      den drei Schritten rechnet die Engine etwa drei Sekunden: „Bewertung der Engine“, „Stellung
      jetzt: +… (…)“, dann je Kandidat „1. Lxh7+: +… – verbessert die Stellung um …“ oder „hält die
      Stellung“ oder „verschlechtert die Stellung um …“, zuletzt „Am stärksten nach der Engine: …“.
- [ ] N678. **Ruhige Kandidaten ohne „Material“ (R43):** Übung 12.6 öffnen, Reiter „Kandidaten“.
      Beim Buchzug g3 steht nicht mehr „Material danach …“, sondern „keine zwingende Antwort – ein
      ruhiger Zug; wie er die Stellung verändert, sagt die Engine unten“, und in Schritt 4 „… ob der
      ruhige Zug der beste ist, sagt die Bewertung der Engine unten“. Zwingende Kandidaten
      (Schachs, Schläge, Abwehrzüge im Schach) behalten den Materialstand. Richtig so?
- [ ] N679. **Kandidaten in der Partie:** Gegen die Engine spielen, nach ein paar Zügen die
      Werkzeuge öffnen, Bündel „Denkroutine“, „Kandidaten“: Der Engine-Abschnitt erscheint auch
      hier (ohne Buchzug). Die Pfeile am Brett folgen der Sicht, die Legende nennt deine Farbe.

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

Bei den Wünschen der Arbeitsliste nimmt Claude zunächst die eigene Empfehlung und stellt sie dir
hier zur Prüfung („Schon umgesetzt, Widerspruch genügt“). Buchbefunde bleiben Rückfragen, weil
nur du das Buch änderst.

### P3 Strukturbegriffe (R44): Vorschläge für das Buch (23.10.2026)

Deine fünf Festlegungen (rückständiger Bauer, Bauernloch, schwaches Feld, starkes Feld,
Vorposten) sind in der App umgesetzt: im Skelett-Röntgen (Felder, Bauern, Figuren), im
LAP-Vorschlag und in den Texten. Das Glossar der App ist das Glossar des Buches (die Pipeline
liest es aus dem LaTeX), deshalb stehen die Begriffe dort noch in der alten Fassung. Die Stellen
im Buch, die von den Festlegungen abweichen, mit einem Formulierungsvorschlag je Stelle. Du
änderst das Buch; sobald der Buchstand kommt, baut die Pipeline das Glossar neu.

- [ ] B9. **Glossar „Rückständiger Bauer“.** Jetzt: „Ein Bauer, der hinter seinen Nachbarbauern
      zurückgeblieben ist: Sie stehen schon vor ihm und können ihn nicht mehr decken. Vor ihm
      liegt ein Loch.“ Es fehlen „am Vorrücken gehindert“ und „Ziel auf der halboffenen Linie“.
      Vorschlag: „Ein Bauer, der hinter den eigenen Bauern auf den Nachbarlinien zurückgeblieben
      ist: Sie stehen schon vor ihm und können ihn nicht mehr decken, und das Feld vor ihm hält ein
      gegnerischer Bauer, sodass er nicht mehr vorrücken kann. Vor ihm liegt ein Loch; auf der
      halboffenen Linie wird er zum Angriffsziel (Kapitel 5).“
- [ ] B10. **Kapitel 5, Abschnitt „Der rückständige Bauer“ und die Tabelle der Bauernschwächen.**
      Der Text sagt: „Zum Dauer-Angriffsziel wird er, wenn der Gegner die Linie vor ihm mit einem
      Turm besetzen kann. Ob er sich jemals durch einen eigenen Vorstoß befreien kann, hängt davon
      ab, ob das Feld vor ihm ausreichend gedeckt ist.“ Vorschlag für den ersten Absatz: „Ein
      rückständiger Bauer ist hinter seinen Nachbarbauern auf den angrenzenden Linien
      zurückgeblieben. Anders als ein Isolani hat er zwar noch Nachbarn, die aber bereits vor ihm
      stehen und ihn nicht mehr decken können. Rückständig im vollen Sinn ist er, wenn ihn auch
      das Vorrücken nicht befreit, weil ein gegnerischer Bauer das Feld vor ihm kontrolliert. Auf
      der halboffenen Linie wird er zum Dauer-Angriffsziel: Der Gegner stellt einen Turm davor und
      eine Figur auf das Loch.“ In der Tabelle (Spalte „Warum deckt kein Bauer?“): „die Nachbarn
      stehen schon vor ihm, das Feld davor hält der Gegner“.
- [ ] B11. **Glossar „Loch (Bauernloch)“.** Jetzt: „Ein Feld, das kein eigener Bauer mehr
      kontrollieren kann. Für den Gegner kann es ein starkes Feld sein.“ Vorschlag: „Ein Feld,
      meist auf der 3. bis 5. Reihe (von dir aus gezählt), das kein eigener Bauer je wieder
      kontrollieren kann. Für den Gegner ist es ein starkes Feld, ein Nistplatz für seine Figuren
      (Kapitel 2 und 5).“
- [ ] B12. **Glossar, neuer Eintrag „Schwaches Feld“** (fehlt im Buch; die App nennt ihn als
      Oberbegriff bei den Löchern): „Oberbegriff für jedes Feld, das dauerhaft kein eigener Bauer
      mehr decken kann. Ein Loch ist ein schwaches Feld; vor jedem rückständigen Bauern liegt
      eines (Kapitel 5).“
- [ ] B13. **Glossar „Starkes Feld“ und Kapitel 5, Abschnitt „Starke Felder und Vorposten“ samt
      Checkliste zur Leitfrage 1.** Glossar jetzt: „Ein Feld in der gegnerischen Hälfte, das kein
      gegnerischer Bauer mehr angreifen kann.“ Abschnitt: „meist auf der 5. oder 6. Reihe“,
      Checkliste: „vor allem auf der 5. und 6. Reihe“. Deine Festlegung sagt 4. bis 6. Reihe; die
      4. Reihe liegt aber in der eigenen Hälfte (Abb. 11.43: „d4 und c5 kann kein schwarzer Bauer
      mehr angreifen: zwei sichere Felder für weiße Figuren“). Vorschlag Glossar: „Ein Feld auf
      der 4. bis 6. Reihe (von dir aus gezählt), meist in der gegnerischen Hälfte, das kein
      gegnerischer Bauer mehr angreifen kann (Kapitel 5).“ Im Abschnitt und in der Checkliste
      entsprechend „auf der 4. bis 6. Reihe“. Die App rechnet schon so.
- [ ] B14. **Glossar „Vorposten“ und derselbe Abschnitt in Kapitel 5.** Jetzt: „Ein starkes Feld,
      das eine eigene Figur dauerhaft und sicher besetzen kann. Am stärksten ist er, wenn ihn
      zusätzlich ein eigener Bauer stützt.“ Nach deiner Festlegung gehört die Bauernstütze zur
      Definition. Vorschlag Glossar: „Ein starkes Feld, das zusätzlich ein eigener Bauer deckt
      und auf dem eine eigene Figur steht oder stehen soll, am besten ein Springer (Kapitel 5).“
      Vorschlag für den Abschnitt: „Ein Vorposten ist ein starkes Feld, das zusätzlich ein eigener
      Bauer stützt und auf das eine Figur gehört, am besten ein Springer: Der Gegner kann sie dort
      nur gegen eine eigene Figur tauschen.“ Checkliste, zweiter Punkt, passt schon („am besten
      auf ein Feld, das ein eigener Bauer stützt: Dann ist es ein Vorposten“).

Schon umgesetzt in der App (Widerspruch genügt): Ein Bauer, dessen Nachbarn vor ihm stehen, den
aber kein gegnerischer Bauer am Vorrücken hindert, heißt nicht mehr „rückständig“ (R), sondern
fällt nur durch den Deckungstest (U); ebenso einer, dem ein gegnerischer Bauer direkt
gegenübersteht (blockiert, kein Ziel auf der Linie). Dadurch zählt die App ihn auch nicht mehr als
festgelegten Bauern für den schlechten Läufer (Abb. 5.7: Läufer c8 ist nicht mehr „schlecht“;
Abb. 11.77: Läufer c2 ist es jetzt). Starke Felder beginnen auf der eigenen 4. Reihe (bisher 5.).
Der Strukturerkenner (Trainer) rechnet noch mit der alten Zeile „5. und 6. Reihe“; das übernimmt
Paket P4.

### P3 Werkzeuge: schon umgesetzt, Widerspruch genügt (23.10.2026)

- **R41 Sicht.** Die Legende jeder Werkzeugkarte nennt die Farben der gewählten Sicht. Felder,
  Bauern, Richtung, Figuren und Planbilanz zeigen nur die gewählte Seite (Bauern: die Schwächen
  des Gegners bleiben als Ziele, weil die Tabelle in Kapitel 5 zu jeder Schwäche den Plan dagegen
  nennt). Beide Seiten bleiben, wo das Buch beide fragt oder vergleicht: Schach-Röntgen („Kann
  mein Gegner mich mit Schach überraschen? Welche Figuren können auf beiden Seiten geschlagen
  werden?“), Warnsignale (Kapitel 12, Schritt 1: „auf beiden Seiten des Brettes“), Zielbilanz
  und Faktorenbilanz (Tabelle und Waage sind Vergleiche); die Begründung steht jeweils unter „So
  prüft die App“. Empfehlung: so lassen.
- **R42 Reiter.** Doppelte Inhalte gefunden und entfernt: die Phase in „Erfassen“ (jetzt nur im
  Reiter „Phase“). Bewusst gelassen: „Figuren“ nennt die Springerfelder und Turmlinien noch
  einmal, weil Leitfrage 4 genau danach fragt („Springer auf Löcher, Türme auf offene Linien“);
  die Planbilanz fasst Wo?, Gegner? und LAP zusammen, wie die Tabelle im Buch; die sechs
  Endspielregeln nennen Opposition und Quadrat als Regel, die eigenen Reiter rechnen sie aus.
- **R43 Kandidaten.** Ruhige Kandidaten sind der Buchzug und die Mattabwehr; zwingende Kandidaten
  (Schachs, Schläge, Drohungen, Abwehrzüge im Schach) behalten „Material danach“, weil das Buch in
  Schritt 4 nach Material zählt und die Beispiele (Abb. 12.3, 12.4) so aufgehen. Die Engine
  bewertet aber alle Kandidaten, nicht nur die ruhigen. „Hält die Stellung“ gilt bis 0,3 Bauern
  Unterschied (die Grenze „ausgeglichen“ der App).


### Paket P4 Trainer-Inhalte (Zweig `p4-trainerinhalte`, Fable, 23.10.2026) – nur bestätigen

- [ ] P4-1. **Maßstab der Falle.** Eine Falle ist eine Aufgabe, in der der Leser nach dem Nehmen
      mindestens 1,5 Bauern schlechter steht als vor dem Nehmen (vor dem Nehmen = sein bester Zug)
      und danach mindestens 0,8 Bauern im Minus liegt (Engine, Tiefe 18). Die zweite Grenze
      sorgt dafür, dass „ich stand auf Gewinn und stehe jetzt nur noch gleich“ keine Falle ist;
      sie liegt bei 0,8 wie die Remisgrenze des Endspieltrainers, weil das
      Blackburne-Shilling-Gambit (Abb. 4.41) genau −0,88 misst und eine Falle bleiben soll.
      Geschenk: Nehmen ist höchstens 0,3 hinter dem besten Zug und lässt den Leser nicht im
      Minus. Schon umgesetzt, Widerspruch genügt.
- [ ] P4-2. **Lichess-Fallen ohne Matt.** Lichess-Aufgaben mit Thema „crushing“ oder einem
      Mattthema geben keine Fallen mehr her: Dort wäre die Lehre „setze matt statt zu schlagen“,
      nicht „erkenne den Köder“. Fallen stammen aus Aufgaben, in denen der Leser vorher
      ausgeglichen oder besser steht (Median vor dem Nehmen +4, danach −6). Schon umgesetzt.
- [ ] P4-3. **Buchbefund: drei Schläge mit „?“ sind laut Engine keine Fallen.** Aus den
      Zugfolgen der Kapitel 2 und 3 fallen nach dem neuen Maßstab heraus: Abb. 2.129, 5. Sxd5
      (nach exd5; Engine: nach dem Schlag −0,97, der beste Zug Sa5 steht bei 0,0: etwa ein Bauer
      schlechter, keine Widerlegung); Abb. 2.49, 3... Sxe4 (nach 3. Sxe5; −0,75 statt −0,39 mit
      d6: Schwarz steht nur wenig schlechter, weil er nach 4. De2 Sf6?? 5. Sc6+ ausweichen kann);
      Abb. 3.30, 10. Dxe5 (nach Sc3; 0,0 statt +0,77). Die Fragezeichen im Buch bleiben Sache des
      Autors; im Trainer sind diese drei Stellungen nicht mehr. Soll eines der Zeichen im Buch
      zu „?!“ werden?
- [ ] P4-4. **Planbilanz nur im Mittelspiel.** Planfragen, LAP und Wettrennen gibt es nur noch
      an Stellungen, die die App als Mittelspiel einordnet (49 Stellungen aus Kapitel 6 und 11,
      vorher 72 mit 16 Endspielen und 7 Eröffnungen). Die Warum-Fragen der vorbereiteten Texte zu
      Kapitel 6 bleiben unabhängig von der Phase. Lichess-Stellungen braucht es dafür nicht.
      Schon umgesetzt.
- [ ] P4-5. **Hauptkette.** Zeigen mehrere Ketten einer Seite zum selben Flügel, nennt der
      Trainer die längste, bei gleicher Länge die zentralste (Abb. 11.78: e4–d5 statt c3–b4).
      Das gilt im Trainer; im Werkzeug „Wo spiele ich?“ nennt die Kettenwahl noch die erste
      gefundene Kette (Hinweis an P3). Schon umgesetzt.
- [ ] P4-6. **Freie Endspielaufgaben.** 119 Aufgaben der Lichess-Datenbank (CC0) im
      Endspieltrainer: höchstens acht Steine, genau eine Figurenart (Bauern-, Turm-, Damen-,
      Leichtfigurenendspiel), Gewinn ab +2,0 oder Matt, Remis bis ±0,8 (Tiefe 18), nie trivial
      (mindestens ein Zug des Lesers verfehlt das Ziel), je Thema, Stufe und Ziel höchstens fünf,
      Stufe nach der Lichess-Wertung wie im Taktiktrainer. Neue Themen „Bauernendspiel“ und
      „Damenendspiel“ mit eigenem Merksatz; die Gruppe „Dame gegen Bauer“ heißt jetzt
      „Damenendspiele“. Schon umgesetzt, Widerspruch genügt.
- [ ] P4-7. **Kurzübungen.** Drei neue Arten (Zug ins Quadrat, Zug zur Opposition, Plan zum
      Erkennungsbild), eine Runde hat weiter acht Aufgaben, die sieben Arten reihum. Mehr
      Aufgaben je Runde? Schon umgesetzt mit acht.
- [ ] P4-8. **Feldart-Frage: die genaueste Art zählt.** Ein Vorposten ist auch ein starkes Feld,
      ein Loch auch ein schwaches Feld; im Trainer gilt nur die genaueste Benennung als richtig,
      der Erklärsatz nennt den Oberbegriff mit. „Schwaches Feld“ ist als Antwort nur dann richtig,
      wenn das Feld außerhalb deiner 3. bis 5. Reihe liegt (etwa ein nicht mehr deckbares Feld
      auf der 6. Reihe). Schon umgesetzt, Widerspruch genügt.
- [ ] P4-9. **Partiestellungen für den Strukturerkenner** aus den Zugfolgen des Buches statt aus
      fremden Partien: Regel 1 (das Buch ist die Quelle), und die Zugfolgen sind freigegeben.
      Lichess-Aufgabenstellungen sind taktisch und taugen nicht für Strukturen. Reicht das, oder
      sollen zusätzlich Stellungen aus den Lichess-Partien der Bot-Daten dazu?


