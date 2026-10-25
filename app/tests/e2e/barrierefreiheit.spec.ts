/**
 * Barrierefreiheit und schmale Bildschirme (Konzept 13, seit 0.2.90): axe auf den Bildschirmen,
 * die bisher ungeprüft waren (Spielen, Partie, Auswertung, Trainer, Dunkelmodus), dazu Bedienung
 * ohne Maus und kein waagerechtes Scrollen bei 360 px Breite (Pflichtenheft 2: kleine Handys).
 * Buch, Abbildung, Training, Nachschlagen und Einstellungen prüfen durchstich.spec.ts und
 * buchdaten.spec.ts.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { oeffneAbbildung, oeffneTrainer, starteImBrowser } from "./hilfen";

/** Schwere und kritische Verstöße auf der aktuellen Seite (leichte nehmen wir in Kauf). */
async function schwereVerstoesse(page: Page): Promise<string[]> {
  const ergebnis = await new AxeBuilder({ page }).analyze();
  return ergebnis.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

const ENGINE_FRIST = 60_000;
/** Breite eines kleinen Android-Handys (Pflichtenheft 2). */
const SCHMAL = { width: 360, height: 740 };

async function bereich(page: Page, name: string): Promise<void> {
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name, exact: true })
    .click();
}

test("axe: Spielen, Partie und Auswertung (Matt nach 2. g4??)", async ({ page }) => {
  await starteImBrowser(page);
  await bereich(page, "Spielen");
  expect(await schwereVerstoesse(page)).toEqual([]);
  await page.getByText("Eigene Stellung eingeben (FEN)").click();
  await page
    .getByLabel("Stellung als FEN")
    .fill("rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 2");
  await page.getByRole("button", { name: "Stellung übernehmen" }).click();
  for (const phase of ["Eröffnung", "Mittelspiel", "Endspiel"]) {
    await page.getByLabel(new RegExp(`^${phase}:`)).fill("8");
  }
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  expect(await schwereVerstoesse(page)).toEqual([]);
  await page.getByRole("button", { name: /^g2, Bauer/ }).click();
  await page.getByRole("button", { name: "g4", exact: true }).click();
  await expect(page.getByTestId("partieende")).toBeVisible({ timeout: ENGINE_FRIST });
  await expect(page.getByTestId("spielstaerke")).toBeVisible({ timeout: ENGINE_FRIST });
  expect(await schwereVerstoesse(page)).toEqual([]);
});

test("axe: fünf Trainer (Zählen, Taktik, Endspiel, Struktur, Zug erraten)", async ({ page }) => {
  await starteImBrowser(page);
  for (const kennung of ["zaehlen", "taktik", "endspiel", "struktur", "zugErraten"]) {
    await oeffneTrainer(page, kennung);
    expect(await schwereVerstoesse(page), kennung).toEqual([]);
  }
});

test("axe im Dunkelmodus: Buch, Abbildung, Training, Einstellungen", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await starteImBrowser(page);
  expect(await schwereVerstoesse(page)).toEqual([]);
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.getByRole("button", { name: "Zählen" }).click();
  expect(await schwereVerstoesse(page)).toEqual([]);
  for (const name of ["Training", "Profil"]) {
    await bereich(page, name);
    expect(await schwereVerstoesse(page), name).toEqual([]);
  }
});

test("ohne Maus: Hauptbereiche mit Tab und Eingabetaste erreichen", async ({ page }) => {
  await starteImBrowser(page);
  const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
  const training = leiste.getByRole("button", { name: "Training", exact: true });
  await training.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("trainer-zaehlen")).toBeVisible();
  // Von der Leiste weiter mit Tab: Der Fokus bleibt sichtbar auf bedienbaren Elementen.
  await page.keyboard.press("Tab");
  const fokussiert = await page.evaluate(() => document.activeElement?.tagName ?? "");
  expect(["BUTTON", "A", "INPUT", "SELECT", "SUMMARY"]).toContain(fokussiert);
});

test("360 px Breite: kein waagerechtes Scrollen auf den Hauptbildschirmen", async ({ page }) => {
  await page.setViewportSize(SCHMAL);
  await starteImBrowser(page);
  const ueberstand = () =>
    page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
  expect(await ueberstand(), "Buch").toBeLessThanOrEqual(0);
  await oeffneAbbildung(page, "1.26", "1.26");
  expect(await ueberstand(), "Abbildung").toBeLessThanOrEqual(0);
  for (const name of ["Spielen", "Training", "Nachschlagen", "Profil"]) {
    await bereich(page, name);
    expect(await ueberstand(), name).toBeLessThanOrEqual(0);
  }
  await oeffneTrainer(page, "taktik");
  expect(await ueberstand(), "Taktiktrainer").toBeLessThanOrEqual(0);
});
