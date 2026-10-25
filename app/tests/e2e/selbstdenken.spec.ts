/**
 * „Erst selbst denken“ auch vor Werkzeugen und Engine (seit 0.2.90, Wunsch des Autors): An der
 * Abbildung erst die eigene Einschätzung, dann die Werkzeuge. Übungen und Trainer bleiben lösbar.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneAbbildung, oeffneEinstellungen, oeffneTrainer, starteImBrowser } from "./hilfen";

const feld = (page: Page, name: string) =>
  page.getByRole("button", { name: new RegExp(`^${name}(,|$)`) });

/** Schaltet „Auch vor Werkzeugen und Engine“ an, auf Wunsch dazu „streng“. */
async function schalteEin(page: Page, streng = false): Promise<void> {
  const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Training" }).click();
  await page
    .getByRole("radiogroup", { name: "Auch vor Werkzeugen und Engine" })
    .getByRole("radio", { name: "an" })
    .click();
  if (streng) await page.getByRole("radio", { name: "streng" }).click();
  await leiste.getByRole("button", { name: "Buch" }).click();
}

test("Abb. 1.26: erst einschätzen, dann Werkzeuge; Einschätzung und Urteil der Engine", async ({
  page,
}) => {
  await starteImBrowser(page);
  await schalteEin(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  const karte = page.getByTestId("selbstdenken");
  await expect(karte).toContainText("Wie steht es?");
  await expect(page.getByRole("button", { name: "Zählen" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Engine", exact: true })).toHaveCount(0);
  await page.screenshot({ path: "test-results/bilder/selbstdenken.png", fullPage: true });
  await karte.getByRole("radio", { name: "Weiß besser" }).click();
  await karte.getByRole("button", { name: "Ich habe nachgedacht" }).click();
  await expect(page.getByTestId("selbstdenken")).toHaveCount(0);
  const vergleich = page.getByTestId("eigene-einschaetzung");
  await expect(vergleich).toContainText("Weiß steht besser");
  // NA1: Die Engine sieht Abb. 1.26 ausgeglichen (unter einem halben Bauern).
  await expect(vergleich).toContainText("also „ausgeglichen“", { timeout: 20_000 });
  await page.getByRole("button", { name: "Zählen" }).click();
  await page.getByRole("button", { name: "d4, Bauer (Weiß)" }).click();
  await expect(page.getByTestId("werkzeugkarte")).toContainText("3 gegen 3");
});

test("streng: ohne Einschätzung bleibt „Ich habe nachgedacht“ gesperrt", async ({ page }) => {
  await starteImBrowser(page);
  await schalteEin(page, true);
  await oeffneAbbildung(page, "1.26", "1.26");
  const karte = page.getByTestId("selbstdenken");
  const weiter = karte.getByRole("button", { name: "Ich habe nachgedacht" });
  await expect(weiter).toBeDisabled();
  await karte.getByRole("radio", { name: "gleich" }).click();
  await expect(weiter).toBeEnabled();
  await weiter.click();
  await expect(page.getByRole("button", { name: "Zählen" })).toBeVisible();
  // NA1: richtig eingeschätzt → gemerkt; beim nächsten Öffnen sind die Werkzeuge gleich da.
  await expect(page.getByTestId("eigene-einschaetzung")).toContainText("Richtig eingeschätzt", {
    timeout: 20_000,
  });
  await page.reload();
  await oeffneAbbildung(page, "1.26", "1.26");
  await expect(page.getByRole("button", { name: "Zählen" })).toBeVisible();
  await expect(page.getByTestId("selbstdenken")).toHaveCount(0);
});

test("eingeschaltet: Übungen und Trainer lassen sich wie bisher lösen", async ({ page }) => {
  await starteImBrowser(page);
  await schalteEin(page);
  // Übung 1.40 aus der Kapitelübersicht: eigener Bildschirm, ohne Einschätzungskarte.
  await page
    .getByRole("button", { name: /Kapitel 1 ·/ })
    .first()
    .click();
  await page
    .getByTestId("kapitel-uebungen")
    .getByRole("button", { name: /Abb\. 1\.40/ })
    .click();
  const uebung = page.getByTestId("uebung");
  await expect(page.getByTestId("selbstdenken")).toHaveCount(0);
  await feld(page, "b5").click();
  await feld(page, "c7").click();
  await expect(uebung).toContainText("Richtig!");
  // Taktiktrainer: Aufgabe und Hilfen stehen bereit, keine Einschätzungskarte.
  await oeffneTrainer(page, "taktik");
  await expect(page.getByTestId("selbstdenken")).toHaveCount(0);
  await expect(page.getByTestId("trainer").getByRole("button").first()).toBeEnabled();
});
