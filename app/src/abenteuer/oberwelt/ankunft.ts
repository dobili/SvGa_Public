/**
 * Wo der Held nach einem Übergang steht: auf dem ersten freien Feld VOR dem Durchgang, mit Blick
 * vom Durchgang weg (Befund des Autors, 10.11.2026: „Wenn ich wieder auf den Dachboden gehe,
 * stehe ich auf der Luke“).
 *
 * Rolle im Gesamtbild: reine Logik für oberwelt/kern.ts (Kartenwechsel) und den Lauftest
 * (uebergangslauf.test.ts). Früher kam der Held auf dem ersten Feld des Zielauslösers an.
 * Abhängigkeiten: ausloeserebene.ts (Auslöser lesen), begehbar.ts (Kollision der Karte).
 * Beispiel: Dachboden, Auslöser „treppe“ auf (1..2, 3..4): frei daneben sind (3, 3), (3, 4),
 * (1, 5), (2, 5) → der Held steht auf dem Feld mit dem meisten Platz ringsum und schaut von der
 * Luke weg.
 */
import { liesAusloeser } from "./ausloeserebene";
import { begehbar, sperrkacheln, type Sperrangabe, type Tiledkarte } from "./begehbar";

/** Ankunft in Kachelkoordinaten mit Blickrichtung. */
export interface Ankunft {
  readonly x: number;
  readonly y: number;
  readonly richtung: "oben" | "unten" | "links" | "rechts";
  /** true, wenn kein freies Feld daneben lag und der Held auf dem Auslöser selbst steht. */
  readonly aufAusloeser: boolean;
}

const NACHBARN = [
  { x: 0, y: -1, richtung: "oben" },
  { x: 0, y: 1, richtung: "unten" },
  { x: -1, y: 0, richtung: "links" },
  { x: 1, y: 0, richtung: "rechts" },
] as const;

/** Wie viel Platz um ein Feld ist: freie Felder im 3 × 3 ringsum (mehr ist besser). */
function platz(frei: (x: number, y: number) => boolean, x: number, y: number): number {
  let zahl = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) if (frei(x + dx, y + dy)) zahl++;
  }
  return zahl;
}

/**
 * Die Ankunft am Auslöser `name` einer Tiled-Karte, oder null, wenn die Karte ihn nicht hat.
 * Gewählt wird ein freies Nachbarfeld eines Auslöserfelds, auf dem selbst kein Auslöser liegt
 * (sonst stünde der Held gleich im nächsten Übergang); bei mehreren das mit dem meisten Platz,
 * bei Gleichstand das erste in der Reihenfolge der Karte. Der Blick zeigt vom Auslöser weg.
 * Sonderfall: Liegt nichts Freies daneben (enger Steg), bleibt es beim ersten Auslöserfeld mit
 * `aufAusloeser: true`; der Auslöser zählt dann wie bisher erst nach dem Verlassen.
 */
export function ankunftsort(
  karte: Tiledkarte,
  moebel: Readonly<Record<string, Sperrangabe>>,
  name: string,
  kachel: number,
): Ankunft | null {
  const alle = liesAusloeser(
    karte.layers.flatMap((e) => e.objects ?? []),
    kachel,
  );
  const felder = alle.filter((a) => a.name === name && a.typ === "ausloeser");
  const erstes = felder[0];
  if (!erstes) return null;
  const frei = begehbar(karte, sperrkacheln(karte, moebel, kachel));
  // „start“ ist nur der Einstieg in die Karte und löst nichts aus: Dort darf der Held ankommen.
  const belegt = new Set(alle.filter((a) => a.name !== "start").map((a) => `${a.x},${a.y}`));
  let beste: Ankunft | null = null;
  let bestwert = -1;
  for (const f of felder) {
    for (const n of NACHBARN) {
      const x = f.x + n.x;
      const y = f.y + n.y;
      if (!frei(x, y) || belegt.has(`${x},${y}`)) continue;
      const wert = platz(frei, x, y);
      if (wert > bestwert) {
        bestwert = wert;
        beste = { x, y, richtung: n.richtung, aufAusloeser: false };
      }
    }
  }
  return beste ?? { x: erstes.x, y: erstes.y, richtung: "unten", aufAusloeser: true };
}
