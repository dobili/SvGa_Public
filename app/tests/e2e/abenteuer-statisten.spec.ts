/**
 * Schach-Abenteuer, Statisten halten den Helden auf und lassen sich ansprechen (Befund im Browser,
 * 18.11.2026): Bis dahin ging ihre Sperre zwei Pixel vor dem Anstoßen aus, und der Held lief
 * geradeaus durch jeden Statisten (oberwelt/belebungsbewegung.ts, sperreAn).
 *
 * Geprüft in der Bahnhofshalle von Riverton: Der Held läuft auf die Schaffnerin zu, bleibt eine
 * Kachel vor ihr stehen und kann sie ansprechen. Im Zustand „Slick auf der Bank“ (nach der Nadel
 * von Ironwood) sitzt Slick als Statist auf der Zweierbank; auch er antwortet jetzt.
 * Abhängigkeiten: abenteuer-affe.ts (Spielstand), abenteuer-karte.ts (Felder aus den Karten).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { feldVon } from "./abenteuer-karte";

/** So lange hält der Test die Taste: genug für drei Kacheln, zwei mehr als der Weg bis vor den Statisten. */
const LAUFZEIT_MS = 1400;
/** Abstand des Starts zum Statisten in Kacheln. */
const ANLAUF = 2;

/** Spielstand in der Bahnhofshalle, `ANLAUF` Kacheln unter dem Statisten, Blick nach oben. */
function standUnter(feld: { x: number; y: number }, variablen: Record<string, number>): object {
  return {
    ...GRUNDSTAND,
    position: { karte: "riverton.bahnhofshalle", x: feld.x, y: feld.y + ANLAUF, richtung: "oben" },
    dialogvariablen: { ...EINLEITUNG_GESEHEN, ...variablen },
  };
}

/** Läuft nach oben, bis es nicht weitergeht, und gibt die Kachel des Helden zurück („x,y“). */
async function laufeHoch(seite: Page): Promise<string> {
  await seite.keyboard.down("ArrowUp");
  await seite.waitForTimeout(LAUFZEIT_MS);
  await seite.keyboard.up("ArrowUp");
  await seite.waitForTimeout(200);
  return (await seite.getByTestId("abenteuer-kachel").textContent()) ?? "";
}

test("der Held läuft nicht durch die Schaffnerin und kann sie ansprechen", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Laufen mit gehaltener Taste nur in Chromium");
  const frau = feldVon("riverton-bahnhofshalle", "schaffnerin");
  await starteMitStand(page, standUnter(frau, {}));
  // Eine Kachel vor ihr ist Schluss; vorher stand der Held danach auf ihrer Kachel.
  expect(await laufeHoch(page)).toBe(`${frau.x},${frau.y + 1}`);
  await page.getByTestId("abenteuer-aktion").click();
  await expect(page.getByText("Der Türke war ein Schachautomat")).toBeVisible();
});

test("Slick auf der Bank in der Bahnhofshalle antwortet", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Laufen mit gehaltener Taste nur in Chromium");
  const slick = feldVon("riverton-bahnhofshalle-slick-auf-der-bank", "slickAufDerBank");
  await starteMitStand(page, standUnter(slick, { nadelIronwood: 1 }));
  expect(await laufeHoch(page)).toBe(`${slick.x},${slick.y + 1}`);
  await page.getByTestId("abenteuer-aktion").click();
  await expect(page.getByText("Gegen mich selbst verliere ich nie.")).toBeVisible();
});
