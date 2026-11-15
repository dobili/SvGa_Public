/**
 * Schach-Abenteuer, Barrierefreiheit (Prüfung „zugang“, 15.11.2026): axe auf Startkarte, Welt,
 * Spielmenü, Gespräch und Laden; das Gespräch hat einen Namen und nimmt den Fokus auf „Weiter“,
 * damit Tastatur und Vorleser das Fenster nicht suchen müssen.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { feldDarunter } from "./abenteuer-karte";
import { starteImBrowser } from "./hilfen";

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
  await page.getByTestId("abenteuer-laden").click();
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
