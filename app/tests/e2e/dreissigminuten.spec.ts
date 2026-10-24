/**
 * Oberflächentests des 30-Minuten-Plans (Kapitel 12, AP 13 Stufe 3): geführte Einheit mit Uhr,
 * Stand im Gerätespeicher, Wechsel der Tage und Bereiche.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

async function oeffnePlan(page: Page): Promise<void> {
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Training" })
    .click();
  await page
    .getByTestId("trainer-dreissigMinuten")
    .first()
    .getByRole("button", { name: "Trainieren" })
    .click();
  await expect(page.getByTestId("trainer")).toBeVisible();
}

test("30-Minuten-Plan: Partietag mit Uhr, übersteht das Neuladen, danach ist der Studientag dran", async ({
  page,
}) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffnePlan(page);
  await expect(page.getByTestId("plan-start")).toContainText("Im Wechsel ist heute dran: Tag A");
  await page.getByRole("button", { name: "Tag A: Partietag starten" }).click();
  const uhr = page.getByTestId("plan-uhr");
  await expect(uhr).toContainText("Schritt 1 von 3");
  await expect(uhr).toContainText("Zwei leichte Taktikaufgaben");
  await expect(page.getByText("Aufgabe 1 von 2")).toBeVisible();
  // Nach sechs Minuten ist die Zeit des Schritts (5 Minuten) um eine Minute überschritten.
  await page.clock.fastForward("06:00");
  await expect(uhr.getByRole("timer")).toContainText("über der Zeit");
  await page.clock.resume();
  await page.getByRole("button", { name: "Schritt erledigt" }).click();
  await expect(uhr).toContainText("Schritt 2 von 3");
  // Seit 0.2.91 stellt „Zum Spielen“ die Bedenkzeit des Partietags ein: 10 + 0 (Kapitel 12).
  await page.getByRole("button", { name: "Zum Spielen" }).click();
  await expect(page.getByRole("radio", { name: "Schnellschach 10 + 0" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  // Die Einheit liegt im Gerätespeicher und läuft nach dem Neuladen weiter.
  await page.reload();
  await oeffnePlan(page);
  await expect(page.getByTestId("plan-uhr")).toContainText("Schritt 2 von 3");
  await page.getByRole("button", { name: "Schritt erledigt" }).click();
  await expect(page.getByTestId("plan-keine-partie")).toBeVisible();
  await page.getByRole("button", { name: "Einheit abschließen" }).click();
  await expect(page.getByTestId("plan-geschafft")).toContainText("Tag B: Studientag");
  await expect(page.getByRole("button", { name: "Tag B: Studientag starten" })).toHaveClass(
    /knopf-haupt/,
  );
});

test("30-Minuten-Plan: Studientag mit Bereich im Wechsel führt zum Trainer", async ({ page }) => {
  await starteImBrowser(page);
  await oeffnePlan(page);
  await page.getByRole("button", { name: "Tag B: Studientag starten" }).click();
  await page.getByRole("button", { name: "Schritt erledigt" }).click();
  await expect(page.getByTestId("plan-uhr")).toContainText("Ein festes Thema wiederholen");
  const bereich = page.getByRole("group", { name: "Bereich" });
  await expect(bereich.getByRole("button", { name: "Taktik" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await bereich.getByRole("button", { name: "Endspiel" }).click();
  await page.getByRole("button", { name: "Endspieltrainer" }).click();
  await expect(page.getByRole("heading", { name: "Endspieltrainer" })).toBeVisible();
});
