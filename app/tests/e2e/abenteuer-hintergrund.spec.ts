/**
 * Oberflächentest: Maia lädt nach dem Start des Spiels im Hintergrund (paket/aktton.ts,
 * anbindung/maiapflicht.ts; Auftrag „Größe und Startzeit“, 20.11.2026).
 *
 * Warum eigene Tests: Alle übrigen Abenteuertests schalten das Nachladen von Maia ab
 * (abenteuer-paket.ts, ohneMaiaImHintergrund), weil 92 MB Laden, Prüfen und Cache-Schreiben je
 * Test den Job „Chromium, Abenteuer“ von etwa 11 auf 26 Minuten brachten. Hier läuft es wie im
 * echten Spiel, und geprüft wird genau das Nachladen:
 * - Start, dann „lädt“ im Hintergrund, dann „Spiel geladen“, und Maia liegt im Speicher;
 * - danach ohne Netz vollständig, mit Maia;
 * - Neuladen mitten im Laden: keine losen Fehler, danach lädt es zu Ende.
 * Abhängigkeiten: abenteuer-affe.ts, abenteuer-paket.ts, hilfen.ts, offlinehilfen.ts.
 */
import { expect, test, type Page } from "@playwright/test";
import { beobachte, GRUNDSTAND, schreibeStandImBrowser, starteMitStand } from "./abenteuer-affe";
import { PAKET_FRIST_MS, warteAufHintergrund } from "./abenteuer-paket";
import { starteImBrowser, warteAufOffline } from "./hilfen";
import { gibNetzFrei, netzGesperrtFuerWorker, sperreNetz } from "./offlinehilfen";

/** So oft fragt der Test den Ladestand ab, um „lädt“ nicht zu verpassen (ms). */
const ABFRAGE_MS = 20;

/** Satz im Spielmenü, wenn alles auf dem Gerät liegt (de.json, abenteuer.ladestand.vollstaendig). */
const SPIEL_GELADEN = "Spiel geladen. Musik kommt beim ersten Hören dazu.";

/**
 * Meldung von WebKit, wenn ein Neuladen offene Cache-Vorgänge der alten Seite abbricht. Sie kommt
 * aus dem Browser, ohne JavaScript-Stapel, und betrifft die schon verlassene Seite (WebKit-Läufe vom
 * 20.11.2026); Chromium bricht dieselben Vorgänge still ab. Deshalb erwartet und übergangen nur dort.
 */
const WEBKIT_ABBRUCH = /Context is stopped|Cache API operation failed/;

/** Liegt Maia vollständig im Speicher „maia-1“ (wie maiaGeladen in app/maiapaket.ts)? */
function maiaImSpeicher(seite: Page): Promise<boolean> {
  return seite.evaluate(async () => {
    const speicher = await caches.open("maia-1");
    const basis = new URL("/maia/", window.location.href).href;
    const verzeichnis = await speicher.match(`${basis}maia.json`);
    if (!verzeichnis) return false;
    const inhalt = (await verzeichnis.json()) as {
      modelle: Record<string, { teile: string[] }>;
    };
    const dateien = [
      ...Object.values(inhalt.modelle).flatMap((m) => m.teile),
      "ort/ort-wasm-simd-threaded.wasm",
    ];
    const da = await Promise.all(dateien.map((d) => speicher.match(`${basis}${d}`)));
    return da.every((antwort) => antwort !== undefined);
  });
}

/** Schreibt jeden Ladestand am Wurzelelement mit (auch die kurzen), über Neuladen hinweg. */
async function zeichneLadestandAuf(seite: Page): Promise<void> {
  await seite.context().addInitScript(() => {
    const verlauf: string[] = [];
    Reflect.set(window, "__tonverlauf", verlauf);
    // Beim Einhängen gibt es das Wurzelelement noch nicht; deshalb das Dokument samt Unterbaum.
    new MutationObserver(() => {
      const art = document.documentElement.dataset.abenteuerTon ?? "";
      if (verlauf.at(-1) !== art) verlauf.push(art);
    }).observe(document, { subtree: true, attributeFilter: ["data-abenteuer-ton"] });
  });
}

/** Der aufgezeichnete Verlauf der Ladestände. */
function ladeverlauf(seite: Page): Promise<string[]> {
  return seite.evaluate(() => {
    const verlauf: unknown = Reflect.get(window, "__tonverlauf");
    return Array.isArray(verlauf) ? verlauf.map(String) : [];
  });
}

/** Öffnet das Spielmenü und prüft den Satz zum Ladestand. */
async function menueSagtGeladen(seite: Page): Promise<void> {
  await seite.getByTestId("abenteuer-menueknopf").click();
  await expect(seite.getByTestId("abenteuer-ladestand-menue")).toHaveText(SPIEL_GELADEN);
  await seite.getByRole("button", { name: "Weiterspielen" }).click();
}

test("Maia im Hintergrund: Start, „lädt“, dann „Spiel geladen“, Maia im Speicher", async ({
  page,
}) => {
  test.slow();
  await zeichneLadestandAuf(page);
  await starteMitStand(page, GRUNDSTAND, { mitMaia: true });
  // Die Welt war schon da, während Maia noch lud: Auf „lädt“ folgt „vollständig“.
  const verlauf = await ladeverlauf(page);
  expect(verlauf).toContain("laedt");
  expect(verlauf.at(-1)).toBe("vollstaendig");
  expect(await maiaImSpeicher(page)).toBe(true);
  await menueSagtGeladen(page);
});

test("Maia im Hintergrund: danach ohne Netz vollständig, mit Maia", async ({
  page,
  browserName,
}) => {
  test.slow();
  await starteImBrowser(page, { weitermachen: true });
  await warteAufOffline(page);
  await starteMitStand(page, GRUNDSTAND, { mitMaia: true });
  expect(await maiaImSpeicher(page)).toBe(true);
  await sperreNetz(page.context());
  if (browserName === "chromium") expect(await netzGesperrtFuerWorker(page)).toBe(true);
  await page.reload();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
  await warteAufHintergrund(page);
  // „Vollständig“ hieße ohne Netz auch ohne Maia so (aktton.ts); den Beweis liefert der Speicher.
  expect(await maiaImSpeicher(page)).toBe(true);
  await menueSagtGeladen(page);
  await gibNetzFrei(page.context());
});

test("Maia im Hintergrund: Neuladen mitten im Laden, keine losen Fehler, danach fertig", async ({
  page,
  browserName,
}) => {
  test.slow();
  test.info().setTimeout(test.info().timeout + PAKET_FRIST_MS);
  const funde = beobachte(page);
  await starteImBrowser(page, { weitermachen: true });
  await expect.poll(() => page.evaluate(schreibeStandImBrowser, GRUNDSTAND)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-start").getByTestId("abenteuer-laden").click();
  // Sobald Geräusche und Maia nachladen, neu laden (das Spielpaket ist dann schon da).
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.abenteuerTon ?? ""), {
      timeout: PAKET_FRIST_MS,
      intervals: [ABFRAGE_MS],
    })
    .toBe("laedt");
  await page.reload();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
  await warteAufHintergrund(page);
  expect(await maiaImSpeicher(page)).toBe(true);
  const lose = browserName === "webkit" ? funde.filter((f) => !WEBKIT_ABBRUCH.test(f)) : funde;
  expect(lose).toEqual([]);
});
