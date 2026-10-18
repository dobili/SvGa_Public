/**
 * Oberflächentests der Aufgabenseite des Autors (seit 0.2.74): drei Sekunden auf dem Zahnrad
 * öffnen sie, ein kurzer Tipp nicht; Haken und Notiz landen im Text für den Chat; ein Link
 * öffnet seinen Bildschirm, „Zurück“ führt mit erhaltenem Stand zurück. Die Punkte ändern sich
 * mit jeder Version der Aufgabendatei; der Test nimmt deshalb den ersten Punkt, den es gibt.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

const zahnrad = (page: Page) =>
  page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Einstellungen", exact: true });

/** Die Adresse /app/#aufgaben öffnet die Seite beim Start der App (am Rechner). */
async function oeffneUeberAdresse(page: Page): Promise<void> {
  await page.goto("/app/#aufgaben");
  await page.reload();
}

test("Langer Druck aufs Zahnrad öffnet die Aufgabenseite, ein kurzer Tipp die Einstellungen", async ({
  page,
}) => {
  await page.clock.install();
  await starteImBrowser(page);
  await zahnrad(page).click();
  await expect(page.getByTestId("autor-aufgaben")).toHaveCount(0);
  await zahnrad(page).hover();
  await page.mouse.down();
  await page.clock.runFor(3100);
  await page.mouse.up();
  await page.clock.resume();
  await expect(page.getByRole("heading", { name: "Aufgaben des Autors" })).toBeVisible();
});

test("Abhaken, Notiz, Link und zurück; der Text für den Chat enthält beides", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneUeberAdresse(page);
  await expect(page.getByRole("heading", { name: "Aufgaben des Autors" })).toBeVisible();
  // Der neueste Abschnitt ist beim ersten Öffnen aufgeklappt.
  const erster = page.locator(".aufgabenabschnitt[open] .aufgabenpunkt").first();
  await expect(erster).toBeVisible();
  const id = ((await erster.getAttribute("data-testid")) ?? "").replace("aufgabe-", "");
  await erster.getByRole("checkbox", { name: `${id} erledigt` }).check();
  await erster.getByRole("button", { name: "Notiz" }).click();
  await erster.getByRole("textbox", { name: `Notiz zu ${id}` }).fill("Pfeil fehlt");
  await page.getByText("Text für den Chat ansehen").click();
  const text = page.getByTestId("autor-text");
  await expect(text).toContainText(`${id} ok: Pfeil fehlt`);
  // Ein Link im Abschnitt öffnet seinen Bildschirm; zurück ist der Haken noch da.
  const link = page.locator(".aufgabenabschnitt[open] .aufgabenlink").first();
  if ((await link.count()) > 0) {
    await link.click();
    await expect(page.getByTestId("autor-aufgaben")).toHaveCount(0);
    // Der Knopf über der Leiste führt zurück (iPhone ohne Zurück-Taste), ebenso die Zurück-Taste.
    await page.getByRole("button", { name: "‹ Zurück zu den Aufgaben" }).click();
    await expect(page.getByTestId("autor-aufgaben")).toBeVisible();
    await expect(page.getByRole("button", { name: "‹ Zurück zu den Aufgaben" })).toHaveCount(0);
    await link.click();
    await page.goBack();
    await expect(page.getByTestId("autor-aufgaben")).toBeVisible();
  } else {
    await oeffneUeberAdresse(page);
  }
  await expect(page.getByTestId(`aufgabe-${id}`).getByRole("checkbox")).toBeChecked();
});
