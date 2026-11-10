# Auftrag Runde 10: Dialoge glaubwürdig, Buchverweise heraus (10.11.2026)

**Basis:** `claude/friendly-shannon-y8bf90` hereinholen. Keine Rückfragen an den Autor; Entscheidung
steht in `docs/spiel/ENTSCHEIDUNGEN.md` („Dialoge: glaubwürdig, keine Buchverweise“).

## Warum

Der Autor spielt die Beta. Ihm fiel unangenehm auf, dass Ambrose den Jungen gleich zu Beginn auf ein
Kapitel seines Buches verweist. Das Spiel soll eine Geschichte sein, keine Werbung für das Buch.

## Teil 1: Buchverweise entfernen

1. In `inhalte/abenteuer/texte/de.json` (1593 Texte) nennen 76 Texte Kapitel, Abschnitte, Seiten,
   „im Buch“, „nachlesen“ oder das Handbuch. Suche weiter als dieses Muster: auch „mein Buch“,
   „Lektion“, „wie es im … steht“, Abschnittsnummern wie „4.2“.
2. Jeden Verweis ersatzlos streichen oder durch das ersetzen, was die Figur an der Stelle wirklich
   sagen würde (die Regel selbst in ihren Worten, eine Erinnerung, eine Frage).
3. Dasselbe in den Texten der App, die nur im Spiel erscheinen (`abenteuer.*`, `imSpiel.*` in
   `app/src/i18n/de.json` und `en.json`), und in fest verdrahteten Texten unter `app/src/abenteuer/`.
4. Die Zuordnung zu Kapiteln in den Daten (Felder wie `kapitel`, Dokument 07) bleibt; sie wird im
   Spiel nicht mehr angezeigt. Platzhalter `{kapitel}` in Spieltexten entfallen.
5. Ausnahme Schnitzeljagd: Gefundene Seiten aus Ambroses altem Buch bleiben. Dort darf stehen, dass
   es eine seiner Seiten ist; mehr nicht.
6. Eine Prüfung, die das hält: Test in der Pipeline, der Spieltexte mit Buchverweis meldet (mit einer
   kurzen Ausnahmeliste für die Buchseiten).

## Teil 2: Jeden Dialog auf Glaubwürdigkeit prüfen

Für jede sprechende Figur zuerst lesen: Story-Bibel (`05_Story_Bibel.md`), Weltbeschreibung (`09`),
`12_Akt1_Leben.md`, `14_Akt2_Leben_*`, `16_Statisten_und_Tiere.md`. Dann jeden ihrer Sätze fragen:

- Würde diese Figur das sagen: mit ihrem Alter, Beruf, Charakter, ihrer Beziehung zum Helden?
- Passt es zu Zeit und Ort (Ambrose: 19. Jahrhundert, London und Amerika; Erinnerungen 1851 und
  1866 ohne heutige Wörter; Kinder reden wie Kinder, nicht wie Trainer)?
- Passt es zur Lage: Was weiß die Figur gerade, was ist eben geschehen, wie nah ist sie dem Helden?
  Ein Geist, der eben erst ein Kind gefunden hat, erklärt nicht, er staunt und tastet.
- Erklärt die Figur Schach in ihrer eigenen Sprache und nicht im Ton eines Lehrbuchs?
- Kein Satz spricht den Spieler als Spieler an (keine Knöpfe, Menüs, „Karte“, „Aufgabe“ im Mund
  einer Figur, wo es die Welt bricht). Bedienhinweise gehören in die Hülle, nicht in den Dialog.

Vorgehen: Ort für Ort in der Reihenfolge der Geschichte, zuerst Akt 1 (den spielt der Autor gerade).
Unpassende Sätze gleich neu schreiben (Regel 9). Länge und Sinn der Aufgabe erhalten, Schlüssel
nicht umbenennen. Englische Fassung (`texte/en.json`, falls vorhanden) mitziehen oder als offen
melden.

## Ende

- Bericht `docs/spiel/pruefberichte/dialoge_runde10.md`: je Ort die Zahl geprüfter und geänderter
  Texte, die zehn deutlichsten Beispiele vorher/nachher, was offen bleibt.
- pytest, `npm run pruefen`, e2e Abenteuer, Gesamtsimulation. Commit, Push, Meldung. Nach Akt 1
  eine Zwischenmeldung, damit der Stand auf die Beta kann.
