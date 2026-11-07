/**
 * „Dein nächster Schritt“ (Gamifizierung P1): Karte oben im Buch, Knopf führt zum Ziel,
 * Alternativen, „Nicht jetzt“ bis morgen; seit 7.11.2026 das „Muster aus deinen Partien“ (Konzept
 * „Fehler mit Buchbezug“ 4.3).
 */
import { expect, test } from "@playwright/test";
import { eintrag, spielePartienEin } from "./auswertungpartie";
import { starteImBrowser } from "./hilfen";

test("Karte „Heute“: Neue fangen bei Abb. 0.1 an, noch ohne Tagesaufgabe (Niveau, 0.3.43)", async ({
  page,
}) => {
  await starteImBrowser(page);
  const karte = page.getByTestId("heute");
  await expect(karte.getByRole("heading", { name: "Heute" })).toBeVisible();
  const erster = karte.getByTestId("heute-vorschlag");
  await expect(erster).toHaveAccessibleName(/^Anfangen: Fang vorn an: Kapitel 0/);
  await expect(erster).toContainText("Kapitel 0 · Abb. 0.1");
  // Die Tagesaufgabe (Taktik) kommt erst nach Kapitel 0; das Kreuz steht neben der Kachel.
  await expect(karte.getByTestId("heute-alternative-tagesaufgabe")).toHaveCount(0);
  await expect(karte.locator(".heute-vorschlaege-allein")).toBeVisible();
  await erster.click();
  await expect(page.getByRole("heading", { name: "Abb. 0.1" })).toBeVisible();
});

test("„Nicht jetzt“ blendet die Vorschläge bis morgen aus", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 9, 31, 10) });
  await starteImBrowser(page);
  await page.getByTestId("heute").getByRole("button", { name: "Nicht jetzt" }).click();
  // Ohne Lerntag hat die Woche noch nichts zu zeigen: Die ganze Karte verschwindet.
  await expect(page.getByTestId("heute")).toBeHidden();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(page.getByTestId("heute")).toBeHidden();
  await page.clock.setSystemTime(new Date(2026, 10, 1, 9));
  await page.reload();
  await expect(page.getByTestId("heute-vorschlag")).toBeVisible();
});

/** Version der Regeln der Kürzel (spiel/buchkuerzel.ts, BUCHBEZUG_REGELN). */
const REGELN = 1;

/** Fünf ausgewertete Partien, in dreien blieb eine Drohung stehen (W3). */
function partienMitMuster() {
  const ANZAHL = 5;
  const MIT_W3 = 3;
  return Array.from({ length: ANZAHL }, (_, i) => {
    const e = eintrag();
    const zuege = i < MIT_W3 ? [{ index: 22, klasse: "patzer", kuerzel: ["W3"] }] : [];
    return {
      ...e,
      partie: { ...e.partie, id: `muster-${i}`, begonnen: `2026-11-0${ANZAHL - i}T10:00:00.000Z` },
      buchbezug: { regeln: REGELN, zuege },
    };
  });
}

test("Muster aus deinen Partien: Kachel mit Kategorie, Knopf öffnet den Trainer", async ({
  page,
}) => {
  await starteImBrowser(page);
  await spielePartienEin(page, partienMitMuster());
  const karte = page.getByTestId("heute");
  const kachel = karte.getByTestId("heute-alternative-muster");
  await expect(kachel).toContainText("Drohung stehen gelassen");
  await expect(kachel).toContainText("3 von 5 Partien · Kapitel 1");
  await kachel.click();
  await expect(page.getByRole("heading", { name: "Schach-Röntgen-Trainer" })).toBeVisible();
});
