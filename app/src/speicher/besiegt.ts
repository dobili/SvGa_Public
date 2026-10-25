/**
 * Bots, die der Leser schon in einer gewerteten Partie besiegt hat, je Zeitklasse (seit 0.2.99;
 * seit 0.2.125 getrennt nach Blitz, Schnellschach und Klassisch, R51).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (19.10.2026): Ein kleiner Stern am Porträt in der
 * Gegnerwahl zeigt, gegen wen man schon gewonnen hat; seit R51 (23.10.2026) je Zeitklasse der
 * gewählten Bedenkzeit, weil die Wertung je Zeitklasse gilt. Die Listen stehen im Spielstand
 * (speicher/partien.ts, „besiegt“), damit sie auch bleiben, wenn alte Partien aus der Liste der
 * höchstens 50 Partien fallen. Ältere Daten ohne Listen bekommen sie aus den gespeicherten
 * Partien; eine alte einfache Liste (vor 0.2.125) zählt als Schnellschach (Partien ohne Uhr).
 * „Wertung zurücksetzen“ leert sie, weil danach alle bisherigen Partien als ungewertet gelten.
 * Abhängigkeiten: spiel/partie.ts, spiel/elomodell.ts (Zeitklasse).
 */
import { WERTUNGSTEMPI, wertungstempo, type Wertungstempo } from "../spiel/elomodell";
import type { Partie } from "../spiel/partie";

/** Je Zeitklasse die Kennungen der besiegten Bots. */
export type Besiegte = Readonly<Record<Wertungstempo, readonly string[]>>;

export const KEINE_BESIEGTEN: Besiegte = { blitz: [], rapid: [], classical: [] };

/** Höchstzahl der gemerkten Bots je Zeitklasse (vorgefertigte und eigene zusammen, großzügig). */
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

/**
 * Die Listen mit dem Bot dieser Partie in ihrer Zeitklasse, falls der Leser ihn besiegt hat;
 * sonst unverändert. Beispiel: Sieg gegen „mia“ mit 3 + 2 → blitz: ["mia"]; mit 30 + 20 →
 * classical: ["mia"] (Zeitklassen wie bei Lichess; Entscheidung des Autors, 24.10.2026).
 */
export function mitBesiegtem(liste: Besiegte, partie: Partie): Besiegte {
  const bot = besiegterBot(partie);
  if (!bot) return liste;
  const tempo = wertungstempo(partie.einstellung.uhr);
  if (liste[tempo].includes(bot)) return liste;
  return { ...liste, [tempo]: [...liste[tempo], bot].slice(-MAX_BESIEGT) };
}

function kennungen(roh: unknown): readonly string[] {
  return Array.isArray(roh)
    ? [...new Set(roh.filter((k): k is string => typeof k === "string" && k.length > 0))].slice(
        -MAX_BESIEGT,
      )
    : [];
}

/**
 * Die Listen aus Rohdaten, ergänzt um die Siege in den gespeicherten Partien (für Daten von vor
 * 0.2.99, in denen es die Liste noch nicht gab). Eine einfache Liste (vor 0.2.125) zählt als
 * Schnellschach, außer der Sieg steht noch in einer gespeicherten Partie: Dann gilt deren Uhr.
 * Unbekanntes fällt weg. Beispiel: alte Liste ["mia"], Sieg gegen Mia mit 3 + 2 gespeichert →
 * blitz: ["mia"], rapid: [].
 */
export function besiegtAus(roh: unknown, partien: readonly Partie[]): Besiegte {
  let gespeichert: Besiegte = KEINE_BESIEGTEN;
  if (Array.isArray(roh)) {
    // Alte einfache Liste: Bots, deren Sieg noch in einer gespeicherten Partie mit Uhr steht,
    // kommen in deren Zeitklasse (unten); nur die übrigen gelten als Schnellschach (seit 25.10.2026).
    const ausPartien = partien.reduce(mitBesiegtem, KEINE_BESIEGTEN);
    const rapid = kennungen(roh).filter((bot) => !irgendwoBesiegt(ausPartien, bot));
    gespeichert = { ...KEINE_BESIEGTEN, rapid };
  } else if (typeof roh === "object" && roh !== null) {
    const je = roh as Record<string, unknown>;
    gespeichert = {
      blitz: kennungen(je.blitz),
      rapid: kennungen(je.rapid),
      classical: kennungen(je.classical),
    };
  }
  return partien.reduce(mitBesiegtem, gespeichert);
}

/** In irgendeiner Zeitklasse besiegt? */
export function irgendwoBesiegt(liste: Besiegte, bot: string): boolean {
  return WERTUNGSTEMPI.some((tempo) => liste[tempo].includes(bot));
}

/**
 * Die Zeitklassen, in denen der Leser diesen Bot gewertet besiegt hat, in der festen Reihenfolge
 * Blitz, Schnellschach, Klassisch (seit 25.10.2026 je ein Zeichen am Porträt, Wunsch des Autors,
 * 25.10.2026). Beispiel: Mia in Blitz und Klassisch besiegt → ["blitz", "classical"].
 */
export function besiegtIn(liste: Besiegte, bot: string | null): Wertungstempo[] {
  if (!bot) return [];
  return WERTUNGSTEMPI.filter((tempo) => liste[tempo].includes(bot));
}

/** Besiegte Bots einer Zeitklasse im Verhältnis zu allen Bots der Auswahl. */
export interface Botsiege {
  readonly tempo: Wertungstempo;
  readonly erreicht: number;
  readonly gesamt: number;
}

/**
 * Je Zeitklasse, wie viele der übergebenen Bots (die vorgefertigten, auch die Spaß-Bots) schon
 * gewertet besiegt sind; eigene Gegner und die Gruppe zählen nicht, weil sie nicht in der
 * Auswahl stehen. Warum: Profil › Fortschritt zeigt seit 25.10.2026 je Zeitklasse einen Ring
 * (Wunsch des Autors, 25.10.2026). Beispiel: 72 Bots, Lotta und Mia in Blitz besiegt →
 * Blitz 2 von 72, Schnellschach 0 von 72, Klassisch 0 von 72.
 */
export function botsiegeJeTempo(liste: Besiegte, alleBots: readonly string[]): Botsiege[] {
  const bots = new Set(alleBots);
  return WERTUNGSTEMPI.map((tempo) => ({
    tempo,
    erreicht: new Set(liste[tempo].filter((bot) => bots.has(bot))).size,
    gesamt: bots.size,
  }));
}
