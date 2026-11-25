/**
 * Der Zug des Bots in einer Variantenpartie (Drei-Schach, Atomschach, König der Hügel,
 * Königsrennen, Räuberschach; Auftrag des Hauptchats, 26.11.2026).
 *
 * Warum eigen: Die gewöhnliche Zugwahl (ui/komponenten/partie/botzug.ts mit Stufen, Fehlerarten,
 * Maia und Eröffnungsbuch) kennt nur Schach. Varianten spielen über Fairy-Stockfish
 * (spiel/varianten/variantenengine.ts, engine/fairyEngine.ts); fehlt die Engine (Test ohne
 * Worker) oder versagt sie, spielt ein vorläufiger Gegner: Er nimmt einen Zug, der sofort gewinnt, meidet Züge, nach denen der Leser sofort gewinnt,
 * und wählt sonst zufällig. So lassen sich Orte, Dialoge und Ergebnisse schon testen.
 * Stärke über Fairy-Stockfish: Skill Level und Tiefe aus der Elo-Schätzung der Stufe; für die
 * Begegnungen der Wege (A − 100, wie beim Schach960) wird das nach dem Bau gemessen.
 * Abhängigkeiten: spiel/varianten/, spiel/botzeit.ts, ui/komponenten/partie/botzug.ts (Speicher).
 */
import { fairyEngine } from "../../../engine/fairyEngine";
import { stufe, type Stufennummer } from "../../../engine/stufen";
import { mitUhrverzug } from "../../../spiel/ablauf";
import { zieheBotMitUhr } from "../../../spiel/botzeit";
import { aktuelleFen, type Partiezug } from "../../../spiel/partie";
import { varianteVon } from "../../../spiel/varianten/alle";
import type { Variantendefinition } from "../../../spiel/varianten/variante";
import { meldeVariantenengineAn, variantenengine } from "../../../spiel/varianten/variantenengine";
import { uciZuSan } from "../../../spiel/zuege";
import { animationsverzugMs } from "../../brett/useZuganimation";
import { aendereNeueste, neueste } from "./botzug";

/** Rechenzeit der Variantenengine je Zug (ms) und Bedenkzeit des vorläufigen Gegners. */
const RECHENZEIT_MS = 600;
const BEDENKZEIT_VORLAEUFIG_MS = 700;
/** Elo-Spanne für Skill Level 0 bis 20 (grob, nach dem Bau zu messen). */
const ELO_SKILL_0 = 600;
const ELO_JE_SKILL = 70;
const SKILL_MAX = 20;
const TIEFE_SCHWACH = 2;
const TIEFE_MITTEL = 5;
const TIEFE_STARK = 9;
const ELO_MITTEL = 1100;
const ELO_STARK = 1600;

// Fairy-Stockfish meldet sich hier an; der Worker startet erst beim ersten Zug des Bots.
if (typeof Worker !== "undefined") meldeVariantenengineAn(fairyEngine);

/** Braucht die Partie den Variantenbot (Variante mit Fairy-Stockfish)? */
export function brauchtVariantenbot(variante: string | undefined): boolean {
  return varianteVon(variante)?.engine.engine === "fairy";
}

/** Skill Level und Tiefe aus einer Elo-Schätzung. Beispiel: 800 → Skill 3, Tiefe 2. */
export function variantenstaerke(elo: number): { skill: number; tiefe: number } {
  const skill = Math.max(0, Math.min(SKILL_MAX, Math.round((elo - ELO_SKILL_0) / ELO_JE_SKILL)));
  const tiefe = elo < ELO_MITTEL ? TIEFE_SCHWACH : elo < ELO_STARK ? TIEFE_MITTEL : TIEFE_STARK;
  return { skill, tiefe };
}

/**
 * Zug des vorläufigen Gegners: gewinnt sofort, wenn möglich; sonst ein Zug, nach dem der Leser
 * nicht sofort gewinnt; sonst irgendeiner. Ausgabe UCI oder null, wenn es keinen Zug gibt.
 */
export function vorlaeufigerZug(
  v: Variantendefinition,
  fen: string,
  zufall: () => number,
): string | null {
  const zuege = v.regeln.legaleZuege(fen);
  if (zuege.length === 0) return null;
  const amZug = fen.split(" ")[1] === "b" ? "schwarz" : "weiss";
  const danach = zuege.map((uci) => ({ uci, fen: v.regeln.ziehe(fen, uci)?.fen ?? fen }));
  const gewinnt = danach.find((d) => v.regeln.ende(d.fen)?.sieger === amZug);
  if (gewinnt) return gewinnt.uci;
  const sicher = danach.filter(
    (d) =>
      !v.regeln.legaleZuege(d.fen).some((g) => {
        const f = v.regeln.ziehe(d.fen, g)?.fen;
        const e = f ? v.regeln.ende(f) : null;
        return e !== null && e.sieger !== null && e.sieger !== amZug;
      }),
  );
  const wahl = sicher.length > 0 ? sicher : danach;
  return wahl[Math.floor(zufall() * wahl.length)]?.uci ?? null;
}

/** Der Zug: über die Variantenengine, wenn sie da ist, sonst vom vorläufigen Gegner. */
async function waehleZug(v: Variantendefinition, fen: string, elo: number): Promise<string | null> {
  const engine = variantenengine();
  if (engine) {
    try {
      const kandidaten = await engine.analysiere({
        fen,
        engine: v.engine,
        ms: RECHENZEIT_MS,
        kandidaten: 1,
        staerke: variantenstaerke(elo),
      });
      const zug = kandidaten[0]?.zug;
      // Nur einen Zug nehmen, den auch die Regelschicht kennt (Schreibweise wie chessops).
      if (zug && v.regeln.ziehe(fen, zug)) return zug;
    } catch (fehler) {
      console.warn("Variantenengine versagt, vorläufiger Gegner zieht", fehler);
    }
  }
  await new Promise((fertig) => setTimeout(fertig, BEDENKZEIT_VORLAEUFIG_MS));
  return vorlaeufigerZug(v, fen, Math.random);
}

/**
 * Lässt den Bot in einer Variantenpartie ziehen und schreibt den Zug mit Uhr in den Speicher.
 * Sonderfall: Hat sich die Stellung inzwischen geändert (Leser hat zurückgenommen), verfällt er.
 */
export async function variantenBotzug(
  id: string,
  fen: string,
  variante: string,
  stufennummer: Stufennummer,
  laeuft: () => boolean,
): Promise<void> {
  const v = varianteVon(variante);
  if (!v) throw new Error(`Variante ${variante} ist nicht angemeldet`);
  const start = Date.now();
  const uci = await waehleZug(v, fen, stufe(stufennummer).wertung);
  const jetzt = neueste(id);
  if (!laeuft() || !jetzt || aktuelleFen(jetzt) !== fen) return;
  const san = uci ? uciZuSan(fen, uci, variante) : null;
  if (!san) throw new Error(`Kein Zug des Variantenbots in ${fen}`);
  const zug: Partiezug = {
    san,
    von: "engine",
    quelle: "engine",
    fehler: null,
    verlust: 0,
    stufe: stufennummer,
  };
  aendereNeueste(id, (p) =>
    mitUhrverzug(zieheBotMitUhr(p, zug, Date.now() - start, Date.now()), animationsverzugMs()),
  );
}
