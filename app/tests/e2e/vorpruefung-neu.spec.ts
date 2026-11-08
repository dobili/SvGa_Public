/**
 * Vorprüfung der Testpunkte 0.3.44 bis 0.3.54 (8.11.2026): Prüfungen für Punkte aus
 * docs/AUFGABEN_AUTOR.md, die kein anderer Oberflächentest abdeckt. Warum: Der Autor prüft auf dem
 * Handy nur noch, was eine Maschine nicht beurteilen kann (Gefühl, Lesbarkeit, Geräte).
 *
 * Geprüft: Findezeile im Rückblick (N2603), Engine-Folgen vorab an und an Fehlern des Gegners
 * (N2576, N2577), Abfrage „Dafür muss die Variante gespeichert sein“ (N2572), Einstellung „Was
 * * zuerst kommt“ (N2591), „Ganze Eröffnung als Variante“ im Steckbrief (N2526).
 * Bildschirmfotos in Handygröße unter test-results/vorpruefung/ zum Ansehen.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffnePartie } from "./auswertungpartie";
import { oeffneEinstellungen, oeffneProfil, starteImBrowser } from "./hilfen";
import { oeffneSpielen, oeffneSpielseite } from "./spielenhilfen";

/** Handygröße der Vorprüfung (Pixel). */
const HANDY = { width: 393, height: 851 };
/** So lange darf das Einlesen einer Partie samt Auswertung dauern (ms). */
const AUSWERTUNG_FRIST = 30_000;
const BILDER = "test-results/vorpruefung";

/** Öffnet die Liste „Varianten“ über die Kachel im Training. */
async function oeffneVarianten(seite: Page): Promise<void> {
  await seite.getByRole("navigation").getByRole("button", { name: "Training" }).click();
  await seite.getByTestId("kachel-varianten").getByRole("button").click();
  await expect(seite.getByRole("heading", { name: "Varianten", level: 1 })).toBeVisible();
}

// N2603: Im Rückblick steht unter „Besser war …“ die Findezeile mit Kapitel und eigenem „Üben“;
// bei einem guten Zug fehlt sie.
test("Rückblick: Findezeile an 8. Sc3? mit Üben, keine an 1. e4", async ({ page }) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffnePartie(page, "hell");
  const zuege = page.getByTestId("partiezuege");
  await zuege.getByRole("button", { name: /^8\. Sc3/ }).click();
  const karte = page.getByTestId("rueckblickkarte");
  const zeile = karte.locator(".rueckblick-findezeile");
  await expect(zeile.locator("summary")).toHaveText("Guter Schlag ausgelassen (Kapitel 1)");
  await zeile.locator("summary").click();
  await expect(zeile.getByRole("button", { name: "Üben: Zähltrainer" })).toBeVisible();
  await karte.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${BILDER}/n2603-rueckblick.png` });
  await zuege.getByRole("button", { name: /^1\. e4/ }).click();
  await expect(karte.locator(".rueckblick-findezeile")).toHaveCount(0);
});

// N2576, N2577: Beide Haken sind vorab an; mit ihnen bekommt der Fehler des Gegners (3... Sf6??
// im Schäfermatt, eigene Seite Weiß) die Folgen der Engine.
test("Neue Variante aus Partie: Engine-Folgen und Fehler des Gegners vorab an", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffneProfil(page);
  await page.getByRole("button", { name: "Partie einlesen (PGN)", exact: true }).click();
  const formular = page.getByTestId("pgnimport");
  await formular.getByLabel("PGN der Partie").fill("1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7# 1-0");
  await formular.getByRole("button", { name: "Einlesen und auswerten" }).click();
  await expect(page.getByTestId("partieende")).toContainText("Matt", { timeout: AUSWERTUNG_FRIST });
  // Erst wenn die Auswertung fertig ist, kennt die Partie ihre Fehler.
  await expect(page.getByTestId("spielstaerke")).toBeVisible({ timeout: AUSWERTUNG_FRIST });
  await oeffneVarianten(page);
  await page.getByRole("button", { name: "Neue Variante" }).click();
  const blatt = page.getByTestId("varianten-neu");
  await blatt.getByRole("button", { name: "Partie", exact: true }).click();
  await expect(blatt.getByLabel(/Engine-Folgen übernehmen/)).toBeChecked();
  await expect(blatt.getByLabel("Auch an Fehlern des Gegners")).toBeChecked();
  await page.screenshot({ path: `${BILDER}/n2576-blatt.png` });
  await blatt.getByRole("button", { name: /Halbzüge/ }).click();
  await expect(page.getByTestId("variantentitel")).toContainText("Partie vom");
  // Der Patzer 3... Sf6?? ist ein Fehler des Gegners: Gabel „2“ mit „Besser war (Engine)“.
  await expect(page.locator(".bildschirm-variante")).toContainText(/3\. Lc4[^2]*2\s*Sf6\?\?/);
  await page.screenshot({ path: `${BILDER}/n2577-variante.png` });
});

// N2572: Eine ungespeicherte Variante fragt vor „Karte“, ob sie gespeichert werden soll.
test("Ungespeicherte Variante: Karte fragt „Dafür muss die Variante gespeichert sein“", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffneVarianten(page);
  await page.getByRole("button", { name: "Neue Variante" }).click();
  await page.getByTestId("varianten-neu").getByRole("button", { name: "Grundstellung" }).click();
  const tasten = page.locator(".bildschirm-variante .brett-tasten");
  await tasten.locator('button[aria-label^="e2"]').click();
  await tasten.locator('button[aria-label^="e4"]').click();
  await expect(page.getByTestId("variantenstatus")).toContainText("nicht gespeichert");
  await page.getByRole("button", { name: "Karte", exact: true }).click();
  await expect(page.getByText("Dafür muss die Variante gespeichert sein")).toBeVisible();
  await page.screenshot({ path: `${BILDER}/n2572-frage.png` });
});

// N2591: Einstellungen › Bedienung, „Was zuerst kommt“ mit Buch, Spielen, Umsehen; die Wahl bleibt.
test("Einstellung „Was zuerst kommt“: drei Wege, Spielen bleibt nach dem Neuladen", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  const wahl = page.getByRole("radiogroup", { name: "Was zuerst kommt" });
  const oeffne = async () => {
    await oeffneEinstellungen(page);
    await page.getByRole("tab", { name: "Bedienung" }).click();
  };
  await oeffne();
  for (const name of ["Buch", "Spielen", "Umsehen"])
    await expect(wahl.getByRole("radio", { name, exact: true })).toBeVisible();
  await wahl.getByRole("radio", { name: "Spielen", exact: true }).click();
  await wahl.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${BILDER}/n2591-einstellung.png` });
  await page.reload();
  await oeffne();
  await expect(wahl.getByRole("radio", { name: "Spielen", exact: true })).toHaveAttribute(
    "aria-checked",
    "true",
  );
});

// N2526: Steckbrief „Spanische Partie“ öffnet die ganze Eröffnung als Variante,
// ohne Zwischenblatt.
test("Steckbrief: Ganze Eröffnung als Variante", async ({ page }) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Steckbriefe/ }).click();
  await page.getByTestId("steckbrief").filter({ hasText: "Spanische Partie" }).click();
  await page.getByRole("button", { name: /Ganze Eröffnung als Variante/ }).click();
  await expect(page.getByTestId("variantentitel")).toContainText("Spanische Partie");
  await page.screenshot({ path: `${BILDER}/n2526-variante.png` });
});

// N2461: Spielen › Eigene Bots ohne eigenen Gegner (nur Bildschirmfoto zum Ansehen).
test("Eigene Bots ohne Gegner: Bildschirmfoto", async ({ page }) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffneSpielen(page);
  await oeffneSpielseite(page, "eigene");
  await page.getByText("Eigene Bots verwalten").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${BILDER}/n2461-eigene-bots.png` });
});
