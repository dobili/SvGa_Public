/**
 * Verdeckungsfotos: das Spiel an Sitz-, Liege- und Thekenstellen öffnen und fotografieren
 * (Sichtprüfung der Vordergrundmaske, Auftrag des Hauptchats, 23.11.2026).
 *
 * Warum: Ob eine Sitzende hinter der Lehne verschwindet, eine Liegende unter der Decke liegt und
 * eine Wirtin hinter ihrer Theke steht, sieht man nur im Spiel mit den echten Bildern. Die Stellen
 * kommen aus pipeline/abenteuer/verdeckung.py (plus sitzende Statisten und Theken, Liste als JSON).
 * Je Stelle: Stand des passenden Akts (aktstand.cjs), Spieluhr auf die Stunde des Tagesablaufs,
 * der Held zwei Kacheln unter der Figur oder auf dem nächsten freien Feld (die Kamera folgt ihm),
 * ein Foto der ganzen Seite und ein Ausschnitt um die Stelle.
 * Aufruf (nach npm run build mit privatem Paket):
 *   VERDECKUNG_STELLEN=stellen.json VERDECKUNG_STAENDE=ORDNER (akt2.json …, ende.json)
 *   VERDECKUNG_ORDNER=../buch/arbeit/verdeckung/fotos/vorher CHROMIUM_PFAD=… \
 *   npx playwright test --config playwright.durchlauf.config.ts verdeckungsfoto
 * Nicht in CI (braucht das private Spielpaket). Abhängigkeiten: simstand.ts, welt.ts.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, devices, test, type Page } from "@playwright/test";
import { starteMitStand } from "../e2e/abenteuer-affe";
import { standAus } from "./simstand";
import { kartenwissen, ladeSpieldaten, type Kartenwissen } from "./welt";

const STELLEN = process.env.VERDECKUNG_STELLEN ?? "";
const STAENDE = process.env.VERDECKUNG_STAENDE ?? "";
const ORDNER = process.env.VERDECKUNG_ORDNER ?? "/tmp/verdeckung";
const ADRESSE = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? "4183"}`;
const WARTEN_MS = 2500;
const FOTO_MS = 120 * 60_000;
const HINWEISE_HOECHSTENS = 5;
const KURZ_MS = 400;
/** Der Held steht möglichst so viele Kacheln unter der Figur, sonst auf dem nächsten freien Feld. */
const ABSTAND = 2;
const SUCHWEITE = 6;
/** Spielminuten je Stunde und Tag (regeln/spieluhr.ts); Fotos am zweiten Spieltag. */
const MINUTEN_JE_STUNDE = 60;
const ZWEITER_TAG = 24 * MINUTEN_JE_STUNDE;
/** Ausschnitt: so viele Kacheln Seitenlänge um die Figur; Kachelgröße in Kartenpixeln. */
const AUSSCHNITT_KACHELN = 6;
const KACHEL = 16;
/** Mitte des Ausschnitts eine halbe Kachel über dem Feld (Sitzende und Stehende ragen nach oben). */
const UEBER_DEM_FELD = 0.5;

interface Stelle {
  readonly karte: string;
  readonly x: number;
  readonly y: number;
  readonly stunde: number;
  readonly stand: string;
  readonly datei: string;
  /** Seitenlänge des Ausschnitts in Kacheln (Gruppen, Türen); ohne Angabe AUSSCHNITT_KACHELN. */
  readonly kacheln?: number;
  /** Feste Lage des Helden (Fußmatten: auf der Matte vor der Tür); ohne Angabe heldfeld. */
  readonly held?: { readonly x: number; readonly y: number; readonly richtung: Richtung };
}

/** Blickrichtung des Helden in einer festen Lage. */
type Richtung = "oben" | "unten" | "links" | "rechts";

/** Schließt Hinweise und Dialoge, die beim Laden aufgehen. */
async function schliesseHinweise(seite: Page): Promise<void> {
  for (let i = 0; i < HINWEISE_HOECHSTENS; i++) {
    const weiter = seite.getByRole("button", { name: "Weiter" }).first();
    if (!(await weiter.isVisible().catch(() => false))) return;
    await weiter.click().catch(() => undefined);
    await seite.waitForTimeout(KURZ_MS);
  }
}

/** Kamerastand aus der Messhilfe von kamerafuehrung.ts: Held als Anteil des Bildes, Zoom. */
interface Kamerastand {
  readonly heldX: number;
  readonly heldY: number;
  readonly zoom: number;
}

/** Schaltet die Messhilfe der Kamera ein und liest den letzten Eintrag (oder null). */
async function kamerastand(seite: Page): Promise<Kamerastand | null> {
  await seite.evaluate(() => {
    (window as unknown as { __kameraprotokoll: unknown[] }).__kameraprotokoll = [];
  });
  await seite.waitForTimeout(KURZ_MS);
  return seite.evaluate(() => {
    const liste = (window as unknown as { __kameraprotokoll: Kamerastand[] }).__kameraprotokoll;
    return liste.at(-1) ?? null;
  });
}

/** Ein Block eines Tagesablaufs, so weit hier gebraucht (daten/tagesablaeufe.json). */
interface Ablaufblock {
  readonly von: number;
  readonly bis: number;
  readonly karte?: string;
  readonly feld?: readonly number[];
}

/**
 * Felder, auf denen zur Stunde Personen nach ihrem Tagesablauf stehen. Warum: Das Kartenwissen
 * kennt nur die Figuren der Szene; im Diner stand der Held sonst in skaterJo (Stehplatzfotos,
 * 24.11.2026).
 */
function ablaufplaetze(karte: string, stunde: number): { x: number; y: number }[] {
  const datei = join(process.cwd(), "public/abenteuer/daten/tagesablaeufe.json");
  const roh = JSON.parse(readFileSync(datei, "utf8")) as {
    figuren: Record<string, { bloecke?: Ablaufblock[] }>;
  };
  const gilt = (b: Ablaufblock) =>
    b.von < b.bis ? b.von <= stunde && stunde < b.bis : stunde >= b.von || stunde < b.bis;
  return Object.values(roh.figuren)
    .flatMap((f) => f.bloecke ?? [])
    .filter((b) => b.karte === karte && b.feld && gilt(b))
    .map((b) => ({ x: b.feld?.[0] ?? 0, y: b.feld?.[1] ?? 0 }));
}

/**
 * Feld für den Helden: ABSTAND Kacheln unter der Stelle, wenn frei, sonst das nächste freie Feld
 * (kein Übergang), bevorzugt darunter. Warum: Im Diner lag das Feld unter den Rentnerinnen auf der
 * Nischenbank; der Held wurde woanders hingestellt und die Kamera zeigte die Stelle nicht.
 */
function heldfeld(wissen: Kartenwissen, s: Stelle): { x: number; y: number } {
  const besetzt = [{ x: s.x, y: s.y }, ...ablaufplaetze(s.karte, s.stunde)];
  const geeignet = (x: number, y: number) =>
    wissen.freiStreng(x, y) &&
    !wissen.uebergangsfelder.has(`${x},${y}`) &&
    besetzt.every((p) => Math.abs(x - p.x) > 1 || Math.abs(y - p.y) > 1);
  if (geeignet(s.x, s.y + ABSTAND)) return { x: s.x, y: s.y + ABSTAND };
  const kandidaten: { x: number; y: number; d: number }[] = [];
  for (let dy = -SUCHWEITE; dy <= SUCHWEITE; dy++) {
    for (let dx = -SUCHWEITE; dx <= SUCHWEITE; dx++) {
      if (!geeignet(s.x + dx, s.y + dy)) continue;
      // Darunter zuerst: dort verdeckt der Held die Figur nicht.
      kandidaten.push({ x: s.x + dx, y: s.y + dy, d: Math.hypot(dx, dy) + (dy > 0 ? 0 : 1) });
    }
  }
  kandidaten.sort((a, b) => a.d - b.d);
  return kandidaten[0] ?? { x: s.x, y: s.y + ABSTAND };
}

/**
 * Foto der Seite und ein quadratischer Ausschnitt um die Stelle. Warum über die Kamera: Am Rand der
 * Karte steht der Held nicht in der Bildmitte; der Ausschnitt rechnet von seiner Lage im Bild um
 * den Versatz (versatzX, versatzY) Kacheln zur Stelle.
 */
async function fotografiere(
  seite: Page,
  datei: string,
  versatzX: number,
  versatzY: number,
  kacheln = AUSSCHNITT_KACHELN,
): Promise<void> {
  await seite.screenshot({ path: join(ORDNER, `${datei}-ganz.png`) });
  const leinwand = seite.locator(".abenteuer-welt canvas");
  const welt = await leinwand.boundingBox();
  const kamera = await kamerastand(seite);
  if (!welt || !kamera) return;
  const pixel = await leinwand.evaluate((c) => (c as HTMLCanvasElement).width);
  const kachel = (KACHEL * kamera.zoom * welt.width) / pixel;
  const seitenlaenge = Math.min(kachel * kacheln, welt.width, welt.height);
  const mitteX = welt.x + kamera.heldX * welt.width + versatzX * kachel;
  const mitteY = welt.y + kamera.heldY * welt.height + (versatzY - UEBER_DEM_FELD) * kachel;
  const begrenzt = (wert: number, von: number, bis: number) => Math.max(von, Math.min(bis, wert));
  await seite.screenshot({
    path: join(ORDNER, `${datei}.png`),
    clip: {
      x: begrenzt(mitteX - seitenlaenge / 2, welt.x, welt.x + welt.width - seitenlaenge),
      y: begrenzt(mitteY - seitenlaenge / 2, welt.y, welt.y + welt.height - seitenlaenge),
      width: seitenlaenge,
      height: seitenlaenge,
    },
  });
}

test("Verdeckungsfotos an Sitz-, Liege- und Thekenstellen", async () => {
  test.skip(!STELLEN || !STAENDE, "nur mit VERDECKUNG_STELLEN und VERDECKUNG_STAENDE");
  test.setTimeout(FOTO_MS);
  mkdirSync(ORDNER, { recursive: true });
  const daten = ladeSpieldaten();
  const stellen = JSON.parse(readFileSync(STELLEN, "utf8")) as Stelle[];
  const nur = process.env.VERDECKUNG_NUR ?? "";
  const pfad = process.env.CHROMIUM_PFAD;
  const browser = await chromium.launch(pfad ? { executablePath: pfad } : {});
  for (const s of stellen.filter((x) => !nur || x.datei.includes(nur))) {
    const sim = JSON.parse(readFileSync(join(STAENDE, `${s.stand}.json`), "utf8")) as object;
    const datei = join(ORDNER, `${s.datei}.json`);
    writeFileSync(datei, JSON.stringify({ ...sim, karte: s.karte }));
    const stand = standAus(daten, datei);
    const held = s.held ?? {
      ...heldfeld(kartenwissen(daten, s.karte, stand), s),
      richtung: "oben",
    };
    const kontext = await browser.newContext({ ...devices["Pixel 7"], baseURL: ADRESSE });
    const seite = await kontext.newPage();
    try {
      await starteMitStand(seite, {
        ...stand,
        spieluhr: ZWEITER_TAG + s.stunde * MINUTEN_JE_STUNDE,
        position: { karte: s.karte, x: held.x, y: held.y, richtung: held.richtung },
      });
      await schliesseHinweise(seite);
      await seite.waitForTimeout(WARTEN_MS);
      await fotografiere(seite, s.datei, s.x - held.x, s.y - held.y, s.kacheln);
    } catch (fehler) {
      // Eine Stelle, die nicht lädt, steht im Bericht; die übrigen gehen weiter.
      writeFileSync(join(ORDNER, `${s.datei}.fehler.txt`), String(fehler));
    }
    await kontext.close();
  }
  await browser.close();
});
