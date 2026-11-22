/**
 * Kleines Tageszeitsymbol mit Text (Spieluhr, Wunsch des Autors, 22.11.2026): im Tagebuch und im
 * Spielmenü, nicht dauernd auf dem Bildschirm. Beispiel: „🌙 Tag 2, Nacht, 23 Uhr“.
 * Abhängigkeiten: regeln/spieluhr.ts, texte/texte.ts.
 */
import { phase, type Tagesphase } from "../regeln/spieluhr";
import { tSpiel } from "../texte/texte";

const SYMBOL: Readonly<Record<Tagesphase, string>> = {
  morgen: "🌅",
  tag: "☀️",
  abend: "🌇",
  nacht: "🌙",
};

/** Symbol und Text der Tageszeit. */
export function Tageszeit({ stunde, tag }: { readonly stunde: number; readonly tag: number }) {
  const p = phase(stunde);
  return (
    <span className="abenteuer-tageszeit" data-phase={p}>
      <span aria-hidden="true">{SYMBOL[p]}</span>{" "}
      {tSpiel("uhr.anzeige", {
        tag: String(tag),
        phase: tSpiel(`uhr.${p}`),
        stunde: String(stunde),
      })}
    </span>
  );
}
