/**
 * Oberflächentest zum Eröffnungspaket, Stufe 2 (0.3.10): Eröffnungen nach Spielstärke in der
 * Eröffnungswahl. Bänder wählen, je Band drei Eröffnungen je Seite, Buchmarke, ein Tipp legt die
 * Eröffnung für den Bot fest (dieselbe Wahl wie „Aus der Praxis“). Seit 0.3.11 (Stufe 3)
 * Variantenbaum je Eröffnung und Gambit-Liste.
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

test("Eröffnungen nach Spielstärke: Bänder, Buchmarke, Wahl für den Bot", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByTestId("eroeffnung-klappe").locator("summary").click();
  const wahl = page.getByTestId("staerkewahl");
  await wahl.locator(":scope > summary").click();
  // Vorgabe 1000 bis 1400: drei Bänder, je Seite neun Eröffnungen
  await expect(wahl.getByLabel("von")).toHaveValue("3");
  const weiss = wahl.locator(".staerkewahl-seite").first().locator(".staerkewahl-zeile");
  await expect(weiss).toHaveCount(9);
  const italienisch = wahl.getByRole("button", { name: /Italienische Partie/ });
  await expect(italienisch).toContainText("Buch 2.3");
  // Nur ein Band: drei je Seite
  await wahl.getByLabel("bis").selectOption({ label: "1000" });
  await expect(weiss).toHaveCount(3);
  await italienisch.click();
  await expect(italienisch).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#eroeffnung")).toHaveValue("praxis:Italian Game");
  await expect(page.getByTestId("eroeffnungswahl")).toContainText(
    "Hauptvariante: 1. e4 e5 2. Sf3 Sc6 3. Lc4",
  );
  // Variantenbaum: Evans-Gambit hängt unter Giuoco Piano (3... Lc5), der Zug danach ist 4. b4
  const zeile = page.locator(".staerkewahl-zeile", { hasText: "Italienische Partie" });
  const baum = wahl.locator("li", { has: zeile }).getByTestId("variantenbaum");
  await baum.locator("summary").first().click();
  const evans = baum.getByRole("button", { name: /^Evans Gambit/ });
  await expect(evans).toContainText("4. b4");
  await evans.click();
  await expect(page.locator("#eroeffnung")).toHaveValue("praxis:Italian Game: Evans Gambit");
  // Gambits der Bänder, beide Seiten
  await expect(wahl.getByTestId("gambitliste").getByRole("button")).toHaveCount(3);
});
