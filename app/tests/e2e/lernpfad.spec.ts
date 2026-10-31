/**
 * Oberflächentest „Dein Weg durchs Buch“ (Gamifizierung P2): Knopf über der Kapitelliste und im
 * Profil, 13 Stationen mit Orden, Figur an der aktuellen Station, Satz zum Rest, Station füllt sich
 * nach dem Abhaken, Tipp auf eine Station öffnet das Kapitel. Bildschirmfoto in Handygröße.
 */
import { expect, test } from "@playwright/test";
import { oeffneProfil, starteImBrowser } from "./hilfen";

test("Lernpfad: Stationen, Figur, Satz, Abhaken füllt Station 0, Tipp öffnet das Kapitel", async ({
  page,
}) => {
  await starteImBrowser(page);
  await page.getByTestId("lernpfad-knopf-buch").click();
  await expect(page.getByRole("heading", { name: "Dein Weg durchs Buch" })).toBeVisible();
  await expect(page.locator(".lernpfad-station")).toHaveCount(13);
  await expect(page.locator(".lernpfad-orden")).toHaveCount(5);
  await expect(page.getByTestId("lernpfad-figur")).toHaveAttribute("data-kapitel", "0");
  const hinweis = page.getByTestId("lernpfad-hinweis");
  await expect(hinweis).toContainText("bis zum Ende von Kapitel 0.");
  await expect(hinweis).toContainText("nur noch Kapitel 1 bis zum Orden „Teil Grundlagen“");
  // Kapitel 0 ganz abhaken: Die Station zeigt alle Abbildungen, es fehlen nur die Übungen.
  await page.getByRole("button", { name: "Zurück" }).click();
  await page.getByRole("button", { name: /Dein Einstieg ins Schachbuch/ }).click();
  await page.getByRole("button", { name: "Alle abhaken" }).click();
  await page.getByRole("button", { name: "Ja, alle abhaken" }).click();
  await page.goBack();
  await page.getByTestId("lernpfad-knopf-buch").click();
  await expect(page.getByTestId("lernpfad-station-0")).toHaveAccessibleName(
    /Kapitel 0: .*, 28 von 31 geschafft/,
  );
  await expect(hinweis).toContainText("Noch 3 Übungen bis zum Ende von Kapitel 0.");
  await page.screenshot({ path: "test-results/bilder/lernpfad.png" });
  await page.getByTestId("lernpfad-station-1").click();
  await expect(page.getByRole("heading", { name: "Kapitel 1", level: 1 })).toBeVisible();
  // Auch aus dem Profil erreichbar.
  await oeffneProfil(page);
  await page.getByTestId("lernpfad-knopf-profil").click();
  await expect(page.getByRole("heading", { name: "Dein Weg durchs Buch" })).toBeVisible();
});
