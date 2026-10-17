# Was noch zu tun ist (für den Autor)

Stand: 18.10.2026, Version 0.2.64. **Diese Datei ist die einzige, die du brauchst:** Hier steht
alles, was du testen oder entscheiden sollst, mit allen Informationen dazu, und nur, was noch
offen ist. Erledigtes wandert nach `docs/ENTSCHEIDUNGEN.md` (musst du nicht lesen).

**So antwortest du:** im Chat mit den Kürzeln, etwa „N203 ok“, „N205 falscher Pfeil“, „X5: so
lassen“, „T1: Vorschläge übernehmen“. Claude trägt alles ein. Bei Fehlern in der App hilft
**Einstellungen (Zahnrad) › Fehler melden**: Den kopierten Text mitschicken (App-Version,
Datenstand, Gerät), bei allem anderen kurz, **was** du getan hast und **was** passiert ist, gern
mit Bildschirmfoto.

Adresse: <https://schach-von-grund-auf.com/app/> (oder die installierte App). Vorher in den
Einstellungen prüfen, dass „App-Version 0.2.64“ dasteht; sonst die App neu laden.

Reihenfolge nach Wichtigkeit: Teil 1 testen (neueste Nummern zuerst), Teil 2 entscheiden (X, U,
T, C, K, D, E). Alle Nummern gelten für die aktuelle Version; frühere Versionen musst du nicht
mehr getrennt testen. Die Prüfschritte N1 bis N157 sind erledigt.

---

## Teil 1: Testen auf dem Handy (etwa zwei Stunden insgesamt, mit Engine)

Abhaken, was klappt. Wer wenig Zeit hat, nimmt zuerst „Neu in 0.2.64“, dann der Reihe nach die
älteren Abschnitte.

### Neu in 0.2.64 (etwa 20 Minuten, mit Engine; 64 Gegner mit Porträts, dein Wunsch vom 18.10.2026 nachts, Fable)

- [ ] N285. **Gegnerwahl mit Porträts:** Spielen › Gegner „Engine“. Unter „Vorgefertigter Gegner“
      steht oben eine Sprechblase mit Porträt, Name, Durchschnitt und Satz des gewählten Gegners;
      darunter die Kachel „Eigene Stufen“, dann je Stufe 1 bis 8 eine Gruppe mit acht Porträts
      (64 Gegner, die 18 bisherigen sind dabei). Antippen wählt, die Sprechblase wechselt, die
      drei Regler unten springen auf seine Stufen (verborgen bleibt, welche). Ein eigener Gegner
      erscheint als Kachel mit seinem Anfangsbuchstaben vor den Gruppen. Passen Porträts und
      Namen zusammen, und ist die Auswahl auf dem Handy bequem?
- [ ] N286. **Persönlichkeit spürbar:** Spiele je eine kurze Partie gegen Finn (Stufe 1, sehr
      aggressiv: schlägt alles, holt Bauern, vergisst den König) und gegen Oma Gerda (Stufe 1,
      sehr defensiv: zieht Figuren zweimal, lässt den König sitzen). Die beiden sollten sich
      deutlich anders anfühlen; der Rückblick nennt ihre Fehler und blinden Flecken beim Namen.
      Alle Bots haben jetzt einen Stil (aggressiv bis defensiv, Toleranz 0,3 wie bei eigenen
      Gegnern seit 0.2.61) und ein bis drei blinde Flecken.
- [ ] N287. **Stufe 8 mit Charakter:** Großmeister Grün bleibt ohne Schwäche; IM Vogt (sehr
      aggressiv, übersieht ruhige Züge) oder IM Haas (sehr defensiv, übersieht die Grundreihe)
      spielen in voller Stärke, aber mit Handschrift. Prüfe, dass sie trotzdem wie Stufe 8 wirken.

### Neu in 0.2.63 (etwa 5 Minuten; Impressum und Datenschutz mit deinen Angaben, Opus)

- [ ] N294. **Impressum und Datenschutz lesen:** <https://schach-von-grund-auf.com/impressum/> und
      <https://schach-von-grund-auf.com/datenschutz/>. Das Impressum nennt deinen Namen, die
      Anschrift in Hannover und kontakt@schach-von-grund-auf.com, dazu „Verantwortlich nach § 18
      Abs. 2 MStV“ und einen Satz zu den Rechten (Code GPL, Buchinhalte geschützt). Der Datenschutz
      nennt dich als Verantwortlichen, Cloudflare für Auslieferung und E-Mail (USA, EU-US Data
      Privacy Framework), keine Web Analytics, deine Rechte nach Art. 15 bis 21 DSGVO und die
      Aufsicht in Niedersachsen. Kein „Entwurf“ mehr. Stimmt alles? Claude ist kein Anwalt: Wer
      sichergehen will, lässt beide Seiten einmal prüfen, etwa mit einem Generator wie dem von
      e-recht24 vergleichen. Die Weiterleitung an dein Postfach bei goneo steht seit 0.2.63 im
      Datenschutz (Abschnitt „E-Mail“).

### Neu in 0.2.61 (etwa 25 Minuten, mit Engine; deine Rückmeldung zu 0.2.56, Opus)

- [ ] N285. **Gewertete Partie ohne Hilfen (S9):** Spielen, „Gewertete Partie“ angehakt: Die Haken
      „Züge zurücknehmen erlauben“, „Symbole am Brett“ und „Werkzeuge und Hinweis unter dem Brett“
      sind ausgegraut und leer, darunter der Satz, dass es in einer gewerteten Partie keine
      Zugrücknahme und keine Spielhilfen gibt. In der Partie gibt es weder „Zurücknehmen“ noch
      Werkzeuge. Haken weg: Alles ist wieder wählbar.
- [ ] N286. **Unmögliche Stellungen (S12):** Stellung aufbauen mit drei weißen Damen und allen
      acht weißen Bauern: „Partie beginnen“ geht nicht, der Hinweis nennt zu viele Steine für die
      Umwandlungen. Mit zwei Damen auf der Grundreihe und höchstens sieben Bauern geht es, und die
      Engine zieht.
- [ ] N287. **Stil (S13):** Eigener Gegner › Stil: Unter dem Regler steht jetzt, dass ein Stil die
      Spielstärke deutlich senken kann (bei „sehr aggressiv“ oder „sehr defensiv“ etwa eine halbe
      Stufe). Eine Partie gegen einen Gegner mit „sehr aggressiv“ fühlt sich spürbar wilder an.
- [ ] N288. **Phase nach dem Glossar (S17):** Abb. 11.4, Werkzeug „Phase“: „Eröffnung: Nach dem
      Glossar beginnt das Mittelspiel erst, wenn beide Seiten entwickelt sind und rochiert haben.
      Noch offen: Weiß muss noch rochieren; Schwarz muss noch entwickeln und rochieren.“ Abb. 11.12
      (Colle, schwarzer König gejagt): Mittelspiel. In einer eigenen Partie gilt weiter deine Lesart
      (eine Seite entwickelt genügt). Siehe auch D2.
- [ ] N289. **Sonderzüge aus Kapitel 0 (U5):** Training › Koordinaten › „Zug ausführen“: Unter den
      Sonderzügen stehen jetzt die Stellungen 0.12 bis 0.19 („aus Abb. 0.12“ usw.), mit kurzer und
      langer Rochade für beide Seiten, en passant und Umwandlung. Etwa jeder vierte Sonderzug kommt
      noch aus den zwei eigenen Stellungen (en passant für Schwarz, Umwandlung mit Schlag).
- [ ] N290. **Strukturerkenner mit Feldern zuerst (W5):** Training › Strukturerkenner: Bei Abb. 5.8
      (Najdorf) heißt es „Schritt 1 von 3: Welche Felder auf deiner 5. und 6. Reihe kann kein
      gegnerischer Bauer mehr angreifen?“ Richtig sind b6 und d5. Dann schwache Bauern, dann der
      Plan. Lehrbilder mit mehr als vier solchen Feldern haben nur zwei Schritte.
- [ ] N291. **Faktorenbilanz-Trainer mit dem Urteil des Buches (W9):** Bei Abbildungen mit
      Faktorenbilanz im Buch (etwa 3.6, 3.10, 3.14) steht nach „Prüfen“ „Buch: …“ statt „App: …“ und
      darunter „Verglichen mit der Faktorenbilanz des Buches zu Abb. 3.6“. Bei Abb. 3.6 sagt das
      Buch: Material Schwarz, Zeit Weiß, Königssicherheit Schwarz, Aktivität Weiß. Hat die
      Abbildung eine Warum-Frage, steht sie darunter.
- [ ] N292. **Warum-Fragen im Repertoire-Trainer (W10):** Spanische Partie, Seite Schwarz: Nach
      3... a6 erscheint unter dem Brett zugeklappt „Warum spielt Schwarz 3... a6?“. Die Fragen
      zählen nicht zur Wertung. 20 solche Fragen gibt es in den Varianten von Kapitel 2.
- [ ] N293. **Zug erraten mit Vergleich (W12):** Opernpartie als Weiß, absichtlich 2. d4 statt 2. Sf3: Unter „In der Partie geschah Sf3.“ steht nach ein paar Sekunden, ob dein Zug laut
      Engine etwa gleich gut, schwächer oder stärker war, und dazu „Frag dich in einem Satz, warum
      der Meister anders zog.“

### Neu in 0.2.60 (etwa 10 Minuten, mit Engine; Abhakliste der Fehlerarten aus S7, Fable)

- [ ] N284. **Abhakliste der Fehlerarten:** Einstellungen (Zahnrad) › Karte „Absichtliche Fehler
      der Engine“ unter „Darstellung und Training“: 14 Haken, alle gesetzt, darunter „Alle
      erlauben“, „Keine erlauben“ und „14 von 14 Arten erlaubt“. Nimm alle Haken bis auf „eine
      Figur hängen lassen (W1)“ heraus, dann Spielen › Stufe 2 (kein vorgefertigter Gegner), eine
      Partie spielen. Im Rückblick sollten die Fehler der Engine nur noch „hat eine Figur hängen
      lassen“ heißen (oder gar keine absichtlichen, wenn sich keiner anbot). Dann „Keine
      erlauben“ und eine Partie gegen Paula: Sie macht keine absichtlichen Fehler mehr, ihre
      blinden Flecken (Diagonalen, Rückzüge, Grundreihe) bleiben. Eigene Gegner behalten ihre
      eigene Liste. Zum Schluss „Alle erlauben“.

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

- [ ] N278. **Töne für Schach, Matt und Remis:** Einstellungen › Ton „an“. Spiele eine Partie:
      Ein Schach klingt nach dem Klacken als heller Ton, ein Matt als drei fallende Töne, ein
      Patt oder Remis als zwei gleiche Töne. Beim Nachspielen klingt es genauso.
- [ ] N279. **Warnton und roter Hinweis bei gesperrter Figur:** Tippe in einer Partie eine eigene
      Figur an, die gerade nicht ziehen darf. Das Feld leuchtet kurz rot, ein tiefer Warnton
      erklingt (bei Ton „an“), und unter dem Brett steht je nach Grund „Dein König steht im
      Schach: Erst das Schach beantworten.“, „Diese Figur ist gefesselt: Sie deckt deinen König.“
      oder „Diese Figur hat gerade keinen Zug.“ (etwa Lc1 in der Grundstellung). Nach knapp einer
      Sekunde verschwindet beides wieder.
- [ ] N280. **Schlagring statt Punkt:** Wähle eine Figur, die etwas schlagen kann. Auf der
      schlagbaren Figur liegt jetzt ein goldener Ring mit dunklem Rand statt des kleinen Punktes,
      auch auf einem schwarzen Bauern gut zu sehen. Leere Zielfelder behalten den Punkt.
- [ ] N281. **Figurensatz „Holz“ mit eigenen Formen:** Einstellungen › Figurensatz „Holz“: Die
      Figuren sind jetzt die Merida-Figuren (von Lichess, GPL) in Elfenbein und dunklem Nussbaum,
      also andere Formen als „klassisch“ (Burnett) und „wie im Buch“. Gefallen dir Formen und
      Farben? Andere Farbwerte sind in Minuten geändert.
- [ ] N282. **Stern für gewertete Partien:** Spielen › „Deine letzten Partien“: Hinter dem Ergebnis
      („1–0“) steht bei gewerteten Partien ein kleiner goldener Stern; ungewertete Partien (zu
      zweit, aus Abbildungen, mit Rücknahme) haben keinen.

### Neu in 0.2.57 (etwa 15 Minuten, mit Engine; blinde Flecken vollständig, Fable)

- [ ] N276. **Drei neue blinde Flecken:** Spielen › eigener Gegner › bearbeiten: In der Liste der
      blinden Flecken stehen neu „Röntgenangriffe (Fesselung, Spieß)“, „Zwischenzüge“ und „die
      Grundreihe“. Paula und Opa Hans übersehen jetzt die Grundreihe, Frieda Röntgenangriffe,
      Timo und Lena Zwischenzüge (Liste bei S7).
- [ ] N277. **Blind auch für Drohungen:** Ein Gegner mit blindem Fleck übersieht jetzt auch
      Züge des Gegners dieser Art: Er tappt in eine Stellung, deren Widerlegung etwa ein Abzug
      oder ein Grundreihenschach ist (höchstens eine Leichtfigur Verlust, zu 70 %). In der
      Auswertung steht dann wie bisher „Mit 14… hat die Engine einen Abzug nicht gesehen.“ Spiele
      ein paar Züge gegen Nina (blind für Abzüge) oder Paula (Grundreihe) und stelle ihr eine
      solche Falle. Gemessen (je zehn Partien gegen dieselbe Stufe ohne Flecken): Nina (Abzüge) 4:6, Paula (Diagonalen, Rückzüge, Grundreihe) 6:4, Lena (ruhige Züge, Zwischenzüge) 5:5; also höchstens eine halbe Stufe. Alle elf Flecken zugleich kosten etwa eine Stufe (1:9), das hat aber kein Gegner.

### Neu in 0.2.56 (etwa 5 Minuten, mit Engine; Engine-Variante im Rückblick, Empfehlung R5, Fable)

- [ ] N275. **„Danach etwa …“ in der Rückblickkarte:** Eine neue Partie zu Ende spielen (ältere
      Auswertungen haben die Zugfolge noch nicht), dann in der Zugliste auf einen Zug mit „?!“,
      „?“ oder „??“ springen. Die Karte sagt wie bisher „Besser war 12. Sf3.“ und dahinter neu
      „Danach etwa 12... Sc6 13. Lc4 Sf6 14. Sg5 d5.“ (die nächsten bis zu fünf Halbzüge der
      Engine nach dem besseren Zug, deutsche Figurenbuchstaben). Bei einem Zug, der der beste war,
      steht nichts dergleichen. Passt die Länge, oder lieber nur zwei bis drei Halbzüge?

### Neu in 0.2.55 (etwa 15 Minuten, mit Engine; Nachlesen im Buch, Opus)

Alle Rückfragen mit Buchbezug sind gegen den aktuellen Buchstand nachgelesen (je Rückfrage in
Teil 2 ein Absatz „Nachgelesen im Buch“). Wo das Buch die Frage klärt, ist es umgesetzt.

- [ ] N269. **Endspieltrainer, 9.23 und 9.41:** Training › Endspieltrainer: Abb. 9.23 (Turm auf
      der 7. Reihe) kommt als Remisaufgabe für Weiß; 1. Txa7 hält. Abb. 9.41 (falscher Läufer)
      kommt als Remisaufgabe für Schwarz: Bleibt der König in der Ecke, ist die Aufgabe nach zwölf
      Zügen geschafft. Abb. 9.42 (Läufer gegen Springer): Jetzt hältst du mit Schwarz.
- [ ] N270. **Übungen mit Zügen, die das Buch stützt (T1):** Übung 6 (Abb. 1.42) mit 4... Lb4+
      lösen: „Richtig! Auch dieser Zug ist gleich gut.“ 4... Df6 und 4... Sxd4 gelten nicht mehr.
      Übung 15 (Abb. 3.81) mit 4... Sf6 und Übung 83 (Abb. 12.5) mit 1. Te1: ebenfalls richtig.
      Übung 11 und 39 nur noch mit den Zügen des Buches.
- [ ] N271. **Notation mit englischen Buchstaben (U6):** Koordinaten › Zug aufschreiben: den Zug
      mit N, B, R oder Q statt S, L, T, D schreiben: richtig, mit dem Hinweis „Im Buch stehen
      deutsche Buchstaben (S, L, T, D)“.
- [ ] N272. **Strukturerkenner (W6, T5):** Die Plan-Sätze zu Isolani, hängenden Bauern und
      Doppelbauer lesen sich jetzt wie Kapitel 5 („aktiv spielen, möglichst keine Figuren tauschen“,
      „zusammenhalten, nur mit konkreter Drohung vorziehen“, „Figuren behalten, Bauernendspiel
      meiden“). Abb. 5.43 hat jetzt den Plan „Stellung öffnen“, 5.44 „Raum nutzen“, 11.70
      „Vorposten besetzen“.
- [ ] N273. **Studien (W11):** Über der Studie die aufklappbare Zeile „Die vier Prüfungen für
      Studien (Kapitel 10)“ mit den vier Prüfungen in kurzen Worten.
- [ ] N274. **Werkzeuge (C1, C2, C5):** Abb. 3.68, Faktorenbilanz: „Weiß: schlecht – der König
      steht im Schach und hat nur einen Zug“, kein „Weiß liegt vorn bei Königssicherheit“ mehr.
      Abb. 4.21, Warnsignale: nur „Bauer g2, einziger Verteidiger von f3 gegen Sxf3#“, kein e2 mehr.
      Abb. 9.34, Motiv: „Dauerschach“. Startseite: „in Richtung Elo 2000“ statt „etwa 2000 Elo“.

### Neu in 0.2.54 (etwa 10 Minuten, mit Engine; Brillant am Prüfstand von chess.com, Fable)

- [ ] N268. **Brillant wie bei chess.com:** Spiele die Opernpartie zu zweit nach (Züge bei N261).
      Karte „Spielstärke“, Weiß: Brillant jetzt 3 (10. Sxb5, 13. Txd7, 16. Db8+; chess.com 3).
      Neu: Ein Springer für zwei Bauern zählt als Opfer, ein Opfer aus dem Schach heraus nicht,
      und ein Opfer ist nur brillant, wenn man danach nicht schlecht steht und der zweitbeste Zug
      nicht ohnehin klar gewinnt. Geprüft an 100 Brillant-Zügen aus chess.com-Partien
      (Chessigma-Vergleich): 46 von 100 erkannt, 25 Fehlalarme in 100 Partien (etwa einer je vier Partien; die freien Werkzeuge im selben Vergleich: 23 bis 45 Treffer bei einem Fehlalarm alle drei bis sechs Partien). In deinen eigenen Partien sollten „Brillant“
      damit seltener grundlos auftauchen; melde Züge, die dir falsch vorkommen, mit PGN.

### Neu in 0.2.53 (etwa 10 Minuten; zwei Trainer der Stufe 3, Opus)

- [ ] N266. **Studien lösen:** Training › „Studien lösen“ › Trainieren: zuerst die Saavedra-Studie,
      Weiß am Zug. 1. c7 ziehen: Die App antwortet mit dem Zug des Buches, unter dem Brett steht
      die Zugfolge. Ein falscher Zug zeigt den Zug der Lösung als goldenen Pfeil, du ziehst ihn
      nach. Danach Réti, Heuäcker und die übrigen Studien des Kapitels. Rückfrage dazu: W11.
- [ ] N267. **Zug erraten:** Training › „Zug erraten“ › Trainieren: Partie (etwa „Morphys
      Opernpartie“) und Seite wählen. 1. e4 ziehen: „Getroffen!“, Stand „Getroffen: 1 von 1“. Dann
      einen anderen Zug als 2. Sf3: „In der Partie geschah Sf3.“, der Partiezug steht auf dem Brett,
      Stand „1 von 2“. Unter dem Brett die letzten acht Züge. Rückfrage dazu: W12.

### Neu in 0.2.52 (etwa 30 Minuten, mit Engine; Stufen 1 bis 3 menschlicher, Empfehlung R4, Fable)

- [ ] N264. **Stufe 1 bis 3 spielen menschlicher:** Spiele je eine Partie gegen Stufe 1 und
      Stufe 3 (Gegner „Stufe wählen“ oder ein eigener Gegner mit diesen Stufen). Erwartung: Die
      Engine spielt nicht mehr „dämlich, dann genial“. Sie sieht einzügige Dinge (Schlag,
      Drohung) meist, aber nicht alles zwei oder drei Züge tief; ihre Fehler sind meist klein,
      grobe selten, und sie verschenkt kaum noch grundlos in erzwungenen Lagen. Die
      absichtlichen, erklärten Fehler (Auswertung: „Mit 12… hat die Engine …“) gibt es weiter.
      Fühlt sich Stufe 1 noch zu stark oder zu schwach an? Bitte Partie als PGN mitschicken.
- [ ] N265. **Strähne und Tagesform:** Nach zwei eigenen Fehlern in Folge spielt die Engine auf
      Stufe 1 bis 3 drei Züge lang etwas wackliger; im Schach spielt sie genauer. Je Partie gibt
      es eine feste „Tagesform“ (dieselbe Partie, derselbe Gegner: mal etwas stärker, mal etwas
      schwächer). Das ist nicht einzeln sichtbar, nur als Eindruck über mehrere Partien.
      Gemessen (je zehn Partien Stufe gegen Stufe): Stufe 2 gewinnt 10:0 gegen 1, Stufe 3 10:0 gegen 2, Stufe 4 6,5:3,5 gegen 3, Stufe 5 10:0 gegen 4. Dafür hat Stufe 4 jetzt Skill Level 4 statt 3 (sonst war Stufe 3 ihr ebenbürtig). Fühlt sich der Sprung von 3 auf 4 jetzt richtig an (Rückfrage K1)?

### Neu in 0.2.51 (etwa 15 Minuten, mit Engine; Vergleich mit chess.com, Empfehlungen S18 und T4, Fable)

- [ ] N260. **Geschätzte Spielstärke aus der Genauigkeit** (S18): Karte „Spielstärke“ deiner Partie
      vom 17.10.2026 gegen Stufe 5: „etwa 2100“ für dich (vorher 2250) und „etwa 1450“ für die
      Engine (vorher 1700). Die Zahl kommt jetzt aus der Genauigkeit (95 % → 2500, 90 % → 2200,
      85 % → 1900, 80 % → 1600, 70 % → 1200, 60 % → 900), nicht mehr aus dem Verlust je Zug. Der
      Erklärtext unter der Karte sagt das. Die Wertung in den Einstellungen nimmt für neue Partien
      diese Zahl; alte Partien behalten ihre Werte.
- [ ] N261. **Brillant und Stark wie bei chess.com:** Spiele die Opernpartie zu zweit nach (1. e4 e5 2. Sf3 d6 3. d4 Lg4 4. dxe5 Lxf3 5. Dxf3 dxe5 6. Lc4 Sf6 7. Db3 De7 8. Sc3 c6 9. Lg5 b5 10. Sxb5 cxb5 11. Lxb5+ Sbd7 12. 0-0-0 Td8 13. Txd7 Txd7 14. Td1 De6 15. Lxd7+ Sxd7 16. Db8+ Sxb8 17. Td8#). Karte „Spielstärke“, Weiß: Brillant 2 (13. Txd7 und 16. Db8+; chess.com
      gibt 3, dazu 10. Sxb5, das unsere Engine 0,7 schlechter sieht), Stark 2 (vorher 8; chess.com
      „Großartig“ 1), Genauigkeit etwa 95 bis 99 je nach Rechenlauf (chess.com 96,1). Ein Abtausch (Läufer schlägt
      Springer, wird zurückgeschlagen) ist kein Opfer mehr; in einer Partie ohne Opfer steht
      „Brillant 0“ (vorher bis zu 4 für Abtausche). Ein Opfer mit Schach zählte bisher nie; jetzt
      schon. Sieht die Engine in einer Stellung kurz etwas ganz anderes als davor und danach
      (Sprung um drei Bauern hin und sofort zurück), rechnet die Auswertung diese Stellung am Ende
      noch einmal vier Sekunden lang nach; die Anzeige „läuft … von …“ dauert dann etwas länger.
      Während der Partie rechnet die Auswertung im Hintergrund jetzt 2 s je Stellung (dein
      Wunsch nach dem Versuch mit „Maximal“ bei chess.com); das Handy wird dabei etwas wärmer, und
      nach dem Ende fehlen meist nur die letzten Stellungen.
- [ ] N262. **Weniger „?!“ und „!“ in entschiedener Stellung:** Deine geblitzte Stufe-3-Partie
      vom 17.10.2026 (1. d4 Sf6 2. Lg5 Se4 3. h4 …, 52 Züge) hätte dir bisher 15 „?!“ gegeben
      (chess.com 2), weil in klar gewonnener Stellung jeder Verlust ab 0,5 Bauern ein „?!“ war.
      Jetzt gibt es dort „?!“ erst ab drei Bauern, darunter „gut“; Karte „Spielstärke“: Ungenau
      2, Verpasst 3, Patzer 1 (chess.com 2, 3, 1), Genauigkeit etwa 76 bis 79 (chess.com 76,1,
      mit „Maximal“ 77,2). Die Engine bekommt in verlorener Stellung kein „!“ mehr für den
      einzigen Zug, der nicht sofort noch mehr verliert (vorher 8, chess.com 0). Die Rückblickkarte
      sagt bei solchen Zügen „… ist in Ordnung (1,5 hinter …)“ statt „?!“.
- [ ] N263. **Fallen aus den Eröffnungskapiteln** (T4): Training › „Falle oder Köder“ › Runde. Neben
      den zwölf Fallenchecks aus Kapitel 4 kommen jetzt auch die Schläge mit Fragezeichen aus den
      Zugfolgen der Kapitel 2 und 3 dran (zum Beispiel 7… Sxd4?? im Schottischen Gambit, Abb.
      3.33, oder 10… Lxa1? nach 9… Lxc3?! in Kapitel 2). Unten steht wie bisher „Aus dem Buch: Abb.
      …“. Zahl der Buchaufgaben: 17 (vorher 12).

### Neu in 0.2.50 (etwa 10 Minuten, mit Engine; Genauigkeit wie bei chess.com, Fable)

- [ ] N257. **Genauigkeit wie bei chess.com:** Spiele eine Partie mit einem groben Fehler früh und
      gewinne sie trotzdem klar (oder nimm deine Partie vom 17.10.2026 gegen Stufe 5 aus den
      Partien). Karte „Spielstärke“: Die Genauigkeit liegt jetzt deutlich niedriger als vorher
      (deine Partie: etwa 88 % statt 97 % für dich, etwa 76 % statt 93 % für die Engine;
      chess.com: 86,8 und 80,3). Grund: Wie bei Lichess zählt ein grober Fehler jetzt mehr als
      viele gute Züge in schon gewonnener Stellung (Mittel aus gewichtetem und harmonischem
      Mittel statt einfachem Durchschnitt). Der Erklärtext unter der Karte sagt das.
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

- [ ] N253. **Endspieltrainer öffnen:** Training › Endspieltrainer (Kapitel 8 und 9) › „Trainieren“.
      Auswahl „Was üben?“: Alles gemischt (78), Mattführung, Bauernendspiele, Turmendspiele, Dame
      gegen Bauer, Leichtfiguren, je mit Anzahl; Schwierigkeit alle oder 1 bis 5; „Runde
      starten“. Eine Runde hat sechs Stellungen, leichteste zuerst.
- [ ] N254. **Mattführung gewinnen:** Mattführung, Stufe 1, Runde starten: Dame gegen König (Abb.
      8.4, 8.55 oder 8.56). Oben „Weiß: Gewinne diese Stellung gegen die Engine.“, unten „Aus dem
      Buch: Abb. … · Matt mit der Dame · Stufe 1 · Matt in höchstens N Zügen“. Du ziehst, die
      Engine antwortet in voller Stärke (Status „Die Engine denkt“ / „Du bist am Zug“). Nach dem
      Matt: „Richtig! Matt! Ziel erreicht.“ und „Weiter“. Setzt du patt: „Falsch. Remis. Der
      Gewinn ist verfehlt.“
- [ ] N255. **Hilfen und Kippen:** In einer Bauernendspiel-Aufgabe (etwa Abb. 8.23,
      Fernopposition) „Hinweis 1“: der Merksatz zum Thema („Merksatz: Opposition: …“, dazu ein
      Stichwort wie „Stichwort: Fernopposition.“); „Hinweis 2“: die goldene Figur, die ziehen
      soll; „Hinweis 3“: der goldene Pfeil mit dem Zug der Engine. Mit Hilfe zählt die Aufgabe
      nicht als richtig. Spiele absichtlich einen schlechten Königszug: „Falsch. Der Gewinn ist
      weg: Die Stellung ist laut Engine gekippt. Gehalten hätte Kf3.“ Bitte alle Merksätze
      kritisch lesen (Rückfrage X4); sie sind in Claudes Worten.
- [ ] N256. **Remis halten:** Turmendspiele, Stufe 4 oder 5: Philidor (Abb. 9.3, du spielst
      Schwarz, das Brett ist gedreht, die Engine zieht zuerst) oder Vancura (9.15). Oben
      „Schwarz: Halte das Remis gegen die Engine.“ Hältst du zwölf eigene Züge durch oder endet
      die Partie remis: „Richtig! Zwölf Züge gehalten …“ bzw. „Remis. Ziel erreicht.“ Verlierst
      du den Faden: „Die Stellung ist laut Engine gekippt. Gehalten hätte …“. „Aufgabe abbrechen“
      beendet eine Aufgabe als falsch und nennt den besten Zug.

### Neu in 0.2.48 (etwa 15 Minuten; drei neue Trainer, Opus)

- [ ] N250. **Zielbilanz-Übung:** Training › „Zielbilanz-Übung“ › Trainieren: Brett mit einer
      Eröffnungsstellung aus Kapitel 2 oder 3, darunter für Weiß und Schwarz je drei Zeilen
      (Zentrum, Entwicklung, Königssicherheit) mit „ja, teils, nein“. „Prüfen“ geht erst, wenn
      alle sechs gewählt sind. Danach steht neben jeder Zeile „App: …“ (grün, wenn deine Wahl
      stimmt, sonst rot) und darunter die Begründung wie im Werkzeug „Zielbilanz“. Fünf Aufgaben
      je Runde. Stimmen die Wertungen mit dem, was du im Buch lehrst?
- [ ] N251. **Faktorenbilanz-Trainer:** Training › „Faktorenbilanz-Trainer“ › Trainieren:
      Stellung aus Kapitel 3, je Faktor (Material, Zeit, Königssicherheit, Aktivität) „Weiß,
      gleich, Schwarz“. Nach „Prüfen“ je Zeile „App: …“ und darunter die ganze Faktorenbilanz mit
      Haltbarkeit und Fazit wie im Werkzeug. Rückfrage dazu: W9.
- [ ] N252. **Repertoire-Trainer:** Training › „Repertoire-Trainer“ › Trainieren: Eröffnung
      wählen (die Abschnitte von Kapitel 2 mit Steckbrief, etwa „Die Spanische Partie (Ruy
      Lopez)“) und „Du spielst Weiß/Schwarz“. Du ziehst deine Züge, die App antwortet aus dem Buch;
      unter dem Brett steht die Zugfolge („1. e4 e5 2. Sf3 Sc6“). Ein falscher Zug: „Nicht der Zug
      des Buches“ und ein goldener Pfeil, den du nachziehst. Als Schwarz steht der erste weiße Zug
      schon da und das Brett ist gedreht. Jede Variante des Buches (ab acht Halbzügen, höchstens
      zwölf Züge je Seite) ist eine Aufgabe, höchstens sechs je Runde. Rückfrage dazu: W10.

### Neu in 0.2.47 (etwa 15 Minuten, mit Engine; Claudes Empfehlungen schon umgesetzt, Opus)

Sechs Empfehlungen aus Teil 2 sind schon eingebaut, weil sie sich leicht zurücknehmen lassen:
S9, K5, R3, C8, T1, U9 (E2 stand schon so im Entwurf). Gefällt dir etwas nicht, genügt ein
Widerspruch, etwa „K5: zurück“; dann baut Claude es wieder aus.

- [ ] N244. **Rücknahme macht die Partie ungewertet (S9):** Eine gewertete Partie gegen die Engine
      aus der Grundstellung spielen, dabei einmal „Zug zurück“ nehmen, zu Ende spielen. In den
      Einstellungen bei „Deine Spielstärke“ kommt kein neuer Punkt dazu. Der Hinweis unter dem
      Haken „Gewertete Partie“ sagt: „Nimmst du einen Zug zurück, zählt die Partie nicht.“
- [ ] N245. **Kein „??“ bei klarem Gewinn (K5):** Eine Partie, in der du klar gewinnst (etwa
      Dame mehr), und statt eines Matts in zwei einen anderen gewinnenden Zug spielen. Der Zug
      bekommt höchstens „?!“ (ungenau), nicht mehr „??“, und steht nicht unter „Grobe Patzer“. In
      der Engine-Karte steht bei der Regel zu den Zeichen der neue Satz „Steht die ziehende Seite
      danach noch mit +5 oder besser, gibt es höchstens „?!““.
- [ ] N246. **Geschätzte Spielstärke (R3):** In der Karte „Spielstärke“ unter der Auswertung
      heißt die Zeile jetzt „Geschätzte Spielstärke“, der Wert „etwa 1400“. Die Erklärung sagt
      „keine Wertungszahl eines Verbands“.
- [ ] N247. **Berliner Endspiel (C8):** Abb. 5.30 › Werkzeug „Richtung“ aus schwarzer Sicht: Die
      Zeile heißt nur noch „Minderheit am Königsflügel (3 gegen 4)“ ohne „Ziel ist ein
      Minderheitsangriff“; das Fazit lautet „Schwarz spielt am Damenflügel: Dort bildet die
      Mehrheit einen Freibauern.“ Abb. 5.32 (Carlsbad)
      sagt für Weiß weiter „Minderheitsangriff“.
- [ ] N249. **Wiederholung in Taktik und „Falle oder Köder“ (U9):** Im Taktiktrainer eine Aufgabe
      mit „Lösung zeigen“ beenden. Im Bereich Training steht unter „Fällige Wiederholungen“ ein
      Termin für morgen. Am nächsten Tag steht dort „Taktiktrainer: 1 fällig“; der Knopf führt in
      den Trainer, oben steht „Wiederholen: 1 Aufgabe ist fällig“ und startet eine Runde nur mit
      dieser Aufgabe. Richtig gelöste neue Aufgaben kommen nicht in die Wiederholung.

### Neu in 0.2.46 (etwa 20 Minuten, mit Engine; Bots mit Persönlichkeit, dein Wunsch vom 17.10.2026 abends)

- [ ] N240. **Gegnerliste ohne Stufen:** Spielen › „Vorgefertigter Gegner“: jetzt 18 Gegner, in
      der Zeile nur Name, Durchschnitt und Klasse („Timo · ⌀ 4 · Gelegenheitsspieler“), ohne die
      Stufen je Phase. Ist ein vorgefertigter Gegner gewählt, verschwinden die drei Regler
      (Überraschung); bei „eigene Stufen“ und bei eigenen Gegnern sind sie da. Der Untertitel der
      Partie sagt „Timo · ⌀ 4 · Gelegenheitsspieler · du spielst Weiß“.
- [ ] N241. **Persönlichkeit:** Zwei Partien gegen Gegner gleicher Stärke, etwa Lotta und Paula
      (beide ⌀ 1) oder Nina und Selin (⌀ 3): In der Auswertung stehen bei den Fehlern der Engine
      verschiedene Arten, und dazu neue Sätze wie „einen Rückzug nicht gesehen“, „eine lange
      Diagonale nicht gesehen“, „einen langen Damenzug nicht gesehen“, „den ruhigen Zug nicht
      gesehen, nur die Schläge geprüft“, „einen Abzug nicht gesehen“, „einen stillen Bauernzug
      nicht gesehen“. Die Beschreibung unter dem Auswahlfeld nennt die Schwächen des Gegners.
- [ ] N242. **Blinde Flecken auch bei starken Gegnern:** Eine Partie gegen Viktor (⌀ 6,3) oder
      Doktor Berg (⌀ 6,7): Er macht keine groben Fehler, aber gelegentlich steht „einen Abzug
      nicht gesehen“ oder „einen seitlichen Turmzug nicht gesehen“ in der Auswertung; der Verlust
      ist dabei höchstens eine Leichtfigur. Spielt er trotzdem etwa so stark wie vorher?
- [ ] N243. **Eigene Gegner mit blinden Flecken:** „Eigene Gegner“ › Formular: unter den
      Fehlerarten die Haken „Blinde Flecken“ (Rückzüge, lange Läuferdiagonalen, Springerzüge
      rückwärts, lange Damenzüge, seitliche Turmzüge, ruhige Züge, Abzüge, stille Bauernzüge).
      Einen Gegner Stufe 6 · 6 · 6 nur mit „lange Läuferdiagonalen“ anlegen: Er spielt stark und
      übersieht ab und zu einen langen Läuferzug (Auswertung: „eine lange Diagonale nicht gesehen“).

### Neu in 0.2.45 (etwa 20 Minuten; drei Trainer auf Fables Daten, Opus)

- [ ] N236. **Taktiktrainer:** Training › Kapitel 7 › Taktiktrainer › „Trainieren“. Oben Thema
      (Gemischt, Mattbilder oder eines der Motive, mit Anzahl) und Schwierigkeit (alle, 1 bis 5)
      wählen, „Runde starten“. Acht Aufgaben, leichteste zuerst; bei Schwarz am Zug ist das Brett
      gedreht. Ziehen wie bei den Übungen; die App antwortet mit der Gegenseite. „Hinweis 1“ nennt
      ein Warnsignal, „Hinweis 2“ das Motiv, „Hinweis 3“ markiert die Figur gold, „Lösung zeigen“
      spielt alles vor. Danach „Welches Motiv war es?“. Unten steht, ob die Aufgabe aus dem Buch
      (Abb.) oder von Lichess kommt, und ihre Stufe.
- [ ] N237. **Falle oder Köder:** Training › Kapitel 4 › „Trainieren“, Stufe wählen, „Runde
      starten“. Ein grauer Pfeil zeigt das Angebot. „Erst die Warnsignale prüfen“ zeigt W1 bis W5
      am Brett. Dann „Nehmen“ oder „Nicht nehmen“: Danach steht, ob es eine Falle war (mit der
      Widerlegung und dem besseren Zug als goldenem Pfeil) oder ein Geschenk. Etwa die Hälfte der
      Angebote sind Geschenke. Die Klammerfalle (Abb. 4.2) gehört zu den schweren Aufgaben (Stufe 5).
- [ ] N238. **Strukturerkenner:** Training › Kapitel 5 › „Trainieren“. Das Brett zeigt nur Bauern
      und Könige. Schritt 1: alle schwachen Bauern beider Seiten antippen (gold), „Prüfen“: gold
      gefunden, rot übersehen, grau zu viel. Schritt 2: einen von drei Plan-Sätzen wählen; danach
      stehen Struktur und richtiger Plan da. Bitte die Plan-Sätze kritisch lesen (Rückfrage W6).
- [ ] N239. **„Nur dieser Zug“ bei Übungen:** Übung zu Abb. 1.40 lösen: Unter der Erklärung steht
      „Nur dieser Zug führt zum Ziel …“ (aus Fables Engine-Prüfung). Bei Übungen mit mehreren
      guten Zügen fehlt der Satz.

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

- [ ] N228. **Wertung nur aus der Grundstellung:** Spielen aus einer Abbildung („Gegen die Engine
      spielen“) oder nach „Stellung aufbauen“: Statt des Hakens „Gewertete Partie“ steht der Satz
      „Diese Partie zählt nicht für deine Wertung …“. Aus der Grundstellung ist der Haken da. Auch
      bei „Mensch“ fehlt er.
- [ ] N229. **Wertung zurücksetzen:** Einstellungen › Karte „Deine Spielstärke“, unten „Wertung
      zurücksetzen“: Nachfrage, dann „Ja, zurücksetzen“: Die Karte zeigt wieder den Hinweis vor der
      ersten Partie; die Partien bleiben in der Liste, zählen aber dauerhaft nicht mehr (eine
      danach fertig werdende Auswertung einer alten Partie ändert nichts).
- [ ] N230. **Kurve je Phase:** In der Karte „Deine Spielstärke“ die Wahl „Ansicht: Wertung /
      Eröffnung / Mittelspiel / Endspiel“. Bei einer Phase zeigt die große Zahl den Durchschnitt
      der Schätzung in dieser Phase über den Ausschnitt, die Kurve je Partie einen Punkt (Partien
      ohne genug Züge in der Phase fehlen, Endspiel oft). Erkennst du daran, wo Üben am meisten
      bringt?
- [ ] N231. **Eigene Gegner:** Spielen, Karte „Eigene Gegner“ (nur bei Gegner „Engine“): „Neuen
      Gegner anlegen“, Name „Rambo“, die drei Regler, Regler „Spielstil“ von sehr defensiv bis
      sehr aggressiv, Haken je Fehlerart (wirken in Stufe 1 bis 4; ohne Haken nie ein
      absichtlicher Fehler), „Gegner speichern“. Er steht in der Liste („Rambo · 3 · 3 · 3 · sehr
      aggressiv“) mit „Bearbeiten“ und „Löschen“ (Nachfrage) und im Auswahlfeld „Vorgefertigter
      Gegner“ unter „Eigene Gegner“. Eine Partie gegen ihn: Untertitel „Rambo · …“, in der
      Partienliste „Rambo“, auch nach dem Löschen. Spielt ein sehr aggressiver Gegner spürbar
      anders (Züge in deine Hälfte, zu deinem König, Schläge, Schachs) als ein sehr defensiver?
      Bleibt er dabei etwa gleich stark?

### Neu in 0.2.41 (etwa 30 Minuten, mit Engine; deine Wünsche vom 17.10.2026 nachmittags)

- [ ] N219. **Gegner wählen:** Spielen: Oben die Wahl „Gegner: Engine / Mensch (beide Seiten
      selbst)“, darunter bei Engine das Auswahlfeld „Vorgefertigter Gegner“ mit „eigene Stufen
      (Regler unten)“ und zwölf Gegnern, etwa „Lotta · ⌀ 1 · Einsteiger (1 · 1 · 1)“ bis
      „GM Grün · ⌀ 8 · Großmeister (8 · 8 · 8)“ (die Klammer: Eröffnung · Mittelspiel · Endspiel).
      Einen Gegner wählen: Die drei Regler springen auf seine Stufen, und die Beschreibung steht
      darunter. Einen Regler verschieben: Das Feld springt zurück auf „eigene Stufen“. In der Partie
      steht der Name im Untertitel („Timo · Stufen 5 · 4 · 3 …“).
- [ ] N220. **Spielhilfen zuschalten:** Spielen, unter „Züge zurücknehmen erlauben“: zwei Haken
      „Symbole am Brett (Zählen, Röntgen, Warnsignale)“ und „Werkzeuge und Hinweis unter dem Brett
      (bis zum Ende der Partie)“. Beide an: wie bisher. Nur Symbole: Die Symbole bleiben, Bündel,
      Werkzeugleiste und Hinweis fehlen. Beide aus: nur Brett, Uhr, Zugliste. Nach dem Partieende
      verschwinden die Bündel und der Hinweis in jedem Fall; die Symbole bleiben, wenn sie an waren.
- [ ] N221. **Gewertete Partie:** Darunter der Haken „Gewertete Partie (zählt für deine
      Spielstärke)“ mit dem Satz, dass die Wertung in den Einstellungen steht. Bei „Mensch“ fehlen
      Seite, Stufen, Eröffnung und der Haken.
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
- [ ] N224. **Deine Wertung:** Einstellungen (Zahnrad), ganz oben die Karte „Deine Spielstärke“.
      Vor der ersten gewerteten Partie ein Hinweis. Eine gewertete Partie gegen die Engine mit
      mindestens zehn eigenen Zügen zu Ende spielen (auch aufgeben geht) und die Auswertung
      abwarten: Die Karte zeigt die Wertung groß (erste Partie: die Schätzung der Engine für
      dich), darunter „1 gewertete Partie …“, das Auswahlfeld „Ausschnitt“ (letzte 10, 25, 50
      Partien; 1 Woche, 4 Wochen, 3 Monate, halbes Jahr, 1 Jahr) und die Kurve mit einem Punkt je
      Partie (grün Sieg, rot Niederlage, grau Remis; ein Tipp oder langes Drücken auf den Punkt
      nennt Datum, Ergebnis und Gegner). Nach einer zweiten Partie steigt oder fällt die Zahl
      (Sieg gegen gleich stark: +16).
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

- [ ] N210. **Stufe je Phase:** Spielen: Statt der Stufen-Chips drei Regler „Eröffnung“,
      „Mittelspiel“, „Endspiel“ (1 bis 8), je mit Nummer und Name. Eröffnung 1, Mittelspiel 4,
      Endspiel 2 einstellen, Partie beginnen: Der Untertitel sagt „Stufen 1 · 4 · 2 (Eröffnung ·
      Mittelspiel · Endspiel) · du spielst Weiß“. Sind alle drei gleich, steht wie bisher „Stufe 4
      · Gelegenheitsspieler“.
- [ ] N211. **Eröffnung „frei“:** Spielen › Eröffnung: „frei (die Engine spielt selbst)“ ist
      vorgewählt, darunter „eine Eröffnung des Buches (zufällig)“ und die einzelnen Eröffnungen.
      Mit „frei“ spielt die Engine ohne Buch; mit „zufällig“ wie bisher aus Kapitel 2 und 3.
- [ ] N212. **Auswertung ohne Wartezeit:** Eine Partie auf Stufe 1 mit etwa 20 Zügen, dabei vor
      einigen Zügen ein paar Sekunden warten. Nach dem Ende steht die Auswertung fast sofort da
      („läuft … von …“ nur für die letzten Stellungen). Während der Partie ist davon nichts zu
      sehen. Auch nach einer Rücknahme läuft alles sauber weiter.
- [ ] N213. **Zugklassen am Brett:** Beim Nachspielen trägt jeder Zug seine Marke am Zielfeld:
      grünes „✓“ für den besten Zug, goldenes „!“ für den einzigen guten Zug oder die Strafe nach
      einem Fehler, blaues „!!“ für ein gutes Opfer, graues „?!“, rotes „?“ und „??“; sehr gute,
      gute und Buchzüge ohne Marke, dafür mit Satz in der Karte („… ist ein Zug aus den
      Eröffnungen des Buches“, „… ist sehr gut (0,1 hinter …)“). Nach einem Fehler des Gegners
      heißt ein eigener Fehler „verpasst die Chance …“.
- [ ] N214. **Spielstärke je Phase und Züge nach Art:** In der Karte „Spielstärke“ stehen nach den
      bisherigen Zeilen die Zeilen Eröffnung, Mittelspiel, Endspiel („82 % · etwa 1500 (12
      Züge)“, „zu wenige Züge“ unter sechs, „–“ ohne Züge), darunter die Tabelle „Züge nach Art“
      (brillant bis Patzer) für dich und die Engine.
- [ ] N215. **Phasen in der Kurve:** Über der Auswertung trägt die Kurve goldene senkrechte
      Linien mit „M“ (erster Zug des Mittelspiels) und „E“ (Endspiel), sofern die Partie so weit
      kam.
- [ ] N216. **Partienliste:** Spielen › „Deine letzten Partien“: vor jeder Partie der König in der
      Farbe, die du gespielt hast (im gewählten Figurensatz), in der Zeile „… · du: etwa 1400“
      (bei kurzen Partien „du: 78 % genau“).
- [ ] N217. **Fehler der Engine je Phase:** Partien auf Stufe 1 bis 4 (gern Endspiele aus einer
      Abbildung von Kapitel 8 oder 9): Die Auswertung nennt neben den bisherigen Fehlerarten auch
      „ein Tempo verschenkt“, „auf Bauernraub gegangen“, „den Königsschild geschwächt“, „im
      Rückstand abgetauscht“, „den König passiv gelassen“, „einen Bauern vorschnell vorgeschoben“
      oder „patt gesetzt“, und die Rückblick-Karte erklärt sie. Wirken die Fehler menschlicher?
      Fühlt sich der Wechsel der Stufe beim Phasenwechsel weich an?
- [ ] N218. **Auswertung ohne Nachfrage:** Bei den Fehlern der Engine fehlt „Hast du es gesehen?“.

### Neu in 0.2.39 (etwa 15 Minuten, mit Engine; Rückmeldung zum Nachtest bis N174)

Neu: Figurensätze „klassisch“ und „Holz“, Nummernsprung in der Kopfzeile, Werkzeugtexte ohne
„+9“, Rückblick-Karte mit Erklärung, „!“, Spielstärke, Eröffnung für die Engine. **Vorher:** In den
Einstellungen muss „App-Version 0.2.39“ stehen.

- [ ] N201. **Figurensätze:** Einstellungen › Figurensatz: „wie im Buch“, „klassisch“ (bis
      0.2.38 „kontrastreich“; eine gespeicherte Wahl bleibt erhalten) und „Holz“. Mit Brettfarben
      „Holz“ und Figurensatz „Holz“ in Abb. 1.26: helle Figuren elfenbeinfarben, dunkle fast
      schwarz mit warmem Braunton, wie im Design „Dunkles Holz“ auf deinem Bild (die Formen
      bleiben die klassischen). Passen die Farben? (Rückfrage R1.)
- [ ] N202. **Nummernsprung:** In Abb. 1.26 auf den Titel „Abb. 1.26“ tippen: Unter der
      Kopfzeile erscheint „Abbildung öffnen“. „1,28“ eintippen und „Öffnen“: Abb. 1.28 ist da,
      „Zurück“ führt zum Kapitel. „1.99“: „Abbildung 1.99 gibt es nicht“ mit Vorschlägen.
      Ein zweiter Tipp auf den Titel schließt das Feld.
- [ ] N203. **Werkzeugtexte ohne Zahl:** Abb. 1.30, Röntgen: „Sxd4 gewinnt den Bauern“ (statt
      „Sxd4 (+1)“). Abb. 4.11, Warnsignale: „W5 … Lxf3 (schlägt die Dame mit Gewinn)“. Abb. 7.14,
      Erzwingende Züge nach der Engine: „Material bis zur Ruhe: +5 (gewinnt die Dame); Engine
      +6,2“. Abb. 4.13, Prüffragen: „… scheint den Bauern zu gewinnen: Warum lässt … das zu?“.
      Nur das Werkzeug „Zählen“ (Abtauschbilanz), die Faktorenbilanz (Material) und die
      Kandidatenzeile zeigen weiter Zahlen, immer mit dem Wort „Material“ oder „Bilanz“ dabei.
- [ ] N204. **Rückblick-Karte:** Eine kurze Partie mit klarem Fehler (Spielen › eigene Stellung
      nach 1. f3 e5, dann 2. g4??). Nach der Auswertung in der Zugliste auf „2. g4??“ tippen:
      Unter dem Brett steht eine Karte „2. g4?? kostet etwa 10,0 Bauern. Bewertung −0,4 → −M.“
      und „Besser war 2. …“. Bei einem Zug ohne Zeichen: „… war der beste Zug“ oder „… ist in
      Ordnung (0,2 hinter …)“.
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
- [ ] N207. **Spielstärke:** Unter der Auswertung die Karte „Spielstärke“ mit zwei Spalten
      („Du (Weiß)“, „Engine (Schwarz)“): Genauigkeit in Prozent, Spielstärke (geschätzt, „etwa
      1400“, unter zehn Zügen „zu wenige Züge“), Verlust je Zug, beste Züge („5 von 12“),
      Zeichen („! 1 · ?! 2 · ? 1 · ?? 0“). Darunter der Hinweis, wie gerechnet wird.
- [ ] N208. **Eröffnung wählen:** Spielen (Grundstellung) › Karte „Eröffnung“: Liste der
      Eröffnungen aus Kapitel 2 und 3; „Spanische Partie“ wählen, darunter „Hauptvariante: 1. e4
      e5 2. Sf3 Sc6 3. Lb5 …“. Als Weiß beginnen, 1. e4: Die Engine antwortet e5; 2. Sf3: Sc6; 3. Lb5: a6 (oder die Buchantwort). Der Untertitel nennt die Eröffnung. Bei einer Abbildung
      oder eigenen Stellung gibt es die Karte nicht.
- [ ] N209. **Eröffnung verlassen:** Mit „Spanische Partie“ 1. d4 spielen: Die Engine antwortet
      mit einer Buchantwort auf d4 oder selbst, ohne Fehler. Die Wahl „frei“ spielt wie bisher
      (alle Varianten, Buchtreue 0,85).

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

- [ ] N182. **Übungen im Kapitel:** Buch › Kapitel 1: Unter den Trainern steht „Übungen“ mit allen
      Übungen des Kapitels und „Übungen lösen (… offen von …)“. Eine Übung antippen: oben „Die
      Aufgabe steht im Buch …“ mit Verweis auf die Abbildung, darunter das Brett.
- [ ] N183. **Lösen auf dem Brett (Abb. 1.40):** „Ich habe nachgedacht“, dann „Hinweis 1“ (Motiv),
      „Hinweis 2“ (welche Figur), „Hinweis 3“ (goldener Pfeil). Einen falschen Zug ziehen: „Das ist
      nicht der Zug des Buches“, die Figur springt zurück. Den richtigen Zug ziehen: „Richtig!“,
      darunter die Erklärung (1. Sc7+! …) und „Nächste Übung“.
- [ ] N184. **Mehrzügige Lösung (Abb. 1.41):** Nach deinem richtigen Zug antwortet die App mit dem
      Zug der Gegenseite aus der Lösung; du ziehst weiter, bis die Lösung zu Ende ist. Ein im Buch
      genannter gleichwertiger Zug („akzeptiert“) zählt ebenfalls.
- [ ] N185. **Lösung zeigen (Q6):** Bei einer anderen Übung „Lösung zeigen“: Die Lösung steht auf
      dem Brett, darunter die Erklärung. Zurück im Kapitel trägt die Übung den Haken ✓ (deine
      Entscheidung: zählt als gelöst).
- [ ] N186. **Denkaufgabe (Kapitel 0, Abb. 0.27):** „… im Kopf oder auf Papier“, „Ich habe
      nachgedacht“, Erklärung lesen, dann „Gelöst“, „Teilweise“ oder „Nicht gelöst“: „Gespeichert“.
- [ ] N187. **Erst selbst denken:** Einstellungen: „Erst selbst denken“ steht wieder da (locker,
      streng) mit einem erklärenden Satz. Mit „streng“ zeigt eine Zugaufgabe Hinweise und „Lösung
      zeigen“ erst nach deinem ersten eigenen Zug, auch nach einem falschen.
- [ ] N188. **Wiederholung:** Training: Oben „Fällige Wiederholungen“. Nach einigen Übungen steht
      dort „Als Nächstes am …“ (morgen oder später, je nach Ergebnis). Am nächsten Tag: „Jetzt
      wiederholen“ führt der Reihe nach durch die fälligen Übungen.

**Erste Trainer** (Training › Kapitel 0 und 1 › „Trainieren“)

- [ ] N189. **Koordinaten, Feld finden:** 16 Felder auf dem leeren Brett ohne Randbeschriftung,
      die ersten acht mit Weiß unten, dann mit Schwarz unten. Ein richtiger Tipp führt sofort
      weiter, ein falscher zeigt das gesuchte Feld rot. Am Ende „… von 16 richtig“ und die Zeit.
- [ ] N190. **Zug aufschreiben und ausführen:** Ein goldener Pfeil zeigt einen Zug, du schreibst
      ihn (S, L, T, D, K; „0-0“ geht auch). Fehlt nur das Schachzeichen, gilt es mit Erinnerung.
      „Zug ausführen“: Der Zug steht in Notation da, du ziehst ihn; darunter auch Rochade,
      en passant und Umwandlung (Auswahl der Figur).
- [ ] N191. **Gangarten:** Die Figur ist hervorgehoben; alle Zielfelder antippen, „Prüfen“: gold
      gefunden, rot übersehen, grau zu viel.
- [ ] N192. **Zähltrainer, Bilanz zählen:** Feld rot markiert; Angreifer, Verteidiger und Gewinn
      wählen, „Prüfen“: Danach stehen die Pfeile und der Satz des Werkzeugs „Zählen“ da.
- [ ] N193. **Zähltrainer, hängende Figuren:** Alle hängenden Figuren beider Seiten antippen (oder
      „Keine hängt“). Stimmen die Felder, die die App als hängend nennt?
- [ ] N194. **Schach-Röntgen-Trainer:** Drei Schritte (deine Schachs, deine Schläge, was der
      Gegner hätte). Pfeil setzen: Figur, dann Zielfeld; nochmals entfernt ihn. Nach „Prüfen“ gold
      gefunden, rot übersehen. Ist die Aufgabe so verständlich und auf dem Handy bedienbar?
- [ ] N195. **Fortschritt:** Nach einer ganzen Runde zeigt das Kapitel unter Fortschritt den
      Trainer mit Durchgängen und richtigen Aufgaben.

### Neu in 0.2.35 (etwa 10 Minuten; neuer Buchstand vom 16.10.2026)

- [ ] N196. **Getauschte Abbildungen:** Abb. 2.29 zeigt die Greco-Variante nach 10... d5!, Abb.
      2.30 die Stellung nach 10... Lxa1? 11. Lxf7+ Kf8 12. Lg5. Abb. 3.31 nach 12. Kh1, 3.32 nach 13. f4 (mit der Bilanz), 3.33 nach 7... Sxd4??, 3.34 nach 9. Lb5+!. Jeweils nachspielen: Die
      Zugleiste führt genau zu dieser Stellung.
- [ ] N197. **Neue Nummern der Übungen:** Kapitel 3 (Übungen 14 bis 18), Kapitel 4 (19 bis 22) und
      Kapitel 12 (84 bis 86) stehen in der neuen Reihenfolge des Buches.

### Neu in 0.2.36 (etwa 30 Minuten, mit Engine; AP 11 Kalibrierung)

Neu: die kalibrierten Stufen und die Fehlerprofile der Engine (Konzept 8.2), dazu drei Befunde der
Gegenprüfung (Uhr, Auswertung).
Die Abnahme aus dem Konzept lautet: „Der Autor prüft im Test, ob sich die Abstufung richtig anfühlt.“

**Stufen und Fehlerprofile**

- [ ] N175. **Stufe 1 (Einsteiger):** Spielen › Grundstellung, Stufe 1, ohne Uhr, etwa 15 Züge.
      Die Engine spielt sichtbar schwach und macht etwa jeden dritten Zug einen Anfängerfehler
      (hängende Figur, ignorierte Drohung, Dame zu früh). Nach dem Ende (oder Aufgeben) nennt die
      Auswertung die Fehler der Engine mit Zugnummer und Art, darunter auch „eine Drohung
      ignoriert“ oder „eine Taktik übersehen“; beim Nachspielen erklärt die Rückblick-Karte sie
      (seit 0.2.39, N205). Stimmen die genannten Züge?
- [ ] N176. **Stufe 2 (Anfänger), kein Damenopfer:** eine Partie auf Stufe 2 (etwa 20 Züge). Die
      Engine verschenkt Bauern und Figuren, aber nie die Dame ohne Gegenwert (Konzept 8.2).
- [ ] N177. **Abstufung:** je eine kurze Partie auf Stufe 3, 5 und 7. Fühlt sich die Abstufung
      richtig an: Stufe 3 noch mit groben Fehlern (höchstens eine Leichtfigur), Stufe 5 ohne
      absichtliche Fehler, aber schlagbar, Stufe 7 deutlich stärker? Die Engine braucht je Zug
      höchstens 0,3 bis 2 Sekunden (Stufe 1 bis 8), auch auf dem Handy.
- [ ] N178. **Eröffnung:** Grundstellung, Stufe 1, 1. e4: Die Engine antwortet einige Züge lang
      mit den Eröffnungen aus Kapitel 2 und 3 (Zugliste), auch auf niedriger Stufe (Buchtreue
      0,85 je Zug, siehe Rückfrage K3). Seit 0.2.40 gilt das nur mit der Wahl „eine Eröffnung des
      Buches (zufällig)“; „frei“ spielt ohne Buch (N211).

**Gegenprüfung (Uhr und Auswertung)**

- [ ] N179. **Uhr im Hintergrund:** Partie mit 5 + 3, einen Zug spielen und sofort zum
      Startbildschirm des Handys wechseln, 20 Sekunden warten, zurück. Die Engine hat gezogen,
      deine Uhr hat in der Zwischenzeit nicht gelaufen (sie läuft erst nach der Rückkehr weiter).
- [ ] N180. **Uhr nach dem Neuladen:** laufende Partie mit Uhr, Seite neu laden (oder App
      schließen und öffnen), Partie fortsetzen: Deine Restzeit ist die vom Moment des Verlassens.
- [ ] N181. **Auswertung trotz Werkzeug:** Partie zu Ende spielen (oder aufgeben), während
      „Auswertung läuft … von …“ steht, das Bündel „Taktik“ › „Erzwingende Züge“ öffnen (rechnet
      mit der Engine). Die Auswertung läuft danach trotzdem zu Ende („Erste klare Abweichung …“).

### Neu in 0.2.33 (etwa 25 Minuten, mit Engine)

Neu: deine Antworten vom 16.10.2026 (Spielziel, Werkzeuge in der Partie, Figurensatz, Ton und die
Regeln C1 und C2).

**Spielen und Einstellungen**

- [ ] N158. **Kein Spielziel:** Spielen: Es gibt keine Auswahl „Spielziel“ mehr. Nach dem Ende
      einer Partie steht nur das Ergebnis, kein „Ziel erreicht/verfehlt“.
- [ ] N159. **Figurensatz und Ton:** Einstellungen: Figurensatz „klassisch“ (bis 0.2.38
      „kontrastreich“; „Holz“ seit 0.2.39, N201) zeigt überall die klassischen Figuren (weiß mit
      schwarzem Rand); Ton „an“: beim Ziehen klackt es, bei einem
      Schlag kräftiger (Stummschalter aus). („Erst selbst denken“ ist seit 0.2.37 wieder da, N187.)
- [ ] N160. **Warum-Fragen:** Bei den Warum-Fragen steht kein „vorbereitet“ mehr.
- [ ] N161. **Werkzeuge in der Partie:** Partie beginnen. Am Brett unten rechts: Zählen, Röntgen,
      W1–W7. Röntgen antippen: die Karte erscheint, ziehen geht weiter. Zählen antippen, dann ein
      Feld: Es wird gezählt statt gezogen; Zählen abwählen, dann wird wieder gezogen. Unter dem
      Brett die Bündel (Eröffnung prüfen bis Denkroutine) mit Reitern, etwa Taktik › Erzwingende
      Züge (die Engine rechnet die Kandidaten durch). In der ruhigen Ansicht (Auge) ist alles weg.
- [ ] N162. **Vorlauf:** Abb. 6.11 und Abb. 11.68 lassen sich jetzt von der Grundstellung an
      nachspielen (Karpow–Unzicker bzw. London-System).

**Kapitel 1 bis 4**

- [ ] N163. **Zielbilanz, Abb. 2.40:** „Zentrum: ja – … e4 ist angegriffen“ (grau, nicht rot);
      nach ein paar Sekunden darunter „Engine: Sxe4 gewinnt den Bauern e4 nicht: 3... Sxe4 4. De2 …“. Abb. 2.24: „d4 und e4“.
- [ ] N164. **Todsünden, Abb. 1.8:** Überschrift „Mögliche Todsünden“, oben der Hinweis „Nur
      Kandidaten …“, Zeile „3... Df6: mögliche verfrühte Dame“.
- [ ] N165. **Phase:** Abb. 11.28 (Anderssen–Dufresne): seit 0.2.61 nach dem Glossar „Eröffnung“
      (Schwarz hat nicht rochiert), auch wenn du die Sicht wechselst. Abb. 12.2: Mittelspiel.
- [ ] N166. **Faktorenbilanz:** Abb. 3.6: „Weiß: teils – rochiert, aber ohne f-Bauern vor dem
      König“. Abb. 3.60 (Weiß matt): nur „Matt: Die Partie ist entschieden.“ Abb. 3.23 (Schach):
      oben „Erst das Schach und die Taktik zu Ende rechnen …“.
- [ ] N167. **Warnsignale:** Abb. 4.29: W4 „Springer f3, einziger Verteidiger von h2 gegen
      Dxh2#“. Abb. 4.8: W2 „Läufer b2 – Dame e5 – Bauer g7 (weicht die Dame, fällt g7)“.
      Abb. 4.13: W5 „scheinbar: Bauer d5, nur von der gefesselten Figur f6 gedeckt …“.

**Kapitel 5 bis 7**

- [ ] N168. **Skelett-Röntgen:** Abb. 5.30 (Berliner Endspiel), Richtung: „Weiß spielt am
      Königsflügel: Dort bildet die gesunde Mehrheit mit dem Kandidaten e5 einen Freibauern …“.
      Abb. 5.27: „Hebel c4–c5 gegen die Basis d6“ gold, darunter „Weitere Hebel“ grau. Abb. 5.40,
      Figuren: „Läufer f4: schlecht nach der Farbe, aber aktiv …“, f4 gold. Abb. 5.13, Felder:
      „Luftloch h3: der König hat Luft auf h2“.
- [ ] N169. **Planfindung:** Abb. 6.4 aus schwarzer Sicht, Wo?: „Der Gegenschlag ist schon da: d5
      greift e4 an“. Abb. 6.17, LAP: „Dringe mit Turm d2 nach d7 ein …“ (goldener Pfeil). Abb. 6.32
      (Schach): nur „Erst das Schach beantworten …“.
- [ ] N170. **Taktik:** Abb. 7.14, Erzwingende Züge: nach und nach je Kandidat „Material bis zur
      Ruhe: …“;
      „Am stärksten: 2. Th8+“, am Brett „2+!“. Abb. 7.10, Motiv: „Sf7+: Abzug“ (die Zugfolge
      beginnt jetzt mit 1. Sf7+). Abb. 7.28: „De1+: Dauerschach.“ Übung 7.53: Überlastung.

**Kapitel 8, 9 und 12**

- [ ] N171. **Opposition:** Abb. 8.23: nur Kf3. Abb. 8.36: „Hier entscheidet nicht die
      Opposition, sondern das Quadrat …“. Abb. 8.53: „… das Reserve-Tempo h4 …“.
- [ ] N172. **Schlüsselfelder und Quadrat:** Abb. 8.29: Fazit „Weiß gewinnt mit e7 (Sonderfall 6. Reihe).“ Abb. 8.50: „Die Quadratregel gilt nur für einen Bauern allein; verbundene
      Freibauern schützen sich gegenseitig …“. Abb. 8.46: „Nach a6 läuft der Bauer a6 durch …“.
- [ ] N173. **Turmendspiel und Erkennungsbilder:** Abb. 9.3: „Philidor: Turm auf der 3. Reihe von
      dir aus, nach dem Bauernzug von hinten Schach geben.“ Abb. 9.23: „Mehrere Bauern am Brett“.
      Abb. 9.37: „… getrennte Freibauern b5 und g5: meist gewonnen …“.
- [ ] N174. **Kandidaten:** Abb. 12.4: b5 ist nicht mehr der beste Kandidat (nach b5 folgt Dxf7#,
      der Kandidat scheidet aus). Abb. 12.3: Die App prüft die Abwehrzüge und findet auf 3... f5
      die Antwort 4. Sxe6.

---

## Teil 2: Entscheiden (Claude hat jeweils plausibel entschieden; du bestätigst oder änderst)

### X. Endspieltrainer (Fable, 0.2.49; plausibel entschieden, bitte prüfen)

- [ ] X5. **Schwierigkeit:** Grundstufe je Thema (Dame 1, Quadrat 1, Turmmatt 2, Opposition 2,
      Bauernrennen 2, Randbauer 2, Läuferpaar 3, Schlüsselfelder 3, Durchbruch 3, Freibauer 3,
      Zugzwang 4, Turmendspiel 4, Dame gegen Bauer 4, Leichtfiguren 4), eine Stufe mehr, wenn der
      erste Zug der einzige ist. Nicht an Lichess geeicht (dort gibt es keine ausspielbaren
      Endspiele). **Empfehlung:** so lassen und nach deinem Test nachjustieren.

### U. Übungen und erste Trainer (Opus, 0.2.37; plausibel entschieden)

- [ ] U12. **Leerfälle (D1, angenommen am 15.10.2026, noch offen):** Bestandsaufnahme vom
      17.10.2026: 11 Werkzeuge haben schon einen Leerfall, aber jedes mit eigenem Text (und meist
      mit dem Satz doppelt, als Befund und als Fazit). 15 Werkzeuge prüfen nicht, ob sie greifen,
      und zeigen immer eine volle Karte: Angriffsregel, Todsünden, Zielbilanz, Faktorenbilanz,
      die vier Skelett-Werkzeuge, Ruhe, Sechs Regeln, Opposition, Schlüsselfelder, Quadrat,
      Turmendspiel (teils), Warnsignale Kapitel 7. Claude hat D1 über Nacht **nicht** umgesetzt,
      weil es Ergebnisse ändert, die du gerade nachtestest (etwa die Faktorenbilanz an Abb. 3.6,
      N166: Material gleich, also nur noch „Material gleich – hier hilft die Planfindung mehr“).
      Vorschlag: einheitlich nur ein Satz (ohne leere Befunde), Bedingungen wie in der Tabelle
      von damals; die Eröffnungsphase nach der Phasenregel der App (eine Seite hat noch zwei
      Leichtfiguren zu Hause, bei Buchabbildungen nach dem Glossar), nicht nach Zug 15. Soll Claude das so umsetzen, und gilt die
      Faktorenbilanz dann auch in der Eröffnung bei gleichem Material (wie 3.6)?
      **Empfehlung:** ja, umsetzen, aber erst nach deinem Nachtest N158 bis N174, damit du die
      Werkzeuge noch einmal mit vollen Karten siehst. Die Faktorenbilanz auch in der Eröffnung
      zeigen: Das Buch nutzt sie gerade bei den Gambits, also in der Eröffnung. (Abb. 3.6 gilt seit
      0.2.61 nach dem Glossar wieder als Eröffnung, Weiß hat noch nicht rochiert.)

### T. Trainerdaten für Taktiktrainer, Strukturerkenner und „Falle oder Köder“ (Fable; plausibel entschieden)

Die drei Trainer sind seit 0.2.45 in der App (Teil 1, N236 bis N238; Rückfragen W1 bis W7, am 17.10. entschieden). Was Claude entschieden
hat, mit Rückfrage:

- [ ] T1. **Übungen, Engine-Prüfung:** Alle 86 Übungen sind mit Stockfish gegengeprüft: 56
      Lösungen halten, 6 sind gleichwertig zu einem anderen Zug, eine ist etwas schwächer, keine
      ist widerlegt. Vorschläge für zusätzlich „akzeptierte“ Züge (gleich gut laut Engine):
      Übung 2 (Abb. 0.26, Buch 6... h6): a6, Le7, d6, a5; Übung 6 (1.42, Buch 4... Sf6,
      akzeptiert Lc5): dazu Df6, Lb4+, Sxd4; Übung 11 (2.151, Buch 4... h5, akzeptiert h6): dazu
      Dc7, Da5+, a6; Übung 15 (3.81, Buch 4... d5): dxc3, Sf6; Übung 39 (7.51, Buch 1. Sf4+):
      Sxf6+ gewinnt ebenfalls klar. Bei den Technikübungen 60 (8.65, 1. g5) und 66 (9.47, Lucena)
      gewinnen auch viele andere Züge, Vorschlag: dort nichts ergänzen, die Übung lehrt einen
      Weg. Befund: Übung 83 (12.5, Kandidatenzüge): 1. Dc2 ist 0,44 schwächer als 1. Te1, beide
      vorteilhaft. Welche Vorschläge übernehmen, und Übung 83 so lassen?
      **Empfehlung:** die Vorschläge für die Übungen 6, 11, 15 und 39 übernehmen. Wer einen laut
      Engine gleich guten Zug findet, soll nicht „falsch“ hören; die Erklärung zeigt danach ohnehin
      die Lösung des Buches. Übung 2 ist in der App eine Denkaufgabe (Notation schreiben), dort
      ändern die Vorschläge nichts. Übung 83 so lassen, beide Züge sind gut.
      **Nachgelesen im Buch (17.10.2026):** Das Buch spricht gegen mehrere Engine-Vorschläge,
      deshalb ist die Umsetzung aus 0.2.47 geändert. Übung 6: Das Buch kritisiert 4... Sxd4?! und
      empfiehlt „einen Entwicklungszug, der selbst etwas angreift“; dazu passt nur 4... Lb4+ (Df6
      wäre die verfrühte Dame). Übung 11: „Richtig ist 4... h5 oder 4... h6“; kein Zusatz. Übung
      15: gesucht ist ein Zug „ohne weiteres Material zu nehmen“, 4... d5 nur „die einfachste
      Antwort“: 4... Sf6 gilt, dxc3 nicht. Übung 39: „Auch 1. Sxf6+ gibt Schach, … lässt die Dame
      allerdings stehen“; kein Zusatz. Übung 83: „ein ruhiger Zug wie 1. Dc2“, also ist Dc2 nur ein
      Beispiel: 1. Te1 gilt jetzt auch. Schon umgesetzt in 0.2.55 (Nachtest N270), Widerspruch
      genügt.
- [ ] T2. **Menge der Zusatzaufgaben von Lichess** (gemeinfrei, CC0): 637 Taktikaufgaben (je
      Motiv und Stufe 8) und 120 Fallen-Aufgaben (je Stufe 12 Fallen und 12 Geschenke), dazu 37
      Taktik- und 12 Fallenaufgaben aus dem Buch. Genug, zu viel, oder lieber mehr für die Stufen
      1 bis 3?
      **Empfehlung:** reicht vorerst. Je Motiv und Stufe acht Aufgaben sind etwa zehn Runden; mehr
      erst, wenn du oder Testleser merken, dass sich Aufgaben wiederholen.
- [ ] T3. **Schwierigkeit:** Die Stufe 1 bis 5 jeder Aufgabe ist gemessen (Lichess-Wertung aus
      Millionen Lösungsversuchen; Buchaufgaben über die Suchtiefe der Engine daran geeicht). Soll
      es zusätzlich ein Feld geben, mit dem du die Stufe einzelner Buchaufgaben selbst setzt?
      **Empfehlung:** nein. Die Stufen sind gemessen, nicht geschätzt; ein Handfeld lohnt sich erst,
      wenn dir einzelne Buchaufgaben auffallen, die falsch eingestuft wirken.
- [ ] T4. **Fallen aus Kapitel 2 und 3:** Der Fallentrainer hat die zwölf Fallenchecks aus
      Kapitel 4 (Klammerfalle bis Damenfang auf b2). Sollen auch die Fallen aus den
      Eröffnungskapiteln dazu (Zugfolgen, in denen ein Schlag mit „?“ steht, etwa im
      Damengambit)? Die Pipeline könnte sie genauso ziehen.
      **Empfehlung:** ja. Fallen aus den Eröffnungen des Buches sind genau die, in die Leser später
      tappen; die Pipeline kann sie mit wenig Aufwand gleich ziehen (Fable).
      **Schon umgesetzt in 0.2.51 (Nachtest N263): jeder Schlag mit Fragezeichen in den Zugfolgen
      der Kapitel 2 und 3, den die Engine als Falle bestätigt. Widerspruch genügt.**
      **Nachgelesen im Buch (17.10.2026):** Kapitel 4: Eine Falle sieht aus wie Gewinn und kostet
      durch „eine sofortige taktische Möglichkeit“, anders als ein Gambit mit dauerhafter
      Kompensation. Empfehlung bestätigt: nur Schläge mit sofortiger Widerlegung.
- [ ] T5. **Strukturerkenner:** 134 Aufgaben, davon 46 aus Kapitel 5 mit Struktur, Seite und
      Plan nach dem Unterabschnitt, in dem das Buch die Abbildung zeigt, und 88 aus anderen
      Kapiteln mit einer klaren Struktur (Isolani, hängende Bauern, Minderheitsangriff,
      Doppelbauer, festgefahrene Kette, Mehrheit). Die Zuordnung Abbildung → Struktur und die
      Plan-Sätze sind ein Vorschlag von Claude (die Sätze stehen jetzt in der App, W6 am 17.10. angenommen). Reicht dir die Durchsicht in der App, wenn der
      Trainer da ist, oder willst du die Tabelle vorher als Liste im Chat sehen?
      **Empfehlung:** in der App durchsehen. Der Trainer ist seit 0.2.45 da (N238); auffällige
      Abbildungen und Sätze einfach mit Nummer melden.
      **Nachgelesen im Buch (17.10.2026):** Das Buch liefert die Zuordnung selbst (Strukturtabelle,
      Tabelle der Schwächen, Skelettbilanzen mit Folgerung). Drei Pläne wichen ab und folgen jetzt
      der Folgerung des Buches: 5.43 „Stellung öffnen“ (statt guten Läufer behalten), 5.44 „Raum
      nutzen“ (statt Flügel der Kette), 11.70 „Vorposten besetzen“ (Springer nach e5; der
      Doppelbauer ist gedeckt und kein Ziel). 5.17 und 5.22 passen mit den neuen Plan-Sätzen (W6).
      Schon umgesetzt in 0.2.55 (Nachtest N272).

### C. Neue Regeln der Werkzeuge (plausibel entschieden)

- [ ] C1. **König im Schach in der Faktorenbilanz** (C1.6): Claude wertet ihn „teils“ (die
      Empfehlung sagte nur „nicht gut“). Deshalb heißt es in 3.23 und 3.68 weiter „Weiß liegt
      vorn bei Königssicherheit“ (der schwarze König ist „schlecht“). Soll ein König im Schach
      „schlecht“ heißen?
      **Empfehlung:** „teils“ lassen. Ein Schach ist oft nur vorübergehend; „schlecht“ wäre der
      König erst, wenn er dauerhaft ungeschützt steht.
      **Nachgelesen im Buch (17.10.2026):** Abb. 3.68: Das Buch sagt „Weiß ist schon verloren“, es
      bleibt nur 8. Ke2, dann Lg4#. Dort war „Weiß liegt vorn bei Königssicherheit“ falsch. Jetzt
      heißt ein König im Schach mit nur einem einzigen Zug „schlecht – der König steht im Schach
      und hat nur einen Zug“; sonst bleibt es bei „teils“ (3.23 hat mehrere Abwehrzüge, das Buch
      gibt dort keine Bilanz). Schon umgesetzt in 0.2.55, Widerspruch genügt.
- [ ] C2. **W4 in 4.21** (C1.7): Mit der neuen Regel (einziger Verteidiger gegen Matt) meldet die
      App dort zusätzlich die Bauern e2 und g2 als einzige Verteidiger von f3 gegen Sxf3#.
      Schachlich richtig, aber nicht das, was das Buch nennt. So lassen?
      **Empfehlung:** so lassen. Es ist schachlich richtig, und der Leser lernt dabei, wer f3
      wirklich verteidigt.
      **Nachgelesen im Buch (17.10.2026):** Die Rückfrage war falsch gestellt: Nach Sxf3+ verlässt
      der Springer e5 die e-Linie, dann fesselt die Dame e7 den Bauern e2 an den König, genau wie
      das Buch es für 4.22 erklärt („exd3 ist illegal“). e2 verteidigt f3 also nicht. Jetzt zählt
      ein Verteidiger gegen ein Matt nur, wenn er nach dem Mattzug legal ziehen darf; in 4.21
      bleibt nur „Bauer g2, einziger Verteidiger von f3 gegen Sxf3#“. Schon umgesetzt in 0.2.55.
- [ ] C4. **Gegenschlag zählen** (C1.13): Bei einem Hebel zählt die App weiter auf dem Zielfeld,
      weil du in 6.3 („drei gegen drei“) und 6.5 so zählst; nur bei schon bestehender Spannung auf
      dem Feld des angegriffenen Bauern. Einverstanden?
      **Empfehlung:** so lassen. So zählst du selbst in 6.3 und 6.5.
- [ ] C5. **Dauerschach** (C1.18): Claude nennt es nur, wenn die schachgebende Seite mindestens
      eine Leichtfigur zurückliegt (dein Motiv 12: „Wer klar verliert …“). Sonst hießen die
      Schachs im Turmendspiel 9.6 Dauerschach. Einverstanden?
      **Empfehlung:** so lassen. Sonst würde jede Schachserie im Turmendspiel als Dauerschach
      gemeldet.
      **Nachgelesen im Buch (17.10.2026):** Glossar und Kapitel 0: Dauerschach heißt, „der König
      entkommt den Schachs nicht“; eine Materialbedingung gibt es nicht. Abb. 9.34: Schwarz liegt
      nur einen Bauern zurück, und das Buch nennt die Rettung „das Dauerschach“. Jetzt zählt auch
      eine Schachfolge, die die Stellung wiederholt (der König entkommt nicht); die
      Leichtfigur-Regel bleibt für Schachserien ohne Wiederholung. 9.34 heißt damit Dauerschach.
      Schon umgesetzt in 0.2.55 (Nachtest N274).
- [ ] C6. **Gabel** (C2.12): Claude verlangt, dass jedes genannte Ziel für sich gewinnbar ist
      (König, wertvoller als der Gabler oder ungedeckt), sonst wäre König plus gedeckter Läufer
      auch eine Gabel. Passt das zu deinem „Eine Gabel sollte Material gewinnen“?
      **Empfehlung:** so lassen. Das ist genau dein Satz „Eine Gabel sollte Material gewinnen“.
      **Nachgelesen im Buch (17.10.2026):** Kapitel 7: „Material gewinnt die Gabel allerdings nur,
      wenn mindestens ein Ziel ungedeckt oder mehr wert ist als der Springer.“ Das ist eine
      notwendige Bedingung. Die Regel der App (jedes genannte Ziel für sich gewinnbar, König zählt
      immer) ist strenger, aber folgerichtig: Der Gegner rettet das wertvollere Ziel, also muss das
      andere fallen können. Ein Satz „Eine Gabel sollte Material gewinnen“ steht so nicht im Buch,
      das war deine Formulierung bei C2.12. Empfehlung: so lassen.
- [ ] C7. **Abb. 7.10** (C1.18): Die Zugfolge beginnt jetzt eine Stellung früher mit 1. Sf7+
      (der Springer kann nur von e5 kommen). Damit nennt „Motiv“ das Abzugsschach. Freigeben?
      **Empfehlung:** freigeben. Die Zugfolge ist legal und führt zur Abbildung, und der Springer
      kann nur von e5 kommen.
      **Nachgelesen im Buch (17.10.2026):** Die Bildunterschrift sagt „Abzugsschach nach 1. Sf7+“
      mit dem Turm e1; das geht nur vom Feld e5 aus. Empfehlung bestätigt.
- [ ] C8. **Berliner Endspiel aus schwarzer Sicht** (C1.9): Die App schlägt Schwarz dort einen
      Minderheitsangriff am Königsflügel vor; das Buch sagt dazu nichts. So lassen?
      **Empfehlung:** nicht mehr anzeigen. Im Berliner Endspiel spielt Schwarz in der Praxis mit dem
      Läuferpaar und der Mehrheit am Damenflügel, nicht mit einem Minderheitsangriff am
      Königsflügel; ein Rat, den das Buch nicht stützt, verwirrt eher.
      **Schon umgesetzt in 0.2.47 (Nachtest N247): Steht der Kandidat der gegnerischen Mehrheit
      schon in der eigenen Hälfte (im Berliner Endspiel e5), nennt die App keinen
      Minderheitsangriff. Schwarz bekommt dann die allgemeine Regel „Schwarz spielt am
      Damenflügel: Dort bildet die Mehrheit einen Freibauern.“ (die Mehrheit ist durch den
      Doppelbauern c7/c6 krank; das Läuferpaar sieht das Werkzeug nicht, es schaut nur auf die
      Bauern). Carlsbad (5.32 bis 5.34, 6.8) bleibt unverändert. Widerspruch genügt.**

- [ ] C9. **Kandidaten in 12.4** (C1.28): Nur „Matt scheidet aus“ hätte Dd1+ (−9) zum besten
      Kandidaten gemacht. Claude ergänzt deshalb einen Zug, der ein drohendes Matt abwehrt (dort
      5... Sf6, wie in der Opernpartie). Einverstanden?
      **Empfehlung:** so lassen. Ohne den Abwehrzug wäre ein Damenschach mit −9 der „beste“
      Kandidat, was dem Leser offensichtlich falsch vorkäme.
      **Nachgelesen im Buch (17.10.2026):** Kapitel 11: „6. Lc4 droht Matt auf f7“, und Schwarz
      stellt mit 6... Sf6 den Springer dazwischen (es ist Zug 6..., nicht 5...). Empfehlung
      bestätigt.

### K. Stufen der Engine (AP 11, Fable; plausibel entschieden)

- [ ] K1. **Abstufung:** Fühlt sich die Abstufung nach N175 bis N177 richtig an (Konzept 8.2)?
      Wenn eine Stufe zu stark oder zu schwach ist: Welche? (Stufe 1 bis 3: Skill Level 0 mit
      Fehlerquote jeder dritte, vierte, achte Zug; Stufe 4: Skill 3, jeder sechzehnte; Stufe 5 bis 7:
      Skill 6, 10, 15 ohne Fehler; Stufe 8 volle Stärke.)
      **Empfehlung:** erst nach deinem Test entscheiden. Wirkt eine Stufe zu sprunghaft, ist das
      eher ein Fall für R4 (Stufen menschlicher, seit 0.2.52) als für andere Zahlen.
- [ ] K2. **Damenopfer auf Stufe 1:** Nur Stufe 1 darf die Dame verschenken (Konzept: „ab Stufe
      2 nicht“). Soll auch Stufe 1 die Dame behalten (dann höchstens ein Turm Verlust)?
      **Empfehlung:** so lassen. Echte Einsteiger verlieren auch mal die Dame, und das Konzept nimmt
      erst ab Stufe 2 die Dame aus.
- [ ] K3. **Buchtreue:** Die Engine folgt auf allen Stufen zu 85 % je Zug den Eröffnungen aus
      Kapitel 2 und 3, also auch der „Einsteiger“ einige Züge lang fehlerfrei. So lassen (der
      Leser sieht die Eröffnungen des Buches), oder je Stufe weniger (etwa 50 % auf Stufe 1)?
      Seit 0.2.40 betrifft die Frage nur die Wahl „eine Eröffnung des Buches (zufällig)“; „frei“
      spielt ohne Buch, eine bestimmte Eröffnung mit Buchtreue 1.
      **Empfehlung:** so lassen. Seit 0.2.40 gibt es „frei“; wer ohne Buch spielen will, wählt das,
      und wer die Eröffnungen sehen will, bekommt sie auch auf Stufe 1.
- [ ] K4. **Drohung ignoriert ab einem Bauern:** Nach der Röntgen-Regel (Kapitel 1) zählt jede
      Drohung, Material zu gewinnen, also auch ein Bauer (2. Dh5 droht Dxe5+). Soll die Fehlerart
      „Drohung ignoriert“ erst ab einer Leichtfigur heißen?
      **Empfehlung:** so lassen. Das Buch zählt jede Drohung, Material zu gewinnen (Kapitel 1); auch
      ein verlorener Bauer ist ein Fehler, den der Leser sehen soll.
      **Nachgelesen im Buch (17.10.2026):** Kapitel 1: Eine Drohung ist jeder Materialgewinn im
      nächsten Zug, auch ein Bauer (Abb. 1.13). Empfehlung bestätigt. Kapitel 1 sagt aber auch,
      dass man eine Drohung ignorieren darf, wenn die eigene größer ist; „Drohung ignoriert“ ist
      ein Fehler nur, wenn die Engine den Verlust bestätigt (so ist es eingebaut).
- [ ] K5. **Verpasstes Matt in der Auswertung:** Werte sind auf ±10 begrenzt (Matt = 10). Wer
      von „Matt in 2“ zu „+5“ wechselt, bekommt deshalb „??“ (Verlust 5). So lassen?
      **Empfehlung:** ändern. Wer von Matt in 2 zu +5 wechselt, steht weiter klar auf Gewinn; „??“
      ist dafür zu hart. Lichess und chess.com rechnen die Bewertung vorher in eine Gewinnchance um;
      dann kostet dieser Zug fast nichts. Vorschlag: Verlust über die Gewinnchance messen, ab +5 nie
      mehr als „?!“.
      **Schon umgesetzt in 0.2.47 (Nachtest N245): Steht die ziehende Seite nach dem Zug noch bei
      +5 oder besser, gibt es höchstens „?!“, auch in der Engine-Karte und ohne Eintrag unter
      „Grobe Patzer“. Der Verlust je Zug bleibt in Bauern (die Genauigkeit rechnet ohnehin über die
      Gewinnchance). Widerspruch genügt.**
- [ ] K6. **Stufen 4 bis 7 ohne Elo-Begrenzung:** Die Stufen nutzen Skill Level 3, 6, 10, 15
      (geräteunabhängig: Die Stärke hängt von der Suchtiefe ab, nicht vom Gerät). Die Namen der Stufen bleiben; eine
      Elo-Zahl zeigt die App nicht. Einverstanden?
      **Empfehlung:** so lassen. Feste Skill Levels geben auf jedem Gerät dieselbe Stärke; eine Elo-
      Zahl je Stufe wäre nur geraten.

### D. Buch

- [ ] D1. **Abb. 4.45 (D.3):** Der Buchstand vom 16.10.2026 ist vollständig übernommen. Stellung,
      Pfeile, Feldmarkierungen und Bildunterschrift von 4.45 sind dabei unverändert geblieben
      (nur die Zeile im LaTeX hat sich verschoben). Betraf deine Änderung den Text um die
      Abbildung, ist alles drin; betraf sie die Stellung oder die Markierungen, fehlt sie noch im
      privaten Repository. Bitte kurz bestätigen.
      **Empfehlung:** Ein Wort genügt („Text“ oder „Stellung“); bei „Stellung“ die neue Fassung
      hochladen, Claude macht den Datenlauf.
      **Nachgelesen im Buch (17.10.2026):** Im Buchstand vom 16.10. ist an der Stellung von 4.45
      nichts geändert, wohl aber die Zeile F3 der Fallenprüfung „Damenfalle im Dänischen Gambit“
      (jetzt: der Läufer b2 fesselt g7 relativ an den Turm h8, „teils“). Diese Zeile ist in der App
      übernommen. Bitte nur bestätigen, dass du den Text meintest.

- [ ] D2. **Glossar und Steckbriefe sind sich bei der Phase uneins (Befund aus S17, ersetzt C3).**
      Seit 0.2.61 folgt die Phase an allen Abbildungen dem Glossar, wie du entschieden hast:
      Mittelspiel erst, wenn beide Seiten entwickelt sind (höchstens eine Leichtfigur zu Hause) und
      rochiert haben. „Rochiert haben“ liest die App aus den Zügen des Buches, damit ein König, der
      rochiert hatte und dann gejagt wird, weiter als rochiert gilt (Colle 11.12 bis 11.14, Lasker
      11.18 bis 11.21 für Schwarz, Unzicker 11.82 und 11.84). Damit stimmen die Opernpartie (11.4 bis
      11.9) und Anderssen–Dufresne (11.25 bis 11.31) mit ihren Steckbriefen „Eröffnung bis
      Mattangriff“ überein. Drei Stellen widersprechen ihrem Steckbrief, weil eine Seite nicht
      rochiert hat: **Lasker–Thomas** (Steckbrief „Mittelspiel“; Weiß rochiert erst mit dem Mattzug,
      also nach dem Glossar Eröffnung bis zum Schluss), **Fischer–Petrosjan 11.43 und 11.44**
      (Steckbrief „Mittelspiel bis Endspiel“, an 11.43 steht die Skelettbilanz; Schwarz rochiert erst
      im 15. Zug) und **Opernpartie 11.98** (Übung, nach 11. Lxb5+). In den Kapiteln 1 bis 7 und 10
      werden dadurch 127 Abbildungen von „Mittelspiel“ zu „Eröffnung“, fast alle aus Eröffnungen
      der Kapitel 2 und 3, was zum Buch passt.
      **Empfehlung:** Im Buch die Steckbriefe von Lasker–Thomas („Eröffnung bis Mattangriff“) und
      Fischer–Petrosjan („Eröffnung bis Endspiel“) angleichen, oder im Glossar ergänzen, dass ein
      König, der in der Mitte bleibt, das Mittelspiel nicht aufhält, wenn beide Seiten entwickelt
      sind. Die App bleibt beim Glossar, bis du entscheidest.

### E. Vor der Veröffentlichung der App (zurückgestellt, bis App und Website fertig sind)

- [ ] E3. **Buchbeschreibung** auf der Startseite: Entwurf bestätigen oder ersetzen.
      **Empfehlung:** denselben Text wie auf der Rückseite des Buches nehmen, dann stimmen Buch
      und Website überein.
      **Nachgelesen im Buch (17.10.2026):** In den Buchquellen gibt es keinen Rückseitentext. Der
      Untertitel lautet „Vom sicheren Einstieg zum strategischen Plan – Eröffnungen meistern,
      Fallen durchschauen und souverän gewinnen“. Korrigiert: Die Startseite sagte „bis zu einer
      Spielstärke von etwa 2000 Elo“; das Buch sagt „in Richtung Elo 2000“ und ausdrücklich „Allein
      aus einem Buch heraus erreicht niemand 2000 Elo“. Jetzt: „bis zu den Ideen, die für den Weg
      in Richtung Elo 2000 entscheidend sind“. Schon umgesetzt in 0.2.55.
- [ ] E4. **Bezugsquellen:** ISBN und Shop-Links, sobald sie feststehen.
      **Empfehlung:** nachtragen, sobald die ISBN vergeben ist; bis dahin bleibt der Platz leer.
