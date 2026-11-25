/**
 * Tiere am Boden im Weg (Befund des Autors, 25.11.2026: „Tiere laufen manchmal auf menschliche
 * Figuren drauf, als säßen sie auf dem Schoß der Person“): Kollision gegen Menschen, Verscheuchen
 * und Ausweichen, wenn der Held gegen ein Tier drängt.
 *
 * Warum: Tiere haben keinen Physikkörper (Leistung, Auftrag Runde 7) und liefen ihren Weg von
 * `von` nach `bis` blind; nur die Flucht fragte die Sperrkarte. Jetzt meiden sie Felder mit dem
 * Helden, Figuren, Statisten, anderen Tieren am Boden und mit Sitz- oder Liegestellen (Stuhl, Bank,
 * Bett). Weil sie damit selbst im Weg stehen können, gibt es „Verscheuchen“ (Aktionsknopf) und das
 * Ausweichen nach einer Sekunde Drängen: Ein Tier versperrt nie auf Dauer den Weg (Wunsch des Autors,
 * 10.11.2026, für alle Figuren).
 * Rolle im Gesamtbild: Reine Logik; belebungsbewegung.ts fragt `versperrt` im Schritt,
 * belebungsschicht.ts hält eine `Tierweg` mit den festen Feldern der Karte, Oberwelt.tsx zeigt den
 * Knopf (useVerscheuchen.ts).
 * Abhängigkeiten: belebung.ts (Typen), belebungsbewegung.ts (Bewegung, Umgebung).
 * Beispiel: Katze auf (4, 24), Held auf (4, 23) mit Blick nach unten → „Verscheuchen“; die Katze
 * läuft 2 bis 4 Felder nach unten oder zur Seite auf ein freies Feld.
 */
import type { Belebung, Feld } from "./belebung";
import type { Bewegung, Umgebung } from "./belebungsbewegung";
import type { Richtung } from "./szene";

/** Tempo eines verscheuchten Tiers in Kacheln je Sekunde (auch Tiere, die sonst nur sitzen). */
export const VERSCHEUCH_TEMPO = 4;
/** So weit läuft ein verscheuchtes Tier höchstens und mindestens (Kacheln); eng: ein Feld. */
const WEITE_HOECHSTENS = 4;
const WEITE_MINDESTENS = 2;
const WEITE_ENG = 1;
/** Findet ein Tier gar kein freies Feld, lässt es den Helden so lange durch (Sekunden). */
export const DURCHLASS_S = 3;
/** So lange drängt der Held gegen ein Tier, bis es von selbst ausweicht (Sekunden). */
export const DRAENGEN_S = 1;
/** Möbelarten, deren Felder Tiere nicht betreten (Sitz- und Liegestellen, sitzplatz.ts). */
const RUHEARTEN = ["stuhl", "bank", "sessel", "sofa", "hocker", "couch", "bett"];

const VOR: Readonly<Record<Richtung, Feld>> = {
  oben: { x: 0, y: -1 },
  unten: { x: 0, y: 1 },
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 },
};

/** Ein Tier am Boden? (Flieger sitzen auf Dach und Baum, Schwimmer im Wasser.) */
export function amBoden(v: Pick<Belebung, "typ" | "verhalten">): boolean {
  return v.typ === "tier" && v.verhalten !== "fliegen" && v.verhalten !== "schwimmen";
}

function schluessel(f: Feld): string {
  return `${f.x},${f.y}`;
}

/** Vorausblick in Kacheln: eine halbe Kachel und ein Hauch, damit Runden das nächste Feld trifft. */
const VORAUS = 0.51;

/** Das Feld, das ein gehendes Tier als Nächstes betritt (in Laufrichtung); null im Stehen. */
export function naechstesFeld(b: Bewegung): Feld | null {
  if (!b.ziel) return null;
  const vor = VOR[b.richtung];
  return { x: Math.round(b.x + vor.x * VORAUS), y: Math.round(b.y + vor.y * VORAUS) };
}

/** Muss dieses Tier warten, weil sein nächstes Feld belegt ist (Mensch, Tier, Sitz, Held)? */
export function versperrt(
  b: Bewegung,
  v: Pick<Belebung, "typ" | "verhalten">,
  u: Umgebung,
): boolean {
  if (!amBoden(v) || !u.belegt) return false;
  const feld = naechstesFeld(b);
  if (!feld) return false;
  const hier = { x: Math.round(b.x), y: Math.round(b.y) };
  return (feld.x !== hier.x || feld.y !== hier.y) && u.belegt(feld.x, feld.y);
}

/**
 * Ziel weg vom Helden, 2 bis 4 Felder: geradeaus weg, sonst zu den Seiten; jedes Feld des Wegs frei.
 * Die erste Weite kommt aus dem Zufall, dann wird kürzer gesucht; zuletzt ein Feld zur Seite oder
 * weg (eng zwischen Laterne, Zaun und Stühlen: der Hund vor der Veranda in Maple Falls). Kein Ziel
 * → null (dann lässt das Tier den Helden durch, `scheuche`).
 */
export function verscheuchziel(
  b: Pick<Bewegung, "x" | "y">,
  held: Feld,
  frei: (x: number, y: number) => boolean,
  zufall: () => number,
): Feld | null {
  const start = { x: Math.round(b.x), y: Math.round(b.y) };
  const dx = start.x - Math.round(held.x);
  const dy = start.y - Math.round(held.y);
  const weg =
    Math.abs(dx) >= Math.abs(dy)
      ? { x: Math.sign(dx) || 1, y: 0 }
      : { x: 0, y: Math.sign(dy) || 1 };
  const richtungen = [weg, { x: weg.y, y: weg.x }, { x: -weg.y, y: -weg.x }];
  const spanne = WEITE_HOECHSTENS - WEITE_MINDESTENS + 1;
  const erste = WEITE_MINDESTENS + Math.floor(zufall() * spanne);
  for (let i = 0; i < spanne; i++) {
    const weite = WEITE_MINDESTENS + ((erste - WEITE_MINDESTENS + spanne - i) % spanne);
    for (const r of richtungen) {
      let offen = true;
      for (let s = 1; s <= weite && offen; s++) offen = frei(start.x + r.x * s, start.y + r.y * s);
      if (offen) return { x: start.x + r.x * weite, y: start.y + r.y * weite };
    }
  }
  const eng = richtungen.find((r) => frei(start.x + r.x * WEITE_ENG, start.y + r.y * WEITE_ENG));
  return eng ? { x: start.x + eng.x * WEITE_ENG, y: start.y + eng.y * WEITE_ENG } : null;
}

/** Schickt das Tier zum Ziel weg vom Helden; false, wenn es keins gibt (dann bleibt es). */
export function scheuche(
  b: Bewegung,
  held: Feld,
  frei: (x: number, y: number) => boolean,
  zufall: () => number,
) {
  const ziel = verscheuchziel(b, held, frei, zufall);
  if (!ziel) return false;
  b.ziel = ziel;
  b.flieht = true;
  b.verscheucht = true;
  b.pause = 0;
  b.wartet = 0;
  return true;
}

/** Das Tier am Boden direkt vor dem Helden (auf der Kachel in Blickrichtung oder auf seiner). */
export function tierVor<T extends { readonly v: Belebung; readonly b: Bewegung }>(
  held: Feld,
  blick: Richtung,
  tiere: readonly T[],
): T | null {
  const h = { x: Math.round(held.x), y: Math.round(held.y) };
  const vor = { x: h.x + VOR[blick].x, y: h.y + VOR[blick].y };
  return (
    tiere.find((t) => {
      if (!amBoden(t.v)) return false;
      const f = { x: Math.round(t.b.x), y: Math.round(t.b.y) };
      return (f.x === vor.x && f.y === vor.y) || (f.x === h.x && f.y === h.y);
    }) ?? null
  );
}

/** Kacheln der Sitz- und Liegestellen und der Figuren einer Karte (für `belegt`). */
export function festeFelder(
  moebel: readonly {
    readonly x: number;
    readonly y: number;
    readonly angabe: { readonly breite: number; readonly hoehe: number; readonly art?: string };
  }[],
  figuren: readonly { readonly typ: string; readonly x: number; readonly y: number }[],
  kachel: number,
): Set<string> {
  const felder = new Set<string>();
  for (const m of moebel) {
    if (!RUHEARTEN.includes(m.angabe.art ?? "")) continue;
    for (let y = Math.floor(m.y / kachel); y * kachel < m.y + m.angabe.hoehe; y++) {
      for (let x = Math.floor(m.x / kachel); x * kachel < m.x + m.angabe.breite; x++)
        felder.add(`${x},${y}`);
    }
  }
  for (const f of figuren) if (f.typ === "figur") felder.add(schluessel(f));
  return felder;
}

/**
 * Die Tiere einer Szene im Weg: feste Felder der Karte, Drängen des Helden, Verscheuchen.
 * Hält den letzten Stand des Helden, damit der Aktionsknopf ohne eigene Rechnung fragen kann.
 */
export class Tierweg<T extends { readonly v: Belebung; readonly b: Bewegung }> {
  private feste = new Set<string>();
  private draengen = 0;
  private letzte: Umgebung | null = null;

  /** `darsteller`: die Statisten und Tiere der Szene (belebungsschicht.ts). */
  constructor(private readonly darsteller: () => readonly T[]) {}

  setzeFeste(felder: ReadonlySet<string>): void {
    this.feste = new Set(felder);
  }

  /** Belegte Felder für Tiere: Held, feste Felder, alle anderen Menschen und Tiere am Boden. */
  belegt(held: Feld): (x: number, y: number) => boolean {
    const besetzt = new Set(this.feste);
    besetzt.add(schluessel({ x: Math.round(held.x), y: Math.round(held.y) }));
    for (const d of this.darsteller()) {
      if (d.v.typ === "statist" || amBoden(d.v))
        besetzt.add(schluessel({ x: Math.round(d.b.x), y: Math.round(d.b.y) }));
    }
    return (x, y) => besetzt.has(`${x},${y}`);
  }

  /**
   * Nach jedem Bild: merkt den Helden; drängt er länger als DRAENGEN_S gegen ein Tier (er geht und
   * blickt auf dessen Feld), weicht es aus.
   */
  nachBild(u: Umgebung, dt: number): void {
    this.letzte = u;
    const tier = this.tierVorHeld();
    if (!tier || u.heldGeht !== true || tier.b.verscheucht) {
      this.draengen = 0;
      return;
    }
    this.draengen += dt;
    if (this.draengen < DRAENGEN_S) return;
    this.draengen = 0;
    scheuche(tier.b, u.held, u.frei, u.zufall);
  }

  /** Das Tier am Boden direkt vor dem Helden, nach dem letzten Bild; sonst null. */
  tierVorHeld(): T | null {
    const u = this.letzte;
    return u?.heldBlick ? tierVor(u.held, u.heldBlick, this.darsteller()) : null;
  }

  /** Verscheucht das Tier vor dem Helden (Aktionsknopf); false, wenn keins da ist oder kein Platz. */
  verscheuche(): boolean {
    const tier = this.tierVorHeld();
    const u = this.letzte;
    return tier !== null && u !== null && scheuche(tier.b, u.held, u.frei, u.zufall);
  }
}
