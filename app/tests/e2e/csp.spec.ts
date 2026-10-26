/**
 * T4 (Nutzungsprüfung 25.10.2026): Die Content Security Policy, die der Build in dist/_headers
 * schreibt, gilt live zunächst nur beobachtend. Dieser Test erzwingt sie probeweise auf den
 * Seiten (über die Antworten des Vorschau-Servers) und prüft, dass Startseite, App, Abbildung
 * mit Engine und eine Partie keinen einzigen Verstoß auslösen. Erst dann darf sie scharf werden.
 * Seit 0.2.144 („Weg 1“, Nachtarbeit 25./26.10.2026) geht ein zweiter Test alle Bereiche durch:
 * alle 17 Trainer, Nachschlagen mit Unterseiten, Lernsammlung, Profil mit Porträt-Baukasten
 * (data:-Bilder, nachgeladener DiceBear-Teil), Einstellungen mit allen Reitern, die englische
 * Fassung und die Seiten der Website. Jeder Verstoß lässt ihn fehlschlagen.
 */
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  oeffneAbbildung,
  oeffneEinstellungen,
  oeffneProfil,
  oeffneTrainer,
  starteImBrowser,
} from "./hilfen";
import { TRAINER } from "../../src/training/trainer";

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

const WEBSEITEN = ["/", "/installieren/", "/impressum/", "/datenschutz/", "/training/", "/admin/"];
const NACHSCHLAGEN = [
  "Glossar",
  "Denkroutine",
  "Gesamt-Checkliste",
  "Steckbriefe",
  "Werkzeuge des Buches",
];
const REITER = ["Brett", "Bedienung", "Anzeige", "Bots", "Hilfe"];
const BEREICHE_FRIST_MS = 240_000;

async function bereich(seite: Page, name: string): Promise<void> {
  await seite
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name, exact: true })
    .click();
}

test("Content Security Policy: alle Bereiche, Trainer, Baukasten, Englisch und Website", async ({
  page,
}) => {
  test.setTimeout(BEREICHE_FRIST_MS);
  await mitRegel(page, regelAusHeaders());
  for (const pfad of WEBSEITEN) await page.goto(pfad, { waitUntil: "networkidle" });
  expect(await verstoesse(page)).toEqual([]);
  await starteImBrowser(page);
  for (const { kennung } of TRAINER) {
    await oeffneTrainer(page, kennung);
    await page.waitForLoadState("networkidle");
  }
  expect(await verstoesse(page)).toEqual([]);
  for (const eintrag of NACHSCHLAGEN) {
    await bereich(page, "Nachschlagen");
    await page.getByRole("button", { name: new RegExp(`^${eintrag}`) }).click();
    await page.waitForLoadState("networkidle");
  }
  await bereich(page, "Training");
  expect(await verstoesse(page)).toEqual([]);
  await oeffneProfil(page);
  await page.getByRole("button", { name: "Name und Porträt" }).click();
  await page.getByRole("radio", { name: "Selbst gestalten" }).click();
  await expect(
    page.getByTestId("profileditor").getByTestId("spielerbild").locator("img"),
  ).toHaveAttribute("src", /^data:image\/svg\+xml/);
  expect(await verstoesse(page)).toEqual([]);
  await oeffneEinstellungen(page);
  for (const reiter of REITER) await page.getByRole("tab", { name: reiter }).click();
  await page.getByRole("tab", { name: "Anzeige" }).click();
  await page.getByRole("radio", { name: "English (preview)" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(await verstoesse(page)).toEqual([]);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Book" })).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(await verstoesse(page)).toEqual([]);
});
