/**
 * Oberflächentests des Repertoire-Trainers mit Gambits (Kapitel 3) und Eröffnungen aus der Praxis
 * (Lichess), Wunsch des Autors vom 1.11.2026: Startkarte mit Zeile „Aus“ und Schalter, je Quelle
 * eine Runde. Die Bilder für den Bericht entstehen auf 393 × 851 im dunklen Design.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { oeffneTrainer, starteImBrowser, waehleInZeile } from "./hilfen";

/** Ordner der Bilder (nur lokal; in Actions landen sie in test-results). */
const BILDER = process.env.REPERTOIRE_BILDER ?? "test-results/bilder";

const feld = (page: Page | Locator, name: string) =>
  page.locator(".brett-tasten").getByRole("button", { name: new RegExp(`^${name}(,|$)`) });

async function ziehe(page: Page, von: string, nach: string): Promise<void> {
  await feld(page, von).click();
  await feld(page, nach).click();
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
});

test("Repertoire-Trainer: Startkarte mit Kapitel 2, Kapitel 3 und Schalter Praxis", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "repertoire");
  const wahl = page.getByTestId("repertoire-wahl");
  const schalter = page.getByTestId("repertoire-praxis").getByRole("checkbox");
  await expect(schalter).not.toBeChecked();
  await expect(page.getByTestId("staerkewahl")).toHaveCount(0);
  await expect(page.getByTestId("repertoire-quelle")).toContainText("Eröffnungen (Kapitel 2)");
  await page.screenshot({ path: `${BILDER}/repertoire-start.png` });
  await waehleInZeile(page, "repertoire-quelle", "Gambits (Kapitel 3)");
  const liste = page.getByTestId("zeile-eroeffnung");
  await expect(liste).toContainText("Königsgambit");
  await expect(liste).toContainText("Damengambit");
  await page.screenshot({ path: `${BILDER}/repertoire-gambits.png` });
  // Schalter an: Quelle „Praxis“, Auswahl offen, ohne Wahl gesperrt
  await schalter.check();
  await expect(page.getByTestId("repertoire-quelle")).toContainText("Praxis (Lichess)");
  await expect(page.getByTestId("repertoire-praxishinweis")).toContainText("nicht aus dem Buch");
  await expect(page.getByTestId("staerkewahl")).toHaveAttribute("open", "");
  await expect(wahl.getByRole("button", { name: /Runde starten/ })).toBeDisabled();
  await page.screenshot({ path: `${BILDER}/repertoire-praxis.png` });
  // Schalter aus: zurück zum Buch
  await schalter.uncheck();
  await expect(page.getByTestId("repertoire-quelle")).toContainText("Eröffnungen (Kapitel 2)");
  await expect(page.getByTestId("staerkewahl")).toHaveCount(0);
});

test("Repertoire-Trainer: Königsgambit als Weiß nach dem Buch", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "repertoire");
  await waehleInZeile(page, "repertoire-quelle", "Gambits (Kapitel 3)");
  await waehleInZeile(page, "zeile-eroeffnung", "Königsgambit");
  await waehleInZeile(page, "zeile-seite", "Weiß");
  await page
    .getByTestId("repertoire-wahl")
    .getByRole("button", { name: /Runde starten/ })
    .click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Königsgambit: Ziehe die Züge von Weiß wie im Buch");
  await ziehe(page, "e2", "e4");
  await expect(page.getByTestId("repertoire-zuege")).toHaveText("1. e4 e5");
  await ziehe(page, "f2", "f4");
  await expect(page.getByTestId("repertoire-zuege")).toHaveText("1. e4 e5 2. f4 exf4");
  await expect(page.getByTestId("repertoire-herkunft")).toHaveCount(0);
  await page.screenshot({ path: `${BILDER}/repertoire-koenigsgambit.png` });
});

test("Repertoire-Trainer: Italienisch aus der Praxis, die häufigsten 3, als Weiß", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "repertoire");
  await page.getByTestId("repertoire-praxis").getByRole("checkbox").check();
  const staerke = page.getByTestId("staerkewahl");
  const zeile = staerke.locator("li", {
    has: page.getByRole("button", { name: /^Italienische Partie/ }),
  });
  await zeile.getByTestId("variantenbaum").locator("summary").first().click();
  await zeile.getByRole("button", { name: "Die häufigsten 3" }).click();
  await expect(page.getByTestId("repertoire-praxisanzahl")).toHaveText("3 gewählt");
  await waehleInZeile(page, "zeile-seite", "Weiß");
  const start = page.getByTestId("repertoire-wahl").getByRole("button", { name: /Runde starten/ });
  await expect(start).toHaveText(/3 Varianten/);
  await page.screenshot({ path: `${BILDER}/repertoire-praxiswahl.png` });
  await start.click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 3");
  await expect(runde).toContainText("Italienische Partie");
  await expect(page.getByTestId("repertoire-herkunft")).toHaveText(
    "Aus der Praxis, Lichess (nicht aus dem Buch)",
  );
  await ziehe(page, "e2", "e4");
  await expect(page.getByTestId("repertoire-zuege")).toHaveText("1. e4 e5");
  // Falsch: 2. d4 statt 2. Sf3
  await ziehe(page, "d2", "d4");
  await expect(runde).toContainText("Nicht der Zug dieser Variante");
  await ziehe(page, "g1", "f3");
  await expect(page.getByTestId("repertoire-zuege")).toHaveText("1. e4 e5 2. Sf3 Sc6");
  await page.screenshot({ path: `${BILDER}/repertoire-praxisrunde.png` });
  // Die Wahl bleibt im Gerätemerker: nach dem Neuladen wieder da
  await page.reload();
  await oeffneTrainer(page, "repertoire");
  await expect(page.getByTestId("repertoire-praxisanzahl")).toHaveText("3 gewählt");
});
