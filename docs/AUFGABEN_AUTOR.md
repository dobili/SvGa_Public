# Was noch zu tun ist (für den Autor)

Stand: 17.10.2026, Version 0.2.37 (AP 13 Teil 1 und 2: Übungen und erste Trainer).
Hier steht **nur, was noch offen ist**. Erledigtes ist in `docs/ENTSCHEIDUNGEN.md` festgehalten.

**Grundsatz:** Du musst keine Datei selbst bearbeiten. Du antwortest im Chat mit den Kürzeln (etwa
„G3: so lassen“); Claude trägt alles ein. Bei Fehlern in der App hilft **Einstellungen (Zahnrad)
› Fehler melden**.

Reihenfolge nach Wichtigkeit: B (testen), U (Rückfragen zu den Übungen und Trainern), C und K
(Rückfragen zu Regeln und Engine), D (Buch), E (vor der Veröffentlichung).
Teil A (Budget, Aufräumen, Veröffentlichen, 0.2.33 nach `main`) ist am 16.10.2026 erledigt:
`dobili/SvGa_Public` ist öffentlich, die Prüfungen laufen bei jedem Push kostenlos.

---

## B. Testen

- [ ] B1. **Nachtest 0.2.37** nach `docs/TESTANLEITUNG.md` (N182 bis N197: Übungen, erste
      Trainer, neuer Buchstand).
- [ ] B2. **Nachtest 0.2.33 und 0.2.36** (N158 bis N181), falls noch nicht geschehen.

## U. Rückfragen zu den Übungen und Trainern (AP 13, Nacht zum 17.10.2026; plausibel entschieden)

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

## C. Rückfragen zu den neuen Regeln (kurz; Claude hat jeweils plausibel entschieden)

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

## K. Rückfragen aus AP 11 Kalibrierung (16.10.2026, Fable; plausibel entschieden, bitte prüfen)

- [ ] K1. **Abstufung:** Fühlt sich die Abstufung nach N175 bis N177 richtig an (Konzept 8.2)?
      Wenn eine Stufe zu stark oder zu schwach ist: Welche? (Die Skill Level und Fehlerquoten
      stehen in einer Tabelle in `app/src/engine/stufen.ts`.)
- [ ] K2. **Damenopfer auf Stufe 1:** Nur Stufe 1 darf die Dame verschenken (Konzept: „ab Stufe
      2 nicht“). Soll auch Stufe 1 die Dame behalten (dann höchstens ein Turm Verlust)?
- [ ] K3. **Buchtreue:** Die Engine folgt auf allen Stufen zu 85 % je Zug den Eröffnungen aus
      Kapitel 2 und 3, also auch der „Einsteiger“ einige Züge lang fehlerfrei. So lassen (der
      Leser sieht die Eröffnungen des Buches), oder je Stufe weniger (etwa 50 % auf Stufe 1)?
- [ ] K4. **Drohung ignoriert ab einem Bauern:** Nach der Röntgen-Regel (Kapitel 1) zählt jede
      Drohung, Material zu gewinnen, also auch ein Bauer (2. Dh5 droht Dxe5+). Soll die Fehlerart
      „Drohung ignoriert“ erst ab einer Leichtfigur heißen?
- [ ] K5. **Verpasstes Matt in der Auswertung:** Werte sind auf ±10 begrenzt (Matt = 10). Wer
      von „Matt in 2“ zu „+5“ wechselt, bekommt deshalb „??“ (Verlust 5). So lassen?
- [ ] K6. **Stufen 4 bis 7 ohne Elo-Begrenzung:** Die Stufen nutzen Skill Level 3, 6, 10, 15
      (geräteunabhängig, siehe `docs/ENTSCHEIDUNGEN.md`). Die Namen der Stufen bleiben; eine
      Elo-Zahl zeigt die App nicht. Einverstanden?

## D. Buch

- [ ] D1. **Abb. 4.45 (D.3):** Der Buchstand vom 16.10.2026 ist vollständig übernommen. Stellung,
      Pfeile, Feldmarkierungen und Bildunterschrift von 4.45 sind dabei unverändert geblieben
      (nur die Zeile im LaTeX hat sich verschoben). Betraf deine Änderung den Text um die
      Abbildung, ist alles drin; betraf sie die Stellung oder die Markierungen, fehlt sie noch im
      privaten Repository. Bitte kurz bestätigen.

## E. Vor der Veröffentlichung der App (zurückgestellt, bis App und Website fertig sind)

- [ ] E1. **Impressum** (`app/impressum/index.html`): Name und Anschrift nach § 5 DDG. Kontakt ist
      bekannt: kontakt@schach-von-grund-auf.com. Keine Zugangsdaten mitschicken.
- [ ] E2. **Datenschutz** (`app/datenschutz/index.html`): Entwurf prüfen (lassen), Verantwortlichen
      ergänzen.
- [ ] E3. **Buchbeschreibung** auf der Startseite: Entwurf bestätigen oder ersetzen.
- [ ] E4. **Bezugsquellen:** ISBN und Shop-Links, sobald sie feststehen.
