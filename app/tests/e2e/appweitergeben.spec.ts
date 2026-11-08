/**
 * Oberflächentests von „App weitergeben“ (Wunsch des Autors, 8.11.2026): Der Knopf im Profil
 * öffnet das Blatt mit QR-Code, „Link kopieren“ legt die Adresse der Installationsseite in die
 * Zwischenablage, WhatsApp- und Mail-Link tragen Satz und Adresse, das Teilen-Menü des Geräts
 * bekommt Titel, Satz und Adresse. Auch „Über die App“ hat den Knopf.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneEinstellungsseite, oeffneProfil, starteImBrowser } from "./hilfen";

const ADRESSE = "https://schach-von-grund-auf.com/installieren/";
const SATZ = "Lern Schach mit mir! Die kostenlose App zum Buch „Schach von Grund auf“:";

/** Öffnet das Blatt über den Knopf im Profil. */
async function oeffneBlatt(page: Page) {
  await oeffneProfil(page);
  await page.getByTestId("app-weitergeben").click();
  const blatt = page.getByTestId("weitergeben-blatt");
  await expect(blatt.getByRole("heading", { name: "App weitergeben" })).toBeVisible();
  return blatt;
}

test("App weitergeben: QR-Code, Link kopieren, WhatsApp und Mail", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  // Ohne Teilen-Menü (wie Firefox am Rechner): nur WhatsApp, Mail und Kopieren. Die
  // Init-Skripte stehen vor dem ersten Laden, damit sie schon beim Start gelten.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
  });
  await starteImBrowser(page);
  const blatt = await oeffneBlatt(page);
  const qr = blatt.getByTestId("qr-bild");
  await expect(qr).toBeVisible();
  await expect(qr).toHaveAttribute("aria-label", `QR-Code mit der Adresse ${ADRESSE}`);
  await expect(qr).toHaveAttribute("data-qr-version", "4");
  const breite = (await qr.boundingBox())?.width ?? 0;
  expect(breite).toBeGreaterThan(200);
  await expect(blatt.getByRole("button", { name: /^Teilen/ })).toHaveCount(0);
  await expect(blatt.getByTestId("weitergeben-adresse")).toHaveText(ADRESSE);

  await blatt.getByRole("button", { name: "Link kopieren" }).click();
  await expect(blatt.getByRole("status")).toHaveText(
    "Link kopiert. Füge ihn in eine Nachricht ein.",
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(ADRESSE);

  const whatsapp = await blatt.getByTestId("weitergeben-whatsapp").getAttribute("href");
  expect(whatsapp).toBe(`https://wa.me/?text=${encodeURIComponent(`${SATZ} ${ADRESSE}`)}`);
  const mail = await blatt.getByTestId("weitergeben-mail").getAttribute("href");
  expect(mail).toContain(`&body=${encodeURIComponent(`${SATZ} ${ADRESSE}`)}`);
  await page.screenshot({ path: "test-results/bilder/app-weitergeben.png" });

  await blatt.getByRole("button", { name: "Schließen" }).click();
  await expect(blatt).toHaveCount(0);
});

test("App weitergeben: das Teilen-Menü bekommt Titel, Satz und Adresse", async ({ page }) => {
  await page.addInitScript(() => {
    const fenster = window as unknown as { geteilt: ShareData[] };
    fenster.geteilt = [];
    Object.defineProperty(navigator, "share", {
      value: (daten: ShareData) => {
        fenster.geteilt.push(daten);
        return Promise.resolve();
      },
      configurable: true,
    });
  });
  await starteImBrowser(page);
  const blatt = await oeffneBlatt(page);
  await blatt.getByRole("button", { name: "Teilen (WhatsApp, Signal, Telegram …)" }).click();
  const geteilt = await page.evaluate(
    () => (window as unknown as { geteilt: ShareData[] }).geteilt,
  );
  expect(geteilt).toEqual([
    { title: "Schach von Grund auf – die kostenlose Schach-App", text: SATZ, url: ADRESSE },
  ]);
});

test("App weitergeben: auch unter Einstellungen › Über die App", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneEinstellungsseite(page, "Über die App");
  await page.getByTestId("app-weitergeben").click();
  await expect(page.getByTestId("weitergeben-blatt").getByTestId("qr-bild")).toBeVisible();
});
