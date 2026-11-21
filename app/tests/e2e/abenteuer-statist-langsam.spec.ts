/**
 * Statist auf einem langsamen Handy: Die Sprechblase bleibt offen, bis man sie schließt.
 *
 * Warum: Befund vom 20.11.2026 („Statist im Bergladen“ wackelte unter Last). Die Ladenhilfe lief
 * weg, der Held traf sie nicht mehr, und die Blase schloss sich mitten im Satz. Behoben in
 * oberwelt/belebungsbewegung.ts: Ein angesprochener Statist bleibt stehen (hoertZu, mittel-4), seit
 * dem 20.11.2026 abends auch dann, wenn er beim Ansprechen gerade ging (Komponententest dort).
 * Dieser Test schützt vor einem Rückfall auf einem gedrosselten Gerät; den gehenden Fall erzwingt
 * er nicht verlässlich, weil der Laufweg vom Zufall abhängt. Nur Chromium (CPU-Drosselung über CDP).
 */
import { expect, test } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, schreibeStandImBrowser } from "./abenteuer-affe";
import { feldDarunter } from "./abenteuer-karte";
import { ladeAbenteuerpaket } from "./abenteuer-paket";
import { starteImBrowser } from "./hilfen";

/** Langsames Handy: die CPU achtfach gedrosselt. */
const DROSSELUNG = 8;
/** So lange liest ein Mensch einen Satz der Sprechblase (ms). */
const LESEZEIT_MS = 4000;
/** So oft spricht der Held den Statisten nacheinander an. */
const WIEDERHOLUNGEN = 3;

const STAND = {
  ...GRUNDSTAND,
  position: {
    karte: "summitCity.bergladen",
    ...feldDarunter("summit-city-bergladen", "ladenhilfe"),
    richtung: "oben",
  },
  dialogvariablen: { ...EINLEITUNG_GESEHEN, muenzenErklaert: true },
};

test("Statist auf einem langsamen Handy: die Sprechblase bleibt offen, bis man sie schließt", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "CPU-Drosselung gibt es nur über CDP in Chromium");
  test.slow();
  // Wie im Ladentest, in dem der Wackler auftrat: Paket mit allem, was im Hintergrund nachlädt.
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStandImBrowser, STAND)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await ladeAbenteuerpaket(page);
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: DROSSELUNG });
  const aktion = page.getByTestId("abenteuer-aktion");
  const blase = page.getByTestId("abenteuer-sprechblase");
  for (let i = 0; i < WIEDERHOLUNGEN; i++) {
    await expect(aktion).toHaveText("Sprechen", { timeout: 30000 });
    await aktion.click();
    await expect(blase).toBeVisible();
    // So lange liest ein Mensch; die Blase darf sich in der Zeit nicht von selbst schließen.
    await page.waitForTimeout(LESEZEIT_MS);
    await expect(blase).toBeVisible();
    await blase.getByRole("button", { name: "Weiter" }).click();
    await expect(blase).toHaveCount(0);
  }
});
