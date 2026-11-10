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

/** Was die Szene sich zwischen zwei Bildern über den letzten Treffer merkt. */
export interface Meldezustand {
  /** Zuletzt gemeldeter Treffer als „name|darauf“ oder „name|davor“, null ohne Treffer. */
  readonly letzter: string | null;
  /** Der Held steht noch auf dem Auslöser, über den er kam (zählt erst nach dem Verlassen). */
  readonly startOffen: boolean;
}

/** Zustand direkt nach dem Betreten einer Karte oder dem Versetzen auf derselben Karte. */
export const MELDE_START: Meldezustand = { letzter: null, startOffen: true };

/** Eine Meldung an die Oberwelt: der Treffer, oder null, wenn der Held nichts mehr trifft. */
export type Meldung = {
  readonly name: string;
  readonly typ: Ausloeser["typ"];
  readonly darauf: boolean;
} | null;

/**
 * Ein Bild der Szene: Was meldet sie, wenn der Held jetzt so steht? Gemeldet wird nur bei
 * Änderung; „davor“ und „darauf“ sind zwei Zustände, damit ein Übergang auslöst, wenn man von
 * vorn hineingeht (Befund des Autors, 10.11.2026: vom Dachboden kam man nicht herunter). Der
 * Auslöser, auf dem der Held ankommt, zählt erst nach dem Verlassen.
 * Ausgabe: der neue Zustand und `meldung` (fehlt, wenn nichts zu melden ist).
 * Beispiel: Held blickt auf die Luke (Meldung „davor“), tritt darauf → Meldung mit darauf: true.
 */
export function meldeschritt(
  zustand: Meldezustand,
  alle: readonly Ausloeser[],
  held: { readonly x: number; readonly y: number; readonly richtung: string },
): { readonly zustand: Meldezustand; readonly meldung?: Meldung } {
  const { treffer, darauf } = triffAusloeser(alle, held);
  const name = treffer ? `${treffer.name}|${treffer === darauf ? "darauf" : "davor"}` : null;
  if (name === zustand.letzter) return { zustand };
  if (zustand.startOffen && darauf) {
    return { zustand: { letzter: `${darauf.name}|darauf`, startOffen: false } };
  }
  return {
    zustand: { letzter: name, startOffen: false },
    meldung: treffer ? { name: treffer.name, typ: treffer.typ, darauf: treffer === darauf } : null,
  };
}
