/**
 * Reichweite der Zielvorschläge: Bots und Bot-Orden nur, wenn sie zur eigenen Spielstärke passen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (6.11.2026, Q15-3): Ziele wie „alle Engine-Bots
 * besiegen“ für jemanden mit 900 Elo entmutigen. Vorgeschlagen werden deshalb nur Bots, deren Zahl
 * höchstens REICHWEITE über der eigenen Wertung liegt, und Bot-Orden, deren leichtester Bot so
 * erreichbar ist. Ohne Wertung gilt der stärkste schon besiegte Bot, sonst ANFANG. Selbst
 * angeheftete Ziele bleiben unberührt; es geht nur um Vorschläge.
 * Abhängigkeiten: engine/botstaerke.ts, training/rivalen.ts (eigeneWertung), ringrechnung.ts.
 */
import { staerkeDesBots } from "../engine/botstaerke";
import { WERTUNGSTEMPI } from "../spiel/elomodell";
import type { Nutzerdaten } from "../speicher/format";
import type { Ziel } from "../speicher/gamifizierung";
import {
  BOTBUENDEL,
  botsDesBuendels,
  type Botbuendel,
} from "../ui/komponenten/fortschritt/ringrechnung";
import { eigeneWertung } from "./rivalen";

/** So weit über der eigenen Zahl darf ein vorgeschlagener Bot liegen (etwa 85 % Verlustchance). */
export const REICHWEITE = 300;
/** Annahme ohne Wertung und ohne Sieg: Einsteiger (das leichteste Bündel reicht bis etwa 700). */
export const ANFANG = 700;

/** Die eigene Zahl: Wertung, sonst stärkster besiegter Bot, sonst ANFANG. */
export function eigeneZahl(daten: Nutzerdaten): number {
  const wertung = eigeneWertung(daten);
  if (wertung) return wertung.wert;
  const besiegt = WERTUNGSTEMPI.flatMap((z) => daten.spiel.besiegt[z]);
  const zahlen = besiegt.map((b) => staerkeDesBots(b) ?? 0);
  return Math.max(ANFANG, ...zahlen);
}

/** Das Bündel eines Bot-Rings („ich-bots-4-5-einmal“ → „4-5“); null bei anderen Ringen. */
function buendelDesRings(ring: string): Botbuendel | null {
  return BOTBUENDEL.find((b) => ring.startsWith(`ich-bots-${b.kennung}`))?.kennung ?? null;
}

/**
 * Liegt ein vorgeschlagenes Ziel in Reichweite?
 * Beispiel: Wertung 900 → Bots bis 1200; Ring „ich-bots-4-5-einmal“ (leichtester Bot etwa 820)
 * ja, Ring „ich-bots-10“ (Engine ab etwa 2350) nein. Kapitel- und Themenziele immer ja.
 */
export function inReichweite(ziel: Ziel, grenze: number): boolean {
  if (ziel.art === "bot") return (staerkeDesBots(ziel.bot) ?? 0) <= grenze;
  if (ziel.art !== "ring") return true;
  const buendel = buendelDesRings(ziel.ring);
  if (!buendel) return true;
  const zahlen = botsDesBuendels(buendel).map((b) => staerkeDesBots(b) ?? 0);
  return zahlen.length === 0 || Math.min(...zahlen) <= grenze;
}
