/**
 * Schach-Abenteuer, Haustür in Maple Falls (Nachtauftrag 19.11.2026): Der Spieler-Durchlauf vom
 * 18.11. sah sie einmal nicht reagieren, beim nächsten Versuch ging sie. Nachgestellt wurden
 * 26 Läufe (frischer Start mit Einleitung, Taste, Tippen auf das Steuerkreuz, Halten, rein und
 * raus im Wechsel, Anlauf von der Seite mit Halt zwischen zwei Kacheln); jeder Wechsel gelang
 * beim ersten Versuch. Dieser Test hält das fest: viermal hinaus und wieder hinein, mit der
 * Pfeiltaste und mit kurzen Tipps auf das Steuerkreuz, und jeder Wechsel muss beim ersten Druck
 * aus dem Feld vor der Tür gelingen.
 */
import { expect, test, type Page } from "@playwright/test";
import {
  EINLEITUNG_GESEHEN,
  findeAusweg,
  GRUNDSTAND,
  liesSpeicherImBrowser,
  starteMitStand,
} from "./abenteuer-affe";

/** Im Wohnzimmer zwei Kacheln über der Haustür; Akt 1 ist so weit, dass die Tür offen ist. */
const IM_WOHNZIMMER = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.wohnzimmer", x: 5, y: 11, richtung: "unten" },
  dialogvariablen: {
    ...EINLEITUNG_GESEHEN,
    ersteLektionBesprochen: true,
    ersterAbendGesehen: true,
    treppeAbendGesehen: true,
    ersteNachtGesehen: true,
  },
};
const WECHSEL = 8;
const FRIST_MS = 5000;

/** Karte des Helden im gespeicherten Spielstand. */
async function karte(seite: Page): Promise<string> {
  const stand = (await seite.evaluate(liesSpeicherImBrowser)).abenteuer as {
    position?: { karte?: string };
  } | null;
  return stand?.position?.karte ?? "";
}

/** Ein Druck in Richtung Tür: Taste kurz halten oder einmal auf das Steuerkreuz tippen. */
async function drueckeZurTuer(seite: Page, art: "taste" | "tippen", hinaus: boolean) {
  if (art === "taste") {
    const taste = hinaus ? "ArrowDown" : "ArrowUp";
    await seite.keyboard.down(taste);
    await seite.waitForTimeout(700);
    await seite.keyboard.up(taste);
    return;
  }
  await seite.getByRole("button", { name: hinaus ? "Nach unten" : "Nach oben" }).click();
}

for (const art of ["taste", "tippen"] as const) {
  test(`Haustür in Maple Falls: hinaus und hinein beim ersten Druck (${art})`, async ({ page }) => {
    test.setTimeout(180_000);
    await starteMitStand(page, IM_WOHNZIMMER);
    await findeAusweg(page);
    for (let i = 0; i < WECHSEL; i++) {
      const vorher = await karte(page);
      const hinaus = vorher === "mapleFalls.wohnzimmer";
      await drueckeZurTuer(page, art, hinaus);
      await expect
        .poll(() => karte(page), { timeout: FRIST_MS, message: `Wechsel ${i + 1} (${vorher})` })
        .toBe(hinaus ? "mapleFalls.aussen" : "mapleFalls.wohnzimmer");
      await expect(page.locator(".abenteuer-welt canvas")).toHaveCount(1, { timeout: 30000 });
      await page.waitForTimeout(400);
    }
  });
}
