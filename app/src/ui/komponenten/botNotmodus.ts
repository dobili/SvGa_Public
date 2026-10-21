/**
 * Notmodus des Bots in der laufenden Partie: Vorzüge planen, aufbewahren und spielen.
 *
 * Rolle im Gesamtbild: Die Regeln stehen in spiel/notmodus.ts (Idee des Autors vom 21.10.2026);
 * hier liegt der Zustand je Partie, solange die App läuft. Nach jedem Zug im Notmodus plant der
 * Bot im Hintergrund, während der Leser nachdenkt; ist der Bot wieder am Zug, wartet er nur noch
 * auf den Plan und spielt seinen Vorzug. Unterbricht ein anderer Auftrag die Engine (etwa ein
 * Hinweis), plant er beim eigenen Zug neu. Nach einem Neuladen ist der Plan weg; der Bot rechnet
 * dann wieder normal und kommt, wenn seine Zeit nicht reicht, erneut in den Modus.
 * Abhängigkeiten: spiel/notmodus.ts, engine/engineDienst.ts, spiel/partie.ts.
 */
import { AuftragAbgebrochen, engine } from "../../engine/engineDienst";
import { planeVorzuege, waehleVorzug, type Vorzug } from "../../spiel/notmodus";
import { stellungen, type Partie } from "../../spiel/partie";

interface Notstand {
  /** Die Stellung nach dem eigenen Zug, für die der Plan gilt. */
  readonly fenNach: string;
  readonly plan: Promise<Vorzug[]>;
  readonly neuPlanen: () => Promise<Vorzug[]>;
}

const staende = new Map<string, Notstand>();

/** Ist der Bot dieser Partie im Notmodus? */
export function imNotmodus(id: string): boolean {
  return staende.has(id);
}

/** Verlässt den Notmodus (mehr als fünf Sekunden, Partieende, Rücknahme). */
export function beendeNotmodus(id: string): void {
  staende.delete(id);
}

/**
 * Plant die Vorzüge nach dem eigenen Zug im Hintergrund.
 * Eingaben: Partie, Stellung nach dem Zug, Zugwahl des Bots für eine Stellung (UCI oder null).
 */
export function planeNotmodus(
  id: string,
  fenNach: string,
  waehle: (fen: string) => Promise<string | null>,
): void {
  const neuPlanen = () => planeVorzuege(engine, fenNach, waehle);
  const plan = neuPlanen();
  // Ein abgebrochener Plan wird erst beim eigenen Zug gebraucht und dann neu gerechnet.
  plan.catch(() => undefined);
  staende.set(id, { fenNach, plan, neuPlanen });
}

/**
 * Der Vorzug für die Partie, wenn der Bot im Notmodus ist.
 * Ausgabe: UCI-Zug; „zeitUm“, wenn kein vorbereiteter Zug geht; null außerhalb des Modus (auch
 * wenn die Stellung nicht mehr zum Plan passt, etwa nach einer Rücknahme).
 */
export async function vorzugFuer(id: string, partie: Partie): Promise<string | "zeitUm" | null> {
  const stand = staende.get(id);
  if (!stand) return null;
  const fens = stellungen(partie);
  const jetzt = fens.at(-1);
  if (!jetzt || fens.at(-2) !== stand.fenNach) {
    staende.delete(id);
    return null;
  }
  let vorzuege: Vorzug[];
  try {
    vorzuege = await stand.plan;
  } catch (grund) {
    if (!(grund instanceof AuftragAbgebrochen)) throw grund;
    vorzuege = await stand.neuPlanen();
  }
  return (await waehleVorzug(engine, jetzt, vorzuege)) ?? "zeitUm";
}
