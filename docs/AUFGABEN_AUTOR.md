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

### Neu: Das Spiel ganz durchspielen (18.11.2026, Beta 0.3.56)

- [ ] N2637. **Spielhilfe für deinen Durchgang:** Was seit deinem letzten Spieltest (16.11.) neu ist
      und worauf du achten sollst, je Akt mit Ort. Am besten von vorn beginnen; ein alter Spielstand
      darf in der Beta verloren gehen. Starten: drei Sekunden auf „Profil“, oben die Karte
      „Schach-Abenteuer“, „Spiel öffnen“. Mit Netz lädt „Spiel herunterladen“ jetzt auch Maia: Im Spiel
      spielen alle Gegner menschlich mit Maia, egal was in den App-Einstellungen steht (ohne Netz
      startet ein schon geladenes Spiel auch ohne Maia). Lädt alles in einem Zug?
      **Überall:**
      · Karte dreifach, Figuren zweifach vergrößert: Figuren kleiner und schärfer. Alle Türen haben
      Figurgröße (nur das Diner in Maple Falls ist etwas niedrig). Passt die Figur überall durch?
      · Innenräume sind so groß wie ihr Haus außen (Garage, Hütte, Wohnwagen, Bibliothek, Akademie,
      Museum, Turnhalle). Wirkt ein Raum zu groß oder zu eng?
      · Statisten und Tiere sind echte Hindernisse (vorher lief man durch sie hindurch); Figuren
      sperren nur die Kachel unter ihren Füßen. Bleibst du irgendwo hängen?
      · Sitzende sitzen sichtbar auf Stuhl oder Bank (Carla, Dash, Slick in Lockport, Akademie);
      Stehende schauen zum Tresen, Brett oder Gesprächspartner.
      · Nach einer Partie genügt ein Schritt in den Ausgang. Meldungen wie „Neu im Tagebuch“ kommen
      erst nach dem Dialog, nacheinander.
      · Alle Dialoge sind geprüft und lektoriert (über 300 Stellen: erste Treffen, Reihenfolge,
      Rückbezüge, Ausgänge). Nach dem Abschied spricht Ambrose nicht mehr.
      · Fünf Straßenbegegnungen sind kurze Partien statt ganzer: ein erzählter Einstieg über dem
      Brett, dann ein Endspiel oder „Vorteil herausarbeiten in N Zügen“.
      **Akt 1 (Maple Falls, Cedar Creek):** Die Haustür bleibt zu, bis Ambrose auf dem Dachboden
      erwacht ist. Juno erzählt auf dem Weg nach Cedar Creek von Carla, auch wenn du die Tafel löst.
      Sternennacht: Mrs. Okafor schickt dich zuerst zu Mae, so kann man sie nicht mehr verpassen.
      **Akt 2:** Sperre im Zedernwald (Weg Cedar Creek nach Riverton): Benji vom Testteam von
      Perfect Move, Vorteil herausarbeiten in 10 Zügen. Pavillon Riverton jetzt offen mit Geländer
      und Fluss, Eingang über die Stufe. Nach Slicks Abschied nennt Juno das Turnier; eine Quest führt
      nach Hause zu Mamas Nein, erst dann öffnet der Kanalweg nach Ironwood. Dime am Kanalweg ist
      kurz. Nach dem Kauf ist die Kantine leer, Big Joe räumt.
      **Akt 3:** Sperre an der Raststätte vor der Glasbrücke: Imani, Russisch vorgegeben, dann
      Vorteil in 12 Zügen. Der Schiffskoch auf der Fähre: Endspiel Remis halten. „Es ist Sommer, und
      du bist fünfzehn“ kommt jetzt auf der Fahrt zum Diner.
      **Akt 4:** Sperre am Diner vor der Bergstraße: Zoe, Endspiel mit einem Bauern mehr gewinnen;
      ein Remis zählt hier als Fehlversuch. Kurz sind auch Mags im Hinterzimmer des Diners (Kreide-
      springer an der Seitenwand, dreimal klopfen) und Sol auf dem Gipfelfelsen in Summit City. Das
      Drachenfest am Brunnen ist erst am Abend nach Wards Bitte, vorher siehst du die Vorbereitung.
      Die Kreidenacht im U-Bahnhof der Capital (Kreidespringer neben dem Rollgitter) ist erst nach
      dem Finale.
      Bei allen drei Sperren: Nach dem dritten Fehlversuch lassen sie dich durch, Abbruch zählt nicht.
      Ist dir eine zu schwer, sag welche: Dann senkt Claude zuerst die Stärke, nicht die Versuche.
      **Schnell hinkommen:** Monatskarte (Pops in Riverton) oder Fernbus an der Kreuzung in
      Crossroads; im Tagebuch steht die laufende Quest.
      **Rückmeldung:** „N2637 ok“ oder je Akt eine Notiz, etwa „N2637 Akt 2: Benji zu stark“ oder
      „N2637 Akt 4: hänge am Brunnen fest“, gern mit Ort und Bildschirmfoto. Fehler im Spiel am
      schnellsten über Profil › Einstellungen › Fehler melden.

- [ ] N2638. **Deine Anmerkungen vom 19.11. (Beta):** Bitte beim Durchspielen nebenbei prüfen.
      1. Lange auf die Pfeiltasten drücken: Es wird kein Text mehr markiert, und kein Menü mit
         Kopieren oder Ausschneiden erscheint.
      2. Während einer Partie oder eines Rätsels liegt keine Sprechblase mehr auf dem Brett.
         Ambrose und der Gegner sprechen ober- oder unterhalb. Ist dort zu wenig Platz, rückt die
         Blase direkt über oder unter das Brett, und eine sehr lange Blase lässt sich rollen.
      3. Nach jedem Questschritt sagt eine Figur im Dialog, wohin es als Nächstes geht, zum Beispiel
         Juno in Riverton: Slick spielt im Parkpavillon. Neun Stellen hatten das vorher nicht.
      **Rückmeldung:** „N2638 ok“ oder die Nummer mit Notiz, etwa „N2638.2: Blase verdeckt die Uhr“.

- [ ] N2639. **Neue Einleitung (dein Wunsch vom 19.11.):** Ein neues Spiel beginnen (Admin-Menü ›
      Spiel öffnen › neues Spiel). Der Held steht mit Mama vor dem Haus an der Birch Lane. Bilder
      der Fahrt und des Hauses (bis die Gemini-Bilder E1 bis E4 da sind, nur Text), Mama spricht,
      du nimmst einen Karton und gehst mit ihr hinein. Im Wohnzimmer folgt am Abend die Ankunft
      mit der Kiste von Mrs. Whitlock; Mama sagt, wo die Treppe zum Dachboden ist. Im Tagebuch
      steht die neue Quest „Einzug an der Birch Lane“, und auf dem Dachboden beginnt wie bisher
      „Das Brett“. Sprichst du Mama vorher noch einmal an, erinnert sie an die Kiste.
      Entscheidung von mittel-2, schon umgesetzt, Widerspruch genügt: Vom Haus ins Wohnzimmer
      geht es mit einer Wahl statt zu Fuß, damit vor dem Dachboden nicht schon die ganze Stadt
      offen ist. Alte Spielstände bekommen die Einleitung nicht nachgereicht.
      **Rückmeldung:** „N2639 ok“ oder eine Notiz, etwa „N2639: lieber selbst ins Haus gehen“.

- [ ] N2640. **Reaktion nach jeder Partie und jedem Rätsel:** Nach der Ergebniskarte öffnet sich
      jetzt von selbst das Gespräch mit dem, der die Partie oder das Rätsel angeboten hat, etwa
      Ambrose nach der ersten Partie auf dem Dachboden („Du hast gewonnen …“). Wo der Ort danach
      wechselt, sagt das Gespräch, wohin. Bitte beim Durchspielen darauf achten, ob eine Reaktion
      fehlt oder nicht zum Ergebnis passt.
      **Rückmeldung:** „N2640 ok“ oder Ort und Notiz.

- [ ] N2641. **Zielpfeil nur auf Wunsch:** Ohne Zutun erscheint kein Pfeil mehr. Im Tagebuch steht
      vor jeder laufenden Aufgabe mit Ziel ein kleines goldenes Dreieck. Antippen zeigt den Pfeil
      zum Ziel (etwa zu Mama), nochmal antippen blendet ihn aus. Geht die Aufgabe einen Schritt
      weiter, wandert der Pfeil mit; ist sie erledigt, verschwindet er. Der Fehler mit dem Pfeil
      auf dem Spiegel ist behoben. Entscheidung von mittel-2 (Pfeil wandert mit), Widerspruch
      genügt.
      **Rückmeldung:** „N2641 ok“ oder eine Notiz.

- [ ] N2642. **Erzählungen zur richtigen Zeit:** Kommst du nach der ersten Lektion mit dem Brett
      die Treppe herunter, hält das Spiel kurz an: Die neunte Stufe knarrt, und unten sitzt Mama
      zwischen den Kartons. Das Gespräch mit ihr beginnt danach ohne die Treppe. Ebenso beim ersten
      Betreten von Darlenes Raststätte und Wards Hütte.
      **Rückmeldung:** „N2642 ok“ oder Stellen, an denen noch etwas zur falschen Zeit erzählt wird.

- [ ] N2643. **Bildausschnitt und Blitzwertung:** Auf großen Karten eilt der Ausschnitt beim Laufen
      etwas voraus und gleitet beim Stehenbleiben zurück, jetzt ohne Ruckeln (vorher Sprünge von
      drei Bildschirmpixeln). Wirkt es noch unruhig, schalte ich das Vorauseilen ganz ab. Eine
      Partie mit Zeitwahl, die du durchrauschst oder als Blitz spielst, zählt im Spiel nur halb
      (Niederlage gegen Clubchef 1 kostet 3 statt 4½ Punkte). Ambrose sagt dir ab dem 10. Zug
      höchstens zweimal je Partie, wenn du viel zu schnell oder zu langsam spielst (erst nach der
      ersten Clubnadel).
      **Rückmeldung:** „N2643 ok“ oder „N2643: Kamera lieber fest“.

- [ ] N2644. **Sternennacht in Cedar Creek:** Die Einladung von Mae steht wieder im Tagebuch, und
      die Nacht lässt sich nicht mehr ablehnen (Mae überredet dich zu ein paar Minuten). Bricht man
      mittendrin ab, bietet der Steg sie wieder an. Vorher konnte man sie leicht verpassen.
      Entscheidung von mittel-3, Widerspruch genügt.
      **Rückmeldung:** „N2644 ok“ oder eine Notiz.

### Neu in 0.3.55: Schach-Abenteuer, technischer Prototyp (7.11.2026)

Das Spiel ist noch kein Spiel, sondern der Durchstich: Zusatzpaket laden, ein Raum, laufen, ein
Dialog, eine Partie der App, zurück. Platzhaltergrafik. Einstieg nur über die Adresse, damit es
sonst niemand findet: schach-von-grund-auf.com/app/#abenteuer (oder in der installierten App die
Adresse mit „#abenteuer“ öffnen).

- [ ] N2616. Tagebuch im Abenteuer: Unter den offenen Aufgaben steht „Meine Spielstärke im Abenteuer: N“; N ist beim
      Start deine Wertung der App (klassisch) oder 600 ohne Wertung. Schon geprüft (Claude, 15.11.2026): 600 ohne
      App-Wertung, nach einer Niederlage gegen Ambrose 584, ein Wiedereinstieg ändert nichts, ein Sieg in der
      Übungspartie (Reisebrett) +16 (zählt fürs Abenteuer, nicht für die Wertung der App). Offen für dich: Verlierst du
      zweimal gegen Coach Delgado, steht in der dritten Partie in der Leiste unter dem Brett „Coach Delgado ist
      überheblich geworden.“, und er spielt spürbar lockerer (mehr Fehler). Die gelbe Trainerleiste gibt es in der
      Spielhülle nicht mehr; die Zeile steht im Pixelrahmen unter dem Brett, auch ohne Karten im Deck.
- [ ] N2620. Neue Karten (16 Stück): Die Läden hat Claude am 15.11.2026 geprüft (Kiosk Maple Falls: Ablenkung 10,
      Röntgenblick 30, Farbwahl 10; Pops in Riverton: Waage, Schmeichelei, Remisangebot, Monatskarte 80; Eisenwaren
      Ironwood: Auszeit, Was droht? 60, Kartentasche 450, danach passen vier Karten ins Deck). Offen für dich, in
      einer Partie: Werkzeugkarten nutzen die Werkzeuge des Buches auf der Partiestellung: Abzählen (sucht deine
      meistbedrohte Figur und zählt), Röntgenblick, Zielkompass, Faktorenwaage, Bauernkompass, Planfinder,
      Taktikspürnase, Endspielkompass, Turmregel, Phasenblick. „Was droht?“ zeigt als roten Pfeil, was der Gegner
      spielen würde, wenn er dran wäre (nur Schläge und Schachs zählen als Drohung). „Waage“ sagt, wer besser steht.
      „Remisangebot“ (nicht im Clubkampf): Der Gegner nimmt bei ausgeglichener Stellung an, sonst lehnt er ab.
      „Schmeichelei“ vor der Partie macht einen Straßengegner überheblich.
      Lernkarten gibt es seit 15.11.2026 nicht mehr für Buchkapitel, sondern im Spiel nach der passenden Lektion:
      Sam gibt Abzählen (nach der Runde „Todsünden“, wenn du ihn wieder ansprichst), Juno-Quest Gefahrenradar, Mama
      in der Kantine Ironwood die Faktorenwaage (nach eurer Partie, beim nächsten Ansprechen), Theo den Zielkompass
      und Nova „Was droht?“ (Akademie Silicon Bay, nach ihren Reihen), Batiste den Bauernkompass, Lou den Planfinder
      (Turnhalle Port Delacroix), Tomás die Taktikspürnase (Garage Desert Springs), Kit den Endspielkompass,
      Haraldsen die Turmregel und Ward nach Hastings 1895 den Phasenblick (Hütte Summit City). Wer die Karte schon
      gekauft hat, bekommt keine zweite. Bitte prüfen: Kommt nach Sams Todsünden-Runde seine Karte, und steht
      Abzählen danach in der Kartentasche? Sprüche erscheinen in der Deckwahl nur vor Partien gegen Straßengegner.
- [ ] N2621. Limo für Jo und Steckbriefe: Nach dem ersten Duell mit Skater Jo spricht sie dich noch einmal an und will
      eine Zitronenlimo. Am Kiosk von Mr. Patel kostet die Limo 5 Münzen (Patel: „Die trinkt nur Zitrone.“). Bring
      sie Jo: Sie verrät ihre Schwäche („Rückwärts zieh ich nicht gern“), die Limo ist weg. Neu seit 15.11.2026:
      Was Gegner verraten, steht je Gegner (bisher je Club, Jo und Sam teilten sich einen Eintrag). Im Tagebuch gibt
      es den Abschnitt „Gegner“: „Jo (vorbereitet)“ mit der Zeile „Blinder Fleck: übersieht Rückzüge“; vor
      dem nächsten Duell zeigt die Deckwahl dieselbe Zeile unter „Was du über den Gegner weißt“, auch ohne die Lupe
      des Uhrmachers (mit Lupe heißt der Kasten „Was die Lupe verrät“ und nennt die Zeile nur einmal). Nach Sams
      Runde „Todsünden“ steht Sam mit seiner Schwäche dort und Coach Delgado als „vorbereitet“. Schon geprüft
      (Claude): Limo 5 Münzen, Patels Satz, Jos Satz, zweiter Straßensieg am selben Tag nur +2. Bitte prüfen: Ist
      der Abschnitt „Gegner“ verständlich, und stört dich, dass „vorbereitet“ sonst noch nichts bewirkt?
- [ ] N2628. Einmal einrichten, damit die gekaufte Grafik auch in der App bei Cloudflare ankommt (sonst siehst du dort
      weiter die farbigen Platzhalter). Am Rechner: github.com › oben rechts dein Bild › Settings › Developer settings ›
      Personal access tokens › Fine-grained tokens › „Generate new token“. Name „Grafik für Cloudflare“, Ablauf ein
      Jahr, Repository access „Only select repositories“ › `schach-abenteuer-inhalte`, Permissions › Repository
      permissions › Contents › „Read-only“, dann „Generate token“ und den Schlüssel kopieren (nicht in den Chat).
      Dann dash.cloudflare.com › Workers & Pages › `schach-von-grund-auf` › Settings › Build › „Variables and
      secrets“ › Add: Typ „Secret“, Name `GRAFIK_TOKEN`, Wert einfügen, speichern. Danach einen neuen Bau auslösen
      (oder auf meinen nächsten Push warten). Prüfen: In der Beta-App im Schach-Abenteuer siehst du echte Böden,
      Möbel und Figuren statt farbiger Kacheln; die Startkarte lädt dann „Spiel herunterladen“ mit etwa 45 MB.
      Der Schlüssel kann nur lesen und nur dieses eine Repository.
- [ ] N2629. Schach-Abenteuer mit echter Grafik (nach N2628, Beta-App): Maple Falls mit Möbeln, Figuren laufen mit
      Animation, im Dialog steht das Porträt neben dem Namen und bewegt beim Sprechen die Lippen (in Erinnerungen
      der junge Ambrose), Fenster und Knöpfe haben Pixelrahmen in Navy und Gold. Sag, was dir nicht gefällt (Figur, Möbel, Farbe der Rahmen); alles schnell änderbar. Hinweis: Die
      dunkelste Hautfarbe der Grafik ist nur mittelbraun; ein dunklerer Ton ist schon nachgefärbt (Okafor, Okoro,
      Nia, Odile, Marcus, Pops). Widerspruch genügt.
- [ ] N2630. Schach960 (Zufallsschach) bei der Bläserin Mabel, die nach dem Wiederaufbau vor dem Musikhaus in Port
      Delacroix steht, und bei Ambrose am Varianten-Tisch in Crossroads. Schon geprüft (Claude, 15.11.2026): Mabel
      erklärt die Regeln, das erste Set startet mit gemischter Grundreihe, ungewertet; am Varianten-Tisch startet
      „Schach960 gegen Ambrose“. Offen für dich: Zur Rochade tippst du erst den König an, dann den eigenen Turm;
      klappt das auf dem Handy? Die Engine spielt mit; Varianten zählen nicht für Nadeln oder Wertung.
- [ ] N2602. Partie auswerten, in der Zeitleiste eine Fehlerkarte (oder die erste klare Abweichung) suchen: Unter „Besser
      war …“ steht eine Zeile mit Glühbirne, etwa „Guter Schlag ausgelassen (Kapitel 1)“. Antippen klappt den Satz mit
      der ganzen Fundstelle auf, „Üben“ öffnet den passenden Trainer. Bei „Verpasst“ steht nur diese Zeile. Sagen Warum-
      und Glühbirnen-Zeile dasselbe (gleicher Trainer, gleiches Thema), steht nur die Warum-Zeile da.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); nicht geprüft: Karte „Verpasst“ nur mit dieser Zeile.
- [ ] N2603. Im Rückblick Zug für Zug zu einem Zug mit „?!“ oder „?“ gehen: Unter „Besser war …“ steht die Glühbirnen-
      Zeile mit Kapitel; aufgeklappt gibt es einen eigenen Knopf „Üben“. Bei „gut“ und „sehr gut“ erscheint sie nie.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (an 8. Sc3? „Guter Schlag ausgelassen (Kapitel 1)“ mit eigenem „Üben“; am Theoriezug keine Zeile; neuer Test); nicht geprüft: „?!“.
- [ ] N2604. Nach mindestens 5 ausgewerteten Partien, in denen in 3 oder mehr derselbe Fehler vorkam, zeigt die Karte
      „Heute“ eine Kachel wie „Drohung stehen gelassen · 3 von 5 Partien · Kapitel 1“. Der Knopf öffnet den Trainer; nach
      dem Üben verschwindet die Kachel bis zur nächsten Partie. (Ältere Partien bekommen die Kürzel im Leerlauf
      nachberechnet.)
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); nicht geprüft: Kachel verschwindet nach dem Üben.

### Neu in 0.3.53: Aussehen nur noch im Profil, Fehler mit Buchbezug (7.11.2026)

- [ ] N2600. Profil → Einstellungen: Oben gibt es keine Brettvorschau mehr, nur die Zeile „Aussehen (Brett, Figuren,
      Rahmen) im Profil wählen“. Ein Tipp führt zur Profilkarte „Dein Aussehen“ (bisher „Deine Extras“), Reiter
      „Brett“ offen. Dort stehen alle Bretter, die freischaltbaren mit Schloss und Bedingung („Nacht und Gold“: „Mit
      allen Orden der Buchteile“). „Grün“ antippen: Vorschau und jede Abbildung im Buch werden grün. Reiter „Figuren“
      ebenso (etwa „Merida“; „Gold“ mit Schloss „Ab Stufe 5“). Der Schalter „Koordinaten“ steht unter den Brettern.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2601. Auswertung einer Partie mit Fehler oder Patzer: Auf der Fehlerkarte der Zeitleiste steht unter „Besser war“
      eine Zeile mit Buchsymbol, etwa „Drohung stehen gelassen (Kapitel 1)“. Tipp klappt den Satz mit der ganzen
      Fundstelle auf; „Üben“ neben „Zur Stellung“ öffnet den passenden Trainer (bei Taktik mit dem Motiv). Passt der Grund zum Zug?
      Fehlt die Zeile, wo ein klarer Grund erkennbar ist? Bei „Verpasst“ gibt es nur die Zeile zum besseren Zug.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); offen für dich: Passt der Grund zum Zug, fehlt die Zeile irgendwo?

### Neu in 0.3.52: Linienknöpfe in der Zugfolgenleiste (7.11.2026)

- [ ] N2599. Eine ausgewertete Partie auf dem Handy öffnen und mit Vor/Zurück (oder den Pfeiltasten) ganz durchgehen,
      einmal einzeilig und einmal aufgeklappt. Über der Zugnavigation steht immer die Zeile „Linie:“ mit drei
      Symbolen (Partie, Glühbirne, Schwerter) in einer Zeile; Glühbirne und Schwerter sind nur an Fehlern
      antippbar, sonst ausgegraut. Brett und Weiter-Knopf bleiben genau an ihrem Platz. Unter dem Brett gibt es
      keine Knöpfe „Besserer Zug“ und „Bestrafung“ mehr. An einem Fehler spielt ein Tipp auf Glühbirne oder
      Schwerter die Folge Zug für Zug vor (nochmal tippen hält an); danach geht man mit Vor/Zurück selbst durch,
      „Partie“ (erstes Symbol) führt zurück.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).

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
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Meldung „Lxf7+ gibt Schach und gehört deshalb dazu, auch wenn der Schlag Material kostet (Lxf7+ Kxf7: −2 Bauerneinheiten).“; in Schritt 2 nicht verlangt). Gefunden durch Durchspielen zufälliger Runden, deshalb kein dauerhafter Test.
- [ ] N2587. 10-Minuten-Partie gegen einen Bot zu Ende spielen: Die Auswertung danach ist nach wenigen
      Sekunden fertig (vorher etwa 20 Sekunden). Grund: Jeder Zug hat die gerade rechnende Stellung
      verworfen und neu angefangen; jetzt wird das Ergebnis behalten und eine laufende Rechnung
      weiterverwendet.
- [ ] N2588. Auswertung, Zeitleiste: Kacheln „Absichtlicher Fehler der Engine“ erscheinen nur noch, wenn der Zug
      wirklich ein Fehler, Patzer oder verpasster Gewinn war, nicht bei kleinen Ungenauigkeiten.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (nur der echte Patzer der Engine 12... Td8 hat eine Kachel, die zwei Kleinigkeiten nicht).
- [ ] N2589. Kapitelseite (etwa Kapitel 0), Karte „Dein Fortschritt“: Tipp auf den Ring Abbildungen oder
      Warum-Fragen rollt zu den Abbildungen, Tipp auf den Ring Lernziele öffnet die Checkliste mit der
      aufgeklappten Karte dieses Kapitels, Tipp auf Übungen rollt zu den Übungen.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (geprüft an Kapitel 1).
- [ ] N2590. Startseite, Karte „Heute“: Wer schon Aufgaben am Brett lösen kann, sieht unter den Vorschlägen
      jetzt auch „Kurzplan“ (etwa 15 Minuten, fertig zusammengestellt); Tipp öffnet die Kurzpläne.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Kurzplan unter den Vorschlägen, Tipp öffnet die Kurzpläne; neuer Test).
- [ ] N2591. Einstellungen › Bedienung, ganz unten „Was zuerst kommt“: Buch / Spielen / Umsehen. Auf „Spielen“
      stellen: Die Karte „Heute“ schlägt nach fälligen Wiederholungen zuerst Partie, Taktikthema und
      Kurzplan vor. Die Startwahl der ersten Tour (Einstellungen › Hilfe › Rundgang) stellt das
      ebenfalls ein.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für „Spielen“: Partie steht vorn, danach Kurzplan; neuer Test. Nicht geprüft: Startwahl der Tour.
- [ ] N2593. Lernpfad „Dein Weg durchs Buch“: Unter dem Balken stehen jetzt auch „… Warum-Fragen“ und
      „… Lernziele“. In Kapitel 1 eine Warum-Frage richtig beantworten und in der Gesamt-Checkliste ein
      Lernziel von Kapitel 1 abhaken: Beide Zahlen sinken um eins, die Station füllt sich. Golden wird
      sie erst, wenn auch Warum-Fragen und Lernziele erledigt sind. Ein Orden, den du schon hast, bleibt
      golden (im ⓘ: „Den Orden „Teil …“ hast du schon.“); er zählt weiter nur Abbildungen und Übungen.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Kapitel 1: eine Warum-Frage und ein Lernziel, „18 Warum-Fragen“ → 17, „6 Lernziele“ → 5, die Station steigt; neuer Test); nicht geprüft: goldene Station und Orden.
- [ ] N2596. Ausgewertete Partie: einen Fehler (?) antippen, unter der Zugliste „Besserer Zug“ oder „Bestrafung“
      wählen. Die Folge steht in Klammern hinter dem Fehler, darunter „Linie: Partie / Besserer Zug /
      Bestrafung“. Vor/Zurück und die Pfeiltasten gehen Zug für Zug durch die Folge, Brett und
      markierter Zug passen immer zusammen; Zurück am ersten Zug oder „Zurück zur Partie“ führt in
      die Partie zurück.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Linie heute über die Knöpfe aus N2599).
- [ ] N2597. Karte „Heute“ › „Wann übst du?“ › Übungszeit planen: Wochentage und Dauer wählen (10 bis 60
      Minuten), keine Uhrzeit mehr. An einem Plantag steht beim Öffnen „Heute ist dein Übungstag: 0 von
      20 Minuten geschafft“ mit Balken und „Jetzt üben“. Ein paar Minuten in der App üben (lesen,
      ziehen, lösen): Die Zahl steigt etwa jede Minute; wer drei Minuten nichts antippt, zählt nicht
      weiter. Im Reiter der Karte steht „7/20 Min“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); nicht geprüft: Minuten zählen beim Üben, „7/20 Min“ im Reiter.
- [ ] N2598. Mindestens 5 gewertete Partien gegen Bots in derselben Zeitart spielen und auswerten lassen. Liegt eine
      Phase deutlich (mindestens etwa 150 Punkte) unter deiner Schätzung, steht auf der Karte „Heute“
      die Kachel „Aus deinen Partien“: „Ein Hinweis aus deinen letzten 8 Partien: Im Endspiel spielst
      du etwa 250 Punkte schwächer als sonst …“ mit Kapitel und Trainer (Eröffnung: Kapitel 2,
      Repertoire; Mittelspiel: Kapitel 7, Taktik; Endspiel: Kapitel 8, Endspieltrainer). Bei weniger
      Partien oder ausgeglichenen Phasen kommt kein Hinweis.
      Vorgeprüft: Abweichung. Für die Eröffnung bestanden (zehn gewertete Partien mit schwacher Eröffnung: „Aus deinen Partien“, Kapitel 2, Repertoire-Trainer; neuer Test). Für das Endspiel kann der Hinweis nie kommen und im Blitz für keine Phase: Das Elo-Modell gibt dort auch nach zehn Partien eine zu breite Spanne (Endspiel Schnellschach ±954, Grenze 460). Frage an dich: so lassen (Endspiel nur als Eindruck) oder die Grenze fürs Endspiel lockern?
- [ ] N2592. Karte „Heute“ › Ziel wählen: Mit einer Wertung um 900 stehen keine Engine-Bots und keine Orden der
      Stufen 6 bis 10 mehr unter den Vorschlägen, wohl aber Bots bis etwa 1200 und Kapitelziele. Ohne
      Wertung zählt der stärkste besiegte Bot.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (zehn Wertungspunkte bei 900: Bots bis Stufe 4–5 und „Teil Grundlagen“, keine Engine-Bots, keine Stufe 6 bis 10; neuer Test); nicht geprüft: ohne Wertung.

### Neu in 0.3.51: Taktiktrainer – mehrere Motive und gleich schnelle Matts (6.11.2026)

Deine Frage: „Können mehrere Motive gleichzeitig zutreffen?“ Ja, bei gut der Hälfte der Aufgaben
(574 von 1067 mit Motiv). Bei „Welches Motiv war es?“ zählt jetzt jedes zutreffende Motiv; die
Meldung nennt die anderen. Gleich gute andere Züge gibt es laut Engine fast nie (Lichess-Aufgaben
sind so ausgesucht); angenommen wird jetzt zusätzlich jedes Matt, das genauso schnell ist.

- [ ] N2594. Training → Taktiktrainer, Motiv „Hinlenkung“ oder gemischt: Aufgabe lösen (etwa Abb. 7.14:
      Th8+ Kxh8 Sxf7+), dann bei „Welches Motiv war es?“ „Doppelangriff“ wählen. Erwartet: „Richtig.
      Ebenfalls dabei: Hinlenkung.“ Bei einer anderen Aufgabe ein falsches Motiv wählen: „Falsch.
      Zutreffend waren: …“ mit allen passenden Motiven.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Abb. 7.14 lösen, „Doppelangriff“: „Richtig! Ebenfalls dabei: Hinlenkung.“; neuer Test). Wortlaut bei falschem Motiv mit nur einem zutreffenden: „Nicht ganz. Das Motiv: Doppelschach.“ (bei mehreren „Zutreffend waren: …“).
- [ ] N2595. Abb. 7.60 (Damiano-Matt, gemischt oder Mattbilder): nach 1. Th8+ Kxh8 statt 2. Dh5+ den Zug 2. Dh1+
      spielen. Erwartet: kein „falsch“, Schwarz antwortet Kg8, 3. Dh7# löst die Aufgabe. Ein
      langsameres Matt (Abb. 7.11: Sc5+ statt Sd6+) bleibt falsch.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Abb. 7.60: 2. Dh1+ Kg8 3. Dh7# löst die Aufgabe; Abb. 7.11: Sc5+ bleibt falsch mit „laut Engine schwächer“; neuer Test).

### Neu in 0.3.50: Marken ohne Nummer (1.11.2026)

- [ ] N2582. Variante → Stift: drei goldene Felder nebeneinander (je zweimal antippen) und ein roter Pfeil. In der
      Legende „Nummern von Gold“ aufklappen: Jede Nummer hat „ohne Nummer“. Zweimal antippen (an 2 und 3) → am
      Brett nur noch Gold 1, die Felder bleiben markiert; die beiden stehen in der Liste als „– Feld e4“ mit
      „Nummer geben“. Beschriftete Nummern behalten ihren Text, auch wenn sie dadurch eine neue Nummer
      bekommen.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2583. „Nummern von Rot“ aufklappen, Haken „Nummern“ weg: Alle roten Marken der ganzen Variante sind ohne
      Nummer, der Text bei „Rot“ in der Legende gilt für alle. Haken wieder an: Die Nummern sind zurück.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2584. PGN der Variante sichern und wieder einlesen: Marken ohne Nummer bleiben ohne Nummer.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).

### Neu in 0.3.49: Goldener Pfeil in Varianten wie in der Auswertung (1.11.2026)

- [ ] N2581. Analysierte Variante: Steht ein Zug am Brett, der nicht der beste war (etwa 3... Sf6?? im Schäfermatt),
      zeigt ein goldener Pfeil den besseren Zug, wie in der Partieauswertung. Der grüne Pfeil für den
      besten nächsten Zug ist weg. Der Schalter „Engine-Pfeil“ blendet den goldenen Pfeil aus und ein.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).

### Neu in 0.3.48: Bearbeiten und Löschen auffindbar (1.11.2026)

- [ ] N2574. Training › Varianten: Neben jeder Variante stehen ein Stift und ein Papierkorb. Der Stift öffnet
      Name und Kommentar („Speichern“ übernimmt, „Abbrechen“ nicht), der Papierkorb fragt „„…“ endgültig
      löschen?“. In einer geöffneten Variante steht hinter dem Titel ein goldener Stift; Antippen öffnet
      Name, Kommentar, Teilen und Löschen. Schon umgesetzt, Widerspruch genügt.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2576. **Engine-Folgen vorab an:** Eine ausgewertete Partie mit mindestens einem eigenen Fehler, Patzer oder
      verpassten Gewinn öffnen → Gabel-Knopf am Brett: Der Schalter „Engine-Folgen übernehmen („Besser
      war …“, „So wird bestraft“)“ ist jetzt schon angehakt → „Öffnen“. An jedem eigenen Fehler zweigt
      „Besser war (Engine)“ ab, bei Fehler und Patzer zusätzlich nach deinem Zug „So wird bestraft
      (Engine)“. Ungenauigkeiten bekommen keine Folgen. Ebenso unter Varianten › Neue Variante ›
      Partie. Schon umgesetzt, Widerspruch genügt.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Haken vorab an); nicht geprüft: Abzweige an den Fehlern einer ausgewerteten Partie.
- [ ] N2577. **Fehler des Gegners:** Am Gabel-Knopf einer ausgewerteten Partie steht unter „Engine-Folgen
      übernehmen“ der Haken „Auch an Fehlern des Gegners“ (vorab an). Mit beiden Haken bekommen auch die
      Fehler des Gegners „Besser war (Engine)“ und „So wird bestraft (Engine)“. Ebenso unter Neue Variante ›
      Partie. Schon umgesetzt, Widerspruch genügt.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Haken vorab an).
- [ ] N2578. **Engine-Folgen nach der Analyse einer Variante:** Variante mit einem Fehler (etwa PGN „1. e4 e5 2. Dh5 Sc6 3. Lc4 Sf6 4. Dxf7#“ einlesen) → „Analyse“ → wenn sie fertig ist, erscheint oben „Engine-
      Folgen übernehmen (+… Züge)“. Antippen legt an Fehlern, Patzern und verpassten Gewinnen beider Seiten
      „Besser war“ und „So wird bestraft“ als Abzweige an (Züge mit Chip-Zeichen „Engine“); danach
      verschwindet der Knopf. Ungenauigkeiten bekommen nichts.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2579. **Karte:** Rechts neben dem letzten Zug jeder Linie steht ihre Endstellung als kleines Brett.
      Nach der Analyse steht neben jedem Brett der Karte (Abzweige und Endstellungen) ein schmaler
      Bewertungsbalken (unten Weiß, oben Schwarz): So sieht man beim Scrollen, welche Linie wem liegt.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2580. **Baumansicht:** Nach der Analyse steht links an jedem kleinen Brett der Abzweig-Karten der
      Bewertungsbalken mit Zahl.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (nach der Analyse drei Balken mit Zahl, etwa +1,6, an den Abzweig-Karten; neuer Test).
- [ ] N2575. Touren (Kompass): Die Tour der Variante beginnt mit dem Titel (Bearbeiten, Löschen), die Tour der
      Liste nennt Stift und Papierkorb, die Touren von Lernsammlung und Fehlerdatenbank sagen, dass ein
      aufgeklappter Eintrag „Bearbeiten“ und „Löschen“ (mit „Rückgängig“) hat.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Texte und Durchlauf aller Touren).

### Neu in 0.3.47: Meisterpartien statt Studien, gespeicherte Werte (1.11.2026)

- [ ] N2570. Varianten → Neue Variante: Statt „Studie (Kapitel 10)“ steht jetzt die Kachel „Meisterpartie“
      (Krone). Oben „Quelle“: „Aus dem Buch“ listet die Meisterpartien aus Kapitel 11 (etwa Morphys
      Opernpartie) und öffnet sie wie die Abbildung, mit den Varianten des Buches. „Berühmte Partien“
      und „Aktuelle Turniere“ listen die Zusatzpartien von „Zug erraten“ (Hinweis „Zusatzinhalt“);
      „Anderssen – Kieseritzky, Freie Partie, London 1851“ öffnet die Unsterbliche Partie als Variante ab der
      Grundstellung. Schon umgesetzt, Widerspruch genügt.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); nicht geprüft: „Aktuelle Turniere“.
- [ ] N2572. **Speichern nur per Abfrage:** Neue Variante aus der Grundstellung, 1. e4 ziehen: oben steht
      „Geändert · nicht gespeichert“ mit dem Knopf „Speichern“; in der Liste „Varianten“ ist noch nichts.
      „Zurück“ (oben, Zurück-Taste oder untere Leiste) fragt „Variante speichern?“ mit Speichern, Nicht
      speichern, Abbrechen. „Karte“, „Von hier spielen“ und „Abfragen“ fragen vorher „Dafür muss die
      Variante gespeichert sein“. An einer Abbildung mit eigenen Zügen fragt der Gabel-Knopf „Deine
      Züge … speichern?“ (oder „Nur das Buch öffnen“); „Als Variante speichern“ in der Zugleiste und
      „Einlesen und speichern“ bei PGN sind selbst die Antwort. Eine gespeicherte Variante speichert
      Änderungen weiter von selbst. Schon umgesetzt, Widerspruch genügt.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); nicht geprüft: Nachfrage bei Karte, Von hier spielen, Abfragen und am Gabel-Knopf einer Abbildung.
- [ ] N2573. **Bretter in der Karte:** Abb. 2.40 als Variante → „Karte“: Unter „3. Sxe5“ und „4. De2!“ steht je
      ein kleines Brett mit der Stellung am Abzweig und den blauen gepunkteten Pfeilen (Stern am
      Hauptzug, „2“, „3“ …); die Nebenäste beginnen darunter. Ein Tipp aufs Brett springt zu diesem
      Abzweig. Zoomen macht die Bretter größer. Schon umgesetzt, Widerspruch genügt.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2571. Eine ausgewertete Partie → Moment „Als Variante“ (oder Gabel in der Auswertung) → in der
      Variante „Analyse“ einschalten: Die Partiezüge haben sofort ihre Symbole und Werte (aus der
      Auswertung übernommen); gerechnet wird nur, was neu dazukommt (eigene Abzweige). Der Zähler
      „läuft … von …“ zählt nur diese.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Zugarten sofort da; „Analyse“ rechnet nur die 3 neuen Stellungen der Abzweige; neuer Test).

### Neu in 0.3.46: Variationsbrowser, Zurück-Taste (1.11.2026)

- [ ] N2500. Training: Kachel „Varianten“ (noch leer) öffnen; „Neue Variante“ zeigt sieben Kacheln.
      Vorgeprüft: Abweichung, nur im Text: „Neue Variante“ zeigt heute neun Kacheln (dazu „Ganze Eröffnung“ und „Meisterpartie“); sonst wie beschrieben.
- [ ] N2501. Abb. 2.40 → Brettschalter „Variante“: Zugleiste mit Gabel „2“ nach 3. Sxe5, Chips „★ 3... d6!“ und „2 3... Sxe4?!“, auf dem Brett zwei blaue gepunktete Pfeile mit Stern und „2“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2502. Dort 3... De7 ziehen: Status „Gespeichert unter Varianten“, Gabel zeigt „3“, De7 in Gold.
      Vorgeprüft: Abweichung, nur im Text: Seit N2572 steht nach dem Zug „Geändert · nicht gespeichert“, erst „Speichern“ legt die Variante an; danach Gabel „3“ und De7 in Gold wie beschrieben.
- [ ] N2503. Langer Druck auf einen Zug öffnet das Menü (Zugzeichen, Zur Hauptvariante machen, Kommentar, Ab hier löschen); nach „Ab hier löschen“ holt „Rückgängig“ die Züge zurück.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); nicht geprüft: langer Druck selbst (geprüft über den Knopf „Menü am Zug“), Zugzeichen.
- [ ] N2504. „+ Notiz zu diesem Zug“: Text schreiben, App schließen und neu öffnen – der Kommentar ist da, der Zug hat einen goldenen Punkt.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Neuladen statt App schließen); nicht geprüft: goldener Punkt.
- [ ] N2505. Titel antippen: umbenennen, Kommentar zur Variante (erscheint eingeklappt oben), PGN in Lichess als Studie einfügen (Varianten, Kommentare, Zeichen kommen an), Variante löschen mit Rückfrage.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für Umbenennen und Löschen; nicht geprüft: Kommentar oben, Einfügen in Lichess.
- [ ] N2506. Abb. 2.2 mit „Ziehen“ eigene Züge spielen, in „Deine Züge“ „Als Variante speichern“: Variante öffnet am letzten eigenen Zug; an der Abbildung steht danach „1 eigene Variante ›“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (neuer Test).
- [ ] N2507. Liste: „PGN“ → eine Lichess-PGN mit Varianten einfügen → Variante öffnet mit allen Abzweigen; FEN einfügen öffnet die Stellung.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2508. Neue Variante aus Partie, Fehlerdatenbank, Lernsammlung und „Stellung aufbauen“ ausprobieren (Titel, Kommentare aus Satz bzw. Plan).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2509. Ausgewertete eigene Partie mit Patzer: Gabel im Rückblick → Schalter „Engine-Folgen übernehmen“ → Abzweige „Besser war (Engine)“ und „So wird bestraft (Engine)“ (kursiv mit Chip-Zeichen), einzeln löschbar.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Abzweige „Besser war (Engine)“ an 8. Sc3? und 12. O-O-O??, dazu am Patzer der Engine; neuer Test); nicht geprüft: einzeln löschen.
- [ ] N2510. Partienliste und Auswertung zeigen die Zahl eigener Varianten einer Partie.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Chip „1 eigene Variante“ in der Auswertung, Marke in der Partienliste; neuer Test).
- [ ] N2511. „Von hier spielen“ in einer Variante: Spielen zeigt „Probepartie: zählt nicht“, Partie gegen einen Bot, „Probepartie beenden“ → „Als Variante speichern“ → Züge als Abzweig mit Kommentar; Partienliste, Wertung, Rekorde und Tagesziel unverändert.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); nicht geprüft: Wertung, Rekorde und Tagesziel bleiben unverändert (geprüft nur die Partienliste).
- [ ] N2512. „Von hier spielen“ aus dem Gabel-Blatt der Auswertung: Farbe wie in der Partie; nach „Verwerfen“ bleibt nichts gespeichert.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Probepartie mit Weiß wie in der Partie; nach „Verwerfen“ keine Variante; neuer Test).
- [ ] N2513. Datensicherung mit Varianten: Rückfrage nennt „Varianten: n“; Einspielen auf einem zweiten Gerät bringt sie mit.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Einspielen einer Sicherung mit Varianten).
- [ ] N2514. Tour auf beiden neuen Bildschirmen (Kompass oben rechts).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2515. Englisch: beide Bildschirme in englischer Sprache ansehen.
- [ ] N2516. Abb. 2.40 → „Variante“ → Schalter „Stift“: Gold wählen, d8 und h4 antippen (Pfeil mit „1“), e5 zweimal antippen
      (goldener Rahmen mit „2“ in der Ecke), Rot f6–e4 (rot „1“). Status „Gespeichert unter Varianten“, die blauen Pfeile sind
      weg, solange der Stift an ist.
      Vorgeprüft: Abweichung, nur im Text: Der Status heißt zuerst „Geändert · nicht gespeichert“, „Gespeichert“ erst nach „Speichern“ (seit N2572); Pfeil, Rahmen, Nummern und Ausblenden der blauen Pfeile wie beschrieben.
- [ ] N2517. Denselben Pfeil noch einmal setzen nimmt ihn weg, die Nummern rücken nach. Radierer leert die Stellung,
      „Rückgängig“ holt alles zurück.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2518. Legende: Goldzeile beschriften („Druck“), Rot aufklappen und „Rot 1“ beschriften; „Fertig“ – die Legende zeigt
      nur das Beschriftete; App schließen und neu öffnen, alles ist noch da.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Neuladen statt App schließen).
- [ ] N2519. Eigenen Zug 3... De7 ziehen, „Baum“: Karte „nach 3. Sxe5“ mit Mini-Brett, Pfeilen ★/2/3 und drei Knöpfen
      (Hauptvariante, „7 Züge · 1 Abzweig“, „1 Zug · eigene“), darunter eingerückt „in 3... Sxe4?!“. Tipp auf „3... Sxe4?!“
      springt dorthin.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2520. „Karte“: ganze Variante als Karte, Hauptvariante oben gold, De7 in Gold; mit einem Finger in alle Richtungen
      schieben, mit zwei Fingern zoomen, −/+/„Alles zeigen“/„Zur Stellung“ ausprobieren.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2521. Auf der Karte einen Zug antippen: Die Variante öffnet genau an dieser Stellung; „Zurück“ in der Variante führt
      zur Abbildung (kein zweiter Entwurf).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2522. Karte „Als Liste“: alle Züge, Abzweige eingerückt; mit VoiceOver/TalkBack bedienbar.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für die Liste; nicht geprüft: VoiceOver/TalkBack.
- [ ] N2523. Titel antippen → „PGN kopieren“ und in Lichess als Studie einfügen: Pfeile und Rahmen erscheinen (Gold als
      Gelb, Grau als Blau), die Texte „Gold 2: …“ und „Legende Gold: …“ stehen im Kommentar. Dieselbe PGN in der App unter
      „Varianten → PGN“ einlesen: genaue Farben, Nummern und Texte kommen zurück.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für das Einlesen in der App; nicht geprüft: Einfügen in Lichess.
- [ ] N2524. Eine Lichess-Studie mit Pfeilen als PGN einlesen: Pfeile und Felder in Gold/Rot/Grün/Blau sind da; Englisch
      einstellen und Stift, Legende, Baum und Karte ansehen; Tour auf Variante und Karte (Kompass).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für Pfeile und Felder; nicht geprüft: Englisch und Tour.
- [ ] N2560. Varianten → PGN: „1. e4 e5 2. Sf3 Sf6 3. Sxe5 Sxe4 4. De2 Sf6 5. Sc6+“ einlesen, „Analyse“ antippen: oben
      läuft „Analyse … von … Stellungen“, du kannst dabei weiter blättern und ziehen.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2561. Nach der Analyse: hinter jedem Zug ein Symbol (4... Sf6 rotes „??“, 5. Sc6+ grüner Stern), am Brett
      dieselbe Marke am Zielfeld, links der Balken mit Zahl, ein grüner Pfeil zeigt den besten Zug der gezeigten Stellung.
      Vorgeprüft: Abweichung, nur im Text: Statt des grünen Pfeils zeigt seit 0.3.49 ein goldener Pfeil den besseren Zug (N2581); Symbole, Marke und Balken wie beschrieben.
- [ ] N2562. Die Chips „Symbole“, „Balken“, „Engine-Pfeil“ blenden je ihr Teil aus und ein; App schließen und neu öffnen:
      die Wahl ist gemerkt, die Werte sind noch da (keine neue Analyse).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2563. In der analysierten Variante einen neuen Zug ziehen: nur er wird nachgerechnet („Analyse 1 von 1“), danach
      hat er Symbol und Balken.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2564. Analyse einer langen Variante starten und „Abbrechen“ tippen: Der Knopf ist wieder aus, fertige Stellungen
      behalten ihre Symbole; „Analyse“ noch einmal rechnet nur den Rest.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); nicht geprüft: zweite Analyse rechnet nur den Rest.
- [ ] N2565. Analyse starten und die Variante verlassen (etwa ins Buch): später zurück – die Analyse ist im Hintergrund
      fertig geworden.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Analyse gestartet, ins Buch gewechselt, später zurück: fertig, mit Zugarten; neuer Test).
- [ ] N2566. Titel → „Als PGN-Datei sichern“ und in Lichess als Studie einfügen: Lichess zeigt die Bewertungen
      (`[%eval]`). Dieselbe Datei in der App einlesen: Symbole und Balken sind sofort da.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für das Einlesen in der App; nicht geprüft: Lichess zeigt die Bewertungen.
- [ ] N2567. Eine Lichess-Studie mit Engine-Bewertungen als PGN einlesen: Balken sofort; Symbole erst nach „Analyse“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (PGN mit „[%eval]“: Balken sofort, Zugarten erst nach „Analyse“; neuer Test).
- [ ] N2568. „Von hier spielen“, ein paar Züge, dann über die Leiste zu „Spielen“: oben die Karte „Probepartie läuft“
      („zählt nicht · gegen …“); „Weiterspielen“ führt zurück, „Beenden“ bietet „Als Variante speichern“ und „Verwerfen“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2569. Englisch einstellen und Analyse, Chips, ⓘ und die Probekarte ansehen; Tour der Variante (Kompass) zeigt den
      Schritt „Analysis“.
- [ ] N2525. Varianten → Neue Variante → „Ganze Eröffnung“: Italienische Partie, „Aus der Praxis“ anhaken, Band
      wählen, Vorschau „Buch … · Praxis … Züge“ → Öffnen: Variante öffnet nach 3. Lc4 mit vielen Fortsetzungen; nach
      3... Lc5 stehen auch 4. Sg5 (Übung 8) und 4. b4 (Evans); erster Praxiszug hinter dem Buch mit „Praxis (Lichess)“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2526. Steckbrief (z. B. Spanische Partie) → „Ganze Eröffnung als Variante“; außerdem „Nur Praxis“ (z. B.
      Wiener Partie) ausprobieren.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Steckbrief Spanische Partie › „Ganze Eröffnung als Variante“; „Nur Praxis (Lichess)“ › Wiener Partie: „Buch 0 · Praxis … Züge“; neuer Test).
- [ ] N2527. Übung 8 (Abb. 2.148): vor dem Lösen kein „Als Variante öffnen“, nach „Lösung zeigen“ schon; die
      Variante steht nach 4. Sg5, dahinter 4... Dxg5. Ebenso nach einer Taktik- oder Repertoire-Aufgabe (mit Lösung).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für Übung 8; nicht geprüft: Taktik- und Repertoire-Aufgabe.
- [ ] N2528. Variante (etwa aus Abb. 2.40) → „Abfragen“: Seite wählen, „Ab dem Anfang“, falscher Zug zeigt den
      Pfeil, ein Zug aus einem anderen Abzweig gilt nicht als Fehler, Linien nacheinander, Ergebnis am Ende.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2529. Lernsammlung: beim Anlegen (oder Bearbeiten) unter „Notiz“ eine Variante wählen bzw. „Neue Variante
      aus dieser Stellung“; am Eintrag „Varianten abfragen (1)“; in „Abfragen“ nach „Plan zeigen“ „Varianten abfragen“.
      Dasselbe beim Bearbeiten eines Fehlereintrags; „lösen“ nimmt die Verknüpfung wieder weg.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für die Lernsammlung; nicht geprüft: Fehlereintrag und „lösen“.
- [ ] N2555. Buch › „Dein Weg durchs Buch“ › ein Bündel „Nebenaufgaben“ antippen, dann die
      Zurück-Taste (Android) oder die Zurück-Geste: Nur das Fenster schließt sich, der Lernpfad
      bleibt. Ein zweites Zurück führt zum Buch.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2556. Profil › ein Abzeichen antippen › Zurück-Taste: Das Fenster schließt sich, die App
      bleibt offen. Dasselbe mit „Teilen“ unter einer ausgewerteten Partie und mit „Partie
      einstellen“ auf Spielen.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2557. Einen Link `schach-von-grund-auf.com/app/#aufgabe-taktik-` (abgeschnitten) öffnen:
      Es erscheint „Dieser Link ist ungültig oder unvollständig.“ (nicht still das Buch). Ein Link mit
      angehängtem `?fbclid=abc` hinter der Kennung öffnet die Aufgabe normal.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2558. Eine Partie aus dem Profil öffnen › „Neue Partie“: Spielen öffnet, unten ist
      „Spielen“ golden markiert. Training › 30-Minuten-Plan › Partietag › „Zum Spielen“: ebenso.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für die Partie aus dem Profil; nicht geprüft: 30-Minuten-Plan.
- [ ] N2559. Während einer Tour (Einstellungen › Hilfe › Rundgang) die Zurück-Taste drücken: Die
      Tour endet, die Seite darunter bleibt stehen (früher ging die App zusätzlich zurück).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).

### Neu in 0.3.45: Zeitleiste, Repertoire, Sammlungen bearbeiten, Fehlertest Teil 3 (1.11.2026)

- [ ] N2480. Nach dem Ende kein Zurücknehmen: Spiele eine ungewertete Partie mit erlaubter
      Rücknahme bis zum Ende (etwa aufgeben). Unter dem Brett steht kein „Zurücknehmen“ mehr, auch
      nicht, wenn du die Partie später im Profil unter „Deine Partien“ wieder öffnest. Während der
      Partie ist der Knopf wie bisher da.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für das Ende durch Matt; nicht geprüft: Aufgeben und Wiederöffnen aus „Deine Partien“.
- [ ] N2481. Bester Zug ohne „?“: Öffne die Auswertung einer Partie, in der du schon klar
      verloren standest. Züge mit dem Stern „Bester Zug“ tragen nirgends „?!“, „?“ oder „??“ (Zugliste,
      Momente, Zahlen „Deine Züge“), auch wenn die Gewinnchance dabei weiter fällt.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Partie, in der Weiß klar verloren stand und nur beste Züge spielte: kein „?“, „Gut gespielt!“; neuer Test).
- [ ] N2482. Die Partie in Momenten wischen: In der Auswertung stehen die Momente nebeneinander.
      Wische mit dem Daumen nach links: Die Karten rasten ein, rechts schaut die nächste heraus, oben
      zählt „2 von 7“ usw. mit. Jede Phase beginnt mit einer schmalen Karte „Mittelspiel · Zug … · %“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Einrasten, nächste Karte schaut heraus, „1 von 5“); nicht geprüft: Phasenkarte „Mittelspiel · Zug … · %“, Wischen mit dem Daumen.
- [ ] N2483. Blättern mit Knöpfen: Die Pfeile neben „1 von 7“ gehen einen Moment weiter oder
      zurück, auch bei zwei schnellen Tipps; am Anfang ist der linke Pfeil grau, am Ende der rechte.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); nicht geprüft: zwei schnelle Tipps.
- [ ] N2484. Phasenknöpfe: Tippe unter der Kurve auf „Mittelspiel“: Kurve zoomt wie bisher und die
      Reihe rückt die Karte „Mittelspiel“ nach vorn; „Ganze Partie“ springt an den Anfang.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2485. Zur Stellung: Tippe in einer Karte auf „Zur Stellung“. Das Brett oben ist danach ganz
      zu sehen (auf kleinem Handy samt „Merken“ darunter), nicht mehr unten angeschnitten.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (393 × 851 und 320 × 568).
- [ ] N2486. Bewegung reduzieren: Stelle am Handy „Bewegung reduzieren“ ein. Blättern in den
      Momenten und „Zur Stellung“ springen ohne Gleiten.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Bewegung reduzieren nachgestellt).
- [ ] N2487. Hell und dunkel, Querformat, Tablet: Die Momente sehen in hellem und dunklem Design
      gut aus; im Querformat steht das Brett links und „Zur Stellung“ scrollt nicht unnötig.
- [ ] N2530. Repertoire-Trainer (Training › Repertoire-Trainer): Unter „Deine Runde“ steht die Zeile
      „Aus“. Tippe sie an und wähle „Gambits (Kapitel 3)“. Unter „Eröffnung“ stehen jetzt die Gambits des
      Buches mit kurzem Namen (Königsgambit, Evans-Gambit, Dänisches Gambit, …, Damengambit). Wähle
      „Königsgambit“, Seite Weiß, „Runde starten“: Nach 1. e4 e5 ziehst du 2. f4, die App antwortet exf4.
      Stimmen die Varianten mit Kapitel 3 überein?
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Gambits mit kurzem Namen, Königsgambit 2. f4 exf4); offen für dich: Stimmen die Varianten mit Kapitel 3 überein?
- [ ] N2531. Zurück zur Auswahl, „Aus“ auf „Eröffnungen (Kapitel 2)“: Die zuletzt gewählte Eröffnung aus
      Kapitel 2 ist noch da, und beim Wechsel auf Gambits das zuletzt gewählte Gambit.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Kapitel 2 und Gambits behalten je ihre zuletzt gewählte Eröffnung; neuer Test).
- [ ] N2532. Der Repertoire-Trainer steht jetzt auch bei Kapitel 3 unter „Die Trainer zu diesem
      Kapitel“. Passt das so?
- [ ] N2533. Hake „Auch Eröffnungen aus der Praxis (Lichess)“ an: „Aus“ springt auf „Praxis (Lichess)“,
      darunter der Hinweis, dass die Züge nicht aus dem Buch stammen, „Noch nichts gewählt.“ und ein
      gesperrter Knopf „Runde starten · keine Variante“; darunter die offene Klappe „Eröffnungen nach
      Spielstärke“. Öffne bei „Italienische Partie“ die „Varianten“ und tippe „Die häufigsten 3“: Über dem
      Knopf steht „3 gewählt“, der Knopf heißt „Runde starten · 3 Varianten“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2534. Starte die Runde als Weiß: Über dem Brett steht der Name der Variante, „wie echte Spieler
      sie auf Lichess am häufigsten spielen“ und „Aus der Praxis, Lichess (nicht aus dem Buch)“. Ein falscher
      Zug zeigt „Nicht der Zug dieser Variante“ und den richtigen Zug als Pfeil.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2535. Schließe die App und öffne den Trainer wieder: Schalter, Quelle und die gewählten Varianten
      sind noch da. Haken weg: zurück auf „Eröffnungen (Kapitel 2)“, die Lichess-Liste verschwindet.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Neuladen statt App schließen).
- [ ] N2536. Rundgang im Repertoire-Trainer (Kompass oben rechts): Ein Schritt erklärt die Zeile „Aus“,
      ein weiterer den Schalter „Praxis“; der Schritt zum Ziehen erwähnt keine Warum-Fragen mehr.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Texte der Tour).
- [ ] N2540. Training öffnen: Direkt unter „Dein Stapel für heute“ stehen drei Kacheln: Lernsammlung, Fehlerdatenbank (Datenbank-Symbol) und Alle Kapitel. Die Kachel Fehlerdatenbank zeigt „noch leer“ bzw. die Zahl der Einträge und öffnet die Fehlerdatenbank.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für die Kachel Fehlerdatenbank („noch leer“, öffnet sie); nicht geprüft: Reihenfolge der drei Kacheln.
- [ ] N2541. Eine Partie spielen, in der Auswertung auf einen Zug gehen, „Merken“, dann „Fehler“, dann „In die Fehlerdatenbank“: Es erscheint „In der Fehlerdatenbank gespeichert. Zur Fehlerdatenbank“. Der Link führt hin, und der Eintrag steht dort.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2542. Dasselbe mit „Lernen“ und „Speichern“: „In der Lernsammlung gespeichert. Zur Lernsammlung“ führt in die Lernsammlung.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2543. Lernsammlung: einen Eintrag aufklappen. Hat er keinen Plan, heißt der Knopf „Plan ergänzen“, sonst „Bearbeiten“. Die Felder Plan, Notiz und Eröffnung sind beschriftet wie beim Anlegen. Plan ändern und „Änderung speichern“: Der neue Plan steht in der Zeile, und „Abfragen“ zeigt ihn.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2544. Lernsammlung: Eine geänderte Eröffnung verschiebt den Eintrag in die passende Gruppe.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2545. Lernsammlung: „Löschen“ entfernt den Eintrag sofort. Unten schwebt „Gelöscht. Rückgängig“; ein Tipp holt ihn an dieselbe Stelle zurück. Nach etwa 10 Sekunden verschwindet die Leiste.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); nicht geprüft: Leiste verschwindet nach etwa 10 Sekunden.
- [ ] N2546. Fehlerdatenbank: einen Eintrag aufklappen, „Bearbeiten“, Fehlerart und Satz ändern, „Änderung speichern“. Die Zeile und die Auswertung je Fehlerart zählen den Fehler jetzt beim neuen Kapitel.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2547. Fehlerdatenbank: „Eintrag löschen“, dann „Rückgängig“: Der Eintrag ist wieder da, die Auswertung zählt ihn wieder.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2548. Tour im Training (Kompass oben rechts): Nach der Lernsammlung kommt ein Schritt zur Fehlerdatenbank.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Schritt „Fehlerdatenbank“ folgt in der Tour auf die Lernsammlung).
- [ ] N2490. Geteilten Link bei offener App öffnen: App offen lassen, dann im selben Browser-Tab
      die Adresse schach-von-grund-auf.com/app/#aufgabe-taktik-l-1Vybh eingeben. Die Aufgabe
      „Herausforderung“ öffnet sich sofort; „Training“ oben links führt zur Trainingsübersicht.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2491. Profil › Einstellungen › Hilfe › „Rundgang durch die App“ › „Ich will spielen und
      Partien auswerten“: Die Tour läuft auf „Spielen“, unten ist „Spielen“ golden markiert (nicht
      mehr „Profil“).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2492. Rundgang aus den Einstellungen öffnen und, solange die Frage „Wie möchtest du
      starten?“ zu sehen ist, die Zurück-Taste (Android) drücken: Die Frage schließt sich.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2493. Profil › Abzeichen „Erste Partie“ antippen › „Los geht's“: Spielen öffnet, unten ist
      „Spielen“ markiert. Profil › Orden „Teil Endspiel“ › „Los geht's“: Kapitel 8 öffnet.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für „Erste Partie“; nicht geprüft: Orden „Teil Endspiel“.
- [ ] N2494. Ohne Internet (Flugmodus) Profil › Einstellungen › Bots und Wertung › „Maia laden“:
      Es erscheint „Ohne Internetverbindung lässt sich Maia nicht laden …“ (kein „Failed to fetch“).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2495. Datensicherung von einem Gerät mit verdienten Abzeichen auf einem zweiten Gerät (oder
      nach „Alle Daten löschen“) einspielen: Es kommen keine Gratulationen zu alten Ringen oder
      Abzeichen.
      Vorgeprüft: Abweichung gefunden und behoben. Nach dem Einspielen kam „Neue Stufe erreicht“ zur alten Stufe der Sicherung (die Stufe merkte sich das Gerät, nicht die Sicherung). Seit dieser Fassung vergisst die App nach dem Einspielen die gemerkte Stufe; keine Gratulation zu Ringen, Abzeichen oder Stufe mehr (neuer Test).
- [ ] N2496. Orden-Probe (Aufgabenseite › Orden testen › ein Ring auf 100 %): Die Gratulation hat
      den Fokus auf „Weiter“ (Tastatur am Rechner: Tab bleibt in der Karte, Esc schließt sie).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2497. Handy auf Englisch stellen, App-Daten löschen, App über den QR-Code des Buches
      (…/app/?start=buch) öffnen: Zuerst kommt die Frage nach der Sprache, die Tour „Mit dem Buch
      starten“ erst danach.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2498. App am Abend auf „Buch“ offen lassen, am nächsten Morgen wieder nach vorn holen:
      „Heute“ zeigt den neuen Tag (am 1. eines Monats steht „Dein … ist fertig“), ohne etwas
      anzutippen.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2550. Repertoire-Trainer, Haken „Auch Eröffnungen aus der Praxis (Lichess)“: Unter dem
      Hinweis „nicht aus dem Buch“ steht jetzt ein Satz: „Nach dem Namen geht jede Variante mit den
      häufigsten Zügen von Spielern um 1200 weiter …“. Hast du schon gewertete Partien gegen die Bots
      gespielt, steht dort dein Band („dein Band nach deiner Wertung“). Ist der Satz verständlich?
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für den Satz „um 1200“; nicht geprüft: „dein Band“ mit Wertung; offen für dich: Ist der Satz verständlich?
- [ ] N2551. Wähle bei „Sizilianische Verteidigung“ unter „Varianten“ nur „Old Sicilian“, Seite
      Weiß, „Runde starten“. Die Variante endet nicht mehr nach 2… Sc6, sondern geht weiter: 3. Lc4 e6 4. O-O d5 5. exd5 exd5 6. Lb5 Ld7 7. Te1+ (ohne Wertung, Band 1200). Fühlt sich die Länge
      richtig an?
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße); offen für dich: Fühlt sich die Länge richtig an?
- [ ] N2552. Dasselbe als Schwarz mit „Englische Eröffnung“ (1. c4): Früher gab es als Schwarz
      keine Aufgabe, jetzt ziehst du die häufigsten Antworten (etwa 1… e5 …). Startknopf: „1 Variante“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (King's English Variation als Schwarz, Knopf „1 Variante“, die App zieht 1. c4).
- [ ] N2553. Ohne Netz (Flugmodus, App schon installiert): Die Runde aus der Praxis ist trotzdem
      verlängert.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Flugmodus: Old Sicilian aus der Praxis geht über 2... Sc6 hinaus; neuer Test).
- [ ] N2549. **„Zur Stellung“ an einem Fehler:** In der Auswertung am Moment eines Patzers „Zur
      Stellung“ tippen. Das große Brett zeigt die Stellung nach dem Fehlerzug (der Zug ist in der
      Zugliste markiert); „Merken“ trägt genau diesen Zug in die Fehlerdatenbank ein.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Brett nach 12. O-O-O??, „Merken“ trägt genau diesen Zug ein).

### Neu in 0.3.44: Lizenzen, Wiki und großer Fehlertest (Nacht 31.10./1.11.2026)

- [ ] N2440. Karte „Heute“ mitten im Buch: Lies in Kapitel 6 ein paar Abbildungen (Kapitel 0 bis
      5 abgehakt, Übungen offen). Die Übungskachel nennt jetzt Kapitel 5 (das zuletzt gelesene
      fertige Kapitel), nicht mehr Kapitel 0.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Kapitel 0 bis 5 gelesen, Kapitel 6 begonnen: Übungskachel „Kapitel 5“; neuer Test).
- [ ] N2441. Karte „Heute“ mit eigenem Ziel: Hefte unter „Ziele“ das Ziel „Übungen von Kapitel 3“
      an. Die Übungskachel nennt jetzt Kapitel 3, auch wenn du dort noch nicht fertig gelesen hast.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (angeheftetes Ziel Kapitel 3; neuer Test).
- [ ] N2442. Karte „Heute“ mit sehr vielen fälligen Karten (über 20): Statt „etwa 134 Minuten“
      steht „Fang mit 20 an, das dauert etwa 14 Minuten“; die Kachel zeigt „200 fällig · 20 in etwa
      14 Min“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (200 fällige Karten: „200 fällig · 20 in etwa 14 Min“, Vorlesetext „Fang mit 20 an, das dauert etwa 14 Minuten“; neuer Test).
- [ ] N2443. Karte „Heute“, alles erledigt (Tagesaufgabe gelöst, Kapitel gelesen): Als letzte
      Kachel steht „Partie · Gegen die Engine“; ein Tipp öffnet Spielen. Neulinge vor Kapitel 0
      sehen sie nicht.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (alles erledigt: letzte Kachel „Partie · Gegen die Engine“; neuer Test).
- [ ] N2444. Zähltrainer: Unter dem Brett steht immer die Seite am Zug, die auf dem rot
      markierten Feld schlagen würde (fünf Aufgaben durchtippen).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (fünf Aufgaben: Die Rechnung nennt jeweils die Seite unter dem Brett als angreifende Seite; neuer Test).
- [ ] N2445. Nachschlagen › Werkzeuge des Buches: Die Bilder zeigen die neue Oberfläche (Leiste
      mit Symbolen, Bündel als Chips).
- [ ] N2446. Kapitelseite bei großer Schrift (Einstellungen › Schriftgröße 150 %) auf dem Handy:
      nichts ragt über den Rand, „Alle abhaken“ und „Alle zurücksetzen“ stehen bei Platzmangel
      untereinander.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Kapitel 0 bei 150 %: nichts breiter als das Fenster, beide Knöpfe im Bild; neuer Test).
- [ ] N2460. Auswertung einer Partie gegen einen Bot: Unter „In Zahlen“ auf „Schwarz (Botname)“
      tippen. Die Karte heißt jetzt „Züge von Botname“ statt „Deine Züge“; auf der eigenen Seite
      weiter „Deine Züge“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2461. Spielen → Eigene Bots ohne eigenen Gegner: Über „Eigene Bots verwalten“ steht keine
      leere Fläche mit Trennlinie mehr.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Bildschirmfoto: über „Eigene Bots verwalten“ keine leere Fläche).
- [ ] N2462. Profil → Partie einlesen (PGN): „1. e4 e5 2. Lc4 Sc6 3. Dh5 Sf6 4. Dxf7# 1-0“
      einfügen (deutsche Notation) und doppelt auf „Einlesen und auswerten“ tippen. Erwartet: Schäfermatt
      wird erkannt, in der Partienliste steht die Partie genau einmal.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2463. Partie einlesen mit einer Crazyhouse- oder Chess960-PGN von Lichess: Meldung „Das ist
      eine Schachvariante …“ statt einer kaputten Partie.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2464. Zwei Tabs (oder installierte App und Browser-Tab) offen: im einen den Namen im Profil
      ändern, im anderen eine Übung lösen oder Partie einlesen; danach beide neu laden. Erwartet: Name
      und die andere Änderung sind beide da.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (zwei Tabs, beide Änderungen bleiben).
- [ ] N2465. Datensicherung → „Sicherung einspielen“: Die Rückfrage nennt jetzt auch die Zahl der
      Partien.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Rückfrage nennt „Partien: 1“; neuer Test).
- [ ] N2466. Blitzpartie 3 + 2 bis kurz vor 0:00 laufen lassen und genau beim Ablauf ziehen:
      Die Partie endet auf Zeit, der Zug wird nicht mehr ausgeführt.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Blitz 3 + 2, Zug nach Ablauf der Zeit: „Deine Zeit ist abgelaufen“, der Zug wird nicht ausgeführt; neuer Test).
- [ ] N2467. Nach Mitternacht (0–1 Uhr) eine Partie als PGN herunterladen bzw. eine Sicherung
      anlegen: Datei- und PGN-Datum zeigen den heutigen Tag, nicht gestern.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Ortszeit Berlin, 0:30 Uhr: Sicherung „…-2026-11-18.json“, PGN mit Datum 2026.11.18; neuer Test).
- [ ] N2420. Einstellungen (Zahnrad) › Lizenzen: Neu sind „In onnxruntime-web enthalten:
      protobuf.js, long.js, FlatBuffers, guid-typescript“, „Bibliotheken in der
      WebAssembly-Laufzeit von onnxruntime“, „Schrift Source Serif 4 (Adobe)“, „Häufige
      Eröffnungszüge ‚Aus der Praxis‘ …“ und „Hilfscode der Bauwerkzeuge …“. Bei jedem öffnet
      „Lizenztext“ einen lesbaren Text (der für die WebAssembly-Laufzeit nur mit Internet).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für die Lizenztexte der onnxruntime-Bausteine und der Bauwerkzeuge; nicht geprüft: Source Serif 4, „Aus der Praxis“, Text der WebAssembly-Laufzeit.
- [ ] N2421. Lizenzen, Eintrag „Zusatzpartien für ‚Zug erraten‘“: „Lizenztext“ öffnet den Text
      der CC BY-SA 4.0, auch im Flugmodus.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Lizenztext CC BY-SA 4.0 liegt in der App); nicht geprüft: Flugmodus.
- [ ] N2422. Impressum (Startseite unten): Abschnitt „Quelltext und Rechte“ nennt „Version 3
      oder (nach deiner Wahl) jeder späteren Version“, den Link zum Quelltext und „Einstellungen ›
      Lizenzen“; der Link „Lizenzen“ unten führt zur Lizenzseite der App.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für „GNU GPL 3.0 oder neuer“, Link zum Quelltext und Lizenzseite; nicht geprüft: genauer Wortlaut im Impressum.
- [ ] N2423. Eine Trainingsseite (schach-von-grund-auf.com/training/) und die Datenschutzseite
      zeigen unten den Link „Lizenzen“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Fußzeile von /training/ und /datenschutz/ mit „Lizenzen“; neuer Test).
- [ ] N2424. Sprache Englisch: Die Lizenzseite zeigt auch die neuen Einträge auf Englisch.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (die fünf neuen Einträge auf Englisch; neuer Test).
- [ ] N2430. Dashboard › Wiki (nach dem Zusammenführen und dem nächsten Push nach main):
      Seite „Die Ordner der App“ öffnen und nach „Lernpfad“ suchen. Erwartet: ein Abschnitt
      „ui/komponenten/lernpfad“ mit Stationen, Landschaften und Nebenaufgaben.
      Von Claude vorgeprüft am 17.11.: bestanden (Inhalt der Wikiseite aus der Pipeline, Abschnitt „ui/komponenten/lernpfad“ mit Stationen, Landschaften, Nebenaufgaben); nicht geprüft: Anzeige im Dashboard.
- [ ] N2431. Dashboard › Wiki: Seite „Acht Wege durch den Code“ öffnen. Erwartet: acht Abläufe,
      darunter „Belohnungen“ und „Der erste Start: Startwahl und Touren“. Verständlich ohne
      Programmierkenntnisse? Notiz, was unklar ist.
      Von Claude vorgeprüft am 17.11.: Die Seite enthält „Belohnungen“ und „Der erste Start: Startwahl und Touren“; offen für dich: Ist sie ohne Programmierkenntnisse verständlich?
- [ ] N2432. Dashboard › Wiki: Suche nach „Buchbefund B7“ und nach „Zeit-Zählhilfe“. Erwartet:
      kein Treffer (Buchbefunde bleiben aus dem Wiki).
      Von Claude vorgeprüft am 17.11.: bestanden (keine der 336 Wikiseiten enthält „Buchbefund B7“ oder „Zeit-Zählhilfe“).
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
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2371. **Buch-Weg:** „Ich lese das Buch“: Die Tour zeigt Willkommen, die Karte „Heute“, das
      Weg-Symbol („Dein Weg durchs Buch“), das Nummernfeld, die Kapitel (mit „Schon weiter? Hake
      Gelesenes ab“), die Leiste, das Toursymbol, im Browser den Tipp zum Installieren und am Ende
      „Los: Kapitel 0“. Der Knopf öffnet Kapitel 0. Nimmt dich das an die Hand?
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Schritte und „Los: Kapitel 0“); offen für dich: Nimmt dich das an die Hand?
- [ ] N2372. **Spielen-Weg:** In einem neuen privaten Fenster „Ich will spielen …“ wählen: Die App
      wechselt zu Spielen und zeigt „Schnell eine Partie“, die Kacheln, die Auswertung und das
      Einlesen einer Partie von Lichess oder chess.com mit dem Knopf „Partie einlesen“ (springt ins
      Profil zu „Deine Partien“).
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2373. **QR-Adresse:** schach-von-grund-auf.com/app/?start=buch in einem privaten Fenster:
      Die Frage entfällt, die Buch-Tour beginnt gleich. Profil › Einstellungen › Hilfe › „Rundgang
      durch die App“ öffnet die Startwahl jederzeit wieder.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2374. **Kennzahlen im Profil:** Unter Stufe und Erfahrung stehen drei Kacheln: ✓ Übungen
      gelöst, Hantel Trainer-Durchgänge, Sprechblase Warum-Fragen, je mit großer Zahl. Eine Null
      steht blass. Die alten Zeilen unter den Orden sind weg.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (drei Kacheln, die Null blass; neuer Test).
- [ ] N2375. **Karte „Heute“ für Neue:** Frisch installiert steht dort „Anfangen · Kapitel 0 ·
      Abb. 0.1“, auch wenn du vorher kurz in eine andere Abbildung geschaut hast. Eine Abbildung,
      die nur kurz offen war, wird selbst vorgeschlagen statt übersprungen. Die Tagesaufgabe
      (Taktik) erscheint erst, wenn Kapitel 0 zu 80 % gelesen oder ein Trainer geschafft ist. Gibt
      es keine Alternativen, steht das Kreuz „Nicht jetzt“ rechts neben der großen Kachel.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für „Anfangen · Kapitel 0 · Abb. 0.1“ ohne Tagesaufgabe; nicht geprüft: kurz geöffnete Abbildung, 80-%-Grenze, Lage des Kreuzes.
- [ ] N2400. **Infofenster der Orden:** Profil › „Deine Erfolge“: Tippe auf einen Orden oder ein
      Abzeichen. Ein Fenster geht von unten auf: Bild, ein Satz, was man dafür tun muss, und der
      Stand („3 von 10“) oder „Geschafft am …“ mit „Teilen“. Ein offenes Stück zeigt das Bild blass
      in Farbe („so sieht es aus, wenn du es hast“). Kreuz oder Tipp daneben schließt.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße).
- [ ] N2401. **Ringe:** Profil, „Dein Fortschritt“: Ein Tipp auf einen Ring (Abbildungen, Übungen,
      Lernziele, Trainer) öffnet dasselbe Fenster mit der Bedingung des Ordens. Auch Glanzstück und
      „Als Nächstes“ öffnen es. Bei einem offenen Abzeichen wie „Erste Partie“ führt „Los geht's“
      direkt dorthin.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für Ringe und „Los geht's“; nicht geprüft: Glanzstück und „Als Nächstes“.
- [ ] N2404. **Nebenaufgaben auf dem Weg:** Dein Weg durchs Buch: Neben jeder Station steht ein
      kleines Feld mit Stern oder Bild und „0/5“. Nichts ragt über den Rand. Wirkt der Weg noch
      ruhig?
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, 360 px breit): 13 Felder, keines ragt über den Rand; offen für dich: Wirkt der Weg noch ruhig?
- [ ] N2405. **Liste je Kapitel:** Tippe auf ein Feld: „Nebenaufgaben · Kapitel N“ mit Übungen,
      Lernzielen, Trainern des Kapitels und passenden Abzeichen und Orden. Passen die Stücke vom
      Niveau her zu den Kapiteln (etwa „Kurzer Prozess“ bei Kapitel 4, Kapitel 12 mit 11 Stücken)?
- [ ] N2406. **Los geht's:** In der Liste „Übungen Kapitel 1“ → „Los geht's“ öffnet die erste
      ungelöste Übung; „Trainer Kapitel 0“ den Koordinatentrainer (nach einer Runde 1/1 mit Haken,
      das Feld an Station 0 wird farbig); „Lernziele Kapitel 2“ die Checkliste.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für „Trainer Kapitel 0“ (öffnet den Koordinatentrainer); nicht geprüft: Übungen Kapitel 1, Lernziele Kapitel 2, Feld nach der Runde.
- [ ] N2409. **Neue Abzeichen:** Im Regal „Abzeichen“ stehen „Kurzer Prozess“ (Matt in höchstens
      15 eigenen Zügen aus der Grundstellung) und „Neue Dame“ (eigenen Bauern umgewandelt).
      Gefallen dir Name, Bild und Bedingung? „Kurzer Prozess“ zählt auch gegen Stufe 1 (als
      Einsteigerziel); sag, falls nur gewertete Partien oder Bots ab Stufe 3 zählen sollen.
- [ ] N2410. **Dunkel:** Felder, Liste und Fenster der Nebenaufgaben sind im Dunkelmodus gut lesbar.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (axe dunkel ohne schweren Befund); offen für dich: Lesbarkeit nach Gefühl.
- [ ] N2412. **Trainer-Orden:** Der Ring „Trainings erstmalig absolviert“ zählt jetzt bis 17 (ohne
      Fehlerdatenbank, die keine Runde hat). Vorher war der Orden unerreichbar; wer alle 17 schon
      hat, bekommt nach dem Update die Gratulation.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) („Trainings erstmalig absolviert: 0 von 17“; neuer Test); nicht geprüft: Gratulation nach dem Update.

### Neu in 0.3.42: Erklärungen und Tour geprüft (31.10.2026)

- [ ] N2361. **Tour im Profil:** Profil öffnen, Toursymbol oben rechts. Die Tour zeigt jetzt auch
      Erfolge (Orden und Abzeichen), den Weg durchs Buch, Themen, Rekorde und Extras; der Schritt
      zur Wertung spricht von Kacheln je Zeitklasse und dem „i“, nicht mehr von Reitern.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Tour nennt Erfolge, Weg, Themen, Rekorde und Aussehen, Wertung „als Kacheln“ mit ⓘ; neuer Test).
- [ ] N2362. **Tour bei Spielen:** Auf der Startseite von Spielen und auf jeder Unterseite (Gegner
      aussuchen, Eigene Stufe, Eigene Bots, Freie Partie) das Toursymbol antippen: Jeder Schritt
      zeigt auf etwas, das auf dieser Seite zu sehen ist. Im Blatt „Partie einstellen“ stehen die
      Erklärungen zu Spielhilfen und Eröffnung jetzt hinter einem „i“ an ihrer Überschrift, die zu
      Bedenkzeit und Wertung im „i“ bei „Gewertete Partie“.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (jeder Schritt auf Spielen und den vier Unterseiten hebt ein Ziel hervor; neuer Test); nicht geprüft: ⓘ im Blatt „Partie einstellen“.
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
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) für Porträt, Farbchip und Sprechblase, hell und dunkel; nicht geprüft: Text hinter ⓘ, Kopf über der Auswertung.
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
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (alle Kandidaten bekommen eine Bewertung).

### Neu in 0.3.41: Einstellungen neu (Arbeitschat, 31.10.2026)

Die Einstellungen sind nach deiner Wahl des Entwurfs K2 „Brettvorschau oben“ neu gebaut: oben ein
großes Brett in deinen Farben und Figuren, darunter Farbfelder und Figurenkacheln zum Antippen,
dann drei Reiter (Bedienung, Anzeige, Hilfe) mit je einer Zeile pro Einstellung, ganz unten genau
einmal die Zeilen „Bots und Wertung“, „Deine Daten“ und „Über die App“. Öffnen: unten „Profil“,
dann oben „Einstellungen“. Bitte im dunklen und im hellen Modus ansehen.

- [ ] N2300. **Brettvorschau:** Profil › Einstellungen: Wirkt das große Brett oben ruhig genug, und
      passt der Hintergrund (dunkel Nachtblau, hell Creme)?
      Vorgeprüft: Abweichung, nur im Text: Die Brettvorschau gibt es seit 0.3.53 nicht mehr (N2600); das Aussehen wählt man im Profil.
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
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (zwei Partien: „Zuletzt gespielt“ mit Name, „heute · 10 + 0“ und Ergebnis; „Revanche“ schlägt Derya als „dein gewählter Gegner“ mit 10 + 0 vor; neuer Test); nicht geprüft: Rivalenkarte und angeheftetes Ziel.

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
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (ein Finger zeigt den Zug über der Kurve, Loslassen springt dorthin, zwei Finger zoomen; neuer Test).
- [ ] N2329. **Nichts verloren:** Zugliste mit Zeichen und „Alle Züge zeigen“, Pfeile zum Blättern,
      Uhren, Bewertungsbalken links am Brett, Drehen, Ruhige Ansicht (blendet die Auswertung aus,
      Ergebnis und „Neue Partie“ bleiben), „Besserer Zug“/„Bestrafung“ abspielen, Nebenzweig,
      „Zurücknehmen“ nach dem Ende (nur in ungewerteten Partien), die Meldung „Gruppenmodus frei“ und während der Rechnung
      „Die Engine wertet die Partie aus …“ mit Balken: alles noch da?
      Vorgeprüft: Abweichung, nur im Text: „Zurücknehmen“ nach dem Ende gibt es seit 0.3.45 nicht mehr (N2480), „Besserer Zug“/„Bestrafung“ wählt man über die Linienknöpfe (N2599). Zugliste mit Zeichen, Balken, ruhige Ansicht, Nebenzweig und Folgen sind in Tests grün; nicht geprüft: Uhren, Drehen, „Gruppenmodus frei“, Rechenmeldung.

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
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Balken „Eröffnung“ öffnet die Kurve mit „Spanne …“, zweiter Tipp schließt sie; neuer Test).

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
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (30 Halbzüge ohne Patzer stehen in „Deine Rekorde“; neuer Test).
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
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße): Plan ändern (Freitag dazu) und „Plan entfernen“ (neuer Test).
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
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Lichess-Zusatzaufgabe, falscher Zug: „Nicht ganz“, roter Pfeil, „laut Engine“; neuer Test).
- [ ] N1076. **Motivfrage:** Einverstanden mit der Zuordnung der Lichess-Themen zu den zwölf
      Grundmotiven (Räumung zur Hinlenkung, Ablenkung zur Überlastung)?
- [ ] N1078. **Offline:** Die App einmal online öffnen, dann im Flugmodus den Taktiktrainer und
      „Zusatzaufgaben (Lichess)“ öffnen. Die Themen erscheinen und die Runde läuft.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Flugmodus: Zusatzaufgaben von Lichess, Runde startet; neuer Test).

### Neu in 0.3.14: Mehr Meisterpartien für „Zug erraten“ (Opus-Arbeitschat, 30.10.2026)

- [ ] N1061. **Berühmte Partien:** Bitte ein paar Kurztexte lesen: Stimmen sie, klingen sie gut?
- [ ] N1064. **Offline:** Ohne Netz „Berühmte Partien“ und „Aktuelle Turniere“ öffnen: Die Listen
      kommen.
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Flugmodus: „Berühmte Partien“ und „Aktuelle Turniere“ zeigen ihre Listen; neuer Test).

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
      Von Claude vorgeprüft am 17.11.: bestanden (Chromium, Handygröße) (Treffer: kein Pfeil; falscher Zug: roter und goldener Pfeil; neuer Test).

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

- [ ] N2631. **Ton im Schach-Abenteuer am iPhone (14.11.2026):** Abenteuer starten, auf dem Dachboden
      warten, bis Ambrose erscheint, dann in Maple Falls herumlaufen. Hören: Läuft die Musik ohne
      Klicken weiter, wenn sie von vorn beginnt (nach etwa 1 bis 2 Minuten)? Rauscht der Wasserfall
      ohne Bruch? Hört die Musik nach einer Erinnerung (Archiv in Cedar Creek) auf, statt sich zu
      wiederholen? Rückmeldung etwa „N2631 ok“ oder „N2631: Klick beim Wasserfall“.
- [ ] N2632. **Spiel mit dem Daumen, hoch und quer (14.11.2026):** Hochkant steht das Steuerkreuz rechts unten und
      der Aktionsknopf („Ansehen“, „Sprechen“) links; im Spielmenü lässt sich „Steuerkreuz links, Aktionsknopf
      rechts“ wählen. Im Abenteuer herumlaufen, dann das Handy quer drehen: Steuerkreuz links unten halb
      durchsichtig, rechts Aktionsknopf und runde Knöpfe für Tagebuch, Übungspartie, Reisen und Menü. Wieder hoch
      drehen: nichts darf verloren gehen. Spielt es sich mit einer Hand gut, in beiden Lagen des Steuerkreuzes? Eine
      Partie quer: Brett links in voller Höhe, rechts Porträt, Uhren, Karten und Knöpfe. Erreichst du alles mit dem
      Daumen? Rückmeldung etwa „N2632 ok“ oder „N2632: Menü zu weit oben“.
- [ ] N2633. **Farben, Pixelknöpfe und Brettstile (14.11.2026):** Navy, Pergament und Gold überall,
      Knöpfe im Pixelrahmen, Überschriften in Pixelschrift. Das Brett hat je Ort ein eigenes Aussehen
      (Dachboden altes Holz, Schulclub grünes Vinyl, Riverton Steintisch …). Über der Partie steht ein Kopf mit
      Gegner und Ort (etwa „Ambrose / Dachboden“), unten der Knopf „Weiter“. Ein Rätsel lösen: Die Aufgabe steht
      auf Pergament (bei Buchübungen mit ihrer eigenen Frage, etwa bei Sams erster Aufgabe „Dein Springer auf b5
      wird vom Bauern a6 angegriffen …“), Ambrose antwortet in einer Sprechblase, der Fortschritt ist eine Reihe
      kleiner Figuren, am Ende „Das war die Runde. N von M“. Gefällt dir das, ist etwas schwer lesbar? Rückmeldung
      etwa „N2633 ok“.
- [ ] N2635. **Karteneditor am PC (16.11.2026):** Im privaten Repository den Ordner `editor`
      herunterladen (auf GitHub: Code, Download ZIP, dann entpacken) und `editor/index.html` mit
      Doppelklick in Chrome oder Edge öffnen. Links eine Karte wählen, zum Beispiel „Maple Falls –
      Diner“. Ausprobieren: Klick wählt ein Bild, Ziehen verschiebt es (rastet auf Kacheln ein, mit
      gedrückter Alt-Taste pixelgenau), Pfeiltasten 1 Pixel, Umschalt+Pfeil eine Kachel; Strg+Klick
      wählt mehrere; Strg+D dupliziert (auch eine Gruppe), Entf löscht, R dreht, Spiegeln,
      Maßstab, Ebene nach vorn oder hinten; liegen mehrere Bilder übereinander, erscheint eine
      Auswahlliste. Rechts die Bibliothek mit Kategorien, Vorschau und Suche, Bilder per Ziehen
      in die Karte. Oben die Schalter „Nur Umgebung“ und „Umgebung sperren“, Raster, Kollision,
      Vorher/Nachher, Strg+Z, „?“ zeigt alle Tastenkürzel. Am Ende „Änderungen herunterladen“
      und die Datei im privaten Repository in `editor/rueck/` hochladen; Claude baut sie ein,
      vergleicht mit dem alten Stand und leitet daraus neue Prüfregeln ab. Ein Notizfeld „warum“
      je Änderung hilft dabei sehr. Noch nicht möglich: Figuren und Auslöser löschen (nur
      verschieben), die Fassungen aus dem Ordner „varianten“. Rückmeldung: „N2635 ok“ oder was
      fehlt oder hakt.
      Neu in Fassung 1.1: „Sperrt / Durchgehbar“ für das ausgewählte Bild (mit kurzem Grund), „Kollision
      bearbeiten“ schaltet einzelne Kacheln, Bodenkacheln (Dielen, Fliesen, Teppich, Stein, Gras,
      Erde und mehr) liegen in der Bibliothek unter „Boden und Straße“, „Übergang hier“ setzt einen
      Übergang wie einen vorhandenen, Entf löscht ihn. Damit lässt sich ein Treppenabgang selbst
      bauen: Treppe legen, obere Kacheln mit Dielen abdecken, Treppe auf „Durchgehbar“, mit
      „Kollision bearbeiten“ die Ränder des Lochs sperren, „Übergang hier“ auf die Lochkachel. Achtung: Bei „Umgebung sperren“ sind die Bodenkacheln
      nicht anklickbar.
      Der Schalter „Kollision“ oben (Taste K) zeigt alle Stellen, an denen man nicht durchgehen kann,
      transparent gelb mit gelbem Rand, auch unter Bildern, die „Nur Umgebung“ ausblendet.
      Neu in Fassung 1.3: der Kollisionspinsel, unabhängig von einzelnen Bildern. Taste S malt
      Sperren (gelb mit Kreuz), O gibt frei (grüner Rand, sticht jedes Bild darunter), X radiert
      (danach gilt wieder, was Bilder und Boden sagen); mit gedrückter Maus malen, Umschalt+Ziehen
      für ein Rechteck, Esc beendet. Eine Freigabe durch Wand oder Wasser braucht einen kurzen Grund.
      „Kollision bearbeiten“ am einzelnen Bild gibt es weiter.
      Fassung 1.3.1: Der Bodenpinsel (B) kennt „Leer (schwarz, nicht begehbar)“ und malt jetzt auch
      bei eingeschaltetem „Umgebung sperren“.
      Fassung 1.3.2: „Änderungen laden“ oben öffnet eine heruntergeladene Änderungsdatei wieder
      (auch aus 1.2). Ohne Datei: Im selben Browser übernimmt die neue Fassung den Zwischenstand
      der alten von selbst.
      Fassung 1.3.3 (dein Fehlerbericht): Steht ein Möbel nach dem Verschieben ein paar Pixel neben
      dem Raster, zeigt die gelbe Anzeige seine Sperrfläche jetzt pixelgenau wie im Spiel, und das
      Gitter von „Kollision bearbeiten“ liegt genau auf dem Bild.
      Fassung 1.4: Übergänge frei anlegen. Im Feld „Übergänge“ Zielkarte und Zielauslöser wählen
      oder „neuen Gegenauslöser anlegen“ (dann öffnet sich die Zielkarte, ein Klick setzt die
      Gegenseite). Unter jedem Übergang steht sein Ziel, „Zum Ziel“ springt hin. Ein Fußsymbol zeigt,
      wo der Held ankommt (weiß automatisch, türkis festgelegt, rot fehlerhaft); „Ankunft
      festlegen“ und ein Klick setzen es selbst. Jede Seite eines Übergangs hat ihren eigenen
      Ankunftsort; „start“ gilt nur für Reisen und den Spielbeginn.
      Fassung 1.5: Zuschneiden und Deckkraft. Im Bereich „Zuschnitt“ des ausgewählten Bildes vier
      Zahlenfelder (links, oben, rechts, unten; −/+ je 1 Pixel, mit Umschalt 16) oder „Zuschneiden“
      und die orangen Griffe ziehen (mit Alt in Kachelschritten); „Zuschnitt aufheben“ stellt das
      ganze Bild wieder her. Beispiel: aus einem Zaun nur den Pfosten stehen lassen, mit Strg+D
      vervielfältigen oder „Als eigenes Bild merken“ (Bibliothek, „Eigene Zuschnitte“). Die
      Kollision wird mitbeschnitten. Deckkraft 25, 50, 75 oder 100 Prozent für die ganze Auswahl;
      die Kollision bleibt dabei, wie sie ist.
      Fassung 1.6: Kollision fein. Im Kollisionspinsel und bei „Kollision bearbeiten“ schaltet
      „Fein“ (Taste F) auf ein Gitter aus Viertelkacheln (4 Pixel); so lassen sich ein Viertel, die
      Hälfte oder drei Viertel einer Kachel sperren, waagrecht und senkrecht getrennt. Der Held ist
      12 Pixel breit und passt durch eine Lücke von drei Vierteln einer Kachel gerade noch. Kacheln,
      auf denen er nicht mittig stehen kann, tragen einen braunen Punkt: Dort setzt ihn das Spiel nach
      einem Übergang nie ab, Tiere laufen nicht hin, ein kurzes Antippen endet davor. Wird ein Ziel
      durch feine Sperren unerreichbar, meldet die Prüfung das.
- [ ] N2636. **Deine Gemini-Bilder in den Karten (16.11.2026):** Ansehen: Maple Falls Dachboden
      und Zimmer (Treppenloch mit Geländer), Park (Wasserfall zwischen Felsen), Clubraum und
      Bibliothek Cedar Creek (Doppeltüren, Bankerlampen), Drechslerei (Drehbank), Flussweg
      (Stein mit Brett an der Fährstelle), Landstraße (Ehrlichkeitskasse am Apfelstand),
      Zedernpfad (Nadelstreu unter den Bäumen, ausgefranste Übergänge zum Gras), Schleusentreppe
      bei Lockport (Schleusentore, das letzte offen mit Wasserfluss in der Mitte stärker und den
      Planken des geschlossenen Tores, Lastkahn in der Kammer), Riverton (achteckiger Pavillon),
      Steinbruch (Stolleneingang), Fähre nach Port Delacroix (Deckhaus, Kiosk), Starlight Motel
      am Weg nach Summit City (leerer Pool), Wards Hütte (Thermometer), Seeufer vor der Capital
      (Seefähre, Fährhaus), Halle der Capital Arena (Fanshop, dreiflügelige Glastür), Port
      Delacroix (Regen, nasses Pflaster, Pfützen). Sand hat jetzt überall diesen ausgefransten
      Rand. Rückmeldung je Ort, etwa „N2636 Pavillon: Dach zu groß“.

## Teil 2: Entscheiden

Bei den Wünschen der Arbeitsliste nimmt Claude zunächst die eigene Empfehlung und stellt sie dir
hier zur Prüfung („Schon umgesetzt, Widerspruch genügt“). Buchbefunde bleiben Rückfragen, weil
nur du das Buch änderst.

Antworten des Autors zu Fragen der App über die Entscheidungsseite (8.11.2026, für den App-Chat;
der Spiel-Chat ändert an der App nichts): Q10-1 ja (Notiz: Farbwahl im Spiel als Karte, ist im
Spiel umgesetzt), Q10-2 Rückfrage „Betrifft das die Anzeige im Spiel oder unter Profil?“, Q10-3 ja,
Q10-4 ja, Q10-5 ja, Q11-1 Rückfrage „Erläuter mir das bitte“, Q12-4 ja, Q16-1 ja.

Zum Abhaken gibt es die Fragen zum Schach-Abenteuer auch als Seite mit „Empfehlung folgen“, „Nein“
und Notiz (Wunsch des Autors, 8.11.2026): https://claude.ai/artifact/Kumk513LwSbbDJ3wJ2aJC3 (privat,
nur für dich). Der Spiel-Chat liest die Antworten von dort und arbeitet sie hier ein.

### Q22 Schach-Abenteuer: Runde 7 (10.11.2026, schon umgesetzt, Widerspruch genügt)

Die Karten dazu siehst du auf der Revisionsseite: https://claude.ai/artifact/XBUfFuwYQgovXvu7HWt5k1
(privat, nur für dich). Dort wählst du je Karte eine Variante; über jeder Karte steht, was dort
passiert.

- [ ] Q22-1. **Der Wanderer mit dem gelben Rucksack:** - Wer: Auf jeder Route liegt eine Seite aus seinem Manuskript, Kapitel 0 bis 12. Er ist ein
      stiller Gruß an dich und dein Buch und hat keinen Namen. In Capital schenkt er nach dem
      Finale das fertige Buch. - Was zu tun ist: Bitte schreib je Kapitel einen Satz, warum du es geschrieben hast; den
      sagt er, wenn man ihm die Seite zurückgibt. - Bis dahin: Die Seiten zeigen nur den Kapiteltitel. - Wenn du den Gruß nicht möchtest, wird er ein gewöhnlicher Wanderer.
- [ ] Q22-2. **Buchseiten:** Eine Seite zeigt Kapitelnummer, Titel, einen Satz und die erste
      Abbildung des Kapitels, ohne Lösungen. Ist dir das zu viel, bleibt nur der Titel.
- [ ] Q22-3. **Finch-Jagd:** - Die Erfinderin von Schachproblemen Odette Finch hat 16 weiße Figuren entlang der Wege
      versteckt. - Am Leuchtturm stellt sie damit ihr Meisterproblem: die Falle von Légal (1750). - Weiß zieht und gewinnt mit 5.Sxe5!, das die eigene Dame hängen lässt. - Wer die Dame nimmt, wird matt: 5…Lxd1 6.Lxf7+ Ke7 7.Sd5#. - Alle 16 weißen Figuren stehen dabei noch auf dem Brett. - Der Fährmann in Silicon Bay hieß bisher auch Finch; er heißt jetzt Silas Pike.
- [ ] Q22-4. **Englische Schilder:** Nicht jetzt. Wie gewünscht, bleibt alles auf Deutsch, bis
      das Spiel fertig ist. Dokument 17 führt die Bilder mit Schrift für später.
- [ ] Q22-5. **Motel:** Damit die Türen eine volle Kachel breit sind, hat das Motel an der
      Wüstenstraße vier Zimmer statt fünf.
- [ ] Q22-6. **Silicon Bay hat Tiere:** Nach der alten Weltbeschreibung war die Stadt tierfrei.
      Jetzt laufen dort Möwen, Tauben, Hunde an der Leine und eine Katze, weil du mehr Tiere
      wolltest. Die Stadt wirkt trotzdem steril.
- [ ] Q22-7. **Größere Karten:** - Cedar Creek ist nach Süden auf 60 × 50 gewachsen; das gewählte Bild oben bleibt. - Mittlere Städte sind jetzt bis 80 × 60 groß. - Die Größenregel ist entsprechend angepasst.

### Q17 Grafik für das Schach-Abenteuer (8.11.2026; deine Antworten vom 8.11. abends eingearbeitet)

- [ ] Q17-1. **Kacheln und Figuren kaufen:** Deine Antwort: ja. Offen ist nur der Kauf: die Pixelpakete
      „Modern Interiors“ und „Modern Exteriors“ von LimeZu auf itch.io (zusammen etwa 20 bis 30 Euro, Lizenz für
      kommerzielle Spiele, Weitergabe der Bilddateien verboten) und ein privates Repository
      `dobili/schach-abenteuer-inhalte` für die Bilder. Sag Bescheid, wenn beides da ist; dann richte ich den
      Paketbau und den Lesezugang des GitHub-Baus ein (Q20-11, von dir bestätigt).
- [ ] Q17-2. **Porträts:** Deine Frage, ob ich sie selbst erstellen kann: ja. Die Pixel-Porträts entstehen per
      Skript aus einer Beschreibung je Figur (Haar, Hautton, Kleidung, Brille, Bart, Alter) mit dem Stil
      „Pixel Art“ von DiceBear (frei, CC0, wie schon die Porträts der Bots der App mit DiceBear entstehen); für
      Ambrose zusätzlich eine junge Fassung. Bilder aus dem Netz umzuwandeln empfehle ich nicht: Auch verfremdet
      bleiben sie urheberrechtlich geschützt. Schon beauftragt, Widerspruch genügt.

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

- [ ] RO1. **Roman zu Akt 1 lesen (Schach-Abenteuer):** Die Geschichte von Akt 1 steht jetzt als
      Roman in 16 Kapiteln im Ordner `docs/spiel/roman/` (vier Dateien `akt1_teil1.md` bis
      `akt1_teil4.md`, zusammen rund 14 000 Wörter, etwa eine Stunde Lesezeit). Er ist der Leitfaden
      für Karten, Dialoge und Klang. Bitte lesen und sagen, ob Ton und Länge so passen; davon
      hängt ab, wie Akt 2 bis 4 geschrieben werden.
- [ ] RO2. **Erzählform:** Der Roman ist in der Ich-Form geschrieben, damit Name und Geschlecht
      des Helden offen bleiben wie im Spiel (wo andere ihn ansprechen, steht „Robin“). Empfehlung:
      so lassen. Schon umgesetzt, Widerspruch genügt.
- [ ] RO3. **Zu Fuß nach Cedar Creek:** Im Roman gehen der Held und Juno am Freitag zu Fuß am
      Fluss entlang und übernachten mit Erlaubnis von Mrs. Okafor im Lesesaal der Bibliothek; das
      Team kommt am Samstag mit dem Bus. Das begründet den Weg und die Sternennacht. Empfehlung:
      so ins Spiel übernehmen. Im Roman schon umgesetzt, im Spiel noch nicht; Widerspruch genügt.
- [ ] RO4. **Eigenes Zimmer für den Helden:** Die neue Nachtszene (der Geist fragt nach der
      Straßenlaterne und dem Kühlschrank) spielt im Zimmer des Helden. Das wäre eine neue kleine
      Karte. Empfehlung: bauen, weil das Zimmer auch als Ort zum Speichern und für spätere
      Abendgespräche taugt. Noch nicht umgesetzt (Kartenarbeit ruht).
- [ ] RO5. **Mehr Geschichte je Akt:** Bisher war in Akt 1 nur etwa ein Fünftel der Spielzeit
      Geschichte (50 von 270 Minuten). Mit den neuen Szenen des Romans sind es rund 30 Prozent.
      Empfehlung für alle Akte: etwa ein Drittel Geschichte, nie mehr als 30 Minuten Schach am
      Stück, und in jeder Partie der Hauptgeschichte ein bis zwei Momente, in denen jemand spricht.
      Als Vorgabe festgehalten, Widerspruch genügt.

- [ ] RO6. **Mamas Partie in Ironwood:** Im Roman zu Akt 2 entsteht in Mamas Partie noch einmal
      das Bild ihres Fehlers von 2001 (Turm, Dame und Läufer auf einer Linie), und diesmal sieht
      sie den Läufer selbst, gleich wer die Partie gewinnt. Bisher gab es zwei Fassungen je nach
      Ausgang (gewinnt der Held, dann durch genau diesen Spieß). Empfehlung: die Fassung des
      Romans als Hauptfassung, weil sie Mamas Geschichte abschließt, statt sie dem Zufall der
      Partie zu überlassen. Im Roman schon umgesetzt, im Spiel noch nicht; Widerspruch genügt.
- [ ] RO7. **Roman zu Akt 2 lesen:** 13 Kapitel (17 bis 29), rund 13 500 Wörter, in
      `docs/spiel/roman/akt2_teil1.md` bis `akt2_teil4.md`. Neu sind unter anderem ein stiller
      Junge namens Eli am Bildschirmtisch (der Konzern hat einen echten Vorzug), Slicks Lehrer
      Mr. Odum und das blaue Heft der Mutter. Bitte lesen, wenn Zeit ist; es gilt als abgesegnet,
      Widerspruch genügt.

- [ ] RO8. **Roman zu Akt 3 und 4 lesen:** Der Roman ist für alle vier Akte fertig (66 Kapitel,
      rund 73 000 Wörter; Akt 3 in `akt3_teil1.md` bis `akt3_teil3.md`, Akt 4 in `akt4_teil1.md`
      bis `akt4_teil4.md`, alles unter `docs/spiel/roman/`). Lesefassungen ohne Randnotizen hat der
      Hauptchat im Chat geschickt. Bitte lesen, wenn Zeit ist; gilt als abgesegnet, Widerspruch
      genügt.
- [ ] RO9. **Entscheidungen, die der Roman getroffen hat:** (a) Juno weiß ab Akt 3 vom Geist,
      Victor ab Akt 4. (b) Der „unmögliche“ Zug in Port Delacroix stammt von der Maschine: Der Geist
      gibt ihn weiter, der Held spielt ihn, ohne ihn zu verstehen, und gibt die Partie selbst auf.
      (c) Das Opfer des Geists von 1858 war richtig; er verlor danach die Nerven und glaubte 160
      Jahre, es sei falsch gewesen. (d) Die alte Fernpartie endet im Roman remis, durch einen Fehler
      des Helden („Nicht makellos. Schön.“); im Spiel bleiben Sieg und Remis möglich. (e) Im
      Halbfinale findet der Held den entscheidenden Zug selbst und ruft den Geist nur zum Prüfen;
      beide wissen nicht, ob er stimmt. (f) Das Finale gewinnt im Roman der Held; Victor freut sich
      über die Partie und rennt mit dem Formular zu seinem Vater. Im Spiel bleiben alle Ausgänge
      möglich. (g) Coach Delgado hatte beim Konzern unterschrieben, weil das Geld für den Bus
      fehlte, und wieder gekündigt. (h) Das Spiel endet auf dem Dachboden: Der Held bringt dem
      Nachbarskind Lily die erste Frage bei, „Was hängt?“. Empfehlung: alles so übernehmen. Im Roman
      umgesetzt, im Spiel noch nicht; Widerspruch genügt.
- [ ] RO10. **Neue Figuren und Porträts:** Der Stil steht (Juno-Probe). Arbeitsweise mit
      Prompt-Vorlage, Größen und Ablauf: `docs/spiel/24_Figuren_und_Portraets.md`. Kurz:
      PixelLab, Create from Text, Low Top-Down, 32×32, Highly detailed; Kinder mit „short,
      child height“; Animation Template motion, Skeleton v3, Walking für South, East, North, West;
      ZIP an den Hauptchat. Danach Porträt in Gemini mit dem Standbild von vorn als Vorlage. Für
      Juno fehlen noch die Laufbilder North und West. Weitere Figuren erst, wenn Juno im Spiel
      läuft (mittel-2 baut die Anzeige um). Offen: wann das Abo (24 $ im Monat) nötig wird.
- [ ] RO15. **Karten als echte Karten mit Motiv:** Der Kartenfächer ist gebaut, und alle 40
      Motive, Rückseite und Ersatzbild von Gemini sind ausgeschnitten und im Spiel (14.11.2026).
      Bitte auf dem Handy ansehen, ob die Motive in der kleinen Karte (etwa 2 cm breit) gut zu
      erkennen sind; sonst werden die Karten größer. Kleinigkeit: Auf „Klares Flüstern“ hat Gemini
      winzige Zugnamen gemalt; bei Bedarf neu malen lassen.
- [ ] RO16. **Großbilder von Gemini (Datei „3_Gemini_Grossbilder_und_Funde.html“):** Akt 1 und 2
      (A1 bis A17) sind fertig und im Spiel (14.11.2026). Offen sind A18 bis A38 (Akt 3 und 4) und
      die Fundbilder.
- [ ] RO18. **Porträts Akt 1 in Gemini (Datei „5_Gemini_Akt1_Rest.html“):** 1 bis 26 sind
      zugeschnitten und im Spiel (14.11.2026). Es fehlen: Hector neutral (Nr. 12, Schritt 1; bisher
      steht sein Lächeln in allen Feldern), Kettering lächelt (Nr. 27, neutral ist schon da) und die
      Nummern 28 bis 34 (Dunmore, Ivy, Jonah, Owen, Walt, Clover, Oma Miller).
- [ ] RO19. **Bretter und Figuren in Gemini (Datei „6_Gemini_Bretter_und_Figuren.html“ mit
      „Vorlagen_Bretter.zip“):** Je Ort ein Brett und ein Figurenblatt (oben Weiß, unten Schwarz:
      König, Dame, Turm, Läufer, Springer, Bauer auf grünem Grund). Ablauf je Ort: neuer Chat,
      Vorlage brett-NN.png anhängen, Brett-Prompt; im selben Chat Figuren-Prompt mit dem neuen Brett
      als Bild. Ablage in ki-roh, Namen egal. Nicht alle zwölf nötig; was fehlt, behält den jetzigen
      Pixelstil (den du für alle zwölf Orte als geeignet bestätigt hast).
- [ ] RO20. **Nebenquest „Zuschauen“ in Riverton nicht mehr verpassbar:** Wer Tamsins Angebot hört,
      die Runde aber nicht besteht, bevor Slick abreist, fand Tamsin nicht mehr (Befund der
      Chaos-Prüfung). Schon umgesetzt: Im Pinewood Camp bietet Tamsin die mitgeschriebene
      Blitzpartie noch einmal an. Außerdem steht Ambroses Geist nach dem Abschied nicht mehr im
      Zimmer. Widerspruch genügt.
- [ ] RO22. **Bildwünsche der Nacht (Datei „7_Gemini_Bildwuensche_Nacht.html“):** 19 Bilder, die
      im Katalog fehlen, je mit Prompt zum Kopieren (Drehbank, Staffelei, Doppeltür aus Holz,
      achteckiger Pavillon in Riverton, leeres Schwimmbecken mit Kakteen, Motelzeile mit bunten
      Türen, Rosies türkiser Truck, Seefähre, Fanshop …). Alles freiwillig; die Karten
      funktionieren ohne. Dazu in PixelLab: Gideon, der Schmied von 1866 (Lederschürze, Schüssel).
- [ ] RO23. **Entscheidungen der Nacht (schon umgesetzt, Widerspruch genügt):** Späte Läden
      verkaufen vier Lernkarten (Taktikspürnase, Turmregel, Planfinder, Phasenblick), damit sich
      Sparen lohnt und am Ende nicht 625 Münzen übrig sind (jetzt etwa 330). In Ghost Town stehen
      am Ortseingang zwei Pfosten ohne Schild (wie der Dialog sie beschreibt). Das Zimmer von 1866
      hat rosa Streifen statt Rosentapete (bis das Bild da ist). Das Gasthaus in Lockport ist
      L-förmig wie sein Gebäudebild, nicht T-förmig. Port Delacroix hat eine Brücke über das
      Hafenbecken; zum Hafen von Silicon Bay führt nur noch eine Treppe; vom Campus sind die Tiere
      verschwunden (nur Roboter, wie das Ortsblatt sagt). Die alte Bahnstrecke von 1879 endet an
      einem Prellbock hinter dem Laden in Desert Springs.
- [ ] RO24. **Vor der Veröffentlichung (Recherche vom 15.11.2026, Rechtliches bitte fachlich
      prüfen lassen):** Schon umgesetzt: Hinweis „mit KI erzeugt (PixelLab, Gemini)“ in Abspann und
      Lizenzseite (Googles Bedingungen verbieten, KI-Bilder als Menschenwerk auszugeben), die
      Pflichtnennung LimeZu mit Link auch auf der Lizenzseite, fehlende Grafikpakete in den
      Lizenzlisten (WidseyLabs, Cute SCKR, Maru), Datenschutzerklärung um das Spiel und einen
      Abschnitt „Kinder und Jugendliche“ ergänzt. Offen für dich: (1) Lizenz des Winterwald-Pakets
      von Maru beim Urheber erfragen (weder Verkaufsseite noch Ordner nennen eine). (2) Bestätigen,
      dass an Gemini und PixelLab keine gekauften Bilder (LimeZu, WidseyLabs) als Vorlage gingen und
      in Gemini das Speichern der Aktivitäten aus ist. (3) Datenschutzerklärung fachlich gegenlesen
      lassen. (4) Altersangabe: Empfehlung „geeignet ab etwa 8 Jahren (eigene Einschätzung)“; ein
      USK-Zeichen braucht ein Browserspiel nicht. (5) Soll der KI-Hinweis auch am Spielstart
      stehen? (6) Ist eine Fassung für Google Play oder den App Store geplant? Achtung: Die
      Bedingungen von Apple gelten als unvereinbar mit der GPL (Stockfish, chessops). (7) Vor 1.0
      einmal auf echten Geräten spielen: iPhone mit Safari, ein älteres Android-Handy, ein Tablet,
      langsames Netz.
- [ ] RO25. **Zur Revision: Entscheidungen vom 15.11.2026 (alle umgesetzt, Widerspruch genügt):**
      (1) Spielzeit gemessen: etwa 28 Stunden mit allem, Hauptweg 12 bis 13 Stunden; Akt 3 und 4
      länger als geplant, Regelwerk R40 auf die gemessenen Zeiten umgestellt. (2) Vorrunde der
      Meisterschaft: Schwelle 2 statt 2,5 Punkte (weniger Nachspiele), nach Runde 2 eine Pause ohne
      Brett mit Juno, Slick, Victor und Ambrose; Bea, Marcus, Tobias und Miss Odile je in einer
      Phase eine Stufe sanfter. (3) Elf neue Momente in Pflichtpartien, in denen jemand spricht.
      (4) Die Gegnerstärke folgt einem Leser, der im Buch besser wird (nie mehr als 200 unter
      seiner Abenteuerwertung). (5) Neue Nebenquest „Haraldsens Studie“: Ward sitzt die Nacht über
      einer Studie und spielt danach müder (wie Okafor und Big Joe). (6) Schach960 im Musikhaus mit
      Uhr; Céleste und der Prototyp mit Uhr; Ambrose, Dot, Victor auf der Bergstation bewusst
      ohne. (7) Zwischen Sams Revanche und dem Clubkampf eine kurze Pause mit Delgado und Juno.
      (8) Jede Redezeile hat eine Stimmung; Apostroph einheitlich ' statt ’. (9) Ghost Town: Laden
      mit Treppe zur Erinnerung 1866, Abzeichen nur noch Fund. (10) Ironwood: Gleise enden an
      Prellböcken (der Stein kam per Laster). (11) Offen: Der südliche Ring der Weltkarte über
      Summit City passt geometrisch nicht; Vorschlag folgt.
- [ ] RO26. **Zur Revision: Einstieg für Kinder (Spieltest als 11-jähriges Kind, 15.11.2026, alles
      umgesetzt, Widerspruch genügt):** (1) „Was jetzt?“ im Tagebuch nennt den nächsten Schritt,
      Questschritte sagen, wo etwas ist. (2) Ein goldenes Dreieck zeigt auf das nächste Ziel, ein
      Pfeil am Bildrand, wenn es außerhalb liegt; im Spielmenü abschaltbar. Beim Kartenwechsel kurz
      ein Ortsschild. (3) Kurzes Antippen des Steuerkreuzes macht genau einen Schritt; die Kamera
      hält den Helden über den Knöpfen. (4) Ambrose ist auf dem Dachboden zu sehen, wenn er
      erscheint. (5) Erste Partie: Ambrose spielt fest leicht (750), lässt kein Schäfermatt mehr
      zu und nimmt hängende Figuren; ein kurzer Nachgesprächszweig für schnelle Partien.
      (6) Fragen stehen nur einmal da (Antworten direkt darunter); erster Tag behutsam gekürzt.
      (7) Aufgaben: Lily nur Springeraufgaben, Stufe 1 höchstens zwei eigene Züge, keine
      Engine-Zahlen und Kürzel im Spiel, Lösung als Pfeile, Lob nach jedem richtigen Teilzug,
      „Ich komme nicht drauf“ ohne „Fast“. (8) Fortschritt in einer Aufgabenrunde und
      Ergebniskarten überstehen das Neuladen; Startanimation und Abzeichen der App stören das Spiel
      nicht. (9) Startkarte mit kurzen Sätzen und Downloadgröße; Münzen und Spielstärke werden
      einmal erklärt. (10) Sams Klage wartet auf die erste Lektion, sonst wäre die Nebenquest
      „Sams Dame“ verpasst (Simulation).
- [ ] RO27. **Zwei Gemini-Bilder neu und zwei Entscheidungen zum Einbau (16.11.2026, umgesetzt,
      Widerspruch genügt):** (1) **Motelzeile:** Bei Geminis Bild sind die Türen nur ein Viertel so
      hoch wie die Spielfigur; damit sie passen, müsste die Zeile 56 Kacheln breit sein. Bitte neu:
      „Pixel-Art, Draufsicht wie ein 16-bit-Rollenspiel, die Front eines einstöckigen Motels in der
      Wüste, 7 Zimmertüren nebeneinander, bunte Türen, flaches Dach, Gesamtbild 224 × 112 Pixel,
      jede Tür etwa 24 Pixel hoch und 12 breit, gerade von vorn, transparenter Hintergrund.“
      (2) **Bergstation:** Geländer, Wolkenmeer und Seilrad sind zugeschnitten. Die Karte ist aber
      ein reiner Innenraum ohne offene Plattform; Claude baut sie um, sodass die Plattform mit
      Geländer und Blick aufs Wolkenmeer begehbar wird (Szene 88). (3) **Pool** steht am Starlight
      Motel am Weg nach Summit City („Pool ohne Wasser“ laut Ortsblatt), nicht in Desert Springs,
      weil dort kein Platz ist. (4) **Schleuse:** Das letzte der fünf Tore ist offen, der Lastkahn
      liegt in der Kammer darunter. (5) Der Pavillon in Riverton ist 8 statt 10 Felder breit;
      sein Dach ragt etwas über Weg und Ufer. (6) Die Treppenlöcher ohne Geländer und die
      Bodenluke mit Leiter liegen bereit, sind aber nicht gesetzt. (7) Fundbilder B1 und B2
      fehlen noch (deine Prompts vom 15.11.).
- [ ] RO28. **Zur Revision: deine 31 Kartennotizen zu Maple Falls und Cedar Creek (16.11.2026,
      umgesetzt, Widerspruch genügt):** Alle eingearbeitet, das Treppenloch und der Wasserfall mit
      deinen Gemini-Bildern. Entscheidungen dabei: (1) Sitzen die Spieler links und rechts, steht die
      Schachuhr hinter dem Brett (wie in deiner Notiz), nicht daneben. (2) Bibliothek: Die Lesetische
      sind für zwei Bretter zu klein, deshalb je Tisch ein Brett in der Mitte. (3) Das Brett ohne
      schwarze Dame im Clubraum ist jetzt dasselbe Clubbrett wie überall, nur mit dem Radiergummi
      auf d8. (4) Im Zimmer steht Ambrose neben dem Schreibtisch, sonst ist das Brett nicht
      erreichbar. (5) Unter dem Tischbein steckt sichtbar der gefaltete Pizzakarton. (6) Der
      „Trinkbrunnen“ war ein Straßenabfalleimer, jetzt ein kleiner Treteimer am Kühlschrank. Neu
      sind acht Prüfregeln (10.80 bis 10.87: Tisch auf Höhe der Stühle, nichts übereinander auf
      Tischplatten, Steg über Wasser, Theke nah an der Wand, Loch im Boden beim Abgang, Häuser in
      Menschengröße, Fußmatte vor Außentüren, keine versetzte Straße). Sie finden jeden Fall
      deiner Notizen. In den übrigen Orten melden sie 84 ähnliche Stellen; die behebt Claude als
      Nächstes.
- [ ] RO29. **Zur Revision: dieselben Regeln in allen Orten, Bergstation mit Plattform (16.11.2026,
      umgesetzt, Widerspruch genügt):** Die 84 Stellen sind behoben oder als Absicht erkannt; der
      Kartenbau wertet solche Stellen jetzt als Fehler. Zur Durchsicht: (1) Die Pfahlhäuser der
      Pelikaninsel bleiben bewusst kleine Fischerhütten. (2) Schmale Reihenhäuser in der Capital
      gelten ab drei Geschossen als groß genug. (3) Das Haus des Schrankenwärters in Ironwood ist
      jetzt ein Blockhaus; passt das zur Industriestadt? (4) Fußmatten auch vor Schuppen,
      Wohnwagen, der verlassenen Tankstelle und der Musikhaus-Ruine. (5) Landstraße und Flussweg
      schlängeln sich absichtlich; ein Sprung, der Teil einer schrägen Kurve ist, gilt nicht als
      Fehler. (6) Bergstation (Szene 88): hinter einer gläsernen Doppeltür eine Plattform mit
      Geländer über dem Wolkenmeer, Victor steht dort am Geländer statt am Fenster, ein neuer
      Blick „Aussicht“ mit zwei Erzählersätzen, die Halle ist höher (Seilrad hinten). (7) In der
      Bibliothek stehen die Stühle jetzt mittig an den Lesetischen, in der Drechslerei rücken
      Hobelbank und Werktisch ein Stück an die Hocker heran.
- [ ] RO30. **Zur Revision: Musik lädt später, Geräusche als Text (16.11.2026, umgesetzt,
      Widerspruch genügt):** (1) Das Spiel lädt beim Start 24 statt 39 MB: Musik kommt erst, wenn
      sie läuft (dazu bis zu zwei Stücke der Nachbarkarten). Ohne Netz bleibt ein Stück still, das
      noch nie lief; „Musik aller Akte laden“ im Spielmenü lädt weiter alles vorab. Die Ladezeile
      sagt jetzt „Spiel geladen. Musik kommt beim ersten Hören dazu.“ (2) Möbelbilder liegen je Ort
      in einem Bogen; ein Kartenwechsel braucht etwa ein Viertel des Grafikspeichers. (3) Neu im
      Spielmenü unter Ton: „Geräusche als Text“ (ab Werk aus). Dann steht unten kurz, was zu hören
      ist, etwa „[Wind pfeift am Fenster]“ oder „[Musik: ruhig]“, auch bei ausgeschaltetem Ton. Die
      342 Texte sind Entwürfe; manche Stimmungen könnten zu viel verraten („erlöst“, „endgültig“).
      (4) Zwei Kleinigkeiten zur Durchsicht: Die Wand in Summit City außen endet an einer Stelle
      frei; eine Seitenkante riss dort eine sichtbare Lücke, deshalb bleibt es wie es war. Die
      Murmeltierpfeife liegt jetzt vor einer Wartebank der Bergstation.
- [ ] RO31. **Zur Revision: Laufhilfe des Helden (16.11.2026, umgesetzt, Widerspruch genügt):**
      Bisher zog das Spiel den Helden beim Laufen starr zur Mitte der Kachelreihe. Mit feiner
      Kollision gäbe es dann Lücken, durch die er passt, aber nicht kommt. Jetzt gleitet er bis zu
      4 Pixel neben die Mitte, wenn die Mitte vor ihm gesperrt ist. Das gilt auf allen Karten und
      macht das Laufen an Möbelkanten eher leichter. Bitte beim nächsten Spielen darauf achten, ob
      sich das Laufen irgendwo anders anfühlt.
- [ ] RO34. **Kartendurchsicht Akt 2 bis 4 (16.11.2026 nachts, Widerspruch genügt):** Ein Helfer hat
      alle Innenräume und die meisten Außenkarten von Akt 2 bis 4 nach den neuen Regeln durchgesehen
      und 25 Karten verbessert: je Türfeld eine Fußmatte vor der Tür (Lockport Gasthaus, Riverton
      Pavillon, Turnhalle Port Delacroix, Serverraum, Saloon, Antiquariat), gleiche Stühle in der
      Kantine Ironwood, Mülleimer an die Garderobe, Tischlampe auf die Kommode in Wards Hütte,
      Beistelltisch zwischen die Sessel in der Akademie, Kommode an die Wand in der Siedlungshütte,
      Sitzecke im Wohnwagen Riverton nicht mehr vor der Kochplatte, Felswände in Ghost Town und
      Desert Springs bis zum Kartenrand. Die gedrehte Treppe in deinem Zimmer ist jetzt deine Treppe
      zum Betrachter (3 Kacheln breit, unten der Absatz abgeschnitten, damit sie wie vorher an der
      Südwand endet); im Dachbodenloch liegen ihre obersten Stufen, nicht mehr gedreht.
      Meine Entscheidungen zu den offenen Geschmacksfragen (werden gerade umgesetzt): Wards
      Ohrensessel näher an den Spieltisch (die Teekanne rückt dafür); Steinbruch so lassen (die
      dünnen Seitenlinien gelten als Grubenrand); Gleise in Desert Springs links bis zum Rand;
      Sessel in der Lobby Silicon Bay zum Tisch gedreht; vier Stühle in der Garage bleiben
      (Zuschauer); gerader Läufer im Museum Ironwood bis zur Nordwand; besseres Kochfeld im
      Wohnwagen; Mülleimer der Arena-Halle an die Wand am Eingang.
- [ ] RO35. **Nachtrunde 16./17.11. mit den Nebenchats (umgesetzt, Widerspruch genügt):**
      Weltkarte: Alle 21 Brüche an den Kartennähten sind weg (14 waren Messfehler der Prüfung,
      behoben am Bayou-Ufer, an der Gasse in Maple Falls, am Pfad nach Crossroads und am Canyon,
      der jetzt auf seiner eigenen Karte nach Süden ausläuft). Der Zedernpfad mündet in Cedar Creek
      zwei Reihen höher, oberhalb des Flusswegs (ein Nadelbaum weniger). Am Ostende des Flusswegs
      beginnt der Asphalt gestaffelt mit Steinen und Grasbüscheln; die Bootsleine liegt am Poller.
      Die Gleise in Desert Springs laufen links bis zum Rand, die Prellböcke dort sind weg.
      Innenräume: Wards Ohrensessel direkt am Tisch, die Teekanne steht auf dem Tisch; weiße Sessel
      seitlich am Tisch in der Lobby Silicon Bay; gerader Läufer im Museum; im Wohnwagen ein Herd
      mit vier Platten (einen Zweiflammer gibt es im Grafiksatz nicht); Mülleimer neben der Tür der
      Arena-Halle; Vitrinen im Museum und Antiquariat mit Tiefe statt Abziehbild; weißer
      Garderobenschrank in Mamas Zimmer; roter Teppich im Diner zwischen Tür und Theke; der
      Kellertreppenraum der Bibliothek hat eine Holztür; im Archiv liegt eine Pfütze unter dem
      Wasserfleck, damit er nicht wie ein Schatten wirkt; Slick sitzt im Zustand „auf der Bank“ als
      stille Figur mit dem Brett neben sich. Lockport: Schilder richtig gehängt, Pflaster am Gras mit
      weichem Rand.
      Blickrichtung: Stehende Figuren können jetzt in alle vier Richtungen schauen; 145 Figuren
      schauen zu Tresen, Brett, Stand oder ihrem Gesprächspartner statt starr nach unten. Der
      Schaffner am Bahndamm schaut weiter nach vorn (zum Gleis zeigte er dir den Rücken).
      Spieltest mit echter Grafik (73 Türen, beide Bildschirmlagen): Der Held war an einigen
      Haustüren hinter dem Haus verschwunden, das ist behoben; die Kinder sind gut erkennbar; die
      Bildrate liegt bei 52 bis 60 Bildern je Sekunde. Sitzende sitzen jetzt sichtbar auf ihrem Stuhl,
      Sessel oder ihrer Bank (Spiel und Vorschau rechnen gleich); der Held liegt nie mehr unter
      Steuerkreuz, Knopfspalte oder Münzanzeige, und in der obersten Kartenreihe bleibt sein Kopf
      sichtbar.
      Raumgrößen: 15 Innenräume waren größer als ihr Gebäude außen. 11 passen jetzt (dafür weniger
      Möbel: Raststätte Crossroads mit offener Küche hinter dem Tresen und WC-Tür statt eigener
      Räume, Bibliothek Cedar Creek mit einer Regalreihe weniger, Gasthaus Lockport mit kürzerem
      Tresen, Kaffeehaus London mit zwei statt drei Schachtischen, Umkleide mit vier Spinden, Garage
      ohne Kisten und Reifen, Wohnwagen 12 × 6); Archiv und Serverraum haben je eine verschlossene
      Tür als Hinweis auf weitere Räume. Für Museum, Turnhalle und Kantine werden stattdessen die
      Gebäude außen größer (Museum im alten Bahnhof).
      Außenkarten ohne Abziehbilder: Motels in Crossroads und Desert Springs, Blockhütten in Summit
      City und im Pinewood-Camp, Marktstände auf dem Jahrmarkt (Glücksrad und Dosenpyramide fehlen),
      eine Scheune mit Schild als Turnhalle der Hochebene (Notlösung), ein Stellwerk in Ironwood,
      ein alter Bahnhof am Canyonpfad. Auf der Hochebene geht die grüne Wiese jetzt weich in den
      roten Sand über. Im Bayou führt der Quersteg jetzt bis zur Zypresseninsel (vorher waren drei
      Inseln zu Fuß nicht erreichbar).
- [ ] RO37. **Neue Bildwünsche aus der Nacht (für Gemini und PixelLab, wenn du Zeit hast):**
      (1) Sitzbilder in PixelLab (Bewegung „Sitting“) für Lily, Owen, Sam, Mrs. Calloway, Abernathy,
      Carla, Dash, Slick und die Statisten 05, 06, 07, 09, 11, 12, 13, 14, 16 und 18; heute sitzen
      sie mit dem Standbild. (2) Rettungsboot in Halterungen an der Fähre, 48 × 32 Pixel. (3) Rasthaus
      mit verschneitem Dach, 128 × 144, gleicher Umriss wie das heutige. (4) Schulturnhalle für die
      Hochebene, 160 × 144 (heute eine Scheune mit Schild). (5) Glücksrad für den Jahrmarkt, 48 × 64.
      (6) Größerer Pavillon in Riverton, 176 × 208 (offener Pavillon mit Geländer). (7) Alter Bahnhof aus Backstein
      als Museum in Ironwood, 160 × 144. (8) Breitere Werkskantine für Ironwood, 352 × 224 (heute eine
      1,7-fach vergrößerte Halle, die gröber gepixelt wirkt). Alle Bilder von schräg oben wie die
      übrigen Gebäude; die fertigen Gemini-Aufträge schicke ich dir im Chat.
      Außerdem (umgesetzt, Widerspruch genügt): Die Schleusentore in Lockport sind jetzt
      Fußgängerstege mit Geländer und einem breiten „GESPERRT“-Bock statt des flachen Bretts (R133).
      Deine Rückmeldungssammlung ist gepflegt: 145 von 149 Punkten sind erledigt oder überholt;
      offen sind nur die Sitzbilder (oben); das Diner in Maple Falls bleibt mit dem Plattenweg wie bestätigt.
- [ ] RO38. **Dialogprüfung aller Akte (17.11.2026, umgesetzt, Widerspruch genügt):** Vier Chats haben
      alle 71 Dialogdateien darauf geprüft, ob jede Figur im Moment passend spricht (erstes Treffen
      wie mit einem Fremden, kein Wissen vor dem Ereignis, Rückbezüge nur, wenn es passiert ist,
      gleiche Stimme in allen Akten, richtige Schachaussagen); rund 270 Stellen sind verbessert.
      Dazu: Victor steht immer nur an einem Ort; in der Kreidenacht heißt er „Junge mit Kapuze“ mit
      eigenem kleinen Porträt. Oma Ruth hat dich zuletzt mit sechs gesehen. Die Kletterin am Canyon
      heißt jetzt Tess Ferris (die Bergführerin bleibt Sol). Die Haustür in Maple Falls bleibt zu,
      bis die erste Lektion besprochen ist. Mrs. Okafor und Mama bekommen je Akt neue Alltagssätze
      (Okafor steht nach dem Vorwurf in Port Delacroix still zu dir, Mama ist in Akt 4 stolz).
      Gewinnst du die Fernpartie, hat Ambrose eigene Abschiedsworte dafür.
      Den Roman habe ich nach deiner Antwort (18.11.) angeglichen: Kapitel 33 „Fünf fehlten.“,
      Boateng sagt „eine junge Frau“, Victors Nachricht im Motel hat beide Zeilen.
- [ ] RO39. **Wegsperren und kurze Partien (17.11.2026 nachts, umgesetzt, Widerspruch genügt):**
      Deine Idee mit den Jugendlichen ist gebaut: das Testteam von Perfect Move (Zoe 16, Benji 14,
      Imani 15, in Westen mit Firmenlogo, ihr Tablet zeigt „ZERO lernt“). Drei Sperren, je eine zu
      Beginn von Akt 2, 3 und 4, nur bis zur ersten Ankunft in der nächsten Stadt: Benji im
      Zedernwald vor Riverton (Vorteil herausarbeiten, 10 Züge, Stellung Abb. 7.3), Imani an der
      Raststätte vor der Glasbrücke (fremde Eröffnung, Russisch, dann Vorteil in 12 Zügen), Zoe am
      Diner vor der Bergstraße (Endspiel gewinnen, Abb. 8.2, 15 Züge). Bei Benji und Imani öffnet
      Sieg oder Remis für immer, bei Zoe nur der Sieg; ein Fehlversuch kostet nichts, und nach dem
      dritten lassen sie dich trotzdem durch (Abbruch zählt nicht). Bogen: in Akt 2 stolz, in Akt 3 Zweifel, in Akt 4 ohne Westen auf
      deiner Seite (am Limonadenwagen vor der Arena und in der Kreidenacht). Dazu eine kleine
      Nebenquest mit 4 Schritten. Bilder sind vorerst Statisten und Ersatzporträts.
      Kurze Partien: Fünf Straßenbegegnungen sind jetzt kurz statt ganzer Partien (Dime: Caro-Kann
      vorgegeben, dann Vorteil; Schiffskoch: Endspiel Remis halten; Kreideblitz: Vorteil; Kreidenacht
      1 und Sol: Endspiel gewinnen), mit erzähltem Einstieg über dem Brett. Dein Zusatz mit den Bots
      ist auch gebaut: Deine App-Bots (mit Maia, Fehlerprofilen und Stilen) spielen im Voraus
      gegeneinander, und Stellungen mit passender Bewertung kommen in einen Vorrat (160
      Stellungen), aus dem eine Begegnung jedes Mal eine neue ziehen kann. Maia ist im Spiel
      Pflicht und wird mit dem Spiel geladen.
      Meine Empfehlungen, so umgesetzt: (1) Stärke der drei vorerst E + 260, 380, 560 (E = deine
      Stärke); wenn es nervt, zuerst diesen Abstand senken, nicht die drei Versuche. Gemessen am
      18.11.2026 (Bots in deiner Stärke 800, 1200 und 1600 gegen die drei, je 60 Kurzpartien):
      Bei Benji und Imani bist du im ersten Versuch in 52 bis 82 von 100 Fällen durch, bis zum
      zweiten in 77 bis 97; ihre Stärke bleibt. Zoe spielt jetzt im Endspiel nicht mehr schwächer
      als sonst. Ein Fehler ist behoben: Zoe schlug nach dem Damentausch manchmal die Dame nicht
      zurück und war im nächsten Zug matt.
      Zoes Sperre öffnet nur noch mit Sieg (18.11.2026, schon umgesetzt, Widerspruch genügt):
      Vorher reichte dort auch das Remis, und weil du mit einem Bauern mehr beginnst, warst du in
      80 bis 98 von 100 Fällen sofort durch. „Endspiel gewinnen“ heißt jetzt auch gewinnen. Ein
      Remis zählt als Fehlversuch wie eine Niederlage; nach dem dritten Fehlversuch lassen sie
      dich weiter durch, damit niemand hängen bleibt. Aus denselben Messpartien gerechnet (nicht
      neu gemessen): Im ersten Versuch bist du in 43, 42 und 72 von 100 Fällen durch (Stärke 800,
      1200, 1600), bis zum zweiten in 68, 66 und 92; über die drei Fehlversuche kommen bei 800
      und 1200 etwa 2 von 10 durch, bei 1600 kaum jemand. Damit ist Zoe die strengste der drei.
      Neue Sätze: nach einem Remis über dem Brett „Der Bauer ist noch da, aber durch ist er
      nicht. ‚Unentschieden‘, sagt Zoe. ‚Das reicht hier nicht.‘“; am Viehgitter Zoe: „Gehalten
      ist nicht gewonnen. Mit einem Bauern mehr reicht mir das nicht.“; Ambrose: „Ein Bauer mehr
      gewinnt nicht von allein. Du musst ihn führen.“ (nach dem Abschied der Erzähler: „Der Bauer
      mehr hat nicht von allein gewonnen.“); nach dem dritten Fehlversuch Zoe: „Dreimal ehrlich
      versucht. Das reicht uns. Geh durch.“ (vorher „Dreimal ehrlich verloren“). Ist dir das zu
      streng, sag es: Dann senke ich zuerst Zoes Stärke, nicht die drei Versuche.
      (2) Zoes Satz
      „Wer rauf zur Meisterschaft will …“ bleibt, als Bild für den Weg zum Turnier (die Straße führt
      erst nach Summit City). (3) „ZERO lernt“ schon in Akt 2 bleibt als Vorahnung; vorgestellt wird
      ZERO erst in Akt 3. (4) Eigene Figurenbögen erst, wenn dir die Truppe im Spiel gefällt;
      gewünscht wären dann je ein Bogen mit und ohne Weste, ein Klapptisch mit Tablet und je ein
      Porträtblatt (neutral, lächelt, lacht, nachdenklich). (5) Benji und Zoe könnten später bei
      jedem Versuch eine neue Stellung aus dem Vorrat bekommen; Imani bleibt bei der festen Eröffnung.
      Kurze Partien gemessen (18.11.2026 nachts, umgesetzt, Widerspruch genügt): Bots in deiner
      Stärke 800, 1200 und 1600 gegen Dime, Schiffskoch, Kreideblitz, Kreidenacht 1, Sol, Gus,
      Joggerin und Hollis, je 45 Kurzpartien. Dime, Schiffskoch, Kreideblitz und Sol: Ziel in 55
      bis 75 von 100 Fällen erreicht, bleibt so. Kreidenacht 1 (Lucena-Stellung): 77 bis 86, bleibt,
      weil dort deine Technik entscheidet, nicht der Gegner. Gus, Joggerin und Hollis (Stellung aus
      dem Vorrat) waren mit 80 bis 91 fast geschenkt; sie geben jetzt 7 statt 10 Züge („Sieben
      Züge“ in ihren Ansagen), damit sinkt es auf etwa 60 bis 85 (im Mittel 75 statt 85). Ein stärkerer Gegner half dort
      nicht, und mehr Vorteil verlangen erlaubt das Regelwerk nicht.
- [ ] RO40. **Zielhinweis bei fünf Schritten der Hauptgeschichte (19.11.2026, umgesetzt,
      Widerspruch genügt):** Beim Durchspielen mit echten Eingaben zeigte der Zielhinweis bei
      vielen Schritten nur bis zur Karte und dort auf nichts; man musste erraten, wen man
      ansprechen soll. Wo nur eine Figur in Frage kam, zeigt er jetzt auf sie. Bei fünf Schritten
      gab es mehrere Möglichkeiten; dort habe ich so entschieden:
      Ironwood, „Zum Werkstor gehen“ (der Kauf des Clubs) → Graham Hale. Er ist der Käufer, die
      Szene gehört ihm; Victor steht daneben und ist gleich danach das Ziel für die Einladung, so
      führt der Hinweis nacheinander zu beiden.
      Port Delacroix, „In der Turnhalle mit dem Club reden“ (der Vorwurf) → Miss Odile. Sie leitet
      den Club; Remy und Lou starten dasselbe Gespräch, sind aber danach die Ziele ihrer Aufgaben.
      Ghost Town, „Im Saloon nach Ambroses letztem Brief suchen“ → die Kerze in der Erinnerung
      (das Zimmer über dem Laden). Die Kerze startet die Szene; Gideon führt nur zu ihr. Der
      Hinweis zeigt damit in Ghost Town auf den Laden und dessen Treppe, nicht auf den Saloon. Der
      Questtext nannte aber den Saloon; er heißt jetzt „Im Zimmer über dem Laden nach Ambroses
      letztem Brief suchen.“ (schon umgesetzt, Widerspruch genügt).
      Ghost Town, „In der Nacht die Sterne über Ghost Town ansehen“ → der Sternenhimmel. So sagt
      es der Questtext; der Weg zum Bus startet dieselbe Szene, wäre als Ziel aber irreführend.
      Epilog, „Das alte Brett wartet auf deinem Schreibtisch“ → das Brett auf dem Schreibtisch in
      deinem Zimmer. So sagt es der Questtext; auf dem Dachboden steht seit dem ersten Abend kein
      Brett mehr.
      Schon umgesetzt in inhalte/abenteuer/quests.json, Widerspruch genügt.
