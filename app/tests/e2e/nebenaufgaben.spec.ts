/**
 * Oberflächentests des Infofensters zu Orden und Abzeichen und der Nebenaufgaben auf dem Lernpfad
 * (Wunsch des Autors, 31.10.2026). Im Profil öffnet ein Tipp auf ein Stück (Regal, Ring in „Dein
 * Fortschritt“) ein Fenster mit Bedingung und Stand oder „Geschafft“ und „Teilen“; Esc und Kreuz
 * schließen, der Fokus kehrt zurück. Auf dem Lernpfad steht neben jeder der 13 Stationen ein
 * Bündel, auf 360 px innerhalb des Bildschirms; ein Tipp zeigt die Liste, ein Tipp auf eine Zeile
 * das Stück, „Los geht's“ führt hin. axe ohne schweren Befund, hell und dunkel.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { oeffneProfil, starteImBrowser } from "./hilfen";

/** Schwere und kritische Verstöße (wie barrierefreiheit.spec.ts). */
async function schwereVerstoesse(page: Page): Promise<string[]> {
  const ergebnis = await new AxeBuilder({ page }).analyze();
  return ergebnis.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

/** Breite eines kleinen Handys. */
const HANDY = { width: 360, height: 800 };

test("Profil: Infofenster zu Orden, Abzeichen und Ring, mit Stand, Teilen und Los geht's", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await page.addInitScript(() => {
    window.localStorage.setItem("svga.ordenProbe", "ich-bots-1-3-einmal");
    window.localStorage.setItem("svga.ringeGefeiert", "ich-bots-1-3-einmal");
  });
  await starteImBrowser(page);
  await oeffneProfil(page);
  // Ein verdienter Orden: „Geschafft“ und „Teilen“, kein Knopf zum Ort.
  const orden = page.getByTestId("orden-bots-1-3-einmal").getByRole("button");
  await orden.click();
  const fenster = page.getByTestId("infofenster");
  await expect(fenster.getByRole("heading", { name: "Stufe 1–3 einmal" })).toBeVisible();
  await expect(fenster.getByTestId("infofenster-verdient")).toBeVisible();
  await expect(fenster.getByRole("button", { name: /Teilen/ })).toBeVisible();
  await expect(fenster.getByRole("button", { name: "Los geht's" })).toHaveCount(0);
  await fenster.getByRole("button", { name: "Schließen" }).click();
  await expect(fenster).toHaveCount(0);
  await expect(orden).toBeFocused();
  // Ein Ring in „Dein Fortschritt“ zeigt jetzt auch seine Bedingung.
  await page
    .getByTestId("ich-fortschritt")
    .getByRole("button", { name: /^Übungen gelöst/ })
    .click();
  await expect(fenster.getByTestId("infofenster-bedingung")).toHaveText("Übungen gelöst: alle 86");
  await expect(fenster.getByTestId("infofenster-stand")).toHaveText("0 von 86");
  await page.keyboard.press("Escape");
  // Ein offenes Abzeichen: Stand und der Knopf zum Spielen.
  await page.getByTestId("abzeichen-erstePartie").getByRole("button").click();
  await expect(fenster.getByTestId("infofenster-stand")).toHaveText("0 von 1");
  await fenster.getByRole("button", { name: "Los geht's" }).click();
  await expect(page.getByRole("heading", { name: "Spielen" })).toBeVisible();
});

test("Lernpfad: Nebenaufgaben neben jeder Station, Liste, Stück und Los geht's", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await page.getByTestId("lernpfad-knopf-buch").click();
  const buendel = page.locator(".nebenaufgaben-buendel");
  await expect(buendel).toHaveCount(13);
  // Auf 360 px ragt kein Bündel über den Rand, und jedes ist mindestens 44 px groß.
  for (const kasten of await buendel.evaluateAll((liste) =>
    liste.map((b) => b.getBoundingClientRect().toJSON() as DOMRect),
  )) {
    expect(kasten.left).toBeGreaterThanOrEqual(0);
    expect(kasten.right).toBeLessThanOrEqual(HANDY.width);
    expect(kasten.width).toBeGreaterThanOrEqual(44);
    expect(kasten.height).toBeGreaterThanOrEqual(44);
  }
  const erstes = page.getByTestId("nebenaufgaben-0");
  await expect(erstes).toHaveAccessibleName(/^Nebenaufgaben zu Kapitel 0: 0 von \d+ geschafft$/);
  await erstes.click();
  const fenster = page.getByTestId("infofenster");
  await expect(fenster.getByRole("heading", { name: "Nebenaufgaben · Kapitel 0" })).toBeVisible();
  await expect(fenster.getByTestId("nebenaufgabe-aufgabe-uebungen-0")).toContainText("0/3");
  await expect(fenster.getByTestId("nebenaufgabe-abzeichen-erstePartie")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/nebenaufgaben-liste.png" });
  // Ein Tipp auf eine Zeile zeigt das Stück; „Alle Nebenaufgaben“ führt zurück zur Liste.
  await fenster.getByTestId("nebenaufgabe-aufgabe-trainer-0").getByRole("button").click();
  await expect(fenster.getByRole("heading", { name: "Trainer Kapitel 0" })).toBeVisible();
  await expect(fenster.getByTestId("infofenster-stand")).toHaveText("0 von 1");
  await fenster.getByRole("button", { name: "Alle Nebenaufgaben" }).click();
  await expect(
    fenster.getByTestId("nebenaufgabe-aufgabe-trainer-0").getByRole("button"),
  ).toBeFocused();
  await fenster.getByTestId("nebenaufgabe-aufgabe-trainer-0").getByRole("button").click();
  await fenster.getByRole("button", { name: "Los geht's" }).click();
  await expect(fenster).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Runde starten/ })).toBeVisible();
});

for (const schema of ["hell", "dunkel"] as const) {
  test(`axe (${schema}): Lernpfad mit Bündeln und offenem Infofenster`, async ({ page }) => {
    await page.setViewportSize(HANDY);
    await page.addInitScript((farbschema) => {
      window.localStorage.setItem("svga.farbschema", farbschema);
    }, schema);
    await starteImBrowser(page);
    await page.getByTestId("lernpfad-knopf-buch").click();
    await expect(page.locator(".nebenaufgaben-buendel")).toHaveCount(13);
    expect(await schwereVerstoesse(page)).toEqual([]);
    await page.getByTestId("nebenaufgaben-4").click();
    await expect(page.getByTestId("infofenster")).toBeVisible();
    expect(await schwereVerstoesse(page)).toEqual([]);
  });
}
