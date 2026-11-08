# Was noch zu tun ist (für den Autor)

Stand: 6.11.2026, Version 0.3.54 (Fehler mit Buchbezug vollständig, 7.11.2026).
**Diese Datei ist die einzige, die du brauchst:** Hier steht
alles, was du testen oder entscheiden sollst, mit allen Informationen dazu, und nur, was noch
offen ist. Erledigtes wandert nach `docs/ENTSCHEIDUNGEN.md` (musst du nicht lesen).

**In der App (seit 0.2.75):** Halte „Profil“ unten rechts drei Sekunden gedrückt (am Rechner:
Adresse `/app/#aufgaben`). Dann öffnet sich diese Datei als Seite: Abbildungen, Trainer,
Spielen, Einstellungen und Nachschlagen im Text sind Links, jeder Punkt hat einen Haken und eine
Notiz. „Stand in die Zwischenablage“ legt alles Abgehakte und Notierte als Text ab („N306 ok“,
„N305: Pfeil fehlt“), den du in den Chat einfügst.

**So antwortest du:** im Chat mit den Kürzeln, etwa „N203 ok“, „N205 falscher Pfeil“, „X5: so
lassen“, „T1: Vorschläge übernehmen“. Claude trägt alles ein. Bei Fehlern in der App hilft
**Profil › Einstellungen › Fehler melden**: Den kopierten Text mitschicken (App-Version,
Datenstand, Gerät; mit dem Dashboard sendet das Formular die Meldung direkt), bei allem anderen kurz, **was** du getan hast und **was** passiert ist, gern
mit Bildschirmfoto.

Adresse: <https://schach-von-grund-auf.com/app/> (oder die installierte App). Vorher in den
Einstellungen (Profil › Einstellungen, ganz unten) prüfen, dass „App-Version 0.3.54“ dasteht; sonst die App neu laden.

Reihenfolge nach Wichtigkeit: Teil 1 testen (neueste Nummern zuerst), dann Teil 2: oben „Nur
bestätigen“ mit einem Satz („alle ok außer …“), darunter die Entscheidungen. Alle
Nummern gelten für die aktuelle Version; frühere Versionen musst du nicht mehr getrennt testen.

---

## Teil 1: Testen auf dem Handy

Alle Punkte bis 0.2.115 hast du am 19.10.2026 abgehakt; sie stehen jetzt in
`docs/ENTSCHEIDUNGEN.md`. Deine Notizen und Wünsche aus derselben Rückmeldung arbeitet Claude als
Arbeitsliste R1 bis R26 ab (`docs/FORTSCHRITT.md`). Neue Testpunkte kommen hier hinzu, sobald ein
Teil fertig ist.

### Neu in 0.3.55: Schach-Abenteuer, technischer Prototyp (7.11.2026)

Das Spiel ist noch kein Spiel, sondern der Durchstich: Zusatzpaket laden, ein Raum, laufen, ein
Dialog, eine Partie der App, zurück. Platzhaltergrafik. Einstieg nur über die Adresse, damit es
sonst niemand findet: schach-von-grund-auf.com/app/#abenteuer (oder in der installierten App die
Adresse mit „#abenteuer“ öffnen).

- [ ] N2605. Adresse /app/#abenteuer öffnen: Startkarte „Schach-Abenteuer“ mit dem Knopf „Spiel herunterladen“. Tippen:
      Balken läuft, dann steht „Spielen“ da (das Paket ist im Prototyp unter 1 MB; echte Grafik und Musik kommen später).
      Flugmodus an, App neu laden, wieder /app/#abenteuer: „Spielen“ steht sofort da, ohne Laden.
- [ ] N2606. „Spielen“: Ein Dachboden aus farbigen Kacheln, unten links ein Steuerkreuz. Mit dem Kreuz laufen (der blaue
      Kasten ist der Held); Wände, Kisten und Lampe halten auf. Vor das grün-weiße Brett stellen (von unten, Blick nach
      oben): rechts unten erscheint der runde Knopf „Ansehen“.
- [ ] N2607. „Ansehen“: Dialogkasten unten, „Weiter“ blättert Zeile für Zeile, Antworten als Knöpfe. Ambrose erwacht und
      gibt den „Fingerzeig“ (Karte, noch ohne Wirkung). Am Ende beginnt die Partie gegen Ambrose in der normalen
      Partieansicht: Titel „gegen Ambrose“, unter dem Brett die gelbe Leiste „Schach-Abenteuer“. Ambrose spielt etwa auf
      deiner Stärke (ohne Wertung wie ein Einsteiger), ohne Spielhilfen, ungewertet.
- [ ] N2608. Partie zu Ende spielen (oder aufgeben): Unter der Auswertung steht „Zurück zur Stadt“. Tippen: zurück auf den
      Dachboden, oben eine Karte „Gewonnen/Verloren gegen Ambrose“ mit Zugzahl; „Weiter“ schließt sie. Die Partie steht
      zusätzlich in der Partienliste der App.
- [ ] N2609. Mitten in der Partie über „Spielen“ in der Leiste unten weggehen, dann /app/#abenteuer: Die Welt öffnet sich
      ohne Startkarte, darüber die Karte „Deine Partie läuft noch“ mit „Weiterspielen“ (führt in dieselbe Partie) und
      „Partie aufgeben und in der Stadt bleiben“. Die Startkarte siehst du nur noch ohne Spielstand oder ohne Paket.
- [ ] N2610. Android-Zurück-Taste im Dialog schließt nur den Dialog; außerhalb führt sie aus dem Spiel. Beim Verlassen und
      Zurückkommen steht der Held dort, wo du ihn verlassen hast.
- [ ] N2611. Profil › Einstellungen › Deine Daten › Sicherung: Die Sicherung enthält jetzt den Spielstand (Format 11);
      nach „Alle Daten löschen“ ist auch das Paket weg und die Startkarte zeigt wieder „Spiel herunterladen“.
- [ ] N2612. Im Abenteuer eine ganze Partie gegen Ambrose nach mindestens 11 Zügen verlieren (etwa aufgeben, nachdem du
      eine Figur eingestellt hast): Auf der Ergebniskarte erscheint erst „Ambrose sieht sich die Partie an …“, nach ein
      paar Sekunden „Hier ist es passiert, in Zug N“ mit dem Knopf „Noch einmal von Zug N“. N liegt vor deinem groben
      Fehler. Tippen: Eine neue Partie beginnt in der Stellung von damals, mit derselben Farbe. Gibst du sie wieder
      verloren, kommt kein zweites Angebot. Verlierst du in weniger als 11 Zügen oder stand es schon lange schlecht,
      kommt gar kein Angebot (nur „Weiter“).
- [ ] N2613. Vom Wohnzimmer durch die Haustür nach draußen und wieder hinein, von draußen in die Schule und zurück, in
      den Park und zurück, vom Wohnzimmer über die Treppe auf den Dachboden und zurück: Jeder Weg führt auf die richtige
      Karte, der Held steht in der Tür und löst sie erst aus, wenn er sie verlässt und wieder betritt.
- [ ] N2614. Nach der ersten Partie ins Wohnzimmer, zur Haustür hinaus, in die Schule, mit Coach Delgado und dann mit Sam
      sprechen, bis Sam seine Aufgaben stellt: Die App zeigt „Aufgaben von Sam“ im gewohnten Trainerrahmen (Aufgabe x
      von n), zuerst die Buchübung „Drohung ignoriert?“ (Abb. 1.40), dann Hängeaufgaben. Am Ende „Runde fertig“ und
      „Zurück zur Stadt“; im Clubraum erscheint „Aufgaben bestanden: … Punkten“ (ab 70 Prozent) oder „Das reicht noch
      nicht“ mit „Noch eine Runde, eine Stufe leichter“. Im Tagebuch rückt die Quest „Das vierte Brett“ einen Schritt
      weiter. Die Runde steht auch in der App unter Trainer › Taktik als gespielte Runde.
- [ ] N2615. Spielmenü (☰) › „Von vorn beginnen“ › „Ja, von vorn“: zurück auf die Startkarte, dort das Feld „Wie heißt du im
      Spiel?“. Einen Namen eintippen (etwa „Kim“), „Spielen“: Ambrose spricht dich im Dialog mit diesem Namen an. Im
      Spielmenü steht der Name im Feld; ändern und „Namen speichern“ wirkt sofort. Leer gelassen heißt der Held „Du“.
- [ ] N2616. Tagebuch im Abenteuer: Unter den offenen Aufgaben steht „Deine Spielstärke im Abenteuer: N“; N ist beim Start
      deine Wertung der App (klassisch) oder 600 ohne Wertung. Nach einer ganzen Partie gegen Ambrose ohne Flüstern oder
      Mentor-Zug ändert sich N (Sieg etwa +25 bei gleich starkem Gegner); nach einer Partie mit Vorgabe oder einem
      Wiedereinstieg nicht. Verlierst du zweimal gegen den Coach, steht in der dritten Partie unter dem Brett in der
      gelben Leiste „Coach Delgado ist überheblich geworden.“, und er spielt spürbar lockerer (mehr Fehler).
- [ ] N2617. Seite „Spielen“ (unten in der Leiste): Unter den Kacheln steht die Karte „Schach-Abenteuer“ mit „Zum
      Abenteuer“; sie führt auf die Startkarte des Spiels. Hast du schon einen Spielstand, heißt sie „Dein Abenteuer
      wartet, {Name}.“ mit „Weiterspielen“. Aus einer Abbildung oder eigenen Stellung heraus fehlt die Karte.
- [ ] N2602. Partie auswerten, in der Zeitleiste eine Fehlerkarte (oder die erste klare Abweichung) suchen: Unter „Besser
      war …“ steht eine Zeile mit Glühbirne, etwa „Guter Schlag ausgelassen (Kapitel 1)“. Antippen klappt den Satz mit
      der ganzen Fundstelle auf, „Üben“ öffnet den passenden Trainer. Bei „Verpasst“ steht nur diese Zeile. Sagen Warum-
      und Glühbirnen-Zeile dasselbe (gleicher Trainer, gleiches Thema), steht nur die Warum-Zeile da.
- [ ] N2603. Im Rückblick Zug für Zug zu einem Zug mit „?!“ oder „?“ gehen: Unter „Besser war …“ steht die Glühbirnen-
      Zeile mit Kapitel; aufgeklappt gibt es einen eigenen Knopf „Üben“. Bei „gut“ und „sehr gut“ erscheint sie nie.
- [ ] N2604. Nach mindestens 5 ausgewerteten Partien, in denen in 3 oder mehr derselbe Fehler vorkam, zeigt die Karte
      „Heute“ eine Kachel wie „Drohung stehen gelassen · 3 von 5 Partien · Kapitel 1“. Der Knopf öffnet den Trainer; nach
      dem Üben verschwindet die Kachel bis zur nächsten Partie. (Ältere Partien bekommen die Kürzel im Leerlauf
      nachberechnet.)

### Neu in 0.3.53: Aussehen nur noch im Profil, Fehler mit Buchbezug (7.11.2026)

- [ ] N2600. Profil → Einstellungen: Oben gibt es keine Brettvorschau mehr, nur die Zeile „Aussehen (Brett, Figuren,
      Rahmen) im Profil wählen“. Ein Tipp führt zur Profilkarte „Dein Aussehen“ (bisher „Deine Extras“), Reiter
      „Brett“ offen. Dort stehen alle Bretter, die freischaltbaren mit Schloss und Bedingung („Nacht und Gold“: „Mit
      allen Orden der Buchteile“). „Grün“ antippen: Vorschau und jede Abbildung im Buch werden grün. Reiter „Figuren“
      ebenso (etwa „Merida“; „Gold“ mit Schloss „Ab Stufe 5“). Der Schalter „Koordinaten“ steht unter den Brettern.
- [ ] N2601. Auswertung einer Partie mit Fehler oder Patzer: Auf der Fehlerkarte der Zeitleiste steht unter „Besser war“
      eine Zeile mit Buchsymbol, etwa „Drohung stehen gelassen (Kapitel 1)“. Tipp klappt den Satz mit der ganzen
      Fundstelle auf; „Üben“ neben „Zur Stellung“ öffnet den passenden Trainer (bei Taktik mit dem Motiv). Passt der Grund zum Zug?
      Fehlt die Zeile, wo ein klarer Grund erkennbar ist? Bei „Verpasst“ gibt es nur die Zeile zum besseren Zug.

### Neu in 0.3.52: Linienknöpfe in der Zugfolgenleiste (7.11.2026)

- [ ] N2599. Eine ausgewertete Partie auf dem Handy öffnen und mit Vor/Zurück (oder den Pfeiltasten) ganz durchgehen,
      einmal einzeilig und einmal aufgeklappt. Über der Zugnavigation steht immer die Zeile „Linie:“ mit drei
      Symbolen (Partie, Glühbirne, Schwerter) in einer Zeile; Glühbirne und Schwerter sind nur an Fehlern
      antippbar, sonst ausgegraut. Brett und Weiter-Knopf bleiben genau an ihrem Platz. Unter dem Brett gibt es
      keine Knöpfe „Besserer Zug“ und „Bestrafung“ mehr. An einem Fehler spielt ein Tipp auf Glühbirne oder
      Schwerter die Folge Zug für Zug vor (nochmal tippen hält an); danach geht man mit Vor/Zurück selbst durch,
      „Partie“ (erstes Symbol) führt zurück.

### Neu in 0.3.51: Deine Meldungen vom 6.11.2026

- [ ] N2585. Zug eingeben: Läufer antippen (Zielfelder erscheinen), dann eine eigene Figur ganz am Rand zu
      einem Zielfeld des Läufers antippen (etwa den Springer direkt neben einem Läuferziel). Jetzt ist
      die neue Figur gewählt, der Läufer zieht nicht. Ein Tipp knapp neben ein Zielfeld auf ein leeres
      Feld zieht weiter dorthin.
- [ ] N2586. Röntgentrainer, Schritt 1 (Schachs): Ein Schach übersehen, das zugleich ein Verlustschlag ist (wie
      Lxf7+ auf deinem Bildschirmfoto). Unter „Übersehen“ steht jetzt „Lxf7+ gibt Schach und gehört deshalb
      dazu, auch wenn der Schlag Material kostet (Lxf7+ …: −2 Bauerneinheiten).“ In Schritt 2 (Schläge)
      musst du diesen Schlag nicht markieren. Zu deiner Frage: Die Markierung war richtig verlangt, aber
      als Schach, nicht als Schlag; nur der Satz war irreführend.
- [ ] N2587. 10-Minuten-Partie gegen einen Bot zu Ende spielen: Die Auswertung danach ist nach wenigen
      Sekunden fertig (vorher etwa 20 Sekunden). Grund: Jeder Zug hat die gerade rechnende Stellung
      verworfen und neu angefangen; jetzt wird das Ergebnis behalten und eine laufende Rechnung
      weiterverwendet.
- [ ] N2588. Auswertung, Zeitleiste: Kacheln „Absichtlicher Fehler der Engine“ erscheinen nur noch, wenn der Zug
      wirklich ein Fehler, Patzer oder verpasster Gewinn war, nicht bei kleinen Ungenauigkeiten.
- [ ] N2589. Kapitelseite (etwa Kapitel 0), Karte „Dein Fortschritt“: Tipp auf den Ring Abbildungen oder
      Warum-Fragen rollt zu den Abbildungen, Tipp auf den Ring Lernziele öffnet die Checkliste mit der
      aufgeklappten Karte dieses Kapitels, Tipp auf Übungen rollt zu den Übungen.
- [ ] N2590. Startseite, Karte „Heute“: Wer schon Aufgaben am Brett lösen kann, sieht unter den Vorschlägen
      jetzt auch „Kurzplan“ (etwa 15 Minuten, fertig zusammengestellt); Tipp öffnet die Kurzpläne.
- [ ] N2591. Einstellungen › Bedienung, ganz unten „Was zuerst kommt“: Buch / Spielen / Umsehen. Auf „Spielen“
      stellen: Die Karte „Heute“ schlägt nach fälligen Wiederholungen zuerst Partie, Taktikthema und
      Kurzplan vor. Die Startwahl der ersten Tour (Einstellungen › Hilfe › Rundgang) stellt das
      ebenfalls ein.
- [ ] N2593. Lernpfad „Dein Weg durchs Buch“: Unter dem Balken stehen jetzt auch „… Warum-Fragen“ und
      „… Lernziele“. In Kapitel 1 eine Warum-Frage richtig beantworten und in der Gesamt-Checkliste ein
      Lernziel von Kapitel 1 abhaken: Beide Zahlen sinken um eins, die Station füllt sich. Golden wird
      sie erst, wenn auch Warum-Fragen und Lernziele erledigt sind. Ein Orden, den du schon hast, bleibt
      golden (im ⓘ: „Den Orden „Teil …“ hast du schon.“); er zählt weiter nur Abbildungen und Übungen.
- [ ] N2596. Ausgewertete Partie: einen Fehler (?) antippen, unter der Zugliste „Besserer Zug“ oder „Bestrafung“
      wählen. Die Folge steht in Klammern hinter dem Fehler, darunter „Linie: Partie / Besserer Zug /
      Bestrafung“. Vor/Zurück und die Pfeiltasten gehen Zug für Zug durch die Folge, Brett und
      markierter Zug passen immer zusammen; Zurück am ersten Zug oder „Zurück zur Partie“ führt in
      die Partie zurück.
- [ ] N2597. Karte „Heute“ › „Wann übst du?“ › Übungszeit planen: Wochentage und Dauer wählen (10 bis 60
      Minuten), keine Uhrzeit mehr. An einem Plantag steht beim Öffnen „Heute ist dein Übungstag: 0 von
      20 Minuten geschafft“ mit Balken und „Jetzt üben“. Ein paar Minuten in der App üben (lesen,
      ziehen, lösen): Die Zahl steigt etwa jede Minute; wer drei Minuten nichts antippt, zählt nicht
      weiter. Im Reiter der Karte steht „7/20 Min“.
- [ ] N2598. Mindestens 5 gewertete Partien gegen Bots in derselben Zeitart spielen und auswerten lassen. Liegt eine
      Phase deutlich (mindestens etwa 150 Punkte) unter deiner Schätzung, steht auf der Karte „Heute“
      die Kachel „Aus deinen Partien“: „Ein Hinweis aus deinen letzten 8 Partien: Im Endspiel spielst
      du etwa 250 Punkte schwächer als sonst …“ mit Kapitel und Trainer (Eröffnung: Kapitel 2,
      Repertoire; Mittelspiel: Kapitel 7, Taktik; Endspiel: Kapitel 8, Endspieltrainer). Bei weniger
      Partien oder ausgeglichenen Phasen kommt kein Hinweis.
- [ ] N2592. Karte „Heute“ › Ziel wählen: Mit einer Wertung um 900 stehen keine Engine-Bots und keine Orden der
      Stufen 6 bis 10 mehr unter den Vorschlägen, wohl aber Bots bis etwa 1200 und Kapitelziele. Ohne
      Wertung zählt der stärkste besiegte Bot.

### Neu in 0.3.51: Taktiktrainer – mehrere Motive und gleich schnelle Matts (6.11.2026)

Deine Frage: „Können mehrere Motive gleichzeitig zutreffen?“ Ja, bei gut der Hälfte der Aufgaben
(574 von 1067 mit Motiv). Bei „Welches Motiv war es?“ zählt jetzt jedes zutreffende Motiv; die
Meldung nennt die anderen. Gleich gute andere Züge gibt es laut Engine fast nie (Lichess-Aufgaben
sind so ausgesucht); angenommen wird jetzt zusätzlich jedes Matt, das genauso schnell ist.

- [ ] N2594. Training → Taktiktrainer, Motiv „Hinlenkung“ oder gemischt: Aufgabe lösen (etwa Abb. 7.14:
      Th8+ Kxh8 Sxf7+), dann bei „Welches Motiv war es?“ „Doppelangriff“ wählen. Erwartet: „Richtig.
      Ebenfalls dabei: Hinlenkung.“ Bei einer anderen Aufgabe ein falsches Motiv wählen: „Falsch.
      Zutreffend waren: …“ mit allen passenden Motiven.
- [ ] N2595. Abb. 7.60 (Damiano-Matt, gemischt oder Mattbilder): nach 1. Th8+ Kxh8 statt 2. Dh5+ den Zug 2. Dh1+
      spielen. Erwartet: kein „falsch“, Schwarz antwortet Kg8, 3. Dh7# löst die Aufgabe. Ein
      langsameres Matt (Abb. 7.11: Sc5+ statt Sd6+) bleibt falsch.

### Neu in 0.3.50: Marken ohne Nummer (1.11.2026)

- [ ] N2582. Variante → Stift: drei goldene Felder nebeneinander (je zweimal antippen) und ein roter Pfeil. In der
      Legende „Nummern von Gold“ aufklappen: Jede Nummer hat „ohne Nummer“. Zweimal antippen (an 2 und 3) → am
      Brett nur noch Gold 1, die Felder bleiben markiert; die beiden stehen in der Liste als „– Feld e4“ mit
      „Nummer geben“. Beschriftete Nummern behalten ihren Text, auch wenn sie dadurch eine neue Nummer
      bekommen.
- [ ] N2583. „Nummern von Rot“ aufklappen, Haken „Nummern“ weg: Alle roten Marken der ganzen Variante sind ohne
      Nummer, der Text bei „Rot“ in der Legende gilt für alle. Haken wieder an: Die Nummern sind zurück.
- [ ] N2584. PGN der Variante sichern und wieder einlesen: Marken ohne Nummer bleiben ohne Nummer.

### Neu in 0.3.49: Goldener Pfeil in Varianten wie in der Auswertung (1.11.2026)

- [ ] N2581. Analysierte Variante: Steht ein Zug am Brett, der nicht der beste war (etwa 3... Sf6?? im Schäfermatt),
      zeigt ein goldener Pfeil den besseren Zug, wie in der Partieauswertung. Der grüne Pfeil für den
      besten nächsten Zug ist weg. Der Schalter „Engine-Pfeil“ blendet den goldenen Pfeil aus und ein.

### Neu in 0.3.48: Bearbeiten und Löschen auffindbar (1.11.2026)

- [ ] N2574. Training › Varianten: Neben jeder Variante stehen ein Stift und ein Papierkorb. Der Stift öffnet
      Name und Kommentar („Speichern“ übernimmt, „Abbrechen“ nicht), der Papierkorb fragt „„…“ endgültig
      löschen?“. In einer geöffneten Variante steht hinter dem Titel ein goldener Stift; Antippen öffnet
      Name, Kommentar, Teilen und Löschen. Schon umgesetzt, Widerspruch genügt.
- [ ] N2576. **Engine-Folgen vorab an:** Eine ausgewertete Partie mit mindestens einem eigenen Fehler, Patzer oder
      verpassten Gewinn öffnen → Gabel-Knopf am Brett: Der Schalter „Engine-Folgen übernehmen („Besser
      war …“, „So wird bestraft“)“ ist jetzt schon angehakt → „Öffnen“. An jedem eigenen Fehler zweigt
      „Besser war (Engine)“ ab, bei Fehler und Patzer zusätzlich nach deinem Zug „So wird bestraft
      (Engine)“. Ungenauigkeiten bekommen keine Folgen. Ebenso unter Varianten › Neue Variante ›
      Partie. Schon umgesetzt, Widerspruch genügt.
- [ ] N2577. **Fehler des Gegners:** Am Gabel-Knopf einer ausgewerteten Partie steht unter „Engine-Folgen
      übernehmen“ der Haken „Auch an Fehlern des Gegners“ (vorab an). Mit beiden Haken bekommen auch die
      Fehler des Gegners „Besser war (Engine)“ und „So wird bestraft (Engine)“. Ebenso unter Neue Variante ›
      Partie. Schon umgesetzt, Widerspruch genügt.
- [ ] N2578. **Engine-Folgen nach der Analyse einer Variante:** Variante mit einem Fehler (etwa PGN „1. e4 e5 2. Dh5 Sc6 3. Lc4 Sf6 4. Dxf7#“ einlesen) → „Analyse“ → wenn sie fertig ist, erscheint oben „Engine-
      Folgen übernehmen (+… Züge)“. Antippen legt an Fehlern, Patzern und verpassten Gewinnen beider Seiten
      „Besser war“ und „So wird bestraft“ als Abzweige an (Züge mit Chip-Zeichen „Engine“); danach
      verschwindet der Knopf. Ungenauigkeiten bekommen nichts.
- [ ] N2579. **Karte:** Rechts neben dem letzten Zug jeder Linie steht ihre Endstellung als kleines Brett.
      Nach der Analyse steht neben jedem Brett der Karte (Abzweige und Endstellungen) ein schmaler
      Bewertungsbalken (unten Weiß, oben Schwarz): So sieht man beim Scrollen, welche Linie wem liegt.
- [ ] N2580. **Baumansicht:** Nach der Analyse steht links an jedem kleinen Brett der Abzweig-Karten der
      Bewertungsbalken mit Zahl.
- [ ] N2575. Touren (Kompass): Die Tour der Variante beginnt mit dem Titel (Bearbeiten, Löschen), die Tour der
      Liste nennt Stift und Papierkorb, die Touren von Lernsammlung und Fehlerdatenbank sagen, dass ein
      aufgeklappter Eintrag „Bearbeiten“ und „Löschen“ (mit „Rückgängig“) hat.

### Neu in 0.3.47: Meisterpartien statt Studien, gespeicherte Werte (1.11.2026)

- [ ] N2570. Varianten → Neue Variante: Statt „Studie (Kapitel 10)“ steht jetzt die Kachel „Meisterpartie“
      (Krone). Oben „Quelle“: „Aus dem Buch“ listet die Meisterpartien aus Kapitel 11 (etwa Morphys
      Opernpartie) und öffnet sie wie die Abbildung, mit den Varianten des Buches. „Berühmte Partien“
      und „Aktuelle Turniere“ listen die Zusatzpartien von „Zug erraten“ (Hinweis „Zusatzinhalt“);
      „Anderssen – Kieseritzky, Freie Partie, London 1851“ öffnet die Unsterbliche Partie als Variante ab der
      Grundstellung. Schon umgesetzt, Widerspruch genügt.
- [ ] N2572. **Speichern nur per Abfrage:** Neue Variante aus der Grundstellung, 1. e4 ziehen: oben steht
      „Geändert · nicht gespeichert“ mit dem Knopf „Speichern“; in der Liste „Varianten“ ist noch nichts.
      „Zurück“ (oben, Zurück-Taste oder untere Leiste) fragt „Variante speichern?“ mit Speichern, Nicht
      speichern, Abbrechen. „Karte“, „Von hier spielen“ und „Abfragen“ fragen vorher „Dafür muss die
      Variante gespeichert sein“. An einer Abbildung mit eigenen Zügen fragt der Gabel-Knopf „Deine
      Züge … speichern?“ (oder „Nur das Buch öffnen“); „Als Variante speichern“ in der Zugleiste und
      „Einlesen und speichern“ bei PGN sind selbst die Antwort. Eine gespeicherte Variante speichert
      Änderungen weiter von selbst. Schon umgesetzt, Widerspruch genügt.
- [ ] N2573. **Bretter in der Karte:** Abb. 2.40 als Variante → „Karte“: Unter „3. Sxe5“ und „4. De2!“ steht je
      ein kleines Brett mit der Stellung am Abzweig und den blauen gepunkteten Pfeilen (Stern am
      Hauptzug, „2“, „3“ …); die Nebenäste beginnen darunter. Ein Tipp aufs Brett springt zu diesem
      Abzweig. Zoomen macht die Bretter größer. Schon umgesetzt, Widerspruch genügt.
- [ ] N2571. Eine ausgewertete Partie → Moment „Als Variante“ (oder Gabel in der Auswertung) → in der
      Variante „Analyse“ einschalten: Die Partiezüge haben sofort ihre Symbole und Werte (aus der
      Auswertung übernommen); gerechnet wird nur, was neu dazukommt (eigene Abzweige). Der Zähler
      „läuft … von …“ zählt nur diese.

### Neu in 0.3.46: Variationsbrowser, Zurück-Taste (1.11.2026)

- [ ] N2500. Training: Kachel „Varianten“ (noch leer) öffnen; „Neue Variante“ zeigt sieben Kacheln.
- [ ] N2501. Abb. 2.40 → Brettschalter „Variante“: Zugleiste mit Gabel „2“ nach 3. Sxe5, Chips „★ 3... d6!“ und „2 3... Sxe4?!“, auf dem Brett zwei blaue gepunktete Pfeile mit Stern und „2“.
- [ ] N2502. Dort 3... De7 ziehen: Status „Gespeichert unter Varianten“, Gabel zeigt „3“, De7 in Gold.
- [ ] N2503. Langer Druck auf einen Zug öffnet das Menü (Zugzeichen, Zur Hauptvariante machen, Kommentar, Ab hier löschen); nach „Ab hier löschen“ holt „Rückgängig“ die Züge zurück.
- [ ] N2504. „+ Notiz zu diesem Zug“: Text schreiben, App schließen und neu öffnen – der Kommentar ist da, der Zug hat einen goldenen Punkt.
- [ ] N2505. Titel antippen: umbenennen, Kommentar zur Variante (erscheint eingeklappt oben), PGN in Lichess als Studie einfügen (Varianten, Kommentare, Zeichen kommen an), Variante löschen mit Rückfrage.
- [ ] N2506. Abb. 2.2 mit „Ziehen“ eigene Züge spielen, in „Deine Züge“ „Als Variante speichern“: Variante öffnet am letzten eigenen Zug; an der Abbildung steht danach „1 eigene Variante ›“.
- [ ] N2507. Liste: „PGN“ → eine Lichess-PGN mit Varianten einfügen → Variante öffnet mit allen Abzweigen; FEN einfügen öffnet die Stellung.
- [ ] N2508. Neue Variante aus Partie, Fehlerdatenbank, Lernsammlung und „Stellung aufbauen“ ausprobieren (Titel, Kommentare aus Satz bzw. Plan).
- [ ] N2509. Ausgewertete eigene Partie mit Patzer: Gabel im Rückblick → Schalter „Engine-Folgen übernehmen“ → Abzweige „Besser war (Engine)“ und „So wird bestraft (Engine)“ (kursiv mit Chip-Zeichen), einzeln löschbar.
- [ ] N2510. Partienliste und Auswertung zeigen die Zahl eigener Varianten einer Partie.
- [ ] N2511. „Von hier spielen“ in einer Variante: Spielen zeigt „Probepartie: zählt nicht“, Partie gegen einen Bot, „Probepartie beenden“ → „Als Variante speichern“ → Züge als Abzweig mit Kommentar; Partienliste, Wertung, Rekorde und Tagesziel unverändert.
- [ ] N2512. „Von hier spielen“ aus dem Gabel-Blatt der Auswertung: Farbe wie in der Partie; nach „Verwerfen“ bleibt nichts gespeichert.
- [ ] N2513. Datensicherung mit Varianten: Rückfrage nennt „Varianten: n“; Einspielen auf einem zweiten Gerät bringt sie mit.
- [ ] N2514. Tour auf beiden neuen Bildschirmen (Kompass oben rechts).
- [ ] N2515. Englisch: beide Bildschirme in englischer Sprache ansehen.
- [ ] N2516. Abb. 2.40 → „Variante“ → Schalter „Stift“: Gold wählen, d8 und h4 antippen (Pfeil mit „1“), e5 zweimal antippen
      (goldener Rahmen mit „2“ in der Ecke), Rot f6–e4 (rot „1“). Status „Gespeichert unter Varianten“, die blauen Pfeile sind
      weg, solange der Stift an ist.
- [ ] N2517. Denselben Pfeil noch einmal setzen nimmt ihn weg, die Nummern rücken nach. Radierer leert die Stellung,
      „Rückgängig“ holt alles zurück.
- [ ] N2518. Legende: Goldzeile beschriften („Druck“), Rot aufklappen und „Rot 1“ beschriften; „Fertig“ – die Legende zeigt
      nur das Beschriftete; App schließen und neu öffnen, alles ist noch da.
- [ ] N2519. Eigenen Zug 3... De7 ziehen, „Baum“: Karte „nach 3. Sxe5“ mit Mini-Brett, Pfeilen ★/2/3 und drei Knöpfen
      (Hauptvariante, „7 Züge · 1 Abzweig“, „1 Zug · eigene“), darunter eingerückt „in 3... Sxe4?!“. Tipp auf „3... Sxe4?!“
      springt dorthin.
- [ ] N2520. „Karte“: ganze Variante als Karte, Hauptvariante oben gold, De7 in Gold; mit einem Finger in alle Richtungen
      schieben, mit zwei Fingern zoomen, −/+/„Alles zeigen“/„Zur Stellung“ ausprobieren.
- [ ] N2521. Auf der Karte einen Zug antippen: Die Variante öffnet genau an dieser Stellung; „Zurück“ in der Variante führt
      zur Abbildung (kein zweiter Entwurf).
- [ ] N2522. Karte „Als Liste“: alle Züge, Abzweige eingerückt; mit VoiceOver/TalkBack bedienbar.
- [ ] N2523. Titel antippen → „PGN kopieren“ und in Lichess als Studie einfügen: Pfeile und Rahmen erscheinen (Gold als
      Gelb, Grau als Blau), die Texte „Gold 2: …“ und „Legende Gold: …“ stehen im Kommentar. Dieselbe PGN in der App unter
      „Varianten → PGN“ einlesen: genaue Farben, Nummern und Texte kommen zurück.
- [ ] N2524. Eine Lichess-Studie mit Pfeilen als PGN einlesen: Pfeile und Felder in Gold/Rot/Grün/Blau sind da; Englisch
      einstellen und Stift, Legende, Baum und Karte ansehen; Tour auf Variante und Karte (Kompass).
- [ ] N2560. Varianten → PGN: „1. e4 e5 2. Sf3 Sf6 3. Sxe5 Sxe4 4. De2 Sf6 5. Sc6+“ einlesen, „Analyse“ antippen: oben
      läuft „Analyse … von … Stellungen“, du kannst dabei weiter blättern und ziehen.
- [ ] N2561. Nach der Analyse: hinter jedem Zug ein Symbol (4... Sf6 rotes „??“, 5. Sc6+ grüner Stern), am Brett
      dieselbe Marke am Zielfeld, links der Balken mit Zahl, ein grüner Pfeil zeigt den besten Zug der gezeigten Stellung.
- [ ] N2562. Die Chips „Symbole“, „Balken“, „Engine-Pfeil“ blenden je ihr Teil aus und ein; App schließen und neu öffnen:
      die Wahl ist gemerkt, die Werte sind noch da (keine neue Analyse).
- [ ] N2563. In der analysierten Variante einen neuen Zug ziehen: nur er wird nachgerechnet („Analyse 1 von 1“), danach
      hat er Symbol und Balken.
- [ ] N2564. Analyse einer langen Variante starten und „Abbrechen“ tippen: Der Knopf ist wieder aus, fertige Stellungen
      behalten ihre Symbole; „Analyse“ noch einmal rechnet nur den Rest.
- [ ] N2565. Analyse starten und die Variante verlassen (etwa ins Buch): später zurück – die Analyse ist im Hintergrund
      fertig geworden.
- [ ] N2566. Titel → „Als PGN-Datei sichern“ und in Lichess als Studie einfügen: Lichess zeigt die Bewertungen
      (`[%eval]`). Dieselbe Datei in der App einlesen: Symbole und Balken sind sofort da.
- [ ] N2567. Eine Lichess-Studie mit Engine-Bewertungen als PGN einlesen: Balken sofort; Symbole erst nach „Analyse“.
- [ ] N2568. „Von hier spielen“, ein paar Züge, dann über die Leiste zu „Spielen“: oben die Karte „Probepartie läuft“
      („zählt nicht · gegen …“); „Weiterspielen“ führt zurück, „Beenden“ bietet „Als Variante speichern“ und „Verwerfen“.
- [ ] N2569. Englisch einstellen und Analyse, Chips, ⓘ und die Probekarte ansehen; Tour der Variante (Kompass) zeigt den
      Schritt „Analysis“.
- [ ] N2525. Varianten → Neue Variante → „Ganze Eröffnung“: Italienische Partie, „Aus der Praxis“ anhaken, Band
      wählen, Vorschau „Buch … · Praxis … Züge“ → Öffnen: Variante öffnet nach 3. Lc4 mit vielen Fortsetzungen; nach
      3... Lc5 stehen auch 4. Sg5 (Übung 8) und 4. b4 (Evans); erster Praxiszug hinter dem Buch mit „Praxis (Lichess)“.
- [ ] N2526. Steckbrief (z. B. Spanische Partie) → „Ganze Eröffnung als Variante“; außerdem „Nur Praxis“ (z. B.
      Wiener Partie) ausprobieren.
- [ ] N2527. Übung 8 (Abb. 2.148): vor dem Lösen kein „Als Variante öffnen“, nach „Lösung zeigen“ schon; die
      Variante steht nach 4. Sg5, dahinter 4... Dxg5. Ebenso nach einer Taktik- oder Repertoire-Aufgabe (mit Lösung).
- [ ] N2528. Variante (etwa aus Abb. 2.40) → „Abfragen“: Seite wählen, „Ab dem Anfang“, falscher Zug zeigt den
      Pfeil, ein Zug aus einem anderen Abzweig gilt nicht als Fehler, Linien nacheinander, Ergebnis am Ende.
- [ ] N2529. Lernsammlung: beim Anlegen (oder Bearbeiten) unter „Notiz“ eine Variante wählen bzw. „Neue Variante
      aus dieser Stellung“; am Eintrag „Varianten abfragen (1)“; in „Abfragen“ nach „Plan zeigen“ „Varianten abfragen“.
      Dasselbe beim Bearbeiten eines Fehlereintrags; „lösen“ nimmt die Verknüpfung wieder weg.
- [ ] N2555. Buch › „Dein Weg durchs Buch“ › ein Bündel „Nebenaufgaben“ antippen, dann die
      Zurück-Taste (Android) oder die Zurück-Geste: Nur das Fenster schließt sich, der Lernpfad
      bleibt. Ein zweites Zurück führt zum Buch.
- [ ] N2556. Profil › ein Abzeichen antippen › Zurück-Taste: Das Fenster schließt sich, die App
      bleibt offen. Dasselbe mit „Teilen“ unter einer ausgewerteten Partie und mit „Partie
      einstellen“ auf Spielen.
- [ ] N2557. Einen Link `schach-von-grund-auf.com/app/#aufgabe-taktik-` (abgeschnitten) öffnen:
      Es erscheint „Dieser Link ist ungültig oder unvollständig.“ (nicht still das Buch). Ein Link mit
      angehängtem `?fbclid=abc` hinter der Kennung öffnet die Aufgabe normal.
- [ ] N2558. Eine Partie aus dem Profil öffnen › „Neue Partie“: Spielen öffnet, unten ist
      „Spielen“ golden markiert. Training › 30-Minuten-Plan › Partietag › „Zum Spielen“: ebenso.
- [ ] N2559. Während einer Tour (Einstellungen › Hilfe › Rundgang) die Zurück-Taste drücken: Die
      Tour endet, die Seite darunter bleibt stehen (früher ging die App zusätzlich zurück).

### Neu in 0.3.45: Zeitleiste, Repertoire, Sammlungen bearbeiten, Fehlertest Teil 3 (1.11.2026)

- [ ] N2480. Nach dem Ende kein Zurücknehmen: Spiele eine ungewertete Partie mit erlaubter
      Rücknahme bis zum Ende (etwa aufgeben). Unter dem Brett steht kein „Zurücknehmen“ mehr, auch
      nicht, wenn du die Partie später im Profil unter „Deine Partien“ wieder öffnest. Während der
      Partie ist der Knopf wie bisher da.
- [ ] N2481. Bester Zug ohne „?“: Öffne die Auswertung einer Partie, in der du schon klar
      verloren standest. Züge mit dem Stern „Bester Zug“ tragen nirgends „?!“, „?“ oder „??“ (Zugliste,
      Momente, Zahlen „Deine Züge“), auch wenn die Gewinnchance dabei weiter fällt.
- [ ] N2482. Die Partie in Momenten wischen: In der Auswertung stehen die Momente nebeneinander.
      Wische mit dem Daumen nach links: Die Karten rasten ein, rechts schaut die nächste heraus, oben
      zählt „2 von 7“ usw. mit. Jede Phase beginnt mit einer schmalen Karte „Mittelspiel · Zug … · %“.
- [ ] N2483. Blättern mit Knöpfen: Die Pfeile neben „1 von 7“ gehen einen Moment weiter oder
      zurück, auch bei zwei schnellen Tipps; am Anfang ist der linke Pfeil grau, am Ende der rechte.
- [ ] N2484. Phasenknöpfe: Tippe unter der Kurve auf „Mittelspiel“: Kurve zoomt wie bisher und die
      Reihe rückt die Karte „Mittelspiel“ nach vorn; „Ganze Partie“ springt an den Anfang.
- [ ] N2485. Zur Stellung: Tippe in einer Karte auf „Zur Stellung“. Das Brett oben ist danach ganz
      zu sehen (auf kleinem Handy samt „Merken“ darunter), nicht mehr unten angeschnitten.
- [ ] N2486. Bewegung reduzieren: Stelle am Handy „Bewegung reduzieren“ ein. Blättern in den
      Momenten und „Zur Stellung“ springen ohne Gleiten.
- [ ] N2487. Hell und dunkel, Querformat, Tablet: Die Momente sehen in hellem und dunklem Design
      gut aus; im Querformat steht das Brett links und „Zur Stellung“ scrollt nicht unnötig.
- [ ] N2530. Repertoire-Trainer (Training › Repertoire-Trainer): Unter „Deine Runde“ steht die Zeile
      „Aus“. Tippe sie an und wähle „Gambits (Kapitel 3)“. Unter „Eröffnung“ stehen jetzt die Gambits des
      Buches mit kurzem Namen (Königsgambit, Evans-Gambit, Dänisches Gambit, …, Damengambit). Wähle
      „Königsgambit“, Seite Weiß, „Runde starten“: Nach 1. e4 e5 ziehst du 2. f4, die App antwortet exf4.
      Stimmen die Varianten mit Kapitel 3 überein?
- [ ] N2531. Zurück zur Auswahl, „Aus“ auf „Eröffnungen (Kapitel 2)“: Die zuletzt gewählte Eröffnung aus
      Kapitel 2 ist noch da, und beim Wechsel auf Gambits das zuletzt gewählte Gambit.
- [ ] N2532. Der Repertoire-Trainer steht jetzt auch bei Kapitel 3 unter „Die Trainer zu diesem
      Kapitel“. Passt das so?
- [ ] N2533. Hake „Auch Eröffnungen aus der Praxis (Lichess)“ an: „Aus“ springt auf „Praxis (Lichess)“,
      darunter der Hinweis, dass die Züge nicht aus dem Buch stammen, „Noch nichts gewählt.“ und ein
      gesperrter Knopf „Runde starten · keine Variante“; darunter die offene Klappe „Eröffnungen nach
      Spielstärke“. Öffne bei „Italienische Partie“ die „Varianten“ und tippe „Die häufigsten 3“: Über dem
      Knopf steht „3 gewählt“, der Knopf heißt „Runde starten · 3 Varianten“.
- [ ] N2534. Starte die Runde als Weiß: Über dem Brett steht der Name der Variante, „wie echte Spieler
      sie auf Lichess am häufigsten spielen“ und „Aus der Praxis, Lichess (nicht aus dem Buch)“. Ein falscher
      Zug zeigt „Nicht der Zug dieser Variante“ und den richtigen Zug als Pfeil.
- [ ] N2535. Schließe die App und öffne den Trainer wieder: Schalter, Quelle und die gewählten Varianten
      sind noch da. Haken weg: zurück auf „Eröffnungen (Kapitel 2)“, die Lichess-Liste verschwindet.
- [ ] N2536. Rundgang im Repertoire-Trainer (Kompass oben rechts): Ein Schritt erklärt die Zeile „Aus“,
      ein weiterer den Schalter „Praxis“; der Schritt zum Ziehen erwähnt keine Warum-Fragen mehr.
- [ ] N2540. Training öffnen: Direkt unter „Dein Stapel für heute“ stehen drei Kacheln: Lernsammlung, Fehlerdatenbank (Datenbank-Symbol) und Alle Kapitel. Die Kachel Fehlerdatenbank zeigt „noch leer“ bzw. die Zahl der Einträge und öffnet die Fehlerdatenbank.
- [ ] N2541. Eine Partie spielen, in der Auswertung auf einen Zug gehen, „Merken“, dann „Fehler“, dann „In die Fehlerdatenbank“: Es erscheint „In der Fehlerdatenbank gespeichert. Zur Fehlerdatenbank“. Der Link führt hin, und der Eintrag steht dort.
- [ ] N2542. Dasselbe mit „Lernen“ und „Speichern“: „In der Lernsammlung gespeichert. Zur Lernsammlung“ führt in die Lernsammlung.
- [ ] N2543. Lernsammlung: einen Eintrag aufklappen. Hat er keinen Plan, heißt der Knopf „Plan ergänzen“, sonst „Bearbeiten“. Die Felder Plan, Notiz und Eröffnung sind beschriftet wie beim Anlegen. Plan ändern und „Änderung speichern“: Der neue Plan steht in der Zeile, und „Abfragen“ zeigt ihn.
- [ ] N2544. Lernsammlung: Eine geänderte Eröffnung verschiebt den Eintrag in die passende Gruppe.
- [ ] N2545. Lernsammlung: „Löschen“ entfernt den Eintrag sofort. Unten schwebt „Gelöscht. Rückgängig“; ein Tipp holt ihn an dieselbe Stelle zurück. Nach etwa 10 Sekunden verschwindet die Leiste.
- [ ] N2546. Fehlerdatenbank: einen Eintrag aufklappen, „Bearbeiten“, Fehlerart und Satz ändern, „Änderung speichern“. Die Zeile und die Auswertung je Fehlerart zählen den Fehler jetzt beim neuen Kapitel.
- [ ] N2547. Fehlerdatenbank: „Eintrag löschen“, dann „Rückgängig“: Der Eintrag ist wieder da, die Auswertung zählt ihn wieder.
- [ ] N2548. Tour im Training (Kompass oben rechts): Nach der Lernsammlung kommt ein Schritt zur Fehlerdatenbank.
- [ ] N2490. Geteilten Link bei offener App öffnen: App offen lassen, dann im selben Browser-Tab
      die Adresse schach-von-grund-auf.com/app/#aufgabe-taktik-l-1Vybh eingeben. Die Aufgabe
      „Herausforderung“ öffnet sich sofort; „Training“ oben links führt zur Trainingsübersicht.
- [ ] N2491. Profil › Einstellungen › Hilfe › „Rundgang durch die App“ › „Ich will spielen und
      Partien auswerten“: Die Tour läuft auf „Spielen“, unten ist „Spielen“ golden markiert (nicht
      mehr „Profil“).
- [ ] N2492. Rundgang aus den Einstellungen öffnen und, solange die Frage „Wie möchtest du
      starten?“ zu sehen ist, die Zurück-Taste (Android) drücken: Die Frage schließt sich.
- [ ] N2493. Profil › Abzeichen „Erste Partie“ antippen › „Los geht's“: Spielen öffnet, unten ist
      „Spielen“ markiert. Profil › Orden „Teil Endspiel“ › „Los geht's“: Kapitel 8 öffnet.
- [ ] N2494. Ohne Internet (Flugmodus) Profil › Einstellungen › Bots und Wertung › „Maia laden“:
      Es erscheint „Ohne Internetverbindung lässt sich Maia nicht laden …“ (kein „Failed to fetch“).
- [ ] N2495. Datensicherung von einem Gerät mit verdienten Abzeichen auf einem zweiten Gerät (oder
      nach „Alle Daten löschen“) einspielen: Es kommen keine Gratulationen zu alten Ringen oder
      Abzeichen.
- [ ] N2496. Orden-Probe (Aufgabenseite › Orden testen › ein Ring auf 100 %): Die Gratulation hat
      den Fokus auf „Weiter“ (Tastatur am Rechner: Tab bleibt in der Karte, Esc schließt sie).
- [ ] N2497. Handy auf Englisch stellen, App-Daten löschen, App über den QR-Code des Buches
      (…/app/?start=buch) öffnen: Zuerst kommt die Frage nach der Sprache, die Tour „Mit dem Buch
      starten“ erst danach.
- [ ] N2498. App am Abend auf „Buch“ offen lassen, am nächsten Morgen wieder nach vorn holen:
      „Heute“ zeigt den neuen Tag (am 1. eines Monats steht „Dein … ist fertig“), ohne etwas
      anzutippen.
- [ ] N2550. Repertoire-Trainer, Haken „Auch Eröffnungen aus der Praxis (Lichess)“: Unter dem
      Hinweis „nicht aus dem Buch“ steht jetzt ein Satz: „Nach dem Namen geht jede Variante mit den
      häufigsten Zügen von Spielern um 1200 weiter …“. Hast du schon gewertete Partien gegen die Bots
      gespielt, steht dort dein Band („dein Band nach deiner Wertung“). Ist der Satz verständlich?
- [ ] N2551. Wähle bei „Sizilianische Verteidigung“ unter „Varianten“ nur „Old Sicilian“, Seite
      Weiß, „Runde starten“. Die Variante endet nicht mehr nach 2… Sc6, sondern geht weiter: 3. Lc4 e6 4. O-O d5 5. exd5 exd5 6. Lb5 Ld7 7. Te1+ (ohne Wertung, Band 1200). Fühlt sich die Länge
      richtig an?
- [ ] N2552. Dasselbe als Schwarz mit „Englische Eröffnung“ (1. c4): Früher gab es als Schwarz
      keine Aufgabe, jetzt ziehst du die häufigsten Antworten (etwa 1… e5 …). Startknopf: „1 Variante“.
- [ ] N2553. Ohne Netz (Flugmodus, App schon installiert): Die Runde aus der Praxis ist trotzdem
      verlängert.
- [ ] N2549. **„Zur Stellung“ an einem Fehler:** In der Auswertung am Moment eines Patzers „Zur
      Stellung“ tippen. Das große Brett zeigt die Stellung nach dem Fehlerzug (der Zug ist in der
      Zugliste markiert); „Merken“ trägt genau diesen Zug in die Fehlerdatenbank ein.

### Neu in 0.3.44: Lizenzen, Wiki und großer Fehlertest (Nacht 31.10./1.11.2026)

- [ ] N2440. Karte „Heute“ mitten im Buch: Lies in Kapitel 6 ein paar Abbildungen (Kapitel 0 bis
      5 abgehakt, Übungen offen). Die Übungskachel nennt jetzt Kapitel 5 (das zuletzt gelesene
      fertige Kapitel), nicht mehr Kapitel 0.
- [ ] N2441. Karte „Heute“ mit eigenem Ziel: Hefte unter „Ziele“ das Ziel „Übungen von Kapitel 3“
      an. Die Übungskachel nennt jetzt Kapitel 3, auch wenn du dort noch nicht fertig gelesen hast.
- [ ] N2442. Karte „Heute“ mit sehr vielen fälligen Karten (über 20): Statt „etwa 134 Minuten“
      steht „Fang mit 20 an, das dauert etwa 14 Minuten“; die Kachel zeigt „200 fällig · 20 in etwa
      14 Min“.
- [ ] N2443. Karte „Heute“, alles erledigt (Tagesaufgabe gelöst, Kapitel gelesen): Als letzte
      Kachel steht „Partie · Gegen die Engine“; ein Tipp öffnet Spielen. Neulinge vor Kapitel 0
      sehen sie nicht.
- [ ] N2444. Zähltrainer: Unter dem Brett steht immer die Seite am Zug, die auf dem rot
      markierten Feld schlagen würde (fünf Aufgaben durchtippen).
- [ ] N2445. Nachschlagen › Werkzeuge des Buches: Die Bilder zeigen die neue Oberfläche (Leiste
      mit Symbolen, Bündel als Chips).
- [ ] N2446. Kapitelseite bei großer Schrift (Einstellungen › Schriftgröße 150 %) auf dem Handy:
      nichts ragt über den Rand, „Alle abhaken“ und „Alle zurücksetzen“ stehen bei Platzmangel
      untereinander.
- [ ] N2460. Auswertung einer Partie gegen einen Bot: Unter „In Zahlen“ auf „Schwarz (Botname)“
      tippen. Die Karte heißt jetzt „Züge von Botname“ statt „Deine Züge“; auf der eigenen Seite
      weiter „Deine Züge“.
- [ ] N2461. Spielen → Eigene Bots ohne eigenen Gegner: Über „Eigene Bots verwalten“ steht keine
      leere Fläche mit Trennlinie mehr.
- [ ] N2462. Profil → Partie einlesen (PGN): „1. e4 e5 2. Lc4 Sc6 3. Dh5 Sf6 4. Dxf7# 1-0“
      einfügen (deutsche Notation) und doppelt auf „Einlesen und auswerten“ tippen. Erwartet: Schäfermatt
      wird erkannt, in der Partienliste steht die Partie genau einmal.
- [ ] N2463. Partie einlesen mit einer Crazyhouse- oder Chess960-PGN von Lichess: Meldung „Das ist
      eine Schachvariante …“ statt einer kaputten Partie.
- [ ] N2464. Zwei Tabs (oder installierte App und Browser-Tab) offen: im einen den Namen im Profil
      ändern, im anderen eine Übung lösen oder Partie einlesen; danach beide neu laden. Erwartet: Name
      und die andere Änderung sind beide da.
- [ ] N2465. Datensicherung → „Sicherung einspielen“: Die Rückfrage nennt jetzt auch die Zahl der
      Partien.
- [ ] N2466. Blitzpartie 3 + 2 bis kurz vor 0:00 laufen lassen und genau beim Ablauf ziehen:
      Die Partie endet auf Zeit, der Zug wird nicht mehr ausgeführt.
- [ ] N2467. Nach Mitternacht (0–1 Uhr) eine Partie als PGN herunterladen bzw. eine Sicherung
      anlegen: Datei- und PGN-Datum zeigen den heutigen Tag, nicht gestern.
- [ ] N2420. Einstellungen (Zahnrad) › Lizenzen: Neu sind „In onnxruntime-web enthalten:
      protobuf.js, long.js, FlatBuffers, guid-typescript“, „Bibliotheken in der
      WebAssembly-Laufzeit von onnxruntime“, „Schrift Source Serif 4 (Adobe)“, „Häufige
      Eröffnungszüge ‚Aus der Praxis‘ …“ und „Hilfscode der Bauwerkzeuge …“. Bei jedem öffnet
      „Lizenztext“ einen lesbaren Text (der für die WebAssembly-Laufzeit nur mit Internet).
- [ ] N2421. Lizenzen, Eintrag „Zusatzpartien für ‚Zug erraten‘“: „Lizenztext“ öffnet den Text
      der CC BY-SA 4.0, auch im Flugmodus.
- [ ] N2422. Impressum (Startseite unten): Abschnitt „Quelltext und Rechte“ nennt „Version 3
      oder (nach deiner Wahl) jeder späteren Version“, den Link zum Quelltext und „Einstellungen ›
      Lizenzen“; der Link „Lizenzen“ unten führt zur Lizenzseite der App.
- [ ] N2423. Eine Trainingsseite (schach-von-grund-auf.com/training/) und die Datenschutzseite
      zeigen unten den Link „Lizenzen“.
- [ ] N2424. Sprache Englisch: Die Lizenzseite zeigt auch die neuen Einträge auf Englisch.
- [ ] N2430. Dashboard › Wiki (nach dem Zusammenführen und dem nächsten Push nach main):
      Seite „Die Ordner der App“ öffnen und nach „Lernpfad“ suchen. Erwartet: ein Abschnitt
      „ui/komponenten/lernpfad“ mit Stationen, Landschaften und Nebenaufgaben.
- [ ] N2431. Dashboard › Wiki: Seite „Acht Wege durch den Code“ öffnen. Erwartet: acht Abläufe,
      darunter „Belohnungen“ und „Der erste Start: Startwahl und Touren“. Verständlich ohne
      Programmierkenntnisse? Notiz, was unklar ist.
- [ ] N2432. Dashboard › Wiki: Suche nach „Buchbefund B7“ und nach „Zeit-Zählhilfe“. Erwartet:
      kein Treffer (Buchbefunde bleiben aus dem Wiki).
- [ ] N2433. Konzeptkarte (docs/konzeptkarte.html auf GitHub über „Raw“ oder lokal) auf dem
      Handy öffnen. Erwartet: neue Kreise wie „lernpfad“, „erfolge“, „start“; ein Tipp zeigt einen
      kurzen Text ohne abgeschnittenes „:“ am Ende.
- [ ] N2434. Codeführer „Woher die Zahlen kommen“: Stimmen die Zahlen in „Die App in Zahlen“ mit
      deinem Eindruck überein (765 Abbildungen, 16 Trainer, 84 Bots)?

### Neu in 0.3.43: Startwahl, Kennzahlen, Karte „Heute“, Orden und Nebenaufgaben (31.10.2026)

- [ ] N2370. **Startwahl:** Am besten in einem privaten Browserfenster schach-von-grund-auf.com/app/
      öffnen (wie eine frische Installation). Nach der Startanimation fragt die App „Willkommen! Wie
      möchtest du starten?“ mit drei Knöpfen: „Ich lese das Buch“, „Ich will spielen und Partien
      auswerten“, „Erst einmal umsehen“, darunter „Später“.
- [ ] N2371. **Buch-Weg:** „Ich lese das Buch“: Die Tour zeigt Willkommen, die Karte „Heute“, das
      Weg-Symbol („Dein Weg durchs Buch“), das Nummernfeld, die Kapitel (mit „Schon weiter? Hake
      Gelesenes ab“), die Leiste, das Toursymbol, im Browser den Tipp zum Installieren und am Ende
      „Los: Kapitel 0“. Der Knopf öffnet Kapitel 0. Nimmt dich das an die Hand?
- [ ] N2372. **Spielen-Weg:** In einem neuen privaten Fenster „Ich will spielen …“ wählen: Die App
      wechselt zu Spielen und zeigt „Schnell eine Partie“, die Kacheln, die Auswertung und das
      Einlesen einer Partie von Lichess oder chess.com mit dem Knopf „Partie einlesen“ (springt ins
      Profil zu „Deine Partien“).
- [ ] N2373. **QR-Adresse:** schach-von-grund-auf.com/app/?start=buch in einem privaten Fenster:
      Die Frage entfällt, die Buch-Tour beginnt gleich. Profil › Einstellungen › Hilfe › „Rundgang
      durch die App“ öffnet die Startwahl jederzeit wieder.
- [ ] N2374. **Kennzahlen im Profil:** Unter Stufe und Erfahrung stehen drei Kacheln: ✓ Übungen
      gelöst, Hantel Trainer-Durchgänge, Sprechblase Warum-Fragen, je mit großer Zahl. Eine Null
      steht blass. Die alten Zeilen unter den Orden sind weg.
- [ ] N2375. **Karte „Heute“ für Neue:** Frisch installiert steht dort „Anfangen · Kapitel 0 ·
      Abb. 0.1“, auch wenn du vorher kurz in eine andere Abbildung geschaut hast. Eine Abbildung,
      die nur kurz offen war, wird selbst vorgeschlagen statt übersprungen. Die Tagesaufgabe
      (Taktik) erscheint erst, wenn Kapitel 0 zu 80 % gelesen oder ein Trainer geschafft ist. Gibt
      es keine Alternativen, steht das Kreuz „Nicht jetzt“ rechts neben der großen Kachel.
- [ ] N2400. **Infofenster der Orden:** Profil › „Deine Erfolge“: Tippe auf einen Orden oder ein
      Abzeichen. Ein Fenster geht von unten auf: Bild, ein Satz, was man dafür tun muss, und der
      Stand („3 von 10“) oder „Geschafft am …“ mit „Teilen“. Ein offenes Stück zeigt das Bild blass
      in Farbe („so sieht es aus, wenn du es hast“). Kreuz oder Tipp daneben schließt.
- [ ] N2401. **Ringe:** Profil, „Dein Fortschritt“: Ein Tipp auf einen Ring (Abbildungen, Übungen,
      Lernziele, Trainer) öffnet dasselbe Fenster mit der Bedingung des Ordens. Auch Glanzstück und
      „Als Nächstes“ öffnen es. Bei einem offenen Abzeichen wie „Erste Partie“ führt „Los geht's“
      direkt dorthin.
- [ ] N2404. **Nebenaufgaben auf dem Weg:** Dein Weg durchs Buch: Neben jeder Station steht ein
      kleines Feld mit Stern oder Bild und „0/5“. Nichts ragt über den Rand. Wirkt der Weg noch
      ruhig?
- [ ] N2405. **Liste je Kapitel:** Tippe auf ein Feld: „Nebenaufgaben · Kapitel N“ mit Übungen,
      Lernzielen, Trainern des Kapitels und passenden Abzeichen und Orden. Passen die Stücke vom
      Niveau her zu den Kapiteln (etwa „Kurzer Prozess“ bei Kapitel 4, Kapitel 12 mit 11 Stücken)?
- [ ] N2406. **Los geht's:** In der Liste „Übungen Kapitel 1“ → „Los geht's“ öffnet die erste
      ungelöste Übung; „Trainer Kapitel 0“ den Koordinatentrainer (nach einer Runde 1/1 mit Haken,
      das Feld an Station 0 wird farbig); „Lernziele Kapitel 2“ die Checkliste.
- [ ] N2409. **Neue Abzeichen:** Im Regal „Abzeichen“ stehen „Kurzer Prozess“ (Matt in höchstens
      15 eigenen Zügen aus der Grundstellung) und „Neue Dame“ (eigenen Bauern umgewandelt).
      Gefallen dir Name, Bild und Bedingung? „Kurzer Prozess“ zählt auch gegen Stufe 1 (als
      Einsteigerziel); sag, falls nur gewertete Partien oder Bots ab Stufe 3 zählen sollen.
- [ ] N2410. **Dunkel:** Felder, Liste und Fenster der Nebenaufgaben sind im Dunkelmodus gut lesbar.
- [ ] N2412. **Trainer-Orden:** Der Ring „Trainings erstmalig absolviert“ zählt jetzt bis 17 (ohne
      Fehlerdatenbank, die keine Runde hat). Vorher war der Orden unerreichbar; wer alle 17 schon
      hat, bekommt nach dem Update die Gratulation.

### Neu in 0.3.42: Erklärungen und Tour geprüft (31.10.2026)

- [ ] N2361. **Tour im Profil:** Profil öffnen, Toursymbol oben rechts. Die Tour zeigt jetzt auch
      Erfolge (Orden und Abzeichen), den Weg durchs Buch, Themen, Rekorde und Extras; der Schritt
      zur Wertung spricht von Kacheln je Zeitklasse und dem „i“, nicht mehr von Reitern.
- [ ] N2362. **Tour bei Spielen:** Auf der Startseite von Spielen und auf jeder Unterseite (Gegner
      aussuchen, Eigene Stufe, Eigene Bots, Freie Partie) das Toursymbol antippen: Jeder Schritt
      zeigt auf etwas, das auf dieser Seite zu sehen ist. Im Blatt „Partie einstellen“ stehen die
      Erklärungen zu Spielhilfen und Eröffnung jetzt hinter einem „i“ an ihrer Überschrift, die zu
      Bedenkzeit und Wertung im „i“ bei „Gewertete Partie“.
- [ ] N2363. **Texte nennen nur, was es gibt:** Kapitel- und Denkroutine-Tour sprechen vom „i“ und
      von den Phasenkacheln; der Hinweis zu Maia verweist auf Profil › Einstellungen › „Bots und
      Wertung“; das Abzeichen „Zehn Ziele“ auf Buch › Karte „Heute“ › Ziele. Wenn dir irgendwo noch
      ein Text begegnet, der einen Knopf oder Reiter nennt, den es nicht gibt: bitte melden.

### Neu in 0.3.42: Weniger Text – Seiten (Arbeitschat, 31.10.2026)

Nach deiner Wahl („alle 15 Punkte umsetzen“) stehen auf vielen Seiten weniger Sätze: Bildzeichen
sagen dasselbe, und die Erklärungen stehen vollständig hinter einem ⓘ (Kreis mit kleinem i). Ein
Tipp auf ⓘ öffnet darunter eine Sprechblase, ein zweiter Tipp schließt sie. Bitte jeden Punkt im
dunklen und im hellen Modus ansehen und darauf achten, dass auf dem Handy nichts seitlich übersteht.

- [ ] N2350. **Leere Abschnitte (Wertung, Themen, Partien):** Im Profil ohne Daten: Wirken die
      gestrichelten Kacheln (Blitz, Stoppuhr, Tasse), die grauen Medaillenumrisse und die leere
      gestrichelte Liste klar als „hier ist noch nichts“? (Texte und Knöpfe sind vorgeprüft.)
- [ ] N2352. **Wertungsregeln hinter ⓘ:** Im Profil das ⓘ neben „Deine Wertung“: Fehlt dir in den
      beiden Sätzen etwas?
- [ ] N2353. **Partiekopf:** Starte unter „Spielen“ eine Partie gegen einen Bot (etwa Frau
      Schulz). Unter dem Titel „gegen Frau Schulz“ steht jetzt nur eine Zeile: rundes Porträt mit
      kleiner Stufennummer unten rechts, ein Chip mit König und „Weiß“ (oder „Schwarz“), ein Chip
      mit Buch und einem Wort für die Eröffnung („Praxis“, „Buch“ oder „Gewählt“) und rechts ⓘ.
      Tipp aufs Porträt: Der Satz des Bots erscheint als Sprechblase in Anführungszeichen, ein
      zweiter Tipp schließt sie. Tipp auf ⓘ: die frühere Zeile „Frau Schulz (Stufe 1 · Neuling) ·
      du spielst Weiß · Eröffnung wie Menschen dieser Stärke“. Nach dem Ende der Partie steht
      derselbe Kopf über der Auswertung. Zu zweit oder gegen eine eigene Stufe ohne Bot bleibt die
      alte Textzeile.
- [ ] N2356. **Denkroutine als Karten:** Nachschlagen, „Denkroutine“: Treffen die fünf Kurzzeilen
      („Was hat sich verändert?“, „Schach, Schlag, Drohung zuerst“, „Nicht die bequemste“, „Bis zur
      Ruhe, dann zählen“, „König sicher? Figur gedeckt?“) den Schritt, und sind die Titel die des
      Buches?

### Neu in 0.3.42: Weniger Text – Werkzeuge und Trainer (Arbeitschat, 31.10.2026)

Nach deiner Wahl „Umsetzen“ für alle Punkte der Runde „Weniger Text“ zeigen die Werkzeugkarten
und drei Trainer weniger Sätze und mehr Bildzeichen. Was vorher als Satz dastand, steht jetzt
hinter dem runden Fragezeichen-Knopf (ⓘ) rechts in der Zeile; ein Tipp klappt es auf, ein zweiter
zu. Bitte jeden Punkt im dunklen und im hellen Modus ansehen und darauf achten, dass auf dem
Handy nichts seitlich übersteht. Werkzeuge öffnest du so: unten „Buch“, die genannte Abbildung
antippen, dann in der Werkzeugleiste unter dem Brett das Werkzeug wählen (manche stecken in einem
Bündel des Kapitels, etwa „Denkroutine“ oder „Planfindung“; ein Tipp öffnet die Reiter).

- [ ] N2341. **Legende bei weiteren Werkzeugen:** Sicherheitsblick, Planbilanz und Warnsignale sind
      vorgeprüft. Wenn dir bei einem der übrigen Werkzeuge ein Stichwort der Legende nicht zu dem
      passt, was am Brett markiert ist: bitte mit Werkzeug melden.
- [ ] N2344. **Kandidaten als Zeilen:** Abb. 12.1, Werkzeug „Kandidaten“: Bekommen nach einigen
      Sekunden alle drei Zeilen eine Zahl (in der Prüfung stand bei Db1 einmal noch „–“)?

### Neu in 0.3.41: Einstellungen neu (Arbeitschat, 31.10.2026)

Die Einstellungen sind nach deiner Wahl des Entwurfs K2 „Brettvorschau oben“ neu gebaut: oben ein
großes Brett in deinen Farben und Figuren, darunter Farbfelder und Figurenkacheln zum Antippen,
dann drei Reiter (Bedienung, Anzeige, Hilfe) mit je einer Zeile pro Einstellung, ganz unten genau
einmal die Zeilen „Bots und Wertung“, „Deine Daten“ und „Über die App“. Öffnen: unten „Profil“,
dann oben „Einstellungen“. Bitte im dunklen und im hellen Modus ansehen.

- [ ] N2300. **Brettvorschau:** Profil › Einstellungen: Wirkt das große Brett oben ruhig genug, und
      passt der Hintergrund (dunkel Nachtblau, hell Creme)?
- [ ] N2304. **Reiter „Bedienung“:** Lassen sich die fünf Schalter mit dem Finger gut treffen?
- [ ] N2308. **Unterseiten:** „Bots und Wertung“, „Deine Daten“, „Über die App“: Fehlt dir etwas,
      das es vorher gab?
- [ ] N2309. **Tour der Einstellungen:** Kompass oben rechts: Stimmen die sieben Texte zu dem, was
      du siehst?

### Neu in 0.3.40: Eigene Engine für die Auswertung (31.10.2026)

- [ ] N2317. **Auswertung schneller fertig:** Eine Partie gegen einen Bot spielen und dabei
      zwischendurch das Engine-Symbol oder ein Werkzeug am Brett benutzen. Nach dem letzten Zug
      steht die Auswertung (Zeitleiste, Genauigkeit) schneller da als bisher, meist sofort; die
      Engine-Hilfe und der Bot antworten so schnell wie vorher. Auf Handys mit mindestens vier
      Kernen (auch dein Redmi) rechnet sie jetzt die ganze Partie über, auch während der Bot
      nachdenkt, auf eigenem Kern. Auf dem älteren Handy darauf achten,
      ob es dabei spürbar wärmer wird oder der Akku schneller sinkt; dann melden.

### Neu in 0.3.39: Maia rechnet in einem eigenen Thread (31.10.2026)

- [ ] N2316. **Kein Stocken mehr beim Rechnen des Bots:** Auf dem älteren Handy (Redmi) mit
      eingeschaltetem Maia eine Blitzpartie gegen einen Bot spielen und schnell ziehen. Deine
      Figur gleitet ohne Hänger, und auch die Uhr zählt gleichmäßig weiter, während der Bot
      nachdenkt (vorher konnte sie kurz stehen bleiben). Der Bot spielt so stark wie vorher.
      Danach einmal den Flugmodus einschalten, die App neu öffnen und wieder gegen einen Bot mit
      Maia spielen: Es geht auch ohne Netz.

### Neu in 0.3.38: Spielen neu (Arbeitschat, 31.10.2026)

Der Bildschirm „Spielen“ ist nach deiner Wahl neu gebaut (Entwurf J3 „Schnell eine Partie“):
oben ein Vorschlag mit großem Knopf „Spielen“, darunter Rivale, Spielstärke, vier Kacheln zu
eigenen Seiten und „Zuletzt gespielt“. Die Einstellungen von Stärke, Stil, Fehlern und Flecken
sehen aus wie bisher, nur der Weg dorthin ist neu. Öffnen: Tipp auf „Spielen“ unten in der Leiste.
Am besten einmal hell und einmal dunkel prüfen (Profil › Einstellungen › Anzeige).

- [ ] N2339. **Zuletzt gespielt und Revanche:** Nach ein, zwei Partien gegen Bots stehen sie
      unten (höchstens drei) mit Porträt, Name, „heute · 10 + 0“ und der Ergebnismarke (Pokal,
      Händedruck oder Kreuz). Tipp auf den Namen öffnet die Partie. „Revanche“ zeigt sofort oben
      „Schnell eine Partie“ mit genau diesem Bot (Satz „dein gewählter Gegner“) und einer Zeit
      derselben Zeitklasse. Genauso wirken „Revanche“/„Herausfordern“ auf der Rivalenkarte und
      „Spielen“ an einem angehefteten Ziel („Besiege Lotte in Schnellschach.“).

### Neu in 0.3.38: Auswertung neu (Arbeitschat, 31.10.2026)

Die Auswertung nach einer Partie ist nach deiner Wahl neu gebaut (Entwurf F2 „Zeitleiste der
Partie“): Ergebnis oben, die Partie als Zeitleiste in Momenten, darunter „In Zahlen“, ganz unten
„Neue Partie“ und „Teilen“. So kommst du zu einer Auswertung: „Spielen“ unten in der Leiste, einen
schwachen Bot wählen (etwa Derya, Gruppe „Neuling“ oder „Einsteiger“), „Partie beginnen“ und
etwa 15 bis 20 Züge spielen, gern mit einem absichtlich schlechten Zug; dann aufgeben („Aufgeben“
unter dem Brett, „Ja, aufgeben“) oder gewinnen. Die Engine rechnet danach einige Sekunden.

- [ ] N2321. **Die Partie in Momenten:** Wirkt die neue Zeitleiste weniger wie ein Formular als
      vorher?
- [ ] N2325. **Verlaufskurve:** Finger auf der Kurve halten und fahren zeigt den Zug, Loslassen
      springt dorthin, zwei Finger zoomen: alles wie vor dem Umbau?
- [ ] N2329. **Nichts verloren:** Zugliste mit Zeichen und „Alle Züge zeigen“, Pfeile zum Blättern,
      Uhren, Bewertungsbalken links am Brett, Drehen, Ruhige Ansicht (blendet die Auswertung aus,
      Ergebnis und „Neue Partie“ bleiben), „Besserer Zug“/„Bestrafung“ abspielen, Nebenzweig,
      „Zurücknehmen“ nach dem Ende (nur in ungewerteten Partien), die Meldung „Gruppenmodus frei“ und während der Rechnung
      „Die Engine wertet die Partie aus …“ mit Balken: alles noch da?

### Neu in 0.3.38: Buchseite und Lernpfad neu (Arbeitschat, 31.10.2026)

Die Startseite „Buch“ und „Dein Weg durchs Buch“ sind nach deiner Wahl der Entwürfe neu gebaut:
A2 „Heute“ und B1 „Fünf Landschaften“. Weniger Text, mehr Bild; die Kapitel beginnen weiter oben.
Bitte jeweils im dunklen und im hellen Modus ansehen (Profil › Einstellungen › Darstellung).

- [ ] N2254. **Woche als Reiter:** Unten in der Karte „Heute“ drei runde Reiter „Aufträge 1/3“,
      „Plan“ und „Ziele“, ein Tipp klappt auf, ein zweiter zu. Ist „Reiter nebeneinander“ statt
      drei Zeilen für dich gut bedienbar?
- [ ] N2257. **Lernpfad, Landschaften:** Weg-Symbol oben rechts im Buch. Fünf Bänder: Grundlagen
      auf Schachbrettmuster, Eröffnung in der Morgendämmerung, Mittelspiel über Hügeln mit Türmen,
      Endspiel unter Nachthimmel, Praxis im Turniersaal. Gefallen dir die Bilder, hell wie dunkel?

### Neu in 0.3.37: Trainer-Startseiten neu (Arbeitschat, 31.10.2026)

Alle Trainer mit Runden beginnen jetzt mit derselben Startkarte (dein Entwurf G1): oben ein
kleines Beispielbrett mit einem Satz, worum es geht; darunter „Deine Runde“ als antippbare Zeilen
mit den Werten deiner letzten Runde; ein großer Knopf „Runde starten“; darunter weitere Modi als
kleinere Knöpfe. Die frühere Beschreibung steht hinter „So funktioniert dieser Trainer“. Öffnen:
unten „Training“, beim Trainer „Trainieren“. Am besten im dunklen und im hellen Modus ansehen
(Einstellungen › Farbschema).

- [ ] N2280. **Taktiktrainer:** Startkarte mit Brett, „Finde den Zug, der gewinnt“, „Deine Runde“
      mit drei Zeilen, großem Knopf und „Serie ohne Fehler“. Wirkt das ruhiger als vorher, und
      liest sich alles ohne Erklärung?
- [ ] N2284. **So funktioniert:** Unten auf der Startkarte „So funktioniert dieser Trainer“
      antippen. Reicht das, oder fehlt dir etwas, das vorher sichtbar war?

### Neu in 0.3.36: Steckbriefe und Glossar neu (Arbeitschat, 31.10.2026)

Steckbriefe und Glossar sind nach deiner Wahl der Entwürfe neu gebaut: Die Steckbriefe zeigen die
Eröffnungen als Baum ihrer ersten Züge (Entwurf H2), das Glossar sieht aus wie eine Lexikonseite
(Entwurf I3). Weg: „Nachschlagen“ unten in der Leiste, dann „Steckbriefe“ bzw. „Glossar“. Bitte
hell und dunkel ansehen (Einstellungen, Farbschema).

- [ ] N2290. **Eröffnungsbaum:** Nachschlagen › Steckbriefe: die zwei Stämme 1. e4 und 1. d4 mit
      13 Karten. Passt die Ordnung so?
- [ ] N2291. (unverändert lassen; Frage an dich)
- [ ] N2292. **Karten im Baum:** Ist auf deinem Handy alles lesbar, auch „Zweispringerspiel und
      Läuferspiel“ ganz rechts (bricht das Wort sauber um)? Die Unterzeilen enden fast alle mit
      „…“; stört dich, dass „Abschnitt …“ dadurch meist fehlt?
- [ ] N2295. **Glossar als Lexikonseite:** Nachschlagen › Glossar, Tipp auf „F“. Wirkt es wie
      ein Lexikon?
- [ ] N2296. (unverändert lassen; Frage an dich)

### Neu in 0.3.34: Profil – Zurückgeholt, was bei der Neugestaltung wegfiel (Arbeitschat, 31.10.2026)

Bei der Neugestaltung des Profils waren ein paar nützliche Dinge weggefallen; sie sind zurück,
ohne die neuen Karten zu überladen. Profil: Tipp auf „Profil“ unten in der Leiste.

- [ ] N2310. **Verlauf je Phase:** Erst nach einigen ausgewerteten gewerteten Partien: In „Deine
      Wertung“ unter „Nach Phasen“ einen Balken antippen: Die Kurve dieser Phase erscheint mit
      „Spanne …“; ein zweiter Tipp schließt sie.

### Neu in 0.3.33: Training und Checkliste neu (Arbeitschat, 31.10.2026)

Der Bereich „Training“ und die Gesamt-Checkliste sind nach deiner Wahl der Entwürfe neu gebaut
(Training C2, Checkliste D1): weniger Text, mehr Bild, am Handy im dunklen Modus gut lesbar.
Training: Tipp auf „Training“ unten in der Leiste. Checkliste: „Nachschlagen“ › „Gesamt-Checkliste“.

- [ ] N2261. **Durchgehen:** Unter „Dein Stapel für heute“ steht kurz, wann Gelöstes wiederkommt;
      ein Tipp zeigt die ganze Erklärung. Passt das so?
- [ ] N2263. **Trainer-Karte:** Unten „Training“: Jede Karte zeigt ein kleines Brett mit einer
      typischen Stellung. Erkennst du die Trainer an den Bildern?
- [ ] N2266. **Link zur Trainingsseite:** Der Link „Training zu diesem Kapitel (Website)“ steht
      jetzt im Buch in jedem Kapitel in der Karte „Training und Übungen“. Ist der Platz recht?

### Neu in 0.3.32: Deine Extras neu – „Ankleide“ (Arbeitschat, 31.10.2026)

Die Profilkarte „Deine Extras“ ist nach deiner Wahl neu gebaut (Entwurf E1 „Ankleide“): oben eine
Vorschau, wie du gerade aussiehst, darunter Reiter je Art mit Kacheln, die du antippst statt
Knöpfe zu drücken. Profil: Tipp auf „Profil“ unten in der Leiste, dann nach unten bis „Deine
Extras“. Zum Prüfen ohne echten Fortschritt: Aufgabenseite (drei Sekunden auf das Zahnrad bzw.
„Profil“) › „Abzeichen testen (nur für dich)“ › mehrmals „Nächste Stufe erreichen“; „Probe
beenden“ stellt alles zurück.

- [ ] N2270. **Extras, Vorschau:** Profil › „Deine Extras“: Kasten „So siehst du gerade aus“ mit
      Porträt, kleinem Brett und Konfetti im Hintergrund. Wirkt das einladend, nicht wie ein
      Formular?
- [ ] N2274. **Gesperrte Extras:** Abgedunkelt mit Schloss, Bedingung und kleinem Balken. Ist
      klar, was man tun muss?

### Neu in 0.3.31: Profil neu – Orden, Wertung, Rekorde (Arbeitschat, 31.10.2026)

Drei Karten im Profil sind neu gebaut, nach deiner Wahl der Entwürfe: „Deine Erfolge“ (Orden und
Abzeichen mit Glanzstück und Regalen), „Deine Wertung“ (drei Kacheln) und „Deine Rekorde“
(Erreichtes und Herausforderung). Jede zeigt am Anfang nur, was schon etwas bedeutet; Leerstellen
werden zu einem nächsten Schritt. Profil: Tipp auf „Profil“ unten in der Leiste. Proben über die
Aufgabenseite (drei Sekunden auf das Zahnrad bzw. „Profil“): „Orden testen“ und „Abzeichen
testen“; „Probe beenden“ stellt alles zurück.

- [ ] N2240. **Erfolge, Glanzstück:** Profil › „Deine Erfolge“: Der flache Streifen „Zuletzt
      verdient“ ist etwa halb so hoch wie im Entwurf. Passt die Höhe so?
- [ ] N2241. **Erfolge ohne verdientes Stück:** Auf einem frischen Gerät steht „Dein erstes Stück
      wartet: Erste Partie. …“ mit Silhouette. Freundlich genug?
- [ ] N2243. **Regale:** Die Regale in „Deine Erfolge“ (Buch, Teile, Bots, Abzeichen) seitlich
      wischen. Lässt es sich gut wischen?
- [ ] N2246. **Wertung, Schätzung:** Eine Kachel mit „≈ 1460 geschätzt“ antippen: Ist der Satz
      darunter verständlich?

### Neu in 0.3.29: Meisterschaft je Thema (Arbeitschat, 31.10.2026)

Jedes Thema, das du in einem Trainer übst (die zwölf Taktikmotive, Endspielthemen, Bauernstrukturen,
Falle oder Köder), bekommt eine Medaille: Bronze für 5 richtige Antworten, Silber für 15 richtige
mit mindestens 70 % der letzten 20 Antworten richtig, Gold für richtige Antworten an mindestens
3 verschiedenen Tagen, zwei davon mindestens 7 Tage auseinander. Einmal erreicht, bleibt die
Stufe. Zum Prüfen ohne echten Fortschritt: Aufgabenseite (drei Sekunden auf das Zahnrad) ›
„Themen testen (Meisterschaft)“ › etwa „Fesselung zur Probe auf Silber“; die Probe zählt nur für
die Karte „Deine Themen“ und die Titel, nicht für Erfahrung und Abzeichen. Danach „Probe beenden“.

- [ ] N2181. **Erste echte Medaille:** Fünf Aufgaben eines Motivs richtig lösen. Gefällt dir die
      Meldung „Fesselung: Bronze!“ mit kurzem Glanz am Rundenende?
- [ ] N2184. **Teilen:** Profil › Deine Themen, Thema mit Medaille antippen, „Teilen“. Gefällt dir
      das Bild „Meisterschaft“?
- [ ] N2185. **Medaillenbilder:** Probe für mehrere Themen auf Bronze, Silber und Gold
      (Aufgabenseite › Themen testen). Sind die drei Stufen gut zu unterscheiden?
- [ ] N2186. **Abzeichen der Meisterschaft:** Profil › Deine Erfolge › Regal „Abzeichen“: „Erstes
      Gold“, „Fünf Themen in Silber“, „Alle Taktikmotive in Gold“. Passen Namen und Bilder?
- [ ] N2188. **Erfahrungspunkte:** Bronze bringt 10, Silber weitere 25, Gold weitere 50 Punkte
      (geprüft). Passt die Gewichtung?

### Neu in 0.3.28: Wochenaufträge (Arbeitschat, 31.10.2026)

Neu in der Karte „Deine Woche“ oben im Buch (erscheint nach dem ersten Lerntag; erst ein
Wochenziel wählen): der Abschnitt „Aufträge dieser Woche“ mit drei Aufträgen, fest von Montag bis
Sonntag. Jeder zeigt „1 von 3“, hat einen Knopf, der direkt hinführt, und einmal „Tauschen“.
Erledigt: Haken und „+15 Erfahrung“. Nicht Erledigtes verschwindet am Sonntag ohne Hinweis.
Mögliche Aufträge: neue Abbildungen ansehen, Übungen lösen, eine Runde in einem Trainer, der lange
nicht dran war, einen Bot eine Stufe über deinem stärksten besiegten schlagen, Warum-Fragen, ein
Lernziel abhaken, fällige Karten wiederholen, einen Fehler eintragen, Partien spielen, die
Tagesaufgabe an mehreren Tagen. Noch nicht auf der Testseite: Zweig `gami-p6-wochenauftraege`.

- [ ] N2190. **Wochenaufträge:** Buch › Karte „Heute“ › Reiter „Aufträge“. Klingen die Sätze
      freundlich und freiwillig genug?
- [ ] N2195. **Tauschen:** Jeden Auftrag kann man einmal tauschen (geprüft). Genügt das?
- [ ] N2196. **Bot besiegen:** Der Auftrag „Besiege einen Bot der Stufe N“ nennt eine Stufe über
      deinem stärksten besiegten Bot. Passt diese Stufe für dich?
- [ ] N2198. **Abzeichen „Acht Aufträge“:** Profil › Deine Erfolge › Regal „Abzeichen“ (Raute mit
      8). Gefällt Bild und Bedingung?

### Neu in 0.3.27: Monatsrückblick (Arbeitschat, 31.10.2026)

Am Anfang jedes Monats schaut die App ruhig auf den Vormonat zurück: Kalender mit deinen
Lerntagen, was du gemacht hast, Wertung, neu verdiente Orden und Abzeichen, neue Rekorde, dein
sicherstes Thema und eins zum Üben, dazu ein nächster Schritt für den neuen Monat. Ab morgen
(1. November) siehst du den Oktober echt. Vorher als Probe: Aufgabenseite (drei Sekunden auf
„Profil“ bzw. das Zahnrad) › „Monatsrückblick testen“ › „Rückblick dieses Monats öffnen“ zeigt den
laufenden Monat; die Probe ändert nichts.

- [ ] N2212. **Rückblick, Kalender:** Ab 1. November den echten Oktober öffnen. Stimmen die
      goldenen Lerntage mit deinem Gefühl überein?
- [ ] N2218. **Rückblick teilen:** „Rückblick teilen“ am Handy. Öffnet sich das Teilen-Menü, und
      gefällt dir das Bild?

### Neu in 0.3.26: Rivalen unter den Bots (Arbeitschat, 31.10.2026)

Ein Bot als Rivale: etwas stärker als du (50 bis 150 Punkte über deiner Wertung in der Zeitart
deiner letzten gewerteten Partie) und noch nie gewertet von dir besiegt. Ohne Wertung ist es ein
Bot der niedrigsten Stufe, in der du noch nicht jeden besiegt hast. Das Duell ist gewonnen, wenn
du ihn zum ersten Mal in einer gewerteten Partie besiegst; dann gratuliert er, und ein neuer
Rivale stellt sich vor. Die Karte steht oben im Buch (höchstens zwei Karten zugleich: „Dein
nächster Schritt“ und „Deine Woche“ kommen vorher; „Nicht jetzt“ bzw. „Später“ dort machen Platz).
Im Bereich Spielen erscheint sie erst, wenn der Haupt-Chat sie dort einträgt.

- [ ] N2207. **Abzeichen der Rivalen:** Profil › Deine Erfolge › Regal „Abzeichen“: „Drei Rivalen
      besiegt“ und „Zehn Rivalen besiegt“. Gefallen die Bilder?
- [ ] N2208. **Sprüche lesen:** Es gibt je Charakter vier Sprüche (Begrüßung, nach Sieg des Bots,
      Remis, nach seiner Niederlage), zwölf Charaktere. Klingen sie freundlich und ohne Druck?
      Wünsche zu einzelnen Sätzen einfach als Text schicken („N2208: Materialist …“).

### Neu in 0.3.26: Eigene Ziele (Arbeitschat, 31.10.2026)

Du heftest dir bis zu drei eigene Ziele an, etwa „Besiege Lotte in Schnellschach“ oder „Noch 2 Bots
für den Orden …“. Sie stehen in der Wochenkarte oben im Buch („Deine Woche“) als Abschnitt „Deine
Ziele“, unter Wochenziel und Übungsplan. Die Wochenkarte zeigt ihre Abschnitte erst, wenn ein
Wochenziel gewählt ist; wähle also zuerst in „Deine Woche“ ein Wochenziel (etwa „3 Tage“). Kein
Ablaufdatum, nicht erreichte Ziele zählt die App nirgends.

- [ ] N2230. **Zielvorschläge:** Buch › Karte „Heute“ › Reiter „Ziele“. Klingt jeder Vorschlag
      natürlich?
- [ ] N2238. **Abzeichen „Zehn eigene Ziele“:** Profil › Deine Erfolge › Regal „Abzeichen“
      (Banner mit 10, hellblau). Gefällt das Bild?

### Neu in 0.3.25: Serienmodus im Taktiktrainer (Arbeitschat, 31.10.2026)

Neu im Taktiktrainer neben „Runde starten“: der Knopf „Serie ohne Fehler“. Die Aufgaben werden
immer schwerer (je drei Aufgaben der Stufen 1 bis 5, danach die schwersten zuerst), es läuft keine
Uhr. Der erste Fehler beendet die Serie; auch eine Hilfe oder „Lösung zeigen“ zählt als Fehler.
Das Ergebnis heißt etwa „12 in Folge“ und steht als Rekord „Taktikserie ohne Fehler“ in Profil ›
Deine Rekorde. Außerdem wählt der Taktiktrainer jetzt das Motiv vor, wenn „Dein nächster Schritt“
ein unsicheres Taktikthema vorschlägt.

- [ ] N2221. **Serie wird schwerer:** Taktiktrainer › „Serie ohne Fehler“, einige Aufgaben lösen.
      Steigt die Schwierigkeit ab Stufe 2 spürbar?
- [ ] N2224. **Serie beenden:** Ab der ersten gelösten Aufgabe gibt es „Serie beenden“. Brauchst du
      den Knopf, oder lieber weglassen?

### Neu in 0.3.21: Rekordtafel (Arbeitschat, 31.10.2026)

Wettbewerb mit dir selbst statt Bestenliste: Im Profil steht die Karte „Deine Rekorde“ mit acht
Rekorden (Taktik auf Zeit, beste Tagesserie, richtige Trainerantworten an einem Tag, Lerntage in
einer Woche, Trefferquote „Zug erraten“, höchste Wertung, stärkster besiegter Bot, längste Partie
ohne Patzer), je mit Wert, Datum und Knopf „Versuchen“. Ein neuer Rekord erscheint als Meldung.

- [ ] N2141. **Rekord am Rundenende:** Jede Trainerrunde, die die Tagessumme erhöht, meldet einen
      neuen Rekord „richtige Antworten an einem Tag (vorher …)“. Zu oft oder genau richtig?
- [ ] N2145. **Partie-Rekorde:** Eine gewertete Partie gegen einen Bot gewinnen und auswerten
      lassen. Zählt sie ohne Patzer für „Längste Partie ohne Patzer“ (in Halbzügen)?
- [ ] N2147. **Abzeichen „Drei Rekorde“:** goldener Stern mit der 3. Gefällt das Bild?

### Neu in 0.3.21: Kombo und Fundstücke (Arbeitschat, 31.10.2026)

Kleine Momente beim Üben, in jedem Trainer mit Runde (Feld finden, Taktik, Endspiel, Struktur und
alle übrigen mit „Aufgabe 1 von …“). Die Kurzpläne (Taktik auf Zeit, Tagesaufgabe) zeigen die
Kombo nicht, weil sie ohne diesen Rundenrahmen laufen.

- [ ] N2160. **Kombo:** Feld finden, drei richtige in Folge: Schild „3 in Folge“. Gut sichtbar,
      aber nicht störend?
- [ ] N2163. **Ton:** Mit Ton an (Einstellungen) klingt ab der dritten richtigen Antwort in Folge
      ein kurzer heller Ton, jedes Mal einen Halbton höher (höchstens eine Oktave). Ein Fehler
      bleibt still. Angenehm oder zu viel?
- [ ] N2165. **Selten und höchstens eins am Tag:** Danach kommt ein Fundstück nur noch etwa jede
      zwölfte Runde, nie zweimal am selben Tag und nie nach einer Runde ganz ohne richtige
      Antwort; keins kommt doppelt. Fühlt sich das selten genug, aber nicht zu selten an?
      (Empfehlung, schon umgesetzt: das erste sicher, damit jeder das Album kennenlernt, ohne
      dass es angekündigt wird; Widerspruch genügt.)
- [ ] N2166. **Album im Profil:** Nach dem ersten Fund steht im Profil unter „Dein Fortschritt“
      die Karte „Fundstücke“ mit „1 von 83 gefunden“ und „Album öffnen“. Das Album zeigt alle 83
      Plätze in fester Reihenfolge: gefundene als Karte, die übrigen gestrichelt als „Nr. 12 ·
      Noch nicht gefunden“. Vor dem ersten Fund gibt es die Karte nicht (Überraschung statt
      Versprechen). Passt das?
- [ ] N2167. **Texte lesen:** 83 eigene Texte, 30 aus der Geschichte, 22 Kuriositäten,
      31 Merksätze. Die Merksätze geben den Gedanken eines Kapitels sinngemäß wieder (etwa
      „Merksatz · Kapitel 7: Wo zwei Figuren ungedeckt stehen, lohnt sich der Blick nach einer
      Gabel.“), keine wörtlichen Buchsätze. Sie gelten nach Regel 9 vorerst als abgesegnet; bitte
      beim Lesen melden, wenn ein Kapitel nicht passt oder ein Satz anders klingen soll
      (Kennung steht im Katalog inhalte/de/fundstuecke.json, Text in den Sprachdateien unter
      fundstueck.text.…).

### Neu in 0.3.20: Teilen ohne Server (Arbeitschat, 31.10.2026)

- [ ] N2150. **Abzeichen teilen am Handy:** Aufgabenseite › „Abzeichen testen“ › „Erster Sieg:
      verdienen“, in der Meldung „Teilen“. Öffnet sich das Teilen-Menü, und gefällt dir das Bild?
- [ ] N2156. **Datenschutz:** schach-von-grund-auf.com/datenschutz/ › „Speicher auf deinem
      Gerät“: Ein neuer Absatz erklärt das Teilen (Bild entsteht auf dem Gerät, Link enthält nur
      die Kennung der Aufgabe, sonst verschickt die App nichts). Stand: 31. Oktober 2026. Passt
      der Text für dich?

### Neu in 0.3.20: Wochenziel und Übungsplan (Arbeitschat, 31.10.2026)

Neu oben im Buch: die Karte „Deine Woche“. Du wählst selbst, an wie vielen Tagen pro Woche du
üben willst; die Karte zeigt deine Lerntage von Montag bis Sonntag, einen Ring „2 von 3 Tagen“ und
wie viele Wochen du dein Ziel schon erreicht hast. Darunter planst du, wann du übst, und trägst den
Plan in deinen Kalender ein. Als Lerntag zählt ein Tag mit einer Abbildung, einer Übung, einer
Trainerfrage, einer Karte oder einer Partie (bloßes Öffnen nicht).

- [ ] N2136. **Wochenabzeichen:** „Vier gute Wochen“ (Sechseck mit 4) und „Zwölf gute Wochen“
      (Strahlenkranz mit 12) im Regal „Abzeichen“. Gefallen Namen und Bilder?
- [ ] N2137. **Übungsplan ändern:** Buch › Karte „Heute“ › Reiter „Plan“: einen gespeicherten Plan
      ändern und dann „Plan entfernen“. Klappt beides?
- [ ] N2138. **Kalender auf dem iPhone:** „In meinen Kalender“ (und, wo es angeboten wird,
      „Teilen“) gibt die Datei „schach-ueben.ics“ weiter. Lässt sich der Termin übernehmen, mit
      Wiederholung an deinen Tagen, 20 Minuten lang, Erinnerung zur Startzeit, Titel „Schach üben“
      und deinem Satz in der Beschreibung? Bitte in der installierten App und in Safari.
- [ ] N2139. **Kalender auf Android:** Dasselbe auf einem Android-Handy (Google Kalender oder der
      Kalender des Herstellers). Wird der Termin übernommen und erinnert er dich?

### Neu in 0.3.18: Gamifizierung, Grundlage (Welle 0, Opus, 31.10.2026)

Unsichtbar für dich, aber die Grundlage aller folgenden Spielelemente: Die App merkt sich jetzt je
Tag, was du getan hast, und je Thema, wie viele Trainerantworten richtig waren. Beim ersten Start
werden deine bisherigen Daten in das neue Format 7 umgewandelt; aus dem, was schon ein Datum hat
(angesehene Abbildungen, Übungen, Partien), wird das Tagesprotokoll nachgetragen.

- [ ] N2100. **Update ohne Verlust:** Nach dem Aktualisieren auf deinem Handy ist alles wie
      vorher: Fortschritt im Buch, Orden, Abzeichen, Partien, Wertung, eigene Bots, Lernsammlung,
      Fehlerdatenbank. Stimmt alles?

### Neu in 0.3.16: Trainer-Feinschliff (Nebenchat, 30.10.2026)

- [ ] N2002. **Zähltrainer, Stufen:** Passen „leicht“ (höchstens drei beteiligte Figuren) und
      „schwer“ (viele Figuren, Batterie oder Fesselung)? Zu wählen in der Zeile „Stufe“.
- [ ] N2006. **Röntgen-Trainer:** Sind Aufgaben der Stufe „schwer“ (7 bis 10 Pfeile) schwer genug?
- [ ] N2007. **Strukturerkenner:** Passen die Pläne jetzt zum Buch (107 Aufgaben; Abb. 5.28, 5.7,
      5.12, 5.19, 5.31, 5.37 sind keine Aufgaben mehr)?
- [ ] N2012. **Abweichungsmodus:** Wählt die Engine Abweichungen, auf die du reagieren musst, und
      hilft „Hinweis: Was will … mit …?“?

### Neu in 0.3.15: Phasen in eigenen Partien wie bei Schachexperten (Opus, 30.10.2026)

- [ ] N1044. **Mittelspiel beginnt später:** Spiele eine Partie gegen einen Bot und öffne danach
      den Rückblick. Der Hinweis „Mittelspiel“ kommt jetzt erst, wenn beide Seiten entwickelt sind
      und rochiert haben (Glossar), oder vorher, wenn schon viel passiert ist: vier Figuren
      getauscht, eine Grundreihe fast leer, oder die Figuren beider Seiten stehen eng
      ineinander. Bei Lichess-Partien liegt der Wechsel jetzt im Mittel um Zug 10 (vorher um
      Zug 5 bis 6). Wirkt der Wechsel in deinen Partien richtig?
- [ ] N1045. **Grund des Wechsels:** Im Rückblick steht beim Wechsel ins Mittelspiel „Neue Phase
      ab hier.“ mit einem Satz zum Grund. Sind die Sätze verständlich?
- [ ] N1046. **Endspiel nur mit wenig Material:** Tauscht in einer Partie früh die Damen, bleiben
      aber Türme und Leichtfiguren am Brett, nennt der Rückblick das jetzt „damenloses
      Mittelspiel“. Endspiel ist es in eigenen Partien erst, wenn jede Seite höchstens 13 Punkte
      Figuren hat (etwa Turm, Turm und Läufer) oder nur noch sechs Figuren am Brett stehen, wie bei
      Speelman und Lichess. Passt das zu deinem Gefühl?
- [ ] N1048. **Bots neu geeicht:** Die Fehlerraten der Bots je Phase, das Elo-Modell der
      Partiebewertung und die Zugwahl sind mit der neuen Phasenregel neu gerechnet (dieselben
      Partien, nur die Phase je Stellung neu). Weil die Eröffnung jetzt länger dauert, verteilen
      sich die Fehlerarten etwas anders auf die Phasen (die meisten kommen in der Eröffnung jetzt
      etwas öfter vor, weil die späteren Eröffnungszüge schwerer sind). Die Spielstärke bleibt
      gleich: 78 Paarungen mit je 24 Partien, alt gegen neu mit denselben Zufallszahlen, ergaben +0,2 Prozentpunkte (Messgenauigkeit ±1,1). Fällt dir beim Spielen
      etwas auf?

### Neu in 0.3.14: Erfahrungspunkte und Abzeichen (Opus-Arbeitschat, 30.10.2026)

- [ ] N1090. **Namen der Stufen:** Erster Zug, Entwicklung, Zentrum, Rochade, Offene Linie,
      Vorposten, Freibauer, Kombination, Zugzwang, Meisterplan. Passen Namen und Reihenfolge?
- [ ] N1091. **Gewichte der EP:** Profil › Deine Erfolge › „So bekommst du Orden, Abzeichen und
      EP“. Passen Gewichte und Schwellen (100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000)?
- [ ] N1095. **Nichts verfällt:** Eine Pause nimmt dir kein Abzeichen und keine Stufe. Ein
      einmal gemeldetes Abzeichen bleibt, auch wenn die Partie dazu später aus der Liste der
      letzten 50 Partien fällt. Es gibt keine Bestenliste, nichts verlässt das Gerät. Passt
      dir der ruhige Ton, oder wünschst du dir bei Abzeichen doch Feuerwerk und Ton wie bei den
      Orden?

### Neu in 0.3.14: Feste Eröffnungen für eigene Bots (Opus-Arbeitschat, 30.10.2026)

- [ ] N1083. **Abweichung:** Ist die Vorgabe 0 % richtig, oder lieber etwa 20 %?
- [ ] N1084. **Beschreibung:** „Eröffnet gern: Italienische Partie oder London-System.“, ab drei
      „Eröffnet gern: A, B (und 1 weitere).“ Gefällt dir der Satz?
- [ ] N1087. **Abweichung im Spiel:** Denselben Bot auf 100 % stellen: Er eröffnet dann wie ohne
      Festlegung (meist 1. e4). Bei 50 % verlässt er die Linie im Mittel nach ein bis zwei
      Buchzügen. Fühlt sich das richtig an?

### Neu in 0.3.14: Zusatzaufgaben von Lichess im Taktiktrainer (Opus-Arbeitschat, 30.10.2026)

- [ ] N1072. **Lichess-Themen:** Passen die 20 Themennamen zu deinen Begriffen („Röntgenangriff“
      bewusst nicht dabei)?
- [ ] N1073. **Stufen:** Stufe 1 bis 5 wählen (Stufe 1: Lichess-Wertung unter 1000, Stufe 5:
      1900 bis 2200). Je Thema und Stufe gibt es zehn Aufgaben. Fühlen sich Stufe 1 leicht und
      Stufe 5 schwer an?
- [ ] N1074. **Gegnerzug vorgespielt:** Ist die Pause von 0,7 Sekunden vor dem Zug des Gegners
      angenehm?
- [ ] N1075. **Lichess-Aufgabe, falscher Zug:** Roter Pfeil und Verlust laut Engine wie bei den
      Buchaufgaben?
- [ ] N1076. **Motivfrage:** Einverstanden mit der Zuordnung der Lichess-Themen zu den zwölf
      Grundmotiven (Räumung zur Hinlenkung, Ablenkung zur Überlastung)?
- [ ] N1078. **Offline:** Die App einmal online öffnen, dann im Flugmodus den Taktiktrainer und
      „Zusatzaufgaben (Lichess)“ öffnen. Die Themen erscheinen und die Runde läuft.

### Neu in 0.3.14: Mehr Meisterpartien für „Zug erraten“ (Opus-Arbeitschat, 30.10.2026)

- [ ] N1061. **Berühmte Partien:** Bitte ein paar Kurztexte lesen: Stimmen sie, klingen sie gut?
- [ ] N1064. **Offline:** Ohne Netz „Berühmte Partien“ und „Aktuelle Turniere“ öffnen: Die Listen
      kommen.

### Neu in 0.3.14: Webverweise, Trainer der App neben Lichess (Opus-Arbeitschat, 30.10.2026)

- [ ] N1052. **Linkprüfung im Dashboard:** Nach dem nächsten Wartungslauf (schach-von-grund-auf.com/admin/,
      Übersicht, Gruppe „Links“) prüft „App-Texte und Lizenzen“ jetzt auch die Quellen der
      Lizenzseite, die ohne „https://“ dastehen (etwa github.com/niklasf/chessops). Neu ist
      außerdem: Leitet eine Adresse auf eine andere Domain weiter (so sieht eine abgelaufene,
      geparkte Domain aus), wird der Punkt gelb mit „umgeleitet nach …“. Heute sollte alles grün
      sein. Ist es das?

### Neu in 0.3.12: Wiki im Dashboard (Opus, 30.10.2026)

- [ ] N1040. **Wiki:** schach-von-grund-auf.com/admin/ öffnen (wie immer mit dem Einmalcode).
      Oben stehen jetzt zwei Knöpfe, „Übersicht“ (alles wie bisher) und „Wiki“. Im Wiki:
      „Projekt“ mit Arbeitsregeln, Architektur, Fortschritt (die 40 neuesten Stände), Lizenzen
      und je Entscheidung eine Seite; „Code“ mit dem Codeführer, den Begriffen und je Ordner
      der App einer Seite mit allen Dateien (Zweck, Rolle, was sie anbietet). Oben sucht „Im Wiki
      suchen“ im ganzen Text und zeigt die Fundstelle; „Titel filtern“ kürzt die Liste. Ein Tipp
      öffnet die Seite. Die Seiten kommen nach jedem Push nach main mit dem Lauf „Wartung“ neu
      (etwa 15 bis 20 Minuten nach dem Push); Buchbefunde sind ausgenommen, Buchtexte stehen
      ohnehin nicht in diesen Unterlagen. Gespeichert wird nur in der Datenbank des Dashboards
      hinter Cloudflare Access, nie als Datei im Repository. Steht dort „Noch keine Seiten“, ist
      der Lauf noch nicht durch. Ist das Wiki so brauchbar?

### Neu in 0.3.9: Bilder im Nachschlagen (Opus, 30.10.2026)

- [ ] N1036. **Werkzeuge mit Bildschirmfoto:** Nachschlagen › Werkzeuge des Buches, ein
      Werkzeug aufklappen (etwa LAP). Unter Erklärung und Regel steht ein Foto aus der App an
      einer Abbildung deines Buches: Gold mit Nummer ist, was du antippst, in dieser
      Reihenfolge (Bündel in der Leiste, dann der Reiter; bei „Zählen“ der Knopf am Brett und
      das Feld), gold ohne Nummer sind Brett und Karte mit dem Ergebnis. Lange Karten blenden
      unten weich aus. Der Knopf „An Abb. 6.20 ausprobieren“ öffnet dieselbe Abbildung. Die
      Fotos macht der Browser-Test automatisch (34 Werkzeuge, zusammen 1,7 MB, auch offline);
      ändert sich die Oberfläche, werden sie mit einem Befehl neu gemacht. Auf Englisch zeigen
      die Fotos vorerst die deutsche Oberfläche. Sind die Fotos verständlich?

### Neu in 0.3.8: eigene Bots stellen sich vor (Opus, 30.10.2026)

- [ ] N1034. **Bot stellt sich vor:** Klingen die Sätze unter „So stellt er sich vor:“ gut?

### Neu in 0.3.6: ein Knopf „Merken“ für Lernsammlung und Fehlerdatenbank (Opus, 30.10.2026)

- [ ] N1030. **Fehlerarten:** Passt die Zuordnung der Fehlerarten zu den Kapiteln im Blatt
      „Merken“ (hängende Figur → Kapitel 1, Taktik → 7, Schlagreflex → 4, Bauernzüge → 5)?
- [ ] N1031. **Aufleuchten:** „Merken“ leuchtet nur bei ?? und verpasstem Gewinn. Soll es auch
      bei einem Fehler (?) leuchten?

### Neu in 0.3.3: Kurzpläne und „Keine Fehlerneigung“ (Sonnet, 26.10.2026)

Nach deinen Beschlüssen im Chat umgesetzt; Widerspruch genügt.

- [ ] N1023. **Taktik auf Zeit:** „Zeitrunde starten“: drei Minuten leichte Taktikaufgaben, Ende
      nach drei Fehlern oder wenn die Zeit um ist; am Ende „X richtig, Y falsch“ und deine beste
      Runde. Prüfe, ob sich die Aufgaben auf dem Handy flott bedienen lassen und ob das Ende
      auch mitten in einer Aufgabe sauber kommt.

### Neu in 0.3.2: kleine Korrekturen aus der Ideensammlung (Sonnet, 26.10.2026)

Alles nach deinem Wunsch umgesetzt; Widerspruch genügt, dann baue ich es zurück.

- [ ] N1013. **Zügeraten, Pfeile:** Trainer „Zug erraten“: Hast du den Partiezug selbst
      gefunden (auch mit Hinweis), erscheint kein Pfeil. Bei einem falschen Zug bleiben der
      goldene (Partiezug) und der rote Pfeil (dein Zug).

### Neu in 0.2.144: Feiern, Gruppenkreis, Maia-Hinweis, einfachere Texte (Opus, Nacht 25./26.10.2026)

- [ ] N990. **Gruppenbild als Kreis:** Spielen › Vorgefertigte Bots, eine Stufe aufklappen. Unter
      den Porträts steht der Knopf „Gruppenmodus“; rechts daneben sitzen die acht Gesichter der
      Gruppe klein auf einem Kreis, zusammen so groß wie ein Porträt. Dasselbe in der
      Sprechblase, wenn du den Gruppenmodus wählst, und im Glückwunschfenster. Gut erkennbar?
- [ ] N993. **Nach der Partie:** Gewinnst du eine Partie, leuchtet das Brett golden auf, über dem
      Schild „Gewonnen!“ sprühen ein paar Funken, dazu ein kurzer Dreiklang (bei Ton an). Bei
      Remis kommt nur das Schild, bei einer Niederlage wird das Brett kurz grau und das Schild
      sinkt etwas ab, ohne Ton. Passt das Maß?

### Neu in 0.2.131 und 0.2.132: Nutzungsprüfung (DS46 bis DS57, V1 bis V9, T1 bis T4) und deine Ergänzungen (Opus, 25.10.2026)

Deine Freigabe vom 25.10.2026 („Ja“ zu allem außer T5) und deine drei Ergänzungen dazu. Die
Vorschaubilder stehen im Artifact „Nutzungsprüfung“.

- [ ] N924. **Querformat in der installierten App (Android):** Die installierte App dreht sich mit
      dem Handy; quer erscheint das Querformat mit dem Brett links. (Wirkt erst nach dem
      nächsten Update der Installation; notfalls die App neu installieren.)
- [ ] N935. **„Spielen“ schneller:** Unten auf „Spielen“ tippen: Wechsel und Partiebeginn spürbar
      flott?

## Teil 2: Entscheiden

Bei den Wünschen der Arbeitsliste nimmt Claude zunächst die eigene Empfehlung und stellt sie dir
hier zur Prüfung („Schon umgesetzt, Widerspruch genügt“). Buchbefunde bleiben Rückfragen, weil
nur du das Buch änderst.

### Q16 Aussehen im Profil (7.11.2026, schon umgesetzt, Widerspruch genügt)

- [ ] Q16-1. Die Karte heißt jetzt „Dein Aussehen“ statt „Deine Extras“, der Zähler „4 von 8 Extras“ bleibt.
- [ ] Q16-2. Weitere Ideen für die Karte (nicht gebaut, sag Bescheid, was du willst): Farbe der Pfeile und
      Feldmarkierungen (freischaltbar wie Konfetti), Farbe der Hervorhebung des letzten Zugs, Porträt-Hintergrund,
      später „Zubehör“ aus der Meisterschaft als eigener Reiter, ein freischaltbares „Klangset“ (Holz, Klick). Nachtmodus,
      Schriftgröße und Sprache bleiben in den Einstellungen, weil sie die ganze App betreffen.

### Q15 Deine Ideen vom 6.11.2026: Phasenkarten, Training planen, Empfehlungen

- [ ] Q15-1. **Karten für Mittelspiel und Endspiel (wie die Eröffnungskarte).** Was sich zuverlässig
      algorithmisch einordnen lässt:
      Endspiele nach Material, das ist eindeutig: Bauernendspiel, Turmendspiel, Leichtfigurenendspiel
      (Läufer gegen Läufer gleich- oder ungleichfarbig, Springer gegen Springer, Läufer gegen Springer),
      Damenendspiel, Turm gegen Leichtfigur, Qualität mehr. Dazu Merkmale mit sicherer Erkennung:
      Freibauer, entfernter Freibauer, Mehrbauer, Opposition im Bauernendspiel, bis 7 Steine das
      genaue Ergebnis aus der Tablebase (nur online).
      Mittelspiele nach der Bauernstruktur, auch das ist eine reine Rechnung: Isolani, hängende Bauern,
      Karlsbader Struktur (Minoritätsangriff), Maroczy-Aufbau, Igel, Stonewall, französische und
      königsindische Bauernkette, offenes oder geschlossenes Zentrum, dazu entgegengesetzte Rochaden
      (Bauernsturm), Läuferpaar und ungleichfarbige Läufer. Nicht zuverlässig sind Einordnungen nach
      Plänen („Angriff am Damenflügel“), die lasse ich weg.
      Empfehlung: In der Auswertung je eine Karte dort, wo die Phase beginnt (die App bestimmt die Phasen
      schon), mit Name, kurzem Satz („Typischer Plan: …“, aus dem Buch, wo das Buch das Thema hat) und
      Link ins Kapitel. Ich baue das nach dem Umbau der Auswertung (Punkt „besserer Zug“), weil beide
      dieselben Dateien berühren. Widerspruch genügt.
- [ ] Q15-2. **Plan statt Kalender.** Schon umgesetzt in 0.3.51 (N2597, deine Antwort vom 6.11.2026:
      Format frei in der Beta). Vorher speicherte der Plan Wochentage und Uhrzeit für den
      Kalendertermin. Dein Vorschlag: Wochentage und Dauer planen, das Training zählt automatisch mit,
      und beim Öffnen der App an einem Plantag erinnert die Karte „Heute“ an das anstehende Training
      („Heute 20 Minuten geplant, 5 erledigt“). Empfehlung: genau so, Uhrzeit und Kalenderdatei
      entfallen; gezählt wird die Zeit in Trainern, Übungen, Wiederholungen und Partien, die die App
      neu misst (aktive Minuten).
- [ ] Q15-3. **Ziele und Aufträge passend zur Spielstärke.** Schon umgesetzt in 0.3.51 (N2592): Ziele
      schlagen nur Bots und Bot-Orden vor, die höchstens 300 Punkte über deiner Zahl liegen (Wertung,
      sonst stärkster besiegter Bot, sonst 700). Die Wochenaufträge verlangten schon vorher nur die
      Stufe über deinem stärksten besiegten Bot. Selbst angeheftete Ziele bleiben, wie sie sind.
      Widerspruch genügt. Plan, Ziele und Aufträge auf einer Karte zusammenzuführen hängt an Q15-2.
- [ ] Q15-4. **Kurzpläne in den Empfehlungen:** Schon umgesetzt in 0.3.51 (N2590), Widerspruch
      genügt.
- [ ] Q15-5. **Vorschläge nach der Startwahl (Buch, Spielen, Umsehen)** und in den Einstellungen änderbar:
      Wer „Spielen“ gewählt hat, bekommt Partie und Taktik zuerst, wer „Buch“ gewählt hat, Weiterlesen
      und Übungen. Die Wahl liegt nur auf dem Gerät (wie andere Merker), kein neues Speicherfeld.
      Dazu dezent Schwächen aus den eigenen Partien je Phase („In deinen letzten 10 Partien gingen die
      meisten Punkte im Endspiel verloren → Kapitel 9 und Endspieltrainer“), erst ab 5 ausgewerteten
      Partien und nur als Vorschlag, ohne Versprechen. Der erste Teil (Startweg, Einstellung, Reihenfolge)
      ist schon umgesetzt in 0.3.51 (N2591), die Schwächen je Phase ebenfalls (N2598). Widerspruch
      genügt.

### Q14 Variationsbrowser und Zurück-Taste (1.11.2026, schon umgesetzt, Widerspruch genügt)

- [ ] Q14-1. **Pfeile in den Abzweig-Karten:** Bild c zeigte Gold für die Hauptfortsetzung und Blau
      für die anderen. Nach deinem Wunsch zu Frage b („nur blau mit Nummer, gepunktet, Stern“)
      zeigen die Karten dieselben blauen Pfeile mit ★/2/3 wie das große Brett und die Chips.
      Empfehlung: so lassen (ein Zeichensystem für Fortsetzungen, kein Gold, das mit eigenen
      goldenen Pfeilen verwechselt wird).
- [ ] Q14-2. **Bedienung des Stifts:** „Feld zweimal antippen = Rahmen, Feld dann Ziel = Pfeil“
      (kein Wischen). Wischen würde die Figur mitziehen und das Scrollen über dem Brett sperren.
      Empfehlung: so lassen; Wischen später als Zusatz, falls gewünscht.
- [ ] Q14-3. **Fortsetzungspfeile im Stift-Modus ausgeblendet**, Ziehen aus (getrennte Modi, Entwurf
      Abschnitt 8). Empfehlung: so lassen.
- [ ] Q14-4. **Karte:** Ein Knoten je Halbzug (auch ohne Abzweig), jeder Ast in eigener Zeile unter
      allem Bisherigen (kreuzungsfrei, dafür bei vielen Ästen hoch). Empfehlung: so lassen; eine
      Verdichtung (Ketten zu einem Knoten) wäre später möglich.
- [ ] Q14-5. **PGN-Texte:** Nummerntexte und Legende stehen als lesbare Zeilen im Kommentar (Lichess
      zeigt sie), statt in einem unsichtbaren Befehl. Eine eigene Kommentarzeile, die zufällig „Rot
      1: …“ heißt, würde beim Einlesen zum Nummerntext, wenn es Rot 1 gibt. Empfehlung: so lassen.
- [ ] Q14-6. **Grüner Pfeil = bester Zug in der gezeigten Stellung** (was die Engine jetzt spielen
      würde), nicht „was statt des letzten Zuges besser gewesen wäre“. Bild A zeigt den Pfeil so.
      Empfehlung: so lassen; „Besser war …“ bleibt Sache der Engine-Folgen.
- [ ] Q14-7. **Abbrechen schaltet die Analyse aus** (kein automatisches Nachrechnen neuer Züge mehr,
      bis „Analyse“ wieder an ist). Empfehlung: so lassen – wer abbricht, will die Engine nicht im
      Hintergrund.
- [ ] Q14-8. **Die Analyse läuft weiter, wenn man die Variante verlässt** (Bild A: „im
      Hintergrund“). Empfehlung: so lassen.
- [ ] Q14-9. **Eigener PGN-Befehl `%svgb`** für besten Zug und Abstand (Lichess überliest ihn). Ohne
      ihn müsste jede eingelesene App-PGN neu analysiert werden. Empfehlung: so lassen.
- [ ] Q14-10. **Chips standardmäßig alle an.** Bild B zeigte den Engine-Pfeil aus; Bild A alle drei.
      Empfehlung: an lassen (sonst sucht man nach der Analyse den Pfeil).
- [ ] Q14-11. **Kein Code-Splitting** (siehe oben): bringt fürs Budget nichts, der Start wird kaum
      schneller.
- [ ] Q14-12. **Verknüpfen hängt die Variante um:** Ohne Formatänderung kann eine Variante nur eine
      Quelle haben. Verknüpfen mit einem Lernsammlungs-/Fehlereintrag setzt deshalb ihre Quelle auf
      den Eintrag; der Hinweis „n eigene Varianten“ an der früheren Quelle (z. B. Abb. 2.40) zählt
      sie danach nicht mehr, Lösen macht sie zur „Stellung“ (nicht zurück zur Abbildung).
      Empfehlung: so lassen (eine Variante, ein Ort, Änderungen gelten überall). Alternative ohne
      Formatänderung: beim Verknüpfen eine Kopie anlegen (dann zwei getrennte Varianten). Eine echte
      Mehrfachverknüpfung bräuchte ein neues Feld (Format 9) – bewusst nicht gebaut.
- [ ] Q14-13. **Praxiszüge als Herkunft „partie“:** Lichess-Züge tragen die vorhandene Herkunft
      „partie“ (Züge echter Partien) plus Kommentar „Praxis (Lichess)“ am ersten Praxiszug hinter
      dem Buch; eine eigene Herkunft „praxis“ wäre eine Formatänderung (ältere Format-8-Leser
      machten daraus eigene goldene Züge). Empfehlung: so lassen.
- [ ] Q14-14. **Trainer-Lösungen:** Nur Taktik und Repertoire melden ihre Lösung; die anderen
      Trainer öffnen nur die Stellung. Empfehlung: so lassen, bei Bedarf weitere Trainer nachziehen
      (je eine Zeile `useSammelstellung`).
- [ ] Q14-15. **Kerne bei kurzen Steckbriefen:** Königsindisch hat den Kern 1. d4 Sf6 2. c4 g6
      (Lichess), Sizilianisch 1. e4 c5; dadurch kommen zu Sizilianisch auch Smith-Morra und andere
      Systeme. Empfehlung: so lassen (gewollt: „alle Abzweigungen“).
- [ ] Q14-16. **Tour und Zurück-Taste:** Zurück beendet jetzt nur die Tour; die App geht nicht mehr
      zusätzlich zurück. Empfehlung: so lassen, weil es dieselbe Regel ist wie bei allen Fenstern.
      Schon umgesetzt in acbc60f, Widerspruch genügt.
- [ ] Q14-17. **„Neue Partie“:** Zurück führt danach nicht mehr zur Auswertung. Empfehlung: so
      lassen, weil die Leiste stimmt und die Auswertung im Profil bleibt. Schon umgesetzt,
      Widerspruch genügt.

### Q13 Kleinigkeiten vom 1.11.2026 (schon umgesetzt, Widerspruch genügt)

- [ ] Q13-1. **Genauigkeit:** Der beste Zug zählt in der angezeigten Genauigkeit mit 100 (sonst
      drückt ein Messsprung die Zahl, obwohl der Zug „Bester Zug“ heißt). Die Schätzung deiner
      Spielstärke rechnet weiter mit den gemessenen Werten.
- [ ] Q13-2. **Phasen in der Zeitleiste:** eigene schmale Karte je Phase und der Phasenname oben auf
      jeder Moment-Karte.
- [ ] Q13-3. **Gambitnamen** kurz ohne Artikel („Königsgambit“), auch im Abweichungsmodus.
- [ ] Q13-4. **Praxis-Runde:** bis zu sechs der gewählten Varianten, gemischt.
- [ ] Q13-5. **Training:** Die Kacheln Lernsammlung, Fehlerdatenbank und Alle Kapitel stehen oben
      direkt unter dem Stapel statt ganz unten.
- [ ] Q13-6. **Löschen** in Lernsammlung und Fehlerdatenbank ohne Rückfrage, dafür zehn Sekunden
      „Rückgängig“.

### Q12 Aus den Nachtaufträgen (1.11.2026)

- [ ] Q12-4. **Brett bis 8 px an den Rand:** Die Vorprüfung meinte, das Brett im Zähltrainer und bei
      „Falle oder Köder“ wirke bei schmalen Handys angeschnitten. Im Browser fehlt nichts; Brett
      und Marke „am Zug“ liegen wie überall 8 px vom Rand. Empfehlung: so lassen. Ist auf deinem
      Handy wirklich etwas abgeschnitten (gerundete Ecken), schick ein Foto, dann rücke ich alle
      Bretter auf 16 px ein.
- [ ] Q12-5. **Karte „Heute“, Partie als letzte Kachel:** Ist alles erledigt, schlägt die Karte
      eine Partie gegen die Engine vor, statt leer zu bleiben (nicht für Neulinge vor Kapitel 0).
      Schon umgesetzt, Widerspruch genügt.

### Q11 Startwahl und Nebenaufgaben (31.10.2026)

- [ ] Q11-1. **QR-Code im Buch:** Die App versteht jetzt die Adresse
      `schach-von-grund-auf.com/app/?start=buch`: Wer sie öffnet, landet ohne Frage im Buch-Weg der
      ersten Tour. Empfehlung: Den QR-Code im Buch auf diese Adresse setzen (wer nur den Link der
      Website weitergegeben bekommt, sieht dann die Startwahl). Das musst du im Buch ändern.
- [ ] Q11-2. **Stern auf leeren Feldern:** Ein Feld neben einer Station ohne verdientes Stück zeigt
      einen goldenen Stern statt einer grauen Silhouette (die wirkte wie ein leerer Platzhalter).
      Schon umgesetzt, Widerspruch genügt.

### Q10 Kleinigkeiten aus der Gestaltungsrunde (31.10.2026)

Empfehlungen, so belassen oder kleine Änderungen; Widerspruch genügt:

- [ ] Q10-1. **Auswertung, Seitenwahl:** Die Wahl „Weiß (du) / Schwarz“ steht zweimal (über der
      Zeitleiste und unter „In Zahlen“), beide immer gleich gestellt. Empfehlung: so lassen, weil
      man beim Lesen der Zahlen sonst nach oben scrollen müsste.
- [ ] Q10-2. **Spielen, „Deine Spielstärke“:** Die Karte zeigt wie bisher Zahl, Spanne und den
      Maßstab Lichess / chess.com / FIDE als ganze Zeile; im Entwurf war der Maßstab klein oben
      rechts. Empfehlung: so lassen, bis du sie auf dem Handy gesehen hast; ist sie dir zu wuchtig,
      wird sie kompakter.
- [ ] Q10-3. **Spielen, „Zuletzt gespielt“:** Zwei Partien hintereinander gegen denselben Bot
      stehen als zwei Zeilen da. Empfehlung: so lassen (jede Zeile zeigt ihr eigenes Ergebnis).
- [ ] Q10-4. **Steckbriefe:** „Zweispringerspiel und Läuferspiel“ hängt im Baum nur bei 3… Sf6
      unter Italienisch, nicht zusätzlich bei 2. Lc4. Empfehlung: so lassen (keine doppelten
      Einträge). **Glossar:** kleines Diagramm bei allen 197 Begriffen mit Abbildung; Empfehlung:
      so lassen (immer nur ein Buchstabe sichtbar, etwa 20 Bretter).
- [ ] Q10-5. **Trainer mit nur einer Übung** (Zielbilanz, Faktorenbilanz, Denkroutine, Studien)
      zeigen jetzt auch die Startkarte: ein Tipp mehr, dafür überall dieselbe Form. Empfehlung: so
      lassen; wenn dich der zusätzliche Tipp stört, starten sie wieder sofort.

### Q9 Cloudflare baut nicht mehr (31.10.2026, dringend)

- [ ] Q9-1. **Vorschau-Builds bei Cloudflare ausschalten.** Von etwa 13:20 bis 16:45 Uhr brach
      der Cloudflare-Build bei jedem Push in derselben Sekunde ab, ohne zu bauen; die Seite blieb
      bei 0.3.31. Dein Neustart um 16:45 hat 0.3.32 sauber gebaut und ausgeliefert, am Code lag es
      also nicht. Der Vorschau-Build eines Arbeitszweigs, der zur selben Zeit kam, brach wieder
      sofort ab. Das spricht für eine Grenze bei Cloudflare (ein Build zur selben Zeit oder die
      Build-Minuten des Monats), die die vielen Arbeitszweige heute ausschöpfen. Empfehlung: im
      Cloudflare-Dashboard unter Workers › schach-von-grund-auf › Settings › Build die Builds für
      andere Zweige als `main` ausschalten (du testest ohnehin auf main). Bis dahin prüfe ich nach
      jedem Push nach main, ob die Seite die neue Version zeigt, und sage dir Bescheid, falls du
      den Build neu starten musst.

### Q8 Gamifizierung: Entscheidungen E2 bis E11 (31.10.2026)

Die Vorrecherche schlägt zu jeder offenen Frage eine Lösung vor. E1 (Speicherformat) hast du
entschieden: neue Felder mit neuer Formatversion. Die übrigen setze ich nach der Empfehlung um,
Widerspruch genügt:

- [ ] Q8-1. **Startseite (E2):** Die neuen Karten (nächster Schritt, Wochenziel, Rivale,
      Monatsrückblick, eigene Ziele) stehen oben auf der Buch-Startseite, höchstens zwei
      zugleich, statt auf einer eigenen sechsten Seite „Heute“. Schon vorbereitet in 0.3.18.
- [ ] Q8-2. **Lernpfad (E3):** eigener Bildschirm „Dein Weg durchs Buch“ mit einem Knopf über
      der Kapitelliste; die Kapitelliste bleibt.
- [ ] Q8-3. **Meisterschaft (E4):** Bronze, Silber, Gold je Thema bleiben, einmal erreicht, für
      immer; nach 60 Tagen ohne richtige Antwort steht leise „Zum Auffrischen“ daneben.
- [ ] Q8-4. **Wochenziel (E5):** Du wählst selbst 2 bis 7 Tage je Woche (vorgeschlagen 3); die
      Tagesserie bleibt im Trainer „Kurzpläne“. Verpasste Wochen werden nicht erwähnt.
- [ ] Q8-5. **Rivalen (E6):** Duell gewonnen beim ersten gewerteten Sieg; die Sprüche gibt es je
      Charakter der Bots, nicht je Bot (84 Bots wären zu viele Texte).
- [ ] Q8-6. **Teilen (E7):** nur Bilder deiner Orden, Abzeichen, Rekorde und Aufgaben aus freien
      Quellen, keine Abbildungen des Buches.
- [ ] Q8-7. **Extras (E8):** freischaltbar sind nur neue Dinge (Porträtrahmen, Brett „Nacht und
      Gold“, Figurensatz „Gold“, Zubehör, Titel, Konfettifarben); nichts, was heute frei ist,
      wird gesperrt.
- [ ] Q8-8. **Fundstücke (E9):** etwa 80 eigene kurze Texte (Schachgeschichte, Kuriositäten,
      Merksätze mit Fundstelle im Buch), Entwurf durch Claude; du liest sie später.
- [ ] Q8-9. **Feiereffekte (E10):** Schalter in den Einstellungen, Vorgabe an. Schon umgesetzt in
      0.3.18.
- [ ] Q8-10. **Eigene Ziele (E11):** höchstens drei angeheftet, ohne Ablaufdatum; Vorschläge nur
      aus echten Lücken (fehlende Bots, Übungen, Themen), sortiert nach Nähe zum Orden.

### Q7 Buchbefund Kapitel 8: Wann beginnt das Endspiel? (30.10.2026)

- [ ] Q7-1. **Endspiel ohne Materialgrenze:** Das Buch erkennt das Endspiel an vier Fragen
      (Damen vom Brett, Könige vor Mattangriff sicher, König kann ins Zentrum, Bauern entscheiden);
      überwiegt das Ja, ist es Endspiel. Danach wäre eine Stellung mit je zwei Türmen und zwei
      Leichtfiguren ohne Damen schon Endspiel. Schachexperten nennen das ein „damenloses
      Mittelspiel“: Speelman zählt erst ab höchstens 13 Punkten Figuren je Seite (ohne Bauern,
      etwa Turm, Turm und Läufer) zum Endspiel, Lichess ab höchstens sechs Figuren am Brett. In
      deinen eigenen Partien rechnet die App schon so (Entscheidung 12). An den Abbildungen gilt
      weiter das Buch. **Empfehlung:** In Kapitel 8 nach den vier Fragen einen Satz ergänzen, etwa:
      „Ohne Damen, aber mit vielen Figuren ist es noch ein damenloses Mittelspiel; zum Endspiel
      wird es, wenn je Seite höchstens etwa Turm, Turm und Leichtfigur übrig sind.“ Sag „Q7-1 ja“
      (dann gilt die Grenze auch an den Abbildungen) oder „Q7-1 nein“ (alles bleibt, wie es ist).

### Q6 Webverweise der App (30.10.2026)

Dein Wunsch vom 26.10.: prüfen, auf welche Webinhalte die App und die Trainingsseiten verweisen,
und ob sich davon etwas direkt in die App holen lässt. Ergebnis:

- **925 verschiedene Webadressen** stehen in den Daten und Texten der App. 876 davon sind Links
  auf die Lichess-Partien, aus denen die Aufgaben im Taktiktrainer, in „Falle oder Köder“ und im
  Endspieltrainer stammen. Die App speichert sie nur als Herkunft und zeigt sie nicht an. Eine
  Stichprobe von 25 war vollständig erreichbar.
- **Trainingsseiten** (13 Kapitel und der Werkzeugkasten): 32 Links auf 28 Ziele, davon 20 auf
  lichess.org. Dazu kommen syzygy-tables.info, schachbund.de, chessgames.com, 365chess.com,
  stockfishchess.org, encroissant.org, Lucas Chess, listudy.org, schach-tipps.de und
  schachtraining.de.
- **Texte der App:** Hier steht keine Adresse mit „https://“, nur Quellenangaben auf der
  Lizenzseite (13 GitHub-Projekte, dazu Lichess, chess.com, chessgoals.com, DiceBear, Draftbit,
  itch.io und ambientCG).
- **Buchdaten** (Abbildungen, Glossar, Kapiteltexte): keine einzige Webadresse.
- **Tot ist kein Verweis.** Alle 12 GitHub-Projekte gibt es noch. Harmlos umgeleitet werden
  365chess.com, chessgames.com und schachbund.de (jeweils auf „www.“), listudy.org (auf die
  englische Seite) und die Lichess-Aufgabenübersicht (ohne Anmeldung auf die Aufgabenseite).
  Auf eine fremde Domain wird nichts umgeleitet.
- **Doppelt:** syzygy-tables.info steht auf vier Seiten (Kapitel 8, 9, 10 und im
  Werkzeugkasten). Das ist gewollt, weil jedes Kapitel für sich steht.

Was frei ist und was sich einbauen lässt:

- Lichess-**Puzzles** und -**Partiedatenbank**: CC0 (database.lichess.org: „Database exports are
  released under the Creative Commons CC0 license.“). Ist schon eingebaut: Taktiktrainer,
  „Falle oder Köder“, Endspieltrainer, Eröffnungen nach Spielstärke.
- Lichess-**Eröffnungsnamen**: CC0, auch schon eingebaut.
- Lichess-**Übertragungen**: CC BY-SA 4.0 (database.lichess.org, Abschnitt Broadcasts:
  „Broadcast games are released under the Creative Commons Attribution-ShareAlike 4.0
  license.“). Von dir am 30.10. angenommen (Entscheidung 7), kommt mit „Zug erraten“.
- **Lernen, Koordinatentraining, Analysebrett, Stellung aufbauen, Puzzle Storm, Streak und
  Racer** sind Programmteile von Lichess unter AGPL-3.0 (github.com/lichess-org/lila: „Lila is
  licensed under the GNU Affero General Public License 3 or any later version“). Abschreiben
  wäre rechtlich möglich, lohnt sich aber nicht: Die App hat für das Wichtigste eigene Trainer.
- **Lichess Practice und Studien:** Dafür gibt es keine ausdrückliche Lizenz, die Studien gehören
  ihren Autoren. Also nur verlinken.
- **Tablebase** (syzygy-tables.info): Die Tafeln bis fünf Steine sind zusammen knapp 1 GB groß,
  offline passt das nicht in die App.
- **Andere Seiten** (Partiedatenbanken, Programme, Schachbund, Trainingsseiten): nur verlinken.

- [ ] Q6-1. **„In der App“ neben Lichess.** Wo eine Übung ein Lichess-Werkzeug nennt, für das
      die App einen eigenen Trainer hat, steht hinter dem Lichess-Link jetzt „In der App: …“ mit
      einem direkten Sprung in diesen Trainer. Das betrifft drei Fälle: Koordinatentraining →
      Koordinatentrainer, Aufgabenthemen → Taktiktrainer, Lichess Practice (Mattvarianten,
      Turmendspiele) → Endspieltrainer. Der Text der Übungen bleibt, wie er im Buch steht.
      Schon umgesetzt, Widerspruch genügt.
- [ ] Q6-2. **Linkprüfung schärfer.** Die wöchentliche Prüfung im Dashboard prüft jetzt auch die
      Quellen auf der Lizenzseite und meldet gelb, wenn eine Adresse auf eine fremde Domain
      umleitet (etwa eine abgelaufene Domain mit Parkseite, die sonst als „erreichbar“ durchgeht).
      Die 876 Partielinks prüft sie absichtlich nicht jede Woche, das wären zu viele Abrufe bei
      Lichess. Schon umgesetzt, Widerspruch genügt.
- [ ] Q6-3. **Keine Änderung an den Adressen.** Die Umleitungen auf „www.“ und die englische
      Seite von listudy.org schaden nicht, deshalb lasse ich die Adressen, wie sie im Buch stehen.
      Schon so entschieden, Widerspruch genügt.
- [ ] Q6-4. **Buchbefund, klein:** Der Trainingskasten in Kapitel 0 schreibt
      „www.schachbund.de“, der Werkzeugkasten in Kapitel 12 „schachbund.de“. Beide Adressen
      funktionieren. Willst du die Schreibweise im Buch vereinheitlichen? Kein toter Link im Buch.
- [ ] Q6-5. **Später, nur Empfehlung: Tablebase online im Endspieltrainer.** Ein Knopf
      „Tablebase“, der eine Endspielstellung mit bis zu sieben Steinen bei der freien
      Lichess-Tablebase nachschlägt (nur mit Netz). Das ändert die Datenschutzerklärung, weil die
      Stellung an Lichess geht. Deshalb baue ich es erst nach deinem Ja. Möchtest du das?

### Q5 Weitere Ideen aus der Recherche (30.10.2026, noch nicht beschlossen)

Beschlossen und in Arbeit sind schon: Lichess-Aufgaben als Zusatzaufgaben, berühmte Partien und
Turnierpartien für „Zug erraten“, Erfahrungspunkte und Abzeichen, die Tagesserie, die nicht mehr
verfällt. Übrig aus der Recherche bei Lichess, chess.com und Chessly:

- [ ] Q5-1. **Zwei weitere Trainingsformen (Empfehlung, noch nicht gebaut):** (a) „Nochmal
      versuchen“ an den Schlüsselzügen der Partieauswertung, mit einem Hinweis aus der
      Denkroutine statt einer KI (wie bei chess.com). (c) Eine Abbildung mit Ziel gegen die
      Engine ausspielen („halte Remis“, „setze matt“). Die beiden anderen Ideen von damals sind
      inzwischen gebaut: die Serie ohne Uhr (Serienmodus im Taktiktrainer, 0.3.25) und der
      Monatsrückblick (0.3.27) mit Stärken und Schwächen je Thema (Meisterschaft, 0.3.29). Sag,
      welche du willst („Q5-1 a, c“), dann baue ich sie.

### Q3 Eröffnungspaket, Stufe 1: die Datenfrage (30.10.2026)

Ergebnis: Wir brauchen keine neue Quelle. Die App hat seit dem Praxisbuch (0.2.128) einen ganzen
Monat der Lichess-Datenbank ausgezählt (September 2026, rund 37 Millionen gewertete Partien in
Blitz, Schnellschach und Klassisch). Lizenz CC0, also frei ohne Bedingungen; die Namen der
Eröffnungen kommen aus der freien Lichess-Liste (ebenfalls CC0). Gezählt sind die ersten 20
Halbzüge je Zeitklasse und je 200er-Band von 400 bis 2800. Daraus ist jetzt eine Liste mit 46
Eröffnungen entstanden: je Band die häufigsten zwölf für Weiß und für Schwarz, jede mit Anteil
je Band, den 20 häufigsten Varianten und den Marken „Gambit“ und „im Buch (Abschnitt …)“, dazu
die 40 häufigsten Gambits. Ein paar Zahlen (Anteil an allen Partien des Bandes):

- Weiß um 600: Läuferspiel 3,1 %, Wayward Queen (frühes Dh5) 2,3 %, Italienisch 1,7 %. Um 1200:
  Italienisch 2,9 %, Läuferspiel 2,0 %, London 2,0 %. Um 1800: Damengambit 2,3 %, Englisch
  2,0 %, London 1,7 %. Um 2400: Englisch 2,9 %, Damengambit 2,7 %, Spanisch 1,4 %.
- Schwarz um 600: Skandinavisch 3,4 %, Russisch (Petroff) 2,1 %, Französisch 1,7 %. Um 1200:
  Skandinavisch 3,4 %, Sizilianisch 3,2 %, Französisch 2,7 %. Ab 1800 führt Sizilianisch klar
  (6,8 %, um 2400 8,6 %), dann Französisch und Caro-Kann.
- Gambits um 800: Englund-Gambit, Busch-Gass-Gambit, Königsgambit; um 1800: Königsgambit,
  Englund-Gambit, Smith-Morra-Gambit.

- [ ] Q3-1. **Festlegungen (schon umgesetzt, Widerspruch genügt):** Eine „Eröffnung“ ist die
      Familie nach Lichess (Name vor dem Doppelpunkt, etwa „Sizilianische Verteidigung“). Bei
      Sammelnamen, die nur den ersten Zug beschreiben („Damenbauernspiel“, „Königsbauernspiel“),
      zählt der Teil danach, also „London-System“ oder „Wayward Queen“; bloße „Normal
      Variation“ zählt nicht. London mit 2. Lf4 („Accelerated London“) ist London (Buch 2.8).
      Verteidigungen (auch „abgelehnt“, „angenommen“, „Gegengambit“) wählt Schwarz, sonst die
      Seite des letzten Zuges. Das Damengambit gilt nicht als Gambit, wie im Buch. Gezählt wird
      im Band dessen, der zieht; beide Spieler einer Partie liegen meist im selben Band.
- [ ] Q3-2. **Rest des Eröffnungspakets:** Fertig sind Eröffnungen nach Spielstärke (0.3.10),
      Variantenbaum und Gambits (0.3.11) und feste Eröffnungen für eigene Bots mit Schnellwahl
      und Regler „Abweichung“ (0.3.14). Offen bleiben weitere Fallen für „Falle oder Köder“. Sie
      brauchen zuerst eine Definition, die du freigibst. Empfehlung: Eine Falle ist ein
      Köderzug, der nicht der beste ist und die Stellung deutlich verschlechtert, es sei denn,
      der Gegner antwortet mit dem naheliegenden falschen Zug (Schlagreflex, übersehene Gabel);
      „naheliegend“ heißt: Menschen seiner Stärke spielen ihn laut Lichess häufig.
      Einverstanden? Der Repertoire-Trainer fragt weiter nur die Varianten des Buches ab
      (Kapitel 2); Varianten von Lichess kämen dort nur auf deinen Wunsch dazu.

### Q2 Eigene Bots: freie Beschreibung? (30.10.2026)

- [ ] Q2-1. **Eigener Text statt Vorschlag:** Die Beschreibung eigener Bots entsteht jetzt bei
      jedem Zeigen aus den Einstellungen und wird nicht gespeichert. Ein Feld, in dem du den
      Vorschlag selbst umschreibst, bräuchte ein neues Feld im Speicher deiner Leser; deshalb
      warte ich damit auf dich. Empfehlung: erst einmal ohne freies Feld, weil der Text sich
      sonst nicht mehr mit den Reglern ändert. Möchtest du das Feld trotzdem?

### R57 Dashboard: Einrichtung und Empfehlungen (24.10.2026)

- [ ] DB2. **Turnstile vorerst nicht eintragen:** Empfehlung: Den Turnstile-Secret-Key noch nicht
      in Cloudflare eintragen. Gegen Massenmeldungen genügt vorerst die Drossel (höchstens fünf
      Meldungen je Verbindung und Stunde). Turnstile würde ein Skript von Cloudflare in die App
      laden; die Datenschutzerklärung sagt bisher ausdrücklich, dass keine Inhalte anderer Anbieter
      geladen werden. Kommt Spam, baue ich Turnstile ein (Formular, Datenschutzerklärung) und du
      trägst dann den Secret-Key als `TURNSTILE_SECRET` ein. Schon so umgesetzt, Widerspruch genügt.
- [ ] DB3. **Aufbewahrung:** Meldungen löscht der Worker spätestens zwölf Monate nach Eingang
      (täglich um 6:17 UTC), die Zähler der Drossel (nur ein Prüfwert aus IP-Adresse und Datum)
      nach einem Tag. So steht es auch im neuen Abschnitt „Meldungen aus der App“ der
      Datenschutzerklärung. Schon umgesetzt, Widerspruch genügt.
- [ ] DB4. **Mailversand (optional, jederzeit):** Für eine Mail bei jeder neuen Meldung und die
      Wochenübersicht montags: Konto bei resend.com, Domain hinzufügen, die angezeigten
      DNS-Einträge in Cloudflare › DNS eintragen, einen API-Schlüssel erzeugen und in Cloudflare
      (wie bei DB1) drei Secrets anlegen: `RESEND_KEY` (der Schlüssel), `MAIL_AN` (deine Adresse),
      `MAIL_VON` (etwa `Dashboard <dashboard@schach-von-grund-auf.com>`). Ohne Mailversand meldet
      GitHub rote Prüfungen trotzdem per Mail.
