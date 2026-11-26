/**
 * Wischen auf dem Joystick (Wunsch des Autors, 20.11.2026, damals Steuerkreuz, steuerrichtung.ts):
 * Mit gehaltenem Finger von „rechts“ nach „unten“ wischen. Zu jedem Zeitpunkt zählt genau ein Blick
 * (vorherrschende Hauptrichtung, data-gedrueckt an den Marken des Joysticks), und der Held läuft
 * ohne Halt weiter, dazwischen schräg (26.11.2026).
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

test("Joystick: von rechts nach unten wischen, der Held läuft ohne Halt weiter (20.11.2026)", async ({
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
    test("Tagebuch und Menü klein unten links, gegenüber dem Joystick (26.11.2026)", async ({
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
        // Tippgröße mindestens 40 px, unten links (Wunsch des Autors, 26.11.2026); hoch liegt der
        // Joystick rechts, quer links über der Reihe.
        expect(box.width).toBeGreaterThanOrEqual(40);
        expect(box.height).toBeGreaterThanOrEqual(40);
        expect(box.x + box.width / 2).toBeLessThan(format.viewport.width / 2);
        expect(box.y).toBeGreaterThan(format.viewport.height / 2);
        const ueberlappt =
          box.x < kreuz.x + kreuz.width &&
          kreuz.x < box.x + box.width &&
          box.y < kreuz.y + kreuz.height &&
          kreuz.y < box.y + box.height;
        expect(ueberlappt).toBe(false);
      }
      // Nur das Zeichen ist zu sehen; der Name steht nicht sichtbar daneben.
      await expect(page.getByText("Tagebuch", { exact: true })).toBeHidden();
      await tagebuch.click();
      await expect(page.getByTestId("abenteuer-tagebuch")).toBeVisible();
    });
  });
}
