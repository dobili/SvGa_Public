/**
 * Oberflächentests zum Wunsch des Autors vom 1.11.2026: Einträge der Lernsammlung und der
 * Fehlerdatenbank anlegen, bearbeiten, löschen (mit Rückgängig); Kachel „Fehlerdatenbank“ oben im
 * Training; nach „Merken“ in der Auswertung eine Bestätigung mit Sprung in die Sammlung.
 * Bilder in Handybreite (393 × 851, dunkel) nach test-results/bilder/ für den Bericht.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffnePartie } from "./auswertungpartie";
import { starteImBrowser } from "./hilfen";

const HANDY = { width: 393, height: 851 };
const BILDER = "test-results/bilder";
/** Stellung nach 1. f3 e5 2. g4 (Narrenmatt droht). */
const FEN = "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2";
const PLAN = "Dh4 matt";

/** Startet dunkel in Handybreite und öffnet den Bereich Training. */
async function oeffneTraining(page: Page): Promise<void> {
  await page.setViewportSize(HANDY);
  await page.addInitScript(() => window.localStorage.setItem("svga.farbschema", "dunkel"));
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Training" }).click();
}

test("Lernsammlung: anlegen, Plan ergänzen, Abfrage mit neuem Plan, löschen mit Rückgängig", async ({
  page,
}) => {
  await oeffneTraining(page);
  await page.getByTestId("kachel-sammlung").getByRole("button").click();
  const neu = page.getByTestId("sammlung-neu");
  await neu.locator("summary").click();
  await neu.getByLabel("Stellung (FEN)").fill(FEN);
  await neu.getByRole("button", { name: "Speichern" }).click();
  // In der Sammlung selbst kein Sprung „Zur Lernsammlung“.
  await expect(neu.getByTestId("sammlung-gespeichert")).toBeVisible();
  await expect(neu.getByRole("button", { name: "Zur Lernsammlung" })).toHaveCount(0);

  const gruppe = page.getByTestId("sammelgruppe");
  await gruppe.locator("summary").first().click();
  const eintrag = page.getByTestId("sammeleintrag");
  await eintrag.locator("summary").click();
  await eintrag.getByRole("button", { name: "Plan ergänzen" }).click();
  const felder = eintrag.getByTestId("sammel-bearbeiten");
  // Dieselben beschrifteten Felder wie beim Anlegen.
  await expect(felder.getByLabel("Plan")).toHaveValue("");
  await expect(felder.getByLabel("Notiz")).toBeVisible();
  await felder.getByLabel("Plan").fill(PLAN);
  await felder.getByLabel("Eröffnung").fill("Narrenmatt");
  await page.screenshot({ path: `${BILDER}/sammlung-bearbeiten.png` });
  await felder.getByRole("button", { name: "Änderung speichern" }).click();
  await expect(eintrag.locator("summary")).toContainText(PLAN);
  await expect(page.getByTestId("sammelgruppe").locator("summary").first()).toHaveText(
    /^Narrenmatt/,
  );

  // Die Abfrage zeigt den geänderten Plan.
  await page.getByRole("button", { name: "Abfragen", exact: true }).click();
  await page.getByRole("button", { name: "Plan zeigen" }).click();
  await expect(page.getByTestId("sammelabfrage-plan")).toContainText(PLAN);
  await page.getByRole("button", { name: "Fertig" }).click();

  // Löschen, Rückgängig, nochmals löschen.
  await page.getByTestId("sammelgruppe").locator("summary").first().click();
  await page.getByTestId("sammeleintrag").locator("summary").click();
  await page.getByTestId("sammeleintrag").getByRole("button", { name: "Löschen" }).click();
  await expect(page.getByTestId("sammlung-leer")).toBeVisible();
  const rueckgaengig = page.getByTestId("rueckgaengig");
  await expect(rueckgaengig).toContainText("Gelöscht.");
  await page.screenshot({ path: `${BILDER}/sammlung-rueckgaengig.png` });
  await rueckgaengig.getByRole("button", { name: "Rückgängig" }).click();
  await expect(rueckgaengig).toHaveCount(0);
  await expect(page.getByTestId("sammeleintrag")).toHaveCount(1);
  await expect(page.getByTestId("sammeleintrag").locator("summary")).toContainText(PLAN);
});

test("Fehlerdatenbank: Kachel im Training, anlegen, bearbeiten, löschen mit Rückgängig", async ({
  page,
}) => {
  await oeffneTraining(page);
  const kachel = page.getByTestId("kachel-fehler");
  await expect(kachel).toContainText("Fehlerdatenbank");
  await expect(kachel).toContainText("noch leer");
  await page.screenshot({ path: `${BILDER}/training-kacheln.png` });
  await kachel.getByRole("button").click();
  const neu = page.getByTestId("fehlerdb-neu");
  await neu.getByLabel("Stellung vor dem Fehler (FEN)").fill(FEN);
  await neu.getByLabel(/^Fehlerart/).selectOption({ index: 2 });
  await neu.getByLabel(/^Ein Satz/).fill("Nicht an Dh4 gedacht.");
  await neu.getByRole("button", { name: "In die Fehlerdatenbank" }).click();

  const eintrag = page.getByTestId("fehlerdb-eintrag");
  await eintrag.locator("summary").click();
  await eintrag.getByRole("button", { name: "Bearbeiten" }).click();
  const felder = eintrag.getByTestId("fehlerdb-bearbeiten");
  await expect(felder.getByLabel(/^Ein Satz/)).toHaveValue("Nicht an Dh4 gedacht.");
  await felder.getByLabel(/^Fehlerart/).selectOption({ index: 3 });
  await felder.getByLabel(/^Ein Satz/).fill("Vor g4 die Diagonale e1–h4 prüfen.");
  await eintrag.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${BILDER}/fehlerdb-bearbeiten.png` });
  await felder.getByRole("button", { name: "Änderung speichern" }).click();
  await expect(eintrag).toContainText("Vor g4 die Diagonale e1–h4 prüfen.");
  await expect(eintrag.locator("summary")).toContainText("Kapitel 2");
  await expect(page.getByTestId("fehlerdb-auswertung")).toContainText("Kapitel 2");

  await eintrag.getByRole("button", { name: "Eintrag löschen" }).click();
  await expect(page.getByTestId("fehlerdb-leer")).toBeVisible();
  await page.getByTestId("rueckgaengig").getByRole("button", { name: "Rückgängig" }).click();
  await expect(page.getByTestId("fehlerdb-eintrag")).toHaveCount(1);
  await expect(page.getByTestId("fehlerdb-eintrag")).toContainText("Kapitel 2");
});

test("Auswertung: nach „Merken“ Bestätigung mit Sprung in Fehlerdatenbank und Lernsammlung", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffnePartie(page, "dunkel");
  const zurStellung = page
    .getByTestId("zeitleiste")
    .getByTestId("moment-fehler")
    .getByRole("button", { name: "Zur Stellung" });
  await zurStellung.click();
  await page.getByTestId("merken-schalter").click();
  const bereich = page.getByTestId("merkenbereich");
  await bereich.getByRole("radio", { name: "Fehler" }).click();
  await bereich.getByRole("button", { name: "In die Fehlerdatenbank" }).click();
  const bestaetigung = bereich.getByTestId("fehlerdb-gespeichert");
  await expect(bestaetigung).toContainText("In der Fehlerdatenbank gespeichert.");
  await page.screenshot({ path: `${BILDER}/merken-bestaetigung.png` });
  await bestaetigung.getByRole("button", { name: "Zur Fehlerdatenbank" }).click();
  await expect(page.getByTestId("fehlerdb-eintrag")).toHaveCount(1);
  await expect(page.getByTestId("fehlerdb-eintrag").locator("summary")).toContainText("Kapitel");
  // „Zur Stellung“ zeigt den Fehlerzug selbst: Eingetragen ist 12. O-O-O, nicht der Zug davor.
  await expect(page.getByTestId("fehlerdb-eintrag")).toContainText("O-O-O");

  // Zurück zur Partie, diesmal „Lernen“: Sprung zur Lernsammlung.
  await page.goBack();
  await zurStellung.click();
  await page.getByTestId("merken-schalter").click();
  await bereich.getByRole("radio", { name: "Lernen" }).click();
  await bereich.getByRole("button", { name: "Speichern" }).click();
  await bereich.getByRole("button", { name: "Zur Lernsammlung" }).click();
  await expect(page.getByRole("heading", { name: "Lernsammlung" })).toBeVisible();
  await expect(page.getByTestId("sammelgruppe")).toHaveCount(1);
});
