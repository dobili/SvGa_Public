# Auftrag mittel-1: Läden in Riverton und Ironwood anschließen, Laterne am Schließfach

**Stand:** fertig (Helfer mittel-1, 08.11.2026, neunter Auftrag)
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

**Fertig:**

1. **Pops** (`riverton-bahnhofshalle.ink`): Beim ersten Gespräch nach Mr. Odums Geschichte ein
   Satz zum Angebot („Für Münzen gibt es hier Karten für unterwegs.“), dann bei jedem Gespräch
   über den neuen Knoten `pops_laden` `~ oeffneLaden("riverton.zeitungsstand")`. Keine
   Fahrkarten oder Extras erwähnt.
2. **Edna** (`ironwood-aussen.ink`): Beim ersten Gespräch je nach Besitz drei Varianten (ohne
   Rad: Rad und Laternen im Fenster; mit Rad: Hinweis auf die finstere Umkleide; mit beidem:
   „Schrauben brauchst du immer.“), dann bei jedem Gespräch `edna_laden` mit
   `~ oeffneLaden("ironwood.eisenwaren")`. Der alte Satz „Bald hab ich auch ein Rad“ ist weg.
   Deklariert: `hatFahrrad`, `hatLaterne`.
3. **Schließfach** (`ironwood-umkleide.ink`): ohne `hatLaterne` „Ohne Licht siehst du nichts.“
   und Ambrose verweist auf Ednas Laternen; mit Laterne der Fund wie bisher. Hinweis im
   Dateikopf ersetzt.

Keine neuen Texte nötig. Prüfungen: pytest `test_abenteuer.py` (11), Paketbau, Prettier,
Durchspielen (10044 Läufe ohne Fehler), alle Zweige von Pops, Edna und Schließfach einzeln (Laden
wird jedes Mal geöffnet, Fund nur mit Laterne), `npm run pruefen` (2382 Tests).

**Offene Fragen:** keine.
