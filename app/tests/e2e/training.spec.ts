/**
 * Oberflächentests der Trainingsseiten der Website (seit 16.10.2026): Startseite → Übersicht →
 * Kapitel → Abbildung in der App, und der Werkzeugkasten mit den Lichess-Adressen.
 */
import { expect, test } from "@playwright/test";

test("Trainingsseiten: Startseite, Übersicht, Kapitel 6, Sprung zur Abbildung in der App", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("training-karte").getByRole("link", { name: "Zum Training" }).click();
  await expect(page).toHaveURL(/\/training\/$/);
  const liste = page.getByTestId("trainingsliste");
  await expect(liste.getByRole("link")).toHaveCount(13);
  await page.screenshot({ path: "test-results/bilder/training-uebersicht.png", fullPage: true });
  await liste.getByRole("link", { name: /Mittelspielstrategie/ }).click();
  await expect(page).toHaveURL(/\/training\/kap06\/$/);
  await expect(
    page.getByRole("heading", { name: "Kapitel 6: Mittelspielstrategie" }),
  ).toBeVisible();
  const kasten = page.getByTestId("trainingskasten");
  await expect(kasten).toContainText("Pläne bei Meistern abschauen.");
  // R17: Vor jeder Übung steht, wo man sie macht (Lichess, App, Brett …).
  const orte = kasten.locator(".uebungsorte").first();
  await expect(orte).toContainText("Lichess");
  await expect(orte).toContainText("App");
  await page.screenshot({ path: "test-results/bilder/training-kap06.png", fullPage: true });
  await kasten.getByRole("link", { name: "Abb. 6.20" }).first().click();
  await expect(page).toHaveURL(/\/app\/$/);
  await expect(page.getByRole("heading", { name: "Abb. 6.20" })).toBeVisible();
});

test("Werkzeugkasten: Tabelle der Lichess-Funktionen mit Links", async ({ page }) => {
  await page.goto("/training/kap00/");
  await page.getByRole("link", { name: "die Tabelle „Werkzeugkasten“" }).click();
  await expect(page).toHaveURL(/\/training\/werkzeugkasten\/$/);
  const kasten = page.getByTestId("trainingskasten");
  await expect(kasten.getByRole("table")).toContainText("Lernen → Koordinaten");
  await expect(kasten.getByRole("link", { name: "/training/coordinate" })).toHaveAttribute(
    "href",
    "https://lichess.org/training/coordinate",
  );
  await page.screenshot({
    path: "test-results/bilder/training-werkzeugkasten.png",
    fullPage: true,
  });
});

test("Kapitel 0: Koordinatentraining auf Lichess oder gleich im Trainer der App", async ({
  page,
}) => {
  // Paket Webverweise (30.10.2026): Was die App selbst kann, steht neben dem Lichess-Link.
  await page.goto("/training/kap00/");
  const kasten = page.getByTestId("trainingskasten");
  await expect(kasten.getByRole("link", { name: "Koordinatentraining ↗" })).toHaveAttribute(
    "href",
    "https://lichess.org/training/coordinate",
  );
  const inDerApp = kasten.getByRole("link", { name: "Koordinaten, Notation, Gangarten" });
  await expect(inDerApp).toHaveAttribute("href", "/app/#trainer-koordinaten");
  await inDerApp.click();
  await expect(page).toHaveURL(/\/app\/$/);
  await expect(page.getByTestId("koordinaten-wahl")).toContainText("Feld finden");
});
