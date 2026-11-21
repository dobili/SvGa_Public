/**
 * Steuerkreuz beim Wischen (Wunsch des Autors, 20.11.2026, steuerrichtung.ts): Mit gehaltenem Finger
 * über die Lücke zwischen zwei Pfeilen wischen. Bisher zählte in der Lücke keine Richtung, und der
 * Held blieb stehen; jetzt zählt die nächste Taste, zu jedem Zeitpunkt genau eine, und der Held läuft
 * ohne Halt weiter.
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** Im Park von Maple Falls auf freier Wiese, Platz nach rechts und unten. */
const STAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.park", x: 20, y: 18, richtung: "rechts" },
  dialogvariablen: { ...EINLEITUNG_GESEHEN, hinweisSteuerkreuz: true, hinweisAktion: true },
};
/** So viele Zwischenschritte beim Wischen; an jedem wird geprüft. */
const SCHRITTE = 12;
const WARTE_MS = 60;

async function kachel(seite: Page): Promise<string> {
  return (await seite.getByTestId("abenteuer-kachel").textContent()) ?? "";
}

test("Steuerkreuz: über die Lücke wischen, der Held läuft ohne Halt weiter (20.11.2026)", async ({
  page,
}) => {
  await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
  await starteMitStand(page, STAND);
  const kreuz = page.locator(".abenteuer-steuerkreuz");
  const lage = async (richtung: string) => {
    const box = await kreuz.locator(`[data-richtung="${richtung}"]`).boundingBox();
    if (!box) throw new Error("Taste ohne Lage");
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  };
  const rechts = await lage("rechts");
  const unten = await lage("unten");
  const start = await kachel(page);
  await page.mouse.move(rechts.x, rechts.y);
  await page.mouse.down();
  await page.waitForTimeout(300);
  // Von ▶ über die leere Ecke unten rechts zu ▼: Die Gerade führt durch die Lücke zwischen den Tasten.
  for (let i = 1; i <= SCHRITTE; i++) {
    const t = i / SCHRITTE;
    await page.mouse.move(rechts.x + (unten.x - rechts.x) * t, rechts.y + (unten.y - rechts.y) * t);
    await page.waitForTimeout(WARTE_MS);
    await expect(kreuz.locator('[data-gedrueckt="ja"]')).toHaveCount(1);
  }
  await expect(kreuz.locator('[data-richtung="unten"]')).toHaveAttribute("data-gedrueckt", "ja");
  await page.waitForTimeout(300);
  await page.mouse.up();
  await expect(kreuz.locator('[data-gedrueckt="ja"]')).toHaveCount(0);
  // Der Held hat sich bewegt (nach rechts und nach unten), ohne dass der Finger losgelassen hat.
  await expect.poll(() => kachel(page), { timeout: 3000 }).not.toBe(start);
});

for (const format of [
  { name: "hoch", viewport: { width: 390, height: 844 } },
  { name: "quer", viewport: { width: 844, height: 390 } },
]) {
  test.describe(`Symbolknöpfe ${format.name}`, () => {
    test.use({ viewport: format.viewport });
    test("Tagebuch und Menü klein unter dem Steuerkreuz, mit Namen (20.11.2026)", async ({
      page,
    }) => {
      await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
      await starteMitStand(page, STAND);
      const kreuz = await page.locator(".abenteuer-steuerkreuz").boundingBox();
      const tagebuch = page.getByRole("button", { name: "Tagebuch" });
      const menue = page.getByTestId("abenteuer-menueknopf");
      for (const knopf of [tagebuch, menue]) {
        const box = await knopf.boundingBox();
        if (!box || !kreuz) throw new Error("Knopf ohne Lage");
        // Tippgröße mindestens 40 px, unter dem Kreuz, auf seiner Seite.
        expect(box.width).toBeGreaterThanOrEqual(40);
        expect(box.height).toBeGreaterThanOrEqual(40);
        expect(box.y).toBeGreaterThanOrEqual(kreuz.y + kreuz.height);
        const mitteKreuz = kreuz.x + kreuz.width / 2;
        const mitteSeite = format.viewport.width / 2;
        expect(box.x + box.width / 2 < mitteSeite).toBe(mitteKreuz < mitteSeite);
      }
      // Nur das Zeichen ist zu sehen; der Name steht nicht sichtbar daneben.
      await expect(page.getByText("Tagebuch", { exact: true })).toBeHidden();
      await tagebuch.click();
      await expect(page.getByTestId("abenteuer-tagebuch")).toBeVisible();
    });
  });
}
