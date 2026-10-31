/**
 * Oberflächentest der Kombo (Gamifizierung P10 a): Nach drei richtigen Antworten in Folge steht
 * „3 in Folge“ neben dem Stand der Runde; ein Fehler beendet die Kombo leise. Der Trainer „Feld
 * finden“ zeigt seinen Auftrag als Text, deshalb kann der Test gezielt richtig oder falsch tippen.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneTrainer, starteImBrowser } from "./hilfen";

const feld = (page: Page, name: string) =>
  page.getByRole("button", { name: new RegExp(`^${name}(,|$)`) });

/** Das gesuchte Feld der aktuellen Aufgabe, etwa „e4“. */
async function gesucht(page: Page): Promise<string> {
  const text = (await page.getByTestId("feld-auftrag").textContent()) ?? "";
  return text.replace("Tippe auf ", "").trim();
}

test("Kombo: drei richtige in Folge zeigen „3 in Folge“, ein Fehler beendet sie", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "koordinaten");
  await page.getByRole("button", { name: /Feld finden/ }).click();
  const kombo = page.getByTestId("kombo");
  for (let i = 0; i < 3; i += 1) {
    await expect(page.getByText(`Aufgabe ${i + 1} von 16`)).toBeVisible();
    await expect(kombo).toHaveCount(0);
    await feld(page, await gesucht(page)).click();
  }
  await expect(kombo).toHaveText("3 in Folge");
  await expect(page.getByText("Aufgabe 4 von 16")).toBeVisible();
  const falsch = (await gesucht(page)) === "a1" ? "h8" : "a1";
  await feld(page, falsch).click();
  await expect(kombo).toHaveCount(0);
});

/** Eine ganze Runde „Feld finden“ richtig lösen (16 Aufgaben). */
async function loeseRunde(page: Page): Promise<void> {
  for (let i = 0; i < 16; i += 1) {
    await expect(page.getByText(`Aufgabe ${i + 1} von 16`)).toBeVisible();
    await feld(page, await gesucht(page)).click();
  }
}

test("Fundstück: das erste kommt in der dritten Runde und liegt im Album", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "koordinaten");
  await page.getByRole("button", { name: /Feld finden/ }).click();
  const ende = page.getByTestId("runde-ende");
  for (let runde = 1; runde <= 3; runde += 1) {
    if (runde > 1) await ende.getByRole("button", { name: "Noch eine Runde" }).click();
    await loeseRunde(page);
    await expect(ende).toBeVisible();
    if (runde < 3) await expect(page.getByTestId("fundstueck-meldung")).toHaveCount(0);
  }
  const meldung = page.getByTestId("fundstueck-meldung");
  await expect(meldung).toContainText("Fundstück!");
  await expect(meldung).toContainText(/\(1 von \d+\)/);
  await meldung.getByRole("button", { name: "Zum Album" }).click();
  const album = page.getByTestId("fundstueckalbum");
  await expect(album).toContainText(/1 von \d+ gefunden/);
  await expect(album.getByTestId("fundstueck")).toHaveCount(1);
});
