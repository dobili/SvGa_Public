/**
 * Grenzfälle aus dem Fehlertest „Spielen, Partie, Auswertung, Profil, Speicher“ (1.11.2026) in
 * Handygröße 360 × 800: Was dabei als Fehler auffiel, hält dieser Test fest.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneProfil, starteImBrowser } from "./hilfen";

/** So lange darf das Öffnen der eingelesenen Partie samt Auswertung dauern (ms). */
const AUSWERTUNG_FRIST = 30_000;

test.use({ viewport: { width: 360, height: 800 } });

test("PGN in deutscher Notation mit Doppeltipp: richtig gelesen und nur einmal abgelegt", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneProfil(page);
  await page.getByRole("button", { name: "Partie einlesen (PGN)", exact: true }).click();
  const formular = page.getByTestId("pgnimport");
  // Schäfermatt deutsch: „Sc6“ und „Lc4“ wurden früher als Bauernzüge c6 und c4 gelesen.
  await formular.getByLabel("PGN der Partie").fill("1. e4 e5 2. Lc4 Sc6 3. Dh5 Sf6 4. Dxf7# 1-0");
  await formular.getByRole("button", { name: "Einlesen und auswerten" }).dblclick();
  await expect(page.getByTestId("partieende")).toContainText("Matt", {
    timeout: AUSWERTUNG_FRIST,
  });
  await oeffneProfil(page);
  await expect(page.locator(".partienliste li.partieeintrag")).toHaveCount(1);
});

test("PGN einer Schachvariante wird mit Grund abgelehnt", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneProfil(page);
  await page.getByRole("button", { name: "Partie einlesen (PGN)", exact: true }).click();
  const formular = page.getByTestId("pgnimport");
  await formular
    .getByLabel("PGN der Partie")
    .fill('[Variant "Crazyhouse"]\n\n1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5 4. P@d5 1-0');
  await formular.getByRole("button", { name: "Einlesen und auswerten" }).click();
  await expect(formular).toContainText("Schachvariante");
});

/** Setzt im Profil den Namen des Lesers. */
async function setzeName(page: Page, name: string): Promise<void> {
  await oeffneProfil(page);
  await page.getByRole("button", { name: "Name und Porträt" }).click();
  await page.getByLabel("Dein Name (freiwillig)").fill(name);
  await page.getByRole("button", { name: "Speichern" }).click();
  await expect(page.getByTestId("profilname")).toHaveText(name);
}

// Jeder Tab schrieb seinen ganzen, womöglich alten Stand; der zweite löschte so den Namen.
test("zwei Tabs: Änderung im ersten Tab überlebt eine Änderung im zweiten", async ({
  page,
  context,
}) => {
  await starteImBrowser(page);
  await oeffneProfil(page);
  const zweite = await context.newPage();
  await zweite.goto("/app/");
  await oeffneProfil(zweite);
  await expect(zweite.getByTestId("profilname")).toHaveText("Noch ohne Namen");
  await setzeName(page, "Anna");
  // Der zweite Tab ändert etwas anderes: PGN einlesen.
  await zweite.getByRole("button", { name: "Partie einlesen (PGN)", exact: true }).click();
  const formular = zweite.getByTestId("pgnimport");
  await formular.getByLabel("PGN der Partie").fill("1. f3 e5 2. g4 Qh4# 0-1");
  await formular.getByRole("button", { name: "Einlesen und auswerten" }).click();
  await expect(zweite.getByTestId("partieende")).toContainText("Matt");
  await page.reload();
  await oeffneProfil(page);
  await expect(page.locator(".partienliste li.partieeintrag")).toHaveCount(1);
  await expect(page.getByTestId("profilname")).toHaveText("Anna");
});
