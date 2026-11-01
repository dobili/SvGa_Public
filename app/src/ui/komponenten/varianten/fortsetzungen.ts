/**
 * Die Fortsetzungen an einem Abzweig für Chips und Pfeile: Text mit Zugnummer, Marke (Stern für
 * die Hauptfortsetzung, sonst die Zahl), Start- und Zielfeld.
 *
 * Rolle im Gesamtbild: Wunsch des Autors zu Frage b (1.11.2026): Am Abzweig zeigt das Brett die
 * Fortsetzungen als blaue, gepunktete Pfeile mit Nummer, passend zu den Chips „Weiter: …“; die
 * Hauptfortsetzung trägt statt der Nummer einen Stern. Beide lesen hier dieselben Marken.
 * Abhängigkeiten: schach/variationsbaum.ts, schach/weiterspielen.ts, schach/notation.ts.
 */
import { sanInSprache } from "../../../schach/notation";
import { fenAm, fortsetzungenAm, type Pfad, type Zugbaum } from "../../../schach/variationsbaum";
import { zugFelder } from "../../../schach/weiterspielen";

/** Marke der Hauptfortsetzung (Wunsch des Autors: „kann meinetwegen ein Stern sein“). */
export const STERN = "★";

export interface Fortsetzungschip {
  readonly pfad: Pfad;
  /** „4... De7“ mit Zugzeichen. */
  readonly text: string;
  /** „★“ für die Hauptfortsetzung, sonst „2“, „3“ … (Stelle in der Liste). */
  readonly marke: string;
  readonly haupt: boolean;
  readonly von: string | null;
  readonly nach: string | null;
}

/**
 * Alle Fortsetzungen nach ``pfad``.
 * Beispiel aus dem Buch: Petroff nach 3. Sxe5 mit 3... d6 und 3... Sxe4?! → „★ 3... d6“ (Pfeil
 * d7–d6) und „2 3... Sxe4?!“ (Pfeil f6–e4).
 */
export function fortsetzungschips(
  baum: Zugbaum,
  pfad: Pfad,
  sprachcode: string,
): Fortsetzungschip[] {
  const fen = fenAm(baum, pfad);
  if (!fen) return [];
  const [, seite = "w", , , , zugnummer = "1"] = fen.split(" ");
  const nummer = seite === "w" ? `${zugnummer}. ` : `${zugnummer}... `;
  return fortsetzungenAm(baum, pfad).map((k, i) => {
    const felder = zugFelder(fen, k.zug);
    return {
      pfad: [...pfad, k.zug],
      text: nummer + sanInSprache(k.zug, sprachcode) + (k.zeichen ?? ""),
      marke: i === 0 ? STERN : String(i + 1),
      haupt: i === 0,
      von: felder?.von ?? null,
      nach: felder?.nach ?? null,
    };
  });
}
