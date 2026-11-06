/**
 * Oberflächentest der Engine-Folgen in der Zugliste der ausgewerteten Partie (Fehlermeldung des
 * Autors, 6.11.2026: keine Verzweigung oben, kein Weg zurück zur Partie, Pfeile und Brett passten
 * nicht zusammen). Eingespielt wird die Opernpartie gegen Derya (auswertungpartie.ts): Nach
 * 8. Sc3? war 8. Dxb7 besser; die Bestrafung ist 8... c6.
 * Geprüft wird: Beide Zweige stehen hinter 8. Sc3 in der Zugliste, die Wahl der Linie zeigt den
 * Zweig am Brett und markiert seinen Zug (nicht mehr 8. Sc3), „Zurück“ und Pfeil links gehen vom
 * ersten Zug des Zweigs an den Abzweig, „Zurück zur Partie“ und „Partie“ führen zu 8. Sc3.
 */
import { expect, test, type Page } from "@playwright/test";
import { oeffnePartie } from "./auswertungpartie";
import { starteImBrowser } from "./hilfen";

/** Der markierte Zug der Zugliste (Partie oder Zweig). */
function markiert(page: Page) {
  return page.getByTestId("partiezuege").locator('[aria-current="step"]');
}

/** Das Feld b7 am Brett: Bauer in der Partie, Dame nach 8. Dxb7. */
function feldB7(page: Page) {
  return page.getByRole("button", { name: /^b7, / });
}

test("Engine-Folgen als Zweige in der Zugliste, Navigation durch die gewählte Linie", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffnePartie(page, "dunkel");
  const zuege = page.getByTestId("partiezuege");
  await zuege.getByRole("button", { name: /^8\. Sc3, / }).click();
  await expect(markiert(page)).toHaveText(/8\. Sc3/);
  // Beide Zweige stehen hinter dem Fehler, dazu die Wahl der Linie.
  await expect(page.getByTestId("zugvariante-besser")).toContainText("8. Dxb7");
  await expect(page.getByTestId("zugvariante-strafe")).toContainText("8... c6");
  await expect(page.getByTestId("linie-partie")).toHaveAttribute("aria-pressed", "true");
  await expect(feldB7(page)).toHaveAccessibleName(/Bauer/);

  // „Besserer Zug“: Brett und markierter Zug passen zusammen, Vor ist am Ende des Zweigs gesperrt.
  await page.getByTestId("linie-besser").click();
  await expect(markiert(page)).toHaveText("8. Dxb7");
  await expect(feldB7(page)).toHaveAccessibleName(/Dame/);
  await expect(page.getByTestId("zweigpfad")).toContainText("Zurück zur Partie");
  await expect(page.getByRole("button", { name: "Einen Halbzug vor" })).toBeDisabled();
  // „Zurück“ am ersten Zug des Zweigs: an den Abzweig, die Stellung vor 8. Sc3 (nach 7... De7).
  await page.getByRole("button", { name: "Einen Halbzug zurück" }).click();
  await expect(markiert(page)).toHaveText(/7\.\.\. De7|De7/);
  await expect(feldB7(page)).toHaveAccessibleName(/Bauer/);
  await expect(page.getByTestId("zweigpfad")).toHaveCount(0);

  // „Bestrafung“ und Pfeil links: zurück zu 8. Sc3 in der Partie.
  await zuege.getByRole("button", { name: /^8\. Sc3, / }).click();
  await page.getByTestId("linie-strafe").click();
  await expect(markiert(page)).toHaveText("8... c6");
  await expect(page.getByTestId("zugvariante-strafe")).toHaveClass(/gewaehlt/);
  await page.locator("body").press("ArrowLeft");
  await expect(markiert(page)).toHaveText(/8\. Sc3/);
  await expect(page.getByTestId("linie-partie")).toHaveAttribute("aria-pressed", "true");

  // Ein Zug im Zweig antippen und „Zurück zur Partie“.
  await page.getByTestId("zugvariante-besser").getByRole("button", { name: "8. Dxb7" }).click();
  await expect(markiert(page)).toHaveText("8. Dxb7");
  await page.getByTestId("zweig-zur-partie").click();
  await expect(markiert(page)).toHaveText(/8\. Sc3/);
  await expect(feldB7(page)).toHaveAccessibleName(/Bauer/);
  // Pfeil rechts geht in der Partie weiter (8... c6 wurde gespielt).
  await page.locator("body").press("ArrowRight");
  await expect(markiert(page)).toHaveText(/c6/);
});
