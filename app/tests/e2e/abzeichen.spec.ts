/**
 * Oberflächentests der Erfahrungspunkte und Abzeichen (Paket Abzeichen): Das Profil zeigt Stufe,
 * Balken und das Gitter der Abzeichen (offene grau); die Karte „Abzeichen testen“ auf der
 * Aufgabenseite löst die Meldungen für ein Abzeichen und einen Stufenaufstieg aus, ohne echte
 * Daten zu ändern; „Probe beenden“ stellt alles zurück.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffneProfil, starteImBrowser } from "./hilfen";

/** Öffnet das Profil frisch (Neuladen beginnt beim Buch); die Abzeichen stehen im Regal. */
async function profilMitAbzeichen(page: Page): Promise<void> {
  await page.goto("/app/");
  await page.reload();
  await oeffneProfil(page);
}

test("Profil zeigt Stufe und Abzeichen; die Probe löst Meldungen aus und lässt sich beenden", async ({
  page,
}) => {
  await starteImBrowser(page, { abzeichenMeldung: true });
  await oeffneProfil(page);
  await expect(page.getByTestId("erfahrung-stufe")).toHaveText("Stufe 1 von 10: Erster Zug");
  await expect(page.getByText("Noch 100 EP bis zur Stufe „Entwicklung“")).toBeVisible();
  // Seit dem Profil neu (31.10.2026) ein Regal in „Deine Erfolge“ mit Zähler.
  const gitter = page.getByTestId("erfolge-regal-abzeichen");
  const zaehler = gitter.getByTestId("erfolge-zaehler-abzeichen");
  await expect(zaehler).toHaveText(/^0 von \d+$/);
  await expect(gitter.getByRole("img", { name: "Noch offen: Erste Partie" })).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/abzeichen-profil.png" });

  // Probe auf der Aufgabenseite: ein Abzeichen, dann die nächste Stufe.
  await page.goto("/app/#aufgaben");
  await page.reload();
  const probe = page.getByTestId("abzeichen-probe");
  await probe.locator("summary").click();
  await probe.getByRole("button", { name: "Erste Partie: verdienen" }).click();
  const meldung = page.getByTestId("abzeichenmeldung");
  await expect(meldung.getByRole("heading", { name: "Neues Abzeichen" })).toBeVisible();
  await expect(meldung.getByRole("img", { name: "Abzeichen: Erste Partie" })).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/abzeichen-meldung.png" });
  await meldung.getByRole("button", { name: "Weiter" }).click();
  await expect(meldung).toHaveCount(0);
  await expect(probe.getByRole("button", { name: "Erste Partie: verdienen" })).toBeDisabled();
  await probe.getByRole("button", { name: "Nächste Stufe erreichen" }).click();
  await expect(meldung.getByRole("heading", { name: "Neue Stufe erreicht" })).toBeVisible();
  await expect(meldung.getByText("Du bist jetzt auf Stufe 2: Entwicklung.")).toBeVisible();
  await meldung.getByRole("button", { name: "Weiter" }).click();

  await profilMitAbzeichen(page);
  await expect(page.getByTestId("erfahrung-stufe")).toHaveText("Stufe 2 von 10: Entwicklung");
  await expect(zaehler).toHaveText(/^1 von \d+$/);
  await expect(gitter.getByRole("img", { name: "Abzeichen: Erste Partie" })).toBeVisible();

  // Probe beenden: alles wieder echt, und keine Meldung mehr.
  await page.goto("/app/#aufgaben");
  await page.reload();
  await probe.locator("summary").click();
  await probe.getByRole("button", { name: "Probe beenden" }).click();
  await expect(probe.getByRole("button", { name: "Erste Partie: verdienen" })).toBeEnabled();
  await profilMitAbzeichen(page);
  await expect(page.getByTestId("erfahrung-stufe")).toHaveText("Stufe 1 von 10: Erster Zug");
  await expect(zaehler).toHaveText(/^0 von \d+$/);
  await expect(page.getByTestId("abzeichenmeldung")).toHaveCount(0);
});
