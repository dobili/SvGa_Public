/**
 * Oberflächentests zum Trainer-Feinschliff des Nebenchats (30.10.2026): Werkzeugreiter brechen
 * schmal um (Sicherheitsblick), Feld finden zeigt die Sicht deutlich, Röntgen begründet Pfeile.
 */
import { expect, test } from "@playwright/test";
import { oeffneAbbildung, oeffneTrainer, starteImBrowser, waehleWerkzeug } from "./hilfen";

/** Ein umgebrochener Reiter darf nicht mehr die ganze Zeile füllen. */
const HOECHSTENS_ANTEIL = 0.7;

test("Denkroutine-Reiter: „Sicherheitsblick“ ist nicht zeilenbreit", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await starteImBrowser(page);
  await oeffneAbbildung(page, "12.6", "12.6");
  await waehleWerkzeug(page, "Sicherheitsblick");
  const reiter = page.getByRole("tab", { name: "Sicherheitsblick" });
  const leiste = page.locator(".reiterleiste").first();
  const breite = (await reiter.boundingBox())?.width ?? 0;
  const gesamt = (await leiste.boundingBox())?.width ?? 1;
  expect(breite / gesamt).toBeLessThan(HOECHSTENS_ANTEIL);
  await page.screenshot({ path: "test-results/bilder/denkroutine-reiter.png" });
});

test("Feld finden: Die Sicht steht deutlich unter dem Brett", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "koordinaten");
  await page.getByRole("button", { name: /Feld finden/ }).click();
  await expect(page.getByTestId("sichtanzeige")).toContainText("Weiß spielt von unten.");
});

test.describe("Sprachangebot beim ersten Start", () => {
  test.use({ locale: "en-GB" });

  test("Gerät auf Englisch: Angebot erscheint, „Deutsch behalten“ merkt sich die Antwort", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem("svga.tour.angeboten", "ja");
        window.sessionStorage.setItem("svga.startanimation.sitzung", "ja");
      } catch (fehler) {
        console.warn("Merker nicht schreibbar:", fehler);
      }
    });
    await page.goto("/app/");
    const angebot = page.getByTestId("sprachangebot");
    await expect(angebot).toContainText("English translation is still in beta");
    await expect(angebot).toContainText("das englische Buch ist noch nicht erschienen");
    await page.screenshot({ path: "test-results/bilder/sprachangebot.png" });
    await angebot.getByRole("button", { name: /Keep German/ }).click();
    await expect(angebot).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
    await expect(page.getByTestId("sprachangebot")).toHaveCount(0);
  });
});
