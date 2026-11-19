/**
 * Schach-Abenteuer ohne Netz (Nacharbeit zum 19.11.2026): Nach dem ersten Laden laufen die
 * Neuerungen vom 19.11. auch im Flugmodus: die Einleitung vor dem Haus mit dem Kartenwechsel ins
 * Wohnzimmer und der Ankunft (Dialoge und Karten aus dem Spielpaket), eine Partie mit Ende,
 * Ergebniskarte und der Rückmeldung danach. Die Zeitwertung (regeln/zeitwertung.ts,
 * zeitklassenwertung.ts) ist reiner Code im Bündel und lädt nichts nach.
 * Das Netz sperrt offlinehilfen.ts für Seite und Service Worker (in Chromium auch per Route).
 * Die Bilder der Einleitung gibt es noch nicht (nur Text); kommen sie, gehören sie ins Paket.
 */
import { expect, test, type Page } from "@playwright/test";
import { GRUNDSTAND, schreibeStandImBrowser, starteMitStand } from "./abenteuer-affe";
import { feldDarunter } from "./abenteuer-karte";
import { starteImBrowser, warteAufOffline } from "./hilfen";
import { gibNetzFrei, netzGesperrtFuerWorker, sperreNetz } from "./offlinehilfen";

/** So lange darf kein Gespräch mehr kommen, bis „durch“ gilt (Kartenwechsel dazwischen). */
const RUHE_MS = 1500;

/** Mit Enter durch alle Gespräche, bis RUHE_MS lang keins mehr kommt. */
async function mitEnterDurch(page: Page): Promise<void> {
  const dialog = page.getByTestId("abenteuer-dialog");
  let ruhigSeit = Date.now();
  for (let i = 0; i < 300 && Date.now() - ruhigSeit < RUHE_MS; i++) {
    if (await dialog.isVisible()) {
      await page.keyboard.press("Enter");
      ruhigSeit = Date.now();
    }
    await page.waitForTimeout(150);
  }
  await expect(dialog).toHaveCount(0);
}

/**
 * Spielstand laden, auf den Service Worker warten, Netz sperren, neu öffnen. Der Stand wird nach
 * dem Sperren noch einmal geschrieben: Beim ersten Öffnen läuft die Einleitung schon online und
 * führt den Helden ins Wohnzimmer; geprüft werden soll sie aber ohne Netz.
 */
async function ohneNetz(page: Page, stand: object, browserName: string): Promise<void> {
  // „Offline bereit“ steht in den Einstellungen der App; mit Spielstand öffnet die App gleich das
  // Spiel, dessen Ansicht die Leiste nicht hat. Deshalb erst warten, dann den Stand einspielen.
  await starteImBrowser(page, { weitermachen: true });
  await warteAufOffline(page);
  await starteMitStand(page, stand);
  await sperreNetz(page.context());
  if (browserName === "chromium") expect(await netzGesperrtFuerWorker(page)).toBe(true);
  await expect.poll(() => page.evaluate(schreibeStandImBrowser, stand)).toBe(true);
  // Nur der Hash wäre gleich: goto lüde nicht neu, deshalb reload (dann zählt der Stand von oben).
  await page.reload();
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 40000 });
}

test("ohne Netz: Einleitung, Kartenwechsel ins Wohnzimmer, Ankunft", async ({
  page,
  browserName,
}) => {
  test.slow();
  const frisch = {
    ...GRUNDSTAND,
    position: { karte: "mapleFalls.aussen", x: 3, y: 24, richtung: "unten" },
    dialogvariablen: {},
  };
  await ohneNetz(page, frisch, browserName);
  const dialog = page.getByTestId("abenteuer-dialog");
  await expect(dialog).toBeVisible({ timeout: 20000 });
  await mitEnterDurch(page);
  await expect(page.getByTestId("abenteuer-kachel")).toHaveText(/\d+,\d+/);
  await expect(page.getByText(/fehlt|nicht laden|Fehler/)).toHaveCount(0);
  await gibNetzFrei(page.context());
});

test("ohne Netz: Partie, Ergebniskarte und Rückmeldung", async ({ page, browserName }) => {
  test.slow();
  const beiJo = {
    ...GRUNDSTAND,
    position: {
      karte: "mapleFalls.park",
      ...feldDarunter("maple-falls-park", "skaterJo"),
      richtung: "oben",
    },
  };
  await ohneNetz(page, beiJo, browserName);
  await page.getByTestId("abenteuer-aktion").click();
  const deckwahl = page.getByTestId("abenteuer-deckwahl");
  for (let i = 0; i < 30 && !(await deckwahl.isVisible()); i++) {
    if (await page.getByTestId("abenteuer-dialog").isVisible()) await page.keyboard.press("Enter");
    await page.waitForTimeout(150);
  }
  await page.getByTestId("abenteuer-deck-los").click();
  await page.getByTestId("abenteuer-erzaehlung-weiter").click({ timeout: 30000 });
  await expect(page.getByTestId("partie")).toBeVisible();
  await page.getByTestId("abenteuer-test-sieg").click();
  await page.getByTestId("partie-zurueck-zur-stadt").click();
  const ergebnis = page.getByTestId("abenteuer-ergebnis");
  await expect(ergebnis).toBeVisible({ timeout: 30000 });
  await ergebnis.getByRole("button", { name: "Weiter", exact: true }).click();
  await expect(page.getByTestId("abenteuer-dialog")).toBeVisible({ timeout: 20000 });
  await mitEnterDurch(page);
  await gibNetzFrei(page.context());
});
