/**
 * Schach-Abenteuer, Kiosk im Park (Schritt 12, docs/spiel/08 G1 bis G6): Ein Spielstand mit 50
 * Münzen steht vor Patels Kiosk; der Dialog öffnet den Laden, „Zweite Chance“ kostet 20, danach ist
 * Flüstern zu teuer, die Münzen oben rechts zeigen den neuen Stand.
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

/** Spielstand im Park, eine Kachel unter dem Kiosk (16,3), Blick nach oben. */
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
  position: { karte: "mapleFalls.park", x: 16, y: 4, richtung: "oben" },
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

test("Patels Kiosk: Dialog öffnet den Laden, Kauf zieht Münzen ab", async ({ page }) => {
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId("abenteuer-muenzen")).toHaveText("50 Münzen", { timeout: 30000 });
  const aktion = page.getByTestId("abenteuer-aktion");
  await expect(aktion).toBeVisible({ timeout: 10000 });
  await aktion.click();
  // Dialog durchblättern, bis der Laden erscheint.
  const laden = page.getByRole("dialog", { name: "Patels Kiosk" });
  for (let i = 0; i < 20 && !(await laden.isVisible()); i++) {
    const weiter = page.locator(".abenteuer-dialog-weiter");
    const wahl = page.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else if (await weiter.isVisible()) await weiter.click();
    else await page.waitForTimeout(100);
  }
  await expect(laden).toBeVisible();
  await expect(page.getByTestId("abenteuer-laden-muenzen")).toHaveText("Deine Münzen: 50");
  await laden.getByRole("button", { name: /Zweite Chance/ }).click();
  await expect(page.getByTestId("abenteuer-laden-muenzen")).toHaveText("Deine Münzen: 30");
  // Flüstern kostet 40: jetzt zu teuer.
  await expect(laden.getByRole("button", { name: /Flüstern/ })).toBeDisabled();
  await laden.getByRole("button", { name: "Fertig" }).click();
  await expect(page.getByTestId("abenteuer-muenzen")).toHaveText("30 Münzen");
});

test("Erinnerung London 1851: Sepia, kein Tagebuch, keine Münzen", async ({ page }) => {
  const stand = {
    ...STAND,
    position: { karte: "erinnerungLondon.strand", x: 2, y: 10, richtung: "rechts" },
  };
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, stand)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await page.getByTestId("abenteuer-laden").click();
  const welt = page.getByTestId("abenteuer-welt");
  await expect(welt).toBeVisible({ timeout: 30000 });
  await expect(page.locator(".abenteuer-welt canvas")).toBeVisible({ timeout: 30000 });
  await expect(welt).toHaveClass(/abenteuer-welt-erinnerung/);
  await expect(page.getByTestId("abenteuer-tagebuchknopf")).toHaveCount(0);
  await expect(page.getByTestId("abenteuer-muenzen")).toHaveCount(0);
});
