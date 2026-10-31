/**
 * Bildschirmfotos der neuen Startkarten der Trainer (Entwurf G1, 31.10.2026) in Handybreite
 * (390 Pixel), hell und dunkel: Taktiktrainer (drei Zeilen, Serie), Zähltrainer (Stufe, zweiter
 * Modus), Endspieltrainer (Gruppe, Stufe, Kurzübungen), „Falle oder Köder“ (nur Stufe) und der
 * Taktiktrainer mit aufgeklappter Stufenwahl. Die Bilder landen in test-results/bilder/ für den
 * Bericht an den Autor. Dazu prüft der Test, dass die Karte nicht breiter als der Bildschirm ist.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneTrainer, starteImBrowser } from "./hilfen";

const BREITE = 390;
const TRAINER = ["taktik", "zaehlen", "endspiel", "falle"] as const;

/** Farbschema für den nächsten Seitenaufbau festlegen. */
async function setzeSchema(page: Page, schema: "hell" | "dunkel"): Promise<void> {
  await page.addInitScript((farbschema) => {
    window.localStorage.setItem("svga.farbschema", farbschema);
  }, schema);
}

for (const schema of ["dunkel", "hell"] as const) {
  test(`Trainer-Startkarten: Bilder (${schema})`, async ({ page }) => {
    await page.setViewportSize({ width: BREITE, height: 1100 });
    await starteImBrowser(page);
    await setzeSchema(page, schema);
    await page.goto("/app/");
    for (const kennung of TRAINER) {
      await oeffneTrainer(page, kennung);
      const karte = page.locator(".startkarte");
      await expect(karte.locator(".startkopf-brett .brett")).toBeVisible();
      const breite = await karte.evaluate((k) => k.scrollWidth);
      expect(breite).toBeLessThanOrEqual(BREITE);
      await page
        .getByTestId("trainer")
        .screenshot({ path: `test-results/bilder/trainerstart-${kennung}-${schema}.png` });
    }
    await oeffneTrainer(page, "taktik");
    await page.getByTestId("zeile-stufe").getByRole("button").first().click();
    await page
      .getByTestId("trainer")
      .screenshot({ path: `test-results/bilder/trainerstart-taktik-stufe-${schema}.png` });
  });
}
