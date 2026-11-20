/**
 * Geführte Wege (Wunsch des Autors, 20.11.2026; oberwelt/gefuehrterweg.ts): Die erste Nacht im
 * Zimmer beginnt im Bett (`#stelle:held>13,8>liegt`); an der Zeile „Du schlägst die Decke zurück …“
 * geht der Held von selbst zu Ambrose ans Fenster (`#gehe:held>ambrose`). Solange er geht, wartet
 * der Dialog („Weiter“ gesperrt); danach steht er neben Ambrose. Neuladen mitten im Weg: Der Held
 * steht danach am Ziel, weil die Szene als Position schon das Ziel sichert.
 */
import { expect, test, type Page } from "@playwright/test";
import {
  EINLEITUNG_GESEHEN,
  GRUNDSTAND,
  liesSpeicherImBrowser,
  starteMitStand,
} from "./abenteuer-affe";
import { kachel } from "./abenteuer-wegsperren";

/** Ambrose steht im Zimmer (Kartenfassung mit Brett) auf 11,3; neben ihm endet der Weg. */
const NEBEN_AMBROSE = ["11,4", "10,3", "12,3", "11,2"];
/** Das Bett: Hier liegt der Held zu Beginn der Nacht. */
const BETT = "13,8";
/** Höchstens so viele Zeilen bis zur Zeile mit dem Weg. */
const HOECHSTENS_ZEILEN = 20;

/** Am Abend vor dem Schreibtisch im Zimmer, die erste Lektion und der erste Abend sind vorbei. */
const STAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.zimmer", x: 13, y: 4, richtung: "oben" },
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    ambroseErwachtGesehen: true,
    ausgangMapleFallsErsteLektion: "sieg",
    ersteLektionBesprochen: true,
    ersterAbendGesehen: true,
    hinweisSteuerkreuz: true,
    hinweisAktion: true,
    hinweisTagebuch: true,
    hinweisMenue: true,
    muenzenErklaert: true,
  },
};

/** Öffnet die Nacht am Brett auf dem Schreibtisch und blättert bis zur Zeile mit dem Weg. */
async function bisZumWeg(seite: Page): Promise<void> {
  await starteMitStand(seite, STAND);
  const aktion = seite.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 30000 });
  await aktion.click();
  const dialog = seite.getByTestId("abenteuer-dialog");
  await expect(dialog).toContainText("Nacht.", { timeout: 15000 });
  await expect.poll(() => kachel(seite)).toBe(BETT);
  for (let i = 0; i < HOECHSTENS_ZEILEN; i++) {
    if ((await dialog.textContent())?.includes("Decke zurück")) return;
    const wahl = seite.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else await seite.locator(".abenteuer-dialog-weiter").click();
  }
  throw new Error("Die Zeile mit dem Weg kam nicht");
}

test("Erste Nacht: aus dem Bett von selbst zu Ambrose ans Fenster, der Dialog wartet", async ({
  page,
}) => {
  await bisZumWeg(page);
  const weiter = page.locator(".abenteuer-dialog-weiter");
  // Gleich nach der Zeile geht der Held noch: „Weiter“ wartet.
  await expect(weiter).toBeDisabled();
  await expect.poll(() => kachel(page), { timeout: 15000 }).toMatch(/^(11,4|10,3|12,3|11,2)$/);
  expect(NEBEN_AMBROSE).toContain(await kachel(page));
  await expect(weiter).toBeEnabled();
});

test("Neuladen mitten im Weg: Der Held steht danach am Ziel, nicht im Bett", async ({ page }) => {
  await bisZumWeg(page);
  await page.reload();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  const speicher = await page.evaluate(liesSpeicherImBrowser);
  const position = (speicher.abenteuer?.position ?? {}) as { x?: number; y?: number };
  expect(NEBEN_AMBROSE).toContain(`${position.x},${position.y}`);
});
