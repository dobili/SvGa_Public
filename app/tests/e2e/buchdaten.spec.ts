/**
 * Oberflächentests für AP 2: alle Kapitel sind da, Lehrbilder ohne König bieten keine Engine an.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

test("Lehrbild ohne König (Abb. 0.3): Zählen ja, Engine nein", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "0.3", "0.3");
  await expect(page.getByRole("button", { name: "Zählen" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Engine", exact: true })).toHaveCount(0);
  await expect(page.getByText("Lehrbild ohne König")).toBeVisible();
});

test("Abbildungen aus späteren Kapiteln öffnen (Abb. 7.13, 12.1)", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneAbbildung(page, "7.13", "7.13");
  await page.getByRole("button", { name: "Zurück", exact: true }).click();
  await oeffneAbbildung(page, "12,1", "12.1");
});

test("Kapitelübersicht: Kapitel 2 mit kleinen Brettern, Tipp öffnet die Abbildung", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByRole("button", { name: /Klassische Eröffnungssysteme/ }).click();
  await expect(page.getByRole("heading", { name: "Kapitel 2" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /2\.2 Die Spanische Partie/ })).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/kapitel-2.png" });
  // Ohne das Kästchen „als angesehen abhaken“ daneben (0.2.27).
  await page.getByRole("button", { name: /^Abb\. 2\.20(?!.*abhaken)/ }).click();
  await expect(page.getByRole("heading", { name: "Abb. 2.20" })).toBeVisible();
  await page.getByRole("button", { name: "Zurück", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Kapitel 2" })).toBeVisible();
});

test("Nachschlagen: Glossar suchen, Stelle öffnen; Denkroutine; Abhakliste mit Lernzielen", async ({
  page,
}) => {
  await starteImBrowser(page);
  const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
  await leiste.getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Glossar/ }).click();
  await page.getByRole("searchbox", { name: "Begriff suchen" }).fill("abschneid");
  await page.getByRole("button", { name: "Abschneiden", exact: true }).click();
  await expect(page.getByText("Im Turmendspiel: Der Turm sperrt")).toBeVisible();
  await page.getByRole("button", { name: "Abschnitt 9.1" }).click();
  await expect(page.getByRole("heading", { name: "Abb. 9.1" })).toBeVisible();
  await leiste.getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Denkroutine/ }).click();
  await expect(page.getByText("Stellung erfassen.")).toBeVisible();
  await expect(page.getByText("Sicherheitsblick.")).toBeVisible();
  await page.getByText("Mittelspiel").click();
  await expect(page.getByText("den Plan des Gegners (Kap. 6)")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/denkroutine.png", fullPage: true });
  await leiste.getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Gesamt-Checkliste/ }).click();
  // Kapitel 1 aufklappen, einen Punkt aus dem Buch abhaken; der Haken übersteht ein Neuladen.
  const karte = page.getByTestId("lernkarte-1");
  await karte.getByText("Was passiert jetzt?").click();
  const punkt = karte.getByRole("checkbox", {
    name: "die drei Eröffnungsziele an einer Stellung prüfen",
  });
  await punkt.check();
  await expect(karte).toContainText("1/6");
  await expect(page.getByTestId("lernstand-gesamt")).toContainText("1 von");
  await page.screenshot({ path: "test-results/bilder/checkliste.png", fullPage: true });
  await page.reload();
  await leiste.getByRole("button", { name: "Nachschlagen" }).click();
  await page.getByRole("button", { name: /^Gesamt-Checkliste/ }).click();
  await expect(page.getByTestId("lernkarte-1")).toContainText("1/6");
  await page.getByTestId("lernkarte-1").getByText("Was passiert jetzt?").click();
  await page.getByRole("button", { name: "Zu Kapitel 1" }).click();
  await expect(page.getByRole("heading", { name: "Kapitel 1" })).toBeVisible();
});

test("Training zeigt alle Trainer, Einstellungen ändern die Brettfarben", async ({ page }) => {
  await starteImBrowser(page);
  const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
  await leiste.getByRole("button", { name: "Training" }).click();
  const zaehltrainer = page.getByTestId("trainer-zaehlen");
  await expect(zaehltrainer).toContainText("Zähltrainer");
  await expect(zaehltrainer).toContainText("Abtauschbilanz in Bauerneinheiten");
  await expect(zaehltrainer.getByRole("button", { name: "Trainieren" })).toBeVisible();
  // Noch nicht spielbare Trainer stehen aufklappbar mit „folgt mit einem Update“ da.
  const studien = page.getByTestId("trainer-studien").first();
  await expect(studien).toContainText("folgt mit einem Update");
  await expect(page.getByTestId("trainer-denkroutine")).toContainText("Denkroutine-Trainer");
  // Jedes Kapitel hat seine Trainingsseite, auch Kapitel 9 (sein Trainer gehört auch zu Kapitel 8).
  const kastenlinks = page.getByRole("link", { name: "Training zu diesem Kapitel (Website)" });
  await expect(kastenlinks).toHaveCount(13);
  await expect(page.locator('a[href="/training/kap09/"]')).toBeVisible();
  await leiste.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await page
    .getByRole("radiogroup", { name: "Brettfarben" })
    .getByRole("radio", { name: "Holz" })
    .click();
  await expect(
    page.getByRole("radiogroup", { name: "Brettfarben" }).getByRole("radio", { name: "Holz" }),
  ).toHaveAttribute("aria-checked", "true");
  await leiste.getByRole("button", { name: "Buch" }).click();
  await oeffneAbbildung(page, "1.26", "1.26");
  await expect(
    page.locator('.brett pattern image[href$="holz/dunkel.webp"]').first(),
  ).toBeAttached();
});

test("Barrierefreiheit: Training, Nachschlagen, Einstellungen, Kapitelübersicht", async ({
  page,
}) => {
  await starteImBrowser(page);
  const leiste = page.getByRole("navigation", { name: "Hauptbereiche" });
  const schwer = async () =>
    (await new AxeBuilder({ page }).analyze()).violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
  for (const bereich of ["Training", "Nachschlagen", "Einstellungen"]) {
    await leiste.getByRole("button", { name: bereich }).click();
    expect(await schwer()).toEqual([]);
  }
  await leiste.getByRole("button", { name: "Buch" }).click();
  await page.getByRole("button", { name: /Grundprinzipien des Schachs/ }).click();
  expect(await schwer()).toEqual([]);
});
