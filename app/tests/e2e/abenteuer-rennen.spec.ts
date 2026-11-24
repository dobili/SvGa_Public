/**
 * Rennen draußen (Wunsch des Autors, 21.11.2026, gangart.ts): Zieht man den Finger auf dem
 * Steuerkreuz weit über den Rand nach außen, rennt der Held auf Außenkarten schneller; innen geht
 * er gleich schnell weiter. Gemessen wird die Zahl der Kacheln in derselben Zeit.
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** So lange hält der Finger die Richtung. */
const DAUER_MS = 1200;
/** So weit zieht der Finger über die Taste ▶ hinaus nach rechts (Pixel). */
const WEIT_DRAUSSEN_PX = 110;
// Die einmaligen Erklärungen (erklaerungen.ts) gelten als gesehen: GRUNDSTAND hat 80 Münzen, und
// die Münz-Erklärung hielt den Helden auf langsamen Geräten (WebKit) mitten in der Messung an.
const VARIABLEN = {
  ...EINLEITUNG_GESEHEN,
  hinweisSteuerkreuz: true,
  hinweisAktion: true,
  muenzenErklaert: true,
  staerkeErklaert: true,
};
/** Lange freie Reihen: draußen vor dem Haus, innen im Clubraum. */
const DRAUSSEN = { karte: "mapleFalls.aussen", x: 29, y: 25, richtung: "rechts" };
const INNEN = { karte: "mapleFalls.clubraum", x: 3, y: 13, richtung: "rechts" };

async function kachelX(seite: Page): Promise<number> {
  const text = (await seite.getByTestId("abenteuer-kachel").textContent()) ?? "0,0";
  return Number(text.split(",")[0]);
}

/** Startet an der Stelle, hält ▶ (rennend: weit draußen) und gibt die gelaufenen Kacheln zurück. */
async function laufe(seite: Page, position: object, rennen: boolean): Promise<number> {
  await starteMitStand(seite, { ...GRUNDSTAND, position, dialogvariablen: VARIABLEN });
  const kreuz = seite.locator(".abenteuer-steuerkreuz");
  const box = await kreuz.locator('[data-richtung="rechts"]').boundingBox();
  if (!box) throw new Error("Taste ohne Lage");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const start = await kachelX(seite);
  await seite.mouse.move(x, y);
  await seite.mouse.down();
  if (rennen) {
    await seite.mouse.move(x + WEIT_DRAUSSEN_PX, y, { steps: 4 });
    await expect(kreuz).toHaveAttribute("data-gangart", "rennen");
  }
  await seite.waitForTimeout(DAUER_MS);
  await seite.mouse.up();
  await expect(kreuz).toHaveAttribute("data-gangart", "gehen");
  await seite.waitForTimeout(300);
  return (await kachelX(seite)) - start;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
});

// Je Messung eine frische Seite (der Spielstand wird neu eingespielt); verglichen wird zuletzt.
const gemessen: Record<string, number> = {};
test.describe.serial("Rennen draußen, Gehen innen (21.11.2026)", () => {
  for (const [ort, position] of [
    ["draußen", DRAUSSEN],
    ["innen", INNEN],
  ] as const) {
    for (const rennen of [false, true]) {
      test(`${ort}, ${rennen ? "weit nach außen gezogen" : "auf der Taste"}`, async ({ page }) => {
        gemessen[`${ort}-${rennen}`] = await laufe(page, position, rennen);
        expect(gemessen[`${ort}-${rennen}`]).toBeGreaterThan(1);
      });
    }
  }

  test("draußen rennt der Held schneller, innen nicht", () => {
    expect(gemessen["draußen-true"]).toBeGreaterThanOrEqual((gemessen["draußen-false"] ?? 0) + 2);
    const innen = (gemessen["innen-true"] ?? 0) - (gemessen["innen-false"] ?? 0);
    expect(Math.abs(innen)).toBeLessThanOrEqual(1);
  });
});
