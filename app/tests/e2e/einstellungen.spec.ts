/**
 * Oberflächentests der Einstellungen nach dem Entwurf K2 „Brettvorschau oben“ (Wahl des Autors,
 * 31.10.2026): große Brettvorschau mit Farbfeldern und Figurenkacheln, drei Reiter, darunter genau
 * einmal die Unterseiten „Bots und Wertung“, „Deine Daten“, „Über die App“. Dazu Bildschirmfotos
 * in Handybreite (360 Pixel), dunkel und hell, unter test-results/bilder/ für den Bericht.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { oeffneEinstellungen, starteImBrowser } from "./hilfen";

/** Breite eines kleinen Android-Handys (Pflichtenheft 2). */
const HANDY = { width: 360, height: 800 };
const BILDER = "test-results/bilder";
const SEITEN = ["Bots und Wertung", "Deine Daten", "Über die App"] as const;

/** Schwere Verstöße nach axe als kurze Texte. */
async function schwereVerstoesse(page: Page): Promise<string[]> {
  const ergebnis = await new AxeBuilder({ page }).analyze();
  return ergebnis.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

/** Kein waagerechtes Scrollen der Seite. */
async function ueberstand(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

test("Brettvorschau: Farbe und Figuren gelten sofort in der Vorschau, Reiter und Seiten je einmal", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  const vorschau = page.locator(".brettstudio .brett");
  await expect(vorschau.getByRole("img")).toBeVisible();
  await page
    .getByRole("radiogroup", { name: "Brettfarbe" })
    .getByRole("radio", { name: "Grün", exact: true })
    .click();
  await expect(vorschau.locator('rect[fill="#769656"]').first()).toBeAttached();
  await page
    .getByRole("radiogroup", { name: "Figuren", exact: true })
    .getByRole("radio", { name: "Merida" })
    .click();
  await expect(vorschau.locator("image[href$='klassisch-merida/wN.svg']")).toHaveCount(2);
  // Drei Reiter, „Bedienung“ vorn; die Unterseiten stehen genau einmal darunter.
  await expect(page.getByRole("tab")).toHaveText(["Bedienung", "Anzeige", "Hilfe"]);
  await expect(page.getByRole("tab", { name: "Bedienung" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  for (const reiter of ["Anzeige", "Hilfe", "Bedienung"]) {
    await page.getByRole("tab", { name: reiter }).click();
    for (const seite of SEITEN) {
      await expect(page.getByRole("button", { name: new RegExp(`^${seite}`) })).toHaveCount(1);
    }
  }
  await expect(page.getByRole("button", { name: /^Deine Daten/ })).toContainText(
    "noch nie gesichert",
  );
  await expect(page.getByRole("button", { name: /^Bots und Wertung/ })).toContainText(
    "ohne Maia · Lichess",
  );
  // Jede Seite öffnet sich und führt mit „Einstellungen“ zurück.
  for (const seite of SEITEN) {
    await page.getByRole("button", { name: new RegExp(`^${seite}`) }).click();
    await expect(page.getByRole("heading", { level: 1, name: seite })).toBeVisible();
    await page.locator(".kopfzeile").getByRole("button", { name: "Einstellungen" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Einstellungen" })).toBeVisible();
  }
});

test("Erklärung hinter dem Fragezeichen, Schriftgröße in einer Zeile", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  const frage = page.getByRole("button", { name: "Erklärung: Feiereffekte" });
  await expect(page.getByText(/Feuerwerk und Funkeln/)).toHaveCount(0);
  await frage.click();
  await expect(page.getByText(/Feuerwerk und Funkeln/)).toBeVisible();
  await page.getByRole("tab", { name: "Anzeige" }).click();
  await page.getByRole("button", { name: "Schrift größer" }).click();
  await expect(page.getByTestId("schriftgroesse-wert")).toHaveText("110 %");
  await page.getByRole("button", { name: "Standard" }).click();
  await expect(page.getByTestId("schriftgroesse-wert")).toHaveText("100 %");
});

for (const schema of ["dunkel", "hell"] as const) {
  test(`Einstellungen neu: Bilder in Handybreite und axe (${schema})`, async ({ page }) => {
    await page.setViewportSize(HANDY);
    await page.addInitScript(
      (wert) => window.localStorage.setItem("svga.farbschema", wert),
      schema,
    );
    await starteImBrowser(page);
    await oeffneEinstellungen(page);
    await expect(page.locator(".brettstudio .brett")).toBeVisible();
    // Die feste Leiste läge auf Ganzseitenbildern mitten im Bild; für die Bilder ausgeblendet.
    await page.addStyleTag({ content: ".leiste { visibility: hidden; }" });
    expect(await ueberstand(page)).toBeLessThanOrEqual(0);
    expect(await schwereVerstoesse(page)).toEqual([]);
    await page.screenshot({ path: `${BILDER}/einstellungen-${schema}.png`, fullPage: true });
    for (const reiter of ["Anzeige", "Hilfe"]) {
      await page.getByRole("tab", { name: reiter }).click();
      expect(await schwereVerstoesse(page), reiter).toEqual([]);
      await page
        .locator(".einstellungsreiter")
        .screenshot({ path: `${BILDER}/einstellungen-${reiter.toLowerCase()}-${schema}.png` });
    }
    for (const [seite, datei] of [
      ["Bots und Wertung", "bots"],
      ["Deine Daten", "daten"],
      ["Über die App", "ueber"],
    ] as const) {
      await page.getByRole("button", { name: new RegExp(`^${seite}`) }).click();
      await expect(page.getByRole("heading", { level: 1, name: seite })).toBeVisible();
      expect(await ueberstand(page), seite).toBeLessThanOrEqual(0);
      expect(await schwereVerstoesse(page), seite).toEqual([]);
      await page.screenshot({
        path: `${BILDER}/einstellungen-${datei}-${schema}.png`,
        fullPage: true,
      });
      await page.locator(".kopfzeile").getByRole("button", { name: "Einstellungen" }).click();
    }
  });
}
