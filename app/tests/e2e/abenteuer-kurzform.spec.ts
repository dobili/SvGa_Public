/**
 * Schach-Abenteuer, kurze Partieformen (Regelwerk R13 bis R13c, Wunsch des Autors 17.11.2026):
 * Das Stellungsduell mit Skater Jo zeigt den erzählten Einstieg, während der Partie das Ziel mit
 * den restlichen Zügen und nach dem Ende den Satz je Ausgang.
 */
import { expect, test } from "@playwright/test";
import { EINLEITUNG_GESEHEN } from "./abenteuer-affe";
import { feldDarunter } from "./abenteuer-karte";
import { starteImBrowser } from "./hilfen";
import { ladeAbenteuerpaket } from "./abenteuer-paket";

/** Spielstand im Park, eine Kachel unter Skater Jo (Feld aus der Karte), Blick nach oben. */
const STAND = {
  version: 1,
  begonnen: "2026-11-08T05:00:00.000Z",
  eingangswertung: 600,
  eingangPartien: 0,
  wertung: 600,
  appWertungZuletzt: null,
  wertungPartien: 0,
  held: { name: "Kim", figur: "held-0" },
  handlung: { akt: 1, szene: "akt1.start", liga: null, durchlauf: 1 },
  position: {
    karte: "mapleFalls.park",
    ...feldDarunter("maple-falls-park", "skaterJo"),
    richtung: "oben",
  },
  besuchteOrte: ["mapleFalls"],
  karten: [],
  dialogvariablen: EINLEITUNG_GESEHEN,
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

test("Stellungsduell mit Einstieg, Ziel und Ausklang", async ({ page }) => {
  await starteImBrowser(page);
  await expect.poll(() => page.evaluate(schreibeStand, STAND)).toBe(true);
  await page.reload();
  await page.goto("/app/#abenteuer");
  await ladeAbenteuerpaket(page);
  await expect(page.getByTestId("abenteuer-welt")).toBeVisible({ timeout: 30000 });
  await page.getByTestId("abenteuer-aktion").click();
  const deckwahl = page.getByTestId("abenteuer-deckwahl");
  for (let i = 0; i < 20 && !(await deckwahl.isVisible()); i++) {
    const weiter = page.locator(".abenteuer-dialog-weiter");
    const wahl = page.locator(".abenteuer-dialog-wahlen button").first();
    if (await wahl.isVisible()) await wahl.click();
    else if (await weiter.isVisible()) await weiter.click();
    else await page.waitForTimeout(100);
  }
  await page.getByTestId("abenteuer-deck-los").click();
  // Einstieg vor dem ersten Zug, das Ziel mit zehn Zügen bis zur Wertung.
  const einstieg = page.getByTestId("abenteuer-erzaehlung");
  await expect(einstieg).toContainText("Zehn Züge", { timeout: 30000 });
  await expect(page.getByTestId("abenteuer-kurzform")).toContainText("Noch 10 Züge");
  await page.getByTestId("abenteuer-erzaehlung-weiter").click();
  await expect(einstieg).toBeHidden();
  // Ende über die Testhilfe: Der Ausklang nennt Jo.
  await page.getByTestId("abenteuer-test-sieg").click();
  await expect(page.getByTestId("abenteuer-nachwort")).toContainText("Jo springt aufs Board");
  await expect(page.getByTestId("abenteuer-kurzform")).toBeHidden();
});
