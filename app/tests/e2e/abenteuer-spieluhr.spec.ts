/**
 * Spieluhr und Warten (Wunsch des Autors, 22.11.2026, regeln/spieluhr.ts, oberwelt/useWarten.tsx):
 * Ein neuer Stand beginnt am Morgen (Morgendämmerung, Statisten des Tages vor dem Haus). Im
 * Spielmenü „Warten … bis Nacht“: kurze Abblende, dann ist es 22 Uhr, die Karte ist nachtblau und
 * neu aufgestellt (die Statisten des Tages sind fort), das Tagebuch zeigt die Nacht.
 */
import { expect, test } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

const STAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.aussen", x: 3, y: 24, richtung: "unten" },
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    hinweisSteuerkreuz: true,
    hinweisAktion: true,
    muenzenErklaert: true,
  },
};

test("Warten bis Nacht: Nachttönung, andere Statisten, Tagebuch zeigt die Nacht", async ({
  page,
}) => {
  await page.addInitScript(() => window.localStorage.setItem("svga.safariHinweis", "aus"));
  await starteMitStand(page, STAND);
  const welt = page.getByTestId("abenteuer-welt");
  await expect(welt).toHaveAttribute("data-stunde", "6", { timeout: 20000 });
  await expect(welt).toHaveAttribute("data-toenung", "morgen");
  await expect(welt).toHaveAttribute("data-statisten", /\w/, { timeout: 20000 });
  const amMorgen = await welt.getAttribute("data-statisten");

  await page.getByTestId("abenteuer-menueknopf").click();
  const warten = page.getByTestId("abenteuer-warten");
  await expect(warten.getByTestId("abenteuer-phase")).toHaveText("morgen");
  await warten.locator('button[data-ziel="nacht"]').click();
  await expect(page.getByTestId("abenteuer-warteblende")).toBeVisible();
  await expect(welt).toHaveAttribute("data-stunde", "22", { timeout: 20000 });
  await expect(welt).toHaveAttribute("data-toenung", "nacht");
  await expect
    .poll(() => welt.getAttribute("data-statisten"), { timeout: 20000 })
    .not.toBe(amMorgen);

  await page.getByTestId("abenteuer-tagebuchknopf").click();
  await expect(page.getByTestId("abenteuer-tagebuch-uhr")).toContainText("Nacht");
});
