/**
 * Rechnung der Fortschrittsringe, die zu Orden werden: Übungen, die fünf Teile des Buches und die
 * Bündel der Bot-Stufen. Reine Funktionen ohne Oberfläche.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (26.10.2026): Orden nur für volle Ringe, das Buch getrennt
 * nach Abschnitten, Übungen mit eigenem Ring, die Bots in Bündeln (1–3, 4–5, 6–7, 8–9 mit je zwei
 * Orden: alle Bots einmal besiegt, alle Bots in allen Zeitarten besiegt; 10, die Engine, mit einem
 * Superorden für jeden Bot einmal). Die Teile folgen dem Buch (main.tex: Grundlagen, Eröffnung,
 * Mittelspiel, Endspiel, Praxis; Kapitel 0 steht vor dem ersten Teil und zählt zu den Grundlagen).
 * Ein Teil ist voll, wenn alle Abbildungen seiner Kapitel angesehen und alle Übungen gelöst sind.
 * Abhängigkeiten: daten/uebungsliste-daten.ts, engine/gegner.ts, engine/botgruppe.ts,
 * speicher/besiegt.ts, speicher/format.ts.
 */
import { UEBUNGEN_JE_KAPITEL } from "../../../daten/uebungsliste-daten";
import { gruppeDesBots } from "../../../engine/botgruppe";
import { durchschnitt, GEGNER, istSpassbot } from "../../../engine/gegner";
import type { Besiegte } from "../../../speicher/besiegt";
import type { Fortschritt } from "../../../speicher/format";
import type { Anteil } from "../../../speicher/fortschritt";

/** Die Teile des Buches mit ihren Kapiteln (main.tex). */
export const BUCHTEILE = [
  { kennung: "grundlagen", kapitel: [0, 1] },
  { kennung: "eroeffnung", kapitel: [2, 3, 4] },
  { kennung: "mittelspiel", kapitel: [5, 6, 7] },
  { kennung: "endspiel", kapitel: [8, 9, 10] },
  { kennung: "praxis", kapitel: [11, 12] },
] as const;
export type Buchteil = (typeof BUCHTEILE)[number]["kennung"];

/** Die Bündel der Bot-Stufen (Vorschlag des Autors, 26.10.2026). */
export const BOTBUENDEL = [
  { kennung: "1-3", stufen: [1, 2, 3] },
  { kennung: "4-5", stufen: [4, 5] },
  { kennung: "6-7", stufen: [6, 7] },
  { kennung: "8-9", stufen: [8, 9] },
  { kennung: "10", stufen: [10] },
] as const;
export type Botbuendel = (typeof BOTBUENDEL)[number]["kennung"];

/** Das Bündel der Engine: Ein Superorden für jeden Bot einmal, kein Orden für alle Zeitarten. */
export const ENGINEBUENDEL: Botbuendel = "10";

/** Ein Kapitel mit seinen Abbildungen (aus index.json). */
export interface Kapitelangabe {
  readonly kapitel: number;
  readonly abbildungen: readonly string[];
}

/** Ein Ring ist voll, wenn er Inhalt hat und alles erreicht ist; dann wird er zum Orden. */
export function istVoll(anteil: Anteil): boolean {
  return anteil.gesamt > 0 && anteil.erreicht >= anteil.gesamt;
}

const geloest = (fortschritt: Fortschritt, id: string) =>
  fortschritt.uebungen[id]?.geloest === true;

/** Gelöste Übungen des ganzen Buches. Beispiel: 3 von 86. */
export function uebungsanteil(fortschritt: Fortschritt): Anteil {
  const alle = Object.values(UEBUNGEN_JE_KAPITEL).flat();
  return { erreicht: alle.filter((id) => geloest(fortschritt, id)).length, gesamt: alle.length };
}

/**
 * Ein Teil des Buches: angesehene Abbildungen und gelöste Übungen seiner Kapitel zusammen.
 * Beispiel: Grundlagen (Kapitel 0 und 1) → 71 Abbildungen und 7 Übungen, also „x von 78“.
 */
export function teilanteil(
  teil: Buchteil,
  kapitel: readonly Kapitelangabe[],
  fortschritt: Fortschritt,
): Anteil {
  const nummern = new Set<number>(BUCHTEILE.find((b) => b.kennung === teil)?.kapitel ?? []);
  const abbildungen = kapitel.filter((k) => nummern.has(k.kapitel)).flatMap((k) => k.abbildungen);
  const uebungen = [...nummern].flatMap((n) => UEBUNGEN_JE_KAPITEL[n] ?? []);
  const erreicht =
    abbildungen.filter((id) => fortschritt.gesehen[id] !== undefined).length +
    uebungen.filter((id) => geloest(fortschritt, id)).length;
  return { erreicht, gesamt: abbildungen.length + uebungen.length };
}

/** Die vorgefertigten Bots eines Bündels (ohne Spaß-Bots), nach ihrer Gruppe in der Gegnerwahl. */
export function botsDesBuendels(buendel: Botbuendel): string[] {
  const stufen = new Set<number>(BOTBUENDEL.find((b) => b.kennung === buendel)?.stufen ?? []);
  return GEGNER.filter(
    (g) => !istSpassbot(g) && stufen.has(gruppeDesBots(g.kennung, durchschnitt(g))),
  ).map((g) => g.kennung);
}

/**
 * Besiegte Bots eines Bündels: „einmal“ zählt einen Bot, sobald er in irgendeiner Zeitart besiegt
 * ist; „alleZeitarten“ erst, wenn er in Blitz, Schnellschach und Klassisch besiegt ist.
 * Beispiel: Bündel 1–3 (24 Bots), Lotta in Blitz und Klassisch besiegt → einmal 1, alle 0.
 */
export function buendelanteil(
  besiegt: Besiegte,
  bots: readonly string[],
  art: "einmal" | "alleZeitarten",
): Anteil {
  const listen = Object.values(besiegt).map((liste) => new Set(liste));
  const zaehlt = (bot: string) =>
    art === "einmal" ? listen.some((l) => l.has(bot)) : listen.every((l) => l.has(bot));
  return { erreicht: bots.filter(zaehlt).length, gesamt: bots.length };
}
