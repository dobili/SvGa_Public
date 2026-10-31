/**
 * Oberflächentests zum Trainer-Feinschliff des Nebenchats (30.10.2026): Werkzeugreiter brechen
 * schmal um (Sicherheitsblick), Feld finden zeigt die Sicht deutlich, Röntgen begründet Pfeile.
 */
import { expect, test } from "@playwright/test";
import {
  oeffneAbbildung,
  oeffneTrainer,
  starteImBrowser,
  waehleWerkzeug,
  starteUebung,
  starteRunde,
} from "./hilfen";

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
  await starteUebung(page, "Feld finden");
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

test("Wiederholung: falsch gezählte Aufgabe kommt im Zähltrainer wieder", async ({ page }) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneTrainer(page, "zaehlen");
  await starteRunde(page);
  // Ein Tipp auf „+9“ ist fast immer falsch; dann legt die App eine Karte an.
  await page.getByTestId("zaehl-ergebnisse").getByRole("button", { name: "+9" }).click();
  await expect(page.getByTestId("zaehl-rechnung")).toBeVisible();
  const falsch = await page.getByText("Nicht ganz").count();
  test.skip(falsch === 0, "Zufällig war +9 richtig; dann gibt es keine Karte.");
  await page.clock.fastForward("48:00:00");
  const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
  await leiste.getByRole("button", { name: "Buch" }).click();
  await leiste.getByRole("button", { name: "Training" }).click();
  await page
    .getByTestId("faellig")
    .getByRole("button", { name: /Zähltrainer: 1 fällig/ })
    .click();
  await page.getByTestId("trainer-wiederholung").click();
  await expect(page.getByTestId("trainerrunde")).toContainText("Aufgabe 1 von 1");
});

test("Abbildung öffnen: Zahlenleiste statt Handytastatur", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByLabel("Abbildung öffnen").click();
  const leiste = page.getByRole("group", { name: "Ziffern für die Abbildungsnummer" });
  for (const taste of ["5", ".", "2", "8"]) {
    await leiste.getByRole("button", { name: taste, exact: true }).click();
  }
  await expect(page.getByLabel("Abbildung öffnen")).toHaveValue("5.28");
  await page.getByRole("button", { name: "Öffnen", exact: true }).click();
  await expect(page.getByText("Abb. 5.28").first()).toBeVisible();
});
