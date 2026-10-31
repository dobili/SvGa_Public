/**
 * Oberflächentests des Monatsrückblicks (Gamifizierung P12): Mit einem eingespielten Oktober
 * steht am 3. November die Startkarte „Dein Oktober ist fertig“; der Bildschirm zeigt Kalender,
 * Zahlen, Wertung, verdiente Stücke, Rekorde und Themen; nach dem Öffnen ist die Karte weg, das
 * Profil führt unter „Rückblicke“ zum Oktober, und „Rückblick teilen“ bietet ein PNG an. Ein
 * ruhiger Monat mit wenigen Lerntagen bekommt einen freundlichen Satz.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneProfil, starteImBrowser } from "./hilfen";

/** Dienstag, 3. November 2026, mittags: der Oktober ist fertig. */
const JETZT = "2026-11-03T12:00:00";

/** Was in den gespeicherten Stand geschrieben wird. */
interface Einspielung {
  readonly tage: readonly string[];
  readonly mitMehr: boolean;
}

/** Schreibt Oktoberdaten in den gespeicherten Stand; false, solange es ihn noch nicht gibt. */
function schreibeOktober({ tage, mitMehr }: Einspielung): Promise<boolean> {
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
        const aktivitaet = Object.fromEntries(
          tage.map((tag) => [tag, { abbildung: 2, partie: 1, sieg: 1 }]),
        );
        const mehr = mitMehr
          ? {
              verdient: { "abzeichen:erstePartie": "2026-10-12T10:00:00" },
              rekorde: { trainerTag: { wert: 16, datum: "2026-10-13T10:00:00" } },
              themen: {
                "taktik:gabel": {
                  richtig: 9,
                  falsch: 1,
                  letzte: "rrrrrrrrrf",
                  tage: ["2026-10-13"],
                  zuletzt: "2026-10-13T10:00:00",
                },
              },
            }
          : {};
        const schreiben = bereich.put({ ...stand, aktivitaet, ...mehr }, "aktuell");
        schreiben.onsuccess = () => {
          db.close();
          fertig(true);
        };
        schreiben.onerror = () => fehler(schreiben.error);
      };
    };
  });
}

async function spieleEin(page: Page, einspielung: Einspielung): Promise<void> {
  await expect.poll(() => page.evaluate(schreibeOktober, einspielung)).toBe(true);
  await page.reload();
}

const VIELE_TAGE = [
  "2026-10-05",
  "2026-10-06",
  "2026-10-12",
  "2026-10-13",
  "2026-10-20",
  "2026-10-21",
];

test("Startkarte, Bildschirm „Dein Oktober“, Profil und Teilen", async ({ page }) => {
  await page.clock.setFixedTime(JETZT);
  await starteImBrowser(page);
  await spieleEin(page, { tage: VIELE_TAGE, mitMehr: true });
  const karte = page.getByTestId("rueckblick-karte");
  await expect(karte.getByRole("heading", { name: "Dein Oktober ist fertig" })).toBeVisible();
  await karte.getByRole("button", { name: "Ansehen" }).click();

  const rueckblick = page.getByTestId("rueckblick");
  await expect(rueckblick.getByRole("heading", { name: "Dein Oktober" })).toBeVisible();
  await expect(rueckblick.getByTestId("rueckblick-lerntage")).toHaveText(
    "Im Oktober hattest du 6 Lerntage.",
  );
  await expect(rueckblick.getByRole("listitem", { name: "12.: gelernt" })).toBeVisible();
  await expect(rueckblick.getByRole("listitem", { name: "14.: frei" })).toBeVisible();
  const zahlen = rueckblick.getByTestId("rueckblick-zahlen");
  await expect(zahlen).toContainText("12 Abbildungen angesehen");
  await expect(zahlen).toContainText("6 Partien gespielt");
  await expect(zahlen).toContainText("6 Siege");
  await expect(rueckblick.getByTestId("rueckblick-stuecke")).toContainText("Erste Partie");
  await expect(rueckblick.getByTestId("rueckblick-rekorde")).toContainText("16");
  await expect(rueckblick.getByTestId("rueckblick-stark")).toContainText("9 von 10 richtig");
  await expect(rueckblick.getByTestId("rueckblick-naechster")).toContainText(
    "Dein nächster Schritt für November",
  );
  await page.setViewportSize({ width: 400, height: 1400 });
  await page.screenshot({ path: "test-results/bilder/rueckblick.png", fullPage: true });

  // Ohne Teilen-Menü (wie am Rechner) lädt die App das Bild herunter.
  await page.evaluate(() =>
    Object.defineProperty(navigator, "canShare", { value: undefined, configurable: true }),
  );
  const herunterladen = page.waitForEvent("download");
  await rueckblick.getByRole("button", { name: "Rückblick teilen" }).click();
  const datei = await herunterladen;
  expect(datei.suggestedFilename()).toBe("schach-von-grund-auf-rueckblick-2026-10.png");
  await datei.saveAs("test-results/bilder/rueckblick-teilen.png");

  // Einmal geöffnet, steht die Karte nicht mehr im Buch; das Profil führt weiter zum Oktober.
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(page.getByTestId("rueckblick-karte")).toHaveCount(0);
  await oeffneProfil(page);
  const profil = page.getByTestId("rueckblicke");
  await profil.getByRole("button", { name: "Oktober 2026" }).click();
  await expect(page.getByRole("heading", { name: "Dein Oktober" })).toBeVisible();
});

test("Wenige Lerntage: freundlicher Satz, nach dem 7. keine Karte", async ({ page }) => {
  await page.clock.setFixedTime(JETZT);
  await starteImBrowser(page);
  await spieleEin(page, { tage: ["2026-10-12", "2026-10-20", "2026-10-28"], mitMehr: false });
  await page.getByTestId("rueckblick-karte").getByRole("button", { name: "Ansehen" }).click();
  await expect(page.getByTestId("rueckblick-lerntage")).toHaveText(
    "Im Oktober hattest du 3 Lerntage. Jeder zählt.",
  );
  await expect(page.getByTestId("rueckblick-stuecke")).toHaveCount(0);
  await page.clock.setFixedTime("2026-11-08T12:00:00");
  await page.evaluate(() => window.localStorage.removeItem("svga.rueckblickGesehen"));
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(page.getByTestId("rueckblick-karte")).toHaveCount(0);
});
