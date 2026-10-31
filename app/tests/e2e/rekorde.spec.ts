/**
 * Oberflächentests der Rekordtafel (Gamifizierung P5): Meldung „Neuer Rekord“ am Rundenende und
 * nach der Tagesaufgabe, Profilkarte „Deine Rekorde“ (seit dem Profil neu am 31.10.2026 mit
 * Erreichtem, Vorschlägen und „Los“), Übernahme des Merkers der Zeitrunde.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneProfil, oeffneTrainer, starteImBrowser, starteUebung } from "./hilfen";

const feld = (page: Page, name: string) =>
  page.getByRole("button", { name: new RegExp(`^${name}(,|$)`) });

test("Rundenende meldet neue Rekorde, die Tafel im Profil zeigt sie", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "koordinaten");
  await starteUebung(page, "Feld finden");
  const auftrag = page.getByTestId("feld-auftrag");
  for (let i = 0; i < 16; i += 1) {
    await expect(page.getByText(`Aufgabe ${i + 1} von 16`)).toBeVisible();
    const text = (await auftrag.textContent()) ?? "";
    await feld(page, text.replace("Tippe auf ", "").trim()).click();
  }
  const meldung = page.getByTestId("runde-ende").getByTestId("neuer-rekord");
  await expect(meldung).toContainText("Neuer Rekord: 16 richtige Antworten.");
  await expect(meldung).toContainText("Neuer Rekord: 1 Lerntag.");
  await oeffneProfil(page);
  const tafel = page.getByTestId("rekordtafel");
  await expect(tafel).toContainText("Deine Rekorde");
  await expect(tafel.getByTestId("rekord-trainerTag")).toContainText("16 richtige Antworten");
  // Profil neu (31.10.2026): aus Leerstellen werden Vorschläge; „Höchste Wertung“ sagt, was fehlt.
  await expect(tafel.getByTestId("rekord-herausforderung")).toContainText("Noch mehr Rekorde");
  await tafel.getByTestId("rekord-weitere").locator("summary").click();
  await expect(tafel.getByTestId("rekord-wertung")).toContainText("noch 10 Partien");
  await tafel.screenshot({ path: "test-results/bilder/rekordtafel.png" });
  await tafel.getByRole("button", { name: "Los: Taktik auf Zeit" }).click();
  await expect(page.getByRole("button", { name: /Taktik auf Zeit/ })).toBeVisible();
});

test("Tagesaufgabe: erster Tag der Serie als neuer Rekord", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "kurzplaene");
  await page.getByTestId("kurzplan-tag").click();
  const aufgabe = page.getByTestId("tagesaufgabe");
  await aufgabe.getByRole("button", { name: "Hinweis 1" }).click();
  await aufgabe.getByRole("button", { name: "Hinweis 2" }).click();
  await aufgabe.getByRole("button", { name: "Lösung zeigen" }).click();
  await expect(aufgabe.getByTestId("neuer-rekord")).toHaveText("Neuer Rekord: 1 Tag in Folge.");
});

test("Zeitrunde: Bestwert aus dem alten Merker steht als Rekord in Tafel und Zeitrunde", async ({
  page,
}) => {
  // Ein Gerät mit gespeicherten Daten und dem alten Merker: Beim Laden wird er zum Rekord.
  await starteImBrowser(page);
  await expect(page.getByRole("navigation", { name: "Hauptbereiche" })).toBeVisible();
  await page.evaluate(() => window.localStorage.setItem("svga.taktikzeitBeste", "7"));
  await page.reload();
  await oeffneProfil(page);
  await expect(page.getByTestId("rekord-taktikZeit")).toContainText("7 richtig in 3 Minuten");
  await expect(
    page.getByTestId("rekord-taktikZeit").getByRole("button", { name: "Teilen: Taktik auf Zeit" }),
  ).toBeVisible();
  await oeffneTrainer(page, "kurzplaene");
  await page.getByRole("button", { name: /Taktik auf Zeit/ }).click();
  await expect(page.getByTestId("zeit-start")).toContainText("Deine beste Zeitrunde: 7 richtig.");
});
