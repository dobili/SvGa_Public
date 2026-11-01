/**
 * Oberflächentests zur Zurück-Taste über offenen Blättern und Fenstern (Empfehlung aus dem
 * Fehlertest f3, 01.11.2026, app/blattstapel.ts): Zurück schließt nur das oberste Fenster, die
 * Ansicht darunter bleibt; schließt ein Fenster über seinen Knopf, verschluckt die nächste
 * Zurück-Taste nichts. Dazu kaputte Herausforderungslinks und die Leiste nach „Neue Partie“.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffnePartie } from "./auswertungpartie";
import { ladeMitSprung, oeffneProfil, starteImBrowser } from "./hilfen";
import { blatt, oeffnePartieEinstellen } from "./spielenhilfen";

/** Breite eines kleinen Handys. */
const HANDY = { width: 360, height: 800 };

/** Der Bereich, den die Leiste unten als aktiv zeigt. */
function aktiverBereich(page: Page) {
  return page.locator(".leiste [aria-current='page']");
}

test("Lernpfad: Zurück schließt das Infofenster, erst die zweite Zurück-Taste den Lernpfad", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await page.getByTestId("lernpfad-knopf-buch").click();
  const titel = page.getByRole("heading", { name: "Dein Weg durchs Buch" });
  await expect(titel).toBeVisible();
  await page.getByTestId("nebenaufgaben-0").click();
  await expect(page.getByTestId("infofenster")).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId("infofenster")).toHaveCount(0);
  await expect(titel).toBeVisible();
  await page.goBack();
  await expect(titel).toHaveCount(0);
  await expect(page.locator(".kapitelliste")).toBeVisible();
});

test("Profil-Startseite: Zurück schließt das Infofenster und bleibt in der App", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffneProfil(page);
  const profil = page.getByRole("heading", { name: "Profil", level: 1 });
  await page.getByTestId("abzeichen-erstePartie").getByRole("button").click();
  await expect(page.getByTestId("infofenster")).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId("infofenster")).toHaveCount(0);
  await expect(profil).toBeVisible();
  // Über „Schließen“ zu: Danach führt eine einzige Zurück-Taste vom Lernpfad zurück ins Profil.
  await page.getByTestId("abzeichen-erstePartie").getByRole("button").click();
  await page.getByTestId("infofenster").getByRole("button", { name: "Schließen" }).click();
  await expect(page.getByTestId("infofenster")).toHaveCount(0);
  await page.getByTestId("lernpfad-knopf-profil").click();
  await expect(page.getByRole("heading", { name: "Dein Weg durchs Buch" })).toBeVisible();
  await page.goBack();
  await expect(profil).toBeVisible();
});

test("Partie einstellen: Zurück schließt nur das Blatt", async ({ page }) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Spielen", exact: true })
    .click();
  await oeffnePartieEinstellen(page);
  await page.goBack();
  await expect(blatt(page)).not.toBeVisible();
  await expect(aktiverBereich(page)).toHaveAccessibleName("Spielen");
  await expect(page.getByTestId("vorschlagskarte")).toBeVisible();
});

test("Auswertung: Zurück schließt „Teilen“; „Neue Partie“ wechselt in den Bereich Spielen", async ({
  page,
}) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  await oeffnePartie(page, "hell");
  const abschluss = page.getByTestId("partieabschluss");
  await abschluss.getByRole("button", { name: "Teilen" }).click();
  await expect(page.getByTestId("teilen-blatt")).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId("teilen-blatt")).toHaveCount(0);
  await expect(abschluss).toBeVisible();
  // Aus dem Profil geöffnet: „Neue Partie“ markiert unten „Spielen“, nicht mehr „Profil“.
  await abschluss.getByRole("button", { name: "Neue Partie" }).click();
  await expect(aktiverBereich(page)).toHaveAccessibleName("Spielen");
});

test("kaputter Herausforderungslink: Hinweis statt stillem Start auf „Buch“", async ({ page }) => {
  await page.setViewportSize(HANDY);
  await starteImBrowser(page);
  for (const adresse of ["/app/#aufgabe-taktik-", "/app/#aufgabe-gibtsnicht-1"]) {
    await ladeMitSprung(page, adresse);
    await expect(page.getByTestId("herausforderung-ungueltig")).toHaveText(
      "Dieser Link ist ungültig oder unvollständig.",
    );
  }
  // Ein Anhängsel der Messenger hinter der Kennung stört nicht mehr.
  await ladeMitSprung(page, "/app/#aufgabe-taktik-l-1Vybh?fbclid=abc");
  await expect(page.getByText("Jemand hat dir diese Aufgabe geschickt.")).toBeVisible();
});
