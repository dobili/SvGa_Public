/**
 * Oberflächentest für die freundliche Seite nach einem Absturz (V7, Nutzungsprüfung 25.10.2026):
 * Stürzt ein Bildschirm ab, bleibt die Leiste; „Zurück“ führt weiter, „Fehler melden“ schickt den
 * Bericht ohne Geräteangaben, wenn das Häkchen fehlt.
 * Den Absturz löst ein absichtlich kaputtes Glossar aus (Zahl statt Liste). Der Service Worker ist
 * hier gesperrt, damit Playwright die Datei selbst beantworten kann (sonst käme sie aus dem
 * Vorab-Speicher).
 */
import { expect, test } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

test.use({ serviceWorkers: "block" });

test("Absturz eines Bildschirms: freundliche Seite, Leiste bleibt, Melden und Zurück", async ({
  page,
}) => {
  const gesendet: unknown[] = [];
  await page.route("**/api/melden", (route) => {
    gesendet.push(route.request().postDataJSON());
    return route.fulfill({ status: 200, json: { ok: true, nummer: 5 } });
  });
  await page.route("**/glossar.json", (route) => route.fulfill({ json: { eintraege: 42 } }));
  await starteImBrowser(page);
  const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
  await leiste.getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Glossar/ }).click();

  const seite = page.getByTestId("absturzseite");
  await expect(
    seite.getByRole("heading", { name: "Hier ist etwas schiefgegangen." }),
  ).toBeVisible();
  await expect(seite).toContainText("Dein Fortschritt ist gespeichert.");
  await expect(leiste).toBeVisible();
  const technik = seite.locator(".absturz-technik p");
  await expect(technik).toBeHidden();
  await seite.getByText("Technische Meldung").click();
  await expect(technik).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/absturz.png", fullPage: true });

  await seite.getByRole("checkbox").uncheck();
  await seite.getByRole("button", { name: "Fehler melden" }).click();
  await expect(seite.getByRole("status")).toContainText("angekommen");
  expect(gesendet).toHaveLength(1);
  expect(gesendet[0]).toMatchObject({ art: "absturz" });
  expect(gesendet[0]).not.toHaveProperty("geraet");

  await seite.getByRole("button", { name: "Zurück" }).click();
  await expect(page.getByRole("heading", { name: "Nachschlagen", level: 1 })).toBeVisible();
  await expect(seite).toHaveCount(0);
});
