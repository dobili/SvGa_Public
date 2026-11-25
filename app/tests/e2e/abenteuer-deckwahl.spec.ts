/**
 * Deckwahl mit gewählten Karten (Rückmeldung des Autors vom Handy hoch, 24.11.2026): Mit jeder
 * gewählten Karte stand ihre Erklärung darunter; die Kartenreihe schrumpfte dabei zu einem
 * schmalen Streifen, und die Erklärungen stapelten sich. Jetzt behält die Reihe ihre Höhe, und nur
 * die Erklärung der zuletzt angetippten Karte steht in einem Kasten; ohne Wahl ein kurzer Hinweis.
 * Der Knopf „Mit N Karten spielen“ bleibt im Bild. Geprüft hoch (Pixel 7) und quer (iPhone 15).
 * Mit DECKWAHL_FOTOS=ORDNER legt der Test Fotos dorthin (nur lokal, nie ins Repository).
 */
import { join } from "node:path";
import { devices, expect, test, type Page } from "@playwright/test";
import { GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** Drei Karten aus dem Besitz, alle vor und während der Partie wählbar. */
const KARTEN = ["fluestern", "fingerzeig", "abzaehlen", "gefahrenradar"];
const STAND = {
  ...GRUNDSTAND,
  karten: KARTEN.map((kennung) => ({ kennung, anzahl: 1, erhalten: "2026-11-13T10:00:00.000Z" })),
};
const FOTOS = process.env.DECKWAHL_FOTOS;

/** Gerät nur mit Fenster, Maßstab und Touch (der Browser bleibt der des Projekts). */
function geraet(name: "Pixel 7" | "iPhone 15 landscape") {
  const d = devices[name];
  return {
    viewport: d.viewport,
    deviceScaleFactor: d.deviceScaleFactor,
    isMobile: d.isMobile,
    hasTouch: d.hasTouch,
  };
}

/** Öffnet die Deckwahl über das Reisebrett. */
async function oeffneDeckwahl(seite: Page): Promise<void> {
  await starteMitStand(seite, STAND);
  const hinweis = seite.getByTestId("abenteuer-meldung").getByRole("button", { name: "Weiter" });
  await expect(seite.getByTestId("abenteuer-reisebrettknopf")).toBeVisible({ timeout: 20000 });
  if (await hinweis.isVisible()) await hinweis.click();
  await seite.getByTestId("abenteuer-reisebrettknopf").click();
  await expect(seite.getByTestId("abenteuer-deckwahl")).toBeVisible();
}

/** Höhe der ersten Karte im Fächer. */
async function kartenhoehe(seite: Page): Promise<number> {
  const box = await seite.getByTestId(`abenteuer-deckkarte-${KARTEN[0]}`).boundingBox();
  return box?.height ?? 0;
}

for (const name of ["Pixel 7", "iPhone 15 landscape"] as const) {
  test.describe(name, () => {
    test.use(geraet(name));

    test("Karten behalten ihre Höhe, nur eine Erklärung steht da", async ({ page }) => {
      await oeffneDeckwahl(page);
      const erklaerung = page.getByTestId("abenteuer-deck-erklaerung");
      await expect(erklaerung).toContainText("Tippe eine Karte an");
      const vorher = await kartenhoehe(page);
      expect(vorher).toBeGreaterThan(60);
      for (const kennung of KARTEN.slice(0, 3)) {
        await page.getByTestId(`abenteuer-deckkarte-${kennung}`).click();
      }
      await expect(page.locator(".abenteuer-karte-erklaerung")).toHaveCount(1);
      // Die zuletzt angetippte Karte (Abzählen) erklärt sich, Flüstern nicht mehr.
      await expect(erklaerung).not.toContainText("Ich flüstere dir");
      expect(Math.abs((await kartenhoehe(page)) - vorher)).toBeLessThanOrEqual(1);
      await expect(page.getByTestId("abenteuer-deck-los")).toBeInViewport({ ratio: 0.9 });
      // Der Kasten rollt nach dem Tipp ins Bild (quer lag er sonst unter dem Rand).
      await expect(erklaerung).toBeInViewport({ ratio: 0.9 });
      if (FOTOS) {
        const datei = `deckwahl-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
        await page.screenshot({ path: join(FOTOS, datei) });
      }
      await page.getByTestId(`abenteuer-deckkarte-${KARTEN[0]}`).click();
      await expect(erklaerung).toBeVisible();
      await expect(page.getByTestId("abenteuer-deck-los")).toBeInViewport({ ratio: 0.9 });
      await expect(page.getByTestId("abenteuer-deck-los")).toHaveText("Mit 2 Karten spielen");
    });
  });
}
