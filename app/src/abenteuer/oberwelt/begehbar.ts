/**
 * Begehbarkeit einer Tiled-Karte ohne Phaser: welche Kacheln sperren Wände, Möbel und Figuren?
 *
 * Rolle im Gesamtbild: Reine Logik für den Lauftest über alle Übergänge (uebergangslauf.ts). Die
 * Szene baut dieselbe Kollision mit Phaser auf (szene.ts: Kachelebenen mit der Eigenschaft
 * `kollision`; moebel.ts: `stelleMoebelAuf`; Figuren als feste Sprites). Wer dort die Regel
 * ändert, ändert sie hier mit, sonst prüft der Lauftest eine andere Karte als die gespielte.
 * Abhängigkeiten: keine (die Karte kommt als einfache Daten).
 * Beispiel: Eine Theke 48 × 32 auf (32, 48) sperrt die Kacheln (2..4, 4), ihre oberste Reihe
 * (2..4, 3) bleibt frei, weil man hinter hohen Möbeln durchgehen kann.
 */
import { feinsperrenAus, kachelnMitFeinsperre, moebelRechtecke } from "./feinsperren";
import { geformtAusObjekt } from "./moebelform";
import { istSitzmoebel } from "./sitzplatz";

/** Angabe eines Möbels aus daten/moebel.json, so weit die Kollision sie braucht. */
export interface Sperrangabe {
  readonly breite: number;
  readonly hoehe: number;
  readonly kollision?: boolean;
  readonly frei_unten?: number;
  readonly maske?: readonly string[];
  /** Feine Maske (Karteneditor 1.6, feinsperren.ts): je Kachel 4 × 4 Zellen, ersetzt `maske`. */
  readonly maske_fein?: readonly string[];
  /** Art im Möbelkatalog („stuhl“, „bank“ …): Auf Sitzmöbeln rücken Sitzende nach oben. */
  readonly art?: string;
}

interface Eigenschaft {
  readonly name?: string;
  readonly value?: unknown;
}

/** Eine Tiled-Karte, so weit die Begehbarkeit sie braucht. */
export interface Tiledkarte {
  readonly width: number;
  readonly height: number;
  /** Eigenschaften der Karte, darunter `sperren` und `freigeben` (Kollisionspinsel, „3,4;5,6“). */
  readonly properties?: readonly Eigenschaft[];
  readonly layers: readonly {
    readonly type?: string;
    readonly data?: readonly number[];
    readonly objects?: readonly {
      readonly name?: string;
      readonly type?: string;
      readonly x?: number;
      readonly y?: number;
      readonly properties?: readonly Eigenschaft[];
    }[];
  }[];
  readonly tilesets?: readonly {
    readonly firstgid: number;
    readonly tiles?: readonly {
      readonly id: number;
      readonly properties?: readonly Eigenschaft[];
    }[];
  }[];
}

export function hatKollision(
  eigenschaften: readonly Eigenschaft[] | undefined,
): boolean | undefined {
  const wert = eigenschaften?.find((e) => e.name === "kollision")?.value;
  return typeof wert === "boolean" ? wert : undefined;
}

/** Ein Statist, der an seinem Fleck bleibt (ohne Strecke oder `von` gleich `bis`). */
function stehtFest(o: { readonly type?: string; readonly properties?: readonly Eigenschaft[] }) {
  if (o.type !== "statist") return false;
  const wert = (n: string) => o.properties?.find((e) => e.name === n)?.value;
  return wert("von") === wert("bis");
}

/** Kachelnummern (GID) mit der Eigenschaft `kollision` aus den Kachelsätzen der Karte. */
export function sperrendeKacheln(karte: Tiledkarte): Set<number> {
  const gids = new Set<number>();
  for (const satz of karte.tilesets ?? []) {
    for (const k of satz.tiles ?? []) {
      if (hatKollision(k.properties)) gids.add(satz.firstgid + k.id);
    }
  }
  return gids;
}

/** Sperrt alle Kacheln, die das Rechteck in Pixeln berührt (wie sperrkarte.ts für die Tiere). */
function sperreRechteck(
  ziel: Set<string>,
  r: { readonly x: number; readonly y: number; readonly b: number; readonly h: number },
  kachel: number,
): void {
  for (let y = Math.floor(r.y / kachel); y * kachel < r.y + r.h; y++) {
    for (let x = Math.floor(r.x / kachel); x * kachel < r.x + r.b; x++) ziel.add(`${x},${y}`);
  }
}

/**
 * Die Fläche, die ein Möbel sperrt: eigene Maske, sonst alles unter der obersten Kachelreihe.
 * `raster`: Größe der Felder, die eingetragen werden (Vorgabe: die Kachel; 4 für die Zellen der
 * Kollision fein, mittenkacheln.ts).
 */
export function sperreMoebel(
  ziel: Set<string>,
  ort: { readonly x: number; readonly y: number },
  angabe: Sperrangabe,
  kachel: number,
  raster = kachel,
): void {
  if (angabe.maske_fein) {
    // Feine Maske: jede Zelle als kleines Rechteck, gesperrt ist jede berührte Kachel (feinsperren.ts).
    for (const r of moebelRechtecke(ort, angabe.maske_fein, kachel))
      sperreRechteck(ziel, r, raster);
    return;
  }
  if (angabe.maske) {
    angabe.maske.forEach((zeile, reihe) => {
      [...zeile].forEach((zeichen, spalte) => {
        if (zeichen !== "#") return;
        const x = ort.x + spalte * kachel;
        sperreRechteck(ziel, { x, y: ort.y + reihe * kachel, b: kachel, h: kachel }, raster);
      });
    });
    return;
  }
  const oben = angabe.hoehe > kachel ? kachel : 0;
  const hoehe = angabe.hoehe - oben - (angabe.frei_unten ?? 0) * kachel;
  if (hoehe <= 0) return;
  sperreRechteck(ziel, { x: ort.x, y: ort.y + oben, b: angabe.breite, h: hoehe }, raster);
}

/**
 * Die Kacheln über Sitzenden: Eine Figur oder ein Statist mit der Eigenschaft `sitzt` auf einem
 * Sitzmöbel sperrt auch die Kachel über sich.
 *
 * Warum: In der Szene rückt das Bild einer Sitzenden auf ihr Möbel, meist nach oben, und ihr
 * fester Körper reicht dann bis zu einer Kachel hinauf (sitzplatz.ts, sitzsperre; figurensitz.ts).
 * Der Held ist 12 Pixel hoch: Ab drei Pixeln kommt er nicht mehr mittig auf die Kachel darüber.
 * Um wie viel das Bild rückt, hängt vom Bild des Möbels und vom Bogen der Figur ab; beides kennt
 * diese Rechnung nicht. Sie nimmt deshalb den häufigen Fall an (nach oben) und rechnet lieber eine
 * Kachel zu viel als zu wenig; wer am Boden sitzt (Lily auf dem Bordstein), sperrt nichts dazu.
 * Dieselbe Regel in pipeline/abenteuer/figurensperre.py (`sitzkacheln`).
 * Beispiel: Sam sitzt auf (5, 8) auf dem Schulstuhl → auch (5, 7) ist gesperrt.
 */
export function sitzkacheln(
  karte: Tiledkarte,
  moebel: Readonly<Record<string, Sperrangabe>>,
  kachel: number,
): string[] {
  const objekte = karte.layers.flatMap((e) => e.objects ?? []);
  const sitze = objekte.flatMap((o) => {
    const roh = o.type === "moebel" && o.name ? moebel[o.name] : undefined;
    if (!roh || !o.name || !istSitzmoebel(o.name, roh.art)) return [];
    const form = geformtAusObjekt(roh, o.properties);
    return [{ x: o.x ?? 0, y: o.y ?? 0, b: form.breite, h: form.hoehe }];
  });
  return objekte.flatMap((o) => {
    const sitzt = o.properties?.some((e) => e.name === "sitzt" && typeof e.value === "string");
    if (!sitzt || !(o.type === "figur" || o.type === "statist")) return [];
    // Mitte der Fußkachel, wie findeSitz in sitzplatz.ts.
    const mx = Math.floor((o.x ?? 0) / kachel) * kachel + kachel / 2;
    const my = Math.floor((o.y ?? 0) / kachel) * kachel + kachel / 2;
    const aufSitz = sitze.some((r) => mx >= r.x && mx < r.x + r.b && my >= r.y && my < r.y + r.h);
    return aufSitz ? [`${Math.floor(mx / kachel)},${Math.floor(my / kachel) - 1}`] : [];
  });
}

/** Kacheln einer Karteneigenschaft im Format „3,4;5,6“ (pipeline/abenteuer/kollisionspinsel.py). */
export function pinselkacheln(karte: Tiledkarte, name: "sperren" | "freigeben"): string[] {
  const wert = karte.properties?.find((e) => e.name === name)?.value;
  if (typeof wert !== "string" || !wert) return [];
  return wert.split(";").filter((k) => /^-?\d+,-?\d+$/.test(k));
}

/**
 * Alle gesperrten Kacheln einer Karte als „x,y“: Kachelebenen mit Kollision, Möbel mit Kollision
 * (Angabe aus der Möbelliste, am Objekt überschreibbar), die Figuren und Statisten, die an einem
 * Fleck stehen (`von` gleich `bis`; belebungsschicht.ts sperrt sie im Stehen). Wandernde Statisten
 * und Tiere sperren hier nicht: Sie geben den Weg wieder frei. Sitzende auf einem Sitzmöbel sperren
 * auch die Kachel über sich (`sitzkacheln`).
 * Kollisionspinsel (Karteneditor 1.3, Wunsch des Autors, 16.11.2026): Die Eigenschaft `sperren` der
 * Karte sperrt Kacheln dazu, `freigeben` gibt Wände und Möbel frei, nicht aber Figuren. Der Kartenbau
 * schreibt beides auch in Ebenen und Masken, damit Phaser (szene.ts, moebel.ts) gleich sperrt.
 * Sonderfall: Möbel, die die Liste nicht kennt, sperren nicht (die App zeichnet sie auch nicht).
 * Mit `mitFiguren` false zählen nur Wände und Möbel (für den Durchgang eines Übergangs, R060).
 */
export function sperrkacheln(
  karte: Tiledkarte,
  moebel: Readonly<Record<string, Sperrangabe>>,
  kachel: number,
  mitFiguren = true,
): Set<string> {
  const gesperrt = new Set<string>();
  const figuren = new Set<string>();
  const gids = sperrendeKacheln(karte);
  for (const ebene of karte.layers) {
    (ebene.data ?? []).forEach((gid, i) => {
      if (gids.has(gid)) gesperrt.add(`${i % karte.width},${Math.floor(i / karte.width)}`);
    });
    for (const o of ebene.objects ?? []) {
      const ort = { x: o.x ?? 0, y: o.y ?? 0 };
      if (mitFiguren && (o.type === "figur" || stehtFest(o))) {
        sperreRechteck(figuren, { ...ort, b: kachel, h: kachel }, kachel);
      }
      const roh = o.type === "moebel" && o.name ? moebel[o.name] : undefined;
      if (!roh || !(hatKollision(o.properties) ?? roh.kollision)) continue;
      sperreMoebel(gesperrt, ort, geformtAusObjekt(roh, o.properties), kachel);
    }
  }
  for (const k of pinselkacheln(karte, "sperren")) gesperrt.add(k);
  for (const k of pinselkacheln(karte, "freigeben")) gesperrt.delete(k);
  // Kollision fein (Karteneditor 1.6): Eine Kachel mit einer gesperrten Zelle ist gesperrt, weil der
  // Held mittig auf ihr (Pixel 2 bis 14) die Zelle berührte (feinsperren.ts).
  for (const k of kachelnMitFeinsperre(feinsperrenAus(karte.properties))) gesperrt.add(k);
  for (const k of figuren) gesperrt.add(k);
  if (mitFiguren) for (const k of sitzkacheln(karte, moebel, kachel)) gesperrt.add(k);
  return gesperrt;
}

/** Abfrage „ist diese Kachel frei?“ zu einer Karte; außerhalb der Karte ist nichts frei. */
export function begehbar(
  karte: Tiledkarte,
  gesperrt: ReadonlySet<string>,
): (x: number, y: number) => boolean {
  return (x, y) =>
    x >= 0 && y >= 0 && x < karte.width && y < karte.height && !gesperrt.has(`${x},${y}`);
}

/** „12,7“ → { x: 12, y: 7 }; null bei fehlender oder kaputter Angabe. */
function feldAus(wert: unknown): { readonly x: number; readonly y: number } | null {
  if (typeof wert !== "string") return null;
  const [x, y] = wert.split(",").map(Number);
  return x !== undefined && y !== undefined && Number.isFinite(x) && Number.isFinite(y)
    ? { x, y }
    : null;
}

/** Laufweg eines Statisten oder Tiers: sein Feld und alle Kacheln, auf denen es je stehen kann. */
export interface Laufweg {
  readonly name: string;
  readonly start: { readonly x: number; readonly y: number };
  readonly felder: readonly { readonly x: number; readonly y: number }[];
}

/**
 * Die Laufwege aller Statisten und Tiere, die den Helden aufhalten können (Wunsch des Autors,
 * 10.11.2026: „Eine Figur darf nie den Weg auf Dauer versperren“). Ein Laufweg ist das Feld des
 * Objekts und der Weg zwischen `von` und `bis`, erst waagerecht, dann senkrecht, in beiden
 * Richtungen (belebungsbewegung.ts). Fliegende Tiere sperren nie, schwimmende liegen im Wasser,
 * folgende halten den Helden nicht auf (haeltAuf); sie fehlen hier. Figuren stehen schon in `sperrkacheln`.
 * Beispiel: Statist von 3,5 bis 6,7 → (3..6, 5), (6, 5..7), (3..6, 7), (3, 5..7).
 */
export function laufwege(karte: Tiledkarte, kachel: number): Laufweg[] {
  const wege: Laufweg[] = [];
  for (const o of karte.layers.flatMap((e) => e.objects ?? [])) {
    if (o.type !== "statist" && o.type !== "tier") continue;
    const wert = (n: string) => o.properties?.find((e) => e.name === n)?.value;
    const frei = ["fliegen", "schwimmen", "folgen"].includes(String(wert("verhalten")));
    if (o.type === "tier" && frei) continue;
    const start = { x: Math.round((o.x ?? 0) / kachel), y: Math.round((o.y ?? 0) / kachel) };
    const von = feldAus(wert("von")) ?? start;
    const bis = feldAus(wert("bis")) ?? start;
    const felder = new Map<string, { x: number; y: number }>([[`${start.x},${start.y}`, start]]);
    const merke = (x: number, y: number) => felder.set(`${x},${y}`, { x, y });
    for (let x = Math.min(von.x, bis.x); x <= Math.max(von.x, bis.x); x++) {
      merke(x, von.y);
      merke(x, bis.y);
    }
    for (let y = Math.min(von.y, bis.y); y <= Math.max(von.y, bis.y); y++) {
      merke(von.x, y);
      merke(bis.x, y);
    }
    wege.push({ name: o.name ?? "", start, felder: [...felder.values()] });
  }
  return wege;
}
