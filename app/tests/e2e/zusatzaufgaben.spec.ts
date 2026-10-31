/**
 * Oberflächentest der Zusatzaufgaben im Taktiktrainer (Paket 8): Wahl „Aus dem Buch“ |
 * „Zusatzaufgaben (Lichess)“, Kennzeichnung als Zusatzinhalt, Thema und Stufe, vorgespielter
 * Gegnerzug, Lösung zeigen und die Wiederholung einer falsch gelösten Zusatzaufgabe.
 */
import { expect, test } from "@playwright/test";
import { oeffneTrainer, starteImBrowser, waehleInZeile } from "./hilfen";

test("Taktiktrainer: Zusatzaufgaben wählen, lösen lassen und wiederholen", async ({ page }) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneTrainer(page, "taktik");
  const wahl = page.getByTestId("taktik-wahl");
  const quelle = wahl.getByTestId("taktik-quelle");
  // Vorgabe wie bisher: Aufgaben aus dem Buch.
  await expect(quelle).toContainText("Aus dem Buch");
  await waehleInZeile(page, "taktik-quelle", "Zusätzlich Lichess");
  await expect(page.getByTestId("taktik-quellenhinweis")).toContainText(
    "Zusatzinhalt (nicht aus dem Buch), Quelle: Lichess-Puzzle-Datenbank (CC0)",
  );
  await waehleInZeile(page, "zeile-motiv", /^Matt in einem Zug/);
  await waehleInZeile(page, "zeile-stufe", "Stufe 1");
  await page.getByTestId("taktik-start-runde").click();
  const runde = page.getByTestId("trainerrunde");
  await expect(runde).toContainText("Aufgabe 1 von 8");
  await expect(page.getByTestId("zusatz-herkunft")).toContainText(
    "Zusatzaufgabe (nicht aus dem Buch) · Lichess (CC0)",
  );
  await expect(runde).toContainText("setzt matt.");
  await runde.getByRole("button", { name: "Hinweis 1" }).click();
  await runde.getByRole("button", { name: "Hinweis 2" }).click();
  await expect(page.getByTestId("taktik-motiv")).toContainText("Matt in einem Zug");
  await runde.getByRole("button", { name: "Lösung zeigen" }).click();
  await expect(runde).toContainText("Lösung:");
  await page.screenshot({ path: "test-results/bilder/trainer-zusatzaufgaben.png", fullPage: true });
  // Die falsch gelöste Zusatzaufgabe kommt nach zwei Tagen in die Wiederholung.
  await page.clock.fastForward("48:00:00");
  await oeffneTrainer(page, "taktik");
  await page.getByTestId("trainer-wiederholung").click();
  await expect(page.getByTestId("trainerrunde")).toContainText("Aufgabe 1 von 1");
  await expect(page.getByTestId("zusatz-herkunft")).toBeVisible();
});
