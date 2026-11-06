/**
 * Oberflächentests der waagerechten Zeitleiste „Die Partie in Momenten“ und von „Zur Stellung“
 * (Wünsche des Autors, 1.11.2026). Eingespielt wird die ausgewertete Opernpartie gegen Derya
 * (auswertungpartie.ts). Geprüft wird: Die Momente stehen nebeneinander in einer Reihe mit
 * Einrasten, die nächste Karte schaut rechts heraus, Stand „1 von 7“, Blättern mit Knöpfen und
 * Tastatur, die Knöpfe der Phasen an der Kurve rücken den Abschnitt nach vorn, bei „Bewegung
 * reduzieren“ kein weiches Scrollen. „Zur Stellung“ scrollt so, dass das Brett ganz zu sehen ist
 * (gemessen am Rechteck des Brettes im Fenster), auf kleinem und großem Bildschirm.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffnePartie } from "./auswertungpartie";
import { starteImBrowser } from "./hilfen";

/** Anteil der Breite einer Momentkarte an der Reihe (Wunsch: etwa 80 %). */
const KARTENANTEIL = 0.8;
const TOLERANZ = 0.05;
/** Höher als dieser Anteil des Fensters darf die Reihe nicht sein (vorher etwa 2,5 Fenster). */
const HOECHSTENS_FENSTER = 0.6;
/** Die Partie hat fünf Momente (seit 6.11.2026 ohne die Kleinigkeiten der Engine). */
const MOMENTE = 5;

/** Rechteck eines Elements; der Test bricht ab, wenn es keines hat. */
async function rechteck(page: Page, testid: string, nr = 0) {
  const r = await page.getByTestId(testid).nth(nr).boundingBox();
  if (!r) throw new Error(`${testid} ohne Rechteck`);
  return r;
}

/** Ist das Brett der Partie ganz im Fenster über der Leiste unten? */
async function brettGanzZuSehen(page: Page) {
  return page.evaluate(() => {
    const brett = document.querySelector("[data-tour='brett']")?.getBoundingClientRect();
    const leiste = document.querySelector("nav.leiste")?.getBoundingClientRect();
    const unten = leiste && leiste.width > window.innerWidth / 2 ? leiste.top : window.innerHeight;
    return brett ? { oben: brett.top, unten: brett.bottom, sichtUnten: unten } : null;
  });
}

for (const [breite, hoehe] of [
  [393, 851],
  [320, 568],
] as const) {
  test(`Zeitleiste waagerecht und Zur Stellung (${breite} × ${hoehe})`, async ({ page }) => {
    await page.setViewportSize({ width: breite, height: hoehe });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await starteImBrowser(page);
    await oeffnePartie(page, "dunkel");
    const zeitleiste = page.getByTestId("zeitleiste");
    const reihe = zeitleiste.getByRole("list", { name: /Momente der Partie/ });
    await expect(reihe).toBeVisible();
    await expect(reihe).toHaveCSS("scroll-behavior", "auto");
    await expect(reihe).toHaveCSS("scroll-snap-type", "x mandatory");
    // Nebeneinander: zwei Momente auf einer Höhe, die Karte etwa 80 % breit, die Reihe niedrig.
    const zeile = await reihe.boundingBox();
    const erste = await rechteck(page, "moment-theorie");
    const zweite = await rechteck(page, "moment-engine");
    expect(Math.abs(zweite.y - erste.y)).toBeLessThan(1);
    expect(zweite.x).toBeGreaterThan(erste.x);
    expect(Math.abs(erste.width / (zeile?.width ?? 1) - KARTENANTEIL)).toBeLessThan(TOLERANZ);
    expect(zeile?.height ?? 0).toBeLessThan(hoehe * HOECHSTENS_FENSTER);
    // Stand und Blättern mit dem Knopf.
    const stand = zeitleiste.getByTestId("zeitleiste-stand");
    await expect(stand).toHaveText(`1 von ${MOMENTE}`);
    await expect(zeitleiste.getByRole("button", { name: "Voriger Moment" })).toBeDisabled();
    await zeitleiste.getByRole("button", { name: "Nächster Moment" }).click();
    await zeitleiste.getByRole("button", { name: "Nächster Moment" }).click();
    await expect(stand).toHaveText(`3 von ${MOMENTE}`);
    // Tastatur: Die Reihe ist mit Tab erreichbar und blättert mit Pfeiltasten, Pos1 und Ende.
    await reihe.focus();
    await page.keyboard.press("End");
    await expect(stand).toHaveText(`${MOMENTE} von ${MOMENTE}`);
    await page.keyboard.press("ArrowLeft");
    await expect(stand).toHaveText(`${MOMENTE - 1} von ${MOMENTE}`);
    await page.keyboard.press("Home");
    await expect(stand).toHaveText(`1 von ${MOMENTE}`);
    // „Mittelspiel“ an der Kurve rückt den Abschnitt nach vorn, „Ganze Partie“ an den Anfang.
    await page
      .getByRole("group", { name: "Ausschnitt der Kurve" })
      .getByRole("button", { name: "Mittelspiel" })
      .click();
    const abschnitt = await rechteck(page, "zeitleiste-phase-mittelspiel");
    expect(abschnitt.x - (zeile?.x ?? 0)).toBeLessThan(TOLERANZ * breite);
    await page.getByRole("button", { name: "Ganze Partie" }).click();
    await expect(stand).toHaveText(`1 von ${MOMENTE}`);
    // „Zur Stellung“: Das Brett ist danach ganz zu sehen, ohne Gleiten (Bewegung reduziert).
    await zeitleiste
      .getByTestId("moment-fehler")
      .first()
      .getByRole("button", { name: "Zur Stellung" })
      .click();
    await expect
      .poll(() => brettGanzZuSehen(page).then((b) => b !== null && b.oben >= 0))
      .toBe(true);
    const b = await brettGanzZuSehen(page);
    expect(b?.oben ?? -1).toBeGreaterThanOrEqual(0);
    expect(b?.unten ?? Infinity).toBeLessThanOrEqual(b?.sichtUnten ?? 0);
  });
}
