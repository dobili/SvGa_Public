/**
 * „Dein nächster Schritt“ (Gamifizierung P1): Karte oben im Buch, Knopf führt zum Ziel,
 * Alternativen, „Nicht jetzt“ bis morgen.
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

test("Karte „Heute“ schlägt die Tagesaufgabe vor, Alternative öffnet die erste Abbildung", async ({
  page,
}) => {
  await starteImBrowser(page);
  const karte = page.getByTestId("heute");
  await expect(karte.getByRole("heading", { name: "Heute" })).toBeVisible();
  const erster = karte.getByTestId("heute-vorschlag");
  await expect(erster).toHaveAccessibleName("Tagesaufgabe: Die Tagesaufgabe wartet.");
  await expect(erster).toContainText("1 Stellung für heute");
  await erster.click();
  await expect(page.getByTestId("tagesaufgabe")).toBeVisible();
  await page.getByRole("button", { name: "Zurück zum Buch" }).click();
  const anfangen = karte.getByTestId("heute-alternative-weiterlesen");
  await expect(anfangen).toHaveAccessibleName(/^Anfangen: Fang vorn an: Kapitel 0/);
  await expect(anfangen).toContainText("Abb. 0.1");
  await anfangen.click();
  await expect(page.getByRole("heading", { name: "Abb. 0.1" })).toBeVisible();
});

test("„Nicht jetzt“ blendet die Vorschläge bis morgen aus", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 9, 31, 10) });
  await starteImBrowser(page);
  await page.getByTestId("heute").getByRole("button", { name: "Nicht jetzt" }).click();
  // Ohne Lerntag hat die Woche noch nichts zu zeigen: Die ganze Karte verschwindet.
  await expect(page.getByTestId("heute")).toBeHidden();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(page.getByTestId("heute")).toBeHidden();
  await page.clock.setSystemTime(new Date(2026, 10, 1, 9));
  await page.reload();
  await expect(page.getByTestId("heute-vorschlag")).toBeVisible();
});
