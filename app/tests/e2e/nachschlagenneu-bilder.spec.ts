/**
 * Steckbriefe und Glossar neu (31.10.2026, Entwürfe H2 und I3): Bildschirmfotos in Handybreite
 * (360 px), hell und dunkel, für den Bericht an den Autor (test-results/bilder/). Dazu die
 * wichtigsten Abläufe: Baum mit Zweispringerspiel unter der Italienischen Partie, Lexikonseite
 * mit Reiter, Suche und Sprung auf die Begriffsseite mit Diagramm.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

/**
 * Rechter Rand des Inhalts dieses Bildschirms (ohne die untere Leiste, die bei 360 px schon vorher
 * 10 px übersteht; im Bericht gemeldet). Die Buchstaben-Reiter laufen in ihrer eigenen Leiste
 * waagrecht weiter; gemessen wird die Leiste, nicht jeder Reiter.
 */
function inhaltsbreite(page: Page): Promise<number> {
  return page.evaluate(() =>
    Math.max(
      ...[...document.querySelectorAll(".bildschirm *")]
        .filter((e) => !e.closest(".lexikon-reiter button"))
        .map((e) => e.getBoundingClientRect().right),
    ),
  );
}

/** Handybreite aus dem Auftrag; hoch genug für ganze Seiten. */
const HANDY = { width: 360, height: 800 };

async function setzeFarbschema(page: Page, schema: "hell" | "dunkel"): Promise<void> {
  await page.addInitScript((farbschema) => {
    window.localStorage.setItem("svga.farbschema", farbschema);
  }, schema);
}

async function oeffneNachschlagen(page: Page, eintrag: RegExp): Promise<void> {
  await page.getByRole("navigation").getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: eintrag }).click();
}

for (const schema of ["dunkel", "hell"] as const) {
  test(`Steckbriefe neu: Eröffnungsbaum und Steckbrief (${schema})`, async ({ page }) => {
    await page.setViewportSize(HANDY);
    await setzeFarbschema(page, schema);
    await starteImBrowser(page);
    await oeffneNachschlagen(page, /^Steckbriefe/);
    await expect(page.getByTestId("steckbrief")).toHaveCount(13);
    // Kein Teil der Seite ragt seitlich heraus (Handybreite).
    expect(await inhaltsbreite(page)).toBeLessThanOrEqual(HANDY.width);
    await page.screenshot({
      path: `test-results/bilder/steckbriefe-baum-${schema}.png`,
      fullPage: true,
    });
    await page.getByTestId("steckbrief").filter({ hasText: "Zweispringerspiel" }).click();
    await expect(page.getByText("1. e4 e5 2. Sf3 Sc6 3. Lc4 Sf6")).toBeVisible();
    await page.screenshot({
      path: `test-results/bilder/steckbrief-seite-${schema}.png`,
      fullPage: true,
    });
  });

  test(`Glossar neu: Lexikonseite und Begriff (${schema})`, async ({ page }) => {
    await page.setViewportSize(HANDY);
    await setzeFarbschema(page, schema);
    await starteImBrowser(page);
    await oeffneNachschlagen(page, /^Glossar/);
    const reiter = page.getByRole("navigation", { name: "Anfangsbuchstaben" });
    await reiter.getByRole("button", { name: "F", exact: true }).click();
    await expect(page.getByRole("heading", { level: 2, name: "F" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Fesselung", exact: true })).toBeVisible();
    expect(await inhaltsbreite(page)).toBeLessThanOrEqual(HANDY.width);
    await page.screenshot({
      path: `test-results/bilder/glossar-lexikon-${schema}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Fesselung", exact: true }).click();
    await expect(page.getByTestId("stellungsbild").first()).toBeVisible();
    await page.screenshot({
      path: `test-results/bilder/glossar-begriff-${schema}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Zurück", exact: true }).click();
    // Der gewählte Buchstabe bleibt beim Zurückkommen.
    await expect(reiter.getByRole("button", { name: "F", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("searchbox", { name: "Begriff suchen" }).fill("gabel");
    await expect(page.getByRole("status")).toContainText("Treffer");
    await page.screenshot({
      path: `test-results/bilder/glossar-suche-${schema}.png`,
      fullPage: true,
    });
  });
}
