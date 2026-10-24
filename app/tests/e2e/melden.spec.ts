/**
 * Oberflächentests für „Fehler melden“ (R57): Formular in den Einstellungen, „Fehler im Buch
 * melden“ an einer Abbildung, Kopierweg ohne Netz. Die Schnittstelle /api/melden beantwortet
 * Playwright selbst (im Test gibt es keinen Worker).
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

async function fangeMeldungen(page: Page, status = 200): Promise<unknown[]> {
  const gesendet: unknown[] = [];
  await page.route("**/api/melden", (route) => {
    gesendet.push(route.request().postDataJSON());
    return route.fulfill({
      status,
      json: status === 200 ? { ok: true, nummer: 42 } : { ok: false },
    });
  });
  return gesendet;
}

test("Einstellungen: Wunsch senden, mit Geräteangaben", async ({ page }) => {
  const gesendet = await fangeMeldungen(page);
  await starteImBrowser(page);
  await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await page.getByRole("button", { name: "Fehler melden" }).click();
  const formular = page.getByTestId("meldeformular");
  await formular.getByRole("radio", { name: "Wunsch" }).click();
  const senden = formular.getByRole("button", { name: "Senden" });
  await expect(senden).toBeDisabled();
  await formular.getByLabel("Was wünschst du dir?").fill("Eine Übersicht aller Pfeile");
  await senden.click();
  await expect(formular.getByRole("status")).toContainText("Nr. 42");
  expect(gesendet).toHaveLength(1);
  expect(gesendet[0]).toMatchObject({
    art: "wunsch",
    text: "Eine Übersicht aller Pfeile",
    sprache: "de",
  });
  expect(gesendet[0]).toHaveProperty("geraet");
});

test("Abbildung: Fehler im Buch melden schickt Nummer und Stellung", async ({ page }) => {
  const gesendet = await fangeMeldungen(page);
  await starteImBrowser(page);
  await oeffneAbbildung(page, "1.26", "1.26");
  await page.getByRole("button", { name: "Fehler im Buch melden" }).click();
  const formular = page.getByTestId("meldeformular");
  await expect(formular.getByRole("radio", { name: "Fehler im Buch" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await formular.getByLabel(/Was stimmt im Buch nicht/).fill("Pfeil zeigt auf das falsche Feld");
  await formular.getByRole("button", { name: "Senden" }).click();
  await expect(formular.getByRole("status")).toContainText("angekommen");
  expect(gesendet[0]).toMatchObject({ art: "buch", abbildung: "1.26" });
  expect(String((gesendet[0] as { stellung: string }).stellung)).toMatch(/^[1-8a-zA-Z/]+ [wb] /);
});

test("ohne Netz: Hinweis auf E-Mail und Kopierweg", async ({ page }) => {
  await fangeMeldungen(page, 500);
  await starteImBrowser(page);
  await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await page.getByRole("button", { name: "Fehler melden" }).click();
  const formular = page.getByTestId("meldeformular");
  await formular.getByLabel(/Was ist passiert/).fill("Brett bleibt leer");
  await formular.getByRole("checkbox").uncheck();
  await formular.getByRole("button", { name: "Senden" }).click();
  await expect(formular.getByRole("status")).toContainText("kontakt@schach-von-grund-auf.com");
  await expect(formular.getByRole("button", { name: "Text und Angaben kopieren" })).toBeVisible();
});
