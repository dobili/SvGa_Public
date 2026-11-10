/**
 * Bewegung von Statisten und Tieren: einfache Schritte in Kacheln, ohne Physik (Leistung auf dem
 * Handy, Auftrag Runde 7: „ohne Physik für Tiere und nur Bewegung im Sichtbereich“).
 *
 * Rolle im Gesamtbild: Reine Logik für belebungsschicht.ts (getestet in belebungsbewegung.test.ts).
 * Jeder Statist und jedes Tier hat einen Zustand `Bewegung`; `schritt` rückt ihn um eine Zeitspanne
 * weiter. Laufwege gehen erst waagerecht, dann senkrecht (wie auf einem Brett). Regeln: Dokument 16,
 * Abschnitt 5.1 (Verhalten der Tiere) und Auftrag Runde 7 (Statisten laufen zwischen von und bis
 * mit Pausen).
 * Beispiel: Eine Taube mit „ausweichen“ läuft langsam zwischen von und bis; kommt der Held näher als
 * drei Kacheln, läuft sie zwei Kacheln von ihm weg, wenn dort frei ist.
 */
import type { Richtung } from "./szene";
import type { Belebung, Feld, Tierverhalten } from "./belebung";

/** Zustand eines bewegten Statisten oder Tiers; Kachelkoordinaten, die Mitte ist ganzzahlig. */
export interface Bewegung {
  x: number;
  y: number;
  richtung: Richtung;
  /** Wohin es gerade geht; null steht. */
  ziel: Feld | null;
  /** Sekunden bis zum nächsten Ziel. */
  pause: number;
  /** Nächstes Ziel des Laufwegs ist `bis` (sonst `von`). */
  zumBis: boolean;
  /** Läuft gerade vor dem Helden weg (oder fliegt auf). */
  flieht: boolean;
  /** Kacheln, die ein folgendes Tier dem Helden schon nachgelaufen ist. */
  gefolgt: number;
  /** Sekunden, die ein Statist schon wartet, weil der Held ihm im Weg steht. */
  wartet: number;
}

/** Was ein Schritt von der Welt wissen muss. */
export interface Umgebung {
  /** Position des Helden in Kacheln. */
  readonly held: Feld;
  /** Ist diese Kachel begehbar (keine Wand, kein Möbel, in der Karte)? */
  readonly frei: (x: number, y: number) => boolean;
  /** Zufallszahl in [0, 1). */
  readonly zufall: () => number;
}

/** Werte eines Verhaltens: Tempo in Kacheln je Sekunde, Pausen in Sekunden, Scheu in Kacheln. */
interface Gangart {
  readonly tempo: number;
  readonly pause: readonly [number, number];
  /** Näher als so viele Kacheln: weglaufen (0: nie). */
  readonly scheu: number;
  /** So weit läuft es weg, mit diesem Tempo. */
  readonly flucht: number;
  readonly fluchttempo: number;
}

const STEHT: Gangart = { tempo: 0, pause: [3, 8], scheu: 0, flucht: 0, fluchttempo: 0 };
const GANGARTEN: Readonly<Record<Tierverhalten | "statist", Gangart>> = {
  statist: { tempo: 1.5, pause: [2, 6], scheu: 0, flucht: 0, fluchttempo: 0 },
  sitzen: STEHT,
  schlafen: STEHT,
  ausweichen: { tempo: 0.8, pause: [2, 5], scheu: 3, flucht: 2, fluchttempo: 2.5 },
  flitzen: { tempo: 1.5, pause: [1, 4], scheu: 3, flucht: 5, fluchttempo: 6 },
  fliegen: { tempo: 3, pause: [3, 7], scheu: 2, flucht: 0, fluchttempo: 5 },
  folgen: { tempo: 2, pause: [2, 5], scheu: 0, flucht: 0, fluchttempo: 0 },
  rennen: { tempo: 2.5, pause: [4, 8], scheu: 0, flucht: 0, fluchttempo: 0 },
  schwimmen: { tempo: 0.6, pause: [1, 3], scheu: 0, flucht: 0, fluchttempo: 0 },
};

/** Folgen: ab dieser Nähe nachlaufen, höchstens so weit, und erst wieder nach so viel Abstand. */
const FOLGEN_AB = 4;
const FOLGEN_HOECHSTENS = 6;
const FOLGEN_NEU_AB = 8;
/** Näher als so nah kommt ein folgendes Tier nicht heran (Kacheln). */
const FOLGEN_ABSTAND = 1.2;
/** Unter diesem Abstand gilt ein Ziel als erreicht. */
const ANGEKOMMEN = 0.02;

/** Die Gangart eines Statisten oder Tiers. */
export function gangartVon(b: Pick<Belebung, "typ" | "verhalten">): Gangart {
  return b.typ === "statist" ? GANGARTEN.statist : GANGARTEN[b.verhalten];
}

/** Anfangszustand auf dem eigenen Feld (verschoben um den Versatz in einer Schar). */
export function neueBewegung(feld: Feld): Bewegung {
  return {
    ...feld,
    richtung: "unten",
    ziel: null,
    pause: 0,
    zumBis: true,
    flieht: false,
    gefolgt: 0,
    wartet: 0,
  };
}

function abstand(a: Feld, b: Feld): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function zufallspause(g: Gangart, zufall: () => number): number {
  return g.pause[0] + zufall() * (g.pause[1] - g.pause[0]);
}

/**
 * Ein Fluchtziel weg vom Helden: zuerst geradeaus weg, dann quer dazu; nur freie Kacheln (auch die
 * halbe Strecke). Kein freies Ziel → null (das Tier bleibt, es läuft nicht durch Wände).
 */
export function fluchtziel(b: Bewegung, weite: number, u: Umgebung): Feld | null {
  const start = { x: Math.round(b.x), y: Math.round(b.y) };
  const dx = start.x - u.held.x;
  const dy = start.y - u.held.y;
  const weg =
    Math.abs(dx) >= Math.abs(dy)
      ? { x: Math.sign(dx) || 1, y: 0 }
      : { x: 0, y: Math.sign(dy) || 1 };
  const richtungen = [weg, { x: weg.y, y: weg.x }, { x: -weg.y, y: -weg.x }];
  for (const r of richtungen) {
    const ziel = { x: start.x + r.x * weite, y: start.y + r.y * weite };
    const mitte = {
      x: start.x + r.x * Math.ceil(weite / 2),
      y: start.y + r.y * Math.ceil(weite / 2),
    };
    if (u.frei(ziel.x, ziel.y) && u.frei(mitte.x, mitte.y)) return ziel;
  }
  return null;
}

/** Versatz der nächsten Kachel je Blickrichtung. */
const VOR: Readonly<Record<Richtung, Feld>> = {
  oben: { x: 0, y: -1 },
  unten: { x: 0, y: 1 },
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 },
};
/** Steht der Held näher als so viele Kacheln vor einem Statisten, wartet dieser. */
const IM_WEG = 0.9;
/** So viele Sekunden wartet ein Statist vor dem Helden, dann kehrt er um. */
const WARTEN_HOECHSTENS = 1.5;
/** Winziger Schritt in Kacheln, mit dem sich ein Statist beim Umkehren zum neuen Ziel dreht. */
const UMDREHEN = 0.01;

/** Steht der Held direkt vor dem Statisten in Laufrichtung? Dann wartet der Statist. */
function heldImWeg(b: Bewegung, u: Umgebung): boolean {
  const vor = VOR[b.richtung];
  return (
    abstand({ x: b.x + vor.x, y: b.y + vor.y }, u.held) < IM_WEG || abstand(b, u.held) < IM_WEG
  );
}

/** Rückt auf das Ziel zu, erst waagerecht, dann senkrecht; true, wenn es angekommen ist. */
function geheZu(b: Bewegung, ziel: Feld, weite: number): boolean {
  const achse = Math.abs(ziel.x - b.x) > ANGEKOMMEN ? "x" : "y";
  const rest = ziel[achse] - b[achse];
  const schritt = Math.sign(rest) * Math.min(Math.abs(rest), weite);
  b[achse] += schritt;
  if (schritt !== 0) {
    if (achse === "x") b.richtung = schritt > 0 ? "rechts" : "links";
    else b.richtung = schritt > 0 ? "unten" : "oben";
  }
  return abstand(b, ziel) <= ANGEKOMMEN;
}

/** Das nächste Ziel des Laufwegs (von ↔ bis); null, wenn von und bis dasselbe Feld sind. */
function naechstesWegziel(b: Bewegung, von: Feld, bis: Feld): Feld | null {
  if (von.x === bis.x && von.y === bis.y) return null;
  const ziel = b.zumBis ? bis : von;
  b.zumBis = !b.zumBis;
  return ziel;
}

/** Folgen (Hund, Katze): nachlaufen, wenn der Held nah ist, aber nur ein paar Kacheln. */
function folge(b: Bewegung, u: Umgebung): void {
  const weit = abstand(b, u.held);
  if (weit > FOLGEN_NEU_AB) b.gefolgt = 0;
  const soll = weit < FOLGEN_AB && weit > FOLGEN_ABSTAND && b.gefolgt < FOLGEN_HOECHSTENS;
  b.ziel = soll ? { x: Math.round(u.held.x), y: Math.round(u.held.y) } : null;
}

/** Scheu: Kommt der Held zu nah, wegfliegen (fliegen) oder weglaufen (ausweichen, flitzen). */
function scheue(b: Bewegung, v: Belebung, g: Gangart, u: Umgebung): void {
  if (g.scheu === 0 || b.flieht || abstand(b, u.held) >= g.scheu) return;
  const ziel =
    v.verhalten === "fliegen" ? naechstesWegziel(b, v.von, v.bis) : fluchtziel(b, g.flucht, u);
  if (!ziel) return;
  b.ziel = ziel;
  b.flieht = true;
  b.pause = 0;
}

/**
 * Rückt einen Statisten oder ein Tier um `dt` Sekunden weiter (ändert `b`). `v` liefert Laufweg
 * und Verhalten; der Laufweg einer Schar ist schon um den Versatz verschoben.
 * Sonderfälle: sitzen und schlafen bleiben stehen; fliegen kümmert sich nicht um Wände.
 */
export function schritt(b: Bewegung, v: Belebung, dt: number, u: Umgebung): void {
  const g = gangartVon(v);
  if (v.typ === "tier" && v.verhalten === "folgen") folge(b, u);
  else scheue(b, v, g, u);
  if (!b.ziel) {
    b.pause -= dt;
    if (b.pause > 0 || g.tempo === 0) return;
    b.ziel =
      v.typ === "tier" && v.verhalten === "folgen" ? null : naechstesWegziel(b, v.von, v.bis);
    if (!b.ziel) b.pause = zufallspause(g, u.zufall);
    return;
  }
  // Statisten laufen nicht in den Helden hinein; sie warten kurz, ob er Platz macht, und kehren
  // dann um. Sonst stünden sich beide in einem engen Gang für immer gegenüber (Wunsch des Autors,
  // 10.11.2026: Eine Figur darf nie den Weg auf Dauer versperren).
  if (v.typ === "statist" && heldImWeg(b, u)) {
    b.wartet += dt;
    if (b.wartet >= WARTEN_HOECHSTENS) {
      b.wartet = 0;
      b.ziel = naechstesWegziel(b, v.von, v.bis);
      // Gleich umdrehen: Mit dem alten Blick stünde der Held weiter „im Weg“.
      if (b.ziel) geheZu(b, b.ziel, UMDREHEN);
    }
    return;
  }
  b.wartet = 0;
  const vorher = { x: b.x, y: b.y };
  const angekommen = geheZu(b, b.ziel, (b.flieht ? g.fluchttempo : g.tempo) * dt);
  if (v.verhalten === "folgen") b.gefolgt += abstand(vorher, b);
  if (!angekommen) return;
  b.ziel = null;
  b.flieht = false;
  b.pause = zufallspause(g, u.zufall);
}

/** Steht der Statist oder das Tier gerade (für Standbild und Sperre)? */
export function steht(b: Bewegung): boolean {
  return b.ziel === null;
}

/**
 * Hält dieser Statist oder dieses Tier den Helden auf (Wunsch des Autors, 10.11.2026: Der Held
 * soll nicht durch Figuren und Tiere laufen)? Statisten immer, Tiere am Boden auch. Ausnahmen:
 * fliegende Tiere (über Kopfhöhe), schwimmende (im Wasser, dort läuft niemand) und folgende
 * (ein Hund, der dem Helden in eine Sackgasse nachläuft, sperrte ihn sonst ein).
 */
export function haeltAuf(v: Belebung): boolean {
  if (v.typ === "statist") return true;
  return !["fliegen", "schwimmen", "folgen"].includes(v.verhalten);
}

/**
 * Ist die Sperre auf Kachel (x, y) gerade an? Nur, wenn der Held sie nicht berührt: Eine Sperre,
 * die auf dem Helden einschaltet, schöbe ihn weg oder hielte ihn fest. Held in Kacheln (Mitte
 * ganzzahlig); die Flächen überlappen, wenn beide Abstände unter einer Kachel liegen.
 */
export function sperreAn(held: Feld, x: number, y: number): boolean {
  return Math.max(Math.abs(held.x - x), Math.abs(held.y - y)) >= 1;
}
