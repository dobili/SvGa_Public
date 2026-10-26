/**
 * Grundlagen des Gruppenmodus: Kennung „gruppe-N“, Mitglieder, Stufen je Phase und die gemessene
 * Zahl einer Gruppe.
 *
 * Rolle im Gesamtbild: Teil von engine/gruppe.ts (Gruppenmodus einer Bot-Kategorie, Wunsch des
 * Autors, 24.10.2026). Diese Teile brauchen weder die Elo-Zahlen der Bots noch den Speicher; darum
 * stehen sie hier, und engine/botstaerke.ts kann sie benutzen, ohne dass engine/botstaerke.ts und
 * engine/gruppe.ts sich gegenseitig importieren (Ordnung im Code,
 * docs/codefuehrer/8-verbesserungen.md). Von außen geht der Import weiter über engine/gruppe.ts,
 * das alles weiterreicht.
 * Abhängigkeiten: engine/gegner.ts, engine/zahlensatz.ts, engine/stufen.ts, schach/phase.ts (Typ).
 */
import type { Phase } from "../schach/phase";
import { gegnerDerStufe, type Gegner } from "./gegner";
import { gruppentabelle, satzFuer } from "./zahlensatz";
import { STUFEN_ZAHL, type Stufennummer } from "./stufen";

/** Kennungen der Gruppen beginnen so („gruppe-3“). */
export const GRUPPEN_VORSILBE = "gruppe-";
const PHASEN: readonly Phase[] = ["eroeffnung", "mittelspiel", "endspiel"];

/** Ist die Kennung eine Gruppe („gruppe-3“)? */
export function istGruppe(kennung: string | null | undefined): boolean {
  return typeof kennung === "string" && kennung.startsWith(GRUPPEN_VORSILBE);
}

/** Die Kennung der Gruppe einer Stufe. Beispiel: 3 → „gruppe-3“. */
export function gruppenkennung(stufe: Stufennummer): string {
  return `${GRUPPEN_VORSILBE}${stufe}`;
}

/** Die Stufe einer Gruppenkennung; null für alles andere. Beispiel: „gruppe-3“ → 3. */
export function gruppenstufe(kennung: string | null | undefined): Stufennummer | null {
  if (!istGruppe(kennung) || !kennung) return null;
  const nummer = Number(kennung.slice(GRUPPEN_VORSILBE.length));
  return Number.isInteger(nummer) && nummer >= 1 && nummer <= STUFEN_ZAHL
    ? (nummer as Stufennummer)
    : null;
}

/** Die Bots der Gruppe (die vorgefertigten Bots der Stufe, ohne Spaß-Bots). */
export function mitgliederDerGruppe(stufe: Stufennummer): Gegner[] {
  return gegnerDerStufe(stufe);
}

/** Die Stufen je Phase der Gruppe: je Phase die höchste Stufe ihrer Bots (für Bedenkzeit, Anzeige). */
export function gruppenstufen(stufe: Stufennummer): Readonly<Record<Phase, Stufennummer>> {
  const bots = mitgliederDerGruppe(stufe);
  const je = (ph: Phase) =>
    bots.reduce<Stufennummer>(
      (max, g) => (g.stufenJePhase[ph] > max ? g.stufenJePhase[ph] : max),
      1,
    );
  return {
    eroeffnung: je(PHASEN[0] ?? "eroeffnung"),
    mittelspiel: je("mittelspiel"),
    endspiel: je("endspiel"),
  };
}

/**
 * Die gemessene Zahl der Gruppe; null, solange nicht gemessen. Zahlensatz: maia aus
 * der Partie, sonst der Satz der Anzeige (engine/zahlensatz.ts).
 */
export function gemesseneGruppenstaerke(stufe: Stufennummer, maia?: boolean): number | null {
  return gruppentabelle(satzFuer(maia))[stufe] ?? null;
}
