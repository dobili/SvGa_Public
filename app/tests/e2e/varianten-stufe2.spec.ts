/**
 * Oberflächentests für den Variationsbrowser, Stufe 2 (1.11.2026): Stift mit Nummern je Farbe,
 * Legende beschriften und aufklappen, Radierer mit Rückgängig, Baum mit Abzweig-Karten, Karte
 * (Mindmap) öffnen, verschieben, zoomen (Knöpfe und zwei Finger), Zug antippen, Liste als
 * Alternative, Export und Import von Pfeilen, Feldern, Nummerntexten und Legende als PGN.
 */
import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { oeffneAbbildung, starteImBrowser } from "./hilfen";

/** Tippt Felder des Brettes der Variante nacheinander an. */
async function tippe(seite: Page, ...felder: string[]): Promise<void> {
  const tasten = seite.locator(".bildschirm-variante .brett-tasten");
  for (const feld of felder) await tasten.locator(`button[aria-label^="${feld}"]`).click();
}

/** Öffnet Abb. 2.40 als Variante (Entwurf, nach 3. Sxe5). */
async function oeffneVariante(seite: Page): Promise<void> {
  await starteImBrowser(seite);
  await oeffneAbbildung(seite, "2.40", "2.40");
  await seite.getByTestId("gabelschalter").click();
  await expect(seite.getByTestId("variantenstatus")).toContainText("Entwurf");
}

/** Die Lage der Karte als Zahlen aus dem transform-Attribut. */
async function kartenlage(seite: Page): Promise<number[]> {
  const transform = (await seite.getByTestId("kartenlage").getAttribute("transform")) ?? "";
  return (transform.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
}

test("Stift: Pfeile und Rahmen mit Nummern je Farbe, Legende, Radierer, Neuladen", async ({
  page,
}) => {
  await oeffneVariante(page);
  await page.getByTestId("stiftschalter").click();
  await expect(page.getByTestId("stiftleiste")).toBeVisible();
  // Die blauen Fortsetzungspfeile treten zurück, solange der Stift an ist.
  await expect(page.getByTestId("fortsetzungspfeil")).toHaveCount(0);
  // Gold: Pfeil d8–h4, dann Rahmen um e5 (zweimal antippen).
  await tippe(page, "d8");
  await expect(page.getByTestId("stiftmeldung")).toContainText("Von d8");
  await tippe(page, "h4", "e5", "e5");
  await page.getByRole("radio", { name: "Rot" }).click();
  await tippe(page, "f6", "e4");
  await expect(page.getByTestId("variantenstatus")).toContainText("Gespeichert");
  const nummern = page.getByTestId("markennummer");
  await expect(nummern).toHaveCount(3);
  await expect(page.locator('[data-schluessel="G2"]')).toHaveCount(1);
  await expect(page.locator('[data-schluessel="R1"]')).toHaveCount(1);
  // Legende: je Farbe eine Zeile; Rot aufklappen und die Nummer beschriften.
  await expect(page.getByTestId("legende-gold")).toContainText("1 2");
  await page.getByLabel("Text zu Gold", { exact: true }).fill("Druck auf f2");
  await page.getByRole("button", { name: "Nummern von Rot" }).click();
  await page.getByLabel("Text zu Rot 1").fill("Sxe4 ist gierig");
  // Radierer und Rückgängig.
  await page.getByRole("button", { name: "Alle Markierungen dieser Stellung löschen" }).click();
  await expect(nummern).toHaveCount(0);
  await page.getByTestId("stiftleiste").getByRole("button", { name: "Rückgängig" }).click();
  await expect(nummern).toHaveCount(3);
  // Gleicher Pfeil noch einmal nimmt ihn weg; Gold 2 wird Gold 1.
  await page.getByRole("radio", { name: "Gold" }).click();
  await tippe(page, "d8", "h4");
  await expect(nummern).toHaveCount(2);
  await expect(page.locator('[data-schluessel="G2"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Fertig" }).click();
  // Ohne Stift: die Legende zeigt nur das Beschriftete, aufgeklappt.
  await expect(page.getByTestId("legende")).toContainText("Druck auf f2");
  await expect(page.getByTestId("legende")).toContainText("Sxe4 ist gierig");
  await expect(page.getByTestId("fortsetzungspfeil")).toHaveCount(2);

  // Neuladen: über die Liste öffnen, die Marken und Texte sind gespeichert.
  await page.reload();
  await page.getByRole("navigation").getByRole("button", { name: "Training" }).click();
  await page.getByTestId("kachel-varianten").getByRole("button").click();
  await page.getByTestId("variantenkarte").getByRole("button").click();
  await expect(page.getByTestId("markennummer")).toHaveCount(2);
  await expect(page.getByTestId("legende")).toContainText("Sxe4 ist gierig");
});

test("Baum: Abzweig-Karten mit Brett, Pfeilen und Knöpfen; Sprung in die Variante", async ({
  page,
}) => {
  await oeffneVariante(page);
  // Eigener Zug 3... De7 als dritte Fortsetzung.
  await tippe(page, "d8", "e7");
  await page.getByRole("button", { name: "Baum", exact: true }).click();
  const baum = page.getByTestId("abzweigbaum");
  const karten = baum.getByTestId("abzweigkarte");
  await expect(karten.first()).toContainText("nach 3. Sxe5");
  await expect(karten.first().getByTestId("fortsetzungspfeil")).toHaveCount(3);
  const knoepfe = karten.first().locator(".abzweigknopf");
  await expect(knoepfe).toHaveCount(3);
  await expect(knoepfe.nth(0)).toContainText("Hauptvariante");
  await expect(knoepfe.nth(2)).toContainText("eigene");
  await expect(knoepfe.nth(2)).toHaveAttribute("aria-current", "step");
  await knoepfe.nth(1).click();
  await expect(page.getByTestId("variantenzeile")).toContainText("Sxe4");
  await expect(knoepfe.nth(1)).toHaveAttribute("aria-current", "step");
  await baum.getByRole("button", { name: "Baum schließen" }).click();
  await expect(baum).toHaveCount(0);
});

test("Karte: öffnen, verschieben, zoomen, Zug antippen, Liste", async ({ page }) => {
  await oeffneVariante(page);
  await page.getByTestId("kartenknopf").click();
  await expect(page.getByTestId("variantenkarte")).toBeVisible();
  const knoten = page.getByTestId("kartenknoten");
  expect(await knoten.count()).toBeGreaterThan(10);
  await expect(page.locator(".kk-knoten.aktuell")).toContainText("Sxe5");
  // Verschieben mit der Maus.
  const flaeche = page.getByTestId("kartenflaeche");
  const rahmen = await flaeche.boundingBox();
  if (!rahmen) throw new Error("Fläche");
  const vorher = await kartenlage(page);
  await page.mouse.move(rahmen.x + 40, rahmen.y + rahmen.height - 20);
  await page.mouse.down();
  await page.mouse.move(rahmen.x + 160, rahmen.y + rahmen.height - 60, { steps: 6 });
  await page.mouse.up();
  const nachher = await kartenlage(page);
  expect(nachher[0]).toBeCloseTo((vorher[0] ?? 0) + 120, 0);
  // Zoomen mit den Knöpfen.
  await page.getByRole("button", { name: "Vergrößern" }).click();
  expect((await kartenlage(page))[2]).toBeCloseTo(1.25, 2);
  await page.getByRole("button", { name: "Alles zeigen" }).click();
  await page.getByRole("button", { name: "Zur Stellung" }).click();
  // Tastatur: Pfeiltaste verschiebt.
  await flaeche.focus();
  const vorTaste = await kartenlage(page);
  await page.keyboard.press("ArrowLeft");
  expect((await kartenlage(page))[0]).toBeCloseTo((vorTaste[0] ?? 0) + 60, 0);
  // Tipp auf einen Zug springt zurück in die Variante. Vorher alles zeigen, damit der Knoten
  // nicht unter den Knöpfen der Karte liegt (in CI mit anderer Fenstergröße so gesehen).
  await page.getByRole("button", { name: "Alles zeigen" }).click();
  const ziel = page.locator(".kk-knoten", { hasText: "3... Sxe4?!" });
  await expect(ziel).toBeInViewport();
  await ziel.click();
  await expect(page.getByTestId("variante")).toBeVisible();
  await expect(page.getByTestId("variantenstatus")).toContainText("Gespeichert");
  await expect(page.getByTestId("variantenzeile")).toContainText("Sxe4?!");
  // Liste als Alternative.
  await page.getByTestId("kartenknopf").click();
  await page.getByRole("button", { name: "Als Liste" }).click();
  const liste = page.getByTestId("kartenliste");
  await expect(liste.locator('[aria-current="step"]')).toContainText("Sxe4?!");
  await liste.getByRole("button", { name: "d6!", exact: true }).click();
  await expect(page.getByTestId("variantenzeile")).toContainText("d6!");
  // Zurück aus der Variante führt zur Abbildung, nicht zu einem zweiten Entwurf.
  await page.getByRole("button", { name: "Zurück" }).first().click();
  await expect(page.getByTestId("variante")).toHaveCount(0);
});

test("Karte: zwei Finger zoomen", async ({ page, browserName }) => {
  // Der Test erzeugt die Berührungen über eine CDP-Sitzung, die es nur in Chromium gibt.
  test.skip(browserName !== "chromium", "Berührungen über CDP gibt es nur in Chromium");
  await oeffneVariante(page);
  await page.getByTestId("kartenknopf").click();
  const rahmen = await page.getByTestId("kartenflaeche").boundingBox();
  if (!rahmen) throw new Error("Fläche");
  const mitte = { x: rahmen.x + rahmen.width / 2, y: rahmen.y + rahmen.height / 2 };
  const cdp = await page.context().newCDPSession(page);
  const finger = (abstand: number) => [
    { x: mitte.x - abstand, y: mitte.y, id: 1 },
    { x: mitte.x + abstand, y: mitte.y, id: 2 },
  ];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: finger(30) });
  for (const abstand of [40, 50, 60]) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: finger(abstand) });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  expect((await kartenlage(page))[2]).toBeCloseTo(2, 1);
});

test("PGN: Pfeile, Felder, Nummerntexte und Legende hin und zurück", async ({ page }) => {
  await oeffneVariante(page);
  await page.getByTestId("stiftschalter").click();
  await tippe(page, "d8", "h4", "e5", "e5");
  await page.getByLabel("Text zu Gold", { exact: true }).fill("Druck");
  await page.getByRole("button", { name: "Nummern von Gold" }).click();
  await page.getByLabel("Text zu Gold 2").fill("Springer im Zentrum");
  await page.getByRole("button", { name: "Fertig" }).click();
  await page.getByTestId("variantentitel").click();
  const herunterladen = page.waitForEvent("download");
  await page.getByRole("button", { name: "Als PGN-Datei sichern" }).click();
  const pgn = await readFile(await (await herunterladen).path(), "utf8");
  expect(pgn).toContain("[%csl Ye5]");
  expect(pgn).toContain("[%cal Yd8h4]");
  expect(pgn).toContain("[%svga Gd8h4,Ge5]");
  expect(pgn).toContain("Gold 2: Springer im Zentrum");
  expect(pgn).toContain("Legende Gold: Druck");
  await page.keyboard.press("Escape");

  // Einlesen einer Lichess-PGN: Grün und Gelb, Pfeil und Feld.
  await page.getByRole("navigation").getByRole("button", { name: "Training" }).click();
  await page.getByTestId("kachel-varianten").getByRole("button").click();
  await page.getByRole("button", { name: "PGN", exact: true }).click();
  await page.getByLabel("PGN oder FEN").fill("1. e4 { [%csl Gd5][%cal Ye2e4,Rd1h5] } e5 *");
  await page.getByRole("button", { name: "Einlesen" }).click();
  await page.getByRole("button", { name: "Einen Halbzug vor" }).click();
  await expect(page.getByTestId("markennummer")).toHaveCount(3);
  await expect(page.getByTestId("legende-gruen")).toBeVisible();
  await expect(page.getByTestId("legende-gold")).toBeVisible();
  await expect(page.getByTestId("legende-rot")).toBeVisible();
  // Die eigene PGN kommt mit Texten zurück.
  await page.getByRole("button", { name: "Zurück" }).first().click();
  await page.getByRole("button", { name: "PGN", exact: true }).click();
  await page.getByLabel("PGN oder FEN").fill(pgn);
  await page.getByRole("button", { name: "Einlesen" }).click();
  // Die Marken liegen nach 3. Sxe5, dem fünften Halbzug.
  for (let i = 0; i < 5; i += 1)
    await page.getByRole("button", { name: "Einen Halbzug vor" }).click();
  await expect(page.getByTestId("legende")).toContainText("Springer im Zentrum");
  await expect(page.getByTestId("legende")).toContainText("Druck");
});
