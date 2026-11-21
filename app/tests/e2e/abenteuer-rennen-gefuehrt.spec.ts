/**
 * Rennen in geführten Wegen (Nachtrag des Haupt-Chats, 21.11.2026; oberwelt/gefuehrterweg.ts,
 * `#gehe:wer>ziel>rennt`): Tessa, die Joggerin an der Landstraße, rennt zu Beginn ihres Gesprächs
 * von weiter rechts heran (`#stelle:tessa>62,13` und `#gehe:tessa>54,13>rennt`) und am Ende weiter
 * nach links. Solange sie rennt, wartet der Dialog („Weiter“ gesperrt); gibt es keinen Weg, liefe
 * der Dialog sofort weiter, und der Test schlüge fehl.
 */
import { expect, test } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** Rechts neben Tessa (54,13) an der Landstraße, Blick zu ihr. */
const STAND = {
  ...GRUNDSTAND,
  position: { karte: "wegMapleCedar.landstrasse", x: 55, y: 13, richtung: "links" },
  dialogvariablen: { ...EINLEITUNG_GESEHEN, hinweisSteuerkreuz: true, hinweisAktion: true },
};

test("Tessa rennt heran und wieder weg; der Dialog wartet, bis sie da ist", async ({ page }) => {
  await starteMitStand(page, STAND);
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 30000 });
  await aktion.click();
  const dialog = page.getByTestId("abenteuer-dialog");
  await expect(dialog).toContainText("läuft vorbei", { timeout: 15000 });
  const weiter = page.locator(".abenteuer-dialog-weiter");
  // Sie rennt noch: „Weiter“ wartet, danach geht es weiter.
  await expect(weiter).toBeDisabled();
  await expect(weiter).toBeEnabled({ timeout: 10000 });
  await weiter.click();
  await expect(dialog).toContainText("Strecke", { timeout: 5000 });
  await weiter.click();
  await expect(dialog).toContainText("weg ist sie", { timeout: 5000 });
  await expect(weiter).toBeDisabled();
  await expect(weiter).toBeEnabled({ timeout: 10000 });
});
