/**
 * Oberflächentest der Fassung für die Leser (npm run build:veroeffentlichung) mit dem Schach-Abenteuer:
 * Läuft nur mit LESERFASSUNG=1 gegen genau diesen Bau, sonst übersprungen.
 *
 * Warum (Vorbereitung des Schritts nach main, 20.11.2026): Die Testhilfen des Autors (Testleiste
 * unter der Partie, „Bestehen“ und „Verfehlen“ bei Rätseln, anbindung/Testleiste.tsx) und die
 * Aufgabenseite mit der Karte „Schach-Abenteuer“ dürfen Leser nie sehen. Statisch prüft das
 * skripte/pruefe-veroeffentlichung.mjs; hier im Browser:
 * - drei Sekunden auf „Profil“ und die Adresse #aufgaben öffnen keine Aufgabenseite;
 * - ohne Paket und ohne Spielstand zeigt „Spielen“ keine Karte des Spiels (Einstieg nur #abenteuer);
 * - das Spielpaket lädt über #abenteuer, die Welt startet;
 * - eine Partie mit dem Reisebrett hat keine Testleiste, Aufgeben geht wie gewohnt.
 * Aufruf (im Ordner app/, nach npm run build:veroeffentlichung):
 *   LESERFASSUNG=1 PLAYWRIGHT_NUR_CHROMIUM=1 CHROMIUM_PFAD=… npx playwright test abenteuer-leserfassung
 * Abhängigkeiten: abenteuer-affe.ts, hilfen.ts.
 */
import { expect, test, type Page } from "@playwright/test";
import { beobachte, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { ladeMitSprung, starteImBrowser } from "./hilfen";

test.skip(process.env.LESERFASSUNG !== "1", "nur gegen npm run build:veroeffentlichung");

/** Etwas länger als der lange Druck auf „Profil“ (Leiste.tsx, 3 s). */
const LANGER_DRUCK_MS = 3100;

/** Der Knopf „Profil“ in der Leiste. */
const profilKnopf = (seite: Page) =>
  seite
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Profil", exact: true });

test("Leserfassung: keine Aufgabenseite, keine Spielkarte vor dem Laden", async ({ page }) => {
  await page.clock.install();
  await starteImBrowser(page);
  await profilKnopf(page).hover();
  await page.mouse.down();
  await page.clock.runFor(LANGER_DRUCK_MS);
  await page.mouse.up();
  await page.clock.resume();
  await expect(page.getByTestId("autor-aufgaben")).toHaveCount(0);
  await ladeMitSprung(page, "/app/#aufgaben");
  await expect(page.getByTestId("autor-aufgaben")).toHaveCount(0);
  await expect(page.getByTestId("abenteuer-admin")).toHaveCount(0);
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Spielen", exact: true })
    .click();
  await expect(page.getByTestId("abenteuer-karte")).toHaveCount(0);
});

test("Leserfassung: Spiel über #abenteuer, Partie ohne Testleiste", async ({ page }) => {
  test.slow();
  const funde = beobachte(page);
  await starteMitStand(page, GRUNDSTAND);
  await page.getByTestId("abenteuer-reisebrettknopf").click();
  await page.getByTestId("abenteuer-deck-los").click();
  await expect(page.getByTestId("partie")).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole("region", { name: "Testhilfe des Autors" })).toHaveCount(0);
  await expect(page.locator("[data-testid^='abenteuer-test-']")).toHaveCount(0);
  await page.getByTestId("abenteuer-partie-aufgeben").click();
  await page.getByRole("button", { name: "Ja, aufgeben" }).click();
  await page.getByTestId("partie-zurueck-zur-stadt").click();
  await expect(page.getByTestId("abenteuer-ergebnis")).toBeVisible({ timeout: 30000 });
  expect(funde).toEqual([]);
});
