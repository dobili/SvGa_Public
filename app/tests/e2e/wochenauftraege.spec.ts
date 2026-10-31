/**
 * Oberflächentests der Wochenaufträge (Gamifizierung P6): Der Auftrag „3 neue Abbildungen
 * ansehen“ zeigt den Stand, sein Knopf öffnet die Abbildung, nach drei Abbildungen steht der
 * Haken mit „+15 Erfahrung“; „Tauschen“ gibt einmal einen anderen Auftrag. Die Uhr steht auf
 * Donnerstag, 29.10.2026; die Aufträge der Woche werden fest eingespielt, damit der Test nicht
 * vom Zufall der Woche abhängt.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

const JETZT = new Date(2026, 9, 29, 12);
/** Eine Abbildung zählt erst nach 30 Sekunden am Stück (0.2.27). */
const VERWEILZEIT_MS = 30_000;

const WOCHEN = {
  ziel: 3,
  auftraege: {
    woche: "2026-10-26",
    liste: [
      { art: "abbildungen", anzahl: 3, wert: "1.1" },
      { art: "partien", anzahl: 2, wert: null },
      { art: "tagesaufgabe", anzahl: 3, wert: null },
    ],
    getauscht: [],
  },
};

/** Schreibt Wochenstand und einen Lerntag in den gespeicherten Stand; false, solange er fehlt. */
function schreibeWoche(wochen: typeof WOCHEN): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const stand = lesen.result as Record<string, unknown> | undefined;
        if (!stand?.aktivitaet) {
          db.close();
          fertig(false);
          return;
        }
        const aktivitaet = { "2026-10-27": { partie: 1 } };
        const schreiben = bereich.put({ ...stand, aktivitaet, wochen }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

async function spieleWocheEin(page: Page): Promise<void> {
  await expect.poll(() => page.evaluate(schreibeWoche, WOCHEN)).toBe(true);
  await page.reload();
}

test("Wochenauftrag: drei Abbildungen ansehen, dann Haken; Tauschen einmal", async ({ page }) => {
  await page.clock.install({ time: JETZT });
  await starteImBrowser(page);
  await spieleWocheEin(page);
  const auftraege = page.getByTestId("wochenauftraege");
  const abbildungen = auftraege.getByTestId("auftrag-abbildungen");
  await expect(abbildungen).toContainText("Sieh dir 3 neue Abbildungen an, weiter ab Abb. 1.1.");
  await expect(abbildungen.getByTestId("auftrag-stand")).toHaveText("0 von 3");
  await expect(auftraege.getByTestId("auftrag-partien").getByTestId("auftrag-stand")).toHaveText(
    "1 von 2",
  );

  // Tauschen: einmal, danach ist der Knopf an dieser Stelle weg.
  const tagesaufgabe = auftraege.getByTestId("auftrag-tagesaufgabe");
  await tagesaufgabe.getByRole("button", { name: /^Auftrag tauschen/ }).click();
  await expect(tagesaufgabe).toHaveCount(0);
  await expect(auftraege.getByRole("listitem")).toHaveCount(3);
  await expect(auftraege.getByRole("listitem").nth(2).getByText("Tauschen")).toHaveCount(0);

  await abbildungen.getByRole("button", { name: "Zur Abbildung" }).click();
  await expect(page.getByRole("heading", { name: "Abb. 1.1" })).toBeVisible();
  await page.clock.runFor(VERWEILZEIT_MS);
  for (const nummer of ["1.2", "1.3"]) {
    await page.goBack();
    await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
    await oeffneAbbildung(page, nummer, nummer);
    await page.clock.runFor(VERWEILZEIT_MS);
  }
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(abbildungen).toContainText("Erledigt · +15 Erfahrung");
  await expect(abbildungen.getByRole("button")).toHaveCount(0);
  await page.setViewportSize({ width: 400, height: 900 });
  await page
    .getByTestId("wochenkarte")
    .screenshot({ path: "test-results/bilder/wochenauftraege.png" });
});
