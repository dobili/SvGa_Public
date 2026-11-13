/**
 * Auslöser der Karte: die Objekte der Ebene „ausloeser“ als Kachelkoordinaten lesen und finden,
 * was der Held gerade trifft (die eigene Kachel vor der Kachel davor).
 *
 * Rolle im Gesamtbild: Ausgelagert aus oberwelt/szene.ts (Größengrenze), reine Logik ohne Szene
 * (getestet in ausloeserebene.test.ts). Statisten, Tiere und Möbel stehen zwar in derselben Ebene,
 * zählen hier aber nicht: Statisten meldet die Belebungsschicht, Tiere und Möbel gar nicht.
 * Abhängigkeiten: keine (die Tiled-Objekte kommen als einfache Daten).
 *
 * Kartenwechsel (Wunsch des Autors, 11.11.2026, R060): Ein Übergang löst nicht mehr beim bloßen
 * Darüberlaufen aus. Der Held muss auf dem Feld stehen UND in den Durchgang gehen: in eine
 * Richtung, in der es dort nicht ins Freie weitergeht (Hauswand hinter der Tür, Kartenrand), oder
 * in die Richtung, die die Szene nennt (Eigenschaft `durchgang` am Auslöser, etwa „oben“ für eine
 * Treppe mitten im Raum). Beispiel: Auf dem Gehweg vor dem Waschsalon wechselt erst die Taste nach
 * oben die Karte; wer am Laden vorbeigeht, bleibt draußen.
 */
import { sitzrichtung } from "./sitzrichtung";
import type { Richtung } from "./szene";

/** Ein Auslöser der Karte in Kachelkoordinaten. */
export interface Ausloeser {
  readonly name: string;
  readonly typ: "ausloeser" | "figur" | "statist";
  readonly x: number;
  readonly y: number;
  /** Richtungen, in denen man von diesem Feld in den Durchgang geht (nur Auslöser). */
  readonly durchgang?: readonly string[];
  /** Blickrichtung einer sitzenden Figur (Eigenschaft `sitzt`, figurensitz.ts). */
  readonly sitzt?: Richtung;
}

/** Ein Objekt der Tiled-Ebene, so weit es hier gebraucht wird (Pixelkoordinaten). */
export interface Tiledobjekt {
  readonly name?: string;
  readonly type?: string;
  readonly x?: number;
  readonly y?: number;
  readonly properties?: readonly { readonly name?: string; readonly value?: unknown }[];
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
    .map((o) => {
      const angabe = o.properties?.find((e) => e.name === "durchgang")?.value;
      const sitzt =
        o.type === "figur"
          ? sitzrichtung(o.properties?.find((e) => e.name === "sitzt")?.value)
          : null;
      return {
        name: o.name ?? "",
        typ: o.type === "figur" ? ("figur" as const) : ("ausloeser" as const),
        x: Math.round((o.x ?? 0) / kachel),
        y: Math.round((o.y ?? 0) / kachel),
        // „oben“ oder „oben,links“: die Szene nennt den Durchgang selbst (Treppe mitten im Raum).
        ...(typeof angabe === "string" && angabe ? { durchgang: angabe.split(",") } : {}),
        ...(sitzt ? { sitzt } : {}),
      };
    });
}

/** Versatz der Kachel vor dem Helden je Blickrichtung. */
const KACHEL_VOR: Readonly<Record<string, { readonly x: number; readonly y: number }>> = {
  oben: { x: 0, y: -1 },
  unten: { x: 0, y: 1 },
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 },
};

/**
 * Ergänzt an jedem Übergang (Namen in `uebergaenge`) ohne eigene Angabe die Richtungen des Durchgangs: alle Richtungen, in
 * denen das Nachbarfeld fest gesperrt ist (Wand, Gebäude, Kartenrand; `frei` kennt keine Figuren
 * und Statisten, die weggehen können).
 * Sonderfall: Liegt der Auslöser frei im Raum, zählen die Richtungen zu den Nachbarfeldern
 * desselben Auslösers (man geht tiefer hinein); hat er auch die nicht, zählt jede Richtung, und
 * der Lauftest meldet ihn, damit die Szene `durchgang` nennt.
 * Beispiel: Türfeld (5, 9) mit Hauswand auf (5, 8) → durchgang [„oben“].
 */
export function mitDurchgang(
  alle: readonly Ausloeser[],
  frei: (x: number, y: number) => boolean,
  uebergaenge: readonly string[],
): Ausloeser[] {
  return alle.map((a) => {
    if (a.typ !== "ausloeser" || a.durchgang || !uebergaenge.includes(a.name)) return a;
    const richtungen = Object.entries(KACHEL_VOR);
    const wand = richtungen.filter(([, v]) => !frei(a.x + v.x, a.y + v.y)).map(([r]) => r);
    if (wand.length > 0) return { ...a, durchgang: wand };
    const gleich = (v: { readonly x: number; readonly y: number }) =>
      alle.some((b) => b.name === a.name && b.x === a.x + v.x && b.y === a.y + v.y);
    const hinein = richtungen.filter(([, v]) => gleich(v)).map(([r]) => r);
    return { ...a, durchgang: hinein.length > 0 ? hinein : richtungen.map(([r]) => r) };
  });
}

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
  /** Name des Auslösers, auf dem der Held ankam; solange er darauf steht, meldet die Szene nichts. */
  readonly sperre?: string;
}

/** Zustand direkt nach dem Betreten einer Karte oder dem Versetzen auf derselben Karte. */
export const MELDE_START: Meldezustand = { letzter: null, startOffen: true };

/** Eine Meldung an die Oberwelt: der Treffer, oder null, wenn der Held nichts mehr trifft. */
export type Meldung = {
  readonly name: string;
  readonly typ: Ausloeser["typ"];
  readonly darauf: boolean;
  /** Der Held steht darauf und geht in den Durchgang (nur dann wechselt ein Übergang die Karte). */
  readonly durch: boolean;
} | null;

/**
 * Ein Bild der Szene: Was meldet sie, wenn der Held jetzt so steht? Gemeldet wird nur bei
 * Änderung; „davor“, „darauf“ und „durch“ sind drei Zustände. „durch“ heißt: Der Held steht auf
 * dem Auslöser, eine Richtung ist gedrückt (`geht`), und sie führt in den Durchgang (siehe
 * Dateikopf). Der Auslöser, auf dem der Held ankommt, zählt erst nach dem Verlassen.
 * Ausgabe: der neue Zustand und `meldung` (fehlt, wenn nichts zu melden ist).
 * Beispiel: Held tritt von unten auf das Türfeld und drückt weiter nach oben → Meldung mit
 * darauf: true und durch: true; läuft er seitlich darüber, bleibt durch false.
 */
export function meldeschritt(
  zustand: Meldezustand,
  alle: readonly Ausloeser[],
  held: {
    readonly x: number;
    readonly y: number;
    readonly richtung: string;
    readonly geht?: boolean;
  },
): { readonly zustand: Meldezustand; readonly meldung?: Meldung } {
  const { treffer, darauf } = triffAusloeser(alle, held);
  // Ankunft auf einem Auslöser (enger Steg): Er schweigt, bis der Held ihn verlassen hat.
  const sperre = zustand.startOffen ? darauf?.name : zustand.sperre;
  if (sperre !== undefined && darauf?.name === sperre) {
    return { zustand: { letzter: `${sperre}|darauf`, startOffen: false, sperre } };
  }
  const durch =
    darauf !== null && held.geht === true && (darauf.durchgang ?? []).includes(held.richtung);
  const lage = treffer === darauf ? (durch ? "durch" : "darauf") : "davor";
  const name = treffer ? `${treffer.name}|${lage}` : null;
  if (name === zustand.letzter) return { zustand: { letzter: name, startOffen: false } };
  return {
    zustand: { letzter: name, startOffen: false },
    meldung: treffer
      ? { name: treffer.name, typ: treffer.typ, darauf: treffer === darauf, durch }
      : null,
  };
}
