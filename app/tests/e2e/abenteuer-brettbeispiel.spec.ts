/**
 * Brettbeispiele im Dialog (Wunsch des Autors, 22.11.2026): Erklärt eine Figur ein Schachkonzept,
 * zeigt sie es an einem kleinen Brett über der Zeile (dialog/Brettbeispiel.tsx, Marke `#brett`).
 * Zwei Beispiele aus Maple Falls: Lily und die Gabel (Buchabbildung 7.2), Mrs. Calloway und der
 * Springer, der immer auf die andere Farbe springt. Geprüft: Das Brett erscheint mit Pfeilen, ganz im
 * Bild, verdeckt weder Text noch Wahlen und verschwindet mit der nächsten Zeile; quer steht es in
 * der freien Fläche neben der Textspalte (iPhone 15 quer).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { foto, GERAETE, imBild, rechteck } from "./abenteuer-quer";

/** Lily nach ihrer Runde: Sie bedankt sich und zeigt die Gabel (maple-falls-aussen.lily_danke). */
const LILY = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.aussen", x: 13, y: 24, richtung: "rechts" },
  dialogvariablen: { ...EINLEITUNG_GESEHEN, lilyGetroffen: true, springerLilyBestanden: true },
};
/** Mrs. Calloway nach Akt 2: Owen erklärt ihr den Springer (maple-falls-aussen.calloway_d). */
const CALLOWAY = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.aussen", x: 4, y: 32, richtung: "oben" },
  dialogvariablen: { ...EINLEITUNG_GESEHEN, callowayGetroffen: true, nadelIronwood: 1 },
};
const VERSUCHE = 12;
/** Das Brett blendet in 0,4 s ein (wie das Großbild); Fotos danach. */
const EINBLENDEN_MS = 600;

/**
 * Figur ansprechen und „Weiter“ tippen, bis die Zeile mit `text` steht; dort muss das Brett kommen
 * (die Beispiele laden beim ersten Mal aus dem Paket, deshalb an der Zeile warten, nicht weitertippen).
 */
async function bisZumBrett(seite: Page, stand: object, text: string): Promise<void> {
  await starteMitStand(seite, stand);
  await seite.getByTestId("abenteuer-aktion").click({ timeout: 15000 });
  const zeile = seite.locator(".abenteuer-dialog-text");
  for (let i = 0; i < VERSUCHE; i++) {
    if ((await zeile.textContent())?.includes(text)) break;
    const weiter = seite.locator(".abenteuer-dialog-weiter");
    if (await weiter.isVisible()) await weiter.click({ timeout: 8000 });
    else await seite.waitForTimeout(250);
  }
  await expect(zeile).toContainText(text);
  await expect(seite.getByTestId("abenteuer-brettbeispiel")).toBeVisible({ timeout: 8000 });
}

/** Liegen Brett und Text nebeneinander oder übereinander, ohne sich zu überdecken? */
async function ueberdecktText(seite: Page): Promise<boolean> {
  const b = await rechteck(seite, "[data-testid='abenteuer-brettbeispiel'] .brett");
  const t = await rechteck(seite, ".abenteuer-dialog-text");
  if (!b || !t) return true;
  return b.links < t.rechts && t.links < b.rechts && b.oben < t.unten && t.oben < b.unten;
}

test("Lily zeigt die Gabel am Brett, die nächste Zeile schließt es", async ({ page }) => {
  test.slow();
  await bisZumBrett(page, LILY, "das ist die Gabel");
  const brett = page.getByTestId("abenteuer-brettbeispiel");
  await expect(brett).toHaveAttribute("data-beispiel", "springergabel.0");
  // Zwei rote Pfeile vom Springer, das Brett ganz im Bild, der Text frei.
  expect(await brett.locator("svg line, svg path, svg polygon").count()).toBeGreaterThan(0);
  expect(await imBild(page, "[data-testid='abenteuer-brettbeispiel'] .brett")).toBe(true);
  expect(await ueberdecktText(page)).toBe(false);
  await page.waitForTimeout(EINBLENDEN_MS);
  await foto(page, "brettbeispiel-lily", "hochkant");
  await page.locator(".abenteuer-dialog-weiter").click();
  await expect(brett).toBeHidden();
});

test("Mrs. Calloway: Springer auf die andere Farbe, Brett und Wahlen im Bild", async ({ page }) => {
  test.slow();
  await bisZumBrett(page, CALLOWAY, "andere Farbe");
  await expect(page.getByTestId("abenteuer-brettbeispiel")).toHaveAttribute(
    "data-beispiel",
    "springerfarbe.0",
  );
  expect(await imBild(page, "[data-testid='abenteuer-brettbeispiel'] .brett")).toBe(true);
  expect(await ueberdecktText(page)).toBe(false);
  const wahl = page.locator(".abenteuer-dialog-wahlen button").first();
  await expect(wahl).toBeVisible({ timeout: 8000 });
  await expect(wahl).toBeInViewport({ ratio: 1 });
  await foto(page, "brettbeispiel-calloway", "hochkant");
});

const QUER = GERAETE[0];
if (QUER) {
  test.describe(`quer: ${QUER.name}`, () => {
    test.use({
      viewport: QUER.viewport,
      deviceScaleFactor: QUER.deviceScaleFactor,
      isMobile: QUER.isMobile,
      hasTouch: QUER.hasTouch,
      userAgent: QUER.userAgent,
    });

    test("das Brett steht groß neben der Textspalte, ganz im Bild", async ({ page }) => {
      test.slow();
      await bisZumBrett(page, LILY, "das ist die Gabel");
      const brett = await rechteck(page, "[data-testid='abenteuer-brettbeispiel'] .brett");
      const spalte = await rechteck(page, ".abenteuer-dialog");
      expect(await imBild(page, "[data-testid='abenteuer-brettbeispiel'] .brett")).toBe(true);
      expect(brett?.rechts ?? 0).toBeLessThanOrEqual(spalte?.links ?? 0);
      expect(brett?.breite ?? 0).toBeGreaterThan(QUER.viewport.height * 0.5);
      // Menü und Tagebuch liegen nicht auf dem Brett.
      for (const knopf of [
        ".bildschirm-abenteuer > .abenteuer-menueknopf",
        "[data-testid='abenteuer-tagebuchknopf']",
      ]) {
        const k = await rechteck(page, knopf);
        if (k && k.breite > 0 && brett)
          expect(k.unten <= brett.oben || k.rechts <= brett.links || k.links >= brett.rechts).toBe(
            true,
          );
      }
      await page.waitForTimeout(EINBLENDEN_MS);
      await foto(page, "brettbeispiel-lily", QUER.name);
    });
  });
}
