/**
 * Zusatzinhalte ohne Netz (Vortest der offenen Testpunkte, 17.11.2026): Nach dem ersten Laden
 * laufen die Lichess-Zusatzaufgaben im Taktiktrainer (N1078), die Listen „Berühmte Partien“ und
 * „Aktuelle Turniere“ in „Zug erraten“ (N1064) und die verlängerte Praxis-Runde im
 * Repertoire-Trainer (N2553) auch im Flugmodus. Das Netz sperrt offlinehilfen.ts für Seite und
 * Service Worker (in Chromium auch per Route), wie im Offline-Test des Durchstichs.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneTrainer, starteImBrowser, waehleInZeile, warteAufOffline } from "./hilfen";
import { gibNetzFrei, netzGesperrtFuerWorker, sperreNetz } from "./offlinehilfen";

const feld = (seite: Page, name: string) =>
  seite.locator(".brett-tasten").getByRole("button", { name: new RegExp(`^${name}(,|$)`) });

/** Mindestzahl der Berühmten Partien in der Liste (wie zugerraten-zusatz.spec.ts). */
const BERUEHMTE_MINDESTENS = 40;

test("Flugmodus: Zusatzaufgaben, Zusatzpartien und verlängerte Praxis-Runde (N1078, N1064, N2553)", async ({
  page,
  context,
  browserName,
}) => {
  await starteImBrowser(page);
  await warteAufOffline(page);
  await sperreNetz(context);
  if (browserName === "chromium") expect(await netzGesperrtFuerWorker(page)).toBe(true);
  await page.goto("/app/");
  // Taktiktrainer, Zusatzaufgaben von Lichess: Themen da, die Runde läuft.
  await oeffneTrainer(page, "taktik");
  await waehleInZeile(page, "taktik-quelle", "Zusätzlich Lichess");
  await waehleInZeile(page, "zeile-motiv", /^Matt in einem Zug/);
  await page.getByTestId("taktik-start-runde").click();
  await expect(page.getByTestId("trainerrunde")).toContainText("Aufgabe 1 von 8");
  await expect(page.getByTestId("zusatz-herkunft")).toContainText("Lichess (CC0)");
  // Zug erraten: beide Listen der Zusatzpartien kommen.
  await oeffneTrainer(page, "zugErraten");
  const liste = page.getByTestId("zugerraten-partieliste");
  await waehleInZeile(page, "zugerraten-quelle", "Berühmte Partien");
  await expect
    .poll(() => liste.locator("option").count())
    .toBeGreaterThanOrEqual(BERUEHMTE_MINDESTENS);
  await waehleInZeile(page, "zugerraten-quelle", "Aktuelle Turniere");
  await expect.poll(() => liste.locator("option").count()).toBeGreaterThan(0);
  // Repertoire aus der Praxis: Old Sicilian geht auch ohne Netz über den Namen hinaus.
  await oeffneTrainer(page, "repertoire");
  await page.getByTestId("repertoire-praxis").getByRole("checkbox").check();
  const zeile = page.getByTestId("staerkewahl").locator("li", {
    has: page.getByRole("button", { name: /^Sizilianische Verteidigung/ }),
  });
  await zeile.getByTestId("variantenbaum").locator("summary").first().click();
  await zeile.getByRole("button", { name: /^Old Sicilian/ }).click();
  await waehleInZeile(page, "zeile-seite", "Weiß");
  await page
    .getByTestId("repertoire-wahl")
    .getByRole("button", { name: /Runde starten/ })
    .click();
  const zuege = page.getByTestId("repertoire-zuege");
  for (const [von, nach] of [
    ["e2", "e4"],
    ["g1", "f3"],
    ["f1", "c4"],
  ] as const) {
    await feld(page, von).click();
    await feld(page, nach).click();
  }
  await expect(zuege).toHaveText("1. e4 c5 2. Sf3 Sc6 3. Lc4 e6");
  await gibNetzFrei(context);
});
