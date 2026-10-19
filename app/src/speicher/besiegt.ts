/**
 * Bots, die der Leser schon in einer gewerteten Partie besiegt hat (seit 0.2.99).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (19.10.2026): Ein kleiner Stern am Porträt in der
 * Gegnerwahl zeigt, gegen wen man schon gewonnen hat. Die Liste steht im Spielstand
 * (speicher/partien.ts, „besiegt“), damit sie auch bleibt, wenn alte Partien aus der Liste der
 * höchstens 50 Partien fallen. Ältere Daten ohne Liste bekommen sie aus den gespeicherten Partien.
 * „Wertung zurücksetzen“ leert sie, weil danach alle bisherigen Partien als ungewertet gelten.
 * Abhängigkeiten: spiel/partie.ts.
 */
import type { Partie } from "../spiel/partie";

/** Höchstzahl der gemerkten Bots (vorgefertigte und eigene zusammen, großzügig). */
const MAX_BESIEGT = 200;

/**
 * Der Bot, den der Leser in dieser Partie besiegt hat, oder null: nur gewertete Partien gegen
 * die Engine mit gewähltem Bot, die der Leser gewonnen hat (Matt, Aufgabe oder Zeit des Bots).
 * Beispiel: gewertete Partie gegen „lotta“, Weiß gewinnt, der Leser spielt Weiß → "lotta".
 */
export function besiegterBot(partie: Partie): string | null {
  const e = partie.einstellung;
  if (!e.gewertet || e.gegner !== "engine" || !e.bot) return null;
  const ende = partie.ende;
  if (!ende || !("sieger" in ende) || ende.sieger !== e.eigeneFarbe) return null;
  return e.bot;
}

/** Die Liste mit dem Bot dieser Partie, falls der Leser ihn besiegt hat; sonst unverändert. */
export function mitBesiegtem(liste: readonly string[], partie: Partie): readonly string[] {
  const bot = besiegterBot(partie);
  if (!bot || liste.includes(bot)) return liste;
  return [...liste, bot].slice(-MAX_BESIEGT);
}

/**
 * Die Liste aus Rohdaten, ergänzt um die Siege in den gespeicherten Partien (für Daten von vor
 * 0.2.99, in denen es die Liste noch nicht gab). Unbekanntes fällt weg.
 */
export function besiegtAus(roh: unknown, partien: readonly Partie[]): readonly string[] {
  const gespeichert = Array.isArray(roh)
    ? roh.filter((k): k is string => typeof k === "string" && k.length > 0)
    : [];
  return partien.reduce(mitBesiegtem, [...new Set(gespeichert)].slice(-MAX_BESIEGT));
}
