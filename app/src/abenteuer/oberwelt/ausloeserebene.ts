/**
 * Auslöser der Karte: die Objekte der Ebene „ausloeser“ als Kachelkoordinaten lesen und finden,
 * was der Held gerade trifft (die eigene Kachel vor der Kachel davor).
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/szene.ts (Größengrenze), reine Logik ohne Szene
 * (getestet in ausloeserebene.test.ts). Statisten, Tiere und Möbel stehen zwar in derselben Ebene,
 * zählen hier aber nicht: Statisten meldet die Belebungsschicht, Tiere und Möbel gar nicht.
 * Abhängigkeiten: keine (die Tiled-Objekte kommen als einfache Daten).
 */

/** Ein Auslöser der Karte in Kachelkoordinaten. */
export interface Ausloeser {
  readonly name: string;
  readonly typ: "ausloeser" | "figur" | "statist";
  readonly x: number;
  readonly y: number;
}

/** Ein Objekt der Tiled-Ebene, so weit es hier gebraucht wird (Pixelkoordinaten). */
export interface Tiledobjekt {
  readonly name?: string;
  readonly type?: string;
  readonly x?: number;
  readonly y?: number;
}

/** Diese Typen der Objektebene sind keine Auslöser (Belebung und Möbel). */
const KEINE_AUSLOESER: readonly string[] = ["statist", "tier", "moebel"];

/**
 * Die Auslöser aus den Objekten der Ebene „ausloeser“. Beispiel: { name: "brett", x: 48, y: 32 }
 * bei Kachel 16 → { name: "brett", typ: "ausloeser", x: 3, y: 2 }; Typ „figur“ bleibt Figur.
 */
export function liesAusloeser(objekte: readonly Tiledobjekt[], kachel: number): Ausloeser[] {
  return objekte
    .filter((o) => typeof o.name === "string" && o.name.length > 0)
    .filter((o) => !KEINE_AUSLOESER.includes(o.type ?? ""))
    .map((o) => ({
      name: o.name ?? "",
      typ: o.type === "figur" ? ("figur" as const) : ("ausloeser" as const),
      x: Math.round((o.x ?? 0) / kachel),
      y: Math.round((o.y ?? 0) / kachel),
    }));
}

/** Versatz der Kachel vor dem Helden je Blickrichtung. */
const KACHEL_VOR: Readonly<Record<string, { readonly x: number; readonly y: number }>> = {
  oben: { x: 0, y: -1 },
  unten: { x: 0, y: 1 },
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 },
};

/**
 * Was der Held trifft: der Auslöser auf seiner Kachel, sonst der vor ihm (Gegenstände wie das
 * Brett sind Kollision, man steht davor und schaut sie an). `darauf` ist der auf seiner Kachel.
 * Beispiel: Held auf (3, 3) mit Blick nach oben, Brett auf (3, 2) → Treffer Brett, darauf null.
 */
export function triffAusloeser(
  alle: readonly Ausloeser[],
  held: { readonly x: number; readonly y: number; readonly richtung: string },
): { readonly treffer: Ausloeser | null; readonly darauf: Ausloeser | null } {
  const vorne = KACHEL_VOR[held.richtung] ?? { x: 0, y: 0 };
  const darauf = alle.find((a) => a.x === held.x && a.y === held.y) ?? null;
  const davor = alle.find((a) => a.x === held.x + vorne.x && a.y === held.y + vorne.y) ?? null;
  return { treffer: darauf ?? davor, darauf };
}
