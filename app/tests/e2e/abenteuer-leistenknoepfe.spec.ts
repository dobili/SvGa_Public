/**
 * Tagebuch und Menü stehen ordentlich nebeneinander (Befund des Autors, 25.11.2026: hoch oben
 * rechts saß ☰ ganz oben, 📖 tiefer und weiter links, über Möbeln, Wänden und bei Juno über einem
 * Gebäude). Gemessen in jeder Lage der beiden Knöpfe: in freier Welt unten links gegenüber dem Joystick (26.11.2026)
 * und im Dialog oben, hoch und quer. Beide gleich hoch (±1 px), gleich groß, nebeneinander mit
 * der Fuge der Reihe (höchstens zwei Raster), ganz im Bild; im Dialog die Münzen in derselben Zeile.
 * Ursache am iPhone: Was in der Welt steht, zählte den sicheren Rand oben doppelt (bedienung.css);
 * Chromium hat keinen sicheren Rand, hier prüft der Test die Reihe selbst.
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { feldDarunter } from "./abenteuer-karte";

/** Größte Fuge zwischen den Knöpfen (zwei Raster). */
const FUGE_HOECHSTENS = 16;
const RUNDUNG = 1;

/** Im Park von Maple Falls auf freier Wiese. */
const WELT = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.park", x: 20, y: 18, richtung: "rechts" },
  dialogvariablen: { ...EINLEITUNG_GESEHEN, hinweisSteuerkreuz: true, hinweisAktion: true },
};

/** Am Felsbogen vor der Seilschaft: Ansprechen öffnet einen Dialog (wie abenteuer-querbretter). */
const DIALOG = {
  ...GRUNDSTAND,
  dialogvariablen: { ...EINLEITUNG_GESEHEN, versoehnungGesehen: true, seilschaftBegonnen: true },
  position: {
    karte: "wegDelacroixDesert.felsbogen",
    ...feldDarunter("weg-delacroix-desert-felsbogen", "ereignisSeilschaft"),
    richtung: "oben",
  },
};

async function pruefeReihe(s: Page): Promise<void> {
  const tagebuch = await s.getByTestId("abenteuer-tagebuchknopf").boundingBox();
  const menue = await s.getByTestId("abenteuer-menueknopf").boundingBox();
  if (!tagebuch || !menue) throw new Error("Knopf ohne Lage");
  const lage = JSON.stringify({ tagebuch, menue });
  expect(Math.abs(tagebuch.y - menue.y), lage).toBeLessThanOrEqual(RUNDUNG);
  expect(Math.abs(tagebuch.height - menue.height), lage).toBeLessThanOrEqual(RUNDUNG);
  const fuge =
    tagebuch.x < menue.x
      ? menue.x - (tagebuch.x + tagebuch.width)
      : tagebuch.x - (menue.x + menue.width);
  expect(fuge, lage).toBeGreaterThanOrEqual(0);
  expect(fuge, lage).toBeLessThanOrEqual(FUGE_HOECHSTENS);
  const v = s.viewportSize() ?? { width: 0, height: 0 };
  for (const b of [tagebuch, menue]) {
    expect(
      b.y >= 0 && b.x >= 0 && b.y + b.height <= v.height && b.x + b.width <= v.width,
      lage,
    ).toBe(true);
  }
}

for (const format of [
  { name: "hoch", viewport: { width: 390, height: 844 } },
  { name: "quer", viewport: { width: 844, height: 390 } },
]) {
  test.describe(`Tagebuch und Menü ${format.name}`, () => {
    test.use({ viewport: format.viewport, hasTouch: true, isMobile: true });

    test("in freier Welt: nebeneinander, gleich hoch", async ({ page }) => {
      await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
      await starteMitStand(page, WELT);
      await pruefeReihe(page);
    });

    test("im Dialog: nebeneinander, gleich hoch", async ({ page }) => {
      test.slow();
      await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
      await starteMitStand(page, DIALOG);
      await expect(async () => {
        const dialog = page.getByTestId("abenteuer-dialog");
        if (!(await dialog.isVisible())) await page.getByTestId("abenteuer-aktion").click();
        await expect(dialog).toBeVisible({ timeout: 3000 });
      }).toPass({ timeout: 30000 });
      await pruefeReihe(page);
      // Die Münzen stehen im Dialog links daneben, in derselben Zeile (Mitte ±2 px).
      const muenzen = await page.getByTestId("abenteuer-muenzen").boundingBox();
      const menue = await page.getByTestId("abenteuer-menueknopf").boundingBox();
      if (!muenzen || !menue) throw new Error("ohne Lage");
      expect(
        Math.abs(muenzen.y + muenzen.height / 2 - (menue.y + menue.height / 2)),
      ).toBeLessThanOrEqual(2);
    });
  });
}
