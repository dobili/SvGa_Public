/**
 * Oberflächentests für vorbereitete Texte (AP 14, umgebaut in 0.2.27): Die Einschätzungen
 * entfallen; die Warum-Frage erscheint erst, wenn die Abbildung als angesehen gilt, zugeklappt
 * und unter den Kacheln des gewählten Werkzeugs (Entscheidung des Autors vom 15.10.2026).
 * Die Testversion enthält die Entwürfe (Pipeline mit --text-entwuerfe).
 */
import { expect, test } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

/** Eine Abbildung gilt nach 30 Sekunden am Stück als angesehen; der Test spult die Uhr vor. */
const VERWEILZEIT_MS = 30_000;

test("Abb. 1.26: Warum-Frage erst nach 30 Sekunden, zugeklappt, unter der Werkzeugkarte", async ({
  page,
}) => {
  await page.clock.install();
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  const frage = page.getByTestId("warum-frage");
  await expect(frage).toHaveCount(0);
  await expect(page.getByTestId("vorbereitet-karte")).toHaveCount(0);
  await page.clock.runFor(VERWEILZEIT_MS);
  await expect(frage.getByRole("heading", { name: "Warum-Frage zu 6. Ld3" })).toBeVisible();
  const falsch = frage.getByRole("button", { name: "Der Läufer steht auf d3 ungedeckt." });
  await expect(falsch).toBeHidden();
  await frage.screenshot({ path: "test-results/bilder/warum-frage-zu.png" });

  // Die Kacheln des Werkzeugs stehen über der Frage.
  await page.getByRole("button", { name: "Röntgen", exact: true }).click();
  const karte = await page.getByTestId("werkzeugkarte").boundingBox();
  const kasten = await frage.boundingBox();
  expect(karte && kasten && karte.y < kasten.y).toBe(true);

  await frage.getByRole("heading", { name: "Warum-Frage zu 6. Ld3" }).click();
  await falsch.click();
  await expect(frage.getByRole("status")).toContainText("Nicht ganz.");
  await expect(frage.locator(".antwort-richtig")).toContainText("verstellt der Dame d1");
  await page.screenshot({ path: "test-results/bilder/warum-frage.png", fullPage: true });

  // Einen Halbzug weiter steht Abb. 1.27 auf dem Brett: Ihre Frage kommt nach eigenen 30 Sekunden.
  await page.getByRole("button", { name: "Einen Halbzug vor" }).click();
  await expect(frage).toHaveCount(0);
  await page.clock.runFor(VERWEILZEIT_MS);
  await expect(frage.getByRole("heading", { name: "Warum-Frage zu 6... cxd4" })).toBeVisible();
});
