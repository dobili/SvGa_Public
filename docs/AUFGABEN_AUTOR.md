# Was noch zu tun ist (für den Autor)

Stand: 30.10.2026, Version 0.3.13 (Orden verstreut, Pfeile in den Werkzeugbildern, Tagesserie ohne Verfall; dein Prüfstand vom 30.10. ist eingearbeitet).
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
Einstellungen (Profil › Einstellungen, ganz unten) prüfen, dass „App-Version 0.3.13“ dasteht; sonst die App neu laden.

Reihenfolge nach Wichtigkeit: Teil 1 testen (neueste Nummern zuerst), dann Teil 2: oben „Nur
bestätigen“ mit einem Satz („alle ok außer …“), darunter die Entscheidungen. Alle
Nummern gelten für die aktuelle Version; frühere Versionen musst du nicht mehr getrennt testen.

---

## Teil 1: Testen auf dem Handy

Alle Punkte bis 0.2.115 hast du am 19.10.2026 abgehakt; sie stehen jetzt in
`docs/ENTSCHEIDUNGEN.md`. Deine Notizen und Wünsche aus derselben Rückmeldung arbeitet Claude als
Arbeitsliste R1 bis R26 ab (`docs/FORTSCHRITT.md`). Neue Testpunkte kommen hier hinzu, sobald ein
Teil fertig ist.

### Neu in 0.3.14: Erfahrungspunkte und Abzeichen (Opus-Arbeitschat, 30.10.2026)

- [ ] N1090. **Stufe im Profil:** Profil › Dein Fortschritt. Ganz oben steht jetzt deine Stufe,
      etwa „Stufe 3 von 10: Zentrum“, rechts die Erfahrungspunkte (EP), darunter ein goldener
      Balken und „Noch … EP bis zur Stufe …“. Die zehn Stufen heißen nach Begriffen des Buches:
      Erster Zug, Entwicklung, Zentrum, Rochade, Offene Linie, Vorposten, Freibauer,
      Kombination, Zugzwang, Meisterplan. Passen Namen und Reihenfolge? Bitte sagen, wenn dir
      andere Namen lieber sind (etwa die Figuren vom Bauern bis zum König).
- [ ] N1091. **Woher die EP kommen:** Darunter „Abzeichen: x von 18“ aufklappen. Der zweite
      Absatz erklärt die Punkte: gelöste Übung 20, beantwortete Warum-Frage 5, vor den
      Werkzeugen richtig eingeschätzte Abbildung 4, angesehene Abbildung 2, abgehaktes Lernziel
      5, Trainerrunde 5, jede richtige Trainerantwort 1, Partie ab zehn Zügen 10, Sieg 10 mehr,
      Bot zum ersten Mal besiegt 25, Eintrag mit Text in Lernsammlung oder Fehlerdatenbank 8,
      jeder Tag der besten Serie der Tagesaufgabe 5. Die Punkte werden aus deinen vorhandenen
      Daten gerechnet; wer schon viel gemacht hat, steht gleich auf einer höheren Stufe. Passen
      die Gewichte und die Schwellen (100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000)?
- [ ] N1092. **Abzeichengitter:** Im aufgeklappten Teil stehen alle 18 Abzeichen als
      Sechsecke mit Name und Bedingung; noch nicht verdiente sind grau. Die 18: Erste Partie,
      Erster Sieg, Zehn, Fünfzig und Hundert Partien, Erstes Matt, Aus eigener Kraft (Sieg ohne
      Rücknahme und ohne Werkzeuge), Über dich hinaus (Sieg gegen einen mindestens 100 Punkte
      stärkeren Gegner), Gehalten (Remis gegen einen solchen), Brillanter Zug, Erste Übung,
      Kapitel gemeistert (alle Übungen eines Kapitels), Nachgefragt (zehn Warum-Fragen), Erst
      selbst denken (zehn Einschätzungen), Eigene Stellung (Lernsammlung), Aus Fehlern lernen
      (fünf Fehler mit Satz), Fleißig trainiert (100 richtige Trainerantworten), Eine Woche
      dabei (sieben Tage hintereinander gelernt oder gespielt). Fehlt dir eines, ist eines zu
      leicht oder zu schwer?
- [ ] N1093. **Meldung bei einem neuen Abzeichen:** Spiele eine Partie gegen einen Bot zu Ende
      (wenn du noch keine hast). Danach erscheint eine schlichte goldene Karte „Neues
      Abzeichen“ mit dem Sechseck „Erste Partie“ und „Weiter“, ohne Feuerwerk und ohne Ton. Sie
      kommt nur einmal. Hast du beim ersten Öffnen nach dem Update schon vieles erreicht,
      stehen alle Abzeichen auf einer einzigen Karte statt vieler Meldungen nacheinander.
- [ ] N1094. **Abzeichen testen:** Aufgabenseite (Profil drei Sekunden halten) › Karte
      „Abzeichen testen (nur für dich)“ aufklappen. Ein Tipp auf „Erste Partie: verdienen“
      zeigt sofort die Meldung; „Nächste Stufe erreichen“ zeigt „Neue Stufe erreicht“. Im Profil
      stehen dann Abzeichen und Stufe. „Probe beenden“ stellt alles zurück; deine echten Daten
      ändern sich dabei nicht.
- [ ] N1095. **Nichts verfällt:** Eine Pause nimmt dir kein Abzeichen und keine Stufe. Ein
      einmal gemeldetes Abzeichen bleibt, auch wenn die Partie dazu später aus der Liste der
      letzten 50 Partien fällt. Es gibt keine Bestenliste, nichts verlässt das Gerät. Passt
      dir der ruhige Ton, oder wünschst du dir bei Abzeichen doch Feuerwerk und Ton wie bei den
      Orden?

### Neu in 0.3.14: Feste Eröffnungen für eigene Bots (Opus-Arbeitschat, 30.10.2026)

- [ ] N1080. **Klappe „Eröffnungen“ im Gegnereditor:** Spielen › Eigene Bots › „Neuen Gegner
      anlegen“ (oder einen bestehenden bearbeiten). Unter den vier Reitern steht die Klappe
      „Eröffnungen (0)“. Aufklappen: „Noch keine feste Eröffnung.“, darunter „Eröffnungen aus dem
      Buch“ (Haken je Eröffnung aus Kapitel 2 und 3) und „Eröffnungen nach Spielstärke“ (dieselbe
      Liste wie im Spielfenster). Ein Tipp auf eine Eröffnung setzt den Haken (goldener Rahmen),
      ein zweiter Tipp nimmt ihn weg. Die Zahl in der Überschrift zählt mit. Passt das so?
- [ ] N1081. **Mehrfachauswahl:** Wähle zwei oder drei Eröffnungen (etwa Italienische Partie und
      London-System, dazu eine aus dem Buch). Oben unter „Gewählt“ stehen sie als kleine Marken
      mit ✕; ein Tipp auf eine Marke entfernt sie, „Alle entfernen“ leert die Liste.
- [ ] N1082. **Schnellwahl im Variantenbaum:** In „Eröffnungen nach Spielstärke“ unter einer
      Eröffnung „Varianten (n)“ aufklappen. Darüber stehen jetzt die Knöpfe „Die häufigsten 3“,
      „Die häufigsten 5“ und „Alle Varianten“. Sie ersetzen die gewählten Varianten dieser einen
      Eröffnung durch die häufigsten (andere Eröffnungen bleiben). Einzelne Varianten lassen sich
      auch einzeln an- und abhaken. Höchstens 40 Eröffnungen je Bot.
- [ ] N1083. **Regler „Abweichung“:** Sobald mindestens eine Eröffnung gewählt ist, erscheint
      „Abweichung: 0 %“ mit Regler in Zehnerschritten. 0 % heißt: Der Bot folgt seiner Eröffnung
      immer, solange du ihre Züge spielst. 100 % heißt: wie ohne Festlegung (er eröffnet wie
      Menschen seiner Stärke). Dazwischen verlässt er die Eröffnung bei jedem Buchzug mit dieser
      Wahrscheinlichkeit. Ist die Vorgabe 0 % richtig, oder lieber etwa 20 %?
- [ ] N1084. **Beschreibung:** Unter dem Editor steht „So stellt er sich vor:“. Mit festen
      Eröffnungen endet sie mit „Eröffnet gern: Italienische Partie oder London-System.“; ab drei
      Eröffnungen „Eröffnet gern: A, B (und 2 weitere).“ Gefällt dir der Satz? (Der Doppelpunkt
      erspart die Beugung der Namen, „Eröffnet gern Italienisch“ ginge nicht für jeden Namen.)
- [ ] N1085. **Vorrang im Spielfenster:** Den Bot speichern und in „Eigene Bots“ wählen. Unten
      in der Karte „Partie“ die Klappe „Eröffnung festlegen“ öffnen. Oben steht „<Name> hat feste
      Eröffnungen: …. Je Partie wählt er eine davon.“, darunter der Haken „Eröffnung des Bots
      überschreiben“. Die gewohnte Eröffnungswahl darunter ist ausgegraut und nicht bedienbar.
      Setzt du den Haken, wird sie bedienbar und gilt für die nächste Partie (auch „wie Menschen
      dieser Stärke“). Der Haken gilt nur, solange du auf dem Bildschirm bist.
- [ ] N1086. **Partie mit fester Eröffnung:** Einem Bot nur das London-System geben, Abweichung
      0 %, mit Schwarz eine Partie beginnen. Der Bot spielt 1. d4 und nach 1… d5 2. Lf4. Mit zwei
      Eröffnungen (etwa Italienische Partie und London-System) wählt er je Partie zufällig eine;
      bitte drei oder vier Partien beginnen und aufgeben.
- [ ] N1087. **Abweichung im Spiel:** Denselben Bot auf 100 % stellen: Er eröffnet dann wie ohne
      Festlegung (meist 1. e4). Bei 50 % verlässt er die Linie im Mittel nach ein bis zwei
      Buchzügen. Fühlt sich das richtig an?
- [ ] N1088. **Bestehende Bots und Sicherung:** Deine schon angelegten eigenen Bots sehen aus wie
      vorher und spielen wie vorher („Eröffnungen (0)“). Nach Einstellungen › Datensicherung
      exportieren und wieder einlesen sind die festen Eröffnungen und die Abweichung noch da.
      Hinweis: Eine ältere App-Version (vor diesem Stand) liest solche Bots ohne Absturz, kennt
      die Eröffnungen aber nicht; speichert man den Bot dort neu, sind sie weg.
- [ ] N1089. **Englisch:** Sprache auf Englisch stellen: Klappe „Openings (n)“, „Deviation“,
      „Override the bot's opening“, Beschreibung „Likes to open with: …“. Die Namen der
      Eröffnungen nach Spielstärke stehen dann englisch (wie auf Lichess).

### Neu in 0.3.14: Zusatzaufgaben von Lichess im Taktiktrainer (Opus-Arbeitschat, 30.10.2026)

- [ ] N1070. **Wahl der Quelle:** Training › Taktiktrainer öffnen. Oben steht „Aufgaben“ mit zwei
      Knöpfen, „Aus dem Buch“ (vorgewählt, alles wie bisher) und „Zusatzaufgaben (Lichess)“.
      Darunter ein Satz, was gewählt ist. Prüfen: Ist „Aus dem Buch“ vorgewählt und läuft die
      Runde dort genau wie früher?
- [ ] N1071. **Kennzeichnung:** „Zusatzaufgaben (Lichess)“ tippen. Darunter steht
      „Zusatzinhalt (nicht aus dem Buch), Quelle: Lichess-Puzzle-Datenbank (CC0) …“. In jeder
      Aufgabe steht unter dem Brett „Zusatzaufgabe (nicht aus dem Buch) · Lichess (CC0),
      Wertung …“. Reicht dir die Kennzeichnung?
- [ ] N1072. **Themen:** Die Liste „Thema“ hat 20 Themen mit je 50 Aufgaben: Hängende Figur,
      Gabel und Doppelangriff, Fesselung, Spieß, Abzug und Abzugsschach, Doppelschach,
      Hinlenkung, Räumung, Beseitigung der Verteidigung, Ablenkung, Zwischenzug, Gefangene
      Figur, Umwandlung, Wegversperrung, Stiller Zug, Zugzwang, Grundreihenmatt, Mattbilder,
      Matt in einem Zug, Matt in zwei Zügen (dazu „Alle Themen gemischt“). Passen die Namen zu
      deinen Begriffen? „Röntgenangriff“ von Lichess ist bewusst nicht dabei, weil „Röntgen“ im
      Buch die Schach-Röntgen-Regel meint.
- [ ] N1073. **Stufen:** Stufe 1 bis 5 wählen (Stufe 1: Lichess-Wertung unter 1000, Stufe 5:
      1900 bis 2200). Je Thema und Stufe gibt es zehn Aufgaben. Fühlen sich Stufe 1 leicht und
      Stufe 5 schwer an?
- [ ] N1074. **Gegnerzug vorgespielt:** Eine Runde starten. Das Brett zeigt kurz (0,7 Sekunden)
      die Stellung vor dem Zug des Gegners, dann gleitet sein Zug über das Brett und bleibt
      markiert; erst dann kannst du ziehen. Ist die Pause angenehm?
- [ ] N1075. **Lösen und falscher Zug:** Eine Aufgabe richtig lösen (die App antwortet mit dem
      Gegenzug), bei einer anderen einen falschen Zug ziehen: roter Pfeil und Verlust laut
      Engine wie bei den Buchaufgaben. Hinweis 2 nennt das Thema, Hinweis 3 die Figur.
- [ ] N1076. **Motivfrage:** Bei „Alle Themen gemischt“ kommt nach dem Lösen „Welches Motiv war
      es?“, aber nur bei Themen, die zu einem der zwölf Grundmotive aus Kapitel 7 gehören
      (Räumung zählt zur Hinlenkung, Ablenkung zur Überlastung). Bei einem einzelnen Thema
      entfällt die Frage. Einverstanden mit der Zuordnung?
- [ ] N1077. **Wiederholung:** Bei einer Zusatzaufgabe „Lösung zeigen“ tippen. Nach zwei Tagen
      bietet der Taktiktrainer oben „Wiederholen: 1 Aufgabe ist fällig“ an, auch wenn
      „Aus dem Buch“ gewählt ist; die Aufgabe kommt mit der Kennzeichnung als Zusatzaufgabe.
- [ ] N1078. **Offline:** Die App einmal online öffnen, dann im Flugmodus den Taktiktrainer und
      „Zusatzaufgaben (Lichess)“ öffnen. Die Themen erscheinen und die Runde läuft.
- [ ] N1079. **Englisch:** Sprache auf Englisch stellen. Die Wahl heißt „From the book“ |
      „Extra puzzles (Lichess)“, die Themen sind englisch benannt.

### Neu in 0.3.14: Mehr Meisterpartien für „Zug erraten“ (Opus-Arbeitschat, 30.10.2026)

- [ ] N1060. **Quellenwahl:** Trainer › „Zug erraten“ öffnen. Oben steht „Quelle“ mit drei
      Knöpfen: „Aus dem Buch“ (gewählt, wie bisher die Meisterpartien aus Kapitel 11),
      „Berühmte Partien“ und „Aktuelle Turniere“. Bei „Aus dem Buch“ sieht alles aus wie bisher.
- [ ] N1061. **Berühmte Partien:** „Berühmte Partien“ tippen. Die Liste „Partie“ zeigt etwa 50
      Klassiker von Anderssen bis Carlsen (Titel „Weiß – Schwarz, Ort Jahr“). Unter der Liste
      steht eine Karte „Zusatzinhalt (nicht aus dem Buch)“ mit Spielern, Ergebnis, Eröffnung,
      einem kurzen Text (wer, wann, warum berühmt) und zwei Quellen als Links. Bitte ein paar
      Kurztexte lesen: Stimmen sie, klingen sie gut? Partien aus dem Buch (Opernpartie,
      Immergrüne, Lasker–Thomas usw.) kommen hier nicht noch einmal vor.
- [ ] N1062. **Aktuelle Turniere:** „Aktuelle Turniere“ tippen. Etwa 60 Partien aus August und
      September 2026 (Olympiade Samarkand, Sinquefield Cup, türkische Liga u. a.), klassische
      Bedenkzeit, beide Spieler ab 2500, alle entschieden. Die Karte nennt Turnier, Runde, Datum,
      Wertungen und als Quelle die Lichess-Übertragung mit „CC BY-SA 4.0“ (die Lizenz verlangt
      diese Namensnennung).
- [ ] N1063. **Raten wie gewohnt:** Eine berühmte Partie wählen, Seite des Siegers, „Runde
      starten“. Über dem Brett steht zugeklappt „Zusatzinhalt (nicht aus dem Buch)“ (aufklappen
      zeigt die Karte). Raten, Hinweis, Pfeile, Engine-Vergleich, Blättern und Analyse
      funktionieren wie bei den Buchpartien; beim nächsten Mal nennt die App den letzten
      Durchgang dieser Partie.
- [ ] N1064. **Offline und Lizenzen:** Nach dem Aktualisieren der App einmal ohne Netz „Berühmte
      Partien“ und „Aktuelle Turniere“ öffnen: Die Listen kommen trotzdem. Unter Einstellungen ›
      Lizenzen steht der neue Eintrag „Zusatzpartien für „Zug erraten“ (aktuelle Turniere)“ mit
      CC BY-SA 4.0.

### Neu in 0.3.14: Webverweise, Trainer der App neben Lichess (Opus-Arbeitschat, 30.10.2026)

- [ ] N1050. **Koordinaten in der App:** schach-von-grund-auf.com/training/kap00/ öffnen. Unter
      der Übung zum Koordinatentraining steht wie bisher „Direkt öffnen: Koordinatentraining ↗“
      (Lichess, neuer Tab) und dahinter neu „In der App: Koordinaten, Notation, Gangarten“. Ein
      Tipp darauf öffnet die App gleich im Koordinatentrainer (Knöpfe „Feld finden“ usw.).
      „Zurück“ führt zur Übersicht der Trainer im Bereich Training. Passt das?
- [ ] N1051. **Taktik und Endspiel in der App:** Auf schach-von-grund-auf.com/training/kap01/
      steht bei Übungen mit „Aufgabenthemen“ zusätzlich „In der App: Taktiktrainer“, auf
      /training/kap08/ und /training/kap09/ bei den Lichess-Übungen zu Mattvarianten und
      Turmendspielen „In der App: Endspieltrainer“. Je einmal antippen: Öffnet sich der richtige
      Trainer? Die Lichess-Links bleiben daneben, weil das Buch sie nennt.
- [ ] N1052. **Linkprüfung im Dashboard:** Nach dem nächsten Wartungslauf (schach-von-grund-auf.com/admin/,
      Übersicht, Gruppe „Links“) prüft „App-Texte und Lizenzen“ jetzt auch die Quellen der
      Lizenzseite, die ohne „https://“ dastehen (etwa github.com/niklasf/chessops). Neu ist
      außerdem: Leitet eine Adresse auf eine andere Domain weiter (so sieht eine abgelaufene,
      geparkte Domain aus), wird der Punkt gelb mit „umgeleitet nach …“. Heute sollte alles grün
      sein. Ist es das?

### Neu in 0.3.13: Orden verstreut, Pfeile, Serie ohne Verfall (Opus, 30.10.2026)

- [ ] N1041. **Orden zufällig verteilt:** Aufgabenseite › „Orden testen“ › ein paar Ringe auf
      100 % setzen, dann „Neu starten“. In der Startanimation stehen die 18 Orden jetzt verstreut
      im Rand um Springer und Titel statt im Kranz, ohne sich zu überdecken; bei jedem Start an
      denselben Stellen, damit du deine wiederfindest. Gefällt dir die Verteilung?
- [ ] N1042. **Pfeile in den Werkzeugbildern:** Nachschlagen › Werkzeuge des Buches, ein Werkzeug
      aufklappen. Neben den goldenen Nummern zeigt jetzt ein goldener Pfeil schräg von unten auf
      jeden Knopf, den du antippst. Auf dem Brett selbst (bei „Zählen“ das Feld d4) steht nur die
      Nummer, weil ein Pfeil dort wie ein Pfeil des Werkzeugs aussähe. Passt das?
- [ ] N1043. **Tagesserie ohne Verfall:** Training › Kurzpläne › Tagesaufgabe. Die Zeile heißt
      jetzt „Serie: 3 Tage mit Tagesaufgabe. Die Serie verfällt nicht.“ Lässt du einen Tag aus,
      steht dort „… gerade pausiert. Löse heute die Tagesaufgabe, dann geht sie weiter“; die Zahl
      bleibt und wächst mit der nächsten gelösten Aufgabe weiter (deine Wahl vom 30.10.). Ist der
      Text so gut?

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

### Neu in 0.3.11: Variantenbaum und Gambits (Opus, 30.10.2026)

- [ ] N1038. **Variantenbaum:** In „Eröffnungen nach Spielstärke“ (Spielen › Eröffnung
      festlegen) steht unter jeder Eröffnung „Varianten (20)“. Aufgeklappt: die 20 häufigsten
      Varianten nach Lichess als Baum, verzweigt ab dem ersten abweichenden Zug, Geschwister nach
      Häufigkeit. Jede Zeile nennt den Namen (ohne das, was darüber schon steht), die Züge ab der
      Verzweigung in deiner Notation und den Anteil an der Eröffnung, etwa unter Italienisch
      „Two Knights Defense · 3... Sf6 · 34 % dieser Eröffnung“, darunter „Knight Attack · 4. Sg5“.
      Ein Tipp legt die Variante für den Bot fest. Die Variantennamen bleiben englisch wie in der
      Lichess-Liste. Ist der Baum so lesbar?
- [ ] N1039. **Gambits:** Unter „Weiß wählt“ und „Schwarz wählt“ steht „Gambits“: je Band die
      drei häufigsten, die noch nicht dastehen, beide Seiten zusammen, mit „Weiß spielt es“ oder
      „Schwarz spielt es“ und der Häufigkeit; der Name nennt die Eröffnung, aus der das Gambit
      stammt („Sizilianische Verteidigung: Smith-Morra Gambit“). Um 800 sind es Englund-Gambit,
      Busch-Gass-Gambit und Königsgambit. Das Damengambit zählt nicht als Gambit (wie im Buch).
      Passt das?

### Neu in 0.3.10: Eröffnungen nach Spielstärke (Opus, 30.10.2026)

- [ ] N1037. **Eröffnungen nach Spielstärke:** Spielen › „Eröffnung festlegen“ aufklappen, darin
      die neue Klappe „Eröffnungen nach Spielstärke“. Oben „von“ und „bis“ (Bänder 400 bis
      2800+, Vorgabe 1000 bis 1400). Darunter „Weiß wählt“ und „Schwarz wählt“: Jedes Band
      bringt die drei häufigsten Eröffnungen, die noch nicht dastehen, also bei drei Bändern neun
      je Seite. Jede Zeile zeigt den Namen, „Buch 2.3“ bei Eröffnungen aus deinem Buch, „Gambit“
      bei Gambits und „2,9 % der Partien um 1200“. Ein Tipp legt die Eröffnung fest: Sie steht
      dann oben in der Auswahl, mit der Hauptvariante darunter, und der Bot folgt ihr, solange du
      ihre Züge spielst. Gezählt in einem Monat Lichess (September 2026). Passen Aufbau und
      Vorgabe?

### Neu in 0.3.9: Bilder im Nachschlagen (Opus, 30.10.2026)

- [ ] N1035. **Steckbriefe mit Diagramm:** Nachschlagen › Steckbriefe, eine Eröffnung aufklappen
      (etwa Caro-Kann). Unter den vier Zeilen steht jetzt die Schlussstellung der Hauptvariante
      aus deinem Buch als kleines Brett mit deinen Pfeilen und Feldern, darunter
      „Schlussstellung der Hauptvariante (Abb. 2.109)“; ein Tipp öffnet die Abbildung. Die App
      nimmt in jedem Abschnitt die Abbildung, deren Unterschrift mit „Schlussstellung der
      Hauptvariante“ beginnt; im Sammelabschnitt 2.10 die im Unterabschnitt mit dem Namen der
      Eröffnung (beim Zweispringerspiel und Läuferspiel die erste der zwei, Abb. 2.128). Bei
      den Fallenchecks steht der Stopp-Moment ebenso als Brett statt nur als Knopf. Passt das?
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

- [ ] N1034. **Beschreibung eigener Bots:** Spielen › Eigene Bots › „Neuer Gegner“ (oder einen
      vorhandenen bearbeiten). Unter den vier Reitern steht „So stellt er sich vor:“ mit zwei
      bis vier kurzen Sätzen aus deinen Einstellungen, etwa „Ein Gegner für Einsteiger. Spielt
      im Stil Angreifer. Typisch: lässt Figuren hängen und übersieht Drohungen. Übersieht gern
      Rückzüge.“ Die Stärke kommt aus dem Mittel der drei Stufen (bis 3 Einsteiger, bis 6
      Vereinsniveau, bis 8 Fortgeschrittene, darüber starke Spieler), Fehler und blinde Flecken
      aus den drei höchsten Reglern. Ändere einen Regler oder den Stil: Der Text ändert sich
      sofort. Derselbe Text steht in der Gegnerwahl in der Sprechblase deines Bots. Klingen die
      Sätze gut?

### Neu in 0.3.7: Orden für volle Ringe (Opus, 30.10.2026)

- [ ] N1032. **Neue Ringe im Profil:** Profil › Dein Fortschritt. Oben wie bisher Abbildungen,
      Lernziele und Trainer, neu ein Ring „Übungen gelöst“ (alle 86 Übungen des Buches).
      Darunter zwei aufklappbare Zeilen, damit es nicht zu viele werden: „Teile des Buches“ mit
      fünf Ringen nach den Teilen deines Buches (Grundlagen = Kapitel 0 und 1, Eröffnung 2–4,
      Mittelspiel 5–7, Endspiel 8–10, Praxis 11–12; voll, wenn alle Abbildungen angesehen und
      alle Übungen gelöst sind) und „Vorgefertigte Bots besiegt“ mit neun Ringen nach deinen
      Bündeln: Stufe 1–3, 4–5, 6–7 und 8–9 je „jeden Bot einmal“ (gewertet, beliebige Zeitart)
      und „in allen Zeitarten“, dazu die Engine (Stufe 10) mit dem Superorden für jeden Bot
      einmal. Die drei alten Ringe je Zeitart sind dafür weg. Die Zeile nennt, wie viele Ringe
      schon voll sind. Passen Einteilung und Texte?
- [ ] N1033. **Orden testen:** Aufgabenseite (Profil drei Sekunden halten) › ganz oben „Orden
      testen (nur für dich)“. Je Ring ein Knopf „… auf 100 % setzen“: Sofort kommen Feuerwerk,
      Ton und die Gratulation mit dem neuen Orden (Medaille mit Band und dem Zeichen des Rings).
      Im Profil steht danach statt des Rings der Orden. „Neu starten“ zeigt die Startanimation:
      Alle 18 Orden stehen im Kranz um den Springer, deine verdienten golden, die übrigen als
      graue Silhouette. „Probe beenden“ stellt alles zurück; deine echten Fortschritte ändert
      die Probe nie. Wie gefallen dir Orden und Kranz?

### Neu in 0.3.6: ein Knopf „Merken“ für Lernsammlung und Fehlerdatenbank (Opus, 30.10.2026)

- [ ] N1029. **Ein Knopf statt zwei Zeilen:** Spiele eine Partie und spiele sie nach. Am Brett
      steht jetzt das Lesezeichen „Merken“ (wie bei den Abbildungen); die zwei Zeilen „In die
      Fehlerdatenbank“ und „In die Lernsammlung“ unter der Karte sind weg (dein Beschluss: ein
      Knopf). Ein Tipp öffnet unter der Karte die Wahl „Lernen | Fehler“. Bei Zügen mit ?, ??
      oder „verpasst“ ist „Fehler“ vorgewählt, sonst „Lernen“. Ein zweiter Tipp schließt es,
      ein anderer Zug ebenso.
- [ ] N1030. **Vorschläge:** Unter „Fehler“ ist die Fehlerart schon gewählt, wenn die
      Auswertung den Fehler erkennt (etwa hängende Figur oder stehengelassene Drohung →
      „Kapitel 1: Schach oder Schlag übersehen“, übersehene Taktik → Kapitel 7, Schlagreflex
      oder vergifteter Bauer → Kapitel 4, Bauernzüge ohne Not → Kapitel 5), und der Satz
      steht vor: „12... Sxe4: lässt … zu. Besser war 12... h6.“ Unter „Lernen“ steht die
      Eröffnung wie bisher und als Notiz „Aus meiner Partie, Stellung nach 12... Sxe4.“ Alles
      lässt sich ändern. Passt die Zuordnung der Fehlerarten zu den Kapiteln?
- [ ] N1031. **Goldenes Aufleuchten:** Bei einem eigenen Patzer (??) oder verpassten Gewinn
      leuchtet „Merken“ zweimal kurz golden auf (bei „Bewegung reduzieren“ nur ein goldener
      Rand). Nur dort, damit es nicht nervt (deine Vorgabe „lieber zu selten als zu oft“).
      Passt das, oder auch bei einem Fehler (?)?

### Neu in 0.3.5: Pfeile und Verlust nach einem falschen Zug (Opus, 30.10.2026)

- [ ] N1027. **Taktiktrainer, falscher Zug:** Spiele in einer Taktikaufgabe absichtlich einen
      falschen Zug. Unter dem Brett steht kurz „Die Engine vergleicht beide Züge …“, dann etwa
      „Dein Zug Dh5 ist laut Engine um etwa 2,1 Bauerneinheiten schwächer als die Lösung (roter
      Pfeil). Versuch es noch einmal.“ Auf dem Brett zeigt ein roter Pfeil deinen Zug. Die Lösung
      bleibt verdeckt, damit du es noch einmal versuchen kannst (meine Empfehlung, Widerspruch
      genügt: dann zeige ich den goldenen Pfeil sofort). Nach dem Lösen oder „Lösung zeigen“ steht
      der volle Vergleich mit dem Zug der Lösung und beiden Bewertungen. Den goldenen Pfeil siehst
      du, solange das Brett die Stellung vor deinem falschen Zug zeigt.
- [ ] N1028. **Buchübungen, falscher Zug:** Dasselbe in den Übungen eines Kapitels (etwa Übung
      zu Abb. 1.40: statt Sc7+ den Springer nach a7). Erst roter Pfeil und Verlust, nach dem
      Lösen der Vergleich „dein Zug Sa7 …, Lösung Sc7+ …“. „Zug erraten“ und „Studien“ zeigen
      Pfeile und Vergleich schon wie bisher; der Abweichungstrainer nennt Verlust und besseren
      Zug weiter in Worten (dort zeigt das Brett schon die Stellung nach deinem Zug).

### Neu in 0.3.4: Wertung auf chess.com und FIDE als Bereich (Opus, 30.10.2026)

- [ ] N1026. **Drei Schalter statt zwei:** Profil › Deine Wertung (und unter Spielen „Deine
      Spielstärke“) hat jetzt „Lichess | chess.com | FIDE“, und beide Umrechnungen gibt es für
      jede Zeitart (dein Wunsch). Statt „≈ 1340“ steht ein Bereich, etwa „1190–1490 chess.com
      Schnellschach“: In ihm liegt die Hälfte der Spieler, die bei uns dieselbe Zahl hätten.
      Blitz wird mit chess.com Blitz verglichen, Schnellschach und Klassisch mit chess.com
      Schnellschach, weil chess.com keine klassische Wertung führt; der Name der Liste steht
      jeweils dabei. Bei FIDE fehlen Werte unter etwa 1650 (dann ein Strich mit der Grenze, etwa
      „FIDE erst ab etwa 1730 (Lichess Klassisch)“). Die Kurve bleibt im Maßstab von Lichess, die
      Wahl bleibt auf dem Gerät. Schon umgesetzt, Widerspruch genügt. Sind die Bereiche zu breit
      oder gerade richtig?

### Neu in 0.3.3: Kurzpläne und „Keine Fehlerneigung“ (Sonnet, 26.10.2026)

Nach deinen Beschlüssen im Chat umgesetzt; Widerspruch genügt.

- [ ] N1021. **Keine Fehlerneigung:** Eigener Bot, Vorlage „keine Fehler“ (keine Fehlerart und kein
      blinder Fleck an): Über den Reitern steht nicht mehr „Menschlich.“, sondern „Keine
      Fehlerneigung.“ in Gold, hinter dem Fragezeichen die Erklärung. Sobald eine Fehlerart oder
      ein Fleck angehakt ist, kommen die alten Urteile wieder.
- [ ] N1022. **Neuer Trainer „Kurzpläne“** (Training › Kapitel 12, Stundenglas-Symbol): Vier
      Angebote. „5 Minuten: nur Wiederholungen“ zeigt Uhr und die fälligen Wiederholungen;
      „Einheit abschließen“ meldet „Geschafft“. „15 Minuten: Kurzplan“ hat zwei Schritte
      (5 Minuten Wiederholungen, 10 Minuten Taktik-Themenblock mit Knopf zum Taktiktrainer). Die
      Einheit bleibt beim Wechsel in einen anderen Bildschirm erhalten (nach drei Stunden verfällt
      sie). Der Stand liegt nur auf dem Gerät, nicht in der Datensicherung.
- [ ] N1023. **Taktik auf Zeit:** „Zeitrunde starten“: drei Minuten leichte Taktikaufgaben, Ende
      nach drei Fehlern oder wenn die Zeit um ist; am Ende „X richtig, Y falsch“ und deine beste
      Runde. Prüfe, ob sich die Aufgaben auf dem Handy flott bedienen lassen und ob das Ende
      auch mitten in einer Aufgabe sauber kommt.
- [ ] N1024. **Tagesaufgabe mit Serie:** Eine leichte Taktikaufgabe pro Tag (am nächsten Tag eine
      andere). Oben steht „Serie: n Tage in Folge (beste: m)“; sie wächst, wenn du an
      aufeinanderfolgenden Tagen eine Aufgabe bearbeitest (richtig oder falsch), und fällt nach einem
      ausgelassenen Tag auf 0. Auch Änderung der Systemzeit zum Testen möglich.
- [ ] N1025. **Fortschritt:** Der Ring „Trainer ausprobiert“ hat jetzt 18 statt 17 Trainer
      (Kurzpläne zählt, sobald du eine Einheit abgeschlossen oder eine Runde gespielt hast).

### Neu in 0.3.2: kleine Korrekturen aus der Ideensammlung (Sonnet, 26.10.2026)

Alles nach deinem Wunsch umgesetzt; Widerspruch genügt, dann baue ich es zurück.

- [ ] N1011. **Eröffnung festlegen:** Spielen › Zahnrad „Eröffnung festlegen“ aufklappen. Unter
      der Überschrift steht jetzt nur noch die Auswahlliste, ohne das zweite Wort „Eröffnung“.
- [ ] N1012. **Varianten abspielen:** In der Auswertung einer Partie bei einem Zug mit Fehler:
      „Besserer Zug“ und „Bestrafung“ stehen nebeneinander in einer Zeile (kürzere Beschriftung).
      Läuft oder lief eine Variante, erscheint rechts daneben ein Pfeil zurück
      („Zurück zur Ausgangsstellung“); er führt auch nach dem Ende der Variante zur Stellung der
      Partie zurück.
- [ ] N1013. **Zügeraten, Pfeile:** Trainer „Zug erraten“: Hast du den Partiezug selbst
      gefunden (auch mit Hinweis), erscheint kein Pfeil. Bei einem falschen Zug bleiben der
      goldene (Partiezug) und der rote Pfeil (dein Zug).
- [ ] N1014. **Reiter „Blinde Flecken“:** Eigener Bot oder eigene Stufe: Der Reiter heißt jetzt
      „Blinde Flecken (n)“. Prüfe, dass alle vier Reiter auf dem Handy in die Zeile passen.
- [ ] N1015. **Profil:** Sind Name oder Porträt gesetzt, steht oben statt des Knopfes „Name und
      Porträt“ ein kleiner Stift rechts auf der Karte; er öffnet dieselbe Auswahl. Solange beides
      leer ist, steht der Textknopf weiter da.
- [ ] N1016. **Einstellungen ohne „Training“:** Der Reiter „Training“ ist weg, „Brett“ steht
      jetzt vorn. „Erst selbst denken“ gilt fest in der lockeren Form (Übungen: Hinweise erst nach
      „Ich habe nachgedacht“), und vor den Werkzeugen an den Abbildungen wird nicht mehr nach einer
      Einschätzung gefragt. Bitte eine Übung und eine Abbildung mit Werkzeug öffnen; beides soll wie
      früher mit den Standardwerten laufen. Alte gespeicherte Werte werden ignoriert und bleiben
      nur im Datenformat (Sicherungen), weil das Entfernen aus dem Format eine eigene Entscheidung
      ist (Rückwärtsverträglichkeit).
- [ ] N1017. **Sicherheitsblick ohne Zug:** Denkroutine, Werkzeug „Sicherheitsblick“ an einer
      Stellung ohne Zugfolge und ohne Buchzug: Es prüft jetzt den besten Kandidaten der
      Denkroutine (mit dem Satz „Kein Zug ist geplant: Geprüft wird der beste Kandidat …“).
      Mit geplantem Zug oder Buchzug ändert sich nichts.

- [ ] N1018. **Gegner und Farbe mit Zeichen:** Spielen: „Engine“ trägt ein Chip-Symbol und
      „Mensch“ ein Personensymbol; „Weiß“ und „Schwarz“ tragen eine weiße und eine schwarze
      Scheibe. Alles andere ist wie vorher.
- [ ] N1019. **Bedenkzeit nach Zeitart:** Spielen › „Bedenkzeit“: statt vieler Kacheln steht je
      Zeitart eine Zeile mit dem Zeichen einmal groß (Blitz, Stoppuhr, Kaffeetasse) und dem Namen
      links, rechts daneben die Zeiten dieser Art (zum Beispiel Blitz: 3 + 0, 3 + 2, 5 + 3).
      Außerhalb der Grundstellung kommt eine Zeile „ohne Uhr“ dazu. Prüfe, ob es auf dem Handy
      ruhiger wirkt und ob die Zeiten in die Zeile passen.
- [ ] N1020. **Motiv benennen als Liste:** Taktiktrainer, nach einer gelösten Aufgabe mit
      Grundmotiv: Die zwölf Motive stehen jetzt in einer Auswahlliste („Motiv wählen …“) statt als
      Knöpfe untereinander. Die erste Wahl zählt, danach steht die Antwort da. Befund der Durchsicht
      aller Trainer: Die übrigen Chip-Gruppen haben höchstens vier Einträge (Seite, Stufe, Bereich,
      Waage) und bleiben; alle längeren Wahlen waren schon Listen.

### Neu in 0.2.144: Feiern, Gruppenkreis, Maia-Hinweis, einfachere Texte (Opus, Nacht 25./26.10.2026)

- [ ] N990. **Gruppenbild als Kreis:** Spielen › Vorgefertigte Bots, eine Stufe aufklappen. Unter
      den Porträts steht der Knopf „Gruppenmodus“; rechts daneben sitzen die acht Gesichter der
      Gruppe klein auf einem Kreis, zusammen so groß wie ein Porträt. Dasselbe in der
      Sprechblase, wenn du den Gruppenmodus wählst, und im Glückwunschfenster. Gut erkennbar?
- [ ] N993. **Nach der Partie:** Gewinnst du eine Partie, leuchtet das Brett golden auf, über dem
      Schild „Gewonnen!“ sprühen ein paar Funken, dazu ein kurzer Dreiklang (bei Ton an). Bei
      Remis kommt nur das Schild, bei einer Niederlage wird das Brett kurz grau und das Schild
      sinkt etwas ab, ohne Ton. Passt das Maß?
- [ ] N996. **Rundgang:** Starte den Rundgang (Zahnrad › Hilfe › „Rundgang durch die App“) und auf
      einigen Seiten über das Toursymbol. Jeder Schritt zeigt auf das Richtige, auch die neuen
      Schritte zur Profilkarte, zum Reiter „Bots“, zur Wahl Engine oder Mensch und zu den
      Werkzeugen am Brett der Partie.
- [ ] N998. **Planbilanz-Übung:** Training › Planbilanz › Drei Planfragen, einige Runden. Bei „Wo
      spiele ich?“ ist keine Antwort mehr ein Satz über den Gegner. Fragen aus dem Buch (etwa
      „Warum spielt Weiß 9. Lc4 noch vor der langen Rochade?“) stehen unter der Überschrift
      „Eine Frage aus dem Buch zu Abb. …“ statt „Beantworte die Planfragen“.

### Neu in 0.2.143: Maia, Plan C, zwei Zahlensätze, acht Neulinge (Opus, 25.10.2026)

Deine Freigaben vom 25.10.2026: Maia als Komplettpaket, in den Einstellungen ausschaltbar; Plan C;
eine Neumessung mit und ohne Maia; die Gruppe Neuling auf acht Bots.

- [ ] N987. **Löschen:** Einstellungen › Bots › „Maia vom Gerät löschen“. Danach steht wieder
      „Laden“, und die Bots spielen ohne Maia (Zahlen wie ohne Maia).

### Neu in 0.2.131 und 0.2.132: Nutzungsprüfung (DS46 bis DS57, V1 bis V9, T1 bis T4) und deine Ergänzungen (Opus, 25.10.2026)

Deine Freigabe vom 25.10.2026 („Ja“ zu allem außer T5) und deine drei Ergänzungen dazu. Die
Vorschaubilder stehen im Artifact „Nutzungsprüfung“.

- [ ] N924. **Querformat in der installierten App (Android):** Die installierte App dreht sich mit
      dem Handy; quer erscheint das Querformat mit dem Brett links. (Wirkt erst nach dem
      nächsten Update der Installation; notfalls die App neu installieren.)
- [ ] N925. **Fehler melden:** Im Formular steht unter dem Häkchen „Angaben zum Gerät
      mitschicken“ eine Klappe „Was wird gesendet?“ mit den echten Werten (App-Version,
      Browser und Gerät, Bildschirm, Sprache; an einer Abbildung auch Nummer und Stellung). Der
      Satz darunter endet mit dem Link „Mehr in der Datenschutzerklärung“. Oben steht „Fehler im
      Buch“ jetzt ganz (darf zweizeilig sein), nicht mehr „Fehler im B…“.
- [ ] N935. **„Spielen“ schneller:** Unten auf „Spielen“ tippen: Der goldene Strich springt sofort
      dorthin, der Bildschirm folgt gleich. Zurück zu „Buch“ und wieder „Spielen“: spürbar
      schneller als vorher. „Beginnen“ wirkt sofort gedrückt, die Partie ist schneller da.

### Neu in 0.2.129: Spielen neu geordnet (DS38 bis DS45; Opus, 25.10.2026)

Deine Freigabe „Alles ja“ zu den Vorschlägen DS38 bis DS45, angepasst an den Stand 0.2.128
(Spinnennetz mit Stil-Mischung, Rücknahme bei den Spielhilfen).

- [ ] N906. **Bedenkzeit als Kacheln:** vier gleich große Kacheln je Zeile, groß die Zeit
      („3 + 2“), klein die Zeitklasse mit Zeichen (Blitz, Schnellschach, Klassisch). Aus einer
      eigenen Stellung kommt „∞ ohne Uhr“ dazu.

### Neu in 0.2.124: Admin-Dashboard, Fehler melden, Lichess-Links (R57; Opus, 24.10.2026)

- [ ] N744. **Aufgabe für Claude:** Der Knopf fasst rote und gelbe Prüfungen und alle offenen
      Meldungen als Auftrag zusammen und kopiert ihn. In einen neuen Chat einfügen genügt.

## Teil 2: Entscheiden

Bei den Wünschen der Arbeitsliste nimmt Claude zunächst die eigene Empfehlung und stellt sie dir
hier zur Prüfung („Schon umgesetzt, Widerspruch genügt“). Buchbefunde bleiben Rückfragen, weil
nur du das Buch änderst.

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

- [ ] Q5-1. **Weitere Trainingsformen (Empfehlung, noch nicht gebaut):** (a) „Nochmal versuchen“
      an den Schlüsselzügen der Partieauswertung, mit einem Hinweis aus der Denkroutine statt einer
      KI (wie bei chess.com). (b) Aufgabenserie ohne Uhr: Ein Fehler beendet die Serie, dein
      Bestwert bleibt nur auf deinem Gerät (wie „Puzzle Streak“ bei Lichess). (c) Eine Abbildung
      mit Ziel gegen die Engine ausspielen („halte Remis“, „setze matt“). (d) Ein ruhiger
      Monatsrückblick nur auf deinem Gerät (Gelerntes, stärkstes und schwächstes Thema, ein
      nächster Schritt mit Kapitel) und Stärken und Schwächen nach Buchthema mit Sprung in die
      passende Übung. Sag, welche davon du willst („Q5-1 a, c“), dann baue ich sie.

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
- [ ] Q3-2. **Rest des Eröffnungspakets:** Eröffnungen nach Spielstärke, Variantenbaum und
      Gambits sind gebaut (0.3.10, 0.3.11), feste Eröffnungen für eigene Bots mit Regler
      „Abweichung“ sind in Arbeit. Offen bleiben die Schnellwahl im Variantenbaum (alle, die
      häufigsten 3 …) für den Repertoire-Trainer und weitere Fallen für „Falle oder Köder“. Die
      Fallen brauchen zuerst eine Definition, die du freigibst. Empfehlung: Eine Falle ist ein
      Köderzug, der nicht der beste ist und die Stellung deutlich verschlechtert, es sei denn,
      der Gegner antwortet mit dem naheliegenden falschen Zug (Schlagreflex, übersehene Gabel);
      „naheliegend“ heißt: Menschen seiner Stärke spielen ihn laut Lichess häufig. Einverstanden?

### Q2 Eigene Bots: freie Beschreibung? (30.10.2026)

- [ ] Q2-1. **Eigener Text statt Vorschlag:** Die Beschreibung eigener Bots entsteht jetzt bei
      jedem Zeigen aus den Einstellungen und wird nicht gespeichert. Ein Feld, in dem du den
      Vorschlag selbst umschreibst, bräuchte ein neues Feld im Speicher deiner Leser; deshalb
      warte ich damit auf dich. Empfehlung: erst einmal ohne freies Feld, weil der Text sich
      sonst nicht mehr mit den Reglern ändert. Möchtest du das Feld trotzdem?

### Q1 Befunde der Nachsicht im Code (26.10.2026, nur gelesen, nichts geändert)

Antworten auf deine Fragen aus der Ideensammlung. Wo ein Vorschlag steht, ist er noch nicht
umgesetzt; Widerspruch genügt.

- [ ] Q1-1. **Plus-Symbol in der Partieauswertung:** Es gibt es, aber es sieht nicht wie ein
      Plus aus. Beim Nachspielen einer Partie (Rückblick) stehen unter der Karte zum gezeigten
      Zug zwei aufklappbare Zeilen: „In die Fehlerdatenbank“ und „In die Lernsammlung“. Das
      Lesezeichen mit Plus (wie an den Abbildungen im Buch) gibt es dort nicht, deshalb hast du
      es vermisst. Die Eröffnung füllt die App in der Lernsammlung schon vor. Vorschlag: Beide
      Zeilen durch ein Lesezeichen-Symbol neben der Karte ersetzen, das ein gemeinsames Fenster
      öffnet (beschlossen, siehe Entscheidungen).
- [ ] Q1-6. **Kürzere Trainingspläne:** Im Buch gibt es nur den 30-Minuten-Plan (Tag A
      Partietag 5 + 20 + 5 Minuten, Tag B Studientag 5 + 15 + 10 Minuten, Kapitel 12). Der
      Satz zu wenig Zeit lautet: „Hast du weniger Zeit, kürze zunächst das Themenstudium, nie
      die Analyse.“ Weitere Pläne stehen nicht im Buch. Die App setzt den 30-Minuten-Plan in
      `training/dreissigminuten.ts` um (zwei Tagesarten, je drei Schritte mit fester Dauer,
      Stand auf dem Gerät). Ein Kurzplan müsste von der App stammen und nicht vom Buch; er
      wäre ein neuer Entwurf und gehört zu dir als Autor, weil das Buch die Quelle ist.
- [ ] Q1-7. **Wertungsumrechnung:** Die eigene Wertung der App liegt auf dem Maßstab von
      Lichess, je Zeitklasse (Blitz, Schnellschach, Klassisch). Daneben zeigt die App
      „entspricht etwa“: Blitz und Schnellschach auf chess.com, Klassisch auf FIDE. chess.com
      hat keine Wertung für Klassisch, deshalb nimmt Klassisch die FIDE-Liste; sie gilt erst ab
      etwa 1730 Lichess Klassisch. Die Zahlen stammen aus dem Wertungsvergleich von
      chessgoals.com (Juli 2026, Selbstangaben, spiel/umrechnung-daten.ts). Eine Umrechnung
      von Klassisch auf chess.com gäbe es nur über den gemeinsamen Blitzwert; die Streuung wäre
      groß, ein Bereich statt einer Zahl wäre dann ehrlicher. Der Punkt E4 weiter unten betrifft
      dasselbe.

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
