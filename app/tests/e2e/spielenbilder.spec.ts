/**
 * Bildschirmfotos von „Spielen neu“ (Entwurf J3, 31.10.2026) in Handybreite (360 px), dunkel und
 * hell: Startseite mit laufender Partie, Vorschlag, Spielstärke, Kacheln und „Zuletzt gespielt“,
 * das Blatt „Partie einstellen“ mit Eröffnung und jede Unterseite. Eingespielt wird eine Wertung
 * (wie in profilbilder.spec.ts); zwei aufgegebene Partien füllen „Zuletzt gespielt“. Die Bilder
 * landen in test-results/bilder/ für den Bericht an den Autor.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";
import {
  blatt,
  oeffneEroeffnungswahl,
  oeffnePartieEinstellen,
  oeffneSpielen,
  oeffneSpielseite,
  schliessePartieEinstellen,
  spieleVorschlag,
  ungewertet,
  zurueckZuSpielen,
} from "./spielenhilfen";

const TAG = (tag: number) => `2026-10-${tag}T10:00:00.000Z`;
const BREITE = 360;
const HOEHE = 800;

/** Drei gewertete Schnellschach-Partien: Wertung um 640 (Einsteiger, wie im Entwurf). */
const WERTUNG = [
  { partieId: "w1", zeit: TAG(26), tempo: "rapid", wertung: 610, ergebnis: 0 },
  { partieId: "w2", zeit: TAG(28), tempo: "rapid", wertung: 625, ergebnis: 1 },
  { partieId: "w3", zeit: TAG(30), tempo: "rapid", wertung: 640, ergebnis: 1 },
].map((p) => ({ ...p, gegner: 640, phasen: {} }));

/** Schreibt die Wertung in IndexedDB; false, solange die App noch nichts gespeichert hat. */
function schreibeWertung(wertung: typeof WERTUNG): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const alt = lesen.result as { spiel?: Record<string, unknown> } | undefined;
        if (!alt?.spiel) {
          db.close();
          fertig(false);
          return;
        }
        const schreiben = bereich.put({ ...alt, spiel: { ...alt.spiel, wertung } }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/** Eine ungewertete Partie gegen den Vorschlag beginnen und gleich aufgeben. */
async function aufgegeben(seite: Page): Promise<void> {
  await oeffneSpielen(seite);
  await ungewertet(seite);
  await spieleVorschlag(seite);
  await seite.getByRole("button", { name: "Aufgeben" }).click();
  await seite.getByRole("button", { name: "Ja, aufgeben" }).click();
  await expect(seite.getByTestId("partieende")).toBeVisible();
}

/** Ein Foto der ganzen Seite. */
async function foto(seite: Page, name: string, schema: string): Promise<void> {
  await seite.screenshot({
    path: `test-results/bilder/spielen-${name}-${schema}.png`,
    fullPage: true,
  });
}

for (const schema of ["dunkel", "hell"] as const) {
  test(`Spielen neu: Bilder der Startseite, des Blattes und der Unterseiten (${schema})`, async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: BREITE, height: HOEHE });
    await page.addInitScript((s) => window.localStorage.setItem("svga.farbschema", s), schema);
    await starteImBrowser(page);
    await expect.poll(() => page.evaluate(schreibeWertung, WERTUNG)).toBe(true);
    await page.reload();
    await aufgegeben(page);
    await aufgegeben(page);
    // Eine laufende Partie für die Karte „Partie läuft“.
    await oeffneSpielen(page);
    await spieleVorschlag(page);
    await expect(page.getByTestId("partie")).toBeVisible();
    await oeffneSpielen(page);
    await expect(page.getByTestId("laufende-partie")).toBeVisible();
    await expect(page.getByTestId("zuletzt-gespielt").locator("li")).toHaveCount(2);
    await expect(page.getByTestId("vorschlag-grund")).toContainText("so stark wie du");
    await foto(page, "start", schema);
    await oeffnePartieEinstellen(page);
    await foto(page, "einstellen", schema);
    await schliessePartieEinstellen(page);
    await oeffneEroeffnungswahl(page);
    await expect(blatt(page).getByTestId("eroeffnungswahl")).toBeVisible();
    await foto(page, "eroeffnung", schema);
    await schliessePartieEinstellen(page);
    for (const seite of ["gegner", "stufe", "eigene", "frei"]) {
      await oeffneSpielseite(page, seite);
      await expect(page.getByTestId("startleiste")).toBeVisible();
      await foto(page, seite, schema);
      await zurueckZuSpielen(page);
    }
    // Keine Seite ist breiter als das Handy.
    const breite = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(breite).toBeLessThanOrEqual(BREITE);
  });
}
