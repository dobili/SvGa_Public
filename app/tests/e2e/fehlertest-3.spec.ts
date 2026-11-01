/**
 * Oberflächentests zu den Fehlern aus dem dritten großen Fehlertest (f3, 01.11.2026): geteilte
 * Links bei offener App, Startwahl und Touren mit der Leiste unten, Zurück-Taste über der
 * Startwahl, „Los geht's“ aus dem Profil. Jeder Test hält einen behobenen Fehler fest.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneEinstellungen, oeffneProfil, starteImBrowser } from "./hilfen";

/** Breite eines kleinen Handys. */
const HANDY = { width: 360, height: 800 };

/** Der Bereich, den die Leiste unten als aktiv zeigt. */
function aktiverBereich(page: Page) {
  return page.locator(".leiste [aria-current='page']");
}

/** Der gesicherte Navigationsstapel (Merker svga.stapel) als Liste der Bildschirme. */
async function stapel(page: Page): Promise<string[]> {
  const text = await page.evaluate(() => window.localStorage.getItem("svga.stapel"));
  const roh = JSON.parse(text ?? "{}") as { stapel?: { ansichten?: { bildschirm: string }[] } };
  return (roh.stapel?.ansichten ?? []).map((a) => a.bildschirm);
}

test("geteilter Link bei offener App: Die Herausforderung öffnet ohne Neuladen", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  // Nur der Teil hinter „#“ ändert sich: Der Browser lädt nicht neu (zweiter Link im selben Tab).
  await page.evaluate(() => {
    window.location.hash = "#aufgabe-taktik-l-1Vybh";
  });
  const ansicht = page.getByTestId("herausforderung");
  await expect(ansicht.getByText("Jemand hat dir diese Aufgabe geschickt.")).toBeVisible();
  await expect(page).toHaveURL(/\/app\/$/);
  // Wie beim Start aus dem Link: „Zurück“ führt ins Training, wie es der Knopf sagt.
  await ansicht.getByRole("button", { name: "Training" }).click();
  await expect(page.getByRole("heading", { name: "Training", level: 1 })).toBeVisible();
});

test("Startwahl aus den Einstellungen: der Weg „spielen“ wechselt in den Bereich Spielen", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Hilfe" }).click();
  await page.getByRole("button", { name: "Rundgang durch die App" }).click();
  await page.getByRole("button", { name: "Ich will spielen und Partien auswerten" }).click();
  await expect(page.getByTestId("tour")).toBeVisible();
  await expect(aktiverBereich(page)).toHaveAccessibleName("Spielen");
  expect(await stapel(page)).toEqual(["spielen"]);
});

test("Startwahl „Ich lese das Buch“ legt kein zweites Buch auf den Stapel", async ({ page }) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page, { tourAngebot: true });
  await page.getByRole("button", { name: "Ich lese das Buch" }).click();
  await expect(page.getByTestId("tour")).toBeVisible();
  expect(await stapel(page)).toEqual(["buch"]);
});

test("Zurück-Taste bei offener Startwahl schließt sie wie „Später“", async ({ page }) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffneEinstellungen(page);
  await page.getByRole("tab", { name: "Hilfe" }).click();
  await page.getByRole("button", { name: "Rundgang durch die App" }).click();
  await expect(page.getByTestId("tour-angebot")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Profil", level: 1 })).toBeVisible();
  await expect(page.getByTestId("tour-angebot")).toHaveCount(0);
});

test("„Los geht's“ im Profil zu „Erste Partie“: Bereich Spielen, Leiste passend", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffneProfil(page);
  await page.getByTestId("abzeichen-erstePartie").getByRole("button").click();
  await page.getByTestId("infofenster").getByRole("button", { name: "Los geht's" }).click();
  await expect(page.getByRole("heading", { name: "Spielen" })).toBeVisible();
  await expect(aktiverBereich(page)).toHaveAccessibleName("Spielen");
});
