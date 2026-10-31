/**
 * „Dein nächster Schritt“ (Gamifizierung P1): Karte oben im Buch, Knopf führt zum Ziel,
 * Alternativen, „Nicht jetzt“ bis morgen.
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

test("Karte „Heute“: Neue fangen bei Abb. 0.1 an, noch ohne Tagesaufgabe (Niveau, 0.3.43)", async ({
  page,
}) => {
  await starteImBrowser(page);
  const karte = page.getByTestId("heute");
  await expect(karte.getByRole("heading", { name: "Heute" })).toBeVisible();
  const erster = karte.getByTestId("heute-vorschlag");
  await expect(erster).toHaveAccessibleName(/^Anfangen: Fang vorn an: Kapitel 0/);
  await expect(erster).toContainText("Kapitel 0 · Abb. 0.1");
  // Die Tagesaufgabe (Taktik) kommt erst nach Kapitel 0; das Kreuz steht neben der Kachel.
  await expect(karte.getByTestId("heute-alternative-tagesaufgabe")).toHaveCount(0);
  await expect(karte.locator(".heute-vorschlaege-allein")).toBeVisible();
  await erster.click();
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
