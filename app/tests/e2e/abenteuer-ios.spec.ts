/**
 * iOS-Durchsicht (20.11.2026): was sich ohne iPhone im Browser prüfen lässt. Läuft in CI auch in
 * WebKit (iPhone 15).
 *
 * Doppeltipp-Zoom: Knöpfe im Spiel tragen touch-action „manipulation“ (kein Doppeltipp-Zoom beim
 * schnellen Weiterklicken), Steuerkreuz und Welt behalten „none“ (Daumen gleitet, nichts rollt).
 * Langer Druck: kein Textmarkieren und kein Kopiermenü im Spiel.
 */
import { expect, test } from "@playwright/test";
import { GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

test("Knöpfe ohne Doppeltipp-Zoom, Steuerkreuz und Welt ohne Rollen, kein Markieren", async ({
  page,
}) => {
  await starteMitStand(page, GRUNDSTAND);
  const lies = (auswahl: string, eigenschaft: string) =>
    page.evaluate(
      ([a, e]) => {
        const el = document.querySelector(a ?? "");
        return el ? getComputedStyle(el).getPropertyValue(e ?? "") : "fehlt";
      },
      [auswahl, eigenschaft],
    );
  await expect(page.locator(".abenteuer-steuerkreuz button").first()).toBeVisible();
  expect(await lies("[data-testid='abenteuer-tagebuchknopf']", "touch-action")).toBe(
    "manipulation",
  );
  expect(await lies(".abenteuer-steuerkreuz button", "touch-action")).toBe("none");
  expect(await lies(".abenteuer-welt", "touch-action")).toBe("none");
  expect(await lies(".bildschirm-abenteuer", "-webkit-user-select")).toBe("none");
  // Ein Fenster mit Knöpfen (Tagebuch): auch dort kein Doppeltipp-Zoom.
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  expect(await lies("[role='dialog'] button", "touch-action")).toBe("manipulation");
});
