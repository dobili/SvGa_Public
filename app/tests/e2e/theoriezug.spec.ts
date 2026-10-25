/**
 * Oberflächentest zum Theoriezug (Wunsch des Autors, 25.10.2026): Nach der Partie heißt 1. e4 im
 * Rückblick „Theoriezug: Teil einer Eröffnung“; das Wort „Eröffnung“ klappt die zutreffenden
 * Eröffnungen auf (aria-expanded), zuerst die des Buches, höchstens fünf und „und N weitere“.
 * Dazu axe mit offener Liste und die Zeile „Theoriezug“ unter „Deine Züge“.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

/** Die Engine rechnet im Browser; der erste Start lädt die WASM-Datei. */
const ENGINE_FRIST = 60_000;
/** Fünf Namen und die Zeile „und N weitere“. */
const LISTENZEILEN = 6;

async function ziehe(seite: Page, von: RegExp, nach: string): Promise<void> {
  await seite.getByRole("button", { name: von }).click();
  await seite.getByRole("button", { name: nach, exact: true }).click();
}

/** Schwere und kritische Verstöße auf der aktuellen Seite (wie barrierefreiheit.spec.ts). */
async function schwereVerstoesse(page: Page): Promise<string[]> {
  const ergebnis = await new AxeBuilder({ page }).analyze();
  return ergebnis.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

test("Theoriezug: 1. e4 im Rückblick, Eröffnungen aufklappen", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("checkbox", { name: /Gewertete Partie/ }).uncheck();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await ziehe(page, /^e2, Bauer/, "e4");
  await expect(page.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
    timeout: ENGINE_FRIST,
  });
  await page.getByRole("button", { name: "Aufgeben" }).click();
  await page.getByRole("button", { name: "Ja, aufgeben" }).click();
  await expect(page.getByTestId("spielstaerke")).toBeVisible({ timeout: ENGINE_FRIST });
  // „Deine Züge“: die Zeile heißt jetzt „Theoriezug“ und zählt 1. e4.
  await expect(page.getByTestId("zugklasse-buch")).toContainText("Theoriezug");
  await expect(page.getByTestId("zugklasse-buch").locator(".zugklasse-anzahl")).toHaveText("1");
  await page
    .getByTestId("partiezuege")
    .getByRole("button", { name: /^1\. e4, Theoriezug/ })
    .click();
  const karte = page.getByTestId("rueckblickkarte");
  await expect(karte).toContainText("1. e4 ist ein Theoriezug: Teil einer Eröffnung");
  const knopf = karte.getByRole("button", { name: /^Eröffnung/ });
  const liste = page.getByTestId("theorie-liste");
  await expect(knopf).toHaveAttribute("aria-expanded", "false");
  await expect(liste).toBeHidden();
  await knopf.click();
  await expect(knopf).toHaveAttribute("aria-expanded", "true");
  await expect(liste).toBeVisible();
  // Zuerst die Eröffnungen des Buches, dann „und N weitere“ (1. e4 führt zu über 1.000 Namen).
  await expect(liste.getByRole("listitem").first()).toContainText("im Buch");
  await expect(liste.getByRole("listitem")).toHaveCount(LISTENZEILEN);
  await expect(liste.getByRole("listitem").last()).toHaveText(/^und \d+ weitere$/);
  expect(await schwereVerstoesse(page)).toEqual([]);
  await page.screenshot({ path: "test-results/bilder/theoriezug.png", fullPage: true });
  await knopf.click();
  await expect(knopf).toHaveAttribute("aria-expanded", "false");
  await expect(liste).toBeHidden();
});
