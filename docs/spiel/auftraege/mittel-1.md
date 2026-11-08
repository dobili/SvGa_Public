# Auftrag mittel-1: Dinge zum Ansehen in den Innenräumen von Maple Falls und Cedar Creek

**Stand:** offen (Haupt-Chat, 08.11.2026, sechster Auftrag; Grundlage `09_Weltbeschreibung.md`,
Abschnitte 3 Punkt 2 und 5.1, 5.3)
**Zweig:** dein fester Sitzungszweig (zuletzt `claude/schach-abenteuer-mittel-1-cl431d`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/ansehen-maple-falls.ink` und
`ansehen-cedar-creek.ink` (neu), `inhalte/abenteuer/orte.json` (nur in `mapleFalls` und
`cedarCreek` je Gegenstand einen Auslöser anhängen, mit `karte` der jeweiligen Innenkarte),
`inhalte/abenteuer/texte/de.json` (nur neue Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** wie bisher (pytest `test_abenteuer.py`, Paketbau, Prettier, Durchspielen)

## Ziel

Jeder Innenraum bekommt drei Dinge zum Ansehen ohne Spielwirkung (09, Abschnitt 3.2): ein Satz,
bei wiederholtem Ansehen ein zweiter, mindestens eines mit Schachbezug. niedrig-1 setzt die
Objekte gleichzeitig mit genau diesen Namen in die Karten.

## Vorgaben

1. **Auslöser und Knoten** (Name in `orte.json` → Knoten in deiner Datei, `art: "gegenstand"`):
   - Wohnzimmer: `fotoGrandma`, `kartonKueche`, `pizzakarton`
   - Dachboden: `hutschachtel`, `spiegel`, `zeitungen1961`
   - Clubraum: `pokalvitrine`, `brettOhneDame`, `plakatZaehlen`
   - Bibliothek: `zeitungsregal`, `globus`, `schildFluestern`
   - Archiv: `boxerfoto`, `wasserfleck`
   - Waschsalon: `zettelTurm`, `comicheft`, `automat`
     Knotennamen in snake_case (`foto_grandma` …), Datei `ansehen-maple-falls.ink` bzw.
     `ansehen-cedar-creek.ink`.
2. Ambrose darf kommentieren (altmodisch, kurz); Mama, Juno oder der Held nicht. Keine Quests,
   keine Belohnungen; Variablen nur, wenn ein zweiter Satz nötig ist (Ink-Besuchszähler genügt).
3. Bezüge zur Geschichte sind willkommen (Grandma Whitlock, 1961, die fehlende Dame, Pokale von
   1994), aber nichts verraten, was Akt 2 auflöst.

## Was nicht dazugehört

Karten, Statisten-Sätze (kommen mit der Technik für Statisten), Code.

## Bericht

(vom Helfer auszufüllen)
