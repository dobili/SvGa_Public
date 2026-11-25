# Schnittstelle für Schachvarianten (26.11.2026, mittel-3)

Zweck: Jede spielbare Variante meldet sich an einer Stelle an. Partie, Spielhülle und
Engineanbindung fragen nur diese Schnittstelle. Wer eine Variante baut (mittel-2: Drache, Falke und
Bison; mittel-4: Nebel, Ente, Tandem), ändert `schnittstelle/partie.ts`, `PartieHuelle` und die
Engineanbindung nicht. Wer dort etwas braucht, meldet es an mittel-3.

## Dateien

| Datei                                             | Inhalt                                                                                                                             |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `app/src/spiel/varianten/variante.ts`             | Typen und Anmeldung: `Variantendefinition`, `registriereVariante`, `varianteVon`, `alleVarianten`                                  |
| `app/src/spiel/varianten/regelschicht.ts`         | `chessopsRegeln(rules, kennung)`: Regeln, Züge, Ende für alles, was chessops kennt                                                 |
| `app/src/spiel/varianten/standardvarianten.ts`    | die acht mitgebrachten Varianten (blind, gehoer, schach960, dreischach, atomschach, koenigDerHuegel, koenigsrennen, raeuberschach) |
| `app/src/spiel/varianten/alle.ts`                 | meldet alle Varianten an; neue Variante = eine Zeile `import "./drache";`                                                          |
| `app/src/spiel/varianten/variantenengine.ts`      | Engine für Bots und Märchenfiguren: Kandidaten mit Wert, legale Züge                                                               |
| `app/src/abenteuer/anbindung/variantenpartien.ts` | eigene Partiekomponenten (Tandem, Ente, Nebel) in der Hülle                                                                        |
| `app/src/spiel/varianten/enginebefehle.ts`        | `enginevorbereitung(angabe)`: Dateien und UCI-Befehle vor der Partie                                                               |
| `app/src/spiel/varianten/varianten.test.ts`       | Tests                                                                                                                              |

`variante` in `schnittstelle/partie.ts` (Partieauftrag) und `spiel/partie.ts` (Einstellung der
Partie) ist jetzt `Variantenkennung` (eine Zeichenkette), keine feste Liste mehr. Wer eine
Variante baut, trägt ihre Datei mit einer Zeile in `app/src/spiel/varianten/alle.ts` ein; der
Speicher und die Partie importieren diese Datei und kennen damit jede angemeldete Variante.
Unbekannte Kennungen in alten Speicherständen fallen weg (die Partie spielt dann gewöhnlich).

## Eine Variante anmelden

Eine eigene Datei je Variante oder Familie, etwa `app/src/spiel/varianten/drache.ts`:

```ts
import { registriereVariante, type Regelschicht } from "./variante";

const regeln: Regelschicht = {
  chessops: null, // chessops kennt den Drachen nicht
  legaleZuege: (fen) => …, // UCI: „e2e4“, Umwandlung „e7e8q“, Einsetzen „P@e4“
  ziehe: (fen, uci) => …, // { fen, san } oder null
  ende: (fen) => …, // { sieger: "weiss" | "schwarz" | null, grund: "variante.drache.ende" } oder null
  stellung: () => null, // chessops-Stellung, wo es eine gibt
};

registriereVariante({
  kennung: "drache", // wie in begegnungen.json und in der Ink-Variable varianteDracheGelernt
  art: "figuren", // regel | figuren | sonderform | darstellung
  name: "variante.drache.name", // Spieltext in inhalte/abenteuer/texte/de.json
  regeln,
  engine: {
    engine: "fairy",
    uciVariante: "drache",
    ini: "[drache:chess]\ncustomPiece1 = d:QN\n…", // Abschnitt im Format von variants.ini
  },
  startstellung: (zufall) => "…", // fehlt: Grundstellung
  brett: {
    felder: (fen) => [{ feld: "d4", farbe: "gold" }], // dauerhaft markierte Felder
    zaehler: (fen) => ({ text: "variante.x.zaehler", werte: { weiss: 1 } }),
    schlagwirkung: "explosion", // nur Atomschach bisher
    sicht: "alles", // "keine_figuren" (blind) oder (fen) => sichtbare Felder (Nebel)
  },
});
```

Regeln für Figuren, die chessops nicht kennt: am einfachsten über ffish (die Regelbibliothek von
Fairy-Stockfish als WebAssembly, GPL 3) mit derselben variants.ini. Dann sind Regeln und Engine
gleich. Die Figurenbilder (Drache, Falke, Bison) gibt das Brett über den Buchstaben der FEN; welche
Buchstaben, bitte an mittel-3 melden, damit der Figurensatz sie kennt.

Die Kennung kommt zusätzlich in die Liste `variante` in
`schemas/abenteuer-begegnungen.schema.json`; den Namen und die Enden in die Spieltexte
(`variante.<kennung>.name`, `variante.<kennung>.ende`).

## Engine

`enginevorbereitung(angabe)` liefert, was die Anbindung vor `ucinewgame` tut:

1. Jede Datei aus `dateien` im Dateisystem der Engine ablegen (WebAssembly: `FS.writeFile`). Für
   eigene Varianten ist das `/varianten.ini` mit dem Abschnitt aus `ini`.
2. Die `befehle` der Reihe nach senden:
   - `setoption name VariantPath value /varianten.ini` (nur bei `ini`)
   - `setoption name UCI_Variant value <uciVariante>`
   - weitere Optionen, etwa `setoption name UCI_Chess960 value true`

Eingebaute Namen von Fairy-Stockfish: `3check`, `atomic`, `kingofthehill`, `racingkings`,
`antichess`, `crazyhouse`, auch `duck` (Ente). „stockfish“ heißt: die gewöhnliche Engine der App
(Schach960 und die Darstellungsvarianten). Fairy-Stockfish ist ein Zusatzpaket wie Maia: Es lädt
erst, wenn eine Variantenpartie beginnt. Die Stärke regelt die Anbindung (Skill Level, Zeit, Tiefe)
nach der Gegnerstärke der Begegnung; Varianten geben dafür nichts an.

## Was die Hülle mit der Variante tut (folgt in den nächsten Teilpatches)

- Zug des Lesers: `regeln.ziehe(fen, uci)`. Ein ungültiger Zug wird abgelehnt wie bisher.
- Nach jedem Zug: `regeln.ende(fen)`. Bei einem Ende zeigt die Hülle den Text zu `grund` und
  meldet Sieg, Niederlage oder Remis an das Abenteuer (keine Nadel, keine Elo).
- Brett: `brett.felder` als Markierung, `brett.zaehler` als Zeile über dem Brett, `schlagwirkung`
  als Explosion über den Feldern, die leer wurden, `sicht` für Blind und Nebel.
- Keine Partiebesprechung für Varianten außer blind und gehoer (macht mittel-1).

## Engine für Bots und Märchenfiguren (Wünsche von mittel-2 und mittel-4)

`app/src/spiel/varianten/variantenengine.ts` beschreibt, was die Variantenengine (Fairy-Stockfish,
einkernig, Zusatzpaket) anbietet. Die Umsetzung kommt mit dem Engine-Teilpatch und meldet sich mit
`meldeVariantenengineAn` an; bis dahin gibt `variantenengine()` null zurück.

```ts
analysiere({ fen, engine, ms, kandidaten, staerke? }) // → [{ zug: "e2e4", wert: { cp: 35 } }, …]
legaleZuege(fen, engine) // → ["e2e4", …] über „go perft 1“
```

- `engine` ist die `Engineangabe` der Variante (UCI_Variant und gegebenenfalls `ini`). Die Engine
  bereitet sich bei jedem Wechsel der Variante selbst vor (`enginevorbereitung`).
- `wert` gilt aus Sicht der Seite am Zug: Hundertstel Bauern oder `{ matt: n }`.
- Zugschreibweise wie Fairy-Stockfish: Ente `e2e4,e4d5` (Zug, dann Entenfeld), Einsetzen `P@e4`,
  Taschen in der FEN `[Qn]`. Die Ente gibt es in Fairy-Stockfish seit 2023; der einkernige Build
  nimmt einen Stand danach.
- Stärke: `skill` (Skill Level 0 bis 20) und/oder `tiefe`. Wie stark ein Gegner der Begegnung ist,
  rechnet die Hülle aus der Gegnerstärke; eigene Bots dürfen `analysiere` mit mehreren Kandidaten
  rufen und selbst wählen.

## Märchenfiguren: Regeln, Anmeldung bei der Engine, Bilder (mittel-2)

1. **Engine:** In der `Engineangabe` steht `uciVariante` (eigener Name, etwa `drache` oder
   `falkeUndBison`) und `ini` mit dem Abschnitt im Format von variants.ini, etwa
   `[falkeUndBison:seirawan]` mit den Figuren oder `[drache:chess]` mit
   `customPiece1 = d:QN`. Die Anbindung legt den Abschnitt als `/varianten.ini` ab und setzt
   `VariantPath` und `UCI_Variant` (siehe oben). Mehrere eigene Varianten stehen je in ihrem
   Abschnitt; die Anbindung schreibt die Datei vor jeder Partie neu.
2. **Regeln (Zuglegalität):** chessops kennt keine Märchenfiguren. Zwei Wege:
   - ffish (npm `ffish`, GPL 3, ein Kern, synchron nach dem Laden): `legalMoves()`, `push(uci)`,
     `isGameOver()`, `result()` mit derselben variants.ini (`loadVariantConfig`). Damit wird die
     `Regelschicht` synchron wie bei chessops. Empfohlen.
   - `variantenengine().legaleZuege(…)`: asynchron, nur wenn ffish nicht reicht.
3. **Bilder:** `brett.figurenbilder` in der Definition, je FEN-Buchstabe ein Pfad im
   Abenteuer-Paket (`figuren/varianten/…`), groß für Weiß, klein für Schwarz. Das Brett der Hülle
   zeichnet für diese Buchstaben das Bild statt der gewöhnlichen Figur. Bitte die Buchstaben melden
   (etwa Drache `D`/`d`, Falke `H`/`h`, Bison `E`/`e` wie bei Seirawan).

## Eigene Partie in der Hülle (mittel-4: Nebel, Ente, Tandem)

Für Varianten mit eigenem Ablauf steht in der Definition `ablauf: "eigene_partie"`, und die
Komponente meldet sich in `app/src/abenteuer/anbindung/variantenpartien.ts` an:

```ts
registriereVariantenpartie("tandem", Tandempartie);
// Tandempartie({ partie, staerke, eigeneFarbe, beiEnde }) → beiEnde({ ausgang, halbzuege, zuege? })
```

Seit Teil 6: Die Komponente bekommt statt des Partieauftrags die `partie` der App (Startstellung,
Gegnername `einstellung.botName`, Begegnung `einstellung.abenteuer.kennung`, Variante). Die Hülle
(`EigeneVariantenpartie.tsx`, `eigenepartie.ts`) schreibt `beiEnde` als Ende der Partie:
„sieg“/„niederlage“ als Ende der Variante mit `grund` `variante.<kennung>.ende`, „remis“ als
Remis der Variante, „abgebrochen“ als Aufgabe; `halbzuege` zählt fürs Ergebnis. Der Bot der Hülle
zieht in solchen Partien nicht. Daneben zeigt die Hülle nur „Aufgeben“.

Die Hülle zeigt die Komponente an Stelle ihres Bretts und übernimmt Rahmen, Porträt, den
Dialogknoten danach, Ergebnis und Belohnung wie bei Schach960. Brett und Bot gehören der
Komponente. Dieselbe Form passt für Märchenfiguren, wenn mittel-2 das eigene Brett lieber selbst
baut. Ohne eigenes Brett reichen `regeln`, `engine` und `figurenbilder`, und die Hülle spielt die
Variante wie Drei-Schach.

Neue Kennungen in `schemas/abenteuer-begegnungen.schema.json`: `drache`, `falkeUndBison`, `nebel`,
`ente`, `tandem`.

## Varianten ohne chessops (Teil 6)

- `vorbereiten?: () => Promise<void>` in der Definition: Die Partie wird erst danach angelegt
  (`anbindung/dienste.ts`), und die Hülle zeigt das Brett erst danach (`useVariantenbereit.ts`,
  auch nach einem Neuladen). Für Falke und Bison und den Drachen: `vorbereiten: ladeMaerchenregeln`.
- Ist `regeln.chessops` null, rechnen Partie und Brett allein über die Regelschicht
  (`spiel/varianten/freieregeln.ts`): Kurznotation aus `ziehe(...).san`, Ziele aus `legaleZuege`,
  Ende aus `ende`. Die Partie speichert die Kurznotation von ffish.
- Einsetzwahl: Gibt es zu Von und Nach mehrere legale Züge, die sich im fünften Zeichen
  unterscheiden („g1f3“, „g1f3h“, „g1f3e“), fragt die Hülle wie bei der Umwandlung
  (`Zusatzwahl.tsx`: ohne Einsetzen, Falke, Bison, Drache).
- Tasche: steht aus „[HEhe]“ der FEN als Zeile über dem Brett (`Taschenzeile.tsx`). Das Brett
  zeichnet H, E, D über die Pixelfiguren des Brettstils (pixelfiguren.ts von mittel-2).

## Sonderformen

- Nebel: eigene Sicht über `brett.sicht` (Funktion: sichtbare Felder) und Königsfang als Ende in
  `regeln.ende`; als eigene Partie, wenn die Sicht mehr braucht. Bot über die gewöhnliche Engine.
- Ente: Fairy-Variante `duck`, Zug „Zug,Entenfeld“; zweiter Teilzug in der eigenen Partie.
- Tandem: zwei Bretter, Einsetzen, Partnerbot in der eigenen Partie (Einzelheiten von mittel-4
  über den Hauptchat).
