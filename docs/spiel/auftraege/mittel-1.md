# Auftrag mittel-1: Dialogvariablen mit Ort, Durchsicht aller Ink-Dateien

**Stand:** offen (Haupt-Chat, 08.11.2026, vierter Auftrag; die Dialoge für Cedar Creek sind
zusammengeführt, deine drei Quest-Änderungen übernommen, der alte Schlüssel
`quest.clubkampfCedarCreek.schritt1` ist gelöscht)
**Zweig:** dein fester Sitzungszweig (zuletzt `claude/schach-abenteuer-mittel-1-cl431d`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/*.ink`, `inhalte/abenteuer/texte/de.json` (nur neue
Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests/test_abenteuer.py`, in
`app/`: `node skripte/baue-abenteuerpaket.mjs`, `npx prettier --check ../inhalte/abenteuer`,
Durchspielen aller Knoten mit inkjs wie bisher.

## Ziel

Die Hülle setzt jetzt Dialogvariablen aus Ergebnissen, und zwar genau in der Langform, die du für
Cedar Creek vorgeschlagen hast (`app/src/abenteuer/regeln/dialogvariablen.ts`):

- Ausgang einer Begegnung: `ausgang` + Kennung ohne Punkt mit großen Anfangsbuchstaben, Werte
  „sieg“, „remis“, „niederlage“, „abgebrochen“. Beispiele: `ausgangMapleFallsErsteLektion`,
  `ausgangMapleFallsSamRevanche`, `ausgangMapleFallsClubkampf`, `ausgangMapleFallsVictor`,
  `ausgangMapleFallsSkaterJo`, `ausgangCedarCreekClubkampf`, `ausgangCedarCreekRosaDuell`.
- Bestandene Runde: `<name>Bestanden` = true (`reiheSamBestanden`, `trocknerStellungBestanden`).
  Nicht bestanden ändert nichts.
- Beste Nadel eines Clubs: `nadel<Ort>` als Zahl: 0 keine, 1 Bronze, 2 Silber, 3 Gold
  (`nadelMapleFalls`, `nadelCedarCreek`).

## Vorgaben

1. **Maple Falls umbenennen:** `ausgangErsteLektion` → `ausgangMapleFallsErsteLektion`,
   `ausgangSamRevanche` → `ausgangMapleFallsSamRevanche`, `ausgangClubkampf` →
   `ausgangMapleFallsClubkampf`, `ausgangVictor` → `ausgangMapleFallsVictor`, `ausgangSkaterJo` →
   `ausgangMapleFallsSkaterJo` in allen Dateien (VAR-Zeilen und Verwendungen).
2. **Durchsicht:** Jede Variable, die die Hülle setzt, ist in jeder Datei, die sie liest, als
   `VAR` mit dem richtigen Typ deklariert („“ für Ausgänge, false für Runden, 0 für Nadeln). Jede
   Datei deklariert nur, was sie braucht. Ein Verzeichnis aller Variablen (Name, Typ, wer setzt,
   wer liest) kommt als Tabelle in deinen Bericht; der Haupt-Chat übernimmt es ins Regelwerk.
3. **Ankunft nach der Busfahrt:** Die Hülle kann noch keinen Knoten nach `reise` starten. Bis
   dahin bleibt deine Lösung (Ankunft beim ersten Gespräch draußen). Prüfe, dass sie in beiden
   Richtungen stimmt: Rückfahrt nach Maple Falls (`bus_zurueck` → Park) ohne hängende Quest.
4. **Dachboden nach Cedar Creek:** Ambroses `ambrose_rat` soll nach `endeAkt1Gesehen` auf den
   Stand von Akt 2 hinweisen (ein Satz, Akt 2 ist noch nicht geschrieben; „Der Weg führt weiter,
   aber nicht heute.“ genügt).
5. Alles Übrige wie in den vorigen Aufträgen (Sprecher-Tags, geschlechtsneutral, keine Buchtexte,
   Buchbezug nur mit Abschnitt oder Abbildung).

## Was nicht dazugehört

Neue Szenen, Akt 2, Code, Quests (nur melden, wenn ein Knoten nicht passt).

## Bericht

(vom Helfer auszufüllen)
