# Auftrag mittel-2: Story-Bibel Akt 2 (Riverton, Ironwood) mit Wegen und Entdeckungen

**Stand:** fertig (mittel-2, 08.11.2026; vorher offen, Haupt-Chat, fünfter Auftrag; Regelwerk ist auf Stand 8h, danke)
**Zweig:** dein fester Sitzungszweig (zuletzt `abenteuer-regelwerk`), Basis
`claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `docs/spiel/05_Story_Bibel.md` (neuer Teil „Akt 2“ anhängen; Akt 1 nur, wo Akt 2
etwas vorbereitet, dann im Bericht nennen), `docs/spiel/auftraege/mittel-2.md`
**Prüfung vor dem Push:** `npx prettier --check ../docs/spiel` in `app/`

## Ziel

Akt 2 der Geschichte (Staffel 1: Riverton und Ironwood, Cliffhanger Perfect Move kauft Ironwood,
Victor lädt nach Silicon Bay; Dokument 02, Abschnitt 3.2 und Staffelplan) in derselben Form wie
Akt 1: Szenen mit Nummern, Ort, Figuren, Zweck, Dauer, Buchbezug, Quests, Belohnungen. Neu dazu
die Wünsche des Autors vom 8.11.2026 (`docs/spiel/08_Wege_und_Entdeckungen.md`): Wege zwischen
den Städten, Funde mit übergreifenden Quests, Läden und Münzen, Zeitkarten, ein Flashback.

## Vorgaben

1. **Zwei Städte, je ein Club** mit Buchkapiteln nach `07_Aufgabenzuordnung.md` (Riverton und
   Ironwood), Clubchef mit Stil und Schwäche, zwei Clubmitglieder, ein Straßengegner, zwei bis drei
   Nebenfiguren; Clubkampf, Aufgabenreihe, Vorbereitungs-Nebenquest (Zustand „abgelenkt“ oder
   Steckbrief), ein Rätsel aus der Welt, eine Erinnerung Ambroses (Zugerraten, C3).
2. **Wege:** Route Cedar Creek → Riverton (Zug) und Riverton → Ironwood (Fahrrad lohnt sich): je
   zwei Karten, Stationen nach W4 (Rätseltafel, Straßengegner mit Uhr, Fund, Wanderer).
3. **Entdeckungen:** je Stadt und Route 3 bis 6 Funde mit einem Satz; die übergreifenden Quests
   E4 weiterführen (Partieformular → Archiv Cedar Creek, Schlüssel → Fahrradschuppen Riverton) und
   eine neue anlegen, die erst in Akt 3 aufgeht.
4. **Läden:** je Stadt ein Laden mit Figur und Angebot (Karten, Fahrkarten, Gegenstände, Extras) im
   Rahmen von G2 und G4; Preise als Vorschlag.
5. **Zeit:** eine Szene, in der Blitz gegen einen Straßengegner die richtige Wahl ist, und eine, in
   der der Zeitnot-Trick (Z6) erklärt und verschenkt wird (von Ambrose, mit einem Satz zur
   „gefühlten Zeitnot“ aus Kapitel 12 des Buches, wenn das Buch dazu etwas hat, sonst ohne
   Buchbezug).
6. **Flashback:** London, Kaffeehaus (F2 Nummer 2), 2 bis 5 Minuten, Stellung aus
   `inhalte/zusatzpartien/klassiker.json` (Kennung nennen).
7. **Mama und Victor:** die Fäden aus Akt 1 weiterführen (Ironwood ist Mamas Geheimnis, Dokument 02,
   3.2); Victors Entwicklung Richtung Zweifel an Perfect Move andeuten.
8. Regeln wie immer: keine realen Produkte, keine Buchtexte über kurze Zitate mit Fundstelle,
   geschlechtsneutraler Held, Arbeitsnamen für Firmen bis zum Markencheck.

## Was nicht dazugehört

Akt 3 und 4, Spieldaten (JSON), Dialoge (Ink), Karten.

## Bericht

**Fertig** auf `abenteuer-regelwerk` (Basis 82e19ccc hereingeholt). `05_Story_Bibel.md` hat einen
neuen Teil 2 „Akt 2“ (Abschnitte 7 bis 15, Szenen 26 bis 50); Prettier besteht.

**Inhalt nach Vorgaben**

1. **Zwei Städte:** Riverton (Club 3, Slick, E + 340, Gabeln; Mitglieder Tamsin, Ray; Straße
   Mr. Harlan; Nebenfiguren Nova, Pops, Mrs. Albescu) und Ironwood (Club 4, Big Joe, E + 400,
   Fesselung und Spieß; Mitglieder Hank, Priya; Straße Gus; Nebenfiguren Edna, Mr. Teague).
   Buchübungen und Abschnitte nach `07_Aufgabenzuordnung.md` (Riverton 35, 40, 4, 10; Ironwood 37,
   38, 17, 22). Vorbereitung: Riverton „analysiert“ (Szene 34), Ironwood „abgelenkt“ (Szene 44,
   die Feier aus dem Beispiel in `gegnerprofil.ts`). Rätsel: Rätseltafel Route 2 und das Siegel
   im Museum (Szene 41). Erinnerungen: Flashback London (Szene 35) und Bird gegen Morphy (Szene 47).
2. **Wege:** `route2` (Zedernwald, Bahndamm; Schnellreise Zug) und `route3` (Fabrikstraße,
   Eisenbrücke; Fahrrad lohnt sich), je mit Rätseltafel, Straßengegner mit Uhr bzw. Ambrose-Szene,
   Funden und einer Figur mit Weisheit (Kapitel 1.4 bzw. Kapitel 5).
3. **Entdeckungen:** 13 Funde mit Satz und Wirkung (Abschnitt 12), Figurensatz „Waldholz“ über drei
   Orte; E4 weitergeführt (Partieformular → Boateng → Fragment 2; Schlüssel → Schuppen →
   Fahrrad) und neu **„Umschlag ohne Brief“** mit **„Nietenkopf J. H.“**, Auflösung in Akt 3
   (Brief in Desert Springs, Hale hat auf Ambrose gewartet).
4. **Läden:** Pops’ Kiosk (Riverton) und Ednas Eisenwaren (Ironwood) mit Preisen nach G2/G4.
5. **Zeit:** Szene 31 (Blitz gegen den langsamen Uhrmacher ist die richtige Wahl), Szene 40
   (Ambrose erklärt und schenkt den Zeitnot-Trick). Buchbezug: Kapitel 12, Abschnitt 12.5, kurzes
   Zitat „Ist bloß dein Gegner in Zeitnot, blitze nicht mit, sondern nutze die Zeit, die du hast.“
   Eine „gefühlte Zeitnot“ kennt das Buch nicht (in den Buchquellen nachgesehen).
6. **Flashback London 1851:** `klassik-unsterbliche` (Anderssen gegen Kieseritzky), Zugerraten mit
   Weiß ab Zug 17 bis zum Matt; Kaffeehaus ohne Namen.
7. **Mama und Victor:** Mamas Geheimnis (Finale 2001, Big Joe als Trainer) mit Verbot, Foto,
   eigener Partie und Versöhnung; Victor zweimal ohne Partie, vom Verteidigen der Tische zum
   abgebrochenen Satz vor seinem Vater und zur Einladung nach Silicon Bay (Cliffhanger).

**Akt 1 geändert (vorbereitet für Akt 2):** Szene 23 (Rosa am Steg) bekommt den Fund
„verrosteter Schlüssel“ mit einem Satz von Rosa (E4, Auflösung Szene 33).

**Vorschläge und Abweichungen (für Regelwerk, Daten, Code)**

- **R27 Erinnerungen:** Nur die erste Erinnerung einer Staffel gibt die Bauernvorgabe, weitere 20
  Münzen (Szene 47; Frage 4 in Abschnitt 15).
- **Fingerzeig im Laden:** In `karten.json` dauerhaft, G2 verkauft ihn als Verbrauchskarte. Entweder
  eine Sorte „Fingerzeig (einmal)“ anlegen oder G2 auf „Zweite Chance, Flüstern“ beschränken.
- **Neue Gegner und Profile** für die Daten: `riverton.slick`, `riverton.tamsin`, `riverton.ray`,
  `riverton.harlan`, `route2.schaffner`, `ironwood.bigJoe`, `ironwood.hank`, `ironwood.priya`,
  `ironwood.gus`, `mapleFalls.mutter` (Rolle `story`, E + 250, eingerostet, blinder Fleck `roentgen`).
- **Stellungsduelle:** Harlan aus Abb. 3.77, Gus aus Abb. 6.14 (beide im dritten Auftrag
  geprüft); für den Schaffner (Route 2) noch eine Stellung aus Kapitel 7.2, Motiv 1 suchen.
- **Neue Dialogvariable** `mamaSpielt` (Szene 43) für das Verzeichnis R42; Ambroses neue
  Stimmung `fern`.
- **Flashback-Karte** `flashback.london` braucht das Flag `flashback` (F3) und eine Heldenfigur
  „junger Ambrose“.
- Zeitlinie: Ergänzung 1851, 1858, 1866 (Brief), 2001 (Mamas Finale) in Abschnitt 8.

**Offen:** nichts Blockierendes; sechs Fragen mit Empfehlung in Abschnitt 15 der Bibel.
