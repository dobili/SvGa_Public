# Testanleitung für das Handy

Hier steht nur, was noch zu testen ist. Alle früheren Prüfschritte (N1 bis N157) sind erledigt; sie liegen im privaten
Archiv-Repository des Autors.

Abhaken, was klappt; bei allem anderen bitte kurz notieren, **was** du getan hast und **was**
passiert ist, am besten mit Bildschirmfoto. Dazu in der App **Einstellungen (Zahnrad) › Fehler
melden** tippen und den kopierten Text mitschicken (App-Version, Datenstand, Gerät).
Rückmeldung je Nummer genügt: „N158 ok“, „N165 falsches Fazit“.

Adresse: <https://schach-von-grund-auf.com/app/> (oder die installierte App).

---

## Nachtest Version 0.2.38 (etwa 5 Minuten, mit Engine; Rückblick nach der Partie)

Neu: Vorschlag H, Rückblick nach der Partie. **Vorher:** In den Einstellungen muss „App-Version
0.2.38“ stehen.

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

## Nachtest Version 0.2.37 (etwa 30 Minuten; AP 13 Übungen und erste Trainer)

Neu: Die Übungen des Buches lassen sich in der App lösen, mit Wiederholung, dazu die ersten drei
Trainer. **Vorher:** In den Einstellungen muss „App-Version 0.2.37“ stehen.

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

## Nachtest Version 0.2.35 (etwa 10 Minuten; neuer Buchstand vom 16.10.2026)

- [ ] N196. **Getauschte Abbildungen:** Abb. 2.29 zeigt die Greco-Variante nach 10... d5!, Abb.
      2.30 die Stellung nach 10... Lxa1? 11. Lxf7+ Kf8 12. Lg5. Abb. 3.31 nach 12. Kh1, 3.32 nach
      13. f4 (mit der Bilanz), 3.33 nach 7... Sxd4??, 3.34 nach 9. Lb5+!. Jeweils nachspielen: Die
      Zugleiste führt genau zu dieser Stellung.
- [ ] N197. **Neue Nummern der Übungen:** Kapitel 3 (Übungen 14 bis 18), Kapitel 4 (19 bis 22) und
      Kapitel 12 (84 bis 86) stehen in der neuen Reihenfolge des Buches.

## Nachtest Version 0.2.36 (etwa 30 Minuten, mit Engine; AP 11 Kalibrierung)

Neu: die kalibrierten Stufen und die Fehlerprofile der Engine (Konzept 8.2), dazu drei Befunde der
Gegenprüfung (Uhr, Auswertung). **Vorher:** In den Einstellungen muss „App-Version 0.2.36“ stehen.
Die Abnahme aus dem Konzept lautet: „Der Autor prüft im Test, ob sich die Abstufung richtig anfühlt.“

**Stufen und Fehlerprofile**

- [ ] N175. **Stufe 1 (Einsteiger):** Spielen › Grundstellung, Stufe 1, ohne Uhr, etwa 15 Züge.
      Die Engine spielt sichtbar schwach und macht etwa jeden dritten Zug einen Anfängerfehler
      (hängende Figur, ignorierte Drohung, Dame zu früh). Nach dem Ende (oder Aufgeben) nennt die
      Auswertung die Fehler der Engine mit Zugnummer und Art, darunter auch „eine Drohung
      ignoriert“ oder „eine Taktik übersehen“ (neu). Stimmen die genannten Züge?
- [ ] N176. **Stufe 2 (Anfänger), kein Damenopfer:** eine Partie auf Stufe 2 (etwa 20 Züge). Die
      Engine verschenkt Bauern und Figuren, aber nie die Dame ohne Gegenwert (Konzept 8.2).
- [ ] N177. **Abstufung:** je eine kurze Partie auf Stufe 3, 5 und 7. Fühlt sich die Abstufung
      richtig an: Stufe 3 noch mit groben Fehlern (höchstens eine Leichtfigur), Stufe 5 ohne
      absichtliche Fehler, aber schlagbar, Stufe 7 deutlich stärker? Die Engine braucht je Zug
      höchstens 0,3 bis 2 Sekunden (Stufe 1 bis 8), auch auf dem Handy.
- [ ] N178. **Eröffnung:** Grundstellung, Stufe 1, 1. e4: Die Engine antwortet einige Züge lang
      mit den Eröffnungen aus Kapitel 2 und 3 (Zugliste), auch auf niedriger Stufe (Buchtreue
      0,85 je Zug, siehe Rückfrage K3).

**Gegenprüfung (Uhr und Auswertung)**

- [ ] N179. **Uhr im Hintergrund:** Partie mit 5 + 3, einen Zug spielen und sofort zum
      Startbildschirm des Handys wechseln, 20 Sekunden warten, zurück. Die Engine hat gezogen,
      deine Uhr hat in der Zwischenzeit nicht gelaufen (sie läuft erst nach der Rückkehr weiter).
- [ ] N180. **Uhr nach dem Neuladen:** laufende Partie mit Uhr, Seite neu laden (oder App
      schließen und öffnen), Partie fortsetzen: Deine Restzeit ist die vom Moment des Verlassens.
- [ ] N181. **Auswertung trotz Werkzeug:** Partie zu Ende spielen (oder aufgeben), während
      „Auswertung läuft … von …“ steht, das Bündel „Taktik“ › „Erzwingende Züge“ öffnen (rechnet
      mit der Engine). Die Auswertung läuft danach trotzdem zu Ende („Erste klare Abweichung …“).

## Nachtest Version 0.2.33 (etwa 25 Minuten, mit Engine)

Neu: deine Antworten vom 16.10.2026 (Spielziel, Werkzeuge in der Partie, Figurensatz, Ton und die
Regeln C1 und C2). **Vorher:** In den Einstellungen muss „App-Version 0.2.33“ stehen.

**Spielen und Einstellungen**

- [ ] N158. **Kein Spielziel:** Spielen: Es gibt keine Auswahl „Spielziel“ mehr. Nach dem Ende
      einer Partie steht nur das Ergebnis, kein „Ziel erreicht/verfehlt“.
- [ ] N159. **Figurensatz und Ton:** Einstellungen: Figurensatz „kontrastreich“ zeigt überall die
      klassischen Figuren (weiß mit schwarzem Rand); Ton „an“: beim Ziehen klackt es, bei einem
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
      nach ein paar Sekunden darunter „Engine: Sxe4 gewinnt den Bauern e4 nicht: 3... Sxe4
      4. De2 …“. Abb. 2.24: „d4 und e4“.
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
- [ ] N170. **Taktik:** Abb. 7.14, Erzwingende Züge: nach und nach je Kandidat „bis zur Ruhe: …“;
      „Am stärksten: 2. Th8+“, am Brett „2+!“. Abb. 7.10, Motiv: „Sf7+: Abzug“ (die Zugfolge
      beginnt jetzt mit 1. Sf7+). Abb. 7.28: „De1+: Dauerschach.“ Übung 7.53: Überlastung.

**Kapitel 8, 9 und 12**

- [ ] N171. **Opposition:** Abb. 8.23: nur Kf3. Abb. 8.36: „Hier entscheidet nicht die
      Opposition, sondern das Quadrat …“. Abb. 8.53: „… das Reserve-Tempo h4 …“.
- [ ] N172. **Schlüsselfelder und Quadrat:** Abb. 8.29: Fazit „Weiß gewinnt mit e7 (Sonderfall
      6. Reihe).“ Abb. 8.50: „Die Quadratregel gilt nur für einen Bauern allein; verbundene
      Freibauern schützen sich gegenseitig …“. Abb. 8.46: „Nach a6 läuft der Bauer a6 durch …“.
- [ ] N173. **Turmendspiel und Erkennungsbilder:** Abb. 9.3: „Philidor: Turm auf der 3. Reihe von
      dir aus, nach dem Bauernzug von hinten Schach geben.“ Abb. 9.23: „Mehrere Bauern am Brett“.
      Abb. 9.37: „… getrennte Freibauern b5 und g5: meist gewonnen …“.
- [ ] N174. **Kandidaten:** Abb. 12.4: b5 ist nicht mehr der beste Kandidat (nach b5 folgt Dxf7#,
      der Kandidat scheidet aus). Abb. 12.3: Die App prüft die Abwehrzüge und findet auf 3... f5
      die Antwort 4. Sxe6.
