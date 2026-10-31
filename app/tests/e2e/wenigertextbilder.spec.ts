/**
 * Bildschirmfotos der Runde „Weniger Text“, Werkzeuge und Trainer (P7 bis P12, P14, 31.10.2026)
 * in Handybreite (360 px), hell und dunkel, für den Bericht an den Autor. Je Punkt ein Bild im
 * Grundzustand und, wo es einen Infoknopf gibt, eines mit aufgeklapptem ⓘ. Dazu prüft jeder
 * Schritt, dass die Seite bei 360 px nicht waagerecht übersteht.
 * Die Bilder landen in test-results/bilder/wenigertext-<punkt>-<schema>.png.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  oeffneAbbildung,
  oeffneTrainer,
  starteImBrowser,
  starteRunde,
  waehleWerkzeug,
} from "./hilfen";

/** Wie in werkzeuge-k6-k12.spec.ts: so lange darf die Engine rechnen. */
const ENGINE_FRIST_MS = 30_000;
const BREITE = 360;
const HOEHE = 1400;
const SCHEMATA = ["dunkel", "hell"] as const;
type Schema = (typeof SCHEMATA)[number];

/** Startet die App in Handybreite mit dem gewünschten Farbschema. */
async function starte(page: Page, schema: Schema): Promise<void> {
  await page.setViewportSize({ width: BREITE, height: HOEHE });
  await page.addInitScript((farbschema) => {
    window.localStorage.setItem("svga.farbschema", farbschema);
  }, schema);
  await starteImBrowser(page);
}

/** Kein waagerechter Überstand bei 360 px. */
async function ohneUeberstand(page: Page): Promise<void> {
  const breiten = await page.evaluate(() => ({
    inhalt: document.documentElement.scrollWidth,
    fenster: window.innerWidth,
  }));
  expect(breiten.inhalt).toBeLessThanOrEqual(breiten.fenster);
}

/** Bild eines Bereichs; der Name nennt Punkt, Zustand und Schema. */
async function bild(ort: Locator, name: string, schema: Schema): Promise<void> {
  await ort.screenshot({ path: `test-results/bilder/wenigertext-${name}-${schema}.png` });
}

for (const schema of SCHEMATA) {
  test(`Weniger Text, Werkzeuge P7 bis P10 (${schema})`, async ({ page }) => {
    test.setTimeout(ENGINE_FRIST_MS * 3);
    await starte(page, schema);
    await oeffneAbbildung(page, "1.26", "1.26");
    const karte = page.getByTestId("werkzeugkarte");
    // P7: Legende als Pfeilreihe.
    await waehleWerkzeug(page, "Röntgen");
    await expect(karte.getByTestId("pfeillegende")).toBeVisible();
    await bild(karte, "p07", schema);
    await karte.getByRole("button", { name: "Erklärung: Zeichen am Brett" }).click();
    await bild(karte, "p07-info", schema);
    await ohneUeberstand(page);
    // P9: Statuschip bei den Prüffragen ohne Angebot.
    await waehleWerkzeug(page, "Prüffragen");
    await expect(karte.getByTestId("werkzeug-status")).toContainText("Nur bei Angebot");
    await karte.getByRole("button", { name: "Erklärung: Nur bei Angebot" }).click();
    await bild(karte, "p09", schema);
    await ohneUeberstand(page);
    // P8: Zählen mit Hand und „Feld antippen“.
    await waehleWerkzeug(page, "Zählen");
    const zeile = page.getByTestId("werkzeug-erklaerung");
    await zeile.getByRole("button", { name: "Erklärung: Zählen" }).click();
    await bild(page.locator(".abbildung-karten"), "p08", schema);
    await ohneUeberstand(page);
    // P10: Kandidaten als Zeilen.
    await oeffneAbbildung(page, "12.1", "12.1");
    await waehleWerkzeug(page, "Kandidaten");
    const engine = karte.getByTestId("kandidaten-karte");
    await expect(engine).toContainText("Stellung jetzt", { timeout: ENGINE_FRIST_MS });
    await expect(engine.getByRole("img", { name: "stärkster laut Engine" })).toBeVisible();
    await bild(karte, "p10", schema);
    await engine.getByRole("button", { name: "Erklärung: Bewertung der Engine" }).click();
    await bild(karte, "p10-info", schema);
    await ohneUeberstand(page);
  });

  test(`Weniger Text, Trainer P11, P12, P14 (${schema})`, async ({ page }) => {
    test.setTimeout(ENGINE_FRIST_MS * 3);
    await starte(page, schema);
    const runde = page.getByTestId("trainerrunde");
    // P11: Zähltrainer, Frage und Antwort.
    await oeffneTrainer(page, "zaehlen");
    await starteRunde(page);
    await runde.getByRole("button", { name: "Erklärung: Regel der Aufgabe" }).click();
    await bild(runde, "p11", schema);
    await runde.getByTestId("zaehl-ergebnisse").getByRole("button", { name: "+9" }).click();
    await expect(page.getByTestId("zaehl-rechnung")).toBeVisible();
    await bild(runde, "p11-antwort", schema);
    await ohneUeberstand(page);
    // P12: Falle oder Köder.
    await oeffneTrainer(page, "falle");
    await page.getByTestId("falle-wahl").getByRole("button", { name: "Runde starten" }).click();
    await expect(runde.getByRole("heading", { name: "Falle oder Geschenk?" })).toBeVisible();
    await bild(runde, "p12", schema);
    await runde.getByRole("button", { name: /^Nehmen:/ }).click();
    const antwort = page.getByTestId("falle-antwort");
    await antwort.getByRole("button", { name: "Erklärung: Auflösung" }).click();
    await bild(runde, "p12-antwort", schema);
    await ohneUeberstand(page);
    // P14: Taktik-Hinweis.
    await oeffneTrainer(page, "taktik");
    await page.getByTestId("taktik-wahl").getByRole("button", { name: "Runde starten" }).click();
    await runde.getByRole("button", { name: "Hinweis 1" }).click();
    const warn = page.getByTestId("taktik-warnsignal");
    await expect(warn).toContainText("Drohung");
    await bild(warn, "p14", schema);
    await warn.getByRole("button", { name: "Erklärung: Warnsignal" }).click();
    await bild(warn, "p14-info", schema);
    await ohneUeberstand(page);
  });
}
