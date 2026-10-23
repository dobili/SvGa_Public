/**
 * Oberflächentest der englischen Vorschau (seit 0.2.104): Wahl in den Einstellungen, Texte und
 * `<html lang>` auf Englisch, Wahl übersteht das Neuladen, Abbildung als „Fig.“ mit den englischen
 * Buchdaten (seit P6), Spielen und Training auf Englisch.
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

const BILDER = "test-results/bilder";

test("Englische Vorschau: wählen, Buch, Abbildung, Spielen, Training", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await page.getByRole("tab", { name: "Anzeige" }).click();
  await page.getByRole("radio", { name: "English (preview)" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.screenshot({ path: `${BILDER}/en-einstellungen.png`, fullPage: true });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Book" })).toBeVisible();
  await page.screenshot({ path: `${BILDER}/en-buch.png`, fullPage: true });
  await page.getByLabel("Open figure").fill("1.26");
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Fig. 1.26" })).toBeVisible();
  await expect(page.locator(".bildschirm-abbildung .brettbereich")).toBeVisible();
  // Bildunterschrift aus /daten/en/ mit englischen Figurenbuchstaben (P6).
  await expect(page.locator(".unterschrift")).toContainText("After 5... Qb6, White to move.");
  await page.screenshot({ path: `${BILDER}/en-abbildung.png`, fullPage: true });
  await page.getByRole("navigation").getByRole("button", { name: "Play" }).click();
  await expect(page.getByRole("heading", { name: "Play" })).toBeVisible();
  await page.screenshot({ path: `${BILDER}/en-spielen.png`, fullPage: true });
  await page.getByRole("navigation").getByRole("button", { name: "Training" }).click();
  await page.screenshot({ path: `${BILDER}/en-training.png`, fullPage: true });
});
