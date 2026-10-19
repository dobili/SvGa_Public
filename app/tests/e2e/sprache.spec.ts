/**
 * Oberflächentests für die Technik der englischen Fassung (seit 0.2.94, AP 18 ohne Übersetzung):
 * `<html lang>` folgt der Sprache, die Sprachwahl erscheint erst mit einer zweiten Sprache, Züge
 * im Klartext der Unterschrift stehen wie im Buch, die Lizenzen kommen aus der Sprachdatei.
 */
import { expect, test } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

test("Sprache: html lang, keine Wahl mit nur einer Sprache, Unterschrift und Lizenzen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");

  // Die markierten Klartextzüge erscheinen auf Deutsch unverändert (Abb. 1.2: „Nach 2. Lf4 –“).
  await oeffneAbbildung(page, "1.2", "1.2");
  await expect(page.locator(".unterschrift").first()).toContainText("Nach 2. Lf4 – Ziel 1");

  await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await page.getByRole("tab", { name: "Anzeige" }).click();
  await expect(page.getByText("Deutsch (Englisch folgt mit der englischen Ausgabe)")).toBeVisible();
  await expect(page.getByRole("radiogroup", { name: "Sprache" })).toHaveCount(0);

  // Der Sprung über die Adresse wirkt beim Start der App (wie aus der Fußzeile der Startseite).
  await page.goto("/app/#lizenzen");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Lizenzen", level: 1 })).toBeVisible();
  await expect(page.getByText("Stockfish 19 (Stockfish.js, Chess.com)")).toBeVisible();
  await expect(page.getByRole("link", { name: "Lizenztext" }).first()).toBeVisible();
});
