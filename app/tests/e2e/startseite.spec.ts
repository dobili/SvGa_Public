/**
 * Oberflächentests für die Startseite des Buches (Entscheidung des Autors, 15.10.2026): Buch und
 * Shops unter /, Installationsteil ohne Shops unter /installieren/ (QR-Code), die installierte App
 * springt direkt nach /app/, Impressum, Datenschutz und Lizenzen sind erreichbar.
 */
import { expect, test } from "@playwright/test";

test("Startseite: Buch, Shops, Installationsteil, Fußzeile; „Im Browser verwenden“ öffnet die App", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Schach von Grund auf/);
  await expect(page.getByRole("heading", { name: "Das Buch", exact: true })).toBeVisible();
  await expect(page.getByTestId("shops")).toContainText("im Buchhandel");
  await expect(page.getByTestId("installationsteil")).toContainText("Die App zum Buch");
  const vorschau = page.locator('meta[property="og:image"]');
  await expect(vorschau).toHaveAttribute("content", /cover-teilen\.jpg$/);
  await page.screenshot({ path: "test-results/bilder/startseite.png", fullPage: true });
  await page.getByRole("link", { name: "Im Browser verwenden" }).click();
  await expect(page).toHaveURL(/\/app\/$/);
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
});

test("/installieren/ (QR-Code im Buch): nur der Installationsteil, ohne Shops", async ({
  page,
}) => {
  await page.goto("/installieren/");
  await expect(page.getByTestId("installationsteil")).toBeVisible();
  await expect(page.getByTestId("shops")).toHaveCount(0);
  await page.getByRole("link", { name: "Zum Buch" }).click();
  await expect(page.getByTestId("shops")).toBeVisible();
});

test("die installierte App startet direkt in der App, auch von / aus", async ({ page }) => {
  await page.addInitScript(() => {
    const echt = window.matchMedia.bind(window);
    window.matchMedia = (abfrage: string) =>
      abfrage === "(display-mode: standalone)"
        ? ({ ...echt(abfrage), matches: true } as MediaQueryList)
        : echt(abfrage);
  });
  await page.goto("/");
  await expect(page).toHaveURL(/\/app\/$/);
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
});

test("Impressum, Datenschutz und Lizenzen aus der Fußzeile", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Impressum" }).click();
  await expect(page.getByRole("heading", { name: "Impressum" })).toBeVisible();
  await page.getByRole("link", { name: "Datenschutz" }).click();
  await expect(page.getByRole("heading", { name: "Datenschutz" })).toBeVisible();
  await page.getByRole("link", { name: "Zur Startseite" }).click();
  await page.getByRole("link", { name: "Lizenzen" }).click();
  await expect(page.getByRole("heading", { name: "Lizenzen", level: 1 })).toBeVisible();
  await expect(page.getByText("GNU GPL 3.0 oder neuer")).toBeVisible();
});
