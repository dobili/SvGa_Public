/**
 * Oberflächentests des Serienmodus „ohne Fehler“ im Taktiktrainer (Gamifizierung P5): Start aus
 * der Buchwahl, Stand, Ende beim ersten Fehler, neue Serie; Rekordzeile in der Tafel mit
 * „Versuchen“ zum Taktiktrainer.
 */
import { expect, test } from "@playwright/test";
import { oeffneProfil, oeffneTrainer, starteImBrowser } from "./hilfen";

test("Serie ohne Fehler: ein Fehler beendet die Serie, „Neue Serie“ beginnt von vorn", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "taktik");
  const wahl = page.getByTestId("taktik-wahl");
  await expect(wahl).toContainText("Der erste Fehler beendet die Serie");
  await wahl.getByTestId("taktik-start-serie").click();
  const serie = page.getByTestId("taktik-serie");
  await expect(serie.getByTestId("serie-stand")).toHaveText("Serie: 0 in Folge");
  await expect(serie).toContainText("Stufe 1");
  await serie.getByRole("button", { name: "Lösung zeigen" }).click();
  const ergebnis = serie.getByTestId("serie-ergebnis");
  await expect(ergebnis).toContainText("Serie vorbei: Diese Aufgabe ging daneben.");
  await expect(ergebnis.getByTestId("serie-zahl")).toHaveText(
    "Diesmal keine in Folge. Gleich noch einmal?",
  );
  await expect(ergebnis.getByTestId("neuer-rekord")).toHaveCount(0);
  await expect(serie).toContainText("Lösung:");
  await page.screenshot({ path: "test-results/bilder/taktikserie.png", fullPage: true });
  await ergebnis.getByRole("button", { name: "Neue Serie" }).click();
  await expect(serie.getByTestId("serie-ergebnis")).toHaveCount(0);
  await expect(serie.getByRole("button", { name: "Lösung zeigen" })).toBeVisible();
  await serie.getByRole("button", { name: "Lösung zeigen" }).click();
  await serie.getByRole("button", { name: "Andere Übung" }).click();
  await expect(page.getByTestId("taktik-wahl")).toBeVisible();
});

test("Rekordtafel: Zeile „Taktikserie ohne Fehler“ führt zum Taktiktrainer", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneProfil(page);
  // Seit dem Profil neu (31.10.2026): beim frischen Start unter „Noch 7 weitere Rekorde“.
  await page.getByTestId("rekord-weitere").locator("summary").click();
  const zeile = page.getByTestId("rekord-taktikSerie");
  await expect(zeile).toContainText("Taktikserie ohne Fehler");
  await expect(zeile).toContainText("ohne Fehler hintereinander?");
  await zeile.getByRole("button", { name: "Los: Taktikserie ohne Fehler" }).click();
  await expect(page.getByTestId("taktik-start-serie")).toBeVisible();
});
