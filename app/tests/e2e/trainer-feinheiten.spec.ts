/**
 * Feinheiten der Trainer aus den offenen Testpunkten (Vortest, 17.11.2026): Pfeile in „Zug
 * erraten“ (N1013), die Seite am Zug im Zähltrainer (N2444), das Gedächtnis des
 * Repertoire-Trainers je Quelle (N2531), ganze Eröffnungen aus dem Steckbrief und „Nur Praxis“
 * (N2526).
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneTrainer, starteImBrowser, starteRunde, waehleInZeile } from "./hilfen";

/** So viele Aufgaben des Zähltrainers werden durchgetippt (wie im Testpunkt). */
const ZAEHLAUFGABEN = 5;

const feld = (seite: Page, name: string) =>
  seite.locator(".brett-tasten").getByRole("button", { name: new RegExp(`^${name}(,|$)`) });

async function ziehe(seite: Page, von: string, nach: string): Promise<void> {
  await feld(seite, von).click();
  await feld(seite, nach).click();
}

test("Zug erraten: kein Pfeil nach einem Treffer, Gold und Rot nach einem falschen Zug (N1013)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "zugErraten");
  await waehleInZeile(page, "zugerraten-partieliste", /^Morphys Opernpartie/);
  await page.getByTestId("zugerraten-wahl").getByRole("button", { name: "Runde starten" }).click();
  const runde = page.getByTestId("trainerrunde");
  const pfeile = runde.locator(".brett svg polygon");
  await ziehe(page, "e2", "e4");
  await expect(runde).toContainText("Getroffen!");
  await expect(pfeile).toHaveCount(0);
  await ziehe(page, "d2", "d4");
  await expect(runde).toContainText("In der Partie geschah");
  await expect(pfeile).toHaveCount(2);
});

test("Zähltrainer: unter dem Brett die Seite, die auf dem Feld schlagen würde (N2444)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "zaehlen");
  await starteRunde(page);
  const runde = page.getByTestId("trainerrunde");
  for (let i = 0; i < ZAEHLAUFGABEN; i++) {
    const seite = /(Weiß|Schwarz) am Zug/.exec(await runde.innerText())?.[1] ?? "";
    // Die Rechnung nach der Antwort nennt die schlagende Seite: dieselbe wie unter dem Brett.
    await runde.getByTestId("zaehl-ergebnisse").getByRole("button").first().click();
    await expect(
      page
        .getByTestId("zaehl-rechnung")
        .getByRole("img", { name: new RegExp(`^${seite} greift an`) }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Weiter" }).click();
  }
});

test("Repertoire: jede Quelle merkt sich ihre zuletzt gewählte Eröffnung (N2531)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneTrainer(page, "repertoire");
  const eroeffnung = page.getByTestId("zeile-eroeffnung");
  await waehleInZeile(page, "zeile-eroeffnung", /Caro-Kann/);
  await waehleInZeile(page, "repertoire-quelle", "Gambits (Kapitel 3)");
  await waehleInZeile(page, "zeile-eroeffnung", /Evans/);
  await waehleInZeile(page, "repertoire-quelle", "Eröffnungen (Kapitel 2)");
  await expect(eroeffnung).toContainText(/^Eröffnung\s*Caro-Kann/);
  await waehleInZeile(page, "repertoire-quelle", "Gambits (Kapitel 3)");
  await expect(eroeffnung).toContainText(/^Eröffnung\s*Evans-Gambit/);
});

test("Ganze Eröffnung aus dem Steckbrief; „Nur Praxis“ unter Neue Variante (N2526)", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Steckbriefe/ }).click();
  await page.getByTestId("steckbrief").filter({ hasText: "Spanische Partie" }).click();
  await page.getByRole("button", { name: /Ganze Eröffnung als Variante/ }).click();
  await expect(page.getByTestId("variantentitel")).toHaveText("Spanische Partie (Ruy Lopez)");
  await expect(page.getByTestId("variantenzeile")).toContainText("3. Lb5");
  // Nur Praxis: eine Eröffnung, die das Buch nicht behandelt, etwa die Wiener Partie.
  await page.getByRole("navigation").getByRole("button", { name: "Training" }).click();
  await page.getByTestId("kachel-varianten").getByRole("button").click();
  await page.getByRole("button", { name: "Neue Variante" }).click();
  await page.getByRole("button", { name: "Ganze Eröffnung" }).click();
  const seite = page.getByTestId("varianten-eroeffnung");
  const wahl = seite.getByTestId("eroeffnung-wahl");
  await expect(
    wahl.locator("optgroup[label='Nur Praxis (Lichess)'] option", { hasText: "Wiener Partie" }),
  ).toHaveCount(1);
  await wahl.selectOption({ label: "Wiener Partie" });
  await expect(seite.getByTestId("eroeffnung-umfang")).toContainText(/Buch 0 · Praxis \d+ Züge/);
  await seite.getByRole("button", { name: "Öffnen" }).click();
  await expect(page.getByTestId("variantentitel")).toHaveText("Wiener Partie");
  await expect(page.getByTestId("variantenzeile")).toContainText("Sc3");
});
