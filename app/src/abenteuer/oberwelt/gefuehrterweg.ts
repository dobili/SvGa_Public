/**
 * Geführte Wege (Wunsch des Autors, 20.11.2026): Figuren, auch der Held, gehen einen Weg, den der
 * Dialog vorgibt, ohne dass der Spieler eingreift. Aus Ink gesteuert:
 *
 * - `#gehe:held>ambrose`: Der Held geht neben Ambrose und schaut ihn an.
 * - `#gehe:mutterAussen>haustuer`: Mama geht zum Auslöser „haustuer“ der Karte.
 * - `#gehe:held>3,21`: zu einem Feld (Kachelkoordinaten).
 * - Mehrere Wege in einer Zeile laufen zugleich; die Zeile wartet, bis alle angekommen sind.
 * - `#stelle:held>13,8>liegt`: sofort dorthin, liegend (etwa im Bett); `>steht` hebt das auf.
 *
 * Warum `>` und nicht `->`: Ink liest `->` auch in einem Tag als Sprung; die Übersetzung scheitert.
 * Rolle im Gesamtbild: reine Funktionen ohne Phaser für fuehrungsschicht.ts (Szene) und
 * useBuehne.ts (Dialog). Der Weg folgt den Kacheln (vier Richtungen, kürzester Weg), wie Statisten
 * und Tiere (belebungsbewegung.ts); Wände und Möbel kommen aus der Sperrkarte der Szene.
 * Abhängigkeiten: keine.
 */

/** Ein Feld in Kachelkoordinaten. */
export interface Feld {
  readonly x: number;
  readonly y: number;
}

/** Blickrichtung wie in der Szene. */
export type Blick = "oben" | "unten" | "links" | "rechts";

/** Wohin: ein Feld oder ein Name (Figur oder Auslöser der Karte). */
export type Wegziel = { readonly feld: Feld } | { readonly name: string };

/** Ein Weg aus einem `#gehe`-Tag. */
export interface Wegauftrag {
  readonly wer: string;
  readonly ziel: Wegziel;
}

/** Ein Versetzen aus einem `#stelle`-Tag. */
export interface Stellauftrag {
  readonly wer: string;
  readonly feld: Feld;
  readonly liegt: boolean;
}

/** Trenner zwischen Figur, Ziel und Haltung im Tag. */
const PFEIL = ">";
/** Trenner zwischen mehreren Wegen einer Zeile (tagsAus fügt doppelte `gehe` so zusammen). */
export const WEGTRENNER = ";";
const FELD = /^(\d+),(\d+)$/;
/** Höchstens so viele Felder besucht die Wegsuche (eine große Außenkarte hat gut 3000). */
const SUCHGRENZE = 8192;

/** Die vier Nachbarn in fester Reihenfolge (waagerecht zuerst, wie die Laufwege). */
const NACHBARN: readonly { readonly d: Feld; readonly blick: Blick }[] = [
  { d: { x: 1, y: 0 }, blick: "rechts" },
  { d: { x: -1, y: 0 }, blick: "links" },
  { d: { x: 0, y: 1 }, blick: "unten" },
  { d: { x: 0, y: -1 }, blick: "oben" },
];

/** Liest „3,21“ als Feld, sonst null. */
function feldAus(text: string): Feld | null {
  const treffer = FELD.exec(text.trim());
  return treffer ? { x: Number(treffer[1]), y: Number(treffer[2]) } : null;
}

/**
 * Die Wege eines `#gehe`-Werts. Beispiel: „held>ambrose;mutter>3,21“ → zwei Aufträge.
 * Sonderfall: Teile ohne `>` oder ohne Ziel werden übergangen.
 */
export function wegauftraege(wert: string | undefined): Wegauftrag[] {
  if (!wert) return [];
  return wert.split(WEGTRENNER).flatMap((teil) => {
    const [wer, ziel] = teil.split(PFEIL).map((s) => s.trim());
    if (!wer || !ziel) return [];
    const feld = feldAus(ziel);
    return [{ wer, ziel: feld ? { feld } : { name: ziel } }];
  });
}

/** Der Auftrag eines `#stelle`-Werts („held>13,8>liegt“), oder null. */
export function stellauftrag(wert: string | undefined): Stellauftrag | null {
  if (!wert) return null;
  const [wer, ziel, haltung] = wert.split(PFEIL).map((s) => s.trim());
  const feld = feldAus(ziel ?? "");
  if (!wer || !feld) return null;
  return { wer, feld, liegt: haltung === "liegt" };
}

/** Schlüssel eines Felds für Mengen. */
const schluessel = (f: Feld) => `${f.x},${f.y}`;

/**
 * Kürzester Weg in vier Richtungen vom Start zu einem der Ziele (Breitensuche). Ausgabe: die Felder
 * nach dem Start bis zum erreichten Ziel; [] wenn der Start schon ein Ziel ist; null ohne Weg.
 * Der Start selbst darf gesperrt sein (der Held steht im Bett); die Ziele müssen frei sein.
 */
export function wegZu(
  start: Feld,
  ziele: readonly Feld[],
  frei: (x: number, y: number) => boolean,
  grenze = SUCHGRENZE,
): Feld[] | null {
  const zielmenge = new Set(ziele.map(schluessel));
  if (zielmenge.has(schluessel(start))) return [];
  const vorher = new Map<string, Feld | null>([[schluessel(start), null]]);
  const schlange: Feld[] = [start];
  while (schlange.length > 0 && vorher.size < grenze) {
    const jetzt = schlange.shift() as Feld;
    for (const { d } of NACHBARN) {
      const n = { x: jetzt.x + d.x, y: jetzt.y + d.y };
      const k = schluessel(n);
      if (vorher.has(k) || !frei(n.x, n.y)) continue;
      vorher.set(k, jetzt);
      if (zielmenge.has(k)) return rueckweg(vorher, n);
      schlange.push(n);
    }
  }
  return null;
}

/** Der Weg vom Ziel zurück zum Start, umgedreht und ohne den Start. */
function rueckweg(vorher: ReadonlyMap<string, Feld | null>, ziel: Feld): Feld[] {
  const weg: Feld[] = [];
  let f: Feld | null = ziel;
  while (f && vorher.get(schluessel(f)) !== null) {
    weg.unshift(f);
    f = vorher.get(schluessel(f)) ?? null;
  }
  return weg;
}

/**
 * Felder, auf denen ein Weg zu `ziel` enden darf: neben einer Figur (sie steht selbst im Weg) die
 * freien Nachbarn; sonst das Feld selbst, wenn es frei ist, und andernfalls seine Nachbarn.
 */
export function endfelder(
  ziel: Feld,
  nebenan: boolean,
  frei: (x: number, y: number) => boolean,
): Feld[] {
  if (!nebenan && frei(ziel.x, ziel.y)) return [ziel];
  return NACHBARN.map(({ d }) => ({ x: ziel.x + d.x, y: ziel.y + d.y })).filter((f) =>
    frei(f.x, f.y),
  );
}

/** Blick von einem Feld auf ein anderes (waagerecht zuerst); gleiche Felder: null. */
export function blickZu(von: Feld, zu: Feld): Blick | null {
  const dx = zu.x - von.x;
  const dy = zu.y - von.y;
  if (dx === 0 && dy === 0) return null;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? "rechts" : "links";
  return dy > 0 ? "unten" : "oben";
}
