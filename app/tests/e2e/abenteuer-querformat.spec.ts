/**
 * Querformat ab Akt 2 (Spieler-Durchlauf quer, 19.11.2026): Funde mit Test auf iPhone und Android
 * quer gehalten.
 *
 * Umwandlung in einer Aufgabenrunde (Kits Runde in der Hütte, Akt 4): Quer füllt die Brettspalte
 * die Höhe, die Auswahl der Figur stand unter dem Brett außerhalb des Bildes, und in der
 * Spielhülle war ihre Schrift weiß auf Weiß. Jetzt liegt sie über der Mitte des Bretts, in den
 * Farben des Spiels, und lässt sich antippen.
 *
 * Deckwahl: Der am unteren Rand feststehende Knopf „Ohne Karten spielen“ lag quer über den
 * Bedenkzeit-Knöpfen. Jetzt rollt nur der Inhalt, die Knöpfe stehen darunter; in keiner Rolllage
 * überdecken sie einen Knopf des Inhalts.
 */
import { devices, expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";

/** Kits Runde (Umwandlung und Endspiel), Aufgabe 1: Schwarz setzt mit Td1+ und c2xd1=D matt. */
/** Wartezeit nach dem Aufbau des Bretts und nach der Antwort des Gegners. */
const AUFBAU_MS = 2500;

const STAND = {
  ...GRUNDSTAND,
  position: { karte: "mapleFalls.dachboden", x: 2, y: 9, richtung: "unten" },
  laufendeAufgaben: {
    kennung: "summitCity.reiheKit#quer",
    runde: "summitCity.reiheKit",
    steller: "figur.kit.name",
    kapitel: 0,
    buchuebungen: [],
    themen: ["umwandlung", "endspiel"],
    anzahl: 5,
    schwierigkeit: 1,
    versuch: 1,
    zaehltFuerApp: true,
  },
  dialogvariablen: EINLEITUNG_GESEHEN,
};

/** Gerät quer: nur Fenster, Maßstab, Touch und Kennung (der Browser bleibt der des Projekts). */
function quer(name: "iPhone 15 landscape" | "Pixel 7 landscape") {
  const d = devices[name];
  return {
    viewport: d.viewport,
    deviceScaleFactor: d.deviceScaleFactor,
    isMobile: d.isMobile,
    hasTouch: d.hasTouch,
    userAgent: d.userAgent,
  };
}

/** Ein Feld des Bretts (Name wie „d8“, auch mit Figur dahinter). */
function feld(seite: Page, name: string) {
  return seite.getByRole("button", { name: new RegExp(`^${name}(,|$)`) });
}

/** Liegt das Rechteck ganz im Fenster? */
async function ganzImBild(seite: Page, auswahl: string): Promise<boolean> {
  return seite.evaluate((s) => {
    const r = document.querySelector(s)?.getBoundingClientRect();
    return !!r && r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth;
  }, auswahl);
}

/**
 * Knöpfe des Rollbereichs der Deckwahl, deren sichtbarer Teil einen Knopf im Fuß schneidet
 * (Bedenkzeit, Karten). Sichtbar heißt: innerhalb des Rollbereichs.
 */
async function ueberdeckt(seite: Page): Promise<string[]> {
  return seite.evaluate(() => {
    const inhalt = document.querySelector("[data-testid='abenteuer-deckwahl-inhalt']");
    const fuss = [...document.querySelectorAll(".abenteuer-menue-fuss > button")];
    if (!inhalt) return ["kein Rollbereich"];
    const rahmen = inhalt.getBoundingClientRect();
    const funde: string[] = [];
    for (const k of inhalt.querySelectorAll("button")) {
      const r = k.getBoundingClientRect();
      const oben = Math.max(r.top, rahmen.top);
      const unten = Math.min(r.bottom, rahmen.bottom);
      if (unten <= oben) continue;
      for (const f of fuss) {
        const q = f.getBoundingClientRect();
        const schneidet = q.left < r.right && q.right > r.left && q.top < unten && q.bottom > oben;
        if (schneidet) funde.push(`${k.textContent ?? ""} unter ${f.textContent ?? ""}`);
      }
    }
    return funde;
  });
}

for (const geraet of ["iPhone 15 landscape", "Pixel 7 landscape"] as const) {
  test.describe(geraet, () => {
    test.use(quer(geraet));

    test("Umwandlung in der Aufgabenrunde: im Bild, lesbar, antippbar", async ({ page }) => {
      await starteMitStand(page, STAND);
      await page.getByRole("button", { name: "Weitermachen" }).click();
      await expect(feld(page, "d8")).toBeVisible({ timeout: 20000 });
      // Das Brett nimmt Züge erst nach dem Aufbau an (wie der Spieler-Durchlauf: kurz warten).
      await page.waitForTimeout(AUFBAU_MS);
      await feld(page, "d8").click();
      await feld(page, "d1").click();
      // Der Gegner antwortet (Txd1); dann zieht der Bauer auf die letzte Reihe.
      await expect(feld(page, "d8")).toHaveAccessibleName(/^d8$/, { timeout: 10000 });
      await page.waitForTimeout(AUFBAU_MS);
      await feld(page, "c2").click();
      await feld(page, "d1").click();
      const wahl = page.locator(".umwandlung");
      await expect(wahl).toBeVisible();
      expect(await ganzImBild(page, ".umwandlung")).toBe(true);
      // Lesbar: Schrift und Grund der Knöpfe unterscheiden sich.
      const dame = wahl.getByRole("button", { name: "Dame" });
      const farben = await dame.evaluate((k) => {
        const s = getComputedStyle(k);
        return [s.color, s.backgroundColor];
      });
      expect(farben[0]).not.toBe(farben[1]);
      await dame.click();
      await expect(wahl).toHaveCount(0);
      await expect(page.getByText("Richtig!")).toBeVisible({ timeout: 10000 });
    });

    test("Deckwahl: feste Knöpfe überdecken keine Bedenkzeit, auch nicht beim Rollen", async ({
      page,
    }) => {
      await starteMitStand(page, { ...GRUNDSTAND, dialogvariablen: EINLEITUNG_GESEHEN });
      // Der Hinweis zu den ersten Münzen kann über dem Knopf liegen: wegtippen wie ein Spieler.
      const hinweis = page.getByTestId("abenteuer-meldung").getByRole("button", { name: "Weiter" });
      await expect(page.getByTestId("abenteuer-reisebrettknopf")).toBeVisible({ timeout: 20000 });
      if (await hinweis.isVisible()) await hinweis.click();
      await page.getByTestId("abenteuer-reisebrettknopf").click();
      const inhalt = page.getByTestId("abenteuer-deckwahl-inhalt");
      await expect(page.getByTestId("abenteuer-zeit-schnell")).toBeVisible();
      for (const lage of ["oben", "mitte", "unten"] as const) {
        await inhalt.evaluate((e, l) => {
          e.scrollTop = l === "oben" ? 0 : l === "mitte" ? e.scrollHeight / 2 : e.scrollHeight;
        }, lage);
        expect(await ueberdeckt(page), lage).toEqual([]);
      }
      await expect(page.getByTestId("abenteuer-deck-los")).toBeInViewport({ ratio: 0.9 });
      await expect(page.getByTestId("abenteuer-deck-zurueck")).toBeInViewport({ ratio: 0.9 });
    });
  });
}
