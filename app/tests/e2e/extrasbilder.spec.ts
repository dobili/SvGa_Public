/**
 * Bildschirmfotos der Profilkarte „Dein Aussehen“ (bis 7.11.2026 „Deine Extras“; Entwurf E1
 * „Ankleide“, 31.10.2026) mit den Reitern Rahmen, Titel, Brett und Figuren (seit 7.11.2026 alle
 * Bretter und Figurensätze, freie und gesperrte), in Handybreite (360 px), hell und dunkel.
 * Eingestellt wird ein Probestand über die Aufgabenseite: Stufe 6 (Rahmen Bronze und Silber,
 * Figurensatz Gold und bunte Konfettifarben frei), Rahmen Silber angelegt. Die Bilder landen in
 * test-results/bilder/ für den Bericht an den Autor.
 */
import { expect, test, type Page } from "@playwright/test";
import { ladeMitSprung, oeffneProfil, starteImBrowser } from "./hilfen";

/** Stufe des Probestands (Schwellen aus fortschritt/erfahrung.ts, über die Probe erreicht). */
const PROBESTUFE = 6;

/** Merker vor dem Start: Farbschema, Rahmen Silber angelegt, Name und Porträt fürs Profil. */
async function setzeMerker(page: Page, schema: "hell" | "dunkel"): Promise<void> {
  await page.addInitScript((farbschema) => {
    window.localStorage.setItem("svga.farbschema", farbschema);
    window.localStorage.setItem("svga.portraetrahmen", "silber");
  }, schema);
}

/** Hebt die Stufe über die Probe der Aufgabenseite bis zur Probestufe. */
async function hebeStufe(page: Page): Promise<void> {
  await ladeMitSprung(page, "/app/#aufgaben");
  const probe = page.getByTestId("abzeichen-probe");
  await probe.locator("summary").click();
  const knopf = probe.getByRole("button", { name: "Nächste Stufe erreichen" });
  for (let stufe = 1; stufe < PROBESTUFE; stufe += 1) await knopf.click();
}

for (const schema of ["dunkel", "hell"] as const) {
  test(`Dein Aussehen: Bilder (${schema})`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 1100 });
    await starteImBrowser(page);
    await setzeMerker(page, schema);
    await hebeStufe(page);
    await page.goto("/app/");
    await page.reload();
    await oeffneProfil(page);
    const karte = page.getByTestId("extras");
    await expect(karte.getByTestId("extras-buehne")).toBeVisible();
    await karte.screenshot({ path: `test-results/bilder/extras-neu-rahmen-${schema}.png` });
    await karte.getByRole("tab", { name: "Titel" }).click();
    await karte.screenshot({ path: `test-results/bilder/extras-neu-titel-${schema}.png` });
    await karte.getByRole("tab", { name: "Brett" }).click();
    await karte.screenshot({ path: `test-results/bilder/extras-neu-brett-${schema}.png` });
    await karte.getByRole("tab", { name: "Figuren" }).click();
    await karte.screenshot({ path: `test-results/bilder/extras-neu-figuren-${schema}.png` });
  });
}
