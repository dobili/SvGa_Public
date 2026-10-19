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
bestätigen“ mit einem Satz („alle ok außer …“), darunter Buchbefunde und Entscheidungen. Alle
Nummern gelten für die aktuelle Version; frühere Versionen musst du nicht mehr getrennt testen.

---

## Teil 1: Testen auf dem Handy (etwa eineinhalb Stunden, meist Partien gegen die Engine)

Alles, was sich ohne dich prüfen lässt (Knopf öffnet etwas, Text oder Zahl steht da, Ablauf
klappt), hat Claude am 18.10.2026 selbst mit der gebauten App geprüft (Handygröße, hell und
dunkel, echte Engine) und hier gestrichen; dabei gefundene Fehler sind behoben. Hier steht nur
noch, was dein Auge, dein Gefühl am Brett oder dein Schachurteil braucht. Abhaken, was passt;
sonst eine Notiz. Wer wenig Zeit hat, nimmt zuerst N335, dann der Reihe nach.

### Neu in 0.2.88 (mit Engine; Spaß-Bots und Zahlen über 2200, Opus)

- [ ] N347. **Fritzi und Bruno:** Eine Partie gegen Fritzi (Gruppe „Zum Spaß“, etwa 600): Macht
      sie oft sinnlose Züge und schlägt trotzdem ab und zu eine hängende Figur? Bruno liegt mit
      etwa 1100 etwas über deinem Wunsch (500 bis 1000); so lassen? (Gruppe, Zahlen und
      Sprechblase hat Claude geprüft.)

### Neu in 0.2.85 (mit Engine; Elo-Zahl der Bots, Opus)

- [ ] N334. **Stufe 3 gegen Stufe 4:** Je eine Partie gegen „Eigene Stufe“ 3 · 3 · 3 und 4 · 4 · 4.
      Macht Stufe 3 merklich mehr Fehler (etwa jeder fünfte Zug; gemessen 17 : 3 für Stufe 4)?
- [ ] N335. **Passt die Zahl zu dir?** Das ist der wichtigste Test, denn nur du kannst die Lage
      der Skala an einem echten Menschen prüfen. Spiele zwei oder drei gewertete Partien gegen
      einen Bot, dessen Zahl nahe an deiner Spielstärke bei chess.com oder Lichess liegt. Gehen
      sie etwa ausgeglichen aus, stimmt die Lage. Gewinnst du fast immer, sind die Zahlen zu hoch
      (oder umgekehrt); schreib dann, gegen wen und wie die Partien ausgingen (siehe auch S24).

### Neu in 0.2.84 (neue Bretter, Opus)

- [ ] N328. **Bretter gut lesbar?** Einstellungen › Karte „Einstellungen“ › Reiter „Brett“: je ein
      Brett aus „Farben“ und aus „Holz und Material“ wählen und eine Abbildung öffnen. Sind Felder,
      Schimmer des letzten Zuges und Figuren gut lesbar? Und beim Nachspielen einer Partie im
      Dunkelmodus: Ist die graue Marke „?!“ auf hellen Feldern lesbar? Gemessen am schwächsten: der Schimmer auf
      den dunklen Feldern von „Wie im Buch“ und „Marmor grün“ (blau auf einem dunklen Brett).
      (Gruppen, Kacheln und Lizenzen hat Claude geprüft.)

### Neu in 0.2.83 (mit Engine; Genauigkeit und Spielstärke neu geeicht, Opus)

- [ ] N326. **Deine Spielstärke nach einer Partie:** Spielen, Karte „Deine Spielstärke“ über
      „Letzte Partien“ (den Ablauf hat Claude geprüft). Befund: Nach genau einer Partie zeigte sie
      etwa 900 (500 bis 1300), die Karte „Spielstärke“ derselben Partie aber 1150 (750 bis 1550),
      weil „Deine Spielstärke“ die beiden Skalen anders mittelt. Stört dich das, oder reicht es,
      dass sich beides mit mehr Partien angleicht?
- [ ] N327. **Dauer der Auswertung auf dem Handy:** Eine Partie zügig zu Ende spielen: Wird die
      Auswertung (Tiefe 18, Fortschritt unter dem Ergebnis) in vertretbarer Zeit fertig? Am Rechner
      waren beim Ende schon 15 von 23 Stellungen fertig, der Rest dauerte 23 Sekunden.

### Neu in 0.2.81 (mit Engine; alle 64 Bots gemessen und eingestellt, Opus)

- [ ] N295. **Bots mit Stil passen zu ihrer Stufe:** Eine Partie gegen einen Bot der Stufe 2 mit
      Stil, etwa Onkel Rudi (aggressiv) oder Sophie (defensiv). Er sollte etwa so viele Fehler
      machen wie die Stufe 2 selbst (gemessen: alle Bots der Stufen 1 bis 4 holen gegen ihre Stufe
      ein Viertel bis drei Viertel der Punkte). Passt das?

### Neu in 0.2.68 (Werkzeugabweichungen aus der Textarbeit geprüft, Fable)

- [ ] N289. **Eigener Bot mit nur einer Fehlerart:** Einen eigenen Bot 2 · 2 · 2 mit nur dem Haken
      „patt gesetzt“ anlegen und spielen. Er sollte etwa so viele Fehler machen wie Stufe 2 (etwa
      jeder vierte Zug), meist kleine Ungenauigkeiten, weil die gewählte Art fast nie passt.
      Fühlt es sich so an?

### Neu in 0.2.67 (mit Engine; 64 Gegner mit Porträts, dein Wunsch vom 18.10.2026 nachts, Fable)

- [ ] N285. **Porträts:** Spielen › „Vorgefertigte Bots“: Passen Porträts und Namen zusammen, und
      ist die Auswahl auf dem Handy bequem? (Die Bedienung hat Claude geprüft.)
- [ ] N286. **Persönlichkeit spürbar:** Je eine kurze Partie gegen Finn (Stufe 1, sehr aggressiv:
      schlägt alles, vergisst den König) und Oma Gerda (Stufe 1, sehr defensiv: zieht Figuren
      zweimal, lässt den König sitzen). Fühlen sie sich deutlich verschieden an?
- [ ] N287. **Stufe 8 mit Charakter:** Eine Partie gegen IM Vogt (sehr aggressiv, übersieht ruhige
      Züge) oder IM Haas (sehr defensiv, übersieht die Grundreihe): Wirken sie trotz Handschrift wie
      Stufe 8?

### Neu in 0.2.63 (Impressum und Datenschutz mit deinen Angaben, Opus)

- [ ] N294. **Impressum und Datenschutz:** <https://schach-von-grund-auf.com/impressum/> und
      <https://schach-von-grund-auf.com/datenschutz/> lesen: Stimmen deine Angaben (Name,
      Anschrift in Hannover, kontakt@schach-von-grund-auf.com), Cloudflare und die Weiterleitung an
      goneo? Claude ist kein Anwalt; wer sichergehen will, vergleicht einmal mit einem Generator wie
      dem von e-recht24.

### Neu in 0.2.58 (mit Engine; deine Anmerkungen vom 17.10.2026 abends, Fable)

- [ ] N278. **Töne:** Einstellungen › Ton „an“, eine Partie spielen: Klacken beim Zug (beim
      Schlag kräftiger), danach ein heller Ton bei Schach, drei fallende Töne bei Matt, zwei gleiche
      bei Patt oder Remis, ein tiefer Warnton beim Antippen einer Figur, die nicht ziehen darf.
      Klingt alles gut und passend?

### Neu in 0.2.52 (mit Engine; Stufen 1 bis 3 menschlicher, Empfehlung R4, Fable)

- [ ] N264. **Stufe 1 bis 3 menschlich?** Je eine Partie gegen „Eigene Stufe“ 1 · 1 · 1 und
      3 · 3 · 3. Die Engine sollte einzügige Dinge (Schlag, Drohung) meist sehen, aber nicht alles
      zwei, drei Züge tief, mit meist kleinen Fehlern, nicht „dämlich, dann genial“. Zu stark oder
      zu schwach? Gern die PGN mitschicken.

### Neu in 0.2.51 (mit Engine; Vergleich mit chess.com, Empfehlung T4, Fable; N260 durch N290 ersetzt)

- [ ] N262. **Zeichen in entschiedener Stellung:** In klar gewonnener Stellung gibt es „?!“ erst
      ab drei Bauern Verlust, und die Engine bekommt in verlorener Stellung kein „!“ mehr für den
      einzigen haltbaren Zug (deine Stufe-3-Partie vom 17.10. hatte vorher 15 „?!“, chess.com 2).
      Sieh dir eine klar gewonnene Partie im Rückblick an: Wirken die Zeichen jetzt passend?

### Neu in 0.2.49 (mit Engine; Endspieltrainer, Fable)

- [ ] N255. **Merksätze im Endspieltrainer:** Training › Endspieltrainer, in einigen Aufgaben
      „Hinweis 1“: Die Merksätze zum Thema sind in Claudes Worten. Lies sie kritisch und melde einen,
      der nicht zum Buch passt, mit dem Thema. (Hilfen und Kippen hat Claude geprüft.)

### Neu in 0.2.48 (drei neue Trainer, Opus)

- [ ] N250. **Zielbilanz-Übung:** Training › „Zielbilanz-Übung“: Stimmen die Wertungen der App
      (ja, teils, nein für Zentrum, Entwicklung, Königssicherheit) mit dem, was du im Buch lehrst?
      (Den Ablauf hat Claude geprüft.)

### Neu in 0.2.42 (mit Engine; deine Ergänzungen vom 17.10.2026 abends)

- [ ] N230. **Kurve je Phase:** Einstellungen › „Deine Wertung“, Reiter Eröffnung, Mittelspiel,
      Endspiel (erst nach gewerteten Partien da): Erkennst du daran, wo Üben am meisten bringt?

### Neu in 0.2.37 (AP 13 Übungen und erste Trainer)

- [ ] N193. **Zähltrainer, hängende Figuren:** Training › Zähltrainer › „Hängende Figuren“:
      Stimmen die Felder, die die App als hängend nennt? (Den Ablauf hat Claude geprüft.)
- [ ] N194. **Schach-Röntgen-Trainer:** Ist die Aufgabe (drei Schritte, Pfeile setzen: Figur,
      dann Zielfeld) verständlich und auf dem Handy gut bedienbar? (Den Ablauf hat Claude geprüft.)

### Neu in 0.2.36 (mit Engine; AP 11 Kalibrierung)

- [ ] N180. **Uhr nach dem Schließen:** Laufende Partie mit Uhr, eine Weile nachdenken, dann zu einer
      anderen App wechseln, die App schließen und wieder öffnen, Partie fortsetzen: Ist deine
      Restzeit die vom Moment des Verlassens? Befund am Rechner: Beim schnellen Neuladen ging die
      Bedenkzeit seit dem letzten Zug verloren (das Speichern wird dabei abgebrochen); auf dem
      Handy bleibt beim App-Wechsel meist genug Zeit zum Speichern. Bitte melden, wenn es bei dir
      auch passiert; dann baut Claude einen sofortigen Speicherweg für die Uhr.

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
