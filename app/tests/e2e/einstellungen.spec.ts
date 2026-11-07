/**
 * Oberflächentests der Einstellungen nach dem Entwurf K2 (Wahl des Autors, 31.10.2026): drei
 * Reiter, darunter genau einmal die Unterseiten „Bots und Wertung“, „Deine Daten“, „Über die App“.
 * Seit dem Wunsch des Autors vom 7.11.2026 gibt es dort keine Brettvorschau und keine Wahl von
 * Brett und Figuren mehr; oben führt die Zeile „Aussehen … im Profil wählen“ zur Profilkarte „Dein
 * Aussehen“, deren Wahl auf allen Brettern der App gilt. Dazu Bildschirmfotos in Handybreite
 * (360 Pixel), dunkel und hell, unter test-results/bilder/ für den Bericht.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { oeffneAbbildung, oeffneAussehen, oeffneEinstellungen, starteImBrowser } from "./hilfen";

/** Name der Zeile, die aus den Einstellungen zur Profilkarte „Dein Aussehen“ führt. */
const AUSSEHEN = "Aussehen (Brett, Figuren, Rahmen) im Profil wählen";
/** Dunkles Feld des Brettes „Grün“ (ui/brett/masse.ts). */
const GRUEN_DUNKEL = "#769656";

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

test("Aussehen: Einstellungen ohne doppelte Wahl, die Zeile führt zur Karte, Reiter und Seiten je einmal", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  // Keine Brettvorschau und keine Wahl von Brett und Figuren mehr in den Einstellungen.
  await expect(page.getByRole("radiogroup", { name: /Brett|Figuren/ })).toHaveCount(0);
  await expect(page.locator(".brett")).toHaveCount(0);
  await expect(page.getByRole("switch", { name: "Koordinaten" })).toHaveCount(0);
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

test("Aussehen: Die Zeile in den Einstellungen öffnet die Karte im Profil, die Wahl gilt am Brett", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  await page.getByRole("button", { name: AUSSEHEN }).click();
  const karte = page.getByTestId("extras");
  await expect(karte.getByRole("heading", { name: "Dein Aussehen" })).toBeInViewport();
  await expect(karte.getByRole("tab", { name: "Brett", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  // Frei und gesperrt in einer Reihe: „wie im Buch“ gewählt, „Nacht und Gold“ mit Schloss.
  await expect(karte.getByTestId("wahl-brett-buch")).toHaveAttribute("aria-pressed", "true");
  await expect(karte.getByTestId("extra-brett-nacht-gold")).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await karte.getByTestId("wahl-brett-gruen").click();
  await expect(karte.getByTestId("wahl-brett-gruen")).toHaveAttribute("aria-pressed", "true");
  await expect(karte.getByTestId("wahl-brett-buch")).toHaveAttribute("aria-pressed", "false");
  const buehne = karte.getByTestId("extras-buehne");
  await expect(buehne.locator(`rect[fill="${GRUEN_DUNKEL}"]`).first()).toBeAttached();
  await karte.getByRole("tab", { name: "Figuren", exact: true }).click();
  await karte.getByTestId("wahl-figuren-klassisch-merida").click();
  await expect(buehne.locator("image[href$='klassisch-merida/wN.svg']")).toHaveCount(1);
  await expect(karte.getByTestId("extra-figuren-gold")).toContainText("Ab Stufe 5");
  // Die Wahl gilt auf jedem Brett der App, etwa an Abbildung 1.26.
  await page.getByRole("button", { name: "Buch", exact: true }).click();
  await oeffneAbbildung(page, "1.26", "1.26");
  const brett = page.locator(".brettbereich .brett");
  await expect(brett.locator(`rect[fill="${GRUEN_DUNKEL}"]`).first()).toBeAttached();
  await expect(brett.locator("image[href$='klassisch-merida/wK.svg']")).toHaveCount(1);
  // Koordinaten stehen im Reiter „Brett“ der Karte.
  const brettreiter = await oeffneAussehen(page, "Brett");
  await expect(brettreiter.getByRole("switch", { name: "Koordinaten" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
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
    await expect(page.getByRole("button", { name: AUSSEHEN })).toBeVisible();
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
