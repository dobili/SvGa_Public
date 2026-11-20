/**
 * Schach-Abenteuer, Barrierefreiheit (Prüfung „zugang“, 15.11.2026): axe auf Startkarte, Welt,
 * Spielmenü, Gespräch und Laden; das Gespräch hat einen Namen und nimmt den Fokus auf „Weiter“,
 * damit Tastatur und Vorleser das Fenster nicht suchen müssen.
 * Nacharbeit zum 19.11.2026: die Einleitung vor dem Haus (nur mit der Tastatur durch), das
 * Tagebuch mit dem Zielpfeil-Symbol (mit der Tastatur umschalten), die Partie mit Sprechblase am
 * Brett, das Ende der Partie, die Ergebniskarte und die Rückmeldung danach (Fokus im Gespräch),
 * die Umwandlungsauswahl im Querformat (dieselbe Komponente wie in der Spielhülle,
 * brettbedienung/Umwandlung.tsx; geprüft über eine eigene Stellung in der App).
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { EINLEITUNG_GESEHEN, GRUNDSTAND, starteMitStand } from "./abenteuer-affe";
import { feldDarunter } from "./abenteuer-karte";
import { starteImBrowser } from "./hilfen";
import { spieleFenGegenStufe } from "./spielenhilfen";
import { ladeAbenteuerpaket } from "./abenteuer-paket";

/** Schwere und kritische Verstöße im Spiel (leichte nehmen wir in Kauf, wie barrierefreiheit.spec.ts). */
async function schwereVerstoesse(page: Page): Promise<string[]> {
  // Die Phaser-Fläche ist Bild ohne Text; ihre Bedienung läuft über Steuerkreuz und Aktion.
  const ergebnis = await new AxeBuilder({ page }).exclude(".abenteuer-welt canvas").analyze();
  return ergebnis.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

/** Spielstand eine Kachel unter Patels Kiosk im Park, Blick nach oben (wie abenteuer-laden.spec.ts). */
const STAND = {
  version: 1,
  begonnen: "2026-11-08T05:00:00.000Z",
  eingangswertung: 600,
  eingangPartien: 0,
  wertung: 600,
  appWertungZuletzt: null,
  wertungPartien: 0,
  held: { name: "Kim", variante: 0 },
  handlung: { akt: 1, szene: "akt1.start", liga: null, durchlauf: 1 },
  position: {
    karte: "mapleFalls.park",
    ...feldDarunter("maple-falls-park", "kiosk"),
    richtung: "oben",
  },
  besuchteOrte: ["mapleFalls"],
  muenzen: 50,
};

function schreibeStand(stand: object): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const alt = lesen.result as Record<string, unknown> | undefined;
        if (!alt?.spiel) {
          db.close();
          fertig(false);
          return;
        }
        const schreiben = bereich.put({ ...alt, abenteuer: stand }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

test("axe: Startkarte, Welt, Spielmenü, Gespräch und Laden; Fokus im Gespräch", async ({
  page,
}) => {
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await expect(page.getByTestId("abenteuer-start")).toBeVisible();
  expect(await schwereVerstoesse(page)).toEqual([]);
  await ladeAbenteuerpaket(page);
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 30000 });
  expect(await schwereVerstoesse(page)).toEqual([]);

  await page.getByTestId("abenteuer-menueknopf").click();
  await expect(page.getByTestId("abenteuer-menue")).toBeVisible();
  expect(await schwereVerstoesse(page)).toEqual([]);
  await page.getByRole("button", { name: "Weiterspielen" }).click();

  // Gespräch mit Patel: das Fenster hat einen Namen, der Fokus steht auf einem Knopf darin.
  await aktion.click();
  const dialog = page.getByTestId("abenteuer-dialog");
  await expect(dialog).toBeVisible({ timeout: 20000 });
  await expect(dialog).toHaveAttribute("aria-label", /.+/);
  await expect
    .poll(() =>
      page.evaluate(() =>
        document.activeElement?.closest("[data-testid]")?.getAttribute("data-testid"),
      ),
    )
    .toBe("abenteuer-dialog");
  expect(await schwereVerstoesse(page)).toEqual([]);

  // Weiter mit der Tastatur bis zum Laden: Enter auf dem fokussierten Knopf.
  const laden = page.getByRole("dialog", { name: "Patels Kiosk" });
  for (let i = 0; i < 30 && !(await laden.isVisible()); i++) {
    if (await dialog.isVisible()) await page.keyboard.press("Enter");
    await page.waitForTimeout(150);
  }
  await expect(laden).toBeVisible();
  expect(await schwereVerstoesse(page)).toEqual([]);
});

/** Steht der Fokus in einem Element mit dieser Kennung (oder darin)? */
async function fokusIn(page: Page, kennung: string): Promise<string | null | undefined> {
  return page.evaluate(
    (k) => document.activeElement?.closest(`[data-testid='${k}']`)?.getAttribute("data-testid"),
    kennung,
  );
}

/** So lange darf kein Gespräch mehr kommen, bis „durch“ gilt (Kartenwechsel dazwischen). */
const RUHE_MS = 1500;

/**
 * Drückt Enter, solange Gespräche kommen (Fokus steht auf Weiter oder der ersten Wahl). Zwischen
 * zwei Gesprächen (Einleitung, dann Ankunft im Wohnzimmer) ist kurz keins offen; erst wenn
 * RUHE_MS lang keins kommt, ist man durch.
 */
async function mitEnterDurch(page: Page): Promise<void> {
  const dialog = page.getByTestId("abenteuer-dialog");
  let ruhigSeit = Date.now();
  for (let i = 0; i < 300 && Date.now() - ruhigSeit < RUHE_MS; i++) {
    if (await dialog.isVisible()) {
      await page.keyboard.press("Enter");
      ruhigSeit = Date.now();
    }
    await page.waitForTimeout(150);
  }
  await expect(dialog).toHaveCount(0);
}

test("Einleitung vor dem Haus: Name, Fokus, axe, mit der Tastatur bis in die Welt", async ({
  page,
}) => {
  test.slow();
  await starteMitStand(page, {
    ...GRUNDSTAND,
    position: { karte: "mapleFalls.aussen", x: 3, y: 24, richtung: "unten" },
    dialogvariablen: {},
  });
  const dialog = page.getByTestId("abenteuer-dialog");
  await expect(dialog).toBeVisible({ timeout: 20000 });
  await expect(dialog).toHaveAttribute("aria-label", /.+/);
  await expect.poll(() => fokusIn(page, "abenteuer-dialog")).toBe("abenteuer-dialog");
  expect(await schwereVerstoesse(page)).toEqual([]);
  await mitEnterDurch(page);
  await expect(page.locator(".abenteuer-steuerkreuz")).toBeVisible();
});

test("Tagebuch mit Zielpfeil-Symbol: axe und Umschalten mit der Tastatur", async ({ page }) => {
  await starteMitStand(page, {
    ...GRUNDSTAND,
    position: { karte: "mapleFalls.wohnzimmer", x: 14, y: 7, richtung: "rechts" },
    quests: [
      {
        kennung: "mapleFalls.ersterAbend",
        schritt: 0,
        erledigt: false,
        angenommen: "2026-11-19T10:00:00.000Z",
        erledigtAm: null,
      },
    ],
    dialogvariablen: {
      ...EINLEITUNG_GESEHEN,
      brettBeruehrt: true,
      ambroseErwachtGesehen: true,
      ersteLektionBesprochen: true,
      treppeAbendGesehen: true,
    },
  });
  await page.getByTestId("abenteuer-tagebuchknopf").click();
  const symbol = page.getByTestId("abenteuer-zielpfeil-mapleFalls.ersterAbend");
  await expect(symbol).toHaveAccessibleName(/Pfeil zum Ziel von/);
  expect(await schwereVerstoesse(page)).toEqual([]);
  await symbol.focus();
  await page.keyboard.press("Enter");
  await expect(symbol).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(symbol).toHaveAttribute("aria-pressed", "false");
});

test("Partie mit Sprechblase, Ende, Ergebniskarte und Rückmeldung: axe und Fokus", async ({
  page,
}) => {
  test.slow();
  // Sprechblasen blenden in 0,4 s ein; axe soll den fertigen Zustand messen, nicht die Einblendung
  // (einmal „color-contrast“ mitten im Einblenden, 19.11.2026).
  await page.emulateMedia({ reducedMotion: "reduce" });
  await starteMitStand(page, {
    ...GRUNDSTAND,
    position: {
      karte: "mapleFalls.park",
      ...feldDarunter("maple-falls-park", "skaterJo"),
      richtung: "oben",
    },
  });
  await page.getByTestId("abenteuer-aktion").click();
  const deckwahl = page.getByTestId("abenteuer-deckwahl");
  for (let i = 0; i < 30 && !(await deckwahl.isVisible()); i++) {
    if (await page.getByTestId("abenteuer-dialog").isVisible()) await page.keyboard.press("Enter");
    await page.waitForTimeout(150);
  }
  expect(await schwereVerstoesse(page)).toEqual([]);
  await page.getByTestId("abenteuer-deck-los").click();
  await page.getByTestId("abenteuer-erzaehlung-weiter").click({ timeout: 30000 });
  await expect(page.getByTestId("partie")).toBeVisible();
  // Sprechblasen neben dem Brett sind Statusmeldungen (role="status"); axe prüft die Hülle mit.
  expect(await schwereVerstoesse(page)).toEqual([]);
  await page.getByTestId("abenteuer-test-sieg").click();
  await expect(page.getByTestId("abenteuer-nachwort")).toBeVisible();
  expect(await schwereVerstoesse(page)).toEqual([]);
  await page.getByTestId("partie-zurueck-zur-stadt").click();
  const ergebnis = page.getByTestId("abenteuer-ergebnis");
  await expect(ergebnis).toBeVisible({ timeout: 30000 });
  expect(await schwereVerstoesse(page)).toEqual([]);
  await ergebnis.getByRole("button", { name: "Weiter", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(ergebnis).toHaveCount(0);
  // Rückmeldung nach dem Ergebnis: Das Gespräch öffnet sich von selbst und nimmt den Fokus.
  const dialog = page.getByTestId("abenteuer-dialog");
  await expect(dialog).toBeVisible({ timeout: 20000 });
  await expect.poll(() => fokusIn(page, "abenteuer-dialog")).toBe("abenteuer-dialog");
  expect(await schwereVerstoesse(page)).toEqual([]);
  await mitEnterDurch(page);
});

test("Umwandlungsauswahl quer: Fokus auf der Dame, im Bild, axe, Wahl mit Enter", async ({
  page,
}) => {
  await page.setViewportSize({ width: 800, height: 420 });
  await starteImBrowser(page);
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Spielen", exact: true })
    .click();
  await spieleFenGegenStufe(page, "7k/P7/8/8/8/8/8/K7 w - - 0 1", 10);
  await page.getByRole("button", { name: /^a7, Bauer/ }).click();
  await page.getByRole("button", { name: "a8", exact: true }).click();
  const auswahl = page.locator(".umwandlung[role='dialog']");
  const dame = auswahl.getByRole("button", { name: "Dame" });
  await expect(dame).toBeFocused();
  await expect(dame).toBeInViewport();
  expect(await schwereVerstoesse(page)).toEqual([]);
  await page.keyboard.press("Enter");
  await expect(auswahl).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^a8, Dame/ })).toBeVisible();
});
