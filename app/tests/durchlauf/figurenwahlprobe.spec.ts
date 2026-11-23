/**
 * Figurenwahlprobe: Heldin und Rivalin Victoria im Spiel, solange ihre Bilder teils fehlen
 * (Nachtauftrag des Hauptchats, 23.11.2026).
 *
 * Warum: Bis der Autor alle Bilder geliefert hat, muss das Spiel sauber auf einen Ersatz fallen
 * (Held, Victor), ohne Fehler in der Konsole, ohne leere Bilder. Die Probe fotografiert die Wahl am
 * Anfang und Karten mit Victor in der Rivalin-Fassung mit der Heldin und sammelt Konsolenfehler
 * und fehlgeschlagene Anfragen.
 * Aufruf (nach npm run build, Stand aus aktstand.cjs):
 *   PROBE_STAND=/tmp/akt4.json FIGURENWAHL_ORDNER=/tmp/figurenwahl CHROMIUM_PFAD=… \
 *   npx playwright test --config playwright.durchlauf.config.ts figurenwahlprobe
 * Ergebnis: Fotos und fehler.json im Ordner; der Test scheitert bei Konsolenfehlern.
 * Abhängigkeiten: simstand.ts, welt.ts, e2e/abenteuer-affe.ts, e2e/abenteuer-paket.ts, e2e/hilfen.ts.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, devices, expect, test, type Page } from "@playwright/test";
import { starteMitStand } from "../e2e/abenteuer-affe";
import { ladeAbenteuerpaket } from "../e2e/abenteuer-paket";
import { starteImBrowser } from "../e2e/hilfen";
import { standAus } from "./simstand";
import { ladeSpieldaten } from "./welt";

const STAND = process.env.PROBE_STAND ?? "";
const STAND_AKT3 = process.env.PROBE_STAND_AKT3 ?? STAND;
const ORDNER = process.env.FIGURENWAHL_ORDNER ?? "/tmp/figurenwahl";
const ADRESSE = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? "4183"}`;
const PROBE_MS = 20 * 60_000;
const WARTEN_MS = 1500;
const ANTWORTEN_HOECHSTENS = 12;
const KLICK_MS = 5000;
const HTTP_FEHLER = 400;
/** Karten mit Victor (Szenen) und sein Feld; der Held steht darüber und spricht ihn an. */
const KARTEN: readonly {
  karte: string;
  x: number;
  y: number;
  akt3?: boolean;
  variablen?: Readonly<Record<string, boolean>>;
}[] = [
  { karte: "cedarCreek.aussen", x: 47, y: 19, variablen: { endeAkt1Gesehen: false } },
  { karte: "riverton.aussen", x: 47, y: 46 },
  { karte: "ironwood.aussen", x: 12, y: 33, akt3: true },
];

/** Sammelt Konsolenfehler und fehlgeschlagene Anfragen einer Seite. */
function sammleFehler(seite: Page, fehler: string[]): void {
  seite.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") fehler.push(`${m.type()}: ${m.text()}`);
  });
  seite.on("pageerror", (e) => fehler.push(`pageerror: ${e.message}`));
  seite.on("requestfailed", (r) => fehler.push(`requestfailed: ${r.url()}`));
  seite.on("response", (r) => {
    if (r.status() >= HTTP_FEHLER) fehler.push(`http ${r.status()}: ${r.url()}`);
  });
}

/**
 * Spricht die Figur vor dem Helden an und fotografiert die Zeilen (Porträt); wählt jeweils den
 * ersten Knopf im Dialog (Weiter oder die erste Antwort).
 */
async function sprichAn(seite: Page, name: string): Promise<void> {
  const aktion = seite.getByTestId("abenteuer-aktion");
  if (!(await aktion.isVisible().catch(() => false))) return;
  await aktion.click({ timeout: KLICK_MS }).catch(() => undefined);
  for (let i = 1; i <= ANTWORTEN_HOECHSTENS; i++) {
    await seite.waitForTimeout(WARTEN_MS);
    await seite.screenshot({ path: join(ORDNER, `${name}-dialog-${i}.png`) });
    const knopf = seite.getByTestId("abenteuer-dialog").getByRole("button").first();
    if (!(await knopf.isVisible().catch(() => false))) return;
    await knopf.click({ timeout: KLICK_MS }).catch(() => undefined);
  }
}

test("Heldin und Rivalin: Wahl, Welt und Porträts fallen sauber auf den Ersatz", async () => {
  test.skip(!STAND, "nur mit PROBE_STAND");
  test.setTimeout(PROBE_MS);
  mkdirSync(ORDNER, { recursive: true });
  const fehler: string[] = [];
  const pfad = process.env.CHROMIUM_PFAD;
  const browser = await chromium.launch(pfad ? { executablePath: pfad } : {});
  // 1. Die Wahl am Anfang: Bilder oder klar benannter Platzhalter.
  const kontext = await browser.newContext({ ...devices["Pixel 7"], baseURL: ADRESSE });
  const seite = await kontext.newPage();
  sammleFehler(seite, fehler);
  await starteImBrowser(seite);
  await seite.goto("/app/#abenteuer");
  await ladeAbenteuerpaket(seite);
  await expect(seite.getByTestId("abenteuer-spielen")).toBeVisible({ timeout: 30000 });
  await seite.getByTestId("abenteuer-figur-heldin-0").click();
  await seite.getByTestId("abenteuer-rivale-victoria").click();
  await seite.waitForTimeout(WARTEN_MS);
  await seite.screenshot({ path: join(ORDNER, "wahl.png"), fullPage: true });
  await kontext.close();
  // 2. Karten mit Victor: Heldin und Rivalin gewählt.
  const daten = ladeSpieldaten();
  const sim = JSON.parse(readFileSync(STAND, "utf8")) as Record<string, unknown>;
  for (const k of KARTEN) {
    const datei = join(ORDNER, `${k.karte}.stand.json`);
    const roh = k.akt3 ? (JSON.parse(readFileSync(STAND_AKT3, "utf8")) as typeof sim) : sim;
    writeFileSync(datei, JSON.stringify({ ...roh, karte: k.karte }));
    const stand = standAus(daten, datei);
    const ctx = await browser.newContext({ ...devices["Pixel 7"], baseURL: ADRESSE });
    const s = await ctx.newPage();
    sammleFehler(s, fehler);
    await starteMitStand(s, {
      ...stand,
      held: { ...stand.held, figur: "heldin-0" },
      position: { ...stand.position, x: k.x, y: k.y - 1, richtung: "unten" },
      dialogvariablen: { ...stand.dialogvariablen, ...k.variablen, rivalin: true },
    });
    await s.waitForTimeout(WARTEN_MS);
    await s.screenshot({ path: join(ORDNER, `${k.karte}.png`) });
    await sprichAn(s, k.karte);
    await ctx.close();
  }
  await browser.close();
  writeFileSync(join(ORDNER, "fehler.json"), JSON.stringify(fehler, null, 1));
  expect(fehler.filter((f) => !f.startsWith("warning"))).toEqual([]);
});
