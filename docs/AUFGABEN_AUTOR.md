# Was noch zu tun ist (für den Autor)

Stand: 19.10.2026, Version 0.2.100. **Diese Datei ist die einzige, die du brauchst:** Hier steht
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
Einstellungen prüfen, dass „App-Version 0.2.99“ dasteht; sonst die App neu laden.

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

### Neu in 0.2.99 (etwa 20 Minuten, mit Engine; deine Wünsche vom 19.10.2026 morgens, Opus)

- [ ] N468. **Spielhilfen über „Partie beginnen“:** Spielen › „Vorgefertigte Bots“. Direkt unter
      den drei Kacheln der Gegnerart stehen jetzt Du spielst, Bedenkzeit, „Züge zurücknehmen
      erlauben“, die Spielhilfen und „Gewertete Partie“, darunter „Partie beginnen“, erst dann das
      Gitter der Bots. Die Erklärung zur Wertung steht hinter dem Fragezeichen am Haken.
- [ ] N469. **Porträt für eigene Bots (mit Vorschaubildern seit 0.2.100):** Spielen › „Eigene
      Bots“ › „Neuen Gegner anlegen“. Unter dem Namen steht „Porträt“ als Knopf mit dem gewählten
      Bild und einem Pfeil. Antippen klappt alle 30 Bilder auf, nach Altersgruppen (Kinder,
      Jugendliche, Junge Erwachsene, Erwachsene, Ältere; je sechs, Frauen und Männer, verschiedene
      Haut- und Haarfarben, Brillen, Bärte), ganz oben „kein Bild“ mit dem Anfangsbuchstaben.
      Ein Tippen auf ein Bild wählt es und klappt zu. Gespeichert erscheint es in der Kachel, in
      der Sprechblase oben und in der Liste der eigenen Bots. Passen Bilder und Gruppen?
- [ ] N470. **Stern für besiegte Bots:** Gewinne eine gewertete Partie gegen einen Bot (am
      einfachsten gegen Fritzi aus „Zum Spaß“). Danach trägt sein Porträt in der Gegnerwahl unten
      rechts einen kleinen goldenen Stern auf Navy, auch in der Sprechblase. Ungewertete Siege
      zählen nicht; „Wertung zurücksetzen“ nimmt die Sterne weg.
- [ ] N471. **Partienliste:** Unter „Deine letzten Partien“ steht vor jeder Partie das Porträt des
      Gegners. Ab vier Partien gibt es den Filter „Ergebnis“ (alle, gewonnen, remis, verloren) und
      „Wertung“ (alle, gewertet, ungewertet); „Weitere Partien zeigen“ holt die nächsten zehn.
      Ungewertete Partien haben rechts einen Papierkorb; nach „Ja, löschen“ ist die Partie weg.
      Gewertete Partien lassen sich nicht löschen, weil sie die Wertung tragen.
- [ ] N472. **Zeichen für Warum-Fragen in der Kapitelübersicht:** Kapitel 1 öffnen, Abschnitt 1.4
      aufklappen. Bretter mit Warum-Frage tragen oben rechts ein Zeichen: graues Schloss (die Frage
      erscheint erst, wenn die Abbildung angesehen ist), goldene Sprechblase (wartet auf dich),
      grüner Haken (beantwortet). Die Legende steht unter „Abbildungen“. Öffne Abb. 1.26, warte 30
      Sekunden, beantworte die Warum-Frage, geh zurück: grüner Haken an 1.26, und oben unter
      „Dein Fortschritt“ steht „Warum-Fragen beantwortet 1 von 18“. In den Einstellungen zählt
      „Warum-Fragen beantwortet“ mit.
- [ ] N473. **Nachschlagen › Steckbriefe:** 13 Eröffnungen und 14 Fallenchecks aus dem Buch, jeder
      aufklappbar. Die Fallenchecks mit „Wer tappt hinein?“, den Prüfungen mit „Reicht?“ (Zeichen
      und Wort), „Rettender Zug“ und „Fallensteller-Test“. Der Knopf führt zum Stopp-Moment bzw.
      zur ersten Abbildung des Abschnitts. Stimmen die Inhalte mit dem Buch überein?
- [ ] N474. **Nachschlagen › Werkzeuge des Buches:** Alle Werkzeuge nach Kapiteln; ein Tipp auf den
      Namen zeigt, was das Werkzeug zeigt, und darunter seine Regel aus dem Buch. „Kapitel n
      öffnen“ führt zur Kapitelübersicht.

### Neu in 0.2.98 (etwa 25 Minuten; Design-Überprüfung, Opus)

Alle 18 Vorschläge DS1 bis DS18 hast du am 19.10.2026 angenommen („Alle, ja“). Jeder Punkt prüft
einen davon auf dem Handy (und, wo genannt, quer oder auf dem Tablet).

- [ ] N450. **DS1 Schriftgröße des Geräts:** Stell am Handy die Schriftgröße größer (iPhone:
      Einstellungen › Anzeige & Helligkeit › Textgröße; Android: Einstellungen › Anzeige ›
      Schriftgröße), öffne die App neu. Text, Knöpfe und Titel werden mit größer, das Brett
      bleibt so groß wie der Bildschirm erlaubt. Bei Standardgröße sieht alles fast aus wie
      vorher; nichts ist mehr kleiner als 13 Pixel (vorher bis 11).
- [ ] N451. **DS2 Querformat und Tablet:** Dreh das Handy quer (oder nimm ein Tablet quer).
      Die Leiste steht als Schiene links, das Brett links in voller Höhe, Zugleiste, Werkzeuge
      und Text rechts; rechts scrollt, das Brett bleibt stehen. Prüfe Abbildung 1.26, eine
      Übung, eine Trainerrunde, eine Partie und die Auswertung. Buch, Training und Einstellungen
      bleiben eine Spalte in Lesebreite. Hochkant ist alles wie gewohnt.
- [ ] N452. **DS3 Marke „am Zug“:** Unter jedem Brett steht vor „Weiß am Zug“ jetzt ein runder
      Stein statt eines Quadrats (das wie ein Kästchen zum Abhaken aussah); im dunklen Modus hat
      der schwarze Stein einen hellen Rand.
- [ ] N453. **DS4 Trainerliste:** Training: Die Trainer stehen als Zeilen mit Trennlinie in der
      Kapitelkarte, nicht mehr als Karte in der Karte. „Abweichungsmodus“ und „Strukturerkenner“
      stehen ungebrochen in einer Zeile.
- [ ] N454. **DS5 Wörter unter den Brettsymbolen:** Abb. 7.10: Unter den Symbolen am Brett
      stehen Zählen, Ziehen, Engine, Röntgen, W1–W7, Drehen; in der Partie dazu „Ruhig“. Alle
      passen bei schmalem Handy in eine Zeile.
- [ ] N455. **DS6 Trainerrunde:** Zähltrainer › Bilanz zählen: Während der Runde ist die
      Beschreibung des Trainers weg, unter „Aufgabe 1 von 8“ läuft ein goldener Balken mit, und
      der Auftrag steht linksbündig und halbfett. Zurück auf der Auswahl ist die Beschreibung
      wieder da.
- [ ] N456. **DS7 Reiter der Einstellungen:** Alle fünf Reiter (Brett, Figuren, Anzeige, Ton,
      Training) stehen nebeneinander, Symbol über dem Wort; nichts muss gewischt werden.
- [ ] N457. **DS8 Tippflächen:** Chips (Weiß/Schwarz, Bedenkzeit, Zahlen im Zähltrainer) sind
      etwas höher (44 statt 40 Pixel), „Eigene Stellung eingeben (FEN)“ lässt sich leichter
      antippen.
- [ ] N458. **DS9 Lange Titel:** Training › Koordinaten, Notation, Gangarten: Der zweizeilige
      Titel steht mittig mit etwas Luft nach oben.
- [ ] N459. **DS10 Aufgeben:** In einer Partie stehen „Zurücknehmen“ und „Aufgeben“ nebeneinander;
      „Aufgeben“ ist klein und grau rechts. Die Nachfrage kommt wie bisher.
- [ ] N460. **DS11 Aufklappzeilen in Spielen:** „Absichtliche Fehler der Engine“ und „Blinde
      Flecken der Engine“ haben ein Dreieck ▶ und lassen sich erkennbar aufklappen.
- [ ] N461. **DS12 Werkzeugleiste:** Unter dem Brett blendet die Leiste der Werkzeugbündel rechts
      weich aus; nach dem Wischen ist das letzte Bündel ganz sichtbar.
- [ ] N462. **DS13 Kapitelseite:** „Alle abhaken“ und „Alle zurücksetzen“ stehen klein
      nebeneinander statt als zwei breite Balken.
- [ ] N463. **DS14 Einstellungen:** Nach Wertung und Fortschritt kommen gleich die
      Einstellungen, „Über die App“ (Version, Update, Lizenzen) steht am Ende.
- [ ] N464. **DS15 Bewegung reduzieren:** Mit „Bewegung reduzieren“ am Gerät (iPhone: Bedienungs-
      hilfen › Bewegung) gleiten Balken und Klappen nicht mehr, sie springen.
- [ ] N465. **DS16 Trainingsseiten der Website:** <https://schach-von-grund-auf.com/training/kap01/>:
      Unten stehen „← Kapitel 0“, „Alle Kapitel“, „Kapitel → 2“ gleich breit in
      einer Zeile.
- [ ] N466. **DS17 Auswertung:** Nach einer Partie, Karte „Spielstärke“: Auf dem Handy steht jede
      Zeilenbeschriftung („Genauigkeit (App)“, „Geschätzte Spielstärke“) über den beiden Werten;
      nichts stößt mehr aneinander.
- [ ] N467. **DS18 Kapitelnummern:** Im Training stehen die Kapitelnummern in runden Navy-Kreisen
      wie im Buch, nicht mehr in goldenen Quadraten.

### Neu in 0.2.96 (etwa 10 Minuten; konstruierte Zugfolgen, Opus)

Dazu im Hintergrund: Zu 29 Abbildungen ohne Zugfolge im Buch gibt es jetzt eine Partie ab der
Grundstellung, die genau die Stellung der Abbildung erreicht (Zugrecht, Rochaderechte, en
passant eingeschlossen). Claude hat sie mit einer Engine-Suche gebaut, jeden Zug geprüft und die
Genauigkeit mit der Formel der App in Tiefe 18 nachgerechnet. Trainer und Buchzüge der Engine
nehmen diese Partien nicht, sie dienen nur dem Nachspielen.

- [ ] N500. **Hinweis an der Zugleiste:** Abb. 8.25 öffnen. Über dem Brett steht die Zugleiste
      mit 38 Zügen ab einer Italienischen Partie, der letzte Zug (38... Ke8) ist markiert.
      Darunter steht „Zugfolge von Claude konstruiert, nicht aus dem Buch. Sie führt nur zur
      Stellung der Abbildung hin; das Buch nennt keine Züge dorthin.“ „Zum Anfang“ führt zur
      Grundstellung, „vor“ spielt die Partie nach. Ist der Hinweis deutlich genug?
- [ ] N501. **Wirken die Partien echt?** Stichprobe aus drei Arten: Abb. 5.18 (Semi-Tarrasch,
      13 Züge bis zur Isolani-Stellung), Abb. 9.24 (Turmendspiel nach Spanisch, 32 Züge) und
      Abb. 10.21 (zwei Springer gegen Bauer nach Italienisch, 42 Züge). Spiele sie mit „vor“ nach. Erwartung:
      keine sinnlosen Züge; wo das Ziel Material verlangt, gibt eine Seite einmal etwas her
      (etwa ein Bauer im Endspiel). Alle 29: Abb. 0.10, 0.11, 5.9, 5.18, 5.29, 5.41, 7.45, 8.7,
      8.8, 8.9, 8.10, 8.25, 8.26, 8.42, 9.1, 9.2, 9.18, 9.24, 9.25, 9.35, 9.36, 9.37, 9.39, 9.41,
      9.42, 9.53, 10.21, 11.10, 11.42.
- [ ] N502. **Trainer unberührt:** Training › „Zug erraten“ (Kapitel 11) und „Studien lösen“
      (Kapitel 10) bieten weiter nur die Partien und Studien des Buches an; die konstruierten
      Partien zu Abb. 10.21, 11.10 und 11.42 tauchen dort nicht auf.

### Neu in 0.2.94 (etwa 3 Minuten; Technik für die englische Fassung, Opus)

Dazu im Hintergrund: Die App kann jetzt mehrere Sprachen tragen (Sprache des Geräts als
Voreinstellung, Wechsel lädt Texte und Buchdaten neu, `<html lang>` folgt). Übersetzt ist noch
nichts. Die Pipeline erkennt die Züge im Klartext der Bildunterschriften („Nach 2. Lf4“, 697
Stellen); die englische Fassung zeigt sie später als „2. Bf4“.

- [ ] N559. **Nichts hat sich verändert:** Öffne Abb. 1.2: Die Unterschrift lautet wie im Buch
      „Nach 2. Lf4 – Ziel 1: …“. Einstellungen › Reiter „Anzeige“: Unter „Sprache“ steht weiter
      „Deutsch (Englisch folgt mit der englischen Ausgabe)“; eine Auswahl erscheint erst, wenn
      es eine zweite Sprache gibt.
- [ ] N560. **Lizenzen:** Einstellungen › „Lizenzen“ (oder Fußzeile der Startseite): Die Seite
      sieht aus wie vorher (alle Bausteine mit Lizenz, Herkunft und „Lizenztext“). Die Texte
      stehen jetzt in der Sprachdatei, damit die englische Fassung sie übersetzen kann.

### Neu in 0.2.93 (etwa 10 Minuten; Lernsammlung, Opus)

- [ ] N553. **Stellung an einer Abbildung sammeln:** Öffne Abb. 2.2. Rechts unter dem Brett steht
      neben „Brett drehen“ ein Lesezeichen. Tippe darauf: Unter dem Brett erscheinen „Plan“,
      „Notiz“ und „Eröffnung“. Die Eröffnung ist schon ausgefüllt (Spanische Partie), du darfst
      sie ändern. Schreibe einen Plan-Satz und tippe „Speichern“. Es erscheint „In der
      Lernsammlung gespeichert“ mit dem Knopf „Lernsammlung öffnen“.
- [ ] N554. **Aus Partie und Trainer sammeln:** Im Rückblick einer beendeten Partie steht unter
      dem Zug neben „In die Fehlerdatenbank“ jetzt „In die Lernsammlung“ (Stellung nach dem Zug,
      mit dem Weg der Partie). In den Trainern steht nach jeder beantworteten Aufgabe „In die
      Lernsammlung“ über „Weiter“ (Taktik, Falle, Struktur, Endspiel, Repertoire, Zug erraten,
      Abweichung, Zielbilanz, Faktorenbilanz, Planbilanz, Denkroutine).
- [ ] N555. **Die Sammlung:** Training › Karte „Lernsammlung“ › „Lernsammlung öffnen“. Die
      Stellungen stehen in aufklappbaren Gruppen nach Eröffnung, alphabetisch, „Ohne Eröffnung“
      zuletzt. Ein Eintrag zeigt Brett, Plan und Notiz, dazu „Zu Abb. …“, „Bearbeiten“ und
      „Löschen“. Unten lässt sich eine Stellung als FEN eintragen (etwa aus einer Vereinspartie).
- [ ] N556. **Abfragen:** „Abfragen“ (alle) oder „Diese Gruppe abfragen“ zeigt die Stellungen in
      zufälliger Folge; erst „Plan zeigen“ deckt Plan und Notiz auf. Gespeichert wird dabei nichts.
- [ ] N557. **Als Lichess-Studie:** „Als PGN kopieren“ (oder „Als PGN-Datei sichern“). Auf Lichess
      unter „Studien“ eine neue Studie anlegen, „PGN importieren“ wählen und einfügen. Jede
      Stellung wird ein Kapitel; Name „Eröffnung – Fundstelle“, Plan und Notiz als Kommentar. Kennt
      die App den Weg zur Stellung, kannst du ihn im Kapitel nachspielen.
- [ ] N558. **Datensicherung:** Einstellungen › Daten sichern, auf einem zweiten Gerät (oder nach
      „Daten löschen“) einspielen: Die Lernsammlung ist wieder da. Hinweis: Eine Sicherung mit
      Lernsammlung lässt sich nur in Version 0.2.93 oder neuer einspielen (ältere Versionen melden
      „aus einer neueren Version“, damit nichts verloren geht).

### Neu in 0.2.92 (etwa 5 Minuten; Ziehen per Wischen, Opus)

- [ ] N550. **Figuren per Wischen ziehen:** Beginne eine Partie (Spielen › Partie beginnen) und
      ziehe den Bauern e2 mit dem Finger nach e4, ohne loszulassen. Die Figur hängt groß unter
      dem Finger, auf ihrem Feld bleibt sie blass, das Feld unter dem Finger schimmert. Beim
      Loslassen auf einem erlaubten Feld ist der Zug gespielt; auf einem verbotenen Feld oder
      neben dem Brett bleibt die Figur gewählt (die Zielpunkte sind zu sehen). Antippen von Figur
      und Zielfeld geht wie bisher. Das gilt überall, wo „Ziehen“ wirkt: Partie, Abbildungen mit
      dem Werkzeug „Ziehen“, Übungen und Trainer.
- [ ] N551. **Scrollen bleibt frei:** Lege den Finger auf ein leeres Feld oder eine gegnerische
      Figur und wische nach oben: Die Seite scrollt wie bisher. Nur auf einer eigenen Figur, die
      ziehen darf, nimmt der Finger die Figur. Auf Brettern ohne „Ziehen“ (Abbildung ohne
      Werkzeug, Zählen) scrollt die Seite überall.
- [ ] N552. **Abschalten:** Einstellungen › Brett › „Figuren per Wischen ziehen: aus“. Öffne
      danach ein Brett neu: Wischen bewegt keine Figur mehr, Antippen schon. Die Einstellung gilt
      nur auf diesem Gerät (wie die Koordinaten), weil sie von Gerät und Hand abhängt.

### Neu in 0.2.91 (etwa 5 Minuten; Endspiel-Kurzübungen, Opus)

Dazu im Hintergrund: Die Ergebnisse aller Werkzeuge an allen Abbildungen sind festgehalten; ändert
ein Umbau etwas daran, schlägt ein Test an. Für dich ändert sich dadurch nichts.

- [ ] N408. **Endspiel-Kurzübungen:** Training › Endspieltrainer › unten „Kurzübungen starten“.
      Acht schnelle Fragen ohne Engine, reihum: „Holt der schwarze König den Bauern ein?“
      (Quadrat), „Wer hat die Opposition?“, „Welches Feld ist ein Schlüsselfeld?“ und „Welches
      Erkennungsbild ist das?“ (Buchstellungen aus Kapitel 8 und 9). Nach der Antwort steht die
      Regel des Buches; beim Quadrat und bei den Schlüsselfeldern leuchtet die Lösung gold am
      Brett. Prüfe an zwei, drei Aufgaben, ob die Antwort der App schachlich stimmt.

### Neu in 0.2.90 (etwa 10 Minuten, mit Engine; Nachtarbeit Chat A, Opus)

Dazu im Hintergrund: Engine-Tests mit fester Tiefe (scheiterten ab und zu ohne Grund),
Barrierefreiheit auch auf Spielen, Partie, Auswertung, Trainern und im Dunkelmodus, ein Test bei
360 px Breite. Die Trainingsseiten der Website werden nicht mehr zwischengespeichert.

- [ ] N400. **Bedenkzeit 10 + 0:** Training › 30-Minuten-Plan › Tag A starten, „Schritt
      erledigt“, dann „Zum Spielen“. Unter „Bedenkzeit“ ist jetzt „10 + 0“ gewählt (neu neben
      30 + 20, 15 + 10 und 5 + 3). Du kannst sie dort noch ändern.
- [ ] N401. **Gewinnchance statt Bauerneinheiten im Zugurteil:** Abb. 1.26 öffnen, „Engine“,
      dann „Letzten Zug bewerten“. Bei einem Zug mit Zeichen lautet der Satz jetzt „5... Db6?!:
      Die Gewinnchance von Schwarz fällt von … % auf … %. Besser: … (goldener Pfeil)“, wie im
      Rückblick nach der Partie; ohne Zeichen „ist gut: Die Gewinnchance … sinkt nur von … auf …“. Nur wenn sich die Gewinnchance kaum ändert (klar gewonnene Stellung), nennt er
      weiter Bauerneinheiten. Ebenso das Werkzeug „Falle?“ (Abb. 4.21): „Falle: Nach axb4 …“
      nennt die Gewinnchance nach dem Schlag und nach der Rettung.
- [ ] N402. **Gabel mit Figurennamen:** Spiele eine Partie und stelle eine Figur in eine
      Springergabel (etwa Dame und König). Im Rückblick steht jetzt „übersieht die Gabel:
      Springer g5 nach f7 trifft König h8 und Dame d6. Der König muss ziehen, Dame d6 geht
      verloren.“ statt nur der Felder. Bei anderen Motiven nennt der Satz, was die Antwort
      schlägt (etwa „… schlägt Turm e8“).
- [ ] N403. **Datensicherung teilen (Handy):** Einstellungen › Daten auf diesem Gerät. Neben
      „Daten sichern (Datei)“ steht auf dem Handy „Sicherung teilen (Mail, Dateien)“. Er öffnet
      das Teilen-Menü; schick dir die Datei per Mail. Am Rechner fehlt der Knopf, wenn der
      Browser keine Dateien teilen kann.
- [ ] N406. **Wiederholung auch im Strukturerkenner und Endspieltrainer:** Löse im
      Strukturerkenner ein Skelett falsch (oder schaffe im Endspieltrainer eine Stellung nicht).
      Am nächsten Tag steht im Bereich Training unter „Fällige Wiederholungen“
      „Strukturerkenner: 1 fällig“ (bzw. Endspieltrainer), und im Trainer startet „Wiederholen“
      genau diese Aufgabe, wie bisher bei Taktik und „Falle oder Köder“.
- [ ] N407. **Zug erraten merkt sich die Trefferzahl:** Spiele eine Partie bei „Zug erraten“
      ganz durch. Beim nächsten Mal steht unter „Getroffen: …“ die Zeile „Beim letzten Mal
      (Datum): 7 von 12 getroffen.“ zum Vergleich. Der Verlauf steckt in der Datensicherung,
      ebenso jetzt der Stand des 30-Minuten-Plans (welcher Tag als Nächstes dran ist).
- [ ] N405. **Erst selbst denken auch vor Werkzeugen (dein Wunsch vom 18.10.2026):**
      Einstellungen › Reiter „Training“ › „Auch vor Werkzeugen und Engine“ auf „an“. Öffne
      Abb. 1.26: Statt Werkzeugleiste und Engine steht die Karte „Erst selbst denken“ mit „Weiß
      besser | gleich | Schwarz besser“ und „Ich habe nachgedacht“. Danach erscheinen die
      Werkzeuge, darüber „Deine Einschätzung: …“ zum Vergleich mit der Engine. Mit „streng“ geht
      es erst nach einer Einschätzung weiter. Prüfe auch: Übungen (etwa Übung an Abb. 1.40) und
      Trainer funktionieren mit „an“ wie bisher (dort gilt ihr eigenes „Erst selbst denken“).
      Voreinstellung ist „aus“ (siehe Rückfrage NA1).
- [ ] N404. **Bewertungsbalken lesbar:** Nach einer Partie im Rückblick: Die Zahl am schmalen
      Balken links steht jetzt auf dunklem Grund, auch wenn der weiße Teil bis zur Mitte reicht.


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
      Dunkelmodus: Ist die graue Marke „?!“ auf hellen Feldern lesbar? Gemessen am schwächsten:
      der Schimmer auf den dunklen Feldern von „Wie im Buch“ und „Marmor grün“ (blau auf einem
      dunklen Brett).
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

### NA. Nachtarbeit Chat A (Opus, 18.10.2026; schon umgesetzt, Widerspruch genügt)

- [ ] NA1. **Voreinstellung von „Erst selbst denken auch vor Werkzeugen“:** Empfehlung **aus**.
      Schon umgesetzt in 0.2.90. Grund: Wer beim Lesen eine Abbildung öffnet, will meist
      nachprüfen, was im Buch steht; eine Pflichtkarte an jeder der 765 Abbildungen bremst
      dabei. Wer üben will, schaltet sie in den Einstellungen ein (Reiter „Training“). Sagst du
      „an“, wird sie für alle die Voreinstellung.


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
