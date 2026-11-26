/**
 * Schach-Abenteuer, Zeitlupe nach dem Kartenwechsel (Befund des Autors, iPhone, 26.11.2026):
 * Direkt nach jedem Kartenwechsel lief das Spiel 2 bis 3 Sekunden wie in Zeitlupe.
 *
 * Ursache (gemessen): Die App startet je Karte ein neues Phaser-Spiel, und Phaser begrenzt in den
 * ersten 120 Bildern jedes Spiels das Zeitdelta auf ein Sechzigstel Sekunde (TimeStep, panicMax).
 * Dauert ein Bild länger (Bilder werden geladen und hochgeladen, langsames Handy), läuft die Welt
 * entsprechend langsamer, statt aufzuholen. Abhilfe: zeitbasis.ts.
 *
 * Wie gemessen wird: Der Held pendelt mit gehaltener Taste über den Rand zwischen der Außenkarte
 * von Maple Falls und dem Park (zwei große Außenkarten), so wie ein Spieler läuft. Ab der neuen
 * Leinwand zählen die Feldwechsel; das Tempo über die ersten Felder wird mit dem Solltempo des
 * Helden verglichen. In Chromium mit gedrosselter CPU (CDP), damit die ersten Bilder lang werden
 * wie auf dem Handy.
 * Dauertest: sechsfach gedrosselt, das Anfangstempo nach dem Wechsel zurück nach Maple Falls
 * mindestens 88 % des Solltempos. Mit ABENTEUER_ZEITLUPE=1 statt des Dauertests der Messlauf über mehrere Wechsel
 * und Drosselstufen (ABENTEUER_DROSSELUNG, Vorgabe „1,4,6“), Ergebnis in der Ausgabe („Zeitlupe:“).
 * Aufruf (gegen `npm run build`):
 *   ABENTEUER_ZEITLUPE=1 CHROMIUM_PFAD=… PLAYWRIGHT_NUR_CHROMIUM=1 npx playwright test
 *   abenteuer-zeitlupe --trace off
 */
import { expect, test, type Page } from "@playwright/test";
import { leererAbenteuerstand } from "../../src/abenteuer/regeln/spielstand";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { raeumeAuf } from "./abenteuer-ausdauer-ablauf";
import {
  freieStrecke,
  liesAufzeichnung,
  werteAus,
  zeichneAuf,
  type Lauf,
} from "./abenteuer-zeitlupe-messung";

const MESSLAUF = Boolean(process.env.ABENTEUER_ZEITLUPE);
const DROSSELUNG = (process.env.ABENTEUER_DROSSELUNG ?? "1,4,6").split(",").map(Number);
/**
 * Drosselung des Dauertests. Bei vierfacher Drosselung blieben die Bilder im Headless-Chromium
 * meist kurz (vorher 89 bis 102 %); erst sechsfach zeigte sich die Zeitlupe deutlich.
 */
const DAUERTEST_DROSSELUNG = 6;
/** So viele Kartenwechsel je Drosselstufe im Messlauf (hin und her). */
const WECHSEL_MESSLAUF = 6;
/** Nach der neuen Leinwand hält der Finger die Richtung noch so lange. */
const LAUF_MS = 5000;
/** So lange darf es höchstens bis zum Kartenwechsel dauern (zurück über die ganze Strecke). */
const WECHSEL_FRIST_MS = 60_000;
/**
 * Tempo über die ersten Felder nach der Ankunft in Maple Falls gegen das Solltempo: mindestens
 * dieser Anteil. Gemessen 26.11.2026, sechsfach gedrosselt: vorher 67 bis 80 %, nachher 94 bis
 * 109 % (über 100 %: Phasers Glättung holt lange Bilder in den folgenden nach).
 */
const MINDESTANTEIL = 0.88;
/** So oft fragt der Test im Browser nach der ersten Kachelmeldung (etwa einmal je Bild). */
const ABFRAGE_MS = 16;
/** Ab hier läuft der Held nach rechts in den Park: drei Felder vor dem Rand (Übergang „park“). */
const START = { karte: "mapleFalls.aussen", x: 60, y: 26, richtung: "rechts" };

const STAND = {
  // Vollständig wie ein echter Stand: Der Spieler-Durchlauf liest alle Listen (Karten, Funde …).
  ...leererAbenteuerstand(new Date(0), "Kim", null, false),
  ...GRUNDSTAND,
  position: START,
  // Hinweise und Erklärungen gelten als gesehen: Sie hielten den Helden mitten im Lauf an.
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    brettBeruehrt: true,
    ambroseErwachtGesehen: true,
    ersteLektionBesprochen: true,
    treppeAbendGesehen: true,
    hinweisSteuerkreuz: true,
    hinweisAktion: true,
    hinweisTagebuch: true,
    hinweisMenue: true,
    hinweisRennen: true,
    muenzenErklaert: true,
    staerkeErklaert: true,
  },
};

declare global {
  interface Window {
    __zeitlupe: { leinwaende: number[]; kacheln: { t: number }[] };
  }
}

/**
 * Hält die Taste, bis die Karte wechselt, und noch LAUF_MS danach. Ausgabe: Kennzahlen ab der neuen
 * Leinwand, mit der freien Strecke ab dem ersten Feld auf der neuen Karte.
 */
async function laufeHinueber(seite: Page, taste: string): Promise<Lauf> {
  await liesAufzeichnung(seite);
  await seite.keyboard.down(taste);
  await seite.waitForFunction(() => window.__zeitlupe.leinwaende.length > 0, null, {
    timeout: WECHSEL_FRIST_MS,
  });
  const los = await seite.evaluate(() => window.__zeitlupe.leinwaende.at(-1) ?? 0);
  // Die neue Karte kennt den gehaltenen Tastendruck nicht: sobald ihre Szene steht (erste
  // Kachelmeldung), loslassen und gleich wieder drücken.
  await seite.waitForFunction((t) => window.__zeitlupe.kacheln.some((k) => k.t >= t), los, {
    timeout: WECHSEL_FRIST_MS,
    polling: ABFRAGE_MS,
  });
  await seite.keyboard.up(taste);
  await seite.keyboard.down(taste);
  await seite.waitForTimeout(LAUF_MS);
  await seite.keyboard.up(taste);
  const roh = await liesAufzeichnung(seite);
  const ankunft = roh.kacheln.find((k) => k.t >= los) ?? { x: 0, y: 0 };
  const felder = await freieStrecke(seite, taste, ankunft);
  await raeumeAuf(seite);
  return werteAus(roh, los, felder);
}

async function drossele(seite: Page, rate: number): Promise<void> {
  const cdp = await seite.context().newCDPSession(seite);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate });
}

function zeile(name: string, lauf: Lauf): string {
  const b = lauf.bilder;
  return (
    `${name}: Tempo ${Math.round(lauf.anteil * 100)} %, Szene steht nach ${lauf.szeneMs} ms, ` +
    `Felder/s ${lauf.feldJeSekunde.join(" | ")}; ` +
    `erste 3 s: ${b.zahl} Bilder, über 33 ms ${b.ueber33}, über 50 ms ${b.ueber50}, ` +
    `längstes ${b.laengstes} ms; über 100 ms (ab Leinwand: Dauer) ${lauf.langeBilder.join(" ")}`
  );
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
  await page.addInitScript(zeichneAuf);
});

for (const rate of MESSLAUF ? DROSSELUNG : []) {
  test(`Messlauf Zeitlupe bei ${rate}× Drosselung`, async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Drosselung über CDP gibt es nur in Chromium");
    test.setTimeout(15 * 60_000);
    await starteMitStand(page, STAND);
    await raeumeAuf(page);
    await drossele(page, rate);
    const zeilen = [`Drosselung ${rate}×`];
    for (let i = 0; i < WECHSEL_MESSLAUF; i++) {
      const inDenPark = i % 2 === 0;
      const lauf = await laufeHinueber(page, inDenPark ? "ArrowRight" : "ArrowLeft");
      zeilen.push(zeile(inDenPark ? "→ Park" : "→ Maple Falls", lauf));
    }
    console.log(zeilen.map((z) => `Zeitlupe: ${z}`).join("\n"));
  });
}

test("Nach dem Kartenwechsel läuft der Held gleich in voller Geschwindigkeit", async ({
  page,
  browserName,
}) => {
  test.skip(MESSLAUF, "Messlauf statt Dauertest");
  test.skip(browserName !== "chromium", "Drosselung über CDP gibt es nur in Chromium");
  test.setTimeout(3 * 60_000);
  await starteMitStand(page, STAND);
  await raeumeAuf(page);
  await drossele(page, DAUERTEST_DROSSELUNG);
  // Hin in den Park, gemessen wird der Rückweg auf die große Außenkarte (die längeren Bilder).
  await laufeHinueber(page, "ArrowRight");
  const lauf = await laufeHinueber(page, "ArrowLeft");
  console.log(`Zeitlupe: ${zeile("Dauertest → Maple Falls", lauf)}`);
  expect(lauf.anteil).toBeGreaterThanOrEqual(MINDESTANTEIL);
});
