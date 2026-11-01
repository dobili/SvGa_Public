/**
 * Oberflächentests für den Variationsbrowser, Stufe 4 (1.11.2026): ganze Eröffnung aus Buch und
 * Praxis laden, eine Variante abfragen (falsch, „andere Linie“, richtig, Ergebnis), eine Variante
 * mit einem Lernsammlungs-Eintrag verknüpfen und in der Abfrage der Sammlung abfragen, eine Übung
 * erst nach dem Lösen als Variante öffnen.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

/** Öffnet die Liste „Varianten“ über die Kachel im Training. */
async function oeffneVarianten(seite: Page): Promise<void> {
  await seite.getByRole("navigation").getByRole("button", { name: "Training" }).click();
  await seite.getByTestId("kachel-varianten").getByRole("button").click();
  await expect(seite.getByRole("heading", { name: "Varianten", level: 1 })).toBeVisible();
}

/** Zieht auf dem Brett eines Bildschirms von Feld zu Feld durch zwei Tipps. */
async function ziehe(seite: Page, bildschirm: string, von: string, nach: string): Promise<void> {
  const tasten = seite.locator(`${bildschirm} .brett-tasten`);
  await tasten.locator(`button[aria-label^="${von}"]`).click();
  await tasten.locator(`button[aria-label^="${nach}"]`).click();
}

/** Legt aus Abb. 2.40 (Petroff) eine gespeicherte Variante an (eigener Zug 3... De7). */
async function petroffVariante(seite: Page): Promise<void> {
  await seite.getByRole("navigation").getByRole("button", { name: "Buch" }).click();
  await oeffneAbbildung(seite, "2.40", "2.40");
  await seite.getByTestId("gabelschalter").click();
  await ziehe(seite, ".bildschirm-variante", "d8", "e7");
  await expect(seite.getByTestId("variantenstatus")).toContainText("Gespeichert");
}

test("Ganze Eröffnung: Italienisch aus Buch und Praxis, mit Herkunft und Abzweigen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneVarianten(page);
  await page.getByRole("button", { name: "Neue Variante" }).click();
  await page.getByRole("button", { name: "Ganze Eröffnung" }).click();
  const seite = page.getByTestId("varianten-eroeffnung");
  await seite
    .getByTestId("eroeffnung-wahl")
    .selectOption({ label: "Italienische Partie (Giuoco Piano)" });
  await expect(seite.getByTestId("eroeffnung-umfang")).toContainText(/Buch \d+ · Praxis 0 Züge/);
  await seite.getByTestId("eroeffnung-praxis").check();
  await expect(seite.getByTestId("eroeffnung-umfang")).not.toContainText("Praxis 0 Züge");
  await expect(seite.getByLabel("Spielstärke der Praxis")).toBeVisible();
  await seite.getByRole("button", { name: "Öffnen" }).click();
  // Die Variante öffnet am Kern (3. Lc4) mit den Abzweigen aus Buch und Praxis.
  await expect(page.getByTestId("variantentitel")).toHaveText("Italienische Partie (Giuoco Piano)");
  await expect(page.getByTestId("variantenzeile")).toContainText("Lc4");
  expect(await page.getByTestId("weiterchips").getByRole("button").count()).toBeGreaterThanOrEqual(
    3,
  );
  await expect(page.getByTestId("variantenkommentar")).toContainText("Buch:");
  await page.getByTestId("variantenkommentar").locator("summary").click();
  await expect(page.getByTestId("variantenkommentar")).toContainText("Praxis: Lichess");
});

test("Variante abfragen: falsch, andere Linie, richtig, Ergebnis", async ({ page }) => {
  await starteImBrowser(page);
  await petroffVariante(page);
  await page.getByTestId("variante-abfragen").click();
  await expect(page.getByTestId("abfrage-vorbereitung")).toBeVisible();
  // Nach dem eigenen Zug 3... De7 ist Weiß am Zug (Vorgabe); gewählt: Schwarz ab dem Anfang.
  await expect(page.getByRole("button", { name: "Weiß" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Schwarz" }).click();
  await page.getByLabel("Ab dem Anfang der Variante").check();
  await page.getByTestId("abfrage-start").click();
  const abfrage = page.getByTestId("variantenabfrage");
  const brett = ".bildschirm-variantenabfrage";
  await expect(page.getByTestId("variantenabfrage-stand")).toContainText(/Linie 1 von \d/);
  await expect(abfrage).toContainText("Welcher Zug kommt jetzt?");
  // 1... Sc6 steht nicht in der Variante: Fehler, der Pfeil zeigt 1... e5.
  await ziehe(page, brett, "b8", "c6");
  await expect(abfrage).toContainText("Nicht in der Variante");
  await ziehe(page, brett, "e7", "e5");
  await ziehe(page, brett, "g8", "f6");
  // 3... Sxe4 steht in der Variante, aber in einer anderen Linie; gefragt ist 3... d6.
  await ziehe(page, brett, "f6", "e4");
  await expect(abfrage).toContainText("kommt in einer anderen Linie");
  await ziehe(page, brett, "d7", "d6");
  await expect(page.getByTestId("variantenabfrage-zuege")).toContainText("Sf3");
  await ziehe(page, brett, "f6", "e4");
  await expect(page.getByTestId("variantenabfrage-zuege")).toContainText("Sxe4");
  await abfrage.getByRole("button", { name: "Beenden" }).click();
  await expect(page.getByTestId("abfrage-ende")).toContainText("3 von 4 Zügen auf Anhieb.");
});

test("Lernsammlung: Variante beim Anlegen verknüpfen und in der Abfrage abfragen", async ({
  page,
}) => {
  await starteImBrowser(page);
  await petroffVariante(page);
  await page.getByRole("button", { name: "Zurück" }).first().click();
  await page.getByRole("button", { name: "Diese Stellung in die Lernsammlung legen" }).click();
  const formular = page.getByTestId("sammelformular");
  await formular.getByLabel("Plan").fill("Erst d6, dann Sxe4");
  await formular.getByLabel("Variante").selectOption({ label: "Abb. 2.40" });
  await formular.getByRole("button", { name: "Speichern" }).click();
  await expect(page.getByText("In der Lernsammlung gespeichert.")).toBeVisible();

  await page.getByRole("navigation").getByRole("button", { name: "Training" }).click();
  await page.getByTestId("kachel-sammlung").getByRole("button").click();
  await page.getByTestId("sammelgruppe").locator("summary").first().click();
  await page.getByTestId("sammeleintrag").locator("summary").click();
  await expect(page.getByTestId("variantenzahl")).toContainText("1 eigene Variante");
  await expect(page.getByTestId("varianten-abfragen")).toContainText("Varianten abfragen (1)");

  await page.getByRole("button", { name: "Abfragen", exact: true }).click();
  await page.getByRole("button", { name: "Plan zeigen" }).click();
  await page.getByTestId("sammelabfrage-variantenknopf").click();
  await expect(page.getByTestId("sammelabfrage-varianten")).toContainText("Variante 1 von 1");
  await expect(page.getByTestId("variantenabfrage-stand")).toContainText(/Linie 1 von \d/);
  await ziehe(page, '[data-testid="lernsammlung"]', "d7", "d6");
  await expect(page.getByTestId("variantenabfrage-zuege")).toContainText("d6");
  await page.getByTestId("variantenabfrage").getByRole("button", { name: "Beenden" }).click();
  // Zurück beim Plan: weiter wie bisher.
  await expect(page.getByTestId("sammelabfrage-plan")).toContainText("Erst d6, dann Sxe4");
});

test("Übung erst nach dem Lösen als Variante: Übung 8 mit der Lösung im Baum", async ({ page }) => {
  await starteImBrowser(page);
  await page
    .getByRole("button", { name: /Kapitel 2 ·/ })
    .first()
    .click();
  await page
    .getByTestId("kapitel-uebungen")
    .getByRole("button", { name: /Abb\. 2\.148/ })
    .click();
  const uebung = page.getByTestId("uebung");
  await expect(uebung.getByTestId("gabelknopf")).toHaveCount(0);
  await uebung.getByRole("button", { name: "Ich habe nachgedacht" }).click();
  await uebung.getByRole("button", { name: "Lösung zeigen" }).click();
  await uebung.getByTestId("gabelknopf").click();
  await expect(page.getByTestId("variantentitel")).toHaveText("Übung 8");
  await expect(page.getByTestId("variantenzeile")).toContainText("Sg5");
  await expect(page.getByTestId("variantenzeile")).toContainText("Dxg5");
});
