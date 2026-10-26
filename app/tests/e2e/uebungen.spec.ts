/**
 * Oberflächentests der Übungen (AP 13): im Kapitel öffnen, auf dem Brett lösen, Hinweise,
 * Lösung zeigen, Denkaufgabe mit Selbsteinschätzung, fällige Wiederholungen im Training.
 */
import { expect, test, type Page } from "@playwright/test";
import { starteImBrowser } from "./hilfen";

async function oeffneKapitelUebungen(page: Page, kapitel: number): Promise<void> {
  await page
    .getByRole("button", { name: new RegExp(`Kapitel ${kapitel} ·`) })
    .first()
    .click();
  await expect(page.getByTestId("kapitel-uebungen")).toBeVisible();
}

const feld = (page: Page, name: string) =>
  page.getByRole("button", { name: new RegExp(`^${name}(,|$)`) });

test("Übung 1.40 auf dem Brett lösen: falscher Zug, Hinweise, richtiger Zug, Erklärung", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneKapitelUebungen(page, 1);
  await page
    .getByTestId("kapitel-uebungen")
    .getByRole("button", { name: /Abb\. 1\.40/ })
    .click();
  const uebung = page.getByTestId("uebung");
  await expect(uebung).toContainText("Die Aufgabe steht im Buch");
  // Erst selbst denken (locker): Hinweise erst nach „Ich habe nachgedacht“.
  await expect(uebung.getByRole("button", { name: "Hinweis 1" })).toHaveCount(0);
  await uebung.getByRole("button", { name: "Ich habe nachgedacht" }).click();
  await uebung.getByRole("button", { name: "Hinweis 1" }).click();
  await expect(page.getByTestId("hinweis-motiv")).toContainText("Motiv:");
  // Falscher Zug: der Springer nach a7 statt nach c7.
  await feld(page, "b5").click();
  await feld(page, "a7").click();
  await expect(uebung).toContainText("nicht der Zug des Buches");
  await feld(page, "b5").click();
  await feld(page, "c7").click();
  await expect(uebung).toContainText("Richtig!");
  await expect(page.getByTestId("uebung-erklaerung")).toContainText("Sc7+");
  // Engine-Prüfung der Übungen (Fable): 1. Sc7+ ist der einzige gute Zug.
  await expect(page.getByTestId("einziger-zug")).toBeVisible();
  await page.screenshot({ path: "test-results/bilder/uebung-1.40.png", fullPage: true });
  // Mit Hinweis gelöst: Die Karte bleibt in Kasten 1, also morgen fällig, heute noch nicht.
  await uebung
    .getByRole("button", { name: /Nächste Übung|Fertig/ })
    .first()
    .click();
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Training" })
    .click();
  await expect(page.getByTestId("faellig")).toContainText("Als Nächstes am");
});

test("Lösung zeigen zählt als gelöst; Denkaufgabe mit Selbsteinschätzung", async ({ page }) => {
  await starteImBrowser(page);
  await oeffneKapitelUebungen(page, 1);
  await page
    .getByTestId("kapitel-uebungen")
    .getByRole("button", { name: /Abb\. 1\.41/ })
    .click();
  const uebung = page.getByTestId("uebung");
  await uebung.getByRole("button", { name: "Ich habe nachgedacht" }).click();
  await uebung.getByRole("button", { name: "Lösung zeigen" }).click();
  await expect(uebung).toContainText("Die Lösung des Buches steht auf dem Brett");
  await expect(page.getByTestId("uebung-erklaerung")).toBeVisible();
  // Q6 (Autor): Auch nach „Lösung zeigen“ zählt die Übung als gelöst.
  await page.getByRole("button", { name: "Zurück" }).click();
  await expect(
    page.getByTestId("kapitel-uebungen").getByRole("button", { name: /Abb\. 1\.41/ }),
  ).toContainText("gelöst");
  // Kapitel 0: „Notation schreiben“ ist eine Denkaufgabe.
  await page
    .getByRole("navigation", { name: "Hauptbereiche" })
    .getByRole("button", { name: "Buch" })
    .click();
  await oeffneKapitelUebungen(page, 0);
  await page
    .getByTestId("kapitel-uebungen")
    .getByRole("button", { name: /Abb\. 0\.27/ })
    .click();
  await expect(uebung).toContainText("im Kopf oder auf Papier");
  await uebung.getByRole("button", { name: "Ich habe nachgedacht" }).click();
  await expect(page.getByTestId("uebung-erklaerung")).toBeVisible();
  await uebung.getByRole("button", { name: "Teilweise" }).click();
  await expect(uebung).toContainText("Gespeichert");
});

test("T1: ein vom Buch gestützter, gleich guter Zug löst Übung 6 (Abb. 1.42) ebenfalls", async ({
  page,
}) => {
  await starteImBrowser(page);
  await oeffneKapitelUebungen(page, 1);
  await page
    .getByTestId("kapitel-uebungen")
    .getByRole("button", { name: /Abb\. 1\.42/ })
    .click();
  const uebung = page.getByTestId("uebung");
  await expect(uebung).toBeVisible();
  // Buch: 4... Sf6, „ein Entwicklungszug, der selbst etwas angreift“; 4... Lb4+ ist so einer.
  await feld(page, "f8").click();
  await feld(page, "b4").click();
  await expect(uebung).toContainText("Auch dieser Zug ist gleich gut");
});
