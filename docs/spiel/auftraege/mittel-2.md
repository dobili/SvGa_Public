# Auftrag mittel-2: Regelwerk auf den Stand von Schritt 8h bringen, Variablenverzeichnis

**Stand:** fertig (mittel-2, 08.11.2026; vorher offen, Haupt-Chat, vierter Auftrag; der dritte ist zusammengeführt, die
Victor-Stellung steht jetzt mit deinem Vorschlag (Springer gegen zwei Bauern, −3,18) in
`begegnungen.json`; danke für die Prüfung)
**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-regelwerk`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `docs/spiel/06_Regelwerk.md`, `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** `npx prettier --check ../docs/spiel` in `app/`

## Ziel

Schritt 8h hat die Vertragsvorschläge V1, V2, V7, V8 und V9 umgesetzt
(`docs/spiel/ENTSCHEIDUNGEN.md`, Eintrag „Schritt 8h“). Das Regelwerk soll den Code wieder
beschreiben, und das Variablenverzeichnis von mittel-1 soll als Abschnitt ins Regelwerk.

## Vorgaben

1. **R2/R3 (Abenteuerwertung A):** Umsetzung wie `app/src/abenteuer/regeln/wertung.ts`: Felder
   `wertung`, `appWertungZuletzt`, `wertungPartien`, `laufendeWertung` im Spielstand; Start mit
   App-Wertung oder 600; erste App-Wertung ohne gezählte Story-Partien ersetzt den Startwert; Elo-
   Schritt gegen Z vor dem Zustandsfaktor, K 32 bis zehn Partien, dann 20, nie unter 100; E folgt
   A, bis `eingangPartien` 10 erreicht. Satz „Vertrag: braucht zwei Felder (V1)“ ersetzen.
   `geschaetzteStaerke` liefert die App noch nicht (als offen markieren).
2. **R6/R7:** Vorschlag V2 ist umgesetzt (`gegnerstaerke.ts`): Absatz „Abweichung von
   04_Architektur“ streichen, Architektur ist angepasst. Grenzen: Zustandsfaktor höchstens 2,0,
   Ergebnis 0,5 bis 2,5.
3. **R8/R9:** `Gegnerzustand.ueberheblich` als eigener Faktor (V8), aus dem Protokoll gezählt
   (`ueberheblichkeit` in `app/src/abenteuer/oberwelt/auftraege.ts`: Niederlagen gegen diesen
   Gegner seit dem letzten Sieg oder Remis, Wiedereinstieg zählt nicht extra; Format der Partie
   wird nicht geprüft, also zählen auch verlorene Stellungsduelle gegen Clubmitglieder, das als
   bekannte Abweichung vermerken). Sichtbar: Zeile in der Kartenleiste unter dem Brett
   („Coach Delgado ist überheblich geworden.“), Textschlüssel `zustand.*`.
4. **R10:** +300 im zweiten Durchlauf ist umgesetzt (`POST_GAME_AUFSCHLAG`); V5 (Nadeln des zweiten
   Durchlaufs) bleibt offen bis Staffel 2, V6 (freie Karten) bis Akt 3.
5. **R39/R40:** `spielzeitJeOrt` ist im Spielstand (V7); Satz zum Nachmessen anpassen. **R4:**
   Versatzbereiche werden jetzt in `test_abenteuer.py` geprüft (V9).
6. **Neuer Abschnitt „Dialogvariablen“** (hinter R41): die Tabelle aus dem Bericht von mittel-1
   (`docs/spiel/auftraege/mittel-1.md`, Abschnitt Bericht, 54 Variablen mit Typ, Start, wer setzt,
   wer liest, Bedeutung) übernehmen, dazu die Regel der Hülle (`regeln/dialogvariablen.ts`):
   `ausgang<Ort><Begegnung>`, `<runde>Bestanden`, `nadel<Ort>` 0 bis 3.
7. Nichts anderes ändern; Vorschläge für Code oder Daten in den Bericht.

## Was nicht dazugehört

Story-Bibel, Daten, Code.

## Bericht

**Fertig** auf `abenteuer-regelwerk` (Basis 8daa8e95 hereingeholt). Nur `06_Regelwerk.md` und
diese Datei geändert; Prettier besteht.

- **R2:** Start 600 (`A_START`) oder App-Wertung; erste App-Wertung ohne gezählte Story-Partie
  ersetzt den Startwert; `geschaetzteStaerke` als offen markiert; Absatz „Umsetzung“ mit den vier
  Feldern (`wertung`, `appWertungZuletzt`, `wertungPartien`, `laufendeWertung`), A in Straße,
  Clubmitgliedern, Runden und Tagebuch. Satz zu V1 ersetzt.
- **R3:** E folgt A nach jeder zählenden Story-Partie (`nachStoryPartie`), dazu zwei bekannte
  Abweichungen (siehe unten).
- **R4:** Versatzbereiche werden geprüft (V9).
- **R6/R7:** Absatz „Abweichung von 04_Architektur“ gestrichen, Verweis auf `gegnerstaerke.ts`
  und `WERTUNG_OHNE`; Grenzen Zustandsfaktor 2,0, Ergebnis 0,5 bis 2,5.
- **R8/R9:** sichtbare Zeile in der Kartenleiste statt „Symbol am Brett“; eigenes Feld
  `ueberheblich` (V8); bekannte Abweichung „Format wird nicht geprüft“.
- **R10:** `POST_GAME_AUFSCHLAG` umgesetzt; V5 offen bis Staffel 2, V6 bis Akt 3.
- **R40:** `spielzeitJeOrt` umgesetzt (V7).
- **Neu R42 „Dialogvariablen“** hinter R41: Regeln der Hülle (`ausgang<Ort><Begegnung>`,
  `<runde>Bestanden`, `nadel<Ort>` 0 bis 3, `held`), Ink-eigene Merker, kein automatisches
  Nachgespräch, dazu die Tabelle mit allen 54 Variablen aus dem Bericht von mittel-1 (Stand
  b37ae6f2; der Bericht ist in `mittel-1.md` inzwischen durch „kein Auftrag“ ersetzt).

**Bekannte Abweichungen Code ↔ Regel (Vorschläge für den Code, nicht geändert)**

1. `ueberheblichkeit` prüft das Format nicht; verlorene Stellungsduelle gegen Clubmitglieder
   zählen mit. Vorschlag: Protokolleintrag um das Format ergänzen oder nur Einträge mit
   `ergebnis.kennung` einer Begegnung mit `format.art = "partie"` zählen.
2. R3: Gewertete Partien der App erhöhen `eingangPartien` nicht, und `mitAppWertung` lässt ein noch
   laufendes E stehen. Vorschlag: In `mitAppWertung` bei `eingangPartien < 10` auch
   `eingangswertung` auf das neue A setzen; App-Partien zählen, sobald `Appdienste` ihre Zahl
   liefert.
3. R9 nennt im Dialog „Na, schon wieder da?“; ob die Clubchef-Dialoge eine Zeile für
   Überheblichkeit haben, habe ich nicht geprüft (Sache von mittel-1).

**Offen:** nichts Blockierendes.
