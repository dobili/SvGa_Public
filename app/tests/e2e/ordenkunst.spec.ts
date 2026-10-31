/**
 * Oberflächentests der Ordenkunst (Wunsch des Autors, 30.10.2026): Ein seit dem letzten Start neu
 * verdienter Orden erscheint in der Startanimation unter dem Titel, fliegt zu „Profil“ und lässt
 * dort einen goldenen Punkt, der beim Öffnen des Profils verschwindet. Im Profil stehen die
 * Abzeichen in Reihen; ein Tipp zeigt die Bedingung.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

const leiste = (page: Page) => page.getByRole("navigation", { name: "Hauptbereiche" });

/** Setzt den Ring „Übungen gelöst“ über die Aufgabenseite zur Probe auf voll. */
async function uebungenVoll(page: Page): Promise<void> {
  await page.goto("/app/#aufgaben");
  await page.reload();
  const probe = page.getByTestId("orden-probe");
  await probe.locator("summary").click();
  await probe
    .getByRole("button", { name: "Übungen gelöst: auf 100 % setzen", exact: true })
    .click();
  await page.getByTestId("ringfeier").getByRole("button", { name: "Weiter" }).click();
}

test("Neuer Orden: Startanimation zeigt ihn, er fliegt zu „Profil“, der Punkt bleibt bis zum Profil", async ({
  page,
}) => {
  await starteImBrowser(page);
  // Beim letzten Start war nichts verdient; so ist der Orden jetzt neu.
  await page.addInitScript(() => window.localStorage.setItem("svga.ordenBekannt", ""));
  await uebungenVoll(page);
  await page.goto("/app/");
  await page.addInitScript(() => window.sessionStorage.removeItem("svga.startanimation.sitzung"));
  await page.reload();
  const stueck = page.getByTestId("startstueck");
  await expect(stueck).toContainText("Neuer Orden");
  await expect(stueck).toContainText("Übungen gelöst");
  await page.waitForTimeout(2200);
  await page.screenshot({ path: "test-results/bilder/ordenkunst-start.png" });
  await expect(page.getByTestId("leiste-orden-neu")).toBeVisible({ timeout: 6000 });
  await expect(page.getByTestId("startanimation")).toHaveCount(0);
  await expect(
    leiste(page).getByRole("button", { name: "Profil: Neues in deiner Sammlung" }),
  ).toBeVisible();
  await leiste(page).getByRole("button", { name: "Profil: Neues in deiner Sammlung" }).click();
  await expect(page.getByTestId("leiste-orden-neu")).toHaveCount(0);
});

test("Profil: Abzeichen in Reihen mit eigenem Bild, ein Tipp zeigt die Bedingung", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.goto("/app/");
  await leiste(page).getByRole("button", { name: "Profil", exact: true }).click();
  const gitter = page.getByTestId("abzeichen");
  await gitter.locator("summary").click();
  const matt = page.getByTestId("abzeichen-erstesMatt");
  const partie = page.getByTestId("abzeichen-erstePartie");
  await expect(matt.locator('[data-ordenkunst="erstesMatt"]')).toBeVisible();
  // Nebeneinander: dieselbe Höhe, verschiedene Spalten.
  const a = await partie.boundingBox();
  const b = await page.getByTestId("abzeichen-ersterSieg").boundingBox();
  expect(a && b && Math.abs(a.y - b.y) < 2 && b.x > a.x).toBe(true);
  await matt.getByRole("button").click();
  await expect(matt.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  await gitter.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/bilder/ordenkunst-profil.png", fullPage: true });
});
