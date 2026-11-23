/**
 * Tierfotos: das Spiel an festen Stellen mit Tieren öffnen und Bildschirmfotos machen
 * (PixelLab-Tiere, Aufträge des Hauptchats 23.11.2026).
 *
 * Warum: Maßstab, Zustandsbilder, Wasserfarbe und Platz der Tiere lassen sich nur im Spiel neben
 * Figuren und Karte beurteilen. Die Belebung hält für die Fotos an (window.__belebungStill), damit
 * scheue und fliegende Tiere auf dem Bild sind.
 * Aufruf (nach npm run build; Stand aus aktstand.cjs --akt 4):
 *   alle Arten: python -m pipeline.abenteuer.pixellab_tierfotos stellen ORDNER, dann
 *     PROBE_STAND=/tmp/akt4.json TIERFOTO_LISTE=ORDNER/stellen.json TIERFOTO_ORDNER=ORDNER \
 *     CHROMIUM_PFAD=… npx playwright test --config playwright.durchlauf.config.ts tierfoto
 *   einzeln: TIERFOTO_STELLE="karte,x,y,datei" (dazu TIERFOTO_ABSTAND, TIERFOTO_STUNDE)
 * Weitere Angaben: TIERFOTO_SERIE (Fotos je Stelle, Vorgabe 1), TIERFOTO_BEWEGT=1 (Tiere laufen).
 * Nicht in CI (braucht das private Spielpaket).
 * Abhängigkeiten: simstand.ts, welt.ts, e2e/abenteuer-affe.ts.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, devices, test, type Browser, type Page } from "@playwright/test";
import { starteMitStand } from "../e2e/abenteuer-affe";
import { standAus } from "./simstand";
import { ladeSpieldaten, type Spieldaten } from "./welt";

const STAND = process.env.PROBE_STAND ?? "";
const ORDNER = process.env.TIERFOTO_ORDNER ?? "/tmp/tierfotos";
const ADRESSE = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? "4183"}`;
const MINUTEN_JE_STUNDE = 60;
/** So lange laufen Animationen, bevor ein Foto entsteht (ms). */
const WARTEN_MS = 500;
const SERIE = Number(process.env.TIERFOTO_SERIE ?? "1");
const FOTO_MS = 120 * 60_000;
const HINWEISE_HOECHSTENS = 5;
const KURZ_MS = 400;
/** Der Held steht so viele Kacheln über dem Tier: nah genug fürs Bild, scheue Tiere fliehen nicht. */
const ABSTAND = Number(process.env.TIERFOTO_ABSTAND ?? "3");

/** Eine Fotostelle (Liste aus pixellab_tierfotos.py oder TIERFOTO_STELLE). */
interface Stelle {
  readonly karte: string;
  /** Feld des Tiers in Kacheln (aus der Karte). */
  readonly x: number;
  readonly y: number;
  readonly datei: string;
  /** Uhr stellen (Tiere mit „wann“, etwa die Eule nachts). */
  readonly stunde?: number;
  readonly abstand?: number;
  /** Maßstab je Art für Größenvergleiche (window.__tierMassstab). */
  readonly massstab?: Readonly<Record<string, number>>;
}

function stellen(): Stelle[] {
  const liste = process.env.TIERFOTO_LISTE;
  if (liste) return JSON.parse(readFileSync(liste, "utf8")) as Stelle[];
  const teile = (process.env.TIERFOTO_STELLE ?? "").split(",");
  const stunde = process.env.TIERFOTO_STUNDE;
  return [
    {
      karte: teile[0] ?? "",
      x: Number(teile[1]),
      y: Number(teile[2]),
      datei: teile[3] ?? "stelle",
      ...(stunde ? { stunde: Number(stunde) } : {}),
    },
  ];
}

/** Schließt Hinweise und Dialoge, die beim Laden aufgehen („Deine ersten Münzen!“). */
async function schliesseHinweise(seite: Page): Promise<void> {
  for (let i = 0; i < HINWEISE_HOECHSTENS; i++) {
    const weiter = seite.getByRole("button", { name: "Weiter" }).first();
    if (!(await weiter.isVisible().catch(() => false))) return;
    await weiter.click().catch(() => undefined);
    await seite.waitForTimeout(KURZ_MS);
  }
}

/** Ein Foto (oder eine Serie) an einer Stelle, in einem frischen Browserkontext. */
async function fotografiere(browser: Browser, daten: Spieldaten, s: Stelle): Promise<void> {
  const sim = JSON.parse(readFileSync(STAND, "utf8")) as Record<string, unknown>;
  const datei = join(ORDNER, `${s.datei}.stand.json`);
  writeFileSync(datei, JSON.stringify({ ...sim, karte: s.karte }));
  const stand = standAus(daten, datei);
  const kontext = await browser.newContext({ ...devices["Pixel 7"], baseURL: ADRESSE });
  const seite = await kontext.newPage();
  await seite.addInitScript(
    ({ halt, massstab }) => {
      const welt = globalThis as { __belebungStill?: boolean; __tierMassstab?: object };
      welt.__belebungStill = halt;
      if (massstab) welt.__tierMassstab = massstab;
    },
    { halt: !process.env.TIERFOTO_BEWEGT, massstab: s.massstab ?? null },
  );
  await starteMitStand(seite, {
    ...stand,
    position: { ...stand.position, x: s.x, y: s.y - (s.abstand ?? ABSTAND), richtung: "unten" },
    ...(s.stunde === undefined ? {} : { spieluhr: s.stunde * MINUTEN_JE_STUNDE }),
  });
  await schliesseHinweise(seite);
  for (let i = 1; i <= SERIE; i++) {
    await seite.waitForTimeout(WARTEN_MS);
    await seite.screenshot({ path: join(ORDNER, `${s.datei}-${i}.png`) });
  }
  await kontext.close();
}

test("Tierfotos an festen Stellen", async () => {
  test.skip(!STAND, "nur mit PROBE_STAND");
  test.setTimeout(FOTO_MS);
  mkdirSync(ORDNER, { recursive: true });
  const daten = ladeSpieldaten();
  const pfad = process.env.CHROMIUM_PFAD;
  const browser = await chromium.launch(pfad ? { executablePath: pfad } : {});
  const nur = process.env.TIERFOTO_NUR ?? "";
  for (const s of stellen().filter((x) => !nur || x.datei.includes(nur))) {
    await fotografiere(browser, daten, s);
  }
  await browser.close();
});
