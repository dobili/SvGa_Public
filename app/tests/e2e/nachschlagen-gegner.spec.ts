/**
 * Oberflächentests zu den Wünschen des Autors vom 19.10.2026 (0.2.99): Steckbriefe und Werkzeuge
 * in Nachschlagen, Porträt für eigene Bots, Spielhilfen über „Partie beginnen“.
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

test("Nachschlagen: Steckbriefe mit Fallencheck und Werkzeuge des Buches", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Steckbriefe/ }).click();
  await expect(page.getByTestId("steckbrief")).toHaveCount(13);
  const falle = page.getByTestId("fallencheck").filter({ hasText: "Klammerfalle" });
  await falle.locator("summary").click();
  await expect(falle).toContainText("Wer tappt hinein?");
  await falle.getByRole("button", { name: "Zum Stopp-Moment (Abb. 4.2)" }).click();
  await expect(page.getByRole("heading", { name: "Abb. 4.2" })).toBeVisible();
  await page.getByRole("navigation").getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Werkzeuge des Buches/ }).click();
  await page.locator(".werkzeugeintrag summary", { hasText: "Röntgen" }).first().click();
  await expect(page.getByText(/Regel: Kapitel 1, Schach-Röntgen-Regel/)).toBeVisible();
});

test("Eigener Bot mit Porträt; Spielhilfen stehen über „Partie beginnen“", async ({ page }) => {
  await starteImBrowser(page);
  await page.getByRole("navigation").getByRole("button", { name: "Spielen" }).click();
  const hilfen = page.getByRole("checkbox", { name: /Gewertete Partie/ });
  const beginnen = page.getByRole("button", { name: "Partie beginnen" });
  const [yHilfen, yBeginnen] = await Promise.all([hilfen.boundingBox(), beginnen.boundingBox()]);
  expect(yHilfen?.y ?? 0).toBeLessThan(yBeginnen?.y ?? 0);
  await page.getByRole("radio", { name: "Eigene Bots" }).click();
  await page.getByRole("button", { name: "Neuen Gegner anlegen" }).click();
  await page.getByLabel("Name").fill("Tante Erna");
  // 0.2.100: Aufklappmenü mit Vorschaubildern; Tippen auf ein Bild wählt und schließt.
  const knopf = page.getByRole("button", { name: /^Porträt kein Bild/ });
  await knopf.click();
  await expect(page.getByRole("radiogroup", { name: "Porträt" }).locator("img")).toHaveCount(30);
  await page.getByTitle("Ältere Frau mit Dutt und Brille").click();
  await expect(page.getByRole("radiogroup", { name: "Porträt" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Porträt Ältere Frau mit Dutt/ })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await page.getByRole("button", { name: "Gegner speichern" }).click();
  await page.getByRole("radio", { name: /Tante Erna/ }).click();
  const blase = page.getByTestId("gegner-sprechblase");
  await expect(blase.locator("img")).toHaveAttribute("src", /gegner\/wahl-25\.svg$/);
  // R28: In der Partie steht der Bot als Titel; sein Porträt seit 0.2.124 darunter im Untertitel
  // (Wunsch des Autors, 24.10.2026), daneben sein Satz.
  await beginnen.click();
  await expect(page.getByRole("heading", { name: "gegen Tante Erna" })).toBeVisible();
  const gegnerzeile = page.getByTestId("partie-gegnerzeile");
  await expect(gegnerzeile.locator("img")).toHaveAttribute("src", /gegner\/wahl-25\.svg$/);
  await expect(gegnerzeile).toContainText("Dein eigener Gegner");
});
