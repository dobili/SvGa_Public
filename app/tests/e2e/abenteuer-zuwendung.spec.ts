/**
 * Zuwendung (Wunsch des Autors, 22.11.2026; oberwelt/zuwendung.ts): Spricht der Held Mama im
 * Wohnzimmer von links an, dreht sie sich nach links zu ihm. Nach dem Gespräch dreht sie sich mit
 * etwa einer Sekunde Verzug in ihre alte Richtung zurück. Die Szene meldet beides für die Tests
 * am Attribut `data-zuwendung` der Spielfläche.
 */
import { expect, test } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** Links neben Mama (16,7), Blick zu ihr. */
const STAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.wohnzimmer", x: 15, y: 7, richtung: "rechts" },
  dialogvariablen: { ...EINLEITUNG_GESEHEN, hinweisSteuerkreuz: true, hinweisAktion: true },
};
/** Höchstens so viele Klicks bis zum Ende des Gesprächs (Mamas Gespräch ist lang und wächst mit dem Spiel). */
const HOECHSTENS = 120;

test("Mama dreht sich zum Helden und danach zurück", async ({ page }) => {
  await starteMitStand(page, STAND);
  const flaeche = page.locator(".abenteuer-welt canvas");
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 30000 });
  await aktion.click();
  await expect(flaeche).toHaveAttribute("data-zuwendung", "mutter=links");
  const dialog = page.getByTestId("abenteuer-dialog");
  // Erst warten, bis das Gespräch offen ist: Sonst endet die Schleife sofort, und der Dialog geht
  // danach auf (Wettlauf, der Test wackelte so unter Last).
  await expect(dialog).toBeVisible();
  for (let i = 0; i < HOECHSTENS && (await dialog.isVisible()); i++) {
    // Die letzte Wahl ist meist der Abschied; die erste führt manchmal zurück in dasselbe Gespräch.
    const wahl = page.locator(".abenteuer-dialog-wahlen button").last();
    if (await wahl.isVisible()) await wahl.click();
    else await page.locator(".abenteuer-dialog-weiter").click();
    await page.waitForTimeout(150);
  }
  await expect(dialog).toBeHidden();
  await expect(flaeche).toHaveAttribute("data-zuwendung", "mutter=zurueck", { timeout: 5000 });
});
