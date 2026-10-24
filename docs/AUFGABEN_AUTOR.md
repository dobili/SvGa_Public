# Was noch zu tun ist (für den Autor)

Stand: 24.10.2026, Version 0.2.125 (mit den Paketen P2, P3, P5 und P6 und den Punkten R15 bis
R23 und R33). **Diese Datei ist die einzige, die du brauchst:** Hier steht
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
Datenstand, Gerät; mit dem Dashboard sendet das Formular die Meldung direkt), bei allem anderen kurz, **was** du getan hast und **was** passiert ist, gern
mit Bildschirmfoto.

Adresse: <https://schach-von-grund-auf.com/app/> (oder die installierte App). Vorher in den
Einstellungen prüfen, dass „App-Version 0.2.125“ dasteht; sonst die App neu laden.

Reihenfolge nach Wichtigkeit: Teil 1 testen (neueste Nummern zuerst), dann Teil 2: oben „Nur
bestätigen“ mit einem Satz („alle ok außer …“), darunter die Entscheidungen. Alle
Nummern gelten für die aktuelle Version; frühere Versionen musst du nicht mehr getrennt testen.

---

## Teil 1: Testen auf dem Handy

Alle Punkte bis 0.2.115 hast du am 19.10.2026 abgehakt; sie stehen jetzt in
`docs/ENTSCHEIDUNGEN.md`. Deine Notizen und Wünsche aus derselben Rückmeldung arbeitet Claude als
Arbeitsliste R1 bis R26 ab (`docs/FORTSCHRITT.md`). Neue Testpunkte kommen hier hinzu, sobald ein
Teil fertig ist.

### Neu in 0.2.124: Admin-Dashboard, Fehler melden, Lichess-Links (R57; Opus, 24.10.2026)

- [ ] N740. **Fehler melden (Einstellungen › Über die App):** „Fehler melden“ klappt jetzt ein
      Formular auf: oben „Fehler | Wunsch | Fehler im Buch“, darunter ein Textfeld (die Frage
      passt zur Art), ein Häkchen „Angaben zum Gerät mitschicken“ (gesetzt) und „Senden“. Nach
      dem Senden steht „Danke! Deine Meldung ist angekommen (Nr. …)“, und die Meldung erscheint
      im Dashboard.
- [ ] N741. **Fehler im Buch melden:** Unter jeder Abbildung (ganz unten, unter der Fundstelle)
      steht „Fehler im Buch melden“. Es öffnet dasselbe Formular mit „Fehler im Buch“; Nummer der
      Abbildung und Stellung gehen mit. Im Dashboard steht die Meldung mit goldenem Rand, Abbildung
      und einer aufklappbaren „Stellung“ (mit Kopierknopf).
- [ ] N742. **Ohne Netz:** Im Flugmodus senden: Die App sagt, dass es nicht ging, und bietet
      „Text und Angaben kopieren“ an (für eine Mail an kontakt@schach-von-grund-auf.com).
- [ ] N743. **Dashboard:** <https://schach-von-grund-auf.com/admin/> öffnen, mit deiner Adresse
      und dem Einmalcode anmelden. Oben „Angemeldet als …“ und welche Teile eingerichtet sind,
      dann „Aufgabe für Claude“, „Prüfungen“ (rote und gelbe Punkte oben, grüne eingeklappt) und
      „Meldungen“ mit Reitern „Offen, Neu, In Arbeit, Erledigt, Kein Fehler, Doppelt“. Bei einer
      Meldung Status wählen, Notiz schreiben, „Speichern“.
- [ ] N744. **Aufgabe für Claude:** Der Knopf fasst rote und gelbe Prüfungen und alle offenen
      Meldungen als Auftrag zusammen und kopiert ihn. In einen neuen Chat einfügen genügt.
- [ ] N745. **Prüfungen per Mail:** Nach dem Ausrollen läuft auf GitHub der Lauf „Wartung“
      (Actions › Wartung), danach jeden Montag früh. Ist ein Punkt rot, scheitert der Lauf und
      GitHub schickt dir eine Mail. Die Ergebnisse stehen auch auf der Seite des Laufs als Tabelle.
- [ ] N746. **Werkzeug-Links auf den Trainingsseiten:** <https://schach-von-grund-auf.com/training/kap01/>
      öffnen. Unter jeder Übung, die ein Lichess-Werkzeug nennt (etwa „Aufgabenthemen“, „Stellung
      aufbauen“, „Analysebrett“), steht „Direkt öffnen:“ mit Knöpfen, die das Werkzeug in einem
      neuen Tab öffnen. Der Text der Übung bleibt wie im Buch. Die Adressen kommen aus dem
      Werkzeugkasten in Kapitel 12; der Wartungslauf prüft sie jede Woche.

### Neu in 0.2.123: Spielen ohne die Bot-Kalibrierung (R24, R27, R28, R51, R54; Opus, 24.10.2026 nachts)

- [ ] N638. **Partienliste (R54):** Über der Liste stehen „Filter“ und „Neueste zuerst“. „Filter“
      klappt Häkchen in Gruppen auf (Ergebnis, Wertung, Deine Farbe, Gegner, Bedenkzeit); die Zahl
      am Knopf zählt die Häkchen, aktive Filter stehen als goldene Chips mit ×. „Neueste zuerst“
      klappt sechs Ordnungen in Worten auf (Neueste/Älteste, beste/schwächste Spielstärke,
      stärkster/schwächster Gegner).
- [ ] N639. **Titel der Partie (R28):** Gegen einen Bot steht oben „gegen Leon“ mit seinem Porträt.
      Mit eigener Stufe ohne Bot bleibt „Partie gegen die Engine“.
- [ ] N640. **Art des Gegners (R27):** Unter Spielen stehen jetzt erst Farbe, Bedenkzeit, „Gewertete
      Partie“, Spielhilfen und Eröffnung, darunter die drei Kacheln „Eigene Stufe“, „Vorgefertigte
      Bots“, „Eigene Bots“ und direkt darunter „Partie beginnen“.
- [ ] N641. **Bedenkzeit (R51, Anzeigeteil):** Neu ist 60 + 0. Mit „Gewertete Partie“ gibt es
      kein „Ohne Uhr“ mehr; ohne gewählte Uhr beginnt eine gewertete Partie mit 10 + 0. In der
      Partienliste steht hinter jeder Partie mit Uhr die Zeitklasse, etwa „Schnellschach 10 + 0“
      (nach der Regel von Lichess: Bullet, Blitz, Schnellschach, Klassisch), und unter „Filter“
      gibt es die Gruppe „Bedenkzeit“. Wertung und „besiegt“ je Zeitklasse folgen mit dem Bot-Chat.
- [ ] N642. **Festgelegte Eröffnung (R24):** Unter „Eröffnung festlegen“ etwa „Spanische Partie“
      wählen und gegen einen Bot spielen. Hat das Buch keinen Zug mehr, bleibt der Bot in
      derselben Eröffnung, mit Zügen aus der freien Eröffnungsliste von Lichess (im Werkzeug
      „Eröffnung“ siehst du den Namen der Variante); erst danach spielt er wieder frei.

### Neu in 0.2.122: neue Auswertung nach der Partie (R55, R56; Opus, 23.10.2026 nachts)

Wie in den Vorschaubildern besprochen. Zum Testen eine Partie gegen einen Bot spielen (gern 20 Züge
oder mehr) oder unter Spielen eine Partie per PGN einlesen.

- [ ] N633. **Umschalter oben:** Über der Bewertungskurve steht „Weiß (du) | Schwarz (Name des
      Bots)“, voreingestellt auf deine Seite. Er gilt für die ganze Auswertung: Satz unter der
      Kurve, Fehlerliste, Spielstärke und Züge. Auf der Seite des Bots steht statt der
      Fehlerliste die eingeklappte Liste „Absichtliche Fehler der Engine“.
- [ ] N634. **Fehler und Patzer eingeklappt (R55):** Unter der Kurve steht „Fehler und Patzer“ mit
      der Anzahl im Kästchen. Erst ein Tipp klappt die Liste auf; jeder Eintrag hat seine farbige
      Marke und springt zur Stellung.
- [ ] N635. **Zoom der Kurve:** Unter der Kurve stehen „Ganze Partie“, „Eröffnung“, „Mittelspiel“,
      „Endspiel“ (soweit vorhanden). Ein Tipp auf eine Phase zieht sie auf die volle Breite.
      Finger auf der Kurve halten und seitwärts fahren: Darüber steht der Zug („13. Txd7“) und ein
      goldener Strich zeigt die Stelle; Loslassen springt dorthin. Mit zwei Fingern aufziehen
      vergrößert.
- [ ] N636. **Spielstärke:** Großer Ring mit der Genauigkeit in der Farbe des Urteils, daneben
      „Sehr gut gespielt“, Genauigkeit, geschätzte Spielstärke und Spanne. Darunter je ein Balken
      für Eröffnung, Mittelspiel, Endspiel, Strategie und Taktik mit Symbol, Prozent, Spielstärke
      (ab sechs Zügen), Urteil und Zahl der Züge; ohne Züge grau mit „–“. Der Schalter „Genauigkeit
      wie“ steckt jetzt hinter dem Fragezeichen der Karte.
- [ ] N637. **Deine Züge:** Je Zugart eine Zeile mit Marke, Name, Kästchen mit der Anzahl und
      „x % des Üblichen · gut/normal/schwach“; darunter der Balken über drei grauen Zonen mit dem
      dunklen Strich für das Übliche. Bei schwachen Zügen ist die linke Zone „gut“. Ein brillanter
      Zug ergibt schnell „über 300 % … ▸“. Unter 15 eigenen Zügen stehen nur die Anzahlen. Die
      üblichen Anteile sind vorerst geschätzt (Tabelle in spiel/zugklassenvergleich.ts); der
      Bot-Chat ersetzt sie durch Werte aus Lichess-Partien.

### Neu in 0.2.121: App-Tour (P8, R52; Opus, 23.10.2026)

Die Rückfragen dazu stehen in Teil 2 unter „P8 App-Tour“ (P8-1 bis P8-44). Zum Testen am besten
erst die Daten der App auf dem Gerät nicht löschen, sondern einfach öffnen: Die Frage nach dem
Rundgang kommt auch bei dir einmal.

- [ ] N760. **Frage beim ersten Start:** App öffnen. Nach dem Startbild erscheint „Kleiner
      Rundgang?“ mit „Später“ und „Rundgang starten“. Tippe „Rundgang starten“: acht Schritte,
      der Rest des Bildschirms ist abgedunkelt, die Leiste wird Bereich für Bereich mit goldenem
      Rahmen gezeigt, zum Schluss das Kompass-Symbol oben rechts. App schließen und wieder öffnen:
      Die Frage kommt nicht noch einmal.
- [ ] N761. **Toursymbol:** Oben rechts steht auf Buch, Kapitel, Abbildung, Übung, Training, jedem
      Trainer, Lernsammlung, Nachschlagen (mit Glossar, Begriff, Denkroutine, Checkliste,
      Steckbriefen, Werkzeugen) und in den Einstellungen ein kleiner Kompass. Ein goldener Punkt
      daran heißt „noch nicht gesehen“; nach der Tour ist er weg. Beim Spielen gibt es das Symbol
      noch nicht (kommt nach der Kalibrierung).
- [ ] N762. **Tour der Abbildung:** Abb. 1.26 › Kompass. Die Tour zeigt Nummer, Blättern,
      Zugleiste, Brett, die Werkzeuge am Brett, Drehen, Lesezeichen, Bündel, die Werkzeugkarte
      (ohne gewähltes Werkzeug in der Mitte), Gegen die Engine spielen und die Unterschrift. Das
      Ziel wird jeweils in den sichtbaren Bereich gescrollt. Danach Abb. 0.4 (ohne Zugfolge): Der
      Schritt zur Zugleiste fehlt.
- [ ] N763. **Querformat:** Handy quer, Abb. 1.26 › Kompass. Beim Brett steht die Karte rechts
      daneben statt darüber; der goldene Rahmen bleibt ganz im Bild.
- [ ] N764. **Trainer:** Training › Taktiktrainer › Kompass: Wahl von Thema und Stufe mit Rahmen,
      dann Hilfen, Motiv und die Runde als Karten in der Mitte. Dasselbe in einer laufenden Runde:
      Jetzt ist auch der Stand oben gerahmt. Probier zwei, drei weitere Trainer.
- [ ] N765. **Einstellungen:** Zahnrad › Kompass: Wertung, Fortschritt, jeder der fünf Reiter,
      Daten auf diesem Gerät, Über die App. Dann Reiter „Anzeige“ › „Toursymbol: aus“: Das Symbol
      verschwindet überall. „Rundgang durch die App“ startet den Rundgang trotzdem; der Schritt zum
      Symbol steht dann in der Mitte. Zum Schluss das Symbol wieder einschalten.
- [ ] N766. **Bedienung:** Während einer Tour lässt sich neben der Karte nichts antippen. Das
      Kreuz beendet sie jederzeit, „Zurück“ geht einen Schritt zurück. Die Zurück-Geste des Handys
      beendet die Tour.
- [ ] N767. **Nachtmodus:** Einstellungen › Anzeige › Nachtmodus an, dann eine Tour: Karte dunkel
      mit goldenem Rand, gut lesbar.
- [ ] N768. **Texte:** Lies bei Gelegenheit die Touren der Bildschirme, die du oft benutzt. Stimmt
      etwas nicht oder fehlt etwas, schreib es mit Nummer der Rückfrage (P8-12 bis P8-43) und
      Schritt.

### Neu in 0.2.118 und 0.2.119: Brett und Bedienung (P2; Opus, 23.10.2026)

- [ ] N650. **Tippen (R35):** Spielen › „Partie beginnen“. Tippe den Springer g1 an, dann nicht
      genau f3, sondern knapp daneben (etwa auf den linken Rand von g3): Der Springer zieht nach
      f3. Ein Tipp in die Mitte eines anderen Feldes wählt wie bisher ab. Nur genau auf der Kante
      zwischen zwei möglichen Zielfeldern geschieht nichts, die Figur bleibt gewählt. Ein Tipp
      zählt jetzt auch, wenn der Finger dabei etwas rutscht, und gleich nach einem Wischen. Ist
      eine Figur gewählt, scrollt die Seite über dem Brett nicht. Erkennt die App deine Tipps
      jetzt zuverlässig?
- [ ] N651. **Markierte Felder mit einem Umriss (R36):** Abb. 0.3 öffnen: Die grauen Felder, die
      der Turm erreicht, stehen jetzt als zwei lange gepunktete Rahmen (Linie und Reihe) da statt
      als einzelne Kästchen. Abb. 0.4: Die drei roten Felder e3 bis e5 haben einen gemeinsamen
      gestrichelten Rahmen, die goldenen Felder um den König Ecken nur am äußeren Umriss. Das
      gilt überall, auch für die Werkzeuge. Felder, die sich nur an einer Ecke berühren, und
      Felder verschiedener Farbe bleiben getrennt. Gefällt dir das, auch bei Gold?
- [ ] N652. **Fortschritt der Auswertung (R29):** Nach einer Partie (oder Spielen › „Partie
      einlesen (PGN)“) steht in der Karte „Auswertung“, solange die Engine rechnet, nur „Die
      Engine wertet die Partie aus …“ und darunter ein goldener Balken mit der Prozentzahl
      daneben, statt „12 von 48 Stellungen“.
- [ ] N653. **Zuganimation (R37):** Spiele eine Partie mit 5 + 3 gegen einen Bot. Tippst du Figur
      und Zielfeld an, gleitet die Figur in etwa einer Fünftelsekunde hinüber, mit einer kurzen,
      verblassenden Spur aus Nachbildern; ebenso der Zug des Bots (bei der Rochade gleitet der Turm
      mit, eine geschlagene Figur verblasst). Deine Uhr läuft erst, wenn sein Zug angekommen ist.
      Ziehst du per Wischen, springt nichts nach. Einstellungen › Brett › „Züge gleiten über das
      Brett“ schaltet es ab. Gefällt dir Tempo und Spur?
- [ ] N654. **Ergebnis auf dem Brett (R38):** Beende eine Partie (gewinnen, Remis oder aufgeben).
      Sobald der letzte Zug angekommen ist, springt mitten auf dem Brett ein Schild auf:
      „Gewonnen!“ mit goldenem Pokal, „Remis“ mit Händedruck oder „Verloren“ mit rotem Kreuz, darunter
      der Grund („Matt. Die Engine hat gewonnen.“). Nach etwa drei Sekunden blendet es sich von
      selbst aus; die Karte unter dem Brett bleibt. Öffnest du eine beendete Partie aus der Liste,
      kommt das Schild nicht noch einmal. Bei Partien zu zweit steht „Weiß gewinnt“ oder
      „Schwarz gewinnt“.
- [ ] N655. **Startanimation (R39, seit 0.2.120 nach deinem Wunsch):** Schließe die App ganz und
      öffne sie neu. 2,5 Sekunden lang wächst der goldene Springer vom Cover mit goldenem Schein
      auf dunklem Grund heran, darunter „Schach von Grund auf“, dann blendet alles aus. Ein Tipp
      irgendwo überspringt sie. Gleich noch einmal schließen und öffnen: Sie kommt wieder (bei
      jedem Start, keine Stundensperre mehr). Beim bloßen Neuladen kommt sie nicht. Dann
      Zahnrad › Brett › „Startbild beim Öffnen der App“ auf „aus“, App schließen und öffnen: kein
      Startbild mehr. Bei „Bewegung reduzieren“ des Geräts bleibt sie immer aus.
- [ ] N656. **Fenstergröße am Rechner (R40):** Öffne Abb. 1.26 im Browser am Rechner, Fenster
      breit: Brett links, Text rechts. Ziehe das Fenster langsam schmaler: Sobald es weniger als
      etwa 5 : 4 breit ist (etwa 1000 × 800), springt die App sofort, ohne Neuladen, in eine
      Spalte mit dem Brett oben; breiter gezogen wieder zurück. Bisher kippte sie erst bei einem
      fast quadratischen Fenster, vorher wurden Brett und Text sehr eng (siehe Teil 2, P2-B).
- [ ] N657. **Weiß und Schwarz in der Fehlerliste (R53):** Einstellungen › Anzeige › Nachtmodus
      „an“. Spiele eine kurze Partie oder lies eine ein (Spielen › „Partie einlesen (PGN)“, etwa
      „1. e4 e5 2. Qh5 Nc6 3. Qxf7+ Kxf7 0-1“). In der Auswertung unter „Grobe Patzer“ steht vor
      jedem Zug ein kleiner Bauer auf einem runden Plättchen: weißes Plättchen mit dunklem Bauern
      für Weiß, dunkles Plättchen mit hellem Bauern für Schwarz, beide mit Rand. Gut zu erkennen,
      auch im hellen Modus?

### Neu in 0.2.119: Trainer-Inhalte (P4; Fable, 23.10.2026)

Alles unter Training.

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

### Neu in 0.2.116 und 0.2.118: deine Rückmeldung vom 19.10.2026 (R1 bis R23, R33; Opus)

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
- [ ] N630. **Eröffnung ohne „zu wenige Züge“ (R33):** Eine kurze Partie spielen und auswerten. In der
      Karte „Spielstärke“ steht bei „Eröffnung“ jetzt Urteil und Genauigkeit, etwa „Gut 84 % (4 Züge)“,
      ohne „zu wenige Züge“. Die Zahl der Spielstärke kommt je Phase erst ab sechs Zügen; das erklärt
      das Fragezeichen der Karte.
- [ ] N632. **Spielstärke nur aus gewerteten Partien (R32):** Unter Spielen den Haken „Gewertete
      Partie“ abnehmen, als Gegner „Mensch (beide Seiten selbst)“ und wieder „Engine“ wählen: Der
      Haken bleibt aus (bisher sprang er wieder an). Eine ungewertete Partie gegen die Engine
      spielen und auswerten lassen: Die Karte „Deine Spielstärke“ ändert sich dadurch nicht; nur
      gewertete Partien zählen dort.

### Neu in 0.2.118: Werkzeuge und Strukturbegriffe (P3; Fable, 23.10.2026)

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

### Neu in 0.2.118: Trainer-Bedienung (P5; Opus, 23.10.2026)

- [ ] N710. **Taktiktrainer mit einem Motiv (R30):** Training › Taktik › Thema „Spieß“ › Runde
      starten, eine Aufgabe lösen oder „Lösung zeigen“. Die Frage „Welches Motiv war es?“ kommt
      nicht mehr, weil die Antwort feststeht. Bei „Alle Motive gemischt“ und „Mattbilder“ kommt
      sie weiterhin.
- [ ] N711. **Falle oder Köder ohne verräterische Zeichen (R31):** Training › Falle oder Köder ›
      Runde starten. Im Auftrag und auf dem Knopf „Nehmen: …“ steht der Zug ohne „+“, „#“, „!“
      oder „?“. Nach der Entscheidung zeigt die Auflösung den Zug wieder mit allen Zeichen.
- [ ] N712. **Studien: falscher Zug im Vergleich (R46):** Training › Studien lösen, Saavedra-Studie.
      Ziehe zuerst absichtlich falsch, etwa den König b6–b7. Rot erscheint dein Zug, gold der Zug
      der Studie (c6–c7), dazu „Nicht der Zug der Studie“. Nach etwa drei Sekunden sagt die
      Engine, wie viel schwächer dein Zug ist, und nennt beide Bewertungen aus Sicht von Weiß
      (Matt als „#5“). Bei Matt nennt sie keinen Abstand in Bauern. Danach c7 ziehen, es geht
      weiter wie bisher.
- [ ] N713. **Zug erraten: Bewertungsbalken (R45):** Training › Zug erraten › Morphys Opernpartie
      als Weiß › Runde starten. Links am Brett steht der Balken wie im Rückblick nach einer
      Partie. Nach jedem Zug rechnet er kurz neu (etwa eine Sekunde, nach einem verfehlten Zug
      erst nach dem Vergleich). Schon umgesetzt: Der Balken ist immer da, ohne Schalter;
      Widerspruch genügt, falls er dir beim Raten zu viel verrät.
- [ ] N714. **Zug erraten: Pfeile für den letzten Zug:** Rate einen Zug falsch (etwa 2. d4 statt
      2. Sf3). Gold erscheint der Partiezug, rot dein Zug, dazu „Gold der Partiezug, rot dein
      Zug.“ Darunter vergleicht die Engine beide Züge mit beiden Bewertungen. Bei einem Treffer
      zeigt nur der goldene Pfeil den Zug.
- [ ] N715. **Zug erraten: Hinweis-Knopf:** Tippe „Hinweis: Figur zeigen“. Ein goldenes Feld liegt
      unter der Figur, die in der Partie zieht. Ziehst du dann richtig, steht da „Getroffen, mit
      Hinweis: zählt nicht als Treffer.“ Schon umgesetzt: Ein Treffer mit Hinweis zählt als
      Versuch, aber nicht als Treffer (sonst wäre die Trefferzahl mit Hinweisen wertlos);
      Widerspruch genügt.
- [ ] N716. **Zug erraten: Kommentar nach Motiven und Fehlerarten:** Spiel die Opernpartie bis zum
      Schluss (Hinweise helfen). Bei 15. Lxd7+, 16. Db8+ und 17. Td8# steht unter dem Brett etwa
      „Im Partiezug Db8+ steckt: Ablenkung, Doppelangriff, Mattbild Grundreihenmatt.“ Weicht dein
      Zug als Fehler ab (ab „?!“ wie im Rückblick), nennt der Kommentar die Fehlerart, etwa
      „Dein Zug … lässt die Drohung … stehen“. Schon umgesetzt: Motive nennt die App nur, wenn
      die Folge Material gewinnt oder mattsetzt; die Motiverkennung ist für Taktikaufgaben
      gebaut und fände sonst in jedem ruhigen Zug etwas („2. Sf3: Abzug“). Widerspruch genügt.
- [ ] N717. **Zug erraten: Blättern:** Über den Knöpfen unter dem Brett stehen die gespielten Züge.
      Tippe einen Zug oder „Zum Anfang“, „zurück“, „vor“: Das Brett zeigt die frühere Stellung,
      der Balken bewertet sie, und ein Satz sagt, dass du zum Weiterraten ganz nach vorne
      blättern musst. „Zum Ende“ bringt dich zurück.
- [ ] N718. **Zug erraten: Analysemodus:** Tippe „Analysieren“ und ziehe frei für beide Seiten,
      etwa ein paar Züge, die du erwägst. Der Balken bewertet jede Stellung, „Zug zurück“ nimmt
      einen Analysezug zurück. „Analyse beenden“ stellt die Partiestellung wieder her, dann legst
      du deinen Zug fest. Die Analysezüge zählen nicht.

### Neu in 0.2.118 und 0.2.119: englische Buchdaten (P6; Opus, 23.10.2026)

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

### Neu in 0.2.125: Zugwahl der Bots und eigene Wertung je Zeitklasse (Fable, Nacht zum 24.10.2026)

Die Bots wählen ihre Züge jetzt mit einem Modell, das an 180 000 Stellungen echter
Lichess-Partien gelernt hat, welchen Zug Menschen einer Wertung wählen (Fehlerraten je Band, Phase
und Fehlerart treffen die echten auf etwa einen Prozentpunkt). Die Spielstärke ist eine eigene
Wertung je Zeitklasse (Blitz, Schnellschach, Klassisch) am Maßstab von Lichess, geschätzt aus den
Kennzahlen deiner Züge bis zur Entscheidung; der Schalter „Genauigkeit wie“ ist weg. Die Zahlen
der Bots (Gegnerwahl) sind noch nicht neu gemessen; das folgt.

- [ ] N770. **Bots spielen menschlich:** Spiele je eine Schnellschach-Partie gegen einen Bot um
      800 und einen um 1600. Wirken die Fehler wie die von Menschen dieser Stärke (Hänger und
      übersehene Drohungen unten, kleine Ungenauigkeiten oben), ohne Zufallszüge ohne Sinn?
- [ ] N771. **Spielstärke in der Auswertung:** Nach der Partie zeigt die Karte „Spielstärke“ die
      Genauigkeit (ohne Schalter) und „etwa 1400 (1100–1700)“. Hinter dem Fragezeichen steht,
      für welche Zeitklasse die Zahl gilt und was sie etwa auf chess.com (Blitz, Schnellschach)
      oder beim Weltschachbund (Klassisch) entspricht. Passt die Zahl grob zu dir?
- [ ] N772. **Zahl je Phase nur bei schmaler Spanne:** In der Karte „Spielstärke“ stehen je Phase
      Urteil und Genauigkeit, aber keine Zahl mehr (eine einzelne Partie streut je Phase zu stark,
      im Endspiel am meisten). Vermisst du die Zahl je Phase, oder ist Urteil plus Genauigkeit
      genug?
- [ ] N773. **Deine Spielstärke je Zeitklasse:** Spielen › Karte „Deine Spielstärke“ zeigt je
      Zeitklasse, in der du gewertete Partien hast, eine Zeile („Schnellschach: etwa 1400“, darunter
      Spanne und Zahl der Partien). Nach einer Blitzpartie (unter 8 Minuten geschätzte Dauer,
      Grundzeit plus 40 Sekunden je Sekunde Zuschlag) kommt eine zweite Zeile dazu.
- [ ] N774. **Alte Partien:** Deine vor 0.2.125 gespeicherten Partien bekommen die neue Zahl
      ohne Neuauswertung (dieselben Engine-Werte, neue Rechnung). Liegt sie nahe bei der alten
      Zahl (eine gewisse Verschiebung ist richtig: die alte Mitte aus chess.com und Lichess lag
      unter der Lichess-Zahl)?
- [ ] N775. **Bedenkzeit nach Zeitklassen (R51):** Spielen › Bedenkzeit zeigt „Blitz 3 + 0,
      3 + 2, 5 + 3 · Schnellschach 10 + 0, 15 + 10 · Klassisch 30 + 20, 60 + 0“; „Ohne Uhr“ gibt
      es nur noch, wenn du aus einer Abbildung oder aufgebauten Stellung spielst (ungewertet).
      Kein Bullet. Hattest du „Ohne Uhr“ gespeichert, startet die nächste Partie aus der
      Grundstellung mit 10 + 0.
- [ ] N776. **Stern je Zeitklasse (R51):** Besiege einen Bot gewertet mit Blitz-Uhr. Sein Stern
      erscheint in der Gegnerwahl nur, solange eine Blitz-Bedenkzeit gewählt ist; mit 10 + 0
      fehlt er (und der Zähler „★ 1/8“ an der Gruppe zählt ebenfalls je Zeitklasse). Alte Siege
      ohne Uhr zählen als Schnellschach.
- [ ] N777. **Bedenkzeit in der Partienliste (R51):** Jede Zeile zeigt hinter den Zügen die
      Bedenkzeit („… · 10 + 0 · du etwa 1400“), alte Partien „ohne Uhr“.
- [ ] N778. **Uhrverbrauch der Bots je Zeitklasse:** Spiele eine Partie mit 3 + 2 und eine mit
      30 + 20 gegen denselben Bot. Im Blitz soll der Bot seine Zeit ähnlich wie du verbrauchen
      (nach 20 Zügen noch etwa die Hälfte), im Klassischen deutlich sparsamer; vorher verbrauchte
      er im Klassischen seine Zeit etwa doppelt so schnell wie Menschen.
- [ ] N779. **Partiekopf (dein Wunsch vom 24.10.):** In der Partie steht oben nur noch „gegen
      Johanna“ (kein Umbruch mehr); darunter linksbündig ihr Porträt, daneben ihr Satz aus der
      Gegnerwahl, klein darunter „Johanna (⌀ 4 · Anfänger) · du spielst Weiß“.
- [ ] N780. **Zonen in „Deine Züge“ (dein Wunsch vom 24.10.):** Die graue Zone „normal“ ist je
      Zeile verschieden breit: Sie reicht so weit, wie 90 % der Lichess-Spieler deiner Stärke in
      dieser Zeitklasse liegen, bei kurzen Partien breiter (Zufall weniger Züge). Üblich ist der
      Median dieser Spieler. Brillant, stark und Buchzug bleiben geschätzt (Zone 75 bis 125 %),
      weil die Lichess-Daten diese Klassen nicht kennen. Wirkt das Urteil „normal / gut / schwach“
      jetzt stimmig?
- [ ] N781. **Startbild bei der Rückkehr (dein Wunsch vom 24.10.):** Handy: App in den Hintergrund,
      nach mindestens 30 Minuten zurück → der goldene Springer läuft 1,8 s (ein Tipp überspringt).
      Nach 5 Minuten nicht. Am Rechner nie (Fensterwechsel). Hinweis: iOS wirft eine
      Hintergrund-App manchmal ganz aus dem Speicher; dann startet sie neu und zeigt das normale
      Startbild (2,5 s).
- [ ] N783. **Beta-Hinweis:** Einstellungen › Über die App zeigt „App-Version: 0.2.125 (Beta)“ und
      darunter den Satz, dass die App laufend erweitert wird und Daten erhalten bleiben; die
      Startseite der Website zeigt unter dem Untertitel denselben Hinweis.
- [ ] N782. **Bots mit Stil und menschlichen Vorlieben:** Spiele gegen Tom (Draufgänger,
      Damenfan) und gegen Rolf (Verteidiger, vorsichtig). Tom sollte die Dame früh holen und
      vorwärts stürmen, Rolf eher zurückhaltend ziehen und wenig schlagen. Die Vorlieben halten
      sich jetzt im Rahmen echter Spieler seiner Stärke (Stufen auf den Quantilen der
      Lichess-Spieler); ist der Charakter trotzdem erkennbar?
- [ ] N784. **Website, Texte zum Buchstand (dein Abgleich vom 24.10.):** Startseite
      schach-von-grund-auf.com: Der Buchtext nennt „Eröffnungsgrundsätze und klassische
      Eröffnungssysteme, Gambits und Fallen“; der Trainingsabsatz spricht von Übungen, „auf die der
      Kasten ‚Training zu diesem Kapitel‘ im Buch verweist“; der Installationsabsatz sagt
      „kostenlos, zeigt keine Werbung und braucht keine Anmeldung“. Derselbe Installationstext
      steht auf /installieren/ und passt dort.
- [ ] N785. **Website, Trainingsseiten:** /training/ beginnt mit „findest du hier die Übungen,
      auf die der Kasten … verweist“ und „Deshalb stehen sie hier statt im Buch“. Eine Kapitelseite
      (etwa /training/kap09/) hat in der Einleitung keinen Strichpunkt mehr („… auf das Buch. Ein
      Tipp auf eine Abbildung …“). /training/werkzeugkasten/ beginnt mit „Alles Digitale, was du zum
      Üben mit dem Buch brauchst“, nennt „Trainingsseiten“ (nicht „Trainingskästen“) und verweist
      auf Kapitel 12 des Buches mit Merkseite und Kopiervorlage auf der letzten Seite.
- [ ] N786. **Website, Abbildungslinks:** Auf /training/kap09/ sind 9.3, 9.8, 9.15 und 9.28
      Links, auf /training/kap10/ 10.1, 10.9 und 10.14. Jeder öffnet die App an genau dieser
      Abbildung (Philidor, Lucena, Vancura, Dame gegen Bauer; Saavedra, Réti, Heuäcker).
- [ ] N787. **Website, Rechtstexte:** /impressum/ sagt unter „Quelltext und Rechte“ „(Texte und
      Abbildungen)“ und „geschützt. Alle Rechte vorbehalten.“; /impressum/ und /datenschutz/
      enthalten kein Semikolon mehr, Paragrafen und Angaben sind unverändert, der Stand der
      Datenschutzerklärung bleibt 19. Oktober 2026. In der App: Reiter Training, Fragezeichen am
      Kasten: „Die Übungen zum Kasten ‚Training zu diesem Kapitel‘ des Buches …“.
- [ ] N788. **Wertung je Zeitklasse:** Einstellungen › Deine Wertung. Spiele eine gewertete
      Blitz-Partie (3+2) zu Ende, wenn du bisher nur Schnellschach gespielt hast: Es erscheint eine
      Reiterzeile „Zeitklasse“ mit Blitz und Schnellschach. Blitz beginnt mit der Schätzung aus
      dieser Partie, die Schnellschach-Wertung bleibt, wie sie war. Die Zeile darunter nennt die
      Zeitklasse („Schnellschach: 12 gewertete Partien, im Ausschnitt +24“).
- [ ] N789. **Vorläufig:** In den ersten zehn Partien einer Zeitklasse steht unter der Zahl
      „Vorläufig: Die Wertung findet in den ersten zehn Partien ihren Platz (bisher 3)“. Ab der
      zehnten Partie verschwindet der Satz.
- [ ] N790. **Beide Zahlen nebeneinander:** Unter „Deine Wertung“ steht „Aus deinen Zügen: etwa
      1400 (1050 bis 1750, aus 3 Partien)“; unter Spielen › Deine Spielstärke steht je Zeitklasse
      „Aus deinen Ergebnissen: Wertung 1424 (vorläufig)“. Beide Zahlen dürfen voneinander
      abweichen (Ergebnisse gegen Zugqualität), aber dieselbe Zahl muss an beiden Orten gleich sein.
- [ ] N791. **Phasen-Ansicht der Kurve:** Reiter „Mittelspiel“ in „Deine Wertung“. Mit wenigen
      Partien steht „–“ und der Satz „noch zu wenige Partien in dieser Zeitklasse für eine Zahl“.
      Ab etwa zehn Schnellschach-Partien erscheint eine Zahl mit Spanne und eine Kurve; Eröffnung
      und Endspiel bleiben im Schnellschach vorerst ohne Zahl (Spanne zu breit), das ist gewollt.
- [ ] N792. **Schriftgröße (dein Wunsch vom 24.10.):** Einstellungen › Anzeige › Schriftgröße:
      „A+“ vergrößert in 10-%-Schritten bis 150 %, „A−“ verkleinert bis 80 %, „Standard“ setzt auf
      100 % zurück. Die Wahl gilt sofort, bleibt nach dem Neustart der App und wirkt auf Text,
      Stufenmarken und Plaketten; das Brett bleibt so breit wie der Bildschirm. Bitte bei 150 %
      Kapitelseite, Partie und Auswertung ansehen: Läuft irgendwo etwas aus dem Bild?
- [ ] N793. **Gruppenmodus, Freischaltung (dein Wunsch vom 24.10.):** Spielen › vorgefertigte Bots,
      eine Stufe aufklappen: Unter den acht Porträts steht „Gruppenmodus: Besiege alle Bots dieser
      Stufe …“. Besiege den letzten noch fehlenden Bot einer Stufe in einer gewerteten Partie (egal
      welche Zeitklasse): Nach dem Partieende erscheint einmal die Gratulation mit den Gesichtern der
      Stufe, „Weiter“ schließt sie, sie kommt nicht wieder. Unter den Porträts dieser Stufe steht
      jetzt der Knopf „Gruppenmodus · Stärke unbekannt“ mit den Gesichtern.
- [ ] N794. **Gruppenmodus, Partie:** Knopf antippen, Partie beginnen. Die Sprechblase und der Kopf
      der Partie zeigen die übereinandergelegten Gesichter statt eines Porträts und den Satz „Alle
      Bots der Stufe N spielen zugleich …“. Die Gruppe sollte spürbar stärker spielen als der beste
      Bot der Stufe (sie macht nur Fehler, die alle acht zugleich machen würden). Die Partienliste
      zeigt dieselben Gesichter.
- [ ] N795. **Gruppenmodus, Stärke:** Nach einem Sieg gegen die Gruppe bleibt vorerst „Stärke
      unbekannt“ stehen, weil die Gruppen noch nicht gemessen sind (das folgt nach dem endgültigen
      Bot-Satz). Die Wertung rechnet intern mit dem stärksten Bot der Stufe plus 150.

---

## Teil 2: Entscheiden

Bei den Wünschen der Arbeitsliste nimmt Claude zunächst die eigene Empfehlung und stellt sie dir
hier zur Prüfung („Schon umgesetzt, Widerspruch genügt“). Buchbefunde bleiben Rückfragen, weil
nur du das Buch änderst.

### P8 App-Tour (R52): Plan, schon umgesetzt, Widerspruch genügt (23.10.2026)

Dein Wunsch R52: ein kleines Toursymbol oben rechts, ein Hinweis beim ersten Start, ein Schalter
in den Einstellungen, eine kurze Haupttour und je Bildschirm eine ausführliche Tour, leicht
ergänzbar. So ist es geplant und (außer Spielen) umgesetzt. Die Texte gelten nach deiner Regel als
abgesegnet; lies sie, wenn du Zeit hast, am besten direkt in der App, und schreib Änderungen als
„P8-20: Schritt 3 anders: …“. Die Testpunkte stehen in Teil 1 (N760 bis N768).

- [ ] P8-1. **Das Symbol.** Oben rechts auf jedem Bildschirm, für den es eine Tour gibt, steht ein
      kleiner Kompass ohne Beschriftung (Bildschirmleser lesen „Tour zu diesem Bildschirm“). Ein
      Tipp startet die Tour genau dieses Bildschirms. Solange du eine Tour noch nicht gesehen
      hast, trägt das Symbol einen kleinen goldenen Punkt; danach ist es nur noch grau. Empfehlung:
      Kompass, weil das Fragezeichen schon für die Erklärungen hinter „?“ vergeben ist. Schon
      umgesetzt, Widerspruch genügt (etwa ein anderes Symbol oder ohne Punkt).
- [ ] P8-2. **Hinweis beim ersten Start.** Nach dem Startbild fragt die App einmal: „Kleiner
      Rundgang? Oben rechts zeigt dir das Kompass-Symbol auf jedem Bildschirm, wie er
      funktioniert. Möchtest du jetzt einen kurzen Rundgang durch die App?“ mit „Rundgang
      starten“ und „Später“. Die Frage kommt einmal je Gerät, auch für alle, die die App schon
      benutzen (die Touren sind neu). Öffnet jemand die App über einen Link zu einer Abbildung
      (Trainingsseiten der Website), kommt sie erst beim nächsten normalen Start. Schon umgesetzt,
      Widerspruch genügt.
- [ ] P8-3. **Schalter in den Einstellungen.** Zahnrad › Einstellungen › Reiter „Anzeige“:
      „Toursymbol: an / aus“ und der Knopf „Rundgang durch die App“. Mit „aus“ verschwindet das
      Symbol überall dauerhaft, und der Hinweis beim ersten Start entfällt; der Rundgang bleibt
      über den Knopf erreichbar. Schon umgesetzt, Widerspruch genügt.
- [ ] P8-4. **So sieht eine Tour aus.** Der Rest des Bildschirms wird abgedunkelt, das erklärte
      Element bleibt hell mit goldenem Rahmen und wird bei Bedarf in den sichtbaren Bereich
      gescrollt. Eine Karte unten (oder oben, wenn das Element unten liegt; im Querformat neben
      dem Element) zeigt den Text,
      „Schritt 3 von 9“, „Zurück“, „Weiter“ (am Ende „Fertig“) und ein Kreuz zum Beenden. Während
      der Tour lässt sich nichts anderes antippen, damit nichts aus Versehen passiert. Mit
      Tastatur: Tab wechselt zwischen den Knöpfen, Esc beendet, die Pfeiltasten blättern.
      Bildschirmleser lesen jeden Schritt vor. Bei „Bewegung reduzieren“ des Geräts gibt es keine
      Animation. Schon umgesetzt, Widerspruch genügt.
- [ ] P8-5. **Was gerade nicht da ist, wird übersprungen.** Eine Tour erklärt den Bildschirm so,
      wie er gerade ist: Hat eine Abbildung keine Zugfolge, entfällt der Schritt zur Zugleiste;
      ist noch kein Werkzeug gewählt, erklärt die Tour die Werkzeugkarte ohne Rahmen in der Mitte.
      In den Trainern startet die Tour meist auf der Auswahlseite und erklärt die Runde mit
      Schritten in der Mitte. Schon umgesetzt, Widerspruch genügt.
- [ ] P8-6. **Umfang.** 32 Touren: der Rundgang (Haupttour, acht Schritte), Buch, Kapitel,
      Abbildung (mit Werkzeugleiste und Werkzeugkarten), Übung, Training, alle 17 Trainer (mit
      30-Minuten-Plan und Fehlerdatenbank), Lernsammlung, Nachschlagen, Glossar, Begriff,
      Denkroutine, Gesamt-Checkliste, Steckbriefe, Werkzeuge des Buches und Einstellungen (mit
      allen fünf Reitern). Keine Tour bekommen die Lizenzen und deine Aufgabenseite (dort ist
      alles selbsterklärend). Spielen, Partie, Auswertung und Partienliste kommen als Teil B, wenn
      die Kalibrierung der Bots auf main ist (siehe P8-44). Schon umgesetzt, Widerspruch genügt.
- [ ] P8-7. **Technik, kurz.** Jede Tour ist eine Liste von Zeilen „Bildschirm, Ziel, Text“ in einer
      Datei (`app/src/tour/touren.ts`); die Ziele tragen eine feste Kennung (`data-tour="brett"`),
      die Texte stehen in de.json und en.json. Eine Tour ergänzen heißt also eine Zeile und einen
      Text hinzufügen. Ein Test meldet jede Zeile, deren Ziel es im Code nicht gibt, und jeden
      fehlenden Text. Gemerkt wird nur auf dem Gerät (angeboten, Symbol aus, gesehene Touren), nicht
      in der Datensicherung; ein neues Speicherformat gibt es nicht. Keine neue Bibliothek: etwa
      600 Zeilen eigener Code ohne die Tourdaten. Schon umgesetzt, Widerspruch genügt.
- [ ] P8-8. **Tourtexte auf Englisch** stehen gleich mit in en.json (wie alle Oberflächentexte).
      Schon umgesetzt, Widerspruch genügt.
- [ ] P8-9. **Rundgang auch aus dem Buch?** Der Buch-Bildschirm hat seine eigene Tour (Nummernfeld,
      Kapitel); den Rundgang durch alle Bereiche nennt ihr letzter Schritt und startet der Knopf in
      den Einstellungen. Empfehlung: so lassen, damit ein Tipp auf das Symbol immer genau den
      Bildschirm erklärt. Schon umgesetzt, Widerspruch genügt.
- [ ] P8-10. **Gesehen.** Eine Tour gilt als gesehen, sobald du sie bis zum Ende oder mit dem Kreuz
      verlassen hast; dann verschwindet der goldene Punkt an diesem Bildschirm. Schon umgesetzt,
      Widerspruch genügt.
- [ ] P8-11. **Gemeinsame Schritte aller Trainer** (außer 30-Minuten-Plan und Fehlerdatenbank):
      vorn „Hier steht in einem Satz, wie dieser Trainer abläuft.“, hinten „In der Runde steht
      oben, die wievielte Aufgabe dran ist und wie viele du richtig hast. Nach jeder Antwort geht
      es mit „Weiter“ zur nächsten.“, „Nach einer Antwort legt „In die Lernsammlung“ die Stellung
      mit einem Plan-Satz zu deinen eigenen Stellungen (Bereich Training).“ und „Am Ende siehst du
      Ergebnis und Zeit. Jede Runde zählt als Durchgang im Fortschritt des Kapitels.“ Dazwischen
      stehen die eigenen Schritte des Trainers (P8-18 bis P8-34).

Die Texte je Tour (in Klammern die Schritte):

- [ ] P8-12. **Tour Rundgang durch die App.** (1) Willkommen bei „Schach von Grund auf“! Dieser
      kurze Rundgang zeigt dir, wo du was findest. Mit „Weiter“ geht es los, mit dem Kreuz hörst du
      jederzeit auf. (2) Buch: jede Abbildung des Buches als lebendiges Brett, mit den Werkzeugen
      des Buches. Tippe die Nummer aus dem Buch ein oder öffne ein Kapitel. (3) Training: fällige
      Wiederholungen, deine Lernsammlung und zu jedem Kapitel die Trainer aus dem Buch. (4) Spielen:
      Partien gegen Bots auf zehn Stufen oder gegen einen Menschen am selben Gerät, danach eine
      Auswertung deiner Partie. (5) Nachschlagen: Glossar, Denkroutine, Gesamt-Checkliste,
      Steckbriefe der Eröffnungen und alle Werkzeuge des Buches. (6) Das Zahnrad: deine Wertung und
      dein Fortschritt, Brett, Figuren und Anzeige, dazu die Datensicherung. (7) Dieses Symbol steht
      oben rechts auf jedem Bildschirm, für den es eine Tour gibt. Ein Tipp erklärt genau diesen
      Bildschirm. Ausschalten kannst du es in den Einstellungen unter „Anzeige“. (8) Viel Freude!
      Öffne am besten eine Abbildung aus Kapitel 1 und tippe dort auf das Toursymbol: Die Abbildung
      ist das Herzstück der App.
- [ ] P8-13. **Tour Buch.** (1) Tippe die Nummer einer Abbildung aus dem Buch ein, etwa 1.26, und
      öffne sie. Bei einem Tippfehler schlägt die App passende Nummern vor. (2) Ein Tipp bringt dich
      zur zuletzt geöffneten Abbildung zurück. (3) Die Kapitel des Buches. Der goldene Ring um die
      Nummer zeigt, wie viele Abbildungen du schon angesehen hast. Ein Tipp öffnet das Kapitel mit
      allen Abbildungen, Trainern und Übungen. (4) Den Rundgang durch alle Bereiche findest du
      jederzeit in den Einstellungen unter „Anzeige“.
- [ ] P8-14. **Tour Kapitel.** (1) Dein Stand in diesem Kapitel: angesehene Abbildungen, gelöste
      Übungen, beantwortete Warum-Fragen, abgehakte Lernziele und deine Trainer-Durchgänge. (2) Die
      Trainer zu diesem Kapitel. Das Fragezeichen erklärt den Ablauf, „Trainieren“ startet. (3) Die
      Übungen aus dem Buch. „Übungen lösen“ geht alle der Reihe nach durch, die offenen zuerst.
      Gelöste Übungen kommen später zur Wiederholung. (4) Alle Abbildungen als kleine Bretter, nach
      Abschnitten. Ein Tipp auf einen Abschnitt klappt ihn auf, ein Tipp auf ein Brett öffnet die
      Abbildung. Ein Zeichen oben rechts am Brett zeigt Warum-Fragen an. (5) Eine Abbildung gilt als
      angesehen, wenn sie 30 Sekunden am Stück zu sehen war. Hier hakst du alle von Hand ab oder
      setzt sie zurück; jeder Abschnitt hat dafür auch einen eigenen Knopf.
- [ ] P8-15. **Tour Abbildung.** (1) Die Nummer wie im Buch. Ein Tipp darauf öffnet ein Feld, mit
      dem du zu jeder anderen Abbildung springst. (2) Vorige und nächste Abbildung im selben
      Kapitel. (3) Diese Abbildung hat eine Zugfolge. Tippe einen Zug an, um die Stellung danach zu
      sehen, oder blättere mit den Knöpfen darunter Halbzug für Halbzug. Abzweigungen stehen unter
      „Andere Züge hier“. (4) Das Brett zeigt Pfeile und Felder wie im Buch. Du kannst jederzeit
      selbst weiterziehen: Figur antippen und Zielfeld tippen oder die Figur wischen. „Zurück zur
      Buchvariante“ führt wieder zum Buch. (5) Die Werkzeuge für jede Phase: Zählen (ein Feld
      antippen, Angreifer und Verteidiger zählen), Ziehen, Engine, Röntgen und Warnsignale, sobald
      das Buch sie eingeführt hat. Ein zweiter Tipp schaltet ein Werkzeug wieder aus, ebenso ein
      Tipp neben das Brett. (6) Dreht das Brett, damit Schwarz unten steht. (7) Das Lesezeichen legt
      die gezeigte Stellung mit einem Plan-Satz und einer Notiz in deine Lernsammlung. (8) Erst
      selbst denken: Schätze die Stellung ein, bevor Werkzeuge und Engine helfen. Ob das hier
      verlangt wird, stellst du in den Einstellungen unter „Training“ ein. (9) Die Verfahren des
      Buches als Bündel, etwa „Eröffnung prüfen“ oder „Planfindung“. Es stehen die Bündel bis zu
      diesem Kapitel da; „frühere“ und „spätere“ am Rand zeigen weitere, spätere als Vorschau. Die
      Reihe lässt sich seitlich schieben. (10) Die Teile des gewählten Bündels. Jeder Reiter zeigt
      ein Werkzeug, mit seinem Ergebnis am Brett und in der Karte darunter. (11) Die Karte eines
      Werkzeugs zeigt Befunde und Fazit, darüber die Legende der Markierungen am Brett. „Sicht“ oben
      rechts rechnet für die andere Seite. „So prüft die App“ nennt die Regel des Buches. Werkzeuge
      können irren; maßgeblich ist das Buch. (12) Warum-Fragen zur Stellung oder zum nächsten Zug,
      mit Antwortauswahl. Sie erscheinen, sobald du die Abbildung 30 Sekunden angesehen hast. (13)
      Spiel die gezeigte Stellung gegen die Engine zu Ende. (14) Die Bildunterschrift wie im Buch,
      darunter die Fundstelle. Antippbare Nummern öffnen die genannte Abbildung.
- [ ] P8-16. **Tour Übung.** (1) Die Aufgabe steht im Buch, hier löst du sie. Bei Zugaufgaben ziehst
      du auf dem Brett, die App antwortet mit den Zügen der Gegenseite aus der Lösung. (2) Erst
      selbst denken: Hinweise und Lösung erscheinen, wenn du nachgedacht hast. Danach helfen
      gestufte Hinweise (Motiv, Figur, Zug), oder du lässt dir die Lösung zeigen. (3) Übungen im
      Kopf schätzt du nach der Erklärung selbst ein. Danach kommt die Übung in wachsenden Abständen
      zur Wiederholung, nach 1, 3, 7, 16 und 35 Tagen. (4) „Nächste Übung“ führt weiter durch die
      Übungen des Kapitels.
- [ ] P8-17. **Tour Training.** (1) Übungen und Trainer-Aufgaben, die zur Wiederholung fällig sind.
      Sie kommen in wachsenden Abständen wieder, bis sie sitzen. (2) Deine Lernsammlung: eigene
      Stellungen mit Plan, nach Eröffnung geordnet, zum Abfragen. (3) Die Übungen aus dem Kasten
      „Training zu diesem Kapitel“ des Buches auf der Website, mit Links zu Lichess. Die Seiten
      gehen auch offline. (4) Zu jedem Kapitel seine Trainer. Der Kopf mit der Nummer öffnet das
      Kapitel, das Fragezeichen erklärt den Ablauf, „Trainieren“ startet. Im Trainer zeigt das
      Toursymbol, wie er funktioniert.
- [ ] P8-18. **Tour Trainer „Koordinaten, Notation, Gangarten“.** (1) Vier Übungsarten: Feld finden
      (auf Zeit, ohne Koordinaten am Rand, erst mit Weiß, dann mit Schwarz unten), Zug aufschreiben,
      Zug ausführen (auch Rochade, en passant, Umwandlung) und Gangarten. (2) Notation wie im Buch:
      K, D, T, L, S für König, Dame, Turm, Läufer und Springer, Bauernzüge ohne Buchstaben, „x“ für
      Schlagen, 0-0 und 0-0-0 für die Rochade.
- [ ] P8-19. **Tour Trainer „Schach-Röntgen-Trainer“.** (1) Drei Schritte wie die
      Schach-Röntgen-Regel aus Kapitel 1: deine Schachs, deine Schläge, dann was der Gegner hätte,
      wenn er am Zug wäre. (2) Tippe eine Figur und dann ihr Zielfeld: So entsteht ein Pfeil.
      Derselbe Zug noch einmal nimmt ihn weg. Gibt es nichts, tippe gleich auf „Prüfen“. Gold heißt
      gefunden, Rot übersehen, Grau gehört nicht dazu.
- [ ] P8-20. **Tour Trainer „Zähltrainer“.** (1) Zwei Übungsarten: Bilanz zählen an einem Feld und
      hängende Figuren finden auf Zeit. (2) Bilanz zählen: Zähle Angreifer und Verteidiger des
      Feldes und schätze, was das Schlagen in Bauerneinheiten bringt (Bauer 1, Springer und Läufer
      3, Turm 5, Dame 9). Die App rechnet zum Vergleich den ganzen Abtausch vor.
- [ ] P8-21. **Tour Trainer „Repertoire-Trainer“.** (1) Wähle eine Eröffnung aus Kapitel 2 und deine
      Seite. (2) Zieh die Züge des Buches, die App spielt die Gegenseite. Ein falscher Zug zeigt den
      Zug des Buches. An Schlüsselzügen fragt die App, warum er gespielt wird.
- [ ] P8-22. **Tour Trainer „Zielbilanz-Übung“.** (1) Für beide Seiten je drei Ziele: Zentrum,
      Entwicklung, Königssicherheit. Wähle ja, teils oder nein; „Prüfen“ vergleicht mit der Prüfung
      der App und erklärt Unterschiede.
- [ ] P8-23. **Tour Trainer „Abweichungsmodus“.** (1) Wähle eine Eröffnung aus Kapitel 2 und deine
      Seite. (2) Die Engine verlässt die Buchvariante. Antworte nach den Prinzipien aus Kapitel 2
      und 3: Zentrum, Entwicklung, Königssicherheit. Danach zeigt die App, wie die Engine deinen Zug
      einschätzt.
- [ ] P8-24. **Tour Trainer „Faktorenbilanz-Trainer“.** (1) Stell die Waagen für Material und Zeit
      ein und sag, wer bei Königssicherheit und Aktivität besser steht. Danach vergleicht die App
      mit ihrer Faktorenbilanz aus Kapitel 3.
- [ ] P8-25. **Tour Trainer „Falle oder Köder“.** (1) Wähle eine Stufe von 1 (leicht) bis 5 (schwer)
      oder alle. Die Stufen sind an echten Lösungsversuchen auf Lichess geeicht. (2) Falsch gelöste
      Aufgaben kommen später zur Wiederholung. Ist eine fällig, startet dieser Knopf eine Runde nur
      damit. (3) Der rote Pfeil zeigt den letzten Zug des Gegners. Entscheide, ob du das Material
      nimmst. Danach zeigt die App die Widerlegung und welche Warnsignale aus Kapitel 4 dich gewarnt
      hätten.
- [ ] P8-26. **Tour Trainer „Strukturerkenner“.** (1) Stufe 1 ist leicht, Stufe 5 schwer: Je mehr
      Bauernmerkmale und Figuren, desto mehr ist zu überblicken. (2) Falsch gelöste Aufgaben kommen
      später zur Wiederholung. Ist eine fällig, startet dieser Knopf eine Runde nur damit. (3)
      Schritt für Schritt: starke Felder antippen, schwache Bauern antippen, die Feldart des
      goldenen Feldes benennen, dann den passenden Plan-Satz wählen. „Nur das Skelett zeigen“
      blendet die Figuren aus.
- [ ] P8-27. **Tour Trainer „Planbilanz-Übung“.** (1) Drei Übungsarten: die drei Planfragen, LAP
      (die am wenigsten aktive Figur) und das Wettrennen der Bauern. (2) Planfragen: je Frage eine
      Antwort wählen, danach die Musterlösung. LAP: erst die Figur antippen, dann ihr Zielfeld.
      Wettrennen: bei entgegengesetzten Rochaden die Züge bis zum ersten Hebel zählen.
- [ ] P8-28. **Tour Trainer „Taktiktrainer“.** (1) Wähle ein Motiv oder „gemischt“ und eine Stufe
      von 1 bis 5. Die Stufen sind an echten Lösungsversuchen auf Lichess geeicht. (2) Falsch
      gelöste Aufgaben kommen später zur Wiederholung. Ist eine fällig, startet dieser Knopf eine
      Runde nur damit. (3) Zieh die Lösung auf dem Brett. Findest du nichts, helfen die Hilfen
      Schritt für Schritt: Warnsignal, Motiv, Schlüsselfigur, Lösung. Richtig zählt eine Aufgabe
      ohne falschen Zug und ohne Hilfe. (4) Nach der Lösung benennst du das Motiv. Das schult den
      Blick für das nächste Mal.
- [ ] P8-29. **Tour Trainer „Endspieltrainer“.** (1) Wähle, was du üben willst (Mattführung,
      Bauern-, Turm-, Damenendspiele, Leichtfiguren oder alles gemischt), und eine Stufe. (2) Falsch
      gelöste Aufgaben kommen später zur Wiederholung. Ist eine fällig, startet dieser Knopf eine
      Runde nur damit. (3) Darunter stehen Kurzübungen ohne Engine, etwa der Zug ins Quadrat oder
      der Zug zur Opposition. (4) In der Runde spielst du gegen die Engine, bis das Ziel erreicht
      ist: gewinnen oder Remis halten. Hilfen: Merksatz, Figur, Zug.
- [ ] P8-30. **Tour Trainer „Studien lösen“.** (1) Du ziehst, die App antwortet mit dem Gegenzug aus
      dem Buch. Ein falscher Zug zeigt den Zug der Lösung als Pfeil, und die Engine zeigt, warum
      dein Zug nicht reicht.
- [ ] P8-31. **Tour Trainer „Zug erraten“.** (1) Wähle eine Meisterpartie aus Kapitel 11 und eine
      Seite, am besten die des Siegers. (2) Zieh deinen Zug, die App deckt den Partiezug auf: Gold
      der Partiezug, Rot deiner. Weicht er ab, überleg kurz, warum der Meister anders zog. (3) Über
      den Knöpfen blätterst du durch die gespielten Züge. „Analysieren“ lässt dich frei Varianten
      ausprobieren, bevor du dich festlegst. „Hinweis: Figur zeigen“ markiert die Figur, die zieht;
      ein Treffer mit Hinweis zählt nicht.
- [ ] P8-32. **Tour Trainer „30-Minuten-Plan“.** (1) Tag A ist Partietag, Tag B Studientag, im
      Wechsel. Die App schlägt den Tag vor, der dran ist, und zeigt den Plan mit Zeit, Aktivität und
      Ziel. (2) Während der Einheit stehen oben Schritt und Restzeit. Die Zeit ist ein Richtwert und
      läuft weiter; „Schritt erledigt“ führt zum nächsten. Eine fertige Einheit zählt im
      Fortschritt.
- [ ] P8-33. **Tour Trainer „Fehlerdatenbank“.** (1) Die Auswertung zählt deine Fehler je Fehlerart
      über die Wochen und schlägt den passenden Trainer vor. (2) Am einfachsten trägst du Fehler im
      Rückblick einer Partie ein. Hier geht es auch mit einer Stellung als FEN, einem Satz und einer
      Fehlerart aus der Gesamt-Checkliste. (3) Deine Einträge mit Stellung. Hier kannst du sie
      ansehen und löschen.
- [ ] P8-34. **Tour Trainer „Denkroutine-Trainer“.** (1) Eine feste Minute nur schauen. Dann gibst
      du zwei Kandidatenzüge und zu jedem die stärkste Antwort des Gegners ein. Die App prüft, ob zu
      jedem Kandidaten eine Antwort dasteht, und vergleicht mit der Engine.
- [ ] P8-35. **Tour Lernsammlung.** (1) Hier liegen deine eigenen Stellungen mit Plan-Satz und
      Notiz. Du sammelst sie mit dem Lesezeichen an jeder Abbildung, im Rückblick einer Partie und
      nach Trainer-Aufgaben. (2) Abfragen: Die App zeigt eine Stellung, du überlegst deinen Plan und
      deckst dann auf. Regelmäßig gemacht, sitzen die Pläne in der Partie. (3) Die Stellungen nach
      Eröffnung geordnet; jede Gruppe lässt sich einzeln abfragen. (4) Als PGN kopieren oder teilen:
      So wird aus der Sammlung eine Lichess-Studie, jede Stellung ein Kapitel mit Plan und Notiz.
      (5) Eine Stellung von woanders, etwa aus einer Vereinspartie: FEN einfügen, Plan und Notiz
      schreiben, speichern.
- [ ] P8-36. **Tour Nachschlagen.** (1) Das Glossar aus dem Anhang des Buches, mit Suche und
      Querverweisen. (2) Die Denkroutine: vier Schritte vor jedem Zug und die Werkzeuge je
      Partiephase. (3) Die Gesamt-Checkliste: was du nach jedem Kapitel können solltest, zum
      Abhaken. (4) Die Steckbriefe der Eröffnungen und die Fallenchecks des Buches. (5) Alle
      Werkzeuge des Buches nach Kapiteln: was jedes prüft und nach welcher Regel.
- [ ] P8-37. **Tour Glossar.** (1) Tippe einen Begriff oder einen Teil davon; die Liste zeigt sofort
      passende Einträge. (2) Ein Tipp auf einen Buchstaben springt zu den Begriffen mit diesem
      Anfang. (3) Ein Tipp auf einen Begriff öffnet seine Erklärung mit Verweisen auf verwandte
      Begriffe.
- [ ] P8-38. **Tour Begriff.** (1) Die Erklärung aus dem Anhang des Buches. Unter „Siehe auch“
      führen die Knöpfe zu verwandten Begriffen; Zurück bringt dich zur Liste.
- [ ] P8-39. **Tour Denkroutine.** (1) Die vier Schritte vor jedem Zug, wie im Buch. Der
      Sicherheitsblick vor dem Ziehen gehört dazu. (2) Je Partiephase die Werkzeuge, die du dort
      brauchst. Ein Tipp klappt eine Phase auf.
- [ ] P8-40. **Tour Gesamt-Checkliste.** (1) Wie viele Punkte du schon abgehakt hast. Die Haken
      bleiben auf diesem Gerät und ziehen mit der Datensicherung um. (2) Je Kapitel eine Karte mit
      der Kernfrage. Ein Tipp klappt sie auf: Lernziele zum Abhaken, das Werkzeug des Kapitels und
      der Weg zum Kapitel.
- [ ] P8-41. **Tour Steckbriefe.** (1) Die Steckbriefe der Eröffnungen aus Kapitel 2. Ein Tipp
      öffnet einen Eintrag, der Knopf darunter führt zur Abbildung im Buch. (2) Die Fallenchecks aus
      Kapitel 4: wo die Falle steht und woran du sie erkennst.
- [ ] P8-42. **Tour Werkzeuge des Buches.** (1) Die Werkzeuge in der Reihenfolge des Buches, je
      Kapitel eine Karte. Ein Tipp auf einen Namen zeigt, was das Werkzeug zeigt und nach welcher
      Regel es rechnet.
- [ ] P8-43. **Tour Einstellungen.** (1) Deine Wertung aus den gewerteten Partien, mit Verlauf. Die
      Reiter zeigen statt der Wertung die Schätzung je Partiephase; der Ausschnitt wählt die letzten
      Partien oder einen Zeitraum. (2) Dein Fortschritt im ganzen Buch und je Kapitel. Ein Tipp auf
      ein Kapitel öffnet es. (3) Brett: Farben und Holz, Koordinaten, Ziehen per Wischen,
      Zuganimation und Startbild. (4) Figuren: der Figurensatz, mit Vorschau auf deinem Brett. (5)
      Anzeige: Nachtmodus, ausgeblendete Erklärungen wieder zeigen, Sprache, das Toursymbol und der
      Rundgang durch die App. (6) Ton: Zuggeräusche an oder aus. (7) Training: wie streng „Erst
      selbst denken“ ist und ob es auch vor Werkzeugen und Engine an den Abbildungen gilt. (8) Deine
      Daten liegen nur auf diesem Gerät. Sichere sie ab und zu als Datei; mit ihr ziehst du auch auf
      ein anderes Gerät um. (9) App-Version, Datenstand und ob die App offline bereit ist. „Fehler
      melden“ kopiert diese Angaben, damit du sie mitschicken kannst.

- [ ] P8-44. **Teil B: Spielen (nach der Kalibrierung, noch nicht umgesetzt).** Geplante Touren:
      **Spielen** (Art des Gegners mit den drei Kacheln eigene Stufe, Bots und eigene Bots; das
      Porträtgitter mit Elo-Zahl und Sprechblase; Farbe; Zeitklasse und Abzeichen; Eröffnung
      vorgeben; Stellung aufbauen; Spielhilfen; „Gewertete Partie“; „Partie beginnen“; die Karte
      „Deine Spielstärke“; die Partienliste mit Filtern, Sortierung, Löschen und „Partie einlesen
      (PGN)“), **Partie** (Zugliste, die beiden Uhren, ruhige Ansicht mit dem Auge, Werkzeuge am
      Brett und Bündel, der Knopf „Engine“, Rücknahme, Remis und Aufgeben) und **Auswertung und
      Rückblick** (Fortschrittsbalken, Verlaufskurve, erste klare Abweichung, grobe Patzer, Fehler
      der Engine, Spielstärke und Genauigkeit, Bewertungsbalken und Karte zum Zug im Rückblick, „In
      die Fehlerdatenbank“ und „In die Lernsammlung“, PGN). Die Texte schreibt Claude erst, wenn
      die Kalibrierung auf main ist, weil sich Gegnerwahl, Zeitklassen und Partienliste gerade
      ändern. Sag einfach Bescheid, wenn es so weit ist.

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

### R57 Dashboard: Einrichtung und Empfehlungen (24.10.2026)

- [ ] DB1. **Prüfbericht-Schlüssel (nach dem Ausrollen):** Eine lange Zufallszeichenfolge
      erzeugen (etwa im Passwortmanager „Passwort erzeugen“, 40 Zeichen, nur Buchstaben und
      Ziffern). Sie zweimal eintragen, nirgends sonst hinschreiben und nicht in den Chat:
      1. GitHub: Repository SvGa_Public › Settings › Secrets and variables › Actions › „New
         repository secret“, Name `BERICHT_SCHLUESSEL`.
      2. Cloudflare: Workers & Pages › schach-von-grund-auf › Settings › „Variables and Secrets“
         › „Add“, Typ „Secret“, Name `BERICHT_SCHLUESSEL`. (Das Feld ist erst frei, wenn die
         Version mit dem Dashboard ausgerollt ist.)
      Danach kommen die Prüfberichte im Dashboard an; vorher stehen sie nur auf GitHub.
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

### P1 Spielen und Auswertung: schon umgesetzt, Widerspruch genügt (24.10.2026 nachts)

- [ ] P1-A. **Gewertet ohne gewählte Uhr (R51):** Gewertete Partien haben jetzt immer eine Uhr.
      Empfehlung: Wer „Ohne Uhr“ gewählt hatte und gewertet spielt, beginnt mit 10 + 0
      (Schnellschach, wie der Partietag des 30-Minuten-Plans). Schon umgesetzt in 0.2.123,
      Widerspruch genügt (etwa „15 + 10“ als Vorgabe).
- [ ] P1-B. **Vergleich der Zugklassen (R56):** Die „üblichen“ Anteile je Zugart sind vorerst
      geschätzt (eine Tabelle für 800, 1200, 1600 und 2000), „normal“ heißt 75 % bis 125 % des
      Üblichen. Verglichen wird mit deiner Spielstärke aus den letzten zehn gewerteten Partien
      (sonst mit der Schätzung dieser Partie), beim Bot mit seiner festen Zahl. Empfehlung: so
      lassen, bis der Bot-Chat echte Werte je Elo und Zeitklasse aus den Lichess-Partien liefert;
      dann kommen auch die Zonengrenzen aus der Streuung der Spieler. Schon umgesetzt in 0.2.122.
- [ ] P1-C. **Umschalter auf der Seite des Bots:** Steht der Umschalter auf dem Bot, zeigt die
      Auswertung statt „Fehler und Patzer“ die eingeklappte Liste „Absichtliche Fehler der Engine“
      und keinen Satz zur ersten Abweichung (der betrifft nur deine Züge). Schon umgesetzt in
      0.2.122, Widerspruch genügt.
- [ ] P1-D. **Fortsetzung einer festgelegten Eröffnung (R24):** Die Familie der gewählten Eröffnung
      liest die App an der letzten Stellung ihrer Hauptlinie im Buch ab, die die Lichess-Liste
      kennt (dort heißt sie zum Beispiel „Ruy Lopez“ für die Spanische Partie). Gibt es keinen
      Zug derselben Familie mehr, spielt der Bot wieder frei. Schon umgesetzt in 0.2.123.

### P2 Brett und Bedienung: schon umgesetzt, Widerspruch genügt (23.10.2026)

- [ ] P2-B. **Ab wann eine Spalte? (R40, N656)** Die App wechselte schon live mit der
      Fenstergröße, aber erst, wenn das Fenster schmaler als hoch war; am Rechner wurde es vorher
      eng. Empfehlung: zwei Spalten (Brett links, Text rechts) erst ab einem Seitenverhältnis von
      5 : 4, darunter eine Spalte mit dem Brett oben. Handy und Tablet quer bleiben zweispaltig.
      Schon umgesetzt, Widerspruch genügt (etwa eine andere Grenze). Falls du etwas anderes
      gemeint hast (etwa Safari am Mac, das gar nicht wechselt), schreib bitte kurz, in welchem
      Browser.

### Eigene Wertung je Zeitklasse (Fable, 24.10.2026): schon umgesetzt, Widerspruch genügt

- [ ] E1. **Entzerrung statt Schätzung zur Mitte:** Ein Modell aus Kennzahlen schätzt Starke zu
      niedrig und Schwache zu hoch (bei zehn Partien etwa 2400 → 2250, 600 → 700), weil es bei
      Unsicherheit zur Mitte neigt. Empfehlung: Die Schätzung wird so entzerrt, dass Spieler jeder
      Wertung im Mittel ihre Lichess-Zahl bekommen; dafür wird die Spanne etwas breiter (bei einer
      Partie Schnellschach ±370 statt ±300, bei zehn ±165 statt ±155). Schon umgesetzt.
- [ ] E2. **Zahl je Phase nur bei schmaler Spanne:** Die Teilmodelle je Phase sind breit (bei zehn
      Partien Schnellschach: Mittelspiel ±370, Eröffnung ±530, Endspiel ±900, 90 % der Spieler).
      Empfehlung: Eine Zahl je Phase steht nur, wenn 90 % der Spieler höchstens ±350 danebenliegen;
      das ist derzeit nur im Mittelspiel ab etwa acht klassischen Partien der Fall. Sonst stehen
      Urteil und Genauigkeit je Phase (die sind verlässlich). Schon umgesetzt; Alternative wäre eine
      Zahl mit sehr breiter Spanne.
- [ ] E3. **Zeitklasse ohne Uhr:** Partien ohne Uhr zählen als Schnellschach (wie in der
      Zugwahl der Bots). Mit R51 (Teil F) fällt „ohne Uhr“ für gewertete Partien ohnehin weg.
      Schon umgesetzt.
- [ ] E4. **Umrechnung nach chessgoals.com:** Die Entsprechung auf chess.com und FIDE stammt aus
      dem Wertungsvergleich von chessgoals.com (Juli 2026, Selbstangaben aktiver Spieler;
      Lichess-Schnellschach 1680 ≈ chess.com Schnellschach 1340, Lichess Klassisch 2120 ≈ FIDE
      1965; FIDE erst ab 1730 Lichess Klassisch). Übernommen sind nur die Zahlen (Fakten), mit
      Quellenangabe in der App und in docs/LIZENZEN.md. Schon umgesetzt.

### P4 Trainer-Inhalte (Fable, 23.10.2026): schon umgesetzt, nur bestätigen

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


