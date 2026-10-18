/**
 * Die Schritte des Engine-Knopfes während der Partie (SpielEngine.tsx), rein und ohne Engine
 * testbar: welcher Schritt als nächster kommt, welcher Zug der eigene letzte war, welcher Satz
 * zum Urteil gehört.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): 1. Bewertung, 2. Zeichen des eigenen
 * letzten Zuges, 3. warum er schlecht war, 4. bester Zug. Schritt 2 und 3 entfallen, wenn sie
 * nichts zu sagen haben.
 * Abhängigkeiten: engine/letzterzug.ts, spiel/erklaerung.ts, spiel/zuege.ts, schach/notation.ts,
 * i18n.
 */
import type { LetzterZugUrteil } from "../../engine/letzterzug";
import { sprache, type Textschluessel } from "../../i18n/sprache";
import { zugfolgeAlsText } from "../../schach/notation";
import type { Zugerklaerung } from "../../spiel/erklaerung";
import { fenNach, regelstellung, sanZuUci } from "../../spiel/zuege";

/** 0: noch nichts; 1: Bewertung; 2: eigener Zug; 3: warum; 4: bester Zug. */
export type Schritt = 0 | 1 | 2 | 3 | 4;
/** Ein Schritt, der auf einen Tipp folgt (alle außer dem Anfang). */
export type Folgeschritt = Exclude<Schritt, 0>;

/** Der eigene letzte Zug mit den Stellungen davor und danach. */
export interface EigenerZug {
  readonly vorherFen: string;
  readonly danachFen: string;
  readonly uci: string;
}

export interface EigenesUrteil {
  readonly zug: EigenerZug;
  readonly urteil: LetzterZugUrteil | null;
  readonly erklaerung: Zugerklaerung | null;
}

/** Zeichen, die einen schlechten Zug anzeigen; nur sie bekommen ein „Warum?“. */
const SCHLECHT: ReadonlySet<string> = new Set(["?!", "?", "??"]);

/**
 * Der letzte Zug der Seite, die jetzt am Zug ist: der vorletzte Halbzug der Partie.
 * Beispiel: Grundstellung, 1. e4 e5 → Weiß ist am Zug, eigener Zug e2e4 (vorher Grundstellung).
 * Sonderfall: Weniger als zwei Halbzüge oder ein unlesbarer Zug → null.
 */
export function eigenerLetzterZug(startFen: string, zuege: readonly string[]): EigenerZug | null {
  const ABSTAND = 2;
  const index = zuege.length - ABSTAND;
  if (index < 0) return null;
  let fen: string | null = startFen;
  for (const san of zuege.slice(0, index)) fen = fen ? fenNach(fen, san) : null;
  const san = zuege[index];
  if (!fen || !san) return null;
  const uci = sanZuUci(fen, san);
  const danach = fenNach(fen, san);
  return uci && danach ? { vorherFen: fen, danachFen: danach, uci } : null;
}

/** Braucht das Urteil ein „Warum?“ Nur bei ?!, ? und ??; gute Züge überspringen Schritt 3. */
export function brauchtWarum(eigenes: EigenesUrteil | null): boolean {
  const zeichen = eigenes?.urteil?.zeichen;
  return zeichen !== null && zeichen !== undefined && SCHLECHT.has(zeichen);
}

/**
 * Der nächste Schritt nach dem erreichten oder null, wenn alles gezeigt ist.
 * Beispiel: nach Schritt 2 mit „?“ kommt 3, mit „!“ gleich 4.
 */
export function naechsterSchritt(
  schritt: Schritt,
  eigenerZug: EigenerZug | null,
  eigenes: EigenesUrteil | null,
): Folgeschritt | null {
  if (schritt === 0) return 1;
  if (schritt === 1) return eigenerZug ? 2 : 4;
  if (schritt === 2) return brauchtWarum(eigenes) ? 3 : 4;
  return schritt === 3 ? 4 : null;
}

/** Der Satz zum Urteil über den eigenen Zug, nach den Klassen der Auswertung. */
export function urteilsschluessel(urteil: LetzterZugUrteil | null): Textschluessel {
  if (!urteil) return "spielengine.urteil.keins";
  switch (urteil.zeichen) {
    case "!!":
      return "spielengine.urteil.brillant";
    case "!":
      return "spielengine.urteil.einziger";
    case "??":
      return "spielengine.urteil.patzer";
    case "?":
      return "spielengine.urteil.fehler";
    case "?!":
      return "spielengine.urteil.ungenau";
    default:
      return urteil.warBester ? "spielengine.urteil.bester" : "spielengine.urteil.gut";
  }
}

/** Ein Zug als Text mit Nummer, etwa „3... Sf6“; unlesbar → der UCI-Zug. */
export function zugtext(fen: string, uci: string): string {
  const pos = regelstellung(fen);
  return pos ? zugfolgeAlsText(pos, [uci], sprache(), 1) : uci;
}
