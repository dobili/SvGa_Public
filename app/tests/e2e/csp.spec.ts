/**
 * T4 (Nutzungsprüfung 25.10.2026): Die Content Security Policy, die der Build in dist/_headers
 * schreibt, gilt live zunächst nur beobachtend. Dieser Test erzwingt sie probeweise auf den
 * Seiten (über die Antworten des Vorschau-Servers) und prüft, dass Startseite, App, Abbildung
 * mit Engine und eine Partie keinen einzigen Verstoß auslösen. Erst dann darf sie scharf werden.
 */
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

const ENGINE_FRIST_MS = 30_000;

/** Die beobachtende Regel aus dist/_headers. */
function regelAusHeaders(): string {
  const headers = readFileSync(new URL("../../dist/_headers", import.meta.url), "utf8");
  const zeile = headers.split("\n").find((z) => z.includes("Content-Security-Policy-Report-Only"));
  if (!zeile) throw new Error("Keine Content Security Policy in dist/_headers");
  return zeile.split(": ").slice(1).join(": ").trim();
}

/** Setzt die Regel als erzwungene Kopfzeile auf jede Seite und sammelt Verstöße. */
async function mitRegel(seite: Page, regel: string): Promise<void> {
  await seite.addInitScript(() => {
    const liste: string[] = [];
    (window as unknown as { cspVerstoesse: string[] }).cspVerstoesse = liste;
    document.addEventListener("securitypolicyviolation", (e) =>
      liste.push(`${e.violatedDirective} ${e.blockedURI}`),
    );
  });
  await seite.route("**/*", async (route) => {
    if (route.request().resourceType() !== "document") return route.continue();
    const antwort = await route.fetch();
    await route.fulfill({
      response: antwort,
      headers: { ...antwort.headers(), "content-security-policy": regel },
    });
  });
}

const verstoesse = (seite: Page) =>
  seite.evaluate(() => (window as unknown as { cspVerstoesse?: string[] }).cspVerstoesse ?? []);

test("Content Security Policy: Startseite, App, Engine und Partie ohne Verstoß", async ({
  page,
}) => {
  test.setTimeout(ENGINE_FRIST_MS * 3);
  await mitRegel(page, regelAusHeaders());
  await starteImBrowser(page);
  expect(await verstoesse(page)).toEqual([]);
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.getByRole("button", { name: "Engine", exact: true }).click();
  await expect(page.getByTestId("engine-messung")).toBeVisible({ timeout: ENGINE_FRIST_MS });
  expect(await verstoesse(page)).toEqual([]);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(page.locator(".bildschirm-partie .brett")).toBeVisible();
  expect(await verstoesse(page)).toEqual([]);
});
