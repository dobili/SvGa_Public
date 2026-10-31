/**
 * Kurzpläne (0.3.3): 5- und 15-Minuten-Plan mit Uhr, Taktik auf Zeit und Tagesaufgabe mit Serie.
 */
import { expect, test } from "@playwright/test";
import { oeffneTrainer, starteImBrowser } from "./hilfen";

test("5-Minuten-Plan: Einheit mit Uhr, abschließen, Meldung", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "kurzplaene");
  await page.getByTestId("kurzplan-mini").click();
  await expect(page.getByTestId("kurzplan-uhr")).toContainText("Fällige Wiederholungen");
  await expect(page.getByTestId("kurzplan-uhr")).toContainText("Noch 4:5");
  await page.getByRole("button", { name: "Einheit abschließen" }).click();
  await expect(page.getByTestId("kurzplan-geschafft")).toContainText("5 Minuten");
});

test("15-Minuten-Plan: zwei Schritte, dann geschafft", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "kurzplaene");
  await page.getByTestId("kurzplan-kurz").click();
  await page.getByRole("button", { name: "Schritt erledigt" }).click();
  await expect(page.getByTestId("kurzplan-uhr")).toContainText("Taktik-Themenblock");
  await page.getByRole("button", { name: "Einheit abschließen" }).click();
  await expect(page.getByTestId("kurzplan-geschafft")).toBeVisible();
});

test("Tagesaufgabe zeigt die Serie, Taktik auf Zeit startet eine Zeitrunde", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "kurzplaene");
  await page.getByTestId("kurzplan-tag").click();
  await expect(page.getByTestId("serie")).toContainText(
    "Serie: 0 Tage mit Tagesaufgabe. Die Serie verfällt nicht.",
  );
  await page.getByRole("button", { name: "Zurück zu den Kurzplänen" }).click();
  await page.getByRole("button", { name: /Taktik auf Zeit/ }).click();
  await page.getByRole("button", { name: "Zeitrunde starten" }).click();
  await expect(page.getByTestId("zeitrunde")).toContainText("Noch 2:5");
  await expect(page.getByTestId("zeitrunde")).toContainText("von 3 erlaubten Fehlern");
});
