# Variantenorte: Atmosphäre (Auftrag des Hauptchats, 26.11.2026, mittel-2)

Frage je Ort: Ist es glaubhaft, dass man hier diese Variante spielt? Geprüft wurden Karte (Möbel,
Schilder), Statisten (Sätze, Tun, Kleidung nach `statistenrollen.json`), Dialoge, Funde und das
Dauergeräusch (`orte.json`, Feld `geraeusch`). Grundlage: Dokument 10, Abschnitt 3a, und die
Story-Bibel, Abschnitte 28 und 29. Die Partien selbst bauen mittel-3 (L3, L4, L7, L8, Räuberschach)
und mittel-4 (L5, L6, Tandem); an deren Begegnungsknoten ist nichts geändert.

**Befund vorher, für alle Orte gleich:** Die Statisten erzählten fast überall allgemeines
Schachwissen (Morphy, Ströbeck, Lieblingsmotive), kaum einer sprach von der Variante des Orts, und
niemand spielte sie. Auf den Wegkarten von Akt 4 lief kein Dauergeräusch (das Paket hat die Schleifen
in `klang/akt4/`, nur angeschlossen waren sie nicht).

## Je Ort: Befund und Umsetzung

| Ort | Befund | Umgesetzt |
| --- | ------ | --------- |
| L1 Port Delacroix (Schach960, Musikhaus) | Draußen redet niemand vom Musikhaus. Im Musikhaus sitzen nur die Figuren des Clubs. | Handwerker am Kai: Trompeten und Figurenklappern, „die mischen vor jeder Partie die Grundreihe neu“. |
| L2 Long Ridge Trail (Blindschach, Hütten) | Wanderer und Holzfäller mit allgemeinem Wissen; kein Spiel ohne Brett zu sehen. Kein Geräusch. | Zwei Wandernde am Picknicktisch spielen Blindschach ohne Brett und rufen Züge. Wanderer und Holzfäller erzählen von Greta, die blind gegen zwei spielt. Geräusch `wald_still`. |
| L3 Echo Canyon (Drei-Schach, Canyonrand) | Juniper erzählt von einem Brett auf dem Felsvorsprung, die Karte hatte keins. Kletterer redet von Fesselung. Kein Echo zu hören. | Brett auf einem flachen Fels, daneben Kletterin und Kletterpartner (Kreidebeutel, Kreidestriche je Schach, Kleidung „unterwegs“). Kletterer, Campbetreuerin und Fotograf über das dreifache Echo. Geräusch `canyon` (Wüstencanyon mit großem Hall); das einzelne Echo des Pfiffs (`canyonrand`) spielt Junipers Dialog. |
| L4 Steamwell Basin (Atomschach, Geysirbecken) | Rangerin Bell erklärt; Praktikant und Kind ohne Bezug. Kein Geräusch. | Praktikant: Bell zählt vor jedem Schlag laut; Kind: „meinen eigenen König weggesprengt“. Geräusch `geysire`. |
| L5 Bayou Noir (Nebelschach) | Mundharmonika erzählt von Anderssen, die Fotografin schwieg. Kein Geräusch. | Mundharmonika über Nebelschach („man hört den Gegner, bevor man ihn sieht“), Fotografin über den Nebel. Geräusch `grillen` (eine Sumpfschleife mit Fröschen fehlt, siehe unten). |
| L6 Wide Plains (Entenschach, Prärie) | Ray erklärt; Radfahrerin über Spieße. Kein Geräusch. | Radfahrerin: Ray nennt die Ente den Twister. Geräusch `praerie` (böiger Wind, Bisonschnauben). |
| L7 Northlight (König der Hügel, Seeufer und Leuchtturm) | Zwei Blitzspieler am Klapptisch spielten „Blitz“; am Leuchtturm Elo-Wissen. Kein Geräusch. | Die beiden spielen König der Hügel und reden darüber; Fotograf und Angler am Leuchtturm erzählen von Abe und den Fischern. Geräusch `see_hell` auf beiden Karten. |
| L8 Old Mother Road (Königsrennen, Diner) | Earl und die Kellnerin passen; Trucker und Tankwart schwiegen. Kein Geräusch draußen. | Trucker und Tankwart über Königsrennen („wer verliert, zahlt den Kaffee“). Geräusch `wueste` (Wind, Windspiel). |
| L9 Hochebene (Falke und Bison) | Gut nach den Leitplanken O5 (Lehrerin, Mechaniker, Schülerin, keine Kostüme). Nur im Schulhof spielte niemand. Kein Geräusch. | Schülerin und Schüler am Steintisch spielen Falke und Bison (Kleidung „jugend“, Alltag, keine Trachten); Lehrerin, Busfahrerin und ein Wanderer erzählen davon, ohne Herkunftsmythos: „Kiras Uroma hat ihn geschnitzt“. Geräusch `hochebene_wind` an den Felstürmen. |
| L10 Summit City (Drache, Marktplatz) | Der Dialog erzählt von zwanzig Brettern am Brunnen, die Karte zeigte keins; Blitzspieler mit Großmeisterwissen. Kein Geräusch. | Zwei Klapptische mit Brett und Hocker am Brunnen, zwei Spielende üben mit dem Drachen. Blitzspieler, Marktfrau (Lebkuchendrachen) und Bergführerin über das Fest. Geräusch `summit`. |
| Pinewood Camp (Räuberschach, Tandem) | Betreuer: „Abends spielen sie Schach am Feuer“, sonst nichts dazu. Kein Geräusch. | Zwei Kinder spielen am Picknicktisch Räuberschach; Betreuer erklärt es, der Gitarrist erzählt vom Tandem am Feuer. Geräusch `camp`. |

Die Sätze gelten nach Regel 9 als abgesegnet; Heldin oder Held, Rolle der Statisten, Sprache,
Sitzplatz, Laufweg und Kartenbau sind geprüft (siehe unten).

## Offen, mit Grund

- **Drachenfest als eigener Zustand von `summitCity.aussen`** (Laternen über dem Platz, Bierbänke mit
  zwanzig Brettern): braucht Bilder für Laternenkette und Bierbank mit Brett und einen Zustand mit
  Bedingung `wardBleibGesehen`. Vorschlag für den nächsten Schritt; die zwei Tische am Brunnen sind
  der Anfang.
- **Bilder** (Auftrag für den Autor in `docs/AUFGABEN_AUTOR.md`, zusammen mit den Märchenfiguren):
  Brett mit Drachenfigur für den Marktplatz, Kreidestriche am Fels (Schachzähler am Canyon), eine
  Gummiente als Entenfigur für die Prärie. Bis dahin stehen gewöhnliche Bretter.
- **Geräusche**, die im Paket fehlen: eine Sumpfschleife (Frösche, Wasser, ferner Reiher) für das
  Bayou; das Kinderlachen `tandem` ist ein Einzelgeräusch und bleibt dem Tandem-Dialog von mittel-4.
- **Tagesabläufe:** Juniper, Bell, Ray, Abe, Earl, Kira und Sol haben keine eigenen Tagesabläufe;
  sie stehen den ganzen Tag an ihrem Platz. Das passt zu Nebenschauplätzen. Nicht geändert.
- **Musikhaus innen:** Wer dort Schach960 spielt, regelt der Dialog der Bläserin (Begegnungen der
  Sets); Statisten im Raum würden die Figuren des Clubs verdecken. Nicht geändert.

## Prüfungen

`kartenbau` (alle geänderten Szenen „in Ordnung“), `statistenrolle` (mit neuer Probe), `sprache`,
`heldneutral`, `tunplatz`, `laufbahn`, `figurenort`, `sprecherort`: 0 Befunde; `pytest` gesamt grün,
`npm run pruefen` grün.
