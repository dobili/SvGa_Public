# Auftrag niedrig-1: Karten für den Weg Cedar Creek → Riverton und für Riverton

**Stand:** offen (Haupt-Chat, 08.11.2026, siebter Auftrag; Spieldaten von mittel-2 sind
zusammengeführt, 686bc02d)
**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/karten/weg-cedar-riverton-1.json`, `-2.json`,
`riverton-*.json` (fünf Dateien, neu), `inhalte/abenteuer/karten/cedar-creek-aussen.json` (nur
das Objekt `zedernwald` als Übergang am Rand, Rand dort offen), `docs/spiel/auftraege/niedrig-1.md`
**Prüfung vor dem Push:** im Hauptordner `python -m pytest pipeline/tests -q` (für die neuen
Karten darf nichts mehr übersprungen werden), in `app/` Prettier und Paketbau

## Ziel

Die sieben Karten aus `orte.json` (Orte `wegCedarRiverton` und `riverton`) zeichnen, mit allen
Objekten, die `orte.json` dort als Auslöser und Figuren nennt, belebt nach `09_Weltbeschreibung.md`
(Abschnitte 3, 4, 4a, 5.4, Checkliste 6) und passend zur Story-Bibel Akt 2 (Szenen in Riverton).

## Vorgaben

1. **Objekte:** jeder Auslöser und jede Figur des Ortes auf der Karte, auf die sie gehören
   (Auslöser mit `karte` nur dort; sonst nach Sinn: Türen außen und innen jeweils ihr Gegenstück).
   Namen genau wie in `orte.json`, `start` mit `richtung` je Karte.
2. **Größen:** Außen 32 × 24 (Riverton ist größer als Cedar Creek: Park mit Pavillon, Brücke,
   Bahnhof, Kanal), Wegkarten 28 × 20, Innen nach 09 (Pavillon offen und regnerisch, Bahnhofshalle
   groß, Wohnwagen eng, Schuppen klein mit Fahrrad).
3. **Belebung:** Statisten und Tiere nach 4a (Riverton: Pendler mit Schirmen, Straßenmusiker,
   Parkschachspieler, Tauben, Möwen; Weg: Bahndamm und Zedernwald nach Bibel).
4. **Cedar Creek:** Übergang `zedernwald` am Rand der Außenkarte (der Weg nach Riverton beginnt dort).

## Was nicht dazugehört

Ironwood und der Weg dorthin, `orte.json`, Grafik.

## Bericht

(vom Helfer auszufüllen)
