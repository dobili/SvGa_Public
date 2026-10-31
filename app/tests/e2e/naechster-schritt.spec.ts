/**
 * „Dein nächster Schritt“ (Gamifizierung P1): Karte oben im Buch, Knopf führt zum Ziel,
 * Alternativen, „Nicht jetzt“ bis morgen.
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

test("Karte schlägt die Tagesaufgabe vor, Alternative öffnet die erste Abbildung", async ({
  page,
}) => {
  await starteImBrowser(page);
  const karte = page.getByTestId("naechster-schritt");
  await expect(karte.getByRole("heading", { name: "Dein nächster Schritt" })).toBeVisible();
  await expect(page.getByTestId("naechster-text")).toHaveText("Die Tagesaufgabe wartet.");
  await karte.getByRole("button", { name: "Lösen" }).click();
  await expect(page.getByTestId("tagesaufgabe")).toBeVisible();
  await page.getByRole("button", { name: "Zurück zum Buch" }).click();
  await karte.getByText("Lieber etwas anderes?").click();
  await expect(page.getByTestId("naechster-andere")).toContainText("Fang vorn an: Kapitel 0");
  await karte.getByRole("button", { name: "Anfangen" }).click();
  await expect(page.getByRole("heading", { name: "Abb. 0.1" })).toBeVisible();
});

test("„Nicht jetzt“ blendet die Karte bis morgen aus", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 9, 31, 10) });
  await starteImBrowser(page);
  await page.getByTestId("naechster-schritt").getByRole("button", { name: "Nicht jetzt" }).click();
  await expect(page.getByTestId("naechster-schritt")).toBeHidden();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(page.getByTestId("naechster-schritt")).toBeHidden();
  await page.clock.setSystemTime(new Date(2026, 10, 1, 9));
  await page.reload();
  await expect(page.getByTestId("naechster-schritt")).toBeVisible();
});
