# Was noch zu tun ist (für den Autor)

Stand: 18.10.2026, Version 0.2.89. **Diese Datei ist die einzige, die du brauchst:** Hier steht
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
Einstellungen prüfen, dass „App-Version 0.2.89“ dasteht; sonst die App neu laden.

Reihenfolge nach Wichtigkeit: Teil 1 testen (neueste Nummern zuerst), dann Teil 2: oben „Nur
bestätigen“ mit einem Satz („alle ok außer …“), darunter Buchbefunde und Entscheidungen. Alle Nummern gelten für die aktuelle Version; frühere Versionen musst du nicht
mehr getrennt testen. Die Prüfschritte N1 bis N157 sind erledigt.

---

## Teil 1: Testen auf dem Handy (etwa zwei Stunden insgesamt, mit Engine)

Abhaken, was klappt. Wer wenig Zeit hat, nimmt zuerst „Neu in 0.2.89“, dann der Reihe nach die
älteren Abschnitte.

### Neu in 0.2.88 (etwa 15 Minuten, mit Engine; Spaß-Bots und Zahlen über 2200, Opus)

- [ ] N347. **Fritzi und Bruno:** Eine Partie gegen Fritzi (Gruppe „Zum Spaß“, etwa 600): Macht
      sie oft sinnlose Züge und schlägt trotzdem ab und zu eine hängende Figur? Bruno liegt mit
      etwa 1100 etwas über deinem Wunsch (500 bis 1000); so lassen? (Gruppe, Zahlen und
      Sprechblase hat Claude geprüft.)

### Neu in 0.2.86 (etwa 25 Minuten, mit Engine; Auswertung, Werkzeuge, Training, Opus)

- [ ] N336. **Fehler im Rückblick:** Spiele eine Partie mit einem groben Fehler (etwa eine Figur
      nicht zurückschlagen) und tippe ihn in der Zugliste an. Die Karte sagt jetzt „Die
      Gewinnchance von Weiß fällt von 51 % auf 10 %“ statt „kostet etwa 6,2 Bauern“ (die Zahl der
      Engine ist ihre eigene Einheit; eine Figur ergibt dort 5 bis 7). Lässt du einen Rückschlag
      aus, steht dabei „schlägt nicht zurück: exf4 nahm den Springer f4 wieder …“ mit rotem Feld.
      Das Fragezeichen neben dem Satz erklärt den Balken links am Brett und die Gewinnchance.
- [ ] N337. **Nebenzweige:** In derselben Karte sind „Besser war …, danach etwa …“ und neu „So
      wird der Fehler bestraft: …“ antippbare Züge. Ein Tipp zeigt die Stellung nach diesem Zug am
      Brett, die Pfeile gehen Zug für Zug weiter, „Zurück zur Partie“ verlässt den Zweig. Die
      Strafe steht bei „?“ und „??“ und zeigt, wie der Gegner Material gewinnt.
- [ ] N338. **Auswertung:** Unter der Partie: in der Karte „Spielstärke“ oben der Schalter
      „Genauigkeit wie“ (Lichess, App, chess.com), vor jeder Zeile ein Symbol, vor
      jeder Zugklasse ihre farbige Marke; die Erklärungen stehen zusammen hinter einem
      Fragezeichen. Grobe Patzer beider Seiten mit kleinem Bauern in der Farbe der Seite, ein Tipp
      springt hin. Von den absichtlichen Fehlern der Engine stehen zuerst drei, „Alle N zeigen“
      klappt den Rest auf. Bei Partien aus der Grundstellung fehlt „Noch einmal aus derselben
      Stellung“.

### Neu in 0.2.85 (etwa 20 Minuten, mit Engine; Elo-Zahl der Bots, Opus)

- [ ] N334. **Stufe 3 gegen Stufe 4:** Je eine Partie gegen „Eigene Stufe“ 3 · 3 · 3 und 4 · 4 · 4.
      Macht Stufe 3 merklich mehr Fehler (etwa jeder fünfte Zug; gemessen 17 : 3 für Stufe 4)?
- [ ] N335. **Passt die Zahl zu dir?** Das ist der wichtigste Test, denn nur du kannst die Lage
      der Skala an einem echten Menschen prüfen. Spiele zwei oder drei gewertete Partien gegen
      einen Bot, dessen Zahl nahe an deiner Spielstärke bei chess.com oder Lichess liegt. Gehen
      sie etwa ausgeglichen aus, stimmt die Lage. Gewinnst du fast immer, sind die Zahlen zu hoch
      (oder umgekehrt); schreib dann, gegen wen und wie die Partien ausgingen (siehe auch S24).

### Neu in 0.2.84 (etwa 5 Minuten; neue Bretter, Opus)

- [ ] N328. **Bretter gut lesbar?** Einstellungen › Karte „Einstellungen“ › Reiter „Brett“: je ein
      Brett aus „Farben“ und aus „Holz und Material“ wählen und eine Abbildung öffnen. Sind Felder,
      Schimmer des letzten Zuges und Figuren gut lesbar? Gemessen am schwächsten: der Schimmer auf
      den dunklen Feldern von „Wie im Buch“ und „Marmor grün“ (blau auf einem dunklen Brett).
      (Gruppen, Kacheln und Lizenzen hat Claude geprüft.)

### Neu in 0.2.83 (etwa 20 Minuten, mit Engine; Genauigkeit und Spielstärke neu geeicht, Opus)

- [ ] N324. **Genauigkeit wie:** Öffne eine ausgewertete Partie. In der Karte „Spielstärke“
      steht oben „Genauigkeit wie“ mit Fragezeichen und darunter eine Leiste Lichess | App |
      chess.com (seit 0.2.87 nur noch hier, nicht mehr in den Einstellungen; „App“ hieß vorher
      „Mittelweg“, „chess.com“ vorher „nahe chess.com“). Das Fragezeichen erklärt die drei
      Rechnungen. Die erste Zeile heißt „Genauigkeit (App)“. Stelle auf „chess.com“: Bei
      Partien, die lange entschieden waren, steigt oder sinkt die Zahl; Spielstärke und
      Urteilswörter bleiben gleich (sie hängen nicht am Schalter).
- [ ] N325. **Spielstärke mit Spanne:** In derselben Karte steht bei „Geschätzte Spielstärke“
      etwa „etwa 1550 (1150–1950)“. Darunter „Mitte aus chess.com und Lichess“ mit Fragezeichen:
      Ein Tipp zeigt beide Werte, etwa „chess.com etwa 1500, Lichess etwa 1550“. Grundlage sind
      je 300 gewertete Schnellschach-Partien von chess.com und Lichess (alle Bänder von 400 bis
      2200), mit der Engine der App nachgerechnet; eine einzelne Partie liegt oft 400 Punkte
      daneben, deshalb die Spanne.
- [ ] N326. **Deine Spielstärke nach einer Partie:** Spielen, Karte „Deine Spielstärke“ über
      „Letzte Partien“ (den Ablauf hat Claude geprüft). Befund: Nach genau einer Partie zeigte sie
      etwa 900 (500 bis 1300), die Karte „Spielstärke“ derselben Partie aber 1150 (750 bis 1550),
      weil „Deine Spielstärke“ die beiden Skalen anders mittelt. Stört dich das, oder reicht es,
      dass sich beides mit mehr Partien angleicht?
- [ ] N327. **Dauer der Auswertung auf dem Handy:** Eine Partie zügig zu Ende spielen: Wird die
      Auswertung (Tiefe 18, Fortschritt unter dem Ergebnis) in vertretbarer Zeit fertig? Am Rechner
      waren beim Ende schon 15 von 23 Stellungen fertig, der Rest dauerte 23 Sekunden.

### Neu in 0.2.81 (etwa 15 Minuten, mit Engine; alle 64 Bots gemessen und eingestellt, Opus)

- [ ] N295. **Bots mit Stil passen zu ihrer Stufe:** Eine Partie gegen einen Bot der Stufe 2 mit
      Stil, etwa Onkel Rudi (aggressiv) oder Sophie (defensiv). Er sollte etwa so viele Fehler
      machen wie die Stufe 2 selbst (gemessen: alle Bots der Stufen 1 bis 4 holen gegen ihre Stufe
      ein Viertel bis drei Viertel der Punkte). Passt das?

### Neu in 0.2.75 (etwa 5 Minuten; diese Datei in der App, Opus)

- [ ] N307. **Aufgabenseite:** Zahnrad unten rechts drei Sekunden gedrückt halten (ein kurzer
      Tipp öffnet wie bisher die Einstellungen). Es öffnet sich „Aufgaben des Autors“ mit dieser
      Datei, der neueste Abschnitt ist aufgeklappt. Tippe in einem Punkt auf einen unterstrichenen
      Link (etwa „Einstellungen“, „Abb. 6.20“ oder einen Trainernamen): Der Bildschirm öffnet sich, über
      der Leiste steht „‹ Zurück zu den Aufgaben“ und bringt dich an dieselbe Stelle zurück. Hake einen Punkt ab, schreib bei
      einem anderen eine Notiz („Notiz“), dann „Stand in die Zwischenablage“ und füge den Text in
      den Chat ein. „Nur offene Punkte zeigen“ blendet Abgehaktes aus. Haken und Notizen bleiben
      auf dem Handy, auch nach einem Update; Punkte, die in einer neuen Version fehlen (weil
      erledigt), fallen aus dem Text heraus.

### Neu in 0.2.68 (etwa 5 Minuten; Werkzeugabweichungen aus der Textarbeit geprüft, Fable)

- [ ] N289. **Eigener Bot mit nur einer Fehlerart:** Einen eigenen Bot 2 · 2 · 2 mit nur dem Haken
      „patt gesetzt“ anlegen und spielen. Er sollte etwa so viele Fehler machen wie Stufe 2 (etwa
      jeder vierte Zug), meist kleine Ungenauigkeiten, weil die gewählte Art fast nie passt.
      Fühlt es sich so an?

### Neu in 0.2.67 (etwa 20 Minuten, mit Engine; 64 Gegner mit Porträts, dein Wunsch vom 18.10.2026 nachts, Fable)

- [ ] N285. **Porträts:** Spielen › „Vorgefertigte Bots“: Passen Porträts und Namen zusammen, und
      ist die Auswahl auf dem Handy bequem? (Die Bedienung hat Claude geprüft.)
- [ ] N286. **Persönlichkeit spürbar:** Je eine kurze Partie gegen Finn (Stufe 1, sehr aggressiv:
      schlägt alles, vergisst den König) und Oma Gerda (Stufe 1, sehr defensiv: zieht Figuren
      zweimal, lässt den König sitzen). Fühlen sie sich deutlich verschieden an?
- [ ] N287. **Stufe 8 mit Charakter:** Eine Partie gegen IM Vogt (sehr aggressiv, übersieht ruhige
      Züge) oder IM Haas (sehr defensiv, übersieht die Grundreihe): Wirken sie trotz Handschrift wie
      Stufe 8?

### Neu in 0.2.63 (etwa 5 Minuten; Impressum und Datenschutz mit deinen Angaben, Opus)

- [ ] N294. **Impressum und Datenschutz:** <https://schach-von-grund-auf.com/impressum/> und
      <https://schach-von-grund-auf.com/datenschutz/> lesen: Stimmen deine Angaben (Name,
      Anschrift in Hannover, kontakt@schach-von-grund-auf.com), Cloudflare und die Weiterleitung an
      goneo? Claude ist kein Anwalt; wer sichergehen will, vergleicht einmal mit einem Generator wie
      dem von e-recht24.

### Neu in 0.2.61 (etwa 25 Minuten, mit Engine; deine Rückmeldung zu 0.2.56, Opus)

- [ ] N311. **Unmögliche Stellungen (S12):** Stellung aufbauen mit drei weißen Damen und allen
      acht weißen Bauern: „Partie beginnen“ geht nicht, der Hinweis nennt zu viele Steine für die
      Umwandlungen. Mit zwei Damen auf der Grundreihe und höchstens sieben Bauern geht es, und die
      Engine zieht.
- [ ] N314. **Sonderzüge aus Kapitel 0 (U5):** Training › Koordinaten › „Zug ausführen“: Unter den
      Sonderzügen stehen jetzt die Stellungen 0.12 bis 0.19 („aus Abb. 0.12“ usw.), mit kurzer und
      langer Rochade für beide Seiten, en passant und Umwandlung. Etwa jeder vierte Sonderzug kommt
      noch aus den zwei eigenen Stellungen (en passant für Schwarz, Umwandlung mit Schlag).

### Neu in 0.2.59 (etwa 10 Minuten, mit Engine; Brillant, zweiter Schritt, Fable)

- [ ] N283. **Brillant nur bei wirklich nehmbarem Opfer:** Spiele die Opernpartie zu zweit nach
      (Züge bei N261). Karte „Spielstärke“, Weiß: weiter Brillant 3 (10. Sxb5, 13. Txd7, 16. Db8+). Neu: Eine Figur zählt nur als Opfer, wenn der Gegner sie legal nehmen kann (kein
      an den König gefesselter Angreifer, kein Schach, das vorgeht), und die gezogene Figur zählt
      auch, wenn sie vorher schon angegriffen war (etwa Dxc6+ mit einer angegriffenen Dame). Am
      Prüfstand mit 100 Brillant-Zügen von chess.com: 59 erkannt (vorher 46), 19 Fehlalarme in
      100 Partien (vorher 25). Spiele dazu eine Partie gegen Stufe 4 oder 5 und sieh dir im
      Rückblick jedes „!!“ an: Es sollte jedes Mal ein echtes Opfer sein, das der Gegner nehmen
      konnte. Melde Züge, die dir falsch vorkommen, mit PGN.

### Neu in 0.2.58 (etwa 15 Minuten, mit Engine; deine Anmerkungen vom 17.10.2026 abends, Fable)

- [ ] N278. **Töne:** Einstellungen › Ton „an“, eine Partie spielen: Klacken beim Zug (beim
      Schlag kräftiger), danach ein heller Ton bei Schach, drei fallende Töne bei Matt, zwei gleiche
      bei Patt oder Remis, ein tiefer Warnton beim Antippen einer Figur, die nicht ziehen darf.
      Klingt alles gut und passend?

### Neu in 0.2.56 (etwa 5 Minuten, mit Engine; Engine-Variante im Rückblick, Empfehlung R5, Fable)

- [ ] N275. **„Danach etwa …“ in der Rückblickkarte:** Eine neue Partie zu Ende spielen (ältere
      Auswertungen haben die Zugfolge noch nicht), dann in der Zugliste auf einen Zug mit „?!“,
      „?“ oder „??“ springen. Die Karte sagt wie bisher „Besser war 12. Sf3.“ und dahinter neu
      „Danach etwa 12... Sc6 13. Lc4 Sf6 14. Sg5 d5.“ (die nächsten bis zu fünf Halbzüge der
      Engine nach dem besseren Zug, deutsche Figurenbuchstaben). Bei einem Zug, der der beste war,
      steht nichts dergleichen. Passt die Länge, oder lieber nur zwei bis drei Halbzüge?

### Neu in 0.2.52 (etwa 30 Minuten, mit Engine; Stufen 1 bis 3 menschlicher, Empfehlung R4, Fable)

- [ ] N264. **Stufe 1 bis 3 menschlich?** Je eine Partie gegen „Eigene Stufe“ 1 · 1 · 1 und
      3 · 3 · 3. Die Engine sollte einzügige Dinge (Schlag, Drohung) meist sehen, aber nicht alles
      zwei, drei Züge tief, mit meist kleinen Fehlern, nicht „dämlich, dann genial“. Zu stark oder
      zu schwach? Gern die PGN mitschicken.

### Neu in 0.2.51 (etwa 15 Minuten, mit Engine; Vergleich mit chess.com, Empfehlung T4, Fable; N260 durch N290 ersetzt)

- [ ] N262. **Zeichen in entschiedener Stellung:** In klar gewonnener Stellung gibt es „?!“ erst
      ab drei Bauern Verlust, und die Engine bekommt in verlorener Stellung kein „!“ mehr für den
      einzigen haltbaren Zug (deine Stufe-3-Partie vom 17.10. hatte vorher 15 „?!“, chess.com 2).
      Sieh dir eine klar gewonnene Partie im Rückblick an: Wirken die Zeichen jetzt passend?

### Neu in 0.2.50 (etwa 10 Minuten, mit Engine; Genauigkeit wie bei chess.com, Fable)

- [ ] N258. **Verpasst statt Patzer:** In derselben Partie heißt 4. e3 jetzt „verpasst“ mit „?“
      (nicht mehr „??“): Nach 3... Sf4?? hing der Springer, 4. e3 nahm ihn nicht, aber Weiß stand
      danach nicht schlechter als vor dem Fehler der Engine (so auch chess.com). Die Zeile
      „Grobe Patzer“ in der Auswertung nennt 4. e3 weiter (kostet mehr als zwei Bauern), die
      Rückblickkarte sagt „4. e3? verpasst die Chance nach dem Fehler des Gegners: kostet etwa
      5,9 Bauern.“ Gibt ein Zug mehr zurück, als der Gegner geschenkt hat, bleibt es ein Patzer.
- [ ] N259. **Beste Züge und Zugklassen passen zusammen:** Karte „Spielstärke“: Die Zeile „Beste
      Züge“ (etwa „13 von 37“) ist jetzt dieselbe Zahl wie „Bester Zug (der Zug der Engine)“ in
      „Züge nach Art“; gleichwertige Züge, die nicht der Zug der Engine waren, stehen unter „Sehr
      gut“ (wie „Exzellent“ bei chess.com). Die Zeile „Zeichen“ beginnt mit „!! 0“ statt mit dem
      Platzhalter „{brillant}“. In der Rückblickkarte heißt ein gleichwertiger Zug „… ist so gut
      wie Sf3, der Zug der Engine.“

### Neu in 0.2.49 (etwa 25 Minuten, mit Engine; Endspieltrainer, Fable)

- [ ] N254. **Mattführung gewinnen:** Mattführung, Stufe 1, Runde starten: Dame gegen König (Abb.
      8.4, 8.55 oder 8.56). Oben „Weiß: Gewinne diese Stellung gegen die Engine.“, unten „Aus dem
      Buch: Abb. … · Matt mit der Dame · Stufe 1 · Matt in höchstens N Zügen“. Du ziehst, die
      Engine antwortet in voller Stärke (Status „Die Engine denkt“ / „Du bist am Zug“). Nach dem
      Matt: „Richtig! Matt! Ziel erreicht.“ und „Weiter“. Setzt du patt: „Falsch. Remis. Der
      Gewinn ist verfehlt.“
- [ ] N255. **Merksätze im Endspieltrainer:** Training › Endspieltrainer, in einigen Aufgaben
      „Hinweis 1“: Die Merksätze zum Thema sind in Claudes Worten. Lies sie kritisch und melde einen,
      der nicht zum Buch passt, mit dem Thema. (Hilfen und Kippen hat Claude geprüft.)
- [ ] N256. **Remis halten:** Turmendspiele, Stufe 4 oder 5: Philidor (Abb. 9.3, du spielst
      Schwarz, das Brett ist gedreht, die Engine zieht zuerst) oder Vancura (9.15). Oben
      „Schwarz: Halte das Remis gegen die Engine.“ Hältst du zwölf eigene Züge durch oder endet
      die Partie remis: „Richtig! Zwölf Züge gehalten …“ bzw. „Remis. Ziel erreicht.“ Verlierst
      du den Faden: „Die Stellung ist laut Engine gekippt. Gehalten hätte …“. „Aufgabe abbrechen“
      beendet eine Aufgabe als falsch und nennt den besten Zug.

### Neu in 0.2.48 (etwa 15 Minuten; drei neue Trainer, Opus)

- [ ] N250. **Zielbilanz-Übung:** Training › „Zielbilanz-Übung“: Stimmen die Wertungen der App
      (ja, teils, nein für Zentrum, Entwicklung, Königssicherheit) mit dem, was du im Buch lehrst?
      (Den Ablauf hat Claude geprüft.)

### Neu in 0.2.47 (etwa 15 Minuten, mit Engine; Claudes Empfehlungen schon umgesetzt, Opus)

Sechs Empfehlungen aus Teil 2 sind schon eingebaut, weil sie sich leicht zurücknehmen lassen:
S9, K5, R3, C8, T1, U9 (E2 stand schon so im Entwurf). Gefällt dir etwas nicht, genügt ein
Widerspruch, etwa „K5: zurück“; dann baut Claude es wieder aus.

- [ ] N245. **Kein „??“ bei klarem Gewinn (K5):** Eine Partie, in der du klar gewinnst (etwa
      Dame mehr), und statt eines Matts in zwei einen anderen gewinnenden Zug spielen. Der Zug
      bekommt höchstens „?!“ (ungenau), nicht mehr „??“, und steht nicht unter „Grobe Patzer“. In
      der Engine-Karte steht bei der Regel zu den Zeichen der neue Satz „Steht die ziehende Seite
      danach noch mit +5 oder besser, gibt es höchstens „?!““.
- [ ] N246. **Geschätzte Spielstärke (R3):** In der Karte „Spielstärke“ unter der Auswertung
      heißt die Zeile jetzt „Geschätzte Spielstärke“, der Wert „etwa 1400“. Die Erklärung sagt
      „keine Wertungszahl eines Verbands“.

### Neu in 0.2.44 (etwa 10 Minuten, mit Engine; deine Entscheidung vom 17.10.2026 abends)

- [ ] N233. **Übergang ins Mittelspiel ohne Zugzahl:** Eine Partie gegen die Engine, in der du
      absichtlich einen Springer oder Läufer zu Hause lässt. Sobald die Engine ihre Leichtfiguren
      entwickelt hat (höchstens eine zu Hause), steht in der Zugliste das „M“, obwohl du nicht
      fertig bist. Das Werkzeug „Phase“ sagt dann „Mittelspiel: Weiß (oder Schwarz) ist entwickelt
      …; der Entwicklungsrückstand der anderen Seite ist ein Mittelspielthema.“ Zweiter Fall: Geht
      früh eine Figur verloren, heißt es „Mittelspiel: Das Figurenmaterial ist um mindestens eine
      Leichtfigur ungleich …“. Lassen beide Seiten je zwei Figuren zu Hause und es fällt nichts,
      bleibt es Eröffnung, egal wie lange.
- [ ] N234. **Erklärung am Phasenwechsel:** Nach dem Ende in der Zugliste auf den Zug tippen, vor
      dem das „M“ oder „E“ steht: Die Karte unter dem Brett bekommt eine weitere Zeile „Neue Phase
      ab hier. Mittelspiel: …“ oder „Neue Phase ab hier. Endspiel: …“, mit demselben Satz wie im
      Werkzeug „Phase“ (bei der Speelman-Regel auch der Satz „Zusatzregel (nicht aus dem Buch)
      …“). Bei allen anderen Zügen fehlt die Zeile.
- [ ] N235. **Damenloses Mittelspiel bleibt Mittelspiel:** Stellung aufbauen oder spielen: nach
      einem frühen Damentausch mit vielen Figuren (etwa die Berliner Verteidigung, 1. e4 e5 2. Sf3
      Sc6 3. Lb5 Sf6 4. 0-0 Sxe4 5. d4 Sd6 6. Lxc6 dxc6 7. dxe5 Sf5 8. Dxd8+ Kxd8 9. Sc3) sagt das
      Werkzeug „Phase“ jetzt „Mittelspiel“; die Frage „Bauern entscheiden“ heißt dort „nein“, weil
      kein Freibauer steht und viel Figurenmaterial da ist.

### Neu in 0.2.43 (etwa 5 Minuten; deine Nachricht vom 17.10.2026 abends)

- [ ] N232. **„M“ und „E“ in der Zugliste:** Eine Partie spielen, die ins Mittelspiel kommt (am
      besten bis ins Endspiel). In der Zugliste über dem Brett steht vor dem ersten Zug des
      Mittelspiels ein goldenes „M“ und vor dem ersten Zug des Endspiels ein „E“, an denselben
      Stellen wie die Linien in der Kurve der Auswertung. Ein Tipp auf das Kästchen nennt die
      Phase. Die Zusatzregel „ab Zug 15 Mittelspiel“ ist gestrichen.

### Neu in 0.2.42 (etwa 20 Minuten, mit Engine; deine Ergänzungen vom 17.10.2026 abends)

- [ ] N230. **Kurve je Phase:** Einstellungen › „Deine Wertung“, Reiter Eröffnung, Mittelspiel,
      Endspiel (erst nach gewerteten Partien da): Erkennst du daran, wo Üben am meisten bringt?

### Neu in 0.2.41 (etwa 30 Minuten, mit Engine; deine Wünsche vom 17.10.2026 nachmittags)

- [ ] N222. **Zu zweit spielen:** Gegner „Mensch“, Partie beginnen: Überschrift „Partie zu zweit“,
      Untertitel „Mensch gegen Mensch · beide Seiten am selben Gerät“, Status „Weiß am Zug.“ und
      „Schwarz am Zug.“ im Wechsel, die Engine zieht nicht, beide Seiten lassen sich ziehen, die
      Uhr läuft für beide. Ein Matt heißt „Matt! Weiß hat gewonnen.“; „Aufgeben“ gilt für die Seite
      am Zug („Schwarz hat aufgegeben. Weiß hat gewonnen.“). Nach dem Ende die Auswertung wie
      sonst, in der Karte „Spielstärke“ und im Rückblick heißen die Seiten „Weiß“ und „Schwarz“.
- [ ] N223. **Partienliste:** Spielen › „Deine letzten Partien“: je Partie der König in deiner
      Farbe (bei zwei Menschen beide Könige), das Ergebnis als „1–0“, „0–1“, „½–½“ (oder
      „läuft“), in der Zeile der Name des Gegners („Timo“, „Mensch“ oder „Stufe 3“) und, sobald
      die Auswertung da ist, „du etwa 1400 · Engine etwa 1600“ (bei zwei Menschen „Weiß … ·
      Schwarz …“; bei kurzen Partien „78 % genau“).
- [ ] N225. **Phase, Zusatzregeln:** Spielen › Stellung aufbauen › Brett leeren, dann K e1, D d1,
      k e8, d d8 setzen und übernehmen; in der Partie das Werkzeug „Phase“ (Kapitel 11) öffnen:
      „Endspiel …“ und als zweite Zeile „Zusatzregel (nicht aus dem Buch): Jede Seite hat höchstens
      13 Punkte …“.
- [ ] N226. **Stellung aufbauen, Figuren setzen:** Spielen › „Stellung aufbauen“: Wahl „Figuren
      setzen / Züge spielen“, das große Brett, die zwölf Steine als Kacheln, „Feld räumen“,
      „Am Zug: Weiß / Schwarz“, „Brett leeren“, „Grundstellung“. Brett leeren, einen Stein wählen,
      Felder antippen (ein zweiter Tipp mit demselben Stein räumt das Feld); „Stellung übernehmen“
      bleibt grau, bis beide Könige stehen und die Stellung spielbar ist (der rote Satz erklärt,
      was fehlt). Nach dem Übernehmen heißt die Karte „Aus einer eigenen Stellung“, die Seite am
      Zug ist vorgewählt; von dort gegen die Engine oder zu zweit spielen. Auch aus einer Abbildung
      („Gegen die Engine spielen“) lässt sich die Stellung ändern; sie zählt dann als eigene.
- [ ] N227. **Stellung aufbauen, Züge spielen:** „Züge spielen“: Figur und Zielfeld antippen (nur
      Züge nach den Regeln, Zielfelder als Punkte); ein Bauer auf der letzten Reihe fragt nach der
      Figur. 1. e4 e5 2. Sf3 spielen, übernehmen: Die Partie beginnt in dieser Stellung mit Schwarz
      am Zug (bei Engine spielst du Schwarz, änderbar).

### Neu in 0.2.40 (etwa 20 Minuten, mit Engine; deine Ideen zum Spielen vom 17.10.2026)

- [ ] N213. **Zugklassen am Brett:** Beim Nachspielen trägt jeder Zug seine Marke am Zielfeld:
      grünes „✓“ für den besten Zug, goldenes „!“ für den einzigen guten Zug oder die Strafe nach
      einem Fehler, blaues „!!“ für ein gutes Opfer, graues „?!“, rotes „?“ und „??“; sehr gute,
      gute und Buchzüge ohne Marke, dafür mit Satz in der Karte („… ist ein Zug aus den
      Eröffnungen des Buches“, „… ist sehr gut (0,1 hinter …)“). Nach einem Fehler des Gegners
      heißt ein eigener Fehler „verpasst die Chance …“.
- [ ] N215. **Phasen in der Kurve:** Über der Auswertung trägt die Kurve goldene senkrechte
      Linien mit „M“ (erster Zug des Mittelspiels) und „E“ (Endspiel), sofern die Partie so weit
      kam.
- [ ] N218. **Auswertung ohne Nachfrage:** Bei den Fehlern der Engine fehlt „Hast du es gesehen?“.

### Neu in 0.2.39 (etwa 15 Minuten, mit Engine; Rückmeldung zum Nachtest bis N174)

Neu: Figurensätze „klassisch“ und „Holz“, Nummernsprung in der Kopfzeile, Werkzeugtexte ohne
„+9“, Rückblick-Karte mit Erklärung, „!“, Spielstärke, Eröffnung für die Engine. **Vorher:** In den
Einstellungen muss „App-Version 0.2.39“ stehen.

- [ ] N205. **Erklärung mit Markierung:** Spielen › Grundstellung, Stufe 1, als Schwarz: 1. e4 e5 2. Dh5 Sf6?? (du spielst absichtlich Sf6). Nach dem Ende und der Auswertung auf „2... Sf6??“
      tippen: Karte „Du lässt die Drohung Dxe5+ stehen (gewinnt den Bauern).“, roter Pfeil h5–e5,
      rotes Feld e5. Andere Fehlerarten lauten „lässt Läufer a3 ungedeckt hängen (W1)“ (rotes
      Feld mit W1), „übersieht die Gabel: Springer g5 nach f7 trifft …“ (Pfeil und rote Felder),
      „schlägt aus Schlagreflex (W5) …“, „zieht die Dame zu früh“, „lässt den König in der Mitte“.
      Fehler der Engine bekommen dieselbe Karte („Engine …“).
- [ ] N206. **„!“ für den einzigen guten Zug:** In derselben Partie trägt ein Zug, der der
      beste war und mindestens 1,2 Bauern vor dem zweitbesten lag, in der Zugliste ein „!“, am
      Brett ein goldenes „!“, auf der Karte „… war der einzige gute Zug.“ (Partien aus 0.2.38
      ohne diese Angabe bleiben ohne „!“; sie werden nicht neu ausgewertet.)

### Neu in 0.2.38 (etwa 5 Minuten, mit Engine; Rückblick nach der Partie)

Neu: Vorschlag H, Rückblick nach der Partie.

- [ ] N198. **Zeichen und besserer Zug am Brett:** Eine kurze Partie mit einem klaren Fehler
      spielen (etwa Spielen › eigene Stellung nach 1. f3 e5, dann 2. g4??). Nach dem Ende und der
      Auswertung in der Zugliste auf „2. g4??“ tippen: Auf g4 steht „??“ (rot), ein goldener Pfeil
      zeigt den besseren Zug (e3).
- [ ] N199. **Bewertungsbalken:** Beim Nachspielen nach der Partie steht links am Brett ein
      schmaler Balken mit Zahl (hier „−M“ für Matt durch Schwarz). Während einer laufenden Partie
      ist er nicht zu sehen; in der ruhigen Ansicht auch nicht. Spielst du Schwarz, wächst Weiß
      von oben.
- [ ] N200. **Verlaufskurve:** Über der Auswertung eine Kurve (hell: Anteil von Weiß), Fehler als
      rote Punkte. Ein Tipp auf die Kurve zeigt die Stellung an dieser Stelle.

### Neu in 0.2.37 (etwa 30 Minuten; AP 13 Übungen und erste Trainer)

Neu: Die Übungen des Buches lassen sich in der App lösen, mit Wiederholung, dazu die ersten drei
Trainer.

**Übungen des Buches**

**Erste Trainer** (Training › Kapitel 0 und 1 › „Trainieren“)

- [ ] N193. **Zähltrainer, hängende Figuren:** Training › Zähltrainer › „Hängende Figuren“:
      Stimmen die Felder, die die App als hängend nennt? (Den Ablauf hat Claude geprüft.)
- [ ] N194. **Schach-Röntgen-Trainer:** Ist die Aufgabe (drei Schritte, Pfeile setzen: Figur,
      dann Zielfeld) verständlich und auf dem Handy gut bedienbar? (Den Ablauf hat Claude geprüft.)
- [ ] N195. **Fortschritt:** Nach einer ganzen Runde zeigt das Kapitel unter Fortschritt den
      Trainer mit Durchgängen und richtigen Aufgaben.

### Neu in 0.2.36 (etwa 30 Minuten, mit Engine; AP 11 Kalibrierung)

Neu: die kalibrierten Stufen und die Fehlerprofile der Engine (Konzept 8.2), dazu drei Befunde der
Gegenprüfung (Uhr, Auswertung).
Die Abnahme aus dem Konzept lautet: „Der Autor prüft im Test, ob sich die Abstufung richtig anfühlt.“

**Stufen und Fehlerprofile**

- [ ] N176. **Stufe 2 (Anfänger), kein Damenopfer:** eine Partie auf Stufe 2 (etwa 20 Züge). Die
      Engine verschenkt Bauern und Figuren, aber nie die Dame ohne Gegenwert (Konzept 8.2).

**Gegenprüfung (Uhr und Auswertung)**

- [ ] N180. **Uhr nach dem Schließen:** Laufende Partie mit Uhr, eine Weile nachdenken, dann zu einer
      anderen App wechseln, die App schließen und wieder öffnen, Partie fortsetzen: Ist deine
      Restzeit die vom Moment des Verlassens? Befund am Rechner: Beim schnellen Neuladen ging die
      Bedenkzeit seit dem letzten Zug verloren (das Speichern wird dabei abgebrochen); auf dem
      Handy bleibt beim App-Wechsel meist genug Zeit zum Speichern. Bitte melden, wenn es bei dir
      auch passiert; dann baut Claude einen sofortigen Speicherweg für die Uhr.

### Neu in 0.2.33 (etwa 25 Minuten, mit Engine)

Neu: deine Antworten vom 16.10.2026 (Spielziel, Werkzeuge in der Partie, Figurensatz, Ton und die
Regeln C1 und C2).

**Spielen und Einstellungen**

- [ ] N158. **Kein Spielziel:** Spielen: Es gibt keine Auswahl „Spielziel“ mehr. Nach dem Ende
      einer Partie steht nur das Ergebnis, kein „Ziel erreicht/verfehlt“.

**Kapitel 1 bis 4**

**Kapitel 5 bis 7**

**Kapitel 8, 9 und 12**

---

## Teil 2: Entscheiden

Oben die Rückfragen, bei denen Claude schon entschieden hat (meist schon umgesetzt): Antworte mit
„alle ok“ oder „alle ok außer K3, S21“; bei einem Widerspruch baut Claude es zurück. Darunter die
Buchbefunde (nur du änderst das Buch) und die Fragen, die wirklich deine Entscheidung brauchen.

### Nur bestätigen (je eine Zeile; Widerspruch genügt)

- [ ] S21. **Urteilswort je Phase:** Wort aus der Genauigkeit der Phase (Hervorragend bis
      Schwach), Taktik und Strategie nach dem Sicherheitsblick (Kapitel 12) statt der Wörter von
      chess.com; umgesetzt in 0.2.72.
- [ ] S22. **Absichtliche Fehler nur für die eigene Stufe:** Vorgefertigte und eigene Bots spielen
      immer mit ihrer eigenen Liste; umgesetzt in 0.2.80.
- [ ] F1. **Fehlerdatenbank:** Fehlerart als Zeile der Gesamt-Checkliste, höchstens 500 Einträge,
      Vorschlag nach der häufigsten Fehlerart der letzten vier Wochen, Knopf bei jedem Zug im
      Rückblick; umgesetzt in 0.2.65.
- [ ] F2. **Denkroutine-Trainer:** feste Minute, Eingabe als Text, gelöst bis 0,5 Bauern hinter
      dem Zug der Engine; umgesetzt in 0.2.66.
- [ ] F3. **Planbilanz-Übung:** Antworten sind die Sätze der Werkzeuge, nicht deine Planbilanzen
      (die wären Buchtext und bräuchten deine Freigabe); umgesetzt in 0.2.69.
- [ ] F4. **Abweichungsmodus:** Die Engine weicht zwischen dem 4. und 12. Halbzug mit ihrem besten
      Nicht-Buchzug ab; gut bis 0,5 Bauern, ungenau bis 1,2; umgesetzt in 0.2.70.
- [ ] F5. **30-Minuten-Plan:** Die Uhr läuft über die Richtzeit weiter, Tag und Bereich wechseln
      nach jeder fertigen Einheit, der Stand liegt nur auf dem Gerät, gespielt wird ohne Uhr, bis
      es 10+0 gibt; umgesetzt in 0.2.71.
- [ ] X5. **Schwierigkeit im Endspieltrainer:** Grundstufe je Thema, eine Stufe mehr, wenn nur
      der erste Zug hält; so seit 0.2.49, nach deinem Test nachjustieren.
- [ ] T1. **Zusätzlich richtige Züge in Übungen:** nur, wo das Buch sie stützt (Übung 6 Lb4+,
      Übung 15 Sf6, Übung 83 Te1); umgesetzt in 0.2.55.
- [ ] T2. **Menge der Lichess-Aufgaben (Rückfrage A2 der Trainerdaten):** 8 Aufgaben je Motiv
      und Stufe (637 Taktik) und 12 je Fallenart und Stufe (120 Fallen) reichen vorerst; mehr
      erst, wenn sich Aufgaben spürbar wiederholen. Keine Änderung.
- [ ] T3. **Stufe von Buchaufgaben von Hand setzen:** nein, die Stufen sind gemessen. Keine
      Änderung.
- [ ] T4. **Fallen aus Kapitel 2 und 3 im Fallentrainer:** ja, nur Schläge mit „?“ und sofortiger
      Widerlegung (Kapitel 4); umgesetzt in 0.2.51.
- [ ] T5. **Strukturerkenner:** Zuordnung und Pläne nach den Tabellen und Folgerungen des Buches
      (5.43 Stellung öffnen, 5.44 Raum nutzen, 11.70 Vorposten); umgesetzt in 0.2.55.
- [ ] C1. **König im Schach in der Faktorenbilanz:** „schlecht“ nur, wenn er einen einzigen Zug
      hat (3.68), sonst „teils“; umgesetzt in 0.2.55.
- [ ] C2. **W4 in 4.21:** Ein Verteidiger zählt nur, wenn er nach dem Mattzug legal ziehen darf;
      gemeldet wird nur g2; umgesetzt in 0.2.55.
- [ ] C4. **Gegenschlag zählen:** auf dem Zielfeld des Hebels, wie du in 6.3 und 6.5. Keine
      Änderung.
- [ ] C5. **Dauerschach:** auch eine Schachfolge, die die Stellung wiederholt (9.34); umgesetzt in
      0.2.55.
- [ ] C6. **Gabel:** Jedes genannte Ziel muss für sich gewinnbar sein (Kapitel 7). Keine Änderung.
- [ ] C7. **Abb. 7.10:** Die Zugfolge beginnt mit 1. Sf7+, wie in der Bildunterschrift;
      umgesetzt.
- [ ] C8. **Berliner Endspiel:** kein Minderheitsangriff für Schwarz; umgesetzt in 0.2.47.
- [ ] C9. **Kandidaten in 12.4:** Der Abwehrzug 6... Sf6 gegen das drohende Matt zählt mit;
      umgesetzt.
- [ ] K1. **Abstufung der Stufen:** Die Antwort geben deine Tests N264, N334 und N335; keine
      eigene Antwort nötig.
- [ ] K2. **Damenopfer:** Nur Stufe 1 darf die Dame verschenken (Konzept 8.2). Keine Änderung.
- [ ] K3. **Buchtreue:** 85 % je Zug bei „eine Eröffnung des Buches (zufällig)“, „frei“ spielt
      ohne Buch. Keine Änderung.
- [ ] K4. **„Drohung ignoriert“ ab einem Bauern:** wie Kapitel 1, und nur, wenn die Engine den
      Verlust bestätigt. Keine Änderung.
- [ ] K5. **Verpasstes Matt:** Wer danach noch mit +5 oder besser steht, bekommt höchstens „?!“;
      umgesetzt in 0.2.47.
- [ ] E3. **Buchbeschreibung auf der Startseite:** nach dem Untertitel des Buches, „in Richtung
      Elo 2000“ statt „etwa 2000 Elo“; umgesetzt in 0.2.55.

### Buchbefunde (nur du änderst das Buch)

- [ ] B6. **Zeit-Zählhilfe in Kapitel 3:** Nach 1. e4 e5 2. f4 (Abb. 3.1, ebenso 3.18 und 3.36)
      sagt die Faktorenbilanz „Schwarz liegt vorn bei Zeit“, obwohl beide Seiten null Figuren im
      Spiel haben. Das folgt der Zählhilfe des Buches („Ist Schwarz am Zug, ziehe vom weißen
      Vorsprung eine Figur ab“) und der Tabelle zu Abb. 3.14 (zwei gegen zwei, Schwarz am Zug:
      Schwarz +1). Der Fließtext sagt dagegen „sein Vorsprung ist eine Figur kleiner“, also nie
      unter null. **Empfehlung:** im Buch „nie unter null“ ergänzen und die Tabelle zu 3.14 auf
      „gleich“ setzen; dann ändert Claude die App (eine Zeile). Bis dahin bleibt die App beim Buch.
- [ ] D1. **Abb. 4.45:** Im Buchstand vom 16.10. ist an der Stellung, den Pfeilen und den
      Markierungen von 4.45 nichts geändert, wohl aber die Zeile F3 der Fallenprüfung
      „Damenfalle im Dänischen Gambit“ (jetzt: der Läufer b2 fesselt g7 relativ an den Turm h8,
      „teils“); die ist in der App. **Empfehlung:** Antworte „Text“, wenn du diese Änderung
      meintest (dann ist alles drin), oder „Stellung“ und lade die neue Fassung hoch.
- [ ] D2. **Glossar und Steckbriefe sind sich bei der Phase uneins:** Die App folgt dem Glossar
      (Mittelspiel erst, wenn beide Seiten entwickelt sind und rochiert haben; „rochiert“ aus den
      Buchzügen). Drei Stellen widersprechen ihrem Steckbrief, weil eine Seite nicht rochiert:
      Lasker–Thomas (Steckbrief „Mittelspiel“, Weiß rochiert erst mit dem Mattzug),
      Fischer–Petrosjan 11.43 und 11.44 (Steckbrief „Mittelspiel bis Endspiel“, Schwarz rochiert
      erst im 15. Zug) und die Opernpartie 11.98 (Übung nach 11. Lxb5+). **Empfehlung:** im Buch
      die Steckbriefe angleichen (Lasker–Thomas „Eröffnung bis Mattangriff“, Fischer–Petrosjan
      „Eröffnung bis Endspiel“) oder im Glossar ergänzen, dass ein König in der Mitte das
      Mittelspiel nicht aufhält, wenn beide Seiten entwickelt sind. Bis dahin bleibt die App beim
      Glossar.

### Braucht deine Entscheidung oder Handlung

- [ ] S24. **Namen der Stufen und Lage der Skala:** Gemessen sind etwa Stufe 1 1200, Stufe 2
      1550, Stufe 3 1900, Stufe 4 2100, Stufe 5 („Vereinsanfänger“) 2350 bis Stufe 8 3200
      (Abstände aus über 800 Bot-Partien, Lage aus der Genauigkeit der Stufen 1 bis 3). Unsicher
      ist, ob ein Bot mit 70 % so spielt wie ein Mensch mit 70 %; das zeigt erst dein Test N335.
      „Vereinsanfänger“ bei 2350 passt nicht. **Empfehlung:** nach N335 entscheiden. Stimmen die
      Zahlen, neue Namen (etwa Gelegenheitsspieler, Vereinsspieler, Starker Vereinsspieler,
      Experte, Meister, Großmeister, Weltklasse, Engine); liegen sie zu hoch, verschiebt Claude
      die ganze Skala. Noch nicht umgesetzt, weil beides an deinem Test hängt.
- [ ] S20. **Deine Wertung nach der neuen Eichung (0.2.83):** Die Wertung in den Einstellungen
      rechnete früher mit einer anderen Skala; alte Punkte bleiben und wandern nur langsam.
      **Empfehlung:** einmal Einstellungen › „Deine Wertung“ › „Wertung zurücksetzen“, dann baut
      sie sich auf der neuen Skala auf (deine Partien bleiben in der Liste). Claude ändert
      gespeicherte Daten auf deinem Gerät nicht selbst.
- [ ] E4. **Bezugsquellen auf der Startseite:** ISBN und Shop-Links, sobald sie feststehen; bis
      dahin bleibt der Platz leer. Schick sie einfach in den Chat.
