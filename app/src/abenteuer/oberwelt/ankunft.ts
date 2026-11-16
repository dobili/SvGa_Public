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
 * Sonderfall „start“ (Reisen mit Monatskarte, Bus, Fähre): Der Held steht genau auf dem Start mit
 * dessen Blickrichtung (Befund der Funktionstests, 15.11.2026: In Cedar Creek landete er auf einem
 * Nachbarfeld hinter dem Wartehäuschen). Der Start ist kein Durchgang, also gibt es kein „davor“.
 */
import { liesAusloeser, type Ausloeser } from "./ausloeserebene";
import { begehbar, sperrkacheln, type Sperrangabe, type Tiledkarte } from "./begehbar";
import { geformtAusObjekt } from "./moebelform";

/** Ankunft in Kachelkoordinaten mit Blickrichtung. */
export interface Ankunft {
  readonly x: number;
  readonly y: number;
  readonly richtung: "oben" | "unten" | "links" | "rechts";
  /** true, wenn kein freies Feld daneben lag und der Held auf dem Auslöser selbst steht. */
  readonly aufAusloeser: boolean;
  /** true, wenn die Szene das Feld mit der Eigenschaft `ankunft` festlegt (Prüfung im Lauftest). */
  readonly festgelegt?: true;
}

const RICHTUNGEN: readonly Ankunft["richtung"][] = ["oben", "unten", "links", "rechts"];

/** Name des Einstiegs einer Karte (kein Übergang, löst nichts aus). */
const START = "start";

/** Abzug für ein verdecktes Feld: größer als jeder Platzwert, damit sichtbare Felder immer vorgehen. */
const VERDECKT_ABZUG = 10;

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
 * Felder, auf denen ein Möbelbild den Helden verdeckt (verdeckendesMoebel), kommen nur in Frage,
 * wenn sonst keins frei ist (Funktionstests 15.11.2026: Bus nach Cedar Creek, Held hinter dem
 * Wartehäuschen; Uhr in der Bahnhofshalle, Held hinter der Wartebank).
 * Sonderfall: Liegt nichts Freies daneben (enger Steg), bleibt es beim ersten Auslöserfeld mit
 * `aufAusloeser: true`; der Auslöser zählt dann wie bisher erst nach dem Verlassen.
 */
export function ankunftsort(
  karte: Tiledkarte,
  moebel: Readonly<Record<string, Sperrangabe>>,
  name: string,
  kachel: number,
): Ankunft | null {
  if (name === START) return aufDemStart(karte, kachel);
  const alle = liesAusloeser(
    karte.layers.flatMap((e) => e.objects ?? []),
    kachel,
  );
  const felder = alle.filter((a) => a.name === name && a.typ === "ausloeser");
  const erstes = felder[0];
  if (!erstes) return null;
  const fest = festeAnkunft(karte, name, felder);
  if (fest) return fest;
  const frei = begehbar(karte, sperrkacheln(karte, moebel, kachel));
  // „start“ ist nur der Einstieg in die Karte und löst nichts aus: Dort darf der Held ankommen.
  const belegt = new Set(alle.filter((a) => a.name !== START).map((a) => `${a.x},${a.y}`));
  let beste: Ankunft | null = null;
  let bestwert = Number.NEGATIVE_INFINITY;
  for (const f of felder) {
    for (const n of NACHBARN) {
      const x = f.x + n.x;
      const y = f.y + n.y;
      if (!frei(x, y) || belegt.has(`${x},${y}`)) continue;
      // Verdeckte Felder zählen weniger als jedes sichtbare (platz ist höchstens 9).
      const abzug = verdeckendesMoebel(karte, moebel, { x, y }, kachel) ? VERDECKT_ABZUG : 0;
      const wert = platz(frei, x, y) - abzug;
      if (wert > bestwert) {
        bestwert = wert;
        beste = { x, y, richtung: n.richtung, aufAusloeser: false };
      }
    }
  }
  return beste ?? { x: erstes.x, y: erstes.y, richtung: "unten", aufAusloeser: true };
}

/** Ein Feld als Text „x,y“ in Kachelkoordinaten, sonst null. Beispiel: „3,5“ → { x: 3, y: 5 }. */
function liesFeld(wert: unknown): { readonly x: number; readonly y: number } | null {
  if (typeof wert !== "string") return null;
  const teile = wert.split(",").map((t) => Number(t.trim()));
  const [x, y] = teile;
  if (teile.length !== 2 || x === undefined || y === undefined) return null;
  return Number.isInteger(x) && Number.isInteger(y) ? { x, y } : null;
}

/**
 * Blick vom nächsten Auslöserfeld weg (die größere Achse entscheidet), wenn die Szene keinen
 * `blick` nennt. Beispiel: Tür auf (5, 9), Ankunft (5, 7) → „oben“.
 */
function blickWeg(
  feld: { readonly x: number; readonly y: number },
  felder: readonly { readonly x: number; readonly y: number }[],
): Ankunft["richtung"] {
  const abstand = (f: { readonly x: number; readonly y: number }) =>
    Math.abs(f.x - feld.x) + Math.abs(f.y - feld.y);
  const naechstes = [...felder].sort((a, b) => abstand(a) - abstand(b))[0];
  const dx = feld.x - (naechstes?.x ?? feld.x);
  const dy = feld.y - (naechstes?.y ?? feld.y);
  if (dx === 0 && dy === 0) return "unten";
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? "rechts" : "links";
  return dy > 0 ? "unten" : "oben";
}

/**
 * Das feste Ankunftsfeld des Auslösers `name` (Eigenschaft `ankunft` an einem seiner Felder, mit
 * `blick`), oder null. Ob das Feld frei ist und auf keinem Auslöser liegt, prüfen der Lauftest
 * (uebergangslauf.test.ts mit ankunftsfehler) und pipeline/abenteuer/ankunftsfeld.py, nicht das Spiel.
 * Beispiel: Wohnzimmer, „haustuer“ mit ankunft „5,10“ und blick „oben“ → { x: 5, y: 10, richtung:
 * "oben", aufAusloeser: false, festgelegt: true }.
 */
function festeAnkunft(
  karte: Tiledkarte,
  name: string,
  felder: readonly { readonly x: number; readonly y: number }[],
): Ankunft | null {
  const objekte = karte.layers
    .flatMap((e) => e.objects ?? [])
    .filter((o) => o.name === name && o.type === "ausloeser");
  for (const o of objekte) {
    const wert = (n: string) => o.properties?.find((e) => e.name === n)?.value;
    const feld = liesFeld(wert("ankunft"));
    if (!feld) continue;
    const blick = RICHTUNGEN.find((r) => r === wert("blick")) ?? blickWeg(feld, felder);
    return { ...feld, richtung: blick, aufAusloeser: false, festgelegt: true };
  }
  return null;
}

/**
 * Die Ankunft genau auf dem Start der Karte mit seiner Eigenschaft `richtung` (sonst „unten“), oder
 * null ohne Start. Beispiel: Cedar Creek, start (34, 27) mit richtung „oben“ → { x: 34, y: 27,
 * richtung: "oben" }.
 */
function aufDemStart(karte: Tiledkarte, kachel: number): Ankunft | null {
  const objekt = karte.layers.flatMap((e) => e.objects ?? []).find((o) => o.name === START);
  if (!objekt) return null;
  const angabe = objekt.properties?.find((e) => e.name === "richtung")?.value;
  const richtung = RICHTUNGEN.find((r) => r === angabe) ?? "unten";
  return {
    x: Math.round((objekt.x ?? 0) / kachel),
    y: Math.round((objekt.y ?? 0) / kachel),
    richtung,
    aufAusloeser: false,
  };
}

/**
 * Das Möbel, dessen Bild den Helden auf diesem Feld verdeckt, oder null. Verdeckt ist er, wenn ein
 * Bild sein Feld oder das Feld darüber (Kopf) überdeckt und tiefer gezeichnet wird als er
 * (moebel.ts: Tiefe = Eigenschaft `tiefe` oder Mitte der untersten Kachelreihe; szene.ts: Held
 * mit der Tiefe seiner Kachelmitte). Durchsichtige Ränder kennt die Regel nicht, sie rechnet mit
 * dem ganzen Bildrechteck.
 * Beispiel: Wartehäuschen in Cedar Creek, 80 × 48 auf (32, 28) mit Tiefe 488: Ein Held auf (34, 28)
 * hat die Tiefe 456 und steht dahinter, auf (34, 27) (Tiefe 440) davor.
 */
export function verdeckendesMoebel(
  karte: Tiledkarte,
  moebel: Readonly<Record<string, Sperrangabe>>,
  feld: { readonly x: number; readonly y: number },
  kachel: number,
): string | null {
  const tiefe = (feld.y + 0.5) * kachel;
  const mitte = (feld.x + 0.5) * kachel;
  for (const o of karte.layers.flatMap((e) => e.objects ?? [])) {
    const roh = o.type === "moebel" && o.name ? moebel[o.name] : undefined;
    if (!roh) continue;
    const angabe = geformtAusObjekt(roh, o.properties);
    const x = o.x ?? 0;
    const y = o.y ?? 0;
    const eigen = o.properties?.find((e) => e.name === "tiefe")?.value;
    const bildtiefe = typeof eigen === "number" ? eigen : y + angabe.hoehe - kachel / 2;
    if (bildtiefe <= tiefe || mitte < x || mitte >= x + angabe.breite) continue;
    const hoehen = [tiefe, tiefe - kachel];
    if (hoehen.some((h) => h >= y && h < y + angabe.hoehe)) return o.name ?? null;
  }
  return null;
}

/**
 * Was an einer Ankunft nicht stimmt, oder null. Neben dem Durchgang war nichts frei (der Held
 * stünde auf dem Auslöser), oder ein festes Ankunftsfeld der Szene (Eigenschaft `ankunft`,
 * Karteneditor 1.4) ist gesperrt oder liegt auf einem Auslöser (der Held stünde gleich im nächsten
 * Übergang). „start“ zählt nicht als Auslöser, er löst nichts aus.
 * Beispiel: haustuer mit ankunft „5,12“ auf der Tür selbst → „festes Ankunftsfeld (5, 12) liegt
 * auf dem Auslöser haustuer“.
 */
export function ankunftsfehler(
  ankunft: Ankunft | null,
  alle: readonly Ausloeser[],
  frei: (x: number, y: number) => boolean,
): string | null {
  if (!ankunft) return null;
  if (ankunft.aufAusloeser) return "kein freies Feld neben dem Durchgang für die Ankunft";
  if (!ankunft.festgelegt) return null;
  const ort = `festes Ankunftsfeld (${ankunft.x}, ${ankunft.y})`;
  if (!frei(ankunft.x, ankunft.y)) return `${ort} ist gesperrt`;
  const darauf = alle.find(
    (a) => a.typ === "ausloeser" && a.name !== "start" && a.x === ankunft.x && a.y === ankunft.y,
  );
  return darauf ? `${ort} liegt auf dem Auslöser ${darauf.name}` : null;
}
