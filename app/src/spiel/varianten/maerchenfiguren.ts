/**
 * Die Varianten mit Märchenfiguren (Auftrag des Hauptchats, 26.11.2026, mittel-2):
 * - „falkeUndBison“ (L9, Hochebene, Story-Bibel Szene 82): Falke = Läufer oder Springer, Bison =
 *   Turm oder Springer, eingesetzt, wenn eine Figur der Grundreihe zum ersten Mal zieht. Das ist
 *   die eingebaute Variante „seirawan“ von Fairy-Stockfish (Hawk H, Elephant E).
 * - „drache“ (L10, Drachenfest in Summit City, Szene 90): ein Drache (Dame + Springer) je Seite,
 *   eingesetzt wie im S-Chess (Entscheidung des Hauptchats 26.11.2026: die Grundstellung bleibt
 *   vertraut, jeder spielt einmal mit dem Drachen). Eigener Abschnitt der variants.ini.
 * FEN-Buchstaben: H/h Falke, E/e Bison, D/d Drache. Die Tasche steht in eckigen Klammern hinter der
 * Stellung („[HEhe]“). Das Brett des Abenteuers zeichnet sie als Pixelfiguren nach den
 * Gemini-Figuren des Autors (abenteuer/brett/pixelfiguren.ts).
 * Abhängigkeiten: spiel/varianten/variante.ts, spiel/varianten/maerchenregeln.ts.
 */
import { ladeMaerchenregeln, maerchenRegeln, meldeMaerchenabschnittAn } from "./maerchenregeln";
import { registriereVariante, varianteVon, type Variantendefinition } from "./variante";

/** Abschnitt der variants.ini für den Drachen; derselbe steht in pipeline/abenteuer/maerchenfaelle.py. */
export const DRACHE_INI = `[drache:seirawan]
archbishop = -
chancellor = -
amazon = d
startFen = rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR[Dd] w KQBCDFGkqbcdfg - 0 1
promotionPieceTypes = nbrq
`;
/** Startstellungen mit Tasche (wie Fairy-Stockfish sie nennt). */
export const FALKE_UND_BISON_START =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR[HEhe] w KQBCDFGkqbcdfg - 0 1";
export const DRACHE_START =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR[Dd] w KQBCDFGkqbcdfg - 0 1";

const MAERCHEN: readonly Variantendefinition[] = [
  {
    kennung: "falkeUndBison",
    art: "figuren",
    name: "variante.falkeUndBison.name",
    regeln: maerchenRegeln("seirawan"),
    engine: { engine: "fairy", uciVariante: "seirawan" },
    startstellung: () => FALKE_UND_BISON_START,
    // Die Hülle wartet darauf vor der Partie (ffish lädt erst dann, knapp 1 MB).
    vorbereiten: () => ladeMaerchenregeln(),
  },
  {
    kennung: "drache",
    art: "figuren",
    name: "variante.drache.name",
    regeln: maerchenRegeln("drache"),
    engine: { engine: "fairy", uciVariante: "drache", ini: DRACHE_INI },
    startstellung: () => DRACHE_START,
    vorbereiten: () => ladeMaerchenregeln(),
  },
];

/** Meldet beide Varianten an (und den Drachen bei ffish); ein zweiter Aufruf ändert nichts. */
export function meldeMaerchenfigurenAn(): void {
  meldeMaerchenabschnittAn(DRACHE_INI);
  for (const v of MAERCHEN) if (!varianteVon(v.kennung)) registriereVariante(v);
}

meldeMaerchenfigurenAn();
