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
 *
 * Drei Beobachtungen aus dem Spieler-Durchlauf quer vom 20.11.2026 (Abschnitt 9): Eine Meldung
 * wartet, bis die Deckwahl zu ist; im Laden steht „Fertig“ im Fuß unter dem rollenden Inhalt statt
 * über einer Reihe Waren (der Abspann hat denselben Aufbau); vor „Ans Brett“ steht das Ziel der
 * kurzen Partie ganz im Bild.
 */
import { devices, expect, test, type Locator, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { feldDarunter } from "./abenteuer-karte";
import { geheZumRand, klickeDurch, SPERREN, standVor } from "./abenteuer-wegsperren";

/** Kits Runde (Umwandlung und Endspiel), Aufgabe 1: Schwarz setzt mit Td1+ und c2xd1=D matt. */
/** Wartezeit nach dem Aufbau des Bretts und nach der Antwort des Gegners. */
const AUFBAU_MS = 2500;
/** Höchstens so viele Schritte durch ein Gespräch, kurze Pause, wenn gerade nichts zu tippen ist. */
const MAX_DIALOGSCHRITTE = 30;
const KURZ_MS = 100;

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
async function ueberdeckt(
  seite: Page,
  fenster = "[data-testid='abenteuer-deckwahl']",
): Promise<string[]> {
  return seite.evaluate((f) => {
    const inhalt = document.querySelector(`${f} .abenteuer-menue-inhalt`);
    const fuss = [...document.querySelectorAll(`${f} .abenteuer-menue-fuss > button`)];
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
  }, fenster);
}

/** Rollt den Inhalt eines Fensters nach oben, in die Mitte und nach unten und prüft je die Lage. */
async function inJederRolllage(seite: Page, fenster: string): Promise<void> {
  const inhalt = seite.locator(`${fenster} .abenteuer-menue-inhalt`);
  for (const lage of ["oben", "mitte", "unten"] as const) {
    await inhalt.evaluate((e, l) => {
      e.scrollTop = l === "oben" ? 0 : l === "mitte" ? e.scrollHeight / 2 : e.scrollHeight;
    }, lage);
    expect(await ueberdeckt(seite, fenster), lage).toEqual([]);
  }
}

/** Blättert ein Gespräch weiter, bis `ziel` erscheint (Antworten: jeweils die erste). */
async function blaettereBis(seite: Page, ziel: Locator): Promise<void> {
  for (let i = 0; i < MAX_DIALOGSCHRITTE && !(await ziel.isVisible()); i++) {
    const weiter = seite.locator(".abenteuer-dialog-weiter");
    const wahl = seite.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else if (await weiter.isVisible()) await weiter.click();
    else await seite.waitForTimeout(KURZ_MS);
  }
  await expect(ziel).toBeVisible();
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
      // Die Überschrift „Bedenkzeit“ kostet quer keine Zeile (Spieler-Durchlauf quer, 20.11.2026:
      // Mit Lupe und Überschriften war von den Karten ohne Rollen nichts zu sehen).
      const ueberschrift = await inhalt.locator(":scope > h3").first().boundingBox();
      expect(ueberschrift?.height ?? 0).toBeLessThanOrEqual(1);
      await expect(page.getByTestId("abenteuer-deck-los")).toBeInViewport({ ratio: 0.9 });
      await expect(page.getByTestId("abenteuer-deck-zurueck")).toBeInViewport({ ratio: 0.9 });
    });

    test("Meldung wartet, bis die Deckwahl zu ist", async ({ page }) => {
      await starteMitStand(page, { ...GRUNDSTAND, dialogvariablen: EINLEITUNG_GESEHEN });
      const meldung = page.getByTestId("abenteuer-meldung");
      // Die Erklärung der Münzen kommt als Meldung, sobald die Welt frei ist.
      await expect(meldung).toBeVisible({ timeout: 20000 });
      // Die Deckwahl öffnet, während die Meldung noch steht (wie nach einem Dialog mit Partie);
      // die Meldung liegt quer über dem Knopf, deshalb der Klick direkt am Knopf.
      await page.getByTestId("abenteuer-reisebrettknopf").dispatchEvent("click");
      await expect(page.getByTestId("abenteuer-deckwahl")).toBeVisible();
      await expect(meldung).toHaveCount(0);
      // Nach der Deckwahl steht sie wieder da, „Weiter“ ganz im Bild.
      await page.getByTestId("abenteuer-deck-zurueck").click();
      await expect(meldung.getByRole("button", { name: "Weiter" })).toBeInViewport();
    });

    test("Laden: „Fertig“ steht unter den Waren, in jeder Rolllage", async ({ page }) => {
      const kiosk = feldDarunter("maple-falls-park", "kiosk");
      const position = { karte: "mapleFalls.park", ...kiosk, richtung: "oben" };
      await starteMitStand(page, {
        ...GRUNDSTAND,
        muenzen: 200,
        position,
        dialogvariablen: EINLEITUNG_GESEHEN,
      });
      const meldung = page.getByTestId("abenteuer-meldung").getByRole("button", { name: "Weiter" });
      await expect(page.getByTestId("abenteuer-aktion")).toBeVisible({ timeout: 20000 });
      if (await meldung.isVisible()) await meldung.click();
      await page.getByTestId("abenteuer-aktion").click();
      const fenster = "[data-testid='abenteuer-laden']";
      await blaettereBis(page, page.locator(fenster));
      await inJederRolllage(page, fenster);
      await expect(page.getByRole("button", { name: "Fertig" })).toBeInViewport();
    });

    test("Einstieg der Wegsperre S15: das Ziel steht vor „Ans Brett“ ganz im Bild", async ({
      page,
    }) => {
      const sperre = SPERREN.s15;
      await starteMitStand(page, standVor(sperre));
      await geheZumRand(page, sperre);
      await page.keyboard.down(sperre.taste);
      await expect(page.getByTestId("abenteuer-dialog")).toContainText(sperre.erste, {
        timeout: 15000,
      });
      await page.keyboard.up(sperre.taste);
      const los = page.getByTestId("abenteuer-deck-los");
      await klickeDurch(page, "„Eine Stellung.“", los);
      await los.click();
      await expect(page.getByTestId("abenteuer-erzaehlung")).toBeVisible({ timeout: 30000 });
      // Ganz im Bild der Spalte (sie rollt; vorher lag die letzte Zeile des Ziels darunter).
      const lage = await page.evaluate(() => {
        const ziel = document.querySelector("[data-testid='abenteuer-kurzform']");
        const spalte = document.querySelector(".abenteuer-partie-seite");
        return {
          ziel: ziel?.getBoundingClientRect().bottom ?? 0,
          spalte: spalte?.getBoundingClientRect().bottom ?? 0,
        };
      });
      expect(lage.ziel).toBeGreaterThan(0);
      expect(lage.ziel).toBeLessThanOrEqual(lage.spalte);
      await expect(page.getByTestId("abenteuer-erzaehlung-weiter")).toBeInViewport();
    });
  });
}
