/**
 * Oberflächentests für Hinweise je Gerät (19.10.2026): zu alte Geräte bekommen eine Erklärung
 * statt einer leeren Seite, Safari im Browser den Hinweis auf die Sieben-Tage-Regel.
 */
import { expect, test } from "@playwright/test";
import { oeffneEinstellungsseite, starteImBrowser } from "./hilfen";

/** Tut so, als fehle die Rückschau in regulären Ausdrücken (Safari vor 16.4). */
const ALTER_BROWSER = () => {
  const Echt = window.RegExp;
  const Alt = function (muster: string | RegExp, flags?: string) {
    if (String(muster).includes("(?<=")) throw new SyntaxError("Rückschau unbekannt");
    return new Echt(muster, flags);
  } as unknown as RegExpConstructor;
  window.RegExp = Alt;
};

test("zu altes Gerät: Hinweis in der App und auf der Installationsseite", async ({ page }) => {
  await page.addInitScript(ALTER_BROWSER);
  await page.goto("/installieren/");
  await expect(page.locator("p[data-zu-alt]")).toBeVisible();
  await expect(page.locator("p[data-zu-alt]")).toContainText("iOS 16.4");
  await page.goto("/app/");
  // Die App selbst läuft im Testbrowser trotzdem und räumt den Hinweis weg; vorher stand er da.
  await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
  await expect(page.locator("#startproblem")).toHaveCount(0);
});

test("modernes Gerät: kein Hinweis, Kasten nach dem Start entfernt", async ({ page }) => {
  await page.goto("/installieren/");
  await expect(page.locator("p[data-zu-alt]")).toBeHidden();
  await starteImBrowser(page);
  await expect(page.locator("#startproblem")).toHaveCount(0);
});

test.describe("Safari auf dem iPhone, im Browser", () => {
  test.use({
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  });

  test("Sieben-Tage-Hinweis oben und in der Datensicherung, „Verstanden“ schließt ihn", async ({
    page,
  }) => {
    await starteImBrowser(page, { safariHinweis: true });
    const hinweis = page.getByTestId("safarihinweis");
    await expect(hinweis).toContainText("sieben Tage");
    await expect(hinweis.getByRole("link", { name: "So installierst du die App" })).toHaveAttribute(
      "href",
      "/installieren/",
    );
    await oeffneEinstellungsseite(page, "Deine Daten");
    await expect(page.getByTestId("sicherung-safari")).toBeVisible();
    await hinweis.getByRole("button", { name: "Verstanden" }).click();
    await expect(hinweis).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Buch" })).toBeVisible();
    await expect(page.getByTestId("safarihinweis")).toHaveCount(0);
  });
});

test.describe("Chrome auf Android", () => {
  test.use({
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  });

  test("kein Sieben-Tage-Hinweis", async ({ page }) => {
    await starteImBrowser(page, { safariHinweis: true });
    await expect(page.getByTestId("safarihinweis")).toHaveCount(0);
  });
});
