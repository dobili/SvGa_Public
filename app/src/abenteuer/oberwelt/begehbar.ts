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

/** Angabe eines Möbels aus daten/moebel.json, so weit die Kollision sie braucht. */
export interface Sperrangabe {
  readonly breite: number;
  readonly hoehe: number;
  readonly kollision?: boolean;
  readonly frei_unten?: number;
  readonly maske?: readonly string[];
}

interface Eigenschaft {
  readonly name?: string;
  readonly value?: unknown;
}

/** Eine Tiled-Karte, so weit die Begehbarkeit sie braucht. */
export interface Tiledkarte {
  readonly width: number;
  readonly height: number;
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

function hatKollision(eigenschaften: readonly Eigenschaft[] | undefined): boolean | undefined {
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
function sperrendeKacheln(karte: Tiledkarte): Set<number> {
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

/** Die Fläche, die ein Möbel sperrt: eigene Maske, sonst alles unter der obersten Kachelreihe. */
function sperreMoebel(
  ziel: Set<string>,
  ort: { readonly x: number; readonly y: number },
  angabe: Sperrangabe,
  kachel: number,
): void {
  if (angabe.maske) {
    angabe.maske.forEach((zeile, reihe) => {
      [...zeile].forEach((zeichen, spalte) => {
        if (zeichen !== "#") return;
        const x = ort.x + spalte * kachel;
        sperreRechteck(ziel, { x, y: ort.y + reihe * kachel, b: kachel, h: kachel }, kachel);
      });
    });
    return;
  }
  const oben = angabe.hoehe > kachel ? kachel : 0;
  const hoehe = angabe.hoehe - oben - (angabe.frei_unten ?? 0) * kachel;
  if (hoehe <= 0) return;
  sperreRechteck(ziel, { x: ort.x, y: ort.y + oben, b: angabe.breite, h: hoehe }, kachel);
}

/**
 * Alle gesperrten Kacheln einer Karte als „x,y“: Kachelebenen mit Kollision, Möbel mit Kollision
 * (Angabe aus der Möbelliste, am Objekt überschreibbar), die Figuren und Statisten, die an einem
 * Fleck stehen (`von` gleich `bis`; belebungsschicht.ts sperrt sie im Stehen). Wandernde Statisten
 * und Tiere sperren hier nicht: Sie geben den Weg wieder frei.
 * Sonderfall: Möbel, die die Liste nicht kennt, sperren nicht (die App zeichnet sie auch nicht).
 */
export function sperrkacheln(
  karte: Tiledkarte,
  moebel: Readonly<Record<string, Sperrangabe>>,
  kachel: number,
): Set<string> {
  const gesperrt = new Set<string>();
  const gids = sperrendeKacheln(karte);
  for (const ebene of karte.layers) {
    (ebene.data ?? []).forEach((gid, i) => {
      if (gids.has(gid)) gesperrt.add(`${i % karte.width},${Math.floor(i / karte.width)}`);
    });
    for (const o of ebene.objects ?? []) {
      const ort = { x: o.x ?? 0, y: o.y ?? 0 };
      if (o.type === "figur" || stehtFest(o)) {
        sperreRechteck(gesperrt, { ...ort, b: kachel, h: kachel }, kachel);
      }
      const angabe = o.type === "moebel" && o.name ? moebel[o.name] : undefined;
      if (!angabe || !(hatKollision(o.properties) ?? angabe.kollision)) continue;
      sperreMoebel(gesperrt, ort, angabe, kachel);
    }
  }
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
