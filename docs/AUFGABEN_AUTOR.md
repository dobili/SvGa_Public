# Was noch zu tun ist (für den Autor)

Stand: 17.10.2026, Version 0.2.39. **Diese Datei ist die einzige, die du brauchst:** Hier steht
alles, was du testen oder entscheiden sollst, mit allen Informationen dazu, und nur, was noch
offen ist. Erledigtes wandert nach `docs/ENTSCHEIDUNGEN.md` (musst du nicht lesen).

**So antwortest du:** im Chat mit den Kürzeln, etwa „N203 ok“, „N205 falscher Pfeil“, „R2: so
lassen“, „T1: Vorschläge übernehmen“. Claude trägt alles ein. Bei Fehlern in der App hilft
**Einstellungen (Zahnrad) › Fehler melden**: Den kopierten Text mitschicken (App-Version,
Datenstand, Gerät), bei allem anderen kurz, **was** du getan hast und **was** passiert ist, gern
mit Bildschirmfoto.

Adresse: <https://schach-von-grund-auf.com/app/> (oder die installierte App). Vorher in den
Einstellungen prüfen, dass „App-Version 0.2.39“ dasteht; sonst die App neu laden.

Reihenfolge nach Wichtigkeit: Teil 1 testen (neueste Nummern zuerst), Teil 2 entscheiden (R, U,
T, C, K, D, E). Alle Nummern gelten für die aktuelle Version; frühere Versionen musst du nicht
mehr getrennt testen. Die Prüfschritte N1 bis N157 sind erledigt.

---

## Teil 1: Testen auf dem Handy (etwa zwei Stunden insgesamt, mit Engine)

Abhaken, was klappt. Wer wenig Zeit hat, nimmt zuerst „Neu in 0.2.39“, dann der Reihe nach die
älteren Abschnitte.

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
      0,85 je Zug, siehe Rückfrage K3). Seit 0.2.39 kannst du der Engine eine Eröffnung
      vorgeben (N208).

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
- [ ] N165. **Phase:** Abb. 11.28 (Unsterbliche Partie): „Mittelspiel“, auch wenn du die Sicht
      wechselst. Abb. 12.2: Mittelspiel.
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

### R. Rückmeldung 0.2.38, umgesetzt in 0.2.39 (Fable; plausibel entschieden, bitte prüfen)

- [ ] R1. **Holzfiguren:** Vorbild ist dein Bild (chess.com, Design „Dunkles Holz“): helle
      Figuren elfenbeinfarben, dunkle fast schwarz mit warmem Braunton. Die Formen bleiben die
      von Colin Burnett (die Figuren von chess.com sind nicht frei); die Farben sind `#EEE1C6`
      und `#2E2119` mit dunklem Rand (durch Umfärben erzeugt). Passt
      das (N201)? Andere Werte sind in Minuten geändert.
- [ ] R2. **„!“ (U10 damit umgesetzt):** „!“ bekommt ein Zug, der der beste der Engine war und
      mindestens 1,2 Bauern vor dem zweitbesten lag (dieselbe Regel wie in der Engine-Karte).
      Dafür bewertet die Auswertung jede Stellung jetzt mit zwei Varianten (gleiche Rechenzeit,
      etwas weniger Tiefe). So lassen?
- [ ] R3. **Spielstärke-Schätzung:** Die Zahl („etwa 1400“) kommt aus dem durchschnittlichen
      Verlust je Zug über eine feste Tabelle (0,1 Bauern → 2600, 0,3 → 2000, 0,5 → 1650, 1,0 →
      1100; grobe Erfahrungswerte, keine Wertungszahl eines Verbands); die Genauigkeit rechnet wie Lichess.
      Soll die Zahl bleiben, nur die Genauigkeit stehen, oder ein anderes Wort als „Spielstärke“?
- [ ] R4. **Stufen menschlicher machen.** Warum die Engine auf Stufe 1 bis 3 „dämlich und dann
      genial“ wirkt: Sie nutzt Stockfishs „Skill Level 0“ plus zufällige Fehlerwürfe. Skill
      Level 0 würfelt an Suchtiefe 1 unter den vier besten Zügen einer vollen Suche. Alles, was
      einen Zug tief sichtbar ist (jeder Schlag, jedes Matt in einem, jede fertige Gabel), spielt
      sie fehlerfrei, und in erzwungenen Stellungen trifft sie die Hauptvariante; die
      Fehlerwürfe treffen dagegen zufällige ruhige Züge. Ein Mensch auf 1000 Elo ist umgekehrt:
      gleichmäßig blind ab zwei Zügen Tiefe, selten grundlos verschenkend. chess.com baut seine
      Bots auf Komodo mit verrauschter Bewertung und Vorlieben (Angriff, Material); Lichess nutzt
      dieselben Skill Levels wie wir und zusätzlich die Maia-Netze, die aus Menschenpartien je
      Spielstärke gelernt haben (menschlichster Gegner, aber ein Netz mit eigener Laufzeit im
      Browser). Fünf Wege für die App, alle offline mit der vorhandenen Engine: 1. Gewichtete Zugwahl mit „Temperatur“ je Stufe statt Skill Level (Fehler meist klein,
      große nur selten; in erzwungenen Lagen bleibt der beste Zug sehr wahrscheinlich). 2. Tiefengrenze je Stufe (die Engine sieht Taktik jenseits ihres Horizonts gar nicht). 3. Fehlerneigung nach Lage und Strähnen (mehr Fehler in ruhigen Stellungen mit vielen
      Kandidaten, weniger im Schach; nach einem Fehler drei Züge erhöht; „Tagesform“ je Partie). 4. Menschliche Blindstellen auf Stufe 1 bis 3 (Rückwärtszüge und lange Diagonalen seltener,
      Schläge und Schachs bevorzugt, Springergabeln „übersehen“). 5. Stärken-Schwächen-Profile („Angreifer“, „Materialist“, „Verteidiger“) als kleine
      Zuschläge auf die Kandidaten.
      Empfehlung: 1 bis 3 zusammen als eigenes Arbeitspaket mit der Messung aus AP 11 (jede Stufe
      gewinnt weiter die Mehrheit gegen die darunter), 4 und 5 danach. Soll Claude das angehen,
      und welche Stufe soll zuerst dran sein?
- [ ] R5. **Erklärungen im Rückblick:** Die Karte erklärt Fehler mit den sechs Fehlerarten der
      Engine (Drohung, hängende Figur, Gabel, gefährliche Linie, Motiv der Antwort, Schlagreflex,
      Dame, König). Ohne passende Regel steht nur „kostet etwa … Bauern. Besser war …“. Reicht
      das, oder soll die Engine-Variante (die nächsten Züge nach dem besseren Zug) dazu?

### U. Übungen und erste Trainer (Opus, 0.2.37; plausibel entschieden)

- [ ] U1. **„Mit Hilfe“:** Wer eine Übung erst nach einem falschen Zug oder einem Hinweis löst,
      bekommt sie als gelöst, die Wiederholungskarte bleibt aber in ihrem Kasten (sie rückt nicht
      vor). Ohne Fehler und ohne Hinweis rückt sie einen Kasten weiter. Einverstanden?
- [ ] U2. **Denkaufgaben:** 23 Übungen haben keine Zugfolge ab ihrem Diagramm (Notation
      schreiben, Planfragen). Dort liest der Leser nach „Ich habe nachgedacht“ die Erklärung und
      schätzt sich selbst ein (gelöst, teilweise, nicht gelöst). Passt das?
- [ ] U3. **Hinweise in drei Stufen:** 1 Motiv (aus der Erklärung), 2 welche Figur zieht,
      3 der Zug als goldener Pfeil. Passt die Reihenfolge?
- [ ] U4. **Röntgen-Trainer, Frage 3:** Die eigenen drohenden Züge muss der Leser nicht markieren
      (es sind oft zehn und mehr); die App nennt nur ihre Anzahl. Markiert werden: deine Schachs,
      deine Schläge (ohne die, die Material verlieren) und Schachs und Schläge des Gegners, als
      wäre er am Zug. Einverstanden?
- [ ] U5. **Sonderzüge mit eigenen Stellungen:** Für Rochade, en passant und Umwandlung im
      Trainer „Koordinaten, Notation, Gangarten“ gibt es sieben kurze Stellungen, die nicht aus
      dem Buch stammen (die Diagramme zeigen kaum en passant oder Umwandlung). Alles andere kommt
      aus den Abbildungen. Freigeben?
- [ ] U6. **Notation:** Ein fehlendes Schach- oder Mattzeichen zählt als richtig, mit dem Hinweis
      „Denk an das Schachzeichen“. Englische Buchstaben (N, B, R, Q) zählen als falsch. So lassen?
- [ ] U7. **Hängende Figur:** Eine Figur hängt, wenn der Gegner sie mit Gewinn schlagen kann
      (Abtauschrechnung aus Kapitel 1, auch gedeckte Figuren, etwa ein Turm, den ein Bauer
      angreift). Gabeln und Drohungen zählen nicht. Passt das?
- [ ] U8. **Rundenlängen:** Feld finden 16, Röntgen 5, alle anderen 8 Aufgaben. Passt das?
- [ ] U9. **Trainer in der Wiederholung:** Bisher kommen nur die Übungen des Buches in die
      Wiederholung (fünf Kästen). Sollen auch Aufgaben der Trainer dort landen, etwa jede falsch
      beantwortete Röntgen-Aufgabe?

- [ ] U11. **Bewertungsbalken** nur nach der Partie (wie empfohlen, R13), nicht während der
      Partie. So lassen?

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
      Leichtfiguren zu Hause), nicht nach Zug 15. Soll Claude das so umsetzen, und gilt die
      Faktorenbilanz dann auch in der Eröffnung bei gleichem Material (wie 3.6)?

### T. Trainerdaten für Taktiktrainer, Strukturerkenner und „Falle oder Köder“ (Fable; plausibel entschieden)

Die Daten liegen in der App bereit (Opus baut die drei Trainer darauf). Was Claude entschieden
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
- [ ] T2. **Menge der Zusatzaufgaben von Lichess** (gemeinfrei, CC0): 637 Taktikaufgaben (je
      Motiv und Stufe 8) und 120 Fallen-Aufgaben (je Stufe 12 Fallen und 12 Geschenke), dazu 37
      Taktik- und 12 Fallenaufgaben aus dem Buch. Genug, zu viel, oder lieber mehr für die Stufen
      1 bis 3?
- [ ] T3. **Schwierigkeit:** Die Stufe 1 bis 5 jeder Aufgabe ist gemessen (Lichess-Wertung aus
      Millionen Lösungsversuchen; Buchaufgaben über die Suchtiefe der Engine daran geeicht). Soll
      es zusätzlich ein Feld geben, mit dem du die Stufe einzelner Buchaufgaben selbst setzt?
- [ ] T4. **Fallen aus Kapitel 2 und 3:** Der Fallentrainer hat die zwölf Fallenchecks aus
      Kapitel 4 (Klammerfalle bis Damenfang auf b2). Sollen auch die Fallen aus den
      Eröffnungskapiteln dazu (Zugfolgen, in denen ein Schlag mit „?“ steht, etwa im
      Damengambit)? Die Pipeline könnte sie genauso ziehen.
- [ ] T5. **Strukturerkenner:** 134 Aufgaben, davon 46 aus Kapitel 5 mit Struktur, Seite und
      Plan nach dem Unterabschnitt, in dem das Buch die Abbildung zeigt, und 88 aus anderen
      Kapiteln mit einer klaren Struktur (Isolani, hängende Bauern, Minderheitsangriff,
      Doppelbauer, festgefahrene Kette, Mehrheit). Die Zuordnung Abbildung → Struktur und die
      Plan-Sätze sind ein Vorschlag von Claude. Reicht dir die Durchsicht in der App, wenn der
      Trainer da ist, oder willst du die Tabelle vorher als Liste im Chat sehen?

### C. Neue Regeln der Werkzeuge (plausibel entschieden)

- [ ] C1. **König im Schach in der Faktorenbilanz** (C1.6): Claude wertet ihn „teils“ (die
      Empfehlung sagte nur „nicht gut“). Deshalb heißt es in 3.23 und 3.68 weiter „Weiß liegt
      vorn bei Königssicherheit“ (der schwarze König ist „schlecht“). Soll ein König im Schach
      „schlecht“ heißen?
- [ ] C2. **W4 in 4.21** (C1.7): Mit der neuen Regel (einziger Verteidiger gegen Matt) meldet die
      App dort zusätzlich die Bauern e2 und g2 als einzige Verteidiger von f3 gegen Sxf3#.
      Schachlich richtig, aber nicht das, was das Buch nennt. So lassen?
- [ ] C3. **Phase in 11.43** (C1.27): Nach der neuen Regel (Eröffnung, solange eine Seite noch zwei
      Leichtfiguren zu Hause hat) sagt die App bei Fischer–Petrosjan im 11. Zug „Eröffnung“; dein
      Steckbrief nennt „Mittelspiel bis Endspiel“. So lassen, oder soll die Regel zusätzlich
      ab einer Zugzahl (etwa 10) „Mittelspiel“ sagen?
- [ ] C4. **Gegenschlag zählen** (C1.13): Bei einem Hebel zählt die App weiter auf dem Zielfeld,
      weil du in 6.3 („drei gegen drei“) und 6.5 so zählst; nur bei schon bestehender Spannung auf
      dem Feld des angegriffenen Bauern. Einverstanden?
- [ ] C5. **Dauerschach** (C1.18): Claude nennt es nur, wenn die schachgebende Seite mindestens
      eine Leichtfigur zurückliegt (dein Motiv 12: „Wer klar verliert …“). Sonst hießen die
      Schachs im Turmendspiel 9.6 Dauerschach. Einverstanden?
- [ ] C6. **Gabel** (C2.12): Claude verlangt, dass jedes genannte Ziel für sich gewinnbar ist
      (König, wertvoller als der Gabler oder ungedeckt), sonst wäre König plus gedeckter Läufer
      auch eine Gabel. Passt das zu deinem „Eine Gabel sollte Material gewinnen“?
- [ ] C7. **Abb. 7.10** (C1.18): Die Zugfolge beginnt jetzt eine Stellung früher mit 1. Sf7+
      (der Springer kann nur von e5 kommen). Damit nennt „Motiv“ das Abzugsschach. Freigeben?
- [ ] C8. **Berliner Endspiel aus schwarzer Sicht** (C1.9): Die App schlägt Schwarz dort einen
      Minderheitsangriff am Königsflügel vor; das Buch sagt dazu nichts. So lassen?

- [ ] C9. **Kandidaten in 12.4** (C1.28): Nur „Matt scheidet aus“ hätte Dd1+ (−9) zum besten
      Kandidaten gemacht. Claude ergänzt deshalb einen Zug, der ein drohendes Matt abwehrt (dort
      5... Sf6, wie in der Opernpartie). Einverstanden?

### K. Stufen der Engine (AP 11, Fable; plausibel entschieden)

- [ ] K1. **Abstufung:** Fühlt sich die Abstufung nach N175 bis N177 richtig an (Konzept 8.2)?
      Wenn eine Stufe zu stark oder zu schwach ist: Welche? (Stufe 1 bis 3: Skill Level 0 mit
      Fehlerquote jeder dritte, vierte, achte Zug; Stufe 4: Skill 3, jeder sechzehnte; Stufe 5 bis 7:
      Skill 6, 10, 15 ohne Fehler; Stufe 8 volle Stärke.)
- [ ] K2. **Damenopfer auf Stufe 1:** Nur Stufe 1 darf die Dame verschenken (Konzept: „ab Stufe
      2 nicht“). Soll auch Stufe 1 die Dame behalten (dann höchstens ein Turm Verlust)?
- [ ] K3. **Buchtreue:** Die Engine folgt auf allen Stufen zu 85 % je Zug den Eröffnungen aus
      Kapitel 2 und 3, also auch der „Einsteiger“ einige Züge lang fehlerfrei. So lassen (der
      Leser sieht die Eröffnungen des Buches), oder je Stufe weniger (etwa 50 % auf Stufe 1)?
      Seit 0.2.39 kannst du der Engine zusätzlich eine Eröffnung vorgeben (dann Buchtreue 1); die
      Frage betrifft nur die Wahl „frei“.
- [ ] K4. **Drohung ignoriert ab einem Bauern:** Nach der Röntgen-Regel (Kapitel 1) zählt jede
      Drohung, Material zu gewinnen, also auch ein Bauer (2. Dh5 droht Dxe5+). Soll die Fehlerart
      „Drohung ignoriert“ erst ab einer Leichtfigur heißen?
- [ ] K5. **Verpasstes Matt in der Auswertung:** Werte sind auf ±10 begrenzt (Matt = 10). Wer
      von „Matt in 2“ zu „+5“ wechselt, bekommt deshalb „??“ (Verlust 5). So lassen?
- [ ] K6. **Stufen 4 bis 7 ohne Elo-Begrenzung:** Die Stufen nutzen Skill Level 3, 6, 10, 15
      (geräteunabhängig: Die Stärke hängt von der Suchtiefe ab, nicht vom Gerät). Die Namen der Stufen bleiben; eine
      Elo-Zahl zeigt die App nicht. Einverstanden?

### D. Buch

- [ ] D1. **Abb. 4.45 (D.3):** Der Buchstand vom 16.10.2026 ist vollständig übernommen. Stellung,
      Pfeile, Feldmarkierungen und Bildunterschrift von 4.45 sind dabei unverändert geblieben
      (nur die Zeile im LaTeX hat sich verschoben). Betraf deine Änderung den Text um die
      Abbildung, ist alles drin; betraf sie die Stellung oder die Markierungen, fehlt sie noch im
      privaten Repository. Bitte kurz bestätigen.

### E. Vor der Veröffentlichung der App (zurückgestellt, bis App und Website fertig sind)

- [ ] E1. **Impressum** (`app/impressum/index.html`): Name und Anschrift nach § 5 DDG. Kontakt ist
      bekannt: kontakt@schach-von-grund-auf.com. Keine Zugangsdaten mitschicken.
- [ ] E2. **Datenschutz** (`app/datenschutz/index.html`): Entwurf prüfen (lassen), Verantwortlichen
      ergänzen.
- [ ] E3. **Buchbeschreibung** auf der Startseite: Entwurf bestätigen oder ersetzen.
- [ ] E4. **Bezugsquellen:** ISBN und Shop-Links, sobald sie feststehen.
