/**
 * Oberflächentests zu den Wünschen des Autors vom 19.10.2026 (0.2.99): Steckbriefe und Werkzeuge
 * in Nachschlagen, Porträt für eigene Bots, Spielhilfen über „Partie beginnen“.
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

test("Nachschlagen: Steckbriefe mit Fallencheck und Werkzeuge des Buches", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Steckbriefe/ }).click();
  await expect(page.getByTestId("steckbrief")).toHaveCount(13);
  const falle = page.getByTestId("fallencheck").filter({ hasText: "Klammerfalle" });
  await falle.locator("summary").click();
  await expect(falle).toContainText("Wer tappt hinein?");
  await falle.getByRole("button", { name: "Zum Stopp-Moment (Abb. 4.2)" }).click();
  await expect(page.getByRole("heading", { name: "Abb. 4.2" })).toBeVisible();
  await page.getByRole("navigation").getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Werkzeuge des Buches/ }).click();
  await page.locator(".werkzeugeintrag summary", { hasText: "Röntgen" }).first().click();
  await expect(page.getByText(/Regel: Kapitel 1, Schach-Röntgen-Regel/)).toBeVisible();
});

test("Eigener Bot mit Porträt; Spielhilfen stehen über „Partie beginnen“", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  const hilfen = page.getByRole("checkbox", { name: /Gewertete Partie/ });
  const beginnen = page.getByRole("button", { name: "Partie beginnen" });
  const [yHilfen, yBeginnen] = await Promise.all([hilfen.boundingBox(), beginnen.boundingBox()]);
  expect(yHilfen?.y ?? 0).toBeLessThan(yBeginnen?.y ?? 0);
  await page.getByRole("radio", { name: "Eigene Bots" }).click();
  await page.getByRole("button", { name: "Neuen Gegner anlegen" }).click();
  await page.getByLabel("Name").fill("Tante Erna");
  await page.getByLabel("Porträt").selectOption("wahl-25");
  await page.getByRole("button", { name: "Gegner speichern" }).click();
  await page.getByRole("radio", { name: /Tante Erna/ }).click();
  const blase = page.getByTestId("gegner-sprechblase");
  await expect(blase.locator("img")).toHaveAttribute("src", /gegner\/wahl-25\.svg$/);
});
