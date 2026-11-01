/**
 * Oberflächentests für den Variationsbrowser, Stufe 3 (1.11.2026) mit der echten Engine: Analyse
 * starten, Fortschritt, Zugarten an den Zügen und am Brett, Bewertungsbalken, grüner Engine-Pfeil,
 * die drei Schalter blenden aus (gemerkt), neue Züge werden von selbst nachgerechnet, Werte im
 * PGN; dazu die Karte „Probepartie läuft“ auf „Spielen“.
 */
import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

/** Die Analyse von etwa zehn Stellungen mit Tiefe 18 darf auf langsamen Prüfrechnern dauern. */
const ANALYSE_FRIST = 150_000;

/** Öffnet die Liste „Varianten“ über die Kachel im Training. */
async function oeffneVarianten(seite: Page): Promise<void> {
  await seite.getByRole("navigation").getByRole("button", { name: "Training" }).click();
  await seite.getByTestId("kachel-varianten").getByRole("button").click();
}

/** Liest eine PGN als neue Variante ein. */
async function liesEin(seite: Page, pgn: string): Promise<void> {
  await oeffneVarianten(seite);
  await seite.getByRole("button", { name: "PGN", exact: true }).click();
  const feld = seite.getByTestId("varianten-einfuegen");
  await feld.getByLabel("PGN oder FEN").fill(pgn);
  await feld.getByRole("button", { name: "Einlesen" }).click();
  await expect(seite.getByTestId("variantenstatus")).toContainText("Gespeichert");
}

/** Zieht von Feld zu Feld durch zwei Tipps aufs Brett. */
async function ziehe(seite: Page, von: string, nach: string): Promise<void> {
  const tasten = seite.locator(".bildschirm-variante .brett-tasten");
  await tasten.locator(`button[aria-label^="${von}"]`).click();
  await tasten.locator(`button[aria-label^="${nach}"]`).click();
}

/** Zahl der Pfeilspitzen auf dem Brett der Variante. */
async function pfeilspitzen(seite: Page): Promise<number> {
  return seite.locator(".bildschirm-variante .brett polygon").count();
}

test("Analyse: Fortschritt, Zugarten, Balken, Engine-Pfeil, Schalter, Nachrechnen", async ({
  page,
}) => {
  test.setTimeout(ANALYSE_FRIST * 2);
  await starteImBrowser(page);
  await liesEin(
    page,
    '[Event "Schäfermatt"]\n\n1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 (3... g6) 4. Qxf7# *',
  );
  // Vor der Analyse: keine Schalter, kein Balken.
  await expect(page.getByTestId("analysechip-symbole")).toHaveCount(0);
  await page.getByTestId("analyseknopf").click();
  await expect(page.getByTestId("analyseknopf")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("analysefortschritt")).toContainText("Stellungen");
  // Während der Analyse blättern geht.
  await page.getByRole("button", { name: "Zum Ende" }).click();
  await expect(page.getByTestId("analysefortschritt")).toHaveCount(0, { timeout: ANALYSE_FRIST });
  const zeile = page.getByTestId("variantenzeile");
  // 3... Sf6?? lässt das Matt zu: Patzer an der Zugleiste; 4. Dxf7# am Brett mit Marke.
  await expect(zeile.locator(".klassenmarke-patzer")).toHaveCount(1);
  await expect(page.getByTestId("zugmarke-brett")).toBeVisible();
  await page.getByRole("button", { name: "Einen Halbzug zurück" }).click();
  await expect(page.getByTestId("bewertungsbalken")).toBeVisible();
  // Grüner Pfeil: der beste Zug der Engine (Dxf7#); aus und wieder an.
  const mitPfeil = await pfeilspitzen(page);
  await page.getByTestId("analysechip-pfeil").click();
  await expect.poll(() => pfeilspitzen(page)).toBe(mitPfeil - 1);
  await page.getByTestId("analysechip-balken").click();
  await expect(page.getByTestId("bewertungsbalken")).toHaveCount(0);
  await page.getByTestId("analysechip-symbole").click();
  await expect(zeile.locator(".klassenmarke")).toHaveCount(0);
  // Die Schalter merkt das Gerät; die Werte stehen im Speicher.
  await page.reload();
  await oeffneVarianten(page);
  await page.getByTestId("variantenkarte").getByRole("button").click();
  await expect(page.getByTestId("analysechip-symbole")).toHaveAttribute("aria-pressed", "false");
  await page.getByTestId("analysechip-symbole").click();
  await page.getByTestId("analysechip-balken").click();
  await page.getByRole("button", { name: "Zum Ende" }).click();
  await expect(page.getByTestId("variantenzeile").locator(".klassenmarke-patzer")).toHaveCount(1);
  // Ein neuer Zug wird von selbst nachgerechnet (nur er).
  await page.getByRole("button", { name: "Zum Anfang" }).click();
  await ziehe(page, "d2", "d4");
  await expect(page.getByTestId("analysefortschritt")).toContainText("von 1 ");
  await expect(page.getByTestId("analysefortschritt")).toHaveCount(0, { timeout: ANALYSE_FRIST });
  await expect(page.getByTestId("bewertungsbalken")).toBeVisible();
  // PGN mit Werten: im Blatt der Variante als Datei; wieder eingelesen sind die Werte sofort da.
  await page.getByTestId("variantentitel").click();
  const herunterladen = page.waitForEvent("download");
  await page.getByRole("button", { name: "Als PGN-Datei sichern" }).click();
  const pgn = await readFile(await (await herunterladen).path(), "utf8");
  expect(pgn).toContain("[%eval ");
  expect(pgn).toContain("[%svgb ");
});

test("Analyse abbrechen: Fertiges bleibt, der Knopf ist wieder aus", async ({ page }) => {
  test.setTimeout(ANALYSE_FRIST);
  await starteImBrowser(page);
  await liesEin(page, "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 *");
  await page.getByTestId("analyseknopf").click();
  await expect(page.getByTestId("analysefortschritt")).toBeVisible();
  await page.getByTestId("analysefortschritt").getByRole("button", { name: "Abbrechen" }).click();
  await expect(page.getByTestId("analysefortschritt")).toHaveCount(0);
  await expect(page.getByTestId("analyseknopf")).toHaveAttribute("aria-pressed", "false");
});

test("Probepartie läuft: Karte auf Spielen mit Weiterspielen und Beenden", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneVarianten(page);
  await page.getByRole("button", { name: "Neue Variante" }).click();
  await page.getByTestId("varianten-neu").getByRole("button", { name: "Grundstellung" }).click();
  await ziehe(page, "e2", "e4");
  await page.getByRole("button", { name: "Von hier spielen" }).click();
  await page
    .getByTestId("variante-speicherfrage")
    .getByRole("button", { name: "Speichern", exact: true })
    .click();
  await page
    .getByTestId("vorschlagskarte")
    .getByRole("button", { name: /^Spielen/ })
    .click();
  await expect(page.getByTestId("probeabschluss")).toBeVisible();
  // Verlassen, ohne zu beenden: Die Karte auf „Spielen“ führt zurück.
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  const karte = page.getByTestId("probekarte");
  await expect(karte).toContainText("Probepartie läuft");
  await expect(karte).toContainText("zählt nicht");
  await karte.getByRole("button", { name: "Weiterspielen" }).click();
  await expect(page.getByTestId("probeabschluss")).toBeVisible();
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await karte.getByRole("button", { name: "Beenden" }).click();
  await karte.getByRole("button", { name: "Verwerfen" }).click();
  await expect(page.getByTestId("probekarte")).toHaveCount(0);
});
