/**
 * Oberflächentests für die Technik der englischen Fassung (seit 0.2.94, AP 18 ohne Übersetzung):
 * `<html lang>` folgt der Sprache, Deutsch ist gewählt (Englisch seit 0.2.104 nur als Vorschau
 * auf Wahl), Züge im Klartext der Unterschrift stehen wie im Buch und auf Englisch mit englischen
 * Buchstaben (seit P6 in der englischen Unterschrift), die Lizenzen kommen aus der Sprachdatei.
 */
import { expect, test } from "@playwright/test";
import { oeffneAbbildung, oeffneEinstellungen, starteImBrowser } from "./hilfen";

test("Sprache: html lang, Deutsch gewählt, Unterschrift in beiden Sprachen und Lizenzen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");

  // Die markierten Klartextzüge erscheinen auf Deutsch unverändert (Abb. 1.2: „Nach 2. Lf4 –“).
  await oeffneAbbildung(page, "1.2", "1.2");
  await expect(page.locator(".unterschrift").first()).toContainText("Nach 2. Lf4 – Ziel 1");

  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Anzeige" }).click();
  await expect(page.getByRole("radio", { name: "Deutsch" })).toHaveAttribute(
    "aria-checked",
    "true",
  );

  // Englisch: die englische Unterschrift (P6), der Zug mit englischem Buchstaben („2. Bf4“).
  await page.getByRole("radio", { name: "English (preview)" }).click();
  await page.getByRole("navigation").getByRole("button", { name: "Book" }).click();
  await page.getByLabel("Open figure").fill("1.2");
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page.locator(".unterschrift").first()).toContainText("After 2. Bf4 – Goal 1");
  await page.getByRole("navigation").getByRole("button", { name: "Profile", exact: true }).click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("tab", { name: "Display" }).click();
  await page.getByRole("radio", { name: "Deutsch" }).click();

  // Der Sprung über die Adresse wirkt beim Start der App (wie aus der Fußzeile der Startseite).
  await page.goto("/app/#lizenzen");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Lizenzen", level: 1 })).toBeVisible();
  await expect(
    page.getByText("Stockfish 19 (Stockfish.js von Nathan Rugg, Chess.com)"),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Lizenztext" }).first()).toBeVisible();
});
