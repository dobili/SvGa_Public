# Auftrag mittel-2: Regelwerk auf den Stand von Schritt 8h bringen, Variablenverzeichnis

**Stand:** offen (Haupt-Chat, 08.11.2026, vierter Auftrag; der dritte ist zusammengeführt, die
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

(vom Helfer auszufüllen)
