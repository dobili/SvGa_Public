/**
 * Oberflächentests der Rivalen (Gamifizierung P8): Karte „Dein Rivale“ im Buch mit Spruch und
 * Bilanz, „Revanche“ belegt „Spielen“ vor, nach der Partie steht die neue Bilanz; Feier nach einem
 * gewonnenen Duell; „Anderer Rivale“ höchstens einmal am Tag.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

/** Testdaten: Rivale Tom (Angreifer, Stufe 1), Bilanz 1 : 2; optional ein gestern besiegter Rivale. */
interface Rivalendaten {
  rivale: { kennung: string; seit: string };
  duelle: Record<string, { siege: number; remis: number; niederlagen: number; zuletzt: string }>;
  verdient: Record<string, string>;
}

const TOM: Rivalendaten = {
  rivale: { kennung: "tom", seit: "2026-10-30T10:00:00.000Z" },
  duelle: { tom: { siege: 1, remis: 0, niederlagen: 2, zuletzt: "2026-10-30T10:00:00.000Z" } },
  verdient: {},
};

/** Blendet die Karten mit kleinerem Rang aus (nächster Schritt heute, Wochenziel diese Woche). */
async function nurRivalenkarte(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const tag = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const heute = new Date();
    const montag = new Date(heute);
    montag.setDate(heute.getDate() - ((heute.getDay() + 6) % 7));
    window.localStorage.setItem("svga.naechsterSchrittAus", tag(heute));
    window.localStorage.setItem("svga.wochenzielSpaeter", tag(montag));
  });
}

/** Schreibt die Felder in den gespeicherten Stand; false, solange die App ihn nicht gespeichert hat. */
function schreibeRivalen(felder: Rivalendaten): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const stand = lesen.result as Record<string, unknown> | undefined;
        if (!stand?.spiel) {
          db.close();
          fertig(false);
          return;
        }
        const schreiben = bereich.put({ ...stand, ...felder }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

async function spieleEin(page: Page, felder: Rivalendaten): Promise<void> {
  await expect.poll(() => page.evaluate(schreibeRivalen, felder)).toBe(true);
  await page.reload();
}

test("Rivalenkarte: Spruch, Bilanz, Revanche gegen Tom, danach neue Bilanz", async ({ page }) => {
  await nurRivalenkarte(page);
  await starteImBrowser(page);
  await spieleEin(page, TOM);
  const karte = page.getByTestId("rivalenkarte");
  await expect(karte.getByRole("heading", { name: "Dein Rivale: Tom" })).toBeVisible();
  await expect(karte.getByTestId("rivale-bilanz")).toHaveText("Euer Duell: 1 : 2");
  await expect(karte.getByTestId("rivale-spruch")).toHaveText(
    "„Ich greife an, du verteidigst. Bereit?“",
  );
  await page.screenshot({ path: "test-results/bilder/rivalenkarte.png", fullPage: true });
  await karte.getByRole("button", { name: "Revanche" }).click();
  await expect(page.getByTestId("spielen")).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /Gewertete Partie/ })).toBeChecked();
  await expect(page.getByTestId("spielen")).toContainText("Tom");
  await page.getByRole("button", { name: "Partie beginnen" }).click();
  await page.getByRole("button", { name: "Aufgeben" }).click();
  await page.getByRole("button", { name: "Ja, aufgeben" }).click();
  await expect(page.getByTestId("partieende")).toContainText("Du hast aufgegeben.");
  await page.getByRole("navigation").getByRole("button", { name: "Buch" }).click();
  await expect(karte.getByTestId("rivale-bilanz")).toHaveText("Euer Duell: 1 : 3");
  await expect(karte.getByTestId("rivale-spruch")).toHaveText(
    "„Revanche? Ich greife wieder am Königsflügel an.“",
  );
});

test("Feier nach gewonnenem Duell, „Anderer Rivale“ einmal am Tag", async ({ page }) => {
  await nurRivalenkarte(page);
  await starteImBrowser(page);
  const gestern = new Date(Date.now() - 86_400_000).toISOString();
  await spieleEin(page, {
    ...TOM,
    duelle: { ...TOM.duelle, lotte: { siege: 1, remis: 0, niederlagen: 0, zuletzt: gestern } },
    verdient: { "rivale:lotte": gestern },
  });
  const feier = page.getByTestId("rivale-feier");
  await expect(feier).toContainText("Duell gewonnen!");
  await expect(feier).toContainText(
    "Lotte gratuliert: „Gut gespielt! Der Bauer war wohl doch vergiftet.“",
  );
  await expect(feier).toContainText("Dein neuer Rivale: Tom.");
  await feier.getByRole("button", { name: "Weiter" }).click();
  await expect(feier).toBeHidden();
  const karte = page.getByTestId("rivalenkarte");
  await karte.getByRole("button", { name: "Anderer Rivale" }).click();
  await expect(karte.getByRole("heading", { name: "Dein Rivale: Tom" })).toBeHidden();
  await expect(karte.getByRole("button", { name: "Anderer Rivale" })).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("rivale-feier")).toHaveCount(0);
  await expect(
    page.getByTestId("rivalenkarte").getByRole("button", { name: "Anderer Rivale" }),
  ).toHaveCount(0);
});
