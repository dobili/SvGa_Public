/**
 * Schutz vor dem Einschluss: Steht der Held beim Laden einer Karte in einer kleinen Nische, aus
 * der er keinen Übergang mehr erreicht, rückt er auf das nächste Feld, von dem aus es weitergeht.
 *
 * Warum: Karten haben Fassungen (kartenfassung.ts), und nach einer Partie lädt die Welt neu. Im
 * Clubraum von Maple Falls stellt die Fassung „bildschirm“ (nach der Szene mit Victor) ein Pult
 * neben Coach Delgado. Wer den Coach von rechts angesprochen hatte, stand danach zwischen Coach,
 * Pult, Regal und Schreibtisch und kam nie wieder heraus (Spieler-Durchlauf, 18.11.2026). Solche
 * Fallen entstehen bei jedem Umbau einer Fassung neu; deshalb prüft die Oberwelt die Stelle bei
 * jedem Laden, statt jede Karte einzeln zu sichern.
 * Rolle im Gesamtbild: Reine Logik ohne Phaser; oberwelt/useWeltladen.ts ruft `ausEinschluss` vor
 * dem Start der Szene. Gerechnet wird in Zellen von 4 Pixeln mit dem Körper des Helden (12 × 12),
 * wie die Physik der Szene (mittenkacheln.ts, sperrzellen), Figuren und feste Statisten sperren
 * ihre Kachel.
 * Abhängigkeiten: begehbar.ts, mittenkacheln.ts, feinsperren.ts.
 * Beispiel: Held auf (16, 4), ringsum Coach, Pult und Regal, Übergang „schule“ unten im Raum →
 * neues Feld (17, 5) rechts neben dem Pult. Sonderfälle: Karte ohne Übergang, großer abgetrennter Bereich
 * (anderes Ufer, Insel) oder kein besseres Feld → null, der Held bleibt, wo er ist.
 */
import { sperrkacheln, type Sperrangabe, type Tiledkarte } from "./begehbar";
import { ZELLEN } from "./feinsperren";
import { sperrzellen } from "./mittenkacheln";

/** Der Held in Zellen (12 Pixel bei Zellen von 4 Pixeln). */
const KOERPER = 3;
/**
 * Bis zu so vielen Kacheln gilt ein abgeschlossener Bereich als Nische. Größere Bereiche ohne
 * Übergang sind gewollt (Ufer, die nur ein Dialog verbindet) und bleiben unangetastet.
 */
export const NISCHE_HOECHSTENS = 16;

const SCHRITTE = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
] as const;

/** Ein Feld in Kachelkoordinaten. */
interface Feld {
  readonly x: number;
  readonly y: number;
}

/** Das Zellraster einer Karte: gesperrte Zellen und die Frage, ob der Körper an eine Lage passt. */
interface Raster {
  readonly breite: number;
  readonly hoehe: number;
  /** Passt der Körper mit der linken oberen Zelle (x, y)? */
  readonly passt: (x: number, y: number) => boolean;
  /** Ist die ganze Kachel frei (alle 16 Zellen)? Dort steht der Held mittig, ohne anzustoßen. */
  readonly kachelFrei: (x: number, y: number) => boolean;
}

/** Baut das Zellraster: Wände, Möbel, feine Sperren, dazu Figuren und feste Statisten. */
function baueRaster(
  karte: Tiledkarte,
  moebel: Readonly<Record<string, Sperrangabe>>,
  kachel: number,
): Raster {
  const breite = karte.width * ZELLEN;
  const hoehe = karte.height * ZELLEN;
  const zu = new Uint8Array(breite * hoehe);
  const sperre = (x: number, y: number) => {
    if (x >= 0 && y >= 0 && x < breite && y < hoehe) zu[y * breite + x] = 1;
  };
  for (const z of sperrzellen(karte, moebel, kachel)) {
    const [x, y] = z.split(",").map(Number) as [number, number];
    sperre(x, y);
  }
  const ohneFiguren = sperrkacheln(karte, moebel, kachel, false);
  for (const k of sperrkacheln(karte, moebel, kachel)) {
    if (ohneFiguren.has(k)) continue;
    const [x, y] = k.split(",").map(Number) as [number, number];
    for (let i = 0; i < ZELLEN * ZELLEN; i++) {
      sperre(x * ZELLEN + (i % ZELLEN), y * ZELLEN + Math.floor(i / ZELLEN));
    }
  }
  const passt = (x: number, y: number): boolean => {
    if (x < 0 || y < 0 || x + KOERPER > breite || y + KOERPER > hoehe) return false;
    for (let dy = 0; dy < KOERPER; dy++) {
      for (let dx = 0; dx < KOERPER; dx++) if (zu[(y + dy) * breite + x + dx]) return false;
    }
    return true;
  };
  const kachelFrei = (x: number, y: number): boolean => {
    for (let i = 0; i < ZELLEN * ZELLEN; i++) {
      const zx = x * ZELLEN + (i % ZELLEN);
      const zy = y * ZELLEN + Math.floor(i / ZELLEN);
      if (zx < 0 || zy < 0 || zx >= breite || zy >= hoehe || zu[zy * breite + zx]) return false;
    }
    return true;
  };
  return { breite, hoehe, passt, kachelFrei };
}

/** Die Kachel (Nummer y × Kartenbreite + x), auf der die Mitte des Körpers in dieser Lage steht. */
function kachelDerLage(r: Raster, lage: number): number {
  const mitte = KOERPER / 2;
  const x = Math.floor(((lage % r.breite) + mitte) / ZELLEN);
  const y = Math.floor((Math.floor(lage / r.breite) + mitte) / ZELLEN);
  return y * (r.breite / ZELLEN) + x;
}

/** Die Lagen des Körpers (Nummer y × Breite + x), deren Mitte auf einer der Kacheln steht. */
function lagenAuf(r: Raster, kacheln: readonly Feld[]): number[] {
  const lagen: number[] = [];
  for (const k of kacheln) {
    for (let y = k.y * ZELLEN - 1; y < k.y * ZELLEN + ZELLEN - 1; y++) {
      for (let x = k.x * ZELLEN - 1; x < k.x * ZELLEN + ZELLEN - 1; x++) {
        if (r.passt(x, y)) lagen.push(y * r.breite + x);
      }
    }
  }
  return lagen;
}

/**
 * Alle Kacheln, auf denen die Mitte des Körpers von den Startlagen aus stehen kann. Mit `genug`
 * hört die Suche auf, sobald so viele Kacheln gefunden sind (dann ist es keine Nische).
 */
function erreichbareKacheln(r: Raster, starts: readonly number[], genug: number): Set<number> {
  const gesehen = new Uint8Array(r.breite * r.hoehe);
  const offen: number[] = [];
  for (const s of starts) {
    if (gesehen[s]) continue;
    gesehen[s] = 1;
    offen.push(s);
  }
  const kacheln = new Set<number>();
  for (let i = 0; i < offen.length && kacheln.size < genug; i++) {
    const lage = offen[i] as number;
    kacheln.add(kachelDerLage(r, lage));
    const x = lage % r.breite;
    const y = Math.floor(lage / r.breite);
    for (const [dx, dy] of SCHRITTE) {
      const nx = x + dx;
      const ny = y + dy;
      if (!r.passt(nx, ny)) continue;
      const n = ny * r.breite + nx;
      if (gesehen[n]) continue;
      gesehen[n] = 1;
      offen.push(n);
    }
  }
  return kacheln;
}

/**
 * Das Feld, auf das der Held rücken soll, oder null, wenn er bleiben kann.
 * Eingaben: Tiled-Karte (ohne abwesende Figuren), Möbelliste, Namen der Übergänge dieser Karte,
 * Feld des Helden, Kachelgröße. Ausgabe: das nächste freie Feld (nach Schritten in x und y), von
 * dem aus ein Übergang erreichbar ist und auf dem selbst kein Übergang liegt.
 * Aufwand: Im gewöhnlichen Fall endet die Suche nach wenigen Kacheln (der Bereich des Helden ist
 * größer als eine Nische); nur in einer Nische wird die ganze Karte abgesucht.
 */
export function ausEinschluss(
  karte: Tiledkarte,
  moebel: Readonly<Record<string, Sperrangabe>>,
  uebergaenge: readonly string[],
  held: Feld,
  kachel: number,
): Feld | null {
  const tueren: Feld[] = karte.layers
    .flatMap((e) => e.objects ?? [])
    .filter((o) => uebergaenge.includes(o.name ?? "") && o.type !== "moebel")
    .map((o) => ({ x: Math.round((o.x ?? 0) / kachel), y: Math.round((o.y ?? 0) / kachel) }));
  if (tueren.length === 0) return null;
  const r = baueRaster(karte, moebel, kachel);
  const nummer = (f: Feld) => f.y * karte.width + f.x;
  const tuerkacheln = new Set(tueren.map(nummer));
  if (tuerkacheln.has(nummer(held))) return null;
  const bereich = erreichbareKacheln(r, lagenAuf(r, [held]), NISCHE_HOECHSTENS + 1);
  // Passt der Körper auf dem Feld gar nicht (Feld dicht an einem Möbel, etwa vor dem Kunden im
  // Bergladen), ist das kein Einschluss: Die Physik der Szene schiebt den Helden dort selbst frei.
  if (bereich.size === 0 || bereich.size > NISCHE_HOECHSTENS) return null;
  // Übergänge liegen oft in der Wand: Wer daneben stehen kann, kommt hinaus.
  const nachbarn = (k: number) => [k - 1, k + 1, k - karte.width, k + karte.width];
  const anTuer = (k: number) => tuerkacheln.has(k) || nachbarn(k).some((n) => tuerkacheln.has(n));
  if ([...bereich].some(anTuer)) return null;
  // Eine Nische: alle Felder, von denen aus man an einen Übergang kommt.
  const vorTueren = tueren.flatMap((t) => [
    t,
    ...SCHRITTE.map(([dx, dy]) => ({ x: t.x + dx, y: t.y + dy })),
  ]);
  const draussen = erreichbareKacheln(r, lagenAuf(r, vorTueren), Number.POSITIVE_INFINITY);
  let bestes: Feld | null = null;
  let abstand = Number.POSITIVE_INFINITY;
  for (const k of draussen) {
    if (tuerkacheln.has(k) || bereich.has(k)) continue;
    const feld = { x: k % karte.width, y: Math.floor(k / karte.width) };
    // Nur ganz freie Kacheln: Der Held steht dort mittig. Auf einer halb gesperrten Kachel läge
    // sein Körper im Möbel, und die Physik schöbe ihn womöglich zurück in die Nische.
    if (!r.kachelFrei(feld.x, feld.y)) continue;
    const d = Math.abs(feld.x - held.x) + Math.abs(feld.y - held.y);
    if (d < abstand) [bestes, abstand] = [feld, d];
  }
  return bestes;
}
