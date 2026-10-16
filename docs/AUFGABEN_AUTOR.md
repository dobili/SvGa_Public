# Was noch zu tun ist (für den Autor)

Stand: 16.10.2026, Version 0.2.33 (Arbeitszweig `rueckmeldung-0.2.33`, noch nicht in `main`).
Hier steht **nur, was noch offen ist**. Erledigtes ist in `docs/ENTSCHEIDUNGEN.md` festgehalten.

**Grundsatz:** Du musst keine Datei selbst bearbeiten. Du antwortest im Chat mit den Kürzeln (etwa
„G3: so lassen“); Claude trägt alles ein. Bei Fehlern in der App hilft **Einstellungen (Zahnrad)
› Fehler melden**.

Reihenfolge nach Wichtigkeit: A (heute besprechen), B (testen), C (Rückfragen zu den neuen
Regeln), D (Buch), E (vor der Veröffentlichung).

---

## A. Heute besprechen: Umschalten auf „öffentlich“

- [ ] A1. **Budget für GitHub Actions** auf $0 setzen, falls noch nicht geschehen (Profilbild ›
      Settings › Billing and licensing › Budgets and alerts › New budget, Produkt Actions, $0,
      „Stop usage when budget limit is reached“).
- [ ] A2. **Aufräumen und Veröffentlichen:** Vorschlag in `docs/VEROEFFENTLICHUNG.md` (alte
      Zweige, Dateien mit zitiertem Buchtext, Umgang mit der Git-Geschichte; Empfehlung: neues
      öffentliches Repository mit einem einzigen Anfangsstand). Löschen darf Claude erst nach
      deiner ausdrücklichen Freigabe.
- [ ] A3. **0.2.33 nach `main`:** Alles ist lokal geprüft (Komponententests, Pipeline,
      Oberflächentests mit Chromium). Der Test mit WebKit (iPhone) läuft nur in GitHub Actions;
      Claude veröffentlicht 0.2.33, sobald die Prüfung wieder laufen darf (öffentlich oder ab
      November), oder auf deinen ausdrücklichen Wunsch auch ohne.

## B. Testen

- [ ] B1. **Nachtest 0.2.33** nach `docs/TESTANLEITUNG.md` (N158 bis N174), sobald 0.2.33 in
      `main` ist.

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

## D. Buch

- [ ] D1. **Neue Buchfassung hochladen:** Deine Änderung an Abb. 4.45 (D.3) ist im privaten
      Repository `dobili/schachbuch-quellen` noch nicht angekommen. Sobald sie dort liegt,
      übernimmt Claude sie mit einem Datenlauf.
- [x] D2. **Buchverweise (AP 16):** erledigt am 16.10.2026. QR-Code und App-Abschnitt in Kapitel 0,
      die 13 Kästen „Training zu diesem Kapitel“ verweisen mit QR-Code auf die Trainingsseiten,
      ohne Trainernamen (Entscheidungen T1 bis T3 in docs/ENTSCHEIDUNGEN.md).

## E. Vor der Veröffentlichung der App (zurückgestellt, bis App und Website fertig sind)

- [ ] E1. **Impressum** (`app/impressum/index.html`): Name und Anschrift nach § 5 DDG. Kontakt ist
      bekannt: kontakt@schach-von-grund-auf.com. Keine Zugangsdaten mitschicken.
- [ ] E2. **Datenschutz** (`app/datenschutz/index.html`): Entwurf prüfen (lassen), Verantwortlichen
      ergänzen.
- [ ] E3. **Buchbeschreibung** auf der Startseite: Entwurf bestätigen oder ersetzen.
- [ ] E4. **Bezugsquellen:** ISBN und Shop-Links, sobald sie feststehen.
