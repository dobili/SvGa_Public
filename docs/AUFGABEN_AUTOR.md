# Was noch zu tun ist (für den Autor)

Stand: 19.10.2026, Version 0.2.113. **Diese Datei ist die einzige, die du brauchst:** Hier steht
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
Einstellungen prüfen, dass „App-Version 0.2.113“ dasteht; sonst die App neu laden.

Reihenfolge nach Wichtigkeit: Teil 1 testen (neueste Nummern zuerst), dann Teil 2: oben „Nur
bestätigen“ mit einem Satz („alle ok außer …“), darunter Buchbefunde und Entscheidungen. Alle
Nummern gelten für die aktuelle Version; frühere Versionen musst du nicht mehr getrennt testen.

---

## Teil 1: Testen auf dem Handy (etwa eine Stunde, meist Partien gegen die Engine)

Alles, was sich ohne dich prüfen lässt (Knopf öffnet etwas, Text oder Zahl steht da, Ablauf
klappt), hat Claude am 18.10.2026 selbst mit der gebauten App geprüft (Handygröße, hell und
dunkel, echte Engine) und hier gestrichen; dabei gefundene Fehler sind behoben. Hier steht nur
noch, was dein Auge, dein Gefühl am Brett oder dein Schachurteil braucht. Abhaken, was passt;
sonst eine Notiz. Wer wenig Zeit hat, nimmt zuerst N335, dann der Reihe nach.

Vorprüfung vom 19.10.2026 (0.2.90 bis 0.2.110): Claude hat alle 39 Punkte dieser Versionen mit der
gebauten App durchgespielt, auch ganze Partien gegen die Engine. 26 Punkte sind gestrichen, weil
sie stimmen (N400, N401, N404 bis N408, N484 bis N489, N500, N502, N551 bis N556, N558 bis N560,
N584, N585); ein Fehler ist behoben (N402: im Rückblick stand „Du übersieht die Gabel“, jetzt
„Dein Zug übersieht die Gabel“). Die übrigen sind gekürzt auf das, was nur du beurteilen kannst.

### Neu in 0.2.112 (etwa 3 Minuten; Hinweise für iPhone und alte Geräte, Opus)

- [ ] N410. **Sieben-Tage-Hinweis in Safari:** Öffne die App auf dem iPhone in Safari, nicht vom
      Home-Bildschirm (Adresse schach-von-grund-auf.com/app/). Oben steht einmal: „Wichtig in
      Safari: Safari kann die Daten einer Website löschen, die du sieben Tage lang nicht geöffnet
      hast, und damit deinen ganzen Fortschritt. Als App auf dem Home-Bildschirm gilt das
      nicht.“ mit „So installierst du die App“ und „Verstanden“. Dieselbe Warnung steht in den
      Einstellungen bei der Datensicherung. In der installierten App erscheint beides nicht.
      Passt der Ton? (Neu ist auch ein Hinweis für zu alte Geräte, ab iOS 16.4; den prüft Claude
      selbst, weil es dafür ein altes iPhone bräuchte.)

### Neu in 0.2.110 (etwa 2 Minuten; App-Symbol knackiger, dein Wunsch vom 19.10.2026, Opus)

- [ ] N490. **App-Symbol:** Die App vom Startbildschirm löschen und neu hinzufügen (iPhone: Safari
      › Teilen › „Zum Home-Bildschirm“). Der goldene Springer ist kräftiger, der Hintergrund
      dunkler, die Pfeile deutlicher, ohne Rauschen. Gefällt es dir so, oder kräftiger bzw.
      weicher? (Den runden Zuschnitt auf Android hat Claude nachgestellt: Ohren und Fuß bleiben
      ganz drin.)

### Neu in 0.2.106 (etwa 2 Minuten; Farbabstimmung hell und dunkel, Opus)

- [ ] N483. **Porträts:** Spielen › „Vorgefertigte Bots“, hell und dunkel (Einstellungen ›
      Anzeige › Nachtmodus). Die Porträts stehen im hellen Modus jetzt auf hellem Navy. Wirkt es
      leichter und passend?

### Neu in 0.2.104 (etwa 10 Minuten; englische Fassung als Vorschau, dein Wunsch vom 19.10.2026, Opus)

Alle Oberflächentexte gibt es auf Englisch, mit englischer Notation (B statt L, N statt S, R
statt T, Q statt D). Bildunterschriften, Glossar und Übungen kommen weiter aus den deutschen
Buchdaten, bis es dein englisches Buch gibt. Englisch muss man selbst wählen.

- [ ] N409. **Englisch lesen:** Einstellungen › Anzeige › „English (preview)“, eine kurze Partie
      gegen die Engine spielen und die Auswertung lesen: Klingen die Sätze natürlich? Notiere,
      was hölzern oder falsch klingt. Zurück mit Settings › Display › „Deutsch“.

### Neu in 0.2.103 (etwa 15 Minuten, mit Engine; Spielstärke nur bis zur Entscheidung, Opus)

Für die geschätzte Spielstärke zählen nur die Züge, bis die Partie entschieden ist (eine Seite hat
mindestens 90 % Gewinnchance und behält sie bis zum Ende).

- [ ] N580. **Verschenkte Partie gegen Stufe 1:** Spiele gegen Stufe 1, bis die Engine früh Dame
      oder Turm verliert, und spiele zügig zu Ende. Auswertung › „Spielstärke“: Wirkt die Zahl der
      Engine jetzt vernünftig (oder steht „zu wenige Züge vor der Entscheidung“)?
- [ ] N581. **„bis zur Entscheidung“ verständlich?** Auswertung › „Spielstärke“: „· aus 12 Zügen bis
      zur Entscheidung“ hinter der Spanne und „92 % · nach der Entscheidung (15 Züge)“ in der
      Phasentabelle. Verständlich? Und stört dich „Gut 99 %“ (Wort aus den Zügen vor der
      Entscheidung, Zahl aus allen Zügen der Phase)?
- [ ] N582. **Zahlen der Bots:** Stufe 1 steht bei etwa 850 bis 1100 (vorher 1050 bis 1300), Stufe 8
      bei 2800 bis 3000, „Zum Spaß“ unter 400 bis etwa 850. Passt das zu deinem Gefühl am Brett?
- [ ] N583. **Erklärung:** Auswertung › „Spielstärke“ › Fragezeichen bei „Wie die Zahlen
      entstehen“: Passt der neue Absatz „Für Spielstärke und Wort je Phase zählen nur die Züge, bis
      die Partie entschieden ist …“?

### Neu in 0.2.102 (etwa 3 Minuten, mit Engine; Uhr sofort gesichert, Opus)

- [ ] N180. **Uhr nach dem Schließen (Handy):** Partie mit Uhr beginnen, nach der Antwort der Engine
      eine Minute warten, die App aus der Liste der offenen Apps wischen, wieder öffnen, Spielen ›
      Weiterspielen: Steht deine Uhr auf dem Stand beim Schließen (etwa 4:0x), nicht auf 5:0x?

### Neu in 0.2.101 (etwa 5 Minuten; Symbolsprache, von dir freigegeben am 19.10.2026, Opus)

Ob alle Zeichen, Marken und Pfeile da sind und an der richtigen Stelle stehen, hat Claude am
19.10.2026 mit der gebauten App geprüft (N476 bis N482 gestrichen). Hier bleibt dein Eindruck.

- [ ] N475. **Gesamteindruck der Symbolsprache (hell und dunkel):** Spielen › „Vorgefertigte
      Bots“ (runde Stufenmarken in Gürtelfarben, „Zum Spaß“ mit Konfetti, vier kleine Gesichter
      rechts), dazu die Zeichen an Knöpfen und Überschriften (etwa Pfeil nach unten bei „Daten
      sichern“, Fahne bei „Aufgeben“, Glühbirne bei „Hinweis 1“, Pokal bei „Deine Wertung“).
      Gefällt dir das, und passt jedes Zeichen zum Wort? Einmal im Dunkelmodus ansehen.

### Neu in 0.2.99 (etwa 10 Minuten, mit Engine; deine Wünsche vom 19.10.2026 morgens, Opus)

Reihenfolge der Spielhilfen, Partienliste mit Filter und Löschen, Warum-Zeichen samt Zähler und
die Werkzeugliste hat Claude geprüft (N468, N471, N472, N474 gestrichen).

- [ ] N469. **Porträts für eigene Bots:** Spielen › „Eigene Bots“ › „Neuen Gegner anlegen“ ›
      „Porträt“: Passen die 30 Bilder und die Altersgruppen (Kinder bis Ältere)?
- [ ] N470. **Stern für besiegte Bots:** Gewinne eine gewertete Partie gegen einen Bot (am
      einfachsten Fritzi aus „Zum Spaß“). Trägt sein Porträt danach unten rechts einen kleinen
      goldenen Stern, auch in der Sprechblase, und steht an seiner Stufe „1/8“?
- [ ] N473. **Steckbriefe gegen das Buch:** Nachschlagen › Steckbriefe (13 Eröffnungen, 14
      Fallenchecks): Stimmen die Inhalte mit dem Buch überein? Zwei, drei Stichproben genügen.

### Neu in 0.2.98 (etwa 5 Minuten; Design-Überprüfung, Opus)

DS3 bis DS18 hat Claude mit der gebauten App geprüft (Handygröße, quer 844 × 390, Tablet,
dunkel, „Bewegung reduzieren“, Website); N452 bis N467 gestrichen. Hier bleibt, was nur das
echte Gerät zeigt.

- [ ] N450. **DS1 Schriftgröße des Geräts:** Stell am Handy die Schriftgröße größer (iPhone:
      Einstellungen › Anzeige & Helligkeit › Textgröße; Android: Einstellungen › Anzeige ›
      Schriftgröße), öffne die App neu: Werden Text, Knöpfe und Titel mit größer, und bleibt
      alles bedienbar?
- [ ] N451. **DS2 Querformat:** Dreh das Handy quer (oder nimm ein Tablet): Brett links, Text
      rechts, Leiste als Schiene links. Fühlt sich das auf deinem Gerät gut an (Abbildung,
      Partie, Auswertung)?

### Neu in 0.2.96 (etwa 10 Minuten; konstruierte Zugfolgen, Opus)

Zu 29 Abbildungen ohne Zugfolge im Buch gibt es eine von Claude konstruierte Partie ab der
Grundstellung, nur zum Nachspielen (Trainer und Buchzüge der Engine nehmen sie nicht).

- [ ] N501. **Konstruierte Partien echt?** Spiele Abb. 5.18 (13 Züge), 9.24 (32 Züge) und 10.21
      (42 Züge) mit „vor“ nach: keine sinnlosen Züge? Ist der Hinweis „Zugfolge von Claude
      konstruiert …“ unter der Zugleiste deutlich genug?

### Neu in 0.2.93 (etwa 5 Minuten; Lernsammlung, Opus)

- [ ] N557. **Als Lichess-Studie:** Lernsammlung › „Als PGN kopieren“, auf Lichess unter
      „Studien“ eine neue Studie, „PGN importieren“, einfügen. Wird jede Stellung ein Kapitel
      „Eröffnung: Fundstelle“ mit Plan und Notiz als Kommentar?

### Neu in 0.2.92 (etwa 3 Minuten; Ziehen per Wischen, Opus)

- [ ] N550. **Wischen am Handy:** Partie beginnen und Figuren mit dem Finger ziehen. Fühlt es sich
      gut an (Figur unter dem Finger groß genug, sichtbar, Zug sitzt beim Loslassen)?

### Neu in 0.2.90 (etwa 3 Minuten; Nachtarbeit Chat A, Opus)

- [ ] N403. **Sicherung teilen (Handy):** Einstellungen › „Sicherung teilen (Mail, Dateien)“, die
      Datei per Mail an dich schicken. Kommt sie an und lässt sie sich einspielen?

### Neu in 0.2.88 (mit Engine; Spaß-Bots und Zahlen über 2200, Opus)

- [ ] N347. **Fritzi und Bruno:** Eine Partie gegen Fritzi (Gruppe „Zum Spaß“, seit 0.2.103
      „unter 400“): Macht sie oft sinnlose Züge und schlägt trotzdem ab und zu eine hängende
      Figur? Bruno liegt jetzt bei etwa 850. (Gruppe, Zahlen und Sprechblase hat Claude
      geprüft.)

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
      Dunkelmodus: Ist die graue Marke „?!“ auf hellen Feldern lesbar? Gemessen am schwächsten:
      der Schimmer auf den dunklen Feldern von „Wie im Buch“ und „Marmor grün“ (blau auf einem
      dunklen Brett).
      (Gruppen, Kacheln und Lizenzen hat Claude geprüft.)

### Neu in 0.2.83 (mit Engine; Genauigkeit und Spielstärke neu geeicht, Opus)

- [ ] N326. **Deine Spielstärke nach einer Partie:** Spielen, Karte „Deine Spielstärke“ über
      „Letzte Partien“ (den Ablauf hat Claude geprüft). Befund aus 0.2.83 (vor der Neueichung in
      0.2.103, die Zahlen sind heute andere): Nach genau einer Partie zeigte sie
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
      <https://schach-von-grund-auf.com/datenschutz/> lesen. Seit 0.2.111 ergänzt um die Lücken
      aus einem e-recht24-Scan: Rechtsgrundlage für den Speicher auf dem Gerät (§ 25 TDDDG),
      Auftragsverarbeitung und USA-Übermittlung bei Cloudflare, Fehlerberichte des Browsers,
      „keine Inhalte anderer Anbieter“, Links, Widerspruchs- und Beschwerderecht; im Impressum
      Verbraucherstreitbeilegung und Haftung für Links. Cloudflare Web Analytics ist seit dem
      19.10. aus; die Seite lädt nachweislich nichts mehr von fremden Servern. Stimmen deine
      Angaben? Die anwaltlich geprüften Texte von e-recht24 ersetzen das später.

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

---

## Teil 2: Entscheiden

Oben die Rückfragen, bei denen Claude schon entschieden hat (meist schon umgesetzt): Antworte mit
„alle ok“ oder „alle ok außer K3, S21“; bei einem Widerspruch baut Claude es zurück. Darunter die
Buchbefunde (nur du änderst das Buch) und die Fragen, die wirklich deine Entscheidung brauchen.

### NA. Nachtarbeit Chat A (Opus, 18.10.2026; schon umgesetzt, Widerspruch genügt)

- [ ] NA1. **Voreinstellung von „Erst selbst denken auch vor Werkzeugen“:** Empfehlung **aus**.
      Schon umgesetzt in 0.2.90. Grund: Wer beim Lesen eine Abbildung öffnet, will meist
      nachprüfen, was im Buch steht; eine Pflichtkarte an jeder der 765 Abbildungen bremst
      dabei. Wer üben will, schaltet sie in den Einstellungen ein (Reiter „Training“). Sagst du
      „an“, wird sie für alle die Voreinstellung.

### EN. Englische Fassung (Opus, 19.10.2026, Version 0.2.104; EN1 und EN3 schon umgesetzt, Widerspruch genügt)

- [ ] EN1. **Vorläufige englische Namen der Buchbegriffe:** Empfehlung: geläufige englische
      Schachbegriffe, wo es sie gibt; eigene Begriffe des Buches wörtlich übersetzt. Schon
      umgesetzt in 0.2.104: Zählen = Counting, Angriffsregel = Attack rule, Todsünden = Deadly
      sins, Schach-Röntgen-Regel = Chess X-ray rule, Zielbilanz = Goal balance, Faktorenbilanz =
      Factor balance, Planbilanz = Plan balance, Falle oder Köder = Trap or bait, Prüffragen =
      Check questions, Warnsignale = Warning signs, Leitfrage = Guiding question, Erzwingende
      Züge = Forcing moves, Ruhe = Quiet, Erkennungsbild = Recognition pattern, Sicherheitsblick
      = Safety check, Denkroutine = Thinking routine, Gesamt-Checkliste = Master checklist,
      Lernsammlung = Study collection, Fehlerdatenbank = Mistake log, Strukturerkenner =
      Structure spotter, Erst selbst denken = Think first, Stufen 1 bis 8 = Newcomer bis Expert.
      Wenn dein englisches Buch andere Namen nimmt, sag sie mir; die Liste aller Begriffe steht
      in `docs/ENGLISCH_BEGRIFFE.md`.
- [ ] EN2. **Diese 27 Texte bleiben deutsch, bis du sie auf Englisch lieferst** (wörtlich aus
      dem Buch; Grundlage war ein Abgleich mit dem LaTeX, dann eine Durchsicht). Du kannst sie
      einfach als Liste „deutsch → englisch“ schicken:
      - König auf die kurze Seite
      - Gleichfarbige Läufer: Der Freibauer entscheidet
      - Erkennungsbilder der Endspiel-Vertiefung
      - Spiele dort, wohin deine Kette zeigt
      - Was will mein Gegner?
      - Welche Figur bringe ich dorthin?
      - Merkregel: Ist die Zahl der Felder zwischen den Königen ungerade, hat der Spieler die Opposition, der gerade gezogen hat.
      - Welche Figur?
      - Was will mein Gegner?
      - Der Plan in einem Satz
      - Wo spiele ich?
      - Regel 1: Aktiviere deinen König
      - Regel 2: Nutze Opposition und Zugzwang
      - Regel 3: Spiele geduldig
      - Regel 4: Tausche klug
      - Regel 5: Verteidige aktiv
      - Regel 6: Rechne bis zur Umwandlung
      - Die sechs goldenen Endspielregeln
      - Wann ist die Rechnung fertig?
      - 2. Kann der Gegner die gezogene Figur sofort schlagen?
      - 1. Steht mein König danach sicher?
      - 3. Erlaube ich ein Schach oder gar ein Matt?
      - Sicherheitsblick vor dem Ziehen
      - Ein Handbuch für Einsteiger und leicht Fortgeschrittene
      - Am Ende jeder Variante das Patt prüfen.
      - Vom Warnsignal zum Motiv
      - Könige auf verschiedenen Flügeln: Wer öffnet zuerst?
      Nicht in der Liste: kurze Buchwendungen innerhalb längerer App-Texte (etwa in den
      Regelzeilen der Werkzeuge); sie sind mitübersetzt. Bildunterschriften, Glossar und
      Übungen kommen aus den Buchdaten und bleiben deutsch, bis es dein englisches LaTeX gibt.
- [ ] EN3. **Kürzel am Brett auf Englisch:** Empfehlung: englische Anfangsbuchstaben. Schon
      umgesetzt in 0.2.104: Bauernschwächen D (doubled), I (isolated), B (backward, statt R),
      H (hanging), C (chain base, statt B), U (unsound); Drohung T (threat, statt D). Auf
      Deutsch bleibt alles wie im Buch.

### V. Version 1.0 (AP 17; Opus, 19.10.2026; V1 vorbereitet, Widerspruch genügt)

Claude hat die Abnahmeliste des Pflichtenhefts gegen den Stand 0.2.108 geprüft. Technisch ist
Stufe 1 erfüllt; was für 1.0 noch fehlt, liegt fast nur bei dir. Veröffentlicht wird nichts,
bevor du es sagst.

- [ ] V1. **Englische Vorschau in 1.0:** Empfehlung **ausblenden**, bis es dein englisches Buch
      gibt (ein englischer Leser bekäme sonst eine halb deutsche App). Vorbereitet in 0.2.108:
      Die Fassung für die Leser (Bau mit VEROEFFENTLICHUNG=1) hat weder Englisch noch deine
      Aufgabenseite; die heutige Fassung auf schach-von-grund-auf.com bleibt, wie sie ist.
- [ ] V2. **Dein Testweg nach 1.0:** Heute testest du auf schach-von-grund-auf.com/app/, also der
      Fassung, die ab 1.0 die Leser bekommen. Empfehlung: Die Leser bekommen die Fassung ohne
      Aufgabenseite, du testest auf der Vorschauadresse, die Cloudflare je Zweig baut (dort
      bleibt die Aufgabenseite). Bitte in Cloudflare nachsehen: Worker „schach-von-grund-auf“ ›
      Settings › Build › „Vorschau-Builds“ an? Dann sagt Claude dir die Adresse.
- [ ] V3. **Domain:** Ist schach-von-grund-auf.com mehrere Jahre im Voraus bezahlt, verlängert
      sie sich automatisch, und liegen die Zugangsdaten an einem sicheren Ort außerhalb des
      Repositorys? (Abnahmepunkt des Pflichtenhefts; nur ja oder nein schicken, keine Daten.)
- [ ] V4. **Trainernamen und Bereiche festschreiben:** Die Namen der 17 Trainer und der fünf
      Bereiche (Buch, Training, Spielen, Nachschlagen, Einstellungen) stehen ab dem Druck im
      Buch und dürfen sich danach nicht mehr ändern. Passen sie so?
- [ ] V5. **Sammelfreigabe:** Alle Texte, die seit dem 17.10.2026 „vorerst als abgesegnet“ in die
      App kamen (Trainertexte, Bot-Beschreibungen, Steckbriefe, Erklärungen), müssen vor 1.0
      einmal von dir freigegeben sein. Ein Satz genügt („alle frei außer …“), am besten nach dem
      Durchspielen von Teil 1.
- [ ] V6. **Abnahme auf echten Geräten, mit der Fassung 1.0** (etwa 20 Minuten, erst wenn das
      Buch fertig ist): Installation nach der Anleitung im Buch auf iPhone und Android (QR-Code
      aus Kapitel 0), danach Flugmodus an und Buch, Trainer, Spielen öffnen, und Datensicherung
      auf einem Gerät anlegen und auf dem anderen einspielen.

### ZF. Konstruierte Zugfolgen und Tablebase (Opus, 19.10.2026; ZF1 bis ZF3 schon umgesetzt, Widerspruch genügt)

- [ ] ZF1. **Welche Abbildungen eine Partie bekommen:** Von den 67 Abbildungen ohne Zugfolge
      sind 30 als „kann aus einer realistischen Partie erwachsen“ eingeordnet: die Endspiele aus
      Kapitel 8 bis 10 (Dame, Turm, Bauer, Läufer, Springer gegen König oder Bauern), die
      Bauernendspiele 5.9, 5.29 und 8.42, die Mittelspiele 5.18, 11.10 und 11.42 sowie 5.41,
      7.24 und 7.45. Keine Partie bekommen 37: Lehrbilder ohne beide Könige (0.3 bis 0.9, 5.1,
      5.2, 8.37), Bauernskelette mit nur Königen und vielen Bauern (5.10, 5.15, 5.27, 5.30, 5.32
      bis 5.35, 5.38, 5.39, 6.2, 6.8 bis 6.10, 8.44, 11.56: alle Figuren wären getauscht, ohne
      dass sich an den Bauern etwas geändert hätte), Mattmuster mit weggelassenen Steinen (7.35,
      7.36, 7.39 bis 7.43), die Schemata 5.12, 5.13 (Grundreihe) und 5.31 (Blockade) und das
      Gabel-Lehrbild 7.2. **Empfehlung:** so lassen.
- [ ] ZF2. **Wie genau die Partien gespielt sind:** Beide Seiten spielen in 27 der 29 Partien
      mit mindestens 80 % Genauigkeit (Formel der App, Tiefe 18), meist 85 bis 98 %. Ein „??“
      steht fast nur dort, wo die Abbildung es verlangt: Eine Seite muss im Endspiel Material
      hergeben (etwa Schwarz den letzten Bauern in Abb. 8.25), oder sie setzt patt (Abb. 0.11,
      8.7). Darunter liegen Abb. 10.21 (Schwarz 78 %) und Abb. 11.10 (Schwarz 69 %): In 11.10
      steht Weiß schon auf Gewinn (Läuferopfer auf h7, Engine +5,4), der letzte schwarze Zug muss
      also ein Fehler sein. Die beiden Mittelspiele (5.18 und 11.42 Semi-Tarrasch, 11.10
      Französisch) hat Claude von Hand gebaut, weil die Suche Mittelspiele nicht genau trifft.
      **Empfehlung:** so lassen; wenn dir eine Partie unecht vorkommt, nenne die Abbildung.
- [ ] ZF3. **Abb. 7.24 ohne Partie:** Weiß hat lang rochiert (König c1, Turm d1), der schwarze
      Läufer hat auf a2 den Bauern geschlagen und ist nach b3 eingesperrt. Die Suche fand auch mit
      einem Vorlauf mit langer Rochade keinen Weg, auf dem beide Seiten vernünftig spielen.
      **Empfehlung:** ohne Zugfolge lassen. Kennst du eine Partie, aus der die Stellung stammt,
      baue ich sie danach.
- [ ] ZF4. **Buchbefund aus der Tablebase (Abb. 8.25, 8.26, 9.23, 9.41):** Die Lichess-Tablebase
      (genau für bis zu sieben Steine) sagt: **8.25 und 8.26 sind mit Weiß am Zug remis**, weil
      der schwarze König rechtzeitig vor den Bauern kommt. Das Buch zeigt dort nur die
      Schlüsselfelder und behauptet nichts Falsches, ein Leser hält die Stellungen aber leicht für
      gewonnen. **Vorschlag:** in den Unterschriften ergänzen „Hier hält Schwarz remis: Sein König
      erreicht die Opposition, bevor Weiß ein Schlüsselfeld besetzt.“ **9.41 ist remis**, wie im
      Buch (die Engine zeigte früher +1,05; das war eine Täuschung der Engine). **9.23** hat elf
      Steine, zu viele für die Tablebase; die Engine in Tiefe 32 sieht nach 1. Txa7 Ausgleich
      (+0,03), das passt zum Buch („Weiß gewinnt mit Txa7 den Bauern zurück“). Die
      Endspielaufgaben des Trainers widersprechen der Tablebase in keinem Fall (137 Stellungen
      geprüft). Nur du änderst das Buch; die App bleibt, wie sie ist.

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
- [ ] B7. **Lichess-Adresse im Werkzeugkasten (Kapitel 12):** Die Liste der Lichess-Seiten nennt
      „/insights“ (Schach-Einblicke). Die Adresse lichess.org/insights gibt es nicht (Fehler 404,
      geprüft am 19.10.2026); die Einblicke liegen unter lichess.org/insights/DEINNAME und sind
      auch über das eigene Profil › „Einblicke“ erreichbar. Die Trainingsseite der Website
      verlinkt den Eintrag deshalb ins Leere. **Empfehlung:** im Buch „/insights/dein-name (über
      dein Profil)“ schreiben; Claude übernimmt es dann in die Trainingsseite. Bis dahin bleibt
      der Link wie im Buch.
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
