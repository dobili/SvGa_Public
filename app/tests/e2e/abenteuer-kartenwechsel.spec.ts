/**
 * Schach-Abenteuer, Messung unter gedrosselter CPU (Auftrag 20.11.2026): Dauer der Kartenwechsel,
 * Bildrate beim Laufen und das längste Bild, während der Gegner nachdenkt. Keine Prüfung, sondern
 * ein Messwerkzeug; läuft nur mit ABENTEUER_KARTENWECHSEL=1.
 *
 * Warum: Ein echtes Handy steht nicht zur Verfügung. Chromium bremst die CPU über CDP
 * (Emulation.setCPUThrottlingRate) um den Faktor 4, etwa ein älteres Mittelklassehandy. Gemessen
 * wird je Drosselstufe (ABENTEUER_DROSSELUNG, Vorgabe „1,4“):
 * - Kartenwechsel: Ein Beobachter im Browser merkt, wann das Steuerkreuz verschwindet (die Welt
 *   baut ab) und wann es mit der neuen Leinwand wiederkommt. Gewechselt wird über „Reisen“
 *   zwischen sieben Städten (große Außenkarten) und durch das Haus in Maple Falls (Türen,
 *   Treppen, kleine Innenkarten).
 * - Laufen: je 3 s nach rechts und links, Bilder je Sekunde und längstes Bild.
 * - Gegnerzug: drei Züge außerhalb des Eröffnungsbuchs, längstes Bild, solange die Engine rechnet.
 * Aufruf (gegen `npm run build`):
 *   ABENTEUER_KARTENWECHSEL=1 CHROMIUM_PFAD=… PLAYWRIGHT_NUR_CHROMIUM=1 npx playwright test
 *   abenteuer-kartenwechsel --trace off
 * Ergebnis in docs/spiel/auftraege/ausdauer_19-11.md (Abschnitt Drosselung).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND } from "./abenteuer-affe";
import { raeumeAuf, reise, starteMitTon } from "./abenteuer-ausdauer-ablauf";
import { hauslauf, hausschritt, type Hausweg } from "./abenteuer-ausdauer-haus";

const DROSSELUNG = (process.env.ABENTEUER_DROSSELUNG ?? "1,4").split(",").map(Number);
const REISEN = 14;
const HAUSGAENGE = 12;
const LAUF_MS = 3000;
const ENGINE_FRIST = 60_000;
/** Ein Kartenwechsel über dieser Dauer gilt als Ausreißer (Auftrag: über 1 s). */
const AUSREISSER_MS = 1000;

const STAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.aussen", x: 3, y: 24, richtung: "unten" },
  besuchteOrte: [
    "mapleFalls",
    "cedarCreek",
    "riverton",
    "ironwood",
    "siliconBay",
    "portDelacroix",
    "desertSprings",
  ],
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    brettBeruehrt: true,
    ambroseErwachtGesehen: true,
    ersteLektionBesprochen: true,
    treppeAbendGesehen: true,
  },
};

/** Beobachter im Browser: je Kartenwechsel die Zeit ohne Steuerkreuz und die neue Karte. */
function beobachteWechsel(): void {
  const wechsel: { ms: number; kachel: string }[] = [];
  (window as unknown as { __wechsel: typeof wechsel }).__wechsel = wechsel;
  let weg: number | null = null;
  // Seit dem 26.11.2026 bleibt die Leinwand über alle Karten dieselbe (oberweltspiel.ts); eine neue
  // Karte erkennt man an der Nummer ihrer Szene (data-szene).
  let szene: string | null = null;
  new MutationObserver(() => {
    const kreuz = document.querySelector(".abenteuer-steuerkreuz button");
    const bild = document.querySelector(".abenteuer-welt canvas");
    const nummer = bild?.getAttribute("data-szene") ?? null;
    if (!kreuz && weg === null && szene) weg = performance.now();
    if (kreuz && bild && weg !== null && nummer !== szene) {
      const kachel = document.querySelector("[data-testid='abenteuer-kachel']")?.textContent;
      wechsel.push({ ms: Math.round(performance.now() - weg), kachel: kachel ?? "" });
      weg = null;
    }
    if (kreuz && bild) szene = nummer;
  }).observe(document, { subtree: true, childList: true, attributes: true });
}

/** Bilder je Sekunde und längstes Bild über eine Dauer; läuft im Browser. */
function bilderUeber(dauer: number): Promise<{ jeSekunde: number; laengstes: number }> {
  return new Promise((fertig) => {
    let bilder = 0;
    let laengstes = 0;
    const anfang = performance.now();
    let vorher = anfang;
    const schritt = (t: number) => {
      bilder += 1;
      laengstes = Math.max(laengstes, t - vorher);
      vorher = t;
      if (t - anfang < dauer) requestAnimationFrame(schritt);
      else
        fertig({
          jeSekunde: Math.round((bilder * 1000) / (t - anfang)),
          laengstes: Math.round(laengstes),
        });
    };
    requestAnimationFrame(schritt);
  });
}

/** Läuft je LAUF_MS nach rechts und links (Tasten) und misst die Bildrate. */
async function laufe(seite: Page): Promise<string> {
  const teile: string[] = [];
  for (const taste of ["ArrowRight", "ArrowLeft"]) {
    await seite.keyboard.down(taste);
    const m = await seite.evaluate(bilderUeber, LAUF_MS);
    await seite.keyboard.up(taste);
    teile.push(
      `${taste === "ArrowRight" ? "rechts" : "links"} ${m.jeSekunde}/s, längstes ${m.laengstes} ms`,
    );
  }
  return teile.join("; ");
}

/** Drei Züge außerhalb des Buchs; je das längste Bild, solange der Gegner rechnet. */
async function gegnerzuege(seite: Page): Promise<string> {
  await seite.getByTestId("abenteuer-reisebrettknopf").click();
  await seite.getByTestId("abenteuer-deck-los").click();
  const status = seite.getByTestId("partiestatus");
  await expect(status).toHaveText("Du bist am Zug.", { timeout: ENGINE_FRIST });
  const weiss = await seite.getByRole("button", { name: /^e2, Bauer \(Weiß\)/ }).isVisible();
  const zuege = weiss ? ["a2-a3", "h2-h3", "a3-a4"] : ["a7-a6", "h7-h6", "a6-a5"];
  const teile: string[] = [];
  for (const zug of zuege) {
    const [von, nach] = zug.split("-");
    await seite.getByRole("button", { name: new RegExp(`^${von ?? ""}, Bauer`) }).click();
    const messung = seite.evaluate(bilderUeber, 1500);
    await seite.getByRole("button", { name: nach ?? "", exact: true }).click();
    const m = await messung;
    await expect(status).toHaveText("Du bist am Zug.", { timeout: ENGINE_FRIST });
    teile.push(`${zug}: ${m.jeSekunde}/s, längstes ${m.laengstes} ms`);
  }
  await seite.getByTestId("abenteuer-partie-aufgeben").click();
  await seite.getByRole("button", { name: "Ja, aufgeben" }).click();
  await seite.getByTestId("partie-zurueck-zur-stadt").click();
  await raeumeAuf(seite);
  return teile.join("; ");
}

/** Liest die gemessenen Kartenwechsel seit dem letzten Lesen und leert die Liste. */
async function nimmWechsel(seite: Page): Promise<{ ms: number; kachel: string }[]> {
  return seite.evaluate(() => {
    const liste = (window as unknown as { __wechsel: { ms: number; kachel: string }[] }).__wechsel;
    return liste.splice(0);
  });
}

function zusammenfassung(name: string, liste: readonly { ms: number }[]): string {
  const ms = liste.map((w) => w.ms).sort((a, b) => a - b);
  const median = ms[Math.floor(ms.length / 2)] ?? 0;
  const ueber = ms.filter((m) => m > AUSREISSER_MS).length;
  return `${name}: ${ms.length} Wechsel, Median ${median} ms, längster ${ms.at(-1) ?? 0} ms, über 1 s: ${ueber}`;
}

for (const rate of DROSSELUNG) {
  test(`Kartenwechsel und Bildrate bei ${rate}× Drosselung`, async ({ page, browserName }) => {
    test.skip(!process.env.ABENTEUER_KARTENWECHSEL, "nur mit ABENTEUER_KARTENWECHSEL=1");
    test.skip(browserName !== "chromium", "Drosselung über CDP gibt es nur in Chromium");
    test.setTimeout(30 * 60_000);
    await page.addInitScript(beobachteWechsel);
    await starteMitTon(page, STAND);
    await raeumeAuf(page);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate });
    const zeilen: string[] = [`Drosselung ${rate}×`];
    zeilen.push(`Laufen außen: ${await laufe(page)}`);
    // Haus: Türen und Treppen (kleine Innenkarten).
    const lauf = hauslauf(page, cdp);
    const weg: Hausweg = { glied: 0 };
    let gaenge = 0;
    for (let i = 0; gaenge < HAUSGAENGE && i < HAUSGAENGE * 2; i++) {
      if (await hausschritt(lauf, weg)) gaenge += 1;
      await raeumeAuf(page);
    }
    const haus = await nimmWechsel(page);
    zeilen.push(zusammenfassung("Haus", haus));
    zeilen.push(`  einzeln: ${haus.map((w) => `${w.ms}`).join(", ")}`);
    // Reisen zwischen den Städten (große Außenkarten); zuerst wieder hinaus.
    for (
      let i = 0;
      i < HAUSGAENGE && !(await page.getByTestId("abenteuer-reisenknopf").isVisible());
      i++
    ) {
      await hausschritt(lauf, weg);
      await raeumeAuf(page);
    }
    await nimmWechsel(page);
    for (let i = 0; i < REISEN; i++) {
      await reise(page, i);
      await raeumeAuf(page);
    }
    const reisen = await nimmWechsel(page);
    zeilen.push(zusammenfassung("Reisen", reisen));
    zeilen.push(`  einzeln: ${reisen.map((w) => `${w.ms}`).join(", ")}`);
    zeilen.push(`Gegnerzug: ${await gegnerzuege(page)}`);
    console.log(zeilen.map((z) => `Kartenwechsel: ${z}`).join("\n"));
    expect(haus.length + reisen.length).toBeGreaterThan(0);
  });
}
