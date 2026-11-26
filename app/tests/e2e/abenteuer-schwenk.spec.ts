/**
 * Kameraschwenk bei der Ankunft in Cedar Creek (Wunsch des Autors, 26.11.2026; oberwelt/schwenk.ts):
 * Zu Fuß vom Flussweg kommend läuft die Ankunft auf der Karte von Cedar Creek (Eingang der Karte
 * nach dem Aufbruch, orte.json). „In der Mitte … steht die Bibliothek“ fährt die Kamera nach rechts oben zur
 * Bibliothek, „Auf ihrer Treppe sitzen zwei Kinder“ zu den Zwillingen, Junos Satz zurück zum
 * Helden; der Held bleibt die ganze Zeit auf seinem Feld. Gemessen wird der Kamerastand
 * (`__kameraprotokoll`, kamerafuehrung.ts). Mit SCHWENK_FOTOS=ORDNER legt der Test eine
 * Fotoreihe ab (nur lokal).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

const FOTOS = process.env.SCHWENK_FOTOS ?? "";
/** So lange darf eine Fahrt höchstens dauern (weite Wege gut 8 s, schwenk.ts). */
const FAHRT_HOECHSTENS_MS = 12000;
/** Nach einem Tippen während der Fahrt steht die Zeile so schnell da. */
const SPRUNG_MS = 600;
/** So weit (Kartenpixel) muss die Kamera mindestens gefahren sein. */
const MINDESTWEG = 48;

/** Kurz vor dem Übergang „weiterCedar“ (x 119) auf dem Flussweg, Blick nach rechts. */
const STAND = {
  ...GRUNDSTAND,
  position: { karte: "wegMapleCedar.flussweg", x: 117, y: 16, richtung: "rechts" },
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    schildCedarGesehen: true,
    // Die Ankunft läuft als Eingang von Cedar Creek, nach dem Aufbruch zu Fuß (orte.json).
    aufbruchGesehen: true,
    hinweisSteuerkreuz: true,
    hinweisAktion: true,
  },
};

/** Kamerastand (Bildlauf in Kartenpixeln) aus dem letzten Eintrag des Protokolls. */
async function kamera(s: Page): Promise<{ x: number; y: number }> {
  return s.evaluate(() => {
    const p = (window as unknown as { __kameraprotokoll: { x: number; y: number }[] })
      .__kameraprotokoll;
    const letzter = p.at(-1);
    return letzter ? { x: letzter.x, y: letzter.y } : { x: Number.NaN, y: Number.NaN };
  });
}

async function kachel(s: Page): Promise<string> {
  return (await s.getByTestId("abenteuer-kachel").textContent()) ?? "";
}

/** Wartet, bis die Fahrt am Ziel ist: Dann erscheint die Zeile (data-schwenk fällt weg). */
async function amZiel(s: Page, frist = FAHRT_HOECHSTENS_MS): Promise<void> {
  const text = s.locator(".abenteuer-dialog-text");
  await expect(text).not.toHaveAttribute("data-schwenk", "ja", { timeout: frist });
  await expect(text).toBeVisible();
}

async function foto(s: Page, name: string): Promise<void> {
  const breite = s.viewportSize()?.width ?? 0;
  if (FOTOS) await s.screenshot({ path: `${FOTOS}/${breite}-${name}.png` });
}

/** „Weiter“ im Dialog, bis die Zeile mit `text` steht. */
async function weiterBis(s: Page, text: string): Promise<void> {
  const dialog = s.getByTestId("abenteuer-dialog");
  for (let i = 0; i < 12 && !((await dialog.textContent()) ?? "").includes(text); i++) {
    const wahl = s.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible().catch(() => false)) await wahl.click();
    else await s.locator(".abenteuer-dialog-weiter").click();
    await s.waitForTimeout(250);
  }
  await expect(dialog).toContainText(text);
}

for (const format of [
  { name: "hoch", viewport: { width: 390, height: 844 } },
  { name: "quer", viewport: { width: 844, height: 390 } },
]) {
  test.describe(format.name, () => {
    test.use({ viewport: format.viewport });
    test("Ankunft in Cedar Creek: die Kamera fährt zur Bibliothek, zu den Zwillingen und zurück", async ({
      page,
    }) => {
      test.slow();
      await page.addInitScript(() => {
        (window as unknown as { __kameraprotokoll: unknown[] }).__kameraprotokoll = [];
      });
      await starteMitStand(page, STAND);
      // In den Übergang laufen: Wechsel nach Cedar Creek, dort beginnt die Ankunft.
      await page.keyboard.down("ArrowRight");
      const dialog = page.getByTestId("abenteuer-dialog");
      await expect(dialog).toBeVisible({ timeout: 20000 });
      await page.keyboard.up("ArrowRight");
      // Erst die kurze Zeile am Übergang, dann der Wechsel; die Ankunft läuft als Eingang von Cedar Creek.
      await weiterBis(page, "steht die Bibliothek");
      // Angekommen am Flussweg von Cedar Creek (x 0 bis 1), nicht mehr am Übergang (x 117 bis 119).
      await expect.poll(() => kachel(page), { timeout: 10000 }).toMatch(/^[01],/);
      const feld = await kachel(page);
      const vorher = await kamera(page);
      // Die Zeile wartet, bis die Kamera an der Bibliothek ist.
      await amZiel(page);
      const bibliothek = await kamera(page);
      await foto(page, "1-bibliothek");
      expect(Math.hypot(bibliothek.x - vorher.x, bibliothek.y - vorher.y)).toBeGreaterThan(0);
      await weiterBis(page, "Auf ihrer Treppe sitzen zwei Kinder");
      // Tippen während der Fahrt: Sie springt ans Ziel, die Zeile steht gleich da.
      await expect(page.locator(".abenteuer-dialog-text")).toHaveAttribute("data-schwenk", "ja");
      await page.locator(".abenteuer-dialog-weiter").click();
      await amZiel(page, SPRUNG_MS);
      const zwillinge = await kamera(page);
      await foto(page, "2-zwillinge");
      expect(Math.hypot(zwillinge.x - bibliothek.x, zwillinge.y - bibliothek.y)).toBeGreaterThan(0);
      await weiterBis(page, "Hier flüstert sogar die Straße");
      await amZiel(page);
      const zurueck = await kamera(page);
      await foto(page, "3-zurueck");
      // Der Held hat sich nicht bewegt, die Kamera ist ein Stück gefahren und wieder bei ihm.
      expect(await kachel(page)).toBe(feld);
      const weg = Math.max(
        Math.hypot(bibliothek.x - zurueck.x, bibliothek.y - zurueck.y),
        Math.hypot(zwillinge.x - zurueck.x, zwillinge.y - zurueck.y),
      );
      expect(weg).toBeGreaterThan(MINDESTWEG);
    });
  });
}
