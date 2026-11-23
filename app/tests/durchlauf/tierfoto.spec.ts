/**
 * Tierfotos: das Spiel an festen Stellen mit Tieren öffnen und ein Bildschirmfoto machen
 * (PixelLab-Tiere, Auftrag des Hauptchats 23.11.2026, Punkt 3).
 *
 * Warum: Maßstab, Zustandsbilder und Wasserfarbe der neuen Tiere lassen sich nur im Spiel neben
 * Figuren und Karte beurteilen. Die Stellen sind so gewählt, dass die verlangten Tiere im Bild
 * stehen (Park mit Enten und Krähe, Haus mit Hund und Katze, Bayou mit Nutria, Insel mit Alligator, Wüste mit
 * Eidechse und Geier, Küste mit Pelikan, Fähre mit Delfin, Robbe und Qualle).
 * Aufruf (nach npm run build; Stand aus aktstand.cjs --akt 4):
 *   PROBE_STAND=/tmp/akt4.json TIERFOTO_ORDNER=../buch/arbeit/tiere/pixellab CHROMIUM_PFAD=… \
 *   npx playwright test --config playwright.durchlauf.config.ts tierfoto
 * Nicht in CI (braucht das private Spielpaket).
 * Abhängigkeiten: simstand.ts, welt.ts, e2e/abenteuer-affe.ts.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, devices, test, type Page } from "@playwright/test";
import { starteMitStand } from "../e2e/abenteuer-affe";
import { standAus } from "./simstand";
import { ladeSpieldaten } from "./welt";

const STAND = process.env.PROBE_STAND ?? "";
const ORDNER = process.env.TIERFOTO_ORDNER ?? "/tmp/tierfotos";
const ADRESSE = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? "4183"}`;
/** So lange laufen Tiere und Animationen, bevor das Foto entsteht (ms). */
const WARTEN_MS = 500;
/** Fotos je Stelle (das beste wird für den Bericht ausgewählt). */
const SERIE = 6;
const FOTO_MS = 15 * 60_000;
const HINWEISE_HOECHSTENS = 5;
const KURZ_MS = 400;

/** Stelle eines Fotos: Karte, Feld des Tiers (Kacheln, aus der Karte), Dateiname. */
interface Stelle {
  readonly karte: string;
  readonly x: number;
  readonly y: number;
  readonly datei: string;
}

/** Der Held steht fünf Kacheln über dem Tier (Feld aus der Karte): nah genug fürs Bild, weit genug, dass scheue Tiere (flitzen, ausweichen) noch nicht fliehen. */
const UEBER_DEM_TIER = Number(process.env.TIERFOTO_ABSTAND ?? "5");
const STELLEN: readonly Stelle[] = [
  { karte: "mapleFalls.park", x: 25, y: 27, datei: "park-enten" },
  { karte: "mapleFalls.park", x: 16, y: 9, datei: "park-kraehe" },
  { karte: "mapleFalls.aussen", x: 5, y: 26, datei: "haus-hund-katze" },
  { karte: "bayou.steg", x: 10, y: 31, datei: "bayou-nutria" },
  { karte: "pelikaninsel.dorf", x: 4, y: 40, datei: "insel-alligator" },
  { karte: "wegDelacroixDesert.felsbogen", x: 34, y: 10, datei: "wueste-eidechse" },
  { karte: "wegDelacroixDesert.felsbogen", x: 55, y: 19, datei: "wueste-geier" },
  { karte: "pelikaninsel.dorf", x: 20, y: 10, datei: "kueste-pelikan" },
  { karte: "wegSiliconDelacroix.faehre", x: 26, y: 30, datei: "faehre-robbe" },
  { karte: "wegSiliconDelacroix.faehre", x: 25, y: 60, datei: "faehre-delfin" },
];

/** Schließt Hinweise und Dialoge, die beim Laden aufgehen („Deine ersten Münzen!“). */
async function schliesseHinweise(seite: Page): Promise<void> {
  for (let i = 0; i < HINWEISE_HOECHSTENS; i++) {
    const weiter = seite.getByRole("button", { name: "Weiter" }).first();
    if (!(await weiter.isVisible().catch(() => false))) return;
    await weiter.click().catch(() => undefined);
    await seite.waitForTimeout(KURZ_MS);
  }
}

test("Tierfotos an festen Stellen", async () => {
  test.skip(!STAND, "nur mit PROBE_STAND");
  test.setTimeout(FOTO_MS);
  mkdirSync(ORDNER, { recursive: true });
  const daten = ladeSpieldaten();
  const sim = JSON.parse(readFileSync(STAND, "utf8")) as Record<string, unknown>;
  const pfad = process.env.CHROMIUM_PFAD;
  const browser = await chromium.launch(pfad ? { executablePath: pfad } : {});
  const nur = process.env.TIERFOTO_NUR ?? "";
  // Eine eigene Stelle: TIERFOTO_STELLE="karte,x,y,datei" (zum Nachsehen einzelner Tiere).
  const eigen = process.env.TIERFOTO_STELLE?.split(",");
  const stellen = eigen
    ? [
        {
          karte: eigen[0] ?? "",
          x: Number(eigen[1]),
          y: Number(eigen[2]),
          datei: eigen[3] ?? "stelle",
        },
      ]
    : STELLEN.filter((x) => !nur || x.datei.includes(nur));
  for (const s of stellen) {
    const datei = join(ORDNER, `${s.datei}.json`);
    writeFileSync(datei, JSON.stringify({ ...sim, karte: s.karte }));
    const stand = standAus(daten, datei);
    const kontext = await browser.newContext({ ...devices["Pixel 7"], baseURL: ADRESSE });
    const seite = await kontext.newPage();
    await starteMitStand(seite, {
      ...stand,
      position: { ...stand.position, x: s.x, y: s.y - UEBER_DEM_TIER, richtung: "unten" },
    });
    await schliesseHinweise(seite);
    // Eine Serie: Scheue und fliegende Tiere (Eidechse, Geier) sind nicht in jedem Bild.
    for (let i = 1; i <= SERIE; i++) {
      await seite.waitForTimeout(WARTEN_MS);
      await seite.screenshot({ path: join(ORDNER, `${s.datei}-${i}.png`) });
    }
    await kontext.close();
  }
  await browser.close();
});
