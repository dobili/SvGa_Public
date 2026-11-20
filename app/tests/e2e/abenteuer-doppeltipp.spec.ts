/**
 * Doppeltipp auf „Weiter“ wählt keine ungelesene Antwort (eiliger Spieler im Durchlauf,
 * 20.11.2026): Der erste Tipp bringt die Wahlen, der zweite fällt in die Schutzzeit
 * (dialog/wahlschutz.ts) und tut nichts. Vorher traf er die Antwort, die an derselben Stelle lag;
 * bei Jo im Park begann so ungelesen „Erst noch eine Partie.“.
 * Szene: Mamas erster Abend im Wohnzimmer; nach „Hab ich irgendwo gelesen …“ folgen Wahlen.
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** Im Wohnzimmer neben Mama, nach der ersten Lektion (wie abenteuer-zielpfeil.spec.ts). */
const STAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.wohnzimmer", x: 15, y: 7, richtung: "rechts" },
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    brettBeruehrt: true,
    ambroseErwachtGesehen: true,
    ersteLektionBesprochen: true,
    treppeAbendGesehen: true,
  },
};

/** So lange nach dem Doppeltipp müssen die Wahlen noch stehen (ms): länger als die Schutzzeit. */
const NACH_DOPPELTIPP_MS = 700;

/** Tippt zweimal schnell auf die Mitte von „Weiter“ (wie ein ungeduldiger Daumen). */
async function doppeltippeWeiter(seite: Page): Promise<boolean> {
  const box = await seite.locator(".abenteuer-dialog-weiter").boundingBox();
  if (!box) return false;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await seite.mouse.click(x, y);
  await seite.mouse.click(x, y);
  return true;
}

test("Doppeltipp auf „Weiter“ wählt keine Antwort, die gerade erst erschienen ist", async ({
  page,
}) => {
  test.slow();
  await starteMitStand(page, STAND);
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 15000 });
  await aktion.click();
  const dialog = page.getByTestId("abenteuer-dialog");
  await expect(dialog).toBeVisible({ timeout: 10000 });
  const wahlen = page.locator(".abenteuer-dialog-wahlen button");
  const weiter = page.locator(".abenteuer-dialog-weiter");
  let geprueft = 0;
  for (let i = 0; i < 40 && geprueft < 2 && (await dialog.isVisible()); i++) {
    if (await wahlen.first().isVisible()) {
      await wahlen.first().click();
      continue;
    }
    // Pause (#pause:2): warten, bis „Weiter“ wieder geht.
    await expect(weiter).toBeEnabled({ timeout: 5000 });
    const vorher = await dialog.locator(".abenteuer-dialog-text").textContent();
    if (!(await doppeltippeWeiter(page))) continue;
    if (!(await wahlen.first().isVisible())) continue;
    // Die Wahlen kamen mit dem ersten Tipp; der zweite darf keine davon genommen haben.
    const frage = await dialog.locator(".abenteuer-dialog-text").textContent();
    expect(frage).not.toBe(vorher);
    await page.waitForTimeout(NACH_DOPPELTIPP_MS);
    await expect(wahlen.first()).toBeVisible();
    await expect(wahlen.first()).toBeEnabled();
    await expect(dialog.locator(".abenteuer-dialog-text")).toHaveText(frage ?? "");
    geprueft += 1;
  }
  expect(geprueft).toBe(2);
});
