/**
 * Bildschirmfotos und Prüfungen der Runde „Weniger Text: Seiten“ (P1 bis P6, P13, P15; Wahl des
 * Autors, 31.10.2026) in Handybreite (360 px), dunkel und hell. Je Punkt: Bildzeichen statt Satz,
 * ein Tipp auf ⓘ zeigt den früheren Satz, und nichts steht waagerecht über. Die Bilder landen in
 * test-results/bilder/ für den Bericht an den Autor.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { oeffneEinstellungsseite, oeffneProfil, starteImBrowser } from "./hilfen";
import { oeffneSpielen, oeffneSpielseite, spieleVorschlag, ungewertet } from "./spielenhilfen";

/** Handybreite des Auftrags. */
const BREITE = 360;
const HOEHE = 1400;
/** Die Engine rechnet im Browser; der erste Start lädt die WASM-Datei. */
const ENGINE_FRIST = 60_000;

/**
 * Kein waagerechter Überstand: Die Seite (oder nur `bereich`) ist nicht breiter als das Fenster.
 * Auf dem Lernpfad ragen die Sonnenstrahlen der Landschaft (Landschaft.tsx, nicht Teil dieser
 * Runde) 3 px hinaus; dort prüft der Test nur den neuen Kopf.
 */
async function ohneUeberstand(seite: Page, bereich?: Locator): Promise<void> {
  if (bereich) {
    const kasten = await bereich.boundingBox();
    expect((kasten?.x ?? 0) + (kasten?.width ?? 0)).toBeLessThanOrEqual(BREITE);
    return;
  }
  const breite = await seite.evaluate(() => document.documentElement.scrollWidth);
  expect(breite).toBeLessThanOrEqual(BREITE);
}

/** Öffnet das ⓘ in einem Bereich (Knopf „Erklärung: …“) und fotografiert ihn. */
async function mitBlase(bereich: Locator, datei: string, thema?: RegExp): Promise<void> {
  await bereich
    .getByRole("button", { name: thema ?? /^Erklärung:/ })
    .first()
    .click();
  await expect(bereich.getByTestId("infoblase").first()).toBeVisible();
  await bereich.screenshot({ path: `test-results/bilder/${datei}.png` });
}

/** Startet mit Farbschema und Handybreite. */
async function starte(seite: Page, schema: "hell" | "dunkel"): Promise<void> {
  await seite.setViewportSize({ width: BREITE, height: HOEHE });
  await seite.addInitScript((wert) => window.localStorage.setItem("svga.farbschema", wert), schema);
  await starteImBrowser(seite);
}

for (const schema of ["dunkel", "hell"] as const) {
  test(`P1, P2: Leerzustände und Wertungsregeln (${schema})`, async ({ page }) => {
    await starte(page, schema);
    await oeffneProfil(page);
    const wertung = page.getByTestId("wertung");
    await expect(wertung.getByTestId("wertung-einladung")).toContainText("Noch keine Wertung.");
    await expect(
      wertung.getByRole("img", { name: /Blitz, Schnellschach und Klassisch/ }),
    ).toBeVisible();
    await wertung.screenshot({ path: `test-results/bilder/p01-wertung-${schema}.png` });
    await mitBlase(wertung, `p02-wertung-info-${schema}`);
    await expect(wertung).toContainText("mindestens zehn Züge");
    const themen = page.getByTestId("themenkarte");
    await expect(themen.getByRole("button", { name: "Taktik üben" })).toBeVisible();
    await themen.screenshot({ path: `test-results/bilder/p01-themen-${schema}.png` });
    const partien = page.locator(".partienliste");
    await expect(partien.getByTestId("partien-leer")).toBeVisible();
    await partien.screenshot({ path: `test-results/bilder/p01-partien-${schema}.png` });
    await ohneUeberstand(page);
    await page
      .getByRole("navigation", { name: "Hauptbereiche" })
      .getByRole("button", { name: "Training" })
      .click();
    const stapel = page.getByTestId("faellig");
    await expect(stapel.getByTestId("stapel-leer")).toBeVisible();
    await mitBlase(stapel, `p01-stapel-${schema}`);
    await oeffneSpielen(page);
    await oeffneSpielseite(page, "eigene");
    const eigene = page.getByTestId("eigene-gegner");
    await expect(eigene.getByTestId("eigene-leer")).toContainText("Noch kein eigener Gegner.");
    // Ohne Porträts darüber keine Trennlinie und kein Leerraum über „verwalten“ (1.11.2026).
    await expect(eigene).toHaveCSS("border-top-width", "0px");
    await eigene.screenshot({ path: `test-results/bilder/p01-eigene-${schema}.png` });
    await ohneUeberstand(page);
  });

  test(`P4, P5: Kapitelringe und Lernpfad-Kopf (${schema})`, async ({ page }) => {
    await starte(page, schema);
    await page.getByTestId("lernpfad-knopf-buch").click();
    const kopf = page.locator(".lernpfadkopf");
    await expect(kopf.getByRole("progressbar")).toBeVisible();
    await kopf.screenshot({ path: `test-results/bilder/p05-lernpfad-${schema}.png` });
    await mitBlase(kopf, `p05-lernpfad-info-${schema}`);
    await ohneUeberstand(page, kopf);
    await page.getByTestId("lernpfad-station-1").click();
    const fortschritt = page.getByTestId("kapitelfortschritt");
    await expect(fortschritt.getByTestId("fortschritt-uebungen")).toHaveText(/^0\/\d+$/);
    await fortschritt.screenshot({ path: `test-results/bilder/p04-kapitel-${schema}.png` });
    await mitBlase(fortschritt, `p04-kapitel-info-${schema}`);
    await expect(fortschritt.getByRole("button", { name: "Zur Gesamt-Checkliste" })).toBeVisible();
    await ohneUeberstand(page);
    await fortschritt.getByRole("button", { name: /Zu „Übungen aus dem Buch“ springen/ }).click();
    await expect(page.getByTestId("kapitel-uebungen")).toBeInViewport();
  });

  test(`P6, P15: Denkroutine, Werkzeuge, Maia, Beta, Extras (${schema})`, async ({ page }) => {
    await starte(page, schema);
    const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
    await leiste.getByRole("button", { name: "Nachschlagen" }).click();
    await page.getByRole("button", { name: /^Denkroutine/ }).click();
    await page.getByRole("button", { name: /Stellung erfassen/ }).click();
    await expect(page.getByText("Was hat der letzte Zug des Gegners verändert")).toBeVisible();
    await ohneUeberstand(page);
    await page.screenshot({
      path: `test-results/bilder/p06-denkroutine-${schema}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: /Mittelspiel/ }).click();
    await expect(page.getByRole("button", { name: /Mittelspiel/ })).toContainText("Du bist hier");
    await leiste.getByRole("button", { name: "Nachschlagen" }).click();
    await page
      .getByRole("button", { name: /^Werkzeuge/ })
      .first()
      .click();
    const werkzeuge = page.locator(".mitinfoblase").first();
    await mitBlase(werkzeuge, `p15-werkzeuge-${schema}`);
    await oeffneEinstellungsseite(page, "Bots und Wertung");
    const maia = page.getByTestId("maia-wahl");
    await expect(maia.getByRole("button", { name: "Maia laden (etwa 96 MB)" })).toContainText(
      "96 MB",
    );
    await mitBlase(maia, `p15-maia-${schema}`);
    await ohneUeberstand(page);
    await oeffneEinstellungsseite(page, "Über die App");
    const ueber = page.locator(".einstellung-mit-blase");
    await mitBlase(ueber, `p15-beta-${schema}`, /^Erklärung: Beta$/);
    await oeffneProfil(page);
    const extras = page.getByTestId("extras");
    await mitBlase(extras, `p15-extras-${schema}`);
    await ohneUeberstand(page);
  });

  test(`P3, P13: Partiekopf und Rückblickkarte (${schema})`, async ({ page }) => {
    await starte(page, schema);
    await oeffneSpielen(page);
    await ungewertet(page);
    await spieleVorschlag(page);
    const kopf = page.getByTestId("partie-gegnerzeile");
    await expect(kopf.getByRole("img", { name: /^du spielst / })).toBeVisible();
    await kopf.getByTestId("partiekopf-portraet").click();
    await expect(kopf.getByTestId("partiekopf-sprechblase")).toBeVisible();
    await kopf.screenshot({ path: `test-results/bilder/p03-partiekopf-${schema}.png` });
    await ohneUeberstand(page);
    await page.getByRole("button", { name: /^e2, Bauer/ }).click();
    await page.getByRole("button", { name: "e4", exact: true }).click();
    await expect(page.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
      timeout: ENGINE_FRIST,
    });
    await page.getByRole("button", { name: "Aufgeben" }).click();
    await page.getByRole("button", { name: "Ja, aufgeben" }).click();
    await expect(page.getByTestId("spielstaerke")).toBeVisible({ timeout: ENGINE_FRIST });
    await page
      .getByTestId("partiezuege")
      .getByRole("button", { name: /^1\. e4/ })
      .click();
    const karte = page.getByTestId("rueckblickkarte");
    await expect(karte.getByTestId("bewertungsaenderung")).toHaveText(/^(▲|▼|±) /);
    await mitBlase(karte, `p13-rueckblick-${schema}`, /^Erklärung: Bewertungsbalken/);
    await expect(karte).toContainText("Bewertung ");
    const momente = page.getByTestId("momente");
    await mitBlase(momente, `p13-momente-${schema}`);
    await ohneUeberstand(page);
  });
}
