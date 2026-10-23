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

### Neu in P6: englische Buchdaten (Opus, 23.10.2026; testbar, sobald P6 auf main ist)

Alle Buchdaten gibt es jetzt auch auf Englisch: Bildunterschriften, Abschnittstitel, Übungen,
Warum-Fragen, Bilanzen, Fallenchecks, Steckbriefe, Glossar und Nachschlagen. Die Trainer
(Taktik, „Falle oder Köder“, Strukturerkenner, Endspiel) zeigen ihre Aufgabentexte vorerst
weiter deutsch; deshalb bleibt Englisch eine Vorschau. Zum Testen jeweils Einstellungen ›
Anzeige › „English (preview)“.

- [ ] N730. **Kapitel und Lernziele:** Book: Die Kapitel heißen englisch („Basic principles of
      chess“, „Endgame deep dive“ …). Ein Kapitel öffnen: Abschnitte, Kacheltexte und die
      Lernziele unter „Master checklist“ sind englisch.
- [ ] N731. **Bildunterschriften:** Abb. 1.2: „After 2. Bf4 – Goal 1: the pawn occupies d4
      (gold) …“. Züge stehen mit englischen Buchstaben (B, N, R, Q), auch in den Kacheln unter
      dem kleinen Brett.
- [ ] N732. **Übungen:** Kapitel 1 › Übung 4 („Drohung ignoriert?“): Nach dem Lösen steht
      „Knight fork with check. Instead of saving the attacked knight, White gives check: 1. Nc7+!
      …“. Der Lösungszug wird mit englischer Notation erkannt.
- [ ] N733. **Warum-Fragen:** Abb. 1.26: „Why is 6. Bd3 inaccurate?“ mit drei englischen
      Antworten und der Erklärung „Three against three becomes three against two …“.
- [ ] N734. **Steckbriefe und Bilanzen:** Kapitel 2: Die Eröffnungen heißen „Ruy Lopez“,
      „Italian Game“, „Petrov Defense (Russian Game)“ usw.; Zielbilanzen und Faktorenbilanzen
      (Kapitel 3, etwa Königsgambit) zeigen „Material“, „Time“, „King safety“, „Activity“ mit
      ✓ ◐ ✗ wie im Deutschen.
- [ ] N735. **Fallenchecks:** Kapitel 4, eine Falle (etwa „Légal Trap“): Die Zeilen heißen wie
      die Warnsignale und Prüffragen der App („Gift“, „Two replies ahead“, „Pin check“ …).
- [ ] N736. **Glossar:** Nachschlagen › Glossary: 255 englische Stichwörter nach dem englischen
      Alphabet („50-move rule“, „Active rook“ …). „Discovery“ antippen: Der Verweis führt zu
      „Discovered attack“, „See also“ zu „Long-range piece“.
- [ ] N737. **Nachschlagen:** Thinking routine (vier Schritte, Safety check, die drei Phasen
      Opening/Middlegame/Endgame mit ihren Werkzeugen) und Master checklist sind englisch.
- [ ] N738. **Ganze Kapitel ohne Deutsch:** Claude hat jedes Kapitel in der App durchgesehen
      (jede Abbildung, Kapitelseite, jede Übung mit Lösung): kein deutscher Rest außer
      Eigennamen (Heuäcker, Göring, Sämisch). Blätter ein Kapitel deiner Wahl durch; fällt dir
      ein deutscher Satz oder eine holprige Stelle auf, schreib „N738: Abb. x.y …“.
- [ ] N739. **Englisch im Ganzen:** Lies zwei, drei Unterschriften und eine Erklärung. Klingt
      das Englisch natürlich genug für die Vorschau, bis dein englisches Buch kommt?

---

## Teil 2: Entscheiden

Zurzeit ist nichts offen. Bei den Wünschen der Arbeitsliste nimmt Claude zunächst die eigene
Empfehlung und stellt sie dir am Ende hier zur Prüfung („Schon umgesetzt, Widerspruch genügt“).

### Aus der englischen Übersetzung (P6, 23.10.2026)

- [ ] EN4. **Buchbefunde:** Beim Übersetzen fielen diese Stellen im deutschen Buch auf. Nichts
      wurde geändert (das Buch änderst nur du); übersetzt ist, was dasteht. Je Punkt „ok so“ oder
      deine Änderung:
      a) Denkroutine (Nachschlagen): „Erlaube ich ein Schach oder Matt?“ ohne Nummern; im
      Sicherheitsblick sonst „3. Erlaube ich ein Schach oder gar ein Matt?“. Eine Fassung?
      b) Lernziele: Kapitel 0 bis 6 „solltest du Folgendes sicher können“, Kapitel 7 bis 12 ohne
      „sicher“. Absicht?
      c) Titel mit „1.\,d4“, „5.\,d4“ (Kapitel 2, Gambits für Schwarz in Kapitel 3): Der
      LaTeX-Abstand steht roh in den App-Daten, auch auf Deutsch sichtbar. Claude kann das in der
      Pipeline beheben, wenn du willst.
      d) Abb. 1.23, Unterabschnitt: Leerzeichen nach den öffnenden Anführungszeichen („ Schach“).
      e) Kapitel 1, Übung „Drohung ignoriert?“: nach „die Antwort ist 1. Sc7+!“ fehlt der Punkt;
      ebenso Abb. 4.22 nach „Nach 6. …“.
      f) Kapitel 2, Bilanz-Übung zur Italienischen Partie: „Rochiert Schwarz dagegen zunächst,
      rückt Weiß mit 9. d5 vor, und nach 8... d6 …“ – die Zugreihenfolge ist unklar.
      g) Kapitel 2, Fazit der Bilanz zum Läuferspiel zitiert „flexibel und solide“, der
      Steckbrief sagt „ruhig und flexibel“.
      h) Kapitel 3, Übung echtes oder Scheinopfer (Budapester Gambit): erst „liegt dazwischen“,
      dann „Es ist also ein echtes Opfer“.
      i) Kapitel 3, Dänisch-Bilanz nach dem Zurückgeben: „jetzt steht sie in beiden
      Vergleichszeilen gerade“ – welche Zeilen?
      j) Kapitel 4, Arche-Noah-Falle: F1 „Ziel für ...c5 und ...c4“ (…c4 trifft den Läufer b3,
      nicht die Dame); Rettung „holt den Bauern d4 mit 8. Ld5 zurück“ (8. Ld5 greift a8 an, d4
      kommt nicht direkt zurück).
      k) Kapitel 4, Halosar-Falle, F1: „Nach 8. Sb5 verhindert die Frage das Matt, die Stellung
      rettet sie nicht mehr“ ist schwer zu verstehen.
      l) Abb. 5.8 nennt 6. Le2 e5 7. Sb3 „Najdorf-Hauptvariante“; heute gelten 6. Le3 und 6. Lg5
      als Hauptvarianten, 6. Le2 als klassische Variante.
      m) Bilanz zu Abb. 5.44, Schwarz, Richtung: „greift zwar die Spitze an, macht aber die
      f-Linie halboffen“ – „zwar … aber“ ohne Gegensatz.
      n) Abb. 5.14: die Erklärung sagt, 11. a4 „bremst“ …b5, das Urteil der Bilanz „verhindert“.
      o) Kapitel 6: Die Lösung der Planbilanz-Übung zur Königsindischen formuliert die Planfragen
      um („Wo?“, „Was will der Gegner?“, „Plan in einem Satz“); Abb. 6.7 sagt „Überzahl am
      Königsflügel“, die London-Übung „Übermacht“.
      p) Kapitel 7, Übung zu Morphys Opfer: „Weiß gibt zwar die Dame für einen Springer“ – nach
      16. Db8+ Sxb8 bekommt Weiß nichts dafür; gemeint wohl „an einen Springer“.
      q) Abb. 7.35 steht unter „Das Grundreihenmatt“, zeigt aber ein Erstickungsmatt.
      r) Kapitel 8, Übung zum Durchbruch: „über d6 und e7 nach d7“ – Umweg? Abb. 8.23: „folgt
      nach e4 und erreicht die Schlüsselfelder“, e4 ist selbst eines.
      s) Kapitel 9: Abb. 9.2 und 9.6 nennen vier Linien Schachdistanz, Abb. 9.5 drei; Abb. 9.44
      „Als Läuferseite gehört er in die Ecke …“ („er“ ist der König).
      t) Kapitel 12, Übung zum Fehlerprotokoll: Aufgabe nennt Tabelle 12.2, Lösung Tabelle 12.1.
      u) Glossar: „Abzugsschach … darf fast alles angreifen“ (gemeint „kann“); „Hängende Bauern“
      ohne die halboffenen Nachbarlinien; „Zeitgutschrift“ auch für die Ausgleichszeit nach
      einem regelwidrigen Zug gilt so nur auf Deutsch.
- [ ] EN5. **Neue englische Begriffe (vorläufig wie EN1, schon umgesetzt, Widerspruch genügt):**
      Die 255 Glossarstichwörter stehen englisch im Glossar der App. Dazu neu geprägt: superior
      force (Übermacht), error radar (Fehler-Radar), protection test (Deckungstest), durability
      (Haltbarkeit), stop moment (Stopp-Moment), trap-setter test, skeleton balance, plan
      questions, guiding questions, box method, checking distance, building a bridge, stalemate
      reserve, ghost piece, theme block, starter pack, hope chess, capture reflex,
      Released means moved (Losgelassen ist gezogen), Touch-move, Luft (Luftloch), Clamp trap
      (Klammerfalle), Desperado rook (Rasender Turm), Staircase mate (Treppenmatt; gängiger wäre
      „ladder mate“). Eröffnungen mit den üblichen englischen Namen (Ruy Lopez, Petrov Defense,
      Trompowsky Attack …), Spieler in englischer Schreibweise (Karpov, Korchnoi, Alekhine).
