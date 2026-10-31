/**
 * Oberflächentests des Teilens (Gamifizierung P9): Ein Abzeichen aus der Probe lässt sich aus der
 * Meldung als PNG teilen (ohne Teilen-Menü: Herunterladen), und der Link „#aufgabe-taktik-…“
 * öffnet eine Lichess-Aufgabe als Herausforderung, die sich weitergeben lässt. Ein Link auf eine
 * Buchaufgabe öffnet nichts (E7).
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

test("Abzeichen teilen: die Meldung bietet ein PNG zum Herunterladen an", async ({ page }) => {
  await starteImBrowser(page, { abzeichenMeldung: true });
  // Ohne Teilen-Menü (wie am Rechner) lädt die App das Bild herunter.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { value: undefined, configurable: true });
  });
  await page.goto("/app/#aufgaben");
  await page.reload();
  const probe = page.getByTestId("abzeichen-probe");
  await probe.locator("summary").click();
  await probe.getByRole("button", { name: "Erster Sieg: verdienen" }).click();
  const meldung = page.getByTestId("abzeichenmeldung");
  const herunterladen = page.waitForEvent("download");
  await meldung.getByRole("button", { name: "Teilen: Erster Sieg" }).click();
  const datei = await herunterladen;
  expect(datei.suggestedFilename()).toBe("schach-von-grund-auf-abzeichen-erstersieg.png");
  await datei.saveAs("test-results/bilder/teilen-abzeichen.png");
  await expect(meldung.getByText("Bild gespeichert (Downloads).")).toBeVisible();
  await meldung.getByRole("button", { name: "Weiter" }).click();
  await probe.getByRole("button", { name: "Probe beenden" }).click();
});

test("Herausforderung: der Link öffnet die Lichess-Aufgabe, danach lässt sie sich teilen", async ({
  page,
}) => {
  await starteImBrowser(page);
  // Das Teilen-Menü des Geräts als Attrappe: Sie merkt sich, was geteilt wurde.
  await page.addInitScript(() => {
    const fenster = window as unknown as { geteilt: ShareData[] };
    fenster.geteilt = [];
    Object.defineProperty(navigator, "share", {
      value: (daten: ShareData) => {
        fenster.geteilt.push(daten);
        return Promise.resolve();
      },
      configurable: true,
    });
  });
  await page.goto("/app/#aufgabe-taktik-l-1Vybh");
  await page.reload();
  const ansicht = page.getByTestId("herausforderung");
  await expect(ansicht.getByRole("heading", { name: "Herausforderung" })).toBeVisible();
  await expect(ansicht.getByText("Jemand hat dir diese Aufgabe geschickt.")).toBeVisible();
  await ansicht.getByRole("button", { name: "Lösung zeigen" }).click();
  await ansicht.getByTestId("herausforderung-teilen").getByRole("button").click();
  const geteilt = await page.evaluate(
    () => (window as unknown as { geteilt: ShareData[] }).geteilt,
  );
  expect(geteilt).toEqual([
    {
      text: "Schaffst du das? Weiß zieht und gewinnt.",
      url: "https://schach-von-grund-auf.com/app/#aufgabe-taktik-l-1Vybh",
    },
  ]);
  await page.screenshot({ path: "test-results/bilder/teilen-herausforderung.png" });
  // Ein Link auf eine Aufgabe aus dem Buch öffnet nichts.
  await page.goto("/app/#aufgabe-taktik-b-7.6");
  await page.reload();
  await expect(page.getByTestId("herausforderung")).toHaveCount(0);
});
