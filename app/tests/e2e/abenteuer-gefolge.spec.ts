/**
 * Begleiter auf Wegen (Befund des Autors, 25.11.2026): Laut Tagebuch geht der Held mit Juno zu Fuß
 * nach Cedar Creek, aber Juno wartete nur im Text am Ortsschild, und am Obststand legte sie einen
 * Dollar in die Dose, ohne da zu sein. Jetzt steht sie am Ortsschild im Park, geht nach dem
 * Gespräch mit (Dialogvariable `begleiter`, regeln/gefolge.ts) und folgt dem Helden über den
 * Kartenwechsel auf die Landstraße.
 * Geprüft über das Attribut `data-gefolge` der Spielfläche („juno@x,y“, oberwelt/gefolgeschicht.ts)
 * und die Kachel des Helden: Juno steht neben ihm (höchstens zwei Felder weit).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { kachel, klickeDurch } from "./abenteuer-wegsperren";

const FRIST_MS = 20000;
/** Juno steht so viele Felder (Schachbrettabstand) vom Helden entfernt: neben oder hinter ihm. */
const NAH = 2;
/** Nach dem Aufbruch, vor Cedar Creek; nach der ersten Nadel (Park mit neuem Steg). */
const UNTERWEGS = {
  ...EINLEITUNG_GESEHEN,
  brettBeruehrt: true,
  ersteLektionBesprochen: true,
  ersterAbendGesehen: true,
  ersteNachtGesehen: true,
  clubBeigetreten: true,
  junoGetroffen: true,
  nadelMapleFalls: 1,
  aufbruchGesehen: true,
};

/** Feld der Begleiterin `name` aus `data-gefolge` („juno@41,14“), sonst null. */
async function feldVon(seite: Page, name: string): Promise<{ x: number; y: number } | null> {
  const wert = (await seite.locator(".abenteuer-welt canvas").getAttribute("data-gefolge")) ?? "";
  const eintrag = wert.split(";").find((e) => e.startsWith(`${name}@`));
  const [x, y] = (eintrag?.slice(name.length + 1).split(",") ?? []).map(Number);
  return eintrag && x !== undefined && y !== undefined ? { x, y } : null;
}

/** Abstand der Begleiterin zum Helden in Feldern (Schachbrettabstand), sonst Unendlich. */
async function abstandZumHelden(seite: Page, name: string): Promise<number> {
  const feld = await feldVon(seite, name);
  const [hx, hy] = (await kachel(seite)).split(",").map(Number);
  if (!feld || hx === undefined || hy === undefined) return Number.POSITIVE_INFINITY;
  return Math.max(Math.abs(feld.x - hx), Math.abs(feld.y - hy));
}

/** Ein Tipp auf das Steuerkreuz; wartet, bis der Held die Kachel gewechselt hat. */
async function schritt(seite: Page, richtung: string): Promise<void> {
  const vorher = await kachel(seite);
  await seite.getByRole("button", { name: richtung }).click();
  await expect.poll(() => kachel(seite), { timeout: 5000 }).not.toBe(vorher);
  await seite.waitForTimeout(200);
}

test("Juno geht vom Ortsschild mit und folgt über den Kartenwechsel auf die Landstraße", async ({
  page,
}) => {
  test.slow();
  await starteMitStand(page, {
    ...GRUNDSTAND,
    position: { karte: "mapleFalls.park", x: 40, y: 14, richtung: "rechts" },
    dialogvariablen: UNTERWEGS,
  });
  await page.getByTestId("abenteuer-aktion").click({ timeout: FRIST_MS });
  expect(await klickeDurch(page)).toContain("Ich hab Kekse dabei");
  // Die Karte stellt sich neu auf: Juno steht nicht mehr am Schild, sie folgt dem Helden.
  await expect
    .poll(() => abstandZumHelden(page, "juno"), { timeout: FRIST_MS })
    .toBeLessThanOrEqual(NAH);
  await schritt(page, "Nach unten");
  for (let i = 0; i < 3 && (await kachel(page)) !== "43,15"; i++)
    await schritt(page, "Nach rechts");
  await klickeDurch(page);
  await expect(page.getByTestId("abenteuer-kachel")).not.toHaveText(/^4\d,1\d$/, {
    timeout: FRIST_MS,
  });
  await expect
    .poll(() => abstandZumHelden(page, "juno"), { timeout: FRIST_MS })
    .toBeLessThanOrEqual(NAH);
  await schritt(page, "Nach rechts");
  await schritt(page, "Nach rechts");
  await expect
    .poll(() => abstandZumHelden(page, "juno"), { timeout: FRIST_MS })
    .toBeLessThanOrEqual(NAH);
});

test("Am Obststand steht Juno neben dem Helden, wenn sie den Dollar in die Dose legt", async ({
  page,
}) => {
  test.slow();
  await starteMitStand(page, {
    ...GRUNDSTAND,
    position: { karte: "wegMapleCedar.landstrasse", x: 47, y: 17, richtung: "unten" },
    dialogvariablen: { ...UNTERWEGS, begleiter: "juno" },
  });
  await expect
    .poll(() => abstandZumHelden(page, "juno"), { timeout: FRIST_MS })
    .toBeLessThanOrEqual(NAH);
  await page.getByTestId("abenteuer-aktion").click({ timeout: FRIST_MS });
  const dialog = page.getByTestId("abenteuer-dialog");
  await expect(dialog).toBeVisible({ timeout: FRIST_MS });
  for (let i = 0; i < 6 && !(await dialog.innerText()).includes("Juno legt einen Dollar"); i++) {
    await page.locator(".abenteuer-dialog-weiter").click();
  }
  await expect(dialog).toContainText("Juno legt einen Dollar");
  expect(await abstandZumHelden(page, "juno")).toBeLessThanOrEqual(NAH);
});
