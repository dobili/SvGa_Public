/**
 * Oberflächentests für die Lernsammlung (seit 0.2.92, Kapitel 12, AP 15): Stellung an der
 * Abbildung sammeln, Eröffnung erkannt, nach Eröffnung geordnet, abfragen, als PGN sichern,
 * nach dem Neuladen noch da, löschen.
 */
import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

const PLAN = "Druck auf e5, dann c3 und d4";

test("Lernsammlung: Abb. 2.2 sammeln, ordnen, abfragen, als PGN sichern, löschen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "2.2", "2.2");
  await page.getByRole("button", { name: "Diese Stellung in die Lernsammlung legen" }).click();
  const formular = page.getByTestId("sammelformular");
  // Die Eröffnung erkennt die App aus den Buchvarianten (Spanische Partie, Abb. 2.2).
  await expect(formular.getByLabel("Eröffnung")).toHaveValue(/^Spanisch/);
  await formular.getByLabel("Plan").fill(PLAN);
  await formular.getByLabel("Notiz").fill("Achtung auf die Noah-Arche-Falle");
  await formular.getByRole("button", { name: "Speichern" }).click();
  await expect(page.getByText("In der Lernsammlung gespeichert.")).toBeVisible();

  // Nach dem Neuladen steht die Stellung noch in der Sammlung (Speicher, Format 5).
  await page.reload();
  await page.getByRole("navigation").getByRole("button", { name: "Training" }).click();
  await expect(page.getByTestId("sammelkarte")).toContainText("1 eigene Stellungen");
  await page.getByRole("button", { name: "Lernsammlung öffnen" }).click();
  await expect(page.getByRole("heading", { name: "Lernsammlung" })).toBeVisible();
  const gruppe = page.getByTestId("sammelgruppe");
  await expect(gruppe).toHaveCount(1);
  await expect(gruppe.locator("summary").first()).toHaveText(/^Spanisch.*\(1\)$/);

  // Abfragen: erst die Frage, dann der Plan.
  await page.getByRole("button", { name: "Abfragen", exact: true }).click();
  await expect(page.getByTestId("sammelabfrage")).toContainText("Stellung 1 von 1");
  await expect(page.getByTestId("sammelabfrage-plan")).toHaveCount(0);
  await page.getByRole("button", { name: "Plan zeigen" }).click();
  await expect(page.getByTestId("sammelabfrage-plan")).toContainText(PLAN);
  await page.getByRole("button", { name: "Fertig" }).click();

  // PGN für eine Lichess-Studie: Kopf mit Eröffnung und Fundstelle, Züge, Plan als Kommentar.
  const herunterladen = page.waitForEvent("download");
  await page.getByRole("button", { name: "Als PGN-Datei sichern" }).first().click();
  const datei = await herunterladen;
  const pfad = await datei.path();
  const pgn = await readFile(pfad, "utf8");
  expect(pgn).toContain('[Black "Abb. 2.2"]');
  expect(pgn).toMatch(/\[White "Spanisch/);
  expect(pgn).toContain("1. e4 e5 2. Nf3 Nc6 3. Bb5");
  expect(pgn).toContain(`{Plan: ${PLAN} Notiz: Achtung auf die Noah-Arche-Falle}`);

  // Löschen: die Sammlung ist wieder leer.
  await gruppe.locator("summary").first().click();
  await page.getByTestId("sammeleintrag").locator("summary").click();
  await page.getByRole("button", { name: "Löschen" }).click();
  await expect(page.getByTestId("sammlung-leer")).toBeVisible();
});
