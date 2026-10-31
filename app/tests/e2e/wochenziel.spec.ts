/**
 * Oberflächentests des Wochenziels (Gamifizierung P4) und des Übungsplans (P11): Die Wochenkarte
 * fragt erst nach dem ersten Lerntag, zeigt mit gesetztem Protokoll Ring, Punkte und Bilanz, hält
 * erreichte Wochen fest (ein höheres Ziel nimmt keine weg), und der Übungsplan bietet eine
 * Kalenderdatei an. Die Uhr steht fest auf Donnerstag, 29.10.2026, damit die Woche bekannt ist.
 */
import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { oeffneReiter, starteImBrowser } from "./hilfen";

/** Donnerstag mittag: Montag 26.10. und Dienstag 27.10. sind Lerntage dieser Woche. */
const JETZT = "2026-10-29T12:00:00";
/** Je drei Lerntage in den beiden Wochen davor, dazu zwei in dieser Woche. */
const LERNTAGE = [
  "2026-10-12",
  "2026-10-13",
  "2026-10-14",
  "2026-10-19",
  "2026-10-20",
  "2026-10-21",
  "2026-10-26",
  "2026-10-27",
];

/** Schreibt das Tagesprotokoll in den gespeicherten Stand; false, solange es ihn noch nicht gibt. */
function schreibeProtokoll(tage: readonly string[]): Promise<boolean> {
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
        const aktivitaet = Object.fromEntries(tage.map((tag) => [tag, { abbildung: 1 }]));
        const schreiben = bereich.put({ ...stand, aktivitaet }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

/** Spielt das Protokoll ein und lädt neu. */
async function spieleProtokollEin(page: Page): Promise<void> {
  await expect.poll(() => page.evaluate(schreibeProtokoll, LERNTAGE)).toBe(true);
  await page.reload();
}

test("Wochenziel: Wahl, Tageskette und Bilanz; ein höheres Ziel nimmt keine erreichte Woche weg", async ({
  page,
}) => {
  await page.clock.setFixedTime(JETZT);
  await starteImBrowser(page);
  // Ohne Lerntag fragt die App noch nicht.
  await expect(page.getByTestId("wochenziel-wahl")).toHaveCount(0);
  await spieleProtokollEin(page);
  const karte = page.getByTestId("heute");
  await expect(
    karte.getByRole("group", { name: "Wie oft willst du pro Woche üben?" }),
  ).toBeVisible();
  // Die Erklärung des Lerntags steht hinter „Wochenziel?“.
  await karte.getByRole("button", { name: "Wochenziel?" }).click();
  await expect(karte.getByText("Als Lerntag zählt ein Tag", { exact: false })).toBeVisible();
  await karte.getByRole("button", { name: "3 Tage" }).click();
  await expect(karte.getByTestId("wochenziel-stand")).toHaveText("2 von 3 Tagen");
  await expect(karte.getByRole("listitem", { name: "Dienstag: gelernt" })).toBeVisible();
  await expect(karte.getByRole("listitem", { name: "Mittwoch: noch nicht" })).toBeVisible();
  await expect(karte.getByTestId("wochenziel-bilanz")).toHaveText(
    "2 Wochen geschafft · beste Folge 2",
  );
  await page.setViewportSize({ width: 400, height: 900 });
  await karte.screenshot({ path: "test-results/bilder/heute-wochenziel.png" });

  // Ziel mitten in der Woche gesenkt: gilt sofort, die Woche ist erreicht.
  await karte.getByRole("button", { name: "Ziel ändern" }).click();
  await karte.getByRole("button", { name: "2 Tage" }).click();
  await expect(karte.getByText("Wochenziel geschafft!")).toBeVisible();
  await expect(karte.getByTestId("wochenziel-bilanz")).toHaveText(
    "3 Wochen geschafft · beste Folge 3",
  );
  // Wieder erhöht: Die erreichten Wochen bleiben (nichts verfällt).
  await karte.getByRole("button", { name: "Ziel ändern" }).click();
  await karte.getByRole("button", { name: "5 Tage" }).click();
  await expect(karte.getByTestId("wochenziel-stand")).toHaveText("2 von 5 Tagen");
  await page.reload();
  await expect(karte.getByTestId("wochenziel-bilanz")).toHaveText(
    "3 Wochen geschafft · beste Folge 3",
  );
});

test("Wochenziel: „Später“ blendet die Frage für diese Woche aus", async ({ page }) => {
  await page.clock.setFixedTime(JETZT);
  await starteImBrowser(page);
  await spieleProtokollEin(page);
  const karte = page.getByTestId("heute");
  await karte.getByRole("button", { name: "Wochenziel?" }).click();
  await karte.getByRole("button", { name: "Später" }).click();
  // Die Frage und die Abschnitte der Woche verschwinden; die Vorschläge bleiben.
  await expect(karte.getByTestId("wochenziel-wahl")).toHaveCount(0);
  await expect(karte.getByTestId("wochenreiter")).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(page.getByTestId("wochenziel-wahl")).toHaveCount(0);
});

test("Übungsplan: Tage und Uhrzeit wählen, heute ist Übungstag, Kalenderdatei wird angeboten", async ({
  page,
}) => {
  await page.clock.setFixedTime(JETZT);
  await starteImBrowser(page);
  await spieleProtokollEin(page);
  const karte = page.getByTestId("heute");
  await karte.getByRole("button", { name: "3 Tage" }).click();
  await oeffneReiter(page, "uebungsplan");
  await karte.getByRole("button", { name: "Übungszeit planen" }).click();
  const wahl = karte.getByTestId("planwahl");
  await expect(wahl.getByRole("button", { name: "Plan speichern" })).toBeDisabled();
  await wahl.getByRole("button", { name: "Montag" }).click();
  await wahl.getByRole("button", { name: "Donnerstag" }).click();
  await expect(wahl.getByRole("button", { name: "Donnerstag" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await wahl.getByLabel("Uhrzeit").fill("07:30");
  await wahl.getByLabel("Wo oder nach was? (freiwillig)").fill("nach dem Frühstück, am Tisch");
  await wahl.getByRole("button", { name: "Plan speichern" }).click();
  const plan = karte.getByTestId("uebungsplan");
  await expect(plan.getByText("Dein Plan: Mo, Do um 07:30")).toBeVisible();
  await expect(plan.getByText("Heute ist dein Übungstag.")).toBeVisible();

  const herunterladen = page.waitForEvent("download");
  await plan.getByRole("button", { name: "In meinen Kalender" }).click();
  const datei = await herunterladen;
  expect(datei.suggestedFilename()).toBe("schach-ueben.ics");
  const inhalt = await readFile(await datei.path(), "utf8");
  expect(inhalt).toContain("RRULE:FREQ=WEEKLY;BYDAY=MO,TH\r\n");
  expect(inhalt).toContain("DTSTART:20261029T073000\r\n");
  expect(inhalt.replace(/\r\n /g, "")).toContain("nach dem Frühstück\\, am Tisch");
  await expect(plan.getByRole("status")).toContainText("schach-ueben.ics");
});
