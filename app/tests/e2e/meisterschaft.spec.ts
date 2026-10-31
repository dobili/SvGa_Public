/**
 * Oberflächentests der Meisterschaft je Thema (Gamifizierung P3): Meldung „Fesselung: Bronze!“
 * am Rundenende mit vorbereitetem Antwortprotokoll, Profilkarte „Deine Themen“ mit Fortschritt,
 * Bedingung, „Üben“ und Teilen; Probe auf der Aufgabenseite schaltet den Titel „Taktiker“ frei.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneProfil, oeffneTrainer, starteImBrowser } from "./hilfen";

/** Aufgaben je Runde im Trainer „Falle oder Köder“. */
const FALLEN_JE_RUNDE = 8;

/** Schreibt Themen ins Antwortprotokoll; false, solange es den gespeicherten Stand noch nicht gibt. */
function schreibeThemen(themen: Record<string, unknown>): Promise<boolean> {
  return new Promise<boolean>((fertig, fehler) => {
    const anfrage = indexedDB.open("schach-von-grund-auf");
    anfrage.onerror = () => fehler(anfrage.error);
    anfrage.onsuccess = () => {
      const db = anfrage.result;
      const bereich = db.transaction("nutzerdaten", "readwrite").objectStore("nutzerdaten");
      const lesen = bereich.get("aktuell");
      lesen.onsuccess = () => {
        const stand = lesen.result as Record<string, unknown> | undefined;
        if (!stand?.themen) {
          db.close();
          fertig(false);
          return;
        }
        const schreiben = bereich.put({ ...stand, themen }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/** Fesselung mit 5 richtigen (Bronze erreicht, noch nicht gefeiert). */
const PROTOKOLL = {
  "taktik:fesselung": {
    richtig: 5,
    falsch: 0,
    letzte: "rrrrr",
    tage: ["2026-10-30"],
    zuletzt: "2026-10-30T10:00:00.000Z",
  },
};

async function spieleThemenEin(page: Page): Promise<void> {
  await expect.poll(() => page.evaluate(schreibeThemen, PROTOKOLL)).toBe(true);
  await page.reload();
}

test("Rundenende meldet die neue Stufe, die Profilkarte zeigt Medaille und Fortschritt", async ({
  page,
}) => {
  await starteImBrowser(page);
  await spieleThemenEin(page);
  await oeffneTrainer(page, "falle");
  await page.getByTestId("falle-wahl").getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  for (let i = 0; i < FALLEN_JE_RUNDE; i += 1) {
    await runde.getByRole("button", { name: "Nicht nehmen" }).click();
    const letzte = i === FALLEN_JE_RUNDE - 1;
    await runde.getByRole("button", { name: letzte ? "Runde auswerten" : "Weiter" }).click();
  }
  const meldung = page.getByTestId("runde-ende").getByTestId("meisterschaft-meldung");
  await expect(meldung).toContainText("Fesselung: Bronze!");
  await expect(meldung.getByRole("button", { name: /Teilen/ }).first()).toBeVisible();

  await oeffneProfil(page);
  const karte = page.getByTestId("themenkarte");
  await expect(karte.getByRole("heading", { name: "Deine Themen" })).toBeVisible();
  const fesselung = karte.getByTestId("thema-taktik:fesselung");
  await expect(fesselung).toContainText("5 von 15 bis Silber");
  await expect(fesselung.locator("[data-stufe]")).toHaveAttribute("data-stufe", "bronze");
  await expect(karte.getByTestId("thema-falle")).toBeVisible();
  await fesselung.getByRole("button", { name: /Fesselung/ }).click();
  await expect(fesselung).toContainText("Silber: 15 richtige Antworten");
  await karte.scrollIntoViewIfNeeded();
  await karte.screenshot({ path: "test-results/bilder/meisterschaft-karte.png" });
  await fesselung.getByRole("button", { name: "Üben" }).click();
  await expect(page.getByTestId("taktik-wahl").or(page.getByTestId("trainerrunde"))).toBeVisible();
});

test("Probe auf Gold schaltet den Titel „Taktiker“ frei, er steht unter dem Namen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.goto("/app/#aufgaben");
  await page.reload();
  const probe = page.getByTestId("themen-probe");
  await probe.locator("summary").click();
  await probe.getByRole("button", { name: "Fesselung zur Probe auf Silber" }).click();
  for (const name of ["Fesselung", "Spieß", "Doppelschach", "Hinlenkung", "Zwischenzug"])
    await probe.getByRole("button", { name: `${name} zur Probe auf Gold` }).click();
  await page.goto("/app/");
  await page.reload();
  await oeffneProfil(page);
  const karte = page.getByTestId("themenkarte");
  await expect(karte.getByTestId("thema-taktik:fesselung").locator("[data-stufe]")).toHaveAttribute(
    "data-stufe",
    "gold",
  );
  const extras = page.getByTestId("extras");
  await extras.getByRole("tab", { name: "Titel" }).click();
  await extras.getByRole("button", { name: "Titel „Taktiker“: antippen zum Anlegen" }).click();
  await expect(page.getByTestId("profiltitel")).toHaveText("Taktiker");
  await karte.screenshot({ path: "test-results/bilder/meisterschaft-probe.png" });
  await page
    .getByTestId("profilkarte")
    .screenshot({ path: "test-results/bilder/meisterschaft-titel.png" });
  await expect(extras.getByTestId("extra-titel-endspielkenner")).toContainText(
    "3 Themen im Endspieltrainer in Gold",
  );
});
