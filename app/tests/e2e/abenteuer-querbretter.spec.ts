/**
 * Bretter im Querformat ganz im Bild (Wunsch des Autors, 20.11.2026: Bei Partien und Rätseln muss
 * das Schachbrett quer immer ganz zu sehen sein). Gemessen auf iPhone 15 quer, Pixel 7 quer und
 * 932 × 430: Übungspartie über das Reisebrett, Aufgabenrunde, Vorführung und Gedächtnisstellung.
 * Simultan und Partien aus Dialogen prüft die Wache des Spieler-Durchlaufs (wache.ts,
 * „brettAngeschnitten“); die Einstiege hier folgen dem Affentest (abenteuer-affentest.spec.ts).
 */
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { feldDarunter } from "./abenteuer-karte";
import { foto, GERAETE, imBild } from "./abenteuer-quer";

/** Das Brett baut sich auf (Einblenden, Figuren). */
const AUFBAU_MS = 1200;

/** Den Aktionsknopf drücken, bis ein Fenster mit dieser Testkennung offen ist. */
async function sprichAn(seite: Page, ziel: string): Promise<void> {
  await expect(async () => {
    const fenster = seite.getByTestId(ziel);
    if (!(await fenster.isVisible())) await seite.getByTestId("abenteuer-aktion").click();
    await expect(fenster).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 30000 });
}

/** Im Dialog die erste Wahl, sonst „Weiter“, bis die Testkennung sichtbar ist. */
async function klickeBis(seite: Page, ziel: string): Promise<void> {
  for (let i = 0; i < 30 && !(await seite.getByTestId(ziel).isVisible()); i++) {
    const wahl = seite.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible().catch(() => false)) await wahl.click({ timeout: 3000 });
    else {
      await seite
        .locator(".abenteuer-dialog-weiter")
        .click({ timeout: 3000 })
        .catch(() => undefined);
    }
  }
  await expect(seite.getByTestId(ziel)).toBeVisible();
}

interface Brettlage {
  readonly name: string;
  readonly stand: object;
  readonly hinein: (seite: Page) => Promise<void>;
  /** Fenster über der Welt: Das Steuerkreuz ist dann weg (es ragte quer über den Rand). */
  readonly ueberWelt?: boolean;
}

const LAGEN: readonly Brettlage[] = [
  {
    name: "partie",
    stand: { ...GRUNDSTAND, dialogvariablen: EINLEITUNG_GESEHEN },
    hinein: async (s) => {
      const hinweis = s.getByTestId("abenteuer-meldung").getByRole("button", { name: "Weiter" });
      await expect(s.getByTestId("abenteuer-reisebrettknopf")).toBeVisible({ timeout: 20000 });
      if (await hinweis.isVisible()) await hinweis.click();
      await s.getByTestId("abenteuer-reisebrettknopf").click();
      await s.getByTestId("abenteuer-deck-los").click();
      await expect(s.getByTestId("partie")).toBeVisible({ timeout: 30000 });
    },
  },
  {
    name: "aufgabenrunde",
    stand: {
      ...GRUNDSTAND,
      position: { karte: "mapleFalls.dachboden", x: 2, y: 9, richtung: "unten" },
      laufendeAufgaben: {
        kennung: "mapleFalls.reiheSam#quer",
        runde: "mapleFalls.reiheSam",
        steller: "figur.sam.name",
        kapitel: 0,
        buchuebungen: ["ueb:droh-ignorieren"],
        themen: ["haengend"],
        anzahl: 2,
        schwierigkeit: 1,
        versuch: 1,
        zaehltFuerApp: true,
      },
    },
    hinein: async (s) => {
      await s.getByRole("button", { name: "Weitermachen" }).click();
      await expect(s.getByTestId("abenteuer-aufgaben")).toBeVisible({ timeout: 20000 });
    },
  },
  {
    name: "vorfuehrung",
    ueberWelt: true,
    stand: {
      ...GRUNDSTAND,
      position: {
        karte: "summitCity.bergladen",
        ...feldDarunter("summit-city-bergladen", "kunde"),
        richtung: "oben",
      },
    },
    hinein: async (s) => {
      await sprichAn(s, "abenteuer-sprechblase");
      await s.getByTestId("abenteuer-vorfuehrung-zeigen").click();
      await expect(s.getByTestId("abenteuer-vorfuehrung")).toBeVisible();
    },
  },
  {
    name: "gedaechtnis",
    ueberWelt: true,
    stand: {
      ...GRUNDSTAND,
      dialogvariablen: {
        ...EINLEITUNG_GESEHEN,
        versoehnungGesehen: true,
        seilschaftBegonnen: true,
      },
      position: {
        karte: "wegDelacroixDesert.felsbogen",
        ...feldDarunter("weg-delacroix-desert-felsbogen", "ereignisSeilschaft"),
        richtung: "oben",
      },
    },
    hinein: async (s) => {
      await sprichAn(s, "abenteuer-dialog");
      await klickeBis(s, "abenteuer-gedaechtnis");
    },
  },
];

for (const g of GERAETE) {
  test.describe(g.name, () => {
    test.use({
      viewport: g.viewport,
      deviceScaleFactor: g.deviceScaleFactor,
      isMobile: g.isMobile,
      hasTouch: g.hasTouch,
      userAgent: g.userAgent,
    });

    for (const lage of LAGEN) {
      test(`Brett ganz im Bild: ${lage.name}`, async ({ page }) => {
        test.slow();
        await starteMitStand(page, lage.stand);
        await lage.hinein(page);
        await expect(page.locator(".brett").first()).toBeVisible({ timeout: 20000 });
        await page.waitForTimeout(AUFBAU_MS);
        expect(await imBild(page, ".brett")).toBe(true);
        if (lage.ueberWelt) await expect(page.locator(".abenteuer-steuerkreuz")).toHaveCount(0);
        await foto(page, `brett-${lage.name}`, g.name);
      });
    }

    test("Moment in der Partie: die Spalte steht neben dem Brett, nicht darauf", async ({
      page,
    }) => {
      test.slow();
      const partie = LAGEN.find((l) => l.name === "partie");
      if (!partie) throw new Error("Lage partie fehlt");
      await starteMitStand(page, partie.stand);
      await partie.hinein(page);
      await expect(page.locator(".brett").first()).toBeVisible({ timeout: 20000 });
      // Aufbau wie anbindung/Momentdialog.tsx mit dialog/Dialog.tsx; ein echter Moment käme erst
      // nach 18 Zügen gegen Mrs. Okafor (begegnungen.json).
      await page.evaluate(() => {
        const huelle = document.createElement("div");
        huelle.className = "abenteuer-momentdialog";
        huelle.innerHTML =
          '<section class="abenteuer-dialog" data-testid="abenteuer-dialog">' +
          '<p class="abenteuer-dialog-text">Ich biete dir einen Bauern an. Nimmst du ihn?</p>' +
          '<div class="abenteuer-dialog-wahlen"><button type="button">„Ich nehme ihn.“</button>' +
          '<button type="button">„Lieber nicht.“</button></div></section>';
        document.body.append(huelle);
      });
      const lage = await page.evaluate(() => {
        const d = document.querySelector(".abenteuer-momentdialog .abenteuer-dialog");
        const b = document.querySelector(".brett");
        const r = d?.getBoundingClientRect();
        const q = b?.getBoundingClientRect();
        if (!r || !q) return null;
        const imBild = r.top >= 0 && r.bottom <= innerHeight && r.right <= innerWidth;
        return { imBild, ueberlappt: Math.max(0, q.right - r.left) };
      });
      expect(lage).toEqual({ imBild: true, ueberlappt: 0 });
      await foto(page, "moment", g.name);
    });
  });
}
