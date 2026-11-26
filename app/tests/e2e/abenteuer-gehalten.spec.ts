/**
 * Schach-Abenteuer, gehaltene Eingabe über einen Kartenwechsel (Befund aus der Zeitlupen-Arbeit,
 * 26.11.2026; oberwelt/gehalteneeingabe.ts): Wer mit gehaltener Taste oder gehaltenem Joystick über
 * den Rand von Maple Falls in den Park läuft, läuft dort nach der kurzen Eingabepause weiter, ohne
 * loszulassen und neu zu drücken. Playwright wiederholt gehaltene Tasten nicht; der Test zeigt
 * also, dass die neue Szene den Druck von vorher kennt.
 */
import { expect, test, type Page } from "@playwright/test";
import { leererAbenteuerstand } from "../../src/abenteuer/regeln/spielstand";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { raeumeAuf } from "./abenteuer-ausdauer-ablauf";

/** Drei Felder vor dem Übergang „park“ am rechten Rand von Maple Falls. */
const START = { karte: "mapleFalls.aussen", x: 60, y: 26, richtung: "rechts" };
/** So lange darf es bis zum Kartenwechsel dauern. */
const WECHSEL_FRIST_MS = 30_000;
/** So weit muss der Held auf der neuen Karte ohne neuen Druck mindestens kommen (Felder). */
const MINDESTFELDER = 2;
/** Im Park liegt der Eingang am linken Rand: Kachel x unter diesem Wert heißt angekommen. */
const ANKUNFT_X_UNTER = 4;
/** Der Daumen liegt so weit rechts der Mitte des Joysticks (Pixel, kleiner Ausschlag: gehen). */
const DAUMEN_PX = 20;

const STAND = {
  ...leererAbenteuerstand(new Date(0), "Kim", null, false),
  ...GRUNDSTAND,
  position: START,
  // Hinweise und Erklärungen gelten als gesehen: Sie hielten den Helden mitten im Lauf an.
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    brettBeruehrt: true,
    ambroseErwachtGesehen: true,
    ersteLektionBesprochen: true,
    treppeAbendGesehen: true,
    hinweisSteuerkreuz: true,
    hinweisAktion: true,
    hinweisTagebuch: true,
    hinweisMenue: true,
    hinweisRennen: true,
    muenzenErklaert: true,
    staerkeErklaert: true,
  },
};

/** Kachel des Helden als Zahlen (aus der versteckten Kachelanzeige). */
async function kachel(seite: Page): Promise<{ x: number; y: number }> {
  const text = (await seite.getByTestId("abenteuer-kachel").textContent()) ?? "";
  const [x, y] = text.split(",").map(Number);
  return { x: x ?? Number.NaN, y: y ?? Number.NaN };
}

/** Hält die Eingabe bis in den Park und prüft, dass der Held dort weiterläuft. */
async function laeuftWeiter(seite: Page): Promise<void> {
  await expect
    .poll(async () => (await kachel(seite)).x, { timeout: WECHSEL_FRIST_MS })
    .toBeLessThan(ANKUNFT_X_UNTER);
  const ankunft = await kachel(seite);
  await expect
    .poll(async () => (await kachel(seite)).x - ankunft.x, { timeout: 5000 })
    .toBeGreaterThanOrEqual(MINDESTFELDER);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
  await starteMitStand(page, STAND);
  await raeumeAuf(page);
});

test("Taste gehalten: Der Held läuft nach dem Kartenwechsel weiter", async ({ page }) => {
  await page.keyboard.down("ArrowRight");
  await laeuftWeiter(page);
  await page.keyboard.up("ArrowRight");
});

test("Joystick gehalten: Der Held läuft nach dem Kartenwechsel weiter", async ({ page }) => {
  const feld = await page.getByTestId("abenteuer-joystick").boundingBox();
  if (!feld) throw new Error("Joystick nicht sichtbar");
  const mitte = { x: feld.x + feld.width / 2, y: feld.y + feld.height / 2 };
  await page.mouse.move(mitte.x, mitte.y);
  await page.mouse.down();
  await page.mouse.move(mitte.x + DAUMEN_PX, mitte.y);
  await laeuftWeiter(page);
  await page.mouse.up();
});
