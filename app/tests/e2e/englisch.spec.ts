/**
 * Oberflächentest der englischen Vorschau (seit 0.2.104): Wahl in den Einstellungen, Texte und
 * `<html lang>` auf Englisch, Wahl übersteht das Neuladen, Abbildung als „Fig.“ mit den englischen
 * Buchdaten (seit P6), Spielen und Training auf Englisch. Seit V4 lädt Englisch erst auf Wahl:
 * ohne Netz eine Meldung, mit Netz danach auch offline.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneEinstellungen, starteImBrowser, warteAufOffline } from "./hilfen";

const BILDER = "test-results/bilder";

test("Englische Vorschau: wählen, Buch, Abbildung, Spielen, Training", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
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

/** Wie viele Dateien unter /daten/en/ in allen Speichern des Service Workers liegen. */
async function englischImSpeicher(seite: Page): Promise<number> {
  return seite.evaluate(async () => {
    const speicher = await Promise.all((await caches.keys()).map((name) => caches.open(name)));
    const anfragen = (await Promise.all(speicher.map((s) => s.keys()))).flat();
    return anfragen.filter((a) => new URL(a.url).pathname.startsWith("/daten/en/")).length;
  });
}

test("Englisch ohne Netz vor dem ersten Laden: Meldung, App bleibt deutsch (V4)", async ({
  page,
  context,
}) => {
  await starteImBrowser(page);
  await warteAufOffline(page);
  // Der Kern ist vorab geladen, das englische Sprachpaket nicht (V4).
  expect(await englischImSpeicher(page)).toBe(0);
  await context.setOffline(true);
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Anzeige" }).click();
  await page.getByRole("radio", { name: "English (preview)" }).click();
  await expect(page.getByTestId("sprachwahl-ohne-netz")).toContainText("keine Verbindung");
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.getByRole("radio", { name: "Deutsch" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  // Mit Netz klappt der Wechsel; danach lädt das Paket nach, und Englisch geht auch offline.
  await context.setOffline(false);
  await page.getByRole("radio", { name: "English (preview)" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByTestId("sprachwahl-ohne-netz")).toHaveCount(0);
  await expect.poll(() => englischImSpeicher(page), { timeout: 30_000 }).toBeGreaterThan(20);
  await context.setOffline(true);
  await page.reload();
  await page.getByLabel("Open figure").fill("1.26");
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page.locator(".unterschrift")).toContainText("After 5... Qb6, White to move.");
  await context.setOffline(false);
});
