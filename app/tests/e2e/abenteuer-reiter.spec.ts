/**
 * Reiter „Abenteuer“ in der Leiste unten (Wunsch des Autors, 27.11.2026): Er öffnet das Spiel im
 * Vollbild über dem offenen Bereich, und die Zurück-Taste wie „Zurück zur App“ im Spielmenü führen
 * dorthin zurück. Dazu die Messung, die die Wahl begründet: Sechs Wörter stehen bei 320 Pixeln
 * nebeneinander, ohne sich zu berühren; unter 300 Pixeln (Browser-Zoom 200 %) nur die Symbole.
 * Ohne geladenes Paket zeigt das Spiel seine Startkarte mit „Spiel herunterladen“, wie bisher über
 * das Adminmenü; das Laden selbst prüfen die übrigen Abenteuerdateien.
 * Abhängigkeiten: hilfen.ts.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

/** Kleinstes unterstütztes Handy. */
const KLEIN = { width: 320, height: 640 };
/** Ein Handy mit 360 Pixeln bei Browser-Zoom 200 %. */
const ZOOM_200 = { width: 180, height: 380 };
/** So viel Abstand muss zwischen zwei Wörtern der Leiste mindestens bleiben (px). */
const MINDESTABSTAND = 6;

const leiste = (seite: Page) => seite.getByRole("navigation", { name: "Hauptbereiche" });
const reiter = (seite: Page, name: string) =>
  leiste(seite).getByRole("button", { name, exact: true });

/** Linke und rechte Kante jedes sichtbaren Wortes der Leiste, von links nach rechts. */
function wortkanten(seite: Page): Promise<{ links: number; rechts: number }[]> {
  return seite.evaluate(() =>
    [...document.querySelectorAll("nav.leiste .leiste-knopf > span")]
      .map((s) => s.getBoundingClientRect())
      .filter((r) => r.width > 0)
      .map((r) => ({ links: r.left, rechts: r.right })),
  );
}

test("sechs Reiter mit Wort passen bei 320 Pixeln, bei Zoom 200 % nur Symbole", async ({
  page,
}) => {
  await page.setViewportSize(KLEIN);
  await starteImBrowser(page);
  const namen = ["Buch", "Training", "Spielen", "Abenteuer", "Nachschlagen", "Profil"];
  for (const name of namen) await expect(reiter(page, name)).toBeVisible();
  const kanten = await wortkanten(page);
  expect(kanten).toHaveLength(namen.length);
  expect(kanten[0]?.links).toBeGreaterThanOrEqual(0);
  expect(kanten.at(-1)?.rechts).toBeLessThanOrEqual(KLEIN.width);
  for (let i = 1; i < kanten.length; i++) {
    const abstand = (kanten[i]?.links ?? 0) - (kanten[i - 1]?.rechts ?? 0);
    expect(abstand, `zwischen ${namen[i - 1]} und ${namen[i]}`).toBeGreaterThanOrEqual(
      MINDESTABSTAND,
    );
  }
  await page.setViewportSize(ZOOM_200);
  expect(await wortkanten(page)).toEqual([]);
  // Die Namen bleiben für Vorlesefunktionen und als Tooltip.
  for (const name of namen) await expect(reiter(page, name)).toBeVisible();
});

test("Reiter öffnet das Abenteuer, Zurück-Taste und „Zurück zur App“ führen zurück", async ({
  page,
}) => {
  await page.setViewportSize(KLEIN);
  await starteImBrowser(page);
  await reiter(page, "Training").click();
  await expect(reiter(page, "Training")).toHaveAttribute("aria-current", "page");
  // Öffnen: Vollbild ohne Leiste, ohne Paket die Startkarte zum Herunterladen.
  await reiter(page, "Abenteuer").click();
  await expect(page.getByTestId("abenteuer")).toBeVisible();
  await expect(page.getByTestId("abenteuer-start")).toBeVisible();
  await expect(leiste(page)).toHaveCount(0);
  // Zurück-Taste (Android) oder Browser-Zurück: wieder im Training.
  await page.goBack();
  await expect(page.getByTestId("abenteuer")).toHaveCount(0);
  await expect(reiter(page, "Training")).toHaveAttribute("aria-current", "page");
  await expect(page).toHaveURL(/\/app\/$/);
  // Noch einmal, jetzt über das Spielmenü.
  await reiter(page, "Abenteuer").click();
  await page.getByTestId("abenteuer-menueknopf").click();
  await page.getByTestId("abenteuer-menue").getByRole("button", { name: "Zurück zur App" }).click();
  await expect(page.getByTestId("abenteuer")).toHaveCount(0);
  await expect(reiter(page, "Training")).toHaveAttribute("aria-current", "page");
});
