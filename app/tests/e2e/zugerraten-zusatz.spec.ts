/**
 * Oberflächentest „Zug erraten“ mit Zusatzpartien (Wunsch des Autors, 30.10.2026): Wahl der
 * Quelle (Buch, berühmte Partien, aktuelle Turniere), Kennzeichnung als Zusatzinhalt mit Quelle
 * und Lizenz, Start einer Zusatzpartie wie einer Buchpartie (die Karte steht dann über dem Brett).
 */
import { expect, test } from "@playwright/test";
import { oeffneTrainer, starteImBrowser, waehleInZeile } from "./hilfen";

test("Zug erraten: Quelle wählen, Zusatzpartie gekennzeichnet und spielbar", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "zugErraten");
  const wahl = page.getByTestId("zugerraten-wahl");
  const quelle = page.getByTestId("zugerraten-quelle");
  const liste = page.getByTestId("zugerraten-partieliste");
  // Vorgabe: die Partien des Buches, ohne Zusatzkarte.
  await expect(quelle).toContainText("Aus dem Buch");
  await expect(liste.locator("option").first()).toHaveText(/^Morphys Opernpartie/);
  await expect(page.getByTestId("zusatzpartie-karte")).toHaveCount(0);
  // Aktuelle Turniere: Lichess-Übertragung mit Lizenz.
  await waehleInZeile(page, "zugerraten-quelle", "Aktuelle Turniere");
  const karte = page.getByTestId("zusatzpartie-karte");
  await expect(karte).toContainText("Zusatzinhalt (nicht aus dem Buch)");
  await expect(page.getByTestId("zusatzpartie-quelle")).toContainText("CC BY-SA 4.0");
  // Berühmte Partien: Kurztext und zwei Quellen.
  await waehleInZeile(page, "zugerraten-quelle", "Berühmte Partien");
  await expect(karte).toContainText("Zusatzinhalt (nicht aus dem Buch)");
  await expect(page.getByTestId("zusatzpartie-quelle").getByRole("link")).toHaveCount(2);
  expect(await liste.locator("option").count()).toBeGreaterThanOrEqual(40);
  await page.screenshot({ path: "test-results/bilder/trainer-zugerraten-zusatz.png" });
  await waehleInZeile(page, "zeile-seite", "Schwarz");
  await wahl.getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde.getByTestId("zusatzpartie-karte")).toContainText("Zusatzinhalt");
  await expect(page.getByTestId("zugerraten-stand")).toHaveText("Getroffen: 0 von 0");
});
