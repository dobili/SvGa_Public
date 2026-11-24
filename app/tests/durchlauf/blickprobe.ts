/**
 * Hilfen der Blickprobe (blickprobe.spec.ts): Startfeld vor einem Blickpunkt, Fotos der Stelle,
 * Lesen des Geistes an der Spielfläche.
 *
 * Warum eigene Datei: Die Probe selbst bleibt kurz; Wegsuche und Bildausschnitt sind reine Rechnung
 * oder reines Lesen und hier getrennt prüfbar.
 * Abhängigkeiten: welt.ts (Kartenwissen).
 */
import { join } from "node:path";
import type { Page } from "@playwright/test";
import type { Kartenwissen } from "./welt";

/** Ein Feld in Kachelkoordinaten. */
export interface Feld {
  readonly x: number;
  readonly y: number;
}

/** Ein Blickpunkt aus ambrose_blickpunkte.json, dazu der Name seines Stands (blickstaende.cjs). */
export interface Blickeintrag {
  readonly karte: string;
  readonly feld: readonly [number, number];
  readonly radius: number;
  readonly knoten: string;
  readonly wann?: string;
  readonly stand: string | null;
}

/** So viele Schritte außerhalb des Radius beginnt der Held (ein Spieler kommt von weiter her). */
const ANLAUF_SCHRITTE = 3;
/** Weiter sucht die Probe kein Startfeld (Schritte über das Ziel hinaus). */
const ANLAUF_HOECHSTENS = 12;
const NACHBARN: readonly Feld[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

/** Liegt das Feld im Radius des Blickpunkts (Luftlinie wie regeln/blickpunkte.ts)? */
export function imRadius(p: Blickeintrag, x: number, y: number): boolean {
  return (p.feld[0] - x) ** 2 + (p.feld[1] - y) ** 2 <= p.radius ** 2;
}

/** Freie Felder im Radius, die der Held betreten kann (ohne Übergänge). */
export function zielfelder(wissen: Kartenwissen, p: Blickeintrag): Feld[] {
  const felder: Feld[] = [];
  for (let y = p.feld[1] - p.radius; y <= p.feld[1] + p.radius; y++) {
    for (let x = p.feld[0] - p.radius; x <= p.feld[0] + p.radius; x++) {
      const tuer = wissen.uebergangsfelder.has(`${x},${y}`);
      if (imRadius(p, x, y) && wissen.frei(x, y) && !tuer) felder.push({ x, y });
    }
  }
  return felder;
}

/**
 * Die Felder im Radius, die der Mitte der Stelle am nächsten sind: Dorthin geht der Held, so
 * durchquert er den Radius wie ein Spieler, der auf das Ding zugeht. Warum nicht der Rand: Am Rand
 * stand er neben einer Figur, der Aktionsknopf hielt den Blickpunkt an (Veranda in Maple Falls,
 * erster Probelauf 24.11.2026).
 */
export function kernfelder(wissen: Kartenwissen, p: Blickeintrag): Feld[] {
  const abstand = (f: Feld) => (f.x - p.feld[0]) ** 2 + (f.y - p.feld[1]) ** 2;
  const felder = zielfelder(wissen, p);
  const naechster = Math.min(...felder.map(abstand));
  return felder.filter((f) => abstand(f) === naechster);
}

/**
 * Startfeld: von den Zielfeldern aus (Kernfelder; teilt ein Haus den Radius, läge der Start sonst
 * auf der falschen Seite, Steg im Bayou, 24.11.2026) über freie Felder gesucht (Breitensuche), das erste
 * ganz freie Feld ANLAUF_SCHRITTE Schritte außerhalb des Radius, kein Übergang. So kommt der Held
 * auf einem echten Weg heran und betritt den Radius im Gehen. Null, wenn keins da ist.
 */
export function startfeld(
  wissen: Kartenwissen,
  p: Blickeintrag,
  ziele: readonly Feld[],
): Feld | null {
  const abstand = new Map<string, number>(ziele.map((f) => [`${f.x},${f.y}`, 0]));
  const schlange: Feld[] = [...ziele];
  let beste: Feld | null = null;
  while (schlange.length > 0) {
    const f = schlange.shift() as Feld;
    const d = abstand.get(`${f.x},${f.y}`) ?? 0;
    if (d > ANLAUF_HOECHSTENS) break;
    for (const n of NACHBARN) {
      const x = f.x + n.x;
      const y = f.y + n.y;
      const schluessel = `${x},${y}`;
      if (abstand.has(schluessel) || !wissen.frei(x, y)) continue;
      if (wissen.uebergangsfelder.has(schluessel)) continue;
      abstand.set(schluessel, d + 1);
      schlange.push({ x, y });
      const draussen = !imRadius(p, x, y);
      if (!beste && draussen && d + 1 >= ANLAUF_SCHRITTE && wissen.freiStreng(x, y)) {
        beste = { x, y };
      }
    }
    if (beste) return beste;
  }
  return beste;
}

/** Der Geist an der Spielfläche („ambrose@x,y“, „weg“ oder leer). */
export async function begleiter(seite: Page): Promise<string> {
  const flaeche = seite.locator(".abenteuer-welt canvas");
  return (await flaeche.getAttribute("data-begleiter").catch(() => null)) ?? "";
}

/** Feld aus „ambrose@x,y“ oder null. */
export function begleiterfeld(wert: string): Feld | null {
  const treffer = /^ambrose@(\d+),(\d+)$/.exec(wert);
  return treffer ? { x: Number(treffer[1]), y: Number(treffer[2]) } : null;
}

/** Kamerastand aus der Messhilfe von oberwelt/kamerafuehrung.ts. */
interface Kamerastand {
  readonly heldX: number;
  readonly heldY: number;
  readonly zoom: number;
}

const KACHEL = 16;
/** Seitenlänge des Ausschnitts in Kacheln: die Stelle mit etwas Umgebung. */
const AUSSCHNITT_KACHELN = 9;
const MESSEN_MS = 400;

/** Liest den letzten Eintrag der Messhilfe der Kamera (oder null). */
async function kamerastand(seite: Page): Promise<Kamerastand | null> {
  await seite.evaluate(() => {
    (window as unknown as { __kameraprotokoll: unknown[] }).__kameraprotokoll = [];
  });
  await seite.waitForTimeout(MESSEN_MS);
  return seite.evaluate(() => {
    const liste = (window as unknown as { __kameraprotokoll: Kamerastand[] }).__kameraprotokoll;
    return liste.at(-1) ?? null;
  });
}

/** Wo die Stelle beim Foto lag: im Bild der Spielfläche, unter dem Dialogfenster? */
export interface Stellenlage {
  readonly imBild: boolean;
  /** Die Mitte der Stelle liegt unter dem Dialog: Solange Ambrose spricht, sieht man sie nicht. */
  readonly unterDialog: boolean;
}

/**
 * Foto der ganzen Seite und ein Ausschnitt um die Stelle (Versatz in Kacheln vom Helden). Gibt
 * zurück, ob die Stelle im Bild der Spielfläche liegt (sonst zeigt die Kamera sie nicht) und ob
 * das Dialogfenster sie verdeckt (erste Sichtung der Fotos, 24.11.2026: Kartons, Steg).
 */
export async function fotografiere(
  seite: Page,
  ordner: string,
  name: string,
  versatz: Feld,
): Promise<Stellenlage> {
  await seite.screenshot({ path: join(ordner, `${name}-ganz.png`) });
  const leinwand = seite.locator(".abenteuer-welt canvas");
  const welt = await leinwand.boundingBox();
  const kamera = await kamerastand(seite);
  if (!welt || !kamera) return { imBild: false, unterDialog: false };
  const pixel = await leinwand.evaluate((c) => (c as HTMLCanvasElement).width);
  const kachel = (KACHEL * kamera.zoom * welt.width) / pixel;
  const mitteX = welt.x + kamera.heldX * welt.width + versatz.x * kachel;
  const mitteY = welt.y + kamera.heldY * welt.height + versatz.y * kachel;
  const sichtbar =
    mitteX > welt.x &&
    mitteX < welt.x + welt.width &&
    mitteY > welt.y &&
    mitteY < welt.y + welt.height;
  const seitenlaenge = Math.min(kachel * AUSSCHNITT_KACHELN, welt.width, welt.height);
  const begrenzt = (wert: number, von: number, bis: number) => Math.max(von, Math.min(bis, wert));
  await seite.screenshot({
    path: join(ordner, `${name}.png`),
    clip: {
      x: begrenzt(mitteX - seitenlaenge / 2, welt.x, welt.x + welt.width - seitenlaenge),
      y: begrenzt(mitteY - seitenlaenge / 2, welt.y, welt.y + welt.height - seitenlaenge),
      width: seitenlaenge,
      height: seitenlaenge,
    },
  });
  const dialog = await seite.getByTestId("abenteuer-dialog").boundingBox();
  const unterDialog = Boolean(
    dialog &&
    mitteX > dialog.x &&
    mitteX < dialog.x + dialog.width &&
    mitteY > dialog.y &&
    mitteY < dialog.y + dialog.height,
  );
  return { imBild: sichtbar, unterDialog };
}
