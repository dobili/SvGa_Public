/**
 * Nebenzweig im Rückblick: die Hauptvariante der Engine ab der Stellung vor einem Zug als
 * spielbare Züge mit Stellungen (seit 0.2.85, Wunsch des Autors: die Zugfolge unter „Besser war
 * …“ soll man auf dem Brett Zug für Zug sehen können, wie eine Abzweigung bei den Abbildungen).
 * Reine Funktion; gespeichert ist die Variante in UCI (useAuswertung.ts, höchstens sechs
 * Halbzüge).
 * Abhängigkeiten: schach/notation.ts, spiel/zuege.ts.
 */
import { sanInSprache } from "../schach/notation";
import { fenNach, uciZuSan } from "./zuege";
import { sprache } from "../i18n/sprache";

/** Ein Zug des Nebenzweigs. */
export interface Zweigzug {
  /** „10. exf4“, „10... Sf6“ oder „Sf6“ (deutsche Figurenbuchstaben). */
  readonly text: string;
  /** Der Zug in SAN (englisch), für das Brett. */
  readonly san: string;
  /** Stellung vor und nach dem Zug. */
  readonly vorher: string;
  readonly nachher: string;
}

/** „10. exf4“ für Weiß; für Schwarz „10... Sf6“ nur am Anfang, sonst ohne Nummer. */
function mitNummer(fen: string, san: string, erster: boolean): string {
  const [, seite = "w", , , , nummer = "1"] = fen.split(" ");
  if (seite === "w") return `${nummer}. ${san}`;
  return erster ? `${nummer}... ${san}` : san;
}

/**
 * Die Züge des Nebenzweigs; bricht beim ersten Zug ab, der in der Stellung nicht geht.
 * Beispiel: Stellung nach 9... Sxf4 mit [e3f4, g8f6, d2e4] → „10. exf4“, „10... Sf6“, „11. Se4“.
 */
export function zweigzuege(fen: string, variante: readonly string[]): Zweigzug[] {
  const zuege: Zweigzug[] = [];
  let stellung = fen;
  for (const uci of variante) {
    const san = uciZuSan(stellung, uci);
    const nachher = san ? fenNach(stellung, san) : null;
    if (!san || !nachher) break;
    const text = mitNummer(stellung, sanInSprache(san, sprache()), zuege.length === 0);
    zuege.push({ text, san, vorher: stellung, nachher });
    stellung = nachher;
  }
  return zuege;
}
