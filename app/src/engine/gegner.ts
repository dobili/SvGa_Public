/**
 * Vorgefertigte Gegner („Bots“): Name, Stufe je Phase, Durchschnitt und Klasse.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (17.10.2026, Rückfrage S5): Gegner mit Namen, die in
 * Eröffnung, Mittelspiel und Endspiel verschieden stark sind (Streuung höchstens zwei Stufen um
 * das Mittelspiel), mit Durchschnittswertung und Einordnung nach den Stufennamen, auswählbar und
 * nach Stärke sortiert. Die Stufen selbst (Skill Level, Fehlerprofile) stehen in stufen.ts; ein
 * Gegner ist nur eine Vorgabe für die drei Regler. Die Liste ist ein Vorschlag zur Durchsicht.
 * Abhängigkeiten: stufen.ts (Stufennummer), schach/phase.ts (Phase), i18n (Beschreibungen).
 */
import type { Textschluessel } from "../i18n/sprache";
import type { Fehlerart } from "./fehlerart";
import type { Phase } from "../schach/phase";
import { stufe, type Stufe, type Stufennummer } from "./stufen";

export interface Gegner {
  readonly kennung: string;
  readonly name: string;
  readonly beschreibung: Textschluessel;
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
}

/** Streuung um das Mittelspiel, höchstens zwei Stufen (Vorgabe des Autors). */
const STREUUNG = 2;

function gegner(
  kennung: string,
  name: string,
  eroeffnung: Stufennummer,
  mittelspiel: Stufennummer,
  endspiel: Stufennummer,
): Gegner {
  if (
    Math.abs(eroeffnung - mittelspiel) > STREUUNG ||
    Math.abs(endspiel - mittelspiel) > STREUUNG
  ) {
    throw new Error(`Gegner ${kennung}: Streuung über ${STREUUNG} Stufen`);
  }
  return {
    kennung,
    name,
    beschreibung: `gegner.${kennung}` as Textschluessel,
    stufenJePhase: { eroeffnung, mittelspiel, endspiel },
  };
}

/** Die vorgefertigten Gegner, nach Durchschnitt sortiert (durchschnitt). */
export const GEGNER: readonly Gegner[] = [
  gegner("lotta", "Lotta", 1, 1, 1),
  gegner("opa-hans", "Opa Hans", 2, 1, 2),
  gegner("max", "Max", 1, 2, 1),
  gegner("frieda", "Frieda", 2, 2, 3),
  gegner("herr-lehmann", "Herr Lehmann", 3, 2, 2),
  gegner("nina", "Nina", 3, 3, 3),
  gegner("jonas", "Jonas", 2, 3, 4),
  gegner("timo", "Timo", 5, 4, 3),
  gegner("kurt", "Kurt", 4, 5, 5),
  gegner("lena", "Lena", 6, 6, 5),
  gegner("doktor-berg", "Doktor Berg", 6, 7, 7),
  gegner("gm-gruen", "Großmeister Grün", 8, 8, 8),
];

/** Durchschnitt der drei Stufen, eine Nachkommastelle. Beispiel: Timo (5, 4, 3) → 4. */
export function durchschnitt(g: Gegner): number {
  const s = g.stufenJePhase;
  const summe = s.eroeffnung + s.mittelspiel + s.endspiel;
  return Math.round((summe / 3) * 10) / 10;
}

/** Die Stufe, deren Name den Gegner einordnet (Durchschnitt gerundet). */
export function klasseVon(g: Gegner): Stufe {
  return stufe(Math.round(durchschnitt(g)));
}

/** Der Gegner zu einer Kennung, sonst null. */
export function gegnerVon(kennung: string | null): Gegner | null {
  return GEGNER.find((g) => g.kennung === kennung) ?? null;
}

/**
 * Ein eigener Gegner des Lesers (0.2.42, Wunsch des Autors): Name, Stufen je Phase, erlaubte
 * Fehlerarten (nur in Stufe 1 bis 4 wirksam; leer: nie ein absichtlicher Fehler) und Stil von −2
 * (sehr defensiv) bis 2 (sehr aggressiv, engine/stil.ts). Liegt im Speicher (speicher/gegner.ts).
 */
export interface EigenerGegner {
  readonly kennung: string;
  readonly name: string;
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
  readonly fehlerarten: readonly Fehlerart[];
  readonly stil: number;
}

/** Vorsilbe der Kennungen eigener Gegner (unterscheidet sie von den vorgefertigten). */
export const EIGENE_VORSILBE = "eigen-";

/** Eine neue, eindeutige Kennung für einen eigenen Gegner. */
export function neueGegnerkennung(): string {
  const BASIS = 36;
  const STELLEN = 5;
  const zufall = Math.random()
    .toString(BASIS)
    .slice(2, 2 + STELLEN);
  return `${EIGENE_VORSILBE}${Date.now().toString(BASIS)}-${zufall}`;
}

/** Der Name eines Gegners zur Anzeige: gespeicherter Name, sonst der vorgefertigte; sonst null. */
export function gegnername(
  kennung: string | null,
  botName: string | null | undefined,
  eigene: readonly EigenerGegner[] = [],
): string | null {
  if (botName) return botName;
  return gegnerVon(kennung)?.name ?? eigene.find((g) => g.kennung === kennung)?.name ?? null;
}

/** Alle Gegner nach Durchschnitt sortiert, bei Gleichstand nach Mittelspiel. */
export function gegnerSortiert(): Gegner[] {
  return [...GEGNER].sort(
    (a, b) =>
      durchschnitt(a) - durchschnitt(b) ||
      a.stufenJePhase.mittelspiel - b.stufenJePhase.mittelspiel,
  );
}
