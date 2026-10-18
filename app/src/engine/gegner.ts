/**
 * Vorgefertigte Gegner („Bots“): Durchschnitt, Klasse, Suche, Gruppen je Stufe; dazu die eigenen
 * Gegner des Lesers. Die Liste der 64 Gegner selbst steht in engine/gegnerliste.ts (0.2.65).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (17.10.2026, Rückfrage S5): Gegner mit Namen, die in
 * Eröffnung, Mittelspiel und Endspiel verschieden stark sind (Streuung höchstens zwei Stufen um
 * das Mittelspiel), mit Durchschnittswertung und Einordnung nach den Stufennamen, auswählbar und
 * nach Stärke sortiert. Die Stufen selbst (Skill Level, Fehlerprofile) stehen in stufen.ts. Seit
 * 0.2.46 hat jeder Gegner eine Persönlichkeit: eigene Fehlerliste und blinde Flecken
 * (engine/blindeFlecken.ts); die Stufen je Phase bleiben dem Leser verborgen (Wunsch des Autors).
 * Seit 0.2.60 gilt dazu die allgemeine Abhakliste der Fehlerarten aus den Einstellungen
 * (`unterAbhakliste`, Rest aus Rückfrage S7).
 * Abhängigkeiten: stufen.ts, blindeFlecken.ts, fehlerart.ts, schach/phase.ts, i18n.
 */
import type { BlinderFleck } from "./blindeFlecken";
import { FEHLERARTEN, type Fehlerart } from "./fehlerart";
import type { Phase } from "../schach/phase";
import { stufe, type Stufe, type Stufennummer } from "./stufen";
import { GEGNER, type Gegner } from "./gegnerliste";
export { GEGNER, type Gegner } from "./gegnerliste";

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
  /** Zugarten, die der Gegner nicht sieht (0.2.46). */
  readonly blindeFlecken: readonly BlinderFleck[];
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

/**
 * Die Fehlerarten einer Partie unter der allgemeinen Abhakliste (0.2.60, Rest aus Rückfrage S7).
 *
 * Warum: Die Liste in den Einstellungen sagt, welche absichtlichen Fehler die Engine-Stufen und
 * die vorgefertigten Gegner überhaupt machen dürfen (eigene Gegner haben ihre eigene Liste).
 * Eingaben: Liste des Gegners (null: alle Arten) und die erlaubten Arten. Ausgabe: null, wenn
 * beides alles erlaubt (wie bisher); sonst der Schnitt, leer heißt „keine absichtlichen Fehler“.
 * Beispiel: Max (Dame früh, Bauernraub, Figur hängen, Tempoverlust) ohne „Figur hängen“ in der
 * Liste → Dame früh, Bauernraub, Tempoverlust.
 */
export function unterAbhakliste(
  gegnerliste: readonly Fehlerart[] | null,
  erlaubt: readonly Fehlerart[],
): readonly Fehlerart[] | null {
  const allesErlaubt = FEHLERARTEN.every((art) => erlaubt.includes(art));
  if (allesErlaubt) return gegnerliste;
  return (gegnerliste ?? FEHLERARTEN).filter((art) => erlaubt.includes(art));
}

/** Ist der Gegner ein Spaß-Bot (mit Zufallszügen, 0.2.86)? */
export function istSpassbot(g: Gegner): boolean {
  return (g.zufallszuege ?? 0) > 0;
}

/**
 * Die Gegner einer Stufe (Klasse = gerundeter Durchschnitt), nach Durchschnitt sortiert; ohne
 * die Spaß-Bots, die eine eigene Gruppe unter Stufe 1 bilden (`spassbots`).
 */
export function gegnerDerStufe(nummer: Stufennummer): Gegner[] {
  return gegnerSortiert().filter((g) => !istSpassbot(g) && Math.round(durchschnitt(g)) === nummer);
}

/** Die Spaß-Bots (0.2.86), vom schwächsten zum stärksten (mehr Zufall heißt schwächer). */
export function spassbots(): Gegner[] {
  return GEGNER.filter(istSpassbot).sort((a, b) => (b.zufallszuege ?? 0) - (a.zufallszuege ?? 0));
}

/** Alle Gegner nach Durchschnitt sortiert, bei Gleichstand nach Mittelspiel. */
export function gegnerSortiert(): Gegner[] {
  return [...GEGNER].sort(
    (a, b) =>
      durchschnitt(a) - durchschnitt(b) ||
      a.stufenJePhase.mittelspiel - b.stufenJePhase.mittelspiel,
  );
}
