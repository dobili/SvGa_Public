/**
 * Oberflächentests des Spielerprofils (0.2.140): Name und selbst gebautes Porträt festlegen, das
 * übersteht das Neuladen und erscheint in der Partie an der eigenen Uhr.
 */
import { expect, test } from "@playwright/test";
import { oeffneProfil, starteImBrowser } from "./hilfen";

test("Profil: Name und Porträt festlegen, in der Partie sichtbar", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneProfil(page);
  await expect(page.getByTestId("profilname")).toHaveText("Noch ohne Namen");
  await page.getByRole("button", { name: "Name und Porträt" }).click();
  await page.getByLabel("Dein Name (freiwillig)").fill("Dana");
  await page.getByRole("radio", { name: "Selbst gestalten" }).click();
  await page.getByLabel("Frisur").selectOption({ label: "Zöpfe" });
  await page.getByRole("radio", { name: "Kupfer" }).click();
  // Die Vorschau zeigt das gebaute Bild, sobald der Baukasten geladen ist.
  await expect(
    page.getByTestId("profileditor").getByTestId("spielerbild").locator("img"),
  ).toHaveAttribute("src", /^data:image\/svg\+xml/);
  await page.getByRole("button", { name: "Speichern" }).click();
  await expect(page.getByTestId("profilname")).toHaveText("Dana");
  await page.reload();
  await oeffneProfil(page);
  await expect(page.getByTestId("profilname")).toHaveText("Dana");
  await expect(page.getByTestId("profilkarte").locator("img")).toHaveCount(1);
  // In der Partie steht der eigene Name an der eigenen Uhr.
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Spielen" })
    .click();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.getByTestId("partie-spielername")).toHaveText("Dana");
});

test("Profil: ein Porträt aus der Auswahl und wieder kein Bild", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneProfil(page);
  await page.getByRole("button", { name: "Name und Porträt" }).click();
  await page.getByRole("radio", { name: "Auswählen" }).click();
  await page.getByTestId("profileditor").getByRole("radio").nth(5).click();
  await page.getByRole("button", { name: "Speichern" }).click();
  await expect(page.getByTestId("profilkarte").locator("img")).toHaveAttribute(
    "src",
    /gegner\/wahl-\d\d\.svg$/,
  );
  await page.getByRole("button", { name: "Name und Porträt" }).click();
  await page.getByRole("radio", { name: "Kein Bild" }).click();
  await page.getByRole("button", { name: "Speichern" }).click();
  await expect(page.getByTestId("profilkarte").locator("img")).toHaveCount(0);
});
