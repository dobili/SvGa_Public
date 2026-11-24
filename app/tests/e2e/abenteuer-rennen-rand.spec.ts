/**
 * Rennen in jede Richtung, auch zum nahen Bildschirmrand (Befund des Autors, 24.11.2026: im
 * Hochformat nach rechts nicht auslösbar; rennschwelle.ts).
 *
 * Warum ein eigener Test: abenteuer-rennen.spec.ts zieht die Maus weit über den Bildschirmrand
 * hinaus, was ein Finger nicht kann. Hier zieht der Finger von der Pfeiltaste nach außen, aber
 * höchstens bis RESERVE_PX vor den Rand des Bildes, bei üblichen Handygrößen hoch und quer.
 * Gemessen werden außerdem die Abstände von der Mitte des Kreuzes zu den Rändern (Ausgabe).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** So nah an den Rand kommt ein Finger noch bequem (Pixel). */
const RESERVE_PX = 24;
/** So weit will der Finger über die Taste hinaus (wird am Rand gekürzt). */
const WUNSCH_PX = 60;
const VARIABLEN = { ...EINLEITUNG_GESEHEN, hinweisSteuerkreuz: true, hinweisAktion: true };
const DRAUSSEN = { karte: "mapleFalls.aussen", x: 29, y: 25, richtung: "rechts" };
const RICHTUNGEN = [
  ["rechts", 1, 0],
  ["links", -1, 0],
  ["unten", 0, 1],
  ["oben", 0, -1],
] as const;
const HOCH = [
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
];

/** Zieht von der Taste nach außen (am Rand gekürzt) und meldet, ob das Kreuz „rennen“ zeigt. */
async function renntNach(seite: Page, name: string, rx: number, ry: number): Promise<boolean> {
  const kreuz = seite.locator(".abenteuer-steuerkreuz");
  const box = await kreuz.locator(`[data-richtung="${name}"]`).boundingBox();
  const bild = seite.viewportSize();
  if (!box || !bild) throw new Error("Taste oder Bild ohne Lage");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const zielX = Math.min(Math.max(x + rx * WUNSCH_PX, RESERVE_PX), bild.width - RESERVE_PX);
  const zielY = Math.min(Math.max(y + ry * WUNSCH_PX, RESERVE_PX), bild.height - RESERVE_PX);
  await seite.mouse.move(x, y);
  await seite.mouse.down();
  await seite.mouse.move(zielX, zielY, { steps: 4 });
  const rennt = (await kreuz.getAttribute("data-gangart")) === "rennen";
  await seite.mouse.up();
  await expect(kreuz).toHaveAttribute("data-gangart", "gehen");
  return rennt;
}

/** Abstände der Kreuzmitte zu den vier Rändern (für die Ausgabe). */
async function randabstaende(seite: Page): Promise<string> {
  const box = await seite.locator(".abenteuer-steuerkreuz").boundingBox();
  const bild = seite.viewportSize();
  if (!box || !bild) return "?";
  const mx = box.x + box.width / 2;
  const my = box.y + box.height / 2;
  return `rechts ${Math.round(bild.width - mx)}, links ${Math.round(mx)}, unten ${Math.round(bild.height - my)}, oben ${Math.round(my)}`;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
});

for (const hoch of HOCH) {
  for (const [format, groesse] of [
    ["hoch", hoch],
    ["quer", { width: hoch.height, height: hoch.width }],
  ] as const) {
    test(`Rennen in alle vier Richtungen, ${format} ${groesse.width}×${groesse.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(groesse);
      await starteMitStand(page, { ...GRUNDSTAND, position: DRAUSSEN, dialogvariablen: VARIABLEN });
      test.info().annotations.push({
        type: "Abstände der Kreuzmitte",
        description: await randabstaende(page),
      });
      const ergebnis: Record<string, boolean> = {};
      for (const [name, rx, ry] of RICHTUNGEN) ergebnis[name] = await renntNach(page, name, rx, ry);
      expect(ergebnis).toEqual({ rechts: true, links: true, unten: true, oben: true });
    });
  }
}
