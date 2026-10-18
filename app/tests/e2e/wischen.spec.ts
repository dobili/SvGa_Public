/**
 * Oberflächentests für das Ziehen per Wischen (seit 0.2.92): Figur mit der Maus von e2 nach e4
 * ziehen, das Scrollen bleibt auf Feldern ohne ziehbare Figur frei, und in den Einstellungen
 * abgeschaltet zieht nur noch das Antippen.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

/** Schritte der Mausbewegung, damit die Schwelle zum Wischen sicher überschritten wird. */
const SCHRITTE = 8;

/** Mitte eines Feldknopfes auf dem Bildschirm. */
async function mitte(seite: Page, name: RegExp | string): Promise<{ x: number; y: number }> {
  const knopf = seite.getByRole("button", { name, exact: typeof name === "string" });
  const rahmen = await knopf.boundingBox();
  if (!rahmen) throw new Error(`Feld nicht sichtbar: ${String(name)}`);
  return { x: rahmen.x + rahmen.width / 2, y: rahmen.y + rahmen.height / 2 };
}

/** Zieht eine Figur mit gedrückter Maustaste von einem Feld zum anderen. */
async function wische(seite: Page, von: RegExp, nach: string): Promise<void> {
  const start = await mitte(seite, von);
  const ziel = await mitte(seite, nach);
  await seite.mouse.move(start.x, start.y);
  await seite.mouse.down();
  await seite.mouse.move(ziel.x, ziel.y, { steps: SCHRITTE });
  await seite.mouse.up();
}

async function beginnePartie(seite: Page): Promise<void> {
  await seite.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  await seite.getByRole("button", { name: "Partie beginnen" }).click();
  await expect(seite.getByRole("heading", { name: "Partie gegen die Engine" })).toBeVisible();
}

test("Ziehen per Wischen: e2 nach e4, Scrollen auf leeren Feldern bleibt frei", async ({
  page,
}) => {
  await starteImBrowser(page);
  await beginnePartie(page);
  // Nur Felder mit ziehbarer Figur nehmen den Finger; leere Felder lassen die Seite scrollen.
  const e2 = page.getByRole("button", { name: /^e2, Bauer/ });
  const e4 = page.getByRole("button", { name: "e4", exact: true });
  await expect(e2).toHaveCSS("touch-action", "none");
  await expect(e4).not.toHaveCSS("touch-action", "none");
  await wische(page, /^e2, Bauer/, "e4");
  await expect(page.getByTestId("partiezuege")).toContainText("1. e4");
});

test("Ziehen per Wischen mit dem Finger (Touch, nur Chromium): d2 nach d4", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Touch-Ereignisse über CDP gibt es nur in Chromium");
  await starteImBrowser(page);
  await beginnePartie(page);
  const start = await mitte(page, /^d2, Bauer/);
  const ziel = await mitte(page, "d4");
  const cdp = await page.context().newCDPSession(page);
  const finger = (x: number, y: number) => [{ x, y, id: 1 }];
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: finger(start.x, start.y),
  });
  for (let schritt = 1; schritt <= SCHRITTE; schritt += 1) {
    const anteil = schritt / SCHRITTE;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: finger(
        start.x + (ziel.x - start.x) * anteil,
        start.y + (ziel.y - start.y) * anteil,
      ),
    });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.getByTestId("partiezuege")).toContainText("1. d4");
});

test("Ziehen per Wischen abgeschaltet: Wischen zieht nicht, Antippen schon", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
  const schalter = page.getByRole("radiogroup", { name: "Figuren per Wischen ziehen" });
  await expect(schalter.getByRole("radio", { name: "an" })).toHaveAttribute("aria-checked", "true");
  await schalter.getByRole("radio", { name: "aus" }).click();
  await beginnePartie(page);
  await expect(page.getByRole("button", { name: /^e2, Bauer/ })).not.toHaveCSS(
    "touch-action",
    "none",
  );
  await wische(page, /^e2, Bauer/, "e4");
  await expect(page.getByTestId("partiezuege")).toHaveText("Noch keine Züge.");
  await page.getByRole("button", { name: /^e2, Bauer/ }).click();
  await page.getByRole("button", { name: "e4", exact: true }).click();
  await expect(page.getByTestId("partiezuege")).toContainText("1. e4");
});
