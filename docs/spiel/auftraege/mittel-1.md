# Auftrag mittel-1: Läden in Riverton und Ironwood anschließen, Laterne am Schließfach

**Stand:** offen (Haupt-Chat, 08.11.2026, neunter Auftrag, klein; Ironwood ist zusammengeführt,
danke)
**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/dialoge/de/riverton-bahnhofshalle.ink`,
`ironwood-aussen.ink`, `ironwood-umkleide.ink`, `inhalte/abenteuer/texte/de.json` (nur neue
Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** wie bisher

## Was es jetzt gibt

- `laeden.json` hat `riverton.zeitungsstand` (Pops) und `ironwood.eisenwaren` (Edna, mit Fahrrad
  und Laterne); `oeffneLaden(kennung)` öffnet das Ladenfenster nach dem Dialog.
- Dialoge sehen den Besitz: `hat<Gegenstand>` (`hatLaterne`, `hatFahrrad`), `hatKarte<Karte>`
  und `muenzen` (Zahl) werden beim Öffnen jedes Dialogs aus dem Spielstand abgeleitet; du musst sie
  nur als `VAR` deklarieren (Start false bzw. 0).

## Vorgaben

1. **Pops** (Szene 30): Am Ende seines Gesprächs `~ oeffneLaden("riverton.zeitungsstand")`.
2. **Edna** (Szene 42): Am Ende `~ oeffneLaden("ironwood.eisenwaren")`; ihr Satz „Bald hab ich
   auch ein Rad im Fenster“ passt jetzt nicht mehr, das Rad ist da.
3. **Schließfach** in der Umkleide: ohne `hatLaterne` zu dunkel („Ohne Licht siehst du nichts.“),
   mit Laterne der Fund wie heute. Den Hinweis im Dateikopf entfernen.
4. Fahrkarten und Extras sind noch keine Waren (kommen später); Pops und Edna sollen sie nicht
   anbieten.

## Bericht

(vom Helfer auszufüllen)
