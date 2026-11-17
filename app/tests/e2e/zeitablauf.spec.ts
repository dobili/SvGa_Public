/**
 * Zug genau beim Zeitablauf (Vortest der offenen Testpunkte, 17.11.2026, N2466): Ist die Zeit
 * schon um, wenn der Zug kommt, endet die Partie auf Zeit, und der Zug wird nicht mehr
 * ausgeführt. Die gefälschte Uhr (page.clock) springt über das Ende, ohne dass der Takt der App
 * läuft; so kommt der Zug vor der Meldung der Uhr an. Regel: spiel/ablauf.ts (zu spät).
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";
import { oeffneSpielen, spieleVorschlag, stelleEin } from "./spielenhilfen";

/** Mehr als die Bedenkzeit von Blitz 3 + 2. */
const UEBER_DEM_ENDE_MS = 4 * 60 * 1000;
/** Rechenzeit der Engine für ihren ersten Zug. */
const ENGINE_FRIST = 60_000;

async function ziehe(seite: Page, von: RegExp, nach: string): Promise<void> {
  await seite.getByRole("button", { name: von }).click();
  await seite.getByRole("button", { name: nach, exact: true }).click();
}

test("Blitz 3 + 2: Zug nach dem Ablauf der Zeit endet auf Zeit und wird nicht ausgeführt (N2466)", async ({
  page,
}) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneSpielen(page);
  await stelleEin(page, (b) => b.getByRole("radio", { name: /Blitz 3 \+ 2/ }).click());
  await spieleVorschlag(page);
  await ziehe(page, /^e2, Bauer/, "e4");
  await expect(page.getByTestId("partiestatus")).toHaveText("Du bist am Zug.", {
    timeout: ENGINE_FRIST,
  });
  const jetzt = await page.evaluate(() => Date.now());
  await page.clock.setSystemTime(jetzt + UEBER_DEM_ENDE_MS);
  await ziehe(page, /^d2, Bauer/, "d4");
  await expect(page.getByTestId("partieende")).toContainText("Deine Zeit ist abgelaufen");
  await expect(page.getByTestId("partiezuege")).not.toContainText("d4");
});
