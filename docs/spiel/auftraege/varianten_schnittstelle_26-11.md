# Schnittstelle für Schachvarianten (26.11.2026, mittel-3)

Zweck: Jede spielbare Variante meldet sich an einer Stelle an. Partie, Spielhülle und
Engineanbindung fragen nur diese Schnittstelle. Wer eine Variante baut (mittel-2: Drache, Falke und
Bison; mittel-4: Nebel, Ente, Tandem), ändert `schnittstelle/partie.ts`, `PartieHuelle` und die
Engineanbindung nicht. Wer dort etwas braucht, meldet es an mittel-3.

## Dateien

| Datei                                          | Inhalt                                                                                                                             |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `app/src/spiel/varianten/variante.ts`          | Typen und Anmeldung: `Variantendefinition`, `registriereVariante`, `varianteVon`, `alleVarianten`                                  |
| `app/src/spiel/varianten/regelschicht.ts`      | `chessopsRegeln(rules, kennung)`: Regeln, Züge, Ende für alles, was chessops kennt                                                 |
| `app/src/spiel/varianten/standardvarianten.ts` | die acht mitgebrachten Varianten (blind, gehoer, schach960, dreischach, atomschach, koenigDerHuegel, koenigsrennen, raeuberschach) |
| `app/src/spiel/varianten/alle.ts`              | meldet alle Varianten an; neue Variante = eine Zeile `import "./drache";`                                                          |
| `app/src/spiel/varianten/enginebefehle.ts`     | `enginevorbereitung(angabe)`: Dateien und UCI-Befehle vor der Partie                                                               |
| `app/src/spiel/varianten/varianten.test.ts`    | Tests                                                                                                                              |

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

## Sonderformen

Ente, Nebel und Tandem verändern den Ablauf (zwei Teilzüge, verdeckte Felder, zwei Bretter). Nebel
passt in `brett.sicht`. Die Ente ist bei Fairy-Stockfish eine eigene Variante (`duck`): Der Zug in
UCI enthält dort das Entenfeld, `regeln.ziehe` nimmt ihn so. Für Tandem (zwei Bretter, Steine
wandern in die Tasche des Partners) braucht die Hülle einen eigenen Ablauf. Bitte als Wunsch an
mittel-3 schreiben, was genau gebraucht wird: Ich lege dafür einen Haken in die Definition
(`ablauf`), statt dass zwei Chats in der Hülle bauen.
